#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "pm_c_util.h"
#include "ImageToPNM.h"

static xelval const bmpMaxval = 255;
/* The maxval for intensity values in a BMP image -- either in a
truecolor raster or in a colormap
*/

/* MAXCOLORS is the maximum size of a color map in a BMP image */
#define MAXCOLORS       256

enum rowOrder {BOTTOMUP, TOPDOWN};

struct bitPosition {
    /* mask and shift count to describe a set of bits in a binary value.

       Example: if 16 bits are laid out as XRRRRRGGGGGBBBBB then the shift
       count for the R component is 10 and the mask is 0000000000011111.
    */
    unsigned int shift;
        /* How many bits right you have to shift the value to get the subject
           bits in the least significant bit positions.
        */
    unsigned int mask;
        /* Has one bits in positions where the subject bits are after
           shifting.
        */
};

struct pixelformat {
    /* The format of a pixel representation from the raster.  i.e. which 
       bits apply to red, green, blue, and transparency 
    */
    struct bitPosition red;
    struct bitPosition blu;
    struct bitPosition grn;
    struct bitPosition trn;
    
    bool conventionalBgr;
        /* This means that the above bit positions are just the conventional
           BGR format -- one byte Blue, one byte Green, one byte Red,
           no alpha.  Though it's totally redundant with the members above,
           this member speeds up computation:  We've never actually seen
           a BMP file that doesn't use conventional BGR, and it doesn't
           require any masking or shifting at all to interpret.
        */
};

/* append a string (s1) to the string buffer (buffer) of length (len)
 * if buffer is to small or len==0 realloc buffer, len+=512
 */
char *append_to_buffer(char *&buffer, const char *s1, long *lenbuffer, long lenline, long *pos) {
  char *temp;
  int slen=*pos;
  if( s1==NULL )
  {
    return buffer;
  }
  if ( slen+lenline >= *lenbuffer ) {
	if(lenline<=512)
		*lenbuffer+=512;
	else
		*lenbuffer+=lenline;
    temp = (char *)realloc(buffer, *lenbuffer);
    if( !temp ) { *lenbuffer-=512; return buffer; }
    else buffer = temp;  // buffer successfull enlarged
  }
  temp = buffer + slen;   // end of buffered string
  memcpy(temp,s1,lenline); // copy including end sign '\0'
  *pos += lenline;
  return buffer;
}

/* append a string (s1) to the string buffer (buffer) of length (len)
 * if buffer is to small or len==0 realloc buffer, len+=512
 */
unsigned char *append_to_buffer(unsigned char *&buffer, const unsigned char *s1, long *lenbuffer, long lenline, long *pos) {
  unsigned char *temp;
  int slen=*pos;
  if( s1==NULL )
  {
    return buffer;
  }
  if ( slen+lenline >= *lenbuffer ) {
	if(lenline<=512)
		*lenbuffer+=512;
	else
		*lenbuffer+=lenline;
    temp = (unsigned char *)realloc(buffer, *lenbuffer);
    if( !temp ) { *lenbuffer-=512; return buffer; }
    else buffer = temp;  // buffer successfull enlarged
  }
  temp = buffer + slen;   // end of buffered string
  memcpy(temp,s1,lenline); // copy including end sign '\0'
  *pos += lenline;
  return buffer;
}

static struct pixelformat
defaultPixelformat(unsigned int const bitCount) {

	struct pixelformat retval = { 0 };

    switch (bitCount) {
    case 16:
        retval.conventionalBgr = FALSE;
        retval.red.shift = 10;
        retval.grn.shift = 5;
        retval.blu.shift = 0;
        retval.trn.shift = 0;
        retval.red.mask = 0x1f;  /* 5 bits */
        retval.grn.mask = 0x1f;  /* 5 bits */
        retval.blu.mask = 0x1f;  /* 5 bits */
        retval.trn.mask = 0;
        break;
    case 24:
    case 32:
        retval.conventionalBgr = TRUE;
        retval.red.shift = 16;
        retval.grn.shift = 8;
        retval.blu.shift = 0;
        retval.trn.shift = 0;
        retval.red.mask = 0xff;  /* 8 bits */
        retval.grn.mask = 0xff;  /* 8 bits */
        retval.blu.mask = 0xff;  /* 8 bits */
        retval.trn.mask = 0;
        break;
    default:
        /* colormapped - masks are undefined */
        break;
    }

    return retval;
}

