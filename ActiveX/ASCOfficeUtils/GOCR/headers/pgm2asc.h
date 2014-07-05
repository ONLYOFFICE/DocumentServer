/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2006 Joerg Schulenburg

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
 
#ifndef PGM2ASC_H
#define PGM2ASC_H 1

#include "pnm.h"
#include "output.h"
#include "list.h"
#include "unicode.h"

#define pixel_at(pic, xx, yy)           (pic).p[(xx)+((yy)*((pic).x))]
#define pixel_atp(pic, xx, yy)          (pic)->p[(xx)+((yy)*((pic)->x))]

#ifndef HAVE_WCHAR_H
wchar_t *wcschr (const wchar_t *wcs, wchar_t wc);
wchar_t *wcscpy (wchar_t *dest, const wchar_t *src);
size_t wcslen (const wchar_t *s);
#endif
#ifndef HAVE_WCSDUP
wchar_t * wcsdup (const wchar_t *WS);	/* its a gnu extension */
#endif

/* declared in pgm2asc.c */
/* set alternate chars and its weight, called from the engine
    if a char is recognized to (weight) percent */
int setas(struct box *b, char *as, int weight);    /* string + xml */
int setac(struct box *b, wchar_t ac, int weight);  /* wchar */

/* for qsort() call */
int intcompare (const void *vr, const void *vs);

/* declared in box.c */
int box_gt(struct box *box1, struct box *box2);
int reset_box_ac(struct box *box);           /* reset and free char table */
struct box *malloc_box( struct box *inibox );   /* alloc memory for a box */
int free_box( struct box *box );                /* free memory of a box */
int copybox( pix *p, int x0, int y0, int dx, int dy, pix *b, int len);
int reduce_vectors ( struct box *box1, int mode );
int merge_boxes( struct box *box1, struct box *box2 );
int cut_box( struct box *box1);
  

/* declared in database.c */
int load_db(void);
wchar_t ocr_db(struct box *box1);

/* declared in detect.c */
int detect_lines1(pix * p, int x0, int y0, int dx, int dy);
int detect_lines2(pix *p,int x0,int y0,int dx,int dy,int r);
int detect_rotation_angle(job_t *job);
int detect_text_lines(pix * pp, int mo);
int adjust_text_lines(pix * pp, int mo);
int detect_pictures(job_t *job);

/* declared in lines.c */
void store_boxtree_lines( int mo );
   /* free memory for internal stored textlines.
    * Needs to be called _after_ having retrieved the text.
    * After freeing, no call to getTextLine is possible any
    * more
    */
void free_textlines( void );

   /* get result of ocr for a given line number.
    * If the line is out of range, the function returns 0,
    * otherwise a pointer to a complete line.
    */
const char *getTextLine( int );

	/* append a string (s1) to the string buffer (buffer) of length (len)
	* if buffer is to small or len==0 realloc buffer, len+=512
	*/
char *append_to_line(char *buffer, const char *s1, int *len);

/* declared in remove.c */
int remove_dust( job_t *job );
int remove_pictures( job_t *job);
int remove_melted_serifs( pix *pp );
int remove_rest_of_dust();
int smooth_borders( job_t *job );

/* declared in pixel.c */
int marked(pix * p, int x, int y);
int pixel(pix *p, int x, int y);
void put(pix * p, int x, int y, int ia, int io);

/* start ocr on a image in job.src.p */
int pgm2asc(job_t *job);

#endif
