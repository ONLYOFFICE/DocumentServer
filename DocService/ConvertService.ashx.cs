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
using System.Text;
using System.Xml;
using System.Collections.Generic;
using System.Threading;

using FileConverterUtils2;

using log4net;

namespace DocService
{
public class ConvertService : IHttpAsyncHandler
{
    private readonly ILog _log = LogManager.GetLogger(typeof(ConvertService));
    
    public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, Object extraData)
    {
        TransportClassMainAshx oTransportClassMainAshx = new TransportClassMainAshx(context, cb);
        ErrorTypes eError = ErrorTypes.NoError;
        try
        {
            _log.Info("Starting process request...");
            _log.Info(context.Request.QueryString.ToString());
            
            InputParams oInputParams = new InputParams();
            oInputParams.m_sKey = context.Request.QueryString["key"];
            oInputParams.m_svKey = context.Request.QueryString["vkey"];
            oInputParams.m_sUrl = context.Request.QueryString["url"];
            oInputParams.m_sEmbeddedfonts = context.Request.QueryString["embeddedfonts"];

            int nIndexSep = oInputParams.m_sUrl.IndexOf(',');
            if (-1 != nIndexSep)
                oInputParams.m_sUrl = oInputParams.m_sUrl.Substring(0, nIndexSep);
            oInputParams.m_sTitle = context.Request.QueryString["title"];
            if (string.IsNullOrEmpty(oInputParams.m_sTitle))
                oInputParams.m_sTitle = "convert";
            oInputParams.m_sFiletype = context.Request.QueryString["filetype"];
            oInputParams.m_nOutputtype = FileFormats.FromString(context.Request.QueryString["outputtype"]);
            oInputParams.m_bAsyncConvert = Convert.ToBoolean(context.Request.QueryString["async"]);
            oInputParams.m_sCodepage = context.Request.QueryString["codePage"];
            oInputParams.m_sDelimiter = context.Request.QueryString["delimiter"];

            if (ErrorTypes.NoError == eError)
            {
                ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                TaskResultData oToAdd = new TaskResultData();
                
                oInputParams.m_sKey = "conv_" + oInputParams.m_sKey;
                oToAdd.sKey = oInputParams.m_sKey;
                oToAdd.sFormat = oInputParams.m_sFiletype;
                oToAdd.eStatus = FileStatus.WaitQueue;
                oToAdd.sTitle = oInputParams.m_sTitle;
                TransportClass1 oTransportClass1 = new TransportClass1(oTransportClassMainAshx, oTaskResult, new CTaskQueue(), oInputParams);
                oTaskResult.GetOrCreateBegin(oInputParams.m_sKey, oToAdd, GetOrCreateCallback, oTransportClass1);
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
            if( ErrorTypes.NoError != eError )
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand(null, null, null, eError));
        }
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
    private void WriteOutputCommand(TransportClassMainAshx oTransportClassMainAshx, OutputCommand oOutputCommand)
    {
        HttpContext oHttpContext = oTransportClassMainAshx.m_oHttpContext;
        AsyncCallback fAsyncCallback = oTransportClassMainAshx.m_oAsyncCallback;
        oHttpContext.Response.ContentType = "text/xml";
        oHttpContext.Response.Charset = "UTF-8";

        string sXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><FileResult>";
        if (null != oOutputCommand.m_sFileUrl)
            sXml += string.Format("<FileUrl>{0}</FileUrl>", HttpUtility.HtmlEncode(oOutputCommand.m_sFileUrl));
        if (null != oOutputCommand.m_sPercent)
            sXml += string.Format("<Percent>{0}</Percent>", oOutputCommand.m_sPercent);
        if (true == oOutputCommand.m_bIsEndConvert.HasValue)
            sXml += string.Format("<EndConvert>{0}</EndConvert>", oOutputCommand.m_bIsEndConvert.Value.ToString());
        if (ErrorTypes.NoError != oOutputCommand.m_eError)
            sXml += string.Format("<Error>{0}</Error>", Utils.mapAscServerErrorToOldError(oOutputCommand.m_eError).ToString());
        sXml += "</FileResult>";

        oHttpContext.Response.Write(sXml);

        fAsyncCallback.Invoke(new AsyncOperationData(null));
    }
    private void GetOrCreateCallback(IAsyncResult ar)
    {
        TransportClass1 oTransportClass1 = ar.AsyncState as TransportClass1;
        try
        {
            TaskResultData oTaskResultData;
            bool bCreate;
            ErrorTypes eError = oTransportClass1.m_oTaskResult.GetOrCreateEnd(ar, out oTaskResultData, out bCreate);
            if (ErrorTypes.NoError == eError)
            {
                if(bCreate)
                {
                    InputParams oInputParams = oTransportClass1.m_oInputParams;
                    TaskQueueData oTaskQueueData = new TaskQueueData(oInputParams.m_sKey, oInputParams.m_nOutputtype, "output." + FileFormats.ToString(oInputParams.m_nOutputtype));
                    oTaskQueueData.m_sFromUrl = oInputParams.m_sUrl;
                    oTaskQueueData.m_sFromFormat = oInputParams.m_sFiletype;
                    if (null != oInputParams.m_sDelimiter && string.Empty != oInputParams.m_sDelimiter)
                        oTaskQueueData.m_nCsvDelimiter = int.Parse(oInputParams.m_sDelimiter);
                    else
                        oTaskQueueData.m_nCsvDelimiter = (int)CsvDelimiter.Comma;
                    if (null != oInputParams.m_sCodepage && string.Empty != oInputParams.m_sCodepage)
                        oTaskQueueData.m_nCsvTxtEncoding = int.Parse(oInputParams.m_sCodepage);
                    else
                        oTaskQueueData.m_nCsvTxtEncoding = Encoding.UTF8.CodePage;
                    if ("true" == oInputParams.m_sEmbeddedfonts)
                        oTaskQueueData.m_bEmbeddedFonts = true;
                    oTransportClass1.m_oTaskQueue.AddTaskBegin(oTaskQueueData, Priority.Low, AddTaskCallback, oTransportClass1);
                }
                else
                    CheckStatus(oTransportClass1, oTaskResultData);
            }
            else
                WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private void AddTaskCallback(IAsyncResult ar)
    {
        TransportClass1 oTransportClass1 = ar.AsyncState as TransportClass1;
        try
        {
            ErrorTypes eError = oTransportClass1.m_oTaskQueue.AddTaskEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                if (true == oTransportClass1.m_oInputParams.m_bAsyncConvert)
                    WriteOutputCommand(oTransportClass1, new OutputCommand("", "0", false, ErrorTypes.NoError));
                else
                    WaitEnd(oTransportClass1);
            }
            else
                WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private void CheckStatus(TransportClass1 oTransportClass1, TaskResultData oTaskResultData)
    {
        
        switch (oTaskResultData.eStatus)
        {
            case FileStatus.Ok:
                string sFilename = HttpUtility.UrlEncode("output." + FileFormats.ToString(oTransportClass1.m_oInputParams.m_nOutputtype));
                string sPath = HttpUtility.UrlEncode(Path.GetFileNameWithoutExtension(oTransportClass1.m_oInputParams.m_sKey) + "/output." + FileFormats.ToString(oTransportClass1.m_oInputParams.m_nOutputtype));
                string sDeletePath = HttpUtility.UrlEncode(Path.GetFileNameWithoutExtension(oTransportClass1.m_oInputParams.m_sKey));
                
                string sSiteUrl = UrlBuilder.UrlWithoutPath(oTransportClass1.m_oHttpContext.Request);
                
                string strFileUrl = sSiteUrl + Constants.mc_sResourceServiceUrlRel + sPath + "&nocache=true" +"&deletepath=" + sDeletePath + "&filename=" + sFilename;
                WriteOutputCommand(oTransportClass1, new OutputCommand(strFileUrl, "100", true, ErrorTypes.NoError));
                break;
            case FileStatus.WaitQueue:
                if (oTransportClass1.m_oInputParams.m_bAsyncConvert)
                    WriteOutputCommand(oTransportClass1, new OutputCommand("", "0", false, ErrorTypes.NoError));
                else
                    WaitEnd(oTransportClass1);
                break;
            case FileStatus.Convert:
                if (oTransportClass1.m_oInputParams.m_bAsyncConvert)
                    WriteOutputCommand(oTransportClass1, new OutputCommand("", oTaskResultData.nStatusInfo.ToString(), false, ErrorTypes.NoError));
                else
                    WaitEnd(oTransportClass1);
                break;
            
            case FileStatus.Err:
            case FileStatus.ErrToReload:
                AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
                TransportClass2 oTransportClass2 = new TransportClass2(oTransportClass1, oAsyncClearCacheOperation, (ErrorTypes)oTaskResultData.nStatusInfo);
                oAsyncClearCacheOperation.ClearCacheBegin(oTransportClass1.m_oInputParams.m_sKey, ClearCacheCallback, oTransportClass2);
                break;
            default:
                WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
                break;
        }
    }
    private void WaitEnd(TransportClass1 oTransportClass1)
    {
        try
        {
            Timer oTimer = new Timer(WaitEndTimerCallback, oTransportClass1, TimeSpan.FromMilliseconds(-1), TimeSpan.FromMilliseconds(-1));
            oTransportClass1.m_oTimer = oTimer;
            oTimer.Change(TimeSpan.FromMilliseconds(1000), TimeSpan.FromMilliseconds(-1));
        }
        catch
        {
            WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private void WaitEndTimerCallback(Object stateInfo)
    {
        TransportClass1 oTransportClass1 = stateInfo as TransportClass1;
        try
        {
            if (null != oTransportClass1.m_oTimer)
                oTransportClass1.m_oTimer.Dispose();
            oTransportClass1.m_oTaskResult.GetBegin(oTransportClass1.m_oInputParams.m_sKey, WaitEndCallback, oTransportClass1);
        }
        catch
        {
            WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private void WaitEndCallback(IAsyncResult ar)
    {
        TransportClass1 oTransportClass1 = ar.AsyncState as TransportClass1;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClass1.m_oTaskResult.GetEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
                CheckStatus(oTransportClass1, oTaskResultData);
            else
                WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClass1, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private void ClearCacheCallback(IAsyncResult ar)
    {
        TransportClass2 oTransportClass2 = ar.AsyncState as TransportClass2;
        try
        {
            ErrorTypes eError = oTransportClass2.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                WriteOutputCommand(oTransportClass2, new OutputCommand(null, null, null, oTransportClass2.m_eError));
            }
            else
                WriteOutputCommand(oTransportClass2, new OutputCommand(null, null, null, eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClass2, new OutputCommand(null, null, null, ErrorTypes.Unknown));
        }
    }
    private class TransportClass1 : TransportClassMainAshx
    {
        public ITaskResultInterface m_oTaskResult;
        public CTaskQueue m_oTaskQueue;
        public InputParams m_oInputParams;
        public Timer m_oTimer;
        public TransportClass1(TransportClassMainAshx oTransportClassMainAshx, ITaskResultInterface oTaskResult, CTaskQueue oTaskQueue, InputParams oInputParams)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oTaskResult = oTaskResult;
            m_oInputParams = oInputParams;
            m_oTaskQueue = oTaskQueue;
            m_oTimer = null;
        }
    }
    private class TransportClass2 : TransportClassMainAshx
    {
        public AsyncClearCacheOperation m_oAsyncClearCacheOperation;
        public ErrorTypes m_eError;
        public TransportClass2(TransportClassMainAshx oTransportClassMainAshx, AsyncClearCacheOperation oAsyncClearCacheOperation, ErrorTypes eError)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncClearCacheOperation = oAsyncClearCacheOperation;
            m_eError = eError;
        }
    }
    private class InputParams
    {
        public string m_sKey;
        public string m_svKey;
        public string m_sUrl;
        public string m_sTitle;
        public string m_sFiletype;
        public int m_nOutputtype;
        public bool m_bAsyncConvert;
        public string m_sEmbeddedfonts;
        public string m_sCodepage;
        public string m_sDelimiter;
    }
    private class OutputCommand
    {
        public string m_sFileUrl;
        public string m_sPercent;
        public bool? m_bIsEndConvert;
        public ErrorTypes m_eError;
        public OutputCommand(string strFileUrl, string strPercent, bool? bIsEndConvert, ErrorTypes eError)
        {
            m_sFileUrl = strFileUrl;
            m_sPercent = strPercent;
            m_bIsEndConvert = bIsEndConvert;
            m_eError = eError;
        }
    }
}
}