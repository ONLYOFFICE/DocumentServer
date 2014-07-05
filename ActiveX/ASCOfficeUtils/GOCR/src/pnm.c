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

    v0.1.0 initial version (stdin added)
    v0.2.0 popen added
    v0.2.7 review by Bruno Barberi Gnecco
    v0.39  autoconf
    v0.41  fix integer and heap overflow, change color output
    v0.46  fix blank spaces problem in filenames
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#ifdef HAVE_UNISTD_H
/* #include <unistd.h> */
#endif

/* Windows needs extra code to work fine, ^Z in BMP's will stop input else.
 * I do not have any idea when this text mode will be an advantage
 * but the MS community seems to like to do simple things in a complex way. */
#if defined(O_BINARY) && (defined(__WIN32) || defined(__WIN32__)\
 || defined(__WIN64) || defined(__WIN64__) || defined(__MSDOS__))
# include <fcntl.h>
# define SET_BINARY(_f) do {if (!isatty(_f)) setmode (_f, O_BINARY);} while (0)
#else
# define SET_BINARY(f) (void)0
#endif

#include "pnm.h"
#ifdef HAVE_PAM_H
# include <pam.h>
# include <sys/types.h>
# include <sys/stat.h>
# include <fcntl.h>
#else
# include <ctype.h>
#endif

#define EE()         fprintf(stderr,"\nERROR "__FILE__" L%d: ",__LINE__)
#define E0(x0)       {EE();fprintf(stderr,x0 "\n");      }
#define F0(x0)       {EE();fprintf(stderr,x0 "\n");      exit(1);}
#define F1(x0,x1)    {EE();fprintf(stderr,x0 "\n",x1);   exit(1);}

/*
 * Weights to use for the different colours when converting a ppm
 * to greyscale.  These weights should sum to 1.0
 * 
 * The below values have been chosen to reflect the fact that paper
 * goes a reddish-yellow as it ages.
 *
 * v0.41: for better performance, we use integer instead of double
 *        this integer value divided by 1024 (2^10) gives the factor 
 */
#define PPM_RED_WEIGHT   511  /* .499 */
#define PPM_GREEN_WEIGHT 396  /* .387 */
#define PPM_BLUE_WEIGHT  117  /* .114 */

/*
    feel free to expand this list of usable converting programs
    Note 1: the last field must be NULL.
    Note 2: "smaller" extensions must come later: ".pnm.gz" must come
       before ".pnm".
    calling external programs is a security risk
    ToDo: for better security replace gzip by /usr/bin/gzip !
 */
char *xlist[]={
  ".pnm.gz",	"gzip -cd",  /* compressed pnm-files, gzip package */
  ".pbm.gz",	"gzip -cd",
  ".pgm.gz",	"gzip -cd",
  ".ppm.gz",	"gzip -cd",
  ".pnm.bz2",	"bzip2 -cd",
  ".pbm.bz2",	"bzip2 -cd",
  ".pgm.bz2",	"bzip2 -cd",
  ".ppm.bz2",	"bzip2 -cd",
  ".jpg", 	"djpeg -gray -pnm",  /* JPG/JPEG, jpeg package */
  ".jpeg",	"djpeg -gray -pnm",
  ".gif",	"giftopnm -image=all",  /* GIF, netpbm package */
  ".bmp",	"bmptoppm",
  ".tiff",	"tifftopnm",
  ".png",	"pngtopnm", /* Portable Network Graphics (PNG) format */
  ".ps",	"pstopnm -stdout -portrait -pgm", /* postscript */
  ".eps",	"pstopnm -stdout -portrait -pgm", /* encapsulated postscript */
   /* gs -sDEVICE=pgmraw -sOutputFile=- -g609x235 -r141x141 -q -dNOPAUSE */
  ".fig",	"fig2dev -L ppm -m 3", /* xfig files, transfig package */
  NULL
};

/* return a pointer to command converting file to pnm or NULL */
char *testsuffix(char *name){
  int i; char *rr;

  for(i = 0; xlist[i] != NULL; i += 2 ) {
    if((rr=strstr(name, xlist[i])) != NULL)
      if(strlen(rr)==strlen(xlist[i])) /* handle *.eps.pbm correct */
        return xlist[i+1];
  }
  return NULL;
}


