
package helpers;

import java.io.InputStream;
import java.util.Properties;

public class ConfigManager  {
    
    private static Properties properties;
    
    static
    {
        Init();
    }
    
    private static void Init()
    {
        try
        {
            properties = new Properties();
            InputStream stream = Thread.currentThread().getContextClassLoader().getResourceAsStream("settings.properties");
            properties.load(stream);
        }
        catch (Exception ex)
        {
            properties = null;
        }
    }
    
    public static String GetProperty(String name){
        if(properties == null)
            return "";
        
        String property = properties.getProperty(name);
        
        return property == null ? "" : property;
    }
}