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
 using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Web;
using System.IO;
using System.Xml;
using System.Net;

namespace FileConverterUtils2
{
    #region TransportClass
    public class TransportClassMainAshx
    {
        public HttpContext m_oHttpContext;
        public AsyncCallback m_oAsyncCallback;
        public TransportClassMainAshx(HttpContext oHttpContext, AsyncCallback oAsyncCallback)
        {
            m_oHttpContext = oHttpContext;
            m_oAsyncCallback = oAsyncCallback;
        }
    }
    public abstract class TransportClassAsyncOperation
    {
        public AsyncCallback m_fCallback = null;
        public object m_oParam = null;
        public TransportClassAsyncOperation(AsyncCallback fCallback, object oParam)
        {
            m_fCallback = fCallback;
            m_oParam = oParam;
        }
        public abstract void Close();
        public abstract void Dispose();
        public void DisposeAndCallback()
        {
            Dispose();
            FireCallback();
        }
        public void FireCallback()
        {
            m_fCallback(new AsyncOperationData(m_oParam));
        }
    }
    public class AsyncOperationData : IAsyncResult
    {
        protected bool _completed;
        protected Object _state;

        bool IAsyncResult.IsCompleted { get { return _completed; } }
        WaitHandle IAsyncResult.AsyncWaitHandle { get { return null; } }
        Object IAsyncResult.AsyncState { get { return _state; } }
        bool IAsyncResult.CompletedSynchronously { get { return false; } }

        public AsyncOperationData(Object state)
        {
            _state = state;
            _completed = false;
        }
    }
    #endregion

