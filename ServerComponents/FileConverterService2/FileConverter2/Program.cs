/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.IO;

using FileConverterUtils2;

using log4net;
using log4net.Config;

#if! OPEN_SOURCE
using ASCOfficeEWSEditor.Editor;
#endif

namespace FileConverter2
{
    class Program
    {
        static string m_strGuidFile = "";
        static string m_strFormatFile = "";
        static int m_cnPercentConst = 10000;
        static int m_nStageIndex = 1;
        static int m_nStageCount = 1;

        static uint c_nPageType = 0x0001;
        static int c_nHtmlRendererMode = 0x04 | 0x10;

        static int c_nSvgDefaultWidth = 960;
        static int c_nSvgDefaultHeight = 720;

        const int ZIP_NO_COMPRESSION = 0;
        const int ZIP_BEST_SPEED = 1;
        const int ZIP_BEST_COMPRESSION = 9;
        const int ZIP_DEFAULT_COMPRESSION = (-1);

        const int PresentationEditorSavePptx = 1;
        const int PresentationEditorSavePdf = 2;
        const int PresentationEditorSaveHtml = 3;

#if! OPEN_SOURCE
        static string m_sConfigFontDir = Environment.ExpandEnvironmentVariables(ConfigurationSettings.AppSettings["utils.common.fontdir"]);
#else
        static string m_sConfigFontDir = "";
#endif
        static string m_sConfigThemeDir = ConfigurationSettings.AppSettings["fileconverter.convert.presentationthemesdir"];
        static string m_sTMImageGuid = "TMImageGuid";
        static int Main(string[] args)
        {
            log4net.Config.XmlConfigurator.Configure();
            ILog _log = LogManager.GetLogger(typeof(Program));

            int nResult = (int)FileConverterUtils2.ErrorTypes.NoError;
            int nArgLength = args.Length;
            if (nArgLength < 1)
                return (int)FileConverterUtils2.ErrorTypes.Convert;
            try
            {
                ASCOfficeUtils.COfficeUtilsClass OfficeUtils = new ASCOfficeUtils.COfficeUtilsClass();
                TaskQueueDataConvert oTaskQueueDataConvert = TaskQueueDataConvert.DeserializeFromXml(File.ReadAllText(args[0], System.Text.Encoding.UTF8));
                int nFormatFrom = oTaskQueueDataConvert.m_nFormatFrom;
                int nFormatTo = oTaskQueueDataConvert.m_nFormatTo;
                string sFileFrom = oTaskQueueDataConvert.m_sFileFrom;
                string sFileTo = oTaskQueueDataConvert.m_sFileTo;
                m_strGuidFile = oTaskQueueDataConvert.m_sKey;
                m_strFormatFile = nFormatTo.ToString();
                bool? bPaid = oTaskQueueDataConvert.m_bPaid;
                bool? bEmbeddedFonts = oTaskQueueDataConvert.m_bEmbeddedFonts;
                
                if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB & nFormatFrom) && 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS & nFormatTo))
                {
                    OfficeUtils.ExtractToDirectory(sFileFrom, Path.GetDirectoryName(sFileTo), null, 0);
                }
                else if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB & nFormatTo) && 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS & nFormatFrom))
                {
                    OfficeUtils.CompressFileOrDirectory(Path.GetDirectoryName(sFileFrom), sFileTo, ZIP_DEFAULT_COMPRESSION);
                }
                else
                {
                    int nSourceFormatFrom = nFormatFrom;
                    string sSourceFileFrom = sFileFrom;
                    int nSourceFormatTo = nFormatTo;
                    string sSourceFileTo = sFileTo;

                    string sTempDirectory = Path.Combine(Path.GetDirectoryName(sFileTo), "Temp");
                    Directory.CreateDirectory(sTempDirectory);

                    string sTempConvertDir = Path.Combine(sTempDirectory, "Convert");
                    Directory.CreateDirectory(sTempConvertDir);

                    if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB & nFormatFrom) || FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT == nFormatFrom ||
                        FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING == nFormatFrom || FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION == nFormatFrom)
                    {
                        string sUnzipDir = Path.Combine(sTempDirectory, "Unzip");
                        Directory.CreateDirectory(sUnzipDir);
                        OfficeUtils.ExtractToDirectory(sFileFrom, sUnzipDir, null, 0);

                        if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY == nFormatFrom)
                        {
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.bin");
                            nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD;
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY == nFormatFrom)
                        {
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.bin");
                            nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET;
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY == nFormatFrom)
                        {
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.bin");
                            nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION;
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DOCUMENT == nFormatFrom)
                        {
                            string sFileFromArch = Path.Combine(sUnzipDir, "Editor.html.arch");
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.html");
                            if (File.Exists(sFileFromArch))
                                File.Copy(sFileFromArch, sFileFrom, true);
                            nFormatFrom = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML;

                            OldDocumentReplaceImages oOldDocumentReplaceImages = new OldDocumentReplaceImages();
                            oOldDocumentReplaceImages.sPath = Path.GetDirectoryName(sFileFrom);
                            string sContent = File.ReadAllText(sFileFrom, System.Text.Encoding.UTF8);
                            sContent = System.Text.RegularExpressions.Regex.Replace(sContent, "<img(.*?) src=\"(.*?)\"", oOldDocumentReplaceImages.undoReplace);
                            File.WriteAllText(sFileFrom, sContent, System.Text.Encoding.UTF8);
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION == nFormatFrom)
                        {
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.xml");

                            string sEditorPath = Path.Combine(sUnzipDir, "Editor.xml");
                            string sThemesPath = Path.Combine(sUnzipDir, "Themes.xml");
                            string sReplacePath = Path.GetDirectoryName(sFileFrom);
                            if (File.Exists(sEditorPath))
                            {
                                string sContent = File.ReadAllText(sEditorPath, System.Text.Encoding.UTF8);
                                sContent = sContent.Replace(m_sTMImageGuid, sReplacePath);
                                File.WriteAllText(sEditorPath, sContent, System.Text.Encoding.UTF8);
                            }
                            if (File.Exists(sThemesPath))
                            {
                                string sContent = File.ReadAllText(sThemesPath, System.Text.Encoding.UTF8);
                                sContent = sContent.Replace(m_sTMImageGuid, sReplacePath);
                                File.WriteAllText(sThemesPath, sContent, System.Text.Encoding.UTF8);
                            }
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING == nFormatFrom)
                        {
                            sFileFrom = Path.Combine(sUnzipDir, "Editor.svg");

                            string sContent = File.ReadAllText(sFileFrom, System.Text.Encoding.UTF8);
                            sContent = sContent.Replace(m_sTMImageGuid, Path.GetDirectoryName(sFileFrom) + "/");
                            
                            File.WriteAllText(sFileFrom, sContent, new System.Text.UTF8Encoding(false));
                        }
                    }
                    string sTempToZipDir = Path.Combine(sTempDirectory, "ToZip"); ;
                    if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB & nFormatTo))
                    {
                        Directory.CreateDirectory(sTempToZipDir);

                        sFileTo = Path.Combine(sTempToZipDir, "Editor.bin");
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY == nFormatTo)
                            nFormatTo = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD;
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY == nFormatTo)
                            nFormatTo = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET;
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY == nFormatTo)
                            nFormatTo = FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION;
                    }
