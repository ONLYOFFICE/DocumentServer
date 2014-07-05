/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2007 Joerg Schulenburg

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

 check README for my email address
*/

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>   // toupper, tolower
#include "pgm2asc.h"
#include "gocr.h"

// ----- detect lines ---------------
/* suggestion: Fourier transform and set line frequency where the
   amplitude has a maximum (JS: slow and not smarty enough).

   option: range for line numbers 1..1000 or similar 
   todo: look for thickest line, and divide if thickness=2*mean_thickness 
   Set these elements of the box structs:

   m1 <-- top of upper case letters and (bdfhkl) (can differ)
   m2 <-- top of letters  (acegmnopqrsuvwxyz)
   m3 <-- baseline
   m4 <-- bottom of hanging letters (gqpy)

  performance can be improved by working with a temporary
  list of boxes of the special text line

  - Jun23,00 more robustness of m3 (test liebfrau1)
  - Feb01,02 more robustness of m4 (test s46_084.pgm) 
  - Dec03,12 fix problems with footnotes
 ToDo:
  - generate lists of boxes per line (faster access)
  - use statistics
  - for each box look at it neighbours and set box-m1..m4
  - m[1..4].max .min if m4.min-m3.max<1 probability lower
 */
int detect_lines1(pix * p, int x0, int y0, int dx, int dy)
{
  int i, jj, j2, y, yy, my, mi, mc, i1, i2, i3, i4,
      m1, m2, m3, m4, ma1, ma2, ma3, ma4, m3pre, m4pre;
  struct box *box2, *box3;  /* box3 is for verbose / debugging */
  struct tlines *lines = &JOB->res.lines;

  /* ToDo: optional read line-data from external source??? */
  if (lines->num == 0) { // initialize one dummy-line for pictures etc.
      lines->m4[0] = 0;
      lines->m3[0] = 0;
      lines->m2[0] = 0;
      lines->m1[0] = 0;
      lines->x0[0] = p->x;  /* expand to left end during detection */
      lines->x1[0] = 0;	    /* expand to right end */
      lines->pitch[0] = JOB->cfg.spc; /* default word pitch */
      lines->mono[0]  = 0;            /* default spacing, 0 = prop */
      lines->num++;
  }
  i = lines->num;
  if (dy < 4)
    return 0;  /* image is to low for latin chars */
  my = jj = 0;
  // get the mean height of all hollow chars
  // (better than mean value of everything including bg-pattern or dust?)
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if ( box2->c != PICTURE
      && box2->num_frames>1 && box2->num_frames<3 /* 1 or 2 holes */
      && box2->y0 >= y0 && box2->y1 <= y0 + dy
      && box2->x0 >= x0 && box2->x1 <= x0 + dx 
      && box2->frame_vol[0]>0
      && box2->frame_vol[1]<0
      ) {
	jj++;
	my += box2->y1 - box2->y0 + 1;
    }
  } end_for_each(&(JOB->res.boxlist));
  if (jj==0) {
    // get the mean height of all chars
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if ( box2->c != PICTURE
        && box2->y1 - box2->y0 + 1 >= 4   /* 4x6 font */
        && box2->y0 >= y0 && box2->y1 <= y0 + dy
        && box2->x0 >= x0 && box2->x1 <= x0 + dx ) {
          jj++;
          my += box2->y1 - box2->y0 + 1;
      }
    } end_for_each(&(JOB->res.boxlist));
  }
  if (jj == 0)
    return 0;  /* no chars detected */
    
    
  /* ToDo: a better way could be to mark good boxes (of typical high a-zA-Z0-9)
   *    first and handle only marked boxes for line scan, exclude ?!,.:;etc
   *    but without setect the chars itself (using good statistics)
   *    see adjust_text_lines()
   */
  my /= jj;          /* we only care about chars with high arround my */
  if (JOB->cfg.verbose & 16)
    fprintf(stderr,"\n# detect_lines1(%d %d %d %d) vvv&16 chars=%d my=%d\n#  ",
      x0, y0, dx, dy, jj, my);
  // "my" is the average over the whole image (bad, if different fontsizes)

  if (my < 4)
    return 0;       /* mean high is to small => error */

  m4pre=m3pre=y0;   /* lower bond of upper line */
  // better function for scanning line around a letter ???
  // or define lines around known chars "eaTmM"
  for (j2 = y = y0; y < y0 + dy; y++) {
    // look for max. of upper and lower bound of next line
    m1 = y0 + dy;
    jj = 0;
#if 1
    /* this is only for test runs */
    if (JOB->cfg.verbose & 16)
      fprintf(stderr,"searching new line %d\n#  ",i /* lines->num */);
#endif

    box3 = NULL; /* mark the most upper box starting next line */
    // find highest point of next line => store to m1-min (m1>=y)
    // only objects greater 2/3*my and smaller 3*my are allowed
    // a higher "!" at end of line can result in a to low m1
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if (box2->line>0 || box2->c == PICTURE) continue;
      if (lines->dx)
        yy = lines->dy * box2->x0 / (lines->dx); /* correct crooked lines */
      else yy=0;
      if (   box2->y0 >= y + yy && box2->y1 < y0 + dy	// lower than y
	  && box2->x0 >= x0     && box2->x1 < x0 + dx	// within box ?
	  && box2->c != PICTURE	// no picture
	  && box2->num_boxes <= 1 // ignore 2 for "!?i" 3 for "&auml;"
	  && 3 * (box2->y1 - box2->y0) > 2 * my	// not to small
	  &&     (box2->y1 - box2->y0) < 3 * my // not to big
	  &&     (box2->y1 - box2->y0) > 4)     // minimum absolute size
       {
	  if (box2->y0 < m1 + yy) {
	    m1 = box2->y0 - yy;  /* highest upper boundary */
	    box3 = box2;
	  }
	  // fprintf(stderr,"\n %3d %3d %+3d %d m1= %3d",
          //   box2->x0, box2->y0, box2->y1 - box2->y0 + 1, box2->num_boxes, m1);
       }
    } end_for_each(&(JOB->res.boxlist));
    if (!box3 || m1 >= y0+dy) break; /* no further line found */
    if (JOB->cfg.verbose & 16)
      fprintf(stderr," most upper box at new line xy= %4d %4d %+4d %+4d\n#  ",
       box3->x0, box3->y0, box3->x1-box3->x0, box3->y1-box3->y0);

    // at the moment values depend from single chars, which can 
    //    result in bad values (ex: 4x6 /\=)
    // ToDo: 2) mean size of next line (store list of y0,y1)
    // ToDo: 3) count num0[(y0-m1)*16/my], num1[(y1-m1)*16/my]
    // ToDo: or down-top search horizontal nerarest neighbours
    lines->x0[i] = x0 + dx - 1; /* expand during operation to left end */
    lines->x1[i] = x0;          /* expand to the right end of line */
    m4=m2=m1; mi=m1+my; m3=m1+2*my; jj=0;
    // find limits for upper bound, base line and ground line
    //    m2-max m3-min m4-max
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if (box2->line>0 || box2->c == PICTURE) continue;
      if (   box2->y0 < y0 || box2->y1 >= y0 + dy
	  || box2->x0 < x0 || box2->x1 >= x0 + dx ) continue; // out of image
      if (lines->dx) yy = lines->dy * box2->x0 / (lines->dx);
      else yy=0;
      /* check for ij-dots, used if chars of same high */
      if ( box2->y0 >= y + yy
	&& box2->y0 >= y
	&& (box2->y1 - box2->y0) < my	
	&& box2->y1 < m1 + yy + my/4
	&& box2->y0 < mi + yy        ) {
	    mi = box2->y0 - yy;        /* highest upper boundary i-dot */
      }
      // fprintf(stderr,"\n check %3d %3d-%3d y=%d yy=%d m1=%d", box2->x0, box2->y0, box2->y1, y, yy, m1);
      /* get m2-max m3-min m4-max */
      if ( box2->y0 >= y + yy 			// lower than y
	&& 3 * (box2->y1 - box2->y0 + 1) > 2 * my  // right size ?
	&&     (box2->y1 - box2->y0 + 1) < 3 * my  // font mix, size = 2.6*my
	&& (box2->y1 - box2->y0 + 1) > 3           // 4x6 lowercase=4
        && box2->y0 >= m1                     // in m1 range?
        && box2->y0 <= m1 + yy + 9 * my / 8   // my can be to small if mixed
        // ToDo: we need a better (local?) algorithm for big headlines > 2*my
        && box2->y1 <= m1 + yy + 3 * my
        && box2->y1 >= m1 + yy + my / 2
        // lines can differ in high, my may be to small (smaller headlines)
        && box2->y0+box2->y1 <= 2*box3->y1
         )
      {
          jj++;  // count chars for debugging purpose
	  if (box2->y0 > m2 + yy) {
	    m2 = box2->y0 - yy;  /* highest upper boundary */
            if (JOB->cfg.verbose & 16)
	      fprintf(stderr," set m2= %d yy= %d\n#  ",m2, yy);
	  }
	  if (box2->y1 > m4 + yy && (my>6 || box2->y1 < m3+my)) {
	    m4 = box2->y1 - yy;  /* lowest lower boundary, small font lines can touch */
	  }
	  if (   box2->y1 < m3 + yy
	    && ( ( 2*box2->y1 > m2+  m4+yy && m2>m1)
              || ( 4*box2->y1 > m1+3*m4+yy) ) )  // care for TeX: \(^1\)Footnote 2003
 	  /* "'!?" could cause trouble here, therefore this lines */
 	  /* ToDo: get_bw costs time, check pre and next */
	  if( get_bw(box2->x0,box2->x1,box2->y1+1   ,box2->y1+my/2,box2->p,JOB->cfg.cs,1) == 0
	   || get_bw(box2->x0,box2->x1,box2->y1+my/2,box2->y1+my/2,box2->p,JOB->cfg.cs,1) == 1
           || num_cross(box2->x0,box2->x1,(box2->y0+box2->y1)/2,(box2->y0+box2->y1)/2,box2->p,JOB->cfg.cs)>2 )
	  {
	    m3 = box2->y1 - yy;  /* highest lower boundary */
	    // printf("\n# set1 m3 m=%3d %+2d %+2d %+2d",m1,m2-m1,m3-m1,m4-m1);
	    // out_x(box2);
	  }
	  if (box2->y0 + box2->y1 > 2*(m3 + yy)
	   && box2->y1 < m4 + yy - my/4 -1
	   && box2->y1 >= (m2 + m4)/2   // care for TeX: \(^1\)Footnote 2003
	   && m2 > m1 ) // be sure to not use ', m2 must be ok
	  {
	    m3 = box2->y1 - yy;  /* highest lower boundary */
	    // printf("\n# set2 m3 m=%3d %+2d %+2d %+2d",m1,m2-m1,m3-m1,m4-m1);
	    // out_x(box2);
	  }
          if (box2->x1>lines->x1[i]) lines->x1[i] = box2->x1; /* right end */
          if (box2->x0<lines->x0[i]) lines->x0[i] = box2->x0; /* left end */
	  // printf(" m=%3d %+2d %+2d %+2d yy=%3d\n",m1,m2-m1,m3-m1,m4-m1,yy);
      }
    } end_for_each(&(JOB->res.boxlist));

