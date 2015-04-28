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
using System.Linq;
using System.Text;
using System.Data;
using System.Configuration;

namespace FileConverterUtils2
{
    public class DocsChange
    {
        public string data;
        public string userid;
    }
    public class DocsChanges
    {
        private delegate ErrorTypes DelegateRemove(string sKey);
        private DelegateRemove m_oRemove = null;
        public ErrorTypes GetChanges(string sKey, out List<DocsChange> aChanges)
        {
            aChanges = new List<DocsChange>();
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
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
                            while (true == oReader.Read())
                            {
                                DocsChange oDocsChange = new DocsChange();
                                oDocsChange.data = Convert.ToString(oReader["dc_data"]);
                                oDocsChange.userid = Convert.ToString(oReader["dc_user_id_original"]);
                                aChanges.Add(oDocsChange);
                            }
                        }
                    }
                }
            }
            catch
            {
                eErrorTypes = ErrorTypes.EditorChanges;
            }
            return eErrorTypes;
        }
        public ErrorTypes RemoveChanges(string sKey)
        {
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                using (IDbConnection sqlCon = GetDbConnection())
                {
                    sqlCon.Open();
                    using (IDbCommand oSelCommand = sqlCon.CreateCommand())
                    {
                        oSelCommand.CommandText = GetDELETEString(sKey);
                        oSelCommand.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                eErrorTypes = ErrorTypes.EditorChanges;
            }
            return eErrorTypes;
        }
        public void RemoveChangesBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            m_oRemove = RemoveChanges;
            m_oRemove.BeginInvoke(sKey, fCallback, oParam);
        }
        public ErrorTypes RemoveChangesEnd(IAsyncResult ar)
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
        private IDbConnection GetDbConnection()
        {
            var cs = ConfigurationManager.ConnectionStrings[ConfigurationManager.AppSettings["utils.taskqueue.db.connectionstring"]];
            var dbProvider = System.Data.Common.DbProviderFactories.GetFactory(cs.ProviderName);
            var connection = dbProvider.CreateConnection();
            connection.ConnectionString = cs.ConnectionString;
            return connection;
        }
        private string GetSELECTString(string sKey)
        {
            return string.Format("SELECT * FROM doc_changes WHERE dc_key='{0}' ORDER BY dc_change_id ASC;", sKey);
        }
        private string GetDELETEString(string sKey)
        {
            return string.Format("DELETE FROM doc_changes WHERE dc_key='{0}';", sKey);
        }
    }
}