#if! OPEN_SOURCE
                    
                    ASCOfficeFile.CAVSOfficeFileConverterClass converter = new ASCOfficeFile.CAVSOfficeFileConverterClass();
                    converter.OnProgressEx += new ASCOfficeFile._IAVSOfficeFileConverterEvents_OnProgressExEventHandler(converter_OnProgressEx);
#endif

                    if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == nFormatTo)
                    {
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_UNKNOWN == nFormatFrom)
                        {
                            PdfWriter.CPdfWriter oPdfWriter = new PdfWriter.CPdfWriter();
                            oPdfWriter.SetThemesPlace(Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), m_sConfigThemeDir));
                            oPdfWriter.SetHtmlPlace(Path.GetDirectoryName(sFileFrom));
                            if (bPaid.HasValue && false == bPaid.Value)
                                oPdfWriter.SetUnregistredVersion(true);
                            if (false == oPdfWriter.SavePdf(sFileFrom, sFileTo))
                                nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                        }
                        else
                        {
                            
                            if (nFormatTo == nFormatFrom || (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == nFormatFrom))
                            {
                                File.Copy(sFileFrom, sFileTo);
                            }
                            else
                            {
#if! OPEN_SOURCE
                                string sAdditionalOptions = "";
                                if (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT == nFormatFrom && oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                                    sAdditionalOptions = "<TXTOptions><Encoding>" + oTaskQueueDataConvert.m_nCsvTxtEncoding.Value + "</Encoding></TXTOptions>";
                                converter.LoadFromFile(sFileFrom, sTempConvertDir, "<Options><Display/><DownloadImages>1</DownloadImages><FB2Options><GenerateContent val=\"1\"/></FB2Options>" + sAdditionalOptions + "</Options>");
                                converter.FileType = FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF; 

                                m_nStageIndex = 2;
                                converter.SaveToFile(sFileTo, sTempConvertDir, "");
#else
                                nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
#endif
                            }
                        }
                    }
