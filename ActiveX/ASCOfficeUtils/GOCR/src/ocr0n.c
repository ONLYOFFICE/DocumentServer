/* ocr-engine numbers only */
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

 see README for EMAIL-address

   OCR engine (c) Joerg Schulenburg
   first engine: rule based --- numbers 0..9

*/

#include <stdlib.h>
#include <stdio.h>
/* #include "pgm2asc.h" */
#include "ocr0.h"
#include "ocr1.h"
#include "amiga.h"
#include "pnm.h"
#include "gocr.h"

/* only for debugging and development */
#define IFV if(JOB->cfg.verbose&4)
#define MM {IFV fprintf(stderr,"\nDBG %c L%04d (%d,%d): ",(char)c_ask,__LINE__,box1->x0,box1->y0);}

/* the old debug mode (0.40) was only for a special char, for another char
 *   code must be recompiled with C_ASK='char'
 * new debug mode (0.41) explains why char is declined or accepted as ABC...
 *   the output can be filtered by external scripts
 *   ToDo: we could reduce output to filter string
 */
#ifndef DO_DEBUG       /* can be defined outside */
#define DO_DEBUG 0     /* 0 is the default */
#endif

/* this macro is for debugging output: "if char is declined, why?" */
#if DO_DEBUG   /* 0=Work mode, 1=debugging mode */
// Setac: output, that char is choosen with a probability
// Break: output, why the char is not choosen
// MSG: debugging functions for char C_ASK, mostly messages
// DBG: definitions usefull only for debugging
#define Setac(box1,ac,ad)  { MM;IFV fprintf(stderr,"setac %d",ad);setac(box1,ac,ad); }
#define Break              { MM;IFV fprintf(stderr,"break"); break; }
#define MSG(x)             { MM;IFV x }
#define DBG(x) x
#else
#define Setac(box1,ac,ad)  setac(box1,ac,ad)
#define Break break
#define MSG(x)
#define DBG(x)
#endif

/* extern "C"{ */

