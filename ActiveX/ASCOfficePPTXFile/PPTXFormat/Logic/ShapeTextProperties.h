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
#ifndef PPTX_LOGIC_SHAPETEXTPROPERTIES_INCLUDE_H_
#define PPTX_LOGIC_SHAPETEXTPROPERTIES_INCLUDE_H_

#include "RunProperties.h"
#include "TextListStyle.h"
#include "TxBody.h"
#include "FontRef.h"
#include "TextParagraphPr.h"
#include "BodyPr.h"
#include "TextFont.h"

namespace PPTX
{
	namespace Logic
	{
		class CFontInfo
		{
		public:
			LONG	FontRef;
			CString	strFontName;
			CString strPanose;
			CString strPitchFamily;
			BYTE	Charset;

		public:
			CFontInfo()
			{
				FontRef			= -1;
				strFontName		= _T("");
				strPanose		= _T("");
				strPitchFamily	= _T("");
				Charset			= 0;
			}
			CFontInfo(const CFontInfo& oSrc)
			{
				*this = oSrc;
			}
			CFontInfo& operator=(const CFontInfo& oSrc)
			{
				FontRef			= oSrc.FontRef;
				strFontName		= oSrc.strFontName;
				strPanose		= oSrc.strPanose;
				strPitchFamily	= oSrc.strPitchFamily;
				Charset			= oSrc.Charset;

				return *this;
			}
		};

		class CShapeTextProperties
		{
		public:
			CShapeTextProperties();
			virtual ~CShapeTextProperties();

		private:
			nullable<FontRef>			m_FontStyle;
			LONG						m_lTextType;
			nullable<TextParagraphPr>	m_levels[10];
			nullable<TextParagraphPr>	m_body[10];
			BodyPr bodyPr;

			
			CAtlArray<nullable<TextParagraphPr>*>*	m_masters;

			TextFont					MajorLatin;
			TextFont					MinorLatin;

			bool						m_bIsFontRefFromSlide;
			int							m_lMasterTextSize; 

			bool						m_bIsSlideShape;

			const WrapperFile*			m_pFile;

		public:
			void FillTextType(const LONG& lTextMasterType);
			void FillFromTextBody(const nullable<TxBody>& Src, const nullable<TextParagraphPr>* bodyStyles);
			void FillFontRef(const FontRef& Src, const bool& bIsSlideProperty);
			void FillMasterFontSize(int size);

			__forceinline void SetMajorLatin(const TextFont& mjltFont){MajorLatin = mjltFont;};
			__forceinline void SetMinorLatin(const TextFont& mnltFont){MinorLatin = mnltFont;};

			__forceinline void SetMasterStyles(CAtlArray<nullable<TextParagraphPr>*>* pStyles) { m_masters = pStyles; }

			__forceinline nullable<TextParagraphPr>* GetLevels()
			{ 
				if (!m_bIsSlideShape) 
					return NULL;
				return m_levels; 
			}
			__forceinline nullable<TextParagraphPr>* GetLevelsBody() { return m_body; }
			__forceinline LONG GetTextType() { return m_lTextType; }
			__forceinline LONG GetFontRef(bool& bIsSlideSetUp) 
			{
				bIsSlideSetUp = m_bIsFontRefFromSlide;

				if (m_FontStyle.is_init() && m_FontStyle->idx.is_init())
				{
					return (m_FontStyle->idx->get() == _T("minor")) ? 1 : 0;
				}
				return -1;
			}

			CString GetAnchor()const{return bodyPr.anchor.get_value_or(_T("t"));};

			nullable_base<WORD> GetParagraphAlgn		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<LONG>	GetParagraphLeftMargin	(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<LONG> GetParagraphIndent		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<LONG> GetParagraphDefTabSz	(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<WORD> GetParagraphFontAlgn	(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<WORD> GetParagraphLatinLnBrk	(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<WORD> GetParagraphRtl			(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<LONG> GetParagraphLnSpc		(int level, const nullable<TextParagraphPr>& pParagraph, const double& LnSpcReduction)const;
			nullable_base<LONG> GetParagraphSpcAft		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<LONG> GetParagraphSpcBef		(int level, const nullable<TextParagraphPr>& pParagraph)const;

			nullable_base<BOOL>	GetHasBullet			(int level, const nullable<TextParagraphPr>& pParagraph)const;

			nullable_base<BOOL> GetRunBold				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<BOOL> GetRunItalic			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<BOOL> GetRunUnderline			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<BOOL> GetRunStrike			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<WORD> GetRunCap				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<double> GetRunBaseline		(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			nullable_base<WORD> GetRunSize				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph, const double& FontScale)const;

			nullable_base<CFontInfo> GetRunFont			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;

			PPTX::Logic::UniColor	GetColor(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			PPTX::Logic::UniColor	GetColorBullet(int level, const nullable<TextParagraphPr>& pParagraph)const;

			DWORD GetHyperlinkRGBA()const;
			DWORD GetHyperlinkARGB()const;
			DWORD GetHyperlinkBGRA()const;
			DWORD GetHyperlinkABGR()const;

			void SetParentFilePointer(const WrapperFile* pFile);
		};
	} 
} 

#endif // PPTX_LOGIC_SHAPETEXTPROPERTIES_INCLUDE_H_