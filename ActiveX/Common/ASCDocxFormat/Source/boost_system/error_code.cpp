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
 
#include <boost/config/warning_disable.hpp>



#define BOOST_SYSTEM_SOURCE 

#include <boost/system/config.hpp>
#include <boost/system/error_code.hpp>
#include <boost/cerrno.hpp>
#include <vector>
#include <cstdlib>
#include <cassert>

using namespace boost::system;
using namespace boost::system::posix_error;

#include <cstring> 

# if defined( BOOST_WINDOWS_API )
#   include <windows.h>
#   ifndef ERROR_INCORRECT_SIZE
#    define ERROR_INCORRECT_SIZE ERROR_BAD_ARGUMENTS
#   endif
# endif



namespace
{
  

  class generic_error_category : public error_category
  {
  public:
    generic_error_category(){}
    const char *   name() const;
    std::string    message( int ev ) const;
  };

  class system_error_category : public error_category
  {
  public:
    system_error_category(){}
    const char *        name() const;
    std::string         message( int ev ) const;
    error_condition     default_error_condition( int ev ) const;
  };

  

  const char * generic_error_category::name() const
  {
    return "generic";
  }

  std::string generic_error_category::message( int ev ) const
  {
    static std::string unknown_err( "Unknown error" );
  
  
  
  
  
  
  
  
  
  
  # if defined(BOOST_WINDOWS_API) || defined(__hpux) || defined(__sun)\
     || (defined(__linux) && (!defined(__USE_XOPEN2K) || defined(BOOST_SYSTEM_USE_STRERROR)))\
     || (defined(__osf__) && !defined(_REENTRANT))\
     || (defined(__vms))\
     || (defined(__QNXNTO__))
      const char * c_str = std::strerror( ev );
      return  c_str
        ? std::string( c_str )
        : unknown_err;
  # else  
      char buf[64];
      char * bp = buf;
      std::size_t sz = sizeof(buf);
  #  if defined(__CYGWIN__) || defined(__USE_GNU)
      
      const char * c_str = strerror_r( ev, bp, sz );
      return  c_str
        ? std::string( c_str )
        : unknown_err;
  #  else
      
      int result;
      for (;;)
      {
        
        
  #  if defined (__sgi)
        const char * c_str = strerror( ev );
        result = 0;
      return  c_str
        ? std::string( c_str )
        : unknown_err;
  #  else
        result = strerror_r( ev, bp, sz );
  #  endif
        if (result == 0 )
          break;
        else
        {
  #  if defined(__linux)
          
          result = errno;
  #  endif
          if ( result !=  ERANGE ) break;
          if ( sz > sizeof(buf) ) std::free( bp );
          sz *= 2;
          if ( (bp = static_cast<char*>(std::malloc( sz ))) == 0 )
            return std::string( "ENOMEM" );
        }
      }
      std::string msg;
      try
      {
        msg = ( ( result == invalid_argument ) ? "Unknown error" : bp );
      }

#   ifndef BOOST_NO_EXCEPTIONS
      
      catch(...)
      {
        
      }
#   endif

      if ( sz > sizeof(buf) ) std::free( bp );
      sz = 0;
      return msg;
  #  endif   
  # endif  
  }
  

  const char * system_error_category::name() const
  {
    return "system";
  }

