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
using System.Text;
using System.Xml;
using System.Data;
using System.Configuration;
using System.Net;
using System.Web.Script.Serialization;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Reflection;
using System.ComponentModel;

using ASC.Common.Data;
using ASC.Common.Data.Sql;
using ASC.Common.Data.Sql.Expressions;

namespace FileConverterUtils2
{
    public class Constants
    {
        public const int gc_nAVS_ERROR_FIRST = -2147220736;
        public const int gc_nAVS_ERROR_PASSWORD = gc_nAVS_ERROR_FIRST + 0x0005;
        public const int gc_nAVS_ERROR_DRM = gc_nAVS_ERROR_FIRST + 0x0006;
        public const int gc_nAVS_FILEUTILS_ERROR_FIRST = gc_nAVS_ERROR_FIRST + 0x1000;
        public const string mc_sDateTimeFormat = "yyyy-MM-dd HH:mm:ss.fff";
        public const string mc_sSqlLiteProvider = "System.Data.SQLite";
        public const string mc_sPostgreProvider = "Npgsql";
        public static System.Globalization.CultureInfo mc_oCultureInfo = new System.Globalization.CultureInfo(0x409);
        public const string mc_sResourceServiceUrlRel = "/ResourceService.ashx?path=";

        public const string mc_sWebClientUserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)";
        public const int mc_nBufferSize = 1024 * 1024;
    }
    public class Utils
    {
        private class TxtCsvPropertiesEncoding
        {
            public int codepage { get; set; }
            public string name { get; set; }
            public TxtCsvPropertiesEncoding()
            {
            }
            public TxtCsvPropertiesEncoding(int _codepage, string _name)
            {
                codepage = _codepage;
                name = _name;
            }
        }
        private class TxtCsvProperties
        {
            public string filename { get; set; }
            public int? codepage { get; set; }
            public int? delimiter { get; set; }
            public List<TxtCsvPropertiesEncoding> encodings { get; set; }
            public TxtCsvProperties()
            {
                encodings = new List<TxtCsvPropertiesEncoding>();
            }
        }
        private static readonly System.Collections.Generic.Dictionary<string, string> _mappings = new System.Collections.Generic.Dictionary<string, string>()
        {
            {".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
            {".doc", "application/msword"},
            {".odt", "application/vnd.oasis.opendocument.text"},
            {".rtf", "application/rtf"},
            {".txt", "text/plain"},
            {".html", "text/html"},
            {".mht", "message/rfc822"},
            {".epub", "application/zip"},
            {".fb2", "text/xml"},
            {".mobi", "application/x-mobipocket-ebook"},
            {".prc", "application/x-mobipocket-ebook"},
            {".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"},
            {".ppt", "application/vnd.ms-powerpoint"},
            {".odp", "application/vnd.oasis.opendocument.presentation"},
            {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
            {".xls", "application/vnd.ms-excel"},
            {".ods", "application/vnd.oasis.opendocument.spreadsheet"},
            {".csv", "text/csv"},
            {".pdf", "application/pdf"},
            {".swf", "application/x-shockwave-flash"},
            {".djvu", "image/vnd.djvu"},
            {".xps", "application/vnd.ms-xpsdocument"},
            {".svg", "image/svg+xml"},
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".jpe", "image/jpeg" },
            { ".png", "image/png" },
            { ".gif", "image/gif" },
            { ".bmp", "image/bmp" },
            { ".json", "application/json" },
            { ".ttc", "application/octet-stream" },
            { ".otf", "application/octet-stream" }
        };
        public delegate string getMD5HexStringDelegate(Stream stream);
        public static string getMD5HexString(Stream stream)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            using (System.Security.Cryptography.MD5 oMD5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] aHash = oMD5.ComputeHash(stream);
                for (int i = 0, length = aHash.Length; i < length; ++i)
                    sb.Append(aHash[i].ToString("X2"));
            }
            return sb.ToString();
        }
        public static string GetSerializedEncodingProperty(string sFilename, int? codepage, int? delimiter)
        {
            TxtCsvProperties oCsvProperties = new TxtCsvProperties();
            oCsvProperties.filename = sFilename;
            oCsvProperties.codepage = codepage;
            oCsvProperties.delimiter = delimiter;
            System.Text.EncodingInfo[] aSystemEncodings = System.Text.Encoding.GetEncodings();
            for (int i = 0; i < aSystemEncodings.Length; i++)
            {
                System.Text.EncodingInfo oEncodingInfo = aSystemEncodings[i];
                oCsvProperties.encodings.Add(new TxtCsvPropertiesEncoding(oEncodingInfo.CodePage, oEncodingInfo.DisplayName));
            }
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(oCsvProperties);
        }
        public static void GetDeserializedEncodingProperty(string sJson, out string sFilename, out  int? codepage, out  int? delimiter)
        {
            sFilename = null;
            codepage = null;
            delimiter = null;
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            TxtCsvProperties oTxtCsvProperties = serializer.Deserialize<TxtCsvProperties>(sJson);
            if (null != oTxtCsvProperties)
            {
                sFilename = oTxtCsvProperties.filename;
                codepage = oTxtCsvProperties.codepage;
                delimiter = oTxtCsvProperties.delimiter;
            }
        }
        
        public static string GetIP4Address(string strUserHostAddress)
        {
            string IP4Address = String.Empty;

            foreach (IPAddress IPA in Dns.GetHostAddresses(strUserHostAddress))
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
        public static string MySqlEscape(string strString, string strConnectionString)
        {
            string strConnectionProviderName = GetDbConnectionProviderName(strConnectionString);
            if (strConnectionProviderName == Constants.mc_sSqlLiteProvider)
                return strString;
            else if (strConnectionProviderName == Constants.mc_sPostgreProvider)
            {
                if (strString == null)
                    return null;
                else
                    return strString.Replace("'", "''");
            }
            if (strString == null)
            {
                return null;
            }

            return System.Text.RegularExpressions.Regex.Replace(strString, @"[\r\n\x00\x1a\\'""]", @"\$0");
        }
        public static string GetDbConnectionProviderName(string strConnectionString)
        {
            ConnectionStringSettings oConnectionSettings = ConfigurationManager.ConnectionStrings[strConnectionString];
            return oConnectionSettings.ProviderName;
        }
        public static int mapAscServerErrorToOldError(ErrorTypes eError)
		{
			int nRes = -1;
			switch(eError)
			{
				case ErrorTypes.NoError : nRes = 0;break;
				case ErrorTypes.TaskQueue :
				case ErrorTypes.TaskResult : nRes = -6;break;
				case ErrorTypes.ConvertDownload : nRes = -4;break;
				case ErrorTypes.ConvertTimeout : nRes = -2;break;
                case ErrorTypes.ConvertMS_OFFCRYPTO:
				case ErrorTypes.ConvertUnknownFormat :
				case ErrorTypes.ConvertReadFile :
				case ErrorTypes.Convert : nRes = -3;break;
				case ErrorTypes.UploadContentLength : nRes = -9;break;
				case ErrorTypes.UploadExtension : nRes = -10;break;
				case ErrorTypes.UploadCountFiles : nRes = -11;break;
				case ErrorTypes.VKey : nRes = -8;break;
				case ErrorTypes.VKeyEncrypt : nRes = -20;break;
				case ErrorTypes.VKeyKeyExpire : nRes = -21;break;
				case ErrorTypes.VKeyUserCountExceed : nRes = -22;break;
				case ErrorTypes.Storage :
				case ErrorTypes.StorageFileNoFound :
				case ErrorTypes.StorageRead :
				case ErrorTypes.StorageWrite :
				case ErrorTypes.StorageRemoveDir :
				case ErrorTypes.StorageCreateDir :
				case ErrorTypes.StorageGetInfo :
				case ErrorTypes.Upload :
				case ErrorTypes.ReadRequestStream :
				case ErrorTypes.Unknown : nRes = -1;break;
			}
			return nRes;
		}
        public static string GetMimeType(string sPath)
        {
            string sExt = Path.GetExtension(sPath).ToLower();
            string mime;
            return _mappings.TryGetValue(sExt, out mime) ? mime : "application/octet-stream";
        }
        public static string GetTempDirectory()
        {
            string tempDirectory = null;
            do
            {
                tempDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            }
            while (Directory.Exists(tempDirectory));
            return tempDirectory;
        }
        public static string SerializeToXml(Type oType, object oData)
        {
            string sRes = "";
            using (MemoryStream ms = new MemoryStream())
            {
                XmlWriterSettings ws = new XmlWriterSettings();
                ws.NewLineHandling = NewLineHandling.None;
                ws.Indent = false;
                ws.Encoding = new UTF8Encoding(false);
                XmlWriter xw = System.Xml.XmlWriter.Create(ms, ws);
                System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(oType);
                formatter.Serialize(xw, oData);
                sRes = Encoding.UTF8.GetString(ms.GetBuffer(), 0, (int)ms.Position);
            }
            return sRes;
        }
        public static object DeserializeFromXml(Type oType, string sXml)
        {
            object oRes = null;
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(sXml)))
            {
                System.Xml.Serialization.XmlSerializer formatter = new System.Xml.Serialization.XmlSerializer(oType);
                oRes = formatter.Deserialize(ms);
            }
            return oRes;
        }
        public static bool ConvertGifIcoToPng(byte[] aInput, int nImageFormat, out byte[] aOutput)
        {
            aOutput = null;
            bool bRes = false;
            if (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_GIF == nImageFormat)
            {
                using (MemoryStream ms = new MemoryStream(aInput))
                {
                    System.Drawing.Image oImage = System.Drawing.Image.FromStream(ms);
                    using (MemoryStream ms2 = new MemoryStream())
                    {
                        oImage.Save(ms2, System.Drawing.Imaging.ImageFormat.Png);
                        aOutput = ms2.ToArray();
                        bRes = true;
                    }
                }
            }
            else if (FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_ICO == nImageFormat)
            {
                using (MemoryStream ms = new MemoryStream(aInput))
                {

                    System.Drawing.Icon oIcon = new System.Drawing.Icon(ms, new System.Drawing.Size(256, 256));
                    using (MemoryStream ms2 = new MemoryStream())
                    {
                        oIcon.ToBitmap().Save(ms2, System.Drawing.Imaging.ImageFormat.Png);
                        aOutput = ms2.ToArray();
                        bRes = true;
                    }
                }
            }
            return bRes;
        }
        public static int CompareStringByLength(string x, string y)
        {
            if (null != x && null != y)
            {
                if (x.Length == y.Length)
                    return x.CompareTo(y);
                else
                    return x.Length - y.Length;
            }
            else
            {
                if (null != x)
                    return 1;
                else if (null != y)
                    return -1;
            }
            return 0;
        }
        public static string GetContentDisposition(string sUserAgent, string sBrowser, string sVersion, string sFilename)
        {
            
            string contentDisposition;
            if (sBrowser == "IE" && (sVersion == "7.0" || sVersion == "8.0"))
                contentDisposition = "attachment; filename=" + Uri.EscapeDataString(sFilename);
            else if (sUserAgent != null && sUserAgent.ToLowerInvariant().Contains("android")) 
                contentDisposition = "attachment; filename=\"" + MakeAndroidSafeFileName(sFilename) + "\"";
            else
                contentDisposition = "attachment; filename=\"" + sFilename + "\"; filename*=UTF-8''" + Uri.EscapeDataString(sFilename);
            return contentDisposition;
        }
        private static string MakeAndroidSafeFileName(string fileName)
        {
            char[] newFileName = fileName.ToCharArray();
            for (int i = 0; i < newFileName.Length; i++)
            {
                if (-1 == "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ._-+,@£$€!½§~'=()[]{}0123456789".IndexOf(newFileName[i]))
                    newFileName[i] = '_';
            }
            return new string(newFileName);
        }
    }
    public class FileFormats
    {
        public static int FromString(string sFormat)
        {
            switch (sFormat.ToLower())
            {
                case "docx": return AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX;
                case "doc": return AVS_OFFICESTUDIO_FILE_DOCUMENT_DOC;
                case "odt": return AVS_OFFICESTUDIO_FILE_DOCUMENT_ODT;
                case "rtf": return AVS_OFFICESTUDIO_FILE_DOCUMENT_RTF;
                case "txt":
                case "xml":
                case "xslt": return AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT;
                case "html": return AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML;
                case "mht": return AVS_OFFICESTUDIO_FILE_DOCUMENT_MHT;
                case "epub": return AVS_OFFICESTUDIO_FILE_DOCUMENT_EPUB;
                case "fb2": return AVS_OFFICESTUDIO_FILE_DOCUMENT_FB2;
                case "mobi": return AVS_OFFICESTUDIO_FILE_DOCUMENT_MOBI;

                case "pptx": return AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX;
                case "ppt": return AVS_OFFICESTUDIO_FILE_PRESENTATION_PPT;
                case "odp": return AVS_OFFICESTUDIO_FILE_PRESENTATION_ODP;
                case "ppsx": return AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX;

                case "xlsx": return AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX;
                case "xls": return AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS;
                case "ods": return AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS;
                case "csv": return AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV;

                case "jpeg":
                case "jpe":
                case "jpg": return AVS_OFFICESTUDIO_FILE_IMAGE_JPG;
                case "tif":
                case "tiff": return AVS_OFFICESTUDIO_FILE_IMAGE_TIFF;
                case "tga": return AVS_OFFICESTUDIO_FILE_IMAGE_TGA;
                case "gif": return AVS_OFFICESTUDIO_FILE_IMAGE_GIF;
                case "png": return AVS_OFFICESTUDIO_FILE_IMAGE_PNG;
                case "emf": return AVS_OFFICESTUDIO_FILE_IMAGE_EMF;
                case "wmf": return AVS_OFFICESTUDIO_FILE_IMAGE_WMF;
                case "bmp": return AVS_OFFICESTUDIO_FILE_IMAGE_BMP;
                case "cr2": return AVS_OFFICESTUDIO_FILE_IMAGE_CR2;
                case "pcx": return AVS_OFFICESTUDIO_FILE_IMAGE_PCX;
                case "ras": return AVS_OFFICESTUDIO_FILE_IMAGE_RAS ;
                case "psd": return AVS_OFFICESTUDIO_FILE_IMAGE_PSD;
                case "ico": return AVS_OFFICESTUDIO_FILE_IMAGE_ICO;

                case "pdf": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF;
                case "swf": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SWF;
                case "djvu": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_DJVU;
                case "xps": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_XPS;
                case "svg": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG;
                case "htmlr": return AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLR;
                case "doct": return AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY;
                case "xlst": return AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY;
                case "pptt": return AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY;
                default: return AVS_OFFICESTUDIO_FILE_UNKNOWN;
            }
        }
        public static string ToString(int nFormat)
        {
            switch (nFormat)
            {
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX: return "docx";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_DOC: return "doc";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_ODT: return "odt";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_RTF: return "rtf";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT: return "txt";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML: return "html";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_MHT: return "mht";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_EPUB: return "epub";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_FB2: return "fb2";
                case AVS_OFFICESTUDIO_FILE_DOCUMENT_MOBI: return "mobi";

                case AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX: return "pptx";
                case AVS_OFFICESTUDIO_FILE_PRESENTATION_PPT: return "ppt";
                case AVS_OFFICESTUDIO_FILE_PRESENTATION_ODP: return "odp";
                case AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX: return "ppsx";

                case AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX: return "xlsx";
                case AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS: return "xls";
                case AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS: return "ods";
                case AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV: return "csv";

                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF: return "pdf";
                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SWF: return "swf";
                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_DJVU: return "djvu";
                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_XPS: return "xps";
                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG: return "svg";
                case AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLR: return "htmlr";

                case AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP: return "zip";

                case AVS_OFFICESTUDIO_FILE_IMAGE: return "jpg";
                case AVS_OFFICESTUDIO_FILE_IMAGE_JPG: return "jpg";
                case AVS_OFFICESTUDIO_FILE_IMAGE_TIFF: return "tiff";
                case AVS_OFFICESTUDIO_FILE_IMAGE_TGA: return "tga";
                case AVS_OFFICESTUDIO_FILE_IMAGE_GIF: return "gif";
                case AVS_OFFICESTUDIO_FILE_IMAGE_PNG: return "png";
                case AVS_OFFICESTUDIO_FILE_IMAGE_EMF: return "emf";
                case AVS_OFFICESTUDIO_FILE_IMAGE_WMF: return "wmf";
                case AVS_OFFICESTUDIO_FILE_IMAGE_BMP: return "bmp";
                case AVS_OFFICESTUDIO_FILE_IMAGE_CR2: return "cr2";
                case AVS_OFFICESTUDIO_FILE_IMAGE_PCX: return "pcx";
                case AVS_OFFICESTUDIO_FILE_IMAGE_RAS: return "ras";
                case AVS_OFFICESTUDIO_FILE_IMAGE_PSD: return "psd";
                case AVS_OFFICESTUDIO_FILE_IMAGE_ICO: return "ico";
                
                case AVS_OFFICESTUDIO_FILE_CANVAS_WORD:
                case AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET:
                case AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION: return "bin";
                case AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT:
                case AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY: return "doct";
                case AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY: return "xlst";
                case AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION:
                case AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING:
                case AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY: return "pptt";
                default: return "";
            }
        }
        public const int AVS_OFFICESTUDIO_FILE_UNKNOWN = 0x0000;

        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT = 0x0040;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_DOC = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_ODT = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_RTF = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0004;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0005;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0006;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_MHT = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0007;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_EPUB = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0008;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_FB2 = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x0009;
        public const int AVS_OFFICESTUDIO_FILE_DOCUMENT_MOBI = AVS_OFFICESTUDIO_FILE_DOCUMENT + 0x000a;

        public const int AVS_OFFICESTUDIO_FILE_PRESENTATION = 0x0080;
        public const int AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX = AVS_OFFICESTUDIO_FILE_PRESENTATION + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_PRESENTATION_PPT = AVS_OFFICESTUDIO_FILE_PRESENTATION + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_PRESENTATION_ODP = AVS_OFFICESTUDIO_FILE_PRESENTATION + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX = AVS_OFFICESTUDIO_FILE_PRESENTATION + 0x0004;

        public const int AVS_OFFICESTUDIO_FILE_SPREADSHEET = 0x0100;
        public const int AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX = AVS_OFFICESTUDIO_FILE_SPREADSHEET + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS = AVS_OFFICESTUDIO_FILE_SPREADSHEET + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS = AVS_OFFICESTUDIO_FILE_SPREADSHEET + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV = AVS_OFFICESTUDIO_FILE_SPREADSHEET + 0x0004;

        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM = 0x0200;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SWF = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_DJVU = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_XPS = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0004;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0005;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLR = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0006;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLRMenu = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0007;
        public const int AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLRCanvas = AVS_OFFICESTUDIO_FILE_CROSSPLATFORM + 0x0008;

        public const int AVS_OFFICESTUDIO_FILE_IMAGE = 0x0400;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_JPG = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_TIFF = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_TGA = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_GIF = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0004;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_PNG = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0005;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_EMF = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0006;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_WMF = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0007;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_BMP = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0008;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_CR2 = AVS_OFFICESTUDIO_FILE_IMAGE + 0x0009;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_PCX = AVS_OFFICESTUDIO_FILE_IMAGE + 0x000a;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_RAS = AVS_OFFICESTUDIO_FILE_IMAGE + 0x000b;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_PSD = AVS_OFFICESTUDIO_FILE_IMAGE + 0x000c;
        public const int AVS_OFFICESTUDIO_FILE_IMAGE_ICO = AVS_OFFICESTUDIO_FILE_IMAGE + 0x000d;

        public const int AVS_OFFICESTUDIO_FILE_OTHER = 0x0800;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_EXTRACT_IMAGE = AVS_OFFICESTUDIO_FILE_OTHER + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_MS_OFFCRYPTO = AVS_OFFICESTUDIO_FILE_OTHER + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP = AVS_OFFICESTUDIO_FILE_OTHER + 0x0003;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT = AVS_OFFICESTUDIO_FILE_OTHER + 0x0004;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION = AVS_OFFICESTUDIO_FILE_OTHER + 0x0005;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING = AVS_OFFICESTUDIO_FILE_OTHER + 0x0006;
        public const int AVS_OFFICESTUDIO_FILE_OTHER_TEAMLAB_INNER = AVS_OFFICESTUDIO_FILE_OTHER + 0x0007;

        public const int AVS_OFFICESTUDIO_FILE_TEAMLAB = 0x1000;
        public const int AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY = AVS_OFFICESTUDIO_FILE_TEAMLAB + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY = AVS_OFFICESTUDIO_FILE_TEAMLAB + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY = AVS_OFFICESTUDIO_FILE_TEAMLAB + 0x0003;

        public const int AVS_OFFICESTUDIO_FILE_CANVAS = 0x2000;
        public const int AVS_OFFICESTUDIO_FILE_CANVAS_WORD = AVS_OFFICESTUDIO_FILE_CANVAS + 0x0001;
        public const int AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET = AVS_OFFICESTUDIO_FILE_CANVAS + 0x0002;
        public const int AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION = AVS_OFFICESTUDIO_FILE_CANVAS + 0x0003;
    }
    public enum FileStatus : byte
    {
        None = 0,
        Ok = 1,
        WaitQueue = 2,
        NeedParams = 3,
        Convert = 4,
        Err = 5,
        ErrToReload = 6,
        SaveVersion = 7,
        UpdateVersion = 8
    };
    public static class StringEnum
    {
        public static string GetStringValue(Enum value)
        {
            string output = "";
            Type type = value.GetType();
            FieldInfo fi = type.GetField(value.ToString());
            DescriptionAttribute[] attrs = fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
            if (attrs.Length > 0)
                output = attrs[0].Description;
            return output;
        }
    }
    public enum FileStatusOut : byte
    {
        [Description("Unknown status.")]
        NotFound = 0,
        [Description("The document is editing.")]
        Editing = 1,
        [Description("The document is ready for save.")]
        MustSave = 2,
        [Description("The document corrupted.")]
        Corrupted = 3,
        [Description("The document closed.")]
        Closed = 4
    };
    public enum ErrorTypes : int
    {
        NoError = 0,
        Unknown = -1,
        ReadRequestStream = -3,
        WebRequest = -4,
        TaskQueue = -20,
        TaskResult = -40,
        Storage = -60,
        StorageFileNoFound = -61,
        StorageRead = -62,
        StorageWrite = -63,
        StorageRemoveDir = -64,
        StorageCreateDir = -65,
        StorageGetInfo = -66,
        Convert = -80,
        ConvertDownload = -81,
        ConvertUnknownFormat = -82,
        ConvertTimeout = -83,
        ConvertReadFile = -84,
        ConvertMS_OFFCRYPTO = -85,
        ConvertCorrupted = -86,
        ConvertLibreOffice = -87,
		ConvertParams = -88,
        Upload = -100,
        UploadContentLength = -101,
        UploadExtension = -102,
        UploadCountFiles = -103,
        VKey = -120,
        VKeyEncrypt = -121,
        VKeyKeyExpire = -122,
        VKeyUserCountExceed = -123,
        VKeyTimeExpire = -124,
        VKeyTimeIncorrect = -125,
        LicenseError = -140,
        LicenseErrorType = -141,
        LicenseErrorArgument = -142,
        LicenseErrorPermission = -143,
        LicenseErrorActiveConnectionQuotaExceed = -144,
        LicenseErrorInvalidDate = -145,
        LicenseErrorFile = -146,
        EditorChanges = -160
    };

    public class InputCommand
    {
        public string id { get; set; }
        public string format { get; set; }
        public int editorid { get; set; }
        public string c { get; set; }
        public string url { get; set; }
        public string vkey { get; set; }
        public string title { get; set; }
        public string data { get; set; }
        public int? outputformat { get; set; }
        public string savetype { get; set; }
        public string savekey { get; set; }
        public int? codepage { get; set; }
        public int? delimiter { get; set; }
        public bool embeddedfonts { get; set; }
        public bool innersave { get; set; }
        public string userid { get; set; }
        
        public int status { get; set; }
        public int status_info { get; set; }
        public TaskQueueData task_queue_data { get; set; }

        public InputCommand()
        {
            innersave = false;
        }
        public static string SerializeToJson(InputCommand oData)
        {
            return new JavaScriptSerializer().Serialize(oData);
        }
        public static InputCommand DeserializeFromJson(string sJson)
        {
            return new JavaScriptSerializer().Deserialize<InputCommand>(sJson) as InputCommand;
        }
    }
    
    public enum CsvDelimiter : int
    {
        None = 0,
        Tab = 1,
        Semicolon = 2,
        Сolon = 3,
        Comma = 4,
        Space = 5
    }
    public enum Priority : int
    {
        Low = 0,
        Normal = 1,
        High = 2
    };
    public enum PostMessageType : int
    {
        UploadImage = 0
    };
    public class FormatChecker
    {
        private static int GetFileFormatBySignature(byte[] aBuffer)
        {
            int nLength = aBuffer.Length;

            if ((5 <= nLength) && '{' == aBuffer[0] && '\\' == aBuffer[1] && 'r' == aBuffer[2] && 't' == aBuffer[3] && 'f' == aBuffer[4])
                return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_RTF;

            string sText = Encoding.ASCII.GetString(aBuffer, 0, 20);
            if (-1 != sText.IndexOf("%PDF-"))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF;
            else if(0 == sText.IndexOf("DOCY"))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD;
            else if (0 == sText.IndexOf("XLSY"))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET;
            else if (0 == sText.IndexOf("PPTY"))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION;

            bool tagOpen = false;

            for (int i = 0; i < nLength - 11 && i < 100; i++)
            {
                if (0x3C == aBuffer[i])
                    tagOpen = true;
                else if (0x3E == aBuffer[i])
                    tagOpen = false;
                else if (tagOpen && 0x46 == aBuffer[i] && 0x69 == aBuffer[i + 1] && 0x63 == aBuffer[i + 2]
                                 && 0x74 == aBuffer[i + 3] && 0x69 == aBuffer[i + 4] && 0x6F == aBuffer[i + 5]
                                 && 0x6E == aBuffer[i + 6] && 0x42 == aBuffer[i + 7] && 0x6F == aBuffer[i + 8]
                                 && 0x6F == aBuffer[i + 9] && 0x6B == aBuffer[i + 10])
                    return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_FB2;
                else if (tagOpen && (0x48 == aBuffer[i] || 0x68 == aBuffer[i]) && (0x54 == aBuffer[i + 1] || 0x74 == aBuffer[i + 1])
                                 && (0x4d == aBuffer[i + 2] || 0x6d == aBuffer[i + 2]) && (0x4c == aBuffer[i + 3] || 0x6c == aBuffer[i + 3]))
                    return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML;
            }

            if ((8 <= nLength) && 0x41 == aBuffer[0] && 0x54 == aBuffer[1] && 0x26 == aBuffer[2] && 0x54 == aBuffer[3] && 0x46 == aBuffer[4] && 0x4f == aBuffer[5] && 0x52 == aBuffer[6] && 0x4d == aBuffer[7])
                return FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_DJVU;

            if (68 <= nLength && (('B' == aBuffer[60] && 'O' == aBuffer[61] && 'O' == aBuffer[62] && 'K' == aBuffer[63] && 'M' == aBuffer[64] && 'O' == aBuffer[65] && 'B' == aBuffer[66] && 'I' == aBuffer[67])
                               || ('T' == aBuffer[60] && 'E' == aBuffer[61] && 'X' == aBuffer[62] && 't' == aBuffer[63] && 'R' == aBuffer[64] && 'E' == aBuffer[65] && 'A' == aBuffer[66] && 'D' == aBuffer[67])))
                return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_MOBI;

            if ((3 <= nLength) && (0xFF == aBuffer[0]) && (0xD8 == aBuffer[1]) && (0xFF == aBuffer[2]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_JPG;

            if ((34 <= nLength) && (0x42 == aBuffer[0]) && (0x4D == aBuffer[1]) &&
                (0x00 == aBuffer[6]) && (0x00 == aBuffer[7]) && (0x01 == aBuffer[26]) && (0x00 == aBuffer[27]) &&
                ((0x00 == aBuffer[28]) || (0x01 == aBuffer[28]) || (0x04 == aBuffer[28]) || (0x08 == aBuffer[28]) ||
                (0x10 == aBuffer[28]) || (0x18 == aBuffer[28]) || (0x20 == aBuffer[28])) && (0x00 == aBuffer[29]) &&
                ((0x00 == aBuffer[30]) || (0x01 == aBuffer[30]) || (0x02 == aBuffer[30]) || (0x03 == aBuffer[30]) ||
                (0x04 == aBuffer[30]) || (0x05 == aBuffer[30])) && (0x00 == aBuffer[31]) && (0x00 == aBuffer[32]) && (0x00 == aBuffer[33]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_BMP;

            if ((4 <= nLength) && "GIF8" == System.Text.Encoding.ASCII.GetString(aBuffer, 0, "GIF8".Length))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_GIF;
            if ((6 <= nLength) && ("GIF87a" == System.Text.Encoding.ASCII.GetString(aBuffer, 0, "GIF87a".Length) || "GIF89a" == System.Text.Encoding.ASCII.GetString(aBuffer, 0, "GIF89a".Length)))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_GIF;

            if ((16 <= nLength) && (0x89 == aBuffer[0]) && (0x50 == aBuffer[1]) && (0x4E == aBuffer[2]) && (0x47 == aBuffer[3])
                && (0x0D == aBuffer[4]) && (0x0A == aBuffer[5]) && (0x1A == aBuffer[6]) && (0x0A == aBuffer[7])
                && (0x00 == aBuffer[8]) && (0x00 == aBuffer[9]) && (0x00 == aBuffer[10]) && (0x0D == aBuffer[11])
                && (0x49 == aBuffer[12]) && (0x48 == aBuffer[13]) && (0x44 == aBuffer[14]) && (0x52 == aBuffer[15]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_PNG;

            if ((10 <= nLength) && (0x49 == aBuffer[0]) && (0x49 == aBuffer[1]) && (0x2A == aBuffer[2])
                && (0x00 == aBuffer[3]) && (0x10 == aBuffer[4]) && (0x00 == aBuffer[5]) && (0x00 == aBuffer[6])
                && (0x00 == aBuffer[7]) && (0x43 == aBuffer[8]) && (0x52 == aBuffer[9]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_CR2;

            if (4 <= nLength)
            {
                if (((0x49 == aBuffer[0]) && (0x49 == aBuffer[1]) && (0x2A == aBuffer[2]) && (0x00 == aBuffer[3])) ||
                    ((0x4D == aBuffer[0]) && (0x4D == aBuffer[1]) && (0x00 == aBuffer[2]) && (0x2A == aBuffer[3])) ||
                    ((0x49 == aBuffer[0]) && (0x49 == aBuffer[1]) && (0x2A == aBuffer[2]) && (0x00 == aBuffer[3])))
                    return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_TIFF;
            }

            if (6 <= nLength)
            {
                if (((0xD7 == aBuffer[0]) && (0xCD == aBuffer[1]) && (0xC6 == aBuffer[2]) && (0x9A == aBuffer[3]) && (0x00 == aBuffer[4]) && (0x00 == aBuffer[5])) ||
                    ((0x01 == aBuffer[0]) && (0x00 == aBuffer[1]) && (0x09 == aBuffer[2]) && (0x00 == aBuffer[3]) && (0x00 == aBuffer[4]) && (0x03 == aBuffer[5])))
                    return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_WMF;
            }

            if ((44 <= nLength) && (0x01 == aBuffer[0]) && (0x00 == aBuffer[1]) && (0x00 == aBuffer[2]) && (0x00 == aBuffer[3]) &&
                (0x20 == aBuffer[40]) && (0x45 == aBuffer[41]) && (0x4D == aBuffer[42]) && (0x46 == aBuffer[43]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_EMF;

            if ((4 <= nLength) && (0x0A == aBuffer[0]) && (0x00 == aBuffer[1] || 0x01 == aBuffer[1] ||
                0x02 == aBuffer[1] || 0x03 == aBuffer[1] || 0x04 == aBuffer[1] || 0x05 == aBuffer[1]) &&
                (0x01 == aBuffer[3] || 0x02 == aBuffer[3] || 0x04 == aBuffer[3] || 0x08 == aBuffer[3]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_PCX;

            if ((17 <= nLength) && ((0x01 == aBuffer[1] && 0x01 == aBuffer[2]) || (0x00 == aBuffer[1] && 0x02 == aBuffer[2]) ||
                (0x00 == aBuffer[1] && 0x03 == aBuffer[2]) || (0x01 == aBuffer[1] && 0x09 == aBuffer[2]) ||
                (0x00 == aBuffer[1] && 0x0A == aBuffer[2]) || (0x00 == aBuffer[1] && 0x0B == aBuffer[2]))
                && (0x08 == aBuffer[16] || 0x10 == aBuffer[16] || 0x18 == aBuffer[16] || 0x20 == aBuffer[16]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_TGA;

            if ((4 <= nLength) && (0x59 == aBuffer[0]) && (0xA6 == aBuffer[1]) && (0x6A == aBuffer[2]) && (0x95 == aBuffer[3]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_RAS;

            if ((13 <= nLength) && (0x38 == aBuffer[0]) && (0x42 == aBuffer[1]) && (0x50 == aBuffer[2])
                && (0x53 == aBuffer[3]) && (0x00 == aBuffer[4]) && (0x01 == aBuffer[5]) && (0x00 == aBuffer[6])
                && (0x00 == aBuffer[7]) && (0x00 == aBuffer[8]) && (0x00 == aBuffer[9]) && (0x00 == aBuffer[10])
                && (0x00 == aBuffer[11]) && (0x00 == aBuffer[12]))
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_PSD;

            if (4 <= nLength && 0x00 == aBuffer[0] && 0x00 == aBuffer[1] && 0x01 == aBuffer[2] && 0x00 == aBuffer[3])
                return FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_ICO;

            if ((4 <= nLength) && "<svg" == System.Text.Encoding.ASCII.GetString(aBuffer, 0, "<svg".Length))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG;

            return FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
        }
        private static int GetFileFormatByZip(Ionic.Zip.ZipFile oZipFile)
        {
            
            if (oZipFile.ContainsEntry("[Content_Types].xml"))
            {
                Ionic.Zip.ZipEntry oEntry = oZipFile["[Content_Types].xml"];
                using (MemoryStream oMemoryStream = new MemoryStream((int)oEntry.UncompressedSize))
                {
                    oEntry.Extract(oMemoryStream);
                    oMemoryStream.Position = 0;
                    string sContent = System.Text.UTF8Encoding.UTF8.GetString(oMemoryStream.GetBuffer(), 0, (int)oMemoryStream.Length);
                    if (-1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-word.document.macroEnabled.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-word.template.macroEnabledTemplate.main+xml"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX;
                    else if (-1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-excel.sheet.macroEnabled.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-excel.template.macroEnabled.main+xml"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX;
                    else if (-1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.presentationml.template.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-powerpoint.presentation.macroEnabled.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-powerpoint.slideshow.macroEnabled.main+xml") ||
                        -1 != sContent.IndexOf("application/vnd.ms-powerpoint.template.macroEnabled.main+xml"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX;
                    else if (-1 != sContent.IndexOf("application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX;
                }
            }
            if (oZipFile.ContainsEntry("mimetype"))
            {
                Ionic.Zip.ZipEntry oEntry = oZipFile["mimetype"];
                using (MemoryStream oMemoryStream = new MemoryStream((int)oEntry.UncompressedSize))
                {
                    oEntry.Extract(oMemoryStream);
                    oMemoryStream.Position = 0;
                    string sContent = System.Text.ASCIIEncoding.ASCII.GetString(oMemoryStream.GetBuffer(), 0, (int)oMemoryStream.Length);
                    if (-1 != sContent.IndexOf("application/vnd.oasis.opendocument.text"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_ODT;
                    else if (-1 != sContent.IndexOf("application/vnd.oasis.opendocument.spreadsheet"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS;
                    else if (-1 != sContent.IndexOf("application/vnd.oasis.opendocument.presentation"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_ODP;
                    else if (-1 != sContent.IndexOf("application/epub+zip"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_EPUB;
                }
            }
            if (oZipFile.ContainsEntry("_rels/.rels"))
            {
                Ionic.Zip.ZipEntry oEntry = oZipFile["_rels/.rels"];
                using (MemoryStream oMemoryStream = new MemoryStream((int)oEntry.UncompressedSize))
                {
                    oEntry.Extract(oMemoryStream);
                    oMemoryStream.Position = 0;
                    string sContent = System.Text.ASCIIEncoding.ASCII.GetString(oMemoryStream.GetBuffer(), 0, (int)oMemoryStream.Length);
                    if (-1 != sContent.IndexOf("http://schemas.microsoft.com/xps/2005/06/fixedrepresentation"))
                        return FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_XPS;
                }
            }
            
            if (oZipFile.ContainsEntry("_rels/.rels/[0].piece"))
                return FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_XPS;
            if (oZipFile.ContainsEntry("Editor.bin"))
            {
                Ionic.Zip.ZipEntry oEntry = oZipFile["Editor.bin"];
                int nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
                using (MemoryStream oMemoryStream = new MemoryStream((int)oEntry.UncompressedSize))
                {
                    oEntry.Extract(oMemoryStream);
                    oMemoryStream.Position = 0;
                    int nSignatureLength = 4;
                    if (oMemoryStream.Length >= nSignatureLength)
                    {
                        byte[] aSignature = new byte[nSignatureLength];
                        oMemoryStream.Read(aSignature, 0, nSignatureLength);
                        string sSignature = System.Text.ASCIIEncoding.ASCII.GetString(aSignature);
                        switch (sSignature)
                        {
                            case "DOCY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY; break;
                            case "XLSY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY; break;
                            case "PPTY": nFormat = FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY; break;
                        }
                    }
                }
                if(FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN != nFormat)
                    return nFormat;
            }
            else if (oZipFile.ContainsEntry("Editor.xml"))
            {
                return FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION;
            }
            else if (oZipFile.ContainsEntry("Editor.svg"))
            {
                return FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING;
            }
            else if (oZipFile.ContainsEntry("Editor.html.arch"))
            {
                return FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT;
            }
            return FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
        }
        private static int GetFileFormatStorage(OpenMcdf.CompoundFile oCompoundFile)
        {
            int format = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
            try
            {
                oCompoundFile.RootStorage.GetStream("WordDocument");
                format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_DOC;
            }
            catch
            {
            }
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
            {
                try
                {
                    oCompoundFile.RootStorage.GetStream("Workbook");
                    format = FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS;
                }
                catch
                {
                }
            }
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
            {
                try
                    {
                        oCompoundFile.RootStorage.GetStream("PowerPoint Document");
                        format = FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_PPT;
                    }
                    catch
                    {
                    }
            }
            if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
            {
                try
                {
                    oCompoundFile.RootStorage.GetStorage("\x0006DataSpaces");
                    format = FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_MS_OFFCRYPTO;
                }
                catch
                {
                }
            }
            return format;
        }
        public static int GetFileFormat(string sPath)
        {
            int format = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
            try
            {

                if (new FileInfo(sPath).Length == 0)
                    format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT;
                else
                {
                    
                    using (FileStream fs = new FileStream(sPath, FileMode.Open, FileAccess.Read))
                    {
                        byte[] aBuffer = new byte[100];
                        fs.Read(aBuffer, 0, aBuffer.Length);
                        format = GetFileFormatBySignature(aBuffer);
                    }

                    if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
                    {
                        try
                        {
                            OpenMcdf.CompoundFile oCompoundFile = new OpenMcdf.CompoundFile(sPath);
                            format = GetFileFormatStorage(oCompoundFile);
                            oCompoundFile.Close();
                        }
                        catch
                        {
                        }
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
                        {
                            try
                            {
                                if (Ionic.Zip.ZipFile.IsZipFile(sPath))
                                {
                                    using (Ionic.Zip.ZipFile oZipFile = Ionic.Zip.ZipFile.Read(sPath))
                                    {
                                        format = GetFileFormatByZip(oZipFile);
                                    }
                                }
                            }
                            catch
                            {
                            }
                        }
                        
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
                        {
                            string sExtention = Path.GetExtension(sPath).ToLower();

                            if (".mht" == sExtention)
                                format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_MHT;
                            else if (".txt" == sExtention || ".xml" == sExtention || ".xslt" == sExtention)
                                format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT;
                            else if (".csv" == sExtention)
                                format = FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV;
                            else if (".svg" == sExtention)
                                format = FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_SVG;
                            else if (".html" == sExtention || ".htm" == sExtention)
                                format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML;
                            else
                            {
                                
                                string sExt = Path.GetExtension(sPath);
                                if (sExt.Length > 0 && '.' == sExt[0])
                                    sExt = sExt.Substring(1);
                                format = FileFormats.FromString(sExt);
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return format;
        }
        public static int GetFileFormat(byte[] aBuffer)
        {
            int format = FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN;
            try
            {

                if (aBuffer.Length == 0)
                    format = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT;
                else
                {
                    
                    format = GetFileFormatBySignature(aBuffer);
                    if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
                    {
                        try
                        {
                            using (MemoryStream ms = new MemoryStream(aBuffer))
                            {
                                OpenMcdf.CompoundFile oCompoundFile = new OpenMcdf.CompoundFile(ms);
                                format = GetFileFormatStorage(oCompoundFile);
                                oCompoundFile.Close();
                            }
                        }
                        catch
                        {
                        }
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == format)
                        {
                            try
                            {
                                using (MemoryStream ms = new MemoryStream(aBuffer))
                                {
                                    if (Ionic.Zip.ZipFile.IsZipFile(ms, false))
                                    {
                                        using (Ionic.Zip.ZipFile oZipFile = Ionic.Zip.ZipFile.Read(aBuffer))
                                        {
                                            format = GetFileFormatByZip(oZipFile);
                                        }
                                    }

                                }
                            }
                            catch
                            {
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return format;
        }
    }
}
