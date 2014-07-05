/*
This is a Optical-Character-Recognition program
Copyright (C) 2000-2007  Joerg Schulenburg

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
 
#include "unicode.h"
#include <stdio.h>

/* FIXME jb global */
int warn=0; /* if 1 a message is generated if composition is not defined */

/* Arguments: the character (main), and the modifier (accent, etc). See the
      function if you want to know the modifiers. 
   Description: This function intends to be a small helper, to avoid having
      to write switches in functions. It's therefore mainly to accents, and
      specially for the most usual ones. It supports the basic greek 
      characters too, which is actually not very helpful.
   Returns: the unicode character corresponding to the composed character.
   
   ToDo:
    - It seems to me, that tables should be more effectiv.
      So we should use tables in future? (js)
 */
wchar_t compose(wchar_t main, wchar_t modifier) {
/* supported by now: part of ISO8859-1, basic greek characters */
  if( main == UNKNOWN || main == PICTURE ) return main;
#ifdef DEBUG
  if(modifier!=UNICODE_NULL && modifier!=SPACE)
    printf(" compose(%c,%d)",(char)main,(int)modifier);
#endif
  if(main>127 && modifier!=0 && modifier!=SPACE && warn)
    fprintf(stderr,"# Warning compose %04x + %04x>127\n",
     (int)modifier,(int)main);
  switch (modifier) {
    case UNICODE_NULL:
    case SPACE:
	return      (wchar_t)main;

    case APOSTROPHE: /* do NOT USE this. It's here for compatibility only.
			    Use ACUTE_ACCENT instead. */
      fprintf( stderr, "COMPOSE: got APOSTROPHE instead of ACUTE_ACCENT");

    case ACUTE_ACCENT: /* acute/cedilla */
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_ACUTE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_ACUTE;
	case LATIN_SMALL_LETTER_AE:   return LATIN_SMALL_LETTER_AE_WITH_ACUTE;
	case LATIN_CAPITAL_LETTER_AE: return LATIN_CAPITAL_LETTER_AE_WITH_ACUTE;
	case 'c':	    return LATIN_SMALL_LETTER_C_WITH_ACUTE;
	case 'C':	    return LATIN_CAPITAL_LETTER_C_WITH_ACUTE;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_ACUTE;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_ACUTE;
	case 'g':           return LATIN_SMALL_LETTER_G_WITH_ACUTE;
	case 'G':           return LATIN_CAPITAL_LETTER_G_WITH_ACUTE;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_ACUTE;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_ACUTE;
	case 'l':           return LATIN_SMALL_LETTER_L_WITH_ACUTE;
	case 'L':           return LATIN_CAPITAL_LETTER_L_WITH_ACUTE;
	case 'n':           return LATIN_SMALL_LETTER_N_WITH_ACUTE;
	case 'N':           return LATIN_CAPITAL_LETTER_N_WITH_ACUTE;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_ACUTE;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_ACUTE;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_ACUTE;
        case 'r':           return LATIN_SMALL_LETTER_R_WITH_ACUTE;
        case 'R':           return LATIN_CAPITAL_LETTER_R_WITH_ACUTE;
        case 's':           return LATIN_SMALL_LETTER_S_WITH_ACUTE;
        case 'S':           return LATIN_CAPITAL_LETTER_S_WITH_ACUTE;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_ACUTE;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_ACUTE;
	case 'y':	    return LATIN_SMALL_LETTER_Y_WITH_ACUTE;
 	case 'Y':	    return LATIN_CAPITAL_LETTER_Y_WITH_ACUTE;
        case 'z':           return LATIN_SMALL_LETTER_Z_WITH_ACUTE;
        case 'Z':           return LATIN_CAPITAL_LETTER_Z_WITH_ACUTE;
	default:
          if(warn)fprintf( stderr, " COMPOSE: ACUTE_ACCENT+%04x not defined\n",(int)main);
      }
      break;

    case BREVE: /* caron (latin2)  "u"-above-... (small bow) */
      switch (main) {
        /* FIXME write separate heuristics for breve */
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_BREVE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_BREVE;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_BREVE;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_BREVE;
	case 'g':	    return LATIN_SMALL_LETTER_G_WITH_BREVE;
	case 'G':	    return LATIN_CAPITAL_LETTER_G_WITH_BREVE;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_BREVE;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_BREVE;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_BREVE;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_BREVE;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_BREVE;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_BREVE;
	default:
          if(warn)fprintf( stderr, " COMPOSE: BREVE+%04x not defined\n",(int)main);
      }
      break;

    case CARON: /* caron (latin2)  "v"-above-... */
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_CARON;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_CARON;
	case 'c':	    return LATIN_SMALL_LETTER_C_WITH_CARON;
	case 'C':	    return LATIN_CAPITAL_LETTER_C_WITH_CARON;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_CARON;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_CARON;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_CARON;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_CARON;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_CARON;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_CARON;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_CARON;
	case 's':	    return LATIN_SMALL_LETTER_S_WITH_CARON;
	case 'S':	    return LATIN_CAPITAL_LETTER_S_WITH_CARON;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_CARON;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_CARON;
	case 'z':	    return LATIN_SMALL_LETTER_Z_WITH_CARON;
	case 'Z':	    return LATIN_CAPITAL_LETTER_Z_WITH_CARON;
	default:
          if(warn)fprintf( stderr, " COMPOSE: CARON+%04x not defined\n",(int)main);
      }
      break;

    case CEDILLA:
      switch (main) {
	case 'c':	    return LATIN_SMALL_LETTER_C_WITH_CEDILLA;
	case 'C':	    return LATIN_CAPITAL_LETTER_C_WITH_CEDILLA;
	default:
          if(warn)fprintf( stderr, " COMPOSE: CEDILLA+%04x not defined\n",(int)main);
      }
      break;

    case TILDE:
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_TILDE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_TILDE;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_TILDE;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_TILDE;
	case 'n':	    return LATIN_SMALL_LETTER_N_WITH_TILDE;
	case 'N':	    return LATIN_CAPITAL_LETTER_N_WITH_TILDE;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_TILDE;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_TILDE;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_TILDE;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_TILDE;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_TILDE;
	default:
          if(warn)fprintf( stderr, " COMPOSE: TILDE+%04x not defined\n",(int)main);
      }
      break;
 
    case GRAVE_ACCENT:
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_GRAVE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_GRAVE;
      	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_GRAVE;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_GRAVE;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_GRAVE;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_GRAVE;
	case 'n':	    return LATIN_SMALL_LETTER_N_WITH_GRAVE;
	case 'N':	    return LATIN_CAPITAL_LETTER_N_WITH_GRAVE;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_GRAVE;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_GRAVE;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_GRAVE;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_GRAVE;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_GRAVE;
	default:
          if(warn)fprintf( stderr, " COMPOSE: GRAVE_ACCENT+%04x not defined\n",(int)main);
      }
      break;
 
    case QUOTATION_MARK: /* do NOT USE this. It's here for compatibility only. 
			    Use DIAERESIS instead. */
      fprintf( stderr, "COMPOSE: got APOSTROPHE instead of ACUTE_ACCENT");
 
    case DIAERESIS:
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_DIAERESIS;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_DIAERESIS;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_DIAERESIS;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_DIAERESIS;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_DIAERESIS;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_DIAERESIS;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_DIAERESIS;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_DIAERESIS;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_DIAERESIS;
	case 'y':	    return LATIN_SMALL_LETTER_Y_WITH_DIAERESIS;
	case 'Y':	    return LATIN_CAPITAL_LETTER_Y_WITH_DIAERESIS;
	default:
          if(warn)fprintf( stderr, " COMPOSE: DIAERESIS+%04x (%c) not defined\n",(int)main,(char)main);
      }
      break;

    case CIRCUMFLEX_ACCENT: /* ^ */
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_CIRCUMFLEX;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_CIRCUMFLEX;
	case 'c':	    return LATIN_SMALL_LETTER_C_WITH_CIRCUMFLEX;
	case 'C':	    return LATIN_CAPITAL_LETTER_C_WITH_CIRCUMFLEX;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_CIRCUMFLEX;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_CIRCUMFLEX;
	case 'g':	    return LATIN_SMALL_LETTER_G_WITH_CIRCUMFLEX;
	case 'G':	    return LATIN_CAPITAL_LETTER_G_WITH_CIRCUMFLEX;
	case 'h':	    return LATIN_SMALL_LETTER_H_WITH_CIRCUMFLEX;
	case 'H':	    return LATIN_CAPITAL_LETTER_H_WITH_CIRCUMFLEX;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_CIRCUMFLEX;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_CIRCUMFLEX;
	case 'j':	    return LATIN_SMALL_LETTER_J_WITH_CIRCUMFLEX;
	case 'J':	    return LATIN_CAPITAL_LETTER_J_WITH_CIRCUMFLEX;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_CIRCUMFLEX;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_CIRCUMFLEX;
	case '0':	    return LATIN_CAPITAL_LETTER_O_WITH_CIRCUMFLEX;
	case 's':	    return LATIN_SMALL_LETTER_S_WITH_CIRCUMFLEX;
	case 'S':	    return LATIN_CAPITAL_LETTER_S_WITH_CIRCUMFLEX;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_CIRCUMFLEX;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_CIRCUMFLEX;
	case 'w':	    return LATIN_SMALL_LETTER_W_WITH_CIRCUMFLEX;
	case 'W':	    return LATIN_CAPITAL_LETTER_W_WITH_CIRCUMFLEX;
	case 'y':	    return LATIN_SMALL_LETTER_Y_WITH_CIRCUMFLEX;
	case 'Y':	    return LATIN_CAPITAL_LETTER_Y_WITH_CIRCUMFLEX;
	default:
          if(warn)fprintf( stderr, " COMPOSE: CIRCUMFLEX_ACCENT+%04x not defined\n",(int)main);
      }
      break;

    case MACRON: /* a minus sign above the char (latin2) */
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_MACRON;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_MACRON;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_MACRON;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_MACRON;
	case 'i':	    return LATIN_SMALL_LETTER_I_WITH_MACRON;
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_MACRON;
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_MACRON;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_MACRON;
	case 'u':	    return LATIN_SMALL_LETTER_U_WITH_MACRON;
	case 'U':	    return LATIN_CAPITAL_LETTER_U_WITH_MACRON;
	case 'y':	    return LATIN_SMALL_LETTER_Y_WITH_MACRON;
	case 'Y':	    return LATIN_CAPITAL_LETTER_Y_WITH_MACRON;
	case LATIN_SMALL_LETTER_AE:   return LATIN_SMALL_LETTER_AE_WITH_MACRON;
	case LATIN_CAPITAL_LETTER_AE: return LATIN_CAPITAL_LETTER_AE_WITH_MACRON;
	case '=':	    return IDENTICAL_TO;
	case '-':	    return '=';
	case ' ':	    return MODIFIER_LETTER_MACRON;
        default:
          if(warn)fprintf( stderr, " COMPOSE: MACRON+%04x not defined\n",(int)main);
      }
      break;

    case DOT_ABOVE: /* latin2 */
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_DOT_ABOVE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_DOT_ABOVE;
	case 'c':	    return LATIN_SMALL_LETTER_C_WITH_DOT_ABOVE;
	case 'C':	    return LATIN_CAPITAL_LETTER_C_WITH_DOT_ABOVE;
	case 'e':	    return LATIN_SMALL_LETTER_E_WITH_DOT_ABOVE;
	case 'E':	    return LATIN_CAPITAL_LETTER_E_WITH_DOT_ABOVE;
	case 'g':	    return LATIN_SMALL_LETTER_G_WITH_DOT_ABOVE;
	case 'G':	    return LATIN_CAPITAL_LETTER_G_WITH_DOT_ABOVE;
	case 'l':	    return 'i';  /* correct wrong recognition */
	case 'i':	    return 'i';
	case LATIN_SMALL_LETTER_DOTLESS_I:	    return 'i';
	case 'I':	    return LATIN_CAPITAL_LETTER_I_WITH_DOT_ABOVE;
	case 'j':	    return 'j';
	case 'o':	    return LATIN_SMALL_LETTER_O_WITH_DOT_ABOVE;
	case 'O':	    return LATIN_CAPITAL_LETTER_O_WITH_DOT_ABOVE;
	case 'z':	    return LATIN_SMALL_LETTER_Z_WITH_DOT_ABOVE;
	case 'Z':	    return LATIN_CAPITAL_LETTER_Z_WITH_DOT_ABOVE;
	case ',':	    return ';';
	case '.':	    return ':';
        default:
          if(warn)fprintf( stderr, " COMPOSE: DOT_ABOVE+%04x not defined\n",(int)main);
      }
      break;

    case RING_ABOVE:
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_A_WITH_RING_ABOVE;
	case 'A':	    return LATIN_CAPITAL_LETTER_A_WITH_RING_ABOVE;
        case 'u':           return LATIN_SMALL_LETTER_U_WITH_RING_ABOVE;
        case 'U':           return LATIN_CAPITAL_LETTER_U_WITH_RING_ABOVE;
        default:
          if(warn)fprintf( stderr, " COMPOSE: RING_ABOVE+%04x not defined\n",(int)main);
      }
      break;

    case 'e': /* e ligatures: ae, oe. */
    case 'E':
      switch (main) {
	case 'a':	    return LATIN_SMALL_LETTER_AE;
	case 'A':	    return LATIN_CAPITAL_LETTER_AE;
	case 'o':	    return LATIN_SMALL_LIGATURE_OE;
	case 'O':	    return LATIN_CAPITAL_LIGATURE_OE;
	case '0':	    return LATIN_CAPITAL_LIGATURE_OE;
	default:
          if(warn)fprintf( stderr, " COMPOSE: %04x+e/E not defined\n",(int)main);
      }
      break;

    case 'g': /* greek */
      switch (main) {
        /* missing 0x37A-0x390 */
        /* weird cases: Q -> theta (it resembles a little, doesn't it?)
			V -> psi   (what can I do?) */
	case 'A':   return GREEK_CAPITAL_LETTER_ALPHA;
	case 'B':   return GREEK_CAPITAL_LETTER_BETA;
	case 'G':   return GREEK_CAPITAL_LETTER_GAMMA;
	case 'D':   return GREEK_CAPITAL_LETTER_DELTA;
	case 'E':   return GREEK_CAPITAL_LETTER_EPSILON;
	case 'Z':   return GREEK_CAPITAL_LETTER_ZETA;
	case 'H':   return GREEK_CAPITAL_LETTER_ETA;
	case 'Q':   return GREEK_CAPITAL_LETTER_THETA;
	case 'I':   return GREEK_CAPITAL_LETTER_IOTA;
	case 'K':   return GREEK_CAPITAL_LETTER_KAPPA;
	case 'L':   return GREEK_CAPITAL_LETTER_LAMDA;
	case 'M':   return GREEK_CAPITAL_LETTER_MU;
	case 'N':   return GREEK_CAPITAL_LETTER_NU;
	case 'X':   return GREEK_CAPITAL_LETTER_XI;
	case 'O':   return GREEK_CAPITAL_LETTER_OMICRON;
	case 'P':   return GREEK_CAPITAL_LETTER_PI;
	case 'R':   return GREEK_CAPITAL_LETTER_RHO;
	case 'S':   return GREEK_CAPITAL_LETTER_SIGMA;
	case 'T':   return GREEK_CAPITAL_LETTER_TAU;
	case 'Y':   return GREEK_CAPITAL_LETTER_UPSILON;
	case 'F':   return GREEK_CAPITAL_LETTER_PHI;
	case 'C':   return GREEK_CAPITAL_LETTER_CHI;
	case 'V':   return GREEK_CAPITAL_LETTER_PSI;
	case 'W':   return GREEK_CAPITAL_LETTER_OMEGA;
/*
	case '':   return GREEK_CAPITAL_LETTER_IOTA_WITH_DIALYTIKA;
	case '':   return GREEK_CAPITAL_LETTER_UPSILON_WITH_DIALYTIKA;
	case '':   return GREEK_SMALL_LETTER_ALPHA_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_EPSILON_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_ETA_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_IOTA_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_UPSILON_WITH_DIALYTIKA_AND_TONOS;
*/
	case 'a':   return GREEK_SMALL_LETTER_ALPHA;
	case 'b':   return GREEK_SMALL_LETTER_BETA;
	case 'g':   return GREEK_SMALL_LETTER_GAMMA;
	case 'd':   return GREEK_SMALL_LETTER_DELTA;
	case 'e':   return GREEK_SMALL_LETTER_EPSILON;
	case 'z':   return GREEK_SMALL_LETTER_ZETA;
	case 'h':   return GREEK_SMALL_LETTER_ETA;
	case 'q':   return GREEK_SMALL_LETTER_THETA;
	case 'i':   return GREEK_SMALL_LETTER_IOTA;
	case 'k':   return GREEK_SMALL_LETTER_KAPPA;
	case 'l':   return GREEK_SMALL_LETTER_LAMDA;
	case 'm':   return GREEK_SMALL_LETTER_MU;
	case 'n':   return GREEK_SMALL_LETTER_NU;
	case 'x':   return GREEK_SMALL_LETTER_XI;
	case 'o':   return GREEK_SMALL_LETTER_OMICRON;
	case 'p':   return GREEK_SMALL_LETTER_PI;
	case 'r':   return GREEK_SMALL_LETTER_RHO;
	case '&':   return GREEK_SMALL_LETTER_FINAL_SIGMA;
	case 's':   return GREEK_SMALL_LETTER_SIGMA;
	case 't':   return GREEK_SMALL_LETTER_TAU;
	case 'y':   return GREEK_SMALL_LETTER_UPSILON;
	case 'f':   return GREEK_SMALL_LETTER_PHI;
	case 'c':   return GREEK_SMALL_LETTER_CHI;
	case 'v':   return GREEK_SMALL_LETTER_PSI;
	case 'w':   return GREEK_SMALL_LETTER_OMEGA;
/*
	case '':   return GREEK_SMALL_LETTER_IOTA_WITH_DIALYTIKA;
	case '':   return GREEK_SMALL_LETTER_UPSILON_WITH_DIALYTIKA;
	case '':   return GREEK_SMALL_LETTER_OMICRON_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_UPSILON_WITH_TONOS;
	case '':   return GREEK_SMALL_LETTER_OMEGA_WITH_TONOS;
	case '':   return GREEK_BETA_SYMBOL;
	case '':   return GREEK_THETA_SYMBOL;
	case '':   return GREEK_UPSILON_WITH_HOOK_SYMBOL;
	case '':   return GREEK_UPSILON_WITH_ACUTE_AND_HOOK_SYMBOL;
	case '':   return GREEK_UPSILON_WITH_DIAERESIS_AND_HOOK_SYMBOL;
	case '':   return GREEK_PHI_SYMBOL;
	case '':   return GREEK_PI_SYMBOL;
*/
	default:
          if(warn)fprintf( stderr, " COMPOSE: GREEK %04x not defined\n",(int)main);
      }
      break;   

    default:
      fprintf( stderr, " COMPOSE: modifier %04x not defined\n",(int)modifier);
  }
  return (wchar_t)main;
}

