using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Linq;
using OnlineEditorsExample;

namespace ASC.Api.DocumentConverter
{
    /// <summary>
    /// Class service api conversion
    /// </summary>
    public static class ServiceConverter
    {
        /// <summary>
        /// Static constructor
        /// </summary>
        static ServiceConverter()
        {
            DocumentConverterUrl = WebConfigurationManager.AppSettings["files.docservice.url.converter"] ?? "";
            DocumentStorageUrl = WebConfigurationManager.AppSettings["files.docservice.url.storage"] ?? "";

            Int32.TryParse(WebConfigurationManager.AppSettings["files.docservice.timeout"], out ConvertTimeout);
            ConvertTimeout = ConvertTimeout > 0 ? ConvertTimeout : 120000;
        }

        #region private fields

        /// <summary>
        /// Timeout to request conversion
        /// </summary>
        private static readonly int ConvertTimeout;

        /// <summary>
        /// Url to the service of conversion
        /// </summary>
        private static readonly string DocumentConverterUrl;

        /// <summary>
        /// Url to the service of storage
        /// </summary>
        private static readonly string DocumentStorageUrl;

        /// <summary>
        /// The parameters for the query conversion
        /// </summary>
        private const string ConvertParams = "?url={0}&outputtype={1}&filetype={2}&title={3}&key={4}&vkey={5}";

        /// <summary>
        /// Number of tries request conversion
        /// </summary>
        private const int MaxTry = 3;

        #endregion

        #region public method

        /// <summary>
        ///     The method is to convert the file to the required format
        /// </summary>
        /// <param name="documentUri">Uri for the document to convert</param>
        /// <param name="fromExtension">Document extension</param>
        /// <param name="toExtension">Extension to which to convert</param>
        /// <param name="documentRevisionId">Key for caching on service</param>
        /// <param name="isAsync">Perform conversions asynchronously</param>
        /// <param name="convertedDocumentUri">Uri to the converted document</param>
        /// <returns>The percentage of completion of conversion</returns>
        /// <example>
        /// string convertedDocumentUri;
        /// GetConvertedUri("http://helpcenter.onlyoffice.com/content/GettingStarted.pdf", ".pdf", ".docx", "http://helpcenter.onlyoffice.com/content/GettingStarted.pdf", false, out convertedDocumentUri);
        /// </example>
        /// <exception>
        /// </exception>
        public static int GetConvertedUri(string documentUri,
                                          string fromExtension,
                                          string toExtension,
                                          string documentRevisionId,
                                          bool isAsync,
                                          out string convertedDocumentUri)
        {
            convertedDocumentUri = string.Empty;
            var responceFromConvertService =
                SendRequestToConvertService(documentUri, fromExtension, toExtension, documentRevisionId, isAsync)
                    .Root;

            var errorElement = responceFromConvertService.Element("Error");
            if (errorElement != null)
                ProcessConvertServiceResponceError(Convert.ToInt32(errorElement.Value));

            var isEndConvert = Convert.ToBoolean(responceFromConvertService.Element("EndConvert").Value);
            var percent = Convert.ToInt32(responceFromConvertService.Element("Percent").Value);

            if (isEndConvert)
            {
                convertedDocumentUri = responceFromConvertService.Element("FileUrl").Value;
                percent = 100;
            }
            else
            {
                percent = percent >= 100 ? 99 : percent;
            }

            return percent;
        }

        /// <summary>
        /// Placing the document in the storage service
        /// </summary>
        /// <param name="fileStream">Stream of document</param>
        /// <param name="contentLength">Length of stream</param>
        /// <param name="contentType">Mime type</param>
        /// <param name="documentRevisionId">Key for caching on service, whose used in editor</param>
        /// <returns>Uri to document in the storage</returns>
        public static string GetExternalUri(
            Stream fileStream,
            long contentLength,
            string contentType,
            string documentRevisionId)
        {
            var validateKey = GenerateValidateKey(documentRevisionId, false);

            var urlDocumentService = DocumentStorageUrl + ConvertParams;
            var urlTostorage = String.Format(urlDocumentService,
                                             string.Empty,
                                             string.Empty,
                                             string.Empty,
                                             string.Empty,
                                             documentRevisionId,
                                             validateKey);

            var request = (HttpWebRequest)WebRequest.Create(urlTostorage);
            request.Method = "POST";
            request.ContentType = contentType;
            request.ContentLength = contentLength;

            const int bufferSize = 2048;
            var buffer = new byte[bufferSize];
            int readed;
            while ((readed = fileStream.Read(buffer, 0, bufferSize)) > 0)
            {
                request.GetRequestStream().Write(buffer, 0, readed);
            }

            // hack. http://ubuntuforums.org/showthread.php?t=1841740
            if (_Default.IsMono)
            {
                ServicePointManager.ServerCertificateValidationCallback += (s, ce, ca, p) => true;
            }

            using (var response = request.GetResponse())
            using (var stream = response.GetResponseStream())
            {
                if (stream == null) throw new WebException("Could not get an answer");
                var xDocumentResponse = XDocument.Load(new XmlTextReader(stream));
                string externalUri;
                GetResponseUri(xDocumentResponse, out externalUri);
                return externalUri;
            }
        }

