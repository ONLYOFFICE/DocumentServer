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
#ifndef PPTX_LOGIC_SYSCLR_INCLUDE_H_
#define PPTX_LOGIC_SYSCLR_INCLUDE_H_

#include "ColorBase.h"
#include "./../../Limit/SysClrVal.h"

namespace PPTX
{
	namespace Logic
	{
		class SysClr : public ColorBase
		{
		public:
			PPTX_LOGIC_BASE(SysClr)

			virtual DWORD GetRGBA(DWORD RGBA) const
			{
				SysClr* pColor = const_cast<SysClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetRGBA(RGBA);
			}

			virtual DWORD GetARGB(DWORD ARGB) const
			{
				SysClr* pColor = const_cast<SysClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetARGB(ARGB);
			}

			virtual DWORD GetBGRA(DWORD BGRA) const
			{
				SysClr* pColor = const_cast<SysClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetBGRA(BGRA);
			}

			virtual DWORD GetABGR(DWORD ABGR) const
			{
				SysClr* pColor = const_cast<SysClr*>(this);
				pColor->FillRGBFromVal();
				return ColorBase::GetABGR(ABGR);
			}
		private:
			void FillRGBFromVal()
			{
				DWORD RGB = 0;
				CString str = val.get();
				if(str != "")
				{
					switch((CHAR)str[0])
					{
					case '3':
						if(str == _T("3dDkShadow")) { RGB = ::GetSysColor(COLOR_3DDKSHADOW); break;}
						if(str == _T("3dLight")) { RGB = ::GetSysColor(COLOR_3DLIGHT); break;}
						break;
					case 'a':
						if(str == _T("activeBorder")) { RGB = ::GetSysColor(COLOR_ACTIVEBORDER); break;}
						if(str == _T("activeCaption")) { RGB = ::GetSysColor(COLOR_ACTIVECAPTION); break;}
						if(str == _T("appWorkspace")) { RGB = ::GetSysColor(COLOR_APPWORKSPACE); break;}
						break;
					case 'b':
						if(str == _T("background")) { RGB = ::GetSysColor(COLOR_BACKGROUND); break;}
						if(str == _T("btnFace")) { RGB = ::GetSysColor(COLOR_BTNFACE); break;}
						if(str == _T("btnHighlight")) { RGB = ::GetSysColor(COLOR_BTNHIGHLIGHT); break;}
						if(str == _T("btnShadow")) { RGB = ::GetSysColor(COLOR_BTNSHADOW); break;}
						if(str == _T("btnText")) { RGB = ::GetSysColor(COLOR_BTNTEXT); break;}
						break;
					case 'c':
						if(str == _T("captionText")) { RGB = ::GetSysColor(COLOR_CAPTIONTEXT); break;}
						break;
					case 'g':
						if(str == _T("gradientActiveCaption")) { RGB = ::GetSysColor(COLOR_GRADIENTACTIVECAPTION); break;}
						if(str == _T("gradientInactiveCaption")) { RGB = ::GetSysColor(COLOR_GRADIENTINACTIVECAPTION); break;}
						if(str == _T("grayText")) { RGB = ::GetSysColor(COLOR_GRAYTEXT); break;}
						break;
					case 'h':
						if(str == _T("highlight")) { RGB = ::GetSysColor(COLOR_HIGHLIGHT); break;}
						if(str == _T("highlightText")) { RGB = ::GetSysColor(COLOR_HIGHLIGHTTEXT); break;}
						if(str == _T("hotLight")) { RGB = ::GetSysColor(COLOR_HOTLIGHT); break;}
						break;
					case 'i':
						if(str == _T("inactiveBorder")) { RGB = ::GetSysColor(COLOR_INACTIVEBORDER); break;}
						if(str == _T("inactiveCaption")) { RGB = ::GetSysColor(COLOR_INACTIVECAPTION); break;}
						if(str == _T("inactiveCaptionText")) { RGB = ::GetSysColor(COLOR_INACTIVECAPTIONTEXT); break;}
						if(str == _T("infoBk")) { RGB = ::GetSysColor(COLOR_INFOBK); break;}
						if(str == _T("infoText")) { RGB = ::GetSysColor(COLOR_INFOTEXT); break;}
						break;
					case 'm':
						if(str == _T("menu")) { RGB = ::GetSysColor(COLOR_MENU); break;}
						if(str == _T("menuBar")) { RGB = ::GetSysColor(COLOR_MENUBAR); break;}
						if(str == _T("menuHighlight")) { RGB = ::GetSysColor(COLOR_MENUHILIGHT); break;}
						if(str == _T("menuText")) { RGB = ::GetSysColor(COLOR_MENUTEXT); break;}
						break;
					case 's':
						if(str == _T("scrollBar")) { RGB = ::GetSysColor(COLOR_SCROLLBAR); break;}
						break;
					case 'w':
						if(str == _T("window")) { RGB = ::GetSysColor(COLOR_WINDOW); break;}
						if(str == _T("windowFrame")) { RGB = ::GetSysColor(COLOR_WINDOWFRAME); break;}
						if(str == _T("windowText")) { RGB = ::GetSysColor(COLOR_WINDOWTEXT); break;}
						break;
					}
				}
				blue	= static_cast<unsigned char>(RGB & 0xFF);
				green	= static_cast<unsigned char>((RGB & 0xFF00)>>8);
				red		= static_cast<unsigned char>((RGB & 0xFF0000)>>16);
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				val = node.GetAttribute(_T("val"));
				Modifiers.RemoveAll();
				node.LoadArray(_T("*"), Modifiers);
			}


			virtual CString toXML() const
			{
				CString str = _T("");
				str.Format(_T("%.02X%.02X%.02X"), red, green, blue);
				
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("val"), val.get());
				oAttr.Write(_T("lastClr"), str);

				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(Modifiers);

				return XmlUtils::CreateNode(_T("a:sysClr"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:sysClr"));
						
				CString str = _T("");
				str.Format(_T("%.02X%.02X%.02X"), red, green, blue);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("val"), val.get());
				pWriter->WriteAttribute(_T("lastClr"), str);
				pWriter->EndAttributes();

				size_t nCount = Modifiers.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Modifiers[i].toXmlWriter(pWriter);
				
				pWriter->EndNode(_T("a:sysClr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(COLOR_TYPE_SYS);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, val.get());

				SysClr* pColor = const_cast<SysClr*>(this);
				pColor->FillRGBFromVal();

				pWriter->WriteBYTE(1);
				pWriter->WriteBYTE(red);
				pWriter->WriteBYTE(2);
				pWriter->WriteBYTE(green);
				pWriter->WriteBYTE(3);
				pWriter->WriteBYTE(blue);

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

		protected:
			Limit::SysClrVal val;
		protected:
			virtual void FillParentPointersForChilds(){};

			friend class UniColor;
		};
	} 
} 

#endif // PPTX_LOGIC_SYSCLR_INCLUDE_H