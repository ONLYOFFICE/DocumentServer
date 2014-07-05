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

 the following code was send by Ryan Dibble <dibbler@umich.edu>
 
  The algorithm is very simple but works good hopefully.
 
  Compare the grayscale histogram with a mass density diagram:
  I think the algorithm is a kind of
  divide a body into two parts in a way that the mass 
  centers have the largest distance from each other,
  the function is weighted in a way that same masses have a advantage
  
  - otsu algorithm is failing on diskrete multi color images
  
  TODO:
    RGB: do the same with all colors (CMYG?) seperately 

    test: hardest case = two colors
       bbg: test done, using a two color gray file. Output:
       # threshold: Value = 43 gmin=43 gmax=188

 my changes:
   - float -> double
   - debug option added (vvv & 1..2)
   - **image => *image,  &image[i][1] => &image[i*cols+1]
   - do only count pixels near contrast regions
     this makes otsu much better for shadowed fonts or multi colored text 
     on white background

 (m) Joerg Schulenburg (see README for email address)

 ToDo:
   - measure contrast
   - detect low-contrast regions

 */

#include <stdio.h>
#include <string.h>

#define Abs(x) ((x<0)?-(x):x)

/*======================================================================*
 * global thresholding routine                                          *
 *   takes a 2D unsigned char array pointer, number of rows, and        *
 *   number of cols in the array. returns the value of the threshold    *
 * x0,y0,x0+dx,y0+dy are the edgepoints of the interesting region       *
 * vvv is the verbosity for debugging purpose                           * 
 *======================================================================*/
int
otsu (unsigned char *image, int rows, int cols,
      int x0, int y0, int dx, int dy, int vvv) {

  unsigned char *np;    // pointer to position in the image we are working with
  unsigned char op1, op2;   // predecessor of pixel *np (start value)
  int maxc=0;           // maximum contrast (start value) 
  int thresholdValue=1; // value we will threshold at
  int ihist[256];       // image histogram
  int chist[256];       // contrast histogram

  int i, j, k;          // various counters
  int is, i1, i2, ns, n1, n2, gmin, gmax;
  double m1, m2, sum, csum, fmax, sb;

  // zero out histogram ...
  memset(ihist, 0, sizeof(ihist));
  memset(chist, 0, sizeof(chist));
  op1=op2=0;

  gmin=255; gmax=0; k=dy/512+1;
  // v0.43 first get max contrast, dont do it together with next step
  //  because it failes if we have pattern as background (on top)
  for (i =  0; i <  dy ; i+=k) {
    np = &image[(y0+i)*cols+x0];
    for (j = 0; j < dx ; j++) {
      ihist[*np]++;
      if(*np > gmax) gmax=*np;
      if(*np < gmin) gmin=*np;
      if (Abs(*np-op1)>maxc) maxc=Abs(*np-op1); /* new maximum contrast */
      if (Abs(*np-op2)>maxc) maxc=Abs(*np-op2); /* new maximum contrast */
      /* we hope that maxc will be find its maximum very fast */
      op2=op1;    /* shift old pixel to next older */
      op1=*np;     /* store old pixel for contrast check */
      np++;       /* next pixel */
    }
  }

  // generate the histogram
  // Aug06 images with large white or black homogeneous
  //   areas give bad results, so we only add pixels on contrast edges
  for (i =  0; i <  dy ; i+=k) {
    np = &image[(y0+i)*cols+x0];
    for (j = 0; j < dx ; j++) {
      if (Abs(*np-op1)>maxc/4
       || Abs(*np-op2)>maxc/4)
         chist[*np]++; // count only relevant pixels
      op2=op1;    /* shift old pixel to next older */
      op1=*np;     /* store old pixel for contrast check */
      np++;       /* next pixel */
    }
  }

  // set up everything
  sum = csum = 0.0;
  ns = 0;
  is = 0;
  
  for (k = 0; k <= 255; k++) {
    sum += (double) k * (double) chist[k];  /* x*f(x) cmass moment */
    ns  += chist[k];                        /*  f(x)    cmass      */
    is  += ihist[k];                        /*  f(x)    imass      */
    // Debug: output to out_hist.dat?
    // fprintf(stderr,"\chistogram %3d %6d (brightness weight)", k, ihist[k]);
  }

  if (!ns) {
    // if n has no value we have problems...
    fprintf (stderr, "NOT NORMAL, thresholdValue = 160\n");
    return (160);
  }

  // ToDo: only care about extremas in a 3 pixel environment
  //       check if there are more than 2 mass centers (more colors)
  //       return object colors and color radius instead of threshold value
  //        also the reagion, where colored objects are found
  //       what if more than one background color? no otsu at all?
  //       whats background? box with lot of other boxes in it
  //       threshold each box (examples/invers.png,colors.png) 
  //  get maximum white and minimum black pixel color (possible range)
  //    check range between them for low..high contrast ???
  // typical scenes (which must be covered): 
  //    - white page with text of different colors (gray values)
  //    - binear page: background (gray=1) + black text (gray=0)
  //    - text mixed with big (dark) images
  //  ToDo: recursive clustering for maximum multipol moments?
  //  idea: normalize ihist to max=1024 before otsu?
  
  // do the otsu global thresholding method

  if ((vvv&1)) // Debug
     fprintf(stderr,"# threshold: value ihist chist mass_dipol_moment\n");
  fmax = -1.0;
  n1 = 0;
  for (k = 0; k < 255; k++) {
    n1 += chist[k];          // left  mass (integration)
    if (!n1) continue;       // we need at least one foreground pixel
    n2 = ns - n1;            // right mass (num pixels - left mass)
    if (n2 == 0) break;      // we need at least one background pixel
    csum += (double) k *chist[k];  // left mass moment
    m1 =        csum  / n1;        // left  mass center (black chars)
    m2 = (sum - csum) / n2;        // right mass center (white background)
    // max. dipol moment?
    // orig: sb = (double) n1 *(double) n2 * (m1 - m2) * (m1 - m2);
    sb = (double) n1 *(double) n2 * (m2 - m1); // seems to be better Aug06
    /* bbg: note: can be optimized. */
    if (sb > fmax) {
      fmax = sb;
      thresholdValue = k + 1;
      // thresholdValue = (m1 + 3 * m2) / 4;
    }
    if ((vvv&1) && ihist[k]) // Debug
     fprintf(stderr,"# threshold: %3d %6d %6d %8.2f\n",
       k, ihist[k], chist[k],
       sb/(dx*dy));  /* normalized dipol moment */
  }
  // ToDo: error = left/right point where sb is 90% of maximum?
  // now we count all pixels for background detection
  i1 = 0;
  for (k = 0; k < thresholdValue; k++) {
    i1 += ihist[k];          // left  mass (integration)
  }
  i2 = is - i1;            // right mass (num pixels - left mass)

  // at this point we have our thresholding value
  // black_char: value<cs,  white_background: value>=cs
  
  // can it happen? check for sureness
  if (thresholdValue >  gmax) {
    fprintf(stderr,"# threshold: Value >gmax\n");
    thresholdValue = gmax;
  }
  if (thresholdValue <= gmin) {
    fprintf(stderr,"# threshold: Value<=gmin\n");
    thresholdValue = gmin+1;
  }

  // debug code to display thresholding values
  if ( vvv & 1 )
  fprintf(stderr,"# threshold: Value = %d gmin=%d gmax=%d cmax=%d"
                 " b/w= %d %d\n",
     thresholdValue, gmin, gmax, maxc, i1, i2);

  // this is a primitive criteria for inversion and should be improved
  // old: i1 >= 4*i2, but 0811qemu1.png has a bit above 1/4 
  if (2*i1 > 7*i2) { // more black than white, obviously black is background
    if ( vvv & 1 )
      fprintf(stderr,"# threshold: invert the image\n");
    // we do inversion here (no data lost)
    for (i =  0; i <  dy ; i++) {
      np = &image[(y0+i)*cols+x0];
      for (j = 0; j < dx ; j++) {
        *np=255-*np;
        np++;       /* next pixel */
      }
    }
    thresholdValue=255-thresholdValue+1;
  }

  return(thresholdValue); 
  /* range: 0 < thresholdValue <= 255, example: 1 on b/w images */
  /* 0..threshold-1 is foreground */
  /* threshold..255 is background */
  /* ToDo:  min=blackmasscenter/2,thresh,max=(whitemasscenter+255)/2 */
}

