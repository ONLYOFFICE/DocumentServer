#include "license.hunspell"
#include "license.myspell"

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "strmgr.hxx"

int StrMgr::fail(const char * err, const char * par) {
  fprintf(stderr, err,par);
  return -1;
}

StrMgr::StrMgr(const char * str, const char * key) {
  linenum = 0;
  index = 0;
  done = false;
  int strl = strlen(str);
  if(strl > 0){
    st = (char *) malloc(strl+1);
    strcpy(st,str);
  }
  else{
    done = true;
  }
  if (!st) fail(MSG_OPEN, "Buffer allocation failed in StrMgr.");
}

StrMgr::~StrMgr()
{
  if (st) free(st);
}

char * StrMgr::getline() {
  if(done)
    return NULL;
  char * buf;
  int size = 0,
    curIndex = index,
    i = 0;
  while(st[index] != '\n' && st[index] != '\r' && st[index] != '\0')
  {
    index++;
    size++;
  }
  if(st[index] == '\0')
    done = true;
  index++;
  linenum++;
  if(size == 0)
    return getline();

  buf = (char*)malloc(size+1);
  while(st[curIndex] != '\n' && st[curIndex] != '\r' && st[curIndex] != '\0')
  {
    buf[i] = st[curIndex];
    curIndex++;
    i++;
  }
  i++;
  buf[i] = '\0';
  return buf;
}

int StrMgr::getlinenum() {
  return linenum;
}