#if 1
    /* this is only for test runs */
    if (JOB->cfg.verbose & 16)
      fprintf(stderr," step 1 y=%4d m= %4d %+3d %+3d %+3d"
                     " my=%2d chars=%3d\n#  ",
                     y, m1, m2-m1, m3-m1, m4-m1, my, jj);
#endif

    if (m3 == m1)
      break;
#if 1         /* make averages about the line  */
    // same again better estimation
    mc = (3 * m3 + m1) / 4;	/* lower center ? */
    ma1 = ma2 = ma3 = ma4 = i1 = i2 = i3 = i4 = jj = 0;
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if (box2->line>0 || box2->c == PICTURE) continue;
      if (lines->dx) yy = lines->dy * box2->x0 / (lines->dx); else yy=0;
      if (box2->y0 >= y + yy && box2->y1 < y0 + dy	// lower than y
	  && box2->x0 >= x0 && box2->x1 < x0 + dx	// in box ?
	  && box2->c != PICTURE	// no picture
	  && 2 * (box2->y1 - box2->y0) > my	// right size ?
	  && (box2->y1 - box2->y0) < 4 * my) {
        if ( box2->y0 - yy >= m1-my/4
          && box2->y0 - yy <= m2+my/4
          && box2->y1 - yy >= m3-my/4
          && box2->y1 - yy <= m4+my/4 ) { /* its within allowed range! */
	    // jj++; // not used
	    if (abs(box2->y0 - yy - m1) <= abs(box2->y0 - yy - m2))
	         { i1++; ma1 += box2->y0 - yy; }
	    else { i2++; ma2 += box2->y0 - yy; }
	    if (abs(box2->y1 - yy - m3) < abs(box2->y1 - yy - m4))
	         { i3++; ma3 += box2->y1 - yy; }
	    else { i4++; ma4 += box2->y1 - yy; }
          if (box2->x1>lines->x1[i]) lines->x1[i] = box2->x1; /* right end */
          if (box2->x0<lines->x0[i]) lines->x0[i] = box2->x0; /* left end */
	}
      }
    } end_for_each(&(JOB->res.boxlist));

    if (i1)  m1 = (ma1+i1/2) / i1; /* best rounded */
    if (i2)  m2 = (ma2+i2/2) / i2;
    if (i3)  m3 = (ma3+i3-1) / i3; /* round up */
    if (i4)  m4 = (ma4+i4-1) / i4;
    // printf("\n# .. set3 m3 m=%3d %+2d %+2d %+2d",m1,m2-m1,m3-m1,m4-m1);

