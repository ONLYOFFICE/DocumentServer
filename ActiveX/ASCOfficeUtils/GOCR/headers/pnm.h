/* Handle PNM-files  Dez98 JS
 * 0,0 = left up
 * PAM-formats
 * PAM any  P7  
 * PNM-formats
 * PGM gray ASCII=P2 RAW=P5 dx dy col gray
 * PPM RGB  ASCII=P3 RAW=P6 dx dy col RGB
 * PBM B/W  ASCII=P1 RAW=P4 dx dy     bitmap
 */

#ifndef GOCR_PNM_H
#define GOCR_PNM_H 1

#include "config.h"

struct pixmap {
   unsigned char *p;	/* pointer of image buffer (pixmap) */
   int x;		/* xsize */
   int y;		/* ysize */
   int bpp;		/* bytes per pixel:  1=gray 3=rgb */
 };
typedef struct pixmap pix;

/* return 1 on multiple images (holding file open), 0 else */
int readpgm(char *name, pix *p, int vvv);
/* return 1 on multiple images (holding file open), 0 else */
int readpgmFromBuffer(char* buffer, long size, pix *p);

/* write pgm-map to pnm-file */
int writepgm(char *nam, pix *p);
int writepbm(char *nam, pix *p);
int writeppm(char *nam, pix *p); /* use lowest 3 bits for farbcoding */

/* ----- count colors ------ create histogram ------- */
void makehisto(pix p, unsigned col[256], int vvv);

#endif