#if! OPEN_SOURCE
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLRCanvas == nFormatTo || (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD == nFormatTo && 0 == (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT & nFormatFrom)))
                    {
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD == nFormatTo && 0 == (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT & nFormatFrom))
                        {
                            nFormatTo = FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLRCanvas;
                            sFileTo = Path.GetDirectoryName(sFileTo);
                        }
                        
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_PRESENTATION == nFormatFrom)
                        {
                            ASCPresentationEditor.CAVSPresentationEditor oPresEditor = new ASCPresentationEditor.CAVSPresentationEditor();
                            oPresEditor.TempDirectory = sTempConvertDir;
                            oPresEditor.OpenXmlFile(sFileFrom);

                            if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLR == nFormatTo)
                                oPresEditor.Save(3, sFileTo);
                            else
                                oPresEditor.Save(4, sFileTo);
                            oPresEditor.CloseFile(false);
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING == nFormatFrom)
                        {
                            ASCGraphics.SVGTransformerClass piSvgTransformer = new ASCGraphics.SVGTransformerClass();
                            piSvgTransformer.SetAdditionalParam("DefaultWidth", c_nSvgDefaultWidth); 
                            piSvgTransformer.SetAdditionalParam("DefaultHeight", c_nSvgDefaultHeight); 
                            piSvgTransformer.LoadFile(sFileFrom);
                            int nWidthPx = piSvgTransformer.Width;
                            int nHeightPx = piSvgTransformer.Height;
                            double dWidthMm = 2.54 * 10 * nWidthPx / 96; 
                            double dHeightMm = 2.54 * 10 * nHeightPx / 96; 

                            ASCHTMLRenderer.CASCHTMLRenderer2 piHtmlRenderer = new ASCHTMLRenderer.CASCHTMLRenderer2();
                            piHtmlRenderer.Mode = c_nHtmlRendererMode;
                            piHtmlRenderer.CreateOfficeFile(sFileTo);
                            piHtmlRenderer.NewPage();
                            piHtmlRenderer.Width = dWidthMm;
                            piHtmlRenderer.Height = dHeightMm;
                            piHtmlRenderer.BeginCommand(c_nPageType);
                            piSvgTransformer.Draw(piHtmlRenderer, 0, 0, dWidthMm, dHeightMm);
                            piHtmlRenderer.EndCommand(c_nPageType);
                            piHtmlRenderer.CloseFile();
                        }
                        else
                        {
                            m_nStageCount = 2;
                            m_nStageIndex = 1;

                            string sAdditionalOptions = "";
                            if (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT == nFormatFrom && oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                                sAdditionalOptions = "<TXTOptions><Encoding>" + oTaskQueueDataConvert.m_nCsvTxtEncoding.Value + "</Encoding></TXTOptions>";
                            converter.LoadFromFile(sFileFrom, sTempConvertDir, "<Options><Display/><DownloadImages>1</DownloadImages><FB2Options><GenerateContent val=\"1\"/></FB2Options>" + sAdditionalOptions + "</Options>");
                            converter.FileType = nFormatTo; 

                            m_nStageIndex = 2;
                            converter.SaveToFile(sFileTo, sTempConvertDir, "<Options><LoadInCommandRenderer/><HtmlRendererMode>" + c_nHtmlRendererMode + "</HtmlRendererMode></Options>");
                        }
                        
                        if (File.Exists(sFileFrom) && Directory.Exists(sFileTo))
                            File.Copy(sFileFrom, Path.Combine(sFileTo, "origin"), true);
                        
                        string sDirTo = sFileTo;
                        string sDocumentJs = Path.Combine(sDirTo, "document.js");
                        string sEditorBin = Path.Combine(sDirTo, "Editor.bin");
                        if (File.Exists(sDocumentJs) && false == File.Exists(sEditorBin))
                            File.Move(sDocumentJs, sEditorBin);
                    }