        /// <summary>
        /// Translation key to a supported form.
        /// </summary>
        /// <param name="expectedKey">Expected key</param>
        /// <returns>Supported key</returns>
        public static string GenerateRevisionId(string expectedKey)
        {
            if (expectedKey.Length > 20) expectedKey = expectedKey.GetHashCode().ToString();
            var key = Regex.Replace(expectedKey, "[^0-9-.a-zA-Z_=]", "_");
            return key.Substring(key.Length - Math.Min(key.Length, 20));
        }

        /// <summary>
        /// Generate validate key for editor by documentId
        /// </summary>
        /// <param name="documentRevisionId">Key for caching on service, whose used in editor</param>
        /// <returns>Validation key</returns>
        /// <example>LFJ7 or "http://helpcenter.onlyoffice.com/content/GettingStarted.pdf"</example>
        public static string GenerateValidateKey(string documentRevisionId)
        {
            return GenerateValidateKey(documentRevisionId, true);
        }

        #endregion

        #region private method

        /// <summary>
        /// Generate validate key for editor by documentId
        /// </summary>
        /// <param name="documentRevisionId">Key for caching on service, whose used in editor</param>
        /// <param name="addHostForValidate">Add host address to the key</param>
        /// <returns>Validation key</returns>
        private static string GenerateValidateKey(string documentRevisionId, bool addHostForValidate)
        {
            if (string.IsNullOrEmpty(documentRevisionId)) return string.Empty;

            documentRevisionId = GenerateRevisionId(documentRevisionId);

            var keyId = GetKey();
            var userCount = 0;

            object primaryKey = null;

            if (addHostForValidate)
            {
                string userIp = null;
                try
                {
                    if (HttpContext.Current != null)
                    {
                        userIp = HttpContext.Current.Request.UserHostAddress;
                    }
                }
                catch
                {
                }

                if (!string.IsNullOrEmpty(userIp))
                    primaryKey = new {expire = DateTime.UtcNow, key = documentRevisionId, key_id = keyId, user_count = userCount, ip = userIp};
            }

            if (primaryKey == null)
                primaryKey = new {expire = DateTime.UtcNow, key = documentRevisionId, key_id = keyId, user_count = userCount};

            return Signature.Create(primaryKey, GetSKey());
        }

        private static object GetKey()
        {
            return WebConfigurationManager.AppSettings["files.docservice.tenantid"] ?? "OnlyOfficeAppsExample";
        }

        private static string GetSKey()
        {
            return WebConfigurationManager.AppSettings["files.docservice.key"] ?? "ONLYOFFICE";
        }

        /// <summary>
        /// Request for conversion to a service
        /// </summary>
        /// <param name="documentUri">Uri for the document to convert</param>
        /// <param name="fromExtension">Document extension</param>
        /// <param name="toExtension">Extension to which to convert</param>
        /// <param name="documentRevisionId">Key for caching on service</param>
        /// <param name="isAsync">Perform conversions asynchronously</param>
        /// <returns>Xml document request result of conversion</returns>
        private static XDocument SendRequestToConvertService(string documentUri, string fromExtension, string toExtension, string documentRevisionId, bool isAsync)
        {
            fromExtension = string.IsNullOrEmpty(fromExtension) ? Path.GetExtension(documentUri) : fromExtension;

            var title = Path.GetFileName(documentUri);
            title = string.IsNullOrEmpty(title) ? Guid.NewGuid().ToString() : title;

            documentRevisionId = string.IsNullOrEmpty(documentRevisionId)
                                     ? documentUri
                                     : documentRevisionId;
            documentRevisionId = GenerateRevisionId(documentRevisionId);

            var validateKey = GenerateValidateKey(documentRevisionId, false);

            var urlDocumentService = DocumentConverterUrl + ConvertParams;
            var urlToConverter = String.Format(urlDocumentService,
                                               HttpUtility.UrlEncode(documentUri),
                                               toExtension.Trim('.'),
                                               fromExtension.Trim('.'),
                                               title,
                                               documentRevisionId,
                                               validateKey);

            if (isAsync)
                urlToConverter += "&async=true";

            var req = (HttpWebRequest) WebRequest.Create(urlToConverter);
            req.Timeout = ConvertTimeout;

            Stream stream = null;
            var countTry = 0;

            // hack. http://ubuntuforums.org/showthread.php?t=1841740
            if (_Default.IsMono)
            {
                ServicePointManager.ServerCertificateValidationCallback += (s, ce, ca, p) => true;
            }
            while (countTry < MaxTry)
            {
                try
                {
                    countTry++;
                    stream = req.GetResponse().GetResponseStream();
                    break;
                }
                catch (WebException ex)
                {
                    if (ex.Status != WebExceptionStatus.Timeout)
                    {
                        throw new HttpException((int) HttpStatusCode.BadRequest, "Bad Request", ex);
                    }
                }
            }
            if (countTry == MaxTry)
            {
                throw new WebException("Timeout", WebExceptionStatus.Timeout);
            }

            return XDocument.Load(new XmlTextReader(stream));
        }

