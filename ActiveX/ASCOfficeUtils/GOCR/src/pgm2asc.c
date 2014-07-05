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

 - look for ??? for preliminary code
 - space: avX=22 11-13 (empirical estimated)
          avX=16  5-7
          avX= 7  5-6
         
 ToDo: - add filter (r/s mismatch) g300c1
       - better get_line2 function (problems on high resolution)
       - write parallelizable code!
       - learnmode (optimize filter)
       - use ispell for final control or if unsure
       - better line scanning (if not even)
       - step 5: same chars differ? => expert mode
       - chars dx>dy and above 50% hor-crossing > 4 is char-group ?
       - detect color of chars and background
       - better word space calculation (look at the examples)
          (distance: left-left, middle-middle, left-right, thickness of e *0.75)

   GLOBAL DATA (mostly structures)
   - pix   : image - one byte per pixel  bits0-2=working
   - lines : rows of the text (points to pix)
   - box   : list of bounding box for character 
   - obj   : objects (lines, splines, etc. building a character)
 */


#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <ctype.h>
#include "config.h"
#ifdef HAVE_WCHAR_H
#include <wchar.h>
#endif

#include "amiga.h"
#include "list.h"
#include "pgm2asc.h"
// #include "pcx.h"        /* needed for writebmp (removed later) */
/* ocr1 is the test-engine - remember: this is development version */
#include "ocr1.h"
/* first engine */
#include "ocr0.h"
#include "otsu.h"
#include "barcode.h"
#include "progress.h"

#include "gocr.h"

/* wew: will be exceeded by capitals at 1200dpi */
#define MaxBox (100*200)	// largest possible letter (buffersize)
#define MAX(a,b)			((a) >= (b) ? (a) : (b))

/* if the system does not know about wchar.h, define functions here */
#ifndef HAVE_WCHAR_H
/* typedef unsigned wchar_t; */
/* Find the first occurrence of WC in WCS.  */
wchar_t *wcschr (wchar_t *wcs, wchar_t wc) {
  int i; for(i=0;wcs[i];i++) if (wcs[i]==wc) return wcs+i; return NULL;
}
wchar_t *wcscpy (wchar_t *dest, const wchar_t *src) {
  int i; for(i=0;src[i];i++) dest[i]=src[i]; dest[i]=0; return dest;
}
size_t wcslen (const wchar_t *s){
  size_t i; for(i=0;s[i];i++); return i;
}
#endif
#ifndef HAVE_WCSDUP
wchar_t * wcsdup (const wchar_t *WS) {	/* its a gnu extension */
  wchar_t *copy;
  copy = (wchar_t *) malloc((wcslen(WS)+1)*sizeof(wchar_t));
  if (!copy)return NULL;
  wcscpy(copy, WS);
  return copy;
}   
#endif

// ------------------------ feature extraction -----------------
// -------------------------------------------------------------
// detect maximas in of line overlaps (return in %) and line coordinates
// this is for future use
#define HOR 1    // horizontal
#define VER 2    // vertical
#define RIS 3    // rising=steigend
#define FAL 4    // falling=fallend

/* exchange two variables */
static void swap(int *a, int *b) { 
  int c = *a;
  *a = *b;
  *b = c;
}

// calculate the overlapping of the line (0-1) with black points 
// by recursive bisection 
// line: y=dy/dx*x+b, implicit form: d=F(x,y)=dy*x-dx*y+b*dx=0 
// incremental y(i+1)=m*(x(i)+1)+b, F(x+1,y+1)=f(F(x,y))
// ret & 1 => inverse pixel!
// d=2*F(x,y) integer numbers
int get_line(int x0, int y0, int x1, int y1, pix *p, int cs, int ret){
   int dx,dy,incrE,incrNE,d,x,y,r0,r1,ty,tx,
       *px,*py,*pdx,*pdy,*ptx,*pty,*px1;
   dx=abs(x1-x0); tx=((x1>x0)?1:-1);    // tx=x-spiegelung (new)  
   dy=abs(y1-y0); ty=((y1>y0)?1:-1);	// ty=y-spiegelung (new)
   // rotate coordinate system if dy>dx
/*bbg: can be faster if instead of pointers we use the variables and swaps? */
/*js: Do not know, I am happy that the current code is working and is small */
   if(dx>dy){ pdx=&dx;pdy=&dy;px=&x;py=&y;ptx=&tx;pty=&ty;px1=&x1; }
   else     { pdx=&dy;pdy=&dx;px=&y;py=&x;ptx=&ty;pty=&tx;px1=&y1; }
   if( *ptx<0 ){ swap(&x0,&x1);swap(&y0,&y1);tx=-tx;ty=-ty; }
   d=((*pdy)<<1)-(*pdx); incrE=(*pdy)<<1; incrNE=((*pdy)-(*pdx))<<1;  
   x=x0; y=y0; r0=r1=0; /* dd=tolerance (store max drift) */
   while( (*px)<=(*px1) ){ 
     if( ((getpixel(p,x,y)<cs)?1:0)^(ret&1) ) r0++; else r1++;
     (*px)++; if( d<=0 ){ d+=incrE; } else { d+=incrNE; (*py)+=(*pty); }
   }
   return (r0*(ret&~1))/(r0+r1); // ret==100 => percentage %
}

// this function should detect whether a direct connection between points
//   exists or not, not finally implemented
// ret & 1 => inverse pixel!
// d=2*F(x,y) integer numbers, ideal line: ,I pixel: I@
//   ..@  @@@  .@.  ...,@2@. +1..+3 floodfill around line ???
//   ..@  .@@  .@.  ...,.@@@ +2..+4 <= that's not implemented yet
//   ..@  ..@  .@.  ...,.@@@ +2..+4
//   @.@  @..  .@.  ...,@@@. +1..+3
//   @.@  @@.  .@.  ...I@@@.  0..+3
//   @@@  @@@  .@.  ..@1@@..  0..+2
//   90%   0%  100%   90%     r1-r2
// I am not satisfied with it
int get_line2(int x0, int y0, int x1, int y1, pix *p, int cs, int ret){
   int dx,dy,incrE,incrNE,d,x,y,r0,r1,ty,tx,q,ddy,rx,ry,
       *px,*py,*pdx,*pdy,*ptx,*pty,*px1;
   dx=abs(x1-x0); tx=((x1>x0)?1:-1);    // tx=x-spiegelung (new)  
   dy=abs(y1-y0); ty=((y1>y0)?1:-1);	// ty=y-spiegelung (new)
   // rotate coordinate system if dy>dx
   if(dx>dy){ pdx=&dx;pdy=&dy;px=&x;py=&y;ptx=&tx;pty=&ty;px1=&x1;rx=1;ry=0; }
   else     { pdx=&dy;pdy=&dx;px=&y;py=&x;ptx=&ty;pty=&tx;px1=&y1;rx=0;ry=1; }
   if( *ptx<0 ){ swap(&x0,&x1);swap(&y0,&y1);tx=-tx;ty=-ty; }
   d=((*pdy)<<1)-(*pdx); incrE=(*pdy)<<1; incrNE=((*pdy)-(*pdx))<<1;  
   x=x0; y=y0; r0=r1=0; ddy=3; // tolerance = bit 1 + bit 0 = left+right
   // int t=(*pdx)/16,tl,tr;  // tolerance, left-,right delimiter
   while( (*px)<=(*px1) ){  // not finaly implemented
     q=((getpixel(p,x,y)<cs)?1:0)^(ret&1);
     if ( !q ){		// tolerance one pixel perpenticular to the line
                        // what about 2 or more pixels tolerance???
       ddy&=(~1)|(((getpixel(p,x+ry,y+rx)<cs)?1:0)^(ret&1));
       ddy&=(~2)|(((getpixel(p,x-ry,y-rx)<cs)?1:0)^(ret&1))*2;
     } else ddy=3;
     if( ddy ) r0++; else r1++;
     (*px)++; if( d<=0 ){ d+=incrE; } else { d+=incrNE; (*py)+=(*pty); }
   }
   return (r0*(ret&~1))/(r0+r1); // ret==100 => percentage %
}

/* Look for dots in the rectangular region x0 <= x <= x1 and y0 <= y
 <= y1 in pixmap p.  The two low order bits in mask indicate the color
 of dots to look for: If mask==1 then look for black dots (where a
 pixel value less than cs is considered black).  If mask==2 then look
 for white dots.  If mask==3 then look for both black and white dots.
 If the dots are found, the corresponding bits are set in the returned
 value.  Heavily used by the engine ocr0*.cc */
char get_bw(int x0, int x1, int y0, int y1, pix * p, int cs, int mask) {
  char rc = 0;			// later with error < 2% (1 dot)
  int x, y;

  if (x0 < 0)        x0 = 0;
  if (x1 >= p->x)    x1 = p->x - 1;
  if (y0 < 0)        y0 = 0;
  if (y1 >= p->y)    y1 = p->y - 1;

  for ( y = y0; y <= y1; y++)
    for ( x = x0; x <= x1; x++) {
      rc |= ((getpixel(p, x, y) < cs) ? 1 : 2);	// break if rc==3
      if ((rc & mask) == mask)
	return mask;		// break loop
    }
  return (rc & mask);
}

/* more general Mar2000 (x0,x1,y0,y1 instead of x0,y0,x1,y1! (history))
 * look for black crossings throw a line from x0,y0 to x1,y1 and count them
 * follow line and count crossings ([white]-black-transitions)
 *  ex: horizontal num_cross of 'm' would return 3
 *
 * fail for:  .a... a-to-b counts no transitions, but there is
 *            ...#.
 *            ..#..
 *            .#..b
 */
int num_cross(int x0, int x1, int y0, int y1, pix *p, int cs) {
  int rc = 0, col = 0, k, x, y, i, d;	// rc=crossings  col=0=white
  int dx = x1 - x0, dy = y1 - y0;

  d = MAX(abs(dx), abs(dy));
  for (i = 0, x = x0, y = y0; i <= d; i++) {
    if (d) {
      x = x0 + i * dx / d;
      y = y0 + i * dy / d;
    }
    k = ((getpixel(p, x, y) < cs) ? 1 : 0);	// 0=white 1=black
    if (col == 0 && k == 1)  // found a white-black transition
      rc++;
    col = k;        // last color
  }
  return rc;
}

/* check if test matches pattern
 *   possible pattern: "a-zA-Z0-9+--\\"  (x-y dont work for c>127)
 *  return: 0 means dont fit, 1 means found
 *   ToDo: wchar_t cc + matching UTF-8 pattern for nonASCII
 */
int my_strchr( char *pattern, wchar_t cc ) {
  char *s1;
  if (pattern==(char *)NULL) return 0;
  
  /* if (!(cc&0x80)) s1=strchr(pattern,(char)cc);  else */          
  switch (cc) {
    case '-':                  /* used as a special character */
      s1=strstr(pattern,"--"); /* search string -- in pattern */
      if (s1) return 1; break;
    default:
      s1=strstr(pattern,decode(cc, UTF8)); /* search string cc in pattern */
      if (s1) return 1; /* cc simply matches */
      /* single char not found, now check the ranges */
      s1=pattern;
      while (s1) {
        s1=strchr(s1+1,'-');  /* look for next '-' */
        if ((!s1) || (!s1[0]) || (!s1[1])) return 0; /* nothing found or end */
        if (*(s1-1)=='-' || *(s1+1)=='-') continue; /* skip -- pattern */
        if (*(s1-1)<=cc && *(s1+1)>=cc) return 1;  /* within range */
      }
  }
  return 0;
}

/* set alternate chars and its weight, called from the engine
    if a char is recognized to (weight) percent
   can be used for filtering (only numbers etc)
   often usefull if Il1 are looking very similar
   should this function stay in box.c ???
   weight is between 0 and 100 in percent, 100 means absolutely sure
   - not final, not time critical (js)
   - replace it by a string-function setaobj(*b,"string",weight)
     and let call setac the setas function 
 */

int setas(struct box *b, char *as, int weight){
  int i,j;
  if (b->num_ac > NumAlt || b->num_ac<0) {
    fprintf(stderr,"\nDBG: There is something wrong with setas()!");
    b->num_ac=0;
  }
  if (as==NULL) {
    fprintf(stderr,"\nDBG: setas(NULL) makes no sense!"); return 0; }
  if (as[0]==0) {
    fprintf(stderr,"\nDBG: setas(\"\") makes no sense!"
                   " x= %d %d", b->x0, b->y0);
    // out_x(b);
    return 0;
  }

  /* char filter (ex: only numbers) ToDo: cfilter as UTF-8 */
  if (JOB->cfg.cfilter) {
    /* do not accept chars which are not in the cfilter string */
    if ( as[0]>0 && as[1]==0 )
    if ( !my_strchr(JOB->cfg.cfilter,as[0]) ) return 0;
  }
#if 0 /* obsolete, done in setac */
  /* not sure that this is the right place, but where else? */
  if ( as[0]>0 && as[1]==0 )
  if (b->modifier != SPACE  &&  b->modifier != 0) {
    wchar_t newac;
    newac = compose(as[0], b->modifier);
    as = (char *)decode(newac, UTF8); /* was (const char *) */
    if (newac == as[0]) { /* nothing composed */
      fprintf(stderr, "\nDBG setas compose was useless %d %d",b->x0,b->y0);
      // out_x(b);
    }
  }
#endif
  
  /* only the first run gets the full weight */
  weight=(100-JOB->tmp.n_run)*weight/100;
  
  /* remove same entries from table */
  for (i=0;i<b->num_ac;i++) 
    if (b->tas[i])
      if (strcmp(as,b->tas[i])==0) break;
  if (b->num_ac>0 && i<b->num_ac){
    if (weight<=b->wac[i]) return 0; /* if found + less weight ignore it */
    /* to insert the new weigth on the right place, we remove it first */
    if (b->tas[i]) free(b->tas[i]); 
    for (j=i;j<b->num_ac-1;j++){  /* shift lower entries */
      b->tac[j]=b->tac[j+1]; /* copy the char   */
      b->tas[j]=b->tas[j+1]; /* copy the pointer to the string */
      b->wac[j]=b->wac[j+1]; /* copy the weight */
    }
    b->num_ac--; /* shrink table */
  }
  /* sorting and add it to the table */
  for (i=0;i<b->num_ac;i++) if (weight>b->wac[i]) break;
  if (b->num_ac<NumAlt-1) b->num_ac++; /* enlarge table */
  for (j=b->num_ac-1;j>i;j--){  /* shift lower entries */
    b->tac[j]=b->tac[j-1]; /* copy the char   */
    b->tas[j]=b->tas[j-1]; /* copy the pointer to the string */
    b->wac[j]=b->wac[j-1]; /* copy the weight */
  }
  if (i<b->num_ac) {    /* insert new entry */
    b->tac[i]=0;        /* insert the char=0 ... */
    b->tas[i]=(char *)malloc(strlen(as)+1);     /* ... string */
    if (b->tas[i]) memcpy(b->tas[i],as,strlen(as)+1);
    b->wac[i]=weight;   /* ... and its weight  */
  }
  if (i==0) b->c=b->tac[0];  /* char or 0 for string */
  return 0;
}

/* ToDo: this function will be replaced by a call of setas() later */
int setac(struct box *b, wchar_t ac, int weight){
  int i,j;
  if ((!b) || b->num_ac > NumAlt || b->num_ac<0) {
    fprintf(stderr,"\nDBG: This is a bad call to setac()!");
    if(b && (JOB->cfg.verbose & 6)) out_x(b);
    b->num_ac=0;
  }
  if (ac==0 || ac==UNKNOWN) {
    fprintf(stderr,"\nDBG: setac(0) makes no sense!");
    return 0;
  }
  /* char filter (ex: only numbers) ToDo: cfilter as UTF-8 */
  if (JOB->cfg.cfilter) {
    /* do not accept chars which are not in the cfilter string */
    /* if ( ac>255 || !strchr(JOB->cfg.cfilter,(char)ac) ) return 0; */
    if ( !my_strchr(JOB->cfg.cfilter,ac) ) return 0;
  }
  /* not sure that this is the right place, but where else? */
  if (b->modifier != SPACE  &&  b->modifier != 0) {
    wchar_t newac;
    newac = compose(ac, b->modifier);
    if (newac == ac) { /* nothing composed */
      if(JOB->cfg.verbose & 7) 
        fprintf(stderr, "\nDBG setac(%s): compose was useless @ %d %d",
                decode(ac,ASCII), b->x0, b->y0);
      /* if(JOB->cfg.verbose & 6) out_x(b); */
    }
    ac = newac;
  }
  
  /* only the first run gets the full weight */
  weight=(100-JOB->tmp.n_run)*weight/100;
  
  /* remove same entries from table */
  for (i=0;i<b->num_ac;i++) if (ac==b->tac[i]) break;
  if (b->num_ac>0 && i<b->num_ac){
    if (weight<=b->wac[i]) return 0;
    if (b->tas[i]) free(b->tas[i]); 
    for (j=i;j<b->num_ac-1;j++){  /* shift lower entries */
      b->tac[j]=b->tac[j+1]; /* copy the char   */
      b->tas[j]=b->tas[j+1]; /* copy the pointer to the string */
      b->wac[j]=b->wac[j+1]; /* copy the weight */
    }
    b->num_ac--; /* shrink table */
  }
  /* sorting it to the table */
  for (i=0;i<b->num_ac;i++) if (weight>b->wac[i]) break;
  if (b->num_ac<NumAlt-1) b->num_ac++; /* enlarge table */
  for (j=b->num_ac-1;j>i;j--){  /* shift lower entries */
    b->tac[j]=b->tac[j-1]; /* copy the char   */
    b->tas[j]=b->tas[j-1]; /* copy the pointer to the string */
    b->wac[j]=b->wac[j-1]; /* copy the weight */
  }
  if (i<b->num_ac) {    /* insert new entry */
    b->tac[i]=ac;       /* insert the char ... */
    b->tas[j]=NULL;     /* ... no string (?) */
    b->wac[i]=weight;   /* ... and its weight  */
  }
  if (i==0) b->c=ac; /* store best result to b->c (will be obsolete) */

  return 0;
}