#endif
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD == nFormatTo)
                    {
#if! OPEN_SOURCE
                        string sAdditionalOptions = "";
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_TXT == nFormatFrom && oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                            sAdditionalOptions = "<TXTOptions><Encoding>" + oTaskQueueDataConvert.m_nCsvTxtEncoding.Value + "</Encoding></TXTOptions>";
                        converter.LoadFromFile(sFileFrom, sTempConvertDir, "<Options><Display/><FB2Options><GenerateContent val=\"0\"/></FB2Options>" + sAdditionalOptions + "</Options>");
#else
                        OfficeUtils.ExtractToDirectory(sFileFrom, sTempConvertDir, null, 0);
#endif
                        ASCOfficeDocxFile2.CAVSOfficeDocxFile2Class oDocxFile = new ASCOfficeDocxFile2.CAVSOfficeDocxFile2Class();
                        oDocxFile.SetFontDir(m_sConfigFontDir);

                        if (bEmbeddedFonts.HasValue && true == bEmbeddedFonts.Value)
                            oDocxFile.SetAdditionalParam("EmbeddedFontsDirectory", Path.Combine(Path.GetDirectoryName(sFileTo), "fonts"));
                        oDocxFile.OpenFile(sTempConvertDir, sFileTo);
                    }
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_WORD == nFormatFrom)
                    {
                        if (oTaskQueueDataConvert.m_bFromChanges.HasValue && oTaskQueueDataConvert.m_bFromChanges.Value)
                        {

                            string sDirFrom = Path.GetDirectoryName(sFileFrom);
                            string sDirChanges = Path.Combine(sDirFrom, "changes");

                            string sNewFileFrom = Path.Combine(sDirFrom, "Editor1.bin");
                            System.Diagnostics.Process convertProc = new System.Diagnostics.Process();
                            convertProc.StartInfo.FileName = "node";
                            convertProc.StartInfo.CreateNoWindow = true;
                            convertProc.StartInfo.UseShellExecute = false;
                            convertProc.StartInfo.WorkingDirectory = ConfigurationSettings.AppSettings["fileconverter.merge.workdir"];
                            convertProc.StartInfo.Arguments = "\"" + ConfigurationSettings.AppSettings["fileconverter.merge.script"] + 
                                                            "\" \"" + sFileFrom +
                                                            "\" \"" + sDirChanges +
                                                            "\" \"" + sNewFileFrom + "\"";
                            convertProc.Start();
                            convertProc.WaitForExit();
                            sFileFrom = sNewFileFrom;
                            if(0 != convertProc.ExitCode)
                                nResult = (int)FileConverterUtils2.ErrorTypes.Unknown;
                        }
                        if (nResult == (int)FileConverterUtils2.ErrorTypes.NoError)
                        {
                            ASCOfficeDocxFile2.CAVSOfficeDocxFile2Class oDocxWriter = new ASCOfficeDocxFile2.CAVSOfficeDocxFile2Class();
                            oDocxWriter.SetAdditionalParam("FontDir", m_sConfigFontDir);
                            if (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX != nFormatTo)
                                oDocxWriter.SetAdditionalParam("SaveChartAsImg", true);
                            oDocxWriter.Write(sFileFrom, sTempConvertDir);
#if! OPEN_SOURCE
                            if (bPaid.HasValue && false == bPaid)
                            {
                                ASCDocxFile.COfficeDocxFileClass oDocxFile = new ASCDocxFile.COfficeDocxFileClass();
                                oDocxFile.AddObjects(sTempConvertDir, "<AddObjects><Paragraph><Text value=\"Created by YoursDocs\"/></Paragraph><Paragraph><Link value=\"http://www.yoursdocs.com/\" href=\"http://www.yoursdocs.com/\"/></Paragraph></AddObjects>");
                            }

                            if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP != nFormatTo)
                            {
                                converter.FileType = nFormatTo;
                                converter.SaveToFile(sFileTo, sTempConvertDir, "");
                            }
                            else
                            {
                                string sTempConvertDir2 = Path.Combine(sTempDirectory, "Convert2");
                                Directory.CreateDirectory(sTempConvertDir2);

                                converter.FileType = FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT_HTML;
                                string sConvertFileTo = Path.Combine(sTempConvertDir2, Path.GetFileNameWithoutExtension(sFileTo) + ".html");
                                converter.SaveToFile(sConvertFileTo, sTempConvertDir, "");

                                OfficeUtils.CompressFileOrDirectory(sTempConvertDir2, sFileTo, ZIP_DEFAULT_COMPRESSION);
                                Directory.Delete(sTempConvertDir2, true);
                            }
#else
                            OfficeUtils.CompressFileOrDirectory(sTempConvertDir, sFileTo, ZIP_DEFAULT_COMPRESSION);
#endif
                        }
                    }
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION == nFormatTo)
                    {
#if! OPEN_SOURCE
                        ASCPresentationEditor.CAVSPresentationEditorClass oPresentationEditor = new ASCPresentationEditor.CAVSPresentationEditorClass();
                        oPresentationEditor.TempDirectory = sTempConvertDir;
                        oPresentationEditor.SetFontDir(m_sConfigFontDir);
                        oPresentationEditor.ConvertToPPTY(sFileFrom, sFileTo);
#else
                        ASCOfficePPTXFile.CAVSOfficePPTXFileClass oCAVSOfficePPTXFile = new ASCOfficePPTXFile.CAVSOfficePPTXFileClass();
                        oCAVSOfficePPTXFile.TempDirectory = sTempConvertDir;
                        oCAVSOfficePPTXFile.SetFontDir(m_sConfigFontDir);
                        if (bEmbeddedFonts.HasValue && true == bEmbeddedFonts.Value)
                            oCAVSOfficePPTXFile.SetAdditionalParam("EmbeddedFontsDirectory", Path.Combine(Path.GetDirectoryName(sFileTo), "fonts"));
                        oCAVSOfficePPTXFile.OpenFileToPPTY(sFileFrom, sFileTo);
#endif
                    }
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION == nFormatFrom)
                    {
                        ASCOfficePPTXFile.CAVSOfficePPTXFileClass oCAVSOfficePPTXFile = new ASCOfficePPTXFile.CAVSOfficePPTXFileClass();
                        oCAVSOfficePPTXFile.TempDirectory = sTempConvertDir;
                        oCAVSOfficePPTXFile.SetThemesDir(Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), m_sConfigThemeDir));
                        oCAVSOfficePPTXFile.ConvertPPTYToPPTX(sFileFrom, sFileTo);
                    }
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET == nFormatTo)
                    {
                        XlsxSerializerCom.CAVSOfficeXlsxSerizer oXlsxSerizer = new XlsxSerializerCom.CAVSOfficeXlsxSerizer();
                        oXlsxSerizer.SetFontDir(m_sConfigFontDir);
                        if (bEmbeddedFonts.HasValue && true == bEmbeddedFonts.Value)
                            oXlsxSerizer.SetAdditionalParam("EmbeddedFontsDirectory", Path.Combine(Path.GetDirectoryName(sFileTo), "fonts"));

                        if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV == nFormatFrom)
                        {
                            int nCsvEncoding = 65001;
                            char cDelimiter = ',';
                            if (oTaskQueueDataConvert.m_nCsvDelimiter.HasValue)
                            {
                                switch (oTaskQueueDataConvert.m_nCsvDelimiter.Value)
                                {
                                    case (int)CsvDelimiter.Tab: cDelimiter = '\t'; break;
                                    case (int)CsvDelimiter.Semicolon: cDelimiter = ';'; break;
                                    case (int)CsvDelimiter.Сolon: cDelimiter = ':'; break;
                                    case (int)CsvDelimiter.Comma: cDelimiter = ','; break;
                                    case (int)CsvDelimiter.Space: cDelimiter = ' '; break;
                                }
                            }
                            if (oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                                nCsvEncoding = oTaskQueueDataConvert.m_nCsvTxtEncoding.Value;

                            string strXmlOptions = string.Format("<xmlOptions><fileOptions fileType='2' codePage='{0}' delimiter='{1}' /></xmlOptions>", nCsvEncoding, cDelimiter);
                            
                            oXlsxSerizer.SaveToFile(sFileTo, sFileFrom, strXmlOptions);
                        }
#if! OPEN_SOURCE
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS == nFormatFrom)
                        {
                            ASCOfficeOdfFile.COfficeOdfFileClass oOdfFile = new ASCOfficeOdfFile.COfficeOdfFileClass();
                            oOdfFile.LoadFromFile(sFileFrom, sTempConvertDir, "");
                            oXlsxSerizer.SaveToFile(sFileTo, sTempConvertDir, "");
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS == nFormatFrom)
                        {
                            ASCOfficeXlsFile.CXlsFileClass oXlsFile = new ASCOfficeXlsFile.CXlsFileClass();
                            oXlsFile.LoadFromFile(sFileFrom, sTempConvertDir, "");
                            oXlsxSerizer.SaveToFile(sFileTo, sTempConvertDir, "");
                        }
