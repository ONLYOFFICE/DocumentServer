// glibc < 3.0 (for mkstemp)
#ifndef __USE_MISC
#define __USE_MISC
#endif

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "config.h"
#include "hunspell.hxx"
#include "csutil.hxx"

#ifndef HUNSPELL_EXTRA
#define suggest_auto suggest
#endif

#define HUNSPELL_VERSION VERSION
#define INPUTLEN 50

#define HUNSPELL_PIPE_HEADING "@(#) International Ispell Version 3.2.06 (but really Hunspell "VERSION")\n"
#define HUNSPELL_HEADING "Hunspell "

//for debugging only
//#define LOG

#define DEFAULTDICNAME "default"

#ifdef WIN32

#define LIBDIR "C:\\Hunspell\\"
#define USEROOODIR "Application Data\\OpenOffice.org 2\\user\\wordbook"
#define OOODIR \
    "C:\\Program files\\OpenOffice.org 2.4\\share\\dict\\ooo\\;" \
    "C:\\Program files\\OpenOffice.org 2.3\\share\\dict\\ooo\\;" \
    "C:\\Program files\\OpenOffice.org 2.2\\share\\dict\\ooo\\;" \
    "C:\\Program files\\OpenOffice.org 2.1\\share\\dict\\ooo\\;" \
    "C:\\Program files\\OpenOffice.org 2.0\\share\\dict\\ooo\\"
#define HOME "%USERPROFILE%\\"
#define DICBASENAME "hunspell_"
#define LOGFILE "C:\\Hunspell\\log"
#define DIRSEPCH '\\'
#define DIRSEP "\\"
#define PATHSEP ";"

#include "textparser.hxx"
#include "htmlparser.hxx"
#include "latexparser.hxx"
#include "manparser.hxx"
#include "firstparser.hxx"

#else

// Not Windows
#include <sys/types.h>
#include <dirent.h>
#include <unistd.h>
#include "textparser.hxx"
#include "htmlparser.hxx"
#include "latexparser.hxx"
#include "manparser.hxx"
#include "firstparser.hxx"

#define LIBDIR \
    "/usr/share/hunspell:" \
    "/usr/share/myspell:" \
    "/usr/share/myspell/dicts:" \
    "/Library/Spelling"
#define USEROOODIR \
    ".openoffice.org/3/user/wordbook:" \
    ".openoffice.org2/user/wordbook:" \
    ".openoffice.org2.0/user/wordbook:" \
    "Library/Spelling"
#define OOODIR \
    "/opt/openoffice.org/basis3.0/share/dict/ooo:" \
    "/usr/lib/openoffice.org/basis3.0/share/dict/ooo:" \
    "/opt/openoffice.org2.4/share/dict/ooo:" \
    "/usr/lib/openoffice.org2.4/share/dict/ooo:" \
    "/opt/openoffice.org2.3/share/dict/ooo:" \
    "/usr/lib/openoffice.org2.3/share/dict/ooo:" \
    "/opt/openoffice.org2.2/share/dict/ooo:" \
    "/usr/lib/openoffice.org2.2/share/dict/ooo:" \
    "/opt/openoffice.org2.1/share/dict/ooo:" \
    "/usr/lib/openoffice.org2.1/share/dict/ooo:" \
    "/opt/openoffice.org2.0/share/dict/ooo:" \
    "/usr/lib/openoffice.org2.0/share/dict/ooo"
#define HOME getenv("HOME")
#define DICBASENAME ".hunspell_"
#define LOGFILE "/tmp/hunspell.log"
#define DIRSEPCH '/'
#define DIRSEP "/"
#define PATHSEP ":"
#endif

#ifdef HAVE_ICONV
#include <iconv.h>
char text_conv[MAXLNLEN];
#endif

#if ENABLE_NLS
#  ifdef HAVE_LOCALE_H
#    include <locale.h>
#    ifdef HAVE_LANGINFO_CODESET
#      include <langinfo.h>
#    endif
#  endif
#  ifdef HAVE_LIBINTL_H
#    include <libintl.h>
#  else
#    include <../../intl/libintl.h>
#  endif
#else
#  define gettext
#  undef HAVE_LOCALE_H
#  undef HAVE_LIBINTL_H
#endif

#ifdef HAVE_CURSES_H
#ifdef HAVE_NCURSESW_H
#include <ncurses.h>
#else
#include <curses.h>
#endif
#endif

#ifdef HAVE_READLINE
#include <readline/readline.h>
#else
#define readline scanline
#endif

#define TEMPNAME "hunSPELL.bak"

extern char * mystrdup(const char * s);

// file formats:

enum { FMT_TEXT, FMT_LATEX, FMT_HTML, FMT_MAN, FMT_FIRST };

struct wordlist {
    char * word;
    wordlist * next;
};

// global variables

char * wordchars = NULL;
char * dicpath = NULL;
int wordchars_len;
unsigned short * wordchars_utf16 = NULL;
int wordchars_utf16_free = 0;
int wordchars_utf16_len;
char * dicname = NULL;
char * privdicname = NULL;
const char * currentfilename = NULL;

int modified;   // modified file sign
enum { NORMAL,
       BADWORD,    // print only bad words
       WORDFILTER, // print only bad words from 1 word/line input
       BADLINE,    // print only lines with bad words
       STEM,       // stem input words
       ANALYZE,    // analyze input words
       PIPE,       // print only stars for LyX compatibility
       AUTO0,      // search typical error (based on SuggestMgr::suggest_auto())
       AUTO,       // automatic spelling to standard output
       AUTO2,      // automatic spelling to standard output with sed log
       AUTO3   };  // automatic spelling to standard output with gcc error format
int filter_mode = NORMAL;
int printgood = 0; // print only good words and lines
int showpath = 0;  // show detected path of the dictionary
int checkurl = 0;  // check URLs and mail addresses
int warn = 0;      // warn potential mistakes (dictionary words with WARN flags)
const char * ui_enc = NULL;  // locale character encoding (default for I/O)
const char * io_enc = NULL;  // I/O character encoding

#define DMAX 10              // maximal count of loaded dictionaries

const char * dic_enc[DMAX];  // dictionary encoding
char * path = NULL;
int dmax = 0;                // dictionary count

// functions

#ifdef HAVE_ICONV
static const char* fix_encoding_name(const char *enc)
{
    if (strcmp(enc, "TIS620-2533") == 0)
        enc = "TIS620";
    return enc;
}
#endif

/* change character encoding */
char * chenc(char * st, const char * enc1, const char * enc2) {
    char * out = st;
#ifdef HAVE_ICONV
    if (enc1 && enc2 && strcmp(enc1, enc2) != 0) {

	size_t c1 = strlen(st) + 1;
	size_t c2 = MAXLNLEN;
	char * source = st;
	char * dest = text_conv;
	iconv_t conv = iconv_open(fix_encoding_name(enc2), fix_encoding_name(enc1));
        if (conv == (iconv_t) -1) {
	    fprintf(stderr, gettext("error - iconv_open: %s -> %s\n"), enc2, enc1);
	} else {	
	    size_t res = iconv(conv, (ICONV_CONST char **) &source, &c1, &dest, &c2);
	    iconv_close(conv);
	    if (res != (size_t) -1) out = text_conv;
	}
    }
#endif
    return out;
}

