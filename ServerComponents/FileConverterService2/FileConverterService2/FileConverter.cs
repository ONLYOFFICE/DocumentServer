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
using System.Collections.Specialized;
using System.Configuration;
using System.Threading;
using System.IO;
using System.Net;
using System.Xml;
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
            public TaskQueueData m_oTaskQueueData;
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
#if! OPEN_SOURCE
            if (null == piWinFonts)
            {
                _log.Info("Create WinFonts.");
                piWinFonts = new ASCGraphics.CASCWinFonts();
            }
#else
            if (null == piWinFonts)
            {
                _log.Info("Create WinFonts.");
                piWinFonts = new OfficeCore.CWinFontsClass();
                string sFontDir = ConfigurationSettings.AppSettings["utils.common.fontdir"] ?? "";
                if (null != sFontDir && !string.IsNullOrEmpty(sFontDir))
                    sFontDir = Path.GetFullPath(Environment.ExpandEnvironmentVariables(sFontDir));
                piWinFonts.Init(sFontDir, true, true);
            }
#endif

            Stop();
            _stopEvt.Reset();
            for (int i = 0; i < m_nMaxRunThreads; i++)
            {
                var runThread = new Thread(Run);

                _log.InfoFormat("Start convertation thread {0} of {1}.", i + 1, m_nMaxRunThreads);
                runThread.Start();
                m_aRunThreads.Add(runThread);
            }

            m_oIddlePriority = new Thread(IddleThread);

            _log.Info("Start iddle thread.");
            m_oIddlePriority.Start();

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

            if (null != m_oIddlePriority)
            {
                
                m_oIddlePriority.Abort();
            }

            m_arrIndentFiles.Clear();

            if (null != m_oGCThread)
            {
                
                m_oGCThread.Abort();
            }
        }
        private void IddleThread()
        {
            double dMaxConvertSecconds = double.Parse(ConfigurationSettings.AppSettings["maxconverttime"]);
            double dMaxConvertSeccondsIddle = double.Parse(ConfigurationSettings.AppSettings["maxconverttimeiddle"]);

            while (!_stopEvt.WaitOne(0))
            {
                for (int nIndex = 0; nIndex < m_arrIndentFiles.Count; ++nIndex)
                {
                    ErrorTypes eError = ErrorTypes.NoError;
                    bool bIsEnd = false;

                    TimeSpan oTimeConvert = TimeSpan.Zero;
                    IddleProcess oCurIddleProcess = m_arrIndentFiles[nIndex];
                    if (oCurIddleProcess.m_oProcess.HasExited)
                    {
                        if (0 != oCurIddleProcess.m_oProcess.ExitCode)
                        {
                            eError = ErrorTypes.Convert;
                            _log.Debug("IddleThread() eError = ErrorTypes.Convert;");
                        }

                        oTimeConvert = oCurIddleProcess.m_oProcess.UserProcessorTime;
                        m_arrIndentFiles.RemoveAt(nIndex);
                        bIsEnd = true;
                    }
                    else
                    {
                        oTimeConvert = oCurIddleProcess.m_oProcess.UserProcessorTime;
                        if (oTimeConvert.TotalSeconds > dMaxConvertSecconds + dMaxConvertSeccondsIddle)
                        {
                            eError = ErrorTypes.ConvertTimeout;

                            try
                            {
                                
                                oCurIddleProcess.m_oProcess.Kill();
                            }
                            catch
                            {
                            }
                            m_arrIndentFiles.RemoveAt(nIndex);
                            bIsEnd = true;
                        }
                    }

                    if (bIsEnd)
                        PostProcess(oCurIddleProcess, eError, false);
                }
                Thread.Sleep(TimeSpan.FromSeconds(double.Parse(ConfigurationSettings.AppSettings["sleeptimeoutiddle"] ?? "10")));
            }
        }
        private void Run()
        {
            FileConverterUtils2.CTaskQueue oTaskQueue = new FileConverterUtils2.CTaskQueue();
            double dMaxConvertSecconds = double.Parse(ConfigurationSettings.AppSettings["maxconverttime"]);
            double dMaxConvertIddleFiles = double.Parse(ConfigurationSettings.AppSettings["maxconvertiddlefiles"]);

            while (!_stopEvt.WaitOne(0))
            {
                FileConverterUtils2.TaskQueueData oTaskQueueData = oTaskQueue.GetTask();

                if (null != oTaskQueueData)
                {
                    Interlocked.Increment(ref m_nRunThreadCount);
                    ErrorTypes eError = FileConverterUtils2.ErrorTypes.NoError;
                    bool bNeedParam = false;
					IddleProcess oNewIddleProcess = new IddleProcess();
                    try
                    {	
                        _log.DebugFormat("oTaskQueueData.m_sFromFormat = {0}", oTaskQueueData.m_sFromFormat);
                        _log.DebugFormat("oTaskQueueData.m_sFromKey = {0}", oTaskQueueData.m_sFromKey);
                        _log.DebugFormat("oTaskQueueData.m_sFromUrl = {0}", oTaskQueueData.m_sFromUrl);
                        _log.DebugFormat("oTaskQueueData.m_sKey = {0}", oTaskQueueData.m_sKey);
                        _log.DebugFormat("oTaskQueueData.m_sToFile = {0}", oTaskQueueData.m_sToFile);
                        _log.DebugFormat("oTaskQueueData.m_sToUrl = {0}", oTaskQueueData.m_sToUrl);

						TimeSpan oTimeConvert = TimeSpan.Zero;
						TaskResult oTaskResult = new TaskResult();
						Storage oFileStore = new Storage();
						string sDirToDelete = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, ConfigurationSettings.AppSettings["fileconverterservice.relativedir"]);
						if (false == Directory.Exists(sDirToDelete))
							Directory.CreateDirectory(sDirToDelete);
						sDirToDelete = Path.Combine(sDirToDelete, oTaskQueueData.m_sKey);
						Directory.CreateDirectory(sDirToDelete);

						oNewIddleProcess.m_sDirToDelete = sDirToDelete;
						oNewIddleProcess.m_oTaskQueueData = oTaskQueueData;

                        string sDirSource = Path.Combine(sDirToDelete, "source");
                        Directory.CreateDirectory(sDirSource);
                        string sDirResult = Path.Combine(sDirToDelete, "result");
                        Directory.CreateDirectory(sDirResult);

                        oNewIddleProcess.m_sDirSource = sDirSource;
                        oNewIddleProcess.m_sDirResult = sDirResult;

                        int nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
                        string sFileFrom = "";
                        string sFileTo = Path.Combine(sDirResult, oTaskQueueData.m_sToFile);
                        if (false == string.IsNullOrEmpty(oTaskQueueData.m_sFromUrl))
                        {
                            
                            sFileFrom = Path.Combine(sDirSource, oTaskQueueData.m_sKey + "." + oTaskQueueData.m_sFromFormat);

                            PreventDeleteTxtAndCsvOnDownload(oTaskQueueData);
                            
                            eError = DownloadFile(oTaskQueueData.m_sFromUrl, sFileFrom);

                            if (FileConverterUtils2.ErrorTypes.NoError == eError)
                            {
                                nFormatFrom = GetFormat(sFileFrom);
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
                                                    oEncoding = System.Text.Encoding.UTF8;
                                                    string sJson = Utils.GetSerializedEncodingProperty(null, null);
                                                    
                                                    int nReadWriteBytes;
                                                    oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, "settings.json"), new MemoryStream(System.Text.Encoding.UTF8.GetBytes(sJson)), out nReadWriteBytes);
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
                                                
                                                int? encoding;
                                                int? delimiter;
                                                GetEncodingAndDelimeter(sFileFrom, out encoding, out delimiter);
                                                string sJson = Utils.GetSerializedEncodingProperty(encoding, delimiter);
                                                
                                                int nReadWriteBytes;
                                                oFileStore.WriteFile(Path.Combine(oTaskQueueData.m_sKey, "settings.json"), new MemoryStream(System.Text.Encoding.UTF8.GetBytes(sJson)), out nReadWriteBytes);
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
                            if (oTaskQueueData.m_bFromOrigin.HasValue && true == oTaskQueueData.m_bFromOrigin.Value)
                            {
                                sFileFrom = Path.Combine(sDirSource, "origin");
                                nFormatFrom = GetFormat(sFileFrom);
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
                                        Array.Sort<string>(aFiles, StringComparer.Ordinal);
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
                                        nFormatFrom = GetFormat(sFileFrom);
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
                        oNewIddleProcess.m_sFileTo = sFileTo;
                        if (ErrorTypes.NoError == eError && false == bNeedParam)
                        {
                            int nWaitTimeout = (int)(dMaxConvertSecconds * 1000);
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
                            lock(m_oKeyToPercentValidateLock)
                                m_mapKeyToPercentValidate[oTaskQueueData.m_sKey] = 1;

                            #if DEBUG
                            string sConvertApp = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..\\..\\..\\FileConverter2\\bin\\Debug\\FileConverter2.exe");
                            #else
                            string sConvertApp = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "FileConverter2.exe");
                            #endif

                            System.Diagnostics.Process convertProc = new System.Diagnostics.Process();
                            oNewIddleProcess.m_oProcess = convertProc;

                            convertProc.StartInfo.FileName = sConvertApp;
                            string sConfigPath = Path.Combine(sDirToDelete, "params.xml");
                            File.WriteAllText(sConfigPath, TaskQueueDataConvert.SerializeToXml(oTaskQueueDataConvert), System.Text.Encoding.UTF8);
                            convertProc.StartInfo.Arguments = EscapeCommandLineArguments(sConfigPath);
                            
                            convertProc.StartInfo.CreateNoWindow = true;
                            convertProc.StartInfo.UseShellExecute = false;

                            convertProc.OutputDataReceived += new System.Diagnostics.DataReceivedEventHandler(convertProc_OutputDataReceived);
                            convertProc.StartInfo.RedirectStandardOutput = true;

                            _log.DebugFormat("Start {0} {1}", convertProc.StartInfo.FileName, convertProc.StartInfo.Arguments);

                            convertProc.Start();

                            convertProc.BeginOutputReadLine();

                            convertProc.WaitForExit(nWaitTimeout);

                            _log.DebugFormat("Stop WaitForExit({0})", nWaitTimeout);
                            
                            oTimeConvert = convertProc.UserProcessorTime;
                            if (!convertProc.HasExited)
                            {
                                _log.Debug("The process still working.");

                                while (m_arrIndentFiles.Count >= dMaxConvertIddleFiles)
                                {
                                    Thread.Sleep(TimeSpan.FromSeconds(5));
                                    if (convertProc.HasExited)
                                        break;
                                }
                                if (!convertProc.HasExited)
                                {
                                    try
                                    {
                                        convertProc.PriorityClass = System.Diagnostics.ProcessPriorityClass.Idle;
                                    }
                                    catch
                                    {
                                    }
                                    m_arrIndentFiles.Add(oNewIddleProcess);
                                    continue;
                                }
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

        private void PreventDeleteTxtAndCsvOnDownload(FileConverterUtils2.TaskQueueData oTaskQueueData)
        {
            Uri uri = new Uri(oTaskQueueData.m_sFromUrl);

            if (uri.LocalPath == "/ResourceService.ashx")
            {
                NameValueCollection oQueryParams = HttpUtility.ParseQueryString(uri.Query);

                string sDeletePath = oQueryParams.Get("deletepath");
                string sPath = oQueryParams.Get("path");

                if (true != string.IsNullOrEmpty(sDeletePath) &&
                    true != string.IsNullOrEmpty(sPath))
                {
                    if (("txt" == oTaskQueueData.m_sFromFormat && null == oTaskQueueData.m_nCsvTxtEncoding) ||
                        ("csv" == oTaskQueueData.m_sFromFormat && 
                            (null == oTaskQueueData.m_nCsvTxtEncoding || null == oTaskQueueData.m_nCsvDelimiter)))
                    {
                        
                        oTaskQueueData.m_sFromUrl = oTaskQueueData.m_sFromUrl.Replace("deletepath=", "notdeletepath=");
                    }
                }
            }
        }

        private ErrorTypes DownloadFile(string sUrl, string sFileFrom)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                using (WebClient oWebClient = new WebClient())
                {
                    oWebClient.Headers.Add(HttpRequestHeader.UserAgent, FileConverterUtils2.Constants.mc_sWebClientUserAgent);
                    using (Stream oWebClientStream = oWebClient.OpenRead(sUrl))
                    {
                        Int64 nCurBytes = Convert.ToInt64(oWebClient.ResponseHeaders["Content-Length"]);
                        Int64 nMaxBytes = Convert.ToInt64(ConfigurationSettings.AppSettings["maxdownloadbytes"]);
                        if (nCurBytes < nMaxBytes)
                        {
                            if (nCurBytes <= 0)
                                nCurBytes = 10 * 1024 * 1024;
                            byte[] aBuffer = new byte[nCurBytes];
                            using (FileStream fs = File.Create(sFileFrom))
                            {
                                int nRead = oWebClientStream.Read(aBuffer, 0, aBuffer.Length);
                                while (nRead > 0)
                                {
                                    fs.Write(aBuffer, 0, nRead);
                                    nRead = oWebClientStream.Read(aBuffer, 0, aBuffer.Length);
                                }
                            }
                        }
                        else
                        {
                            eError = ErrorTypes.ConvertDownload;
                            _log.ErrorFormat("Downloaded object size {0} exceed max {1}", nCurBytes, nMaxBytes);
                        }
                    }
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
                        TaskResult oTaskResult = new TaskResult();
                        List<TaskResultData> aTasts = null;
                        int nMaxCount = int.Parse(ConfigurationManager.AppSettings["fileconverterservice.gc.removedtaskatonce"] ?? "10");
                        ErrorTypes oError = oTaskResult.GetExpired(nMaxCount, out aTasts);
                        if (ErrorTypes.NoError == oError && aTasts != null && aTasts.Count > 0)
                        {
                            Storage oStorage = new Storage();

                            foreach (TaskResultData oTast in aTasts)
                            {
                                if (ErrorTypes.NoError == oTaskResult.Remove(oTast.sKey))
                                {
                                    oStorage.RemovePath(oTast.sKey);
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
                TaskResult oTaskResult = new TaskResult();
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
                TaskResult oTaskResult = new TaskResult();
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
                        if (0 != oIddleProcess.m_oProcess.ExitCode)
                        {
                            eError = ErrorTypes.Convert;
                            _log.Debug("PostProcess() eError = ErrorTypes.Convert;");

                            if (null != oIddleProcess.m_sDirSource)
                                SaveErrorFile(oIddleProcess.m_sDirSource, oTaskQueueData.m_sKey);
                        }
                        else
                        {
                            if (false == string.IsNullOrEmpty(oTaskQueueData.m_sToUrl))
                            {
                                
                                WebClient oWebClient = new WebClient();
                                oWebClient.Headers.Add(HttpRequestHeader.UserAgent, FileConverterUtils2.Constants.mc_sWebClientUserAgent);
                                if (null != oIddleProcess.m_sFileTo)
                                    oWebClient.UploadFile(oTaskQueueData.m_sToUrl, oIddleProcess.m_sFileTo);
                            }
                            else
                            {
                                
                                if (null != oIddleProcess.m_sDirResult)
                                    eError = UploadDirectoryToStorage(oIddleProcess.m_sDirResult, oTaskQueueData.m_sKey, "", oStorage);
                            }
                        }
                    }
                    
                    lock (m_oKeyToPercentValidateLock)
                        m_mapKeyToPercentValidate.Remove(oTaskQueueData.m_sKey);
                    
                    if (false == string.IsNullOrEmpty(oIddleProcess.m_sDirToDelete) && Directory.Exists(oIddleProcess.m_sDirToDelete))
                        Directory.Delete(oIddleProcess.m_sDirToDelete, true);
                    if (true == bNeedParam)
                    {
                        TaskResultDataToUpdate oToUpdate = new TaskResultDataToUpdate();
                        oToUpdate.eStatus = FileStatus.NeedParams;
                        oTaskResult.Update(oTaskQueueData.m_sKey, oToUpdate);
                    }
                    else
                    {
                        TaskResultDataToUpdate oTaskResultDataUpdate = new TaskResultDataToUpdate();
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
                    }
                    
                    oTaskQueue.RemoveTask(oTaskQueueData.m_oDataKey);
                }
            }
            catch(Exception e)
            {
                _log.Error("Exception catched in PostProcess:", e);
            }
            return eError;
        }
        private void SaveErrorFile(string sPath, string sKey)
        {
            
            string sErrorDir = ConfigurationSettings.AppSettings["ErrorFiles"];
            if (false == string.IsNullOrEmpty(sErrorDir) && false == string.IsNullOrEmpty(sPath))
            {
                Storage oStorage = new Storage();
                using (FileStream fs = new FileStream(sPath, FileMode.Open))
                {
                    int nReadWriteBytes;
                    oStorage.WriteFile(Path.Combine(sErrorDir, sKey), fs, out nReadWriteBytes);
                }
            }
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
                if (oSubNode.m_bIsDirectory)
                {
                    string sLocalPath = sLocalDir + oSubNode.m_sName + "\\";
                    Directory.CreateDirectory(Path.Combine(sTargetDir, sLocalPath));
                    eError = DownloadStorageTreeNodeToFilesystem(sTargetDir, sKey, sLocalPath, oSubNode, oFileStore);
                }
                else
                {
                    string sLocalPath = sLocalDir + oSubNode.m_sName;
                    try
                    {
                        using (FileStream fs = new FileStream(Path.Combine(sTargetDir, Path.Combine(sLocalDir, oSubNode.m_sName)), FileMode.Create))
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
        int GetFormat(string sFilepath)
        {
            ASCOfficeFile.CAVSOfficeFormatCheckerClass oAVSOfficeFormatChecker = new ASCOfficeFile.CAVSOfficeFormatCheckerClass();
            int nFormat = oAVSOfficeFormatChecker.GetFileFormat(sFilepath);
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == nFormat)
            {
                if (Ionic.Zip.ZipFile.IsZipFile(sFilepath))
                {
                    
                    using (Ionic.Zip.ZipFile oZipFile = new Ionic.Zip.ZipFile(sFilepath))
                    {
                        if (oZipFile.ContainsEntry("Editor.bin"))
                        {
                            Ionic.Zip.ZipEntry oEntry = oZipFile["Editor.bin"];
                            MemoryStream oMemoryStream = new MemoryStream((int)oEntry.UncompressedSize);
                            oEntry.Extract(oMemoryStream);
                            oMemoryStream.Position = 0;
                            int nSignatureLength = 4;
                            if (oMemoryStream.Length >= nSignatureLength)
                            {
                                byte[] aSignature = new byte[nSignatureLength];
                                oMemoryStream.Read(aSignature, 0, nSignatureLength);
                                string sSignature = System.Text.ASCIIEncoding.ASCII.GetString(aSignature);
                                switch (sSignature)
                                {
                                    case "DOCY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY; break;
                                    case "XLSY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY; break;
                                    case "PPTY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY; break;
                                }
                            }
                        }
                        else if (oZipFile.ContainsEntry("Editor.xml"))
                        {
                            nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION;
                        }
                        else if (oZipFile.ContainsEntry("Editor.svg"))
                        {
                            nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING;
                        }
                        else if (oZipFile.ContainsEntry("Editor.html.arch"))
                        {
                            nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT;
                        }
                    }
                }
            }
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == nFormat)
            {
                using (StreamReader sr = new StreamReader(sFilepath))
                {
                    char[] aBuffer = new char[4];
                    sr.Read(aBuffer, 0, aBuffer.Length);
                    string sSignature = new string(aBuffer);
                    switch (sSignature)
                    {
                        case "DOCY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD; break;
                        case "XLSY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET; break;
                        case "PPTY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION; break;
                    }
                }
            }
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == nFormat)
            {
                
                string sExt = Path.GetExtension(sFilepath);
                if(sExt.Length > 0 && '.' == sExt[0])
                    sExt = sExt.Substring(1);
                nFormat = FileFormats.FromString(sExt);
            }
            return nFormat;
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