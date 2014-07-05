/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2009 Joerg Schulenburg

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

 see README for EMAIL address
 */

#include <stdio.h>
#include <stdlib.h>
#include "gocr.h"
#include "pnm.h"
#include "pgm2asc.h"
#include <string.h>
#include <time.h>

#define Blen  256

// load boxes from database into boxlist (for faster access)
//   used as alternate engine, comparing chars with database
int load_db(void) {
  FILE *f1;
  char s1[Blen+1],
       s2[Blen+1] = "./db/", /* ToDo: replace by constant! by configure */
       *s3;
  int i, j, ii, i2, line;
  struct box *box1;
  pix *pp;

  if( JOB->cfg.db_path ) strncpy(s2,JOB->cfg.db_path,Blen-1);
  i2=strlen(s2);
  if (JOB->cfg.verbose)
    fprintf(stderr, "# load database %s %s ... ",s2,JOB->cfg.db_path);

  strncpy(s2+i2,"db.lst",Blen-i2);s2[Blen]=0;
  f1 = fopen(s2, "r");
  if (!f1) {
    fprintf(stderr, " DB %s not found\n",s2);
    return 1;
  }

  line = 0; /* line counter for better error report */
  for (ii = 0; !feof(f1); ii++) {
/* bbg: should write a better input routine */
    if (!fgets(s1, Blen, f1)) break; line++;
    j = strlen(s1);
    /* remove carriage return sequences from line */
    while (j > 0 && (s1[j - 1] == '\r' || s1[j - 1] == '\n'))
      s1[--j] = 0;
    if (!j)         continue;   /* skip empty line */
    if (s1[0]=='#') continue;   /* skip comments (v0.44) */
    /* copy file name */
    for (i = 0; i < j && i+i2 < Blen && strchr(" \t,;",s1[i]) == 0; i++)
      s2[i2 + i] = s1[i];
    s2[i2+i]=0;
    /* skip spaces */
    for (; i < j && strchr(" \t",s1[i]) != 0; i++);
    /* by now: read pix, fill box, goto next ??? */
    pp = (pix *)malloc(sizeof(pix));
    if( !pp ) fprintf(stderr,"malloc error in load_db pix\n");

    // if (JOB->cfg.verbose) fprintf(stderr,"\n# readpgm %s ",s2);
    if (readpgm(s2, pp, 0 * JOB->cfg.verbose)!=0) {
      fprintf(stderr,"\ndatabase error: readpgm %s\n", s2);
      exit(-1);
    }

    box1 = (struct box *)malloc_box(NULL);
    if(!box1) fprintf(stderr,"malloc error in load_db box1\n");
    box1->x0 = 0;
    box1->x1 = pp->x-1;       // white border 1 pixel width
    box1->y0 = 0;
    box1->y1 = pp->y-1;
    box1->x = 1;
    box1->y = 1;
    box1->dots = 0;
    box1->c = 0;
    box1->modifier = 0; /* ToDo: obsolete */
    box1->tas[0]=NULL;
    box1->tac[0]=0;
    box1->wac[0]=100; /* really 100% sure? */
    box1->num_ac=1;
    if (s1[i]=='"'){  /* parse a string */
      j=strrchr(s1+i+1,'"')-(s1+i+1); /* we only look for first and last "" */
      if (j>=1) {
        s3=(char *)malloc(j+1);
        if (!s3) fprintf (stderr, "malloc error in load_db s3\n");
        if (s3) {
          memcpy(s3,s1+i+1,j);
          s3[j]=0;
          box1->tas[0]=s3;
          // fprintf(stderr,"\nstring=%s",s3);
        }
      } else { fprintf(stderr,"load_db: string parse error L%d\n",line); }
    } else {
      box1->tac[0] = box1->c = s1[i];      /* try to interpret as ASCII */
      /* we can live without hexcode in future if we use UTF8-strings */
      s3=s1+i;
      j=strtol( s1+i, &s3, 16); /* try to read 4 to 8 digit hex unicode */
      /* if its an hexcode, ASCII interpretation is overwritten */
      if( j && i+3<=Blen && s3-s1-i>3 ) box1->tac[0] = box1->c = j;
      // fprintf(stderr,"\nhexcode=%04x=%04x %d",(int)j,(int)box1->c,s3-s1-i);
    }
    box1->num = 0;
    box1->line = -1;
    box1->m1 = 0;  /* ToDo: should be given too in the database! */
    box1->m2 = 0;
    box1->m3 = 0;
    box1->m4 = 0;
    box1->p = pp;
    list_app(&JOB->tmp.dblist, box1);	// append to list
#if 0
     out_x(box1);
#endif
  }
  fclose(f1);
  if (JOB->cfg.verbose)
    fprintf(stderr, " %d chars loaded\n", ii);
  return 0;
}

