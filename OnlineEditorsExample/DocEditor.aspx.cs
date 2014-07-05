using System;
using System.IO;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using ASC.Api.DocumentConverter;

namespace OnlineEditorsExample
{
    public partial class DocEditor : Page
    {
        public static string FileName;

        public static string FileUri
        {
            get { return _Default.FileUri(FileName); }
        }

        protected string Key
        {
            get { return ServiceConverter.GenerateRevisionId(_Default.CurUserHostAddress + "/" + Path.GetFileName(FileUri)); }
        }

        protected string ValidateKey
        {
            get { return ServiceConverter.GenerateValidateKey(Key); }
        }

        protected string DocServiceApiUri
        {
            get { return WebConfigurationManager.AppSettings["files.docservice.url.api"] ?? string.Empty; }
        }

        protected string DocumentType
        {
            get
            {
                var ext = Path.GetExtension(FileName).ToLower();

                if (FileType.ExtsDocument.Contains(ext)) return "text";
                if (FileType.ExtsSpreadsheet.Contains(ext)) return "spreadsheet";
                if (FileType.ExtsPresentation.Contains(ext)) return "presentation";

                return string.Empty;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            var externalUrl = Request["fileUrl"];
            if (!string.IsNullOrEmpty(externalUrl))
            {
                FileName = _Default.DoUpload(externalUrl);
            }
            else
            {
                FileName = Request["fileID"];
            }

            var type = Request["type"];
            if (!string.IsNullOrEmpty(type))
            {
                Try(type);
                Response.Redirect("doceditor.aspx?fileID=" + HttpUtility.UrlEncode(FileName));
            }
        }

        private static void Try(string type)
        {
            string ext;
            switch (type)
            {
                case "document":
                    ext = ".docx";
                    break;
                case "spreadsheet":
                    ext = ".xlsx";
                    break;
                case "presentation":
                    ext = ".pptx";
                    break;
                default:
                    return;
            }
            var demoName = "demo" + ext;
            FileName = _Default.GetCorrectName(demoName);

            File.Copy(HttpRuntime.AppDomainAppPath + "app_data/" + demoName, _Default.StoragePath + FileName);
        }
    }
}