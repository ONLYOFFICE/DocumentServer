/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2009 Joerg Schulenburg

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
*/

#include <stdlib.h>
#include <stdio.h>
#include "pgm2asc.h"
#include "gocr.h"
#include "progress.h"

/* measure mean thickness as an criteria for big chars */
int mean_thickness( struct box *box2 ){
  int mt=0, i, y, dx=box2->x1-box2->x0+1, dy;
  for (y=box2->y0+1; y<box2->y1; y++) {
    i=loop(box2->p,box2->x0+0,y,dx,JOB->cfg.cs,0,RI);
    i=loop(box2->p,box2->x0+i,y,dx,JOB->cfg.cs,1,RI);
    mt+=i;
  } 
  dy = box2->y1 - box2->y0 - 1; 
  if (dy) mt=(mt+dy/2)/dy;
  return mt;
}

/* ---- remove dust ---------------------------------
   What is dust? I think, this is a very small pixel cluster without
   neighbours. Of course not all dust clusters can be detected correct.
   This feature should be possible to switch off via option.
   -> may be, all clusters should be stored here?
   speed is very slow, I know, but I am happy that it is working well
*/
int remove_dust( job_t *job ){
  /* new dust removing  */
  /* FIXME jb:remove pp */
  pix *pp = &job->src.p;
  int i1,i,j,x,y,x0,x1,y0,y1,nC,sX,sY,sP, cs,vvv=job->cfg.verbose;
  struct box *box2;
#define HISTSIZE  220   /* histogramm size */
  int histo[HISTSIZE];
  cs=job->cfg.cs; sP=sX=sY=nC=0;
  /*
   * count number of black pixels within a box and store it in .dots
   * later .dots is re-used for number of objects belonging to the character
   * should be done in the flood-fill algorithm 
   * volume of white pixels is estimated to big here (left/right rot)
   * ToDo: mean thickness of char lines?
   *       or interval nesting (minP..maxP) to remove outriders
   */
  j=0;
  for (i1=0;i1<HISTSIZE;i1++) histo[i1]=0;
  /* mean value over every black object which is big enough */
  for_each_data(&(job->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(job->res.boxlist));
    if (!box2->num_frames) continue;
    if (box2->frame_vol[0]<0) continue; /* don't count inner holes */
    j = abs(box2->frame_vol[0]);
    if ((box2->y1-box2->y0+1)>3) {
       nC++; /* only count potential chars v0.42 */
       sX+=box2->x1 - box2->x0 + 1;
       sY+=box2->y1 - box2->y0 + 1;
       sP+=j;
    }
    if (j<HISTSIZE) histo[j]++;
  } end_for_each(&(job->res.boxlist));
  
  if (job->cfg.dust_size < 0 && nC > 0) { /* auto detection */
    /* this formula is empirically, high resolution scans have bigger dust */
    /* maximum allowed dustsize (min=4*7 ca. 32)
     *  does not work for background pattern!
     */
    job->cfg.dust_size = (  ( sX/nC ) * ( sY/nC ) + 16) / 32;
    if (vvv) fprintf(stderr, "# remove.c remove_dust(): ");
    if (vvv) fprintf(stderr, "\n# dust size detection, vol num"
      " #obj=%d maxDust=%d mpixel= %3d mxy= %2d %2d",
      nC, job->cfg.dust_size, sP/nC, sX/nC, sY/nC);
    /* we assume that for random dust applies histo[i+1]<histo[i] */
    for (i=1;i+3<HISTSIZE;i++){
      if (vvv) fprintf(stderr,"\n# dust size histogram %3d %5d",i,histo[i]);
      if (histo[i]>=nC) continue; /* v0.42 lot of pixels -> bg pattern < 3 */
      if (i>=job->cfg.dust_size) break;   /* maximum = mean size / 32 */
      if (histo[i/*+1*/]==0) break;           /* bad statistic */
      if ((histo[i+2]+histo[i+3])
        >=(histo[i]  +histo[i+1])) break;  /* no noise, but to late? */
      if ( histo[i-1] > 1024*histo[i] &&
         2*histo[i+1] >=histo[i]) break;  /* bg pattern */
    }
    if (vvv) fprintf(stderr," break");
    if (vvv) for (i1=0,j=i+1;j<HISTSIZE;j++) {
      /* compressed, output only if something is changing */
      if (j==HISTSIZE-1 || histo[j]!=histo[j-1] || histo[j]!=histo[j+1]) {
        fprintf(stderr,"\n# dust size histogram %3d %5d",j,histo[j]);
        if (++i1>20) break; /* dont do excessive output */
      }
    }
    job->cfg.dust_size=i-1;
    /* what is the statistic of random dust? 
     *    if we have p pixels on a x*y image we should have
     *    (p/(x*y))^1 * (x*y) = p         singlets     
     *    (p/(x*y))^2 * (x*y) = p^2/(x*y) doublets and
     *    (p/(x*y))^3 * (x*y) = p^3/(x*y)^2 triplets
     */
    if (vvv) fprintf(stderr,"\n# auto dust size = %d nC= %3d .. %3d"
                            " avD= %2d %2d .. %2d %2d\n",
                   job->cfg.dust_size, nC, job->res.numC,
           (job->res.sumX+job->res.numC/2)/job->res.numC,
           (job->res.sumY+job->res.numC/2)/job->res.numC, sX/nC, sY/nC);
  }
  if (job->cfg.dust_size)
  { i=0;
    if(vvv){
       fprintf(stderr,"# remove dust of size %2d",job->cfg.dust_size);
       /* Warning: better use (1/(x*y))^2 as 1/((x*y)^2),
        * because (x*y)^2 may overflow */
       fprintf(stderr," histo=%d,%d(?=%d),%d(?=%d),...\n# ...",
          histo[1],histo[2],histo[1]*histo[1]/(pp->x*pp->y),
          histo[3],         histo[1]*histo[1]/(pp->x*pp->y)
                                    *histo[1]/(pp->x*pp->y)); 
    }
    i = 0;
    for_each_data(&(job->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(job->res.boxlist));
      x0=box2->x0;x1=box2->x1;y0=box2->y0;y1=box2->y1;	/* box */
      j=abs(box2->frame_vol[0]);
      if(j<=job->cfg.dust_size)      /* remove this tiny object */
      { /* here we should distinguish dust and i-dots,
         * may be we should sort out dots to a seperate dot list and
         * after line detection decide, which is dust and which not
         * dust should be removed to make recognition easier (ToDo)
         */
#if 0
        if(get_bw((3*x0+x1)/4,(x0+3*x1)/4,y1+y1-y0+1,y1+8*(y1-y0+1),pp,cs,1)) 
            continue; /* this idea was to simple, see kscan003.jpg sample */
#endif
        /* remove from average */
        job->res.numC--;
        job->res.sumX-=x1-x0+1;
        job->res.sumY-=y1-y0+1;
        /* remove pixels (should only be done with dust) */
        for(x=x0;x<=x1;x++)
        for(y=y0;y<=y1;y++){ put(pp,x,y,0,255&~7); }
        /* remove from list */
	list_del(&(job->res.boxlist),box2);
	/* free memory */
	free_box(box2);
	i++; /* count as dust particle */
	continue;
      }
    } end_for_each(&(job->res.boxlist));
    if(vvv)fprintf(stderr," %3d cluster removed, nC= %3d\n",i,job->res.numC);
  }
  /* reset dots to 0 and remove white pixels (new) */
  i=0;
  for_each_data(&(job->res.boxlist)) {
    box2 = ((struct box *)list_get_current(&(job->res.boxlist)));
    if (box2->frame_vol[0]<0) continue; /* for black areas only */
    x0=box2->x0;x1=box2->x1;y0=box2->y0;y1=box2->y1;	/* box */
    if (x1-x0>16 && y1-y0>30) /* only on large enough chars */
    for(x=x0+1;x<=x1-1;x++)
    for(y=y0+1;y<=y1-1;y++){
      if( pixel_atp(pp,x  ,y  )>=cs
       && pixel_atp(pp,x-1,y  ) <cs 
       && pixel_atp(pp,x+1,y  ) <cs 
       && pixel_atp(pp,x  ,y-1) <cs 
       && pixel_atp(pp,x  ,y+1) <cs )  /* remove it */
      {
        put(pp,x,y,0,0); i++;  /* (x and 0) or 0 */
      }
    }
  } end_for_each(&(job->res.boxlist));
  if (vvv) fprintf(stderr,"# ... %3d white pixels removed, cs=%d nC= %3d\n",
     i,cs,job->res.numC);
  return 0;
}

