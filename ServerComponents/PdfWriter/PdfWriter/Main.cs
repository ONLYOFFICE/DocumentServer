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
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;

namespace PdfWriter
{
    enum CommandType
    {
        ctPenXML						= 0,
        ctPenColor						= 1,
        ctPenAlpha						= 2,
        ctPenSize						= 3,
        ctPenDashStyle					= 4,
        ctPenLineStartCap				= 5,
        ctPenLineEndCap				    = 6,
        ctPenLineJoin					= 7,
        ctPenDashPatern				    = 8,
        ctPenDashPatternCount			= 9,
        ctPenDashOffset				    = 10,
        ctPenAlign						= 11,
        ctPenMiterLimit				    = 12,

        ctBrushXML						= 20,
        ctBrushType					    = 21,
        ctBrushColor1					= 22,
        ctBrushColor2					= 23,
        ctBrushAlpha1					= 24,
        ctBrushAlpha2					= 25,
        ctBrushTexturePath				= 26,
        ctBrushTextureAlpha			    = 27,
        ctBrushTextureMode				= 28,
        ctBrushRectable				    = 29,
        ctBrushRectableEnabled 		    = 30,
        ctBrushGradient                 = 31,

        ctFontXML						= 40,
        ctFontName						= 41,
        ctFontSize						= 42,
        ctFontStyle					    = 43,
        ctFontPath						= 44,
        ctFontGID						= 45,
        ctFontCharSpace				    = 46,

        ctShadowXML					    = 50,
        ctShadowVisible				    = 51,
        ctShadowDistanceX				= 52,
        ctShadowDistanceY				= 53,
        ctShadowBlurSize				= 54,
        ctShadowColor					= 55,
        ctShadowAlpha					= 56,

        ctEdgeXML						= 70,
        ctEdgeVisible					= 71,
        ctEdgeDistance					= 72,
        ctEdgeColor					    = 73,
        ctEdgeAlpha					    = 74,

        ctDrawText						= 80,
        ctDrawTextEx					= 81,

        ctPathCommandMoveTo			    = 91,
        ctPathCommandLineTo			    = 92,
        ctPathCommandLinesTo			= 93,
        ctPathCommandCurveTo			= 94,
        ctPathCommandCurvesTo			= 95,
        ctPathCommandArcTo		        = 96,
        ctPathCommandClose				= 97,
        ctPathCommandEnd				= 98,
        ctDrawPath						= 99,
        ctPathCommandStart				= 100,
        ctPathCommandGetCurrentPoint	= 101,
        ctPathCommandText				= 102,
        ctPathCommandTextEx			    = 103,

        ctDrawImage					    = 110,
        ctDrawImageFromFile			    = 111,

        ctSetParams					    = 120,

        ctBeginCommand					= 121,
        ctEndCommand					= 122,

        ctSetTransform					= 130,
        ctResetTransform				= 131,

        ctClipMode						= 140,

        ctCommandLong1					= 150,
        ctCommandDouble1				= 151,
        ctCommandString1				= 152,
        ctCommandLong2					= 153,
        ctCommandDouble2				= 154,
        ctCommandString2				= 155,

        ctPageWidth                     = 200,
        ctPageHeight                    = 201,

        ctPageStart                     = 202,
        ctPageEnd                       = 203,

        ctError						    = 255
    }

    public class CPdfWriter
    {
        private string m_sHtmlPlace = "";
        private string m_sThemesPlace = "";
        private bool m_bIsUnregistredVersion = false;

        List<string> m_arTmpTexturePrushPaths = new List<string>();

        public void SetHtmlPlace(string sRoot)
        {
            m_sHtmlPlace = sRoot;
        }

        public void SetThemesPlace(string sRoot)
        {
            m_sThemesPlace = sRoot;
        }

        public void SetUnregistredVersion(bool bIsUnReg)
        {
            m_bIsUnregistredVersion = bIsUnReg;
        }

