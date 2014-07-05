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

#include "Directory.h"
#include <strsafe.h>


namespace FileSystem {
    LPCTSTR Directory::GetCurrentDirectory() {
        static const int bufferSize = MAX_PATH;
        LPTSTR directory = new TCHAR[bufferSize];

        DWORD lenght = ::GetCurrentDirectory(bufferSize, directory);
        if (lenght == 0) {
            delete[] directory;
            directory = NULL;
        }

        return directory;
    }
    String Directory::GetCurrentDirectoryS() {
        LPCTSTR directory = GetCurrentDirectory();
        if (directory == NULL)
            return String();

        return String(directory);
    }

    bool Directory::CreateDirectory(LPCTSTR path) {
        bool directoryCreated = false;
        if (::CreateDirectory(path, NULL) == TRUE)
            directoryCreated = true;
        return directoryCreated;
    }
    bool Directory::CreateDirectory(const String& path) {
        return CreateDirectory(path.c_str());
    }
	
    bool Directory::CreateDirectories(LPCTSTR path) 
	{
		int codeResult	=	ERROR_SUCCESS;

		codeResult		=	::CreateDirectory (path, NULL);
		

        bool created	=	false;
        if (codeResult == ERROR_SUCCESS)
            created = true;

        return created;
    }

    StringArray Directory::GetFilesInDirectory(LPCTSTR path, const bool& andSubdirectories) {
        size_t pathLength = 0;
        StringCchLength(path, MAX_PATH, &pathLength);
        ++pathLength;
        size_t pathToFilesLength = pathLength + 3;
        LPTSTR pathToFiles = new TCHAR[pathToFilesLength];

        StringCchCopy(pathToFiles, pathLength, path);
        StringCchCat(pathToFiles, pathToFilesLength, TEXT("\\*"));

        WIN32_FIND_DATA findData;
        HANDLE findResult = FindFirstFile(pathToFiles, &findData);
        delete[] pathToFiles;

        if (findResult == INVALID_HANDLE_VALUE)
            return StringArray();

        StringArray files;
        do {
            if (andSubdirectories || !(findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)) {
                String file = findData.cFileName;
                files.insert(files.end(), file);
            }
        } while (FindNextFile(findResult, &findData));

        FindClose(findResult);

        return files;
    }
    StringArray Directory::GetFilesInDirectory(const String& path, const bool& andSubdirectories) {
        LPCTSTR pathW = path.c_str();
        return GetFilesInDirectory(pathW, andSubdirectories);
    }

    int Directory::GetFilesCount(const CString& path, const bool& recursive) {
        CString pathMask = path + _T("\\*");

        WIN32_FIND_DATA findData;
        HANDLE findResult = FindFirstFile(pathMask, &findData);

        int filesCount = 0;
        do {
            if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
                if (!recursive)
                    continue;
                if ((CString) findData.cFileName == _T("."))
                    continue;
                if ((CString) findData.cFileName == _T(".."))
                    continue;
                CString innerPath = path + _T('\\') + (CString) findData.cFileName;
                filesCount += GetFilesCount(innerPath, recursive);
            }
            else
                ++filesCount;
        } while (FindNextFile(findResult, &findData));

        FindClose(findResult);

        return filesCount;
    }
}
