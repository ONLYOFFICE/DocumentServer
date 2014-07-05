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

 see README for EMAIL address
 
 */

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>
/* do we need #include <math.h>? conflicts with INFINITY in unicode.h */
#include "gocr.h"
#include "pgm2asc.h"

/* for sorting letters by position on the image
/ ToDo: - use function same line like this or include lines.m1 etc. */
int box_gt(struct box *box1, struct box *box2) {
 // box1 after box2 ?
  if (box1->line > box2->line)
    return 1;
  if (box1->line < box2->line)
    return 0;
  if (box1->x0 > box2->x1)	// before
    return 1;
  if (box1->x1 < box2->x0)	// before
    return 0;
  if (box1->x0 > box2->x0)	// before,  overlapping!
    return 1;

  return 0;
}

/* --- copy part of pix p into new pix b	---- len=10000
 * Returns: 0 on success, 1 on error.
 * naming it as copybox isnt very clever, because it dont have to do with the
 *   char boxes (struct box)
 */
int copybox (pix * p, int x0, int y0, int dx, int dy, pix * b, int len) {
  int x, y;

  /* test boundaries */
  if (b->p == NULL || dx < 0 || dy < 0 || dx * dy > len) {
    fprintf(stderr, " error-copybox x=%5d %5d  d=%5d %5d\n", x0, y0, dx, dy);
    return 1;
  }

  b->x = dx;
  b->y = dy;
  b->bpp = 1;
#ifdef FASTER_INCOMPLETE
  for (y = 0; y < dy; y++)
    memcpy(&pixel_atp(b, 0, y), &pixel_atp(p, x0, y + y0 ), dx);
  // and unmark pixels
#else
  for (y = 0; y < dy; y++)
    for (x = 0; x < dx; x++)
      pixel_atp(b, x, y) = getpixel(p, x + x0, y + y0);
#endif

  return 0;
}

/* reset table of alternative chars (and free memory) */
int reset_box_ac(struct box *box){
  int i;
  for (i=0; i<box->num_ac; i++)
    if (box->tas[i]) {
       /* fprintf(stderr,"DBG free_s[%d] %p %s\n",i,box->tas[i],box->tas[i]); */
       free(box->tas[i]);
       box->tas[i]=0;     /* prevent double freeing */
     }
  box->num_ac=0;  /* mark as freed */
  return 0;
}

/* ini or copy a box: get memory for box and initialize the memory */
struct box *malloc_box (struct box *inibox) {
  struct box *buf;
  int i;

  buf = (struct box *) malloc(sizeof(struct box));
  if (!buf)
    return NULL;
  if (inibox) {
    memcpy(buf, inibox, sizeof(struct box));
    /* only pointer are copied, we want to copy the contents too */ 
    for (i=0;i<inibox->num_ac;i++) {
      if (inibox->tas[i]) {
        buf->tas[i]=(char *)malloc(strlen(inibox->tas[i])+1);
        memcpy(buf->tas[i], inibox->tas[i], strlen(inibox->tas[i])+1);
      }
    }
  }
  else { /* ToDo: init it */
    buf->num_ac=0;
    buf->num_frames=0;
  }
  /* fprintf(stderr,"\nDBG ini_box %p",buf); */
  return buf;
}

/* free memory of box */
int free_box (struct box *box) {
  if (!box) return 0;
  /* fprintf(stderr,"DBG free_box %p\n",box); out_x(box); */
  reset_box_ac(box); /* free alternative char table */
  free(box);         /* free the box memory */
  return 0;
}

/* simplify the vectorgraph, 
 *  but what is the best way?
 *   a) melting two neighbouring vectors with nearly same direction?
 *      (nearest angle to pi)
 *   b) melting three neigbours with smallest area?
 * ToDo:
 * mode = 0 - only lossless
 * mode = 1 - reduce one vector, smallest possible loss
 * mode = 2 - remove jitter (todo, or somewhere else)
 * ToDo: include also loop around (last - first element)
 * ToDo: reduce by 10..50%
 */
