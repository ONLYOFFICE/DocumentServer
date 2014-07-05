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
 using System.ServiceProcess;
using log4net;
using log4net.Config;

namespace FileConverterService2
{
    public sealed class FileConverterService2 : ServiceBase
    {
        public const string AscFileConverterServiceName = "ASC File Converter Service2";
        private readonly ILog _log;
        private readonly FileConverter fileConverter;

        public FileConverterService2()
        {            
            log4net.Config.XmlConfigurator.Configure();
            _log = LogManager.GetLogger(typeof(FileConverterService2));

            this.ServiceName = AscFileConverterServiceName;
            this.EventLog.Log = "Application";
            fileConverter = new FileConverter(System.Environment.MachineName);

            this.CanHandlePowerEvent = false;
            this.CanHandleSessionChangeEvent = false;
            this.CanPauseAndContinue = false;
            this.CanShutdown = true;
            this.CanStop = true;

        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

        protected override void OnStart(string[] args)
        {
            _log.Info("Service start");
            StartDaemon();
            base.OnStart(args);
        }

        protected override void OnStop()
        {
            _log.Info("Service stop");
            fileConverter.Stop();
            base.OnStop();
        }

        protected override void OnPause()
        {
            _log.Info("Service pause");
            base.OnPause();
        }

        protected override void OnContinue()
        {
            _log.Info("Service continue");
            base.OnContinue();
        }

        protected override void OnShutdown()
        {
            _log.Info("Service shutdown");
            fileConverter.Stop();
            base.OnShutdown();
        }

        protected override void OnCustomCommand(int command)
        {

            base.OnCustomCommand(command);
        }

        protected override bool OnPowerEvent(PowerBroadcastStatus powerStatus)
        {
            if (powerStatus == PowerBroadcastStatus.Suspend)
            {
                fileConverter.Stop();
            }
            return base.OnPowerEvent(powerStatus);
        }

        protected override void OnSessionChange(
                  SessionChangeDescription changeDescription)
        {
            base.OnSessionChange(changeDescription);
        }

        public void StartDaemon()
        {
            fileConverter.Start();
        }
    }
}