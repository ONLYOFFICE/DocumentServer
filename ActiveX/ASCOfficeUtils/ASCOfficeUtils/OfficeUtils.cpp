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
#include "OfficeUtils.h"


STDMETHODIMP COfficeUtils::ExtractToDirectory(BSTR zipFile, BSTR unzipDir, BSTR password, SHORT extract_without_path)
{
  ProgressCallback progress;
  progress.OnProgress = OnProgressFunc;
  progress.caller = this;
	
  if( ZLibZipUtils::UnzipToDir( zipFile, unzipDir, &progress, password, ( extract_without_path > 0 ) ? (true) : (false) ) == 0 )
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;
  }
}



STDMETHODIMP COfficeUtils::CompressFileOrDirectory(BSTR name, BSTR outputFile, SHORT level)
{
  WIN32_FIND_DATA ffd;
  HANDLE hFind = INVALID_HANDLE_VALUE;
  HRESULT result = S_FALSE;

  hFind = FindFirstFile( name, &ffd );
  
  if ( hFind == INVALID_HANDLE_VALUE )
  {
    return result;
  }

  if ( ffd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
  {
    ProgressCallback progress;
    progress.OnProgress = OnProgressFunc;
    progress.caller = this;
	  
	if ( ZLibZipUtils::ZipDir( name, outputFile, &progress, level ) == 0 )
    {
      result = S_OK;
    }
    else
    {
      result = S_FALSE;
    }
  }
  else
  {
	if ( ZLibZipUtils::ZipFile( name, outputFile, level ) == 0 )
    {
      result = S_OK;
    }
    else
    {
      result = S_FALSE;
    } 
  }

  FindClose( hFind );

  return result;
}



STDMETHODIMP COfficeUtils::Uncompress(BYTE* destBuf, ULONG* destSize, BYTE* sourceBuf, ULONG sourceSize)
{
  if ( ZLibZipUtils::UncompressBytes( destBuf, destSize, sourceBuf, sourceSize ) == Z_OK )
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;  
  }
}



STDMETHODIMP COfficeUtils::Compress(BYTE* destBuf, ULONG* destSize, BYTE* sourceBuf, ULONG sourceSize, SHORT level)
{
  if ( ZLibZipUtils::CompressBytes( destBuf, destSize, sourceBuf, sourceSize, level ) == Z_OK )
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;  
  }
}



STDMETHODIMP COfficeUtils::IsArchive(BSTR filename)
{
  if( ZLibZipUtils::IsArchive(filename) )
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;
  }
}



STDMETHODIMP COfficeUtils::IsFileExistInArchive(BSTR zipFile, BSTR filePath)
{
  if( ZLibZipUtils::IsFileExistInArchive( zipFile, filePath) )
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;
  }
}



STDMETHODIMP COfficeUtils::LoadFileFromArchive(BSTR zipFile, BSTR filePath, BYTE** fileInBytes)
{
  if( ZLibZipUtils::LoadFileFromArchive( zipFile, filePath, fileInBytes))
  {
    return S_OK;
  }
  else
  {
    return S_FALSE;
  }
}



STDMETHODIMP COfficeUtils::ExtractFilesToMemory(BSTR zipFile, IExtractedFileEvent* data_receiver, VARIANT_BOOL* result)
{
	*result = ZLibZipUtils::ExtractFiles(_bstr_t(zipFile), ExtractedFileCallback (data_receiver)) ? VARIANT_TRUE : VARIANT_FALSE;
	return S_OK;
}



STDMETHODIMP COfficeUtils::CompressFilesFromMemory(BSTR zipFile, IRequestFileEvent* data_source, SHORT compression_level, VARIANT_BOOL* result)
{
	*result = ZLibZipUtils::CompressFiles(_bstr_t(zipFile), RequestFileCallback (data_source), compression_level) ? VARIANT_TRUE : VARIANT_FALSE;
	return S_OK;
}



void COfficeUtils::OnProgressFunc( LPVOID lpParam, long nID, long nPercent, short* Cancel )
{
  COfficeUtils* pOfficeUtils = reinterpret_cast<COfficeUtils*>( lpParam );

  if ( pOfficeUtils != NULL )
  {
    pOfficeUtils->OnProgress( nID, nPercent, Cancel );
  }
}