// expand database from box/boxlist name=db_$utime.pbm
// this is added in version v0.3.3
int store_db(struct box *box1) {
  FILE *f1;
  char s2[Blen+1] = "./db/", s3[Blen+1];
  int i2, dx, dy;
  unsigned c_out;
  pix b;	/* temporary mini page */

  if( JOB->cfg.db_path ) strncpy(s2,JOB->cfg.db_path,Blen-1);
  i2=strlen(s2);
  
  /* add (first) char and time to the file name for better debugging */
 
  /* decide between 7bit ASCII and UTF8-char or string */
  c_out =  ((box1->num_ac && box1->tas[0]) ?
         (unsigned char )box1->tas[0][0] /* char  */ :
                         box1->c         /* wchar */);
  /* (unsigned int)((         char)0x80) = 0xffffff80 */
  /* (unsigned int)((unsigned char)0x80) = 0x00000080 */
 
  /* name generation can cause problems, if called twice within a second */
  sprintf(s3,"db_%04x_%08lx.pbm", c_out, (unsigned long)time(NULL));
  /* ToDo: the file name may be not unique */
  
  strncpy(s2+i2,"db.lst",Blen-i2);s2[Blen]=0;
  f1 = fopen(s2, "a");
  if (!f1) {
    fprintf(stderr, " could not access %s\n",s2);
    return 1;
  }
  strncpy(s2+i2,s3,strlen(s3)); s2[i2+strlen(s3)]=0;
  /* store image and infos about the char */
  /* ToDo: store the vector list instead of the pixelarray */
  
  if (JOB->cfg.verbose)
    fprintf(stderr, "store_db: add file %s to database (nac=%d c=%04x)"
      "\n#",s3, box1->num_ac, c_out);

  dx=box1->x1-box1->x0+1;
  dy=box1->y1-box1->y0+1;
  b.p = (unsigned char *) malloc( dx * dy );
  if( !b.p ){
    fprintf( stderr, "\nFATAL: malloc failed, skip store_db" );
    return 2;
  }
  if (copybox(box1->p, box1->x0, box1->y0, dx, dy, &b, dx * dy))
    return -1;
                          
  writepbm(s2,&b); /* What is to do on error? */
  free(b.p);

  /* store the database line */
  /* some infos about box1->m1,..,m4 should added (base line, high etc.) */
  if (box1->num_ac && box1->tas[0]) {
    fprintf(f1, "%s \"%s\"\n",s3,box1->tas[0]);
    /* ToDo: what if tas contains '"'? */
  } else {
    if( (box1->c >= '0' && box1->c <= '9')
     || (box1->c >= 'A' && box1->c <= 'Z')
     || (box1->c >= 'a' && box1->c <= 'z') )
      fprintf(f1, "%s %c\n",s3,(char)box1->c);
    else {
      if (((box1->c)>>16)>>16)
        fprintf(f1, "%s %08x\n",s3,(unsigned int)box1->c);
      else
        fprintf(f1, "%s %04x\n",s3,(unsigned int)box1->c);
    }
  }
  fclose(f1);
  return 0;
}

/* function is only for user prompt on console to identify chars
   it prints out a part of pixmap b at point x0,y0 to stderr
   using dots .,; if no pixel, and @xoO for pixels
 */
