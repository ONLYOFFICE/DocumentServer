#ifndef PM_C_UTIL_INCLUDED
#define PM_C_UTIL_INCLUDED

/* Magic constants. */

#define PPM_MAGIC1 'P'
#define PPM_MAGIC2 '3'
#define RPPM_MAGIC2 '6'
#define PPM_FORMAT (PPM_MAGIC1 * 256 + PPM_MAGIC2)
#define RPPM_FORMAT (PPM_MAGIC1 * 256 + RPPM_MAGIC2)
#define PPM_TYPE PPM_FORMAT

/* Magic constants. */
#define PBM_MAGIC1 'P'
#define PBM_MAGIC2 '1'
#define RPBM_MAGIC2 '4'
#define PBM_FORMAT (PBM_MAGIC1 * 256 + PBM_MAGIC2)
#define RPBM_FORMAT (PBM_MAGIC1 * 256 + RPBM_MAGIC2)
#define PBM_TYPE PBM_FORMAT

/* Magic constants. */
#define PGM_MAGIC1 'P'
#define PGM_MAGIC2 '2'
#define RPGM_MAGIC2 '5'
#define PGM_FORMAT (PGM_MAGIC1 * 256 + PGM_MAGIC2)
#define RPGM_FORMAT (PGM_MAGIC1 * 256 + RPGM_MAGIC2)
#define PGM_TYPE PGM_FORMAT

#define PPM_ASSIGN(p,red,grn,blu) \
  do { (p).r = (red); (p).g = (grn); (p).b = (blu); } while (0)
#define PNM_ASSIGN(x,r,g,b) PPM_ASSIGN(x,r,g,b)

/* Macro for turning a format number into a type number. */
#define PBM_FORMAT_TYPE(f) \
  ((f) == PBM_FORMAT || (f) == RPBM_FORMAT ? PBM_TYPE : -1)

/* Macro for turning a format number into a type number. */
#define PGM_FORMAT_TYPE(f) ((f) == PGM_FORMAT || (f) == RPGM_FORMAT ? PGM_TYPE : PBM_FORMAT_TYPE(f))

/* Macro for turning a format number into a type number. */
#define PPM_FORMAT_TYPE(f) \
  ((f) == PPM_FORMAT || (f) == RPPM_FORMAT ? PPM_TYPE : PGM_FORMAT_TYPE(f))

#define PNM_FORMAT_TYPE(f) PPM_FORMAT_TYPE(f)

#define pbm_packed_bytes(cols) (((cols)+7)/8)

typedef unsigned int gray;
typedef gray pixval;

typedef struct {
    pixval r, g, b;
} pixel;

#define PPM_GETR(p) ((p).r)
#define PPM_GETG(p) ((p).g)
#define PPM_GETB(p) ((p).b)

typedef pixel xel;
typedef pixval xelval;

#define PNM_GET1(x) PPM_GETB(x)

typedef unsigned char bit;
#define PBM_WHITE 0
#define PBM_BLACK 1

/* NOTE: do not use "bool" as a type in an external interface.  It could
   have different definitions on either side of the interface.  Even if both
   sides include this interface header file, the conditional compilation
   here means one side may use the typedef below and the other side may
   use some other definition.  For an external interface, be safe and just
   use "int".
*/

/* We used to assume that if TRUE was defined, then bool was too.
   However, we had a report on 2001.09.21 of a Tru64 system that had
   TRUE but not bool and on 2002.03.21 of an AIX 4.3 system that was
   likewise.  So now we define bool all the time, unless the macro
   HAVE_BOOL is defined.  If someone is using the Netpbm libraries and
   also another library that defines bool, he can either make the
   other library define/respect HAVE_BOOL or just define HAVE_BOOL in
   the file that includes pm_config.h or with a compiler option.  Note
   that C++ always has bool.  

   A preferred way of getting booleans is <stdbool.h>.  But it's not
   available on all platforms, and it's easy to reproduce what it does
   here.
*/
#ifndef TRUE
  #define TRUE 1
  #endif
#ifndef FALSE
  #define FALSE 0
#endif

#endif
