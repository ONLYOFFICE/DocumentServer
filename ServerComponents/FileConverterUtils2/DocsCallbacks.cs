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
    public class DocsCallbacks
    {
        private delegate ErrorTypes DelegateGet(string sKey, out string sUrl);
        private delegate ErrorTypes DelegateRemove(string sKey);
        private DelegateGet m_oGet = null;
        private DelegateRemove m_oRemove = null;
        public ErrorTypes Get(string sKey, out string sUrl)
        {
            sUrl = null;
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
                            if (true == oReader.Read())
                                sUrl = Convert.ToString(oReader["dc_callback"]);
                        }
                    }
                }
            }
            catch
            {
                eErrorTypes = ErrorTypes.Unknown;
            }
            return eErrorTypes;
        }
        public void GetBegin(string sKey, AsyncCallback fCallback, object oParam)
        {
            m_oGet = Get;
            string sUrl;
            m_oGet.BeginInvoke(sKey, out sUrl, fCallback, oParam);
        }
        public ErrorTypes GetEnd(IAsyncResult ar, out string sUrl)
        {
            sUrl = null;
            ErrorTypes eErrorTypes = ErrorTypes.NoError;
            try
            {
                eErrorTypes = m_oGet.EndInvoke(out sUrl, ar);
            }
            catch
            {
                eErrorTypes = ErrorTypes.NoError;
            }
            return eErrorTypes;
        }
        public ErrorTypes Remove(string sKey)
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
                eErrorTypes = ErrorTypes.Unknown;
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
                eErrorTypes = ErrorTypes.Unknown;
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
            return string.Format("SELECT * FROM doc_callbacks WHERE dc_key='{0}'", sKey);
        }
        private string GetDELETEString(string sKey)
        {
            return string.Format("DELETE FROM doc_callbacks WHERE dc_key='{0}';", sKey);
        }
    }
}