TextParser * get_parser(int format, char * extension, Hunspell * pMS) {
    TextParser * p = NULL;
    int io_utf8 = 0;
    char * denc = pMS->get_dic_encoding();
#ifdef HAVE_ICONV
    initialize_utf_tbl(); // also need for 8-bit tokenization
    if (io_enc) {
	if ((strcmp(io_enc, "UTF-8") == 0) ||
	    (strcmp(io_enc, "utf-8") == 0) ||
	    (strcmp(io_enc, "UTF8") == 0) ||
	    (strcmp(io_enc, "utf8") == 0)) {
		io_utf8 = 1;
		io_enc = "UTF-8";
	}
    } else if (ui_enc) {
	io_enc = ui_enc;
	if (strcmp(ui_enc, "UTF-8") == 0) io_utf8 = 1;	
    } else {
	io_enc = denc;
	if (strcmp(denc, "UTF-8") == 0) io_utf8 = 1;
    }

    if (io_utf8) {
    	wordchars_utf16 = pMS->get_wordchars_utf16(&wordchars_utf16_len);
	if ((strcmp(denc, "UTF-8") != 0) && pMS->get_wordchars()) {
	    char * wchars = (char *) pMS->get_wordchars();
	    int wlen = strlen(wchars);
	    size_t c1 = wlen;
	    size_t c2 = MAXLNLEN;
	    char * dest = text_conv;
	    iconv_t conv = iconv_open("UTF-8", fix_encoding_name(denc));
	    if (conv == (iconv_t) -1) {
	        fprintf(stderr, gettext("error - iconv_open: UTF-8 -> %s\n"), denc);
	        wordchars_utf16 = NULL;
	        wordchars_utf16_len = 0;
	    } else {
	        iconv(conv, (ICONV_CONST char **) &wchars, &c1, &dest, &c2);
	        iconv_close(conv);
	        wordchars_utf16 = (unsigned short *) malloc(sizeof(unsigned short) * wlen);
	        int n = u8_u16((w_char *) wordchars_utf16, wlen, text_conv);
	        if (n > 0) flag_qsort(wordchars_utf16, 0, n);
	        wordchars_utf16_len = n;
	        wordchars_utf16_free = 1;
	    }
	}
    } else {
	// 8-bit input encoding
	// detect letters by unicodeisalpha() for tokenization
	char letters[MAXLNLEN];
	char * pletters = letters;
	char ch[2];
	char u8[10];
	*pletters = '\0';
	iconv_t conv = iconv_open("UTF-8", fix_encoding_name(io_enc));
        if (conv == (iconv_t) -1) {
	    fprintf(stderr, gettext("error - iconv_open: UTF-8 -> %s\n"), io_enc);
	} else {
	    for (int i = 32; i < 256; i++) {
	        size_t c1 = 1;
	        size_t c2 = 10;
	        char * dest = u8;
	        u8[0] = '\0';
	        char * ch8bit = ch;	
	        ch[0] = (char) i;	    
	        ch[1] = '\0';
	        size_t res = iconv(conv, (ICONV_CONST char **) &ch8bit, &c1, &dest, &c2);
	        if (res != (size_t) -1) {
		    unsigned short idx;
		    w_char w;
		    w.l = 0;
		    w.h = 0;
		    u8_u16(&w, 1, u8);
		    idx = (w.h << 8) + w.l;
		    if (unicodeisalpha(idx)) {
		        *pletters = (char) i;
		        pletters++;
		    }
	        }
	    }
	    iconv_close(conv);
	}
        *pletters = '\0';

	// UTF-8 wordchars -> 8 bit wordchars
    	int len = 0;
    	char * wchars = (char *) pMS->get_wordchars();
	if (wchars) {
	    if ((strcmp(denc, "UTF-8")==0)) {
    		pMS->get_wordchars_utf16(&len);
	    } else {
		len = strlen(wchars);
	    }
	    char * dest = letters + strlen(letters); // append wordchars
	    size_t c1 = len + 1;
	    size_t c2 = len + 1;
	    iconv_t conv = iconv_open(fix_encoding_name(io_enc), fix_encoding_name(denc));
	    if (conv == (iconv_t) -1) {
	        fprintf(stderr, gettext("error - iconv_open: %s -> %s\n"), io_enc, denc);
	    } else {
	        iconv(conv, (ICONV_CONST char **) &wchars, &c1, &dest, &c2);
	        iconv_close(conv);
	        *dest = '\0';
	    }
	}
	if (*letters) wordchars = mystrdup(letters);
    }
#else
    if (strcmp(denc, "UTF-8") == 0) {
        wordchars_utf16 = pMS->get_wordchars_utf16(&wordchars_utf16_len);
	io_utf8 = 1;
    } else {
	char * casechars = get_casechars(denc);
	wordchars = (char *) pMS->get_wordchars();
	if (casechars && wordchars) {
	    casechars = (char *) realloc(casechars, strlen(casechars) + strlen(wordchars) + 1);
	    strcat(casechars, wordchars);
	}
	wordchars = casechars;
    }
    io_enc = denc;
#endif

    if (io_utf8) {
        switch (format) {	
        case FMT_LATEX: p = new LaTeXParser(wordchars_utf16, wordchars_utf16_len); break;
        case FMT_HTML: p = new HTMLParser(wordchars_utf16, wordchars_utf16_len); break;
        case FMT_MAN: p = new ManParser(wordchars_utf16, wordchars_utf16_len); break;
        case FMT_FIRST: p = new FirstParser(wordchars);
        }
    } else {
        switch (format) {	
        case FMT_LATEX: p = new LaTeXParser(wordchars); break;
        case FMT_HTML: p = new HTMLParser(wordchars); break;
        case FMT_MAN: p = new ManParser(wordchars); break;
        case FMT_FIRST: p = new FirstParser(wordchars);
        }
    }

    if ((!p) && (extension)) {
	if ((strcmp(extension, "html") == 0) ||
    	    (strcmp(extension, "htm") == 0) ||
	    (strcmp(extension, "xml") == 0)) {
                if (io_utf8) {
                    p = new HTMLParser(wordchars_utf16, wordchars_utf16_len);
                } else {
		    p = new HTMLParser(wordchars);
                }
	} else if (((extension[0] > '0') && (extension[0] <= '9'))) {
                if (io_utf8) {
	            p = new ManParser(wordchars_utf16, wordchars_utf16_len);
                } else {
	            p = new ManParser(wordchars);
                }
	} else if ((strcmp(extension, "tex") == 0)) {
                if (io_utf8) {
                    p = new LaTeXParser(wordchars_utf16, wordchars_utf16_len);
                } else {
	            p = new LaTeXParser(wordchars);
                }
	}
    }
    if (!p) {
        if (io_utf8) {
            p = new TextParser(wordchars_utf16, wordchars_utf16_len);
        } else {
            p = new TextParser(wordchars);    
        }
    }
    p->set_url_checking(checkurl);
    return p;
}


#ifdef LOG
void log(char * message)
{
	FILE *f = fopen(LOGFILE,"a");
	if (f) {
    	    fprintf(f,"%s\n",message);
    	    fclose(f);
	} else {
	    fprintf(stderr,"Logfile...");
	}
}
#endif

int putdic(char * word, Hunspell * pMS)
{
    char * w;

    word = chenc(word, ui_enc, dic_enc[0]);
    
    if (((w = strstr(word + 1, "/")) == NULL)) {
        if (*word == '*') return pMS->remove(word + 1);
	else return pMS->add(word);
    } else {
	char c;
	int ret;
	c = *w;
	*w = '\0';
	if (*(w+1) == '/') {
	    ret = pMS->add_with_affix(word, w + 2); // word//pattern (back comp.)
	} else {
	    ret = pMS->add_with_affix(word, w + 1); // word/pattern
	}
	*w = c;
	return ret;
    }
}

void load_privdic(char * filename, Hunspell * pMS) 
{
    char buf[MAXLNLEN];
    FILE *dic = fopen(filename,"r");
    if (dic) {
	while(fgets(buf,MAXLNLEN,dic)) {
                if (*(buf + strlen(buf) - 1) == '\n') *(buf + strlen(buf) - 1) = '\0';
		putdic(buf,pMS);
	    }
	fclose(dic);
    }
}