/* test if ac in wac-table
   usefull for contextcorrection and box-splitting
   return 0 if not found
   return wac if found (wac>0)
 */
int testac(struct box *b, wchar_t ac){
  int i;
  if (b->num_ac > NumAlt || b->num_ac<0) {
    fprintf(stderr,"\n#DEBUG: There is something wrong with testac()!");
    b->num_ac=0;
  }
  /* search entries in table */
  for (i=0;i<b->num_ac;i++) if (ac==b->tac[i]) return b->wac[i];
  return 0;
}


/* look for edges: follow a line from x0,y0 to x1,y1, record the
 * location of each transition, and return their number.
 * ex: horizontal num_cross of 'm' would return 6
 * remark: this function is not used, obsolete? ToDo: remove?
 */
int follow_path(int x0, int x1, int y0, int y1, pix *p, int cs, path_t *path) {
  int rc = 0, prev, x, y, i, d, color; // rc=crossings  col=0=white
  int dx = x1 - x0, dy = y1 - y0;

  d = MAX(abs(dx), abs(dy));
  prev = getpixel(p, x0, y0) < cs;	// 0=white 1=black
  path->start = prev;
  for (i = 1, x = x0, y = y0; i <= d; i++) {
    if (d) {
      x = x0 + i * dx / d;
      y = y0 + i * dy / d;
    }
    color = getpixel(p, x, y) < cs; // 0=white 1=black
    if (color != prev){
      if (rc>=path->max){
	int n=path->max*2+10;
	path->x = (int *) xrealloc(path->x, n*sizeof(int));
	path->y = (int *) xrealloc(path->y, n*sizeof(int));
	path->max = n;
      }
      path->x[rc]=x;
      path->y[rc]=y;
      rc++;
    }      
    prev = color;
  }
  path->num=rc;
  return rc;
}

/* ToDo: only used in follow_path, which is obsolete, remove? */
void *xrealloc(void *ptr, size_t size){
  void *p;
  p = realloc(ptr, size);
  if (size>0 && (!p)){
    fprintf(stderr, "insufficient memory");
    exit(1);
  }
  return p;
}

/*
 *  -------------------------------------------------------------
 *  mark edge-points
 *   - first move forward until b/w-edge
 *   - more than 2 pixel?
 *   - loop around
 *     - if forward    pixel : go up, rotate right
 *     - if forward no pixel : rotate left
 *   - stop if found first 2 pixel in same order
 *  go_along_the_right_wall strategy is very similar and used otherwhere
 *  --------------------------------------------------------------
 *  turmite game: inp: start-x,y, regel r_black=UP,r_white=RIght until border
 * 	       out: last-position
 * 
 *  could be used to extract more features:
 *   by counting stepps, dead-end streets ,xmax,ymax,ro-,ru-,lo-,lu-edges
 * 
 *   use this little animal to find features, I first was happy about it
 *    but now I prefer the loop() function 
 */

void turmite(pix *p, int *x, int *y,
	     int x0, int x1, int y0, int y1, int cs, int rw, int rb) {
  int r;
  if (outbounds(p, x0, y0))	// out of pixmap
    return;
  while (*x >= x0 && *y >= y0 && *x <= x1 && *y <= y1) {
    r = ((getpixel(p, *x, *y) < cs) ? rb : rw);	// select rule 
    switch (r) {
      case UP: (*y)--; break;
      case DO: (*y)++; break;
      case RI: (*x)++; break;
      case LE: (*x)--; break;
      case ST:       break;
      default:       assert(0);
    }
    if( r==ST ) break;	/* leave the while-loop */
  }
}

/* search a way from p0 to p1 without crossing pixels of type t
 *  only two directions, useful to test if there is a gap 's'
 * labyrinth algorithm - do you know a faster way? */
int joined(pix *p, int x0, int y0, int x1, int y1, int cs){
  int t,r,x,y,dx,dy,xa,ya,xb,yb;
  x=x0;y=y0;dx=1;dy=0;
  if(x1>x0){xa=x0;xb=x1;} else {xb=x0;xa=x1;}
  if(y1>y0){ya=y0;yb=y1;} else {yb=y0;ya=y1;}
  t=((getpixel(p,x,y)<cs)?1:0);
  for(;;){
    if( t==((getpixel(p,x+dy,y-dx)<cs)?1:0)	// right free?
     && x+dy>=xa && x+dy<=xb && y-dx>=ya && y-dx<=yb) // wall
         { r=dy;dy=-dx;dx=r;x+=dx;y+=dy; } // rotate right and step forward
    else { r=dx;dx=-dy;dy=r; } // rotate left
    // fprintf(stderr," path xy %d-%d %d-%d %d %d  %d %d\n",xa,xb,ya,yb,x,y,dx,dy);
    if( x==x1 && y==y1 ) return 1;
    if( x==x0 && y==y0 && dx==1) return 0;
  }
  // return 0; // endless loop ?
}

/* move from x,y to direction r until pixel of color col is found
 *   or maximum of l steps
 * return the number of steps done */
int loop(pix *p,int x,int y,int l,int cs,int col, DIRECTION r){ 
  int i=0;
  if(x>=0 && y>=0 && x<p->x && y<p->y){
    switch (r) {
    case UP:
      for( ;i<l && y>=0;i++,y--)
	if( (getpixel(p,x,y)<cs)^col )
	  break;
      break;
    case DO:
      for( ;i<l && y<p->y;i++,y++)
	if( (getpixel(p,x,y)<cs)^col )
	  break;
      break;
    case LE:
      for( ;i<l && x>=0;i++,x--)
	if( (getpixel(p,x,y)<cs)^col )
	  break;
      break;
    case RI:
      for( ;i<l && x<p->x;i++,x++)
	if( (getpixel(p,x,y)<cs)^col )
	  break;
      break;
    default:;
    }
  }
  return i;
}

/* Given a point, frames a rectangle containing all points of the same
 * color surrounding it, and mark these points.
 *  ToDo:  obsolate and replaced by frame_vector
 *
 * looking for better algo: go horizontally and look for upper/lower non_marked_pixel/nopixel
 * use lowest three bits for mark
 *   - recursive version removed! AmigaOS has no Stack-OVL-Event
 * run around the chape using laby-robot
 * bad changes can lead to endless loop!
 *  - this is not absolutely sure but mostly works well
 *  diag - 0: only pi/2 direction, 1: pi/4 directions (diagonal)
 *  mark - 3 bit marker, mark each valid pixel with it
 */
int frame_nn(pix *p, int  x,  int  y,
             int *x0, int *x1, int *y0, int *y1,	// enlarge frame
             int cs, int mark,int diag){
#if 1 /* flood-fill to detect black objects, simple and faster? */
  int rc = 0, dx, col, maxstack=0; static int overflow=0;
  int bmax=1024, blen=0, *buf;  /* buffer as replacement for recursion stack */

  /* check bounds */
  if (outbounds(p, x, y))  return 0;
  /* check if already marked (with mark since v0.4) */
  if ((marked(p,x,y)&mark)==mark) return 0;

  col = ((getpixel(p, x, y) < cs) ? 0 : 1);
  buf=(int *)malloc(bmax*sizeof(int)*2);
  if (!buf) { fprintf(stderr,"malloc failed (frame_nn)\n");return 0;}
  buf[0]=x;
  buf[1]=y;
  blen=1;

  g_debug(fprintf(stderr,"\nframe_nn   x=%4d y=%4d",x,y);)
  for ( ; blen ; ) {
    /* max stack depth is complexity of the object */
    if (blen>maxstack) maxstack=blen;
    blen--;             /* reduce the stack */
    x=buf[blen*2+0];
    y=buf[blen*2+1];
    if (y < *y0) *y0 = y;
    if (y > *y1) *y1 = y;
    /* first go to leftmost pixel */
    for ( ; x>0 && (col == ((getpixel(p, x-1, y) < cs) ? 0 : 1)) ; x--);
    if ((marked(p,x,y)&mark)==mark) continue; /* already scanned */
    for (dx=-1;dx<2;dx+=2) /* look at upper and lower line, left */
    if (    diag && x<p->x && x-1>0 && y+dx >=0 && y+dx < p->y
         &&  col != ((getpixel(p, x  , y+dx) < cs) ? 0 : 1)
         &&  col == ((getpixel(p, x-1, y+dx) < cs) ? 0 : 1)
         && !((marked(p,x-1,y+dx)&mark)==mark)
       ) {
       if (blen+1>=bmax) { overflow|=1; continue; }
       buf[blen*2+0]=x-1;
       buf[blen*2+1]=y+dx;
       blen++;
    }
    if (x < *x0) *x0 = x;
    /* second go right, mark and get new starting points */ 
    for ( ; x<p->x && (col == ((getpixel(p, x  , y) < cs) ? 0 : 1)) ; x++) {
      p->p[x + y * p->x] |= (mark & 7);    rc++;  /* mark pixel */
      /* enlarge frame */
      if (x > *x1) *x1 = x;
      for (dx=-1;dx<2;dx+=2) /* look at upper and lower line */
      if (     col == ((getpixel(p, x  , y+dx) < cs) ? 0 : 1)
        && (
               col != ((getpixel(p, x-1, y   ) < cs) ? 0 : 1)
            || col != ((getpixel(p, x-1, y+dx) < cs) ? 0 : 1) )
        && !((marked(p,x,y+dx)&mark)==mark) && y+dx<p->y && y+dx>=0
         ) {
         if (blen+1>=bmax) { overflow|=1; continue; }
         buf[blen*2+0]=x;
         buf[blen*2+1]=y+dx;
         blen++;
      }
    }
    for (dx=-1;dx<2;dx+=2) /* look at upper and lower line, right */
    if (    diag  && x<p->x && x-1>0 && y+dx >=0 && y+dx < p->y
         &&  col == ((getpixel(p, x-1, y   ) < cs) ? 0 : 1)
         &&  col != ((getpixel(p, x  , y   ) < cs) ? 0 : 1)
         &&  col != ((getpixel(p, x-1, y+dx) < cs) ? 0 : 1)
         &&  col == ((getpixel(p, x  , y+dx) < cs) ? 0 : 1)
         && !((marked(p,x,y+dx)&mark)==mark) 
       ) {
       if (blen+1>=bmax) { overflow|=1; continue; }
       buf[blen*2+0]=x;
       buf[blen*2+1]=y+dx;
       blen++;
    }
  }
  
  /* debug, ToDo: use info maxstack and pixels for image classification */
  g_debug(fprintf(stderr," maxstack= %4d pixels= %6d",maxstack,rc);)
  if (overflow==1){
    overflow|=2;
    fprintf(stderr,"# Warning: frame_nn stack oerflow\n");
  }
  free(buf);
#else /* old version, ToDo: improve it for tmp04/005*.pgm.gz */
  int i, j, d, dx, ox, oy, od, nx, ny, rc = 0, rot = 0, x2 = x, y2 = y, ln;

  static const int d0[8][2] = { { 0, -1} /* up    */, {-1, -1}, 
				{-1,  0} /* left  */, {-1,  1}, 
				{ 0,  1} /* down  */, { 1,  1}, 
				{ 1,  0} /* right */, { 1, -1}};

  /* check bounds */
  if (outbounds(p, x, y))
    return 0;
  /* check if already marked */
  if ((marked(p,x,y)&mark)==mark) 
    return 0;

  i = ((getpixel(p, x, y) < cs) ? 0 : 1);
  rc = 0;

  g_debug(fprintf(stderr," start frame:");)

  for (ln = 0; ln < 2 && rot >= 0; ln++) {  // repeat if right-loop 
    g_debug(fprintf(stderr," ln=%d diag=%d cs=%d x=%d y=%d - go to border\n",ln,diag,cs,x,y);)
    
    od=d=(8+4*ln-diag)&7; // start robot looks up, right is a wall
    // go to right (left) border
    if (ln==1) { 
      x=x2;	y=y2; 
    } 
    /* start on leftmost position */
    for (dx = 1 - 2*ln; x + dx < p->x && x + dx >= 0 /* bounds */ &&
      	      	       i == ((getpixel(p, x + dx, y) < cs) ? 0 : 1) /* color */; 
	      	       x += dx);

    g_debug(fprintf(stderr," ln=%d diag=%d cs=%d x=%d y=%d\n",ln,diag,cs,x,y);)

    /* robot stores start-position */
    ox = x;	oy = y;
    for (rot = 0; abs(rot) <= 64; ) {	/* for sure max. 8 spirals */
      /* leftmost position */
      if (ln == 0 && x < x2) {
	x2 = x; 	y2 = y;
      }	

      g_debug(fprintf(stderr," x=%3d y=%3d d=%d i=%d p=%3d rc=%d\n",x,y,d,i,getpixel(p,x,y),rc);)

      if ( abs(d0[d][1]) ) {	/* mark left (right) pixels */
	for (j = 0, dx = d0[d][1]; x + j >= 0 && x + j < p->x
	              	&& i == ((getpixel(p, x + j, y) < cs) ? 0 : 1); j += dx) {
	  if (!((marked(p, x + j, y)&mark)==mark))
	    rc++;
	  p->p[x + j + y * p->x] |= (mark & 7);
	}
      }
      /* look to the front of robot */
      nx = x + d0[d][0];
      ny = y + d0[d][1];
      /* if right is a wall */
      if ( outbounds(p, nx, ny) || i != ((getpixel(p,nx,ny)<cs) ? 0 : 1) ) {
	/* rotate left */
        d=(d+2-diag) & 7; rot-=2-diag;
      }
      else {	/* if no wall, go, turn back and rotate left */
        x=nx; y=ny; d=(d+4+2-diag) & 7; rot+=2-diag+4;
	/* enlarge frame */
        if (x < *x0)      *x0 = x;
	if (x > *x1)	  *x1 = x;
	if (y < *y0)	  *y0 = y;
	if (y > *y1)	  *y1 = y;
      } 
      if(x==ox && y==oy && d==od) break;	// round trip finished
    }
  }
  g_debug(fprintf(stderr," rot=%d\n",rot);)
#endif
  return rc;
}

/*   obsolete! replaced by vectors
 * mark neighbouring pixel of same color, return number
 * better with neighbours of same color (more general) ???
 * parameters: (&~7)-pixmap, start-point, critical_value, mark
 *  recursion is removed */
int mark_nn(pix * p, int x, int y, int cs, int r) {
  /* out of bounds or already marked? */
  if (outbounds(p, x, y) || (marked(p, x, y)&r)==r) 
    return 0;
  {
    int x0, x1, y0, y1;
    x0 = x1 = x;
    y0 = y1 = y;			// not used
    return frame_nn(p, x, y, &x0, &x1, &y0, &y1, cs, r, JOB->tmp.n_run & 1);
    // using same scheme
  }
}