char read_char(FILE *f1){	// filter #-comments
  char c;
  int  m;
  for(m=0;;){
    c=fgetc(f1);
    if( feof(f1)   )		E0("read feof");
    if( ferror(f1) )		F0("read ferror");
    if( c == '#'  )		{ m = 1; continue; }
    if( m ==  0   )		return c;
    if( c == '\n' )		m = 0;
  }
}

/*
 * read char from buffer
 *   buf: pointer to buffer
 *   pos: pointer to current pos in buffer
 *   size: size of buffer
 * 
*/
int fgetc2(char* buf, long* pos, long size)
{
	if(*pos>size)
		return EOF;
	return buf[(*pos)++];
}

/*
 * get end of buffer
 *   pos: current pos in buffer
 *   size: size of buffer
 * 
*/
int feof2(long pos, long size)
{
	return (pos > size);
}


char read_char2(char *buf, long* pos, long size){	// filter #-comments
  char c;
  int  m;
  for(m=0;;){
    c=fgetc2(buf, pos, size);
    if( feof2(*pos, size)   )		E0("read feof");
    if( c == '#'  )		{ m = 1; continue; }
    if( m ==  0   )		return c;
    if( c == '\n' )		m = 0;
  }
}


/*
   for simplicity only PAM of netpbm is used, the older formats
   PBM, PGM and PPM can be handled implicitly by PAM routines (js05)
   v0.43: return 1 if multiple file (hold it open), 0 otherwise
 */