  error_condition system_error_category::default_error_condition( int ev ) const
  {
    switch ( ev )
    {
    case 0: return make_error_condition( success );
  # if defined(BOOST_POSIX_API)
    
    case E2BIG: return make_error_condition( argument_list_too_long );
    case EACCES: return make_error_condition( permission_denied );
    case EADDRINUSE: return make_error_condition( address_in_use );
    case EADDRNOTAVAIL: return make_error_condition( address_not_available );
    case EAFNOSUPPORT: return make_error_condition( address_family_not_supported );
    case EAGAIN: return make_error_condition( resource_unavailable_try_again );
#   if EALREADY != EBUSY  
    case EALREADY: return make_error_condition( connection_already_in_progress );
#   endif
    case EBADF: return make_error_condition( bad_file_descriptor );
    case EBADMSG: return make_error_condition( bad_message );
    case EBUSY: return make_error_condition( device_or_resource_busy );
    case ECANCELED: return make_error_condition( operation_canceled );
    case ECHILD: return make_error_condition( no_child_process );
    case ECONNABORTED: return make_error_condition( connection_aborted );
    case ECONNREFUSED: return make_error_condition( connection_refused );
    case ECONNRESET: return make_error_condition( connection_reset );
    case EDEADLK: return make_error_condition( resource_deadlock_would_occur );
    case EDESTADDRREQ: return make_error_condition( destination_address_required );
    case EDOM: return make_error_condition( argument_out_of_domain );
    case EEXIST: return make_error_condition( file_exists );
    case EFAULT: return make_error_condition( bad_address );
    case EFBIG: return make_error_condition( file_too_large );
    case EHOSTUNREACH: return make_error_condition( host_unreachable );
    case EIDRM: return make_error_condition( identifier_removed );
    case EILSEQ: return make_error_condition( illegal_byte_sequence );
    case EINPROGRESS: return make_error_condition( operation_in_progress );
    case EINTR: return make_error_condition( interrupted );
    case EINVAL: return make_error_condition( invalid_argument );
    case EIO: return make_error_condition( io_error );
    case EISCONN: return make_error_condition( already_connected );
    case EISDIR: return make_error_condition( is_a_directory );
    case ELOOP: return make_error_condition( too_many_synbolic_link_levels );
    case EMFILE: return make_error_condition( too_many_files_open );
    case EMLINK: return make_error_condition( too_many_links );
    case EMSGSIZE: return make_error_condition( message_size );
    case ENAMETOOLONG: return make_error_condition( filename_too_long );
    case ENETDOWN: return make_error_condition( network_down );
    case ENETRESET: return make_error_condition( network_reset );
    case ENETUNREACH: return make_error_condition( network_unreachable );
    case ENFILE: return make_error_condition( too_many_files_open_in_system );
    case ENOBUFS: return make_error_condition( no_buffer_space );
    case ENODATA: return make_error_condition( no_message_available );
    case ENODEV: return make_error_condition( no_such_device );
    case ENOENT: return make_error_condition( no_such_file_or_directory );
    case ENOEXEC: return make_error_condition( executable_format_error );
    case ENOLCK: return make_error_condition( no_lock_available );
    case ENOLINK: return make_error_condition( no_link );
    case ENOMEM: return make_error_condition( not_enough_memory );
    case ENOMSG: return make_error_condition( no_message );
    case ENOPROTOOPT: return make_error_condition( no_protocol_option );
    case ENOSPC: return make_error_condition( no_space_on_device );
    case ENOSR: return make_error_condition( no_stream_resources );
    case ENOSTR: return make_error_condition( not_a_stream );
    case ENOSYS: return make_error_condition( function_not_supported );
    case ENOTCONN: return make_error_condition( not_connected );
    case ENOTDIR: return make_error_condition( not_a_directory );
  # if ENOTEMPTY != EEXIST 
    case ENOTEMPTY: return make_error_condition( directory_not_empty );
  # endif 
    case ENOTRECOVERABLE: return make_error_condition( state_not_recoverable );
    case ENOTSOCK: return make_error_condition( not_a_socket );
    case ENOTSUP: return make_error_condition( not_supported );
    case ENOTTY: return make_error_condition( inappropriate_io_control_operation );
    case ENXIO: return make_error_condition( no_such_device_or_address );
  # if EOPNOTSUPP != ENOTSUP
    case EOPNOTSUPP: return make_error_condition( operation_not_supported );
  # endif 
    case EOVERFLOW: return make_error_condition( value_too_large );
    case EOWNERDEAD: return make_error_condition( owner_dead );
    case EPERM: return make_error_condition( operation_not_permitted );
    case EPIPE: return make_error_condition( broken_pipe );
    case EPROTO: return make_error_condition( protocol_error );
    case EPROTONOSUPPORT: return make_error_condition( protocol_not_supported );
    case EPROTOTYPE: return make_error_condition( wrong_protocol_type );
    case ERANGE: return make_error_condition( result_out_of_range );
    case EROFS: return make_error_condition( read_only_file_system );
    case ESPIPE: return make_error_condition( invalid_seek );
    case ESRCH: return make_error_condition( no_such_process );
    case ETIME: return make_error_condition( stream_timeout );
    case ETIMEDOUT: return make_error_condition( timed_out );
    case ETXTBSY: return make_error_condition( text_file_busy );
  # if EAGAIN != EWOULDBLOCK
    case EWOULDBLOCK: return make_error_condition( operation_would_block );
  # endif 
    case EXDEV: return make_error_condition( cross_device_link );
  #else
    
    
    case ERROR_ACCESS_DENIED: return make_error_condition( permission_denied );
    case ERROR_ALREADY_EXISTS: return make_error_condition( file_exists );
    case ERROR_BAD_UNIT: return make_error_condition( no_such_device );
    case ERROR_BUFFER_OVERFLOW: return make_error_condition( filename_too_long );
    case ERROR_BUSY: return make_error_condition( device_or_resource_busy );
    case ERROR_BUSY_DRIVE: return make_error_condition( device_or_resource_busy );
    case ERROR_CANNOT_MAKE: return make_error_condition( permission_denied );
    case ERROR_CANTOPEN: return make_error_condition( io_error );
    case ERROR_CANTREAD: return make_error_condition( io_error );
    case ERROR_CANTWRITE: return make_error_condition( io_error );
    case ERROR_CURRENT_DIRECTORY: return make_error_condition( permission_denied );
    case ERROR_DEV_NOT_EXIST: return make_error_condition( no_such_device );
    case ERROR_DEVICE_IN_USE: return make_error_condition( device_or_resource_busy );
    case ERROR_DIR_NOT_EMPTY: return make_error_condition( directory_not_empty );
    case ERROR_DIRECTORY: return make_error_condition( invalid_argument ); 
    case ERROR_DISK_FULL: return make_error_condition( no_space_on_device );
    case ERROR_FILE_EXISTS: return make_error_condition( file_exists );
    case ERROR_FILE_NOT_FOUND: return make_error_condition( no_such_file_or_directory );
    case ERROR_HANDLE_DISK_FULL: return make_error_condition( no_space_on_device );
    case ERROR_INVALID_ACCESS: return make_error_condition( permission_denied );
    case ERROR_INVALID_DRIVE: return make_error_condition( no_such_device );
    case ERROR_INVALID_FUNCTION: return make_error_condition( function_not_supported );
    case ERROR_INVALID_HANDLE: return make_error_condition( invalid_argument );
    case ERROR_INVALID_NAME: return make_error_condition( invalid_argument );
    case ERROR_LOCK_VIOLATION: return make_error_condition( no_lock_available );
    case ERROR_LOCKED: return make_error_condition( no_lock_available );
    case ERROR_NEGATIVE_SEEK: return make_error_condition( invalid_argument );
    case ERROR_NOACCESS: return make_error_condition( permission_denied );
    case ERROR_NOT_ENOUGH_MEMORY: return make_error_condition( not_enough_memory );
    case ERROR_NOT_READY: return make_error_condition( resource_unavailable_try_again );
    case ERROR_NOT_SAME_DEVICE: return make_error_condition( cross_device_link );
    case ERROR_OPEN_FAILED: return make_error_condition( io_error );
    case ERROR_OPEN_FILES: return make_error_condition( device_or_resource_busy );
    case ERROR_OPERATION_ABORTED: return make_error_condition( operation_canceled );
    case ERROR_OUTOFMEMORY: return make_error_condition( not_enough_memory );
    case ERROR_PATH_NOT_FOUND: return make_error_condition( no_such_file_or_directory );
    case ERROR_READ_FAULT: return make_error_condition( io_error );
    case ERROR_RETRY: return make_error_condition( resource_unavailable_try_again );
    case ERROR_SEEK: return make_error_condition( io_error );
    case ERROR_SHARING_VIOLATION: return make_error_condition( permission_denied );
    case ERROR_TOO_MANY_OPEN_FILES: return make_error_condition( too_many_files_open );
    case ERROR_WRITE_FAULT: return make_error_condition( io_error );
    case ERROR_WRITE_PROTECT: return make_error_condition( permission_denied );
    case WSAEACCES: return make_error_condition( permission_denied );
    case WSAEADDRINUSE: return make_error_condition( address_in_use );
    case WSAEADDRNOTAVAIL: return make_error_condition( address_not_available );
    case WSAEAFNOSUPPORT: return make_error_condition( address_family_not_supported );
    case WSAEALREADY: return make_error_condition( connection_already_in_progress );
    case WSAEBADF: return make_error_condition( bad_file_descriptor );
    case WSAECONNABORTED: return make_error_condition( connection_aborted );
    case WSAECONNREFUSED: return make_error_condition( connection_refused );
    case WSAECONNRESET: return make_error_condition( connection_reset );
    case WSAEDESTADDRREQ: return make_error_condition( destination_address_required );
    case WSAEFAULT: return make_error_condition( bad_address );
    case WSAEHOSTUNREACH: return make_error_condition( host_unreachable );
    case WSAEINPROGRESS: return make_error_condition( operation_in_progress );
    case WSAEINTR: return make_error_condition( interrupted );
    case WSAEINVAL: return make_error_condition( invalid_argument );
    case WSAEISCONN: return make_error_condition( already_connected );
    case WSAEMFILE: return make_error_condition( too_many_files_open );
    case WSAEMSGSIZE: return make_error_condition( message_size );
    case WSAENAMETOOLONG: return make_error_condition( filename_too_long );
    case WSAENETDOWN: return make_error_condition( network_down );
    case WSAENETRESET: return make_error_condition( network_reset );
    case WSAENETUNREACH: return make_error_condition( network_unreachable );
    case WSAENOBUFS: return make_error_condition( no_buffer_space );
    case WSAENOPROTOOPT: return make_error_condition( no_protocol_option );
    case WSAENOTCONN: return make_error_condition( not_connected );
    case WSAENOTSOCK: return make_error_condition( not_a_socket );
    case WSAEOPNOTSUPP: return make_error_condition( operation_not_supported );
    case WSAEPROTONOSUPPORT: return make_error_condition( protocol_not_supported );
    case WSAEPROTOTYPE: return make_error_condition( wrong_protocol_type );
    case WSAETIMEDOUT: return make_error_condition( timed_out );
    case WSAEWOULDBLOCK: return make_error_condition( operation_would_block );
  #endif
    default: return error_condition( ev, system_category );
    }
  }

# if !defined( BOOST_WINDOWS_API )

