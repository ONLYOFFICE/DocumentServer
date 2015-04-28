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

                if (oUpdate.oLastOpenDate.HasValue)
                    this.oLastOpenDate = oUpdate.oLastOpenDate.Value;

                if (oUpdate.nStatusInfo != null)
                    this.nStatusInfo = (int)oUpdate.nStatusInfo;

                if (oUpdate.sFormat != null)
                    this.sFormat = oUpdate.sFormat;

                if (oUpdate.sTitle != null)
                    this.sTitle = oUpdate.sTitle;
            }
        }
        public bool IsValidMask(TaskResultDataToUpdate oMask)
        {
            bool bRes = true;
            if (oMask != null)
            {
                if (oMask.eStatus != null)
                    bRes = bRes && (this.eStatus == oMask.eStatus.Value);

                if (oMask.oLastOpenDate != null)
                    bRes = bRes && (this.oLastOpenDate == oMask.oLastOpenDate.Value);

                if (oMask.nStatusInfo != null)
                    bRes = bRes && (this.nStatusInfo == oMask.nStatusInfo.Value);

                if (oMask.sFormat != null)
                    bRes = bRes && (this.sFormat == oMask.sFormat);

                if (oMask.sTitle != null)
                    bRes = bRes && (this.sTitle == oMask.sTitle);
            }
            return bRes;
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
        ErrorTypes UpdateIf(string sKey, TaskResultDataToUpdate oMask, TaskResultDataToUpdate oTast, out bool bUpdate);
        void UpdateIfBegin(string sKey, TaskResultDataToUpdate oMask, TaskResultDataToUpdate oTast, AsyncCallback fCallback, object oParam);
        ErrorTypes UpdateIfEnd(IAsyncResult ar, out bool bUpdate);
        ErrorTypes Get(string sKey, out TaskResultData oTast);
        void GetBegin(string sKey, AsyncCallback fCallback, object oParam);
        ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData oTast);
        ErrorTypes Get(string[] aKeys, out TaskResultData[] oTast);
        void GetBegin(string[] aKeys, AsyncCallback fCallback, object oParam);
        ErrorTypes GetEnd(IAsyncResult ar, out TaskResultData[] oTast);
        ErrorTypes GetEditing(out TaskResultData[] oTast);
        void GetEditingBegin(AsyncCallback fCallback, object oParam);
        ErrorTypes GetEditingEnd(IAsyncResult ar, out TaskResultData[] oTast);
        ErrorTypes GetExpired( int nMaxCount, out List <TaskResultData> aTasts);
        ErrorTypes GetOrCreate(string sKey, TaskResultData oDataToAdd, out TaskResultData oDataAdded, out bool bCreate);
        void GetOrCreateBegin(string sKey, TaskResultData oDataToAdd, AsyncCallback fCallback, object oParam);
        ErrorTypes GetOrCreateEnd(IAsyncResult ar, out TaskResultData oDataAdded, out bool bCreate);
        ErrorTypes Remove(string sKey);
        void RemoveBegin(string sKey, AsyncCallback fCallback, object oParam);
        ErrorTypes RemoveEnd(IAsyncResult ar);
    }
    public class TaskResult
    {
        public static ITaskResultInterface NewTaskResult()
        {
            ITaskResultInterface piTaskResult = null;
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
            return piTaskResult;
        }
    }
}
