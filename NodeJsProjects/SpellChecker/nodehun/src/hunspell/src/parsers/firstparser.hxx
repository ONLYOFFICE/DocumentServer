/*
 * parser classes of HunTools
 *
 * implemented: text, HTML, TeX, first word
 *
 * Copyright (C) 2003, Laszlo Nemeth
 *
 */

#ifndef _FIRSTPARSER_HXX_
#define _FIRSTPARSER_HXX_

#include "textparser.hxx"

/*
 * Check first word of the input line
 *
 */

class FirstParser : public TextParser
{

public:
 
  
  FirstParser(const char * wc);
  virtual ~FirstParser();

  virtual char *      next_token();
  
};

#endif

