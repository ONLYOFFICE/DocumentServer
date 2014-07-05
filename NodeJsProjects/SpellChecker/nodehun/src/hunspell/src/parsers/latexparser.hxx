/*
 * parser classes for MySpell
 *
 * implemented: text, HTML, TeX
 *
 * Copyright (C) 2002, Laszlo Nemeth
 *
 */

#ifndef _LATEXPARSER_HXX_
#define _LATEXPARSER_HXX_


#include "textparser.hxx"

/*
 * HTML Parser
 *
 */

class LaTeXParser : public TextParser
{
  int                 pattern_num; // number of comment  
  int                 depth; // depth of blocks
  int                 arg; // arguments's number
  int                 opt; // optional argument attrib.

public:
 
  LaTeXParser(const char * wc);
  LaTeXParser(unsigned short * wordchars, int len);
  virtual ~LaTeXParser();

  virtual char *      next_token();

private:

  int                 look_pattern(int col);

};


#endif

