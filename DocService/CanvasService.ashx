<%@ WebHandler Language="C#" Class="CanvasService" %>
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
using System.Web;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Configuration;
using System.Web.Script.Serialization;
using System.Security.Cryptography;
using System.Xml;
using System.Collections.Generic;

using FileConverterUtils2;
using ASC.Core.Billing;
using log4net;

public class CanvasService : IHttpAsyncHandler
{
    private const char c_cCharDelimiter = (char)5;
    private const string c_sSaveTypePartStart = "partstart";
    private const string c_sSaveTypePart = "part";
    private const string c_sSaveTypeComplete = "complete";
    private const string c_sSaveTypeCompleteAll = "completeall";
    private const string c_sSaveTypeChanges = "changes";
    private readonly ILog _log = LogManager.GetLogger(typeof(CanvasService));

    public CanvasService()
    {
    }
    public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, Object extraData)
    {
        TransportClassMainAshx oTransportClassMainAshx = new TransportClassMainAshx(context, cb);
        AsyncContextReadOperation asynch = new AsyncContextReadOperation();
        TransportClassContextRead oTransportClassContextRead = new TransportClassContextRead(oTransportClassMainAshx, asynch);
        try
        {
            asynch.ReadContextBegin(context.Request.InputStream, ReadContext, oTransportClassContextRead);
        }
        catch(Exception e)
        {
            OutputCommand oOutputCommand = new OutputCommand(ErrorTypes.Unknown);
            WriteOutputCommand(new TransportClassMainAshx(context, cb), oOutputCommand);

            _log.Error("Exception catched in BeginProcessRequest:", e);
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

    #region Callbacks
    private void ReadContext(IAsyncResult ar)
    {
        TransportClassContextRead oTransportClassContextRead = ar.AsyncState as TransportClassContextRead;
        AsyncContextReadOperation asyncOp = oTransportClassContextRead.m_oAsyncContextReadOperation;
        ErrorTypes eError = ErrorTypes.NoError;
        string strStream = null;
        try
        {
            eError = asyncOp.ReadContextEnd(ar);
            strStream = System.Text.Encoding.UTF8.GetString(asyncOp.m_aBuffer);

            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = ReadCommand(strStream);

                eError = ProcessCommand(oTransportClassContextRead, cmd);
            }
        }
        catch (Exception e)
        {
            eError = ErrorTypes.Unknown;
            
            _log.ErrorFormat("Input command: {0}", strStream);
            _log.Error("Exception catched in ReadContext:", e);
        }
        finally
        {
            if (ErrorTypes.NoError != eError)
                WriteOutputCommand(oTransportClassContextRead, new OutputCommand(eError));
        }
    }

    private ErrorTypes ProcessCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        ErrorTypes eError = ErrorTypes.NoError;

        LicenseInfo.LicenseRights oRights = null;

        oRights = new LicenseInfo.LicenseRights(true);

        if (ErrorTypes.NoError == eError)
        {
            switch (cmd.c)
            {
                case "create":
                    CreateCommand(oTransportClassContextRead, cmd);
                    break;

                case "reopen":
                    ReopenCommand(oTransportClassContextRead, cmd);
                    break;

                case "open":
                    OpenCommand(oTransportClassContextRead, cmd);
                    break;

                case "chopen":
                    CheckOpenCommand(oTransportClassContextRead, cmd);
                    break;

                case "save":
                    SaveCommand(oTransportClassContextRead, cmd);
                    break;

                case "chsave":
                    CheckSaveCommand(oTransportClassContextRead, cmd);
                    break;

                case "cc":
                    ClearCacheCommand(oTransportClassContextRead, cmd);
                    break;

                case "getcodepage":
                    GetCodepageCommand(oTransportClassContextRead);
                    break;

                case "imgurl":
                case "imgurls":
                    ImageUrlCommand(oTransportClassContextRead, cmd);
                    break;

                case "sfc":
                    SaveFileChangesCommand(oTransportClassContextRead, cmd);
                    break;

                case "savefromorigin":
                    SaveFormOriginCommand(oTransportClassContextRead, cmd);
                    break;

                case "getsettings":
                    GetSettingsCommand(oTransportClassContextRead, cmd, oRights);
                    break;

                case "getlicense":
                    GetLicenseCommand(oTransportClassContextRead, cmd);
                    break;

                default:
                    eError = ErrorTypes.Unknown;
                    break;
            }
        }
        return eError;
    }

    private ErrorTypes GetRights(InputCommand cmd, out LicenseInfo.LicenseRights oRights)
    {
        oRights = null;        
        ErrorTypes eError = ErrorTypes.NoError;
        
        LicenseInfo.LicenseMetaData oLicenseMetaData = null;

        oLicenseMetaData = new LicenseInfo.LicenseMetaData(
                null == cmd.vkey ? "" : cmd.vkey, 
                cmd.id, 
                null == cmd.userid ? "" : cmd.userid,
                cmd.editorid);

        oRights = ASP.global_asax.LicenseInfo.getRights(oLicenseMetaData, out eError);

        if (null == oRights && ErrorTypes.NoError == eError)
            eError = ErrorTypes.LicenseError;
        else
            eError = CheckRights(cmd, oRights);
        
        return eError;
    }

    private static InputCommand ReadCommand(string strStream)
    {
        JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
        string sSearchString = "mnuSaveAs";
        InputCommand cmd;
        if (strStream.StartsWith(sSearchString))
        {
            
            int nSearchStringLength = sSearchString.Length;
            int nIdStart = nSearchStringLength + 1;
            int nIdEnd = strStream.IndexOf(c_cCharDelimiter, nIdStart);

            string sJson = strStream.Substring(nIdStart, nIdEnd - nIdStart);
            cmd = oJavaScriptSerializer.Deserialize<InputCommand>(sJson);
            cmd.data = strStream.Substring(nIdEnd + 1);
        }
        else
            cmd = oJavaScriptSerializer.Deserialize<InputCommand>(strStream);
        return cmd;
    }

    private void GetSettingsCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd, LicenseInfo.LicenseRights oRights)
    {
        OutputSettingsTrackingData oTrackingData = null;

        oTrackingData = new OutputSettingsTrackingData();

        oTrackingData.licenseId = "";
        oTrackingData.trackingUrl = null;
        oTrackingData.trackingType = TrackingType.TT_NONE;

        JavaScriptSerializer oJsSerializer = new JavaScriptSerializer();
        
        OutputSettingsData oOutputSettingsData = new OutputSettingsData(oRights, cmd.format, oTrackingData);
        
        OutputCommand oOutputCommand = new OutputCommand("getsettings", oJsSerializer.Serialize(oOutputSettingsData));
        WriteOutputCommand(oTransportClassContextRead, oOutputCommand);
    }
    private void GetLicenseCommand (TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        LicenseInfo oLicenseInfo = ASP.global_asax.LicenseInfo;

        LicenseInfo.LicenseCustomerInfo customer_info = (null == oLicenseInfo) ? null : oLicenseInfo.getCustomerInfo();

        JavaScriptSerializer oJsSerializer = new JavaScriptSerializer();

        OutputCommand oOutputCommand = new OutputCommand("getlicense", oJsSerializer.Serialize(customer_info));
        WriteOutputCommand(oTransportClassContextRead, oOutputCommand);
    }

    private void SaveFormOriginCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        TaskResultData oTaskResultData = new TaskResultData();
        oTaskResultData.sKey = cmd.id;
        oTaskResultData.sFormat = cmd.format;
        oTaskResultData.eStatus = FileStatus.WaitQueue;
        oTaskResultData.oLastOpenDate = DateTime.UtcNow;
        TaskResult oTaskResult = new TaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback2, oTransportClassTaskResult);
    }

    private void SaveFileChangesCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        TaskResultData oTaskResultData = new TaskResultData();
        oTaskResultData.sKey = cmd.id;
        oTaskResultData.sFormat = cmd.format;
        oTaskResultData.eStatus = FileStatus.WaitQueue;
        oTaskResultData.oLastOpenDate = DateTime.UtcNow;
        TaskResult oTaskResult = new TaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback3, oTransportClassTaskResult);
    }

    private void ImageUrlCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        AsyncMediaXmlOperation oAsyncMediaXmlOperation = new AsyncMediaXmlOperation();
        TransportClassMediaXml oTransportClassMediaXml = new TransportClassMediaXml(oTransportClassContextRead, cmd, oAsyncMediaXmlOperation, null);
        oAsyncMediaXmlOperation.GetMediaXmlBegin(Path.Combine(cmd.id, "media/media.xml"), GetMediaXmlCallback, oTransportClassMediaXml);
    }

    private void GetCodepageCommand(TransportClassContextRead oTransportClassContextRead)
    {
        string sJson = Utils.GetSerializedEncodingProperty(null, null);
        WriteOutputCommand(oTransportClassContextRead, new OutputCommand("getcodepage", sJson));
    }

    private void ClearCacheCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
        TransportClassClearCache oTransportClassClearCache = new TransportClassClearCache(oTransportClassContextRead, cmd, oAsyncClearCacheOperation, null);
        oAsyncClearCacheOperation.ClearCacheBegin(cmd.id, TaskResultRemoveCallback, oTransportClassClearCache);
    }

    private void CheckSaveCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
        OutputWaitSaveData oOutputWaitSaveData = oJavaScriptSerializer.Deserialize<OutputWaitSaveData>(cmd.data);
        TaskResult oTaskResult = new TaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.GetBegin(oOutputWaitSaveData.key, TaskResultGetAsyncCallback, oTransportClassTaskResult);
    }

    private void SaveCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        switch (cmd.savetype)
        {
            case c_sSaveTypeChanges:
                {
                    OutputCommand oOutputCommand = new OutputCommand("changes", null);
                    string sFilename = "changes";
                    string sExt = ".json";
                    Storage oStorage = new Storage();
                    TransportClassStorage2 oTransportClassStorage2 = new TransportClassStorage2(oTransportClassContextRead, cmd, oStorage, null, cmd.id + "/changes", sFilename, sExt, oOutputCommand);
                    oStorage.GetTreeNodeBegin(cmd.id + "/changes", GetTreeNodeCallback, oTransportClassStorage2);
                    break;
                }
            case c_sSaveTypePartStart:
            case c_sSaveTypeCompleteAll:
                {
                    TaskResultData oTaskResultData = new TaskResultData();
                    oTaskResultData.sKey = cmd.id;
                    oTaskResultData.sFormat = cmd.format;
                    oTaskResultData.eStatus = FileStatus.WaitQueue;
                    oTaskResultData.oLastOpenDate = DateTime.UtcNow;
                    TaskResult oTaskResult = new TaskResult();
                    TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
                    oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback, oTransportClassTaskResult);
                    break;
                }
            case c_sSaveTypePart:
            case c_sSaveTypeComplete:
            default:
                {

                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    OutputSavePartData oOutputSavePartData = new OutputSavePartData(cmd.savekey, cmd.outputformat);
                    OutputCommand oOutputCommand = new OutputCommand("savepart", serializer.Serialize(oOutputSavePartData));
                    string sFilename = "Editor";
                    string sExt = ".bin";
                    Storage oStorage = new Storage();
                    TransportClassStorage2 oTransportClassStorage2 = new TransportClassStorage2(oTransportClassContextRead, cmd, oStorage, null, cmd.savekey, sFilename, sExt, oOutputCommand);
                    oStorage.GetTreeNodeBegin(cmd.savekey, GetTreeNodeCallback, oTransportClassStorage2);
                    break;
                }
        }
    }

    private void CheckOpenCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        TaskResult oTaskResult = new TaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.GetBegin(cmd.id, TaskResultGetCallback, oTransportClassTaskResult);
    }

    private void ReopenCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        
        AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
        TransportClassClearCache oTransportClassClearCache = new TransportClassClearCache(oTransportClassContextRead, cmd, oAsyncClearCacheOperation, null);
        oAsyncClearCacheOperation.ClearCacheBegin(cmd.id, TaskResultRemoveCallback3, oTransportClassClearCache);
        }

    private static ErrorTypes CheckRights(InputCommand cmd, LicenseInfo.LicenseRights oRights)
    {
        ErrorTypes eError = ErrorTypes.NoError;
        switch (cmd.c)
        {
            case "create":
            case "reopen":
            case "open":
            case "chopen":
                {
                    if (true != oRights.CanOpen)
                        eError = ErrorTypes.LicenseErrorPermission;
                }
                break;

            case "savefromorigin":
                {
                    if (true != oRights.CanPrint)
                        eError = ErrorTypes.LicenseErrorPermission;
                }
                break;

            case "save":
                {
                    if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == cmd.outputformat)
                    {
                        if (true != oRights.CanPrint)
                            eError = ErrorTypes.LicenseErrorPermission;
                    }
                    else if (true == cmd.innersave)
                    {
                        if (true != oRights.CanSave)
                        eError = ErrorTypes.LicenseErrorPermission;
                    }
                    else if (true != oRights.CanExport)
                        eError = ErrorTypes.LicenseErrorPermission;
                }
                break;

            case "imgurl":
            case "imgurls":
            case "sfc":
                {
                    if (true != oRights.CanSave)
                        eError = ErrorTypes.LicenseErrorPermission;
                }
                break;

            case "getsettings":
            case "getlicense":
            case "chsave":
            default:
                break;
        }
        return eError;
    }
    private void GetTreeNodeCallback(IAsyncResult ar)
    {
        TransportClassStorage2 oTransportClassStorage = ar.AsyncState as TransportClassStorage2;
        try
        {
            Storage oStorage = oTransportClassStorage.m_oStorage;
            InputCommand cmd = oTransportClassStorage.m_oInputCommand;
            StorageTreeNode oStorageTreeNode = oStorage.GetTreeNodeEnd(ar);
            int nMaxIndex = 0;
            string sSearchString = oTransportClassStorage.m_sFilename;
            for (int i = 0, length = oStorageTreeNode.m_aSubNodes.Count; i < length; ++i)
            {
                StorageTreeNode oCurNode = oStorageTreeNode.m_aSubNodes[i];
                if (false == oCurNode.m_bIsDirectory)
                {
                    if (0 == oCurNode.m_sName.IndexOf(sSearchString))
                    {
                        int nDotIndex = oCurNode.m_sName.LastIndexOf('.');

                        int nCurIndex = 0;
                        try
                        {
                            if (-1 != nDotIndex)
                                nCurIndex = int.Parse(oCurNode.m_sName.Substring(sSearchString.Length, nDotIndex - sSearchString.Length));
                            else
                                nCurIndex = int.Parse(oCurNode.m_sName.Substring(sSearchString.Length));
                        }
                        catch
                        {
                        }
                        if (nMaxIndex < nCurIndex)
                            nMaxIndex = nCurIndex;
                    }
                }
            }
            nMaxIndex++;
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(cmd.data));
            oTransportClassStorage.m_oStream = ms;
            oStorage.WriteFileBegin(Path.Combine(oTransportClassStorage.m_sKey, oTransportClassStorage.m_sFilename + nMaxIndex + oTransportClassStorage.m_sExt), ms, ChangesWriteCallback, oTransportClassStorage);
        }
        catch
        {
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void EditorBinWriteCallback(IAsyncResult ar)
    {
        TransportClassStorage oTransportClassStorage = ar.AsyncState as TransportClassStorage;
        try
        {
            int nReadWriteBytes;
            ErrorTypes eErrorTypes = oTransportClassStorage.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            if (null != oTransportClassStorage.m_oStream)
                oTransportClassStorage.m_oStream.Dispose();
            if (ErrorTypes.NoError == eErrorTypes)
            {
                TaskResultData oTaskResultData = new TaskResultData();
                oTaskResultData.eStatus = FileStatus.Ok;
                oTaskResultData.nStatusInfo = (int)ErrorTypes.NoError;
                TaskResultGetProcess(oTaskResultData, false, oTransportClassStorage.m_oInputCommand, oTransportClassStorage);
            }
            else
                WriteOutputCommand(oTransportClassStorage, new OutputCommand(eErrorTypes));
        }
        catch
        {
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void ChangesWriteCallback(IAsyncResult ar)
    {
        TransportClassStorage2 oTransportClassStorage = ar.AsyncState as TransportClassStorage2;
        try
        {
            int nReadWriteBytes;
            oTransportClassStorage.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            if (null != oTransportClassStorage.m_oStream)
                oTransportClassStorage.m_oStream.Dispose();
            InputCommand cmd = oTransportClassStorage.m_oInputCommand;
            if (c_sSaveTypeComplete == cmd.savetype || c_sSaveTypeCompleteAll == cmd.savetype)
            {
                
                int nOutputFormat = cmd.outputformat;
                TaskQueueData oTaskQueueData = new TaskQueueData(oTransportClassStorage.m_sKey, nOutputFormat, "output." + FileFormats.ToString(nOutputFormat));
                oTaskQueueData.m_sFromKey = cmd.id;
                oTaskQueueData.m_sFromFormat = "bin";
                if (cmd.codepage.HasValue)
                    oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
                if (cmd.delimiter.HasValue)
                    oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
                if (null != cmd.vkey)
                {
                    bool bPaid;
                    Signature.getVKeyParams(cmd.vkey, out bPaid);
                    oTaskQueueData.m_bPaid = bPaid;
                }
                Priority oPriority = Priority.Low;
                if (cmd.innersave)
                    oPriority = Priority.Normal;
                CTaskQueue oTaskQueue = new CTaskQueue();
                TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassStorage, oTaskQueue, oTaskQueueData);
                oTaskQueue.AddTaskBegin(oTaskQueueData, oPriority, TaskQueueAddCallbackSave, oTransportClassTaskQueue);
            }
            else
                WriteOutputCommand(oTransportClassStorage, oTransportClassStorage.m_oOutputCommand);
        }
        catch
        {
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetAsyncCallback(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTask;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.GetEnd(ar, out oTask);
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                switch (oTask.eStatus)
                {
                    case FileStatus.Ok:
                        JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
                        OutputWaitSaveData oOutputWaitSaveData = oJavaScriptSerializer.Deserialize<OutputWaitSaveData>(cmd.data);
                        string sPath = HttpUtility.UrlEncode(oOutputWaitSaveData.key + "/" + oOutputWaitSaveData.filename);
                        string sDeletePath = HttpUtility.UrlEncode(oOutputWaitSaveData.key);
                        string sFilename = HttpUtility.UrlEncode(cmd.title + "." + FileFormats.ToString(oOutputWaitSaveData.format));
                        Uri oSiteUri = oTransportClassTaskResult.m_oHttpContext.Request.Url;
                        string sSiteUrl = oSiteUri.Scheme + "://" + oSiteUri.Host;
                        if (-1 != oSiteUri.Port)
                            sSiteUrl += ":" + oSiteUri.Port;
                        string sUrl = sSiteUrl + Constants.mc_sResourceServiceUrlRel + sPath + "&deletepath=" + sDeletePath + "&filename=" + sFilename;
                        WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("save", sUrl));
                        break;
                    case FileStatus.Convert:
                    case FileStatus.WaitQueue:
                        WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("waitsave", cmd.data));
                        break;
                    case FileStatus.Err:
                        WriteOutputCommand(oTransportClassTaskResult, new OutputCommand((ErrorTypes)oTask.nStatusInfo));
                        break;
                    case FileStatus.ErrToReload:
                        AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
                        TransportClassClearCache oTransportClassClearCache = new TransportClassClearCache(oTransportClassTaskResult, cmd, oAsyncClearCacheOperation, (ErrorTypes)oTask.nStatusInfo);
                        oAsyncClearCacheOperation.ClearCacheBegin(oTask.sKey, ClearCacheCallback, oTransportClassClearCache);
                        break;
                    default:
                        WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
                        break;
                }
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultAddRandomKeyAsyncCallback(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.AddRandomKeyEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                string sFilename;
                if (c_sSaveTypeCompleteAll == cmd.savetype)
                    sFilename = "Editor.bin";
                else
                    sFilename = "Editor1.bin";
                
                byte[] aBuffer = Encoding.ASCII.GetBytes(cmd.data);
                MemoryStream oMemoryStream = new MemoryStream(aBuffer);
                Storage oStorage = new Storage();
                TransportClassStorage oTransportClassStorage = new TransportClassStorage(oTransportClassTaskResult, cmd, oStorage, oMemoryStream, oTaskResultData.sKey);
                oStorage.WriteFileBegin(Path.Combine(oTaskResultData.sKey, sFilename), oMemoryStream, StorageWriteFileAsyncCallback, oTransportClassStorage);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultAddRandomKeyAsyncCallback2(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.AddRandomKeyEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                TaskQueueData oTaskQueueData = new TaskQueueData(oTaskResultData.sKey, FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF, "output.pdf");
                oTaskQueueData.m_sFromKey = cmd.id;
                oTaskQueueData.m_sFromFormat = "pdf";
                oTaskQueueData.m_bFromOrigin = true;
                if (cmd.codepage.HasValue)
                    oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
                if (cmd.delimiter.HasValue)
                    oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
                if (null != cmd.vkey)
                {
                    
                    bool bPaid;
                    Signature.getVKeyParams(cmd.vkey, out bPaid);
                    oTaskQueueData.m_bPaid = bPaid;
                }

                CTaskQueue oTaskQueue = new CTaskQueue();
                TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassTaskResult, oTaskQueue, oTaskQueueData);
                oTaskQueue.AddTaskBegin(oTaskQueueData, Priority.Low, TaskQueueAddCallbackSave, oTransportClassTaskQueue);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultAddRandomKeyAsyncCallback3(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.AddRandomKeyEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                int nOutputFormat = cmd.outputformat;
                TaskQueueData oTaskQueueData = new TaskQueueData(oTaskResultData.sKey, nOutputFormat, "output." + FileFormats.ToString(nOutputFormat));
                oTaskQueueData.m_sFromKey = cmd.id;
                oTaskQueueData.m_sFromFormat = "bin";
                oTaskQueueData.m_bFromChanges = true;
                if (cmd.codepage.HasValue)
                    oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
                if (cmd.delimiter.HasValue)
                    oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
                if (null != cmd.vkey)
                {
                    bool bPaid;
                    Signature.getVKeyParams(cmd.vkey, out bPaid);
                    oTaskQueueData.m_bPaid = bPaid;
                }
                Priority oPriority = Priority.Low;
                if (cmd.innersave)
                    oPriority = Priority.Normal;
                CTaskQueue oTaskQueue = new CTaskQueue();
                TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassTaskResult, oTaskQueue, oTaskQueueData);
                oTaskQueue.AddTaskBegin(oTaskQueueData, oPriority, TaskQueueAddCallbackSave, oTransportClassTaskQueue);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void StorageWriteFileAsyncCallback(IAsyncResult ar)
    {
        TransportClassStorage oTransportClassStorage = ar.AsyncState as TransportClassStorage;
        try
        {
            int nReadWriteBytes;
            ErrorTypes eError = oTransportClassStorage.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            if (null != oTransportClassStorage.m_oStream)
                oTransportClassStorage.m_oStream.Dispose();
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassStorage.m_oInputCommand;
                if (c_sSaveTypeCompleteAll == cmd.savetype || c_sSaveTypeComplete == cmd.savetype)
                {
                    
                    int nOutputFormat = cmd.outputformat;
                    TaskQueueData oTaskQueueData = new TaskQueueData(oTransportClassStorage.m_sKey, nOutputFormat, "output." + FileFormats.ToString(nOutputFormat));
                    oTaskQueueData.m_sFromKey = cmd.id;
                    oTaskQueueData.m_sFromFormat = "bin";
                    if (cmd.codepage.HasValue)
                        oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
                    if (cmd.delimiter.HasValue)
                        oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
                    if (null != cmd.vkey)
                    {
                        bool bPaid;
                        Signature.getVKeyParams(cmd.vkey, out bPaid);
                        oTaskQueueData.m_bPaid = bPaid;
                    }

                    Priority oPriority = Priority.Low;
                    if (cmd.innersave)
                        oPriority = Priority.Normal;
                    CTaskQueue oTaskQueue = new CTaskQueue();
                    TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassStorage, oTaskQueue, oTaskQueueData);
                    oTaskQueue.AddTaskBegin(oTaskQueueData, oPriority, TaskQueueAddCallbackSave, oTransportClassTaskQueue);
                }
                else
                {
                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    OutputSavePartData oOutputSavePartData = new OutputSavePartData(oTransportClassStorage.m_sKey, cmd.outputformat);
                    WriteOutputCommand(oTransportClassStorage, new OutputCommand("savepart", serializer.Serialize(oOutputSavePartData)));
                }
            }
            else
                WriteOutputCommand(oTransportClassStorage, new OutputCommand(eError));

        }
        catch
        {
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskQueueAddCallbackSave(IAsyncResult ar)
    {
        TransportClassTaskQueue oTransportClassTaskQueue = ar.AsyncState as TransportClassTaskQueue;
        try
        {
            ErrorTypes eError = oTransportClassTaskQueue.m_oTaskQueue.AddTaskEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                TaskQueueData oTaskQueueData = oTransportClassTaskQueue.m_oParam as TaskQueueData;
                OutputWaitSaveData oOutputWaitSaveData = new OutputWaitSaveData(oTaskQueueData.m_sKey, oTaskQueueData.m_sToFile, oTaskQueueData.m_nToFormat);
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand("waitsave", serializer.Serialize(oOutputWaitSaveData)));
            }
            else
                WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetOrCreateCallback(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            bool bCreate;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.GetOrCreateEnd(ar, out oTaskResultData, out bCreate);
            if (ErrorTypes.NoError == eError)
            {
                TaskResultGetProcess(oTaskResultData, bCreate, oTransportClassTaskResult.m_oInputCommand, oTransportClassTaskResult);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetOrCreateCallback2(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            bool bCreate;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.GetOrCreateEnd(ar, out oTaskResultData, out bCreate);
            if (ErrorTypes.NoError == eError)
            {
                if (bCreate)
                {
                    InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                    MemoryStream oMemoryStream = new MemoryStream(Encoding.ASCII.GetBytes(cmd.data));
                    Storage oStorage = new Storage();
                    oStorage.CreateDirectory(cmd.id + "/media");
                    TransportClassStorage oTransportClassStorage = new TransportClassStorage(oTransportClassTaskResult, cmd, oStorage, oMemoryStream, cmd.id);
                    oStorage.WriteFileBegin(cmd.id + "/Editor.bin", oMemoryStream, EditorBinWriteCallback, oTransportClassStorage);
                }
                else
                {
                    TaskResultData oTaskResultDataTemp = new TaskResultData();
                    oTaskResultDataTemp.eStatus = FileStatus.Ok;
                    oTaskResultDataTemp.nStatusInfo = (int)ErrorTypes.NoError;
                    TaskResultGetProcess(oTaskResultDataTemp, false, oTransportClassTaskResult.m_oInputCommand, oTransportClassTaskResult);
                }
                    
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetCallback(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.GetEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                TaskResultGetProcess(oTaskResultData, false, oTransportClassTaskResult.m_oInputCommand, oTransportClassTaskResult);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void AddTask(InputCommand cmd, TransportClassMainAshx oTransportClassMainAshx)
    {
        try
        {
            
            int nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS;

            TaskQueueData oTaskQueueData = new TaskQueueData(cmd.id, nToFormat, "Editor.bin");

            oTaskQueueData.m_sFromUrl = cmd.url;
            oTaskQueueData.m_sFromFormat = cmd.format;

            if (cmd.codepage.HasValue)
                oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
            if (cmd.delimiter.HasValue)
                oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
            oTaskQueueData.m_bEmbeddedFonts = false;

            CTaskQueue oTaskQueue = new CTaskQueue();
            TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassMainAshx, oTaskQueue, null);

            oTaskQueue.AddTaskBegin(oTaskQueueData, Priority.High, TaskQueueAddCallback, oTransportClassTaskQueue);
        }
        catch
        {
            WriteOutputCommand(oTransportClassMainAshx, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultUpdateCallback(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.UpdateEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                int nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS;
                TaskQueueData oTaskQueueData = new TaskQueueData(cmd.id, nToFormat, "Editor.bin");
                    oTaskQueueData.m_sFromUrl = cmd.url;
                oTaskQueueData.m_sFromFormat = cmd.format;
                if (cmd.codepage.HasValue)
                    oTaskQueueData.m_nCsvTxtEncoding = cmd.codepage.Value;
                if (cmd.delimiter.HasValue)
                    oTaskQueueData.m_nCsvDelimiter = cmd.delimiter.Value;
                oTaskQueueData.m_bEmbeddedFonts = false;

                CTaskQueue oTaskQueue = new CTaskQueue();
                TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassTaskResult, oTaskQueue, null);
                oTaskQueue.AddTaskBegin(oTaskQueueData, Priority.High, TaskQueueAddCallback, oTransportClassTaskQueue);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskQueueAddCallback(IAsyncResult ar)
    {
        TransportClassTaskQueue oTransportClassTaskQueue = ar.AsyncState as TransportClassTaskQueue;
        try
        {
            ErrorTypes eError = oTransportClassTaskQueue.m_oTaskQueue.AddTaskEnd(ar);
            if (ErrorTypes.NoError == eError)
                WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand("waitopen", "0"));
            else
                WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultRemoveCallback(IAsyncResult ar)
    {
        TransportClassClearCache oTransportClassClearCache = ar.AsyncState as TransportClassClearCache;
        try
        {
            ErrorTypes eError = oTransportClassClearCache.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                WriteOutputCommand(oTransportClassClearCache, new OutputCommand("cc", "true"));
            }
            else
                WriteOutputCommand(oTransportClassClearCache, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassClearCache, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultRemoveCallback2(IAsyncResult ar)
    {
        TransportClassClearCache oTransportClassClearCache = ar.AsyncState as TransportClassClearCache;
        try
        {
            ErrorTypes eError = (ErrorTypes)oTransportClassClearCache.m_oParam;
            WriteOutputCommand(oTransportClassClearCache, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassClearCache, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultRemoveCallback3(IAsyncResult ar)
    {
        TransportClassClearCache oTransportClassClearCache = ar.AsyncState as TransportClassClearCache;
        try
        {
            ErrorTypes eError = oTransportClassClearCache.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                OpenCommand(oTransportClassClearCache, oTransportClassClearCache.m_oInputCommand);
            }
            else
                WriteOutputCommand(oTransportClassClearCache, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassClearCache, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void GetMediaXmlCallback(IAsyncResult ar)
    {
        TransportClassMediaXml oTransportClassMediaXml = ar.AsyncState as TransportClassMediaXml;
        try
        {
            Dictionary<string, string> aMediaXmlMapHash;
            Dictionary<string, string> aMediaXmlMapFilename;
            ErrorTypes eError = oTransportClassMediaXml.m_oAsyncMediaXmlOperation.GetMediaXmlEnd(ar, out aMediaXmlMapHash, out aMediaXmlMapFilename);
            if (ErrorTypes.NoError == eError)
            {
                oTransportClassMediaXml.m_aMediaXmlMapHash = aMediaXmlMapHash;
                oTransportClassMediaXml.m_aMediaXmlMapFilename = aMediaXmlMapFilename;

                string[] aUrls;
                string sSupportedFormats = "";
                if ("imgurl" == oTransportClassMediaXml.m_oInputCommand.c)
                {
                    aUrls = new string[] { oTransportClassMediaXml.m_oInputCommand.data };
                    sSupportedFormats = ConfigurationSettings.AppSettings["limits.image.types.upload"] ?? "jpg";
                }
                else
                {
                    JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
                    aUrls = oJavaScriptSerializer.Deserialize<string[]>(oTransportClassMediaXml.m_oInputCommand.data);
                    sSupportedFormats = ConfigurationSettings.AppSettings["limits.image.types.copy"] ?? "jpg";
                }
                TransportClassImgUrl oTransportClassImgUrl = new TransportClassImgUrl(oTransportClassMediaXml, aUrls, sSupportedFormats, DownloadImages);
                DownloadImages(new AsyncOperationData(oTransportClassImgUrl));
            }
            else
                WriteOutputCommand(oTransportClassMediaXml, new OutputCommand(ErrorTypes.Upload));
        }
        catch
        {
            WriteOutputCommand(oTransportClassMediaXml, new OutputCommand(ErrorTypes.Upload));
        }
    }
    void DownloadImages(IAsyncResult ar)
    {
        TransportClassImgUrl oTransportClassImgUrl = ar.AsyncState as TransportClassImgUrl;
        try
        {
            TransportClassMediaXml oTransportClassMediaXml = oTransportClassImgUrl.m_oTransportClassMediaXml;
            string sUrl = oTransportClassImgUrl.GetNextUrl();
            if (null == sUrl)
            {
                oTransportClassMediaXml.m_oAsyncMediaXmlOperation.WriteMediaXmlBegin(Path.Combine(oTransportClassMediaXml.m_oInputCommand.id, @"media\media.xml"), oTransportClassMediaXml.m_aMediaXmlMapHash, WriteMediaXmlCallback, oTransportClassImgUrl);
            }
            else
            {
                int nMaxBytes = Convert.ToInt32(ConfigurationSettings.AppSettings["limits.image.size"] ?? "25000000");
                
                if ("data:" == sUrl.Substring(0, "data:".Length))
                {
                    int nDelimiterIndex = sUrl.IndexOf(',');
                    if (-1 != nDelimiterIndex)
                    {
                        byte[] aBuffer = System.Convert.FromBase64String(sUrl.Substring(nDelimiterIndex + 1));
                        if (aBuffer.Length <= nMaxBytes)
                            ProcessImage(aBuffer, oTransportClassImgUrl);
                        else
                            oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.UploadContentLength);
                    }
                    else
                        oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.UploadExtension);
                }
                else
                {
                    AsyncDownloadOperation oAsyncDownloadOperation = new AsyncDownloadOperation(nMaxBytes);
                    oTransportClassMediaXml.m_oDownloadOperation = oAsyncDownloadOperation;
                    oAsyncDownloadOperation.DownloadBegin(sUrl, DownloadDataCompleted, oTransportClassImgUrl);
                }
            }
        }
        catch
        {
            WriteOutputCommand(oTransportClassImgUrl, new OutputCommand(ErrorTypes.Upload));
        }
    }
    void DownloadDataCompleted(IAsyncResult ar)
    {
        TransportClassImgUrl oTransportClassImgUrl = ar.AsyncState as TransportClassImgUrl;
        try
        {
            TransportClassMediaXml oTransportClassMediaXml = oTransportClassImgUrl.m_oTransportClassMediaXml;
            ErrorTypes eError;
            byte[] aBuffer;
            oTransportClassMediaXml.m_oDownloadOperation.DownloadEnd(ar, out eError, out aBuffer);
            if (ErrorTypes.NoError == eError)
                ProcessImage(aBuffer, oTransportClassImgUrl);
            else
                oTransportClassImgUrl.SetErrorAndCallback(eError);
        }
        catch
        {
            oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.Upload);
        }
    }
    private void ProcessImage(byte[] aBuffer, TransportClassImgUrl oTransportClassImgUrl)
    {
        TransportClassMediaXml oTransportClassMediaXml = oTransportClassImgUrl.m_oTransportClassMediaXml;
        int nImageFormat = Utils.GetFileFormat(aBuffer);
        if ((0 != (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE & nImageFormat) || FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG == nImageFormat) && -1 != oTransportClassImgUrl.m_sSupportedFormats.IndexOf(FileFormats.ToString(nImageFormat)))
        {
            MemoryStream ms = new MemoryStream(aBuffer);
            string sHash = Utils.getMD5HexString(ms);
            string sExistFilename;
            if (oTransportClassMediaXml.m_aMediaXmlMapHash.TryGetValue(sHash, out sExistFilename))
            {

                oTransportClassImgUrl.SetUrl(Constants.mc_sResourceServiceUrlRel + oTransportClassMediaXml.m_oInputCommand.id + "/media/" + sExistFilename);
                oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.NoError);
            }
            else
            {
                string ext = "." + FileFormats.ToString(nImageFormat);
                string sNewName;
                if(false == oTransportClassImgUrl.m_mapUrlToName.TryGetValue(oTransportClassImgUrl.m_sCurUrl, out sNewName))
                {
                    
                    string sSearchName = "image";
                    List<int> aIndexes = new List<int>();
                    foreach (KeyValuePair<string, string> kvp in oTransportClassMediaXml.m_aMediaXmlMapFilename)
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
                    sNewName = sSearchName + nNewIndex + ext;
                }
                if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG == nImageFormat)
                {
                    
                    string sCurUrl = oTransportClassImgUrl.m_sCurUrl;
                    int nExtIndex = sCurUrl.LastIndexOf(".svg");
                    if (-1 != nExtIndex)
                    {
                        string sStart = sCurUrl.Substring(0, nExtIndex);
                        string sEmfUrl = sStart + ".emf";
                        string sWmfUrl = sStart + ".wmf";
                        oTransportClassImgUrl.AddUrls(new string[] { sEmfUrl, sWmfUrl });
                        oTransportClassImgUrl.m_mapUrlToName[sEmfUrl] = Path.ChangeExtension(sNewName, ".emf");
                        oTransportClassImgUrl.m_mapUrlToName[sWmfUrl] = Path.ChangeExtension(sNewName, ".wmf");
                    }
                }
                oTransportClassMediaXml.m_aMediaXmlMapHash.Add(sHash, sNewName);
                oTransportClassMediaXml.m_aMediaXmlMapFilename.Add(sNewName, sHash);
                oTransportClassMediaXml.m_oStorage = new Storage();
                oTransportClassMediaXml.m_oMemoryStream = ms;
                oTransportClassMediaXml.m_oParam = sNewName;
                ms.Position = 0;
                InputCommand cmd = oTransportClassMediaXml.m_oInputCommand;
                oTransportClassMediaXml.m_oStorage.WriteFileBegin(Path.Combine(cmd.id, @"media\" + sNewName), ms, WriteFileCallback, oTransportClassImgUrl);
            }
        }
        else
            oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.UploadExtension);
    }
    private void WriteFileCallback(IAsyncResult ar)
    {
        TransportClassImgUrl oTransportClassImgUrl = ar.AsyncState as TransportClassImgUrl;
        try
        {
            TransportClassMediaXml oTransportClassMediaXml = oTransportClassImgUrl.m_oTransportClassMediaXml;
            int nReadWriteBytes;
            ErrorTypes eError = oTransportClassMediaXml.m_oStorage.WriteFileEnd(ar, out nReadWriteBytes);
            if (ErrorTypes.NoError == eError)
            {

                oTransportClassImgUrl.SetUrl(Constants.mc_sResourceServiceUrlRel + oTransportClassMediaXml.m_oInputCommand.id + "/media/" + (string)oTransportClassMediaXml.m_oParam);
                oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.NoError);
            }
            else
                oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.Upload);
        }
        catch
        {
            oTransportClassImgUrl.SetErrorAndCallback(ErrorTypes.Upload);
        }
    }
    private void WriteMediaXmlCallback(IAsyncResult ar)
    {
        TransportClassImgUrl oTransportClassImgUrl = ar.AsyncState as TransportClassImgUrl;
        try
        {
            TransportClassMediaXml oTransportClassMediaXml = oTransportClassImgUrl.m_oTransportClassMediaXml;
            ErrorTypes eError = oTransportClassMediaXml.m_oAsyncMediaXmlOperation.WriteMediaXmlEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                if ("imgurl" == oTransportClassImgUrl.m_oTransportClassMediaXml.m_oInputCommand.c)
                {
                    if (oTransportClassImgUrl.m_aErrors.Length > 0)
                    {
                        ErrorTypes eNewError = oTransportClassImgUrl.m_aErrors[0];
                        string sNewUrl = oTransportClassImgUrl.m_aNewUrls[0];
                        if (ErrorTypes.NoError == eNewError)
                            WriteOutputCommand(oTransportClassImgUrl, new OutputCommand("imgurl", sNewUrl));
                        else
                            WriteOutputCommand(oTransportClassImgUrl, new OutputCommand(eNewError));
                    }
                    else
                        WriteOutputCommand(oTransportClassImgUrl, new OutputCommand(ErrorTypes.Upload));
                }
                else
                {
                    JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
                    WriteOutputCommand(oTransportClassImgUrl, new OutputCommand("imgurls", oJavaScriptSerializer.Serialize(oTransportClassImgUrl.GetFromToMap())));
                }
            }
            else
                WriteOutputCommand(oTransportClassImgUrl, new OutputCommand(ErrorTypes.Upload));
        }
        catch
        {
            WriteOutputCommand(oTransportClassImgUrl, new OutputCommand(ErrorTypes.Upload));
        }
    }
    private void ClearCacheCallback(IAsyncResult ar)
    {
        TransportClassClearCache oTransportClassClearCache = ar.AsyncState as TransportClassClearCache;
        try
        {
            ErrorTypes eError = oTransportClassClearCache.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                WriteOutputCommand(oTransportClassClearCache, new OutputCommand((ErrorTypes)oTransportClassClearCache.m_oParam));
            }
            else
                WriteOutputCommand(oTransportClassClearCache, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassClearCache, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void WriteOutputCommand(TransportClassMainAshx oTransportClassMainAshx, OutputCommand oOutputCommand)
    {
        HttpContext oHttpContext = oTransportClassMainAshx.m_oHttpContext;
        AsyncCallback fAsyncCallback = oTransportClassMainAshx.m_oAsyncCallback;
        oHttpContext.Response.ContentType = "text/plain";
        DataContractJsonSerializer serOut = new DataContractJsonSerializer(typeof(OutputCommand));
        serOut.WriteObject(oHttpContext.Response.OutputStream, oOutputCommand);

        fAsyncCallback.Invoke(new AsyncOperationData(null));
    }
    #endregion
    #region HelpFunction
    private void CreateCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        try
        {
            TaskResultData oTaskResultData = new TaskResultData();
            oTaskResultData.sKey = cmd.id;

            if (false == string.IsNullOrEmpty(cmd.format))
                oTaskResultData.sFormat = cmd.format;

            oTaskResultData.eStatus = FileStatus.Ok;
            oTaskResultData.oLastOpenDate = DateTime.UtcNow;

            if (false == string.IsNullOrEmpty(cmd.title))
                oTaskResultData.sTitle = cmd.title;

            TaskResult oTaskResult = new TaskResult();
            TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);

            oTaskResult.GetOrCreateBegin(cmd.id, oTaskResultData, TaskResultGetOrCreateCallback2, oTransportClassTaskResult);
        }
        catch
        {
            WriteOutputCommand(oTransportClassContextRead, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void OpenCommand(TransportClassMainAshx oTransportClassMainAshx, InputCommand cmd)
    {
        try
        {
            TaskResultData oTaskResultData = new TaskResultData();
            oTaskResultData.sKey = cmd.id;
            
            if (false == string.IsNullOrEmpty(cmd.format))
                oTaskResultData.sFormat = cmd.format;
            
            oTaskResultData.eStatus = FileStatus.WaitQueue;
            oTaskResultData.oLastOpenDate = DateTime.UtcNow;
            
            if (false == string.IsNullOrEmpty(cmd.title))
                oTaskResultData.sTitle = cmd.title;
            
            TaskResult oTaskResult = new TaskResult();
            TransportClassTaskResult oTransportClassClearCache = new TransportClassTaskResult(oTransportClassMainAshx, cmd, oTaskResult);
            
            oTaskResult.GetOrCreateBegin(cmd.id, oTaskResultData, TaskResultGetOrCreateCallback, oTransportClassClearCache);
        }
        catch
        {
            WriteOutputCommand(oTransportClassMainAshx, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetProcess(TaskResultData oTaskInfo, bool bDataCreate, InputCommand cmd, TransportClassMainAshx oTransportClassMainAshx)
    {
        switch (oTaskInfo.eStatus)
        {
            case FileStatus.Ok:
                string sAffiliateId = null;
                Signature.getVKeyStringParam(cmd.vkey, ConfigurationSettings.AppSettings["keyKeyID"], out sAffiliateId);
                if (null != sAffiliateId)
                {
                    string sTag = null;
                    switch (cmd.editorid)
                    {
                        case (int)LicenseInfo.EditorType.Spreadsheet: sTag = "open_sheet"; break;
                        case (int)LicenseInfo.EditorType.Presentation: sTag = "open_presentation"; break;
                        default: sTag = "open_word"; break;
                    }
                    FileConverterUtils2.FileStatistic oFileStat = new FileStatistic();
                    oFileStat.insert(sAffiliateId, cmd.id, DateTime.UtcNow, sTag);
                }
                if ("create" == cmd.c)
                    WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("create", cmd.id + "/Editor.bin"));
                else
                    WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("open", cmd.id + "/Editor.bin"));
                break;
            case FileStatus.Convert:
            case FileStatus.WaitQueue:
                {
                    if (bDataCreate)
                    {
                        AddTask(cmd, oTransportClassMainAshx);
                    }
                    else
                    {
                        
                        WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("waitopen", oTaskInfo.nStatusInfo.ToString()));
                    }
                }
                break;
            case FileStatus.None:
                {

                    if (bDataCreate)
                    {
                        TaskResultDataToUpdate oToUpdate = new TaskResultDataToUpdate();
                        oToUpdate.eStatus = FileStatus.WaitQueue;
                        TaskResult oTaskResult = new TaskResult();
                        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassMainAshx, cmd, oTaskResult);
                        oTaskResult.UpdateBegin(cmd.id, oToUpdate, TaskResultUpdateCallback, oTransportClassTaskResult);

                    }
                    else
                    {
                        
                        WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("waitopen", oTaskInfo.nStatusInfo.ToString()));
                    }
                }
                break;
            case FileStatus.NeedParams:
                string sUrl = Constants.mc_sResourceServiceUrlRel + HttpUtility.UrlEncode(cmd.id + "/settings.json");
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("needparams", sUrl));
                break;
            case FileStatus.ErrToReload:
                {
                    
                    AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
                    TransportClassClearCache oTempTransportClassClearCache = new TransportClassClearCache(oTransportClassMainAshx, cmd, oAsyncClearCacheOperation, oTaskInfo.nStatusInfo);
                    oAsyncClearCacheOperation.ClearCacheBegin(cmd.id, TaskResultRemoveCallback2, oTempTransportClassClearCache);
                }
                break;
            case FileStatus.Err:
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand((ErrorTypes)oTaskInfo.nStatusInfo));
                break;
            default:
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand(ErrorTypes.Unknown));
                break;
        }
    }
    #endregion
    #region TransportClasses
    private class TransportClassContextRead : TransportClassMainAshx
    {
        public AsyncContextReadOperation m_oAsyncContextReadOperation;
        public TransportClassContextRead(TransportClassMainAshx m_oTransportClassMainAshx, AsyncContextReadOperation oAsyncContextReadOperation)
            : base(m_oTransportClassMainAshx.m_oHttpContext, m_oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncContextReadOperation = oAsyncContextReadOperation;
        }
    }
    private class TransportClassTaskResult : TransportClassMainAshx
    {
        public InputCommand m_oInputCommand;
        public TaskResult m_oTaskResult;
        public TransportClassTaskResult(TransportClassMainAshx oTransportClassMainAshx, InputCommand oInputCommand, TaskResult oTaskResult)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oInputCommand = oInputCommand;
            m_oTaskResult = oTaskResult;
        }
    }
    private class TransportClassStorage : TransportClassMainAshx
    {
        public InputCommand m_oInputCommand;
        public Storage m_oStorage;
        public Stream m_oStream;
        public string m_sKey;
        public TransportClassStorage(TransportClassMainAshx oTransportClassMainAshx, InputCommand oInputCommand, Storage oStorage, Stream stream, string sKey)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oInputCommand = oInputCommand;
            m_oStorage = oStorage;
            m_oStream = stream;
            m_sKey = sKey;
        }
    }
    private class TransportClassStorage2 : TransportClassStorage
    {
        public string m_sFilename;
        public string m_sExt;
        public OutputCommand m_oOutputCommand;
        public TransportClassStorage2(TransportClassMainAshx oTransportClassMainAshx, InputCommand oInputCommand, Storage oStorage, Stream stream, string sKey, string sFilename, string sExt, OutputCommand oOutputCommand)
            : base(oTransportClassMainAshx, oInputCommand, oStorage, stream, sKey)
        {
            m_sFilename = sFilename;
            m_sExt = sExt;
            m_oOutputCommand = oOutputCommand;
        }
    }
    private class TransportClassTaskQueue : TransportClassMainAshx
    {
        public CTaskQueue m_oTaskQueue;
        public object m_oParam;
        public TransportClassTaskQueue(TransportClassMainAshx oTransportClassMainAshx, CTaskQueue oTaskQueue, object oParam)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oTaskQueue = oTaskQueue;
            m_oParam = oParam;
        }
    }
    private class TransportClassClearCache : TransportClassMainAshx
    {
        public AsyncClearCacheOperation m_oAsyncClearCacheOperation;
        public InputCommand m_oInputCommand;
        public object m_oParam;
        public TransportClassClearCache(TransportClassMainAshx m_oTransportClassMainAshx, InputCommand oInputCommand, AsyncClearCacheOperation oAsyncClearCacheOperation, object oParam)
            : base(m_oTransportClassMainAshx.m_oHttpContext, m_oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncClearCacheOperation = oAsyncClearCacheOperation;
            m_oInputCommand = oInputCommand;
            m_oParam = oParam;
        }
    }
    private class TransportClassMediaXml : TransportClassMainAshx
    {
        public AsyncMediaXmlOperation m_oAsyncMediaXmlOperation;
        public AsyncDownloadOperation m_oDownloadOperation;
        public InputCommand m_oInputCommand;
        public Dictionary<string, string> m_aMediaXmlMapHash;
        public Dictionary<string, string> m_aMediaXmlMapFilename;
        public Storage m_oStorage;
        public MemoryStream m_oMemoryStream;
        public object m_oParam;
        public TransportClassMediaXml(TransportClassMainAshx m_oTransportClassMainAshx, InputCommand oInputCommand, AsyncMediaXmlOperation oAsyncMediaXmlOperation, object oParam)
            : base(m_oTransportClassMainAshx.m_oHttpContext, m_oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_oAsyncMediaXmlOperation = oAsyncMediaXmlOperation;
            m_oInputCommand = oInputCommand;
            m_oParam = oParam;
        }
    }
    private class TransportClassImgUrl : TransportClassMainAshx
    {
        public delegate void TransportClassImgUrlErrorCallback(IAsyncResult ar);
        public TransportClassMediaXml m_oTransportClassMediaXml;
        public string[] m_aUrls;
        private int m_nIndex;
        public string[] m_aNewUrls;
        public ErrorTypes[] m_aErrors;
        public string m_sSupportedFormats;
        public string m_sCurUrl;
        public Dictionary<string, string> m_mapUrlToName = new Dictionary<string, string>();
        private TransportClassImgUrlErrorCallback m_oTransportClassImgUrlErrorCallback;
        public TransportClassImgUrl(TransportClassMediaXml oTransportClassMediaXml, string[] aUrls, string sSupportedFormats, TransportClassImgUrlErrorCallback oTransportClassImgUrlErrorCallback)
            : base(oTransportClassMediaXml.m_oHttpContext, oTransportClassMediaXml.m_oAsyncCallback)
        {
            m_oTransportClassMediaXml = oTransportClassMediaXml;
            m_oTransportClassImgUrlErrorCallback = oTransportClassImgUrlErrorCallback;
            m_aUrls = aUrls;
            m_nIndex = 0;
            m_aNewUrls = new string[m_aUrls.Length];
            m_aErrors = new ErrorTypes[m_aUrls.Length];
            m_sSupportedFormats = sSupportedFormats;
            for (int i = 0, length = m_aUrls.Length; i < length; ++i)
            {
                m_aErrors[i] = ErrorTypes.Unknown;
                m_aNewUrls[i] = "error";
            }
        }
        public void AddUrls(string[] aUrls)
        {
            if (aUrls.Length > 0)
            {
                int nCurLength = m_aUrls.Length;
                int nAddLength = aUrls.Length;
                string[] aTempUrls = new string[nCurLength + nAddLength];
                m_aUrls.CopyTo(aTempUrls, 0);
                aUrls.CopyTo(aTempUrls, nCurLength);
                m_aUrls = aTempUrls;
                string[] aTempNewUrls = new string[nCurLength + nAddLength];
                m_aNewUrls.CopyTo(aTempNewUrls, 0);
                m_aNewUrls = aTempNewUrls;
                ErrorTypes[] aTempErrors = new ErrorTypes[nCurLength + nAddLength];
                m_aErrors.CopyTo(aTempErrors, 0);
                m_aErrors = aTempErrors;
                for (int i = 0; i < nAddLength; i++)
                {
                    m_aErrors[nCurLength + i] = ErrorTypes.Unknown;
                    m_aNewUrls[nCurLength + i] = "error";
                }
               
            }
        }
        public string GetNextUrl()
        {
            string sRes = null;
            if (m_nIndex < m_aUrls.Length)
            {
                sRes = m_aUrls[m_nIndex];
                m_nIndex++;
            }
            m_sCurUrl = sRes;
            return sRes;
        }
        public void SetErrorAndCallback(ErrorTypes eError)
        {
            if (m_nIndex - 1 < m_aUrls.Length)
                m_aErrors[m_nIndex - 1] = eError;
            if (null != m_oTransportClassImgUrlErrorCallback)
                m_oTransportClassImgUrlErrorCallback.Invoke(new AsyncOperationData(this));
        }
        public void SetUrl(string sUrl)
        {
            if (m_nIndex - 1 < m_aUrls.Length)
                m_aNewUrls[m_nIndex - 1] = sUrl;
        }
        public Dictionary<string, string> GetFromToMap()
        {
            Dictionary<string, string> oFromTo = new Dictionary<string, string>();
            for (int i = 0, length1 = m_aUrls.Length, length2 = m_aNewUrls.Length; i < length1 && i < length2; i++)
                oFromTo[m_aUrls[i]] = m_aNewUrls[i];
            return oFromTo;
        }
    }
    public class InputCommand
    {
        public string id { get; set; }
        public string format { get; set; }
        public int editorid { get; set; }
        public string c { get; set; }
        public string url { get; set; }
        public string vkey { get; set; }
        public string title { get; set; }
        public string data { get; set; }
        public int outputformat { get; set; }
        public string savetype { get; set; }
        public string savekey { get; set; }
        public int? codepage { get; set; }
        public int? delimiter { get; set; }
        public bool embeddedfonts { get; set; }
        public bool innersave { get; set; }
        public string userid { get; set; }
        
        public string t { get; set; }
        public string v { get; set; }
        
        public InputCommand()
        {
            innersave = false;
        }
    }
    [DataContract]
    public class OutputCommand
    {
        [DataMember]
        internal string type;
        [DataMember]
        internal string data;
        public OutputCommand(string t, string d)
        {
            type = t;
            data = d;
        }
        public OutputCommand(ErrorTypes eError)
        {
            type = "err";
            data = eError.ToString("d");
        }
    }
    public class OutputWaitSaveData
    {
        public string key;
        public string filename;
        public int format;
        public OutputWaitSaveData()
        {
        }
        public OutputWaitSaveData(string _key, string _filename, int _format)
        {
            key = _key;
            filename = _filename;
            format = _format;
        }
    }
    public class OutputSavePartData
    {
        public string savekey;
        public int format;
        public OutputSavePartData()
        {
        }
        public OutputSavePartData(string _savekey, int _format)
        {
            savekey = _savekey;
            format = _format;
        }
    }

    public enum TrackingType {
        TT_USER_COUNT = 0,          
        TT_ACTIVE_CONNECTION = 1,   
        TT_TIME_USAGE = 2,          
        TT_DOCUMENT_SESSION = 3,    
        TT_NONE = 4,                
        TT_USER_COUNT2 = 5          
    };
    public class OutputSettingsTrackingData
    {
        public TrackingType trackingType;
        public string licenseId; 
        public string trackingUrl;
    }
    
    public class OutputSettingsData
    {
        public bool canEdit;
        public bool canDownload;
        public bool canCoAuthoring;
        public bool canReaderMode;
        public bool canAd;
        public bool canBranding;
        public bool isAutosaveEnable;
        public int AutosaveMinInterval;
        public string g_cAscCoAuthoringUrl; 
        public string g_cAscSpellCheckUrl;  
        
        public OutputSettingsTrackingData trackingInfo;

        public int TrackingInterval;

        public OutputSettingsData()
        {
            canEdit = true;
            canDownload = true;
            canCoAuthoring = true;
            canReaderMode = true;
            canAd = true;
            canBranding = true;
            
            isAutosaveEnable = bool.Parse(ConfigurationSettings.AppSettings["editor.settings.autosave.enable1"] ?? "true");
            AutosaveMinInterval = int.Parse(ConfigurationSettings.AppSettings["editor.settings.autosave.mininterval1"] ?? "300");
            
            g_cAscCoAuthoringUrl = ConfigurationSettings.AppSettings["editor.settings.coauthoring.url"] ?? "";
            g_cAscSpellCheckUrl = ConfigurationSettings.AppSettings["editor.settings.spellchecker.url"] ?? "";

            trackingInfo = null;
            
            TrackingInterval = int.Parse(ConfigurationSettings.AppSettings["license.activeconnections.tracking.interval"] ?? "300");
        }
        public OutputSettingsData(LicenseInfo.LicenseRights oRights, string sFormat, OutputSettingsTrackingData oTrackingInfo)
            : this()
        {
            if (null != sFormat)
            {
                sFormat = sFormat.ToLower();

                char[] aDelemiters = { '|', ',', ';' };
                string sReaderFormats = ConfigurationSettings.AppSettings["editor.settings.readerformats"] ?? "";
                List<string> aReaderFormats = (sReaderFormats.Split(aDelemiters, StringSplitOptions.RemoveEmptyEntries)).ToList();
                canReaderMode = aReaderFormats.Contains(sFormat);

                string sEditorFormats = ConfigurationSettings.AppSettings["editor.settings.editorformats"] ?? "";
                List<string> aEditorFormats = (sEditorFormats.Split(aDelemiters, StringSplitOptions.RemoveEmptyEntries)).ToList();
                canEdit = aEditorFormats.Contains(sFormat);

                string sViewerFormats = ConfigurationSettings.AppSettings["editor.settings.viewerformats"] ?? "";
                List<string> aViewerFormats = (sViewerFormats.Split(aDelemiters, StringSplitOptions.RemoveEmptyEntries)).ToList();
                canDownload = !aViewerFormats.Contains(sFormat);
            }

            if (null != oRights)
            {
                canEdit &= oRights.CanSave;
                canCoAuthoring = oRights.CanCoAuthoring;
                canBranding = oRights.CanBranding;
                canDownload &= oRights.CanExport;

            }

            if (null != oTrackingInfo)
            {
                trackingInfo = oTrackingInfo;
            }
        }
    }

    #endregion
}