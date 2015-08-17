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
using System.Net;
using System.Configuration;
using System.Web;
using System.IO;
using System.Text;

namespace DocService
{
public class fileDownloader : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        try
        {

            System.IO.FileInfo file = new System.IO.FileInfo(Convert.ToString(context.Server.MapPath(context.Server.UrlDecode("~" + context.Request.QueryString[0]))));
            string sOutputFilename = null;
            if (context.Request.QueryString.Count > 1)
                sOutputFilename = context.Server.UrlDecode(context.Request.QueryString[1]);
            if (string.IsNullOrEmpty(sOutputFilename))
                sOutputFilename = file.Name;
            if (!file.Exists)
                return;
            context.Response.Clear();
            context.Response.ContentType = "application/octet-stream";
            if (context.Request.ServerVariables.Get("HTTP_USER_AGENT").Contains("MSIE"))
                context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + context.Server.UrlEncode(sOutputFilename) + "\"");
            else
                context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + sOutputFilename + "\"");
            context.Response.AppendHeader("Content-Length", file.Length.ToString());
            context.Response.TransmitFile(file.FullName);
            context.Response.Flush();
            context.ApplicationInstance.CompleteRequest();
        }
        catch(Exception){}
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
    
    public static string GetIP4Address()
    {
        string IP4Address = String.Empty;

        foreach (IPAddress IPA in Dns.GetHostAddresses(HttpContext.Current.Request.UserHostAddress))
        {
            if (IPA.AddressFamily.ToString() == "InterNetwork")
            {
                IP4Address = IPA.ToString();
                break;
            }
        }

        if (IP4Address != String.Empty)
        {
            return IP4Address;
        }

        foreach (IPAddress IPA in Dns.GetHostAddresses(Dns.GetHostName()))
        {
            if (IPA.AddressFamily.ToString() == "InterNetwork")
            {
                IP4Address = IPA.ToString();
                break;
            }
        }

        return IP4Address;
    }
}
}