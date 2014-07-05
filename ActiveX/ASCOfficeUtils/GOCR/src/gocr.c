/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2009  Joerg Schulenburg

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

 see README for EMAIL-address

  sometimes I have written comments in german language, sorry for that

 This file was retrieved from pgm2asc.cc of Joerg, in order to have
 a library of the ocr-engine from Klaas Freitag
 
 */
#include "config.h"
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <string.h>
#ifdef HAVE_GETTIMEOFDAY 
#include <sys/time.h>
#endif
#ifdef HAVE_UNISTD_H
#include <unistd.h>
#endif

#include "pnm.h"
#include "pgm2asc.h"
#include "pcx.h"
#include "ocr0.h"		/* only_numbers */
#include "progress.h"
#include "version.h"

static void out_version(int v) {
  fprintf(stderr, " Optical Character Recognition --- gocr "
          version_string " " release_string "\n"
          " Copyright (C) 2001-2009 Joerg Schulenburg  GPG=1024D/53BDFBE3\n"
          " released under the GNU General Public License\n");
  /* as recommended, (c) and license should be part of the binary */
  /* no email because of SPAM, see README for contacting the author */
  if (v)
    fprintf(stderr, " use option -h for help\n");
  if (v & 2)
    exit(1);
  return;
}

static void help(void) {
  out_version(0);
  /* output is shortened to essentials, see manual page for details */
  fprintf(stderr,
	  " using: gocr [options] pnm_file_name  # use - for stdin\n"
	  " options (see gocr manual pages for more details):\n"
	  " -h, --help\n"
	  " -i name   - input image file (pnm,pgm,pbm,ppm,pcx,...)\n"
	  " -o name   - output file  (redirection of stdout)\n"
	  " -e name   - logging file (redirection of stderr)\n"
	  " -x name   - progress output to fifo (see manual)\n"
	  " -p name   - database path including final slash (default is ./db/)\n");
  fprintf(stderr, /* string length less than 509 bytes for ISO C89 */
	  " -f fmt    - output format (ISO8859_1 TeX HTML XML UTF8 ASCII)\n"
	  " -l num    - threshold grey level 0<160<=255 (0 = autodetect)\n"
	  " -d num    - dust_size (remove small clusters, -1 = autodetect)\n"
	  " -s num    - spacewidth/dots (0 = autodetect)\n"
	  " -v num    - verbose (see manual page)\n"
	  " -c string - list of chars (debugging, see manual)\n"
	  " -C string - char filter (ex. hexdigits: ""0-9A-Fx"", only ASCII)\n"
	  " -m num    - operation modes (bitpattern, see manual)\n");
  fprintf(stderr, /* string length less than 509 bytes for ISO C89 */
	  " -a num    - value of certainty (in percent, 0..100, default=95)\n"
	  " -u string - output this string for every unrecognized character\n");
  fprintf(stderr, /* string length less than 509 bytes for ISO C89 */
	  " examples:\n"
	  "\tgocr -m 4 text1.pbm                   # do layout analyzis\n"
	  "\tgocr -m 130 -p ./database/ text1.pbm  # extend database\n"
	  "\tdjpeg -pnm -gray text.jpg | gocr -    # use jpeg-file via pipe\n"
	  "\n");
  fprintf(stderr, " webpage: http://jocr.sourceforge.net/\n");
  exit(0);
}

#ifdef HAVE_GETTIMEOFDAY
/* from the glibc documentation */
static int timeval_subtract (struct timeval *result, struct timeval *x, 
    struct timeval *y) {

  /* Perform the carry for the later subtraction by updating Y. */
  if (x->tv_usec < y->tv_usec) {
    int nsec = (y->tv_usec - x->tv_usec) / 1000000 + 1;
    y->tv_usec -= 1000000 * nsec;
    y->tv_sec += nsec;
  }
  if (x->tv_usec - y->tv_usec > 1000000) {
    int nsec = (x->tv_usec - y->tv_usec) / 1000000;
    y->tv_usec += 1000000 * nsec;
    y->tv_sec -= nsec;
  }

  /* Compute the time remaining to wait.
     `tv_usec' is certainly positive. */
  result->tv_sec = x->tv_sec - y->tv_sec;
  result->tv_usec = x->tv_usec - y->tv_usec;

  /* Return 1 if result is negative. */
  return x->tv_sec < y->tv_sec;
}
#endif

