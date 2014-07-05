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

#define _POSIX_PTHREAD_SEMANTICS  


#if defined(_AIX)
# define _LINUX_SOURCE_COMPAT
#endif

#if !(defined(__HP_aCC) && defined(_ILP32) && \
      !defined(_STATVFS_ACPP_PROBLEMS_FIXED))
#define _FILE_OFFSET_BITS 64 
#endif
#define __USE_FILE_OFFSET64 
      
      
      
      
      
      
      
      
      



#if !defined(_WIN32_WINNT)
#define _WIN32_WINNT 0x0500 
#endif


#include <boost/filesystem/operations.hpp>
#include <boost/scoped_array.hpp>
#include <boost/throw_exception.hpp>
#include <boost/detail/workaround.hpp>

namespace fs = boost::filesystem;
using boost::system::error_code;
using boost::system::system_category;

# if defined(BOOST_WINDOWS_API)
#   include <windows.h>
#   if defined(__BORLANDC__) || defined(__MWERKS__)
#     if defined(__BORLANDC__)
        using std::time_t;
#     endif
#     include <utime.h>
#   else
#     include <sys/utime.h>
#   endif

# else 
#   include <sys/types.h>
#   if !defined(__APPLE__) && !defined(__OpenBSD__)
#     include <sys/statvfs.h>
#     define BOOST_STATVFS statvfs
#     define BOOST_STATVFS_F_FRSIZE vfs.f_frsize
#   else
#ifdef __OpenBSD__
#     include <sys/param.h>
#endif
#     include <sys/mount.h>
#     define BOOST_STATVFS statfs
#     define BOOST_STATVFS_F_FRSIZE static_cast<boost::uintmax_t>( vfs.f_bsize )
#   endif
#   include <dirent.h>
#   include <unistd.h>
#   include <fcntl.h>
#   include <utime.h>
#   include "limits.h"
# endif






# if defined(BOOST_WINDOWS_API) \
  || defined(_DIRENT_HAVE_D_TYPE) 
#   define BOOST_FILESYSTEM_STATUS_CACHE
# endif

#include <sys/stat.h>  
#include <string>
#include <cstring>
#include <cstdio>      
#include <cerrno>
#include <cassert>


#ifdef BOOST_NO_STDC_NAMESPACE
namespace std { using ::strcmp; using ::remove; using ::rename; }
#endif



namespace
{
  const error_code ok;

  bool is_empty_directory( const std::string & dir_path )
  {
    static const fs::directory_iterator end_itr;
    return fs::directory_iterator(fs::path(dir_path)) == end_itr;
  }

#ifdef BOOST_WINDOWS_API
  





  inline DWORD get_file_attributes( const char * ph )
    { return ::GetFileAttributesA( ph ); }

# ifndef BOOST_FILESYSTEM_NARROW_ONLY

  inline DWORD get_file_attributes( const wchar_t * ph )
    { return ::GetFileAttributesW( ph ); }

  bool is_empty_directory( const std::wstring & dir_path )
  {
    static const fs::wdirectory_iterator wend_itr;
    return fs::wdirectory_iterator(fs::wpath(dir_path)) == wend_itr;
  }

  inline BOOL get_file_attributes_ex( const wchar_t * ph,
    WIN32_FILE_ATTRIBUTE_DATA & fad )
  { return ::GetFileAttributesExW( ph, ::GetFileExInfoStandard, &fad ); }
      
  HANDLE create_file( const wchar_t * ph, DWORD dwDesiredAccess,
    DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes,
    DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes,
    HANDLE hTemplateFile )
  {
    return ::CreateFileW( ph, dwDesiredAccess, dwShareMode,
      lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes,
      hTemplateFile );
  }

  inline DWORD get_current_directory( DWORD sz, wchar_t * buf )
    { return ::GetCurrentDirectoryW( sz, buf ); } 

  inline bool set_current_directory( const wchar_t * buf )
    { return ::SetCurrentDirectoryW( buf ) != 0 ; } 

  inline bool get_free_disk_space( const std::wstring & ph,
    PULARGE_INTEGER avail, PULARGE_INTEGER total, PULARGE_INTEGER free )
    { return ::GetDiskFreeSpaceExW( ph.c_str(), avail, total, free ) != 0; }

  inline std::size_t get_full_path_name(
    const std::wstring & ph, std::size_t len, wchar_t * buf, wchar_t ** p )
  {
    return static_cast<std::size_t>(
      ::GetFullPathNameW( ph.c_str(),
        static_cast<DWORD>(len), buf, p ));
  } 

  inline bool remove_directory( const std::wstring & ph )
    { return ::RemoveDirectoryW( ph.c_str() ) != 0; }

  inline bool delete_file( const std::wstring & ph )
    { return ::DeleteFileW( ph.c_str() ) != 0; }

  inline bool create_directory( const std::wstring & dir )
    {  return ::CreateDirectoryW( dir.c_str(), 0 ) != 0; }

#if _WIN32_WINNT >= 0x500
  inline bool create_hard_link( const std::wstring & to_ph,
    const std::wstring & from_ph )
    {  return ::CreateHardLinkW( from_ph.c_str(), to_ph.c_str(), 0 ) != 0; }
#endif
  
# endif 

