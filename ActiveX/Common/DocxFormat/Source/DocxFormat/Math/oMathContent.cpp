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
 #include "oMathContent.h"
namespace OOX
{
	namespace Logic
	{
		CString      CAcc::toXML() const
			{
				CString sResult = _T("<m:acc>");

				if (  m_oAccPr.IsInit())
					sResult += m_oAccPr->toXML();

				if ( m_oElement.IsInit())
					sResult += m_oElement->toXML();
				
				sResult += _T("</m:acc>");

				return sResult;
			}

			 CString      CAccPr::toXML() const
			 {
				CString sResult = _T("<m:accPr>");
				
				if ( m_oChr.IsInit() )
					sResult += m_oChr->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();
				
				sResult += _T("</m:accPr>");

				return sResult;
			}

			 CString      CBar::toXML() const
			{
				CString sResult = _T("<m:bar>");
				
				if ( m_oBarPr.IsInit() )
					sResult += m_oBarPr->toXML();

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();
				
				sResult += _T("</m:bar>");

				return sResult;
			}

			 CString      CBarPr::toXML() const
			{
				CString sResult = _T("<m:barPr>");
				
				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oPos.IsInit() )
					sResult += m_oPos->toXML();
				
				sResult += _T("</m:barPr>");

				return sResult;
			}

			 CString      CBorderBox::toXML() const
			{
				CString sResult = _T("<m:borderBox>");
				
				if ( m_oBorderBoxPr.IsInit() )
					sResult += m_oBorderBoxPr->toXML();

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				sResult += _T("</m:borderBox>");

				return sResult;
			}

			  CString      CBorderBoxPr::toXML() const
			{
				CString sResult = _T("<m:borderBoxPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oHideBot.IsInit() )
					sResult += m_oHideBot->toXML();

				if ( m_oHideLeft.IsInit() )
					sResult += m_oHideLeft->toXML();

				if ( m_oHideRight.IsInit() )
					sResult += m_oHideRight->toXML();

				if ( m_oHideTop.IsInit() )
					sResult += m_oHideTop->toXML();

				if ( m_oStrikeBLTR.IsInit() )
					sResult += m_oStrikeBLTR->toXML();

				if ( m_oStrikeH.IsInit() )
					sResult += m_oStrikeH->toXML();

				if ( m_oStrikeTLBR.IsInit() )
					sResult += m_oStrikeTLBR->toXML();

				if ( m_oStrikeV.IsInit() )
					sResult += m_oStrikeV->toXML();
								
				sResult += _T("</m:borderBoxPr>");

				return sResult;
			}

			  CString      CBox::toXML() const
			{
				CString sResult = _T("<m:box>");

				if ( m_oBoxPr.IsInit() )
					sResult += m_oBoxPr->toXML();

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();
				
				sResult += _T("</m:box>");

				return sResult;
			}

			 CString      CBoxPr::toXML() const
			{
				CString sResult = _T("<m:boxPr>");
				
				if ( m_oAln.IsInit() )
					sResult += m_oAln->toXML();

				if ( m_oBrk.IsInit() )
					sResult += m_oBrk->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oDiff.IsInit() )
					sResult += m_oDiff->toXML();

				if ( m_oNoBreak.IsInit() )
					sResult += m_oNoBreak->toXML();

				if ( m_oOpEmu.IsInit() )
					sResult += m_oOpEmu->toXML();
								
				sResult += _T("</m:boxPr>");

				return sResult;
			}

			 CString      CFraction::toXML() const
			{
				CString sResult = _T("<m:f>");

				if ( m_oDen.IsInit() )
					sResult += m_oDen->toXML();

				if ( m_oFPr.IsInit() )
					sResult += m_oFPr->toXML();

				if ( m_oNum.IsInit() )
					sResult += m_oNum->toXML();
				
				sResult += _T("</m:f>");

				return sResult;
			}

