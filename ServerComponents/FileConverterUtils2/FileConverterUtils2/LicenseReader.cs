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
using System.Linq;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Xml;

namespace FileConverterUtils2
{
    #if !OPEN_SOURCE

    public class LicenseReaderException: Exception
    { 
    }
    public class LicenseReaderNotFoundException : LicenseReaderException
    {
    }
    public class LicenseReaderFormatException : LicenseReaderException
    {
    }
    public class LicenseReaderSigantureException : LicenseReaderException
    {
    }
    public static class LicenseReader
    {

        private static string _copyright = "Copyright TeamLab.com. All Rights Reserved.";

        private static byte[] _public = { 127, 61, 35, 56, 57, 12, 30, 62, 21, 76, 33, 0, 95, 81, 1, 14, 6, 91, 
                                            15, 26, 30, 16, 22, 0, 32, 36, 115, 21, 12, 2, 42, 17, 67, 111, 96, 
                                            38, 33, 81, 55, 30, 80, 33, 97, 21, 27, 51, 52, 0, 15, 82, 45, 69, 
                                            18, 61, 33, 7, 35, 59, 21, 90, 120, 53, 58, 3, 79, 119, 8, 92, 37, 
                                            74, 59, 3, 6, 60, 26, 39, 101, 4, 87, 35, 2, 25, 89, 14, 16, 105, 
                                            20, 40, 7, 54, 56, 95, 30, 1, 58, 22, 28, 36, 82, 2, 37, 48, 19, 
                                            95, 42, 12, 7, 97, 82, 0, 39, 67, 98, 28, 48, 3, 49, 63, 57, 72, 
                                            49, 43, 58, 4, 22, 49, 22, 55, 94, 50, 11, 25, 48, 27, 81, 37, 95, 
                                            53, 65, 24, 15, 11, 94, 35, 21, 42, 95, 41, 88, 40, 89, 25, 53, 95, 
                                            92, 72, 125, 29, 95, 37, 16, 70, 89, 0, 21, 20, 40, 54, 1, 28, 53, 
                                            120, 13, 0, 56, 55, 33, 94, 41, 1, 91, 116, 109, 84, 88, 59, 40, 24, 
                                            40, 84, 55, 87, 6, 107, 23, 36, 41, 30, 70, 27, 15, 35, 61, 2, 70, 
                                            15, 23, 44, 26, 81, 39, 64, 52, 79, 69, 39, 68, 20, 12, 65, 26, 86, 
                                            24, 76, 25, 2, 63, 52, 30, 24, 37, 87, 108, 50, 46, 27, 102, 89, 114,
                                            4, 67, 25, 32, 45, 10, 7, 50, 48, 87, 121, 22, 6, 35, 40, 17, 80, 85,
                                            124, 15, 2, 30, 20, 20, 30, 52, 42, 68, 22, 50, 35, 13, 10, 36, 20, 
                                            50, 66, 12, 33, 88, 28, 108, 44, 24, 62, 19, 101, 14, 85, 33, 53, 52,
                                            73, 37, 85, 49, 43, 68, 32, 14, 81, 94, 38, 41, 68, 8, 16, 16, 43, 
                                            30, 48, 73, 54, 23, 8, 10, 32, 18, 47, 1, 41, 41, 1, 76, 16, 121, 
                                            57, 58, 16, 7, 80, 51, 56, 5, 30, 21, 63, 13, 50, 60, 65, 33, 32, 
                                            38, 107, 14, 8, 5, 15, 56, 70, 37, 45, 63, 82, 53, 4, 2, 33, 45, 
                                            37, 13, 1, 91, 62, 80, 19, 28, 110, 33, 3, 68, 39, 5, 18, 27, 74, 
                                            79, 101, 42, 21, 28, 11, 23, 24, 17, 90, 111, 18, 46, 50, 69, 93, 
                                            44, 31, 24, 27, 78, 49, 11, 21, 83, 112, 78, 48, 125, 34, 36, 8, 
                                            87, 118, 32, 0, 25, 69, 108 };

        public static XmlDocument Read (string path)
        {
            
            byte[] ciphiredXml = File.ReadAllBytes(path);

            return ParseLicenseXml (ciphiredXml);
        }
        private static XmlDocument ParseLicenseXml(byte[] ciphiredXml)
        {
            XmlDocument xmlDoc = null;

            if (null == ciphiredXml)
                throw new ArgumentNullException("ciphiredXml is null");

            string signaturedXml = LicenseUtils.symmetricDecrypt(ciphiredXml, _public);

                string publicKey = makePublicKey(_public, _copyright);

                RSACryptoServiceProvider rsaKey = new RSACryptoServiceProvider();
                rsaKey.PersistKeyInCsp = false;

                rsaKey.FromXmlString(publicKey);

                xmlDoc = new XmlDocument();

                xmlDoc.PreserveWhitespace = true;

                xmlDoc.LoadXml(signaturedXml);

                bool res = LicenseUtils.VerifyXml(xmlDoc, rsaKey);

                rsaKey.Clear();
                rsaKey = null;

                if (!res)
                {
                    throw new LicenseReaderSigantureException();
                }

            return xmlDoc;
        }

