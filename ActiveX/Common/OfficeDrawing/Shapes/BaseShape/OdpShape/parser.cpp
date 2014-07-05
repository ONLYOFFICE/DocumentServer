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
 
#include "stdafx.h"
#include <math.h>
#include "parser.h"
#include "Formula.h"



#define OP_PLUS          0
#define OP_MINUS         1
#define OP_MULTIPLY      2
#define OP_DIVIDE        3
#define OP_PERCENT       4
#define OP_POWER         5
#define OP_UMINUS        6
#define OP_COMMA         7

#define OP_SIN           10
#define OP_COS           11
#define OP_TG            12
#define OP_CTG           13
#define OP_ARCSIN        14
#define OP_ARCCOS        15
#define OP_ARCTG         16
#define OP_ARCCTG        17
#define OP_SH            18
#define OP_CH            19
#define OP_TH            20
#define OP_CTH           21
#define OP_EXP           22
#define OP_LG            23
#define OP_LN            24
#define OP_SQRT          25
#define OP_ABS			 26
#define OP_MIN			 30
#define OP_MAX			 31
#define OP_ATAN2		 32
#define OP_IF			 40



#ifndef M_PI
#define M_PI             3.1415926535897932384626433832795
#endif


TParserNode *TParser::CreateNode(double _value, TParserNode *_left, TParserNode *_right, TParserNode *_third)
{
   TParserNode *pNode = new TParserNode(_value, _left, _right, _third);
   history.push_back(pNode);
   return pNode;
}

void TParser::SendError(int errNum)
{
   static CString errs[7] = { _T(""),
							  _T(""),
							  _T("Unexpected end of expression"),
                              _T("End of expression expected"),
							  _T("'(' or '[' expected"),
                              _T("')' or ']' expected"),
                              _T("")
                         };
   CString buffer;

   int len = curToken.GetLength();
   
   if(curToken == _T(""))
      curToken = _T("EOL");

   switch(errNum)
   {
      case 0:
         buffer.Format(_T("Unknown keyword: '%s'"), curToken);
         errs[0] = buffer;
         break;

      case 1:
         buffer.Format(_T("Unknown symbol: '%s'"), curToken);
         errs[1] = buffer;
         break;

      case 6:
         buffer.Format(_T("Unexpected '%s'"), curToken);
         errs[6] = buffer;
         break;
   }

   TError error(errs[errNum], pos-len);

   for(unsigned int i=0; i<history.size(); i++)
      delete history[i];
   history.clear();

   root = NULL;

   throw error;

   return;
}
   
