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
#include "ZipUtils.h"
#include <memory>
#include "atlsafe.h"

#define WRITEBUFFERSIZE 8192
#define READBUFFERSIZE 8192

namespace ZLibZipUtils
{
  AVSOfficeCriticalSection  criticalSection;

   

  static void change_file_date( const char *filename, uLong dosdate, tm_unz tmu_date );
  static int mymkdir( const char* dirname );
  static int makedir( const char *newdir );
  static int do_extract_currentfile( unzFile uf, const int* popt_extract_without_path, int* popt_overwrite, const char* password );
  static int do_extract( unzFile uf, int opt_extract_without_path, int opt_overwrite, const char* password, const ProgressCallback* progress );
  
  static bool is_file_in_archive(unzFile uf, const wchar_t *filename);
  static bool current_file_is_find(unzFile uf, const wchar_t *filename);
  static bool get_file_in_archive(unzFile uf, const wchar_t *filePathInZip, BYTE** fileInBytes );
  static bool get_file(unzFile uf, BYTE** fileInBytes );

  static unsigned int get_files_count( const WCHAR* dirname );

  

  
  static void change_file_date( const char *filename, uLong dosdate, tm_unz tmu_date )
  {
    HANDLE hFile;
    FILETIME ftm,ftLocal,ftCreate,ftLastAcc,ftLastWrite;

    hFile = CreateFileA(filename,GENERIC_READ | GENERIC_WRITE,
                        0,NULL,OPEN_EXISTING,0,NULL);
    GetFileTime(hFile,&ftCreate,&ftLastAcc,&ftLastWrite);
    DosDateTimeToFileTime((WORD)(dosdate>>16),(WORD)dosdate,&ftLocal);
    LocalFileTimeToFileTime(&ftLocal,&ftm);
    SetFileTime(hFile,&ftm,&ftLastAcc,&ftm);
    CloseHandle(hFile);
  }

  

  

  static int mymkdir( const char* dirname )
  {
    int ret=0;

    ret = _mkdir(dirname);

    return ret;
  }

  

  static int makedir( const char *newdir )
  {
    char *buffer ;
    char *p;
    int  len = (int)strlen(newdir);

    if (len <= 0)
      return 0;

    buffer = (char*)malloc(len+1);
    strcpy_s(buffer, (len+1), newdir);

    if (buffer[len-1] == '/') {
      buffer[len-1] = '\0';
    }
    if (mymkdir(buffer) == 0)
    {
      free(buffer);
      return 1;
    }

    p = buffer+1;
    while (1)
    {
      char hold;

      while(*p && *p != '\\' && *p != '/')
        p++;
      hold = *p;
      *p = 0;
      if ((mymkdir(buffer) == -1) && (errno == ENOENT))
      {
        free(buffer);
        return 0;
      }
      if (hold == 0)
        break;
      *p++ = hold;
    }
    free(buffer);
    return 1;
  }

  

