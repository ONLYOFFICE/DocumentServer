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
#ifndef PPTX_LOGIC_TEXTFIT_INCLUDE_H_
#define PPTX_LOGIC_TEXTFIT_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class TextFit : public WrapperWritingElement
		{
		public:
			enum eFit {FitEmpty = 0, FitNo = 1, FitSpAuto = 2, FitNormAuto = 3};

			PPTX_LOGIC_BASE(TextFit)

			virtual bool is_init(){return (type != FitEmpty);};

		public:
			void GetTextFitFrom(XmlUtils::CXmlNode& element)
			{
				type = FitEmpty;

				XmlUtils::CXmlNode oNode;
				if (element.GetNode(_T("a:noAutofit"), oNode))
					type = FitNo;
				else if (element.GetNode(_T("a:spAutoFit"), oNode))
					type = FitSpAuto;
				else if (element.GetNode(_T("a:normAutofit"), oNode))
				{
					type = FitNormAuto;

					nullable_string sFontScale;
					nullable_string sLnSpcRed;

					oNode.ReadAttributeBase(L"fontScale", sFontScale);
					oNode.ReadAttributeBase(L"lnSpcReduction", sLnSpcRed);

					if (sFontScale.is_init())
					{
						int nFound = sFontScale->ReverseFind(TCHAR('%'));
						if (nFound < 0)
							fontScale = *sFontScale;
						else
						{
							CString sRet = sFontScale->Mid(0, nFound);
							double dRet = XmlUtils::GetDouble(sRet);
							int val = (int)(dRet * 1000);
							fontScale = val;
						}
					}

					if (sLnSpcRed.is_init())
					{
						int nFound = sLnSpcRed->ReverseFind(TCHAR('%'));
						if (nFound < 0)
							lnSpcReduction = *sLnSpcRed;
						else
						{
							CString sRet = sLnSpcRed->Mid(0, nFound);
							double dRet = XmlUtils::GetDouble(sRet);
							int val = (int)(dRet * 1000);
							lnSpcReduction = val;
						}
					}
				}
			}

			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				type = FitEmpty;

				CString strName = XmlUtils::GetNameNoNS(node.GetName());

				if (_T("a:noAutofit") == strName)
					type = FitNo;
				else if (_T("a:spAutoFit") == strName)
					type = FitSpAuto;
				else if (_T("a:normAutofit") == strName)
				{
					type = FitNormAuto;

					nullable_string sFontScale;
					nullable_string sLnSpcRed;

					node.ReadAttributeBase(L"fontScale", sFontScale);
					node.ReadAttributeBase(L"lnSpcReduction", sLnSpcRed);

					if (sFontScale.is_init())
					{
						int nFound = sFontScale->ReverseFind(TCHAR('%'));
						if (nFound < 0)
							fontScale = *sFontScale;
						else
						{
							CString sRet = sFontScale->Mid(0, nFound);
							double dRet = XmlUtils::GetDouble(sRet);
							int val = (int)(dRet * 1000);
							fontScale = val;
						}
					}

					if (sLnSpcRed.is_init())
					{
						int nFound = sLnSpcRed->ReverseFind(TCHAR('%'));
						if (nFound < 0)
							lnSpcReduction = *sLnSpcRed;
						else
						{
							CString sRet = sLnSpcRed->Mid(0, nFound);
							double dRet = XmlUtils::GetDouble(sRet);
							int val = (int)(dRet * 1000);
							lnSpcReduction = val;
						}
					}
				}
			}
			virtual CString toXML() const
			{
				if (type == FitNo)
					return _T("<a:noAutofit/>");

				if (type == FitSpAuto)
					return _T("<a:spAutoFit/>");

				if (type == FitNormAuto)
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("fontScale"), fontScale);
					oAttr.Write(_T("lnSpcReduction"), lnSpcReduction);

					return XmlUtils::CreateNode(_T("a:normAutofit"), oAttr);
				}

				return _T("");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (type == FitNo)
				{
					pWriter->WriteString(_T("<a:noAutofit/>"));
					return;
				}

				if (type == FitSpAuto)
				{
					pWriter->WriteString(_T("<a:spAutoFit/>"));
					return;
				}

				if (type == FitNormAuto)
				{
					pWriter->StartNode(_T("a:normAutofit"));

					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("fontScale"), fontScale);
					pWriter->WriteAttribute(_T("lnSpcReduction"), lnSpcReduction);
					pWriter->EndAttributes();

					pWriter->EndNode(_T("a:normAutofit"));
				}				
			}

			void Merge(TextFit& fit)const
			{
				if(type != FitEmpty)
				{
					if((type == FitNo) || (type == FitSpAuto))
					{
						fit.type = type;
						fit.fontScale.reset();
						fit.lnSpcReduction.reset();
					}
					else if(type == FitNormAuto)
					{
						fit.type = type;
						if(fontScale.is_init())
							fit.fontScale = *fontScale;
						if(lnSpcReduction.is_init())
							fit.lnSpcReduction = *lnSpcReduction;
					}
				}
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt1(0, type);
				pWriter->WriteInt2(1, fontScale);
				pWriter->WriteInt2(2, lnSpcReduction);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
			}

		public:
			eFit			type;
			nullable_int	fontScale;
			nullable_int	lnSpcReduction;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_TEXTFIT_INCLUDE_H