/* ToDo: finish to replace old frame by this new one
 *
 *   @...........#@@@@@@@.  # = marked as already scanned black pixels
 *   @........@@@@@@@@@@@#      only left and right border
 *   .......#@@@@@@@@@@@@@        left side on even y
 *   ......@@@@@@@@#.@@@@#        right side on odd y
 *   .....#@@@@@......#@@@   no border is marked twice
 *   ....@@@@@#......@@@#.   works also for thinn lines
 *   ...#@@@@........#@@@. - outer loop is stored as first
 *   ..@@@@#........@@@#.. - inner loop is stored as second
 *   .#@@@@........#@@@@..    1st in an extra box (think on white chars)
 *   @@@@#.......@@@@#....    2nd merge in an extra step
 *   #@@@@@....#@@@@@.....
 *   @@@@@@@@@@@@@@#......
 *   .#@@@@@@@@@@@@.......
 *
 * run around the chape using laby-robot
 *  - used for scanning boxes, look for horizontal b/w transitions
 *    with unmarked black pixels and call this routine
 *  - stop if crossing a marked box in same direction (left=up, right=down)
 *  box  - char box, store frame_vectors and box
 *  x,y  - starting point
 *  mark - 3 bit marker, mark each valid pixel with it
 *  diag - 0: only pi/2 direction, 1: pi/4 directions (diagonal)
 *  ds   - start direction, 6=right of right border, 2=left of left border
 *  ret  - 0=ok, -1=already marked, -2=max_num_frames_exceeded
 *               -7=no border in direction ds
 */
#if 0
#undef g_debug
#define g_debug(x) x
#endif
/* grep keywords: scan_vectors frame_vector */
int frame_vector(struct box *box1, int  x,  int  y,
             int cs, int mark, int diag, int ds) {
  int i1, i2, i2o,
      new_x=1,    /* flag for storing the vector x,y */
      steps=1,    /* steps between stored vectors, speedup for big frames */
      d,          /* direction */ 
      ox, oy,     /* starting point */
      nx, ny, mx, my, /* used for simplification */
      /* ToDo: add periphery to box (german: Umfang?) */
      rc  = 1,    /* return code, circumference, sum vector lengths */
      rot = 0,    /* memory for rotation, rot=8 means one full rotation */
      vol = 0;    /* volume inside frame, negative for white inside black */
  pix *p=box1->p;

  /* translate the 8 directions to (x,y) pairs,
   * if only four directions are used, only every 2nd vector is accessed,
   * +1 turn left, -1 turn right
   */
  static const int d0[8][2] =
    { { 0, -1}, /* up    */  {-1, -1},   /* up-le */
      {-1,  0}, /* left  */  {-1,  1},   /* do-le */
      { 0,  1}, /* down  */  { 1,  1},   /* do-ri */
      { 1,  0}, /* right */  { 1, -1} }; /* up-ri */

  /* check bounds */
  if (outbounds(p, x, y))
    return 0;

  /* pixel color we are looking for, 0=black, 1=white */
  d = ds;
  i1 = ((getpixel(p, x,            y           ) < cs) ? 0 : 1);
  i2 = ((getpixel(p, x + d0[d][0], y + d0[d][1]) < cs) ? 0 : 1);

  g_debug(fprintf(stderr,"\nLEV2 frame_vector @ %3d %3d  d%d %2d %2d"
    "  %d-%d pix=%3d mark=%d cs=%d",\
    x,y,ds,d0[ds][0],d0[ds][1],i1,i2,getpixel(p,x,y),mark,cs);)
                  
  if (i1==i2){
    fprintf(stderr,"ERROR frame_vector: no border\n");
    return -7; /* no border detected */
  }

  /* initialize boxframe outside this function
     box1->x0=box1->x1=x;
     box1->y0=box1->y1=y;
  */
  
  /* initialize boxvector outside this function
     box1->num_frames=0
     num_frame_vectors[0]=0 ???
     and store start value
   */
  if (box1->num_frames > MaxNumFrames) return -2;
  /* index to next (x,y) */
  i2o=i2=( (box1->num_frames==0)?0: 
            box1->num_frame_vectors[ box1->num_frames ] );
#if 0 // obsolete v0.43
  box1->frame_vector[i2][0]=x;
  box1->frame_vector[i2][1]=y;
  i2++;
  box1->num_frame_vectors[ box1->num_frames ]=i2;
#endif
  box1->num_frames++;
   
  /* robot stores start-position */
  ox = x;  oy = y; /* look forward to white pixel */

  for (;;) {	/* stop if same marked pixel touched */

    g_debug(fprintf(stderr,"\nLEV3: x= %3d %3d d= %d rot= %2d  %3d",x,y,d,rot,i2);)
    
    /* ToDo: store max. abs(rot) ??? for better recognition */
    if (new_x) {
      g_debug(fprintf(stderr,"\nLEV2: markB xy= %3d %3d ", x, y);)
      p->p[x + y * p->x] |= (mark & 7); /* mark black pixel */
    }

    /* store a new vector or enlarge the predecessor */
    if (new_x && (rc%steps)==0) { /* dont store everything on big chars */
      if (i2>=MaxFrameVectors) {
        box1->num_frame_vectors[ box1->num_frames-1 ]=i2;
        reduce_vectors(box1,1);    /* simplify loop */ 
        i2=box1->num_frame_vectors[ box1->num_frames-1 ];
        /* enlarge steps on big chars getting speedup */
        steps=(box1->y1-box1->y0+box1->x1-box1->x0)/32+1;
      }
      /* store frame-vector */
      if (i2<MaxFrameVectors) {
        box1->frame_vector[i2][0]=x;
        box1->frame_vector[i2][1]=y;
        /* test if older vector points to the same direction */
        if (i2>1) {
          /* get predecessor */
          nx=box1->frame_vector[i2-1][0]-box1->frame_vector[i2-2][0];
          ny=box1->frame_vector[i2-1][1]-box1->frame_vector[i2-2][1];
          mx=x                          -box1->frame_vector[i2-1][0];
          my=y                          -box1->frame_vector[i2-1][1];
          /* same direction? */
          if (nx*my-ny*mx==0 && nx*mx>=0 && ny*my>=0) {
            /* simplify by removing predecessor */
            i2--;
            box1->frame_vector[i2][0]=x;
            box1->frame_vector[i2][1]=y;
          } /* do not simplify */
        }
        i2++;
        box1->num_frame_vectors[ box1->num_frames-1 ]=i2;
      }
      g_debug(fprintf(stderr," stored @ %3d steps= %d", i2-1, steps);)
    } 
    new_x=0; /* work for new pixel (x,y) done */

    /* check if round trip is finished */
    if (x==ox && y==oy && abs(rot)>=8) break;

    /* look to the front of robot (turtle or ant) */
    nx = x + d0[d][0];
    ny = y + d0[d][1];
    
    /* next step, if right is a wall turn the turtle left */
    if ( outbounds(p, nx, ny) || i1 != ((getpixel(p,nx,ny)<cs) ? 0 : 1) ) {
      if (y==ny && nx>=0 && nx<p->x) { /* if inbound */
        g_debug(fprintf(stderr,"\nLEV2: markW xy= %3d %3d ", nx, ny);)
        p->p[nx + ny * p->x] |= (mark & 7); /* mark white pixel */
      }
      /* rotate left 90 or 45 degrees */
      d=(d+2-diag) & 7; rot+=2-diag;
      /* calculate volume inside frame */
      switch (d+diag) {
        case 2+2: vol-=x-1; break;
        case 6+2: vol+=x;   break;
      }
    }
    else { /* if no wall, go forward and turn right (90 or 45 degrees) */
      x=nx; y=ny;
      /* turn back and rotate left */
      d=(d+4+2-diag) & 7; rot+=2-diag-4;
      rc++; /* counting steps, used for speedup */

      /* enlarge frame */
      if (x < box1->x0) box1->x0 = x;
      if (x > box1->x1) box1->x1 = x;
      if (y < box1->y0) box1->y0 = y;
      if (y > box1->y1) box1->y1 = y;
      
      new_x=1;
    }
  }

  /* to distinguish inner and outer frames, store volume as +v or -v */
  box1->frame_vol[ box1->num_frames-1 ] = vol;
  box1->frame_per[ box1->num_frames-1 ] = rc-1;

  /* dont count and store the first vector twice */
  if (i2-i2o>1) { 
    i2--; rc--; box1->num_frame_vectors[ box1->num_frames-1 ]=i2;
  }
  /* output break conditions */
  g_debug(fprintf(stderr,"\nLEV2 o= %3d %3d  x= %3d %3d  r=%d v=%d",ox,oy,x,y,rot,vol);)
  /* rc=1 for a single point, rc=2 for a two pixel sized point */
  g_debug(fprintf(stderr," steps= %3d vectors= %3d",rc,i2);)
  /* out_x(box1); ToDo: output only the first thousend */
  return rc; /* return number of bordering pixels = periphery? */
}



/* clear lowest 3 (marked) bits (they are used for marking) */ 
void clr_bits(pix * p, int x0, int x1, int y0, int y1) {
  int x, y;
  for ( y=y0; y <= y1; y++)
    for ( x=x0; x <= x1; x++)
      p->p[x+y*p->x] &= ~7;
}

/* look for white holes surrounded by black points
 * at the moment look for white point with black in all four directions
 *  - store position of hole in coordinates relativ to box!
 *  ToDo: count only holes with vol>10% ???
 * ToDo: rewrite for frame vectors (faster, no malloc)
 *       holes are frames rotating left hand 
 *  obsolete, do it with vectors
 */
int num_hole(int x0, int x1, int y0, int y1, pix * p, int cs, holes_t *holes) {
  int num_holes = 0, x, y, hole_size;
  pix b;			// temporary mini-page
  int dx = x1 - x0 + 1, dy = y1 - y0 + 1;
  unsigned char *buf;	//  2nd copy of picture, for working 

  if (holes) holes->num=0;
  if(dx<3 || dy<3) return 0;
  b.p = buf = (unsigned char *) malloc( dx * dy );
  if( !buf ){
    fprintf( stderr, "\nFATAL: malloc(%d) failed, skip num_hole", dx*dy );
    return 0;
  }
  if (copybox(p, x0, y0, dx, dy, &b, dx * dy))
    { free(b.p); return -1;}

  // printf(" num_hole(");
  /* --- mark white-points connected with border */
  for (x = 0; x < b.x; x++) {
    if (getpixel(&b, x, 0) >= cs)
      mark_nn(&b, x, 0, cs, AT);
    if (getpixel(&b, x, b.y - 1) >= cs)
      mark_nn(&b, x, b.y - 1, cs, AT);
  }
  for (y = 0; y < b.y; y++) {
    if (getpixel(&b, 0, y) >= cs)
      mark_nn(&b, 0, y, cs, AT);
    if (getpixel(&b, b.x - 1, y) >= cs)
      mark_nn(&b, b.x - 1, y, cs, AT);
  }

  g_debug(out_b(NULL,&b,0,0,b.x,b.y,cs);)
  // --- look for unmarked white points => hole
  for (x = 0; x < b.x; x++)
    for (y = 0; y < b.y; y++)
      if (!((marked(&b, x, y)&AT)==AT))	// unmarked
	if (getpixel(&b, x, y) >= cs) {	// hole found
#if 0
	  hole_size=mark_nn(&b, x, y, cs, AT);  /* old version */
	  if (hole_size > 1 || dx * dy <= 40)
	    num_holes++;
#else
          {    /* new version, for future store of hole characteristics */
            int x0, x1, y0, y1, i, j;
            x0 = x1 = x;
            y0 = y1 = y;			// not used
            hole_size=frame_nn(&b, x, y, &x0, &x1, &y0, &y1, cs, AT, JOB->tmp.n_run & 1);
            // store hole for future use, num is initialized with 0
 	    if (hole_size > 1 || dx * dy <= 40){
 	      num_holes++;
              if (holes) {
                // sort in table
                for (i=0;i<holes->num && i<MAX_HOLES;i++)
                  if (holes->hole[i].size < hole_size) break;
                for (j=MAX_HOLES-2;j>=i;j--)
                  holes->hole[j+1]=holes->hole[j];
                if (i<MAX_HOLES) {
                  // printf("  i=%d size=%d\n",i,hole_size);
                  holes->hole[i].size=hole_size;
                  holes->hole[i].x=x;
                  holes->hole[i].y=y;
                  holes->hole[i].x0=x0;
                  holes->hole[i].y0=y0;
                  holes->hole[i].x1=x1;
                  holes->hole[i].y1=y1;
                }
                holes->num++;
              }
            }
          }
#endif
	}
  free(b.p);
  // printf(")=%d",num_holes);
  return num_holes;
}

/* count for black nonconnected objects --- used for i,auml,ouml,etc. */
/* ToDo: obsolete, replaced by vectors and box.num_boxes */
int num_obj(int x0, int x1, int y0, int y1, pix * p, int cs) {
  int x, y, rc = 0;		// rc=num_obj
  unsigned char *buf; // 2nd copy of picture, for working
  pix b;

  if(x1<x0 || y1<y0) return 0;
  b.p = buf = (unsigned char *) malloc( (x1-x0+1) * (y1-y0+1) );
  if( !buf ){
    fprintf( stderr, "\nFATAL: malloc(%d) failed, skip num_obj",(x1-x0+1)*(y1-y0+1) );
    return 0;
  }
  if (copybox(p, x0, y0, x1 - x0 + 1, y1 - y0 + 1, &b, (x1-x0+1) * (y1-y0+1)))
    { free(b.p); return -1; }
  // --- mark black-points connected with neighbours
  for (x = 0; x < b.x; x++)
    for (y = 0; y < b.y; y++)
      if (getpixel(&b, x, y) < cs)
	if (!((marked(&b, x, y)&AT)==AT)) {
	  rc++;
	  mark_nn(&b, x, y, cs, AT);
	}
  free(b.p);
  return rc;
}

#if 0
// ----------------------------------------------------------------------
// first idea for making recognition based on probability
//  - start with a list of all possible chars
//  - call recognition_of_char(box *) 
//    - remove chars from list which could clearly excluded
//    - reduce probability of chars which have wrong features
//  - font types list could also build
// at the moment it is only an idea, I should put it to the todo list
//  
char *list="0123456789,.\0xe4\0xf6\0xfc"	// "a=228 o=246 u=252
           "abcdefghijklmnopqrstuvwxyz"
           "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
int  wert[100];
int  listlen=0,numrest=0;
// initialize a new character list (for future)
void ini_list(){ int i;
    for(i=0;list[i]!=0 && i<100;i++) wert[i]=0;
    numrest=listlen=i; } 
// exclude??? (for future) oh it was long time ago, I wrote that :/
void exclude(char *filt){ int i,j;
    for(j=0;filt[j]!=0 && j<100;j++)
    for(i=0;list[i]!=0 && i<100;i++)
    if( filt[j]==list[i] ) { if(!wert[i])numrest--; wert[i]++; } }
// get the result after all the work (for future)
char getresult(){ int i;
    if( numrest==1 )
    for(i=0;list[i]!=0 && i<100;i++) if(!wert[i]) return list[i];
    return '_';
 }
#endif

//  look at the environment of the pixel too (contrast etc.)
//   detailed analysis only of diff pixels!
//
// 100% * "distance", 0 is ideal fit
// = similarity of two chars for recognition of garbled (verstuemmelter) chars
//   weight of pixels with only one same neighbour set to 0
//   look at contours too! v0.2.4: B==H
// changed for v0.41, Mar06
int distance( pix *p1, struct box *box1,
              pix *p2, struct box *box2, int cs){
   int rc=0,x,y,v1,v2,i1,i2,rgood=0,rbad=0,x1,y1,x2,y2,dx,dy,dx1,dy1,dx2,dy2;
   x1=box1->x0;y1=box1->y0;x2=box2->x0;y2=box2->y0;
   dx1=box1->x1-box1->x0+1; dx2=box2->x1-box2->x0+1; dx=((dx1>dx2)?dx1:dx2);
   dy1=box1->y1-box1->y0+1; dy2=box2->y1-box2->y0+1; dy=((dy1>dy2)?dy1:dy2);
   if(abs(dx1-dx2)>1+dx/16 || abs(dy1-dy2)>1+dy/16) return 100;
   // compare relations to baseline and upper line
   if(2*box1->y1>box1->m3+box1->m4 && 2*box2->y1<box2->m3+box2->m4) rbad+=128;
   if(2*box1->y0>box1->m1+box1->m2 && 2*box2->y0<box2->m1+box2->m2) rbad+=128;
   // compare pixels
   for( y=0;y<dy;y++ )
   for( x=0;x<dx;x++ ) {	// try global shift too ???
     v1     =((getpixel(p1,x1+x  ,y1+y  )<cs)?1:0); i1=8;	// better gray?
     v2     =((getpixel(p2,x2+x  ,y2+y  )<cs)?1:0); i2=8;	// better gray?
     if(v1==v2) { rgood+=8; continue; } // all things are right!
     // what about different pixel???
     // test overlap of 8 surounding pixels ??? bad if two nb. are bad
     v1=-1;
     for(i1=-1;i1<2;i1++)
     for(i2=-1;i2<2;i2++)if(i1!=0 || i2!=0){
       if( ((getpixel(p1,x1+x+i1*(1+dx/32),y1+y+i2*(1+dy/32))<cs)?1:0)
         !=((getpixel(p2,x2+x+i1*(1+dx/32),y2+y+i2*(1+dy/32))<cs)?1:0) ) v1++;
     }
     if (v1>0) rbad+=16*v1;
     else      rbad++;    
   }
   if(rgood+rbad) rc= (100*rbad+(rgood+rbad-1))/(rgood+rbad); else rc=99;
   if(rc<10 && JOB->cfg.verbose & 7){
     fprintf(stderr,"\n#  distance rc=%d good=%d bad=%d",rc,rgood,rbad);
//     out_x(box1);out_x(box2);
   }
   return rc;
}