bool TParser::GetToken()
{
   curToken = _T("");
   
   if(pos >= expr.GetLength())
   {
      curToken = _T("");
      typToken = PARSER_END;
      return true;
   }

   while(IsSpace()) pos++;

   if(IsDelim())
   {
      curToken = expr[pos++];
      switch(curToken[0])
      {
         case _T('+'): typToken = PARSER_PLUS; return true;
         case _T('-'): typToken = PARSER_MINUS; return true;
         case _T('*'): typToken = PARSER_MULTIPLY; return true;
         case _T('/'): typToken = PARSER_DIVIDE; return true;
         case _T('%'): typToken = PARSER_PERCENT; return true;
         case _T('^'): typToken = PARSER_POWER; return true;
         case _T('['):
         case _T('('): typToken = PARSER_L_BRACKET; return true;
         case _T(']'):
         case _T(')'): typToken = PARSER_R_BRACKET; return true;
      }
   }
   else if(IsComma())
   {
	   curToken = expr[pos++];
	   typToken = PARSER_COMMA;
	   return true;
   }
   else if(IsLetter())
   {
      int i=0;
	  curToken = _T("");
      while(IsLetter() || IsDigit()) curToken += expr[pos++];

	  curToken.MakeLower();

      if(curToken == _T("pi"))			{ typToken = PARSER_PI; return true; }
      else if(curToken == _T("e"))      { typToken = PARSER_E; return true; }
      else if(curToken == _T("sin"))    { typToken = PARSER_SIN; return true; }
      else if(curToken == _T("cos"))    { typToken = PARSER_COS; return true; }
      else if(curToken == _T("tg"))     { typToken = PARSER_TG; return true; }
      else if(curToken == _T("ctg"))    { typToken = PARSER_CTG; return true; }
      else if(curToken == _T("arcsin")) { typToken = PARSER_ARCSIN; return true; }
      else if(curToken == _T("arccos")) { typToken = PARSER_ARCCOS; return true; }
      else if(curToken == _T("arctg"))  { typToken = PARSER_ARCTG; return true; }
      else if(curToken == _T("arcctg")) { typToken = PARSER_ARCCTG; return true; }
      else if(curToken == _T("sh"))     { typToken = PARSER_SH; return true; }
      else if(curToken == _T("ch"))     { typToken = PARSER_CH; return true; }
      else if(curToken == _T("th"))     { typToken = PARSER_TH; return true; }
      else if(curToken == _T("cth"))    { typToken = PARSER_CTH; return true; }
      else if(curToken == _T("exp"))    { typToken = PARSER_EXP; return true; }
      else if(curToken == _T("lg"))     { typToken = PARSER_LG; return true; }
      else if(curToken == _T("ln"))     { typToken = PARSER_LN; return true; }
      else if(curToken == _T("sqrt"))   { typToken = PARSER_SQRT; return true; }
	  else if(curToken == _T("abs"))	{ typToken = PARSER_ABS; return true; }

	  else if(curToken == _T("min"))    { typToken = PARSER_MIN; return true; }
	  else if(curToken == _T("max"))    { typToken = PARSER_MAX; return true; }
	  else if(curToken == _T("atan2"))  { typToken = PARSER_ATAN2; return true; }

	  else if(curToken == _T("if"))     { typToken = PARSER_IF; return true; }
	  
	  else if(curToken == _T("left"))   { typToken = PARSER_GUIDE; return true; }
  	  else if(curToken == _T("right"))  { typToken = PARSER_GUIDE; return true; }
  	  else if(curToken == _T("top"))    { typToken = PARSER_GUIDE; return true; }
  	  else if(curToken == _T("bottom")) { typToken = PARSER_GUIDE; return true; }
  	  else if(curToken == _T("width"))  { typToken = PARSER_GUIDE; return true; }
  	  else if(curToken == _T("height")) { typToken = PARSER_GUIDE; return true; }
      else SendError(0);
   }
   else if(IsAdjust())
   {
      int i=0;
	  curToken = _T("");
      while((!IsSpace())&&(!IsDelim())) curToken += expr[pos++];
	  
	  typToken = PARSER_ADJUST;
	  return true;
   }
   else if(IsGuide())
   {
      int i=0;
	  curToken = _T("");
      while((!IsSpace())&&(!IsDelim())) curToken += expr[pos++];
	  
	  typToken = PARSER_GUIDE;
	  return true;
   }
   else if(IsDigit() || IsPoint())
   {
      int i=0;
	  curToken = _T("");
      while(IsDigit()) curToken += expr[pos++];
      if(IsPoint())
      {
         curToken += expr[pos++];
         while(IsDigit()) curToken += expr[pos++];
      }
      typToken = PARSER_NUMBER;
      return true;
   }
   else
   {
      curToken = expr[pos++];
      SendError(1);
   }

   return false;
}      

bool TParser::Compile(CString _expr, NSGuidesOdp::CFormulaManager& pFManager)
{
   pos = 0;
   expr = _expr;
   curToken = _T("");
   if(root!=NULL)
   {
      DelTree(root);
      root = NULL;
   }

   history.clear();
   CString strTempString(_T("+-*/%^,"));
   while(strTempString.Find(expr[0]) >= 0) expr.Delete(0);

   GetToken();
   if(typToken==PARSER_END) SendError(2);
   root = Expr(pFManager);
   if(typToken!=PARSER_END) SendError(3);

   history.clear();

   return true;
}

