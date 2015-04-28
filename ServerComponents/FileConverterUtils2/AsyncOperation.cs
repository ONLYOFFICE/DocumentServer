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
using System.Threading;
using System.Web;
using System.IO;
using System.Xml;
using System.Net;
using log4net;

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
    public class TransportClassContextRead : TransportClassMainAshx
    {
        public AsyncContextReadOperation m_oAsyncContextReadOperation;
        public TransportClassContextRead(TransportClassMainAshx m_oTransportClassMainAshx, AsyncContextReadOperation oAsyncContextReadOperation)
            : base(m_oTransportClassMainAshx.m_oHttpContext, m_oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncContextReadOperation = oAsyncContextReadOperation;
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
        private static readonly ILog _log = LogManager.GetLogger(typeof(AsyncContextReadOperation));
        private Stream m_oStream = null;
        private byte[] m_aBuffer = new byte[Constants.mc_nBufferSize];
        public MemoryStream m_aOutput = new MemoryStream();
        private ErrorTypes m_eError = ErrorTypes.NoError;
        private AsyncCallback m_fAsyncCallback;
        private object m_oParam;
        private Int64 m_nMaxSize = -1;
        public AsyncContextReadOperation()
        {
        }
        public AsyncContextReadOperation(Int64 nMaxSize)
        {
            m_nMaxSize = nMaxSize;
        }
        public ErrorTypes ReadContext(Stream oStream)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                byte[] aBuffer = new byte[Constants.mc_nBufferSize];
                int read;
                while ((read = oStream.Read(aBuffer, 0, aBuffer.Length)) > 0)
                {
                    m_aOutput.Write(aBuffer, 0, read);
                    if (m_nMaxSize > 0 && m_aOutput.Length > m_nMaxSize)
                    {
                        _log.ErrorFormat("ReadContext object size {0} exceed max {1}", m_aOutput.Length, m_nMaxSize);
                        eError = ErrorTypes.ReadRequestStream;
                        break;
                    }
                }
                try
                {
                    if (oStream.CanSeek && oStream.Length != m_aOutput.Length)
                        _log.ErrorFormat("ClearCacheTaskResultCallback read {0} of {1}", m_aOutput.Length, oStream.Length);
                }
                catch { }
            }
            catch
            {
                eError = ErrorTypes.ReadRequestStream;
            }
            return eError;
        }
        public void ReadContextBegin(Stream oStream, AsyncCallback fCallback, object oParam)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                m_oStream = oStream;
                m_fAsyncCallback = fCallback;
                m_oParam = oParam;
                m_oStream.BeginRead(m_aBuffer, 0, m_aBuffer.Length, ClearCacheTaskResultCallback, null);
            }
            catch
            {
                eError = ErrorTypes.ReadRequestStream;
            }
            if (ErrorTypes.NoError != eError)
            {
                m_eError = eError;
                fCallback.Invoke(new AsyncOperationData(oParam));
            }
        }
        private void ClearCacheTaskResultCallback(IAsyncResult ar)
        {
            try
            {
                int nByteRead = m_oStream.EndRead(ar);
                if (nByteRead > 0)
                {
                    m_aOutput.Write(m_aBuffer, 0, nByteRead);
                    if (m_nMaxSize > 0 && m_aOutput.Length > m_nMaxSize)
                    {
                        _log.ErrorFormat("ClearCacheTaskResultCallback object size {0} exceed max {1}", m_aOutput.Length, m_nMaxSize);
                        m_eError = ErrorTypes.ReadRequestStream;
                        m_fAsyncCallback.Invoke(new AsyncOperationData(m_oParam));
                    }
                    else
                        m_oStream.BeginRead(m_aBuffer, 0, m_aBuffer.Length, ClearCacheTaskResultCallback, null);
                }
                else
                {
                    try
                    {
                        if (m_oStream.CanSeek && m_oStream.Length != m_aOutput.Length)
                            _log.ErrorFormat("ClearCacheTaskResultCallback read {0} of {1}", m_aOutput.Length, m_oStream.Length);
                    }
                    catch { }
                    m_fAsyncCallback.Invoke(new AsyncOperationData(m_oParam));
                }
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in ClearCacheTaskResultCallback:", e);
                m_eError = ErrorTypes.ReadRequestStream;
                m_fAsyncCallback.Invoke(new AsyncOperationData(m_oParam));
            }
        }
        public ErrorTypes ReadContextEnd(IAsyncResult ar)
        {
            return m_eError;
        }
    }
    public class AsyncClearCacheOperation
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(AsyncClearCacheOperation));
        private string m_sKey;
        private ITaskResultInterface m_oTaskResult = TaskResult.NewTaskResult();
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
            catch(Exception e)
            {
                _log.ErrorFormat("Exception catched in ClearCacheBegin:", e);
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
                {
                    m_oStorage.RemovePathBegin(m_sKey, ClearCacheAllCallback, null);
                }
                else
                {
                    _log.ErrorFormat("m_oTaskResult.RemoveEnd return:", m_eError);
                    FireCallback();
                }
            }
            catch(Exception e)
            {
                _log.ErrorFormat("Exception catched in ClearCacheTaskResultCallback:", e);
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
            catch(Exception e)
            {
                _log.ErrorFormat("Exception catched in ClearCacheAllCallback:", e);
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
        public ErrorTypes GenerateMediaXmlRealPath(string sPath)
        {
            ErrorTypes eRes = ErrorTypes.NoError;
            Dictionary<string, string> aMediaXmlMapHash = new Dictionary<string, string>();
            Dictionary<string, string> aMediaXmlMapFilename = new Dictionary<string, string>();
            string sDir = Path.GetDirectoryName(sPath);
            if (Directory.Exists(sDir))
            {
                string[] aFiles = Directory.GetFiles(sDir);
                for (int i = 0; i < aFiles.Length; ++i)
                {
                    var filepath = aFiles[i];
                    using (FileStream fs = new FileStream(filepath, FileMode.Open, FileAccess.Read))
                        AddToMediaXmlBytes(aMediaXmlMapHash, aMediaXmlMapFilename, Path.GetFileName(filepath),fs);
                }
            }
            else
                eRes = ErrorTypes.Unknown;
            File.WriteAllBytes(sPath, GetMediaXmlBytes(aMediaXmlMapHash));
            return eRes;
        }
        public ErrorTypes GenerateMediaXml(string sPath)
        {
            ErrorTypes eRes = ErrorTypes.NoError;
            Dictionary<string, string> aMediaXmlMapHash = new Dictionary<string, string>();
            Dictionary<string, string> aMediaXmlMapFilename = new Dictionary<string, string>();

            Storage oStorage = new Storage();
            StorageTreeNode oStorageTreeNode = oStorage.GetTreeNode(Path.GetDirectoryName(sPath));
            if (null != oStorageTreeNode)
            {
                for (int i = 0, length = oStorageTreeNode.m_aSubNodes.Count; i < length; ++i)
                {
                    StorageTreeNode oSubNode = oStorageTreeNode.m_aSubNodes[i];
                    if (!oSubNode.m_bIsDirectory)
                    {
                        string sFilePath = Path.Combine(Path.GetDirectoryName(sPath), oSubNode.m_sName);
                        using (MemoryStream ms = new MemoryStream())
                        {
                            int nReadWriteBytes;
                            ErrorTypes eReadError = oStorage.ReadFile(sFilePath, ms, out nReadWriteBytes);
                            if (ErrorTypes.NoError == eReadError && nReadWriteBytes > 0)
                            {
                                ms.Position = 0;
                                AddToMediaXmlBytes(aMediaXmlMapHash, aMediaXmlMapFilename, oSubNode.m_sName, ms);
                            }
                        }
                    }
                }
                byte[] aBuffer = GetMediaXmlBytes(aMediaXmlMapHash);
                using (MemoryStream ms = new MemoryStream(aBuffer))
                {
                    int nReadWriteBytes;
                    eRes = oStorage.WriteFile(sPath, ms, out nReadWriteBytes);
                }
            }
            else
                eRes = ErrorTypes.Unknown;
            return eRes;
        }
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
                
                byte[] aBuffer = GetMediaXmlBytes(aMediaXmlMapHash);
                MemoryStream ms = new MemoryStream(aBuffer);
                m_oWriteMediaXml.m_oStorage = new Storage();
                m_oWriteMediaXml.m_oStorage.WriteFileBegin(sPath, ms, fAsyncCallback, oParam);
            }
            catch
            {
                m_oWriteMediaXml.DisposeAndCallback();
            }
        }
        private void AddToMediaXmlBytes(Dictionary<string, string> aMediaXmlMapHash, Dictionary<string, string> aMediaXmlMapFilename, string sFilename, Stream ms)
        {
            string sHex = Utils.getMD5HexString(ms);
            if (false == aMediaXmlMapFilename.ContainsKey(sFilename))
                aMediaXmlMapFilename.Add(sFilename, sHex);
            if (false == aMediaXmlMapHash.ContainsKey(sHex))
                aMediaXmlMapHash.Add(sHex, sFilename);
        }
        private byte[] GetMediaXmlBytes(Dictionary<string, string> aMediaXmlMapHash)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.Append("<images>");
            foreach (KeyValuePair<string, string> kvp in aMediaXmlMapHash)
                sb.AppendFormat("<image md5=\"{0}\" filename=\"{1}\"/>", kvp.Key, kvp.Value);
            sb.Append("</images>");
            return Encoding.UTF8.GetBytes(sb.ToString());
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
    public class AsyncWebRequestOperation
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(AsyncWebRequestOperation));
        private class TransportClass
        {
            public AsyncCallback m_fAsyncCallback;
            public object m_oParam;
            public string m_sUrl;
            public string m_sMethod;
            public string m_sContentType;
            public byte[] m_aInput;

            public Timer m_oTimer;
            public HttpWebRequest m_oWebRequest;
            public HttpWebResponse m_oHttpWebResponse;
            public Stream m_oStream;
            public AsyncContextReadOperation m_oAsyncContextReadOperation;

            public byte[] m_aOutput;
            public ErrorTypes m_eError;

            public uint m_nAttemptCount;
            public uint m_nAttemptDelay;
            public TransportClass(AsyncCallback fCallback, object oParam, string sUrl, string sMethod, string sContentType, byte[] aData, uint nAttemptCount, uint nAttemptDelay) 
            {
                m_fAsyncCallback = fCallback;
                m_oParam = oParam;
                m_sUrl = sUrl;
                m_sMethod = sMethod;
                m_sContentType = sContentType;
                m_aInput = aData;

                m_oTimer = null;
                m_oWebRequest = null;
                m_oHttpWebResponse = null;
                m_oStream = null;
                m_oAsyncContextReadOperation = null;

                m_aOutput = null;
                m_eError = ErrorTypes.NoError;

                m_nAttemptCount = nAttemptCount;
                m_nAttemptDelay = nAttemptDelay;
            }
        }
        private uint m_nAttemptCount = 1;
        private uint m_nAttemptDelay = 0;
        private Int64 m_nMaxSize = -1;
        public AsyncWebRequestOperation()
        {
        }
        public AsyncWebRequestOperation(Int64 nMaxSize)
        {
            m_nMaxSize = nMaxSize;
        }
        public AsyncWebRequestOperation(uint nAttemptCount, uint nAttemptDelay)
        {
            m_nAttemptCount = nAttemptCount;
            m_nAttemptDelay = nAttemptDelay;
        }
        public AsyncWebRequestOperation(Int64 nMaxSize, uint nAttemptCount, uint nAttemptDelay)
        {
            m_nAttemptCount = nAttemptCount;
            m_nAttemptDelay = nAttemptDelay;
            m_nMaxSize = nMaxSize;
        }
        private void Clear(TransportClass oTransportClass)
        {
            if (null != oTransportClass.m_oStream)
                oTransportClass.m_oStream.Close();
            if (null != oTransportClass.m_oHttpWebResponse)
                oTransportClass.m_oHttpWebResponse.Close();
        }
        private void FireCallback(TransportClass oTransportClass)
        {
            if (null != oTransportClass.m_fAsyncCallback)
                oTransportClass.m_fAsyncCallback.Invoke(new AsyncOperationData(oTransportClass.m_oParam));
        }
        private void ClearAndCallback(TransportClass oTransportClass)
        {
            ClearAndCallback(oTransportClass, false);
        }
        private void ClearAndCallback(TransportClass oTransportClass, bool bRepeatIfCan)
        {
            oTransportClass.m_nAttemptCount--;
            Clear(oTransportClass);
            if (!bRepeatIfCan || oTransportClass.m_nAttemptCount <= 0)
            {
                FireCallback(oTransportClass);
            }
            else
            {
                oTransportClass.m_eError = ErrorTypes.NoError;
                Timer oTimer = new Timer(WaitEndTimerCallback, oTransportClass, TimeSpan.FromMilliseconds(-1), TimeSpan.FromMilliseconds(-1));
                oTransportClass.m_oTimer = oTimer;
                oTimer.Change(TimeSpan.FromMilliseconds(oTransportClass.m_nAttemptDelay), TimeSpan.FromMilliseconds(-1));
            }
        }
        private void WaitEndTimerCallback(Object stateInfo)
        {
            TransportClass oTransportClass1 = stateInfo as TransportClass;
            if (null != oTransportClass1.m_oTimer)
                oTransportClass1.m_oTimer.Dispose();
            RequestBeginExec(oTransportClass1);
        }
        public ErrorTypes Request(string sUrl, string sMethod, string sContentType, byte[] aData, out byte[] aOutput)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            aOutput = null;
            try
            {

                ServicePointManager.ServerCertificateValidationCallback = (s, c, h, p) => true;

                WebResponse oWebResponse = null;
                int nAttemptCount = 0;
                bool bComplete = false;
                while (!bComplete && nAttemptCount < m_nAttemptCount)
                {
                    eError = ErrorTypes.NoError;
                    try
                    {
                        HttpWebRequest oWebRequest = (HttpWebRequest)HttpWebRequest.Create(sUrl);
                        oWebRequest.UserAgent = Constants.mc_sWebClientUserAgent;
                        if (!string.IsNullOrEmpty(sMethod))
                            oWebRequest.Method = sMethod;
                        if ("POST" == oWebRequest.Method)
                        {
                            if (!string.IsNullOrEmpty(sContentType))
                                oWebRequest.ContentType = sContentType;
                            else
                                oWebRequest.ContentType = "text/plain";
                            if (null != aData)
                                oWebRequest.ContentLength = aData.Length;
                            using (Stream postStream = oWebRequest.GetRequestStream())
                            {
                                if (null != aData)
                                    postStream.Write(aData, 0, aData.Length);
                            }
                        }
                        oWebResponse = oWebRequest.GetResponse();
                        bComplete = true;
                    }
                    catch (Exception e)
                    {
                        _log.Error("Exception catched in Request:", e);
                        eError = ErrorTypes.WebRequest;
                    }

                    nAttemptCount++;
                    if (!bComplete && nAttemptCount < m_nAttemptCount)
                        Thread.Sleep((int)m_nAttemptDelay);
                }
                if (null != oWebResponse)
                {
                    Int64 ContentLength = 0;
                    if (!Int64.TryParse(oWebResponse.Headers.Get("Content-Length"), out ContentLength))
                        ContentLength = 0;
                    if (m_nMaxSize > 0 && ContentLength > m_nMaxSize)
                    {
                        _log.ErrorFormat("Downloaded object size {0} exceed max {1}", ContentLength, m_nMaxSize);
                        eError = ErrorTypes.WebRequest;
                    }
                    else
                    {
                        using (Stream oResponseStream = oWebResponse.GetResponseStream())
                        {
                            AsyncContextReadOperation oAsyncContextReadOperation = new AsyncContextReadOperation(m_nMaxSize);
                            if (ErrorTypes.NoError == oAsyncContextReadOperation.ReadContext(oResponseStream))
                                aOutput = oAsyncContextReadOperation.m_aOutput.ToArray();
                            else
                                eError = ErrorTypes.WebRequest;
                        }
                    }
                    oWebResponse.Close();
                }
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in Request:", e);
                eError = ErrorTypes.WebRequest;
            }
            return eError;
        }
        public IAsyncResult RequestBegin(string sUrl, string sMethod, string sContentType, byte[] aData, AsyncCallback fCallback, object oParam)
        {
            TransportClass oTransportClass = new TransportClass(fCallback, oParam, sUrl, sMethod, sContentType, aData, m_nAttemptCount, m_nAttemptDelay);
            AsyncOperationData oAsyncOperationData = new AsyncOperationData(oTransportClass);
            RequestBeginExec(oTransportClass);
            return oAsyncOperationData;
        }
        private void RequestBeginExec(TransportClass oTransportClass)
        {
            try
            {

                ServicePointManager.ServerCertificateValidationCallback = (s, c, h, p) => true;

                HttpWebRequest oWebRequest = (HttpWebRequest)HttpWebRequest.Create(oTransportClass.m_sUrl);
                oWebRequest.UserAgent = Constants.mc_sWebClientUserAgent;
                oTransportClass.m_oWebRequest = oWebRequest;
                if (!string.IsNullOrEmpty(oTransportClass.m_sMethod))
                    oWebRequest.Method = oTransportClass.m_sMethod;
                if ("GET" == oWebRequest.Method)
                {
                    oWebRequest.BeginGetResponse(GetResponseCallback, oTransportClass);
                }
                else
                {
                    if (!string.IsNullOrEmpty(oTransportClass.m_sContentType))
                        oWebRequest.ContentType = oTransportClass.m_sContentType;
                    else
                        oWebRequest.ContentType = "text/plain";
                    if (null != oTransportClass.m_aInput)
                        oWebRequest.ContentLength = oTransportClass.m_aInput.Length;
                    oWebRequest.BeginGetRequestStream(GetRequestStreamCallback, oTransportClass);
                }
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in RequestBeginExec:", e);
                oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass, true);
            }
        }
        private void GetRequestStreamCallback(IAsyncResult ar)
        {
            TransportClass oTransportClass = ar.AsyncState as TransportClass;
            try
            {
                Stream postStream = oTransportClass.m_oWebRequest.EndGetRequestStream(ar);
                if (null != oTransportClass.m_aInput)
                    postStream.Write(oTransportClass.m_aInput, 0, oTransportClass.m_aInput.Length);
                postStream.Close();
                oTransportClass.m_oWebRequest.BeginGetResponse(GetResponseCallback, oTransportClass);
            }
            catch (WebException e)
            {
                _log.Error("WebException catched in GetResponseCallback:", e);
                _log.ErrorFormat("The Uri requested is {0}", oTransportClass.m_oWebRequest.RequestUri);
                oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass, true);
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in GetResponseCallback:", e);
                oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass, true);
            }
        }
        private void GetResponseCallback(IAsyncResult ar)
        {
            TransportClass oTransportClass = ar.AsyncState as TransportClass;
            try
            {
                HttpWebResponse response = (HttpWebResponse)oTransportClass.m_oWebRequest.EndGetResponse(ar);
                Int64 ContentLength = 0;
                if (!Int64.TryParse(response.Headers.Get("Content-Length"), out ContentLength))
                    ContentLength = 0;
                if (m_nMaxSize > 0 && ContentLength > m_nMaxSize)
                {
                    _log.ErrorFormat("Downloaded object size {0} exceed max {1}", ContentLength, m_nMaxSize);
                    oTransportClass.m_eError = ErrorTypes.WebRequest;
                    ClearAndCallback(oTransportClass);
                }
                else
                {
                    Stream streamResponse = response.GetResponseStream();
                    AsyncContextReadOperation oAsyncContextReadOperation = new AsyncContextReadOperation(m_nMaxSize);
                    oTransportClass.m_oHttpWebResponse = response;
                    oTransportClass.m_oStream = streamResponse;
                    oTransportClass.m_oAsyncContextReadOperation = oAsyncContextReadOperation;
                    oAsyncContextReadOperation.ReadContextBegin(streamResponse, ReadContextCallback, oTransportClass);
                }
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in GetRequestStreamCallback:", e);
                oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass, true);
            }
        }
        private void ReadContextCallback(IAsyncResult ar)
        {
            TransportClass oTransportClass = ar.AsyncState as TransportClass;
            try
            {
                ErrorTypes eError = oTransportClass.m_oAsyncContextReadOperation.ReadContextEnd(ar);
                if (ErrorTypes.NoError == eError)
                    oTransportClass.m_aOutput = oTransportClass.m_oAsyncContextReadOperation.m_aOutput.ToArray();
                else
                    oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass);
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in ReadContextCallback:", e);
                oTransportClass.m_eError = ErrorTypes.WebRequest;
                ClearAndCallback(oTransportClass);
            }
        }
        public ErrorTypes RequestEnd(IAsyncResult ar, out byte[] aOutput)
        {
            aOutput = null;
            ErrorTypes eError = ErrorTypes.WebRequest;
            try
            {
                TransportClass oTransportClass = ar.AsyncState as TransportClass;
                aOutput = oTransportClass.m_aOutput;
                eError = oTransportClass.m_eError;
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in RequestEnd:", e);
                eError = ErrorTypes.WebRequest;
            }
            return eError;
        }
    }
    #endregion
}
