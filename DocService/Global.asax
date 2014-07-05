<%@ Application Language="C#" %>
<%@ Assembly Name="System.Configuration, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Threading"%>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Web.Routing" %>
<%@ Import Namespace="log4net.Config" %>
<%@ Import Namespace="FileConverterUtils2" %>

<script runat="server">
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
 


    const int c_nBuildTimeYear      = 2014;
    const int c_nBuildTimeMonth     = 02;
    const int c_nBuildTimeDay       = 04;

    public class LanguageInfo
    {
        public string languageCode;
        public string languageName;
        public string hunspellAffFile;
        public string hunspellDictFile;
        public string hunspellKey;
        public string hyphenDictFile;
        public string thesIdxFile;
        public string thesDatFile;
    };

    static public Object lockThis = new Object();
    
    static public Dictionary<int, LanguageInfo> dictMap;

    static LicenseInfo licenseInfo;
    static public LicenseInfo LicenseInfo { get { return licenseInfo; } }

        private void InitLangInfo()
        {
            
            LanguageInfo info_de_DE = new LanguageInfo();
            info_de_DE.languageCode = "de-DE";
            info_de_DE.languageName = "German, Germany";
            info_de_DE.hunspellAffFile = "de_DE_frami.aff";
            info_de_DE.hunspellDictFile = "de_DE_frami.dic";
            info_de_DE.hunspellKey = "";
            info_de_DE.hyphenDictFile = "hyph_de_DE.dic";

            dictMap.Add(0x0407, info_de_DE);

            LanguageInfo info_en_US = new LanguageInfo ();
            info_en_US.languageCode = "en-US";
            info_en_US.languageName = "English, United States";
            info_en_US.hunspellAffFile = "en_us.aff";
            info_en_US.hunspellDictFile = "en_us.dic";
            info_en_US.hunspellKey = "";
            info_en_US.hyphenDictFile = "hyph_en_us.dic";
            info_en_US.thesIdxFile = "th_en_us_new.idx";
            info_en_US.thesDatFile = "th_en_us_new.dat";

            dictMap.Add(0x0409, info_en_US);

            LanguageInfo info_ru_RU = new LanguageInfo();
            info_ru_RU.languageCode = "ru-RU";
            info_ru_RU.languageName = "Russian, Russian Federation";
            info_ru_RU.hunspellAffFile = "ru_RU.aff";
            info_ru_RU.hunspellDictFile = "ru_RU.dic";
            info_ru_RU.hunspellKey = "";

            dictMap.Add(0x0419, info_ru_RU);
            
        }
    
        public static void RegisterRoutes(RouteCollection routes)
        {
            string sRoute = ConfigurationSettings.AppSettings["fonts.route"] ?? "fonts/";
            routes.Add(new Route(sRoute + "native/{fontname}", new FontServiceRoute()));
            routes.Add(new Route(sRoute + "js/{fontname}", new FontServiceRoute()));
        }

        void Application_Start(object sender, EventArgs e)
        {

            System.Diagnostics.Debug.Print("Application_Start() fired!" + sender.ToString());
            
            try
            {
                XmlConfigurator.Configure();
            }
            catch(Exception ex)
            {
            }

            RegisterRoutes(RouteTable.Routes);

            licenseInfo = LicenseInfo.CreateLicenseInfo(new DateTime(c_nBuildTimeYear, c_nBuildTimeMonth, c_nBuildTimeDay));

        }

        void Application_End(object sender, EventArgs e)
        {
            System.Diagnostics.Debug.Print("Application_End() fired!" + sender.ToString());
        }

        void Application_Error(object sender, EventArgs e)
        {

        }

        void Session_Start(object sender, EventArgs e)
        {

        }

        void Session_End(object sender, EventArgs e)
        {

        }

        void CurrentDomain_AssemblyLoad(object sender, AssemblyLoadEventArgs args)
        {

        }

        void Application_BeginRequest(Object sender, EventArgs e)
        {

        }
</script>
