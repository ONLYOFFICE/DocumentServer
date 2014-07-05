#include <cstring>
#include <cstdlib>
#include <cstdio>

#include "hunspell.hxx"
#include "textparser.hxx"

#ifndef W32
using namespace std;
#endif

int 
main(int argc, char** argv)
{
    FILE * f;
    
    /* first parse the command line options */

    for (int i = 1; i < 6; i++)
	if (!argv[i]) {
	    fprintf(stderr, 
	    "chmorph - change affixes by morphological analysis and generation\n" 
	    "correct syntax is:\nchmorph affix_file "
            "dictionary_file file_to_convert STRING1 STRING2\n"
            "STRINGS may be arbitrary parts of the morphological descriptions\n"
	    "example: chmorph hu.aff hu.dic hu.txt SG_2 SG_3 "
	    " (convert informal Hungarian second person texts to formal third person texts)\n");
	    exit(1);
	}

    /* open the words to check list */

    f = fopen(argv[3], "r");
    if (!f) {
	fprintf(stderr, "Error - could not open file to check\n");
	exit(1);
    }

    Hunspell *pMS = new Hunspell(argv[1], argv[2]);
    TextParser * p = new TextParser("qwertzuiopasdfghjklyxcvbnméáúõûóüöíQWERTZUIOPASDFGHJKLYXCVBNMÍÉÁÕÚÖÜÓÛ");
    
    char buf[MAXLNLEN];
    char * next;

    while(fgets(buf,MAXLNLEN,f)) {
      p->put_line(buf);
      while ((next=p->next_token())) {
          char ** pl;
          int pln = pMS->analyze(&pl, next);
 	  if (pln) {
 	        int gen = 0;
 	        for (int i = 0; i < pln; i++) {
	  	    char *pos = strstr(pl[i], argv[4]);
	  	    if (pos) {
	  	        char * r = (char * ) malloc(strlen(pl[i]) -
	  	            strlen(argv[4]) + strlen(argv[5]) + 1);
	  	        strncpy(r, pl[i], pos - pl[i]);
	  	        strcpy(r + (pos - pl[i]), argv[5]);
	  	        strcat(r, pos + strlen(argv[4]));
	  	        free(pl[i]);
	  	        pl[i] = r;
	  	        gen = 1;
	  	    }
 	        }
	  	if (gen) {
		    char **pl2;
		    int pl2n = pMS->generate(&pl2, next, pl, pln);
		    if (pl2n) {
		        p->change_token(pl2[0]);
		        pMS->free_list(&pl2, pl2n);
		        // jump over the (possibly un)modified word
		        free(next);
		        next=p->next_token();
		    }
		}
		pMS->free_list(&pl, pln);
	  }
	  free(next);
      }
      fprintf(stdout, "%s\n", p->get_line());
    }

    delete p;
    fclose(f);
    return 0;
}
