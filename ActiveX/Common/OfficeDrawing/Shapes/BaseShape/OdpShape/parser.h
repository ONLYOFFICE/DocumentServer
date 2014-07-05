/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 
#pragma once
#if !defined(__SOLVER_H)
#define __SOLVER_H


#include "stdafx.h"
#include <vector>
using namespace std;

namespace NSGuidesOdp
{
	class CFormulaManager;
}

struct TParserNode
{
   double value;
   TParserNode *left;
   TParserNode *right;
   TParserNode *third;

   TParserNode(double _value=0.0, TParserNode *_left=NULL, TParserNode *_right=NULL, TParserNode *_third=NULL)
      { value = _value; left = _left; right = _right; third = _third; }
};

struct TError
{
   CString error;
   int pos;

   TError() {};
   TError(CString _error, int _pos) { error=_error; pos=_pos; }
};

class TParser
{
  private:
   TParserNode *root;
   CString expr;
   CString curToken;
   enum { PARSER_PLUS, PARSER_MINUS, PARSER_MULTIPLY, PARSER_DIVIDE, PARSER_PERCENT, PARSER_POWER, PARSER_COMMA,
          PARSER_SIN, PARSER_COS, PARSER_TG, PARSER_CTG, PARSER_ARCSIN, PARSER_ARCCOS, PARSER_ARCTG, PARSER_ARCCTG, PARSER_SH, PARSER_CH, PARSER_TH, PARSER_CTH,
          PARSER_EXP, PARSER_LG, PARSER_LN, PARSER_SQRT, PARSER_ABS,
		  PARSER_MIN, PARSER_MAX, PARSER_ATAN2, 
		  PARSER_IF,
		  PARSER_GUIDE, PARSER_ADJUST, PARSER_L_BRACKET, PARSER_R_BRACKET, PARSER_E, PARSER_PI, PARSER_NUMBER, PARSER_END } typToken;
   int pos;

   double result;

   vector<TParserNode *> history;

  private:
   TParserNode *CreateNode(double _value=0.0, TParserNode *_left=NULL, TParserNode *_right=NULL, TParserNode *_third=NULL);

   TParserNode *Expr(NSGuidesOdp::CFormulaManager& pFManager);
   TParserNode *Expr1(NSGuidesOdp::CFormulaManager& pFManager);
   TParserNode *Expr2(NSGuidesOdp::CFormulaManager& pFManager);
   TParserNode *Expr3(NSGuidesOdp::CFormulaManager& pFManager);
   TParserNode *Expr4(NSGuidesOdp::CFormulaManager& pFManager);
   TParserNode *Expr5(NSGuidesOdp::CFormulaManager& pFManager);

   bool GetToken();
   bool IsSpace(void)  {CString string(_T(" "));          return (string.Find(expr[pos]) >= 0);}
   bool IsDelim(void)  {CString string(_T("+-*/%^()[]")); return (string.Find(expr[pos]) >= 0);}
   bool IsAdjust(void) {CString string(_T("$"));          return (string.Find(expr[pos]) >= 0);}
   bool IsGuide(void)  {CString string(_T("?"));          return (string.Find(expr[pos]) >= 0);}
   bool IsComma(void)  {CString string(_T(","));          return (string.Find(expr[pos]) >= 0);}
   
   bool IsLetter(void) { return ((expr[pos]>=_T('a') && expr[pos]<=_T('z')) ||
                                 (expr[pos]>=_T('A') && expr[pos]<=_T('Z'))); }
   bool IsDigit(void) { return (expr[pos]>=_T('0') && expr[pos]<=_T('9')); }
   bool IsPoint(void) { return (expr[pos]==_T('.')); }

   double CalcTree(TParserNode *tree);
   void  DelTree(TParserNode *tree);

   void SendError(int errNum);

  public:
   TParser() { result = 0.0; root = NULL; }
   ~TParser() { DelTree(root); root=NULL; }

   bool Compile(CString _expr, NSGuidesOdp::CFormulaManager& pFManager);
   void Decompile() { DelTree(root); root=NULL; }

   double Evaluate(void);

   double GetResult(void) { return result; }
};

#endif