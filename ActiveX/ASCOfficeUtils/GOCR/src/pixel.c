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

 Joerg.Schulenburg@physik.uni-magdeburg.de */

/* Filter by tree, filter by number methods added by
 * William Webber, william@williamwebber.com. */

#include "pgm2asc.h"
#include <assert.h>
#include <string.h>

/*
 * Defining this causes assert() calls to be turned off runtime.
 *
 * This is normally taken care of by make.
 */
/* #define NDEBUG */

// ------------------ (&~7)-pixmap-functions ------------------------
 
/* test if pixel marked?
 * Returns: 0 if not marked, least 3 bits if marked.
 */
int marked (pix * p, int x, int y) {
  if (x < 0 || y < 0 || x >= p->x || y >= p->y)
    return 0;
  return (pixel_atp(p, x, y) & 7);
}

#define Nfilt3 6 /* number of 3x3 filter */
/*
 * Filters to correct possible scanning or image errors.
 *
 * Each of these filters represents a 3x3 pixel area.
 * 0 represents a white or background pixel, 1 a black or
 * foreground pixel, and 2 represents a pixel of either value.
 * Note that this differs from the meaning of pixel values in
 * the image, where a high value means "white" (background),
 * and a low value means "black" (foreground).
 *
 * These filters are applied to the 3x3 environment of a pixel
 * to be retrieved from the image, centered around that pixel
 * (that is, the to-be-retrieved pixel corresponds with the
 * the fifth position of the filter).
 * If the filter matches that pixel environment, then
 * the returned value of the pixel is inverted (black->white
 * or white->black).
 *
 * So, for instance, the second filter below matches this
 * pattern:
 *
 *      000
 *      X0X
 *      000
 *
 * and "fills in" the middle (retrieved) pixel to rejoin a line
 * that may have been broken by a scanning or image error.
 */
const char filt3[Nfilt3][9]={ 
  {0,0,0, 0,0,1, 1,0,0}, /* (-1,-1) (0,-1) (1,-1)  (-1,0) (0,0) ... */
  {0,0,0, 1,0,1, 0,0,0},
  {1,0,0, 0,0,1, 0,0,0},
  {1,1,0, 0,1,0, 2,1,1},
  {0,0,1, 0,0,0, 2,1,0},
  {0,1,0, 0,0,0, 1,2,0}
};
/* 2=ignore_pixel, 0=white_background, 1=black_pixel */


/* 
 * Filter by matrix uses the above matrix of filters directly.  Pixel
 *   environments to be filtered are compared pixel by pixel against
 *   these filters.
 * 
 * Filter by number converts these filters into integer representations
 *   and stores them in a table.  Pixel environments are similarly
 *   converted to integers, and looked up in the table.
 *
 * Filter by tree converts these filters into a binary tree.  Pixel
 *   environments are matched by traversing the tree.
 *
 * A typical performance ratio for these three methods is 20:9:7
 *   respectively (i.e., the tree method takes around 35% of the
 *   time of the matrix method).
 */
#define FILTER_BY_MATRIX 0
#define FILTER_BY_NUMBER 1
#define FILTER_BY_TREE 2

#define FILTER_METHOD FILTER_BY_TREE

/*
 * Defining FILTER_CHECKED causes filter results from either the tree
 * or the number method to be checked against results of the other
 * two methods to ensure correctness.  This is for bug checking purposes
 * only.
 */
/* #define FILTER_CHECKED */

/*
 * Defining FILTER_STATISTICS causes statistics to be kept on how many
 * times the filters are tried, how many times a filter matches, and
 * of these matches how many flip a black pixel to white, and how many
 * the reverse.  These statistics are printed to stderr at the end of
 * the program run.  Currently, statistics are only kept if the tree
 * filter method is being used.
 */
/* #define FILTER_STATISTICS */

#ifdef FILTER_STATISTICS
static int filter_tries = 0;
static int filter_matches = 0;
static int filter_blackened = 0;
static int filter_whitened = 0;
#endif

#ifdef FILTER_STATISTICS
void print_filter_stats() {
  fprintf(stderr, "\n# Error filter statistics: tries %d, matches %d, "
      "blackened %d, whitened %d\n",
      filter_tries, filter_matches, filter_blackened, filter_whitened);
}
#endif