#endif

    /* expand right and left end of line */
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if (box2->line>0 || box2->c == PICTURE) continue;
      if (lines->dx) yy = lines->dy * box2->x0 / (lines->dx); else yy=0;
      if (   box2->y0 >= y0 && box2->y1 < y0 + dy
	  && box2->x0 >= x0 && box2->x1 < x0 + dx	// in box ?
	  && box2->c != PICTURE	// no picture
          && box2->y0 >= m1-1
          && box2->y0 <= m4
          && box2->y1 >= m1
          && box2->y1 <= m4+1 ) { /* its within line */
           if (box2->x1>lines->x1[i]) lines->x1[i] = box2->x1; /* right end */
           if (box2->x0<lines->x0[i]) lines->x0[i] = box2->x0; /* left end */
     }
    } end_for_each(&(JOB->res.boxlist));

#if 1
    /* this is only for test runs */
    if (JOB->cfg.verbose & 16)
      fprintf(stderr," step 2 y=%4d m= %4d %+3d %+3d %+3d\n#  ",
        y,m1,m2-m1,m3-m1,m4-m1);
#endif

    if (m4 == m1) {
      if(m3+m4>2*y) y = (m4+m3)/2; /* lower end may overlap the next line */
      continue;
    }
    jj=0;
    lines->wt[i] = 100;
    if (5 * (m2 - m1 +1) < m3 - m2 || (m2 - m1) < 2) jj|=1; /* same high */
    if (5 * (m4 - m3 +1) < m3 - m2 || (m4 - m3) < 1) jj|=2; /* same base */
    if (jj&1) lines->wt[i] = 75*lines->wt[i]/100;
    if (jj&2) lines->wt[i] = 75*lines->wt[i]/100;
    if (jj>0 && JOB->cfg.verbose) {
      fprintf(stderr," trouble on line %d, wt*100= %d\n",i,lines->wt[i]);
      fprintf(stderr,"#   m= %4d %+3d %+3d %+3d\n",m1,m2-m1,m3-m1,m4-m1);
      fprintf(stderr,"#   i=  %3d %3d %3d %3d (counts)\n",i1,i2,i3,i4);
      if (jj==3) fprintf(stderr,"#   all boxes of same high!\n#  ");
      if (jj==1) fprintf(stderr,"#   all boxes of same upper bound!\n#  ");
      if (jj==2) fprintf(stderr,"#   all boxes of same lower bound!\n#  ");
     }
    /* ToDo: check for dots ij,. to get the missing information */
#if 1
    /* jj=3: ABCDEF123456 or mnmno or gqpy or lkhfdtb => we are in trouble */
    if (jj==3 && (m4-m1)>my) { jj=0; m2=m1+my/8+1; m4=m3+my/8+1; } /* ABC123 */
    /* using idots, may fail on "ABCDEFG&Auml;&Uuml;&Ouml;" */
    if (jj==3 && mi>0 && mi<m1 && mi>m4pre) { jj=2; m1=mi; } /* use ij dots */
    if (jj==1 && m2-(m3-m2)/4>m3pre ) {      /* expect: acegmnopqrsuvwxyz */
      if (m1-m4pre<m4-m1)               /* fails for 0123ABCD+Q$ */
        m1 = ( m2 + m4pre ) / 2 ;
      else
        m1 = ( m2 - (m3 - m2) / 4 );
    }
    if (jj==3)
      m2 = m1 + (m3 - m1) / 4 + 1;	/* expect: 0123456789ABCDEF */
    if ( (m2 - m1) < 2)
      m2 = m1 + 2;                      /* font hight < 8 pixel ? */
    if (jj&2)
      m4 = m3 + (m4 - m1) / 4 + 1;	/* chars have same lower base */
    if (jj>0 && JOB->cfg.verbose & 16) {
      fprintf(stderr," m= %4d %+2d %+2d %+2d  my= %4d\n#  ",
              m1, m2-m1, m3-m1, m4-m1, my);
     }
#endif

    
    {				// empty space between lines
      lines->m4[i] = m4;
      lines->m3[i] = m3;
      lines->m2[i] = m2;
      lines->m1[i] = m1;
      lines->pitch[i] = JOB->cfg.spc; /* default word pitch */
      lines->mono[i] = 0;             /* default spacing, 0=prop, 1=mono */
      if (JOB->cfg.verbose & 16)
	fprintf(stderr, " m= %4d %+3d %+3d %+3d w= %d (line=%d)\n#  ",
		m1, m2 - m1, m3 - m1, m4 - m1, lines->wt[i], i);
      if (i < MAXlines && m4 - m1 > 4)
	i++;
      if (i >= MAXlines) {
	fprintf(stderr, "Warning: lines>MAXlines\n");
	break;
      }
    }
    if (m3+m4>2*y) y = (m3+m4)/2;  /* lower end may overlap the next line */
    if (m3>m3pre) m3pre = m3; else m3=y0; /* set for next-line scan */
    if (m4>m4pre) m4pre = m4; else m4=y0; /* set for next-line scan */
  }
  lines->num = i;
  if (JOB->cfg.verbose)
    fprintf(stderr, " num_lines= %d", lines->num-1);
  return 0;
}