void out_env(struct box *px ){
  int x0,y0,x1,y1,dx,dy,x,y,x2,y2,yy0,tx,ty,i,cs;
  char c1, c2; pix *b;
  cs=JOB->cfg.cs;
  yy0=px->y0;
  { /* overwrite rest of arguments */
    b=px->p;
    x0=px->x0; x1=px->x1; dx=x1-x0+1;
    y0=px->y0; y1=px->y1; dy=y1-y0+1;
    y0-=2; y1+=2; 
    if (px->m4 && y0>px->m1) y0=px->m1;
    if (px->m4 && y1<px->m4) y1=px->m4;
    if (x1-x0+1<52) { x0-=10; x1+=10; } /* fragment? expand frame */
    if (x1-x0+1<52) { x0-=10; x1+=10; } /* fragment? expand frame */
    if (x1-x0+1<62) { x0-=5;  x1+=5; }
    if (y1-y0+1<10) { y0-= 4; y1+= 4; } /* fragment? */
    if (x0<0) x0=0;  if (x1>=b->x) x1=b->x-1; 
    if (y0<0) y0=0;  if (y1>=b->y) y1=b->y-1; 
    dx=x1-x0+1;
    dy=y1-y0+1; yy0=y0;
    fprintf(stderr,"\n# show box + environment");
    fprintf(stderr,"\n# show box     x= %4d %4d d= %3d %3d r= %d %d",
	  px->x0, px->y0, px->x1 - px->x0 + 1, px->y1 - px->y0 + 1,
	  px->x - px->x0, px->y - px->y0);
    if (px->num_ac){ /* output table of chars and its probabilities */
      fprintf(stderr,"\n# list box char: ");
      for(i=0;i<px->num_ac && i<NumAlt;i++)
      /* output the (xml-)string (picture position, barcodes, glyphs, ...) */
        if (px->tas[i])
         fprintf(stderr," %s(%d)",       px->tas[i]       ,px->wac[i]);
        else
         fprintf(stderr," %s(%d)",decode(px->tac[i],ASCII),px->wac[i]);
    }
    fprintf(stderr,"\n");
    if (px->dots && px->m2 && px->m1<y0) { yy0=px->m1; dy=px->y1-yy0+1; }
  }
  tx=dx/80+1;
  ty=dy/40+1; // step, usually 1, but greater on large maps 
  fprintf(stderr,"# show pattern x= %4d %4d d= %3d %3d t= %d %d\n",
                 x0,y0,dx,dy,tx,ty);
  if (dx>0)
  for(y=yy0;y<yy0+dy;y+=ty) { /* reduce the output to max 78x40 */

    /* image is the boxframe + environment in the original bitmap */
    for(x=x0;x<x0+dx;x+=tx){  /* by merging sub-pixels */
      c1='.';
      for(y2=y;y2<y+ty && y2<y0+dy;y2++) /* sub-pixels */
      for(x2=x;x2<x+tx && x2<x0+dx;x2++)
        { if((getpixel(b,x2,y2)<cs)) c1='#'; }
      // show pixels outside the box thinner/weaker
      if (x+tx-1 < px->x0 || x > px->x1
       || y+ty-1 < px->y0 || y > px->y1) c1=((c1=='#')?'O':',');
      fprintf(stderr,"%c", c1 );
    }

    c1=c2=' ';
    /* mark lines with < */
    if (px) if (y==px->m1 || y==px->m2 || y==px->m3 || y==px->m4)  c1='<';
    if (y==px->y0 || y==px->y1)  c2='-';  /* boxmarks */
    fprintf(stderr,"%c%c\n",c1,c2);
  }
}


