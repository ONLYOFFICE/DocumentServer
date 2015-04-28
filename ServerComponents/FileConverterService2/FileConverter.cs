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
using System.Collections.Specialized;
using System.Configuration;
using System.Threading;
using System.IO;
using System.Net;
using System.Xml;
using System.Text;
using System.Web;
using FileConverterUtils2;
using log4net;
using log4net.Config;

namespace FileConverterService2
{
    public static class StringParser
    {
        public static string[] ParseArguments(string commandLine)
        {
            char[] parmChars = commandLine.ToCharArray();
            bool inQuote = false;
            for (int index = 0; index < parmChars.Length; index++)
            {
                if (parmChars[index] == '"')
                    inQuote = !inQuote;
                if (!inQuote && parmChars[index] == ' ')
                    parmChars[index] = '\n';
            }
            char[] oDelimiters = new char[] { '\n' };
            return (new string(parmChars)).Split(oDelimiters, StringSplitOptions.RemoveEmptyEntries);
        }
    }

    public class FileConverter
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(FileConverter));
        private class IddleProcess
        {
            public System.Diagnostics.Process m_oProcess;
            public string m_sDirToDelete;
            public string m_sDirSource;
            public string m_sDirResult;
            public string m_sFileTo;
            public string m_sChangesAuthor = null;
            public TaskQueueData m_oTaskQueueData;
        }
        private class TransportClass
        {
            public TaskQueueData m_oTaskQueueData;
            public AsyncWebRequestOperation m_oAsyncWebRequestOperation;
            public IAsyncResult m_oAsyncWebRequestOperationResult;
        }
#if! OPEN_SOURCE
        private static ASCGraphics.CASCWinFonts piWinFonts = null; 
#else
        private static OfficeCore.CWinFontsClass piWinFonts = null; 