// OCR engine ;)
wchar_t ocr0n(ocr0_shared_t *sdata){
   struct box *box1=sdata->box1;
   pix  *bp=sdata->bp;
   int	d,x,y,x0=box1->x0,x1=box1->x1,y0=box1->y0,y1=box1->y1;
   int  dx=x1-x0+1,dy=y1-y0+1,cs=sdata->cs;	// size
   int  xa,xb,ya,yb, /* tmp-vars */
        i1,i2,i3,i4,i,j;
   int (*aa)[4]=sdata->aa;    /* corner-points, (x,y,dist^2,vector_idx) */
   wchar_t bc=UNKNOWN;				// best char
   int  ad=0;		// propability 0..100
   int hchar=sdata->hchar;	// char is higher than 'e'
   int gchar=sdata->gchar;	// char has ink lower than m3
   int dots=box1->dots;
   // --- test 5 near S ---------------------------------------------------
   for(ad=d=100;dx>2 && dy>4;){     // min 3x4
      DBG( char c_ask='5'; )
      if (sdata->holes.num > 1) Break; /* be tolerant */
      if( num_cross(  dx/2,  dx/2,0,dy-1,bp,cs)!=3
      &&  num_cross(5*dx/8,3*dx/8,0,dy-1,bp,cs)!=3 ) Break;

      i1=loop(bp,dx-1,dy-1,dx,cs,0,LE);
      i2=loop(bp,dx-1,dy-2,dx,cs,0,LE);
      if (i2-i1 >= dx/4) Break; // ~{  5x7font

      // get the upper and lower hole koords, y around dy/4 ???
      x=5*dx/8;
      y  =loop(bp,x,0,dy,cs,0,DO); if(y>dy/8) Break;
      y +=loop(bp,x,y,dy,cs,1,DO); if(y>dy/4) Break;
      i1 =loop(bp,x,y,dy,cs,0,DO)+y; if(i1>5*dy/8) Break;
      i3=y=(y+i1)/2; // upper end can be shifted to the right for italic
      x  =loop(bp,0,y,dx,cs,0,RI); if(x>4*dx/8) Break;
      x +=loop(bp,x,y,dx,cs,1,RI); if(x>5*dx/8) Break;
      i1 =loop(bp,x,y,dx,cs,0,RI); i1=(i1+2*x)/2; // upper center (i1,i3)
      y=11*dy/16;
      x  =loop(bp,dx-1  ,y,dx,cs,0,LE); if(x>dx/4) Break;
      x +=loop(bp,dx-1-x,y,dx,cs,1,LE); if(x>dx/2) Break;
      i2 =loop(bp,dx-1-x,y,dx,cs,0,LE); i2=dx-1-(i2+2*x)/2; // lower center x

      MSG( fprintf(stderr,"i1,i3=%d,%d i2=%d (upper+lower center)",i1,i3,i2);)

      y  =loop(bp,i1,0,dy,cs,0,DO);
      y +=loop(bp,i1,y,dy,cs,1,DO);
      y  =(3*y+i3)/4;
      if( num_cross( i1, dx-1, y, y,bp,cs)>0 ){ /* S or serif5 ? */
        y  =loop(bp,i1  ,i3,dy,cs,0,DO);
        i  =loop(bp,i1-1,i3,dy,cs,0,DO);
        if (y>i ) ad=99*ad/100; /* looks like S */
        y  =loop(bp,i1  ,i3,dy,cs,0,UP);
        i  =loop(bp,i1+1,i3,dy,cs,0,UP);
        if (i<y ) ad=99*ad/100; /* looks like S */
        x  =loop(bp,dx-1,0,dx,cs,0,LE);
        i  =loop(bp,dx-1,1,dx,cs,0,LE);
        if (x>i ) ad=99*ad/100; /* looks like S */
        if( num_cross(   0, dx/2, dy-1, dy-1,bp,cs)>1 
         && num_cross( dx/2,dx-1,    0,    0,bp,cs)>1 ) ad=98*ad/100; /* serifs */
        if (loop(bp,0,dy-1,dx,cs,0,RI)==0) ad=98*ad/100; /* S or 7segment */
        ad=99*ad/100;
      }

      for(y=dy/5;y<3*dy/4;y++) // right gap?
      if( num_cross(i1,dx-1,y,y,bp,cs)==0 ) break;
      if( y==3*dy/4 ) Break;

      for(y=dy/4;y<=11*dy/16;y++) // left gap?
      if( num_cross(0,i2,y,y,bp,cs)==0 ) break;
      if( y>11*dy/16 ) Break;

      // if( num_hole( x0, x1, y0, y1, box1->p,cs,NULL) > 0 ) break;
      if (sdata->holes.num>0) Break;

      // sS5 \sl z  left upper v-bow ?
      for(x=dx,i=y=dy/4;y<dy/2;y++){
        j=loop(bp,0,y,dx,cs,0,RI); if(j<x) { x=j; i=y; }
      } y=i;
      i1=loop(bp,0,   dy/16     ,dx,cs,0,RI);
      i2=loop(bp,0,(y+dy/16)/2  ,dx,cs,0,RI);
      i =loop(bp,0,(y+dy/16)/2+1,dx,cs,0,RI); if( i>i2 ) i2=i;
      i3=loop(bp,0, y  ,dx,cs,0,RI);
      i =loop(bp,0, y-1,dx,cs,0,RI); if( i<i3 ) i3=i;
      if( 2*i2+1+dx/16 < i1+i3 ) Break;
      
      if( dy>=20 && dx<16 ) /* tall S */
      if(  loop(bp,0,   dy/5     ,dx,cs,0,RI)
         ==loop(bp,0,   dy/4     ,dx,cs,0,RI)
         &&
           loop(bp,0,   dy/10    ,dx,cs,0,RI)
          >loop(bp,0,   dy/4     ,dx,cs,0,RI)
         &&
           loop(bp,0,       1    ,dx,cs,0,RI)
          >loop(bp,0,   dy/4     ,dx,cs,0,RI)+1
         &&
           loop(bp,dx-1,    0    ,dx,cs,0,LE)
          >loop(bp,dx-1,    1    ,dx,cs,0,LE) ) Break;

      if( dy>=30 && dx>15 ) /* large S */
      if(   loop(bp,dx/4,3*dy/10,dy,cs,1,DO)>0 ) // check start
      if(   loop(bp,dx-2,3*dy/4 ,dy,cs,1,UP)>0 ) // check end
      if( num_cross(dx/4,dx-2,3*dy/10,3*dy/4,bp,cs)==1 ) Break; // connected?
      MSG(fprintf(stderr,"~S ad=%d",ad);)
      
      // small fat s is very similar to rounded serif 5
      //   but has a fat diagonal arrea (Oct08 JS)
      if ( num_cross(dx/8,dx-1-dx/8,3*dy/10,3*dy/4,bp,cs)==1 ) ad=98*ad/100;
      MSG(fprintf(stderr,"~S ad=%d",ad);)

      if( dy>17 && dx>9 ) /* S */
      if(   loop(bp,   0,dy/2   ,dx,cs,0,RI)<dx/2
        ||  loop(bp,   0,dy/2-1 ,dx,cs,0,RI)<dx/2 )
      if(   loop(bp,dx/4,3*dy/10,dy,cs,1,DO)>0 ) // check start
      if(   loop(bp,dx-2,2*dy/3 ,dy,cs,1,UP)>0 ) // check end
      if(   loop(bp,   0,      dy/16,dx,cs,0,RI)
        >=  loop(bp,dx-1, dy-1-dy/16,dx,cs,0,LE) ) ad=ad*98/100;
      MSG(fprintf(stderr,"~S ad=%d",ad);)
      if(   loop(bp,3*dx/4  ,   0,dy,cs,1,DO) // ToDo: improve!
         <  loop(bp,  dx/4  ,dy-1,dy,cs,1,UP)
       &&   loop(bp,3*dx/4-1,   0,dy,cs,0,DO)
         <  loop(bp,  dx/4+1,dy-1,dy,cs,0,UP) ) ad=ad*98/100;
      MSG(fprintf(stderr,"~S ad=%d",ad);)

      if ( gchar) ad=99*ad/100;
      if (!hchar) ad=99*ad/100;
      Setac(box1,(wchar_t)'5',ad);
      if (ad==100) return '5';
      break;
      
   }
   // --- test 1 ---------------------------------------------------
   for(ad=d=100;dy>4 && dy>dx && 2*dy>box1->m3-box1->m2;){     // min 3x4
      DBG( char c_ask='1'; )
      if( dots==1 ) Break;
      if (sdata->holes.num > 1) Break; /* be tolerant */

      if( num_cross(0, dx-1, 0  , 0  ,bp,cs) != 1
       && num_cross(0, dx-1, 1  , 1  ,bp,cs) != 1 ) Break;
      if( num_cross(0, dx-1,dy/2,dy/2,bp,cs) != 1 ) Break;
      if( num_cross(0, dx-1,dy-1,dy-1,bp,cs) != 1
       && num_cross(0, dx-1,dy-2,dy-2,bp,cs) != 1 ) Break;
      /*  5x7  micr      ocr-a
      
               ooo        @@@..
          .$.  ooo        ..@..
          $@.   oo        ..@..
          .$.   oo        ..@..
          .@.  ooooo      ..@.@
          .$.  ooooo      ..@.@
          $@$  ooooo      @@@@@
          
       */
      i4=0; // human font
      if( num_cross(0, dx-1,3*dy/4,3*dy/4,bp,cs) != 2 ) { // except ocr-a
        for( y=1; y<dy/2; y++ ){
          if( num_cross(0, dx-1, y  , y  ,bp,cs) == 2 ) break;
        } if (y>=dy/2) ad=98*ad/100;
        for( i=dy/8,y=7*dy/16;y<dy-1 && i;y++ ){
          if( num_cross(0, dx-1, y  , y  ,bp,cs) != 1 ) i--;
        } if( dy>8 && !i ) Break;
      } else {  // ocr-a-1
        i=  loop(bp,dx/2,0,dy,cs,0,DO);
        if (loop(bp,dx/2,i,dy,cs,1,DO)<dy-1) Break;
        i=  loop(bp,dx  -1,dy-1-dy/16,dx,cs,0,LE);
        if (loop(bp,dx-i-1,dy-1-dy/16,dx,cs,1,LE)<dx-1) Break;
        i=  loop(bp,0,dy/16,dx,cs,0,RI);
        if (loop(bp,i,dy/16,dx,cs,1,RI)<dx/2) Break;
        i4=1;
        MSG(fprintf(stderr,"ocr-a-1 detected ad= %d", ad);)
      }

      if( num_cross(0, dx-1, 0  , 0  ,bp,cs) > 1
       && num_cross(0, dx-1, 1  , 1  ,bp,cs) > 1 ) Break; // ~/it_7

      // calculate upper and lower mass center (without lower serif)

      x =loop(bp,0,7*dy/8-1,dx,cs,0,RI);   i2=x;
      x+=loop(bp,x,7*dy/8-1,dx,cs,1,RI)-1; i2=(i2+x)/2;

      i1=loop(bp,dx-1  ,1+0* dy/4,dx,cs,0,LE); i1=dx-1-i1-(x-i2)/2;

      x =(i1-i2+4)/8; i1+=x; i2-=x;
      
      if( get_line2(i1,0,i2,dy-1,bp,cs,100)<95 ) { // dont work for ocr-a-1
        i1=loop(bp,dx-1  ,1+0* dy/4,dx,cs,0,LE); i1=dx-1-i1;
        if( get_line2(i1,0,i2,dy-1,bp,cs,100)<95 ) Break;
      }
      // upper and lower width
      x =loop(bp,(i1+i2)/2,dy/2,dx,cs,1,RI); i=x; i3=0;
      for(y=0;y<7*dy/8;y++)
        if( loop(bp,i1+y*(i2-i1)/dy, y,dx,cs,1,RI)-i > 1+dx/8 ) break;
      if(y<7*dy/8) ad=98*ad/100; // serif or ocr-a-1 ?
      if(y<6*dy/8) ad=99*ad/100; /*  MICR E-13B font Jan07 */
      if(y<4*dy/8) Break;
      MSG(fprintf(stderr,"i12 %d %d ad= %d", i1,i2,ad);)
// out_x(box1); printf(" i12=%d %d\n",i1,i2);
      x =loop(bp,i2,dy-1,dx,cs,1,LE); j=x;
      x =loop(bp,i2,dy-2,dx,cs,1,LE); if(x>j)j=x; i=j;
      x =loop(bp,i2,dy-1,dx,cs,1,RI); j=x;
      x =loop(bp,i2,dy-2,dx,cs,1,RI); if(x>j)j=x;
      if(abs(i-j)>1+dx/8) i3|=1;
      if(i3) Break;        
//       out_x(box1);printf(" 11 i=%d j=%d i2=%d dx=%d\n",i,j,i1,dx);
      // get most left upper point (i,j)
      for(i=dx,j=y=0;y<7*dy/16;y++){
        x =loop(bp,0,y,dx,cs,0,RI); if(x<i) { i=x;j=y; }
      }  
      if ( i1-i<7*dx/16 ) ad=ad*98/100;
      if ( i1-i<6*dx/16 ) ad=ad*98/100; // 4*dx/8 => 7*dx/16  MICR E-13B font
      if ( i1-i<4*dx/16 ) Break;
      MSG(fprintf(stderr,"i12 %d %d ad= %d", i1,i2,ad);)
      x =loop(bp,0,dy/2,dx,cs,0,RI); // right distance
      j =loop(bp,x,dy/2,dx,cs,1,RI); // thickness
      if( j>x+(dy+16)/32 ) ad=98*ad/100; // ~l but  MICR E-13B font
      x =loop(bp,0,0,dx,cs,0,RI); // straight line ???
      j =loop(bp,0,1,dx,cs,0,RI);               if( j>x ) Break; // ~l
      if( x==j ) j =loop(bp,0,dy/8,dx,cs,0,RI); if( j>x && !i4) Break;
      if( x==j ) if(loop(bp,0,dy/4,dx,cs,0,RI)>x) {  // ~l
        // check micr-1 first before taken as 'l'
        if (loop(bp,dx-1,dy/8,dx,cs,0,LE)<=dx/4
         && loop(bp, 0,3*dy/4,dx,cs,1,RI)< dx-1) ad=97*ad/100;
      }
      MSG(fprintf(stderr,"1l check ad= %d", ad);)
      x=j;
//      j =loop(bp,0,2,dx,cs,0,RI); if( j>=x ) Break; x=j; // ~l
//      j =loop(bp,0,   0,dx,cs,0,DO); if( !j  ) Break; // ~7
      if( !hchar ) // ~ right part of n
      /* look for upper right side, not going from nw to se */ 
      if( loop(bp,dx-1,   1,dx,cs,0,LE)-dy/6
        > loop(bp,dx-1,dy/4,dx,cs,0,LE)
      // failes on small fonts with 1 point spaces between chars
      //   also do not know what the purpose of this line was (JS Oct08)
      // || get_bw(x1+1,x1+2,y0,y0+dy/8,box1->p,cs,1)==1
        ) Break; // Mai00
      if( loop(bp,dx-1,3*dy/4,dx,cs,0,LE) > dx/2
       && get_bw(x1-dx/4,x1,y1-1,y1,box1->p,cs,1)==1 ) Break; // ~z Jun00

      i=loop(bp,  dx/8,0,dy,cs,0,DO);
      for (y=dy,x=dx/2;x<3*dx/4;x++){ /* get upper end y */
        j=loop(bp,x,0,dy,cs,0,DO); if (j<y) { y=j; }
      }
      if(y<dy/2 && y+dy/16>=i) ad=98*ad/100; // ~\tt l ??? ocr-a_1
      MSG(fprintf(stderr,"1l check i= %d y= %d ad= %d", i, y, ad);)

      if(   loop(bp,   0,  dy/8,dx,cs,0,RI)
       -(dx-loop(bp,dx-1,7*dy/8,dx,cs,0,LE)) > dx/4 ) Break; // ~/

      i=    loop(bp,   0,      0,dy,cs,0,DO); // horizontal line?
      if(dy>=12 && i>dy/8 && i<dy/2){
        if(   loop(bp,dx-1,3*dy/16,dx,cs,0,LE)-dx/8
             >loop(bp,dx-1,      i,dx,cs,0,LE) 
         ||   loop(bp,dx-1,3*dy/16,dx,cs,0,LE)-dx/8
             >loop(bp,dx-1,    i+1,dx,cs,0,LE)       ) Break; // ~t,~f
        i= loop(bp,   0,dy-1-dy/32,dx,cs,0,RI);
        x= loop(bp,   0,dy-2-dy/32,dx,cs,0,RI); if (i<x) x=i;
        if( x-loop(bp,   0,    3*dy/4,dx,cs,0,RI)>dx/8 
         &&   loop(bp,dx-1,    3*dy/4,dx,cs,0,LE)-dx/8
             >loop(bp,dx-1,dy-1-dy/32,dx,cs,0,LE)    ) Break; // ~t
        if(   loop(bp,   0,i-1,dx,cs,0,RI)>1 && dx<6) {
          ad=99*ad/100; 
          if ( loop(bp,dx-1,i-1,dx,cs,0,LE)>1 ) Break; // ~t
        }
      }

      if (dx>8){
        if (loop(bp,0,3*dy/4,dx,cs,0,RI)-
            loop(bp,0,dy/2-1,dx,cs,0,RI)>dx/4) ad=95*ad/100; // ~3
        if (loop(bp,dx-1,dy/2-1,dx,cs,0,LE)-
            loop(bp,dx-1,3*dy/4,dx,cs,0,LE)>dx/8) ad=99*ad/100; // ~3 ocr-a?
        if (loop(bp,dx-1, dy/16,dx,cs,0,LE)-
            loop(bp,dx-1,  dy/4,dx,cs,0,LE)>dx/8) ad=95*ad/100; // ~23
        MSG(fprintf(stderr,"23 check ad= %d", ad);)
      }
      /* font 5x9 "2" recognized as "1" */
      i=loop(bp,dx-1-dx/8,dy-1,dy,cs,0,UP);
      if (i<=dy/4) {
        i+=loop(bp,dx-1-dx/8,dy-1-i,dy,cs,1,UP);
        if (i<=dy/4) {
          i=loop(bp,dx-1-dx/8,dy-1-i,dy,cs,0,LE);
          if (2*i>=dx && loop(bp,dx/4,0,dy,cs,0,DO)<dy/2) {
            if (dx<17) ad=98*ad/100;
            if (dx<9)  ad=97*ad/100;
            MSG(fprintf(stderr,"5x9 2 check ad= %d", ad);)
          }
        }
      }
      
      // looking for  ###
      //              ..# pattern (its important, we dont want perp. lines as 1)
      // ToDo: better check that we have exact one on top
      for (i2=0,i=dx,y=0;y<dy/2;y++) {
        j=loop(bp,0,y,dx,cs,0,RI); if (j<i) i=j;
        if (j>i+dx/8) { break; }
      } if (y>=dy/2) ad=95*ad/100;  // Feb07 care plates, right black border
      MSG(fprintf(stderr,"ad= %d", ad);)
      
      if (sdata->holes.num > 0) Break; // mini holes should be filtered
      if (!box1->m3 && ad>98) ad=98; else {
        if (!hchar) ad=99*ad/100;
        if (box1->y0>box1->m2) ad=98*ad/100;
        if (box1->y1<(1*box1->m2+3*box1->m3)/4) ad=98*ad/100;
        if (box1->y1-box1->y0<(box1->m3-box1->m1)/2) ad=98*ad/100;
        if ( gchar) ad=99*ad/100;
      }

      Setac(box1,(wchar_t)'1',ad);
      break;
   }
   // --- test 2 old pixelbased - remove! -----------------------------
#ifdef Old_pixel_based  
   for(ad=d=100;dx>2 && dy>4;){     // min 3x4
      DBG( char c_ask='2'; )
      if (sdata->holes.num > 1) Break; /* be tolerant */
      if( get_bw(x0+dx/2, x0+dx/2 , y1-dy/5, y1     ,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2, x0+dx/2 , y0     , y0+dy/5,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/8, x1-dx/3 , y1-dy/3, y1-dy/3,box1->p,cs,1) != 1 ) Break;

      if( get_bw(x1-dx/3, x1      , y0+dy/3 , y0+dy/3,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0     , x0+dx/ 8, y1-dy/16, y1     ,box1->p,cs,1) != 1 ) Break;
      if( num_cross(x0, x1-dx/8, y0+dy/2, y0+dy/2,box1->p,cs) != 1 ) Break;
      if( get_bw(x0, x0+dx/9 , y0       , y0       ,box1->p,cs,1) == 1
       && get_bw(x0, x0+dx/2 ,y0+3*dy/16,y0+3*dy/16,box1->p,cs,1) == 1 ) Break;
      if( get_bw(x0, x0+dx/9 , y0       , y0       ,box1->p,cs,1)
       != get_bw(x1-dx/9, x1 , y0       , y0       ,box1->p,cs,1) )
      { if (dx<6 && dy<9) ad=99*ad/100; else Break; }
      // out_x(box1);

      for( x=x0+dx/4;x<x1-dx/6;x++ )		// C
      if( num_cross( x, x, y0, y0+dy/2,box1->p,cs) == 2 ) break;
      if( x>=x1-dx/6 ) Break;

      for( x=x0+dx/4;x<x1-dx/6;x++ )		// C, but acr-a
      if( num_cross( x, x, y0+3*dy/8,y1,box1->p,cs) == 2 ) break;
      if( x>=x1-dx/6 ) Break;

      for(i=1,y=y0;y<y0+dy/2;y++ )
      if( num_cross( x0, x1, y, y,box1->p,cs) == 2 ) i=0;
      if( i ) ad=99*ad/100; // ToDo: ocr-a-2 should have 100%

      for(i=1,y=y0+dy/5;y<y0+3*dy/4;y++ )
      if( get_bw( x0, x0+dx/3, y, y,box1->p,cs,1) == 0 ) i=0;
      if( i ) Break;

      x=x1-dx/3,y=y1; /* center bottom */
      turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,UP,ST); if( y<y1-dy/5 ) Break;
      turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,ST,UP); if( y<y1-dy/4 ) ad=99*ad/100;
                                                   if( y<y1-dy/3 ) Break;
      turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,UP,ST); if( y<y0+dy/3 ) Break; y++;
      turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,RI,ST);
      if( x<x1 ){ x--; // hmm thick font and serifs
        turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,UP,ST); if( y<y0+dy/2 ) Break; y++;
        turmite(box1->p,&x,&y,x0,x1,y0,y1,cs,RI,ST);
        if( x<x1 ) Break;
      }

      // test ob rechte Kante ansteigend
      for(x=0,y=dy/18;y<=dy/3;y++){ // rechts abfallende Kante/Rund?
        i=loop(box1->p,x1,y0+y,dx,cs,0,LE); // use p (not b) for broken chars
        if( i<x ) break;	// rund
        if( i>x ) x=i;
      }
      if (y>dy/3 ) Break; 	// z

      // hole is only allowed in beauty fonts
      // if( num_hole( x0, x1,      y0,      y1,box1->p,cs,NULL) > 0 ) // there is no hole
      // if( num_hole( x0, x0+dx/2, y0, y0+dy/2,box1->p,cs,NULL) == 0 ) // except in some beauty fonts
      if (sdata->holes.num>0)
      if (sdata->holes.hole[0].x1 >= dx/2 || sdata->holes.hole[0].y1 >= dy/2)
        Break;

      if (loop(bp,dx-1,   0,dx,cs,0,LE)
         <loop(bp,dx-1,dy/4,dx,cs,0,LE)-dx/8) Break; // 5x7,5x8 z Jul09
      i1=loop(bp,dx-1-dx/16,0,dy,cs,0,DO);  // Jul00
      i2=loop(bp,     dx/ 2,0,dy,cs,0,DO); if( i2+dy/32>=i1 ) Break; // ~z
      i1=loop(bp,dx-1,dy-3*dy/16,dx,cs,0,LE);
      i2=loop(bp,   0,dy-3*dy/16,dx,cs,0,RI); if( i2>i1 ) ad=98*ad/100; // ~i
      if (dots) ad=98*ad/100; // i
      if (loop(bp,dx-1,dy-1-dy/16,dx,cs,0,LE)>dx/4) ad=96*ad/100; // \it i

      if ((!hchar) && box1->m4!=0) ad=80*ad/100;
      Setac(box1,(wchar_t)'2',ad);
      if (ad==100) return '2';
      break;
   }