#endif
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX == nFormatFrom)
                        {
                            OfficeUtils.ExtractToDirectory(sFileFrom, sTempConvertDir, null, 0);
                            oXlsxSerizer.SaveToFile(sFileTo, sTempConvertDir, "");
                        }
                    }
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET == nFormatFrom)
                    {
                        XlsxSerializerCom.CAVSOfficeXlsxSerizer oXlsxSerizer = new XlsxSerializerCom.CAVSOfficeXlsxSerizer();
                        oXlsxSerizer.LoadFromFile(sFileFrom, sTempConvertDir, "");

                        string sTempConvertDir2 = Path.Combine(sTempDirectory, "Convert2");
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX == nFormatTo)
                        {
#if! OPEN_SOURCE
                            ASCDocxFile.COfficeDocxFileClass oDocxFile = new ASCDocxFile.COfficeDocxFileClass();
                            oDocxFile.SaveToFile(sFileTo, sTempConvertDir, "");
#else
                            OfficeUtils.CompressFileOrDirectory(sTempConvertDir, sFileTo, ZIP_DEFAULT_COMPRESSION);
#endif
                        }
#if! OPEN_SOURCE
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS == nFormatTo)
                        {
                            ASCOfficeXlsFile.CXlsFileClass oXlsFile = new ASCOfficeXlsFile.CXlsFileClass();
                            oXlsFile.SaveToFile(sFileTo, sTempConvertDir, "");
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS == nFormatTo)
                        {
                            Directory.CreateDirectory(sTempConvertDir2);
                            string sFileXlsx = Path.Combine(sTempConvertDir2, "converted.xlsx");
                            ASCDocxFile.COfficeDocxFileClass oDocxFile = new ASCDocxFile.COfficeDocxFileClass();
                            oDocxFile.SaveToFile(sFileXlsx, sTempConvertDir, "");
                            ASCOfficeEWSEditor.Editor.ODSConverter.ODSConverter.ConvertFile(sFileXlsx, sFileTo, CleverAge.OdfConverter.OdfConverterLib.ConversionDirection.XlsxToOds);
                        }