int exist(char * filename)
{
	FILE *f = fopen(filename,"r");
	if (f) {
		fclose(f);
		return 1;
	}
	return 0;
}

int save_privdic(char * filename, char * filename2, wordlist * w)
{
    wordlist * r;
    FILE *dic = fopen(filename,"r");
    if (dic) {
	fclose(dic);
	dic = fopen(filename,"a");
    } else {
	dic = fopen(filename2,"a");	
    }
    if (! dic) return 0;
    while (w != NULL) {
	char *word = chenc(w->word, io_enc, ui_enc);
	fprintf(dic,"%s\n",word);
#ifdef LOG
	log(word);log("\n");
#endif
	r = w;
	free(w->word);
	w = w->next;
	free(r);
    }
    fclose(dic);
    return 1;
}

char * basename(char * s, char c) {
    char * p = s + strlen(s);
    while ((*p != c) && (p != s)) p--;
    if (*p == c) p++;
    return p;
}

#ifdef HAVE_CURSES_H
char * scanline(char * message) {
    char input[INPUTLEN];
    printw(message);
    echo();
    getnstr(input, INPUTLEN);
    noecho();
    return mystrdup(input);
}
#endif

// check words in the dictionaries (and set first checked dictionary)
int check(Hunspell ** pMS, int * d, char * token, int * info, char ** root) {
  for (int i = 0; i < dmax; i++) {
    if (pMS[*d]->spell(chenc(token, io_enc, dic_enc[*d]), info, root) && !(warn && (*info & SPELL_WARN))) {
        return 1;
    }
    if (++(*d) == dmax) *d = 0;
  }
  return 0;
}

void pipe_interface(Hunspell ** pMS, int format, FILE * fileid) {
  char buf[MAXLNLEN];
  char * buf2;
  wordlist * dicwords = NULL;
  char * token;
  int pos;
  int bad;
  int lineno = 0;
  int terse_mode = 0;
  int verbose_mode = 0;
  int d = 0;

  TextParser * parser = get_parser(format, NULL, pMS[0]);

  if ((filter_mode == NORMAL)) {
    fprintf(stdout,gettext(HUNSPELL_HEADING));
    fprintf(stdout,HUNSPELL_VERSION);
    if (pMS[0]->get_version()) fprintf(stdout," - %s", pMS[0]->get_version());
    fprintf(stdout,"\n");
    fflush(stdout);
  }

nextline: while(fgets(buf, MAXLNLEN, fileid)) {
  if (*(buf + strlen(buf) - 1) == '\n') *(buf + strlen(buf) - 1) = '\0';
  lineno++;
#ifdef LOG
  log(buf);
#endif
    bad = 0;
    pos = 0;
    
      // execute commands
    if (filter_mode == PIPE) {
    pos = -1;
    switch (buf[0]) {
    case '%': { verbose_mode = terse_mode = 0; break; }
    case '!': { terse_mode = 1; break; }
    case '`': { verbose_mode = 1; break; }
    case '+': {
		delete parser;
		parser = get_parser(FMT_LATEX, NULL, pMS[0]);
		parser->set_url_checking(checkurl);
		break;
	}
    case '-': {
		delete parser;
		parser = get_parser(format, NULL, pMS[0]);
		break;
	}
    case '@': { putdic(buf+1, pMS[d]); break; }
    case '*': {
        struct wordlist* i = 
	    (struct wordlist *) malloc (sizeof(struct wordlist));
    	i->word = mystrdup(buf+1);
	i->next = dicwords;
	dicwords = i;
        putdic(buf+1, pMS[d]);
        break;
    }
    case '#': {
	if (HOME) strcpy(buf,HOME); else {
	    fprintf(stderr, gettext("error - missing HOME variable\n"));
	    continue;
	}
#ifndef WIN32
	strcat(buf,"/");
#endif
	buf2 = buf+strlen(buf);
	if (!privdicname) {
		strcat(buf,DICBASENAME);
		strcat(buf,basename(dicname,DIRSEPCH));
	} else {
		strcat(buf,privdicname);
	}
	if (save_privdic(buf2, buf, dicwords)) {
	    dicwords=NULL;
	}
	break;
    }
    case '^': {
		pos = 1;
    }

    default: {
	pos = 0;
    }

    } // end switch
    } // end filter_mode == PIPE

if (pos >= 0) {
	parser->put_line(buf + pos);
	while ((token = parser->next_token())) {
	    switch (filter_mode) {
		
		case BADWORD: {
			if (!check(pMS, &d, token, NULL, NULL)) {
				bad = 1;
				if (! printgood) fprintf(stdout,"%s\n", token);
			} else {
				if (printgood) fprintf(stdout,"%s\n", token);
			}
			free(token);
			continue;
		}
		
		case WORDFILTER: {
			if (!check(pMS, &d, token, NULL, NULL)) {
				bad = 1;
				if (! printgood) fprintf(stdout,"%s\n", buf);
			} else {
				if (printgood) fprintf(stdout,"%s\n", buf);
			}
			free(token);
			goto nextline;
		}

		case BADLINE: {
			if (!check(pMS, &d, token, NULL, NULL)) {
				bad = 1;
			}
			free(token);
			continue;
		}

		case AUTO0:
		case AUTO:
		case AUTO2:
		case AUTO3: {
			FILE * f = (filter_mode == AUTO) ? stderr : stdout;
			if (!check(pMS, &d, token, NULL, NULL)) {
				char ** wlst = NULL;
				bad = 1;
				int ns = pMS[d]->suggest_auto(&wlst, chenc(token, io_enc, dic_enc[d]));
				if (ns > 0) {
					parser->change_token(chenc(wlst[0], dic_enc[d], io_enc));
					if (filter_mode == AUTO3) {
						fprintf(f,"%s:%d: Locate: %s | Try: %s\n",
							currentfilename, lineno,
							token, chenc(wlst[0], dic_enc[d], io_enc));
					} else if (filter_mode == AUTO2) {
						fprintf(f,"%ds/%s/%s/g; # %s\n", lineno,
							token, chenc(wlst[0], dic_enc[d], io_enc), buf);
					} else {
						fprintf(f,gettext("Line %d: %s -> "), lineno,
							chenc(token, io_enc, ui_enc));
						fprintf(f, "%s\n",
							chenc(wlst[0], dic_enc[d], ui_enc));
					}
				}
				pMS[d]->free_list(&wlst, ns);
			}
			free(token);
			continue;			
		}

		case STEM: {
                char ** result;
                int n = pMS[d]->stem(&result, chenc(token, io_enc, dic_enc[d]));
                for (int i = 0; i < n; i++) {
                	fprintf(stdout, "%s %s\n", token, chenc(result[i], dic_enc[d], ui_enc));
                }
                pMS[d]->free_list(&result, n);
                if (n == 0 && token[strlen(token) - 1] == '.') {
                	token[strlen(token) - 1] = '\0';
                        n = pMS[d]->stem(&result, token);
                        for (int i = 0; i < n; i++) {
                	        fprintf(stdout, "%s %s\n", token, chenc(result[i], dic_enc[d], ui_enc));
                	}
                        pMS[d]->free_list(&result, n);
                }
                if (n == 0) fprintf(stdout, "%s\n", chenc(token, dic_enc[d], ui_enc));
		fprintf(stdout, "\n");
		free(token);
		continue;
		}

		case ANALYZE: {
                char ** result;
                int n = pMS[d]->analyze(&result, chenc(token, io_enc, dic_enc[d]));
                for (int i = 0; i < n; i++) {
                	fprintf(stdout, "%s %s\n", token, chenc(result[i], dic_enc[d], ui_enc));
                }
                pMS[d]->free_list(&result, n);
                if (n == 0 && token[strlen(token) - 1] == '.') {
                	token[strlen(token) - 1] = '\0';
                        n = pMS[d]->analyze(&result, token);
                        for (int i = 0; i < n; i++) {
                	        fprintf(stdout, "%s %s\n", token, chenc(result[i], dic_enc[d], ui_enc));
                	}
                	pMS[d]->free_list(&result, n);
                }
                if (n == 0) fprintf(stdout, "%s\n", chenc(token, dic_enc[d], ui_enc));
		fprintf(stdout, "\n");
		free(token);
		continue;
		}

		case PIPE: {
		int info;
		char * root = NULL;
		if (check(pMS, &d, token, &info, &root)) {
			if (!terse_mode) {
				if (verbose_mode) fprintf(stdout,"* %s\n", token);
				else fprintf(stdout,"*\n");
			    }
			fflush(stdout);
		} else {
			char ** wlst = NULL;
			int ns = pMS[d]->suggest(&wlst, token);
			if (ns == 0) {
		    		fprintf(stdout,"# %s %d", token,
		    		    parser->get_tokenpos() + pos);
			} else {
				fprintf(stdout,"& %s %d %d: ", token, ns,
				    parser->get_tokenpos() + pos);
				fprintf(stdout,"%s", chenc(wlst[0], dic_enc[d], io_enc));
			}
			for (int j = 1; j < ns; j++) {
				fprintf(stdout, ", %s", chenc(wlst[j], dic_enc[d], io_enc));
			}
			pMS[d]->free_list(&wlst, ns);
			fprintf(stdout, "\n");
			fflush(stdout);
		}
		if (root) free(root);
		free(token);
		continue;
		}
		case NORMAL: {
		int info;
                char * root = NULL;
		if (check(pMS, &d, token, &info, &root)) {
			if (info & SPELL_COMPOUND) {
				fprintf(stdout,"-\n");
			} else if (root) {
		    		fprintf(stdout,"+ %s\n", chenc(root, dic_enc[d], ui_enc));
			} else {
				fprintf(stdout,"*\n");
			}			
			fflush(stdout);
			if (root) free(root);
		} else {
			char ** wlst = NULL;
			int ns = pMS[d]->suggest(&wlst, chenc(token, io_enc, dic_enc[d]));
			if (ns == 0) {
		    		fprintf(stdout,"# %s %d", chenc(token, io_enc, ui_enc),
		    		    parser->get_tokenpos() + pos);
			} else {
				fprintf(stdout,"& %s %d %d: ", chenc(token, io_enc, ui_enc), ns,
				    parser->get_tokenpos() + pos);
				fprintf(stdout,"%s", chenc(wlst[0], dic_enc[d], ui_enc));
			}
			for (int j = 1; j < ns; j++) {
				fprintf(stdout, ", %s", chenc(wlst[j], dic_enc[d], ui_enc));
			}
			pMS[d]->free_list(&wlst, ns);
			fprintf(stdout, "\n");
			fflush(stdout);
		}
		free(token);
		}
	    }
	}

	switch (filter_mode) {
	    case AUTO: {
		fprintf(stdout,"%s\n", parser->get_line());
		break;
	    }

	    case BADLINE: {
		if (((printgood) && (!bad)) ||
		  (!printgood && (bad))) fprintf(stdout,"%s\n",buf);	
		break;	
	    }
	
	    case PIPE:
	    case NORMAL: {
		fprintf(stdout,"\n");
		fflush(stdout);
		break;
	    }
	
	}
} // if
} // while

if (parser) delete(parser);

} // pipe_interface