			 CString      CFunc::toXML() const
			{
				CString sResult = _T("<m:func>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oFName.IsInit() )
					sResult += m_oFName->toXML();

				if ( m_oFuncPr.IsInit() )
					sResult += m_oFuncPr->toXML();
				
				sResult += _T("</m:func>");

				return sResult;
			}

			 CString      CGroupChr::toXML() const
			{
				CString sResult = _T("<m:groupChr>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oGroupChrPr.IsInit() )
					sResult += m_oGroupChrPr->toXML();
				
				sResult += _T("</m:groupChr>");

				return sResult;
			}

			 CString      CLimLow::toXML() const
			{
				CString sResult = _T("<m:limLow>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oLim.IsInit() )
					sResult += m_oLim->toXML();

				if ( m_oLimLowPr.IsInit() )
					sResult += m_oLimLowPr->toXML();
				
				sResult += _T("</m:limLow>");

				return sResult;
			}

			 CString      CLimUpp::toXML() const
			{
				CString sResult = _T("<m:limUpp>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oLim.IsInit() )
					sResult += m_oLim->toXML();

				if ( m_oLimUppPr.IsInit() )
					sResult += m_oLimUppPr->toXML();
				
				sResult += _T("</m:limUpp>");

				return sResult;
			}			

			  CString      CMc::toXML() const
			{
				CString sResult = _T("<m:mc>");

				if ( m_oMcPr.IsInit() )
					sResult += m_oMcPr->toXML();
				
				sResult += _T("</m:mc>");

				return sResult;
			}

			  CString      CNary::toXML() const
			{
				CString sResult = _T("<m:nary>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oNaryPr.IsInit() )
					sResult += m_oNaryPr->toXML();

				if ( m_oSub.IsInit() )
					sResult += m_oSub->toXML();

				if ( m_oSup.IsInit() )
					sResult += m_oSup->toXML();
				
				sResult += _T("</m:oMathPara>");

				return sResult;
			}

			  CString      CPhant::toXML() const
			{
				CString sResult = _T("<m:phant>");

				if ( m_oElement.IsInit() )
					sResult += m_oElement->toXML();

				if ( m_oPhantPr.IsInit() )
					sResult += m_oPhantPr->toXML();
				
				sResult += _T("</m:phant>");

				return sResult;
			}

			 CString      CMRun::toXML() const
			{
				CString sResult = _T("<m:r>");

				if ( m_oAnnotationRef.IsInit() )
					sResult += m_oAnnotationRef->toXML();

				if ( m_oBr.IsInit() )
					sResult += m_oBr->toXML();

				if ( m_oCommentReference.IsInit() )
					sResult += m_oCommentReference->toXML();

				if ( m_oContentPart.IsInit() )
					sResult += m_oContentPart->toXML();

				if ( m_oContinuationSeparator.IsInit() )
					sResult += m_oContinuationSeparator->toXML();

				if ( m_oCr.IsInit() )
					sResult += m_oCr->toXML();

				if ( m_oDayLong.IsInit() )
					sResult += m_oDayLong->toXML();

				if ( m_oDayShort.IsInit() )
					sResult += m_oDayShort->toXML();

				if ( m_oDelInstrText.IsInit() )
					sResult += m_oDelInstrText->toXML();

				if ( m_oDelText.IsInit() )
					sResult += m_oDelText->toXML();

				if ( m_oDrawing.IsInit() )
					sResult += m_oDrawing->toXML();

				if ( m_oEndnoteRef.IsInit() )
					sResult += m_oEndnoteRef->toXML();

				if ( m_oEndnoteReference.IsInit() )
					sResult += m_oEndnoteReference->toXML();

				if ( m_oFldChar.IsInit() )
					sResult += m_oFldChar->toXML();

				if ( m_oFootnoteRef.IsInit() )
					sResult += m_oFootnoteRef->toXML();

				if ( m_oFootnoteReference.IsInit() )
					sResult += m_oFootnoteReference->toXML();

				if ( m_oInstrText.IsInit() )
					sResult += m_oInstrText->toXML();

				if ( m_oLastRenderedPageBreak.IsInit() )
					sResult += m_oLastRenderedPageBreak->toXML();

				if ( m_oMonthLong.IsInit() )
					sResult += m_oMonthLong->toXML();

				if ( m_oMonthShort.IsInit() )
					sResult += m_oMonthShort->toXML();

				if ( m_oNoBreakHyphen.IsInit() )
					sResult += m_oNoBreakHyphen->toXML();

				if ( m_oObject.IsInit() )
					sResult += m_oObject->toXML();

				if ( m_oPgNum.IsInit() )
					sResult += m_oPgNum->toXML();

				if ( m_oPtab.IsInit() )
					sResult += m_oPtab->toXML();

				if ( m_oMRPr.IsInit() )
					sResult += m_oMRPr->toXML();

				if ( m_oRPr.IsInit() )
					sResult += m_oRPr->toXML();

				if ( m_oRuby.IsInit() )
					sResult += m_oRuby->toXML();

				if ( m_oSeparator.IsInit() )
					sResult += m_oSeparator->toXML();

				if ( m_oSoftHyphen.IsInit() )
					sResult += m_oSoftHyphen->toXML();

				if ( m_oSym.IsInit() )
					sResult += m_oSym->toXML();

				if ( m_oMText.IsInit() )
					sResult += m_oMText->toXML();

				if ( m_oText.IsInit() )
					sResult += m_oText->toXML();

				if ( m_oTab.IsInit() )
					sResult += m_oTab->toXML();

				if ( m_oYearLong.IsInit() )
					sResult += m_oYearLong->toXML();

				if ( m_oYearShort.IsInit() )
					sResult += m_oYearShort->toXML();
				
				sResult += _T("</m:r>");

				return sResult;
			}
	}
}