/* ---- smooth big chars ---------------------------------
 * Big chars often do not have smooth borders, which let fail
 * the engine. Here we smooth the borders of big chars (>7x16).
 * Smoothing is important for b/w scans, where we often have
 * comb like pattern on a vertikal border. I also received
 * samples with lot of white pixels (sample: 04/02/25).
 * ToDo: obsolete if vector code is complete
 */
int smooth_borders( job_t *job ){
    pix *pp = &job->src.p;
    int ii=0,x,y,x0,x1,y0,y1,dx,dy,cs,i0,i1,i2,i3,i4,n1,n2,
        cn[8],cm,vvv=job->cfg.verbose; /* dust found */
    struct box *box2;
    cs=job->cfg.cs; n1=n2=0;
    if(vvv){ fprintf(stderr,"# smooth big chars 7x16 cs=%d",cs); }
    /* filter for each big box */
    for_each_data(&(job->res.boxlist)) { n2++; /* count boxes */
        box2 = (struct box *)list_get_current(&(job->res.boxlist));
        /* do not touch small characters! but how we define small characters? */
        if (box2->x1-box2->x0+1<7 || box2->y1-box2->y0+1<16 ) continue;
        if (box2->c==PICTURE) continue;
        if (mean_thickness(box2)<3) continue;
        n1++; /* count boxes matching big-char criteria */
        x0=box2->x0;        y0=box2->y0;
        x1=box2->x1;        y1=box2->y1;
        dx=x1-x0+1;         dy=y1-y0-1;
        /* out_x(box2);
         * dont change to much! only change if absolutely sure!
         *             .......    1 2 3
         *       ex:   .?#####    0 * 4
         *             .......    7 6 5
         * we should also avoid removing lines by sytematic remove
         * from left end to the right, so we concern also about distance>1  
         */
        for(x=box2->x0;x<=box2->x1;x++)
         for(y=box2->y0;y<=box2->y1;y++){ /* filter out high frequencies */
           /* this is a very primitive solution, only for learning */
           cn[0]=getpixel(pp,x-1,y);
           cn[4]=getpixel(pp,x+1,y);   /* horizontal */
           cn[2]=getpixel(pp,x,y-1);
           cn[6]=getpixel(pp,x,y+1);   /* vertical */
           cn[1]=getpixel(pp,x-1,y-1);
           cn[3]=getpixel(pp,x+1,y-1); /* diagonal */
           cn[7]=getpixel(pp,x-1,y+1);
           cn[5]=getpixel(pp,x+1,y+1);
           cm=getpixel(pp,x,y);
           /* check for 5 other and 3 same surrounding pixels */
           for (i0=0;i0<8;i0++)
             if ((cn[i0            ]<cs)==(cm<cs)
              && (cn[(i0+7)     & 7]<cs)!=(cm<cs)) break; /* first same */
           for (i1=0;i1<8;i1++)
             if ((cn[(i0+i1)    & 7]<cs)!=(cm<cs)) break; /* num same */
           for (i2=0;i2<8;i2++)
             if ((cn[(i0+i1+i2) & 7]<cs)==(cm<cs)) break; /* num other */
           cn[0]=getpixel(pp,x-2,y);
           cn[4]=getpixel(pp,x+2,y);   /* horizontal */
           cn[2]=getpixel(pp,x,y-2);
           cn[6]=getpixel(pp,x,y+2);   /* vertical */
           cn[1]=getpixel(pp,x-2,y-2);
           cn[3]=getpixel(pp,x+2,y-2); /* diagonal */
           cn[7]=getpixel(pp,x-2,y+2);
           cn[5]=getpixel(pp,x+2,y+2);
           /* check for 5 other and 3 same surrounding pixels */
           for (i0=0;i0<8;i0++)
             if ((cn[i0            ]<cs)==(cm<cs)
              && (cn[(i0+7)     & 7]<cs)!=(cm<cs)) break; /* first same */
           for (i3=0;i3<8;i3++)
             if ((cn[(i0+i3)    & 7]<cs)!=(cm<cs)) break; /* num same */
           for (i4=0;i4<8;i4++)
             if ((cn[(i0+i3+i4) & 7]<cs)==(cm<cs)) break; /* num other */
           if (i1<=3 && i2>=5 && i3>=3 && i4>=3) { /* change only on borders */
             ii++;             /*   white    : black */
             put(pp,x,y,7,((cm<cs)?(cs|32):cs/2)&~7);
#if 0
             printf(" x y i0 i1 i2 i3 i4 cm new cs %3d %3d"
             "  %3d %3d %3d %3d %3d  %3d %3d %3d\n",
              x-box2->x0,y-box2->y0,i0,i1,i2,i3,i3,cm,getpixel(pp,x,y),cs);
#endif
           }
        }
#if 0  /* debugging */
        out_x(box2);
#endif
    } end_for_each(&(job->res.boxlist));
    if(vvv)fprintf(stderr," ... %3d changes in %d of %d\n",ii,n1,n2);
    return 0;
}

