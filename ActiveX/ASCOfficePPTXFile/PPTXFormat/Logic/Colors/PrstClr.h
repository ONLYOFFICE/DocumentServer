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
 #pragma once
#ifndef PPTX_LOGIC_PRSTCLR_INCLUDE_H_
#define PPTX_LOGIC_PRSTCLR_INCLUDE_H_

#include "./../../Limit/PrstClrVal.h"
#include "ColorBase.h"

namespace PPTX
{
	namespace Logic
	{
		class PrstClr : public ColorBase
		{
		public:
			PPTX_LOGIC_BASE(PrstClr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				val = node.GetAttribute(_T("val"));
				Modifiers.RemoveAll();
				node.LoadArray(_T("*"), Modifiers);
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("val"), val.get());

				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(Modifiers);
				
				return XmlUtils::CreateNode(_T("a:prstClr"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:prstClr"));
						
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("val"), val.get());
				pWriter->EndAttributes();

				size_t nCount = Modifiers.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Modifiers[i].toXmlWriter(pWriter);
				
				pWriter->EndNode(_T("a:prstClr"));
			}

			virtual DWORD PrstClr::GetRGBA(DWORD RGBA) const
			{
				PrstClr* pColor = const_cast<PrstClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetRGBA(RGBA);
			}

			virtual DWORD PrstClr::GetARGB(DWORD ARGB) const
			{
				PrstClr* pColor = const_cast<PrstClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetARGB(ARGB);
			}

			virtual DWORD GetBGRA(DWORD BGRA) const
			{
				PrstClr* pColor = const_cast<PrstClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetBGRA(BGRA);
			}

			virtual DWORD GetABGR(DWORD ABGR) const
			{
				PrstClr* pColor = const_cast<PrstClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetABGR(ABGR);
			}			

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(COLOR_TYPE_PRST);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, val.get());
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				ULONG len = (ULONG)Modifiers.GetCount();
				if (len != 0)
				{
					pWriter->StartRecord(0);
					pWriter->WriteULONG(len);

					for (ULONG i = 0; i < len; ++i)
					{
						pWriter->WriteRecord1(1, Modifiers[i]);
					}

					pWriter->EndRecord();
				}