TParserNode *TParser::Expr(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp = Expr1(pFManager);

   while(1)
   {
      if(typToken==PARSER_PLUS)
      {
         GetToken();
         temp = CreateNode(OP_PLUS, temp, Expr1(pFManager));
      }
      else if(typToken==PARSER_MINUS)
      {
         GetToken();
         temp = CreateNode(OP_MINUS, temp, Expr1(pFManager));
      }
      else break;
   }

   return temp;
}
   
TParserNode *TParser::Expr1(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp = Expr2(pFManager);

   while(1)
   {
      if(typToken==PARSER_MULTIPLY)
      {
         GetToken();
         temp = CreateNode(OP_MULTIPLY, temp, Expr2(pFManager));
      }
      else if(typToken==PARSER_DIVIDE)
      {
         GetToken();
         temp = CreateNode(OP_DIVIDE, temp, Expr2(pFManager));
      }
      else if(typToken==PARSER_PERCENT)
      {
         GetToken();
         temp = CreateNode(OP_PERCENT, temp, Expr2(pFManager));
      }
      else break;
   }

   return temp;
}

TParserNode *TParser::Expr2(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp = Expr3(pFManager);

   while(1)
   {
      if(typToken==PARSER_POWER)
      {
         GetToken();
         temp = CreateNode(OP_POWER, temp, Expr2(pFManager));
      }
      else break;
   }

   return temp;
}

TParserNode *TParser::Expr3(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp;

   if(typToken==PARSER_PLUS)
   {
      GetToken();
      temp = Expr4(pFManager);
   }
   else if(typToken==PARSER_MINUS)
   {
      GetToken();
      temp = CreateNode(OP_UMINUS, Expr4(pFManager));
   }
   else
      temp = Expr4(pFManager);

   return temp;      
}

TParserNode *TParser::Expr4(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp;

   if(typToken>=PARSER_SIN && typToken<=PARSER_ABS)
   {
      temp = CreateNode(OP_SIN-PARSER_SIN+typToken);
      GetToken();
      if(typToken!=PARSER_L_BRACKET) SendError(4);
      GetToken();
      temp->left = Expr(pFManager);
      if(typToken!=PARSER_R_BRACKET) SendError(5);
      GetToken();
   }
   else if((typToken >= PARSER_MIN) && (typToken <= PARSER_ATAN2))
   {
	   temp = CreateNode(OP_MIN-PARSER_MIN+typToken);
	   GetToken();
       if(typToken!=PARSER_L_BRACKET) SendError(4);
       GetToken();
       temp->left = Expr(pFManager);
	   if(typToken != PARSER_COMMA) SendError(6);
	   GetToken();
	   temp->right = Expr(pFManager);
       if(typToken!=PARSER_R_BRACKET) SendError(5);
       GetToken();
   }
   else if(typToken == PARSER_IF)
   {
	   temp = CreateNode(OP_IF);
	   GetToken();
       if(typToken!=PARSER_L_BRACKET) SendError(4);
       GetToken();
       temp->left = Expr(pFManager);
	   if(typToken != PARSER_COMMA) SendError(6);
	   GetToken();
	   temp->right = Expr(pFManager);
	   if(typToken != PARSER_COMMA) SendError(6);
	   GetToken();
	   temp->third = Expr(pFManager);
       if(typToken!=PARSER_R_BRACKET) SendError(5);
       GetToken();
   }
   else
      temp = Expr5(pFManager);

   return temp;
}

