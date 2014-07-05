
#include <cstring>
#include <cstdlib>
#include <cstdio>

#include "hunspell.hxx"

#ifndef WIN32
using namespace std;
#endif



int main(int argc, char **argv)
{

    FILE *wtclst;
    int i;
    int dp;
    char buf[101];
    Hunspell *pMS;

    /* first parse the command line options */

    for (i = 1; i < 3; i++)
	if (!argv[i]) {
	    fprintf(stderr, "correct syntax is:\nanalyze affix_file");
	    fprintf(stderr, " dictionary_file file_of_words_to_check\n");
	    fprintf(stderr, "use two words per line for morphological generation\n");
	    exit(1);
	}

    /* open the words to check list */

    wtclst = fopen(argv[3], "r");
    if (!wtclst) {
	fprintf(stderr, "Error - could not open file to check\n");
	exit(1);
    }

    pMS = new Hunspell(argv[1], argv[2]);
    while (fgets(buf, 100, wtclst)) {
        *(buf + strlen(buf) - 1) = '\0';
        if (*buf == '\0') continue;
        // morphgen demo
        char * s = strchr(buf, ' ');
        if (s) {
            *s = '\0';
            char ** result;
            int n = pMS->generate(&result, buf, s+1);
            for (int i = 0; i < n; i++) {
                fprintf(stdout, "generate(%s, %s) = %s\n", buf, s+1, result[i]);
            }
            pMS->free_list(&result, n);
            if (n == 0) fprintf(stdout, "generate(%s, %s) = NO DATA\n", buf, s+1);
        } else {
            dp = pMS->spell(buf);
            fprintf(stdout, "> %s\n", buf);
	    if (dp) {
                char ** result;
                int n = pMS->analyze(&result, buf);
                for (int i = 0; i < n; i++) {
                    fprintf(stdout, "analyze(%s) = %s\n", buf, result[i]);
                }
                pMS->free_list(&result, n);
                n = pMS->stem(&result, buf);
                for (int i = 0; i < n; i++) {
                    fprintf(stdout, "stem(%s) = %s\n", buf, result[i]);
                }
                pMS->free_list(&result, n);
            } else {
                fprintf(stdout, "Unknown word.\n");
            }
        }
    }
    delete pMS;
    fclose(wtclst);
    return 0;
}
