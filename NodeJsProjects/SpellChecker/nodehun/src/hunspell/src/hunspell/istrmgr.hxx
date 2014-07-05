#ifndef _ISTRMGR_HXX
#define _ISTRMGR_HXX
#include "license.hunspell"
#include "license.myspell"

class IStrMgr
{
public:
  virtual ~IStrMgr(){}
  virtual char * getline() = 0;
  virtual int getlinenum() = 0;
};
#endif
