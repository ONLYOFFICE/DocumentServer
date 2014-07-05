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
 #include "stdafx.h"
#include "ASCOfficeDrawingConverter.h"

#include "./PPTXFormat/Logic/SpTreeElem.h"
#include "./PPTXFormat/Logic/Shape.h"
#include "./PPTXFormat/Logic/Pic.h"
#include "./PPTXFormat/Logic/CxnSp.h"
#include "./PPTXFormat/Logic/SpTree.h"
#include "./PPTXFormat/Logic/GraphicFrame.h"

#include "./PPTXFormat/Logic/Colors/SrgbClr.h"
#include "./PPTXFormat/Logic/Colors/PrstClr.h"
#include "./PPTXFormat/Logic/Colors/SchemeClr.h"
#include "./PPTXFormat/Logic/Colors/SysClr.h"

#include "./PPTXFormat/DocxFormat/Media/Image.h"
#include "../ASCPresentationEditor/OfficeDrawing/Elements.h"

#include "../ASCPresentationEditor/OfficeDrawing/Shapes/BaseShape/PPTXShape/pptx2pptshapeconverter.h"
#include "PPTXFormat/PPTX.h"

const double g_emu_koef	= 25.4 * 36000 / 72.0;




void DUMP_MESSAGE_TO_FILE(const char* strMessage)
{
	FILE* file = fopen("c:\\1.txt", "a+");
	fprintf(file, strMessage);
	fclose(file);
}

namespace NS_DWC_Common
{
	void CorrentCropString(CString& s)
	{
		int nLen = s.GetLength();
		if (nLen > 0 && (s[nLen - 1] == ((TCHAR)'f')))
		{
			s.Delete(nLen - 1);
			int nVal = XmlUtils::GetInteger(s);
			double dKoef = 100000.0 / 65536;
			nVal = (int)(dKoef * nVal);
			s = _T("");
			s.Format(_T("%d"), nVal);
		}
	}

	BYTE getOpacityFromString(const CString opacityStr)
	{
		BYTE alpha;
		if (opacityStr.Find(_T("f")) != -1)
			alpha = (BYTE) (XmlUtils::GetDouble(opacityStr) / 65536 * 256);
		else
		{
			if (0 == opacityStr.Find(_T(".")))
			{
				CString str = _T("0") + opacityStr;
				alpha = (BYTE)(XmlUtils::GetDouble(str) * 256);
			}
			else
				alpha = (BYTE)XmlUtils::GetDouble(opacityStr) * 256;
		}
		return alpha;
	}

	long getRealFromString( const CString& str )
	{
		long val = 0;

		if (str.Find(_T("f")) != -1)
			val = XmlUtils::GetInteger(str);
		else
			val = (long)(XmlUtils::GetDouble(str) * 65536);

		return val;
	}

	int getRotateAngle(const CString& str, const nullable_bool& flipX, const nullable_bool& flipY)
	{
		bool bIsInvertAngle = false;
		
		int nCheckInvert = 0;

		if (flipX.is_init() && flipX.get() == true)
			nCheckInvert += 1;
		if (flipY.is_init() && flipY.get() == true)
			nCheckInvert += 1;

		int nRot = XmlUtils::GetInteger(str);
		if (str.ReverseFind(TCHAR('f')) != -1)
		{
			double dVal = (double)nRot;
			dVal /= 65536;

			if (nCheckInvert == 1)
			{
				dVal = -dVal;
			}
			
			if (dVal > 360)
			{
				int nPart = (int)(dVal / 360);
				dVal = dVal - nPart * 360;
			}
			else if (dVal < 0)
			{
				int nPart = (int)(dVal / 360);
				nPart = 1 - nPart;
				dVal = dVal + nPart * 360;
			}

			nRot = (int)(dVal * 60000);
		}
		else
		{
			if (nCheckInvert == 1)
			{
				nRot = -nRot;
			}

			if (nRot > 360)
			{
				int nPart = (int)(nRot / 360);
				nRot = nRot - nPart * 360;
			}
			else if (nRot < 0)
			{
				int nPart = (int)(nRot / 360);
				nPart = 1 - nPart;
				nRot = nRot + nPart * 360;
			}

			nRot *= 60000;
		}	

		return nRot;
	}

	NSPresentationEditor::CColor getColorFromString(const CString& colorStr)
	{
		NSPresentationEditor::CColor color;
		if (colorStr.Find(_T("#")) != -1)
		{
			if (colorStr.GetLength() == 4)
			{
				int lColor = XmlUtils::GetColor(colorStr.Mid(1, 3));
				BYTE lB = ((lColor >> 16) & 0x0F);
				BYTE lG = ((lColor >> 20) & 0x0F);
				BYTE lR = ((lColor >> 8) & 0x0F);

				color.R = ((lR << 4) + lR);
				color.G = ((lG << 4) + lG);
				color.B = ((lB << 4) + lB);
				color.A = 0;
			}
			else
			{
				int lColor = XmlUtils::GetColor(colorStr.Mid(1, 6));
				color.R = (BYTE)(lColor >> 0);
				color.G = (BYTE)(lColor >> 8);
				color.B = (BYTE)(lColor >> 16);
				color.A = 0;
			}
		}
		else
		{
			CString str;

			int pos = colorStr.Find(' ');
			if( pos < 0 )
				str = colorStr;
			else
				str = colorStr.Left( pos );

			int RGB = 0;

			switch(str[0])
			{
			case 'a':
				if(str == "aliceBlue")			{RGB = 0xF0F8FF; break;} 
				if(str == "antiqueWhite")		{RGB = 0xFAEBD7; break;} 
				if(str == "aqua")				{RGB = 0x00FFFF; break;} 
				if(str == "aquamarine")			{RGB = 0x7FFFD4; break;} 
				if(str == "azure")				{RGB = 0xF0FFFF; break;} 
				break;
			case 'b':
				if(str == "beige")				{RGB = 0xF5F5DC; break;} 
				if(str == "bisque")				{RGB = 0xFFE4C4; break;} 
				if(str == "black")				{RGB = 0x000000; break;} 
				if(str == "blanchedAlmond")		{RGB = 0xFFEBCD; break;} 
				if(str == "blue")				{RGB = 0x0000FF; break;} 
				if(str == "blueViolet")			{RGB = 0x8A2BE2; break;} 
				if(str == "brown")				{RGB = 0xA52A2A; break;} 
				if(str == "burlyWood")			{RGB = 0xDEB887; break;} 
				break;
			case 'c':
				if(str == "cadetBlue")			{RGB = 0x5F9EA0; break;} 
				if(str == "chartreuse")			{RGB = 0x7FFF00; break;} 
				if(str == "chocolate")			{RGB = 0xD2691E; break;} 
				if(str == "coral")				{RGB = 0xFF7F50; break;} 
				if(str == "cornflowerBlue")		{RGB = 0x6495ED; break;} 
				if(str == "cornsilk")			{RGB = 0xFFF8DC; break;} 
				if(str == "crimson")			{RGB = 0xDC143C; break;} 
				if(str == "cyan")				{RGB = 0x00FFFF; break;} 
				break;
			case 'd':
				if(str == "darkBlue")			{RGB = 0x00008B; break;} 
				if(str == "darkCyan")			{RGB = 0x008B8B; break;} 
				if(str == "darkGoldenrod")		{RGB = 0xB8860B; break;} 
				if(str == "darkGray")			{RGB = 0xA9A9A9; break;} 
				if(str == "darkGreen")			{RGB = 0x006400; break;} 
				if(str == "darkGrey")			{RGB = 0xA9A9A9; break;} 
				if(str == "darkKhaki")			{RGB = 0xBDB76B; break;} 
				if(str == "darkMagenta")		{RGB = 0x8B008B; break;} 
				if(str == "darkOliveGreen")		{RGB = 0x556B2F; break;} 
				if(str == "darkOrange")			{RGB = 0xFF8C00; break;} 
				if(str == "darkOrchid")			{RGB = 0x9932CC; break;} 
				if(str == "darkRed")			{RGB = 0x8B0000; break;} 
				if(str == "darkSalmon")			{RGB = 0xE9967A; break;} 
				if(str == "darkSeaGreen")		{RGB = 0x8FBC8F; break;} 
				if(str == "darkSlateBlue")		{RGB = 0x483D8B; break;} 
				if(str == "darkSlateGray")		{RGB = 0x2F4F4F; break;} 
				if(str == "darkSlateGrey")		{RGB = 0x2F4F4F; break;} 
				if(str == "darkTurquoise")		{RGB = 0x00CED1; break;} 
				if(str == "darkViolet")			{RGB = 0x9400D3; break;} 
				if(str == "deepPink")			{RGB = 0xFF1493; break;} 
				if(str == "deepSkyBlue")		{RGB = 0x00BFFF; break;} 
				if(str == "dimGray")			{RGB = 0x696969; break;} 
				if(str == "dimGrey")			{RGB = 0x696969; break;} 
				if(str == "dkBlue")				{RGB = 0x00008B; break;} 
				if(str == "dkCyan")				{RGB = 0x008B8B; break;} 
				if(str == "dkGoldenrod")		{RGB = 0xB8860B; break;} 
				if(str == "dkGray")				{RGB = 0xA9A9A9; break;} 
				if(str == "dkGreen")			{RGB = 0x006400; break;} 
				if(str == "dkGrey")				{RGB = 0xA9A9A9; break;} 
				if(str == "dkKhaki")			{RGB = 0xBDB76B; break;} 
				if(str == "dkMagenta")			{RGB = 0x8B008B; break;} 
				if(str == "dkOliveGreen")		{RGB = 0x556B2F; break;} 
				if(str == "dkOrange")			{RGB = 0xFF8C00; break;} 
				if(str == "dkOrchid")			{RGB = 0x9932CC; break;} 
				if(str == "dkRed")				{RGB = 0x8B0000; break;} 
				if(str == "dkSalmon")			{RGB = 0xE9967A; break;} 
				if(str == "dkSeaGreen")			{RGB = 0x8FBC8B; break;} 
				if(str == "dkSlateBlue")		{RGB = 0x483D8B; break;} 
				if(str == "dkSlateGray")		{RGB = 0x2F4F4F; break;} 
				if(str == "dkSlateGrey")		{RGB = 0x2F4F4F; break;} 
				if(str == "dkTurquoise")		{RGB = 0x00CED1; break;} 
				if(str == "dkViolet")			{RGB = 0x9400D3; break;} 
				if(str == "dodgerBlue")			{RGB = 0x1E90FF; break;} 
				break;
			case 'f':
				if(str == "firebrick")			{RGB = 0xB22222; break;} 
				if(str == "floralWhite")		{RGB = 0xFFFAF0; break;} 
				if(str == "forestGreen")		{RGB = 0x228B22; break;} 
				if(str == "fuchsia")			{RGB = 0xFF00FF; break;} 
				break;
			case 'g':
				if(str == "gainsboro")			{RGB = 0xDCDCDC; break;} 
				if(str == "ghostWhite")			{RGB = 0xF8F8FF; break;} 
				if(str == "gold")				{RGB = 0xFFD700; break;} 
				if(str == "goldenrod")			{RGB = 0xDAA520; break;} 
				if(str == "gray")				{RGB = 0x808080; break;} 
				if(str == "green")				{RGB = 0x008000; break;} 
				if(str == "greenYellow")		{RGB = 0xADFF2F; break;} 
				if(str == "grey")				{RGB = 0x808080; break;} 
				break;
			case 'h':
				if(str == "honeydew")			{RGB = 0xF0FFF0; break;} 
				if(str == "hotPink")			{RGB = 0xFF69B4; break;} 
				break;
			case 'i':
				if(str == "indianRed")			{RGB = 0xCD5C5C; break;} 
				if(str == "indigo")				{RGB = 0x4B0082; break;} 
				if(str == "ivory")				{RGB = 0xFFFFF0; break;} 
				break;
			case 'k':
				if(str == "khaki")				{RGB = 0xF0E68C; break;} 
				break;
			case 'l':
				if(str == "lavender")			{RGB = 0xE6E6FA; break;} 
				if(str == "lavenderBlush")		{RGB = 0xFFF0F5; break;} 
				if(str == "lawnGreen")			{RGB = 0x7CFC00; break;} 
				if(str == "lemonChiffon")		{RGB = 0xFFFACD; break;} 
				if(str == "lightBlue")			{RGB = 0xADD8E6; break;} 
				if(str == "lightCoral")			{RGB = 0xF08080; break;} 
				if(str == "lightCyan")			{RGB = 0xE0FFFF; break;} 
				if(str=="lightGoldenrodYellow")	{RGB = 0xFAFAD2;break;} 
				if(str == "lightGray")			{RGB = 0xD3D3D3; break;} 
				if(str == "lightGreen")			{RGB = 0x90EE90; break;} 
				if(str == "lightGrey")			{RGB = 0xD3D3D3; break;} 
				if(str == "lightPink")			{RGB = 0xFFB6C1; break;} 
				if(str == "lightSalmon")		{RGB = 0xFFA07A; break;} 
				if(str == "lightSeaGreen")		{RGB = 0x20B2AA; break;} 
				if(str == "lightSkyBlue")		{RGB = 0x87CEFA; break;} 
				if(str == "lightSlateGray")		{RGB = 0x778899; break;} 
				if(str == "lightSlateGrey")		{RGB = 0x778899; break;} 
				if(str == "lightSteelBlue")		{RGB = 0xB0C4DE; break;} 
				if(str == "lightYellow")		{RGB = 0xFFFFE0; break;} 
				if(str == "lime")				{RGB = 0x00FF00; break;} 
				if(str == "limeGreen")			{RGB = 0x32CD32; break;} 
				if(str == "linen")				{RGB = 0xFAF0E6; break;} 
				if(str == "ltBlue")				{RGB = 0xADD8E6; break;} 
				if(str == "ltCoral")			{RGB = 0xF08080; break;} 
				if(str == "ltCyan")				{RGB = 0xE0FFFF; break;} 
				if(str == "ltGoldenrodYellow")	{RGB = 0xFAFA78; break;} 
				if(str == "ltGray")				{RGB = 0xD3D3D3; break;} 
				if(str == "ltGreen")			{RGB = 0x90EE90; break;} 
				if(str == "ltGrey")				{RGB = 0xD3D3D3; break;} 
				if(str == "ltPink")				{RGB = 0xFFB6C1; break;} 
				if(str == "ltSalmon")			{RGB = 0xFFA07A; break;} 
				if(str == "ltSeaGreen")			{RGB = 0x20B2AA; break;} 
				if(str == "ltSkyBlue")			{RGB = 0x87CEFA; break;} 
				if(str == "ltSlateGray")		{RGB = 0x778899; break;} 
				if(str == "ltSlateGrey")		{RGB = 0x778899; break;} 
				if(str == "ltSteelBlue")		{RGB = 0xB0C4DE; break;} 
				if(str == "ltYellow")			{RGB = 0xFFFFE0; break;} 
				break;
			case 'm':
				if(str == "magenta")			{RGB = 0xFF00FF; break;} 
				if(str == "maroon")				{RGB = 0x800000; break;} 
				if(str == "medAquamarine")		{RGB = 0x66CDAA; break;} 
				if(str == "medBlue")			{RGB = 0x0000CD; break;} 
				if(str == "mediumAquamarine")	{RGB = 0x66CDAA; break;} 
				if(str == "mediumBlue")			{RGB = 0x0000CD; break;} 
				if(str == "mediumOrchid")		{RGB = 0xBA55D3; break;} 
				if(str == "mediumPurple")		{RGB = 0x9370DB; break;} 
				if(str == "mediumSeaGreen")		{RGB = 0x3CB371; break;} 
				if(str == "mediumSlateBlue")	{RGB = 0x7B68EE; break;} 
				if(str == "mediumSpringGreen")	{RGB = 0x00FA9A; break;} 
				if(str == "mediumTurquoise")	{RGB = 0x48D1CC; break;} 
				if(str == "mediumVioletRed")	{RGB = 0xC71585; break;} 
				if(str == "medOrchid")			{RGB = 0xBA55D3; break;} 
				if(str == "medPurple")			{RGB = 0x9370DB; break;} 
				if(str == "medSeaGreen")		{RGB = 0x3CB371; break;} 
				if(str == "medSlateBlue")		{RGB = 0x7B68EE; break;} 
				if(str == "medSpringGreen")		{RGB = 0x00FA9A; break;} 
				if(str == "medTurquoise")		{RGB = 0x48D1CC; break;} 
				if(str == "medVioletRed")		{RGB = 0xC71585; break;} 
				if(str == "midnightBlue")		{RGB = 0x191970; break;} 
				if(str == "mintCream")			{RGB = 0xF5FFFA; break;} 
				if(str == "mistyRose")			{RGB = 0xFFE4FF; break;} 
				if(str == "moccasin")			{RGB = 0xFFE4B5; break;} 
				break;
			case 'n':
				if(str == "navajoWhite")		{RGB = 0xFFDEAD; break;} 
				if(str == "navy")				{RGB = 0x000080; break;} 
				break;
			case 'o':
				if(str == "oldLace")			{RGB = 0xFDF5E6; break;} 
				if(str == "olive")				{RGB = 0x808000; break;} 
				if(str == "oliveDrab")			{RGB = 0x6B8E23; break;} 
				if(str == "orange")				{RGB = 0xFFA500; break;} 
				if(str == "orangeRed")			{RGB = 0xFF4500; break;} 
				if(str == "orchid")				{RGB = 0xDA70D6; break;} 
				break;
			case 'p':
				if(str == "paleGoldenrod")		{RGB = 0xEEE8AA; break;} 
				if(str == "paleGreen")			{RGB = 0x98FB98; break;} 
				if(str == "paleTurquoise")		{RGB = 0xAFEEEE; break;} 
				if(str == "paleVioletRed")		{RGB = 0xDB7093; break;} 
				if(str == "papayaWhip")			{RGB = 0xFFEFD5; break;} 
				if(str == "peachPuff")			{RGB = 0xFFDAB9; break;} 
				if(str == "peru")				{RGB = 0xCD853F; break;} 
				if(str == "pink")				{RGB = 0xFFC0CB; break;} 
				if(str == "plum")				{RGB = 0xD3A0D3; break;} 
				if(str == "powderBlue")			{RGB = 0xB0E0E6; break;} 
				if(str == "purple")				{RGB = 0x800080; break;} 
				break;
			case 'r':
				if(str == "red")				{RGB = 0xFF0000; break;} 
				if(str == "rosyBrown")			{RGB = 0xBC8F8F; break;} 
				if(str == "royalBlue")			{RGB = 0x4169E1; break;} 
				break;
			case 's':
				if(str == "saddleBrown")		{RGB = 0x8B4513; break;} 
				if(str == "salmon")				{RGB = 0xFA8072; break;} 
				if(str == "sandyBrown")			{RGB = 0xF4A460; break;} 
				if(str == "seaGreen")			{RGB = 0x2E8B57; break;} 
				if(str == "seaShell")			{RGB = 0xFFF5EE; break;} 
				if(str == "sienna")				{RGB = 0xA0522D; break;} 
				if(str == "silver")				{RGB = 0xC0C0C0; break;} 
				if(str == "skyBlue")			{RGB = 0x87CEEB; break;} 
				if(str == "slateBlue")			{RGB = 0x6A5AEB; break;} 
				if(str == "slateGray")			{RGB = 0x708090; break;} 
				if(str == "slateGrey")			{RGB = 0x708090; break;} 
				if(str == "snow")				{RGB = 0xFFFAFA; break;} 
				if(str == "springGreen")		{RGB = 0x00FF7F; break;} 
				if(str == "steelBlue")			{RGB = 0x4682B4; break;} 
				break;
			case 't':
				if(str == "tan")				{RGB = 0xD2B48C; break;} 
				if(str == "teal")				{RGB = 0x008080; break;} 
				if(str == "thistle")			{RGB = 0xD8BFD8; break;} 
				if(str == "tomato")				{RGB = 0xFF7347; break;} 
				if(str == "turquoise")			{RGB = 0x40E0D0; break;} 
				break;
			case 'v':
				if(str == "violet")				{RGB = 0xEE82EE; break;} 
				break;
			case 'w':
				if(str == "wheat")				{RGB = 0xF5DEB3; break;} 
				if(str == "white")				{RGB = 0xFFFFFF; break;} 
				if(str == "whiteSmoke")			{RGB = 0xF5F5F5; break;} 
				break;
			case 'y':
				if(str == "yellow")				{RGB = 0xFFFF00; break;} 
				if(str == "yellowGreen")		{RGB = 0x9ACD32; break;} 
				break;
			}

			color.R = (BYTE)(RGB >>16);
			color.G = (BYTE)(RGB >> 8);
			color.B = (BYTE)(RGB);
			color.A = 0;		
		}
		return color;
	}
}