        private static string makePublicKey(byte[] unread, string copyright)
        {
            
            int copyrightLength = _copyright.Length;
            int unreadLength = unread.Length;
            int index_unread = 0;
            int index_copyright = 0;

            string result = "";
            while (index_unread < unreadLength)
            {
                int byteCopyright = (int)(Convert.ToByte(_copyright[index_copyright]));
                int byteUnread = (int)unread[index_unread];
                int resultByte = byteUnread ^ byteCopyright;

                result += (char)(resultByte & 0x00FF);

                ++index_unread;
                ++index_copyright;

                if (index_copyright >= copyrightLength)
                    index_copyright = 0;
            }

            return result;
        }
    }

    public static class EditorPermissions
    {
        public const uint PERMISSION_NONE           = 0;    
        public const uint PERMISSION_WRITER         = 1;    
        public const uint PERMISSION_SPREADSHEET    = 2;    
        public const uint PERMISSION_PRESENTATION   = 4;    
        public const uint PERMISSION_ALL = PERMISSION_WRITER | PERMISSION_SPREADSHEET | PERMISSION_PRESENTATION;
    }
    public interface ILicenseReader
    {
        ErrorTypes GetAccessByInfo();

        DateTime getStartDate();
        DateTime getEndDate();
        DateTime getEndDateThreshold();
        
        string getId();
        string getCustomer();
        string getCustomerAddr();
        string getCustomerWww();
        string getCustomerMail();
        string getCustomerInfo();
        string getCustomerLogo();

        uint getPermissions();

        bool isLicenseFound();
        bool isLicenseCorrect();
    }

    public class AllRightsLicenseReader : ILicenseReader
    {
        public ErrorTypes GetAccessByInfo()
        {
            return ErrorTypes.NoError;
        }

        #region Standard license fields getters
        public DateTime getStartDate()
        {
            return DateTime.Now;
        }
        public DateTime getEndDate()
        {
            return DateTime.Now.AddDays(10.0);
        }
        public DateTime getEndDateThreshold()
        {
            return DateTime.Now.AddDays(20.0);
        }

        public string getId()
        {
            return "fake";
        }
        public string getCustomer()
        {
            return "fake_customer";
        }
        public string getCustomerAddr()
        {
            return "fake_addr";
        }
        public string getCustomerWww()
        {
            return "fake_www";
        }
        public string getCustomerMail()
        {
            return "fake_mail";
        }
        public string getCustomerInfo()
        {
            return "fake_info";
        }
        public string getCustomerLogo()
        {
            return "";
        }
        #endregion
        public bool isLicenseFound()
        {
            return true;
        }
        public bool isLicenseCorrect()
        {
            return true;
        }
        public uint getPermissions()
        {
            return EditorPermissions.PERMISSION_ALL;
        }
    }

    public abstract class LicenseReaderBase: ILicenseReader
    {
        protected string _id;

        protected string _license_type;
        protected string _ciphiredXmlPath;

        protected DateTime _startDate;
        protected DateTime _endDate;

        protected string _customer;
        protected string _customer_addr;
        protected string _customer_www;
        protected string _customer_mail;
        protected string _customer_info;
        protected string _customer_logo;

        protected DateTime _endDateThreshold;
        protected bool _correct;
        protected bool _found;

        protected uint _permissions = EditorPermissions.PERMISSION_NONE;

        public LicenseReaderBase(string ciphiredXmlPath)
        {
            
            _startDate = DateTime.Now;
            _endDate = _startDate.AddDays(10.0);
            _endDateThreshold = _endDate.AddDays(1.0);

            _found = false;
            _correct = false;

            try
            {
                _ciphiredXmlPath = ciphiredXmlPath;
                XmlDocument xmlDoc = LicenseReader.Read (ciphiredXmlPath);

                _found = true;

                bool res = FillMembersBase(xmlDoc);
                if (!res)
                {
                    throw new LicenseReaderFormatException();
                }

                _correct = true;
            }
            catch (LicenseReaderSigantureException ex)
            {
                _correct = false;
            }
            catch (LicenseReaderNotFoundException ex)
            {
                _found = false;
            }
            catch (LicenseReaderFormatException ex)
            {
                _correct = false;
            }
            catch (Exception e)
            {
                _found = false;
                _correct = false;
            }
        }

