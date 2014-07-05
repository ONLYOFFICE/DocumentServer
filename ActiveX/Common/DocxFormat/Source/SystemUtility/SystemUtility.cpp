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
 #include "SystemUtility.h"

#include <windows.h>

#include "FileSystem/FileSystem.h"




namespace OOX
{
    CPath::CPath() : m_strFilename(L"") 
    {
    }
    CPath::CPath(const CString& sName, bool bIsNorm) : m_strFilename(sName)
    {
		if (bIsNorm)
			Normalize();
    }
    CPath::CPath(LPCSTR& sName, bool bIsNorm) : m_strFilename(sName)
    {
		if (bIsNorm)
			Normalize();
    }
    CPath::CPath(LPCWSTR& sName, bool bIsNorm) : m_strFilename(sName)
    {
		if (bIsNorm)
			Normalize();
    }

    CPath::CPath(const CPath& oSrc)
    {
        *this = oSrc;
		
		
    }

    CPath& CPath::operator=(const CPath& oSrc)
    {
        m_strFilename = oSrc.m_strFilename;
		
		
        return *this;
    }
	CPath& CPath::operator=(const CString& oSrc)
    {
        m_strFilename = oSrc;
		Normalize();
        return *this;
    }

	AVSINLINE CString CPath::GetExtention(bool bIsPoint) const
    {
        int nFind = m_strFilename.ReverseFind('.');
        if (-1 == nFind)
            return _T("");

        if (!bIsPoint)
            ++nFind;

        return m_strFilename.Mid(nFind);
    }
    AVSINLINE CString CPath::GetDirectory(bool bIsSlash) const
    {
        int nPos = m_strFilename.ReverseFind('\\');
        if (-1 == nPos)
        {
            return m_strFilename;
        }
        else
        {
            if (bIsSlash)
                ++nPos;
            return m_strFilename.Mid(0, nPos);
        }
    }
    AVSINLINE CString CPath::GetPath() const
    {
        return m_strFilename;
    }
}

namespace OOX
{
    bool CSystemUtility::CreateFile(const CString& strFileName)
    {
        BSTR strPath = strFileName.AllocSysString();
        HANDLE hResult = ::CreateFile(strPath, GENERIC_READ, 0, NULL, 
            CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
        SysFreeString(strPath);

        if (hResult == INVALID_HANDLE_VALUE)
            return false;
        if (!CloseHandle(hResult))
            return false;
        
        return true;
    }

    bool CSystemUtility::IsFileExist(const CString& strFileName)
    {
        return FileSystem::File::Exists(strFileName);
    }
    bool CSystemUtility::IsFileExist(const CPath& oPath)
    {
        return IsFileExist(oPath.GetPath());
    }

    CString CSystemUtility::GetDirectoryName(const CString& strFileName)
    {
        CPath oPath(strFileName);
        return oPath.GetDirectory();
    }

    int CSystemUtility::GetFilesCount(const CString& strDirPath, const bool& bRecursive)
    {
        return FileSystem::Directory::GetFilesCount(strDirPath, bRecursive);
    }

    CString CSystemUtility::GetFileExtention(const CString& strFileName)
    {
        CPath oPath(strFileName);
        return oPath.GetExtention();
    }

    bool CSystemUtility::CreateDirectories(const CPath& oPath)
    {
        return FileSystem::Directory::CreateDirectories(oPath.m_strFilename);
    }

    void CSystemUtility::ReplaceExtention(CString& strName, CString& str1, CString& str2)
    {
        return;
    }
}