bool CAVSOfficeDrawingConverter::ParceObject(ATL::CString& strXml, BSTR* pMainProps, SAFEARRAY** ppBinary)
{
	XmlUtils::CXmlNode oMainNode;
	if (!oMainNode.FromXmlString(strXml))
		return NULL;

	XmlUtils::CXmlNodes oNodes;
	if (!oMainNode.GetNodes(_T("*"), oNodes))
		return NULL;

	ULONG lCurrentPosition = m_oBinaryWriter.GetPosition();
	m_oBinaryWriter.StartRecord(0);

	m_oBinaryWriter.ClearShapeCurSizes();

	LONG lCount = oNodes.GetCount();
	for (LONG i = 0; i < lCount; ++i)
	{
		XmlUtils::CXmlNode oParseNode;
		oNodes.GetAt(i, oParseNode);

		CString strFullName = oParseNode.GetName();
		CString strNS = XmlUtils::GetNamespace(strFullName);
		CString strName = XmlUtils::GetNameNoNS(strFullName);

		while (true) 
		{
			if (strName == _T("drawing"))
			{
				XmlUtils::CXmlNode oNodeAnchorInline = oParseNode.ReadNodeNoNS(_T("anchor"));
				if (!oNodeAnchorInline.IsValid())
				{
					oNodeAnchorInline = oParseNode.ReadNodeNoNS(_T("inline"));
				}

				if (oNodeAnchorInline.IsValid())
				{
					XmlUtils::CXmlNode oNodeExt;
					if (oNodeAnchorInline.GetNode(_T("wp:extent"), oNodeExt))
					{
						m_oBinaryWriter.m_lWidthCurShape = oNodeExt.ReadAttributeInt(_T("cx"));
						m_oBinaryWriter.m_lHeightCurShape = oNodeExt.ReadAttributeInt(_T("cy"));
					}

					SendMainProps(oNodeAnchorInline.GetXml(), pMainProps);

					XmlUtils::CXmlNode oNodeGraphic = oNodeAnchorInline.ReadNodeNoNS(_T("graphic"));
					XmlUtils::CXmlNode oNodeGraphicData = oNodeGraphic.ReadNodeNoNS(_T("graphicData"));

					if (oNodeGraphicData.IsValid())
					{
						XmlUtils::CXmlNodes oChilds;
						oNodeGraphicData.GetNodes(_T("*"), oChilds);

						if (1 == oChilds.GetCount())
						{
							XmlUtils::CXmlNode oNodeContent;
							oChilds.GetAt(0, oNodeContent);

							PPTX::Logic::SpTreeElem oElem;

							CString strCurrentRelsPath = m_strCurrentRelsPath;

							if (_T("dgm:relIds") == oNodeContent.GetName() && m_oBinaryWriter.m_pCommonRels.is_init())
							{
								nullable<OOX::RId> id_data;
								oNodeContent.ReadAttributeBase(L"r:dm", id_data);

								if (id_data.is_init())
								{
									smart_ptr<OOX::Image> pDiagData = m_oBinaryWriter.m_pCommonRels->image(*id_data);
									
									if (pDiagData.is_init())
									{
										CString strDiagDataPath = pDiagData->filename().m_strFilename;
										
										XmlUtils::CXmlNode oNodeDiagData;
										if (oNodeDiagData.FromXmlFile2(strDiagDataPath))
										{
											nullable<OOX::RId> id_drawing;

											XmlUtils::CXmlNode oNode2 = oNodeDiagData.ReadNode(_T("dgm:extLst"));
											if (oNode2.IsValid())
											{
												XmlUtils::CXmlNode oNode3 = oNode2.ReadNode(_T("a:ext"));
												if (oNode3.IsValid())
												{
													XmlUtils::CXmlNode oNode4 = oNode3.ReadNode(_T("dsp:dataModelExt"));
													if (oNode4.IsValid())
													{
														oNode4.ReadAttributeBase(L"relId", id_drawing);
													}
												}
											}

											if (id_drawing.is_init())
											{
												smart_ptr<OOX::Image> pDiagDW = m_oBinaryWriter.m_pCommonRels->image(*id_drawing);

												if (pDiagDW.is_init())
												{
													CString strPathDiagDW = pDiagDW->filename().m_strFilename;

													XmlUtils::CXmlNode oNodeDW;
													oNodeDW.FromXmlFile2(strPathDiagDW);

													XmlUtils::CXmlNode oNodeS = oNodeDW.ReadNodeNoNS(_T("spTree"));
													oElem = oNodeS;

													if (oElem.is<PPTX::Logic::SpTree>())
													{
														PPTX::Logic::SpTree& _pElem = oElem.as<PPTX::Logic::SpTree>();
														if (!_pElem.grpSpPr.xfrm.is_init())
														{
															_pElem.grpSpPr.xfrm = new PPTX::Logic::Xfrm();

															_pElem.grpSpPr.xfrm->offX = (int)0;
															_pElem.grpSpPr.xfrm->offY = (int)0;
															_pElem.grpSpPr.xfrm->extX = m_oBinaryWriter.m_lWidthCurShape;
															_pElem.grpSpPr.xfrm->extY = m_oBinaryWriter.m_lHeightCurShape;
															_pElem.grpSpPr.xfrm->chOffX = (int)0;
															_pElem.grpSpPr.xfrm->chOffY = (int)0;
															_pElem.grpSpPr.xfrm->chExtX = m_oBinaryWriter.m_lWidthCurShape;
															_pElem.grpSpPr.xfrm->chExtY = m_oBinaryWriter.m_lHeightCurShape;
														}
														else
														{
															if (!_pElem.grpSpPr.xfrm->offX.is_init())
																_pElem.grpSpPr.xfrm->offX = (int)0;
															if (!_pElem.grpSpPr.xfrm->offY.is_init())
																_pElem.grpSpPr.xfrm->offY = (int)0;
															if (!_pElem.grpSpPr.xfrm->extX.is_init())
																_pElem.grpSpPr.xfrm->extX = m_oBinaryWriter.m_lWidthCurShape;
															if (!_pElem.grpSpPr.xfrm->extY.is_init())
																_pElem.grpSpPr.xfrm->extY = m_oBinaryWriter.m_lHeightCurShape;
															if (!_pElem.grpSpPr.xfrm->chOffX.is_init())
																_pElem.grpSpPr.xfrm->chOffX = (int)0;
															if (!_pElem.grpSpPr.xfrm->chOffY.is_init())
																_pElem.grpSpPr.xfrm->chOffY = (int)0;
															if (!_pElem.grpSpPr.xfrm->chExtX.is_init())
																_pElem.grpSpPr.xfrm->chExtX = m_oBinaryWriter.m_lWidthCurShape;
															if (!_pElem.grpSpPr.xfrm->chExtY.is_init())
																_pElem.grpSpPr.xfrm->chExtY = m_oBinaryWriter.m_lHeightCurShape;
														}
													}
											
													m_strCurrentRelsPath = strPathDiagDW;
													SetCurrentRelsPath();
												}
											}
										}
									}
								}								
							}
							else if (_T("wpc:wpc") == oNodeContent.GetName())
							{
								PPTX::Logic::SpTree* pTree = new PPTX::Logic::SpTree();
								pTree->grpSpPr.xfrm = new PPTX::Logic::Xfrm();
								pTree->grpSpPr.xfrm->offX = 0;
								pTree->grpSpPr.xfrm->offY = 0;
								pTree->grpSpPr.xfrm->extX = m_oBinaryWriter.m_lWidthCurShape;
								pTree->grpSpPr.xfrm->extY = m_oBinaryWriter.m_lHeightCurShape;

								pTree->fromXML(oNodeContent);
								oElem.InitElem(pTree);
							}
							else
							{
								oElem = oNodeContent;

							#ifdef AVS_OFFICE_DRAWING_DUMP_PPTX_TO_PPT_TEST
								CString strVMLShapeXml = GetVMLShapeXml(oElem);
							#endif
							}

							if (!oElem.is_init())
							{
								CString strXFRM = _T("");
								strXFRM.Format(_T("<a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"%d\" cy=\"%d\"/></a:xfrm>"), 
									m_oBinaryWriter.m_lWidthCurShape, m_oBinaryWriter.m_lHeightCurShape);

								CString strUnsupported = _T("<wps:wsp \
xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" \
xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\"><wps:cNvSpPr/><wps:spPr>");
								strUnsupported += strXFRM;
								strUnsupported += _T("<a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom><a:noFill/>\
<a:ln><a:solidFill><a:srgbClr val=\"0070C0\"/></a:solidFill></a:ln></wps:spPr>\
<wps:bodyPr rot=\"0\" spcFirstLastPara=\"0\" vertOverflow=\"overflow\" horzOverflow=\"overflow\" vert=\"horz\" wrap=\"square\" lIns=\"91440\" tIns=\"45720\" \
rIns=\"91440\" bIns=\"45720\" numCol=\"1\" spcCol=\"0\" rtlCol=\"0\" fromWordArt=\"0\" anchor=\"ctr\" anchorCtr=\"0\" forceAA=\"0\" compatLnSpc=\"1\">\
<a:prstTxWarp prst=\"textNoShape\"><a:avLst/></a:prstTxWarp><a:noAutofit/></wps:bodyPr></wps:wsp>");

								XmlUtils::CXmlNode oNodeUnsupported;
								oNodeUnsupported.FromXmlString(strUnsupported);

								oElem = oNodeUnsupported;
							}

							m_oBinaryWriter.WriteRecord1(1, oElem);

							if (strCurrentRelsPath != m_strCurrentRelsPath)
							{
								m_strCurrentRelsPath = strCurrentRelsPath;
								SetCurrentRelsPath();
							}
						}
					}
				}

				

				break;
			}
			else if (strName == _T("pict") || strName == _T("object"))
			{
				XmlUtils::CXmlNodes oChilds;
				if (oParseNode.GetNodes(_T("*"), oChilds))
				{
					LONG lChildsCount = oChilds.GetCount();
					BOOL bIsFound = FALSE;

					for (LONG k = 0; k < lChildsCount; k++)
					{
						XmlUtils::CXmlNode oNodeP;
						oChilds.GetAt(k, oNodeP);

						CString strNameP = XmlUtils::GetNameNoNS(oNodeP.GetName());
						
						if (_T("shape") == strNameP ||
							_T("rect") == strNameP ||
							_T("oval") == strNameP ||
							_T("line") == strNameP ||
							_T("roundrect") == strNameP ||
							_T("polyline") == strNameP)
						{
							PPTX::Logic::SpTreeElem oElem = doc_LoadShape(oNodeP, pMainProps, true);
							m_oBinaryWriter.WriteRecord1(1, oElem);

							bIsFound = TRUE;

#ifdef AVS_OFFICE_DRAWING_DUMP_XML_TEST
							NSBinPptxRW::CXmlWriter oXmlW;
							oElem.toXmlWriter(&oXmlW);
							oXmlW.m_lDocType = XMLWRITER_DOC_TYPE_DOCX;
							CString strXmlTemp = oXmlW.GetXmlString();
#endif
						}
						else if (_T("group") == strNameP)
						{
							PPTX::Logic::SpTreeElem oElem = doc_LoadGroup(oNodeP, pMainProps, true);
							m_oBinaryWriter.WriteRecord1(1, oElem);

							bIsFound = TRUE;

#ifdef AVS_OFFICE_DRAWING_DUMP_XML_TEST
							NSBinPptxRW::CXmlWriter oXmlW;
							oXmlW.m_lDocType = XMLWRITER_DOC_TYPE_DOCX;
							oElem.toXmlWriter(&oXmlW);
							CString strXmlTemp = oXmlW.GetXmlString();
#endif
						}
						else
						{
							continue;
						}

						if (bIsFound)
							break;
					}
				}

				break;
			}
			else if (strName == _T("AlternateContent"))
			{
				XmlUtils::CXmlNode oNodeDr;
				if (oParseNode.GetNode(_T("w:drawing"), oNodeDr))
				{
					strName = _T("drawing");
					oParseNode = oNodeDr;
					continue;
				}

				if (oParseNode.GetNode(_T("mc:Choice"), oNodeDr))
				{
					oParseNode = oNodeDr;
					continue;
				}

				if (oParseNode.GetNode(_T("w:pict"), oNodeDr))
				{
					strName = _T("pict");
					oParseNode = oNodeDr;
					continue;
				}

				if (oParseNode.GetNode(_T("w:object"), oNodeDr))
				{
					strName = _T("object");
					oParseNode = oNodeDr;
					continue;
				}

				if (oParseNode.GetNode(_T("xdr:sp"), oNodeDr))
				{
					strName = _T("sp");
					oParseNode = oNodeDr;
					continue;
				}

				if (oParseNode.GetNode(_T("mc:Fallback"), oNodeDr))
				{
					oParseNode = oNodeDr;
					continue;
				}				

				break;
			}
			else if (strName == _T("graphicFrame") && strFullName == _T("xdr:graphicFrame"))
			{
				CString __strXml = _T("<drawing><anchor>") + oParseNode.ReadNodeNoNS(_T("graphic")).GetXml() + _T("</anchor></drawing>");
				oParseNode.FromXmlString(__strXml);
				strName = _T("drawing");
				continue;
			}
			else
			{
				PPTX::Logic::SpTreeElem oElem;
				oElem = oParseNode;

				if (oElem.is_init())
				{
					m_oBinaryWriter.WriteRecord1(1, oElem);
				}
				break;
			}
		}
	}

	m_oBinaryWriter.EndRecord();

	if (NULL != ppBinary)
	{
		ULONG lBinarySize = m_oBinaryWriter.GetPosition() - lCurrentPosition;
		SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, lBinarySize);
		
		BYTE* pDataD = (BYTE*)pArray->pvData;
		BYTE* pDataS = m_oBinaryWriter.GetBuffer();
		memcpy(pDataD, pDataS + lCurrentPosition, lBinarySize);

		*ppBinary = pArray;
	}
	
	return true;
}

