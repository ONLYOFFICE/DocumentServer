/* ---------------------------- progress output ---------------------- */
#include <stdlib.h>
#include <stdio.h>
#include "progress.h"

FILE *fp=NULL; /* output stream for progress info */ 
time_t printinterval = 10; /* approx. seconds between printouts, 1.. */

/* initialization of progress output, fname="<fileID>","<filename>","-"  */
int ini_progress(char *fname){
  int fd;
  if (fp) { fclose(fp); fp=NULL; }
  if (fname) if (fname[0]) {
    fd=atoi(fname);
    if(fd>255 || fname[((fd>99)?3:((fd>9)?2:1))]) fd=-1; /* be sure */
    if (fname[0]=='-' && fname[1]==0) { fp=stdout; }
#ifdef __USE_POSIX
    else if (fd>0) { fp=fdopen(fd,"w"); } /* not sure that "w" is ok ???? */
#endif
    else { fp=fopen(fname,"w");if(!fp)fp=fopen(fname,"a"); }
    if (!fp) {
      fprintf(stderr,"could not open %s for progress output\n",fname);
      return -1; /* no success */
    }
  }
  /* fprintf(stderr,"# progress: fd=%d\n",fileno(fp)); */
  return 0; /* no error */
}

progress_counter_t *open_progress(int maxcount, const char *name){
  progress_counter_t *pc;
  pc = (progress_counter_t*) malloc( sizeof(progress_counter_t) );
  if (!pc) return 0; /* nonfatal */
  pc->starttime = time(NULL);
  pc->maxcount = maxcount;
  pc->numskip = 0;
  pc->lastprintcount = -1;
  pc->name = name;
  pc->lastprinttime = pc->starttime;
  return pc;
}
/* free counter */
int close_progress(progress_counter_t *counter){
  if (counter) free(counter);
  return 0;
}
/* progress meter output 
 *   only 1output/10s, + estimated endtime (test on pixelfields)
 * ToDo: to stderr by default? remove subprogress, ini_progress? rm_progress?
 *   test on tcl
 */
int progress(int counter, progress_counter_t *pc){
  /* we try to save computing time, so we skip early */
  if ((!fp) || counter - pc->lastprintcount <= pc->numskip) return 0;
  {
    char cr='\n';
    time_t now = time(NULL);
#if 0 /* debugging */
    if (counter)
    fprintf(fp," progress %s %3d / %d  time %d  skip %d\n",
            pc->name,counter,pc->maxcount,(int)(now - pc->starttime),
            pc->numskip); fflush(fp);
#endif
    if (5*(now - pc->lastprinttime) < 2*printinterval
     && counter - pc->lastprintcount >= pc->numskip) {  /* save for tests */
      if (pc->numskip < 1024) pc->numskip += pc->numskip+1;
    }
    if (3*(now - pc->lastprinttime) < 2*printinterval ) {
      return 0; /* to early for printing */
    }
    if (2*(now - pc->lastprinttime) > 3*printinterval ) {
      pc->numskip >>= 1;  /* to late for printing */
    }
    if (fileno(fp)<3) cr='\r'; /* may be choosen in ini? */
    if (counter)
    fprintf(fp," progress %s %5d / %d  time[s] %5d / %5d  (skip=%d)%c",
            pc->name,counter,pc->maxcount,
            (int)(now - pc->starttime),  /* time gone since start */
            (int)(now - pc->starttime)*pc->maxcount/(counter), /* estimated */
            pc->numskip, cr);
    fflush(fp);
    pc->lastprintcount=counter;
    pc->lastprinttime=now;
  }
  return 0; /* no error */
}
/* --------------------- end of progress output ---------------------- */
