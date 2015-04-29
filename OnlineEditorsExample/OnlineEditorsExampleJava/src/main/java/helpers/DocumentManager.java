
package helpers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javafx.util.Pair;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import entities.FileType;


public class DocumentManager
{
    private static HttpServletRequest request;
    private static HttpServletResponse response;

    private static final Map<String, String> CacheMap = new HashMap<>();
    private static final String ExternalIPCacheKey = "ExternalIPCacheKey";

    public static void Init(HttpServletRequest req, HttpServletResponse resp){
        request = req;
        response = resp;
    }

    public static long GetMaxFileSize()
    {
        long size;
        
        try
        {
            size = Long.parseLong(ConfigManager.GetProperty("filesize-max"));
        }
        catch(Exception ex)
        {
            size = 0;
        }

        return size > 0 ? size : 5 * 1024 * 1024;
    }

    public static List<String> GetFileExts()
    {
        List<String> res = new ArrayList<>();
        
        res.addAll(GetViewedExts());
        res.addAll(GetEditedExts());
        res.addAll(GetConvertExts());

        return  res;
    }

    public static List<String> GetViewedExts()
    {
        String exts = ConfigManager.GetProperty("files.docservice.viewed-docs");
        return Arrays.asList(exts.split("\\|"));
    }

    public static List<String> GetEditedExts()
    {
        String exts = ConfigManager.GetProperty("files.docservice.edited-docs");
        return Arrays.asList(exts.split("\\|"));
    }

    public static List<String> GetConvertExts()
    {
        String exts = ConfigManager.GetProperty("files.docservice.convert-docs");
        return Arrays.asList(exts.split("\\|"));
    }

    public static String CurUserHostAddress(String userAddress)
    {
        if(userAddress == null)
        {
            try
            {
                userAddress = InetAddress.getLocalHost().getHostAddress();
            }
            catch(Exception ex)
            {
                userAddress = "";
            }
        }

        return userAddress.replaceAll("[^0-9a-zA-Z.=]", "_");
    }

    public static String StoragePath(String fileName, String userAddress)
    {
        String serverPath = request.getSession().getServletContext().getRealPath("");
        String storagePath = ConfigManager.GetProperty("storage-folder");
        String hostAddress = CurUserHostAddress(userAddress);
        
        String directory = serverPath + "\\" + storagePath + "\\";

        File file = new File(directory);
        
        if (!file.exists())
        {
            file.mkdir();
        }
        
        directory = directory + hostAddress + "\\";
        file = new File(directory);

        if (!file.exists())
        {
            file.mkdir();
        }

        return directory + fileName;
    }

    public static String GetCorrectName(String fileName)
    {
        String baseName = FileUtility.GetFileNameWithoutExtension(fileName);
        String ext = FileUtility.GetFileExtension(fileName);
        String name = baseName + ext;

        File file = new File(StoragePath(name, null));

        for (int i = 1; file.exists(); i++)
        {
            name = baseName + " (" + i + ")" + ext;
            file = new File(StoragePath(name, null));
        }

        return name;
    }

    public static String CreateDemo(String fileExt) throws Exception
    {
        String demoName = "sample." + fileExt;
        String fileName = GetCorrectName(demoName);
        
        try
        {
            InputStream stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(demoName);
            
            File file = new File(StoragePath(fileName, null));
            
            try (FileOutputStream out = new FileOutputStream(file)) {
                int read;
                final byte[] bytes = new byte[1024];
                while ((read = stream.read(bytes)) != -1) {
                    out.write(bytes, 0, read);
                }
                out.flush();
            }
        }
        catch(Exception ex)
        {
            throw ex;
        }
        
        return fileName;
    }

    public static String GetFileUri(String fileName) throws Exception
    {
        try
        {
            String serverPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
            String storagePath = ConfigManager.GetProperty("storage-folder");
            String hostAddress = CurUserHostAddress(null);
            
            String filePath = serverPath + "/" + storagePath + "/" + hostAddress + "/" + URLEncoder.encode(fileName);
            
            if (HaveExternalIP(filePath))
            {
                return filePath;
            }

            return GetExternalUri(filePath);
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }

    public static String GetCallback(String fileName)
    {
        String serverPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        String hostAddress = CurUserHostAddress(null);
        String query = "?type=track&userAddress=" + URLEncoder.encode(hostAddress) + "&fileName=" + URLEncoder.encode(fileName);
        
        return serverPath + "/IndexServlet" + query;
    }

    public static Boolean HaveExternalIP(String filePath)
    {
        if(CacheMap.containsKey(ExternalIPCacheKey))
            return Boolean.parseBoolean(CacheMap.get(ExternalIPCacheKey));

        Boolean haveExternalIP = false;
        
        try
        {
            String extension = FileUtility.GetFileExtension(filePath);
            String internalExtension = GetInternalExtension(FileUtility.GetFileType(filePath));

            Pair<Integer, String> res = ServiceConverter.GetConvertedUri(filePath, extension, internalExtension, UUID.randomUUID().toString(), false);

            if(res != null)
            {
                haveExternalIP = true;
            }
        }
        catch (Exception ex)
        {
            haveExternalIP = false;
        }

        CacheMap.put(ExternalIPCacheKey, haveExternalIP.toString());
        
        return haveExternalIP;
    }

    public static String GetExternalUri(String localUri) throws Exception
    {
        String documentRevisionId = ServiceConverter.GenerateRevisionId(localUri);
        
        if(CacheMap.containsKey(documentRevisionId))
            return CacheMap.get(documentRevisionId);
        
        try
        {
            URL url = new URL(localUri);
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            InputStream inputStream = connection.getInputStream();
            String contentType = connection.getContentType();           

            String externalUri = ServiceConverter.GetExternalUri(inputStream, inputStream.available(), contentType, documentRevisionId);
            
            connection.disconnect();
            
            CacheMap.put(documentRevisionId, externalUri);
            
            return externalUri;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public static String GetInternalExtension(FileType fileType)
    {
        if(fileType.equals(FileType.Text))
            return ".docx";

        if(fileType.equals(FileType.Spreadsheet))
            return ".xlsx";

        if(fileType.equals(FileType.Presentation))
            return ".pptx";

        return ".docx";
    }
}