#endif
        private int m_nMaxRunThreads;

        private readonly ManualResetEvent _stopEvt = new ManualResetEvent(false);
        private List<Thread> m_aRunThreads = new List<Thread>();

        private Thread m_oIddlePriority = null;
        private List<IddleProcess> m_arrIndentFiles = new List<IddleProcess>();
        private Thread m_oGCThread = null;

        private object m_oKeyToPercentLock = new object();
        private object m_oKeyToPercentValidateLock = new object();
        private Dictionary<string, int> m_mapKeyToPercentValidate = new Dictionary<string, int>();
        private Dictionary<string, int> m_mapKeyToPercent = new Dictionary<string, int>();
        private Timer m_oPercentTimer = null;

        private static int m_nRunThreadCount = 0;

        public FileConverter(string serviceName)
        {
            m_nMaxRunThreads = (int)(Environment.ProcessorCount * double.Parse(ConfigurationSettings.AppSettings["maxprocesscount"], new System.Globalization.CultureInfo(0x409)));
            if (0 >= m_nMaxRunThreads)
                m_nMaxRunThreads = 1;
        }
        public void Start()
        {
            if (null == piWinFonts)
            {
                bool bIsUseWinFonts = bool.Parse(ConfigurationSettings.AppSettings["fileconverterservice.usewinfonts"] ?? "true");
                if (bIsUseWinFonts)
                {
                    _log.Info("Create WinFonts.");
#if! OPEN_SOURCE
                    piWinFonts = new ASCGraphics.CASCWinFonts();

#else
                    piWinFonts = new OfficeCore.CWinFontsClass();
                    string sFontDir = ConfigurationSettings.AppSettings["utils.common.fontdir"] ?? "";
                    if(null != sFontDir && !string.IsNullOrEmpty(sFontDir))
                        sFontDir = Path.GetFullPath(Environment.ExpandEnvironmentVariables(sFontDir));
                    piWinFonts.Init(sFontDir, true, true);
#endif
                }
            }

            Stop();
            _stopEvt.Reset();
            for (int i = 0; i < m_nMaxRunThreads; i++)
            {
                var runThread = new Thread(Run);

                _log.InfoFormat("Start convertation thread {0} of {1}.", i + 1, m_nMaxRunThreads);
                runThread.Start();
                m_aRunThreads.Add(runThread);
            }

            m_oGCThread = new Thread(GCThread);

            _log.Info("Start garbage collector thread.");
            m_oGCThread.Start();
        }
        public void Stop()
        {
            _stopEvt.Set();
            foreach (var runThread in m_aRunThreads)
            {
                try
                {
                    if (!runThread.Join(TimeSpan.FromSeconds(30)))
                    {
                        
                        runThread.Abort();
                    }
                }
                catch(Exception e) 
                {
                    _log.Error("Exception catched while thread stoping.", e);
                }
            }
            m_aRunThreads.Clear();

            m_arrIndentFiles.Clear();

            if (null != m_oGCThread)
            {
                
                m_oGCThread.Abort();
            }
        }

        private void Run()
        {
            FileConverterUtils2.CTaskQueue oTaskQueue = new FileConverterUtils2.CTaskQueue();

            while (!_stopEvt.WaitOne(0))
            {
                FileConverterUtils2.TaskQueueData oTaskQueueData = oTaskQueue.GetTask();

                if (null != oTaskQueueData)
                {
                    DateTime oGetTaskTime = DateTime.UtcNow;

                    _log.DebugFormat("Start Task(id={0}), Time={1}", oTaskQueueData.m_sKey, oGetTaskTime);
                    Interlocked.Increment(ref m_nRunThreadCount);
                    ErrorTypes eError = FileConverterUtils2.ErrorTypes.NoError;
                    bool bNeedParam = false;
                    ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                    Storage oFileStore = new Storage();
                    string sDirToDelete = Utils.GetTempDirectory();
                    IddleProcess oNewIddleProcess = new IddleProcess();
                    oNewIddleProcess.m_sDirToDelete = sDirToDelete;
                    oNewIddleProcess.m_oTaskQueueData = oTaskQueueData;
                    try
                    {
                        string sTempDir = Path.Combine(sDirToDelete, oTaskQueueData.m_sKey);
                        Directory.CreateDirectory(sTempDir);
                        string sDirSource = Path.Combine(sTempDir, "source");
                        Directory.CreateDirectory(sDirSource);
                        string sDirResult = Path.Combine(sTempDir, "result");
                        Directory.CreateDirectory(sDirResult);

                        oNewIddleProcess.m_sDirSource = sDirSource;
                        oNewIddleProcess.m_sDirResult = sDirResult;

                        int nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
                        string sFileFrom = "";
                        string sFileTo = Path.Combine(sDirResult, oTaskQueueData.m_sToFile);
                        if (false == string.IsNullOrEmpty(oTaskQueueData.m_sFromUrl))
                        {
                            sFileFrom = Path.Combine(sDirSource, oTaskQueueData.m_sKey + "." + oTaskQueueData.m_sFromFormat);
                            
                            eError = DownloadFile(oTaskQueueData.m_sFromUrl, sFileFrom);
                            _log.DebugFormat("DownloadFile complete(id={0})", oTaskQueueData.m_sKey);

                            if (FileConverterUtils2.ErrorTypes.NoError == eError)
                            {
                                nFormatFrom = FileConverterUtils2.FormatChecker.GetFileFormat(sFileFrom);
                                switch(nFormatFrom)
                                {
                                    case FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML:
                                        {

                                            if (".html" != Path.GetExtension(sFileFrom))
                                            {
                                                string sNewFileFrom = Path.ChangeExtension(sFileFrom, ".html");
                                                File.Move(sFileFrom, sNewFileFrom);
                                                sFileFrom = sNewFileFrom;
                                                oTaskQueueData.m_sFromFormat = "html";
                                            }
                                        }
                                        break;
                                    case FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_MS_OFFCRYPTO:
                                        eError = ErrorTypes.ConvertMS_OFFCRYPTO;
                                        break;
                                    case FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN:
                                        eError = ErrorTypes.ConvertUnknownFormat;
                                        break;
                                    
                                    case FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT:
                                        {
                                            if (false == oTaskQueueData.m_nCsvTxtEncoding.HasValue)
                                            {   
                                                System.Text.Encoding oEncoding = GetEncoding(sFileFrom);
                                                if (null == oEncoding)
                                                {
                                                    string sFileFromName = Path.GetFileName(sFileFrom);
                                                    string sJson = Utils.GetSerializedEncodingProperty(sFileFromName, null, null);
                                                    
                                                    int nReadWriteBytes;
                                                    byte[] aSettingsPreamble = System.Text.Encoding.UTF8.GetPreamble();
                                                    byte[] aSettingsContent = System.Text.Encoding.UTF8.GetBytes(sJson);
                                                    byte[] aSettingsData = new byte[aSettingsPreamble.Length + aSettingsContent.Length];
                                                    aSettingsPreamble.CopyTo(aSettingsData, 0);
                                                    aSettingsContent.CopyTo(aSettingsData, aSettingsPreamble.Length);
                                                    using (MemoryStream ms = new MemoryStream(aSettingsData))
                                                        oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, "settings.json"), ms, out nReadWriteBytes);
                                                    using (FileStream fs = new FileStream(sFileFrom, FileMode.Open))
                                                        oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, sFileFromName), fs, out nReadWriteBytes);
                                                    bNeedParam = true;
                                                }
                                                else
                                                {
                                                    oTaskQueueData.m_nCsvTxtEncoding = oEncoding.CodePage;
                                                }
                                            }
                                        }
                                        break;
                                    case FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV:
                                        {
                                            if (false == oTaskQueueData.m_nCsvTxtEncoding.HasValue || 
                                                false == oTaskQueueData.m_nCsvDelimiter.HasValue)
                                            {
                                                string sFileFromName = Path.GetFileName(sFileFrom);
                                                
                                                int? encoding;
                                                int? delimiter;
                                                GetEncodingAndDelimeter(sFileFrom, out encoding, out delimiter);
                                                string sJson = Utils.GetSerializedEncodingProperty(sFileFromName, encoding, delimiter);
                                                
                                                int nReadWriteBytes;
                                                byte[] aSettingsPreamble = System.Text.Encoding.UTF8.GetPreamble();
                                                byte[] aSettingsContent = System.Text.Encoding.UTF8.GetBytes(sJson);
                                                byte[] aSettingsData = new byte[aSettingsPreamble.Length + aSettingsContent.Length];
                                                aSettingsPreamble.CopyTo(aSettingsData, 0);
                                                aSettingsContent.CopyTo(aSettingsData, aSettingsPreamble.Length);
                                                using (MemoryStream ms = new MemoryStream(aSettingsData))
                                                    oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, "settings.json"), ms, out nReadWriteBytes);
                                                using (FileStream fs = new FileStream(sFileFrom, FileMode.Open))
                                                    oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, sFileFromName), fs, out nReadWriteBytes);
                                                bNeedParam = true;
                                            }
                                         }
                                        break;
                                     default:
                                        break;
                                }
                            }
                        }
                        else if (false == string.IsNullOrEmpty(oTaskQueueData.m_sFromKey))
                        {
                            
                            StorageTreeNode oStorageTreeNode = oFileStore.GetTreeNode(oTaskQueueData.m_sFromKey);
                            eError = DownloadStorageTreeNodeToFilesystem(sDirSource, oTaskQueueData.m_sFromKey, "", oStorageTreeNode, oFileStore);
                            _log.DebugFormat("DownloadStorageTreeNodeToFilesystem complete(id={0})", oTaskQueueData.m_sKey);
                            if (oTaskQueueData.m_bFromOrigin.HasValue && true == oTaskQueueData.m_bFromOrigin.Value)
                            {
                                sFileFrom = Path.Combine(sDirSource, "origin");
                                nFormatFrom = FileConverterUtils2.FormatChecker.GetFileFormat(sFileFrom);
                            }
                            else if (oTaskQueueData.m_bFromSettings.HasValue && true == oTaskQueueData.m_bFromSettings.Value)
                            {
                                string sSettings = Path.Combine(sDirSource, "settings.json");
                                string sFileFromName;
                                int? codepage;
                                int? delimiter;
                                Utils.GetDeserializedEncodingProperty(File.ReadAllText(sSettings, System.Text.Encoding.UTF8), out sFileFromName, out codepage, out delimiter);
                                if (null != sFileFromName)
                                {
                                    sFileFrom = Path.Combine(Path.GetDirectoryName(sSettings), sFileFromName);
                                    nFormatFrom = FileConverterUtils2.FormatChecker.GetFileFormat(sFileFrom);
                                }
                                else
                                    eError = ErrorTypes.Unknown;
                            }
                            else
                            {
                                
                                oStorageTreeNode = oFileStore.GetTreeNode(oTaskQueueData.m_sKey);
                                eError = DownloadStorageTreeNodeToFilesystem(sDirSource, oTaskQueueData.m_sKey, "", oStorageTreeNode, oFileStore);
                                if (ErrorTypes.NoError == eError)
                                {
                                    sFileFrom = Path.Combine(sDirSource, "Editor.bin");
                                    if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == oTaskQueueData.m_nToFormat)
                                    {
                                        
                                        string sFileFromWE = Path.GetFileNameWithoutExtension(sFileFrom);
                                        string[] aFiles = Directory.GetFiles(Path.GetDirectoryName(sFileFrom));
                                        Array.Sort<string>(aFiles, Utils.CompareStringByLength);
                                        bool bEmptyFile = true;
                                        string sTempFile = Path.ChangeExtension(sFileFrom, ".tmp");
                                        using (BinaryWriter writer = new BinaryWriter(File.Open(sTempFile, FileMode.Create)))
                                        {
                                            bool bFirst = true;
                                            for (int i = 0, length = aFiles.Length; i < length; ++i)
                                            {
                                                string sCurFilename = aFiles[i];
                                                string sCurFileFromWE = Path.GetFileNameWithoutExtension(sCurFilename);
                                                if (sCurFileFromWE != sFileFromWE && 0 == sCurFileFromWE.IndexOf(sFileFromWE))
                                                {
                                                    if (bFirst)
                                                        bFirst = false;
                                                    else
                                                    {
                                                        
                                                        writer.Write('\n');
                                                    }
                                                    writer.Write(File.ReadAllBytes(sCurFilename));
                                                    bEmptyFile = false;
                                                }
                                            }
                                        }
                                        if (false == bEmptyFile)
                                        {
                                            File.Delete(sFileFrom);
                                            File.Move(sTempFile, sFileFrom);
                                        }
										File.Delete(sTempFile);
                                    }
                                    else
                                        nFormatFrom = FileConverterUtils2.FormatChecker.GetFileFormat(sFileFrom);
                                }
                            }
                            if (oTaskQueueData.m_bFromChanges.HasValue && oTaskQueueData.m_bFromChanges.Value)
                            {
                                List<DocsChange> aChanges;
                                (new DocsChanges()).GetChanges(oTaskQueueData.m_sFromKey, out aChanges);
                                string sChangesDir = Path.Combine(sDirSource, "changes");
                                Directory.CreateDirectory(sChangesDir);
                                string sChangesAuthor = null;
                                int nIndexFile = 0;
                                StreamWriter oStreamWriter = null;
                                try
                                {
                                    
                                    for (int i = 0, length = aChanges.Count; i < length; ++i)
                                    {
                                        if (null == sChangesAuthor || sChangesAuthor != aChanges[i].userid)
                                        {
                                            
                                            if (null != sChangesAuthor)
                                            {
                                                oStreamWriter.Write("]");
                                                oStreamWriter.Dispose();
                                                oStreamWriter = null;
                                            }
                                            sChangesAuthor = aChanges[i].userid;

                                            oStreamWriter = new StreamWriter(Path.Combine(sChangesDir, "changes" + (nIndexFile++) + ".json"));
                                            oStreamWriter.Write("[");
                                            oStreamWriter.Write(aChanges[i].data);
                                        }
                                        else
                                        {
                                            oStreamWriter.Write(",");
                                            oStreamWriter.Write(aChanges[i].data);
                                        }
                                    }
                                    oNewIddleProcess.m_sChangesAuthor = sChangesAuthor;

                                    if (null != oStreamWriter)
                                    {
                                        oStreamWriter.Write("]");
                                        oStreamWriter.Dispose();
                                        oStreamWriter = null;
                                    }
                                }
                                catch
                                {
                                }
                                finally
                                {
                                    if (null != oStreamWriter)
                                        oStreamWriter.Dispose();
                                }
                            }
                        }
                        else
                            eError = ErrorTypes.Unknown;
                        int nToFormat = oTaskQueueData.m_nToFormat;
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS == nToFormat)
                        {
                            if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY == nFormatFrom || 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET & nFormatFrom))
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET;
                            else if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY == nFormatFrom || 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION & nFormatFrom))
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION;
                            else
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD;
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_TEAMLAB_INNER == nToFormat)
                        {
                            if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET == nFormatFrom || FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY == nFormatFrom || 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET & nFormatFrom))
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX;
                            else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION == nFormatFrom || FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY == nFormatFrom || 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION & nFormatFrom))
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX;
                            else
                                nToFormat = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX;
                            sFileTo = Path.ChangeExtension(sFileTo, "." + FileFormats.ToString(nToFormat));
                        }
                        oNewIddleProcess.m_sFileTo = sFileTo;
                        if (ErrorTypes.NoError == eError && false == bNeedParam)
                        {

                            TimeSpan oWaitTimeout = oTaskQueueData.VisibilityTimeout - 
                                (DateTime.UtcNow - oGetTaskTime);

                            int nWaitTimeout = Convert.ToInt32(oWaitTimeout.TotalMilliseconds * 0.95);

                            TaskResultDataToUpdate oTaskResultData = new TaskResultDataToUpdate();
                            oTaskResultData.eStatus = FileStatus.Convert;
                            oTaskResultData.nStatusInfo = 0;
                            oTaskResult.Update(oTaskQueueData.m_sKey, oTaskResultData);
                            TaskQueueDataConvert oTaskQueueDataConvert = new TaskQueueDataConvert(oTaskQueueData.m_sKey, sFileFrom, nFormatFrom, sFileTo, nToFormat);
                            if (oTaskQueueData.m_nCsvTxtEncoding.HasValue)
                                oTaskQueueDataConvert.m_nCsvTxtEncoding = oTaskQueueData.m_nCsvTxtEncoding.Value;
                            if (oTaskQueueData.m_nCsvDelimiter.HasValue)
                                oTaskQueueDataConvert.m_nCsvDelimiter = oTaskQueueData.m_nCsvDelimiter;
                            if (oTaskQueueData.m_bPaid.HasValue)
                                oTaskQueueDataConvert.m_bPaid = oTaskQueueData.m_bPaid.Value;
                            if (oTaskQueueData.m_bEmbeddedFonts.HasValue)
                                oTaskQueueDataConvert.m_bEmbeddedFonts = oTaskQueueData.m_bEmbeddedFonts.Value;
                            if (oTaskQueueData.m_bFromChanges.HasValue)
                                oTaskQueueDataConvert.m_bFromChanges = oTaskQueueData.m_bFromChanges.Value;
#if! OPEN_SOURCE
                            string sFontDir = ConfigurationSettings.AppSettings["utils.common.fontdir"];
#else
                            string sFontDir = "";
#endif
                            if (null != sFontDir && !string.IsNullOrEmpty(sFontDir))
                                oTaskQueueDataConvert.m_sFontDir = Path.GetFullPath(Environment.ExpandEnvironmentVariables(sFontDir));
                            string sThemeDir = ConfigurationSettings.AppSettings["fileconverterservice.converter.presentationthemesdir"];
                            if (null != sThemeDir && !string.IsNullOrEmpty(sThemeDir))
                                oTaskQueueDataConvert.m_sThemeDir = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), sThemeDir));

                            lock (m_oKeyToPercentValidateLock)
                            {
                                m_mapKeyToPercentValidate[oTaskQueueData.m_sKey] = 1;
                            }

                            string sConvertApp = ConfigurationSettings.AppSettings["fileconverterservice.converter.filepath"] ?? "FileConverter2.exe";
                            string sConvertArgs = ConfigurationSettings.AppSettings["fileconverterservice.converter.args"] ?? "";

                            System.Diagnostics.Process convertProc = new System.Diagnostics.Process();
                            oNewIddleProcess.m_oProcess = convertProc;

                            convertProc.StartInfo.FileName = sConvertApp;
                            string sConfigPath = Path.Combine(sTempDir, "params.xml");
                            File.WriteAllText(sConfigPath, TaskQueueDataConvert.SerializeToXml(oTaskQueueDataConvert), System.Text.Encoding.UTF8);
                            convertProc.StartInfo.Arguments = sConvertArgs + " " + EscapeCommandLineArguments(sConfigPath);
                            
                            convertProc.StartInfo.CreateNoWindow = true;
                            convertProc.StartInfo.UseShellExecute = false;

                            convertProc.OutputDataReceived += new System.Diagnostics.DataReceivedEventHandler(convertProc_OutputDataReceived);
                            convertProc.StartInfo.RedirectStandardOutput = true;

                            _log.DebugFormat("Start {0} {1}(id={2})", convertProc.StartInfo.FileName, convertProc.StartInfo.Arguments, oTaskQueueData.m_sKey);

                            convertProc.Start();

                            convertProc.BeginOutputReadLine();

                            bool isProcessExit = convertProc.WaitForExit(nWaitTimeout);
                            _log.DebugFormat("Stop WaitForExit({0})(id={1})", nWaitTimeout, oTaskQueueData.m_sKey);

                            if (!isProcessExit)
                            {
                                _log.DebugFormat("Kill() process (id={1})", oTaskQueueData.m_sKey);
                                convertProc.Kill();
                            }

                        }
                    }
                    catch(Exception e)
                    {
                        eError = ErrorTypes.Convert;
                        _log.Error("Exception catched while convertation thread working.", e);
                    }
                    PostProcess(oNewIddleProcess, eError, bNeedParam);

                    Interlocked.Decrement(ref m_nRunThreadCount);
                }
                else
                {
                    Thread.Sleep(TimeSpan.FromSeconds(double.Parse(ConfigurationSettings.AppSettings["sleeptimeout"] ?? "60")));
                }
            }
        }

        private ErrorTypes DownloadFile(string sUrl, string sFileFrom)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                AsyncWebRequestOperation oAsyncWebRequestOperation = new AsyncWebRequestOperation(Convert.ToInt64(ConfigurationSettings.AppSettings["maxdownloadbytes"] ?? "10485760"));
                byte[] aBuffer;
                if (ErrorTypes.NoError == oAsyncWebRequestOperation.Request(sUrl, "GET", null, null, out aBuffer))
                {
                    using(FileStream fs = File.Create(sFileFrom))
                    {
                        fs.Write(aBuffer, 0, aBuffer.Length);
                    }
                }
                else
                {
                    eError = ErrorTypes.ConvertDownload;
                    _log.ErrorFormat("DownloadFile() from {0} to {1}", sUrl, sFileFrom);
                }
            }
            catch(Exception ex)
            {
                eError = ErrorTypes.ConvertDownload;

                _log.ErrorFormat("DownloadFile() from {0} to {1}", sUrl, sFileFrom);
                _log.Error("Exception:", ex);
            }
            return eError;
        }

        private System.Text.Encoding GetEncoding(string sFileFrom)
        {
            const int nBytesToRead = 3;
            byte[] aFirstBytes = new byte[nBytesToRead];
            int nBytesReaded = 0;
            
            using (FileStream fs = File.OpenRead(sFileFrom))
            {
                nBytesReaded = fs.Read(aFirstBytes, 0, nBytesToRead);
            }

            return GetEncodingByContent(aFirstBytes, nBytesReaded);
        }

        private void GetEncodingAndDelimeter(string sFileFrom, out int? encoding, out int? delimiter)
        {
            encoding = null;
            delimiter = null;

            const int nBytesToRead = 1000;
            byte[] aFirstBytes = new byte[nBytesToRead];
            int nBytesReaded = 0;
            
            using (FileStream fs = File.OpenRead(sFileFrom))
            {
                nBytesReaded = fs.Read(aFirstBytes, 0, nBytesToRead);
            }
            System.Text.Encoding oEncoding = GetEncodingByContent(aFirstBytes, nBytesReaded);

            if (null != oEncoding)
                encoding = oEncoding.CodePage;
            else
                encoding = System.Text.Encoding.UTF8.CodePage;

            delimiter = GetDelimeterByContent(aFirstBytes, nBytesReaded);
        }

        private int? GetDelimeterByContent(byte[] aFirstBytes, int nBytesReaded)
        {
            int? delimiter = null;
            
            int nLineLength = nBytesReaded;
            int nDelimiter = (int)CsvDelimiter.None;
            int nDelimitersCount = 6;
            int[] aDelimiters = new int[nDelimitersCount];
            for (int i = 0; i < nDelimitersCount; i++)
                aDelimiters[i] = 0;
            for (int i = 0; i < nBytesReaded; ++i)
            {
                byte cCurChar = aFirstBytes[i];
                if ('\n' == cCurChar)
                {
                    nLineLength = i;
                    break;
                }
                else if ('\t' == cCurChar)
                    aDelimiters[(int)CsvDelimiter.Tab]++;
                else if (';' == cCurChar)
                    aDelimiters[(int)CsvDelimiter.Semicolon]++;
                else if (':' == cCurChar)
                    aDelimiters[(int)CsvDelimiter.Сolon]++;
                else if (',' == cCurChar)
                    aDelimiters[(int)CsvDelimiter.Comma]++;
                else if (' ' == cCurChar)
                    aDelimiters[(int)CsvDelimiter.Space]++;
            }
            int nMaxVal = 0;
            int nMaxIndex = 0;
            for (int i = 1; i < nDelimitersCount; i++)
            {
                if (nMaxVal < aDelimiters[i])
                {
                    nMaxVal = aDelimiters[i];
                    nMaxIndex = i;
                }
            }
            if (nMaxVal > 0)
                nDelimiter = nMaxIndex;

            if ((int)CsvDelimiter.None != nDelimiter)
                delimiter = nMaxIndex;

            return delimiter;
        }

        private static System.Text.Encoding GetEncodingByContent(byte[] aFirstBytes, int nBytesReaded)
        {
            
            System.Text.Encoding oEncoding = null;
            if (nBytesReaded >= 2)
            {
                if (aFirstBytes[0] == 0xFF && aFirstBytes[1] == 0xFE)
                    oEncoding = System.Text.Encoding.Unicode;
                else if (aFirstBytes[0] == 0xFE && aFirstBytes[1] == 0xFF)
                    oEncoding = System.Text.Encoding.BigEndianUnicode;
            }
            if (nBytesReaded >= 3)
            {
                if (aFirstBytes[0] == 0xEF && aFirstBytes[1] == 0xBB && aFirstBytes[2] == 0xBF)
                    oEncoding = System.Text.Encoding.UTF8;
            }
            return oEncoding;
        }
        private void GCThread()
        {
            const double dSleepTimeOut = 5;
            int nSleepCount = 0;
            while (!_stopEvt.WaitOne(0))
            {
                try
                {
                    if (nSleepCount <=0 && 0 == m_nRunThreadCount)
                    {
                        ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                        List<TaskResultData> aTasts = null;
                        int nMaxCount = int.Parse(ConfigurationManager.AppSettings["fileconverterservice.gc.removedtaskatonce"] ?? "10");
                        ErrorTypes oError = oTaskResult.GetExpired(nMaxCount, out aTasts);
                        if (ErrorTypes.NoError == oError && aTasts != null && aTasts.Count > 0)
                        {
                            Storage oStorage = new Storage();
                            DocsChanges oDocsChanges = new DocsChanges();

                            foreach (TaskResultData oTast in aTasts)
                            {
                                if (ErrorTypes.NoError == oTaskResult.Remove(oTast.sKey))
                                {
                                    oStorage.RemovePath(oTast.sKey);
                                    oDocsChanges.RemoveChanges(oTast.sKey);
                                }
                            }
                        }
                        else
                        {

                            nSleepCount = (int)(double.Parse(ConfigurationManager.AppSettings["fileconverterservice.gc.runperiod"] ?? "3600") / dSleepTimeOut);
                        }
                    }
                    else
                    {
                        if(nSleepCount > 0)
                            nSleepCount--;

                        Thread.Sleep(TimeSpan.FromSeconds(dSleepTimeOut));
                    }
                }
                catch (Exception e)
                {
                    _log.Error("Exception catched while garbage collector working.", e);
                }
            }
        }
        private void PercentUpdateCallback(Object stateInfo)
        {
            try
            {
                List<KeyValuePair<string, int>> mapTemp = new List<KeyValuePair<string,int>>();
                lock (m_oKeyToPercentLock)
                {
                    foreach (KeyValuePair<string, int> entry in m_mapKeyToPercent)
                        mapTemp.Add(entry);
                    m_mapKeyToPercent.Clear();
                }
                ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                for (int i = 0, length = mapTemp.Count; i < length; ++i)
                {
                    KeyValuePair<string, int> elem = mapTemp[i];
                    
                    lock (m_oKeyToPercentValidateLock)
                    {
                        if (m_mapKeyToPercentValidate.ContainsKey(elem.Key))
                        {
                            TaskResultDataToUpdate oTaskResultData = new TaskResultDataToUpdate();
                            oTaskResultData.nStatusInfo = elem.Value;
                            oTaskResult.Update(elem.Key, oTaskResultData);
                        }
                    }
                }
                lock (m_oKeyToPercentLock)
                {
                    if (m_mapKeyToPercent.Count > 0)
                    {
                        int nPeriod = int.Parse(ConfigurationManager.AppSettings["fileconverterservice.percent.runperiod"] ?? "500");
                        m_oPercentTimer.Change(nPeriod, System.Threading.Timeout.Infinite);
                    }
                    else
                    {
                        m_oPercentTimer.Dispose();
                        m_oPercentTimer = null;
                    }
                }
            }
            catch
            {
                m_oPercentTimer = null;
            }
        }
        private static string EscapeCommandLineArguments(string arg)
        {
            return "\"" + arg.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"";
        }
        private ErrorTypes PostProcess(IddleProcess oIddleProcess, ErrorTypes eError, bool bNeedParam)
        {
            try
            {
                CTaskQueue oTaskQueue = new CTaskQueue();
                ITaskResultInterface oTaskResult = TaskResult.NewTaskResult();
                Storage oStorage = new Storage();
                TaskQueueData oTaskQueueData = oIddleProcess.m_oTaskQueueData;
                if (null != oTaskQueueData)
                {
                    if (oIddleProcess.m_oProcess != null)
                    {

                        oIddleProcess.m_oProcess.CancelOutputRead();
                    }

                    if (ErrorTypes.NoError == eError && null != oIddleProcess.m_oProcess)
                    {
                        int nExitCode = oIddleProcess.m_oProcess.ExitCode;
                        _log.DebugFormat("ExitCode (code={0};id={1})", nExitCode, oTaskQueueData.m_sKey);
                        bool bUploadFile = true;
                        if (0 != nExitCode)
                        {
                            bUploadFile = false;
                            if (-(int)ErrorTypes.ConvertMS_OFFCRYPTO == nExitCode)
                                eError = ErrorTypes.ConvertMS_OFFCRYPTO;
                            else if (-(int)ErrorTypes.ConvertCorrupted == nExitCode)
                            {
                                eError = ErrorTypes.ConvertCorrupted;
                                bUploadFile = true;
                            }
                            else
                                eError = ErrorTypes.Convert;

                            SaveErrorFile(oIddleProcess.m_sDirToDelete, oTaskQueueData.m_sKey);
                        }
                        if (bUploadFile)
                        {
                            
                            if (null != oIddleProcess.m_sDirResult)
                            {
                                ErrorTypes eErrorUpload = UploadDirectoryToStorage(oIddleProcess.m_sDirResult, oTaskQueueData.m_sKey, "", oStorage);
                                if (ErrorTypes.NoError != eErrorUpload)
                                    eError = eErrorUpload;
                            }
                            _log.DebugFormat("UploadDirectoryToStorage complete(id={0})", oTaskQueueData.m_sKey);
                        }
                    }
                    
                    lock (m_oKeyToPercentValidateLock)
                    {
                        m_mapKeyToPercentValidate.Remove(oTaskQueueData.m_sKey);
                    }
                    
                    if (false == string.IsNullOrEmpty(oIddleProcess.m_sDirToDelete) && Directory.Exists(oIddleProcess.m_sDirToDelete))
                        Directory.Delete(oIddleProcess.m_sDirToDelete, true);
                    TaskResultDataToUpdate oTaskResultDataUpdate = new TaskResultDataToUpdate();
                    if (null != oIddleProcess.m_oTaskQueueData.m_sFromKey && !string.IsNullOrEmpty(oIddleProcess.m_oTaskQueueData.m_sFromKey))
                        oTaskResultDataUpdate.sTitle = Path.GetFileName(oIddleProcess.m_sFileTo);
                    if (true == bNeedParam)
                    {
                        oTaskResultDataUpdate.eStatus = FileStatus.NeedParams;
                        oTaskResult.Update(oTaskQueueData.m_sKey, oTaskResultDataUpdate);
                        _log.DebugFormat("oTaskResult.Update complete(status={0};id={1})", oTaskResultDataUpdate.eStatus, oTaskQueueData.m_sKey);
                    }
                    else
                    {
                        if (ErrorTypes.NoError == eError)
                            oTaskResultDataUpdate.eStatus = FileStatus.Ok;
                        else
                        {
                            if (ErrorTypes.ConvertDownload == eError)
                                oTaskResultDataUpdate.eStatus = FileStatus.ErrToReload;
                            else
                                oTaskResultDataUpdate.eStatus = FileStatus.Err;
                        }
                        oTaskResultDataUpdate.nStatusInfo = (int)eError;
                        oTaskResult.Update(oTaskQueueData.m_sKey, oTaskResultDataUpdate);
                        _log.DebugFormat("oTaskResult.Update complete(status={0};id={1})", oTaskResultDataUpdate.eStatus, oTaskQueueData.m_sKey);
                    }
                    if (null != oTaskQueueData.m_sResultCallbackUrl && !string.IsNullOrEmpty(oTaskQueueData.m_sResultCallbackUrl))
                    {
                        InputCommand cmd = InputCommand.DeserializeFromJson(oTaskQueueData.m_sResultCallbackData);
                        cmd.userid = oIddleProcess.m_sChangesAuthor;
                        string dataJson = InputCommand.SerializeToJson(cmd);
                        byte[] data = System.Text.Encoding.UTF8.GetBytes(dataJson);
                        
                        AsyncWebRequestOperation oAsyncWebRequestOperation = new AsyncWebRequestOperation();
                        TransportClass oTransportClass = new TransportClass();
                        oTransportClass.m_oTaskQueueData = oTaskQueueData;
                        oTransportClass.m_oAsyncWebRequestOperation = oAsyncWebRequestOperation;
                        oTransportClass.m_oAsyncWebRequestOperationResult = oAsyncWebRequestOperation.RequestBegin(oTaskQueueData.m_sResultCallbackUrl, "POST", "application/json", data, RequestCallback, oTransportClass);
                        _log.DebugFormat("Request to url='{0}' data='{1}' begin(id={2})", oTaskQueueData.m_sResultCallbackUrl, dataJson, oTaskQueueData.m_sKey);
                    }
                    
                    oTaskQueue.RemoveTask(oTaskQueueData.m_oDataKey);
                    _log.DebugFormat("oTaskResult.RemoveTask complete(id={0})", oTaskQueueData.m_sKey);
                    _log.DebugFormat("End Task(id={0})", oTaskQueueData.m_sKey);
                }
            }
            catch(Exception e)
            {
                _log.Error("Exception catched in PostProcess:", e);
            }
            return eError;
        }
        private void RequestCallback(IAsyncResult ar)
        {
            TransportClass oTransportClass = ar.AsyncState as TransportClass;
            try
            {
                byte[] aOutput;
                ErrorTypes eError = oTransportClass.m_oAsyncWebRequestOperation.RequestEnd(oTransportClass.m_oAsyncWebRequestOperationResult, out aOutput);
                if (_log.IsDebugEnabled)
                {
                    try
                    {
                        _log.DebugFormat("RequestCallback Response='{0}'(id={1})", Encoding.UTF8.GetString(aOutput), oTransportClass.m_oTaskQueueData.m_sKey);
                    }
                    catch
                    {
                    }
                }
                
            }
            catch (Exception e)
            {
                _log.Error("Exception catched in RequestCallback:", e);
            }
        }
        private void SaveErrorFile(string sPath, string sKey)
        {
            
            string sErrorDir = ConfigurationSettings.AppSettings["fileconverterservice.converter.errorfiles"];
            if (false == string.IsNullOrEmpty(sErrorDir) && false == string.IsNullOrEmpty(sPath))
                UploadDirectoryToStorage(sPath, sErrorDir, "", new Storage());
        }
        private ErrorTypes UploadDirectoryToStorage(string sSourceDir, string sSourceFileStoreDir, string sLocalPath, Storage oFileStore)
        {
            ErrorTypes eResult = ErrorTypes.NoError;
            string[] aFiles = Directory.GetFiles(Path.Combine(sSourceDir, sLocalPath));
            for (int i = 0, length = aFiles.Length; i < length; ++i)
            {
                string sFile = aFiles[i];
                string sFileStorePath = Path.Combine(sSourceFileStoreDir, sLocalPath);
                sFileStorePath = Path.Combine(sFileStorePath, Path.GetFileName(sFile));
                using (FileStream fs = new FileStream(sFile, FileMode.Open))
                {
                    int nReadWriteBytes;
                    oFileStore.WriteFile(sFileStorePath, fs, out nReadWriteBytes);
                }
            }
            string[] aDirectories = Directory.GetDirectories(Path.Combine(sSourceDir, sLocalPath));
            for (int i = 0, length = aDirectories.Length; i < length; ++i)
            {
                string sDir = aDirectories[i];
                string sDirLocal = Path.Combine(sLocalPath, Path.GetFileName(sDir));
                string sDirStorePath = Path.Combine(sSourceFileStoreDir, sDirLocal);
                oFileStore.CreateDirectory(sDirStorePath);
                ErrorTypes eTypes = UploadDirectoryToStorage(sSourceDir, sSourceFileStoreDir, sDirLocal, oFileStore);
                if (ErrorTypes.NoError != eTypes)
                {
                    eResult = eTypes;
                    break;
                }
            }
            return eResult;
        }
        ErrorTypes DownloadStorageTreeNodeToFilesystem(string sTargetDir, string sKey, string sLocalDir, StorageTreeNode oNode, Storage oFileStore)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            for (int i = 0, length = oNode.m_aSubNodes.Count; i < length; ++i)
            {
                StorageTreeNode oSubNode = oNode.m_aSubNodes[i];
                string sLocalPath = Path.Combine(sLocalDir, oSubNode.m_sName);
                if (oSubNode.m_bIsDirectory)
                {
                    Directory.CreateDirectory(Path.Combine(sTargetDir, sLocalPath));
                    eError = DownloadStorageTreeNodeToFilesystem(sTargetDir, sKey, sLocalPath, oSubNode, oFileStore);
                }
                else
                {
                    try
                    {
                        using (FileStream fs = new FileStream(Path.Combine(sTargetDir, sLocalPath), FileMode.Create))
                        {
                            int nReadWriteBytes;
                            oFileStore.ReadFile(Path.Combine(sKey, sLocalPath), fs, out nReadWriteBytes);
                        }
                    }
                    catch(Exception e)
                    {
                        eError = ErrorTypes.ConvertReadFile;
                        _log.Error("Exception catched in DownloadStorageTreeNodeToFilesystem:", e);
                    }
                }
                if (ErrorTypes.NoError != eError)
                    break;
            }
            return eError;
        }
        void convertProc_OutputDataReceived(object sender, System.Diagnostics.DataReceivedEventArgs e)
        {

            if (!String.IsNullOrEmpty(e.Data))
            {
                try
                {
                    string[] aArgs = StringParser.ParseArguments(e.Data);
                    if (2 <= aArgs.Length)
                    {
                        int nPercent = System.Convert.ToInt32(aArgs[1].Replace("\"", ""));
                        string sKey = aArgs[0].Replace("\"", "");
                        lock (m_oKeyToPercentLock)
                        {
                            m_mapKeyToPercent[sKey] = nPercent;
                            if (null == m_oPercentTimer)
                                m_oPercentTimer = new Timer(PercentUpdateCallback, null, 0, System.Threading.Timeout.Infinite);
                        }
                    }
                }
                catch
                {
                }
            }
        }
    }
}