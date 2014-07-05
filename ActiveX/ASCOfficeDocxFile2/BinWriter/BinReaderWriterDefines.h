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
namespace BinDocxRW
{
const double eps     = 0.001;

const int Page_Width     = 210;
const int Page_Height    = 297;

const int X_Left_Margin   = 30;  
const int X_Right_Margin  = 15;  
const int Y_Bottom_Margin = 20;  
const int Y_Top_Margin    = 20;  

const double Y_Default_Header = 12.5; 
const double Y_Default_Footer = 12.5; 

const int shd_Clear = 0;
const int shd_Nil   = 1;

const int g_tabtype_left = 0;
const int g_tabtype_right = 1;
const int g_tabtype_center = 2;
const int g_tabtype_clear = 3;

const int border_None   = 0x0000;
const int border_Single = 0x0001;

const int heightrule_AtLeast = 0x00;
const int heightrule_Auto    = 0x01;
const int heightrule_Exact   = 0x02;

const int vertalign_Baseline    = 0;
const int vertalign_SuperScript = 1;
const int vertalign_SubScript   = 2;

const int align_Right   = 0;
const int align_Left    = 1;
const int align_Center  = 2;
const int align_Justify = 3;

const int vertalignjc_Top    = 0x00;
const int vertalignjc_Center = 0x01;
const int vertalignjc_Bottom = 0x02;

const int vmerge_Restart  = 0x01;
const int vmerge_Continue = 0x02;

const int linerule_AtLeast = 0;
const int linerule_Auto    = 1;
const int linerule_Exact   = 2;

const int orientation_Portrait  = 0x00;
const int orientation_Landscape = 0x01;

const int numbering_numfmt_None        = 0x0000;
const int numbering_numfmt_Bullet      = 0x1001;
const int numbering_numfmt_Decimal     = 0x2002;
const int numbering_numfmt_LowerRoman  = 0x2003;
const int numbering_numfmt_UpperRoman  = 0x2004;
const int numbering_numfmt_LowerLetter = 0x2005;
const int numbering_numfmt_UpperLetter = 0x2006;
const int numbering_numfmt_DecimalZero = 0x2007;

const int numbering_suff_Tab     = 1;
const int numbering_suff_Space   = 2;
const int numbering_suff_Nothing = 3;

const int tblwidth_Auto = 0x00;
const int tblwidth_Mm   = 0x01;
const int tblwidth_Nil  = 0x02;
const int tblwidth_Pct  = 0x03;

const int fontstyle_mask_regular = 1;
const int fontstyle_mask_italic = 2;
const int fontstyle_mask_bold = 4;
const int fontstyle_mask_bolditalic = 8;

const int styletype_Character = 0x01;
const int styletype_Numbering = 0x02;
const int styletype_Paragraph = 0x03;
const int styletype_Table = 0x04;

const int fieldstruct_none = 0;
const int fieldstruct_toc = 1;
const int fieldstruct_pagenum = 2;
const int fieldstruct_hyperlink = 3;
const int fieldstruct_locallink = 4;

const double g_dKoef_mm_to_pt = 72 / (2.54 * 10);
const double g_dKoef_mm_to_twips = 20 * g_dKoef_mm_to_pt;
const double g_dKoef_mm_to_emu = 36000;
const double g_dKoef_mm_to_eightpoint = 8 * g_dKoef_mm_to_pt;
const double g_dKoef_mm_to_hps = 2 * g_dKoef_mm_to_pt;

const static TCHAR* g_sFormatSignature = _T("DOCY");
const int g_nFormatVersion = 4;
	namespace c_oAscWrapStyle{enum c_oSerFormat
	{
		Inline = 0,
		Flow = 1
	};}
	namespace c_oSerConstants{enum c_oSerConstants
	{
		ErrorFormat =  -2,
		ErrorUnknown =  -1,
		ReadOk = 0,
		ReadUnknown = 1,
		ErrorStream = 0x55
	};}
	namespace c_oSerTableTypes{enum c_oSerTableTypes
	{
		Signature = 0,
		Info = 1,
		Media = 2,
		Numbering = 3,
		HdrFtr = 4,
		Style = 5,
		Document = 6,
		Other = 7,
		Comments = 8,
		Settings = 9
	};}
	namespace c_oSerSigTypes{enum c_oSerSigTypes
	{
		Version = 0
	};}
	namespace c_oSerHdrFtrTypes{enum c_oSerHdrFtrTypes
	{
		Header = 0,
		Footer = 1,
		HdrFtr_First = 2,
		HdrFtr_Even = 3,
		HdrFtr_Odd = 4,
		HdrFtr_Content = 5,
		HdrFtr_Y2 = 6,
		HdrFtr_Y = 7
	};}
	namespace c_oSerNumTypes{enum c_oSerNumTypes
	{
		AbstractNums = 0,
		AbstractNum = 1,
		AbstractNum_Id = 2,
		AbstractNum_Type = 3,
		AbstractNum_Lvls = 4,
		Lvl = 5,
		lvl_Format = 6,
		lvl_Jc = 7,
		lvl_LvlText = 8,
		lvl_LvlTextItem = 9,
		lvl_LvlTextItemText = 10,
		lvl_LvlTextItemNum = 11,
		lvl_Restart = 12,
		lvl_Start = 13,
		lvl_Suff = 14,
		lvl_ParaPr = 15,
		lvl_TextPr = 16,
		Nums = 17,
		Num = 18,
		Num_ANumId = 19,
		Num_NumId = 20,
		lvl_PStyle = 21,
		NumStyleLink = 22,
		StyleLink = 23
	};}
	namespace c_oSerOtherTableTypes{enum c_oSerOtherTableTypes
	{
		ImageMap = 0,
		ImageMap_Src = 1,
		EmbeddedFonts = 2,
		DocxTheme = 3
	};}
	namespace c_oSerFontsTypes{enum c_oSerFontsTypes
	{
		Name = 0
	};}
	namespace c_oSerImageMapTypes{enum c_oSerImageMapTypes
	{
		Src = 0
	};}
	namespace c_oSerStyleTypes{enum c_oSerStyleTypes
	{
		Name = 0,
		BasedOn = 1,
		Next = 2
	};}
	namespace c_oSerPropLenType{enum c_oSerPropLenType
	{
		Null = 0,
		Byte = 1,
		Short = 2,
		Three = 3,
		Long = 4,
		Double = 5,
		Variable = 6
	};}
	namespace c_oSer_st{enum c_oSer_st
	{
		DefpPr = 0,
		DefrPr = 1,
		Styles = 2
	};}
	namespace c_oSer_sts{enum c_oSer_sts
	{
		Style = 0,
		Style_Id = 1,
		Style_Name = 2,
		Style_BasedOn = 3,
		Style_Next = 4,
		Style_TextPr = 5,
		Style_ParaPr = 6,
		Style_TablePr = 7,
		Style_Default = 8,
		Style_Type = 9,
		Style_qFormat = 10,
		Style_uiPriority = 11,
		Style_hidden = 12,
		Style_semiHidden = 13,
		Style_unhideWhenUsed = 14,
		Style_RowPr = 15,
		Style_CellPr = 16,
		Style_TblStylePr = 17
	};}
	namespace c_oSerProp_tblStylePrType{enum c_oSerProp_tblStylePrType
	{
		TblStylePr = 0,
		Type = 1,
		RunPr = 2,
		ParPr = 3,
		TblPr = 4,
		TrPr = 5,
		TcPr = 6
	};}
	namespace c_oSerProp_tblPrType{enum c_oSerProp_tblPrType
	{
		Rows = 0,
		Cols = 1,
		Jc = 2,
		TableInd = 3,
		TableW = 4,
		TableCellMar = 5,
		TableBorders = 6,
		Shd = 7,
		tblpPr = 8,
		Look = 9,
		Style = 10,
		tblpPr2 = 11,
		Layout = 12
	};}
	namespace c_oSer_tblpPrType{enum c_oSer_tblpPrType
	{
		Page = 0,
		X = 1,
		Y = 2,
		Paddings = 3
	};}
	namespace c_oSer_tblpPrType2{enum c_oSer_tblpPrType2
	{
		HorzAnchor = 0,
		TblpX = 1,
		TblpXSpec = 2,
		VertAnchor = 3,
		TblpY = 4,
		TblpYSpec = 5,
		Paddings = 6
	};}
	namespace c_oSerProp_pPrType{enum c_oSerProp_pPrType
	{
		ContextualSpacing = 0,
		Ind = 1,
		Ind_Left = 2,
		Ind_Right = 3,
		Ind_FirstLine = 4,
		Jc = 5,
		KeepLines = 6,
		KeepNext = 7,
		PageBreakBefore = 8,
		Spacing = 9,
		Spacing_Line = 10,
		Spacing_LineRule = 11,
		Spacing_Before = 12,
		Spacing_After = 13,
		Shd = 14,
		Tab = 17,
		Tab_Item = 18,
		Tab_Item_Pos = 19,
		Tab_Item_Val = 20,
		ParaStyle = 21,
		numPr =  22,
		numPr_lvl =  23,
		numPr_id =  24,
		WidowControl = 25,
		pPr_rPr = 26,
		pBdr = 27,
		Spacing_BeforeAuto = 28,
		Spacing_AfterAuto = 29,
		FramePr = 30
	};}
	namespace c_oSerProp_rPrType{enum c_oSerProp_rPrType
	{
		Bold = 0,
		Italic = 1,
		Underline = 2,
		Strikeout = 3,
		FontAscii = 4,
		FontHAnsi = 5,
		FontAE = 6,
		FontCS = 7,
		FontSize = 8,
		Color = 9,
		VertAlign = 10,
		HighLight = 11,
		HighLightTyped = 12,
		RStyle = 13,
		Spacing = 14,
		DStrikeout = 15,
		Caps = 16,
		SmallCaps = 17,
		Position = 18,
		FontHint = 19,
		BoldCs = 20,
		ItalicCs = 21,
		FontSizeCs = 22,
		Cs = 23,
		Rtl = 24,
		Lang = 25,
		LangBidi = 26,
		LangEA = 27
	};}
	namespace c_oSerProp_rowPrType{enum c_oSerProp_rowPrType
	{
		CantSplit = 0,
		GridAfter = 1,
		GridBefore = 2,
		Jc = 3,
		TableCellSpacing = 4,
		Height = 5,
		Height_Rule = 6,
		Height_Value = 7,
		WAfter = 8,
		WBefore = 9,
		WAfterBefore_W = 10,
		WAfterBefore_Type = 11,
		After = 12,
		Before = 13,
		TableHeader = 14
	};}
	namespace c_oSerProp_cellPrType{enum c_oSerProp_cellPrType
	{
		GridSpan = 0,
		Shd = 1,
		TableCellBorders = 2,
		TableCellW = 3,
		VAlign = 4,
		VMerge = 5,
		CellMar = 6
	};}
	namespace c_oSerProp_secPrType{enum c_oSerProp_secPrType
	{
		pgSz = 0,
		pgMar = 1,
		setting = 2
	};}
	namespace c_oSerProp_secPrSettingsType{enum c_oSerProp_secPrSettingsType
	{
		titlePg = 0,
		EvenAndOddHeaders = 1
	};}
	namespace c_oSerParType{enum c_oSerParType
	{
		Par = 0,
		pPr = 1,
		Content = 2,
		Table = 3,
		sectPr =  4,
		Run = 5,
		CommentStart = 6,
		CommentEnd = 7,
		OMathPara = 8,
		OMath = 9
	};}
	namespace c_oSerDocTableType{enum c_oSerDocTableType
	{
		tblPr = 0,
		tblGrid = 1,
		tblGrid_Item = 2,
		Content = 3,
		Row =  4,
		Row_Pr =  4,
		Row_Content =  5,
		Cell =  6,
		Cell_Pr =  7,
		Cell_Content =  8
	};}
	namespace c_oSerRunType{enum c_oSerRunType
	{
		run = 0,
		rPr = 1,
		tab = 2,
		pagenum = 3,
		pagebreak = 4,
		linebreak = 5,
		image = 6,
		table = 7,
		Content = 8,
		fldstart = 9,
		fldend = 10,
		CommentReference = 11,
		pptxDrawing = 12
	};}
	namespace c_oSerImageType{enum c_oSerImageType
	{
		MediaId = 0,
		Type = 1,
		Width = 2,
		Height = 3,
		X = 4,
		Y = 5,
		Page = 6,
		Padding = 7
	};}
	namespace c_oSerImageType2{enum c_oSerImageType2
	{
		Type = 0,
		PptxData = 1,
		AllowOverlap = 2,
		BehindDoc = 3,
		DistB = 4,
		DistL = 5,
		DistR = 6,
		DistT = 7,
		Hidden = 8,
		LayoutInCell = 9,
		Locked = 10,
		RelativeHeight = 11,
		BSimplePos = 12,
		EffectExtent = 13,
		Extent = 14,
		PositionH = 15,
		PositionV = 16,
		SimplePos = 17,
		WrapNone = 18,
		WrapSquare = 19,
		WrapThrough = 20,
		WrapTight = 21,
		WrapTopAndBottom = 22,
		Chart = 23,
		ChartImg = 24
	};}
	namespace c_oSerEffectExtent{enum c_oSerEffectExtent
	{
		Left = 0,
		Top = 1,
		Right = 2,
		Bottom = 3
	};}
	namespace c_oSerExtent{enum c_oSerExtent
	{
		Cx = 0,
		Cy = 1
	};}
	namespace c_oSerPosHV{enum c_oSerPosHV
	{
		RelativeFrom = 0,
		Align = 1,
		PosOffset = 2
	};}
	namespace c_oSerSimplePos{enum c_oSerSimplePos
	{
		X = 0,
		Y = 1
	};}
	namespace c_oSerWrapSquare{enum c_oSerWrapSquare
	{
		DistL = 0,
		DistT = 1,
		DistR = 2,
		DistB = 3,
		WrapText = 4,
		EffectExtent = 5
	};}
	namespace c_oSerWrapThroughTight{enum c_oSerWrapThroughTight
	{
		DistL = 0,
		DistR = 1,
		WrapText = 2,
		WrapPolygon = 3
	};}
	namespace c_oSerWrapTopBottom{enum c_oSerWrapTopBottom
	{
		DistT = 0,
		DistB = 1,
		EffectExtent = 2
	};}
	namespace c_oSerWrapPolygon{enum c_oSerWrapPolygon
	{
		Edited = 0,
		Start = 1,
		ALineTo = 2,
		LineTo = 3
	};}
	namespace c_oSerPoint2D{enum c_oSerPoint2D
	{
		X = 0,
		Y = 1
	};}
	namespace c_oSerBorderType{enum c_oSerBorderType
	{
		Color = 0,
		Space = 1,
		Size = 2,
		Value = 3
	};}
	namespace c_oSerShdType{enum c_oSerShdType
	{
		Value = 0,
		Color = 1
	};}
	namespace c_oSerPaddingType{enum c_oSerPaddingType
	{
		left = 0,
		top = 1,
		right = 2,
		bottom = 3
	};}
	namespace c_oSerMarginsType{enum c_oSerMarginsType
	{
		left = 0,
		top = 1,
		right = 2,
		bottom = 3
	};}
	namespace c_oSerBordersType{enum c_oSerBordersType
	{
		left = 0,
		top = 1,
		right = 2,
		bottom = 3,
		insideV = 4,
		insideH = 5,
		start = 6,
		end = 7,
		tl2br = 8,
		tr2bl = 9,
		bar = 10,
		between = 11
	};}
	namespace c_oSerWidthType{enum c_oSerWidthType
	{
		Type = 0,
		W = 1,
		WDocx = 2
	};}
	namespace c_oSer_pgSzType{enum c_oSer_pgSzType
	{
		W = 0,
		H = 1,
		Orientation = 2
	};}
	namespace c_oSer_pgMarType{enum c_oSer_pgMarType
	{
		Left = 0,
		Top = 1,
		Right = 2,
		Bottom = 3,
		Header = 4,
		Footer = 5
	};}
	namespace c_oSer_ColorType{enum c_oSer_ColorType
	{
		None = 0,
		Auto = 1
	};}
	namespace c_oSer_CommentsType{enum c_oSer_CommentsType
	{
		Comment = 0,
		Id = 1,
		Initials = 2,
		UserName = 3,
		UserId = 4,
		Date = 5,
		Text = 6,
		QuoteText = 7,
		Solved = 8,
		Replies = 9
	};}
	namespace c_oSer_SettingsType{enum c_oSer_SettingsType
	{
		ClrSchemeMapping = 0,
		DefaultTabStop = 1,
		MathPr = 2
	};}
	namespace c_oSer_MathPrType{enum c_oSer_SettingsType
	{
		BrkBin = 0,
		BrkBinSub = 1,
		DefJc = 2,
		DispDef = 3,
		InterSp = 4,
		IntLim = 5,
		IntraSp = 6,
		LMargin = 7,
		MathFont = 8,
		NaryLim = 9,
		PostSp = 10,
		PreSp = 11,
		RMargin = 12,
		SmallFrac = 13,
		WrapIndent = 14,
		WrapRight = 15
	};}
	namespace c_oSer_ClrSchemeMappingType{enum c_oSer_ClrSchemeMappingType
	{
		Accent1 = 0,
		Accent2 = 1,
		Accent3 = 2,
		Accent4 = 3,
		Accent5 = 4,
		Accent6 = 5,
		Bg1 = 6,
		Bg2 = 7,
		FollowedHyperlink = 8,
		Hyperlink = 9,
		T1 = 10,
		T2 = 11
	};}
	namespace c_oSer_OMathBottomNodesType{enum c_oSer_OMathBottomNodesType
	{		
		Aln = 0,
		AlnScr = 1,
		ArgSz = 2,
		BaseJc = 3,
		BegChr = 4,
		Brk = 5,
		CGp = 6,
		CGpRule = 7,
		Chr = 8,
		Count = 9,
		CSp = 10,
		CtrlPr = 11,
		DegHide = 12,
		Diff = 13,
		EndChr = 14,
		Grow = 15,
		HideBot = 16,
		HideLeft = 17,
		HideRight = 18,
		HideTop = 19,
		MJc = 20,
		LimLoc = 21,
		Lit = 22,
		MaxDist = 23,
		McJc = 24,
		Mcs = 25,
		NoBreak = 26,
		Nor = 27,
		ObjDist = 28,
		OpEmu = 29,
		PlcHide = 30,
		Pos = 31,
		RSp = 32,
		RSpRule = 33,
		Scr = 34,
		SepChr = 35,
		Show = 36,
		Shp = 37,
		StrikeBLTR = 38,
		StrikeH = 39,
		StrikeTLBR = 40,
		StrikeV = 41,
		Sty = 42,
		SubHide = 43,
		SupHide = 44,
		Transp = 45,
		Type = 46,
		VertJc = 47,
		ZeroAsc = 48,
		ZeroDesc = 49,
		ZeroWid = 50,	
		Column = 51,
		Row = 52
	};}
	namespace c_oSer_OMathBottomNodesValType{enum c_oSer_OMathBottomNodesValType
	{		
		Val = 0,
		AlnAt = 1
	};}
	namespace c_oSer_OMathContentType{enum c_oSer_OMathContentType
	{		
		Acc = 0,
		AccPr = 1,
		ArgPr = 2,
		Bar = 3,
		BarPr = 4,
		BorderBox = 5,
		BorderBoxPr = 6,
		Box = 7,
		BoxPr = 8,
		Deg = 9,
		Den = 10,
		Delimiter = 11,
		DelimiterPr = 12,
		Element = 13,
		EqArr = 14,
		EqArrPr = 15,
		FName = 16,
		Fraction = 17,
		FPr = 18,
		Func = 19,
		FuncPr = 20,
		GroupChr = 21,
		GroupChrPr = 22,
		Lim = 23,
		LimLow = 24,
		LimLowPr = 25,
		LimUpp = 26,
		LimUppPr = 27,
		Matrix = 28,
		MathPr = 29,
		Mc = 30,
		McPr = 31,		
		MPr = 32,
		Mr = 33,
		Nary = 34,
		NaryPr = 35,
		Num = 36,
		OMath = 37,
		OMathPara = 38,
		OMathParaPr = 39,
		Phant = 40,
		PhantPr = 41,
		MRun = 42,
		Rad = 43,
		RadPr = 44,
		RPr = 45,
		MRPr = 46,
		SPre = 47,
		SPrePr = 48,
		SSub = 49,
		SSubPr = 50,
		SSubSup = 51,
		SSubSupPr = 52,
		SSup = 53,
		SSupPr = 54,
		Sub = 55,
		Sup = 56,
		MText = 57,
		CtrlPr = 58
	};}
	namespace c_oSer_FramePrType{ enum c_oSer_FramePrType
	{		
		DropCap = 0,
		H = 1,
		HAnchor = 2,
		HRule = 3,
		HSpace = 4,
		Lines = 5,
		VAnchor = 6,
		VSpace = 7,
		W = 8,
		Wrap = 9,
		X = 10,
		XAlign = 11,
		Y = 12,
		YAlign = 13
	};}
}
