/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2006  Joerg Schulenburg

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

 see README for email address
 
 ***********************************IMPORTANT*********************************
 Notes to the developers: read the following notes before using these
 functions.
   * Be careful when using for_each_data() recursively and calling list_del.
    It may mangle with the current[] pointers, and possibly segfault or do an
    unpredictable or just undesirable behavior. We have been working on a 
    solution for this problem, and solved some of the biggest problems.
     In a few words, the problem is this: when you delete a node, it may be
    the current node of a lower level loop. The current code takes care of
    access to previous/next elements of the now defunct node. So, if you do
    something like:
  
    for_each_data(l) {
      for_each_data(l) {
	list_del(l, header_data);
	free(header_data);
      } end_for_each(l);
+     tempnode = list_cur_next(l);
    } end_for_each(l);

    It will work, even though the current node in the outer loop was deleted.
    However, if you replace the line marked with + with the following code:

      tempnode = list_next(l, list_get_current(l));

    it will break, since list_get_current is likely to return NULL or garbage,
    since you deleted header_data().
     Conclusion: use list_del carefully. The best way to avoid this problem is
    to not use list_del inside a big stack of loops.
   * If you have two elements with the same data, the functions will assume 
    that the first one is the wanted one. Not a bug, a feature. ;-)
   * avoid calling list_prev and list_next. They are intensive and slow 
    functions. Keep the result in a variable or, if you need something more,
    use list_get_element_from_data.

 */

#include <stdio.h>
#include <stdlib.h>
#include "list.h"
#include "progress.h"

void list_init( List *l ) {
  if ( !l )
     return;

  l->start.next     = &l->stop;
  l->stop.previous  = &l->start;
  l->start.previous = l->stop.next = NULL;
  l->start.data = l->stop.data = NULL;
  l->current = NULL;
  l->level = -1;
  l->n = 0;
}

/* inserts data before data_after. If data_after == NULL, appends.
   Returns 1 on error, 0 if OK. */
int list_ins( List *l, void *data_after, void *data) {
  Element *e, *after_element;

  /* test arguments */
  if ( !l || !data )
    return 1;

  if ( !data_after || !l->n )
    return list_app(l, data);

  /* get data_after element */
  if ( !(after_element = list_element_from_data(l, data_after)) )
    return 1;

  /* alloc a new element */
  if( !(e = (Element *)malloc(sizeof(Element))) )
    return 1;
  e->data     = data;
  e->next     = after_element;
  e->previous = after_element->previous;
  after_element->previous->next = e;
  after_element->previous       = e;
  l->n++;

  return 0;
}

/* appends data to the list. Returns 1 on error, 0 if OK. */
/* same as list_ins(l,NULL,data) ??? */
int list_app( List *l, void *data ) {
  Element *e;
  
  if ( !l || !data )
     return 1;
  if ( !(e = (Element *)malloc(sizeof(Element))) )
    return 1;
  
  e->data     = data;
  e->previous = l->stop.previous;
  e->next     = l->stop.previous->next;
  l->stop.previous->next = e;
  l->stop.previous       = e;
  l->n++;
  return 0;
}

/* returns element associated with data. */
Element *list_element_from_data( List *l, void *data ) {
  Element *temp;

  if ( !l || !data || !l->n)
    return NULL;

  temp = l->start.next;

  while ( temp->data != data ) {
    if ( !temp || temp==&l->stop )
      return NULL;
    temp = temp->next;
  }
  return temp;
}

/* deletes (first) element with data from list. User must free data.
   Returns 0 if OK, 1 on error.
   This is the internal version, that shouldn't be called usually. Use the
   list_del() macro instead.
 */
int list_del( List *l, void *data ) {
  Element *temp;
  int i;

  if (!data) return 1; /* do not delete start or stop element */

  /* find element associated with data */
  if ( !(temp = list_element_from_data(l, data)) )
    return 1;

  /* test if the deleted node is current in some nested loop, and fix it. */
  for ( i = l->level; i >= 0; i-- ) {
    if ( l->current[i] == temp ) {
      l->current[i] = temp->previous;
    }
  }

  temp->previous->next = temp->next;
  temp->next->previous = temp->previous;
  temp->previous = temp->next = NULL; /* mark as freed */
/*
  fprintf(stderr,"\n# list_del=%p start=%p stop=%p",temp,&l->start,&l->stop);
*/

  /* and free stuff */
  free(temp); /* element pointing to data, fixed mem-leak 0.41 */
  l->n--;
  return 0;
}

