/*
This is a Optical-Character-Recognition program
Copyright (C) 2000  Joerg Schulenburg

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

 see README for EMAIL-address */
 
#ifndef OUTPUT_H
#define OUTPUT_H

#include <stdlib.h>
#include <stdio.h>
#include "pnm.h"
#include "gocr.h"
#include "list.h"

void out_b(struct box *px, pix *b, int x0, int y0, int dx, int dy, int cs );
void out_x(struct box *px);
void out_x2(struct box *box1,struct box *box2);
int output_list(job_t *job);
int debug_img(char *fname, struct job_s *job, int opt);


#endif
