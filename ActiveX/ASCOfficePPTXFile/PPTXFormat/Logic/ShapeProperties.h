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
#ifndef PPTX_LOGIC_SHAPEPROPERTIES_INCLUDE_H_
#define PPTX_LOGIC_SHAPEPROPERTIES_INCLUDE_H_

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

		class ShapeProperties
		{
		public:
			ShapeProperties();
			virtual ~ShapeProperties();

		private:
			nullable<FontRef>			fontStyle;
			nullable<TextParagraphPr>	levels[10];
			nullable<TextParagraphPr>	masters[10];
			BodyPr bodyPr;

			
			
			TextFont					MajorLatin;
			TextFont					MinorLatin;

			DWORD						m_nTextType;

		public:

			void SetTextType(DWORD dwType) { m_nTextType = 0; }
			DWORD GetTextType()const { return m_nTextType; }
			void FillFromTextListStyle(const nullable<TextListStyle>& Src);
			void FillFromTextListStyle(const TextListStyle& Src);
			void FillFromTextBody(const nullable<TxBody>& Src);
			void FillFontRef(const FontRef& Src);
			void FillMasterFontSize(int size);

			
			
			void SetMajorLatin(const TextFont& mjltFont){MajorLatin = mjltFont;};
			void SetMinorLatin(const TextFont& mnltFont){MinorLatin = mnltFont;};

			CString GetAnchor()const{return bodyPr.anchor.get_value_or(_T("t"));};

			CString GetParagraphAlgn		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int	GetParagraphLeftMargin		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int GetParagraphIndent			(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int GetParagraphDefTabSz		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			CString GetParagraphFontAlgn	(int level, const nullable<TextParagraphPr>& pParagraph)const;
			bool GetParagraphLatinLnBrk		(int level, const nullable<TextParagraphPr>& pParagraph)const;
			bool GetParagraphRtl			(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int GetParagraphLnSpc			(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int GetParagraphSpcAft			(int level, const nullable<TextParagraphPr>& pParagraph)const;
			int GetParagraphSpcBef			(int level, const nullable<TextParagraphPr>& pParagraph)const;

			bool HasParagraphBullet			(int level, const nullable<TextParagraphPr>& pParagraph)const;

			bool GetRunBold					(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			bool GetRunItalic				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			CString GetRunUnderline			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			CString GetRunStrike			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			CString GetRunCap				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			int GetRunBaseline				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			int GetRunSize					(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			int GetRunSize					(int level)const;

			CString	GetRunFont				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph, LONG& lFontIndex)const;
			CString GetRunPanose			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			BYTE GetRunCharset				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			BYTE GetRunPitchFamily			(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;

			DWORD GetRunRGBA				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			DWORD GetRunARGB				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			DWORD GetRunBGRA				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;
			DWORD GetRunABGR				(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const;

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

#endif // PPTX_LOGIC_SHAPEPROPERTIES_INCLUDE_H