// ----- layout analyzis of dx*dy region at x0,y0 -----
// ----- detect lines via recursive division (new version) ---------------
//   what about text in frames???
//  ToDo: change to bottom-top analyse or/and take rotation into account
int detect_lines2(pix *p,int x0,int y0,int dx,int dy,int r){
    int i,x2,y2,x3,y3,x4,y4,x5,y5,y6,mx,my,x30,x31,y30,y31;
    struct box *box2,*box3;
    // shrink box
    if(dx<=0 || dy<=0) return 0;
    if(y0+dy<  p->y/128 && y0==0) return 0;       /* looks like dust */
    if(y0>p->y-p->y/128 && y0+dy==p->y) return 0; /* looks like dust */
    
    if(r>1000){ return -1;} // something is wrong
    if(JOB->cfg.verbose)fprintf(stderr,"\n# r=%2d ",r);

    mx=my=i=0; // mean thickness
    // remove border, shrink size
    x2=x0+dx-1;  // min x
    y2=y0+dy-1;  // min y
    x3=x0;	// max x
    y3=y0;	// max y
    for_each_data(&(JOB->res.boxlist)) {
      box3 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if(box3->y0>=y0  && box3->y1<y0+dy &&
         box3->x0>=x0  && box3->x1<x0+dx)
      {
    	if( box3->x1 > x3 ) x3=box3->x1; // max x
        if( box3->x0 < x2 ) x2=box3->x0; // min x
        if( box3->y1 > y3 ) y3=box3->y1; // max y
        if( box3->y0 < y2 ) y2=box3->y0; // min y
        if(box3->c!=PICTURE)
        if( box3->y1 - box3->y0 > 4 )
        {
          i++;
      	  mx+=box3->x1-box3->x0+1; // mean x
          my+=box3->y1-box3->y0+1; // mean y
        }
      }
    } end_for_each(&(JOB->res.boxlist));
    x0=x2; dx=x3-x2+1;
    y0=y2; dy=y3-y2+1;

    if(i==0 || dx<=0 || dy<=0) return 0;
    mx/=i;my/=i;
    // better look for widest h/v-gap, ToDo: vertical lines?
    if(r<8){ // max. depth

      // detect widest horizontal gap
      y2=y3=y4=y5=y6=0;
      x2=x3=x4=x5=y5=0;// min. 3 lines
      // position and thickness of gap, y6=num_gaps, nbox^2 ops
      for_each_data(&(JOB->res.boxlist)) { // not very efficient, sorry
	box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
        if( box2->c!=PICTURE ) /* ToDo: not sure, that this is a good idea */
        if( box2->y0>=y0  && box2->y1<y0+dy
         && box2->x0>=x0  && box2->x1<x0+dx
         && box2->y1-box2->y0>my/2 ){ // no pictures & dust???

      	  y4=y0+dy-1;  // nearest vert. box
          x4=x0+dx-1;
          // ToDo: rotate back box2->x1,y1 to x21,y21
          // look for nearest lowest (y4) and right (x4) neighbour
          //   of every box (box2)
	  for_each_data(&(JOB->res.boxlist)) {
	    box3 = (struct box *)list_get_current(&(JOB->res.boxlist));
	    if(box3!=box2)
            if(box3->y0>=y0  && box3->y1<y0+dy)
            if(box3->x0>=x0  && box3->x1<x0+dx)
     	    if(box3->c!=PICTURE) /* ToDo: not sure, that this is a good idea */
       	    if(box3->y1-box3->y0>my/2 ){
       	      // ToDo: here we need the rotation around box2
       	      x30=box3->x0;
       	      x31=box3->x1;
       	      y30=box3->y0;
       	      y31=box3->y1;
       	      // get min. distances to lower and to right direction
              if( y31 > box2->y1  &&  y30 < y4 ) y4=y30-1;
              if( x31 > box2->x1  &&  x30 < x4 ) x4=x30-1;
            }
      	  } end_for_each(&(JOB->res.boxlist));
      	  // set the witdht and position of largest hor./vert. gap
          // largest gap:          width           position
          if( y4-box2->y1 > y3 ) { y3=y4-box2->y1; y2=(y4+box2->y1)/2; }
          if( x4-box2->x1 > x3 ) { x3=x4-box2->x1; x2=(x4+box2->x1)/2; }
	}
      } end_for_each(&(JOB->res.boxlist)); 
      // fprintf(stderr,"\n widest y-gap= %4d %4d",y2,y3);
      // fprintf(stderr,"\n widest x-gap= %4d %4d",x2,x3);

      i=0; // i=1 at x, i=2 at y
      // this is the critical point
      // is this a good decision or not???
      if(x3>0 || y3>0){
        if(x3>mx && x3>2*y3 && (dy>5*x3 || (x3>10*y3 && y3>0))) i=1; else
        if(dx>5*y3 && y3>my) i=2;
      }

      // compare with largest box???
      for_each_data(&(JOB->res.boxlist)) { // not very efficient, sorry
	box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
        if( box2->c == PICTURE )
        if( box2->y0>=y0  && box2->y1<y0+dy
         && box2->x0>=x0  && box2->x1<x0+dx )
        { // hline ???
          // largest gap:                  width position
          if( box2->x1-box2->x0+4 > dx && box2->y1+4<y0+dy ) { y3=1; y2=box2->y1+1; i=2; break; }
          if( box2->x1-box2->x0+4 > dx && box2->y0-4>y0    ) { y3=1; y2=box2->y0-1; i=2; break; }
          if( box2->y1-box2->y0+4 > dy && box2->x1+4<x0+dx ) { x3=1; x2=box2->x1+1; i=1; break; }
          if( box2->y1-box2->y0+4 > dy && box2->x0-4>x0    ) { x3=1; x2=box2->x0-1; i=1; break; }
	}
      } end_for_each(&(JOB->res.boxlist)); 
      if(JOB->cfg.verbose)fprintf(stderr," i=%d",i);

      if(JOB->cfg.verbose && i) fprintf(stderr," divide at %s x=%4d y=%4d dx=%4d dy=%4d",
        ((i)?( (i==1)?"x":"y" ):"?"),x2,y2,x3,y3);
      // divide horizontally if v-gap is thicker than h-gap
      // and length is larger 5*width
      if(i==1){        detect_lines2(p,x0,y0,x2-x0+1,dy,r+1);
                return detect_lines2(p,x2,y0,x0+dx-x2+1,dy,r+1); }
      // divide vertically
      if(i==2){        detect_lines2(p,x0,y0,dx,y2-y0+1,r+1);
                return detect_lines2(p,x0,y2,dx,y0+dy-y2+1,r+1);  
      }
    }


    if(JOB->cfg.verbose) if(dx<5 || dy<7)fprintf(stderr," empty box");
    if(dx<5 || dy<7) return 0; // do not care about dust
    if(JOB->cfg.verbose)fprintf(stderr, " box detected at %4d %4d %4d %4d",x0,y0,dx,dy);
    if(JOB->tmp.ppo.p){
        for(i=0;i<dx;i++)put(&JOB->tmp.ppo,x0+i   ,y0     ,255,16);
        for(i=0;i<dx;i++)put(&JOB->tmp.ppo,x0+i   ,y0+dy-1,255,16);
        for(i=0;i<dy;i++)put(&JOB->tmp.ppo,x0     ,y0+i   ,255,16);
        for(i=0;i<dy;i++)put(&JOB->tmp.ppo,x0+dx-1,y0+i   ,255,16);
        // writebmp("out10.bmp",p2,JOB->cfg.verbose); // colored should be better
    }
    return detect_lines1(p,x0-0*1,y0-0*2,dx+0*2,dy+0*3);

/*
    struct tlines *lines = &JOB->res.lines;
    i=lines->num; lines->num++;
    lines->m1[i]=y0;          lines->m2[i]=y0+5*dy/16;
    lines->m3[i]=y0+12*dy/16; lines->m4[i]=y0+dy-1;
    lines->x0[i]=x0;          lines->x1[i]=x0+dx-1;
    if(JOB->cfg.verbose)fprintf(stderr," - line= %d",lines->num);
    return 0;
 */
}