        public bool SavePdf2(string sPathXml, string sDstFile)
        {
            try
            {                
                AVSOfficePDFWriter.CPDFWriterClass oWriter = new AVSOfficePDFWriter.CPDFWriterClass();
                oWriter.CreatePDF();

                XmlDocument oDocument = new XmlDocument();
                oDocument.Load(sPathXml);

                XmlNodeList list = oDocument.ChildNodes[0].ChildNodes;
                int nPagesCount = list.Count;
                for (int nPage = 0; nPage < nPagesCount; ++nPage)
                {
                    oWriter.NewPage();
                    oWriter.BeginCommand(1);

                    XmlNodeList nodes = list[nPage].ChildNodes;
                    int nCommandsCount = nodes.Count;

                    bool bIsPathOpened = false;
                    for (int nCommand = 0; nCommand < nCommandsCount; ++nCommand)
                    {
                        XmlNode oNode = nodes[nCommand];
                        XmlAttributeCollection attr = oNode.Attributes;
                        CommandType type = (CommandType)Convert.ToInt32(oNode.Attributes["t"].Value);

                        switch (type)
                        {
                            case CommandType.ctPenColor:
                                oWriter.PenColor = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctPenAlpha:
                                oWriter.PenAlpha = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctPenSize:
                                oWriter.PenSize = Convert.ToDouble(attr["v"].Value);
                                break;
                            case CommandType.ctBrushColor1:
                                oWriter.BrushColor1 = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctBrushAlpha1:
                                oWriter.BrushAlpha1 = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctBrushColor2:
                                oWriter.BrushColor2 = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctBrushAlpha2:
                                oWriter.BrushAlpha2 = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctSetTransform:
                                oWriter.SetTransform(Convert.ToDouble(attr["m1"].Value), Convert.ToDouble(attr["m2"].Value), Convert.ToDouble(attr["m3"].Value),
                                    Convert.ToDouble(attr["m4"].Value), Convert.ToDouble(attr["m5"].Value), Convert.ToDouble(attr["m6"].Value));
                                break;
                            case CommandType.ctPathCommandStart:
                                if (bIsPathOpened)
                                {
                                    oWriter.PathCommandEnd();
                                    oWriter.EndCommand(4);
                                    oWriter.PathCommandStart();
                                    oWriter.BeginCommand(4);
                                }
                                else
                                {
                                    oWriter.PathCommandStart();
                                    oWriter.BeginCommand(4);
                                }
                                bIsPathOpened = true;
                                break;
                            case CommandType.ctPathCommandMoveTo:
                                oWriter.PathCommandMoveTo(Convert.ToDouble(attr["x"].Value), Convert.ToDouble(attr["y"].Value));
                                break;
                            case CommandType.ctPathCommandLineTo:
                                oWriter.PathCommandLineTo(Convert.ToDouble(attr["x"].Value), Convert.ToDouble(attr["y"].Value));
                                break;
                            case CommandType.ctPathCommandCurveTo:
                                oWriter.PathCommandCurveTo(Convert.ToDouble(attr["x1"].Value), Convert.ToDouble(attr["y1"].Value), Convert.ToDouble(attr["x2"].Value),
                                    Convert.ToDouble(attr["y2"].Value), Convert.ToDouble(attr["x3"].Value), Convert.ToDouble(attr["y3"].Value));
                                break;
                            case CommandType.ctPathCommandClose:
                                oWriter.PathCommandClose();
                                break;
                            case CommandType.ctDrawPath:
                                oWriter.DrawPath(Convert.ToInt32(attr["v"].Value));
                                break;
                            case CommandType.ctDrawImageFromFile:
                                oWriter.DrawImageFromFile(attr["src"].Value, Convert.ToDouble(attr["x"].Value), Convert.ToDouble(attr["y"].Value),
                                    Convert.ToDouble(attr["w"]), Convert.ToDouble(attr["h"].Value));
                                break;
                            case CommandType.ctFontName:
                                oWriter.FontName = attr["v"].Value;
                                break;
                            case CommandType.ctFontSize:
                                oWriter.FontSize = Convert.ToDouble(attr["v"].Value);
                                break;
                            case CommandType.ctFontStyle:
                                oWriter.FontStyle = Convert.ToInt32(attr["v"].Value);
                                break;
                            case CommandType.ctDrawText:
                                oWriter.CommandDrawText(attr["v"].Value, Convert.ToDouble(attr["x"].Value), Convert.ToDouble(attr["y"].Value), 0, 0, 0);
                                break;
                            default:
                                break;
                        };
                    }

                    if (bIsPathOpened)
                    {
                        oWriter.PathCommandEnd();
                        oWriter.EndCommand(4);
                    }

                    oWriter.EndCommand(1);
                }

                oWriter.SaveToFile(sDstFile);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool SavePdf(string sPathXml, string sDstFile)
        {
            m_arTmpTexturePrushPaths.Clear();

            CommandType eCommand = CommandType.ctError;

            int len = 0;
            int curindex = 0;

            int nCountPages = 0;
            string sTempLogo = "";
            try
            {
                AVSGraphics.CAVSWinFonts winfonts = new AVSGraphics.CAVSWinFontsClass();
                AVSOfficePDFWriter.CPDFWriterClass oWriter = new AVSOfficePDFWriter.CPDFWriterClass();
                oWriter.CreatePDF();
                oWriter.SetPDFCompressionMode(15);

                bool bIsPathOpened = false;

                StringBuilder sHypers = new StringBuilder();
                sHypers.Append("<linker>");                
                                
                unsafe
                {
                    string[] array50 = File.ReadAllLines(sPathXml, Encoding.UTF8);

                    for (int index50 = 0; index50 < array50.Length; index50++)
                    {
                        byte[] dstArray = Convert.FromBase64String(array50[index50]);
                        len = dstArray.Length;
                        curindex = 0;

                        Int32* m = null;
                        UInt16* ms = null;
                        int _sLen = 0;
                        string s = "";

                        double m1 = 0;
                        double m2 = 0;
                        double m3 = 0;
                        double m4 = 0;
                        double m5 = 0;
                        double m6 = 0;

                        string imgPath = "";
                        string base64Temp = "";

                        fixed (byte* p = dstArray)
                        {
                            byte* current = p;
                            while (curindex < len)
                            {
                                eCommand = (CommandType)(*current);
                                current++;
                                curindex++;
                                switch (eCommand)
                                {
                                    case CommandType.ctPageWidth:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;
                                        oWriter.Width = ((*m) / 100000.0);
                                        break;
                                    case CommandType.ctPageHeight:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;
                                        oWriter.Height = ((*m) / 100000.0);
                                        break;
                                    case CommandType.ctPageStart:
                                        oWriter.NewPage();
                                        oWriter.BeginCommand(1);
                                        ++nCountPages;
                                        break;
                                    case CommandType.ctPageEnd:
                                        if (bIsPathOpened)
                                        {
                                            oWriter.PathCommandEnd();
                                            oWriter.EndCommand(4);
                                        }

                                        bIsPathOpened = false;

                                        if (m_bIsUnregistredVersion)
                                        {
                                            double ww = oWriter.Width;
                                            double wh = oWriter.Height;

                                            double dR = ww - 13;
                                            double dB = wh - 5;
                                            double k = 1.0;

                                            if (ww <= wh)
                                            {
                                                
                                                double k1 = ww / 210;
                                                double k2 = wh / 297;
                                                k = Math.Min(k1, k2);
                                            }
                                            else
                                            {
                                                double k1 = ww / 297;
                                                double k2 = wh / 210;
                                                k = Math.Min(k1, k2);
                                            }
                                            double dW = 15 * 5.9 * k;
                                            double dH = 15 * k;

                                            double dKoef = 72 / 25.4;

                                            sHypers.AppendFormat("<link><source x=\"{0}\" y=\"{1}\" width=\"{2}\" height=\"{3}\" page=\"{4}\"/>", (int)((dR - dW) * dKoef), (int)((dB - dH) * dKoef), (int)(dW * dKoef), (int)(dH * dKoef), nCountPages - 1);
                                            sHypers.Append("<target url=\"www.teamlab.com\"/></link>");

                                            oWriter.ResetTransform();

                                            if ("" == sTempLogo)
                                            {
                                                sTempLogo = Path.GetTempFileName();
                                                File.WriteAllBytes(sTempLogo, PdfWriter.Properties.Resources.logo);
                                            }
                                            oWriter.DrawImageFromFile(sTempLogo, dR - dW, dB - dH, dW, dH);
                                        }

                                        oWriter.EndCommand(1);
                                        break;
                                    case CommandType.ctPenColor:
                                        m = (Int32*)current;
                                        oWriter.PenColor = *m;
                                        current += 4;
                                        curindex += 4;
                                        break;
                                    case CommandType.ctPenAlpha:
                                        oWriter.PenAlpha = *current;
                                        current++;
                                        curindex++;
                                        break;
                                    case CommandType.ctPenSize:
                                        m = (Int32*)current;
                                        oWriter.PenSize = *m / 100000.0;
                                        current += 4;
                                        curindex += 4;
                                        break;
                                    case CommandType.ctPenLineJoin:
                                        oWriter.PenLineJoin = *current;
                                        current++;
                                        curindex++;
                                        break;
                                    case CommandType.ctBrushType:
                                        m = (Int32*)current;
                                        oWriter.BrushType = *m;
                                        current += 4;
                                        curindex += 4;
                                        break;
                                    case CommandType.ctBrushColor1:
                                        m = (Int32*)current;
                                        oWriter.BrushColor1 = *m;
                                        current += 4;
                                        curindex += 4;
                                        break;
                                    case CommandType.ctBrushAlpha1:
                                        oWriter.BrushAlpha1 = *current;
                                        current++;
                                        curindex++;
                                        break;
                                    case CommandType.ctBrushColor2:
                                        m = (Int32*)current;
                                        oWriter.BrushColor1 = *m;
                                        current += 4;
                                        curindex += 4;
                                        break;
                                    case CommandType.ctBrushAlpha2:
                                        oWriter.BrushAlpha2 = *current;
                                        current++;
                                        curindex++;
                                        break;
                                    case CommandType.ctBrushRectable:
                                        m = (Int32*)current;
                                        current += 4 * 4;
                                        curindex += 4 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        m3 = (*m++) / 100000.0;
                                        m4 = (*m++) / 100000.0;

                                        oWriter.BrushRect(0, m1, m2, m3, m4);
                                        break;
                                    case CommandType.ctBrushRectableEnabled:
                                        bool bEn = (1 == *current);
                                        oWriter.SetAdditionalParam("BrushFillBoundsEnable", bEn);

                                        current += 1;
                                        curindex += 1;
                                        break;
                                    case CommandType.ctBrushTexturePath:
                                        ms = (UInt16*)current;
                                        current += 2;
                                        curindex += 2;

                                        _sLen = (int)(*ms);
                                        s = new string((char*)current, 0, _sLen);
                                        imgPath = s;

                                        if (0 != s.IndexOf("http:") &&
                                            0 != s.IndexOf("https:") &&
                                            0 != s.IndexOf("ftp:") &&
                                            0 != s.IndexOf("file:"))
                                        {
                                            if (0 == s.IndexOf("theme"))
                                            {
                                                imgPath = Path.Combine(m_sThemesPlace, s);
                                            }
                                            else
                                            {
                                                imgPath = Path.Combine(m_sHtmlPlace, s);

                                                int _len = imgPath.Length;
                                                int ind = imgPath.LastIndexOf(".svg");
                                                if (ind != -1)
                                                {
                                                    if (ind == (_len - 4))
                                                    {
                                                        string sInterest = imgPath.Substring(0, ind);

                                                        if (File.Exists(sInterest + ".emf"))
                                                            imgPath = sInterest + ".emf";
                                                        else if (File.Exists(sInterest + ".wmf"))
                                                            imgPath = sInterest + ".wmf";
                                                    }
                                                }
                                            }
                                        }

                                        base64Temp = "";
                                        if (0 == s.IndexOf("data:"))
                                        {
                                            try
                                            {
                                                int nFind = s.IndexOf(",");
                                                s = s.Remove(0, nFind + 1);

                                                base64Temp = Path.GetTempFileName();
                                                byte[] byteIm = Convert.FromBase64String(s);
                                                File.WriteAllBytes(base64Temp, byteIm);

                                                imgPath = base64Temp;
                                            }
                                            catch
                                            {
                                            }
                                        }

                                        current += 2 * _sLen;
                                        curindex += 2 * _sLen;

                                        oWriter.BrushTexturePath = imgPath;

                                        if (base64Temp != "")
                                        {
                                            m_arTmpTexturePrushPaths.Add(base64Temp);
                                        }
                                        break;
                                    case CommandType.ctBrushGradient:
                                        current++;
                                        curindex++;

                                        string strAttrMain = "";
                                        string strColors = "";
                                        bool bIsLinear = true;

                                        while (true)
                                        {
                                            byte _command = *current;
                                            current++;
                                            curindex++;

                                            if (251 == _command)
                                                break;

                                            switch (_command)
                                            {
                                                case 0:
                                                    {
                                                        current += 5;
                                                        curindex += 5;

                                                        m = (Int32*)current;
                                                        current += 4 * 4;
                                                        curindex += 4 * 4;

                                                        double d1 = (*m++) / 100000.0;
                                                        double d2 = (*m++) / 100000.0;
                                                        double d3 = (*m++) / 100000.0;
                                                        double d4 = (*m++) / 100000.0;

                                                        strAttrMain = String.Format("x1=\"{0}\" y1=\"{1}\" x2=\"{2}\" y2=\"{3}\" gradientUnits=\"userSpaceOnUse\"", d1, d2, d3, d4);
                                                        strAttrMain = strAttrMain.Replace(',', '.');
                                                        break;
                                                    }
                                                case 1:
                                                    {
                                                        bIsLinear = false;

                                                        current++;
                                                        curindex++;

                                                        m = (Int32*)current;
                                                        current += 6 * 4;
                                                        curindex += 6 * 4;

                                                        double d1 = (*m++) / 100000.0;
                                                        double d2 = (*m++) / 100000.0;
                                                        double d3 = (*m++) / 100000.0;
                                                        double d4 = (*m++) / 100000.0;
                                                        double d5 = (*m++) / 100000.0;
                                                        double d6 = (*m++) / 100000.0;

                                                        strAttrMain = String.Format("cx=\"{0}\" cy=\"{1}\" r0=\"{2}\" r1=\"{3}\" rx=\"{4}\" ry=\"{5}\" gradientUnits=\"userSpaceOnUse\"", d1, d2, d5, d6, d1, d2);
                                                        strAttrMain = strAttrMain.Replace(',', '.');
                                                        break;
                                                    }
                                                case 2:
                                                    {
                                                        int nCountColors = *((Int32*)current);

                                                        current += 4;
                                                        curindex += 4;

                                                        for (int nI = 0; nI < nCountColors; ++nI)
                                                        {
                                                            int pos = *((Int32*)current);
                                                            current += 4;
                                                            curindex += 4;

                                                            double dPos = pos / 100000.0;
                                                            byte _r = *current++;
                                                            byte _g = *current++;
                                                            byte _b = *current++;
                                                            byte _a = *current++;

                                                            curindex += 4;

                                                            int _color = ((_b << 16) & 0xFF0000) | ((_g << 8) & 0xFF00) | _r;
                                                            string sColor = String.Format("<stop stop-color=\"{0}\" stop-opacity=\"{1}\" offset=\"{2}\" />", _color, _a / 255.0, dPos);

                                                            sColor = sColor.Replace(',', '.');
                                                            strColors += sColor;
                                                        }

                                                        break;
                                                    }
                                                default:
                                                    break;
                                            };
                                        }

                                        string strXml = "";

                                        if (bIsLinear)
                                        {
                                            strXml = "<linearGradient " + strAttrMain + ">" + strColors + "</linearGradient>";
                                            oWriter.SetAdditionalParam("Fill-LinearGradient", strXml);
                                        }
                                        else
                                        {
                                            strXml = "<radialGradient " + strAttrMain + ">" + strColors + "</radialGradient>";
                                            oWriter.SetAdditionalParam("Fill-RadialGradient", strXml);
                                        }                                        

                                        break;
                                    case CommandType.ctBrushTextureMode:
                                        int mode = (int)(*current);
                                        oWriter.BrushTextureMode = mode;

                                        current += 1;
                                        curindex += 1;
                                        break;
                                    case CommandType.ctBrushTextureAlpha:
                                        int txalpha = (int)(*current);
                                        oWriter.BrushTextureAlpha = txalpha;

                                        current += 1;
                                        curindex += 1;
                                        break;
                                    case CommandType.ctSetTransform:
                                        m = (Int32*)current;
                                        current += 6 * 4;
                                        curindex += 6 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        m3 = (*m++) / 100000.0;
                                        m4 = (*m++) / 100000.0;
                                        m5 = (*m++) / 100000.0;
                                        m6 = (*m++) / 100000.0;

                                        oWriter.SetTransform(m1, m2, m3, m4, m5, m6);
                                        break;
                                    case CommandType.ctPathCommandStart:
                                        if (bIsPathOpened)
                                        {
                                            oWriter.PathCommandEnd();
                                            oWriter.EndCommand(4);
                                            oWriter.BeginCommand(4);
                                            oWriter.PathCommandStart();
                                        }
                                        else
                                        {
                                            oWriter.BeginCommand(4);
                                            oWriter.PathCommandStart();
                                        }
                                        bIsPathOpened = true;
                                        break;
                                    case CommandType.ctPathCommandEnd:
                                        if (bIsPathOpened)
                                        {
                                            oWriter.PathCommandEnd();
                                            oWriter.EndCommand(4);
                                            bIsPathOpened = false;
                                        }
                                        break;
                                    case CommandType.ctPathCommandMoveTo:
                                        m = (Int32*)current;
                                        current += 2 * 4;
                                        curindex += 2 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        oWriter.PathCommandMoveTo(m1, m2);
                                        break;
                                    case CommandType.ctPathCommandLineTo:
                                        m = (Int32*)current;
                                        current += 2 * 4;
                                        curindex += 2 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        oWriter.PathCommandLineTo(m1, m2);
                                        break;
                                    case CommandType.ctPathCommandCurveTo:
                                        m = (Int32*)current;
                                        current += 6 * 4;
                                        curindex += 6 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        m3 = (*m++) / 100000.0;
                                        m4 = (*m++) / 100000.0;
                                        m5 = (*m++) / 100000.0;
                                        m6 = (*m++) / 100000.0;

                                        oWriter.PathCommandCurveTo(m1, m2, m3, m4, m5, m6);
                                        break;
                                    case CommandType.ctPathCommandClose:
                                        oWriter.PathCommandClose();
                                        break;
                                    case CommandType.ctDrawPath:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;

                                        oWriter.DrawPath(*m);
                                        break;
                                    case CommandType.ctDrawImageFromFile:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;

                                        _sLen = (int)(*m);
                                        _sLen /= 2;
                                        s = new string((char*)current, 0, _sLen);

                                        imgPath = s;

                                        if (0 != s.IndexOf("http:") &&
                                            0 != s.IndexOf("https:") &&
                                            0 != s.IndexOf("ftp:") &&
                                            0 != s.IndexOf("file:"))
                                        {
                                            if (0 == s.IndexOf("theme"))
                                            {
                                                imgPath = Path.Combine(m_sThemesPlace, s);
                                            }
                                            else
                                            {
                                                imgPath = Path.Combine(m_sHtmlPlace, s);

                                                int _len = imgPath.Length;
                                                int ind = imgPath.LastIndexOf(".svg");
                                                if (ind != -1)
                                                {
                                                    if (ind == (_len - 4))
                                                    {
                                                        string sInterest = imgPath.Substring(0, ind);

                                                        if (File.Exists(sInterest + ".emf"))
                                                            imgPath = sInterest + ".emf";
                                                        else if (File.Exists(sInterest + ".wmf"))
                                                            imgPath = sInterest + ".wmf";
                                                    }
                                                }
                                            }
                                        }

                                        base64Temp = "";
                                        if (0 == s.IndexOf("data:"))
                                        {
                                            try
                                            {
                                                int nFind = s.IndexOf(",");
                                                s = s.Remove(0, nFind + 1);

                                                base64Temp = Path.GetTempFileName();
                                                byte[] byteIm = Convert.FromBase64String(s);
                                                File.WriteAllBytes(base64Temp, byteIm);

                                                imgPath = base64Temp;
                                            }
                                            catch
                                            {
                                            }
                                        }

                                        current += 2 * _sLen;
                                        curindex += 2 * _sLen;

                                        m = (Int32*)current;
                                        current += 4 * 4;
                                        curindex += 4 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        m3 = (*m++) / 100000.0;
                                        m4 = (*m++) / 100000.0;

                                        try
                                        {
                                            oWriter.DrawImageFromFile(imgPath, m1, m2, m3, m4);
                                        }
                                        catch { }

                                        if (base64Temp != "")
                                        {
                                            File.Delete(base64Temp);
                                        }
                                        break;
                                    case CommandType.ctFontName:
                                        ms = (UInt16*)current;
                                        current += 2;
                                        curindex += 2;

                                        _sLen = (int)(*ms);
                                        s = new string((char*)current, 0, _sLen);

                                        current += 2 * _sLen;
                                        curindex += 2 * _sLen;
                                        oWriter.FontName = s;
                                        break;
                                    case CommandType.ctFontSize:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;

                                        m1 = (*m++) / 100000.0;
                                        
                                        oWriter.FontSize = Math.Min(m1, 1000.0);
                                        break;
                                    case CommandType.ctFontStyle:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;

                                        oWriter.FontStyle = *m;
                                        break;
                                    case CommandType.ctDrawText:
                                        ms = (UInt16*)current;
                                        current += 2;
                                        curindex += 2;

                                        _sLen = (int)(*ms);
                                        s = new string((char*)current, 0, _sLen);

                                        current += 2 * _sLen;
                                        curindex += 2 * _sLen;

                                        m = (Int32*)current;
                                        current += 2 * 4;
                                        curindex += 2 * 4;

                                        m1 = (*m++) / 100000.0;
                                        m2 = (*m++) / 100000.0;
                                        oWriter.CommandDrawText(s, m1, m2, 0, 0, 0);
                                        break;
                                    case CommandType.ctBeginCommand:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;
                                        if (bIsPathOpened)
                                        {
                                            oWriter.PathCommandEnd();
                                            oWriter.EndCommand(4);
                                            bIsPathOpened = false;
                                        }
                                        oWriter.BeginCommand((uint)(*m));
                                        break;
                                    case CommandType.ctEndCommand:
                                        m = (Int32*)current;
                                        current += 4;
                                        curindex += 4;
                                        if (bIsPathOpened)
                                        {
                                            oWriter.PathCommandEnd();
                                            oWriter.EndCommand(4);
                                            bIsPathOpened = false;
                                        }
                                        oWriter.EndCommand((uint)(*m));
                                        oWriter.PathCommandEnd();
                                        break;
                                    default:
                                        break;
                                };

                            }
                        }
                    }
                }

                sHypers.Append("</linker>");

                if (m_bIsUnregistredVersion)
                {
                    oWriter.BeginCommand(8);
                    string strHypers = sHypers.ToString();
                    oWriter.CommandDrawText(strHypers, 0, 0, 0, 0, 0);
                    oWriter.EndCommand(8);
                }

                if (sTempLogo != "")
                    File.Delete(sTempLogo);

                DeleteTmpFiles();

                oWriter.SaveToFile(sDstFile);
                return true;
            }
            catch
            {
                if (sTempLogo != "")
                    File.Delete(sTempLogo);

                DeleteTmpFiles();
                return false;
            }
        }

        private void DeleteTmpFiles()
        {
            int len = m_arTmpTexturePrushPaths.Count;
            for (int i = 0; i < len; ++i)
            {
                if (File.Exists(m_arTmpTexturePrushPaths[i]))
                    File.Delete(m_arTmpTexturePrushPaths[i]);
            }
            m_arTmpTexturePrushPaths.Clear();
        }
    }
}
