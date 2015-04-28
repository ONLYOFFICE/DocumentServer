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
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Caching;
using System.Web.Script.Serialization;
using System.Security.Cryptography;

using ASC.Common.Data;

namespace FileConverterUtils2
{
    public class FileStatistic
    {
        private string m_sConnectionString = ConfigurationManager.AppSettings["utils.filestatistic.db.connectionstring"];
        private IDbConnection GetDbConnection(string connectionStringName)
        {
            var cs = ConfigurationManager.ConnectionStrings[connectionStringName];
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
        public bool insert(string sAffiliateID, string sFileName, DateTime dtTime, string sTag)
        {
            
            bool bResult = true;
            string sInsertSQL = string.Format("INSERT INTO file_statistic2 (fsc_affiliate, fsc_filename, fsc_time, fsc_tag) VALUES ('{0}', '{1}', '{2}', '{3}')",
                sAffiliateID, Utils.MySqlEscape(sFileName, m_sConnectionString), dtTime.ToString(Constants.mc_sDateTimeFormat), sTag);

            using (IDbConnection sqlCon = GetDbConnection(m_sConnectionString))
            {
                try
                {
                    sqlCon.Open();

                    using (IDbCommand oInsertCommand = sqlCon.CreateCommand())
                    {
                        oInsertCommand.CommandText = sInsertSQL;
                        oInsertCommand.ExecuteNonQuery();
                    }
                }
                catch
                {
                    bResult = false;
                }
            }
            return bResult;

        }
    }

    public static class Signature
    {
        private const double mc_dKeyDateEpsilon = 300;

        public static string Create<T>(T obj, string secret)
        {
            var serializer = new JavaScriptSerializer();
            var str = serializer.Serialize(obj);
            var payload = GetHashBase64(str + secret) + "?" + str;
            return HttpServerUtility.UrlTokenEncode(Encoding.UTF8.GetBytes(payload));
        }

        private static string GetHashBase64(string str)
        {
            return Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(str)));
        }