#endif
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV == nFormatTo)
                        {
                            int nCsvEncoding = System.Text.Encoding.UTF8.CodePage;
                            if (oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                                nCsvEncoding = oTaskQueueDataConvert.m_nCsvTxtEncoding.Value;
                            char cDelimiter = ',';
                            if (oTaskQueueDataConvert.m_nCsvDelimiter.HasValue)
                            {
                                switch (oTaskQueueDataConvert.m_nCsvDelimiter.Value)
                                {
                                    case 1: cDelimiter = (char)0x09; break;
                                    case 2: cDelimiter = ';'; break;
                                    case 3: cDelimiter = ':'; break;
                                    case 4: cDelimiter = ','; break;
                                    case 5: cDelimiter = ' '; break;
                                }
                            }
                            string strXmlOptions = string.Format("<xmlOptions><fileOptions fileType='2' codePage='{0}' delimiter='{1}' /></xmlOptions>", nCsvEncoding, cDelimiter);
                            oXlsxSerizer.LoadFromFile(sFileFrom, sFileTo, strXmlOptions);
                        }
#if! OPEN_SOURCE
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP == nFormatTo)
                        {
                            Directory.CreateDirectory(sTempConvertDir2);
                            ASCOfficeWSHtmlFile.CWSHtmlFileClass oWSHtmlFile = new ASCOfficeWSHtmlFile.CWSHtmlFileClass();
                            oWSHtmlFile.SaveToFile(Path.Combine(sTempConvertDir2, "main.html"), sTempConvertDir, "");
                            OfficeUtils.CompressFileOrDirectory(sTempConvertDir2, sFileTo, ZIP_DEFAULT_COMPRESSION);
                        }
#endif
                    }