#define UNDEFINED			"~"

/* Arguments: character in Unicode format, type of format to convert to.
   Returns: a string containing the Unicode character converted to the chosen
    format. This string is statically allocated and should not be freed.
   ToDo: better using tables?
 */
const char *decode(wchar_t c, FORMAT type) {
  /* static char d;  --- js: big bug (missing \0) if &d returned */
  /*FIXME jb static*/ static char bbuf[8*32]; /* space for 8 buffers, rotating */
  /*FIXME jb static*/ static char *buf=bbuf;  /* used for UTF8 sequences and undefined codes */
  buf+=32; if(buf>=bbuf+8*32) buf=bbuf;
  buf[0]=buf[1]=buf[2]=0;
  switch (type) {
    case ISO8859_1:
      if ( c <= 0xFF ) { /* UNICODE == ISO8859-1 */
        buf[0] = (char)c;
        return buf;
      }
      switch (c) { /* not found in list, but perhaps we can describe it */
	/* todo: add greek. GREEK_SMALL_LETTER_ALPHA = alpha */
	
	/* general puctuation */
	case HYPHEN:
	  return (const char *)"-";
	case FIGURE_DASH:
	case EN_DASH:
	  return (const char *)"--";
	case EM_DASH:
	  return (const char *)"---";
	case LEFT_SINGLE_QUOTATION_MARK:
	  return (const char *)"`";
	case RIGHT_SINGLE_QUOTATION_MARK:
	  return (const char *)"'";
	case SINGLE_LOW_9_QUOTATION_MARK:
	  return (const char *)",";
	case SINGLE_HIGH_REVERSED_9_QUOTATION_MARK:
	  return (const char *)UNDEFINED;
	case LEFT_DOUBLE_QUOTATION_MARK:
	  return (const char *)"``";
	case RIGHT_DOUBLE_QUOTATION_MARK:
	  return (const char *)"''";
	case DOUBLE_LOW_9_QUOTATION_MARK:
	  return (const char *)",,";
	case DOUBLE_HIGH_REVERSED_9_QUOTATION_MARK:
	  return (const char *)UNDEFINED;
	case DAGGER:
	  return (const char *)"+";
	case DOUBLE_DAGGER:
	  return (const char *)"*";
	case BULLET:
	  return (const char *)"*";
	case TRIANGULAR_BULLET:
	  return (const char *)"*";
	case HYPHENATION_POINT:
	  return (const char *)"-";
	case HORIZONTAL_ELLIPSIS:
	  return (const char *)"...";
	case PER_MILLE_SIGN:
	  return (const char *)"%%"; /* awk! */
	case SINGLE_LEFT_POINTING_ANGLE_QUOTATION_MARK:
	  return (const char *)"<";
	case SINGLE_RIGHT_POINTING_ANGLE_QUOTATION_MARK:
	  return (const char *)">";
	case EURO_CURRENCY_SIGN:
	  return (const char *)"EUR"; /* change it! */
	
	/* ligatures */
	case LATIN_SMALL_LIGATURE_FF:
	  return (const char *)"ff";
	case LATIN_SMALL_LIGATURE_FI:
	  return (const char *)"fi";
	case LATIN_SMALL_LIGATURE_FL:
	  return (const char *)"fl";
	case LATIN_SMALL_LIGATURE_FFI:
	  return (const char *)"ffi";
	case LATIN_SMALL_LIGATURE_FFL:
	  return (const char *)"ffl";
	case LATIN_SMALL_LIGATURE_LONG_S_T:
	case LATIN_SMALL_LIGATURE_ST:
	  return (const char *)"st";
	
	/* extra */
	case UNKNOWN:
	  return (const char *)"_";
	case PICTURE:
	  return (const char *)"_"; /* Due to Mobile OCR */
		
	default:
	  /* snprintf seems to be no standard, so I use insecure sprintf */
	  sprintf(buf,"\\code(%04x)",(unsigned)c);
	  return buf;  /* UNDEFINED; */
      }
      break;
    case TeX:
      if ( c >= SPACE && c <= TILDE ) { /* ASCII */
	switch (c) {
	  case '$':
	      return (const char *)"\\$";
	  case '&':
	      return (const char *)"\\&";
	  case '%':
	      return (const char *)"\\%";
	  case '#':
	      return (const char *)"\\#";
	  case '_':
	      return (const char *)"\\_";
	  case '{':
	      return (const char *)"\\{";
	  case '}':
	      return (const char *)"\\}";
	  case '\\':
	      return (const char *)"$\\backslash$";
	  case '~':
	      return (const char *)"\\~{}";
	  case '^':
	      return (const char *)"\\^{}";
	  default:
	      buf[0] = (char)c;
	      return (const char *)buf;
	}
      }
      switch (c) {
	/* ISO8859_1 */
	case NO_BREAK_SPACE:
	  return (const char *)"~";
	case INVERTED_EXCLAMATION_MARK:
	  return (const char *)"!'";
	case CENT_SIGN:
	  return (const char *)"\\textcent"; /* \usepackage{textcomp} */
	case POUND_SIGN:
	  return (const char *)"\\pounds";
	case EURO_CURRENCY_SIGN:
	  return (const char *)"\\euro"; /* \usepackage{eurosans} */
	case CURRENCY_SIGN:
	  return (const char *)"\\textcurrency"; /* \usepackage{textcomp} */
	case YEN_SIGN:
	  return (const char *)"\\textyen"; /* \usepackage{textcomp} */
	case BROKEN_BAR:
	  return (const char *)"\\textbrokenbar"; /* \usepackage{textcomp} */
	case SECTION_SIGN:
	  return (const char *)"\\S";
	case DIAERESIS:
	  return (const char *)"\"";
	case COPYRIGHT_SIGN:
	  return (const char *)"\\copyright";
	case FEMININE_ORDINAL_INDICATOR:
	  return (const char *)"$^{\\underbar{a}}$";
	case LEFT_POINTING_DOUBLE_ANGLE_QUOTATION_MARK:
	  return (const char *)"\\flqq{}";
	case NOT_SIGN:
	  return (const char *)"$\\lnot$";
	case SOFT_HYPHEN:
	  return (const char *)"\\-";
	case REGISTERED_SIGN:
	  return (const char *)"\\textregistered";/* \usepackage{textcomp} */
	case MACRON:
	  return (const char *)"\\textasciimacron";/* \usepackage{textcomp} */
	case DEGREE_SIGN:
	  return (const char *)"$^{o}$";
	case PLUS_MINUS_SIGN:
	  return (const char *)"$\\pm$";
	case SUPERSCRIPT_TWO:
	  return (const char *)"$^{2}$";
	case SUPERSCRIPT_THREE:
	  return (const char *)"$^{3}$";
	case ACUTE_ACCENT:
	  return (const char *)"\\( \\prime \\)";
	case MICRO_SIGN:
	  return (const char *)"$\\mu$";
	case PILCROW_SIGN:
	  return (const char *)"\\P";
	case MIDDLE_DOT:
	  return (const char *)"$\\cdot$";
	case CEDILLA:
	  return (const char *)"\\,";
	case SUPERSCRIPT_ONE:
	  return (const char *)"$^{1}$";
	case MASCULINE_ORDINAL_INDICATOR:
	  return (const char *)"$^{\\underbar{o}}$";
	case RIGHT_POINTING_DOUBLE_ANGLE_QUOTATION_MARK:
	  return (const char *)"\\frqq{}";
	case VULGAR_FRACTION_ONE_QUARTER:	 /* these fractions are not good*/
	  return (const char *)"\\( 1\\over 4 \\)";
	case VULGAR_FRACTION_ONE_HALF:
	  return (const char *)"\\( 1\\over 2 \\)";
	case VULGAR_FRACTION_THREE_QUARTERS:
	  return (const char *)"\\( 3\\over 4 \\)";
	case INVERTED_QUESTION_MARK:
	  return (const char *)"?'";
	case LATIN_CAPITAL_LETTER_A_WITH_GRAVE:
	  return (const char *)"\\`A";
	case LATIN_CAPITAL_LETTER_A_WITH_ACUTE:
	  return (const char *)"\\'A";
	case LATIN_CAPITAL_LETTER_A_WITH_CIRCUMFLEX:
	  return (const char *)"\\^A";
	case LATIN_CAPITAL_LETTER_A_WITH_TILDE:
	  return (const char *)"\\~A";
	case LATIN_CAPITAL_LETTER_A_WITH_DIAERESIS:
	  return (const char *)"\\\"A";
	case LATIN_CAPITAL_LETTER_A_WITH_RING_ABOVE:
	  return (const char *)"\\AA";
	case LATIN_CAPITAL_LETTER_AE:
	  return (const char *)"\\AE";
	case LATIN_CAPITAL_LETTER_C_WITH_CARON:
	  return (const char *)"\\v{C}";
	case LATIN_CAPITAL_LETTER_C_WITH_CEDILLA:
	  return (const char *)"\\C";
	case LATIN_CAPITAL_LETTER_E_WITH_GRAVE:
	  return (const char *)"\\`E";
	case LATIN_CAPITAL_LETTER_E_WITH_ACUTE:
	  return (const char *)"\\'E";
	case LATIN_CAPITAL_LETTER_E_WITH_CARON:
	  return (const char *)"\\v{E}";
	case LATIN_CAPITAL_LETTER_E_WITH_CIRCUMFLEX:
	  return (const char *)"\\^E";
	case LATIN_CAPITAL_LETTER_E_WITH_DIAERESIS:
	  return (const char *)"\\\"E";
	case LATIN_CAPITAL_LETTER_I_WITH_GRAVE:
	  return (const char *)"\\`I";
	case LATIN_CAPITAL_LETTER_I_WITH_ACUTE:
	  return (const char *)"\\'I";
	case LATIN_CAPITAL_LETTER_I_WITH_CIRCUMFLEX:
	  return (const char *)"\\^I";
	case LATIN_CAPITAL_LETTER_I_WITH_DIAERESIS:
	  return (const char *)"\\\"I";
	case LATIN_CAPITAL_LETTER_ETH:
	  return (const char *)UNDEFINED;
	case LATIN_CAPITAL_LETTER_N_WITH_TILDE:
	  return (const char *)"\\~N";
	case LATIN_CAPITAL_LETTER_O_WITH_GRAVE:
	  return (const char *)"\\`O";
	case LATIN_CAPITAL_LETTER_O_WITH_ACUTE:
	  return (const char *)"\\'O";
	case LATIN_CAPITAL_LETTER_O_WITH_CIRCUMFLEX:
	  return (const char *)"\\^O";
	case LATIN_CAPITAL_LETTER_O_WITH_TILDE:
	  return (const char *)"\\~O";
	case LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS:
	  return (const char *)"\\\"O";
	case MULTIPLICATION_SIGN:
	  return (const char *)"$\\times$";
	case LATIN_CAPITAL_LETTER_O_WITH_STROKE:
	  return (const char *)"\\O";
	case LATIN_CAPITAL_LETTER_S_WITH_CARON:
	  return (const char *)"\\v{S}";
	case LATIN_CAPITAL_LETTER_U_WITH_GRAVE:
	  return (const char *)"\\`U";
	case LATIN_CAPITAL_LETTER_U_WITH_ACUTE:
	  return (const char *)"\\'U";
	case LATIN_CAPITAL_LETTER_U_WITH_CIRCUMFLEX:
	  return (const char *)"\\^U";
	case LATIN_CAPITAL_LETTER_U_WITH_DIAERESIS:
	  return (const char *)"\\\"U";
	case LATIN_CAPITAL_LETTER_Y_WITH_ACUTE:
	  return (const char *)"\\'Y";
	case LATIN_CAPITAL_LETTER_Z_WITH_CARON:
	  return (const char *)"\\v{Z}";
	case LATIN_CAPITAL_LETTER_THORN:
	  return (const char *)UNDEFINED;
	case LATIN_SMALL_LETTER_SHARP_S:
	  return (const char *)"\\ss";
	case LATIN_SMALL_LETTER_A_WITH_GRAVE:
	  return (const char *)"\\`a";
	case LATIN_SMALL_LETTER_A_WITH_ACUTE:
	  return (const char *)"\\'a";
	case LATIN_SMALL_LETTER_A_WITH_CIRCUMFLEX:
	  return (const char *)"\\^a";
	case LATIN_SMALL_LETTER_A_WITH_TILDE:
	  return (const char *)"\\~a";
	case LATIN_SMALL_LETTER_A_WITH_DIAERESIS:
	  return (const char *)"\\\"a";
	case LATIN_SMALL_LETTER_A_WITH_RING_ABOVE:
	  return (const char *)"\\aa";
	case LATIN_SMALL_LETTER_AE:
	  return (const char *)"\\ae";
	case LATIN_SMALL_LETTER_C_WITH_CARON:
	  return (const char *)"\\v{c}";
	case LATIN_SMALL_LETTER_C_WITH_CEDILLA:
	  return (const char *)"\\c";
	case LATIN_SMALL_LETTER_E_WITH_GRAVE:
	  return (const char *)"\\`e";
	case LATIN_SMALL_LETTER_E_WITH_ACUTE:
	  return (const char *)"\\'e";
	case LATIN_SMALL_LETTER_E_WITH_CARON:
	  return (const char *)"\\v{e}";
	case LATIN_SMALL_LETTER_E_WITH_CIRCUMFLEX:
	  return (const char *)"\\^e";
	case LATIN_SMALL_LETTER_E_WITH_DIAERESIS:
	  return (const char *)"\\\"e";
	case LATIN_SMALL_LETTER_I_WITH_GRAVE:
	  return (const char *)"\\`i";
	case LATIN_SMALL_LETTER_I_WITH_ACUTE:
	  return (const char *)"\\'i";
	case LATIN_SMALL_LETTER_I_WITH_CIRCUMFLEX:
	  return (const char *)"\\^i";
	case LATIN_SMALL_LETTER_I_WITH_DIAERESIS:
	  return (const char *)"\\\"i";
	case LATIN_SMALL_LETTER_ETH:
	  return (const char *)UNDEFINED;
	case LATIN_SMALL_LETTER_N_WITH_TILDE:
	  return (const char *)"\\~n";
	case LATIN_SMALL_LETTER_O_WITH_GRAVE:
	  return (const char *)"\\`o";
	case LATIN_SMALL_LETTER_O_WITH_ACUTE:
	  return (const char *)"\\'o";
	case LATIN_SMALL_LETTER_O_WITH_CIRCUMFLEX:
	  return (const char *)"\\^o";
	case LATIN_SMALL_LETTER_O_WITH_TILDE:
	  return (const char *)"\\~o";
	case LATIN_SMALL_LETTER_O_WITH_DIAERESIS:
	  return (const char *)"\\\"o";
	case DIVISION_SIGN:
	  return (const char *)"$\\div$";
	case LATIN_SMALL_LETTER_O_WITH_STROKE:
	  return (const char *)"\\o";
	case LATIN_SMALL_LETTER_S_WITH_CARON:
	  return (const char *)"\\v{s}";
	case LATIN_SMALL_LETTER_U_WITH_GRAVE:
	  return (const char *)"\\`u";
	case LATIN_SMALL_LETTER_U_WITH_ACUTE:
	  return (const char *)"\\'u";
	case LATIN_SMALL_LETTER_U_WITH_CIRCUMFLEX:
	  return (const char *)"\\^u";
	case LATIN_SMALL_LETTER_U_WITH_DIAERESIS:
	  return (const char *)"\\\"u";
	case LATIN_SMALL_LETTER_Y_WITH_ACUTE:
	  return (const char *)"\\'y";
	case LATIN_SMALL_LETTER_THORN:
	  return (const char *)UNDEFINED;
	case LATIN_SMALL_LETTER_Y_WITH_DIAERESIS:
	  return (const char *)"\\\"y";
	case LATIN_SMALL_LETTER_Z_WITH_CARON:
	  return (const char *)"\\v{z}";

	/* greek */
	  /* some (punctuation, accents, accented capital) greek letters missing*/
	case GREEK_CAPITAL_LETTER_ALPHA:
	  return (const char *)"A";
	case GREEK_CAPITAL_LETTER_BETA:
	  return (const char *)"B";
	case GREEK_CAPITAL_LETTER_GAMMA:
	  return (const char *)"\\( \\Gamma \\)";
	case GREEK_CAPITAL_LETTER_DELTA:
	  return (const char *)"\\( \\Delta \\)";
	case GREEK_CAPITAL_LETTER_EPSILON:
	  return (const char *)"E";
	case GREEK_CAPITAL_LETTER_ZETA:
	  return (const char *)"Z";
	case GREEK_CAPITAL_LETTER_ETA:
	  return (const char *)"H";
	case GREEK_CAPITAL_LETTER_THETA:
	  return (const char *)"\\( \\Theta \\)";
	case GREEK_CAPITAL_LETTER_IOTA:
	  return (const char *)"I";
	case GREEK_CAPITAL_LETTER_KAPPA:
	  return (const char *)"K";
	case GREEK_CAPITAL_LETTER_LAMDA:
	  return (const char *)"\\( \\Lambda \\)";
	case GREEK_CAPITAL_LETTER_MU:
	  return (const char *)"M";
	case GREEK_CAPITAL_LETTER_NU:
	  return (const char *)"N";
	case GREEK_CAPITAL_LETTER_XI:
	  return (const char *)"\\( \\Xi \\)";
	case GREEK_CAPITAL_LETTER_OMICRON:
	  return (const char *)"O";
	case GREEK_CAPITAL_LETTER_PI:
	  return (const char *)"\\( \\Pi \\)";
	case GREEK_CAPITAL_LETTER_RHO:
	  return (const char *)"P";
	case GREEK_CAPITAL_LETTER_SIGMA:
	  return (const char *)"\\( \\Sigma \\)";
	case GREEK_CAPITAL_LETTER_TAU:
	  return (const char *)"T";
	case GREEK_CAPITAL_LETTER_UPSILON:
	  return (const char *)"\\( \\Upsilon \\)";
	case GREEK_CAPITAL_LETTER_PHI:
	  return (const char *)"\\( \\Phi \\)";
	case GREEK_CAPITAL_LETTER_CHI:
	  return (const char *)"\\( \\Chi \\)";
	case GREEK_CAPITAL_LETTER_PSI:
	  return (const char *)"\\( \\Psi \\)";
	case GREEK_CAPITAL_LETTER_OMEGA:
	  return (const char *)"\\( \\Omega \\)";
	case GREEK_CAPITAL_LETTER_IOTA_WITH_DIALYTIKA:
	  return (const char *)UNDEFINED;
	case GREEK_CAPITAL_LETTER_UPSILON_WITH_DIALYTIKA:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_ALPHA_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_EPSILON_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_ETA_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_IOTA_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_UPSILON_WITH_DIALYTIKA_AND_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_ALPHA:
	  return (const char *)"\\( \\alpha \\)";
	case GREEK_SMALL_LETTER_BETA:
	  return (const char *)"\\( \\beta \\)";
	case GREEK_SMALL_LETTER_GAMMA:
	  return (const char *)"\\( \\gamma \\)";
	case GREEK_SMALL_LETTER_DELTA:
	  return (const char *)"\\( \\delta \\)";
	case GREEK_SMALL_LETTER_EPSILON:
	  return (const char *)"\\( \\epsilon \\)";
	case GREEK_SMALL_LETTER_ZETA:
	  return (const char *)"\\( \\zeta \\)";
	case GREEK_SMALL_LETTER_ETA:
	  return (const char *)"\\( \\eta \\)";
	case GREEK_SMALL_LETTER_THETA:
	  return (const char *)"\\( \\theta \\)";
	case GREEK_SMALL_LETTER_IOTA:
	  return (const char *)"\\( \\iota \\)";
	case GREEK_SMALL_LETTER_KAPPA:
	  return (const char *)"\\( \\kappa \\)";
	case GREEK_SMALL_LETTER_LAMDA:
	  return (const char *)"\\( \\lambda \\)";
	case GREEK_SMALL_LETTER_MU:
	  return (const char *)"\\( \\mu \\)";
	case GREEK_SMALL_LETTER_NU:
	  return (const char *)"\\( \\nu \\)";
	case GREEK_SMALL_LETTER_XI:
	  return (const char *)"\\( \\xi \\)";
	case GREEK_SMALL_LETTER_OMICRON:
	  return (const char *)"\\( \\omicron \\)";
	case GREEK_SMALL_LETTER_PI:
	  return (const char *)"\\( \\pi \\)";
	case GREEK_SMALL_LETTER_RHO:
	  return (const char *)"\\( \\rho \\)";
	case GREEK_SMALL_LETTER_FINAL_SIGMA:
	  return (const char *)"\\( \\varsigma \\)";
	case GREEK_SMALL_LETTER_SIGMA:
	  return (const char *)"\\( \\sigma \\)";
	case GREEK_SMALL_LETTER_TAU:
	  return (const char *)"\\( \\tau \\)";
	case GREEK_SMALL_LETTER_UPSILON:
	  return (const char *)"\\( \\upsilon \\)";
	case GREEK_SMALL_LETTER_PHI:
	  return (const char *)"\\( \\varphi \\)";
	case GREEK_SMALL_LETTER_CHI:
	  return (const char *)"\\( \\chi \\)";
	case GREEK_SMALL_LETTER_PSI:
	  return (const char *)"\\( \\psi \\)";
	case GREEK_SMALL_LETTER_OMEGA:
	  return (const char *)"\\( \\omega \\)";
	case GREEK_SMALL_LETTER_IOTA_WITH_DIALYTIKA:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_UPSILON_WITH_DIALYTIKA:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_OMICRON_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_UPSILON_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_SMALL_LETTER_OMEGA_WITH_TONOS:
	  return (const char *)UNDEFINED;
	case GREEK_BETA_SYMBOL:
	  return (const char *)UNDEFINED;
	case GREEK_THETA_SYMBOL:
	  return (const char *)"\\( \\vartheta \\)";
	case GREEK_UPSILON_WITH_HOOK_SYMBOL:
	  return (const char *)UNDEFINED;
	case GREEK_UPSILON_WITH_ACUTE_AND_HOOK_SYMBOL:
	  return (const char *)UNDEFINED;
	case GREEK_UPSILON_WITH_DIAERESIS_AND_HOOK_SYMBOL:
	  return (const char *)UNDEFINED;
	case GREEK_PHI_SYMBOL:
	  return (const char *)"\\( \\phi \\)";
	case GREEK_PI_SYMBOL:
	  return (const char *)"\\( \\varpi \\)";
	  /* and some greek letters missing*/

	/* punctuation (partial) */
	case HYPHEN:
	  return (const char *)"-";
	case NON_BREAKING_HYPHEN:
	  return (const char *)UNDEFINED;
	case FIGURE_DASH:
	case EN_DASH:
	  return (const char *)"--";
	case EM_DASH:
	  return (const char *)"---";
	case HORIZONTAL_BAR:
	  return (const char *)UNDEFINED;
	case LEFT_SINGLE_QUOTATION_MARK:
	  return (const char *)"`";
	case RIGHT_SINGLE_QUOTATION_MARK:
	  return (const char *)"'";
	case SINGLE_LOW_9_QUOTATION_MARK:
	  return (const char *)"\\glq{}";
	case SINGLE_HIGH_REVERSED_9_QUOTATION_MARK:
	  return (const char *)UNDEFINED;
	case LEFT_DOUBLE_QUOTATION_MARK:
	  return (const char *)"``";
	case RIGHT_DOUBLE_QUOTATION_MARK:
	  return (const char *)"''";
	case DOUBLE_LOW_9_QUOTATION_MARK:
	  return (const char *)"\\glqq{}";
	case DOUBLE_HIGH_REVERSED_9_QUOTATION_MARK:
	  return (const char *)UNDEFINED;
	case DAGGER:
	  return (const char *)"\\dag";
	case DOUBLE_DAGGER:
	  return (const char *)"\\ddag";
	case BULLET:
	  return (const char *)"$\\bullet$";
	case TRIANGULAR_BULLET:
	  return (const char *)"$\\blacktriangleright";
	case HYPHENATION_POINT:
	  return (const char *)"\\-";
	case HORIZONTAL_ELLIPSIS:
	  return (const char *)"\\ldots";
	case PER_MILLE_SIGN:
	  return (const char *)UNDEFINED;
	case SINGLE_LEFT_POINTING_ANGLE_QUOTATION_MARK:
	  return (const char *)"\\flq{}";
	case SINGLE_RIGHT_POINTING_ANGLE_QUOTATION_MARK:
	  return (const char *)"\\frq{}";
	/* ligatures */
	case LATIN_SMALL_LIGATURE_FF:
	  return (const char *)"ff";
	case LATIN_SMALL_LIGATURE_FI:
	  return (const char *)"fi";
	case LATIN_SMALL_LIGATURE_FL:
	  return (const char *)"fl";
	case LATIN_SMALL_LIGATURE_FFI:
	  return (const char *)"ffi";
	case LATIN_SMALL_LIGATURE_FFL:
	  return (const char *)"ffl";
	case LATIN_SMALL_LIGATURE_LONG_S_T:
	case LATIN_SMALL_LIGATURE_ST:
	  return (const char *)"st";
	/* reserved */
	case 0:
	  return (const char *)"";
	case UNKNOWN:
	  return (const char *)"\\_";
	case PICTURE:
	  return (const char *)"(PICTURE)";
	default:
	  /* snprintf seems to be no standard, so I use insecure sprintf */
	  sprintf(buf,"\\symbol{%u}",(unsigned)c);
	  return buf;  /* UNDEFINED; */
	}
    case HTML:
      if ( c >= SPACE && c <= TILDE ) { /* ASCII */
        switch (c) {
          case '&':
            return (const char *)"&amp;";
          /* semicolon must not be coded */
          case '\'':
            return (const char *)"&apos;";
          case '"':
            return (const char *)"&quot;";
          case '<':
            return (const char *)"&lt;";
          case '>':
            return (const char *)"&gt;";
        }
        buf[0] = (char)c;
        return buf;
      }
      switch (c) {
	case PICTURE:
	  return (const char *)"<!--PICTURE-->";
        case UNKNOWN:
          return (const char *)"_"; /* better use colored symbol? */
        case LINE_FEED:
          return (const char *)"<br />";  /* \n handled somwhere else? */
	case FORM_FEED:
	case CARRIAGE_RETURN:
	  return (const char *)"<br />";
	case NO_BREAK_SPACE:
	  return (const char *)"<nobr />";
	case INVERTED_EXCLAMATION_MARK:
	  return (const char *)"&iexcl;";
	case CENT_SIGN:
	  return (const char *)"&cent;";
	case POUND_SIGN:
	  return (const char *)"&pound;";
	case CURRENCY_SIGN:
	  return (const char *)"&curren;";
	case YEN_SIGN:
	  return (const char *)"&yen;";
	case BROKEN_BAR:
	  return (const char *)"&brvbar;";
	case SECTION_SIGN:
	  return (const char *)"&sect;";
	case DIAERESIS:
	  return (const char *)"&uml;";
	case COPYRIGHT_SIGN:
	  return (const char *)"&copy;";
	case FEMININE_ORDINAL_INDICATOR:
	  return (const char *)"&ordfem;";
	case LEFT_POINTING_DOUBLE_ANGLE_QUOTATION_MARK:
	  return (const char *)"&laquo;";
	case NOT_SIGN:
	  return (const char *)"&not;";
	case SOFT_HYPHEN:
	  return (const char *)"&shy;";
	case REGISTERED_SIGN:
	  return (const char *)"&reg;";
	case MACRON:
	  return (const char *)"&macr;";
	case DEGREE_SIGN:
	  return (const char *)"&deg;";
	case PLUS_MINUS_SIGN:
	  return (const char *)"&plusmn;";
	case SUPERSCRIPT_TWO:
	  return (const char *)"&sup2;";
	case SUPERSCRIPT_THREE:
	  return (const char *)"&sup3;";
	case ACUTE_ACCENT:
	  return (const char *)"&acute;";
	case MICRO_SIGN:
	  return (const char *)"&micro;";
	case PILCROW_SIGN:
	  return (const char *)"&para;";
	case MIDDLE_DOT:
	  return (const char *)"&middot;";
	case CEDILLA:
	  return (const char *)"&cedil;";
	case SUPERSCRIPT_ONE:
	  return (const char *)"&sup1;";
	case MASCULINE_ORDINAL_INDICATOR:
	  return (const char *)"&ordm;";
	case RIGHT_POINTING_DOUBLE_ANGLE_QUOTATION_MARK:
	  return (const char *)"&raquo;";
	case VULGAR_FRACTION_ONE_QUARTER:
	  return (const char *)"&frac14;";
	case VULGAR_FRACTION_ONE_HALF:
	  return (const char *)"&frac12;";
	case VULGAR_FRACTION_THREE_QUARTERS:
	  return (const char *)"&frac34;";
	case INVERTED_QUESTION_MARK:
	  return (const char *)"&iquest;";	  
	case LATIN_CAPITAL_LETTER_A_WITH_GRAVE:
	  return (const char *)"&Agrave;";
	case LATIN_CAPITAL_LETTER_A_WITH_ACUTE:
	  return (const char *)"&Aacute;";
	case LATIN_CAPITAL_LETTER_A_WITH_BREVE:
	  return (const char *)"&Abreve;";
	case LATIN_CAPITAL_LETTER_A_WITH_CIRCUMFLEX:
	  return (const char *)"&Acirc;";
	case LATIN_CAPITAL_LETTER_A_WITH_TILDE:
	  return (const char *)"&Atilde;";
	case LATIN_CAPITAL_LETTER_A_WITH_DIAERESIS:
	  return (const char *)"&Auml;";
	case LATIN_CAPITAL_LETTER_A_WITH_RING_ABOVE:
	  return (const char *)"&Aring;";
	case LATIN_CAPITAL_LETTER_AE:
	  return (const char *)"&AElig;";
	case LATIN_CAPITAL_LETTER_C_WITH_CARON:
	  return (const char *)"&Ccaron;";
	case LATIN_CAPITAL_LETTER_C_WITH_CEDILLA:
	  return (const char *)"&Ccedil;";
	case LATIN_CAPITAL_LETTER_E_WITH_GRAVE:
	  return (const char *)"&Egrave;";
	case LATIN_CAPITAL_LETTER_E_WITH_ACUTE:
	  return (const char *)"&Eacute;";
	case LATIN_CAPITAL_LETTER_E_WITH_CARON:
	  return (const char *)"&Ecaron;";
	case LATIN_CAPITAL_LETTER_E_WITH_CIRCUMFLEX:
	  return (const char *)"&Ecirc;";
	case LATIN_CAPITAL_LETTER_E_WITH_DIAERESIS:
	  return (const char *)"&Euml;";
	case LATIN_CAPITAL_LETTER_I_WITH_GRAVE:
	  return (const char *)"&Igrave;";
	case LATIN_CAPITAL_LETTER_I_WITH_ACUTE:
	  return (const char *)"&Iacute;";
	case LATIN_CAPITAL_LETTER_I_WITH_CIRCUMFLEX:
	  return (const char *)"&Icirc;";
	case LATIN_CAPITAL_LETTER_I_WITH_DIAERESIS:
	  return (const char *)"&Iuml;";
	case LATIN_CAPITAL_LETTER_ETH:
	  return (const char *)"&ETH;";
	case LATIN_CAPITAL_LETTER_N_WITH_TILDE:
	  return (const char *)"&Ntilde;";
	case LATIN_CAPITAL_LETTER_O_WITH_GRAVE:
	  return (const char *)"&Ograve;";
	case LATIN_CAPITAL_LETTER_O_WITH_ACUTE:
	  return (const char *)"&Oacute;";
	case LATIN_CAPITAL_LETTER_O_WITH_CIRCUMFLEX:
	  return (const char *)"&Ocirc;";
	case LATIN_CAPITAL_LETTER_O_WITH_TILDE:
	  return (const char *)"&Otilde;";
	case LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS:
	  return (const char *)"&Ouml;";
	case MULTIPLICATION_SIGN:
	  return (const char *)"&times";
	case LATIN_CAPITAL_LETTER_O_WITH_STROKE:
	  return (const char *)"&Oslash;";
	case LATIN_CAPITAL_LETTER_S_WITH_CARON:
	  return (const char *)"&Scaron;";
	case LATIN_CAPITAL_LETTER_U_WITH_GRAVE:
	  return (const char *)"&Ugrave;";
	case LATIN_CAPITAL_LETTER_U_WITH_ACUTE:
	  return (const char *)"&Uacute;";
	case LATIN_CAPITAL_LETTER_U_WITH_CIRCUMFLEX:
	  return (const char *)"&Ucirc;";
	case LATIN_CAPITAL_LETTER_U_WITH_DIAERESIS:
	  return (const char *)"&Uuml;";
	case LATIN_CAPITAL_LETTER_Y_WITH_ACUTE:
	  return (const char *)"&Yacute;";
	case LATIN_CAPITAL_LETTER_Z_WITH_CARON:
	  return (const char *)"&Zcaron;";
	case LATIN_CAPITAL_LETTER_THORN:
	  return (const char *)"&THORN;";
	case LATIN_SMALL_LETTER_SHARP_S:
	  return (const char *)"&szlig;";
	case LATIN_SMALL_LETTER_A_WITH_GRAVE:
	  return (const char *)"&agrave;";
	case LATIN_SMALL_LETTER_A_WITH_ACUTE:
	  return (const char *)"&aacute;";
	case LATIN_SMALL_LETTER_A_WITH_BREVE:
	  return (const char *)"&abreve;";
	case LATIN_SMALL_LETTER_A_WITH_CARON:
	  return (const char *)"&acaron;";
	case LATIN_SMALL_LETTER_A_WITH_CIRCUMFLEX:
	  return (const char *)"&acirc;";
	case LATIN_SMALL_LETTER_A_WITH_TILDE:
	  return (const char *)"&atilde;";
	case LATIN_SMALL_LETTER_A_WITH_DIAERESIS:
	  return (const char *)"&auml;";
	case LATIN_SMALL_LETTER_A_WITH_RING_ABOVE:
	  return (const char *)"&aring;";
	case LATIN_SMALL_LETTER_AE:
	  return (const char *)"&aelig;";
	case LATIN_SMALL_LETTER_C_WITH_CARON:
	  return (const char *)"&ccaron;";
	case LATIN_SMALL_LETTER_C_WITH_CEDILLA:
	  return (const char *)"&ccedil;";
	case LATIN_SMALL_LETTER_E_WITH_GRAVE:
	  return (const char *)"&egrave;";
	case LATIN_SMALL_LETTER_E_WITH_ACUTE:
	  return (const char *)"&eacute;";
	case LATIN_SMALL_LETTER_E_WITH_CARON:
	  return (const char *)"&ecaron;";
	case LATIN_SMALL_LETTER_E_WITH_CIRCUMFLEX:
	  return (const char *)"&ecirc;";
	case LATIN_SMALL_LETTER_E_WITH_DIAERESIS:
	  return (const char *)"&euml;";
	case LATIN_SMALL_LETTER_I_WITH_GRAVE:
	  return (const char *)"&igrave;";
	case LATIN_SMALL_LETTER_I_WITH_ACUTE:
	  return (const char *)"&iacute;";
	case LATIN_SMALL_LETTER_I_WITH_CIRCUMFLEX:
	  return (const char *)"&icirc;";
	case LATIN_SMALL_LETTER_I_WITH_DIAERESIS:
	  return (const char *)"&iuml;";
	case LATIN_SMALL_LETTER_ETH:
	  return (const char *)"&eth;";
	case LATIN_SMALL_LETTER_N_WITH_TILDE:
	  return (const char *)"&ntilde;";
	case LATIN_SMALL_LETTER_O_WITH_GRAVE:
	  return (const char *)"&ograve;";
	case LATIN_SMALL_LETTER_O_WITH_ACUTE:
	  return (const char *)"&oacute;";
	case LATIN_SMALL_LETTER_O_WITH_CIRCUMFLEX:
	  return (const char *)"&ocirc;";
	case LATIN_SMALL_LETTER_O_WITH_TILDE:
	  return (const char *)"&otilde;";
	case LATIN_SMALL_LETTER_O_WITH_DIAERESIS:
	  return (const char *)"&ouml;";
	case DIVISION_SIGN:
	  return (const char *)"&divide;";
	case LATIN_SMALL_LETTER_O_WITH_STROKE:
	  return (const char *)"&oslash;";
	case LATIN_SMALL_LETTER_S_WITH_CARON:
	  return (const char *)"&scaron;";
	case LATIN_SMALL_LETTER_U_WITH_GRAVE:
	  return (const char *)"&ugrave;";
	case LATIN_SMALL_LETTER_U_WITH_ACUTE:
	  return (const char *)"&uacute;";
	case LATIN_SMALL_LETTER_U_WITH_CIRCUMFLEX:
	  return (const char *)"&ucirc;";
	case LATIN_SMALL_LETTER_U_WITH_DIAERESIS:
	  return (const char *)"&uuml;";
	case LATIN_SMALL_LETTER_Y_WITH_ACUTE:
	  return (const char *)"&yacute;";
	case LATIN_SMALL_LETTER_THORN:
	  return (const char *)"&thorn;";
	case LATIN_SMALL_LETTER_Y_WITH_DIAERESIS:
	  return (const char *)"&yuml;";
	case LATIN_SMALL_LETTER_Z_WITH_CARON:
	  return (const char *)"&zcaron;";
	case EURO_CURRENCY_SIGN:
	  return (const char *)"&euro;";
	case 0:
	  return (const char *)"";
	default:
	  sprintf(buf,"&#%u;",(unsigned)c);
	  return buf;  /* undefined */
      }
      /* break; unreachable code */
    case XML:   /* only 5 &xxx;-ENTITIES ar defined by default */
      if ( c >= SPACE && c <= TILDE ) { /* ASCII */
        switch (c) {
          case '&':
            return (const char *)"&amp;";
          case '\'':
            return (const char *)"&apos;";
          case '"':
            return (const char *)"&quot;";
          case '<':
            return (const char *)"&lt;";
          case '>':
            return (const char *)"&gt;";
        }
        buf[0] = (char)c;
        return buf;
      }
      switch (c) {    /* subject of change! */
	case PICTURE:
	  return (const char *)"(PICTURE)";
        case UNKNOWN:
          return (const char *)"_"; /* better use colored symbol? */
        case LINE_FEED:             /* \n handled somwhere else? */
	case FORM_FEED:
	case CARRIAGE_RETURN:
	  return (const char *)"<br />";
	case NO_BREAK_SPACE:
	  return (const char *)"<nobr />";
	case 0:
	  return (const char *)"";
	default:
	  sprintf(buf,"&#x%03x;",(unsigned)c);
	  return buf;  /* undefined */
      }
      /* break; unreachable code */
    case SGML:
      switch (c) {
	default:
	  sprintf(buf,"&#%u;",(unsigned)c);
	  return buf;  /* UNDEFINED */
      }
      /* break; unreachable code */
    case ASCII: /* mainly used for debugging */
      if ( c=='\n' || (c>= 0x20 && c <= 0x7F) ) {
        buf[0] = (char)c;
        return buf;
      }
      switch (c) {
	/* extra */
	case UNKNOWN:
	  return (const char *)"(?)";
	case PICTURE:
	  return (const char *)"(?)";
		
	default:
	  /* snprintf seems to be no standard, so I use insecure sprintf */
	  if ((unsigned)c>255) sprintf(buf,"(0x%04x)",(unsigned)c);
	  else                 sprintf(buf,"(0x%02x)",(unsigned)c);
	  return buf;  /* UNDEFINED; */
      }
      /* break; unreachable code */
    default: /* use UTF8 as default, test with xterm -u8 */
      /* extra */
      if ( c == UNKNOWN )  return (const char *)"_";
      if ( c == PICTURE )  return (const char *)"_"; /* Due to Mobile OCR */
      if ( c <= (wchar_t)0x0000007F ) {  /* UTF8 == 7bit ASCII */
        buf[0] = (char)c;
        return buf;
      }
      if ( c <= (wchar_t)0x000007FF ) {  /* UTF8 == 11bit */
        buf[0] = (char)(0xc0|((c>> 6) & 0x1f)); /* 110xxxxx */
        buf[1] = (char)(0x80|( c      & 0x3f)); /* 10xxxxxx */
        buf[2] = (char)0; /* terminate string */
        return buf;
      }
      /* wchar_t is 16bit for Borland-C !? Jan07 */
      if ( c <= (wchar_t)0x0000FFFF ) {  /* UTF8 == 16bit */
        buf[0] = (char)(0xe0|((c>>12) & 0x0f)); /* 1110xxxx */
        buf[1] = (char)(0x80|((c>> 6) & 0x3f)); /* 10xxxxxx */
        buf[2] = (char)(0x80|( c      & 0x3f)); /* 10xxxxxx */
        buf[3] = (char)0; /* terminate string */
        return buf;
      }
      if ( c <= (wchar_t)0x001FFFFF ) {  /* UTF8 == 21bit */
        buf[0] = (char)(0xf0|((c>>18) & 0x07)); /* 11110xxx */
        buf[1] = (char)(0x80|((c>>12) & 0x3f)); /* 10xxxxxx */
        buf[2] = (char)(0x80|((c>> 6) & 0x3f)); /* 10xxxxxx */
        buf[3] = (char)(0x80|( c      & 0x3f)); /* 10xxxxxx */
        buf[4] = (char)0; /* terminate string */
        return buf;
      }
      if ( c <= (wchar_t)0x03FFFFFF ) {  /* UTF8 == 26bit */
        buf[0] = (char)(0xf8|((c>>24) & 0x03)); /* 111110xx */
        buf[1] = (char)(0x80|((c>>18) & 0x3f)); /* 10xxxxxx */
        buf[2] = (char)(0x80|((c>>12) & 0x3f)); /* 10xxxxxx */
        buf[3] = (char)(0x80|((c>> 6) & 0x3f)); /* 10xxxxxx */
        buf[4] = (char)(0x80|( c      & 0x3f)); /* 10xxxxxx */
        buf[5] = (char)0; /* terminate string */
        return buf;
      }
      if ( c <= (wchar_t)0x7FFFFFFF ) {  /* UTF8 == 31bit */
        buf[0] = (char)(0xfc|((c>>30) & 0x01)); /* 1111110x */
        buf[1] = (char)(0x80|((c>>24) & 0x3f)); /* 10xxxxxx */
        buf[2] = (char)(0x80|((c>>18) & 0x3f)); /* 10xxxxxx */
        buf[3] = (char)(0x80|((c>>12) & 0x3f)); /* 10xxxxxx */
        buf[4] = (char)(0x80|((c>> 6) & 0x3f)); /* 10xxxxxx */
        buf[5] = (char)(0x80|( c      & 0x3f)); /* 10xxxxxx */
        buf[6] = (char)0; /* terminate string */
        return buf;
      }
      return (const char *)UNDEFINED;
  }
}