#ifdef HAVE_READLINE

#ifdef HAVE_CURSES_H
static const char * rltext;

// set base text of input line
static int set_rltext ()
{
  if (rltext)
    {
      rl_insert_text (rltext);
      rltext = NULL;
      rl_startup_hook = (rl_hook_func_t *)NULL;
    }
  return 0;
}

#endif

// Readline escape 
static int rl_escape (int count, int key)
{
  rl_delete_text(0, rl_end);
  rl_done = 1;
  return 0;
}
#endif

#ifdef HAVE_CURSES_H
int expand_tab(char * dest, char * src, int limit) {
	int i = 0;
        int u8 = ((ui_enc != NULL) && (strcmp(ui_enc, "UTF-8") == 0)) ? 1 : 0;
        int chpos = 0;
	for(int j = 0; (i < limit) && (src[j] != '\0') && (src[j] != '\r'); j++) {
		dest[i] = src[j];
		if (src[j] == '\t') {
			int end = 8 - (chpos % 8);
			for(int k = 0; k < end; k++) {
				dest[i] = ' ';
				i++;
				chpos++;
			}
		} else {
		    i++;
		    if (!u8 || (src[j] & 0xc0) != 0x80) chpos++;
		}
	}
	dest[i] = '\0';
	return chpos;
}

// UTF-8-aware version of strncpy (but output is always null terminated)
// What we should deal in is cursor position cells in a terminal emulator,
// i.e. the number of visual columns occupied like wcwidth/wcswidth does
// What we're really current doing is to deal in the number of characters,
// like mbstowcs which isn't quite correct, but close enough for western
// text in UTF-8
void strncpyu8(char * dest, const char * src, int begin, int n) {
	int u8 = ((ui_enc != NULL) && (strcmp(ui_enc, "UTF-8") == 0)) ? 1 : 0;
	int i = 0;
	while (i < begin + n) {
		if (i >= begin)
		{
			if (!*src)
				break;
			*dest++ = *src;
		}
		if (!u8 || (*src & 0xc0) != 0x80)
			i++;
		++src;
	}
	*dest = '\0';
}

//See strncpyu8 for gotchas
int strlenu8(const char * src) {
	int u8 = ((ui_enc != NULL) && (strcmp(ui_enc, "UTF-8") == 0)) ? 1 : 0;
	int i = 0;
	while (*src) {
		if (!u8 || (*src & 0xc0) != 0x80)
			i++;
		++src;
	}
	return i;
}

void dialogscreen(TextParser * parser, char * token,
		char * filename, int forbidden, char ** wlst, int ns) {
	int x, y;
	char line[MAXLNLEN];
	char line2[MAXLNLEN];
	getmaxyx(stdscr,y,x);
	clear();

	if (forbidden & SPELL_FORBIDDEN) printw(gettext("FORBIDDEN!")); else
	  if (forbidden & SPELL_WARN) printw(gettext("Spelling mistake?"));
	printw(gettext("\t%s\t\tFile: %s\n\n"), chenc(token, io_enc, ui_enc), filename);

	// handle long lines and tabulators

	char lines[MAXPREVLINE][MAXLNLEN];
	
	for (int i = 0; i < MAXPREVLINE; i++) {
		expand_tab(lines[i], chenc(parser->get_prevline(i), io_enc, ui_enc), MAXLNLEN);
	}

	int prevline = 0;

	strncpy(line, parser->get_prevline(0), parser->get_tokenpos());
        line[parser->get_tokenpos()] = '\0';
	int tokenbeg = expand_tab(line2, chenc(line, io_enc, ui_enc), MAXLNLEN);

	strncpy(line, parser->get_prevline(0), parser->get_tokenpos() + strlen(token));
        line[parser->get_tokenpos() + strlen(token)] = '\0';	
	int tokenend = expand_tab(line2, chenc(line, io_enc, ui_enc), MAXLNLEN);

	int rowindex = tokenend / x;
	int beginrow = rowindex - tokenbeg / x;
	if (beginrow >= MAXPREVLINE) beginrow = MAXPREVLINE - 1;

	for (int i = 0; i < MAXPREVLINE; i++) {
	        strncpyu8(line, lines[prevline], x * rowindex, x);
		mvprintw(MAXPREVLINE + 1 - i, 0, "%s", line);
		rowindex--;
		if (rowindex == -1) {
			prevline++;
			rowindex = strlenu8(lines[prevline]) / x;
		}
	}

	int linestartpos = tokenbeg - (tokenbeg % x);
	strncpyu8(line, lines[0], x * rowindex + linestartpos, tokenbeg % x);
	mvprintw(MAXPREVLINE + 1 - beginrow, 0, "%s", line);
	attron(A_REVERSE);    
	printw("%s", chenc(token, io_enc, ui_enc));
	attroff(A_REVERSE);

	mvprintw(MAXPREVLINE + 2, 0, "\n");
	for (int i = 0; i < ns; i++) {
		if ((ns > 10) && (i < 10)) {
			printw(" 0%d: %s\n", i, chenc(wlst[i], io_enc, ui_enc));
		} else {
			printw(" %d: %s\n", i, chenc(wlst[i], io_enc, ui_enc));
		}
	}

/* TRANSLATORS: the capital letters are shortcuts, mark one letter similarly
   in your translation and translate the standalone letter accordingly later */
	mvprintw(y-3, 0, "%s\n", 
		gettext("\n[SPACE] R)epl A)ccept I)nsert U)ncap S)tem Q)uit e(X)it or ? for help\n"));
}