#if! OPEN_SOURCE
                    else if (FileFormats.AVS_OFFICESTUDIO_FILE_OTHER_OLD_DRAWING == nFormatFrom)
                    {
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == nFormatTo)
                        {
                            ASCGraphics.SVGTransformerClass piSvgTransformer = new ASCGraphics.SVGTransformerClass();
                            piSvgTransformer.LoadFile(sFileFrom);
                            int nWidthPx = piSvgTransformer.Width;
                            int nHeightPx = piSvgTransformer.Height;
                            double dWidthMm = 2.54 * 10 * nWidthPx / 72; 
                            double dHeightMm = 2.54 * 10 * nHeightPx / 72; 

                            ASCOfficePDFWriter.CPDFWriterClass piPdfWriter = new ASCOfficePDFWriter.CPDFWriterClass();
                            piPdfWriter.CreatePDF();
                            piPdfWriter.NewPage();
                            piPdfWriter.Width = dWidthMm;
                            piPdfWriter.Height = dHeightMm;
                            piPdfWriter.BeginCommand(c_nPageType);
                            piSvgTransformer.Draw(piPdfWriter, 0, 0, dWidthMm, dHeightMm);
                            piPdfWriter.EndCommand(c_nPageType);
                            piPdfWriter.SaveToFile(sFileTo);
                            piPdfWriter.DeletePDF();
                        }
                        else
                        {
                            string sXmlTo = "";
                            string sXmlAddition = "";
                            switch (nFormatTo)
                            {
                                case FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_PNG: sXmlTo = "Png"; break;
                                case FileFormats.AVS_OFFICESTUDIO_FILE_IMAGE_JPG: sXmlTo = "Jpeg"; sXmlAddition = " quality=\"80\""; break;
                            }
                            try
                            {
                                
                                ASCImageStudio3.ImageTransformsClass piImageTransform = new ASCImageStudio3.ImageTransformsClass();
                                string sXml = "<transforms>";
                                sXml += "<ImageFile-LoadImage sourcepath='" + sFileFrom + "'/>";
                                
                                sXml += "</transforms>";

                                nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                                if (piImageTransform.SetXml(sXml))
                                    if (piImageTransform.Transform())
                                    {
                                        object oFullImage;
                                        piImageTransform.GetResult(0, out oFullImage);

                                        ASCMediaCore3.CAVSUncompressedVideoFrame piUnkFrame = (ASCMediaCore3.CAVSUncompressedVideoFrame)oFullImage;
                                        
                                        if (piUnkFrame.BufferSize > 0)
                                        {
                                            piImageTransform.SetSource(0, oFullImage);
                                            sXml = "<transforms>";
                                            sXml += "<ImageFile-SaveAs" + sXmlTo + " destinationpath=\"" + sFileTo + "\" format=\"8888\"" + sXmlAddition + "/>";
                                            sXml += "</transforms>";
                                            if (piImageTransform.SetXml(sXml))
                                                if (piImageTransform.Transform())
                                                    nResult = (int)FileConverterUtils2.ErrorTypes.NoError;
                                        }
                                    }
                            }
                            catch(Exception e)
                            {
                                nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                                _log.Error("Exception catched while image transform.", e);
                            }
                        }
                    }
                    else if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT & nFormatFrom) && 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_DOCUMENT & nFormatTo))
                    {
                        m_nStageCount = 2;
                        m_nStageIndex = 1;

                        converter.LoadFromFile(sFileFrom, sTempConvertDir, "");
                        converter.FileType = nFormatTo;

                        m_nStageIndex = 2;
                        converter.SaveToFile(sFileTo, sTempConvertDir, "");
                    }
                    else if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET & nFormatFrom) && 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET & nFormatTo))
                    {
                        string sXlsxDir = Path.Combine(sTempConvertDir, "xlsx");
                        Directory.CreateDirectory(sXlsxDir);
                        if(FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX == nFormatFrom)
                        {
                            ASCDocxFile.COfficeDocxFileClass oDocxFileClass = new ASCDocxFile.COfficeDocxFileClass();
                            oDocxFileClass.LoadFromFile(sFileFrom, sXlsxDir, "");
                        }
                        else if(FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS == nFormatFrom)
                        {
                            ASCOfficeXlsFile.CXlsFileClass oXlsFileClass = new ASCOfficeXlsFile.CXlsFileClass();
                            oXlsFileClass.LoadFromFile(sFileFrom, sXlsxDir, "");
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS == nFormatFrom)
                        {
                            ASCOfficeOdfFile.COfficeOdfFileClass oOdfFile = new ASCOfficeOdfFile.COfficeOdfFileClass();
                            oOdfFile.LoadFromFile(sFileFrom, sXlsxDir, "");
                        }
                        else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV == nFormatFrom)
                        {
                            string sTempFile = Path.Combine(sTempConvertDir, "temp_from.xlsx");
                            using (EWSEditor oEditor = new EWSEditor())
                            {
                                Workbook wb = oEditor.LoadWorkbookFromCSV(sFileFrom, System.Text.Encoding.UTF8.CodePage, ',');
                                wb.Save(sTempFile, ASCOfficeEWSEditor.Editor.FileFormats.Format.XLSX);
                            }
                            ASCDocxFile.COfficeDocxFileClass oDocxFileClass = new ASCDocxFile.COfficeDocxFileClass();
                            oDocxFileClass.LoadFromFile(sTempFile, sXlsxDir, "");
                        }
                        else
                            nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                        if (nResult == (int)FileConverterUtils2.ErrorTypes.NoError)
                        {
                            if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX == nFormatTo)
                            {
                                ASCDocxFile.COfficeDocxFileClass oDocxFileClass = new ASCDocxFile.COfficeDocxFileClass();
                                oDocxFileClass.SaveToFile(sFileTo, sXlsxDir, "");
                            }
                            else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLS == nFormatTo)
                            {
                                ASCOfficeXlsFile.CXlsFileClass oXlsFileClass = new ASCOfficeXlsFile.CXlsFileClass();
                                oXlsFileClass.SaveToFile(sFileTo, sXlsxDir, "");
                            }
                            else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_ODS == nFormatTo)
                            {
                                string sTempFile = Path.Combine(sTempConvertDir, "temp_to.xlsx");
                                ASCDocxFile.COfficeDocxFileClass oDocxFileClass = new ASCDocxFile.COfficeDocxFileClass();
                                oDocxFileClass.SaveToFile(sTempFile, sXlsxDir, "");
                                ASCOfficeEWSEditor.Editor.ODSConverter.ODSConverter.ConvertFile(sTempFile, sFileTo, CleverAge.OdfConverter.OdfConverterLib.ConversionDirection.XlsxToOds);
                            }
                            else if (FileFormats.AVS_OFFICESTUDIO_FILE_SPREADSHEET_CSV == nFormatTo)
                            {
                                string sTempFile = Path.Combine(sTempConvertDir, "temp_to.xlsx");
                                ASCDocxFile.COfficeDocxFileClass oDocxFileClass = new ASCDocxFile.COfficeDocxFileClass();
                                oDocxFileClass.SaveToFile(sTempFile, sXlsxDir, "");
                                using (EWSEditor oEditor = new EWSEditor())
                                {
                                    Workbook wb = oEditor.LoadWorkbook(sTempFile);
                                    int nCsvEncoding = System.Text.Encoding.UTF8.CodePage;
                                    if (oTaskQueueDataConvert.m_nCsvTxtEncoding.HasValue)
                                        nCsvEncoding = oTaskQueueDataConvert.m_nCsvTxtEncoding.Value;
                                    char cDelimiter = ',';
                                    if (oTaskQueueDataConvert.m_nCsvDelimiter.HasValue)
                                    {
                                        switch (oTaskQueueDataConvert.m_nCsvDelimiter.Value)
                                        {
                                            case 1: cDelimiter = (char)0x09; break;
                                            case 2: cDelimiter = ';'; break;
                                            case 3: cDelimiter = ':'; break;
                                            case 4: cDelimiter = ','; break;
                                            case 5: cDelimiter = ' '; break;
                                        }
                                    }
                                    wb.SaveToCSV(sFileTo, nCsvEncoding, cDelimiter);
                                }
                            }
                            else
                                nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                        }
                    }
                    else if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION & nFormatFrom) && 0 != (FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION & nFormatTo))
                    {
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX == nFormatTo)
                        {
                            ASCPresentationEditor.CAVSPresentationEditorClass oPresentationEditor = new ASCPresentationEditor.CAVSPresentationEditorClass();
                            oPresentationEditor.TempDirectory = sTempConvertDir;
                            oPresentationEditor.SetFontDir(m_sConfigFontDir);
                            oPresentationEditor.OpenFile(sFileFrom);
                            oPresentationEditor.Save(PresentationEditorSavePptx, sFileTo);
                        }
                        else
                            nResult = (int)FileConverterUtils2.ErrorTypes.Convert;
                    }
