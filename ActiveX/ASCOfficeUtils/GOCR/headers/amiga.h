/*
     this file was suggested by Uffe Holst Jun05,2000
         to compile gocr using SAS/C under AmigaOS
         
                 uhc@post6.tele.dk
                 
    SAS/C propably does not support ANSI C++, therefore this changes
    
    I am a little bit confused about using declaration and
    macro definition of abs(). I think that should not be necessary.
    Tell me, if you have an Amiga and you can give answer
    to the following questions.
            
                 Joerg Schulenburg, see README for EMAIL-address
     
 */
 
#ifdef _AMIGA
#ifdef __SASC
#if 0
#include <string.h>	/* may be this can be removed ??? */  
#include <stdlib.h>	/* may be this can be removed ??? */
extern int abs(int);	/* may be this can be removed ??? */
#endif
#ifndef abs
#define abs(i) ((i) < 0 ? -(i) : (i))
#endif
#endif
#endif


