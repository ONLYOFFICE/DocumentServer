/* Un-munch a root word list with affix tags 
 * to recreate the original word list 
 */

#include <ctype.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#ifdef __linux__
#include <error.h>
#include <errno.h>
#include <sys/mman.h>
#endif

#include "unmunch.h"


int main(int argc, char** argv)
{

  int i;
  int al, wl;

  FILE * wrdlst;
  FILE * afflst;

  char *wf, *af;
  char * ap;
  char ts[MAX_LN_LEN];

  /* first parse the command line options */
  /* arg1 - munched wordlist, arg2 - affix file */

  if (argv[1]) {
       wf = mystrdup(argv[1]);
  } else {
    fprintf(stderr,"correct syntax is:\n"); 
    fprintf(stderr,"unmunch dic_file affix_file\n");
    exit(1);
  }
  if (argv[2]) {
       af = mystrdup(argv[2]);
  } else {
    fprintf(stderr,"correct syntax is:\n"); 
    fprintf(stderr,"unmunch dic_file affix_file\n");
    exit(1);
  }

  /* open the affix file */
  afflst = fopen(af,"r");
  if (!afflst) {
    fprintf(stderr,"Error - could not open affix description file\n");
    exit(1);
  }

  /* step one is to parse the affix file building up the internal
     affix data structures */

  numpfx = 0;
  numsfx = 0;
  fullstrip = 0;

  if (parse_aff_file(afflst)) {
    fprintf(stderr,"Error - in affix file loading\n");
    exit(1);
  }

  fclose(afflst);

  fprintf(stderr,"parsed in %d prefixes and %d suffixes\n",numpfx,numsfx);

  /* affix file is now parsed so create hash table of wordlist on the fly */

  /* open the wordlist */
  wrdlst = fopen(wf,"r");
  if (!wrdlst) {
    fprintf(stderr,"Error - could not open word list file\n");
    exit(1);
  }

  /* skip over the hash table size */
  if (! fgets(ts, MAX_LN_LEN-1,wrdlst)) {
    fclose(wrdlst);
    return 2;
  }
  mychomp(ts);

  while (fgets(ts,MAX_LN_LEN-1,wrdlst)) {
    mychomp(ts);
    /* split each line into word and affix char strings */
    ap = strchr(ts,'/');
    if (ap) {
      *ap = '\0';
      ap++;
      al = strlen(ap);
    } else {
      al = 0;
      ap = NULL;
    }

    wl = strlen(ts);

    numwords = 0;
    wlist[numwords].word = mystrdup(ts);
    wlist[numwords].pallow = 0;
    numwords++;
    
    if (al)
       expand_rootword(ts,wl,ap,al);
  
    for (i=0; i < numwords; i++) {
      fprintf(stdout,"%s\n",wlist[i].word);
      free(wlist[i].word);
      wlist[i].word = NULL;
      wlist[i].pallow = 0;
    }

  }

  fclose(wrdlst);
  return 0;
}