#if FILTER_METHOD == FILTER_BY_MATRIX || defined(FILTER_CHECKED)
/*
 * Filter the pixel at (x,y) by directly applying the matrix.
 */
int pixel_filter_by_matrix(pix * p, int x, int y) {
  int i;
  static char c33[9];
  memset(c33, 0, sizeof(c33));
  /* copy environment of a point (only highest bit)
bbg: FASTER now. It has 4 ifs less at least, 8 at most. */
  if (x > 0) {	c33[3] = pixel_atp(p,x-1, y )>>7;
    if (y > 0)	c33[0] = pixel_atp(p,x-1,y-1)>>7;
    if (y+1 < p->y)	c33[6] = pixel_atp(p,x-1,y+1)>>7;
  }
  if (x+1 < p->x) {	c33[5] = pixel_atp(p,x+1, y )>>7;
    if (y > 0)	c33[2] = pixel_atp(p,x+1,y-1)>>7;
    if (y+1 < p->y)	c33[8] = pixel_atp(p,x+1,y+1)>>7;
  }
  if (y > 0)		c33[1] = pixel_atp(p, x ,y-1)>>7;
  c33[4] = pixel_atp(p, x , y )>>7;
  if (y+1 < p->y)	c33[7] = pixel_atp(p, x ,y+1)>>7;

  /* do filtering */
  for (i = 0; i < Nfilt3; i++)
    if( ( (filt3[i][0]>>1) || c33[0]!=(1 & filt3[i][0]) )
        && ( (filt3[i][1]>>1) || c33[1]!=(1 & filt3[i][1]) )
        && ( (filt3[i][2]>>1) || c33[2]!=(1 & filt3[i][2]) ) 
        && ( (filt3[i][3]>>1) || c33[3]!=(1 & filt3[i][3]) )
        && ( (filt3[i][4]>>1) || c33[4]!=(1 & filt3[i][4]) )
        && ( (filt3[i][5]>>1) || c33[5]!=(1 & filt3[i][5]) ) 
        && ( (filt3[i][6]>>1) || c33[6]!=(1 & filt3[i][6]) )
        && ( (filt3[i][7]>>1) || c33[7]!=(1 & filt3[i][7]) )
        && ( (filt3[i][8]>>1) || c33[8]!=(1 & filt3[i][8]) ) ) {
      return ((filt3[i][4])?JOB->cfg.cs:0);
    }
  return pixel_atp(p, x, y) & ~7;
}
#endif

#if FILTER_METHOD == FILTER_BY_NUMBER || defined(FILTER_CHECKED)

#define NUM_TABLE_SIZE 512  /* max value of 9-bit value */
/*
 * Recursively generates entries in the number table for a matrix filter.
 *
 * gen_num_filt is the number representation of the matrix filter.
 * This generation is handled recursively because this is the easiest
 * way to handle 2 (either value) entries in the filter, which lead
 * to 2 distinct entries in the number table (one for each alternate
 * value).
 */
void rec_generate_number_table(char * num_table, const char * filter,
    int i, unsigned short gen_num_filt) {
  if (i == 9) {
    /* Invert the value of the number representation, to reflect the
     * fact that the "white" is 0 in the filter, 1 (high) in the image. */
    gen_num_filt = ~gen_num_filt;
    gen_num_filt &= 0x01ff;
    assert(gen_num_filt < NUM_TABLE_SIZE);
    num_table[gen_num_filt] = 1;
  } else {
    if (filter[i] == 0 || filter[i] == 2)
      rec_generate_number_table(num_table, filter, i + 1, gen_num_filt);
    if (filter[i] == 1 || filter[i] == 2) {
      gen_num_filt |= (1 << (8 - i));
      rec_generate_number_table(num_table, filter, i + 1, gen_num_filt);
    }
  }
}

