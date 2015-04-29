
package controllers;

import helpers.ConfigManager;
import helpers.DocumentManager;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import entities.FileModel;


@WebServlet(name = "EditorServlet", urlPatterns = {"/EditorServlet"})
public class EditorServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String mode = request.getParameter("mode");
        String fileExt = request.getParameter("fileExt");
        String fileName = request.getParameter("fileName");
        
        DocumentManager.Init(request, response);
        
        if(fileExt != null)
        {
            try
            {
                fileName = DocumentManager.CreateDemo(fileExt);
            }
            catch (Exception ex)
            {
                response.getWriter().write("Error: " + ex.getMessage());    
            }
        }

        Boolean desktopMode = !"embedded".equals(mode);
        
        FileModel file = new FileModel();
        file.SetTypeDesktop(desktopMode);
        file.SetFileName(fileName);
        
        request.setAttribute("file", file);
        request.setAttribute("mode", mode);
        request.setAttribute("type", desktopMode ? "desktop" : "embedded");
        request.setAttribute("docserviceApiUrl", ConfigManager.GetProperty("files.docservice.url.api"));
        request.getRequestDispatcher("editor.jsp").forward(request, response);
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
