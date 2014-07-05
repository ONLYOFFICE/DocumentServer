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
    [Serializable]
    public class TaskResultData
    {
        
        public string sKey;
        public string sFormat;
        public FileStatus eStatus;
        public int nStatusInfo;
        public DateTime oLastOpenDate;
        public string sTitle;
        public TaskResultData()
        {
            sFormat = "";
            sKey = "";
            eStatus = FileStatus.None;
            nStatusInfo = 0;
            oLastOpenDate = DateTime.UtcNow;
            sTitle = "";
        }
        public TaskResultData Clone()
        {
            TaskResultData oRes = new TaskResultData();
            oRes.sFormat = sFormat;
            oRes.sKey = sKey;
            oRes.eStatus = eStatus;
            oRes.nStatusInfo = nStatusInfo;
            oRes.oLastOpenDate = oLastOpenDate;
            oRes.sTitle = sTitle;
            return oRes;
        }
        public void Update(TaskResultDataToUpdate oUpdate)
        {
            if (oUpdate != null)
            {
                if (oUpdate.eStatus != null)
                    this.eStatus = (FileStatus)oUpdate.eStatus;

                if (oUpdate.oLastOpenDate != null)
                    this.oLastOpenDate = (DateTime)oUpdate.oLastOpenDate;

                if (oUpdate.nStatusInfo != null)
                    this.nStatusInfo = (int)oUpdate.nStatusInfo;

                if (oUpdate.sFormat != null)
                    this.sFormat = oUpdate.sFormat;

                if (oUpdate.sTitle != null)
                    this.sTitle = oUpdate.sTitle;
            }
        }
    }
    public class TaskResultDataToUpdate
    {
        public string sFormat;
        public FileStatus? eStatus;
        public int? nStatusInfo;
        public DateTime? oLastOpenDate;
        public string sTitle;
        public TaskResultDataToUpdate()
        {
        }
    }
    public interface ITaskResultInterface
    {
        ErrorTypes Add(string sKey, TaskResultData oTast);
        void AddBegin(string sKey, TaskResultData oTast, AsyncCallback fCallback, object oParam);
        ErrorTypes AddEnd(IAsyncResult ar);
        ErrorTypes AddRandomKey(string sKey, TaskResultData oTastToAdd, out TaskResultData oTastAdded);
        void AddRandomKeyBegin(string sKey, TaskResultData oTastToAdd, AsyncCallback fCallback, object oParam);
        ErrorTypes AddRandomKeyEnd(IAsyncResult ar, out TaskResultData oTastAdded);
        ErrorTypes Update(string sKey, TaskResultDataToUpdate oTast);
        void UpdateBegin(string sKey, TaskResultDataToUpdate oTast, AsyncCallback fCallback, object oParam);
        ErrorTypes UpdateEnd(IAsyncResult ar);
        ErrorTypes Get(string sKey, out TaskResultData oTast);
        void GetBegin(string sKey, AsyncCallback fCallback, object oParam);
        ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData oTast);
        ErrorTypes GetExpired( int nMaxCount, out List <TaskResultData> aTasts);
        ErrorTypes GetOrCreate(string sKey, TaskResultData oDataToAdd, out TaskResultData oDataAdded, out bool bCreate);
        void GetOrCreateBegin(string sKey, TaskResultData oDataToAdd, AsyncCallback fCallback, object oParam);
        ErrorTypes GetOrCreateEnd(IAsyncResult ar, out TaskResultData oDataAdded, out bool bCreate);
        ErrorTypes Remove(string sKey);
        void RemoveBegin(string sKey, AsyncCallback fCallback, object oParam);
        ErrorTypes RemoveEnd(IAsyncResult ar);
    }
    public class TaskResult : ITaskResultInterface
    {
        private ITaskResultInterface piTaskResult;
        public TaskResult()
        {
            string sTaskResultImpl = ConfigurationManager.AppSettings["utils.taskresult.impl"];
            switch (sTaskResultImpl)
            {
                case "cacheddb":
                    piTaskResult = new TaskResultCachedDB();
                    break;

                case "db":
                default:
                    piTaskResult = new TaskResultDataBase();
                    break;
            }
        }
        public ErrorTypes Add(string sKey, TaskResultData oTast)
        {
            return piTaskResult.Add(sKey, oTast);
        }
        public void AddBegin(string sKey, TaskResultData oTast, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.AddBegin(sKey, oTast, fCallback, oParam);
        }
        public ErrorTypes AddEnd(IAsyncResult ar)
        {
            return piTaskResult.AddEnd(ar);
        }
        public ErrorTypes AddRandomKey(string sKey, TaskResultData oTastToAdd, out TaskResultData oTastAdded)
        {
            return piTaskResult.AddRandomKey(sKey, oTastToAdd, out oTastAdded);
        }
        public void AddRandomKeyBegin(string sKey, TaskResultData oTastToAdd, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.AddRandomKeyBegin(sKey, oTastToAdd, fCallback, oParam);
        }
        public ErrorTypes AddRandomKeyEnd(IAsyncResult ar, out TaskResultData oTastAdded)
        {
            return piTaskResult.AddRandomKeyEnd(ar, out oTastAdded);
        }
        public ErrorTypes Update(string sKey, TaskResultDataToUpdate oTast)
        {
            return piTaskResult.Update(sKey, oTast);
        }
        public void UpdateBegin(string sKey, TaskResultDataToUpdate oTast, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.UpdateBegin(sKey, oTast, fCallback, oParam);
        }
        public ErrorTypes UpdateEnd(IAsyncResult ar)
        {
            return piTaskResult.UpdateEnd(ar);
        }
        public ErrorTypes Get(string sKey, out TaskResultData oTast)
        {
            return piTaskResult.Get(sKey, out oTast);
        }
        public void GetBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.GetBegin(sKey, fCallback, oParam);
        }
        public ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData oTast)
        {
            return piTaskResult.GetEnd(ar, out oTast);
        }
        public ErrorTypes GetExpired(int nMaxCount, out List<TaskResultData> aTasts)
        {
            return piTaskResult.GetExpired(nMaxCount, out aTasts);
        }
        public ErrorTypes GetOrCreate(string sKey, TaskResultData oDataToAdd, out TaskResultData oDataAdded, out bool bCreate)
        {
            return piTaskResult.GetOrCreate(sKey, oDataToAdd, out oDataAdded, out bCreate);
        }
        public void GetOrCreateBegin(string sKey, TaskResultData oDataToAdd, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.GetOrCreateBegin(sKey, oDataToAdd, fCallback, oParam);
        }
        public ErrorTypes GetOrCreateEnd(IAsyncResult ar, out TaskResultData oDataAdded, out bool bCreate)
        {
            return piTaskResult.GetOrCreateEnd(ar, out oDataAdded, out bCreate);
        }
        public ErrorTypes Remove(string sKey)
        {
            return piTaskResult.Remove(sKey);
        }
        public void RemoveBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            piTaskResult.RemoveBegin(sKey, fCallback, oParam);
        }
        public ErrorTypes RemoveEnd(IAsyncResult ar)
        {
            return piTaskResult.RemoveEnd(ar);
        }
    }
}