/*
 * Filter the pixel at (x, y) using a number table.
 *
 * Each filter can be converted into a 9-bit representation, where
 * filters containing 2 (either value) pixels are converted into
 * a separate numerical representation for each pixel, where position
 * i in the filter corresponds to bit i in the number.  Each resulting
 * numerical representation N is represented as a 1 value in the Nth
 * position of a lookup table.  A pixel's environment is converted in
 * the same way to a numeric representation P, and that environment
 * matches a filter if num_table[P] == 1.
 */
int pixel_filter_by_number(pix * p, int x, int y) {
  unsigned short val = 0;
  static char num_table[NUM_TABLE_SIZE];
  static int num_table_generated = 0;
  if (!num_table_generated) {
    int f;
    memset(num_table, 0, sizeof(num_table));
    for (f = 0; f < Nfilt3; f++)
      rec_generate_number_table(num_table, filt3[f], 0, 0);
    num_table_generated = 1;
  }

  /* calculate a numeric value for the 3x3 square around the pixel. */
  if (x > 0) {	val |= (pixel_atp(p,x-1, y )>>7) << (8 - 3);
    if (y > 0)	val |= (pixel_atp(p,x-1,y-1)>>7) << (8 - 0);
    if (y+1 < p->y)	val |= (pixel_atp(p,x-1,y+1)>>7) << (8 - 6);
  }
  if (x+1 < p->x) {	val |= (pixel_atp(p,x+1, y )>>7) << (8 - 5);
    if (y > 0)	val |= (pixel_atp(p,x+1,y-1)>>7) << (8 - 2);
    if (y+1 < p->y)	val |= (pixel_atp(p,x+1,y+1)>>7) << (8 - 8);
  }
  if (y > 0)		val |= (pixel_atp(p, x ,y-1)>>7) << (8 - 1);
  val |= (pixel_atp(p, x , y )>>7) << (8 - 4);
  if (y+1 < p->y)	val |= (pixel_atp(p, x ,y+1)>>7) << (8 - 7);
  assert(val < NUM_TABLE_SIZE);

  if (num_table[val])
      return (val & (1 << 4)) ? 0 : JOB->cfg.cs;
  else
    return pixel_atp(p, x, y) & ~7;
}
#endif

#if FILTER_METHOD == FILTER_BY_TREE || defined(FILTER_CHECKED)

#define TREE_ARRAY_SIZE 1024  
/* 1+ number of nodes in a complete binary tree of height 10 */

/*
 * Recursively generate a tree representation of a filter.
 */
void rec_generate_tree(char * tree, const char * filter, int i, int n) {
  assert(i >= 0 && i <= 9);
  assert(n < TREE_ARRAY_SIZE);
  if (i == 9) {
    if (filter[4] == 0)
      tree[n] = 2;
    else
      tree[n] = 1;
    return;
  }
  /* first iteration has n == -1, does not set any values of the tree,
     just to find whether to start to the left or the right */
  if (n != -1)
    tree[n] = 1;
  if (filter[i] == 0)
    rec_generate_tree(tree, filter, i + 1, n * 2 + 2);
  else if (filter[i] == 1)
    rec_generate_tree(tree, filter, i + 1, n * 2 + 3);
  else {
    rec_generate_tree(tree, filter, i + 1, n * 2 + 2);
    rec_generate_tree(tree, filter, i + 1, n * 2 + 3);
  }
}

/*
 * Filter the pixel at (x, y) using the tree method.
 *
 * Each filter is represented by a single branch of a binary
 * tree, except for filters contain "either value" entries, which
 * bifurcate at that point in the branch.  Each white pixel in the filter
 * is a left branch in the tree, each black pixel a right branch.  The
 * final node of a branch indicates whether this filter turns a white
 * pixel black, or a black one white.
 *
 * We match a pixel's environment against this tree by similarly
 * using the pixels in that environment to traverse the tree.  If
 * we run out of nodes before getting to the end of a branch, then
 * the environment doesn't match against any of the filters represented
 * by the tree.  Otherwise, we return the value specified by the
 * final node.
 *
 * Since the total tree size, even including missing nodes, is small
 * (2 ^ 10), we can use a standard array representation of a binary
 * tree, where for the node tree[n], the left child is tree[2n + 2],
 * and the right tree[2n + 3].  The only information we want
 * from a non-leaf node is whether it exists (that is, is part of
 * a filter-representing branch).  We represent this with the value
 * 1 at the node's slot in the array, the contrary by 0.  For the
 * leaf node, 0 again represents non-existence, 1 that the filter
 * represented by this branch turns a black pixel white, and 2 a
 * white pixel black.
 */
