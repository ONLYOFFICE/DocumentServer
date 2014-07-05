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
/* plan: use popen("ppm2pcx -packed ...","w"); for writing pcx */

#include <stdio.h>
#include <stdlib.h>
/* #include <assert.h> */

#include "pcx.h"

typedef unsigned char byte;

#define ERR(x) { fprintf(stderr,"ERROR "__FILE__" L%d: " x "\n",__LINE__);exit(1);}

int err;
/* --- needed for reading PCX-files */
unsigned char read_b(FILE *f1){
  unsigned char c=0; c=fgetc(f1); if(feof(f1) || ferror(f1))err=1; return c;
}

/* something here is wrong! */
void readpcx(char *name,pix *p,int vvv){  /* see pcx.format.txt */
  int page,pages,nx,ny,i,j,b,x,y,bpl,bits,pal[256][3];
  FILE *f1;
  unsigned char *pic,h[128],bb,b1,b2,b3;
  err=0;
  for(i=0;i<256;i++)for(j=0;j<3;j++)pal[i][j]=i;
  f1=fopen(name,"rb"); if(!f1) ERR("open");
  if(fread(h,1,128,f1)!=128)ERR("read PCX header");    /* 128 Byte lesen -> h[] */
  if(h[0]!=10)ERR("no ZSoft sign");	/* ZSoft sign */
  if(h[2]>  1)ERR("unknown coding");	/* run length encoding */
  bits = h[3];		/* 1 or 8 */
  if(bits!=1 && bits!=8)ERR("only 1 or 8 bits supported");
  nx = h[ 9]*256+h[ 8] - h[ 5]*256-h[ 4] +1;	/* Xmax-Xmin */
  ny = h[11]*256+h[10] - h[ 7]*256-h[ 6] +1;	/* Ymax-Ymin */
  pages=h[65]; bpl=h[66]+256*h[67]; /* bytes per line */
  if(vvv)
  fprintf(stderr,"# PCX version=%d bits=%d x=%d y=%d HRes=%d VRes=%d\n"
                 "# NPlanes=%d BytesPerLine=%d Palette=%s",
    h[1],bits,nx,ny,h[12]+256*h[13],h[14]+256*h[15],
    pages,bpl,((h[68]==1)?"1=color/bw":"2=gray"));
  /* line1(NP=4): RRRRR...,GGGG....,BBBBB...,IIII...., line2: RRRR...,GGGG.... */
  /* C4 EF = (C4&3F)*EF = EF EF EF EF */
  fflush(stdout);
  /* palette: for(i=0;i<16;i++) for(j=0;j<3;j++) h[16+3*i+j]  */
  if(pages>1)for(b=0;b<16;b++) for(i=0;i<16;i++)
             for(j=0;j< 3;j++) pal[b*16+i][j]=h[16+3*i+j]>>2;
  if(bits>7){
   fseek(f1,-3*256,2); if(fread(pal,3,256,f1)!=256)ERR("read palette");
   for(i=0;i<256;i++) for(j=0;j<3;j++) pal[i][j]>>=2;
  }
  fseek(f1,128,0);
  pic=(unsigned char *)malloc( nx*ny );
  if(pic==NULL)ERR("no memory");	/* no memory */
  x=y=0;
  do {
    for(page=0;page<pages;page++)    /* 192 == 0xc0 => b1=counter */
    do {
      b1=1; bb=read_b(f1); b2=bb; if(b1==192)fprintf(stderr,"?");
      if((b2>=192) && (h[2]==1)){b1=b2&63;bb=read_b(f1);b2=bb;}
      if(err){fprintf(stderr,"\nread error x=%d y=%d\n",x,y);x=nx;y=ny;break;}
      for(b3=0;b3<b1;b3++)for(b=0;b<8;b+=bits,x++)if(x<nx){
        bb=(b2>>(8-bits-b)) & ~((~0)<<bits);
        if(bits==1 && bb==1) bb=240;
        if(page==0) pic[x+nx*y] =(byte)bb;
        else        pic[x+nx*y]|=(byte)bb<<(page*bits);
      }
    } while(x<(9-bits)*bpl);  x=0; y++;
  } while(y<ny);
  /*  */
  fclose(f1);
  p->p=pic;  p->x=nx;  p->y=ny; p->bpp=1;
  if(vvv)fprintf(stderr,"\n");
}

