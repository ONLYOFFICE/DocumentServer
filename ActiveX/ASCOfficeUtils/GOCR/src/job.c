/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2006  Joerg Schulenburg

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

 see README for email address */

#include "pgm2asc.h"
#include "gocr.h"

/* initialize job structure */
void job_init(job_t *job) {
  /* init source */
  job->src.fname = "-";
  /* FIXME jb: init pix */  
  job->src.p.p = NULL;

  /* init results */
  list_init( &job->res.boxlist );
  list_init( &job->res.linelist ); 
  job->res.avX = 5;
  job->res.avY = 8; 
  job->res.sumX = 0;
  job->res.sumY = 0;
  job->res.numC = 0;
  job->res.lines.dy=0; 
  job->res.lines.num=0;
  
  /* init temporaries */
  list_init( &job->tmp.dblist ); 
  job->tmp.n_run = 0;
  /* FIXME jb: init ppo */
  job->tmp.ppo.p = NULL; 
  job->tmp.ppo.x = 0;
  job->tmp.ppo.y = 0;

  /* init cfg */
  job->cfg.cs = 0;
  job->cfg.spc = 0; 
  job->cfg.mode = 0;
  job->cfg.dust_size = -1; /* auto detect */
  job->cfg.only_numbers = 0;
  job->cfg.verbose = 0;
  job->cfg.out_format = UTF8; /* old: ISO8859_1; */
  job->cfg.lc = "_";
  job->cfg.db_path = (char*)NULL;
  job->cfg.cfilter = (char*)NULL;
  job->cfg.certainty = 95;
  job->cfg.unrec_marker = "_";
}

/* free job structure */
void job_free(job_t *job) {

  /* if tmp is just a copy of the pointer to the original image */
  if (job->tmp.ppo.p==job->src.p.p) job->tmp.ppo.p=NULL;

  /* FIMXE jb: free lists
   * list_free( &job->res.linelist );
   * list_free( &job->tmp.dblist );
   */
 
  list_and_data_free(&(job->res.boxlist), (void (*)(void *))free_box);

  /* FIXME jb: free pix */
  if (job->src.p.p) { free(job->src.p.p); job->src.p.p=NULL; }

  /* FIXME jb: free pix */
  if (job->tmp.ppo.p) { free(job->tmp.ppo.p); job->tmp.ppo.p=NULL; }

}