  static int do_extract_currentfile( unzFile uf, const int* popt_extract_without_path, int* popt_overwrite, const char* password )
  {   	  
	char filename_inzip[256];
    char* filename_withoutpath;
    char* p;
    int err=UNZ_OK;
    FILE *fout=NULL;
    void* buf;
    uInt size_buf;

    unz_file_info file_info;
    uLong ratio=0;
    err = unzGetCurrentFileInfo(uf,&file_info,filename_inzip,sizeof(filename_inzip),NULL,0,NULL,0);

  #ifdef CODEPAGE_ISSUE_FIX
  {
	UniversalString us( filename_inzip, CP_OEMCP );
	us = UniversalString( (wchar_t*)us );

	memset( filename_inzip, 0, ( 256 * sizeof(char) ) );
	strcpy_s( filename_inzip, 256, (char*)us );
  }
  #endif 

    if (err!=UNZ_OK)
    {
      return err;
    }

    size_buf = WRITEBUFFERSIZE;
    buf = (void*)malloc(size_buf);
    if (buf==NULL)
    {
      return UNZ_INTERNALERROR;
    }

    p = filename_withoutpath = filename_inzip;
    while ((*p) != '\0')
    {
      if (((*p)=='/') || ((*p)=='\\'))
        filename_withoutpath = p+1;
      p++;
    }

    if ((*filename_withoutpath)=='\0')
    {
      if ((*popt_extract_without_path)==0)
      {
        mymkdir(filename_inzip);
      }
    }
    else
    {
      const char* write_filename;
      int skip=0;

      if ((*popt_extract_without_path)==0)
        write_filename = filename_inzip;
      else
        write_filename = filename_withoutpath;

      err = unzOpenCurrentFilePassword(uf,password);
      if (((*popt_overwrite)==0) && (err==UNZ_OK))
      {
        char rep=0;
        FILE* ftestexist = NULL;
        fopen_s(&ftestexist, write_filename, "rb");
        if (ftestexist!=NULL)
        {
          fclose(ftestexist);
        }

        if (rep == 'N')
          skip = 1;

        if (rep == 'A')
          *popt_overwrite=1;
      }

      if ((skip==0) && (err==UNZ_OK))
      {
        fopen_s(&fout, write_filename, "wb");

        
        if ((fout==NULL) && ((*popt_extract_without_path)==0) &&
		    (filename_withoutpath!=(char*)filename_inzip))
        {
          char c=*(filename_withoutpath-1);
          *(filename_withoutpath-1)='\0';
          makedir(write_filename);
          *(filename_withoutpath-1)=c;
          fopen_s(&fout, write_filename, "wb");
        }
      }

      if (fout!=NULL)
      {
        do
        {
          err = unzReadCurrentFile(uf, buf, size_buf);
          if (err<0)
          {
            break;
          }
          if (err>0)
            if (fwrite(buf,err,1,fout)!=1)
            {			  
              err=UNZ_ERRNO;
              break;
            }
        }
        while (err>0);
        if (fout)
          fclose(fout);

        if (err==0)
          change_file_date(write_filename,file_info.dosDate,
                           file_info.tmu_date);
      }

      if (err==UNZ_OK)
      {
        err = unzCloseCurrentFile (uf);
      }
      else
        unzCloseCurrentFile(uf); 
    }

    free(buf);
    return err;
  }

  

  static int do_extract( unzFile uf, int opt_extract_without_path, int opt_overwrite, const char* password, const ProgressCallback* progress )
  {
    uLong i;
    unz_global_info gi;
    int err;
    FILE* fout=NULL;

    err = unzGetGlobalInfo (uf,&gi);

    for (i=0;i<gi.number_entry;i++)
    {		
	  if (do_extract_currentfile(uf,&opt_extract_without_path,
                                 &opt_overwrite,
                                 password) != UNZ_OK)
      break;

	  if ( progress != NULL )
	  {
	    short cancel = 0;
	    long progressValue = ( 1000000 / gi.number_entry * i );
	  
	    progress->OnProgress( progress->caller, UTILS_ONPROGRESSEVENT_ID, progressValue, &cancel );

	    if ( cancel != 0 )
	    {
	      return err;
	    }
	  }

      if ((i+1)<gi.number_entry)
      {
        err = unzGoToNextFile(uf);
        if (err!=UNZ_OK)
        {
          break;
        }
      }
    }

	if ( progress != NULL )
	{
	  short cancel = 0;
	  long progressValue = 1000000;
	  
	  progress->OnProgress( progress->caller, UTILS_ONPROGRESSEVENT_ID, progressValue, &cancel );
	}

	return 0;
  }

  

  static bool is_file_in_archive(unzFile uf, const wchar_t *filename)
  {
	  uLong i;
	  unz_global_info gi;
	  int err;

	  err = unzGetGlobalInfo (uf,&gi);

	  for (i = 0; i < gi.number_entry; i++)
	  {
		  if (current_file_is_find(uf, filename) == true)
			  return true;

		  if ((i + 1) < gi.number_entry)
		  {
			  err = unzGoToNextFile(uf);
			  if (err != UNZ_OK)
				  break;
		  }
	  }
	  return false;
  }
  
  