/* ToDo: herons algorithm for square root x=(x+y/x)/2 is more efficient
 *       than interval subdivision (?) (germ.: Intervallschachtelung)
 *       without using matlib
 *  see http://www.math.vt.edu/people/brown/doc/sqrts.pdf
 */
int my_sqrt(int x){
  int y0=0,y1=x,ym;
  for (;y0<y1-1;){
    ym=(y0+y1)/2;
    if (ym*ym<x) y0=ym; else y1=ym;
  }
  return y0;
}

/*
** Detect rotation angle (one for whole image)
** old: longest text-line and determining the angle of this line.
 *
 * search right nearest neighbour of each box and average vectors
 * to get the text orientation,
 * upside down decision is not made here (I dont know how to do it)
 *  ToDo: set job->res.lines.{dx,dy}
 * pass 1: get mean vector to nearest char
 * pass 2: get mean vector to nearest char without outriders to pass 1
 * extimate direction as (dx,dy,num)[pass]
 * ToDo: estimate an error, boxes only work fine for zero-rotation
 *       for 45 degree use vectors, not boxes to get base line
 */
#define INorm 1024   /* integer unit 1.0 */
int detect_rotation_angle(job_t *job){
  struct box *box2, *box3,
        *box_nn;  /* nearest neighbour box */
  int x2, y2, x3, y3, dist, mindist, pass,
      rx=0, ry=0, re=0,  // final result
      /* to avoid 2nd run, wie store pairs in 2 different categories */
      nn[4]={0,0,0,0}, /* num_pairs used for estimation [(pass-1)%2,pass%2] */ 
      dx[4]={0,0,0,0}, /* x-component of rotation vector per pass */
      dy[4]={0,0,0,0}, /* y-component of rotation vector per pass */ 
      er[4]={INorm/4,0,0,0}; /* mean angle deviation to pass-1 (radius^2) */
      // de;         /* ToDo: absolute maximum error (dx^2+dy^2) */ 
      // ToDo: next pass: go to bigger distances and reduce max error
      // error is diff between passes? or diff of bottoms and top borders (?)

  rx=1024; ry=0;  // default
  for (pass=0;pass<4;pass++) {
    for_each_data(&(job->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(job->res.boxlist));
      if (box2->c==PICTURE) continue;
      /* subfunction probability of char */
      // i?
      // if  (box2->x1 - box2->x0 < 3) continue; /* smallest font is 4x6 */
      if  (box2->y1 - box2->y0 < 4) continue;
      /* set maximum possible distance */
      box_nn=box2; // initial box to compare with

      // ToDo: clustering or majority
      // the algorithm is far from being perfect, pitfalls are likely
      // but its better than the old algorithm, ToDo: database-rotated-images
      mindist = job->src.p.x * job->src.p.x + job->src.p.y * job->src.p.y;
      /* get middle point of the box */
      x2 = (box2->x0 + box2->x1)/2;
      y2 = (box2->y0 + box2->y1)/2;
      re=0;
      /* search for nearest neighbour box_nn[pass+1] of box_nn[pass] */
      for_each_data(&(job->res.boxlist)) {
        box3 = (struct box *)list_get_current(&(job->res.boxlist));
        /* try to select only potential neighbouring chars */
        /* select out all senseless combinations */ 
        if (box3->c==PICTURE || box3==box2) continue;
        x3 = (box3->x0 + box3->x1)/2;
        y3 = (box3->y0 + box3->y1)/2; /* get middle point of the box */
        if (x3<x2) continue; /* simplify by going right only */
        // through-away deviation of angles if > pass-1?
        // scalprod max in direction, cross prod min in direction
        //  a,b (vectors): <a,b>^2/(|a|*|b|)^2 = 0(90deg)..0.5(45deg).. 1(0deg)
        //   * 1024 ??
        if (pass>0) {  // new variant = scalar product
          // danger of int overflow, ToDo: use int fraction
          re =(int) ((1.*(x3-x2)*dx[pass-1]+(y3-y2)*dy[pass-1])
              *(1.*(x3-x2)*dx[pass-1]+(y3-y2)*dy[pass-1])*INorm
              /(1.*((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2))
               *(1.*dx[pass-1]*dx[pass-1]+dy[pass-1]*dy[pass-1])));
          if (INorm-re>er[pass-1]) continue; // hits mean deviation
        }
        /* neighbours should have same order of size (?) */
        if (3*(box3->y1-box3->y0+4) < 2*(box2->y1-box2->y0+1)) continue;
        if (2*(box3->y1-box3->y0+1) > 3*(box2->y1-box2->y0+4)) continue;
        if (2*(box3->x1-box3->x0+1) > 5*(box2->x1-box2->x0+4)) continue;
        if (5*(box3->x1-box3->x0+4) < 2*(box2->x1-box2->x0+1)) continue;
        /* should be in right range, Idea: center3 outside box2? noholes */
        if ((x3<box2->x1-1) && (x3>box2->x0+1)
         && (y3<box2->y1-1) && (y3>box2->y0+1)) continue;
        // if chars are of different size, connect careful 
        if (  abs(x3-x2) > 2*(box2->x1 - box2->x0 + box3->x1 - box3 ->x0 + 2)) continue;
        if (  abs(y3-y2) >   (box2->x1 - box2->x0 + box3->x1 - box3 ->x0 + 2)) continue;
        dist = (y3-y2)*(y3-y2) + (x3-x2)*(x3-x2);
        // make distances in pass-1 directions shorter or continue if not in pass-1 range?
        if (dist<9) continue; /* minimum distance^2 is 3^2 */
        if (dist<mindist) { mindist=dist; box_nn=box3;}
        // fprintf(stderr,"x y %d %d  %d %d dist %d min %d\n",
        //         x2,y2,x3,y3,dist,mindist);
      } end_for_each(&(job->res.boxlist));
      
      if (box_nn==box2) continue; /* has no neighbour, next box */
      
      box3=box_nn; dist=mindist;
      x3 = (box3->x0 + box3->x1)/2;
      y3 = (box3->y0 + box3->y1)/2; /* get middle point of the box */
      // dist = my_sqrt(1024*((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2)));
      // compare with first box
      x2 = (box2->x0 + box2->x1)/2;
      y2 = (box2->y0 + box2->y1)/2;
      // if the high of neighbouring boxes differ, use min diff (y0,y1)
      if (pass>0 && 16*abs(dy[pass-1]) < dx[pass-1]) // dont work for strong rot.
      if (abs(box2->y1-box2->y0-box3->y1+box3->y0)>(box2->y1-box2->y0)/8) {
        // ad eh ck ...
        if (abs(box2->y1-box3->y1)<abs(y3-y2)) { y2=box2->y1; y3=box3->y1; }
        // ag ep qu ...
        if (abs(box2->y0-box3->y0)<abs(y3-y2)) { y2=box2->y0; y3=box3->y0; }
      }
      if (abs(x3-x2)<4) continue;
      dx[pass]+=(x3-x2)*1024; /* normalized before averaging */
      dy[pass]+=(y3-y2)*1024; /* 1024 is for the precision */
      nn[pass]++;
      if (pass>0) { // set error = mean deviation from pass -1
        re = INorm-(int)((1.*(x3-x2)*dx[pass-1]+(y3-y2)*dy[pass-1])
                    *(1.*(x3-x2)*dx[pass-1]+(y3-y2)*dy[pass-1])*INorm
                    /((1.*(x3-x2)*(x3-x2)+(y3-y2)*(y3-y2))
                     *(1.*dx[pass-1]*dx[pass-1]+dy[pass-1]*dy[pass-1]))
                    );
        er[pass]+=re;
      }
#if 0
      if(JOB->cfg.verbose)
        fprintf(stderr,"# next nb (x,y,dx,dy,re) %6d %6d %5d %5d %5d pass %d\n",
                x2, y2, x3-x2, y3-y2, re, pass+1);
#endif      
    } end_for_each(&(job->res.boxlist));
    if (!nn[pass]) break;
    if (nn[pass]) {
      /* meanvalues */
      rx=dx[pass]/=nn[pass];
      ry=dy[pass]/=nn[pass];
      if (pass>0) er[pass]/=nn[pass];
    }
    if(JOB->cfg.verbose)
      fprintf(stderr,"# rotation angle (x,y,maxr,num)"
                     " %6d %6d %6d %4d pass %d\n",
              rx, ry, er[pass], nn[pass], pass+1);
  }
  if (abs(ry*100)>abs(rx*50))
    fprintf(stderr,"<!-- gocr will fail, strong rotation angle detected -->\n");
  /* ToDo: normalize to 2^10 bit (square fits to 32 it) */
  JOB->res.lines.dx=rx;
  JOB->res.lines.dy=ry;
  return 0;
}

