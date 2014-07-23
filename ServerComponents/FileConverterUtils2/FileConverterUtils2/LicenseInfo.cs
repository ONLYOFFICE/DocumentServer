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
using System.Configuration;

namespace FileConverterUtils2
{

    public abstract class LicenseInfo
    {
        protected DateTime m_dtBuildTime;

        public enum EditorType : int
        {
            Word = 0,
            Spreadsheet = 1,
            Presentation = 2,
            Convertation = 3
        }

        public enum LicenseType : int
        {
            NoValidation = 0,                 
            ByVKey = 1,                 
            ByUserCount = 2,            
            ByActiveConnections = 3,    
            ByTimeUsage = 4,             
            ByDocumentSessions = 5,      
            OpenSource = 6,
            ByUserCount2 = 7,            
            
        };
        public class LicenseRights
        {
            private bool _bCanOpen;
            private bool _bCanSave;
            private bool _bCanCoAuthoring;
            private bool _bCanExport;
            private bool _bCanPrint;
            private bool _bCanBranding;

            public bool CanOpen
            {
                get { return _bCanOpen; }
                set { _bCanOpen = value; }
            }
            public bool CanSave
            {
                get { return _bCanSave; }
                set { _bCanSave = value; }
            }
            public bool CanCoAuthoring
            {
                get { return _bCanCoAuthoring; }
                set { _bCanCoAuthoring = value; }
            }
            public bool CanExport
            {
                get { return _bCanExport; }
                set { _bCanExport = value; }
            }
            public bool CanPrint
            {
                get { return _bCanPrint; }
                set { _bCanPrint = value; }
            }
            public bool CanBranding
            {
                get { return _bCanBranding; }
                set { _bCanBranding = value; }
            }
            public LicenseRights()
            {
                _bCanOpen = true;
                _bCanSave = false;
                _bCanCoAuthoring = false;
                _bCanExport = false;
                _bCanPrint = true;
                _bCanBranding = false;
            }
            public LicenseRights(bool bIsAllEnabled)
                : this()
            {
                if (bIsAllEnabled)
                {
                    _bCanOpen = true;
                    _bCanSave = true;
                    _bCanCoAuthoring = true;
                    _bCanExport = true;
                    _bCanPrint = true;
                    _bCanBranding = true;
                }
            }
        };
        public class LicenseMetaData
        {
            private string _strVKey;
            private string _strDocId;
            private string _strUserId;
            private bool _bCheckIP;
            private string _strCurrentIP;
            private int _nEditorId;

            public string VKey
            {
                get { return _strVKey; }
                set { _strVKey = value; }
            }
            public string DocId
            {
                get { return _strDocId; }
                set { _strDocId = value; }
            }
            public string UserId
            {
                get { return _strUserId; }
                set { _strUserId = value; }
            }
            public bool IsCheckIP
            {
                get { return _bCheckIP; }
                set { _bCheckIP = value; }
            }
            public string CurrentIP
            {
                get { return _strCurrentIP; }
                set { _strCurrentIP = value; }
            }
            public int EditorId
            {
                get { return _nEditorId; }
                set { _nEditorId = value; }
            }

            public LicenseMetaData(string vkey, string docId, string userId, int editorId)
            {
                _strVKey = vkey;

                _strDocId = docId;
                if (null == _strDocId || _strDocId == "")
                    _strDocId = "doc";

                _strUserId = userId;
                if (null == _strUserId || _strUserId == "")
                    _strUserId = "usr";

                _nEditorId = editorId;
            }
        };
        public class LicenseCustomerInfo
        {
            public string customer;
            public string customer_addr;
            public string customer_www;
            public string customer_mail;
            public string customer_info;
            public string customer_logo;
        }
        
        protected LicenseInfo()
        { 
        }

        public static LicenseInfo CreateLicenseInfo(DateTime buildTime)
        {

            return new OpenSourceLicenseInfo();

        }

        public abstract LicenseCustomerInfo getCustomerInfo();

        public abstract LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode);

        public static bool isPaid(string vkey)
        {
            bool bPaid;
            Signature.getVKeyParams(vkey, out bPaid);
            return bPaid;
        }
        protected DateTime getBuildTime()
        {
            return m_dtBuildTime;
        }

    }

        public class OpenSourceLicenseInfo : LicenseInfo
        {
            public override LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode)
            {
                LicenseRights oRights = new LicenseRights(true);
                errorCode = ErrorTypes.NoError;
                return oRights;
            }
            public override LicenseCustomerInfo getCustomerInfo()
            {
                LicenseCustomerInfo info = new LicenseCustomerInfo();
                info.customer = "Licensed under GNU Affero General Public License v3.0";
                info.customer_addr = null;
                info.customer_www = "http://www.gnu.org/licenses/agpl-3.0.html";
                info.customer_mail = null;
                info.customer_info = null;
                info.customer_logo = null;

                return info;
            }
        }

    }