// ============================= call OCR engine ================== ;)
//  nrun=0 from outside, nrun=1 from inside (allows modifications, oobsolete)
wchar_t whatletter(struct box *box1, int cs, int nrun){
   wchar_t bc=UNKNOWN;			// best letter
   wchar_t um=SPACE;			// umlaut? '" => modifier
   pix *p=box1->p;   // whole image
   int	x,y,dots,xa,ya,x0,x1,y0,y1,dx,dy,i;
   pix b;            // box
   struct box bbuf=*box1;  // restore after modifikation!

   if (box1->num_ac>0 && box1->wac[0]>=JOB->cfg.certainty && bc==UNKNOWN) {
      bc=box1->tac[0];
   }
   // if (bc!=UNKNOWN) return bc;
   // if whatletter() called again, only unknown chars are processed
   // bad for splitting!
   
   // store box data, which can be modified for modified chars in 2nd run
   bbuf.x0=box1->x0; bbuf.y0=box1->y0;
   bbuf.x1=box1->x1; bbuf.y1=box1->y1;
   
   xa=box1->x;  ya=box1->y;
   x0=box1->x0; y0=box1->y0;
   x1=box1->x1; y1=box1->y1;
   // int vol=(y1-y0+1)*(x1-x0+1);	// volume
   // crossed l-m , divided chars
   while( get_bw(x0,x1,y0,y0,p,cs,1)!=1 && y0+1<y1) y0++;
   while( get_bw(x0,x1,y1,y1,p,cs,1)!=1 && y0+1<y1) y1--;
   dx=x1-x0+1;
   dy=y1-y0+1;	// size

   // better to proof the white frame too!!! ????
   // --- test for german umlaut and points above, not robust enough???
   // if three chars are connected i-dots (ari) sometimes were not detected
   //  - therefore after division a test could be useful
   // modify y0 only in second run!?
   // we need it here to have the right copybox
   if (um==SPACE && dy>5 && box1->num_boxes>1)
     testumlaut(box1,cs,2,&um); /* set box1->modifier + new y0 */

   dots=box1->dots;
   y0  =box1->y0;	// dots==2 => y0 below double dots
   dy  =y1-y0+1;

   // move upper and lower border (for divided letters)
   while( get_bw(x0,x1,y0,y0,p,cs,1)==0  &&  y0+1<y1) y0++;
   while( get_bw(x0,x1,y1,y1,p,cs,1)==0  &&  y0+1<y1) y1--;
   while( get_bw(x0,x0,y0,y1,p,cs,1)==0  &&  x0+1<x1) x0++;
   while( get_bw(x1,x1,y0,y1,p,cs,1)==0  &&  x0+1<x1) x1--;
   dx=x1-x0+1;
   dy=y1-y0+1;	// size
   box1->x0=x0; box1->y0=y0;	// set reduced frame
   box1->x1=x1; box1->y1=y1;

   // set good startpoint (probably bad from division)?
   if( xa<x0 || xa>x1 || ya<y0 || ya>y1
     || getpixel(p,xa,ya)>=cs /* || 2*ya<y0+y1 */ || dots>0 ){
     // subfunction? also called after division of two glued chars?
     for(y=y1;y>=y0;y--) // low to high (not i-dot)
     for(x=(x0+x1)/2,i=0;x>=x0 && x<=x1;i++,x+=((2*i&2)-1)*i) /* is that ok? */
     if (getpixel(p,x,y)<cs && (getpixel(p,x+1,y)<cs
                             || getpixel(p,x,y+1)<cs)){ xa=x;ya=y;y=-1;break; }
     /* should box1->x,y be set? */
   }

   // ----- create char-only-box -------------------------------------
   // ToDo: this will be obsolete if vectors are used only
   if(dx<1 || dy<1) return bc; /* should not happen */
   b.p = (unsigned char *) malloc( dx * dy );
   if (!b.p) fprintf(stderr,"Warning: malloc failed L%d\n",__LINE__);
   if( copybox(p,x0,y0,dx,dy,&b,dx*dy) ) 
     { free(b.p); return bc; }
   // clr_bits(&b,0,b.x-1,0,b.y-1);
   // ------ use diagonal too (only 2nd run?) 
   /* following code failes on ! and ?  obsolete if vectors are used
      ToDo:
       - mark pixels neighoured to pixels outside and remove them from &b
         v0.40
         will be replaced by list of edge vectors  
       - mark accents, dots and remove them from &b
    */
#if 1 /* becomes obsolate by vector code */
   if (y0>0)  // mark upper overlap
   for ( x=x0; x<=x1; x++) {
     if (getpixel(p,x,y0-1)<cs
      && getpixel(p,x,y0  )<cs && (marked(&b,x-x0,0)&1)!=1)
     mark_nn(&b,x-x0,0,cs,1);
   }
   if (x0>0)  // mark left overlap
   for ( y=y0; y<=y1; y++) {
     if (getpixel(p,x0-1,y)<cs
      && getpixel(p,x0  ,y)<cs && (marked(&b,0,y-y0 )&1)!=1)
     mark_nn(&b,0,y-y0,cs,1);
   }
   if (x1<p->x-1)  // mark right overlap
   for ( y=y0; y<=y1; y++) {
     if (getpixel(p,x1+1,y)<cs
      && getpixel(p,x1  ,y)<cs && (marked(&b,x1-x0,y-y0)&1)!=1)
     mark_nn(&b,x1-x0,y-y0,cs,1);
   }
   mark_nn(&b,xa-x0,ya-y0,cs,2); // not glued chars
   for(x=0;x<b.x;x++)
   for(y=0;y<b.y;y++){
     if (  (marked(&b,x,y  )&3)==1 && getpixel(&b,x,y  )<cs )
     b.p[x+y*b.x] = 255&~7;  /* reset pixel */
   }
#endif
   
   // if (bc == UNKNOWN)   // cause split to fail
   bc=ocr0(box1,&b,cs);

   /* ToDo: try to change pixels near cs?? or melt? */
   if (box1->num_ac>0 && box1->wac[0]>=JOB->cfg.certainty && bc==UNKNOWN) {
     bc=box1->tac[0];
   }

   if (um!=0 && um!=SPACE && bc<127) {  /* ToDo: is that obsolete now? */
     wchar_t newbc;
     newbc = compose(bc, um );
     if (newbc == bc) { /* nothing composed */
       if(JOB->cfg.verbose & 7) 
         fprintf(stderr, "\nDBG whatletter: compose(%s) was useless (%d,%d)",
           decode(bc,ASCII), box1->x0, box1->y0);
       // if(JOB->cfg.verbose & 6) out_x(box1);
     }
     bc = newbc;
   }
   // restore modified boxes
   box1->x0=bbuf.x0; box1->y0=bbuf.y0;
   box1->x1=bbuf.x1; box1->y1=bbuf.y1;
//   if (box1->c==UNKNOWN) out_b(box1,&b,0,0,dx,dy,cs); // test

   free(b.p);
   return bc;
}

/*
** creates a list of boxes/frames around objects detected 
** on the pixmap p for further work
** returns number of boxes created.
** - by the way: get average X, Y (avX=sumX/numC,..)
*/
int scan_boxes( pix *p ){
  int x, y, nx, cs, rc, ds;
  struct box *box3;

  if (JOB->cfg.verbose)
    fprintf(stderr,"# scanning boxes");

  cs = JOB->cfg.cs;
  JOB->res.sumX = JOB->res.sumY = JOB->res.numC = 0;

  /* clear the lowest bits of each pixel, later used as "scanned"-marker */
  clr_bits( p, 0, p->x - 1, 0, p->y - 1);

  for (y=0; y < p->y; y++)
    for (x=0; x < p->x; x++)
    for (ds=2; ds<7; ds+=4) { // NO - dust of size 1 is not removed !!!
      nx=x+((ds==2)?-1:+1);
      if (nx<0 || nx>=p->x) continue; /* out of image, ex: recframe */
      if ( getpixel(p, x,y)>=cs || getpixel(p,nx,y)< cs)  // b/w transition?
	continue;
      if ((marked(p, x,y) & 1)&&(marked(p, nx, y) & 1))
	continue;
      /* check (and mark) only horizontal b/w transitions */
      // --- insert new box in list
      box3 = (struct box *)malloc_box(NULL);
      box3->x0=box3->x1=box3->x=x;
      box3->y0=box3->y1=box3->y=y;
      box3->num_frames=0;
      box3->dots=0;
      box3->num_boxes=1;
      box3->num_subboxes=0;
      box3->modifier='\0';
      box3->num=JOB->res.numC;
      box3->line=0;	// not used here
      box3->m1=0; box3->m2=0; box3->m3=0; box3->m4=0;
      box3->p=p;
      box3->num_ac=0;   // for future use

/*  frame, vectorize and mark only odd/even horizontal b/w transitions
 *  args: box, x,y, cs, mark, diag={0,1}, ds={2,6}
 *  ds   - start direction, 6=right of right border, 2=left of left border
 *  ret  - 0=ok, -1=already marked, -2=max_num_frames_exceeded
 *               -7=no border in direction ds 
 *  ToDo: count errors and print out for debugging
 */
      rc=frame_vector(box3, x, y, cs, 1, 1, ds);
      g_debug(fprintf(stderr,"\n# ... scan xy= %3d %3d rc= %2d", x, y, rc);)
      if (rc<0) { free_box(box3); continue; }
      if (box3->num_frames && !box3->num_frame_vectors[0])
        fprintf(stderr,"\nERROR scan_boxes: no vector in frame (%d,%d)",x,y);

      JOB->res.numC++;
      JOB->res.sumX += box3->x1 - box3->x0 + 1;
      JOB->res.sumY += box3->y1 - box3->y0 + 1;

      box3->c=(((box3->y1-box3->y0+1)
               *(box3->x1-box3->x0+1)>=MaxBox)? PICTURE : UNKNOWN);
      list_app(&(JOB->res.boxlist), box3); 	// append to list
      // ToDo: debug
      // if (JOB->cfg.verbose && box3->y0==29) out_x(box3);
  }
  if(JOB->res.numC){
    if (JOB->cfg.verbose)
      fprintf(stderr," nC= %3d avD= %2d %2d\n",JOB->res.numC,
               (JOB->res.sumX+JOB->res.numC/2)/JOB->res.numC,
               (JOB->res.sumY+JOB->res.numC/2)/JOB->res.numC);
  }
  return JOB->res.numC;
}

/* compare ints for sorting.  Return -1, 0, or 1 according to
   whether *vr < *vs, vr == *vs, or *vr > *vs */
int 
intcompare (const void *vr, const void *vs)
{
  int *r=(int *)vr;
  int *s=(int *)vs;

  if (*r < *s) return -1;
  if (*r > *s) return 1;
  return 0;
}

/*
 * measure_pitch - detect monospaced font and measure the pitch
 * measure overall pitch for difficult lines,
 *  after that measure pitch per line 
 * dists arrays are limited to 1024 elements to reduce
 *  cpu usage for qsort on images with extreme high number of objects
 * insert space if dist>=pitch in list_insert_spaces()
 *  ToDo: ???
 *   - min/max distance-matrix  a-a,a-b,a-c,a-d ... etc;  td,rd > ie,el,es
 *   - OR measuring distance as min. pixel distance instead of box distance
 *        especially useful for italic font!
 */
void measure_pitch( job_t *job ){
  int numdists=0, spc=0,              /* number of stored distances */
      pitch_p=2, pdist, pdists[1024], /* proportional distances */
      pitch_m=6, mdist, mdists[1024], /* monospaced   distances */
      monospaced=0, l1;
  struct box *box2, *prev=NULL;

  if(job->cfg.verbose){ fprintf(stderr,"# check for word pitch"); }
  for (l1=0; l1<job->res.lines.num; l1++)
  { /* 0 means all lines */
    if(job->cfg.verbose){ fprintf(stderr,"\n#  line %2d",l1); }
    numdists = 0;  /* clear distance lists */
    for_each_data(&(job->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(job->res.boxlist));
      if (l1>0 && box2->line!=l1) continue; /* ignore other lines */
      /* ignore dots and pictures (min. font is 4x6) */
      if (box2->y1 - box2->y0 + 1 < 4 || box2->c==PICTURE) { prev=NULL; }
      if (!prev) { prev=box2; continue; } /* we need a predecessor */
      /* use center distance for monospaced fonts */
      mdist = ((box2->x0 + box2->x1) - (prev->x0 + prev->x1) + 1)/2;
      /* use gap for proportional fonts */
      pdist = box2->x0 - prev->x1 + 1;
      /* ToDo: better take 3 instead of 2 neighbours?, smallest font 4x6 */
      /* fonts are expected to be 6 to 60 pixels high, which is about
         4 to 50 pixels wide.  We allow some extra margin. */
      if (3 < mdist && mdist < 150) { /* better mdist < 3*Xaverage ? */
        /* two options for overflow: 1) ignore, 2) store randomly */
        if (numdists<1024) {   /* we do ignore here */
          mdists[numdists] = mdist;
          pdists[numdists] = pdist;
          numdists++;
        }
      }
      prev = box2;
    } end_for_each(&(job->res.boxlist));
    
    if(job->cfg.verbose){ fprintf(stderr," num_gaps= %2d",numdists); }
    if( numdists<8 ){
      if (job->cfg.verbose && l1==0) /* only for all lines */
        fprintf(stderr," (WARNING num_gaps<8)");
    }
    if (numdists>0) {
      int i,diff,ni_min,max,best_m,best_p,ni; double v;
      /* aware: takes long time for big data sets */
      /* dilute? (german: ausduennen?) */
      qsort (mdists, numdists, sizeof (int), intcompare);
      qsort (pdists, numdists, sizeof (int), intcompare);
      /* the new method, div0? */
      v = (mdists[numdists*7/10]-mdists[numdists/5])
                        /(double)mdists[numdists/5];
      /* measurements showed v=.09 for Courier and .44 for Times-Roman */
      if (l1==0) monospaced = (v < .22);
      best_m=  numdists/5;
      best_p=4*numdists/5;
      /* try to find better pitch for monospaced font (ok for prop) */
      for (i=numdists/5+1;i<numdists;i++) {
        if (2*mdists[i]>=3*mdists[best_m]) { best_m=i-1; break; }
      }
      /* try to find better pitch for proportional font */
      // the largest diff could be the best, if diff is always 1,
      //  take the diff with the lowest weight
      for (ni=ni_min=1024,max=0,i=numdists/2+1;i<numdists-numdists/16;i++) {
        diff=pdists[i]-pdists[i-1];
        if (diff>max) {
          max=diff; best_p=i-1;
          if ((job->cfg.verbose&(32+16))==48)
            fprintf(stderr," best_p=%d maxdiff=%d\n# ...", pdists[best_p], max);
          if (max>3 && 3*pdists[i]>=4*pdists[i-1]) { break; }
        }
        if (diff) {
          if (ni<ni_min) {
            // do not try to divide one word per line
            ni_min=ni; if (max<=1 && numdists>16) best_p=i-1;
            if ((job->cfg.verbose&(32+16))==48)
              fprintf(stderr," best_p=%d ni_min=%d\n# ...", pdists[best_p], ni_min);
          }
          ni=1;
        } else ni++;
      }
      if (numdists<16 && max<=1 && ni_min>1) best_p=numdists-1; // one word 
#if 1 /* debugging */
      if ((job->cfg.verbose&(32+16))==48) {
        fprintf(stderr,"\n# ...");   
        for (i=0;i<numdists;i++) fprintf(stderr," %2d",mdists[i]);
        fprintf(stderr," <- mdist[%d]\n# ...",l1);
        for (i=0;i<numdists;i++) fprintf(stderr," %2d",pdists[i]);
        fprintf(stderr," <- pdist[%d]\n# ...",l1);
        fprintf(stderr," maxdiff=%d min_samediffs=%d\n# ...",max,ni_min);
      }
#endif
      /* we measure spaces in two different ways (mono, prop) */
      /* prop: gap between boxes,   mono: distance of middle */
      if (best_p<numdists-1) pitch_p = ((pdists[best_p]+pdists[best_p+1])/2+1);
      else                   pitch_p = (pdists[best_p]+1  );
      pitch_m = (mdists[best_m]*4/3);
      if (numdists)
        if (   pdists[numdists-1]*2 <= pdists[0]*3
            || pdists[numdists-1]   <= pdists[0]+3) {
        /* line is just a single word */
          pitch_p = pdists[numdists-1]+10;
        }
      if (l1>0 && job->cfg.spc==0) {
        job->res.lines.pitch[l1]=(monospaced?pitch_m:pitch_p);
        job->res.lines.mono[l1]=monospaced;
      }
      if (job->cfg.verbose) {
        fprintf(stderr,"\n# ..."
                       " mono: v=%f (v<0.22) line=%d numdists=%d\n# ...",
                 v, l1, numdists);
        fprintf(stderr," mono: min=%3d max=%3d pitch=%3d @ %2d%%\n# ...",
        mdists[0],mdists[numdists-1],pitch_m,best_m*100/numdists);
        fprintf(stderr," prop: min=%3d max=%3d pitch=%3d @ %2d%%\n# ...",
        pdists[0],pdists[numdists-1],pitch_p,best_p*100/numdists);
        fprintf(stderr," result: distance >= %d considered space\n# ...",
          job->res.lines.pitch[l1]);
      }
    } /* if (not) enough spaces */
    if (l1==0) {  /* set default spaces to each line */
      int l2;
      spc = job->cfg.spc;
      if (spc==0) /* set only if not set by option */
        spc = ((monospaced)?pitch_m:pitch_p);
      for  (l2=0; l2<job->res.lines.num; l2++ )
        job->res.lines.pitch[l2]=spc;
    }
  }  /* each line */
  if (job->cfg.spc==0)
    job->cfg.spc = spc;
  if (job->cfg.verbose)
    fprintf(stderr," overall space width is %d %s\n",
        spc, ((monospaced)?"monospaced":"proportional"));


}