/* ----- detect lines --------------- */
int detect_text_lines(pix * pp, int mo) {

  if (JOB->cfg.verbose)
    fprintf(stderr, "# detect.c detect_text_lines (vvv=16 for more info) ");
  if (mo & 4){
    if (JOB->cfg.verbose) fprintf(stderr, "# zoning\n# ... ");
    detect_lines2(pp, 0, 0, pp->x, pp->y, 0);	// later replaced by better algo
  } else 
    detect_lines1(pp, 0, 0, pp->x, pp->y);	// old algo

  if(JOB->cfg.verbose) fprintf(stderr,"\n");
  return 0;
}


/* ----- adjust lines --------------- */
// rotation angle? JOB->res.lines.dy, .x0  removed later
// this is for cases, where m1..m4 is not very sure detected before 
//  chars are recognized
int adjust_text_lines(pix * pp, int mo) {
  struct box *box2;
  int *m, /* summ m1..m4, num_chars for m1..m4, min m1..m4, max. m1..m4 */
      l, i, dy, dx, diff=0, y0, y1;

  if ((l=JOB->res.lines.num)<2) return 0;  // ???
  if (JOB->cfg.verbose)
    fprintf(stderr, "# adjust text lines ");
  m=(int *)malloc(l*16*sizeof(int));
  if (!m) { fprintf(stderr," malloc failed\n"); return 0;}
  for (i=0;i<16*l;i++) m[i]=0; /* initialize */
  dy=JOB->res.lines.dy;  /* tan(alpha) of skewing */
  dx=JOB->res.lines.dx;  /* old: width of image */
  // js: later skewing is replaced by one transformation of vectorized image 

  if (dx)
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->line<=0) continue;
    if (box2->num_ac<1) continue;
    if (box2->wac[0]<95) continue;
    if (box2->m2==0 || box2->y1<box2->m2) continue; // char outside line
    if (box2->m3==4 || box2->y0>box2->m3) continue; // char outside line
    y0=box2->y0-((box2->x1)*dy/dx); /* corrected by page skewing */
    y1=box2->y1-((box2->x1)*dy/dx);
    if (strchr("aemnr",(char)box2->tac[0])) {  // cC vV sS oO ... is unsure!
      m[box2->line*16+1]+=y0; m[box2->line*16+5]++; // num m2
      m[box2->line*16+2]+=y1; m[box2->line*16+6]++; // num m3
      if (m[box2->line*16+ 9]>y0) m[box2->line*16+ 9]=y0; /* min m2 */
      if (m[box2->line*16+13]<y0) m[box2->line*16+13]=y0; /* max m2 */
      if (m[box2->line*16+10]>y1) m[box2->line*16+10]=y1; /* min m3 */
      if (m[box2->line*16+14]<y1) m[box2->line*16+14]=y1; /* max m3 */
    }
    if (strchr("bdhklABDEFGHIKLMNRT123456789",(char)box2->tac[0])) {
      m[box2->line*16+0]+=y0; m[box2->line*16+4]++; // num m1
      m[box2->line*16+2]+=y1; m[box2->line*16+6]++; // num m3
      if (m[box2->line*16+ 8]>y0) m[box2->line*16+ 8]=y0; /* min m1 */
      if (m[box2->line*16+12]<y0) m[box2->line*16+12]=y0; /* max m1 */
      if (m[box2->line*16+10]>y1) m[box2->line*16+10]=y1; /* min m3 */
      if (m[box2->line*16+14]<y1) m[box2->line*16+14]=y1; /* max m3 */
    }
    if (strchr("gq",(char)box2->tac[0])) {
      m[box2->line*16+1]+=y0; m[box2->line*16+5]++; // num m2
      m[box2->line*16+3]+=y1; m[box2->line*16+7]++; // num m4
      if (m[box2->line*16+ 9]>y0) m[box2->line*16+ 9]=y0; /* min m2 */
      if (m[box2->line*16+13]<y0) m[box2->line*16+13]=y0; /* max m2 */
      if (m[box2->line*16+11]>y1) m[box2->line*16+11]=y1; /* min m4 */
      if (m[box2->line*16+15]<y1) m[box2->line*16+15]=y1; /* max m4 */
    }
  } end_for_each(&(JOB->res.boxlist));
  
  for (i=1;i<l;i++) {
    diff=0; // show diff per line
    if (m[i*16+4]) diff+=abs(JOB->res.lines.m1[i]-m[i*16+0]/m[i*16+4]);
    if (m[i*16+5]) diff+=abs(JOB->res.lines.m2[i]-m[i*16+1]/m[i*16+5]);
    if (m[i*16+6]) diff+=abs(JOB->res.lines.m3[i]-m[i*16+2]/m[i*16+6]);
    if (m[i*16+7]) diff+=abs(JOB->res.lines.m4[i]-m[i*16+3]/m[i*16+7]);
    /* recalculate sureness, empirically */
    if (m[i*16+4]*m[i*16+5]*m[i*16+6]*m[i*16+7] > 0)
      JOB->res.lines.wt[i]=(JOB->res.lines.wt[i]+100)/2;
    else 
      JOB->res.lines.wt[i]=(JOB->res.lines.wt[i]*90)/100;
    // set mean values of sure detected bounds (rounded precisely)
    if ( m[i*16+4]) JOB->res.lines.m1[i]=(m[i*16+0]+m[i*16+4]/2)/m[i*16+4];
    if ( m[i*16+5]) JOB->res.lines.m2[i]=(m[i*16+1]+m[i*16+5]/2)/m[i*16+5];
    if ( m[i*16+6]) JOB->res.lines.m3[i]=(m[i*16+2]+m[i*16+6]/2)/m[i*16+6];
    if ( m[i*16+7]) JOB->res.lines.m4[i]=(m[i*16+3]+m[i*16+7]/2)/m[i*16+7];
    // care about very small fonts
    if (JOB->res.lines.m2[i]-JOB->res.lines.m1[i]<=1 && m[i*16+5]==0 && m[i*16+4])
        JOB->res.lines.m2[i]=JOB->res.lines.m1[i]+2;
    if (JOB->res.lines.m2[i]-JOB->res.lines.m1[i]<=1 && m[i*16+4]==0 && m[i*16+5])
        JOB->res.lines.m1[i]=JOB->res.lines.m2[i]-2;
    if (JOB->res.lines.m4[i]-JOB->res.lines.m3[i]<=1 && m[i*16+7]==0 && m[i*16+6])
        JOB->res.lines.m4[i]=JOB->res.lines.m3[i]+2;
    if (JOB->res.lines.m4[i]-JOB->res.lines.m3[i]<=1 && m[i*16+6]==0 && m[i*16+7])
        JOB->res.lines.m3[i]=JOB->res.lines.m4[i]-2;
    if ( m[i*16+7]<1 &&
        JOB->res.lines.m4[i]
      <=JOB->res.lines.m3[i]+(JOB->res.lines.m3[i]-JOB->res.lines.m2[i])/4 )
        JOB->res.lines.m4[i]=
        JOB->res.lines.m3[i]+(JOB->res.lines.m3[i]-JOB->res.lines.m2[i])/4;
    if ( m[i*16+7]<1 && m[i*16+12+2]>0 &&   // m4 < max.m3+..
        JOB->res.lines.m4[i] < 2*m[i*16+12+2]-JOB->res.lines.m3[i]+2 )
        JOB->res.lines.m4[i] = 2*m[i*16+12+2]-JOB->res.lines.m3[i]+2;
    if (JOB->res.lines.m4[i]<=JOB->res.lines.m3[i])
        JOB->res.lines.m4[i]= JOB->res.lines.m3[i]+1; /* 4x6 */
                   
    if (JOB->cfg.verbose & 17)
      fprintf(stderr, "\n#  line= %3d m= %4d %+3d %+3d %+3d "
                         " n= %2d %2d %2d %2d  w= %3d diff= %d",
	i, JOB->res.lines.m1[i],
	   JOB->res.lines.m2[i] - JOB->res.lines.m1[i],
	   JOB->res.lines.m3[i] - JOB->res.lines.m1[i],
	   JOB->res.lines.m4[i] - JOB->res.lines.m1[i],
	   m[i*16+4],m[i*16+5],m[i*16+6],m[i*16+7],
	   JOB->res.lines.wt[i], diff);
  }
  diff=0; // count adjusted chars
