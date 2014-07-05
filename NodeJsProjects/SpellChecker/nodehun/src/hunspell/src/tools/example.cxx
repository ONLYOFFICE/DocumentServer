#include <cstring>
#include <cstdlib>
#include <cstdio>

#include "hunspell.hxx"

extern char * mystrdup(const char * s);

using namespace std;

int 
main(int argc, char** argv)
{

    FILE* wtclst;

    /* first parse the command line options */

    if (argc < 4) {
        fprintf(stderr,"example (now it works with more dictionary files):\n"); 
        fprintf(stderr,"example affix_file dictionary_file(s) file_of_words_to_check\n");
        exit(1);
    }
  
    /* open the words to check list */
    wtclst = fopen(argv[argc - 1],"r");
    if (!wtclst) {
        fprintf(stderr,"Error - could not open file of words to check\n");
        exit(1);
    }
   
    int k;
    int dp;
    char buf[101];

    Hunspell * pMS= new Hunspell(argv[1], argv[2]);
    
    // load extra dictionaries
    if (argc > 4) for (k = 3; k < argc - 1; k++) pMS->add_dic(argv[k]);
    
    while(fgets(buf, 100, wtclst)) {
      k = strlen(buf);
      *(buf + k - 1) = '\0';
       dp = pMS->spell(buf);
       if (dp) {
          fprintf(stdout,"\"%s\" is okay\n",buf);
          fprintf(stdout,"\n");
       } else {
          fprintf(stdout,"\"%s\" is incorrect!\n",buf);
          fprintf(stdout,"   suggestions:\n");
          char ** wlst;
          int ns = pMS->suggest(&wlst,buf);
          for (int i=0; i < ns; i++) {
            fprintf(stdout,"    ...\"%s\"\n",wlst[i]);
          }
          pMS->free_list(&wlst, ns);
          fprintf(stdout,"\n");
       }
    }

    delete pMS;
    fclose(wtclst);
    return 0;
}