#endif
   // --- test 2 new edge based v0.44 --------------------------------------
   for(ad=d=100;dx>2 && dy>4;){     // min 3x4
     // rewritten for vectors 0.42
      int ld, i1, i2, i3, i4, i5, i6, i7;  // line derivation + corners
      DBG( wchar_t c_ask='2'; )
      if (sdata->holes.num > 0) Break; /* no hole */
      /* half distance to the center */
      d=2*sq(128/4);
      /* now we check for the lower ends, must be near to the corner */
      if (aa[1][2]>d/4) Break;  /* [2] = distance, ~7... */
      if (aa[2][2]>d/2) Break;  /* [2] = distance, ~r... */
      if (aa[0][2]>d/1) Break;  /* [2] = distance, ~d... */
      if (aa[3][2]>d/1) Break;  /* [2] = distance, ~bhk... */
      /* searching for 4 notches between neighbouring ends */

/*
    type A       B  
                    
        1OOO    OO  
           2   1  2 <- 6 
   7->  OOOO     O  
        O       O   <- 5
        3OO4   3OO4    
*/

      // ToDo: replace by vector code (get point on line at dy/4)
      if (loop(bp,dx-1,   0,dx,cs,0,LE)
         <loop(bp,dx-1,dy/4,dx,cs,0,LE)-dx/8) Break; // 5x7,5x8 z Jul09

      /* get a point on the inner low left side of the J */
      i =box1->num_frame_vectors[0] - 1;
      /* rightmost point on upper left side */
      i2=nearest_frame_vector(box1, aa[0][3], aa[1][3], x1+dx, y0+dy/4);
      /* upper leftmost vector */
      i1=nearest_frame_vector(box1, aa[0][3], i2, x0-dx, (y0+y1)/2);
      i3=aa[1][3];
      /* low leftmost vector */
      i5=nearest_frame_vector(box1, aa[2][3], aa[3][3], x0, y1);
      /* low mostright vector */     
      i4=nearest_frame_vector(box1, aa[1][3], i5, x1+dx, y1);
      /* next local max_x-point after i5 */
      i6=i5;
      for (i=i5;i!=aa[0][3];i=(i+1)%box1->num_frame_vectors[0]) {
        if (box1->frame_vector[ i][0]
           >box1->frame_vector[i6][0]) i6=i; // get next maximum
        if (box1->frame_vector[ i][0]<x0+dx/3
         && box1->frame_vector[ i][1]<y0+dy/3
         && box1->frame_vector[i6][0]>x0+dx/2) break; // 5
      }
      /* which type? ToDo: have a more sure algorithm */     
      i7=nearest_frame_vector(box1, i2, i3, x0-dx/8, (y0+y1)/2);
      if (box1->frame_vector[i7][0]<=x0+  dx/4
       && box1->frame_vector[i7][1]<=y0+2*dy/3) {
        MSG(fprintf(stderr,"7-segment-type");)
      } else { /* regular-book-type */
        MSG( fprintf(stderr,"upper bow not z-like? ad %d", ad); )
        if (aa[3][0]>=x1-dx/8                // x of upper right point
         && aa[3][1]< y0+dy/8) ad=99*ad/100; // y of upper right point
        if (aa[0][0]<=x0+dx/8                // x of upper left point
         && aa[0][1]< y0+dy/8) ad=99*ad/100; // y of upper left point
        if (aa[3][2]<=aa[1][2]) ad=97*ad/100; // dist to (maxx,0) <= (0,maxy)
      }
      // ToDo: output no=(x,y)
      MSG( fprintf(stderr,"i1-7 %d %d %d %d %d %d %d ad %d",
           i1,i2,i3,i4,i5,i6,i7,ad); )
      if (i5==i6) Break; // ~+
      
      if (box1->frame_vector[i5][1]
         -box1->frame_vector[i6][1]<dy/4) Break; // ~5
      if (box1->frame_vector[i1][1]>y0+dy/2) Break; // not to low
      if (box1->frame_vector[i1][0]>x0+dx/8+dx/16) Break; // slanted ?
      if (box1->frame_vector[i2][1]>(y0+  y1)/2) Break; 
      if (box1->frame_vector[i2][1]>(5*y0+3*y1)/8) ad=99*ad/100; 
      MSG( fprintf(stderr,"ad %d", ad); )
      if (box1->frame_vector[i2][0]<(x0+x1+1)/2) Break;  // fat tiny fonts?
      if (box1->frame_vector[i2][0]<(x0+2*x1)/3) ad=99*ad/100;
      MSG( fprintf(stderr,"ad %d", ad); )
      if (box1->frame_vector[i3][0]>(3*x0+x1)/4) Break;
      if (box1->frame_vector[i3][0]>(7*x0+x1)/8) ad=99*ad/100;
      MSG( fprintf(stderr,"ad %d", ad); )
      /* check lowest left point */
      if (box1->frame_vector[i3][1]<(y0+3*y1)/4) Break;
      if (box1->frame_vector[i3][1]<(y0+7*y1)/8) ad=99*ad/100;
      MSG( fprintf(stderr,"ad %d", ad); )
      /* check lower leftmost point from right side */
      if (box1->frame_vector[i5][0]>(x0+2*x1)/3) Break;
      if (box1->frame_vector[i5][0]>(x0+  x1)/2) ad=98*ad/100;
      if (box1->frame_vector[i5][0]>(2*x0+2+x1)/3) ad=99*ad/100; /* 9x10 2 */
      MSG( fprintf(stderr,"ad %d", ad); )
      if (box1->frame_vector[i5][1]<(3*y0+5*y1)/8) Break;
      if (box1->frame_vector[i5][1]<(y0+3*y1)/4) ad=99*ad/100;
      MSG( fprintf(stderr,"ad %d", ad); )
      if (box1->frame_vector[i6][1]>(y0+2*y1)/3) Break;
      if (box1->frame_vector[i6][1]>(y0+  y1)/2) ad=99*ad/100;
      MSG( fprintf(stderr,"ad %d", ad); )
      if (box1->frame_vector[i6][0]<(x0+3*x1)/4) Break;
      if (box1->frame_vector[i6][0]<(x0+7*x1)/8) ad=99*ad/100;
 
      /* check for zZ */
     
      /* check if lower left and right points are joined directly */
      ld=line_deviation(box1, i3, i4);
      MSG(fprintf(stderr,"i1-i2 %d %d dist= %d/%d",i1,i2,ld,2*sq(1024/4));)
      if (ld >2*sq(1024/4)) Break;
      if (ld >  sq(1024/4)) ad=99*ad/100;

      if (box1->m3) {
        if(!hchar){ ad=99*ad/100; }
        if( gchar){ ad=99*ad/100; }
      } else { if (ad==100) ad=99; } /* not 100% sure */
      Setac(box1,'2',ad);
      if (ad==100) return '2';
      break;
   }
   // --- test 3 -------
   for(ad=d=100;dx>3 && dy>4;){	// dy<=dx nicht perfekt! besser mittleres
				// min-suchen fuer m
      int i1, i2, i3, i4, i5, i6, i7, i8;  // line derivation + corners
      DBG( char c_ask='3'; )
      if (sdata->holes.num > 1) Break; /* be tolerant */
      if (sdata->holes.num > 0) ad=98*ad/100; /* be tolerant */
      if (4*dx<dy) ad=98*ad/100; // to tall 1:2 - 1:3 is usual 
      // --- vector based code ---
      /* half distance to the center */
      d=2*sq(128/4);
      /* now we check for the lower ends, must be near to the corner */
      if (aa[1][2]>d/1) Break;  /* [2] = distance, ~7... */
      if (aa[2][2]>d/1) Break;  /* [2] = distance, ~r... */
      if (aa[0][2]>d/1) Break;  /* [2] = distance, ~d... */
      if (aa[3][2]>d/1) Break;  /* [2] = distance, ~bhk... */
/*
    type A       B      C
                    
        1OO8   1OO   1OO8
           O      8    2    <- 7,8 
           2      2   7      
 1-5->  3OO7    37   3OO
           4      4     4
           O      6     6   <- 6
        5OO6   5OO   5OO
*/
      /* rightmost point on upper left side */
      i2=nearest_frame_vector(box1, aa[0][3], aa[1][3], x1, y0+3*dy/16);
      /* rightmost point on lower left side */
      i4=nearest_frame_vector(box1, aa[0][3], aa[1][3], x1, y1-dy/4);
      /* leftmost point on middle left side */
      i3=nearest_frame_vector(box1,       i2,       i4, x0, y0+dy/2);
      /* upper leftmost vector */
      i1=nearest_frame_vector(box1, aa[0][3], i2, x0-dx, (y0+y1)/2);
      i5=aa[1][3]; // points to vector point in point list
      i6=aa[2][3];
      i8=aa[3][3];
      /* leftmost point on middle right side */
      i7=nearest_frame_vector(box1,       i6,       i8, x0   , y0+dy/2);
      /* which type? ToDo: have a more sure algorithm */
      if (box1->frame_vector[i7][0]>=x1-  dx/4
       && box1->frame_vector[i6][0]>=x1-  dx/8 // ToDo: ...
       && box1->frame_vector[i6][1]>=y1-  dy/8) {
        MSG(fprintf(stderr,"7-segment-type");)   
      } else { /* regular-book-type */
      }
      // ToDo: output no=(x,y)
      MSG(fprintf(stderr,"i1-8 %d %d %d %d %d %d %d %d",i1,i2,i3,i4,i5,i6,i7,i8);)
      // if (i5==i6) Break; // ~+
  
      // i2 = upper left gap ) , i3 = middle left <
      if (box1->frame_vector[i2][0]
         -box1->frame_vector[i3][0]<dx/4) Break; // video samples
      if (box1->frame_vector[i4][0]
         -box1->frame_vector[i3][0]<dx/4) Break; // video samples
      if (box1->frame_vector[i4][0]
         -box1->frame_vector[i5][0]<dx/2) Break; // video samples
      if (box1->frame_vector[i2][0]
         -box1->frame_vector[i1][0]<dx/2) Break; // video samples
      if (box1->frame_vector[i1][1]>y0+dy/2) Break; // not to low
      if (box1->frame_vector[i1][0]>x0+dx/4+dx/16) Break; // slanted?
      if (box1->frame_vector[i5][1]<y1-dy/2) Break; // not to high
      if (box1->frame_vector[i5][0]>x0+dx/4) Break;
      // ToDo ....

      // --- pixel based old code ---
      // if( get_bw(x0+dx/2,x0+dx/2,y0,y0+dy/4,box1->p,cs,1) == 0 ) Break; // ~4
      // if( get_bw(x0+dx/2,x0+dx/2,y1-dy/8,y1,box1->p,cs,1) == 0 ) Break; // ~4
      // if( num_cross(x0+dx/2,x0+dx/2,y0     ,y1,box1->p,cs) < 2 ) Break;
      // if( num_cross(x0+dx/4,x0+dx/4,y1-dy/2,y1,box1->p,cs) == 0 ) Break;
      if( get_bw(dx/2,dx/2,        0,dy/6,bp,cs,1) == 0 ) Break; // ~4
      if( get_bw(dx/2,dx-1,     dy/6,dy/6,bp,cs,1) == 0 ) Break; // ~j
      if( get_bw(dx/2,dx/2,dy-1-dy/8,dy-1,bp,cs,1) == 0 ) Break; // ~4
      if( num_cross(dx/2,dx/2,0        ,dy-1,bp,cs) < 2          // normal
       && num_cross(dx/3,dx/3,0        ,dy-1,bp,cs) < 2 ) Break; // fat LCD
      if( num_cross(dx/4,dx/4,dy-1-dy/2,dy-1,bp,cs) == 0 ) Break;
      if( loop(bp,dx/2,  0   ,dy,cs,0,DO)>dy/4 ) Break;
      if( loop(bp,dx/2,  dy-1,dy,cs,0,UP)>dy/4 ) Break;
      if( loop(bp,dx-1,  dy/3,dy,cs,0,LE)>dy/4 /* 3 with upper bow */
       && loop(bp,dx-1,  dy/8,dy,cs,0,LE)>dy/4 /* 3 with horizontal line */
       && loop(bp,dx/4,  dy/8,dy,cs,1,RI)<dy/2 ) Break;
      if( loop(bp,dx-1,2*dy/3,dy,cs,0,LE)>dy/4 ) Break;
      if( loop(bp,dx-1,3*dy/4,dy,cs,0,LE)>dy/2 ) Break; // ~2 Feb06
      if( loop(bp,dx-1,7*dy/8,dy,cs,0,LE)>dy/2 ) Break; // ~2 Feb06
      // search upper right half circle (may fail on 4x5 font)
      for( i3=x=0,i1=y=dy/5;y<dy/2;y++ ){
        i=loop(bp,0,y,dx,cs,0,RI);
        if (i>x) { i3=x=i; i1=y; }
      } i3--;
      if( loop(bp,i3,i1,1,cs,0,UP)==1 ) { // find hidden gap in tiny fonts
        i1--; i3+=loop(bp,i3,i1,dx,cs,0,RI)-1;
      }
      if (i3<dx/3 && i3+1+loop(bp,i3+1,i1,dx,cs,1,RI)<3*dx/4) Break;
      if (loop(bp,dx-1,i1,dx,cs,0,LE)>1+dx/8) ad=ad*99/100; // ~1 with a pixel
      // search lower right half circle
      for( i4=x=0,i2=y=dy-1-dy/8;y>=dy/2;y-- ){
        i=loop(bp,0,y,dx,cs,0,RI);
        if( i>x ) { i4=x=i;i2=y; }
      } i4--; if(i4<dx/3 && i4+1+loop(bp,i4+1,i2,dx,cs,1,RI)<3*dx/4) Break;
      if (loop(bp,dx-1,i2,dx,cs,0,LE)>1+dx/8) ad=ad*99/100; // ~1 with a pixel

      for( x=xa=0,ya=y=dy/4;y<3*dy/4;y++ ){  // right gap, not on LCD-font
        i=loop(bp,dx-1,y,dx,cs,0,LE);
        if (i>=xa) { xa=i;ya=y;x=xa+loop(bp,dx-1-xa,y,dx,cs,1,LE); }
      } if (dy>3*dx) if (xa<2 && x-xa<dx/2) Break; // ~]
      if (xa>1+dx/8 // noLCD
        && xa<=loop(bp,dx-1,i2,dx,cs,0,LE)) ad=ad*99/100; // ~1 with a pixel
      if (xa>1+dx/8 // noLCD
        && xa<=loop(bp,dx-1,i1,dx,cs,0,LE)) ad=ad*99/100; // ~1 with a pixel
      
      // upper left gap = (i3,i1)
      // lower left gap = (i4,i2)
      MSG(fprintf(stderr,"left white gaps (%d,%d) (%d,%d)",i3,i1,i4,i2);)
      if( get_bw(i3,i3,i1,i2  ,bp,cs,1) != 1 ) Break; // no hor. middle line?
      if( get_bw(i4,i4,i1,i2  ,bp,cs,1) != 1 ) Break;
      if( get_bw(i3,i3,0 ,i1  ,bp,cs,1) != 1 ) Break; // no upper bow?
      if( get_bw(i4,i4,i2,dy-1,bp,cs,1) != 1 ) Break; // no lower bow?
      // hole is only allowed in beauty fonts
      // if( num_hole( x0, x1,      y0,      y1,box1->p,cs,NULL) > 0 ) // there is no hole
      // if( num_hole( x0, x0+dx/2, y0, y0+dy/2,box1->p,cs,NULL) == 0 ) // except in some beauty fonts
      if (sdata->holes.num>0)
      if (sdata->holes.hole[0].x1 >= dx/2 || sdata->holes.hole[0].y1 >= dy/2)
        Break;
      Setac(box1,(wchar_t)'3',ad);
      if (ad==100) return '3';
      break;
   }
   // --- test 4 --------------------------------------------------- 25Nov06
   for(ad=d=100;dy>3 && dx>2;){     // min 3x4 ~<gA',
     // rewritten for vectors 0.42
      int ld, i1, i2, i3, i4, i5, i6, i7;  // line derivation + corners
      DBG( wchar_t c_ask='4'; )
      if (sdata->holes.num > 1) Break; /* no or one hole */
      /* half distance to the center */
      d=2*sq(128/4); /* 2048 */
      /* now we check for the lower left end, must be far away */
      /* lowest is 144 for 9x10 screen font (Apr2009) */
      if (aa[1][2]<d/16) {  /* Apr09: d/8=256 to d/16=128 */
        MSG( fprintf(stderr," low-left-dist= %d < max= %d", aa[1][2], d); )
        Break;  /* [2] = distance, ~ABDEF... */
      }
      /* searching for 4 notches between neighbouring ends */

/*
    type A       B      C      D
                     
        1  5   1        1      1     
        O  O   O       O5     O5
        2OO3   O 5    O O    O O   <- 7 6
           O   2O3O  2OO3   2OO3O
           4     4      4      4
           
     y4-y3 should be significant (bigger y3-y6)?
*/

      /* Warning: aa0 can be left upper or left lower point for type B */
      /* get a point on the inner low left side of the J */
      i =box1->num_frame_vectors[0] - 1;
      /* leftmost upper point */
      i1=nearest_frame_vector(box1, 0, i, x0, y0-dy);
      /* lowest from leftmost vector can be very low (20/23) */
      i2=nearest_frame_vector(box1, 0, i, x0-2*dx, (y0+7*y1)/8);
      /* lowest vector */
      i4=nearest_frame_vector(box1, 0, i, (x0+2*x1)/3, y1+dy);
      /* right center crossing point */     
      i3=nearest_frame_vector(box1, i2, i4, x1, (3*y0+y1)/4);
      /* get a point on the outer right side below top serif */
      /* next local max_y-point after i4 */
      i5=i4;
      for (i=i4;i!=i2;i=(i+1)%box1->num_frame_vectors[0]) {
        if (box1->frame_vector[ i][1]
           <box1->frame_vector[i5][1]) i5=i; // get next maximum
        if (box1->frame_vector[ i][1]
           >box1->frame_vector[i5][1]+1) break; // break after maximum
        if (box1->frame_vector[ i][0]<x0+dx/4) break; // type A B
      }
      if (box1->num_frames>1) {  // type C D
        i = box1->num_frame_vectors[0] - 1; // end outer loop
        j = box1->num_frame_vectors[1] - 1; // end inner loop
        if (box1->num_frames>2) { // see font2.png, 2nd one pixel hole
          j = box1->num_frame_vectors[2] - 1; // end inner loop
          ad=99*ad/100; // little bit unsure
        }
        i6=nearest_frame_vector(box1, i+1, j, x1, y1);
        i7=nearest_frame_vector(box1, i+1, j, x0, y1);
        if (box1->frame_vector[i1][0]
           -box1->frame_vector[i2][0]<dx/4+1) ad=96*ad/100; // ~4x6q
        i =nearest_frame_vector(box1, i+1, j, x0, y0); // top left
        MSG(fprintf(stderr,"triangle type top-left i=%d",i);)
        if (box1->frame_vector[i ][0]-x0<dx/4+1
         && box1->frame_vector[i ][1]-y0<dy/4+1
         && dx>7) ad=97*ad/100; // q
        
      } else {  // type A B
        i6=nearest_frame_vector(box1, i5, i1, (x0+3*x1)/4, y1-dy/8);
        i7=nearest_frame_vector(box1, i5, i1,  x0        , y1-dy/8);
        MSG(fprintf(stderr,"open type");)
        if (box1->frame_vector[i6][1]-y0>3*dy/4
         || box1->frame_vector[i7][1]-y0>3*dy/4) ad=96*ad/100; // ~uU
      }
      // ToDo: output no=(x,y)
      MSG(fprintf(stderr,"i1-7 %d %d %d %d %d %d %d",i1,i2,i3,i4,i5,i6,i7);)
      if (i5==i6) Break; // ~+
      
      if (box1->frame_vector[i1][1]>y0+dy/8) Break; // not to low
      if (box1->frame_vector[i2][1]
         -box1->frame_vector[i1][1]<dy/2) Break;
      if (box1->frame_vector[i3][0]
         -box1->frame_vector[i2][0]<dx/4) Break;
      if (abs(box1->frame_vector[i3][1]
             -box1->frame_vector[i2][1])>dy/4) Break;
      if (box1->frame_vector[i2][0]>x0+dx/8) Break;
      if (box1->frame_vector[i2][1]>y1-dy/8) Break;
      if (box1->frame_vector[i4][1]
         -box1->frame_vector[i2][1]<dy/8) Break;
      if (box1->frame_vector[i4][1]
         -box1->frame_vector[i2][1]<dy/6) ad=99*ad/100;
      /* min. distance of the horizontal bar to the ground */
      /* y4-y3 should be significant (bigger y3-y6)? */
      if (box1->frame_vector[i4][1]
         -box1->frame_vector[i3][1]<1+dy/16) Break;
      if ((box1->frame_vector[i4][1]
          -box1->frame_vector[i3][1])*2<=
          (box1->frame_vector[i3][1]
          -box1->frame_vector[i6][1])) Break; // 090728 gas_meter (flat-ulike)
      if ((box1->frame_vector[i4][1]
          -box1->frame_vector[i3][1])<
          (box1->frame_vector[i3][1]
          -box1->frame_vector[i6][1])) ad=99*ad/100;
      if (box1->frame_vector[i4][1]
         -box1->frame_vector[i3][1]<dy/6) ad=99*ad/100; /* tall chars */
      if (box1->frame_vector[i4][1]
         -box1->frame_vector[i3][1]<dy/8) ad=99*ad/100;
      if (box1->frame_vector[i4][1]<y1-1-dy/8) Break;
      if (box1->frame_vector[i3][0]<x0+dx/4) Break;
      if (box1->frame_vector[i3][0]<x0+dx/2) ad=98*ad/100;
      /* on very tall chars the i3 point can be near to the groundline */
      if (box1->frame_vector[i3][1]>y1-1) Break;
      if (box1->frame_vector[i3][1]>y1-dy/16) Break;
      if (box1->frame_vector[i3][1]>=y1) Break; // ~5x5#
      if (box1->frame_vector[i5][0]<x0+dx/3) Break;
      /* upper end of right vertical line */
      if (box1->frame_vector[i5][1]>y0+2*dy/3) Break;
      if (box1->frame_vector[i6][1]
         -box1->frame_vector[i5][1]<1+dy/16) Break;
      if (box1->frame_vector[i6][0]<x0+dx/3) Break;
      if (box1->frame_vector[i7][0]>x0+dx/2) Break;
      if (box1->frame_vector[i7][0]>x0+dx/3) ad=ad*99/100;
      if (box1->frame_vector[i6][1]<y0+dy/3) Break;
      if (box1->frame_vector[i6][0]<x0+dx/2) ad=96*ad/100; // ~ 42
      if (box1->frame_vector[i6][0]<aa[2][0]-dx/2
                     && aa[2][1]>=y1-1-dy/8) ad=96*ad/100; // ~ 42
      if (box1->frame_vector[i7][1]<y0+dy/3) Break;
      if (abs(box1->frame_vector[i3][1]
             -box1->frame_vector[i2][1])>dy/4) Break;
      
      /* check if upper left and lower left points are joined directly */
      ld=line_deviation(box1, i1, i2);
      MSG(fprintf(stderr," i1-i2 %d %d dist= %d/%d",i1,i2,ld,2*sq(1024/4));)
      if (ld >2*sq(1024/4)) Break;
      /* check if lower right and upper right points are joined directly */
      ld=line_deviation(box1, i2, i3);
      MSG(fprintf(stderr," i2-i3 %d %d dist= %d/%d",i2,i3,ld,2*sq(1024/4));)
      if (ld >  sq(1024/4)) Break;
      /* check if lower right and upper right points are joined directly */
      ld=line_deviation(box1, i3, i4);
      MSG(fprintf(stderr," i3-i4 %d %d dist= %d/%d",i3,i4,ld,2*sq(1024/4));)
      if (ld >  sq(1024/4)) Break;
      /* check if lower right and upper right points are joined directly */
      ld=line_deviation(box1, i6, i7);
      MSG(fprintf(stderr," i6-i7 %d %d dist= %d/%d",i6,i7,ld,2*sq(1024/4));)
      if (ld >2*sq(1024/4)) Break;

      // 4 exists as gchar and ~gchar
      if(!hchar){ ad=99*ad/100; }
      Setac(box1,'4',ad);
      break;
   }
