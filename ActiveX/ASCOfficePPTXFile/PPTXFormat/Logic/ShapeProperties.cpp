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

#include "ShapeProperties.h"
#include "Fills/SolidFill.h"
#include "Fills/GradFill.h"
#include "../Slide.h"
#include "../SlideLayout.h"
#include "../SlideMaster.h"

namespace PPTX
{
	namespace Logic
	{

		int GetIntegerFromHex(const CString& string)
		{
			return XmlUtils::GetInteger(string);
		}

		ShapeProperties::ShapeProperties()
		{
			for(int i = 0; i < 10; i++)
			{
				TextParagraphPr ppr;
				RunProperties rpr;
				ppr.defRPr = rpr;

				levels[i]	= ppr;
				masters[i]	= ppr;
			}
			m_nTextType = 0;
		}

		ShapeProperties::~ShapeProperties()
		{
		}

		void ShapeProperties::FillFromTextBody(const nullable<TxBody>& Src)
		{
			if(Src.IsInit())
			{
				Src->bodyPr.Merge(bodyPr);
				if(Src->lstStyle.IsInit())
				{
					for(int i = 0; i < 10; i++)
					{
						if(Src->lstStyle->levels[i].IsInit())
							Src->lstStyle->levels[i]->Merge(levels[i]);
					}
				}
			}
		}

		void ShapeProperties::FillFromTextListStyle(const nullable<TextListStyle>& Src)
		{
			if(Src.IsInit())
			{
				for(int i = 0; i < 10; i++)
				{
					if(Src->levels[i].IsInit())
						Src->levels[i]->Merge(masters[i]);
				}
			}
		}

		void ShapeProperties::FillFromTextListStyle(const TextListStyle& Src)
		{
			for(int i = 0; i < 10; i++)
			{
				if(Src.levels[i].IsInit())
					Src.levels[i]->Merge(masters[i]);
			}
		}

		void ShapeProperties::FillFontRef(const FontRef& Src)
		{
			fontStyle = Src;
		}

		void ShapeProperties::FillMasterFontSize(int size)
		{
			for(int i = 0; i < 10; i++)
			{
				if(masters[i]->defRPr.IsInit())
					masters[i]->defRPr->sz = size;
				else
				{
					PPTX::Logic::RunProperties rpr;
					rpr.sz = size;
					masters[i]->defRPr = rpr;
				}
			}
		}

		CString ShapeProperties::GetParagraphAlgn(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->algn.IsInit())
					return pParagraph->algn->get();
			
			

			if (levels[level]->algn.is_init())
				return levels[level]->algn.get_value();
			
			if (masters[level]->algn.is_init())
				return masters[level]->algn.get_value();
			return _T("l");
		}

		int	ShapeProperties::GetParagraphLeftMargin(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->marL.IsInit())
					return pParagraph->marL.get();
			
			

			if (levels[level]->marL.is_init())
				return levels[level]->marL.get();
			