int pixel_filter_by_tree(pix * p, int x, int y) {
  static char tree[TREE_ARRAY_SIZE];
  static int tree_generated = 0;
  int n;
  int pixel_val = pixel_atp(p, x, y) & ~7;
#ifdef FILTER_STATISTICS
  static int registered_filter_stats = 0;
  if (!registered_filter_stats) {
    atexit(print_filter_stats);
    registered_filter_stats = 1;
  }
  filter_tries++;
#endif  /* FILTER_STATISTICS */
  if (!tree_generated) {
    int f;
    memset(tree, 0, sizeof(tree));
    for (f = 0; f < Nfilt3; f++) {
      const char * filter = filt3[f];
      rec_generate_tree(tree, filter, 0, -1);
    } 
    tree_generated = 1;
  }
  n = -1;

  /* Note that for the image, low is black, high is white, whereas
   * for the filter, 0 is white, 1 is black.  For the image, then,
   * high (white) means go left, low (black) means go right. */

#define IS_BLACK(_dx,_dy) !(pixel_atp(p, x + (_dx), y + (_dy)) >> 7)
#define IS_WHITE(_dx,_dy) (pixel_atp(p, x + (_dx), y + (_dy)) >> 7)
#define GO_LEFT n = n * 2 + 2
#define GO_RIGHT n = n * 2 + 3
#define CHECK_NO_MATCH if (tree[n] == 0) return pixel_val

  /* Top row */
  if (y == 0) {
    /* top 3 pixels off edge == black == right
       n = 2 * (2 * (2 * -1 + 3) + 3) + 3 = 13 */
    n = 13;
  } else {
    if (x == 0 || IS_BLACK(-1, -1)) 
      GO_RIGHT;
    else  
      GO_LEFT;

    if (IS_WHITE(0, -1)) 
      GO_LEFT;
    else  
      GO_RIGHT;
    CHECK_NO_MATCH;

    if (x + 1 == p->x || IS_BLACK(+1, -1))
      GO_RIGHT;
    else 
      GO_LEFT;
    CHECK_NO_MATCH;
  }

  /* Second row */
  if (x == 0 || IS_BLACK(-1, 0)) 
    GO_RIGHT;
  else 
    GO_LEFT;
  CHECK_NO_MATCH;

  if (IS_WHITE(0, 0)) 
    GO_LEFT;
  else
    GO_RIGHT;
  CHECK_NO_MATCH;

  if (x + 1 == p->x || IS_BLACK(+1, 0)) 
    GO_RIGHT;
  else 
    GO_LEFT;
  CHECK_NO_MATCH;

  /* bottom row */
  if (y + 1 == p->y) {
    /* bottom 3 pixels off edge == black == right
       n' = 2 * (2 * (2n + 3) + 3) + 3 
          = 2 * (4n + 9) + 3
          = 8n + 21 */
    n = 8 * n + 21;
  } else {
    if (x == 0 || IS_BLACK(-1, +1)) 
      GO_RIGHT;
    else 
      GO_LEFT;
    CHECK_NO_MATCH;

    if (IS_WHITE(0, 1)) 
      GO_LEFT;
    else  
      GO_RIGHT;
    CHECK_NO_MATCH;

    if (x + 1 == p->x || IS_BLACK(+1, +1)) 
      GO_RIGHT;
    else 
      GO_LEFT;
  }
  assert(n < TREE_ARRAY_SIZE);
  assert(tree[n] == 0 || tree[n] == 1 || tree[n] == 2);
  CHECK_NO_MATCH;
#ifdef FILTER_STATISTICS
  filter_matches++;
#endif
  if (tree[n] == 1) {
#ifdef FILTER_STATISTICS
    if (pixel_atp(p, x, y) < JOB->cfg.cs)
      filter_whitened++;
#endif
    return JOB->cfg.cs;
  } else {
#ifdef FILTER_STATISTICS
    if (pixel_atp(p, x, y) >= JOB->cfg.cs)
      filter_blackened++;
#endif
    return 0;
  }
}
#endif /* FILTER_METHOD == FILTER_BY_TREE */

