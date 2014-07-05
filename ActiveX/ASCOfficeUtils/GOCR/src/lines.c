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
*/

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <limits.h>
#include <assert.h>
#include "pgm2asc.h"
#include "gocr.h"
#include "unicode.h"

const char *getTextLine (int line) {
  int i;
  Element *elem;
  
  if (line < 0 || line > list_total(&(JOB->res.linelist)))
    return NULL;

  for ( i = 0, elem = JOB->res.linelist.start.next; i < line && elem != NULL; i++ )
    elem = elem->next;

  if ( elem != NULL )
    return (const char *)elem->data;

  return NULL;
}

void free_textlines(void) {
  for_each_data(&(JOB->res.linelist)) {
    if (list_get_current(&(JOB->res.linelist)))
      free(list_get_current(&(JOB->res.linelist)));
  } end_for_each(&(JOB->res.linelist));
  list_free(&(JOB->res.linelist));
}

/* append a string (s1) to the string buffer (buffer) of length (len)
 * if buffer is to small or len==0 realloc buffer, len+=512
 */
char *append_to_line(char *buffer, const char *s1, int *len) {
  char *temp;
  int slen=0, alen;
  if( s1==NULL || s1[0] == 0 ){
    fprintf(stderr,"\n#BUG: appending 0 to a line makes no sense!");
    return buffer;
  }
  if ( *len>0 ) slen= strlen(buffer);  // used buffer
  alen = strlen(s1);
  if ( slen+alen+1 >= *len ) {
	if(alen+1<=512)
		*len+=512;
	else
		*len+=alen+1;
    temp = (char *)realloc(buffer, *len);
    if( !temp ) { fprintf(stderr,"realloc failed!\n"); *len-=512; return buffer; }
    else buffer = temp;  // buffer successfull enlarged
  }
  temp = buffer + slen;   // end of buffered string
  memcpy(temp,s1,alen+1); // copy including end sign '\0'
  return buffer;
}

int calc_median_gap(struct tlines * lines) {
  int gaps[MAXlines], l;
  if (lines->num<2) return 0;
  for (l = 0; l < lines->num - 1; l++)
    gaps[l] = lines->m2[l + 1] - lines->m3[l];
  qsort(gaps, lines->num - 1, sizeof(gaps[0]), intcompare);
  return gaps[(lines->num - 1) / 2];
}

/*
 *  Return the indent in pixels of the least-indented line.
 *  Will be subtracted as base_indent to avoid negativ indent.
 *
 *  This is adjusted to account for an angle on the page as
 *  a whole.  For instance, if the page is rotated clockwise,
 *  lower lines may be physically closer to the left edge
 *  than higher lines that are logically less indented.
 *  We rotate around (0,0).  Note that this rotation could
 *  rotate lines "off the left margin", leading to a negative
 *  indent.
 *
 *  boxlist -- list of character boxes.
 *  dx, dy -- rotation angle as vector
 */
int get_least_line_indent(List * boxlist, int dx, int dy) {
    int min_indent = INT_MAX;
    int adjusted_indent;
    struct box * box2;
    if (JOB->cfg.verbose)
      fprintf(stderr, "get_least_line_indent: rot.vector dxdy %d %d\n",
              dx, dy);
    for_each_data(boxlist) {
        box2 = (struct box *)list_get_current(boxlist);
        /* if num == -1, indicates this is a space or newline box,
         * inserted in list_insert_spaces. */
        if (box2->num != -1) {
            adjusted_indent = box2->x0;
            if (dx) adjusted_indent += box2->y0 * dy / dx;
            if (adjusted_indent < min_indent) {
                min_indent = adjusted_indent;
                if (dy!=0 && JOB->cfg.verbose)
                  fprintf(stderr, 
                   "# Line %2d, unadjusted xy %3d %3d, adjusted x %2d\n", 
                    box2->line, box2->x0, box2->y0, adjusted_indent);
            }
        }
    } end_for_each(boxlist);
    if (JOB->cfg.verbose)
      fprintf(stderr, "# Minimum adjusted x: %d (min_indent)\n", min_indent);
    return min_indent;
}

/* collect all the chars from the box tree and write them to a string buffer
   mo is the mode: mode&8 means, use chars even if unsure recognized
   ToDo: store full text(?), store decoded text+boxes+position chars (v0.4)
         (HTML,UTF,ASCII,XML), not wchar incl. descriptions (at<95% in red)
         remove decode(*c, job->cfg.out_format) from gocr.c!
         XML add alternate-tags, format tags and position tags 
   ToDo: better output XML to stdout instead of circumstantial store to lines
       not all texts/images follow the line concept?
   Better use a tree of objects where leafes are chars instead of simple list.
   Chars or objects are taken into account. Objects can be text strings
   or XML strings.
 */