static void process_arguments(job_t *job, int argn, char *argv[])
{
  int i;
  char *s1;

  assert(job);

  if (argn <= 1) {
    out_version(1);
    exit(0);
  }
#ifdef HAVE_PGM_H
  pnm_init(&argn, &argv);
#endif
  
  /* process arguments */
  for (i = 1; i < argn; i++) {
    if (strcmp(argv[i], "--help") == 0)
      help(); /* and quits */
    if (argv[i][0] == '-' && argv[i][1] != 0) {
      s1 = "";
      if (i + 1 < argn)
	s1 = argv[i + 1];
      switch (argv[i][1]) {
      case 'h': /* help */
	help();
	break;
      case 'i': /* input image file */
	job->src.fname = s1;
	i++;
	break;
      case 'e': /* logging file */
	if (s1[0] == '-' && s1[1] == '\0') {
#ifdef HAVE_UNISTD_H
          dup2(STDOUT_FILENO, STDERR_FILENO); /* -e /dev/stdout  works */
#else
	  fprintf(stderr, "stderr redirection not possible without unistd.h\n");
#endif           
	}
	else if (!freopen(s1, "w", stderr)) {
	  fprintf(stderr, "stderr redirection to %s failed\n", s1);
	}
	i++;
	break;
      case 'p': /* database path */
	job->cfg.db_path=s1;
	i++;
	break;
      case 'o': /* output file */
	if (s1[0] == '-' && s1[1] == '\0') {	/* default */
	}
	else if (!freopen(s1, "w", stdout)) {
	  fprintf(stderr, "stdout redirection to %s failed\n", s1);
	};
	i++;
	break;
      case 'f': /* output format */
        if (strcmp(s1, "ISO8859_1") == 0) job->cfg.out_format=ISO8859_1; else
        if (strcmp(s1, "TeX")       == 0) job->cfg.out_format=TeX; else
        if (strcmp(s1, "HTML")      == 0) job->cfg.out_format=HTML; else
        if (strcmp(s1, "XML")       == 0) job->cfg.out_format=XML; else
        if (strcmp(s1, "SGML")      == 0) job->cfg.out_format=SGML; else
        if (strcmp(s1, "UTF8")      == 0) job->cfg.out_format=UTF8; else
        if (strcmp(s1, "ASCII")     == 0) job->cfg.out_format=ASCII; else
        fprintf(stderr,"Warning: unknown format (-f %s)\n",s1);
        i++;
        break;
      case 'c': /* list of chars (_ = not recognized chars) */
	job->cfg.lc = s1;
	i++;
	break;
      case 'C': /* char filter, default: NULL (all chars) */
        /* ToDo: UTF8 input, wchar */
	job->cfg.cfilter = s1;
	i++;
	break;
      case 'd': /* dust size */
	job->cfg.dust_size = atoi(s1);
	i++;
	break;
      case 'l': /* grey level 0<160<=255, 0 for autodetect */
	job->cfg.cs = atoi(s1);
	i++;
	break;
      case 's': /* spacewidth/dots (0 = autodetect) */
	job->cfg.spc = atoi(s1);
	i++;
	break;
      case 'v': /* verbose mode */
	job->cfg.verbose |= atoi(s1);
	i++;
	break;
      case 'm': /* operation modes */
	job->cfg.mode |= atoi(s1);
	i++;
	break;
      case 'n': /* numbers only */
	job->cfg.only_numbers = atoi(s1);
	i++;
	break;
      case 'x': /* initialize progress output s1=fname */
	ini_progress(s1);
	i++;
	break;
      case 'a': /* set certainty */
	job->cfg.certainty = atoi(s1);;
	i++;
	break;
      case 'u': /* output marker for unrecognized chars */
        job->cfg.unrec_marker = s1;
        i++;
        break;
      default:
	fprintf(stderr, "# unknown option use -h for help\n");
      }
      continue;
    }
    else /* argument can be filename v0.2.5 */ if (argv[i][0] != '-'
						   || argv[i][1] == '\0' ) {
      job->src.fname = argv[i];
    }
  }
}

static void mark_start(job_t *job) {
  assert(job);

  if (job->cfg.verbose) {
    out_version(0);
    /* insert some helpful info for support */
    fprintf(stderr, "# compiled: " __DATE__ );
#if defined(__GNUC__)
    fprintf(stderr, " GNUC-%d", __GNUC__ );
#endif
#ifdef __GNUC_MINOR__
    fprintf(stderr, ".%d", __GNUC_MINOR__ );
#endif
#if defined(__linux)
    fprintf(stderr, " linux");
#elif defined(__unix)
    fprintf(stderr, " unix");
#endif
#if defined(__WIN32) || defined(__WIN32__)
    fprintf(stderr, " WIN32");
#endif
#if defined(__WIN64) || defined(__WIN64__)
    fprintf(stderr, " WIN64");
#endif
#if defined(__VERSION__)
    fprintf(stderr, " version " __VERSION__ );
#endif
    fprintf(stderr, "\n");
    fprintf(stderr,
      "# options are: -l %d -s %d -v %d -c %s -m %d -d %d -n %d -a %d -C \"%s\"\n",
      job->cfg.cs, job->cfg.spc, job->cfg.verbose, job->cfg.lc, job->cfg.mode, 
      job->cfg.dust_size, job->cfg.only_numbers, job->cfg.certainty,
      job->cfg.cfilter);
    fprintf(stderr, "# file: %s\n", job->src.fname);
#ifdef USE_UNICODE
    fprintf(stderr,"# using unicode\n");
#endif
#ifdef HAVE_GETTIMEOFDAY
    gettimeofday(&job->tmp.init_time, NULL);
#endif
  }
}

