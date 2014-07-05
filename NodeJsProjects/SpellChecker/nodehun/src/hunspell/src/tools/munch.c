/* Munch a word list and generate a smaller root word list with affixes*/

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

#include "munch.h"

int main(int argc, char** argv)
{

  int i, j, k, n;
  int rl, p , nwl;
  int al;

  FILE * wrdlst;
  FILE * afflst;

  char *nword, *wf, *af;
  char as[(MAX_PREFIXES + MAX_SUFFIXES)];
  char * ap;

  struct hentry * ep;
  struct hentry * ep1;
  struct affent * pfxp;
  struct affent * sfxp;

  /* first parse the command line options */
  /* arg1 - wordlist, arg2 - affix file */

  if (argv[1]) {
       wf = mystrdup(argv[1]);
  } else {
    fprintf(stderr,"correct syntax is:\n"); 
    fprintf(stderr,"munch word_list_file affix_file\n");
    exit(1);
  }
  if (argv[2]) {
       af = mystrdup(argv[2]);
  } else {
    fprintf(stderr,"correct syntax is:\n"); 
    fprintf(stderr,"munch word_list_file affix_file\n");
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

  if (load_tables(wrdlst)) {
    fprintf(stderr,"Error building hash tables\n");
    exit(1);
  }
  fclose(wrdlst);

  for (i=0; i< tablesize; i++) {
    ep = &tableptr[i];
    if (ep->word == NULL) continue;
    for (  ;  ep != NULL;  ep = ep->next) {
      numroots = 0;
      aff_chk(ep->word,strlen(ep->word));
      if (numroots) {
            /* now there might be a number of combinations */
            /* of prefixes and suffixes that might match this */
            /* word.  So how to choose?  As a first shot look */
            /* for the shortest remaining root word to */
            /* to maximize the combinatorial power */

	    /* but be careful, do not REQUIRE a specific combination */
            /* of a prefix and a suffix to generate the word since */
            /* that violates the rule that the root word with just */
            /* the prefix or just the suffix must also exist in the */
            /* wordlist as well */

	    /* in fact because of the cross product issue, this not a  */
	    /* simple choice since some combinations of previous */ 
	    /* prefixes and new suffixes may not be valid. */
	    /*  The only way to know is to simply try them all */
  
            rl = 1000;
            p = -1;

            for (j = 0; j < numroots; j++){

	      /* first collect the root word info and build up */
              /* the potential new affix string */
               nword = (roots[j].hashent)->word;
               nwl = strlen(nword);
               *as = '\0';
               al = 0;
               ap = as;
               if (roots[j].prefix) *ap++ = (roots[j].prefix)->achar;
               if (roots[j].suffix) *ap++ = (roots[j].suffix)->achar;
               if ((roots[j].hashent)->affstr) {
		   strcpy(ap,(roots[j].hashent)->affstr);
               } else {
		 *ap = '\0';
               }
               al =strlen(as);

               /* now expand the potential affix string to generate */
               /* all legal words and make sure they all exist in the */
               /* word list */
               numwords = 0;
               wlist[numwords].word = mystrdup(nword);
               wlist[numwords].pallow = 0;
               numwords++;
               n = 0;
               if (al)
		 expand_rootword(nword,nwl,as,al);
               for (k=0; k<numwords; k++) {
		 if (lookup(wlist[k].word)) n++;
                 free(wlist[k].word);
                 wlist[k].word = NULL;
                 wlist[k].pallow = 0;
               }

               /* if all exist in word list then okay */
               if (n == numwords) {               
                  if (nwl < rl) {
                     rl = nwl;
                     p = j;
                  }
               }
            }
            if (p != -1) {
               ep1 = roots[p].hashent;
               pfxp = roots[p].prefix;
               sfxp = roots[p].suffix;
               ep1->keep = 1;
               if (pfxp != NULL) add_affix_char(ep1,pfxp->achar);
               if (sfxp != NULL) add_affix_char(ep1,sfxp->achar);
            } else {
	      ep->keep = 1;
            }
      } else {
            ep->keep = 1;
      }
    }
  }

  /* now output only the words to keep along with affixes info */
  /* first count how many words that is */
  k = 0;
  for (i=0; i< tablesize; i++) {
    ep = &tableptr[i];
    if (ep->word == NULL) continue;
    for (  ;  ep != NULL;  ep = ep->next) {
       if (ep->keep > 0) k++;
    }
  }
  fprintf(stdout,"%d\n",k);

  for (i=0; i< tablesize; i++) {
    ep = &tableptr[i];
    if (ep->word == NULL) continue;
    for (  ;  ep != NULL;  ep = ep->next) {
      if (ep->keep > 0) {
        if (ep->affstr != NULL) { 
	  fprintf(stdout,"%s/%s\n",ep->word,ep->affstr);
	} else {
          fprintf(stdout,"%s\n",ep->word);
        }
      }
    }
  }
  return 0;
}


int parse_aff_file(FILE * afflst)
{  
    int i, j;
    int numents = 0;
    char achar = '\0';
    short ff=0;
    char ft;
    struct affent * ptr= NULL;
    struct affent * nptr= NULL;
    char * line = malloc(MAX_LN_LEN);

    while (fgets(line,MAX_LN_LEN,afflst)) {
       mychomp(line);
       ft = ' ';
       fprintf(stderr,"parsing line: %s\n",line);
       if (strncmp(line,"PFX",3) == 0) ft = 'P';
       if (strncmp(line,"SFX",3) == 0) ft = 'S';
       if (ft != ' ') {
          char * tp = line;
          char * piece;
          i = 0;
          ff = 0;
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
             fprintf(stderr,"ptable %d num is %d\n",numpfx,ptable[numpfx].num);
             numpfx++;
          } else {
             stable[numsfx].aep = ptr;
             stable[numsfx].num = numents;
             fprintf(stderr,"stable %d num is %d\n",numsfx,stable[numsfx].num);
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



/* search for a prefix */
void pfx_chk (const char * word, int len, struct affent* ep, int num)
{
    struct affent *     aent;
    int			cond;
    int	tlen;
    struct hentry *	hent;
    unsigned char *	cp;		
    int			i;
    char	        tword[MAX_WD_LEN];

    for (aent = ep, i = num; i > 0; aent++, i--) {

	tlen = len - aent->appndl;

	if (tlen > 0 &&  (aent->appndl == 0 ||  
            strncmp(aent->appnd, word, aent->appndl) == 0)
	    &&  tlen + aent->stripl >= aent->numconds) {

	    if (aent->stripl) strcpy (tword, aent->strip);
	    strcpy((tword + aent->stripl), (word + aent->appndl));

            /* now go through the conds and make sure they all match */
	    cp = (unsigned char *) tword;
	    for (cond = 0;  cond < aent->numconds;  cond++) {
		if ((aent->conds[*cp++] & (1 << cond)) == 0)
		    break;
	    }

	    if (cond >= aent->numconds) {
		tlen += aent->stripl;
		if ((hent = lookup(tword)) != NULL) {
		   if (numroots < MAX_ROOTS) {
		       roots[numroots].hashent = hent;
		       roots[numroots].prefix = aent;
		       roots[numroots].suffix = NULL;
		       numroots++;
		   }
		}
	    }
	}
    }
}



void suf_chk (const char * word, int len, struct affent * ep, 
              int num, struct affent * pfxent, int cpflag)
{
    struct affent *     aent;	
    int	                tlen;	
    int			cond;	
    struct hentry *	hent;	
    unsigned char *	cp;
    int			i;
    char	        tword[MAX_WD_LEN];

    for (aent = ep, i = num; i > 0; aent++, i--) {

        if ((cpflag & XPRODUCT) != 0 &&  (aent->xpflg & XPRODUCT) == 0)
	    continue;

	tlen = len - aent->appndl;
	if (tlen > 0  &&  (aent->appndl == 0 ||  
            strcmp(aent->appnd, (word + tlen)) == 0)
	    &&  tlen + aent->stripl >= aent->numconds) {

	    strcpy (tword, word);
	    cp = (unsigned char *) (tword + tlen);
	    if (aent->stripl) {
	       strcpy ((char *)cp, aent->strip);
	       tlen += aent->stripl;
	       cp = (unsigned char *)(tword + tlen);
	    } else *cp = '\0';

	    for (cond = aent->numconds;  --cond >= 0;  ) {
		if ((aent->conds[*--cp] & (1 << cond)) == 0) break;
	    }
	    if (cond < 0) {
	       if ((hent = lookup(tword)) != NULL) {
		  if (numroots < MAX_ROOTS) {
		     roots[numroots].hashent = hent;
		     roots[numroots].prefix = pfxent;
		     roots[numroots].suffix = aent;
		     numroots++;
		  }
	       }
	    }
	}
    }
}



void aff_chk (const char * word, int len)
{
    int i;
    int j;
    int nh=0;
    char * nword;
    int nwl;

    if (len < 4) return;

    for (i=0; i < numpfx; i++) {
       pfx_chk(word, len, ptable[i].aep, ptable[i].num);
    }

    nh = numroots;

    if (nh > 0) {
       for (j=0;j<nh;j++){
         if (roots[j].prefix->xpflg & XPRODUCT) {
            nword = mystrdup((roots[j].hashent)->word);
            nwl = strlen(nword);
            for (i=0; i < numsfx; i++) {
               suf_chk(nword,nwl,stable[i].aep, stable[i].num, roots[j].prefix, XPRODUCT);
            }
            free(nword);
         }
       }
    }
    for (i=0; i < numsfx; i++) {
       suf_chk(word, len, stable[i].aep, stable[i].num, NULL, 0);
    }
}



/* lookup a root word in the hashtable */

struct hentry * lookup(const char *word)
{
    struct hentry * dp;
    dp = &tableptr[hash(word)];
    if (dp->word == NULL) return NULL;
    for (  ;  dp != NULL;  dp = dp->next) {
      if (strcmp(word,dp->word) == 0) return dp;
    }
    return NULL;
}



/* add a word to the hash table */

int add_word(char * word)
{
    int i;
    struct hentry * dp;
    struct hentry * hp = (struct hentry *) malloc (sizeof(struct hentry));

    hp->word = word;
    hp->affstr = NULL;
    hp->keep = 0;
    hp->next = NULL;

    i = hash(word);
    dp = &tableptr[i];
    
    if (dp->word == NULL) {
      *dp = *hp;
       free(hp);
    } else {
      while (dp->next != NULL) dp=dp->next; 
      dp->next = hp;
    }
    return 0;
}     



/* load a word list and build a hash table on the fly */

int load_tables(FILE * wdlst)
{
  char * ap;
  char ts[MAX_LN_LEN];

  /* first read the first line of file to get hash table size */
  if (! fgets(ts, MAX_LN_LEN-1,wdlst)) return 2;
  mychomp(ts);
  tablesize = atoi(ts);
  tablesize = tablesize + 5;
  if ((tablesize %2) == 0) tablesize++;

  /* allocate the hash table */
  tableptr = (struct hentry *) calloc(tablesize, sizeof(struct hentry));
  if (! tableptr) return 3;

  /* loop thorugh all words on much list and add to hash
   * table and store away word and affix strings in tmpfile
   */

  while (fgets(ts,MAX_LN_LEN-1,wdlst)) {
    mychomp(ts);
    ap = mystrdup(ts);
    add_word(ap);

  }
  return 0;
}


/* the hash function is a simple load and rotate
 * algorithm borrowed
 */

int hash(const char * word)
{
    int i;
    long  hv = 0;
    for (i=0; i < 4  &&  *word != 0; i++)
	hv = (hv << 8) | (*word++);
    while (*word != 0) {
      ROTATE(hv,ROTATE_LEN);
      hv ^= (*word++);
    }
    return (unsigned long) hv % tablesize;
}


void add_affix_char(struct hentry * ep, char ac)
{
  int al;
  int i;
  char * tmp;
  if (ep->affstr == NULL) {
     ep->affstr = (char *) malloc(2);
     *(ep->affstr) = ac;
     *((ep->affstr)+1) = '\0';
     return;
  }
  al = strlen(ep->affstr);
  for (i=0; i< al; i++)
    if (ac == (ep->affstr)[i]) return;
  tmp = calloc(al+2,1);
  memcpy(tmp,ep->affstr,(al+1));
  *(tmp+al) = ac;
  *(tmp+al+1)='\0';
  free(ep->affstr);
  ep->affstr = tmp;
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
        if ((len > aent->stripl) && (len >= aent->numconds)) {

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

      if ((len > aent->stripl) && (len >= aent->numconds)) {
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
  if (k > 0) *(s+k-1) = '\0';
  if ((k > 1) && (*(s+k-2) == '\r')) *(s+k-2) = '\0';
}

