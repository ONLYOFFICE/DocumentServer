<%@ WebHandler Language="C#" Class="FileUploader" %>
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
using System.Net;
using System.Configuration;
using System.Web;
using System.IO;
using System.Xml;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Collections.Specialized;

using FileConverterUtils2;

using log4net;

public class FileUploader : IHttpAsyncHandler
{
    private readonly ILog _log = LogManager.GetLogger(typeof(FileUploader));
    
    public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, Object extraData)
    {
        bool bStartAsync = false;
        ErrorTypes eError = ErrorTypes.Unknown;       
        try
        {
            _log.Info("Starting process request...");
            _log.Info(context.Request.QueryString.ToString());
                      
            string vKey = context.Request.QueryString["vkey"];
            string sKey = context.Request.QueryString["key"];

            if (null != sKey && false == string.IsNullOrEmpty(sKey))
            {
                eError = ErrorTypes.NoError;

                if (ErrorTypes.NoError == eError)
                {
                    bStartAsync = true;
                    Storage oStorage = new Storage();
                    string sTempKey = "temp_" + sKey;
                    string sFilename = sKey + ".tmp";
                    string sPath = sTempKey + "/" + sFilename;
                    AsyncContextReadOperation asynch = new AsyncContextReadOperation();
                    TransportClass oTransportClass = new TransportClass(context, cb, oStorage, asynch, sPath, sTempKey, sFilename);
                    asynch.ReadContextBegin(context.Request.InputStream, ReadContextCallback, oTransportClass);
                }
            }
        }
        catch(Exception e)
        {
            eError = ErrorTypes.Unknown;
            
            _log.Error(context.Request.QueryString.ToString());
            _log.Error("Exeption: ", e);
        }
        finally
        {
            if (ErrorTypes.NoError != eError)
                writeXml(context, null, null, null, eError);
        }
        
        TransportClass oTempTransportClass = new TransportClass(context, cb, null, null, null, null, null);
        if (false == bStartAsync)
            cb(new AsyncOperationData(oTempTransportClass));
        return new AsyncOperationData(oTempTransportClass);
    }
    public void EndProcessRequest(IAsyncResult result)
    {
    }
    public void ProcessRequest(HttpContext context)
    {
        throw new InvalidOperationException();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
    private void ReadContextCallback(IAsyncResult result)
    {
        TransportClass oTransportClass = result.AsyncState as TransportClass;
        try
        {
            oTransportClass.m_oAsyncContextRead.ReadContextEnd(result);
            oTransportClass.m_oAsyncContextRead.m_aOutput.Position = 0;
            oTransportClass.m_oStorage.WriteFileBegin(oTransportClass.m_sPath, oTransportClass.m_oAsyncContextRead.m_aOutput, WriteFileCallback, oTransportClass);
        }
        catch
        {
            writeXml(oTransportClass.m_oContext, null, null, null, ErrorTypes.StorageWrite);
            oTransportClass.m_oCallback(new AsyncOperationData(oTransportClass));
        }
    }
    private void WriteFileCallback(IAsyncResult result)
    {
        TransportClass oTransportClass = result.AsyncState as TransportClass;
        try
        {
            int nWriteBytes;
            ErrorTypes eError = oTransportClass.m_oStorage.WriteFileEnd(result, out nWriteBytes);
            if (ErrorTypes.NoError == eError)
            {
                string sSiteUrl = UrlBuilder.UrlWithoutPath(oTransportClass.m_oContext.Request);
                string sFileUrl = sSiteUrl + Constants.mc_sResourceServiceUrlRel + HttpUtility.UrlEncode(oTransportClass.m_sPath) + "&nocache=true" + "&deletepath=" + HttpUtility.UrlEncode(oTransportClass.m_sDeletePath) + "&filename=" + HttpUtility.UrlEncode(oTransportClass.m_sFilename);
                writeXml(oTransportClass.m_oContext, sFileUrl, "100", true, null);
            }
            else
                writeXml(oTransportClass.m_oContext, null, null, null, eError);
            oTransportClass.m_oCallback(new AsyncOperationData(oTransportClass));
        }
        catch
        {
            writeXml(oTransportClass.m_oContext, null, null, null, ErrorTypes.StorageWrite);
            oTransportClass.m_oCallback(new AsyncOperationData(oTransportClass));
        }
    }
    private void writeXml(HttpContext context, string strFileUrl, string strPercent, bool? bIsEndConvert, ErrorTypes? eError)
    {
        XmlDocument oDoc = new XmlDocument();
        XmlElement oRootElem = oDoc.CreateElement("FileResult");
        oDoc.AppendChild(oRootElem);
        if (null != strFileUrl)
        {
            XmlElement oFileUrl = oDoc.CreateElement("FileUrl");
            
            oFileUrl.InnerText = strFileUrl;
            oRootElem.AppendChild(oFileUrl);
        }
        if (null != strPercent)
        {
            XmlElement oPercent = oDoc.CreateElement("Percent");
            oPercent.InnerText = strPercent;
            oRootElem.AppendChild(oPercent);
        }
        if (bIsEndConvert.HasValue)
        {
            XmlElement oEndConvert = oDoc.CreateElement("EndConvert");
            oEndConvert.InnerText = bIsEndConvert.Value.ToString();
            oRootElem.AppendChild(oEndConvert);
        }
        if (eError.HasValue)
        {
            XmlElement oError = oDoc.CreateElement("Error");
            oError.InnerText = Utils.mapAscServerErrorToOldError(eError.Value).ToString();
            oRootElem.AppendChild(oError);
        }
        oDoc.Save(context.Response.Output);
        context.Response.ContentType = "text/xml";
    }
    private class TransportClass
    {
        public HttpContext m_oContext;
        public AsyncCallback m_oCallback;
        public Storage m_oStorage;
        public AsyncContextReadOperation m_oAsyncContextRead;
        public string m_sPath;
        public string m_sDeletePath;
        public string m_sFilename;
        public TransportClass(HttpContext oContext, AsyncCallback oCallback, Storage oStorage, AsyncContextReadOperation oAsyncContextRead, string sPath, string sDeletePath, string sFilename)
        {
            m_oContext = oContext;
            m_oCallback = oCallback;
            m_oStorage = oStorage;
            m_oAsyncContextRead = oAsyncContextRead;
            m_sPath = sPath;
            m_sDeletePath = sDeletePath;
            m_sFilename = sFilename;
        }
    }
}