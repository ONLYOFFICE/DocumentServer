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
using System.IO;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Configuration;
using System.Net;
using System.Xml.Serialization;

using ASC.Common.Data;
using ASC.Common.Data.Sql;
using ASC.Common.Data.Sql.Expressions;

using Enyim.Caching;
using Enyim.Caching.Configuration;
using Enyim.Caching.Memcached;

namespace FileConverterUtils2
{
    class TaskResultCachedDB : ITaskResultInterface
    {
        private static int mc_nRandomMaxNumber = 10000;
        private static System.Random m_oRandom = new System.Random();
        private string m_sConnectionString = ConfigurationManager.AppSettings["utils.taskresult.db.connectionstring"];
        private TimeSpan m_oTtl = TimeSpan.Parse(ConfigurationManager.AppSettings["utils.taskresult.cacheddb.ttl"] ?? "0.00:15:00");

        private TaskResultDataBase m_oTaskResultDB = new TaskResultDataBase();
        MemcachedClientConfiguration m_oMcConfig = null;

        private delegate IDataReader ExecuteReader();
        private delegate int ExecuteNonQuery();
        private delegate ErrorTypes DelegateAdd(string sKey, TaskResultData oTast);
        private delegate ErrorTypes DelegateUpdate(string sKey, TaskResultDataToUpdate oTast);
        private delegate ErrorTypes DelegateGet(string sKey, out TaskResultData oTaskResultData);
        private delegate ErrorTypes DelegateGetBegin(string sKey, AsyncCallback fCallback, object oParam);
        private delegate ErrorTypes DelegateRemove(string sKey);

        private delegate ErrorTypes DelegateAddToMC(string sKey, TaskResultData oTast);

        private class TransportClass : TransportClassAsyncOperation
        {

            public ExecuteReader m_delegateReader = null;
            public ExecuteNonQuery m_delegateNonQuery = null;
            public DelegateGet m_delegateGet = null;
            
            public TaskResultData m_oTast = null;
            public ErrorTypes m_eError = ErrorTypes.NoError;
            public bool m_bCreate = false;
            public string m_sKey = null;
            public bool m_bReadFromDB = false;
            public TransportClass(AsyncCallback fCallback, object oParam)
                : base(fCallback, oParam)
            {
            }
            public override void Close()
            {
                
            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.TaskResult;
                try
                {
                    
                }
                catch
                {
                }
            }
        }
        private TransportClass m_oAddRandomKey = null;
        private TransportClass m_oGetOrCreate = null;
        
        private TransportClass m_oGet = null;