char * lower_first_char(char *token, const char *io_enc, int langnum)
{
	const char *utf8str = chenc(token, io_enc, "UTF-8");
	int max = strlen(utf8str);
	w_char *u = new w_char[max];
	int len = u8_u16(u, max, utf8str);
	unsigned short idx = (u[0].h << 8) + u[0].l;
	idx = unicodetolower(idx, langnum);
	u[0].h = (unsigned char) (idx >> 8);
	u[0].l = (unsigned char) (idx & 0x00FF);
	char *scratch = (char*)malloc(max + 1 + 4);
	u16_u8(scratch, max+4, u, len);
	delete[] u;
	char *result = chenc(scratch, "UTF-8", io_enc);
	if (result != scratch)
	{
		free (scratch);
		result = mystrdup(result);
	}
	return result;
}

 // for terminal interface
int dialog(TextParser * parser, Hunspell * pMS, char * token, char * filename,
	char ** wlst, int ns, int forbidden) {
    char buf[MAXLNLEN]; 
    char * buf2;
    wordlist * dicwords = NULL;
    int c;

    dialogscreen(parser, token, filename, forbidden, wlst, ns);

    char firstletter='\0';
    
    while ((c=getch())) {
    switch (c) {
	case '0':
	case '1': if ((firstletter=='\0') && (ns>10)) {
	    firstletter=c;
	    break;
	}
	case '2':
	case '3':
	case '4':
	case '5':
	case '6':
	case '7':
	case '8':
	case '9': {
	    modified=1;
	    if ((firstletter!='\0') && (firstletter=='1')) {
		c += 10;
	    }
	    c -= '0';
	    if (c>=ns) break;
	    parser->change_token(wlst[c]);
	    goto ki;
	}
	case ' ': { 
	    goto ki;
	}
	case '?': {
	    clear();
printw(gettext("Whenever a word is found that is not in the dictionary\n"
    "it is printed on the first line of the screen.  If the dictionary\n"
    "contains any similar words, they are listed with a number\n"
    "next to each one.  You have the option of replacing the word\n"
    "completely, or choosing one of the suggested words.\n"));
printw(gettext("\nCommands are:\n\n"));
printw(gettext("R	Replace the misspelled word completely.\n"));
printw(gettext("Space	Accept the word this time only.\n"));
printw(gettext("A	Accept the word for the rest of this session.\n"));
printw(gettext("I	Accept the word, and put it in your private dictionary.\n"));
printw(gettext("U	Accept and add lowercase version to private dictionary.\n"));
printw(gettext(
"S\tAsk a stem and a model word and store them in the private dictionary.\n"
"\tThe stem will be accepted also with the affixes of the model word.\n"
));
printw(gettext("0-n	Replace with one of the suggested words.\n"));
printw(gettext("X	Write the rest of this file, ignoring misspellings, and start next file.\n"));
printw(gettext("Q	Quit immediately. Asks for confirmation. Leaves file unchanged.\n"));
printw(gettext("^Z	Suspend program. Restart with fg command.\n"));
printw(gettext("?	Show this help screen.\n"));
printw(gettext("\n-- Type space to continue -- \n"));
	    while (getch()!=' ');
	}
	case 12: {
    	    dialogscreen(parser, token, filename, forbidden, wlst, ns);
	    break;
	}
	default: {
/* TRANSLATORS: translate this letter according to the shortcut letter used
   previously in the  translation of "R)epl" before */
	    if (c==(gettext("r"))[0]) {
		char i[MAXLNLEN];
		char *temp;

		modified=1;


#ifdef HAVE_READLINE
		endwin();
		rltext = "";
		if (rltext && *rltext) rl_startup_hook = set_rltext;
#endif
		temp = readline(gettext("Replace with: "));
#ifdef HAVE_READLINE
		initscr();
		cbreak();
#endif

		if ((!temp) || (temp[0] == '\0')) {
		    free(temp);
		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    break;
		}

		strncpy(i, temp, MAXLNLEN);
		free(temp);

		parser->change_token(i);
		
		return 2; // replace
	    }
/* TRANSLATORS: translate these letters according to the shortcut letter used
   previously in the  translation of "U)ncap" and I)nsert before */
	    int u_key = gettext("u")[0];
	    int i_key = gettext("i")[0];

	    if (c==u_key || c==i_key) {
		struct wordlist* i = (struct wordlist *) malloc (sizeof(struct wordlist));
    		i->word = (c==i_key) ? mystrdup(token) : lower_first_char(token, io_enc, pMS->get_langnum());
		i->next = dicwords;
		dicwords = i;
		// save
		if (HOME) strcpy(buf,HOME); else {
		    fprintf(stderr, gettext("error - missing HOME variable\n"));
		    break;
		}
#ifndef WIN32
		strcat(buf,"/");
#endif
		buf2 = buf+strlen(buf);
		if (!privdicname) {
			strcat(buf,DICBASENAME);
			strcat(buf,basename(dicname,DIRSEPCH));
		} else {
			strcat(buf,privdicname);
		}
		if (save_privdic(buf2, buf, dicwords)) {
		    dicwords=NULL;
		} else {
		    fprintf(stderr,gettext("Cannot update personal dictionary."));
		    break;
		}
	    } // no break
/* TRANSLATORS: translate this letter according to the shortcut letter used
   previously in the  translation of "U)ncap" and I)nsert before */
	    if ((c==(gettext("u"))[0]) || (c==(gettext("i"))[0]) || (c==(gettext("a"))[0])) {
		modified=1;
		putdic(token, pMS);
		goto ki;
	    }
/* TRANSLATORS: translate this letter according to the shortcut letter used
   previously in the  translation of "S)tem" before */
	    if (c==(gettext("s"))[0]) {
		modified=1;

		char w[MAXLNLEN], w2[MAXLNLEN], w3[MAXLNLEN];
		char *temp;

		strncpy(w, token, MAXLNLEN);
		temp = basename(w, '-');
		if (w < temp) {
			*(temp-1) = '\0';
		} else {
			char ** poslst = NULL;
#ifdef HUNSPELL_EXPERIMENTAL
			int ps = pMS->suggest_pos_stems(&poslst, token);
#else
			int ps = 0;
#endif
			if (ps > 0) {
			    strcpy(buf, poslst[0]);
			    for (int i = 0; i < ps; i++) {
				if (strlen(poslst[i]) <= strlen(buf)) strcpy(buf, poslst[i]);
				free(poslst[i]);
			    }
			    strcpy(w, buf);
			}
			if (poslst) free(poslst);
		}

#ifdef HAVE_READLINE		
		endwin();
		rltext = w;
		if (rltext && *rltext) rl_startup_hook = set_rltext;
#endif
		temp = readline(gettext("New word (stem): "));

		if ((!temp) || (temp[0] == '\0')) {
		    free(temp);
#ifdef HAVE_READLINE		
		    initscr();
		    cbreak();
#endif
		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    break;
		}

		strncpy(w, temp, MAXLNLEN);
		free(temp);

#ifdef HAVE_READLINE		
		initscr();
		cbreak();
#endif
		dialogscreen(parser, token, filename, forbidden, wlst, ns);
		refresh();

#ifdef HAVE_READLINE
		endwin();
		rltext = "";
		if (rltext && *rltext) rl_startup_hook = set_rltext;
#endif
		temp = readline(gettext("Model word (a similar dictionary word): "));

#ifdef HAVE_READLINE
		initscr();
		cbreak();
#endif

		if ((!temp) || (temp[0] == '\0')) {
		    free(temp);
		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    break;
		}

		strncpy(w2, temp, MAXLNLEN);
		free(temp);

		if (strlen(w) + strlen(w2) + 2 < MAXLNLEN) {
			sprintf(w3, "%s/%s", w, w2);
		} else break;
		
		if (!putdic(w3, pMS)) {

		    struct wordlist* i = 
			(struct wordlist *) malloc (sizeof(struct wordlist));
    		    i->word = mystrdup(w3);
		    i->next = dicwords;
		    dicwords = i;

		    if (strlen(w) + strlen(w2) + 4 < MAXLNLEN) {
			    sprintf(w3, "%s-/%s-", w, w2);
			    if (putdic(w3, pMS)) {
				struct wordlist* i = 
				    (struct wordlist *) malloc (sizeof(struct wordlist));
    				i->word = mystrdup(w3);
				i->next = dicwords;
				dicwords = i;
			    }
		    }
		    // save
		    		    
		    if (HOME) strcpy(buf,HOME); else {
			fprintf(stderr, gettext("error - missing HOME variable\n"));
			continue;
		    }
#ifndef WIN32
		    strcat(buf,"/");
#endif
		    buf2 = buf + strlen(buf);
		    if (!privdicname) {
			    strcat(buf,DICBASENAME);
			    strcat(buf,basename(dicname,DIRSEPCH));
		    } else {
			    strcat(buf,privdicname);
		    }
		    if (save_privdic(buf2, buf, dicwords)) {
			dicwords = NULL;
		    } else {
			fprintf(stderr, gettext("Cannot update personal dictionary."));
			break;
		    }
		    
		} else {
		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    printw(gettext("Model word must be in the dictionary. Press any key!"));
		    getch();
		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    break;
		}
		goto ki;
	    }
/* TRANSLATORS: translate this letter according to the shortcut letter used
   previously in the  translation of "e(X)it" before */
	    if (c==(gettext("x"))[0]) {
		return 1;
	    }
/* TRANSLATORS: translate this letter according to the shortcut letter used
   previously in the  translation of "Q)uit" before */
	    if (c==(gettext("q"))[0]) {
		if (modified) {
		    printw(gettext("Are you sure you want to throw away your changes? "));
/* TRANSLATORS: translate this letter according to the shortcut letter y)es */
		    if (getch()==(gettext("y"))[0]) return -1;
    		    dialogscreen(parser, token, filename, forbidden, wlst, ns);
		    break;		    
		} else {
		    return -1;
		}
	    }
	}
    }
    }
    ki: return 0;
}

