using System;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Services;
using ASC.Api.DocumentConverter;

namespace OnlineEditorsExample
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class WebEditor : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            switch (context.Request["type"])
            {
                case "save":
                    Save(context);
                    break;
                case "upload":
                    Upload(context);
                    break;
                case "convert":
                    Convert(context);
                    break;
            }
        }

        private static void Save(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            var downloadUri = context.Request["fileuri"];
            var fileName = context.Request["filename"];
            if (string.IsNullOrEmpty(downloadUri) || string.IsNullOrEmpty(fileName))
            {
                context.Response.Write("error");
                return;
            }

            var newType = Path.GetExtension(downloadUri).Trim('.');
            var currentType = (context.Request["filetype"] ?? Path.GetExtension(fileName)).Trim('.');

            if (newType.ToLower() != currentType.ToLower())
            {
                var key = ServiceConverter.GenerateRevisionId(downloadUri);

                string newFileUri;
                try
                {
                    var result = ServiceConverter.GetConvertedUri(downloadUri, newType, currentType, key, false, out newFileUri);
                    if (result != 100)
                        throw new Exception();
                }
                catch (Exception)
                {
                    context.Response.Write("error");
                    return;
                }
                downloadUri = newFileUri;
                newType = currentType;
            }

            fileName = Path.GetFileNameWithoutExtension(fileName) + "." + newType;

            var req = (HttpWebRequest) WebRequest.Create(downloadUri);

            try
            {
                using (var stream = req.GetResponse().GetResponseStream())
                {
                    if (stream == null) throw new Exception("stream is null");
                    const int bufferSize = 4096;

                    using (var fs = File.Open(_Default.StoragePath + fileName, FileMode.Create))
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
                context.Response.Write("error");
                return;
            }

            context.Response.Write("success");
        }

        private static void Upload(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            try
            {
                context.Response.Write("{ \"filename\": \"" + _Default.DoUpload(context) + "\"}");
            }
            catch (Exception e)
            {
                context.Response.Write("{ \"error\": \"" + e.Message + "\"}");
            }
        }

        private static void Convert(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            try
            {
                context.Response.Write(_Default.DoConvert(context));
            }
            catch (Exception e)
            {
                context.Response.Write("{ \"error\": \"" + e.Message + "\"}");
            }
        }

        public bool IsReusable
        {
            get { return false; }
        }
    }
}