			if (masters[level]->marL.is_init())
				return masters[level]->marL.get();
			return 0;
		}

		int ShapeProperties::GetParagraphIndent(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->indent.IsInit())
					return pParagraph->indent.get();
			
			

			if (levels[level]->indent.is_init())
				return levels[level]->indent.get();
			
			if (masters[level]->indent.is_init())
				return masters[level]->indent.get();
			return 0;
		}

		int ShapeProperties::GetParagraphDefTabSz(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->defTabSz.IsInit())
					return pParagraph->defTabSz.get();
			
			

			if (levels[level]->defTabSz.is_init())
				return levels[level]->defTabSz.get();
			
			if (masters[level]->defTabSz.is_init())
				return masters[level]->defTabSz.get();
			return 376300;
		}

		CString ShapeProperties::GetParagraphFontAlgn(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->fontAlgn.IsInit())
					return pParagraph->fontAlgn->get();
			
			

			if (levels[level]->fontAlgn.is_init())
				return levels[level]->fontAlgn.get_value();
			
			if (masters[level]->fontAlgn.is_init())
				return masters[level]->fontAlgn.get_value();
			return _T("base");
		}

		bool ShapeProperties::GetParagraphLatinLnBrk(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->latinLnBrk.IsInit())
					return pParagraph->latinLnBrk.get();
			
			

			if (levels[level]->latinLnBrk.is_init())
				return levels[level]->latinLnBrk.get();
			
			if (masters[level]->latinLnBrk.is_init())
				return masters[level]->latinLnBrk.get();
			return false;
		}

		bool ShapeProperties::GetParagraphRtl(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->rtl.IsInit())
					return pParagraph->rtl.get();
			
			

			if (levels[level]->rtl.is_init())
				return levels[level]->rtl.get();
			
			if (masters[level]->rtl.is_init())
				return masters[level]->rtl.get();
			return false;
		}

		int ShapeProperties::GetParagraphLnSpc(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->lnSpc.IsInit())
					return pParagraph->lnSpc->GetVal();

			if(levels[level]->lnSpc.IsInit())
				return levels[level]->lnSpc->GetVal();
			if(masters[level]->lnSpc.IsInit())
				return masters[level]->lnSpc->GetVal();
			return 100;
		}

		int ShapeProperties::GetParagraphSpcAft(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->spcAft.IsInit())
					return pParagraph->spcAft->GetVal();

			if(levels[level]->spcAft.IsInit())
				return levels[level]->spcAft->GetVal();
			if(masters[level]->spcAft.IsInit())
				return masters[level]->spcAft->GetVal();
			return 0;
		}

		int ShapeProperties::GetParagraphSpcBef(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->spcBef.IsInit())
					return pParagraph->spcBef->GetVal();

			if(levels[level]->spcBef.IsInit())
				return levels[level]->spcBef->GetVal();
			if(masters[level]->spcBef.IsInit())
				return masters[level]->spcBef->GetVal();
			return 0;
		}

		bool ShapeProperties::HasParagraphBullet(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
				if(pParagraph->ParagraphBullet.is_init())
					return pParagraph->ParagraphBullet.has_bullet();
			
			if(levels[level]->ParagraphBullet.is_init())
				return levels[level]->ParagraphBullet.has_bullet();

			return masters[level]->ParagraphBullet.has_bullet();
		}

		bool ShapeProperties::GetRunBold(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.IsInit())
				if(pRun->b.IsInit())
					return pRun->b.get();
			if(pParagraph.IsInit())
				if(pParagraph->defRPr.IsInit())
					if(pParagraph->defRPr->b.IsInit())
						return pParagraph->defRPr->b.get();
			
			

			if (levels[level]->defRPr->b.is_init())
				return levels[level]->defRPr->b.get();
			
			if (masters[level]->defRPr->b.is_init())
				return masters[level]->defRPr->b.get();
			return false;
		}

		bool ShapeProperties::GetRunItalic(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.IsInit())
				if(pRun->i.IsInit())
					return pRun->i.get();
			if(pParagraph.IsInit())
				if(pParagraph->defRPr.IsInit())
					if(pParagraph->defRPr->i.IsInit())
						return pParagraph->defRPr->i.get();
			
			

			if (levels[level]->defRPr->i.is_init())
				return levels[level]->defRPr->i.get();
			
			if (masters[level]->defRPr->i.is_init())
				return masters[level]->defRPr->i.get();
			return false;
		}

		CString ShapeProperties::GetRunUnderline(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.IsInit())
				if(pRun->u.IsInit())
					return pRun->u->get();
			if(pParagraph.IsInit())
				if(pParagraph->defRPr.IsInit())
					if(pParagraph->defRPr->u.IsInit())
						return pParagraph->defRPr->u->get();
			

			if (levels[level]->defRPr->u.is_init())
				return levels[level]->defRPr->u.get_value();
			
			if (masters[level]->defRPr->u.is_init())
				return masters[level]->defRPr->u.get_value();
			return _T("none");
		}

		CString ShapeProperties::GetRunStrike(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.IsInit())
				if(pRun->strike.IsInit())
					return pRun->strike->get();
			if(pParagraph.IsInit())
				if(pParagraph->defRPr.IsInit())
					if(pParagraph->defRPr->strike.IsInit())
						return pParagraph->defRPr->strike->get();
			

			if (levels[level]->defRPr->strike.is_init())
				return levels[level]->defRPr->strike.get_value();
			
			if (masters[level]->defRPr->strike.is_init())
				return masters[level]->defRPr->strike.get_value();
			return _T("noStrike");
		}

		CString ShapeProperties::GetRunCap(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
				if(pRun->cap.is_init())
					return pRun->cap->get();
			if(pParagraph.is_init())
				if(pParagraph->defRPr.is_init())
					if(pParagraph->defRPr->cap.is_init())
						return pParagraph->defRPr->cap->get();
			

			if (levels[level]->defRPr->cap.is_init())
				return levels[level]->defRPr->cap.get_value();
			
			if (masters[level]->defRPr->cap.is_init())
				return masters[level]->defRPr->cap.get_value();
			return _T("none");
		}

		int ShapeProperties::GetRunBaseline(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
				if(pRun->baseline.is_init())
					return pRun->baseline.get();
			if(pParagraph.is_init())
				if(pParagraph->defRPr.is_init())
					if(pParagraph->defRPr->baseline.is_init())
						return pParagraph->defRPr->baseline.get();
			
			
			if (levels[level]->defRPr->baseline.is_init())
				return levels[level]->defRPr->baseline.get();
			
			if (masters[level]->defRPr->baseline.is_init())
				return masters[level]->defRPr->baseline.get();
			return 0;
		}

		int ShapeProperties::GetRunSize(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
				if(pRun->sz.is_init())
					return pRun->sz.get();
			if(pParagraph.is_init())
				if(pParagraph->defRPr.is_init())
					if(pParagraph->defRPr->sz.is_init())
						return pParagraph->defRPr->sz.get();
			
			
			
			if (levels[level]->defRPr->sz.is_init())
				return levels[level]->defRPr->sz.get();
			
			if (masters[level]->defRPr->sz.is_init())
				return masters[level]->defRPr->sz.get();
			return 1800;
		}

		int ShapeProperties::GetRunSize(int level)const
		{
			

			if (levels[level]->defRPr->sz.is_init())
				return levels[level]->defRPr->sz.get();
			
			if (masters[level]->defRPr->sz.is_init())
				return masters[level]->defRPr->sz.get();
			return 1800;
		}

		CString ShapeProperties::GetRunFont(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph, LONG& lFontIndex)const
		{
			CString strFontName = _T("");
			if((pRun.is_init()) && (pRun->latin.is_init()))
				strFontName = pRun->latin->typeface;
			else if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()) && (pParagraph->defRPr->latin.is_init()))
				strFontName = pParagraph->defRPr->latin->typeface;
			else
			{
				if(levels[level]->defRPr->latin.is_init())
					strFontName = levels[level]->defRPr->latin->typeface;
				else if(fontStyle.is_init())
					strFontName = (fontStyle->idx->get() == _T("minor"))?_T("+mn-lt"):_T("+mj-lt");
				else if(masters[level]->defRPr->latin.is_init())
					strFontName = masters[level]->defRPr->latin->typeface;
			}
				
			if(strFontName == _T("+mj-lt"))
			{
				strFontName = MajorLatin.typeface;
				lFontIndex	= 0;
			}
			else if(strFontName == _T("+mn-lt"))
			{
				strFontName = MinorLatin.typeface;
				lFontIndex	= 1;
			}
			else if(strFontName == _T(""))
			{
				strFontName = MinorLatin.typeface;
				lFontIndex	= 1;
			}
			return strFontName;
		}

		CString ShapeProperties::GetRunPanose(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			CString panose = _T("");
			CString style = _T("");
			if((pRun.is_init()) && (pRun->latin.is_init()))
				panose = pRun->latin->panose.get_value_or(_T(""));
			else if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()) && (pParagraph->defRPr->latin.is_init()))
				panose = pParagraph->defRPr->latin->panose.get_value_or(_T(""));
			else 
			{
				if(levels[level]->defRPr->latin.is_init())
					panose = levels[level]->defRPr->latin->panose.get_value_or(_T(""));
				else if(fontStyle.is_init())
					style = fontStyle->idx.get_value_or(_T("major"));
				else if(masters[level]->defRPr->latin.is_init())
					panose = masters[level]->defRPr->latin->panose.get_value_or(_T(""));
			}

			if(style == _T("major"))
				panose = MajorLatin.panose.get_value_or(_T(""));
			else if(style == _T("minor"))
				panose = MinorLatin.panose.get_value_or(_T(""));
			return panose;
		}

		BYTE ShapeProperties::GetRunCharset(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			CString charset = _T("");
			CString style = _T("");
			if((pRun.is_init()) && (pRun->latin.is_init()))
				charset = pRun->latin->charset.get_value_or(_T(""));
			else if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()) && (pParagraph->defRPr->latin.is_init()))
				charset = pParagraph->defRPr->latin->charset.get_value_or(_T(""));

			else
			{
				if(levels[level]->defRPr->latin.is_init())
					charset = levels[level]->defRPr->latin->charset.get_value_or(_T(""));
				else if(fontStyle.is_init())
					style = fontStyle->idx.get_value_or(_T("major"));
				else if(masters[level]->defRPr->latin.is_init())
					charset = masters[level]->defRPr->latin->charset.get_value_or(_T(""));
			}

			if(style == _T("major"))
				charset = MajorLatin.charset.get_value_or(_T(""));
			else if(style == _T("minor"))
				charset = MinorLatin.charset.get_value_or(_T(""));
			if(charset == _T(""))
				charset = _T("01");
			return GetIntegerFromHex(charset);
		}

		BYTE ShapeProperties::GetRunPitchFamily(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			CString pitchFamily = _T("");
			CString style = _T("");
			if((pRun.is_init()) && (pRun->latin.is_init()))
				pitchFamily = pRun->latin->pitchFamily.get_value_or(_T(""));
			else if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()) && (pParagraph->defRPr->latin.is_init()))
				pitchFamily = pParagraph->defRPr->latin->pitchFamily.get_value_or(_T(""));
			else 
			{
				if(levels[level]->defRPr->latin.is_init())
					pitchFamily = levels[level]->defRPr->latin->pitchFamily.get_value_or(_T(""));
				else if(fontStyle.is_init())
					style = fontStyle->idx.get_value_or(_T("major"));
				else if(masters[level]->defRPr->latin.is_init())
					pitchFamily = masters[level]->defRPr->latin->pitchFamily.get_value_or(_T(""));
			}

			if(style == _T("major"))
				pitchFamily = MajorLatin.pitchFamily.get_value_or(_T(""));
			else if(style == _T("minor"))
				pitchFamily = MinorLatin.pitchFamily.get_value_or(_T(""));
			if(pitchFamily == _T(""))
				pitchFamily = _T("0");
			return GetIntegerFromHex(pitchFamily);
		}


		DWORD ShapeProperties::GetRunRGBA(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
			{
				if(pRun->Fill.is<SolidFill>())
					return pRun->Fill.as<SolidFill>().Color.GetRGBA();
				if(pRun->Fill.is<GradFill>())
					return pRun->Fill.as<GradFill>().GetFrontColor().GetRGBA();
			}

			if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()))
			{
				if(pParagraph->defRPr->Fill.is<SolidFill>())
					return pParagraph->defRPr->Fill.as<SolidFill>().Color.GetRGBA();
				if(pParagraph->defRPr->Fill.is<GradFill>())
					return pParagraph->defRPr->Fill.as<GradFill>().GetFrontColor().GetRGBA();
			}

			if(levels[level]->defRPr->Fill.is<SolidFill>())
				return levels[level]->defRPr->Fill.as<SolidFill>().Color.GetRGBA();
			if(levels[level]->defRPr->Fill.is<GradFill>())
				return levels[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetRGBA();

			if(fontStyle.is_init())
				return fontStyle->Color.GetRGBA();

			if(masters[level]->defRPr->Fill.is<SolidFill>())
				return masters[level]->defRPr->Fill.as<SolidFill>().Color.GetRGBA();
			if(masters[level]->defRPr->Fill.is<GradFill>())
				return masters[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetRGBA();

			return 0;
		}

		DWORD ShapeProperties::GetRunARGB(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
			{
				if(pRun->Fill.is<SolidFill>())
					return pRun->Fill.as<SolidFill>().Color.GetARGB();
				if(pRun->Fill.is<GradFill>())
					return pRun->Fill.as<GradFill>().GetFrontColor().GetARGB();
			}

			if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()))
			{
				if(pParagraph->defRPr->Fill.is<SolidFill>())
					return pParagraph->defRPr->Fill.as<SolidFill>().Color.GetARGB();
				if(pParagraph->defRPr->Fill.is<GradFill>())
					return pParagraph->defRPr->Fill.as<GradFill>().GetFrontColor().GetARGB();
			}

			if(levels[level]->defRPr->Fill.is<SolidFill>())
				return levels[level]->defRPr->Fill.as<SolidFill>().Color.GetARGB();
			if(levels[level]->defRPr->Fill.is<GradFill>())
				return levels[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetARGB();

			if(fontStyle.is_init())
				return fontStyle->Color.GetARGB();

			if(masters[level]->defRPr->Fill.is<SolidFill>())
				return masters[level]->defRPr->Fill.as<SolidFill>().Color.GetARGB();
			if(masters[level]->defRPr->Fill.is<GradFill>())
				return masters[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetARGB();

			return 0;
		}

		DWORD ShapeProperties::GetRunBGRA(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
			{
				if(pRun->Fill.is<SolidFill>())
					return pRun->Fill.as<SolidFill>().Color.GetBGRA();
				if(pRun->Fill.is<GradFill>())
					return pRun->Fill.as<GradFill>().GetFrontColor().GetBGRA();
			}

			if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()))
			{
				if(pParagraph->defRPr->Fill.is<SolidFill>())
					return pParagraph->defRPr->Fill.as<SolidFill>().Color.GetBGRA();
				if(pParagraph->defRPr->Fill.is<GradFill>())
					return pParagraph->defRPr->Fill.as<GradFill>().GetFrontColor().GetBGRA();
			}

			if(levels[level]->defRPr->Fill.is<SolidFill>())
				return levels[level]->defRPr->Fill.as<SolidFill>().Color.GetBGRA();
			if(levels[level]->defRPr->Fill.is<GradFill>())
				return levels[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetBGRA();

			if(fontStyle.is_init())
				return fontStyle->Color.GetBGRA();

			if(masters[level]->defRPr->Fill.is<SolidFill>())
				return masters[level]->defRPr->Fill.as<SolidFill>().Color.GetBGRA();
			if(masters[level]->defRPr->Fill.is<GradFill>())
				return masters[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetBGRA();

			return 0;
		}

		DWORD ShapeProperties::GetRunABGR(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
			{
				if(pRun->Fill.is<SolidFill>())
					return pRun->Fill.as<SolidFill>().Color.GetABGR();
				if(pRun->Fill.is<GradFill>())
					return pRun->Fill.as<GradFill>().GetFrontColor().GetABGR();
			}

			if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()))
			{
				if(pParagraph->defRPr->Fill.is<SolidFill>())
					return pParagraph->defRPr->Fill.as<SolidFill>().Color.GetABGR();
				if(pParagraph->defRPr->Fill.is<GradFill>())
					return pParagraph->defRPr->Fill.as<GradFill>().GetFrontColor().GetABGR();
			}

			if(levels[level]->defRPr->Fill.is<SolidFill>())
				return levels[level]->defRPr->Fill.as<SolidFill>().Color.GetABGR();
			if(levels[level]->defRPr->Fill.is<GradFill>())
				return levels[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetABGR();

			if(fontStyle.is_init())
				return fontStyle->Color.GetABGR();

			if(masters[level]->defRPr->Fill.is<SolidFill>())
				return masters[level]->defRPr->Fill.as<SolidFill>().Color.GetABGR();
			if(masters[level]->defRPr->Fill.is<GradFill>())
				return masters[level]->defRPr->Fill.as<GradFill>().GetFrontColor().GetABGR();

			return 0;
		}

		PPTX::Logic::UniColor ShapeProperties::GetColor(int level, const nullable<RunProperties>& pRun, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pRun.is_init())
			{
				if(pRun->Fill.is<SolidFill>())
					return pRun->Fill.as<SolidFill>().Color;
				if(pRun->Fill.is<GradFill>())
					return pRun->Fill.as<GradFill>().GetFrontColor();
			}

			if((pParagraph.is_init()) && (pParagraph->defRPr.is_init()))
			{
				if(pParagraph->defRPr->Fill.is<SolidFill>())
					return pParagraph->defRPr->Fill.as<SolidFill>().Color;
				if(pParagraph->defRPr->Fill.is<GradFill>())
					return pParagraph->defRPr->Fill.as<GradFill>().GetFrontColor();
			}

			if(levels[level]->defRPr->Fill.is<SolidFill>())
				return levels[level]->defRPr->Fill.as<SolidFill>().Color;
			if(levels[level]->defRPr->Fill.is<GradFill>())
				return levels[level]->defRPr->Fill.as<GradFill>().GetFrontColor();

			if(fontStyle.is_init())
				return fontStyle->Color;

			if(masters[level]->defRPr->Fill.is<SolidFill>())
				return masters[level]->defRPr->Fill.as<SolidFill>().Color;
			if(masters[level]->defRPr->Fill.is<GradFill>())
				return masters[level]->defRPr->Fill.as<GradFill>().GetFrontColor();

			UniColor oUniColor;
			return oUniColor;
		}

		PPTX::Logic::UniColor	ShapeProperties::GetColorBullet(int level, const nullable<TextParagraphPr>& pParagraph)const
		{
			if(pParagraph.IsInit())
			{
				if(pParagraph->buColor.is_init())
				{
					if (pParagraph->buColor.is<Logic::BuClr>())
						return pParagraph->buColor.as<Logic::BuClr>().Color;

					PPTX::Logic::UniColor oColor;
					return oColor;
				}
			}
			
			if (levels[level]->buColor.is_init())
			{
				if (levels[level]->buColor.is<Logic::BuClr>())
					return levels[level]->buColor.as<Logic::BuClr>().Color;

				PPTX::Logic::UniColor oColor;
				return oColor;
			}

			if (masters[level]->buColor.is_init())
			{
				if (masters[level]->buColor.is<Logic::BuClr>())
					return masters[level]->buColor.as<Logic::BuClr>().Color;

				PPTX::Logic::UniColor oColor;
				return oColor;
			}
			PPTX::Logic::UniColor oColor;
			return oColor;
		}

		void ShapeProperties::SetParentFilePointer(const WrapperFile* pFile)
		{
			bodyPr.SetParentFilePointer(pFile);
			for(int i = 0; i < 10; i ++)
			{
				levels[i]->SetParentFilePointer(pFile);
				masters[i]->SetParentFilePointer(pFile);
			}

			if(fontStyle.is_init())
				fontStyle->SetParentFilePointer(pFile);
		}

		DWORD ShapeProperties::GetHyperlinkRGBA()const
		{
			if(bodyPr.parentFileIs<Slide>())
				return bodyPr.parentFileAs<Slide>().GetRGBAFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideLayout>())
				return bodyPr.parentFileAs<SlideLayout>().GetRGBAFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideMaster>())
				return bodyPr.parentFileAs<SlideMaster>().GetRGBAFromMap(_T("hlink"));
			else return 0;
		}

		DWORD ShapeProperties::GetHyperlinkARGB()const
		{
			if(bodyPr.parentFileIs<Slide>())
				return bodyPr.parentFileAs<Slide>().GetARGBFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideLayout>())
				return bodyPr.parentFileAs<SlideLayout>().GetARGBFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideMaster>())
				return bodyPr.parentFileAs<SlideMaster>().GetARGBFromMap(_T("hlink"));
			else return 0;
		}

		DWORD ShapeProperties::GetHyperlinkBGRA()const
		{
			if(bodyPr.parentFileIs<Slide>())
				return bodyPr.parentFileAs<Slide>().GetBGRAFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideLayout>())
				return bodyPr.parentFileAs<SlideLayout>().GetBGRAFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideMaster>())
				return bodyPr.parentFileAs<SlideMaster>().GetBGRAFromMap(_T("hlink"));
			else return 0;
		}

		DWORD ShapeProperties::GetHyperlinkABGR()const
		{
			if(bodyPr.parentFileIs<Slide>())
				return bodyPr.parentFileAs<Slide>().GetABGRFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideLayout>())
				return bodyPr.parentFileAs<SlideLayout>().GetABGRFromMap(_T("hlink"));
			else if(bodyPr.parentFileIs<SlideMaster>())
				return bodyPr.parentFileAs<SlideMaster>().GetABGRFromMap(_T("hlink"));
			else return 0;
		}

	} 
} // namespace PPTX