  template< class String >
  fs::file_status status_template( const String & ph, error_code & ec )
  {
    DWORD attr( get_file_attributes( ph.c_str() ) );
    if ( attr == 0xFFFFFFFF )
    {
      ec = error_code( ::GetLastError(), system_category );
      if ((ec.value() == ERROR_FILE_NOT_FOUND)
        || (ec.value() == ERROR_PATH_NOT_FOUND)
        || (ec.value() == ERROR_INVALID_NAME) 
        || (ec.value() == ERROR_INVALID_PARAMETER) 
        || (ec.value() == ERROR_BAD_PATHNAME) 
        || (ec.value() == ERROR_BAD_NETPATH)) 
      {
        ec = ok; 
                           
        return fs::file_status( fs::file_not_found );
      }
      else if ((ec.value() == ERROR_SHARING_VIOLATION))
      {
        ec = ok; 
                           
        return fs::file_status( fs::type_unknown );
      }
      return fs::file_status( fs::status_unknown );
    }
    ec = ok;;
    return (attr & FILE_ATTRIBUTE_DIRECTORY)
      ? fs::file_status( fs::directory_file )
      : fs::file_status( fs::regular_file );
  }

  BOOL get_file_attributes_ex( const char * ph,
    WIN32_FILE_ATTRIBUTE_DATA & fad )
  { return ::GetFileAttributesExA( ph, ::GetFileExInfoStandard, &fad ); }