        public ErrorTypes GetAccessByInfo()
        {
            return ErrorTypes.NoError;
        }

#region Standard license fields getters
        public DateTime getStartDate()
        {
            return _startDate;
        }
        public DateTime getEndDate()
        {
            return _endDate;
        }
        public DateTime getEndDateThreshold()
        {
            return _endDateThreshold;
        }
        public string getId()
        {
            return _id;
        }
        public string getCustomer()
        {
            return _customer;
        }
        public string getCustomerAddr()
        {
            return _customer_addr;
        }
        public string getCustomerWww()
        {
            return _customer_www;
        }
        public string getCustomerMail()
        {
            return _customer_mail;
        }
        public string getCustomerInfo()
        {
            return _customer_info;
        }
        public string getCustomerLogo()
        {
            return _customer_logo;
        }
#endregion
        public bool isLicenseFound()
        {
            return _found;
        }
        public bool isLicenseCorrect()
        {
            return _correct;
        }
        public uint getPermissions()
        {
            return _permissions;
        }        

        private bool FillMembersBase(XmlDocument xmlDoc)
        { 
            bool res = false;
            try
            {
                
                XmlNodeList list = xmlDoc.GetElementsByTagName("teamlaboffice").Item(0).ChildNodes;
                Dictionary<string, string> dict = new Dictionary<string, string>();
                foreach (XmlNode node in list)
                {
                    if (node.NodeType == XmlNodeType.Element && node.HasChildNodes)
                    {
                        dict.Add(node.Name, node.FirstChild.Value);
                    }
                }

                string license_type;
                string startDate;
                string endDate;
                string endDateThreshold;
                string id;
                string customer;
                string customer_addr;
                string customer_www;
                string customer_mail;
                string customer_info;
                string customer_logo;
                string permissions;

                if (!dict.TryGetValue("startdate", out startDate))
                    startDate = null;
                if (!dict.TryGetValue("enddate", out endDate))
                    endDate = null;
                if (!dict.TryGetValue("enddatethreshold", out endDateThreshold))
                    endDateThreshold = null;
                if (!dict.TryGetValue("id", out id))
                    id = null;
                if (!dict.TryGetValue("customer", out customer))
                    customer = "";
                if (!dict.TryGetValue("customer_addr", out customer_addr))
                    customer_addr = "";
                if (!dict.TryGetValue("customer_www", out customer_www))
                    customer_www = "";
                if (!dict.TryGetValue("customer_mail", out customer_mail))
                    customer_mail = "";
                if (!dict.TryGetValue("customer_info", out customer_info))
                    customer_info = "";
                if (!dict.TryGetValue("customer_logo", out customer_logo))
                    customer_logo = "";
                if (!dict.TryGetValue("lictype", out license_type))
                    license_type = "";

                if (!dict.TryGetValue("permissions", out permissions))
                {
                    _permissions = EditorPermissions.PERMISSION_NONE;
                }
                else 
                {
                    string perm_lo = permissions.ToLower();
                    _permissions |= perm_lo.Contains("w") ? EditorPermissions.PERMISSION_WRITER : EditorPermissions.PERMISSION_NONE;
                    _permissions |= perm_lo.Contains("e") ? EditorPermissions.PERMISSION_SPREADSHEET : EditorPermissions.PERMISSION_NONE;
                    _permissions |= perm_lo.Contains("p") ? EditorPermissions.PERMISSION_PRESENTATION : EditorPermissions.PERMISSION_NONE;
                }

                if (null == startDate
                    || null == endDate
                    || null == id)
                {
                    return false;
                }

                this._startDate = DateTime.Parse(startDate);
                this._endDate = DateTime.Parse(endDate);
                if (null == endDateThreshold || endDateThreshold == "")
                    this._endDateThreshold = _endDate.AddMonths(1);
                else
                    this._endDateThreshold = DateTime.Parse(endDateThreshold);
                this._id = id;
                this._customer = customer;
                this._customer_addr = customer_addr;
                this._customer_www = customer_www;
                this._customer_mail = customer_mail;
                this._customer_info = customer_info;
                this._customer_logo = customer_logo;
                this._license_type = license_type;

                res = true;
            }
            catch (Exception ex)
            {
            }

            return res & FillMembers(xmlDoc);
        }

        protected abstract bool FillMembers(XmlDocument xmlDoc);
    }

    public class LicenseReaderSimple : LicenseReaderBase
    { 

