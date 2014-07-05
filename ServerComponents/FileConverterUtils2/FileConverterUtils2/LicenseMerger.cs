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
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml;

namespace FileConverterUtils2
{
    #if !OPEN_SOURCE
    public class ActiveConnectionsLicenseReader : ILicenseReader
    {
        
        protected List<ActiveConnectionsLicenseReaderSingle> m_licnenses = new List<ActiveConnectionsLicenseReaderSingle>();

        protected virtual ActiveConnectionsLicenseReaderSingle createSingleFileReader(string licFileName)
        {
            return new ActiveConnectionsLicenseReaderSingle(licFileName);
        }
        public ActiveConnectionsLicenseReader (string ciphiredXmlPath)
        {
            try
            {

                bool isFileExists = System.IO.File.Exists(ciphiredXmlPath);
                bool isDirExists = System.IO.Directory.Exists(ciphiredXmlPath);

                if (isFileExists)
                {
                    FileInfo fileInfo = new FileInfo(ciphiredXmlPath);
                    string licFileName = fileInfo.FullName;
                    ActiveConnectionsLicenseReaderSingle item = createSingleFileReader (licFileName);
                    if (item.isLicenseFound() && item.isLicenseCorrect())
                    {
                        m_licnenses.Add(item);
                    }
                }
                else if (isDirExists)
                {

                    DirectoryInfo rootDirectory = new DirectoryInfo(ciphiredXmlPath);
                    FileInfo[] licFiles = rootDirectory.GetFiles("*.lic");
                    if (null != licFiles)
                    {
                        foreach (FileInfo file in licFiles)
                        {
                            string licFileName = file.FullName;
                            ActiveConnectionsLicenseReaderSingle item = createSingleFileReader (licFileName);
                            if (item.isLicenseFound() && item.isLicenseCorrect())
                            {
                                
                                string licId = item.getId();
                                bool unique = true;
                                foreach (ActiveConnectionsLicenseReaderSingle lic_added in m_licnenses)
                                {
                                    if (lic_added.getId() == licId)
                                    {
                                        unique = false;
                                        break;
                                    }
                                }
                                if (unique)
                                    m_licnenses.Add(item);
                            }
                        }
                    }
                }

                _found = _correct = (m_licnenses.Count() > 0);

                if (_found)
                {
                    DateTime minDate, maxDate, tresholdDate;
                    minDate = m_licnenses[0].getStartDate ();
                    maxDate = m_licnenses[0].getEndDate ();
                    tresholdDate = m_licnenses[0].getEndDateThreshold();

                    foreach (ActiveConnectionsLicenseReaderSingle lic in m_licnenses)
                    { 
                        DateTime startDate = lic.getStartDate();
                        DateTime endDate = lic.getEndDate();
                        DateTime endDateTres = lic.getEndDateThreshold();
                        if (minDate > startDate)
                            minDate = startDate;
                        if (maxDate < endDate)
                            maxDate = endDate;
                        if (tresholdDate < endDateTres)
                            tresholdDate = endDateTres;
                    }
                    _startDate = minDate;
                    _endDate = maxDate;
                    _endDateThreshold = tresholdDate;

                    _customer = m_licnenses[0].getCustomer();
                    _customer_www = m_licnenses[0].getCustomerWww();
                    _customer_addr = m_licnenses[0].getCustomerAddr();
                    _customer_mail = m_licnenses[0].getCustomerMail();
                    _customer_info = m_licnenses[0].getCustomerInfo();
                    _customer_logo = m_licnenses[0].getCustomerLogo();
                }
                else
                {
                    _customer = "Unregistered";
                    _customer_www = null;
                    _customer_addr = null;
                    _customer_mail = null;
                    _customer_info = null;
                    _customer_logo = null;
                }
            }
            catch (Exception ex)
            { 
            }
        }

        public ErrorTypes GetAccessByInfo()
        {
            return ErrorTypes.NoError;
        }

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
            
            string id = "";
            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                id = lics[0].getId();
            return id;
        }

        public string getCustomer()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getCustomer();

            return res;
        }

        public string getCustomerAddr()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getCustomerAddr();

            return res;
        }

        public string getCustomerWww()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getCustomerWww();

            return res;
        }

        public string getCustomerMail()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getCustomerMail();

            return res;
        }

        public string getCustomerInfo()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, false);
            if (lics.Count() > 0)
                res = lics[0].getCustomerInfo();
            else
                res = "License has expired";

            return res;
        }

        public string getCustomerLogo()
        {
            string res = null;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getCustomerLogo();

            return res;
        }

        public bool isLicenseFound()
        {
            return _found;
        }
        public bool isLicenseCorrect()
        {
            return _correct;
        }
        public int getUserQuota()
        {
            int res = 0;
            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            foreach (ActiveConnectionsLicenseReaderSingle lic in lics)
            {
                res += lic.getUserQuota();
            }
            if (0 == res)
                res = 2;    
            return res;
        }

        public uint getPermissions()
        {
            uint res = EditorPermissions.PERMISSION_NONE;

            ActiveConnectionsLicenseReaderSingle[] lics = getLicensesByTime(DateTime.Now, true);
            if (lics.Count() > 0)
                res = lics[0].getPermissions();

            return res;
        }   

        protected string _id;
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
        protected int _quota;

        protected ActiveConnectionsLicenseReaderSingle[] getLicensesByTime (DateTime time, bool useTreshold)
        {
            List<ActiveConnectionsLicenseReaderSingle> array = new List<ActiveConnectionsLicenseReaderSingle>();
            foreach (ActiveConnectionsLicenseReaderSingle item in m_licnenses)
            {
                DateTime startTime = item.getStartDate();
                DateTime endTime = item.getEndDate();
                DateTime endTimeTreshold = item.getEndDateThreshold();
                if ((startTime <= time) 
                    && (useTreshold ? (time <= endTimeTreshold) : (time <= endTime)))
                {
                    array.Add(item);
                }
            }
            return array.ToArray();
        }
    }

    public class UserCountLicenseReader : ActiveConnectionsLicenseReader
    {
        protected override ActiveConnectionsLicenseReaderSingle createSingleFileReader(string licFileName)
        {
            return new UserCountLicenseReaderSingle(licFileName);
        }

        public UserCountLicenseReader(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        { 
        }
    }

    public class UserCount2LicenseReader : ActiveConnectionsLicenseReader
    {
        protected override ActiveConnectionsLicenseReaderSingle createSingleFileReader(string licFileName)
        {
            return new UserCount2LicenseReaderSingle(licFileName);
        }

        public UserCount2LicenseReader(string ciphiredXmlPath)
            : base(ciphiredXmlPath)
        {
        }
    }
#endif
}