#ifdef Old_pixel_based 
   // --- old test 4 pixelbased ------- remove!
   for(ad=d=100;dx>3 && dy>5;){     // dy>dx, min 4x6 font
      DBG( char c_ask='4'; )
      if (sdata->holes.num > 2) Break; /* be tolerant */
      if (sdata->holes.num > 1) ad=97*ad/100;
      // upper raising or vertical line
      if( loop(bp,0   ,3*dy/16,dx,cs,0,RI)
        < loop(bp,0   ,2*dy/4 ,dx,cs,0,RI)-dx/8 ) Break;
      // search for a vertical line on lower end
      for (y=0;y<dy/4;y++)
       if( loop(bp,0   ,dy-1-y,dx,cs,0,RI)
         + loop(bp,dx-1,dy-1-y,dx,cs,0,LE) >= dx/2 ) break;
      if (y>=dy/4) Break;
      if( loop(bp,0   ,dy-1-dy/8,dx,cs,0,RI) <  dx/4 ) Break;
      // --- follow line from (1,0) to (0,.7)
      y=0; x=loop(bp,0,0,dx,cs,0,RI);
      if (x<=dx/4) {  // ocr-a-4
        i=loop(bp,0,dy/4,dx,cs,0,RI); if (i>dx/4) Break;
        i=loop(bp,i,dy/4,dx,cs,1,RI); if (i>dx/2) Break;
        j=loop(bp,i,dy/4,dy,cs,0,DO)+dy/4; if (j>7*dy/8) Break;
      }
      turmite(bp,&x,&y,0,dx-1,0,dy-1,cs,DO,LE); if( x>=0 ) Break;

      y=loop(bp,0,0,dy,cs,0,DO);
      if( (y+loop(bp,0,y,dy,cs,1,DO)) < dy/2 ) Break;
      if( get_bw(x0   , x0+3*dx/8, y1-dy/7, y1-dy/7,box1->p,cs,1) == 1 ) Break;
      if( get_bw(x0+dx/2, x1     , y1-dy/3, y1-dy/3,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2, x0+dx/2, y0+dy/3, y1-dy/5,box1->p,cs,1) != 1 ) Break;
      i=loop(bp,bp->x-1,  bp->y/4,dx,cs,0,LE);
      if( i > loop(bp,bp->x-1,2*bp->y/4,dx,cs,0,LE)+1
       && i > loop(bp,bp->x-1,3*bp->y/8,dx,cs,0,LE)+1 ) Break;
      if (loop(bp,0,0,dx,cs,0,RI)>dx/4) {
        for(i=dx/8+1,x=0;x<dx && i;x++){
          if( num_cross(x ,x   ,0  ,dy-1, bp,cs) == 2 ) i--;
        } if( i ) Break;
      }
      for(i=dy/6+1,y=dy/4;y<dy && i;y++){
        if( num_cross(0 ,dx-1,y  ,y   , bp,cs) == 2 ) i--;
      } if( dy>15 && i ) Break;
      for(i=dy/10+1,y=dy-1-dy/4;y<dy && i;y++){
        if( num_cross(0   ,dx-1,y ,y  , bp,cs) == 1 )
        if( num_cross(dx/2,dx-1,y ,y  , bp,cs) == 1 ) i--;
      } if( i ) Break;
      // i4 = num_hole ( x0, x1, y0, y1,box1->p,cs,NULL);
      // ToDo:
      //   - get start and endpoint of left edge of left vert. line
      //       and check if that is an streight line
      //   - check the right edge of the inner hole (if there) too
      i4 = sdata->holes.num;
      if (sdata->holes.num >0) { // ~q
        i = loop(bp,0,dy/16,dx,cs,0,RI);
        if (i < dx/3) Break;
        if (i < dx/2) ad=98*ad/100; // hole?
        if ( loop(bp,     0,dy-1,dy,cs,0,UP)
            -loop(bp,dx/8+1,dy-1,dy,cs,0,UP)>dy/16) ad=97*ad/100;
      }
      // thickness of left vertical line
      for (j=y=0;y<dy/6;y++) {
        i=loop(bp,dx-1  ,y,dx,cs,0,LE);
        i=loop(bp,dx-1-i,y,dx,cs,1,LE); if (i>j) j=i;
      }
      if (j>=dx/2) ad=98*ad/100; // ~q handwritten a (or very thinn 4)
      // ToDo: check y of masscenter of the hole q4
      
      if( i4 ) if( dx > 15 )
      if( loop(bp,  dx/2,   0,dy,cs,0,DO)<dy/16
       && loop(bp,  dx/4,   0,dy,cs,0,DO)<dy/8
       && loop(bp,3*dx/4,   0,dy,cs,0,DO)<dy/8
       && loop(bp,  dx/4,dy-1,dy,cs,0,UP)<dy/8
       && loop(bp,  dx/2,dy-1,dy,cs,0,UP)<dy/8
       && loop(bp,3*dx/4,dy-1,dy,cs,0,UP)<dy/4 ) Break; // ~9

      i =loop(bp,dx-1  ,dy-1,dx,cs,0,LE); // ~9
      i+=loop(bp,dx-1-i,dy-1,dx,cs,1,LE);
      if( i>3*dx/4
       && i-loop(bp,dx-1,dy-1-dy/8,dx,cs,0,LE)>dx/4 ) Break;
       
      i =loop(bp,dx-1-dx/4,dy-1,dx,cs,0,UP);
      if (i>  dy/2) ad=97*ad/100;
      if (i>3*dy/4) ad=97*ad/100;  /* handwritten n */

      if( num_cross(0 ,dx-1,dy/16 ,dy/16  , bp,cs) == 2 // ~9
       && loop(bp,dx-1,dy/16        ,dx,cs,0,LE)>
          loop(bp,dx-1,dy/16+1+dy/32,dx,cs,0,LE) ) Break;
      if (         !hchar) ad=99*ad/100;
      if (gchar && !hchar) ad=98*ad/100; // ~q
      Setac(box1,(wchar_t)'4',ad);      
      if (ad>99) bc='4';
      break;
   }
