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
 #include "./stdafx.h"

#include "UniColor.h"
#include "Colors/SrgbClr.h"
#include "Colors/PrstClr.h"
#include "Colors/SchemeClr.h"
#include "Colors/SysClr.h"

namespace PPTX
{
	namespace Logic
	{

		UniColor::UniColor()
		{
		}


		UniColor::~UniColor()
		{
			
		}
	

		UniColor::UniColor(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}


		const UniColor& UniColor::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}


		void UniColor::fromXML(XmlUtils::CXmlNode& node)
		{
			CString name = XmlUtils::GetNameNoNS(node.GetName());

			if (name == _T("a:srgbClr"))
				Color.reset(new Logic::SrgbClr(node));
			else if (name == _T("a:prstClr"))
				Color.reset(new Logic::PrstClr(node));
			else if (name == _T("a:schemeClr"))
				Color.reset(new Logic::SchemeClr(node));
			else if (name == _T("a:sysClr"))
				Color.reset(new Logic::SysClr(node));
			else Color.reset();
		}

		void UniColor::fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			LONG _len = pReader->GetLong();
			LONG read_end = pReader->GetPos() + _len;

			if (pReader->GetPos() < read_end)
			{
				BYTE _type = pReader->GetUChar();
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				switch (_type)
				{
					case COLOR_TYPE_PRST:
					{
						pReader->Skip(2);
						Logic::PrstClr* pColor = new Logic::PrstClr();
						pColor->val.set(pReader->GetString2());
						pReader->Skip(1);

						Color = pColor;
						if (pReader->GetPos() < _e)
						{
							if (0 == pReader->GetUChar())
							{
								Color->ReadModsFromPPTY(pReader);
							}
						}

						break;
					}
					case COLOR_TYPE_SCHEME:
					{
						pReader->Skip(2);
						Logic::SchemeClr* pColor = new Logic::SchemeClr();
						pColor->val.set(SchemeClr_GetStringCode(pReader->GetUChar()));
						
						Color = pColor;

						pReader->Skip(1);

						if (pReader->GetPos() < _e)
						{
							if (0 == pReader->GetUChar())
							{
								Color->ReadModsFromPPTY(pReader);
							}
						}

						break;
					}
					case COLOR_TYPE_SRGB:
					{
						pReader->Skip(1);
						Color = new Logic::SrgbClr();
						pReader->Skip(1);
						Color->red = pReader->GetUChar();
						pReader->Skip(1);
						Color->green = pReader->GetUChar();
						pReader->Skip(1);
						Color->blue = pReader->GetUChar();
						pReader->Skip(1);

						if (pReader->GetPos() < _e)
						{
							if (0 == pReader->GetUChar())
							{
								Color->ReadModsFromPPTY(pReader);
							}
						}

						break;
					}
					case COLOR_TYPE_SYS:
					{
						pReader->Skip(1);
						Logic::SysClr* pColor = new Logic::SysClr();

						while (true)
						{
							BYTE _at = pReader->GetUChar();
							if (_at == NSBinPptxRW::g_nodeAttributeEnd)
								break;

							switch (_at)
							{
								case 0:
								{
									pColor->val = pReader->GetString2();
									break;
								}
								case 1:
								{
									pColor->red = pReader->GetUChar();
									break;
								}
								case 2:
								{
									pColor->green = pReader->GetUChar();
									break;
								}
								case 3:
								{
									pColor->blue = pReader->GetUChar();
									break;
								}
								default:
									break;
							}
						}

						Color = pColor;

						if (pReader->GetPos() < _e)
						{
							if (0 == pReader->GetUChar())
							{
								Color->ReadModsFromPPTY(pReader);
							}
						}

						break;
					}
				}
			}

			pReader->Seek(read_end);
		}

		void UniColor::GetColorFrom(XmlUtils::CXmlNode& element)
		{
			XmlUtils::CXmlNode oNode;
			if (element.GetNode(_T("a:srgbClr"), oNode))
				Color.reset(new Logic::SrgbClr(oNode));
			else if (element.GetNode(_T("a:prstClr"), oNode))
				Color.reset(new Logic::PrstClr(oNode));
			else if (element.GetNode(_T("a:schemeClr"), oNode))
				Color.reset(new Logic::SchemeClr(oNode));
			else if (element.GetNode(_T("a:sysClr"), oNode))
				Color.reset(new Logic::SysClr(oNode));
			else Color.reset();
		}

		CString UniColor::toXML() const
		{
			if (Color.IsInit())
				return Color->toXML();
			return _T("");
		}

		DWORD UniColor::GetRGBA(DWORD RGBA)const
		{
			if(is_init())
				return Color->GetRGBA(RGBA);
			return 0; 
		}

		DWORD UniColor::GetARGB(DWORD ARGB)const
		{
			if(is_init())
				return Color->GetARGB(ARGB);
			return 0; 
		}

		DWORD UniColor::GetBGRA(DWORD BGRA)const
		{
			if(is_init())
				return Color->GetBGRA(BGRA);
			return 0; 
		}

		DWORD UniColor::GetABGR(DWORD ABGR)const
		{
			if(is_init())
				return Color->GetABGR(ABGR);
			return 0; 
		}

	} 
} // namespace PPTX