static void
extractBitFields(unsigned int       const rasterval,
                 struct pixelformat const pixelformat,
                 pixval             const maxval,
                 pixval *           const rP,
                 pixval *           const gP,
                 pixval *           const bP,
                 pixval *           const aP) {

    unsigned int const rbits = 
        (rasterval >> pixelformat.red.shift) & pixelformat.red.mask;
    unsigned int const gbits = 
        (rasterval >> pixelformat.grn.shift) & pixelformat.grn.mask;
    unsigned int const bbits = 
        (rasterval >> pixelformat.blu.shift) & pixelformat.blu.mask;
    unsigned int const abits = 
        (rasterval >> pixelformat.trn.shift) & pixelformat.trn.mask;
    
    *rP = pixelformat.red.mask ?
              (unsigned int) rbits * maxval / pixelformat.red.mask : 0;
    *gP = pixelformat.grn.mask ?
              (unsigned int) gbits * maxval / pixelformat.grn.mask : 0;
    *bP = pixelformat.blu.mask ?
              (unsigned int) bbits * maxval / pixelformat.blu.mask : 0;
    *aP = pixelformat.trn.mask ?
              (unsigned int) abits * maxval / pixelformat.trn.mask : 0;
}

static void
convertRow16(unsigned char      const bmprow[],
             xel                      xelrow[],
             int                const cols,
             struct pixelformat const pixelformat) {
    /* It's truecolor.  */

    unsigned int col;
    unsigned int cursor;
    cursor = 0;
    for (col=0; col < cols; ++col) {
        unsigned short const rasterval = (unsigned short)
            bmprow[cursor+1] << 8 | bmprow[cursor+0];

        pixval r, g, b, a;

        extractBitFields(rasterval, pixelformat, 255, &r, &g, &b, &a);

        PNM_ASSIGN(xelrow[col], r, g, b);
        
        cursor += 2;
    }
}

static void
convertRow24(unsigned char      const bmprow[],
             xel                      xelrow[],
             int                const cols,
             struct pixelformat const pixelformat) {
    
    /* It's truecolor */
    /* There is a document that gives a much different format for
       24 bit BMPs.  But this seems to be the de facto standard, and is,
       with a little ambiguity and contradiction resolved, defined in the
       Microsoft BMP spec.
    */

    unsigned int col;
    unsigned int cursor;
    
    cursor = 0;
    for (col = 0; col < cols; ++col) {
        pixval r, g, b, a;

        if (pixelformat.conventionalBgr) {
            r = bmprow[cursor+2];
            g = bmprow[cursor+1];
            b = bmprow[cursor+0];
            a = 0;
        } else {
            unsigned int const rasterval = 
                (bmprow[cursor+0] << 16) +
                (bmprow[cursor+1] << 8) +
                (bmprow[cursor+2] << 0);
            
            extractBitFields(rasterval, pixelformat, 255, &r, &g, &b, &a);
        }
        PNM_ASSIGN(xelrow[col], r, g, b);
        cursor += 3;
    }
}

static void
convertRow32(unsigned char      const bmprow[],
             xel                      xelrow[],
             int                const cols,
             struct pixelformat const pixelformat) {
    
    /* It's truecolor */

    unsigned int col;
    unsigned int cursor;
    cursor = 0;
    for (col = 0; col < cols; ++col) {
        pixval r, g, b, a;

        if (pixelformat.conventionalBgr) {
            /* bmprow[cursor+3] is just padding */
            r = bmprow[cursor+2];
            g = bmprow[cursor+1];
            b = bmprow[cursor+0];
            a = 0;
        } else {
            unsigned int const rasterval = 
                (bmprow[cursor+0] << 24) +
                (bmprow[cursor+1] << 16) +
                (bmprow[cursor+2] << 8) +
                (bmprow[cursor+3] << 0);
            
            extractBitFields(rasterval, pixelformat, 255, &r, &g, &b, &a);
        }

        PNM_ASSIGN(xelrow[col], 
                   bmprow[cursor+2], bmprow[cursor+1], bmprow[cursor+0]);
        cursor += 4;
    }
}