  static bool current_file_is_find(unzFile uf, const wchar_t *filename)
  {
	  char filename_inzip[256]; 
	  int err = UNZ_OK;

	  unz_file_info file_info;

	  err = unzGetCurrentFileInfo(uf, &file_info, filename_inzip, sizeof(filename_inzip), NULL, 0, NULL, 0);

	  UniversalString us( filename_inzip, CP_OEMCP );
	  us = UniversalString( (wchar_t*)us );
	  UniversalString findFile( filename, CP_OEMCP );

	  if (us == findFile)
		  return true;
	  return false;
  }

  

	static const _bstr_t get_filename_from_unzfile(unzFile unzip_file_handle)
	{
		static char filename_OEM[MAX_PATH]; 
		static wchar_t filename_ANSI[MAX_PATH]; 

		if (UNZ_OK == unzGetCurrentFileInfo(unzip_file_handle, NULL, filename_OEM, sizeof(filename_OEM), NULL, 0, NULL, 0))
		{
			OemToChar(filename_OEM, filename_ANSI);
			return _bstr_t(filename_ANSI);
		}
		return _bstr_t(L"");
	}

  

  static bool get_file_in_archive(unzFile uf, const wchar_t *filePathInZip, BYTE** fileInBytes)
  {
	  unz_global_info gi;
	  int err;

	  err = unzGetGlobalInfo (uf,&gi);

	  for (uLong i = 0; i < gi.number_entry; i++)
	  {		
		  if (current_file_is_find(uf, filePathInZip) == true)
		  {
			  get_file(uf, fileInBytes);
			  return true;
		  }

		  if ((i + 1) < gi.number_entry)
		  {
			  err = unzGoToNextFile(uf);
			  if (err != UNZ_OK)
				  break;
		  }
	  }
	  return false;
  }

  
  
  static bool get_file(unzFile uf, BYTE** fileInBytes)
  {	  
	  int err = UNZ_OK;	  
	  uInt size_buf = WRITEBUFFERSIZE;
	  bool flag = false;
	  void* buf;

	  buf = (void*)malloc(size_buf);

	  err = unzOpenCurrentFilePassword(uf, NULL);
	  err = unzReadCurrentFile(uf, buf, size_buf);

	  if (err > 0)
	  {		 
		  *fileInBytes = (BYTE*)::HeapAlloc(GetProcessHeap(), NULL, err);
		  memcpy(*fileInBytes, static_cast<BYTE*>(buf), err);		  
		  flag = true;
	  }

	  if (err == UNZ_OK)
		  err = unzCloseCurrentFile (uf);
	  else
		  unzCloseCurrentFile(uf); 

	  free(buf);
	  return flag; 
  }

  

	static bool get_file(unzFile unzip_file_handle, SAFEARRAY* arr, uInt array_size)
	{	  
		if(UNZ_OK == unzOpenCurrentFile(unzip_file_handle))
		{
			int data_read_size = unzReadCurrentFile(unzip_file_handle, arr->pvData, array_size);
			
			unzCloseCurrentFile(unzip_file_handle);
			return data_read_size == array_size ? true : false;
		}
		return false;
	}

  