/* test if a corner of box1 is within box2 */
int box_nested( struct box *box1, struct box *box2){
             /* box1 in box2, +1..-1 frame for pixel-patterns */
 if (   (    ( box1->x0>=box2->x0-1 && box1->x0<=box2->x1+1 )
          || ( box1->x1>=box2->x0-1 && box1->x1<=box2->x1+1 ) )
     && (    ( box1->y0>=box2->y0-1 && box1->y0<=box2->y1+1 )
          || ( box1->y1>=box2->y0-1 && box1->y1<=box2->y1+1 ) ) )
   return 1;
 return 0;
}

/* test if box1 is within box2 */
int box_covered( struct box *box1, struct box *box2){
             /* box1 in box2, +1..-1 frame for pixel-patterns */
   if (     ( box1->x0>=box2->x0-1 && box1->x1<=box2->x1+1 )
         && ( box1->y0>=box2->y0-1 && box1->y1<=box2->y1+1 ) )
   return 1;
 return 0;
}

/* ---- remove pictures ------------------------------------------
 *   may be, not deleting or moving to another list is much better!
 *   should be renamed to remove_pictures and border boxes
 */
int remove_pictures( job_t *job){
  struct box *box4,*box2;
  int j=0, j2=0, num_del=0;

  if (job->cfg.verbose)
    fprintf(stderr, "# "__FILE__" L%d: remove pictures\n# ...",
            __LINE__);

  /* ToDo: output a list for picture handle scripts */
  j=0; j2=0;
  if(job->cfg.verbose)
  for_each_data(&(job->res.boxlist)) {
    box4 = (struct box *)list_get_current(&(job->res.boxlist));
    if (box4->c==PICTURE) j++; else j2++;
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr," status: pictures= %d  other= %d  nC= %d\n# ...",
            j, j2, job->res.numC);

  /* remove table frames */
  if (job->res.numC > 8)
  for_each_data(&(job->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(job->res.boxlist));
    if (box2->c==PICTURE
     && box2->num_ac==0	 /* dont remove barcodes */
     && box2->x1-box2->x0+1>box2->p->x/2  /* big table? */
     && box2->y1-box2->y0+1>box2->p->y/2 ){ j=0;
      /* count boxes nested with the picture */
      for_each_data(&(job->res.boxlist)) {
        box4 = (struct box *)list_get_current(&(job->res.boxlist));
        if( box4 != box2 )  /* not count itself */
        if (box_nested(box4,box2)) j++;  /* box4 in box2 */
      } end_for_each(&(job->res.boxlist));
      if( j>8 ){ /* remove box if more than 8 chars are within box */
        list_del(&(job->res.boxlist), box2); /* does not work proper ?! */
        free_box(box2); num_del++;
      }
    }
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr, " deleted= %d pictures (table frames)\n# ...",
            num_del);
  num_del=0;

  /* remove dark-border-boxes (typical for hard copy of book site,
   *  or spam random border)   */
  if (job->res.numC > 1) /* dont remove the only char */
  for_each_data(&(job->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(job->res.boxlist));
    if (box2->c!=PICTURE) continue; // ToDo: PICTUREs set already?
    if ( box2->x1-box2->x0+1 > box2->p->x/2
      && box2->y1-box2->y0+1 > box2->p->y/2 ) continue;
    j=0;
    if (box2->x0==0) j++; 
    if (box2->y0==0) j++;  /* on border? */
    if (box2->x1==box2->p->x-1) j++;
    if (box2->y1==box2->p->y-1) j++; 
    if (j>2){ /* ToDo: check corner pixel */
      int cs=job->cfg.cs;
      j=0;
      if (getpixel(box2->p,box2->x0,box2->y0)<cs) j++;
      if (getpixel(box2->p,box2->x1,box2->y0)<cs) j++;
      if (getpixel(box2->p,box2->x0,box2->y1)<cs) j++;
      if (getpixel(box2->p,box2->x1,box2->y1)<cs) j++;
      if (j>2) {
        list_del(&(job->res.boxlist), box2);
        free_box(box2); num_del++;
      }
    }
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr, " deleted= %d pictures (on border)\n# ...",
            num_del);
  num_del=0;

  j=0; j2=0;
  if(job->cfg.verbose)
  for_each_data(&(job->res.boxlist)) {
    box4 = (struct box *)list_get_current(&(job->res.boxlist));
    if( box4->c==PICTURE ) j++; else j2++;
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr," status: pictures= %d  other= %d  nC= %d\n# ...",
            j, j2, job->res.numC);
  
  for(j=1;j;){ j=0;  /* this is only because list_del does not work */
    /* can be slow on gray images */
    for_each_data(&(job->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(job->res.boxlist));
      if( box2->c==PICTURE && box2->num_ac==0)
      for(j=1;j;){ /* let it grow to max before leave */
        j=0; box4=NULL;
        /* find boxes nested with the picture and remove */
        /* its for pictures build by compounds */
        for_each_data(&(job->res.boxlist)) {
          box4 = (struct box *)list_get_current(&(job->res.boxlist));
          if(  box4!=box2   /* not destroy self */
           && (box4->num_ac==0)  /* dont remove barcodes etc. */ 
           && (/* box4->c==UNKNOWN || */
                  box4->c==PICTURE) ) /* dont remove valid chars */
          if(
             /* box4 in box2, +1..-1 frame for pixel-patterns */
               box_nested(box4,box2)
             /* or box2 in box4 */
            || box_nested(box2,box4) /* same? */
              )
          if (  box4->x1-box4->x0+1>2*job->res.avX
             || box4->x1-box4->x0+1<job->res.avX/2
             || box4->y1-box4->y0+1>2*job->res.avY
             || box4->y1-box4->y0+1<job->res.avY/2
             || box_covered(box4,box2) )   /* box4 completely within box2 */ 
            /* dont remove chars! see rotate45.fig */
          {
            /* do not remove boxes in inner loop (bug?) ToDo: check why! */
            /* instead we leave inner loop and mark box4 as valid */
            if( box4->x0<box2->x0 ) box2->x0=box4->x0;
            if( box4->x1>box2->x1 ) box2->x1=box4->x1;
            if( box4->y0<box2->y0 ) box2->y0=box4->y0;
            if( box4->y1>box2->y1 ) box2->y1=box4->y1;
            j=1;   /* mark box4 as valid   */
            break; /* and leave inner loop */
          }
        } end_for_each(&(job->res.boxlist));
        if (j!=0 && box4!=NULL) { /* check for valid box4 */
          /* ToDo: melt */
          list_del(&(job->res.boxlist), box4); /* does not work proper ?! */
          free_box(box4); /* break; ToDo: necessary to leave after del??? */
          num_del++;
        }
        
      }
    } end_for_each(&(job->res.boxlist)); 
  }

  if (job->cfg.verbose)
    fprintf(stderr, " deleted= %d nested pictures\n# ...", num_del);

  /* output a list for picture handle scripts */
  j=0; j2=0;
  if(job->cfg.verbose)
  for_each_data(&(job->res.boxlist)) {
    box4 = (struct box *)list_get_current(&(job->res.boxlist));
    if( box4->c==PICTURE ) {
      fprintf(stderr," found picture at %4d %4d size %4d %4d\n# ...",
         box4->x0, box4->y0, box4->x1-box4->x0+1, box4->y1-box4->y0+1 );
      j++;
    } else j2++;
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr," status: pictures= %d  other= %d  nC= %d\n",
            j, j2, job->res.numC);
  return 0;
}



  /* ---- remove melted serifs --------------------------------- v0.2.5
                >>v<<
        ##########.######## <-y0
        ###################  like X VW etc.
        ...###.......###... <-y
        ...###......###....
        j1       j2      j3
  - can generate new boxes if two characters were glued
  */