static void mark_end(job_t *job) {
  assert(job);

#ifdef HAVE_GETTIMEOFDAY
  /* show elapsed time */
  if (job->cfg.verbose) {
    struct timeval end, result;
    gettimeofday(&end, NULL);
    timeval_subtract(&result, &end, &job->tmp.init_time);
    fprintf(stderr,"Elapsed time: %d:%02d:%3.3f.\n", (int)result.tv_sec/60,
	(int)result.tv_sec%60, (float)result.tv_usec/1000);
  }
#endif
}

static int read_picture(job_t *job) {
  int rc=0;
  assert(job);

  if (strstr(job->src.fname, ".pcx"))
    readpcx(job->src.fname, &job->src.p, job->cfg.verbose);
  else
    rc=readpgm(job->src.fname, &job->src.p, job->cfg.verbose);
  return rc; /* 1 for multiple images, 0 else */
}

static int read_picture2(job_t *job, char* buf, long size) {
  int rc=0;
  assert(job);

  rc=readpgmFromBuffer(buf, size, &job->src.p);
  return rc; /* 1 for multiple images, 0 else */
}

/* subject of change, we need more output for XML (ToDo) */
void print_output(job_t *job) {
  int linecounter = 0;
  const char *line;

  assert(job);
        
  linecounter = 0;
  line = getTextLine(linecounter++);
  while (line) {
    /* notice: decode() is shiftet to getTextLine since 0.38 */
    fputs(line, stdout);
    if (job->cfg.out_format==HTML) fputs("<br />",stdout);
    if (job->cfg.out_format!=XML)  fputc('\n', stdout);
    line = getTextLine(linecounter++);
  }
  free_textlines();
}

/* subject of change, we need more output for XML (ToDo) */
char* print_output2(job_t *job) {
  int linecounter = 0;
  const char *line;

  int len = 1024;   // initial buffer length for text line
  char *tmp = (char *)malloc(len);
  if ( !tmp ) { 
    fprintf(stderr,"malloc failed!\n"); // ToDo: index_to_error_list 
    return NULL;
  }
  *tmp = 0;

  assert(job);
        
  linecounter = 0;
  line = getTextLine(linecounter++);
  while (line) {
    /* notice: decode() is shiftet to getTextLine since 0.38 */
	tmp = append_to_line(tmp, line, &len);
    if (job->cfg.out_format==HTML)
	{
		tmp = append_to_line(tmp, "<br />", &len);
	}
    if (job->cfg.out_format!=XML)
	{
		tmp = append_to_line(tmp, "\n", &len);
	}
    line = getTextLine(linecounter++);
  }
  free_textlines();

  return tmp;
}

/* FIXME jb: remove JOB; */
job_t *JOB;

char* PNMToText(char* buf, long size, char *outputformat, long graylevel, long dustsize, long spacewidthdots, long certainty) {
  int multipnm=1;
  job_t job;

  char *tmp = NULL;

  JOB = &job;
  setvbuf(stdout, (char *) NULL, _IONBF, 0);	/* not buffered */
  
  while (multipnm==1) {

    job_init(&job);

	/* output format */
	if		(strcmp(outputformat, "ISO8859_1") == 0) job.cfg.out_format=ISO8859_1;
	else if (strcmp(outputformat, "TeX")       == 0) job.cfg.out_format=TeX;
	else if (strcmp(outputformat, "HTML")      == 0) job.cfg.out_format=HTML;
	else if (strcmp(outputformat, "XML")       == 0) job.cfg.out_format=XML;
	else if (strcmp(outputformat, "SGML")      == 0) job.cfg.out_format=SGML;
	else if (strcmp(outputformat, "UTF8")      == 0) job.cfg.out_format=UTF8;
	else if (strcmp(outputformat, "ASCII")     == 0) job.cfg.out_format=ASCII;

	/* grey level 0<160<=255, 0 for autodetect */
	job.cfg.cs = graylevel;
	/* dust size */
	job.cfg.dust_size = dustsize;
	/* spacewidth/dots (0 = autodetect) */
	job.cfg.spc = spacewidthdots;
	/* set certainty */
	job.cfg.certainty = certainty;

//    process_arguments(&job, argn, argv);

    mark_start(&job);
//    multipnm = read_picture(&job);
    multipnm = read_picture2(&job, buf, size);
    /* separation of main and rest for using as lib
       this will be changed later => introduction of set_option()
       for better communication to the engine  */
    if (multipnm<0) break; /* read error */
  
    /* call main loop */
    pgm2asc(&job);

    mark_end(&job);
  
	tmp=print_output2(&job);

    job_free(&job);
  
  }
  
  return tmp;
}