void store_boxtree_lines(int mo) {
  char *buffer;	/* temp buffer for text */
  int i = 0, j = 0;
  int len = 1024;   // initial buffer length for text line
  struct box *box2;
  int median_gap = 0;
  int max_single_space_gap = 0;
  struct tlines line_info;
  int line, line_gap, oldline=-1;
  int left_margin;
  int i1=0, i2=0;

  buffer = (char *)malloc(len);
  if ( !buffer ) { 
    fprintf(stderr,"malloc failed!\n"); // ToDo: index_to_error_list 
    return;
  }
  *buffer = 0;

  if ( JOB->cfg.verbose&1 ) 
    fprintf(stderr,"# store boxtree to lines ...");

  /* wew: calculate the median line gap, to determine line spacing
   * for the text output.  The line gap used is between one line's
   * m3 (baseline) and the next line's m2 (height of non-rising 
   * lowercase).  We use these lines as they are the least likely
   * to vary according to actual character content of lines.
   */
  median_gap = calc_median_gap(&JOB->res.lines);
  if (median_gap <= 0) {
      fprintf(stderr, "# Warning: non-positive median line gap of %d\n",
              median_gap);
      median_gap = 8;
      max_single_space_gap = 12;  /* arbitrary */
  } else {
      max_single_space_gap = median_gap * 7 / 4;
  }

  // Will be subtracted as base_indent to avoid negativ indent.
  left_margin = get_least_line_indent(&JOB->res.boxlist,
          JOB->res.lines.dx, 
          JOB->res.lines.dy);

  if (JOB->cfg.out_format==XML) { /* subject of change */
    char s1[255]; /* ToDo: avoid potential buffer overflow !!! */
    /* output lot of usefull information for XML filter */
    sprintf(s1,"<page x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\">\n",
       0,0,0,0);
    buffer=append_to_line(buffer,s1,&len);
    sprintf(s1,"<block x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\">\n",
       0,0,0,0);
    buffer=append_to_line(buffer,s1,&len);
  } 

  for_each_data(&(JOB->res.boxlist)) {
    box2 = (struct box *)list_get_current(&(JOB->res.boxlist));
    line = box2->line;
    line_info = JOB->res.lines;
    /* reset the output char if certainty is below the limit v0.44 */
    if (box2->num_ac && box2->wac[0]<JOB->cfg.certainty) box2->c=UNKNOWN;
    if (line!=oldline) {
      if (JOB->cfg.out_format==XML && oldline>-1) { /* subject of change */
        buffer=append_to_line(buffer,"</line>\n",&len);
        list_app( &(JOB->res.linelist), (void *)strdup(buffer) ); // wcsdup
        memset(buffer, 0, len);
        j=0;  // reset counter for new line
      } 
      if (JOB->cfg.out_format==XML) { /* subject of change */
        char s1[255]; /* ToDo: avoid potential buffer overflow !!! */
        /* output lot of usefull information for XML filter */
        sprintf(s1,"<line x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\" value=\"%d\">\n",
           line_info.x0[line],line_info.m1[line],
           line_info.x1[line]-line_info.x0[line]+1,
           line_info.m4[line]-line_info.m1[line],line);
        buffer=append_to_line(buffer,s1,&len);
      }
      oldline=line;
    }
    if (box2->c >  ' ' &&
        box2->c <= 'z') i1++; /* count non-space chars */
    if (box2->c == '\n') {
      if (JOB->cfg.out_format!=XML) { /* subject of change */
        line_info = JOB->res.lines;
        line = box2->line;
        if (line > 0) {
          line_gap = line_info.m2[line] - line_info.m3[line - 1];
          for (line_gap -= max_single_space_gap; line_gap > 0; 
               line_gap -= median_gap) {
            buffer=append_to_line(buffer,"\n",&len);
            j++; /* count chars in line */
          }
        } 
        list_app( &(JOB->res.linelist), (void *)strdup(buffer) ); // wcsdup
        memset(buffer, 0, len);
        j=0;  // reset counter for new line
      } 
    }
    if (box2->c == ' ')	// fill large gaps with spaces
    {
      if (JOB->res.avX) { /* avoid SIGFPE */
        if (JOB->cfg.out_format==XML) { /* subject of change */
          char s1[255]; /* ToDo: avoid potential buffer overflow !!! */
          /* output lot of usefull information for XML filter */
          sprintf(s1," <space x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\" />\n",
                  box2->x0,box2->y0,box2->x1-box2->x0+1,box2->y1-box2->y0+1);
          buffer=append_to_line(buffer,s1,&len);
        } else
        for (i = (box2->x1 - box2->x0) / (2 * JOB->res.avX) + 1; i > 0; i--) {
          buffer=append_to_line(buffer," ",&len);
          j++; /* number of chars in line */
        }
      }
    }
    else if (box2->c != '\n') {
      if (j==0 && JOB->res.avX) /* first char in new line? */ {
        int indent = box2->x0 - JOB->res.lines.x0[box2->line];
        /* correct for angle of page as a whole. */
        if (JOB->res.lines.dx)
          indent += box2->y0 * JOB->res.lines.dy / JOB->res.lines.dx;
        /* subtract the base margin. */
        indent -= left_margin;
        if (JOB->cfg.out_format==XML) { /* subject of change */
          char s1[255]; /* ToDo: avoid potential buffer overflow !!! */
          /* output lot of usefull information for XML filter */
          sprintf(s1," <space x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\" />\n",
                  box2->x0,box2->y0,box2->x1-box2->x0+1,box2->y1-box2->y0+1);
          buffer=append_to_line(buffer,s1,&len);
        } else
        for (i = indent / JOB->res.avX; i > 0; i--) {
          buffer=append_to_line(buffer," ",&len); j++;
        }
      }
      if (JOB->cfg.out_format==XML) { /* subject of change */
        char s1[255]; /* ToDo: avoid potential buffer overflow !!! */
        /* output lot of usefull information for XML filter */
        sprintf(s1," <box x=\"%d\" y=\"%d\" dx=\"%d\" dy=\"%d\" value=\"",
                box2->x0,box2->y0,box2->x1-box2->x0+1,box2->y1-box2->y0+1);
        buffer=append_to_line(buffer,s1,&len);
        if (box2->num_ac>1) { /* ToDo: output a list of alternatives */
        }
      }
      if (box2->c != UNKNOWN  &&  box2->c != 0) {
        buffer=
          append_to_line(buffer,decode(box2->c,JOB->cfg.out_format),&len);
        if (box2->c >  ' ' &&
            box2->c <= 'z') i2++; /* count non-space chars */
      } else { /* c == UNKNOWN or 0 */
        wchar_t cc; cc=box2->c;
        if (box2->num_ac>0 && box2->tas[0]
                && (JOB->cfg.out_format!=XML || box2->tas[0][0]!='<')) {
          /* output glued chars or ... (?) Jan08 */
          buffer=append_to_line(buffer,box2->tas[0],&len);
          j+=strlen(box2->tas[0]);
        } else {  /* ToDo: leave string empty? set placeholder per option */
           /* output dummy string to mark UNKNOWN */
           if(JOB->cfg.unrec_marker[0])
             buffer = append_to_line(buffer, JOB->cfg.unrec_marker, &len);
        }
      }
      if (JOB->cfg.out_format==XML) {
        if (box2->num_ac>0) {
          /* output alist ToDo: separate <altbox ...> */
          int i1; char s1[256];
          sprintf(s1,"\" numac=\"%d\" weights=\"",box2->num_ac);
          buffer=append_to_line(buffer,s1,&len);
          for (i1=0;i1<box2->num_ac;i1++) {
            sprintf(s1,"%d",box2->wac[i1]);
            buffer=append_to_line(buffer,s1,&len);
            if (i1+1<box2->num_ac) buffer=append_to_line(buffer,",",&len);
          }
          if (box2->num_ac>1)
            buffer=append_to_line(buffer,"\" achars=\"",&len);
          for (i1=1;i1<box2->num_ac;i1++) {
            if (box2->tas[i1] && box2->tas[i1][0]!='<')
              buffer=append_to_line(buffer,box2->tas[i1],&len);
            else
              buffer=append_to_line(buffer,
                 decode(box2->tac[i1],JOB->cfg.out_format),&len);
            // ToDo: add tas[] (achars->avalues or alternate_strings?
            if (i1+1<box2->num_ac) buffer=append_to_line(buffer,",",&len);
          }
        }
        buffer=append_to_line(buffer,"\" />\n",&len);
      }
      if (box2->num_ac && box2->tas[0]) {
        if (box2->tas[0][0]=='<') { /* output special XML object */ 
          buffer=append_to_line(buffer,box2->tas[0],&len);
          buffer=append_to_line(buffer,"\n",&len);
          j+=strlen(box2->tas[0]);
        }
      }
      j++; /* number of chars in line */
    }
    i++;
  } end_for_each(&(JOB->res.boxlist));
  if (JOB->cfg.out_format==XML && oldline>-1) { /* subject of change */
    buffer=append_to_line(buffer,"</line>\n",&len);
  } 
  if (JOB->cfg.out_format==XML) { /* subject of change */
    buffer=append_to_line(buffer,"</block>\n</page>\n",&len);
  } 

  /* do not forget last line */
  // is there no \n in the last line? If there is, delete next line.
  list_app( &(JOB->res.linelist), (void *)strdup(buffer) );
  free(buffer);
  if( JOB->cfg.verbose&1 )
    fprintf(stderr,"... %d lines, boxes= %d, chars= %d\n",i,i1,i2);
}
