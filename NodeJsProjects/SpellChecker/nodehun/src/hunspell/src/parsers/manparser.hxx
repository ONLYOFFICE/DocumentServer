/*
 * parser classes for MySpell
 *
 * implemented: text, HTML, TeX
 *
 * Copyright (C) 2002, Laszlo Nemeth
 *
 */

#ifndef _MANPARSER_HXX_
#define _MANPARSER_HXX_

#include "textparser.hxx"

/*
 * Manparse Parser
 *
 */

class ManParser : public TextParser
{

protected:


public:
 
  ManParser();
  ManParser(const char * wc);
  ManParser(unsigned short * wordchars, int len);
  virtual ~ManParser();

  virtual char *      next_token();
  
};

#endif