/*
// second variant, for database (with slightly other behaviour)
// new variant
//  look at the environment of the pixel too (contrast etc.)
//   detailed analysis only of diff pixels!
//
// 100% * distance, 0 is best fit
// = similarity of 2 chars for recognition of noisy chars
//   weigth of pixels with only one same neighbour set to 0
//   look at contours too!
   ToDo: especially on small boxes distance should only be 0 if
       characters are 100% identical! 
*/
// #define DEBUG 2
int distance2( pix *p1, struct box *box1,
               pix *p2, struct box *box2, int cs){
   int rc=0,x,y,v1,v2,i1,i2,rgood=0,rbad=0,
       x1,y1,x2,y2,dx,dy,dx1,dy1,dx2,dy2,tx,ty;
#if DEBUG == 2
  if(JOB->cfg.verbose)
    fprintf(stderr," DEBUG: distance2\n");
#endif
   x1=box1->x0;y1=box1->y0;x2=box2->x0;y2=box2->y0;
   dx1=box1->x1-box1->x0+1; dx2=box2->x1-box2->x0+1; dx=((dx1>dx2)?dx1:dx2);dx=dx1;
   dy1=box1->y1-box1->y0+1; dy2=box2->y1-box2->y0+1; dy=((dy1>dy2)?dy1:dy2);dy=dy1;
   if(abs(dx1-dx2)>1+dx/16 || abs(dy1-dy2)>1+dy/16) rbad++; // how to weight?
   // compare relations to baseline and upper line
   if(box1->m4>0 && box2->m4>0){  // used ???
     if(2*box1->y1>box1->m3+box1->m4 && 2*box2->y1<box2->m3+box2->m4) rbad+=128;
     if(2*box1->y0>box1->m1+box1->m2 && 2*box2->y0<box2->m1+box2->m2) rbad+=128;
   }
   tx=dx/16; if(dx<17)tx=1; // raster
   ty=dy/32; if(dy<33)ty=1;
   // compare pixels
   for( y=0;y<dy;y+=ty )
   for( x=0;x<dx;x+=tx ) {	// try global shift too ???
     v1=((getpixel(p1,x1+x*dx1/dx,y1+y*dy1/dy)<cs)?1:0); i1=8;	// better gray?
     v2=((getpixel(p2,x2+x*dx2/dx,y2+y*dy2/dy)<cs)?1:0); i2=8;	// better gray?
     if(v1==v2) { rgood+=16; continue; } // all things are right!
     // what about different pixel???
     // test overlapp of surounding pixels ???
     v1=1; rbad+=4;
     v1=-1;
     for(i1=-1;i1<2;i1++)
     for(i2=-1;i2<2;i2++)if(i1!=0 || i2!=0){
       if( ((getpixel(p1,x1+x*dx1/dx+i1*(1+dx1/32),y1+y*dy1/dy+i2*(1+dy1/32))<cs)?1:0)
         !=((getpixel(p2,x2+x*dx2/dx+i1*(1+dx2/32),y2+y*dy2/dy+i2*(1+dy2/32))<cs)?1:0) ) v1++;
     }
     if(v1>0)
     rbad+=16*v1;
   }
   if(rgood+rbad) rc= 100*rbad/(rgood+rbad); else rc=99;
   /* if width/high is not correct add badness */
   rc += ( abs(dx1*dy2-dx2*dy1) * 10 ) / (dy1*dy2);
   if (rc>100) rc=100;
   if(/* rc<10 && */ JOB->cfg.verbose /* &1024 */){
#if DEBUG == 2
     fprintf(stderr," distance2 rc=%d rgood=%d rbad=%d\n",rc,rgood,rbad);
//     out_b(NULL,p1,box1->x0,box1->y0,box1->x1-box1->x0+1,
//                                box1->y1-box1->y0+1,cs);
//     out_b(NULL,p2,box2->x0,box2->y0,box2->x1-box2->x0+1,
//                                box2->y1-box2->y0+1,cs);
     out_x(box1);
     out_x(box2);
#endif
   }
   return rc;
}