/* ---- count subboxes (white holes within black area) --------
 *  new: count boxes lying inside another box (usually holes, ex: "aeobdg")
 *  needed for glue_boxes, dont glue textboxes, tables and other complex
 *    objects
 * ToDo: count only frames of invers spin? do we need sorted list here? -> no
 */
int count_subboxes( pix *pp ){
  int ii=0, num_mini=0, num_same=0, cnt=0;
  struct box *box2,*box4;
  progress_counter_t *pc = NULL;
  if (JOB->cfg.verbose) { fprintf(stderr,"# count subboxes\n# ..."); }
  
  pc = open_progress(JOB->res.boxlist.n,"count_subboxes");
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    box2->num_subboxes=0;
    progress(cnt++,pc);
    if (   (box2->x1 - box2->x0)<2
        || (box2->y1 - box2->y0)<2) continue; /* speedup for dotted bg */
    // holes inside box2 char, aoebdqg, 0.41
    for_each_data(&(JOB->res.boxlist)) {
      box4=(struct box *)list_get_current(&(JOB->res.boxlist));
      if (box4->y0 > box2->y1) break; // faster, but boxes need to be sorted
      // ToDo: better use binary tree (above/below x) to find near boxes?
      if (box4==box2) continue;
      if( box4->x0==box2->x0 && box4->x1==box2->x1
       && box4->y0==box2->y0 && box4->y1==box2->y1)
         num_same++; /* erroneous!? */
      if ( box4->x0 >= box2->x0  &&  box4->x1 <= box2->x1
        && box4->y0 >= box2->y0  &&  box4->y1 <= box2->y1
        && box4->num_subboxes==0 ) /* box4 inside box2? */
      {
        box2->num_subboxes++; ii++;
        if ((box4->x1 - box4->x0 + 1)
           *(box4->y1 - box4->y0 + 1)<17) num_mini++;
      }
    } end_for_each(&(JOB->res.boxlist));
#if 0
    if (cnt < 1000 && JOB->cfg.verbose)
      fprintf(stderr," %4d box %4d %4d %+3d %+3d  subboxes %4d\n# ...",
        cnt, box2->x0, box2->y0, box2->x1-box2->x0,
                                 box2->y1-box2->y0, box2->num_subboxes);
#endif
  }   end_for_each(&(JOB->res.boxlist));
  close_progress(pc);
  if (JOB->cfg.verbose)
    fprintf(stderr," %3d subboxes counted (mini=%d, same=%d) nC= %d\n",
      ii, num_mini, num_same/2 /* counted twice */, cnt);
  return 0;
}

/* ---- glue holes tochars( before step1 ) v0.42  -----------------------
   glue boxes lying inside another box (usually holes, ex: "aeobdg46890")
   Dont add dust to a char!
   lines are not detected yet
*/
int glue_holes_inside_chars( pix *pp ){
  int ii, cs, x0, y0, x1, y1, cnt=0,
      glued_same=0, glued_holes=0;
  struct box *box2, *box4;
  progress_counter_t *pc = NULL;
  cs=JOB->cfg.cs;
  {
    count_subboxes( pp ); /* move to pgm2asc() later */
    
    pc = open_progress(JOB->res.boxlist.n,"glue_holes_inside_chars");
    if (JOB->cfg.verbose)
        fprintf(stderr,"# glue holes to chars nC= %d\n# ...",JOB->res.numC);
    ii=0;
    for_each_data(&(JOB->res.boxlist)) {
      // get the smaller box which may be extended by bigger boxes around it
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      x0 = box2->x0;  x1 = box2->x1;
      y0 = box2->y0;  y1 = box2->y1;
      
      progress(cnt++,pc);

      // would it better than moving vectors to build a sub-box-tree?

      // do not remove chars inside pictures (car plates on photos)
      if( box2->c == PICTURE || box2->num_subboxes > 7) continue;

      // holes inside char, aoebdqg, 0.41
      // dont merge boxes which have subboxes by itself!
      // search boxes inside box2 
      // if (x1-x0+1>2 || y1-y0+1>2) /* skip tiny boxes, bad for 4x6 */
      for_each_data(&(JOB->res.boxlist)) {
	box4=(struct box *)list_get_current(&(JOB->res.boxlist));
        if(box4!=box2 && box4->c != PICTURE )
	{
	  // ToDo: dont glue, if size differs by big factors (>16?)
          if (   (    box4->x0==x0 && box4->x1==x1
                   && box4->y0==y0 && box4->y1==y1 ) /* do not happen !? */
              || (    box4->x0>=x0 && box4->x1<=x1
                   && box4->y0>=y0 && box4->y1<=y1
                   && box4->num_subboxes==0 ) )  /* no or very small subboxes? */
          {  // fkt melt(box2,box4)
            // same box, if very small but hollow char (4x5 o)
            if( box4->x0==x0 && box4->x1==x1
             && box4->y0==y0 && box4->y1==y1) glued_same++; else glued_holes++;
            // fprintf(stderr,"\n# DEBUG merge:");
            // out_x(box2);  // small
            // out_x(box4);  // big
            if ((JOB->cfg.verbose & 7)==7) // LEV3
              fprintf(stderr," glue hole (%4d %4d %+3d %+3d %+4d)"
                                       " (%4d %4d %+3d %+3d %+4d) %d\n# ...",
                x0, y0, x1-x0+1, y1-y0+1, box2->frame_vol[0],
                box4->x0, box4->y0,
                box4->x1-box4->x0+1, box4->y1-box4->y0+1, 
                box4->frame_vol[0], glued_same);
            if ((box4->x1-box4->x0+1)< 8*(x1-x0+1)
             || (box4->y1-box4->y0+1)<12*(y1-y0+1)) // skip dust
            merge_boxes( box2, box4 ); // add box4 to box2
            // out_x(box2);
            x0 = box2->x0; x1 = box2->x1;
            y0 = box2->y0; y1 = box2->y1;
            JOB->res.numC--;  // dont count fragments as chars
            ii++;	// count removed
	    list_del(&(JOB->res.boxlist), box4); // remove box4
	    free_box(box4);
	    // now search another hole inside box2
          }
        }
      } end_for_each(&(JOB->res.boxlist));

    } end_for_each(&(JOB->res.boxlist)); 

    if (JOB->cfg.verbose)
      fprintf(stderr," glued: %3d holes, %3d same, nC= %d\n",
        glued_holes, glued_same, JOB->res.numC);
    close_progress(pc);
  }
  return 0;
}


/* ---- glue broken chars ( before step1 ??? )  -----------------------
    use this carefully, do not destroy previous detection ~fi, broken K=k' g 
    glue if boxes are near or diagonally connected 
    other strategy: mark boxes for deleting and delete in extra loop at end
    faster: check only next two following boxes because list is sorted!
    ToDo: store m4 of upper line to m4_of_prev_line, and check that "-points are below
    done: glue boxes lying inside another box (usually holes, ex: "aeobdg")
    Dont add dust to a char!
    lines should be detected already (Test it for m1-m4 unknown)
    ToDo: divide in glue_idots, glue_thin_chars etc. and optimize it
*/
int glue_broken_chars( pix *pp ){
  int ii, y, cs, x0, y0, x1, y1, cnt=0,
      num_frags=0, glued_frags=0, glued_hor=0;
  struct box *box2, *box4;
  progress_counter_t *pc = NULL;
  cs=JOB->cfg.cs;
  {
    count_subboxes( pp ); /* move to pgm2asc() later */
    
    pc = open_progress(JOB->res.boxlist.n,"glue_broken_chars");
    if (JOB->cfg.verbose)
        fprintf(stderr,"# glue broken chars nC= %d\n# ...",JOB->res.numC);
    ii=0;
    for_each_data(&(JOB->res.boxlist)) {
      // get the box which may be extended by boxes around it
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      x0 = box2->x0;  x1 = box2->x1;
      y0 = box2->y0;  y1 = box2->y1;
      
      progress(cnt++,pc);

      // vertical broken (g965T umlauts etc.)
      // not: f,

      // would it better than moving vectors to build a sub-box-tree?

      // do not remove chars inside pictures (car plates on photos)
      if( box2->c == PICTURE || box2->num_subboxes > 7) continue;

      /* continue loop if box is below or above line */
      if( box2->m4>0 && y0>box2->m4   ) continue; /* dust outside ? */
      if( box2->m1>0 && y0<box2->m1-(box2->m3-box2->m2) ) continue;
      /* ToDo:
       *  - check that y0 is greater as m3 of the char/line above 
       */

      // check small boxes (box2) whether they belong
      //       to near same size or bigger boxes (box4)
      if( 2*(y1-y0) < box2->m4 - box2->m1     // care for dots etc.
       && (   2*y1<=(box2->m3+box2->m2)       // upper fragments
           || 2*y0>=(box2->m3+box2->m2)) ) {  // lower fragments
        struct box *box5=NULL, *box6=NULL;    // nearest and next nearest box
        box4=NULL;
        num_frags++;   /* count for debugging */
        // get the [2nd] next x-nearest box in the same line
        for_each_data(&(JOB->res.boxlist)) {
  	  box4=(struct box *)list_get_current(&(JOB->res.boxlist));
          if (box4 == box2  ||  box4->c == PICTURE) continue;
          /* 0.42 speed up for backround pixel pattern, box4 to small */
          if ( box4->x1 - box4->x0 + 1 < x1-x0+1
            && box4->y1 - box4->y0 + 1 < y1-y0+1 ) continue;
          // have in mind that line number may be wrong for dust 
          if (box4->line>=0 && box2->line>=0 && box4->line==box2->line)
          {
             if (!box5) box5=box4;
             if ( abs(box4->x0 + box4->x1 - 2*box2->x0)
                 <abs(box5->x0 + box5->x1 - 2*box2->x0))
               { box6=box5; box5=box4; }
  	  }
        } end_for_each(&(JOB->res.boxlist));
	box4=box5; // next nearest box within the same line
      	if (box4) {
#if 0    /* set this to 1 for debugging of melting bugs */
          if (JOB->cfg.verbose & 7) {
            fprintf(stderr,"\n# next two boxes are candidates for melting ");
            out_x(box2);
            out_x(box4); }
#endif
          if( /* umlaut "a "o "u, ij; box2 is the small dot, box4 the body */
            (            y1 <= box2->m2
              &&   box4->y1 >= box2->m2         // dont melt dots together
              &&   2* y1 < box4->y1 + box4->y0  // box2 above box4
              &&   box4->x1+JOB->res.avX/2>=x0
              &&   box4->x0-JOB->res.avX/2<=x1
              && (y1 < box4->y0 || x0 < box4->x1) // dont melt "d'"
              &&   3* (      y1 - box4->y0)
                <= 2* (box4->y1 - box4->y0)  // too far away? dust!  
              &&   8* (      x1 -       x0 + 1)
                >=    (box4->x1 - box4->x0 + 1)  // dot must have minimum size  
              &&  10* (      y1 -       y0 + 1)
                >=    (box4->y1 - box4->y0 + 1)  // dot must have minimum size  
            ) || ( 0 &&	/* broken T */
              3*(box2->x1 - box2->x0) > 2*JOB->res.avX
            && 4*box4->x0>3*box2->x0+box2->x1
            && 4*box4->x1<box2->x0+3*box2->x1
            )
          ||  /* !?; box2 is the dot, box4 the body */
            (    2*box4->x1>=x0+x1 	/* test if box4 is around box2 */
              && 2*box4->x0<=2*x1 /* +x0+1 Jan00 */
              && ( x1-x0 <= box4->x1-box4->x0+2 )
              &&   2*y0>=box2->m2+box2->m3 
              &&   4*y1>=box2->m2+3*box2->m3 
              &&   4*(y1-y0)<box2->m4-box2->m1
              &&   (8*box4->y1 < box4->m2+7*box4->m3
                   || box4->m4-box4->m1<16) /* Jan00 */
            )
          ||  /* =;: box2 is the upper box, box4 the lower box */
            (    2*box4->x1>=x0+x1 	/* test if box4 is around box2 */
              && 2*box4->x0<=2*x1 /* +x0+1 */
              && ( x1-x0  <=   box4->x1-box4->x0+4 )
              && (  4*x0  <= 3*box4->x1+box4->x0 )
              && (( box2->m2 && box4->m2
                &&   y1< box2->m3
                && 2*box4->y1 >    box4->m3+box4->m2  // can be bigger than m3
                && 4*box4->y0 >= 3*box4->m2+box4->m3 
                && 2*box2->y0 <    box2->m3+box2->m2
                 )
               || ( (!box2->m2) || (!box4->m2) )
              )
            )
          )
          {  // fkt melt(box2,box4)
            if (JOB->cfg.verbose & 7)
              fprintf(stderr," glue objects (%3d %3d %+3d %+3d)"
                                          " (%3d %3d %+3d %+3d)\n# ...",
                x0, y0, x1-x0+1, y1-y0+1, box4->x0, box4->y0,
                box4->x1-box4->x0+1, box4->y1-box4->y0+1);
            // fprintf(stderr,"\n# DEBUG merge:");  // d=7x34 @ (109,51) ???
            // out_x(box2);
            // out_x(box4);
            merge_boxes( box2, box4 ); // add box4 to box2
            x0 = box2->x0; x1 = box2->x1;
            y0 = box2->y0; y1 = box2->y1;
            // if (JOB->cfg.verbose & 4) out_x(box2);
            // JOB->res.numC--;  // dont count fragments as chars
            ii++; glued_frags++; // remove
            // output_list(JOB);
	    list_del(&(JOB->res.boxlist), box4); /* ret&1: error-message ??? */
            // output_list(JOB);
	    free_box(box4);
          }
	}
      }
//  continue;

      // horizontally broken w' K'
      if(     2*y1  <   (box2->m3+box2->m2) )
      if( 2*(y1-y0) <   (box2->m3+box2->m2) )	// fragment
      for_each_data(&(JOB->res.boxlist)) {
	box4=(struct box *)list_get_current(&(JOB->res.boxlist));
        if(box4!=box2 && box4->c != PICTURE )
	{
          if( box4->line>=0 && box4->line==box2->line
          && box4->x1>=x0-1 && box4->x1<x0  // do not glue 6-
          && box4->x0+3*box4->x1<4*x0)
          if( get_bw(x0  ,x0  ,y1,y1  ,pp,cs,1) == 1)
          if( get_bw(x0-2,x0-1,y1,y1+2,pp,cs,1) == 1)
          {  // fkt melt(box2,box4)
            put(pp,x0,y1+1,~(128+64),0);
            merge_boxes( box2, box4 );
            x0 = box2->x0; x1 = box2->x1;
            y0 = box2->y0; y1 = box2->y1;
            JOB->res.numC--; ii++;	// remove
            glued_hor++;
	    list_del(&(JOB->res.boxlist), box4);
	    free_box(box4);
          }
        }
      } end_for_each(&(JOB->res.boxlist));

      // horizontally broken n h	(h=l_)		v0.2.5 Jun00
      if( abs(box2->m2-y0)<=(y1-y0)/8 )
      if( abs(box2->m3-y1)<=(y1-y0)/8 )
      if( num_cross(x0,         x1,(y0+  y1)/2,(y0+  y1)/2,pp,cs) == 1)
      if( num_cross(x0,         x1,(y0+3*y1)/4,(y0+3*y1)/4,pp,cs) == 1)
      if(    get_bw((3*x0+x1)/4,(3*x0+x1)/4,(3*y0+y1)/4,y1,pp,cs,1) == 0)
      if(    get_bw(x0,(3*x0+x1)/4,(3*y0+y1)/4,(y0+3*y1)/4,pp,cs,1) == 0)
      if(    get_bw(x0,         x0,         y0,(3*y0+y1)/4,pp,cs,1) == 1)
      for_each_data(&(JOB->res.boxlist)) {
	box4=(struct box *)list_get_current(&(JOB->res.boxlist));
      	if(box4!=box2 && box4->c != PICTURE )
	{
          if( box4->line>=0 && box4->line==box2->line
          && box4->x1>x0-3 && box4->x1-2<x0
           && abs(box4->y1-box2->m3)<2)
      	  {  // fkt melt(box2,box4)
      	    y=loop(pp,x0,y0,y1-y0,cs,0,DO);if(2*y>y1-y0) continue;
            put(pp,x0-1,y0+y  ,~(128+64),0);
            put(pp,x0-1,y0+y+1,~(128+64),0);
            merge_boxes( box2, box4 );  // add box4 to box2
            x0 = box2->x0; x1 = box2->x1;
            y0 = box2->y0; y1 = box2->y1;
            JOB->res.numC--; ii++;	// remove
            glued_hor++;
	    list_del(&(JOB->res.boxlist), box4);
	    free_box(box4);
          }
      	}
      } end_for_each(&(JOB->res.boxlist));
    } end_for_each(&(JOB->res.boxlist)); 
    if (JOB->cfg.verbose)
      fprintf(stderr," glued: %3d fragments (found %3d), %3d rest, nC= %d\n",
        glued_frags, num_frags, glued_hor, JOB->res.numC);
    close_progress(pc);
  }
  return 0;
}