int interactive_line(TextParser * parser, Hunspell ** pMS, char * filename, FILE * tempfile)
{
	char * token;
	int dialogexit = 0;
        int info;
        int d = 0;
	while ((token=parser->next_token())) {
		if (!check(pMS, &d, token, &info, NULL)) {
			dialogscreen(parser, token, filename, info, NULL, 0); // preview
			refresh();
			char ** wlst = NULL;
			int ns = pMS[d]->suggest(&wlst, chenc(token, io_enc, dic_enc[d]));
			if (ns==0) {
				dialogexit = dialog(parser, pMS[d], token, filename, wlst, ns, info);
			} else {	    
				for (int j = 0; j < ns; j++) {
					char d2io[MAXLNLEN];
					strcpy(d2io, chenc(wlst[j], dic_enc[d], io_enc));
					wlst[j] = (char *) realloc(wlst[j], strlen(d2io) + 1);
					strcpy(wlst[j], d2io);
				}
				dialogexit = dialog(parser, pMS[d], token, filename, wlst, ns, info);
			}
			for (int j = 0; j < ns; j++) {
				free(wlst[j]);
			}
			free(wlst);
		}
		free(token);
		if ((dialogexit==-1) || (dialogexit==1)) goto ki2;
	}

   ki2: fprintf(tempfile,"%s\n",token=parser->get_line());
	free(token);
	return dialogexit;
}

void interactive_interface(Hunspell ** pMS, char * filename, int format)
{
    char buf[MAXLNLEN];

    FILE *text;
    
    text = fopen(filename, "r");

    int dialogexit;
    int check=1;

    TextParser * parser;
    char * extension = basename(filename, '.');
    parser = get_parser(format, extension, pMS[0]);

    char * tempname = (char *) malloc(strlen(filename) + strlen(TEMPNAME) + 1);
    strcpy(tempname, filename);
    strcpy(basename(tempname, DIRSEPCH), TEMPNAME);
    
    FILE *tempfile;

    if (!(tempfile = fopen(tempname, "w"))) {
        fprintf(stderr, gettext("Can't create tempfile %s.\n"), tempname);
        endwin();
        exit(1);
    }

	while(fgets(buf,MAXLNLEN,text)) {
	    if (check) {
                if (*(buf + strlen(buf) - 1) == '\n') *(buf + strlen(buf) - 1) = '\0';
		parser->put_line(buf);
		dialogexit = interactive_line(parser,pMS,filename,tempfile);
		switch (dialogexit) {
		    case -1: {
			clear();
			refresh();
			unlink(tempname);
			endwin();
			exit(0);
		    }
		    case 1: {
			check = 0;
		    }
		}
	    } else {
		fprintf(tempfile,"%s",buf);
	    }
	}
	fclose(text);
	fclose(tempfile);
	delete parser;

	if (! modified) {
	    unlink(tempname);
	} else {
            rename(tempname, filename);
	}
        free(tempname);
}

#endif

char * add(char * dest, const char * st) {
	if (!dest) {
	    dest = mystrdup(st);
	} else {
	    dest = (char *) realloc(dest, strlen(dest) + strlen(st) + 1);
	    strcat(dest, st);
	}
	return dest;
}

char * exist2(char * dir, int len, const char * name, const char * ext) {
	char buf[MAXLNLEN];
	const char * sep = (len == 0) ? "": DIRSEP;
	strncpy(buf, dir, len);
	strcpy(buf + len, sep);
	strcat(buf, name);
	strcat(buf, ext);
	if (exist(buf)) return mystrdup(buf);
	strcat(buf, HZIP_EXTENSION);
	if (exist(buf)) {
	    buf[strlen(buf) - strlen(HZIP_EXTENSION)] = '\0';
	    return mystrdup(buf);
	}
	return NULL;
}

#ifndef WIN32
int listdicpath(char * dir, int len) {
	char buf[MAXLNLEN];
	const char * sep = (len == 0) ? "": DIRSEP;
	strncpy(buf, dir, len);
	strcpy(buf + len, sep);
	DIR *d = opendir(buf);
	if (!d) return 0;
	struct dirent * de;
	while ((de = readdir(d))) {
		int len = strlen(de->d_name);
		if ((len > 4 && strcmp(de->d_name + len - 4, ".dic") == 0) ||
		   (len > 7 && strcmp(de->d_name + len - 7, ".dic.hz") == 0)) {
		    char * s = mystrdup(de->d_name);
		    s[len - ((s[len - 1] == 'z') ? 7 : 4)] = '\0';
		    fprintf(stderr, "%s%s\n", buf, s);
		    free(s);
		}
	}
	closedir(d);	
	return 1;
}
#endif