  template< class String >
  boost::filesystem::detail::query_pair
  is_empty_template( const String & ph )
  {
    WIN32_FILE_ATTRIBUTE_DATA fad;
    if ( get_file_attributes_ex( ph.c_str(), fad ) == 0 )
      return std::make_pair( error_code( ::GetLastError(), system_category ), false );    
    return std::make_pair( ok,
      ( fad.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
        ? is_empty_directory( ph )
        :( !fad.nFileSizeHigh && !fad.nFileSizeLow ) );
  }

  HANDLE create_file( const char * ph, DWORD dwDesiredAccess,
    DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes,
    DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes,
    HANDLE hTemplateFile )
  {
    return ::CreateFileA( ph, dwDesiredAccess, dwShareMode,
      lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes,
      hTemplateFile );
  }

  
  
  
  struct handle_wrapper
  {
    HANDLE handle;
    handle_wrapper( HANDLE h )
      : handle(h) {}
    ~handle_wrapper()
    {
      if ( handle != INVALID_HANDLE_VALUE )
        ::CloseHandle(handle);
    }
  };

  template< class String >
  boost::filesystem::detail::query_pair
  equivalent_template( const String & ph1, const String & ph2 )
  {
    
    
    
    
    
    handle_wrapper p1(
      create_file(
          ph1.c_str(),
          0,
          FILE_SHARE_DELETE | FILE_SHARE_READ | FILE_SHARE_WRITE,
          0,
          OPEN_EXISTING,
          FILE_FLAG_BACKUP_SEMANTICS,
          0 ) );
    int error1(0); 
    if ( p1.handle == INVALID_HANDLE_VALUE )
      error1 = ::GetLastError();
    handle_wrapper p2(
      create_file(
          ph2.c_str(),
          0,
          FILE_SHARE_DELETE | FILE_SHARE_READ | FILE_SHARE_WRITE,
          0,
          OPEN_EXISTING,
          FILE_FLAG_BACKUP_SEMANTICS,
          0 ) );
    if ( p1.handle == INVALID_HANDLE_VALUE
      || p2.handle == INVALID_HANDLE_VALUE )
    {
      if ( p1.handle != INVALID_HANDLE_VALUE
        || p2.handle != INVALID_HANDLE_VALUE )
        { return std::make_pair( ok, false ); }
      assert( p1.handle == INVALID_HANDLE_VALUE
        && p2.handle == INVALID_HANDLE_VALUE );
        { return std::make_pair( error_code( error1, system_category), false ); }
    }
    
    BY_HANDLE_FILE_INFORMATION info1, info2;
    if ( !::GetFileInformationByHandle( p1.handle, &info1 ) )
      { return std::make_pair( error_code( ::GetLastError(), system_category ), false ); }
    if ( !::GetFileInformationByHandle( p2.handle, &info2 ) )
      { return std::make_pair( error_code( ::GetLastError(), system_category ), false ); }
    
    
    
      return std::make_pair( ok,
        info1.dwVolumeSerialNumber == info2.dwVolumeSerialNumber
        && info1.nFileIndexHigh == info2.nFileIndexHigh
        && info1.nFileIndexLow == info2.nFileIndexLow
        && info1.nFileSizeHigh == info2.nFileSizeHigh
        && info1.nFileSizeLow == info2.nFileSizeLow
        && info1.ftLastWriteTime.dwLowDateTime
          == info2.ftLastWriteTime.dwLowDateTime
        && info1.ftLastWriteTime.dwHighDateTime
          == info2.ftLastWriteTime.dwHighDateTime );
  }

  template< class String >
  boost::filesystem::detail::uintmax_pair
  file_size_template( const String & ph )
  {
    WIN32_FILE_ATTRIBUTE_DATA fad;
    
    if ( get_file_attributes_ex( ph.c_str(), fad ) == 0 )
      return std::make_pair( error_code( ::GetLastError(), system_category ), 0 );    
    if ( (fad.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) !=0 )
      return std::make_pair( error_code( ERROR_FILE_NOT_FOUND, system_category), 0 );
    return std::make_pair( ok,
      (static_cast<boost::uintmax_t>(fad.nFileSizeHigh)
        << (sizeof(fad.nFileSizeLow)*8))
      + fad.nFileSizeLow );
  }

  inline bool get_free_disk_space( const std::string & ph,
    PULARGE_INTEGER avail, PULARGE_INTEGER total, PULARGE_INTEGER free )
    { return ::GetDiskFreeSpaceExA( ph.c_str(), avail, total, free ) != 0; }

  template< class String >
  boost::filesystem::detail::space_pair
  space_template( String & ph )
  {
    ULARGE_INTEGER avail, total, free;
    boost::filesystem::detail::space_pair result;
    if ( get_free_disk_space( ph, &avail, &total, &free ) )
    {
      result.first = ok;
      result.second.capacity
        = (static_cast<boost::uintmax_t>(total.HighPart) << 32)
          + total.LowPart;
      result.second.free
        = (static_cast<boost::uintmax_t>(free.HighPart) << 32)
          + free.LowPart;
      result.second.available
        = (static_cast<boost::uintmax_t>(avail.HighPart) << 32)
          + avail.LowPart;
    }
    else
    {
      result.first = error_code( ::GetLastError(), system_category );
      result.second.capacity = result.second.free
        = result.second.available = 0;
    }
    return result;
  }

  inline DWORD get_current_directory( DWORD sz, char * buf )
    { return ::GetCurrentDirectoryA( sz, buf ); } 

  template< class String >
  error_code
  get_current_path_template( String & ph )
  {
    DWORD sz;
    if ( (sz = get_current_directory( 0,
      static_cast<typename String::value_type*>(0) )) == 0 )
      { sz = 1; }
    typedef typename String::value_type value_type;
    boost::scoped_array<value_type> buf( new value_type[sz] );
    if ( get_current_directory( sz, buf.get() ) == 0 )
      return error_code( ::GetLastError(), system_category );
    ph = buf.get();
    return ok;
  }

  inline bool set_current_directory( const char * buf )
    { return ::SetCurrentDirectoryA( buf ) != 0; } 

  template< class String >
  error_code
  set_current_path_template( const String & ph )
  {
    return error_code( set_current_directory( ph.c_str() )
      ? 0 : ::GetLastError(), system_category );
  }

  inline std::size_t get_full_path_name(
    const std::string & ph, std::size_t len, char * buf, char ** p )
  {
    return static_cast<std::size_t>(
      ::GetFullPathNameA( ph.c_str(),
        static_cast<DWORD>(len), buf, p ));
  } 

  const std::size_t buf_size( 128 );

  template<class String>
  error_code
  get_full_path_name_template( const String & ph, String & target )
  {
    typename String::value_type buf[buf_size];
    typename String::value_type * pfn;
    std::size_t len = get_full_path_name( ph,
      buf_size , buf, &pfn );
    if ( len == 0 ) return error_code( ::GetLastError(), system_category );
    if ( len > buf_size )
    {
      typedef typename String::value_type value_type;
      boost::scoped_array<value_type> big_buf( new value_type[len] );
      if ( (len=get_full_path_name( ph, len , big_buf.get(), &pfn ))
        == 0 ) return error_code( ::GetLastError(), system_category );
      big_buf[len] = '\0';
      target = big_buf.get();
      return ok;
    }
    buf[len] = '\0';
    target = buf;
    return ok;
  }

  template<class String>
  error_code
  get_file_write_time( const String & ph, FILETIME & last_write_time )
  {
    handle_wrapper hw(
      create_file( ph.c_str(), 0,
        FILE_SHARE_DELETE | FILE_SHARE_READ | FILE_SHARE_WRITE, 0,
        OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, 0 ) );
    if ( hw.handle == INVALID_HANDLE_VALUE )
      return error_code( ::GetLastError(), system_category );
    return error_code( ::GetFileTime( hw.handle, 0, 0, &last_write_time ) != 0
      ? 0 : ::GetLastError(), system_category );
  }

  template<class String>
  error_code
  set_file_write_time( const String & ph, const FILETIME & last_write_time )
  {
    handle_wrapper hw(
      create_file( ph.c_str(), FILE_WRITE_ATTRIBUTES,
        FILE_SHARE_DELETE | FILE_SHARE_READ | FILE_SHARE_WRITE, 0,
        OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, 0 ) );
    if ( hw.handle == INVALID_HANDLE_VALUE )
      return error_code( ::GetLastError(), system_category );
    return error_code( ::SetFileTime( hw.handle, 0, 0, &last_write_time ) != 0
      ? 0 : ::GetLastError(), system_category );
  }

  
  std::time_t to_time_t( const FILETIME & ft )
  {
    __int64 t = (static_cast<__int64>( ft.dwHighDateTime ) << 32)
      + ft.dwLowDateTime;
# if !defined( BOOST_MSVC ) || BOOST_MSVC > 1300 
    t -= 116444736000000000LL;
# else
    t -= 116444736000000000;
# endif
    t /= 10000000;
    return static_cast<std::time_t>( t );
  }

  void to_FILETIME( std::time_t t, FILETIME & ft )
  {
    __int64 temp = t;
    temp *= 10000000;
# if !defined( BOOST_MSVC ) || BOOST_MSVC > 1300 
    temp += 116444736000000000LL;
# else
    temp += 116444736000000000;
# endif
    ft.dwLowDateTime = static_cast<DWORD>( temp );
    ft.dwHighDateTime = static_cast<DWORD>( temp >> 32 );
  }

  template<class String>
  boost::filesystem::detail::time_pair
  last_write_time_template( const String & ph )
  {
    FILETIME lwt;
    error_code ec(
      get_file_write_time( ph, lwt ) );
    return std::make_pair( ec, to_time_t( lwt ) );
  }

  template<class String>
  error_code
  last_write_time_template( const String & ph, const std::time_t new_time )
  {
    FILETIME lwt;
    to_FILETIME( new_time, lwt );
    return set_file_write_time( ph, lwt );
  }

  bool remove_directory( const std::string & ph )
    { return ::RemoveDirectoryA( ph.c_str() ) != 0; }
  
  bool delete_file( const std::string & ph )
    { return ::DeleteFileA( ph.c_str() ) != 0; }
  
  template<class String>
  error_code
  remove_template( const String & ph )
  {
    
    
    error_code ec;
    fs::file_status sf( fs::detail::status_api( ph, ec ) );
    if ( ec ) 
      return ec;
    if ( sf.type() == fs::file_not_found )
      return ok;
    if ( fs::is_directory( sf ) )
    {
      if ( !remove_directory( ph ) )
        return error_code(::GetLastError(), system_category);
    }
    else
    {
      if ( !delete_file( ph ) ) return error_code(::GetLastError(), system_category);
    }
    return ok;
  }

  inline bool create_directory( const std::string & dir )
    {  return ::CreateDirectoryA( dir.c_str(), 0 ) != 0; }
         
  template<class String>
  boost::filesystem::detail::query_pair
  create_directory_template( const String & dir_ph )
  {
    error_code error, dummy;
    if ( create_directory( dir_ph ) ) return std::make_pair( error, true );
    error = error_code( ::GetLastError(), system_category );
    
    if ( error.value() == ERROR_ALREADY_EXISTS
      && fs::is_directory( fs::detail::status_api( dir_ph, dummy ) ) )
      return std::make_pair( ok, false );
    return std::make_pair( error, false );
  }

#if _WIN32_WINNT >= 0x500
  inline bool create_hard_link( const std::string & to_ph,
    const std::string & from_ph )
    {  return ::CreateHardLinkA( from_ph.c_str(), to_ph.c_str(), 0 ) != 0; }
#endif
  
#if _WIN32_WINNT >= 0x500
  template<class String>
  error_code
  create_hard_link_template( const String & to_ph,
    const String & from_ph )
  {
    return error_code( create_hard_link( to_ph.c_str(), from_ph.c_str() )
      ? 0 : ::GetLastError(), system_category );
  }
#endif

#else 

  int posix_remove( const char * p )
  {
#     if defined(__QNXNTO__) || (defined(__MSL__) && (defined(macintosh) || defined(__APPLE__) || defined(__APPLE_CC__)))
        
        
        
        
        int err = ::unlink( p );
        if ( err == 0 || errno != EPERM )
          return err;
        return ::rmdir( p );
#     else
        return std::remove( p );
#     endif
  }

#endif
} 

namespace boost
{
  namespace filesystem
  {
    namespace detail
    {
      BOOST_FILESYSTEM_DECL system::error_code throws;



