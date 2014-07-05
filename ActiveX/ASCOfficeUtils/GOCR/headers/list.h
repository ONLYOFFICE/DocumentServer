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

 see README for EMAIL-address
 
 */

#ifndef GOCR_LIST_H
#define GOCR_LIST_H

#ifdef DEBUG
#define g_debug(a)	a
#else
#define g_debug(a)	
#endif

/*
 * Structures
 */
 
struct element {
   struct element *next, *previous;
   void *data;
};
typedef struct element Element;

struct list {
   Element start;               /* simplifies for(each_element) { ... */
   Element stop;                /*   ... list_del() ... }  v0.41      */
   Element **current;	 	/* for(each_element) */
   int n;			/* number of elements */
   int level;			/* level of nested fors */
};
typedef struct list List;

/*
 * Functions
 */

void	list_init		( List *l );
int	list_app		( List *l, void *data );
int	list_ins		( List *l, void *data_after, void *data);
Element*list_element_from_data	( List *l, void *data );
int	list_del		( List *l, void *data );
void	list_free		( List *l );
int	list_and_data_free	( List *l, void (*free_data)(void *data));
int	list_higher_level	( List *l );
void	list_lower_level	( List *l );
void *	list_next		( List *l, void *data );
void *	list_prev		( List *l, void *data );
void	list_sort		( List *l, int (*compare)(const void *, const void *) );

#define list_empty(l)			((l)->start.next == &(l)->stop ? 1 : 0)
#define list_get_header(l)		((l)->start.next->data)
#define list_get_tail(l)		((l)->stop.previous->data)
#define list_get_current(l)		((l)->current[(l)->level]->data)
#define list_get_cur_prev(l)		((l)->current[(l)->level]->previous == NULL ? \
			NULL : (l)->current[(l)->level]->previous->data )
#define list_get_cur_next(l)		((l)->current[(l)->level]->next == NULL ? \
			NULL : (l)->current[(l)->level]->next->data )
#define list_total(l)			((l)->n)

#define for_each_data(l)		\
 if (list_higher_level(l) == 0) { \
   for ( ; (l)->current[(l)->level] \
        && (l)->current[(l)->level]!=&(l)->stop; (l)->current[(l)->level] = \
	(l)->current[(l)->level]->next ) {


#define end_for_each(l)			\
   } \
 list_lower_level(l); \
 }

#endif
