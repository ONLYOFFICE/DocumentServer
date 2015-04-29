using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Caching;
using System.Web.Configuration;
using System.Web.UI;
using ASC.Api.DocumentConverter;

namespace OnlineEditorsExample
{
    internal static class FileType
    {
        public static readonly List<string> ExtsSpreadsheet = new List<string>
            {
                ".xls", ".xlsx",
                ".ods", ".csv"
            };

        public static readonly List<string> ExtsPresentation = new List<string>
            {
                ".pps", ".ppsx",
                ".ppt", ".pptx",
                ".odp"
            };

        public static readonly List<string> ExtsDocument = new List<string>
            {
                ".docx", ".doc", ".odt", ".rtf", ".txt",
                ".html", ".htm", ".mht", ".pdf", ".djvu",
                ".fb2", ".epub", ".xps"
            };

        public static string GetInternalExtension(string extension)
        {
            extension = Path.GetExtension(extension).ToLower();
            if (ExtsDocument.Contains(extension)) return ".docx";
            if (ExtsSpreadsheet.Contains(extension)) return ".xlsx";
            if (ExtsPresentation.Contains(extension)) return ".pptx";
            return string.Empty;
        }
    }

    public partial class _Default : Page
    {
        public static string VirtualPath
        {
            get
            {
                return
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + WebConfigurationManager.AppSettings["storage-path"]
                    + CurUserHostAddress(null) + "/";
            }
        }

        private static bool? _ismono;
        public static bool IsMono
        {
            get
            {
                return _ismono.HasValue ? _ismono.Value : (_ismono = (bool?)(Type.GetType("Mono.Runtime") != null)).Value;
            }
        }

        private static long MaxFileSize
        {
            get
            {
                long size;
                long.TryParse(WebConfigurationManager.AppSettings["filesize-max"], out size);
                return size > 0 ? size : 5*1024*1024;
            }
        }

        private static List<string> FileExts
        {
            get { return ViewedExts.Concat(EditedExts).Concat(ConvertExts).ToList(); }
        }

        private static List<string> ViewedExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.viewed-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        public static List<string> EditedExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.edited-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        public static List<string> ConvertExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.convert-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        public static bool EditMode
        {
            get { return (WebConfigurationManager.AppSettings["mode"] ?? "") != "view"; }
        }

        private static string _fileName;

        public static string CurUserHostAddress(string userAddress)
        {
            return Regex.Replace(userAddress ?? HttpContext.Current.Request.UserHostAddress, "[^0-9a-zA-Z.=]", "_");
        }

        public static string StoragePath(string fileName, string userAddress)
        {
            var directory = HttpRuntime.AppDomainAppPath + WebConfigurationManager.AppSettings["storage-path"] + CurUserHostAddress(userAddress) + "\\";
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            return directory + fileName;
        }

        public static string FileUri(string fileName)
        {
            var uri = new UriBuilder(HttpContext.Current.Request.Url)
                {
                    Path = VirtualPath + fileName,
                    Query = ""
                };

            if (HaveExternalIP())
            {
                return uri.ToString();
            }

            return GetExternalUri(uri.ToString());
        }

        protected string UrlPreloadScripts = WebConfigurationManager.AppSettings["files.docservice.url.preloader"];


        protected void Page_Load(object sender, EventArgs e)
        {
        }

        public static string DoUpload(HttpContext context)
        {
            var httpPostedFile = context.Request.Files[0];

            if (HttpContext.Current.Request.Browser.Browser.ToUpper() == "IE")
            {
                var files = httpPostedFile.FileName.Split(new char[] { '\\' });
                _fileName = files[files.Length - 1];
            }
            else
            {
                _fileName = httpPostedFile.FileName;
            }

            var curSize = httpPostedFile.ContentLength;
            if (MaxFileSize < curSize || curSize <= 0)
            {
                throw new Exception("File size is incorrect");
            }

            var curExt = (Path.GetExtension(_fileName) ?? "").ToLower();
            if (!FileExts.Contains(curExt))
            {
                throw new Exception("File type is not supported");
            }

            _fileName = GetCorrectName(_fileName);

            var savedFileName = StoragePath(_fileName, null);
            httpPostedFile.SaveAs(savedFileName);

            return _fileName;
        }

