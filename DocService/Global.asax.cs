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
using System.IO;
using System.Threading;
using System.Collections.Generic;
using System.Web.Routing;
using log4net.Config;
using FileConverterUtils2;
using System.Configuration;
using System.Web;

namespace DocService
{
    public class Global : System.Web.HttpApplication
    {
    static public Object lockThis = new Object();

        public static void RegisterRoutes(RouteCollection routes)
        {
            string sRoute = ConfigurationSettings.AppSettings["fonts.route"] ?? "fonts/";
            routes.Add(new Route(sRoute + "native/{fontname}", new FontServiceRoute()));
            routes.Add(new Route(sRoute + "js/{fontname}", new FontServiceRoute()));
			routes.Add(new Route(sRoute + "odttf/{fontname}", new FontServiceRoute()));
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
    }
}