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
 
#define BOOST_FILESYSTEM_SOURCE 

#include <boost/filesystem/config.hpp>

#ifndef BOOST_FILESYSTEM_NARROW_ONLY

#include <boost/filesystem/path.hpp>
#include <boost/scoped_array.hpp>

#include <locale>
#include <boost/cerrno.hpp>
#include <boost/system/error_code.hpp>

#include <cwchar>     

namespace
{
  
  
  
  
  std::locale & loc()
  {
    
    static std::locale lc("");
    return lc;
  }

  const std::codecvt<wchar_t, char, std::mbstate_t> *&
  converter()
  {
   static const std::codecvt<wchar_t, char, std::mbstate_t> *
     cvtr(
       &std::use_facet<std::codecvt<wchar_t, char, std::mbstate_t> >
        ( loc() ) );
   return cvtr;
  }

  bool locked(false);
} 

namespace boost
{
  namespace filesystem
  {
    bool wpath_traits::imbue( const std::locale & new_loc, const std::nothrow_t & )
    {
      if ( locked ) return false;
      locked = true;
      loc() = new_loc;
      converter() = &std::use_facet
        <std::codecvt<wchar_t, char, std::mbstate_t> >( loc() );
      return true;
    }

    void wpath_traits::imbue( const std::locale & new_loc )
    {
      if ( locked ) boost::throw_exception(
        wfilesystem_error(
          "boost::filesystem::wpath_traits::imbue() after lockdown",
          make_error_code( system::posix::not_supported ) ) );
      imbue( new_loc, std::nothrow );
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
# ifdef BOOST_POSIX_API




    wpath_traits::external_string_type
    wpath_traits::to_external( const wpath & ph, 
      const internal_string_type & src )
    {
      locked = true;
      std::size_t work_size( converter()->max_length() * (src.size()+1) );
      boost::scoped_array<char> work( new char[ work_size ] );
      std::mbstate_t state = std::mbstate_t();  
      const internal_string_type::value_type * from_next;
      external_string_type::value_type * to_next;
      if ( converter()->out( 
        state, src.c_str(), src.c_str()+src.size(), from_next, work.get(),
        work.get()+work_size, to_next ) != std::codecvt_base::ok )
        boost::throw_exception( boost::filesystem::wfilesystem_error(
          "boost::filesystem::wpath::to_external conversion error",
          ph, system::error_code( system::posix::invalid_argument, system::system_category ) ) );
      *to_next = '\0';
      return external_string_type( work.get() );
    }

    wpath_traits::internal_string_type
    wpath_traits::to_internal( const external_string_type & src )
    {
      locked = true;
      std::size_t work_size( src.size()+1 );
      boost::scoped_array<wchar_t> work( new wchar_t[ work_size ] );
      std::mbstate_t state  = std::mbstate_t();  
      const external_string_type::value_type * from_next;
      internal_string_type::value_type * to_next;
      if ( converter()->in( 
        state, src.c_str(), src.c_str()+src.size(), from_next, work.get(),
        work.get()+work_size, to_next ) != std::codecvt_base::ok )
        boost::throw_exception( boost::filesystem::wfilesystem_error(
          "boost::filesystem::wpath::to_internal conversion error",
          system::error_code( system::posix::invalid_argument, system::system_category ) ) );
      *to_next = L'\0';
      return internal_string_type( work.get() );
    }
# endif 

  } 
} 

#endif 