        protected LicenseReaderSimple(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        {
        }
        protected override bool FillMembers(XmlDocument xmlDoc)
        {
            return true;
        }
        public static ILicenseReader GetLicenseReaderObject(string ciphiredXmlPath, LicenseInfo.LicenseType licenseType)
        {
            ILicenseReader result = null;

            switch (licenseType)
            {

                case LicenseInfo.LicenseType.ByUserCount:   
                    result = new UserCountLicenseReader (ciphiredXmlPath);
                    break;
                
                case LicenseInfo.LicenseType.ByDocumentSessions:    
                    result = new DocumentSessionLicenseReader(ciphiredXmlPath);
                    break;

                case LicenseInfo.LicenseType.ByUserCount2:    
                    result = new UserCount2LicenseReader(ciphiredXmlPath);
                    break;

                case LicenseInfo.LicenseType.ByActiveConnections:   
                    result = new ActiveConnectionsLicenseReader(ciphiredXmlPath);
                    break;
                default:
                    { 
                        
                        LicenseReaderSimple simple = new LicenseReaderSimple(ciphiredXmlPath);

                        if (null != simple && simple.isLicenseFound() && simple.isLicenseCorrect())
                        {
                            if (simple._license_type == "ActiveConnections")
                                result = new ActiveConnectionsLicenseReader(ciphiredXmlPath);
                            else if (simple._license_type == "UserCount")
                                result = new UserCountLicenseReader(ciphiredXmlPath);
                            else if (simple._license_type == "UserCount2")
                                result = new UserCount2LicenseReader(ciphiredXmlPath);
                            else if (simple._license_type == "DocumentSessions")
                                result = new DocumentSessionLicenseReader(ciphiredXmlPath);
                            
                        }
                    }
                    break;
            }

            return result;
        }
    }

    public class ActiveConnectionsLicenseReaderSingle : LicenseReaderBase
    {

        protected int _quota;

        public int getUserQuota()
        {
            return _quota;
        }

        public ActiveConnectionsLicenseReaderSingle(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        {
        }

        protected override bool FillMembers(XmlDocument xmlDoc)
        {
            bool res = false;
            try 
            {
                
                XmlNodeList list = xmlDoc.GetElementsByTagName("teamlaboffice").Item(0).ChildNodes;
                Dictionary <string, string> dict = new Dictionary<string,string> ();
                foreach (XmlNode node in list)
                {
                    if (node.NodeType == XmlNodeType.Element && node.HasChildNodes)
                    {
                        dict.Add(node.Name, node.FirstChild.Value);
                    }
                }

                string connectionQuota = dict["connectionquota"];
                string licType = dict["lictype"];

                if (null == connectionQuota
                    || null == licType
                    || licType != getLicenseTypeName())
                {
                    return false;
                }
                this._quota = int.Parse (connectionQuota);
                res = true;
            }
            catch (Exception ex)
            {
            }
            return res;

        }

        protected virtual string getLicenseTypeName()
        {
            return "ActiveConnections";
        }

    }

    public class UserCountLicenseReaderSingle : ActiveConnectionsLicenseReaderSingle
    {
        protected override string getLicenseTypeName()
        {
            return "UserCount";
        }
        public UserCountLicenseReaderSingle(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        { 
        }
    }

    public class UserCount2LicenseReaderSingle : ActiveConnectionsLicenseReaderSingle
    {
        protected override string getLicenseTypeName()
        {
            return "UserCount2";
        }
        public UserCount2LicenseReaderSingle(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        {
        }
    }

    public class DocumentSessionLicenseReader : LicenseReaderBase
    {
        protected string _trackingUrl = "";

        public string GetTrackingUrl()
        {
            return _trackingUrl;
        }

        public DocumentSessionLicenseReader (string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        { 
        }

        protected override bool FillMembers(XmlDocument xmlDoc)
        {
            bool res = false;
            try
            {
                
                XmlNodeList list = xmlDoc.GetElementsByTagName("teamlaboffice").Item(0).ChildNodes;
                Dictionary<string, string> dict = new Dictionary<string, string>();
                foreach (XmlNode node in list)
                {
                    if (node.NodeType == XmlNodeType.Element && node.HasChildNodes)
                    {
                        dict.Add(node.Name, node.FirstChild.Value);
                    }
                }

                string trackingUrl = dict["trackingurl"];
                string licType = dict["lictype"];

                if (null == trackingUrl 
                    || null == licType
                    || licType != "DocumentSessions")
                {
                    return false;
                }

                this._trackingUrl = trackingUrl;

                res = true;
            }
            catch (Exception ex)
            {
            }
            return res;

        }
    }
#endif
}
