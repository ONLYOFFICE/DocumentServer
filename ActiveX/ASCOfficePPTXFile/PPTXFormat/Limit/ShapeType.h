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
#ifndef PPTX_LIMIT_SHAPETYPE_INCLUDE_H_
#define PPTX_LIMIT_SHAPETYPE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class ShapeType : public BaseLimit
		{
		public:
			ShapeType()
			{
				m_strValue = _T("rect");
	 		}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("accentBorderCallout1") == strValue) ||
					(_T("accentBorderCallout2") == strValue) ||
					(_T("accentBorderCallout3") == strValue) ||
					(_T("accentCallout1") == strValue) ||
					(_T("accentCallout2") == strValue) ||
					(_T("accentCallout3") == strValue) ||
					(_T("actionButtonBackPrevious") == strValue) ||
					(_T("actionButtonBeginning") == strValue) ||
					(_T("actionButtonBlank") == strValue) ||
					(_T("actionButtonDocument") == strValue) ||
					(_T("actionButtonEnd") == strValue) ||
					(_T("actionButtonForwardNext") == strValue) ||
					(_T("actionButtonHelp") == strValue) ||
					(_T("actionButtonHome") == strValue) ||
					(_T("actionButtonInformation") == strValue) ||
					(_T("actionButtonMovie") == strValue) ||
					(_T("actionButtonReturn") == strValue) ||
					(_T("actionButtonSound") == strValue) ||
					(_T("arc") == strValue) ||
					(_T("bentArrow") == strValue) ||
					(_T("bentConnector2") == strValue) ||
					(_T("bentConnector3") == strValue) ||
					(_T("bentConnector4") == strValue) ||
					(_T("bentConnector5") == strValue) ||
					(_T("bentUpArrow") == strValue) ||
					(_T("bevel") == strValue) ||
					(_T("blockArc") == strValue) ||
					(_T("borderCallout1") == strValue) ||
					(_T("borderCallout2") == strValue) ||
					(_T("borderCallout3") == strValue) ||
					(_T("bracePair") == strValue) ||
					(_T("bracketPair") == strValue) ||
					(_T("callout1") == strValue) ||
					(_T("callout2") == strValue) ||
					(_T("callout3") == strValue) ||
					(_T("can") == strValue) ||
					(_T("chartPlus") == strValue) ||
					(_T("chartStar") == strValue) ||
					(_T("chartX") == strValue) ||
					(_T("chevron") == strValue) ||
					(_T("chord") == strValue) ||
					(_T("circularArrow") == strValue) ||
					(_T("cloud") == strValue) ||
					(_T("cloudCallout") == strValue) ||
					(_T("corner") == strValue) ||
					(_T("cornerTabs") == strValue) ||
					(_T("cube") == strValue) ||
					(_T("curvedConnector2") == strValue) ||
					(_T("curvedConnector3") == strValue) ||
					(_T("curvedConnector4") == strValue) ||
					(_T("curvedConnector5") == strValue) ||
					(_T("curvedDownArrow") == strValue) ||
					(_T("curvedLeftArrow") == strValue) ||
					(_T("curvedRightArrow") == strValue) ||
					(_T("curvedUpArrow") == strValue) ||
					(_T("decagon") == strValue) ||
					(_T("diagStripe") == strValue) ||
					(_T("diamond") == strValue) ||
					(_T("dodecagon") == strValue) ||
					(_T("donut") == strValue) ||
					(_T("doubleWave") == strValue) ||
					(_T("downArrow") == strValue) ||
					(_T("downArrowCallout") == strValue) ||
					(_T("ellipse") == strValue) ||
					(_T("ellipseRibbon") == strValue) ||
					(_T("ellipseRibbon2") == strValue) ||
					(_T("flowChartAlternateProcess") == strValue) ||
					(_T("flowChartCollate") == strValue) ||
					(_T("flowChartConnector") == strValue) ||
					(_T("flowChartDecision") == strValue) ||
					(_T("flowChartDelay") == strValue) ||
					(_T("flowChartDisplay") == strValue) ||
					(_T("flowChartDocument") == strValue) ||
					(_T("flowChartExtract") == strValue) ||
					(_T("flowChartInputOutput") == strValue) ||
					(_T("flowChartInternalStorage") == strValue) ||
					(_T("flowChartMagneticDisk") == strValue) ||
					(_T("flowChartMagneticDrum") == strValue) ||
					(_T("flowChartMagneticTape") == strValue) ||
					(_T("flowChartManualInput") == strValue) ||
					(_T("flowChartManualOperation") == strValue) ||
					(_T("flowChartMerge") == strValue) ||
					(_T("flowChartMultidocument") == strValue) ||
					(_T("flowChartOfflineStorage") == strValue) ||
					(_T("flowChartOffpageConnector") == strValue) ||
					(_T("flowChartOnlineStorage") == strValue) ||
					(_T("flowChartOr") == strValue) ||
					(_T("flowChartPredefinedProcess") == strValue) ||
					(_T("flowChartPreparation") == strValue) ||
					(_T("flowChartProcess") == strValue) ||
					(_T("flowChartPunchedCard") == strValue) ||
					(_T("flowChartPunchedTape") == strValue) ||
					(_T("flowChartSort") == strValue) ||
					(_T("flowChartSummingJunction") == strValue) ||
					(_T("flowChartTerminator") == strValue) ||
					(_T("foldedCorner") == strValue) ||
					(_T("frame") == strValue) ||
					(_T("funnel") == strValue) ||
					(_T("gear6") == strValue) ||
					(_T("gear9") == strValue) ||
					(_T("halfFrame") == strValue) ||
					(_T("heart") == strValue) ||
					(_T("heptagon") == strValue) ||
					(_T("hexagon") == strValue) ||
					(_T("homePlate") == strValue) ||
					(_T("horizontalScroll") == strValue) ||
					(_T("irregularSeal1") == strValue) ||
					(_T("irregularSeal2") == strValue) ||
					(_T("leftArrow") == strValue) ||
					(_T("leftArrowCallout") == strValue) ||
					(_T("leftBrace") == strValue) ||
					(_T("leftBracket") == strValue) ||
					(_T("leftCircularArrow") == strValue) ||
					(_T("leftRightArrow") == strValue) ||
					(_T("leftRightArrowCallout") == strValue) ||
					(_T("leftRightCircularArrow") == strValue) ||
					(_T("leftRightRibbon") == strValue) ||
					(_T("leftRightUpArrow") == strValue) ||
					(_T("leftUpArrow") == strValue) ||
					(_T("lightningBolt") == strValue) ||
					(_T("line") == strValue) ||
					(_T("lineInv") == strValue) ||
					(_T("mathDivide") == strValue) ||
					(_T("mathEqual") == strValue) ||
					(_T("mathMinus") == strValue) ||
					(_T("mathMultiply") == strValue) ||
					(_T("mathNotEqual") == strValue) ||
					(_T("mathPlus") == strValue) ||
					(_T("moon") == strValue) ||
					(_T("nonIsoscelesTrapezoid") == strValue) ||
					(_T("noSmoking") == strValue) ||
					(_T("notchedRightArrow") == strValue) ||
					(_T("octagon") == strValue) ||
					(_T("parallelogram") == strValue) ||
					(_T("pentagon") == strValue) ||
					(_T("pie") == strValue) ||
					(_T("pieWedge") == strValue) ||
					(_T("plaque") == strValue) ||
					(_T("plaqueTabs") == strValue) ||
					(_T("plus") == strValue) ||
					(_T("quadArrow") == strValue) ||
					(_T("quadArrowCallout") == strValue) ||
					(_T("rect") == strValue) ||
					(_T("ribbon") == strValue) ||
					(_T("ribbon2") == strValue) ||
					(_T("rightArrow") == strValue) ||
					(_T("rightArrowCallout") == strValue) ||
					(_T("rightBrace") == strValue) ||
					(_T("rightBracket") == strValue) ||
					(_T("round1Rect") == strValue) ||
					(_T("round2DiagRect") == strValue) ||
					(_T("round2SameRect") == strValue) ||
					(_T("roundRect") == strValue) ||
					(_T("rtTriangle") == strValue) ||
					(_T("smileyFace") == strValue) ||
					(_T("snip1Rect") == strValue) ||
					(_T("snip2DiagRect") == strValue) ||
					(_T("snip2SameRect") == strValue) ||
					(_T("snipRoundRect") == strValue) ||
					(_T("squareTabs") == strValue) ||
					(_T("star10") == strValue) ||
					(_T("star12") == strValue) ||
					(_T("star16") == strValue) ||
					(_T("star24") == strValue) ||
					(_T("star32") == strValue) ||
					(_T("star4") == strValue) ||
					(_T("star5") == strValue) ||
					(_T("star6") == strValue) ||
					(_T("star7") == strValue) ||
					(_T("star8") == strValue) ||
					(_T("straightConnector1") == strValue) ||
					(_T("stripedRightArrow") == strValue) ||
					(_T("sun") == strValue) ||
					(_T("swooshArrow") == strValue) ||
					(_T("teardrop") == strValue) ||
					(_T("trapezoid") == strValue) ||
					(_T("triangle") == strValue) ||
					(_T("upArrow") == strValue) ||
					(_T("upArrowCallout") == strValue) ||
					(_T("upDownArrow") == strValue) ||
					(_T("upDownArrowCallout") == strValue) ||
					(_T("uturnArrow") == strValue) ||
					(_T("verticalScroll") == strValue) ||
					(_T("wave") == strValue) ||
					(_T("wedgeEllipseCallout") == strValue) ||
					(_T("wedgeRectCallout") == strValue) ||
					(_T("wedgeRoundRectCallout") == strValue))
				{
					m_strValue = strValue;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_SHAPETYPE_INCLUDE_H_