				pWriter->EndRecord();
			}
		private:
			void FillRGBFromVal()
			{
				DWORD RGB = 0;
				CString str = val.get();
				if(str != _T(""))
				{
					switch(str[0])
					{
					case 'a':
						if(str == _T("aliceBlue"))		{RGB = 0xF0F8FF; break;} 
						if(str == _T("antiqueWhite"))	{RGB = 0xFAEBD7; break;} 
						if(str == _T("aqua"))			{RGB = 0x00FFFF; break;} 
						if(str == _T("aquamarine"))		{RGB = 0x7FFFD4; break;} 
						if(str == _T("azure"))			{RGB = 0xF0FFFF; break;} 
						break;
					case 'b':
						if(str == _T("beige"))			{RGB = 0xF5F5DC; break;} 
						if(str == _T("bisque"))			{RGB = 0xFFE4C4; break;} 
						if(str == _T("black"))			{RGB = 0x000000; break;} 
						if(str == _T("blanchedAlmond"))	{RGB = 0xFFEBCD; break;} 
						if(str == _T("blue"))			{RGB = 0x0000FF; break;} 
						if(str == _T("blueViolet"))		{RGB = 0x8A2BE2; break;} 
						if(str == _T("brown"))			{RGB = 0xA52A2A; break;} 
						if(str == _T("burlyWood"))		{RGB = 0xDEB887; break;} 
						break;
					case 'c':
						if(str == _T("cadetBlue"))		{RGB = 0x5F9EA0; break;} 
						if(str == _T("chartreuse"))		{RGB = 0x7FFF00; break;} 
						if(str == _T("chocolate"))		{RGB = 0xD2691E; break;} 
						if(str == _T("coral"))			{RGB = 0xFF7F50; break;} 
						if(str == _T("cornflowerBlue"))	{RGB = 0x6495ED; break;} 
						if(str == _T("cornsilk"))		{RGB = 0xFFF8DC; break;} 
						if(str == _T("crimson"))		{RGB = 0xDC143C; break;} 
						if(str == _T("cyan"))			{RGB = 0x00FFFF; break;} 
						break;
					case 'd':
						if(str == _T("darkBlue"))		{RGB = 0x00008B; break;} 
						if(str == _T("darkCyan"))		{RGB = 0x008B8B; break;} 
						if(str == _T("darkGoldenrod"))	{RGB = 0xB8860B; break;} 
						if(str == _T("darkGray"))		{RGB = 0xA9A9A9; break;} 
						if(str == _T("darkGreen"))		{RGB = 0x006400; break;} 
						if(str == _T("darkGrey"))		{RGB = 0xA9A9A9; break;} 
						if(str == _T("darkKhaki"))		{RGB = 0xBDB76B; break;} 
						if(str == _T("darkMagenta"))	{RGB = 0x8B008B; break;} 
						if(str == _T("darkOliveGreen"))	{RGB = 0x556B2F; break;} 
						if(str == _T("darkOrange"))		{RGB = 0xFF8C00; break;} 
						if(str == _T("darkOrchid"))		{RGB = 0x9932CC; break;} 
						if(str == _T("darkRed"))		{RGB = 0x8B0000; break;} 
						if(str == _T("darkSalmon"))		{RGB = 0xE9967A; break;} 
						if(str == _T("darkSeaGreen"))	{RGB = 0x8FBC8F; break;} 
						if(str == _T("darkSlateBlue"))	{RGB = 0x483D8B; break;} 
						if(str == _T("darkSlateGray"))	{RGB = 0x2F4F4F; break;} 
						if(str == _T("darkSlateGrey"))	{RGB = 0x2F4F4F; break;} 
						if(str == _T("darkTurquoise"))	{RGB = 0x00CED1; break;} 
						if(str == _T("darkViolet"))		{RGB = 0x9400D3; break;} 
						if(str == _T("deepPink"))		{RGB = 0xFF1493; break;} 
						if(str == _T("deepSkyBlue"))	{RGB = 0x00BFFF; break;} 
						if(str == _T("dimGray"))		{RGB = 0x696969; break;} 
						if(str == _T("dimGrey"))		{RGB = 0x696969; break;} 
						if(str == _T("dkBlue"))			{RGB = 0x00008B; break;} 
						if(str == _T("dkCyan"))			{RGB = 0x008B8B; break;} 
						if(str == _T("dkGoldenrod"))	{RGB = 0xB8860B; break;} 
						if(str == _T("dkGray"))			{RGB = 0xA9A9A9; break;} 
						if(str == _T("dkGreen"))		{RGB = 0x006400; break;} 
						if(str == _T("dkGrey"))			{RGB = 0xA9A9A9; break;} 
						if(str == _T("dkKhaki"))		{RGB = 0xBDB76B; break;} 
						if(str == _T("dkMagenta"))		{RGB = 0x8B008B; break;} 
						if(str == _T("dkOliveGreen"))	{RGB = 0x556B2F; break;} 
						if(str == _T("dkOrange"))		{RGB = 0xFF8C00; break;} 
						if(str == _T("dkOrchid"))		{RGB = 0x9932CC; break;} 
						if(str == _T("dkRed"))			{RGB = 0x8B0000; break;} 
						if(str == _T("dkSalmon"))		{RGB = 0xE9967A; break;} 
						if(str == _T("dkSeaGreen"))		{RGB = 0x8FBC8B; break;} 
						if(str == _T("dkSlateBlue"))	{RGB = 0x483D8B; break;} 
						if(str == _T("dkSlateGray"))	{RGB = 0x2F4F4F; break;} 
						if(str == _T("dkSlateGrey"))	{RGB = 0x2F4F4F; break;} 
						if(str == _T("dkTurquoise"))	{RGB = 0x00CED1; break;} 
						if(str == _T("dkViolet"))		{RGB = 0x9400D3; break;} 
						if(str == _T("dodgerBlue"))		{RGB = 0x1E90FF; break;} 
						break;
					case 'f':
						if(str == _T("firebrick"))		{RGB = 0xB22222; break;} 
						if(str == _T("floralWhite"))	{RGB = 0xFFFAF0; break;} 
						if(str == _T("forestGreen"))	{RGB = 0x228B22; break;} 
						if(str == _T("fuchsia"))		{RGB = 0xFF00FF; break;} 
						break;
					case 'g':
						if(str == _T("gainsboro"))		{RGB = 0xDCDCDC; break;} 
						if(str == _T("ghostWhite"))		{RGB = 0xF8F8FF; break;} 
						if(str == _T("gold"))			{RGB = 0xFFD700; break;} 
						if(str == _T("goldenrod"))		{RGB = 0xDAA520; break;} 
						if(str == _T("gray"))			{RGB = 0x808080; break;} 
						if(str == _T("green"))			{RGB = 0x8000; break;} 
						if(str == _T("greenYellow"))	{RGB = 0xADFF2F; break;} 
						if(str == _T("grey"))			{RGB = 0x808080; break;} 
						break;
					case 'h':
						if(str == _T("honeydew"))		{RGB = 0xF0FFF0; break;} 
						if(str == _T("hotPink"))		{RGB = 0xFF69B4; break;} 
						break;
					case 'i':
						if(str == _T("indianRed"))		{RGB = 0xCD5C5C; break;} 
						if(str == _T("indigo"))			{RGB = 0x4B0082; break;} 
						if(str == _T("ivory"))			{RGB = 0xFFFFF0; break;} 
						break;
					case 'k':
						if(str == _T("khaki"))			{RGB = 0xF0E68C; break;} 
						break;
					case 'l':
						if(str == _T("lavender"))		{RGB = 0xE6E6FA; break;} 
						if(str == _T("lavenderBlush"))	{RGB = 0xFFF0F5; break;} 
						if(str == _T("lawnGreen"))		{RGB = 0x7CFC00; break;} 
						if(str == _T("lemonChiffon"))	{RGB = 0xFFFACD; break;} 
						if(str == _T("lightBlue"))		{RGB = 0xADD8E6; break;} 
						if(str == _T("lightCoral"))		{RGB = 0xF08080; break;} 
						if(str == _T("lightCyan"))		{RGB = 0xE0FFFF; break;} 
						if(str==_T("lightGoldenrodYellow")){RGB = 0xFAFAD2;break;} 
						if(str == _T("lightGray"))		{RGB = 0xD3D3D3; break;} 
						if(str == _T("lightGreen"))		{RGB = 0x90EE90; break;} 
						if(str == _T("lightGrey"))		{RGB = 0xD3D3D3; break;} 
						if(str == _T("lightPink"))		{RGB = 0xFFB6C1; break;} 
						if(str == _T("lightSalmon"))	{RGB = 0xFFA07A; break;} 
						if(str == _T("lightSeaGreen"))	{RGB = 0x20B2AA; break;} 
						if(str == _T("lightSkyBlue"))	{RGB = 0x87CEFA; break;} 
						if(str == _T("lightSlateGray"))	{RGB = 0x778899; break;} 
						if(str == _T("lightSlateGrey"))	{RGB = 0x778899; break;} 
						if(str == _T("lightSteelBlue"))	{RGB = 0xB0C4DE; break;} 
						if(str == _T("lightYellow"))	{RGB = 0xFFFFE0; break;} 
						if(str == _T("lime"))			{RGB = 0x00FF00; break;} 
						if(str == _T("limeGreen"))		{RGB = 0x32CD32; break;} 
						if(str == _T("linen"))			{RGB = 0xFAF0E6; break;} 
						if(str == _T("ltBlue"))			{RGB = 0xADD8E6; break;} 
						if(str == _T("ltCoral"))		{RGB = 0xF08080; break;} 
						if(str == _T("ltCyan"))			{RGB = 0xE0FFFF; break;} 
						if(str == _T("ltGoldenrodYellow")){RGB = 0xFAFA78; break;} 
						if(str == _T("ltGray"))			{RGB = 0xD3D3D3; break;} 
						if(str == _T("ltGreen"))		{RGB = 0x90EE90; break;} 
						if(str == _T("ltGrey"))			{RGB = 0xD3D3D3; break;} 
						if(str == _T("ltPink"))			{RGB = 0xFFB6C1; break;} 
						if(str == _T("ltSalmon"))		{RGB = 0xFFA07A; break;} 
						if(str == _T("ltSeaGreen"))		{RGB = 0x20B2AA; break;} 
						if(str == _T("ltSkyBlue"))		{RGB = 0x87CEFA; break;} 
						if(str == _T("ltSlateGray"))	{RGB = 0x778899; break;} 
						if(str == _T("ltSlateGrey"))	{RGB = 0x778899; break;} 
						if(str == _T("ltSteelBlue"))	{RGB = 0xB0C4DE; break;} 
						if(str == _T("ltYellow"))		{RGB = 0xFFFFE0; break;} 
						break;
					case 'm':
						if(str == _T("magenta"))		{RGB = 0xFF00FF; break;} 
						if(str == _T("maroon"))			{RGB = 0x800000; break;} 
						if(str == _T("medAquamarine"))	{RGB = 0x66CDAA; break;} 
						if(str == _T("medBlue"))		{RGB = 0x0000CD; break;} 
						if(str == _T("mediumAquamarine")) {RGB = 0x66CDAA; break;} 
						if(str == _T("mediumBlue"))		{RGB = 0x0000CD; break;} 
						if(str == _T("mediumOrchid"))	{RGB = 0xBA55D3; break;} 
						if(str == _T("mediumPurple"))	{RGB = 0x9370DB; break;} 
						if(str == _T("mediumSeaGreen"))	{RGB = 0x3CB371; break;} 
						if(str == _T("mediumSlateBlue")){RGB = 0x7B68EE; break;} 
						if(str == _T("mediumSpringGreen")){RGB = 0x00FA9A; break;} 
						if(str == _T("mediumTurquoise")){RGB = 0x48D1CC; break;} 
						if(str == _T("mediumVioletRed")){RGB = 0xC71585; break;} 
						if(str == _T("medOrchid"))		{RGB = 0xBA55D3; break;} 
						if(str == _T("medPurple"))		{RGB = 0x9370DB; break;} 
						if(str == _T("medSeaGreen"))	{RGB = 0x3CB371; break;} 
						if(str == _T("medSlateBlue"))	{RGB = 0x7B68EE; break;} 
						if(str == _T("medSpringGreen"))	{RGB = 0x00FA9A; break;} 
						if(str == _T("medTurquoise"))	{RGB = 0x48D1CC; break;} 
						if(str == _T("medVioletRed"))	{RGB = 0xC71585; break;} 
						if(str == _T("midnightBlue"))	{RGB = 0x191970; break;} 
						if(str == _T("mintCream"))		{RGB = 0xF5FFFA; break;} 
						if(str == _T("mistyRose"))		{RGB = 0xFFE4FF; break;} 
						if(str == _T("moccasin"))		{RGB = 0xFFE4B5; break;} 
						break;
					case 'n':
						if(str == _T("navajoWhite"))	{RGB = 0xFFDEAD; break;} 
						if(str == _T("navy"))			{RGB = 0x000080; break;} 
						break;
					case 'o':
						if(str == _T("oldLace"))		{RGB = 0xFDF5E6; break;} 
						if(str == _T("olive"))			{RGB = 0x808000; break;} 
						if(str == _T("oliveDrab"))		{RGB = 0x6B8E23; break;} 
						if(str == _T("orange"))			{RGB = 0xFFA500; break;} 
						if(str == _T("orangeRed"))		{RGB = 0xFF4500; break;} 
						if(str == _T("orchid"))			{RGB = 0xDA70D6; break;} 
						break;
					case 'p':
						if(str == _T("paleGoldenrod"))	{RGB = 0xEEE8AA; break;} 
						if(str == _T("paleGreen"))		{RGB = 0x98FB98; break;} 
						if(str == _T("paleTurquoise"))	{RGB = 0xAFEEEE; break;} 
						if(str == _T("paleVioletRed"))	{RGB = 0xDB7093; break;} 
						if(str == _T("papayaWhip"))		{RGB = 0xFFEFD5; break;} 
						if(str == _T("peachPuff"))		{RGB = 0xFFDAB9; break;} 
						if(str == _T("peru"))			{RGB = 0xCD853F; break;} 
						if(str == _T("pink"))			{RGB = 0xFFC0CB; break;} 
						if(str == _T("plum"))			{RGB = 0xD3A0D3; break;} 
						if(str == _T("powderBlue"))		{RGB = 0xB0E0E6; break;} 
						if(str == _T("purple"))			{RGB = 0x800080; break;} 
						break;
					case 'r':
						if(str == _T("red"))			{RGB = 0xFF0000; break;} 
						if(str == _T("rosyBrown"))		{RGB = 0xBC8F8F; break;} 
						if(str == _T("royalBlue"))		{RGB = 0x4169E1; break;} 
						break;
					case 's':
						if(str == _T("saddleBrown"))	{RGB = 0x8B4513; break;} 
						if(str == _T("salmon"))			{RGB = 0xFA8072; break;} 
						if(str == _T("sandyBrown"))		{RGB = 0xF4A460; break;} 
						if(str == _T("seaGreen"))		{RGB = 0x2E8B57; break;} 
						if(str == _T("seaShell"))		{RGB = 0xFFF5EE; break;} 
						if(str == _T("sienna"))			{RGB = 0xA0522D; break;} 
						if(str == _T("silver"))			{RGB = 0xC0C0C0; break;} 
						if(str == _T("skyBlue"))		{RGB = 0x87CEEB; break;} 
						if(str == _T("slateBlue"))		{RGB = 0x6A5AEB; break;} 
						if(str == _T("slateGray"))		{RGB = 0x708090; break;} 
						if(str == _T("slateGrey"))		{RGB = 0x708090; break;} 
						if(str == _T("snow"))			{RGB = 0xFFFAFA; break;} 
						if(str == _T("springGreen"))	{RGB = 0x00FF7F; break;} 
						if(str == _T("steelBlue"))		{RGB = 0x4682B4; break;} 
						break;
					case 't':
						if(str == _T("tan"))			{RGB = 0xD2B48C; break;} 
						if(str == _T("teal"))			{RGB = 0x008080; break;} 
						if(str == _T("thistle"))		{RGB = 0xD8BFD8; break;} 
						if(str == _T("tomato"))			{RGB = 0xFF7347; break;} 
						if(str == _T("turquoise"))		{RGB = 0x40E0D0; break;} 
						break;
					case 'v':
						if(str == _T("violet"))			{RGB = 0xEE82EE; break;} 
						break;
					case 'w':
						if(str == _T("wheat"))			{RGB = 0xF5DEB3; break;} 
						if(str == _T("white"))			{RGB = 0xFFFFFF; break;} 
						if(str == _T("whiteSmoke"))		{RGB = 0xF5F5F5; break;} 
						break;
					case 'y':
						if(str == _T("yellow"))			{RGB = 0xFFFF00; break;} 
						if(str == _T("yellowGreen"))	{RGB = 0x9ACD32; break;} 
						break;
					}
				}

				blue	= static_cast<unsigned char>(RGB & 0xFF);
				green	= static_cast<unsigned char>((RGB & 0xFF00)>>8);
				red		= static_cast<unsigned char>((RGB & 0xFF0000)>>16);
			}
		protected:
			Limit::PrstClrVal val;
		protected:
			virtual void FillParentPointersForChilds(){};

			friend class UniColor;
		};
	} 
} 

#endif // PPTX_LOGIC_PRSTCLR_INCLUDE_H