/*======================================================================*/
/* thresholding the image  (set threshold to 128+32=160=0xA0)           */
/*   now we have a fixed thresholdValue good to recognize on gray image */
/*   - so lower bits can used for other things (bad design?)            */
/* ToDo: different foreground colors, gray on black/white background    */
/*======================================================================*/
int
thresholding (unsigned char *image, int rows, int cols,
  int x0, int y0, int dx, int dy, int thresholdValue) {

  unsigned char *np; // pointer to position in the image we are working with

  int i, j;          // various counters
  int gmin=255,gmax=0;
  int nmin=255,nmax=0;

  // calculate min/max (twice?)
  for (i = y0 + 1; i < y0 + dy - 1; i++) {
    np = &image[i*cols+x0+1];
    for (j = x0 + 1; j < x0 + dx - 1; j++) {
      if(*np > gmax) gmax=*np;
      if(*np < gmin) gmin=*np;
      np++; /* next pixel */
    }
  }
  
  /* allowed_threshold=gmin+1..gmax v0.43 */
  if (thresholdValue<=gmin || thresholdValue>gmax){
    thresholdValue=(gmin+gmax+1)/2; /* range=0..1 -> threshold=1 */
    fprintf(stderr,"# thresholdValue out of range %d..%d, reset to %d\n",
     gmin, gmax, thresholdValue);
  }

  /* b/w: min=0,tresh=1,max=1 v0.43 */
  // actually performs the thresholding of the image...
  //  later: grayvalues should also be used, only rescaling threshold=160=0xA0
  // sometimes images have no contrast (thresholdValue == gmin)
  for (i = y0; i < y0+dy; i++) {
    np = &image[i*cols+x0];
    for (j = x0; j < x0+dx; j++) {
      *np = (unsigned char) (*np >= thresholdValue || thresholdValue == gmin ?
         (255-(gmax - *np)* 80/(gmax - thresholdValue + 1)) :
         (  0+(*np - gmin)*150/(thresholdValue - gmin    )) );
      if(*np > nmax) nmax=*np;
      if(*np < nmin) nmin=*np;
      np++;
    }
  }

  // fprintf(stderr,"# thresholding:  nmin=%d nmax=%d\n", nmin, nmax);

  return(128+32); // return the new normalized threshold value
  /*   0..159 is foreground */
  /* 160..255 is background */
}

