#ifndef _OCR0_H
#define _OCR0_H
#include "pgm2asc.h"

/* ----------------------------------------------------------------
   - functions with thousand of lines make the compilation very slow
     therefore the ocr0-function is splitted in subfunctions
   - shared data used often in ocr0-subroutines are stored
     in ocr0_shared structure.
 *  ------------------------------------------------------------  */

typedef struct ocr0_shared {  /* shared variables and properties */

  struct box *box1;  /* box in whole image */
  pix *bp;           /* extracted temporarly box, cleaned */
  int cs;            /* global threshold value (gray level) */

                      /* ToDo: or MACROS: X0 = box1->x0 */
  int x0, x1, y0, y1; /* box coordinates related to box1 */
  int dx, dy;         /* size of box */
  int hchar, gchar;   /* relation to m1..m4 */
  int aa[4][4];       /* corner points, see xX (x,y,dist^2,vector_idx) v0.41 */
  holes_t holes;      /* list of holes (max MAX_HOLES) */

} ocr0_shared_t;

/* tests for umlaut */
int testumlaut(struct box *box1, int cs, int m, wchar_t *modifier);
/* detect chars */
wchar_t ocr0(struct box *box1, pix  *b, int cs);
/* detect numbers */
wchar_t ocr0n(ocr0_shared_t *sdata);

static int sq(int x) { return x*x; } /* square */

/*
 * go from vector j1 to vector j2 and measure maximum deviation of
 *   the steps from the line connecting j1 and j2
 * return the squared maximum distance
 *   in units of the box size times 1024
 */ 
int line_deviation( struct box *box1, int j1, int j2 );

/*
 * search vectors between j1 and j2 for nearest point a to point r 
 * example:
 * 
 *     r-> $$...$$   $ - mark vectors
 *         @@$..@@   @ - black pixels
 *         @@$..@@   . - white pixels
 *         @@@@.$@
 *     a-> @@$@$@@
 *         @$.@@@@
 *         @@..$@@
 *         @@..$@@
 *  j1 --> $$...$$ <-- j2
 *     
 * ToDo: vector aa[5] = {rx,ry,x,y,d^2,idx} statt rx,ry?
 *          j1 and j2 must be in the same frame
 *          return aa?
 */
int nearest_frame_vector( struct box *box1, int j1, int j2, int rx, int ry);
#endif
