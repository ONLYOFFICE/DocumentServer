/*
This is a Optical-Character-Recognition program
Copyright (C) 1999  Joerg Schulenburg

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

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

#include "tga.h"

typedef unsigned char byte;

// --- needed for reading TGA-files
#if 0
char read_b(FILE *f1){	// filter #-comments
  char c;
  c=fgetc(f1); assert(!feof(f1)); assert(!ferror(f1));
  return c;
}
#endif

//byte tga[18]={ 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,24,32};
/*  header_hex= 00 00 02 00 00 00 00 00 00 00 00 00 xl xh yl yh  
 *              18 20 -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

void readtga(char *name,pix *p,int mode){	 // see pcx.format.txt
						// mode: 0=gray,1=RGB
  int nx,ny,i,x,y;
  FILE *f1;  
  unsigned char *pic,h[18];

  f1=fopen(name,"rb"); if(!f1) fprintf(stderr," error opening file\n");
  assert(f1);		// open-error
  assert(fread(h,1,18,f1)==18);    /* 18 Byte lesen -> h[] */
  assert(h[ 0]== 0);	// TGA0
  assert(h[ 1]== 0);	// TGA1
  assert(h[ 2]== 2);	// TGA2 no run length encoding
  for(i=3;i<12;i++)
  assert(h[ i]== 0);	// ???
  assert(h[16]==0x18);	// TGA16
  assert(h[17]==0x20);	// TGA17
  nx = h[12] + (h[13]<<8);  /* x-dimension low high */
  ny = h[14] + (h[15]<<8);  /* y-dimension low high */
  fprintf(stderr,"# TGA version=%d x=%d y=%d", h[2],nx,ny );
  fflush(stdout);
  pic=(unsigned char *)malloc( 3*nx*ny );
  assert(pic!=NULL);				// no memory
  assert(ny==(int)fread(pic,3*nx,ny,f1));	// read all lines BGR
  if(mode==0)
  {
    for(y=0;y<ny;y++)	/* BGR => gray */
    for(x=0;x<nx;x++)
    {  i=x+y*nx; pic[i]=(pic[i*3+0]+pic[i*3+1]+pic[i*3+2])/3; }
  }
  else
  if(mode==1)
  {
    byte b;
    for(y=0;y<ny;y++)	/* BGR => RGB */
    for(x=0;x<nx;x++)
    {  i=x+y*nx; b=pic[i*3+0]; pic[i*3+0]=pic[i*3+2]; pic[i*3+2]=b; }
  }
  else assert(0);		// wrong mode
  fclose(f1);
  p->p=pic;  p->x=nx;  p->y=ny; p->bpp=1+2*mode;
  fprintf(stderr," mode=%d\n",mode);
}

// ------------------------------------------------------------------------