#if 1
  if (dx)
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->line<=0) continue;
    /* check if box was on the wrong line, ToDo: search a better line */
    if (2*box2->y0<2*JOB->res.lines.m1[box2->line]
                    -JOB->res.lines.m4[box2->line]
                    +JOB->res.lines.m1[box2->line]) box2->line=0;
    if (2*box2->y1>2*JOB->res.lines.m4[box2->line]
                    +JOB->res.lines.m4[box2->line]
                    -JOB->res.lines.m1[box2->line]) box2->line=0;
    /* do adjustments */
    if (box2->num_ac>0
     && box2->num_ac > 31 && box2->tac[0] < 127 /* islower(>256) may SIGSEGV */
     && strchr("cCoOpPsSuUvVwWxXyYzZ",(char)box2->tac[0])) { // no_wchar
      if (box2->y0-((box2->x1)*dy/dx)
       < (JOB->res.lines.m1[box2->line]+JOB->res.lines.m2[box2->line])/2
      && islower(box2->tac[0])
      ) { setac(box2,toupper((char)box2->tac[0]),(box2->wac[0]+101)/2); diff++; }
      if (box2->y0-((box2->x1)*dy/dx)
       > (JOB->res.lines.m1[box2->line]+JOB->res.lines.m2[box2->line]+1)/2
      && isupper(box2->tac[0])
      ){ setac(box2,tolower((char)box2->tac[0]),(box2->wac[0]+101)/2); diff++; }
    }
    box2->m1=JOB->res.lines.m1[box2->line]+((box2->x1)*dy/dx);
    box2->m2=JOB->res.lines.m2[box2->line]+((box2->x1)*dy/dx);
    box2->m3=JOB->res.lines.m3[box2->line]+((box2->x1)*dy/dx);
    box2->m4=JOB->res.lines.m4[box2->line]+((box2->x1)*dy/dx);
  } end_for_each(&(JOB->res.boxlist));