PPTX::Logic::SpTreeElem CAVSOfficeDrawingConverter::doc_LoadShape(XmlUtils::CXmlNode& oNode, BSTR*& pMainProps, bool bIsTop)
{
	PPTX::Logic::SpTreeElem elem;

	CString strNameNode = oNode.GetName();
	bool bIsNeedCoordSizes = true;

	CString strStyleAdvenced = _T("");

	NSPresentationEditor::CShapeElement oShapeElem;
	CPPTShape* pPPTShape = NULL;
	if (_T("v:rect") == strNameNode)
	{
		pPPTShape = new CPPTShape();
		pPPTShape->SetShapeType((PPTShapes::ShapeType)1);
		pPPTShape->ReCalculate();
	}
	else if (_T("v:roundrect") == strNameNode)
	{
		pPPTShape = new CPPTShape();
		pPPTShape->SetShapeType((PPTShapes::ShapeType)2);
		pPPTShape->ReCalculate();
	}
	else if (_T("v:oval") == strNameNode)
	{
		pPPTShape = new CPPTShape();
		pPPTShape->SetShapeType((PPTShapes::ShapeType)3);
		pPPTShape->ReCalculate();
	}
	else if (_T("v:line") == strNameNode)
	{
		pPPTShape = new CPPTShape();
		pPPTShape->SetShapeType((PPTShapes::ShapeType)20);
		pPPTShape->ReCalculate();

		CString strCoord1 = oNode.GetAttributeOrValue(_T("from"));
		CString strCoord2 = oNode.GetAttributeOrValue(_T("to"));
		if (strCoord1 != _T("") && strCoord2 != _T(""))
		{
			CSimpleArray<CString> oArray1;
			NSStringUtils::ParseString(_T(","), strCoord1, &oArray1);

			CSimpleArray<CString> oArray2;
			NSStringUtils::ParseString(_T(","), strCoord2, &oArray2);

			if (oArray1.GetSize() >= 2 && oArray2.GetSize() >= 2)
			{
				SimpleTypes::CPoint parserPoint;
				double x1 = parserPoint.FromString(oArray1[0]);
				double y1 = parserPoint.FromString(oArray1[1]);
				double x2 = parserPoint.FromString(oArray2[0]);
				double y2 = parserPoint.FromString(oArray2[1]);

				if (x1 > x2)
				{
					double tmp = x1;
					x1 = x2;
					x2 = tmp;
				}
				if (y1 > y2)
				{
					double tmp = y1;
					y1 = y2;
					y2 = tmp;
				}

				strStyleAdvenced.Format(_T(";left:%.2lf;top:%.2lf;width:%.2lf;height:%.2lf;"), x1, y1, x2 - x1, y2 - y1);				
			}
		}
	}
	else if (_T("v:polyline") == strNameNode)
	{
		CString strPoints = oNode.GetAttributeOrValue(_T("points"));
		if (_T("") != strPoints)
		{
			CSimpleArray<CString> oArray;
			NSStringUtils::ParseString(_T(","), strPoints, &oArray);

			int nSize = oArray.GetSize();
			if ((nSize % 2 == 0) && nSize > 3)
			{
				int* _POINTS = new int[nSize];
				double dKoef = 25.4 * 36000 / 72.0;

				for (int k = 0; k < nSize; ++k)
				{
					if (_T("") == oArray[k])
					{
						_POINTS[k] = 0;
					}
					else
					{
						SimpleTypes::CPoint parserPoint;
						_POINTS[k] = (int)(dKoef * parserPoint.FromString(oArray[k]));
					}
				}

				
				int _x = INT_MAX;
				int _y = INT_MAX;
				int _r = INT_MIN;
				int _b = INT_MIN;

				for (int k = 0; k < nSize; k += 2)
				{
					int tmpx = _POINTS[k];
					int tmpy = _POINTS[k + 1];
					if (tmpx < _x)
						_x = tmpx;
					if (tmpx > _r)
						_r = tmpx;
					if (tmpy < _y)
						_y = tmpy;
					if (tmpy > _b)
						_b = tmpy;
				}

				int nOffsetX = _POINTS[0] - _x;
				int nOffsetY = _POINTS[1] - _y;

				strStyleAdvenced.Format(_T(";margin-left:%d;margin-top:%d;width:%d;height:%d;polyline_correct:true;"), _x, _y, _r - _x, _b - _y);

				double dKoefX = 21600.0 / max(_r - _x, 1);
				double dKoefY = 21600.0 / max(_b - _y, 1);
				CString strPath = _T("");
				for (int k = 0; k < nSize; k += 2)
				{
					if (k == 0)
					{
						CString _s = _T("");
						_s.Format(_T("m%d,%d"), (int)(dKoefX * (_POINTS[k] - _x)), (int)(dKoefY * (_POINTS[k + 1] - _y)));
						strPath += _s;
					}
					else
					{
						CString _s = _T("");
						_s.Format(_T("l%d,%d"), (int)(dKoefX * (_POINTS[k] - _x)), (int)(dKoefY * (_POINTS[k + 1] - _y)));
						strPath += _s;
					}					
				}

				strPath += _T("e");

				RELEASEARRAYOBJECTS(_POINTS);

				pPPTShape = new CPPTShape();
				pPPTShape->SetShapeType((PPTShapes::ShapeType)1);
				
				pPPTShape->m_eType = PPTShapes::sptCustom;

				pPPTShape->LoadPathList(strPath);
				pPPTShape->ReCalculate();
				bIsNeedCoordSizes = false;
			}
		}		
	}
	else if (_T("v:shape") == strNameNode)
	{
		CString strType = oNode.GetAttribute(_T("type"));
		if (strType.GetLength() > 2 && strType[0] == (TCHAR)('#'))
		{
			strType = strType.Mid(1);

			CAtlMap<CString, CShape*>::CPair* pPair = m_mapShapeTypes.Lookup(strType);
			if (NULL != pPair)
			{
				pPPTShape = new CPPTShape();
				pPair->m_value->m_pShape->SetToDublicate(pPPTShape);
				pPPTShape->m_eType = ((CPPTShape*)(pPair->m_value->m_pShape))->m_eType;
			}
		}
		
		if (NULL == pPPTShape)
		{
			pPPTShape = new CPPTShape();
			pPPTShape->SetShapeType((PPTShapes::ShapeType)1);
			
			pPPTShape->m_eType = PPTShapes::sptCustom;
		}

		pPPTShape->LoadFromXMLShapeType(oNode);
	}

	if (pPPTShape != NULL)
	{		
		oShapeElem.m_oShape.m_pShape = pPPTShape;

		if (bIsNeedCoordSizes)
			LoadCoordSize(oNode, &oShapeElem.m_oShape);
		else
		{
			oShapeElem.m_oShape.m_dWidthLogic  = 21600;
			oShapeElem.m_oShape.m_dHeightLogic = 21600;

			oShapeElem.m_oShape.m_pShape->m_oPath.SetCoordsize(21600, 21600);			
		}

		CString strXmlPPTX = oShapeElem.ConvertPPTShapeToPPTX(true);

		PPTX::Logic::Shape* pShape = new PPTX::Logic::Shape();
		
		XmlUtils::CXmlNode oNodeG;
		oNodeG.FromXmlString(strXmlPPTX);
		pShape->spPr.Geometry = oNodeG;

		

		XmlUtils::CXmlNode oNodeTextBox;
		if (oNode.GetNode(_T("v:textbox"), oNodeTextBox))
		{
			XmlUtils::CXmlNode oNodeContent;
			if (oNodeTextBox.GetNode(_T("w:txbxContent"), oNodeContent))
			{
				pShape->TextBoxShape = oNodeContent.GetXml();
			}
		}

		CString strStyle = oNode.GetAttribute(_T("style"));
		if (_T("") != strStyleAdvenced)
			strStyle += strStyleAdvenced;

		PPTX::CCSS oCSSParser;
		oCSSParser.LoadFromString2(strStyle);

		CSpTreeElemProps oProps;
		oProps.IsTop = bIsTop;
		CString strMainPos = GetDrawingMainProps(oNode, oCSSParser, oProps);

		if (!pShape->TextBoxBodyPr.is_init())
			pShape->TextBoxBodyPr = new PPTX::Logic::BodyPr();

		
		pShape->TextBoxBodyPr->upright = true;

		CAtlMap<CString, CString>::CPair* pPair = oCSSParser.m_mapSettings.Lookup(_T("v-text-anchor"));
		if (pPair != NULL)
		{
			if (_T("top") == pPair->m_value)
				pShape->TextBoxBodyPr->anchor = _T("t");
			else if (_T("bottom") == pPair->m_value)
				pShape->TextBoxBodyPr->anchor = _T("b");
			else if (_T("middle") == pPair->m_value)
				pShape->TextBoxBodyPr->anchor = _T("ctr");
		}

		if (bIsTop)
		{			
			SendMainProps(strMainPos, pMainProps);

			pShape->spPr.xfrm = new PPTX::Logic::Xfrm();
			pShape->spPr.xfrm->offX = 0;
			pShape->spPr.xfrm->offY = 0;
			pShape->spPr.xfrm->extX = oProps.Width;
			pShape->spPr.xfrm->extY = oProps.Height;

			CAtlMap<CString, CString>::CPair* pPair = NULL;
			pPair = oCSSParser.m_mapSettings.Lookup(_T("flip"));
			if (NULL != pPair)
			{
				if (pPair->m_value == _T("x"))
					pShape->spPr.xfrm->flipH = true;
				else if (pPair->m_value == _T("y"))
					pShape->spPr.xfrm->flipV = true;
				else if ((pPair->m_value == _T("xy")) || (pPair->m_value == _T("yx")) || (pPair->m_value == _T("x y")) || (pPair->m_value == _T("y x")))
				{
					pShape->spPr.xfrm->flipH = true;
					pShape->spPr.xfrm->flipV = true;
				}
			}

			pPair = oCSSParser.m_mapSettings.Lookup(_T("rotation"));
			if (NULL != pPair)
			{
				pShape->spPr.xfrm->rot = NS_DWC_Common::getRotateAngle(pPair->m_value, pShape->spPr.xfrm->flipH, pShape->spPr.xfrm->flipV);
			}
		}
		else
		{
			m_oBinaryWriter.m_lWidthCurShape = 0;
			m_oBinaryWriter.m_lHeightCurShape = 0;

			pShape->spPr.xfrm = new PPTX::Logic::Xfrm();
			pShape->spPr.xfrm->offX = oProps.X;
			pShape->spPr.xfrm->offY = oProps.Y;
			pShape->spPr.xfrm->extX = oProps.Width;
			pShape->spPr.xfrm->extY = oProps.Height;

			CAtlMap<CString, CString>::CPair* pPair = NULL;
			pPair = oCSSParser.m_mapSettings.Lookup(_T("flip"));
			if (NULL != pPair)
			{
				if (pPair->m_value == _T("x"))
					pShape->spPr.xfrm->flipH = true;
				else if (pPair->m_value == _T("y"))
					pShape->spPr.xfrm->flipV = true;
				else if ((pPair->m_value == _T("xy")) || (pPair->m_value == _T("yx")) || (pPair->m_value == _T("x y")) || (pPair->m_value == _T("y x")))
				{
					pShape->spPr.xfrm->flipH = true;
					pShape->spPr.xfrm->flipV = true;
				}
			}

			pPair = oCSSParser.m_mapSettings.Lookup(_T("rotation"));
			if (NULL != pPair)
			{
				pShape->spPr.xfrm->rot = NS_DWC_Common::getRotateAngle(pPair->m_value, pShape->spPr.xfrm->flipH, pShape->spPr.xfrm->flipV);
			}
		}

		if (!bIsTop)
		{
			pShape->nvSpPr.cNvPr.id = m_lNextId;
			m_lNextId++;
		}
		else
		{
			pShape->nvSpPr.cNvPr.id = -1;
		}

		elem.InitElem(pShape);

		CheckPenShape(elem, oNode, pPPTShape->m_eType, pPPTShape);
		CheckBrushShape(elem, oNode, pPPTShape->m_eType, pPPTShape);
	}

	return elem;
}