int parse_aff_file(FILE * afflst)
{  
    int i, j;
    int numents=0;
    char achar='\0';
    short ff=0;
    char ft;
    struct affent * ptr= NULL;
    struct affent * nptr= NULL;
    char * line = malloc(MAX_LN_LEN);

    while (fgets(line,MAX_LN_LEN,afflst)) {
       mychomp(line);
       ft = ' ';
       fprintf(stderr,"parsing line: %s\n",line);
       if (strncmp(line,"FULLSTRIP",9) == 0) fullstrip = 1;
       if (strncmp(line,"PFX",3) == 0) ft = 'P';
       if (strncmp(line,"SFX",3) == 0) ft = 'S';
       if (ft != ' ') {
          char * tp = line;
          char * piece;
	  ff = 0;
          i = 0;
          while ((piece=mystrsep(&tp,' '))) {
             if (*piece != '\0') {
                 switch(i) {
                    case 0: break;
                    case 1: { achar = *piece; break; }
                    case 2: { if (*piece == 'Y') ff = XPRODUCT; break; }
                    case 3: { numents = atoi(piece); 
                              ptr = malloc(numents * sizeof(struct affent));
                              ptr->achar = achar;
                              ptr->xpflg = ff;
	                      fprintf(stderr,"parsing %c entries %d\n",achar,numents);
                              break;
                            }
		    default: break;
                 }
                 i++;
             }
             free(piece);
          }
          /* now parse all of the sub entries*/
          nptr = ptr;
          for (j=0; j < numents; j++) {
             if (!fgets(line,MAX_LN_LEN,afflst)) return 1;
             mychomp(line);
             tp = line;
             i = 0;
             while ((piece=mystrsep(&tp,' '))) {
                if (*piece != '\0') {
                    switch(i) {
                       case 0: { if (nptr != ptr) {
                                   nptr->achar = ptr->achar;
                                   nptr->xpflg = ptr->xpflg;
                                 }
                                 break;
                               }
                       case 1: break;
                       case 2: { nptr->strip = mystrdup(piece);
                                 nptr->stripl = strlen(nptr->strip);
                                 if (strcmp(nptr->strip,"0") == 0) {
                                   free(nptr->strip);
                                   nptr->strip=mystrdup("");
				   nptr->stripl = 0;
                                 }   
                                 break; 
                               }
                       case 3: { nptr->appnd = mystrdup(piece);
                                 nptr->appndl = strlen(nptr->appnd);
                                 if (strcmp(nptr->appnd,"0") == 0) {
                                   free(nptr->appnd);
                                   nptr->appnd=mystrdup("");
				   nptr->appndl = 0;
                                 }   
                                 break; 
                               }
                       case 4: { encodeit(nptr,piece);}
                               fprintf(stderr, "   affix: %s %d, strip: %s %d\n",nptr->appnd,
                                                   nptr->appndl,nptr->strip,nptr->stripl);
		       default: break;
                    }
                    i++;
                }
                free(piece);
             }
             nptr++;
          }
          if (ft == 'P') {
             ptable[numpfx].aep = ptr;
             ptable[numpfx].num = numents;
             fprintf(stderr,"ptable %d num is %d flag %c\n",numpfx,ptable[numpfx].num,ptr->achar);
             numpfx++;
          } else {
             stable[numsfx].aep = ptr;
             stable[numsfx].num = numents;
             fprintf(stderr,"stable %d num is %d flag %c\n",numsfx,stable[numsfx].num,ptr->achar);
             numsfx++;
          }
          ptr = NULL;
          nptr = NULL;
          numents = 0;
          achar='\0';
       }
    }
    free(line);
    return 0;
}


void encodeit(struct affent * ptr, char * cs)
{
  int nc;
  int neg;
  int grp;
  unsigned char c;
  int n;
  int ec;   
  int nm;
  int i, j, k;
  unsigned char mbr[MAX_WD_LEN];

  /* now clear the conditions array */
  for (i=0;i<SET_SIZE;i++) ptr->conds[i] = (unsigned char) 0;

  /* now parse the string to create the conds array */
  nc = strlen(cs);
  neg = 0;  /* complement indicator */
  grp = 0;  /* group indicator */
  n = 0;    /* number of conditions */
  ec = 0;   /* end condition indicator */
  nm = 0;   /* number of member in group */
  i = 0;
  if (strcmp(cs,".")==0) {
    ptr->numconds = 0;
    return;
  }
  while (i < nc) {
    c = *((unsigned char *)(cs + i));
    if (c == '[') {
       grp = 1;
       c = 0;
    }
    if ((grp == 1) && (c == '^')) {
       neg = 1;
       c = 0;
    }
    if (c == ']') {
       ec = 1;
       c = 0;
    }
    if ((grp == 1) && (c != 0)) {
      *(mbr + nm) = c;
      nm++;
      c = 0;
    }
    if (c != 0) {
       ec = 1;
    }
    if (ec) {
      if (grp == 1) {
        if (neg == 0) {
	  for (j=0;j<nm;j++) {
	     k = (unsigned int) mbr[j];
             ptr->conds[k] = ptr->conds[k] | (1 << n);
          }
	} else {
	   for (j=0;j<SET_SIZE;j++) ptr->conds[j] = ptr->conds[j] | (1 << n);
	   for (j=0;j<nm;j++) {
	     k = (unsigned int) mbr[j];
             ptr->conds[k] = ptr->conds[k] & ~(1 << n);
	   }
        }
        neg = 0;
        grp = 0;   
        nm = 0;
      } else {
	/* not a group so just set the proper bit for this char */
	/* but first handle special case of . inside condition */
	if (c == '.') {
	  /* wild card character so set them all */
	  for (j=0;j<SET_SIZE;j++) ptr->conds[j] = ptr->conds[j] | (1 << n);
	} else {
	  ptr->conds[(unsigned int) c] = ptr->conds[(unsigned int)c] | (1 << n);
	}
      }
      n++;
      ec = 0;
    }
    i++;
  }
  ptr->numconds = n;
  return;
}



