/* file manager class - read lines of files [filename] OR [filename.hz] */
#ifndef _STRMGR_HXX_
#define _STRMGR_HXX_

#include "hunvisapi.h"

#include "hunzip.hxx"
#include "istrmgr.hxx"
#include <stdio.h>

class LIBHUNSPELL_DLL_EXPORTED StrMgr : public IStrMgr
{
protected:
  char* st;
  int index;
  bool done;
  int fail(const char * err,const char * par);
  int linenum;
  
public:
  StrMgr(const char * str, const char * key = NULL);
  virtual ~StrMgr();
  virtual char * getline();
  virtual int getlinenum();
};
#endif
