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
using System.Configuration;
using System.Runtime.Serialization;
using System.Threading;
using System.Data;
using log4net;

namespace FileConverterUtils2
{

    class CTaskQueueDataBase : ITaskQueue
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(CTaskQueueDataBase));
        private string m_sConnectionString = ConfigurationManager.AppSettings["utils.taskqueue.db.connectionstring"];
        private const string m_cstrTableName = "convert_queue";

        private TimeSpan m_oRetentionPeriod;
        private TimeSpan m_oVisibilityTimeout;

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
                m_oVisibilityTimeout = TimeSpan.FromSeconds(double.Parse(ConfigurationManager.AppSettings["utils.taskqueue.db.visibility_timeout"] ?? "60"));
                m_oRetentionPeriod = TimeSpan.FromSeconds(double.Parse(ConfigurationManager.AppSettings["utils.taskqueue.db.retention_period"] ?? "600"));
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

                oTask.VisibilityTimeout = m_oVisibilityTimeout;

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
            try
            {
                using (System.Data.IDbConnection dbConnection = GetDbConnection())
                {
                    dbConnection.Open();
                    using (IDbCommand oSelectCommand = dbConnection.CreateCommand())
                    {
                        oSelectCommand.CommandText = GetSelectString();
                        using (System.Data.IDataReader oDataReader = oSelectCommand.ExecuteReader())
                        {
                            
                            while (true == oDataReader.Read())
                            {
                                uint ncq_id = Convert.ToUInt32(oDataReader["cq_id"]);

                                DateTime oTaskCreateTime = Convert.ToDateTime(oDataReader["cq_create_time"]);

                                if (DateTime.UtcNow < (oTaskCreateTime + m_oRetentionPeriod))
                                {
                                    DateTime oTaskUpdateTime = Convert.ToDateTime(oDataReader["cq_update_time"]);

                                    if (TryUpdateTask(ncq_id, oTaskUpdateTime))
                                    {
                                        
                                        oData = TaskQueueData.DeserializeFromXml(Convert.ToString(oDataReader["cq_data"]));
                                        oData.m_oDataKey = ncq_id; 
                                        break;
                                    }
                                }
                                else
                                {

                                    RemoveTask(ncq_id);
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
            }

            return oData;
        }

        private bool TryUpdateTask(uint ncq_id, DateTime oTaskUpdateTime)
        {
            bool bResult = false;
            try
            {
                using (System.Data.IDbConnection dbConnection = GetDbConnection())
                {
                    dbConnection.Open();
                    using (System.Data.IDbCommand oUpdateCommand = dbConnection.CreateCommand())
                    {
                        oUpdateCommand.CommandText = GetUpdateString(ncq_id, oTaskUpdateTime);

                        bResult = (oUpdateCommand.ExecuteNonQuery() > 0);
                    }
                }
            }
            catch
            { 
            }
            return bResult;
        }

        public void GetTaskBegin(AsyncCallback fCallback, object oParam)
        {
            m_GetTask = new TransportClass(fCallback, oParam);
            try
            {
                
                string strSelectSQL = GetSelectString();

                m_GetTask.m_oSqlCon = GetDbConnection();
                m_GetTask.m_oSqlCon.Open();
                IDbCommand oSelCommand = m_GetTask.m_oSqlCon.CreateCommand();
                oSelCommand.CommandText = strSelectSQL;
                m_GetTask.m_oCommand = oSelCommand;
                m_GetTask.m_delegateReader = new ExecuteReader(oSelCommand.ExecuteReader);
                m_GetTask.m_delegateReader.BeginInvoke(GetTaskCallback, null);
            }
            catch(Exception e)
            {
                _log.Error("Exception cathed in GetTaskBegin:", e);
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
                catch(Exception e)
                {
                    _log.Error("Exception cathed in GetTaskEnd:", e);
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
                DateTime oTaskUpdateTime = DateTime.UtcNow;
                bool bIsExist = false;
                using (IDataReader oReader = m_GetTask.m_delegateReader.EndInvoke(ar))
                {
                    
                    if (true == oReader.Read())
                    {
                        ncq_id = Convert.ToUInt32(oReader["cq_id"]);
                        oTaskUpdateTime = Convert.ToDateTime(oReader["cq_update_time"]);

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
                    oUpdateCommand.CommandText = GetUpdateString(ncq_id, oTaskUpdateTime);
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
            catch(Exception e)
            {
                _log.Error("Exception cathed in GetTaskCallback:", e);
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

            DateTime oMinPosibleStartHandleTime = DateTime.UtcNow.Subtract(m_oVisibilityTimeout);

            return string.Format("SELECT * FROM {0} WHERE cq_isbusy <> '{1}' OR cq_update_time <= '{2}' ORDER BY cq_priority DESC;",
                    m_cstrTableName,
                    BusyType.busy.ToString("d"),
                    oMinPosibleStartHandleTime.ToString(Constants.mc_sDateTimeFormat));
        }
        private string GetInsertString(TaskQueueData oTask, Priority ePriority)
        {
            
            string sData = TaskQueueData.SerializeToXml(oTask);

            return string.Format("INSERT INTO {0} " +
                "(cq_data, cq_priority, cq_update_time, cq_create_time, cq_isbusy) " +
                "VALUES ('{1}', '{2}', '{3}', '{3}', '{4}');",
                m_cstrTableName,
                Utils.MySqlEscape(sData, m_sConnectionString),
                ePriority.ToString("d"),
                DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat),
                BusyType.not_busy.ToString("d"));
        }
        private string GetDeleteString(uint nId)
        {
            return "DELETE FROM " + m_cstrTableName + " WHERE cq_id='" + nId.ToString() + "'";
        }
        private string GetUpdateString(uint nCqId, DateTime oTaskUpdateTime)
        {

            return string.Format("UPDATE {0} SET cq_isbusy = '{1}', cq_update_time = '{2}' WHERE (cq_id = '{3}' AND cq_update_time = '{4}');",
                m_cstrTableName,
                BusyType.busy.ToString("d"),
                DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat),
                nCqId,
                oTaskUpdateTime.ToString(Constants.mc_sDateTimeFormat));
        }

    }
}