        private static string GetHashBase64MD5(string str)
        {
            return Convert.ToBase64String(MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(str)));
        }

        private static T Read<T>(string signature, string secret, bool bUseSecret)
        {
            try
            {
                var payloadParts = Encoding.UTF8.GetString(HttpServerUtility.UrlTokenDecode(signature)).Split('?');
                if (false == bUseSecret || (GetHashBase64(payloadParts[1] + secret) == payloadParts[0]) || (GetHashBase64MD5(payloadParts[1] + secret) == payloadParts[0]))
                {
                    
                    return new JavaScriptSerializer().Deserialize<T>(payloadParts[1]);
                }
            }
            catch (Exception)
            {

            }
            return default(T);
        }

        public static ErrorTypes isAccept(string strVKey, string strCurrentKey, bool bCheckIP, string strCurrentIp)
        {
            try
            {
                string strKeyId = null;
                System.Collections.Generic.Dictionary<string, object> arrElements = null;
                ASC.Core.Billing.PaymentOffice oPaymentOffice = null;
                try
                {
                    getVKeyStringParam(strVKey, ConfigurationSettings.AppSettings["keyKeyID"], out strKeyId);

                    oPaymentOffice = getPaymentOffice(strKeyId);
                    var vElement = Read<object>(strVKey, oPaymentOffice.Key2, true);
                    if (null == vElement)
                        return ErrorTypes.VKeyEncrypt;
                    arrElements = (System.Collections.Generic.Dictionary<string, object>)vElement;
                }
                catch
                {
                    return ErrorTypes.VKeyEncrypt;
                }
                object objValue = null;

                DateTime oDateTimeNow = DateTime.UtcNow;

                if (false == ( (oDateTimeNow - oPaymentOffice.EndDate).TotalSeconds < mc_dKeyDateEpsilon))
                    return ErrorTypes.VKeyKeyExpire;

                int nUserCount = 0;
                
                arrElements.TryGetValue(ConfigurationSettings.AppSettings["keyUserCount"], out objValue);

                if (null != objValue)
                    nUserCount = (int)objValue;

                if (nUserCount > oPaymentOffice.UsersCount)
                    return ErrorTypes.VKeyUserCountExceed;

                if (bCheckIP)
                {
                    arrElements.TryGetValue(ConfigurationSettings.AppSettings["keyIp"], out objValue);
                    if (null == objValue)
                        return ErrorTypes.VKey;
                    string strUserIp = (string)objValue;
                    if (strCurrentIp != strUserIp)
                        return ErrorTypes.VKey;
                }

                arrElements.TryGetValue(ConfigurationSettings.AppSettings["keyKey"], out objValue);
                if (null == objValue)
                    return ErrorTypes.VKey;
                string strKey = (string)objValue;

                if (strCurrentKey.Length > strKey.Length)
                {
                    int nIndexStartFormat = strCurrentKey.LastIndexOf(".");
                    if (-1 != nIndexStartFormat)
                        strCurrentKey = strCurrentKey.Substring(0, nIndexStartFormat);
                }

                if (strKey != strCurrentKey && strKey + "_temp" != strCurrentKey)
                    return ErrorTypes.VKey;

                arrElements.TryGetValue(ConfigurationSettings.AppSettings["keyDate"], out objValue);
                if (null != objValue)
                {
                    DateTime oDateTimeKey = (DateTime)objValue;
                    DateTime oDateTimeKeyAddHour = oDateTimeKey; 
                    oDateTimeKeyAddHour = oDateTimeKeyAddHour.AddHours(double.Parse(ConfigurationSettings.AppSettings["keyDateInterval"] ?? "1", Constants.mc_oCultureInfo));

                    if ((oDateTimeKey - oDateTimeNow).TotalSeconds > mc_dKeyDateEpsilon)
                        return ErrorTypes.VKeyTimeIncorrect;

                    if( mc_dKeyDateEpsilon < (oDateTimeNow - oDateTimeKeyAddHour).TotalSeconds)
                        return ErrorTypes.VKeyTimeExpire;
            	}
            }
            catch { return ErrorTypes.VKey; }
            return ErrorTypes.NoError;
        }
        public static void getVKeyParams(string strVKey, out bool bPaid)
        {
            bPaid = true;
            try
            {
                string strKeyId = null;
                getVKeyStringParam(strVKey, ConfigurationSettings.AppSettings["keyKeyID"], out strKeyId);

                ASC.Core.Billing.PaymentOffice oPaymentOffice = getPaymentOffice(strKeyId);

                var vElement = Read<object>(strVKey, oPaymentOffice.Key2, true);
                if (null == vElement)
                    return;
                System.Collections.Generic.Dictionary<string, object> arrElements = (System.Collections.Generic.Dictionary<string, object>)vElement;
                object objValue = null;
                arrElements.TryGetValue(ConfigurationSettings.AppSettings["keyPaid"], out objValue);
                if (null == objValue)
                    return;
                bPaid = (bool)objValue;
            }
            catch { }
        }
        public static void getVKeyStringParam(string strVKey, string strParamName, out string strParam)
        {
            strParam = null;
            try
            {
                var vElement = Read<object>(strVKey, null, false);
                if (null == vElement)
                    return;
                System.Collections.Generic.Dictionary<string, object> arrElements = (System.Collections.Generic.Dictionary<string, object>)vElement;
                object objValue = null;
                arrElements.TryGetValue(strParamName, out objValue);
                if (null == objValue)
                    return;
                strParam = (string)objValue;
            }
            catch { }
        }

        public static ASC.Core.Billing.PaymentOffice getPaymentOffice(string strKeyId)
        {
            ASC.Core.Billing.PaymentOffice oPaymentOffice = null;
            Cache oCache = HttpRuntime.Cache;
            object oCacheVal = oCache.Get(strKeyId);
            if (null == oCacheVal)
            {
                ASC.Core.Billing.BillingClient oBillingClient = new ASC.Core.Billing.BillingClient();
                oPaymentOffice = oBillingClient.GetPaymentOffice(strKeyId);
                string sWebCacheExpireSeconds = ConfigurationSettings.AppSettings["WebCacheExpireSeconds"];
                oCache.Add(strKeyId, oPaymentOffice, null, DateTime.Now.AddSeconds(int.Parse(sWebCacheExpireSeconds)), Cache.NoSlidingExpiration, CacheItemPriority.Normal, null);
            }
            else
                oPaymentOffice = oCacheVal as ASC.Core.Billing.PaymentOffice;
            return oPaymentOffice;
        }
    }
}