#ifdef HAVE_PAM_H
int readpgm(char *name, pix * p, int vvv) {
  static FILE *fp=NULL;
  static char *pip; 
  char magic1, magic2;
  int i, j, sample, minv = 0, maxv = 0, eofP=0;
  struct pam inpam;
  tuple *tuplerow;

  assert(p);

  if (!fp) { // fp!=0 for multi-pnm and idx>0
    /* open file; test if conversion is needed. */
    if (name[0] == '-' && name[1] == '\0') {
      fp = stdin;
      SET_BINARY (fileno(fp)); // Windows needs it for correct work
    }
    else {
      pip = testsuffix(name);
      if (!pip) {
        fp = fopen(name, "rb");
        if (!fp)
          F1("opening file %s", name);
      }
      else {
        char *buf = (char *)malloc((strlen(pip)+strlen(name)+4));
        sprintf(buf, "%s \"%s\"", pip, name); /* allow spaces in filename */
        if (vvv) {
          fprintf(stderr, "# popen( %s )\n", buf);
        }
#ifdef HAVE_POPEN
        /* potential security vulnerability, if name contains tricks */
        /* example: gunzip -c dummy | rm -rf * */
        /* windows needs "rb" for correct work, linux not, cygwin? */
        /* ToDo: do you have better code to go arround this? */
#if defined(__WIN32) || defined(__WIN32__) || defined(__WIN64) || defined(__WIN64__)
	fp = popen(buf, "rb");  /* ToDo: may fail, please report */
	if (!fp) fp = popen(buf, "r"); /* 2nd try, the gnu way */
#else
        fp = popen(buf, "r");
#endif
#else
        F0("sorry, compile with HAVE_POPEN to use pipes");
#endif
        if (!fp)
          F1("opening pipe %s", buf);
        free(buf);
      }
    }
  }

  /* netpbm 0.10.36 tries to write a comment to nonzero char** comment_p */
  /* patch by C.P.Schmidt 21Nov06 */
  memset (&inpam, 0, sizeof(inpam));

  /* read pgm-header */
  /* struct pam may change between netpbm-versions, causing problems? */
#ifdef PAM_STRUCT_SIZE  /* ok for netpbm-10.35 */
  /* new-and-better? but PAM_STRUCT_SIZE is not defined in netpbm-10.18 */
  pnm_readpaminit(fp, &inpam, PAM_STRUCT_SIZE(tuple_type));
#else /* ok for netpbm-10.18 old-and-bad for new netpbms */
  pnm_readpaminit(fp, &inpam, sizeof(inpam));
#endif

  p->x = inpam.width;
  p->y = inpam.height;
  magic1=(inpam.format >> 8) & 255; /* 'P' for PNM,PAM */
  magic2=(inpam.format     ) & 255; /* '7' for PAM */
  minv=inpam.maxval;
  if (vvv) {
      fprintf(stderr, "# readpam: format=0x%04x=%c%c h*w(d*b)=%d*%d(%d*%d)\n",
        inpam.format, /* magic1*256+magic2 */
        ((magic1>31 && magic1<127)?magic1:'.'),
        ((magic2>31 && magic2<127)?magic2:'.'),
        inpam.height,
        inpam.width,
        inpam.depth,
        inpam.bytes_per_sample);
  }
  if ( (1.*(p->x*p->y))!=((1.*p->x)*p->y) )
    F0("Error integer overflow");
  if ( !(p->p = (unsigned char *)malloc(p->x*p->y)) )
    F1("Error at malloc: p->p: %d bytes", p->x*p->y);
  tuplerow = pnm_allocpamrow(&inpam);
  for ( i=0; i < inpam.height; i++ ) {
    pnm_readpamrow(&inpam, tuplerow);   /* exit on error */
    for ( j = 0; j < inpam.width; j++ ) {
      if (inpam.depth>=3)
        /* tuplerow is unsigned long (see pam.h sample) */
        /* we expect 8bit or 16bit integers,
           no overflow up to 32-10-2=20 bits */
        sample
          = ((PPM_RED_WEIGHT   * tuplerow[j][0] + 511)>>10)
          + ((PPM_GREEN_WEIGHT * tuplerow[j][1] + 511)>>10)
          + ((PPM_BLUE_WEIGHT  * tuplerow[j][2] + 511)>>10);
      else
        sample = tuplerow[j][0];
      sample = 255 * sample / inpam.maxval; /* normalize to 8 bit */
      p->p[i*inpam.width+j] = sample;
      if (maxv<sample) maxv=sample;
      if (minv>sample) minv=sample;
    }
  }
  pnm_freepamrow(tuplerow);
  pnm_nextimage(fp,&eofP);
  if (vvv)
    fprintf(stderr,"# readpam: min=%d max=%d eof=%d\n", minv, maxv, eofP);
  p->bpp = 1;
  if (eofP) {
    if (!pip) fclose(fp);
#ifdef HAVE_POPEN
    else      pclose(fp);	/* close pipe (v0.43) */
#endif
    fp=NULL; return 0; 
  }
  return 1; /* multiple image = concatenated pnm */
}

#else
/*
   if PAM not installed, here is the fallback routine,
   which is not so powerful but needs no dependencies from other libs
 */
static int fread_num(char *buf, int bps, FILE *f1) {
  int mode, j2, j3; char c1;
  for (j2=0;j2<bps;j2++) buf[j2]=0; // initialize value to zero
  for(mode=0;!feof(f1);){ // mod=0 means skip leading spaces, 1 scan digits
    c1=read_char(f1);
    if (isspace(c1)) { if (mode==0) continue; else break; }
    mode=1; // digits scan mode
    if( !isdigit(c1) ) F0("unexpected char");
    for (j3=j2=0;j2<bps;j2++) {      // multiply bps*bytes by 10
      j3 = buf[j2]*10 + j3;  // j3 is used as result and carry
      buf[j2]=j3 & 255; j3>>=8; 
    }
    buf[0] += c1-'0';
  }
  return 0;
}

/*
   if PAM not installed, here is the fallback routine,
   which is not so powerful but needs no dependencies from other libs
 */
static int fread_num2(char *buf, int bps, char *buffer, long *pos, long size) {
  int mode, j2, j3; char c1;
  for (j2=0;j2<bps;j2++) buf[j2]=0; // initialize value to zero
  for(mode=0;!feof2(*pos, size);){ // mod=0 means skip leading spaces, 1 scan digits
    c1=read_char2(buffer, pos, size);
    if (isspace(c1)) { if (mode==0) continue; else break; }
    mode=1; // digits scan mode
    if( !isdigit(c1) ) F0("unexpected char");
    for (j3=j2=0;j2<bps;j2++) {      // multiply bps*bytes by 10
      j3 = buf[j2]*10 + j3;  // j3 is used as result and carry
      buf[j2]=j3 & 255; j3>>=8; 
    }
    buf[0] += c1-'0';
  }
  return 0;
}

