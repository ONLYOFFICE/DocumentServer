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
    #if !OPEN_SOURCE
    public interface ITrackingInfo
    {
        void setLicense (ILicenseReader lic);
        void track(string clientId, string docId, int isAlive);
        void getUserCount(out int active, out int inactive);
        ILicenseReader getLicense();
        bool isQuotaExceed(string userId, string docId);
        void Cleanup();
        bool isLicenseFileValid();
        bool isLicenseDateValid();
        bool isLicenseDateTresholdExpired();
        bool isLicenseEndDateGreater(DateTime time);
    }

    public class TrackingInfo: ITrackingInfo
    {

        public static double sdCleanupExpiredMinutes = 2.0;

        private DateTime oLastCleanupTime = DateTime.Now;
        public class TrackingValue
        {
            public int inactiveTicks;
            public DateTime lastTrackingTime;
        }
        public class TrackingDictionary
        {
            Dictionary<string, TrackingValue> dict;
            Object sync;

            public TrackingDictionary ()
            {
                dict = new Dictionary<string, TrackingValue> ();
                sync = new Object ();

                try
                {
                    int periods = int.Parse (ConfigurationManager.AppSettings["license.activeconnections.tracking.cleanupperiods"] ?? "2");
                    int tracking_time = int.Parse(ConfigurationManager.AppSettings["license.activeconnections.tracking.interval"] ?? "300");
                    sdCleanupExpiredMinutes = ((double) (periods * tracking_time)) / 60.0;
                }
                catch (Exception e)
                {
                    sdCleanupExpiredMinutes = 5.0;
                }
            }
            public void Add (string key, TrackingValue value)
            {
                lock (sync)
                {
                    dict.Add (key, value);
                }
            }
            public void Remove (string key)
            {
                lock (sync)
                {
                    dict.Remove (key);
                }
            }

            public void RemoveOldItems (DateTime lastTime)
            {
                Dictionary<string, TrackingValue> toSave = new Dictionary<string, TrackingValue>();

                lock (sync)
                {
                    for (int i = 0; i < dict.Count; ++i)
                    {
                        KeyValuePair<string, TrackingValue> element;
                        
                            element = dict.ElementAt(i);
                            if (element.Value.lastTrackingTime > lastTime)
                                toSave.Add (element.Key, element.Value);

                    }
                    if (toSave.Count != dict.Count)
                        dict = toSave;
                }
            }
            public bool TryGetValue (string key, out TrackingValue value)
            {
                bool bRes = false;
                lock (sync)
                {
                    bRes = dict.TryGetValue (key, out value);
                }
                return bRes;
            }

            public int GetCount()
            {
                lock (sync)
                {
                    return dict.Count;
                }
            }

        }

        private TrackingDictionary activeUsers;
        private TrackingDictionary inactiveUsers;

        private ILicenseReader license;

        public TrackingInfo()
        {
            activeUsers = new TrackingDictionary();
            inactiveUsers = new TrackingDictionary();
        }
        public void setLicense(ILicenseReader lic)
        {
            this.license = lic;
        }
        public ILicenseReader getLicense()
        {
            return license;
        }

        public void getUserCount(out int active, out int inactive)
        {
            active = activeUsers.GetCount();
            inactive = inactiveUsers.GetCount();
        }
        public virtual void track(string clientId, string docId, int isAlive)
        {

            if (null == clientId)
                clientId = "";
            
            if (null == docId)
                docId = "";

            TrackingValue value;
            string key = clientId + docId;
            if (key == "")
                key = "empty";

            DateTime now = DateTime.Now;

            if (0 == isAlive)
            {

                if (inactiveUsers.TryGetValue(key, out value))
                {
                    
                    value.lastTrackingTime = now;
                    value.inactiveTicks++;
                }
                else
                { 

                    if (activeUsers.TryGetValue(key, out value))
                    {

                        activeUsers.Remove(key);
                    }
                    else 
                    {
                        
                        value = new TrackingValue();                         
                    }

                    value.inactiveTicks = 1;
                    value.lastTrackingTime = now;
                    inactiveUsers.Add(key, value);   
                }
            }
            else
            { 

                if (activeUsers.TryGetValue(key, out value))
                {
                    
                    value.lastTrackingTime = now;
                    value.inactiveTicks = 0;                
                }
                else
                {
                    
                    if (inactiveUsers.TryGetValue(key, out value))
                    {
                        
                        inactiveUsers.Remove(key);
                    }
                    else
                    { 
                        
                        value = new TrackingValue();
                    }
                    value.inactiveTicks = 0;
                    value.lastTrackingTime = now;

                    activeUsers.Add(key, value);
                }
            }

            if (now.AddDays(1.0) > oLastCleanupTime)
            {
                Cleanup();
                oLastCleanupTime = now;
            }

        }
        public bool isQuotaExceed (string userId, string docId)
        {
            if (null == userId)
                userId = "";

            if (null == docId)
                docId = "";

            if (null == license)
                return false;

            int count = activeUsers.GetCount();

            if (count < ((ActiveConnectionsLicenseReader)license).getUserQuota())
                return false;

            string key = userId + docId;
            if (key == "")
                key = "empty";

            TrackingValue value;

            if (activeUsers.TryGetValue(key, out value))
                return false;

            if (inactiveUsers.TryGetValue(key, out value))
                return false;

            return true;

        }
        public bool isLicenseFileValid()
        {
            return (null != license
                && license.isLicenseFound()
                && license.isLicenseCorrect());
        }
        public bool isLicenseDateValid()
        { 
            DateTime now = DateTime.Now;

            DateTime start = license.getStartDate();
            DateTime end = license.getEndDate();
            if (start < now && end > now)
            {
                return true;
            }

            return false;
        }
        public bool isLicenseEndDateGreater (DateTime time)
        {
            DateTime end = license.getEndDate();
            return (end > time);
        }
        public bool isLicenseDateTresholdExpired()
        {
            DateTime now = DateTime.Now;

            DateTime treshold = license.getEndDateThreshold();

            return now > treshold;
        }
        public void Cleanup()
        {
            int active_count = activeUsers.GetCount();
            int inactive_count = inactiveUsers.GetCount();
            int quota = (null == license) ? 2048 : ((ActiveConnectionsLicenseReader)license).getUserQuota();

            if (active_count >= (quota - 1))
            { 
                
                CleanupTrackingDictionary(activeUsers, sdCleanupExpiredMinutes);
            }
            if (inactive_count >= quota)
            {
                
                CleanupTrackingDictionary(inactiveUsers, sdCleanupExpiredMinutes);
            }
        }
        private void CleanupTrackingDictionary(TrackingDictionary dict, double minutes)
        {
            dict.RemoveOldItems (DateTime.Now.AddMinutes (-1.0 * minutes));
        }

    }
    public class UserCount2TrackingInfo : ITrackingInfo
    {
        public class UserTrackingDictionary
        {
            Dictionary<string, DateTime> dict;  
            Object sync;
            DateTime lastCleanupTime;

            public UserTrackingDictionary()
            {
                dict = new Dictionary<string, DateTime>();
                sync = new Object();

                lastCleanupTime = DateTime.Now.Date;

            }
            public void Add(string key, DateTime value)
            {
                lock (sync)
                {
                    dict.Add(key, value);
                }
            }
            public void Remove(string key)
            {
                lock (sync)
                {
                    dict.Remove(key);
                }
            }

            public void RemoveItems ()
            {
                DateTime currentTime = DateTime.Now;
                TimeSpan timeDelta = currentTime - lastCleanupTime;
                double hoursDelta = timeDelta.TotalHours;

                if (hoursDelta < 24.0)
                    return;

                lock (sync)
                {
                    dict.Clear();
                }

                lastCleanupTime = currentTime.Date;
            }
            public bool TryGetValue(string key, out DateTime value)
            {
                bool bRes = false;
                lock (sync)
                {
                    bRes = dict.TryGetValue(key, out value);
                }
                return bRes;
            }

            public int GetCount()
            {
                lock (sync)
                {
                    return dict.Count;
                }
            }
        }

        private ILicenseReader license;
        private UserTrackingDictionary activeUsers;

        public UserCount2TrackingInfo()
        {
            activeUsers = new UserTrackingDictionary();
        }
        
        public void setLicense(ILicenseReader lic)
        {
            this.license = lic;
        }
        public void track(string clientId, string docId, int isAlive)
        {

            if (null == clientId)
                clientId = "";

            if (null == docId)
                docId = "";

            DateTime value;
            string key = clientId + docId;
            if (key == "")
                key = "empty";

            DateTime now = DateTime.Now;

            {
                
                if (activeUsers.TryGetValue(key, out value))
                {
                    value = now;
                }
                else
                {
                    
                    activeUsers.Add(key, now);
                }
            }

            Cleanup();
        }
        public void getUserCount(out int active, out int inactive)
        {
            active = activeUsers.GetCount();
            inactive = 0;
        }
        public ILicenseReader getLicense()
        {
            return license;
        }
        public bool isQuotaExceed(string userId, string docId)
        {
            if (null == userId)
                userId = "";

            docId = "";

            if (null == license)
                return false;

            int count = activeUsers.GetCount();

            if (count < ((ActiveConnectionsLicenseReader)license).getUserQuota())
                return false;

            string key = userId + docId;
            if (key == "")
                key = "empty";

            DateTime value;

            if (activeUsers.TryGetValue(key, out value))
                return false;

            return true;
        }
        public void Cleanup()
        {
            activeUsers.RemoveItems();
        }
        public bool isLicenseFileValid()
        {
            return (null != license
                && license.isLicenseFound()
                && license.isLicenseCorrect());
        }
        public bool isLicenseDateValid()
        {
            DateTime now = DateTime.Now;

            DateTime start = license.getStartDate();
            DateTime end = license.getEndDate();
            if (start < now && end > now)
            {
                return true;
            }

            return false;
        }
        public bool isLicenseDateTresholdExpired()
        {
            DateTime now = DateTime.Now;

            DateTime treshold = license.getEndDateThreshold();

            return now > treshold;
        }
        public bool isLicenseEndDateGreater(DateTime time)
        {
            DateTime end = license.getEndDate();
            return (end > time);
        }
    }
#endif
}
