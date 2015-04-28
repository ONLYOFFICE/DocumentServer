/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 "use strict";
var c_oSerFormat = {
    Version: 5,
    Signature: "DOCY"
};
var g_nCurFileVersion = c_oSerFormat.Version;
var c_oSerTableTypes = {
    Signature: 0,
    Info: 1,
    Media: 2,
    Numbering: 3,
    HdrFtr: 4,
    Style: 5,
    Document: 6,
    Other: 7,
    Comments: 8,
    Settings: 9
};
var c_oSerSigTypes = {
    Version: 0
};
var c_oSerHdrFtrTypes = {
    Header: 0,
    Footer: 1,
    HdrFtr_First: 2,
    HdrFtr_Even: 3,
    HdrFtr_Odd: 4,
    HdrFtr_Content: 5,
    HdrFtr_Y2: 6,
    HdrFtr_Y: 7
};
var c_oSerNumTypes = {
    AbstractNums: 0,
    AbstractNum: 1,
    AbstractNum_Id: 2,
    AbstractNum_Type: 3,
    AbstractNum_Lvls: 4,
    Lvl: 5,
    lvl_Format: 6,
    lvl_Jc: 7,
    lvl_LvlText: 8,
    lvl_LvlTextItem: 9,
    lvl_LvlTextItemText: 10,
    lvl_LvlTextItemNum: 11,
    lvl_Restart: 12,
    lvl_Start: 13,
    lvl_Suff: 14,
    lvl_ParaPr: 15,
    lvl_TextPr: 16,
    Nums: 17,
    Num: 18,
    Num_ANumId: 19,
    Num_NumId: 20,
    lvl_PStyle: 21,
    NumStyleLink: 22,
    StyleLink: 23
};
var c_oSerOtherTableTypes = {
    ImageMap: 0,
    ImageMap_Src: 1,
    EmbeddedFonts: 2,
    DocxTheme: 3
};
var c_oSerFontsTypes = {
    Name: 0
};
var c_oSerImageMapTypes = {
    Src: 0
};
var c_oSerStyleTypes = {
    Name: 0,
    BasedOn: 1,
    Next: 2
};
var c_oSer_st = {
    DefpPr: 0,
    DefrPr: 1,
    Styles: 2
};
var c_oSer_sts = {
    Style: 0,
    Style_Id: 1,
    Style_Name: 2,
    Style_BasedOn: 3,
    Style_Next: 4,
    Style_TextPr: 5,
    Style_ParaPr: 6,
    Style_TablePr: 7,
    Style_Default: 8,
    Style_Type: 9,
    Style_qFormat: 10,
    Style_uiPriority: 11,
    Style_hidden: 12,
    Style_semiHidden: 13,
    Style_unhideWhenUsed: 14,
    Style_RowPr: 15,
    Style_CellPr: 16,
    Style_TblStylePr: 17
};
var c_oSerProp_tblStylePrType = {
    TblStylePr: 0,
    Type: 1,
    RunPr: 2,
    ParPr: 3,
    TblPr: 4,
    TrPr: 5,
    TcPr: 6
};
var c_oSerProp_tblPrType = {
    Rows: 0,
    Cols: 1,
    Jc: 2,
    TableInd: 3,
    TableW: 4,
    TableCellMar: 5,
    TableBorders: 6,
    Shd: 7,
    tblpPr: 8,
    Look: 9,
    Style: 10,
    tblpPr2: 11,
    Layout: 12
};
var c_oSer_tblpPrType = {
    Page: 0,
    X: 1,
    Y: 2,
    Paddings: 3
};
var c_oSer_tblpPrType2 = {
    HorzAnchor: 0,
    TblpX: 1,
    TblpXSpec: 2,
    VertAnchor: 3,
    TblpY: 4,
    TblpYSpec: 5,
    Paddings: 6
};
var c_oSerProp_pPrType = {
    contextualSpacing: 0,
    Ind: 1,
    Ind_Left: 2,
    Ind_Right: 3,
    Ind_FirstLine: 4,
    Jc: 5,
    KeepLines: 6,
    KeepNext: 7,
    PageBreakBefore: 8,
    Spacing: 9,
    Spacing_Line: 10,
    Spacing_LineRule: 11,
    Spacing_Before: 12,
    Spacing_After: 13,
    Shd: 14,
    Tab: 17,
    Tab_Item: 18,
    Tab_Item_Pos: 19,
    Tab_Item_Val: 20,
    ParaStyle: 21,
    numPr: 22,
    numPr_lvl: 23,
    numPr_id: 24,
    WidowControl: 25,
    pPr_rPr: 26,
    pBdr: 27,
    Spacing_BeforeAuto: 28,
    Spacing_AfterAuto: 29,
    FramePr: 30,
    SectPr: 31
};
var c_oSerProp_rPrType = {
    Bold: 0,
    Italic: 1,
    Underline: 2,
    Strikeout: 3,
    FontAscii: 4,
    FontHAnsi: 5,
    FontAE: 6,
    FontCS: 7,
    FontSize: 8,
    Color: 9,
    VertAlign: 10,
    HighLight: 11,
    HighLightTyped: 12,
    RStyle: 13,
    Spacing: 14,
    DStrikeout: 15,
    Caps: 16,
    SmallCaps: 17,
    Position: 18,
    FontHint: 19,
    BoldCs: 20,
    ItalicCs: 21,
    FontSizeCs: 22,
    Cs: 23,
    Rtl: 24,
    Lang: 25,
    LangBidi: 26,
    LangEA: 27,
    ColorTheme: 28,
    Shd: 29,
    Vanish: 30
};
var c_oSerProp_rowPrType = {
    CantSplit: 0,
    GridAfter: 1,
    GridBefore: 2,
    Jc: 3,
    TableCellSpacing: 4,
    Height: 5,
    Height_Rule: 6,
    Height_Value: 7,
    WAfter: 8,
    WBefore: 9,
    WAfterBefore_W: 10,
    WAfterBefore_Type: 11,
    After: 12,
    Before: 13,
    TableHeader: 14
};
var c_oSerProp_cellPrType = {
    GridSpan: 0,
    Shd: 1,
    TableCellBorders: 2,
    TableCellW: 3,
    VAlign: 4,
    VMerge: 5,
    CellMar: 6
};
var c_oSerProp_secPrType = {
    pgSz: 0,
    pgMar: 1,
    setting: 2,
    headers: 3,
    footers: 4,
    hdrftrelem: 5,
    pageNumType: 6
};
var c_oSerProp_secPrSettingsType = {
    titlePg: 0,
    EvenAndOddHeaders: 1,
    SectionType: 2
};
var c_oSerProp_secPrPageNumType = {
    start: 0
};
var c_oSerParType = {
    Par: 0,
    pPr: 1,
    Content: 2,
    Table: 3,
    sectPr: 4,
    Run: 5,
    CommentStart: 6,
    CommentEnd: 7,
    OMathPara: 8,
    OMath: 9,
    Hyperlink: 10
};
var c_oSerDocTableType = {
    tblPr: 0,
    tblGrid: 1,
    tblGrid_Item: 2,
    Content: 3,
    Row: 4,
    Row_Pr: 4,
    Row_Content: 5,
    Cell: 6,
    Cell_Pr: 7,
    Cell_Content: 8
};
var c_oSerRunType = {
    run: 0,
    rPr: 1,
    tab: 2,
    pagenum: 3,
    pagebreak: 4,
    linebreak: 5,
    image: 6,
    table: 7,
    Content: 8,
    fldstart: 9,
    fldend: 10,
    CommentReference: 11,
    pptxDrawing: 12,
    _LastRun: 13,
    object: 14
};
var c_oSerImageType = {
    MediaId: 0,
    Type: 1,
    Width: 2,
    Height: 3,
    X: 4,
    Y: 5,
    Page: 6,
    Padding: 7
};
var c_oSerImageType2 = {
    Type: 0,
    PptxData: 1,
    AllowOverlap: 2,
    BehindDoc: 3,
    DistB: 4,
    DistL: 5,
    DistR: 6,
    DistT: 7,
    Hidden: 8,
    LayoutInCell: 9,
    Locked: 10,
    RelativeHeight: 11,
    BSimplePos: 12,
    EffectExtent: 13,
    Extent: 14,
    PositionH: 15,
    PositionV: 16,
    SimplePos: 17,
    WrapNone: 18,
    WrapSquare: 19,
    WrapThrough: 20,
    WrapTight: 21,
    WrapTopAndBottom: 22,
    Chart: 23,
    ChartImg: 24,
    Chart2: 25
};
var c_oSerEffectExtent = {
    Left: 0,
    Top: 1,
    Right: 2,
    Bottom: 3
};
var c_oSerExtent = {
    Cx: 0,
    Cy: 1
};
var c_oSerPosHV = {
    RelativeFrom: 0,
    Align: 1,
    PosOffset: 2
};
var c_oSerSimplePos = {
    X: 0,
    Y: 1
};
var c_oSerWrapSquare = {
    DistL: 0,
    DistT: 1,
    DistR: 2,
    DistB: 3,
    WrapText: 4,
    EffectExtent: 5
};
var c_oSerWrapThroughTight = {
    DistL: 0,
    DistR: 1,
    WrapText: 2,
    WrapPolygon: 3
};
var c_oSerWrapTopBottom = {
    DistT: 0,
    DistB: 1,
    EffectExtent: 2
};
var c_oSerWrapPolygon = {
    Edited: 0,
    Start: 1,
    ALineTo: 2,
    LineTo: 3
};
var c_oSerPoint2D = {
    X: 0,
    Y: 1
};
var c_oSerMarginsType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3
};
var c_oSerWidthType = {
    Type: 0,
    W: 1,
    WDocx: 2
};
var c_oSer_pgSzType = {
    W: 0,
    H: 1,
    Orientation: 2
};
var c_oSer_pgMarType = {
    Left: 0,
    Top: 1,
    Right: 2,
    Bottom: 3,
    Header: 4,
    Footer: 5
};
var c_oSer_ColorType = {
    None: 0,
    Auto: 1
};
var c_oSer_CommentsType = {
    Comment: 0,
    Id: 1,
    Initials: 2,
    UserName: 3,
    UserId: 4,
    Date: 5,
    Text: 6,
    QuoteText: 7,
    Solved: 8,
    Replies: 9
};
var c_oSer_StyleType = {
    Character: 1,
    Numbering: 2,
    Paragraph: 3,
    Table: 4
};
var c_oSer_SettingsType = {
    ClrSchemeMapping: 0,
    DefaultTabStop: 1,
    MathPr: 2
};
var c_oSer_MathPrType = {
    BrkBin: 0,
    BrkBinSub: 1,
    DefJc: 2,
    DispDef: 3,
    InterSp: 4,
    IntLim: 5,
    IntraSp: 6,
    LMargin: 7,
    MathFont: 8,
    NaryLim: 9,
    PostSp: 10,
    PreSp: 11,
    RMargin: 12,
    SmallFrac: 13,
    WrapIndent: 14,
    WrapRight: 15
};
var c_oSer_ClrSchemeMappingType = {
    Accent1: 0,
    Accent2: 1,
    Accent3: 2,
    Accent4: 3,
    Accent5: 4,
    Accent6: 5,
    Bg1: 6,
    Bg2: 7,
    FollowedHyperlink: 8,
    Hyperlink: 9,
    T1: 10,
    T2: 11
};
var c_oSer_FramePrType = {
    DropCap: 0,
    H: 1,
    HAnchor: 2,
    HRule: 3,
    HSpace: 4,
    Lines: 5,
    VAnchor: 6,
    VSpace: 7,
    W: 8,
    Wrap: 9,
    X: 10,
    XAlign: 11,
    Y: 12,
    YAlign: 13
};
var c_oSer_OMathBottomNodesType = {
    Aln: 0,
    AlnScr: 1,
    ArgSz: 2,
    BaseJc: 3,
    BegChr: 4,
    Brk: 5,
    CGp: 6,
    CGpRule: 7,
    Chr: 8,
    Count: 9,
    CSp: 10,
    CtrlPr: 11,
    DegHide: 12,
    Diff: 13,
    EndChr: 14,
    Grow: 15,
    HideBot: 16,
    HideLeft: 17,
    HideRight: 18,
    HideTop: 19,
    MJc: 20,
    LimLoc: 21,
    Lit: 22,
    MaxDist: 23,
    McJc: 24,
    Mcs: 25,
    NoBreak: 26,
    Nor: 27,
    ObjDist: 28,
    OpEmu: 29,
    PlcHide: 30,
    Pos: 31,
    RSp: 32,
    RSpRule: 33,
    Scr: 34,
    SepChr: 35,
    Show: 36,
    Shp: 37,
    StrikeBLTR: 38,
    StrikeH: 39,
    StrikeTLBR: 40,
    StrikeV: 41,
    Sty: 42,
    SubHide: 43,
    SupHide: 44,
    Transp: 45,
    Type: 46,
    VertJc: 47,
    ZeroAsc: 48,
    ZeroDesc: 49,
    ZeroWid: 50,
    Column: 51,
    Row: 52
};
var c_oSer_OMathBottomNodesValType = {
    Val: 0,
    AlnAt: 1
};
var c_oSer_OMathChrType = {
    Chr: 0,
    BegChr: 1,
    EndChr: 2,
    SepChr: 3
};
var c_oSer_OMathContentType = {
    Acc: 0,
    AccPr: 1,
    ArgPr: 2,
    Bar: 3,
    BarPr: 4,
    BorderBox: 5,
    BorderBoxPr: 6,
    Box: 7,
    BoxPr: 8,
    Deg: 9,
    Den: 10,
    Delimiter: 11,
    DelimiterPr: 12,
    Element: 13,
    EqArr: 14,
    EqArrPr: 15,
    FName: 16,
    Fraction: 17,
    FPr: 18,
    Func: 19,
    FuncPr: 20,
    GroupChr: 21,
    GroupChrPr: 22,
    Lim: 23,
    LimLow: 24,
    LimLowPr: 25,
    LimUpp: 26,
    LimUppPr: 27,
    Matrix: 28,
    MathPr: 29,
    Mc: 30,
    McPr: 31,
    MPr: 32,
    Mr: 33,
    Nary: 34,
    NaryPr: 35,
    Num: 36,
    OMath: 37,
    OMathPara: 38,
    OMathParaPr: 39,
    Phant: 40,
    PhantPr: 41,
    MRun: 42,
    Rad: 43,
    RadPr: 44,
    RPr: 45,
    MRPr: 46,
    SPre: 47,
    SPrePr: 48,
    SSub: 49,
    SSubPr: 50,
    SSubSup: 51,
    SSubSupPr: 52,
    SSup: 53,
    SSupPr: 54,
    Sub: 55,
    Sup: 56,
    MText: 57,
    CtrlPr: 58,
    pagebreak: 59,
    linebreak: 60,
    Run: 61
};
var c_oSer_HyperlinkType = {
    Content: 0,
    Link: 1,
    Anchor: 2,
    Tooltip: 3,
    History: 4,
    DocLocation: 5,
    TgtFrame: 6
};
var c_oSer_ColorThemeType = {
    Auto: 0,
    Color: 1,
    Tint: 2,
    Shade: 3
};
var ETblStyleOverrideType = {
    tblstyleoverridetypeBand1Horz: 0,
    tblstyleoverridetypeBand1Vert: 1,
    tblstyleoverridetypeBand2Horz: 2,
    tblstyleoverridetypeBand2Vert: 3,
    tblstyleoverridetypeFirstCol: 4,
    tblstyleoverridetypeFirstRow: 5,
    tblstyleoverridetypeLastCol: 6,
    tblstyleoverridetypeLastRow: 7,
    tblstyleoverridetypeNeCell: 8,
    tblstyleoverridetypeNwCell: 9,
    tblstyleoverridetypeSeCell: 10,
    tblstyleoverridetypeSwCell: 11,
    tblstyleoverridetypeWholeTable: 12
};
var EWmlColorSchemeIndex = {
    wmlcolorschemeindexAccent1: 0,
    wmlcolorschemeindexAccent2: 1,
    wmlcolorschemeindexAccent3: 2,
    wmlcolorschemeindexAccent4: 3,
    wmlcolorschemeindexAccent5: 4,
    wmlcolorschemeindexAccent6: 5,
    wmlcolorschemeindexDark1: 6,
    wmlcolorschemeindexDark2: 7,
    wmlcolorschemeindexFollowedHyperlink: 8,
    wmlcolorschemeindexHyperlink: 9,
    wmlcolorschemeindexLight1: 10,
    wmlcolorschemeindexLight2: 11
};
var EHint = {
    hintCs: 0,
    hintDefault: 1,
    hintEastAsia: 2
};
var ETblLayoutType = {
    tbllayouttypeAutofit: 1,
    tbllayouttypeFixed: 2
};
var ESectionMark = {
    sectionmarkContinious: 0,
    sectionmarkEvenPage: 1,
    sectionmarkNextColumn: 2,
    sectionmarkNextPage: 3,
    sectionmarkOddPage: 4
};
var EThemeColor = {
    themecolorAccent1: 0,
    themecolorAccent2: 1,
    themecolorAccent3: 2,
    themecolorAccent4: 3,
    themecolorAccent5: 4,
    themecolorAccent6: 5,
    themecolorBackground1: 6,
    themecolorBackground2: 7,
    themecolorDark1: 8,
    themecolorDark2: 9,
    themecolorFollowedHyperlink: 10,
    themecolorHyperlink: 11,
    themecolorLight1: 12,
    themecolorLight2: 13,
    themecolorNone: 14,
    themecolorText1: 15,
    themecolorText2: 16
};
var EWrap = {
    wrapAround: 0,
    wrapAuto: 1,
    wrapNone: 2,
    wrapNotBeside: 3,
    wrapThrough: 4,
    wrapTight: 5
};
var g_sErrorCharCountMessage = "g_sErrorCharCountMessage";
var g_nErrorCharCount = 30000;
var g_nErrorParagraphCount = 1000;
function CreateThemeUnifill(color, tint, shade) {
    var ret = null;
    if (null != color) {
        var id;
        switch (color) {
        case EThemeColor.themecolorAccent1:
            id = 0;
            break;
        case EThemeColor.themecolorAccent2:
            id = 1;
            break;
        case EThemeColor.themecolorAccent3:
            id = 2;
            break;
        case EThemeColor.themecolorAccent4:
            id = 3;
            break;
        case EThemeColor.themecolorAccent5:
            id = 4;
            break;
        case EThemeColor.themecolorAccent6:
            id = 5;
            break;
        case EThemeColor.themecolorBackground1:
            id = 6;
            break;
        case EThemeColor.themecolorBackground2:
            id = 7;
            break;
        case EThemeColor.themecolorDark1:
            id = 8;
            break;
        case EThemeColor.themecolorDark2:
            id = 9;
            break;
        case EThemeColor.themecolorFollowedHyperlink:
            id = 10;
            break;
        case EThemeColor.themecolorHyperlink:
            id = 11;
            break;
        case EThemeColor.themecolorLight1:
            id = 12;
            break;
        case EThemeColor.themecolorLight2:
            id = 13;
            break;
        case EThemeColor.themecolorNone:
            id = 14;
            break;
        case EThemeColor.themecolorText1:
            id = 15;
            break;
        case EThemeColor.themecolorText2:
            id = 16;
            break;
        }
        ret = new CUniFill();
        ret.setFill(new CSolidFill());
        ret.fill.setColor(new CUniColor());
        ret.fill.color.setColor(new CSchemeColor());
        ret.fill.color.color.setId(id);
        if (null != tint || null != shade) {
            ret.fill.color.setMods(new CColorModifiers());
            var mod;
            if (null != tint) {
                mod = new CColorMod();
                mod.setName("wordTint");
                mod.setVal(tint);
                ret.fill.color.Mods.addMod(mod);
            }
            if (null != shade) {
                mod = new CColorMod();
                mod.setName("wordShade");
                mod.setVal(shade);
                ret.fill.color.Mods.addMod(mod);
            }
        }
    }
    return ret;
}
function BinaryFileWriter(doc) {
    this.memory = new CMemory();
    this.Document = doc;
    this.nLastFilePos = 0;
    this.nRealTableCount = 0;
    this.nStart = 0;
    this.bs = new BinaryCommonWriter(this.memory);
    this.copyParams = {
        bLockCopyElems: null,
        itemCount: null,
        bdtw: null,
        oUsedNumIdMap: null,
        nNumIdIndex: null,
        oUsedStyleMap: null
    };
    this.Write = function () {
        window.global_pptx_content_writer._Start();
        this.WriteMainTable();
        window.global_pptx_content_writer._End();
        return this.GetResult();
    };
    this.Write2 = function () {
        window.global_pptx_content_writer._Start();
        this.WriteMainTable();
        window.global_pptx_content_writer._End();
    };
    this.GetResult = function () {
        return this.WriteFileHeader(this.memory.GetCurPosition()) + this.memory.GetBase64Memory();
    };
    this.WriteFileHeader = function (nDataSize) {
        return c_oSerFormat.Signature + ";v" + c_oSerFormat.Version + ";" + nDataSize + ";";
    };
    this.WriteMainTable = function () {
        this.WriteMainTableStart();
        this.WriteMainTableContent();
        this.WriteMainTableEnd();
    };
    this.WriteMainTableStart = function () {
        var nTableCount = 128;
        this.nRealTableCount = 0;
        this.nStart = this.memory.GetCurPosition();
        var nmtItemSize = 5;
        this.nLastFilePos = this.nStart + nTableCount * nmtItemSize;
        this.memory.WriteByte(0);
    };
    this.WriteMainTableContent = function () {
        this.WriteTable(c_oSerTableTypes.Signature, new BinarySigTableWriter(this.memory, this.Document));
        this.WriteTable(c_oSerTableTypes.Settings, new BinarySettingsTableWriter(this.memory, this.Document));
        var oMapCommentId = {};
        this.WriteTable(c_oSerTableTypes.Comments, new BinaryCommentsTableWriter(this.memory, this.Document, oMapCommentId));
        var oNumIdMap = {};
        this.WriteTable(c_oSerTableTypes.Numbering, new BinaryNumberingTableWriter(this.memory, this.Document, oNumIdMap));
        this.WriteTable(c_oSerTableTypes.Style, new BinaryStyleTableWriter(this.memory, this.Document, oNumIdMap));
        var oBinaryHeaderFooterTableWriter = new BinaryHeaderFooterTableWriter(this.memory, this.Document, oNumIdMap, oMapCommentId);
        this.WriteTable(c_oSerTableTypes.Document, new BinaryDocumentTableWriter(this.memory, this.Document, oMapCommentId, oNumIdMap, null, oBinaryHeaderFooterTableWriter));
        this.WriteTable(c_oSerTableTypes.HdrFtr, oBinaryHeaderFooterTableWriter);
        var oBinaryOtherTableWriter = new BinaryOtherTableWriter(this.memory, this.Document);
        this.WriteTable(c_oSerTableTypes.Other, oBinaryOtherTableWriter);
    };
    this.WriteMainTableEnd = function () {
        this.memory.Seek(this.nStart);
        this.memory.WriteByte(this.nRealTableCount);
        this.memory.Seek(this.nLastFilePos);
    };
    this.CopyStart = function () {
        var api = this.Document.DrawingDocument.m_oWordControl.m_oApi;
        window.global_pptx_content_writer.Start_UseFullUrl(documentOrigin + api.DocumentUrl);
        window.global_pptx_content_writer.Start_UseDocumentOrigin(documentOrigin);
        window.global_pptx_content_writer._Start();
        this.copyParams.bLockCopyElems = 0;
        this.copyParams.itemCount = 0;
        this.copyParams.oUsedNumIdMap = {};
        this.copyParams.nNumIdIndex = 1;
        this.copyParams.oUsedStyleMap = {};
        this.copyParams.bdtw = new BinaryDocumentTableWriter(this.memory, this.Document, null, this.copyParams.oUsedNumIdMap, this.copyParams, null);
        this.copyParams.nDocumentWriterTablePos = 0;
        this.copyParams.nDocumentWriterPos = 0;
        this.WriteMainTableStart();
        var oMapCommentId = {};
        this.WriteTable(c_oSerTableTypes.Comments, new BinaryCommentsTableWriter(this.memory, this.Document, oMapCommentId));
        this.copyParams.bdtw.oMapCommentId = oMapCommentId;
        this.copyParams.nDocumentWriterTablePos = this.WriteTableStart(c_oSerTableTypes.Document);
        this.copyParams.nDocumentWriterPos = this.bs.WriteItemWithLengthStart();
    };
    this.CopyParagraph = function (Item, selectedAll) {
        if (this.copyParams.bLockCopyElems > 0) {
            return;
        }
        var oThis = this;
        this.bs.WriteItem(c_oSerParType.Par, function () {
            oThis.copyParams.bdtw.WriteParapraph(Item, false, selectedAll);
        });
        this.copyParams.itemCount++;
    };
    this.CopyTable = function (Item, aRowElems, nMinGrid, nMaxGrid) {
        if (this.copyParams.bLockCopyElems > 0) {
            return;
        }
        var oThis = this;
        this.bs.WriteItem(c_oSerParType.Table, function () {
            oThis.copyParams.bdtw.WriteDocTable(Item, aRowElems, nMinGrid, nMaxGrid);
        });
        this.copyParams.itemCount++;
    };
    this.CopyEnd = function () {
        this.bs.WriteItemWithLengthEnd(this.copyParams.nDocumentWriterPos);
        this.WriteTableEnd(this.copyParams.nDocumentWriterTablePos);
        this.WriteTable(c_oSerTableTypes.Numbering, new BinaryNumberingTableWriter(this.memory, this.Document, {},
        this.copyParams.oUsedNumIdMap));
        this.WriteTable(c_oSerTableTypes.Style, new BinaryStyleTableWriter(this.memory, this.Document, this.copyParams.oUsedNumIdMap, this.copyParams.oUsedStyleMap));
        this.WriteMainTableEnd();
        window.global_pptx_content_writer._End();
        window.global_pptx_content_writer.End_UseFullUrl();
    };
    this.WriteTable = function (type, oTableSer) {
        var nCurPos = this.WriteTableStart(type);
        oTableSer.Write();
        this.WriteTableEnd(nCurPos);
    };
    this.WriteTableStart = function (type) {
        this.memory.WriteByte(type);
        this.memory.WriteLong(this.nLastFilePos);
        var nCurPos = this.memory.GetCurPosition();
        this.memory.Seek(this.nLastFilePos);
        return nCurPos;
    };
    this.WriteTableEnd = function (nCurPos) {
        this.nLastFilePos = this.memory.GetCurPosition();
        this.memory.Seek(nCurPos);
        this.nRealTableCount++;
    };
}
function BinarySigTableWriter(memory) {
    this.memory = memory;
    this.Write = function () {
        this.memory.WriteByte(c_oSerSigTypes.Version);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(c_oSerFormat.Version);
    };
}
function BinaryStyleTableWriter(memory, doc, oNumIdMap, oUsedStyleMap) {
    this.memory = memory;
    this.Document = doc;
    this.oUsedStyleMap = oUsedStyleMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.btblPrs = new Binary_tblPrWriter(this.memory, oNumIdMap);
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap, null);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteStylesContent();
        });
    };
    this.WriteStylesContent = function () {
        var oThis = this;
        var oStyles = this.Document.Styles;
        var oDef_pPr = oStyles.Default.ParaPr;
        var oDef_rPr = oStyles.Default.TextPr;
        this.bs.WriteItem(c_oSer_st.DefpPr, function () {
            oThis.bpPrs.Write_pPr(oDef_pPr);
        });
        this.bs.WriteItem(c_oSer_st.DefrPr, function () {
            oThis.brPrs.Write_rPr(oDef_rPr);
        });
        this.bs.WriteItem(c_oSer_st.Styles, function () {
            oThis.WriteStyles(oStyles.Style, oStyles.Default);
        });
    };
    this.WriteStyles = function (styles, oDefault) {
        var oThis = this;
        var oStyleToWrite = styles;
        if (null != this.oUsedStyleMap) {
            oStyleToWrite = this.oUsedStyleMap;
        }
        for (var styleId in oStyleToWrite) {
            var style = styles[styleId];
            var bDefault = false;
            if (styleId == oDefault.Character) {
                bDefault = true;
            } else {
                if (styleId == oDefault.Paragraph) {
                    bDefault = true;
                } else {
                    if (styleId == oDefault.Numbering) {
                        bDefault = true;
                    } else {
                        if (styleId == oDefault.Table) {
                            bDefault = true;
                        }
                    }
                }
            }
            this.bs.WriteItem(c_oSer_sts.Style, function () {
                oThis.WriteStyle(styleId, style, bDefault);
            });
        }
    };
    this.WriteStyle = function (id, style, bDefault) {
        var oThis = this;
        if (null != id) {
            this.memory.WriteByte(c_oSer_sts.Style_Id);
            this.memory.WriteString2(id.toString());
        }
        if (null != style.Name) {
            this.memory.WriteByte(c_oSer_sts.Style_Name);
            this.memory.WriteString2(style.Name.toString());
        }
        if (null != style.Type) {
            var nSerStyleType = c_oSer_StyleType.Paragraph;
            switch (style.Type) {
            case styletype_Character:
                nSerStyleType = c_oSer_StyleType.Character;
                break;
            case styletype_Numbering:
                nSerStyleType = c_oSer_StyleType.Numbering;
                break;
            case styletype_Paragraph:
                nSerStyleType = c_oSer_StyleType.Paragraph;
                break;
            case styletype_Table:
                nSerStyleType = c_oSer_StyleType.Table;
                break;
            }
            this.bs.WriteItem(c_oSer_sts.Style_Type, function () {
                oThis.memory.WriteByte(nSerStyleType);
            });
        }
        if (true == bDefault) {
            this.bs.WriteItem(c_oSer_sts.Style_Default, function () {
                oThis.memory.WriteBool(bDefault);
            });
        }
        if (null != style.BasedOn) {
            this.memory.WriteByte(c_oSer_sts.Style_BasedOn);
            this.memory.WriteString2(style.BasedOn.toString());
        }
        if (null != style.Next) {
            this.memory.WriteByte(c_oSer_sts.Style_Next);
            this.memory.WriteString2(style.Next.toString());
        }
        if (null != style.qFormat) {
            this.bs.WriteItem(c_oSer_sts.Style_qFormat, function () {
                oThis.memory.WriteBool(style.qFormat);
            });
        }
        if (null != style.uiPriority) {
            this.bs.WriteItem(c_oSer_sts.Style_uiPriority, function () {
                oThis.memory.WriteLong(style.uiPriority);
            });
        }
        if (null != style.hidden) {
            this.bs.WriteItem(c_oSer_sts.Style_hidden, function () {
                oThis.memory.WriteBool(style.hidden);
            });
        }
        if (null != style.semiHidden) {
            this.bs.WriteItem(c_oSer_sts.Style_semiHidden, function () {
                oThis.memory.WriteBool(style.semiHidden);
            });
        }
        if (null != style.unhideWhenUsed) {
            this.bs.WriteItem(c_oSer_sts.Style_unhideWhenUsed, function () {
                oThis.memory.WriteBool(style.unhideWhenUsed);
            });
        }
        if (null != style.TextPr) {
            this.bs.WriteItem(c_oSer_sts.Style_TextPr, function () {
                oThis.brPrs.Write_rPr(style.TextPr);
            });
        }
        if (null != style.ParaPr) {
            this.bs.WriteItem(c_oSer_sts.Style_ParaPr, function () {
                oThis.bpPrs.Write_pPr(style.ParaPr);
            });
        }
        if (styletype_Table == style.Type) {
            if (null != style.TablePr) {
                this.bs.WriteItem(c_oSer_sts.Style_TablePr, function () {
                    oThis.btblPrs.WriteTblPr(style.TablePr, null);
                });
            }
            if (null != style.TableRowPr) {
                this.bs.WriteItem(c_oSer_sts.Style_RowPr, function () {
                    oThis.btblPrs.WriteRowPr(style.TableRowPr);
                });
            }
            if (null != style.TableCellPr) {
                this.bs.WriteItem(c_oSer_sts.Style_CellPr, function () {
                    oThis.btblPrs.WriteCellPr(style.TableCellPr);
                });
            }
            var aTblStylePr = [];
            if (null != style.TableBand1Horz) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeBand1Horz,
                    val: style.TableBand1Horz
                });
            }
            if (null != style.TableBand1Vert) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeBand1Vert,
                    val: style.TableBand1Vert
                });
            }
            if (null != style.TableBand2Horz) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeBand2Horz,
                    val: style.TableBand2Horz
                });
            }
            if (null != style.TableBand2Vert) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeBand2Vert,
                    val: style.TableBand2Vert
                });
            }
            if (null != style.TableFirstCol) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeFirstCol,
                    val: style.TableFirstCol
                });
            }
            if (null != style.TableFirstRow) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeFirstRow,
                    val: style.TableFirstRow
                });
            }
            if (null != style.TableLastCol) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeLastCol,
                    val: style.TableLastCol
                });
            }
            if (null != style.TableLastRow) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeLastRow,
                    val: style.TableLastRow
                });
            }
            if (null != style.TableTLCell) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeNwCell,
                    val: style.TableTLCell
                });
            }
            if (null != style.TableTRCell) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeNeCell,
                    val: style.TableTRCell
                });
            }
            if (null != style.TableBLCell) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeSwCell,
                    val: style.TableBLCell
                });
            }
            if (null != style.TableBRCell) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeSeCell,
                    val: style.TableBRCell
                });
            }
            if (null != style.TableWholeTable) {
                aTblStylePr.push({
                    type: ETblStyleOverrideType.tblstyleoverridetypeWholeTable,
                    val: style.TableWholeTable
                });
            }
            if (aTblStylePr.length > 0) {
                this.bs.WriteItem(c_oSer_sts.Style_TblStylePr, function () {
                    oThis.WriteTblStylePr(aTblStylePr);
                });
            }
        }
    };
    this.WriteTblStylePr = function (aTblStylePr) {
        var oThis = this;
        for (var i = 0, length = aTblStylePr.length; i < length; ++i) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.TblStylePr, function () {
                oThis.WriteTblStyleProperty(aTblStylePr[i]);
            });
        }
    };
    this.WriteTblStyleProperty = function (oProp) {
        var oThis = this;
        var type = oProp.type;
        var val = oProp.val;
        this.bs.WriteItem(c_oSerProp_tblStylePrType.Type, function () {
            oThis.memory.WriteByte(type);
        });
        if (null != val.TextPr) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.RunPr, function () {
                oThis.brPrs.Write_rPr(val.TextPr);
            });
        }
        if (null != val.ParaPr) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.ParPr, function () {
                oThis.bpPrs.Write_pPr(val.ParaPr);
            });
        }
        if (null != val.TablePr) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.TblPr, function () {
                oThis.btblPrs.WriteTblPr(val.TablePr, null);
            });
        }
        if (null != val.TableRowPr) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.TrPr, function () {
                oThis.btblPrs.WriteRowPr(val.TableRowPr);
            });
        }
        if (null != val.TableCellPr) {
            this.bs.WriteItem(c_oSerProp_tblStylePrType.TcPr, function () {
                oThis.btblPrs.WriteCellPr(val.TableCellPr);
            });
        }
    };
}
function Binary_pPrWriter(memory, oNumIdMap, oBinaryHeaderFooterTableWriter) {
    this.memory = memory;
    this.oNumIdMap = oNumIdMap;
    this.oBinaryHeaderFooterTableWriter = oBinaryHeaderFooterTableWriter;
    this.bs = new BinaryCommonWriter(this.memory);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.Write_pPr = function (pPr, pPr_rPr, SectPr, oDocument) {
        var oThis = this;
        if (null != pPr.PStyle) {
            this.memory.WriteByte(c_oSerProp_pPrType.ParaStyle);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(pPr.PStyle);
        }
        if (null != pPr.NumPr) {
            var numPr = pPr.NumPr;
            var id = null;
            if (null != this.oNumIdMap && null != numPr.NumId) {
                id = this.oNumIdMap[numPr.NumId];
                if (null == id) {
                    id = 0;
                }
            }
            if (null != numPr.Lvl || null != id) {
                this.memory.WriteByte(c_oSerProp_pPrType.numPr);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteNumPr(id, numPr.Lvl);
                });
            }
        }
        if (null != pPr.ContextualSpacing) {
            this.memory.WriteByte(c_oSerProp_pPrType.contextualSpacing);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(pPr.ContextualSpacing);
        }
        if (null != pPr.Ind) {
            this.memory.WriteByte(c_oSerProp_pPrType.Ind);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteInd(pPr.Ind);
            });
        }
        if (null != pPr.Jc) {
            this.memory.WriteByte(c_oSerProp_pPrType.Jc);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(pPr.Jc);
        }
        if (null != pPr.KeepLines) {
            this.memory.WriteByte(c_oSerProp_pPrType.KeepLines);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(pPr.KeepLines);
        }
        if (null != pPr.KeepNext) {
            this.memory.WriteByte(c_oSerProp_pPrType.KeepNext);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(pPr.KeepNext);
        }
        if (null != pPr.PageBreakBefore) {
            this.memory.WriteByte(c_oSerProp_pPrType.PageBreakBefore);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(pPr.PageBreakBefore);
        }
        if (null != pPr.Spacing) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteSpacing(pPr.Spacing);
            });
        }
        if (null != pPr.Shd) {
            this.memory.WriteByte(c_oSerProp_pPrType.Shd);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteShd(pPr.Shd);
            });
        }
        if (null != pPr.WidowControl) {
            this.memory.WriteByte(c_oSerProp_pPrType.WidowControl);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(pPr.WidowControl);
        }
        if (null != pPr.Tabs && pPr.Tabs.Get_Count() > 0) {
            this.memory.WriteByte(c_oSerProp_pPrType.Tab);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteTabs(pPr.Tabs.Tabs);
            });
        }
        if (null != pPr_rPr) {
            this.memory.WriteByte(c_oSerProp_pPrType.pPr_rPr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.brPrs.Write_rPr(pPr_rPr);
            });
        }
        if (null != pPr.Brd) {
            this.memory.WriteByte(c_oSerProp_pPrType.pBdr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteBorders(pPr.Brd);
            });
        }
        if (null != pPr.FramePr) {
            this.memory.WriteByte(c_oSerProp_pPrType.FramePr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteFramePr(pPr.FramePr);
            });
        }
        if (null != SectPr && null != oDocument) {
            this.memory.WriteByte(c_oSerProp_pPrType.SectPr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteSectPr(SectPr, oDocument);
            });
        }
    };
    this.WriteInd = function (Ind) {
        if (null != Ind.Left) {
            this.memory.WriteByte(c_oSerProp_pPrType.Ind_Left);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Ind.Left);
        }
        if (null != Ind.Right) {
            this.memory.WriteByte(c_oSerProp_pPrType.Ind_Right);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Ind.Right);
        }
        if (null != Ind.FirstLine) {
            this.memory.WriteByte(c_oSerProp_pPrType.Ind_FirstLine);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Ind.FirstLine);
        }
    };
    this.WriteSpacing = function (Spacing) {
        if (null != Spacing.Line) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_Line);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Spacing.Line);
        }
        if (null != Spacing.LineRule) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_LineRule);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(Spacing.LineRule);
        }
        if (null != Spacing.BeforeAutoSpacing) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_BeforeAuto);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(Spacing.BeforeAutoSpacing);
        }
        if (null != Spacing.Before) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_Before);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Spacing.Before);
        }
        if (null != Spacing.AfterAutoSpacing) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_AfterAuto);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(Spacing.AfterAutoSpacing);
        }
        if (null != Spacing.After) {
            this.memory.WriteByte(c_oSerProp_pPrType.Spacing_After);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Spacing.After);
        }
    };
    this.WriteTabs = function (Tab) {
        var oThis = this;
        var nLen = Tab.length;
        for (var i = 0; i < nLen; ++i) {
            var tab = Tab[i];
            this.memory.WriteByte(c_oSerProp_pPrType.Tab_Item);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteTabItem(tab);
            });
        }
    };
    this.WriteTabItem = function (TabItem) {
        this.memory.WriteByte(c_oSerProp_pPrType.Tab_Item_Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        switch (TabItem.Value) {
        case tab_Right:
            this.memory.WriteByte(g_tabtype_right);
            break;
        case tab_Center:
            this.memory.WriteByte(g_tabtype_center);
            break;
        case tab_Clear:
            this.memory.WriteByte(g_tabtype_clear);
            break;
        default:
            this.memory.WriteByte(g_tabtype_left);
        }
        this.memory.WriteByte(c_oSerProp_pPrType.Tab_Item_Pos);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(TabItem.Pos);
    };
    this.WriteNumPr = function (id, lvl) {
        if (null != lvl) {
            this.memory.WriteByte(c_oSerProp_pPrType.numPr_lvl);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(lvl);
        }
        if (null != id) {
            this.memory.WriteByte(c_oSerProp_pPrType.numPr_id);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(id);
        }
    };
    this.WriteFramePr = function (oFramePr) {
        if (null != oFramePr.DropCap) {
            this.memory.WriteByte(c_oSer_FramePrType.DropCap);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.DropCap);
        }
        if (null != oFramePr.H) {
            this.memory.WriteByte(c_oSer_FramePrType.H);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.H);
        }
        if (null != oFramePr.HAnchor) {
            this.memory.WriteByte(c_oSer_FramePrType.HAnchor);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.HAnchor);
        }
        if (null != oFramePr.HRule) {
            this.memory.WriteByte(c_oSer_FramePrType.HRule);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.HRule);
        }
        if (null != oFramePr.HSpace) {
            this.memory.WriteByte(c_oSer_FramePrType.HSpace);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.HSpace);
        }
        if (null != oFramePr.Lines) {
            this.memory.WriteByte(c_oSer_FramePrType.Lines);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oFramePr.Lines);
        }
        if (null != oFramePr.VAnchor) {
            this.memory.WriteByte(c_oSer_FramePrType.VAnchor);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.VAnchor);
        }
        if (null != oFramePr.VSpace) {
            this.memory.WriteByte(c_oSer_FramePrType.VSpace);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.VSpace);
        }
        if (null != oFramePr.W) {
            this.memory.WriteByte(c_oSer_FramePrType.W);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.W);
        }
        if (null != oFramePr.Wrap) {
            var nFormatWrap = EWrap.None;
            switch (oFramePr.Wrap) {
            case wrap_Around:
                nFormatWrap = EWrap.wrapAround;
                break;
            case wrap_Auto:
                nFormatWrap = EWrap.wrapAuto;
                break;
            case wrap_None:
                nFormatWrap = EWrap.wrapNone;
                break;
            case wrap_NotBeside:
                nFormatWrap = EWrap.wrapNotBeside;
                break;
            case wrap_Through:
                nFormatWrap = EWrap.wrapThrough;
                break;
            case wrap_Tight:
                nFormatWrap = EWrap.wrapTight;
                break;
            }
            this.memory.WriteByte(c_oSer_FramePrType.Wrap);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nFormatWrap);
        }
        if (null != oFramePr.X) {
            this.memory.WriteByte(c_oSer_FramePrType.X);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.X);
        }
        if (null != oFramePr.XAlign) {
            this.memory.WriteByte(c_oSer_FramePrType.XAlign);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.XAlign);
        }
        if (null != oFramePr.Y) {
            this.memory.WriteByte(c_oSer_FramePrType.Y);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(g_dKoef_mm_to_twips * oFramePr.Y);
        }
        if (null != oFramePr.YAlign) {
            this.memory.WriteByte(c_oSer_FramePrType.YAlign);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.YAlign);
        }
    };
    this.WriteSectPr = function (sectPr, oDocument) {
        var oThis = this;
        this.bs.WriteItem(c_oSerProp_secPrType.pgSz, function () {
            oThis.WritePageSize(sectPr, oDocument);
        });
        this.bs.WriteItem(c_oSerProp_secPrType.pgMar, function () {
            oThis.WritePageMargin(sectPr, oDocument);
        });
        this.bs.WriteItem(c_oSerProp_secPrType.setting, function () {
            oThis.WritePageSetting(sectPr, oDocument);
        });
        if (null != sectPr.HeaderFirst || null != sectPr.HeaderEven || null != sectPr.HeaderDefault) {
            this.bs.WriteItem(c_oSerProp_secPrType.headers, function () {
                oThis.WriteHdr(sectPr);
            });
        }
        if (null != sectPr.FooterFirst || null != sectPr.FooterEven || null != sectPr.FooterDefault) {
            this.bs.WriteItem(c_oSerProp_secPrType.footers, function () {
                oThis.WriteFtr(sectPr);
            });
        }
        var PageNumType = sectPr.Get_PageNum_Start();
        if (-1 != PageNumType) {
            this.bs.WriteItem(c_oSerProp_secPrType.pageNumType, function () {
                oThis.WritePageNumType(PageNumType);
            });
        }
    };
    this.WritePageSize = function (sectPr, oDocument) {
        var oThis = this;
        this.memory.WriteByte(c_oSer_pgSzType.W);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageWidth());
        this.memory.WriteByte(c_oSer_pgSzType.H);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageHeight());
        this.memory.WriteByte(c_oSer_pgSzType.Orientation);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(sectPr.Get_Orientation());
    };
    this.WritePageMargin = function (sectPr, oDocument) {
        this.memory.WriteByte(c_oSer_pgMarType.Left);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargin_Left());
        this.memory.WriteByte(c_oSer_pgMarType.Top);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargin_Top());
        this.memory.WriteByte(c_oSer_pgMarType.Right);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargin_Right());
        this.memory.WriteByte(c_oSer_pgMarType.Bottom);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargin_Bottom());
        this.memory.WriteByte(c_oSer_pgMarType.Header);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargins_Header());
        this.memory.WriteByte(c_oSer_pgMarType.Footer);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(sectPr.Get_PageMargins_Footer());
    };
    this.WritePageSetting = function (sectPr, oDocument) {
        var titlePg = sectPr.Get_TitlePage();
        if (titlePg) {
            this.memory.WriteByte(c_oSerProp_secPrSettingsType.titlePg);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(titlePg);
        }
        if (EvenAndOddHeaders) {
            this.memory.WriteByte(c_oSerProp_secPrSettingsType.EvenAndOddHeaders);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(EvenAndOddHeaders);
        }
        var nFormatType = null;
        switch (sectPr.Get_Type()) {
        case section_type_Continuous:
            nFormatType = ESectionMark.sectionmarkContinious;
            break;
        case section_type_EvenPage:
            nFormatType = ESectionMark.sectionmarkEvenPage;
            break;
        case section_type_Column:
            nFormatType = ESectionMark.sectionmarkNextColumn;
            break;
        case section_type_NextPage:
            nFormatType = ESectionMark.sectionmarkNextPage;
            break;
        case section_type_OddPage:
            nFormatType = ESectionMark.sectionmarkOddPage;
            break;
        }
        if (null != nFormatType) {
            this.memory.WriteByte(c_oSerProp_secPrSettingsType.SectionType);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nFormatType);
        }
    };
    this.WriteHdr = function (sectPr) {
        var oThis = this;
        var nIndex;
        if (null != this.oBinaryHeaderFooterTableWriter) {
            if (null != sectPr.HeaderDefault) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aHeaders.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aHeaders.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_Odd,
                    elem: sectPr.HeaderDefault
                });
            }
            if (null != sectPr.HeaderEven) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aHeaders.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aHeaders.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_Even,
                    elem: sectPr.HeaderEven
                });
            }
            if (null != sectPr.HeaderFirst) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aHeaders.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aHeaders.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_First,
                    elem: sectPr.HeaderFirst
                });
            }
        }
    };
    this.WriteFtr = function (sectPr) {
        var oThis = this;
        var nIndex;
        if (null != this.oBinaryHeaderFooterTableWriter) {
            if (null != sectPr.FooterDefault) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aFooters.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aFooters.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_Odd,
                    elem: sectPr.FooterDefault
                });
            }
            if (null != sectPr.FooterEven) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aFooters.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aFooters.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_Even,
                    elem: sectPr.FooterEven
                });
            }
            if (null != sectPr.FooterFirst) {
                nIndex = this.oBinaryHeaderFooterTableWriter.aFooters.length;
                this.bs.WriteItem(c_oSerProp_secPrType.hdrftrelem, function () {
                    oThis.memory.WriteLong(nIndex);
                });
                this.oBinaryHeaderFooterTableWriter.aFooters.push({
                    type: c_oSerHdrFtrTypes.HdrFtr_First,
                    elem: sectPr.FooterFirst
                });
            }
        }
    };
    this.WritePageNumType = function (PageNumType) {
        var oThis = this;
        this.bs.WriteItem(c_oSerProp_secPrPageNumType.start, function () {
            oThis.memory.WriteLong(PageNumType);
        });
    };
}
function Binary_rPrWriter(memory) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write_rPr = function (rPr) {
        var _this = this;
        if (null != rPr.Bold) {
            var bold = rPr.Bold;
            this.memory.WriteByte(c_oSerProp_rPrType.Bold);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(bold);
        }
        if (null != rPr.Italic) {
            var italic = rPr.Italic;
            this.memory.WriteByte(c_oSerProp_rPrType.Italic);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(italic);
        }
        if (null != rPr.Underline) {
            this.memory.WriteByte(c_oSerProp_rPrType.Underline);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.Underline);
        }
        if (null != rPr.Strikeout) {
            this.memory.WriteByte(c_oSerProp_rPrType.Strikeout);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.Strikeout);
        }
        if (null != rPr.RFonts) {
            var font = rPr.RFonts;
            if (null != font.Ascii) {
                this.memory.WriteByte(c_oSerProp_rPrType.FontAscii);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(font.Ascii.Name);
            }
            if (null != font.HAnsi) {
                this.memory.WriteByte(c_oSerProp_rPrType.FontHAnsi);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(font.HAnsi.Name);
            }
            if (null != font.CS) {
                this.memory.WriteByte(c_oSerProp_rPrType.FontCS);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(font.CS.Name);
            }
            if (null != font.EastAsia) {
                this.memory.WriteByte(c_oSerProp_rPrType.FontAE);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(font.EastAsia.Name);
            }
            if (null != font.Hint) {
                var nHint;
                switch (font.Hint) {
                case fonthint_CS:
                    nHint = EHint.hintCs;
                    break;
                case fonthint_EastAsia:
                    nHint = EHint.hintEastAsia;
                    break;
                default:
                    nHint = EHint.hintDefault;
                    break;
                }
                this.memory.WriteByte(c_oSerProp_rPrType.FontHint);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(nHint);
            }
        }
        if (null != rPr.FontSize) {
            this.memory.WriteByte(c_oSerProp_rPrType.FontSize);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(rPr.FontSize * 2);
        }
        var color = null;
        if (null != rPr.Color) {
            color = rPr.Color;
        } else {
            if (null != rPr.Unifill) {
                var doc = editor.WordControl.m_oLogicDocument;
                rPr.Unifill.check(doc.Get_Theme(), doc.Get_ColorMap());
                var RGBA = rPr.Unifill.getRGBAColor();
                color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
            }
        }
        if (null != color && !color.Auto) {
            this.bs.WriteColor(c_oSerProp_rPrType.Color, color);
        }
        if (null != rPr.VertAlign) {
            this.memory.WriteByte(c_oSerProp_rPrType.VertAlign);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(rPr.VertAlign);
        }
        if (null != rPr.HighLight) {
            if (highlight_None == rPr.HighLight) {
                this.memory.WriteByte(c_oSerProp_rPrType.HighLightTyped);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(c_oSer_ColorType.None);
            } else {
                this.bs.WriteColor(c_oSerProp_rPrType.HighLight, rPr.HighLight);
            }
        }
        if (null != rPr.RStyle) {
            this.memory.WriteByte(c_oSerProp_rPrType.RStyle);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(rPr.RStyle);
        }
        if (null != rPr.Spacing) {
            this.memory.WriteByte(c_oSerProp_rPrType.Spacing);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(rPr.Spacing);
        }
        if (null != rPr.DStrikeout) {
            this.memory.WriteByte(c_oSerProp_rPrType.DStrikeout);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.DStrikeout);
        }
        if (null != rPr.Caps) {
            this.memory.WriteByte(c_oSerProp_rPrType.Caps);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.Caps);
        }
        if (null != rPr.SmallCaps) {
            this.memory.WriteByte(c_oSerProp_rPrType.SmallCaps);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.SmallCaps);
        }
        if (null != rPr.Position) {
            this.memory.WriteByte(c_oSerProp_rPrType.Position);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(rPr.Position);
        }
        if (null != rPr.BoldCS) {
            this.memory.WriteByte(c_oSerProp_rPrType.BoldCs);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.BoldCS);
        }
        if (null != rPr.ItalicCS) {
            this.memory.WriteByte(c_oSerProp_rPrType.ItalicCs);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.ItalicCS);
        }
        if (null != rPr.FontSizeCS) {
            this.memory.WriteByte(c_oSerProp_rPrType.FontSizeCs);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(rPr.FontSizeCS * 2);
        }
        if (null != rPr.CS) {
            this.memory.WriteByte(c_oSerProp_rPrType.Cs);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.CS);
        }
        if (null != rPr.RTL) {
            this.memory.WriteByte(c_oSerProp_rPrType.Rtl);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.RTL);
        }
        if (null != rPr.Lang) {
            if (null != rPr.Lang.Val) {
                this.memory.WriteByte(c_oSerProp_rPrType.Lang);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(g_oLcidIdToNameMap[rPr.Lang.Val]);
            }
            if (null != rPr.Lang.Bidi) {
                this.memory.WriteByte(c_oSerProp_rPrType.LangBidi);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(g_oLcidIdToNameMap[rPr.Lang.Bidi]);
            }
            if (null != rPr.Lang.EastAsia) {
                this.memory.WriteByte(c_oSerProp_rPrType.LangEA);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.memory.WriteString2(g_oLcidIdToNameMap[rPr.Lang.EastAsia]);
            }
        }
        if (null != rPr.Unifill || (null != rPr.Color && rPr.Color.Auto)) {
            this.memory.WriteByte(c_oSerProp_rPrType.ColorTheme);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                _this.bs.WriteColorTheme(rPr.Unifill, rPr.Color);
            });
        }
        if (null != rPr.Shd) {
            this.memory.WriteByte(c_oSerProp_rPrType.Shd);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                _this.bs.WriteShd(rPr.Shd);
            });
        }
        if (null != rPr.Vanish) {
            this.memory.WriteByte(c_oSerProp_rPrType.Vanish);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rPr.Vanish);
        }
    };
}
function Binary_oMathWriter(memory, oMathPara) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.WriteMathElem = function (item) {
        var oThis = this;
        switch (item.Type) {
        case para_Math_Composition:
            switch (item.kind) {
            case MATH_ACCENT:
                this.bs.WriteItem(c_oSer_OMathContentType.Acc, function () {
                    oThis.WriteAcc(item);
                });
                break;
            case MATH_BAR:
                this.bs.WriteItem(c_oSer_OMathContentType.Bar, function () {
                    oThis.WriteBar(item);
                });
                break;
            case MATH_BORDER_BOX:
                this.bs.WriteItem(c_oSer_OMathContentType.BorderBox, function () {
                    oThis.WriteBorderBox(item);
                });
                break;
            case MATH_BOX:
                this.bs.WriteItem(c_oSer_OMathContentType.Box, function () {
                    oThis.WriteBox(item);
                });
                break;
            case "CCtrlPr":
                this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                    oThis.WriteCtrlPr(item);
                });
                break;
            case MATH_DELIMITER:
                this.bs.WriteItem(c_oSer_OMathContentType.Delimiter, function () {
                    oThis.WriteDelimiter(item);
                });
                break;
            case MATH_EQ_ARRAY:
                this.bs.WriteItem(c_oSer_OMathContentType.EqArr, function () {
                    oThis.WriteEqArr(item);
                });
                break;
            case MATH_FRACTION:
                this.bs.WriteItem(c_oSer_OMathContentType.Fraction, function () {
                    oThis.WriteFraction(item);
                });
                break;
            case MATH_FUNCTION:
                this.bs.WriteItem(c_oSer_OMathContentType.Func, function () {
                    oThis.WriteFunc(item);
                });
                break;
            case MATH_GROUP_CHARACTER:
                this.bs.WriteItem(c_oSer_OMathContentType.GroupChr, function () {
                    oThis.WriteGroupChr(item);
                });
                break;
            case MATH_LIMIT:
                if (LIMIT_LOW == item.Pr.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.LimLow, function () {
                        oThis.WriteLimLow(item);
                    });
                } else {
                    if (LIMIT_UP == item.Pr.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.LimUpp, function () {
                            oThis.WriteLimUpp(item);
                        });
                    }
                }
                break;
            case MATH_MATRIX:
                this.bs.WriteItem(c_oSer_OMathContentType.Matrix, function () {
                    oThis.WriteMatrix(item);
                });
                break;
            case MATH_NARY:
                this.bs.WriteItem(c_oSer_OMathContentType.Nary, function () {
                    oThis.WriteNary(item);
                });
                break;
            case "OMath":
                this.bs.WriteItem(c_oSer_OMathContentType.OMath, function () {
                    oThis.WriteArgNodes(item);
                });
                break;
            case "OMathPara":
                this.bs.WriteItem(c_oSer_OMathContentType.OMathPara, function () {
                    oThis.WriteOMathPara(item);
                });
                break;
            case MATH_PHANTOM:
                this.bs.WriteItem(c_oSer_OMathContentType.Phant, function () {
                    oThis.WritePhant(item);
                });
                break;
            case MATH_RUN:
                this.bs.WriteItem(c_oSer_OMathContentType.MRun, function () {
                    oThis.WriteMRun(item);
                });
                break;
            case MATH_RADICAL:
                this.bs.WriteItem(c_oSer_OMathContentType.Rad, function () {
                    oThis.WriteRad(item);
                });
                break;
            case MATH_DEGREESubSup:
                if (DEGREE_PreSubSup == item.Pr.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.SPre, function () {
                        oThis.WriteSPre(item);
                    });
                } else {
                    if (DEGREE_SubSup == item.Pr.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.SSubSup, function () {
                            oThis.WriteSSubSup(item);
                        });
                    }
                }
                break;
            case MATH_DEGREE:
                if (DEGREE_SUBSCRIPT == item.Pr.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.SSub, function () {
                        oThis.WriteSSub(item);
                    });
                } else {
                    if (DEGREE_SUPERSCRIPT == item.Pr.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.SSup, function () {
                            oThis.WriteSSup(item);
                        });
                    }
                }
                break;
            }
            break;
        case para_Math_Text:
            this.bs.WriteItem(c_oSer_OMathContentType.MText, function () {
                oThis.memory.WriteString2(convertUnicodeToUTF16([item.value]));
            });
            break;
        case para_Math_Run:
            this.bs.WriteItem(c_oSer_OMathContentType.MRun, function () {
                oThis.WriteMRun(item);
            });
            break;
        default:
            break;
        }
    },
    this.WriteArgNodes = function (oElem) {
        if (oElem) {
            var oThis = this;
            var nStart = 0;
            var nEnd = oElem.Content.length;
            var argSz = oElem.GetArgSize();
            if (argSz) {
                this.bs.WriteItem(c_oSer_OMathContentType.ArgPr, function () {
                    oThis.WriteArgPr(argSz);
                });
            }
            for (var i = nStart; i <= nEnd - 1; i++) {
                var item = oElem.Content[i];
                this.WriteMathElem(item);
            }
        }
    };
    this.WriteMRun = function (oMRun) {
        var oThis = this;
        var props = oMRun.getPropsForWrite();
        var oText = "";
        var ContentLen = oMRun.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            var Item = oMRun.Content[CurPos];
            switch (Item.Type) {
            case para_Math_Ampersand:
                oText += "&";
                break;
            case para_Math_Text:
                oText += convertUnicodeToUTF16([Item.value]);
                break;
            case para_Space:
                case para_Tab:
                oText += " ";
                break;
            }
        }
        this.bs.WriteItem(c_oSer_OMathContentType.RPr, function () {
            oThis.brPrs.Write_rPr(props.wRPrp);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.MRPr, function () {
            oThis.WriteMRPr(props.mathRPrp);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.MText, function () {
            oThis.WriteMText(oText.toString());
        });
    };
    this.WriteMText = function (sText) {
        if ("" != sText) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(sText);
        }
    };
    this.WriteAcc = function (oAcc) {
        var oThis = this;
        var oElem = oAcc.getBase();
        var props = oAcc.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.AccPr, function () {
            oThis.WriteAccPr(props, oAcc);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteAccPr = function (props, oAcc) {
        var oThis = this;
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteChr(props.chr);
            });
        }
        if (null != oAcc.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oAcc);
            });
        }
    };
    this.WriteAln = function (Aln) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Aln);
    };
    this.WriteAlnScr = function (AlnScr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(AlnScr);
    };
    this.WriteArgPr = function (nArgSz) {
        var oThis = this;
        this.bs.WriteItem(c_oSer_OMathBottomNodesType.ArgSz, function () {
            oThis.WriteArgSz(nArgSz);
        });
    };
    this.WriteArgSz = function (ArgSz) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(ArgSz);
    };
    this.WriteBar = function (oBar) {
        var oThis = this;
        var oElem = oBar.getBase();
        var props = oBar.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.BarPr, function () {
            oThis.WriteBarPr(props, oBar);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteBarPr = function (props, oBar) {
        var oThis = this;
        if (null != props.pos) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Pos, function () {
                oThis.WritePos(props.pos);
            });
        }
        if (null != oBar.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oBar);
            });
        }
    };
    this.WriteBaseJc = function (BaseJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscYAlign.Center;
        switch (BaseJc) {
        case BASEJC_BOTTOM:
            val = c_oAscYAlign.Bottom;
            break;
        case BASEJC_CENTER:
            val = c_oAscYAlign.Center;
            break;
        case BASEJC_TOP:
            val = c_oAscYAlign.Top;
        }
        this.memory.WriteByte(val);
    };
    this.WriteBorderBox = function (oBorderBox) {
        var oThis = this;
        var oElem = oBorderBox.getBase();
        var props = oBorderBox.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.BorderBoxPr, function () {
            oThis.WriteBorderBoxPr(props, oBorderBox);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteBorderBoxPr = function (props, oBorderBox) {
        var oThis = this;
        if (null != props.hideBot) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideBot, function () {
                oThis.WriteHideBot(props.hideBot);
            });
        }
        if (null != props.hideLeft) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideLeft, function () {
                oThis.WriteHideLeft(props.hideLeft);
            });
        }
        if (null != props.hideRight) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideRight, function () {
                oThis.WriteHideRight(props.hideRight);
            });
        }
        if (null != props.hideTop) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideTop, function () {
                oThis.WriteHideTop(props.hideTop);
            });
        }
        if (null != props.strikeBLTR) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeBLTR, function () {
                oThis.WriteStrikeBLTR(props.strikeBLTR);
            });
        }
        if (null != props.strikeH) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeH, function () {
                oThis.WriteStrikeH(props.strikeH);
            });
        }
        if (null != props.strikeTLBR) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeTLBR, function () {
                oThis.WriteStrikeTLBR(props.strikeTLBR);
            });
        }
        if (null != props.strikeV) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeV, function () {
                oThis.WriteStrikeV(props.strikeV);
            });
        }
        if (null != oBorderBox.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oBorderBox);
            });
        }
    };
    this.WriteBox = function (oBox) {
        var oThis = this;
        var oElem = oBox.getBase();
        var props = oBox.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.BoxPr, function () {
            oThis.WriteBoxPr(props, oBox);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteBoxPr = function (props, oBox) {
        var oThis = this;
        if (null != props.aln) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Aln, function () {
                oThis.WriteAln(props.aln);
            });
        }
        if (null != props.brk) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Brk, function () {
                oThis.WriteBrk(props.brk);
            });
        }
        if (null != props.diff) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Diff, function () {
                oThis.WriteDiff(props.diff);
            });
        }
        if (null != props.noBreak) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.NoBreak, function () {
                oThis.WriteNoBreak(props.noBreak);
            });
        }
        if (null != props.opEmu) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.OpEmu, function () {
                oThis.WriteOpEmu(props.opEmu);
            });
        }
        if (null != oBox.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oBox);
            });
        }
    };
    this.WriteBrk = function (Brk) {
        if (Brk.alnAt) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.AlnAt);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(Brk.alnAt);
        } else {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(false);
        }
    };
    this.WriteCGp = function (CGp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(CGp);
    };
    this.WriteCGpRule = function (CGpRule) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(CGpRule);
    };
    this.WriteChr = function (Chr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        if (OPERATOR_EMPTY === Chr) {
            this.memory.WriteString2("");
        } else {
            this.memory.WriteString2(convertUnicodeToUTF16([Chr]));
        }
    };
    this.WriteCount = function (Count) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(Count);
    };
    this.WriteCSp = function (CSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(CSp);
    };
    this.WriteCtrlPr = function (oElem) {
        var oThis = this;
        this.bs.WriteItem(c_oSerRunType.rPr, function () {
            oThis.brPrs.Write_rPr(oElem.CtrPrp);
        });
    };
    this.WriteDegHide = function (DegHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(DegHide);
    };
    this.WriteDiff = function (Diff) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Diff);
    };
    this.WriteDelimiter = function (oDelimiter) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oDelimiter.nCol;
        var props = oDelimiter.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.DelimiterPr, function () {
            oThis.WriteDelimiterPr(props, oDelimiter);
        });
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oDelimiter.getBase(i);
            this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
                oThis.WriteArgNodes(oElem);
            });
        }
    };
    this.WriteDelimiterPr = function (props, oDelimiter) {
        var oThis = this;
        if (null != props.column) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Column, function () {
                oThis.WriteCount(props.column);
            });
        }
        if (null != props.begChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BegChr, function () {
                oThis.WriteChr(props.begChr);
            });
        }
        if (null != props.endChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.EndChr, function () {
                oThis.WriteChr(props.endChr);
            });
        }
        if (null != props.grow) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Grow, function () {
                oThis.WriteGrow(props.grow);
            });
        }
        if (null != props.sepChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SepChr, function () {
                oThis.WriteChr(props.sepChr);
            });
        }
        if (null != props.shp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Shp, function () {
                oThis.WriteShp(props.shp);
            });
        }
        if (null != oDelimiter.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oDelimiter);
            });
        }
    };
    this.WriteEqArr = function (oEqArr) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oEqArr.elements.length;
        var props = oEqArr.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.EqArrPr, function () {
            oThis.WriteEqArrPr(props, oEqArr);
        });
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oEqArr.getElement(i);
            this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
                oThis.WriteArgNodes(oElem);
            });
        }
    };
    this.WriteEqArrPr = function (props, oEqArr) {
        var oThis = this;
        if (null != props.row) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Row, function () {
                oThis.WriteCount(props.row);
            });
        }
        if (null != props.baseJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BaseJc, function () {
                oThis.WriteBaseJc(props.baseJc);
            });
        }
        if (null != props.maxDist) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.MaxDist, function () {
                oThis.WriteMaxDist(props.maxDist);
            });
        }
        if (null != props.objDist) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ObjDist, function () {
                oThis.WriteObjDist(props.objDist);
            });
        }
        if (null != props.rSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSp, function () {
                oThis.WriteRSp(props.rSp);
            });
        }
        if (null != props.rSpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSpRule, function () {
                oThis.WriteRSpRule(props.rSpRule);
            });
        }
        if (null != oEqArr.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oEqArr);
            });
        }
    };
    this.WriteFraction = function (oFraction) {
        var oThis = this;
        var oDen = oFraction.getDenominator();
        var oNum = oFraction.getNumerator();
        var props = oFraction.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.FPr, function () {
            oThis.WriteFPr(props, oFraction);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Den, function () {
            oThis.WriteArgNodes(oDen);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Num, function () {
            oThis.WriteArgNodes(oNum);
        });
    };
    this.WriteFPr = function (props, oFraction) {
        var oThis = this;
        if (null != props.type) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Type, function () {
                oThis.WriteType(props.type);
            });
        }
        if (null != oFraction.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oFraction);
            });
        }
    };
    this.WriteFunc = function (oFunc) {
        var oThis = this;
        var oFName = oFunc.getFName();
        var oElem = oFunc.getArgument();
        this.bs.WriteItem(c_oSer_OMathContentType.FuncPr, function () {
            oThis.WriteFuncPr(oFunc);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.FName, function () {
            oThis.WriteArgNodes(oFName);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteFuncPr = function (oFunc) {
        var oThis = this;
        if (null != oFunc.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oFunc);
            });
        }
    };
    this.WriteGroupChr = function (oGroupChr) {
        var oThis = this;
        var oElem = oGroupChr.getBase();
        var props = oGroupChr.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.GroupChrPr, function () {
            oThis.WriteGroupChrPr(props, oGroupChr);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteGroupChrPr = function (props, oGroupChr) {
        var oThis = this;
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteChr(props.chr);
            });
        }
        if (null != props.pos) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Pos, function () {
                oThis.WritePos(props.pos);
            });
        }
        if (null != props.vertJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.VertJc, function () {
                oThis.WriteVertJc(props.vertJc);
            });
        }
        if (null != oGroupChr.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oGroupChr);
            });
        }
    };
    this.WriteGrow = function (Grow) {
        if (!Grow) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(Grow);
        }
    };
    this.WriteHideBot = function (HideBot) {
        if (HideBot) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(HideBot);
        }
    };
    this.WriteHideLeft = function (HideLeft) {
        if (HideLeft) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(HideLeft);
        }
    };
    this.WriteHideRight = function (HideRight) {
        if (HideRight) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(HideRight);
        }
    };
    this.WriteHideTop = function (HideTop) {
        if (HideTop) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(HideTop);
        }
    };
    this.WriteLimLoc = function (LimLoc) {
        if (LimLoc != 1) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            var val = c_oAscLimLoc.SubSup;
            switch (LimLoc) {
            case NARY_SubSup:
                val = c_oAscLimLoc.SubSup;
                break;
            case NARY_UndOvr:
                val = c_oAscLimLoc.UndOvr;
            }
            this.memory.WriteByte(val);
        }
    };
    this.WriteLimLow = function (oLimLow) {
        var oThis = this;
        var oElem = oLimLow.getFName();
        var oLim = oLimLow.getIterator();
        this.bs.WriteItem(c_oSer_OMathContentType.LimLowPr, function () {
            oThis.WriteLimLowPr(oLimLow);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Lim, function () {
            oThis.WriteArgNodes(oLim);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteLimLowPr = function (oLimLow) {
        var oThis = this;
        if (null != oLimLow.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oLimLow);
            });
        }
    };
    this.WriteLimUpp = function (oLimUpp) {
        var oThis = this;
        var oElem = oLimUpp.getFName();
        var oLim = oLimUpp.getIterator();
        this.bs.WriteItem(c_oSer_OMathContentType.LimUppPr, function () {
            oThis.WriteLimUppPr(oLimUpp);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Lim, function () {
            oThis.WriteArgNodes(oLim);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteLimUppPr = function (oLimUpp) {
        var oThis = this;
        if (null != oLimUpp.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oLimUpp);
            });
        }
    };
    this.WriteLit = function (Lit) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Lit);
    };
    this.WriteMaxDist = function (MaxDist) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(MaxDist);
    };
    this.WriteMatrix = function (oMatrix) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oMatrix.nRow;
        var props = oMatrix.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.MPr, function () {
            oThis.WriteMPr(props, oMatrix);
        });
        for (var i = nStart; i < nEnd; i++) {
            this.bs.WriteItem(c_oSer_OMathContentType.Mr, function () {
                oThis.WriteMr(oMatrix, i);
            });
        }
    };
    this.WriteMc = function (props) {
        var oThis = this;
        this.bs.WriteItem(c_oSer_OMathContentType.McPr, function () {
            oThis.WriteMcPr(props);
        });
    };
    this.WriteMJc = function (MJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscXAlign.Left;
        switch (MJc) {
        case JC_CENTER:
            val = c_oAscMathJc.Center;
            break;
        case JC_CENTERGROUP:
            val = c_oAscMathJc.CenterGroup;
            break;
        case JC_LEFT:
            val = c_oAscMathJc.Left;
            break;
        case JC_RIGHT:
            val = c_oAscMathJc.Right;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMcPr = function (props) {
        var oThis = this;
        if (null != props.mcJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.McJc, function () {
                oThis.WriteMcJc(props.mcJc);
            });
        }
        if (null != props.count) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Count, function () {
                oThis.WriteCount(props.count);
            });
        }
    };
    this.WriteMcJc = function (MJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(MJc);
    };
    this.WriteMcs = function (props) {
        var oThis = this;
        for (var Index = 0, Count = props.mcs.length; Index < Count; Index++) {
            this.bs.WriteItem(c_oSer_OMathContentType.Mc, function () {
                oThis.WriteMc(props.mcs[Index]);
            });
        }
    };
    this.WriteMPr = function (props, oMatrix) {
        var oThis = this;
        if (null != props.row) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Row, function () {
                oThis.WriteCount(props.row);
            });
        }
        if (null != props.baseJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BaseJc, function () {
                oThis.WriteBaseJc(props.baseJc);
            });
        }
        if (null != props.cGp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CGp, function () {
                oThis.WriteCGp(props.cGp);
            });
        }
        if (null != props.cGpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CGpRule, function () {
                oThis.WriteCGpRule(props.cGpRule);
            });
        }
        if (null != props.cSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CSp, function () {
                oThis.WriteCSp(props.cSp);
            });
        }
        if (null != props.mcs) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Mcs, function () {
                oThis.WriteMcs(props);
            });
        }
        if (null != props.plcHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.PlcHide, function () {
                oThis.WritePlcHide(props.plcHide);
            });
        }
        if (null != props.rSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSp, function () {
                oThis.WriteRSp(props.rSp);
            });
        }
        if (null != props.rSpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSpRule, function () {
                oThis.WriteRSpRule(props.rSpRule);
            });
        }
        if (null != oMatrix.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oMatrix);
            });
        }
    };
    this.WriteMr = function (oMatrix, nRow) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oMatrix.nCol;
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oMatrix.getElement(nRow, i);
            this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
                oThis.WriteArgNodes(oElem);
            });
        }
    };
    this.WriteNary = function (oNary) {
        var oThis = this;
        var oElem = oNary.getBase();
        var oSub = oNary.getLowerIterator();
        var oSup = oNary.getUpperIterator();
        var props = oNary.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.NaryPr, function () {
            oThis.WriteNaryPr(props, oNary);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sub, function () {
            oThis.WriteArgNodes(oSub);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sup, function () {
            oThis.WriteArgNodes(oSup);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteNaryPr = function (props, oNary) {
        var oThis = this;
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteChr(props.chr);
            });
        }
        if (null != props.grow) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Grow, function () {
                oThis.WriteGrow(props.grow);
            });
        }
        if (null != props.limLoc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.LimLoc, function () {
                oThis.WriteLimLoc(props.limLoc);
            });
        }
        if (null != props.subHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SubHide, function () {
                oThis.WriteSubHide(props.subHide);
            });
        }
        if (null != props.supHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SupHide, function () {
                oThis.WriteSupHide(props.supHide);
            });
        }
        if (null != oNary.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oNary);
            });
        }
    };
    this.WriteNoBreak = function (NoBreak) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(NoBreak);
    };
    this.WriteNor = function (Nor) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Nor);
    };
    this.WriteObjDist = function (ObjDist) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ObjDist);
    };
    this.WriteOMathPara = function (oOMathPara) {
        var oThis = this;
        var props = {};
        oThis.bs.WriteItem(c_oSer_OMathContentType.OMathParaPr, function () {
            oThis.WriteOMathParaPr(props);
        });
        oThis.bs.WriteItem(c_oSer_OMathContentType.OMath, function () {
            oThis.WriteArgNodes(oOMathPara.Root);
        });
    };
    this.WriteOMathParaPr = function (props) {
        var oThis = this;
        if (null != props.mJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.MJc, function () {
                oThis.WriteMJc(props.mJc);
            });
        }
    };
    this.WriteOpEmu = function (OpEmu) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(OpEmu);
    };
    this.WritePhant = function (oPhant) {
        var oThis = this;
        var oElem = oPhant.getBase();
        var props = oPhant.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.PhantPr, function () {
            oThis.WritePhantPr(props, oPhant);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WritePhantPr = function (props, oPhant) {
        var oThis = this;
        if (null != props.show) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Show, function () {
                oThis.WriteShow(props.show);
            });
        }
        if (null != props.transp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Transp, function () {
                oThis.WriteTransp(props.transp);
            });
        }
        if (null != props.zeroAsc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroAsc, function () {
                oThis.WriteZeroAsc(props.zeroAsc);
            });
        }
        if (null != props.zeroDesc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroDesc, function () {
                oThis.WriteZeroDesc(props.zeroDesc);
            });
        }
        if (null != props.zeroWid) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroWid, function () {
                oThis.WriteZeroWid(props.zeroWid);
            });
        }
        if (null != oPhant.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oPhant);
            });
        }
    };
    this.WritePlcHide = function (PlcHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(PlcHide);
    };
    this.WritePos = function (Pos) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscTopBot.Bot;
        switch (Pos) {
        case LOCATION_BOT:
            val = c_oAscTopBot.Bot;
            break;
        case LOCATION_TOP:
            val = c_oAscTopBot.Top;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMRPr = function (props) {
        var oThis = this;
        if (null != props.aln) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Aln, function () {
                oThis.WriteAln(props.aln);
            });
        }
        if (null != props.brk) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Brk, function () {
                oThis.WriteBrk(props.brk);
            });
        }
        if (null != props.lit) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Lit, function () {
                oThis.WriteLit(props.lit);
            });
        }
        if (null != props.nor) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Nor, function () {
                oThis.WriteNor(props.nor);
            });
        }
        if (null != props.scr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Scr, function () {
                oThis.WriteScr(props.scr);
            });
        }
        if (null != props.sty) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Sty, function () {
                oThis.WriteSty(props.sty);
            });
        }
    };
    this.WriteRad = function (oRad) {
        var oThis = this;
        var oElem = oRad.getBase();
        var oDeg = oRad.getDegree();
        var props = oRad.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.RadPr, function () {
            oThis.WriteRadPr(props, oRad);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Deg, function () {
            oThis.WriteArgNodes(oDeg);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteRadPr = function (props, oRad) {
        var oThis = this;
        if (null != props.degHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.DegHide, function () {
                oThis.WriteDegHide(props.degHide);
            });
        }
        if (null != oRad.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oRad);
            });
        }
    };
    this.WriteRSp = function (RSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(RSp);
    };
    this.WriteRSpRule = function (RSpRule) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(RSpRule);
    };
    this.WriteScr = function (Scr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscScript.Roman;
        switch (Scr) {
        case TXT_DOUBLE_STRUCK:
            val = c_oAscScript.DoubleStruck;
            break;
        case TXT_FRAKTUR:
            val = c_oAscScript.Fraktur;
            break;
        case TXT_MONOSPACE:
            val = c_oAscScript.Monospace;
            break;
        case TXT_ROMAN:
            val = c_oAscScript.Roman;
            break;
        case TXT_SANS_SERIF:
            val = c_oAscScript.SansSerif;
            break;
        case TXT_SCRIPT:
            val = c_oAscScript.Script;
            break;
        }
        this.memory.WriteByte(val);
    };
    this.WriteShow = function (Show) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Show);
    };
    this.WriteShp = function (Shp) {
        if (Shp != 1) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            var val = c_oAscShp.Centered;
            switch (Shp) {
            case DELIMITER_SHAPE_CENTERED:
                val = c_oAscShp.Centered;
                break;
            case DELIMITER_SHAPE_MATH:
                val = c_oAscShp.Match;
            }
            this.memory.WriteByte(val);
        }
    };
    this.WriteSPre = function (oSPre) {
        var oThis = this;
        var oSub = oSPre.getLowerIterator();
        var oSup = oSPre.getUpperIterator();
        var oElem = oSPre.getBase();
        this.bs.WriteItem(c_oSer_OMathContentType.SPrePr, function () {
            oThis.WriteSPrePr(oSPre);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sub, function () {
            oThis.WriteArgNodes(oSub);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sup, function () {
            oThis.WriteArgNodes(oSup);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
    };
    this.WriteSPrePr = function (oSPre) {
        var oThis = this;
        if (null != oSPre.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oSPre);
            });
        }
    };
    this.WriteSSub = function (oSSub) {
        var oThis = this;
        var oSub = oSSub.getLowerIterator();
        var oElem = oSSub.getBase();
        this.bs.WriteItem(c_oSer_OMathContentType.SSubPr, function () {
            oThis.WriteSSubPr(oSSub);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sub, function () {
            oThis.WriteArgNodes(oSub);
        });
    };
    this.WriteSSubPr = function (oSSub) {
        var oThis = this;
        if (null != oSSub.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oSSub);
            });
        }
    };
    this.WriteSSubSup = function (oSSubSup) {
        var oThis = this;
        var oSub = oSSubSup.getLowerIterator();
        var oSup = oSSubSup.getUpperIterator();
        var oElem = oSSubSup.getBase();
        var props = oSSubSup.getPropsForWrite();
        this.bs.WriteItem(c_oSer_OMathContentType.SSubSupPr, function () {
            oThis.WriteSSubSupPr(props, oSSubSup);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sub, function () {
            oThis.WriteArgNodes(oSub);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sup, function () {
            oThis.WriteArgNodes(oSup);
        });
    };
    this.WriteSSubSupPr = function (props, oSSubSup) {
        var oThis = this;
        if (null != props.alnScr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.AlnScr, function () {
                oThis.WriteAlnScr(props.alnScr);
            });
        }
        if (null != oSSubSup.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oSSubSup);
            });
        }
    };
    this.WriteSSup = function (oSSup) {
        var oThis = this;
        var oSup = oSSup.getUpperIterator();
        var oElem = oSSup.getBase();
        this.bs.WriteItem(c_oSer_OMathContentType.SSupPr, function () {
            oThis.WriteSSupPr(oSSup);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Element, function () {
            oThis.WriteArgNodes(oElem);
        });
        this.bs.WriteItem(c_oSer_OMathContentType.Sup, function () {
            oThis.WriteArgNodes(oSup);
        });
    };
    this.WriteSSupPr = function (oSSup) {
        var oThis = this;
        if (null != oSSup.CtrPrp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CtrlPr, function () {
                oThis.WriteCtrlPr(oSSup);
            });
        }
    };
    this.WriteStrikeBLTR = function (StrikeBLTR) {
        if (StrikeBLTR) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(StrikeBLTR);
        }
    };
    this.WriteStrikeH = function (StrikeH) {
        if (StrikeH) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(StrikeH);
        }
    };
    this.WriteStrikeTLBR = function (StrikeTLBR) {
        if (StrikeTLBR) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(StrikeTLBR);
        }
    };
    this.WriteStrikeV = function (StrikeV) {
        if (StrikeV) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(StrikeV);
        }
    };
    this.WriteSty = function (Sty) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscSty.BoldItalic;
        switch (Sty) {
        case STY_BOLD:
            val = c_oAscSty.Bold;
            break;
        case STY_BI:
            val = c_oAscSty.BoldItalic;
            break;
        case STY_ITALIC:
            val = c_oAscSty.Italic;
            break;
        case STY_PLAIN:
            val = c_oAscSty.Plain;
        }
        this.memory.WriteByte(val);
    };
    this.WriteSubHide = function (SubHide) {
        if (SubHide) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(SubHide);
        }
    };
    this.WriteSupHide = function (SupHide) {
        if (SupHide) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(SupHide);
        }
    };
    this.WriteTransp = function (Transp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Transp);
    };
    this.WriteType = function (Type) {
        if (Type != 0) {
            this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            var val = c_oAscFType.Bar;
            switch (Type) {
            case BAR_FRACTION:
                val = c_oAscFType.Bar;
                break;
            case LINEAR_FRACTION:
                val = c_oAscFType.Lin;
                break;
            case NO_BAR_FRACTION:
                val = c_oAscFType.NoBar;
                break;
            case SKEWED_FRACTION:
                val = c_oAscFType.Skw;
            }
            this.memory.WriteByte(val);
        }
    };
    this.WriteVertJc = function (VertJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscTopBot.Bot;
        switch (VertJc) {
        case VJUST_BOT:
            val = c_oAscTopBot.Bot;
            break;
        case VJUST_TOP:
            val = c_oAscTopBot.Top;
        }
        this.memory.WriteByte(val);
    };
    this.WriteZeroAsc = function (ZeroAsc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroAsc);
    };
    this.WriteZeroDesc = function (ZeroDesc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroDesc);
    };
    this.WriteZeroWid = function (ZeroWid) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroWid);
    };
}
function Binary_tblPrWriter(memory, oNumIdMap) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap, null);
}
Binary_tblPrWriter.prototype = {
    WriteTbl: function (table) {
        var oThis = this;
        this.WriteTblPr(table.Pr, table);
        var oLook = table.Get_TableLook();
        if (null != oLook) {
            var nLook = 0;
            if (oLook.Is_FirstCol()) {
                nLook |= 128;
            }
            if (oLook.Is_FirstRow()) {
                nLook |= 32;
            }
            if (oLook.Is_LastCol()) {
                nLook |= 256;
            }
            if (oLook.Is_LastRow()) {
                nLook |= 64;
            }
            if (!oLook.Is_BandHor()) {
                nLook |= 512;
            }
            if (!oLook.Is_BandVer()) {
                nLook |= 1024;
            }
            this.bs.WriteItem(c_oSerProp_tblPrType.Look, function () {
                oThis.memory.WriteLong(nLook);
            });
        }
        var sStyle = table.Get_TableStyle();
        if (null != sStyle && "" != sStyle) {
            this.memory.WriteByte(c_oSerProp_tblPrType.Style);
            this.memory.WriteString2(sStyle);
        }
    },
    WriteTblPr: function (tblPr, table) {
        var oThis = this;
        if (null != tblPr.Jc) {
            this.bs.WriteItem(c_oSerProp_tblPrType.Jc, function () {
                oThis.memory.WriteByte(tblPr.Jc);
            });
        }
        if (null != tblPr.TableInd) {
            this.bs.WriteItem(c_oSerProp_tblPrType.TableInd, function () {
                oThis.memory.WriteDouble(tblPr.TableInd);
            });
        }
        if (null != tblPr.TableW) {
            this.bs.WriteItem(c_oSerProp_tblPrType.TableW, function () {
                oThis.WriteW(tblPr.TableW);
            });
        }
        if (null != tblPr.TableCellMar) {
            this.bs.WriteItem(c_oSerProp_tblPrType.TableCellMar, function () {
                oThis.WriteCellMar(tblPr.TableCellMar);
            });
        }
        if (null != tblPr.TableBorders) {
            this.bs.WriteItem(c_oSerProp_tblPrType.TableBorders, function () {
                oThis.bs.WriteBorders(tblPr.TableBorders);
            });
        }
        if (null != tblPr.Shd && shd_Nil != tblPr.Shd.Value) {
            this.bs.WriteItem(c_oSerProp_tblPrType.Shd, function () {
                oThis.bs.WriteShd(tblPr.Shd);
            });
        }
        if (null != tblPr.TableLayout) {
            var nLayout = ETblLayoutType.tbllayouttypeAutofit;
            switch (tblPr.TableLayout) {
            case tbllayout_AutoFit:
                nLayout = ETblLayoutType.tbllayouttypeAutofit;
                break;
            case tbllayout_Fixed:
                nLayout = ETblLayoutType.tbllayouttypeFixed;
                break;
            }
            this.bs.WriteItem(c_oSerProp_tblPrType.Layout, function () {
                oThis.memory.WriteByte(nLayout);
            });
        }
        if (null != table && false == table.Inline) {
            this.bs.WriteItem(c_oSerProp_tblPrType.tblpPr2, function () {
                oThis.Write_tblpPr2(table);
            });
        }
    },
    WriteCellMar: function (cellMar) {
        var oThis = this;
        if (null != cellMar.Left) {
            this.bs.WriteItem(c_oSerMarginsType.left, function () {
                oThis.WriteW(cellMar.Left);
            });
        }
        if (null != cellMar.Top) {
            this.bs.WriteItem(c_oSerMarginsType.top, function () {
                oThis.WriteW(cellMar.Top);
            });
        }
        if (null != cellMar.Right) {
            this.bs.WriteItem(c_oSerMarginsType.right, function () {
                oThis.WriteW(cellMar.Right);
            });
        }
        if (null != cellMar.Bottom) {
            this.bs.WriteItem(c_oSerMarginsType.bottom, function () {
                oThis.WriteW(cellMar.Bottom);
            });
        }
    },
    Write_tblpPr2: function (table) {
        var oThis = this;
        if (null != table.PositionH) {
            var PositionH = table.PositionH;
            if (null != PositionH.RelativeFrom) {
                this.memory.WriteByte(c_oSer_tblpPrType2.HorzAnchor);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(PositionH.RelativeFrom);
            }
            if (true == PositionH.Align) {
                this.memory.WriteByte(c_oSer_tblpPrType2.TblpXSpec);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(PositionH.Value);
            } else {
                this.memory.WriteByte(c_oSer_tblpPrType2.TblpX);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(PositionH.Value);
            }
        }
        if (null != table.PositionV) {
            var PositionV = table.PositionV;
            if (null != PositionV.RelativeFrom) {
                this.memory.WriteByte(c_oSer_tblpPrType2.VertAnchor);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(PositionV.RelativeFrom);
            }
            if (true == PositionV.Align) {
                this.memory.WriteByte(c_oSer_tblpPrType2.TblpYSpec);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(PositionV.Value);
            } else {
                this.memory.WriteByte(c_oSer_tblpPrType2.TblpY);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(PositionV.Value);
            }
        }
        if (null != table.Distance) {
            this.memory.WriteByte(c_oSer_tblpPrType2.Paddings);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WritePaddings(table.Distance);
            });
        }
    },
    WriteRowPr: function (rowPr) {
        var oThis = this;
        if (null != rowPr.CantSplit) {
            this.memory.WriteByte(c_oSerProp_rowPrType.CantSplit);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rowPr.CantSplit);
        }
        if (null != rowPr.GridAfter || null != rowPr.WAfter) {
            this.memory.WriteByte(c_oSerProp_rowPrType.After);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteAfter(rowPr);
            });
        }
        if (null != rowPr.GridBefore || null != rowPr.WBefore) {
            this.memory.WriteByte(c_oSerProp_rowPrType.Before);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteBefore(rowPr);
            });
        }
        if (null != rowPr.Jc) {
            this.memory.WriteByte(c_oSerProp_rowPrType.Jc);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(rowPr.Jc);
        }
        if (null != rowPr.TableCellSpacing) {
            this.memory.WriteByte(c_oSerProp_rowPrType.TableCellSpacing);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(rowPr.TableCellSpacing);
        }
        if (null != rowPr.Height && heightrule_Auto != rowPr.Height.HRule) {
            this.memory.WriteByte(c_oSerProp_rowPrType.Height);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteRowHeight(rowPr.Height);
            });
        }
        if (true == rowPr.TableHeader) {
            this.memory.WriteByte(c_oSerProp_rowPrType.TableHeader);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(rowPr.TableHeader);
        }
    },
    WriteAfter: function (After) {
        var oThis = this;
        if (null != After.GridAfter) {
            this.memory.WriteByte(c_oSerProp_rowPrType.GridAfter);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(After.GridAfter);
        }
        if (null != After.WAfter) {
            this.memory.WriteByte(c_oSerProp_rowPrType.WAfter);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteW(After.WAfter);
            });
        }
    },
    WriteBefore: function (Before) {
        var oThis = this;
        if (null != Before.GridBefore) {
            this.memory.WriteByte(c_oSerProp_rowPrType.GridBefore);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(Before.GridBefore);
        }
        if (null != Before.WBefore) {
            this.memory.WriteByte(c_oSerProp_rowPrType.WBefore);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteW(Before.WBefore);
            });
        }
    },
    WriteRowHeight: function (rowHeight) {
        if (null != rowHeight.HRule) {
            this.memory.WriteByte(c_oSerProp_rowPrType.Height_Rule);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(rowHeight.HRule);
        }
        if (null != rowHeight.Value) {
            this.memory.WriteByte(c_oSerProp_rowPrType.Height_Value);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(rowHeight.Value);
        }
    },
    WriteW: function (WAfter) {
        if (tblwidth_Pct != WAfter.Type) {
            if (null != WAfter.Type) {
                this.memory.WriteByte(c_oSerWidthType.Type);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(WAfter.Type);
            }
            if (null != WAfter.W) {
                var nVal = WAfter.W;
                if (tblwidth_Mm == WAfter.Type) {
                    nVal = Math.round(g_dKoef_mm_to_twips * WAfter.W);
                }
                this.memory.WriteByte(c_oSerWidthType.WDocx);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(nVal);
            }
        }
    },
    WriteCellPr: function (cellPr, vMerge) {
        var oThis = this;
        if (null != cellPr.GridSpan) {
            this.memory.WriteByte(c_oSerProp_cellPrType.GridSpan);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(cellPr.GridSpan);
        }
        if (null != cellPr.Shd && shd_Nil != cellPr.Shd.Value) {
            this.memory.WriteByte(c_oSerProp_cellPrType.Shd);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteShd(cellPr.Shd);
            });
        }
        if (null != cellPr.TableCellBorders) {
            this.memory.WriteByte(c_oSerProp_cellPrType.TableCellBorders);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteBorders(cellPr.TableCellBorders);
            });
        }
        if (null != cellPr.TableCellMar) {
            this.memory.WriteByte(c_oSerProp_cellPrType.CellMar);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteCellMar(cellPr.TableCellMar);
            });
        }
        if (null != cellPr.TableCellW) {
            this.memory.WriteByte(c_oSerProp_cellPrType.TableCellW);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteW(cellPr.TableCellW);
            });
        }
        if (null != cellPr.VAlign) {
            this.memory.WriteByte(c_oSerProp_cellPrType.VAlign);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(cellPr.VAlign);
        }
        var nVMerge = null;
        if (null != cellPr.VMerge) {
            nVMerge = cellPr.VMerge;
        } else {
            if (null != vMerge) {
                nVMerge = vMerge;
            }
        }
        if (null != nVMerge) {
            this.memory.WriteByte(c_oSerProp_cellPrType.VMerge);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nVMerge);
        }
    }
};
function BinaryHeaderFooterTableWriter(memory, doc, oNumIdMap, oMapCommentId) {
    this.memory = memory;
    this.Document = doc;
    this.oNumIdMap = oNumIdMap;
    this.oMapCommentId = oMapCommentId;
    this.aHeaders = [];
    this.aFooters = [];
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteHeaderFooterContent();
        });
    };
    this.WriteHeaderFooterContent = function () {
        var oThis = this;
        if (this.aHeaders.length > 0) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.Header, function () {
                oThis.WriteHdrFtrContent(oThis.aHeaders);
            });
        }
        if (this.aFooters.length > 0) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.Footer, function () {
                oThis.WriteHdrFtrContent(oThis.aFooters);
            });
        }
    };
    this.WriteHdrFtrContent = function (aHdrFtr) {
        var oThis = this;
        for (var i = 0, length = aHdrFtr.length; i < length; ++i) {
            var item = aHdrFtr[i];
            this.bs.WriteItem(item.type, function () {
                oThis.WriteHdrFtrItem(item.elem);
            });
        }
    };
    this.WriteHdrFtrItem = function (item) {
        var oThis = this;
        var dtw = new BinaryDocumentTableWriter(this.memory, this.Document, this.oMapCommentId, this.oNumIdMap, null, null);
        this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_Content, function () {
            dtw.WriteDocumentContent(item.Content);
        });
    };
}
function BinaryNumberingTableWriter(memory, doc, oNumIdMap, oUsedNumIdMap) {
    this.memory = memory;
    this.Document = doc;
    this.oNumIdMap = oNumIdMap;
    this.oUsedNumIdMap = oUsedNumIdMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.bpPrs = new Binary_pPrWriter(this.memory, null != this.oUsedNumIdMap ? this.oUsedNumIdMap : this.oNumIdMap, null);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteNumberingContent();
        });
    };
    this.WriteNumberingContent = function () {
        var oThis = this;
        if (null != this.Document.Numbering && this.Document.Numbering.AbstractNum) {
            var ANums = this.Document.Numbering.AbstractNum;
            this.bs.WriteItem(c_oSerNumTypes.AbstractNums, function () {
                oThis.WriteAbstractNums(ANums);
            });
            this.bs.WriteItem(c_oSerNumTypes.Nums, function () {
                oThis.WriteNums(ANums);
            });
        }
    };
    this.WriteNums = function (nums) {
        var oThis = this;
        var index = 0;
        if (null != this.oUsedNumIdMap) {
            for (var i in this.oUsedNumIdMap) {
                this.bs.WriteItem(c_oSerNumTypes.Num, function () {
                    oThis.WriteNum(i, oThis.oUsedNumIdMap[i] - 1);
                });
            }
        } else {
            for (var i in nums) {
                this.bs.WriteItem(c_oSerNumTypes.Num, function () {
                    oThis.WriteNum(i, index);
                });
                index++;
            }
        }
    };
    this.WriteNum = function (id, index) {
        var oThis = this;
        this.memory.WriteByte(c_oSerNumTypes.Num_ANumId);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(index);
        this.memory.WriteByte(c_oSerNumTypes.Num_NumId);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(index + 1);
        this.oNumIdMap[id] = index + 1;
    };
    this.WriteAbstractNums = function (nums) {
        var oThis = this;
        var index = 0;
        var aNumsToWrite = nums;
        if (null != this.oUsedNumIdMap) {
            for (var i in this.oUsedNumIdMap) {
                var num = nums[i];
                if (null != num) {
                    this.bs.WriteItem(c_oSerNumTypes.AbstractNum, function () {
                        oThis.WriteAbstractNum(num, oThis.oUsedNumIdMap[i] - 1);
                    });
                }
            }
        } else {
            for (var i in nums) {
                var num = nums[i];
                this.bs.WriteItem(c_oSerNumTypes.AbstractNum, function () {
                    oThis.WriteAbstractNum(num, index);
                });
                index++;
            }
        }
    };
    this.WriteAbstractNum = function (num, index) {
        var oThis = this;
        if (null != num.Id) {
            this.bs.WriteItem(c_oSerNumTypes.AbstractNum_Id, function () {
                oThis.memory.WriteLong(index);
            });
        }
        if (null != num.NumStyleLink) {
            this.memory.WriteByte(c_oSerNumTypes.NumStyleLink);
            this.memory.WriteString2(num.NumStyleLink);
        }
        if (null != num.StyleLink) {
            this.memory.WriteByte(c_oSerNumTypes.StyleLink);
            this.memory.WriteString2(num.StyleLink);
        }
        if (null != num.Lvl) {
            this.bs.WriteItem(c_oSerNumTypes.AbstractNum_Lvls, function () {
                oThis.WriteLevels(num.Lvl);
            });
        }
    };
    this.WriteLevels = function (lvls) {
        var oThis = this;
        for (var i = 0, length = lvls.length; i < length; i++) {
            var lvl = lvls[i];
            this.bs.WriteItem(c_oSerNumTypes.Lvl, function () {
                oThis.WriteLevel(lvl);
            });
        }
    };
    this.WriteLevel = function (lvl) {
        var oThis = this;
        if (null != lvl.Format) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_Format);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(lvl.Format);
        }
        if (null != lvl.Jc) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_Jc);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(lvl.Jc);
        }
        if (null != lvl.LvlText) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_LvlText);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteLevelText(lvl.LvlText);
            });
        }
        if (null != lvl.Restart) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_Restart);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(lvl.Restart);
        }
        if (null != lvl.Start) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_Start);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(lvl.Start);
        }
        if (null != lvl.Suff) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_Suff);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(lvl.Suff);
        }
        if (null != lvl.PStyle) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_PStyle);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(lvl.PStyle);
        }
        if (null != lvl.ParaPr) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_ParaPr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bpPrs.Write_pPr(lvl.ParaPr);
            });
        }
        if (null != lvl.TextPr) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_TextPr);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.brPrs.Write_rPr(lvl.TextPr);
            });
        }
    };
    this.WriteLevelText = function (aText) {
        var oThis = this;
        for (var i = 0, length = aText.length; i < length; i++) {
            var item = aText[i];
            this.bs.WriteItem(c_oSerNumTypes.lvl_LvlTextItem, function () {
                oThis.WriteLevelTextItem(item);
            });
        }
    };
    this.WriteLevelTextItem = function (oTextItem) {
        var oThis = this;
        if (numbering_lvltext_Text == oTextItem.Type) {
            this.memory.WriteByte(c_oSerNumTypes.lvl_LvlTextItemText);
            oThis.memory.WriteString2(oTextItem.Value.toString());
        } else {
            if (numbering_lvltext_Num == oTextItem.Type) {
                this.memory.WriteByte(c_oSerNumTypes.lvl_LvlTextItemNum);
                this.bs.WriteItemWithLength(function () {
                    oThis.memory.WriteByte(oTextItem.Value);
                });
            }
        }
    };
}
function BinaryDocumentTableWriter(memory, doc, oMapCommentId, oNumIdMap, copyParams, oBinaryHeaderFooterTableWriter) {
    this.memory = memory;
    this.Document = doc;
    this.oNumIdMap = oNumIdMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.btblPrs = new Binary_tblPrWriter(this.memory, oNumIdMap);
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap, oBinaryHeaderFooterTableWriter);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.boMaths = new Binary_oMathWriter(this.memory);
    this.oMapCommentId = oMapCommentId;
    this.copyParams = copyParams;
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteDocumentContent(oThis.Document, true);
        });
    };
    this.WriteDocumentContent = function (oDocument, bSectPr) {
        var Content = oDocument.Content;
        var oThis = this;
        for (var i = 0, length = Content.length; i < length; ++i) {
            var item = Content[i];
            if (type_Paragraph === item.GetType()) {
                this.memory.WriteByte(c_oSerParType.Par);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteParapraph(item);
                });
            } else {
                if (type_Table === item.GetType()) {
                    this.memory.WriteByte(c_oSerParType.Table);
                    this.bs.WriteItemWithLength(function () {
                        oThis.WriteDocTable(item);
                    });
                }
            }
        }
        if (true == bSectPr) {
            this.bs.WriteItem(c_oSerParType.sectPr, function () {
                oThis.bpPrs.WriteSectPr(oThis.Document.SectPr, oThis.Document);
            });
        }
    };
    this.WriteParapraph = function (par, bUseSelection, selectedAll) {
        var oThis = this;
        if (null != this.copyParams) {
            var sParaStyle = par.Style_Get();
            if (null != sParaStyle) {
                this.copyParams.oUsedStyleMap[sParaStyle] = 1;
            }
            var oNumPr = par.Numbering_Get();
            if (null != oNumPr && null != oNumPr.NumId && 0 != oNumPr.NumId) {
                if (null == this.copyParams.oUsedNumIdMap[oNumPr.NumId]) {
                    this.copyParams.oUsedNumIdMap[oNumPr.NumId] = this.copyParams.nNumIdIndex;
                    this.copyParams.nNumIdIndex++;
                    var Numbering = par.Parent.Get_Numbering();
                    var aNum = null;
                    if (null != Numbering) {
                        aNum = Numbering.Get_AbstractNum(oNumPr.NumId);
                    }
                    if (null != aNum) {
                        for (var i = 0, length = aNum.Lvl.length; i < length; ++i) {
                            var oLvl = aNum.Lvl[i];
                            if (null != oLvl.PStyle) {
                                this.copyParams.oUsedStyleMap[oLvl.PStyle] = 1;
                            }
                        }
                    }
                }
            }
        }
        var ParaStyle = par.Style_Get();
        var pPr = par.Pr;
        if (null != pPr || null != ParaStyle || pPr_rPr) {
            if (null == pPr) {
                pPr = {};
            }
            var pPr_rPr = null;
            var propCount = 0;
            for (var prop in par.TextPr.Value) {
                if (par.TextPr.Value.hasOwnProperty(prop)) {
                    pPr_rPr = par.TextPr.Value;
                    break;
                }
            }
            this.memory.WriteByte(c_oSerParType.pPr);
            this.bs.WriteItemWithLength(function () {
                oThis.bpPrs.Write_pPr(pPr, pPr_rPr, par.Get_SectionPr(), oThis.Document);
            });
        }
        if (null != par.Content) {
            this.memory.WriteByte(c_oSerParType.Content);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteParagraphContent(par, bUseSelection, true, selectedAll);
            });
        }
    };
    this.WriteParagraphContent = function (par, bUseSelection, bLastRun, selectedAll) {
        var ParaStart = 0;
        var ParaEnd = par.Content.length - 1;
        if (true == bUseSelection) {
            ParaStart = par.Selection.StartPos;
            ParaEnd = par.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        if (ParaEnd < 0) {
            ParaEnd = 0;
        }
        if (ParaStart < 0) {
            ParaStart = 0;
        }
        var Content = par.Content;
        var oThis = this;
        for (var i = ParaStart; i <= ParaEnd && i < Content.length; ++i) {
            var item = Content[i];
            switch (item.Type) {
            case para_Run:
                this.WriteRun(item, bUseSelection);
                break;
            case para_Hyperlink:
                this.bs.WriteItem(c_oSerParType.Hyperlink, function () {
                    oThis.WriteHyperlink(item, bUseSelection);
                });
                break;
            case para_Comment:
                if (null != this.oMapCommentId) {
                    if (item.Start) {
                        var commentId = this.oMapCommentId[item.CommentId];
                        if (null != commentId) {
                            this.bs.WriteItem(c_oSerParType.CommentStart, function () {
                                oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                    oThis.memory.WriteLong(commentId);
                                });
                            });
                        }
                    } else {
                        var commentId = this.oMapCommentId[item.CommentId];
                        if (null != commentId) {
                            this.bs.WriteItem(c_oSerParType.CommentEnd, function () {
                                oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                    oThis.memory.WriteLong(commentId);
                                });
                            });
                            this.WriteRun2(function () {
                                oThis.bs.WriteItem(c_oSerRunType.CommentReference, function () {
                                    oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                        oThis.memory.WriteLong(commentId);
                                    });
                                });
                            });
                        }
                    }
                }
                break;
            case para_Math:
                if (null != item.Root) {
                    this.bs.WriteItem(c_oSerParType.OMathPara, function () {
                        oThis.boMaths.WriteOMathPara(item);
                    });
                }
                break;
            }
        }
        if ((bLastRun && bUseSelection && !par.Selection_CheckParaEnd()) || (selectedAll != undefined && selectedAll === false)) {
            this.WriteRun2(function () {
                oThis.memory.WriteByte(c_oSerRunType._LastRun);
                oThis.memory.WriteLong(c_oSerPropLenType.Null);
            });
        }
    };
    this.WriteHyperlink = function (oHyperlink, bUseSelection) {
        var oThis = this;
        var sLink = oHyperlink.Get_Value();
        var sTooltip = oHyperlink.Get_ToolTip();
        var sAnchor = null;
        var nAnchorIndex = sLink.indexOf("#");
        if (-1 != nAnchorIndex) {
            sAnchor = sLink.substring(nAnchorIndex + 1);
            sLink = sLink.substring(0, nAnchorIndex);
        }
        this.memory.WriteByte(c_oSer_HyperlinkType.Link);
        this.memory.WriteString2(sLink);
        if (null != sAnchor && "" != sAnchor) {
            this.memory.WriteByte(c_oSer_HyperlinkType.Anchor);
            this.memory.WriteString2(sAnchor);
        }
        if (null != sTooltip && "" != sTooltip) {
            this.memory.WriteByte(c_oSer_HyperlinkType.Tooltip);
            this.memory.WriteString2(sTooltip);
        }
        this.bs.WriteItem(c_oSer_HyperlinkType.History, function () {
            oThis.memory.WriteBool(true);
        });
        this.bs.WriteItem(c_oSer_HyperlinkType.Content, function () {
            oThis.WriteParagraphContent(oHyperlink, bUseSelection, false);
        });
    };
    this.WriteText = function (sCurText) {
        if ("" != sCurText) {
            this.memory.WriteByte(c_oSerRunType.run);
            this.memory.WriteString2(sCurText.toString());
            sCurText = "";
        }
        return sCurText;
    };
    this.WriteRun2 = function (fWriter, oRun) {
        var oThis = this;
        this.bs.WriteItem(c_oSerParType.Run, function () {
            if (null != oRun && null != oRun.Pr) {
                oThis.bs.WriteItem(c_oSerRunType.rPr, function () {
                    oThis.brPrs.Write_rPr(oRun.Pr);
                });
            }
            oThis.bs.WriteItem(c_oSerRunType.Content, function () {
                fWriter();
            });
        });
    };
    this.WriteRun = function (oRun, bUseSelection) {
        var oThis = this;
        var ParaStart = 0;
        var ParaEnd = oRun.Content.length;
        if (true == bUseSelection) {
            ParaStart = oRun.Selection.StartPos;
            ParaEnd = oRun.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        var nPrevIndex = ParaStart;
        var aRunRanges = [];
        for (var i = ParaStart; i < ParaEnd && i < oRun.Content.length; i++) {
            var item = oRun.Content[i];
            if (item.Type == para_PageNum) {
                var elem;
                if (nPrevIndex < i) {
                    elem = {
                        nStart: nPrevIndex,
                        nEnd: i,
                        pageNum: item
                    };
                } else {
                    elem = {
                        nStart: null,
                        nEnd: null,
                        pageNum: item
                    };
                }
                nPrevIndex = i + 1;
                aRunRanges.push(elem);
            }
        }
        if (nPrevIndex <= ParaEnd) {
            aRunRanges.push({
                nStart: nPrevIndex,
                nEnd: ParaEnd,
                pageNum: null
            });
        }
        for (var i = 0, length = aRunRanges.length; i < length; i++) {
            var elem = aRunRanges[i];
            if (null != elem.nStart && null != elem.nEnd) {
                this.bs.WriteItem(c_oSerParType.Run, function () {
                    if (null != oRun.Pr) {
                        oThis.bs.WriteItem(c_oSerRunType.rPr, function () {
                            oThis.brPrs.Write_rPr(oRun.Pr);
                        });
                    }
                    oThis.bs.WriteItem(c_oSerRunType.Content, function () {
                        oThis.WriteRunContent(oRun, elem.nStart, elem.nEnd);
                    });
                });
            }
            if (null != elem.pageNum) {
                var sField = " PAGE   \\* MERGEFORMAT ";
                this.WriteRun2(function () {
                    oThis.memory.WriteByte(c_oSerRunType.fldstart);
                    oThis.memory.WriteString2(sField);
                },
                oRun);
                if (null != elem.pageNum.String && "string" == typeof(elem.pageNum.String)) {
                    this.WriteRun2(function () {
                        oThis.WriteText(elem.pageNum.String);
                    },
                    oRun);
                }
                this.WriteRun2(function () {
                    oThis.memory.WriteByte(c_oSerRunType.fldend);
                    oThis.memory.WriteLong(c_oSerPropLenType.Null);
                },
                oRun);
            }
        }
    };
    this.WriteRunContent = function (oRun, nStart, nEnd) {
        var oThis = this;
        var Content = oRun.Content;
        var sCurText = "";
        for (var i = nStart; i < nEnd && i < Content.length; ++i) {
            var item = Content[i];
            switch (item.Type) {
            case para_Text:
                sCurText += encodeSurrogateChar(item.Value);
                break;
            case para_Space:
                sCurText += " ";
                break;
            case para_Tab:
                sCurText = this.WriteText(sCurText);
                oThis.memory.WriteByte(c_oSerRunType.tab);
                oThis.memory.WriteLong(c_oSerPropLenType.Null);
                break;
            case para_NewLine:
                sCurText = this.WriteText(sCurText);
                if (break_Page == item.BreakType) {
                    oThis.memory.WriteByte(c_oSerRunType.pagebreak);
                } else {
                    oThis.memory.WriteByte(c_oSerRunType.linebreak);
                }
                oThis.memory.WriteLong(c_oSerPropLenType.Null);
                break;
            case para_Drawing:
                sCurText = this.WriteText(sCurText);
                if (item.Extent && item.GraphicObj && item.GraphicObj.spPr && item.GraphicObj.spPr.xfrm) {
                    item.Extent.W = item.GraphicObj.spPr.xfrm.extX;
                    item.Extent.H = item.GraphicObj.spPr.xfrm.extY;
                }
                if (this.copyParams) {
                    CheckSpPrXfrm2(item.GraphicObj);
                }
                oThis.bs.WriteItem(c_oSerRunType.pptxDrawing, function () {
                    oThis.WriteImage(item);
                });
                break;
            }
        }
        sCurText = this.WriteText(sCurText);
    };
    this.WriteImage = function (img) {
        var oThis = this;
        if (drawing_Inline == img.DrawingType) {
            this.memory.WriteByte(c_oSerImageType2.Type);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(c_oAscWrapStyle.Inline);
            this.memory.WriteByte(c_oSerImageType2.Extent);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteExtent(img.Extent);
            });
            if (null != img.GraphicObj.chart) {
                this.memory.WriteByte(c_oSerImageType2.Chart2);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                var oBinaryChartWriter = new BinaryChartWriter(this.memory);
                this.bs.WriteItemWithLength(function () {
                    oBinaryChartWriter.WriteCT_ChartSpace(img.GraphicObj);
                });
            } else {
                this.memory.WriteByte(c_oSerImageType2.PptxData);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    window.global_pptx_content_writer.WriteDrawing(oThis.memory, img.GraphicObj, oThis.Document, oThis.oMapCommentId, oThis.oNumIdMap, oThis.copyParams);
                });
            }
        } else {
            this.memory.WriteByte(c_oSerImageType2.Type);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(c_oAscWrapStyle.Flow);
            if (null != img.behindDoc) {
                this.memory.WriteByte(c_oSerImageType2.BehindDoc);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(img.behindDoc);
            }
            if (null != img.Distance.L) {
                this.memory.WriteByte(c_oSerImageType2.DistL);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(img.Distance.L);
            }
            if (null != img.Distance.T) {
                this.memory.WriteByte(c_oSerImageType2.DistT);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(img.Distance.T);
            }
            if (null != img.Distance.R) {
                this.memory.WriteByte(c_oSerImageType2.DistR);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(img.Distance.R);
            }
            if (null != img.Distance.B) {
                this.memory.WriteByte(c_oSerImageType2.DistB);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(img.Distance.B);
            }
            if (null != img.RelativeHeight) {
                this.memory.WriteByte(c_oSerImageType2.RelativeHeight);
                this.memory.WriteByte(c_oSerPropLenType.Long);
                this.memory.WriteLong(img.RelativeHeight);
            }
            if (null != img.SimplePos.Use) {
                this.memory.WriteByte(c_oSerImageType2.BSimplePos);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(img.SimplePos.Use);
            }
            if (false) {
                var EffectExtent = null;
                this.memory.WriteByte(c_oSerImageType2.EffectExtent);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteEffectExtent(EffectExtent);
                });
            }
            if (null != img.Extent) {
                this.memory.WriteByte(c_oSerImageType2.Extent);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteExtent(img.Extent);
                });
            }
            if (null != img.PositionH) {
                this.memory.WriteByte(c_oSerImageType2.PositionH);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WritePositionHV(img.PositionH);
                });
            }
            if (null != img.PositionV) {
                this.memory.WriteByte(c_oSerImageType2.PositionV);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WritePositionHV(img.PositionV);
                });
            }
            if (null != img.SimplePos) {
                this.memory.WriteByte(c_oSerImageType2.SimplePos);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteSimplePos(img.SimplePos);
                });
            }
            switch (img.wrappingType) {
            case WRAPPING_TYPE_NONE:
                this.memory.WriteByte(c_oSerImageType2.WrapNone);
                this.memory.WriteByte(c_oSerPropLenType.Null);
                break;
            case WRAPPING_TYPE_SQUARE:
                this.memory.WriteByte(c_oSerImageType2.WrapSquare);
                this.memory.WriteByte(c_oSerPropLenType.Null);
                break;
            case WRAPPING_TYPE_THROUGH:
                this.memory.WriteByte(c_oSerImageType2.WrapThrough);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteWrapThroughTight(img.wrappingPolygon, img.getWrapContour());
                });
                break;
            case WRAPPING_TYPE_TIGHT:
                this.memory.WriteByte(c_oSerImageType2.WrapTight);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteWrapThroughTight(img.wrappingPolygon, img.getWrapContour());
                });
                break;
            case WRAPPING_TYPE_TOP_AND_BOTTOM:
                this.memory.WriteByte(c_oSerImageType2.WrapTopAndBottom);
                this.memory.WriteByte(c_oSerPropLenType.Null);
                break;
            }
            if (null != img.GraphicObj.chart) {
                this.memory.WriteByte(c_oSerImageType2.Chart2);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                var oBinaryChartWriter = new BinaryChartWriter(this.memory);
                this.bs.WriteItemWithLength(function () {
                    oBinaryChartWriter.WriteCT_ChartSpace(img.GraphicObj);
                });
            } else {
                this.memory.WriteByte(c_oSerImageType2.PptxData);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    window.global_pptx_content_writer.WriteDrawing(oThis.memory, img.GraphicObj, oThis.Document, oThis.oMapCommentId, oThis.oNumIdMap, oThis.copyParams);
                });
            }
        }
    };
    this.WriteEffectExtent = function (EffectExtent) {
        if (null != EffectExtent.Left) {
            this.memory.WriteByte(c_oSerEffectExtent.Left);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(EffectExtent.Left);
        }
        if (null != EffectExtent.Top) {
            this.memory.WriteByte(c_oSerEffectExtent.Top);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(EffectExtent.Top);
        }
        if (null != EffectExtent.Right) {
            this.memory.WriteByte(c_oSerEffectExtent.Right);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(EffectExtent.Right);
        }
        if (null != EffectExtent.Bottom) {
            this.memory.WriteByte(c_oSerEffectExtent.Bottom);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(EffectExtent.Bottom);
        }
    };
    this.WriteExtent = function (Extent) {
        if (null != Extent.W) {
            this.memory.WriteByte(c_oSerExtent.Cx);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Extent.W);
        }
        if (null != Extent.H) {
            this.memory.WriteByte(c_oSerExtent.Cy);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(Extent.H);
        }
    };
    this.WritePositionHV = function (PositionH) {
        if (null != PositionH.RelativeFrom) {
            this.memory.WriteByte(c_oSerPosHV.RelativeFrom);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(PositionH.RelativeFrom);
        }
        if (true == PositionH.Align) {
            this.memory.WriteByte(c_oSerPosHV.Align);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(PositionH.Value);
        } else {
            this.memory.WriteByte(c_oSerPosHV.PosOffset);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(PositionH.Value);
        }
    };
    this.WriteSimplePos = function (oSimplePos) {
        if (null != oSimplePos.X) {
            this.memory.WriteByte(c_oSerSimplePos.X);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(oSimplePos.X);
        }
        if (null != oSimplePos.Y) {
            this.memory.WriteByte(c_oSerSimplePos.Y);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(oSimplePos.Y);
        }
    };
    this.WriteWrapThroughTight = function (wrappingPolygon, Contour) {
        var oThis = this;
        this.memory.WriteByte(c_oSerWrapThroughTight.WrapPolygon);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.bs.WriteItemWithLength(function () {
            oThis.WriteWrapPolygon(wrappingPolygon, Contour);
        });
    };
    this.WriteWrapPolygon = function (wrappingPolygon, Contour) {
        var oThis = this;
        this.memory.WriteByte(c_oSerWrapPolygon.Edited);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(true);
        if (Contour.length > 0) {
            this.memory.WriteByte(c_oSerWrapPolygon.Start);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WritePolygonPoint(Contour[0]);
            });
            if (Contour.length > 1) {
                this.memory.WriteByte(c_oSerWrapPolygon.ALineTo);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteLineTo(Contour);
                });
            }
        }
    };
    this.WriteLineTo = function (Contour) {
        var oThis = this;
        for (var i = 1, length = Contour.length; i < length; ++i) {
            this.memory.WriteByte(c_oSerWrapPolygon.LineTo);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WritePolygonPoint(Contour[i]);
            });
        }
    };
    this.WritePolygonPoint = function (oPoint) {
        if (null != oPoint.x) {
            this.memory.WriteByte(c_oSerPoint2D.X);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(oPoint.x);
        }
        if (null != oPoint.y) {
            this.memory.WriteByte(c_oSerPoint2D.Y);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(oPoint.y);
        }
    };
    this.WriteDocTable = function (table, aRowElems, nMinGrid, nMaxGrid) {
        var oThis = this;
        if (null != this.copyParams) {
            var sTableStyle = table.Get_TableStyle();
            if (null != sTableStyle) {
                this.copyParams.oUsedStyleMap[sTableStyle] = 1;
            }
        }
        if (null != table.Pr) {
            this.bs.WriteItem(c_oSerDocTableType.tblPr, function () {
                oThis.btblPrs.WriteTbl(table);
            });
        }
        if (null != table.TableGrid) {
            var aGrid = table.TableGrid;
            if (null != nMinGrid && null != nMaxGrid && 0 != nMinGrid && aGrid.length - 1 != nMaxGrid) {
                aGrid = aGrid.slice(nMinGrid, nMaxGrid + 1);
            }
            this.bs.WriteItem(c_oSerDocTableType.tblGrid, function () {
                oThis.WriteTblGrid(aGrid);
            });
        }
        if (null != table.Content && table.Content.length > 0) {
            this.bs.WriteItem(c_oSerDocTableType.Content, function () {
                oThis.WriteTableContent(table.Content, aRowElems);
            });
        }
    };
    this.WriteTblGrid = function (grid) {
        var oThis = this;
        for (var i = 0, length = grid.length; i < length; i++) {
            this.memory.WriteByte(c_oSerDocTableType.tblGrid_Item);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(grid[i]);
        }
    };
    this.WriteTableContent = function (Content, aRowElems) {
        var oThis = this;
        var nStart = 0;
        var nEnd = Content.length - 1;
        if (null != aRowElems && aRowElems.length > 0) {
            nStart = aRowElems[0].row;
            nEnd = aRowElems[aRowElems.length - 1].row;
        }
        for (var i = nStart; i <= nEnd && i < Content.length; ++i) {
            var oRowElem = null;
            if (null != aRowElems) {
                oRowElem = aRowElems[i - nStart];
            }
            this.bs.WriteItem(c_oSerDocTableType.Row, function () {
                oThis.WriteRow(Content[i], i, oRowElem);
            });
        }
    };
    this.WriteRow = function (Row, nRowIndex, oRowElem) {
        var oThis = this;
        if (null != Row.Pr) {
            var oRowPr = Row.Pr;
            if (null != oRowElem) {
                oRowPr = oRowPr.Copy();
                oRowPr.WAfter = null;
                oRowPr.WBefore = null;
                if (null != oRowElem.after) {
                    oRowPr.GridAfter = oRowElem.after;
                } else {
                    oRowPr.GridAfter = null;
                }
                if (null != oRowElem.before) {
                    oRowPr.GridBefore = oRowElem.before;
                } else {
                    oRowPr.GridBefore = null;
                }
            }
            this.bs.WriteItem(c_oSerDocTableType.Row_Pr, function () {
                oThis.btblPrs.WriteRowPr(oRowPr);
            });
        }
        if (null != Row.Content) {
            this.bs.WriteItem(c_oSerDocTableType.Row_Content, function () {
                oThis.WriteRowContent(Row.Content, nRowIndex, oRowElem);
            });
        }
    };
    this.WriteRowContent = function (Content, nRowIndex, oRowElem) {
        var oThis = this;
        var nStart = 0;
        var nEnd = Content.length - 1;
        if (null != oRowElem) {
            nStart = oRowElem.indexStart;
            nEnd = oRowElem.indexEnd;
        }
        for (var i = nStart; i <= nEnd && i < Content.length; i++) {
            this.bs.WriteItem(c_oSerDocTableType.Cell, function () {
                oThis.WriteCell(Content[i], nRowIndex, i);
            });
        }
    };
    this.WriteCell = function (cell, nRowIndex, nColIndex) {
        var oThis = this;
        if (null != cell.Pr) {
            var vMerge = null;
            if (vmerge_Continue != cell.Pr.VMerge) {
                var row = cell.Row;
                var table = row.Table;
                var oCellInfo = row.Get_CellInfo(nColIndex);
                var StartGridCol = 0;
                if (null != oCellInfo) {
                    StartGridCol = oCellInfo.StartGridCol;
                } else {
                    var BeforeInfo = row.Get_Before();
                    StartGridCol = BeforeInfo.GridBefore;
                    for (var i = 0; i < nColIndex; ++i) {
                        var cellTemp = row.Get_Cell(i);
                        StartGridCol += cellTemp.Get_GridSpan();
                    }
                }
                if (table.Internal_GetVertMergeCount(nRowIndex, StartGridCol, cell.Get_GridSpan()) > 1) {
                    vMerge = vmerge_Restart;
                }
            }
            this.bs.WriteItem(c_oSerDocTableType.Cell_Pr, function () {
                oThis.btblPrs.WriteCellPr(cell.Pr, vMerge);
            });
        }
        if (null != cell.Content) {
            var oInnerDocument = new BinaryDocumentTableWriter(this.memory, this.Document, this.oMapCommentId, this.oNumIdMap, this.copyParams, this.oBinaryHeaderFooterTableWriter);
            this.bs.WriteItem(c_oSerDocTableType.Cell_Content, function () {
                oInnerDocument.WriteDocumentContent(cell.Content);
            });
        }
    };
}
function BinaryOtherTableWriter(memory, doc) {
    this.memory = memory;
    this.Document = doc;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteOtherContent();
        });
    };
    this.WriteOtherContent = function () {
        var oThis = this;
        this.bs.WriteItem(c_oSerOtherTableTypes.DocxTheme, function () {
            window.global_pptx_content_writer.WriteTheme(oThis.memory, oThis.Document.theme);
        });
    };
}
function BinaryCommentsTableWriter(memory, doc, oMapCommentId) {
    this.memory = memory;
    this.Document = doc;
    this.oMapCommentId = oMapCommentId;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteComments();
        });
    };
    this.WriteComments = function () {
        var oThis = this;
        var nIndex = 0;
        for (var i in this.Document.Comments.m_aComments) {
            var oComment = this.Document.Comments.m_aComments[i];
            this.bs.WriteItem(c_oSer_CommentsType.Comment, function () {
                oThis.WriteComment(oComment.Data, oComment.Id, nIndex++);
            });
        }
    };
    this.WriteComment = function (comment, sCommentId, nFileId) {
        var oThis = this;
        if (null != sCommentId && null != nFileId) {
            this.oMapCommentId[sCommentId] = nFileId;
            this.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                oThis.memory.WriteLong(nFileId);
            });
        }
        if (null != comment.m_sUserName && "" != comment.m_sUserName) {
            this.memory.WriteByte(c_oSer_CommentsType.UserName);
            this.memory.WriteString2(comment.m_sUserName);
        }
        if (null != comment.m_sUserId && "" != comment.m_sUserId) {
            this.memory.WriteByte(c_oSer_CommentsType.UserId);
            this.memory.WriteString2(comment.m_sUserId);
        }
        if (null != comment.m_sTime && "" != comment.m_sTime) {
            var oDate = new Date(comment.m_sTime - 0);
            this.memory.WriteByte(c_oSer_CommentsType.Date);
            this.memory.WriteString2(this.DateToISO8601(oDate));
        }
        if (null != comment.m_bSolved) {
            this.bs.WriteItem(c_oSer_CommentsType.Solved, function () {
                oThis.memory.WriteBool(comment.m_bSolved);
            });
        }
        if (null != comment.m_sText && "" != comment.m_sText) {
            this.memory.WriteByte(c_oSer_CommentsType.Text);
            this.memory.WriteString2(comment.m_sText);
        }
        if (null != comment.m_aReplies && comment.m_aReplies.length > 0) {
            this.bs.WriteItem(c_oSer_CommentsType.Replies, function () {
                oThis.WriteReplies(comment.m_aReplies);
            });
        }
    };
    this.DateToISO8601 = function (d) {
        function pad(n) {
            return n < 10 ? "0" + n : n;
        }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    };
    this.WriteReplies = function (aComments) {
        var oThis = this;
        var nIndex = 0;
        for (var i = 0, length = aComments.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_CommentsType.Comment, function () {
                oThis.WriteComment(aComments[i]);
            });
        }
    };
}
function BinarySettingsTableWriter(memory, doc) {
    this.memory = memory;
    this.Document = doc;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteSettings();
        });
    };
    this.WriteSettings = function () {
        var oThis = this;
        this.bs.WriteItem(c_oSer_SettingsType.ClrSchemeMapping, function () {
            oThis.WriteColorSchemeMapping();
        });
        this.bs.WriteItem(c_oSer_SettingsType.DefaultTabStop, function () {
            oThis.memory.WriteDouble(Default_Tab_Stop);
        });
    };
    this.WriteMathPr = function () {
        var oThis = this;
        var oMathPr = this.Document.MathPr;
        if (null != oMathPr.brkBin) {
            this.bs.WriteItem(c_oSer_MathPrType.BrkBin, function () {
                oThis.WriteMathBrkBin(oMathPr.brkBin);
            });
        }
        if (null != oMathPr.brkBinSub) {
            this.bs.WriteItem(c_oSer_MathPrType.BrkBinSub, function () {
                oThis.WriteMathBrkBinSub(oMathPr.brkBinSub);
            });
        }
        if (null != oMathPr.defJc) {
            this.bs.WriteItem(c_oSer_MathPrType.DefJc, function () {
                oThis.WriteMathDefJc(oMathPr.defJc);
            });
        }
        if (null != oMathPr.dispDef) {
            this.bs.WriteItem(c_oSer_MathPrType.DispDef, function () {
                oThis.WriteMathDispDef(oMathPr.dispDef);
            });
        }
        if (null != oMathPr.interSp) {
            this.bs.WriteItem(c_oSer_MathPrType.InterSp, function () {
                oThis.WriteMathInterSp(oMathPr.interSp);
            });
        }
        if (null != oMathPr.intLim) {
            this.bs.WriteItem(c_oSer_MathPrType.IntLim, function () {
                oThis.WriteMathIntLim(oMathPr.intLim);
            });
        }
        if (null != oMathPr.intraSp) {
            this.bs.WriteItem(c_oSer_MathPrType.IntraSp, function () {
                oThis.WriteMathIntraSp(oMathPr.intraSp);
            });
        }
        if (null != oMathPr.lMargin) {
            this.bs.WriteItem(c_oSer_MathPrType.LMargin, function () {
                oThis.WriteMathLMargin(oMathPr.lMargin);
            });
        }
        if (null != oMathPr.mathFont) {
            this.bs.WriteItem(c_oSer_MathPrType.MathFont, function () {
                oThis.WriteMathMathFont(oMathPr.mathFont);
            });
        }
        if (null != oMathPr.naryLim) {
            this.bs.WriteItem(c_oSer_MathPrType.NaryLim, function () {
                oThis.WriteMathNaryLim(oMathPr.naryLim);
            });
        }
        if (null != oMathPr.postSp) {
            this.bs.WriteItem(c_oSer_MathPrType.PostSp, function () {
                oThis.WriteMathPostSp(oMathPr.postSp);
            });
        }
        if (null != oMathPr.preSp) {
            this.bs.WriteItem(c_oSer_MathPrType.PreSp, function () {
                oThis.WriteMathPreSp(oMathPr.preSp);
            });
        }
        if (null != oMathPr.rMargin) {
            this.bs.WriteItem(c_oSer_MathPrType.RMargin, function () {
                oThis.WriteMathRMargin(oMathPr.rMargin);
            });
        }
        if (null != oMathPr.smallFrac) {
            this.bs.WriteItem(c_oSer_MathPrType.SmallFrac, function () {
                oThis.WriteMathSmallFrac(oMathPr.smallFrac);
            });
        }
        if (null != oMathPr.wrapIndent) {
            this.bs.WriteItem(c_oSer_MathPrType.WrapIndent, function () {
                oThis.WriteMathWrapIndent(oMathPr.wrapIndent);
            });
        }
        if (null != oMathPr.wrapRight) {
            this.bs.WriteItem(c_oSer_MathPrType.WrapRight, function () {
                oThis.WriteMathWrapRight(oMathPr.wrapRight);
            });
        }
    };
    this.WriteMathBrkBin = function (BrkBin) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscBrkBin.Repeat;
        switch (BrkBin) {
        case BREAK_AFTER:
            val = c_oAscBrkBin.After;
            break;
        case BREAK_BEFORE:
            val = c_oAscBrkBin.Before;
            break;
        case BREAK_REPEAT:
            val = c_oAscBrkBin.Repeat;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMathBrkBinSub = function (BrkBinSub) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscBrkBinSub.MinusMinus;
        switch (BrkBinSub) {
        case BREAK_PLUS_MIN:
            val = c_oAscBrkBinSub.PlusMinus;
            break;
        case BREAK_MIN_PLUS:
            val = c_oAscBrkBinSub.MinusPlus;
            break;
        case BREAK_MIN_MIN:
            val = c_oAscBrkBinSub.MinusMinus;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMathDefJc = function (DefJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscMathJc.CenterGroup;
        switch (DefJc) {
        case JC_CENTER:
            val = c_oAscMathJc.Center;
            break;
        case JC_CENTERGROUP:
            val = c_oAscMathJc.CenterGroup;
            break;
        case JC_LEFT:
            val = c_oAscMathJc.Left;
            break;
        case JC_RIGHT:
            val = c_oAscMathJc.Right;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMathDispDef = function (DispDef) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(DispDef);
    };
    this.WriteMathInterSp = function (InterSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(InterSp);
    };
    this.WriteMathIntLim = function (IntLim) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscLimLoc.SubSup;
        switch (IntLim) {
        case NARY_SubSup:
            val = c_oAscLimLoc.SubSup;
            break;
        case NARY_UndOvr:
            val = c_oAscLimLoc.UndOvr;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMathIntraSp = function (IntraSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(IntraSp);
    };
    this.WriteMathLMargin = function (LMargin) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(LMargin);
    };
    this.WriteMathMathFont = function (MathFont) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(MathFont);
    };
    this.WriteMathNaryLim = function (NaryLim) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        var val = c_oAscLimLoc.SubSup;
        switch (NaryLim) {
        case NARY_SubSup:
            val = c_oAscLimLoc.SubSup;
            break;
        case NARY_UndOvr:
            val = c_oAscLimLoc.UndOvr;
        }
        this.memory.WriteByte(val);
    };
    this.WriteMathPostSp = function (PostSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(PostSp);
    };
    this.WriteMathPreSp = function (PreSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(PreSp);
    };
    this.WriteMathRMargin = function (RMargin) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(RMargin);
    };
    this.WriteMathSmallFrac = function (SmallFrac) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(SmallFrac);
    };
    this.WriteMathWrapIndent = function (WrapIndent) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(WrapIndent);
    };
    this.WriteMathWrapRight = function (WrapRight) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(WrapRight);
    };
    this.WriteColorSchemeMapping = function () {
        var oThis = this;
        for (var i in this.Document.clrSchemeMap.color_map) {
            var nScriptType = i - 0;
            var nScriptVal = this.Document.clrSchemeMap.color_map[i];
            var nFileType = c_oSer_ClrSchemeMappingType.Accent1;
            var nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent1;
            switch (nScriptType) {
            case 0:
                nFileType = c_oSer_ClrSchemeMappingType.Accent1;
                break;
            case 1:
                nFileType = c_oSer_ClrSchemeMappingType.Accent2;
                break;
            case 2:
                nFileType = c_oSer_ClrSchemeMappingType.Accent3;
                break;
            case 3:
                nFileType = c_oSer_ClrSchemeMappingType.Accent4;
                break;
            case 4:
                nFileType = c_oSer_ClrSchemeMappingType.Accent5;
                break;
            case 5:
                nFileType = c_oSer_ClrSchemeMappingType.Accent6;
                break;
            case 6:
                nFileType = c_oSer_ClrSchemeMappingType.Bg1;
                break;
            case 7:
                nFileType = c_oSer_ClrSchemeMappingType.Bg2;
                break;
            case 10:
                nFileType = c_oSer_ClrSchemeMappingType.FollowedHyperlink;
                break;
            case 11:
                nFileType = c_oSer_ClrSchemeMappingType.Hyperlink;
                break;
            case 15:
                nFileType = c_oSer_ClrSchemeMappingType.T1;
                break;
            case 16:
                nFileType = c_oSer_ClrSchemeMappingType.T2;
                break;
            }
            switch (nScriptVal) {
            case 0:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent1;
                break;
            case 1:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent2;
                break;
            case 2:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent3;
                break;
            case 3:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent4;
                break;
            case 4:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent5;
                break;
            case 5:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexAccent6;
                break;
            case 8:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexDark1;
                break;
            case 9:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexDark2;
                break;
            case 10:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexFollowedHyperlink;
                break;
            case 11:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexHyperlink;
                break;
            case 12:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexLight1;
                break;
            case 13:
                nFileVal = EWmlColorSchemeIndex.wmlcolorschemeindexLight2;
                break;
            }
            this.memory.WriteByte(nFileType);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nFileVal);
        }
    };
}
function BinaryFileReader(doc, openParams) {
    this.Document = doc;
    this.openParams = openParams;
    this.stream;
    this.oReadResult = {
        ImageMap: null,
        oComments: null,
        oCommentsPlaces: null,
        setting: null,
        numToNumClass: null,
        paraNumPrs: null,
        styles: null,
        paraStyles: null,
        tableStyles: null,
        lvlStyles: null,
        DefpPr: null,
        DefrPr: null,
        DocumentContent: null,
        bLastRun: null,
        aPostOpenStyleNumCallbacks: null,
        headers: null,
        footers: null
    };
    this.getbase64DecodedData = function (szSrc) {
        var srcLen = szSrc.length;
        var nWritten = 0;
        var nType = 0;
        var index = c_oSerFormat.Signature.length;
        var version = "";
        var dst_len = "";
        while (true) {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                if (0 == nType) {
                    nType = 1;
                    continue;
                } else {
                    index++;
                    break;
                }
            }
            if (0 == nType) {
                version += String.fromCharCode(_c);
            } else {
                dst_len += String.fromCharCode(_c);
            }
        }
        var dstLen = parseInt(dst_len);
        var pointer = g_memory.Alloc(dstLen);
        var stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;
        var dstPx = stream.data;
        if (window.chrome) {
            while (index < srcLen) {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i = 0; i < 4; i++) {
                    if (index >= srcLen) {
                        break;
                    }
                    var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                    if (nCh == -1) {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }
                dwCurr <<= 24 - nBits;
                for (i = 0; i < nBits / 8; i++) {
                    dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                    dwCurr <<= 8;
                }
            }
        } else {
            var p = b64_decode;
            while (index < srcLen) {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i = 0; i < 4; i++) {
                    if (index >= srcLen) {
                        break;
                    }
                    var nCh = p[szSrc.charCodeAt(index++)];
                    if (nCh == undefined) {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }
                dwCurr <<= 24 - nBits;
                for (i = 0; i < nBits / 8; i++) {
                    dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }
        if (version.length > 1) {
            var nTempVersion = version.substring(1) - 0;
            if (nTempVersion) {
                g_nCurFileVersion = nTempVersion;
            }
        }
        return stream;
    };
    this.Read = function (data) {
        try {
            this.stream = this.getbase64DecodedData(data);
            this.PreLoadPrepare();
            this.ReadMainTable();
            this.PostLoadPrepare();
        } catch(e) {
            if (e.message == g_sErrorCharCountMessage) {
                return false;
            } else {
                throw e;
            }
        }
        return true;
    };
    this.ReadData = function (data) {
        this.stream = new FT_Stream2(data, data.length);
        this.PreLoadPrepare();
        this.ReadMainTable();
        this.PostLoadPrepare();
        return true;
    };
    this.PreLoadPrepare = function () {
        var styles = this.Document.Styles.Style;
        var stDefault = this.Document.Styles.Default;
        stDefault.Numbering = null;
        stDefault.Paragraph = null;
        stDefault.Table = null;
    };
    this.ReadMainTable = function () {
        this.oReadResult.ImageMap = {};
        this.oReadResult.oComments = {};
        this.oReadResult.oCommentsPlaces = {};
        this.oReadResult.setting = {
            titlePg: false,
            EvenAndOddHeaders: false
        };
        this.oReadResult.numToNumClass = {};
        this.oReadResult.paraNumPrs = [];
        this.oReadResult.styles = [];
        this.oReadResult.paraStyles = [];
        this.oReadResult.tableStyles = [];
        this.oReadResult.lvlStyles = [];
        this.oReadResult.DocumentContent = [];
        this.oReadResult.bLastRun = null;
        this.oReadResult.aPostOpenStyleNumCallbacks = [];
        this.oReadResult.headers = [];
        this.oReadResult.footers = [];
        var res = c_oSerConstants.ReadOk;
        res = this.stream.EnterFrame(1);
        if (c_oSerConstants.ReadOk != res) {
            return res;
        }
        var mtLen = this.stream.GetUChar();
        var aSeekTable = [];
        var nOtherTableSeek = -1;
        var nNumberingTableSeek = -1;
        var nCommentTableSeek = -1;
        var nSettingTableSeek = -1;
        var nDocumentTableSeek = -1;
        for (var i = 0; i < mtLen; ++i) {
            res = this.stream.EnterFrame(5);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            var mtiType = this.stream.GetUChar();
            var mtiOffBits = this.stream.GetULongLE();
            if (c_oSerTableTypes.Other == mtiType) {
                nOtherTableSeek = mtiOffBits;
            } else {
                if (c_oSerTableTypes.Numbering == mtiType) {
                    nNumberingTableSeek = mtiOffBits;
                } else {
                    if (c_oSerTableTypes.Comments == mtiType) {
                        nCommentTableSeek = mtiOffBits;
                    } else {
                        if (c_oSerTableTypes.Settings == mtiType) {
                            nSettingTableSeek = mtiOffBits;
                        } else {
                            if (c_oSerTableTypes.Document == mtiType) {
                                nDocumentTableSeek = mtiOffBits;
                            } else {
                                aSeekTable.push({
                                    type: mtiType,
                                    offset: mtiOffBits
                                });
                            }
                        }
                    }
                }
            }
        }
        if (-1 != nOtherTableSeek) {
            res = this.stream.Seek(nOtherTableSeek);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            res = (new Binary_OtherTableReader(this.Document, this.oReadResult, this.stream)).Read();
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        if (-1 != nCommentTableSeek) {
            res = this.stream.Seek(nCommentTableSeek);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            res = (new Binary_CommentsTableReader(this.Document, this.oReadResult, this.stream, this.oReadResult.oComments)).Read();
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        if (-1 != nSettingTableSeek) {
            res = this.stream.Seek(nSettingTableSeek);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            res = (new Binary_SettingsTableReader(this.Document, this.oReadResult, this.stream)).Read();
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        if (-1 != nNumberingTableSeek) {
            res = this.stream.Seek(nNumberingTableSeek);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            res = (new Binary_NumberingTableReader(this.Document, this.oReadResult, this.stream)).Read();
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        var oBinary_DocumentTableReader = new Binary_DocumentTableReader(this.Document, this.oReadResult, this.openParams, this.stream, true, this.oReadResult.oCommentsPlaces);
        for (var i = 0, length = aSeekTable.length; i < length; ++i) {
            var item = aSeekTable[i];
            var mtiType = item.type;
            var mtiOffBits = item.offset;
            res = this.stream.Seek(mtiOffBits);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            switch (mtiType) {
            case c_oSerTableTypes.Signature:
                break;
            case c_oSerTableTypes.Info:
                break;
            case c_oSerTableTypes.Style:
                res = (new BinaryStyleTableReader(this.Document, this.oReadResult, this.stream)).Read();
                break;
            case c_oSerTableTypes.HdrFtr:
                res = (new Binary_HdrFtrTableReader(this.Document, this.oReadResult, this.openParams, this.stream)).Read();
                break;
            }
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        if (-1 != nDocumentTableSeek) {
            res = this.stream.Seek(nDocumentTableSeek);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            res = oBinary_DocumentTableReader.ReadAsTable(this.oReadResult.DocumentContent);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        return res;
    };
    this.PostLoadPrepareCheckStylesRecursion = function (stId, aStylesGrey, styles) {
        var stylesGrey = aStylesGrey[stId];
        if (0 != stylesGrey) {
            var stObj = styles[stId];
            if (stObj) {
                if (1 == stylesGrey) {
                    stObj.Set_BasedOn(null);
                } else {
                    if (null != stObj.BasedOn) {
                        aStylesGrey[stId] = 1;
                        this.PostLoadPrepareCheckStylesRecursion(stObj.BasedOn, aStylesGrey, styles);
                    }
                    aStylesGrey[stId] = 0;
                }
            }
        }
    };
    this.PostLoadPrepare = function (setting) {
        for (var i in this.oReadResult.numToNumClass) {
            var oNumClass = this.oReadResult.numToNumClass[i];
            this.Document.Numbering.Add_AbstractNum(oNumClass);
        }
        for (var i = 0, length = this.oReadResult.paraNumPrs.length; i < length; ++i) {
            var numPr = this.oReadResult.paraNumPrs[i];
            var oNumClass = this.oReadResult.numToNumClass[numPr.NumId];
            if (null != oNumClass) {
                numPr.NumId = oNumClass.Get_Id();
            } else {
                numPr.NumId = 0;
            }
        }
        var styles = this.Document.Styles.Style;
        var stDefault = this.Document.Styles.Default;
        if (g_nCurFileVersion < 2) {
            for (var i in this.oReadResult.styles) {
                this.oReadResult.styles[i].style.qFormat = true;
            }
        }
        var aStartDocStylesNames = {};
        for (var stId in styles) {
            var style = styles[stId];
            if (style && style.Name) {
                aStartDocStylesNames[style.Name.toLowerCase().replace(/\s/g, "")] = style;
            }
        }
        var oIdRenameMap = {};
        for (var i in this.oReadResult.styles) {
            var elem = this.oReadResult.styles[i];
            var oNewStyle = elem.style;
            var oNewId = elem.param;
            var sNewStyleName = oNewStyle.Name.toLowerCase().replace(/\s/g, "");
            var oStartDocStyle = aStartDocStylesNames[sNewStyleName];
            if (oStartDocStyle) {
                var stId = oStartDocStyle.Get_Id();
                oNewStyle.Set_Name(oStartDocStyle.Name);
                oIdRenameMap[stId] = {
                    id: oNewId.id,
                    def: oNewId.def,
                    type: oNewStyle.Type,
                    newName: sNewStyleName
                };
                delete styles[stId];
            }
        }
        for (var i in this.oReadResult.styles) {
            var elem = this.oReadResult.styles[i];
            var oNewStyle = elem.style;
            var oNewId = elem.param;
            var oCollisionStyle = styles[oNewId.id];
            if (oCollisionStyle) {
                var sOldId = oCollisionStyle.Get_Id();
                var nCounter = 1;
                var sNewId = g_oIdCounter.Get_NewId();
                var oNewId = {
                    id: sNewId,
                    def: false,
                    type: oCollisionStyle.Type,
                    newName: oCollisionStyle.Name.toLowerCase().replace(/\s/g, "")
                };
                oIdRenameMap[sOldId] = oNewId;
                if (stDefault.Character == sOldId || stDefault.Numbering == sOldId || stDefault.Paragraph == sOldId || stDefault.Table == sOldId) {
                    oNewId.def = true;
                }
                oCollisionStyle.Set_Id(sNewId);
                delete styles[sOldId];
                styles[sNewId] = oCollisionStyle;
            }
        }
        for (var stId in styles) {
            var stObj = styles[stId];
            var oNewId;
            if (null != stObj.BasedOn) {
                oNewId = oIdRenameMap[stObj.BasedOn];
                if (null != oNewId) {
                    stObj.Set_BasedOn(oNewId.id);
                }
            }
            if (null != stObj.Next) {
                oNewId = oIdRenameMap[stObj.Next];
                if (null != oNewId) {
                    stObj.Set_Next(oNewId.id);
                }
            }
        }
        for (var i = 0, length = stDefault.Headings.length; i < length; ++i) {
            var sHeading = stDefault.Headings[i];
            var oNewId = oIdRenameMap[sHeading];
            if (null != oNewId) {
                stDefault.Headings[i] = oNewId.id;
            }
        }
        for (var sOldId in oIdRenameMap) {
            var oNewId = oIdRenameMap[sOldId];
            var sNewStyleName = oNewId.newName;
            var stId = sOldId;
            if (stDefault.Character == stId) {
                stDefault.Character = null;
            }
            if (stDefault.Paragraph == stId) {
                stDefault.Paragraph = null;
            }
            if (stDefault.Numbering == stId) {
                stDefault.Numbering = null;
            }
            if (stDefault.Table == stId) {
                stDefault.Table = null;
            }
            if (stDefault.ParaList == stId) {
                stDefault.ParaList = oNewId.id;
            }
            if (stDefault.Header == stId || "header" == sNewStyleName) {
                stDefault.Header = oNewId.id;
            }
            if (stDefault.Footer == stId || "footer" == sNewStyleName) {
                stDefault.Footer = oNewId.id;
            }
            if (stDefault.Hyperlink == stId || "hyperlink" == sNewStyleName) {
                stDefault.Hyperlink = oNewId.id;
            }
            if (stDefault.TableGrid == stId || "table grid" == sNewStyleName) {
                stDefault.TableGrid = oNewId.id;
            }
            if (true == oNewId.def) {
                switch (oNewId.type) {
                case styletype_Character:
                    stDefault.Character = oNewId.id;
                    break;
                case styletype_Numbering:
                    stDefault.Numbering = oNewId.id;
                    break;
                case styletype_Paragraph:
                    stDefault.Paragraph = oNewId.id;
                    break;
                case styletype_Table:
                    stDefault.Table = oNewId.id;
                    break;
                }
            }
        }
        for (var i in this.oReadResult.styles) {
            var elem = this.oReadResult.styles[i];
            var oNewStyle = elem.style;
            var oNewId = elem.param;
            var sNewStyleName = oNewStyle.Name.toLowerCase().replace(/\s/g, "");
            if (true == oNewId.def) {
                switch (oNewStyle.Type) {
                case styletype_Character:
                    stDefault.Character = oNewId.id;
                    break;
                case styletype_Numbering:
                    stDefault.Numbering = oNewId.id;
                    break;
                case styletype_Paragraph:
                    stDefault.Paragraph = oNewId.id;
                    break;
                case styletype_Table:
                    stDefault.Table = oNewId.id;
                    break;
                }
            }
            if ("header" == sNewStyleName) {
                stDefault.Header = oNewId.id;
            }
            if ("footer" == sNewStyleName) {
                stDefault.Footer = oNewId.id;
            }
            if ("hyperlink" == sNewStyleName) {
                stDefault.Hyperlink = oNewId.id;
            }
            if ("table grid" == sNewStyleName) {
                stDefault.TableGrid = oNewId.id;
            }
            styles[oNewId.id] = oNewStyle;
        }
        var oStyleTypes = {
            par: 1,
            table: 2,
            lvl: 3
        };
        var fParseStyle = function (aStyles, oDocumentStyles, nStyleType) {
            for (var i = 0, length = aStyles.length; i < length; ++i) {
                var elem = aStyles[i];
                if (null != oDocumentStyles[elem.style]) {
                    if (oStyleTypes.par == nStyleType) {
                        elem.pPr.PStyle = elem.style;
                    } else {
                        if (oStyleTypes.table == nStyleType) {
                            elem.pPr.TableStyle = elem.style;
                        } else {
                            elem.pPr.PStyle = elem.style;
                        }
                    }
                }
            }
        };
        fParseStyle(this.oReadResult.paraStyles, styles, oStyleTypes.par);
        fParseStyle(this.oReadResult.tableStyles, styles, oStyleTypes.table);
        fParseStyle(this.oReadResult.lvlStyles, styles, oStyleTypes.lvl);
        var nStId = styles.length;
        if (null == stDefault.Character) {
            var oNewStyle = new CStyle("GenStyleDefChar", null, null, styletype_Character);
            stDefault.Character = nStId.toString();
            styles[nStId] = oNewStyle;
            nStId++;
        }
        if (null == stDefault.Numbering) {
            var oNewStyle = new CStyle("GenStyleDefNum", null, null, styletype_Numbering);
            stDefault.Numbering = nStId.toString();
            styles[nStId] = oNewStyle;
            nStId++;
        }
        if (null == stDefault.Paragraph) {
            var oNewStyle = new CStyle("GenStyleDefPar", null, null, styletype_Paragraph);
            stDefault.Paragraph = nStId.toString();
            styles[nStId] = oNewStyle;
            nStId++;
        }
        if (null == stDefault.Table) {
            var oNewStyle = new CStyle("GenStyleDefTable", null, null, styletype_Table);
            stDefault.Table = nStId.toString();
            styles[nStId] = oNewStyle;
            nStId++;
        }
        var aStylesGrey = {};
        for (var stId in styles) {
            this.PostLoadPrepareCheckStylesRecursion(stId, aStylesGrey, styles);
        }
        if (null != this.oReadResult.DefpPr) {
            this.Document.Styles.Default.ParaPr.Merge(this.oReadResult.DefpPr);
        }
        if (null != this.oReadResult.DefrPr) {
            this.Document.Styles.Default.TextPr.Merge(this.oReadResult.DefrPr);
        }
        var setting = this.oReadResult.setting;
        var fInitCommentData = function (comment) {
            var oCommentObj = new CCommentData();
            if (null != comment.UserName) {
                oCommentObj.m_sUserName = comment.UserName;
            }
            if (null != comment.UserId) {
                oCommentObj.m_sUserId = comment.UserId;
            }
            if (null != comment.Date) {
                oCommentObj.m_sTime = comment.Date;
            }
            if (null != comment.Text) {
                oCommentObj.m_sText = comment.Text;
            }
            if (null != comment.Solved) {
                oCommentObj.m_bSolved = comment.Solved;
            }
            if (null != comment.Replies) {
                for (var i = 0, length = comment.Replies.length; i < length; ++i) {
                    oCommentObj.Add_Reply(fInitCommentData(comment.Replies[i]));
                }
            }
            return oCommentObj;
        };
        var oCommentsNewId = {};
        for (var i in this.oReadResult.oComments) {
            var oOldComment = this.oReadResult.oComments[i];
            var oNewComment = new CComment(this.Document.Comments, fInitCommentData(oOldComment));
            this.Document.Comments.Add(oNewComment);
            oCommentsNewId[oOldComment.Id] = oNewComment;
        }
        for (var i in this.oReadResult.oCommentsPlaces) {
            var item = this.oReadResult.oCommentsPlaces[i];
            var bToDelete = true;
            if (null != item.Start && null != item.End) {
                var oCommentObj = oCommentsNewId[item.Start.Id];
                if (oCommentObj) {
                    bToDelete = false;
                    if (null != item.QuoteText) {
                        oCommentObj.Data.m_sQuoteText = item.QuoteText;
                    }
                    item.Start.oParaComment.Set_CommentId(oCommentObj.Get_Id());
                    item.End.oParaComment.Set_CommentId(oCommentObj.Get_Id());
                }
            }
            if (bToDelete) {
                if (null != item.Start && null != item.Start.oParent) {
                    var oParent = item.Start.oParent;
                    var oParaComment = item.Start.oParaComment;
                    for (var i = OpenParStruct.prototype._GetContentLength(oParent) - 1; i >= 0; --i) {
                        if (oParaComment == OpenParStruct.prototype._GetFromContent(oParent, i)) {
                            OpenParStruct.prototype._removeFromContent(oParent, i, 1);
                            break;
                        }
                    }
                }
                if (null != item.End && null != item.End.oParent) {
                    var oParent = item.End.oParent;
                    var oParaComment = item.End.oParaComment;
                    for (var i = OpenParStruct.prototype._GetContentLength(oParent) - 1; i >= 0; --i) {
                        if (oParaComment == OpenParStruct.prototype._GetFromContent(oParent, i)) {
                            OpenParStruct.prototype._removeFromContent(oParent, i, 1);
                            break;
                        }
                    }
                }
            }
        }
        for (var i in oCommentsNewId) {
            var oNewComment = oCommentsNewId[i];
            this.Document.DrawingDocument.m_oWordControl.m_oApi.sync_AddComment(oNewComment.Id, oNewComment.Data);
        }
        this.Document.Content = this.oReadResult.DocumentContent;
        if (this.Document.Content.length == 0) {
            var oNewParagraph = new Paragraph(this.Document.DrawingDocument, this.Document, 0, 0, 0, 0, 0);
            this.Document.Content.push(oNewParagraph);
        }
        this.Document.On_EndLoad();
        window.global_pptx_content_loader.Clear(true);
    };
    this.ReadFromString = function (sBase64, isCopyPaste) {
        window.global_pptx_content_loader.Clear();
        window.global_pptx_content_loader.Start_UseFullUrl();
        this.stream = this.getbase64DecodedData(sBase64);
        this.ReadMainTable();
        var oReadResult = this.oReadResult;
        for (var i in oReadResult.numToNumClass) {
            var oNumClass = oReadResult.numToNumClass[i];
            var documentANum = this.Document.Numbering.AbstractNum;
            var isAlreadyContains = false;
            for (var n in documentANum) {
                var isEqual = documentANum[n].isEqual(oNumClass);
                if (isEqual == true) {
                    isAlreadyContains = true;
                    break;
                }
            }
            if (!isAlreadyContains) {
                this.Document.Numbering.Add_AbstractNum(oNumClass);
            } else {
                oReadResult.numToNumClass[i] = documentANum[n];
            }
        }
        for (var i = 0, length = oReadResult.paraNumPrs.length; i < length; ++i) {
            var numPr = oReadResult.paraNumPrs[i];
            var oNumClass = oReadResult.numToNumClass[numPr.NumId];
            if (null != oNumClass) {
                numPr.NumId = oNumClass.Get_Id();
            } else {
                numPr.NumId = 0;
            }
        }
        var isAlreadyContainsStyle;
        var oStyleTypes = {
            par: 1,
            table: 2,
            lvl: 3
        };
        var addNewStyles = false;
        var fParseStyle = function (aStyles, oDocumentStyles, oReadResult, nStyleType) {
            if (aStyles == undefined) {
                return;
            }
            for (var i = 0, length = aStyles.length; i < length; ++i) {
                var elem = aStyles[i];
                var stylePaste = oReadResult.styles[elem.style];
                var isEqualName = null;
                if (null != stylePaste && null != stylePaste.style && oDocumentStyles) {
                    for (var j in oDocumentStyles.Style) {
                        var styleDoc = oDocumentStyles.Style[j];
                        isAlreadyContainsStyle = styleDoc.isEqual(stylePaste.style);
                        if (styleDoc.Name == stylePaste.style.Name) {
                            isEqualName = j;
                        }
                        if (isAlreadyContainsStyle) {
                            if (oStyleTypes.par == nStyleType) {
                                elem.pPr.PStyle = j;
                            } else {
                                if (oStyleTypes.table == nStyleType) {
                                    elem.pPr.Set_TableStyle2(j);
                                } else {
                                    elem.pPr.PStyle = j;
                                }
                            }
                            break;
                        }
                    }
                    if (!isAlreadyContainsStyle && isEqualName != null) {
                        if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                            elem.pPr.PStyle = isEqualName;
                        } else {
                            if (nStyleType == oStyleTypes.table) {
                                elem.pPr.Set_TableStyle2(isEqualName);
                            }
                        }
                    } else {
                        if (!isAlreadyContainsStyle && isEqualName == null) {
                            var nStyleId = oDocumentStyles.Add(stylePaste.style);
                            if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                                elem.pPr.PStyle = nStyleId;
                            } else {
                                if (nStyleType == oStyleTypes.table) {
                                    elem.pPr.Set_TableStyle2(nStyleId);
                                }
                            }
                            addNewStyles = true;
                        }
                    }
                }
            }
        };
        fParseStyle(this.oReadResult.paraStyles, this.Document.Styles, this.oReadResult, oStyleTypes.par);
        fParseStyle(this.oReadResult.tableStyles, this.Document.Styles, this.oReadResult, oStyleTypes.table);
        fParseStyle(this.oReadResult.lvlStyles, this.Document.Styles, this.oReadResult, oStyleTypes.lvl);
        var aContent = this.oReadResult.DocumentContent;
        for (var i = 0, length = this.oReadResult.aPostOpenStyleNumCallbacks.length; i < length; ++i) {
            this.oReadResult.aPostOpenStyleNumCallbacks[i].call();
        }
        var bInBlock;
        if (oReadResult.bLastRun) {
            bInBlock = false;
        } else {
            bInBlock = true;
        }
        var AllFonts = {};
        if (this.Document.Numbering) {
            this.Document.Numbering.Document_Get_AllFontNames(AllFonts);
        }
        if (this.Document.Styles) {
            this.Document.Styles.Document_Get_AllFontNames(AllFonts);
        }
        for (var Index = 0, Count = aContent.length; Index < Count; Index++) {
            aContent[Index].Document_Get_AllFontNames(AllFonts);
        }
        var aPrepeareFonts = [];
        var oDocument = this.Document && this.Document.LogicDocument ? this.Document.LogicDocument : this.Document;
        var fontScheme;
        var m_oLogicDocument = editor.WordControl.m_oLogicDocument;
        if (m_oLogicDocument && m_oLogicDocument.slideMasters && m_oLogicDocument.slideMasters[0] && m_oLogicDocument.slideMasters[0].Theme && m_oLogicDocument.slideMasters[0].Theme.themeElements) {
            fontScheme = m_oLogicDocument.slideMasters[0].Theme.themeElements.fontScheme;
        } else {
            fontScheme = oDocument.theme.themeElements.fontScheme;
        }
        checkThemeFonts(AllFonts, fontScheme);
        for (var i in AllFonts) {
            aPrepeareFonts.push(new CFont(i, 0, "", 0));
        }
        var oPastedImagesUnique = {};
        var aPastedImages = window.global_pptx_content_loader.End_UseFullUrl();
        for (var i = 0, length = aPastedImages.length; i < length; ++i) {
            var elem = aPastedImages[i];
            oPastedImagesUnique[elem.Url] = 1;
        }
        var aPrepeareImages = [];
        for (var i in oPastedImagesUnique) {
            aPrepeareImages.push(i);
        }
        if (!isCopyPaste) {
            this.Document.Content = this.oReadResult.DocumentContent;
            if (this.Document.Content.length == 0) {
                var oNewParagraph = new Paragraph(this.Document.DrawingDocument, this.Document, 0, 0, 0, 0, 0);
                this.Document.Content.push(oNewParagraph);
            }
            this.Document.On_EndLoad();
        }
        var setting = this.oReadResult.setting;
        var fInitCommentData = function (comment) {
            var oCommentObj = new CCommentData();
            if (null != comment.UserName) {
                oCommentObj.m_sUserName = comment.UserName;
            }
            if (null != comment.UserId) {
                oCommentObj.m_sUserId = comment.UserId;
            }
            if (null != comment.Date) {
                oCommentObj.m_sTime = comment.Date;
            }
            if (null != comment.Text) {
                oCommentObj.m_sText = comment.Text;
            }
            if (null != comment.Solved) {
                oCommentObj.m_bSolved = comment.Solved;
            }
            if (null != comment.Replies) {
                for (var i = 0, length = comment.Replies.length; i < length; ++i) {
                    oCommentObj.Add_Reply(fInitCommentData(comment.Replies[i]));
                }
            }
            return oCommentObj;
        };
        var oCommentsNewId = {};
        for (var i in this.oReadResult.oComments) {
            if (this.oReadResult.oCommentsPlaces && this.oReadResult.oCommentsPlaces[i] && this.oReadResult.oCommentsPlaces[i].Start != null && this.oReadResult.oCommentsPlaces[i].End != null && this.Document && this.Document.Comments && isCopyPaste === true) {
                var oOldComment = this.oReadResult.oComments[i];
                var oNewComment = new CComment(this.Document.Comments, fInitCommentData(oOldComment));
                this.Document.Comments.Add(oNewComment);
                oCommentsNewId[oOldComment.Id] = oNewComment;
            }
        }
        for (var i in this.oReadResult.oCommentsPlaces) {
            var item = this.oReadResult.oCommentsPlaces[i];
            var bToDelete = true;
            if (null != item.Start && null != item.End) {
                var oCommentObj = oCommentsNewId[item.Start.Id];
                if (oCommentObj) {
                    bToDelete = false;
                    if (null != item.QuoteText) {
                        oCommentObj.Data.m_sQuoteText = item.QuoteText;
                    }
                    item.Start.oParaComment.Set_CommentId(oCommentObj.Get_Id());
                    item.End.oParaComment.Set_CommentId(oCommentObj.Get_Id());
                }
            }
            if (bToDelete) {
                if (null != item.Start && null != item.Start.oParent) {
                    var oParent = item.Start.oParent;
                    var oParaComment = item.Start.oParaComment;
                    for (var i = OpenParStruct.prototype._GetContentLength(oParent) - 1; i >= 0; --i) {
                        if (oParaComment == OpenParStruct.prototype._GetFromContent(oParent, i)) {
                            OpenParStruct.prototype._removeFromContent(oParent, i, 1);
                            break;
                        }
                    }
                }
                if (null != item.End && null != item.End.oParent) {
                    var oParent = item.End.oParent;
                    var oParaComment = item.End.oParaComment;
                    for (var i = OpenParStruct.prototype._GetContentLength(oParent) - 1; i >= 0; --i) {
                        if (oParaComment == OpenParStruct.prototype._GetFromContent(oParent, i)) {
                            OpenParStruct.prototype._removeFromContent(oParent, i, 1);
                            break;
                        }
                    }
                }
            }
        }
        for (var i in oCommentsNewId) {
            var oNewComment = oCommentsNewId[i];
            this.Document.DrawingDocument.m_oWordControl.m_oApi.sync_AddComment(oNewComment.Id, oNewComment.Data);
        }
        window.global_pptx_content_loader.Clear(true);
        return {
            content: aContent,
            fonts: aPrepeareFonts,
            images: aPrepeareImages,
            bAddNewStyles: addNewStyles,
            aPastedImages: aPastedImages,
            bInBlock: bInBlock
        };
    };
}
function BinaryStyleTableReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.brPrr = new Binary_rPrReader(this.Document, this.stream);
    this.bpPrr = new Binary_pPrReader(this.Document, this.oReadResult, this.stream);
    this.btblPrr = new Binary_tblPrReader(this.Document, this.oReadResult, this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadStyleTableContent(t, l);
        });
    };
    this.ReadStyleTableContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_st.Styles == type) {
            var oThis = this;
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadStyle(t, l);
            });
        } else {
            if (c_oSer_st.DefpPr == type) {
                var ParaPr = new CParaPr();
                res = this.bpPrr.Read(length, ParaPr);
                this.oReadResult.DefpPr = ParaPr;
            } else {
                if (c_oSer_st.DefrPr == type) {
                    var TextPr = new CTextPr();
                    res = this.brPrr.Read(length, TextPr);
                    this.oReadResult.DefrPr = TextPr;
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadStyle = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_sts.Style == type) {
            var oThis = this;
            var oNewStyle = new CStyle(null, null, null, null);
            var oNewId = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadStyleContent(t, l, oNewStyle, oNewId);
            });
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            if (null != oNewId.id) {
                this.oReadResult.styles[oNewId.id] = {
                    style: oNewStyle,
                    param: oNewId
                };
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadStyleContent = function (type, length, style, oId) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_sts.Style_Name == type) {
            style.Set_Name(this.stream.GetString2LE(length));
        } else {
            if (c_oSer_sts.Style_Id == type) {
                oId.id = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_sts.Style_Type == type) {
                    var nStyleType = styletype_Paragraph;
                    switch (this.stream.GetUChar()) {
                    case c_oSer_StyleType.Character:
                        nStyleType = styletype_Character;
                        break;
                    case c_oSer_StyleType.Numbering:
                        nStyleType = styletype_Numbering;
                        break;
                    case c_oSer_StyleType.Paragraph:
                        nStyleType = styletype_Paragraph;
                        break;
                    case c_oSer_StyleType.Table:
                        nStyleType = styletype_Table;
                        break;
                    }
                    style.Set_Type(nStyleType);
                } else {
                    if (c_oSer_sts.Style_Default == type) {
                        oId.def = this.stream.GetBool();
                    } else {
                        if (c_oSer_sts.Style_BasedOn == type) {
                            style.Set_BasedOn(this.stream.GetString2LE(length));
                        } else {
                            if (c_oSer_sts.Style_Next == type) {
                                style.Set_Next(this.stream.GetString2LE(length));
                            } else {
                                if (c_oSer_sts.Style_qFormat == type) {
                                    style.Set_QFormat(this.stream.GetBool());
                                } else {
                                    if (c_oSer_sts.Style_uiPriority == type) {
                                        style.Set_UiPriority(this.stream.GetULongLE());
                                    } else {
                                        if (c_oSer_sts.Style_hidden == type) {
                                            style.Set_Hidden(this.stream.GetBool());
                                        } else {
                                            if (c_oSer_sts.Style_semiHidden == type) {
                                                style.Set_SemiHidden(this.stream.GetBool());
                                            } else {
                                                if (c_oSer_sts.Style_unhideWhenUsed == type) {
                                                    style.Set_UnhideWhenUsed(this.stream.GetBool());
                                                } else {
                                                    if (c_oSer_sts.Style_TextPr == type) {
                                                        var oNewTextPr = new CTextPr();
                                                        res = this.brPrr.Read(length, oNewTextPr);
                                                        style.Set_TextPr(oNewTextPr);
                                                    } else {
                                                        if (c_oSer_sts.Style_ParaPr == type) {
                                                            var oNewParaPr = new CParaPr();
                                                            res = this.bpPrr.Read(length, oNewParaPr, null);
                                                            style.ParaPr = oNewParaPr;
                                                            this.oReadResult.aPostOpenStyleNumCallbacks.push(function () {
                                                                style.Set_ParaPr(oNewParaPr);
                                                            });
                                                        } else {
                                                            if (c_oSer_sts.Style_TablePr == type) {
                                                                var oNewTablePr = new CTablePr();
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.btblPrr.Read_tblPr(t, l, oNewTablePr);
                                                                });
                                                                style.Set_TablePr(oNewTablePr);
                                                            } else {
                                                                if (c_oSer_sts.Style_RowPr == type) {
                                                                    var oNewTableRowPr = new CTableRowPr();
                                                                    res = this.bcr.Read2(length, function (t, l) {
                                                                        return oThis.btblPrr.Read_RowPr(t, l, oNewTableRowPr);
                                                                    });
                                                                    style.Set_TableRowPr(oNewTableRowPr);
                                                                } else {
                                                                    if (c_oSer_sts.Style_CellPr == type) {
                                                                        var oNewTableCellPr = new CTableCellPr();
                                                                        res = this.bcr.Read2(length, function (t, l) {
                                                                            return oThis.btblPrr.Read_CellPr(t, l, oNewTableCellPr);
                                                                        });
                                                                        style.Set_TableRowPr(oNewTableCellPr);
                                                                    } else {
                                                                        if (c_oSer_sts.Style_TblStylePr == type) {
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadTblStylePr(t, l, style);
                                                                            });
                                                                        } else {
                                                                            res = c_oSerConstants.ReadUnknown;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadTblStylePr = function (type, length, style) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_tblStylePrType.TblStylePr == type) {
            var oRes = {
                nType: null
            };
            var oNewTableStylePr = new CTableStylePr();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadTblStyleProperty(t, l, oNewTableStylePr, oRes);
            });
            if (null != oRes.nType) {
                switch (oRes.nType) {
                case ETblStyleOverrideType.tblstyleoverridetypeBand1Horz:
                    style.TableBand1Horz = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeBand1Vert:
                    style.TableBand1Vert = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeBand2Horz:
                    style.TableBand2Horz = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeBand2Vert:
                    style.TableBand2Vert = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeFirstCol:
                    style.TableFirstCol = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeFirstRow:
                    style.TableFirstRow = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeLastCol:
                    style.TableLastCol = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeLastRow:
                    style.TableLastRow = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeNeCell:
                    style.TableTRCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeNwCell:
                    style.TableTLCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeSeCell:
                    style.TableBRCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeSwCell:
                    style.TableBLCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeWholeTable:
                    style.TableWholeTable = oNewTableStylePr;
                    break;
                }
            }
            this.oReadResult.aPostOpenStyleNumCallbacks.push(function () {
                if (null != oRes.nType) {
                    switch (oRes.nType) {
                    case ETblStyleOverrideType.tblstyleoverridetypeBand1Horz:
                        style.Set_TableBand1Horz(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeBand1Vert:
                        style.Set_TableBand1Vert(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeBand2Horz:
                        style.Set_TableBand2Horz(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeBand2Vert:
                        style.Set_TableBand2Vert(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeFirstCol:
                        style.Set_TableFirstCol(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeFirstRow:
                        style.Set_TableFirstRow(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeLastCol:
                        style.Set_TableLastCol(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeLastRow:
                        style.Set_TableLastRow(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeNeCell:
                        style.Set_TableTRCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeNwCell:
                        style.Set_TableTLCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeSeCell:
                        style.Set_TableBRCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeSwCell:
                        style.Set_TableBLCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeWholeTable:
                        style.Set_TableWholeTable(oNewTableStylePr);
                        break;
                    }
                }
            });
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTblStyleProperty = function (type, length, oNewTableStylePr, oRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_tblStylePrType.Type == type) {
            oRes.nType = this.stream.GetUChar();
        } else {
            if (c_oSerProp_tblStylePrType.RunPr == type) {
                res = this.brPrr.Read(length, oNewTableStylePr.TextPr);
            } else {
                if (c_oSerProp_tblStylePrType.ParPr == type) {
                    res = this.bpPrr.Read(length, oNewTableStylePr.ParaPr, null);
                } else {
                    if (c_oSerProp_tblStylePrType.TblPr == type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.btblPrr.Read_tblPr(t, l, oNewTableStylePr.TablePr);
                        });
                    } else {
                        if (c_oSerProp_tblStylePrType.TrPr == type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.btblPrr.Read_RowPr(t, l, oNewTableStylePr.TableRowPr);
                            });
                        } else {
                            if (c_oSerProp_tblStylePrType.TcPr == type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.btblPrr.Read_CellPr(t, l, oNewTableStylePr.TableCellPr);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
}
function Binary_pPrReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.pPr;
    this.paragraph;
    this.bcr = new Binary_CommonReader(this.stream);
    this.brPrr = new Binary_rPrReader(this.Document, this.stream);
    this.Read = function (stLen, pPr, par) {
        this.pPr = pPr;
        this.paragraph = par;
        var oThis = this;
        return this.bcr.Read2(stLen, function (type, length) {
            return oThis.ReadContent(type, length);
        });
    };
    this.ReadContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var pPr = this.pPr;
        switch (type) {
        case c_oSerProp_pPrType.contextualSpacing:
            pPr.ContextualSpacing = this.stream.GetBool();
            break;
        case c_oSerProp_pPrType.Ind:
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadInd(t, l, pPr.Ind);
            });
            break;
        case c_oSerProp_pPrType.Jc:
            pPr.Jc = this.stream.GetUChar();
            break;
        case c_oSerProp_pPrType.KeepLines:
            pPr.KeepLines = this.stream.GetBool();
            break;
        case c_oSerProp_pPrType.KeepNext:
            pPr.KeepNext = this.stream.GetBool();
            break;
        case c_oSerProp_pPrType.PageBreakBefore:
            pPr.PageBreakBefore = this.stream.GetBool();
            break;
        case c_oSerProp_pPrType.Spacing:
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadSpacing(t, l, pPr.Spacing);
            });
            break;
        case c_oSerProp_pPrType.Shd:
            pPr.Shd = new CDocumentShd();
            var themeColor = {
                Auto: null,
                Color: null,
                Tint: null,
                Shade: null
            };
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.bcr.ReadShd(t, l, pPr.Shd, themeColor);
            });
            if (true == themeColor.Auto && null != pPr.Shd.Color) {
                pPr.Shd.Color.Auto = true;
            }
            var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
            if (null != unifill) {
                pPr.Shd.Unifill = unifill;
            } else {
                if (null != pPr.Shd.Color && !pPr.Shd.Color.Auto) {
                    pPr.Shd.Unifill = CreteSolidFillRGB(pPr.Shd.Color.r, pPr.Shd.Color.g, pPr.Shd.Color.b);
                }
            }
            break;
        case c_oSerProp_pPrType.WidowControl:
            pPr.WidowControl = this.stream.GetBool();
            break;
        case c_oSerProp_pPrType.Tab:
            pPr.Tabs = new CParaTabs();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadTabs(t, l, pPr.Tabs);
            });
            break;
        case c_oSerProp_pPrType.ParaStyle:
            var ParaStyle = this.stream.GetString2LE(length);
            this.oReadResult.paraStyles.push({
                pPr: pPr,
                style: ParaStyle
            });
            break;
        case c_oSerProp_pPrType.numPr:
            var numPr = new CNumPr();
            numPr.NumId = undefined;
            numPr.Lvl = undefined;
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadNumPr(t, l, numPr);
            });
            if (null != numPr.NumId || null != numPr.Lvl) {
                if (null != numPr.NumId) {
                    this.oReadResult.paraNumPrs.push(numPr);
                }
                pPr.NumPr = numPr;
            }
            break;
        case c_oSerProp_pPrType.pBdr:
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadBorders(t, l, pPr.Brd);
            });
            break;
        case c_oSerProp_pPrType.pPr_rPr:
            if (null != this.paragraph) {
                var oNewParaTextPr = new CTextPr();
                res = this.brPrr.Read(length, oNewParaTextPr);
                this.paragraph.TextPr.Apply_TextPr(oNewParaTextPr);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
            break;
        case c_oSerProp_pPrType.FramePr:
            pPr.FramePr = new CFramePr();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadFramePr(t, l, pPr.FramePr);
            });
            break;
        case c_oSerProp_pPrType.SectPr:
            if (null != this.paragraph && this.Document instanceof CDocument) {
                var oNewSectionPr = new CSectionPr(this.Document);
                var oAdditional = {
                    EvenAndOddHeaders: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.Read_SecPr(t, l, oNewSectionPr, oAdditional);
                });
                this.paragraph.Set_SectionPr(oNewSectionPr);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
            break;
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
    this.ReadBorder = function (type, length, Border) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerBorderType.Color === type) {
            Border.Color = this.bcr.ReadColor();
        } else {
            if (c_oSerBorderType.Space === type) {
                Border.Space = this.bcr.ReadDouble();
            } else {
                if (c_oSerBorderType.Size === type) {
                    Border.Size = this.bcr.ReadDouble();
                } else {
                    if (c_oSerBorderType.Value === type) {
                        Border.Value = this.stream.GetUChar();
                    } else {
                        if (c_oSerBorderType.ColorTheme === type) {
                            var themeColor = {
                                Auto: null,
                                Color: null,
                                Tint: null,
                                Shade: null
                            };
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.bcr.ReadColorTheme(t, l, themeColor);
                            });
                            if (true == themeColor.Auto) {
                                Border.Color = new CDocumentColor(0, 0, 0, true);
                            }
                            var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
                            if (null != unifill) {
                                Border.Unifill = unifill;
                            } else {
                                if (null != Border.Color && !Border.Color.Auto) {
                                    Border.Unifill = CreteSolidFillRGB(Border.Color.r, Border.Color.g, Border.Color.b);
                                }
                            }
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.NormalizeBorder = function (border) {
        if (null == border.Color) {
            border.Color = new CDocumentColor(0, 0, 0, true);
        } else {
            border.Color = new CDocumentColor(border.Color.r, border.Color.g, border.Color.b, border.Color.Auto);
        }
        if (null == border.Space) {
            border.Space = 0;
        }
        if (null == border.Size) {
            border.Size = 0.5 * g_dKoef_pt_to_mm;
        }
        if (null == border.Value) {
            border.Value = border_None;
        }
        return border;
    };
    this.ReadBorders = function (type, length, Borders) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oNewBorber = new CDocumentBorder();
        if (c_oSerBordersType.left === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadBorder(t, l, oNewBorber);
            });
            if (null != oNewBorber.Value) {
                Borders.Left = this.NormalizeBorder(oNewBorber);
            }
        } else {
            if (c_oSerBordersType.top === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadBorder(t, l, oNewBorber);
                });
                if (null != oNewBorber.Value) {
                    Borders.Top = this.NormalizeBorder(oNewBorber);
                }
            } else {
                if (c_oSerBordersType.right === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadBorder(t, l, oNewBorber);
                    });
                    if (null != oNewBorber.Value) {
                        Borders.Right = this.NormalizeBorder(oNewBorber);
                    }
                } else {
                    if (c_oSerBordersType.bottom === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadBorder(t, l, oNewBorber);
                        });
                        if (null != oNewBorber.Value) {
                            Borders.Bottom = this.NormalizeBorder(oNewBorber);
                        }
                    } else {
                        if (c_oSerBordersType.insideV === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadBorder(t, l, oNewBorber);
                            });
                            if (null != oNewBorber.Value) {
                                Borders.InsideV = this.NormalizeBorder(oNewBorber);
                            }
                        } else {
                            if (c_oSerBordersType.insideH === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadBorder(t, l, oNewBorber);
                                });
                                if (null != oNewBorber.Value) {
                                    Borders.InsideH = this.NormalizeBorder(oNewBorber);
                                }
                            } else {
                                if (c_oSerBordersType.between === type) {
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadBorder(t, l, oNewBorber);
                                    });
                                    if (null != oNewBorber.Value) {
                                        Borders.Between = this.NormalizeBorder(oNewBorber);
                                    }
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadInd = function (type, length, Ind) {
        var res = c_oSerConstants.ReadOk;
        switch (type) {
        case c_oSerProp_pPrType.Ind_Left:
            Ind.Left = this.bcr.ReadDouble();
            break;
        case c_oSerProp_pPrType.Ind_Right:
            Ind.Right = this.bcr.ReadDouble();
            break;
        case c_oSerProp_pPrType.Ind_FirstLine:
            Ind.FirstLine = this.bcr.ReadDouble();
            break;
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
    this.ReadSpacing = function (type, length, Spacing) {
        var res = c_oSerConstants.ReadOk;
        switch (type) {
        case c_oSerProp_pPrType.Spacing_Line:
            Spacing.Line = this.bcr.ReadDouble();
            break;
        case c_oSerProp_pPrType.Spacing_LineRule:
            Spacing.LineRule = this.stream.GetUChar();
            break;
        case c_oSerProp_pPrType.Spacing_Before:
            Spacing.Before = this.bcr.ReadDouble();
            break;
        case c_oSerProp_pPrType.Spacing_After:
            Spacing.After = this.bcr.ReadDouble();
            break;
        case c_oSerProp_pPrType.Spacing_BeforeAuto:
            Spacing.BeforeAutoSpacing = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_pPrType.Spacing_AfterAuto:
            Spacing.AfterAutoSpacing = (this.stream.GetUChar() != 0);
            break;
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
    this.ReadTabs = function (type, length, Tabs) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_pPrType.Tab_Item == type) {
            var oNewTab = new CParaTab();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadTabItem(t, l, oNewTab);
            });
            if (null != oNewTab.Pos && null != oNewTab.Value) {
                Tabs.Add(oNewTab);
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTabItem = function (type, length, tab) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerProp_pPrType.Tab_Item_Val == type) {
            switch (this.stream.GetUChar()) {
            case g_tabtype_right:
                tab.Value = tab_Right;
                break;
            case g_tabtype_center:
                tab.Value = tab_Center;
                break;
            case g_tabtype_clear:
                tab.Value = tab_Clear;
                break;
            default:
                tab.Value = tab_Left;
            }
        } else {
            if (c_oSerProp_pPrType.Tab_Item_Pos == type) {
                tab.Pos = this.bcr.ReadDouble();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadNumPr = function (type, length, numPr) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerProp_pPrType.numPr_lvl == type) {
            numPr.Lvl = this.stream.GetULongLE();
        } else {
            if (c_oSerProp_pPrType.numPr_id == type) {
                numPr.NumId = this.stream.GetULongLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadFramePr = function (type, length, oFramePr) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_FramePrType.DropCap == type) {
            oFramePr.DropCap = this.stream.GetUChar();
        } else {
            if (c_oSer_FramePrType.H == type) {
                oFramePr.H = g_dKoef_twips_to_mm * this.stream.GetULongLE();
            } else {
                if (c_oSer_FramePrType.HAnchor == type) {
                    oFramePr.HAnchor = this.stream.GetUChar();
                } else {
                    if (c_oSer_FramePrType.HRule == type) {
                        oFramePr.HRule = this.stream.GetUChar();
                    } else {
                        if (c_oSer_FramePrType.HSpace == type) {
                            oFramePr.HSpace = g_dKoef_twips_to_mm * this.stream.GetULongLE();
                        } else {
                            if (c_oSer_FramePrType.Lines == type) {
                                oFramePr.Lines = this.stream.GetULongLE();
                            } else {
                                if (c_oSer_FramePrType.VAnchor == type) {
                                    oFramePr.VAnchor = this.stream.GetUChar();
                                } else {
                                    if (c_oSer_FramePrType.VSpace == type) {
                                        oFramePr.VSpace = g_dKoef_twips_to_mm * this.stream.GetULongLE();
                                    } else {
                                        if (c_oSer_FramePrType.W == type) {
                                            oFramePr.W = g_dKoef_twips_to_mm * this.stream.GetULongLE();
                                        } else {
                                            if (c_oSer_FramePrType.Wrap == type) {
                                                var nEditorWrap = wrap_None;
                                                switch (this.stream.GetUChar()) {
                                                case EWrap.wrapAround:
                                                    nEditorWrap = wrap_Around;
                                                    break;
                                                case EWrap.wrapAuto:
                                                    nEditorWrap = wrap_Auto;
                                                    break;
                                                case EWrap.wrapNone:
                                                    nEditorWrap = wrap_None;
                                                    break;
                                                case EWrap.wrapNotBeside:
                                                    nEditorWrap = wrap_NotBeside;
                                                    break;
                                                case EWrap.wrapThrough:
                                                    nEditorWrap = wrap_Through;
                                                    break;
                                                case EWrap.wrapTight:
                                                    nEditorWrap = wrap_Tight;
                                                    break;
                                                }
                                                oFramePr.Wrap = nEditorWrap;
                                            } else {
                                                if (c_oSer_FramePrType.X == type) {
                                                    oFramePr.X = g_dKoef_twips_to_mm * this.stream.GetULongLE();
                                                } else {
                                                    if (c_oSer_FramePrType.XAlign == type) {
                                                        oFramePr.XAlign = this.stream.GetUChar();
                                                    } else {
                                                        if (c_oSer_FramePrType.Y == type) {
                                                            oFramePr.Y = g_dKoef_twips_to_mm * this.stream.GetULongLE();
                                                        } else {
                                                            if (c_oSer_FramePrType.YAlign == type) {
                                                                oFramePr.YAlign = this.stream.GetUChar();
                                                            } else {
                                                                res = c_oSerConstants.ReadUnknown;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.Read_SecPr = function (type, length, oSectPr, oAdditional) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrType.pgSz === type) {
            var oSize = {
                W: null,
                H: null,
                Orientation: null
            };
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.Read_pgSz(t, l, oSize);
            });
            if (null != oSize.W && null != oSize.H) {
                oSectPr.Set_PageSize(oSize.W, oSize.H);
            }
            if (null != oSize.Orientation) {
                oSectPr.Set_Orientation(oSize.Orientation);
            }
        } else {
            if (c_oSerProp_secPrType.pgMar === type) {
                var oMar = {
                    L: null,
                    T: null,
                    R: null,
                    B: null
                };
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.Read_pgMar(t, l, oSectPr, oMar, oAdditional);
                });
                if (null != oMar.L && null != oMar.T && null != oMar.R && null != oMar.B) {
                    oSectPr.Set_PageMargins(oMar.L, oMar.T, oMar.R, oMar.B);
                }
            } else {
                if (c_oSerProp_secPrType.setting === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.Read_setting(t, l, oSectPr, oAdditional);
                    });
                } else {
                    if (c_oSerProp_secPrType.headers === type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.Read_pgHdrFtr(t, l, oSectPr, oThis.oReadResult.headers, true);
                        });
                    } else {
                        if (c_oSerProp_secPrType.footers === type) {
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.Read_pgHdrFtr(t, l, oSectPr, oThis.oReadResult.footers, false);
                            });
                        } else {
                            if (c_oSerProp_secPrType.pageNumType === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.Read_pageNumType(t, l, oSectPr);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.Read_setting = function (type, length, oSectPr, oAdditional) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrSettingsType.titlePg === type) {
            oSectPr.Set_TitlePage(this.stream.GetBool());
        } else {
            if (c_oSerProp_secPrSettingsType.EvenAndOddHeaders === type) {
                oAdditional.EvenAndOddHeaders = this.stream.GetBool();
            } else {
                if (c_oSerProp_secPrSettingsType.SectionType === type) {
                    var nEditorType = null;
                    switch (this.stream.GetByte()) {
                    case ESectionMark.sectionmarkContinious:
                        nEditorType = section_type_Continuous;
                        break;
                    case ESectionMark.sectionmarkEvenPage:
                        nEditorType = section_type_EvenPage;
                        break;
                    case ESectionMark.sectionmarkNextColumn:
                        nEditorType = section_type_Column;
                        break;
                    case ESectionMark.sectionmarkNextPage:
                        nEditorType = section_type_NextPage;
                        break;
                    case ESectionMark.sectionmarkOddPage:
                        nEditorType = section_type_OddPage;
                        break;
                    }
                    if (null != nEditorType) {
                        oSectPr.Set_Type(nEditorType);
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.Read_pgSz = function (type, length, oSize) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_pgSzType.Orientation === type) {
            oSize.Orientation = this.stream.GetUChar();
        } else {
            if (c_oSer_pgSzType.W === type) {
                oSize.W = this.bcr.ReadDouble();
            } else {
                if (c_oSer_pgSzType.H === type) {
                    oSize.H = this.bcr.ReadDouble();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.Read_pgMar = function (type, length, oSectPr, oMar, oAdditional) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_pgMarType.Left === type) {
            oMar.L = this.bcr.ReadDouble();
        } else {
            if (c_oSer_pgMarType.Top === type) {
                oMar.T = this.bcr.ReadDouble();
            } else {
                if (c_oSer_pgMarType.Right === type) {
                    oMar.R = this.bcr.ReadDouble();
                } else {
                    if (c_oSer_pgMarType.Bottom === type) {
                        oMar.B = this.bcr.ReadDouble();
                    } else {
                        if (c_oSer_pgMarType.Header === type) {
                            oSectPr.Set_PageMargins_Header(this.bcr.ReadDouble());
                        } else {
                            if (c_oSer_pgMarType.Footer === type) {
                                oSectPr.Set_PageMargins_Footer(this.bcr.ReadDouble());
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.Read_pgHdrFtr = function (type, length, oSectPr, aHdrFtr, bHeader) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrType.hdrftrelem === type) {
            var nIndex = this.stream.GetULongLE();
            if (nIndex >= 0 && nIndex < aHdrFtr.length) {
                var item = aHdrFtr[nIndex];
                if (bHeader) {
                    switch (item.type) {
                    case c_oSerHdrFtrTypes.HdrFtr_First:
                        oSectPr.Set_Header_First(item.elem);
                        break;
                    case c_oSerHdrFtrTypes.HdrFtr_Even:
                        oSectPr.Set_Header_Even(item.elem);
                        break;
                    case c_oSerHdrFtrTypes.HdrFtr_Odd:
                        oSectPr.Set_Header_Default(item.elem);
                        break;
                    }
                } else {
                    switch (item.type) {
                    case c_oSerHdrFtrTypes.HdrFtr_First:
                        oSectPr.Set_Footer_First(item.elem);
                        break;
                    case c_oSerHdrFtrTypes.HdrFtr_Even:
                        oSectPr.Set_Footer_Even(item.elem);
                        break;
                    case c_oSerHdrFtrTypes.HdrFtr_Odd:
                        oSectPr.Set_Footer_Default(item.elem);
                        break;
                    }
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.Read_pageNumType = function (type, length, oSectPr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrPageNumType.start === type) {
            oSectPr.Set_PageNum_Start(this.stream.GetULongLE());
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_rPrReader(doc, stream) {
    this.Document = doc;
    this.stream = stream;
    this.rPr;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function (stLen, rPr) {
        this.rPr = rPr;
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        res = this.bcr.Read2(stLen, function (type, length) {
            return oThis.ReadContent(type, length);
        });
        return res;
    };
    this.ReadContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var rPr = this.rPr;
        switch (type) {
        case c_oSerProp_rPrType.Bold:
            rPr.Bold = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.Italic:
            rPr.Italic = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.Underline:
            rPr.Underline = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.Strikeout:
            rPr.Strikeout = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.FontAscii:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = {};
            }
            rPr.RFonts.Ascii = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontHAnsi:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = {};
            }
            rPr.RFonts.HAnsi = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontAE:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = {};
            }
            rPr.RFonts.EastAsia = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontCS:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = {};
            }
            rPr.RFonts.CS = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontSize:
            rPr.FontSize = this.stream.GetULongLE() / 2;
            break;
        case c_oSerProp_rPrType.Color:
            rPr.Color = this.bcr.ReadColor();
            break;
        case c_oSerProp_rPrType.VertAlign:
            rPr.VertAlign = this.stream.GetUChar();
            break;
        case c_oSerProp_rPrType.HighLight:
            rPr.HighLight = this.bcr.ReadColor();
            break;
        case c_oSerProp_rPrType.HighLightTyped:
            var nHighLightTyped = this.stream.GetUChar();
            if (nHighLightTyped == c_oSer_ColorType.None) {
                rPr.HighLight = highlight_None;
            }
            break;
        case c_oSerProp_rPrType.RStyle:
            rPr.RStyle = this.stream.GetString2LE(length);
            break;
        case c_oSerProp_rPrType.Spacing:
            rPr.Spacing = this.bcr.ReadDouble();
            break;
        case c_oSerProp_rPrType.DStrikeout:
            rPr.DStrikeout = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.Caps:
            rPr.Caps = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.SmallCaps:
            rPr.SmallCaps = (this.stream.GetUChar() != 0);
            break;
        case c_oSerProp_rPrType.Position:
            rPr.Position = this.bcr.ReadDouble();
            break;
        case c_oSerProp_rPrType.FontHint:
            var nHint;
            switch (this.stream.GetUChar()) {
            case EHint.hintCs:
                nHint = fonthint_CS;
                break;
            case EHint.hintEastAsia:
                nHint = fonthint_EastAsia;
                break;
            default:
                nHint = fonthint_Default;
                break;
            }
            rPr.RFonts.Hint = nHint;
            break;
        case c_oSerProp_rPrType.BoldCs:
            rPr.BoldCS = this.stream.GetBool();
            break;
        case c_oSerProp_rPrType.ItalicCs:
            rPr.ItalicCS = this.stream.GetBool();
            break;
        case c_oSerProp_rPrType.FontSizeCs:
            rPr.FontSizeCS = this.stream.GetULongLE() / 2;
            break;
        case c_oSerProp_rPrType.Cs:
            rPr.CS = this.stream.GetBool();
            break;
        case c_oSerProp_rPrType.Rtl:
            rPr.RTL = this.stream.GetBool();
            break;
        case c_oSerProp_rPrType.Lang:
            if (null == rPr.Lang) {
                rPr.Lang = new CLang();
            }
            var sLang = this.stream.GetString2LE(length);
            var nLcid = g_oLcidNameToIdMap[sLang];
            if (null != nLcid) {
                rPr.Lang.Val = nLcid;
            }
            break;
        case c_oSerProp_rPrType.LangBidi:
            if (null == rPr.Lang) {
                rPr.Lang = new CLang();
            }
            var sLang = this.stream.GetString2LE(length);
            var nLcid = g_oLcidNameToIdMap[sLang];
            if (null != nLcid) {
                rPr.Lang.Bidi = nLcid;
            }
            break;
        case c_oSerProp_rPrType.LangEA:
            if (null == rPr.Lang) {
                rPr.Lang = new CLang();
            }
            var sLang = this.stream.GetString2LE(length);
            var nLcid = g_oLcidNameToIdMap[sLang];
            if (null != nLcid) {
                rPr.Lang.EastAsia = nLcid;
            }
            break;
        case c_oSerProp_rPrType.ColorTheme:
            var themeColor = {
                Auto: null,
                Color: null,
                Tint: null,
                Shade: null
            };
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.bcr.ReadColorTheme(t, l, themeColor);
            });
            if (true == themeColor.Auto) {
                rPr.Color = new CDocumentColor(0, 0, 0, true);
            }
            var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
            if (null != unifill) {
                rPr.Unifill = unifill;
            } else {
                if (null != rPr.Color && !rPr.Color.Auto) {
                    rPr.Unifill = CreteSolidFillRGB(rPr.Color.r, rPr.Color.g, rPr.Color.b);
                }
            }
            break;
        case c_oSerProp_rPrType.Shd:
            rPr.Shd = new CDocumentShd();
            var themeColor = {
                Auto: null,
                Color: null,
                Tint: null,
                Shade: null
            };
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.bcr.ReadShd(t, l, rPr.Shd, themeColor);
            });
            if (true == themeColor.Auto && null != rPr.Shd.Color) {
                rPr.Shd.Color.Auto = true;
            }
            var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
            if (null != unifill) {
                rPr.Shd.Unifill = unifill;
            } else {
                if (null != rPr.Shd.Color && !rPr.Shd.Color.Auto) {
                    rPr.Shd.Unifill = CreteSolidFillRGB(rPr.Shd.Color.r, rPr.Shd.Color.g, rPr.Shd.Color.b);
                }
            }
            break;
        case c_oSerProp_rPrType.Vanish:
            rPr.Vanish = this.stream.GetBool();
            break;
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
}
function Binary_tblPrReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.bpPrr = new Binary_pPrReader(this.Document, this.oReadResult, this.stream);
}
Binary_tblPrReader.prototype = {
    Read_tblPr: function (type, length, Pr, table) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_tblPrType.Jc === type) {
            Pr.Jc = this.stream.GetUChar();
        } else {
            if (c_oSerProp_tblPrType.TableInd === type) {
                Pr.TableInd = this.bcr.ReadDouble();
            } else {
                if (c_oSerProp_tblPrType.TableW === type) {
                    var oW = {
                        Type: null,
                        W: null,
                        WDocx: null
                    };
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadW(t, l, oW);
                    });
                    if (null == Pr.TableW) {
                        Pr.TableW = new CTableMeasurement(tblwidth_Auto, 0);
                    }
                    this.ParseW(oW, Pr.TableW);
                } else {
                    if (c_oSerProp_tblPrType.TableCellMar === type) {
                        if (null == Pr.TableCellMar) {
                            Pr.TableCellMar = this.GetNewMargin();
                        }
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCellMargins(t, l, Pr.TableCellMar);
                        });
                    } else {
                        if (c_oSerProp_tblPrType.TableBorders === type) {
                            if (null == Pr.TableBorders) {
                                Pr.TableBorders = {
                                    Bottom: undefined,
                                    Left: undefined,
                                    Right: undefined,
                                    Top: undefined,
                                    InsideH: undefined,
                                    InsideV: undefined
                                };
                            }
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.bpPrr.ReadBorders(t, l, Pr.TableBorders);
                            });
                        } else {
                            if (c_oSerProp_tblPrType.Shd === type) {
                                if (null == Pr.Shd) {
                                    Pr.Shd = new CDocumentShd();
                                }
                                var themeColor = {
                                    Auto: null,
                                    Color: null,
                                    Tint: null,
                                    Shade: null
                                };
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.bcr.ReadShd(t, l, Pr.Shd, themeColor);
                                });
                                if (true == themeColor.Auto && null != Pr.Shd.Color) {
                                    Pr.Shd.Color.Auto = true;
                                }
                                var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
                                if (null != unifill) {
                                    Pr.Shd.Unifill = unifill;
                                } else {
                                    if (null != Pr.Shd.Color && !Pr.Shd.Color.Auto) {
                                        Pr.Shd.Unifill = CreteSolidFillRGB(Pr.Shd.Color.r, Pr.Shd.Color.g, Pr.Shd.Color.b);
                                    }
                                }
                            } else {
                                if (c_oSerProp_tblPrType.Layout === type) {
                                    var nLayout = this.stream.GetUChar();
                                    switch (nLayout) {
                                    case ETblLayoutType.tbllayouttypeAutofit:
                                        Pr.TableLayout = tbllayout_AutoFit;
                                        break;
                                    case ETblLayoutType.tbllayouttypeFixed:
                                        Pr.TableLayout = tbllayout_Fixed;
                                        break;
                                    }
                                } else {
                                    if (null != table) {
                                        if (c_oSerProp_tblPrType.tblpPr === type) {
                                            table.Set_Inline(false);
                                            var oAdditionalPr = {
                                                PageNum: null,
                                                X: null,
                                                Y: null,
                                                Paddings: null
                                            };
                                            res = this.bcr.Read2(length, function (t, l) {
                                                return oThis.Read_tblpPr(t, l, oAdditionalPr);
                                            });
                                            if (null != oAdditionalPr.X) {
                                                table.Set_PositionH(c_oAscHAnchor.Page, false, oAdditionalPr.X);
                                            }
                                            if (null != oAdditionalPr.Y) {
                                                table.Set_PositionV(c_oAscVAnchor.Page, false, oAdditionalPr.Y);
                                            }
                                            if (null != oAdditionalPr.Paddings) {
                                                var Paddings = oAdditionalPr.Paddings;
                                                table.Set_Distance(Paddings.L, Paddings.T, Paddings.R, Paddings.B);
                                            }
                                        } else {
                                            if (c_oSerProp_tblPrType.tblpPr2 === type) {
                                                table.Set_Inline(false);
                                                var oAdditionalPr = {
                                                    HRelativeFrom: null,
                                                    HAlign: null,
                                                    HValue: null,
                                                    VRelativeFrom: null,
                                                    VAlign: null,
                                                    VValue: null,
                                                    Distance: null
                                                };
                                                res = this.bcr.Read2(length, function (t, l) {
                                                    return oThis.Read_tblpPr2(t, l, oAdditionalPr);
                                                });
                                                if (null != oAdditionalPr.HRelativeFrom && null != oAdditionalPr.HAlign && null != oAdditionalPr.HValue) {
                                                    table.Set_PositionH(oAdditionalPr.HRelativeFrom, oAdditionalPr.HAlign, oAdditionalPr.HValue);
                                                }
                                                if (null != oAdditionalPr.VRelativeFrom && null != oAdditionalPr.VAlign && null != oAdditionalPr.VValue) {
                                                    table.Set_PositionV(oAdditionalPr.VRelativeFrom, oAdditionalPr.VAlign, oAdditionalPr.VValue);
                                                }
                                                if (null != oAdditionalPr.Distance) {
                                                    var Distance = oAdditionalPr.Distance;
                                                    table.Set_Distance(Distance.L, Distance.T, Distance.R, Distance.B);
                                                }
                                            } else {
                                                if (c_oSerProp_tblPrType.Look === type) {
                                                    var nLook = this.stream.GetULongLE();
                                                    var bFC = 0 != (nLook & 128);
                                                    var bFR = 0 != (nLook & 32);
                                                    var bLC = 0 != (nLook & 256);
                                                    var bLR = 0 != (nLook & 64);
                                                    var bBH = 0 != (nLook & 512);
                                                    var bBV = 0 != (nLook & 1024);
                                                    table.Set_TableLook(new CTableLook(bFC, bFR, bLC, bLR, !bBH, !bBV));
                                                } else {
                                                    if (c_oSerProp_tblPrType.Style === type) {
                                                        this.oReadResult.tableStyles.push({
                                                            pPr: table,
                                                            style: this.stream.GetString2LE(length)
                                                        });
                                                    } else {
                                                        res = c_oSerConstants.ReadUnknown;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        res = c_oSerConstants.ReadUnknown;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    },
    BordersNull: function (Borders) {
        Borders.Left = new CDocumentBorder();
        Borders.Top = new CDocumentBorder();
        Borders.Right = new CDocumentBorder();
        Borders.Bottom = new CDocumentBorder();
        Borders.InsideV = new CDocumentBorder();
        Borders.InsideH = new CDocumentBorder();
    },
    ReadW: function (type, length, Width) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerWidthType.Type === type) {
            Width.Type = this.stream.GetUChar();
        } else {
            if (c_oSerWidthType.W === type) {
                Width.W = this.bcr.ReadDouble();
            } else {
                if (c_oSerWidthType.WDocx === type) {
                    Width.WDocx = this.stream.GetULongLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    },
    ParseW: function (input, output) {
        if (input.Type) {
            output.Type = input.Type;
        }
        if (input.W) {
            output.W = input.W;
        }
        if (input.WDocx) {
            if (tblwidth_Mm == input.Type) {
                output.W = g_dKoef_twips_to_mm * input.WDocx;
            } else {
                output.W = input.WDocx;
            }
        }
    },
    ReadCellMargins: function (type, length, Margins) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerMarginsType.left === type) {
            var oW = {
                Type: null,
                W: null,
                WDocx: null
            };
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadW(t, l, oW);
            });
            if (null == Margins.Left) {
                Margins.Left = new CTableMeasurement(tblwidth_Auto, 0);
            }
            this.ParseW(oW, Margins.Left);
        } else {
            if (c_oSerMarginsType.top === type) {
                var oW = {
                    Type: null,
                    W: null,
                    WDocx: null
                };
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadW(t, l, oW);
                });
                if (null == Margins.Top) {
                    Margins.Top = new CTableMeasurement(tblwidth_Auto, 0);
                }
                this.ParseW(oW, Margins.Top);
            } else {
                if (c_oSerMarginsType.right === type) {
                    var oW = {
                        Type: null,
                        W: null,
                        WDocx: null
                    };
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadW(t, l, oW);
                    });
                    if (null == Margins.Right) {
                        Margins.Right = new CTableMeasurement(tblwidth_Auto, 0);
                    }
                    this.ParseW(oW, Margins.Right);
                } else {
                    if (c_oSerMarginsType.bottom === type) {
                        var oW = {
                            Type: null,
                            W: null,
                            WDocx: null
                        };
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadW(t, l, oW);
                        });
                        if (null == Margins.Bottom) {
                            Margins.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
                        }
                        this.ParseW(oW, Margins.Bottom);
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    },
    Read_tblpPr: function (type, length, oAdditionalPr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_tblpPrType.Page === type) {
            oAdditionalPr.PageNum = this.stream.GetULongLE();
        } else {
            if (c_oSer_tblpPrType.X === type) {
                oAdditionalPr.X = this.bcr.ReadDouble();
            } else {
                if (c_oSer_tblpPrType.Y === type) {
                    oAdditionalPr.Y = this.bcr.ReadDouble();
                } else {
                    if (c_oSer_tblpPrType.Paddings === type) {
                        if (null == oAdditionalPr.Paddings) {
                            oAdditionalPr.Paddings = {
                                L: 0,
                                T: 0,
                                R: 0,
                                B: 0
                            };
                        }
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadPaddings2(t, l, oAdditionalPr.Paddings);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    },
    Read_tblpPr2: function (type, length, oAdditionalPr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_tblpPrType2.HorzAnchor === type) {
            oAdditionalPr.HRelativeFrom = this.stream.GetUChar();
        } else {
            if (c_oSer_tblpPrType2.TblpX === type) {
                oAdditionalPr.HAlign = false;
                oAdditionalPr.HValue = this.bcr.ReadDouble();
            } else {
                if (c_oSer_tblpPrType2.TblpXSpec === type) {
                    oAdditionalPr.HAlign = true;
                    oAdditionalPr.HValue = this.stream.GetUChar();
                } else {
                    if (c_oSer_tblpPrType2.VertAnchor === type) {
                        oAdditionalPr.VRelativeFrom = this.stream.GetUChar();
                    } else {
                        if (c_oSer_tblpPrType2.TblpY === type) {
                            oAdditionalPr.VAlign = false;
                            oAdditionalPr.VValue = this.bcr.ReadDouble();
                        } else {
                            if (c_oSer_tblpPrType2.TblpYSpec === type) {
                                oAdditionalPr.VAlign = true;
                                oAdditionalPr.VValue = this.stream.GetUChar();
                            } else {
                                if (c_oSer_tblpPrType2.Paddings === type) {
                                    oAdditionalPr.Distance = {
                                        L: 0,
                                        T: 0,
                                        R: 0,
                                        B: 0
                                    };
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadPaddings2(t, l, oAdditionalPr.Distance);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    },
    Read_RowPr: function (type, length, Pr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_rowPrType.CantSplit === type) {
            Pr.CantSplit = (this.stream.GetUChar() != 0);
        } else {
            if (c_oSerProp_rowPrType.After === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadAfter(t, l, Pr);
                });
            } else {
                if (c_oSerProp_rowPrType.Before === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadBefore(t, l, Pr);
                    });
                } else {
                    if (c_oSerProp_rowPrType.Jc === type) {
                        Pr.Jc = this.stream.GetUChar();
                    } else {
                        if (c_oSerProp_rowPrType.TableCellSpacing === type) {
                            Pr.TableCellSpacing = this.bcr.ReadDouble();
                        } else {
                            if (c_oSerProp_rowPrType.Height === type) {
                                if (null == Pr.Height) {
                                    Pr.Height = new CTableRowHeight(0, heightrule_Auto);
                                }
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadHeight(t, l, Pr.Height);
                                });
                            } else {
                                if (c_oSerProp_rowPrType.TableHeader === type) {
                                    Pr.TableHeader = (this.stream.GetUChar() != 0);
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    },
    ReadAfter: function (type, length, After) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_rowPrType.GridAfter === type) {
            After.GridAfter = this.stream.GetULongLE();
        } else {
            if (c_oSerProp_rowPrType.WAfter === type) {
                var oW = {
                    Type: null,
                    W: null,
                    WDocx: null
                };
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadW(t, l, oW);
                });
                if (null == After.WAfter) {
                    After.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
                }
                this.ParseW(oW, After.WAfter);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    },
    ReadBefore: function (type, length, Before) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_rowPrType.GridBefore === type) {
            Before.GridBefore = this.stream.GetULongLE();
        } else {
            if (c_oSerProp_rowPrType.WBefore === type) {
                var oW = {
                    Type: null,
                    W: null,
                    WDocx: null
                };
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadW(t, l, oW);
                });
                if (null == Before.WBefore) {
                    Before.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
                }
                this.ParseW(oW, Before.WBefore);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    },
    ReadHeight: function (type, length, Height) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerProp_rowPrType.Height_Rule === type) {
            Height.HRule = this.stream.GetUChar();
        } else {
            if (c_oSerProp_rowPrType.Height_Value === type) {
                Height.Value = this.bcr.ReadDouble();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    },
    Read_CellPr: function (type, length, Pr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_cellPrType.GridSpan === type) {
            Pr.GridSpan = this.stream.GetULongLE();
        } else {
            if (c_oSerProp_cellPrType.Shd === type) {
                if (null == Pr.Shd) {
                    Pr.Shd = new CDocumentShd();
                }
                var themeColor = {
                    Auto: null,
                    Color: null,
                    Tint: null,
                    Shade: null
                };
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.bcr.ReadShd(t, l, Pr.Shd, themeColor);
                });
                if (true == themeColor.Auto && null != Pr.Shd.Color) {
                    Pr.Shd.Color.Auto = true;
                }
                var unifill = CreateThemeUnifill(themeColor.Color, themeColor.Tint, themeColor.Shade);
                if (null != unifill) {
                    Pr.Shd.Unifill = unifill;
                } else {
                    if (null != Pr.Shd.Color && !Pr.Shd.Color.Auto) {
                        Pr.Shd.Unifill = CreteSolidFillRGB(Pr.Shd.Color.r, Pr.Shd.Color.g, Pr.Shd.Color.b);
                    }
                }
            } else {
                if (c_oSerProp_cellPrType.TableCellBorders === type) {
                    if (null == Pr.TableCellBorders) {
                        Pr.TableCellBorders = {
                            Bottom: undefined,
                            Left: undefined,
                            Right: undefined,
                            Top: undefined
                        };
                    }
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.bpPrr.ReadBorders(t, l, Pr.TableCellBorders);
                    });
                } else {
                    if (c_oSerProp_cellPrType.CellMar === type) {
                        if (null == Pr.TableCellMar) {
                            Pr.TableCellMar = this.GetNewMargin();
                        }
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCellMargins(t, l, Pr.TableCellMar);
                        });
                    } else {
                        if (c_oSerProp_cellPrType.TableCellW === type) {
                            var oW = {
                                Type: null,
                                W: null,
                                WDocx: null
                            };
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadW(t, l, oW);
                            });
                            if (null == Pr.TableCellW) {
                                Pr.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
                            }
                            this.ParseW(oW, Pr.TableCellW);
                        } else {
                            if (c_oSerProp_cellPrType.VAlign === type) {
                                Pr.VAlign = this.stream.GetUChar();
                            } else {
                                if (c_oSerProp_cellPrType.VMerge === type) {
                                    Pr.VMerge = this.stream.GetUChar();
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    },
    GetNewMargin: function () {
        return {
            Left: new CTableMeasurement(tblwidth_Auto, 0),
            Top: new CTableMeasurement(tblwidth_Auto, 0),
            Right: new CTableMeasurement(tblwidth_Auto, 0),
            Bottom: new CTableMeasurement(tblwidth_Auto, 0)
        };
    },
    ReadPaddings: function (type, length, paddings) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerPaddingType.left === type) {
            paddings.Left = this.bcr.ReadDouble();
        } else {
            if (c_oSerPaddingType.top === type) {
                paddings.Top = this.bcr.ReadDouble();
            } else {
                if (c_oSerPaddingType.right === type) {
                    paddings.Right = this.bcr.ReadDouble();
                } else {
                    if (c_oSerPaddingType.bottom === type) {
                        paddings.Bottom = this.bcr.ReadDouble();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    },
    ReadPaddings2: function (type, length, paddings) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerPaddingType.left === type) {
            paddings.L = this.bcr.ReadDouble();
        } else {
            if (c_oSerPaddingType.top === type) {
                paddings.T = this.bcr.ReadDouble();
            } else {
                if (c_oSerPaddingType.right === type) {
                    paddings.R = this.bcr.ReadDouble();
                } else {
                    if (c_oSerPaddingType.bottom === type) {
                        paddings.B = this.bcr.ReadDouble();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    }
};
function Binary_NumberingTableReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.m_oNumToANum = {};
    this.m_oANumToNumClass = {};
    this.bcr = new Binary_CommonReader(this.stream);
    this.brPrr = new Binary_rPrReader(this.Document, this.stream);
    this.bpPrr = new Binary_pPrReader(this.Document, this.oReadResult, this.stream);
    this.Read = function () {
        var oThis = this;
        var res = this.bcr.ReadTable(function (t, l) {
            return oThis.ReadNumberingContent(t, l);
        });
        for (var i in this.m_oNumToANum) {
            var anum = this.m_oNumToANum[i];
            if (null != anum) {
                var numClass = this.m_oANumToNumClass[anum];
                if (null != numClass) {
                    this.oReadResult.numToNumClass[i] = numClass;
                }
            }
        }
        return res;
    };
    this.ReadNumberingContent = function (type, length) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.AbstractNums === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadAbstractNums(t, l);
            });
        } else {
            if (c_oSerNumTypes.Nums === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadNums(t, l);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    },
    this.ReadNums = function (type, length, Num) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.Num === type) {
            var oNewItem = {};
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadNum(t, l, oNewItem);
            });
            if (null != oNewItem.ANum && null != oNewItem.Num) {
                this.m_oNumToANum[oNewItem.Num] = oNewItem.ANum;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    },
    this.ReadNum = function (type, length, Num) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.Num_ANumId === type) {
            Num.ANum = this.stream.GetULongLE();
        } else {
            if (c_oSerNumTypes.Num_NumId === type) {
                Num.Num = this.stream.GetULongLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    },
    this.ReadAbstractNums = function (type, length) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.AbstractNum === type) {
            var oNewAbstractNum = new CAbstractNum();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadAbstractNum(t, l, oNewAbstractNum);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    },
    this.ReadAbstractNum = function (type, length, oNewNum) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.AbstractNum_Lvls === type) {
            var nLevelNum = 0;
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadLevels(t, l, nLevelNum++, oNewNum);
            });
        } else {
            if (c_oSerNumTypes.NumStyleLink === type) {
                oNewNum.NumStyleLink = this.stream.GetString2LE(length);
            } else {
                if (c_oSerNumTypes.StyleLink === type) {
                    oNewNum.StyleLink = this.stream.GetString2LE(length);
                } else {
                    if (c_oSerNumTypes.AbstractNum_Id === type) {
                        this.m_oANumToNumClass[this.stream.GetULongLE()] = oNewNum;
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadLevels = function (type, length, nLevelNum, oNewNum) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.Lvl === type) {
            if (nLevelNum < oNewNum.Lvl.length) {
                var oOldLvl = oNewNum.Lvl[nLevelNum];
                var oNewLvl = oNewNum.Internal_CopyLvl(oOldLvl);
                oNewLvl.ParaPr = new CParaPr();
                oNewLvl.TextPr = new CTextPr();
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadLevel(t, l, oNewLvl);
                });
                if (numbering_numfmt_Bullet == oNewLvl.Format && null == oNewLvl.TextPr.RFonts.Ascii) {
                    oNewLvl.TextPr.RFonts.Set_All("Symbol", -1);
                }
                oNewNum.Lvl[nLevelNum] = oNewLvl;
                this.oReadResult.aPostOpenStyleNumCallbacks.push(function () {
                    oNewNum.Set_Lvl(nLevelNum, oNewLvl);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadLevel = function (type, length, oNewLvl) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.lvl_Format === type) {
            oNewLvl.Format = this.stream.GetULongLE();
        } else {
            if (c_oSerNumTypes.lvl_Jc === type) {
                oNewLvl.Jc = this.stream.GetUChar();
            } else {
                if (c_oSerNumTypes.lvl_LvlText === type) {
                    oNewLvl.LvlText = [];
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadLevelText(t, l, oNewLvl.LvlText);
                    });
                } else {
                    if (c_oSerNumTypes.lvl_Restart === type) {
                        oNewLvl.Restart = this.stream.GetLongLE();
                    } else {
                        if (c_oSerNumTypes.lvl_Start === type) {
                            oNewLvl.Start = this.stream.GetULongLE();
                        } else {
                            if (c_oSerNumTypes.lvl_Suff === type) {
                                oNewLvl.Suff = this.stream.GetUChar();
                            } else {
                                if (c_oSerNumTypes.lvl_PStyle === type) {
                                    this.oReadResult.lvlStyles.push({
                                        pPr: oNewLvl,
                                        style: this.stream.GetString2LE(length)
                                    });
                                } else {
                                    if (c_oSerNumTypes.lvl_ParaPr === type) {
                                        res = this.bpPrr.Read(length, oNewLvl.ParaPr, null);
                                    } else {
                                        if (c_oSerNumTypes.lvl_TextPr === type) {
                                            res = this.brPrr.Read(length, oNewLvl.TextPr);
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadLevelText = function (type, length, aNewText) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.lvl_LvlTextItem === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadLevelTextItem(t, l, aNewText);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadLevelTextItem = function (type, length, aNewText) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerNumTypes.lvl_LvlTextItemText === type) {
            var oNewTextItem = new CLvlText_Text(this.stream.GetString2LE(length));
            aNewText.push(oNewTextItem);
        } else {
            if (c_oSerNumTypes.lvl_LvlTextItemNum === type) {
                var oNewTextItem = new CLvlText_Num(this.stream.GetUChar());
                aNewText.push(oNewTextItem);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
}
function Binary_HdrFtrTableReader(doc, oReadResult, openParams, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.openParams = openParams;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.bdtr = new Binary_DocumentTableReader(this.Document, this.oReadResult, this.openParams, this.stream, true, this.oReadResult.oCommentsPlaces);
    this.Read = function () {
        var oThis = this;
        var res = this.bcr.ReadTable(function (t, l) {
            return oThis.ReadHdrFtrContent(t, l);
        });
        return res;
    };
    this.ReadHdrFtrContent = function (type, length) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerHdrFtrTypes.Header === type || c_oSerHdrFtrTypes.Footer === type) {
            var oHdrFtrContainer;
            var nHdrFtrType;
            if (c_oSerHdrFtrTypes.Header === type) {
                oHdrFtrContainer = this.oReadResult.headers;
                nHdrFtrType = hdrftr_Header;
            } else {
                oHdrFtrContainer = this.oReadResult.footers;
                nHdrFtrType = hdrftr_Footer;
            }
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadHdrFtrFEO(t, l, oHdrFtrContainer, nHdrFtrType);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadHdrFtrFEO = function (type, length, oHdrFtrContainer, nHdrFtrType) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerHdrFtrTypes.HdrFtr_First === type || c_oSerHdrFtrTypes.HdrFtr_Even === type || c_oSerHdrFtrTypes.HdrFtr_Odd === type) {
            var hdrftr;
            if (hdrftr_Header == nHdrFtrType) {
                hdrftr = new CHeaderFooter(this.Document.HdrFtr, this.Document, this.Document.DrawingDocument, nHdrFtrType);
            } else {
                hdrftr = new CHeaderFooter(this.Document.HdrFtr, this.Document, this.Document.DrawingDocument, nHdrFtrType);
            }
            this.bdtr.Document = hdrftr.Content;
            var oNewItem = {
                Content: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadHdrFtrItem(t, l, oNewItem);
            });
            if (null != oNewItem.Content) {
                hdrftr.Content.Content = oNewItem.Content;
                oHdrFtrContainer.push({
                    type: type,
                    elem: hdrftr
                });
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadHdrFtrItem = function (type, length, oNewItem) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerHdrFtrTypes.HdrFtr_Content === type) {
            oNewItem.Content = [];
            oThis.bdtr.Read(length, oNewItem.Content);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_DocumentTableReader(doc, oReadResult, openParams, stream, bAllowFlow, oComments) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.openParams = openParams;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.boMathr = new Binary_oMathReader(this.stream);
    this.brPrr = new Binary_rPrReader(this.Document, this.stream);
    this.bpPrr = new Binary_pPrReader(this.Document, this.oReadResult, this.stream);
    this.btblPrr = new Binary_tblPrReader(this.Document, this.oReadResult, this.stream);
    this.bAllowFlow = bAllowFlow;
    this.lastPar = null;
    this.oComments = oComments;
    this.aFields = [];
    this.nCurCommentsCount = 0;
    this.oCurComments = {};
    this.Reset = function () {
        this.lastPar = null;
    };
    this.ReadAsTable = function (OpenContent) {
        this.Reset();
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadDocumentContent(t, l, OpenContent);
        });
    };
    this.Read = function (length, OpenContent) {
        this.Reset();
        var oThis = this;
        return this.bcr.Read1(length, function (t, l) {
            return oThis.ReadDocumentContent(t, l, OpenContent);
        });
    };
    this.ReadDocumentContent = function (type, length, Content) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerParType.Par === type) {
            if (null != this.openParams && true == this.openParams.checkFileSize) {
                this.openParams.parCount += 1;
                if (this.openParams.parCount >= g_nErrorParagraphCount) {
                    throw new Error(g_sErrorCharCountMessage);
                }
            }
            var oNewParagraph = new Paragraph(this.Document.DrawingDocument, this.Document, 0, 0, 0, 0, 0);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadParagraph(t, l, oNewParagraph, Content);
            });
            oNewParagraph.Correct_Content();
            if (null != this.lastPar) {
                oNewParagraph.Set_DocumentPrev(this.lastPar);
                this.lastPar.Set_DocumentNext(oNewParagraph);
            }
            this.lastPar = oNewParagraph;
            Content.push(oNewParagraph);
        } else {
            if (c_oSerParType.Table === type) {
                var doc = this.Document;
                var oNewTable = new CTable(doc.DrawingDocument, doc, true, 0, 0, 0, 0, 0, 0, 0, []);
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadDocTable(t, l, oNewTable);
                });
                oNewTable.ReIndexing(0);
                if (2 == g_nCurFileVersion && false == oNewTable.Inline) {
                    if (false == oNewTable.PositionH.Align) {
                        var dx = Get_TableOffsetCorrection(oNewTable);
                        oNewTable.PositionH.Value += dx;
                    }
                }
                if (null != this.lastPar) {
                    oNewTable.Set_DocumentPrev(this.lastPar);
                    this.lastPar.Set_DocumentNext(oNewTable);
                }
                this.lastPar = oNewTable;
                Content.push(oNewTable);
            } else {
                if (c_oSerParType.sectPr === type) {
                    var oSectPr = oThis.Document.SectPr;
                    var oAdditional = {
                        EvenAndOddHeaders: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.bpPrr.Read_SecPr(t, l, oSectPr, oAdditional);
                    });
                    if (null != oAdditional.EvenAndOddHeaders) {
                        this.Document.Set_DocumentEvenAndOddHeaders(oAdditional.EvenAndOddHeaders);
                    }
                    if (g_nCurFileVersion < 5) {
                        for (var i = 0; i < this.oReadResult.headers.length; ++i) {
                            var item = this.oReadResult.headers[i];
                            switch (item.type) {
                            case c_oSerHdrFtrTypes.HdrFtr_First:
                                oSectPr.Set_Header_First(item.elem);
                                break;
                            case c_oSerHdrFtrTypes.HdrFtr_Even:
                                oSectPr.Set_Header_Even(item.elem);
                                break;
                            case c_oSerHdrFtrTypes.HdrFtr_Odd:
                                oSectPr.Set_Header_Default(item.elem);
                                break;
                            }
                        }
                        for (var i = 0; i < this.oReadResult.footers.length; ++i) {
                            var item = this.oReadResult.footers[i];
                            switch (item.type) {
                            case c_oSerHdrFtrTypes.HdrFtr_First:
                                oSectPr.Set_Footer_First(item.elem);
                                break;
                            case c_oSerHdrFtrTypes.HdrFtr_Even:
                                oSectPr.Set_Footer_Even(item.elem);
                                break;
                            case c_oSerHdrFtrTypes.HdrFtr_Odd:
                                oSectPr.Set_Footer_Default(item.elem);
                                break;
                            }
                        }
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadParagraph = function (type, length, paragraph, Content) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerParType.pPr === type) {
            var oNewParaPr = new CParaPr();
            res = this.bpPrr.Read(length, oNewParaPr, paragraph);
            paragraph.Pr = oNewParaPr;
            this.oReadResult.aPostOpenStyleNumCallbacks.push(function () {
                paragraph.Set_Pr(oNewParaPr);
            });
        } else {
            if (c_oSerParType.Content === type) {
                var oParStruct = new OpenParStruct(paragraph, Content, paragraph);
                if (this.aFields.length > 0) {
                    for (var i = 0; i < this.aFields.length; ++i) {
                        var sField = this.aFields[i];
                        var oHyperlink = new ParaHyperlink();
                        oHyperlink.Set_Paragraph(paragraph);
                        oParStruct.addElem(oHyperlink);
                        this.parseField(oHyperlink, sField);
                    }
                }
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadParagraphContent(t, l, oParStruct);
                });
                oParStruct.commitAll();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadParagraphContent = function (type, length, oParStruct) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oCurContainer = oParStruct.cur.elem;
        if (c_oSerParType.Run === type) {
            var oNewRun = new ParaRun(oParStruct.paragraph);
            var oRes = {
                bRes: true
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadRun(t, l, oNewRun, oParStruct, oRes);
            });
            oParStruct.addToContent(oNewRun);
        } else {
            if (c_oSerParType.CommentStart === type) {
                var oCommon = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadComment(t, l, oCommon);
                });
                if (null != oCommon.Id) {
                    oCommon.oParent = oCurContainer;
                    var item = this.oComments[oCommon.Id];
                    if (item) {
                        item.Start = oCommon;
                    } else {
                        this.oComments[oCommon.Id] = {
                            Start: oCommon
                        };
                    }
                    if (null == this.oCurComments[oCommon.Id]) {
                        this.nCurCommentsCount++;
                        this.oCurComments[oCommon.Id] = "";
                    }
                    oCommon.oParaComment = new ParaComment(true, oCommon.Id);
                    oParStruct.addToContent(oCommon.oParaComment);
                }
            } else {
                if (c_oSerParType.CommentEnd === type) {
                    var oCommon = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadComment(t, l, oCommon);
                    });
                    if (null != oCommon.Id) {
                        oCommon.oParent = oCurContainer;
                        var item = this.oComments[oCommon.Id];
                        if (!item) {
                            item = {};
                            this.oComments[oCommon.Id] = item;
                        }
                        item.End = oCommon;
                        var sQuoteText = this.oCurComments[oCommon.Id];
                        if (null != sQuoteText) {
                            item.QuoteText = sQuoteText;
                            this.nCurCommentsCount--;
                            delete this.oCurComments[oCommon.Id];
                        }
                        oCommon.oParaComment = new ParaComment(false, oCommon.Id);
                        oParStruct.addToContent(oCommon.oParaComment);
                    }
                } else {
                    if (c_oSerParType.OMathPara == type) {
                        var props = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.boMathr.ReadMathOMathPara(t, l, oParStruct, props);
                        });
                    } else {
                        if (c_oSerParType.OMath == type) {
                            var oMath = new ParaMath();
                            oParStruct.addToContent(oMath);
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.boMathr.ReadMathArg(t, l, oMath.Root, oParStruct);
                            });
                            oMath.Root.Correct_Content(true);
                        } else {
                            if (c_oSerParType.Hyperlink == type) {
                                var oHyperlinkObj = {
                                    Link: null,
                                    Anchor: null,
                                    Tooltip: null,
                                    History: null,
                                    DocLocation: null,
                                    TgtFrame: null
                                };
                                var oNewHyperlink = new ParaHyperlink();
                                oNewHyperlink.Set_Paragraph(oParStruct.paragraph);
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadHyperlink(t, l, oHyperlinkObj, oNewHyperlink, oParStruct);
                                });
                                if (null != oHyperlinkObj.Link && "" != oHyperlinkObj.Link) {
                                    var sValue = oHyperlinkObj.Link;
                                    if (null != oHyperlinkObj.Anchor) {
                                        sValue += "#" + oHyperlinkObj.Anchor;
                                    }
                                    oNewHyperlink.Set_Value(sValue);
                                    if (null != oHyperlinkObj.Tooltip) {
                                        oNewHyperlink.Set_ToolTip(oHyperlinkObj.Tooltip);
                                    }
                                    oParStruct.addToContent(oNewHyperlink);
                                }
                                oNewHyperlink.Check_Content();
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadHyperlink = function (type, length, oHyperlinkObj, oNewHyperlink, oParStruct) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_HyperlinkType.Link === type) {
            oHyperlinkObj.Link = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_HyperlinkType.Anchor === type) {
                oHyperlinkObj.Anchor = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_HyperlinkType.Tooltip === type) {
                    oHyperlinkObj.Tooltip = this.stream.GetString2LE(length);
                } else {
                    if (c_oSer_HyperlinkType.History === type) {
                        oHyperlinkObj.History = this.stream.GetBool();
                    } else {
                        if (c_oSer_HyperlinkType.DocLocation === type) {
                            oHyperlinkObj.DocLocation = this.stream.GetString2LE(length);
                        } else {
                            if (c_oSer_HyperlinkType.TgtFrame === type) {
                                oHyperlinkObj.TgtFrame = this.stream.GetString2LE(length);
                            } else {
                                if (c_oSer_HyperlinkType.Content === type) {
                                    var oHypStruct = new OpenParStruct(oNewHyperlink, oParStruct.Content, oParStruct.paragraph);
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadParagraphContent(t, l, oHypStruct);
                                    });
                                    oHypStruct.commitAll();
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadComment = function (type, length, oComments) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_CommentsType.Id === type) {
            oComments.Id = this.stream.GetULongLE();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadRun = function (type, length, oRunObject, oParStruct, oRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRunType.rPr === type) {
            var rPr = new CTextPr();
            res = this.brPrr.Read(length, rPr);
            oRunObject.Set_Pr(rPr);
        } else {
            if (c_oSerRunType.Content === type) {
                var oPos = {
                    run: oRunObject,
                    pos: 0
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadRunContent(t, l, oPos, oParStruct, oRes);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadRunContent = function (type, length, oPos, oParStruct, oRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oNewElem = null;
        if (c_oSerRunType.run === type) {
            var text = this.stream.GetString2LE(length);
            if (null != this.openParams && true == this.openParams.checkFileSize) {
                this.openParams.charCount += length / 2;
                if (this.openParams.charCount >= g_nErrorCharCount) {
                    throw new Error(g_sErrorCharCountMessage);
                }
            }
            if (this.nCurCommentsCount > 0) {
                for (var i in this.oCurComments) {
                    this.oCurComments[i] += text;
                }
            }
            for (var i = 0; i < text.length; ++i) {
                var nUnicode = null;
                var nCharCode = text.charCodeAt(i);
                if (isLeadingSurrogateChar(nCharCode)) {
                    if (i + 1 < text.length) {
                        i++;
                        var nTrailingChar = text.charCodeAt(i);
                        nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
                    }
                } else {
                    nUnicode = nCharCode;
                }
                if (null != nUnicode) {
                    if (32 != nUnicode) {
                        var oNewParaText = new ParaText();
                        oNewParaText.Set_CharCode(nUnicode);
                        oPos.run.Add_ToContent(oPos.pos, oNewParaText, false);
                    } else {
                        oPos.run.Add_ToContent(oPos.pos, new ParaSpace(), false);
                    }
                    oPos.pos++;
                }
            }
        } else {
            if (c_oSerRunType.tab === type) {
                oNewElem = new ParaTab();
            } else {
                if (c_oSerRunType.pagenum === type) {
                    oNewElem = new ParaPageNum();
                } else {
                    if (c_oSerRunType.pagebreak === type) {
                        oNewElem = new ParaNewLine(break_Page);
                    } else {
                        if (c_oSerRunType.linebreak === type) {
                            oNewElem = new ParaNewLine(break_Line);
                        } else {
                            if (c_oSerRunType.image === type) {
                                var oThis = this;
                                var image = {
                                    page: null,
                                    Type: null,
                                    MediaId: null,
                                    W: null,
                                    H: null,
                                    X: null,
                                    Y: null,
                                    Paddings: null
                                };
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadImage(t, l, image);
                                });
                                if ((c_oAscWrapStyle.Inline == image.Type && null != image.MediaId && null != image.W && null != image.H) || (c_oAscWrapStyle.Flow == image.Type && null != image.MediaId && null != image.W && null != image.H && null != image.X && null != image.Y)) {
                                    var doc = this.Document;
                                    var drawing = new ParaDrawing(image.W, image.H, null, doc.DrawingDocument, doc, oParStruct.paragraph);
                                    var src = this.oReadResult.ImageMap[image.MediaId];
                                    var Image = editor.WordControl.m_oLogicDocument.DrawingObjects.createImage(src, 0, 0, image.W, image.H);
                                    drawing.Set_GraphicObject(Image);
                                    Image.setParent(drawing);
                                    if (c_oAscWrapStyle.Flow == image.Type) {
                                        drawing.Set_DrawingType(drawing_Anchor);
                                        drawing.Set_PositionH(c_oAscRelativeFromH.Page, false, image.X);
                                        drawing.Set_PositionV(c_oAscRelativeFromV.Page, false, image.Y);
                                        if (image.Paddings) {
                                            drawing.Set_Distance(image.Paddings.Left, image.Paddings.Top, image.Paddings.Right, image.Paddings.Bottom);
                                        }
                                    }
                                    if (null != drawing.GraphicObj) {
                                        window.global_pptx_content_loader.ImageMapChecker[src] = true;
                                        oNewElem = drawing;
                                    }
                                }
                            } else {
                                if (c_oSerRunType.pptxDrawing === type) {
                                    var oDrawing = new Object();
                                    this.ReadDrawing(type, length, oParStruct, oDrawing, res);
                                    if (null != oDrawing.content.GraphicObj) {
                                        oNewElem = oDrawing.content;
                                    }
                                } else {
                                    if (c_oSerRunType.table === type) {
                                        var doc = this.Document;
                                        var oNewTable = new CTable(doc.DrawingDocument, doc, true, 0, 0, 0, 0, 0, 0, 0, []);
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadDocTable(t, l, oNewTable);
                                        });
                                        oNewTable.ReIndexing(0);
                                        if (2 == g_nCurFileVersion && false == oNewTable.Inline) {
                                            if (false == oNewTable.PositionH.Align) {
                                                var dx = Get_TableOffsetCorrection(oNewTable);
                                                oNewTable.PositionH.Value += dx;
                                            }
                                        }
                                        if (null != this.lastPar) {
                                            oNewTable.Set_DocumentPrev(this.lastPar);
                                            this.lastPar.Set_DocumentNext(oNewTable);
                                        }
                                        this.lastPar = oNewTable;
                                        oParStruct.DocContent.push(oNewTable);
                                    } else {
                                        if (c_oSerRunType.fldstart === type) {
                                            oRes.bRes = false;
                                            var oHyperlink = new ParaHyperlink();
                                            oHyperlink.Set_Paragraph(oParStruct.paragraph);
                                            oParStruct.addElem(oHyperlink);
                                            var sField = this.stream.GetString2LE(length);
                                            this.parseField(oHyperlink, sField);
                                            this.aFields.push(sField);
                                        } else {
                                            if (c_oSerRunType.fldend === type) {
                                                oRes.bRes = false;
                                                oParStruct.commitElem();
                                                this.aFields.pop();
                                            } else {
                                                if (c_oSerRunType._LastRun === type) {
                                                    this.oReadResult.bLastRun = true;
                                                } else {
                                                    if (c_oSerRunType.object === type) {
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadObject(t, l, oParStruct);
                                                        });
                                                    } else {
                                                        res = c_oSerConstants.ReadUnknown;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (null != oNewElem) {
            oPos.run.Add_ToContent(oPos.pos, oNewElem, false);
            oPos.pos++;
        }
        return res;
    };
    this.ReadDrawing = function (type, length, oParStruct, oDrawing, res) {
        var oThis = this;
        var doc = this.Document;
        var oParaDrawing = new ParaDrawing(null, null, null, doc.DrawingDocument, doc, oParStruct.paragraph);
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadPptxDrawing(t, l, oParaDrawing);
        });
        if (null != oParaDrawing.SimplePos) {
            oParaDrawing.setSimplePos(oParaDrawing.SimplePos.Use, oParaDrawing.SimplePos.X, oParaDrawing.SimplePos.Y);
        }
        if (null != oParaDrawing.Extent) {
            oParaDrawing.setExtent(oParaDrawing.Extent.W, oParaDrawing.Extent.H);
        }
        if (null != oParaDrawing.wrappingPolygon) {
            oParaDrawing.addWrapPolygon(oParaDrawing.wrappingPolygon);
        }
        if (oParaDrawing.GraphicObj) {
            if (oParaDrawing.GraphicObj.getObjectType() !== historyitem_type_ChartSpace) {
                if (!oParaDrawing.GraphicObj.spPr) {
                    oParaDrawing.GraphicObj = null;
                }
            }
            if (oParaDrawing.GraphicObj) {
                if (drawing_Anchor == oParaDrawing.DrawingType && typeof History.RecalcData_Add === "function") {
                    History.RecalcData_Add({
                        Type: historyrecalctype_Flow,
                        Data: oParaDrawing
                    });
                }
            }
        }
        oDrawing.content = oParaDrawing;
    };
    this.ReadObject = function (type, length, oParStruct) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerParType.OMath === type) {
            if (length > 0) {
                var oMathPara = new ParaMath();
                oParStruct.addToContent(oMathPara);
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.boMathr.ReadMathArg(t, l, oMathPara.Root);
                });
            }
        } else {
            if (c_oSerRunType.pptxDrawing === type) {
                var oNewElem = null;
                var oDrawing = new Object();
                this.ReadDrawing(type, length, oParStruct, oDrawing, res);
                if (null != oDrawing.content.GraphicObj) {
                    oNewElem = oDrawing.content;
                    var oNewRun = new ParaRun(oParStruct.paragraph);
                    oNewRun.Add_ToContent(0, oNewElem, false);
                    oParStruct.addToContent(oNewRun);
                }
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.parseField = function (hyp, fld) {
        if (-1 != fld.indexOf("HYPERLINK")) {
            var sLink = null;
            var sTooltip = null;
            var bNextLink = false;
            var bNextTooltip = false;
            var aItems = [];
            var sCurItem = "";
            var bDQuot = false;
            for (var i = 0, length = fld.length; i < length; ++i) {
                var sCurLetter = fld[i];
                if ('"' == sCurLetter) {
                    bDQuot = !bDQuot;
                } else {
                    if ("\\" == sCurLetter && true == bDQuot && i + 1 < length && '"' == fld[i + 1]) {
                        i++;
                        sCurItem += fld[i];
                    } else {
                        if (" " == sCurLetter && false == bDQuot) {
                            if (sCurItem.length > 0) {
                                aItems.push(sCurItem);
                                sCurItem = "";
                            }
                        } else {
                            sCurItem += sCurLetter;
                        }
                    }
                }
            }
            if (sCurItem.length > 0) {
                aItems.push(sCurItem);
            }
            for (var i = 0, length = aItems.length; i < length; ++i) {
                var item = aItems[i];
                if ("" != item) {
                    if (bNextLink) {
                        bNextLink = false;
                        sLink = item;
                    }
                    if (bNextTooltip) {
                        bNextTooltip = false;
                        sTooltip = item;
                    }
                    if ("HYPERLINK" == item) {
                        bNextLink = true;
                    } else {
                        if ("\\o" == item) {
                            bNextTooltip = true;
                        }
                    }
                }
            }
            if (null != sLink) {
                hyp.Set_Value(this.trimField(sLink));
            }
            if (null != sTooltip) {
                hyp.Set_ToolTip(this.trimField(sTooltip));
            }
        }
    };
    this.trimField = function (str) {
        return str.replace(/^[\s\"\']+|[\s\"\']+$/g, "");
    };
    this.ReadImage = function (type, length, img) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerImageType.Page === type) {
            img.page = this.stream.GetULongLE();
        } else {
            if (c_oSerImageType.MediaId === type) {
                img.MediaId = this.stream.GetULongLE();
            } else {
                if (c_oSerImageType.Type === type) {
                    img.Type = this.stream.GetUChar();
                } else {
                    if (c_oSerImageType.Width === type) {
                        img.W = this.bcr.ReadDouble();
                    } else {
                        if (c_oSerImageType.Height === type) {
                            img.H = this.bcr.ReadDouble();
                        } else {
                            if (c_oSerImageType.X === type) {
                                img.X = this.bcr.ReadDouble();
                            } else {
                                if (c_oSerImageType.Y === type) {
                                    img.Y = this.bcr.ReadDouble();
                                } else {
                                    if (c_oSerImageType.Padding === type) {
                                        var oThis = this;
                                        img.Paddings = {
                                            Left: 0,
                                            Top: 0,
                                            Right: 0,
                                            Bottom: 0
                                        };
                                        res = this.bcr.Read2(length, function (t, l) {
                                            return oThis.btblPrr.ReadPaddings(t, l, img.Paddings);
                                        });
                                    } else {
                                        res = c_oSerConstants.ReadUnknown;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadPptxDrawing = function (type, length, oParaDrawing) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerImageType2.Type === type) {
            var nDrawingType = null;
            switch (this.stream.GetUChar()) {
            case c_oAscWrapStyle.Inline:
                nDrawingType = drawing_Inline;
                break;
            case c_oAscWrapStyle.Flow:
                nDrawingType = drawing_Anchor;
                break;
            }
            if (null != nDrawingType) {
                oParaDrawing.Set_DrawingType(nDrawingType);
            }
        } else {
            if (c_oSerImageType2.PptxData === type) {
                if (length > 0) {
                    var grObject = window.global_pptx_content_loader.ReadDrawing(this, this.stream, this.Document, oParaDrawing);
                    if (null != grObject) {
                        oParaDrawing.Set_GraphicObject(grObject);
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            } else {
                if (c_oSerImageType2.Chart2 === type) {
                    res = c_oSerConstants.ReadUnknown;
                    var oNewChartSpace = new CChartSpace();
                    var oBinaryChartReader = new BinaryChartReader(this.stream);
                    res = oBinaryChartReader.ExternalReadCT_ChartSpace(length, oNewChartSpace, this.Document);
                    oNewChartSpace.setBDeleted(false);
                    oParaDrawing.Set_GraphicObject(oNewChartSpace);
                    oNewChartSpace.setParent(oParaDrawing);
                } else {
                    if (c_oSerImageType2.AllowOverlap === type) {
                        var AllowOverlap = this.stream.GetBool();
                    } else {
                        if (c_oSerImageType2.BehindDoc === type) {
                            oParaDrawing.Set_BehindDoc(this.stream.GetBool());
                        } else {
                            if (c_oSerImageType2.DistL === type) {
                                oParaDrawing.Set_Distance(Math.abs(this.bcr.ReadDouble()), null, null, null);
                            } else {
                                if (c_oSerImageType2.DistT === type) {
                                    oParaDrawing.Set_Distance(null, Math.abs(this.bcr.ReadDouble()), null, null);
                                } else {
                                    if (c_oSerImageType2.DistR === type) {
                                        oParaDrawing.Set_Distance(null, null, Math.abs(this.bcr.ReadDouble()), null);
                                    } else {
                                        if (c_oSerImageType2.DistB === type) {
                                            oParaDrawing.Set_Distance(null, null, null, Math.abs(this.bcr.ReadDouble()));
                                        } else {
                                            if (c_oSerImageType2.Hidden === type) {
                                                var Hidden = this.stream.GetBool();
                                            } else {
                                                if (c_oSerImageType2.Locked === type) {
                                                    var Locked = this.stream.GetBool();
                                                } else {
                                                    if (c_oSerImageType2.RelativeHeight === type) {
                                                        oParaDrawing.setZIndex2(this.stream.GetULongLE());
                                                    } else {
                                                        if (c_oSerImageType2.BSimplePos === type) {
                                                            oParaDrawing.SimplePos.Use = this.stream.GetBool();
                                                        } else {
                                                            if (c_oSerImageType2.EffectExtent === type) {
                                                                var oReadEffectExtent = {
                                                                    Left: null,
                                                                    Top: null,
                                                                    Right: null,
                                                                    Bottom: null
                                                                };
                                                                res = this.bcr.Read2(length, function (t, l) {
                                                                    return oThis.ReadEffectExtent(t, l, oReadEffectExtent);
                                                                });
                                                            } else {
                                                                if (c_oSerImageType2.Extent === type) {
                                                                    res = this.bcr.Read2(length, function (t, l) {
                                                                        return oThis.ReadExtent(t, l, oParaDrawing.Extent);
                                                                    });
                                                                } else {
                                                                    if (c_oSerImageType2.PositionH === type) {
                                                                        var oNewPositionH = {
                                                                            RelativeFrom: c_oAscRelativeFromH.Column,
                                                                            Align: false,
                                                                            Value: 0
                                                                        };
                                                                        res = this.bcr.Read2(length, function (t, l) {
                                                                            return oThis.ReadPositionHV(t, l, oNewPositionH);
                                                                        });
                                                                        oParaDrawing.Set_PositionH(oNewPositionH.RelativeFrom, oNewPositionH.Align, oNewPositionH.Value);
                                                                    } else {
                                                                        if (c_oSerImageType2.PositionV === type) {
                                                                            var oNewPositionV = {
                                                                                RelativeFrom: c_oAscRelativeFromV.Paragraph,
                                                                                Align: false,
                                                                                Value: 0
                                                                            };
                                                                            res = this.bcr.Read2(length, function (t, l) {
                                                                                return oThis.ReadPositionHV(t, l, oNewPositionV);
                                                                            });
                                                                            oParaDrawing.Set_PositionV(oNewPositionV.RelativeFrom, oNewPositionV.Align, oNewPositionV.Value);
                                                                        } else {
                                                                            if (c_oSerImageType2.SimplePos === type) {
                                                                                res = this.bcr.Read2(length, function (t, l) {
                                                                                    return oThis.ReadSimplePos(t, l, oParaDrawing.SimplePos);
                                                                                });
                                                                            } else {
                                                                                if (c_oSerImageType2.WrapNone === type) {
                                                                                    oParaDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                                                                                } else {
                                                                                    if (c_oSerImageType2.WrapSquare === type) {
                                                                                        oParaDrawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                                                                                        res = this.bcr.Read2(length, function (t, l) {
                                                                                            return oThis.ReadWrapSquare(t, l, oParaDrawing.wrappingPolygon);
                                                                                        });
                                                                                    } else {
                                                                                        if (c_oSerImageType2.WrapThrough === type) {
                                                                                            oParaDrawing.Set_WrappingType(WRAPPING_TYPE_THROUGH);
                                                                                            res = this.bcr.Read2(length, function (t, l) {
                                                                                                return oThis.ReadWrapThroughTight(t, l, oParaDrawing.wrappingPolygon);
                                                                                            });
                                                                                        } else {
                                                                                            if (c_oSerImageType2.WrapTight === type) {
                                                                                                oParaDrawing.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                                                                                                res = this.bcr.Read2(length, function (t, l) {
                                                                                                    return oThis.ReadWrapThroughTight(t, l, oParaDrawing.wrappingPolygon);
                                                                                                });
                                                                                            } else {
                                                                                                if (c_oSerImageType2.WrapTopAndBottom === type) {
                                                                                                    oParaDrawing.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM);
                                                                                                    res = this.bcr.Read2(length, function (t, l) {
                                                                                                        return oThis.ReadWrapThroughTight(t, l, oParaDrawing.wrappingPolygon);
                                                                                                    });
                                                                                                } else {
                                                                                                    res = c_oSerConstants.ReadUnknown;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadEffectExtent = function (type, length, oEffectExtent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerEffectExtent.Left === type) {
            oEffectExtent.Left = this.bcr.ReadDouble();
        } else {
            if (c_oSerEffectExtent.Top === type) {
                oEffectExtent.Top = this.bcr.ReadDouble();
            } else {
                if (c_oSerEffectExtent.Right === type) {
                    oEffectExtent.Right = this.bcr.ReadDouble();
                } else {
                    if (c_oSerEffectExtent.Bottom === type) {
                        oEffectExtent.Bottom = this.bcr.ReadDouble();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadExtent = function (type, length, oExtent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerExtent.Cx === type) {
            oExtent.W = this.bcr.ReadDouble();
        } else {
            if (c_oSerExtent.Cy === type) {
                oExtent.H = this.bcr.ReadDouble();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadPositionHV = function (type, length, PositionH) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerPosHV.RelativeFrom === type) {
            PositionH.RelativeFrom = this.stream.GetUChar();
        } else {
            if (c_oSerPosHV.Align === type) {
                PositionH.Align = true;
                PositionH.Value = this.stream.GetUChar();
            } else {
                if (c_oSerPosHV.PosOffset === type) {
                    PositionH.Align = false;
                    PositionH.Value = this.bcr.ReadDouble();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadSimplePos = function (type, length, oSimplePos) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerSimplePos.X === type) {
            oSimplePos.X = this.bcr.ReadDouble();
        } else {
            if (c_oSerSimplePos.Y === type) {
                oSimplePos.Y = this.bcr.ReadDouble();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadWrapSquare = function (type, length, wrappingPolygon) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWrapSquare.DistL === type) {
            var DistL = this.bcr.ReadDouble();
        } else {
            if (c_oSerWrapSquare.DistT === type) {
                var DistT = this.bcr.ReadDouble();
            } else {
                if (c_oSerWrapSquare.DistR === type) {
                    var DistR = this.bcr.ReadDouble();
                } else {
                    if (c_oSerWrapSquare.DistB === type) {
                        var DistB = this.bcr.ReadDouble();
                    } else {
                        if (c_oSerWrapSquare.WrapText === type) {
                            var WrapText = this.stream.GetUChar();
                        } else {
                            if (c_oSerWrapSquare.EffectExtent === type) {
                                var EffectExtent = {
                                    Left: null,
                                    Top: null,
                                    Right: null,
                                    Bottom: null
                                };
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadEffectExtent(t, l, EffectExtent);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadWrapThroughTight = function (type, length, wrappingPolygon) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWrapThroughTight.DistL === type) {
            var DistL = this.bcr.ReadDouble();
        } else {
            if (c_oSerWrapThroughTight.DistR === type) {
                var DistR = this.bcr.ReadDouble();
            } else {
                if (c_oSerWrapThroughTight.WrapText === type) {
                    var WrapText = this.stream.GetUChar();
                } else {
                    if (c_oSerWrapThroughTight.WrapPolygon === type && wrappingPolygon !== undefined) {
                        wrappingPolygon.tempArrPoints = [];
                        var oStartRes = {
                            start: null
                        };
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadWrapPolygon(t, l, wrappingPolygon, oStartRes);
                        });
                        if (null != oStartRes.start) {
                            wrappingPolygon.tempArrPoints.unshift(oStartRes.start);
                        }
                        wrappingPolygon.setArrRelPoints(wrappingPolygon.tempArrPoints);
                        delete wrappingPolygon.tempArrPoints;
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadWrapTopBottom = function (type, length, wrappingPolygon) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWrapTopBottom.DistT === type) {
            var DistT = this.bcr.ReadDouble();
        } else {
            if (c_oSerWrapTopBottom.DistB === type) {
                var DistB = this.bcr.ReadDouble();
            } else {
                if (c_oSerWrapTopBottom.EffectExtent === type) {
                    var EffectExtent = {
                        Left: null,
                        Top: null,
                        Right: null,
                        Bottom: null
                    };
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadEffectExtent(t, l, EffectExtent);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadWrapPolygon = function (type, length, wrappingPolygon, oStartRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWrapPolygon.Edited === type) {
            wrappingPolygon.setEdited(this.stream.GetBool());
        } else {
            if (c_oSerWrapPolygon.Start === type) {
                oStartRes.start = new CPolygonPoint();
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadPolygonPoint(t, l, oStartRes.start);
                });
            } else {
                if (c_oSerWrapPolygon.ALineTo === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadLineTo(t, l, wrappingPolygon.tempArrPoints);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadLineTo = function (type, length, arrPoints) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWrapPolygon.LineTo === type) {
            var oPoint = new CPolygonPoint();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadPolygonPoint(t, l, oPoint);
            });
            arrPoints.push(oPoint);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadPolygonPoint = function (type, length, oPoint) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerPoint2D.X === type) {
            oPoint.x = (this.bcr.ReadDouble() * 36000 >> 0);
        } else {
            if (c_oSerPoint2D.Y === type) {
                oPoint.y = (this.bcr.ReadDouble() * 36000 >> 0);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadDocTable = function (type, length, table, tableFlow) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerDocTableType.tblPr === type) {
            table.Set_TableStyle2(null);
            var oNewTablePr = new CTablePr();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.btblPrr.Read_tblPr(t, l, oNewTablePr, table);
            });
            table.Pr = oNewTablePr;
            this.oReadResult.aPostOpenStyleNumCallbacks.push(function () {
                table.Set_Pr(oNewTablePr);
            });
        } else {
            if (c_oSerDocTableType.tblGrid === type) {
                var aNewGrid = [];
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.Read_tblGrid(t, l, aNewGrid);
                });
                table.Internal_SaveTableGridInHistory(aNewGrid, table.TableGrid);
                table.TableGrid = aNewGrid;
            } else {
                if (c_oSerDocTableType.Content === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.Read_TableContent(t, l, table);
                    });
                    if (table.Content.length > 0) {
                        table.CurCell = table.Content[0].Get_Cell(0);
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.Read_tblGrid = function (type, length, tblGrid) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerDocTableType.tblGrid_Item === type) {
            tblGrid.push(this.bcr.ReadDouble());
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.Read_TableContent = function (type, length, table) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var Content = table.Content;
        if (c_oSerDocTableType.Row === type) {
            var row = table.Internal_Add_Row(table.Content.length, 0);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.Read_Row(t, l, row);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.Read_Row = function (type, length, Row) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerDocTableType.Row_Pr === type) {
            var oNewRowPr = new CTableRowPr();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.btblPrr.Read_RowPr(t, l, oNewRowPr);
            });
            Row.Set_Pr(oNewRowPr);
        } else {
            if (c_oSerDocTableType.Row_Content === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadRowContent(t, l, Row);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadRowContent = function (type, length, row) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var Content = row.Content;
        if (c_oSerDocTableType.Cell === type) {
            var oCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCell(t, l, oCell);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCell = function (type, length, cell) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerDocTableType.Cell_Pr === type) {
            var oNewCellPr = new CTableCellPr();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.btblPrr.Read_CellPr(t, l, oNewCellPr);
            });
            cell.Set_Pr(oNewCellPr);
        } else {
            if (c_oSerDocTableType.Cell_Content === type) {
                var oCellContent = [];
                var oCellContentReader = new Binary_DocumentTableReader(cell.Content, this.oReadResult, this.openParams, this.stream, false, this.oComments);
                oCellContentReader.aFields = this.aFields;
                oCellContentReader.nCurCommentsCount = this.nCurCommentsCount;
                oCellContentReader.oCurComments = this.oCurComments;
                oCellContentReader.Read(length, oCellContent);
                this.nCurCommentsCount = oCellContentReader.nCurCommentsCount;
                if (oCellContent.length > 0) {
                    for (var i = 0; i < oCellContent.length; ++i) {
                        if (i == length - 1) {
                            cell.Content.Internal_Content_Add(i + 1, oCellContent[i], true);
                        } else {
                            cell.Content.Internal_Content_Add(i + 1, oCellContent[i], false);
                        }
                    }
                    cell.Content.Internal_Content_Remove(0, 1);
                }
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
}
function Binary_oMathReader(stream) {
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.brPrr = new Binary_rPrReader(null, this.stream);
    this.ReadRun = function (type, length, oRunObject, oParStruct, oRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRunType.rPr === type) {
            var rPr = new CTextPr();
            res = this.brPrr.Read(length, rPr);
            oRunObject.Set_Pr(rPr);
        } else {
            if (c_oSerRunType.Content === type) {
                var oPos = {
                    run: oRunObject,
                    pos: 0
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadRunContent(t, l, oPos, oParStruct, oRes);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadRunContent = function (type, length, oPos, oParStruct, oRes) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oNewElem = null;
        if (c_oSerRunType.run === type) {
            var text = this.stream.GetString2LE(length);
            for (var i = 0; i < text.length; ++i) {
                var nUnicode = null;
                var nCharCode = text.charCodeAt(i);
                if (isLeadingSurrogateChar(nCharCode)) {
                    if (i + 1 < text.length) {
                        i++;
                        var nTrailingChar = text.charCodeAt(i);
                        nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
                    }
                } else {
                    nUnicode = nCharCode;
                }
                if (null != nUnicode) {
                    if (32 != nUnicode) {
                        var oNewParaText = new ParaText();
                        oNewParaText.Set_CharCode(nUnicode);
                        oPos.run.Add_ToContent(oPos.pos, oNewParaText, false);
                    } else {
                        oPos.run.Add_ToContent(oPos.pos, new ParaSpace(), false);
                    }
                    oPos.pos++;
                }
            }
        } else {
            if (c_oSerRunType.tab === type) {
                oNewElem = new ParaTab();
            } else {
                if (c_oSerRunType.pagenum === type) {
                    oNewElem = new ParaPageNum();
                } else {
                    if (c_oSerRunType.pagebreak === type) {
                        oNewElem = new ParaNewLine(break_Page);
                    } else {
                        if (c_oSerRunType.linebreak === type) {
                            oNewElem = new ParaNewLine(break_Line);
                        } else {
                            if (c_oSerRunType._LastRun === type) {
                                this.oReadResult.bLastRun = true;
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        if (null != oNewElem) {
            oPos.run.Add_ToContent(oPos.pos, oNewElem, false);
            oPos.pos++;
        }
        return res;
    };
    this.ReadMathAcc = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.AccPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathAccPr(t, l, props);
            });
            var oMathAcc = new CAccent(props);
            if (oParent) {
                oParent.addElementToContent(oMathAcc);
            }
            oContent.content = oMathAcc.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathAccPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.Chr);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathAln = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        props.aln = false;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.aln = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathAlnScr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.alnScr = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathArg = function (type, length, oElem, oParStruct) {
        var bLast = this.bcr.stream.bLast;
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var props = {};
        if (c_oSer_OMathContentType.Acc === type) {
            var oContent = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathAcc(t, l, props, oElem, oContent);
            });
        } else {
            if (c_oSer_OMathContentType.ArgPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArgPr(t, l, oElem);
                });
            } else {
                if (c_oSer_OMathContentType.Bar === type) {
                    var oContent = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathBar(t, l, props, oElem, oContent);
                    });
                } else {
                    if (c_oSer_OMathContentType.BorderBox === type) {
                        var oContent = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathBorderBox(t, l, props, oElem, oContent);
                        });
                    } else {
                        if (c_oSer_OMathContentType.Box === type) {
                            var oContent = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadMathBox(t, l, props, oElem, oContent);
                            });
                        } else {
                            if (c_oSer_OMathContentType.CtrlPr === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadMathCtrlPr(t, l, props);
                                });
                                oElem.setCtrPrp(props.ctrlPr);
                            } else {
                                if (c_oSer_OMathContentType.Delimiter === type) {
                                    var arrContent = [];
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadMathDelimiter(t, l, props, oElem, arrContent);
                                    });
                                } else {
                                    if (c_oSer_OMathContentType.EqArr === type) {
                                        var arrContent = [];
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadMathEqArr(t, l, props, oElem, arrContent);
                                        });
                                    } else {
                                        if (c_oSer_OMathContentType.Fraction === type) {
                                            var oElemDen = {};
                                            var oElemNum = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadMathFraction(t, l, props, oElem, oElemDen, oElemNum);
                                            });
                                        } else {
                                            if (c_oSer_OMathContentType.Func === type) {
                                                var oContent = {};
                                                var oName = {};
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadMathFunc(t, l, props, oElem, oContent, oName);
                                                });
                                            } else {
                                                if (c_oSer_OMathContentType.GroupChr === type) {
                                                    var oContent = {};
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadMathGroupChr(t, l, props, oElem, oContent);
                                                    });
                                                } else {
                                                    if (c_oSer_OMathContentType.LimLow === type) {
                                                        var oContent = {};
                                                        var oLim = {};
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadMathLimLow(t, l, props, oElem, oContent, oLim);
                                                        });
                                                    } else {
                                                        if (c_oSer_OMathContentType.LimUpp === type) {
                                                            var oContent = {};
                                                            var oLim = {};
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadMathLimUpp(t, l, props, oElem, oContent, oLim);
                                                            });
                                                        } else {
                                                            if (c_oSer_OMathContentType.Matrix === type) {
                                                                var oMatrix = {};
                                                                var arrContent = [];
                                                                props.mcs = [];
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadMathMatrix(t, l, props, oElem, oMatrix, arrContent);
                                                                });
                                                            } else {
                                                                if (c_oSer_OMathContentType.Nary === type) {
                                                                    var oContent = {};
                                                                    var oSub = {};
                                                                    var oSup = {};
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadMathNary(t, l, props, oElem, oContent, oSub, oSup);
                                                                    });
                                                                } else {
                                                                    if (c_oSer_OMathContentType.OMath === type) {
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadMathArg(t, l, oElem);
                                                                        });
                                                                    } else {
                                                                        if (c_oSer_OMathContentType.Phant === type) {
                                                                            var oContent = {};
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadMathPhant(t, l, props, oElem, oContent);
                                                                            });
                                                                        } else {
                                                                            if (c_oSer_OMathContentType.MRun === type) {
                                                                                var oMRun = new ParaRun(null, true);
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadMathMRun(t, l, oMRun, props, oElem, oParStruct);
                                                                                });
                                                                                if (oElem) {
                                                                                    oElem.addElementToContent(oMRun);
                                                                                }
                                                                            } else {
                                                                                if (c_oSer_OMathContentType.Rad === type) {
                                                                                    var oContent = {};
                                                                                    var oDeg = {};
                                                                                    var oRad = {};
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadMathRad(t, l, props, oElem, oRad, oContent, oDeg);
                                                                                    });
                                                                                } else {
                                                                                    if (c_oSer_OMathContentType.SPre === type) {
                                                                                        var oContent = {};
                                                                                        var oSub = {};
                                                                                        var oSup = {};
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadMathSPre(t, l, props, oElem, oContent, oSub, oSup);
                                                                                        });
                                                                                    } else {
                                                                                        if (c_oSer_OMathContentType.SSub === type) {
                                                                                            var oContent = {};
                                                                                            var oSub = {};
                                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                                return oThis.ReadMathSSub(t, l, props, oElem, oContent, oSub);
                                                                                            });
                                                                                        } else {
                                                                                            if (c_oSer_OMathContentType.SSubSup === type) {
                                                                                                var oContent = {};
                                                                                                var oSub = {};
                                                                                                var oSup = {};
                                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                                    return oThis.ReadMathSSubSup(t, l, props, oElem, oContent, oSub, oSup);
                                                                                                });
                                                                                            } else {
                                                                                                if (c_oSer_OMathContentType.SSup === type) {
                                                                                                    var oContent = {};
                                                                                                    var oSup = {};
                                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                                        return oThis.ReadMathSSup(t, l, props, oElem, oContent, oSup);
                                                                                                    });
                                                                                                } else {
                                                                                                    res = c_oSerConstants.ReadUnknown;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (oElem && bLast) {
            oElem.Correct_Content(false);
        }
        return res;
    };
    this.ReadMathArgPr = function (type, length, oElem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.ArgSz === type) {
            var props = {};
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathArgSz(t, l, props);
            });
            oElem.SetArgSize(props.argSz);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathArgSz = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.argSz = this.stream.GetULongLE();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathBar = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BarPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBarPr(t, l, props, oBar);
            });
            var oBar = new CBar(props);
            if (oParent) {
                oParent.addElementToContent(oBar);
            }
            oContent.content = oBar.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBarPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.Pos === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathPos(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBaseJc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var baseJc = this.stream.GetUChar(length);
            switch (baseJc) {
            case c_oAscYAlign.Bottom:
                props.baseJc = BASEJC_BOTTOM;
                break;
            case c_oAscYAlign.Center:
                props.baseJc = BASEJC_CENTER;
                break;
            case c_oAscYAlign.Top:
                props.baseJc = BASEJC_TOP;
                break;
            default:
                props.baseJc = BASEJC_TOP;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathBorderBox = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BorderBoxPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBorderBoxPr(t, l, props);
            });
            var oBorderBox = new CBorderBox(props);
            if (oParent) {
                oParent.addElementToContent(oBorderBox);
            }
            oContent.content = oBorderBox.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBorderBoxPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.HideBot === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathHideBot(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.HideLeft === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathHideLeft(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.HideRight === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathHideRight(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.HideTop === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathHideTop(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.StrikeBLTR === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathStrikeBLTR(t, l, props);
                                });
                            } else {
                                if (c_oSer_OMathBottomNodesType.StrikeH === type) {
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadMathStrikeH(t, l, props);
                                    });
                                } else {
                                    if (c_oSer_OMathBottomNodesType.StrikeTLBR === type) {
                                        res = this.bcr.Read2(length, function (t, l) {
                                            return oThis.ReadMathStrikeTLBR(t, l, props);
                                        });
                                    } else {
                                        if (c_oSer_OMathBottomNodesType.StrikeV === type) {
                                            res = this.bcr.Read2(length, function (t, l) {
                                                return oThis.ReadMathStrikeV(t, l, props);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathBox = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BoxPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBoxPr(t, l, props);
            });
            var oBox = new CBox(props);
            if (oParent) {
                oParent.addElementToContent(oBox);
            }
            oContent.content = oBox.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBoxPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Aln === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathAln(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.Brk === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBrk(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.Diff === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathDiff(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.NoBreak === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathNoBreak(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.OpEmu === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathOpEmu(t, l, props);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathBrk = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var brk = this.stream.GetBool();
            props.brk = {};
        } else {
            if (c_oSer_OMathBottomNodesValType.AlnAt === type) {
                var aln = this.stream.GetULongLE();
                props.brk = {
                    alnAt: aln
                };
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathCGp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.cGp = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathCGpRule = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.cGpRule = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathCSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.cSp = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathColumn = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        props.column = 0;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.column = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathCount = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        props.count = 0;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.count = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathChr = function (type, length, props, typeChr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var text = this.stream.GetString2LE(length);
            var aUnicode = convertUTF16toUnicode(text);
            var chr = (aUnicode.length <= 0 ? OPERATOR_EMPTY : aUnicode[0]);
            switch (typeChr) {
            default:
                case c_oSer_OMathChrType.Chr:
                props.chr = chr;
                break;
            case c_oSer_OMathChrType.BegChr:
                props.begChr = chr;
                break;
            case c_oSer_OMathChrType.EndChr:
                props.endChr = chr;
                break;
            case c_oSer_OMathChrType.SepChr:
                props.sepChr = chr;
                break;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathCtrlPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRunType.rPr === type) {
            var MathTextRPr = new CTextPr();
            res = this.brPrr.Read(length, MathTextRPr);
            props.ctrPrp = MathTextRPr;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDelimiter = function (type, length, props, oElem, arrContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.DelimiterPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathDelimiterPr(t, l, props);
            });
            props.counter = 0;
            var oDelimiter = new CDelimiter(props);
            oElem.addElementToContent(oDelimiter);
            for (var i = 0; i < props.column; i++) {
                arrContent[i] = oDelimiter.getBase(i);
            }
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                var lColumn = props.counter;
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, arrContent[lColumn]);
                });
                props.counter++;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathDelimiterPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Column === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathColumn(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.BegChr === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.BegChr);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.EndChr === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.EndChr);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.Grow === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathGrow(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.SepChr === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.SepChr);
                                });
                            } else {
                                if (c_oSer_OMathBottomNodesType.Shp === type) {
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadMathShp(t, l, props);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathDegHide = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.degHide = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDiff = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.diff = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathEqArr = function (type, length, props, oElem, arrContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.EqArrPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathEqArrPr(t, l, props);
            });
            if (!props.ctrPrp) {
                props.ctrPrp = new CTextPr();
            }
            props.counter = 0;
            var oEqArr = new CEqArray(props);
            oElem.addElementToContent(oEqArr);
            for (var i = 0; i < props.row; i++) {
                arrContent[i] = oEqArr.getElement(i);
            }
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                var lRow = props.counter;
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, arrContent[lRow]);
                });
                props.counter++;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathEqArrPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Row === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathRow(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.BaseJc === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBaseJc(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.MaxDist === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathMaxDist(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.ObjDist === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathObjDist(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.RSp === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathRSp(t, l, props);
                                });
                            } else {
                                if (c_oSer_OMathBottomNodesType.RSpRule === type) {
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadMathRSpRule(t, l, props);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathFraction = function (type, length, props, oParent, oElemDen, oElemNum) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.FPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathFPr(t, l, props);
            });
            var oFraction = new CFraction(props);
            if (oParent) {
                oParent.addElementToContent(oFraction);
            }
            oElemDen.content = oFraction.getDenominator();
            oElemNum.content = oFraction.getNumerator();
        } else {
            if (c_oSer_OMathContentType.Den === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElemDen.content);
                });
            } else {
                if (c_oSer_OMathContentType.Num === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oElemNum.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathFPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.Type === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathType(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathFunc = function (type, length, props, oParent, oContent, oName) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.FuncPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathFuncPr(t, l, props);
            });
            var oFunc = new CMathFunc(props);
            if (oParent) {
                oParent.addElementToContent(oFunc);
            }
            oContent.content = oFunc.getArgument();
            oName.content = oFunc.getFName();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                if (c_oSer_OMathContentType.FName === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oName.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathFuncPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathHideBot = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.hideBot = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathGroupChr = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.GroupChrPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathGroupChrPr(t, l, props);
            });
            var oGroupChr = new CGroupCharacter(props);
            if (oParent) {
                oParent.addElementToContent(oGroupChr);
            }
            oContent.content = oGroupChr.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathGroupChrPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.Chr);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.Pos === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathPos(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.VertJc === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathVertJc(t, l, props);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathGrow = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.grow = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathHideLeft = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.hideLeft = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathHideRight = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.hideRight = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathHideTop = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.hideTop = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLimLoc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var limLoc = this.stream.GetUChar(length);
            switch (limLoc) {
            case c_oAscLimLoc.SubSup:
                props.limLoc = NARY_SubSup;
                break;
            case c_oAscLimLoc.UndOvr:
                props.limLoc = NARY_UndOvr;
                break;
            default:
                props.limLoc = NARY_SubSup;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLimLow = function (type, length, props, oParent, oContent, oLim) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.LimLowPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathLimLowPr(t, l, props);
            });
            props.type = LIMIT_LOW;
            var oLimLow = new CLimit(props);
            if (oParent) {
                oParent.addElementToContent(oLimLow);
            }
            oContent.content = oLimLow.getFName();
            oLim.content = oLimLow.getIterator();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                if (c_oSer_OMathContentType.Lim === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oLim.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathLimLowPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLimUpp = function (type, length, props, oParent, oContent, oLim) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.LimUppPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathLimUppPr(t, l, props);
            });
            props.type = LIMIT_UP;
            var oLimUpp = new CLimit(props);
            if (oParent) {
                oParent.addElementToContent(oLimUpp);
            }
            oContent.content = oLimUpp.getFName();
            oLim.content = oLimUpp.getIterator();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                if (c_oSer_OMathContentType.Lim === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oLim.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathLimUppPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLit = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.lit = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMatrix = function (type, length, props, oParent, oMatr, arrContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.MPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathMPr(t, l, props);
            });
            var oMatrix = new CMathMatrix(props);
            if (oParent) {
                oParent.addElementToContent(oMatrix);
            }
            oMatr.content = oMatrix;
            oMatr.content.row = 0;
            oMatr.content.column = 0;
            var column = 0;
            for (var i = 0; i < props.mcs.length; i++) {
                column += props.mcs[i].count;
            }
            for (var i = 0; i < props.row; i++) {
                arrContent[i] = [];
                for (var j = 0; j < column; j++) {
                    arrContent[i][j] = oMatrix.getElement(i, j);
                }
            }
        } else {
            if (c_oSer_OMathContentType.Mr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathMr(t, l, oMatr.content, arrContent);
                });
                oMatr.content.row++;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathMc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.McPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathMcPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMcJc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var mcJc = this.stream.GetUChar(length);
            switch (mcJc) {
            case c_oAscXAlign.Center:
                props.mcJc = MCJC_CENTER;
                break;
            case c_oAscXAlign.Inside:
                props.mcJc = MCJC_INSIDE;
                break;
            case c_oAscXAlign.Left:
                props.mcJc = MCJC_LEFT;
                break;
            case c_oAscXAlign.Outside:
                props.mcJc = MCJC_OUTSIDE;
                break;
            case c_oAscXAlign.Right:
                props.mcJc = MCJC_RIGHT;
                break;
            default:
                props.mcJc = MCJC_CENTER;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMcPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Count === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathCount(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.McJc === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathMcJc(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathMcs = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Mc === type) {
            var mc = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathMc(t, l, mc);
            });
            props.mcs.push(mc);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMJc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var mJc = this.stream.GetUChar(length);
            switch (mJc) {
            case c_oAscMathJc.Center:
                props.mJc = JC_CENTER;
                break;
            case c_oAscMathJc.CenterGroup:
                props.mJc = JC_CENTERGROUP;
                break;
            case c_oAscMathJc.Left:
                props.mJc = JC_LEFT;
                break;
            case c_oAscMathJc.Right:
                props.mJc = JC_RIGHT;
                break;
            default:
                props.mJc = JC_CENTERGROUP;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Row === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathRow(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.BaseJc === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBaseJc(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.CGp === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathCGp(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.CGpRule === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathCGpRule(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.CSp === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathCSp(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadMathCtrlPr(t, l, props);
                                });
                            } else {
                                if (c_oSer_OMathBottomNodesType.Mcs === type) {
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadMathMcs(t, l, props);
                                    });
                                } else {
                                    if (c_oSer_OMathBottomNodesType.PlcHide === type) {
                                        res = this.bcr.Read2(length, function (t, l) {
                                            return oThis.ReadMathPlcHide(t, l, props);
                                        });
                                    } else {
                                        if (c_oSer_OMathBottomNodesType.RSp === type) {
                                            res = this.bcr.Read2(length, function (t, l) {
                                                return oThis.ReadMathRSp(t, l, props);
                                            });
                                        } else {
                                            if (c_oSer_OMathBottomNodesType.RSpRule === type) {
                                                res = this.bcr.Read2(length, function (t, l) {
                                                    return oThis.ReadMathRSpRule(t, l, props);
                                                });
                                            } else {
                                                res = c_oSerConstants.ReadUnknown;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathMr = function (type, length, oMatrix, arrContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Element === type) {
            var lRow = oMatrix.row;
            var lColumn = oMatrix.column;
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathArg(t, l, arrContent[lRow][lColumn]);
            });
            oMatrix.column++;
            if (oMatrix.nCol == oMatrix.column) {
                oMatrix.column = 0;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMaxDist = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.maxDist = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathText = function (type, length, oMRun) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var aUnicodes = [];
            if (length > 0) {
                aUnicodes = convertUTF16toUnicode(this.stream.GetString2LE(length));
            }
            for (var nPos = 0, nCount = aUnicodes.length; nPos < nCount; ++nPos) {
                var nUnicode = aUnicodes[nPos];
                var oText = null;
                if (38 == nUnicode) {
                    oText = new CMathAmp();
                } else {
                    oText = new CMathText(false);
                    oText.add(nUnicode);
                }
                if (oText) {
                    oMRun.Add_ToContent(nPos, oText, false, true);
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMRun = function (type, length, oMRun, props, oParent, oParStruct) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oNewElem = null;
        if (c_oSer_OMathContentType.MText === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathText(t, l, oMRun);
            });
        } else {
            if (c_oSer_OMathContentType.MRPr === type) {
                var mrPr = new CMPrp();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathMRPr(t, l, mrPr);
                });
                oMRun.Set_MathPr(mrPr);
            } else {
                if (c_oSer_OMathContentType.RPr === type) {
                    var rPr = new CTextPr();
                    res = this.brPrr.Read(length, rPr);
                    oMRun.Set_Pr(rPr);
                } else {
                    if (c_oSer_OMathContentType.pagebreak === type) {
                        oNewElem = new ParaNewLine(break_Page);
                    } else {
                        if (c_oSer_OMathContentType.linebreak === type) {
                            oNewElem = new ParaNewLine();
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        if (null != oNewElem) {
            var oNewRun = new ParaRun(oParStruct.paragraph);
            oNewRun.Add_ToContent(0, oNewElem, false);
            oParStruct.addToContent(oNewRun);
        }
        return res;
    };
    this.ReadMathMRPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Aln === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathAln(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.Brk === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBrk(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.Lit === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathLit(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.Nor === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathNor(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.Scr === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathScr(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.Sty === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathSty(t, l, props);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathNary = function (type, length, props, oParent, oContent, oSub, oSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.NaryPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathNaryPr(t, l, props);
            });
            if (!props.ctrPrp) {
                props.ctrPrp = new CTextPr();
            }
            var oNary = new CNary(props);
            if (oParent) {
                oParent.addElementToContent(oNary);
            }
            oSub.content = oNary.getLowerIterator();
            oSup.content = oNary.getUpperIterator();
            oContent.content = oNary.getBase();
        } else {
            if (c_oSer_OMathContentType.Sub === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub.content);
                });
            } else {
                if (c_oSer_OMathContentType.Sup === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup.content);
                    });
                } else {
                    if (c_oSer_OMathContentType.Element === type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oContent.content);
                        });
                    } else {
                        if (c_oSer_OMathContentType.CtrlPr) {
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadMathCtrlPr(t, l, props);
                            });
                            oParent.Content[oParent.Content.length - 1].setCtrPrp(props.ctrPrp);
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathNaryPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props, c_oSer_OMathChrType.Chr);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.Grow === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathGrow(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.LimLoc === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathLimLoc(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.SubHide === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathSubHide(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.SupHide === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathSupHide(t, l, props);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathNoBreak = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.noBreak = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathNor = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.nor = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathObjDist = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.objDist = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathOMathPara = function (type, length, oParStruct, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.OMath === type) {
            var oMath = new ParaMath();
            oMath.Set_Align(props.mJc === JC_CENTER || props.mJc === JC_CENTERGROUP ? align_Center : (props.mJc === JC_LEFT ? align_Left : (props.mJc === JC_RIGHT ? align_Right : props.mJc)));
            oParStruct.addToContent(oMath);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathArg(t, l, oMath.Root, oParStruct);
            });
            oMath.Root.Correct_Content(true);
        } else {
            if (c_oSer_OMathContentType.OMathParaPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathOMathParaPr(t, l, props);
                });
            } else {
                if (c_oSer_OMathContentType.Run === type) {
                    var oNewRun = new ParaRun(oParStruct.paragraph);
                    var oRes = {
                        bRes: true
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadRun(t, l, oNewRun, oParStruct, oRes);
                    });
                    oParStruct.addToContent(oNewRun);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathOMathParaPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.MJc === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathMJc(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathOpEmu = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.opEmu = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathPhant = function (type, length, props, oParent, oContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.PhantPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathPhantPr(t, l, props);
            });
            var oPhant = new CPhantom(props);
            if (oParent) {
                oParent.addElementToContent(oPhant);
            }
            oContent.content = oPhant.getBase();
        } else {
            if (c_oSer_OMathContentType.Element === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oContent.content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathPhantPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.Show === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathShow(t, l, props);
                });
            } else {
                if (c_oSer_OMathBottomNodesType.Transp === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathTransp(t, l, props);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.ZeroAsc === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathZeroAsc(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.ZeroDesc === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathZeroDesc(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.ZeroWid === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathZeroWid(t, l, props);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathPlcHide = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.plcHide = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathPos = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var pos = this.stream.GetUChar(length);
            switch (pos) {
            case c_oAscTopBot.Bot:
                props.pos = LOCATION_BOT;
                break;
            case c_oAscTopBot.Top:
                props.pos = LOCATION_TOP;
                break;
            default:
                props.pos = LOCATION_BOT;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathRad = function (type, length, props, oParent, oRad, oContent, oDeg) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.RadPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathRadPr(t, l, props);
            });
            oRad.content = new CRadical(props);
            if (oParent) {
                oParent.addElementToContent(oRad.content);
            }
            oDeg.content = oRad.content.getDegree();
            oContent.content = oRad.content.getBase();
        } else {
            if (c_oSer_OMathContentType.Deg === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oDeg.content);
                });
            } else {
                if (c_oSer_OMathContentType.Element === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oContent.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathRadPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.DegHide === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathDegHide(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathRow = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        props.row = 0;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.row = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathRSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.rSp = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathRSpRule = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OMathBottomNodesValType.Val == type) {
            props.rSpRule = this.stream.GetULongLE();
        }
        return res;
    };
    this.ReadMathScr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var scr = this.stream.GetUChar(length);
            switch (scr) {
            case c_oAscScript.DoubleStruck:
                props.scr = TXT_DOUBLE_STRUCK;
                break;
            case c_oAscScript.Fraktur:
                props.scr = TXT_FRAKTUR;
                break;
            case c_oAscScript.Monospace:
                props.scr = TXT_MONOSPACE;
                break;
            case c_oAscScript.Roman:
                props.scr = TXT_ROMAN;
                break;
            case c_oAscScript.SansSerif:
                props.scr = TXT_SANS_SERIF;
                break;
            case c_oAscScript.Script:
                props.scr = TXT_SCRIPT;
                break;
            default:
                props.scr = TXT_ROMAN;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathShow = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.show = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathShp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var shp = this.stream.GetUChar(length);
            switch (shp) {
            case c_oAscShp.Centered:
                props.shp = DELIMITER_SHAPE_CENTERED;
                break;
            case c_oAscShp.Match:
                props.shp = DELIMITER_SHAPE_MATH;
                break;
            default:
                props.shp = DELIMITER_SHAPE_CENTERED;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSPre = function (type, length, props, oParent, oContent, oSub, oSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SPrePr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSPrePr(t, l, props);
            });
            props.type = DEGREE_PreSubSup;
            var oSPre = new CDegreeSubSup(props);
            if (oParent) {
                oParent.addElementToContent(oSPre);
            }
            oSub.content = oSPre.getLowerIterator();
            oSup.content = oSPre.getUpperIterator();
            oContent.content = oSPre.getBase();
        } else {
            if (c_oSer_OMathContentType.Sub === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub.content);
                });
            } else {
                if (c_oSer_OMathContentType.Sup === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup.content);
                    });
                } else {
                    if (c_oSer_OMathContentType.Element === type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oContent.content);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathSPrePr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSSub = function (type, length, props, oParent, oContent, oSub) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSubPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSubPr(t, l, props);
            });
            props.type = DEGREE_SUBSCRIPT;
            var oSSub = new CDegree(props);
            if (oParent) {
                oParent.addElementToContent(oSSub);
            }
            oSub.content = oSSub.getLowerIterator();
            oContent.content = oSSub.getBase();
        } else {
            if (c_oSer_OMathContentType.Sub === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub.content);
                });
            } else {
                if (c_oSer_OMathContentType.Element === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oContent.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathSSubPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSSubSup = function (type, length, props, oParent, oContent, oSub, oSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSubSupPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSubSupPr(t, l, props);
            });
            props.type = DEGREE_SubSup;
            var oSSubSup = new CDegreeSubSup(props);
            if (oParent) {
                oParent.addElementToContent(oSSubSup);
            }
            oSub.content = oSSubSup.getLowerIterator();
            oSup.content = oSSubSup.getUpperIterator();
            oContent.content = oSSubSup.getBase();
        } else {
            if (c_oSer_OMathContentType.Sub === type) {
                if (undefined == oContent.content) {
                    props.type = DEGREE_SubSup;
                    var oSSubSup = new CDegreeSubSup(props);
                    if (oParent) {
                        oParent.addElementToContent(oSSubSup);
                    }
                    oSub.content = oSSubSup.getLowerIterator();
                    oSup.content = oSSubSup.getUpperIterator();
                    oContent.content = oSSubSup.getBase();
                }
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub.content);
                });
            } else {
                if (c_oSer_OMathContentType.Sup === type) {
                    if (undefined == oContent.content) {
                        props.type = DEGREE_SubSup;
                        var oSSubSup = new CDegreeSubSup(props);
                        if (oParent) {
                            oParent.addElementToContent(oSSubSup);
                        }
                        oSub.content = oSSubSup.getLowerIterator();
                        oSup.content = oSSubSup.getUpperIterator();
                        oContent.content = oSSubSup.getBase();
                    }
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup.content);
                    });
                } else {
                    if (c_oSer_OMathContentType.Element === type) {
                        if (undefined == oContent.content) {
                            props.type = DEGREE_SubSup;
                            var oSSubSup = new CDegreeSubSup(props);
                            if (oParent) {
                                oParent.addElementToContent(oSSubSup);
                            }
                            oSub.content = oSSubSup.getLowerIterator();
                            oSup.content = oSSubSup.getUpperIterator();
                            oContent.content = oSSubSup.getBase();
                        }
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oContent.content);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathSSubSupPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.AlnScr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathAlnScr(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathSSup = function (type, length, props, oParent, oContent, oSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSupPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSupPr(t, l, props);
            });
            props.type = DEGREE_SUPERSCRIPT;
            var oSSup = new CDegree(props);
            if (oParent) {
                oParent.addElementToContent(oSSup);
            }
            oSup.conten = oSSup.getUpperIterator();
            oContent.content = oSSup.getBase();
        } else {
            if (c_oSer_OMathContentType.Sup === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSup.conten);
                });
            } else {
                if (c_oSer_OMathContentType.Element === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oContent.content);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathSSupPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathStrikeBLTR = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.strikeBLTR = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathStrikeH = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.strikeH = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathStrikeTLBR = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.strikeTLBR = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathStrikeV = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.strikeV = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSty = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var sty = this.stream.GetUChar(length);
            switch (sty) {
            case c_oAscSty.Bold:
                props.sty = STY_BOLD;
                break;
            case c_oAscSty.BoldItalic:
                props.sty = STY_BI;
                break;
            case c_oAscSty.Italic:
                props.sty = STY_ITALIC;
                break;
            case c_oAscSty.Plain:
                props.sty = STY_PLAIN;
                break;
            default:
                props.sty = STY_ITALIC;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSubHide = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.subHide = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSupHide = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.supHide = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathTransp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.transp = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathType = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var type = this.stream.GetUChar(length);
            switch (type) {
            case c_oAscFType.Bar:
                props.type = BAR_FRACTION;
                break;
            case c_oAscFType.Lin:
                props.type = LINEAR_FRACTION;
                break;
            case c_oAscFType.NoBar:
                props.type = NO_BAR_FRACTION;
                break;
            case c_oAscFType.Skw:
                props.type = SKEWED_FRACTION;
                break;
            default:
                props.type = BAR_FRACTION;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathVertJc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var vertJc = this.stream.GetUChar(length);
            switch (vertJc) {
            case c_oAscTopBot.Bot:
                props.vertJc = VJUST_BOT;
                break;
            case c_oAscTopBot.Top:
                props.vertJc = VJUST_TOP;
                break;
            default:
                props.vertJc = VJUST_BOT;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathZeroAsc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.zeroAsc = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathZeroDesc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.zeroDesc = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathZeroWid = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.zeroWid = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_OtherTableReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.ImageMapIndex = 0;
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadOtherContent(t, l);
        });
    };
    this.ReadOtherContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerOtherTableTypes.ImageMap === type) {
            var oThis = this;
            this.ImageMapIndex = 0;
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadImageMapContent(t, l);
            });
        } else {
            if (c_oSerOtherTableTypes.EmbeddedFonts === type) {
                var _count = this.stream.GetULongLE();
                var _embedded_fonts = [];
                for (var i = 0; i < _count; i++) {
                    var _at = this.stream.GetUChar();
                    if (_at != g_nodeAttributeStart) {
                        break;
                    }
                    var _f_i = {};
                    while (true) {
                        _at = this.stream.GetUChar();
                        if (_at == g_nodeAttributeEnd) {
                            break;
                        }
                        switch (_at) {
                        case 0:
                            _f_i.Name = this.stream.GetString();
                            break;
                        case 1:
                            _f_i.Style = this.stream.GetULongLE();
                            break;
                        case 2:
                            _f_i.IsCut = this.stream.GetBool();
                            break;
                        case 3:
                            _f_i.IndexCut = this.stream.GetULongLE();
                            break;
                        default:
                            break;
                        }
                    }
                    _embedded_fonts.push(_f_i);
                }
                var api = this.Document.DrawingDocument.m_oWordControl.m_oApi;
                if (true == api.isUseEmbeddedCutFonts) {
                    var font_cuts = api.FontLoader.embedded_cut_manager;
                    font_cuts.Url = api.DocumentUrl + "fonts/fonts.js";
                    font_cuts.init_cut_fonts(_embedded_fonts);
                    font_cuts.bIsCutFontsUse = true;
                }
            } else {
                if (c_oSerOtherTableTypes.DocxTheme === type) {
                    this.Document.theme = window.global_pptx_content_loader.ReadTheme(this, this.stream);
                    res = c_oSerConstants.ReadUnknown;
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadImageMapContent = function (type, length, oNewImage) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerOtherTableTypes.ImageMap_Src === type) {
            this.oReadResult.ImageMap[this.ImageMapIndex] = this.stream.GetString2LE(length);
            this.ImageMapIndex++;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_CommentsTableReader(doc, oReadResult, stream, oComments) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.oComments = oComments;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadComments(t, l);
        });
    };
    this.ReadComments = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CommentsType.Comment === type) {
            var oNewComment = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCommentContent(t, l, oNewComment);
            });
            if (null != oNewComment.Id) {
                this.oComments[oNewComment.Id] = oNewComment;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCommentContent = function (type, length, oNewImage) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CommentsType.Id === type) {
            oNewImage.Id = this.stream.GetULongLE();
        } else {
            if (c_oSer_CommentsType.UserName === type) {
                oNewImage.UserName = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_CommentsType.UserId === type) {
                    oNewImage.UserId = this.stream.GetString2LE(length);
                } else {
                    if (c_oSer_CommentsType.Date === type) {
                        var oDate = this.Iso8601ToDate(this.stream.GetString2LE(length));
                        if (null != oDate) {
                            oNewImage.Date = oDate.getTime() + "";
                        }
                    } else {
                        if (c_oSer_CommentsType.Text === type) {
                            oNewImage.Text = this.stream.GetString2LE(length);
                        } else {
                            if (c_oSer_CommentsType.Solved === type) {
                                oNewImage.Solved = (this.stream.GetUChar() != 0);
                            } else {
                                if (c_oSer_CommentsType.Replies === type) {
                                    oNewImage.Replies = [];
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadReplies(t, l, oNewImage.Replies);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.Iso8601ToDate = function (sDate) {
        var numericKeys = [1, 4, 5, 6, 7, 10, 11];
        var minutesOffset = 0;
        var struct;
        if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(sDate))) {
            for (var i = 0, k;
            (k = numericKeys[i]); ++i) {
                struct[k] = +struct[k] || 0;
            }
            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;
            if (struct[8] !== "Z" && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];
                if (struct[9] === "+") {
                    minutesOffset = 0 - minutesOffset;
                }
            }
            return new Date(Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]));
        }
        return null;
    };
    this.ReadReplies = function (type, length, Replies) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CommentsType.Comment === type) {
            var oNewComment = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCommentContent(t, l, oNewComment);
            });
            Replies.push(oNewComment);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_SettingsTableReader(doc, oReadResult, stream) {
    this.Document = doc;
    this.oReadResult = oReadResult;
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadSettingsContent(t, l);
        });
    };
    this.ReadSettingsContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_SettingsType.ClrSchemeMapping === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadColorSchemeMapping(t, l);
            });
        } else {
            if (c_oSer_SettingsType.DefaultTabStop === type) {
                var dNewTab_Stop = this.bcr.ReadDouble();
                if (dNewTab_Stop > 0) {
                    Default_Tab_Stop = dNewTab_Stop;
                }
            } else {
                if (c_oSer_SettingsType.MathPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathPr(t, l, g_oMathSettings);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathPr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_MathPrType.BrkBin === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathBrkBin(t, l, props);
            });
        } else {
            if (c_oSer_MathPrType.BrkBinSub === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBrkBinSub(t, l, props);
                });
            } else {
                if (c_oSer_MathPrType.DefJc === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadMathDefJc(t, l, props);
                    });
                } else {
                    if (c_oSer_MathPrType.DispDef === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathDispDef(t, l, props);
                        });
                    } else {
                        if (c_oSer_MathPrType.InterSp === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathInterSp(t, l, props);
                            });
                        } else {
                            if (c_oSer_MathPrType.IntLim === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathIntLim(t, l, props);
                                });
                            } else {
                                if (c_oSer_MathPrType.IntraSp === type) {
                                    res = this.bcr.Read2(length, function (t, l) {
                                        return oThis.ReadMathIntraSp(t, l, props);
                                    });
                                } else {
                                    if (c_oSer_MathPrType.LMargin === type) {
                                        res = this.bcr.Read2(length, function (t, l) {
                                            return oThis.ReadMathLMargin(t, l, props);
                                        });
                                    } else {
                                        if (c_oSer_MathPrType.MathFont === type) {
                                            res = this.bcr.Read2(length, function (t, l) {
                                                return oThis.ReadMathMathFont(t, l, props);
                                            });
                                        } else {
                                            if (c_oSer_MathPrType.NaryLim === type) {
                                                res = this.bcr.Read2(length, function (t, l) {
                                                    return oThis.ReadMathNaryLim(t, l, props);
                                                });
                                            } else {
                                                if (c_oSer_MathPrType.PostSp === type) {
                                                    res = this.bcr.Read2(length, function (t, l) {
                                                        return oThis.ReadMathPostSp(t, l, props);
                                                    });
                                                } else {
                                                    if (c_oSer_MathPrType.PreSp === type) {
                                                        res = this.bcr.Read2(length, function (t, l) {
                                                            return oThis.ReadMathPreSp(t, l, props);
                                                        });
                                                    } else {
                                                        if (c_oSer_MathPrType.RMargin === type) {
                                                            res = this.bcr.Read2(length, function (t, l) {
                                                                return oThis.ReadMathRMargin(t, l, props);
                                                            });
                                                        } else {
                                                            if (c_oSer_MathPrType.SmallFrac === type) {
                                                                res = this.bcr.Read2(length, function (t, l) {
                                                                    return oThis.ReadMathSmallFrac(t, l, props);
                                                                });
                                                            } else {
                                                                if (c_oSer_MathPrType.WrapIndent === type) {
                                                                    res = this.bcr.Read2(length, function (t, l) {
                                                                        return oThis.ReadMathWrapIndent(t, l, props);
                                                                    });
                                                                } else {
                                                                    if (c_oSer_MathPrType.WrapRight === type) {
                                                                        res = this.bcr.Read2(length, function (t, l) {
                                                                            return oThis.ReadMathWrapRight(t, l, props);
                                                                        });
                                                                    } else {
                                                                        res = c_oSerConstants.ReadUnknown;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathBrkBin = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var brkBin = this.stream.GetUChar(length);
            switch (brkBin) {
            case c_oAscBrkBin.After:
                props.brkBin = BREAK_AFTER;
                break;
            case c_oAscBrkBin.Before:
                props.brkBin = BREAK_BEFORE;
                break;
            case c_oAscBrkBin.Repeat:
                props.brkBin = BREAK_REPEAT;
                break;
            default:
                props.brkBin = BREAK_REPEAT;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathBrkBinSub = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var brkBinSub = this.stream.GetUChar(length);
            switch (brkBinSub) {
            case c_oAscBrkBinSub.PlusMinus:
                props.brkBinSub = BREAK_PLUS_MIN;
                break;
            case c_oAscBrkBinSub.MinusPlus:
                props.brkBinSub = BREAK_MIN_PLUS;
                break;
            case c_oAscBrkBinSub.MinusMinus:
                props.brkBinSub = BREAK_MIN_MIN;
                break;
            default:
                props.brkBinSub = BREAK_MIN_MIN;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDefJc = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var defJc = this.stream.GetUChar(length);
            switch (defJc) {
            case c_oAscMathJc.Center:
                props.defJc = JC_CENTER;
                break;
            case c_oAscMathJc.CenterGroup:
                props.defJc = JC_CENTERGROUP;
                break;
            case c_oAscMathJc.Left:
                props.defJc = JC_LEFT;
                break;
            case c_oAscMathJc.Right:
                props.defJc = JC_RIGHT;
                break;
            default:
                props.defJc = JC_CENTERGROUP;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDispDef = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.dispDef = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathInterSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.interSp = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMathFont = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.mathFont = this.stream.GetString2LE(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathIntLim = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var intLim = this.stream.GetUChar(length);
            switch (intLim) {
            case c_oAscLimLoc.SubSup:
                props.intLim = NARY_SubSup;
                break;
            case c_oAscLimLoc.UndOvr:
                props.intLim = NARY_UndOvr;
                break;
            default:
                props.intLim = NARY_SubSup;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathIntraSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.intraSp = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLMargin = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.lMargin = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathNaryLim = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var naryLim = this.stream.GetUChar(length);
            switch (naryLim) {
            case c_oAscLimLoc.SubSup:
                props.naryLim = NARY_SubSup;
                break;
            case c_oAscLimLoc.UndOvr:
                props.naryLim = NARY_UndOvr;
                break;
            default:
                props.naryLim = NARY_SubSup;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathPostSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.postSp = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathPreSp = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.preSp = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathRMargin = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.rMargin = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSmallFrac = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.smallFrac = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathWrapIndent = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.wrapIndent = this.bcr.ReadDouble();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathWrapRight = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.wrapRight = this.stream.GetBool();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadColorSchemeMapping = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ClrSchemeMappingType.Accent1 <= type && type <= c_oSer_ClrSchemeMappingType.T2) {
            var val = this.stream.GetUChar();
            this.ApplyColorSchemeMappingItem(type, val);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ApplyColorSchemeMappingItem = function (type, val) {
        var nScriptType = 0;
        var nScriptVal = 0;
        switch (type) {
        case c_oSer_ClrSchemeMappingType.Accent1:
            nScriptType = 0;
            break;
        case c_oSer_ClrSchemeMappingType.Accent2:
            nScriptType = 1;
            break;
        case c_oSer_ClrSchemeMappingType.Accent3:
            nScriptType = 2;
            break;
        case c_oSer_ClrSchemeMappingType.Accent4:
            nScriptType = 3;
            break;
        case c_oSer_ClrSchemeMappingType.Accent5:
            nScriptType = 4;
            break;
        case c_oSer_ClrSchemeMappingType.Accent6:
            nScriptType = 5;
            break;
        case c_oSer_ClrSchemeMappingType.Bg1:
            nScriptType = 6;
            break;
        case c_oSer_ClrSchemeMappingType.Bg2:
            nScriptType = 7;
            break;
        case c_oSer_ClrSchemeMappingType.FollowedHyperlink:
            nScriptType = 10;
            break;
        case c_oSer_ClrSchemeMappingType.Hyperlink:
            nScriptType = 11;
            break;
        case c_oSer_ClrSchemeMappingType.T1:
            nScriptType = 15;
            break;
        case c_oSer_ClrSchemeMappingType.T2:
            nScriptType = 16;
            break;
        }
        switch (val) {
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent1:
            nScriptVal = 0;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent2:
            nScriptVal = 1;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent3:
            nScriptVal = 2;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent4:
            nScriptVal = 3;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent5:
            nScriptVal = 4;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexAccent6:
            nScriptVal = 5;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexDark1:
            nScriptVal = 8;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexDark2:
            nScriptVal = 9;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexFollowedHyperlink:
            nScriptVal = 10;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexHyperlink:
            nScriptVal = 11;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexLight1:
            nScriptVal = 12;
            break;
        case EWmlColorSchemeIndex.wmlcolorschemeindexLight2:
            nScriptVal = 13;
            break;
        }
        this.Document.clrSchemeMap.color_map[nScriptType] = nScriptVal;
    };
}
function Get_TableOffsetCorrection(tbl) {
    var X = 0;
    var Row = tbl.Content[0];
    var Cell = Row.Get_Cell(0);
    var Margins = Cell.Get_Margins();
    var CellSpacing = Row.Get_CellSpacing();
    if (null != CellSpacing) {
        var TableBorder_Left = tbl.Get_Borders().Left;
        if (border_None != TableBorder_Left.Value) {
            X += TableBorder_Left.Size / 2;
        }
        X += CellSpacing;
        var CellBorder_Left = Cell.Get_Borders().Left;
        if (border_None != CellBorder_Left.Value) {
            X += CellBorder_Left.Size;
        }
        X += Margins.Left.W;
    } else {
        var TableBorder_Left = tbl.Get_Borders().Left;
        var CellBorder_Left = Cell.Get_Borders().Left;
        var Result_Border = tbl.Internal_CompareBorders(TableBorder_Left, CellBorder_Left, true, false);
        if (border_None != Result_Border.Value) {
            X += Math.max(Result_Border.Size / 2, Margins.Left.W);
        } else {
            X += Margins.Left.W;
        }
    }
    return -X;
}
function CFontCharMap() {
    this.Name = "";
    this.Id = "";
    this.FaceIndex = -1;
    this.IsEmbedded = false;
    this.CharArray = {};
}
function CFontsCharMap() {
    this.CurrentFontName = "";
    this.CurrentFontInfo = null;
    this.map_fonts = {};
}
CFontsCharMap.prototype = {
    StartWork: function () {},
    EndWork: function () {
        var mem = new CMemory();
        mem.Init();
        for (var i in this.map_fonts) {
            var _font = this.map_fonts[i];
            mem.WriteByte(240);
            mem.WriteByte(250);
            mem.WriteByte(0);
            mem.WriteString2(_font.Name);
            mem.WriteByte(1);
            mem.WriteString2(_font.Id);
            mem.WriteByte(2);
            mem.WriteString2(_font.FaceIndex);
            mem.WriteByte(3);
            mem.WriteBool(_font.IsEmbedded);
            mem.WriteByte(251);
            mem.WriteByte(0);
            var _pos = mem.pos;
            var _len = 0;
            for (var c in _font.CharArray) {
                mem.WriteLong(parseInt(c));
                _len++;
            }
            var _new_pos = mem.pos;
            mem.pos = _pos;
            mem.WriteLong(_len);
            mem.pos = _new_pos;
            mem.WriteByte(241);
        }
        return mem.GetBase64Memory();
    },
    StartFont: function (family, bold, italic, size) {
        var font_info = g_fontApplication.GetFontInfo(family);
        var bItalic = (true === italic);
        var bBold = (true === bold);
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!bItalic && bBold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (bItalic && !bBold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (bItalic && bBold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        var _id = font_info.GetFontID(window.g_font_loader, oFontStyle);
        var _find_index = _id.id + "_teamlab_" + _id.faceIndex;
        if (this.CurrentFontName != _find_index) {
            var _find = this.map_fonts[_find_index];
            if (_find !== undefined) {
                this.CurrentFontInfo = _find;
            } else {
                _find = new CFontCharMap();
                _find.Name = family;
                _find.Id = _id.id;
                _find.FaceIndex = _id.faceIndex;
                _find.IsEmbedded = (font_info.type == FONT_TYPE_EMBEDDED);
                this.CurrentFontInfo = _find;
                this.map_fonts[_find_index] = _find;
            }
            this.CurrentFontName = _find_index;
        }
    },
    AddChar: function (char1) {
        var _find = "" + char1.charCodeAt(0);
        var map_ind = this.CurrentFontInfo.CharArray[_find];
        if (map_ind === undefined) {
            this.CurrentFontInfo.CharArray[_find] = true;
        }
    },
    AddChar2: function (char2) {
        var _find = "" + char2.charCodeAt(0);
        var map_ind = this.CurrentFontInfo.CharArray[_find];
        if (map_ind === undefined) {
            this.CurrentFontInfo.CharArray[_find] = true;
        }
    }
};
function OpenParStruct(oContainer, Content, paragraph) {
    this.DocContent = Content;
    this.paragraph = paragraph;
    this.cur = {
        pos: 0,
        elem: oContainer
    };
    this.stack = [this.cur];
}
OpenParStruct.prototype = {
    _addToContent: function (elem, pos, oItem) {
        if (elem.Internal_Content_Add) {
            elem.Internal_Content_Add(pos, oItem, false);
            pos++;
        } else {
            if (elem.Add_ToContent) {
                elem.Add_ToContent(pos, oItem, false);
                pos++;
            }
        }
        return pos;
    },
    _GetFromContent: function (elem, nIndex) {
        return elem.Content[nIndex];
    },
    _GetContentLength: function (elem) {
        return elem.Content.length;
    },
    _removeFromContent: function (elem, pos, count) {
        if (elem.Remove_FromContent) {
            elem.Remove_FromContent(pos, count);
        }
    },
    addToContent: function (oItem) {
        this.cur.pos = this._addToContent(this.cur.elem, this.cur.pos, oItem);
    },
    GetFromContent: function (nIndex) {
        return this._GetFromContent(this.cur.elem, nIndex);
    },
    GetContentLength: function () {
        return this._GetContentLength(this.cur.elem);
    },
    addElem: function (oElem) {
        this.cur = {
            pos: 0,
            elem: oElem
        };
        this.stack.push(this.cur);
    },
    commitElem: function () {
        var bRes = false;
        if (this.stack.length > 1) {
            var oPrevElem = this.stack.pop();
            this.cur = this.stack[this.stack.length - 1];
            if (oPrevElem.elem.Content && oPrevElem.elem.Content.length > 0) {
                this.addToContent(oPrevElem.elem);
            }
            bRes = true;
        }
        return bRes;
    },
    commitAll: function () {
        while (this.commitElem()) {}
    }
};