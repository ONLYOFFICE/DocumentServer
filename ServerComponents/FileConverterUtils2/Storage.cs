/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.IO;

using log4net;

namespace FileConverterUtils2
{
    public interface IStorage
    {
        ErrorTypes GetFileInfo(string strPath, out StorageFileInfo oStorageFileInfo);
        void GetFileInfoBegin(string strPath, AsyncCallback fCallback, object oParam);
        ErrorTypes GetFileInfoEnd(IAsyncResult ar, out StorageFileInfo oStorageFileInfo);
        ErrorTypes ReadFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes);
        void ReadFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam);
        ErrorTypes ReadFileEnd(IAsyncResult ar, out int nReadWriteBytes);
        ErrorTypes WriteFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes);
        void WriteFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam);
        ErrorTypes WriteFileEnd(IAsyncResult ar, out int nReadWriteBytes);
        ErrorTypes RemovePath(string strPath);
        void RemovePathBegin(string strPath, AsyncCallback fCallback, object oParam);
        ErrorTypes RemovePathEnd(IAsyncResult ar);
        ErrorTypes CreateDirectory(string strPath);
        void CreateDirectoryBegin(string strPath, AsyncCallback fCallback, object oParam);
        ErrorTypes CreateDirectoryEnd(IAsyncResult ar);
        StorageTreeNode GetTreeNode(string strPath);
        void GetTreeNodeBegin(string strPath, AsyncCallback fCallback, object oParam);
        StorageTreeNode GetTreeNodeEnd(IAsyncResult ar);
    }
    public class StorageFileInfo
    {
        public long m_nFilesize;
        public DateTime m_oLastModify;
        public StorageFileInfo(long nFilesize, DateTime oLastModify)
        {
            m_oLastModify = oLastModify;
            m_nFilesize = nFilesize;
        }
    }
    public class StorageTreeNode
    {
        public string m_sName;
        public List<StorageTreeNode> m_aSubNodes = new List<StorageTreeNode>();
        public bool m_bIsDirectory;
        public StorageTreeNode(string sName, bool bIsDirectory)
        {
            m_sName = sName;
            m_aSubNodes = new List<StorageTreeNode>();
            m_bIsDirectory = bIsDirectory;
        }
    }
    public class Storage : IStorage
    {
        private IStorage oStorage;
        public Storage()
        {
            switch(ConfigurationManager.AppSettings["utils.storage.impl"])
            {
                case "s3":
                    oStorage = new StorageAmazonS3();
                    break;

                case "fs":
                default:
                    oStorage = new StorageLocal();
                    break;
            }
        }
        public ErrorTypes GetFileInfo(string strPath, out StorageFileInfo oStorageFileInfo)
        {
            return oStorage.GetFileInfo(strPath, out oStorageFileInfo);
        }
        public void GetFileInfoBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            oStorage.GetFileInfoBegin(strPath, fCallback, oParam);
        }
        public ErrorTypes GetFileInfoEnd(IAsyncResult ar, out StorageFileInfo oStorageFileInfo)
        {
            return oStorage.GetFileInfoEnd(ar, out oStorageFileInfo);
        }
        public ErrorTypes ReadFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            return oStorage.ReadFile(strPath, oStream, out nReadWriteBytes);
        }
        public void ReadFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam)
        {
            oStorage.ReadFileBegin(strPath, oStream, fCallback, oParam);
        }
        public ErrorTypes ReadFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            return oStorage.ReadFileEnd(ar, out nReadWriteBytes);
        }
        public ErrorTypes WriteFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            return oStorage.WriteFile(strPath, oStream, out nReadWriteBytes);
        }
        public void WriteFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam)
        {
            oStorage.WriteFileBegin(strPath, oStream, fCallback, oParam);
        }
        public ErrorTypes WriteFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            return oStorage.WriteFileEnd(ar, out nReadWriteBytes);
        }
        public ErrorTypes RemovePath(string strPath)
        {
            return oStorage.RemovePath(strPath);
        }
        public void RemovePathBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            oStorage.RemovePathBegin(strPath, fCallback, oParam);
        }
        public ErrorTypes RemovePathEnd(IAsyncResult ar)
        {
            return oStorage.RemovePathEnd(ar);
        }
        public ErrorTypes CreateDirectory(string strPath)
        {
            return oStorage.CreateDirectory(strPath);
        }
        public void CreateDirectoryBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            oStorage.CreateDirectoryBegin(strPath, fCallback, oParam);
        }
        public ErrorTypes CreateDirectoryEnd(IAsyncResult ar)
        {
            return oStorage.CreateDirectoryEnd(ar);
        }
        public StorageTreeNode GetTreeNode(string strPath)
        {
            return oStorage.GetTreeNode(strPath);
        }
        public void GetTreeNodeBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            oStorage.GetTreeNodeBegin(strPath, fCallback, oParam);
        }
        public StorageTreeNode GetTreeNodeEnd(IAsyncResult ar)
        {
            return oStorage.GetTreeNodeEnd(ar);
        }
    }

    class StorageLocal : IStorage
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(StorageLocal));
        private delegate void DirectoryDeleteDelegate(string sPath, bool recursive);
        private delegate void FileDeleteDelegate(string strPath);
        private delegate StorageTreeNode GetTreeNodeDelegate(string strPath);
        private delegate ErrorTypes GetFileInfoDelegate(string strPath, out StorageFileInfo oStorageFileInfo);
        private delegate ErrorTypes CreateDirectoryDelegate(string strPath);
        private GetTreeNodeDelegate m_oGetTreeNodeDelegate = null;
        private GetFileInfoDelegate m_oGetFileInfoDelegate = null;
        private CreateDirectoryDelegate m_oCreateDirectoryDelegate = null;

        private class TransportClass : TransportClassAsyncOperation
        {
            public Stream m_oInput;
            public byte[] m_aBuffer;
            public Stream m_oOutput;
            public bool m_bDisposeInput = false;
            public bool m_bDisposeOutput = false;
            public DirectoryDeleteDelegate m_delegateDirectoryDelete = null;
            public FileDeleteDelegate m_delegateFileDelete = null;
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public ErrorTypes m_eDefaultError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, ErrorTypes eDefaultError, object oParam) : base(fCallback, oParam)
            {
                m_eDefaultError = eDefaultError;
            }
            public override void Close()
            {
                try
                {
                    if (m_bDisposeInput)
                    {
                        m_oInput.Dispose();
                        m_oInput = null;
                    }
                    if (m_bDisposeOutput)
                    {
                        m_oOutput.Dispose();
                        m_oOutput = null;
                    }
                }
                catch
                {
                }
            }
            public override void Dispose()
            {
                m_eError = m_eDefaultError;
                Close();
            }
        }
        private TransportClass m_oReadFile = null;
        private TransportClass m_oWriteFile = null;
        private TransportClass m_oRemovePath = null;
        public ErrorTypes GetFileInfo(string strPath, out StorageFileInfo oStorageFileInfo)
        {
            oStorageFileInfo = null;
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                FileInfo fi = new FileInfo(GetFilePath(strPath));
                if (fi.Exists)
                oStorageFileInfo = new StorageFileInfo(fi.Length, fi.LastWriteTimeUtc);
                else
                    eError = ErrorTypes.StorageFileNoFound;
            }
            catch
            {
                eError = ErrorTypes.StorageGetInfo;
            }
            return eError;
        }
        public void GetFileInfoBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            StorageFileInfo oTempStorageFileInfo = null;
            m_oGetFileInfoDelegate = new GetFileInfoDelegate(GetFileInfo);
            m_oGetFileInfoDelegate.BeginInvoke(strPath, out oTempStorageFileInfo, fCallback, oParam);
        }
        public ErrorTypes GetFileInfoEnd(IAsyncResult ar, out StorageFileInfo oStorageFileInfo)
        {
            oStorageFileInfo = null;
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oGetFileInfoDelegate.EndInvoke(out oStorageFileInfo, ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.StorageGetInfo;
            }
            return eErrorTypes;
        }
        public ErrorTypes ReadFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            ErrorTypes eResult = ErrorTypes.NoError;
            nReadWriteBytes = 0;
            try
            {
                string strFilepath = GetFilePath(strPath);
                if (File.Exists(strFilepath))
                {
                    byte[] arrAllFile = System.IO.File.ReadAllBytes(strFilepath);
                    oStream.Write(arrAllFile, 0, arrAllFile.Length);
                    nReadWriteBytes = arrAllFile.Length;
                }
                else
                    eResult = ErrorTypes.StorageFileNoFound;
            }
            catch
            {
                eResult = ErrorTypes.StorageRead;
            }
            return eResult;
        }
        public void ReadFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam)
        {
            m_oReadFile = new TransportClass(fCallback, ErrorTypes.StorageRead ,oParam);
            try
            {
                string strFilepath = GetFilePath(strPath);
                FileInfo oFileInfo = new FileInfo(strFilepath);
                if (oFileInfo.Exists)
                {
                    FileStream oFileStreamInput = new FileStream(strFilepath, FileMode.Open, FileAccess.Read, FileShare.Read, (int)oFileInfo.Length, true);
                    byte[] aBuffer = new byte[oFileStreamInput.Length];
                    m_oReadFile.m_oInput = oFileStreamInput;
                    m_oReadFile.m_aBuffer = aBuffer;
                    m_oReadFile.m_oOutput = oStream;
                    m_oReadFile.m_bDisposeInput = true;

                    m_oReadFile.m_oInput.BeginRead(aBuffer, 0, aBuffer.Length, EndCallbackRead, m_oReadFile);
                }
                else
                {
                    m_oReadFile.m_eError = ErrorTypes.StorageFileNoFound;
                    m_oReadFile.FireCallback();
                }
            }
            catch
            {
                m_oReadFile.DisposeAndCallback();
            }
        }
        public ErrorTypes ReadFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            nReadWriteBytes = 0;
            if (ErrorTypes.NoError == m_oReadFile.m_eError)
            {
                try
                {
                    m_oReadFile.m_oOutput.EndWrite(ar);
                    nReadWriteBytes = m_oReadFile.m_aBuffer.Length;
                    m_oReadFile.Close();
                }
                catch
                {
                    m_oReadFile.Dispose();
                }
            }
            return m_oReadFile.m_eError;
        }
        public void WriteFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback fCallback, object oParam)
        {
            m_oWriteFile = new TransportClass(fCallback, ErrorTypes.StorageWrite, oParam);
            try
            {
                string strFilepath = GetFilePath(strPath);
                FileInfo oFileInfo = new FileInfo(strFilepath);
                if (false == oFileInfo.Directory.Exists)
                    oFileInfo.Directory.Create();
                int nStreamLength = (int)oStream.Length;
                
                if(0 == nStreamLength)
                    nStreamLength = 1;
                FileStream oFileStreamOutput = new FileStream(strFilepath, FileMode.Create, FileAccess.Write, FileShare.Write, nStreamLength, true);
                byte[] aBuffer = new byte[oStream.Length];

                m_oWriteFile.m_oInput = oStream;
                m_oWriteFile.m_aBuffer = aBuffer;
                m_oWriteFile.m_oOutput = oFileStreamOutput;
                m_oWriteFile.m_bDisposeOutput = true;
                m_oWriteFile.m_oInput.BeginRead(aBuffer, 0, aBuffer.Length, EndCallbackRead, m_oWriteFile);
            }
            catch
            {
                m_oWriteFile.DisposeAndCallback();
            }
        }
        public ErrorTypes WriteFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            nReadWriteBytes = 0;
            if (ErrorTypes.NoError == m_oWriteFile.m_eError)
            {
                try
                {
                    m_oWriteFile.m_oOutput.EndWrite(ar);
                    nReadWriteBytes = m_oWriteFile.m_aBuffer.Length;
                    m_oWriteFile.Close();
                }
                catch
                {
                    m_oWriteFile.Dispose();
                }
            }
            return m_oWriteFile.m_eError;
        }
        public ErrorTypes WriteFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            ErrorTypes eResult = ErrorTypes.StorageWrite;
            nReadWriteBytes = 0;
            try
            {
                string strFilepath = GetFilePath(strPath);
                string strDirpath = Path.GetDirectoryName(strFilepath);
                if (false == Directory.Exists(strDirpath))
                    Directory.CreateDirectory(strDirpath);
                using (FileStream oFileStream = new FileStream(strFilepath, FileMode.Create, FileAccess.Write, FileShare.Write, (int)oStream.Length, true))
                {
                    using (MemoryStream oMemoryStreamInput = new MemoryStream((int)oStream.Length))
                    {
                        oStream.Read(oMemoryStreamInput.GetBuffer(), 0, (int)oStream.Length);
                        oFileStream.Write(oMemoryStreamInput.GetBuffer(), 0, (int)oStream.Length);
                        nReadWriteBytes = (int)oStream.Length;
                        eResult = ErrorTypes.NoError;
                    }
                }
            }
            catch
            {
            }
            return eResult;
        }
        public ErrorTypes CreateDirectory(string strPath)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
            string strDirpath = GetFilePath(strPath);
            if (false == Directory.Exists(strDirpath))
                Directory.CreateDirectory(strDirpath);
        }
            catch
            {
                eError = ErrorTypes.StorageCreateDir;
            }
            return eError;
        }
        public void CreateDirectoryBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            m_oCreateDirectoryDelegate = new CreateDirectoryDelegate(CreateDirectory);
            m_oCreateDirectoryDelegate.BeginInvoke(strPath, fCallback, oParam);
        }
        public ErrorTypes CreateDirectoryEnd(IAsyncResult ar)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oCreateDirectoryDelegate.EndInvoke(ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.StorageCreateDir;
            }
            return eErrorTypes;
        }
        public void RemovePathBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            m_oRemovePath = new TransportClass(fCallback, ErrorTypes.StorageRemoveDir, oParam);
            try
            {
                string strDirpath = GetFilePath(strPath);
                if (Directory.Exists(strDirpath))
                {
                    m_oRemovePath.m_delegateDirectoryDelete = Directory.Delete;
                    m_oRemovePath.m_delegateDirectoryDelete.BeginInvoke(strDirpath, true, m_oRemovePath.m_fCallback, m_oRemovePath.m_oParam);
                }
                else if (File.Exists(strDirpath))
                {
                    m_oRemovePath.m_delegateFileDelete = File.Delete;
                    m_oRemovePath.m_delegateFileDelete.BeginInvoke(strDirpath, m_oRemovePath.m_fCallback, m_oRemovePath.m_oParam);
                }
                else
                {
                    m_oRemovePath.FireCallback();
                }
            }
            catch
            {
                m_oRemovePath.DisposeAndCallback();
            }
        }
        public ErrorTypes RemovePathEnd(IAsyncResult ar)
        {
            if (ErrorTypes.NoError == m_oRemovePath.m_eError)
            {
                try
                {
                    if (null != m_oRemovePath.m_delegateDirectoryDelete)
                        m_oRemovePath.m_delegateDirectoryDelete.EndInvoke(ar);
                    else if(null != m_oRemovePath.m_delegateFileDelete)
                        m_oRemovePath.m_delegateFileDelete.EndInvoke(ar);
                    m_oRemovePath.Close();
                }
                catch
                {
                    m_oRemovePath.Dispose();
                }
            }
            return m_oRemovePath.m_eError;
        }
        public ErrorTypes RemovePath(string strPath)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
            string strDirpath = GetFilePath(strPath);
            if (Directory.Exists(strDirpath))
                Directory.Delete(strDirpath, true);
            else if (File.Exists(strDirpath))
                File.Delete(strDirpath);
            }
            catch(Exception e)
            {
                eError = ErrorTypes.StorageRemoveDir;
                _log.ErrorFormat("RemovePath({0})", strPath);
                _log.Error("Exception;", e);
            }
            return eError;
        }
        public StorageTreeNode GetTreeNode(string strPath)
        {
            StorageTreeNode oRoot = new StorageTreeNode("root", true);
            try
            {
            if (Directory.Exists(GetFilePath(strPath)))
                GetTreeNodeRecursion(oRoot, strPath);
            }
            catch
            {
            }
            return oRoot;
        }
        private void GetTreeNodeRecursion(StorageTreeNode oNode, string strPath)
        {
            string sPath = GetFilePath(strPath);
            string[] aFiles = Directory.GetFiles(sPath);
            for (int i = 0, length = aFiles.Length; i < length; ++i)
            {
                string sFile = aFiles[i];
                oNode.m_aSubNodes.Add(new StorageTreeNode(Path.GetFileName(sFile), false));
            }
            string[] aDirectories = Directory.GetDirectories(sPath);
            for (int i = 0, length = aDirectories.Length; i < length; ++i)
            {
                string sDir = aDirectories[i];
                StorageTreeNode oNewDir = new StorageTreeNode(Path.GetFileName(sDir), true);
                GetTreeNodeRecursion(oNewDir, Path.Combine(strPath, sDir));
                oNode.m_aSubNodes.Add(oNewDir);
            }
        }
        public void GetTreeNodeBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            m_oGetTreeNodeDelegate = new GetTreeNodeDelegate(GetTreeNode);
            m_oGetTreeNodeDelegate.BeginInvoke(strPath, fCallback, oParam);
            
        }
        public StorageTreeNode GetTreeNodeEnd(IAsyncResult ar)
        {
            StorageTreeNode oStorageTreeNode = null;
            try
            {
                oStorageTreeNode = m_oGetTreeNodeDelegate.EndInvoke(ar);
            }
            catch
            {
            }
            return oStorageTreeNode;
        }
        private string GetFilePath(string strPath)
        {
            return Path.Combine(ConfigurationManager.AppSettings["utils.storage.fs.keyfiles"], strPath);
        }
        private void EndCallbackRead(IAsyncResult ar)
        {
            TransportClass oTransportClass = ar.AsyncState as TransportClass;
            try
            {
                oTransportClass.m_oInput.EndRead(ar);
                oTransportClass.m_oOutput.BeginWrite(oTransportClass.m_aBuffer, 0, (int)oTransportClass.m_aBuffer.Length, oTransportClass.m_fCallback, oTransportClass.m_oParam);
            }
            catch
            {
                oTransportClass.DisposeAndCallback();
            }
        }
    }

    class StorageAmazonS3 : IStorage
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(StorageLocal));
        private int c_nMaxReadBufferSize = int.Parse(ConfigurationSettings.AppSettings["utils.storage.s3.readbuffersize"]);
        private Amazon.RegionEndpoint m_oRegion = Amazon.RegionEndpoint.GetBySystemName(ConfigurationSettings.AppSettings["utils.storage.s3.region"]);
        private string m_strBucketName = ConfigurationSettings.AppSettings["utils.storage.s3.bucketname"];
        private string m_strStorageFolderName = ConfigurationSettings.AppSettings["utils.storage.s3.foldername"];
        private class TransportClass : TransportClassAsyncOperation
        {
            public Amazon.S3.AmazonS3 m_oS3Client = null;
            public Amazon.S3.Model.GetObjectResponse m_oGetObjectResponse = null;
            public Amazon.S3.Model.ListObjectsResponse m_oListObjectsResponse = null;
            public Amazon.S3.Model.DeleteObjectResponse m_oDeleteObjectResponse = null;
            public Amazon.S3.Model.ListObjectsRequest m_oRequest = null;
            public StorageTreeNode m_oNode = null;
            public Stream m_oStreamOutput;
            public byte[] m_aBuffer;
            public int m_nReadWriteBytes = 0;
            public int m_nTotalReadWriteBytes = 0;
            public string m_strPrefix = "";
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, object oParam) : base(fCallback, oParam) { }
            public override void Close()
            {
                try
                {
                    if (null != m_oStreamOutput)
                    {

                       m_oStreamOutput = null;
                    }
                    if (null != m_oS3Client)
                    {
                        m_oS3Client.Dispose();
                        m_oS3Client = null;
                    }

                    if (null != m_oGetObjectResponse)
                    {
                        m_oGetObjectResponse.Dispose();
                        m_oGetObjectResponse = null;
                    }

                    if (null != m_oListObjectsResponse)
                    {
                        m_oListObjectsResponse.Dispose();
                        m_oListObjectsResponse = null;
                    }

                    if (null != m_oDeleteObjectResponse)
                    {
                        m_oDeleteObjectResponse.Dispose();
                        m_oDeleteObjectResponse = null;
                    }
                }
                catch
                {
                }
            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.NoError;
                Close();
            }
        }
        private TransportClass m_oReadFile = null;
        private TransportClass m_oWriteFile = null;
        private TransportClass m_oGetTreeNode = null;
        private TransportClass m_oRemoveDirectory = null;
        private TransportClass m_oGetFileInfo = null;
        private TransportClass m_oCreateDirectory = null;
        public void GetFileInfoBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            try
            {
                m_oGetFileInfo = new TransportClass(fCallback, oParam);
                m_oGetFileInfo.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);
                string strFileKey = GetFilePath(strPath);
                Amazon.S3.Model.GetObjectMetadataRequest oRequest = new Amazon.S3.Model.GetObjectMetadataRequest()
                        .WithBucketName(m_strBucketName).WithKey(strFileKey);
                m_oGetFileInfo.m_oS3Client.BeginGetObjectMetadata(oRequest, m_oGetFileInfo.m_fCallback, m_oGetFileInfo.m_oParam);
            }
            catch
            {
                m_oGetFileInfo.m_eError = ErrorTypes.StorageGetInfo;
                m_oGetFileInfo.DisposeAndCallback();
            }
        }
        public ErrorTypes GetFileInfoEnd(IAsyncResult ar, out StorageFileInfo oStorageFileInfo)
        {
            oStorageFileInfo = null;
            ErrorTypes eError = m_oGetFileInfo.m_eError;
            if (ErrorTypes.NoError == eError)
            {
                try
                {
                    using (Amazon.S3.Model.GetObjectMetadataResponse oResponse = m_oGetFileInfo.m_oS3Client.EndGetObjectMetadata(ar))
                    {
                        oStorageFileInfo = new StorageFileInfo(oResponse.ContentLength, oResponse.LastModified);
                        m_oGetFileInfo.Close();
                        eError = ErrorTypes.NoError;
                    }
                }
                catch
                {
                    eError = ErrorTypes.StorageGetInfo;
                    m_oGetFileInfo.Dispose();
                }
            }
            else
                m_oGetFileInfo.Dispose();
            return eError;
        }
        public ErrorTypes GetFileInfo(string strPath, out StorageFileInfo oStorageFileInfo)
        {
            oStorageFileInfo = null;
            ErrorTypes eError = ErrorTypes.StorageGetInfo;

            try
            {
                string strFileKey = GetFilePath(strPath);
                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    Amazon.S3.Model.GetObjectMetadataRequest oRequest = new Amazon.S3.Model.GetObjectMetadataRequest()
                        .WithBucketName(m_strBucketName).WithKey(strFileKey);

                    using(Amazon.S3.Model.GetObjectMetadataResponse oResponse = oS3Client.GetObjectMetadata(oRequest))
                    {
                        oStorageFileInfo = new StorageFileInfo(oResponse.ContentLength, oResponse.LastModified);
                        eError = ErrorTypes.NoError;
                    }
                }
            }
            catch
            {
            }
            return eError;
        }
        public void ReadFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback cb, object oParam)
        {
            try
            {
                m_oReadFile = new TransportClass(cb, oParam);
                m_oReadFile.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);

                string strFileKey = GetFilePath(strPath);
                Amazon.S3.Model.GetObjectRequest oRequest = new Amazon.S3.Model.GetObjectRequest()
                      .WithBucketName(m_strBucketName).WithKey(strFileKey);
                
                m_oReadFile.m_oStreamOutput = oStream;
                m_oReadFile.m_oS3Client.BeginGetObject(oRequest, EndCallbackGetObject, m_oReadFile);
            }
            catch
            {
                m_oReadFile.m_eError = ErrorTypes.StorageRead;
                m_oReadFile.DisposeAndCallback();
            }
        }
        public ErrorTypes ReadFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            nReadWriteBytes = 0;
            try
            {
                nReadWriteBytes = m_oReadFile.m_nTotalReadWriteBytes;
                m_oReadFile.Close();
            }
            catch
            {
                m_oReadFile.m_eError = ErrorTypes.StorageRead;
                m_oReadFile.Dispose();
            }
            return m_oReadFile.m_eError;
        }
        public ErrorTypes ReadFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            ErrorTypes eResult = ErrorTypes.StorageRead;
            nReadWriteBytes = 0;
            try
            {
                string strFileKey = GetFilePath(strPath);
                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    Amazon.S3.Model.GetObjectRequest oRequest = new Amazon.S3.Model.GetObjectRequest()
                        .WithBucketName(m_strBucketName).WithKey(strFileKey);
                    using (Amazon.S3.Model.GetObjectResponse oResponse = oS3Client.GetObject(oRequest))
                    {
                        using (Stream oResponseStream = oResponse.ResponseStream)
                        {
                            int nNeedReadBytes = (int)oResponse.ContentLength;

                            int nMemoryStreamSize = Math.Min(c_nMaxReadBufferSize, nNeedReadBytes);
                            MemoryStream oMemoryStreamOutput = new MemoryStream(nMemoryStreamSize);

                            while (nNeedReadBytes > 0)
                            {
                                int nReadBytesPos = 0;
                                int nReadBytesCount = nMemoryStreamSize;
                                int nReadBytesFromStreamCount = 0;
                                while ( nReadBytesCount > 0 &&
                                        ( nReadBytesFromStreamCount = oResponseStream.Read(oMemoryStreamOutput.GetBuffer(), nReadBytesPos, nReadBytesCount)) > 0 )
                                {
                                        nReadBytesPos += nReadBytesFromStreamCount;
                                        nReadBytesCount -= nReadBytesFromStreamCount;
                                }

                                oStream.Write(oMemoryStreamOutput.GetBuffer(), 0, nReadBytesPos);
                                nReadWriteBytes += nReadBytesPos;
                                nNeedReadBytes -= nReadBytesPos; 
                            }

                        }
                    }
                }
            }
            catch
            {
            }

            return eResult;
        }
        public void WriteFileBegin(string strPath, System.IO.Stream oStream, AsyncCallback cb, object oParam)
        {
            try
            {
                m_oWriteFile = new TransportClass(cb, oParam);
                m_oWriteFile.m_nReadWriteBytes = (int)oStream.Length;
                m_oWriteFile.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);

                string strFileKey = GetFilePath(strPath);
                Amazon.S3.Model.PutObjectRequest oRequest = new Amazon.S3.Model.PutObjectRequest()
                    .WithBucketName(m_strBucketName).WithKey(strFileKey);
                oRequest.WithInputStream(oStream);

                m_oWriteFile.m_oS3Client.BeginPutObject(oRequest, m_oWriteFile.m_fCallback, m_oWriteFile.m_oParam);
            }
            catch
            {
                m_oWriteFile.m_eError = ErrorTypes.StorageWrite;
                m_oWriteFile.DisposeAndCallback();
            }
        }
        public ErrorTypes WriteFileEnd(IAsyncResult ar, out int nReadWriteBytes)
        {
            nReadWriteBytes = 0;
            try
            {
                m_oWriteFile.m_oS3Client.EndPutObject(ar);
                nReadWriteBytes = m_oWriteFile.m_nReadWriteBytes;
                m_oWriteFile.Close();
            }
            catch
            {
                m_oWriteFile.m_eError = ErrorTypes.StorageWrite;
                m_oWriteFile.Dispose();
            }
            return m_oWriteFile.m_eError;
        }
        public ErrorTypes WriteFile(string strPath, System.IO.Stream oStream, out int nReadWriteBytes)
        {
            ErrorTypes eResult = ErrorTypes.StorageWrite;
            nReadWriteBytes = (int)oStream.Length;
            try
            {
                string strFileKey = GetFilePath(strPath);
                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    Amazon.S3.Model.PutObjectRequest oRequest = new Amazon.S3.Model.PutObjectRequest();
                    oRequest.WithBucketName(m_strBucketName).WithKey(strFileKey).WithInputStream(oStream);

                    using (Amazon.S3.Model.PutObjectResponse oResponse = oS3Client.PutObject(oRequest))
                    {
                        oResponse.Dispose();
                    }
                }
            }
            catch
            {
                nReadWriteBytes = 0;
            }

            return eResult;
        }
        public void CreateDirectoryBegin(string strPath, AsyncCallback fCallback, object oParam)
        {
            try
            {
                m_oCreateDirectory = new TransportClass(fCallback, oParam);
                m_oCreateDirectory.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);
                string strDirKey = GetDirPath(strPath);
                Amazon.S3.Model.PutObjectRequest oRequest = new Amazon.S3.Model.PutObjectRequest();
                oRequest.WithBucketName(m_strBucketName).WithKey(strDirKey).WithContentBody(string.Empty);

                m_oCreateDirectory.m_oS3Client.BeginPutObject(oRequest, m_oCreateDirectory.m_fCallback, m_oCreateDirectory.m_oParam);
            }
            catch
            {
                m_oCreateDirectory.m_eError = ErrorTypes.StorageCreateDir;
                m_oCreateDirectory.DisposeAndCallback();
            }
        }
        public ErrorTypes CreateDirectoryEnd(IAsyncResult ar)
        {
            ErrorTypes eError = m_oCreateDirectory.m_eError;
            if (ErrorTypes.NoError == eError)
            {
                try
                {
                    using (Amazon.S3.Model.PutObjectResponse oResponse = m_oCreateDirectory.m_oS3Client.EndPutObject(ar))
                    {
                        m_oCreateDirectory.Close();
                        eError = ErrorTypes.NoError;
                    }
                }
                catch
                {
                    eError = ErrorTypes.StorageCreateDir;
                    m_oCreateDirectory.Dispose();
                }
            }
            else
                m_oCreateDirectory.Dispose();
            return eError;
        }
        public ErrorTypes CreateDirectory(string strPath)
        {
            ErrorTypes eResult = ErrorTypes.StorageCreateDir;
            try
            {
                string strDirKey = GetDirPath(strPath);
                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    Amazon.S3.Model.PutObjectRequest oRequest = new Amazon.S3.Model.PutObjectRequest();
                    oRequest.WithBucketName(m_strBucketName).WithKey(strDirKey).WithContentBody(string.Empty);

                    using (Amazon.S3.Model.PutObjectResponse oResponse = oS3Client.PutObject(oRequest))
                    {
                        eResult = ErrorTypes.NoError;
                    }
                }
            }
            catch
            {
            }
            return eResult;
        }
        public void RemovePathBegin(string strPath, AsyncCallback cb, object oParam)
        {
            try
            {
                m_oRemoveDirectory = new TransportClass(cb, oParam);
                m_oRemoveDirectory.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);

                string strDirKey = GetDirPath(strPath);
                m_oRemoveDirectory.m_oRequest = new Amazon.S3.Model.ListObjectsRequest()
                    .WithBucketName(m_strBucketName).WithPrefix(strDirKey);

                m_oRemoveDirectory.m_oS3Client.BeginListObjects(m_oRemoveDirectory.m_oRequest, EndCallbackGetListObjects, m_oRemoveDirectory);
            }
            catch(Exception e)
            {
                _log.ErrorFormat("Exception cathed in RemovePathBegin(path={0}):{1}", strPath, e);
                m_oRemoveDirectory.m_eError = ErrorTypes.StorageRemoveDir;
                m_oRemoveDirectory.DisposeAndCallback();
            }
        }
        public ErrorTypes RemovePathEnd(IAsyncResult ar)
        {
            try
            {
                m_oRemoveDirectory.Close();
            }
            catch(Exception e)
            {
                _log.ErrorFormat("Exception cathed in RemovePathEnd():{0}", e);
                m_oRemoveDirectory.m_eError = ErrorTypes.StorageRemoveDir;
                m_oRemoveDirectory.Dispose();
            }
            return m_oRemoveDirectory.m_eError;
        }

        public ErrorTypes RemovePath(string strPath)
        {
            ErrorTypes eResult = ErrorTypes.StorageRemoveDir;
            try
            {
                string strDirKey = GetDirPath(strPath);

                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    Amazon.S3.Model.ListObjectsRequest oListObjectsRequest = new Amazon.S3.Model.ListObjectsRequest();
                    oListObjectsRequest.WithBucketName(m_strBucketName).WithPrefix(strDirKey);
                    bool bWasError = false;
                    do
                    {
                        using (Amazon.S3.Model.ListObjectsResponse oListObjectsResponse = oS3Client.ListObjects(oListObjectsRequest))
                        {
                            int nDeletedObjectCount = 0;
                            int nObjectsToDeleteCount = oListObjectsResponse.S3Objects.Count;
                            if (nObjectsToDeleteCount > 0)
                            {
                                Amazon.S3.Model.DeleteObjectsRequest oDeleteObjectsRequest = new Amazon.S3.Model.DeleteObjectsRequest();
                                oDeleteObjectsRequest.WithBucketName(m_strBucketName);

                                foreach (Amazon.S3.Model.S3Object oS3Obj in oListObjectsResponse.S3Objects)
                                {
                                    oDeleteObjectsRequest.AddKey(oS3Obj.Key);
                                }

                                using (Amazon.S3.Model.DeleteObjectsResponse oDeleteObjectsResponse = oS3Client.DeleteObjects(oDeleteObjectsRequest))
                                {
                                    nDeletedObjectCount = oDeleteObjectsResponse.DeletedObjects.Count;
                                }
                            }
                            if (nObjectsToDeleteCount == nDeletedObjectCount && !bWasError)
                                eResult = ErrorTypes.NoError;
                            else
                            {
                                bWasError = true;
                                eResult = ErrorTypes.StorageRemoveDir;
                            }

                            if (oListObjectsResponse.IsTruncated)
                                oListObjectsRequest.Marker = oListObjectsResponse.NextMarker;
                            else
                                oListObjectsRequest = null;
                        }
                    }
                    while (null != oListObjectsRequest);
                }
            }
            catch(Exception e)
            {
                _log.ErrorFormat("Exception cathed in RemovePath(path={0}):{1}", strPath, e);
            }

            return eResult;
        }
        private string GetFilePath(string strPath)
        {
            string strFilepath = m_strStorageFolderName;
            strFilepath = Path.Combine(strFilepath, strPath).Replace("\\", "/");
            return strFilepath;
        }
        private string GetDirPath(string strPath)
        {
            string strDirPath = GetFilePath(strPath);

            if (strDirPath.LastIndexOf("/") != (strDirPath.Length - 1))
                strDirPath += "/";
            
            return strDirPath;
        }
        private void AddNodeRecursive(StorageTreeNode oNode, string strKey)
        {
            try
            {
                
                if ("" != strKey)
                {
                    
                    int nFirstIndex = strKey.IndexOf("/");
                    if (-1 != nFirstIndex)
                    {
                        StorageTreeNode oDirNode = null;
                        String strSubDir = strKey.Substring(0, nFirstIndex);

                        foreach (StorageTreeNode oExistNode in oNode.m_aSubNodes)
                        {
                            if (oExistNode.m_bIsDirectory && oExistNode.m_sName == strSubDir)
                            {
                                oDirNode = oExistNode;
                                break;
                            }
                        }

                        if (null == oDirNode)
                        {
                            
                            oNode.m_aSubNodes.Add(new StorageTreeNode(strSubDir, true));
                        }
                        
                        AddNodeRecursive(oDirNode, strKey.Substring(nFirstIndex + 1));
                    }
                    else
                    {
                        oNode.m_aSubNodes.Add(new StorageTreeNode(strKey, false));
                    }
                }
                else
                {
                    oNode.m_bIsDirectory = true;
                }
            }
            catch
            { }
            return;
        }
        public StorageTreeNode GetTreeNode(string strPath)
        {
            StorageTreeNode oNode = null;
            try
            {
                using (Amazon.S3.AmazonS3 oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion))
                {
                    string strPrefix = GetDirPath(strPath);
                    Amazon.S3.Model.ListObjectsRequest oRequest = new Amazon.S3.Model.ListObjectsRequest();
                    oRequest.WithBucketName(m_strBucketName).WithPrefix(strPrefix);
                    oNode = new StorageTreeNode(strPrefix.Substring(0, strPrefix.Length - 1), true);
                    do
                    {
                        using (Amazon.S3.Model.ListObjectsResponse oResponse = oS3Client.ListObjects(oRequest))
                        {
                            foreach (Amazon.S3.Model.S3Object entry in oResponse.S3Objects)
                            {
                                AddNodeRecursive(oNode, entry.Key.Substring(strPrefix.Length));
                            }
                            if (oResponse.IsTruncated)
                                oRequest.Marker = oResponse.NextMarker;
                            else
                                oRequest = null;
                        }
                    }
                    while (null != oRequest);
                }
            }
            catch
            {
            }

            return oNode;
        }

        private void EndCallbackGetObject(IAsyncResult ar)
        {
            TransportClass oObject = null;
            try
            {
                oObject = ar.AsyncState as TransportClass;
                oObject.m_oGetObjectResponse = oObject.m_oS3Client.EndGetObject(ar);
                oObject.m_aBuffer = new byte[Math.Min(oObject.m_oGetObjectResponse.ContentLength, c_nMaxReadBufferSize)];
                oObject.m_oGetObjectResponse.ResponseStream.BeginRead(oObject.m_aBuffer, 0, oObject.m_aBuffer.Length, EndCallbackReadStream, oObject);
            }
            catch
            {
                if (null != oObject)
                    oObject.DisposeAndCallback();
            }
        }
        private void EndCallbackReadStream(IAsyncResult ar)
        {
            TransportClass oObject = null;
            try
            {
                oObject = ar.AsyncState as TransportClass;
                oObject.m_nReadWriteBytes = oObject.m_oGetObjectResponse.ResponseStream.EndRead(ar);

                if (oObject.m_nReadWriteBytes > 0)
                {
                    oObject.m_nTotalReadWriteBytes += oObject.m_nReadWriteBytes;
                    oObject.m_oStreamOutput.BeginWrite(oObject.m_aBuffer, 0, oObject.m_nReadWriteBytes, EndCallbackWriteStream, oObject);
                }
                else
                {
                    oObject.FireCallback();
                }
            }
            catch
            {
                if (null != oObject)
                    oObject.DisposeAndCallback();
            }
        }
        private void EndCallbackWriteStream(IAsyncResult ar)
        {
            TransportClass oObject = null;
            try
            {
                oObject = ar.AsyncState as TransportClass;
                oObject.m_oStreamOutput.EndWrite(ar);
                oObject.m_oGetObjectResponse.ResponseStream.BeginRead(oObject.m_aBuffer, 0, oObject.m_aBuffer.Length, EndCallbackReadStream, oObject);
            }
            catch
            {
                if (null != oObject)
                    oObject.DisposeAndCallback();
            }
        }
        private void EndCallbackGetListObjects(IAsyncResult ar)
        {
            TransportClass oObject = null;
            try
            {
                oObject = ar.AsyncState as TransportClass;
                oObject.m_oListObjectsResponse = oObject.m_oS3Client.EndListObjects(ar);
                
                if (oObject.m_oListObjectsResponse.S3Objects.Count > 0)
                {
                    Amazon.S3.Model.DeleteObjectsRequest oDeleteObjectsRequest = new Amazon.S3.Model.DeleteObjectsRequest();
                    oDeleteObjectsRequest.WithBucketName(m_strBucketName);

                    foreach (Amazon.S3.Model.S3Object oS3Obj in oObject.m_oListObjectsResponse.S3Objects)
                    {
                        oDeleteObjectsRequest.AddKey(oS3Obj.Key);
                    }

                    oObject.m_oS3Client.BeginDeleteObjects(oDeleteObjectsRequest, EndCallbackDeleteObjects, null);
                }
                else
                {
                    oObject.FireCallback();
                }
            }
            catch
            {
                m_oRemoveDirectory.m_eError = ErrorTypes.StorageRemoveDir;
                m_oRemoveDirectory.DisposeAndCallback();
            }
        }
        private void EndCallbackDeleteObjects(IAsyncResult ar)
        {
            try
            {
                using (Amazon.S3.Model.DeleteObjectsResponse oDeleteObjectsResponse = m_oRemoveDirectory.m_oS3Client.EndDeleteObjects(ar))
                {
                    if (oDeleteObjectsResponse.DeletedObjects.Count != m_oRemoveDirectory.m_oListObjectsResponse.S3Objects.Count)
                        m_oRemoveDirectory.m_eError = ErrorTypes.StorageRemoveDir;
                }
                if (m_oRemoveDirectory.m_oListObjectsResponse.IsTruncated)
                {
                    m_oRemoveDirectory.m_oRequest.Marker = m_oRemoveDirectory.m_oListObjectsResponse.NextMarker;
                    m_oRemoveDirectory.m_oListObjectsResponse.Dispose();
                    m_oRemoveDirectory.m_oListObjectsResponse = null;
                    m_oRemoveDirectory.m_oS3Client.BeginListObjects(m_oRemoveDirectory.m_oRequest, EndCallbackGetListObjects, m_oRemoveDirectory);
                }
                else
                {
                    m_oRemoveDirectory.FireCallback();
                }
            }
            catch (Exception e)
            {
                _log.ErrorFormat("Exception cathed in EndCallbackDeleteObjects():{0}", e);
                m_oRemoveDirectory.m_eError = ErrorTypes.StorageRemoveDir;
                m_oRemoveDirectory.DisposeAndCallback();
            }
        }
        public void GetTreeNodeBegin(string strPath, AsyncCallback cb, object oParam)
        {
            try
            {
                m_oGetTreeNode = new TransportClass(cb, oParam);
                m_oGetTreeNode.m_oS3Client = Amazon.AWSClientFactory.CreateAmazonS3Client(m_oRegion);
                string strPrefix = GetDirPath(strPath);
                m_oGetTreeNode.m_strPrefix = strPrefix;
                m_oGetTreeNode.m_oNode = new StorageTreeNode(strPrefix.Substring(0, strPrefix.Length - 1), true);
                m_oGetTreeNode.m_oRequest = new Amazon.S3.Model.ListObjectsRequest();
                m_oGetTreeNode.m_oRequest.WithBucketName(m_strBucketName).WithPrefix(m_oGetTreeNode.m_strPrefix);

                m_oGetTreeNode.m_oS3Client.BeginListObjects(m_oGetTreeNode.m_oRequest, GetTreeNodeCallback, null);
            }
            catch
            {
                m_oGetTreeNode.m_eError = ErrorTypes.StorageGetInfo;
                m_oGetTreeNode.DisposeAndCallback();
            }

        }
        private void GetTreeNodeCallback(IAsyncResult ar)
        {
            try
            {
                string strPrefix = m_oGetTreeNode.m_strPrefix;
                using (Amazon.S3.Model.ListObjectsResponse oResponse = m_oGetTreeNode.m_oS3Client.EndListObjects(ar))
                {
                    foreach (Amazon.S3.Model.S3Object oEntry in oResponse.S3Objects)
                    {
                        AddNodeRecursive(m_oGetTreeNode.m_oNode, oEntry.Key.Substring(strPrefix.Length));
                    }
                    if (oResponse.IsTruncated)
                    {
                        m_oGetTreeNode.m_oRequest.Marker = oResponse.NextMarker;
                        m_oGetTreeNode.m_oS3Client.BeginListObjects(m_oGetTreeNode.m_oRequest, GetTreeNodeCallback, null);
                    }
                    else
                        m_oGetTreeNode.FireCallback();
                }
            }
            catch
            {
                m_oGetTreeNode.m_eError = ErrorTypes.StorageGetInfo;
                m_oGetTreeNode.DisposeAndCallback();
            }
        }
        public StorageTreeNode GetTreeNodeEnd(IAsyncResult ar)
        {
            try
            {
                m_oGetTreeNode.Close();
            }
            catch (Exception e)
            {
                _log.ErrorFormat("Exception cathed in GetTreeNodeEnd():{0}", e);
                m_oGetTreeNode.m_eError = ErrorTypes.StorageGetInfo;
                m_oGetTreeNode.Dispose();
            }
            return m_oGetTreeNode.m_oNode;
        }
    }
}