#endif

  free(m);
  if(JOB->cfg.verbose) fprintf(stderr,"\n#  changed_chars= %d\n",diff);
  return(diff);
}

/* ---- measure mean character
 * recalculate mean width and high after changes in boxlist
 * ToDo: only within a Range?
 */
int calc_average() {
  int i = 0, x0, y0, x1, y1;
  struct box *box4;

  JOB->res.numC = 0;
  JOB->res.sumY = 0;
  JOB->res.sumX = 0;
  for_each_data(&(JOB->res.boxlist)) {
    box4 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if( box4->c != PICTURE ){
      x0 = box4->x0;    x1 = box4->x1;
      y0 = box4->y0;    y1 = box4->y1;
      i++;
      if (JOB->res.avX * JOB->res.avY > 0) {
        if (x1 - x0 + 1 > 4 * JOB->res.avX
         && y1 - y0 + 1 > 4 * JOB->res.avY) continue; /* small picture */
        if (4 * (y1 - y0 + 1) < JOB->res.avY || y1 - y0 < 2) 
          continue;	// dots .,-_ etc.
      }
      if (x1 - x0 + 1 < 4 
       && y1 - y0 + 1 < 6 ) continue; /* dots etc */
      JOB->res.sumX += x1 - x0 + 1;
      JOB->res.sumY += y1 - y0 + 1;
      JOB->res.numC++;
    }
  } end_for_each(&(JOB->res.boxlist));
  if ( JOB->res.numC ) {		/* avoid div 0 */
    JOB->res.avY = (JOB->res.sumY+JOB->res.numC/2) / JOB->res.numC;
    JOB->res.avX = (JOB->res.sumX+JOB->res.numC/2) / JOB->res.numC;
  }
  if (JOB->cfg.verbose){
    fprintf(stderr, "# averages: mXmY= %d %d nC= %d n= %d\n",
  	    JOB->res.avX, JOB->res.avY, JOB->res.numC, i);
  }
  return 0;
}


/* ---- analyse boxes, find pictures and mark (do this first!!!)
 */
int detect_pictures(job_t *job) {
  int i = 0, x0, y0, x1, y1, num_h;
  struct box *box2, *box4;

  if ( job->res.numC == 0 ) {
    if (job->cfg.verbose) fprintf(stderr,
      "# detect.c L%d Warning: numC=0\n", __LINE__);
   return -1;
  }
  /* ToDo: set Y to uppercase mean value? */
  job->res.avY = (job->res.sumY+job->res.numC/2) / job->res.numC;
  job->res.avX = (job->res.sumX+job->res.numC/2) / job->res.numC;
  /* ToDo: two highest volumes? crosses, on extreme volume + on border */
  if (job->cfg.verbose)
    fprintf(stderr, "# detect.c L%d pictures, frames, mXmY= %d %d ... ",
  	    __LINE__, job->res.avX, job->res.avY);
  for_each_data(&(job->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(job->res.boxlist));
    if (box2->c == PICTURE) continue;
    x0 = box2->x0;    x1 = box2->x1;
    y0 = box2->y0;    y1 = box2->y1;

    /* pictures could be of unusual size */ 
    if (x1 - x0 + 1 > 4 * job->res.avX || y1 - y0 + 1 > 4 * job->res.avY) {
      /* count objects on same baseline which could be chars */
      /* else: big headlines could be misinterpreted as pictures */
      num_h=0;
      for_each_data(&(job->res.boxlist)) {
        box4 = (struct box *)list_get_current(&(job->res.boxlist));
        if (box4->c == PICTURE) continue;
        if (box4->y1-box4->y0 > 2*(y1-y0)) continue;
        if (2*(box4->y1-box4->y0) < y1-y0) continue;
        if (box4->y0 > y0 + (y1-y0+1)/2
         || box4->y0 < y0 - (y1-y0+1)/2
         || box4->y1 > y1 + (y1-y0+1)/2
         || box4->y1 < y1 - (y1-y0+1)/2)  continue;
        // ToDo: continue if numcross() only 1, example: |||IIIll|||
        num_h++;
      } end_for_each(&(job->res.boxlist));
      if (num_h>4) continue;
      box2->c = PICTURE;
      i++;
    }
    /* ToDo: pictures could have low contrast=Sum((pixel(p,x,y)-160)^2) */
  } end_for_each(&(job->res.boxlist));
  // start second iteration
  if (job->cfg.verbose) {
    fprintf(stderr, " %d - boxes %d\n", i, job->res.numC-i);
  }
  calc_average();
  return 0;
}
