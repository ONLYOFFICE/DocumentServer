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

#include "NamespaceOwn.h"
#include "../../../Common/DocxFormat/Source/XML/XmlUtils.h"
#include "atlstr.h"

namespace OOX
{
#define WritingElement_AdditionConstructors(Class) \
	Class(XmlUtils::CXmlNode& oNode)\
	{\
		fromXML( oNode );\
	}\
	const Class& operator =(const XmlUtils::CXmlNode &oNode)\
	{\
		fromXML( (XmlUtils::CXmlNode &)oNode );\
		return *this;\
	}

#define WritingElement_ReadNode( oRootNode, oChildNode, sNodeName, oValue ) \
	if ( oRootNode.GetNode( sNodeName, oChildNode ) )\
		oValue = oChildNode;

#define WritingElement_WriteNode_1( sStartNodeString, oValue ) \
	if ( oValue.IsInit() )\
	{\
		sResult += sStartNodeString;\
		sResult += oValue->ToString();\
		sResult += _T("/>");\
	}

#define WritingElement_WriteNode_2( oValue ) \
	if ( oValue.IsInit() )\
		sResult += oValue->toXML();

	enum EElementType
	{
		et_Unknown,

		et_Default, 
		et_Override, 

		et_a_graphic, 

		et_ds_schemaRef, 
		et_ds_schemaRefs, 

		et_p_pic, 

		et_w_abstractNum, 
		et_w_annotationRef, 
		et_w_background, 
		et_w_bdo, 
		et_w_bookmarkEnd, 
		et_w_bookmarkStart, 
		et_w_br, 
		et_w_checkBox, 
		et_w_cols, 
		et_w_comboBox, 
		et_w_commentRangeEnd, 
		et_w_commentRangeStart, 
		et_w_commentReference, 
		et_w_contentPart, 
		et_w_continuationSeparator, 
		et_w_customXmlDelRangeEnd, 
		et_w_customXmlDelRangeStart, 
		et_w_customXmlInsRangeEnd, 
		et_w_customXmlInsRangeStart, 
		et_w_customXmlMoveFromRangeEnd, 
		et_w_customXmlMoveFromRangeStart, 
		et_w_customXmlMoveToRangeEnd, 
		et_w_customXmlMoveToRangeStart, 
		et_w_cr, 
		et_w_date, 
		et_w_dayLong, 
		et_w_dayShort, 
		et_w_ddList, 
		et_w_delInstrText, 
		et_w_delText, 
		et_w_docDefaults, 
		et_w_docPartList, 
		et_w_dropDownList, 
		et_w_endnote, 
		et_w_endnotePr, 
		et_w_endnoteRef, 
		et_w_endnoteReference, 
		et_w_ffData, 
		et_w_fldChar, 
		et_w_fldSimple, 
		et_w_font, 
		et_w_footnote, 
		et_w_footnotePr, 
		et_w_footnoteRef, 
		et_w_footnoteReference, 
		et_w_ftr, 
		et_w_hdr, 
		et_w_headers, 
		et_w_hyperlink, 
		et_w_instrText, 
		et_w_latentStyles, 
		et_w_lastRenderedPageBreak, 
		et_w_lvl, 
		et_w_lvlOverride, 
		et_w_monthLong, 
		et_w_monthShort, 
		et_w_moveFromRangeEnd, 
		et_w_moveFromRangeStart, 
		et_w_moveToRangeEnd, 
		et_w_moveToRangeStart, 
		et_w_num, 
		et_w_numPr, 
		et_w_nonBreakHyphen, 
		et_w_object, 
		et_w_p, 
		et_w_pBdr, 
		et_w_permEnd, 
		et_w_permStart, 
		et_w_pgBorders, 
		et_w_pgNum, 
		et_w_placeholder, 
		et_w_pPr, 
		et_w_pPrChange, 
		et_w_proofErr, 
		et_w_ptab, 
		et_w_r, 
		et_w_ruby, 
		et_w_rPr, 
		et_w_rPrChange, 
		et_w_sdt, 
		et_w_sdtContent, 
		et_w_sdtEndPr, 
		et_w_sdtPr, 
		et_w_sectPr, 
		et_w_sectPrChange, 
		et_w_separator, 
		et_w_softHyphen, 
		et_w_style, 
		et_w_sym, 
		et_w_t, 
		et_w_tab, 
		et_w_tabs, 
		et_w_tbl, 
		et_w_tblBorders, 
		et_w_tblCellMar, 
		et_w_tblGrid, 
		et_w_tblGridChange, 
		et_w_tblPr, 
		et_w_tblPrChange, 
		et_w_tblPrEx, 
		et_w_tblPrExChange, 
		et_w_tblStylePr, 
		et_w_tc, 
		et_w_tcBorders, 
		et_w_tcMar, 
		et_w_tcPr, 
		et_w_tcPrChange, 
		et_w_textInput, 
		et_w_tr, 
		et_w_trPr, 
		et_w_trPrChange, 
		et_w_yearLong, 
		et_w_yearShort, 

		et_wp_docPr, 
        et_wp_effectExtent, 
		et_wp_extent, 
        et_wp_wrapPolygon, 
	};

	class WritingElement
	{
	public:
		WritingElement(){}
		virtual ~WritingElement() {}

		virtual void         fromXML(XmlUtils::CXmlNode& node) = 0;
        virtual CString      toXML() const                     = 0;
		virtual EElementType getType() const
		{
			return OOX::et_Unknown;
		}
	};
}