/* -----------------------------------------------------------------------
// write bmp 8bit palette no RLE
//   bit 2+3 used for color coding (markers)
//   replaced by writeppm (ppm.gz) and is obsolate now, removed later
 */
void writebmp(char *name,pix p,int vvv){ /* see pcx.format.txt */
  int nx,ny,i,y,rest[4]={0,0,0,0};
  FILE *f1;
  /*FIXME jb static*/static unsigned char *pic, h[54+4*256];
  long fs,fo,hs,is; /* filesize, offset, headersize, imagesize */

  nx=p.x; ny=p.y; pic=p.p;
  if (nx&3) nx+=4-(nx&3);  /* must be mod4 ? */
  hs=40;	    /* bmi headersize fix */
  is=nx*ny; /* imagesize */
  fo=14+hs+4*256;
  fs=fo+is;
  for(i=0;i<54;i++){ h[i]=0; }
  /* BITMAPFILEHEADER */
  h[ 0]='B';          h[ 1]='M'; 		/* type of file BMP */
  h[ 2]= fs     &255; h[ 3]=(fs>> 8)&255;
  h[ 4]=(fs>>16)&255; h[ 5]=(fs>>24)&255;	/* size of file */
  h[10]= fo     &255; h[11]=(fo>> 8)&255;
  h[12]=(fo>>16)&255; h[13]=(fo>>24)&255;	/* offset to image data */
  /* BITMAPINFO  (BITMAPCOREHEADER not used here) */
  /* 14 - HEADER */
  h[14]= hs     &255; h[15]=(hs>> 8)&255;
  h[16]=(hs>>16)&255; h[17]=(hs>>24)&255;	/* bmi-header size */
  h[18]= nx     &255; h[19]=(nx>> 8)&255;
  h[20]=(0l>>16)&255; h[21]=(0l>>24)&255;	/* WIDTH/pixel */
  h[22]= ny     &255; h[23]=(ny>> 8)&255;
  h[24]=(0l>>16)&255; h[25]=(0l>>24)&255;	/* HIGH/pixel */
  h[26]=1;            				/* planes */
  h[28]=8;            				/* bits/pixel 1,4,8,24 */
  h[30]=0;            				/* compression */
  h[34]= is     &255; h[35]=(is>> 8)&255;
  h[36]=(is>>16)&255; h[37]=(is>>24)&255;	/* sizeImage (can be 0 if ~RLE) */
  h[38]=0;h[39]=1;	/* ca 100dpi, x/meter */
  h[42]=0;h[43]=1;	/* 	      y/meter */
  h[46]=0;h[47]=1;	/* colorused (0=maximum)  */
  h[50]=0;h[51]=1;	/* colorimportand (0=all) */
  /* 54 - endofheader */
  for(i=0;i<256;i++){ 
     h[54+4*i+0]=((~((i & 2)*64)) &                    (i & (128+64)))|63;
     h[54+4*i+1]=((~((i & 2)*64)) &  (~((i & 4)*32)) & (i & (128+64)))|63;
     h[54+4*i+2]=(  ((i & 2)* 8)  | ((~((i & 4)*32)) & (i & (128+64)))|63);
  }			 /* blue-green-red */
  f1=fopen(name,"wb"); if(!f1) fprintf(stderr," error opening file\n");
  if(!f1)ERR("open");		/* open-error */
  if(fwrite(h,1,54+4*256,f1)!=54+4*256)ERR("write head"); 
  if(vvv) fprintf(stderr,"# write BMP x=%d y=%d\n",nx,ny);
  for(y=ny-1;y>=0;y--){
    if(((int)fwrite(pic+p.x*y,1,p.x,f1))!=p.x)ERR("write");
    if(nx>p.x)
    if(((int)fwrite(rest,1,nx-p.x,f1))!=nx-p.x)ERR("write");
  }
  fclose(f1);
}

/* ---------------------------------------------------------------------- */
