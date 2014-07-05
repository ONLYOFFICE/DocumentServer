/*
     ---------------------- progress output ----------------------
    output progress for GUIs to a pipe
    format: "counter_name"  counter maxcounter time estimated_time \r|\n
 */
#ifndef GOCR_PROGRESS_H
#define GOCR_PROGRESS_H "Oct06"
#include <time.h>

/* initialization of progress output, fname="<fileID>","<filename>","-"  */
int ini_progress(char *fname);

/* ToDo: add by open_* and close_* */
/* place to store values for progress calculation, called often, but
 * dont call systime so often 
 */
typedef struct progress_counter {
 const char *name;      /* name of counter */
 int lastprintcount;    /* last counter printed for extrapolation */
 int maxcount;          /* max counter */
 int numskip;           /* num of counts to skip before timecall 0..maxcount */
 time_t starttime;      /* start time of this counter */
 time_t lastprinttime;  /* last time printed in seconds */
 
} progress_counter_t;

/* progress output p1=main_progress_0..100% p2=sub_progress_0..100% */
/* ToDo: improved_progress: counter, maxcount(ini), counter_name(ini),
 *   printinterval=10 # time before printing out progressmeter
 *   *numskip=1  # if (counter-lastprintcounter<numskip) return; gettime() ...
 *   *startutime, *lastprintutime, *lastprintcounter  # numskip*=2 or /=2
 *   only 1output/10s, + estimated endtime (test on pixelfields)
 *   to stderr by default? remove subprogress, ini_progress? rm_progress?
 *   test on tcl
 */
progress_counter_t *open_progress(int maxcount, const char *name);
/* free counter */
int close_progress(progress_counter_t *counter);
/* output progress for pc */
int progress(int counter, progress_counter_t *pc);
/* --------------------- end of progress output ---------------------- */
#endif
