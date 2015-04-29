
package entities;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import org.json.simple.JSONObject;


public class Signature {

    static {}
    
    public static String Create(Date expire, String key, Object key_id, int user_count, String ip, String secret)
    {
        try
        {
            JSONObject jsonObj = new JSONObject();

            jsonObj.put("expire", "/Date("+ expire.getTime() +")/");
            jsonObj.put("key", key);
            jsonObj.put("key_id", key_id);
            jsonObj.put("user_count", user_count);
            jsonObj.put("ip", ip == null ? "" : ip);

            String str = jsonObj.toString();
            String payload = GetHashBase64(str + secret) + "?" + str;

            return UrlTokenEncode(payload.getBytes("UTF-8"));
        }
        catch(Exception ex)
        {
            return null;
        }
    }

    private static String GetHashBase64(String str)
    {
        try
        {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(str.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(md.digest());
        }
        catch (NoSuchAlgorithmException | UnsupportedEncodingException ex)
        {
            return null;
        }
    }

    private static String UrlTokenEncode(byte [] input)
    {
        if (input == null)
            return null;

        if (input.length < 1)
            return "";

        String  base64Str   = null;
        int     endPos      = 0;
        char[]  base64Chars = null;

        // Step 1: Do a Base64 encoding
        base64Str = Base64.getEncoder().encodeToString(input);
        if (base64Str == null)
            return null;

        // Step 2: Find how many padding chars are present in the end
        for (endPos = base64Str.length(); endPos > 0; endPos--)
        {
            if (base64Str.charAt(endPos - 1) != '=') // Found a non-padding char!
            {
                break; // Stop here
            }
        }

        // Step 3: Create char array to store all non-padding chars,
        // plus a char to indicate how many padding chars are needed
        base64Chars = new char[endPos + 1];
        base64Chars[endPos] = (char)((int)'0' + base64Str.length() - endPos); // Store a char at the end, to indicate how many padding chars are needed

        // Step 3: Copy in the other chars. Transform the "+" to "-", and "/" to "_"
        for (int iter = 0; iter < endPos; iter++)
        {
            char c = base64Str.charAt(iter);

            switch (c)
            {
                case '+':
                    base64Chars[iter] = '-';
                    break;

                case '/':
                    base64Chars[iter] = '_';
                    break;

                case '=':
                    base64Chars[iter] = c;
                    break;

                default:
                    base64Chars[iter] = c;
                    break;
            }
        }
        return new String(base64Chars);
    }
}