        /// <summary>
        /// Generate an error code table
        /// </summary>
        /// <param name="errorCode">Error code</param>
        private static void ProcessConvertServiceResponceError(int errorCode)
        {
            var errorMessage = string.Empty;
            const string errorMessageTemplate = "Error occurred in the ConvertService.ashx: {0}";

            switch (errorCode)
            {
                case -8:
                    // public const int c_nErrorFileVKey = -8;
                    errorMessage = String.Format(errorMessageTemplate, "Error document VKey");
                    break;
                case -7:
                    // public const int c_nErrorFileRequest = -7;
                    errorMessage = String.Format(errorMessageTemplate, "Error document request");
                    break;
                case -6:
                    // public const int c_nErrorDatabase = -6;
                    errorMessage = String.Format(errorMessageTemplate, "Error database");
                    break;
                case -5:
                    // public const int c_nErrorUnexpectedGuid = -5;
                    errorMessage = String.Format(errorMessageTemplate, "Error unexpected guid");
                    break;
                case -4:
                    // public const int c_nErrorDownloadError = -4;
                    errorMessage = String.Format(errorMessageTemplate, "Error download error");
                    break;
                case -3:
                    // public const int c_nErrorConvertationError = -3;
                    errorMessage = String.Format(errorMessageTemplate, "Error convertation error");
                    break;
                case -2:
                    // public const int c_nErrorConvertationTimeout = -2;
                    errorMessage = String.Format(errorMessageTemplate, "Error convertation timeout");
                    break;
                case -1:
                    // public const int c_nErrorUnknown = -1;
                    errorMessage = String.Format(errorMessageTemplate, "Error convertation unknown");
                    break;
                case 0:
                    // public const int c_nErrorNo = 0;
                    break;
                default:
                    errorMessage = "ErrorCode = " + errorCode;
                    break;
            }

            throw new Exception(errorMessage);
        }

        /// <summary>
        /// Processing document received from the editing service
        /// </summary>
        /// <param name="xDocumentResponse">The resulting xml from editing service</param>
        /// <param name="responseUri">Uri to the converted document</param>
        /// <returns>The percentage of completion of conversion</returns>
        private static int GetResponseUri(XDocument xDocumentResponse, out string responseUri)
        {
            var responceFromConvertService = xDocumentResponse.Root;
            if (responceFromConvertService == null) throw new WebException("Invalid answer format");

            var errorElement = responceFromConvertService.Element("Error");
            if (errorElement != null) ProcessConvertServiceResponceError(Convert.ToInt32(errorElement.Value));

            var endConvert = responceFromConvertService.Element("EndConvert");
            if (endConvert == null) throw new WebException("Invalid answer format");
            var isEndConvert = Convert.ToBoolean(endConvert.Value);

            var resultPercent = 0;
            responseUri = string.Empty;
            if (isEndConvert)
            {
                var fileUrl = responceFromConvertService.Element("FileUrl");
                if (fileUrl == null) throw new WebException("Invalid answer format");

                responseUri = fileUrl.Value;
                resultPercent = 100;
            }
            else
            {
                var percent = responceFromConvertService.Element("Percent");
                if (percent != null)
                    resultPercent = Convert.ToInt32(percent.Value);
                resultPercent = resultPercent >= 100 ? 99 : resultPercent;
            }

            return resultPercent;
        }


        /// <summary>
        /// Class to encode a string
        /// </summary>
        internal static class Signature
        {
            /// <summary>
            /// Encoding string from object
            /// </summary>
            /// <typeparam name="T">Type of object</typeparam>
            /// <param name="obj">Object</param>
            /// <param name="secret">Secret key for encoding</param>
            /// <returns>Encoding string</returns>
            public static string Create<T>(T obj, string secret)
            {
                var serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                var payload = GetHashBase64(str + secret) + "?" + str;
                return HttpServerUtility.UrlTokenEncode(Encoding.UTF8.GetBytes(payload));
            }

            /// <summary>
            /// String in base64 encoding
            /// </summary>
            /// <param name="str">String fo encoding</param>
            /// <returns>Encoding string</returns>
            private static string GetHashBase64(string str)
            {
                return Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(str)));
            }
        }

        #endregion
    }
}