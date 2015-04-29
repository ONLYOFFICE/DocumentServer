using OnlineEditorsExampleMVC.Helpers;

namespace OnlineEditorsExampleMVC.Models
{
    public class FileModel
    {
        public bool TypeDesktop { get; set; }

        public string FileUri
        {
            get { return DocManagerHelper.GetFileUri(FileName); }
        }

        public string FileName { get; set; }

        public string DocumentType
        {
            get { return FileUtility.GetFileType(FileName).ToString().ToLower(); }
        }

        public string Key
        {
            get { return ServiceConverter.GenerateRevisionId(DocManagerHelper.CurUserHostAddress() + "/" + FileName); }
        }

        public string ValidateKey
        {
            get { return ServiceConverter.GenerateValidateKey(Key); }
        }

        public string CallbackUrl
        {
            get
            {
                return DocManagerHelper.GetCallback(FileName);
            }
        }
    }
}