  std::string system_error_category::message( int ev ) const
  {
    return generic_category.message( ev );
  }
# else

  













  std::string system_error_category::message( int ev ) const
  {
# ifndef BOOST_NO_ANSI_APIS  
    LPVOID lpMsgBuf;
    DWORD retval = ::FormatMessageA( 
        FORMAT_MESSAGE_ALLOCATE_BUFFER | 
        FORMAT_MESSAGE_FROM_SYSTEM | 
        FORMAT_MESSAGE_IGNORE_INSERTS,
        NULL,
        ev,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), 
        (LPSTR) &lpMsgBuf,
        0,
        NULL 
    );
    if (retval == 0)
        return std::string("Unknown error");
        
    std::string str( static_cast<LPCSTR>(lpMsgBuf) );
    ::LocalFree( lpMsgBuf ); 
# else  
    LPVOID lpMsgBuf;
    DWORD retval = ::FormatMessageW( 
        FORMAT_MESSAGE_ALLOCATE_BUFFER | 
        FORMAT_MESSAGE_FROM_SYSTEM | 
        FORMAT_MESSAGE_IGNORE_INSERTS,
        NULL,
        ev,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), 
        (LPWSTR) &lpMsgBuf,
        0,
        NULL 
    );
    if (retval == 0)
        return std::string("Unknown error");
    
    int num_chars = (wcslen( static_cast<LPCWSTR>(lpMsgBuf) ) + 1) * 2;
    LPSTR narrow_buffer = (LPSTR)_alloca( num_chars );
    if (::WideCharToMultiByte(CP_ACP, 0, static_cast<LPCWSTR>(lpMsgBuf), -1, narrow_buffer, num_chars, NULL, NULL) == 0)
        return std::string("Unknown error");

    std::string str( narrow_buffer );
    ::LocalFree( lpMsgBuf ); 
# endif
    while ( str.size()
      && (str[str.size()-1] == '\n' || str[str.size()-1] == '\r') )
        str.erase( str.size()-1 );
    if ( str.size() && str[str.size()-1] == '.' ) 
      { str.erase( str.size()-1 ); }
    return str;
  }
# endif

} 

namespace boost
{
  namespace system
  {

    BOOST_SYSTEM_DECL error_code throws; 
                                         
                                         
                                         
                                         

    BOOST_SYSTEM_DECL const error_category & get_system_category()
    {
      static const system_error_category  system_category_const;
      return system_category_const;
    }

    BOOST_SYSTEM_DECL const error_category & get_generic_category()
    {
      static const generic_error_category generic_category_const;
      return generic_category_const;
    }

  } 
} 