/*
 * read image file, used to read the OCR-image and database images,
 * image file can be PBM/PGM/PPM in RAW or TEXT
 *   name: filename of image (input)
 *   p:    pointer where to store the loaded image (input)
 *   vvv:  verbose mode (input)
 *   return: 0=ok, 1=further image follows (multiple image), -1 on error
 * this is the fall back routine if libpnm cant be used
 */
int readpgm(char *name, pix *p, int vvv){
  static char c1, c2;           /* magic bytes, file type */
  static char *pip;             // static to survive multiple calls
  int  nx,ny,nc,mod,i,j;	// buffer
  static FILE *f1=NULL;         // trigger read new file or multi image file
  unsigned char *pic;
  char buf[512];
  int lx, ly, dx;
  int bps=1; /* bytes per sample (0..255..65535...) */

  if (!f1) {  /* first of multiple image, on MultipleImageFiles c1 was read */
    pip=NULL;
    if (name[0]=='-' && name[1]==0) {
      f1=stdin;  /* is this correct ??? */
      SET_BINARY (fileno(f1)); // Windows needs it for correct work
    } else {
      pip=testsuffix(name);
      if (!pip) {
        f1=fopen(name,"rb"); if (!f1) F1("opening file %s",name);
      } else {
        sprintf(buf,"%s \"%s\"",pip,name); /* ToDo: how to prevent OVL ? */
        if (vvv) { fprintf(stderr,"# popen( %s )\n",buf); }
#ifdef HAVE_POPEN
#if defined(__WIN32) || defined(__WIN32__) || defined(__WIN64) || defined(__WIN64__)
	f1 = popen(buf, "rb");  /* ToDo: may fail, please report */
	if (!f1) f1 = popen(buf, "r"); /* 2nd try, the gnu way */
#else
        f1=popen(buf,"r");
#endif
#else
        F0("only PNM files supported (compiled without HAVE_POPEN)");
#endif
        if (!f1) F1("opening pipe %s",buf);
      }
    }
    c1=fgetc(f1); if (feof(f1)) { E0("unexpected EOF"); return -1; }
  }
  c2=fgetc(f1);   if (feof(f1)) { E0("unexpected EOF"); return -1; }
  // check the first two bytes of the PNM file 
  //         PBM   PGM   PPM
  //    TXT   P1    P2    P3
  //    RAW   P4    P5    P6
  if (c1!='P' || c2 <'1' || c2 >'6') { 
    fprintf(stderr,"\nread-PNM-error: file number is %2d,"
                   " position %ld", fileno(f1), ftell(f1));
    fprintf(stderr,"\nread-PNM-error: bad magic bytes, expect 0x50 0x3[1-6]"
                   " but got 0x%02x 0x%02x", 255&c1, 255&c2);
    if (f1) fclose(f1); f1=NULL; return(-1);
  }
  nx=ny=nc=0; if (c2=='4' || c2=='1') nc=1;
  for(mod=0;((c2=='5' || c2=='2') && (mod&7)<6)
        ||  ((c2=='6' || c2=='3') && (mod&7)<6)		
        ||  ((c2=='4' || c2=='1') && (mod&7)<4);)		
  {						// mode: 0,2,4=[ |\t|\r|\n] 
  						//   1=nx 3=ny 5=nc 8-13=#rem
    c1=read_char(f1);				// former: # mod|=8
    if( (mod & 1)==0 )				// whitespaces
    if( !isspace(c1) ) mod++;
    if( (mod & 1)==1 ) {
      if( !isdigit(c1) ) {
        if( !isspace(c1) )F0("unexpected character");
        mod++; }
      else if(mod==1) nx=nx*10+c1-'0';
      else if(mod==3) ny=ny*10+c1-'0';
      else if(mod==5) nc=nc*10+c1-'0';
    }
  }
  if(vvv)
   fprintf(stderr,"# PNM P%c h*w=%d*%d c=%d head=%ld",c2,ny,nx,nc,ftell(f1));
  if( c2=='4' && (nx&7)!=0 ){
    /* nx=(nx+7)&~7;*/ if(vvv)fprintf(stderr," PBM2PGM nx %d",(nx+7)&~7);
  }
  if (nc>> 8) bps=2; // bytes per color and pixel
  if (nc>>16) bps=3;
  if (nc>>24) bps=4;
  fflush(stdout);
  if ( (1.*(nx*ny))!=((1.*nx)*ny) )
    F0("Error integer overflow");
  pic=(unsigned char *)malloc( nx*ny );
  if(pic==NULL)F0("memory failed");			// no memory
  for (i=0;i<nx*ny;i++) pic[i]=255; // init to white if reading fails 
  /* this is a slow but short routine for P1 to P6 formats */
  if( c2=='5' || c2=='2' ) /* slow PGM-RAW/ASC read pixelwise */
    for (i=0;i<nx*ny;i++) {
     if (c2=='5') { if(bps!=(int)fread(buf,1,bps,f1)) {
        fprintf(stderr," ERROR reading at head+%d*%d\n", bps, i); break; } }
     else for (j=0;j<3;j++) fread_num(buf+j*bps, bps, f1);
     pic[i]=buf[bps-1]; /* store the most significant byte */
    }
  // we want to normalize brightness to 0..255
  if (c2=='6' || c2=='3') {  // PPM-RAW/ASC
    for (i=0;i<nx*ny;i++) {
      if (c2=='6') { if (3*bps!=(int)fread(buf,1,3*bps,f1)){
         fprintf(stderr," ERROR reading at head+3*%d*%d\n", bps, i); break; } }
      else for (j=0;j<3;j++) fread_num(buf+j*bps, bps, f1);
      pic[i]
          = ((PPM_RED_WEIGHT   * (unsigned char)buf[  bps-1] + 511)>>10)
          + ((PPM_GREEN_WEIGHT * (unsigned char)buf[2*bps-1] + 511)>>10)
          + ((PPM_BLUE_WEIGHT  * (unsigned char)buf[3*bps-1] + 511)>>10);
      /* normalized to 0..255 */
    }
  }
  if( c2=='1' )
    for(mod=j=i=0,nc=255;i<nx*ny && !feof(f1);){ // PBM-ASCII 0001100
    c1=read_char(f1);
    if( isdigit(c1) ) { pic[i]=((c1=='0')?255:0); i++; }
    else if( !isspace(c1) )F0("unexpected char");
  }
  if( c2=='4' ){				// PBM-RAW
    dx=(nx+7)&~7;				// dx (mod 8)
    if(ny!=(int)fread(pic,dx>>3,ny,f1))F0("read");	// read all bytes
    for(ly=ny-1;ly>=0;ly--)
    for(lx=nx-1;lx>=0;lx--)
    pic[lx+ly*nx]=( (128 & (pic[(lx+ly*dx)>>3]<<(lx & 7))) ? 0 : 255 );
    nc=255;
  }
  {
    int minc=255, maxc=0;
    for (i=0;i<nx*ny;i++) {
      if (pic[i]>maxc) maxc=pic[i];
      if (pic[i]<minc) minc=pic[i];
    }
    if (vvv) fprintf(stderr," min=%d max=%d", minc, maxc);
  }
  p->p=pic;  p->x=nx;  p->y=ny; p->bpp=1;
  if (vvv) fprintf(stderr,"\n");  
  c1=0; c1=fgetc(f1); /* needed to trigger feof() */
  if (feof(f1) || c1!='P') {  /* EOF ^Z or not 'P' -> single image */
    if (vvv) fprintf(stderr,"# PNM EOF\n");
    if(name[0]!='-' || name[1]!=0){ /* do not close stdin */
      if(!pip) fclose(f1);
#ifdef HAVE_POPEN
      else     pclose(f1);	/* close pipe (Jul00) */
#endif
    }
    f1=NULL;  /* set file is closed flag */
    return 0;
  }
  return 1; /* multiple image = concatenated pnm's */
}

