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


#include "../XML/XmlUtils.h"
#include "atlstr.h"

namespace OOX
{
#define WritingElement_AdditionConstructors(Class) \
	Class(XmlUtils::CXmlNode& oNode)\
	{\
		fromXML( oNode );\
	}\
	Class(XmlUtils::CXmlLiteReader& oReader)\
	{\
		fromXML( oReader );\
	}\
	const Class& operator =(const XmlUtils::CXmlNode &oNode)\
	{\
		fromXML( (XmlUtils::CXmlNode &)oNode );\
		return *this;\
	}\
	const Class& operator =(const XmlUtils::CXmlLiteReader& oReader)\
	{\
		fromXML( (XmlUtils::CXmlLiteReader&)oReader );\
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


#define WritingElement_ReadAttributes_Start(Reader) \
	if ( Reader.GetAttributesCount() <= 0 )\
		return;\
	if ( !Reader.MoveToFirstAttribute() )\
		return;\
	CWCharWrapper wsName = Reader.GetName();\
	while( !wsName.IsNull() )\
	{

#define WritingElement_ReadAttributes_Read_if(Reader, AttrName, Value) \
		if ( AttrName == wsName )\
			Value = Reader.##GetText();

#define WritingElement_ReadAttributes_Read_else_if(Reader, AttrName, Value) \
		else if ( AttrName == wsName )\
			Value = Reader.##GetText();

#define WritingElement_ReadAttributes_ReadSingle(Reader, AttrName, Value) \
		if ( AttrName == wsName )\
		{\
			Value = Reader.GetText();\
			break;\
		}

#define WritingElement_ReadAttributes_End(Reader) \
		if ( !Reader.MoveToNextAttribute() ) \
			break;\
		wsName = Reader.GetName();\
	}\
	Reader.MoveToElement();

	enum EElementType
	{
		et_Unknown,

		et_Default, 
		et_Override, 
		et_Relationship, 

		et_a_accent1, 
		et_a_accent2, 
		et_a_accent3, 
		et_a_accent4, 
		et_a_accent5, 
		et_a_accent6, 
		et_a_ahLst, 
		et_a_ahPolar, 
		et_a_ahXY, 
		et_a_alpha, 
		et_a_alphaBiLevel, 
		et_a_alphaCeiling, 
		et_a_alphaFloor, 
		et_a_alphaInv, 
		et_a_alphaMod, 
		et_a_alphaModFix, 
		et_a_alphaOff, 
		et_a_alphaOutset, 
		et_a_alphaRepl, 
		et_a_anchor, 
		et_a_arcTo, 
		et_a_avLst, 
		et_a_backdrop, 
		et_a_bevel, 
		et_a_bevelB, 
		et_a_bevelT, 
		et_a_bgClr, 
		et_a_bgFillStyleLst, 
		et_a_biLevel, 
		et_a_blend, 
		et_a_blip, 
		et_a_blipFill, 
		et_a_blue, 
		et_a_blueMod, 
		et_a_blueOff, 
		et_a_blur, 
		et_a_bodyPr, 
		et_a_camera, 
		et_a_close, 
		et_a_clrChange, 
		et_a_clrFrom, 
		et_a_clrMap, 
		et_a_clrRepl, 
		et_a_clrScheme, 
		et_a_clrTo, 
		et_a_cNvPicPr, 
		et_a_comp, 
		et_a_cont, 
		et_a_contourClr, 
		et_a_cs, 
		et_a_cubicBezTo, 
		et_a_custDash, 
		et_a_custClr, 
		et_a_custClrLst, 
		et_a_custGeom, 
		et_a_cxn, 
		et_a_cxnLst, 
		et_a_dk1, 
		et_a_dk2, 
		et_a_ds, 
		et_a_duotone, 
		et_a_ea, 
		et_a_effect, 
		et_a_effectDag, 
		et_a_effectLst, 
		et_a_effectRef, 
		et_a_effectStyle, 
		et_a_effectStyleLst, 
		et_a_ext, 
		et_a_extLst, 
		et_a_extraClrScheme, 
		et_a_extraClrSchemeLst, 
		et_a_extrusionClr, 
		et_a_fgClr, 
		et_a_fill, 
		et_a_fillOverlay, 
		et_a_fillRect, 
		et_a_fillRef, 
		et_a_fillStyleLst, 
		et_a_fillToRect, 
		et_a_flatTx, 
		et_a_fmtScheme, 
		et_a_folHlink, 
		et_a_font, 
		et_a_fontRef, 
		et_a_fontScheme, 
		et_a_gamma, 
		et_a_gd, 
		et_a_gdLst, 
		et_a_glow, 
		et_a_gradFill, 
		et_a_graphic, 
		et_a_graphicFrameLocks, 
		et_a_gray, 
		et_a_grayscl, 
		et_a_green, 
		et_a_greenMod, 
		et_a_greenOff, 
		et_a_grpFill, 
		et_a_gs, 
		et_a_gsLst, 
		et_a_headEnd, 
		et_a_hlink, 
		et_a_hlinkClick, 
		et_a_hlinkHover, 
		et_a_hsl, 
		et_a_hslClr, 
		et_a_hue, 
		et_a_hueMod, 
		et_a_hueOff, 
		et_a_innerShdw, 
		et_a_inv, 
		et_a_invGamma, 
		et_a_latin, 
		et_a_lightRig, 
		et_a_lin, 
		et_a_ln, 
		et_a_lnDef, 
		et_a_lnRef, 
		et_a_lnStyleLst, 
		et_a_lnTo, 
		et_a_lt1, 
		et_a_lt2, 
		et_a_lum, 
		et_a_lumMod, 
		et_a_lumOff, 
		et_a_majorFont, 
		et_a_minorFont, 
		et_a_masterClrMapping, 
		et_a_miter, 
		et_a_moveTo, 
		et_a_noAutofit, 
		et_a_noFill, 
		et_a_norm, 
		et_a_normAutofit, 
		et_a_objectDefaults, 
		et_a_outerShdw, 
		et_a_overrideClrMapping, 
		et_a_path, 
		et_a_pathLst, 
		et_a_pattFill, 
		et_a_picLocks, 
		et_a_pos, 
		et_a_prstClr, 
		et_a_prstDash, 
		et_a_prstGeom, 
		et_a_prstShdw, 
		et_a_prstTxWarp, 
		et_a_pt, 
		et_a_quadBezTo, 
		et_a_rect, 
		et_a_red, 
		et_a_redMod, 
		et_a_redOff, 
		et_a_reflection, 
		et_a_relOff, 
		et_a_rot, 
		et_a_round, 
		et_a_sat, 
		et_a_satMod, 
		et_a_satOff, 
		et_a_scene3d, 
		et_a_schemeClr, 
		et_a_scrgbClr, 
		et_a_shade, 
		et_a_snd, 
		et_a_softEdge, 
		et_a_solidFill, 
		et_a_sp3d, 
		et_a_spAutoFit, 
		et_a_spDef, 
		et_a_spPr, 
		et_a_srcRect, 
		et_a_srgbClr, 
		et_a_stretch, 
		et_a_style, 
		et_a_sym, 
		et_a_sysClr, 
		et_a_tailEnd, 
		et_a_themeElements, 
		et_a_tile, 
		et_a_tileRect, 
		et_a_tint, 
		et_a_txDef, 
		et_a_up, 
		et_a_xfrm, 

		et_ds_schemaRef, 
		et_ds_schemaRefs, 
		
		et_m_acc, 
		et_m_accPr, 
		et_m_aln, 
		et_m_alnScr, 
		et_m_argPr, 
	    et_m_argSz, 
		et_m_bar, 
		et_m_barPr, 
		et_m_baseJc, 
		et_m_begChr, 
		et_m_borderBox, 
		et_m_borderBoxPr, 
		et_m_box, 
		et_m_boxPr, 
		et_m_brk, 
		et_m_brkBin, 
		et_m_brkBinSub, 
		et_m_cGp, 
		et_m_cGpRule, 
		et_m_chr, 
		et_m_count, 
		et_m_cSp, 
		et_m_ctrlPr, 
		et_m_d, 
		et_m_defJc, 
		et_m_deg, 
		et_m_degHide, 
		et_m_den, 
		et_m_diff, 
		et_m_dispDef, 
		et_m_dPr, 
		et_m_e, 
		et_m_endChr, 
		et_m_eqArr, 
		et_m_eqArrPr, 
		et_m_f, 
		et_m_fName, 
		et_m_fPr, 
		et_m_func, 
		et_m_funcPr, 
		et_m_groupChr, 
		et_m_groupChrPr, 
		et_m_grow, 
		et_m_hideBot, 
		et_m_hideLeft, 
		et_m_hideRight, 
		et_m_hideTop, 
		et_m_interSp, 
		et_m_intLim, 
		et_m_intraSp, 
		et_m_jc, 
		et_m_lim, 
		et_m_limLoc, 
		et_m_limLow, 
		et_m_limLowPr, 
		et_m_limUpp, 
		et_m_limUppPr, 
		et_m_lit, 
		et_m_lMargin, 
		et_m_m, 
		et_m_mathFont, 
		et_m_mathPr, 
		et_m_maxDist, 
		et_m_mc, 
		et_m_mcJc, 
		et_m_mcPr, 
		et_m_mcs, 
		et_m_mPr, 
		et_m_mr, 
		et_m_nary, 
		et_m_naryLim, 
		et_m_naryPr, 
		et_m_noBreak, 
		et_m_nor, 
		et_m_num, 
		et_m_objDist, 
		et_m_oMath, 
		et_m_oMathPara, 
		et_m_oMathParaPr, 
		et_m_opEmu, 
		et_m_phant, 
		et_m_phantPr, 
		et_m_plcHide, 
		et_m_pos, 
		et_m_postSp, 
		et_m_preSp, 
		et_m_r, 
		et_m_rad, 
		et_m_radPr, 
		et_m_rMargin, 
		et_m_rPr, 
		et_m_rSp, 
		et_m_rSpRule, 
		et_m_scr, 
		et_m_sepChr, 
		et_m_show, 
		et_m_shp, 
		et_m_smallFrac, 
		et_m_sPre, 
		et_m_sPrePr, 
		et_m_sSub, 
		et_m_sSubPr, 
		et_m_sSubSup, 
		et_m_sSubSupPr, 
		et_m_sSup, 
		et_m_sSupPr, 
		et_m_strikeBLTR, 
		et_m_strikeH, 
		et_m_strikeTLBR, 
		et_m_strikeV, 
		et_m_sty, 
		et_m_sub, 
		et_m_subHide, 
		et_m_sup, 
		et_m_supHide, 
		et_m_t, 
		et_m_transp, 
		et_m_type, 
		et_m_vertJc, 
		et_m_wrapIndent, 
		et_m_wrapRight, 
		et_m_zeroAsc, 
		et_m_zeroDesc, 
		et_m_zeroWid, 

		et_mc_alternateContent, 

		et_o_bottom, 
		et_o_callout, 
		et_o_clippath, 
		et_o_colormenu, 
		et_o_colormru, 
		et_o_column, 
		et_o_complex, 
		et_o_diagram, 
		et_o_entry, 
		et_o_equationXml, 
		et_o_extrusion, 
		et_o_FieldCodes, 
		et_o_fill, 
		et_o_idmap, 
		et_o_ink, 
		et_o_left, 
		et_o_LinkType, 
		et_o_lock, 
		et_o_LockedField, 
		et_o_OLEObject, 
		et_o_proxy, 
		et_o_r, 
		et_o_regrouptable, 
		et_o_rel, 
		et_o_relationtable, 
		et_o_right, 
		et_o_rules, 
		et_o_shapedefaults, 
		et_o_shapelayout, 
		et_o_signatureline, 
		et_o_skew, 
		et_o_top, 

		et_p_cNvPicPr, 
		et_p_cNvPr, 
		et_p_pic, 

		et_pic_blipFill, 
		et_pic_cNvPicPr, 
		et_pic_cNvPr, 
		et_pic_nvPicPr, 
		et_pic_spPr, 
		et_pic_pic, 

		et_c_chart, 

		et_sl_schema, 
		et_sl_schemaLibrary, 

		et_v_arc, 
		et_v_background, 
		et_v_curve, 
		et_v_f, 
		et_v_fill, 
		et_v_formulas, 
		et_v_group, 
		et_v_h, 
		et_v_handles, 
		et_v_image, 
		et_v_imagedata, 
		et_v_line, 
		et_v_oval, 
		et_v_path, 
		et_v_polyline, 
		et_v_rect, 
		et_v_roundrect, 
		et_v_shadow, 
		et_v_shape, 
		et_v_shapetype, 
		et_v_stroke, 
		et_v_textbox, 
		et_v_textpath, 
		et_v_ClientData, 

		et_w_abstractNum, 
		et_w_activeWritingStyle, 
		et_w_annotationRef, 
		et_w_autoCaption, 
		et_w_autoCaptions, 
		et_w_background, 
		et_w_bdo, 
		et_w_bookmarkEnd, 
		et_w_bookmarkStart, 
		et_w_br, 
		et_w_caption, 
		et_w_captions, 
		et_w_characterSpacingControl, 
		et_w_checkBox, 
		et_w_clrSchemeMapping, 
		et_w_cols, 
		et_w_comboBox, 
		et_w_comment, 
		et_w_commentRangeEnd, 
		et_w_commentRangeStart, 
		et_w_commentReference, 
		et_w_compat, 
		et_w_compatSetting, 
		et_w_contentPart, 
		et_w_continuationSeparator, 
		et_w_control, 
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
		et_w_del, 
		et_w_delInstrText, 
		et_w_delText, 
		et_w_drawing, 
		et_w_docDefaults, 
		et_w_docPartList, 
		et_w_documentProtection, 
		et_w_documentType, 
		et_w_docVar, 
		et_w_docVars, 
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
		et_w_hdrShapeDefaults, 
		et_w_headers, 
		et_w_hyperlink, 
		et_w_ins, 
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
		et_w_numPicBullet, 
		et_w_numPr, 
		et_w_noLineBreaksAfter, 
		et_w_noLineBreaksBefore, 
		et_w_nonBreakHyphen, 
		et_w_object, 
		et_w_p, 
		et_w_pBdr, 
		et_w_permEnd, 
		et_w_permStart, 
		et_w_pgBorders, 
		et_w_pgNum, 
		et_w_pict, 
		et_w_placeholder, 
		et_w_pPr, 
		et_w_pPrChange, 
		et_w_proofErr, 
		et_w_proofState, 
		et_w_ptab, 
		et_w_r, 
		et_w_readModeInkLockDown, 
		et_w_revisionView, 
		et_w_rsids, 
		et_w_rPr, 
		et_w_rPrChange, 
		et_w_ruby, 
		et_w_saveThroughXslt, 
		et_w_sdt, 
		et_w_sdtContent, 
		et_w_dir, 
		et_w_sdtEndPr, 
		et_w_sdtPr, 
		et_w_sectPr, 
		et_w_sectPrChange, 
		et_w_separator, 
		et_w_shapeDefaults, 
		et_w_smartTag, 
		et_w_smartTagType, 
		et_w_softHyphen, 
		et_w_style, 
		et_w_stylePaneFormatFilter, 
		et_w_stylePaneSortMethod, 
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
		et_w_txbxContent, 
		et_w_writeProtection, 
		et_w_yearLong, 
		et_w_yearShort, 
		et_w_zoom, 

		et_wd_anchorLock, 
		et_wd_borderbottom, 
		et_wd_borderleft, 
		et_wd_borderright, 
		et_wd_bordertop, 
		et_wd_wrap, 

		et_wp_anchor, 
		et_wp_cNvGraphicFramePr, 
		et_wp_docPr, 
        et_wp_effectExtent, 
		et_wp_extent, 
		et_wp_inline, 
		et_wp_positionH, 
		et_wp_positionV, 
		et_wp_wrapNone, 
        et_wp_wrapPolygon, 
		et_wp_wrapSquare, 
		et_wp_wrapThrough, 
		et_wp_wrapTight, 
		et_wp_wrapTopAndBottom, 

		et_w15_presenceInfo, 
		et_w15_person, 
		et_w15_commentEx, 
	};

	class WritingElement
	{
	public:
		WritingElement(){}
		virtual ~WritingElement() {}

		virtual void         fromXML(XmlUtils::CXmlNode& node)          = 0;
        virtual CString      toXML() const                              = 0;
		virtual EElementType getType() const
		{
			return OOX::et_Unknown;
		}
		virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) {}
	};
}
