
package helpers;

import entities.FileType;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileUtility
{
    static {}
    
    public static FileType GetFileType(String fileName)
    {
        String ext = GetFileExtension(fileName).toLowerCase();

        if (ExtsDocument.contains(ext))
            return FileType.Text;
        
        if (ExtsSpreadsheet.contains(ext))
            return FileType.Spreadsheet;
        
        if (ExtsPresentation.contains(ext))
            return FileType.Presentation;

        return FileType.Text;
    }

    public static List<String> ExtsDocument = Arrays.asList
    (
        ".docx", ".doc", ".odt", ".rtf", ".txt",
        ".html", ".htm", ".mht", ".pdf", ".djvu",
        ".fb2", ".epub", ".xps"
    );

    public static List<String> ExtsSpreadsheet = Arrays.asList
    (
        ".xls", ".xlsx", ".ods", ".csv"
    );

    public static List<String> ExtsPresentation = Arrays.asList
    (
        ".ppt", ".pptx",".odp"
    );
    

    public static String GetFileName (String url)
    {
        if(url == null) return null;
        
        //for external file url
        String tempstorage = ConfigManager.GetProperty("files.docservice.url.tempstorage");
        if(!tempstorage.isEmpty() && url.startsWith(tempstorage))
        {
            Map<String, String> params = GetUrlParams(url);
            return params == null ? null : params.get("filename");
        }

        String fileName = url.substring(url.lastIndexOf('/')+1, url.length());
        return fileName;
    }
    
    public static String GetFileNameWithoutExtension (String url)
    {
        String fileName = GetFileName(url);
        if(fileName == null) return null;
        String fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        return fileNameWithoutExt;
    }

    public static String GetFileExtension (String url)
    {
        String fileName = GetFileName(url);
        if(fileName == null) return null;
        String fileExt = fileName.substring(fileName.lastIndexOf("."));
        return fileExt.toLowerCase();
    }

    public static Map<String, String> GetUrlParams (String url)
    {
        try
        {
            String query = new URL(url).getQuery();
            String[] params = query.split("&");  
            Map<String, String> map = new HashMap<>();  
            for (String param : params)  
            {  
                String name = param.split("=")[0];  
                String value = param.split("=")[1];  
                map.put(name, value);  
            }
            return map;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}