        public TaskResultCachedDB()
        {
            InitMC();
        }
        private void InitMC()
        {
            if (null == m_oMcConfig)
            {
                m_oMcConfig = new MemcachedClientConfiguration();

                string sServerName = ConfigurationManager.AppSettings["utils.taskresult.cacheddb.mc.server"] ?? "localhost:11211";

                m_oMcConfig.AddServer(sServerName);
                m_oMcConfig.Protocol = MemcachedProtocol.Text;
            }
        }
        public ErrorTypes Add(string sKey, TaskResultData oTast)
        {
            AddToMC(sKey, oTast);

            return m_oTaskResultDB.Add(sKey, oTast);
        }
        public void AddBegin(string sKey, TaskResultData oTast, AsyncCallback fCallback, object oParam)
        {
            DelegateAdd oDelegateAdd = new DelegateAdd(AddToMC);

            oDelegateAdd.BeginInvoke(sKey, oTast, null, null);

            m_oTaskResultDB.AddBegin(sKey, oTast, fCallback, oParam);
        }
        public ErrorTypes AddEnd(IAsyncResult ar)
        {
            return m_oTaskResultDB.AddEnd(ar);
        }
        public ErrorTypes AddRandomKey(string sKey, TaskResultData oTastToAdd, out TaskResultData oTastAdded)
        {
            return m_oTaskResultDB.AddRandomKey(sKey, oTastToAdd, out oTastAdded);
        }
        public void AddRandomKeyBegin(string sKey, TaskResultData oTastToAdd, AsyncCallback fCallback, object oParam)
        {
            
            m_oTaskResultDB.AddRandomKeyBegin(sKey, oTastToAdd, fCallback, oParam);
        }
        public ErrorTypes AddRandomKeyEnd(IAsyncResult ar, out TaskResultData oTast)
        {

            return m_oTaskResultDB.AddRandomKeyEnd(ar, out oTast);
        }
        public ErrorTypes Update(string sKey, TaskResultDataToUpdate oTast)
        {
            ErrorTypes oError = ErrorTypes.NoError;

            UpdateInMC(sKey, oTast);

            return oError;
        }
        public void UpdateBegin(string sKey, TaskResultDataToUpdate oTast, AsyncCallback fCallback, object oParam)
        {
            m_oTaskResultDB.UpdateBegin(sKey, oTast, fCallback, oParam);

        }
        public ErrorTypes UpdateEnd(IAsyncResult ar)
        {
            return m_oTaskResultDB.UpdateEnd(ar);
        }
        public ErrorTypes Get(string sKey, out TaskResultData oTaskResultData)
        {
            oTaskResultData = null;
            ErrorTypes oError = ErrorTypes.NoError;
            try
            {
                GetFromMC(sKey, out oTaskResultData);

                if (null == oTaskResultData)
                {
                    oError = m_oTaskResultDB.Get(sKey, out oTaskResultData);
                    if (oError == ErrorTypes.NoError && oTaskResultData != null)
                    {
                        AddToMC(sKey, oTaskResultData);
                    }
                }
            }
            catch
            {
                oError = ErrorTypes.TaskResult;
            }

            return oError;
        }
        public void GetBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            m_oGet = new TransportClass(fCallback, oParam);
            try
            {
                m_oGet.m_sKey = sKey;
                m_oGet.m_delegateGet = new DelegateGet(GetFromMC);
                m_oGet.m_delegateGet.BeginInvoke(sKey, out m_oGet.m_oTast, GetCallback, null);
            }
            catch 
            {
                m_oGet.DisposeAndCallback();
            }
        }
        public ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData oTast)
        {
            oTast = null;
            if (m_oGet.m_eError == ErrorTypes.NoError)
            {
                try
                {
                    if (m_oGet.m_bReadFromDB)
                    {
                        m_oTaskResultDB.GetEnd(ar, out oTast);
                        DelegateAddToMC oDelegateAdd = new DelegateAddToMC(AddToMC);
                        oDelegateAdd.BeginInvoke(m_oGet.m_sKey, oTast, null, null);
                    }
                    else if (m_oGet.m_oTast != null)
                        oTast = m_oGet.m_oTast.Clone();

                }
                catch
                {
                    m_oGet.m_eError = ErrorTypes.TaskResult;
                }
            }
            return m_oGet.m_eError;
        }
        public ErrorTypes GetExpired(int nMaxCount, out List<TaskResultData> aTasts) 
        {
            return m_oTaskResultDB.GetExpired(nMaxCount, out aTasts);
        }
        public ErrorTypes GetOrCreate(string sKey, TaskResultData oDefaultTast, out TaskResultData oTaskResultData, out bool bCreate)
        {
            return m_oTaskResultDB.GetOrCreate(sKey, oDefaultTast, out oTaskResultData, out bCreate);
        }
        public void GetOrCreateBegin(string sKey, TaskResultData oDataToAdd, AsyncCallback fCallback, object oParam)
        {
            m_oGetOrCreate = new TransportClass(fCallback, oParam);
            m_oGetOrCreate.m_oTast = oDataToAdd;
            m_oGetOrCreate.m_bCreate = true;
            m_oGetOrCreate.m_sKey = sKey;
            try
            {
                TaskResultData oTast = null;
                m_oGetOrCreate.m_delegateGet = new DelegateGet(GetFromMC);
                m_oGetOrCreate.m_delegateGet.BeginInvoke(sKey, out oTast, GetOrCreateCallback, null);
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
                    if (m_oGetOrCreate.m_bReadFromDB)
                    {
                        m_oTaskResultDB.GetOrCreateEnd(ar, out oDataAdded, out bCreate);
                        if (oDataAdded != null)
                        {
                            DelegateAddToMC oDelegateAddToMC = new DelegateAddToMC(AddToMC);
                            oDelegateAddToMC.BeginInvoke(m_oGetOrCreate.m_sKey, oDataAdded, null, null);
                        }
                    }
                    else if (null != m_oGetOrCreate.m_oTast)
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
            RemoveFromMC(sKey);
            return m_oTaskResultDB.Remove(sKey);
        }
        public void RemoveBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            DelegateRemove oDelegateRemove = new DelegateRemove(RemoveFromMC);
            oDelegateRemove.BeginInvoke(sKey, null, null);
            m_oTaskResultDB.RemoveBegin(sKey, fCallback, oParam);
        }
        public ErrorTypes RemoveEnd(IAsyncResult ar)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oTaskResultDB.RemoveEnd(ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.TaskResult;
            }
            return eErrorTypes;
        }
        private ErrorTypes AddToMC(string sKey, TaskResultData oTast)
        {
            return AddToMCWithCas(sKey, oTast, 0);
        }
        private ErrorTypes AddToMCWithCas(string sKey, TaskResultData oTast, ulong cas)
        {
            ErrorTypes oError = ErrorTypes.NoError;
            try
            {
                using (MemcachedClient oMc = new MemcachedClient(m_oMcConfig))
                {
                    string sDataToStore = null;

                    XmlSerializer oXmlSerializer = new XmlSerializer(typeof(TaskResultData));
                    using (StringWriter oStringWriter = new StringWriter())
                    {
                        oXmlSerializer.Serialize(oStringWriter, oTast);
                        sDataToStore = oStringWriter.ToString();
                    }

                    if (cas != 0)
                        oMc.Cas(StoreMode.Set, sKey, sDataToStore, m_oTtl, cas);
                    else
                        oMc.Store(StoreMode.Set, sKey, sDataToStore, m_oTtl);
                }
            }
            catch
            {
                oError = ErrorTypes.TaskResult;
            }
                
            return oError;
        }
        private ErrorTypes GetFromMC(string sKey, out TaskResultData oTast)
        {
            ulong cas = 0;
            return GetFromMCWithCas(sKey, out oTast, out cas);
        }
        private ErrorTypes GetFromMCWithCas(string sKey, out TaskResultData oTast, out ulong cas)
        {
            ErrorTypes oError = ErrorTypes.NoError;
            oTast = null;
            cas = 0;
            try
            {
                using (MemcachedClient oMc = new MemcachedClient(m_oMcConfig))
                {
                    CasResult<string> oGetData = oMc.GetWithCas<string>(sKey);

                    if (oGetData.Result != null)
                    {
                        cas = oGetData.Cas;

                        XmlSerializer oXmlSerializer = new XmlSerializer(typeof(TaskResultData));
                        using (StringReader oStringReader = new StringReader(oGetData.Result))
                        {
                            oTast = (TaskResultData)oXmlSerializer.Deserialize(oStringReader);
                        }
                    }
                }
            }
            catch
            {
                oError = ErrorTypes.TaskResult;
            }

            return oError;
        }
        private ErrorTypes UpdateInMC(string sKey, TaskResultDataToUpdate oTast)
        {
            ErrorTypes oError = ErrorTypes.NoError;
            try
            {
                TaskResultData oTask = null;
                ulong cas = 0;
                GetFromMCWithCas(sKey, out oTask, out cas);

                if (oTask == null)
                    m_oTaskResultDB.Get(sKey, out oTask);

                if (oTask != null && oTask.eStatus != FileStatus.Ok)
                {
                    oTask.Update(oTast);

                    AddToMCWithCas(sKey, oTask, cas);

                    if (oTask.eStatus != FileStatus.Convert)
                        oError = m_oTaskResultDB.Update(sKey, oTast);
                }
            }
            catch
            {
                oError = ErrorTypes.TaskResult;
            }

            return oError;
        }
        private ErrorTypes RemoveFromMC(string sKey)
        {
            ErrorTypes oError = ErrorTypes.NoError;
            try
            {
                using (MemcachedClient oMc = new MemcachedClient(m_oMcConfig))
                {
                    oMc.Remove(sKey);
                }
            }
            catch 
            {
                oError = ErrorTypes.TaskResult;
            }
            return oError;
        }
        private void GetCallback(IAsyncResult ar)
        {
            try
            {
                TaskResultData oTast = null;
                m_oGet.m_eError = m_oGet.m_delegateGet.EndInvoke(out oTast, ar);
                m_oGet.m_delegateGet = null;

                if (oTast != null)
                {
                    m_oGet.m_sKey = null;
                    m_oGet.m_oTast = oTast;
                    m_oGet.FireCallback();
                }
                else
                {
                    m_oGet.m_bReadFromDB = true;
                    m_oTaskResultDB.GetBegin(m_oGet.m_sKey, m_oGet.m_fCallback, m_oGet.m_oParam);
                }
            }
            catch
            {
                m_oGet.DisposeAndCallback();
            }
        }
        private void GetOrCreateCallback(IAsyncResult ar)
        {
            try
            {
                TaskResultData oTaskResult = null;
                m_oGetOrCreate.m_delegateGet.EndInvoke(out oTaskResult, ar);
                m_oGetOrCreate.m_delegateGet = null;

                if (oTaskResult != null)
                {
                    m_oGetOrCreate.m_bCreate = false;
                    m_oGetOrCreate.m_oTast = oTaskResult;
                    m_oGetOrCreate.FireCallback();
                }
                else 
                {
                    m_oGetOrCreate.m_bReadFromDB = true;
                    m_oTaskResultDB.GetOrCreateBegin(m_oGetOrCreate.m_sKey, m_oGetOrCreate.m_oTast, m_oGetOrCreate.m_fCallback, m_oGetOrCreate.m_oParam);
                }
            }
            catch
            {
                m_oGetOrCreate.DisposeAndCallback();
            }
        }
        
    }
}