#endif
   // --- test 6 ------- ocr-a-6 looks like a b  :(
   for(ad=d=100;dx>3 && dy>4;){     // dy>dx
      DBG( char c_ask='6'; )
      if (sdata->holes.num > 2) Break; /* be tolerant */
      if( loop(bp,   0,  dy/4,dx,cs,0,RI)>dx/2          // ocr-a=6
       && loop(bp,dx-1,     0,dy,cs,0,DO)>dy/4 ) Break; // italic-6
      if( loop(bp,   0,  dy/2,dx,cs,0,RI)>dx/4 ) Break;
      if( loop(bp,   0,3*dy/4,dx,cs,0,RI)>dx/4 ) Break;
      if( loop(bp,dx-1,3*dy/4,dx,cs,0,LE)>dx/2 ) Break;
      if( num_cross(x0+  dx/2,x0+  dx/2,y0     ,y1     ,box1->p,cs) != 3
       && num_cross(x0+5*dx/8,x0+5*dx/8,y0     ,y1     ,box1->p,cs) != 3 ) {
        if( num_cross(x0+  dx/2,x0+  dx/2,y0+dy/4,y1     ,box1->p,cs) != 2
         && num_cross(x0+5*dx/8,x0+5*dx/8,y0+dy/4,y1     ,box1->p,cs) != 2 ) Break;
        // here we have the problem to decide between ocr-a-6 and b
        if ( loop(box1->p,(x0+x1)/2,y0,dy,cs,0,DO)<dy/2 ) Break;
        ad=99*ad/100;
      } else {
        if (loop(box1->p,x0+dx/2,y0,dx,cs,0,DO)>dy/8
         && loop(box1->p,x1-dx/4,y0,dx,cs,0,DO)>dy/8 ) Break;
      }
      if( num_cross(x0     ,x1     ,y1-dy/4,y1-dy/4,box1->p,cs) != 2 ) Break;
      for( y=y0+dy/6;y<y0+dy/2;y++ ){
        x =loop(box1->p,x1    ,y  ,dx,cs,0,LE); if( x>dx/2 ) break;
        x+=loop(box1->p,x1-x+1,y-1,dx,cs,0,LE); if( x>dx/2 ) break;
      } if( y>=y0+dy/2 ) Break;
      if (loop(box1->p,x0,y1-dy/3,dx,cs,0,RI)>dx/4 ) Break;
      if (loop(box1->p,x1,y1-dy/3,dx,cs,0,LE)>dx/4 ) Break;

      if (sdata->holes.num != 1) Break;
      if (sdata->holes.hole[0].y1 < dy/2) ad=95*ad/100; // whats good for?
      if (sdata->holes.hole[0].y0 < dy/4) Break;
      MSG( fprintf(stderr,"hole[0].x0,x1 %d %d", sdata->holes.hole[0].x0,
           sdata->holes.hole[0].x1); )
      if (sdata->holes.hole[0].x0<1
        && dx-1-sdata->holes.hole[0].x1>2) ad=ad*99/100; // melted serif sS ?
      if (loop(box1->p,x0,y0+dy/2,dx,cs,0,RI)>0
       && loop(box1->p,x0,y0+dy/4,dx,cs,0,RI)==0
       && loop(box1->p,x0,y1-dy/4,dx,cs,0,RI)==0) ad=97*ad/100; // molten serif sS
//      if( num_hole ( x0, x1, y0, y0+dy/2,box1->p,cs,NULL) >  0 ) ad=95*ad/100; 
//      if( num_hole ( x0, x1, y0+dy/4, y1,box1->p,cs,NULL) != 1 ) Break; 
//      if( num_hole ( x0, x1, y0     , y1,box1->p,cs,NULL) != 1 ) Break; 
//    out_x(box1); printf(" x0 y0 %d %d\n",x0,y0);
      /* check left vertical bow */
      i1=loop(bp,0,dy/8     ,dx,cs,0,RI);
      i3=loop(bp,0,dy-1-dy/8,dx,cs,0,RI);
      i2=loop(bp,0,dy/2     ,dx,cs,0,RI); 
      if(i1+i3-2*i2<-2-dx/16 && i1+i2+i3>0) Break;  // convex from left
      if(i1+i3-2*i2<1        && i1+i2+i3>0) ad=99*ad/100;  // 7-segment-font
      for( x=dx,y=0;y<dy/4;y++ ){	// ~ b (serife?)
        i1=loop(bp, 0,y,dx,cs,0,RI);
        i2=loop(bp,i1,y,dx,cs,1,RI);
        if (i2+i1>dx/2 && i2>dx/4) break; /* its a 6 (example: 7-segment) */
        if (i1<x) x=i1; else if (i1>x) break; /* may be serifen b */
      } if (y<dy/4 && i1+i2<=dx/2) Break;
      // ~& (with open upper loop)
      for( i=0,y=dy/2;y<dy;y++){
        if( num_cross(dx/2,dx-1,y,y,bp,cs) > 1 ) i++; if( i>dy/8 ) break;
      } if( y<dy ) Break;
      if ( gchar) ad=99*ad/100;
      if (!hchar) ad=98*ad/100;
      if ( box1->dots ) ad=98*ad/100;
      Setac(box1,(wchar_t)'6',ad);
      bc='6';
      break;
   }
   // --- test 7 ---------------------------------------------------
   for(ad=d=100;dx>2 && dy>4;){     // dx>1 dy>2*dx
      DBG( char c_ask='7'; )
      if (sdata->holes.num > 1) Break; /* be tolerant */
      if( loop(bp,dx/2,0,dy,cs,0,DO)>dy/8 ) Break;
      if( num_cross(0,dx-1,3*dy/4,3*dy/4,bp,cs) != 1 ) Break; // preselect
      for( yb=xb=y=0;y<dy/2;y++){ // upper h-line and gap
        j=loop(bp,0,y,dx,cs,0,RI);if(xb>0 && j>dx/4) break; // gap after h-line
        j=loop(bp,j,y,dx,cs,1,RI);if(j>xb){ xb=j;yb=y; }  // h-line
      } if( xb<dx/4 || y==dy/2 ) Break;
      j=loop(bp,0,dy/2,dx,cs,0,RI);
      j=loop(bp,j,dy/2,dx,cs,1,RI); if(xb<2*j) Break; // minimum thickness
      for(x=0,y+=dy/16;y<dy;y++){	// one v-line?
        if( num_cross(0,dx-1,y,y,bp,cs) != 1 ) break;
        j=loop(bp,dx-1,y,dx,cs,0,LE); if( j<x ) break; if( j-1>x ) x=j-1;
      } if( y<dy || x<dx/3 ) {
         MSG( fprintf(stderr,"xy= %d %d",x,y); )
         Break;
      }
      j =loop(bp,dx-1,0,dy,cs,0,DO);  // ~T
      j+=loop(bp,dx-1,j,dy,cs,1,DO)+dy/16;
      i =loop(bp,dx-1,j,dx,cs,0,LE); if(j<dy/2) {
       if (i>j) Break;
       j=loop(bp,   0,j,dx,cs,0,RI);
       if(j>dx/4 && j<=i+dx/16) Break; // tall T
      }

      MSG( fprintf(stderr,"7: ad= %d",ad); )
      if(   loop(bp,   0,3*dy/8,dx,cs,0,RI)
          <=loop(bp,dx-1,3*dy/8,dx,cs,0,LE)+dx/8 ) ad=ad*98/100; // l
      MSG( fprintf(stderr,"7: ad= %d",ad); )
      if( num_cross(0,dx-1,dy/4,dy/4,bp,cs) == 1
       && loop(bp,0,dy/4,dx,cs,0,RI) < dx/2 ) ad=ad*96/100; // J
      MSG( fprintf(stderr,"7: ad= %d",ad); )

      if (box1->m3 &&   dy<box1->m3-box1->m2) ad=99*ad/100; // too small
      if (box1->m3 && 2*dy<box1->m3-box1->m2) ad=96*ad/100; // too small
      if (dy>3*dx) ad=99*ad/100; // )
      if ( gchar)  ad=99*ad/100; // J
      if (!hchar)  ad=99*ad/100;
      Setac(box1,(wchar_t)'7',ad);
      break;
   }
   // --- test 8 ---------------------------------------------------
   // last change: May15th,2000 JS
   for(ad=d=100;dx>2 && dy>4;){     //    or we need large height
      DBG( char c_ask='8'; )
      if (sdata->holes.num != 2) Break;
      if( num_cross(x0,x1,y0  +dy/4,y0  +dy/4,box1->p,cs) != 2 ) Break; // ~gr (glued)
      if( num_cross(x0,x1,y1  -dy/4,y1  -dy/4,box1->p,cs) != 2
       && num_cross(x0,x1,y1-3*dy/8,y1-3*dy/8,box1->p,cs) != 2 ) Break;
      if( get_bw(x0,x0+dx/4,y1-dy/4,y1-dy/4,box1->p,cs,1) == 0 ) Break; // ~9
      if( get_bw(x0,x0+dx/2,y0+dy/4,y0+dy/4,box1->p,cs,1) == 0 ) Break;
      if( get_bw(x0+dx/2,x0+dx/2,y0+dy/4,y1-dy/4,box1->p,cs,1) == 0 ) Break; // ~0
// MSG( printf(" x0 y0 %d %d\n",x0,y0); )
      for( i2=i1=x=0,i=y=y0+dy/3;y<=y1-dy/3;y++){	// check left middle nick
	j=loop(box1->p,x0,y,dx,cs,0,RI);
	if (j>x || (abs(j-x)<=dx/8  /* care about MICR E-13B font */
                 && (i1=loop(box1->p,x0+j,y,dx,cs,1,RI))>dx/2)) {
           if (j>x) x=j; i=y; if (i1>i2) i2=i1; }
      } if(i>=y1-dy/3 || (x<dx/8 && i2<=dx/2) || x>dx/2) Break; // no gB
      if (x< dx/4) ad=99*ad/100; // no B
      if (x<=dx/8) ad=98*ad/100; // no B
      j =   loop(box1->p,x1,y1-  dy/4,dx,cs,0,LE);
      if( j>loop(box1->p,x1,y1-  dy/5,dx,cs,0,LE)
       && j>loop(box1->p,x1,y1-2*dy/5,dx,cs,0,LE) ) Break;	// &
      // check for upper hole
      for (j=0;j<sdata->holes.num;j++) {
        if (sdata->holes.hole[j].y1 < i-y0+1   ) break;
        if (sdata->holes.hole[j].y1 < i-y0+dy/8) break;
      } if (j==sdata->holes.num) Break;  // not found
      // if( num_hole(x0,x1,y0,i+1   ,box1->p,cs,NULL)!=1 )
      // if( num_hole(x0,x1,y0,i+dy/8,box1->p,cs,NULL)!=1 ) Break;	// upper hole
      // check for lower hole
      for (j=0;j<sdata->holes.num;j++) {
        if (sdata->holes.hole[j].y0 > i-y0-1   ) break;
      } if (j==sdata->holes.num) Break;  // not found
      // if( num_hole(x0,x1,i-1,y1,box1->p,cs,NULL)!=1 ) Break; 
      i1=i;  // left middle nick
      /* find the middle right nick */
      for( x=0,i2=i=y=y0+dy/3;y<=y1-dy/3;y++){
	j=loop(box1->p,x1,y,dx,cs,0,LE); if( j>=x ) i2=y;
        /* we care also for 7-segment and unusual fonts */
        if (j>x || (abs(j-x)<=(dx+4)/8
                 && loop(box1->p,x1-j,y,dx,cs,1,LE)>dx/2)){
           if (j>x) x=j; i=y; }
        // MSG(fprintf(stderr," yjix %d %d %d %d %d %d",y-y0,j,i-y0,x,loop(box1->p,x1-j,y,dx,cs,1,LE),dx/2);)
      }
      if( i>y0+dy/2+dy/10 ) Break;
      // if( x<dx/8 ) Break;
      if( x>dx/2 ) Break;
      MSG(fprintf(stderr,"center bar at y= %d %d x=%d+%d i1=%d",i-y0,i2-y0,x,j,i1);)
      if( num_cross(x0,x1, i      , i      ,box1->p,cs) != 1
       && num_cross(x0,x1, i+1    , i+1    ,box1->p,cs) != 1
       && num_cross(x0,x1,(i+i2)/2,(i+i2)/2,box1->p,cs) != 1 ) Break; // no g
      if(abs(i1-i)>(dy+5)/10) ad=99*ad/100; // y-distance right-left-nick
      if(abs(i1-i)>(dy+4)/8)  ad=99*ad/100; // y-distance right-left-nick
      if(abs(i1-i)>(dy+2)/4) Break;
      // ~B ff
      for(i=dx,y=0;y<dy/8+2;y++){
        j=loop(bp,0,y,dx,cs,0,RI); if( j<i ) i=j; if( j>i+dx/16 ) break;
      } if( y<dy/8+2 ) Break;
      for(i=dx,y=0;y<dy/8+2;y++){
        j=loop(bp,0,dy-1-y,dx,cs,0,RI);
        if( j<i ) i=j; if( j>i+dx/16 ) break;
      } if( y<dy/8+2 ) Break;
      if(  dy>16 && num_cross(0,dx-1,dy-1,dy-1,bp,cs) > 1
        && loop(bp,0,dy-1,dx,cs,0,RI) <dx/8+1 ) Break; // no fat serif S
      for( i=0,y=dy/2;y<dy;y++){
        if( num_cross(0,dx-1,y,y,bp,cs) > 2 ) i++; if( i>dy/8 ) break;
      } if( y<dy ) Break;
      if ( loop(bp,dx-1,0,dx,cs,0,LE)==0 ) ad=99*ad/100;
      if (num_cross(   0,dx-1,dy-1,dy-1,bp,cs) > 1) ad=98*ad/100; // &
      if (num_cross(dx-1,dx-1,dy/2,dy-1,bp,cs) > 1) ad=98*ad/100; // &
      if (num_cross(   0,dx-1,   0,   0,bp,cs) > 1) ad=98*ad/100;
      if (dy>15)
      if (num_cross(   0,dx-1,   1,   1,bp,cs) > 1) ad=98*ad/100;
      /* if m1..4 is unsure ignore hchar and gchar ~ga */
      if (!hchar) {
        if ((box1->m2-box1->y0)*8>=dy) ad=98*ad/100;
        else                           ad=99*ad/100;
      }
      if ( gchar
         && (box1->y1-box1->m3)*8>=dy) ad=99*ad/100;
      Setac(box1,(wchar_t)'8',ad);
      break;
   }
   // --- test 9 \it g ---------------------------------------------------
   /* 
    * 
    *    lcd  micr round
    *    ooo  ooo  ooo
    *    o o  o o  o o
    *    ooo  ooo  ooo
    *      o    o    o
    *    ooo    o   o
    */
   for(ad=d=100;dx>2 && dy>4;){     // dx>1 dy>2*dx
      DBG( char c_ask='9'; )
      if (sdata->holes.num > 1) Break;
      if( num_cross(x0+  dx/2,x0+  dx/2,y0,y1-dy/4,box1->p,cs) != 2 // pre select
       && num_cross(x0+  dx/2,x0+  dx/2,y0,     y1,box1->p,cs) != 3 // pre select
       && num_cross(x0+3*dx/8,x0+3*dx/8,y0,y1,box1->p,cs) != 3
       && num_cross(x0+  dx/4,x1  -dx/4,y0,y1,box1->p,cs) != 3 ) Break;
      if( num_cross(x0+  dx/2,x0  +dx/2,y0,y0+dy/4,box1->p,cs) < 1 ) Break;
      if( num_cross(x0+  dx/2,x1, y0+dy/2 ,y0+dy/2,box1->p,cs) < 1 ) Break;
      if( num_cross(x0,x1, y0+  dy/4 ,y0+  dy/4,box1->p,cs) != 2 
       && num_cross(x0,x1, y0+3*dy/8 ,y0+3*dy/8,box1->p,cs) != 2 ) Break;
      if( num_cross(x1-dx/8,x1,y0+dy/4,y0+dy/4,box1->p,cs) == 0) ad=ad*97/100; // ~4
      for( x=0,i=y=y0+dy/2;y<=y1-dy/4;y++){	// find notch (suche kerbe)
	j=loop(box1->p,x0,y,dx,cs,0,RI); 
        if( j>x ) { x=j; i=y; }  
      } if (x<1 || x<dx/8) Break; y=i;
 //      fprintf(stderr," debug 9: %d %d\n",x,i-y0);
      if( x<dx/2 ) {  /* big bow? */
        j=loop(box1->p,x0+x-1,y,dy/8+1,cs,0,DO)/2; y=i=y+j;
        j=loop(box1->p,x0+x-1,y,dx/2  ,cs,0,RI);   x+=j;
        if (x<dx/2) Break;
      }
      // check for the right lower bow
      MSG( fprintf(stderr,"bow-y0= %d",i-y0); )
      if (dx>5)
      if( num_cross(x0+dx/2,x1,i,y1     ,box1->p,cs) != 1  /* fails on 5x8 */
       && num_cross(x0+dx/2,x1,i,y1-dy/8,box1->p,cs) != 1 ) Break;
      if( num_cross(x0+dx/2,x0+dx/2,i,y1,box1->p,cs)  > 1 ) Break;
      if( num_cross(x0+dx/2,x1     ,i, i,box1->p,cs) != 1 ) Break;

      if (sdata->holes.num < 1) { /* happens for 5x7 font */
        if (dx<8) ad=98*ad/100; else Break; }
      else {
        if (sdata->holes.hole[0].y1 >= i+1) Break;
        if (sdata->holes.hole[0].y0 >  i-1) Break;
        if (sdata->holes.num > 1)
        if (sdata->holes.hole[1].y0 >  i-1) Break;
      // if( num_hole(x0,x1,y0,i+1,box1->p,cs,NULL)!=1 ) Break;
      // if( num_hole(x0,x1,i-1,y1,box1->p,cs,NULL)!=0 ) Break;
      }
      if( loop(box1->p,x0,y1  ,dy,cs,0,RI)>dx/3 &&
          loop(box1->p,x0,y1-1,dy,cs,0,RI)>dx/3
         && (box1->m3==0 || (box1->m3!=0 && (!hchar || gchar)))) ad=98*ad/100; // no q OR ocr-a-9
      for( x=0,i=y=y0+dy/3;y<=y1-dy/3;y++){	// suche kerbe
	j=loop(box1->p,x1,y,dx,cs,0,LE); 
        if( j>x ) { x=j; i=y; }
      } if( x>dx/2 ) Break;		// no g
      i1=loop(bp,dx-1,dy/8     ,dx,cs,0,LE); if(i1>dx/2) Break;
      i3=loop(bp,dx-1,dy-1-dy/8,dx,cs,0,LE);
      i2=loop(bp,dx-1,dy/2     ,dx,cs,0,LE); if(i1+i3-2*i2<-1-dx/16) Break; // konvex
      i1=loop(bp,dx-1,dy/4     ,dx,cs,0,LE); if(i1>dx/2) Break;
      i3=loop(bp,dx-1,dy-1-dy/8,dx,cs,0,LE);
      for(y=dy/4;y<dy-1-dy/4;y++){ // may fail on type=round
        i2=loop(bp,dx-1,y,dx,cs,0,LE);
        // konvex from right ~g ~3 Jul09
        if(i2>i1+(i3-i1)*(2*y-dy/2)/dy+dx/16) break;
        // MSG(fprintf(stderr," y i2 %d %d %d",y,i2,i1+(i3-i1)*(2*y-dy/2)/dy);)
      } if(y<dy-1-dy/4) Break;
      x=loop(bp,dx  -1,6*dy/8,dx,cs,0,LE); if(x>0){
        x--; // robust
        y=loop(bp,dx-x-1,  dy-1,dy,cs,0,UP);
        if(y<dy/8) Break; // ~q (serif!)
      }
      // check for agglutinated serif y
      if (dy>=16 && dx>9
        && loop(bp,   0,dy/ 4,dx,cs,0,RI)
          -loop(bp,   0,dy/16,dx,cs,0,RI)>dx/6
        && loop(bp,dx-1,dy/ 4,dx,cs,0,LE)
          -loop(bp,dx-1,dy/16,dx,cs,0,LE)>dx/6) Break; // ~ serif yY
          
      if (box1->m3) {
        if ( gchar) ad=99*ad/100;  /* unsure (italic g)? */
        if (box1->m2 && (!gchar) && y1 > box1->m3){
          ad=99*ad/100;
          if (box1->m4-box1->m3<3) ad=99*ad/100;
          // if (!hchar) ad = 99*ad/100;
        }
        if (!hchar) ad=99*ad/100;  /* unsure */
      } else { if (ad==100) ad=99; } /* not 100% sure */
      Setac(box1,(wchar_t)'9',ad);
      break;
   }
   // 0 is same as O !?
   // --- test 0 (with one big hole in it ) -----------------------------
   for(d=ad=100;dx>2 && dy>3;){     // min 3x4
      DBG( char c_ask='0'; )
      if (sdata->holes.num > 1) Break; /* be tolerant */
      if( get_bw(x0      , x0+dx/3,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x1-dx/3 , x1     ,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      /* could be an O, unless we find a dot in the center */
      if( get_bw(x0      , x1     ,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 3 ) ad=99;
      if( get_bw(x0+dx/2 , x0+dx/2,y1-dy/3 , y1,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y0      , y0+dy/3,box1->p,cs,1) != 1 ) Break;
      /* accept 0 with dot in center, accept \/0 too ... */
      if( get_bw(x0+dx/2 , x0+dx/2,y0+dy/3 , y1-dy/3,box1->p,cs,1) != 0 ) Break;

      if( num_cross(x0+dx/2,x0+dx/2,y0      , y1     ,box1->p,cs)  != 2 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y0      , y0     ,box1->p,cs)  != 1 ) // AND
      if( num_cross(x0+dx/3,x1-dx/3,y0+1    , y0+1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y1      , y1     ,box1->p,cs)  != 1 ) // against "rauschen"
      if( num_cross(x0+dx/3,x1-dx/3,y1-1    , y1-1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0     ,x0     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x0+1   ,x0+1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      if( num_cross(x1     ,x1     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x1-1   ,x1-1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      // if( num_hole(x0,x1,y0,y1,box1->p,cs,NULL) != 1 ) Break;
      if (sdata->holes.num != 1) Break;
      
      i= loop(bp,0   ,0   ,x1-x0,cs,0,RI)-
         loop(bp,0   ,2   ,x1-x0,cs,0,RI);
      if (i<0) Break;
      if (i==0) {
        if (loop(bp,dx-1,0   ,x1-x0,cs,0,LE)>
            loop(bp,dx-1,2   ,x1-x0,cs,0,LE)  ) ad=98*ad/100;
        ad=99*ad/100; /* LCD-type? */
      }
      
      x=loop(bp,dx-1,dy-1-dy/3,x1-x0,cs,0,LE);	// should be minimum
      for (y=dy-1-dy/3;y<dy;y++){
        i=loop(bp,dx-1,y,x1-x0,cs,0,LE);
        if (i<x-dx/16-1) break; if (i>x) x=i;
      }
      if( y<dy ) Break;

      // ~D (but ocr-a-font)
      i=      loop(bp,   0,     dy/16,dx,cs,0,RI)
         +    loop(bp,   0,dy-1-dy/16,dx,cs,0,RI)
         -  2*loop(bp,   0,     dy/2 ,dx,cs,0,RI);
      j=      loop(bp,dx-1,     dy/16,dx,cs,0,LE)
         +    loop(bp,dx-1,dy-1-dy/16,dx,cs,0,LE)
         <= 2*loop(bp,dx-1,     dy/2 ,dx,cs,0,LE);
      if (i<-dx/8 || i+dx/8<j) Break; // not konvex

      if( loop(bp,dx-1,     dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,     dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( loop(bp,dx-1,dy-1-dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,dy-1-dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( get_bw(x1-dx/32,x1,y0,y0+dy/32,box1->p,cs,1) == 0
       && get_bw(x1-dx/32,x1,y1-dy/32,y1,box1->p,cs,1) == 0
       && ( get_bw(x0,x0+dx/32,y0,y0+dy/32,box1->p,cs,1) == 1
         || get_bw(x0,x0+dx/32,y1-dy/32,y1,box1->p,cs,1) == 1 ) ) {
         if (dx<32) ad=ad*99/100; else Break; // ~D
      }

      // search lowest inner white point
      for(y=dy,j=x=0;x<dx;x++) {
        i =loop(bp,x,dy-1  ,y1-y0,cs,0,UP);
        i+=loop(bp,x,dy-1-i,y1-y0,cs,1,UP);
        if (i<=y) { y=i; j=x; }
      } i=y;
      // italic a
      for(y=dy-1-i;y<dy-1;y++)
        if( num_cross(j,dx-1,y,y,bp,cs) > 1 ) ad=99*ad/100; // ~a \it a

      if (loop(bp,   0,   0,x1-x0,cs,0,RI)>=dx/8) { // round, notLCD
        if (loop(bp,dx-1,dy-1,x1-x0,cs,0,LE)<dx/8) ad=98*ad/100; // \it a
        if (loop(bp,dx-1,   0,x1-x0,cs,0,LE)<dx/8) ad=98*ad/100; // \it a
      }

      if (abs(loop(bp,dx/2,   0,dy,cs,0,DO)
             -loop(bp,dx/2,dy-1,dy,cs,0,UP))>dy/8
        || num_cross(0,dx-1,   0,   0,bp,cs) > 1
        || num_cross(0,dx-1,dy-1,dy-1,bp,cs) > 1
         ) ad=98*ad/100; // ~bq

      if (box1->m3) {
       if (!hchar) ad=98*ad/100; else // ~o
       if ( gchar) ad=99*ad/100;      // wrong line detection?
      } else { if (ad==100) ad=99; } /* not 100% sure */
      if (ad>99) ad=99; /* we can never be sure having a O,
                           let context correction decide, see below! */
      Setac(box1,(wchar_t)'0',ad);
      break;
   } 
   // --- test 0 with a straight line in it -------------------
   for(ad=100;dx>4 && dy>5;){  /* v0.3.1+ */
      DBG( char c_ask='0'; )
      if (sdata->holes.num > 3) Break; /* be tolerant */
      if (sdata->holes.num < 1) Break;
      if (sdata->holes.num != 2) ad=95*ad/100;
      if( get_bw(x0      , x0+dx/2,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x1-dx/2 , x1     ,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y1-dy/2 , y1,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y0      , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y0+dy/3 , y1-dy/3,box1->p,cs,1) != 1 ) Break;
      // out_x(box1); printf(" x0 y0 %d %d\n",x0,y0);
      if( num_cross(x0+dx/2,x0+dx/2,y0      , y1     ,box1->p,cs)  != 3 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y0      , y0     ,box1->p,cs)  != 1 ) // AND
      if( num_cross(x0+dx/3,x1-dx/3,y0+1    , y0+1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y1      , y1     ,box1->p,cs)  != 1 ) // against "rauschen"
      if( num_cross(x0+dx/3,x1-dx/3,y1-1    , y1-1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0     ,x0     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x0+1   ,x0+1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      if( num_cross(x1     ,x1     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x1-1   ,x1-1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      // if( num_hole(x0,x1,y0,y1,box1->p,cs,NULL) != 2 ) Break;
      if (sdata->holes.num != 2) ad=85*ad/100;
      
      if( loop(bp,0   ,        0,x1-x0,cs,0,RI)<=
          loop(bp,0   ,  2+dy/32,x1-x0,cs,0,RI)  ) Break;
      x=  loop(bp,0   ,dy/2  ,x1-x0,cs,0,RI);
      i=  loop(bp,0   ,dy/2-1,x1-x0,cs,0,RI); if (i>x) x=i;
      i=  loop(bp,0   ,dy/2-2,x1-x0,cs,0,RI); if (i>x && dy>8) x=i;
      if( loop(bp,0   ,  dy/4,x1-x0,cs,0,RI)<x ) Break; // ~8
      x=  loop(bp,dx-1,dy/2  ,x1-x0,cs,0,LE);
      i=  loop(bp,dx-1,dy/2-1,x1-x0,cs,0,LE); if(i>x) x=i;
      i=  loop(bp,dx-1,dy/2-1,x1-x0,cs,0,LE); if(i>x && dy>8) x=i;
      if( loop(bp,dx-1,3*dy/4,x1-x0,cs,0,LE)<x) Break; // ~8

      x=loop(bp,dx-1,dy-1-dy/3,x1-x0,cs,0,LE);	// should be minimum
      for( y=dy-1-dy/3;y<dy;y++ ){
        i=loop(bp,dx-1,y,x1-x0,cs,0,LE);
        if (i<x-dx/16) break; 
        if (i>x) x=i;
      }
      if( y<dy ) Break;
      
      /* test for straight line */
      y =loop(bp,dx/2,dy-1  ,y1-y0,cs,0,UP); if(y>dy/4) Break;
      y+=loop(bp,dx/2,dy-1-y,y1-y0,cs,1,UP); if(y>dy/3) Break; if (y>dy/4) ad=ad*99/100;
      y+=loop(bp,dx/2,dy-1-y,y1-y0,cs,0,UP); if(3*y>2*dy) Break;
      x =loop(bp,dx/2,dy-y,dx/2,cs,0,RI);    if(x==0) Break;
      // MM; fprintf(stderr," y=%d x=%d\n",y-1,x);
      if( loop(bp,dx/2+x-1-dx/16,dy-y,y1-y0,cs,0,UP)==0 ) Break;
       // $
      for(i=0,y=dy/4;y<dy-dy/4-1;y++)
      if( loop(bp,   0,y,dx-1,cs,0,RI) > dx/4
       || loop(bp,dx-1,y,dx-1,cs,0,LE) > dx/4 ) break;
      if( y<dy-dy/4-1 ) Break;

      // ~D
      if(     loop(bp,0,     dy/16,dx,cs,0,RI)
         +    loop(bp,0,dy-1-dy/16,dx,cs,0,RI)
         <= 2*loop(bp,0,     dy/2 ,dx,cs,0,RI)+dx/8 ) Break; // not konvex

      if( loop(bp,dx-1,     dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,     dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( loop(bp,dx-1,dy-1-dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,dy-1-dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( get_bw(x1-dx/32,x1,y0,y0+dy/32,box1->p,cs,1) == 0
       && get_bw(x1-dx/32,x1,y1-dy/32,y1,box1->p,cs,1) == 0
       && ( get_bw(x0,x0+dx/32,y0,y0+dy/32,box1->p,cs,1) == 1
         || get_bw(x0,x0+dx/32,y1-dy/32,y1,box1->p,cs,1) == 1 ) ) Break; // ~D

      /* 5x9 font "9" is like "0" */
      if (dx<16)
      if ( num_cross(x0,x0,y0,y1,box1->p,cs)  != 1 ) ad=98*ad/100;

       // italic a
      for(i=0,y=6*dy/8;y<dy-dy/16;y++)
      if( num_cross(0,dx-1,y,y,bp,cs) > 2 ) i++; else i--;
      if(i>0) ad=ad*98/100; // ~'a' \it a
      if( !hchar ) ad=90*ad/100;
      Setac(box1,(wchar_t)'0',ad);
      break;
   } 
   // --- test 0 with a straight dot in it -------------------
   for(ad=100;dx>4 && dy>5;){  /* v0.46+ */
      DBG( char c_ask='0'; )
      if (sdata->holes.num != 1) Break; /* do not be tolerant */
      if (sdata->box1->num_frames != 2) ad=85*ad/100;
      if( get_bw(x0      , x0+dx/2,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x1-dx/2 , x1     ,y0+dy/2 , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y1-dy/2 , y1,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y0      , y0+dy/2,box1->p,cs,1) != 1 ) Break;
      if( get_bw(x0+dx/2 , x0+dx/2,y0+dy/3 , y1-dy/3,box1->p,cs,1) != 1 ) Break;
      // out_x(box1); printf(" x0 y0 %d %d\n",x0,y0);
      if( num_cross(x0+dx/2,x0+dx/2,y0      , y1     ,box1->p,cs)  != 3 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y0      , y0     ,box1->p,cs)  != 1 ) // AND
      if( num_cross(x0+dx/3,x1-dx/3,y0+1    , y0+1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0+dx/3,x1-dx/3,y1      , y1     ,box1->p,cs)  != 1 ) // against "rauschen"
      if( num_cross(x0+dx/3,x1-dx/3,y1-1    , y1-1   ,box1->p,cs)  != 1 ) Break;
      if( num_cross(x0     ,x0     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x0+1   ,x0+1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      if( num_cross(x1     ,x1     ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 )
      if( num_cross(x1-1   ,x1-1   ,y0+dy/3 , y1-dy/3,box1->p,cs)  != 1 ) Break;
      // if( num_hole(x0,x1,y0,y1,box1->p,cs,NULL) != 2 ) Break;
      
      if( loop(bp,0   ,        0,x1-x0,cs,0,RI)<=
          loop(bp,0   ,  2+dy/32,x1-x0,cs,0,RI)  ) Break;
      x=  loop(bp,0   ,dy/2  ,x1-x0,cs,0,RI);
      i=  loop(bp,0   ,dy/2-1,x1-x0,cs,0,RI); if (i>x) x=i;
      i=  loop(bp,0   ,dy/2-2,x1-x0,cs,0,RI); if (i>x && dy>8) x=i;
      if( loop(bp,0   ,  dy/4,x1-x0,cs,0,RI)<x ) Break; // ~8
      x=  loop(bp,dx-1,dy/2  ,x1-x0,cs,0,LE);
      i=  loop(bp,dx-1,dy/2-1,x1-x0,cs,0,LE); if(i>x) x=i;
      i=  loop(bp,dx-1,dy/2-1,x1-x0,cs,0,LE); if(i>x && dy>8) x=i;
      if( loop(bp,dx-1,3*dy/4,x1-x0,cs,0,LE)<x) Break; // ~8

      x=loop(bp,dx-1,dy-1-dy/3,x1-x0,cs,0,LE);	// should be minimum
      for( y=dy-1-dy/3;y<dy;y++ ){
        i=loop(bp,dx-1,y,x1-x0,cs,0,LE);
        if (i<x-dx/16) break; 
        if (i>x) x=i;
      }
      if( y<dy ) Break;
      
      /* test for straight line */
      y =loop(bp,dx/2,dy-1  ,y1-y0,cs,0,UP); if(y>dy/4) Break;
      y+=loop(bp,dx/2,dy-1-y,y1-y0,cs,1,UP); if(y>dy/3) Break; if (y>dy/4) ad=ad*99/100;
      y+=loop(bp,dx/2,dy-1-y,y1-y0,cs,0,UP); if(3*y>2*dy) Break;
      x =loop(bp,dx/2,dy-y,dx/2,cs,0,RI);    if(x==0) Break;
      // MM; fprintf(stderr," y=%d x=%d\n",y-1,x);
      if( loop(bp,dx/2+x-1-dx/16,dy-y,y1-y0,cs,0,UP)==0 ) Break;
       // $
      for(i=0,y=dy/4;y<dy-dy/4-1;y++)
      if( loop(bp,   0,y,dx-1,cs,0,RI) > dx/4
       || loop(bp,dx-1,y,dx-1,cs,0,LE) > dx/4 ) break;
      if( y<dy-dy/4-1 ) Break;

      // ~D
      if(     loop(bp,0,     dy/16,dx,cs,0,RI)
         +    loop(bp,0,dy-1-dy/16,dx,cs,0,RI)
         <= 2*loop(bp,0,     dy/2 ,dx,cs,0,RI)+dx/8 ) Break; // not konvex

      if( loop(bp,dx-1,     dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,     dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( loop(bp,dx-1,dy-1-dy/16,dx,cs,0,LE)>dx/8 )
      if( loop(bp,0   ,dy-1-dy/16,dx,cs,0,RI)<dx/16 ) Break;
      if( get_bw(x1-dx/32,x1,y0,y0+dy/32,box1->p,cs,1) == 0
       && get_bw(x1-dx/32,x1,y1-dy/32,y1,box1->p,cs,1) == 0
       && ( get_bw(x0,x0+dx/32,y0,y0+dy/32,box1->p,cs,1) == 1
         || get_bw(x0,x0+dx/32,y1-dy/32,y1,box1->p,cs,1) == 1 ) ) Break; // ~D

      /* 5x9 font "9" is like "0" */
      if (dx<16)
      if ( num_cross(x0,x0,y0,y1,box1->p,cs)  != 1 ) ad=98*ad/100;

       // italic a
      for(i=0,y=6*dy/8;y<dy-dy/16;y++)
      if( num_cross(0,dx-1,y,y,bp,cs) > 2 ) i++; else i--;
      if(i>0) ad=ad*98/100; // ~'a' \it a
      if( !hchar ) ad=90*ad/100;
      Setac(box1,(wchar_t)'0',ad);
      break;
   } 
   return box1->c;
}