#endif /* HAVE_PAM_H */

/*
 * read path of buffer
 *   buf: pointer to out buffer
 *   size: size objects to read
 *   count: count objects to read
 *   buf: pointer to in buffer
 *   pos: pointer to current pos in buffer
 *	 sizeb : size of buffer
 * 
*/
size_t fread2(void *bufOut, size_t size, size_t count, char* bufIn, long* pos, long sizeb)
{
	long countTmp = (long)count;
	char* p = bufOut;

	while (0 != countTmp)
	{
		if (*pos + (long)size > sizeb)
		{
			memcpy(p, bufIn + *pos, sizeb - *pos);
			*pos += sizeb - *pos;
			return count;
		}

		memcpy(p, bufIn + *pos, size);
		p += size;
		*pos += size;

		--countTmp;
	}

	return count;
}


/*
 * read image file, used to read the OCR-image and database images,
 * image file can be PBM/PGM/PPM in RAW or TEXT
 *   buffer: pointer to buffer of image (input)
 *   size: size buffer of image (input)
 *   p:    pointer where to store the loaded image (input)
 *   return: 0=ok, 1=further image follows (multiple image), -1 on error
 * this is the fall back routine if libpnm cant be used
 */
int readpgmFromBuffer(char* buffer, long size, pix *p){
  static char c1, c2;           /* magic bytes, file type */
  int  nx,ny,nc,mod,i,j;	// buffer
  unsigned char *pic;
  char buf[512];
  int lx, ly, dx;
  int bps=1; /* bytes per sample (0..255..65535...) */

  long pos = 0;

  c1=fgetc2(buffer, &pos, size); if (feof2(pos, size)) { E0("unexpected EOF"); return -1; }
  c2=fgetc2(buffer, &pos, size); if (feof2(pos, size)) { E0("unexpected EOF"); return -1; }
  // check the first two bytes of the PNM file 
  //         PBM   PGM   PPM
  //    TXT   P1    P2    P3
  //    RAW   P4    P5    P6
  if (c1!='P' || c2 <'1' || c2 >'6') { 
	  return(-1);
  }
  nx=ny=nc=0; if (c2=='4' || c2=='1') nc=1;
  for(mod=0;((c2=='5' || c2=='2') && (mod&7)<6)
        ||  ((c2=='6' || c2=='3') && (mod&7)<6)		
        ||  ((c2=='4' || c2=='1') && (mod&7)<4);)		
  {						// mode: 0,2,4=[ |\t|\r|\n] 
  						//   1=nx 3=ny 5=nc 8-13=#rem
    c1=read_char2(buffer, &pos, size);				// former: # mod|=8
    if( (mod & 1)==0 )				// whitespaces
    if( !isspace(c1) ) mod++;
    if( (mod & 1)==1 ) {
      if( !isdigit(c1) ) {
        if( !isspace(c1) )F0("unexpected character");
        mod++; }
      else if(mod==1) nx=nx*10+c1-'0';
      else if(mod==3) ny=ny*10+c1-'0';
      else if(mod==5) nc=nc*10+c1-'0';
    }
  }
  if (nc>> 8) bps=2; // bytes per color and pixel
  if (nc>>16) bps=3;
  if (nc>>24) bps=4;
  fflush(stdout);
  if ( (1.*(nx*ny))!=((1.*nx)*ny) )
    F0("Error integer overflow");
  pic=(unsigned char *)malloc( nx*ny );
  if(pic==NULL)F0("memory failed");			// no memory
  for (i=0;i<nx*ny;i++)pic[i]=255; // init to white if reading fails 
  /* this is a slow but short routine for P1 to P6 formats */
  if( c2=='5' || c2=='2' ) /* slow PGM-RAW/ASC read pixelwise */
    for (i=0;i<nx*ny;i++) {
     if (c2=='5') { if(bps!=(int)fread2(buf,1,bps,buffer,&pos,size)) {
        fprintf(stderr," ERROR reading at head+%d*%d\n", bps, i); break; } }
     else for (j=0;j<3;j++) fread_num2(buf+j*bps, bps, buffer, &pos, size);
     pic[i]=buf[bps-1]; /* store the most significant byte */
    }
  // we want to normalize brightness to 0..255
  if (c2=='6' || c2=='3') {  // PPM-RAW/ASC
    for (i=0;i<nx*ny;i++) {
      if (c2=='6') { if (3*bps!=(int)fread2(buf,1,3*bps,buffer,&pos,size)){
         fprintf(stderr," ERROR reading at head+3*%d*%d\n", bps, i); break; } }
      else for (j=0;j<3;j++) fread_num2(buf+j*bps, bps, buffer, &pos, size);
      pic[i]
          = ((PPM_RED_WEIGHT   * (unsigned char)buf[  bps-1] + 511)>>10)
          + ((PPM_GREEN_WEIGHT * (unsigned char)buf[2*bps-1] + 511)>>10)
          + ((PPM_BLUE_WEIGHT  * (unsigned char)buf[3*bps-1] + 511)>>10);
      /* normalized to 0..255 */
    }
  }
  if( c2=='1' )
    for(mod=j=i=0,nc=255;i<nx*ny && !feof2(pos, size);){ // PBM-ASCII 0001100
    c1=read_char2(buffer, &pos, size);
    if( isdigit(c1) ) { pic[i]=((c1=='0')?255:0); i++; }
    else if( !isspace(c1) )F0("unexpected char");
  }
  if( c2=='4' ){				// PBM-RAW
    dx=(nx+7)&~7;				// dx (mod 8)
    if(ny!=(int)fread2(pic,dx>>3,ny,buffer,&pos,size))F0("read");	// read all bytes
    for(ly=ny-1;ly>=0;ly--)
    for(lx=nx-1;lx>=0;lx--)
    pic[lx+ly*nx]=( (128 & (pic[(lx+ly*dx)>>3]<<(lx & 7))) ? 0 : 255 );
    nc=255;
  }
  {
    int minc=255, maxc=0;
    for (i=0;i<nx*ny;i++) {
      if (pic[i]>maxc) maxc=pic[i];
      if (pic[i]<minc) minc=pic[i];
    }
  }
  p->p=pic;  p->x=nx;  p->y=ny; p->bpp=1;
  c1=0; c1=fgetc2(buffer, &pos, size); /* needed to trigger feof() */
  if (feof2(pos, size) || c1!='P') {  /* EOF ^Z or not 'P' -> single image */
    return 0;
  }
  return 1; /* multiple image = concatenated pnm's */
}

