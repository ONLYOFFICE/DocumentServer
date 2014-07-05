#include <cstdlib>
#include <cstring>
#include <cstdio>
#include <ctype.h>

#include "../hunspell/csutil.hxx"
#include "latexparser.hxx"

#ifndef W32
using namespace std;
#endif

static struct {
	const char * pat[2];
	int arg;
} PATTERN[] = {
	{ { "\\(", "\\)" } , 0 },
	{ { "$$", "$$" } , 0 },
	{ { "$", "$" } , 0 },
	{ { "\\begin{math}", "\\end{math}" } , 0 },
	{ { "\\[", "\\]" } , 0 },
	{ { "\\begin{displaymath}", "\\end{displaymath}" } , 0 },
	{ { "\\begin{equation}", "\\end{equation}" } , 0 },
	{ { "\\begin{equation*}", "\\end{equation*}" } , 0 },
	{ { "\\cite", NULL } , 1 },
	{ { "\\nocite", NULL } , 1 },
	{ { "\\index", NULL } , 1 },
	{ { "\\label", NULL } , 1 },
	{ { "\\ref", NULL } , 1 },
	{ { "\\pageref", NULL } , 1 },
	{ { "\\parbox", NULL } , 1 },
	{ { "\\begin{verbatim}", "\\end{verbatim}" } , 0 },
	{ { "\\verb+", "+" } , 0 },
	{ { "\\verb|", "|" } , 0 },
	{ { "\\verb#", "#" } , 0 },
	{ { "\\verb*", "*" } , 0 },
	{ { "\\documentstyle", "\\begin{document}" } , 0 },
	{ { "\\documentclass", "\\begin{document}" } , 0 },
//	{ { "\\documentclass", NULL } , 1 },
	{ { "\\usepackage", NULL } , 1 },
	{ { "\\includeonly", NULL } , 1 },
	{ { "\\include", NULL } , 1 },
	{ { "\\input", NULL } , 1 },
	{ { "\\vspace", NULL } , 1 },
	{ { "\\setlength", NULL } , 2 },
	{ { "\\addtolength", NULL } , 2 },
	{ { "\\settowidth", NULL } , 2 },
	{ { "\\rule", NULL } , 2 },
	{ { "\\hspace", NULL } , 1 } ,
	{ { "\\vspace", NULL } , 1 } ,
	{ { "\\\\[", "]" } , 0 },
	{ { "\\pagebreak[", "]" } , 0 } ,
	{ { "\\nopagebreak[", "]" } , 0 } ,
	{ { "\\enlargethispage", NULL } , 1 } ,
	{ { "\\begin{tabular}", NULL } , 1 } ,
	{ { "\\addcontentsline", NULL } , 2 } ,
	{ { "\\begin{thebibliography}", NULL } , 1 } ,
	{ { "\\bibliography", NULL } , 1 } ,
	{ { "\\bibliographystyle", NULL } , 1 } ,
	{ { "\\bibitem", NULL } , 1 } ,
	{ { "\\begin", NULL } , 1 } ,
	{ { "\\end", NULL } , 1 } ,
	{ { "\\pagestyle", NULL } , 1 } ,
	{ { "\\pagenumbering", NULL } , 1 } ,
	{ { "\\thispagestyle", NULL } , 1 } ,
	{ { "\\newtheorem", NULL } , 2 },
	{ { "\\newcommand", NULL } , 2 },
	{ { "\\renewcommand", NULL } , 2 },
	{ { "\\setcounter", NULL } , 2 },
	{ { "\\addtocounter", NULL } , 1 },
	{ { "\\stepcounter", NULL } , 1 },
	{ { "\\selectlanguage", NULL } , 1 },
	{ { "\\inputencoding", NULL } , 1 },
	{ { "\\hyphenation", NULL } , 1 },
	{ { "\\definecolor", NULL } , 3 },
	{ { "\\color", NULL } , 1 },
	{ { "\\textcolor", NULL } , 1 },
	{ { "\\pagecolor", NULL } , 1 },
	{ { "\\colorbox", NULL } , 2 },
	{ { "\\fcolorbox", NULL } , 2 },
	{ { "\\declaregraphicsextensions", NULL } , 1 },
	{ { "\\psfig", NULL } , 1 },
	{ { "\\url", NULL } , 1 },
	{ { "\\eqref", NULL } , 1 },
	{ { "\\vskip", NULL } , 1 },
	{ { "\\vglue", NULL } , 1 },
	{ { "\'\'", NULL } , 1 }
};