static void
convertRow(unsigned char      const bmprow[], 
           xel                      xelrow[],
           int                const cols, 
           unsigned int       const cBitCount, 
           struct pixelformat const pixelformat,
           xel                const colormap[]
           ) {
/*----------------------------------------------------------------------------
   Convert a row in raw BMP raster format bmprow[] to a row of xels xelrow[].

   Use maxval 255 for the output xels.

   The BMP image has 'cBitCount' bits per pixel.

   If the image is colormapped, colormap[] is the colormap
   (colormap[i] is the color with color index i).
-----------------------------------------------------------------------------*/
    if (cBitCount == 24) 
        convertRow24(bmprow, xelrow, cols, pixelformat);
    else if (cBitCount == 16) 
        convertRow16(bmprow, xelrow, cols, pixelformat);
    else if (cBitCount == 32) 
        convertRow32(bmprow, xelrow, cols, pixelformat);
    else if (cBitCount == 8) {            
        /* It's a whole byte colormap index */
        unsigned int col;
        for (col = 0; col < cols; ++col)
            xelrow[col] = colormap[bmprow[col]];
    } else if (cBitCount < 8) {
        /* It's a bit field color index */
        unsigned char const mask = ( 1 << cBitCount ) - 1;

        unsigned int col;

        for (col = 0; col < cols; ++col) {
            unsigned int const cursor = (col*cBitCount)/8;
            unsigned int const shift = 8 - ((col*cBitCount) % 8) - cBitCount;
            unsigned int const index = 
                (bmprow[cursor] & (mask << shift)) >> shift;
            xelrow[col] = colormap[index];
        }
    }
}

static void
format1bpsRow(const pixel *   const pixelrow,
              unsigned int    const cols,
              unsigned char * const rowBuffer) {

    /* single byte samples. */

    unsigned int col;
    unsigned int bufferCursor;

    bufferCursor = 0;

    for (col = 0; col < cols; ++col) {
        rowBuffer[bufferCursor++] = PPM_GETR(pixelrow[col]);
        rowBuffer[bufferCursor++] = PPM_GETG(pixelrow[col]);
        rowBuffer[bufferCursor++] = PPM_GETB(pixelrow[col]);
    }
}

static void
format1bpsRow(const gray *    const grayrow,
              unsigned int    const cols,
              unsigned char * const rowBuffer) {

    /* single byte samples. */

    unsigned int col;
    unsigned int bufferCursor;

    bufferCursor = 0;

    for (col = 0; col < cols; ++col)
        rowBuffer[bufferCursor++] = grayrow[col];
}

static void
format2bpsRow(const pixel *   const pixelrow,
              unsigned int    const cols,
              unsigned char * const rowBuffer) {
    
    /* two byte samples. */

    unsigned int col;
    unsigned int bufferCursor;

    bufferCursor = 0;

    for (col = 0; col < cols; ++col) {
        pixval const r = PPM_GETR(pixelrow[col]);
        pixval const g = PPM_GETG(pixelrow[col]);
        pixval const b = PPM_GETB(pixelrow[col]);
        
        rowBuffer[bufferCursor++] = r >> 8;
        rowBuffer[bufferCursor++] = (unsigned char)r;
        rowBuffer[bufferCursor++] = g >> 8;
        rowBuffer[bufferCursor++] = (unsigned char)g;
        rowBuffer[bufferCursor++] = b >> 8;
        rowBuffer[bufferCursor++] = (unsigned char)b;
    }
}

static void
format2bpsRow(const gray    * const grayrow,
              unsigned int    const cols,
              unsigned char * const rowBuffer) {

    /* two byte samples. */

    unsigned int col;
    unsigned int bufferCursor;

    bufferCursor = 0;

    for (col = 0; col < cols; ++col) {
        gray const val = grayrow[col];
        
        rowBuffer[bufferCursor++] = val >> 8;
        rowBuffer[bufferCursor++] = (unsigned char) val;
    }
}