int reduce_vectors ( struct box *box1, int mode ) {
  int i1, i2, nx, ny, mx, my, len,
      minlen=1024, /* minlength of to neighbouring vectors */
      besti1=0,  /* frame for best reduction */
      besti2=2;  /* vector replacing its predecessor */
  double  sprod, maxsprod=-1;
  if (mode!=1) fprintf(stderr,"ERR not supported yet, ToDo\n");
  for (i2=1,i1=0; i1<box1->num_frames; i1++) {    /* every frame */
    for (;i2<box1->num_frame_vectors[i1]-1; i2++) { /* every vector */
      /* predecessor n */
      nx = box1->frame_vector[i2-0][0] - box1->frame_vector[i2-1][0];
      ny = box1->frame_vector[i2-0][1] - box1->frame_vector[i2-1][1];
      /* successor   m */
      mx = box1->frame_vector[i2+1][0] - box1->frame_vector[i2-0][0];
      my = box1->frame_vector[i2+1][1] - box1->frame_vector[i2-0][1];
      /* angle is w = a*b/(|a|*|b|) = 1 means parallel   */
      /* normalized: minimize w^2 = (a*b/(|a|*|b|)-1)^2  */
      /*             -1=90grd, 0=0grd, -2=180grd         */
      sprod = /* fabs */(abs(nx*mx+ny*my)*(nx*mx+ny*my)
                       /(1.*(nx*nx+ny*ny)*(mx*mx+my*my))-1);
      /* we dont include math.h because INFINITY conflicts to unicode,h */
      if (sprod<0) sprod=-sprod;
      len =           (mx*mx+my*my)*(nx*nx+ny*ny); /* sum lengths^2 */
// ..c          ###c           ...          ..          ...
// .b. len=2+2  #b.. len=2+5   #bc len=1+2  bc len=1+1  b#a len=4+5 
// a.. spr=0    a... spr=1/10  a.. spr=1/4  a. spr=1    ##c spr=9/5
//
      if (   len*   sprod*   sprod*   sprod*   sprod
         <minlen*maxsprod*maxsprod*maxsprod*maxsprod
       || maxsprod<0) /* Bad! ToDo! */
      { maxsprod=sprod; besti1=i1; besti2=i2; minlen=len; }
    }
  }
  if (box1->num_frames>0)
  for (i2=besti2; i2<box1->num_frame_vectors[ box1->num_frames-1 ]-1; i2++) {
    box1->frame_vector[i2][0]=box1->frame_vector[i2+1][0];
    box1->frame_vector[i2][1]=box1->frame_vector[i2+1][1];
  }
  for (i1=besti1; i1<box1->num_frames; i1++)
    box1->num_frame_vectors[i1]--;
//  fprintf(stderr,"\nDBG_reduce_vectors i= %d nv= %d sprod=%f len2=%d\n# ...",
//     besti2,box1->num_frame_vectors[ box1->num_frames-1 ],maxsprod,minlen);
//  out_x(box1);
  return 0;
}

/* add the contents of box2 to box1
 * especially add vectors of box2 to box1
 */