#define PATTERN_LEN (sizeof(PATTERN) / sizeof(PATTERN[0]))

LaTeXParser::LaTeXParser(const char * wordchars)
{
	init(wordchars);
}

LaTeXParser::LaTeXParser(unsigned short * wordchars, int len)
{
	init(wordchars, len);
}

LaTeXParser::~LaTeXParser() 
{
}

int LaTeXParser::look_pattern(int col)
{
	for (unsigned int i = 0; i < PATTERN_LEN; i++) {
		char * j = line[actual] + head;
		const char * k = PATTERN[i].pat[col];
		if (! k) continue;
		while ((*k != '\0') && (tolower(*j) == *k)) {
			j++;
			k++;
		}
		if (*k == '\0') return i;
	}
	return -1;
}

/*
 * LaTeXParser
 *
 * state 0: not wordchar
 * state 1: wordchar
 * state 2: comments
 * state 3: commands 
 * state 4: commands with arguments
 * state 5: % comment
 *
 */


char * LaTeXParser::next_token()
{
	int i;
	int slash = 0;
	int apostrophe;
	for (;;) {
		// fprintf(stderr,"depth: %d, state: %d, , arg: %d, token: %s\n",depth,state,arg,line[actual]+head);
		
		switch (state)
		{
		case 0: // non word chars
			if ((pattern_num = look_pattern(0)) != -1) {
				if (PATTERN[pattern_num].pat[1]) {
					state = 2;
				} else {
					state = 4;
					depth = 0;
					arg = 0;
					opt = 1;
				}
				head += strlen(PATTERN[pattern_num].pat[0]) - 1;
			} else if ((line[actual][head] == '%')) {
					state = 5;
			} else if (is_wordchar(line[actual] + head)) {
				state = 1;
				token = head;
			} else if (line[actual][head] == '\\') {
				if (line[actual][head + 1] == '\\' ||  // \\ (linebreak)
					(line[actual][head + 1] == '$') || // \$ (dollar sign)
					(line[actual][head + 1] == '%')) { // \% (percent)
					head++;
					break;
				}
				state = 3;
			} else if (line[actual][head] == '%') {
				if ((head==0) || (line[actual][head - 1] != '\\')) state = 5;
			}
			break;
		case 1: // wordchar
			apostrophe = 0;
			if (! is_wordchar(line[actual] + head) ||
			  (line[actual][head] == '\'' && line[actual][head+1] == '\'' && ++apostrophe)) {
				state = 0;
				char * t = alloc_token(token, &head);
				if (apostrophe) head += 2;
				if (t) return t;
			}
			break;
		case 2: // comment, labels, etc
			if (((i = look_pattern(1)) != -1) && 
				(strcmp(PATTERN[i].pat[1],PATTERN[pattern_num].pat[1]) == 0)) {
					state = 0;
					head += strlen(PATTERN[pattern_num].pat[1]) - 1;
			}
			break;
		case 3: // command
			if ((tolower(line[actual][head]) < 'a') || (tolower(line[actual][head]) > 'z')) {
				state = 0;
				head--;
			}
			break;
		case 4: // command with arguments
			if (slash && (line[actual][head] != '\0')) {
				slash = 0;
				head++;
				break;
			} else if (line[actual][head]=='\\') {
				slash = 1;
			} else if ((line[actual][head] == '{') ||
				((opt) && (line[actual][head] == '['))) {
					depth++;
					opt = 0;
			} else if (line[actual][head] == '}') {
				depth--;
				if (depth == 0) { 
					opt = 1;
					arg++;
				}
				if (((depth == 0) && (arg == PATTERN[pattern_num].arg)) ||
					(depth < 0) ) {
						state = 0; // XXX not handles the last optional arg.
				}
			} else if (line[actual][head] == ']') depth--;
		} // case
                if (next_char(line[actual], &head)) {
			if (state == 5) state = 0;
			return NULL;
		}
	}
}