/* add a prefix to word */
void pfx_add (const char * word, int len, struct affent* ep, int num)
{
    struct affent *     aent;
    int			cond;
    int	tlen;
    unsigned char *	cp;		
    int			i;
    char *              pp;
    char	        tword[MAX_WD_LEN];

    
    for (aent = ep, i = num; i > 0; aent++, i--) {

        /* now make sure all conditions match */        
        if ((len + fullstrip > aent->stripl) && (len >= aent->numconds) &&
            ((aent->stripl == 0) ||
            (strncmp(aent->strip, word, aent->stripl) == 0))) {

            cp = (unsigned char *) word;
            for (cond = 0;  cond < aent->numconds;  cond++) {
	       if ((aent->conds[*cp++] & (1 << cond)) == 0)
	          break;
            }
            if (cond >= aent->numconds) {

	      /* we have a match so add prefix */
              tlen = 0;
              if (aent->appndl) {
	          strcpy(tword,aent->appnd);
                  tlen += aent->appndl;
               } 
               pp = tword + tlen;
               strcpy(pp, (word + aent->stripl));
               tlen = tlen + len - aent->stripl;

               if (numwords < MAX_WORDS) {
                  wlist[numwords].word = mystrdup(tword);
                  wlist[numwords].pallow = 0;
                  numwords++;
               }
	    }
	}
    }
}


/* add a suffix to a word */
void suf_add (const char * word, int len, struct affent * ep, int num)
{
    struct affent *     aent;	
    int	                tlen;	
    int			cond;	
    unsigned char *	cp;
    int			i;
    char	        tword[MAX_WD_LEN];
    char *              pp;

    for (aent = ep, i = num; i > 0; aent++, i--) {

      /* if conditions hold on root word 
       * then strip off strip string and add suffix
       */

      if ((len + fullstrip > aent->stripl) && (len >= aent->numconds) &&
            ((aent->stripl == 0) ||
            (strcmp(aent->strip, word + len - aent->stripl) == 0))) {
	cp = (unsigned char *) (word + len);
	for (cond = aent->numconds;  --cond >= 0;  ) {
	    if ((aent->conds[*--cp] & (1 << cond)) == 0) break;
	}
	if (cond < 0) {
	  /* we have a matching condition */
          strcpy(tword,word);
          tlen = len;
	  if (aent->stripl) {
             tlen -= aent->stripl;
          }
          pp = (tword + tlen);
          if (aent->appndl) {
	       strcpy (pp, aent->appnd);
	       tlen += aent->stripl;
	  } else *pp = '\0';

          if (numwords < MAX_WORDS) {
              wlist[numwords].word = mystrdup(tword);
              wlist[numwords].pallow = (aent->xpflg & XPRODUCT);
              numwords++;
          }
	}
      }
    }
}



int expand_rootword(const char * ts, int wl, const char * ap, int al)
{
    int i;
    int j;
    int nh=0;
    int nwl;

    for (i=0; i < numsfx; i++) {
      if (strchr(ap,(stable[i].aep)->achar)) {
         suf_add(ts, wl, stable[i].aep, stable[i].num);
      }
    }
   
    nh = numwords;

    if (nh > 1) {
       for (j=1;j<nh;j++){
         if (wlist[j].pallow) {
            for (i=0; i < numpfx; i++) {
               if (strchr(ap,(ptable[i].aep)->achar)) {
		 if ((ptable[i].aep)->xpflg & XPRODUCT) {
                   nwl = strlen(wlist[j].word);
                   pfx_add(wlist[j].word, nwl, ptable[i].aep, ptable[i].num);
		 }
	       }
	    }
	 }
       }
    }

    for (i=0; i < numpfx; i++) {
       if (strchr(ap,(ptable[i].aep)->achar)) {
          pfx_add(ts, wl, ptable[i].aep, ptable[i].num);
       }
    }
    return 0;
}


/* strip strings into token based on single char delimiter
 * acts like strsep() but only uses a delim char and not
 * a delim string
 */
char * mystrsep(char ** stringp, const char delim)
{
  char * rv = NULL;
  char * mp = *stringp;
  int n = strlen(mp);
  if (n > 0) {
    char * dp = (char *)memchr(mp,(int)((unsigned char)delim),n);
    if (dp) {
      int nc;
      *stringp = dp+1;
      nc = (int)((unsigned long)dp - (unsigned long)mp);
      rv = (char *) malloc(nc+1);
      if (rv) {
        memcpy(rv,mp,nc);
        *(rv+nc) = '\0';
      }
    } else {
      rv = (char *) malloc(n+1);
      if (rv) {
        memcpy(rv, mp, n);
        *(rv+n) = '\0';
        *stringp = mp + n;
      }
    }
  }
  return rv;
}


char * mystrdup(const char * s)
{
  char * d = NULL;
  if (s) {
    int sl = strlen(s)+1;
    d = (char *) malloc(sl);
    if (d) memcpy(d,s,sl);
  }
  return d;
}


void mychomp(char * s)
{
  int k = strlen(s);
  if ((k > 0) && (*(s+k-1) == '\n')) *(s+k-1) = '\0';
  if ((k > 1) && (*(s+k-2) == '\r')) *(s+k-2) = '\0';
}

