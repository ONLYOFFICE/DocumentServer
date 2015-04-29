package controllers;

import helpers.DocumentManager;
import helpers.ServiceConverter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.util.Scanner;
import javafx.util.Pair;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import entities.FileType;
import helpers.FileUtility;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

@WebServlet(name = "IndexServlet", urlPatterns = {"/IndexServlet"})
@MultipartConfig
public class IndexServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String action = request.getParameter("type");
        
        if(action == null)
        {
            request.getRequestDispatcher("index.jsp").forward(request, response);
            return;
        }
        
        DocumentManager.Init(request, response);
        PrintWriter writer = response.getWriter();
        
        switch (action.toLowerCase()) {
            case "upload":
                Upload(request, response, writer);
                break;
            case "convert":
                Convert(request, response, writer);
                break;
            case "save":
                Save(request, response, writer);
                break;
            case "track":
                Track(request, response, writer);
                break;
        }

    }


    private static void Upload(HttpServletRequest request, HttpServletResponse response, PrintWriter writer) {
        response.setContentType("text/plain");

        try
        {
            Part httpPostedFile = request.getPart("file");
            
            String fileName = "";
            for (String content : httpPostedFile.getHeader("content-disposition").split(";")) {
                if (content.trim().startsWith("filename")) {
                    fileName = content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
                }
            }

            long curSize = httpPostedFile.getSize();
            if (DocumentManager.GetMaxFileSize() < curSize || curSize <= 0) {
                writer.write("{ \"error\": \"File size is incorrect\"}");
                return;
            }

            String curExt = FileUtility.GetFileExtension(fileName);
            if (!DocumentManager.GetFileExts().contains(curExt)) {
                writer.write("{ \"error\": \"File type is not supported\"}");
                return;
            }

            InputStream fileStream = httpPostedFile.getInputStream();
            
            fileName = DocumentManager.GetCorrectName(fileName);
            String fileStoragePath = DocumentManager.StoragePath(fileName, null);
            
            File file = new File(fileStoragePath);

            try (FileOutputStream out = new FileOutputStream(file)) {
                int read;
                final byte[] bytes = new byte[1024];
                while ((read = fileStream.read(bytes)) != -1) {
                    out.write(bytes, 0, read);
                }
                
                out.flush();
            }
            
            writer.write("{ \"filename\": \"" + fileName + "\"}");
            
        }
        catch (IOException | ServletException e)
        {
            writer.write("{ \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private static void Convert(HttpServletRequest request, HttpServletResponse response, PrintWriter writer)
    {
        response.setContentType("text/plain");

        try
        {
            String fileName = request.getParameter("filename");
            String fileUri = DocumentManager.GetFileUri(fileName);
            String fileExt = FileUtility.GetFileExtension(fileName);
            FileType fileType = FileUtility.GetFileType(fileName);
            String internalFileExt = DocumentManager.GetInternalExtension(fileType);

            if (DocumentManager.GetConvertExts().contains(fileExt))
            {
                String key = ServiceConverter.GenerateRevisionId(fileUri);

                Pair<Integer, String> res = ServiceConverter.GetConvertedUri(fileUri, fileExt, internalFileExt, key, true);
                
                int result = res.getKey();
                String newFileUri = res.getValue();

                if (result != 100)
                {
                    writer.write("{ \"step\" : \"" + result + "\", \"filename\" : \"" + fileName + "\"}");
                    return;
                }

                String correctName = DocumentManager.GetCorrectName(FileUtility.GetFileNameWithoutExtension(fileName) + internalFileExt);

                URL url = new URL(newFileUri);
                java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
                InputStream stream = connection.getInputStream();

                if (stream == null) {
                    throw new Exception("Stream is null");
                }

                File convertedFile = new File(DocumentManager.StoragePath(correctName, null));
                try (FileOutputStream out = new FileOutputStream(convertedFile)) {
                    int read;
                    final byte[] bytes = new byte[1024];
                    while ((read = stream.read(bytes)) != -1) {
                        out.write(bytes, 0, read);
                    }
                    
                    out.flush();
                }
                
                connection.disconnect();

                //remove source file ?
                //File sourceFile = new File(DocumentManager.StoragePath(fileName, null));
                //sourceFile.delete();
                
                fileName = correctName;
            }
            
            writer.write("{ \"filename\" : \"" + fileName + "\"}");
            
        }
        catch (Exception ex)
        {
            writer.write("{ \"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    private static void Save(HttpServletRequest request, HttpServletResponse response, PrintWriter writer)
    {
        response.setContentType("text/plain");

        String downloadUri = request.getParameter("fileuri");
        String fileName = request.getParameter("filename");
        String fileType = request.getParameter("filetype");
        
        if (downloadUri == null || fileName == null || downloadUri.isEmpty() || fileName.isEmpty()) {
            writer.write("error: empty fileuri or filename");
            return;
        }
        
        if(fileType == null || fileType.isEmpty())
        {
            fileType = FileUtility.GetFileExtension(fileName).replace(".", "");
        }

        String newType = FileUtility.GetFileExtension(downloadUri).replace(".", "");


        if (!newType.equalsIgnoreCase(fileType)) {
            String key = ServiceConverter.GenerateRevisionId(downloadUri);
            String newFileUri = "";
            
            try
            {
                Pair<Integer, String> res = ServiceConverter.GetConvertedUri(downloadUri, newType, fileType, key, false);
                
                int result = res.getKey();
                newFileUri = res.getValue();
                
                if (result != 100)
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                writer.write("error:" + ex.getMessage());
                return;
            }
            
            downloadUri = newFileUri;
            newType = fileType;
        }

        fileName = FileUtility.GetFileNameWithoutExtension(fileName) + "." + newType;

        try
        {
            URL url = new URL(downloadUri);
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            InputStream stream = connection.getInputStream();

            if (stream == null) {
                throw new Exception("Stream is null");
            }

            File savedFile = new File(DocumentManager.StoragePath(fileName, null));
            try (FileOutputStream out = new FileOutputStream(savedFile)) {
                int read;
                final byte[] bytes = new byte[1024];
                while ((read = stream.read(bytes)) != -1) {
                    out.write(bytes, 0, read);
                }
                
                out.flush();
            }
            
            connection.disconnect();
        }
        catch (Exception ex)
        {
            writer.write("error:" + ex.getMessage());
            return;
        }

        writer.write("success");
    }

    private static void Track(HttpServletRequest request, HttpServletResponse response, PrintWriter writer) {
        String userAddress = request.getParameter("userAddress");
        String fileName = request.getParameter("fileName");

        String storagePath = DocumentManager.StoragePath(fileName, userAddress);
        String body = "";
        
        try
        {
            Scanner scanner = new Scanner(request.getInputStream()).useDelimiter("\\A");
            body = scanner.hasNext() ? scanner.next() : "";
        }
        catch (Exception ex)
        {
            writer.write("get request.getInputStream error:" + ex.getMessage());
            return;
        }

        if (body.isEmpty())
        {
            writer.write("empty request.getInputStream");
            return;
        }
 
        JSONParser parser = new JSONParser();
        JSONObject jsonObj;
        
        try
        {
            Object obj = parser.parse(body);
            jsonObj = (JSONObject) obj;
        }
        catch (Exception ex)
        {
            writer.write("JSONParser.parse error:" + ex.getMessage());
            return;
        }
        
        long status = (long) jsonObj.get("status");

        if(status == 2 || status == 3)//MustSave, Corrupted
        {
            String downloadUri = (String) jsonObj.get("url");

            int saved = 1;
            try
            {
                URL url = new URL(downloadUri);
                java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
                InputStream stream = connection.getInputStream();

                if (stream == null) {
                    throw new Exception("Stream is null");
                }

                File savedFile = new File(storagePath);
                try (FileOutputStream out = new FileOutputStream(savedFile)) {
                    int read;
                    final byte[] bytes = new byte[1024];
                    while ((read = stream.read(bytes)) != -1) {
                        out.write(bytes, 0, read);
                    }
                    
                    out.flush();
                }
                
                connection.disconnect();

            }
            catch (Exception ex)
            {
                saved = 0;
            }
            
            writer.write("{{\"c\":\"saved\",\"status\":" + saved + "}}");
        }
    }

    
    
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }
}
