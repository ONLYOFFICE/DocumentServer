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
using System.Data;
using System.Configuration;

using ASC.Common.Data;
using ASC.Common.Data.Sql;
using ASC.Common.Data.Sql.Expressions;

namespace FileConverterUtils2
{
    class TaskResultDataBase : ITaskResultInterface
    {
        private static int mc_nRandomMaxNumber = 10000;
        private static System.Random m_oRandom = new System.Random();
        private string m_sConnectionString = ConfigurationManager.AppSettings["utils.taskresult.db.connectionstring"];

        private delegate IDataReader ExecuteReader();
        private delegate int ExecuteNonQuery();
        private delegate ErrorTypes DelegateAdd(string sKey, TaskResultData oTast);
        private delegate ErrorTypes DelegateUpdate(string sKey, TaskResultDataToUpdate oTast);
        private delegate ErrorTypes DelegateGet(string sKey, out TaskResultData oTaskResultData);
        private delegate ErrorTypes DelegateRemove(string sKey);

        private class TransportClass : TransportClassAsyncOperation
        {
            public ExecuteReader m_delegateReader = null;
            public ExecuteNonQuery m_delegateNonQuery = null;
            public IDbConnection m_oSqlCon = null;
            public IDbCommand m_oCommand = null;
            public TaskResultData m_oTast = null;
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public bool m_bCreate = false;
            public TransportClass(AsyncCallback fCallback, object oParam)
                : base(fCallback, oParam)
            {
            }
            public override void Close()
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
            public override void Dispose()
            {
                m_eError = ErrorTypes.TaskResult;
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
        private TransportClass m_oAddRandomKey = null;
        private TransportClass m_oGetOrCreate = null;
        private DelegateAdd m_oAdd = null;
        private DelegateUpdate m_oUpdate = null;
        private DelegateGet m_oGet = null;
        private DelegateRemove m_oRemove = null;

        public ErrorTypes Add(string sKey, TaskResultData oTast)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetINSERTString(oTast);
                        oSelCommand.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                eError = ErrorTypes.TaskResult;
            }
            return eError;
        }
        public void AddBegin(string sKey, TaskResultData oTast, AsyncCallback fCallback, object oParam)
        {
            DelegateAdd oDelegateAdd = new DelegateAdd(Add);
            m_oAdd = oDelegateAdd;
            oDelegateAdd.BeginInvoke(sKey, oTast, fCallback, oParam);
        }
        public ErrorTypes AddEnd(IAsyncResult ar)
        {
            ErrorTypes eError = ErrorTypes.NoError;
            try
            {
                eError = m_oAdd.EndInvoke(ar);
            }
            catch
            {
                eError = ErrorTypes.TaskResult;
            }
            return eError;
        }
        public ErrorTypes AddRandomKey(string sKey, TaskResultData oTastToAdd, out TaskResultData oTastAdded)
        {
            ErrorTypes eError = ErrorTypes.TaskResult;
            oTastAdded = oTastToAdd.Clone();
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    while (true)
                    {
                        string sNewKey = sKey + "_" + m_oRandom.Next(mc_nRandomMaxNumber);
                        oTastAdded.sKey = sNewKey;
                        using (IDbCommand oAddCommand = sqlCon.CreateCommand())
                        {
                            oAddCommand.CommandText = GetINSERTString(oTastAdded);
                            bool bExist = false;
                            try
                            {
                                oAddCommand.ExecuteNonQuery();
                            }
                            catch
                            {
                                bExist = true;
                            }
                            if (false == bExist)
                            {
                                eError = ErrorTypes.NoError;
                                break;
                            }
                        }
                    }
                }
            }
            catch
            {
                eError = ErrorTypes.TaskResult;
            }
            if (ErrorTypes.NoError != eError)
            {
                oTastAdded = null;
            }
            return eError;
        }
        public void AddRandomKeyBegin(string sKey, TaskResultData oTastToAdd, AsyncCallback fCallback, object oParam)
        {
            m_oAddRandomKey = new TransportClass(fCallback, oParam);
            m_oAddRandomKey.m_oTast = oTastToAdd.Clone();
            try
            {
                m_oAddRandomKey.m_oSqlCon = GetDbConnection();
                m_oAddRandomKey.m_oSqlCon.Open();
                string sNewKey = sKey + "_" + m_oRandom.Next(mc_nRandomMaxNumber);
                m_oAddRandomKey.m_oTast.sKey = sNewKey;
                IDbCommand oSelCommand = m_oAddRandomKey.m_oSqlCon.CreateCommand();
                m_oAddRandomKey.m_oCommand = oSelCommand;
                oSelCommand.CommandText = GetINSERTString(m_oAddRandomKey.m_oTast);
                m_oAddRandomKey.m_delegateNonQuery = new ExecuteNonQuery(oSelCommand.ExecuteNonQuery);
                m_oAddRandomKey.m_delegateNonQuery.BeginInvoke(AddRandomKeyCallback, null);
            }
            catch
            {
                m_oAddRandomKey.DisposeAndCallback();
            }
        }
        public ErrorTypes AddRandomKeyEnd(IAsyncResult ar, out TaskResultData oTast)
        {
            oTast = null;
            if (ErrorTypes.NoError == m_oAddRandomKey.m_eError)
            {
                oTast = m_oAddRandomKey.m_oTast;
            }
            return m_oAddRandomKey.m_eError;
        }
        public ErrorTypes Update(string sKey, TaskResultDataToUpdate oTast)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetUPDATEString(sKey, oTast);
                        oSelCommand.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                eErrorTypes = ErrorTypes.TaskResult;
            }
            return eErrorTypes;
        }
        public void UpdateBegin(string sKey, TaskResultDataToUpdate oTast, AsyncCallback fCallback, object oParam)
        {
            m_oUpdate = Update;
            m_oUpdate.BeginInvoke(sKey, oTast, fCallback, oParam);
        }
        public ErrorTypes UpdateEnd(IAsyncResult ar)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oUpdate.EndInvoke(ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.TaskResult;
            }
            return eErrorTypes;
        }
        public ErrorTypes Get(string sKey, out TaskResultData oTaskResultData)
        {
            ErrorTypes eErrorTypes = ErrorTypes.TaskResult;
            oTaskResultData = null;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetSELECTString(sKey);
                        using (IDataReader oReader = oSelCommand.ExecuteReader())
                        {
                            if (true == oReader.Read())
                            {
                                oTaskResultData = new TaskResultData();
                                TaskResultFromReader(oTaskResultData, oReader);
                                eErrorTypes = ErrorTypes.NoError;
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return eErrorTypes;
        }
        public void GetBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            TaskResultData oTast;
            m_oGet = Get;
            m_oGet.BeginInvoke(sKey, out oTast, fCallback, oParam);
        }
        public ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData oTast)
        {
            oTast = null;
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oGet.EndInvoke(out oTast, ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.TaskResult;
            }
            return eErrorTypes;
        }
        public ErrorTypes GetExpired(int nMaxCount, out List<TaskResultData> aTasts) 
        {
            aTasts = null;
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetSELECTExpiredTasksString(nMaxCount);
                        using (IDataReader oReader = oSelCommand.ExecuteReader())
                        {
                            aTasts = new List<TaskResultData>();
                            while (oReader.Read())
                            {
                                TaskResultData oTaskResultData = new TaskResultData();
                                TaskResultFromReader(oTaskResultData, oReader);
                                aTasts.Add(oTaskResultData);
                                eErrorTypes = ErrorTypes.NoError;
                            }
                        }
                    }
                }
            }
            catch
            { 
            }
            return eErrorTypes;
        }
        public ErrorTypes GetOrCreate(string sKey, TaskResultData oDefaultTast, out TaskResultData oTaskResultData, out bool bCreate)
        {
            ErrorTypes eErrorTypes = ErrorTypes.TaskResult;
            oTaskResultData = null;
            bCreate = false;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    bool bEmptyRead = true;
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetSELECTString(sKey);
                        using (IDataReader oReader = oSelCommand.ExecuteReader())
                        {
                            if (true == oReader.Read())
                            {
                                oTaskResultData = new TaskResultData();
                                TaskResultFromReader(oTaskResultData, oReader);

                                bEmptyRead = false;
                                bCreate = false;
                                eErrorTypes = ErrorTypes.NoError;
                            }
                        }
                    }
                    if (bEmptyRead)
                    {
                        using (IDbCommand oAddCommand = sqlCon.CreateCommand())
                        {
                            oAddCommand.CommandText = GetINSERTString(oDefaultTast);
                            bool bExist = false;
                            try
                            {
                                oAddCommand.ExecuteNonQuery();
                                oTaskResultData = oDefaultTast.Clone();
                                eErrorTypes = ErrorTypes.NoError;
                                bCreate = true;
                            }
                            catch
                            {
                                bExist = true;
                            }
                            if (bExist)
                            {
                                using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                                {
                                    oSelCommand.CommandText = GetSELECTString(sKey);
                                    using (IDataReader oReader = oSelCommand.ExecuteReader())
                                    {
                                        if (true == oReader.Read())
                                        {
                                            oTaskResultData = new TaskResultData();
                                            TaskResultFromReader(oTaskResultData, oReader);

                                            bCreate = false;
                                            eErrorTypes = ErrorTypes.NoError;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return eErrorTypes;
        }
        public void GetOrCreateBegin(string sKey, TaskResultData oDataToAdd, AsyncCallback fCallback, object oParam)
        {
            m_oGetOrCreate = new TransportClass(fCallback, oParam);
            m_oGetOrCreate.m_oTast = oDataToAdd;
            m_oGetOrCreate.m_bCreate = true;
            try
            {
                m_oGetOrCreate.m_oSqlCon = GetDbConnection();
                m_oGetOrCreate.m_oSqlCon.Open();
                IDbCommand oSelCommand = m_oGetOrCreate.m_oSqlCon.CreateCommand();
                oSelCommand.CommandText = GetSELECTString(sKey);
                m_oGetOrCreate.m_oCommand = oSelCommand;
                m_oGetOrCreate.m_delegateReader = new ExecuteReader(oSelCommand.ExecuteReader);
                m_oGetOrCreate.m_delegateReader.BeginInvoke(GetOrCreateCallback, null);
            }
            catch
            {
                m_oGetOrCreate.DisposeAndCallback();
            }
        }
        public ErrorTypes GetOrCreateEnd(IAsyncResult ar, out TaskResultData oDataAdded, out bool bCreate)
        {
            bCreate = m_oGetOrCreate.m_bCreate;
            oDataAdded = null;
            if (ErrorTypes.NoError == m_oGetOrCreate.m_eError)
            {
                try
                {
                    if (null != m_oGetOrCreate.m_delegateReader)
                    {
                        using (IDataReader oReader = m_oGetOrCreate.m_delegateReader.EndInvoke(ar))
                        {
                            if (true == oReader.Read())
                            {
                                m_oGetOrCreate.m_oTast = new TaskResultData();
                                TaskResultFromReader(m_oGetOrCreate.m_oTast, oReader);
                            }
                            else
                                m_oGetOrCreate.m_eError = ErrorTypes.TaskResult;
                        }
                    }
                    m_oGetOrCreate.Close();
                    if (null != m_oGetOrCreate.m_oTast)
                        oDataAdded = m_oGetOrCreate.m_oTast.Clone();
                }
                catch
                {
                    m_oGetOrCreate.Dispose();
                }
            }
            return m_oGetOrCreate.m_eError;
        }
        public ErrorTypes Remove(string sKey)
        {
            ErrorTypes eErrorTypes = ErrorTypes.TaskResult;
            using (IDbConnection sqlCon = GetDbConnection())
            {
                try
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetDELETEString(sKey);
                        oSelCommand.ExecuteNonQuery();
                        eErrorTypes = ErrorTypes.NoError;
                    }
                }
                catch
                {
                }
            }
            return eErrorTypes;
        }
        public void RemoveBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            m_oRemove = Remove;
            m_oRemove.BeginInvoke(sKey, fCallback, oParam);
        }
        public ErrorTypes RemoveEnd(IAsyncResult ar)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oRemove.EndInvoke(ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.TaskResult;
            }
            return eErrorTypes;
        }       
        private void GetOrCreateCallback(IAsyncResult ar)
        {
            try
            {
                bool bEmptyRead = false;
                using (IDataReader oReader = m_oGetOrCreate.m_delegateReader.EndInvoke(ar))
                {
                    if (true == oReader.Read())
                    {
                        m_oGetOrCreate.m_oTast = new TaskResultData();
                        TaskResultFromReader(m_oGetOrCreate.m_oTast, oReader);
                    }
                    else
                        bEmptyRead = true;
                }
                if (null != m_oGetOrCreate.m_oCommand)
                {
                    m_oGetOrCreate.m_oCommand.Dispose();
                    m_oGetOrCreate.m_oCommand = null;
                }
                if (bEmptyRead)
                {
                    IDbCommand oSelCommand = m_oGetOrCreate.m_oSqlCon.CreateCommand();
                    oSelCommand.CommandText = GetINSERTString(m_oGetOrCreate.m_oTast);
                    m_oGetOrCreate.m_oCommand = oSelCommand;
                    m_oGetOrCreate.m_delegateNonQuery = new ExecuteNonQuery(oSelCommand.ExecuteNonQuery);
                    m_oGetOrCreate.m_delegateNonQuery.BeginInvoke(GetOrCreateCallback2, null);
                }
                else
                {
                    m_oGetOrCreate.m_bCreate = false;
                    m_oGetOrCreate.m_delegateReader = null;
                    m_oGetOrCreate.FireCallback();
                }
            }
            catch
            {
                m_oGetOrCreate.DisposeAndCallback();
            }
        }
        private void GetOrCreateCallback2(IAsyncResult ar)
        {
            try
            {
                bool bExist = false;
                try
                {
                    m_oGetOrCreate.m_delegateNonQuery.EndInvoke(ar);
                    m_oGetOrCreate.m_bCreate = true;
                    if (null != m_oGetOrCreate.m_oCommand)
                    {
                        m_oGetOrCreate.m_oCommand.Dispose();
                        m_oGetOrCreate.m_oCommand = null;
                    }
                }
                catch
                {
                    m_oGetOrCreate.m_bCreate = false;
                    bExist = true;
                }
                if (bExist)
                {
                    IDbCommand oSelCommand = m_oGetOrCreate.m_oSqlCon.CreateCommand();
                    oSelCommand.CommandText = GetSELECTString(m_oGetOrCreate.m_oTast.sKey);
                    m_oGetOrCreate.m_oCommand = oSelCommand;
                    m_oGetOrCreate.m_delegateReader = new ExecuteReader(oSelCommand.ExecuteReader);
                    m_oGetOrCreate.m_delegateReader.BeginInvoke(m_oGetOrCreate.m_fCallback, m_oGetOrCreate.m_oParam);
                }
                else
                {
                    m_oGetOrCreate.m_delegateReader = null;
                    m_oGetOrCreate.FireCallback();
                }
            }
            catch
            {
                m_oGetOrCreate.DisposeAndCallback();
            }
        }
        private void AddRandomKeyCallback(IAsyncResult ar)
        {
            try
            {
                bool bExist = false;
                try
                {
                    m_oAddRandomKey.m_delegateNonQuery.EndInvoke(ar);
                    if (null != m_oAddRandomKey.m_oCommand)
                    {
                        m_oAddRandomKey.m_oCommand.Dispose();
                        m_oAddRandomKey.m_oCommand = null;
                    }
                }
                catch
                {
                    bExist = true;
                }
                if(bExist)
                {
                    string sNewKey = m_oAddRandomKey.m_oTast.sKey + "_" + m_oRandom.Next(mc_nRandomMaxNumber);
                    m_oAddRandomKey.m_oTast.sKey = sNewKey;
                    IDbCommand oSelCommand = m_oAddRandomKey.m_oSqlCon.CreateCommand();
                    m_oAddRandomKey.m_oCommand = oSelCommand;
                    oSelCommand.CommandText = GetINSERTString(m_oAddRandomKey.m_oTast);
                    m_oAddRandomKey.m_delegateNonQuery = new ExecuteNonQuery(oSelCommand.ExecuteNonQuery);
                    m_oAddRandomKey.m_delegateNonQuery.BeginInvoke(AddRandomKeyCallback, null);
                }
                else
                {
                    m_oAddRandomKey.Close();
                    m_oAddRandomKey.FireCallback();
                }
            }
            catch
            {
                m_oAddRandomKey.DisposeAndCallback();
            }
        }
        private IDbConnection GetDbConnection()
        {
            var cs = ConfigurationManager.ConnectionStrings[m_sConnectionString];
            var dbProvider = System.Data.Common.DbProviderFactories.GetFactory(cs.ProviderName);
            var connection = dbProvider.CreateConnection();
            connection.ConnectionString = cs.ConnectionString;
            return connection;
        }
        private DbManager GetDbManager(string connectionStringName)
        {
            var cs = ConfigurationManager.ConnectionStrings[connectionStringName];
            if (!DbRegistry.IsDatabaseRegistered(connectionStringName))
            {
                DbRegistry.RegisterDatabase(connectionStringName, cs);
            }
            return new DbManager(connectionStringName);
        }
        private void TaskResultFromReader(TaskResultData oTaskResultData, IDataReader oReader)
        {
            oTaskResultData.sKey = Convert.ToString(oReader["tr_key"]);
            oTaskResultData.sFormat = Convert.ToString(oReader["tr_format"]);
            oTaskResultData.eStatus = (FileStatus)Convert.ToByte(oReader["tr_status"]);
            oTaskResultData.nStatusInfo = Convert.ToInt32(oReader["tr_status_info"]);
            oTaskResultData.oLastOpenDate = Convert.ToDateTime(oReader["tr_last_open_date"]);
            oTaskResultData.sTitle = Convert.ToString(oReader["tr_title"]);
        }
        private string GetINSERTString(TaskResultData oTast)
        {
            return string.Format("INSERT INTO tast_result ( tr_key, tr_format, tr_status, tr_status_info, tr_last_open_date, tr_title ) VALUES ('{0}', '{1}', '{2}' , '{3}', '{4}', '{5}');", oTast.sKey, oTast.sFormat, oTast.eStatus.ToString("d"), oTast.nStatusInfo.ToString(), DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat), Utils.MySqlEscape(oTast.sTitle, m_sConnectionString));
        }
        private string GetUPDATEString(string sKey, TaskResultDataToUpdate oTast)
        {
            List<string> aValues = new List<string>();
            if (false == string.IsNullOrEmpty(oTast.sFormat))
                aValues.Add("tr_format='" + oTast.sFormat + "'");
            if (oTast.eStatus.HasValue)
                aValues.Add("tr_status='" + oTast.eStatus.Value.ToString("d") + "'");
            if (oTast.nStatusInfo.HasValue)
                aValues.Add("tr_status_info='" + oTast.nStatusInfo.Value.ToString() + "'");
            aValues.Add("tr_last_open_date='" + DateTime.UtcNow.ToString(Constants.mc_sDateTimeFormat) + "'");
            if (false == string.IsNullOrEmpty(oTast.sTitle))
                aValues.Add("tr_title='" + Utils.MySqlEscape(oTast.sTitle, m_sConnectionString) + "'");
            return string.Format("UPDATE tast_result SET {0} WHERE tr_key='{1}';", string.Join(",", aValues.ToArray()), sKey);
        }
        private string GetSELECTString(string sKey)
        {
            return string.Format("SELECT * FROM tast_result WHERE tr_key='{0}';", sKey);
        }
        private string GetDELETEString(string sKey)
        {
            return string.Format("DELETE FROM tast_result WHERE tr_key='{0}';", sKey);
        }
        private string GetSELECTExpiredTasksString(int nMaxCount)
        {
            DateTime oDateTimeExpired = DateTime.UtcNow - TimeSpan.Parse(ConfigurationManager.AppSettings["utils.taskresult.ttl"] ?? "7.00:00:00");
            string strDateTimeExpired = oDateTimeExpired.ToString(Constants.mc_sDateTimeFormat);
            return string.Format("SELECT * FROM tast_result WHERE tr_last_open_date <= '{0}' LIMIT {1};", strDateTimeExpired, nMaxCount);
        }
    }
}