int remove_melted_serifs( pix *pp ){
  int x,y,j1,j2,j3,j4,i2,i3,i,ii,ni,cs,x0,x1,xa,xb,y0,y1,vvv=JOB->cfg.verbose;
  struct box *box2, *box3;
  progress_counter_t *pc = NULL;

  cs=JOB->cfg.cs; i=0; ii=0; ni=0;
  for_each_data(&(JOB->res.boxlist)) {
    ni++; 
  } end_for_each(&(JOB->res.boxlist));
  pc = open_progress(ni,"remove_melted_serifs");
  ni = 0;

  if(vvv){ fprintf(stderr,"# searching melted serifs ..."); }
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->c != UNKNOWN) continue; /* dont try on pictures */
    x0=box2->x0; x1=box2->x1; 
    y0=box2->y0; y1=box2->y1;	/* box */
    /* upper serifs */
    for(j1=x0;j1+4<x1;){
      j1+=loop(pp,j1,y0  ,x1-x0,cs,0,RI);
      x  =loop(pp,j1,y0  ,x1-x0,cs,1,RI);	       if(j1+x>x1+1) break;
      y  =loop(pp,j1,y0+1,x1-x0,cs,1,RI); if(y>x) x=y; if(j1+x>x1+1) break;
      /* measure mean thickness of serif pos: (j1,y0)-(j1+x,y0) */
      for(j2=j3=j4=0,i2=j1;i2<j1+x;i2++){
        /* 2009-07: bug, j1 used instead of i2 */
        i3 =loop(pp,i2,y0   ,y1-y0,cs,0,DO); if(8*i3>y1-y0) break;
        i3+=loop(pp,i2,y0+i3,y1-y0,cs,1,DO); if(8*i3>y1-y0) continue;
        if(8*i3<y1-y0){ j2+=i3; j3++; } /* sum vert. thickness */
      } if(j3==0){ j1+=x; continue; }   /* no serif, skip this object */
      y = y0+(j2+j3-1)/j3+(y1-y0+1)/32; /* y0 + mean thickness + dy/32 + 1 */
      if (vvv&1)
        fprintf(stderr, "\n#  upper serif x0,y0,j1-x0+x,y-y0 %4d %4d %2d+%2d %2d",
          x0,y0,j1-x0,x,y-y0);

      /* check if really melted serifs */
      if (loop(pp,j1,y,x1-x0,cs,0,RI)<1) { j1+=x; continue; }
      if(num_cross(j1 ,j1+x,y,y,pp,cs) < 2 ){ j1+=x;continue; }
      if (vvv&1)
        fprintf(stderr, " ok1");
      j2 = j1 + loop(pp,j1,y,x1-x0,cs,0,RI);
      j2 = j2 + loop(pp,j2,y,x1-x0,cs,1,RI);
      i3 =      loop(pp,j2,y,x1-x0,cs,0,RI); if(i3<2){j1+=x;continue;}
      j2 += i3/2;
      j3 = j2 + loop(pp,j2,y  ,x1-j2,cs,0,RI);
      i3 = j2 + loop(pp,j2,y+1,x1-j2,cs,0,RI); if(i3>j3)j3=i3;
      j3 = j3 + loop(pp,j3,y  ,x1-j3,cs,1,RI);
      i3 =      loop(pp,j3,y  ,x1-j3,cs,0,RI); 
      if(i3<2 || j3>=j1+x){j1+=x;continue;}
      j3 += i3/2;

      if(x>5)
      {
	i++; /* snip! */
	for(y=0;y<(y1-y0+1+4)/8;y++)put(pp,j2,y0+y,255,128+64); /* clear highest bit */
	if(vvv&4){ 
	  fprintf(stderr,"\n"); 
	  out_x(box2);
	  fprintf(stderr,"# melted serifs corrected on %d %d j1=%d j3=%d",
	    j2-x0, y, j1-x0, j3-x0);
	  // ToDo: vector cut with line from xa,ya to xb,yb
	  //    two frames of double melted MN become one frame if cut one
	  //    of the melted serifs (new function cut_frames_at_line())
	}
	for(xb=0,xa=0;xa<(x1-x0+4)/8;xa++){ /* detect vertical gap */
	  i3=y1; 
	  if(box2->m3>y0 && 2*y1>box2->m3+box2->m4) i3=box2->m3; /* some IJ */
          if( loop(pp,j2-xa,i3,i3-y0,cs,0,UP) > (y1-y0+1)/2
           && loop(pp,j2,(y0+y1)/2,xa+1,cs,0,LE) >=xa ){ xb=-xa; break; }
          if( loop(pp,j2+xa,i3,i3-y0,cs,0,UP) > (y1-y0+1)/2 
           && loop(pp,j2,(y0+y1)/2,xa+1,cs,0,RI) >=xa ){ xb= xa; break; }
        }
	if( get_bw(j2   ,j2   ,y0,(y0+y1)/2,pp,cs,1) == 0
	 && get_bw(j2+xb,j2+xb,(y0+y1)/2,i3,pp,cs,1) == 0 )
	{ /* divide */
	  box3=malloc_box(box2);
	  box3->x1=j2-1;
	  box2->x0=j2+1; x1=box2->x1;
	  cut_box(box2); /* cut vectors outside the box, see box.c */
	  cut_box(box3);
	  box3->num=JOB->res.numC;
	  list_ins(&(JOB->res.boxlist),box2,box3); JOB->res.numC++; ii++; /* insert box3 before box2 */
	  if(vvv&4) fprintf(stderr," => splitted");
	  j1=x0=box2->x0; x=0; /* hopefully ok, UVW */
	}
      }
      j1+=x;
    }
    /* same on lower serifs -- change this later to better function
    //   ####    ###
    //    #### v ###       # <-y
    //  #################### <-y1
    //  j1     j2     j3
     */
    for(j1=x0;j1<x1;){
      j1+=loop(pp,j1,y1  ,x1-x0,cs,0,RI);
      x  =loop(pp,j1,y1  ,x1-x0,cs,1,RI);	       if(j1+x>x1+1) break;
      y  =loop(pp,j1,y1-1,x1-x0,cs,1,RI); if(y>x) x=y; if(j1+x>x1+1) break;
      /* measure mean thickness of serif */
      for(j2=j3=j4=0,i2=j1;i2<j1+x;i2++){
        /* 2009-07: bug, j1 used instead of i2 */
        i3 =loop(pp,i2,y1   ,y1-y0,cs,0,UP); if(8*i3>y1-y0) break;
        i3+=loop(pp,i2,y1-i3,y1-y0,cs,1,UP); if(8*i3>y1-y0) continue;
        if(8*i3<y1-y0){ j2+=i3; j3++; }
      } if(j3==0){ j1+=x; continue; } 
      y = y1-(j2+j3-1)/j3-(y1-y0+1)/32;
      if (vvv&1)
        fprintf(stderr, "\n#  lower serif x0,y0,j1-x0+x,y1-y %4d %4d %2d+%2d %2d",
          x0,y0,j1-x0,x,y1-y);

      /* check if really melted serifs */
      if( loop(pp,j1,y,x1-x0,cs,0,RI)<1 ) { j1+=x; continue; }
      if(num_cross(j1 ,j1+x,y,y,pp,cs) < 2 ){ j1+=x;continue; }
      if (vvv&1) fprintf(stderr, " ok1");
      j2 = j1 + loop(pp,j1,y,x1-x0,cs,0,RI);
      j2 = j2 + loop(pp,j2,y,x1-x0,cs,1,RI);
      i3 =      loop(pp,j2,y,x1-x0,cs,0,RI); if(i3<2){j1+=x;continue;}
      j2 += i3/2;
      j3 = j2 + loop(pp,j2,y  ,x1-j2,cs,0,RI);
      i3 = j2 + loop(pp,j2,y-1,x1-j2,cs,0,RI); if(i3>j3)j3=i3;
      j3 = j3 + loop(pp,j3,y  ,x1-j3,cs,1,RI);
      i3 =      loop(pp,j3,y,x1-j3,cs,0,RI); 
      if(i3<2 || j3>=j1+x){j1+=x;continue;}
      j3 += i3/2;

      /* y  =y1-(y1-y0+1+4)/8; */
      if(x>5)
      {
	i++; /* snip! */
	for(i3=0;i3<(y1-y0+1+4)/8;i3++)
	  put(pp,j2,y1-i3,255,128+64); /* clear highest bit */
	if(vvv&4){ 
	  fprintf(stderr,"\n");
	  out_x(box2);
	  fprintf(stderr,"# melted serifs corrected on %d %d j1=%d j3=%d",j2-x0,y-y0,j1-x0,j3-x0);
	}
	for(xb=0,xa=0;xa<(x1-x0+4)/8;xa++){ /* detect vertical gap */
          if( loop(pp,j2-xa,y0,y1-y0,cs,0,DO) > (y1-y0+1)/2
           && loop(pp,j2,(y0+y1)/2,xa+1,cs,0,LE) >=xa ){ xb=-xa; break; }
          if( loop(pp,j2+xa,y0,y1-y0,cs,0,DO) > (y1-y0+1)/2 
           && loop(pp,j2,(y0+y1)/2,xa+1,cs,0,RI) >=xa ){ xb= xa; break; }
        }
	if( get_bw(j2   ,j2   ,(y0+y1)/2,y1,pp,cs,1) == 0
	 && get_bw(j2+xb,j2+xb,y0,(y0+y1)/2,pp,cs,1) == 0 )
	{ /* divide */
	  box3=malloc_box(box2);
	  box3->x1=j2-1;
	  box2->x0=j2; x1=box2->x1;
	  cut_box(box2); /* cut vectors outside the box */
	  cut_box(box3);
	  box3->num=JOB->res.numC;
	  list_ins(&(JOB->res.boxlist),box2,box3); JOB->res.numC++; ii++;
	  /* box3,box2 in correct order??? */
	  if(vvv&4) fprintf(stderr," => splitted");
	  j1=x0=box2->x0; x=0; /* hopefully ok, NMK */
	}
      }
      j1+=x;
    }
    progress(ni++,pc);
  } end_for_each(&(JOB->res.boxlist));
  close_progress(pc);
  if(vvv)fprintf(stderr," %3d cluster corrected, %d new boxes\n",i,ii);
  return 0;
}