int writepgm(char *nam,pix *p){// P5 raw-pgm
  FILE *f1;int a,x,y;
  f1=fopen(nam,"wb");if(!f1)F0("open");		// open-error
  fprintf(f1,"P5\n%d %d\n255\n",p->x,p->y);
  if(p->bpp==3)
  for(y=0;y<p->y;y++)
  for(x=0;x<p->x;x++){	// set bit
    a=x+y*p->x;
    p->p[a]=(p->p[3*a+0]+p->p[3*a+1]+p->p[3*a+2])/3;
  }
  if(p->y!=(int)fwrite(p->p,p->x,p->y,f1))F0("write");	// write all lines
  fclose(f1);
  return 0;
}

/* adding colours, care about range */
void addrgb(unsigned char rgb[3], int sr, int sg, int sb) {
 int add[3], i;
 /* add colour on dark pixels, subtract on white pixels */ 
 add[0]=2*sr; add[1]=2*sg; add[2]=2*sb;
 if (((int)rgb[0])+((int)rgb[1])+((int)rgb[2])>=3*160)
    { add[0]=(-sg-sb); add[1]=(-sr-sb); add[2]=(-sr-sg); } // rgb/2?
 /* care about colour range */
 for (i=0;i<3;i++)
   if (add[i]<0) rgb[i]-=((    rgb[i]<-add[i])?    rgb[i]:-add[i]);
   else          rgb[i]+=((255-rgb[i]< add[i])?255-rgb[i]: add[i]);
}
/*
 * pgmtoppm or pnmtopng, use last 3 bits for farbcoding 
 * replaces old writebmp variant
 */