    #region For action
    public class AsyncContextReadOperation
    {
        private Stream m_oStream = null;
        public byte[] m_aBuffer;
        private object m_oParam;
        private ErrorTypes m_eError = ErrorTypes.NoError;
        public AsyncContextReadOperation()
        {
        }
        public void ReadContextBegin(Stream oStream, AsyncCallback fCallback, object oParam)
        {
            try
            {
                m_oStream = oStream;
                m_oParam = oParam;
                int nInputLength = (int)m_oStream.Length;
                m_aBuffer = new byte[nInputLength];
                m_oStream.BeginRead(m_aBuffer, 0, nInputLength, fCallback, oParam);
            }
            catch
            {
                m_eError = ErrorTypes.ReadRequestStream;
            }
            if (ErrorTypes.NoError != m_eError)
                fCallback.Invoke(new AsyncOperationData(oParam));
        }
        public ErrorTypes ReadContextEnd(IAsyncResult ar)
        {
            if (ErrorTypes.NoError == m_eError)
            {
                try
                {
                    m_oStream.EndRead(ar);
                }
                catch
                {
                    m_eError = ErrorTypes.ReadRequestStream;
                }
            }
            return m_eError;
        }
    }
    public class AsyncClearCacheOperation
    {
        private string m_sKey;
        private TaskResult m_oTaskResult = new TaskResult();
        private Storage m_oStorage = new Storage();
        private ErrorTypes m_eError = ErrorTypes.NoError;
        private AsyncCallback m_fAsyncCallback;
        private object m_oParam;
        public void ClearCacheBegin(string sKey, AsyncCallback fAsyncCallback, object oParam)
        {
            m_sKey = sKey;
            m_fAsyncCallback = fAsyncCallback;
            m_oParam = oParam;
            try
            {
                m_oTaskResult.RemoveBegin(m_sKey, ClearCacheTaskResultCallback, null);
            }
            catch
            {
                m_eError = ErrorTypes.Unknown;
            }
        }
        public ErrorTypes ClearCacheEnd(IAsyncResult ar)
        {
            return m_eError;
        }
        private void FireCallback()
        {
            m_fAsyncCallback.Invoke(new AsyncOperationData(m_oParam));
        }
        private void ClearCacheTaskResultCallback(IAsyncResult ar)
        {
            try
            {
                m_eError = m_oTaskResult.RemoveEnd(ar);
                if (ErrorTypes.NoError == m_eError)
                    m_oStorage.RemovePathBegin(m_sKey, ClearCacheAllCallback, null);
                else
                    FireCallback();
            }
            catch
            {
                m_eError = ErrorTypes.Unknown;
                FireCallback();
            }
        }
        private void ClearCacheAllCallback(IAsyncResult ar)
        {
            try
            {
                m_eError = m_oStorage.RemovePathEnd(ar);
            }
            catch
            {
                m_eError = ErrorTypes.Unknown;
            }
            FireCallback();
        }
    }
    public class AsyncMediaXmlOperation
    {
        private class TransportClass : TransportClassAsyncOperation
        {
            public string m_sPath;
            public Storage m_oStorage = new Storage();
            public MemoryStream m_oMemoryStream = new MemoryStream();
            public Dictionary<string, string> m_aMediaXmlMapHash;
            public Dictionary<string, string> m_aMediaXmlMapFilename;
            public Utils.getMD5HexStringDelegate m_ogetMD5HexStringDelegate;
            public StorageTreeNode m_oStorageTreeNode;
            public int m_nIndex;
            public int m_nLength;
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, object oParam)
                : base(fCallback, oParam)
            {
            }
            public override void Close()
            {
            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.Unknown;
            }
            public void SetStorageTreeNode(StorageTreeNode oStorageTreeNode)
            {
                m_oStorageTreeNode = oStorageTreeNode;
                m_nIndex = -1;
                m_nLength = oStorageTreeNode.m_aSubNodes.Count;
            }
            public StorageTreeNode getNextTreeNode()
            {
                StorageTreeNode oRes = null;
                if (m_nIndex < 0)
                    m_nIndex = 0;
                else
                    m_nIndex++;
                if (m_nIndex < m_nLength)
                {
                    while (true)
                    {
                        StorageTreeNode oCurItem = m_oStorageTreeNode.m_aSubNodes[m_nIndex];
                        if (false == oCurItem.m_bIsDirectory)
                        {
                            oRes = oCurItem;
                            break;
                        }
                        if (m_nIndex >= m_nLength)
                            break;
                        m_nIndex++;
                    }
                }
                return oRes;
            }
        }
        private TransportClass m_oGetMediaXml;
        private TransportClass m_oWriteMediaXml;
        public void GetMediaXmlBegin(string sPath, AsyncCallback fAsyncCallback, object oParam)
        {
            m_oGetMediaXml = new TransportClass(fAsyncCallback, oParam);
            m_oGetMediaXml.m_sPath = sPath;
            m_oGetMediaXml.m_aMediaXmlMapFilename = new Dictionary<string, string>();
            m_oGetMediaXml.m_aMediaXmlMapHash = new Dictionary<string, string>();

            StorageFileInfo oStorageFileInfo;
            ErrorTypes eFileExist = m_oGetMediaXml.m_oStorage.GetFileInfo(sPath, out oStorageFileInfo);
            if (ErrorTypes.NoError == eFileExist && null != oStorageFileInfo)
            {
                
                m_oGetMediaXml.m_oStorage.ReadFileBegin(sPath, m_oGetMediaXml.m_oMemoryStream, ReadMediaXmlCallback, null);
            }
            else
            {
                
                m_oGetMediaXml.m_oStorage.GetTreeNodeBegin(Path.GetDirectoryName(sPath), GetTreeNodeCallback, null);
            }
        }
        public ErrorTypes GetMediaXmlEnd(IAsyncResult ar, out Dictionary<string, string> aMediaXmlMapHash, out Dictionary<string, string> aMediaXmlMapFilename)
        {
            aMediaXmlMapHash = m_oGetMediaXml.m_aMediaXmlMapHash;
            aMediaXmlMapFilename = m_oGetMediaXml.m_aMediaXmlMapFilename;
            return ErrorTypes.NoError;
        }
        private void ReadMediaXmlCallback(IAsyncResult ar)
        {
            try
            {
                int nReadWriteBytes;
                m_oGetMediaXml.m_eError = m_oGetMediaXml.m_oStorage.ReadFileEnd(ar, out nReadWriteBytes);
                if (ErrorTypes.NoError == m_oGetMediaXml.m_eError || ErrorTypes.StorageFileNoFound == m_oGetMediaXml.m_eError)
                {
                    MemoryStream oMemoryStream = m_oGetMediaXml.m_oMemoryStream;
                    if (nReadWriteBytes > 0)
                    {
                        string sXml = Encoding.UTF8.GetString(oMemoryStream.GetBuffer(), 0, (int)oMemoryStream.Position);
                        using (XmlTextReader reader = new XmlTextReader(new StringReader(sXml)))
                        {
                            
                            while (reader.Read())
                            {
                                if ("image" == reader.Name)
                                {
                                    string sHash = null;
                                    string sFilename = null;
                                    while (reader.MoveToNextAttribute()) 
                                    {
                                        if ("md5" == reader.Name)
                                            sHash = reader.Value;
                                        else if ("filename" == reader.Name)
                                            sFilename = reader.Value;
                                    }
                                    if (null != sHash && null != sFilename)
                                    {
                                        m_oGetMediaXml.m_aMediaXmlMapHash[sHash] = sFilename;
                                        m_oGetMediaXml.m_aMediaXmlMapFilename[sFilename] = sHash;
                                    }
                                }
                            }
                        }
                    }
                }
                m_oGetMediaXml.FireCallback();
            }
            catch
            {
                m_oGetMediaXml.DisposeAndCallback();
            }
        }
        private void GetTreeNodeCallback(IAsyncResult ar)
        {
            try
            {
                m_oGetMediaXml.SetStorageTreeNode(m_oGetMediaXml.m_oStorage.GetTreeNodeEnd(ar));
                m_oGetMediaXml.m_ogetMD5HexStringDelegate = new Utils.getMD5HexStringDelegate(Utils.getMD5HexString);
                m_oGetMediaXml.m_oMemoryStream = new MemoryStream();
                StorageTreeNode oFirstItem = m_oGetMediaXml.getNextTreeNode();
                if (null != oFirstItem)
                {
                    
                    m_oGetMediaXml.m_oStorage.ReadFileBegin(Path.Combine(Path.GetDirectoryName(m_oGetMediaXml.m_sPath), oFirstItem.m_sName), m_oGetMediaXml.m_oMemoryStream, ReadNextMediaXmlCallback, null);
                }
                else
                {
                    m_oGetMediaXml.FireCallback();
                }
            }
            catch
            {
                m_oGetMediaXml.DisposeAndCallback();
            }
        }
        private void ReadNextMediaXmlCallback(IAsyncResult ar)
        {
            try
            {
                int nReadWriteBytes;
                ErrorTypes eError = m_oGetMediaXml.m_oStorage.ReadFileEnd(ar, out nReadWriteBytes);
                if (ErrorTypes.NoError == eError)
                {
                    StorageTreeNode oCurNode = m_oGetMediaXml.m_oStorageTreeNode.m_aSubNodes[m_oGetMediaXml.m_nIndex];
                    
                    m_oGetMediaXml.m_oMemoryStream.Position = 0;
                    string sHex = Utils.getMD5HexString(m_oGetMediaXml.m_oMemoryStream);
                    if (false == m_oGetMediaXml.m_aMediaXmlMapFilename.ContainsKey(oCurNode.m_sName))
                        m_oGetMediaXml.m_aMediaXmlMapFilename.Add(oCurNode.m_sName, sHex);
                    if (false == m_oGetMediaXml.m_aMediaXmlMapHash.ContainsKey(sHex))
                        m_oGetMediaXml.m_aMediaXmlMapHash.Add(sHex, oCurNode.m_sName);
                    oCurNode = m_oGetMediaXml.getNextTreeNode();
                    if (null == oCurNode)
                    {
                        m_oGetMediaXml.FireCallback();
                    }
                    else
                    {
                        m_oGetMediaXml.m_oMemoryStream = new MemoryStream();
                        m_oGetMediaXml.m_oStorage.ReadFileBegin(Path.Combine(Path.GetDirectoryName(m_oGetMediaXml.m_sPath), oCurNode.m_sName), m_oGetMediaXml.m_oMemoryStream, ReadNextMediaXmlCallback, null);
                    }
                }
                else
                    m_oGetMediaXml.DisposeAndCallback();
            }
            catch
            {
                m_oGetMediaXml.DisposeAndCallback();
            }
        }
        public void WriteMediaXmlBegin(string sPath, Dictionary<string, string> aMediaXmlMapHash, AsyncCallback fAsyncCallback, object oParam)
        {
            m_oWriteMediaXml = new TransportClass(fAsyncCallback, oParam);
            try
            {
                
                StringBuilder sb = new StringBuilder();
                sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
                sb.Append("<images>");
                foreach (KeyValuePair<string, string> kvp in aMediaXmlMapHash)
                    sb.AppendFormat("<image md5=\"{0}\" filename=\"{1}\"/>", kvp.Key, kvp.Value);
                sb.Append("</images>");
                byte[] aBuffer = Encoding.UTF8.GetBytes(sb.ToString());
                MemoryStream ms = new MemoryStream(aBuffer);
                m_oWriteMediaXml.m_oStorage = new Storage();
                m_oWriteMediaXml.m_oStorage.WriteFileBegin(sPath, ms, fAsyncCallback, oParam);
            }
            catch
            {
                m_oWriteMediaXml.DisposeAndCallback();
            }
        }
        public ErrorTypes WriteMediaXmlEnd(IAsyncResult ar)
        {
            try
            {
                int nReadWriteBytes;
                m_oWriteMediaXml.m_eError = m_oWriteMediaXml.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            }
            catch
            {
                m_oWriteMediaXml.Dispose();
            }
            return m_oWriteMediaXml.m_eError;
        }
    }
    public class AsyncDownloadOperation
    {
        private int m_nMaxSize;
        private AsyncCallback m_fAsyncCallback;
        private object m_oParam;
        private WebClient m_oWebClient;
        private Stream m_oReadStream;
        private byte[] m_aBuffer;
        private MemoryStream m_oOutput;
        private ErrorTypes m_eError;
        public AsyncDownloadOperation(int nMaxSize)
        {
            m_nMaxSize = nMaxSize;
            m_eError = ErrorTypes.NoError;
            m_oWebClient = null;
            m_oReadStream = null;
            m_oOutput = null;
        }
        private void Clear()
        {
            try
            {
                if (null != m_oWebClient)
                    m_oWebClient.Dispose();
                if (null != m_oReadStream)
                    m_oReadStream.Dispose();
                if (null != m_oOutput)
                    m_oOutput.Dispose();
            }
            catch
            {
            }
        }
        private void FireCallback()
        {
            if (null != m_fAsyncCallback)
                m_fAsyncCallback.Invoke(new AsyncOperationData(m_oParam));
        }
        private void ClearAndCallback()
        {
            Clear();
            FireCallback();
        }
        public void DownloadBegin(string sUrl, AsyncCallback fCallback, object oParam)
        {
            try
            {
                m_fAsyncCallback = fCallback;
                m_oParam = oParam;
                m_oWebClient = new WebClient();
                m_oWebClient.Headers.Add(HttpRequestHeader.UserAgent, Constants.mc_sWebClientUserAgent);
                m_oWebClient.OpenReadCompleted += new OpenReadCompletedEventHandler(m_oWebClient_OpenReadCompleted);
                m_oWebClient.OpenReadAsync(new Uri(sUrl));
            }
            catch
            {
                m_eError = ErrorTypes.Upload;
                ClearAndCallback();
            }
        }
        private void m_oWebClient_OpenReadCompleted(object sender, OpenReadCompletedEventArgs e)
        {
            try
            {
                if (!e.Cancelled && e.Error == null)
                {
                    m_oReadStream = e.Result;
                    int nCurBytes = Convert.ToInt32(m_oWebClient.ResponseHeaders["Content-Length"]);
                    if (m_nMaxSize > 0 && nCurBytes > m_nMaxSize)
                    {
                        m_eError = ErrorTypes.UploadContentLength;
                        ClearAndCallback();
                    }
                    else
                    {
                        m_oOutput = new MemoryStream((int)nCurBytes);
                        m_aBuffer = new byte[nCurBytes];
                        m_oReadStream.BeginRead(m_aBuffer, 0, nCurBytes, ReadCallback, null);
                    }
                }
                else
                {
                    m_eError = ErrorTypes.Upload;
                    ClearAndCallback();
                }
            }
            catch
            {
                m_eError = ErrorTypes.Upload;
                ClearAndCallback();
            }
        }
        private void ReadCallback(IAsyncResult ar)
        {
            try
            {
                int nBytesReaded = m_oReadStream.EndRead(ar);
                if (nBytesReaded > 0)
                {
                    m_oOutput.Write(m_aBuffer, 0, nBytesReaded);
                    m_oReadStream.BeginRead(m_aBuffer, 0, m_aBuffer.Length, ReadCallback, null);
                }
                else
                {
                    FireCallback();
                }
            }
            catch
            {
                m_eError = ErrorTypes.Upload;
                ClearAndCallback();
            }
        }
        public void DownloadEnd(IAsyncResult ar, out ErrorTypes eError, out byte[] aBuffer)
        {
            eError = m_eError;
            aBuffer = null;
            try
            {
                if (ErrorTypes.NoError == m_eError)
                    aBuffer = m_oOutput.ToArray();
                Clear();
            }
            catch
            {
                m_eError = ErrorTypes.Upload;
            }
        }
    }
    #endregion
}
