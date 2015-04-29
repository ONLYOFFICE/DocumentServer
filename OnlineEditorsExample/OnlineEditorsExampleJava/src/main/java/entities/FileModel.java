
package entities;

import helpers.DocumentManager;
import helpers.ServiceConverter;
import helpers.FileUtility;

public class FileModel
{
    private String FileName;
    private Boolean TypeDesktop;

    public String GetFileName()
    {
        return FileName;
    }

    public void SetFileName(String fileName)
    {
        this.FileName = fileName;
    }
    
    public Boolean GetTypeDesktop()
    {
        return TypeDesktop;
    }

    public void SetTypeDesktop(Boolean typeDesktop)
    {
        this.TypeDesktop = typeDesktop;
    }

    public String GetFileUri() throws Exception
    {
        return DocumentManager.GetFileUri(FileName);
    }

    public String GetDocumentType()
    {
        return FileUtility.GetFileType(FileName).toString().toLowerCase();
    }

    public String GetKey()
    {
        return ServiceConverter.GenerateRevisionId(DocumentManager.CurUserHostAddress(null) + "/" + FileName);
    }

    public String GetValidateKey()
    {
        return ServiceConverter.GenerateValidateKey(GetKey());
    }

    public String GetCallbackUrl()
    {
        return DocumentManager.GetCallback(FileName);
    }
}