static void
ppm_writeppmrowraw(unsigned char *&			   PNMImage,
				   long *			   pos,
				   long *			   lenbuffer,
                   const pixel * const pixelrow,
                   unsigned int  const cols,
                   pixval        const maxval ) {

    unsigned int const bytesPerSample = maxval < 256 ? 1 : 2;
    unsigned int const bytesPerRow    = cols * 3 * bytesPerSample;

    unsigned char * rowBuffer;
    rowBuffer = (unsigned char *)malloc(bytesPerRow);

    if (rowBuffer == NULL)
        return;

    if (maxval < 256)
        format1bpsRow(pixelrow, cols, rowBuffer);
    else
        format2bpsRow(pixelrow, cols, rowBuffer);

	PNMImage = append_to_buffer ( PNMImage, rowBuffer, lenbuffer, bytesPerRow, pos );

    free(rowBuffer);
}

static void
writepgmrowraw(unsigned char *&			   PNMImage,
			   long *			   pos,
			   long *			   lenbuffer,
               const gray * const grayrow,
               unsigned int const cols,
               gray         const maxval) {

    unsigned int const bytesPerSample = maxval < 256 ? 1 : 2;
    unsigned int const bytesPerRow    = cols * bytesPerSample;

    unsigned char * rowBuffer;
	rowBuffer = (unsigned char *)malloc(bytesPerRow);

    if (rowBuffer == NULL)
        return;

    if (maxval < 256)
        format1bpsRow(grayrow, cols, rowBuffer);
    else
        format2bpsRow(grayrow, cols, rowBuffer);

	PNMImage = append_to_buffer ( PNMImage, rowBuffer, lenbuffer, bytesPerRow, pos );

    free(rowBuffer);
}

static void
writePbmRowPlain(char *& PNMImage,
				 long *			 pos,
				 long *			 lenbuffer,
                 bit *  const bitrow, 
                 int    const cols) {
    
    int col, charcount;

    charcount = 0;
    for (col = 0; col < cols; ++col) {
        if (charcount >= 70)
		{
			PNMImage = append_to_buffer ( PNMImage, "\n", lenbuffer, 1, pos );
            charcount = 0;
        }
		PNMImage = append_to_buffer ( PNMImage, bitrow[col] ? "1" : "0", lenbuffer, 1, pos );
        ++charcount;
    }
	PNMImage = append_to_buffer ( PNMImage, "\n", lenbuffer, 1, pos );
}

void
ppm_writeppmrow(unsigned char *&	  PNMImage,
				long *		  pos,
				long *		  lenbuffer,
                pixel * const pixelrow, 
                int     const cols, 
                pixval  const maxval) {

	ppm_writeppmrowraw(PNMImage, pos, lenbuffer, pixelrow, cols, maxval);
}

void
pgm_writepgmrow(unsigned char *&	  PNMImage,
				long *		  pos,
				long *		  lenbuffer,
                const gray * const grayrow, 
                int          const cols, 
                gray         const maxval) {

        writepgmrowraw(PNMImage, pos, lenbuffer, grayrow, cols, maxval);
}

void
pbm_writepbmrow(char *&		  PNMImage,
				long *		  pos,
				long *		  lenbuffer,
                bit *  const bitrow, 
                int    const cols) {

        writePbmRowPlain(PNMImage, pos, lenbuffer, bitrow, cols);
}

void
pnm_writepnmrow(char *&		 PNMImage,
				long *		 pos,
				long *		 lenbuffer,
                xel *  const xelrow, 
                int    const cols, 
                xelval const maxval, 
                int    const format) {
    
    switch (PNM_FORMAT_TYPE(format)) {
    case PPM_TYPE:
        ppm_writeppmrow((unsigned char*&)PNMImage, pos, lenbuffer, (pixel*) xelrow, cols, (pixval) maxval);
        break;

    case PGM_TYPE: {
        gray* grayrow;
        unsigned int col;

        grayrow = (gray*)malloc(sizeof (gray) * cols);

        for (col = 0; col < cols; ++col)
            grayrow[col] = PNM_GET1(xelrow[col]);

        pgm_writepgmrow((unsigned char*&)PNMImage, pos, lenbuffer, grayrow, cols, (gray) maxval);

        free( grayrow );
    }
    break;

    case PBM_TYPE: {
        bit* bitrow;
        unsigned int col;

        bitrow = (bit*)malloc(sizeof(bit) * cols);

        for (col = 0; col < cols; ++col)
            bitrow[col] = PNM_GET1(xelrow[col]) == 0 ? PBM_BLACK : PBM_WHITE;

        pbm_writepbmrow(PNMImage, pos, lenbuffer, bitrow, cols);

        free(bitrow);
    }    
    break;
    }
}

