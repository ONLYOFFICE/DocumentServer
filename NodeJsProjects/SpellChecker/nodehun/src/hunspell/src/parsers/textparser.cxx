#include <cstdlib>
#include <cstring>
#include <cstdio>
#include <ctype.h>

#include "../hunspell/csutil.hxx"
#include "textparser.hxx"

#ifndef W32
using namespace std;
#endif

// ISO-8859-1 HTML character entities

static const char * LATIN1[] = {
	"&Agrave;",
	"&Atilde;",
	"&Aring;",
	"&AElig;",
	"&Egrave;",
	"&Ecirc;",
	"&Igrave;",
	"&Iuml;",
	"&ETH;",
	"&Ntilde;",
	"&Ograve;",
	"&Oslash;",
	"&Ugrave;",
	"&THORN;",
	"&agrave;",
	"&atilde;",
	"&aring;",
	"&aelig;",
	"&egrave;",
	"&ecirc;",
	"&igrave;",
	"&iuml;",
	"&eth;",
	"&ntilde;",
	"&ograve;",
	"&oslash;",
	"&ugrave;",
	"&thorn;",
	"&yuml;"
};

#define LATIN1_LEN (sizeof(LATIN1) / sizeof(char *))

TextParser::TextParser() {
	init((char *) NULL);
}

TextParser::TextParser(const char * wordchars)
{
	init(wordchars);
}

TextParser::TextParser(unsigned short * wordchars, int len)
{
	init(wordchars, len);
}

TextParser::~TextParser() 
{
}

int TextParser::is_wordchar(char * w)
{
        if (*w == '\0') return 0;
	if (utf8) {
                w_char wc;
                unsigned short idx;
		u8_u16(&wc, 1, w);
                idx = (wc.h << 8) + wc.l;
                return (unicodeisalpha(idx) || (wordchars_utf16 && flag_bsearch(wordchars_utf16, *((unsigned short *) &wc), wclen)));
        } else {
		return wordcharacters[(*w + 256) % 256];
	}
}

const char * TextParser::get_latin1(char * s)
{
	if (s[0] == '&') {
		unsigned int i = 0;
		while ((i < LATIN1_LEN) && 
			strncmp(LATIN1[i], s, strlen(LATIN1[i]))) i++;
		if (i != LATIN1_LEN) return LATIN1[i];
	}
	return NULL;
}

void TextParser::init(const char * wordchars)
{
	for (int i = 0; i < MAXPREVLINE; i++) {
		line[i][0] = '\0';
	}
	actual = 0;
	head = 0;
	token = 0;
	state = 0;
        utf8 = 0;
        checkurl = 0;
	unsigned int j;
	for (j = 0; j < 256; j++) {
		wordcharacters[j] = 0;
	}
        if (!wordchars) wordchars = "qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM";
	for (j = 0; j < strlen(wordchars); j++) {
		wordcharacters[(wordchars[j] + 256) % 256] = 1;
	}
}

void TextParser::init(unsigned short * wc, int len)
{
	for (int i = 0; i < MAXPREVLINE; i++) {
		line[i][0] = '\0';
	}
	actual = 0;
	head = 0;
	token = 0;
	state = 0;
	utf8 = 1;
	checkurl = 0;
        wordchars_utf16 = wc;
        wclen = len;
}

int TextParser::next_char(char * line, int * pos) {
        if (*(line + *pos) == '\0') return 1;
	if (utf8) {
            if (*(line + *pos) >> 7) {
                // jump to next UTF-8 character
                for((*pos)++; (*(line + *pos) & 0xc0) == 0x80; (*pos)++);
            } else {
                (*pos)++;
            }
        } else (*pos)++;
        return 0;
}

void TextParser::put_line(char * word)
{
	actual = (actual + 1) % MAXPREVLINE;
	strcpy(line[actual], word);
	token = 0;
	head = 0;
	check_urls();
}

char * TextParser::get_prevline(int n)
{
	return mystrdup(line[(actual + MAXPREVLINE - n) % MAXPREVLINE]);
}

char * TextParser::get_line()
{
	return get_prevline(0);
}

char * TextParser::next_token()
{
	const char * latin1;
	
	for (;;) {
		switch (state)
		{
		case 0: // non word chars
			if (is_wordchar(line[actual] + head)) {
				state = 1;
				token = head;
			} else if ((latin1 = get_latin1(line[actual] + head))) {
				state = 1;
				token = head;
				head += strlen(latin1);
			}
			break;
		case 1: // wordchar
			if ((latin1 = get_latin1(line[actual] + head))) {
				head += strlen(latin1);
			} else if (! is_wordchar(line[actual] + head)) {
				state = 0;
				char * t = alloc_token(token, &head);
				if (t) return t;
			}
			break;
		}
                if (next_char(line[actual], &head)) return NULL;
	}
}

int TextParser::get_tokenpos()
{
	return token;
}

int TextParser::change_token(const char * word)
{
	if (word) {
		char * r = mystrdup(line[actual] + head);
		strcpy(line[actual] + token, word);
		strcat(line[actual], r);
		head = token;
		free(r);
		return 1;
	}
	return 0;
}

void TextParser::check_urls()
{
	int url_state = 0;
	int url_head = 0;
	int url_token = 0;
	int url = 0;
	for (;;) {
		switch (url_state)
		{
		case 0: // non word chars
			if (is_wordchar(line[actual] + url_head)) {
				url_state = 1;
				url_token = url_head;
			// Unix path
			} else if (*(line[actual] + url_head) == '/') {
				url_state = 1;
				url_token = url_head;
				url = 1;
			}
			break;
		case 1: // wordchar
			char ch = *(line[actual] + url_head);
 			// e-mail address
			if ((ch == '@') ||
			    // MS-DOS, Windows path
			    (strncmp(line[actual] + url_head, ":\\", 2) == 0) ||
			    // URL
			    (strncmp(line[actual] + url_head, "://", 3) == 0)) {
				url = 1;
			} else if (! (is_wordchar(line[actual] + url_head) ||
			  (ch == '-') || (ch == '_') || (ch == '\\') ||
			  (ch == '.') || (ch == ':') || (ch == '/') ||
			  (ch == '~') || (ch == '%') || (ch == '*') ||
			  (ch == '$') || (ch == '[') || (ch == ']') ||
			  (ch == '?') || (ch == '!') ||
			  ((ch >= '0') && (ch <= '9')))) {
				url_state = 0;
				if (url == 1) {
					for (int i = url_token; i < url_head; i++) {
						*(urlline + i) = 1;
					}
				}
				url = 0;
			}
			break;
		}
		*(urlline + url_head) = 0;
                if (next_char(line[actual], &url_head)) return;
	}
}

int TextParser::get_url(int token_pos, int * head)
{
	for (int i = *head; urlline[i] && *(line[actual]+i); i++, (*head)++);
	return checkurl ? 0 : urlline[token_pos];
}

void TextParser::set_url_checking(int check)
{
	checkurl = check;
}


char * TextParser::alloc_token(int token, int * head)
{
    if (get_url(token, head)) return NULL;
    char * t = (char *) malloc(*head - token + 1);
    if (t) {
        t[*head - token] = '\0';
        strncpy(t, line[actual] + token, *head - token);
    	// remove colon for Finnish and Swedish language
        if (t[*head - token - 1] == ':') {
    	    t[*head - token - 1] = '\0';
    	    if (!t[0]) {
    		free(t);
    		return NULL;
    	    }
    	}
        return t;
    }
    fprintf(stderr,"Error - Insufficient Memory\n");
    return NULL;
}