      BOOST_FILESYSTEM_DECL error_code not_found_error()
      {
#     ifdef BOOST_WINDOWS_API
        return error_code(ERROR_PATH_NOT_FOUND, system_category);
#     else
        return error_code(ENOENT, system_category); 
#     endif
      }

      BOOST_FILESYSTEM_DECL bool possible_large_file_size_support()
      {
#   ifdef BOOST_POSIX_API
        struct stat lcl_stat;
        return sizeof( lcl_stat.st_size ) > 4;
#   else
        return true;
#   endif
      }

#   ifdef BOOST_WINDOWS_API

      BOOST_FILESYSTEM_DECL fs::file_status
        status_api( const std::string & ph, error_code & ec )
        { return status_template( ph, ec ); }

#     ifndef BOOST_FILESYSTEM_NARROW_ONLY

      BOOST_FILESYSTEM_DECL fs::file_status
      status_api( const std::wstring & ph, error_code & ec )
        { return status_template( ph, ec ); }

      BOOST_FILESYSTEM_DECL bool symbolic_link_exists_api( const std::wstring & )
        { return false; }

      BOOST_FILESYSTEM_DECL
      fs::detail::query_pair is_empty_api( const std::wstring & ph )
        { return is_empty_template( ph ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::query_pair
      equivalent_api( const std::wstring & ph1, const std::wstring & ph2 )
        { return equivalent_template( ph1, ph2 ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::uintmax_pair file_size_api( const std::wstring & ph )
        { return file_size_template( ph ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::space_pair space_api( const std::wstring & ph )
        { return space_template( ph ); }

      BOOST_FILESYSTEM_DECL
      error_code 
      get_current_path_api( std::wstring & ph )
        { return get_current_path_template( ph ); }

      BOOST_FILESYSTEM_DECL
      error_code 
      set_current_path_api( const std::wstring & ph )
        { return set_current_path_template( ph ); }

      BOOST_FILESYSTEM_DECL error_code
        get_full_path_name_api( const std::wstring & ph, std::wstring & target )
         { return get_full_path_name_template( ph, target ); }

      BOOST_FILESYSTEM_DECL time_pair
        last_write_time_api( const std::wstring & ph )
          { return last_write_time_template( ph ); }
 
      BOOST_FILESYSTEM_DECL error_code
        last_write_time_api( const std::wstring & ph, std::time_t new_value )
          { return last_write_time_template( ph, new_value ); }

      BOOST_FILESYSTEM_DECL fs::detail::query_pair
      create_directory_api( const std::wstring & ph )
        { return create_directory_template( ph ); }

#if _WIN32_WINNT >= 0x500
      BOOST_FILESYSTEM_DECL error_code
      create_hard_link_api( const std::wstring & to_ph,
        const std::wstring & from_ph )
        { return create_hard_link_template( to_ph, from_ph ); }
#endif
      
      BOOST_FILESYSTEM_DECL error_code
      create_symlink_api( const std::wstring & ,
        const std::wstring &  )
        { return error_code( ERROR_NOT_SUPPORTED, system_category ); }

      BOOST_FILESYSTEM_DECL error_code
      remove_api( const std::wstring & ph ) { return remove_template( ph ); }

      BOOST_FILESYSTEM_DECL error_code
      rename_api( const std::wstring & from, const std::wstring & to )
      {
        return error_code( ::MoveFileW( from.c_str(), to.c_str() )
          ? 0 : ::GetLastError(), system_category );
      }

      BOOST_FILESYSTEM_DECL error_code
      copy_file_api( const std::wstring & from, const std::wstring & to )
      {
        return error_code( ::CopyFileW( from.c_str(), to.c_str(), true )
          ? 0 : ::GetLastError(), system_category );
      }

      BOOST_FILESYSTEM_DECL bool create_file_api( const std::wstring & ph,
        std::ios_base::openmode mode ) 
      {
        DWORD access(
          ((mode & std::ios_base::in) == 0 ? 0 : GENERIC_READ)
          | ((mode & std::ios_base::out) == 0 ? 0 : GENERIC_WRITE) );

        DWORD disposition(0); 
        if ( (mode&~std::ios_base::binary)
          == (std::ios_base::out|std::ios_base::app) )
          disposition = OPEN_ALWAYS;
        else if ( (mode&~(std::ios_base::binary|std::ios_base::out))
          == std::ios_base::in ) disposition = OPEN_EXISTING;
        else if ( ((mode&~(std::ios_base::binary|std::ios_base::trunc))
          == std::ios_base::out )
          || ((mode&~std::ios_base::binary)
          == (std::ios_base::in|std::ios_base::out|std::ios_base::trunc)) )
          disposition = CREATE_ALWAYS;
        else assert( 0 && "invalid mode argument" );

        HANDLE handle ( ::CreateFileW( ph.c_str(), access,
          FILE_SHARE_DELETE | FILE_SHARE_READ | FILE_SHARE_WRITE, 0,
          disposition, (mode &std::ios_base::out) != 0
          ? FILE_ATTRIBUTE_ARCHIVE : FILE_ATTRIBUTE_NORMAL, 0 ) );
        if ( handle == INVALID_HANDLE_VALUE ) return false;
        ::CloseHandle( handle );
        return true;
      }

      BOOST_FILESYSTEM_DECL std::string narrow_path_api(
        const std::wstring & ph ) 
      {
        std::string narrow_short_form;
        std::wstring short_form;
        for ( DWORD buf_sz( static_cast<DWORD>( ph.size()+1 ));; )
        {
          boost::scoped_array<wchar_t> buf( new wchar_t[buf_sz] );
          DWORD sz( ::GetShortPathNameW( ph.c_str(), buf.get(), buf_sz ) );
          if ( sz == 0 ) return narrow_short_form;
          if ( sz <= buf_sz )
          {
            short_form += buf.get();
            break;
          }
          buf_sz = sz + 1;
        }
        
        int narrow_sz( ::WideCharToMultiByte( CP_ACP, 0,
          short_form.c_str(), static_cast<int>(short_form.size()), 0, 0, 0, 0 ) );
        boost::scoped_array<char> narrow_buf( new char[narrow_sz] );
        ::WideCharToMultiByte( CP_ACP, 0,
          short_form.c_str(), static_cast<int>(short_form.size()),
          narrow_buf.get(), narrow_sz, 0, 0 );
        narrow_short_form.assign(narrow_buf.get(), narrow_sz);

        return narrow_short_form;
      }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_first( void *& handle, const std::wstring & dir,
        std::wstring & target, file_status & sf, file_status & symlink_sf )
      {
        
        std::wstring dirpath( dir );
        dirpath += (dirpath.empty()
          || dirpath[dirpath.size()-1] != L'\\') ? L"\\*" : L"*";

        WIN32_FIND_DATAW data;
        if ( (handle = ::FindFirstFileW( dirpath.c_str(), &data ))
          == INVALID_HANDLE_VALUE )
        { 
          handle = 0;
          return error_code( ::GetLastError() == ERROR_FILE_NOT_FOUND
            ? 0 : ::GetLastError(), system_category );
        }
        target = data.cFileName;
        if ( data.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
          { sf.type( directory_file ); symlink_sf.type( directory_file ); }
        else { sf.type( regular_file ); symlink_sf.type( regular_file ); }
        return ok;
      }  

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_increment( void *& handle, std::wstring & target,
        file_status & sf, file_status & symlink_sf )
      {
        WIN32_FIND_DATAW data;
        if ( ::FindNextFileW( handle, &data ) == 0 ) 
        {
          int error = ::GetLastError();
          dir_itr_close( handle );
          return error_code( error == ERROR_NO_MORE_FILES ? 0 : error, system_category );
        }
        target = data.cFileName;
        if ( data.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
          { sf.type( directory_file ); symlink_sf.type( directory_file ); }
        else { sf.type( regular_file ); symlink_sf.type( regular_file ); }
        return ok;
      }

#     endif 

      
      BOOST_FILESYSTEM_DECL bool symbolic_link_exists_api( const std::string & )
        { return false; }

      BOOST_FILESYSTEM_DECL
      fs::detail::query_pair is_empty_api( const std::string & ph )
        { return is_empty_template( ph ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::query_pair
      equivalent_api( const std::string & ph1, const std::string & ph2 )
        { return equivalent_template( ph1, ph2 ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::uintmax_pair file_size_api( const std::string & ph )
        { return file_size_template( ph ); }

      BOOST_FILESYSTEM_DECL
      fs::detail::space_pair space_api( const std::string & ph )
        { return space_template( ph ); }

      BOOST_FILESYSTEM_DECL
      error_code 
      get_current_path_api( std::string & ph )
        { return get_current_path_template( ph ); }

      BOOST_FILESYSTEM_DECL
      error_code 
      set_current_path_api( const std::string & ph )
        { return set_current_path_template( ph ); }

      BOOST_FILESYSTEM_DECL error_code
        get_full_path_name_api( const std::string & ph, std::string & target )
         { return get_full_path_name_template( ph, target ); }

      BOOST_FILESYSTEM_DECL time_pair
        last_write_time_api( const std::string & ph )
          { return last_write_time_template( ph ); }
 
      BOOST_FILESYSTEM_DECL error_code
        last_write_time_api( const std::string & ph, std::time_t new_value )
          { return last_write_time_template( ph, new_value ); }

      BOOST_FILESYSTEM_DECL fs::detail::query_pair
      create_directory_api( const std::string & ph )
        { return create_directory_template( ph ); }

#if _WIN32_WINNT >= 0x500
      BOOST_FILESYSTEM_DECL error_code
      create_hard_link_api( const std::string & to_ph,
        const std::string & from_ph )
      { 
        return create_hard_link_template( to_ph, from_ph );
      }
#endif

      BOOST_FILESYSTEM_DECL error_code
      create_symlink_api( const std::string & ,
        const std::string &  )
        { return error_code( ERROR_NOT_SUPPORTED, system_category ); }

      BOOST_FILESYSTEM_DECL error_code
      remove_api( const std::string & ph ) { return remove_template( ph ); }

      BOOST_FILESYSTEM_DECL error_code
      rename_api( const std::string & from, const std::string & to )
      {
        return error_code( ::MoveFileA( from.c_str(), to.c_str() )
          ? 0 : ::GetLastError(), system_category );
      }

      BOOST_FILESYSTEM_DECL error_code
      copy_file_api( const std::string & from, const std::string & to )
      {
        return error_code( ::CopyFileA( from.c_str(), to.c_str(), true )
          ? 0 : ::GetLastError(), system_category );
      }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_first( void *& handle, const std::string & dir,
        std::string & target, file_status & sf, file_status & symlink_sf )
      
      
      
      {
        
        std::string dirpath( dir );
        dirpath += (dirpath.empty()
          || (dirpath[dirpath.size()-1] != '\\'
            && dirpath[dirpath.size()-1] != ':')) ? "\\*" : "*";

        WIN32_FIND_DATAA data;
        if ( (handle = ::FindFirstFileA( dirpath.c_str(), &data ))
          == INVALID_HANDLE_VALUE )
        { 
          handle = 0;
          return error_code( ::GetLastError() == ERROR_FILE_NOT_FOUND
            ? 0 : ::GetLastError(), system_category );
        }
        target = data.cFileName;
        if ( data.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
          { sf.type( directory_file ); symlink_sf.type( directory_file ); }
        else { sf.type( regular_file ); symlink_sf.type( regular_file ); }
        return ok;
      }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_close( void *& handle )
      {
        if ( handle != 0 )
        {
          bool ok = ::FindClose( handle ) != 0;
          handle = 0;
          return error_code( ok ? 0 : ::GetLastError(), system_category );
        }
        return ok;
      }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_increment( void *& handle, std::string & target,
        file_status & sf, file_status & symlink_sf )
      {
        WIN32_FIND_DATAA data;
        if ( ::FindNextFileA( handle, &data ) == 0 ) 
        {
          int error = ::GetLastError();
          dir_itr_close( handle );
          return error_code( error == ERROR_NO_MORE_FILES ? 0 : error, system_category );
        }
        target = data.cFileName;
        if ( data.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
          { sf.type( directory_file ); symlink_sf.type( directory_file ); }
        else { sf.type( regular_file ); symlink_sf.type( regular_file ); }
        return ok;
      }

#   else 

      BOOST_FILESYSTEM_DECL fs::file_status
      status_api( const std::string & ph, error_code & ec )
      {
        struct stat path_stat;
        if ( ::stat( ph.c_str(), &path_stat ) != 0 )
        {
          if ( errno == ENOENT || errno == ENOTDIR )
          {
            ec = ok;
            return fs::file_status( fs::file_not_found );
          }
          ec = error_code( errno, system_category );
          return fs::file_status( fs::status_unknown );
        }
        ec = ok;
        if ( S_ISDIR( path_stat.st_mode ) )
          return fs::file_status( fs::directory_file );
        if ( S_ISREG( path_stat.st_mode ) )
          return fs::file_status( fs::regular_file );
        if ( S_ISBLK( path_stat.st_mode ) )
          return fs::file_status( fs::block_file );
        if ( S_ISCHR( path_stat.st_mode ) )
          return fs::file_status( fs::character_file );
        if ( S_ISFIFO( path_stat.st_mode ) )
          return fs::file_status( fs::fifo_file );
        if ( S_ISSOCK( path_stat.st_mode ) )
          return fs::file_status( fs::socket_file );
        return fs::file_status( fs::type_unknown );
      }

      BOOST_FILESYSTEM_DECL fs::file_status
      symlink_status_api( const std::string & ph, error_code & ec )
      {
        struct stat path_stat;
        if ( ::lstat( ph.c_str(), &path_stat ) != 0 )
        {
          if ( errno == ENOENT || errno == ENOTDIR )
          {
            ec = ok;
            return fs::file_status( fs::file_not_found );
          }
          ec = error_code( errno, system_category );
          return fs::file_status( fs::status_unknown );
        }
        ec = ok;
        if ( S_ISREG( path_stat.st_mode ) )
          return fs::file_status( fs::regular_file );
        if ( S_ISDIR( path_stat.st_mode ) )
          return fs::file_status( fs::directory_file );
        if ( S_ISLNK( path_stat.st_mode ) )
          return fs::file_status( fs::symlink_file );
        if ( S_ISBLK( path_stat.st_mode ) )
          return fs::file_status( fs::block_file );
        if ( S_ISCHR( path_stat.st_mode ) )
          return fs::file_status( fs::character_file );
        if ( S_ISFIFO( path_stat.st_mode ) )
          return fs::file_status( fs::fifo_file );
        if ( S_ISSOCK( path_stat.st_mode ) )
          return fs::file_status( fs::socket_file );
        return fs::file_status( fs::type_unknown );
      }

      
      BOOST_FILESYSTEM_DECL bool
      symbolic_link_exists_api( const std::string & ph )
      {
        struct stat path_stat;
        return ::lstat( ph.c_str(), &path_stat ) == 0
          && S_ISLNK( path_stat.st_mode );
      }

      BOOST_FILESYSTEM_DECL query_pair
      is_empty_api( const std::string & ph )
      {
        struct stat path_stat;
        if ( (::stat( ph.c_str(), &path_stat )) != 0 )
          return std::make_pair( error_code( errno, system_category ), false );        
        return std::make_pair( ok, S_ISDIR( path_stat.st_mode )
          ? is_empty_directory( ph )
          : path_stat.st_size == 0 );
      }

      BOOST_FILESYSTEM_DECL query_pair
      equivalent_api( const std::string & ph1, const std::string & ph2 )
      {
        struct stat s2;
        int e2( ::stat( ph2.c_str(), &s2 ) );
        struct stat s1;
        int e1( ::stat( ph1.c_str(), &s1 ) );
        if ( e1 != 0 || e2 != 0 )
          return std::make_pair( error_code( e1 != 0 && e2 != 0 ? errno : 0, system_category ), false );
        
        return std::make_pair( ok,
            s1.st_dev == s2.st_dev
            && s1.st_ino == s2.st_ino
            
            
            
            && s1.st_size == s2.st_size
            && s1.st_mtime == s2.st_mtime );
      }
 
      BOOST_FILESYSTEM_DECL uintmax_pair
      file_size_api( const std::string & ph )
      {
        struct stat path_stat;
        if ( ::stat( ph.c_str(), &path_stat ) != 0 )
          return std::make_pair( error_code( errno, system_category ), 0 );
        if ( !S_ISREG( path_stat.st_mode ) )
          return std::make_pair( error_code( EPERM, system_category ), 0 ); 
        return std::make_pair( ok,
          static_cast<boost::uintmax_t>(path_stat.st_size) );
      }

      BOOST_FILESYSTEM_DECL space_pair
      space_api( const std::string & ph )
      {
        struct BOOST_STATVFS vfs;
        space_pair result;
        if ( ::BOOST_STATVFS( ph.c_str(), &vfs ) != 0 )
        {
          result.first = error_code( errno, system_category );
          result.second.capacity = result.second.free
            = result.second.available = 0;
        }
        else
        {
          result.first = ok;
          result.second.capacity 
            = static_cast<boost::uintmax_t>(vfs.f_blocks) * BOOST_STATVFS_F_FRSIZE;
          result.second.free 
            = static_cast<boost::uintmax_t>(vfs.f_bfree) * BOOST_STATVFS_F_FRSIZE;
          result.second.available
            = static_cast<boost::uintmax_t>(vfs.f_bavail) * BOOST_STATVFS_F_FRSIZE;
        }
        return result;
      }

      BOOST_FILESYSTEM_DECL time_pair 
      last_write_time_api( const std::string & ph )
      {
        struct stat path_stat;
        if ( ::stat( ph.c_str(), &path_stat ) != 0 )
          return std::make_pair( error_code( errno, system_category ), 0 );
        return std::make_pair( ok, path_stat.st_mtime );
      }

      BOOST_FILESYSTEM_DECL error_code
      last_write_time_api( const std::string & ph, std::time_t new_value )
      {
        struct stat path_stat;
        if ( ::stat( ph.c_str(), &path_stat ) != 0 )
          return error_code( errno, system_category );
        ::utimbuf buf;
        buf.actime = path_stat.st_atime; 
        buf.modtime = new_value;
        return error_code( ::utime( ph.c_str(), &buf ) != 0 ? errno : 0, system_category );
      }

      BOOST_FILESYSTEM_DECL error_code 
      get_current_path_api( std::string & ph )
      {
        for ( long path_max = 32;; path_max *=2 ) 
        {
          boost::scoped_array<char>
            buf( new char[static_cast<std::size_t>(path_max)] );
          if ( ::getcwd( buf.get(), static_cast<std::size_t>(path_max) ) == 0 )
          {
            if ( errno != ERANGE
          
#         if defined(__MSL__) && (defined(macintosh) || defined(__APPLE__) || defined(__APPLE_CC__))
              && errno != 0
#         endif
              ) return error_code( errno, system_category );
          }
          else
          {
            ph = buf.get();
            break;
          }
        }
        return ok;
      }

      BOOST_FILESYSTEM_DECL error_code
      set_current_path_api( const std::string & ph )
      {
        return error_code( ::chdir( ph.c_str() )
          ? errno : 0, system_category );
      }

      BOOST_FILESYSTEM_DECL fs::detail::query_pair
      create_directory_api( const std::string & ph )
      {
        if ( ::mkdir( ph.c_str(), S_IRWXU|S_IRWXG|S_IRWXO ) == 0 )
          { return std::make_pair( ok, true ); }
        int ec=errno;
        error_code dummy;
        if ( ec != EEXIST 
          || !fs::is_directory( status_api( ph, dummy ) ) )
          { return std::make_pair( error_code( ec, system_category ), false ); }
        return std::make_pair( ok, false );
      }

      BOOST_FILESYSTEM_DECL error_code
      create_hard_link_api( const std::string & to_ph,
          const std::string & from_ph )
      {
        return error_code( ::link( to_ph.c_str(), from_ph.c_str() ) == 0
          ? 0 : errno, system_category );
      }

      BOOST_FILESYSTEM_DECL error_code
      create_symlink_api( const std::string & to_ph,
          const std::string & from_ph )
      {
        return error_code( ::symlink( to_ph.c_str(), from_ph.c_str() ) == 0
          ? 0 : errno, system_category ); 
      }

      BOOST_FILESYSTEM_DECL error_code
      remove_api( const std::string & ph )
      {
        if ( posix_remove( ph.c_str() ) == 0 )
          return ok;
        int error = errno;
        
        
        
        if ( error == EEXIST ) error = ENOTEMPTY;

        error_code ec;

        
        return status_api(ph, ec).type() == file_not_found
          ? ok : error_code( error, system_category ) ;
      }

      BOOST_FILESYSTEM_DECL error_code
      rename_api( const std::string & from, const std::string & to )
      {
        
        error_code dummy;
        if ( fs::exists( status_api( to, dummy ) ) ) 
          return error_code( EEXIST, system_category );
        return error_code( std::rename( from.c_str(), to.c_str() ) != 0 
          ? errno : 0, system_category );
      }

      BOOST_FILESYSTEM_DECL error_code
      copy_file_api( const std::string & from_file_ph,
        const std::string & to_file_ph )
      {
        const std::size_t buf_sz = 32768;
        boost::scoped_array<char> buf( new char [buf_sz] );
        int infile=-1, outfile=-1;  
        struct stat from_stat;

        if ( ::stat( from_file_ph.c_str(), &from_stat ) != 0
          || (infile = ::open( from_file_ph.c_str(),
                              O_RDONLY )) < 0
          || (outfile = ::open( to_file_ph.c_str(),
                                O_WRONLY | O_CREAT | O_EXCL,
                                from_stat.st_mode )) < 0 )
        {
          if ( infile >= 0 ) ::close( infile );
          return error_code( errno, system_category );
        }

        ssize_t sz, sz_read=1, sz_write;
        while ( sz_read > 0
          && (sz_read = ::read( infile, buf.get(), buf_sz )) > 0 )
        {
          
          
          sz_write = 0;
          do
          {
            if ( (sz = ::write( outfile, buf.get() + sz_write,
              sz_read - sz_write )) < 0 )
            { 
              sz_read = sz; 
              break;        
            }
            sz_write += sz;
          } while ( sz_write < sz_read );
        }

        if ( ::close( infile) < 0 ) sz_read = -1;
        if ( ::close( outfile) < 0 ) sz_read = -1;

        return error_code( sz_read < 0 ? errno : 0, system_category );
      }

      
      
      error_code path_max( std::size_t & result )
      {
#     ifdef PATH_MAX
        static std::size_t max = PATH_MAX;
#     else
        static std::size_t max = 0;
#     endif
        if ( max == 0 )
        {
          errno = 0;
          long tmp = ::pathconf( "/", _PC_NAME_MAX );
          if ( tmp < 0 )
          {
            if ( errno == 0 ) 
              max = 4096; 
            else return error_code( errno, system_category );
          }
          else max = static_cast<std::size_t>( tmp + 1 ); 
        }
        result = max;
        return ok;
      }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_first( void *& handle, void *& buffer,
        const std::string & dir, std::string & target,
        file_status &, file_status & )
      {
        if ( (handle = ::opendir( dir.c_str() )) == 0 )
          return error_code( errno, system_category );
        target = std::string( "." ); 
                                     
                                     
        std::size_t path_size;
        error_code ec = path_max( path_size );
        if ( ec ) return ec;
        dirent de;
        buffer = std::malloc( (sizeof(dirent) - sizeof(de.d_name))
          +  path_size + 1 ); 
        return ok;
      }  

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_close( void *& handle, void*& buffer )
      {
        std::free( buffer );
        buffer = 0;
        if ( handle == 0 ) return ok;
        DIR * h( static_cast<DIR*>(handle) );
        handle = 0;
        return error_code( ::closedir( h ) == 0 ? 0 : errno, system_category );
      }

      
      inline int readdir_r_simulator( DIR * dirp, struct dirent * entry,
        struct dirent ** result ) 
        {
          errno = 0;

    #     if !defined(__CYGWIN__) \
          && defined(_POSIX_THREAD_SAFE_FUNCTIONS) \
          && defined(_SC_THREAD_SAFE_FUNCTIONS) \
          && (_POSIX_THREAD_SAFE_FUNCTIONS+0 >= 0) \
          && (!defined(__hpux) || (defined(__hpux) && defined(_REENTRANT)))
          if ( ::sysconf( _SC_THREAD_SAFE_FUNCTIONS ) >= 0 )
            { return ::readdir_r( dirp, entry, result ); }
    #     endif

          struct dirent * p;
          *result = 0;
          if ( (p = ::readdir( dirp )) == 0 )
            return errno;
          std::strcpy( entry->d_name, p->d_name );
          *result = entry;
          return 0;
        }

      BOOST_FILESYSTEM_DECL error_code
      dir_itr_increment( void *& handle, void *& buffer,
        std::string & target, file_status & sf, file_status & symlink_sf )
      {
        BOOST_ASSERT( buffer != 0 );
        dirent * entry( static_cast<dirent *>(buffer) );
        dirent * result;
        int return_code;
        if ( (return_code = readdir_r_simulator( static_cast<DIR*>(handle),
          entry, &result )) != 0 ) return error_code( errno, system_category );
        if ( result == 0 ) return dir_itr_close( handle, buffer );
        target = entry->d_name;
#     ifdef BOOST_FILESYSTEM_STATUS_CACHE
        if ( entry->d_type == DT_UNKNOWN )  
        {
          sf = symlink_sf = fs::file_status(fs::status_unknown);
        }
        else  
        {
          if ( entry->d_type == DT_DIR )
            sf = symlink_sf = fs::file_status( fs::directory_file );
          else if ( entry->d_type == DT_REG )
            sf = symlink_sf = fs::file_status( fs::regular_file );
          else if ( entry->d_type == DT_LNK )
          {
            sf = fs::file_status( fs::status_unknown );
            symlink_sf = fs::file_status( fs::symlink_file );
          }
          else sf = symlink_sf = fs::file_status( fs::status_unknown );
        }
#     else
        sf = symlink_sf = fs::file_status( fs::status_unknown );
#     endif
        return ok;
      }

#   endif
    } 
  } 
} 
