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
#include "UniversalString.h"

void UniversalString::ClearUniversalString()
{
  this->length = 0;
  this->charSize = 0;
  this->wcharSize = 0;
		
  if ( this->str != NULL )
  {
    delete [](this->str);
	this->str = NULL;
  }

  if ( this->wstr != NULL )
  {
    delete [](this->wstr);
	this->wstr = NULL;
  }
}



UniversalString::UniversalString():
str(NULL), wstr(NULL), length(0), charSize(1), wcharSize(1)
{
  this->str = new char[this->charSize];
  this->str[0] = '\0';
	  
  this->wstr = new wchar_t[this->wcharSize];
  this->wstr[0] = '\0';
}



UniversalString::UniversalString( const UniversalString& _ustr ):
str(NULL), wstr(NULL), length(_ustr.length), charSize(_ustr.charSize), wcharSize(_ustr.wcharSize)
{
  if ( ( this->charSize > 0 ) && ( this->wcharSize > 0 ) )
  {
    this->str = new char[this->charSize];
	this->wstr = new wchar_t[this->wcharSize];

	if ( ( this->str != NULL ) && ( this->wstr != NULL ) )
	{
	  memset( this->str, 0, ( sizeof(char) * this->charSize ) );
	  memset( this->wstr, 0, ( sizeof(wchar_t) * this->wcharSize ) );
		
	  memcpy( this->str, _ustr.str, ( sizeof(char) * this->charSize ) );
	  memcpy( this->wstr, _ustr.wstr, ( sizeof(wchar_t) * this->wcharSize ) );
	}
  }
}



UniversalString::UniversalString( const char* _str, unsigned int CodePage ):
str(NULL), wstr(NULL), length(0), charSize(0), wcharSize(0)
{
  if ( _str != NULL )
  {
	this->length = (unsigned int)strlen( _str );
	this->charSize = ( this->length + 1 );
	this->str = new char[this->charSize];

	if ( this->str != NULL )
	{
	  memset( this->str, 0, ( sizeof(char) * this->charSize ) );
	  memcpy( this->str, _str, ( sizeof(char) * this->charSize ) );

	  this->wcharSize = MultiByteToWideChar( CodePage, 0, this->str, -1, NULL, 0 );
	  this->wstr = new wchar_t[this->wcharSize];

	  if ( this->wstr != NULL )
	  {
		memset( this->wstr, 0, ( sizeof(wchar_t) * this->wcharSize ) );
	    MultiByteToWideChar( CodePage, 0, this->str, -1, this->wstr, this->wcharSize );
	  }
	}
  }
}



UniversalString::UniversalString( const wchar_t* _wstr, unsigned int CodePage ):
str(NULL), wstr(NULL), length(0), charSize(0), wcharSize(0)
{
  if ( _wstr != NULL )
  {
    this->length = (unsigned int)wcslen( _wstr );
	this->wcharSize = ( this->length + 1 );
	this->wstr = new wchar_t[this->wcharSize];

	if ( this->wstr != NULL )
	{
      memset( this->wstr, 0, ( sizeof(wchar_t) * this->wcharSize ) );
	  memcpy( this->wstr, _wstr, ( sizeof(wchar_t) * this->wcharSize ) );

      this->charSize = WideCharToMultiByte( CodePage, 0, this->wstr, -1, NULL, 0, NULL, NULL );
	  this->str = new char[this->charSize];

	  if ( this->str != NULL )
	  {
	    memset( this->str, 0, ( sizeof(char) * this->charSize ) );
		WideCharToMultiByte( CodePage, 0, this->wstr, -1, this->str, this->charSize, NULL, NULL );
	  }
	}
  }
}



UniversalString::~UniversalString()
{
  this->ClearUniversalString();
}



UniversalString::operator char* ()
{
  return this->str;
}



UniversalString::operator wchar_t* ()
{
  return this->wstr;
}



bool UniversalString::operator == ( const UniversalString& _ustr )
{
  if ( ( this->length == _ustr.length ) && ( this->charSize == _ustr.charSize ) && ( this->wcharSize == _ustr.wcharSize ) &&
       ( strncmp( this->str, _ustr.str, _ustr.charSize ) == 0 ) && ( wcsncmp( this->wstr, _ustr.wstr, _ustr.wcharSize ) == 0 ) )
  {
    return true;
  }
  else
  {
    return false;
  }
}



bool UniversalString::operator != ( const UniversalString& _ustr )
{
  return !(this->operator == ( _ustr ));
}



UniversalString& UniversalString::operator = ( const UniversalString& _ustr )
{
  if ( this != &_ustr )
  {	
    this->ClearUniversalString();

	this->length = _ustr.length;
	this->charSize = _ustr.charSize;
	this->wcharSize = _ustr.wcharSize;

	if ( ( this->charSize > 0 ) && ( this->wcharSize > 0 ) )
	{
      this->str = new char[this->charSize];
	  this->wstr = new wchar_t[this->wcharSize];

	  if ( ( this->str != NULL ) && ( this->wstr != NULL ) )
	  {
	    memset( this->str, 0, ( sizeof(char) * this->charSize ) );
		memset( this->wstr, 0, ( sizeof(wchar_t) * this->wcharSize ) );
		  
		memcpy( this->str, _ustr.str, ( sizeof(char) * this->charSize ) );
	    memcpy( this->wstr, _ustr.wstr, ( sizeof(wchar_t) * this->wcharSize ) );
	  }
	}
  }
	  
  return *this;
}



unsigned int UniversalString::GetLength() const
{
  return this->length;
}