/*
** this is a simple way to improve results on noisy images:
** - find similar chars (build cluster of same chars)
** - analyze clusters (could be used for generating unknown font-base)
** - the quality of the result depends mainly on the distance function
*/
  // ---- analyse boxes, compare chars, compress picture ------------
  // ToDo: - error-correction only on large chars! 
int find_same_chars( pix *pp){
  int i,k,d,cs,dist,n1,dx; struct box *box2,*box3,*box4,*box5;
  pix p=(*pp);
  cs=JOB->cfg.cs;
  {
    if(JOB->cfg.verbose)fprintf(stderr,"# packing");
    i = list_total(&(JOB->res.boxlist));
    for_each_data(&(JOB->res.boxlist)) {
      box4 = box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      dist=1000;	// 100% maximum
      dx = box2->x1 - box2->x0 + 1;

      if(JOB->cfg.verbose)fprintf(stderr,"\r# packing %5d",i);
      if( dx>3 )
      for(box3=(struct box *)list_next(&(JOB->res.boxlist),box2);box3;
	  box3=(struct box *)list_next(&(JOB->res.boxlist),box3)) {
        if(box2->num!=box3->num){
          int d=distance(&p,box2,&p,box3,cs);
          if ( d<dist ) { dist=d; box4=box3; }	// best fit
          if ( d<5 ){   // good limit = 5% ??? 
            i--;n1=box3->num;		// set all num==box2.num to box2.num
	    for_each_data(&(JOB->res.boxlist)) {
	      box5=(struct box *)(struct box *)list_get_current(&(JOB->res.boxlist));
	      if(box5!=box2)
              if( box5->num==n1 ) box5->num=box2->num;
	    } end_for_each(&(JOB->res.boxlist));
          // out_x2(box2,box5);
          // fprintf(stderr," dist=%d\n",d);
          }
      	}
      }
      // nearest dist to box2 has box4
      //    out_b2(box2,box4);
      //    fprintf(stderr," dist=%d\n",dist); 
    } end_for_each(&(JOB->res.boxlist));
    k=0;
    if(JOB->cfg.verbose)fprintf(stderr," %d different chars",i);
    for_each_data(&(JOB->res.boxlist)) {
      struct box *box3,*box4;
      int j,dist;
      box2=(struct box *)list_get_current(&(JOB->res.boxlist));
      for(box3=(struct box *)list_get_header(&(JOB->res.boxlist));
          box3!=box2 && box3!=NULL;
	  box3=(struct box *)list_next(&(JOB->res.boxlist), box3))
        if(box3->num==box2->num)break;
      if(box3!=box2 && box3!=NULL)continue;
      i++;
      // count number of same chars
      dist=0;box4=box2;
      
      for(box3=box2,j=0;box3;
          box3=(struct box *)list_next(&(JOB->res.boxlist), box3)) {
	if(box3->num==box2->num){
          j++;
          d=distance(&p,box2,&p,box3,cs);
          if ( d>dist ) { dist=d; box4=box3; }	// worst fit
	}
      }
      if(JOB->cfg.verbose&8){
        out_x2(box2,box4);
        fprintf(stderr," no %d char %4d %5d times maxdist=%d\n",i,box2->num,j,dist);
      }
      // calculate mean-char (error-correction)
      // ToDo: calculate maxdist in group 
      k+=j;
  //    if(j>1)
  //    out_b(box1,NULL,0,0,0,0,cs);
      if(JOB->cfg.verbose&8)
      fprintf(stderr," no %d char %4d %5d times sum=%d\n",i,box2->num,j,k);   
    } end_for_each(&(JOB->res.boxlist));
    if(JOB->cfg.verbose)fprintf(stderr," ok\n");
  }
  return 0; 
}

/*
** call the first engine for all boxes and set box->c=result;
**
*/
int char_recognition( pix *pp, int mo){
  int i,ii,ni,cs,x0,y0,x1,y1;
  struct box *box2;
  progress_counter_t *pc;
  wchar_t cc;
  cs=JOB->cfg.cs;
  // ---- analyse boxes, find chars ---------------------------------
  if (JOB->cfg.verbose) 
    fprintf(stderr,"# char recognition");
  i=ii=ni=0;
  for_each_data(&(JOB->res.boxlist)) { /* count boxes */
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    /* wew: isn't this just JOB->res.numC? */
    /* js: The program is very complex. I am not sure anymore
           wether numC is the number of boxes or the number of valid
           characters.
           Because its not time consuming I count the boxes here. */
    if (box2->c==UNKNOWN)  i++;
    if (box2->c==PICTURE) ii++;
    ni++;
  } end_for_each(&(JOB->res.boxlist));
  if(JOB->cfg.verbose)
    fprintf(stderr," unknown= %d picts= %d boxes= %d\n# ",i,ii,ni);
  if (!ni) return 0;
  i=ii=0;
  pc = open_progress(ni,"char_recognition");
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    x0=box2->x0;x1=box2->x1;
    y0=box2->y0;y1=box2->y1;	// box
    cc=box2->c;
    if (cc==PICTURE) continue;
    
    if ((mo&256)==0) { /* this case should be default (main engine) */
      if(cc==UNKNOWN || box2->num_ac==0 || box2->wac[0]<JOB->cfg.certainty)
        cc=whatletter(box2,cs   ,0);
    }

    if(mo&2) 
      if(cc==UNKNOWN || box2->num_ac==0 || box2->wac[0]<JOB->cfg.certainty)
	cc=ocr_db(box2);


    // box2->c=cc; bad idea (May03 removed)
    // set(box2,cc,95); ToDo: is that better? 

    if(cc==UNKNOWN) 
	i++;
    ii++;

    if(JOB->cfg.verbose&8) { 
      fprintf(stderr,"\n# code= %04lx %c",(long)cc,(char)((cc<255)?cc:'_')); 
      out_b(box2,pp,x0,y0,x1-x0+1,y1-y0+1,cs);
    }
    progress(ii,pc); /* ii = 0..ni */

  } end_for_each(&(JOB->res.boxlist));
  close_progress(pc);
  if(JOB->cfg.verbose)fprintf(stderr," %d of %d chars unidentified\n",i,ii);
  return 0;
}


/*
** compare unknown with known chars,
** very similar to the find_similar_char_function but here only to
** improve the result
*/
int compare_unknown_with_known_chars(pix * pp, int mo) {
  int i, cs = JOB->cfg.cs, dist, d, ad, wac, ni, ii;
  struct box *box2, *box3, *box4;
  progress_counter_t *pc=NULL;
  wchar_t bc;
  i = ii = 0; // ---- -------------------------------
  if (JOB->cfg.verbose)
    fprintf(stderr, "# try to compare unknown with known chars !(mode&8)");
  if (!(mo & 8))
  {
    ii=ni=0;
    for_each_data(&(JOB->res.boxlist)) { ni++; } end_for_each(&(JOB->res.boxlist));
    pc = open_progress(ni,"compare_chars");
    for_each_data(&(JOB->res.boxlist)) {
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist)); ii++;
      if (box2->c == UNKNOWN || (box2->num_ac>0 && box2->wac[0]<97))
	if (box2->y1 - box2->y0 > 4 && box2->x1 - box2->x0 > 1) { // no dots!
	  box4 = (struct box *)list_get_header(&(JOB->res.boxlist));;
	  dist = 1000;		/* 100% maximum */
	  bc = UNKNOWN;		/* best fit char */
	  for_each_data(&(JOB->res.boxlist)) {
	    box3 = (struct box *)list_get_current(&(JOB->res.boxlist));
            wac=((box3->num_ac>0)?box3->wac[0]:100);	    
	    if (box3 == box2 || box3->c == UNKNOWN
                             || wac<JOB->cfg.certainty) continue;
	    if (box2->y1 - box2->y0 < 5 || box2->x1 - box2->x0 < 3) continue;
	    d = distance(pp, box2, pp, box3, cs);
	    if (d < dist) {
		dist = d;  bc = box3->c;  box4 = box3;
	    }
	  } end_for_each(&(JOB->res.boxlist));
	  if (dist < 10) {
            /* sureness can be maximal of box3 */
	    if (box4->num_ac>0) ad = box4->wac[0];
	    else                ad = 97;
	    ad-=dist; if(ad<1) ad=1; 
	    /* ToDo: ad should depend on ad of bestfit */
	    setac(box2,(wchar_t)bc,ad);
	    i++;
	  }			// limit as option???
	  //  => better max distance('e','e') ???
	  if (dist < 50 && (JOB->cfg.verbose & 7)) {	// only for debugging
	    fprintf(stderr,"\n#  L%02d best fit was %04x=%c dist=%3d%% i=%d",
                    box2->line, (int)bc, (char)((bc<128)?bc:'_'), dist, i);
	    if(box4->num_ac>0)fprintf(stderr," w= %3d%%",box4->wac[0]);
	    if ((JOB->cfg.verbose & 4) && dist < 10)
	      out_x2(box2, box4);
	  }
	  progress(ii,pc);
	}
    } end_for_each(&(JOB->res.boxlist));
    close_progress(pc);
  }
  if (JOB->cfg.verbose)
    fprintf(stderr, " - found %d (nC=%d)\n", i, ii);
  return 0;
}