/*  remove black borders often seen on bad scanned copies of books
    - dust around the border
 */
int remove_rest_of_dust() {
  int i1, i2, vvv = JOB->cfg.verbose, x0, x1, y0, y1, cnt=0;
  struct box *box2, *box4;
  progress_counter_t *pc = NULL;
  
  i1 = i2 = 0; /* counter for removed boxes */
  if (vvv)
    fprintf(stderr, "# detect dust (avX,nC), ... ");
  /* remove fragments from border */
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->c == UNKNOWN) {
      x0 = box2->x0; x1 = box2->x1;
      y0 = box2->y0; y1 = box2->y1;	/* box */
      /* box in char ??? */
      if (  2 * JOB->res.numC * (y1 - y0 + 1) < 3 * JOB->res.sumY
        && ( y1 < box2->p->y/4 || y0 > 3*box2->p->y/4 )  /* not single line */
        && JOB->res.numC > 1		/* do not remove everything */
        && ( box2->m4 == 0 ) )	/* remove this */
      {
	 JOB->res.numC--; /* ToDo: dont count tiny pixels */
	 /* ToDo: res.sumX,Y must also be corrected */
	 i1++;
	 list_del(&(JOB->res.boxlist), box2);
	 free_box(box2);
      }
    }
  } end_for_each(&(JOB->res.boxlist));

  pc = open_progress(JOB->res.boxlist.n,"remove_dust2");
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    progress(cnt++,pc);
    if (box2->c == PICTURE) continue;
    x0 = box2->x0; x1 = box2->x1;
    y0 = box2->y0; y1 = box2->y1;	/* box */
    /* remove tiny box2 if to far away from bigger boxes */
    /* ToDo: remove clouds of tiny pixels (count near small, compare with num bigger) */
    /* 0.42: remove far away pixel? ToDo: do it at earlier? */
    if (x1-x0+1<3 && y1-y0+1<3){
      int xn, yn, xs, ys;
      int found=0;  /* nearest bigger box */
      /* search near bigger box */
      for_each_data(&(JOB->res.boxlist)) {
        box4 = (struct box *)list_get_current(&(JOB->res.boxlist));
        if (found || box4 == box2) continue; 
        if (box4->x1-box4->x0+1<3 && box4->y1-box4->y0+1<3) continue;
        xs =  box4->x1-box4->x0+1;
        ys =  box4->y1-box4->y0+1;
        xn = abs((box4->x0+box4->x1)/2 - box2->x0);
        yn = abs((box4->y0+box4->y1)/2 - box2->y0);
        if (2*xn < 3*xs && 2*yn < 3*ys) { found=1; }
      } end_for_each(&(JOB->res.boxlist));
      if (!found) { /* found nothing, box2 to far from big boxes */
        i2++;
        list_del(&(JOB->res.boxlist), box2);
        free_box(box2);
      }
    }
  } end_for_each(&(JOB->res.boxlist));
  close_progress(pc);
  if (vvv)
    fprintf(stderr, " %3d + %3d boxes deleted, nC= %d ?\n",
            i1, i2, JOB->res.numC);

  return 0;
}