#endif
                    else
                        nResult = (int)FileConverterUtils2.ErrorTypes.Convert;

                    if (0 != (FileFormats.AVS_OFFICESTUDIO_FILE_TEAMLAB & nSourceFormatTo))
                    {
                        if (FileFormats.AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_HTMLRCanvas == nFormatTo)
                            OfficeUtils.CompressFileOrDirectory(sFileTo, sSourceFileTo, ZIP_DEFAULT_COMPRESSION);
                        else
                            OfficeUtils.CompressFileOrDirectory(Path.GetDirectoryName(sFileTo), sSourceFileTo, ZIP_DEFAULT_COMPRESSION);
                    }
#if! OPEN_SOURCE
                    
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(converter);
#endif
                    Directory.Delete(sTempDirectory, true);
                }
            }
            catch (Exception e)
            {
                if (e is System.Runtime.InteropServices.COMException)
                {
                    System.Runtime.InteropServices.COMException eCOMException = e as System.Runtime.InteropServices.COMException;
                    nResult = eCOMException.ErrorCode;
                }
                else
                    nResult = (int)FileConverterUtils2.ErrorTypes.Convert;

                _log.Error("Exception catched in Main() method.", e);
            }
            return nResult;
        }

        private static void converter_OnProgressEx(int nID, int nPercent, ref short Cancel)
        {
            nPercent /= m_cnPercentConst;
            int nStagePercentStart = (100 / m_nStageCount) * (m_nStageIndex - 1);
            int nOutputPercent = (nStagePercentStart + (nPercent / m_nStageCount));

            nOutputPercent = nOutputPercent * 95 / 100;
            Console.WriteLine("\"" + m_strGuidFile + "\" \"" + nOutputPercent.ToString() + "\" \"" + m_strFormatFile + "\"");
        }
        private class OldDocumentReplaceImages
        {
            public string sPath;
            public string undoReplace(System.Text.RegularExpressions.Match m)
            {
                if (m.Groups.Count >= 3)
                {
                    string href = m.Groups[2].Value;
                    int index = href.IndexOf(m_sTMImageGuid);
                    if (-1 != index)
                        href = sPath + href.Substring(index + m_sTMImageGuid.Length);
                    return "<img" + m.Groups[1].Value + " src=\"" + href + "\"";
                }
                else
                    return m.Groups[0].Value;
            }
        }
    }
}