int merge_boxes( struct box *box1, struct box *box2 ) {
  int i1, i2, i3, i4;
  struct box tmpbox, *bsmaller, *bbigger; /* for mixing and sorting */
  /* DEBUG, use valgrind to check uninitialized memory */
#if 0
  fprintf(stderr,"\nDBG merge_boxes_input:"); out_x(box1); out_x(box2);
#endif
  /* pair distance is to expendable, taking borders is easier */
  if ((box2->x1 - box2->x0)*(box2->y1 - box2->y0)
     >(box1->x1 - box1->x0)*(box1->y1 - box1->y0)) {
      bbigger=box2; bsmaller=box1; }
  else {
      bbigger=box1; bsmaller=box2; }
  /* ToDo: does not work if a third box is added */
  if (box2->y0>box1->y1 || box2->y1<box1->y0
   || box2->x0>box1->x1 || box2->x1<box1->x0) {
    box1->num_boxes    += box2->num_boxes;    /* num seperate objects 2=ij */
  } else {
    if (box2->num_boxes>box1->num_boxes) box1->num_boxes=box2->num_boxes;
    box1->num_subboxes += box2->num_subboxes+1; /* num holes 1=abdepq 2=B */
  }
  box1->dots         += box2->dots;         /* num i-dots */
  if ( box2->x0 < box1->x0 ) box1->x0 = box2->x0; 
  if ( box2->x1 > box1->x1 ) box1->x1 = box2->x1;
  if ( box2->y0 < box1->y0 ) box1->y0 = box2->y0;
  if ( box2->y1 > box1->y1 ) box1->y1 = box2->y1;
  i1 = i2 = 0;
  if (bbigger->num_frames) 
    i1 =  bbigger->num_frame_vectors[  bbigger->num_frames - 1 ];
  if (bsmaller->num_frames)
    i2 = bsmaller->num_frame_vectors[ bsmaller->num_frames - 1 ];
  while (i1+i2 > MaxFrameVectors) {
    if (i1>i2) { reduce_vectors(  bbigger, 1 ); i1--; }
    else       { reduce_vectors( bsmaller, 1 ); i2--; }
  }
  /* if i1+i2>MaxFrameVectors  simplify the vectorgraph */
  /* if sum num_frames>MaxNumFrames  through shortest graph away and warn */
  /* first copy the bigger box */
  memcpy(&tmpbox, bbigger, sizeof(struct box));
  /* attach the smaller box */
  for (i4=i3=0; i3<bsmaller->num_frames; i3++) {
    if (tmpbox.num_frames>=MaxNumFrames) break;
    
    for  (; i4<bsmaller->num_frame_vectors[i3]; i4++) {
      memcpy(tmpbox.frame_vector[i1],
          bsmaller->frame_vector[i4],2*sizeof(int));
      i1++;
    }
    tmpbox.num_frame_vectors[ tmpbox.num_frames ] = i1;
    tmpbox.frame_vol[ tmpbox.num_frames ] = bsmaller->frame_vol[ i3 ];
    tmpbox.frame_per[ tmpbox.num_frames ] = bsmaller->frame_per[ i3 ];
    tmpbox.num_frames++;
    if (tmpbox.num_frames>=MaxNumFrames) {
      if (JOB->cfg.verbose)
        fprintf(stderr,"\nDBG merge_boxes MaxNumFrames reached");
      break;
    }
  }
  /* copy tmpbox to destination */
  box1->num_frames = tmpbox.num_frames;
  memcpy(box1->num_frame_vectors,
         tmpbox.num_frame_vectors,sizeof(int)*MaxNumFrames);
  memcpy(box1->frame_vol,
         tmpbox.frame_vol,sizeof(int)*MaxNumFrames);
  memcpy(box1->frame_per,
         tmpbox.frame_per,sizeof(int)*MaxNumFrames);
  memcpy(box1->frame_vector,
         tmpbox.frame_vector,sizeof(int)*2*MaxFrameVectors);
#if 0
  if (JOB->cfg.verbose)
    fprintf(stderr,"\nDBG merge_boxes_result:"); out_x(box1);
#endif
  return 0;
}

/* used for division of glued chars
 * after a box is splitted into 2, where vectors are copied to both,
 * vectors outside the new box are cutted and thrown away,
 * later replaced by
 *  - 1st remove outside vectors with outside neighbours (complete frames?)
 *        add vector on outside vector with inside neighbours
 *        care about connections through box between outside vectors 
 *  - 2nd reduce outside crossings (inclusive splitting frames if necessary)
 *        depending on direction (rotation) of outside connections
 *  - 3th shift outside vectors to crossing points
 *  - split add this points, connect only in-out...out-in,
 *  - cutting can result in more objects
 * ToDo:
 *       dont connect  --1---2--------3----4--  new-y1 (inside above not drawn)
 *                        \   \->>>>-/    /             outside
 *                         \----<<<<-----/      old-y1
 *                            |======| subtractable? 
 *
 *       only connect  --1---2--------3----4--  new-y1
 *                        \>>/        \>>>/     old-y1  outside
 *  ToDo: what about cutting 2 frames (example: 2fold melted MN)
 *        better restart framing algo?
 *
 *  ToDo: new vol, per
 */
