#ifndef _HASHMGR_HXX_
#define _HASHMGR_HXX_

#include "hunvisapi.h"

#include <stdio.h>

#include "htypes.hxx"
#include "istrmgr.hxx"

enum flag { FLAG_CHAR, FLAG_LONG, FLAG_NUM, FLAG_UNI };

class LIBHUNSPELL_DLL_EXPORTED HashMgr
{
  int               tablesize;
  struct hentry **  tableptr;
  int               userword;
  flag              flag_mode;
  int               complexprefixes;
  int               utf8;
  unsigned short    forbiddenword;
  int               langnum;
  char *            enc;
  char *            lang;
  struct cs_info *  csconv;
  char *            ignorechars;
  unsigned short *  ignorechars_utf16;
  int               ignorechars_utf16_len;
  int               numaliasf; // flag vector `compression' with aliases
  unsigned short ** aliasf;
  unsigned short *  aliasflen;
  int               numaliasm; // morphological desciption `compression' with aliases
  char **           aliasm;


public:
  HashMgr(const char * tpath, const char * apath, const char * key = NULL, bool notpath = false);
  HashMgr(const char * tpath, const char * apath, bool notpath = false);
  ~HashMgr();

  struct hentry * lookup(const char *) const;
  int hash(const char *) const;
  struct hentry * walk_hashtable(int & col, struct hentry * hp) const;

  int add(const char * word);
  int add_with_affix(const char * word, const char * pattern);
  int remove(const char * word);
  int decode_flags(unsigned short ** result, char * flags, IStrMgr * af);
  unsigned short        decode_flag(const char * flag);
  char *                encode_flag(unsigned short flag);
  int is_aliasf();
  int get_aliasf(int index, unsigned short ** fvec, IStrMgr * af);
  int is_aliasm();
  char * get_aliasm(int index);

private:
  void Init(const char * tstr, const char * astr,const char * key, bool notpath);
  int get_clen_and_captype(const char * word, int wbl, int * captype);
  int load_tables(const char * tpath, const char * key, bool notpath);
  int add_word(const char * word, int wbl, int wcl, unsigned short * ap,
    int al, const char * desc, bool onlyupcase);
  int load_config(const char * affpath, const char * key, bool notpath);
  int parse_aliasf(char * line, IStrMgr * af);
  int add_hidden_capitalized_word(char * word, int wbl, int wcl,
    unsigned short * flags, int al, char * dp, int captype);
  int parse_aliasm(char * line, IStrMgr * af);
  int remove_forbidden_flag(const char * word);

};

#endif
