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
#if OPEN_SOURCE
            return new OpenSourceLicenseInfo();
#else

            LicenseType licType = (LicenseType)int.Parse(ConfigurationManager.AppSettings["license.type"] ?? "3"); 

            LicenseInfo lic = null;
            switch (licType)
            {
                case LicenseType.ByVKey:    
                    lic = new VKeyLicenseInfo();
                    break;
                    
                case LicenseType.ByUserCount:   
                    lic = new UserCountLicenseInfo();
                    break;
                
                case LicenseType.ByDocumentSessions:    
                    lic = new DocumentSessionLicenseInfo();
                    break;

                case LicenseType.ByUserCount2:    
                    lic = new UserCount2LicenseInfo();
                    break;

                case LicenseType.ByActiveConnections:   
                default:
                    lic = new ActiveConnectionLicenseInfo();
                    break;
            }
            if (null != lic)
                lic.m_dtBuildTime = buildTime;

            return lic;
#endif
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
#if OPEN_SOURCE

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
#else

        public class MockLicenseInfo : LicenseInfo
        {
            public override LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode)
            {
                LicenseRights oRights = new LicenseRights(true);
                errorCode = ErrorTypes.NoError;
                return oRights;
            }
            public override LicenseCustomerInfo getCustomerInfo()
            {
                return null;
            }
        }

        public class VKeyLicenseInfo : LicenseInfo
        {
            public VKeyLicenseInfo()
            { 
            }
            public override LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode)
            {
                errorCode = ErrorTypes.NoError;
                LicenseRights oRights = new LicenseRights();
                if (metaData is LicenseMetaData)
                {
                    LicenseMetaData metaVKey = (LicenseMetaData)metaData;
                    errorCode = Signature.isAccept(metaVKey.VKey, metaVKey.DocId, false, null);

                    if (ErrorTypes.NoError == errorCode ||
                        ErrorTypes.VKeyTimeExpire == errorCode)
                    {

                        oRights.CanOpen = (ErrorTypes.VKeyTimeExpire != errorCode);

                        string sAffilieteId = null;
                        Signature.getVKeyStringParam(metaVKey.VKey, ConfigurationSettings.AppSettings["keyKeyID"], out sAffilieteId);
                        ASC.Core.Billing.PaymentOffice oPaymentOffice = Signature.getPaymentOffice(sAffilieteId);
                        if (32 <= sAffilieteId.Length)
                        {
                            oRights.CanSave = oPaymentOffice.Editing;
                            oRights.CanCoAuthoring = oPaymentOffice.CoEditing;
                            oRights.CanExport = true;
                        }
                        else
                        {

                            oRights.CanSave = true;
                            oRights.CanCoAuthoring = true;
                            oRights.CanExport = true;
                        }
                    }
                }
                else
                {
                    errorCode = ErrorTypes.LicenseErrorArgument;
                }
                return oRights;
            }
            public override LicenseCustomerInfo getCustomerInfo()
            {
                return null;
            }
        }

        public class ActiveConnectionLicenseInfo : LicenseInfo
        {
            protected ITrackingInfo trackInfo;

            protected virtual ActiveConnectionsLicenseReader createLicenseReader(string licensePath)
            {
                return new ActiveConnectionsLicenseReader(licensePath);
            }
            protected virtual ITrackingInfo createTrackingInfo ()
            {
                return new TrackingInfo ();
            }
            public ActiveConnectionLicenseInfo ()
            {
                trackInfo = createTrackingInfo ();

                int interval = int.Parse(ConfigurationSettings.AppSettings["license.activeconnections.tracking.interval"] ?? "300");
                string licensePath = ConfigurationSettings.AppSettings["license.file.path"];

                trackInfo.setLicense(createLicenseReader(licensePath));
            }

            public virtual void track(string clientId, string docId, int isAlive)
            {
                trackInfo.track (clientId, docId, isAlive);
            }

            public void getUserCount (out int active, out int inactive)
            {
                trackInfo.getUserCount(out active, out inactive);
            }

            public override LicenseCustomerInfo getCustomerInfo()
            {
                ActiveConnectionsLicenseReader lic = (ActiveConnectionsLicenseReader) trackInfo.getLicense();
                if (null == lic)
                    return null;

                DateTime now = DateTime.Now;

                bool found = lic.isLicenseFound();
                bool correct = lic.isLicenseCorrect();
                bool notStarted = (lic.getStartDate() > now);
                bool expired = (lic.getEndDate() < now) && (lic.getEndDateThreshold() > now);
                bool fully_expired = notStarted || (lic.getEndDateThreshold() < now);

                if (notStarted && found && correct)
                {
                    LicenseCustomerInfo infoUnreg = new LicenseCustomerInfo();
                    infoUnreg.customer = lic.getCustomer();
                    infoUnreg.customer_addr = lic.getCustomerAddr();
                    infoUnreg.customer_www = lic.getCustomerWww();
                    infoUnreg.customer_mail = lic.getCustomerMail();
                    infoUnreg.customer_logo = lic.getCustomerLogo();
                    infoUnreg.customer_info = "License starts on " + lic.getStartDate().ToUniversalTime().ToString("MM/dd/yyyy H:mm:ss zzz")+  "(UTC)";
                    return infoUnreg;
                }
                if (fully_expired || !found || !correct)
                {
                    LicenseCustomerInfo infoUnreg = new LicenseCustomerInfo();
                    infoUnreg.customer = "Unregistered";
                    return infoUnreg;
                }

                LicenseCustomerInfo info = new LicenseCustomerInfo();
                info.customer = lic.getCustomer();
                info.customer_addr = lic.getCustomerAddr();
                info.customer_www = lic.getCustomerWww();
                info.customer_mail = lic.getCustomerMail();
                info.customer_info = expired ? "License has expired" : lic.getCustomerInfo();
                info.customer_logo = lic.getCustomerLogo();

                return info;
            }
            protected virtual string getUserId(LicenseMetaData metaData)
            {
                return metaData.UserId;
            }
            protected virtual string getDocumentId(LicenseMetaData metaData)
            {
                return metaData.DocId;
            }
            protected bool checkQuotaExceeded(LicenseMetaData metaData)
            {
                string userId = getUserId(metaData);
                string documentId = getDocumentId(metaData);
                bool bQuotaExceed = trackInfo.isQuotaExceed(userId, documentId);

                if (bQuotaExceed)
                {
                    
                    trackInfo.Cleanup();
                    bQuotaExceed = trackInfo.isQuotaExceed(userId, documentId);
                }

                return bQuotaExceed;
            }
            public ILicenseReader getLicense()
            {
                return trackInfo.getLicense();
            }
            public override LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode)
            {
                errorCode = ErrorTypes.NoError;

                LicenseRights oRights = new LicenseRights();

                bool bValidLicenseFile = trackInfo.isLicenseFileValid();
                if (!bValidLicenseFile)
                {
                    errorCode = ErrorTypes.LicenseErrorFile;

                    bool bUnlicensedQuotaExceed = checkQuotaExceeded (metaData);

                    if (bUnlicensedQuotaExceed)
                    {
                        errorCode = ErrorTypes.LicenseErrorActiveConnectionQuotaExceed;
                    }
                    else
                    {
                        oRights.CanSave = true;
                        oRights.CanCoAuthoring = true;
                        oRights.CanExport = true;
                    }

                    return oRights;
                }

                bool bValidDate = false;

                if (trackInfo.isLicenseDateValid())
                {
                    
                    bValidDate = true;                    
                }
                else 
                {

                    errorCode = ErrorTypes.LicenseErrorInvalidDate;

                    if (!trackInfo.isLicenseDateTresholdExpired())
                        bValidDate = true;
                }

                bool bBuildTimeValid = trackInfo.isLicenseEndDateGreater(m_dtBuildTime);
                bool bQuotaExceed = true;
                bool bEditorAllowed = false;

                uint permissions = trackInfo.getLicense().getPermissions();

                if ((metaData.EditorId == (int)EditorType.Convertation)
                    && (permissions != EditorPermissions.PERMISSION_NONE))
                {
                    
                    bQuotaExceed = false;
                    bEditorAllowed = true;
                }
                else
                {
                    
                    bQuotaExceed = checkQuotaExceeded(metaData);

                    if (bQuotaExceed)
                    {
                        errorCode = ErrorTypes.LicenseErrorActiveConnectionQuotaExceed;
                    }

                    if (((metaData.EditorId == (int)EditorType.Word) && (0 != (permissions & EditorPermissions.PERMISSION_WRITER)))
                        || ((metaData.EditorId == (int)EditorType.Spreadsheet) && (0 != (permissions & EditorPermissions.PERMISSION_SPREADSHEET)))
                        || ((metaData.EditorId == (int)EditorType.Presentation) && (0 != (permissions & EditorPermissions.PERMISSION_PRESENTATION)))
                        )
                    {
                        
                        bEditorAllowed = true;
                    }
                    else
                    {
                        
                    }
                }

                if (bValidDate && bEditorAllowed && !bQuotaExceed && bBuildTimeValid)
                {
                    oRights.CanSave = true;
                    oRights.CanCoAuthoring = true;
                    oRights.CanExport = true;
                }

                return oRights;
            }
        }

        public class UserCountLicenseInfo : ActiveConnectionLicenseInfo
        {
            public UserCountLicenseInfo()
                : base()
            { 
            }
            public override void track(string clientId, string docId, int isAlive)
            {
                trackInfo.track(clientId, "", isAlive);
            }
            protected override string getDocumentId(LicenseMetaData metaData)
            {
                return "";
            }
            protected override ActiveConnectionsLicenseReader createLicenseReader(string licensePath)
            {
                return new UserCountLicenseReader(licensePath);
            }
            protected override ITrackingInfo createTrackingInfo()
            {
                return new TrackingInfo();
            }
        }

        public class UserCount2LicenseInfo : UserCountLicenseInfo
        {
            public UserCount2LicenseInfo()
                : base()
            {
            }

            protected override ActiveConnectionsLicenseReader createLicenseReader(string licensePath)
            {
                return new UserCount2LicenseReader(licensePath);
            }
            protected override ITrackingInfo createTrackingInfo()
            {
                return new UserCount2TrackingInfo();
            }
        }

        public class DocumentSessionLicenseInfo : LicenseInfo
        {
            DocumentSessionLicenseReader license;

            public DocumentSessionLicenseInfo()
            { 
                string licensePath = ConfigurationSettings.AppSettings["license.file.path"];
                license = new DocumentSessionLicenseReader(licensePath);
            }
            public string getTrackingUrl()
            {
                return null == license ? null : license.GetTrackingUrl();
            }
            public string getLicenseId()
            {
                return null == license ? null : license.getId();
            }

            public override LicenseRights getRights(LicenseMetaData metaData, out ErrorTypes errorCode)
            {
                errorCode = ErrorTypes.NoError;

                LicenseRights oRights = new LicenseRights();

                if (null == license 
                    || !license.isLicenseFound() 
                    || !license.isLicenseCorrect())
                {
                    errorCode = ErrorTypes.LicenseErrorFile;
                    return oRights;
                }

                bool bValidDate = false;

                DateTime now = DateTime.Now;

                DateTime start = license.getStartDate();
                DateTime end = license.getEndDate();
                DateTime treshold = license.getEndDateThreshold();

                if (start < now && end > now)
                {
                    
                    bValidDate = true;
                }
                else
                {
                    
                    errorCode = ErrorTypes.LicenseErrorInvalidDate;

                    if (now < treshold)
                        bValidDate = true;
                }

                if (bValidDate)
                {
                    oRights.CanSave = true;
                    oRights.CanCoAuthoring = true;
                    oRights.CanExport = true;
                }
                
                return oRights;
            }
            public override LicenseCustomerInfo getCustomerInfo()
            {
                if (null == license)
                    return null;

                DateTime now = DateTime.Now;

                bool found = license.isLicenseFound();
                bool correct = license.isLicenseCorrect();
                bool notStarted = (license.getStartDate() > now);
                bool expired = (license.getEndDate() < now) && (license.getEndDateThreshold() > now);
                bool fully_expired = notStarted || (license.getEndDateThreshold() < now);

                if (notStarted && found && correct)
                {
                    LicenseCustomerInfo infoUnreg = new LicenseCustomerInfo();
                    infoUnreg.customer = license.getCustomer();
                    infoUnreg.customer_addr = license.getCustomerAddr();
                    infoUnreg.customer_www = license.getCustomerWww();
                    infoUnreg.customer_mail = license.getCustomerMail();
                    infoUnreg.customer_logo = license.getCustomerLogo();
                    infoUnreg.customer_info = "License starts on " + license.getStartDate().ToUniversalTime().ToString("MM/dd/yyyy H:mm:ss zzz") + "(UTC)";
                }
                if (fully_expired || !found || !correct)
                {
                    LicenseCustomerInfo infoUnreg = new LicenseCustomerInfo();
                    infoUnreg.customer = "Unregistered";
                    return infoUnreg;
                }

                LicenseCustomerInfo info = new LicenseCustomerInfo();
                info.customer = license.getCustomer();
                info.customer_addr = license.getCustomerAddr();
                info.customer_www = license.getCustomerWww();
                info.customer_mail = license.getCustomerMail();
                info.customer_info = expired ? "License has expired" : license.getCustomerInfo();
                info.customer_logo = license.getCustomerLogo();

                return info;
            }
        }
#endif
    }