void
ppm_writeppminit(char *&	  PNMImage,
				 long *		  lenbuffer,
				 long *		  pos, 
                 int    const cols, 
                 int    const rows, 
                 pixval const maxval) {

	char pBuf[256] = {0};
	long lLength = 0;

    sprintf(pBuf, "%c%c\n%d %d\n%d\n", 
            PPM_MAGIC1, 0 || maxval >= 1<<16 ? PPM_MAGIC2 : RPPM_MAGIC2, 
            cols, rows, maxval );
	lLength = strlen(pBuf);
	PNMImage = append_to_buffer(PNMImage, pBuf, lenbuffer, lLength, pos);
}

void
pgm_writepgminit(char *&	  PNMImage,
				 long *		  lenbuffer,
				 long *		  pos,
                 int    const cols, 
                 int    const rows, 
                 gray   const maxval) {

	char pBuf[256] = {0};
	long lLength = 0;

	sprintf(pBuf, "%c%c\n%d %d\n%d\n", 
            PGM_MAGIC1, 
            maxval >= 1<<16 ? PGM_MAGIC2 : RPGM_MAGIC2, 
            cols, rows, maxval );
	lLength = strlen(pBuf);
	PNMImage = append_to_buffer(PNMImage, pBuf, lenbuffer, lLength, pos);
}

void
pbm_writepbminit(char *&	  PNMImage,
				 long *		  lenbuffer,
				 long *		  pos,
                 int    const cols, 
                 int    const rows) {

	char pBuf[256] = {0};
	long lLength = 0;
	
	sprintf(pBuf, "%c%c\n%d %d\n", PBM_MAGIC1, RPBM_MAGIC2, cols, rows);
	lLength = strlen(pBuf);
	PNMImage = append_to_buffer(PNMImage, pBuf, lenbuffer, lLength, pos);
}

void
pnm_writepnminit(char *&	  PNMImage,
				 long *		  lenbuffer,
				 long *		  pos,
                 int    const cols, 
                 int    const rows, 
                 xelval const maxval, 
                 int    const format) {

    switch (PNM_FORMAT_TYPE(format)) {
    case PPM_TYPE:
        ppm_writeppminit(PNMImage, lenbuffer, pos, cols, rows, (pixval) maxval);
        break;

    case PGM_TYPE:
        pgm_writepgminit(PNMImage, lenbuffer, pos, cols, rows, (gray) maxval);
        break;

    case PBM_TYPE:
        pbm_writepbminit(PNMImage, lenbuffer, pos, cols, rows);
		break;
    }
}

static void
writePackedRawRow(unsigned char *&			  PNMImage,
				  long *					  lenbuffer,
				  long *					  pos,
                  const unsigned char * const packed_bits,
                  int                   const cols) {

	PNMImage = append_to_buffer(PNMImage, packed_bits, lenbuffer, pbm_packed_bytes(cols), pos);
}

void
pbm_writepbmrow_packed(unsigned char *&			   PNMImage,
					   long *					   lenbuffer,
					   long *					   pos, 
                       const unsigned char * const packed_bits,
                       int                   const cols) {

	writePackedRawRow(PNMImage, lenbuffer, pos, packed_bits, cols);
}

