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
using System.Text;
using System.Xml;
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
        public bool? m_bFromChanges;
        public bool? m_bPaid;
        public bool? m_bEmbeddedFonts;
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
            StringBuilder sb = new StringBuilder();
            XmlWriterSettings ws = new XmlWriterSettings();
            ws.NewLineHandling = NewLineHandling.None;
            ws.Indent = false;
            XmlWriter xw = System.Xml.XmlWriter.Create(sb, ws);
            System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(typeof(TaskQueueData));
            formatter.Serialize(xw, oData);
            return sb.ToString();
        }
        public static TaskQueueData DeserializeFromXml(string sXml)
        {
            System.IO.StringReader sr = new System.IO.StringReader(sXml);
            System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(typeof(TaskQueueData));
            return formatter.Deserialize(sr) as TaskQueueData;
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

        public TaskQueueDataConvert()
        {
        }
        public TaskQueueDataConvert(string sKey, string sFileFrom, int nFormatFrom, string sFileTo, int nFormatTo)
        {
            m_sKey = sKey;
            m_sFileFrom = sFileFrom;
            m_nFormatFrom = nFormatFrom;
            m_sFileTo = sFileTo;
            m_nFormatTo = nFormatTo;
        }
        public static string SerializeToXml(TaskQueueDataConvert oData)
        {
            StringBuilder sb = new StringBuilder();
            XmlWriterSettings ws = new XmlWriterSettings();
            ws.NewLineHandling = NewLineHandling.None;
            ws.Indent = false;
            XmlWriter xw = System.Xml.XmlWriter.Create(sb, ws);
            System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(typeof(TaskQueueDataConvert));
            formatter.Serialize(xw, oData);
            return sb.ToString();
        }
        public static TaskQueueDataConvert DeserializeFromXml(string sXml)
        {
            System.IO.StringReader sr = new System.IO.StringReader(sXml);
            System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(typeof(TaskQueueDataConvert));
            return formatter.Deserialize(sr) as TaskQueueDataConvert;
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

    class CTaskQueueDataBase : ITaskQueue
    {
        private string m_sConnectionString = ConfigurationManager.AppSettings["utils.taskqueue.db.connectionstring"];
        private const string m_cstrTableName = "convert_queue";
        private const string m_cstrMaxConvertTime = "maxconverttime";
        private const string m_cstrMaxConvertTimeIddle = "maxconverttimeiddle";
        private double m_dMaxConvertTimeInSeconds = 0;

        private delegate IDataReader ExecuteReader();
        private delegate int ExecuteNonQuery();

        private enum BusyType : int
        {
            not_busy = 0,
            busy = 1
        }
        private delegate ErrorTypes DelegateRemoveTask(object key);
        private delegate ErrorTypes DelegateAddTask(TaskQueueData oTask, Priority oPriority);
        private class TransportClass : TransportClassAsyncOperation
        {
            public ExecuteReader m_delegateReader = null;
            public ExecuteNonQuery m_delegateNonQuery = null;
            public IDbConnection m_oSqlCon = null;
            public IDbCommand m_oCommand = null;
            public TaskQueueData m_oTaskQueueData = null;
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, object oParam)
                : base(fCallback, oParam)
            {
            }
            public override void Close()
            {
                try
                {
                    if (null != m_oCommand)
                    {
                        m_oCommand.Dispose();
                        m_oCommand = null;
                    }
                    if (null != m_oSqlCon)
                    {
                        m_oSqlCon.Close();
                        m_oSqlCon.Dispose();
                        m_oSqlCon = null;
                    }
                }
                catch
                {
                    m_eError = ErrorTypes.TaskQueue;
                }
            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.TaskQueue;
                try
                {
                    if (null != m_oCommand)
                    {
                        m_oCommand.Dispose();
                        m_oCommand = null;
                    }
                    if (null != m_oSqlCon)
                    {
                        m_oSqlCon.Dispose();
                        m_oSqlCon = null;
                    }
                }
                catch
                {
                }
            }
        }
        private TransportClass m_GetTask = null;
        private DelegateRemoveTask m_RemoveTask = null;
        private DelegateAddTask m_AddTask = null;

        public CTaskQueueDataBase()
        {
            try
            {
                string sMaxconverttime = ConfigurationManager.AppSettings[m_cstrMaxConvertTime];
                string sMaxconverttimeiddle = ConfigurationManager.AppSettings[m_cstrMaxConvertTimeIddle];
                if (false == string.IsNullOrEmpty(sMaxconverttime) && false == string.IsNullOrEmpty(sMaxconverttimeiddle))
                {
                    double dMaxconverttime = double.Parse(sMaxconverttime, Constants.mc_oCultureInfo);
                    double dMaxconverttimeiddle = double.Parse(sMaxconverttimeiddle, Constants.mc_oCultureInfo);
                    m_dMaxConvertTimeInSeconds = dMaxconverttime + dMaxconverttimeiddle;
                }
            }
            catch
            {
            }
        }

        public ErrorTypes AddTask(TaskQueueData oTask, Priority oPriority)
        {
            ErrorTypes eResult = ErrorTypes.TaskQueue;
            try
            {
                string strId = (string)oTask.m_sKey;

                string strInsertRow = GetInsertString(oTask, oPriority);
                using (System.Data.IDbConnection dbConnection = GetDbConnection())
                {
                    dbConnection.Open();
                    using (System.Data.IDbCommand oInsertCommand = dbConnection.CreateCommand())
                    {
                        oInsertCommand.CommandText = strInsertRow;
                        oInsertCommand.ExecuteNonQuery();

                        eResult = ErrorTypes.NoError;
                    }
                }
            }
            catch
            {
                eResult = ErrorTypes.TaskQueue;
            }
            return eResult;
        }
        public void AddTaskBegin(TaskQueueData oTask, Priority oPriority, AsyncCallback fCallback, object oParam)
        {
            m_AddTask = AddTask;
            m_AddTask.BeginInvoke(oTask, oPriority, fCallback, oParam);
        }
        public ErrorTypes AddTaskEnd(IAsyncResult ar)
        {
            ErrorTypes eRes = ErrorTypes.NoError;
            try
            {
                eRes = m_AddTask.EndInvoke(ar);
            }
            catch
            {
                eRes = ErrorTypes.TaskQueue;
            }
            return eRes;
        }
        public TaskQueueData GetTask()
        {
            TaskQueueData oData = null;
            bool bResult = false;

            uint ncq_id = 0;

            string strSelectSQL = GetSelectString();
            string strUpdateSQL = GetUpdateString();
            try
            {
                using (System.Data.IDbConnection dbConnection = GetDbConnection())
                {
                    dbConnection.Open();
                    bool bIsExist = false;
                    using (IDbCommand oSelectCommand = dbConnection.CreateCommand())
                    {
                        oSelectCommand.CommandText = strSelectSQL;
                        using (System.Data.IDataReader oDataReader = oSelectCommand.ExecuteReader())
                        {
                            if (true == oDataReader.Read())
                            {
                                ncq_id = Convert.ToUInt32(oDataReader["cq_id"]);
                                oData = TaskQueueData.DeserializeFromXml(Convert.ToString(oDataReader["cq_data"]));
                                oData.m_oDataKey = ncq_id;

                                bIsExist = true;
                            }
                        }
                    }

                    if (bIsExist)
                    {
                        using (System.Data.IDbCommand oUpdateCommand = dbConnection.CreateCommand())
                        {
                            oUpdateCommand.CommandText = strUpdateSQL + ncq_id + "';";

                            if (oUpdateCommand.ExecuteNonQuery() > 0)
                                bResult = true;
                            else
                                bResult = false;
                        }
                    }
                }
            }
            catch
            {
            }

            return (bResult) ? oData : null;
        }
        public void GetTaskBegin(AsyncCallback fCallback, object oParam)
        {
            m_GetTask = new TransportClass(fCallback, oParam);
            try
            {
                DateTime oDateTimeNow = DateTime.UtcNow;
                DateTime oDateTimeNowMinusConvertTime = oDateTimeNow.AddSeconds(-1 * m_dMaxConvertTimeInSeconds);
                string strDateTimeNow = oDateTimeNow.ToString(Constants.mc_sDateTimeFormat);
                string strDateTimeNowMinusConvertTime = oDateTimeNowMinusConvertTime.ToString(Constants.mc_sDateTimeFormat);
                
                string strSelectSQL = GetSelectString();

                m_GetTask.m_oSqlCon = GetDbConnection();
                m_GetTask.m_oSqlCon.Open();
                IDbCommand oSelCommand = m_GetTask.m_oSqlCon.CreateCommand();
                oSelCommand.CommandText = strSelectSQL;
                m_GetTask.m_oCommand = oSelCommand;
                m_GetTask.m_delegateReader = new ExecuteReader(oSelCommand.ExecuteReader);
                m_GetTask.m_delegateReader.BeginInvoke(GetTaskCallback, null);
            }
            catch
            {
                m_GetTask.DisposeAndCallback();
            }
        }
        public TaskQueueData GetTaskEnd(IAsyncResult ar)
        {
            bool bResult = false;
            if (ErrorTypes.NoError == m_GetTask.m_eError)
            {
                try
                {
                    if (null != m_GetTask.m_delegateNonQuery)
                    {
                        if (m_GetTask.m_delegateNonQuery.EndInvoke(ar) > 0)
                            bResult = true;
                        else
                            bResult = false;

                    }
                    m_GetTask.Close();
                }
                catch
                {
                    m_GetTask.Dispose();
                }
            }
            return (bResult) ? m_GetTask.m_oTaskQueueData : null;
        }
        public ErrorTypes RemoveTask(object key)
        {
            ErrorTypes eResult = ErrorTypes.TaskQueue;

            try
            {
                uint nId = (uint)key;
                string strDeleteRow = GetDeleteString(nId);
                using (System.Data.IDbConnection dbConnection = GetDbConnection())
                {
                    dbConnection.Open();
                    using (IDbCommand oDelCommand = dbConnection.CreateCommand())
                    {
                        oDelCommand.CommandText = strDeleteRow;
                        oDelCommand.ExecuteNonQuery();

                        eResult = ErrorTypes.NoError;
                    }
                }
            }
            catch
            {
            }

            return eResult;
        }
        public void RemoveTaskBegin(object key, AsyncCallback fCallback, object oParam)
        {
            m_RemoveTask = RemoveTask;
            m_RemoveTask.BeginInvoke(key, fCallback, oParam);
        }
        public ErrorTypes RemoveTaskEnd(IAsyncResult ar)
        {
            ErrorTypes eRes = ErrorTypes.NoError;
            try
            {
                eRes = m_RemoveTask.EndInvoke(ar);
            }
            catch
            {
                eRes = ErrorTypes.TaskQueue;
            }
            return eRes;
        }

        private void GetTaskCallback(IAsyncResult ar)
        {
            try
            {
                uint ncq_id = 0;
                bool bIsExist = false;
                using (IDataReader oReader = m_GetTask.m_delegateReader.EndInvoke(ar))
                {
                    if (true == oReader.Read())
                    {
                        ncq_id = Convert.ToUInt32(oReader["cq_id"]);
                        m_GetTask.m_oTaskQueueData = TaskQueueData.DeserializeFromXml(Convert.ToString(oReader["cq_data"]));
                        m_GetTask.m_oTaskQueueData.m_oDataKey = ncq_id;

                        bIsExist = true;
                    }
                }
                if (null != m_GetTask.m_oCommand)
                {
                    m_GetTask.m_oCommand.Dispose();
                    m_GetTask.m_oCommand = null;
                }
                m_GetTask.Close();
                if (bIsExist)
                {

                    IDbCommand oUpdateCommand = m_GetTask.m_oSqlCon.CreateCommand();
                    oUpdateCommand.CommandText = GetUpdateString();
                    m_GetTask.m_oCommand = oUpdateCommand;
                    m_GetTask.m_delegateNonQuery = new ExecuteNonQuery(oUpdateCommand.ExecuteNonQuery);
                    m_GetTask.m_delegateNonQuery.BeginInvoke(m_GetTask.m_fCallback, m_GetTask.m_oParam);
                }
                else
                {
                    m_GetTask.m_delegateNonQuery = null;
                    m_GetTask.FireCallback();
                }
            }
            catch
            {
                m_GetTask.DisposeAndCallback();
            }
        }

        private System.Data.IDbConnection GetDbConnection()
        {
            ConnectionStringSettings oConnectionSettings = ConfigurationManager.ConnectionStrings[m_sConnectionString];
            System.Data.Common.DbProviderFactory dbProvider = System.Data.Common.DbProviderFactories.GetFactory(oConnectionSettings.ProviderName);
            System.Data.IDbConnection newConnection = dbProvider.CreateConnection();
            newConnection.ConnectionString = oConnectionSettings.ConnectionString;
            return newConnection;
        }
        private string GetSelectString()
        {
            DateTime oDateTimeNow = DateTime.UtcNow;
            DateTime oDateTimeNowMinusConvertTime = oDateTimeNow.AddSeconds(-1 * m_dMaxConvertTimeInSeconds);
            string strDateTimeNow = oDateTimeNow.ToString(Constants.mc_sDateTimeFormat);
            string strDateTimeNowMinusConvertTime = oDateTimeNowMinusConvertTime.ToString(Constants.mc_sDateTimeFormat);
            return "SELECT * FROM " + m_cstrTableName + " WHERE cq_isbusy <> '" + BusyType.busy.ToString("d") + "' OR cq_time <= '" + strDateTimeNowMinusConvertTime + "' ORDER BY cq_priority";
        }
        private string GetInsertString(TaskQueueData oTask, Priority ePriority)
        {
            
            string sData = TaskQueueData.SerializeToXml(oTask);
            return "INSERT INTO " + m_cstrTableName + " ( cq_data, cq_priority, cq_time, cq_isbusy ) VALUES ( '" + sData + "', '" + ePriority.ToString("d") + "', '" + DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat) + "', '" + BusyType.not_busy.ToString("d") + "' );";
        }
        private string GetDeleteString(uint nId)
        {
            return "DELETE FROM " + m_cstrTableName + " WHERE cq_id='" + nId.ToString() + "'";
        }
        private string GetUpdateString()
        {
            DateTime oDateTimeNow = DateTime.UtcNow;
            DateTime oDateTimeNowMinusConvertTime = oDateTimeNow.AddSeconds(-1 * m_dMaxConvertTimeInSeconds);
            string strDateTimeNowMinusConvertTime = oDateTimeNowMinusConvertTime.ToString(Constants.mc_sDateTimeFormat);
            
            return "UPDATE " + m_cstrTableName + " SET cq_isbusy = '" + BusyType.busy.ToString("d") + "',cq_time = '" + DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat) + "'  WHERE (cq_isbusy <> '" + BusyType.busy.ToString("d") + "' OR cq_time <= '" + strDateTimeNowMinusConvertTime + "') AND cq_id = '";
        }
        
    }

    class CTaskQueueAmazonSQS : ITaskQueue
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(CTaskQueueAmazonSQS));
        private struct SQSDataKey
        {
            public string m_strReceiptHandle;
            public Priority m_oPriority;
        }

        private const string m_cstrLowPriorityQueueSettings = "utils.taskqueue.sqs.lp";
        private const string m_cstrNormalPriorityQueueSettings = "utils.taskqueue.sqs.np";
        private const string m_cstrHighPriorityQueueSettings = "utils.taskqueue.sqs.hp";

        private string m_strLowPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrLowPriorityQueueSettings];
        private string m_strNormalPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrNormalPriorityQueueSettings];
        private string m_strHighPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrHighPriorityQueueSettings];
        private bool m_LongPoolingEnable = bool.Parse(ConfigurationManager.AppSettings["utils.taskqueue.sqs.longpooling"] ?? "false");

        private static int m_nIsHPRead;
        private static int m_nIsNPRead;
        private static int m_nIsLPRead;

        private delegate ErrorTypes ExecuteTaskAdder(TaskQueueData oTask, Priority oPriority);
        private delegate TaskQueueData ExecuteTaskGetter();
        private delegate ErrorTypes ExecuteTaskRemover(object key);

        private class TransportClass : TransportClassAsyncOperation
        {
            public ExecuteTaskAdder m_delegateAdder = null;
            public ExecuteTaskGetter m_delegateGetter = null;
            public ExecuteTaskRemover m_delegateRemover = null;

            public ErrorTypes m_eError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, object oParam): base(fCallback, oParam)
            {
            }
            public override void Close()
            {

            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.TaskQueue;

            }
        }

        private TransportClass m_oAddTask = null;
        private TransportClass m_oGetTask = null;
        private TransportClass m_oRemoveTask = null;
        private string GetQueueUrl(Priority oPriority)
        {
            string strUrlQueue = "";
            switch (oPriority)
            {
                case Priority.Low:
                    strUrlQueue = m_strLowPriorityQueueUrl;
                    break;
                case Priority.Normal:
                    strUrlQueue = m_strNormalPriorityQueueUrl;
                    break;
                case Priority.High:
                    strUrlQueue = m_strHighPriorityQueueUrl;
                    break;
            }
            return strUrlQueue;
        }

        public ErrorTypes AddTask(TaskQueueData oTask, Priority oPriority)
        {
            ErrorTypes eResult = ErrorTypes.Unknown;
            string strUrlQueue = GetQueueUrl(oPriority);

            try
            {
                
                string strData = TaskQueueData.SerializeToXml(oTask);

                using (Amazon.SQS.AmazonSQS oSQSClient = Amazon.AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    Amazon.SQS.Model.SendMessageRequest oSendMessageRequest = new Amazon.SQS.Model.SendMessageRequest();
                    oSendMessageRequest.QueueUrl = strUrlQueue;   
                    oSendMessageRequest.MessageBody = strData;
                    oSQSClient.SendMessage(oSendMessageRequest);
                    eResult = ErrorTypes.NoError;
                }
            }
            catch (Amazon.SQS.AmazonSQSException)
            {
                eResult = ErrorTypes.TaskQueue;
            }
            catch
            {
                eResult = ErrorTypes.TaskQueue;
            }

            return eResult;
        }
        public void AddTaskBegin(TaskQueueData oTask, Priority oPriority, AsyncCallback fCallback, object oParam)
        {

            m_oAddTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oAddTask.m_delegateAdder = AddTask;
                m_oAddTask.m_delegateAdder.BeginInvoke(oTask, oPriority, m_oAddTask.m_fCallback, m_oAddTask.m_oParam);
            }
            catch
            {
                m_oAddTask.DisposeAndCallback();
            }
            return;
        }

        public ErrorTypes AddTaskEnd(IAsyncResult ar)
        {
            ErrorTypes eResult = m_oAddTask.m_eError;
            if (ErrorTypes.NoError == m_oAddTask.m_eError)
            {
                try
                {
                    m_oAddTask.m_delegateAdder.EndInvoke(ar);
                    m_oAddTask.Close();
                }
                catch
                {
                    m_oAddTask.Dispose();
                }
            }
            return eResult;
        }

        private TaskQueueData GetTask(Priority oPriority)
        {
            string strUrlQueue = GetQueueUrl(oPriority);

            TaskQueueData oData = null;
            try
            {
                
                using (Amazon.SQS.AmazonSQS oSQSClient = Amazon.AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    Amazon.SQS.Model.ReceiveMessageRequest oReceiveMessageRequest = new Amazon.SQS.Model.ReceiveMessageRequest();
                    oReceiveMessageRequest.QueueUrl = strUrlQueue;
                    oReceiveMessageRequest.MaxNumberOfMessages = 1;

                    Amazon.SQS.Model.ReceiveMessageResponse oReceiveMessageResponse = oSQSClient.ReceiveMessage(oReceiveMessageRequest);
                    if (oReceiveMessageResponse.IsSetReceiveMessageResult())
                    {
                        Amazon.SQS.Model.ReceiveMessageResult oReceiveMessageResult = oReceiveMessageResponse.ReceiveMessageResult;
                        foreach (Amazon.SQS.Model.Message oMessage in oReceiveMessageResult.Message)
                        {
                            oData = TaskQueueData.DeserializeFromXml(oMessage.Body);

                            SQSDataKey oSQSDataKey = new SQSDataKey();
                            oSQSDataKey.m_oPriority = oPriority;
                            oSQSDataKey.m_strReceiptHandle = oMessage.ReceiptHandle;
                            oData.m_oDataKey = oSQSDataKey;
                            break;
                        }
                    }
                }
            }
            catch (Amazon.SQS.AmazonSQSException)
            {
            }
            catch
            {
            }

            return oData;
        }
        public TaskQueueData GetTask()
        {
            TaskQueueData oData = null;

            if(m_LongPoolingEnable)
               oData = GetTaskFromLongPoolingQueue();
            else
                oData = GetTaskFromQueue();

            return oData;
        }
        private TaskQueueData GetTaskFromLongPoolingQueue()
        {
            TaskQueueData oData = null;
            
            if (0 == Interlocked.CompareExchange(ref m_nIsHPRead, 1, 0)) 
            {
                _log.Debug("Try to get high priority task...");
                oData = GetTask(Priority.High);
                Interlocked.Exchange(ref m_nIsHPRead, 0);
            }
            else if (0 == Interlocked.CompareExchange(ref m_nIsNPRead, 1, 0)) 
            {
                _log.Debug("Try to get normal priority task...");
                oData = GetTask(Priority.Normal);
                Interlocked.Exchange(ref m_nIsNPRead, 0);
            }
            else if (0 == Interlocked.CompareExchange(ref m_nIsLPRead, 1, 0)) 
            {
                _log.Debug("Try to get low priority task...");
                oData = GetTask(Priority.Low);
                Interlocked.Exchange(ref m_nIsLPRead, 0);
            }
            else
            {
                _log.Debug("All task queue listening!");
            }

            return oData;
        }
        private TaskQueueData GetTaskFromQueue()
        {
            TaskQueueData oData = null;

            oData = GetTask(Priority.High);
            if (null != oData)
                return oData;

            oData = GetTask(Priority.Normal);
            if (null != oData)
                return oData;

            oData = GetTask(Priority.Low);

            return oData;
        }
        public void GetTaskBegin(AsyncCallback fCallback, object oParam)
        {
            m_oGetTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oGetTask.m_delegateGetter = GetTask;
                m_oGetTask.m_delegateGetter.BeginInvoke(m_oGetTask.m_fCallback, m_oGetTask.m_oParam);
            }
            catch
            {
                m_oGetTask.DisposeAndCallback();
            }
        }
        public TaskQueueData GetTaskEnd(IAsyncResult ar)
        {
            TaskQueueData oTaskQueueDate = null;
            if (ErrorTypes.NoError == m_oGetTask.m_eError)
            {
                try
                {
                    if (null != m_oGetTask.m_delegateGetter)
                    {
                        oTaskQueueDate = m_oGetTask.m_delegateGetter.EndInvoke(ar);
                    }
                    m_oGetTask.Close();
                }
                catch
                {
                    m_oGetTask.Dispose();
                }
            }
            return oTaskQueueDate;
        }
        public ErrorTypes RemoveTask(object key)
        {
            ErrorTypes eResult = ErrorTypes.Unknown;
            try
            {
                SQSDataKey oSQSDataKey = (SQSDataKey)key;
                string strUrlQueue = GetQueueUrl(oSQSDataKey.m_oPriority);

                using (Amazon.SQS.AmazonSQS oSQSClient = Amazon.AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    Amazon.SQS.Model.DeleteMessageRequest oDeleteRequest = new Amazon.SQS.Model.DeleteMessageRequest();
                    oDeleteRequest.QueueUrl = strUrlQueue;
                    oDeleteRequest.ReceiptHandle = (string)oSQSDataKey.m_strReceiptHandle;

                    oSQSClient.DeleteMessage(oDeleteRequest);
                    eResult = ErrorTypes.NoError;
                }
            }
            catch (Amazon.SQS.AmazonSQSException)
            {
            }
            catch
            {
            }

            return eResult;
        }
        public void RemoveTaskBegin(object key, AsyncCallback fCallback, object oParam)
        {
            m_oRemoveTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oRemoveTask.m_delegateRemover = RemoveTask;
                m_oRemoveTask.m_delegateRemover.BeginInvoke(key, fCallback, oParam);
            }
            catch
            {
                m_oRemoveTask.DisposeAndCallback();
            }
        }
        public ErrorTypes RemoveTaskEnd(IAsyncResult ar)
        {
            if (ErrorTypes.NoError == m_oRemoveTask.m_eError)
            {
                try
                {
                    m_oRemoveTask.m_delegateRemover.EndInvoke(ar);
                    m_oRemoveTask.Close();
                }
                catch
                {
                    m_oRemoveTask.Dispose();
                }
            }
            return ErrorTypes.NoError;
        }
    }
}