wchar_t ocr_db(struct box *box1) {
  int dd = 1000, dist = 1000;
  wchar_t c = UNKNOWN;
  unsigned char buf[200]; /* Oct08 JS: add unsigned to avoid UTF problems */
  Box *box2, *box3;
  
  if (!list_empty(&JOB->tmp.dblist)){ 
    box3 = (Box *)list_get_header(&JOB->tmp.dblist);
    if(JOB->cfg.verbose)
      fprintf(stderr,"\n#DEBUG: ocr_db (%d,%d) ",box1->x0, box1->y0);

    for_each_data(&JOB->tmp.dblist) {
      box2 = (Box *)list_get_current(&JOB->tmp.dblist);
      /* do preselect!!! distance() slowly */
      dd = distance2( box2->p, box2, box1->p, box1, JOB->cfg.cs);
      if (dd <= dist) {  /* new best fit */ 
        dist = dd;
        box3 = box2; /* box3 is a pointer and not copied box2 */

        if (dist<100 && 100-dist >= JOB->cfg.certainty) {
          /* some deviation of the pattern is tolerated */
          int i, wa;
          for (i=0;i<box3->num_ac;i++) {
           wa = (100-dist)*box3->wac[i]/100; /* weight *= (100-dist) */
           if (box3->tas[i]) setas(box1,box3->tas[i],wa);
           else              setac(box1,box3->tac[i],wa);
          }
          if (box3->num_ac) c=box3->tac[0]; /* 0 for strings (!UNKNOWN) */
          if (JOB->cfg.verbose)
            fprintf(stderr, " dist=%4d c= %c 0x%02x %s  wc= %3d", dist,
               ((box3->c>32 && box3->c<127) ? (char) box3->c : '.'),
               (int)box3->c, ((box3->tas[0])?box3->tas[0]:""), box3->wac[0]);
        }
        if (dd<=0 && ((box3->num_ac && box3->tas[0]) || box3->c >= 128
                       || !strchr ("l1|I0O", box3->c)))
          break; /* speedup if found */
      }
    } end_for_each(&JOB->tmp.dblist);
    
  }

  if( (JOB->cfg.mode&128) != 0 && c == UNKNOWN ) { /* prompt the user */
    /* should the output go to stderr or special pipe??? */
    int utf8_ok=0;  /* trigger this flag if input is ok */
    int i, endchar; /* index */
    out_env(box1);  /* old: out_x(box1); */
    fprintf(stderr,"The above pattern was not recognized.\n"
      "Enter UTF8 char or string for above pattern. Leave empty if unsure.\n"
      "Press RET at the end (ALT+RET to store into RAM only) : "
    );  /* ToDo: empty + alt-return (0x1b 0x0a) for help? ^a for skip all */
    /* UTF-8 (man 7 utf-8):
     *   7bit = 0xxxxxxx                            (0000-007F)
     *  11bit = 110xxxxx 10xxxxxx                   (0080-07FF)
     *  16bit = 1110xxxx 10xxxxxx 10xxxxxx          (0800-FFFF)
     *  21bit = 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
     *  26bit = 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
     *  31bit = 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
     */
    buf[0]=0;
    /* shift/ctrl/altgr-enter acts like enter or ^j or ^m,
     * alt-enter returns 0x1b 0x0a and returns from fgets()
     * ^d (EOF) returns (nil) from fgets()
     * x+(2*)ctrl-d returns from fgets() without returning a 0x0a
     * if not UTF-input-mode, we are in trouble?
     * ^a=0x01, ^b=0x02, ^e=05, ..., ToDo: meaning of no-input or <=space
     */
    fgets((char *)buf,200,stdin); /* including \n=0x0a */
    dd=strlen((char *)buf);
    /* output hexcode if verbose set */
    if (JOB->cfg.verbose) {
      fprintf(stderr, "\n# fgets [%d]:", dd);
      for(i=0; i<dd; i++)
        fprintf(stderr, " %02x", (unsigned)((unsigned char)buf[i]));
      fprintf(stderr, "\n#");
    }
    /* we dont accept chars which could destroy database file */
    for (i=0; i<dd; i++) if (buf[i]<32) break; /* need unsigned char here */
    endchar=buf[i]; /* last char is 0x0a (ret) 0x00 (EOF) or 0x1b (alt+ret) */
    if (endchar==0x01) { i=0;JOB->cfg.mode&=~128; } /* skip all */
    buf[dd=i]=0; /* replace final 0x0a or other special codes */
    if (dd==1 && !(buf[0]&128)) { c=buf[0]; utf8_ok=1; } /* single char */
    if (dd>1 && dd<7) {        /* try to decode single wide char (utf8) */ 
      int u0, u1;  /* define UTF8-start sequences, u0=0bits u1=1bits */
      u0=       1<<(7-dd);       /* compute start byte from UTF8-length */
      u1=255&~((1<<(8-dd))-1);
      /* count number of following 10xxxxxx bytes to i */
      for (i=1;i<dd;i++) if ((buf[i]&0xc0)!=0x80) break; /* 10xxxxxx */
      if (i==dd && (buf[0]&(u0|u1))==u1) { utf8_ok=1;
        c=buf[0]&(u0-1);                                 /* 11..0x.. */
        for (i=1;i<dd;i++) { c<<=6; c|=buf[i]&0x3F; }    /* 10xxxxxx */
      }
    }
    if (dd>0){ /* ToDo: skip space and tab too? */
      if (utf8_ok==1) { setac(box1, c, 100); } /* store single wchar */
      if (utf8_ok==0) {     /* store a string of chars (UTF8-string) */
        c='_'; /* what should we do with c? probably a bad idea? */
        setas(box1, (char *)buf, 100);
      }
      /* decide between
       *  0) just help gocr to find the results and (dont remember, 0x01)
       *  1) help and remember in the same run (store to memory, 0x1b)
       *  2) expand the database (dont store ugly chars to the database!)
       */
      if (endchar!=0x01){ /* ^a before hit return */
      /* is there a reason to dont store to memory? */
        list_app(&JOB->tmp.dblist, box1); /* append to list for 1+2 */
      }
      if (endchar!=0x01 && endchar!=0x1b){
        store_db(box1);  /* store to disk for 2 */
      }
      if (JOB->cfg.verbose)
        fprintf(stderr, " got  char= %c  16bit= 0x%04x  string= \"%s\"\n",
           ((c>32 && c<127)?(char)c:'.'), (int)c, buf);
    }
  }
  
  return c;
}