        public static string DoUpload(string fileUri)
        {
            _fileName = GetCorrectName(Path.GetFileName(fileUri));

            var curExt = (Path.GetExtension(_fileName) ?? "").ToLower();
            if (!FileExts.Contains(curExt))
            {
                throw new Exception("File type is not supported");
            }

            var req = (HttpWebRequest)WebRequest.Create(fileUri);

            try
            {
                // hack. http://ubuntuforums.org/showthread.php?t=1841740
                if (IsMono)
                {
                    ServicePointManager.ServerCertificateValidationCallback += (s, ce, ca, p) => true;
                }

                using (var stream = req.GetResponse().GetResponseStream())
                {
                    if (stream == null) throw new Exception("stream is null");
                    const int bufferSize = 4096;

                    using (var fs = File.Open(StoragePath(_fileName, null), FileMode.Create))
                    {
                        var buffer = new byte[bufferSize];
                        int readed;
                        while ((readed = stream.Read(buffer, 0, bufferSize)) != 0)
                        {
                            fs.Write(buffer, 0, readed);
                        }
                    }
                }
            }
            catch (Exception)
            {

            }
            return _fileName;
        }

        public static string DoConvert(HttpContext context)
        {
            _fileName = context.Request["filename"];

            var extension = (Path.GetExtension(_fileName) ?? "").Trim('.');
            var internalExtension = FileType.GetInternalExtension(_fileName).Trim('.');

            if (ConvertExts.Contains("." + extension)
                && !string.IsNullOrEmpty(internalExtension))
            {
                var key = ServiceConverter.GenerateRevisionId(FileUri(_fileName));

                string newFileUri;
                var result = ServiceConverter.GetConvertedUri(FileUri(_fileName), extension, internalExtension, key, true, out newFileUri);
                if (result != 100)
                {
                    return "{ \"step\" : \"" + result + "\", \"filename\" : \"" + _fileName + "\"}";
                }

                var fileName = GetCorrectName(Path.GetFileNameWithoutExtension(_fileName) + "." + internalExtension);

                var req = (HttpWebRequest)WebRequest.Create(newFileUri);

                // hack. http://ubuntuforums.org/showthread.php?t=1841740
                if (IsMono)
                {
                    ServicePointManager.ServerCertificateValidationCallback += (s, ce, ca, p) => true;
                }

                using (var stream = req.GetResponse().GetResponseStream())
                {
                    if (stream == null) throw new Exception("Stream is null");
                    const int bufferSize = 4096;

                    using (var fs = File.Open(StoragePath(fileName, null), FileMode.Create))
                    {
                        var buffer = new byte[bufferSize];
                        int readed;
                        while ((readed = stream.Read(buffer, 0, bufferSize)) != 0)
                        {
                            fs.Write(buffer, 0, readed);
                        }
                    }
                }

                File.Delete(StoragePath(_fileName, null));
                _fileName = fileName;
            }

            return "{ \"filename\" : \"" + _fileName + "\"}";
        }

        public static string GetCorrectName(string fileName)
        {
            var baseName = Path.GetFileNameWithoutExtension(fileName);
            var ext = Path.GetExtension(fileName);
            var name = baseName + ext;

            for (var i = 1; File.Exists(StoragePath(name, null)); i++)
            {
                name = baseName + " (" + i + ")" + ext;
            }
            return name;
        }

        private static bool? _haveExternalIP;

        public static bool HaveExternalIP()
        {
            if (!_haveExternalIP.HasValue)
            {
                string convertUri;
                try
                {
                    var uri = new UriBuilder(HttpContext.Current.Request.Url)
                        {
                            Path = VirtualPath + "demo.docx",
                            Query = ""
                        };
                    var fileUri = uri.ToString();

                    ServiceConverter.GetConvertedUri(fileUri, "docx", "docx", Guid.NewGuid().ToString(), false, out convertUri);
                }
                catch
                {
                    convertUri = string.Empty;
                }

                _haveExternalIP = !string.IsNullOrEmpty(convertUri);
            }

            return _haveExternalIP.Value;
        }

        public static string GetExternalUri(string localUri)
        {
            try
            {
                var uri = HttpRuntime.Cache.Get(localUri) as string;
                if (string.IsNullOrEmpty(uri))
                {

                    var webRequest = (HttpWebRequest)WebRequest.Create(localUri);

                    // hack. http://ubuntuforums.org/showthread.php?t=1841740
                    if (IsMono)
                    {
                        ServicePointManager.ServerCertificateValidationCallback += (s, ce, ca, p) => true;
                    }

                    using (var response = webRequest.GetResponse())
                    using (var responseStream = response.GetResponseStream())
                    {
                        var key = ServiceConverter.GenerateRevisionId(localUri);
                        uri = ServiceConverter.GetExternalUri(responseStream, response.ContentLength, response.ContentType, key);
                    }
                    HttpRuntime.Cache.Remove(localUri);
                    HttpRuntime.Cache.Insert(localUri, uri, null, DateTime.Now.Add(TimeSpan.FromMinutes(2)), Cache.NoSlidingExpiration);
                }
                return uri;
            }
            catch (Exception)
            {

            }
            return localUri;
        }
    }
}