PPTX::Logic::SpTreeElem CAVSOfficeDrawingConverter::doc_LoadGroup(XmlUtils::CXmlNode& oNode, BSTR*& pMainProps, bool bIsTop)
{
	PPTX::Logic::SpTreeElem elem;

	PPTX::Logic::SpTree* pTree = new PPTX::Logic::SpTree();

	if (bIsTop)
		pTree->m_name = _T("wpg:wgp");
	else
		pTree->m_name = _T("wpg:grpSp");

	XmlUtils::CXmlNodes oNodes;
	if (oNode.GetNodes(_T("*"), oNodes))
	{
		int nCount = oNodes.GetCount();
		for (int i = 0; i < nCount; ++i)
		{
			XmlUtils::CXmlNode oNodeT;
			oNodes.GetAt(i, oNodeT);

			CString strNameP = XmlUtils::GetNameNoNS(oNodeT.GetName());

			if (_T("shape") == strNameP ||
				_T("rect") == strNameP ||
				_T("oval") == strNameP ||
				_T("line") == strNameP ||
				_T("roundrect") == strNameP)
			{
				PPTX::Logic::SpTreeElem _el = doc_LoadShape(oNodeT, pMainProps, false);
				
				if (_el.is_init())
					pTree->SpTreeElems.Add(_el);
			}
			else if (_T("group") == strNameP)
			{
				PPTX::Logic::SpTreeElem _el = doc_LoadGroup(oNodeT, pMainProps, false);

				if (_el.is_init())
					pTree->SpTreeElems.Add(_el);
			}
		}
	}

	CString strStyle = oNode.GetAttribute(_T("style"));

	PPTX::CCSS oCSSParser;
	oCSSParser.LoadFromString2(strStyle);

	CSpTreeElemProps oProps;
	oProps.IsTop = bIsTop;
	CString strMainPos = GetDrawingMainProps(oNode, oCSSParser, oProps);

	LONG lCoordOriginX = 0;
	LONG lCoordOriginY = 0;
	LONG lCoordSizeW = oProps.Width;
	LONG lCoordSizeH = oProps.Height;
	
	CString strCoordSize = oNode.GetAttributeOrValue(_T("coordsize"));
	if (strCoordSize != _T(""))
	{
		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T(","), strCoordSize, &oArray);

		if (oArray.GetSize() >= 2)
		{
			lCoordSizeW = XmlUtils::GetInteger(oArray[0]);
			lCoordSizeH = XmlUtils::GetInteger(oArray[1]);
		}
	}

	CString strCoordOrigin = oNode.GetAttributeOrValue(_T("coordorigin"));
	if (strCoordOrigin != _T(""))
	{
		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T(","), strCoordOrigin, &oArray);

		if (oArray.GetSize() >= 2)
		{
			lCoordOriginX = XmlUtils::GetInteger(oArray[0]);
			lCoordOriginY = XmlUtils::GetInteger(oArray[1]);
		}
	}

	if (bIsTop)
	{
		SendMainProps(strMainPos, pMainProps);

		pTree->grpSpPr.xfrm = new PPTX::Logic::Xfrm();
		pTree->grpSpPr.xfrm->offX = 0;
		pTree->grpSpPr.xfrm->offY = 0;
		pTree->grpSpPr.xfrm->extX = oProps.Width;
		pTree->grpSpPr.xfrm->extY = oProps.Height;

		pTree->grpSpPr.xfrm->chOffX = lCoordOriginX;
		pTree->grpSpPr.xfrm->chOffY = lCoordOriginY;
		pTree->grpSpPr.xfrm->chExtX = lCoordSizeW;
		pTree->grpSpPr.xfrm->chExtY = lCoordSizeH;

		CAtlMap<CString, CString>::CPair* pPair = NULL;
		pPair = oCSSParser.m_mapSettings.Lookup(_T("flip"));
		if (NULL != pPair)
		{
			if (pPair->m_value == _T("x"))
				pTree->grpSpPr.xfrm->flipH = true;
			else if (pPair->m_value == _T("y"))
				pTree->grpSpPr.xfrm->flipV = true;
			else if ((pPair->m_value == _T("xy")) || (pPair->m_value == _T("yx")) || (pPair->m_value == _T("x y")) || (pPair->m_value == _T("y x")))
			{
				pTree->grpSpPr.xfrm->flipH = true;
				pTree->grpSpPr.xfrm->flipV = true;
			}
		}

		pPair = oCSSParser.m_mapSettings.Lookup(_T("rotation"));
		if (NULL != pPair)
		{
			pTree->grpSpPr.xfrm->rot = NS_DWC_Common::getRotateAngle(pPair->m_value, pTree->grpSpPr.xfrm->flipH, pTree->grpSpPr.xfrm->flipV);
		}
	}
	else
	{
		pTree->grpSpPr.xfrm = new PPTX::Logic::Xfrm();
		pTree->grpSpPr.xfrm->offX = oProps.X;
		pTree->grpSpPr.xfrm->offY = oProps.Y;
		pTree->grpSpPr.xfrm->extX = oProps.Width;
		pTree->grpSpPr.xfrm->extY = oProps.Height;

		pTree->grpSpPr.xfrm->chOffX = lCoordOriginX;
		pTree->grpSpPr.xfrm->chOffY = lCoordOriginY;
		pTree->grpSpPr.xfrm->chExtX = lCoordSizeW;
		pTree->grpSpPr.xfrm->chExtY = lCoordSizeH;

		CAtlMap<CString, CString>::CPair* pPair = NULL;
		pPair = oCSSParser.m_mapSettings.Lookup(_T("flip"));
		if (NULL != pPair)
		{
			if (pPair->m_value == _T("x"))
				pTree->grpSpPr.xfrm->flipH = true;
			else if (pPair->m_value == _T("y"))
				pTree->grpSpPr.xfrm->flipV = true;
			else if ((pPair->m_value == _T("xy")) || (pPair->m_value == _T("yx")) || (pPair->m_value == _T("x y")) || (pPair->m_value == _T("y x")))
			{
				pTree->grpSpPr.xfrm->flipH = true;
				pTree->grpSpPr.xfrm->flipV = true;
			}
		}

		pPair = oCSSParser.m_mapSettings.Lookup(_T("rotation"));
		if (NULL != pPair)
		{
			pTree->grpSpPr.xfrm->rot = NS_DWC_Common::getRotateAngle(pPair->m_value, pTree->grpSpPr.xfrm->flipH, pTree->grpSpPr.xfrm->flipV);			
		}
	}

	if (!bIsTop)
	{
		pTree->nvGrpSpPr.cNvPr.id = m_lNextId;
		m_lNextId++;
	}
	else
	{
		pTree->nvGrpSpPr.cNvPr.id = -1;
	}
	
	elem.InitElem(pTree);
	return elem;
}

void CAVSOfficeDrawingConverter::LoadCoordSize(XmlUtils::CXmlNode& oNode, CShape* pShape)
{
	pShape->m_dWidthLogic = ShapeSizeVML;
	pShape->m_dHeightLogic = ShapeSizeVML;
	XmlUtils::CXmlNode oNodeTemplate;
	if (oNode.GetNode(_T("coordsize"), oNodeTemplate))
	{
		CString strCoordSize = oNodeTemplate.GetAttributeOrValue(_T("val"));
		if (strCoordSize != _T(""))
		{
			CSimpleArray<CString> oArray;
			NSStringUtils::ParseString(_T(","), strCoordSize, &oArray);

			if (oArray.GetSize() >= 2)
			{
				pShape->m_dWidthLogic  = max(XmlUtils::GetInteger(oArray[0]), 1);
				pShape->m_dHeightLogic = max(XmlUtils::GetInteger(oArray[1]), 1);
			}
		}
	}
	else
	{
		CString strCoordSize = oNode.GetAttributeOrValue(_T("coordsize"));
		if (strCoordSize != _T(""))
		{
			CSimpleArray<CString> oArray;
			NSStringUtils::ParseString(_T(","), strCoordSize, &oArray);

			if (oArray.GetSize() >= 2)
			{
				pShape->m_dWidthLogic  = max(XmlUtils::GetInteger(oArray[0]), 1);
				pShape->m_dHeightLogic = max(XmlUtils::GetInteger(oArray[1]), 1);
			}
		}
	}

	pShape->m_pShape->m_oPath.SetCoordsize((LONG)pShape->m_dWidthLogic, (LONG)pShape->m_dHeightLogic);
}