// search existing path for file "name + ext"
char * search(char * begin, char * name, const char * ext) {
	char * end = begin;
	while (1) {
	    while (!((*end == *PATHSEP) || (*end == '\0'))) end++;
	    char * res = NULL;
	    if (name) {
	    	res = exist2(begin, end - begin, name, ext);
	    } else {
#ifndef WIN32
		listdicpath(begin, end - begin);
#endif
	    }
	    if ((*end == '\0') || res) return res;
	    end++;
	    begin = end;
	}
}

int main(int argc, char** argv)
{
	char buf[MAXLNLEN];
	Hunspell * pMS[DMAX];
        char * key = NULL;
	int arg_files = -1; // first filename argumentum position in argv
	int format = FMT_TEXT; 
	int argstate = 0;
	
#ifdef ENABLE_NLS
#  ifdef HAVE_LOCALE_H
	setlocale(LC_ALL, "");
	textdomain("hunspell");
#    ifdef HAVE_LANGINFO_CODESET
	ui_enc = nl_langinfo(CODESET);
#    endif
#  endif
#endif

#ifdef HAVE_READLINE
	rl_set_key("", rl_escape, rl_get_keymap());
	rl_bind_key('\t', rl_insert);
#endif

#ifdef LOG
	log("START");
#endif

	for(int i=1; i<argc; i++) {
#ifdef LOG
		log(argv[i]);
#endif    
	
		if (argstate == 1) {
			if (dicname) free(dicname);
			dicname = mystrdup(argv[i]);
			argstate = 0;
		} else if (argstate == 2) {
			if (privdicname) free(privdicname);
			privdicname = mystrdup(argv[i]);
			argstate = 0;
		} else if (argstate == 3) {
			io_enc = argv[i];
			argstate = 0;
		} else if (argstate == 4) {
			key = argv[i];
			argstate = 0;
		} else if (strcmp(argv[i],"-d")==0) argstate=1;
		else if (strcmp(argv[i],"-p")==0) argstate=2;
		else if (strcmp(argv[i],"-i")==0) argstate=3;
		else if (strcmp(argv[i],"-P")==0) argstate=4;
		else if ((strcmp(argv[i],"-h") == 0) || (strcmp(argv[i],"--help") == 0)) {
			fprintf(stderr,gettext("Usage: hunspell [OPTION]... [FILE]...\n"));
			fprintf(stderr,gettext("Check spelling of each FILE. Without FILE, check standard input.\n\n"));
			fprintf(stderr,gettext("  -1\t\tcheck only first field in lines (delimiter = tabulator)\n"));
			fprintf(stderr,gettext("  -a\t\tIspell's pipe interface\n"));
			fprintf(stderr,gettext("  --check-url\tCheck URLs, e-mail addresses and directory paths\n"));
			fprintf(stderr,gettext("  -d d[,d2,...]\tuse d (d2 etc.) dictionaries\n"));
			fprintf(stderr,gettext("  -D\t\tshow available dictionaries\n"));
			fprintf(stderr,gettext("  -G\t\tprint only correct words or lines\n"));
			fprintf(stderr,gettext("  -h, --help\tdisplay this help and exit\n"));
			fprintf(stderr,gettext("  -H\t\tHTML input file format\n"));
			fprintf(stderr,gettext("  -i enc\tinput encoding\n"));
			fprintf(stderr,gettext("  -l\t\tprint misspelled words\n"));
			fprintf(stderr,gettext("  -L\t\tprint lines with misspelled words\n"));
			fprintf(stderr,gettext("  -m \t\tanalyze the words of the input text\n"));
			fprintf(stderr,gettext("  -n\t\tnroff/troff input file format\n"));
			fprintf(stderr,gettext("  -p dict\tset dict custom dictionary\n"));
			fprintf(stderr,gettext("  -r\t\twarn of the potential mistakes (rare words)\n"));
			fprintf(stderr,gettext("  -P password\tset password for encrypted dictionaries\n"));
			fprintf(stderr,gettext("  -s \t\tstem the words of the input text\n"));
			fprintf(stderr,gettext("  -t\t\tTeX/LaTeX input file format\n"));
// experimental functions: missing Unicode support
//			fprintf(stderr,gettext("  -u\t\tshow typical misspellings\n"));
//			fprintf(stderr,gettext("  -u2\t\tprint typical misspellings in sed format\n"));
//			fprintf(stderr,gettext("  -u3\t\tprint typical misspellings in gcc error format\n"));
//			fprintf(stderr,gettext("  -U\t\tautomatic correction of typical misspellings to stdout\n"));
			fprintf(stderr,gettext("  -v, --version\tprint version number\n"));
			fprintf(stderr,gettext("  -vv\t\tprint Ispell compatible version number\n"));
			fprintf(stderr,gettext("  -w\t\tprint misspelled words (= lines) from one word/line input.\n\n"));
			fprintf(stderr,gettext("Example: hunspell -d en_US file.txt    # interactive spelling\n"
                                               "         hunspell -l file.txt          # print misspelled words\n"
                                               "         hunspell -i utf-8 file.txt    # check UTF-8 encoded file\n\n"));
			fprintf(stderr,gettext("Bug reports: http://hunspell.sourceforge.net\n"));
			exit(0);
	        } else if ((strcmp(argv[i],"-vv")==0) || (strcmp(argv[i],"-v")==0) || (strcmp(argv[i],"--version")==0)) {
			fprintf(stdout,gettext(HUNSPELL_PIPE_HEADING));
			fprintf(stdout,"\n");
                        if (strcmp(argv[i],"-vv")!=0) {
                            fprintf(stdout,gettext("\nCopyright (C) 2002-2008 L\303\241szl\303\263 N\303\251meth. License: MPL/GPL/LGPL.\n\n"
			    "Based on OpenOffice.org's Myspell library.\n"
			    "Myspell's copyright (C) Kevin Hendricks, 2001-2002, License: BSD.\n\n"));
			    fprintf(stdout,gettext("This is free software; see the source for copying conditions.  There is NO\n"
			    "warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE,\n"
			    "to the extent permitted by law.\n"));
                        }
			exit(0);
		} else if ((strcmp(argv[i],"-a")==0)) {
			filter_mode = PIPE;
			fprintf(stdout,gettext(HUNSPELL_PIPE_HEADING));
			fflush(stdout);
		} else if ((strcmp(argv[i],"-m")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell:   Make possible root/affix combinations that aren't in the dictionary.
             hunspell: Analyze the words of the input text
            */
			if (filter_mode != PIPE)
			    filter_mode = ANALYZE;
		} else if ((strcmp(argv[i],"-s")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell:   Stop itself with a SIGTSTP signal after each line of input.
             hunspell: Stem the words of the input text
            */
			if (filter_mode != PIPE)
			    filter_mode = STEM;
		} else if ((strcmp(argv[i],"-t")==0)) {
			format = FMT_LATEX;
		} else if ((strcmp(argv[i],"-n")==0)) {
			format = FMT_MAN;
		} else if ((strcmp(argv[i],"-H")==0)) {
			format = FMT_HTML;
		} else if ((strcmp(argv[i],"-l")==0)) {
			filter_mode = BADWORD;
		} else if ((strcmp(argv[i],"-w")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell:   Specify additional characters that can be part of a word.
             hunspell: Print misspelled words (= lines) from one word/line input
            */
			if (filter_mode != PIPE)
			    filter_mode = WORDFILTER;
		} else if ((strcmp(argv[i],"-L")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell:   Number of lines of context to be shown at the bottom of the screen
             hunspell: Print lines with misspelled words
            */
			if (filter_mode != PIPE)
			    filter_mode = BADLINE;
		} else if ((strcmp(argv[i],"-u")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell: None
             hunspell: Show typical misspellings
            */
			if (filter_mode != PIPE)
			    filter_mode = AUTO0;
		} else if ((strcmp(argv[i],"-U")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell: None
             hunspell: Automatic correction of typical misspellings to stdout
            */
			if (filter_mode != PIPE)
			    filter_mode = AUTO;
		} else if ((strcmp(argv[i],"-u2")==0)) {
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell: None
             hunspell: Print typical misspellings in sed format
            */
			if (filter_mode != PIPE)
			    filter_mode = AUTO2;
		} else if ((strcmp(argv[i],"-u3")==0)) {         
            /*
             if -a was used, don't override, i.e. keep ispell compatability
             ispell: None
             hunspell: Print typical misspellings in gcc error format
            */
			if (filter_mode != PIPE)
				filter_mode = AUTO3;
		} else if ((strcmp(argv[i],"-G")==0)) {
			printgood = 1;
		} else if ((strcmp(argv[i],"-1")==0)) {
			format = FMT_FIRST;
		} else if ((strcmp(argv[i],"-D")==0)) {
			showpath = 1;
		} else if ((strcmp(argv[i],"-r")==0)) {
			warn = 1;
fprintf(stderr, "BEKAPCS");
		} else if ((strcmp(argv[i],"--check-url")==0)) {
			checkurl = 1;
		} else if ((arg_files==-1) && ((argv[i][0] != '-') && (argv[i][0] != '\0'))) {
			arg_files = i;
			if (! exist(argv[i])) { // first check (before time-consuming dic. load)
				fprintf(stderr,gettext("Can't open %s.\n"),argv[i]);
#ifdef HAVE_CURSES_H
				endwin();
#endif
				exit(1);
			}
		}
	}

        if (printgood && (filter_mode == NORMAL)) filter_mode = BADWORD;
	
	if (! dicname) {
		if (! (dicname=getenv("DICTIONARY"))) {
			/*
			 * Search in order of LC_ALL, LC_MESSAGES &
			 * LANG
			*/
			const char *tests[] = { "LC_ALL", "LC_MESSAGES", "LANG" };
			for (size_t i = 0; i < sizeof(tests) / sizeof(const char*); ++i) {
				if ((dicname=getenv(tests[i])) && strcmp(dicname, "") != 0) {
					dicname = mystrdup(dicname);
					char * dot = strchr(dicname, '.');
					if (dot) *dot = '\0';
					char * at = strchr(dicname, '@');
					if (at) *at = '\0';
					break;
				}
			}

			if (dicname && ((strcmp(dicname, "C") == 0) || (strcmp(dicname, "POSIX") == 0))) {
			    free(dicname);
			    dicname=mystrdup("en_US");
			}

			if (! dicname) {
		            dicname=mystrdup(DEFAULTDICNAME);
			}
		} else {
		    dicname = mystrdup(dicname);
		}
	}
	path = add(mystrdup("."), PATHSEP); // <- check path in local directory
	path = add(path, PATHSEP);          // <- check path in root directory
	if (getenv("DICPATH")) path = add(add(path, getenv("DICPATH")), PATHSEP);
	path = add(add(path, LIBDIR), PATHSEP);
	if (HOME) path = add(add(add(add(path, HOME), DIRSEP), USEROOODIR), PATHSEP);
	path = add(path, OOODIR);

	if (showpath) {
		fprintf(stderr, gettext("SEARCH PATH:\n%s\n"), path);
		fprintf(stderr, gettext("AVAILABLE DICTIONARIES (path is not mandatory for -d option):\n"));
		search(path, NULL, NULL);
	}

	if (!privdicname) privdicname = mystrdup(getenv("WORDLIST"));

        char * dicplus = strchr(dicname, ',');
        if (dicplus) *dicplus = '\0';
	char * aff = search(path, dicname, ".aff");
	char * dic = search(path, dicname, ".dic");
	if (aff && dic) {
		if (showpath) {
			fprintf(stderr, gettext("LOADED DICTIONARY:\n%s\n%s\n"), aff, dic);
		}
		pMS[0] = new Hunspell(aff, dic, key);
		dic_enc[0] = pMS[0]->get_dic_encoding();
		dmax = 1;
		if (pMS[0] && dicplus) while (dicplus) {
		    char * dicname2 = dicplus + 1;
		    dicplus = strchr(dicname2, ',');
                    if (dicplus) *dicplus = '\0';
                    free(aff);
                    free(dic);
	            aff = search(path, dicname2, ".aff");
	            dic = search(path, dicname2, ".dic");
                    if (aff && dic) {
                        if (dmax < DMAX) {
                            pMS[dmax] = new Hunspell(aff, dic, key);
                            dic_enc[dmax] = pMS[dmax]->get_dic_encoding();
                            dmax++;
                        } else fprintf(stderr, gettext("error - %s exceeds dictionary limit.\n"), dicname2);
                    } else if (dic) pMS[dmax-1]->add_dic(dic);
		}
	} else {
		fprintf(stderr,gettext("Can't open affix or dictionary files for dictionary named \"%s\".\n"), dicname);
		exit(1);
	}

	/* open the private dictionaries */
	if (HOME) {
	    strcpy(buf,HOME);
#ifndef WIN32
            strcat(buf,"/");
#endif
	    if (!privdicname) {
		strcat(buf,DICBASENAME);
		strcat(buf,basename(dicname,DIRSEPCH));
		load_privdic(buf, pMS[0]);
		strcpy(buf,DICBASENAME);
		strcat(buf,basename(dicname,DIRSEPCH));
		load_privdic(buf, pMS[0]);
	    } else {
		strcat(buf,privdicname);
		load_privdic(buf, pMS[0]);
		strcpy(buf,privdicname);
		load_privdic(buf, pMS[0]);	
	    }
        }

	if (arg_files==-1) {
		pipe_interface(pMS, format, stdin);
	} else if (filter_mode != NORMAL) {
		for (int i = arg_files; i < argc; i++) {
			if (exist(argv[i])) {
				modified = 0;
				currentfilename = argv[i];
				FILE * f = fopen(argv[i], "r");
				pipe_interface(pMS, format, f);
				fclose(f);
			} else {
				fprintf(stderr, gettext("Can't open %s.\n"), argv[i]);
				exit(1);
			}
		}
	} else if (filter_mode == NORMAL) {
#ifdef HAVE_CURSES_H
	    initscr();
	    cbreak();
	    noecho();
	    nonl();
	    intrflush(stdscr,FALSE);
		
		for (int i = arg_files; i < argc; i++) {
			if (exist(argv[i])) {
				modified = 0;
				interactive_interface(pMS, argv[i], format);
			} else {
				fprintf(stderr, gettext("Can't open %s.\n"), argv[i]);
				endwin();
				exit(1);
			}
		}

		clear();
		refresh();
		endwin();
#else
		fprintf(stderr, gettext("Hunspell has been compiled without Ncurses user interface.\n"));
#endif
	}

	if (dicname) free(dicname);
	if (privdicname) free(privdicname);
	if (path) free(path);
	if (aff) free(aff);
	if (dic) free(dic);
	if (wordchars) free(wordchars);
	if (wordchars_utf16_free) free(wordchars_utf16);
#ifdef HAVE_ICONV
	free_utf_tbl();
#endif
	for (int i = 0; i < dmax; i++) delete pMS[i];
	return 0;
}