/* frees list. See also list_and_data_free() */
void list_free( List *l ) {
  Element *temp, *temp2;

  if ( !l || !l->n )
    return;

  if ( l->current ) {
    free(l->current);
  }
  l->current = NULL;

  temp = l->start.next;
  while ( temp && temp!=&l->stop) {
    temp2 = temp->next;
    free(temp);
    temp = temp2;
  }
  l->start.next    = &l->stop;
  l->stop.previous = &l->start;
}

/* setup a new level of for_each */
int list_higher_level( List *l ) {
  Element **newcur;
  
  if ( !l ) return(1);

  /*
     Security-check: NULL pointer passed to realloc.
      ANSI allows this, but it may cause portability problems.
  */    
  newcur = (Element **)realloc(l->current, (l->level+2)*sizeof(Element *));
  if (newcur) {
    l->current = newcur;
    l->level++;
    l->current[l->level] = l->start.next;
  }
  g_debug(fprintf(stderr, " level++=%d current[]=%p\n",
     l->level, l->current);)
  if ( !newcur  ) {
    fprintf(stderr, " realloc failed! abort\n"); return(1);
  }
  return 0;
}

void list_lower_level( List *l ) {
  if ( !l ) 
    return;

  if (!l->level) {
    free(l->current); /* calm -lefence */
    l->current = NULL; /* could be important */
  } else {
    l->current = (Element **)realloc(l->current, l->level*sizeof(Element *));
  }
  l->level--;
  g_debug(fprintf(stderr, " level--=%d current[]=%p\n", l->level, 
      l->current);)
}

/* returns the next item data */
void *list_next( List *l, void *data ) {
  Element *temp;

  if ( !l || !(temp = list_element_from_data(l, data)) )
    return NULL;
  if( !temp->next ) return NULL;
  return (temp->next->data);
}

/* returns the previous item data */
void *list_prev( List *l, void *data ) {
  Element *temp;

  if ( !l || !(temp = list_element_from_data(l, data)) )
    return NULL;
  if( !temp->previous ) return NULL;
  return (temp->previous->data);
}

/* Similar to qsort. Sorts list, using the (*compare) function, which is 
  provided by the user. The comparison function must return an integer less 
  than, equal to, or greater than zero if the first argument is considered to 
  be respectively less than, equal to, or greater than the second. 
  Uses the bubble sort algorithm.
  */
void list_sort( List *l, int (*compare)(const void *, const void *) ) {
  Element *temp, *prev;
  int i, sorted;
  progress_counter_t *pc = NULL;

  if ( !l )
    return;

  /* start progress meter, sorting is slow for huge number of elements */
  /* l->n is the worst case, real time is less or equal estimated time */
  pc = open_progress(l->n,"list_sort");
  
  for (i = 0; i < l->n; i++ ) {
    sorted = 1; /* Flag for early break */
    for ( temp = l->start.next->next;
          temp != NULL && temp != &l->stop; temp = temp->next ) {
      if ( temp->previous == &l->start ) continue;
      if ( compare((const void *)temp->previous->data,
                   (const void *)temp->data) > 0 ) {

        sorted = 0;  /* rest flag */
   	/* swap with the previous node */
	prev = temp->previous;
  	prev->previous->next = temp;
        temp->next->previous = prev;
	temp->previous = prev->previous;
	prev->next     = temp->next;
	prev->previous = temp;
	temp->next     = prev;
	/* and make sure the node in the for loop is correct */
	temp = prev;

#ifdef SLOWER_BUT_KEEP_BY_NOW
/* this is a slower version, but guaranteed to work */
        void *data;

	data = temp->data;
	prev = temp->previous;
	list_del(l, data);
	list_ins(l, prev->data, data);
	temp = prev;
#endif
      }
    }
    if (sorted) break;
    progress(i,pc); /* progress meter */
  }

  close_progress(pc);
  g_debug(fprintf(stderr, "list_sort()\n");)
}

/* calls free_data() for each data in list l, 
 * before free list with list_free() */
int list_and_data_free( List *l, void (*free_data)(void *data)) {
  void *data;

  if ( !l ) return 0;
  if ( !free_data ) return 1;

  for_each_data(l) {
    if ((data = list_get_current(l)))
      free_data(data);
  } end_for_each(l);
  
  list_free(l);

  g_debug(fprintf(stderr, "list_and_data_free()\n");)

  return 0;
}

