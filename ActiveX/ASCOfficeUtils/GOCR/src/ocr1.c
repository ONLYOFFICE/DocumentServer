// test routines - faster to compile
#include <stdlib.h>
#include <stdio.h>
#include "pgm2asc.h"
#include "unicode.h"
#include "amiga.h"
#include "gocr.h"

// for learn_mode/analyze_mode high, with, yoffset, num of pattern_i,
//  - holes (center,radius in relative coordinates) etc. => cluster analyze
// num_hole => min-volume, tolerance border
// pattern:  @@ @. @@
//           .@ @. ..
// regular filter for large resolutions to make edges more smooth (on boxes)
// extra-filter (only if not recognized?)
//   map + same color to (#==change)
//       - anti color
//       . not used
// strongest neighbour pixels (3x3) => directions
// second/third run with more and more tolerance!?

/* FIXME jb: following is unused */
#if 0
struct lobj {	// line-object (for fitting to near lines)
	int x0,y0;	// starting point (left up)
        int x1,y1;      // end point      (right down)
        int mt;		// minimum thickness
	int q;		// quality, overlapp
};

/* FIXME jb global */
struct lobj obj1;
#endif

// that is the first draft of feature extraction 
// detect main lines and bows
// seems bad implemented, looking for better algorithms (ToDo: use autotrace)
#define MAXL 10
void ocr2(pix *b,int cs){
  int x1,y1,x2,y2,l,i,j,xa[MAXL],ya[MAXL],xb[MAXL],yb[MAXL],ll[MAXL];
  for(i=0;i<MAXL;i++)xa[i]=ya[i]=xb[i]=yb[i]=ll[i]=0;
  for(x1=0;x1<b->x;x1++)		// very slowly, but simple to program
  for(y1=0;y1<b->y;y1++)         // brute force
  for(x2=0;x2<b->x;x2++)
  for(y2=y1+1;y2<b->y;y2++)
  {
    if( get_line2(x1,y1,x2,y2,b,cs,100)>99 )
    {  // line ???
      l=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);  // len
      for(i=0;i<MAXL;i++)
      {  // remove similar lines (same middle point) IMPROVE IT !!!!!! ???
        if(
            abs(x1+x2-xa[i]-xb[i])<1+b->x/2
         && abs(y1+y2-ya[i]-yb[i])<1+b->y/2
         && abs(y1-ya[i])<1+b->y/4
         && abs(x1-xa[i])<1+b->x/4
          )
        {
          if( l>ll[i] )
          {
            for(j=i;j<MAXL-1;j++)
            {  // shift table
              xa[j]=xa[j+1];ya[j]=ya[j+1];
              xb[j]=xb[j+1];yb[j]=yb[j+1];ll[j]=ll[j+1];
            }
            ll[MAXL-1]=0;
          }
          else break; // forget it if shorter
        }
        if( l>ll[i] ){ // insert if larger
          for(j=MAXL-1;j>i;j--){  // shift table
            xa[j]=xa[j-1];ya[j]=ya[j-1];
            xb[j]=xb[j-1];yb[j]=yb[j-1];ll[j]=ll[j-1];
          }
          xa[i]=x1;ya[i]=y1;xb[i]=x2;yb[i]=y2;ll[i]=l;
          break;
        }
      }
    }
  }
  for(i=0;i<MAXL;i++){
    printf(" %2d %2d %2d %2d %3d\n",xa[i],ya[i],xb[i],yb[i],ll[i]);
  }  
}

