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
using log4net;
using log4net.Config;

namespace ProcessRunnerService
{
    public class ProcessRunner
    {

        private static readonly ILog _log = LogManager.GetLogger(typeof(ProcessRunner));
        private readonly ManualResetEvent _stopEvt = new ManualResetEvent(false);

        private Thread m_oStartAndWatchThread = null;

        private string m_sBinPath = null;
        private string m_sOptions = "";

        public ProcessRunner(string[] args)
        {
            if (args.Length > 1)
                m_sBinPath = EscapeCommandLineArgument(args[1]);

            for( int i = 2; i < args.Length; i++)
                m_sOptions = m_sOptions + EscapeCommandLineArgument(args[i]) + " ";
        }

        private string EscapeCommandLineArgument(string arg)
        {
            return "\"" + arg + "\"";
        }

        public void Start()
        {
            Stop();
            _stopEvt.Reset();

            if (!string.IsNullOrEmpty(m_sBinPath))
            {
                _log.Info("Start StartAndWatch thread.");

                m_oStartAndWatchThread = new Thread(StartAndWatch);
                m_oStartAndWatchThread.Start();
            }
        }

        public void Stop()
        {
            _stopEvt.Set();
        }

        public void StartAndWatch()
        {
            while (!_stopEvt.WaitOne(0))
            {
                try
                {
                    System.Diagnostics.Process oProcess = new System.Diagnostics.Process();

                    oProcess.StartInfo.FileName = m_sBinPath;
                    oProcess.StartInfo.Arguments = m_sOptions;

                    oProcess.StartInfo.CreateNoWindow = true;
                    oProcess.StartInfo.UseShellExecute = false;

                    _log.DebugFormat("Start {0} {1}", oProcess.StartInfo.FileName, oProcess.StartInfo.Arguments);

                    oProcess.Start();

                    while (!_stopEvt.WaitOne(0) && !oProcess.HasExited)
                    {
                        Thread.Sleep(TimeSpan.FromSeconds(1.0));
                    }

                    _log.Info("The process exited or stop event received.");

                    if (!oProcess.HasExited)
                         oProcess.Kill();
                }
                catch (Exception e)
                {
                    _log.Error("Exception catched in StartAndWatch:", e);
                }
            }
        }

        void processOutputHandler(object sender, System.Diagnostics.DataReceivedEventArgs e)
        {
            if (!String.IsNullOrEmpty(e.Data))
                _log.Debug(e.Data);
        }
    }
}