CString CAVSOfficeDrawingConverter::GetDrawingMainProps(XmlUtils::CXmlNode& oNode, PPTX::CCSS& oCssStyles, CSpTreeElemProps& oProps)
{
	CAtlMap<CString, CString>::CPair* pPair = NULL;

	bool bIsInline = false;

	if ((NULL == oCssStyles.m_mapSettings.Lookup(_T("left"))) && (NULL == oCssStyles.m_mapSettings.Lookup(_T("margin-left"))) &&
		(NULL == oCssStyles.m_mapSettings.Lookup(_T("top"))) && (NULL == oCssStyles.m_mapSettings.Lookup(_T("margin-top"))))
	{
		bIsInline = true;
	}

	if (!bIsInline)
	{
		pPair = oCssStyles.m_mapSettings.Lookup(_T("position"));
		if (NULL != pPair && pPair->m_value == _T("static"))
		{
			bIsInline = true;
		}
	}

	SimpleTypes::CPoint parserPoint;
	double dKoef = 25.4 * 36000 / 72.0;
	double dKoefSize = oProps.IsTop ? dKoef : 1;

	LONG left	= 0;
	LONG top	= 0;
	LONG width	= 0;
	LONG height = 0;

	pPair = oCssStyles.m_mapSettings.Lookup(_T("polyline_correct"));
	bool bIsPolyCorrect = (NULL != pPair) ? true : false;
	if (bIsPolyCorrect)
		dKoefSize = 1;

	if (!bIsInline)
	{
		pPair = oCssStyles.m_mapSettings.Lookup(_T("margin-left"));
		if (NULL == pPair)
			pPair = oCssStyles.m_mapSettings.Lookup(_T("left"));

		if (NULL != pPair)
		{
			 left = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value));
		}

		pPair = oCssStyles.m_mapSettings.Lookup(_T("margin-top"));
		if (NULL == pPair)
			pPair = oCssStyles.m_mapSettings.Lookup(_T("top"));

		if (NULL != pPair)
		{
			 top = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value));
		}
	}

	pPair = oCssStyles.m_mapSettings.Lookup(_T("width"));
	if (NULL != pPair)
	{
		width = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value));
	}
	else
	{
		pPair = oCssStyles.m_mapSettings.Lookup(_T("margin-right"));
		if (NULL != NULL)
			width = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value)) - left;
	}

	pPair = oCssStyles.m_mapSettings.Lookup(_T("height"));
	if (NULL != pPair)
	{
		height = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value));
	}
	else
	{
		pPair = oCssStyles.m_mapSettings.Lookup(_T("margin-bottom"));
		if (NULL != NULL)
			height = (LONG)(dKoefSize * parserPoint.FromString(pPair->m_value)) - top;
	}

	LONG margL = (LONG)(9 * dKoef);
	LONG margT = 0;
	LONG margR = (LONG)(9 * dKoef);
	LONG margB = 0;

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-wrap-distance-left"));
	if (NULL != pPair)
		margL = (LONG)(dKoef * parserPoint.FromString(pPair->m_value));

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-wrap-distance-top"));
	if (NULL != pPair)
		margT = (LONG)(dKoef * parserPoint.FromString(pPair->m_value));

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-wrap-distance-right"));
	if (NULL != pPair)
		margR = (LONG)(dKoef * parserPoint.FromString(pPair->m_value));

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-wrap-distance-bottom"));
	if (NULL != pPair)
		margB = (LONG)(dKoef * parserPoint.FromString(pPair->m_value));

	oProps.X = left;
	oProps.Y = top;
	oProps.Width = width;
	oProps.Height = height;

	m_oBinaryWriter.m_lWidthCurShape = width;
	m_oBinaryWriter.m_lHeightCurShape = height;

	if (bIsInline)
	{
		NSBinPptxRW::CXmlWriter oWriter;
		oWriter.StartNode(_T("wp:inline"));

		oWriter.StartAttributes();
		oWriter.WriteAttribute(_T("xmlns:wp"), (CString)_T("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"));
		oWriter.WriteAttribute(_T("distT"), margT);
		oWriter.WriteAttribute(_T("distB"), margB);
		oWriter.WriteAttribute(_T("distL"), margL);
		oWriter.WriteAttribute(_T("distR"), margR);
		oWriter.EndAttributes();

		oWriter.StartNode(_T("wp:extent"));
		oWriter.StartAttributes();
		oWriter.WriteAttribute(_T("cx"), width);
		oWriter.WriteAttribute(_T("cy"), height);
		oWriter.EndAttributes();
		oWriter.EndNode(_T("wp:extent"));

		CString strId = _T("");
		strId.Format(_T("<wp:docPr id=\"%d\" name=\"\"/>"), m_lNextId);
		m_lNextId++;

		oWriter.WriteString(strId);

		oWriter.EndNode(_T("wp:inline"));

		return oWriter.GetXmlString();
	}

	NSBinPptxRW::CXmlWriter oWriter;
	oWriter.StartNode(_T("wp:anchor"));

	oWriter.StartAttributes();

	oWriter.WriteAttribute(_T("xmlns:wp"), (CString)_T("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"));
	oWriter.WriteAttribute(_T("distT"), margT);
	oWriter.WriteAttribute(_T("distB"), margB);
	oWriter.WriteAttribute(_T("distL"), margL);
	oWriter.WriteAttribute(_T("distR"), margR);

	pPair = oCssStyles.m_mapSettings.Lookup(_T("z-index"));
	nullable_int zIndex;
	if (NULL != pPair)
	{
		zIndex = (int)parserPoint.FromString(pPair->m_value);

		if (*zIndex >= 0)
		{
			oWriter.WriteAttribute(_T("relativeHeight"), *zIndex);
		}
		else
		{
			DWORD dwIndex = (DWORD)(*zIndex);
			oWriter.WriteAttribute(_T("relativeHeight"), dwIndex);
		}		
	}

	XmlUtils::CXmlNode oNodeWrap = oNode.ReadNode(_T("w10:wrap"));
	CString strWType = _T("");
	if (oNodeWrap.IsValid())
	{
		strWType = oNodeWrap.GetAttribute(_T("type"));

		
	}

	CString strWrapPoints = oNode.GetAttribute(_T("wrapcoords"));
	CString strWrapPointsResult = _T("");
	if (_T("") != strWrapPoints)
	{
		CSimpleArray<CString> arPoints;
		NSStringUtils::ParseString(_T(" "), strWrapPoints, &arPoints);

		int nCountP = arPoints.GetSize();
		if (nCountP > 1 && ((nCountP % 2) == 0))
		{
			strWrapPointsResult = _T("<wp:wrapPolygon edited=\"1\">");

			for (int i = 0; i < nCountP; i += 2)
			{
				if (i == 0)
				{
					strWrapPoints += (_T("<wp:start x=\"") + arPoints[i] + _T("\" y=\"") + arPoints[i + 1] + _T("\"/>"));
				}
				else
				{
					strWrapPoints += (_T("<wp:lineTo x=\"") + arPoints[i] + _T("\" y=\"") + arPoints[i + 1] + _T("\"/>"));
				}
			}

			strWrapPointsResult = _T("</wp:wrapPolygon>");
		}
	}

	if ((!oNodeWrap.IsValid() || strWType == _T("")) && zIndex.is_init())
	{
		if (*zIndex > 0)
		{
			oWriter.WriteAttribute(_T("allowOverlap"), (CString)_T("1"));
		}
		else if (*zIndex < 0)
		{
			oWriter.WriteAttribute(_T("behindDoc"), (CString)_T("1"));
		}
	}

	oWriter.EndAttributes();

	oWriter.StartNode(_T("wp:positionH"));

	oWriter.StartAttributes();

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-position-horizontal-relative"));
	if (pPair != NULL)
	{
		if (_T("char") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("character"));
		else if (_T("page") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("page"));
		else if (_T("margin") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("margin"));
		else if (_T("left-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("leftMargin"));
		else if (_T("right-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("rightMargin"));
		else if (_T("inner-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("insideMargin"));
		else if (_T("outer-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("outsideMargin"));
		else
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("column"));
	}
	else
	{
		oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("column"));
	}

	oWriter.EndAttributes();

	CString strPosH = _T("absolute");
	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-position-horizontal"));
	if (NULL != pPair)
		strPosH = pPair->m_value;

	if (strPosH == _T("absolute"))
	{
		oWriter.WriteString(_T("<wp:posOffset>"));
		oWriter.WriteLONG(left);
		oWriter.WriteString(_T("</wp:posOffset>"));		
	}
	else
	{
		oWriter.WriteString(_T("<wp:align>"));
		oWriter.WriteString(strPosH);
		oWriter.WriteString(_T("</wp:align>"));		
	}

	oWriter.EndNode(_T("wp:positionH"));

	oWriter.StartNode(_T("wp:positionV"));

	oWriter.StartAttributes();

	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-position-vertical-relative"));
	if (pPair != NULL)
	{
		if (_T("margin") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("margin"));
		else if (_T("text") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("paragraph"));
		else if (_T("page") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("page"));
		else if (_T("top-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("topMargin"));
		else if (_T("bottom-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("bottomMargin"));
		else if (_T("inner-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("insideMargin"));
		else if (_T("outer-margin-area") == pPair->m_value)
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("outsideMargin"));
		else
			oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("line"));
	}
	else
	{
		oWriter.WriteAttribute(_T("relativeFrom"), (CString)_T("paragraph"));
	}

	oWriter.EndAttributes();

	CString strPosV = _T("absolute");
	pPair = oCssStyles.m_mapSettings.Lookup(_T("mso-position-vertical"));
	if (NULL != pPair)
		strPosV = pPair->m_value;

	if (strPosV == _T("absolute"))
	{
		oWriter.WriteString(_T("<wp:posOffset>"));
		oWriter.WriteLONG(top);
		oWriter.WriteString(_T("</wp:posOffset>"));		
	}
	else
	{
		oWriter.WriteString(_T("<wp:align>"));
		oWriter.WriteString(strPosV);
		oWriter.WriteString(_T("</wp:align>"));
	}

	oWriter.EndNode(_T("wp:positionV"));

	oWriter.StartNode(_T("wp:extent"));
	oWriter.StartAttributes();
	oWriter.WriteAttribute(_T("cx"), width);
	oWriter.WriteAttribute(_T("cy"), height);
	oWriter.EndAttributes();
	oWriter.EndNode(_T("wp:extent"));

	if (oNodeWrap.IsValid())
	{		
		if (strWType == _T("none") || strWType == _T(""))
			oWriter.WriteString(_T("<wp:wrapNone/>"));
		else if (strWType == _T("square"))
			oWriter.WriteString(_T("<wp:wrapSquare wrapText=\"bothSides\"/>"));
		else if (strWType == _T("topAndBottom"))
			oWriter.WriteString(_T("<wp:wrapTopAndBottom/>"));
		else if (strWType == _T("tight"))
		{
			if (_T("") == strWrapPointsResult)
			{
				oWriter.WriteString(_T("<wp:wrapTight wrapText=\"bothSides\"/>"));
			}
			else
			{
				oWriter.WriteString(_T("<wp:wrapTight wrapText=\"bothSides\">"));
				oWriter.WriteString(strWrapPointsResult);
				oWriter.WriteString(_T("</wp:wrapTight>"));
			}			
		}
		else if (strWType == _T("through"))
		{
			if (_T("") == strWrapPointsResult)
			{
				oWriter.WriteString(_T("<wp:wrapThrough wrapText=\"bothSides\"/>"));
			}
			else
			{
				oWriter.WriteString(_T("<wp:wrapThrough wrapText=\"bothSides\">"));
				oWriter.WriteString(strWrapPointsResult);
				oWriter.WriteString(_T("</wp:wrapThrough>"));
			}						
		}		
		else 
			oWriter.WriteString(_T("<wp:wrapSquare wrapText=\"bothSides\"/>"));
	}	
	else
	{
		

		oWriter.WriteString(_T("<wp:wrapNone/>"));
	}	

	CString strId = _T("");
	strId.Format(_T("<wp:docPr id=\"%d\" name=\"\"/>"), m_lNextId);
	m_lNextId++;

	oWriter.WriteString(strId);

	oWriter.EndNode(_T("wp:anchor"));
	
	return oWriter.GetXmlString();
}


CString CAVSOfficeDrawingConverter::GetVMLShapeXml(PPTX::Logic::SpTreeElem& oElem)
{
	

	CPPTXShape* pShapePPTX = NULL;
	if (oElem.is<PPTX::Logic::Shape>())
	{
		const PPTX::Logic::Shape& lpOriginShape = oElem.as<PPTX::Logic::Shape>();

		if (lpOriginShape.spPr.Geometry.is<PPTX::Logic::PrstGeom>())
		{
			const PPTX::Logic::PrstGeom lpGeom = lpOriginShape.spPr.Geometry.as<PPTX::Logic::PrstGeom>();

			OOXMLShapes::ShapeType _lspt = PPTX2EditorAdvanced::GetShapeTypeFromStr(lpGeom.prst.get());
			if(_lspt != OOXMLShapes::sptNil) 
			{
				pShapePPTX = new CPPTXShape();
				pShapePPTX->SetType(NSBaseShape::pptx, _lspt);

				CString strAdjustValues = lpGeom.GetODString();
				pShapePPTX->LoadAdjustValuesList(strAdjustValues);
			}
		}
		else if(lpOriginShape.spPr.Geometry.is<PPTX::Logic::CustGeom>())
		{
			const PPTX::Logic::CustGeom lpGeom = lpOriginShape.spPr.Geometry.as<PPTX::Logic::CustGeom>();
			CString strShape = lpGeom.GetODString();
			pShapePPTX = new CPPTXShape();
			pShapePPTX->LoadFromXML(strShape);
		}
		else
		{
			pShapePPTX = new CPPTXShape();
			pShapePPTX->SetType(NSBaseShape::pptx, (int)OOXMLShapes::sptCRect);
		}								
	}

	if (NULL != pShapePPTX)
	{
		NSGuidesVML::CConverterPPTXPPT oConverterPPTX_2_PPT;
		oConverterPPTX_2_PPT.Convert(pShapePPTX);

		CString sDumpXml = GetVMLShapeXml(oConverterPPTX_2_PPT.GetConvertedShape());

		CFile oFile;
		oFile.CreateFile(_T("C:\\PPTMemory\\vml_output.xml"));
		oFile.WriteStringUTF8(sDumpXml);
		oFile.CloseFile();
		
		return sDumpXml;
	}

	return _T("");
}

CString CAVSOfficeDrawingConverter::GetVMLShapeXml(CPPTShape* pPPTShape)
{
	NSBinPptxRW::CXmlWriter oXmlWriter;
	oXmlWriter.StartNode(_T("v:shape"));
	oXmlWriter.StartAttributes();

	CString strCoordSize = _T("");
	LONG lCoordW = 21600;
	LONG lCoordH = 21600;
	if (0 < pPPTShape->m_oPath.m_arParts.GetSize())
	{
		lCoordW = pPPTShape->m_oPath.m_arParts[0].width;
		lCoordH = pPPTShape->m_oPath.m_arParts[0].height;
	}
	strCoordSize.Format(_T("%d,%d"), lCoordW, lCoordH);
	oXmlWriter.WriteAttribute(_T("coordsize"), strCoordSize);

	int nAdjCount = pPPTShape->m_arAdjustments.GetSize();
	if (nAdjCount > 0)
	{
		oXmlWriter.WriteString(_T(" adj=\""));

		for (int i = 0; i < nAdjCount; ++i)
		{
			if (0 != i)
			{
				CString s = _T("");
				s.Format(_T(",%d"), pPPTShape->m_arAdjustments[i]);
				oXmlWriter.WriteString(s);
			}
			else
			{
				CString s = _T("");
				s.Format(_T("%d"), pPPTShape->m_arAdjustments[i]);
				oXmlWriter.WriteString(s);
			}
		}

		oXmlWriter.WriteString(_T("\""));
	}

	oXmlWriter.WriteAttribute(_T("path"), pPPTShape->m_strPath);
	oXmlWriter.EndAttributes();

	CSimpleArray<CFormula>& arGuides = pPPTShape->m_oManager.m_arFormulas;
	int nGuides = arGuides.GetSize();
	if (nGuides != 0)
	{
		oXmlWriter.StartNode(_T("v:formulas"));
		oXmlWriter.StartAttributes();
		oXmlWriter.EndAttributes();

		for (int i = 0; i < nGuides; ++i)
		{
			CFormula& oGuide = arGuides[i];
			if ((int)oGuide.m_eFormulaType >= VML_GUIDE_COUNT)
				break;

			oXmlWriter.WriteString(_T("<v:f eqn=\""));
			
			oXmlWriter.WriteString((CString)VML_GUIDE_TYPE[(int)oGuide.m_eFormulaType]);
			
			BYTE nParams = VML_GUIDE_PARAM_COUNT[(int)oGuide.m_eFormulaType];
			if (nParams > 0)
			{
				CString str = _T("");
				if (oGuide.m_eType1 == ptAdjust)
				{
					str.Format(_T(" #%d"), oGuide.m_lParam1);
				}
				else if (oGuide.m_eType1 == ptFormula)
				{
					str.Format(_T(" @%d"), oGuide.m_lParam1);
				}
				else
				{
					str.Format(_T(" %d"), oGuide.m_lParam1);
				}
				oXmlWriter.WriteString(str);
			}
			if (nParams > 1)
			{
				CString str = _T("");
				if (oGuide.m_eType2 == ptAdjust)
				{
					str.Format(_T(" #%d"), oGuide.m_lParam2);
				}
				else if (oGuide.m_eType2 == ptFormula)
				{
					str.Format(_T(" @%d"), oGuide.m_lParam2);
				}
				else
				{
					str.Format(_T(" %d"), oGuide.m_lParam2);
				}
				oXmlWriter.WriteString(str);
			}
			if (nParams > 2)
			{
				CString str = _T("");
				if (oGuide.m_eType3 == ptAdjust)
				{
					str.Format(_T(" #%d"), oGuide.m_lParam3);
				}
				else if (oGuide.m_eType3 == ptFormula)
				{
					str.Format(_T(" @%d"), oGuide.m_lParam3);
				}
				else
				{
					str.Format(_T(" %d"), oGuide.m_lParam3);
				}
				oXmlWriter.WriteString(str);
			}

			oXmlWriter.WriteString(_T("\"/>"));
		}

		oXmlWriter.EndNode(_T("v:formulas"));

		size_t nTextRectCount = pPPTShape->m_arStringTextRects.GetCount();
		if (0 < nTextRectCount)
		{
			oXmlWriter.WriteString(_T("<v:path textboxrect=\""));

			for (size_t i = 0; i < nTextRectCount; ++i)
			{
				if (0 != i)
					oXmlWriter.WriteString(_T(","));

				oXmlWriter.WriteString(pPPTShape->m_arStringTextRects[i]);
			}

			oXmlWriter.WriteString(_T("\"/>"));
		}

		int nHandles = pPPTShape->m_arHandles.GetSize();
		if (0 < nHandles)
		{
			oXmlWriter.StartNode(_T("v:handles"));
			oXmlWriter.StartAttributes();
			oXmlWriter.EndAttributes();

			for (int i = 0; i < nHandles; ++i)
			{
				oXmlWriter.StartNode(_T("v:h"));
				
				CHandle_& oH = pPPTShape->m_arHandles[i];

				if (oH.position != _T(""))
					oXmlWriter.WriteAttribute(_T("position"), oH.position);

				if (oH.xrange != _T(""))
					oXmlWriter.WriteAttribute(_T("xrange"), oH.xrange);

				if (oH.yrange != _T(""))
					oXmlWriter.WriteAttribute(_T("yrange"), oH.yrange);

				if (oH.polar != _T(""))
					oXmlWriter.WriteAttribute(_T("polar"), oH.polar);

				if (oH.radiusrange != _T(""))
					oXmlWriter.WriteAttribute(_T("radiusrange"), oH.radiusrange);

				if (oH.switchHandle != _T(""))
					oXmlWriter.WriteAttribute(_T("switch"), oH.switchHandle);

				oXmlWriter.WriteString(_T("/>"));
			}

			oXmlWriter.EndNode(_T("v:handles"));
		}
	}

	oXmlWriter.EndNode(_T("v:shape"));
	return oXmlWriter.GetXmlString();
}

void CAVSOfficeDrawingConverter::SendMainProps(CString& strMainProps, BSTR*& pMainProps)
{
	*pMainProps = strMainProps.AllocSysString();
}

void CAVSOfficeDrawingConverter::CheckBrushShape(PPTX::Logic::SpTreeElem& oElem, XmlUtils::CXmlNode& oNode, PPTShapes::ShapeType eType, CPPTShape* pPPTShape)
{
	PPTX::Logic::Shape* pShape = (PPTX::Logic::Shape*)dynamic_cast<PPTX::Logic::Shape*>(oElem.GetElem().operator ->());

	nullable_string sFillColor;
	oNode.ReadAttributeBase(L"fillcolor", sFillColor);
	if (sFillColor.is_init())
	{
		NSPresentationEditor::CColor color = NS_DWC_Common::getColorFromString(*sFillColor);

		PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
		pSolid->m_namespace = _T("a");
		pSolid->Color.Color = new PPTX::Logic::SrgbClr();
		pSolid->Color.Color->SetRGB(color.R, color.G, color.B);

		pShape->spPr.Fill.Fill = pSolid;		
	}

	nullable_string sFilled;
	oNode.ReadAttributeBase(L"filled", sFilled);
	if (sFilled.is_init())
	{
		if (*sFilled == _T("false") || *sFilled == _T("f"))
		{
			PPTX::Logic::NoFill* pNoFill = new PPTX::Logic::NoFill();
			pNoFill->m_namespace = _T("a");
			pShape->spPr.Fill.Fill = pNoFill;
		}
	}
	else if (!pPPTShape->m_bIsFilled)
	{
		PPTX::Logic::NoFill* pNoFill = new PPTX::Logic::NoFill();
		pNoFill->m_namespace = _T("a");
		pShape->spPr.Fill.Fill = pNoFill;
	}

	nullable_string sOpacity;
	oNode.ReadAttributeBase(_T("opacity"), sOpacity);
	if (sOpacity.is_init())
	{
		BYTE lAlpha = NS_DWC_Common::getOpacityFromString(*sOpacity);

		if (pShape->spPr.Fill.is<PPTX::Logic::SolidFill>())
		{
			PPTX::Logic::ColorModifier oMod;
			oMod.name = _T("alpha");
			int nA = (int)(lAlpha * 100000.0 / 255.0);
			oMod.val = nA;
			pShape->spPr.Fill.as<PPTX::Logic::SolidFill>().Color.Color->Modifiers.Add(oMod);
		}
	}

	XmlUtils::CXmlNode oNodeFill = oNode.ReadNode(_T("v:fill"));
	if (oNodeFill.IsValid())
	{
		nullable_string sType;
		oNodeFill.ReadAttributeBase(L"type", sType);

		sOpacity.reset();
		oNodeFill.ReadAttributeBase(_T("opacity"), sOpacity);

		sFillColor.reset();
		oNodeFill.ReadAttributeBase(L"color", sFillColor);
		if (sFillColor.is_init())
		{
			NSPresentationEditor::CColor color = NS_DWC_Common::getColorFromString(*sFillColor);

			PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
			pSolid->m_namespace = _T("a");
			pSolid->Color.Color = new PPTX::Logic::SrgbClr();
			pSolid->Color.Color->SetRGB(color.R, color.G, color.B);

			pShape->spPr.Fill.Fill = pSolid;
		}

		nullable_string sRid;
		oNodeFill.ReadAttributeBase(L"r:id", sRid);
		if (sRid.is_init())
		{			
			PPTX::Logic::BlipFill* pBlipFill = new PPTX::Logic::BlipFill();
			pBlipFill->m_namespace = _T("a");
			pBlipFill->blip = new PPTX::Logic::Blip();
			pBlipFill->blip->embed = *sRid;

			if (sType.is_init() && ((*sType == _T("tile")) || (*sType == _T("pattern"))))
			{
				pBlipFill->tile = new PPTX::Logic::Tile();				
			}

			pShape->spPr.Fill.Fill = pBlipFill;
		}		

		if (sType.is_init() && (*sType == _T("gradient") || *sType == _T("gradientradial")))
		{
			
		}	

		if (sOpacity.is_init())
		{
			BYTE lAlpha = NS_DWC_Common::getOpacityFromString(*sOpacity);

			if (pShape->spPr.Fill.is<PPTX::Logic::SolidFill>())
			{
				PPTX::Logic::ColorModifier oMod;
				oMod.name = _T("alpha");
				int nA = (int)(lAlpha * 100000.0 / 255.0);
				oMod.val = nA;
				pShape->spPr.Fill.as<PPTX::Logic::SolidFill>().Color.Color->Modifiers.Add(oMod);
			}
			else if (pShape->spPr.Fill.is<PPTX::Logic::BlipFill>())
			{
				PPTX::Logic::AlphaModFix* pAlphaMod = new PPTX::Logic::AlphaModFix();
				int nA = (int)(lAlpha * 100000.0 / 255.0);
				pAlphaMod->amt = nA;

				PPTX::Logic::UniEffect oEff;
				oEff.InitPointer(pAlphaMod);

				pShape->spPr.Fill.as<PPTX::Logic::BlipFill>().blip->Effects.Add(oEff);
			}
		}
	}
	if (true)
	{
		XmlUtils::CXmlNode oNodeFillID = oNode.ReadNode(_T("v:imagedata"));

		if (oNodeFillID.IsValid())
		{
			nullable_string sRid;
			oNodeFillID.ReadAttributeBase(L"r:id", sRid);
			if (sRid.is_init())
			{			
				nullable_string sType;
				oNodeFillID.ReadAttributeBase(L"type", sType);

				PPTX::Logic::BlipFill* pBlipFill = new PPTX::Logic::BlipFill();
				pBlipFill->m_namespace = _T("a");
				pBlipFill->blip = new PPTX::Logic::Blip();
				pBlipFill->blip->embed = *sRid;

				if (sType.is_init() && *sType == _T("tile"))
				{
					pBlipFill->tile = new PPTX::Logic::Tile();				
				}

				pShape->spPr.Fill.Fill = pBlipFill;

				CString strCropT = oNodeFillID.GetAttribute(_T("croptop"));
				CString strCropL = oNodeFillID.GetAttribute(_T("cropleft"));
				CString strCropR = oNodeFillID.GetAttribute(_T("cropright"));
				CString strCropB = oNodeFillID.GetAttribute(_T("cropbottom"));

				NS_DWC_Common::CorrentCropString(strCropL);
				NS_DWC_Common::CorrentCropString(strCropT);
				NS_DWC_Common::CorrentCropString(strCropR);
				NS_DWC_Common::CorrentCropString(strCropB);

				if (_T("") != strCropL || _T("") != strCropT || _T("") != strCropR || _T("") != strCropB)
				{
					pBlipFill->srcRect = new PPTX::Logic::Rect();

					CString str0 = _T("0");
					if (_T("") != strCropL)
						pBlipFill->srcRect->l = strCropL;
					else
						pBlipFill->srcRect->l = str0;

					if (_T("") != strCropT)
						pBlipFill->srcRect->t = strCropT;
					else
						pBlipFill->srcRect->t = str0;

					if (_T("") != strCropR)
						pBlipFill->srcRect->r = strCropR;
					else
						pBlipFill->srcRect->r = str0;

					if (_T("") != strCropB)
						pBlipFill->srcRect->b = strCropB;
					else
						pBlipFill->srcRect->b = str0;
				}
			}
		}
	}

	
	if (!pShape->spPr.Fill.Fill.is_init())
	{
		PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
		pSolid->m_namespace = _T("a");
		pSolid->Color.Color = new PPTX::Logic::SrgbClr();
		pSolid->Color.Color->SetRGB(0xFF, 0xFF, 0xFF);
		pShape->spPr.Fill.Fill = pSolid;

		if (sOpacity.is_init())
		{
			BYTE lAlpha = NS_DWC_Common::getOpacityFromString(*sOpacity);
			PPTX::Logic::ColorModifier oMod;
			oMod.name = _T("alpha");
			int nA = (int)(lAlpha * 100000.0 / 255.0);
			oMod.val = nA;
			pSolid->Color.Color->Modifiers.Add(oMod);
		}
	}
}
void CAVSOfficeDrawingConverter::CheckPenShape(PPTX::Logic::SpTreeElem& oElem, XmlUtils::CXmlNode& oNode, PPTShapes::ShapeType eType, CPPTShape* pPPTShape)
{
	PPTX::Logic::Shape* pShape = (PPTX::Logic::Shape*)dynamic_cast<PPTX::Logic::Shape*>(oElem.GetElem().operator ->());

	
	nullable_string sStrokeColor;
	oNode.ReadAttributeBase(L"strokecolor", sStrokeColor);
	if (sStrokeColor.is_init())
	{
		NSPresentationEditor::CColor color = NS_DWC_Common::getColorFromString(*sStrokeColor);

		if (!pShape->spPr.ln.is_init())
			pShape->spPr.ln = new PPTX::Logic::Ln();

		PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
		pSolid->m_namespace = _T("a");
		pSolid->Color.Color = new PPTX::Logic::SrgbClr();
		pSolid->Color.Color->SetRGB(color.R, color.G, color.B);
		pShape->spPr.ln->Fill.Fill = pSolid;
	}

	nullable_string sStroked;
	oNode.ReadAttributeBase(L"stroked", sStroked);
	if (sStroked.is_init())
	{
		if (*sStroked == _T("false") || *sStroked == _T("f"))
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			pShape->spPr.ln->Fill.Fill = new PPTX::Logic::NoFill();
		}
	}
	else if (!pPPTShape->m_bIsStroked)
	{
		if (!pShape->spPr.ln.is_init())
			pShape->spPr.ln = new PPTX::Logic::Ln();

		pShape->spPr.ln->Fill.Fill = new PPTX::Logic::NoFill();
	}

	nullable_string sStrokeWeight;
	oNode.ReadAttributeBase(L"strokeweight", sStrokeWeight);
	if (sStrokeWeight.is_init())
	{
		if (!pShape->spPr.ln.is_init())
			pShape->spPr.ln = new PPTX::Logic::Ln();

		if (sStrokeWeight->GetLength() > 0 && sStrokeWeight->GetAt(0) == TCHAR('.'))
		{
			sStrokeWeight = (_T("0") + *sStrokeWeight);
		}

		SimpleTypes::CPoint oPoint;
		int size = (int)(g_emu_koef * oPoint.FromString(*sStrokeWeight));		

		pShape->spPr.ln->w = size;
	}

	XmlUtils::CXmlNode oNodeStroke = oNode.ReadNode(_T("v:stroke"));
	if (oNodeStroke.IsValid())
	{
		sStrokeColor.reset();
		oNodeStroke.ReadAttributeBase(L"strokecolor", sStrokeColor);
		if (sStrokeColor.is_init())
		{
			NSPresentationEditor::CColor color = NS_DWC_Common::getColorFromString(*sStrokeColor);

			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
			pSolid->m_namespace = _T("a");
			pSolid->Color.Color = new PPTX::Logic::SrgbClr();
			pSolid->Color.Color->SetRGB(color.R, color.G, color.B);
			pShape->spPr.ln->Fill.Fill = pSolid;
		}

		nullable_string sStrokeDashStyle;
		oNodeStroke.ReadAttributeBase(L"dashstyle", sStrokeDashStyle);
		if (sStrokeDashStyle.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			pShape->spPr.ln->prstDash = new PPTX::Logic::PrstDash();

			if (*sStrokeDashStyle == _T("solid"))
				pShape->spPr.ln->prstDash->val = _T("solid");
			else if (*sStrokeDashStyle == _T("shortdash"))
				pShape->spPr.ln->prstDash->val = _T("sysDash");
			else if (*sStrokeDashStyle == _T("shortdot"))
				pShape->spPr.ln->prstDash->val = _T("sysDot");
			else if (*sStrokeDashStyle == _T("shortdashdot"))
				pShape->spPr.ln->prstDash->val = _T("sysDashDot");
			else if (*sStrokeDashStyle == _T("shortdashdotdot"))
				pShape->spPr.ln->prstDash->val = _T("sysDashDotDot");
			else if (*sStrokeDashStyle == _T("dot"))
				pShape->spPr.ln->prstDash->val = _T("dot");
			else if (*sStrokeDashStyle == _T("dash"))
				pShape->spPr.ln->prstDash->val = _T("dash");
			else if (*sStrokeDashStyle == _T("longdash"))
				pShape->spPr.ln->prstDash->val = _T("lgDash");
			else if (*sStrokeDashStyle == _T("dashdot"))
				pShape->spPr.ln->prstDash->val = _T("dashDot");
			else if (*sStrokeDashStyle == _T("longdashdot"))
				pShape->spPr.ln->prstDash->val = _T("lgDashDot");
			else if (*sStrokeDashStyle == _T("longdashdotdot"))
				pShape->spPr.ln->prstDash->val = _T("lgDashDotDot");
			else
				pShape->spPr.ln->prstDash->val = _T("solid");
		}

		nullable_string sEndArraw;
		oNodeStroke.ReadAttributeBase(_T("endarrow"), sEndArraw);
		if (sEndArraw.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			pShape->spPr.ln->tailEnd = new PPTX::Logic::LineEnd();

			if (*sEndArraw == _T("none"))
				pShape->spPr.ln->tailEnd->type = _T("none");
			else if (*sEndArraw == _T("block"))
				pShape->spPr.ln->tailEnd->type = _T("triangle");
			else if (*sEndArraw == _T("classic"))
				pShape->spPr.ln->tailEnd->type = _T("stealth");
			else if (*sEndArraw == _T("diamond"))
				pShape->spPr.ln->tailEnd->type = _T("diamond");
			else if (*sEndArraw == _T("oval"))
				pShape->spPr.ln->tailEnd->type = _T("oval");
			else if (*sEndArraw == _T("open"))
				pShape->spPr.ln->tailEnd->type = _T("arrow");
			else
				pShape->spPr.ln->tailEnd->type = _T("none");
		}

		nullable_string sEndArrawLen;
		oNodeStroke.ReadAttributeBase(_T("endarrowlength"), sEndArrawLen);
		if (sEndArrawLen.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (!pShape->spPr.ln->tailEnd.is_init())
				pShape->spPr.ln->tailEnd = new PPTX::Logic::LineEnd();

			if (*sEndArrawLen == _T("short"))
				pShape->spPr.ln->tailEnd->len = _T("sm");
			else if (*sEndArrawLen == _T("medium"))
				pShape->spPr.ln->tailEnd->len = _T("med");
			else if (*sEndArrawLen == _T("long"))
				pShape->spPr.ln->tailEnd->len = _T("lg");
			else
				pShape->spPr.ln->tailEnd->len = _T("med");
		}

		nullable_string sEndArrawWidth;
		oNodeStroke.ReadAttributeBase(_T("endarrowwidth"), sEndArrawWidth);
		if (sEndArrawWidth.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (!pShape->spPr.ln->tailEnd.is_init())
				pShape->spPr.ln->tailEnd = new PPTX::Logic::LineEnd();

			if (*sEndArrawWidth == _T("narrow"))
				pShape->spPr.ln->tailEnd->w = _T("sm");
			else if (*sEndArrawWidth == _T("medium"))
				pShape->spPr.ln->tailEnd->w = _T("med");
			else if (*sEndArrawWidth == _T("wide"))
				pShape->spPr.ln->tailEnd->w = _T("lg");
			else
				pShape->spPr.ln->tailEnd->w = _T("med");
		}

		nullable_string sStartArraw;
		oNodeStroke.ReadAttributeBase(_T("startarrow"), sStartArraw);
		if (sStartArraw.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			pShape->spPr.ln->headEnd = new PPTX::Logic::LineEnd();

			if (*sStartArraw == _T("none"))
				pShape->spPr.ln->headEnd->type = _T("none");
			else if (*sStartArraw == _T("block"))
				pShape->spPr.ln->headEnd->type = _T("triangle");
			else if (*sStartArraw == _T("classic"))
				pShape->spPr.ln->headEnd->type = _T("stealth");
			else if (*sStartArraw == _T("diamond"))
				pShape->spPr.ln->headEnd->type = _T("diamond");
			else if (*sStartArraw == _T("oval"))
				pShape->spPr.ln->headEnd->type = _T("oval");
			else if (*sStartArraw == _T("open"))
				pShape->spPr.ln->headEnd->type = _T("arrow");
			else
				pShape->spPr.ln->headEnd->type = _T("none");
		}

		nullable_string sStartArrawLen;
		oNodeStroke.ReadAttributeBase(_T("startarrowlength"), sStartArrawLen);
		if (sStartArrawLen.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (!pShape->spPr.ln->headEnd.is_init())
				pShape->spPr.ln->headEnd = new PPTX::Logic::LineEnd();

			if (*sStartArrawLen == _T("short"))
				pShape->spPr.ln->headEnd->len = _T("sm");
			else if (*sStartArrawLen == _T("medium"))
				pShape->spPr.ln->headEnd->len = _T("med");
			else if (*sStartArrawLen == _T("long"))
				pShape->spPr.ln->headEnd->len = _T("lg");
			else
				pShape->spPr.ln->headEnd->len = _T("med");
		}

		nullable_string sStartArrawWidth;
		oNodeStroke.ReadAttributeBase(_T("startarrowwidth"), sStartArrawWidth);
		if (sStartArrawWidth.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (!pShape->spPr.ln->headEnd.is_init())
				pShape->spPr.ln->headEnd = new PPTX::Logic::LineEnd();

			if (*sStartArrawWidth == _T("narrow"))
				pShape->spPr.ln->headEnd->w = _T("sm");
			else if (*sStartArrawWidth == _T("medium"))
				pShape->spPr.ln->headEnd->w = _T("med");
			else if (*sStartArrawWidth == _T("wide"))
				pShape->spPr.ln->headEnd->w = _T("lg");
			else
				pShape->spPr.ln->headEnd->w = _T("med");
		}

		nullable_string sEndCap;
		oNodeStroke.ReadAttributeBase(_T("endcap"), sEndCap);
		if (sEndCap.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (*sEndCap == _T("flat"))
				pShape->spPr.ln->cap = _T("flat");
			else if (*sEndCap == _T("round"))
				pShape->spPr.ln->cap = _T("rnd");
			else if (*sEndCap == _T("square"))
				pShape->spPr.ln->cap = _T("sq");
		}

		nullable_string sLineJoin;
		oNodeStroke.ReadAttributeBase(_T("joinstyle"), sLineJoin);
		if (sLineJoin.is_init())
		{
			if (!pShape->spPr.ln.is_init())
				pShape->spPr.ln = new PPTX::Logic::Ln();

			if (*sLineJoin == _T("bevel"))
				pShape->spPr.ln->Join.type = PPTX::Logic::JoinBevel;
			else if (*sLineJoin == _T("miter"))
				pShape->spPr.ln->Join.type = PPTX::Logic::JoinMiter;
			else if (*sLineJoin == _T("round"))
				pShape->spPr.ln->Join.type = PPTX::Logic::JoinRound;
		}		
	}

	
	if (eType != PPTShapes::sptCFrame)
	{
		if (!pShape->spPr.ln.is_init())
			pShape->spPr.ln = new PPTX::Logic::Ln();
		if (!pShape->spPr.ln->Fill.Fill.is_init())
		{
			PPTX::Logic::SolidFill* pSolid = new PPTX::Logic::SolidFill();
			pSolid->m_namespace = _T("a");
			pSolid->Color.Color = new PPTX::Logic::SrgbClr();
			pSolid->Color.Color->SetRGB(0, 0, 0);
			pShape->spPr.ln->Fill.Fill = pSolid;
		}
	}
}

HRESULT CAVSOfficeDrawingConverter::GetThemeBinary(BSTR bsThemeFilePath, SAFEARRAY** ppBinary)
{
	if (ppBinary == NULL)
		return S_FALSE;

	m_strCurrentRelsPath = bsThemeFilePath;
	SetCurrentRelsPath();

	PPTX::FileMap oFileMap;
	OOX::CPath oPath = m_strCurrentRelsPath;
	smart_ptr<PPTX::Theme> pTheme = new PPTX::Theme(oPath, oFileMap);

	m_oBinaryWriter.ClearNoAttack();
	m_oBinaryWriter.m_oCommon.CheckFontPicker();
	pTheme->toPPTY(&m_oBinaryWriter);

	ULONG lBinarySize = m_oBinaryWriter.GetPosition();
	SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, lBinarySize);
	
	BYTE* pDataD = (BYTE*)pArray->pvData;
	BYTE* pDataS = m_oBinaryWriter.GetBuffer();
	memcpy(pDataD, pDataS, lBinarySize);

	*ppBinary = pArray;

	m_oBinaryWriter.ThemeDoc = pTheme.smart_dynamic_cast<PPTX::FileContainer>();
	

	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::LoadClrMap(BSTR bsXml)
{
	smart_ptr<PPTX::Logic::ClrMap> pClrMap = new PPTX::Logic::ClrMap();
	
	CString strXml = _T("<main xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">") + (CString)bsXml + _T("</main>");
	XmlUtils::CXmlNode oNode;
	oNode.FromXmlString(strXml);

	if (oNode.IsValid())
	{
		pClrMap->fromXMLW(oNode.ReadNode(_T("w:clrSchemeMapping")));
	}
	
	m_oClrMap = pClrMap.smart_dynamic_cast<PPTX::WrapperWritingElement>();
	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::SaveThemeXml(SAFEARRAY* pBinaryTheme, LONG lStart, LONG lLength, BSTR bsThemePath)
{
	if (NULL == pBinaryTheme || NULL == bsThemePath)
		return S_FALSE;

	BYTE* pData = (BYTE*)pBinaryTheme->pvData;
	
	m_oReader.Init(pData, lStart, lLength);

	m_oReader.m_oRels.Clear();
	m_oReader.m_oRels.StartTheme();

	smart_ptr<PPTX::Theme> pTheme = new PPTX::Theme();
	pTheme->fromPPTY(&m_oReader);
	m_oXmlWriter.ClearNoAttack();
	m_oReader.m_oRels.CloseRels();

	CString strThemePath = (CString)bsThemePath;

	pTheme->toXmlWriter(&m_oXmlWriter);
	m_oXmlWriter.SaveToFile(strThemePath);

	OOX::CPath filename = strThemePath;
	CString strTemp = filename.GetDirectory() + _T("\\_rels\\");
	CString strFileName = filename.GetFilename();
	if (strFileName == _T(""))
		strTemp += _T(".rels");
	else
		strTemp += (strFileName + _T(".rels"));
	
	m_oReader.m_oRels.SaveRels(strTemp);

	m_oXmlWriter.ClearNoAttack();

	m_oTheme = pTheme.smart_dynamic_cast<PPTX::WrapperFile>();
	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::SaveObject(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, BSTR bsMainProps, BSTR* bsXml)
{
	if (NULL == pBinaryObj || bsXml == NULL)
		return S_OK;

	bool bIsInline = false;
	CString strMainProps = (CString)bsMainProps;
	int nIndexF = strMainProps.Find(_T("</wp:inline>"));
	if (-1 != nIndexF)
	{
		bIsInline = true;
		strMainProps = strMainProps.Mid(0, nIndexF);
	}
	else
	{
		nIndexF = strMainProps.Find(_T("</wp:anchor>"));
		strMainProps = strMainProps.Mid(0, nIndexF);
	}

	if (-1 == nIndexF)
		return S_FALSE;

	

	strMainProps += _T("<wp:cNvGraphicFramePr/>");

	if (0 == m_nCurrentIndexObject)
	{
		BYTE* pData = (BYTE*)pBinaryObj->pvData;
		m_oReader.Init(pData, lStart, lLength);

		m_oReader.m_pSourceArray = pBinaryObj;
	}
	else
	{
		m_oReader.Seek(lStart);
	}
	
	++m_nCurrentIndexObject;

	BYTE typeRec1 = m_oReader.GetUChar(); 
	LONG _e = m_oReader.GetPos() + m_oReader.GetLong() + 4;

	m_oReader.Skip(5); 
	PPTX::Logic::SpTreeElem oElem;

	
	m_oReader.m_lDocumentType = XMLWRITER_DOC_TYPE_DOCX;
	this->QueryInterface(IID_IUnknown, (void**)&(m_oReader.m_pDrawingConverter));

	oElem.fromPPTY(&m_oReader);
	
	m_oReader.m_lDocumentType = XMLWRITER_DOC_TYPE_PPTX;
	RELEASEINTERFACE((m_oReader.m_pDrawingConverter));


	NSBinPptxRW::CXmlWriter oXmlWriter;
	oXmlWriter.m_lDocType = XMLWRITER_DOC_TYPE_DOCX;
	oXmlWriter.m_bIsUseOffice2007 = m_bIsUseConvertion2007;

	oXmlWriter.m_bIsTop = (1 == m_nCurrentIndexObject) ? true : false;

#ifdef BUILD_CONFIG_FULL_VERSION
	if (NULL == m_pOOXToVMLRenderer)
	{
		CoCreateInstance(__uuidof(CAVSOOXToVMLGeometry), NULL, CLSCTX_ALL, __uuidof(IASCRenderer), (void**)&m_pOOXToVMLRenderer);		
	}
	m_pOOXToVMLRenderer->QueryInterface(__uuidof(IASCRenderer), (void**)(&(oXmlWriter.m_pOOXToVMLRenderer)));
#endif
	
	BOOL bIsNeedConvert2007 = FALSE;
#ifdef BUILD_CONFIG_FULL_VERSION
	if (m_bIsUseConvertion2007)
	{
		if (oElem.is<PPTX::Logic::SpTree>())
		{
			oXmlWriter.WriteString(_T("<mc:AlternateContent><mc:Choice Requires=\"wpg\">"));
			bIsNeedConvert2007 = TRUE;
		}
		else if (oElem.is<PPTX::Logic::Shape>())
		{
			oXmlWriter.WriteString(_T("<mc:AlternateContent><mc:Choice Requires=\"wps\">"));
			bIsNeedConvert2007 = TRUE;
		}
	}
#endif

	oXmlWriter.WriteString(_T("<w:drawing>"));
	oXmlWriter.WriteString(strMainProps);

	if (oElem.is<PPTX::Logic::SpTree>())
	{
		oXmlWriter.WriteString(_T("<a:graphic xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">\
<a:graphicData uri=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\">"));
	}
	else if (oElem.is<PPTX::Logic::Pic>())
	{
		oXmlWriter.WriteString(_T("<a:graphic xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">\
<a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/picture\">"));
	}
	else
	{
		oXmlWriter.WriteString(_T("<a:graphic xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">\
<a:graphicData uri=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\">"));
	}
	oElem.toXmlWriter(&oXmlWriter);
	oXmlWriter.WriteString(_T("</a:graphicData>\
</a:graphic>"));	
	
	oXmlWriter.WriteString(bIsInline ? _T("</wp:inline>") : _T("</wp:anchor>"));
	oXmlWriter.WriteString(_T("</w:drawing>"));

	if (bIsNeedConvert2007)
	{
		oXmlWriter.WriteString(_T("</mc:Choice><mc:Fallback><w:pict>"));

		if (oElem.is<PPTX::Logic::SpTree>())
		{
			ConvertGroupVML(oElem, bsMainProps, oXmlWriter);
		}
		else if (oElem.is<PPTX::Logic::Shape>())
		{
			ConvertShapeVML(oElem, bsMainProps, oXmlWriter);
		}

		oXmlWriter.WriteString(_T("</w:pict></mc:Fallback></mc:AlternateContent>"));
	}

	--m_nCurrentIndexObject;

	CString ret = oXmlWriter.GetXmlString();
	*bsXml = ret.AllocSysString();

	m_oReader.Seek(_e);
	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::SaveObjectEx(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, BSTR bsMainProps, LONG lDocType, BSTR* bsXml)
{
	if (XMLWRITER_DOC_TYPE_DOCX == lDocType)
	{
		
		return SaveObject(pBinaryObj, lStart, lLength, bsMainProps, bsXml);
	}

	if (NULL == pBinaryObj || bsXml == NULL)
		return S_OK;

	if (0 == m_nCurrentIndexObject)
	{
		BYTE* pData = (BYTE*)pBinaryObj->pvData;
		m_oReader.Init(pData, lStart, lLength);

		m_oReader.m_pSourceArray = pBinaryObj;
	}
	else
	{
		m_oReader.Seek(lStart);
	}

	if (lDocType != XMLWRITER_DOC_TYPE_DOCX)
		m_oImageManager.m_bIsWord = FALSE;
	else
		m_oImageManager.m_bIsWord = TRUE;
	
	++m_nCurrentIndexObject;

	BYTE typeRec1 = m_oReader.GetUChar(); 
	LONG _e = m_oReader.GetPos() + m_oReader.GetLong() + 4;

	m_oReader.Skip(5); 
	PPTX::Logic::SpTreeElem oElem;

	m_oReader.m_lDocumentType = lDocType;
	this->QueryInterface(IID_IUnknown, (void**)&(m_oReader.m_pDrawingConverter));

	oElem.fromPPTY(&m_oReader);
	
	m_oReader.m_lDocumentType = XMLWRITER_DOC_TYPE_PPTX;
	RELEASEINTERFACE((m_oReader.m_pDrawingConverter));

	NSBinPptxRW::CXmlWriter oXmlWriter;
	oXmlWriter.m_lDocType = (BYTE)lDocType;
	oXmlWriter.m_bIsUseOffice2007 = FALSE;

	oXmlWriter.m_bIsTop = (1 == m_nCurrentIndexObject) ? true : false;

	oElem.toXmlWriter(&oXmlWriter);

	--m_nCurrentIndexObject;

	CString ret = oXmlWriter.GetXmlString();
	*bsXml = ret.AllocSysString();

	m_oReader.Seek(_e);
	return S_OK;
}

void CAVSOfficeDrawingConverter::ConvertShapeVML(PPTX::Logic::SpTreeElem& oElem, BSTR bsMainProps, NSBinPptxRW::CXmlWriter& oWriter)
{
	if (bsMainProps)
	{
		ConvertMainPropsToVML(bsMainProps, oWriter, oElem);
	}

	oWriter.m_bIsTop = true; 
	PPTX::Logic::Shape& oShape = oElem.as<PPTX::Logic::Shape>();
	oShape.toXmlWriterVML(&oWriter, m_oTheme, m_oClrMap);
}

void CAVSOfficeDrawingConverter::ConvertGroupVML(PPTX::Logic::SpTreeElem& oElem, BSTR bsMainProps, NSBinPptxRW::CXmlWriter& oWriter)
{
	if (bsMainProps)
	{
		
		ConvertMainPropsToVML(bsMainProps, oWriter, oElem);
	}

	oWriter.m_bIsTop = true; 
	PPTX::Logic::SpTree& oGroup = oElem.as<PPTX::Logic::SpTree>();
	oGroup.toXmlWriterVML(&oWriter, m_oTheme, m_oClrMap);
}

void CAVSOfficeDrawingConverter::ConvertMainPropsToVML(BSTR bsMainProps, NSBinPptxRW::CXmlWriter& pWriter, PPTX::Logic::SpTreeElem& oElem)
{
	XmlUtils::CXmlNode oNode;
	if (!oNode.FromXmlString((CString)bsMainProps))
		return;

	NSBinPptxRW::CXmlWriter oWriter;

	oWriter.WriteAttributeCSS(_T("position"), _T("absolute"));
	double dKoef = 72.0 / (36000 * 25.4);
	if (_T("wp:inline") == oNode.GetName())
	{
		nullable_int margT; oNode.ReadAttributeBase(L"distT", margT);
		nullable_int margB; oNode.ReadAttributeBase(L"distB", margB);
		nullable_int margL; oNode.ReadAttributeBase(L"distL", margL);
		nullable_int margR; oNode.ReadAttributeBase(L"distR", margR);

		if (margL.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-left"), dKoef * (*margL));
		if (margT.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-top"), dKoef * (*margT));
		if (margR.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-right"), dKoef * (*margR));
		if (margB.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-bottom"), dKoef * (*margB));

		XmlUtils::CXmlNode oNodeS;
		if (oNode.GetNode(_T("wp:extent"), oNodeS))
		{
			int _width = oNodeS.ReadAttributeInt(_T("cx"));
			int _height = oNodeS.ReadAttributeInt(_T("cy"));

			oWriter.WriteAttributeCSS_double1_pt(_T("width"), dKoef * _width);
			oWriter.WriteAttributeCSS_double1_pt(_T("height"), dKoef * _height);
		}
	}
	else
	{
		nullable_int margT; oNode.ReadAttributeBase(L"distT", margT);
		nullable_int margB; oNode.ReadAttributeBase(L"distB", margB);
		nullable_int margL; oNode.ReadAttributeBase(L"distL", margL);
		nullable_int margR; oNode.ReadAttributeBase(L"distR", margR);

		if (margL.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-left"), dKoef * (*margL));
		if (margT.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-top"), dKoef * (*margT));
		if (margR.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-right"), dKoef * (*margR));
		if (margB.is_init())
			oWriter.WriteAttributeCSS_double1_pt(_T("mso-wrap-distance-bottom"), dKoef * (*margB));

		nullable_int zIndex; oNode.ReadAttributeBase(L"relativeHeight", zIndex);
		if (zIndex.is_init())
			oWriter.WriteAttributeCSS_int(_T("z-index"), *zIndex);

		XmlUtils::CXmlNode oNodeHorP;
		if (oNode.GetNode(_T("wp:positionH"), oNodeHorP))
		{
			CString strWriteRelFrom = oNodeHorP.GetAttribute(_T("relativeFrom"), _T("column"));
			if (strWriteRelFrom == _T("character"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("char"));
			else if (strWriteRelFrom == _T("page"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("page"));
			else if (strWriteRelFrom == _T("margin"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("margin"));
			else if (strWriteRelFrom == _T("leftMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("left-margin-area"));
			else if (strWriteRelFrom == _T("rightMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("right-margin-area"));
			else if (strWriteRelFrom == _T("insideMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("inner-margin-area"));
			else if (strWriteRelFrom == _T("outsideMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("outer-margin-area"));
			else if (strWriteRelFrom == _T("column"))
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal-relative"), _T("text"));

			XmlUtils::CXmlNode oNodeO;
			if (oNodeHorP.GetNode(_T("wp:posOffset"), oNodeO))
			{
				int nPos = oNodeHorP.ReadValueInt(_T("wp:posOffset"));
				oWriter.WriteAttributeCSS_double1_pt(_T("margin-left"), dKoef * nPos);
				oWriter.WriteAttributeCSS(_T("mso-position-horizontal"), _T("absolute"));
			}
			else
			{
				CString sA = oNodeHorP.ReadValueString(_T("wp:align"));
				if (_T("") != sA)
				{
					oWriter.WriteAttributeCSS(_T("mso-position-horizontal"), sA);
				}
			}
		}

		XmlUtils::CXmlNode oNodeVerP;
		if (oNode.GetNode(_T("wp:positionV"), oNodeVerP))
		{
			CString strWriteRelFrom = oNodeVerP.GetAttribute(_T("relativeFrom"), _T("paragraph"));
			if (strWriteRelFrom == _T("margin"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("margin"));
			else if (strWriteRelFrom == _T("paragraph"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("text"));
			else if (strWriteRelFrom == _T("page"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("page"));
			else if (strWriteRelFrom == _T("topMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("top-margin-area"));
			else if (strWriteRelFrom == _T("bottomMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("bottom-margin-area"));
			else if (strWriteRelFrom == _T("insideMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("inner-margin-area"));
			else if (strWriteRelFrom == _T("outsideMargin"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("outer-margin-area"));
			else if (strWriteRelFrom == _T("line"))
				oWriter.WriteAttributeCSS(_T("mso-position-vertical-relative"), _T("line"));

			XmlUtils::CXmlNode oNodeO;
			if (oNodeVerP.GetNode(_T("wp:posOffset"), oNodeO))
			{
				int nPos = oNodeVerP.ReadValueInt(_T("wp:posOffset"));
				oWriter.WriteAttributeCSS_double1_pt(_T("margin-top"), dKoef * nPos);
				oWriter.WriteAttributeCSS(_T("mso-position-vertical"), _T("absolute"));
			}
			else
			{
				CString sA = oNodeVerP.ReadValueString(_T("wp:align"));
				if (_T("") != sA)
				{
					oWriter.WriteAttributeCSS(_T("mso-position-vertical"), sA);
				}
			}
		}

		XmlUtils::CXmlNode oNodeS;
		if (oNode.GetNode(_T("wp:extent"), oNodeS))
		{
			int _width = oNodeS.ReadAttributeInt(_T("cx"));
			int _height = oNodeS.ReadAttributeInt(_T("cy"));

			oWriter.WriteAttributeCSS_double1_pt(_T("width"), dKoef * _width);
			oWriter.WriteAttributeCSS_double1_pt(_T("height"), dKoef * _height);
		}

		XmlUtils::CXmlNode oNodeWrap = oNode.ReadNode(_T("<wp:wrapNone/>"));
		XmlUtils::CXmlNode oNodeWrapPoints;
		if (oNodeWrap.IsValid())
		{
			
		}
		else
		{
			oNodeWrap = oNode.ReadNode(_T("wp:wrapSquare"));
			if (oNodeWrap.IsValid())
			{
				pWriter.m_strNodes += _T("<w10:wrap type=\"square\"/>");
			}
			else
			{
				oNodeWrap = oNode.ReadNode(_T("wp:wrapTopAndBottom"));
				if (oNodeWrap.IsValid())
				{
					pWriter.m_strNodes += _T("<w10:wrap type=\"topAndBottom\"/>");
				}
				else
				{
					oNodeWrap = oNode.ReadNode(_T("wp:wrapTight"));
					if (oNodeWrap.IsValid())
					{
						pWriter.m_strNodes += _T("<w10:wrap type=\"tight\"/>");
						oNodeWrap.GetNode(_T("wp:wrapPolygon"), oNodeWrapPoints);
					}
					else
					{
						oNodeWrap = oNode.ReadNode(_T("wp:wrapThrough"));
						if (oNodeWrap.IsValid())
						{
							pWriter.m_strNodes += _T("<w10:wrap type=\"through\"/>");
							oNodeWrap.GetNode(_T("wp:wrapPolygon"), oNodeWrapPoints);
						}
					}
				}
			}
		}

		if (oNodeWrapPoints.IsValid())
		{
			double dKoefX = 100000.0 / 21600;
			double dKoefY = dKoefX;
			if (oElem.is<PPTX::Logic::SpTree>())
			{
				PPTX::Logic::SpTree& oSpTr = oElem.as<PPTX::Logic::SpTree>();
				if (oSpTr.grpSpPr.xfrm.is_init())
				{
					int nW = oSpTr.grpSpPr.xfrm->chExtX.get_value_or(21600);
					int nH = oSpTr.grpSpPr.xfrm->chExtY.get_value_or(21600);

					
					
					dKoefX = 1.0;
					dKoefY = 1.0;
				}
			}

			CString strAttr = _T(" wrapcoords=\"");
			XmlUtils::CXmlNodes oNodesP;
			if (oNodeWrapPoints.GetNodes(_T("*"), oNodesP))
			{
				int nCountP = oNodesP.GetCount();
				for (int i = 0; i < nCountP; ++i)
				{
					XmlUtils::CXmlNode oNodeT;
					oNodesP.GetAt(i, oNodeT);

					int nX = oNodeT.ReadAttributeInt(_T("x"));
					int nY = oNodeT.ReadAttributeInt(_T("y"));
					nX = (int)(dKoefX * nX);
					nY = (int)(dKoefY * nY);

					CString strFP = _T("");
					strFP.Format(_T("%d %d"), nX, nY);
					strAttr += strFP;

					if (i < (nCountP - 1))
						strAttr += _T(" ");
				}
			}
			strAttr += _T("\"");

			pWriter.m_strAttributesMain += strAttr;
		}
	}

	pWriter.m_strStyleMain = oWriter.GetXmlString();
}

HRESULT CAVSOfficeDrawingConverter::GetTxBodyBinary(BSTR bsXml, SAFEARRAY** ppBinary)
{
	XmlUtils::CXmlNode oNode;
	if (!oNode.FromXmlString((CString)bsXml))
		return S_FALSE;
	
	PPTX::Logic::TxBody oTxBody(oNode);

	m_oBinaryWriter.ClearNoAttack();
	m_oBinaryWriter.m_oCommon.CheckFontPicker();
	

	m_oBinaryWriter.WriteRecord1(0, oTxBody);

	if (NULL != ppBinary)
	{
		ULONG lBinarySize = m_oBinaryWriter.GetPosition();
		SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, lBinarySize);
		
		BYTE* pDataD = (BYTE*)pArray->pvData;
		BYTE* pDataS = m_oBinaryWriter.GetBuffer();
		memcpy(pDataD, pDataS, lBinarySize);

		*ppBinary = pArray;
	}

	m_oBinaryWriter.ClearNoAttack();
	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::GetTxBodyXml(SAFEARRAY* pBinary, LONG lStart, LONG lLength, BSTR* pbstrXml)
{
	NSBinPptxRW::CBinaryFileReader oReader;
	oReader.Init((BYTE*)pBinary->pvData, lStart, lLength);

	BYTE type = oReader.GetUChar();
	if (0 != type || NULL == pbstrXml)
		return S_FALSE;

	PPTX::Logic::TxBody oTxBody;
	oTxBody.fromPPTY(&oReader);

	NSBinPptxRW::CXmlWriter oWriter;
	oTxBody.toXmlWriterExcel(&oWriter);

	CString strXml = oWriter.GetXmlString();
	*pbstrXml = strXml.AllocSysString();

	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::SetFontDir(BSTR bsFontDir)
{
	m_strFontDirectory = (CString)bsFontDir;
	return S_OK;
}

HRESULT CAVSOfficeDrawingConverter::GetRecordBinary(LONG lRecordType, BSTR bsXml, SAFEARRAY** ppBinary)
{
	if (NULL == bsXml || ppBinary == NULL)
		return S_FALSE;

	CString strXml = _T("<main ");

	strXml += _T("\
xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" \
xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:o=\"urn:schemas-microsoft-com:office:office\" \
xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" \
xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" \
xmlns:v=\"urn:schemas-microsoft-com:vml\" \
xmlns:ve=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" \
xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" \
xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" \
xmlns:w10=\"urn:schemas-microsoft-com:office:word\" \
xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" \
xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" \
xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" \
xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" \
xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" \
xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" \
xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" \
xmlns:a14=\"http://schemas.microsoft.com/office/drawing/2010/main\" \
xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\" \
xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\" \
xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\"");

	strXml += _T(">");
	strXml += (CString)bsXml;
	strXml += _T("</main>");

	XmlUtils::CXmlNode oNodeMain;
	if (!oNodeMain.FromXmlString(strXml))
		return S_FALSE;

	XmlUtils::CXmlNodes oNodes;
	if (!oNodeMain.GetNodes(_T("*"), oNodes))
		return S_FALSE;

	if (1 != oNodes.GetCount())
		return S_FALSE;

	XmlUtils::CXmlNode oNode;
	oNodes.GetAt(0, oNode);

	PPTX::WrapperWritingElement* pWritingElem = NULL;
	switch (lRecordType)
	{
	case XMLWRITER_RECORD_TYPE_SPPR:
		{
			PPTX::Logic::SpPr* pSpPr = new PPTX::Logic::SpPr();
			*pSpPr = oNode;

			pWritingElem = (PPTX::WrapperWritingElement*)pSpPr;
			break;
		}
	default:
		break;
	}

	if (NULL == pWritingElem)
		return S_FALSE;

	m_oBinaryWriter.ClearNoAttack();
	m_oBinaryWriter.m_oCommon.CheckFontPicker();

	m_oBinaryWriter.WriteRecord1(0, *pWritingElem);
	
	ULONG lBinarySize = m_oBinaryWriter.GetPosition();
	SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, lBinarySize);
	
	BYTE* pDataD = (BYTE*)pArray->pvData;
	BYTE* pDataS = m_oBinaryWriter.GetBuffer();
	memcpy(pDataD, pDataS, lBinarySize);

	*ppBinary = pArray;
	
	RELEASEOBJECT(pWritingElem);

	return S_OK;	
}

HRESULT CAVSOfficeDrawingConverter::GetRecordXml(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, LONG lRecType, LONG lDocType, BSTR* bsXml)
{
	if (NULL == pBinaryObj || bsXml == NULL)
		return S_FALSE;

	BYTE* pData = (BYTE*)pBinaryObj->pvData;
	m_oReader.Init(pData, lStart, lLength);
	m_oReader.m_pSourceArray = pBinaryObj;
	
	BYTE typeRec1 = m_oReader.GetUChar();
	
	PPTX::WrapperWritingElement* pWritingElem = NULL;

	switch (lRecType)
	{
	case XMLWRITER_RECORD_TYPE_SPPR:
		{
			pWritingElem = (PPTX::WrapperWritingElement*)(new PPTX::Logic::SpPr());
			pWritingElem->fromPPTY(&m_oReader);
			break;
		}
	default:
		break;
	}

	if (NULL == pWritingElem)
		return S_FALSE;

	NSBinPptxRW::CXmlWriter oXmlWriter;
	oXmlWriter.m_lDocType = (BYTE)lDocType;
	oXmlWriter.m_bIsUseOffice2007 = FALSE;
	oXmlWriter.m_bIsTop = true;

	pWritingElem->toXmlWriter(&oXmlWriter);

	CString ret = oXmlWriter.GetXmlString();
	*bsXml = ret.AllocSysString();

	RELEASEOBJECT(pWritingElem);

	return S_OK;
}