  int ZipDir( const WCHAR* dir, const WCHAR* outputFile, const ProgressCallback* progress, int compressionLevel )
  {
    criticalSection.Enter();
	  
	int err = -1;

    if ( ( dir != NULL ) && ( outputFile != NULL ) )
    {
      WIN32_FIND_DATA ffd;
      HANDLE hFind = INVALID_HANDLE_VALUE;
	
      BOOL bNextFile = FALSE;

      deque<wstring> StringDeque;
      deque<wstring> zipDeque;
      StringDeque.push_back( wstring( dir ) );
  
      wstring zipDir;
      wstring file;
      wstring zipFileName;
      wstring szText;
      wstring szCurText;

      zipFile zf = zipOpen( UniversalString( outputFile ), APPEND_STATUS_CREATE );

      zip_fileinfo zi;

      zi.tmz_date.tm_sec = zi.tmz_date.tm_min = zi.tmz_date.tm_hour =
      zi.tmz_date.tm_mday = zi.tmz_date.tm_mon = zi.tmz_date.tm_year = 0;
      zi.dosDate = 0;
      zi.internal_fa = 0;
      zi.external_fa = 0;

      SYSTEMTIME currTime;

      GetLocalTime( &currTime );

      zi.tmz_date.tm_sec = currTime.wSecond;
      zi.tmz_date.tm_min = currTime.wMinute;
      zi.tmz_date.tm_hour = currTime.wHour;
      zi.tmz_date.tm_mday = currTime.wDay;
      zi.tmz_date.tm_mon = currTime.wMonth;
      zi.tmz_date.tm_year = currTime.wYear;

	  unsigned int filesCount = get_files_count( dir );
	  unsigned int currentFileIndex = 0;
	
      while ( ( !StringDeque.empty() ) || ( bNextFile ) )
      {
        if ( ( !bNextFile ) && ( !StringDeque.empty() ) )
	    {
	      szText = StringDeque.front() + wstring( _T( "\\" ) );
	      szCurText = szText + wstring( _T( "*" ) );

	      if ( hFind != INVALID_HANDLE_VALUE )
	      {
	        FindClose( hFind );

		    zipDir = zipDeque.front() + wstring( _T( "/" ) );

		    zipDeque.pop_front();
	      }
	  
	      StringDeque.pop_front();
			
	      hFind = FindFirstFile( szCurText.c_str(), &ffd );
	    }
		
	    if ( ffd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
	    {
	      if ( ( wcscmp( ffd.cFileName, _T( "." ) ) != 0 ) && ( wcscmp( ffd.cFileName, _T( ".." ) ) != 0 ) )
	      {
	        StringDeque.push_back( szText + wstring( ffd.cFileName ) );
	        zipDeque.push_back( zipDir + wstring( ffd.cFileName ) );
	      }
	    }
	    else
	    {
	      file = szText + wstring( ffd.cFileName );
          zipFileName = zipDir + wstring( ffd.cFileName );

	      string xstr;
          ifstream xfile( file.c_str(), ios::binary );

          
          xfile.seekg( 0, ios_base::end );
          xstr.resize( xfile.tellg() );
          xfile.seekg( 0, ios_base::beg );

          
          xfile.read( const_cast<char*>( xstr.data() ), (streamsize)xstr.size() );
		
	      err = zipOpenNewFileInZip( zf, UniversalString( zipFileName.c_str(), CP_OEMCP ), &zi, NULL, 0, NULL, 0, NULL, Z_DEFLATED, compressionLevel );
	      err = zipWriteInFileInZip( zf, xstr.data(), (unsigned int)xstr.size() );
	      err = zipCloseFileInZip( zf );

	      xfile.close();

		  if ( progress != NULL )
	      {
	        short cancel = 0;
	        long progressValue = ( 1000000 / filesCount * currentFileIndex );
	  
	        progress->OnProgress( progress->caller, UTILS_ONPROGRESSEVENT_ID, progressValue, &cancel );

	        if ( cancel != 0 )
	        {
	          FindClose( hFind );

			  err = zipClose( zf, NULL );

			  return err;
	        }
	      }

		  currentFileIndex++;
	    }
		
	    bNextFile = FindNextFile( hFind, &ffd );
      }
	
      FindClose( hFind );

      err = zipClose( zf, NULL );

	  if ( progress != NULL )
	  {
	    short cancel = 0;
	    long progressValue = 1000000;
	  
	    progress->OnProgress( progress->caller, UTILS_ONPROGRESSEVENT_ID, progressValue, &cancel );
	  }
	}

    criticalSection.Leave();

    return err;
  }

  

  int ZipFile( const WCHAR* inputFile, const WCHAR* outputFile, int compressionLevel )
  {
    criticalSection.Enter();
	  
	int err = -1;

    if ( ( inputFile != NULL ) && ( outputFile != NULL ) )
    {
      string istr;
      ifstream ifile( inputFile, std::ios::binary );

      
      ifile.seekg( 0, ios_base::end );
      istr.resize( ifile.tellg() );
      ifile.seekg( 0, ios_base::beg );

      
      ifile.read( const_cast<char*>( istr.data() ), (streamsize)istr.size() );

      ifile.close();

      zipFile zf = zipOpen( UniversalString( outputFile ), APPEND_STATUS_CREATE );

      zip_fileinfo zi;

      zi.tmz_date.tm_sec = zi.tmz_date.tm_min = zi.tmz_date.tm_hour =
      zi.tmz_date.tm_mday = zi.tmz_date.tm_mon = zi.tmz_date.tm_year = 0;
      zi.dosDate = 0;
      zi.internal_fa = 0;
      zi.external_fa = 0;

      SYSTEMTIME currTime;

      GetLocalTime( &currTime );

      zi.tmz_date.tm_sec = currTime.wSecond;
      zi.tmz_date.tm_min = currTime.wMinute;
      zi.tmz_date.tm_hour = currTime.wHour;
      zi.tmz_date.tm_mday = currTime.wDay;
      zi.tmz_date.tm_mon = currTime.wMonth;
      zi.tmz_date.tm_year = currTime.wYear;

      wstring inputFileName( inputFile );

      wstring::size_type pos = 0;
      static const wstring::size_type npos = -1;

      pos = inputFileName.find_last_of( _T( '\\' ) );

      wstring zipFileName;

      if ( pos != npos )
      {
        zipFileName = wstring( ( inputFileName.begin() + pos + 1 ), inputFileName.end() );
      }
      else
      {
        zipFileName = wstring( inputFileName.begin(), inputFileName.end() );
      }
  
      err = zipOpenNewFileInZip( zf, UniversalString( zipFileName.c_str(), CP_OEMCP ), &zi, NULL, 0, NULL, 0, NULL, Z_DEFLATED, compressionLevel );
      err = zipWriteInFileInZip( zf, istr.data(), (unsigned int)istr.size() );
      err = zipCloseFileInZip( zf );
      err = zipClose( zf, NULL );
	}

	criticalSection.Leave();

    return false;
  }

  

  bool ClearDirectory( const WCHAR* dir, bool delDir )
  {
    criticalSection.Enter();

	bool result = false;
	  
	if ( dir != NULL )
    {
      unsigned int size = (unsigned int)wcslen( dir );
	  WCHAR* _dir = new WCHAR[size + 2];
	  wcsncpy_s( _dir, size + 2, dir, size );
      _dir[size++] = L'\0';
      _dir[size] = L'\0';

	  SHFILEOPSTRUCT lpFileOp;

      lpFileOp.hwnd = NULL;
      lpFileOp.wFunc = FO_DELETE;
      lpFileOp.pFrom = _dir;
      lpFileOp.pTo = NULL;
      lpFileOp.fFlags = FOF_NOERRORUI | FOF_NOCONFIRMATION | FOF_SILENT;
      lpFileOp.fAnyOperationsAborted = FALSE;
      lpFileOp.hNameMappings = NULL;
      lpFileOp.lpszProgressTitle = NULL;
    
	  int err = SHFileOperation( &lpFileOp );

      if ( !delDir )
      {
        CreateDirectory( dir, NULL );
      }

	  if ( _dir != NULL )
	  {
	    delete []_dir;
	    _dir = NULL;
	  }

	  result = true;
    }
    else
    {
      result = false;
    }

	criticalSection.Leave();

	return result;
  }

  

  int UnzipToDir( const WCHAR* zipFile, const WCHAR* unzipDir, const ProgressCallback* progress, const WCHAR* password, bool opt_extract_without_path, bool clearOutputDirectory )
  {
    criticalSection.Enter();
	
    unzFile uf = NULL;

    int err = -1;

    if ( ( zipFile != NULL ) && ( unzipDir != NULL ) )
    {
	  uf = unzOpen (zipFile);
    }

    if ( uf != NULL )
    {
      if ( clearOutputDirectory )
	  {
	    ClearDirectory( unzipDir );
	  }
	
	  char* buffer = NULL;

	  buffer = _getcwd( NULL, 0 );
	  	  
	  err = _wchdir (unzipDir);
  
      if ( err == 0 )
	  {
	    err = do_extract( uf, opt_extract_without_path, 1, UniversalString( password ), progress );
	  }

      if ( err == UNZ_OK )
	  {
	    err = unzClose( uf );
	  }

	  if ( buffer != NULL )
	  {
	    err = _chdir( UniversalString( buffer ) );

	    free( buffer );
	    buffer = NULL;
	  }
    }

    criticalSection.Leave();

    return err;
  }
  
  
  
  int UncompressBytes( BYTE* destBuf, ULONG* destSize, const BYTE* sourceBuf, ULONG sourceSize )
  {
    criticalSection.Enter();
	  
	int err = -1;

	err = uncompress( destBuf, destSize, sourceBuf, sourceSize );

	criticalSection.Leave();
	
	return err;
  }

  

  int CompressBytes( BYTE* destBuf, ULONG* destSize, const BYTE* sourceBuf, ULONG sourceSize, SHORT level )
  {
    criticalSection.Enter();
	  
	int err = -1;

	err = compress2( destBuf, destSize, sourceBuf, sourceSize, level );

	criticalSection.Leave();

	return err;
  }

  

	bool IsArchive(const WCHAR* filename)
	{
		criticalSection.Enter();

	  unzFile uf = NULL;
	  bool isZIP = false;

	  if (( filename != NULL ))
		  uf = unzOpen( UniversalString( filename ) );

	  if ( uf != NULL )
	  {
		  isZIP = true;
		  unzClose( uf );
	  }

	  criticalSection.Leave();

	  return isZIP;
	}

	

  bool IsFileExistInArchive(const WCHAR* zipFile, const WCHAR* filePathInZip)
  {
	  criticalSection.Enter();

	  unzFile uf = NULL;
	  bool isIn = false;

	  if ( ( zipFile != NULL ) && ( filePathInZip != NULL ) )
		  uf = unzOpen( UniversalString( zipFile ) );
	  if ( uf != NULL )
	  {		  
		  isIn = is_file_in_archive( uf, filePathInZip );
		  unzClose( uf );
	  }	 

	  criticalSection.Leave();
	  return isIn;
  }



  bool LoadFileFromArchive(const WCHAR* zipFile, const WCHAR* filePathInZip, BYTE** fileInBytes)
  {
	  criticalSection.Enter();

	  unzFile uf = NULL;
	  bool isIn = false;

	  if ( ( zipFile != NULL ) && ( filePathInZip != NULL ) )
		  uf = unzOpen( UniversalString( zipFile ) );

	  if ( uf != NULL )
	  {		  
		  isIn = get_file_in_archive( uf, filePathInZip, fileInBytes);
		  unzClose( uf );
	  }
	  
	  criticalSection.Leave();
	  return isIn;
  }



	bool ExtractFiles(const _bstr_t zip_file_path, ExtractedFileCallback& callback)
	{
		CSLocker locker(criticalSection);

		unzFile unzip_file_handle = unzOpen(static_cast<wchar_t*>(zip_file_path));
		if ( unzip_file_handle != NULL )
		{		  
			do 
			{
				unz_file_info file_info;
				unzGetCurrentFileInfo(unzip_file_handle, &file_info, NULL, 0, NULL, 0, NULL, 0);

				CComSafeArray<BYTE> arr(file_info.uncompressed_size);
				if(file_info.uncompressed_size == 0 || get_file(unzip_file_handle, arr.m_psa, file_info.uncompressed_size))
				{
					callback.Invoke(get_filename_from_unzfile(unzip_file_handle), arr.GetSafeArrayPtr());
				}
				
			} while (UNZ_OK == unzGoToNextFile(unzip_file_handle));
					
			unzClose( unzip_file_handle );
			return true;
		}
		return false;
	}

	

	bool CompressFiles(_bstr_t zip_file_path, RequestFileCallback& callback, int compression_level)
	{
		CSLocker locker(criticalSection);

		zipFile zip_file_handle = zipOpen(zip_file_path, APPEND_STATUS_CREATE);

		if(NULL != zip_file_handle)
		{
			zip_fileinfo zi = {0};
			SYSTEMTIME currTime;
			GetLocalTime( &currTime );
			zi.tmz_date.tm_sec = currTime.wSecond;
			zi.tmz_date.tm_min = currTime.wMinute;
			zi.tmz_date.tm_hour = currTime.wHour;
			zi.tmz_date.tm_mday = currTime.wDay;
			zi.tmz_date.tm_mon = currTime.wMonth;
			zi.tmz_date.tm_year = currTime.wYear;

			SAFEARRAY* arr;
			BSTR in_zip_filename;
			while(callback.Invoke(&in_zip_filename, &arr))
			{
				_bstr_t in_zip_filename_wrapper(in_zip_filename, false); 
				CComSafeArray<BYTE> arr_wrapper;
				arr_wrapper.Attach(arr); 

				static char in_zip_filename_OEM[MAX_PATH];
				CharToOemW(static_cast<wchar_t*>(in_zip_filename_wrapper), in_zip_filename_OEM);

				if (ZIP_OK != zipOpenNewFileInZip( zip_file_handle, in_zip_filename_OEM, &zi, NULL, 0, NULL, 0, NULL, Z_DEFLATED, compression_level ) ||
					ZIP_OK != zipWriteInFileInZip(zip_file_handle, arr_wrapper.m_psa->pvData, arr_wrapper.GetCount()) ||
					ZIP_OK != zipCloseFileInZip(zip_file_handle))
				{
					zipClose(zip_file_handle, NULL);
					return false;
				}
			}
			zipClose(zip_file_handle, NULL);

			return true;
		}
		return false;
	}

	

	static unsigned int get_files_count( const WCHAR* dirname )
	{
	  unsigned int filescount = 0;

      if ( dirname != NULL )
      {
        WIN32_FIND_DATA ffd;
        HANDLE hFind = INVALID_HANDLE_VALUE;
	
        BOOL bNextFile = FALSE;

        deque<wstring> StringDeque;
        StringDeque.push_back( dirname );
  
        wstring file;
        wstring szText;
        wstring szCurText;

        while ( ( !StringDeque.empty() ) || ( bNextFile ) )
        {
          if ( ( !bNextFile ) && ( !StringDeque.empty() ) )
	      {
	        szText = StringDeque.front() + wstring( _T( "\\" ) );
	        szCurText = szText + wstring( _T( "*" ) );

	        if ( hFind != INVALID_HANDLE_VALUE )
	        {
	          FindClose( hFind );
	        }
	  
	        StringDeque.pop_front();
			
	        hFind = FindFirstFile( szCurText.c_str(), &ffd );
	      }
		
	      if ( ffd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
	      {
	        if ( ( wcscmp( ffd.cFileName, _T( "." ) ) != 0 ) && ( wcscmp( ffd.cFileName, _T( ".." ) ) != 0 ) )
	        {
	          StringDeque.push_back( szText + wstring( ffd.cFileName ) );
	        }
	      }
	      else
	      {
            filescount++;
	      }
		
	      bNextFile = FindNextFile( hFind, &ffd );
        }
	
        FindClose( hFind );
	  }

      return filescount;
	}
}