/*
// ---- divide overlapping chars which !strchr("_,.:;",c);
// block-splitting (two ore three glued chars)
// division if dots>0 does not work properly! ???
//
// what about glued "be"?
// what about recursive division?
// ToDo: mark divided boxes to give the engine a chance to 
//       handle wrong divisions
*/
int  try_to_divide_boxes( pix *pp, int mo){
  struct box *box2, boxa, boxb;
  int cs=JOB->cfg.cs, ad=100,
      a2[8], ar, // certainty of each part, ar = product of all certainties
      cbest;  // best certainty, skip search of certainty<cbest-1 for speed
  wchar_t ci[8],  // split max. 8 chars 
          s1[]={ UNKNOWN, '_', '.', ',', '\'', '!', ';', '?', ':', '-', 
      '=', '(', ')', '/', '\\', '\0' };	// not accepted chars, \0-terminated!
  int x0, x1, y0, y1,
      xi[8+1]; // cutting positions
  int i, ii, n1, dy, dx;
  // pix p=(*pp); // remove!
  if (JOB->cfg.verbose)
    fprintf(stderr,"# try to divide unknown chars !(mode&16)");
  if(!(mo&16))  // put this to the caller
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    // don't try to split simple structures (ex: 400x30 square)
    if ((!box2->num_frames)
       || box2->num_frame_vectors[ box2->num_frames-1 ]<9) continue; 
    if((box2->c==UNKNOWN || (box2->num_ac && box2->wac[0]<JOB->cfg.certainty))
      && box2->x1-box2->x0>5 && box2->y1-box2->y0>4){
      x0=box2->x0; x1=box2->x1;
      y0=box2->y0; y1=box2->y1;
      ad=100;
      cbest=0;
      
      /* get minimum vertical lines */
      n1 = num_cross(x0,x1,(  y1+y0)/2,(  y1+y0)/2,pp,cs);
      ii = num_cross(x0,x1,(3*y1+y0)/4,(3*y1+y0)/4,pp,cs); if (ii<n1) n1=ii;
      if (box2->m2 && box2->m3 > box2->m2+2)
      for (i=box2->m2+1;i<=box2->m3-1;i++) {
        if (loop(pp,x0+1,i,x1-x0,cs,1,RI) > (x1-x0-2)) continue; // ll
        ii = num_cross(x0,x1,i,i,pp,cs); if (ii<n1) n1=ii;
      } if (n1<2) continue;  // seems to make no sense to divide
      if (n1<4) ad=99*ad/100; // not to strong because m2+m3 could be wrong
      if (n1<3) ad=99*ad/100;
            
      if( 2*y1 < box2->m3+box2->m4    /* baseline char ? */
       && num_cross(x0,x1,y1-1,y1-1,pp,cs)==1  // -1 for slopes
       && num_cross((x0+2*x1)/3,(x0+3*x1)/4,y0,y1,pp,cs)<3  // not exclude tz
       && num_cross((3*x0+x1)/4,(2*x0+x1)/3,y0,y1,pp,cs)<3  // not exclude zl
       && loop(pp,x0,y1-(y1-y0)/32,x1-x0,cs,0,RI)
         +loop(pp,x1,y1-(y1-y0)/32,x1-x0,cs,0,LE) > (x1-x0+1)/2
        ) continue; /* do not try on bvdo"o etc. */
        
      // one vertical line can not be two glued chars, lc?
      if ( num_cross(x0,x1,(y1+y0)/2,(y1+y0)/2,pp,cs)<=1 ) continue;
      {	// doublet = 2 letters
        // char buf[4]="\0\0\0";      // 4th byte is string end == \0
        // buf[0]=c1;                 // c1 is wchar_t! (0xbf00 to 0) failes
        // buf[1]=c2;
        char buf[64]="";      // end == \0
        if (JOB->cfg.verbose&2){ 
          fprintf(stderr, "\n#\n# divide box: %4d %4d %3d %3d\n",
                  x0, y0, x1-x0+1, y1-y0+1);
          if (JOB->cfg.verbose&4) out_x(box2);
        }
        // it would be better if testing is only if most right and left char
        //   is has no horizontal gap (below m2) ex: be
        i=0; // num splittet chars
        xi[0]=x0; xi[1]=x0+3; xi[2]=x1;
        for ( ; ; xi[i+1]++) { // x[i] .. x[i+1], slower? but better v0.42
          /* break if x is to near to the right border */
          if (xi[i+1]>x1-3) { if (i==0) break; i--; xi[i+2]=x1; continue; }
          // ToDo: skip if not a local dy-min for speedup
        { int ymin=y1, ymax=y0, bow=0, // min max at cutting point
              max0=y0, max1=y0, // max y on left and right side
              min0=y1, min1=y1; // min y on left and right side
          for (dy=0,ii=0;ii<box2->num_frame_vectors[ 0 ];ii++) {
            int pre=ii-1, next=(ii+1)%box2->num_frame_vectors[ 0 ];
            if (pre<0) pre=box2->num_frame_vectors[ 0 ]-1;
            // check if vector is inside box to cut
            if (    box2->frame_vector[ii  ][0]<=xi[i  ]) continue;
            if (    box2->frame_vector[ii  ][0]> xi[i+2]) continue;
            // 2nd derivation of y(x)
            if (abs(box2->frame_vector[ii  ][0]-xi[i+1])<2) {
              dy= 2*box2->frame_vector[ii  ][1]
                   -box2->frame_vector[next][1]
                   -box2->frame_vector[pre ][1];
              dx=   box2->frame_vector[next][0]
                   -box2->frame_vector[pre ][0];
              // rotate 180 degree if dx<0
              if (((dx>0)?dy:-dy)<-abs(dx)/2) { bow=1; }
            }
            // its not the best if we think on glued fi fo etc.
            if ((  box2->frame_vector[pre ][0]<=xi[i+1]
                && box2->frame_vector[next][0]>=xi[i+1])
             || (  box2->frame_vector[pre ][0]>=xi[i+1]
                && box2->frame_vector[next][0]<=xi[i+1])) {
             if (    box2->frame_vector[ii  ][1]>ymax)
               ymax= box2->frame_vector[ii  ][1];
             if (    box2->frame_vector[ii  ][1]<ymin)
               ymin= box2->frame_vector[ii  ][1];
            }
            // min and max of left and right side
            if (    box2->frame_vector[ii  ][1]>max0
             &&     box2->frame_vector[ii  ][0]<=xi[i+1])
               max0=box2->frame_vector[ii  ][1];
            if (    box2->frame_vector[ii  ][1]>max1
             &&     box2->frame_vector[ii  ][0]> xi[i+1])
               max1=box2->frame_vector[ii  ][1];
            if (    box2->frame_vector[ii  ][1]<min0
             &&     box2->frame_vector[ii  ][0]<=xi[i+1])
               min0=box2->frame_vector[ii  ][1];
            if (    box2->frame_vector[ii  ][1]<min1
             &&     box2->frame_vector[ii  ][0]> xi[i+1])
               min1=box2->frame_vector[ii  ][1];
          }
          if(JOB->cfg.verbose&2)
            fprintf(stderr,"\n# test if to split at x%d= %2d %2d %2d"
                    " bow,(max-min)[i,0,1] %d %3d %3d %3d"
                    , i, xi[i]-x0, xi[i+1]-x0, xi[i+2]-x0, bow, ymax-ymin, max0-min0, max1-min1);
          /* skip if no local minimum at xi[i+1] or if its not thin enough */ 
          if (bow==0 || 4*(ymax-ymin)>2*(y1-y0)) continue;
          // cuttet parts should have about the same height (max-min)
          // we dont want to cut an 'n' in three parts!
          if (2*(max0-min0+1)<(y1-y0+1)) continue;  // left  height
          if (2*(max1-min1+1)<(y1-y0+1)) continue;  // right height
          // ToDo: thickness on xi[i+1]?
        }
        // try to split successive right box if left box is recognised,
        // else shift the splitting point further to the right border 
        // removing ->dots if dot only above one char !!! ??? not implemented
          if(JOB->cfg.verbose&2)
            fprintf(stderr,"\n# try to split, newbox[%d].x= %2d ... %2d "
                           "dy= %d ", i, xi[i]-x0, xi[i+1]-x0, dy);
          boxa=*box2;	// copy contents, ToDo: reset ac-list (in cut_box?)
          boxa.x=xi[i]; boxa.y=y0;        // obsolete? mark pixel, overlap?
          boxa.x0=xi[i];boxa.x1=xi[i+1];  // new horizontal box range
          cut_box(&boxa); boxa.num_ac=0;
          // out_x(&boxa);
          // get wchar + certainty
          ci[i]=whatletter(&boxa,cs,0); a2[i]=testac(&boxa,ci[i]);
          if(JOB->cfg.verbose&2)
            fprintf(stderr,"\n#  certainty %d  limit= %d  cbest= %d ",
                           a2[i], JOB->cfg.certainty, cbest);
	  if (a2[i]<JOB->cfg.certainty || a2[i]<cbest-1
	   || wcschr(s1,ci[i]) ) { continue; }  // dont split here

          for (ar=ad,ii=0;ii<=i;ii++) {
            ar=a2[ii]*ar/100; }  // multiply all probabilities
	  if (ar<98*JOB->cfg.certainty/100 || ar<cbest) {
            continue; } // dont go deeper, no longer string

	  i++; if (i==8) break; // maximum splits
	  if (i==4) break;  // at the moment its to slow to go further 
	  if (i+1<8) xi[i+1]=x1;  // right border of next box
	  if (i+2<8) xi[i+2]=x1;

          if(JOB->cfg.verbose&2)
            fprintf(stderr,"\n try end split [%d]=%d [%d]=%d ",
                           i, xi[i]-x0, i+1, xi[i+1]-x0);
          boxb=*box2;  // try rest if it has to be split again
          boxb.x=xi[i]+1; boxb.y=y0;
          boxb.x0=xi[i]+1;boxb.x1=xi[i+1];
          cut_box(&boxb); boxb.num_ac=0;
          ci[i]=whatletter(&boxb,cs,0); a2[i]=testac(&boxb,ci[i]);
	  if (a2[i]<JOB->cfg.certainty || a2[i]<cbest-1
	   || wcschr(s1,ci[i]) ) { xi[i+1]=xi[i]+2; continue; } // split rest
	  // now we have everything splittet

          if(JOB->cfg.verbose&2) {
            fprintf(stderr,"\n split at/to: ");
            for (ii=0;ii<=i;ii++)
            fprintf(stderr,"  %2d %s (%3d)", xi[ii+1]-x0,
              decode(ci[ii],ASCII), a2[ii]);
            fprintf(stderr,"\n");
          }
	  // boxa..c changed!!! dots should be modified!!!
          // Question: cut it into boxes v0.40 or set a string v0.41?
          // new way of building a string v0.41 (can call setas multiple)
          // usefull if compare unknown with known strings (except barcode?)
          // ToDo: also create alternate variants? ex: I <-> l
          for (buf[0]=0,ar=ad,ii=0;ii<=i;ii++) {
            ar=a2[ii]*ar/100;  // multiply all probabilities
            if (i>0 && ci[ii]=='n' && ci[ii-1]=='r') ar--; // m == rn
            strncat(buf,decode(ci[ii],JOB->cfg.out_format),20);
          }

          if (ar>cbest) cbest=ar; // best (highest) certainty found
          // reduce, but not if we cross certainty border
          if (99*ar/100 > JOB->cfg.certainty) ar=99*ar/100;
          if (JOB->cfg.verbose&2)
            fprintf(stderr,"\n split result= %s (%3d) ",buf, ar);
          setas(box2,buf,ar); // char *, does it disturb further splitting?
          buf[0]=0;
          i--; xi[i+2]=x1;
        }
      }
    }
  } end_for_each(&(JOB->res.boxlist));
  if (JOB->cfg.verbose) fprintf(stderr,", numC %d\n",JOB->res.numC); 
  return 0;
}

/*
// ---- divide vertical glued boxes (ex: g above T);
*/
int  divide_vert_glued_boxes( pix *pp, int mo){
  struct box *box2,*box3,*box4;
  int y0,y1,y,dy,flag_found,dx;
  if(JOB->cfg.verbose)fprintf(stderr,"# divide vertical glued boxes");
  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->c != UNKNOWN) continue; /* dont try on pictures */
    y0=box2->y0; y1=box2->y1; dy=y1-y0+1;
    dx=4*(JOB->res.avX+box2->x1-box2->x0+1);     // we want to be sure to look at 4ex distance 
    if ( dy>2*JOB->res.avY && dy<6*JOB->res.avY && box2->m1
      && y0<=box2->m2+2 && y0>=box2->m1-2
      && y1>=box2->m4+JOB->res.avY-2)
    { // test if lower end fits one of the other lines?
      box4=box2; flag_found=0;
      for_each_data(&(JOB->res.boxlist)) {
        box4 = (struct box *)list_get_current(&(JOB->res.boxlist));
        if (box4->c != UNKNOWN) continue; /* dont try on pictures */
        if (box4->x1<box2->x0-dx || box4->x0>box2->x1+dx) continue; // ignore far boxes
        if (box4->line==box2->line  ) flag_found|=1;    // near char on same line
        if (box4->line==box2->line+1) flag_found|=2;    // near char on next line
        if (flag_found==3) break;                 // we have two vertical glued chars
      } end_for_each(&(JOB->res.boxlist));
      if (flag_found!=3) continue;         // do not divide big chars or special symbols
      y=box2->m4;  // lower end of the next line
      if(JOB->cfg.verbose&2){
        fprintf(stderr,"\n# divide box below y=%4d",y-y0);
        if(JOB->cfg.verbose&6)out_x(box2);
      }
      // --- insert box3 before box2
      box3= (struct box *) malloc_box(box2);
      box3->y1=y;
      box2->y0=y+1; box2->line++; // m1..m4 should be corrected!
      if (box4->line == box2->line){
        box2->m1=box4->m1;        box2->m2=box4->m2;
        box2->m3=box4->m3;        box2->m4=box4->m4;
      }
      box3->num=JOB->res.numC;
      if (list_ins(&(JOB->res.boxlist), box2, box3)) {
          fprintf(stderr,"ERROR list_ins\n"); };
      JOB->res.numC++;
    }
  } end_for_each(&(JOB->res.boxlist));
  if(JOB->cfg.verbose)fprintf(stderr,", numC %d\n",JOB->res.numC); 
  return 0;
}


/* 
   on some systems isupper(>255) cause a segmentation fault SIGSEGV
   therefore this function
   ToDo: should be replaced (?) by wctype if available on every system
 */
int wisupper(wchar_t cc){ return ((cc<128)?isupper(cc):0); }
int wislower(wchar_t cc){ return ((cc<128)?islower(cc):0); }
int wisalpha(wchar_t cc){ return ((cc<128)?isalpha(cc):0); }
int wisdigit(wchar_t cc){ return ((cc<128)?isdigit(cc):0); }
int wisspace(wchar_t cc){ return ((cc<128)?isspace(cc):0); }

/* set box2->c to cc if cc is in the ac-list of box2, return 1 on success  */
int setc(struct box *box2, wchar_t cc){
  int ret=0, w1, w2;
  w1=((box2->num_ac) ? box2->wac[0] : 0);  // weight of replaced char
  w2=testac(box2,cc);
  if (JOB->cfg.verbose)
    fprintf(stderr, "\n#  change %s (%d) to %s (%d to %d) at (%d,%d)",
    decode(box2->c,ASCII), w1, decode(cc,ASCII), w2, (100+w2+1)/2,
    box2->x0, box2->y0);
  if (w2) { if (box2->c!=cc) { ret=1; setac(box2,cc,(100+w2+1)/2); } }
  // if(JOB->cfg.verbose & 4) out_x(box2);
  // ToDo: modify per setac (shift ac)
  return ret;
}


/* ---- proof difficult chars Il1 by context view ----
  context: separator, number, vowel, nonvowel, upper case ????
  could be also used to find unknown chars if the environment (nonumbers)
    can be found in other places!
  ToDo:
   - box->tac[] as set of possible chars, ac set by engine, example:
       ac="l/" (not "Il|/\" because serifs detected and slant>0)
       correction only to one of the ac-set (alternative chars)!
   - should be language-settable; Unicode compatible 
   - box2->ad and wac should be changed? (not proper yet)
 *  ------------- */
int context_correction( job_t *job ) {
 // const static char
  char *l_vowel="aeiouy";
    // *l_Vowel="AEIOU",chars if the environment (nonumbers)
  char *l_nonvo = "bcdfghjklmnpqrstvwxz";
  struct box *box4, *box3, *box2, *prev, *next;
  //  pix *pp = &(job->src.p);
  int nc=0, ns=0; // num corrections

  if (job->cfg.verbose)
    fprintf(stderr, "# context correction Il1 0O");

  for_each_data(&(job->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(job->res.boxlist));
    if (box2->c > 0xFF) continue; // temporary UNICODE fix 
    prev = (struct box *)list_get_cur_prev(&(job->res.boxlist));
    next = (struct box *)list_get_cur_next(&(job->res.boxlist));
    if( (prev) && (prev->c > 0xFF)) continue; //  temporary UNICODE fix 2
    if( (next) && (next->c > 0xFF)) continue; //  temporary UNICODE fix 3
    if (box2->num_ac<2) continue; // no alternatives
    if (box2->wac[0]==100 && box2->wac[1]<100) continue;
    if (box2->num_ac && box2->tas[0]) continue; // buggy space_remove 0.42

    /* check for Il1| which are general difficult to distinguish */
    /* bbg: not very good. Should add some tests to check if is preceded by '.',
     spelling, etc */
    /* ToDo: only correct if not 100% sure (wac[i]<100)
        and new char is in wat[] */
    if (strchr("Il1|", box2->c) && next && prev) {
//       if( strchr(" \n",prev->c)      // SPC 
//        && strchr(" \n",next->c) ) box2->c='I'; else // bad idea! I have ...
      if (wisalpha(next->c) && next->c!='i' && 
          ( prev->c == '\n' || 
	   ( prev->c == ' ' &&
	    ( box4=(struct box *)list_prev(&(job->res.boxlist), prev)) &&
	      box4->c == '.' ) ) ) {  nc+=setc(box2,(wchar_t)'I'); }
      else if (box2->c!='1' && strchr(l_nonvo,next->c) && 
                               strchr("\" \n",prev->c)) /* lnt => Int, but 1st */
        /* do not change he'll to he'Il! */
        { nc+=setc(box2,(wchar_t)'I'); }  // set box2->c to 'I' if 'I' is in the ac-list
      else if (strchr(l_vowel,next->c)) /* unusual? Ii Ie Ia Iy Iu */   
          /*  && strchr("KkBbFfgGpP",prev->c)) */ /* kle Kla Kli */
          {  nc+=setc(box2,(wchar_t)'l'); }
      else if (wisupper(next->c)
            && !strchr("O0I123456789",next->c)
            && !strchr("O0I123456789",prev->c)) /* avoid lO => IO (10) */
	{  nc+=setc(box2,(wchar_t)'I'); }
      else if (wislower(prev->c))
	{  nc+=setc(box2,(wchar_t)'l'); }
      else if (wisdigit(prev->c) || wisdigit(next->c)
       || (next->c=='O' && !wisalpha(prev->c)))  /* lO => 10 */
	{  nc+=setc(box2,(wchar_t)'1'); }
    }
    
    /* check for O0 */
    else if (strchr("O0", box2->c) && next && prev) {
      if (wisspace(prev->c) && wisalpha(next->c)) /* initial letter */
	{ nc+=setc(box2,(wchar_t)'O'); }
      else if (wisalpha(prev->c) && wisalpha(next->c)
                                 && wisupper(next->c)) /* word in upper case */
	{ nc+=setc(box2,(wchar_t)'O'); }
      else if (wisdigit(prev->c) || wisdigit(next->c))
	{ nc+=setc(box2,(wchar_t)'0'); }
    }

    /* check for 5S */
    else if (strchr("5S", box2->c) && next && prev) {
      if (wisspace(prev->c) && wisalpha(next->c)) /* initial letter */
	{ nc+=setc(box2,(wchar_t)'S'); }
      else if (wisalpha(prev->c) && wisalpha(next->c)
                                 && wisupper(next->c)) /* word in upper case */
	{ nc+=setc(box2,(wchar_t)'S'); }
      else if (wisdigit(prev->c) || wisdigit(next->c))
	{ nc+=setc(box2,(wchar_t)'5'); }
    }

    /* was a space not found? xXx => x Xx ??? */
    if (wisupper(box2->c) && next && prev) {
      if (wislower(prev->c) && wislower(next->c)
	  && 2 * (box2->x0 - prev->x1) > 3 * (next->x0 - box2->x1)) {
	struct box *box3 = malloc_box((struct box *) NULL);
	box3->x0 = prev->x1 + 2;
	box3->x1 = box2->x0 - 2;
	box3->y0 = box2->y0;
	box3->y1 = box2->y1;
	box3->x = box2->x0 - 1;
	box3->y = box2->y0;
	box3->dots = 0;
	box3->num_boxes = 0;
	box3->num_subboxes = 0;
	box3->c = ' ';
	box3->modifier = 0;
	setac(box3,' ',99); /* ToDo: weight depends from distance */
	box3->num = -1;
	box3->line = prev->line;
	box3->m1 = box3->m2 = box3->m3 = box3->m4 = 0;
	box3->p = &(job->src.p);
	list_ins(&(job->res.boxlist), box2, box3);
      }
    }
    
    /* a space before punctuation? but not " ./file" */
    if ( prev && next)
    if (prev->c == ' ' && strchr(" \n"    , next->c)
                       && strchr(".,;:!?)", box2->c))
      if (prev->x1 - prev->x0 < 2 * job->res.avX) {	// carefully on tables
	box3 = prev;
	if ( !list_del(&(job->res.boxlist), box3) ) free_box(box3);	
        prev = (struct box *)list_get_cur_prev(&(job->res.boxlist));
        ns++;
      }

    /* \'\' to \" */
    if ( prev )
    if ( (prev->c == '`' || prev->c == '\'')
      && (box2->c == '`' || box2->c == '\'') )
      if (prev->x1 - box2->x0 < job->res.avX) { // carefully on tables
        box2->c='\"';
	box3 = prev;
	list_del(&(job->res.boxlist), box3);
	free_box(box3);
      }
  } end_for_each(&(job->res.boxlist));
  if (job->cfg.verbose)
    fprintf(stderr, " num_corrected= %d removed_spaces= %d\n", nc, ns);
  return 0;
}