int cut_box( struct box *box1) {
  int i1, i2, i3, i4, x, y, lx, ly, dbg=0;
  if (JOB->cfg.verbose) dbg=1;  // debug level, enlarge to get more output
  if (dbg) fprintf(stderr,"\n cut box x= %3d %3d", box1->x0, box1->y0);
  /* check if complete frames are outside the box */
  for (i1=0; i1<box1->num_frames; i1++){
    if (dbg>2) fprintf(stderr,"\n checking frame %d outside", i1);
    i2 = ((i1)?box1->num_frame_vectors[ i1-1 ]:0); // this frame
    i3 =       box1->num_frame_vectors[ i1   ];    // next frame
    for (i4=i2; i4 < i3; i4++) {
      x = box1->frame_vector[i4][0];
      y = box1->frame_vector[i4][1];
      /* break, if one vector is lying inside */
      if (x>=box1->x0 && x<=box1->x1 && y>=box1->y0 && y<=box1->y1) break;
    }
    if (i4==i3) { /* all vectors outside */
      if (dbg>1) fprintf(stderr,"\n remove frame %d",i1);
      /* replace all frames i1,i1+1,... by i1+1,i1+2,... */
      /* replace (x,y) pairs first */
      for (i4=i2; i4<box1->num_frame_vectors[ box1->num_frames-1 ]-(i3-i2);
           i4++) {
        box1->frame_vector[i4][0] = box1->frame_vector[i4+i3-i2][0];
        box1->frame_vector[i4][1] = box1->frame_vector[i4+i3-i2][1];
      }
      /* replace the num_frame_vectors */
      for (i4=i1; i4<box1->num_frames-1; i4++)
        box1->num_frame_vectors[ i4 ] =
          box1->num_frame_vectors[ i4+1 ]-(i3-i2);
      box1->num_frames--; i1--;
    }
  }
  /* remove vectors outside the box */
  i3=0;
  for (i1=0; i1<box1->num_frames; i1++){
    if (dbg>2) fprintf(stderr,"\n check cutting vectors on frame %d", i1);
    x = box1->frame_vector[0][0]; /* last x */
    y = box1->frame_vector[0][1]; /* last y */
    /* ToDo: start inside to get a closed object */
    if (x<box1->x0 || x>box1->x1 || y<box1->y0 || y>box1->y1) i3=1;
    for (i2=0; i2<box1->num_frame_vectors[ i1 ]; i2++) {
      lx = x; /* last x */
      ly = y; /* last y */
      x = box1->frame_vector[i2][0];
      y = box1->frame_vector[i2][1];
      // fprintf(stderr,"DBG LEV3 i2= %3d  xy= %3d %3d",i2,x,y);
      /* check if outside */
      if (x<box1->x0 || x>box1->x1 || y<box1->y0 || y>box1->y1) {
        /* replace by nearest point at border, ToDo: better crossingpoint */
        if (i3==0) {  /* wrong if it starts outside */
          if (x < box1->x0) x = box1->frame_vector[i2][0] = box1->x0;
          if (x > box1->x1) x = box1->frame_vector[i2][0] = box1->x1;
          if (y < box1->y0) y = box1->frame_vector[i2][1] = box1->y0;
          if (y > box1->y1) y = box1->frame_vector[i2][1] = box1->y1;
        } else {
          /* remove vector */
          if (dbg>1) fprintf(stderr,"\n remove vector[%d][%d] x= %2d %2d",i1,i2,x-box1->x0,y-box1->y0);
          for (i4=i2;i4<box1->num_frame_vectors[ box1->num_frames-1 ]-1;i4++) {
            box1->frame_vector[i4][0] = box1->frame_vector[i4+1][0];
            box1->frame_vector[i4][1] = box1->frame_vector[i4+1][1];
          }
          for (i4=i1; i4<box1->num_frames; i4++)
                         box1->num_frame_vectors[ i4 ]--;
          i2--; /* next element is shiftet now, setting back the counter */
        }
        i3++;
        // fprintf(stderr," outside i3= %d\n",i3);
        continue;
      }
      // fprintf(stderr," inside  i3= %d",i3);
      if (i3) { /* ToDo: better crossing point last vector and border */
          if (lx < box1->x0) lx = box1->x0;
          if (lx > box1->x1) lx = box1->x1;
          if (ly < box1->y0) ly = box1->y0;
          if (ly > box1->y1) ly = box1->y1;
          x = box1->frame_vector[i2][0] = lx;
          y = box1->frame_vector[i2][1] = ly;
          i3 = 0;
      }
      // fprintf(stderr," xy= %3d %3d\n",x,y);
    }
  }
  if (dbg>2) { fprintf(stderr,"\nDBG cut_box_result:"); out_x(box1); }
  return 0;
}

