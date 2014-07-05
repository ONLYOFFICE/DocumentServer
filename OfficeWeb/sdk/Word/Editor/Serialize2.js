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
 var c_oSerFormat = {
    Version: 4,
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
    FramePr: 30
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
    LangEA: 27
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
    setting: 2
};
var c_oSerProp_secPrSettingsType = {
    titlePg: 0,
    EvenAndOddHeaders: 1
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
    OMath: 9
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
    _LastRun: 13
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
    ChartImg: 24
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
var c_oSerBorderType = {
    Color: 0,
    Space: 1,
    Size: 2,
    Value: 3
};
var c_oSerShdType = {
    Value: 0,
    Color: 1
};
var c_oSerPaddingType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3
};
var c_oSerMarginsType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3
};
var c_oSerBordersType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3,
    insideV: 4,
    insideH: 5,
    start: 6,
    end: 7,
    tl2br: 8,
    tr2bl: 9,
    bar: 10,
    between: 11
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
    CGp: 5,
    CGpRule: 6,
    Chr: 7,
    Count: 8,
    CSp: 9,
    DegHide: 10,
    Diff: 11,
    EndChr: 12,
    Grow: 13,
    HideBot: 14,
    HideLeft: 15,
    HideRight: 16,
    HideTop: 17,
    MJc: 18,
    LimLoc: 19,
    Lit: 20,
    MaxDist: 21,
    McJc: 22,
    NoBreak: 23,
    Nor: 24,
    ObjDist: 25,
    OpEmu: 26,
    PlcHide: 27,
    Pos: 28,
    RSp: 29,
    RSpRule: 30,
    Scr: 31,
    SepChr: 32,
    Show: 33,
    Shp: 34,
    StrikeBLTR: 35,
    StrikeH: 36,
    StrikeTLBR: 37,
    StrikeV: 38,
    Sty: 39,
    SubHide: 40,
    SupHide: 41,
    Transp: 42,
    Type: 43,
    VertJc: 44,
    ZeroAsc: 45,
    ZeroDesc: 46,
    ZeroWid: 47
};
var c_oSer_OMathBottomNodesValType = {
    Val: 0,
    AlnAt: 1
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
    Brk: 9,
    CtrlPr: 10,
    Delimiter: 11,
    DelimiterPr: 12,
    EqArr: 13,
    EqArrPr: 14,
    Fraction: 15,
    FPr: 16,
    Func: 17,
    FuncPr: 18,
    GroupChr: 19,
    GroupChrPr: 20,
    LimLow: 21,
    LimLowPr: 22,
    LimUpp: 23,
    LimUppPr: 24,
    Matrix: 25,
    MathPr: 26,
    Mc: 27,
    McPr: 28,
    Mcs: 29,
    MPr: 30,
    Mr: 31,
    Nary: 32,
    NaryPr: 33,
    OMathPara: 34,
    OMathParaPr: 35,
    Phant: 36,
    PhantPr: 37,
    MRun: 38,
    Rad: 39,
    RadPr: 40,
    MRPr: 41,
    SPre: 42,
    SPrePr: 43,
    SSub: 44,
    SSubPr: 45,
    SSubSup: 46,
    SSubSupPr: 47,
    SSup: 48,
    SSupPr: 49,
    MText: 50,
    Column: 51,
    Row: 52
};
var c_oSer_OMathArgNodesType = {
    Deg: 0,
    Den: 1,
    Element: 2,
    FName: 3,
    Lim: 4,
    Num: 5,
    OMath: 6,
    Sub: 7,
    Sup: 8
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
var g_nodeAttributeStart = 250;
var g_nodeAttributeEnd = 251;
var g_sErrorCharCountMessage = "g_sErrorCharCountMessage";
var g_nErrorCharCount = 30000;
var g_nErrorParagraphCount = 1000;
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
        var oMapCommentId = new Object();
        this.WriteTable(c_oSerTableTypes.Comments, new BinaryCommentsTableWriter(this.memory, this.Document, oMapCommentId));
        var oNumIdMap = new Object();
        this.WriteTable(c_oSerTableTypes.Numbering, new BinaryNumberingTableWriter(this.memory, this.Document, oNumIdMap));
        this.WriteTable(c_oSerTableTypes.Style, new BinaryStyleTableWriter(this.memory, this.Document, oNumIdMap));
        this.WriteTable(c_oSerTableTypes.HdrFtr, new BinaryHeaderFooterTableWriter(this.memory, this.Document, oNumIdMap));
        this.WriteTable(c_oSerTableTypes.Document, new BinaryDocumentTableWriter(this.memory, this.Document, oMapCommentId, oNumIdMap, null));
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
        this.copyParams.oUsedNumIdMap = new Object();
        this.copyParams.nNumIdIndex = 1;
        this.copyParams.oUsedStyleMap = new Object();
        this.copyParams.bdtw = new BinaryDocumentTableWriter(this.memory, this.Document, null, this.copyParams.oUsedNumIdMap, this.copyParams);
        this.copyParams.nDocumentWriterTablePos = 0;
        this.copyParams.nDocumentWriterPos = 0;
        this.WriteMainTableStart();
        this.copyParams.nDocumentWriterTablePos = this.WriteTableStart(c_oSerTableTypes.Document);
        this.copyParams.nDocumentWriterPos = this.bs.WriteItemWithLengthStart();
    };
    this.CopyParagraph = function (Item) {
        if (this.copyParams.bLockCopyElems > 0) {
            return;
        }
        var oThis = this;
        this.bs.WriteItem(c_oSerParType.Par, function () {
            oThis.copyParams.bdtw.WriteParapraph(Item, true);
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
        this.WriteTable(c_oSerTableTypes.Numbering, new BinaryNumberingTableWriter(this.memory, this.Document, new Object(), this.copyParams.oUsedNumIdMap));
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
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap);
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
        for (styleId in oStyleToWrite) {
            var style = styles[styleId];
            var bDefault = false;
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
        var aTblStylePr = new Array();
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
                type: ETblStyleOverrideType.tblstyleoverridetypeNeCell,
                val: style.TableTLCell
            });
        }
        if (null != style.TableTRCell) {
            aTblStylePr.push({
                type: ETblStyleOverrideType.tblstyleoverridetypeNwCell,
                val: style.TableTRCell
            });
        }
        if (null != style.TableBLCell) {
            aTblStylePr.push({
                type: ETblStyleOverrideType.tblstyleoverridetypeSeCell,
                val: style.TableBLCell
            });
        }
        if (null != style.TableBRCell) {
            aTblStylePr.push({
                type: ETblStyleOverrideType.tblstyleoverridetypeSwCell,
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
function Binary_pPrWriter(memory, oNumIdMap) {
    this.memory = memory;
    this.oNumIdMap = oNumIdMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.Write_pPr = function (pPr, pPr_rPr) {
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
            this.memory.WriteByte(c_oSer_FramePrType.Wrap);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(oFramePr.Wrap);
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
}
function Binary_rPrWriter(memory) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write_rPr = function (rPr) {
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
        if (null != rPr.Color) {
            this.bs.WriteColor(c_oSerProp_rPrType.Color, rPr.Color);
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
    };
}
function Binary_tblPrWriter(memory, oNumIdMap) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap);
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
function BinaryHeaderFooterTableWriter(memory, doc, oNumIdMap) {
    this.memory = memory;
    this.Document = doc;
    this.oNumIdMap = oNumIdMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteHeaderFooterContent();
        });
    };
    this.WriteHeaderFooterContent = function () {
        var oThis = this;
        var oHeader = null;
        var oFooter = null;
        if (this.Document.HdrFtr && this.Document.HdrFtr.Content && this.Document.HdrFtr.Content.length > 0 && this.Document.HdrFtr.Content[0].Header) {
            oHeader = this.Document.HdrFtr.Content[0].Header;
        }
        if (this.Document.HdrFtr && this.Document.HdrFtr.Content && this.Document.HdrFtr.Content.length > 0 && this.Document.HdrFtr.Content[0].Footer) {
            oFooter = this.Document.HdrFtr.Content[0].Footer;
        }
        if (null != oHeader) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.Header, function () {
                oThis.WriteHdrFtrContent(oHeader);
            });
        }
        if (null != oFooter) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.Footer, function () {
                oThis.WriteHdrFtrContent(oFooter);
            });
        }
    };
    this.WriteHdrFtrContent = function (oHdrFtr) {
        var oThis = this;
        if (null != oHdrFtr.Odd) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_Odd, function () {
                oThis.WriteHdrFtrItem(oHdrFtr.Odd);
            });
        }
        if (null != oHdrFtr.Even && oHdrFtr.Odd !== oHdrFtr.Even) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_Even, function () {
                oThis.WriteHdrFtrItem(oHdrFtr.Even);
            });
        }
        if (null != oHdrFtr.First && oHdrFtr.Odd != oHdrFtr.First && oHdrFtr.Even != oHdrFtr.First) {
            this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_First, function () {
                oThis.WriteHdrFtrItem(oHdrFtr.First);
            });
        }
    };
    this.WriteHdrFtrItem = function (item) {
        var oThis = this;
        this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_Y, function () {
            oThis.memory.WriteDouble(item.BoundY);
        });
        this.bs.WriteItem(c_oSerHdrFtrTypes.HdrFtr_Y2, function () {
            oThis.memory.WriteDouble(item.BoundY2);
        });
        var dtw = new BinaryDocumentTableWriter(this.memory, this.Document, null, this.oNumIdMap, null);
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
    this.bpPrs = new Binary_pPrWriter(this.memory, null != this.oUsedNumIdMap ? this.oUsedNumIdMap : this.oNumIdMap);
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
            for (i in this.oUsedNumIdMap) {
                this.bs.WriteItem(c_oSerNumTypes.Num, function () {
                    oThis.WriteNum(i, oThis.oUsedNumIdMap[i] - 1);
                });
            }
        } else {
            for (i in nums) {
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
            for (i in this.oUsedNumIdMap) {
                var num = nums[i];
                if (null != num) {
                    this.bs.WriteItem(c_oSerNumTypes.AbstractNum, function () {
                        oThis.WriteAbstractNum(num, oThis.oUsedNumIdMap[i] - 1);
                    });
                }
            }
        } else {
            for (i in nums) {
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
function BinaryDocumentTableWriter(memory, doc, oMapCommentId, oNumIdMap, copyParams) {
    this.memory = memory;
    this.Document = doc;
    this.oNumIdMap = oNumIdMap;
    this.bs = new BinaryCommonWriter(this.memory);
    this.btblPrs = new Binary_tblPrWriter(this.memory, oNumIdMap);
    this.bpPrs = new Binary_pPrWriter(this.memory, oNumIdMap);
    this.brPrs = new Binary_rPrWriter(this.memory);
    this.sCurText = "";
    this.oCur_rPr = null;
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
                oThis.WriteSectPr();
            });
        }
    };
    this.WriteParapraph = function (par, bUseSelection) {
        var oThis = this;
        var ParaStart = 0;
        var ParaEnd = par.Content.length - 1;
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
        if (true == bUseSelection) {
            ParaStart = par.Selection.StartPos;
            ParaEnd = par.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        var ParaStyle = par.Style_Get();
        var pPr = par.Pr;
        if (null != pPr || null != ParaStyle || pPr_rPr) {
            if (null == pPr) {
                pPr = new Object();
            }
            var pPr_rPr = null;
            var propCount = 0;
            for (prop in par.TextPr.Value) {
                if (par.TextPr.Value.hasOwnProperty(prop)) {
                    pPr_rPr = par.TextPr.Value;
                    break;
                }
            }
            this.memory.WriteByte(c_oSerParType.pPr);
            this.bs.WriteItemWithLength(function () {
                oThis.bpPrs.Write_pPr(pPr, pPr_rPr);
            });
        }
        if (null != par.Content) {
            this.memory.WriteByte(c_oSerParType.Content);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteParagraphContent(par, ParaStart, ParaEnd, bUseSelection);
            });
        }
    };
    this.WriteParagraphContent = function (par, ParaStart, ParaEnd, bUseSelection) {
        var Content = par.Content;
        this.oCur_rPr = null;
        this.sCurText = "";
        var oThis = this;
        var bExistHyperlink = false;
        if (bUseSelection && ParaStart > 0) {
            for (var i = ParaStart - 1; i >= 0; --i) {
                var item = Content[i];
                if (para_HyperlinkStart == item.Type) {
                    this.WriteText();
                    var sField = 'HYPERLINK "' + item.Value.replace(/"/g, '\\"') + '"';
                    if (null != item.ToolTip) {
                        sField += ' \\o "' + item.ToolTip.replace(/"/g, '\\"') + '"';
                    }
                    this.WriteRun(function () {
                        oThis.memory.WriteByte(c_oSerRunType.fldstart);
                        oThis.memory.WriteString2(sField);
                    });
                    bExistHyperlink = true;
                    break;
                } else {
                    if (para_HyperlinkEnd == item.Type) {
                        break;
                    }
                }
            }
        }
        for (var i = ParaStart; i < ParaEnd; ++i) {
            var item = Content[i];
            if (bUseSelection && ParaStart == i && para_TextPr != item.Type) {
                var oFindObj = par.Internal_FindBackward(ParaStart, [para_TextPr]);
                if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                    this.oCur_rPr = par.Content[oFindObj.LetterPos].Value;
                }
            }
            switch (item.Type) {
            case para_Text:
                this.sCurText += item.Value;
                break;
            case para_Space:
                this.sCurText += " ";
                break;
            case para_Tab:
                this.WriteText();
                this.WriteRun(function () {
                    oThis.memory.WriteByte(c_oSerRunType.tab);
                    oThis.memory.WriteLong(c_oSerPropLenType.Null);
                });
                break;
            case para_PageNum:
                this.WriteText();
                this.WriteRun(function () {
                    oThis.memory.WriteByte(c_oSerRunType.pagenum);
                    oThis.memory.WriteLong(c_oSerPropLenType.Null);
                });
                break;
            case para_NewLine:
                this.WriteText();
                this.WriteRun(function () {
                    if (break_Page == item.BreakType) {
                        oThis.memory.WriteByte(c_oSerRunType.pagebreak);
                    } else {
                        oThis.memory.WriteByte(c_oSerRunType.linebreak);
                    }
                    oThis.memory.WriteLong(c_oSerPropLenType.Null);
                });
                break;
            case para_TextPr:
                this.WriteText();
                this.oCur_rPr = item.Value;
                break;
            case para_Drawing:
                this.WriteText();
                this.WriteRun(function () {
                    if (item.Extent && item.GraphicObj && item.GraphicObj.spPr && item.GraphicObj.spPr.xfrm) {
                        item.Extent.W = item.GraphicObj.spPr.xfrm.extX;
                        item.Extent.H = item.GraphicObj.spPr.xfrm.extY;
                    }
                    oThis.bs.WriteItem(c_oSerRunType.pptxDrawing, function () {
                        oThis.WriteImage(item);
                    });
                });
                break;
            case para_HyperlinkStart:
                this.WriteText();
                var sField = 'HYPERLINK "' + item.Value.replace(/"/g, '\\"') + '"';
                if (null != item.ToolTip) {
                    sField += ' \\o "' + item.ToolTip.replace(/"/g, '\\"') + '"';
                }
                this.WriteRun(function () {
                    oThis.memory.WriteByte(c_oSerRunType.fldstart);
                    oThis.memory.WriteString2(sField);
                });
                bExistHyperlink = true;
                break;
            case para_HyperlinkEnd:
                this.WriteText();
                this.WriteRun(function () {
                    oThis.memory.WriteByte(c_oSerRunType.fldend);
                    oThis.memory.WriteLong(c_oSerPropLenType.Null);
                });
                bExistHyperlink = false;
                break;
            case para_CommentStart:
                if (null != this.oMapCommentId) {
                    var commentId = this.oMapCommentId[item.Id];
                    if (null != commentId) {
                        this.WriteText();
                        this.bs.WriteItem(c_oSerParType.CommentStart, function () {
                            oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                oThis.memory.WriteLong(commentId);
                            });
                        });
                    }
                }
                break;
            case para_CommentEnd:
                if (null != this.oMapCommentId) {
                    var commentId = this.oMapCommentId[item.Id];
                    if (null != commentId) {
                        this.WriteText();
                        this.bs.WriteItem(c_oSerParType.CommentEnd, function () {
                            oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                oThis.memory.WriteLong(commentId);
                            });
                        });
                        this.WriteRun(function () {
                            oThis.bs.WriteItem(c_oSerRunType.CommentReference, function () {
                                oThis.bs.WriteItem(c_oSer_CommentsType.Id, function () {
                                    oThis.memory.WriteLong(commentId);
                                });
                            });
                        });
                    }
                }
                break;
            }
        }
        this.WriteText();
        if (bExistHyperlink) {
            this.WriteRun(function () {
                oThis.memory.WriteByte(c_oSerRunType.fldend);
                oThis.memory.WriteLong(c_oSerPropLenType.Null);
            });
        }
        if (bUseSelection && ParaEnd < Content.length - 1) {
            this.oCur_rPr = null;
            this.WriteRun(function () {
                oThis.memory.WriteByte(c_oSerRunType._LastRun);
                oThis.memory.WriteLong(c_oSerPropLenType.Null);
            });
        }
    };
    this.WriteMathArg = function (oOMath) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oOMath.content.length - 1;
        for (var i = nStart; i <= nEnd; i++) {
            var item = oOMath.content[i];
            switch (item.value) {
            case "CAccent":
                this.bs.WriteItem(c_oSer_OMathContentType.Acc, function () {
                    oThis.WriteMathAcc(item);
                });
                break;
            case "ArgPr":
                this.bs.WriteItem(c_oSer_OMathContentType.ArgPr, function () {
                    oThis.WriteMathArgPr(item);
                });
                break;
            case "CBar":
                this.bs.WriteItem(c_oSer_OMathContentType.Bar, function () {
                    oThis.WriteMathBar(item);
                });
                break;
            case "CBorderBox":
                this.bs.WriteItem(c_oSer_OMathContentType.BorderBox, function () {
                    oThis.WriteMathBorderBox(item);
                });
                break;
            case "CBox":
                this.bs.WriteItem(c_oSer_OMathContentType.Box, function () {
                    oThis.WriteMathBox(item);
                });
                break;
            case "CCtrlPr":
                this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                    oThis.WriteMathCtrlPr(item);
                });
                break;
            case "CDelimiter":
                this.bs.WriteItem(c_oSer_OMathContentType.Delimiter, function () {
                    oThis.WriteMathDelimiter(item);
                });
                break;
            case "CEqArr":
                this.bs.WriteItem(c_oSer_OMathContentType.EqArr, function () {
                    oThis.WriteMathEqArr(item);
                });
                break;
            case "CFraction":
                this.bs.WriteItem(c_oSer_OMathContentType.Fraction, function () {
                    oThis.WriteMathFraction(item);
                });
                break;
            case "CMathFunc":
                this.bs.WriteItem(c_oSer_OMathContentType.Func, function () {
                    oThis.WriteMathFunc(item);
                });
                break;
            case "CGroupCharacter":
                this.bs.WriteItem(c_oSer_OMathContentType.GroupChr, function () {
                    oThis.WriteMathGroupChr(item);
                });
                break;
            case "CLimit":
                if (LIMIT_LOW == item.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.LimLow, function () {
                        oThis.WriteMathLimLow(item);
                    });
                } else {
                    if (LIMIT_UP == item.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.LimUpp, function () {
                            oThis.WriteMathLimUpp(item);
                        });
                    }
                }
                break;
            case "CMatrix":
                this.bs.WriteItem(c_oSer_OMathContentType.Matrix, function () {
                    oThis.WriteMathMatrix(item);
                });
                break;
            case "CNary":
                this.bs.WriteItem(c_oSer_OMathContentType.Nary, function () {
                    oThis.WriteMathNary(item);
                });
                break;
            case "OMath":
                this.bs.WriteItem(c_oSer_OMathArgNodesType.OMath, function () {
                    oThis.WriteMathArg(item);
                });
                break;
            case "OMathPara":
                this.bs.WriteItem(c_oSer_OMathContentType.OMathPara, function () {
                    oThis.WriteMathOMathPara(item);
                });
                break;
            case "CPhant":
                this.bs.WriteItem(c_oSer_OMathContentType.Phant, function () {
                    oThis.WriteMathPhant(item);
                });
                break;
            case "MRun":
                this.bs.WriteItem(c_oSer_OMathContentType.MRun, function () {
                    oThis.WriteMathMRun(item);
                });
                break;
            case "CRadical":
                this.bs.WriteItem(c_oSer_OMathContentType.Rad, function () {
                    oThis.WriteMathRad(item);
                });
                break;
            case "CDegreeSubSup":
                if (DEGREE_PreSubSup == item.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.SPre, function () {
                        oThis.WriteMathSPre(item);
                    });
                } else {
                    if (DEGREE_SubSup == item.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.SSubSup, function () {
                            oThis.WriteMathSSubSup(item);
                        });
                    }
                }
                break;
            case "CDegree":
                if (DEGREE_SUBSCRIPT == item.type) {
                    this.bs.WriteItem(c_oSer_OMathContentType.SSub, function () {
                        oThis.WriteMathSSub(item);
                    });
                } else {
                    if (DEGREE_SUPERSCRIPT == item.type) {
                        this.bs.WriteItem(c_oSer_OMathContentType.SSup, function () {
                            oThis.WriteMathSSup(item);
                        });
                    }
                }
                break;
            default:
                break;
            }
        }
    };
    this.WriteMathAcc = function (oAcc) {
        var oThis = this;
        var oElem = oAcc.getBase();
        if (null != oAcc.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.AccPr, function () {
                oThis.WriteMathAccPr(oAcc.props, oAcc);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathAccPr = function (props, oAcc) {
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteMathChr(props.chr);
            });
        }
        if (null != oAcc.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oAcc);
            });
        }
    };
    this.WriteMathAln = function (Aln) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Aln);
    };
    this.WriteMathAlnScr = function (AlnScr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(AlnScr);
    };
    this.WriteMathArgPr = function (oArgPr) {
        if (null != oArgPr.argSz) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ArgSz, function () {
                oThis.WriteMathArgSz(oArgPr.argSz);
            });
        }
    };
    this.WriteMathArgSz = function (ArgSz) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(ArgSz);
    };
    this.WriteMathBar = function (oBar) {
        var oThis = this;
        var oElem = oBar.getBase();
        if (null != oBar.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.BarPr, function () {
                oThis.WriteMathBarPr(oBar.props, oBar);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathBarPr = function (props, oBar) {
        if (null != props.pos) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Pos, function () {
                oThis.WriteMathPos(props.pos);
            });
        }
        if (null != oBar.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oBar);
            });
        }
    };
    this.WriteMathBaseJc = function (BaseJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(BaseJc);
    };
    this.WriteMathBegChr = function (BegChr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(BegChr);
    };
    this.WriteMathBorderBox = function (oBorderBox) {
        var oThis = this;
        var oElem = oBorderBox.getBase();
        if (null != oBorderBox.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.BorderBoxPr, function () {
                oThis.WriteMathBorderBoxPr(oBorderBox.props, oBorderBox);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathBorderBoxPr = function (props, oBorderBox) {
        if (null != props.hideBot) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideBot, function () {
                oThis.WriteMathHideBot(props.hideBot);
            });
        }
        if (null != props.hideLeft) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideLeft, function () {
                oThis.WriteMathHideLeft(props.hideLeft);
            });
        }
        if (null != props.hideRight) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideRight, function () {
                oThis.WriteMathHideRight(props.hideRight);
            });
        }
        if (null != props.hideTop) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.HideTop, function () {
                oThis.WriteMathHideTop(props.hideTop);
            });
        }
        if (null != props.strikeBLTR) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeBLTR, function () {
                oThis.WriteMathStrikeBLTR(props.strikeBLTR);
            });
        }
        if (null != props.strikeH) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeH, function () {
                oThis.WriteMathStrikeH(props.strikeH);
            });
        }
        if (null != props.strikeTLBR) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeTLBR, function () {
                oThis.WriteMathStrikeTLBR(props.strikeTLBR);
            });
        }
        if (null != props.strikeV) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.StrikeV, function () {
                oThis.WriteMathStrikeV(props.strikeV);
            });
        }
        if (null != oBorderBox.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oBorderBox);
            });
        }
    };
    this.WriteMathBox = function (oBox) {
        var oThis = this;
        var oElem = oBox.getBase();
        if (null != oBox.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.BorderBoxPr, function () {
                oThis.WriteMathBoxPr(oBox.props, oBox);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathBoxPr = function (props, oBox) {
        if (null != props.aln) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Aln, function () {
                oThis.WriteMathAln(props.aln);
            });
        }
        if (null != props.brk) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Brk, function () {
                oThis.WriteMathBrk(props.brk);
            });
        }
        if (null != props.diff) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Diff, function () {
                oThis.WriteMathDiff(props.diff);
            });
        }
        if (null != props.noBreak) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.NoBreak, function () {
                oThis.WriteMathNoBreak(props.noBreak);
            });
        }
        if (null != props.opEmu) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.OpEmu, function () {
                oThis.WriteMathOpEmu(props.opEmu);
            });
        }
        if (null != oBox.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oBox);
            });
        }
    };
    this.WriteMathBrk = function (Brk) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.AlnAt);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(Brk);
    };
    this.WriteMathCGp = function (CGp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(CGp);
    };
    this.WriteMathCGpRule = function (CGpRule) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(CGpRule);
    };
    this.WriteMathChr = function (Chr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(Chr);
    };
    this.WriteMathCSp = function (CSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(CSp);
    };
    this.WriteMathCtrlPr = function (oElem) {
        if (null != oElem.TxtPrp) {
            this.bs.WriteItem(c_oSerRunType.rPr, function () {
                oThis.brPrs.Write_rPr(oElem.TxtPrp);
            });
        }
    };
    this.WriteMathDegHide = function (DegHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(DegHide);
    };
    this.WriteMathDiff = function (Diff) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Diff);
    };
    this.WriteMathDelimiter = function (oDelimiter) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oDelimiter.elements.length;
        if (null != oDelimiter.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.DelimiterPr, function () {
                oThis.WriteMathDelimiterPr(oDelimiter.props, oDelimiter);
            });
        }
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oDelimiter.getBase(i);
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathDelimiterPr = function (props, oDelimiter) {
        if (null != props.begChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BegChr, function () {
                oThis.WriteMathBegChr(props.begChr);
            });
        }
        if (null != props.endChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.EndChr, function () {
                oThis.WriteMathEndChr(props.endChr);
            });
        }
        if (null != props.grow) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Grow, function () {
                oThis.WriteMathGrow(props.grow);
            });
        }
        if (null != props.sepChr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SepChr, function () {
                oThis.WriteMathSepChr(props.sepChr);
            });
        }
        if (null != props.shp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Shp, function () {
                oThis.WriteMathShp(props.shp);
            });
        }
        if (null != oDelimiter.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oDelimiter);
            });
        }
    };
    this.WriteMathEndChr = function (EndChr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(EndChr);
    };
    this.WriteMathEqArr = function (oEqArr) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oEqArr.elements.length;
        if (null != oEqArr.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.EqArrPr, function () {
                oThis.WriteMathEqArrPr(oEqArr.props, oEqArr);
            });
        }
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oEqArr.getBase(i);
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathEqArrPr = function (props, oEqArr) {
        if (null != props.baseJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BaseJc, function () {
                oThis.WriteMathBaseJc(props.baseJc);
            });
        }
        if (null != props.maxDist) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.MaxDist, function () {
                oThis.WriteMathMaxDist(props.maxDist);
            });
        }
        if (null != props.objDist) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ObjDist, function () {
                oThis.WriteMathObjDist(props.objDist);
            });
        }
        if (null != props.rSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSp, function () {
                oThis.WriteMathRSp(props.rSp);
            });
        }
        if (null != props.rSpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSpRule, function () {
                oThis.WriteMathRSpRule(props.rSpRule);
            });
        }
        if (null != oEqArr.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oEqArr);
            });
        }
    };
    this.WriteMathFraction = function (oFraction) {
        var oThis = this;
        var oDen = oFraction.getDenominator();
        var oNum = oFraction.getNumerator();
        if (null != oFraction.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.FPr, function () {
                oThis.WriteMathFPr(oFraction.props, oFraction);
            });
        }
        if (null != oDen) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Den, function () {
                oThis.WriteMathArgNodes(oDen);
            });
        }
        if (null != oNum) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Num, function () {
                oThis.WriteMathArgNodes(oNum);
            });
        }
    };
    this.WriteMathFPr = function (props, oFraction) {
        if (null != props.type) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Type, function () {
                oThis.WriteMathType(props.type);
            });
        }
        if (null != oEqArr.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oEqArr);
            });
        }
    };
    this.WriteMathFunc = function (oFunc) {
        var oThis = this;
        var oFName = oFunc.getFName();
        var oElem = oFunc.getArgument();
        if (null != oFunc.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.FPr, function () {
                oThis.WriteMathFuncPr(oFunc.props, oFunc);
            });
        }
        if (null != oFName) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.FName, function () {
                oThis.WriteMathArgNodes(oFName);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathFuncPr = function (props, oFunc) {
        if (null != oFunc.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oFunc);
            });
        }
    };
    this.WriteMathGroupChr = function (oGroupChr) {
        var oThis = this;
        var oElem = oGroupChr.getArgument();
        if (null != oGroupChr.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.GroupChrPr, function () {
                oThis.WriteMathGroupChrPr(oBox.props, oGroupChr);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathGroupChrPr = function (props, oGroupChr) {
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteMathChr(props.chr);
            });
        }
        if (null != props.pos) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Pos, function () {
                oThis.WriteMathPos(props.pos);
            });
        }
        if (null != props.vertJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.VertJc, function () {
                oThis.WriteMathVertJc(props.vertJc);
            });
        }
        if (null != oEqArr.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oEqArr);
            });
        }
    };
    this.WriteMathGrow = function (Grow) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Grow);
    };
    this.WriteMathHideBot = function (HideBot) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(HideBot);
    };
    this.WriteMathHideLeft = function (HideLeft) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(HideLeft);
    };
    this.WriteMathHideRight = function (HideRight) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(HideRight);
    };
    this.WriteMathHideTop = function (HideTop) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(HideTop);
    };
    this.WriteMathMJc = function (MJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(MJc);
    };
    this.WriteMathLimLoc = function (LimLoc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(LimLoc);
    };
    this.WriteMathLimLow = function (oLimLow) {
        var oThis = this;
        var oElem = oLimLow.getFName();
        var oLim = oLimLow.getIterator();
        if (null != oLimLow.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.LimLowPr, function () {
                oThis.WriteMathLimLowPr(oLimLow.props, oLimLow);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
        if (null != oLim) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Lim, function () {
                oThis.WriteMathArgNodes(oLim);
            });
        }
    };
    this.WriteMathLimLowPr = function (props, oLimLow) {
        if (null != oLimLow.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oLimLow);
            });
        }
    };
    this.WriteMathLimUpp = function (oLimUpp) {
        var oThis = this;
        var oElem = oLimUpp.getFName();
        var oLim = oLimUpp.getIterator();
        if (null != oLimUpp.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.LimUppPr, function () {
                oThis.WriteMathLimUppPr(oLimUpp.props, oLimUpp);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
        if (null != oLim) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Lim, function () {
                oThis.WriteMathArgNodes(oLim);
            });
        }
    };
    this.WriteMathLimUppPr = function (props, oLimUpp) {
        if (null != oLimUpp.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oLimUpp);
            });
        }
    };
    this.WriteMathLit = function (Lit) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Lit);
    };
    this.WriteMathMaxDist = function (MaxDist) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(MaxDist);
    };
    this.WriteMathMatrix = function (oMatrix) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oMatrix.props.row;
        if (null != oMatrix.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.EqArrPr, function () {
                oThis.WriteMathMPr(oMatrix.props, oMatrix);
            });
        }
        for (var i = nStart; i < nEnd; i++) {
            this.bs.WriteItem(c_oSer_OMathContentType.Mr, function () {
                oThis.WriteMathMr(oMatrix, i);
            });
        }
    };
    this.WriteMathMc = function (props) {
        this.bs.WriteItem(c_oSer_OMathContentType.McPr, function () {
            oThis.WriteMathMcPr(props);
        });
    };
    this.WriteMathMcPr = function (props) {
        if (null != props.mcJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.McJc, function () {
                oThis.WriteMathMcJc(props.mcJc);
            });
        }
        if (null != props.column) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Count, function () {
                oThis.WriteMathCount(props.column);
            });
        }
    };
    this.WriteMathMcs = function (props) {
        this.bs.WriteItem(c_oSer_OMathContentType.Mc, function () {
            oThis.WriteMathMc(props);
        });
    };
    this.WriteMathMPr = function (props, oMatrix) {
        if (null != props.baseJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.BaseJc, function () {
                oThis.WriteMathBaseJc(props.baseJc);
            });
        }
        if (null != props.cGp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CGp, function () {
                oThis.WriteMathCGp(props.cGp);
            });
        }
        if (null != props.cGpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CGpRule, function () {
                oThis.WriteMathCGpRule(props.cGpRule);
            });
        }
        if (null != props.cSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.CSp, function () {
                oThis.WriteMathCSp(props.cSp);
            });
        }
        if (null != props.column || null != props.mcJc) {
            this.bs.WriteItem(c_oSer_OMathContentType.Mcs, function () {
                oThis.WriteMathMcs(props);
            });
        }
        if (null != props.plcHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.PlcHide, function () {
                oThis.WriteMathPlcHide(props.plcHide);
            });
        }
        if (null != props.rSp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSp, function () {
                oThis.WriteMathRSp(props.rSp);
            });
        }
        if (null != props.rSpRule) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.RSpRule, function () {
                oThis.WriteMathRSpRule(props.rSpRule);
            });
        }
        if (null != oNary.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oMatrix);
            });
        }
    };
    this.WriteMathMr = function (oMatrix, nRow) {
        var oThis = this;
        var nStart = 0;
        var nEnd = oMatrix.props.column;
        for (var i = nStart; i < nEnd; i++) {
            var oElem = oEqArr.getBase(nRow, i);
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathNary = function (oNary) {
        var oThis = this;
        var oElem = oNary.getBase();
        var oSub = oNary.getLowerIterator();
        var oSup = oNary.getUpperIterator();
        if (null != oNary.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.NaryPr, function () {
                oThis.WriteMathNaryPr(oNary.props, oNary);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
        if (null != oSub) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oSub);
            });
        }
        if (null != oSup) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oSup);
            });
        }
    };
    this.WriteMathNaryPr = function (props, oNary) {
        if (null != props.chr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Chr, function () {
                oThis.WriteMathChr(props.chr);
            });
        }
        if (null != props.grow) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Grow, function () {
                oThis.WriteMathGrow(props.grow);
            });
        }
        if (null != props.limLoc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.LimLoc, function () {
                oThis.WriteMathLimLoc(props.limLoc);
            });
        }
        if (null != props.subHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SubHide, function () {
                oThis.WriteMathSubHide(props.subHide);
            });
        }
        if (null != props.supHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.SupHide, function () {
                oThis.WriteMathSupHide(props.supHide);
            });
        }
        if (null != oNary.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oNary);
            });
        }
    };
    this.WriteMathNoBreak = function (NoBreak) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(NoBreak);
    };
    this.WriteMathNor = function (Nor) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Nor);
    };
    this.WriteMathObjDist = function (ObjDist) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ObjDist);
    };
    this.WriteMathOMathPara = function (oOMathPara) {
        var oThis = this;
        if (null != oOMathPara.Root) {
            oThis.bs.WriteItem(c_oSer_OMathArgNodesType.OMath, function () {
                oThis.WriteMathArg(oOMathPara.Root);
            });
        }
        if (null != oOMathPara.props) {
            oThis.bs.WriteItem(c_oSer_OMathContentType.OMathParaPr, function () {
                oThis.WriteMathOMathParaPr(oOMathPara.props);
            });
        }
    };
    this.WriteMathOMathParaPr = function (props) {
        if (null != props.mJc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.MJc, function () {
                oThis.WriteMathMJc(props.mJc);
            });
        }
    };
    this.WriteMathOpEmu = function (OpEmu) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(OpEmu);
    };
    this.WriteMathPhant = function (oPhant) {
        var oThis = this;
        var oElem = oPhant.getBase();
        if (null != oPhant.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.PhantPr, function () {
                oThis.WriteMathPhantPr(oPhant.props, oPhant);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathPhantPr = function (props, oPhant) {
        if (null != props.show) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Show, function () {
                oThis.WriteMathShow(props.show);
            });
        }
        if (null != props.transp) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Transp, function () {
                oThis.WriteMathTransp(props.transp);
            });
        }
        if (null != props.zeroAsc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroAsc, function () {
                oThis.WriteMathZeroAsc(props.zeroAsc);
            });
        }
        if (null != props.zeroDesc) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroDesc, function () {
                oThis.WriteMathZeroDesc(props.zeroDesc);
            });
        }
        if (null != props.zeroWid) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.ZeroWid, function () {
                oThis.WriteMathZeroWid(props.zeroWid);
            });
        }
        if (null != oPhant.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oPhant);
            });
        }
    };
    this.WriteMathPlcHide = function (PlcHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(PlcHide);
    };
    this.WriteMathPos = function (Pos) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Pos);
    };
    this.WriteMathMRun = function (oMRun) {
        var oThis = this;
        var oText = oMRun.GetText();
        if (null != oMRun.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.MRPr, function () {
                oThis.WriteMathMRPr(oMRun.props);
            });
        }
        if (null != oMRun.TxtPrp) {
            this.bs.WriteItem(c_oSerRunType.rPr, function () {
                oThis.brPrs.Write_rPr(oMRun.TxtPrp);
            });
        }
        if (null != oText) {
            this.bs.WriteItem(c_oSer_OMathContentType.MText, function () {
                oThis.memory.WriteString2(oText.toString());
            });
        }
    };
    this.WriteMathMRPr = function (props) {
        if (null != props.aln) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Aln, function () {
                oThis.WriteMathAln(props.aln);
            });
        }
        if (null != props.brk) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Brk, function () {
                oThis.WriteMathBrk(props.brk);
            });
        }
        if (null != props.lit) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Lit, function () {
                oThis.WriteMathLit(props.lit);
            });
        }
        if (null != props.nor) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Nor, function () {
                oThis.WriteMathNor(props.nor);
            });
        }
        if (null != props.scr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Scr, function () {
                oThis.WriteMathScr(props.scr);
            });
        }
        if (null != props.sty) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.Sty, function () {
                oThis.WriteMathSty(props.sty);
            });
        }
    };
    this.WriteMathRad = function (oRad) {
        var oThis = this;
        var oElem = oRad.getBase();
        var oDeg = oRad.getDegree();
        if (null != oRad.props) {
            this.bs.WriteItem(c_oSer_OMathContentType.RadPr, function () {
                oThis.WriteMathRadPr(oRad.props, oRad);
            });
        }
        if (null != oDeg) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Deg, function () {
                oThis.WriteMathArgNodes(oDeg);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathRadPr = function (props, oRad) {
        if (null != props.degHide) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.DegHide, function () {
                oThis.WriteMathDegHide(props.degHide);
            });
        }
        if (null != oRad.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oRad);
            });
        }
    };
    this.WriteMathRSp = function (RSp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(RSp);
    };
    this.WriteMathRSpRule = function (RSpRule) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(RSpRule);
    };
    this.WriteMathScr = function (Scr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Scr);
    };
    this.WriteMathSepChr = function (SepChr) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(SepChr);
    };
    this.WriteMathShow = function (Show) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Show);
    };
    this.WriteMathShp = function (Show) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Show);
    };
    this.WriteMathSPre = function (oSPre) {
        var oThis = this;
        var oSub = oSPre.getLowerIterator();
        var oSup = oSPre.getUpperIterator();
        var oElem = oSPre.getBase();
        if (null != oSPre) {
            this.bs.WriteItem(c_oSer_OMathContentType.SPrePr, function () {
                oThis.WriteMathSPrePr(oSPre);
            });
        }
        if (null != oSub) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sub, function () {
                oThis.WriteMathArgNodes(oSub);
            });
        }
        if (null != oSup) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sup, function () {
                oThis.WriteMathArgNodes(oSup);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathSPrePr = function (oSPre) {
        if (null != oSPre.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oSPre);
            });
        }
    };
    this.WriteMathSSub = function (oSSub) {
        var oThis = this;
        var oSub = oSSub.getLowerIterator();
        var oElem = oSSub.getBase();
        if (null != oSSub) {
            this.bs.WriteItem(c_oSer_OMathContentType.SSubPr, function () {
                oThis.WriteMathSSubPr(oSSub);
            });
        }
        if (null != oSub) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sub, function () {
                oThis.WriteMathArgNodes(oSub);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathSSubPr = function (oSSub) {
        if (null != oSSub.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oSSub);
            });
        }
    };
    this.WriteMathSubSup = function (oSSubSup) {
        var oThis = this;
        var oSub = oSSubSup.getLowerIterator();
        var oSup = oSSubSup.getUpperIterator();
        var oElem = oSSubSup.getBase();
        if (null != oSSubSup) {
            this.bs.WriteItem(c_oSer_OMathContentType.SSubPr, function () {
                oThis.WriteMathSSubSupPr(oSSubSup);
            });
        }
        if (null != oSub) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sub, function () {
                oThis.WriteMathArgNodes(oSub);
            });
        }
        if (null != oSup) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sup, function () {
                oThis.WriteMathArgNodes(oSup);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathSSubSupPr = function (oSSubSup) {
        if (null != props.alnScr) {
            this.bs.WriteItem(c_oSer_OMathBottomNodesType.AlnScr, function () {
                oThis.WriteMathAlnScr(props.alnScr);
            });
        }
        if (null != oSSubSup.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oSSubSup);
            });
        }
    };
    this.WriteMathSSup = function (oSSup) {
        var oThis = this;
        var oSup = oSSup.getUpperIterator()();
        var oElem = oSSup.getBase();
        if (null != oSSup) {
            this.bs.WriteItem(c_oSer_OMathContentType.SSupPr, function () {
                oThis.WriteMathSSupPr(oSSup);
            });
        }
        if (null != oSup) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Sup, function () {
                oThis.WriteMathArgNodes(oSup);
            });
        }
        if (null != oElem) {
            this.bs.WriteItem(c_oSer_OMathArgNodesType.Element, function () {
                oThis.WriteMathArgNodes(oElem);
            });
        }
    };
    this.WriteMathSSupPr = function (oSSup) {
        if (null != oSSup.TxtPrp) {
            this.bs.WriteItem(c_oSer_OMathContentType.CtrlPr, function () {
                oThis.WriteMathCtrlPr(oSSup);
            });
        }
    };
    this.WriteMathStrikeBLTR = function (StrikeBLTR) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(StrikeBLTR);
    };
    this.WriteMathStrikeH = function (StrikeH) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(StrikeH);
    };
    this.WriteMathStrikeTLBR = function (StrikeTLBR) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(StrikeTLBR);
    };
    this.WriteMathStrikeV = function (StrikeV) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(StrikeV);
    };
    this.WriteMathSty = function (Sty) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Sty);
    };
    this.WriteMathSubHide = function (SubHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(SubHide);
    };
    this.WriteMathSupHide = function (SupHide) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(SupHide);
    };
    this.WriteMathTransp = function (Transp) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(Transp);
    };
    this.WriteMathType = function (Type) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Type);
    };
    this.WriteMathVertJc = function (VertJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(VertJc);
    };
    this.WriteMathZeroAsc = function (ZeroAsc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroAsc);
    };
    this.WriteMathZeroDesc = function (ZeroDesc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroDesc);
    };
    this.WriteMathZeroWid = function (ZeroWid) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(ZeroWid);
    };
    this.WriteText = function () {
        if ("" != this.sCurText) {
            var oThis = this;
            this.WriteRun(function () {
                oThis.memory.WriteByte(c_oSerRunType.run);
                oThis.memory.WriteString2(oThis.sCurText.toString());
            });
            this.sCurText = "";
        }
    };
    this.WriteRun = function (writer) {
        var oThis = this;
        this.bs.WriteItem(c_oSerParType.Run, function () {
            if (null != oThis.oCur_rPr) {
                oThis.bs.WriteItem(c_oSerRunType.rPr, function () {
                    oThis.brPrs.Write_rPr(oThis.oCur_rPr);
                });
            }
            oThis.bs.WriteItem(c_oSerRunType.Content, function () {
                writer();
            });
        });
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
                this.memory.WriteByte(c_oSerImageType2.Chart);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                var oBinaryChartWriter = new BinaryChartWriter(this.memory);
                this.bs.WriteItemWithLength(function () {
                    oBinaryChartWriter.WriteChartContent(img.GraphicObj);
                });
                var chartSrc = img.GraphicObj.chart.img;
                if (null != chartSrc && "" != chartSrc) {
                    this.memory.WriteByte(c_oSerImageType2.ChartImg);
                    this.memory.WriteByte(c_oSerPropLenType.Variable);
                    this.bs.WriteItemWithLength(function () {
                        window.global_pptx_content_writer.WriteImageBySrc(oThis.memory, chartSrc, img.Extent.W, img.Extent.H);
                    });
                }
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
                this.memory.WriteByte(c_oSerImageType2.Chart);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                var oBinaryChartWriter = new BinaryChartWriter(this.memory);
                this.bs.WriteItemWithLength(function () {
                    oBinaryChartWriter.WriteChartContent(img.GraphicObj);
                });
                var chartSrc = img.GraphicObj.chart.img;
                if (null != chartSrc && "" != chartSrc) {
                    this.memory.WriteByte(c_oSerImageType2.ChartImg);
                    this.memory.WriteByte(c_oSerPropLenType.Variable);
                    this.bs.WriteItemWithLength(function () {
                        window.global_pptx_content_writer.WriteImageBySrc(oThis.memory, chartSrc, img.Extent.W, img.Extent.H);
                    });
                }
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
        for (var i = nStart; i <= nEnd; ++i) {
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
        for (var i = nStart; i <= nEnd; i++) {
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
            var oInnerDocument = new BinaryDocumentTableWriter(this.memory, this.Document, this.oMapCommentId, this.oNumIdMap, this.copyParams);
            this.bs.WriteItem(c_oSerDocTableType.Cell_Content, function () {
                oInnerDocument.WriteDocumentContent(cell.Content);
            });
        }
    };
    this.WriteSectPr = function (cellPr) {
        var oThis = this;
        this.bs.WriteItem(c_oSerProp_secPrType.pgSz, function () {
            oThis.WritePageSize();
        });
        this.bs.WriteItem(c_oSerProp_secPrType.pgMar, function () {
            oThis.WritePageMargin();
        });
    };
    this.WritePageSize = function () {
        var oThis = this;
        this.memory.WriteByte(c_oSer_pgSzType.W);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Page_Width);
        this.memory.WriteByte(c_oSer_pgSzType.H);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Page_Height);
        this.memory.WriteByte(c_oSer_pgSzType.Orientation);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(this.Document.Orientation);
    };
    this.WritePageMargin = function () {
        this.memory.WriteByte(c_oSer_pgMarType.Left);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(X_Left_Margin);
        this.memory.WriteByte(c_oSer_pgMarType.Top);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Y_Top_Margin);
        this.memory.WriteByte(c_oSer_pgMarType.Right);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(X_Right_Margin);
        this.memory.WriteByte(c_oSer_pgMarType.Bottom);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Y_Bottom_Margin);
        var header = this.Document.HdrFtr.Content[0].Header;
        var footer = this.Document.HdrFtr.Content[0].Footer;
        if (header) {
            var item = null;
            if (null != header.Odd) {
                item = header.Odd;
            } else {
                if (null != header.Even) {
                    item = header.Even;
                } else {
                    if (null != header.First) {
                        item = header.First;
                    }
                }
            }
            if (null != item) {
                this.memory.WriteByte(c_oSer_pgMarType.Header);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(item.BoundY2);
            }
        }
        if (footer) {
            var item = null;
            if (null != footer.Odd) {
                item = footer.Odd;
            } else {
                if (null != footer.Even) {
                    item = footer.Even;
                } else {
                    if (null != footer.First) {
                        item = footer.First;
                    }
                }
            }
            if (null != item) {
                this.memory.WriteByte(c_oSer_pgMarType.Footer);
                this.memory.WriteByte(c_oSerPropLenType.Double);
                this.memory.WriteDouble(Page_Height - item.BoundY2);
            }
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
        this.memory.WriteByte(BrkBin);
    };
    this.WriteMathBrkBinSub = function (BrkBinSub) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(BrkBinSub);
    };
    this.WriteMathDefJc = function (DefJc) {
        this.memory.WriteByte(c_oSer_OMathBottomNodesValType.Val);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(DefJc);
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
        this.memory.WriteByte(IntLim);
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
        this.memory.WriteByte(NaryLim);
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
        aPostOpenStyleNumCallbacks: null
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
    this.PreLoadPrepare = function () {
        var styles = this.Document.Styles.Style;
        var stDefault = this.Document.Styles.Default;
        stDefault.Numbering = null;
        stDefault.Paragraph = null;
        stDefault.Table = null;
        if (null != stDefault.TableGrid) {
            delete styles[stDefault.TableGrid];
            stDefault.TableGrid = null;
        }
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
        var res = c_oSerConstants.ReadOk;
        res = this.stream.EnterFrame(1);
        if (c_oSerConstants.ReadOk != res) {
            return res;
        }
        var mtLen = this.stream.GetUChar();
        var aSeekTable = new Array();
        var nOtherTableSeek = -1;
        var nNumberingTableSeek = -1;
        var nCommentTableSeek = -1;
        var nSettingTableSeek = -1;
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
                            aSeekTable.push({
                                type: mtiType,
                                offset: mtiOffBits
                            });
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
            case c_oSerTableTypes.Document:
                res = oBinary_DocumentTableReader.ReadAsTable(this.oReadResult.DocumentContent);
                break;
            case c_oSerTableTypes.HdrFtr:
                res = (new Binary_HdrFtrTableReader(this.Document, this.oReadResult, this.openParams, this.stream)).Read();
                break;
            }
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        }
        return res;
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
            if (g_nCurFileVersion < 2) {
                oNewStyle.qFormat = true;
            }
            var sNewStyleName = oNewStyle.Name.toLowerCase().replace(/\s/g, "");
            var oStartDocStyle = aStartDocStylesNames[sNewStyleName];
            if (oStartDocStyle) {
                var stId = oStartDocStyle.Get_Id();
                oNewStyle.Name = oStartDocStyle.Name;
                oIdRenameMap[stId] = {
                    id: oNewId.id,
                    def: oNewId.def,
                    type: oNewStyle.Type,
                    newName: sNewStyleName
                };
                delete styles[stId];
            }
            var oCollisionStyle = styles[oNewId.id];
            if (oCollisionStyle) {
                var sOldId = oCollisionStyle.Get_Id();
                var nCounter = 1;
                var sNewId = sOldId + "_" + nCounter;
                while (null != styles[sNewId] || null != this.oReadResult.styles[sNewId]) {
                    nCounter++;
                    sNewId = sOldId + "_" + nCounter;
                }
                var oNewId = {
                    id: sNewId,
                    def: false,
                    type: oCollisionStyle.Type,
                    newName: sNewStyleName
                };
                oIdRenameMap[sOldId] = oNewId;
                if (stDefault.Numbering == sOldId || stDefault.Paragraph == sOldId || stDefault.Table == sOldId) {
                    oNewId.def = true;
                }
                oCollisionStyle.Set_Id(sNewId);
                delete styles[sOldId];
                styles[sNewId] = oCollisionStyle;
            }
        }
        for (var sOldId in oIdRenameMap) {
            var oNewId = oIdRenameMap[sOldId];
            var sNewStyleName = oNewId.newName;
            var stId = sOldId;
            for (var stId2 in styles) {
                var stObj2 = styles[stId2];
                if (stObj2.BasedOn == stId) {
                    stObj2.BasedOn = oNewId.id;
                }
                if (stObj2.Next == stId) {
                    stObj2.Next = oNewId.id;
                }
            }
            if (stDefault.Paragraph == stId) {
                stDefault.Paragraph = oNewId.id;
            }
            if (stDefault.Numbering == stId) {
                stDefault.Numbering = oNewId.id;
            }
            if (stDefault.Table == stId) {
                stDefault.Table = oNewId.id;
            }
            for (var j = 0, length2 = stDefault.Headings.length; j < length2; ++j) {
                var sHeading = stDefault.Headings[j];
                if (sHeading == stId) {
                    stDefault.Headings[j] = oNewId.id;
                }
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
            if (true == oNewId.def) {
                switch (oNewId.type) {
                case styletype_Character:
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
        if (null == stDefault.TableGrid) {
            var oNewStyle = new CStyle("GenStyleDefTableGrid", null, null, styletype_Table);
            oNewStyle.Create_TableGrid();
            oNewStyle.BasedOn = stDefault.Table;
            stDefault.TableGrid = nStId.toString();
            styles[nStId] = oNewStyle;
            nStId++;
        }
        this.Document.Styles.Id = nStId;
        if (null != this.oReadResult.DefpPr) {
            this.Document.Styles.Default.ParaPr.Merge(this.oReadResult.DefpPr);
        }
        if (null != this.oReadResult.DefrPr) {
            this.Document.Styles.Default.TextPr.Merge(this.oReadResult.DefrPr);
        }
        var setting = this.oReadResult.setting;
        var oHdrFtr = this.Document.HdrFtr.Content[0];
        if (null != oHdrFtr.Header) {
            var Header = oHdrFtr.Header;
            if (null != Header.Odd) {
                if (false == setting.titlePg && null == Header.First) {
                    Header.First = Header.Odd;
                }
                if (false == setting.EvenAndOddHeaders && null == Header.Even) {
                    Header.Even = Header.Odd;
                }
            }
        }
        if (null != oHdrFtr.Footer) {
            var Footer = oHdrFtr.Footer;
            if (null != Footer.Odd) {
                if (false == setting.titlePg && null == Footer.First) {
                    Footer.First = Footer.Odd;
                }
                if (false == setting.EvenAndOddHeaders && null == Footer.Even) {
                    Footer.Even = Footer.Odd;
                }
            }
        }
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
        var oCommentsNewId = new Object();
        for (var i in this.oReadResult.oComments) {
            var oOldComment = this.oReadResult.oComments[i];
            var oNewComment = new CComment(this.Document.Comments, fInitCommentData(oOldComment));
            this.Document.Comments.Add(oNewComment);
            oCommentsNewId[oOldComment.Id] = oNewComment;
        }
        for (var i in this.oReadResult.oCommentsPlaces) {
            var item = this.oReadResult.oCommentsPlaces[i];
            if ((null != item.Start && null != item.End) || (null != item.Ref && null == item.Start && null == item.End)) {
                var oStart = null;
                var oEnd = null;
                var bRef = false;
                if (null != item.Start && null != item.End) {
                    oStart = item.Start;
                    oEnd = item.End;
                } else {
                    if (null != item.Ref) {
                        bRef = true;
                        oStart = oEnd = item.Ref;
                    }
                }
                if (null != oStart || null != oEnd) {
                    var nId = oStart.Id;
                    var oCommentObj = oCommentsNewId[nId];
                    if (oCommentObj) {
                        if (null != item.QuoteText) {
                            oCommentObj.Data.m_sQuoteText = item.QuoteText;
                        }
                        var fInsert = function (bStart, bRef, oCommentPosition) {
                            var index = 0;
                            var oParent = oCommentPosition.oParent;
                            if (null != oParent) {
                                if (bRef) {
                                    if (bStart) {
                                        index = 0;
                                    } else {
                                        index = oParent.Content.length - 1;
                                    }
                                } else {
                                    if (oCommentPosition.oAfter) {
                                        for (var j = 0, length2 = oParent.Content.length; j < length2; ++j) {
                                            if (oParent.Content[j] == oCommentPosition.oAfter) {
                                                index = j + 1;
                                                break;
                                            }
                                        }
                                    }
                                }
                                var oParaCommentElem;
                                if (bStart) {
                                    oParaCommentElem = new ParaCommentStart(oCommentObj.Get_Id());
                                } else {
                                    oParaCommentElem = new ParaCommentEnd(oCommentObj.Get_Id());
                                }
                                if (index < oParent.Content.length - 1) {
                                    oParent.Content.splice(index, 0, oParaCommentElem);
                                } else {
                                    oParent.Content.push(oParaCommentElem);
                                }
                            }
                        };
                        fInsert(false, bRef, oEnd);
                        fInsert(true, bRef, oStart);
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
            var oNewParagraph = new Paragraph(this.Document.DrawingDocument, this.Document, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
            this.Document.Content.push(oNewParagraph);
        }
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
            var oNewId = new Object();
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
                    style.TableTLCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeNwCell:
                    style.TableTRCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeSeCell:
                    style.TableBLCell = oNewTableStylePr;
                    break;
                case ETblStyleOverrideType.tblstyleoverridetypeSwCell:
                    style.TableBRCell = oNewTableStylePr;
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
                        style.Set_TableTLCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeNwCell:
                        style.Set_TableTRCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeSeCell:
                        style.Set_TableBLCell(oNewTableStylePr);
                        break;
                    case ETblStyleOverrideType.tblstyleoverridetypeSwCell:
                        style.Set_TableBRCell(oNewTableStylePr);
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
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.bcr.ReadShd(t, l, pPr.Shd);
            });
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
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
    this.ReadBorder = function (type, length, Border) {
        var res = c_oSerConstants.ReadOk;
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
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.NormalizeBorder = function (border) {
        if (null == border.Color) {
            border.Color = new CDocumentColor(0, 0, 0);
        } else {
            border.Color = new CDocumentColor(border.Color.r, border.Color.g, border.Color.b);
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
                                                oFramePr.Wrap = this.stream.GetUChar();
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
                rPr.RFonts = new Object();
            }
            rPr.RFonts.Ascii = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontHAnsi:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = new Object();
            }
            rPr.RFonts.HAnsi = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontAE:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = new Object();
            }
            rPr.RFonts.EastAsia = {
                Name: this.stream.GetString2LE(length),
                Index: -1
            };
            break;
        case c_oSerProp_rPrType.FontCS:
            if (undefined === rPr.RFonts) {
                rPr.RFonts = new Object();
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
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.bcr.ReadShd(t, l, Pr.Shd);
                                });
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
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.bcr.ReadShd(t, l, Pr.Shd);
                });
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
    this.m_oNumToANum = new Object();
    this.m_oANumToNumClass = new Object();
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
            var oNewItem = new Object();
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
                    oNewLvl.LvlText = new Array();
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
    this.bdtr = new Binary_DocumentTableReader(this.Document, this.oReadResult, this.openParams, this.stream, true, new Object());
    this.Header = null;
    this.Footer = null;
    this.Read = function () {
        if (this.Document.HdrFtr && this.Document.HdrFtr.Content && this.Document.HdrFtr.Content.length > 0 && this.Document.HdrFtr.Content[0].Header) {
            this.Header = this.Document.HdrFtr.Content[0].Header;
        }
        if (this.Document.HdrFtr && this.Document.HdrFtr.Content && this.Document.HdrFtr.Content.length > 0 && this.Document.HdrFtr.Content[0].Footer) {
            this.Footer = this.Document.HdrFtr.Content[0].Footer;
        }
        if (null == this.Header || null == this.Footer) {
            return;
        }
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
                oHdrFtrContainer = this.Header;
                nHdrFtrType = hdrftr_Header;
            } else {
                oHdrFtrContainer = this.Footer;
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
            var hdrftr = new CHeaderFooter(this.Document.HdrFtr, this.Document, this.Document.DrawingDocument, nHdrFtrType, 0);
            this.bdtr.Document = hdrftr.Content;
            var oNewItem = {
                Content: null,
                BoundY: null,
                BoundY2: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadHdrFtrItem(t, l, oNewItem);
            });
            if (null != oNewItem.Content && oNewItem.Content.length > 0 && null != oNewItem.BoundY2) {
                hdrftr.Set_BoundY2(oNewItem.BoundY2, false);
                hdrftr.Content.Content = oNewItem.Content;
                switch (type) {
                case c_oSerHdrFtrTypes.HdrFtr_First:
                    oHdrFtrContainer.First = hdrftr;
                    break;
                case c_oSerHdrFtrTypes.HdrFtr_Even:
                    oHdrFtrContainer.Even = hdrftr;
                    break;
                case c_oSerHdrFtrTypes.HdrFtr_Odd:
                    oHdrFtrContainer.Odd = hdrftr;
                    break;
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadHdrFtrItem = function (type, length, oNewItem) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerHdrFtrTypes.HdrFtr_Y2 === type) {
            oNewItem.BoundY2 = this.bcr.ReadDouble();
        } else {
            if (c_oSerHdrFtrTypes.HdrFtr_Y === type) {
                oNewItem.BoundY = this.bcr.ReadDouble();
            } else {
                if (c_oSerHdrFtrTypes.HdrFtr_Content === type) {
                    oNewItem.Content = new Array();
                    oThis.bdtr.Read(length, oNewItem.Content);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
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
    this.brPrr = new Binary_rPrReader(this.Document, this.stream);
    this.bpPrr = new Binary_pPrReader(this.Document, this.oReadResult, this.stream);
    this.btblPrr = new Binary_tblPrReader(this.Document, this.oReadResult, this.stream);
    this.bAllowFlow = bAllowFlow;
    this.lastPar = null;
    this.oComments = oComments;
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
            var oNewParagraph = new Paragraph(this.Document.DrawingDocument, this.Document, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
            var oNewObject = {
                Content: new Array(),
                bExistrPr: false
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadParagraph(t, l, oNewParagraph, oNewObject, Content);
            });
            for (var i = oNewObject.Content.length - 1; i >= 0; --i) {
                var elem = oNewObject.Content[i];
                oNewParagraph.Internal_Content_Add(0, elem);
            }
            if (null != this.lastPar) {
                oNewParagraph.Set_DocumentPrev(this.lastPar);
                this.lastPar.Set_DocumentNext(oNewParagraph);
            }
            this.lastPar = oNewParagraph;
            Content.push(oNewParagraph);
        } else {
            if (c_oSerParType.Table === type) {
                var doc = this.Document;
                var oNewTable = new CTable(doc.DrawingDocument, doc, true, 0, 0, 0, X_Left_Field, Y_Bottom_Field, 0, 0, []);
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadDocTable(t, l, oNewTable);
                });
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
                    var oSectPr = new Object();
                    oSectPr.W = Page_Width;
                    oSectPr.H = Page_Height;
                    oSectPr.Orientation = this.Document.Orientation;
                    oSectPr.Left = X_Left_Margin;
                    oSectPr.Top = Y_Top_Margin;
                    oSectPr.Right = X_Right_Margin;
                    oSectPr.Bottom = Y_Bottom_Margin;
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.Read_SecPr(t, l, oSectPr);
                    });
                    Page_Width = oSectPr.W;
                    Page_Height = oSectPr.H;
                    this.Document.Orientation = oSectPr.Orientation;
                    if (null != oSectPr.Left) {
                        X_Left_Margin = oSectPr.Left;
                    }
                    if (null != oSectPr.Right) {
                        X_Right_Margin = oSectPr.Right;
                    }
                    if (null != oSectPr.Top) {
                        Y_Top_Margin = oSectPr.Top;
                    }
                    if (null != oSectPr.Bottom) {
                        Y_Bottom_Margin = oSectPr.Bottom;
                    }
                    X_Left_Field = X_Left_Margin;
                    X_Right_Field = Page_Width - X_Right_Margin;
                    Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
                    Y_Top_Field = Y_Top_Margin;
                    if (this.Document.HdrFtr && this.Document.HdrFtr.Content && this.Document.HdrFtr.Content.length > 0) {
                        var oHeader = this.Document.HdrFtr.Content[0].Header;
                        if (null != oHeader) {
                            if (null != oHeader.First) {
                                oHeader.First.Content.X = X_Left_Field;
                                oHeader.First.Content.XLimit = X_Right_Field;
                            }
                            if (null != oHeader.Even) {
                                oHeader.Even.Content.X = X_Left_Field;
                                oHeader.Even.Content.XLimit = X_Right_Field;
                            }
                            if (null != oHeader.Odd) {
                                oHeader.Odd.Content.X = X_Left_Field;
                                oHeader.Odd.Content.XLimit = X_Right_Field;
                            }
                        }
                        var oFooter = this.Document.HdrFtr.Content[0].Footer;
                        if (null != oFooter) {
                            if (null != oFooter.First) {
                                oFooter.First.Content.X = X_Left_Field;
                                oFooter.First.Content.XLimit = X_Right_Field;
                            }
                            if (null != oFooter.Even) {
                                oFooter.Even.Content.X = X_Left_Field;
                                oFooter.Even.Content.XLimit = X_Right_Field;
                            }
                            if (null != oFooter.Odd) {
                                oFooter.Odd.Content.X = X_Left_Field;
                                oFooter.Odd.Content.XLimit = X_Right_Field;
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
    this.ReadParagraph = function (type, length, paragraph, oNewObject, Content) {
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
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadParagraphContent(t, l, oNewObject, paragraph, Content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadParagraphContent = function (type, length, oNewObject, paragraph, Content) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerParType.Run === type) {
            var oRunObject = {
                Content: new Array(),
                rPr: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadRun(t, l, oRunObject, paragraph, Content);
            });
            if (null != oRunObject.rPr) {
                oNewObject.bExistrPr = true;
                oNewObject.Content.push(new ParaTextPr(oRunObject.rPr));
            } else {
                if (oNewObject.bExistrPr) {
                    oNewObject.Content.push(new ParaTextPr());
                }
            }
            oNewObject.Content = oNewObject.Content.concat(oRunObject.Content);
        } else {
            if (c_oSerParType.CommentStart === type) {
                var oCommon = new Object();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadComment(t, l, oCommon);
                });
                if (oNewObject.Content.length > 0) {
                    oCommon.oAfter = oNewObject.Content[oNewObject.Content.length - 1];
                }
                if (null != oCommon.Id) {
                    oCommon.oParent = paragraph;
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
                }
            } else {
                if (c_oSerParType.CommentEnd === type) {
                    var oCommon = new Object();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadComment(t, l, oCommon);
                    });
                    if (oNewObject.Content.length > 0) {
                        oCommon.oAfter = oNewObject.Content[oNewObject.Content.length - 1];
                    }
                    if (null != oCommon.Id) {
                        oCommon.oParent = paragraph;
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
                    }
                } else {
                    if (c_oSerParType.OMathPara == type) {} else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathAcc = function (type, length, oMathAcc) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.AccPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathAccPr(t, l, props, oMathAcc);
            });
            oMathAcc.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oMathAcc.getBase();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathAccPr = function (type, length, props, oMathAcc) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props);
            });
        } else {
            if (c_oSer_OMathContentType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, oMathAcc);
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
            props.aln = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathAlnScr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.alnScr = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathArg = function (type, length, oElem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Acc === type) {
            var oAccent = new CAccent();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathAcc(t, l, oAccent);
            });
            oElem.addElementToContent(oAccent);
        } else {
            if (c_oSer_OMathContentType.ArgPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArgPr(t, l, oElem);
                });
            } else {
                if (c_oSer_OMathContentType.Bar === type) {
                    var oBar = new CBar();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathBar(t, l, oBar);
                    });
                    oElem.addElementToContent(oBar);
                } else {
                    if (c_oSer_OMathContentType.BorderBox === type) {
                        var oBorderBox = new CBorderBox();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathBorderBox(t, l, oBorderBox);
                        });
                        oElem.addElementToContent(oBorderBox);
                    } else {
                        if (c_oSer_OMathContentType.Box === type) {
                            var oBox = new CBox();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadMathBox(t, l, oBox);
                            });
                            oElem.addElementToContent(oBox);
                        } else {
                            if (c_oSer_OMathContentType.CtrlPr === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadMathCtrlPr(t, l, oElem);
                                });
                            } else {
                                if (c_oSer_OMathContentType.Delimiter === type) {
                                    var oDelimiter = new CDelimiter();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadMathDelimiter(t, l, oDelimiter);
                                    });
                                    oElem.addElementToContent(oDelimiter);
                                } else {
                                    if (c_oSer_OMathContentType.EqArr === type) {
                                        var oEqArr = new CEqArray();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadMathEqArr(t, l, oEqArr);
                                        });
                                        oElem.addElementToContent(oEqArr);
                                    } else {
                                        if (c_oSer_OMathContentType.Fraction === type) {
                                            var oFraction = new CFraction();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadMathFraction(t, l, oFraction);
                                            });
                                            oElem.addElementToContent(oFraction);
                                        } else {
                                            if (c_oSer_OMathContentType.Func === type) {
                                                var oFunc = new CMathFunc();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadMathFunc(t, l, oFunc);
                                                });
                                                oElem.addElementToContent(oFunc);
                                            } else {
                                                if (c_oSer_OMathContentType.GroupChr === type) {
                                                    var oGroupChr = new CGroupCharacter();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadMathGroupChr(t, l, oGroupChr);
                                                    });
                                                    oElem.addElementToContent(oGroupChr);
                                                } else {
                                                    if (c_oSer_OMathContentType.LimLow === type) {
                                                        var oLimLow = new CLimit();
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadMathLimLow(t, l, oLimLow);
                                                        });
                                                        oElem.addElementToContent(oLimLow);
                                                    } else {
                                                        if (c_oSer_OMathContentType.LimUpp === type) {
                                                            var oLimUpp = new CLimit();
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadMathLimUpp(t, l, oLimUpp);
                                                            });
                                                            oElem.addElementToContent(oLimUpp);
                                                        } else {
                                                            if (c_oSer_OMathContentType.Matrix === type) {
                                                                var oMatrix = new CMathMatrix();
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadMathMatrix(t, l, oMatrix);
                                                                });
                                                                oElem.addElementToContent(oMatrix);
                                                            } else {
                                                                if (c_oSer_OMathContentType.Nary === type) {
                                                                    var oNary = new CNary();
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadMathNary(t, l, oNary);
                                                                    });
                                                                    oElem.addElementToContent(oNary);
                                                                } else {
                                                                    if (c_oSer_OMathContentType.OMath === type) {
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadMathArg(t, l, oElem);
                                                                        });
                                                                    } else {
                                                                        if (c_oSer_OMathContentType.Phant === type) {
                                                                            var oPhant = new CPhantom();
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadMathPhant(t, l, oPhant);
                                                                            });
                                                                            oElem.addElementToContent(oPhant);
                                                                        } else {
                                                                            if (c_oSer_OMathContentType.MRun === type) {
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadMathMRun(t, l, oElem);
                                                                                });
                                                                            } else {
                                                                                if (c_oSer_OMathContentType.Rad === type) {
                                                                                    var oRad = new CRadical();
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadMathRad(t, l, oRad);
                                                                                    });
                                                                                    oElem.addElementToContent(oRad);
                                                                                } else {
                                                                                    if (c_oSer_OMathContentType.SPre === type) {
                                                                                        var oSPre = new CDegreeSubSup();
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadMathSPre(t, l, oSPre);
                                                                                        });
                                                                                        oElem.addElementToContent(oSPre);
                                                                                    } else {
                                                                                        if (c_oSer_OMathContentType.SSub === type) {
                                                                                            var oSSub = new CDegree();
                                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                                return oThis.ReadMathSSub(t, l, oSSub);
                                                                                            });
                                                                                            oElem.addElementToContent(oSSub);
                                                                                        } else {
                                                                                            if (c_oSer_OMathContentType.SSubSup === type) {
                                                                                                var oSSubSup = new CDegreeSubSup();
                                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                                    return oThis.ReadMathSSubSup(t, l, oSSubSup);
                                                                                                });
                                                                                                oElem.addElementToContent(oSSubSup);
                                                                                            } else {
                                                                                                if (c_oSer_OMathContentType.SSup === type) {
                                                                                                    var oSSup = new CDegree();
                                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                                        return oThis.ReadMathSSup(t, l, oSSup);
                                                                                                    });
                                                                                                    oElem.addElementToContent(oSSup);
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
    this.ReadMathArgPr = function (type, length, oElem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.ArgSz === type) {
            var props = new Object();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathArgSz(t, l, props);
            });
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
    this.ReadMathBegChr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.begChr = this.stream.GetString2LE(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathBar = function (type, length, oBar) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BarPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBarPr(t, l, props, oBar);
            });
            oBar.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oBar.getBase();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBarPr = function (type, length, props, oBar) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oBar);
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
            case 0:
                props.baseJc = BASEJC_BOTTOM;
                break;
            case 1:
                props.baseJc = BASEJC_CENTER;
                break;
            case 5:
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
    this.ReadMathBorderBox = function (type, length, oBorderBox) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BorderBoxPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBorderBoxPr(t, l, props, oBorderBox);
            });
            oBorderBox.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oBorderBox.getBase();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBorderBoxPr = function (type, length, props, oBorderBox) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oBorderBox);
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
    this.ReadMathBox = function (type, length, oBox) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.BoxPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathBoxPr(t, l, props, oBox);
            });
            oBorderBox.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oBorderBox.getBase();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathBoxPr = function (type, length, props, oBox) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Aln === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathAln(t, l, props);
            });
        } else {
            if (c_oSer_OMathContentType.Brk === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBrk(t, l, props);
                });
            } else {
                if (c_oSer_OMathContentType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, oBox);
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
            props.brk = this.stream.GetBool(length);
        } else {
            if (c_oSer_OMathBottomNodesValType.AlnAt === type) {
                props.alnAt = this.stream.GetBool(length);
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
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var cGpRule = this.stream.GetUChar(length);
            switch (cGpRule) {
            case 0:
                props.cGpRule = "centered";
                break;
            case 1:
                props.cGpRule = "match";
                break;
            default:
                props.cGpRule = "centered";
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
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
    this.ReadMathChr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var text = this.stream.GetString2LE(length);
            props.chr = text;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathCtrlPr = function (type, length, oElem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRunType.rPr === type) {
            var MathTextRPr = new CTextPr();
            res = this.brPrr.Read(length, MathTextRPr);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDelimiter = function (type, length, oDelimiter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.DelimiterPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathDelimiterPr(t, l, props, oDelimiter);
            });
            if (!props.begChr) {
                props.begChrType = 0;
            }
            if (!props.endChr) {
                props.endChrType = 1;
            }
            if (!props.sepChr && props.column > 1) {
                props.sepChrType = 12;
            }
            oDelimiter.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var lColumn = oDelimiter.column;
                var oElem = oDelimiter.getBase(lColumn);
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
                oDelimiter.column++;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathDelimiterPr = function (type, length, props, oDelimiter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Column === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathColumn(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.BegChr === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBegChr(t, l, props);
                });
            } else {
                if (c_oSer_OMathContentType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, oDelimiter);
                    });
                } else {
                    if (c_oSer_OMathBottomNodesType.EndChr === type) {
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadMathEndChr(t, l, props);
                        });
                    } else {
                        if (c_oSer_OMathBottomNodesType.Grow === type) {
                            res = this.bcr.Read2(length, function (t, l) {
                                return oThis.ReadMathGrow(t, l, props);
                            });
                        } else {
                            if (c_oSer_OMathBottomNodesType.SepChr === type) {
                                res = this.bcr.Read2(length, function (t, l) {
                                    return oThis.ReadMathSepChr(t, l, props);
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
            props.degHide = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathDiff = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.diff = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathEqArr = function (type, length, oEqArr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.EqArrPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathEqArrPr(t, l, props, oEqArr);
            });
            oEqArr.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var lRow = oEqArr.row;
                var oElem = oEqArr.getElement(lRow);
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
                oEqArr.row++;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathEqArrPr = function (type, length, props, oEqArr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Row === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathRow(t, l, props);
            });
        } else {
            if (c_oSer_OMathBottomNodesType.BaseJc === type) {
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadMathBaseJc(t, l, props);
                });
            } else {
                if (c_oSer_OMathContentType.CtrlPr === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathCtrlPr(t, l, oEqArr);
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
    this.ReadMathEndChr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.endChr = this.stream.GetString2LE(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathGroupChr = function (type, length, oGroupChr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.GroupChrPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathGroupChrPr(t, l, props, oGroupChr);
            });
            oGroupChr.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oGroupChr.getArgument();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathGroupChrPr = function (type, length, props, oGroupChr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props);
            });
        } else {
            if (c_oSer_OMathContentType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, oGroupChr);
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
            props.grow = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathFraction = function (type, length, oFraction) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.FPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathFPr(t, l, props, oFraction);
            });
            if (!props.type) {
                props.type = BAR_FRACTION;
            }
            oFraction.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Den === type) {
                var oElemDen = oFraction.getDenominator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElemDen);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Num === type) {
                    var oElemNum = oFraction.getNumerator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oElemNum);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathFPr = function (type, length, props, oFraction) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oFraction);
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
    this.ReadMathFunc = function (type, length, oFunc) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.FuncPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathFuncPr(t, l, props, oFunc);
            });
            oFunc.init();
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oFunc.getArgument();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                if (c_oSer_OMathArgNodesType.FName === type) {
                    var oFName = oFunc.getFName();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oFName);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathFuncPr = function (type, length, props, oFunc) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oFunc);
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
            case 0:
                props.limLoc = NARY_SubSup;
                break;
            case 1:
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
    this.ReadMathLimLow = function (type, length, oLimLow) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.LimLowPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathLimLowPr(t, l, props, oLimLow);
            });
            props.type = LIMIT_LOW;
            oLimLow.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oLimLow.getFName();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Lim === type) {
                    var oLim = oLimLow.getIterator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oLim);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathLimLowPr = function (type, length, props, oLimLow) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oLimLow);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathLimUpp = function (type, length, oLimUpp) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.LimUppPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathLimUppPr(t, l, props, oLimUpp);
            });
            props.type = LIMIT_UP;
            oLimUpp.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oLimUpp.getFName();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Lim === type) {
                    var oLim = oLimUpp.getIterator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oLim);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathLimUppPr = function (type, length, props, oLimUpp) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oLimUpp);
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
    this.ReadMathMatrix = function (type, length, oMatrix) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.MPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathMPr(t, l, props, oMatrix);
            });
            oMatrix.init(props);
        } else {
            if (c_oSer_OMathContentType.Mr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathMr(t, l, oMatrix);
                });
                oMatrix.row++;
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
            case 0:
                props.mcJc = "center";
                break;
            case 1:
                props.mcJc = "inside";
                break;
            case 2:
                props.mcJc = "left";
                break;
            case 3:
                props.mcJc = "outside";
                break;
            case 4:
                props.mcJc = "right";
                break;
            default:
                props.mcJc = "center";
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
                return oThis.ReadMathColumn(t, l, props);
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
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathMc(t, l, props);
            });
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
            case 0:
                props.mJc = "center";
                break;
            case 1:
                props.mJc = "centerGroup";
                break;
            case 2:
                props.mJc = "left";
                break;
            case 3:
                props.mJc = "right";
                break;
            default:
                props.mJc = "centerGroup";
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathMPr = function (type, length, props, oMatrix) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.Row === type) {
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
                            if (c_oSer_OMathContentType.CtrlPr === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadMathCtrlPr(t, l, oMatrix);
                                });
                            } else {
                                if (c_oSer_OMathContentType.Mcs === type) {
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
    this.ReadMathMr = function (type, length, oMatrix) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathArgNodesType.Element === type) {
            var lRow = oMatrix.row;
            var lColumn = oMatrix.column;
            var oElem = oMatrix.getElement(lRow, lColumn);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathArg(t, l, oElem);
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
    this.ReadMathMRun = function (type, length, oElem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.MText === type) {
            var text = this.stream.GetString2LE(length);
            var str = "";
            for (var i = 0, length = text.length; i < length; ++i) {
                if (text[i] != " ") {
                    if (31 < text[i].charCodeAt(0)) {
                        var oText = new CMathText();
                        oText.addTxt(text[i]);
                        oElem.addElementToContent(oText);
                    }
                }
            }
        } else {
            if (c_oSer_OMathContentType.MRPr === type) {
                var props = new Object();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathMRPr(t, l, props);
                });
            } else {
                if (c_oSerRunType.rPr === type) {
                    var MathTextRPr = new CTextPr();
                    res = this.brPrr.Read(length, MathTextRPr);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
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
            if (c_oSer_OMathContentType.Brk === type) {
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
    this.ReadMathNary = function (type, length, oNary) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.NaryPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathNaryPr(t, l, props, oNary);
            });
            oNary.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Sub === type) {
                var oSub = oNary.getLowerIterator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Sup === type) {
                    var oSup = oNary.getUpperIterator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup);
                    });
                } else {
                    if (c_oSer_OMathArgNodesType.Element === type) {
                        var oElem = oNary.getBase();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oElem);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathNaryPr = function (type, length, props, oNary) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.Chr === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathChr(t, l, props);
            });
        } else {
            if (c_oSer_OMathContentType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, oNary);
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
            props.noBreak = this.stream.GetBool(length);
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
    this.ReadMathOMathPara = function (type, length, oOMathPara) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathArgNodesType.OMath === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathArg(t, l, oOMathPara.Root);
            });
        } else {
            if (c_oSer_OMathContentType.OMathParaPr) {
                var props = new Object();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathOMathParaPr(t, l, props);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
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
            props.opEmu = this.stream.GetBool(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathPhant = function (type, length, oPhant) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.PhantPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathPhantPr(t, l, props, oPhant);
            });
            oPhant.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Element === type) {
                var oElem = oPhant.getBase();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oElem);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathPhantPr = function (type, length, props, oPhant) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oPhant);
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
            props.plcHide = this.stream.GetBool(length);
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
            case 0:
                props.pos = LOCATION_BOT;
                break;
            case 1:
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
    this.ReadMathRad = function (type, length, oRad) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.RadPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathRadPr(t, l, props, oRad);
            });
            oRad.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Deg === type) {
                var oDeg = oRad.getDegree();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oDeg);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Element === type) {
                    var oElem = oRad.getBase();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oElem);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathRadPr = function (type, length, props, oRad) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oRad);
            });
        }
        if (c_oSer_OMathBottomNodesType.DegHide === type) {
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.ReadMathDegHide(t, l, props);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
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
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var rSpRule = this.stream.GetUChar(length);
            switch (rSpRule) {
            case 0:
                props.rSpRule = "centered";
                break;
            case 1:
                props.rSpRule = "match";
                break;
            default:
                props.rSpRule = "centered";
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathScr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            var scr = this.stream.GetUChar(length);
            switch (scr) {
            case 0:
                props.scr = "double-struck";
                break;
            case 1:
                props.scr = "fraktur";
                break;
            case 2:
                props.scr = "monospace";
                break;
            case 3:
                props.scr = "roman";
                break;
            case 4:
                props.scr = "sans-serif";
                break;
            case 4:
                props.scr = "script";
                break;
            default:
                props.scr = "roman";
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSepChr = function (type, length, props) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesValType.Val === type) {
            props.sepChr = this.stream.GetString2LE(length);
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
            case 0:
                props.shp = DELIMITER_SHAPE_CENTERED;
                break;
            case 1:
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
    this.ReadMathSPre = function (type, length, oSPre) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SPrePr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSPrePr(t, l, props, oSPre);
            });
            props.type = DEGREE_PreSubSup;
            oSPre.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Sub === type) {
                var oSub = oSPre.getLowerIterator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Sup === type) {
                    var oSup = oSPre.getUpperIterator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup);
                    });
                } else {
                    if (c_oSer_OMathArgNodesType.Element === type) {
                        var oElem = oSPre.getBase();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oElem);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathSPrePr = function (type, length, props, oSPre) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oSPre);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSSub = function (type, length, oSSub) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSubPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSubPr(t, l, props, oSSub);
            });
            props.type = DEGREE_SUBSCRIPT;
            oSSub.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Sub === type) {
                var oSub = oSSub.getLowerIterator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Element === type) {
                    var oElem = oSSub.getBase();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oElem);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathSSubPr = function (type, length, props, oSSub) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oSSub);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMathSSubSup = function (type, length, oSSubSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSubSupPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSubSupPr(t, l, props, SSubSup);
            });
            props.type = DEGREE_SubSup;
            oSSubSup.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Sub === type) {
                var oSub = oSSubSup.getLowerIterator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSub);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Sup === type) {
                    var oSup = oSSubSup.getUpperIterator();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oSup);
                    });
                } else {
                    if (c_oSer_OMathArgNodesType.Element === type) {
                        var oElem = oSSubSup.getBase();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadMathArg(t, l, oElem);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMathSSubSupPr = function (type, length, props, SSubSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathBottomNodesType.AlnScr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathAlnScr(t, l, props);
            });
        } else {
            if (c_oSer_OMathContentType.CtrlPr === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathCtrlPr(t, l, SSubSup);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadMathSSup = function (type, length, oSSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.SSupPr === type) {
            var props = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathSSupPr(t, l, props, oSSup);
            });
            props.type = DEGREE_SUPERSCRIPT;
            oSSup.init(props);
        } else {
            if (c_oSer_OMathArgNodesType.Sup === type) {
                var oSup = oSSup.getUpperIterator();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadMathArg(t, l, oSup);
                });
            } else {
                if (c_oSer_OMathArgNodesType.Element === type) {
                    var oElem = oSSup.getBase();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadMathArg(t, l, oElem);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMathSSupPr = function (type, length, props, oSSup) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OMathContentType.CtrlPr === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMathCtrlPr(t, l, oSSup);
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
            case 0:
                props.sty = "b";
                break;
            case 1:
                props.sty = "bi";
                break;
            case 2:
                props.sty = "i";
                break;
            case 3:
                props.sty = "p";
                break;
            default:
                props.sty = "i";
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
            case 0:
                props.type = BAR_FRACTION;
                break;
            case 1:
                props.type = LINEAR_FRACTION;
                break;
            case 2:
                props.type = NO_BAR_FRACTION;
                break;
            case 3:
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
            case 0:
                props.vertJc = VJUST_BOT;
                break;
            case 1:
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
    this.ReadComment = function (type, length, oComments) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_CommentsType.Id === type) {
            oComments.Id = this.stream.GetULongLE();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadRun = function (type, length, oRunObject, paragraph, Content) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRunType.rPr === type) {
            oRunObject.rPr = new CTextPr();
            res = this.brPrr.Read(length, oRunObject.rPr);
        } else {
            if (c_oSerRunType.Content === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadRunContent(t, l, oRunObject.Content, paragraph, Content);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadRunContent = function (type, length, Content, paragraph, oDocContent) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
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
            for (var i = 0, length = text.length; i < length; ++i) {
                if (text[i] != " ") {
                    Content.push(new ParaText(text[i]));
                } else {
                    Content.push(new ParaSpace(1));
                }
            }
        } else {
            if (c_oSerRunType.tab === type) {
                Content.push(new ParaTab());
            } else {
                if (c_oSerRunType.pagenum === type) {
                    Content.push(new ParaPageNum());
                } else {
                    if (c_oSerRunType.pagebreak === type) {
                        Content.push(new ParaNewLine(break_Page));
                    } else {
                        if (c_oSerRunType.linebreak === type) {
                            Content.push(new ParaNewLine(break_Line));
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
                                    var drawing = new ParaDrawing(image.W, image.H, null, doc.DrawingDocument, paragraph);
                                    var Image = new WordImage(drawing, doc, doc.DrawingDocument, null);
                                    var src = this.oReadResult.ImageMap[image.MediaId];
                                    Image.init(src, image.W, image.H, null);
                                    if (c_oAscWrapStyle.Flow == image.Type) {
                                        drawing.Set_DrawingType(drawing_Anchor);
                                        drawing.Set_PositionH(c_oAscRelativeFromH.Page, false, image.X);
                                        drawing.Set_PositionV(c_oAscRelativeFromV.Page, false, image.Y);
                                        if (image.Paddings) {
                                            drawing.Set_Distance(image.Paddings.Left, image.Paddings.Top, image.Paddings.Right, image.Paddings.Bottom);
                                        }
                                        History.RecalcData_Add({
                                            Type: historyrecalctype_Flow,
                                            Data: drawing
                                        });
                                    }
                                    editor.WordControl.m_oLogicDocument.DrawingObjects.arrForCalculateAfterOpen.push(drawing);
                                    drawing.init();
                                    if (null != drawing.GraphicObj) {
                                        window.global_pptx_content_loader.ImageMapChecker[src] = true;
                                        Content.push(drawing);
                                    }
                                }
                            } else {
                                if (c_oSerRunType.pptxDrawing === type) {
                                    var doc = this.Document;
                                    var oParaDrawing = new ParaDrawing(null, null, null, doc.DrawingDocument, doc, paragraph);
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
                                    editor.WordControl.m_oLogicDocument.DrawingObjects.arrForCalculateAfterOpen.push(oParaDrawing);
                                    oParaDrawing.init();
                                    if (drawing_Anchor == oParaDrawing.DrawingType) {
                                        History.RecalcData_Add({
                                            Type: historyrecalctype_Flow,
                                            Data: oParaDrawing
                                        });
                                    }
                                    if (null != oParaDrawing.GraphicObj) {
                                        Content.push(oParaDrawing);
                                    }
                                } else {
                                    if (c_oSerRunType.table === type) {
                                        var doc = this.Document;
                                        var oNewTable = new CTable(doc.DrawingDocument, doc, true, 0, 0, 0, X_Left_Field, Y_Bottom_Field, 0, 0, []);
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadDocTable(t, l, oNewTable);
                                        });
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
                                        oDocContent.push(oNewTable);
                                    } else {
                                        if (c_oSerRunType.fldstart === type) {
                                            var oHyperlink = new ParaHyperlinkStart();
                                            var sField = this.stream.GetString2LE(length);
                                            this.parseField(oHyperlink, sField);
                                            Content.push(oHyperlink);
                                        } else {
                                            if (c_oSerRunType.fldend === type) {
                                                var oHyperlink = new ParaHyperlinkEnd();
                                                Content.push(oHyperlink);
                                            } else {
                                                if (c_oSerRunType.CommentReference === type) {
                                                    var oCommon = new Object();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadComment(t, l, oCommon);
                                                    });
                                                    if (Content.length > 0) {
                                                        oCommon.oAfter = Content[Content.length - 1];
                                                    }
                                                    if (null != oCommon.Id) {
                                                        oCommon.oParent = paragraph;
                                                        var item = this.oComments[oCommon.Id];
                                                        if (item) {
                                                            item.Ref = oCommon;
                                                        } else {
                                                            this.oComments[oCommon.Id] = {
                                                                Ref: oCommon
                                                            };
                                                        }
                                                    }
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
                            }
                        }
                    }
                }
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
            var aItems = new Array();
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
                var grObject = window.global_pptx_content_loader.ReadDrawing(this, this.stream, this.Document, oParaDrawing);
                oParaDrawing.Set_GraphicObject(grObject);
            } else {
                if (c_oSerImageType2.Chart === type) {
                    var oNewGraphicObj = new CChartAsGroup();
                    if (g_oTableId) {
                        g_oTableId.m_bTurnOff = true;
                    }
                    var chart = new asc_CChart();
                    if (g_oTableId) {
                        g_oTableId.m_bTurnOff = false;
                    }
                    var oBinary_ChartReader = new Binary_ChartReader(this.stream, chart, oNewGraphicObj);
                    oBinary_ChartReader.ReadExternal(length);
                    if (null != chart.range.interval && chart.range.interval.length > 0) {
                        oNewGraphicObj.setAscChart(chart);
                        oParaDrawing.Set_GraphicObject(oNewGraphicObj);
                    }
                } else {
                    if (c_oSerImageType2.AllowOverlap === type) {
                        var AllowOverlap = this.stream.GetBool();
                    } else {
                        if (c_oSerImageType2.BehindDoc === type) {
                            oParaDrawing.Set_BehindDoc(this.stream.GetBool());
                        } else {
                            if (c_oSerImageType2.DistL === type) {
                                oParaDrawing.Set_Distance(this.bcr.ReadDouble(), null, null, null);
                            } else {
                                if (c_oSerImageType2.DistT === type) {
                                    oParaDrawing.Set_Distance(null, this.bcr.ReadDouble(), null, null);
                                } else {
                                    if (c_oSerImageType2.DistR === type) {
                                        oParaDrawing.Set_Distance(null, null, this.bcr.ReadDouble(), null);
                                    } else {
                                        if (c_oSerImageType2.DistB === type) {
                                            oParaDrawing.Set_Distance(null, null, null, this.bcr.ReadDouble());
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
                    if (c_oSerWrapThroughTight.WrapPolygon === type) {
                        var oStartRes = {
                            start: null
                        };
                        res = this.bcr.Read2(length, function (t, l) {
                            return oThis.ReadWrapPolygon(t, l, wrappingPolygon, oStartRes);
                        });
                        if (null != oStartRes.start) {
                            wrappingPolygon.relativeArrPoints.unshift(oStartRes.start);
                        }
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
            wrappingPolygon.edited = this.stream.GetBool();
        } else {
            if (c_oSerWrapPolygon.Start === type) {
                oStartRes.start = new CPolygonPoint();
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.ReadPolygonPoint(t, l, oStartRes.start);
                });
            } else {
                if (c_oSerWrapPolygon.ALineTo === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.ReadLineTo(t, l, wrappingPolygon.relativeArrPoints);
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
            oPoint.x = this.bcr.ReadDouble();
        } else {
            if (c_oSerPoint2D.Y === type) {
                oPoint.y = this.bcr.ReadDouble();
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
                var oCellContent = new Array();
                var oCellContentReader = new Binary_DocumentTableReader(cell.Content, this.oReadResult, this.openParams, this.stream, false, this.oComments);
                oCellContentReader.nCurCommentsCount = this.nCurCommentsCount;
                oCellContentReader.oCurComments = this.oCurComments;
                oCellContentReader.Read(length, oCellContent);
                this.nCurCommentsCount = oCellContentReader.nCurCommentsCount;
                for (var i = 0, length = oCellContent.length; i < length; ++i) {
                    if (i == length - 1) {
                        cell.Content.Internal_Content_Add(i + 1, oCellContent[i], true);
                    } else {
                        cell.Content.Internal_Content_Add(i + 1, oCellContent[i], false);
                    }
                }
                cell.Content.Internal_Content_Remove(0, 1);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.Read_SecPr = function (type, length, oSectPr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrType.pgSz === type) {
            var oSize = new Object();
            res = this.bcr.Read2(length, function (t, l) {
                return oThis.Read_pgSz(t, l, oSize);
            });
            if (null != oSize.W && null != oSize.H) {
                oSectPr.W = oSize.W;
                oSectPr.H = oSize.H;
            }
            if (null != oSize.Orientation) {
                oSectPr.Orientation = oSize.Orientation;
            }
        } else {
            if (c_oSerProp_secPrType.pgMar === type) {
                var oMar = new Object();
                res = this.bcr.Read2(length, function (t, l) {
                    return oThis.Read_pgMar(t, l, oMar);
                });
                if (null != oMar.Left) {
                    oSectPr.Left = oMar.Left;
                }
                if (null != oMar.Right) {
                    oSectPr.Right = oMar.Right;
                }
                if (null != oMar.Top) {
                    oSectPr.Top = oMar.Top;
                }
                if (null != oMar.Bottom) {
                    oSectPr.Bottom = oMar.Bottom;
                }
            } else {
                if (c_oSerProp_secPrType.setting === type) {
                    res = this.bcr.Read2(length, function (t, l) {
                        return oThis.Read_setting(t, l);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.Read_setting = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerProp_secPrSettingsType.titlePg === type) {
            this.oReadResult.setting.titlePg = this.stream.GetUChar();
        } else {
            if (c_oSerProp_secPrSettingsType.EvenAndOddHeaders === type) {
                this.oReadResult.setting.EvenAndOddHeaders = this.stream.GetUChar();
            } else {
                res = c_oSerConstants.ReadUnknown;
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
    this.Read_pgMar = function (type, length, oMar) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_pgMarType.Left === type) {
            oMar.Left = this.bcr.ReadDouble();
        } else {
            if (c_oSer_pgMarType.Top === type) {
                oMar.Top = this.bcr.ReadDouble();
            } else {
                if (c_oSer_pgMarType.Right === type) {
                    oMar.Right = this.bcr.ReadDouble();
                } else {
                    if (c_oSer_pgMarType.Bottom === type) {
                        oMar.Bottom = this.bcr.ReadDouble();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
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
                var _embedded_fonts = new Array();
                for (var i = 0; i < _count; i++) {
                    var _at = this.stream.GetUChar();
                    if (_at != g_nodeAttributeStart) {
                        break;
                    }
                    var _f_i = new Object();
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
            var oNewComment = new Object();
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
                                    oNewImage.Replies = new Array();
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
            var oNewComment = new Object();
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
                res = c_oSerConstants.ReadUnknown;
            }
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
    this.CharArray = new Object();
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
        var _index = window.g_map_font_index[family];
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
        var font_info = window.g_font_infos[_index];
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