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

namespace DocService
{
public class CanvasService : IHttpAsyncHandler
{
    private const char c_cCharDelimiter = (char)5;
    private const string c_sSaveTypePartStart = "partstart";
    private const string c_sSaveTypePart = "part";
    private const string c_sSaveTypeComplete = "complete";
    private const string c_sSaveTypeCompleteAll = "completeall";
    private readonly ILog _log = LogManager.GetLogger(typeof(CanvasService));
    private OutputCommand m_oSfcOk = new OutputCommand("sfc", "");

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
            strStream = System.Text.Encoding.UTF8.GetString(asyncOp.m_aOutput.GetBuffer(), 0, (int)asyncOp.m_aOutput.Length);

            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = ReadCommand(strStream);
                if (null == cmd)
                {
                    
                    eError = ErrorTypes.Unknown;
                    WriteOutputCommand(oTransportClassContextRead, new OutputCommand(eError));
                    eError = ErrorTypes.NoError;
                }
                else
                {
                    try
                    {
                        
                        if ("save" == cmd.c && FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == cmd.outputformat && !string.IsNullOrEmpty(cmd.data) && 0 != (cmd.data.Length % 4))
                        {
                            HttpContext context = oTransportClassContextRead.m_oHttpContext;
                            int nContentLength = context.Request.ContentLength;
                            bool bCanSeek = context.Request.InputStream.CanSeek;
                            long nInputStreamLength = 0;
                            if (bCanSeek)
                                nInputStreamLength = context.Request.InputStream.Length;
                            long nOutputLength = asyncOp.m_aOutput.Length;
                            int nStrStream = strStream.Length;
                            int nDataLength = cmd.data.Length;
                            string sJson = "";
                            string sSearchString = "mnuSaveAs";
                            if (strStream.StartsWith(sSearchString))
                            {
                                int nSearchStringLength = sSearchString.Length;
                                int nIdStart = nSearchStringLength + 1;
                                int nIdEnd = strStream.IndexOf(c_cCharDelimiter, nIdStart);

                                sJson = strStream.Substring(nIdStart, nIdEnd - nIdStart);
                            }
                            string sHeaders = context.Request.Headers.ToString();
                            string sFormat = "Print pdf error nContentLength:{0};bCanSeek:{1};nInputStreamLength:{2};nOutputLength:{3};nStrStream:{4};nDataLength:{5};sJson:{6};sHeaders:{7}";
                            _log.ErrorFormat(sFormat, nContentLength, bCanSeek, nInputStreamLength, nOutputLength, nStrStream, nDataLength, sJson, sHeaders);
                        }
                    }
                    catch(Exception e)
                    {
                        _log.Error("Exception catched in Print error:", e);
                    }

                    eError = ProcessCommand(oTransportClassContextRead, cmd);
                }
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
			{
				_log.InfoFormat("Error {0} occur in ReadContext:", eError);
                WriteOutputCommand(oTransportClassContextRead, new OutputCommand(eError));
        	}
    	}	
    }

    private ErrorTypes ProcessCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        ErrorTypes eError = ErrorTypes.NoError;

			_log.DebugFormat("ProcessCommand {0}:", cmd.c);
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
                case "sfct":
                    SfctCommand(oTransportClassContextRead, cmd);
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
                case "sfcc":
                    SaveFileChangesCallbackCommand(oTransportClassContextRead, cmd);
                    break;

                case "savefromorigin":
                    SaveFormOriginCommand(oTransportClassContextRead, cmd);
                    break;

                case "getsettings":

                    GetSettingsCommand(oTransportClassContextRead, cmd);

                    break;

                default:
					_log.InfoFormat("Unknown command: {0}", cmd.c);
                    eError = ErrorTypes.Unknown;
                    break;
            }

        return eError;
    }

    private static InputCommand ReadCommand(string strStream)
    {
        string sSearchString = "mnuSaveAs";
        InputCommand cmd;
        if (strStream.StartsWith(sSearchString))
        {
            
            int nSearchStringLength = sSearchString.Length;
            int nIdStart = nSearchStringLength + 1;
            int nIdEnd = strStream.IndexOf(c_cCharDelimiter, nIdStart);

            string sJson = strStream.Substring(nIdStart, nIdEnd - nIdStart);
            cmd = InputCommand.DeserializeFromJson(sJson);
            cmd.data = strStream.Substring(nIdEnd + 1);
        }
        else
            cmd = InputCommand.DeserializeFromJson(strStream);
        return cmd;
    }

    private void GetSettingsCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)

    {

        OutputSettingsData oOutputSettingsData = new OutputSettingsData(cmd.format);

        JavaScriptSerializer oJsSerializer = new JavaScriptSerializer();  
        OutputCommand oOutputCommand = new OutputCommand("getsettings", oJsSerializer.Serialize(oOutputSettingsData));
        WriteOutputCommand(oTransportClassContextRead, oOutputCommand);
    }

    private void SaveFormOriginCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        TaskResultData oTaskResultData = new TaskResultData();
        oTaskResultData.sKey = cmd.id;
        oTaskResultData.sFormat = cmd.format;
        oTaskResultData.eStatus = FileStatus.WaitQueue;
        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback2, oTransportClassTaskResult);
    }

    private void ImageUrlCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        AsyncMediaXmlOperation oAsyncMediaXmlOperation = new AsyncMediaXmlOperation();
        TransportClassMediaXml oTransportClassMediaXml = new TransportClassMediaXml(oTransportClassContextRead, cmd, oAsyncMediaXmlOperation, null);
        oAsyncMediaXmlOperation.GetMediaXmlBegin(Path.Combine(cmd.id, "media/media.xml"), GetMediaXmlCallback, oTransportClassMediaXml);
    }

    private void GetCodepageCommand(TransportClassContextRead oTransportClassContextRead)
    {
        string sJson = Utils.GetSerializedEncodingProperty("temp", null, null);
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
        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.GetBegin(oOutputWaitSaveData.key, TaskResultGetAsyncCallback, oTransportClassTaskResult);
    }

    private void SaveCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
		_log.DebugFormat("SaveCommand, savetype={0}.", cmd.savetype);
        switch (cmd.savetype)
        {
            case c_sSaveTypePartStart:
            case c_sSaveTypeCompleteAll:
                {
					_log.Debug("cmd.savetype = SaveTypes.PartStart or SaveTypes.CompleteAll.");
                    TaskResultData oTaskResultData = new TaskResultData();
                    oTaskResultData.sKey = cmd.id;
                    oTaskResultData.sFormat = cmd.format;
                    oTaskResultData.eStatus = FileStatus.WaitQueue;
                    ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                    TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
                    oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback, oTransportClassTaskResult);
                    break;
                }
            case c_sSaveTypePart:
            case c_sSaveTypeComplete:
            default:
                {

					_log.Debug("cmd.savetype = SaveTypes.Part or SaveTypes.Complete or default.");
                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    OutputSavePartData oOutputSavePartData = new OutputSavePartData(cmd.savekey, cmd.outputformat.Value);
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
        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.GetBegin(cmd.id, TaskResultGetCallback, oTransportClassTaskResult);
    }

    private void ReopenCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        try
        {
            TaskResultDataToUpdate oTaskResultData = new TaskResultDataToUpdate();
            oTaskResultData.eStatus = FileStatus.WaitQueue;
            oTaskResultData.nStatusInfo = (int)ErrorTypes.NoError;

            ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
            TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);

            oTaskResult.UpdateBegin(cmd.id, oTaskResultData, TaskResultUpdateCallback, oTransportClassTaskResult);
        }
        catch
        {
            WriteOutputCommand(oTransportClassContextRead, new OutputCommand(ErrorTypes.Unknown));
        }
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
			_log.DebugFormat("oTransportClassStorage.m_sKey={0}:", oTransportClassStorage.m_sKey);
			_log.DebugFormat("oTransportClassStorage.m_sFilename={0}:", oTransportClassStorage.m_sFilename);
			_log.DebugFormat("nMaxIndex={0}:", nMaxIndex);
			_log.DebugFormat("oTransportClassStorage.m_sExt={0}:", oTransportClassStorage.m_sExt);
            oStorage.WriteFileBegin(Path.Combine(oTransportClassStorage.m_sKey, oTransportClassStorage.m_sFilename + nMaxIndex + oTransportClassStorage.m_sExt), ms, ChangesWriteCallback, oTransportClassStorage);
        }
        catch(Exception e)
        {
			_log.Error("Exception catched in GetTreeNodeCallback:", e);
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
                
                int nOutputFormat = cmd.outputformat.HasValue ? cmd.outputformat.Value : FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_TEAMLAB_INNER;
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
        catch(Exception e)
        {
			_log.Error("Exception catched in ChangesWriteCallback:", e);
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetAsyncCallbackOk(TransportClassTaskResult oTransportClassTaskResult)
    {
        InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
        JavaScriptSerializer oJavaScriptSerializer = new JavaScriptSerializer();
        OutputWaitSaveData oOutputWaitSaveData = oJavaScriptSerializer.Deserialize<OutputWaitSaveData>(cmd.data);
        
        string sUrlPrefix = UrlBuilder.UrlWithoutPath( oTransportClassTaskResult.m_oHttpContext.Request );
        string sUrl = GetResultUrl( sUrlPrefix,
                                    oOutputWaitSaveData.key,
                                    oOutputWaitSaveData.filename,
                                    cmd.title + "." + FileFormats.ToString(oOutputWaitSaveData.format));
        
        WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("save", sUrl));
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
                        TaskResultGetAsyncCallbackOk(oTransportClassTaskResult);
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
				try
                {
                    if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == cmd.outputformat && !string.IsNullOrEmpty(cmd.data) && 0 != (cmd.data.Length % 4))
                        _log.ErrorFormat("Print error Request.Headers:{0}", oTransportClassTaskResult.m_oHttpContext.Request.Headers.ToString());
                }
                catch { }
                
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
                    
                    int nOutputFormat = cmd.outputformat.Value;
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
                    OutputSavePartData oOutputSavePartData = new OutputSavePartData(oTransportClassStorage.m_sKey, cmd.outputformat.Value);
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
        catch(Exception e)
        {
			_log.Error("Exception catched in TaskQueueAddCallbackSave:", e);
            WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultUpdateIfCallback2(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            bool bUpdate;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.UpdateIfEnd(ar, out bUpdate);
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                if (bUpdate)
                    WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("open", cmd.id + "/Editor.bin"));
                else
                    WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("updateversion", cmd.id + "/Editor.bin"));
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
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
                    Storage oStorage = new Storage();
                    TransportClassStorage oTransportClassStorage = new TransportClassStorage(oTransportClassTaskResult, oTransportClassTaskResult.m_oInputCommand, oStorage, null, null);
                    oStorage.CreateDirectoryBegin(cmd.id + "/media", CreateDirectoryCallback, oTransportClassStorage);
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
    private void CreateDirectoryCallback(IAsyncResult ar)
    {
        TransportClassStorage oTransportClassStorage = ar.AsyncState as TransportClassStorage;
        try
        {
            Storage oStorage = oTransportClassStorage.m_oStorage;
            ErrorTypes eError = oStorage.CreateDirectoryEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassStorage.m_oInputCommand;
                MemoryStream oMemoryStream = new MemoryStream(Encoding.ASCII.GetBytes(cmd.data));
                oTransportClassStorage.m_oStream = oMemoryStream;
                oTransportClassStorage.m_sKey = cmd.id;
                oStorage.WriteFileBegin(cmd.id + "/Editor.bin", oMemoryStream, EditorBinWriteCallback, oTransportClassStorage);
            }
            else
                WriteOutputCommand(oTransportClassStorage, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassStorage, new OutputCommand(ErrorTypes.Unknown));
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
			
            WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand("waitopen", "0"));
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
                if ("reopen" == cmd.c)
                {
                    oTaskQueueData.m_sFromKey = cmd.id;
                    oTaskQueueData.m_bFromSettings = true;
                }
                else
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

				WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand("waitopen", "0"));
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultUpdateCallback3(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.UpdateEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                if ("create" == cmd.c)
                    WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("create", cmd.id + "/Editor.bin"));
                else
                    WriteOutputCommand(oTransportClassTaskResult, new OutputCommand("open", cmd.id + "/Editor.bin"));
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
			
        }
        catch(Exception e)
        {
			_log.Error("Exception catched in TaskQueueAddCallback:", e);
			
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
                    AsyncWebRequestOperation oAsyncDownloadOperation = new AsyncWebRequestOperation(nMaxBytes);
                    oTransportClassMediaXml.m_oDownloadOperation = oAsyncDownloadOperation;
                    oTransportClassMediaXml.m_iAsyncResult = oAsyncDownloadOperation.RequestBegin(sUrl, "GET", null, null, DownloadDataCompleted, oTransportClassImgUrl);
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
            byte[] aBuffer;
            ErrorTypes eError = oTransportClassMediaXml.m_oDownloadOperation.RequestEnd(oTransportClassMediaXml.m_iAsyncResult, out aBuffer);
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
        int nImageFormat = FormatChecker.GetFileFormat(aBuffer);
        if ((0 != (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE & nImageFormat) || FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG == nImageFormat) && -1 != oTransportClassImgUrl.m_sSupportedFormats.IndexOf(FileFormats.ToString(nImageFormat)))
        {
            if (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_GIF == nImageFormat || FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_ICO == nImageFormat)
            {
                byte[] aNewBuffer;
                if (Utils.ConvertGifIcoToPng(aBuffer, nImageFormat, out aNewBuffer))
                {
                    nImageFormat = FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_PNG;
                    aBuffer = aNewBuffer;
                }
            }
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
        string sJson = new JavaScriptSerializer().Serialize(oOutputCommand);
        byte[] aJsonUtf8 = Encoding.UTF8.GetBytes(sJson);
        oHttpContext.Response.OutputStream.Write(aJsonUtf8, 0, aJsonUtf8.Length);

        fAsyncCallback.Invoke(new AsyncOperationData(null));
    }
    private string GetResultUrl(string sSiteUrl, string sKey, string sRealFilename, string sOutputFilename)
    {
        return GetResultUrl(sSiteUrl, sKey, sRealFilename, sOutputFilename, true);
    }
    private string GetResultUrl(string sSiteUrl, string sKey, string sRealFilename, string sOutputFilename, bool bDelete)
    {
        string sPath = HttpUtility.UrlEncode(sKey + "/" + sRealFilename);
        string sDeletePath = HttpUtility.UrlEncode(sKey);
        string sFilename = HttpUtility.UrlEncode(sOutputFilename);
        string sRes = sSiteUrl + Constants.mc_sResourceServiceUrlRel + sPath + "&nocache=true";
        if (bDelete)
            sRes += "&deletepath=" + sDeletePath;
        sRes += "&filename=" + sFilename;
        return sRes;
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

            if (false == string.IsNullOrEmpty(cmd.title))
                oTaskResultData.sTitle = cmd.title;

            ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
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
            
            if (false == string.IsNullOrEmpty(cmd.title))
                oTaskResultData.sTitle = cmd.title;
            
            ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
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
                {
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

					ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
					TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(
						oTransportClassMainAshx, cmd, oTaskResult);
					
					string sOutputCommand = ("create" == cmd.c)? "create": "open";
					
					WriteOutputCommand(oTransportClassTaskResult, 
						new OutputCommand(sOutputCommand, cmd.id + "/Editor.bin"));
                }
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
                        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
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
            case FileStatus.SaveVersion:
                {
                    if (cmd.viewmode)
                        WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("updateversion", cmd.id + "/Editor.bin"));
                    else
                    {
                        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                        TaskResultDataToUpdate oTask = new TaskResultDataToUpdate();
                        oTask.eStatus = FileStatus.Ok;
                        TaskResultDataToUpdate oMask = new TaskResultDataToUpdate();
                        oMask.eStatus = FileStatus.SaveVersion;
                        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassMainAshx, cmd, oTaskResult);
                        oTaskResult.UpdateIfBegin(cmd.id, oMask, oTask, TaskResultUpdateIfCallback2, oTransportClassTaskResult);
                    }
                }
                break;
            case FileStatus.UpdateVersion:
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand("updateversion", cmd.id + "/Editor.bin"));
                break;
            default:
                WriteOutputCommand(oTransportClassMainAshx, new OutputCommand(ErrorTypes.Unknown));
                break;
        }
    }
    #endregion
    #region sfct
    private void SfctCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        TaskResultData oTaskResultData = new TaskResultData();
        oTaskResultData.sKey = cmd.id;
        oTaskResultData.sFormat = cmd.format;
        oTaskResultData.eStatus = FileStatus.WaitQueue;
        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
        TransportClassTaskResult oTransportClassTaskResult = new TransportClassTaskResult(oTransportClassContextRead, cmd, oTaskResult);
        oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback4, oTransportClassTaskResult);
    }
    private void TaskResultAddRandomKeyAsyncCallback4(IAsyncResult ar)
    {
        TransportClassTaskResult oTransportClassTaskResult = ar.AsyncState as TransportClassTaskResult;
        try
        {
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassTaskResult.m_oTaskResult.AddRandomKeyEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                
                InputCommand cmd = oTransportClassTaskResult.m_oInputCommand;
                TaskQueueData oTaskQueueData = new TaskQueueData(oTaskResultData.sKey, cmd.outputformat.Value, "output." + FileFormats.ToString(cmd.outputformat.Value));
                oTaskQueueData.m_sFromKey = cmd.id;
                oTaskQueueData.m_sFromFormat = "doct";
                oTaskQueueData.m_bFromChanges = true;

                CTaskQueue oTaskQueue = new CTaskQueue();
                TransportClassTaskQueue oTransportClassTaskQueue = new TransportClassTaskQueue(oTransportClassTaskResult, oTaskQueue, oTaskQueueData);
                oTaskQueue.AddTaskBegin(oTaskQueueData, Priority.Low, TaskQueueAddCallbackSave3, oTransportClassTaskQueue);
            }
            else
                WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(eError));
        }
        catch
        {
            WriteOutputCommand(oTransportClassTaskResult, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskQueueAddCallbackSave3(IAsyncResult ar)
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
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskQueueAddCallbackSave2:", e);
            WriteOutputCommand(oTransportClassTaskQueue, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    #endregion
    #region sfc
    private void SaveFileChangesCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        try
        {
            _log.DebugFormat("Enter SaveFileChangesCommand(id={0})", cmd.id);
            TransportClassSaveChanges1 oTransportClassSaveChanges = new TransportClassSaveChanges1(oTransportClassContextRead);
            oTransportClassSaveChanges.m_oInputCommand = cmd;
            oTransportClassSaveChanges.m_oTaskResult = TaskResult.NewTaskResult();
            oTransportClassSaveChanges.m_oTaskResult.GetBegin(cmd.id, TaskResultGetCallback2, oTransportClassSaveChanges);
        }
        catch(Exception e)
        {
            _log.Error("Exception catched in SaveFileChangesCommand:", e);
            WriteOutputCommand(oTransportClassContextRead, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetCallback2(IAsyncResult ar)
    {
        TransportClassSaveChanges1 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges1;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultGetCallback2(id={0})", cmd.id);
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskResult.GetEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                
                if (oTaskResultData.oLastOpenDate < DateTime.UtcNow.AddMilliseconds( - Convert.ToInt32(cmd.data)))
                {
                    TaskResultDataToUpdate oTaskResultDataToUpdate = new TaskResultDataToUpdate();
                    oTaskResultDataToUpdate.eStatus = FileStatus.SaveVersion;
                    oTaskResultDataToUpdate.nStatusInfo = Convert.ToInt32(DateTime.UtcNow.TimeOfDay.TotalMilliseconds);
                    oTransportClassSaveChanges.m_oTaskResultDataToUpdate = oTaskResultDataToUpdate;
                    oTransportClassSaveChanges.m_oTaskResult.UpdateBegin(cmd.id, oTaskResultDataToUpdate, TaskResultUpdateCallback2, oTransportClassSaveChanges);
                }
                else
                {
                    _log.DebugFormat("oTaskResultData.oLastOpenDate < DateTime.UtcNow.AddMilliseconds(id={0})", cmd.id);
                    WriteOutputCommand(oTransportClassSaveChanges, m_oSfcOk);
                }
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultGetCallback2(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultGetCallback2:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultUpdateCallback2(IAsyncResult ar)
    {
        TransportClassSaveChanges1 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges1;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultUpdateCallback2(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskResult.UpdateEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                TaskResultData oTaskResultData = new TaskResultData();
                oTaskResultData.sKey = cmd.id;
                oTaskResultData.sFormat = "bin";
                oTaskResultData.eStatus = FileStatus.WaitQueue;
                oTransportClassSaveChanges.m_oTaskResult.AddRandomKeyBegin(cmd.id, oTaskResultData, TaskResultAddRandomKeyAsyncCallback3, oTransportClassSaveChanges);
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultUpdateCallback2(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultUpdateCallback2:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultAddRandomKeyAsyncCallback3(IAsyncResult ar)
    {
        TransportClassSaveChanges1 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges1;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultAddRandomKeyAsyncCallback3(id={0})", cmd.id);
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskResult.AddRandomKeyEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                
                string sFilename = "output.zip";
                
                int nOutputFormat = FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_TEAMLAB_INNER;
                if(cmd.outputformat.HasValue)
                {
                    nOutputFormat = cmd.outputformat.Value;
                    sFilename = "output." + FileFormats.ToString(nOutputFormat);
                }
                TaskQueueData oTaskQueueData = new TaskQueueData(oTaskResultData.sKey, nOutputFormat, sFilename);
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
                oTaskQueueData.m_sResultCallbackUrl = UrlBuilder.FullUrl(oTransportClassSaveChanges.m_oHttpContext.Request);
                InputCommand oSaveCommand = new InputCommand();
                oSaveCommand.c = "sfcc";
                oSaveCommand.id = cmd.id;
                oSaveCommand.task_queue_data = oTaskQueueData;
                oSaveCommand.url = cmd.url;
                oSaveCommand.status = (int)oTransportClassSaveChanges.m_oTaskResultDataToUpdate.eStatus.Value;
                oSaveCommand.status_info = oTransportClassSaveChanges.m_oTaskResultDataToUpdate.nStatusInfo.Value;
                oTaskQueueData.m_sResultCallbackData = InputCommand.SerializeToJson(oSaveCommand);
                _log.DebugFormat("oTaskQueueData.m_sResultCallbackData = {0}(id={1})", oTaskQueueData.m_sResultCallbackData, cmd.id);
                CTaskQueue oTaskQueue = new CTaskQueue();
                oTransportClassSaveChanges.m_oTaskQueue = oTaskQueue;
                oTransportClassSaveChanges.m_oTaskQueueData = oTaskQueueData;
                oTaskQueue.AddTaskBegin(oTaskQueueData, oPriority, TaskQueueAddCallbackSave2, oTransportClassSaveChanges);
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultAddRandomKeyAsyncCallback3(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch(Exception e)
        {
            _log.Error("Exception catched in TaskResultAddRandomKeyAsyncCallback3:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskQueueAddCallbackSave2(IAsyncResult ar)
    {
        TransportClassSaveChanges1 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges1;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskQueueAddCallbackSave2(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskQueue.AddTaskEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                _log.DebugFormat("m_oSfcOk TaskQueueAddCallbackSave2(id={0})", cmd.id);
                WriteOutputCommand(oTransportClassSaveChanges, m_oSfcOk);
            }
            else
            {
                _log.ErrorFormat("Error in TaskQueueAddCallbackSave2(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch(Exception e)
        {
            _log.Error("Exception catched in TaskQueueAddCallbackSave2:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void SaveFileChangesCallbackCommand(TransportClassContextRead oTransportClassContextRead, InputCommand cmd)
    {
        try
        {
            _log.DebugFormat("Enter SaveFileChangesCallbackCommand(id={0})", cmd.id);
            TransportClassSaveChanges2 oTransportClassSaveChanges = new TransportClassSaveChanges2(oTransportClassContextRead);
            oTransportClassSaveChanges.m_oInputCommand = cmd;
            oTransportClassSaveChanges.m_oTaskQueueData = cmd.task_queue_data;
            oTransportClassSaveChanges.m_oTaskResultDataToUpdate = new TaskResultDataToUpdate();
            oTransportClassSaveChanges.m_oTaskResultDataToUpdate.eStatus = (FileStatus)cmd.status;
            oTransportClassSaveChanges.m_oTaskResultDataToUpdate.nStatusInfo = cmd.status_info;
            oTransportClassSaveChanges.m_oTaskResult = TaskResult.NewTaskResult();
            oTransportClassSaveChanges.m_oTaskResult.GetBegin(oTransportClassSaveChanges.m_oTaskQueueData.m_sKey, TaskResultGetSfcCallback, oTransportClassSaveChanges);
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in SaveFileChangesCallbackCommand:", e);
            WriteOutputCommand(oTransportClassContextRead, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultGetSfcCallback(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultGetSfcCallback(id={0})", cmd.id);
            TaskResultData oTaskResultData;
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskResult.GetEnd(ar, out oTaskResultData);
            if (ErrorTypes.NoError == eError)
            {
                oTransportClassSaveChanges.m_oTaskResultData = oTaskResultData;
                TaskResultDataToUpdate oTask = new TaskResultDataToUpdate();
                oTask.eStatus = FileStatus.UpdateVersion;
                oTask.nStatusInfo = (int)ErrorTypes.NoError;
                TaskResultDataToUpdate oMask = new TaskResultDataToUpdate();
                oMask.eStatus = oTransportClassSaveChanges.m_oTaskResultDataToUpdate.eStatus;
                oMask.nStatusInfo = oTransportClassSaveChanges.m_oTaskResultDataToUpdate.nStatusInfo;
                oTransportClassSaveChanges.m_oTaskResult.UpdateIfBegin(oTransportClassSaveChanges.m_oTaskQueueData.m_sFromKey, oMask, oTask, TaskResultUpdateIfCallback, oTransportClassSaveChanges);
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultGetSfcCallback(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultGetSfcCallback:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultUpdateIfCallback(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultUpdateIfCallback(id={0})", cmd.id);
            bool bUpdate;
            ErrorTypes eError = oTransportClassSaveChanges.m_oTaskResult.UpdateIfEnd(ar, out bUpdate);
            if (ErrorTypes.NoError == eError)
            {
                if (bUpdate)
                {
                    
                    oTransportClassSaveChanges.m_oDocsCallbacks = new DocsCallbacks();
                    oTransportClassSaveChanges.m_oDocsCallbacks.GetBegin(oTransportClassSaveChanges.m_oTaskQueueData.m_sFromKey, DocsCallbacksGetCallback, oTransportClassSaveChanges);
                }
                else
                {
                    
                    AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
                    oTransportClassSaveChanges.m_oAsyncClearCacheOperation = oAsyncClearCacheOperation;
                    oAsyncClearCacheOperation.ClearCacheBegin(oTransportClassSaveChanges.m_oTaskQueueData.m_sKey, TaskResultRemoveCallback3, oTransportClassSaveChanges);
                }
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultUpdateIfCallback(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultUpdateIfCallback:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultRemoveCallback3(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultRemoveCallback3(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                _log.DebugFormat("m_oSfcOk TaskResultRemoveCallback3(id={0})", cmd.id);
                WriteOutputCommand(oTransportClassSaveChanges, m_oSfcOk);
            }
            else
            {
                _log.ErrorFormat("Error in TaskResultRemoveCallback3(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultRemoveCallback3:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void DocsCallbacksGetCallback(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges2 = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges2.m_oInputCommand;
            _log.DebugFormat("Enter DocsCallbacksGetCallback(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges2.m_oDocsCallbacks.GetEnd(ar, out oTransportClassSaveChanges2.m_sCallbackUrl);
            if (ErrorTypes.NoError == eError && !string.IsNullOrEmpty(oTransportClassSaveChanges2.m_sCallbackUrl))
                oTransportClassSaveChanges2.m_oDocsCallbacks.RemoveBegin(cmd.id, DocsCallbacksRemoveCallback, oTransportClassSaveChanges2);
            else
            {
                RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in DocsCallbacksGetCallback:", e);
            RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
        }
    }
    private void DocsCallbacksRemoveCallback(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges2 = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges2.m_oInputCommand;
            _log.DebugFormat("Enter DocsCallbacksRemoveCallback(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges2.m_oDocsCallbacks.RemoveEnd(ar);
            if (ErrorTypes.NoError == eError)
            {
                TaskResultData oTaskResultData = oTransportClassSaveChanges2.m_oTaskResultData;
                if (FileStatus.Ok != oTaskResultData.eStatus && (FileStatus.Err != oTaskResultData.eStatus || (int)ErrorTypes.ConvertCorrupted != oTaskResultData.nStatusInfo))
                {
                    OutputSfc oOutputSfc = new OutputSfc();
                    oOutputSfc.status = (int)FileStatusOut.Corrupted;
                    SendFileRequest(oOutputSfc, oTransportClassSaveChanges2);
                }
                else
                {
                    Storage oStorage = new Storage();
                    MemoryStream oStream = new MemoryStream();
                    TransportClassStorage3 oTransportClassStorage3 = new TransportClassStorage3(oTransportClassSaveChanges2, cmd, oStorage, oStream, oTaskResultData.sKey, oTransportClassSaveChanges2);
                    oStorage.ReadFileBegin(Path.Combine(oTaskResultData.sKey, "changesHistory.json"), oStream, ReadFileCallback, oTransportClassStorage3);
                }
            }
            else
            {
                RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in DocsCallbacksRemoveCallback:", e);
            RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
        }
    }
    private void SendFileRequest(OutputSfc oOutputSfc, TransportClassSaveChanges2 oTransportClassSaveChanges2)
    {

        string sJson = new JavaScriptSerializer().Serialize(oOutputSfc);
        uint attempcount = uint.Parse(ConfigurationSettings.AppSettings["sfc.webrequest.attempcount"] ?? "1");
        uint attempdelay = uint.Parse(ConfigurationSettings.AppSettings["sfc.webrequest.attempdelay"] ?? "0");
        AsyncWebRequestOperation oAsyncWebRequestOperation = new AsyncWebRequestOperation(attempcount, attempdelay);
        oTransportClassSaveChanges2.m_oAsyncWebRequestOperation = oAsyncWebRequestOperation;
        _log.DebugFormat("TaskResultRemoveCallback4 url:{0}", oTransportClassSaveChanges2.m_sCallbackUrl);
        oTransportClassSaveChanges2.m_oAsyncWebRequestOperationResult = oAsyncWebRequestOperation.RequestBegin(oTransportClassSaveChanges2.m_sCallbackUrl, "POST", "application/json", Encoding.UTF8.GetBytes(sJson), RequestCallback2, oTransportClassSaveChanges2);
    }
    private void ReadFileCallback(IAsyncResult ar)
    {
        TransportClassStorage3 oTransportClassStorage3 = ar.AsyncState as TransportClassStorage3;
        TransportClassSaveChanges2 oTransportClassSaveChanges2 = oTransportClassStorage3.m_oSaveChanges2;
        try
        {
            Storage oStorage = oTransportClassStorage3.m_oStorage;
            if (null == oStorage)
            {
                throw new NullReferenceException();
            }
            TaskResultData oTaskResultData = oTransportClassSaveChanges2.m_oTaskResultData;
            
            int nReadWriteBytes = 0;
            ErrorTypes eResult = oStorage.ReadFileEnd(ar, out nReadWriteBytes);
            
            OutputSfc oOutputSfc = new OutputSfc();
            oOutputSfc.key = oTransportClassSaveChanges2.m_oInputCommand.id;
            if (ErrorTypes.NoError == eResult)
            {
                byte[] buffer = new byte[nReadWriteBytes];
                oTransportClassStorage3.m_oStream.Seek(0, SeekOrigin.Begin);
                oTransportClassStorage3.m_oStream.Read(buffer, 0, nReadWriteBytes);
                oTransportClassStorage3.m_oStream.Dispose();
                
                string strSiteUrl = UrlBuilder.UrlWithoutPath(oTransportClassSaveChanges2.m_oHttpContext.Request);
                oOutputSfc.url = GetResultUrl(strSiteUrl, oTaskResultData.sKey, oTaskResultData.sTitle, oTaskResultData.sTitle, false);
                oOutputSfc.changesurl = GetResultUrl(strSiteUrl, oTaskResultData.sKey, "changes.zip", oTaskResultData.sTitle, false);
                oOutputSfc.changeshistory = Encoding.UTF8.GetString(buffer);
            }
            _log.DebugFormat("saved file url:{0}", oOutputSfc.url);
            if (!string.IsNullOrEmpty(oTransportClassSaveChanges2.m_oInputCommand.userid))
                oOutputSfc.users.Add(oTransportClassSaveChanges2.m_oInputCommand.userid);
            FileStatusOut eFileStatusOut = FileStatusOut.NotFound;
            if (!string.IsNullOrEmpty(oOutputSfc.url) && oOutputSfc.users.Count > 0)
                eFileStatusOut = FileStatusOut.MustSave;
            else
                eFileStatusOut = FileStatusOut.Corrupted;
            oOutputSfc.status = (int)eFileStatusOut;
            SendFileRequest(oOutputSfc, oTransportClassSaveChanges2);
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in ReadFileCallback:", e);
            RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
        }
    }
    private void RequestCallback2(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges2 = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges2.m_oInputCommand;
            _log.DebugFormat("Enter RequestCallback2(id={0})", cmd.id);
            byte[] aOutput;
            ErrorTypes eError = oTransportClassSaveChanges2.m_oAsyncWebRequestOperation.RequestEnd(oTransportClassSaveChanges2.m_oAsyncWebRequestOperationResult, out aOutput);
            if (ErrorTypes.NoError == eError)
            {
                InputCommandSfc oInputCommandSfc = null;
                try
                {
                    string sResponse = Encoding.UTF8.GetString(aOutput);
                    _log.DebugFormat("RequestCallback2 Response='{0}'(id={1})", sResponse, cmd.id);

                    oInputCommandSfc = new JavaScriptSerializer().Deserialize<InputCommandSfc>(sResponse);
                }
                catch
                {
                    oInputCommandSfc = null;
                }
                if (null != oInputCommandSfc)
                {
                    RequestToCoAuthoring(oTransportClassSaveChanges2, oInputCommandSfc.status);
                }
                else
                    WriteOutputCommand(oTransportClassSaveChanges2, m_oSfcOk);
            }
            else
            {
                _log.ErrorFormat("Error in RequestCallback2(code={0})", (int)eError);
                RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in RequestCallback2:", e);
            RemoveFromCoAuthoringHandler(oTransportClassSaveChanges2);
        }
    }
    private void RemoveFromCoAuthoringHandler(TransportClassSaveChanges2 oTransportClassSaveChanges2)
    {
        try
        {
            
            AsyncClearCacheOperation oAsyncClearCacheOperation = new AsyncClearCacheOperation();
            oTransportClassSaveChanges2.m_oAsyncClearCacheOperation = oAsyncClearCacheOperation;
            oAsyncClearCacheOperation.ClearCacheBegin(oTransportClassSaveChanges2.m_oTaskQueueData.m_sKey, TaskResultRemoveCallback4, oTransportClassSaveChanges2);
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in RemoveFromCoAuthoringHandler:", e);
            WriteOutputCommand(oTransportClassSaveChanges2, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void TaskResultRemoveCallback4(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            _log.DebugFormat("Enter TaskResultRemoveCallback4(id={0})", cmd.id);
            ErrorTypes eError = oTransportClassSaveChanges.m_oAsyncClearCacheOperation.ClearCacheEnd(ar);
            if (ErrorTypes.NoError != eError)
            {
                _log.ErrorFormat("Error in TaskResultRemoveCallback4(code={0})", (int)eError);
            }
            RequestToCoAuthoring(oTransportClassSaveChanges, "0");
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in TaskResultRemoveCallback4:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void RequestToCoAuthoring(TransportClassSaveChanges2 oTransportClassSaveChanges, string sStatus)
    {
        try
        {
            InputCommand cmd = oTransportClassSaveChanges.m_oInputCommand;
            
            string sUrl = ConfigurationSettings.AppSettings["editor.settings.coauthoring.url"] + oTransportClassSaveChanges.m_oInputCommand.url + sStatus;
			Uri oAbsUrl;
            if (!(Uri.TryCreate(sUrl, UriKind.Absolute, out oAbsUrl) && (Uri.UriSchemeHttps == oAbsUrl.Scheme || Uri.UriSchemeHttp == oAbsUrl.Scheme || Uri.UriSchemeFtp == oAbsUrl.Scheme)))
			{
				Uri baseUri = new Uri("http://localhost");
                oAbsUrl = new Uri(baseUri, sUrl);
			}
            _log.DebugFormat("RequestToCoAuthoring url:{0}", oAbsUrl.AbsoluteUri);
            oTransportClassSaveChanges.m_oAsyncWebRequestOperation = new AsyncWebRequestOperation();
            oTransportClassSaveChanges.m_oAsyncWebRequestOperationResult = oTransportClassSaveChanges.m_oAsyncWebRequestOperation.RequestBegin(oAbsUrl.AbsoluteUri, "POST", "text/plain", new byte[0], RequestToCoAuthoringCallback, oTransportClassSaveChanges);
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in RequestToCoAuthoring:", e);
            WriteOutputCommand(oTransportClassSaveChanges, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    private void RequestToCoAuthoringCallback(IAsyncResult ar)
    {
        TransportClassSaveChanges2 oTransportClassSaveChanges2 = ar.AsyncState as TransportClassSaveChanges2;
        try
        {
            InputCommand cmd = oTransportClassSaveChanges2.m_oInputCommand;
            _log.DebugFormat("Enter RequestCallback(id={0})", cmd.id);
            byte[] aOutput;
            ErrorTypes eError = oTransportClassSaveChanges2.m_oAsyncWebRequestOperation.RequestEnd(oTransportClassSaveChanges2.m_oAsyncWebRequestOperationResult, out aOutput);
            if (ErrorTypes.NoError == eError)
            {
                if (_log.IsDebugEnabled)
                {
                    try
                    {
                        _log.DebugFormat("RequestCallback Response='{0}'(id={1})", Encoding.UTF8.GetString(aOutput), cmd.id);
                    }
                    catch
                    {
                    }
                }
                WriteOutputCommand(oTransportClassSaveChanges2, m_oSfcOk);
            }
            else
            {
                _log.ErrorFormat("Error in RequestCallback(code={0})", (int)eError);
                WriteOutputCommand(oTransportClassSaveChanges2, new OutputCommand(eError));
            }
        }
        catch (Exception e)
        {
            _log.Error("Exception catched in GetResponseCallback:", e);
            WriteOutputCommand(oTransportClassSaveChanges2, new OutputCommand(ErrorTypes.Unknown));
        }
    }
    #endregion
    #region TransportClasses
    private class TransportClassTaskResult : TransportClassMainAshx
    {
        public InputCommand m_oInputCommand;
        public ITaskResultInterface m_oTaskResult;
        public TransportClassTaskResult(TransportClassMainAshx oTransportClassMainAshx, InputCommand oInputCommand, ITaskResultInterface oTaskResult)
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
    private class TransportClassStorage3 : TransportClassStorage
    {
        public TransportClassSaveChanges2 m_oSaveChanges2;
        public TransportClassStorage3(TransportClassMainAshx oTransportClassMainAshx, InputCommand oInputCommand, Storage oStorage, Stream stream, string sKey, TransportClassSaveChanges2 oSaveChanges2)
            : base(oTransportClassMainAshx, oInputCommand, oStorage, stream, sKey)
        {
            m_oSaveChanges2 = oSaveChanges2;
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
        public AsyncWebRequestOperation m_oDownloadOperation;
        public IAsyncResult m_iAsyncResult;
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
    private class TransportClassSaveChanges1 : TransportClassMainAshx
    {
        public InputCommand m_oInputCommand;
        public ITaskResultInterface m_oTaskResult;
        public TaskResultDataToUpdate m_oTaskResultDataToUpdate;
        public CTaskQueue m_oTaskQueue;
        public TaskQueueData m_oTaskQueueData;
        public TransportClassSaveChanges1(TransportClassMainAshx oTransportClassMainAshx)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
        }
    }
    private class TransportClassSaveChanges2 : TransportClassMainAshx
    {
        public InputCommand m_oInputCommand;
        public ITaskResultInterface m_oTaskResult;
        public TaskResultDataToUpdate m_oTaskResultDataToUpdate;
        public TaskQueueData m_oTaskQueueData;
        public TaskResultData m_oTaskResultData;
        public AsyncClearCacheOperation m_oAsyncClearCacheOperation;
        public DocsChanges m_oDocsChanges;
        public AsyncWebRequestOperation m_oAsyncWebRequestOperation;
        public IAsyncResult m_oAsyncWebRequestOperationResult;
        public DocsCallbacks m_oDocsCallbacks;
        public string m_sCallbackUrl;
        public TransportClassSaveChanges2(TransportClassMainAshx oTransportClassMainAshx)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
        }
    }
    private class TransportClassInfo : TransportClassMainAshx
    {
        public string[] m_aKeys;
        public ITaskResultInterface m_oTaskResult;
        public TransportClassInfo(TransportClassMainAshx oTransportClassMainAshx, string[] aKeys, ITaskResultInterface oTaskResult)
            : base(oTransportClassMainAshx.m_oHttpContext, oTransportClassMainAshx.m_oAsyncCallback)
        {
            m_aKeys = aKeys;
            m_oTaskResult = oTaskResult;
        }
    }
    public class InputCommandSfc
    {
        public string status { get; set; }
    }
    public class OutputCommand
    {
        public string type { get; set; }
        public string data { get; set; }
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
        public OutputCommand(int nError)
        {
            type = "err";
            data = nError.ToString();
        }
    }
    private class OutputSfc
    {
        public string key { get; set; }
        public long status { get; set; }

        public string url { get; set; }
        public string changesurl { get; set; }
        public string changeshistory { get; set; }
        public List<string> users = new List<string>();
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

    public class OutputSettingsData
    {
        public bool canLicense;
        
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
		public bool isAnalyticsEnable;

        public int TrackingInterval;

        public OutputSettingsData()
        {
            canLicense = true;
            
            canEdit = true;
            canDownload = true;
            canCoAuthoring = true;
            canReaderMode = true;
            canAd = true;
            canBranding = false;
            
            isAutosaveEnable = bool.Parse(ConfigurationSettings.AppSettings["editor.settings.autosave.enable1"] ?? "true");
            AutosaveMinInterval = int.Parse(ConfigurationSettings.AppSettings["editor.settings.autosave.mininterval1"] ?? "300");
            
            g_cAscCoAuthoringUrl = ConfigurationSettings.AppSettings["editor.settings.coauthoring.url"] ?? "";
            g_cAscSpellCheckUrl = ConfigurationSettings.AppSettings["editor.settings.spellchecker.url"] ?? "";
			
			isAnalyticsEnable = bool.Parse(ConfigurationSettings.AppSettings["editor.settings.analytics.enable"] ?? "false");

            TrackingInterval = int.Parse(ConfigurationSettings.AppSettings["license.activeconnections.tracking.interval"] ?? "300");
        }

        public OutputSettingsData(string sFormat)

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

            canLicense = false;

        }
    }
    
    #endregion
    }
}