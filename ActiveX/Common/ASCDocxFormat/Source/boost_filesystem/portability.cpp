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
#include <boost/filesystem/path.hpp>

namespace fs = boost::filesystem;

#include <cstring> 

# ifdef BOOST_NO_STDC_NAMESPACE
    namespace std { using ::strerror; }
# endif



namespace
{
  const char invalid_chars[] =
    "\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F"
    "\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F"
    "<>:\"/\\|";
  
  
  const std::string windows_invalid_chars( invalid_chars, sizeof(invalid_chars) );

  const std::string valid_posix(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-" );

} 

namespace boost
{
  namespace filesystem
  {

    

#   ifdef BOOST_WINDOWS
    BOOST_FILESYSTEM_DECL bool native( const std::string & name )
    {
      return windows_name( name );
    }
#   else
    BOOST_FILESYSTEM_DECL bool native( const std::string & name )
    {
      return  name.size() != 0
        && name[0] != ' '
        && name.find('/') == std::string::npos;
    }
#   endif

    BOOST_FILESYSTEM_DECL bool portable_posix_name( const std::string & name )
    {
      return name.size() != 0
        && name.find_first_not_of( valid_posix ) == std::string::npos;     
    }

    BOOST_FILESYSTEM_DECL bool windows_name( const std::string & name )
    {
      return name.size() != 0
        && name[0] != ' '
        && name.find_first_of( windows_invalid_chars ) == std::string::npos
        && *(name.end()-1) != ' '
        && (*(name.end()-1) != '.'
          || name.length() == 1 || name == "..");
    }

    BOOST_FILESYSTEM_DECL bool portable_name( const std::string & name )
    {
      return
        name.size() != 0
        && ( name == "."
          || name == ".."
          || (windows_name( name )
            && portable_posix_name( name )
            && name[0] != '.' && name[0] != '-'));
    }

    BOOST_FILESYSTEM_DECL bool portable_directory_name( const std::string & name )
    {
      return
        name == "."
        || name == ".."
        || (portable_name( name )
          && name.find('.') == std::string::npos);
    }

    BOOST_FILESYSTEM_DECL bool portable_file_name( const std::string & name )
    {
      std::string::size_type pos;
      return
         portable_name( name )
         && name != "."
         && name != ".."
         && ( (pos = name.find( '.' )) == std::string::npos
             || (name.find( '.', pos+1 ) == std::string::npos
               && (pos + 5) > name.length() ))
        ;
    }

  } 
} 