static void
writeRasterPbm(unsigned char * const BMPraster,
               int              const cols, 
               int              const rows, 
               xel              const colormap[],
			   char *&					PNMImage,
			   long *					lenbuffer,
			   long *					pos) {
/*----------------------------------------------------------------------------
  Write the PBM raster to Standard Output corresponding to the raw BMP
  raster BMPraster.  Write the raster assuming the PBM image has 
  dimensions 'cols' by 'rows'.

  The BMP image has 'cBitCount' bits per pixel, arranged in format
  'pixelformat'.

  The image must be colormapped; colormap[] is the colormap
  (colormap[i] is the color with color index i).  We cannot handle the
  abnormal case in which colormap[0] and colormap[1] have the same
  value (i.e. both white or both black.)
  
  We destroy *BMPraster as a side effect.
-----------------------------------------------------------------------------*/
    unsigned int const charBits = (sizeof(unsigned char) * 8);
        /* Number of bits in a character */
    unsigned int const colChars = pbm_packed_bytes(cols);
    
    int row;
    enum colorFormat {BlackWhite, WhiteBlack};
    enum colorFormat colorformat;
                  
    if (PPM_GETR(colormap[0]) > 0)
        colorformat = WhiteBlack;
    else                  
        colorformat = BlackWhite;
        
    for (row=0; row < rows; ++row){
        unsigned char * const bitrow = BMPraster + ( 4 * row * cols ); 

        if (colorformat == BlackWhite) {
            unsigned int i;
            for (i = 0; i < colChars; ++i) 
                bitrow[i] = ~bitrow[i]; /* flip all pixels */ 
        }   
            
        if (cols % 8 > 0) {
            /* adjust final partial byte */
            bitrow[colChars-1] >>= charBits - cols % charBits;
            bitrow[colChars-1] <<= charBits - cols % charBits;
        }
        
        pbm_writepbmrow_packed(( unsigned char *& )PNMImage, lenbuffer, pos, bitrow, cols);
    }
}

static void
writeRasterGen(unsigned char *    const BMPraster,
               int                const cols, 
               int                const rows, 
               int                const format,
               unsigned int       const cBitCount, 
               struct pixelformat const pixelformat,
               xel                const colormap[],
			   char *&					PNMImage,
			   long *					lenbuffer,
			   long *					pos) {
/*----------------------------------------------------------------------------
  Write the PNM raster to Standard Output, corresponding to the raw BMP
  raster BMPraster.  Write the raster assuming the PNM image has 
  dimensions 'cols' by 'rows' and format 'format', with maxval 255.

  The BMP image has 'cBitCount' bits per pixel, arranged in format
  'pixelformat'.

  If the image is colormapped, colormap[] is the colormap
  (colormap[i] is the color with color index i).
  
  writeRasterPbm() is faster for a PBM image.
-----------------------------------------------------------------------------*/
    xel * xelrow;
    unsigned int row;

    xelrow = (xel *)malloc(sizeof (xel) * cols);

    for (row = 0; row < rows; ++row)
	{
		convertRow(BMPraster + ( 4 * row * cols ), xelrow, cols, cBitCount, pixelformat, colormap);
        pnm_writepnmrow(PNMImage, pos, lenbuffer, xelrow, cols, bmpMaxval, format);
    }
    free(xelrow);
}

char* convertToPNM ( unsigned char * const Image, unsigned long Width, unsigned long Height, unsigned long BitCount, bool ColorPresent, bool GrayPresent, long &Count )
{
	long lPos = 0;
	long lLength = Width*Height;
	char *pPNMTmp = (char *)malloc(lLength);

	/* Format of the raster bits for a single pixel */
	struct pixelformat pixelformat;
	pixelformat = defaultPixelformat ( BitCount );

	/* Malloc'ed colormap (palette) from the BMP.  Contents of map
	undefined if not a colormapped BMP.
	*/
	xel * colormap =  { 0 };

	int outputType;

	if (ColorPresent)
        outputType = PPM_TYPE;
	else if (GrayPresent)
        outputType = PGM_TYPE;
	else
        outputType = PBM_TYPE;

	if (outputType == PBM_TYPE  && BitCount == 1)
	{
        pbm_writepbminit(pPNMTmp, &lLength, &lPos, Width, Height);
        writeRasterPbm(Image, Width, Height, colormap, pPNMTmp, &lLength, &lPos);
    }
	else
	{
		pnm_writepnminit(pPNMTmp, &lLength, &lPos, Width, Height, bmpMaxval, outputType);
		writeRasterGen(Image, Width, Height, outputType, BitCount, pixelformat, colormap, pPNMTmp, &lLength, &lPos);
	}

	if (0 >= lPos)
	{
		free (pPNMTmp);
		return NULL;
	}

	Count = lPos;

	char *pPNM = (char *)malloc(Count);
	memcpy(pPNM, pPNMTmp, Count);
	free (pPNMTmp);

	return pPNM;
}