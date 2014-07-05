#include <cstring>
#include <cstdlib>
#include <cstdio>

#include "textparser.hxx"
#include "htmlparser.hxx"
#include "latexparser.hxx"

#ifndef W32
using namespace std;
#endif

int 
main(int argc, char** argv)
{
    FILE * f;
  /* first parse the command line options */

  if (argc < 2) {
    fprintf(stderr,"correct syntax is:\n"); 
    fprintf(stderr,"testparser file\n");
    fprintf(stderr,"example: testparser /dev/stdin\n");
    exit(1);
  }

  /* open the words to check list */
  f = fopen(argv[1],"r");
  if (!f) {
    fprintf(stderr,"Error - could not open file of words to check\n");
    exit(1);
  }

    TextParser * p = new LaTeXParser("qwertzuiopasdfghjklyxcvbnméáúõûóüöíQWERTZUIOPASDFGHJKLYXCVBNMÍÉÁÕÚÖÜÓÛ");
    
    char buf[MAXLNLEN];
    char * next;

    while(fgets(buf,MAXLNLEN,f)) {
      fprintf(stdout,"---------------------------------------\n");
      p->put_line(buf);
      fprintf(stderr, "x:%s\n", buf);
      p->set_url_checking(1);
      while ((next=p->next_token())) {
          fprintf(stdout,"token: %s\n",next);
	  free(next);
      }
    }

    delete p;
    fclose(f);
    return 0;
}

