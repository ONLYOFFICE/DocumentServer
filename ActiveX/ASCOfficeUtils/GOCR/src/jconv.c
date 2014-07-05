/* OCR Aug00 JS
// PGM gray ASCII=P2 RAW=P5
// PPM RGB  ASCII=P3 RAW=P6
// PBM B/W  ASCII=P1 RAW=P4
// ToDo: 
//  - pbm-raw to pgm also for x!=0 (mod 8) 
// v0.01 bug eliminated
// v0.02 convert renamed into jconv because ImageMagick uses same name 
// v0.03 code review bbg
// program is not used anymore, use "convert -verbose -crop 0x0+1+1" instead
*/ 

// #include <iostream.h>
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>
#include "pnm.h"
#ifdef HAVE_PAM_H
# include <pam.h>
#endif
#include "pcx.h"
#include "tga.h"

void help( void ) {
  printf("jconv version Aug2000 JS (pnm-raw,pcx8,tga24)\n"
	 "use: jconv [options] ?infile.pnm? ?outfile.pgm? ?ox? ?oy? ?dx? ?dy?\n"
	 "options: -shrink -pbm -? -help\n"
	 "example: jconv -shrink -pbm font.pbm font.pbm 0 0 0 0\n");
  exit(1);
}

int main(int argn, char *argv[])
{
  char *inam, *onam;
  pix bild;
  int ox, oy, dx, dy, x, y, i, vvv = 0;

#ifdef HAVE_PAM_H
  pnm_init(&argn, argv);
#endif
  // skip options
  for (i = 1; i < argn; i++) {
    if (argv[i][0] != '-')
      break;
    if (!strcmp(argv[i], "-?"))
      help();
    else if (!strcmp(argv[i], "-help"))
      help();
    else if (!strcmp(argv[i], "-shrink"))
      vvv |= 2;
    else if (!strcmp(argv[i], "-pbm"))
      vvv |= 4;
    else
      printf("unknown option: %s\n", argv[i]);
  }

  if (argn - i != 6)
    help();
  inam = argv[i++];
  onam = argv[i++];
  ox = atoi(argv[i++]);
  oy = atoi(argv[i++]);
  dx = atoi(argv[i++]);
  dy = atoi(argv[i++]);
  printf("# in=%s out=%s offs=%d,%d len=%d,%d vvv=%d\n",
	 inam, onam, ox, oy, dx, dy, vvv);

  // ----- read picture
  if (strstr(inam, ".pbm") ||
      strstr(inam, ".pgm") ||
      strstr(inam, ".ppm") ||
      strstr(inam, ".pnm") ||
      strstr(inam, ".pam"))
    readpgm(inam, &bild, 1);
  else if (strstr(inam, ".pcx"))
    readpcx(inam, &bild, 1);
  else if (strstr(inam, ".tga"))
    readtga(inam, &bild, ((vvv > 1) ? 0 : 1));
  else {
    printf("Error: unknown suffix\n");
    exit(1);
  }
  if (ox < 0 || ox >= bild.x)
    ox = 0;
  if (oy < 0 || ox >= bild.y)
    oy = 0;
  if (dx <= 0 || ox + dx > bild.x)
    dx = bild.x - ox;
  if (dy <= 0 || oy + dy > bild.y)
    dy = bild.y - oy;
  if ((vvv & 2) == 2 && bild.bpp == 1) {	// -shrink
    int x, y;
    printf("# shrinking PGM:   offs=%d,%d len=%d,%d\n", ox, oy, dx, dy);
    for (y = 0; y < dy; y++) {	// shrink upper border
      for (x = 0; x < dx; x++)
	if (bild.p[x + ox + (y + oy) * bild.x] < 127)
	  break;
      if (x < dx) {
	if (y > 0)
	  y--;
	oy += y;
	dy -= y;
	break;
      }
    }
    for (y = 0; y < dy; y++) {	// shrink lower border
      for (x = 0; x < dx; x++)
	if (bild.p[ox + x + (oy + dy - y - 1) * bild.x] < 127)
	  break;
      if (x < dx) {
	if (y > 0)
	  y--;
	dy -= y;
	break;
      }
    }
    for (x = 0; x < dx; x++) {	// shrink left border
      for (y = 0; y < dy; y++)
	if (bild.p[x + ox + (y + oy) * bild.x] < 127)
	  break;
      if (y < dy) {
	if (x > 0)
	  x--;
	ox += x;
	dx -= x;
	break;
      }
    }
    for (x = 0; x < dx; x++) {	// shrink right border
      for (y = 0; y < dy; y++)
	if (bild.p[ox + dx - x - 1 + (oy + y) * bild.x] < 127)
	  break;
      if (y < dy) {
	if (x > 0)
	  x--;
	dx -= x;
	break;
      }
    }
  }
  printf("# final dimension: offs=%d,%d len=%d,%d bpp=%d\n",
	 ox, oy, dx, dy, bild.bpp);

/* bbg: could be changed to memmoves */
  // ---- new size
  for (y = 0; y < dy; y++)
    for (x = 0; x < dx; x++)
      for (i = 0; i < 3; i++)
	bild.p[i + bild.bpp * (x + dx * y)] =
	  bild.p[i + bild.bpp * (x + ox + (y + oy) * bild.x)];
  bild.x = dx;
  bild.y = dy;
  // ---- write internal picture of textsite 
  printf("# write %s\n", onam);
  if (strstr(onam, ".pbm"))
    writepbm(onam, &bild);
  else if (strstr(onam, ".pgm"))
    writepgm(onam, &bild);
  else if (strstr(onam, ".ppm"))
    writeppm(onam, &bild);
  else if (strstr(onam, ".pnm"))
    writepgm(onam, &bild);
  else
    printf("Error: unknown suffix");
  free( bild.p );
}
