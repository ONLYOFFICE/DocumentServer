<%@ WebHandler Language="C#" Class="UploadService" %>
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
using System.Net;
using System.Configuration;
using System.Web;
using System.IO;
using System.Text;
using System.Xml;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Collections.Specialized;

using FileConverterUtils2;

using log4net;

public class UploadService : IHttpAsyncHandler
{
    private readonly ILog _log = LogManager.GetLogger(typeof(UploadService));
    
    public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, Object extraData)
    {
        _log.Info("Starting process request...");
        _log.Info(context.Request.Params.ToString());

        TransportClassMainAshx oTransportClassMainAshx = new TransportClassMainAshx(context, cb);
        ErrorTypes eError = ErrorTypes.NoError;
        try
        {
            string sGuid = context.Request.QueryString["key"];
            int nMaxBytes = Convert.ToInt32(ConfigurationSettings.AppSettings["limits.image.size"] ?? "25000000");
            if (context.Request.ContentLength <= nMaxBytes)
            {
                if (context.Request.Files.Count > 0)
                {
                    HttpPostedFile file = context.Request.Files[0];
                    string sFileExtension = Path.GetExtension(file.FileName).ToLower();
                    
                    int nParamsCount = 0;
                    string sInputParams = "";
                    for (int i = 0, length = context.Request.Params.Count; i < length; ++i)
                    {
                        sInputParams += context.Request.Params.Get(i) + ":" + context.Request.Params.GetKey(i);
                        if (nParamsCount > 0)
                            sInputParams += ",";
                        nParamsCount++;
                    }
                    AsyncMediaXmlOperation oAsyncMediaXmlOperation = new AsyncMediaXmlOperation();
                    TransportClass1 oTransportClass1 = new TransportClass1(oTransportClassMainAshx, oAsyncMediaXmlOperation, context.Request.QueryString, sGuid, Path.Combine(sGuid, @"media/media.xml"), file);
                    oAsyncMediaXmlOperation.GetMediaXmlBegin(oTransportClass1.m_sMediaXml, GetMediaXmlCallback, oTransportClass1);
                }
                else
                    eError = ErrorTypes.UploadCountFiles;
            }
            else
                eError = ErrorTypes.UploadContentLength;
        }
        catch(Exception e)
        {
            eError = ErrorTypes.Upload;
            
            _log.Error(context.Request.Params.ToString());
            _log.Error("Exeption: ", e);
        }
        if (ErrorTypes.NoError != eError)
            WriteToResponse(oTransportClassMainAshx, eError, null, context.Request.QueryString);
        return new AsyncOperationData(extraData);
    }
    public void EndProcessRequest(IAsyncResult result)
    {
    }
    public void ProcessRequest(HttpContext context)
    {
        throw new InvalidOperationException();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    #region HelpFunctions
    private void WriteToResponse(TransportClassMainAshx oTransportClassMainAshx, ErrorTypes eError, string sPath, NameValueCollection aNameValueCollection)
    {
        HttpContext oHttpContext = oTransportClassMainAshx.m_oHttpContext;
        AsyncCallback oAsyncCallback = oTransportClassMainAshx.m_oAsyncCallback;
        OutputCommand oOutputCommand = new OutputCommand();
        if (null != aNameValueCollection)
        {
            
            for (int i = 0, length = aNameValueCollection.Count; i < length; ++i)
                oOutputCommand.input.Add(aNameValueCollection.GetKey(i), aNameValueCollection.Get(i));
        }
        if (null != sPath)
            oOutputCommand.url = sPath;
        oOutputCommand.error = (int)eError;
        oOutputCommand.type = (int)PostMessageType.UploadImage;

        JavaScriptSerializer serializer = new JavaScriptSerializer();
        StringBuilder sb = new StringBuilder();
        serializer.Serialize(oOutputCommand, sb);
        string sJson = sb.ToString();

        oHttpContext.Response.Write("<html><head><script type=\"text/javascript\">function load(){ parent.postMessage(\"" + sJson.Replace("\"", "\\\"") + "\", '*'); }</script></head><body onload='load()'></body></html>");

        oAsyncCallback.Invoke(new AsyncOperationData(null));
    }
    #endregion
    #region Callbacks
    private void GetMediaXmlCallback(IAsyncResult ar)
    {
        TransportClass1 oTransportClass1 = ar.AsyncState as TransportClass1;
        try
        {
            Dictionary<string, string> aMediaXmlMapHash;
            Dictionary<string, string> aMediaXmlMapFilename;
            ErrorTypes eError = oTransportClass1.m_oAsyncMediaXmlOperation.GetMediaXmlEnd(ar, out aMediaXmlMapHash, out aMediaXmlMapFilename);
            if (ErrorTypes.NoError == eError)
            {
                AsyncContextReadOperation oAsyncContextReadOperation = new AsyncContextReadOperation();
                TransportClass2 oTransportClass2 = new TransportClass2(oTransportClass1, aMediaXmlMapHash, aMediaXmlMapFilename, oAsyncContextReadOperation);
                oTransportClass1.m_oFile.InputStream.Position = 0;
                oAsyncContextReadOperation.ReadContextBegin(oTransportClass1.m_oFile.InputStream, ReadContextCallback, oTransportClass2);
            }
            else
                WriteToResponse(oTransportClass1, ErrorTypes.Upload, null, oTransportClass1.m_aInputParams);
        }
        catch
        {
            WriteToResponse(oTransportClass1, ErrorTypes.Upload, null, oTransportClass1.m_aInputParams);
        }
    }
    private void ReadContextCallback(IAsyncResult ar)
    {
        TransportClass2 oTransportClass2 = ar.AsyncState as TransportClass2;
        try
        {
            ErrorTypes eError = oTransportClass2.m_oAsyncContextReadOperation.ReadContextEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                byte[] aBuffer = oTransportClass2.m_oAsyncContextReadOperation.m_aBuffer;
                int nImageFormat = Utils.GetFileFormat(aBuffer);
                string sSupportedFormats = ConfigurationSettings.AppSettings["limits.image.types.upload"] ?? "jpg";
                if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE & nImageFormat) && -1 != sSupportedFormats.IndexOf(FileFormats.ToString(nImageFormat)))
                {
                    string sImageHash = null;
                    using (MemoryStream ms = new MemoryStream(aBuffer))
                        sImageHash = Utils.getMD5HexString(ms);
                    
                    string sFileName;
                    if (oTransportClass2.m_oMediaXmlMapHash.TryGetValue(sImageHash, out sFileName))
                    {
                        
                        string sUrl = Constants.mc_sResourceServiceUrlRel + Path.Combine(oTransportClass2.m_sKey, @"media\" + sFileName).Replace('\\', '/');
                        WriteToResponse(oTransportClass2, ErrorTypes.NoError, sUrl, oTransportClass2.m_aInputParams);
                    }
                    else
                    {
                        
                        string sSearchName = "image";
                        List<int> aIndexes = new List<int>();
                        foreach (KeyValuePair<string, string> kvp in oTransportClass2.m_oMediaXmlMapFilename)
                        {
                            string sFilename = Path.GetFileNameWithoutExtension(kvp.Key);
                            if (0 == sFilename.IndexOf(sSearchName))
                            {
                                int nCurIndex;
                                if (int.TryParse(sFilename.Substring(sSearchName.Length), out nCurIndex))
                                    aIndexes.Add(nCurIndex);
                            }
                        }
                        int nMaxIndex = -1;
                        for (int i = 0, length = aIndexes.Count; i < length; ++i)
                        {
                            int nCurIndex = aIndexes[i];
                            if (nMaxIndex < nCurIndex)
                                nMaxIndex = nCurIndex;
                        }
                        int nNewIndex = 1;
                        if (nMaxIndex >= nNewIndex)
                            nNewIndex = nMaxIndex + 1;
                        string sNewName = sSearchName + nNewIndex + "." + FileFormats.ToString(nImageFormat);
                        
                        string sNewPath = Path.Combine(oTransportClass2.m_sKey, @"media\" + sNewName).Replace('\\', '/');
                        Storage oStorage = new Storage();
                        TransportClass3 oTransportClass3 = new TransportClass3(oTransportClass2, sNewName, sImageHash, sNewPath, oStorage);
                        oTransportClass2.m_oFile.InputStream.Position = 0;
                        oTransportClass3.m_oStorage.WriteFileBegin(sNewPath, oTransportClass2.m_oFile.InputStream, WriteUploadedFileCallback, oTransportClass3);
                    }
                }
                else
                    WriteToResponse(oTransportClass2, ErrorTypes.UploadExtension, null, oTransportClass2.m_aInputParams);
            }
            else
                WriteToResponse(oTransportClass2, eError, null, oTransportClass2.m_aInputParams);
        }
        catch
        {
            WriteToResponse(oTransportClass2, ErrorTypes.Upload, null, oTransportClass2.m_aInputParams);
        }
    }
    private void WriteUploadedFileCallback(IAsyncResult ar)
    {
        TransportClass3 oTransportClass3 = ar.AsyncState as TransportClass3;
        try
        {
            int nReadWriteBytes;
            ErrorTypes eError = oTransportClass3.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            if (ErrorTypes.NoError == eError)
            {
                oTransportClass3.m_oMediaXmlMapHash.Add(oTransportClass3.m_sHash, oTransportClass3.m_sFilename);
                oTransportClass3.m_oAsyncMediaXmlOperation.WriteMediaXmlBegin(oTransportClass3.m_sMediaXml, oTransportClass3.m_oMediaXmlMapHash, WriteMediaXmlCallback, oTransportClass3);
            }
            else
                WriteToResponse(oTransportClass3, eError, null, oTransportClass3.m_aInputParams);
        }
        catch
        {
            WriteToResponse(oTransportClass3, ErrorTypes.Upload, null, oTransportClass3.m_aInputParams);
        }
    }
    private void WriteMediaXmlCallback(IAsyncResult ar)
    {
        TransportClass3 oTransportClass3 = ar.AsyncState as TransportClass3;
        try
        {
            ErrorTypes eError = oTransportClass3.m_oAsyncMediaXmlOperation.WriteMediaXmlEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                string sUrl = Constants.mc_sResourceServiceUrlRel + oTransportClass3.m_sPath.Replace('\\', '/');
                WriteToResponse(oTransportClass3, ErrorTypes.NoError, sUrl, oTransportClass3.m_aInputParams);
            }
            else
                WriteToResponse(oTransportClass3, ErrorTypes.Upload, null, oTransportClass3.m_aInputParams);
        }
        catch
        {
            WriteToResponse(oTransportClass3, ErrorTypes.Upload, null, oTransportClass3.m_aInputParams);
        }
    }
    #endregion
    #region TransportClass
    private class TransportClass1 : TransportClassMainAshx
    {
        public AsyncMediaXmlOperation m_oAsyncMediaXmlOperation;
        public NameValueCollection m_aInputParams;
        public string m_sKey;
        public string m_sMediaXml;
        public HttpPostedFile m_oFile;

        public TransportClass1(TransportClassMainAshx oTransportClassMainAshx, AsyncMediaXmlOperation oAsyncMediaXmlOperation, NameValueCollection aInputParams, string sKey, string sMediaXml, HttpPostedFile oFile)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncMediaXmlOperation = oAsyncMediaXmlOperation;
            m_aInputParams = aInputParams;
            m_sKey = sKey;
            m_oFile = oFile;
            m_sMediaXml = sMediaXml;
        }
    }
    private class TransportClass2 : TransportClass1
    {
        public Dictionary<string, string> m_oMediaXmlMapHash = new Dictionary<string, string>();
        public Dictionary<string, string> m_oMediaXmlMapFilename = new Dictionary<string, string>();
        public AsyncContextReadOperation m_oAsyncContextReadOperation;
        public TransportClass2(TransportClass1 oTransportClass1, Dictionary<string, string> oMediaXmlMapHash, Dictionary<string, string> oMediaXmlMapFilename, AsyncContextReadOperation oAsyncContextReadOperation)
            : base(oTransportClass1, oTransportClass1.m_oAsyncMediaXmlOperation, oTransportClass1.m_aInputParams, oTransportClass1.m_sKey, oTransportClass1.m_sMediaXml, oTransportClass1.m_oFile)
        {
            m_oMediaXmlMapHash = oMediaXmlMapHash;
            m_oMediaXmlMapFilename = oMediaXmlMapFilename;
            m_oAsyncContextReadOperation = oAsyncContextReadOperation;
        }
    }
    private class TransportClass3 : TransportClass2
    {
        public string m_sFilename;
        public string m_sHash;
        public string m_sPath;
        public Storage m_oStorage;
        public TransportClass3(TransportClass2 oTransportClass2, string sFilename, string sHash, string sPath, Storage oStorage)
            : base(new TransportClass1(oTransportClass2, oTransportClass2.m_oAsyncMediaXmlOperation, oTransportClass2.m_aInputParams, oTransportClass2.m_sKey, oTransportClass2.m_sMediaXml, oTransportClass2.m_oFile), oTransportClass2.m_oMediaXmlMapHash, oTransportClass2.m_oMediaXmlMapFilename, oTransportClass2.m_oAsyncContextReadOperation)
        {
            m_sFilename = sFilename;
            m_sHash = sHash;
            m_sPath = sPath;
            m_oStorage = oStorage;
        }
    }
    public class OutputCommand
    {
        public int type;
        public string url;
        public int error;
        public Dictionary<string, object> input = new Dictionary<string,object>();
    }
    #endregion
}