int writeppm(char *nam, pix *p){ /* P6 raw-ppm */
  FILE *f1=NULL; int x,y,f1t=0; unsigned char rgb[3], gray, bits;
  char buf[128];
  if (strchr(nam,'|')) return -1;  /* no nasty code */
  if (strstr(nam,".ppm")) { f1=fopen(nam,"wb"); }
#ifdef HAVE_POPEN
  /* be sure that nam contains hacker code like "dummy | rm -rf *" */
  if (!f1) {
    strncpy(buf,"pnmtopng > ",12);  /* no spaces within filenames allowed! */
    strncpy(buf+11,nam,111); buf[123]=0;
    strncpy(buf+strlen(buf),".png",5);
    /* we dont care about win "wb" here, never debug on win systems */
    f1 = popen(buf, "w"); if(f1) f1t=1; else E0("popen pnmtopng");
  }
  if (!f1) {
    strncpy(buf,"gzip -c > ",11);
    strncpy(buf+10,nam,109); buf[120]=0;
    strncpy(buf+strlen(buf),".ppm.gz",8); 
    /* we dont care about win "wb" here, never debug on win systems */
    f1 = popen(buf, "w"); if(f1) f1t=1; else E0("popen gzip -c");
  }
#endif
  if (!f1) {
    strncpy(buf,nam,113); buf[114]=0;
    strncpy(buf+strlen(buf),".ppm",5);
    f1=fopen(buf,"wb");
  }
  if (!f1) F0("open"); /* open-error */
  fprintf(f1,"P6\n%d %d\n255\n",p->x,p->y);
  if ( p->bpp==1 )
  for (y=0;y<p->y;y++)
  for (x=0;x<p->x;x++){
    gray=p->p[x+y*p->x];
    bits=(gray&0x0F);  /* save marker bits */
    /* replace used bits to get max. contrast, 160=0xA0 */
    gray = ((gray<160) ? (gray&~0x0F)>>1 : 0xC3|(gray>>1) );
    rgb[0] = rgb[1] = rgb[2] = gray;
    if ((bits &  1)==1) { addrgb(rgb,0,0,8+8*((x+y)&1)); } /* dark blue */
    if ((bits &  8)==8) { addrgb(rgb,0,0, 16); } /* blue (low priority) */
    if ((bits &  6)==6) { addrgb(rgb,0,0, 32); } /* blue */
    if ((bits &  6)==4) { addrgb(rgb,0,48,0); } /* green */
    if ((bits &  6)==2) { addrgb(rgb,32,0,0); } /* red */
    if ( 1!=(int)fwrite(rgb,3,1,f1) ) { E0("write"); y=p->y; break; }
  }
  if ( p->bpp==3 )
  if ( p->y!=(int)fwrite(p->p,3*p->x,p->y,f1) ) E0("write");
#ifdef HAVE_POPEN
  if (f1t) { pclose (f1); f1=NULL; }
#endif
  if (f1) fclose(f1);
  return 0;
}

// high bit = first, 
int writepbm(char *nam,pix *p){// P4 raw-pbm
  FILE *f1;int x,y,a,b,dx,i;
  dx=(p->x+7)&~7;	// enlarge to a factor of 8
  for(y=0;y<p->y;y++)
  for(x=0;x<p->x;x++){	// set bit
    a=(x+y*dx)>>3;b=7-(x&7);	// adress an bitisnumber
    i=x+y*p->x;
    if(p->bpp==3) i=(p->p[3*i+0]+p->p[3*i+1]+p->p[3*i+2])/3;
    else          i= p->p[  i  ];
    i=((i>127)?0:1);
    p->p[a]=(p->p[a] & (~1<<b)) | (i<<b);
  }
  f1=fopen(nam,"wb");if(!f1)F0("open");		// open-error
  fprintf(f1,"P4\n%d %d\n",p->x,p->y);
  if(p->y!=(int)fwrite(p->p,dx>>3,p->y,f1))F0("write");	// write all lines
  fclose(f1);
  return 0;
}
// ------------------------------------------------------------------------
