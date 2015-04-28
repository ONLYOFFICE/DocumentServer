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
using System.Xml;
using System.Xml.Serialization;
using System.Configuration;
using System.Runtime.Serialization;
using System.Threading;
using System.Data;
using log4net;

namespace FileConverterUtils2
{
    [Serializable()]
    public class TaskQueueData
    {
        public string m_sKey;
        public int m_nToFormat;
        public string m_sToFile;

        public string m_sFromFormat = "";
        public string m_sFromUrl;
        public string m_sFromKey;
        
        public object m_oDataKey;

        public string m_sToUrl;
        public int? m_nCsvTxtEncoding;
        public int? m_nCsvDelimiter;
        public bool? m_bFromOrigin;
        public bool? m_bFromSettings;
        public bool? m_bFromChanges;
        public bool? m_bPaid;
        public bool? m_bEmbeddedFonts;
        public string m_sResultCallbackUrl;
        public string m_sResultCallbackData;

        [XmlIgnore]
        public TimeSpan VisibilityTimeout { get; set; }

        public long VisibilityTimeoutTick
        {
            get { return VisibilityTimeout.Ticks; }
            set { VisibilityTimeout = new TimeSpan(value); }
        }

        public TaskQueueData()
        {
        }
        public TaskQueueData(string sKey, int nToFormat, string sToFile)
        {
            m_sKey = sKey;
            m_nToFormat = nToFormat;
            m_sToFile = sToFile;
        }
        public static string SerializeToXml(TaskQueueData oData)
        {
            return Utils.SerializeToXml(typeof(TaskQueueData), oData);
        }
        public static TaskQueueData DeserializeFromXml(string sXml)
        {
            return Utils.DeserializeFromXml(typeof(TaskQueueData), sXml) as TaskQueueData;
        }
    }
    [Serializable()]
    public class TaskQueueDataConvert
    {
        public string m_sKey;
        public string m_sFileFrom;
        public string m_sFileTo;
        public int m_nFormatFrom;
        public int m_nFormatTo;

        public int? m_nCsvTxtEncoding;
        public int? m_nCsvDelimiter;
        public bool? m_bPaid;
        public bool? m_bEmbeddedFonts;
        public bool? m_bFromChanges;
        public string m_sFontDir;
        public string m_sThemeDir;

        public DateTime m_oTimestamp;

        public TaskQueueDataConvert()
        {
            m_oTimestamp = DateTime.UtcNow;
            m_sFontDir = null;
            m_sThemeDir = null;
        }
        public TaskQueueDataConvert(string sKey, string sFileFrom, int nFormatFrom, string sFileTo, int nFormatTo)
        {
            m_oTimestamp = DateTime.UtcNow;
            m_sKey = sKey;
            m_sFileFrom = sFileFrom;
            m_nFormatFrom = nFormatFrom;
            m_sFileTo = sFileTo;
            m_nFormatTo = nFormatTo;
            m_sFontDir = null;
            m_sThemeDir = null;
        }
        public static string SerializeToXml(TaskQueueDataConvert oData)
        {
            return Utils.SerializeToXml(typeof(TaskQueueDataConvert), oData);
        }
        public static TaskQueueDataConvert DeserializeFromXml(string sXml)
        {
            return Utils.DeserializeFromXml(typeof(TaskQueueDataConvert), sXml) as TaskQueueDataConvert;
        }
    }
    public interface ITaskQueue
    {
        ErrorTypes AddTask(TaskQueueData oTask, Priority oPriority);
        void AddTaskBegin(TaskQueueData oTask, Priority oPriority, AsyncCallback fCallback, object oParam);
        ErrorTypes AddTaskEnd(IAsyncResult ar);

        TaskQueueData GetTask();
        void GetTaskBegin(AsyncCallback fCallback, object oParam);
        TaskQueueData GetTaskEnd(IAsyncResult ar);

        ErrorTypes RemoveTask(object key);
        void RemoveTaskBegin(object key, AsyncCallback fCallback, object oParam);
        ErrorTypes RemoveTaskEnd(IAsyncResult ar);
    }
    public class CTaskQueue : ITaskQueue
    {
        private ITaskQueue m_oTaskQueue;
        public CTaskQueue()
        {
            switch (ConfigurationManager.AppSettings["utils.taskqueue.impl"])
            {
                case "sqs":
                    m_oTaskQueue = new CTaskQueueAmazonSQS();
                    break;

                case "db":
                default:
                    m_oTaskQueue = new CTaskQueueDataBase();
                    break;
            }
        }
        public ErrorTypes AddTask(TaskQueueData oTask, Priority oPriority)
        {
            return m_oTaskQueue.AddTask(oTask, oPriority);
        }
        public void AddTaskBegin(TaskQueueData oTask, Priority oPriority, AsyncCallback fCallback, object oParam)
        {
            m_oTaskQueue.AddTaskBegin(oTask, oPriority, fCallback, oParam);
        }
        public ErrorTypes AddTaskEnd(IAsyncResult ar)
        {
            return m_oTaskQueue.AddTaskEnd(ar);
        }

        public TaskQueueData GetTask()
        {
            return m_oTaskQueue.GetTask();
        }
        public void GetTaskBegin(AsyncCallback fCallback, object oParam)
        {
            m_oTaskQueue.GetTaskBegin(fCallback, oParam);
        }
        public TaskQueueData GetTaskEnd(IAsyncResult ar)
        {
            return m_oTaskQueue.GetTaskEnd(ar);
        }

        public ErrorTypes RemoveTask(object key)
        {
            return m_oTaskQueue.RemoveTask(key);
        }
        public void RemoveTaskBegin(object key, AsyncCallback fCallback, object oParam)
        {
            m_oTaskQueue.RemoveTaskBegin(key, fCallback, oParam);
        }
        public ErrorTypes RemoveTaskEnd(IAsyncResult ar)
        {
            return m_oTaskQueue.RemoveTaskEnd(ar);
        }
    }
}