TParserNode *TParser::Expr5(NSGuidesOdp::CFormulaManager& pFManager)
{
   TParserNode *temp;
   
   switch(typToken)
   {
      case PARSER_ADJUST:
         temp = CreateNode(pFManager.GetValue(curToken));
         GetToken();
         break;

	  case PARSER_GUIDE:
         temp = CreateNode(pFManager.GetValue(curToken));
         GetToken();
         break;

	  case PARSER_NUMBER:
         temp = CreateNode(XmlUtils::GetDouble(curToken));
         GetToken();
         break;

      case PARSER_PI:
         temp = CreateNode((double)M_PI);
         GetToken();
         break;

      case PARSER_E:
         temp = CreateNode(exp((double)1.0));
         GetToken();
         break;

      case PARSER_L_BRACKET:
         GetToken();
         temp = Expr(pFManager);
         if(typToken!=PARSER_R_BRACKET) SendError(5);
         GetToken();
         break;

      default:
         SendError(6);
   }

   return temp;         
}

double TParser::Evaluate(void)
{
   result = CalcTree(root);
   return result;
}

double TParser::CalcTree(TParserNode *tree)
{
   static double temp;
   
   if(tree->left==NULL && tree->right==NULL)
      return tree->value;
   else
      switch((int)tree->value)
      {
         case OP_PLUS:
            return CalcTree(tree->left)+CalcTree(tree->right);

         case OP_MINUS:
            return CalcTree(tree->left)-CalcTree(tree->right);

         case OP_MULTIPLY:
            return CalcTree(tree->left)*CalcTree(tree->right);

         case OP_DIVIDE:
            return CalcTree(tree->left)/CalcTree(tree->right);

         case OP_PERCENT:
            return (int)CalcTree(tree->left)%(int)CalcTree(tree->right);

         case OP_POWER:
            return (double)pow(CalcTree(tree->left),CalcTree(tree->right));

         case OP_UMINUS:
            return -CalcTree(tree->left);

         case OP_SIN:
            return sin(CalcTree(tree->left));

         case OP_COS:
            return cos(CalcTree(tree->left));

         case OP_TG:
            return tan(CalcTree(tree->left));

         case OP_CTG:
            return 1.0/tan(CalcTree(tree->left));

         case OP_ARCSIN:
            return asin(CalcTree(tree->left));

         case OP_ARCCOS:
            return acos(CalcTree(tree->left));

         case OP_ARCTG:
            return atan(CalcTree(tree->left));

         case OP_ARCCTG:
            return M_PI/2.0-atan(CalcTree(tree->left));

         case OP_SH:
            temp = CalcTree(tree->left);
            return (exp(temp)-exp(-temp))/2.0;

         case OP_CH:
            temp = CalcTree(tree->left);
            return (exp(temp)+exp(-temp))/2.0;

         case OP_TH:
            temp = CalcTree(tree->left);
            return (exp(temp)-exp(-temp))/(exp(temp)+exp(-temp));

         case OP_CTH:
            temp = CalcTree(tree->left);
            return (exp(temp)+exp(-temp))/(exp(temp)-exp(-temp));

         case OP_EXP:
            return exp(CalcTree(tree->left));

         case OP_LG:
            return log10(CalcTree(tree->left));

         case OP_LN:
            return log(CalcTree(tree->left));

         case OP_SQRT:
            return sqrt(CalcTree(tree->left));

		 case OP_ABS:
            return abs(CalcTree(tree->left));

		 case OP_MIN:
			 return min(CalcTree(tree->left), CalcTree(tree->right));

		 case OP_MAX:
			 return max(CalcTree(tree->left), CalcTree(tree->right));

		 case OP_ATAN2:
			 return atan2(CalcTree(tree->left), CalcTree(tree->right));

		 case OP_IF:
			 return ((CalcTree(tree->left) > 0) ? CalcTree(tree->right) : CalcTree(tree->third));
      }

   return 0;
}

void TParser::DelTree(TParserNode *tree)
{
   if(tree==NULL) return;

   DelTree(tree->left);
   DelTree(tree->right);

   delete tree;

   return;
}