/* ---- insert spaces ----
 *  depends strongly from the outcome of measure_pitch()
 * ------------------------ */
int list_insert_spaces( pix *pp, job_t *job ) { 
  int i=0, j1, j2, i1, maxline=-1, dy=0; char cc;
  struct box *box2, *box3=NULL, *box4=NULL;

  // measure mean line height
  for(i1=1;i1<job->res.lines.num;i1++) {
    dy+=job->res.lines.m4[i1]-job->res.lines.m1[i1]+1;
  } if (job->res.lines.num>1) dy/=(job->res.lines.num-1);
  i=0; j2=0;
  for(i1=1;i1<job->res.lines.num;i1++) {
    j1=job->res.lines.m4[i1]-job->res.lines.m1[i1]+1;
    if (j1>dy*120/100 || j1<dy*80/100) continue; // only most frequently
    j2+=j1; i++;
  } if (i>0 && j2/i>7) dy=j2/i;
  if( job->cfg.verbose&1 )
    fprintf(stderr,"# insert space between words (dy=%d) ...",dy);
  if (!dy) dy=(job->res.avY)*110/100+1;

  i=0;
  for_each_data(&(job->res.boxlist)) {
    box2 =(struct box *)list_get_current(&(job->res.boxlist));
    cc=0;
    if (box2->line>maxline) {  // lines and chars must be sorted!
      if (maxline>=0) cc='\n'; // NL
      maxline=box2->line;
    }
    if((box3 = (struct box *)list_prev(&(job->res.boxlist), box2))){
      if (maxline && !box2->line && cc==0) cc=' ';
      if (box2->line<=maxline && cc==0) {  // lines and chars must be sorted!
        int thispitch = job->res.lines.pitch[box2->line];
        int thismono  = job->res.lines.mono[box2->line];
        int mdist = (box2->x1 + box2->x0 - (box3->x1 + box3->x0) + 1)/2;
        int pdist  = box2->x0 - box3->x1 + 1;
        if (box2->x1 - box2->x0 < thispitch) pdist=pdist*4/3;
        /* allow extra pixels around small characters .,'!: etc */
        // fprintf(stderr,"#\n ... mono= %2d  pitch= %2d mdist= %2d pdist= %2d",
        //  thismono, thispitch, mdist, pdist);
        if ((thismono!=0 && mdist >= thispitch)
         || (thismono==0 && pdist >= thispitch))
          cc=' '; // insert SPACE
      }
    }
    if(cc){
      box4=(struct box *)list_prev(&(job->res.boxlist), box2);
      box3=(struct box *)malloc_box(NULL);
      box3->x0=box2->x0-2;       box3->x1=box2->x0-2;
      box3->y0=box2->y0;         box3->y1=box2->y1;
      if(cc!='\n' && box4)
	box3->x0=box4->x1+2;
      if(cc=='\n' || !box4)
	box3->x0=job->res.lines.x0[box2->line];
      if(cc=='\n' && box4){
        box3->y0=box4->y1;	// better use lines.y1[box2->pre] ???
        box3->y1=box2->y0;
      }
      box3->x =box2->x0-1;       box3->y=box2->y0;
      box3->dots=0;              box3->c=cc;
      box3->num_boxes = 0;
      box3->num_subboxes = 0;
      box3->modifier='\0';
      box3->num=-1;        box3->line=box2->line;
      box3->m1=box2->m1;   box3->m2=box2->m2;
      box3->m3=box2->m3;   box3->m4=box2->m4;
      box3->p=pp;
      setac(box3,cc,100);   /* ToDo: weight depends from distance */
      list_ins(&(job->res.boxlist),box2,box3);
      if( job->cfg.verbose&1 ) {
        fprintf(stderr,"\n# insert space &%d; at x= %4d %4d box= %p",
          (int)cc, box3->x0, box3->y0, (void*)box3);
        /* out_x(box3); */
      }
      i++;
    }
  } end_for_each(&(job->res.boxlist));
  if( job->cfg.verbose&1 ) fprintf(stderr," found %d\n",i);
  return 0;
}


/*
   add infos where the box is positioned to the box
   this is useful for better recognition
*/
int  add_line_info(/* List *boxlist2 */){
  // pix *pp=&JOB->src.p;
  struct tlines *lines = &JOB->res.lines;
  struct box *box2;
  int i,xx,m1,m2,m3,m4,num_line_members=0,num_rest=0;
  if( JOB->cfg.verbose&1 ) fprintf(stderr,"# add line infos to boxes ...");
  for_each_data(&(JOB->res.boxlist)) {
    box2 =(struct box *)list_get_current(&(JOB->res.boxlist));
    for(i=1;i<JOB->res.lines.num;i++) /* line 0 is a place holder */
    {
      if (lines->dx) xx=lines->dy*((box2->x1+box2->x0)/2)/lines->dx; else xx=0;
      m1=lines->m1[i]+xx;
      m2=lines->m2[i]+xx;
      m3=lines->m3[i]+xx;
      m4=lines->m4[i]+xx;
      // fprintf(stderr," test line %d m1=%d %d %d %d\n",i,m1,m2,m3,m4);
      if (m4-m1==0) continue; /* no text line (line==0) */
#if 0
      if( box2->y1+2*JOB->res.avY >= m1
       && box2->y0-2*JOB->res.avY <= m4 ) /* not to far away */
#endif
      /* give also a comma behind the line a chance */
      if( box2->x0 >= lines->x0[i]  &&  box2->x1 <= lines->x1[i]+JOB->res.avX )
      if( box2->m2==0 || abs(box2->y0-box2->m2) > abs(box2->y0-m2) )
      { /* found nearest line */
        box2->m1=m1;
        box2->m2=m2;
        box2->m3=m3;
        box2->m4=m4;
        box2->line=i;
      }
    }
    if( box2->y1+2 < box2->m1
     || box2->y0   < box2->m1 - (box2->m3-box2->m1)/2
     || box2->y0-2 > box2->m4 
     || box2->y1   > box2->m3 + (box2->m3-box2->m1)
     ) /* to far away */
    {  /* reset */
        box2->m1=0;
        box2->m2=0;
        box2->m3=0;
        box2->m4=0;
        box2->line=0;
        num_rest++;
    } else num_line_members++;
  } end_for_each(&(JOB->res.boxlist));
  if( JOB->cfg.verbose&1 )
    fprintf(stderr," done, num_line_chars=%d rest=%d\n",
            num_line_members, num_rest);
  return 0;
}


/*
 *  bring the boxes in right order
 *  add_line_info must be executed first!
 */
int sort_box_func (const void *a, const void *b) {
  struct box *boxa, *boxb;

  boxa = (struct box *)a;
  boxb = (struct box *)b;

  if ( ( boxb->line < boxa->line ) ||
       ( boxb->line == boxa->line && boxb->x0 < boxa->x0 ) )
    return 1;
  return -1;
}    

// -------------------------------------------------------------
// ------             use this for entry from other programs 
// include pnm.h pgm2asc.h 
// -------------------------------------------------------------
// entry point for gocr.c or if it is used as lib
// better name is call_ocr ???
// jb: OLD COMMENT: not removed due to set_options_* ()
// args after pix *pp should be removed and new functions
//   set_option_mode(int mode), set_option_spacewidth() .... etc.
//   should be used instead, before calling pgm2asc(pix *pp)
//   ! change if you can ! - used by X11 frontend
int pgm2asc(job_t *job)
{
  pix *pp;
  progress_counter_t *pc;

  assert(job);
  /* FIXME jb: remove pp */
  pp = &(job->src.p);

  if( job->cfg.verbose ) 
    fprintf(stderr, "# db_path= %s\n", job->cfg.db_path);

  pc = open_progress(100,"pgm2asc_main");
  progress(0,pc); /* start progress output 0% 0% */

  /* ----- count colors ------ create histogram -------
     - this should be used to create a upper and lower limit for cs
     - cs is the optimum gray value between cs_min and cs_max
     - also inverse scans could be detected here later */
  if (job->cfg.cs==0)
    job->cfg.cs=otsu( pp->p,pp->y,pp->x,0,0,pp->x,pp->y, job->cfg.verbose & 1 );
  /* renormalize the image and set the normalized threshold value */
  job->cfg.cs=thresholding( pp->p,pp->y,pp->x,0,0,pp->x,pp->y, job->cfg.cs );
  if( job->cfg.verbose ) 
    fprintf(stderr, "# thresholding new_threshold= %d\n", job->cfg.cs);

  progress(5,pc); /* progress is only estimated */

#if 0 /* dont vast memory */
  /* FIXME jb: malloc */
  if ( job->cfg.verbose & 32 ) { 
    // generate 2nd imagebuffer for debugging output
    job->tmp.ppo.p = (unsigned char *)malloc(job->src.p.y * job->src.p.x); 	
    // buffer
    assert(job->tmp.ppo.p);
    copybox(&job->src.p,
            0, 0, job->src.p.x, job->src.p.y,
            &job->tmp.ppo,
            job->src.p.x * job->src.p.y);
  }
#else
  job->tmp.ppo=job->src.p; /* temporarely, removed later */
#endif
  
  /* load character data base */
  if ( job->cfg.mode&2 )
    load_db();

  /* this is first step for reorganize the PG
     ---- look for letters, put rectangular frames around letters
     letter = connected points near color F
     should be used by dust removing (faster) and line detection!
     ---- 0..cs = black letters, last change = Mai99 */
  
  progress(8,pc); /* progress is only estimated */

  scan_boxes( pp );
  if ( !job->res.numC ){ 
    fprintf( stderr,"# no boxes found - stopped\n" );
    if(job->cfg.verbose&32) debug_img("out01",job,8);
    /***** should free stuff, etc) */
    return(1);
  }
  // if (job->cfg.verbose&32) debug_img("out00",job,4+8);

  progress(10,pc); /* progress is only estimated */
  // if(job->cfg.verbose&32) debug_img("out01",job,4+8);
  // output_list(job);  // for debugging 
  // ToDo: matrix printer preprocessing

  remove_dust( job ); /* from the &(job->res.boxlist)! */
// if(job->cfg.verbose&32) debug_img("out02",job,4+8);
// output_list(job);  // for debugging 
  smooth_borders( job ); /* only for big chars */
  progress(12,pc); /* progress is only estimated */
// if(job->cfg.verbose&32) debug_img("out03",job,4+8);
// output_list(job);  // for debugging 

  detect_barcode( job );  /* mark barcode */
// if(job->cfg.verbose&32) debug_img("out04",job,4+8);
// output_list(job);  // for debugging 

  detect_pictures( job ); /* mark pictures */
//  if(job->cfg.verbose&32) debug_img("out05",job,4+8);
// output_list(job);  // for debugging 

  remove_pictures( job ); /* do this as early as possible, before layout */
//  if(job->cfg.verbose&32) debug_img("out06",job,4+8);
// output_list(job);  // for debugging

  glue_holes_inside_chars( pp ); /* including count subboxes (holes)  */

  detect_rotation_angle( job );

#if 1 		/* Rotate the whole picture! move boxes */
  if( job->res.lines.dy!=0 ){  // move down lowest first, move up highest first
    // in work! ??? (at end set dy=0) think on ppo!
  }
#endif
  detect_text_lines( pp, job->cfg.mode ); /* detect and mark JOB->tmp.ppo */
// if(job->cfg.verbose&32) debug_img("out07",job,4+8);
  progress(20,pc); /* progress is only estimated */

  add_line_info(/* &(job->res.boxlist) */);
  if (job->cfg.verbose&32) debug_img("out10",job,4+8);

  divide_vert_glued_boxes( pp, job->cfg.mode); /* after add_line_info, before list_sort! */
//  if(job->cfg.verbose&32) debug_img("out11",job,0);

  remove_melted_serifs( pp ); /* make some corrections on pixmap */
  /* list_ins seems to sort in the boxes on the wrong place ??? */
//  if(job->cfg.verbose&32) debug_img("out12",job,4+8);

  glue_broken_chars( pp ); /* 2nd glue */
//  if(job->cfg.verbose&32) debug_img("out14",job,4+8);

  remove_rest_of_dust( );
//  if(job->cfg.verbose&32) debug_img("out15",job,4+8);

  /* better sort after dust is removed (slow for lot of pixels) */ 
  list_sort(&(job->res.boxlist), sort_box_func);

  measure_pitch( job );

  if(job->cfg.mode&64) find_same_chars( pp );
  progress(30,pc); /* progress is only estimated */
//  if(job->cfg.verbose&32) debug_img("out16",job,4+8);

  char_recognition( pp, job->cfg.mode);
  progress(60,pc); /* progress is only estimated */
//  if(job->cfg.verbose&32) debug_img("out17",job,4+8);

  if ( adjust_text_lines( pp, job->cfg.mode ) ) { /* correct using chars */
    /* may be, characters/pictures have changed line number */
    list_sort(&(job->res.boxlist), sort_box_func);
    // 2nd recognition call if lines are adjusted
    char_recognition( pp, job->cfg.mode);
  }

#define BlownUpDrawing 1     /* german: Explosionszeichnung, temporarly */
#if     BlownUpDrawing == 1  /* german: Explosionszeichnung */
{ /* just for debugging */
  int i,ii,ni; struct box *box2;
  i=ii=ni=0;
  for_each_data(&(JOB->res.boxlist)) { /* count boxes */
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->c==UNKNOWN)  i++;
    if (box2->c==PICTURE) ii++;
    ni++;
  } end_for_each(&(JOB->res.boxlist)); 
  if (JOB->cfg.verbose)
    fprintf(stderr,"# debug: unknown= %d picts= %d boxes= %d\n",i,ii,ni);
}
#endif
  // ----------- write out20.pgm ----------- mark lines + boxes
  if (job->cfg.verbose&32) debug_img("out20",job,1+4+8);

  compare_unknown_with_known_chars( pp, job->cfg.mode);
  progress(70,pc); /* progress is only estimated */

  try_to_divide_boxes( pp, job->cfg.mode);
  progress(80,pc); /* progress is only estimated */

  /* --- list output ---- for debugging --- */
  if (job->cfg.verbose&6) output_list(job);

  /* ---- insert spaces ---- */
  list_insert_spaces( pp , job );

  // ---- proof difficult chars Il1 by context view ----
  if (JOB->cfg.verbose)
    fprintf(stderr,"# context correction if !(mode&32)\n");
  if (!(job->cfg.mode&32)) context_correction( job );
  
  store_boxtree_lines( job->cfg.mode );
  progress(90,pc); /* progress is only estimated */

/* 0050002.pgm.gz ca. 109 digits, only 50 recognized (only in lines?)
 * ./gocr -v 39 -m 56 -e - -m 4 -C 0-9 -f XML tmp0406/0050002.pbm.gz
 *  awk 'BEGIN{num=0}/1<\/box>/{num++;}END{print num}' o
 * 15*0 24*1 18*2 19*3 15*4 6*5 6*6 6*7 4*8 8*9 sum=125digits counted boxes
 *  9*0 19*1 14*2 15*3 11*4 6*5 5*6 6*7 4*8 8*9 sum=97digits recognized
 * 1*1 1*7 not recognized (Oct04)
 *  33*SPC 76*NL = 109 spaces + 36*unknown sum=241 * 16 missed
 */
#if     BlownUpDrawing == 1  /* german: Explosionszeichnung */
{ /* just for debugging */
  int i,ii,ni; struct box *box2; const char *testc="0123456789ABCDEFGHIJK";
    i=ii=ni=0;
  for_each_data(&(JOB->res.boxlist)) { /* count boxes */
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    if (box2->c==UNKNOWN)  i++;
    if (box2->c==PICTURE) ii++;
    if (box2->c>' ' && box2->c<='z') ni++;
  } end_for_each(&(JOB->res.boxlist)); 
  if(JOB->cfg.verbose)
    fprintf(stderr,"# debug: (_)= %d picts= %d chars= %d",i,ii,ni);
  for (i=0;i<20;i++) {
    ni=0;
    for_each_data(&(JOB->res.boxlist)) { /* count boxes */
      box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
      if (box2->c==testc[i]) ni++;
    } end_for_each(&(JOB->res.boxlist)); 
    if(JOB->cfg.verbose && ni>0)
      fprintf(stderr," (%c)=%d",testc[i],ni);
  }
  if(JOB->cfg.verbose)
    fprintf(stderr,"\n");
}
#endif

  // ---- frame-size-histogram
  // ---- (my own defined) distance between letters
  // ---- write internal picture of textsite
  // ----------- write out30.pgm -----------
  if( job->cfg.verbose&32 ) debug_img("out30",job,2+4);
    
  progress(100,pc); /* progress is only estimated */

  close_progress(pc);
  
  return 0; 	/* what should I return? error-state? num-of-chars? */
}