/*
 *  This simple filter attempts to correct "fax"-like scan errors.
 */
int pixel_faxfilter(pix *p, int x, int y) {
    int r; // filter
    r = pixel_atp(p,x,y)&~7;
    /* {2,2,2, 2,0,1, 2,1,0} */
    if ((r&128) && (~pixel_atp(p,x+1, y )&128)
		&& (~pixel_atp(p, x ,y+1)&128)
		&& ( pixel_atp(p,x+1,y+1)&128)) 
	r = 64; /* faxfilter */

    else
    /* {2,2,2, 1,0,2, 0,1,2} */
    if ((r&128) && (~pixel_atp(p,x-1, y )&128)
		&& (~pixel_atp(p, x ,y+1)&128)
		&& ( pixel_atp(p,x-1,y+1)&128)) 
	r = 64; /* faxfilter */
    return r & ~7;
}

#ifdef FILTER_CHECKED
/*
 * Print out the 3x3 environment of a pixel as a 9-bit binary.
 *
 * For debugging purposes only.
 */
void print_pixel_env(FILE * out, pix * p, int x, int y) {
  int x0, y0;
  for (y0 = y - 1; y0 < y + 2; y0++) {
    for (x0 = x - 1; x0 < x + 2; x0++) {
      if (x0 < 0 || x0 >= p->x || y0 < 0 || y0 >= p->y)
        fputc('?', out);
      else if (pixel_atp(p, x0, y0) >> 7)
        fputc('0', out);
      else
        fputc('1', out);
    }
  }
}
#endif

/* this function is heavily used
 * test if pixel was set, remove low bits (marks) --- later with error-correction
 * result depends on n_run, if n_run>0 filter are used
 * Returns: pixel-color (without marks)
 */
int getpixel(pix *p, int x, int y){
  if ( x < 0 || y < 0 || x >= p->x || y >= p->y ) 
    return 255 & ~7;

  /* filter will be used only once later, when vectorization replaces pixel
   * processing 
   */
  if (JOB->tmp.n_run > 0) { /* use the filters (correction of errors) */
#if FILTER_METHOD == FILTER_BY_NUMBER
    int pix = pixel_filter_by_number(p, x, y);
#ifdef FILTER_CHECKED
    int pix2 = pixel_filter_by_matrix(p, x, y);
    if (pix != pix2) {
      fprintf(stderr, 
          "# BUG: pixel_filter: by number: %d; by matrix: %d, "
          "by atp %d; env: ", pix, pix2, pixel_atp(p, x, y) & ~7);
      print_pixel_env(stderr, p, x, y);
      fputc('\n', stderr);
    } 
#endif /* FILTER_CHECKED */
    return pix;
#elif FILTER_METHOD == FILTER_BY_MATRIX
    return pixel_filter_by_matrix(p, x, y);
#elif FILTER_METHOD == FILTER_BY_TREE
    int pix = pixel_filter_by_tree(p, x, y);
#ifdef FILTER_CHECKED
    int pix2 = pixel_filter_by_matrix(p, x, y);
    int pix3 = pixel_filter_by_number(p, x, y);
    if (pix != pix2 || pix != pix3) {
      fprintf(stderr, 
          "# BUG: pixel_filter: tree: %d; matrix: %d, "
          "number: %d, atp %d; env: ", pix, pix2, pix3, 
          pixel_atp(p, x, y) & ~7);
      print_pixel_env(stderr, p, x, y);
      fputc('\n', stderr);
    } 
#endif /* FILTER_CHECKED */
    return pix;
#else
#error FILTER_METHOD not defined
#endif /* FILTER_BY_NUMBER */
  }

  return (pixel_atp(p,x,y) & ~7);
}

/* modify pixel, test if out of range */
void put(pix * p, int x, int y, int ia, int io) {
  if (x < p->x && x >= 0 && y >= 0 && y < p->y)
    pixel_atp(p, x, y) = (pixel_atp(p, x, y) & ia) | io;
}
