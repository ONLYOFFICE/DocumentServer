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
    Version: 2,
    Signature: "XLSY"
};
var g_nCurFileVersion = c_oSerFormat.Version;
var c_oSerTableTypes = {
    Other: 0,
    SharedStrings: 1,
    Styles: 2,
    Workbook: 3,
    Worksheets: 4,
    CalcChain: 5
};
var c_oSerStylesTypes = {
    Borders: 0,
    Border: 1,
    CellXfs: 2,
    Xfs: 3,
    Fills: 4,
    Fill: 5,
    Fonts: 6,
    Font: 7,
    NumFmts: 8,
    NumFmt: 9,
    Dxfs: 10,
    Dxf: 11,
    TableStyles: 12,
    CellStyleXfs: 14,
    CellStyles: 15,
    CellStyle: 16
};
var c_oSerBorderTypes = {
    Bottom: 0,
    Diagonal: 1,
    End: 2,
    Horizontal: 3,
    Start: 4,
    Top: 5,
    Vertical: 6,
    DiagonalDown: 7,
    DiagonalUp: 8,
    Outline: 9
};
var c_oSerBorderPropTypes = {
    Color: 0,
    Style: 1
};
var c_oSerXfsTypes = {
    ApplyAlignment: 0,
    ApplyBorder: 1,
    ApplyFill: 2,
    ApplyFont: 3,
    ApplyNumberFormat: 4,
    ApplyProtection: 5,
    BorderId: 6,
    FillId: 7,
    FontId: 8,
    NumFmtId: 9,
    PivotButton: 10,
    QuotePrefix: 11,
    XfId: 12,
    Aligment: 13,
    Protection: 14
};
var c_oSerAligmentTypes = {
    Horizontal: 0,
    Indent: 1,
    JustifyLastLine: 2,
    ReadingOrder: 3,
    RelativeIndent: 4,
    ShrinkToFit: 5,
    TextRotation: 6,
    Vertical: 7,
    WrapText: 8
};
var c_oSerFillTypes = {
    PatternFill: 0,
    PatternFillBgColor: 1
};
var c_oSerFontTypes = {
    Bold: 0,
    Color: 1,
    Italic: 3,
    RFont: 4,
    Strike: 5,
    Sz: 6,
    Underline: 7,
    VertAlign: 8,
    Scheme: 9
};
var c_oSerNumFmtTypes = {
    FormatCode: 0,
    NumFmtId: 1
};
var c_oSerSharedStringTypes = {
    Si: 0,
    Run: 1,
    RPr: 2,
    Text: 3
};
var c_oSerWorkbookTypes = {
    WorkbookPr: 0,
    BookViews: 1,
    WorkbookView: 2,
    DefinedNames: 3,
    DefinedName: 4
};
var c_oSerWorkbookPrTypes = {
    Date1904: 0,
    DateCompatibility: 1
};
var c_oSerWorkbookViewTypes = {
    ActiveTab: 0
};
var c_oSerDefinedNameTypes = {
    Name: 0,
    Ref: 1,
    LocalSheetId: 2
};
var c_oSerWorksheetsTypes = {
    Worksheet: 0,
    WorksheetProp: 1,
    Cols: 2,
    Col: 3,
    Dimension: 4,
    Hyperlinks: 5,
    Hyperlink: 6,
    MergeCells: 7,
    MergeCell: 8,
    SheetData: 9,
    Row: 10,
    SheetFormatPr: 11,
    Drawings: 12,
    Drawing: 13,
    PageMargins: 14,
    PageSetup: 15,
    PrintOptions: 16,
    Autofilter: 17,
    TableParts: 18,
    Comments: 19,
    Comment: 20,
    ConditionalFormatting: 21,
    SheetViews: 22,
    SheetView: 23,
    SheetPr: 24
};
var c_oSerWorksheetPropTypes = {
    Name: 0,
    SheetId: 1,
    State: 2
};
var c_oSerWorksheetColTypes = {
    BestFit: 0,
    Hidden: 1,
    Max: 2,
    Min: 3,
    Style: 4,
    Width: 5,
    CustomWidth: 6
};
var c_oSerHyperlinkTypes = {
    Ref: 0,
    Hyperlink: 1,
    Location: 2,
    Tooltip: 3
};
var c_oSerSheetFormatPrTypes = {
    DefaultColWidth: 0,
    DefaultRowHeight: 1,
    BaseColWidth: 2
};
var c_oSerRowTypes = {
    Row: 0,
    Style: 1,
    Height: 2,
    Hidden: 3,
    Cells: 4,
    Cell: 5,
    CustomHeight: 6
};
var c_oSerCellTypes = {
    Ref: 0,
    Style: 1,
    Type: 2,
    Value: 3,
    Formula: 4
};
var c_oSerFormulaTypes = {
    Aca: 0,
    Bx: 1,
    Ca: 2,
    Del1: 3,
    Del2: 4,
    Dt2D: 5,
    Dtr: 6,
    R1: 7,
    R2: 8,
    Ref: 9,
    Si: 10,
    T: 11,
    Text: 12
};
var c_oSer_DrawingFromToType = {
    Col: 0,
    ColOff: 1,
    Row: 2,
    RowOff: 3
};
var c_oSer_DrawingPosType = {
    X: 0,
    Y: 1
};
var c_oSer_DrawingExtType = {
    Cx: 0,
    Cy: 1
};
var c_oSer_OtherType = {
    Media: 0,
    MediaItem: 1,
    MediaId: 2,
    MediaSrc: 3,
    EmbeddedFonts: 4,
    Theme: 5
};
var c_oSer_CalcChainType = {
    CalcChainItem: 0,
    Array: 1,
    SheetId: 2,
    DependencyLevel: 3,
    Ref: 4,
    ChildChain: 5,
    NewThread: 6
};
var c_oSer_ColorObjectType = {
    Rgb: 0,
    Type: 1,
    Theme: 2,
    Tint: 3
};
var c_oSer_ColorType = {
    Auto: 0
};
var c_oSer_PageMargins = {
    Left: 0,
    Top: 1,
    Right: 2,
    Bottom: 3,
    Header: 4,
    Footer: 5
};
var c_oSer_PageSetup = {
    Orientation: 0,
    PaperSize: 1
};
var c_oSer_PrintOptions = {
    GridLines: 0,
    Headings: 1
};
var c_oSer_TablePart = {
    Table: 0,
    Ref: 1,
    TotalsRowCount: 2,
    DisplayName: 3,
    AutoFilter: 4,
    SortState: 5,
    TableColumns: 6,
    TableStyleInfo: 7,
    HeaderRowCount: 8
};
var c_oSer_TableStyleInfo = {
    Name: 0,
    ShowColumnStripes: 1,
    ShowRowStripes: 2,
    ShowFirstColumn: 3,
    ShowLastColumn: 4
};
var c_oSer_TableColumns = {
    TableColumn: 0,
    Name: 1,
    DataDxfId: 2,
    TotalsRowLabel: 3,
    TotalsRowFunction: 4,
    TotalsRowFormula: 5,
    CalculatedColumnFormula: 6
};
var c_oSer_SortState = {
    Ref: 0,
    CaseSensitive: 1,
    SortConditions: 2,
    SortCondition: 3,
    ConditionRef: 4,
    ConditionSortBy: 5,
    ConditionDescending: 6,
    ConditionDxfId: 7
};
var c_oSer_AutoFilter = {
    Ref: 0,
    FilterColumns: 1,
    FilterColumn: 2,
    SortState: 3
};
var c_oSer_FilterColumn = {
    ColId: 0,
    Filters: 1,
    Filter: 2,
    DateGroupItem: 3,
    CustomFilters: 4,
    ColorFilter: 5,
    Top10: 6,
    DynamicFilter: 7,
    HiddenButton: 8,
    ShowButton: 9,
    FiltersBlank: 10
};
var c_oSer_Filter = {
    Val: 0
};
var c_oSer_DateGroupItem = {
    DateTimeGrouping: 0,
    Day: 1,
    Hour: 2,
    Minute: 3,
    Month: 4,
    Second: 5,
    Year: 6
};
var c_oSer_CustomFilters = {
    And: 0,
    CustomFilters: 1,
    CustomFilter: 2,
    Operator: 3,
    Val: 4
};
var c_oSer_DynamicFilter = {
    Type: 0,
    Val: 1,
    MaxVal: 2
};
var c_oSer_ColorFilter = {
    CellColor: 0,
    DxfId: 1
};
var c_oSer_Top10 = {
    FilterVal: 0,
    Percent: 1,
    Top: 2,
    Val: 3
};
var c_oSer_Dxf = {
    Alignment: 0,
    Border: 1,
    Fill: 2,
    Font: 3,
    NumFmt: 4
};
var c_oSer_TableStyles = {
    DefaultTableStyle: 0,
    DefaultPivotStyle: 1,
    TableStyles: 2,
    TableStyle: 3
};
var c_oSer_TableStyle = {
    Name: 0,
    Pivot: 1,
    Table: 2,
    Elements: 3,
    Element: 4,
    DisplayName: 5
};
var c_oSer_TableStyleElement = {
    DxfId: 0,
    Size: 1,
    Type: 2
};
var c_oSer_Comments = {
    Row: 0,
    Col: 1,
    CommentDatas: 2,
    CommentData: 3,
    Left: 4,
    LeftOffset: 5,
    Top: 6,
    TopOffset: 7,
    Right: 8,
    RightOffset: 9,
    Bottom: 10,
    BottomOffset: 11,
    LeftMM: 12,
    TopMM: 13,
    WidthMM: 14,
    HeightMM: 15,
    MoveWithCells: 16,
    SizeWithCells: 17
};
var c_oSer_CommentData = {
    Text: 0,
    Time: 1,
    UserId: 2,
    UserName: 3,
    QuoteText: 4,
    Solved: 5,
    Document: 6,
    Replies: 7,
    Reply: 8
};
var c_oSer_ConditionalFormatting = {
    Pivot: 0,
    SqRef: 1,
    ConditionalFormattingRule: 2
};
var c_oSer_ConditionalFormattingRule = {
    AboveAverage: 0,
    Bottom: 1,
    DxfId: 2,
    EqualAverage: 3,
    Operator: 4,
    Percent: 5,
    Priority: 6,
    Rank: 7,
    StdDev: 8,
    StopIfTrue: 9,
    Text: 10,
    TimePeriod: 11,
    Type: 12,
    ColorScale: 14,
    DataBar: 15,
    FormulaCF: 16,
    IconSet: 17
};
var c_oSer_ConditionalFormattingRuleColorScale = {
    CFVO: 0,
    Color: 1
};
var c_oSer_ConditionalFormattingDataBar = {
    CFVO: 0,
    Color: 1,
    MaxLength: 2,
    MinLength: 3,
    ShowValue: 4
};
var c_oSer_ConditionalFormattingIconSet = {
    CFVO: 0,
    IconSet: 1,
    Percent: 2,
    Reverse: 3,
    ShowValue: 4
};
var c_oSer_ConditionalFormattingValueObject = {
    Gte: 0,
    Type: 1,
    Val: 2
};
var c_oSer_SheetView = {
    ColorId: 0,
    DefaultGridColor: 1,
    RightToLeft: 2,
    ShowFormulas: 3,
    ShowGridLines: 4,
    ShowOutlineSymbols: 5,
    ShowRowColHeaders: 6,
    ShowRuler: 7,
    ShowWhiteSpace: 8,
    ShowZeros: 9,
    TabSelected: 10,
    TopLeftCell: 11,
    View: 12,
    WindowProtection: 13,
    WorkbookViewId: 14,
    ZoomScale: 15,
    ZoomScaleNormal: 16,
    ZoomScalePageLayoutView: 17,
    ZoomScaleSheetLayoutView: 18
};
var c_oSer_CellStyle = {
    BuiltinId: 0,
    CustomBuiltin: 1,
    Hidden: 2,
    ILevel: 3,
    Name: 4,
    XfId: 5
};
var c_oSer_SheetPr = {
    CodeName: 0,
    EnableFormatConditionsCalculation: 1,
    FilterMode: 2,
    Published: 3,
    SyncHorizontal: 4,
    SyncRef: 5,
    SyncVertical: 6,
    TransitionEntry: 7,
    TransitionEvaluation: 8,
    TabColor: 9
};
var EBorderStyle = {
    borderstyleDashDot: 0,
    borderstyleDashDotDot: 1,
    borderstyleDashed: 2,
    borderstyleDotted: 3,
    borderstyleDouble: 4,
    borderstyleHair: 5,
    borderstyleMedium: 6,
    borderstyleMediumDashDot: 7,
    borderstyleMediumDashDotDot: 8,
    borderstyleMediumDashed: 9,
    borderstyleNone: 10,
    borderstyleSlantDashDot: 11,
    borderstyleThick: 12,
    borderstyleThin: 13
};
var EUnderline = {
    underlineDouble: 0,
    underlineDoubleAccounting: 1,
    underlineNone: 2,
    underlineSingle: 3,
    underlineSingleAccounting: 4
};
var EVerticalAlignRun = {
    verticalalignrunBaseline: 0,
    verticalalignrunSubscript: 1,
    verticalalignrunSuperscript: 2
};
var ECellAnchorType = {
    cellanchorAbsolute: 0,
    cellanchorOneCell: 1,
    cellanchorTwoCell: 2
};
var EVisibleType = {
    visibleHidden: 0,
    visibleVeryHidden: 1,
    visibleVisible: 2
};
var EHorizontalAlignment = {
    horizontalalignmentCenter: 0,
    horizontalalignmentcenterContinuous: 1,
    horizontalalignmentDistributed: 2,
    horizontalalignmentFill: 3,
    horizontalalignmentGeneral: 4,
    horizontalalignmentJustify: 5,
    horizontalalignmentLeft: 6,
    horizontalalignmentRight: 7
};
var EVerticalAlignment = {
    verticalalignmentBottom: 0,
    verticalalignmentCenter: 1,
    verticalalignmentDistributed: 2,
    verticalalignmentJustify: 3,
    verticalalignmentTop: 4
};
var ECellTypeType = {
    celltypeBool: 0,
    celltypeDate: 1,
    celltypeError: 2,
    celltypeInlineStr: 3,
    celltypeNumber: 4,
    celltypeSharedString: 5,
    celltypeStr: 6
};
var ECellFormulaType = {
    cellformulatypeArray: 0,
    cellformulatypeDataTable: 1,
    cellformulatypeNormal: 2,
    cellformulatypeShared: 3
};
var EPageOrientation = {
    pageorientLandscape: 0,
    pageorientPortrait: 1
};
var EPageSize = {
    pagesizeLetterPaper: 1,
    pagesizeLetterSmall: 2,
    pagesizeTabloidPaper: 3,
    pagesizeLedgerPaper: 4,
    pagesizeLegalPaper: 5,
    pagesizeStatementPaper: 6,
    pagesizeExecutivePaper: 7,
    pagesizeA3Paper: 8,
    pagesizeA4Paper: 9,
    pagesizeA4SmallPaper: 10,
    pagesizeA5Paper: 11,
    pagesizeB4Paper: 12,
    pagesizeB5Paper: 13,
    pagesizeFolioPaper: 14,
    pagesizeQuartoPaper: 15,
    pagesizeStandardPaper1: 16,
    pagesizeStandardPaper2: 17,
    pagesizeNotePaper: 18,
    pagesize9Envelope: 19,
    pagesize10Envelope: 20,
    pagesize11Envelope: 21,
    pagesize12Envelope: 22,
    pagesize14Envelope: 23,
    pagesizeCPaper: 24,
    pagesizeDPaper: 25,
    pagesizeEPaper: 26,
    pagesizeDLEnvelope: 27,
    pagesizeC5Envelope: 28,
    pagesizeC3Envelope: 29,
    pagesizeC4Envelope: 30,
    pagesizeC6Envelope: 31,
    pagesizeC65Envelope: 32,
    pagesizeB4Envelope: 33,
    pagesizeB5Envelope: 34,
    pagesizeB6Envelope: 35,
    pagesizeItalyEnvelope: 36,
    pagesizeMonarchEnvelope: 37,
    pagesize6_3_4Envelope: 38,
    pagesizeUSStandardFanfold: 39,
    pagesizeGermanStandardFanfold: 40,
    pagesizeGermanLegalFanfold: 41,
    pagesizeISOB4: 42,
    pagesizeJapaneseDoublePostcard: 43,
    pagesizeStandardPaper3: 44,
    pagesizeStandardPaper4: 45,
    pagesizeStandardPaper5: 46,
    pagesizeInviteEnvelope: 47,
    pagesizeLetterExtraPaper: 50,
    pagesizeLegalExtraPaper: 51,
    pagesizeTabloidExtraPaper: 52,
    pagesizeA4ExtraPaper: 53,
    pagesizeLetterTransversePaper: 54,
    pagesizeA4TransversePaper: 55,
    pagesizeLetterExtraTransversePaper: 56,
    pagesizeSuperA_SuperA_A4Paper: 57,
    pagesizeSuperB_SuperB_A3Paper: 58,
    pagesizeLetterPlusPaper: 59,
    pagesizeA4PlusPaper: 60,
    pagesizeA5TransversePaper: 61,
    pagesizeJISB5TransversePaper: 62,
    pagesizeA3ExtraPaper: 63,
    pagesizeA5ExtraPaper: 64,
    pagesizeISOB5ExtraPaper: 65,
    pagesizeA2Paper: 66,
    pagesizeA3TransversePaper: 67,
    pagesizeA3ExtraTransversePaper: 68
};
var ETotalsRowFunction = {
    totalrowfunctionAverage: 1,
    totalrowfunctionCount: 2,
    totalrowfunctionCountNums: 3,
    totalrowfunctionCustom: 4,
    totalrowfunctionMax: 5,
    totalrowfunctionMin: 6,
    totalrowfunctionNone: 7,
    totalrowfunctionStdDev: 8,
    totalrowfunctionSum: 9,
    totalrowfunctionVar: 10
};
var ESortBy = {
    sortbyCellColor: 1,
    sortbyFontColor: 2,
    sortbyIcon: 3,
    sortbyValue: 4
};
var ECustomFilter = {
    customfilterEqual: 1,
    customfilterGreaterThan: 2,
    customfilterGreaterThanOrEqual: 3,
    customfilterLessThan: 4,
    customfilterLessThanOrEqual: 5,
    customfilterNotEqual: 6
};
var EDateTimeGroup = {
    datetimegroupDay: 1,
    datetimegroupHour: 2,
    datetimegroupMinute: 3,
    datetimegroupMonth: 4,
    datetimegroupSecond: 5,
    datetimegroupYear: 6
};
var ETableStyleType = {
    tablestyletypeBlankRow: 0,
    tablestyletypeFirstColumn: 1,
    tablestyletypeFirstColumnStripe: 2,
    tablestyletypeFirstColumnSubheading: 3,
    tablestyletypeFirstHeaderCell: 4,
    tablestyletypeFirstRowStripe: 5,
    tablestyletypeFirstRowSubheading: 6,
    tablestyletypeFirstSubtotalColumn: 7,
    tablestyletypeFirstSubtotalRow: 8,
    tablestyletypeFirstTotalCell: 9,
    tablestyletypeHeaderRow: 10,
    tablestyletypeLastColumn: 11,
    tablestyletypeLastHeaderCell: 12,
    tablestyletypeLastTotalCell: 13,
    tablestyletypePageFieldLabels: 14,
    tablestyletypePageFieldValues: 15,
    tablestyletypeSecondColumnStripe: 16,
    tablestyletypeSecondColumnSubheading: 17,
    tablestyletypeSecondRowStripe: 18,
    tablestyletypeSecondRowSubheading: 19,
    tablestyletypeSecondSubtotalColumn: 20,
    tablestyletypeSecondSubtotalRow: 21,
    tablestyletypeThirdColumnSubheading: 22,
    tablestyletypeThirdRowSubheading: 23,
    tablestyletypeThirdSubtotalColumn: 24,
    tablestyletypeThirdSubtotalRow: 25,
    tablestyletypeTotalRow: 26,
    tablestyletypeWholeTable: 27
};
var EFontScheme = {
    fontschemeMajor: 0,
    fontschemeMinor: 1,
    fontschemeNone: 2
};
var DocumentPageSize = new
function () {
    this.oSizes = [{
        id: EPageSize.pagesizeLetterPaper,
        w_mm: 215.9,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeLetterSmall,
        w_mm: 215.9,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeTabloidPaper,
        w_mm: 279.4,
        h_mm: 431.7
    },
    {
        id: EPageSize.pagesizeLedgerPaper,
        w_mm: 431.8,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeLegalPaper,
        w_mm: 215.9,
        h_mm: 355.6
    },
    {
        id: EPageSize.pagesizeStatementPaper,
        w_mm: 495.3,
        h_mm: 215.9
    },
    {
        id: EPageSize.pagesizeExecutivePaper,
        w_mm: 184.2,
        h_mm: 266.7
    },
    {
        id: EPageSize.pagesizeA3Paper,
        w_mm: 297,
        h_mm: 420.1
    },
    {
        id: EPageSize.pagesizeA4Paper,
        w_mm: 210,
        h_mm: 297
    },
    {
        id: EPageSize.pagesizeA4SmallPaper,
        w_mm: 210,
        h_mm: 297
    },
    {
        id: EPageSize.pagesizeA5Paper,
        w_mm: 148.1,
        h_mm: 209.9
    },
    {
        id: EPageSize.pagesizeB4Paper,
        w_mm: 250,
        h_mm: 353
    },
    {
        id: EPageSize.pagesizeB5Paper,
        w_mm: 176,
        h_mm: 250.1
    },
    {
        id: EPageSize.pagesizeFolioPaper,
        w_mm: 215.9,
        h_mm: 330.2
    },
    {
        id: EPageSize.pagesizeQuartoPaper,
        w_mm: 215,
        h_mm: 275
    },
    {
        id: EPageSize.pagesizeStandardPaper1,
        w_mm: 254,
        h_mm: 355.6
    },
    {
        id: EPageSize.pagesizeStandardPaper2,
        w_mm: 279.4,
        h_mm: 431.8
    },
    {
        id: EPageSize.pagesizeNotePaper,
        w_mm: 215.9,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesize9Envelope,
        w_mm: 98.40000000000001,
        h_mm: 225.4
    },
    {
        id: EPageSize.pagesize10Envelope,
        w_mm: 104.8,
        h_mm: 241.3
    },
    {
        id: EPageSize.pagesize11Envelope,
        w_mm: 114.3,
        h_mm: 263.5
    },
    {
        id: EPageSize.pagesize12Envelope,
        w_mm: 120.7,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesize14Envelope,
        w_mm: 127,
        h_mm: 292.1
    },
    {
        id: EPageSize.pagesizeCPaper,
        w_mm: 431.8,
        h_mm: 558.8
    },
    {
        id: EPageSize.pagesizeDPaper,
        w_mm: 558.8,
        h_mm: 863.6
    },
    {
        id: EPageSize.pagesizeEPaper,
        w_mm: 863.6,
        h_mm: 1117.6
    },
    {
        id: EPageSize.pagesizeDLEnvelope,
        w_mm: 110.1,
        h_mm: 220.1
    },
    {
        id: EPageSize.pagesizeC5Envelope,
        w_mm: 162,
        h_mm: 229
    },
    {
        id: EPageSize.pagesizeC3Envelope,
        w_mm: 324,
        h_mm: 458
    },
    {
        id: EPageSize.pagesizeC4Envelope,
        w_mm: 229,
        h_mm: 324
    },
    {
        id: EPageSize.pagesizeC6Envelope,
        w_mm: 114,
        h_mm: 162
    },
    {
        id: EPageSize.pagesizeC65Envelope,
        w_mm: 114,
        h_mm: 229
    },
    {
        id: EPageSize.pagesizeB4Envelope,
        w_mm: 250,
        h_mm: 353
    },
    {
        id: EPageSize.pagesizeB5Envelope,
        w_mm: 176,
        h_mm: 250
    },
    {
        id: EPageSize.pagesizeB6Envelope,
        w_mm: 176,
        h_mm: 125
    },
    {
        id: EPageSize.pagesizeItalyEnvelope,
        w_mm: 110,
        h_mm: 230
    },
    {
        id: EPageSize.pagesizeMonarchEnvelope,
        w_mm: 98.40000000000001,
        h_mm: 190.5
    },
    {
        id: EPageSize.pagesize6_3_4Envelope,
        w_mm: 92.09999999999999,
        h_mm: 165.1
    },
    {
        id: EPageSize.pagesizeUSStandardFanfold,
        w_mm: 377.8,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeGermanStandardFanfold,
        w_mm: 215.9,
        h_mm: 304.8
    },
    {
        id: EPageSize.pagesizeGermanLegalFanfold,
        w_mm: 215.9,
        h_mm: 330.2
    },
    {
        id: EPageSize.pagesizeISOB4,
        w_mm: 250,
        h_mm: 353
    },
    {
        id: EPageSize.pagesizeJapaneseDoublePostcard,
        w_mm: 200,
        h_mm: 148
    },
    {
        id: EPageSize.pagesizeStandardPaper3,
        w_mm: 228.6,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeStandardPaper4,
        w_mm: 254,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeStandardPaper5,
        w_mm: 381,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeInviteEnvelope,
        w_mm: 220,
        h_mm: 220
    },
    {
        id: EPageSize.pagesizeLetterExtraPaper,
        w_mm: 235.6,
        h_mm: 304.8
    },
    {
        id: EPageSize.pagesizeLegalExtraPaper,
        w_mm: 235.6,
        h_mm: 381
    },
    {
        id: EPageSize.pagesizeTabloidExtraPaper,
        w_mm: 296.9,
        h_mm: 457.2
    },
    {
        id: EPageSize.pagesizeA4ExtraPaper,
        w_mm: 236,
        h_mm: 322
    },
    {
        id: EPageSize.pagesizeLetterTransversePaper,
        w_mm: 210.2,
        h_mm: 279.4
    },
    {
        id: EPageSize.pagesizeA4TransversePaper,
        w_mm: 210,
        h_mm: 297
    },
    {
        id: EPageSize.pagesizeLetterExtraTransversePaper,
        w_mm: 235.6,
        h_mm: 304.8
    },
    {
        id: EPageSize.pagesizeSuperA_SuperA_A4Paper,
        w_mm: 227,
        h_mm: 356
    },
    {
        id: EPageSize.pagesizeSuperB_SuperB_A3Paper,
        w_mm: 305,
        h_mm: 487
    },
    {
        id: EPageSize.pagesizeLetterPlusPaper,
        w_mm: 215.9,
        h_mm: 12.69
    },
    {
        id: EPageSize.pagesizeA4PlusPaper,
        w_mm: 210,
        h_mm: 330
    },
    {
        id: EPageSize.pagesizeA5TransversePaper,
        w_mm: 148,
        h_mm: 210
    },
    {
        id: EPageSize.pagesizeJISB5TransversePaper,
        w_mm: 182,
        h_mm: 257
    },
    {
        id: EPageSize.pagesizeA3ExtraPaper,
        w_mm: 322,
        h_mm: 445
    },
    {
        id: EPageSize.pagesizeA5ExtraPaper,
        w_mm: 174,
        h_mm: 235
    },
    {
        id: EPageSize.pagesizeISOB5ExtraPaper,
        w_mm: 201,
        h_mm: 276
    },
    {
        id: EPageSize.pagesizeA2Paper,
        w_mm: 420,
        h_mm: 594
    },
    {
        id: EPageSize.pagesizeA3TransversePaper,
        w_mm: 297,
        h_mm: 420
    },
    {
        id: EPageSize.pagesizeA3ExtraTransversePaper,
        w_mm: 322,
        h_mm: 445
    }];
    this.getSizeByWH = function (widthMm, heightMm) {
        for (index in this.oSizes) {
            var item = this.oSizes[index];
            if (widthMm == item.w_mm && heightMm == item.h_mm) {
                return item;
            }
        }
        return this.oSizes[8];
    };
    this.getSizeById = function (id) {
        for (index in this.oSizes) {
            var item = this.oSizes[index];
            if (id == item.id) {
                return item;
            }
        }
        return this.oSizes[8];
    };
};
var g_nodeAttributeStart = 250;
var g_nodeAttributeEnd = 251;
function BinaryTableWriter(memory, aDxfs) {
    this.memory = memory;
    this.aDxfs = aDxfs;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function (aTables) {
        var oThis = this;
        for (var i = 0, length = aTables.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_TablePart.Table, function () {
                oThis.WriteTable(aTables[i]);
            });
        }
    };
    this.WriteTable = function (table) {
        var oThis = this;
        if (null != table.Ref) {
            this.memory.WriteByte(c_oSer_TablePart.Ref);
            this.memory.WriteString2(table.Ref);
        }
        if (null != table.HeaderRowCount) {
            this.bs.WriteItem(c_oSer_TablePart.HeaderRowCount, function () {
                oThis.memory.WriteLong(table.HeaderRowCount);
            });
        }
        if (null != table.TotalsRowCount) {
            this.bs.WriteItem(c_oSer_TablePart.TotalsRowCount, function () {
                oThis.memory.WriteLong(table.TotalsRowCount);
            });
        }
        if (null != table.DisplayName) {
            this.memory.WriteByte(c_oSer_TablePart.DisplayName);
            this.memory.WriteString2(table.DisplayName);
        }
        if (null != table.AutoFilter) {
            this.bs.WriteItem(c_oSer_TablePart.AutoFilter, function () {
                oThis.WriteAutoFilter(table.AutoFilter);
            });
        }
        if (null != table.SortState) {
            this.bs.WriteItem(c_oSer_TablePart.SortState, function () {
                oThis.WriteSortState(table.SortState);
            });
        }
        if (null != table.TableColumns) {
            this.bs.WriteItem(c_oSer_TablePart.TableColumns, function () {
                oThis.WriteTableColumns(table.TableColumns);
            });
        }
        if (null != table.TableStyleInfo) {
            this.bs.WriteItem(c_oSer_TablePart.TableStyleInfo, function () {
                oThis.WriteTableStyleInfo(table.TableStyleInfo);
            });
        }
    };
    this.WriteAutoFilter = function (autofilter) {
        var oThis = this;
        if (null != autofilter.Ref) {
            this.memory.WriteByte(c_oSer_AutoFilter.Ref);
            this.memory.WriteString2(autofilter.Ref);
        }
        if (null != autofilter.FilterColumns) {
            this.bs.WriteItem(c_oSer_AutoFilter.FilterColumns, function () {
                oThis.WriteFilterColumns(autofilter.FilterColumns);
            });
        }
        if (null != autofilter.SortState) {
            this.bs.WriteItem(c_oSer_AutoFilter.SortState, function () {
                oThis.WriteSortState(autofilter.SortState);
            });
        }
    };
    this.WriteFilterColumns = function (filterColumns) {
        var oThis = this;
        for (var i = 0, length = filterColumns.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_AutoFilter.FilterColumn, function () {
                oThis.WriteFilterColumn(filterColumns[i]);
            });
        }
    };
    this.WriteFilterColumn = function (filterColumn) {
        var oThis = this;
        if (null != filterColumn.ColId) {
            this.bs.WriteItem(c_oSer_FilterColumn.ColId, function () {
                oThis.memory.WriteLong(filterColumn.ColId);
            });
        }
        if (null != filterColumn.Filters) {
            this.bs.WriteItem(c_oSer_FilterColumn.Filters, function () {
                oThis.WriteFilters(filterColumn.Filters);
            });
        }
        if (null != filterColumn.CustomFiltersObj) {
            this.bs.WriteItem(c_oSer_FilterColumn.CustomFilters, function () {
                oThis.WriteCustomFilters(filterColumn.CustomFiltersObj);
            });
        }
        if (null != filterColumn.DynamicFilter) {
            this.bs.WriteItem(c_oSer_FilterColumn.DynamicFilter, function () {
                oThis.WriteDynamicFilter(filterColumn.DynamicFilter);
            });
        }
        if (null != filterColumn.ColorFilter) {
            this.bs.WriteItem(c_oSer_FilterColumn.ColorFilter, function () {
                oThis.WriteColorFilter(filterColumn.ColorFilter);
            });
        }
        if (null != filterColumn.Top10) {
            this.bs.WriteItem(c_oSer_FilterColumn.Top10, function () {
                oThis.WriteTop10(filterColumn.Top10);
            });
        }
        if (null != filterColumn.ShowButton) {
            this.bs.WriteItem(c_oSer_FilterColumn.ShowButton, function () {
                oThis.memory.WriteBool(filterColumn.ShowButton);
            });
        }
    };
    this.WriteFilters = function (filters) {
        var oThis = this;
        if (null != filters.Values) {
            for (var i = 0, length = filters.Values.length; i < length; ++i) {
                this.bs.WriteItem(c_oSer_FilterColumn.Filter, function () {
                    oThis.WriteFilter(filters.Values[i]);
                });
            }
        }
        if (null != filters.Dates) {
            for (var i = 0, length = filters.Dates.length; i < length; ++i) {
                this.bs.WriteItem(c_oSer_FilterColumn.DateGroupItem, function () {
                    oThis.WriteDateGroupItem(filters.Dates[i]);
                });
            }
        }
        if (null != filters.Blank) {
            this.bs.WriteItem(c_oSer_FilterColumn.FiltersBlank, function () {
                oThis.memory.WriteBool(filters.Blank);
            });
        }
    };
    this.WriteFilter = function (val) {
        var oThis = this;
        if (null != val) {
            this.memory.WriteByte(c_oSer_Filter.Val);
            this.memory.WriteString2(val);
        }
    };
    this.WriteDateGroupItem = function (dateGroupItem) {
        var oThis = this;
        if (null != dateGroupItem.DateTimeGrouping) {
            this.memory.WriteByte(c_oSer_DateGroupItem.DateTimeGrouping);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(dateGroupItem.DateTimeGrouping);
        }
        if (null != dateGroupItem.Day) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Day);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Day);
        }
        if (null != dateGroupItem.Hour) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Hour);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Hour);
        }
        if (null != dateGroupItem.Minute) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Minute);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Minute);
        }
        if (null != dateGroupItem.Month) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Month);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Month);
        }
        if (null != dateGroupItem.Second) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Second);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Second);
        }
        if (null != dateGroupItem.Year) {
            this.memory.WriteByte(c_oSer_DateGroupItem.Year);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(dateGroupItem.Year);
        }
    };
    this.WriteCustomFilters = function (customFilters) {
        var oThis = this;
        if (null != customFilters.And) {
            this.bs.WriteItem(c_oSer_CustomFilters.And, function () {
                oThis.memory.WriteBool(customFilters.And);
            });
        }
        if (null != customFilters.CustomFilters && customFilters.CustomFilters.length > 0) {
            this.bs.WriteItem(c_oSer_CustomFilters.CustomFilters, function () {
                oThis.WriteCustomFiltersItems(customFilters.CustomFilters);
            });
        }
    };
    this.WriteCustomFiltersItems = function (aCustomFilters) {
        var oThis = this;
        for (var i = 0, length = aCustomFilters.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_CustomFilters.CustomFilter, function () {
                oThis.WriteCustomFiltersItem(aCustomFilters[i]);
            });
        }
    };
    this.WriteCustomFiltersItem = function (customFilter) {
        var oThis = this;
        if (null != customFilter.Operator) {
            this.memory.WriteByte(c_oSer_CustomFilters.Operator);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(customFilter.Operator);
        }
        if (null != customFilter.Val) {
            this.memory.WriteByte(c_oSer_CustomFilters.Val);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(customFilter.Val);
        }
    };
    this.WriteDynamicFilter = function (dynamicFilter) {
        var oThis = this;
        if (null != dynamicFilter.Type) {
            this.memory.WriteByte(c_oSer_DynamicFilter.Type);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(dynamicFilter.Type);
        }
        if (null != dynamicFilter.Val) {
            this.memory.WriteByte(c_oSer_DynamicFilter.Val);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dynamicFilter.Val);
        }
        if (null != dynamicFilter.MaxVal) {
            this.memory.WriteByte(c_oSer_DynamicFilter.MaxVal);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dynamicFilter.MaxVal);
        }
    };
    this.WriteColorFilter = function (colorFilter) {
        var oThis = this;
        if (null != colorFilter.CellColor) {
            this.memory.WriteByte(c_oSer_ColorFilter.CellColor);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(colorFilter.CellColor);
        }
        if (null != colorFilter.dxf) {
            this.memory.WriteByte(c_oSer_ColorFilter.DxfId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(this.aDxfs.length);
            this.aDxfs.push(colorFilter.dxf);
        }
    };
    this.WriteTop10 = function (top10) {
        var oThis = this;
        if (null != top10.FilterVal) {
            this.memory.WriteByte(c_oSer_Top10.FilterVal);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(top10.FilterVal);
        }
        if (null != top10.Percent) {
            this.memory.WriteByte(c_oSer_Top10.Percent);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(top10.Percent);
        }
        if (null != top10.Top) {
            this.memory.WriteByte(c_oSer_Top10.Top);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(top10.Top);
        }
        if (null != top10.Val) {
            this.memory.WriteByte(c_oSer_Top10.Val);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(top10.Val);
        }
    };
    this.WriteSortState = function (sortState) {
        var oThis = this;
        if (null != sortState.Ref) {
            this.memory.WriteByte(c_oSer_SortState.Ref);
            this.memory.WriteString2(sortState.Ref);
        }
        if (null != sortState.CaseSensitive) {
            this.bs.WriteItem(c_oSer_SortState.CaseSensitive, function () {
                oThis.memory.WriteBool(sortState.CaseSensitive);
            });
        }
        if (null != sortState.SortConditions) {
            this.bs.WriteItem(c_oSer_SortState.SortConditions, function () {
                oThis.WriteSortConditions(sortState.SortConditions);
            });
        }
    };
    this.WriteSortConditions = function (sortConditions) {
        var oThis = this;
        for (var i = 0, length = sortConditions.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_SortState.SortCondition, function () {
                oThis.WriteSortCondition(sortConditions[i]);
            });
        }
    };
    this.WriteSortCondition = function (sortCondition) {
        var oThis = this;
        if (null != sortCondition.Ref) {
            this.memory.WriteByte(c_oSer_SortState.ConditionRef);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(sortCondition.Ref);
        }
        if (null != sortCondition.ConditionSortBy) {
            this.memory.WriteByte(c_oSer_SortState.ConditionSortBy);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(sortCondition.ConditionSortBy);
        }
        if (null != sortCondition.ConditionDescending) {
            this.memory.WriteByte(c_oSer_SortState.ConditionDescending);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(sortCondition.ConditionDescending);
        }
        if (null != sortCondition.dxf) {
            this.memory.WriteByte(c_oSer_SortState.ConditionDxfId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(this.aDxfs.length);
            this.aDxfs.push(sortCondition.dxf);
        }
    };
    this.WriteTableColumns = function (tableColumns) {
        var oThis = this;
        for (var i = 0, length = tableColumns.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_TableColumns.TableColumn, function () {
                oThis.WriteTableColumn(tableColumns[i]);
            });
        }
    };
    this.WriteTableColumn = function (tableColumn) {
        var oThis = this;
        if (null != tableColumn.Name) {
            this.memory.WriteByte(c_oSer_TableColumns.Name);
            this.memory.WriteString2(tableColumn.Name);
        }
        if (null != tableColumn.TotalsRowLabel) {
            this.memory.WriteByte(c_oSer_TableColumns.TotalsRowLabel);
            this.memory.WriteString2(tableColumn.TotalsRowLabel);
        }
        if (null != tableColumn.TotalsRowFunction) {
            this.bs.WriteItem(c_oSer_TableColumns.TotalsRowFunction, function () {
                oThis.memory.WriteByte(tableColumn.TotalsRowFunction);
            });
        }
        if (null != tableColumn.TotalsRowFormula) {
            this.memory.WriteByte(c_oSer_TableColumns.TotalsRowFormula);
            this.memory.WriteString2(tableColumn.TotalsRowFormula);
        }
        if (null != tableColumn.dxf) {
            this.bs.WriteItem(c_oSer_TableColumns.DataDxfId, function () {
                oThis.memory.WriteLong(oThis.aDxfs.length);
            });
            this.aDxfs.push(tableColumn.dxf);
        }
        if (null != tableColumn.CalculatedColumnFormula) {
            this.memory.WriteByte(c_oSer_TableColumns.CalculatedColumnFormula);
            this.memory.WriteString2(tableColumn.CalculatedColumnFormula);
        }
    };
    this.WriteTableStyleInfo = function (tableStyleInfo) {
        var oThis = this;
        if (null != tableStyleInfo.Name) {
            this.memory.WriteByte(c_oSer_TableStyleInfo.Name);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(tableStyleInfo.Name);
        }
        if (null != tableStyleInfo.ShowColumnStripes) {
            this.memory.WriteByte(c_oSer_TableStyleInfo.ShowColumnStripes);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(tableStyleInfo.ShowColumnStripes);
        }
        if (null != tableStyleInfo.ShowRowStripes) {
            this.memory.WriteByte(c_oSer_TableStyleInfo.ShowRowStripes);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(tableStyleInfo.ShowRowStripes);
        }
        if (null != tableStyleInfo.ShowFirstColumn) {
            this.memory.WriteByte(c_oSer_TableStyleInfo.ShowFirstColumn);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(tableStyleInfo.ShowFirstColumn);
        }
        if (null != tableStyleInfo.ShowLastColumn) {
            this.memory.WriteByte(c_oSer_TableStyleInfo.ShowLastColumn);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(tableStyleInfo.ShowLastColumn);
        }
    };
}
function BinarySharedStringsTableWriter(memory, oSharedStrings) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.bsw = new BinaryStylesTableWriter(this.memory);
    this.oSharedStrings = oSharedStrings;
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteSharedStringsContent();
        });
    };
    this.WriteSharedStringsContent = function () {
        var oThis = this;
        var aSharedStrings = new Array();
        for (var i in this.oSharedStrings.strings) {
            var item = this.oSharedStrings.strings[i];
            if (null != item.t) {
                aSharedStrings[item.t.id] = {
                    t: item.t.val
                };
            }
            if (null != item.a) {
                for (var j = 0, length2 = item.a.length; j < length2; ++j) {
                    var oCurText = item.a[j];
                    aSharedStrings[oCurText.id] = {
                        a: oCurText.val
                    };
                }
            }
        }
        for (var i = 0, length = aSharedStrings.length; i < length; ++i) {
            var si = aSharedStrings[i];
            if (null != si) {
                this.bs.WriteItem(c_oSerSharedStringTypes.Si, function () {
                    oThis.WriteSi(si);
                });
            }
        }
    };
    this.WriteSi = function (si) {
        var oThis = this;
        if (null != si.t) {
            this.memory.WriteByte(c_oSerSharedStringTypes.Text);
            this.memory.WriteString2(si.t);
        } else {
            if (null != si.a) {
                for (var i = 0, length = si.a.length; i < length; ++i) {
                    var run = si.a[i];
                    this.bs.WriteItem(c_oSerSharedStringTypes.Run, function () {
                        oThis.WriteRun(run);
                    });
                }
            }
        }
    };
    this.WriteRun = function (run) {
        var oThis = this;
        if (null != run.format) {
            this.bs.WriteItem(c_oSerSharedStringTypes.RPr, function () {
                oThis.bsw.WriteFont(run.format);
            });
        }
        if (null != run.text) {
            this.memory.WriteByte(c_oSerSharedStringTypes.Text);
            this.memory.WriteString2(run.text);
        }
    };
}
function BinaryStylesTableWriter(memory, wb, oBinaryWorksheetsTableWriter) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.wb = wb;
    this.aDxfs = null;
    this.oXfsStylesMap = null;
    this.oXfsMap = null;
    this.oFontMap = null;
    this.oFillMap = null;
    this.oBorderMap = null;
    this.oNumMap = null;
    this.oBinaryWorksheetsTableWriter = oBinaryWorksheetsTableWriter;
    if (null != oBinaryWorksheetsTableWriter) {
        this.aDxfs = oBinaryWorksheetsTableWriter.aDxfs;
        this.oXfsStylesMap = oBinaryWorksheetsTableWriter.oXfsStylesMap;
        this.oXfsMap = oBinaryWorksheetsTableWriter.oXfsMap;
        this.oFontMap = oBinaryWorksheetsTableWriter.oFontMap;
        this.oFillMap = oBinaryWorksheetsTableWriter.oFillMap;
        this.oBorderMap = oBinaryWorksheetsTableWriter.oBorderMap;
        this.oNumMap = oBinaryWorksheetsTableWriter.oNumMap;
    }
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteStylesContent();
        });
    };
    this.WriteStylesContent = function () {
        var oThis = this;
        var wb = this.wb;
        this.bs.WriteItem(c_oSerStylesTypes.Borders, function () {
            oThis.WriteBorders();
        });
        this.bs.WriteItem(c_oSerStylesTypes.Fills, function () {
            oThis.WriteFills();
        });
        this.bs.WriteItem(c_oSerStylesTypes.Fonts, function () {
            oThis.WriteFonts();
        });
        this.bs.WriteItem(c_oSerStylesTypes.CellStyleXfs, function () {
            oThis.WriteCellStyleXfs();
        });
        this.bs.WriteItem(c_oSerStylesTypes.CellXfs, function () {
            oThis.WriteCellXfs();
        });
        this.bs.WriteItem(c_oSerStylesTypes.CellStyles, function () {
            oThis.WriteCellStyles(wb.CellStyles.CustomStyles);
        });
        if (null != wb.TableStyles) {
            this.bs.WriteItem(c_oSerStylesTypes.TableStyles, function () {
                oThis.WriteTableStyles(wb.TableStyles);
            });
        }
        if (null != this.aDxfs && this.aDxfs.length > 0) {
            var oDxfsNumFormatToId = {};
            for (var i = 0, length = this.aDxfs.length; i < length; i++) {
                var dxf = this.aDxfs[i];
                if (dxf && dxf.num) {
                    oDxfsNumFormatToId[dxf.num.f] = this.oBinaryWorksheetsTableWriter.getNumIdByFormat(dxf.num);
                }
            }
            this.bs.WriteItem(c_oSerStylesTypes.Dxfs, function () {
                oThis.WriteDxfs(oThis.aDxfs, oDxfsNumFormatToId);
            });
        }
        this.bs.WriteItem(c_oSerStylesTypes.NumFmts, function () {
            oThis.WriteNumFmts();
        });
    };
    this.WriteBorders = function () {
        var oThis = this;
        var aBorders = new Array();
        for (var i in this.oBorderMap) {
            var elem = this.oBorderMap[i];
            aBorders[elem.index] = elem.val;
        }
        for (var i = 0, length = aBorders.length; i < length; ++i) {
            var border = aBorders[i];
            this.bs.WriteItem(c_oSerStylesTypes.Border, function () {
                oThis.WriteBorder(border.getDif(g_oDefaultBorderAbs));
            });
        }
    };
    this.WriteBorder = function (border) {
        if (null == border) {
            return;
        }
        var oThis = this;
        if (null != border.b) {
            this.bs.WriteItem(c_oSerBorderTypes.Bottom, function () {
                oThis.WriteBorderProp(border.b);
            });
        }
        if (null != border.d) {
            this.bs.WriteItem(c_oSerBorderTypes.Diagonal, function () {
                oThis.WriteBorderProp(border.d);
            });
        }
        if (null != border.r) {
            this.bs.WriteItem(c_oSerBorderTypes.End, function () {
                oThis.WriteBorderProp(border.r);
            });
        }
        if (null != border.h) {
            this.bs.WriteItem(c_oSerBorderTypes.Horizontal, function () {
                oThis.WriteBorderProp(border.h);
            });
        }
        if (null != border.l) {
            this.bs.WriteItem(c_oSerBorderTypes.Start, function () {
                oThis.WriteBorderProp(border.l);
            });
        }
        if (null != border.t) {
            this.bs.WriteItem(c_oSerBorderTypes.Top, function () {
                oThis.WriteBorderProp(border.t);
            });
        }
        if (null != border.v) {
            this.bs.WriteItem(c_oSerBorderTypes.Vertical, function () {
                oThis.WriteBorderProp(border.v);
            });
        }
        if (null != border.dd) {
            this.bs.WriteItem(c_oSerBorderTypes.DiagonalDown, function () {
                oThis.memory.WriteBool(border.dd);
            });
        }
        if (null != border.du) {
            this.bs.WriteItem(c_oSerBorderTypes.DiagonalUp, function () {
                oThis.memory.WriteBool(border.du);
            });
        }
    };
    this.WriteBorderProp = function (borderProp) {
        var oThis = this;
        if (null != borderProp.c) {
            this.memory.WriteByte(c_oSerBorderPropTypes.Color);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteColorSpreadsheet(borderProp.c);
            });
        }
        if (null != borderProp.s) {
            var nStyle = EBorderStyle.borderstyleNone;
            switch (borderProp.s) {
            case c_oAscBorderStyles.DashDot:
                nStyle = EBorderStyle.borderstyleDashDot;
                break;
            case c_oAscBorderStyles.DashDotDot:
                nStyle = EBorderStyle.borderstyleDashDotDot;
                break;
            case c_oAscBorderStyles.Dashed:
                nStyle = EBorderStyle.borderstyleDashed;
                break;
            case c_oAscBorderStyles.Dotted:
                nStyle = EBorderStyle.borderstyleDotted;
                break;
            case c_oAscBorderStyles.Double:
                nStyle = EBorderStyle.borderstyleDouble;
                break;
            case c_oAscBorderStyles.Hair:
                nStyle = EBorderStyle.borderstyleHair;
                break;
            case c_oAscBorderStyles.Medium:
                nStyle = EBorderStyle.borderstyleMedium;
                break;
            case c_oAscBorderStyles.MediumDashDot:
                nStyle = EBorderStyle.borderstyleMediumDashDot;
                break;
            case c_oAscBorderStyles.MediumDashDotDot:
                nStyle = EBorderStyle.borderstyleMediumDashDotDot;
                break;
            case c_oAscBorderStyles.MediumDashed:
                nStyle = EBorderStyle.borderstyleMediumDashed;
                break;
            case c_oAscBorderStyles.None:
                nStyle = EBorderStyle.borderstyleNone;
                break;
            case c_oAscBorderStyles.SlantDashDot:
                nStyle = EBorderStyle.borderstyleSlantDashDot;
                break;
            case c_oAscBorderStyles.Thick:
                nStyle = EBorderStyle.borderstyleThick;
                break;
            case c_oAscBorderStyles.Thin:
                nStyle = EBorderStyle.borderstyleThin;
                break;
            }
            this.memory.WriteByte(c_oSerBorderPropTypes.Style);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nStyle);
        }
    };
    this.WriteFills = function () {
        var oThis = this;
        var aFills = new Array();
        for (var i in this.oFillMap) {
            var elem = this.oFillMap[i];
            aFills[elem.index] = elem.val;
        }
        aFills[1] = aFills[0];
        for (var i = 0, length = aFills.length; i < length; ++i) {
            var fill = aFills[i];
            this.bs.WriteItem(c_oSerStylesTypes.Fill, function () {
                oThis.WriteFill(fill);
            });
        }
    };
    this.WriteFill = function (fill) {
        var oThis = this;
        this.bs.WriteItem(c_oSerFillTypes.PatternFill, function () {
            oThis.WritePatternFill(fill);
        });
    };
    this.WritePatternFill = function (fill) {
        var oThis = this;
        if (null != fill.bg) {
            this.bs.WriteItem(c_oSerFillTypes.PatternFillBgColor, function () {
                oThis.bs.WriteColorSpreadsheet(fill.bg);
            });
        }
    };
    this.WriteFonts = function () {
        var oThis = this;
        var aFonts = new Array();
        for (var i in this.oFontMap) {
            var elem = this.oFontMap[i];
            aFonts[elem.index] = elem.val;
        }
        for (var i = 0, length = aFonts.length; i < length; ++i) {
            var font = aFonts[i];
            var fontMinimized = font.getDif(g_oDefaultFontAbs);
            if (null == fontMinimized) {
                fontMinimized = new Font();
            }
            if (null == fontMinimized.fn) {
                fontMinimized.fn = g_oDefaultFontAbs.fn;
            }
            if (null == fontMinimized.scheme) {
                fontMinimized.scheme = g_oDefaultFontAbs.scheme;
            }
            if (null == fontMinimized.fs) {
                fontMinimized.fs = g_oDefaultFontAbs.fs;
            }
            if (null == fontMinimized.c) {
                fontMinimized.c = g_oDefaultFontAbs.c;
            }
            this.bs.WriteItem(c_oSerStylesTypes.Font, function () {
                oThis.WriteFont(fontMinimized);
            });
        }
    };
    this.WriteFont = function (font) {
        var oThis = this;
        if (null != font.b) {
            this.memory.WriteByte(c_oSerFontTypes.Bold);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(font.b);
        }
        if (null != font.c) {
            this.memory.WriteByte(c_oSerFontTypes.Color);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.bs.WriteColorSpreadsheet(font.c);
            });
        }
        if (null != font.i) {
            this.memory.WriteByte(c_oSerFontTypes.Italic);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(font.i);
        }
        if (null != font.fn) {
            this.memory.WriteByte(c_oSerFontTypes.RFont);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(font.fn);
        }
        if (null != font.scheme) {
            this.memory.WriteByte(c_oSerFontTypes.Scheme);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(font.scheme);
        }
        if (null != font.s) {
            this.memory.WriteByte(c_oSerFontTypes.Strike);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(font.s);
        }
        if (null != font.fs) {
            this.memory.WriteByte(c_oSerFontTypes.Sz);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(font.fs);
        }
        if (null != font.u) {
            var nUnderline = EUnderline.underlineNone;
            switch (font.u) {
            case "double":
                nUnderline = EUnderline.underlineDouble;
                break;
            case "doubleAccounting":
                nUnderline = EUnderline.underlineDoubleAccounting;
                break;
            case "none":
                nUnderline = EUnderline.underlineNone;
                break;
            case "single":
                nUnderline = EUnderline.underlineSingle;
                break;
            case "singleAccounting":
                nUnderline = EUnderline.underlineSingleAccounting;
                break;
            }
            this.memory.WriteByte(c_oSerFontTypes.Underline);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nUnderline);
        }
        if (null != font.va) {
            var nVertAlign = EVerticalAlignRun.verticalalignrunBaseline;
            switch (font.va) {
            case "baseline":
                nVertAlign = EVerticalAlignRun.verticalalignrunBaseline;
                break;
            case "subscript":
                nVertAlign = EVerticalAlignRun.verticalalignrunSubscript;
                break;
            case "superscript":
                nVertAlign = EVerticalAlignRun.verticalalignrunSuperscript;
                break;
            }
            this.memory.WriteByte(c_oSerFontTypes.VertAlign);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nVertAlign);
        }
    };
    this.WriteNumFmts = function () {
        var oThis = this;
        var index = 0;
        var aNums = new Array();
        for (var i in this.oNumMap) {
            var num = this.oNumMap[i];
            if (false == num.val.isEqual(g_oDefaultNumAbs)) {
                this.bs.WriteItem(c_oSerStylesTypes.NumFmt, function () {
                    oThis.WriteNum({
                        id: num.index,
                        f: num.val.f
                    });
                });
            }
        }
    };
    this.WriteNum = function (num) {
        if (null != num.f) {
            this.memory.WriteByte(c_oSerNumFmtTypes.FormatCode);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.memory.WriteString2(num.f);
        }
        if (null != num.id) {
            this.memory.WriteByte(c_oSerNumFmtTypes.NumFmtId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(num.id);
        }
    };
    this.WriteCellStyleXfs = function () {
        var oThis = this;
        for (var i = 0, length = this.oXfsStylesMap.length; i < length; ++i) {
            var cellStyleXfs = this.oXfsStylesMap[i];
            this.bs.WriteItem(c_oSerStylesTypes.Xfs, function () {
                oThis.WriteXfs(cellStyleXfs);
            });
        }
    };
    this.WriteCellXfs = function () {
        var oThis = this;
        var aXfs = new Array();
        for (var i in this.oXfsMap) {
            var elem = this.oXfsMap[i];
            aXfs[elem.index] = elem.val;
        }
        for (var i = 0, length = aXfs.length; i < length; ++i) {
            var cellxfs = aXfs[i];
            this.bs.WriteItem(c_oSerStylesTypes.Xfs, function () {
                oThis.WriteXfs(cellxfs);
            });
        }
    };
    this.WriteXfs = function (xfs) {
        var oThis = this;
        if (null != xfs.borderid) {
            if (0 != xfs.borderid) {
                this.memory.WriteByte(c_oSerXfsTypes.ApplyBorder);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            this.memory.WriteByte(c_oSerXfsTypes.BorderId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(xfs.borderid);
        }
        if (null != xfs.fillid) {
            if (0 != xfs.fillid) {
                this.memory.WriteByte(c_oSerXfsTypes.ApplyFill);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            this.memory.WriteByte(c_oSerXfsTypes.FillId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(xfs.fillid);
        }
        if (null != xfs.fontid) {
            if (0 != xfs.fontid) {
                this.memory.WriteByte(c_oSerXfsTypes.ApplyFont);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            this.memory.WriteByte(c_oSerXfsTypes.FontId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(xfs.fontid);
        }
        if (null != xfs.numid) {
            if (0 != xfs.numid) {
                this.memory.WriteByte(c_oSerXfsTypes.ApplyNumberFormat);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
            }
            this.memory.WriteByte(c_oSerXfsTypes.NumFmtId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(xfs.numid);
        }
        if (null != xfs.align) {
            var alignMinimized = xfs.align.getDif(g_oDefaultAlignAbs);
            if (null != alignMinimized) {
                this.memory.WriteByte(c_oSerXfsTypes.ApplyAlignment);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(true);
                this.memory.WriteByte(c_oSerXfsTypes.Aligment);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteAlign(alignMinimized);
                });
            }
        }
        if (null != xfs.QuotePrefix) {
            this.memory.WriteByte(c_oSerXfsTypes.QuotePrefix);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(xfs.QuotePrefix);
        }
        if (null != xfs.XfId) {
            this.memory.WriteByte(c_oSerXfsTypes.XfId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(xfs.XfId);
        }
    };
    this.WriteAlign = function (align) {
        if (null != align.hor) {
            var nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentGeneral;
            switch (align.hor) {
            case "center":
                nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentCenter;
                break;
            case "justify":
                nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentJustify;
                break;
            case "none":
                nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentGeneral;
                break;
            case "left":
                nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentLeft;
                break;
            case "right":
                nHorizontalAlignment = EHorizontalAlignment.horizontalalignmentRight;
                break;
            }
            this.memory.WriteByte(c_oSerAligmentTypes.Horizontal);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nHorizontalAlignment);
        }
        if (null != align.indent) {
            this.memory.WriteByte(c_oSerAligmentTypes.Indent);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(align.indent);
        }
        if (null != align.RelativeIndent) {
            this.memory.WriteByte(c_oSerAligmentTypes.RelativeIndent);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(align.RelativeIndent);
        }
        if (null != align.shrink) {
            this.memory.WriteByte(c_oSerAligmentTypes.ShrinkToFit);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(align.shrink);
        }
        if (null != align.angle) {
            this.memory.WriteByte(c_oSerAligmentTypes.TextRotation);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(align.angle);
        }
        if (null != align.ver) {
            var nVerticalAlignment = EHorizontalAlignment.horizontalalignmentGeneral;
            switch (align.ver) {
            case "bottom":
                nVerticalAlignment = EVerticalAlignment.verticalalignmentBottom;
                break;
            case "center":
                nVerticalAlignment = EVerticalAlignment.verticalalignmentCenter;
                break;
            case "distributed":
                nVerticalAlignment = EVerticalAlignment.verticalalignmentDistributed;
                break;
            case "justify":
                nVerticalAlignment = EVerticalAlignment.verticalalignmentJustify;
                break;
            case "top":
                nVerticalAlignment = EVerticalAlignment.verticalalignmentTop;
                break;
            }
            this.memory.WriteByte(c_oSerAligmentTypes.Vertical);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nVerticalAlignment);
        }
        if (null != align.wrap) {
            this.memory.WriteByte(c_oSerAligmentTypes.WrapText);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(align.wrap);
        }
    };
    this.WriteDxfs = function (Dxfs, oDxfsNumFormatToId) {
        var oThis = this;
        for (var i = 0, length = Dxfs.length; i < length; ++i) {
            this.bs.WriteItem(c_oSerStylesTypes.Dxf, function () {
                oThis.WriteDxf(Dxfs[i], oDxfsNumFormatToId);
            });
        }
    };
    this.WriteDxf = function (Dxf, oDxfsNumFormatToId) {
        var oThis = this;
        if (null != Dxf.align) {
            this.bs.WriteItem(c_oSer_Dxf.Alignment, function () {
                oThis.WriteAlign(Dxf.align);
            });
        }
        if (null != Dxf.border) {
            this.bs.WriteItem(c_oSer_Dxf.Border, function () {
                oThis.WriteBorder(Dxf.border);
            });
        }
        if (null != Dxf.fill) {
            this.bs.WriteItem(c_oSer_Dxf.Fill, function () {
                oThis.WriteFill(Dxf.fill);
            });
        }
        if (null != Dxf.font) {
            this.bs.WriteItem(c_oSer_Dxf.Font, function () {
                oThis.WriteFont(Dxf.font);
            });
        }
        if (null != Dxf.num && null != oDxfsNumFormatToId) {
            var numId = oDxfsNumFormatToId[Dxf.num.f];
            if (null != numId) {
                this.bs.WriteItem(c_oSer_Dxf.NumFmt, function () {
                    oThis.WriteNum({
                        id: numId,
                        f: Dxf.num.f
                    });
                });
            }
        }
    };
    this.WriteCellStyles = function (cellStyles) {
        var oThis = this;
        for (var i = 0, length = cellStyles.length; i < length; ++i) {
            var style = cellStyles[i];
            this.bs.WriteItem(c_oSerStylesTypes.CellStyle, function () {
                oThis.WriteCellStyle(style);
            });
        }
    };
    this.WriteCellStyle = function (oCellStyle) {
        var oThis = this;
        if (null != oCellStyle.BuiltinId) {
            this.bs.WriteItem(c_oSer_CellStyle.BuiltinId, function () {
                oThis.memory.WriteLong(oCellStyle.BuiltinId);
            });
        }
        if (null != oCellStyle.CustomBuiltin) {
            this.bs.WriteItem(c_oSer_CellStyle.CustomBuiltin, function () {
                oThis.memory.WriteBool(oCellStyle.CustomBuiltin);
            });
        }
        if (null != oCellStyle.Hidden) {
            this.bs.WriteItem(c_oSer_CellStyle.Hidden, function () {
                oThis.memory.WriteBool(oCellStyle.Hidden);
            });
        }
        if (null != oCellStyle.ILevel) {
            this.bs.WriteItem(c_oSer_CellStyle.ILevel, function () {
                oThis.memory.WriteLong(oCellStyle.ILevel);
            });
        }
        if (null != oCellStyle.Name) {
            this.memory.WriteByte(c_oSer_CellStyle.Name);
            this.memory.WriteString2(oCellStyle.Name);
        }
        if (null != oCellStyle.XfId) {
            this.bs.WriteItem(c_oSer_CellStyle.XfId, function () {
                oThis.memory.WriteLong(oCellStyle.XfId);
            });
        }
    };
    this.WriteTableStyles = function (tableStyles) {
        var oThis = this;
        if (null != tableStyles.DefaultTableStyle) {
            this.memory.WriteByte(c_oSer_TableStyles.DefaultTableStyle);
            this.memory.WriteString2(tableStyles.DefaultTableStyle);
        }
        if (null != tableStyles.DefaultPivotStyle) {
            this.memory.WriteByte(c_oSer_TableStyles.DefaultPivotStyle);
            this.memory.WriteString2(tableStyles.DefaultPivotStyle);
        }
        var bEmptyCustom = true;
        for (var i in tableStyles.CustomStyles) {
            bEmptyCustom = false;
            break;
        }
        if (false == bEmptyCustom) {
            this.bs.WriteItem(c_oSer_TableStyles.TableStyles, function () {
                oThis.WriteTableCustomStyles(tableStyles.CustomStyles);
            });
        }
    };
    this.WriteTableCustomStyles = function (customStyles) {
        var oThis = this;
        for (var i in customStyles) {
            var style = customStyles[i];
            this.bs.WriteItem(c_oSer_TableStyles.TableStyle, function () {
                oThis.WriteTableCustomStyle(style);
            });
        }
    };
    this.WriteTableCustomStyle = function (customStyle) {
        var oThis = this;
        if (null != customStyle.name) {
            this.memory.WriteByte(c_oSer_TableStyle.Name);
            this.memory.WriteString2(customStyle.name);
        }
        if (null != customStyle.pivot) {
            this.bs.WriteItem(c_oSer_TableStyle.Pivot, function () {
                oThis.memory.WriteBool(customStyle.pivot);
            });
        }
        if (null != customStyle.table) {
            this.bs.WriteItem(c_oSer_TableStyle.Table, function () {
                oThis.memory.WriteBool(customStyle.table);
            });
        }
        this.bs.WriteItem(c_oSer_TableStyle.Elements, function () {
            oThis.WriteTableCustomStyleElements(customStyle);
        });
    };
    this.WriteTableCustomStyleElements = function (customStyle) {
        var oThis = this;
        if (null != customStyle.blankRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeBlankRow, customStyle.blankRow);
            });
        }
        if (null != customStyle.firstColumn) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumn, customStyle.firstColumn);
            });
        }
        if (null != customStyle.firstColumnStripe) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumnStripe, customStyle.firstColumnStripe);
            });
        }
        if (null != customStyle.firstColumnSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstColumnSubheading, customStyle.firstColumnSubheading);
            });
        }
        if (null != customStyle.firstHeaderCell) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstHeaderCell, customStyle.firstHeaderCell);
            });
        }
        if (null != customStyle.firstRowStripe) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstRowStripe, customStyle.firstRowStripe);
            });
        }
        if (null != customStyle.firstRowSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstRowSubheading, customStyle.firstRowSubheading);
            });
        }
        if (null != customStyle.firstSubtotalColumn) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstSubtotalColumn, customStyle.firstSubtotalColumn);
            });
        }
        if (null != customStyle.firstSubtotalRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstSubtotalRow, customStyle.firstSubtotalRow);
            });
        }
        if (null != customStyle.firstTotalCell) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeFirstTotalCell, customStyle.firstTotalCell);
            });
        }
        if (null != customStyle.headerRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeHeaderRow, customStyle.headerRow);
            });
        }
        if (null != customStyle.lastColumn) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastColumn, customStyle.lastColumn);
            });
        }
        if (null != customStyle.lastHeaderCell) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastHeaderCell, customStyle.lastHeaderCell);
            });
        }
        if (null != customStyle.lastTotalCell) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeLastTotalCell, customStyle.lastTotalCell);
            });
        }
        if (null != customStyle.pageFieldLabels) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypePageFieldLabels, customStyle.pageFieldLabels);
            });
        }
        if (null != customStyle.pageFieldValues) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypePageFieldValues, customStyle.pageFieldValues);
            });
        }
        if (null != customStyle.secondColumnStripe) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondColumnStripe, customStyle.secondColumnStripe);
            });
        }
        if (null != customStyle.secondColumnSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondColumnSubheading, customStyle.secondColumnSubheading);
            });
        }
        if (null != customStyle.secondRowStripe) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondRowStripe, customStyle.secondRowStripe);
            });
        }
        if (null != customStyle.secondRowSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondRowSubheading, customStyle.secondRowSubheading);
            });
        }
        if (null != customStyle.secondSubtotalColumn) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondSubtotalColumn, customStyle.secondSubtotalColumn);
            });
        }
        if (null != customStyle.secondSubtotalRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeSecondSubtotalRow, customStyle.secondSubtotalRow);
            });
        }
        if (null != customStyle.thirdColumnSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdColumnSubheading, customStyle.thirdColumnSubheading);
            });
        }
        if (null != customStyle.thirdRowSubheading) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdRowSubheading, customStyle.thirdRowSubheading);
            });
        }
        if (null != customStyle.thirdSubtotalColumn) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdSubtotalColumn, customStyle.thirdSubtotalColumn);
            });
        }
        if (null != customStyle.thirdSubtotalRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeThirdSubtotalRow, customStyle.thirdSubtotalRow);
            });
        }
        if (null != customStyle.totalRow) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeTotalRow, customStyle.totalRow);
            });
        }
        if (null != customStyle.wholeTable) {
            this.bs.WriteItem(c_oSer_TableStyle.Element, function () {
                oThis.WriteTableCustomStyleElement(ETableStyleType.tablestyletypeWholeTable, customStyle.wholeTable);
            });
        }
    };
    this.WriteTableCustomStyleElement = function (type, customElement) {
        if (null != type) {
            this.memory.WriteByte(c_oSer_TableStyleElement.Type);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(type);
        }
        if (null != customElement.size) {
            this.memory.WriteByte(c_oSer_TableStyleElement.Size);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(customElement.size);
        }
        if (null != customElement.dxf && null != this.aDxfs) {
            this.memory.WriteByte(c_oSer_TableStyleElement.DxfId);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(this.aDxfs.length);
            this.aDxfs.push(customElement.dxf);
        }
    };
}
function BinaryWorkbookTableWriter(memory, wb) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.wb = wb;
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteWorkbookContent();
        });
    };
    this.WriteWorkbookContent = function () {
        var oThis = this;
        this.bs.WriteItem(c_oSerWorkbookTypes.WorkbookPr, function () {
            oThis.WriteWorkbookPr();
        });
        this.bs.WriteItem(c_oSerWorkbookTypes.BookViews, function () {
            oThis.WriteBookViews();
        });
        this.bs.WriteItem(c_oSerWorkbookTypes.DefinedNames, function () {
            oThis.WriteDefinedNames();
        });
    };
    this.WriteWorkbookPr = function () {
        var oWorkbookPr = this.wb.WorkbookPr;
        if (null != oWorkbookPr) {
            if (null != oWorkbookPr.Date1904) {
                this.memory.WriteByte(c_oSerBorderPropTypes.Date1904);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteBool(oWorkbookPr.Date1904);
            } else {
                if (null != oWorkbookPr.DateCompatibility) {
                    this.memory.WriteByte(c_oSerBorderPropTypes.DateCompatibility);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteBool(oWorkbookPr.DateCompatibility);
                }
            }
        }
    };
    this.WriteBookViews = function () {
        var oThis = this;
        this.bs.WriteItem(c_oSerWorkbookTypes.WorkbookView, function () {
            oThis.WriteWorkbookView();
        });
    };
    this.WriteWorkbookView = function () {
        if (null != this.wb.nActive) {
            this.memory.WriteByte(c_oSerWorkbookViewTypes.ActiveTab);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(this.wb.nActive);
        }
    };
    this.WriteDefinedNames = function () {
        var oThis = this;
        var allDefined = new Object();
        if (null != this.wb.oRealDefinedNames) {
            for (var i in this.wb.oRealDefinedNames) {
                var oDefinedName = this.wb.oRealDefinedNames[i];
                if (null == allDefined[oDefinedName.Name]) {
                    allDefined[oDefinedName.Name] = {
                        global: oDefinedName,
                        local: {}
                    };
                }
            }
        }
        for (var i = 0, length = this.wb.aWorksheets.length; i < length; ++i) {
            var ws = this.wb.aWorksheets[i];
            if (null != ws.DefinedNames) {
                for (var j in ws.DefinedNames) {
                    var oDefinedName = ws.DefinedNames[j];
                    var elem = allDefined[oDefinedName.Name];
                    if (null == elem) {
                        elem = {
                            global: null,
                            local: {}
                        };
                        allDefined[oDefinedName.Name] = elem;
                    }
                    elem.local[i] = oDefinedName;
                }
            }
        }
        for (var i in allDefined) {
            var elem = allDefined[i];
            for (var j in elem.local) {
                var localElem = elem.local[j];
                var nLocalIndex = j - 0;
                if (null != localElem) {
                    this.bs.WriteItem(c_oSerWorkbookTypes.DefinedName, function () {
                        oThis.WriteDefinedName(localElem, nLocalIndex);
                    });
                }
            }
            if (null != elem.global) {
                this.bs.WriteItem(c_oSerWorkbookTypes.DefinedName, function () {
                    oThis.WriteDefinedName(elem.global);
                });
            }
        }
    };
    this.WriteDefinedName = function (oDefinedName, LocalSheetId) {
        var oThis = this;
        if (null != oDefinedName.Name) {
            this.memory.WriteByte(c_oSerDefinedNameTypes.Name);
            this.memory.WriteString2(oDefinedName.Name);
        }
        if (null != oDefinedName.Ref) {
            this.memory.WriteByte(c_oSerDefinedNameTypes.Ref);
            this.memory.WriteString2(oDefinedName.Ref);
        }
        if (null != LocalSheetId) {
            this.bs.WriteItem(c_oSerDefinedNameTypes.LocalSheetId, function () {
                oThis.memory.WriteLong(LocalSheetId);
            });
        }
    };
}
function BinaryWorksheetsTableWriter(memory, wb, oSharedStrings, aDxfs, aXfs, aFonts, aFills, aBorders, aNums, idWorksheet) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.wb = wb;
    this.oSharedStrings = oSharedStrings;
    this.aDxfs = aDxfs;
    this.aXfs = aXfs;
    this.aFonts = aFonts;
    this.aFills = aFills;
    this.aBorders = aBorders;
    this.aNums = aNums;
    this.oXfsStylesMap = [];
    this.oXfsMap = new Object();
    this.nXfsMapIndex = 0;
    this.oFontMap = new Object();
    this.nFontMapIndex = 0;
    this.oFillMap = new Object();
    this.nFillMapIndex = 0;
    this.oBorderMap = new Object();
    this.nBorderMapIndex = 0;
    this.oNumMap = new Object();
    this.nNumMapIndex = 0;
    this.idWorksheet = idWorksheet;
    this.oAllColXfsId = null;
    this._getCrc32FromObjWithProperty = function (val) {
        return Asc.crc32(this._getStringFromObjWithProperty(val));
    };
    this._getStringFromObjWithProperty = function (val) {
        var sRes = "";
        if (val.getProperties) {
            var properties = val.getProperties();
            for (var i in properties) {
                var oCurProp = val.getProperty(properties[i]);
                if (null != oCurProp && oCurProp.getProperties) {
                    sRes += this._getStringFromObjWithProperty(oCurProp);
                } else {
                    sRes += oCurProp;
                }
            }
        }
        return sRes;
    };
    this._prepeareStyles = function () {
        this.oFontMap[this._getStringFromObjWithProperty(g_oDefaultFont)] = {
            index: this.nFontMapIndex++,
            val: g_oDefaultFont
        };
        this.oFillMap[this._getStringFromObjWithProperty(g_oDefaultFill)] = {
            index: this.nFillMapIndex++,
            val: g_oDefaultFill
        };
        this.nFillMapIndex++;
        this.oBorderMap[this._getStringFromObjWithProperty(g_oDefaultBorder)] = {
            index: this.nBorderMapIndex++,
            val: g_oDefaultBorder
        };
        this.nNumMapIndex = g_nNumsMaxId;
        var sAlign = "0";
        var oAlign = null;
        if (false == g_oDefaultAlign.isEqual(g_oDefaultAlignAbs)) {
            oAlign = g_oDefaultAlign;
            sAlign = this._getStringFromObjWithProperty(g_oDefaultAlign);
        }
        this.prepareXfsStyles();
        var xfs = {
            borderid: 0,
            fontid: 0,
            fillid: 0,
            numid: 0,
            align: oAlign,
            QuotePrefix: null
        };
        this.oXfsMap["0|0|0|0|" + sAlign] = {
            index: this.nXfsMapIndex++,
            val: xfs
        };
    };
    this.Write = function () {
        var oThis = this;
        this._prepeareStyles();
        this.bs.WriteItemWithLength(function () {
            oThis.WriteWorksheetsContent();
        });
    };
    this.WriteWorksheetsContent = function () {
        var oThis = this;
        for (var i = 0, length = this.wb.aWorksheets.length; i < length; ++i) {
            var ws = this.wb.aWorksheets[i];
            if (null == this.idWorksheet || this.idWorksheet == ws.getId()) {
                this.bs.WriteItem(c_oSerWorksheetsTypes.Worksheet, function () {
                    oThis.WriteWorksheet(ws, i);
                });
            }
        }
    };
    this.WriteWorksheet = function (ws, index) {
        var oThis = this;
        this.bs.WriteItem(c_oSerWorksheetsTypes.WorksheetProp, function () {
            oThis.WriteWorksheetProp(ws, index);
        });
        if (ws.aCols.length > 0 || null != ws.oAllCol) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.Cols, function () {
                oThis.WriteWorksheetCols(ws);
            });
        }
        this.bs.WriteItem(c_oSerWorksheetsTypes.SheetViews, function () {
            oThis.WriteSheetViews(ws);
        });
        if (null !== ws.sheetPr) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.SheetPr, function () {
                oThis.WriteSheetPr(ws.sheetPr);
            });
        }
        this.bs.WriteItem(c_oSerWorksheetsTypes.SheetFormatPr, function () {
            oThis.WriteSheetFormatPr(ws);
        });
        if (null != ws.PagePrintOptions) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.PageMargins, function () {
                oThis.WritePageMargins(ws.PagePrintOptions.asc_getPageMargins());
            });
            this.bs.WriteItem(c_oSerWorksheetsTypes.PageSetup, function () {
                oThis.WritePageSetup(ws.PagePrintOptions.asc_getPageSetup());
            });
            this.bs.WriteItem(c_oSerWorksheetsTypes.PrintOptions, function () {
                oThis.WritePrintOptions(ws.PagePrintOptions);
            });
        }
        this.bs.WriteItem(c_oSerWorksheetsTypes.SheetData, function () {
            oThis.WriteSheetData(ws);
        });
        this.bs.WriteItem(c_oSerWorksheetsTypes.Hyperlinks, function () {
            oThis.WriteHyperlinks(ws);
        });
        this.bs.WriteItem(c_oSerWorksheetsTypes.MergeCells, function () {
            oThis.WriteMergeCells(ws);
        });
        if (ws.Drawings && (ws.Drawings.length)) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.Drawings, function () {
                oThis.WriteDrawings(ws.Drawings);
            });
        }
        if (ws.aComments.length > 0 && ws.aCommentsCoords.length > 0) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.Comments, function () {
                oThis.WriteComments(ws.aComments, ws.aCommentsCoords);
            });
        }
        if (null != ws.AutoFilter) {
            var oBinaryTableWriter = new BinaryTableWriter(this.memory, this.aDxfs);
            this.bs.WriteItem(c_oSerWorksheetsTypes.Autofilter, function () {
                oBinaryTableWriter.WriteAutoFilter(ws.AutoFilter);
            });
        }
        if (null != ws.TableParts && ws.TableParts.length > 0) {
            var oBinaryTableWriter = new BinaryTableWriter(this.memory, this.aDxfs);
            this.bs.WriteItem(c_oSerWorksheetsTypes.TableParts, function () {
                oBinaryTableWriter.Write(ws.TableParts);
            });
        }
    };
    this.WriteWorksheetProp = function (ws, index) {
        var oThis = this;
        this.memory.WriteByte(c_oSerWorksheetPropTypes.Name);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(ws.sName);
        this.memory.WriteByte(c_oSerWorksheetPropTypes.SheetId);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(index + 1);
        if (null != ws.bHidden) {
            this.memory.WriteByte(c_oSerWorksheetPropTypes.State);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            if (true == ws.bHidden) {
                this.memory.WriteByte(EVisibleType.visibleHidden);
            } else {
                this.memory.WriteByte(EVisibleType.visibleVisible);
            }
        }
    };
    this.WriteWorksheetCols = function (ws) {
        var oThis = this;
        var aCols = ws.aCols;
        var oPrevCol = null;
        var nPrevIndexStart = null;
        var nPrevIndex = null;
        var aIndexes = new Array();
        for (var i in aCols) {
            aIndexes.push(i - 0);
        }
        aIndexes.sort(fSortAscending);
        var fInitCol = function (col, nMin, nMax) {
            var oRes = {
                BestFit: col.BestFit,
                hd: col.hd,
                Max: nMax,
                Min: nMin,
                xfsid: null,
                width: col.width,
                CustomWidth: col.CustomWidth
            };
            if (null == oRes.width) {
                if (null != ws.dDefaultColWidth) {
                    oRes.width = ws.dDefaultColWidth;
                } else {
                    oRes.width = gc_dDefaultColWidthCharsAttribute;
                }
            }
            if (null != col.xfs) {
                oRes.xfsid = oThis.prepareXfs(col.xfs);
            }
            return oRes;
        };
        var oAllCol = null;
        if (null != ws.oAllCol) {
            oAllCol = fInitCol(ws.oAllCol, 0, gc_nMaxCol0);
            this.oAllColXfsId = oAllCol.xfsid;
        }
        for (var i = 0, length = aIndexes.length; i < length; ++i) {
            var nIndex = aIndexes[i];
            var col = aCols[nIndex];
            if (null != col) {
                if (false == col.isEmptyToSave()) {
                    if (null != oAllCol && null == nPrevIndex && nIndex > 0) {
                        oAllCol.Min = 1;
                        oAllCol.Max = nIndex;
                        this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                            oThis.WriteWorksheetCol(oAllCol);
                        });
                    }
                    if (null != nPrevIndex && (nPrevIndex + 1 != nIndex || false == oPrevCol.isEqual(col))) {
                        var oColToWrite = fInitCol(oPrevCol, nPrevIndexStart + 1, nPrevIndex + 1);
                        this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                            oThis.WriteWorksheetCol(oColToWrite);
                        });
                        nPrevIndexStart = null;
                        if (null != oAllCol && nPrevIndex + 1 != nIndex) {
                            oAllCol.Min = nPrevIndex + 2;
                            oAllCol.Max = nIndex;
                            this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                                oThis.WriteWorksheetCol(oAllCol);
                            });
                        }
                    }
                    oPrevCol = col;
                    nPrevIndex = nIndex;
                    if (null == nPrevIndexStart) {
                        nPrevIndexStart = nPrevIndex;
                    }
                }
            }
        }
        if (null != nPrevIndexStart && null != nPrevIndex && null != oPrevCol) {
            var oColToWrite = fInitCol(oPrevCol, nPrevIndexStart + 1, nPrevIndex + 1);
            this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                oThis.WriteWorksheetCol(oColToWrite);
            });
        }
        if (null != oAllCol) {
            if (null == nPrevIndex) {
                oAllCol.Min = 1;
                oAllCol.Max = gc_nMaxCol0 + 1;
                this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                    oThis.WriteWorksheetCol(oAllCol);
                });
            } else {
                if (gc_nMaxCol0 != nPrevIndex) {
                    oAllCol.Min = nPrevIndex + 2;
                    oAllCol.Max = gc_nMaxCol0 + 1;
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Col, function () {
                        oThis.WriteWorksheetCol(oAllCol);
                    });
                }
            }
        }
    };
    this.WriteWorksheetCol = function (oCol) {
        if (null != oCol.BestFit) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.BestFit);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(oCol.BestFit);
        }
        if (null != oCol.hd) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.Hidden);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(oCol.hd);
        }
        if (null != oCol.Max) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.Max);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oCol.Max);
        }
        if (null != oCol.Min) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.Min);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oCol.Min);
        }
        if (null != oCol.xfsid) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.Style);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oCol.xfsid);
        }
        if (null != oCol.width) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.Width);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oCol.width);
        }
        if (null != oCol.CustomWidth) {
            this.memory.WriteByte(c_oSerWorksheetColTypes.CustomWidth);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(oCol.CustomWidth);
        }
    };
    this.WriteSheetViews = function (ws) {
        var oThis = this;
        for (var i = 0, length = ws.sheetViews.length; i < length; ++i) {
            this.bs.WriteItem(c_oSerWorksheetsTypes.SheetView, function () {
                oThis.WriteSheetView(ws.sheetViews[i]);
            });
        }
    };
    this.WriteSheetView = function (oSheetView) {
        var oThis = this;
        if (null !== oSheetView.showGridLines) {
            this.bs.WriteItem(c_oSer_SheetView.ShowGridLines, function () {
                oThis.memory.WriteBool(oSheetView.showGridLines);
            });
        }
        if (null !== oSheetView.showRowColHeaders) {
            this.bs.WriteItem(c_oSer_SheetView.ShowRowColHeaders, function () {
                oThis.memory.WriteBool(oSheetView.showRowColHeaders);
            });
        }
    };
    this.WriteSheetPr = function (sheetPr) {
        var oThis = this;
        if (null !== sheetPr.CodeName) {
            this.bs.WriteItem(c_oSer_SheetPr.CodeName, function () {
                oThis.memory.WriteString3(sheetPr.CodeName);
            });
        }
        if (null !== sheetPr.EnableFormatConditionsCalculation) {
            this.bs.WriteItem(c_oSer_SheetPr.EnableFormatConditionsCalculation, function () {
                oThis.memory.WriteBool(sheetPr.EnableFormatConditionsCalculation);
            });
        }
        if (null !== sheetPr.FilterMode) {
            this.bs.WriteItem(c_oSer_SheetPr.FilterMode, function () {
                oThis.memory.WriteBool(sheetPr.FilterMode);
            });
        }
        if (null !== sheetPr.Published) {
            this.bs.WriteItem(c_oSer_SheetPr.Published, function () {
                oThis.memory.WriteBool(sheetPr.Published);
            });
        }
        if (null !== sheetPr.SyncHorizontal) {
            this.bs.WriteItem(c_oSer_SheetPr.SyncHorizontal, function () {
                oThis.memory.WriteBool(sheetPr.SyncHorizontal);
            });
        }
        if (null !== sheetPr.SyncRef) {
            this.bs.WriteItem(c_oSer_SheetPr.SyncRef, function () {
                oThis.memory.WriteString3(sheetPr.SyncRef);
            });
        }
        if (null !== sheetPr.SyncVertical) {
            this.bs.WriteItem(c_oSer_SheetPr.SyncVertical, function () {
                oThis.memory.WriteBool(sheetPr.SyncVertical);
            });
        }
        if (null !== sheetPr.TransitionEntry) {
            this.bs.WriteItem(c_oSer_SheetPr.TransitionEntry, function () {
                oThis.memory.WriteBool(sheetPr.TransitionEntry);
            });
        }
        if (null !== sheetPr.TransitionEvaluation) {
            this.bs.WriteItem(c_oSer_SheetPr.TransitionEvaluation, function () {
                oThis.memory.WriteBool(sheetPr.TransitionEvaluation);
            });
        }
        if (null !== sheetPr.TabColor) {
            this.bs.WriteItem(c_oSer_SheetPr.TabColor, function () {
                oThis.bs.WriteColorSpreadsheet(sheetPr.TabColor);
            });
        }
    };
    this.WriteSheetFormatPr = function (ws) {
        if (null !== ws.dDefaultColWidth) {
            this.memory.WriteByte(c_oSerSheetFormatPrTypes.DefaultColWidth);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(ws.dDefaultColWidth);
        }
        if (null !== ws.dDefaultheight) {
            this.memory.WriteByte(c_oSerSheetFormatPrTypes.DefaultRowHeight);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(ws.dDefaultheight);
        }
        if (null !== ws.nBaseColWidth) {
            this.memory.WriteByte(c_oSerSheetFormatPrTypes.BaseColWidth);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(ws.nBaseColWidth);
        }
    };
    this.WritePageMargins = function (oMargins) {
        var dLeft = oMargins.asc_getLeft();
        if (null != dLeft) {
            this.memory.WriteByte(c_oSer_PageMargins.Left);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dLeft);
        }
        var dTop = oMargins.asc_getTop();
        if (null != dTop) {
            this.memory.WriteByte(c_oSer_PageMargins.Top);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dTop);
        }
        var dRight = oMargins.asc_getRight();
        if (null != dRight) {
            this.memory.WriteByte(c_oSer_PageMargins.Right);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dRight);
        }
        var dBottom = oMargins.asc_getBottom();
        if (null != dBottom) {
            this.memory.WriteByte(c_oSer_PageMargins.Bottom);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(dBottom);
        }
        this.memory.WriteByte(c_oSer_PageMargins.Header);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(12.7);
        this.memory.WriteByte(c_oSer_PageMargins.Footer);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(12.7);
    };
    this.WritePageSetup = function (oPageSetup) {
        var byteOrientation = oPageSetup.asc_getOrientation();
        if (null != byteOrientation) {
            var byteFormatOrientation = null;
            switch (byteOrientation) {
            case c_oAscPageOrientation.PagePortrait:
                byteFormatOrientation = EPageOrientation.pageorientPortrait;
                break;
            case c_oAscPageOrientation.PageLandscape:
                byteFormatOrientation = EPageOrientation.pageorientLandscape;
                break;
            }
            if (null != byteFormatOrientation) {
                this.memory.WriteByte(c_oSer_PageSetup.Orientation);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(byteFormatOrientation);
            }
        }
        var dWidth = oPageSetup.asc_getWidth();
        var dHeight = oPageSetup.asc_getHeight();
        if (null != dWidth && null != dHeight) {
            var item = DocumentPageSize.getSizeByWH(dWidth, dHeight);
            this.memory.WriteByte(c_oSer_PageSetup.PaperSize);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(item.id);
        }
    };
    this.WritePrintOptions = function (oPrintOptions) {
        var bGridLines = oPrintOptions.asc_getGridLines();
        if (null != bGridLines) {
            this.memory.WriteByte(c_oSer_PrintOptions.GridLines);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(bGridLines);
        }
        var bHeadings = oPrintOptions.asc_getHeadings();
        if (null != bHeadings) {
            this.memory.WriteByte(c_oSer_PrintOptions.Headings);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(bHeadings);
        }
    };
    this.WriteHyperlinks = function (ws) {
        var oThis = this;
        var oHyperlinks = ws.hyperlinkManager.getAll();
        for (var i in oHyperlinks) {
            var elem = oHyperlinks[i];
            this.bs.WriteItem(c_oSerWorksheetsTypes.Hyperlink, function () {
                oThis.WriteHyperlink(elem.data);
            });
        }
    };
    this.WriteHyperlink = function (oHyperlink) {
        if (null != oHyperlink.Ref) {
            this.memory.WriteByte(c_oSerHyperlinkTypes.Ref);
            this.memory.WriteString2(oHyperlink.Ref.getName());
        }
        if (null != oHyperlink.Hyperlink) {
            this.memory.WriteByte(c_oSerHyperlinkTypes.Hyperlink);
            this.memory.WriteString2(oHyperlink.Hyperlink);
        }
        if (null !== oHyperlink.getLocation()) {
            this.memory.WriteByte(c_oSerHyperlinkTypes.Location);
            this.memory.WriteString2(oHyperlink.getLocation());
        }
        if (null != oHyperlink.Tooltip) {
            this.memory.WriteByte(c_oSerHyperlinkTypes.Tooltip);
            this.memory.WriteString2(oHyperlink.Tooltip);
        }
    };
    this.WriteMergeCells = function (ws) {
        var oThis = this;
        var oMerged = ws.mergeManager.getAll();
        for (var i in oMerged) {
            var elem = oMerged[i];
            var bbox = elem.bbox;
            if (bbox.r1 != bbox.r2 || bbox.c1 != bbox.c2) {
                var oFirst = new CellAddress(bbox.r1, bbox.c1, 0);
                var oLast = new CellAddress(bbox.r2, bbox.c2, 0);
                this.memory.WriteByte(c_oSerWorksheetsTypes.MergeCell);
                this.memory.WriteString2(oFirst.getID() + ":" + oLast.getID());
            }
        }
    };
    this.WriteDrawings = function (aDrawings) {
        var oThis = this;
        for (var i = 0, length = aDrawings.length; i < length; ++i) {
            var oDrawing = aDrawings[i];
            this.bs.WriteItem(c_oSerWorksheetsTypes.Drawing, function () {
                oThis.WriteDrawing(oDrawing);
            });
        }
    };
    this.WriteDrawing = function (oDrawing) {
        var oThis = this;
        if (null != oDrawing.Type) {
            this.bs.WriteItem(c_oSer_DrawingType.Type, function () {
                oThis.memory.WriteByte(ECellAnchorType.cellanchorOneCell);
            });
        }
        if (null != oDrawing.from) {
            this.bs.WriteItem(c_oSer_DrawingType.From, function () {
                oThis.WriteFromTo(oDrawing.from);
            });
        }
        if (null != oDrawing.to) {
            this.bs.WriteItem(c_oSer_DrawingType.To, function () {
                oThis.WriteFromTo(oDrawing.to);
            });
        }
        if (oDrawing.isChart()) {
            var oBinaryChartWriter = new BinaryChartWriter(this.memory);
            this.bs.WriteItem(c_oSer_DrawingType.GraphicFrame, function () {
                oBinaryChartWriter.Write(oDrawing.graphicObject);
            });
        } else {
            this.bs.WriteItem(c_oSer_DrawingType.pptxDrawing, function () {
                window.global_pptx_content_writer.WriteDrawing(oThis.memory, oDrawing.graphicObject, null, null, null);
            });
        }
    };
    this.WriteFromTo = function (oFromTo) {
        if (null != oFromTo.col) {
            this.memory.WriteByte(c_oSer_DrawingFromToType.Col);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oFromTo.col);
        }
        if (null != oFromTo.colOff) {
            this.memory.WriteByte(c_oSer_DrawingFromToType.ColOff);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oFromTo.colOff);
        }
        if (null != oFromTo.row) {
            this.memory.WriteByte(c_oSer_DrawingFromToType.Row);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oFromTo.row);
        }
        if (null != oFromTo.rowOff) {
            this.memory.WriteByte(c_oSer_DrawingFromToType.RowOff);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oFromTo.rowOff);
        }
    };
    this.WritePos = function (oPos) {
        if (null != oPos.X) {
            this.memory.WriteByte(c_oSer_DrawingPosType.X);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oPos.X);
        }
        if (null != oPos.Y) {
            this.memory.WriteByte(c_oSer_DrawingPosType.Y);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oPos.Y);
        }
    };
    this.WriteSheetData = function (ws) {
        var oThis = this;
        var aIndexes = new Array();
        for (var i in ws.aGCells) {
            aIndexes.push(i - 0);
        }
        aIndexes.sort(fSortAscending);
        for (var i = 0, length = aIndexes.length; i < length; ++i) {
            var row = ws.aGCells[aIndexes[i]];
            if (null != row) {
                if (false == row.isEmptyToSave()) {
                    this.bs.WriteItem(c_oSerWorksheetsTypes.Row, function () {
                        oThis.WriteRow(row);
                    });
                }
            }
        }
    };
    this.WriteRow = function (oRow) {
        var oThis = this;
        if (null != oRow.r) {
            this.memory.WriteByte(c_oSerRowTypes.Row);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(oRow.r);
        }
        if (null != oRow.xfs) {
            var nXfsId = this.prepareXfs(oRow.xfs);
            this.memory.WriteByte(c_oSerRowTypes.Style);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(nXfsId);
        }
        if (null != oRow.h) {
            this.memory.WriteByte(c_oSerRowTypes.Height);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(oRow.h);
        }
        if (null != oRow.CustomHeight) {
            this.memory.WriteByte(c_oSerRowTypes.CustomHeight);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(oRow.CustomHeight);
        }
        if (null != oRow.hd) {
            this.memory.WriteByte(c_oSerRowTypes.Hidden);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(oRow.hd);
        }
        this.memory.WriteByte(c_oSerRowTypes.Cells);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.bs.WriteItemWithLength(function () {
            oThis.WriteCells(oRow.c);
        });
    };
    this.WriteCells = function (aCells) {
        var oThis = this;
        var aIndexes = new Array();
        for (var i in aCells) {
            aIndexes.push(i - 0);
        }
        aIndexes.sort(fSortAscending);
        for (var i = 0, length = aIndexes.length; i < length; ++i) {
            var cell = aCells[aIndexes[i]];
            var nXfsId = this.prepareXfs(cell.xfs);
            if (0 != nXfsId || false == cell.isEmptyText()) {
                this.bs.WriteItem(c_oSerRowTypes.Cell, function () {
                    oThis.WriteCell(cell, nXfsId);
                });
            }
        }
    };
    this.prepareXfsStyles = function () {
        var styles = this.wb.CellStyles.CustomStyles;
        var xfs = null;
        for (var i = 0, length = styles.length; i < length; ++i) {
            xfs = styles[i].xfs;
            if (xfs) {
                var sStyle = this.prepareXfsStyle(xfs);
                var oXfs = {
                    borderid: sStyle.borderid,
                    fontid: sStyle.fontid,
                    fillid: sStyle.fillid,
                    numid: sStyle.numid,
                    align: null,
                    QuotePrefix: null,
                    XfId: xfs.XfId
                };
                if ("0" != sStyle.align) {
                    oXfs.align = xfs.align;
                }
                if (null != xfs.QuotePrefix) {
                    oXfs.QuotePrefix = xfs.QuotePrefix;
                }
                this.oXfsStylesMap.push(oXfs);
            }
        }
    };
    this.prepareXfsStyle = function (xfs) {
        var sStyle = {
            val: "",
            borderid: 0,
            fontid: 0,
            fillid: 0,
            numid: 0,
            align: "0"
        };
        if (null != xfs) {
            if (null != xfs.font) {
                var sHash = this._getStringFromObjWithProperty(xfs.font);
                var elem = this.oFontMap[sHash];
                if (null == elem) {
                    sStyle.fontid = this.nFontMapIndex++;
                    this.oFontMap[sHash] = {
                        index: sStyle.fontid,
                        val: xfs.font
                    };
                } else {
                    sStyle.fontid = elem.index;
                }
            }
            sStyle.val += sStyle.fontid.toString();
            if (null != xfs.fill) {
                var sHash = this._getStringFromObjWithProperty(xfs.fill);
                var elem = this.oFillMap[sHash];
                if (null == elem) {
                    sStyle.fillid = this.nFillMapIndex++;
                    this.oFillMap[sHash] = {
                        index: sStyle.fillid,
                        val: xfs.fill
                    };
                } else {
                    sStyle.fillid = elem.index;
                }
            }
            sStyle.val += "|" + sStyle.fillid.toString();
            if (null != xfs.border) {
                var sHash = this._getStringFromObjWithProperty(xfs.border);
                var elem = this.oBorderMap[sHash];
                if (null == elem) {
                    sStyle.borderid = this.nBorderMapIndex++;
                    this.oBorderMap[sHash] = {
                        index: sStyle.borderid,
                        val: xfs.border
                    };
                } else {
                    sStyle.borderid = elem.index;
                }
            }
            sStyle.val += "|" + sStyle.borderid.toString();
            if (null != xfs.num) {
                sStyle.numid = this.getNumIdByFormat(xfs.num);
            }
            sStyle.val += "|" + sStyle.numid.toString();
            if (null != xfs.align && false == xfs.align.isEqual(g_oDefaultAlignAbs)) {
                sStyle.align = this._getStringFromObjWithProperty(xfs.align);
            }
            sStyle.val += "|" + sStyle.align;
        }
        return sStyle;
    };
    this.getNumIdByFormat = function (num) {
        var numid = null;
        var nStandartId = aStandartNumFormatsId[num.f];
        if (null == nStandartId) {
            var sHash = this._getStringFromObjWithProperty(num);
            var elem = this.oNumMap[sHash];
            if (null == elem) {
                numid = this.nNumMapIndex++;
                this.oNumMap[sHash] = {
                    index: numid,
                    val: num
                };
            } else {
                numid = elem.index;
            }
        } else {
            numid = nStandartId;
        }
        return numid;
    };
    this.prepareXfs = function (xfs) {
        var nXfsId = 0;
        if (null != xfs) {
            var sStyle = this.prepareXfsStyle(xfs);
            var oXfsMapObj = this.oXfsMap[sStyle.val];
            if (null == oXfsMapObj) {
                nXfsId = this.nXfsMapIndex;
                var oXfs = {
                    borderid: sStyle.borderid,
                    fontid: sStyle.fontid,
                    fillid: sStyle.fillid,
                    numid: sStyle.numid,
                    align: null,
                    QuotePrefix: null,
                    XfId: xfs.XfId
                };
                if ("0" != sStyle.align) {
                    oXfs.align = xfs.align;
                }
                if (null != xfs.QuotePrefix) {
                    oXfs.QuotePrefix = xfs.QuotePrefix;
                }
                this.oXfsMap[sStyle.val] = {
                    index: this.nXfsMapIndex++,
                    val: oXfs
                };
            } else {
                nXfsId = oXfsMapObj.index;
            }
        }
        return nXfsId;
    };
    this.WriteCell = function (cell, nXfsId) {
        var oThis = this;
        if (null != cell.oId) {
            this.memory.WriteByte(c_oSerCellTypes.Ref);
            this.memory.WriteString2(cell.oId.getID());
        }
        if (null != nXfsId) {
            this.bs.WriteItem(c_oSerCellTypes.Style, function () {
                oThis.memory.WriteLong(nXfsId);
            });
        }
        var nCellType = cell.getType();
        if (null != nCellType) {
            var nType = ECellTypeType.celltypeNumber;
            switch (nCellType) {
            case CellValueType.Bool:
                nType = ECellTypeType.celltypeBool;
                break;
            case CellValueType.Error:
                nType = ECellTypeType.celltypeError;
                break;
            case CellValueType.Number:
                nType = ECellTypeType.celltypeNumber;
                break;
            case CellValueType.String:
                nType = ECellTypeType.celltypeSharedString;
                break;
            }
            if (ECellTypeType.celltypeNumber != nType) {
                this.bs.WriteItem(c_oSerCellTypes.Type, function () {
                    oThis.memory.WriteByte(nType);
                });
            }
        }
        if (null != cell.sFormula) {
            this.bs.WriteItem(c_oSerCellTypes.Formula, function () {
                oThis.WriteFormula(cell.sFormula, cell.sFormulaCA);
            });
        }
        if (null != cell.oValue && false == cell.oValue.isEmpty()) {
            var dValue = 0;
            if (CellValueType.Error == nCellType || CellValueType.String == nCellType) {
                var sText = "";
                var aText = null;
                if (null != cell.oValue.text) {
                    sText = cell.oValue.text;
                } else {
                    if (null != cell.oValue.multiText) {
                        aText = cell.oValue.multiText;
                        for (var i = 0, length = cell.oValue.multiText.length; i < length; ++i) {
                            sText += cell.oValue.multiText[i].text;
                        }
                    }
                }
                var item = this.oSharedStrings.strings[sText];
                var bAddItem = false;
                if (null == item) {
                    item = {
                        t: null,
                        a: []
                    };
                    bAddItem = true;
                }
                if (null == aText) {
                    if (null == item.t) {
                        dValue = this.oSharedStrings.index++;
                        item.t = {
                            id: dValue,
                            val: sText
                        };
                    } else {
                        dValue = item.t.id;
                    }
                } else {
                    var bFound = false;
                    for (var i = 0, length = item.a.length; i < length; ++i) {
                        var oCurItem = item.a[i];
                        if (oCurItem.val.length == aText.length) {
                            var bEqual = true;
                            for (var j = 0, length2 = aText.length; j < length2; ++j) {
                                if (false == aText[j].isEqual(oCurItem.val[j])) {
                                    bEqual = false;
                                    break;
                                }
                            }
                            if (bEqual) {
                                bFound = true;
                                dValue = oCurItem.id;
                                break;
                            }
                        }
                    }
                    if (false == bFound) {
                        dValue = this.oSharedStrings.index++;
                        item.a.push({
                            id: dValue,
                            val: aText
                        });
                    }
                }
                if (bAddItem) {
                    this.oSharedStrings.strings[sText] = item;
                }
            } else {
                if (null != cell.oValue.number) {
                    dValue = cell.oValue.number;
                }
            }
            this.bs.WriteItem(c_oSerCellTypes.Value, function () {
                oThis.memory.WriteDouble2(dValue);
            });
        }
    };
    this.WriteFormula = function (sFormula, sFormulaCA) {
        if (null != sFormulaCA) {
            this.memory.WriteByte(c_oSerFormulaTypes.Ca);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(sFormulaCA);
        }
        this.memory.WriteByte(c_oSerFormulaTypes.Text);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.memory.WriteString2(sFormula);
    };
    this.WriteComments = function (aComments, aCommentsCoords) {
        var oThis = this;
        var oNewComments = new Object();
        for (var i = 0, length = aComments.length; i < length; ++i) {
            var elem = aComments[i];
            var nRow = elem.asc_getRow();
            if (null == nRow) {
                nRow = 0;
            }
            var nCol = elem.asc_getCol();
            if (null == nCol) {
                nCol = 0;
            }
            var row = oNewComments[nRow];
            if (null == row) {
                row = new Object();
                oNewComments[nRow] = row;
            }
            var comment = row[nCol];
            if (null == comment) {
                comment = {
                    data: new Array(),
                    coord: null
                };
                row[nCol] = comment;
            }
            comment.data.push(elem);
        }
        for (var i = 0, length = aCommentsCoords.length; i < length; ++i) {
            var elem = aCommentsCoords[i];
            var nRow = elem.asc_getRow();
            if (null == nRow) {
                nRow = 0;
            }
            var nCol = elem.asc_getCol();
            if (null == nCol) {
                nCol = 0;
            }
            var row = oNewComments[nRow];
            if (null == row) {
                row = new Object();
                oNewComments[nRow] = row;
            }
            var comment = row[nCol];
            if (null == comment) {
                comment = {
                    data: new Array(),
                    coord: null
                };
                row[nCol] = comment;
            }
            comment.coord = elem;
        }
        for (var i in oNewComments) {
            var row = oNewComments[i];
            for (var j in row) {
                var comment = row[j];
                if (null == comment.coord || 0 == comment.data.length) {
                    continue;
                }
                var coord = comment.coord;
                if (null == coord.asc_getLeft() || null == coord.asc_getTop() || null == coord.asc_getRight() || null == coord.asc_getBottom() || null == coord.asc_getLeftOffset() || null == coord.asc_getTopOffset() || null == coord.asc_getRightOffset() || null == coord.asc_getBottomOffset() || null == coord.asc_getLeftMM() || null == coord.asc_getTopMM() || null == coord.asc_getWidthMM() || null == coord.asc_getHeightMM()) {
                    continue;
                }
                this.bs.WriteItem(c_oSerWorksheetsTypes.Comment, function () {
                    oThis.WriteComment(comment);
                });
            }
        }
    };
    this.WriteComment = function (comment) {
        var oThis = this;
        this.memory.WriteByte(c_oSer_Comments.Row);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getRow());
        this.memory.WriteByte(c_oSer_Comments.Col);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getCol());
        this.memory.WriteByte(c_oSer_Comments.CommentDatas);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.bs.WriteItemWithLength(function () {
            oThis.WriteCommentDatas(comment.data);
        });
        this.memory.WriteByte(c_oSer_Comments.Left);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getLeft());
        this.memory.WriteByte(c_oSer_Comments.Top);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getTop());
        this.memory.WriteByte(c_oSer_Comments.Right);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getRight());
        this.memory.WriteByte(c_oSer_Comments.Bottom);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getBottom());
        this.memory.WriteByte(c_oSer_Comments.LeftOffset);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getLeftOffset());
        this.memory.WriteByte(c_oSer_Comments.TopOffset);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getTopOffset());
        this.memory.WriteByte(c_oSer_Comments.RightOffset);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getRightOffset());
        this.memory.WriteByte(c_oSer_Comments.BottomOffset);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(comment.coord.asc_getBottomOffset());
        this.memory.WriteByte(c_oSer_Comments.LeftMM);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(comment.coord.asc_getLeftMM());
        this.memory.WriteByte(c_oSer_Comments.TopMM);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(comment.coord.asc_getTopMM());
        this.memory.WriteByte(c_oSer_Comments.WidthMM);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(comment.coord.asc_getWidthMM());
        this.memory.WriteByte(c_oSer_Comments.HeightMM);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble2(comment.coord.asc_getHeightMM());
        this.memory.WriteByte(c_oSer_Comments.MoveWithCells);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(comment.coord.asc_getMoveWithCells());
        this.memory.WriteByte(c_oSer_Comments.SizeWithCells);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteBool(comment.coord.asc_getSizeWithCells());
    };
    this.WriteCommentDatas = function (aDatas) {
        var oThis = this;
        for (var i = 0, length = aDatas.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_Comments.CommentData, function () {
                oThis.WriteCommentData(aDatas[i]);
            });
        }
    };
    this.WriteCommentData = function (oCommentData) {
        var oThis = this;
        var sText = oCommentData.asc_getText();
        if (null != sText) {
            this.memory.WriteByte(c_oSer_CommentData.Text);
            this.memory.WriteString2(sText);
        }
        var sTime = oCommentData.asc_getTime();
        if (null != sTime) {
            var oDate = new Date(sTime - 0);
            this.memory.WriteByte(c_oSer_CommentData.Time);
            this.memory.WriteString2(this.DateToISO8601(oDate));
        }
        var sUserId = oCommentData.asc_getUserId();
        if (null != sUserId) {
            this.memory.WriteByte(c_oSer_CommentData.UserId);
            this.memory.WriteString2(sUserId);
        }
        var sUserName = oCommentData.asc_getUserName();
        if (null != sUserName) {
            this.memory.WriteByte(c_oSer_CommentData.UserName);
            this.memory.WriteString2(sUserName);
        }
        var sQuoteText = oCommentData.asc_getQuoteText();
        if (null != sQuoteText) {
            this.memory.WriteByte(c_oSer_CommentData.QuoteText);
            this.memory.WriteString2(sQuoteText);
        }
        var bSolved = oCommentData.asc_getSolved();
        if (null != bSolved) {
            this.bs.WriteItem(c_oSer_CommentData.Solved, function () {
                oThis.memory.WriteBool(bSolved);
            });
        }
        var bDocumentFlag = oCommentData.asc_getDocumentFlag();
        if (null != bDocumentFlag) {
            this.bs.WriteItem(c_oSer_CommentData.Document, function () {
                oThis.memory.WriteBool(bDocumentFlag);
            });
        }
        var aReplies = oCommentData.aReplies;
        if (null != aReplies && aReplies.length > 0) {
            this.bs.WriteItem(c_oSer_CommentData.Replies, function () {
                oThis.WriteReplies(aReplies);
            });
        }
    };
    this.DateToISO8601 = function (d) {
        function pad(n) {
            return n < 10 ? "0" + n : n;
        }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    };
    this.WriteReplies = function (aReplies) {
        var oThis = this;
        for (var i = 0, length = aReplies.length; i < length; ++i) {
            this.bs.WriteItem(c_oSer_CommentData.Reply, function () {
                oThis.WriteCommentData(aReplies[i]);
            });
        }
    };
}
function BinaryOtherTableWriter(memory, wb) {
    this.memory = memory;
    this.wb = wb;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function () {
        var oThis = this;
        this.bs.WriteItemWithLength(function () {
            oThis.WriteOtherContent();
        });
    };
    this.WriteOtherContent = function () {
        var oThis = this;
        this.bs.WriteItem(c_oSer_OtherType.Theme, function () {
            window.global_pptx_content_writer.WriteTheme(oThis.memory, oThis.wb.theme);
        });
    };
}
function BinaryFileWriter(wb) {
    this.Memory = new CMemory();
    this.wb = wb;
    this.nLastFilePos = 0;
    this.nRealTableCount = 0;
    this.bs = new BinaryCommonWriter(this.Memory);
    this.Write = function (idWorksheet) {
        window.global_pptx_content_writer._Start();
        this.WriteMainTable(idWorksheet);
        window.global_pptx_content_writer._End();
        return this.WriteFileHeader(this.Memory.GetCurPosition()) + this.Memory.GetBase64Memory();
    };
    this.WriteFileHeader = function (nDataSize) {
        return c_oSerFormat.Signature + ";v" + c_oSerFormat.Version + ";" + nDataSize + ";";
    };
    this.WriteMainTable = function (idWorksheet) {
        var nTableCount = 128;
        this.nRealTableCount = 0;
        var nStart = this.Memory.GetCurPosition();
        var nmtItemSize = 5;
        this.nLastFilePos = nStart + nTableCount * nmtItemSize;
        this.Memory.WriteByte(0);
        var oSharedStrings = {
            index: 0,
            strings: new Object()
        };
        var nSharedStringsPos = this.ReserveTable(c_oSerTableTypes.SharedStrings);
        var nStylesTablePos = this.ReserveTable(c_oSerTableTypes.Styles);
        this.WriteTable(c_oSerTableTypes.Workbook, new BinaryWorkbookTableWriter(this.Memory, this.wb));
        var aXfs = new Array();
        var aFonts = new Array();
        var aFills = new Array();
        var aBorders = new Array();
        var aNums = new Array();
        var aDxfs = new Array();
        var oBinaryWorksheetsTableWriter = new BinaryWorksheetsTableWriter(this.Memory, this.wb, oSharedStrings, aDxfs, aXfs, aFonts, aFills, aBorders, aNums, idWorksheet);
        this.WriteTable(c_oSerTableTypes.Worksheets, oBinaryWorksheetsTableWriter);
        this.WriteTable(c_oSerTableTypes.Other, new BinaryOtherTableWriter(this.Memory, this.wb));
        this.WriteReserved(new BinarySharedStringsTableWriter(this.Memory, oSharedStrings), nSharedStringsPos);
        this.WriteReserved(new BinaryStylesTableWriter(this.Memory, this.wb, oBinaryWorksheetsTableWriter), nStylesTablePos);
        this.Memory.Seek(nStart);
        this.Memory.WriteByte(this.nRealTableCount);
        this.Memory.Seek(this.nLastFilePos);
    };
    this.WriteTable = function (type, oTableSer) {
        this.Memory.WriteByte(type);
        this.Memory.WriteLong(this.nLastFilePos);
        var nCurPos = this.Memory.GetCurPosition();
        this.Memory.Seek(this.nLastFilePos);
        oTableSer.Write();
        this.nLastFilePos = this.Memory.GetCurPosition();
        this.Memory.Seek(nCurPos);
        this.nRealTableCount++;
    };
    this.ReserveTable = function (type) {
        var res = 0;
        this.Memory.WriteByte(type);
        res = this.Memory.GetCurPosition();
        this.Memory.WriteLong(this.nLastFilePos);
        return res;
    };
    this.WriteReserved = function (oTableSer, nPos) {
        this.Memory.Seek(nPos);
        this.Memory.WriteLong(this.nLastFilePos);
        var nCurPos = this.Memory.GetCurPosition();
        this.Memory.Seek(this.nLastFilePos);
        oTableSer.Write();
        this.nLastFilePos = this.Memory.GetCurPosition();
        this.Memory.Seek(nCurPos);
        this.nRealTableCount++;
    };
}
function Binary_TableReader(stream, ws, Dxfs) {
    this.stream = stream;
    this.ws = ws;
    this.Dxfs = Dxfs;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function (length, aTables) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadTables(t, l, aTables);
        });
        return res;
    };
    this.ReadTables = function (type, length, aTables) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TablePart.Table == type) {
            var oNewTable = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadTable(t, l, oNewTable);
            });
            if (null != oNewTable.Ref && null != oNewTable.DisplayName) {
                this.ws.workbook.oNameGenerator.addTableName(oNewTable.DisplayName, this.ws, oNewTable.Ref);
            }
            aTables.push(oNewTable);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTable = function (type, length, oTable) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TablePart.Ref == type) {
            oTable.Ref = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_TablePart.HeaderRowCount == type) {
                oTable.HeaderRowCount = this.stream.GetULongLE();
            } else {
                if (c_oSer_TablePart.TotalsRowCount == type) {
                    oTable.TotalsRowCount = this.stream.GetULongLE();
                } else {
                    if (c_oSer_TablePart.DisplayName == type) {
                        oTable.DisplayName = this.stream.GetString2LE(length);
                    } else {
                        if (c_oSer_TablePart.AutoFilter == type) {
                            oTable.AutoFilter = new Object();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadAutoFilter(t, l, oTable.AutoFilter);
                            });
                        } else {
                            if (c_oSer_TablePart.SortState == type) {
                                oTable.SortState = new Object();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadSortState(t, l, oTable.SortState);
                                });
                            } else {
                                if (c_oSer_TablePart.TableColumns == type) {
                                    oTable.TableColumns = new Array();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadTableColumns(t, l, oTable.TableColumns);
                                    });
                                } else {
                                    if (c_oSer_TablePart.TableStyleInfo == type) {
                                        oTable.TableStyleInfo = new Object();
                                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                            return oThis.ReadTableStyleInfo(t, l, oTable.TableStyleInfo);
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
    this.ReadAutoFilter = function (type, length, oAutoFilter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_AutoFilter.Ref == type) {
            oAutoFilter.Ref = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_AutoFilter.FilterColumns == type) {
                oAutoFilter.FilterColumns = new Array();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFilterColumns(t, l, oAutoFilter.FilterColumns);
                });
            } else {
                if (c_oSer_AutoFilter.SortState == type) {
                    oAutoFilter.SortState = new Object();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadSortState(t, l, oAutoFilter.SortState);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadFilterColumns = function (type, length, aFilterColumns) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_AutoFilter.FilterColumn == type) {
            var oFilterColumn = {
                ColId: null,
                Filters: null,
                CustomFiltersObj: null,
                DynamicFilter: null,
                ColorFilter: null,
                Top10: null,
                ShowButton: true
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadFilterColumn(t, l, oFilterColumn);
            });
            aFilterColumns.push(oFilterColumn);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadFilterColumn = function (type, length, oFilterColumn) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_FilterColumn.ColId == type) {
            oFilterColumn.ColId = this.stream.GetULongLE();
        } else {
            if (c_oSer_FilterColumn.Filters == type) {
                oFilterColumn.Filters = {
                    Values: new Array(),
                    Dates: new Array(),
                    Blank: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFilters(t, l, oFilterColumn.Filters);
                });
            } else {
                if (c_oSer_FilterColumn.CustomFilters == type) {
                    oFilterColumn.CustomFiltersObj = new Object();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCustomFilters(t, l, oFilterColumn.CustomFiltersObj);
                    });
                } else {
                    if (c_oSer_FilterColumn.DynamicFilter == type) {
                        oFilterColumn.DynamicFilter = new Object();
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.ReadDynamicFilter(t, l, oFilterColumn.DynamicFilter);
                        });
                    } else {
                        if (c_oSer_FilterColumn.ColorFilter == type) {
                            oFilterColumn.ColorFilter = new Object();
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadColorFilter(t, l, oFilterColumn.ColorFilter);
                            });
                        } else {
                            if (c_oSer_FilterColumn.Top10 == type) {
                                oFilterColumn.Top10 = new Object();
                                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                    return oThis.ReadTop10(t, l, oFilterColumn.Top10);
                                });
                            } else {
                                if (c_oSer_FilterColumn.HiddenButton == type) {
                                    oFilterColumn.ShowButton = !this.stream.GetBool();
                                } else {
                                    if (c_oSer_FilterColumn.ShowButton == type) {
                                        oFilterColumn.ShowButton = this.stream.GetBool();
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
    this.ReadFilters = function (type, length, oFilters) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_FilterColumn.Filter == type) {
            var oFilterVal = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadFilter(t, l, oFilterVal);
            });
            if (null != oFilterVal.Val) {
                oFilters.Values.push(oFilterVal.Val);
            }
        } else {
            if (c_oSer_FilterColumn.DateGroupItem == type) {
                var oDateGroupItem = new Object();
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.ReadDateGroupItem(t, l, oDateGroupItem);
                });
                oFilters.Dates.push(oDateGroupItem);
            } else {
                if (c_oSer_FilterColumn.FiltersBlank == type) {
                    oFilters.Blank = this.stream.GetBool();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadFilter = function (type, length, oFilter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_Filter.Val == type) {
            oFilter.Val = this.stream.GetString2LE(length);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadDateGroupItem = function (type, length, oDateGroupItem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DateGroupItem.DateTimeGrouping == type) {
            oDateGroupItem.DateTimeGrouping = this.stream.GetUChar();
        } else {
            if (c_oSer_DateGroupItem.Day == type) {
                oDateGroupItem.Day = this.stream.GetULongLE();
            } else {
                if (c_oSer_DateGroupItem.Hour == type) {
                    oDateGroupItem.Hour = this.stream.GetULongLE();
                } else {
                    if (c_oSer_DateGroupItem.Minute == type) {
                        oDateGroupItem.Minute = this.stream.GetULongLE();
                    } else {
                        if (c_oSer_DateGroupItem.Month == type) {
                            oDateGroupItem.Month = this.stream.GetULongLE();
                        } else {
                            if (c_oSer_DateGroupItem.Second == type) {
                                oDateGroupItem.Second = this.stream.GetULongLE();
                            } else {
                                if (c_oSer_DateGroupItem.Year == type) {
                                    oDateGroupItem.Year = this.stream.GetULongLE();
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
    this.ReadCustomFilters = function (type, length, oCustomFilters) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CustomFilters.And == type) {
            oCustomFilters.And = this.stream.GetBool();
        } else {
            if (c_oSer_CustomFilters.CustomFilters == type) {
                oCustomFilters.CustomFilters = new Array();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCustomFiltersItems(t, l, oCustomFilters.CustomFilters);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadCustomFiltersItems = function (type, length, aCustomFilters) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CustomFilters.CustomFilter == type) {
            var oCustomFiltersItem = new Object();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadCustomFiltersItem(t, l, oCustomFiltersItem);
            });
            aCustomFilters.push(oCustomFiltersItem);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCustomFiltersItem = function (type, length, oCustomFiltersItem) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CustomFilters.Operator == type) {
            oCustomFiltersItem.Operator = this.stream.GetUChar();
        } else {
            if (c_oSer_CustomFilters.Val == type) {
                oCustomFiltersItem.Val = this.stream.GetString2LE(length);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadDynamicFilter = function (type, length, oDynamicFilter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DynamicFilter.Type == type) {
            oDynamicFilter.Type = this.stream.GetUChar();
        } else {
            if (c_oSer_DynamicFilter.Val == type) {
                oDynamicFilter.Val = this.stream.GetDoubleLE();
            } else {
                if (c_oSer_DynamicFilter.MaxVal == type) {
                    oDynamicFilter.MaxVal = this.stream.GetDoubleLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadColorFilter = function (type, length, oColorFilter) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ColorFilter.CellColor == type) {
            oColorFilter.CellColor = this.stream.GetBool();
        } else {
            if (c_oSer_ColorFilter.DxfId == type) {
                var DxfId = this.stream.GetULongLE();
                var dxf = this.Dxfs[DxfId];
                oColorFilter.dxf = dxf;
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadTop10 = function (type, length, oTop10) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_Top10.FilterVal == type) {
            oTop10.FilterVal = this.stream.GetDoubleLE();
        } else {
            if (c_oSer_Top10.Percent == type) {
                oTop10.Percent = this.stream.GetBool();
            } else {
                if (c_oSer_Top10.Top == type) {
                    oTop10.Top = this.stream.GetBool();
                } else {
                    if (c_oSer_Top10.Val == type) {
                        oTop10.Val = this.stream.GetDoubleLE();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadSortConditionContent = function (type, length, oSortCondition) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_SortState.ConditionRef == type) {
            oSortCondition.Ref = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_SortState.ConditionSortBy == type) {
                oSortCondition.ConditionSortBy = this.stream.GetUChar();
            } else {
                if (c_oSer_SortState.ConditionDescending == type) {
                    oSortCondition.ConditionDescending = this.stream.GetBool();
                } else {
                    if (c_oSer_SortState.ConditionDxfId == type) {
                        var DxfId = this.stream.GetULongLE();
                        var dxf = this.Dxfs[DxfId];
                        oSortCondition.dxf = dxf;
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadSortCondition = function (type, length, aSortConditions) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_SortState.SortCondition == type) {
            var oSortCondition = new Object();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadSortConditionContent(t, l, oSortCondition);
            });
            aSortConditions.push(oSortCondition);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSortState = function (type, length, oSortState) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_SortState.Ref == type) {
            oSortState.Ref = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_SortState.CaseSensitive == type) {
                oSortState.CaseSensitive = this.stream.GetBool();
            } else {
                if (c_oSer_SortState.SortConditions == type) {
                    oSortState.SortConditions = new Array();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadSortCondition(t, l, oSortState.SortConditions);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadTableColumn = function (type, length, oTableColumn) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableColumns.Name == type) {
            oTableColumn.Name = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_TableColumns.TotalsRowLabel == type) {
                oTableColumn.TotalsRowLabel = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_TableColumns.TotalsRowFunction == type) {
                    oTableColumn.TotalsRowFunction = this.stream.GetUChar();
                } else {
                    if (c_oSer_TableColumns.TotalsRowFormula == type) {
                        oTableColumn.TotalsRowFormula = this.stream.GetString2LE(length);
                    } else {
                        if (c_oSer_TableColumns.DataDxfId == type) {
                            var DxfId = this.stream.GetULongLE();
                            var dxf = this.Dxfs[DxfId];
                            oTableColumn.dxf = dxf;
                        } else {
                            if (c_oSer_TableColumns.CalculatedColumnFormula == type) {
                                oTableColumn.CalculatedColumnFormula = this.stream.GetString2LE(length);
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
    this.ReadTableColumns = function (type, length, aTableColumns) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableColumns.TableColumn == type) {
            var oTableColumn = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadTableColumn(t, l, oTableColumn);
            });
            aTableColumns.push(oTableColumn);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTableStyleInfo = function (type, length, oTableStyleInfo) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyleInfo.Name == type) {
            oTableStyleInfo.Name = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_TableStyleInfo.ShowColumnStripes == type) {
                oTableStyleInfo.ShowColumnStripes = this.stream.GetBool();
            } else {
                if (c_oSer_TableStyleInfo.ShowRowStripes == type) {
                    oTableStyleInfo.ShowRowStripes = this.stream.GetBool();
                } else {
                    if (c_oSer_TableStyleInfo.ShowFirstColumn == type) {
                        oTableStyleInfo.ShowFirstColumn = this.stream.GetBool();
                    } else {
                        if (c_oSer_TableStyleInfo.ShowLastColumn == type) {
                            oTableStyleInfo.ShowLastColumn = this.stream.GetBool();
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
}
function Binary_SharedStringTableReader(stream, wb, aSharedStrings) {
    this.stream = stream;
    this.wb = wb;
    this.aSharedStrings = aSharedStrings;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadSharedStringContent(t, l);
        });
    };
    this.ReadSharedStringContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerSharedStringTypes.Si === type) {
            var oThis = this;
            var Si = new CCellValue();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadSharedString(t, l, Si);
            });
            if (null != this.aSharedStrings) {
                this.aSharedStrings.push(Si);
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSharedString = function (type, length, Si) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerSharedStringTypes.Run == type) {
            var oThis = this;
            var oRun = new CCellValueMultiText();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadRun(t, l, oRun);
            });
            if (null == Si.multiText) {
                Si.multiText = new Array();
            }
            Si.multiText.push(oRun);
        } else {
            if (c_oSerSharedStringTypes.Text == type) {
                if (null == Si.text) {
                    Si.text = "";
                }
                Si.text += this.stream.GetString2LE(length);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadRun = function (type, length, oRun) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSerSharedStringTypes.RPr == type) {
            if (null == oRun.format) {
                oRun.format = new Font();
            }
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadRPr(t, l, oRun.format);
            });
            this.CheckSchemeFont(oRun.format);
        } else {
            if (c_oSerSharedStringTypes.Text == type) {
                if (null == oRun.text) {
                    oRun.text = "";
                }
                oRun.text += this.stream.GetString2LE(length);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.CheckSchemeFont = function (font) {
        if (null != font.scheme) {
            var theme = this.wb.theme;
            if (null != theme) {
                var fontScheme = theme.themeElements.fontScheme;
                var sFontName = null;
                switch (font.scheme) {
                case EFontScheme.fontschemeMinor:
                    sFontName = fontScheme.minorFont.latin;
                    break;
                case EFontScheme.fontschemeMajor:
                    sFontName = fontScheme.majorFont.latin;
                    break;
                }
                if (null != sFontName && "" != sFontName) {
                    font.fn = sFontName;
                }
            }
        }
    };
    this.ReadRPr = function (type, length, rPr) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerFontTypes.Bold == type) {
            rPr.b = this.stream.GetBool();
        } else {
            if (c_oSerFontTypes.Color == type) {
                var color = new OpenColor();
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.bcr.ReadColorSpreadsheet(t, l, color);
                });
                if (null != color.theme) {
                    rPr.c = g_oColorManager.getThemeColor(color.theme, color.tint);
                } else {
                    if (null != color.rgb) {
                        rPr.c = new RgbColor(16777215 & color.rgb);
                    }
                }
            } else {
                if (c_oSerFontTypes.Italic == type) {
                    rPr.i = this.stream.GetBool();
                } else {
                    if (c_oSerFontTypes.RFont == type) {
                        rPr.fn = this.stream.GetString2LE(length);
                    } else {
                        if (c_oSerFontTypes.Strike == type) {
                            rPr.s = this.stream.GetBool();
                        } else {
                            if (c_oSerFontTypes.Sz == type) {
                                rPr.fs = this.stream.GetDoubleLE();
                            } else {
                                if (c_oSerFontTypes.Underline == type) {
                                    switch (this.stream.GetUChar()) {
                                    case EUnderline.underlineDouble:
                                        rPr.u = "double";
                                        break;
                                    case EUnderline.underlineDoubleAccounting:
                                        rPr.u = "doubleAccounting";
                                        break;
                                    case EUnderline.underlineNone:
                                        rPr.u = "none";
                                        break;
                                    case EUnderline.underlineSingle:
                                        rPr.u = "single";
                                        break;
                                    case EUnderline.underlineSingleAccounting:
                                        rPr.u = "singleAccounting";
                                        break;
                                    default:
                                        rPr.u = "none";
                                        break;
                                    }
                                } else {
                                    if (c_oSerFontTypes.VertAlign == type) {
                                        switch (this.stream.GetUChar()) {
                                        case EVerticalAlignRun.verticalalignrunBaseline:
                                            rPr.va = "baseline";
                                            break;
                                        case EVerticalAlignRun.verticalalignrunSubscript:
                                            rPr.va = "subscript";
                                            break;
                                        case EVerticalAlignRun.verticalalignrunSuperscript:
                                            rPr.va = "superscript";
                                            break;
                                        default:
                                            rPr.va = "baseline";
                                            break;
                                        }
                                    } else {
                                        if (c_oSerFontTypes.Scheme == type) {
                                            rPr.scheme = this.stream.GetUChar();
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
}
function Binary_StylesTableReader(stream, wb, aCellXfs, Dxfs) {
    this.stream = stream;
    this.wb = wb;
    this.oStyleManager = wb.oStyleManager;
    this.aCellXfs = aCellXfs;
    this.Dxfs = Dxfs;
    this.bcr = new Binary_CommonReader(this.stream);
    this.bssr = new Binary_SharedStringTableReader(this.stream, wb);
    this.Read = function () {
        var oThis = this;
        var oStyleObject = {
            aBorders: [],
            aFills: [],
            aFonts: [],
            oNumFmts: {},
            aCellStyleXfs: [],
            aCellXfs: [],
            aCellStyles: [],
            oCustomTableStyles: {}
        };
        var res = this.bcr.ReadTable(function (t, l) {
            return oThis.ReadStylesContent(t, l, oStyleObject);
        });
        this.InitStyleManager(oStyleObject);
        return res;
    };
    this.InitStyleManager = function (oStyleObject) {
        var arrStyleMap = {};
        var nIndexStyleMap = 1;
        var XfIdTmp;
        var oCellStyleNames = {};
        for (var nIndex in oStyleObject.aCellStyles) {
            if (!oStyleObject.aCellStyles.hasOwnProperty(nIndex)) {
                continue;
            }
            var oCellStyle = oStyleObject.aCellStyles[nIndex];
            var oCellStyleXfs = oStyleObject.aCellStyleXfs[oCellStyle.XfId];
            if (null == oCellStyleXfs) {
                continue;
            }
            oCellStyle.xfs = new CellXfs();
            XfIdTmp = oCellStyle.XfId;
            if (null !== XfIdTmp) {
                if (0 !== XfIdTmp) {
                    arrStyleMap[XfIdTmp] = nIndexStyleMap;
                    oCellStyle.XfId = nIndexStyleMap++;
                }
            } else {
                continue;
            }
            if (null != oCellStyleXfs.borderid) {
                var borderCellStyle = oStyleObject.aBorders[oCellStyleXfs.borderid];
                if (null != borderCellStyle) {
                    oCellStyle.xfs.border = borderCellStyle.clone();
                }
            }
            if (null != oCellStyleXfs.fillid) {
                var fillCellStyle = oStyleObject.aFills[oCellStyleXfs.fillid];
                if (null != fillCellStyle) {
                    oCellStyle.xfs.fill = fillCellStyle.clone();
                }
            }
            if (null != oCellStyleXfs.fontid) {
                var fontCellStyle = oStyleObject.aFonts[oCellStyleXfs.fontid];
                if (null != fontCellStyle) {
                    oCellStyle.xfs.font = fontCellStyle.clone();
                }
            }
            if (null != oCellStyleXfs.numid) {
                var oCurNumCellStyle = oStyleObject.oNumFmts[oCellStyleXfs.numid];
                if (null != oCurNumCellStyle) {
                    oCellStyle.xfs.num = this.ParseNum(oCurNumCellStyle, oStyleObject.oNumFmts);
                } else {
                    oCellStyle.xfs.num = this.ParseNum({
                        id: oCellStyleXfs.numid,
                        f: null
                    },
                    oStyleObject.oNumFmts);
                }
            }
            if (null != oCellStyleXfs.QuotePrefix) {
                oCellStyle.xfs.QuotePrefix = oCellStyleXfs.QuotePrefix;
            }
            if (null != oCellStyleXfs.align) {
                oCellStyle.xfs.align = oCellStyleXfs.align.clone();
            }
            if (null !== oCellStyleXfs.ApplyBorder) {
                oCellStyle.ApplyBorder = oCellStyleXfs.ApplyBorder;
            }
            if (null !== oCellStyleXfs.ApplyFill) {
                oCellStyle.ApplyFill = oCellStyleXfs.ApplyFill;
            }
            if (null !== oCellStyleXfs.ApplyFont) {
                oCellStyle.ApplyFont = oCellStyleXfs.ApplyFont;
            }
            if (null !== oCellStyleXfs.ApplyNumberFormat) {
                oCellStyle.ApplyNumberFormat = oCellStyleXfs.ApplyNumberFormat;
            }
            this.wb.CellStyles.CustomStyles.push(oCellStyle);
            if (null !== oCellStyle.Name) {
                oCellStyleNames[oCellStyle.Name] = true;
            }
        }
        var nNewStyleIndex = 1,
        newStyleName;
        for (var i = 0, length = this.wb.CellStyles.CustomStyles.length; i < length; ++i) {
            if (null === this.wb.CellStyles.CustomStyles[i].Name) {
                do {
                    newStyleName = "Style" + nNewStyleIndex++;
                } while (oCellStyleNames[newStyleName]);
                this.wb.CellStyles.CustomStyles[i].Name = newStyleName;
            }
        }
        for (var i = 0, length = oStyleObject.aCellXfs.length; i < length; ++i) {
            var xfs = oStyleObject.aCellXfs[i];
            var oNewXfs = new CellXfs();
            if (null != xfs.borderid) {
                var border = oStyleObject.aBorders[xfs.borderid];
                if (null != border) {
                    oNewXfs.border = border.clone();
                }
            }
            if (null != xfs.fillid) {
                var fill = oStyleObject.aFills[xfs.fillid];
                if (null != fill) {
                    oNewXfs.fill = fill.clone();
                }
            }
            if (null != xfs.fontid) {
                var font = oStyleObject.aFonts[xfs.fontid];
                if (null != font) {
                    oNewXfs.font = font.clone();
                }
            }
            if (null != xfs.numid) {
                var oCurNum = oStyleObject.oNumFmts[xfs.numid];
                if (null != oCurNum) {
                    oNewXfs.num = this.ParseNum(oCurNum, oStyleObject.oNumFmts);
                } else {
                    oNewXfs.num = this.ParseNum({
                        id: xfs.numid,
                        f: null
                    },
                    oStyleObject.oNumFmts);
                }
            }
            if (null != xfs.QuotePrefix) {
                oNewXfs.QuotePrefix = xfs.QuotePrefix;
            }
            if (null != xfs.align) {
                oNewXfs.align = xfs.align.clone();
            }
            if (null !== xfs.XfId) {
                XfIdTmp = arrStyleMap[xfs.XfId];
                if (null == XfIdTmp) {
                    XfIdTmp = 0;
                }
                oNewXfs.XfId = XfIdTmp;
            }
            if (0 == this.aCellXfs.length) {
                this.oStyleManager.init(oNewXfs);
            }
            this.minimizeXfs(oNewXfs);
            this.aCellXfs.push(oNewXfs);
        }
        for (var i in oStyleObject.oCustomTableStyles) {
            var item = oStyleObject.oCustomTableStyles[i];
            if (null != item) {
                var style = item.style;
                var elems = item.elements;
                this.initTableStyle(style, elems, this.Dxfs);
                this.wb.TableStyles.CustomStyles[i] = style;
            }
        }
    };
    this.initTableStyle = function (style, elems, Dxfs) {
        for (var j = 0, length2 = elems.length; j < length2; ++j) {
            var elem = elems[j];
            if (null != elem.DxfId) {
                var Dxf = Dxfs[elem.DxfId];
                if (null != Dxf) {
                    this.minimizeXfs(Dxf);
                    var oTableStyleElement = new CTableStyleElement();
                    oTableStyleElement.dxf = Dxf;
                    if (null != elem.Size) {
                        oTableStyleElement.size = elem.Size;
                    }
                    switch (elem.Type) {
                    case ETableStyleType.tablestyletypeBlankRow:
                        style.blankRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstColumn:
                        style.firstColumn = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstColumnStripe:
                        style.firstColumnStripe = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstColumnSubheading:
                        style.firstColumnSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstHeaderCell:
                        style.firstHeaderCell = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstRowStripe:
                        style.firstRowStripe = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstRowSubheading:
                        style.firstRowSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstSubtotalColumn:
                        style.firstSubtotalColumn = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstSubtotalRow:
                        style.firstSubtotalRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeFirstTotalCell:
                        style.firstTotalCell = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeHeaderRow:
                        style.headerRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeLastColumn:
                        style.lastColumn = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeLastHeaderCell:
                        style.lastHeaderCell = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeLastTotalCell:
                        style.lastTotalCell = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypePageFieldLabels:
                        style.pageFieldLabels = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypePageFieldValues:
                        style.pageFieldValues = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondColumnStripe:
                        style.secondColumnStripe = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondColumnSubheading:
                        style.secondColumnSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondRowStripe:
                        style.secondRowStripe = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondRowSubheading:
                        style.secondRowSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondSubtotalColumn:
                        style.secondSubtotalColumn = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeSecondSubtotalRow:
                        style.secondSubtotalRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeThirdColumnSubheading:
                        style.thirdColumnSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeThirdRowSubheading:
                        style.thirdRowSubheading = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeThirdSubtotalColumn:
                        style.thirdSubtotalColumn = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeThirdSubtotalRow:
                        style.thirdSubtotalRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeTotalRow:
                        style.totalRow = oTableStyleElement;
                        break;
                    case ETableStyleType.tablestyletypeWholeTable:
                        style.wholeTable = oTableStyleElement;
                        break;
                    }
                }
            }
        }
    };
    this.minimizeXfs = function (xfs) {
        if (null != xfs.border && g_oDefaultBorder.isEqual(xfs.border)) {
            xfs.border = null;
        }
        if (null != xfs.fill && g_oDefaultFill.isEqual(xfs.fill)) {
            xfs.fill = null;
        }
        if (null != xfs.font && g_oDefaultFont.isEqual(xfs.font)) {
            xfs.font = null;
        }
        if (null != xfs.num && g_oDefaultNum.isEqual(xfs.num)) {
            xfs.num = null;
        }
        if (null != xfs.align && g_oDefaultAlignAbs.isEqual(xfs.align)) {
            xfs.align = null;
        }
    };
    this.ParseNum = function (oNum, oNumFmts) {
        var oRes = null;
        var sFormat = null;
        if (null != oNum && null != oNum.f) {
            sFormat = oNum.f;
        } else {
            if (5 <= oNum.id && oNum.id <= 8) {
                switch (oNum.id) {
                case 5:
                    sFormat = "$#,##0_);($#,##0)";
                    break;
                case 6:
                    sFormat = "$#,##0_);[Red]($#,##0)";
                    break;
                case 7:
                    sFormat = "$#,##0.00_);($#,##0.00)";
                    break;
                case 8:
                    sFormat = "$#,##0.00_);[Red]($#,##0.00)";
                    break;
                }
            } else {
                var sStandartNumFormat = aStandartNumFormats[oNum.id];
                if (null != sStandartNumFormat) {
                    sFormat = sStandartNumFormat;
                }
            }
            if (null == sFormat) {
                sFormat = "General";
            }
            if (null != oNumFmts) {
                oNumFmts[oNum.id] = {
                    id: oNum.id,
                    f: sFormat
                };
            }
        }
        if (null != sFormat && "General" != sFormat) {
            oRes = new Num();
            oRes.f = sFormat;
        }
        return oRes;
    };
    this.ReadStylesContent = function (type, length, oStyleObject) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Borders === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadBorders(t, l, oStyleObject.aBorders);
            });
        } else {
            if (c_oSerStylesTypes.Fills === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadFills(t, l, oStyleObject.aFills);
                });
            } else {
                if (c_oSerStylesTypes.Fonts === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadFonts(t, l, oStyleObject.aFonts);
                    });
                } else {
                    if (c_oSerStylesTypes.NumFmts === type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadNumFmts(t, l, oStyleObject.oNumFmts);
                        });
                    } else {
                        if (c_oSerStylesTypes.CellStyleXfs === type) {
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCellStyleXfs(t, l, oStyleObject.aCellStyleXfs);
                            });
                        } else {
                            if (c_oSerStylesTypes.CellXfs === type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCellXfs(t, l, oStyleObject.aCellXfs);
                                });
                            } else {
                                if (c_oSerStylesTypes.CellStyles === type) {
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCellStyles(t, l, oStyleObject.aCellStyles);
                                    });
                                } else {
                                    if (c_oSerStylesTypes.Dxfs === type) {
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadDxfs(t, l, oThis.Dxfs);
                                        });
                                    } else {
                                        if (c_oSerStylesTypes.TableStyles === type) {
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadTableStyles(t, l, oThis.wb.TableStyles, oStyleObject.oCustomTableStyles);
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
    this.ReadBorders = function (type, length, aBorders) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Border == type) {
            var oNewBorder = new Border();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadBorder(t, l, oNewBorder);
            });
            aBorders.push(oNewBorder);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadBorder = function (type, length, oNewBorder) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerBorderTypes.Bottom == type) {
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadBorderProp(t, l, oNewBorder.b);
            });
        } else {
            if (c_oSerBorderTypes.Diagonal == type) {
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.ReadBorderProp(t, l, oNewBorder.d);
                });
            } else {
                if (c_oSerBorderTypes.End == type) {
                    res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                        return oThis.ReadBorderProp(t, l, oNewBorder.r);
                    });
                } else {
                    if (c_oSerBorderTypes.Horizontal == type) {
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.ReadBorderProp(t, l, oNewBorder.ih);
                        });
                    } else {
                        if (c_oSerBorderTypes.Start == type) {
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadBorderProp(t, l, oNewBorder.l);
                            });
                        } else {
                            if (c_oSerBorderTypes.Top == type) {
                                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                    return oThis.ReadBorderProp(t, l, oNewBorder.t);
                                });
                            } else {
                                if (c_oSerBorderTypes.Vertical == type) {
                                    res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                        return oThis.ReadBorderProp(t, l, oNewBorder.iv);
                                    });
                                } else {
                                    if (c_oSerBorderTypes.DiagonalDown == type) {
                                        oNewBorder.dd = this.stream.GetBool();
                                    } else {
                                        if (c_oSerBorderTypes.DiagonalUp == type) {
                                            oNewBorder.du = this.stream.GetBool();
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
    this.ReadBorderProp = function (type, length, oBorderProp) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerBorderPropTypes.Style == type) {
            switch (this.stream.GetUChar()) {
            case EBorderStyle.borderstyleDashDot:
                oBorderProp.setStyle(c_oAscBorderStyles.DashDot);
                break;
            case EBorderStyle.borderstyleDashDotDot:
                oBorderProp.setStyle(c_oAscBorderStyles.DashDotDot);
                break;
            case EBorderStyle.borderstyleDashed:
                oBorderProp.setStyle(c_oAscBorderStyles.Dashed);
                break;
            case EBorderStyle.borderstyleDotted:
                oBorderProp.setStyle(c_oAscBorderStyles.Dotted);
                break;
            case EBorderStyle.borderstyleDouble:
                oBorderProp.setStyle(c_oAscBorderStyles.Double);
                break;
            case EBorderStyle.borderstyleHair:
                oBorderProp.setStyle(c_oAscBorderStyles.Hair);
                break;
            case EBorderStyle.borderstyleMedium:
                oBorderProp.setStyle(c_oAscBorderStyles.Medium);
                break;
            case EBorderStyle.borderstyleMediumDashDot:
                oBorderProp.setStyle(c_oAscBorderStyles.MediumDashDot);
                break;
            case EBorderStyle.borderstyleMediumDashDotDot:
                oBorderProp.setStyle(c_oAscBorderStyles.MediumDashDotDot);
                break;
            case EBorderStyle.borderstyleMediumDashed:
                oBorderProp.setStyle(c_oAscBorderStyles.MediumDashed);
                break;
            case EBorderStyle.borderstyleNone:
                oBorderProp.setStyle(c_oAscBorderStyles.None);
                break;
            case EBorderStyle.borderstyleSlantDashDot:
                oBorderProp.setStyle(c_oAscBorderStyles.SlantDashDot);
                break;
            case EBorderStyle.borderstyleThick:
                oBorderProp.setStyle(c_oAscBorderStyles.Thick);
                break;
            case EBorderStyle.borderstyleThin:
                oBorderProp.setStyle(c_oAscBorderStyles.Thin);
                break;
            default:
                oBorderProp.setStyle(c_oAscBorderStyles.None);
                break;
            }
        } else {
            if (c_oSerBorderPropTypes.Color == type) {
                var color = new OpenColor();
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.bcr.ReadColorSpreadsheet(t, l, color);
                });
                if (null != color.theme) {
                    oBorderProp.c = g_oColorManager.getThemeColor(color.theme, color.tint);
                } else {
                    if (null != color.rgb) {
                        oBorderProp.c = new RgbColor(16777215 & color.rgb);
                    }
                }
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadCellStyleXfs = function (type, length, aCellStyleXfs) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Xfs === type) {
            var oNewXfs = {
                ApplyAlignment: null,
                ApplyBorder: null,
                ApplyFill: null,
                ApplyFont: null,
                ApplyNumberFormat: null,
                BorderId: null,
                FillId: null,
                FontId: null,
                NumFmtId: null,
                QuotePrefix: null,
                Aligment: null
            };
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadXfs(t, l, oNewXfs);
            });
            aCellStyleXfs.push(oNewXfs);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCellXfs = function (type, length, aCellXfs) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Xfs == type) {
            var oNewXfs = {
                ApplyAlignment: null,
                ApplyBorder: null,
                ApplyFill: null,
                ApplyFont: null,
                ApplyNumberFormat: null,
                BorderId: null,
                FillId: null,
                FontId: null,
                NumFmtId: null,
                QuotePrefix: null,
                Aligment: null,
                XfId: null
            };
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadXfs(t, l, oNewXfs);
            });
            aCellXfs.push(oNewXfs);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadXfs = function (type, length, oXfs) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerXfsTypes.ApplyAlignment == type) {
            oXfs.ApplyAlignment = this.stream.GetBool();
        } else {
            if (c_oSerXfsTypes.ApplyBorder == type) {
                oXfs.ApplyBorder = this.stream.GetBool();
            } else {
                if (c_oSerXfsTypes.ApplyFill == type) {
                    oXfs.ApplyFill = this.stream.GetBool();
                } else {
                    if (c_oSerXfsTypes.ApplyFont == type) {
                        oXfs.ApplyFont = this.stream.GetBool();
                    } else {
                        if (c_oSerXfsTypes.ApplyNumberFormat == type) {
                            oXfs.ApplyNumberFormat = this.stream.GetBool();
                        } else {
                            if (c_oSerXfsTypes.BorderId == type) {
                                oXfs.borderid = this.stream.GetULongLE();
                            } else {
                                if (c_oSerXfsTypes.FillId == type) {
                                    oXfs.fillid = this.stream.GetULongLE();
                                } else {
                                    if (c_oSerXfsTypes.FontId == type) {
                                        oXfs.fontid = this.stream.GetULongLE();
                                    } else {
                                        if (c_oSerXfsTypes.NumFmtId == type) {
                                            oXfs.numid = this.stream.GetULongLE();
                                        } else {
                                            if (c_oSerXfsTypes.QuotePrefix == type) {
                                                oXfs.QuotePrefix = this.stream.GetBool();
                                            } else {
                                                if (c_oSerXfsTypes.XfId === type) {
                                                    oXfs.XfId = this.stream.GetULongLE();
                                                } else {
                                                    if (c_oSerXfsTypes.Aligment == type) {
                                                        if (null == oXfs.Aligment) {
                                                            oXfs.align = new Align();
                                                        }
                                                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                                            return oThis.ReadAligment(t, l, oXfs.align);
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
        return res;
    };
    this.ReadAligment = function (type, length, oAligment) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerAligmentTypes.Horizontal == type) {
            switch (this.stream.GetUChar()) {
            case EHorizontalAlignment.horizontalalignmentCenter:
                oAligment.hor = "center";
                break;
            case EHorizontalAlignment.horizontalalignmentContinuous:
                oAligment.hor = "center";
                break;
            case EHorizontalAlignment.horizontalalignmentDistributed:
                oAligment.hor = "justify";
                break;
            case EHorizontalAlignment.horizontalalignmentFill:
                oAligment.hor = "justify";
                break;
            case EHorizontalAlignment.horizontalalignmentGeneral:
                oAligment.hor = "none";
                break;
            case EHorizontalAlignment.horizontalalignmentJustify:
                oAligment.hor = "justify";
                break;
            case EHorizontalAlignment.horizontalalignmentLeft:
                oAligment.hor = "left";
                break;
            case EHorizontalAlignment.horizontalalignmentRight:
                oAligment.hor = "right";
                break;
            }
        } else {
            if (c_oSerAligmentTypes.Indent == type) {
                oAligment.indent = this.stream.GetULongLE();
            } else {
                if (c_oSerAligmentTypes.RelativeIndent == type) {
                    oAligment.RelativeIndent = this.stream.GetULongLE();
                } else {
                    if (c_oSerAligmentTypes.ShrinkToFit == type) {
                        oAligment.shrink = this.stream.GetBool();
                    } else {
                        if (c_oSerAligmentTypes.TextRotation == type) {
                            oAligment.angle = this.stream.GetULongLE();
                        } else {
                            if (c_oSerAligmentTypes.Vertical == type) {
                                switch (this.stream.GetUChar()) {
                                case EVerticalAlignment.verticalalignmentBottom:
                                    oAligment.ver = "bottom";
                                    break;
                                case EVerticalAlignment.verticalalignmentCenter:
                                    oAligment.ver = "center";
                                    break;
                                case EVerticalAlignment.verticalalignmentDistributed:
                                    oAligment.ver = "distributed";
                                    break;
                                case EVerticalAlignment.verticalalignmentJustify:
                                    oAligment.ver = "justify";
                                    break;
                                case EVerticalAlignment.verticalalignmentTop:
                                    oAligment.ver = "top";
                                    break;
                                }
                            } else {
                                if (c_oSerAligmentTypes.WrapText == type) {
                                    oAligment.wrap = this.stream.GetBool();
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
    this.ReadFills = function (type, length, aFills) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Fill == type) {
            var oNewFill = new Fill();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadFill(t, l, oNewFill);
            });
            aFills.push(oNewFill);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadFill = function (type, length, oFill) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerFillTypes.PatternFill == type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadPatternFill(t, l, oFill);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadPatternFill = function (type, length, oFill) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerFillTypes.PatternFillBgColor == type) {
            var color = new OpenColor();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.bcr.ReadColorSpreadsheet(t, l, color);
            });
            if (null != color.theme) {
                oFill.bg = g_oColorManager.getThemeColor(color.theme, color.tint);
            } else {
                if (null != color.rgb) {
                    oFill.bg = new RgbColor(16777215 & color.rgb);
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadFonts = function (type, length, aFonts) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Font == type) {
            var oNewFont = new Font();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.bssr.ReadRPr(t, l, oNewFont);
            });
            this.bssr.CheckSchemeFont(oNewFont);
            aFonts.push(oNewFont);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadNumFmts = function (type, length, oNumFmts) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.NumFmt == type) {
            var oNewNumFmt = {
                f: null,
                id: null
            };
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadNumFmt(t, l, oNewNumFmt);
            });
            if (null != oNewNumFmt.id && null != oNewNumFmt.f) {
                oNumFmts[oNewNumFmt.id] = oNewNumFmt;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadNumFmt = function (type, length, oNumFmt) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerNumFmtTypes.FormatCode == type) {
            oNumFmt.f = this.stream.GetString2LE(length);
        } else {
            if (c_oSerNumFmtTypes.NumFmtId == type) {
                oNumFmt.id = this.stream.GetULongLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadCellStyles = function (type, length, aCellStyles) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oCellStyle = null;
        if (c_oSerStylesTypes.CellStyle === type) {
            oCellStyle = new CCellStyle();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCellStyle(t, l, oCellStyle);
            });
            aCellStyles.push(oCellStyle);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCellStyle = function (type, length, oCellStyle) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_CellStyle.BuiltinId === type) {
            oCellStyle.BuiltinId = this.stream.GetULongLE();
        } else {
            if (c_oSer_CellStyle.CustomBuiltin === type) {
                oCellStyle.CustomBuiltin = this.stream.GetBool();
            } else {
                if (c_oSer_CellStyle.Hidden === type) {
                    oCellStyle.Hidden = this.stream.GetBool();
                } else {
                    if (c_oSer_CellStyle.ILevel === type) {
                        oCellStyle.ILevel = this.stream.GetULongLE();
                    } else {
                        if (c_oSer_CellStyle.Name === type) {
                            oCellStyle.Name = this.stream.GetString2LE(length);
                        } else {
                            if (c_oSer_CellStyle.XfId === type) {
                                oCellStyle.XfId = this.stream.GetULongLE();
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
    this.ReadDxfs = function (type, length, aDxfs) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerStylesTypes.Dxf == type) {
            var oDxf = new CellXfs();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadDxf(t, l, oDxf);
            });
            aDxfs.push(oDxf);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadDxf = function (type, length, oDxf) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_Dxf.Alignment == type) {
            oDxf.align = new Align();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadAligment(t, l, oDxf.align);
            });
        } else {
            if (c_oSer_Dxf.Border == type) {
                var oNewBorder = new Border();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadBorder(t, l, oNewBorder);
                });
                oDxf.border = oNewBorder;
            } else {
                if (c_oSer_Dxf.Fill == type) {
                    var oNewFill = new Fill();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadFill(t, l, oNewFill);
                    });
                    oDxf.fill = oNewFill;
                } else {
                    if (c_oSer_Dxf.Font == type) {
                        var oNewFont = new Font();
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.bssr.ReadRPr(t, l, oNewFont);
                        });
                        this.bssr.CheckSchemeFont(oNewFont);
                        oDxf.font = oNewFont;
                    } else {
                        if (c_oSer_Dxf.NumFmt == type) {
                            var oNewNumFmt = {
                                f: null,
                                id: null
                            };
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadNumFmt(t, l, oNewNumFmt);
                            });
                            if (null != oNewNumFmt.id) {
                                oDxf.num = this.ParseNum({
                                    id: oNewNumFmt.id,
                                    f: null
                                },
                                null);
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
    this.ReadTableStyles = function (type, length, oTableStyles, oCustomStyles) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyles.DefaultTableStyle == type) {
            oTableStyles.DefaultTableStyle = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_TableStyles.DefaultPivotStyle == type) {
                oTableStyles.DefaultPivotStyle = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_TableStyles.TableStyles == type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadTableCustomStyles(t, l, oCustomStyles);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadTableCustomStyles = function (type, length, oCustomStyles) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyles.TableStyle === type) {
            var oNewStyle = new CTableStyle();
            var aElements = new Array();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadTableCustomStyle(t, l, oNewStyle, aElements);
            });
            if (null != oNewStyle.name && aElements.length > 0) {
                if (null === oNewStyle.displayName) {
                    oNewStyle.displayName = oNewStyle.name;
                }
                oCustomStyles[oNewStyle.name] = {
                    style: oNewStyle,
                    elements: aElements
                };
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTableCustomStyle = function (type, length, oNewStyle, aElements) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyle.Name === type) {
            oNewStyle.name = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_TableStyle.Pivot === type) {
                oNewStyle.pivot = this.stream.GetBool();
            } else {
                if (c_oSer_TableStyle.Table === type) {
                    oNewStyle.table = this.stream.GetBool();
                } else {
                    if (c_oSer_TableStyle.Elements === type) {
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadTableCustomStyleElements(t, l, aElements);
                        });
                    } else {
                        if (c_oSer_TableStyle.DisplayName === type) {
                            oNewStyle.displayName = this.stream.GetString2LE(length);
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadTableCustomStyleElements = function (type, length, aElements) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyle.Element === type) {
            var oNewStyleElement = {
                Type: null,
                Size: null,
                DxfId: null
            };
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadTableCustomStyleElement(t, l, oNewStyleElement);
            });
            if (null != oNewStyleElement.Type && null != oNewStyleElement.DxfId) {
                aElements.push(oNewStyleElement);
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadTableCustomStyleElement = function (type, length, oNewStyleElement) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_TableStyleElement.Type === type) {
            oNewStyleElement.Type = this.stream.GetUChar();
        } else {
            if (c_oSer_TableStyleElement.Size === type) {
                oNewStyleElement.Size = this.stream.GetULongLE();
            } else {
                if (c_oSer_TableStyleElement.DxfId === type) {
                    oNewStyleElement.DxfId = this.stream.GetULongLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
}
function Binary_WorkbookTableReader(stream, oWorkbook) {
    this.stream = stream;
    this.oWorkbook = oWorkbook;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadWorkbookContent(t, l);
        });
    };
    this.ReadWorkbookContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorkbookTypes.WorkbookPr === type) {
            if (null == this.oWorkbook.WorkbookPr) {
                this.oWorkbook.WorkbookPr = new Object();
            }
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadWorkbookPr(t, l, oThis.oWorkbook.WorkbookPr);
            });
        } else {
            if (c_oSerWorkbookTypes.BookViews === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadBookViews(t, l);
                });
            } else {
                if (c_oSerWorkbookTypes.DefinedNames === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadDefinedNames(t, l);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadWorkbookPr = function (type, length, WorkbookPr) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerWorkbookPrTypes.Date1904 == type) {
            WorkbookPr.Date1904 = this.stream.GetBool();
            g_bDate1904 = WorkbookPr.Date1904;
            c_DateCorrectConst = g_bDate1904 ? c_Date1904Const : c_Date1900Const;
        } else {
            if (c_oSerWorkbookPrTypes.DateCompatibility == type) {
                WorkbookPr.DateCompatibility = this.stream.GetBool();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadBookViews = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorkbookTypes.WorkbookView == type) {
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadWorkbookView(t, l);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadWorkbookView = function (type, length, BookViews) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerWorkbookViewTypes.ActiveTab == type) {
            this.oWorkbook.nActive = this.stream.GetULongLE();
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadDefinedNames = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorkbookTypes.DefinedName == type) {
            var oNewDefinedName = new DefinedName();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadDefinedName(t, l, oNewDefinedName);
            });
            if (null != oNewDefinedName.Name && null != oNewDefinedName.Ref) {
                if (null != oNewDefinedName.LocalSheetId) {
                    var ws = this.oWorkbook.aWorksheets[oNewDefinedName.LocalSheetId];
                    if (null != ws) {
                        ws.DefinedNames[oNewDefinedName.Name] = oNewDefinedName;
                        this.oWorkbook.oNameGenerator.addLocalDefinedName(oNewDefinedName);
                    }
                } else {
                    this.oWorkbook.oNameGenerator.addDefinedName(oNewDefinedName);
                    this.oWorkbook.oRealDefinedNames[oNewDefinedName.Name] = oNewDefinedName;
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadDefinedName = function (type, length, oDefinedName) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerDefinedNameTypes.Name == type) {
            oDefinedName.Name = this.stream.GetString2LE(length);
        } else {
            if (c_oSerDefinedNameTypes.Ref == type) {
                oDefinedName.Ref = this.stream.GetString2LE(length);
            } else {
                if (c_oSerDefinedNameTypes.LocalSheetId == type) {
                    oDefinedName.LocalSheetId = this.stream.GetULongLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
}
function Binary_WorksheetTableReader(stream, wb, aSharedStrings, aCellXfs, Dxfs, oMediaArray) {
    this.stream = stream;
    this.wb = wb;
    this.aSharedStrings = aSharedStrings;
    this.oMediaArray = oMediaArray;
    this.aCellXfs = aCellXfs;
    this.Dxfs = Dxfs;
    this.bcr = new Binary_CommonReader(this.stream);
    this.aMerged = new Array();
    this.aHyperlinks = new Array();
    this.oPPTXContentLoader = new CPPTXContentLoader();
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadWorksheetsContent(t, l);
        });
    };
    this.ReadWorksheetsContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Worksheet === type) {
            this.aMerged = new Array();
            this.aHyperlinks = new Array();
            var oNewWorksheet = new Woorksheet(this.wb, wb.aWorksheets.length, false);
            oNewWorksheet.mergeManager.stopRecalculate();
            oNewWorksheet.hyperlinkManager.stopRecalculate();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadWorksheet(t, l, oNewWorksheet);
            });
            for (var i = 0, length = this.aMerged.length; i < length; ++i) {
                var range = oNewWorksheet.getRange2(this.aMerged[i]);
                if (null != range) {
                    range.mergeOpen();
                }
            }
            for (var i = 0, length = this.aHyperlinks.length; i < length; ++i) {
                var hyperlink = this.aHyperlinks[i];
                if (null !== hyperlink.Ref) {
                    hyperlink.Ref.setHyperlinkOpen(hyperlink);
                }
            }
            oNewWorksheet.init();
            this.wb.aWorksheets.push(oNewWorksheet);
            this.wb.aWorksheetsById[oNewWorksheet.getId()] = oNewWorksheet;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadWorksheet = function (type, length, oWorksheet) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.WorksheetProp == type) {
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadWorksheetProp(t, l, oWorksheet);
            });
        } else {
            if (c_oSerWorksheetsTypes.Cols == type) {
                var oConditionalFormatting = null;
                if (null == oWorksheet.Cols) {
                    oWorksheet.aCols = new Array();
                }
                var aTempCols = new Array();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadWorksheetCols(t, l, aTempCols, oWorksheet);
                });
                var fInitCol = function (oFrom, oTo) {
                    if (null != oFrom.BestFit) {
                        oTo.BestFit = oFrom.BestFit;
                    }
                    if (null != oFrom.hd) {
                        oTo.hd = oFrom.hd;
                    }
                    if (null != oFrom.xfs) {
                        oTo.xfs = oFrom.xfs.clone();
                    } else {
                        if (null != oFrom.xfsid) {
                            var xfs = oThis.aCellXfs[oFrom.xfsid];
                            if (null != xfs) {
                                oFrom.xfs = xfs;
                                oTo.xfs = xfs.clone();
                            }
                        }
                    }
                    if (null != oFrom.width) {
                        oTo.width = oFrom.width;
                    }
                    if (null != oFrom.CustomWidth) {
                        oTo.CustomWidth = oFrom.CustomWidth;
                    }
                    if (oTo.index + 1 > oWorksheet.nColsCount) {
                        oWorksheet.nColsCount = oTo.index + 1;
                    }
                };
                var oAllCol = null;
                if (aTempCols.length > 0) {
                    var oLast = aTempCols[aTempCols.length - 1];
                    if (gc_nMaxCol == oLast.Max) {
                        oAllCol = oLast;
                        oWorksheet.oAllCol = new Col(oWorksheet, 0);
                        fInitCol(oAllCol, oWorksheet.oAllCol);
                    }
                }
                for (var i = 0, length = aTempCols.length; i < length; ++i) {
                    var elem = aTempCols[i];
                    if (null != oAllCol && elem.BestFit == oAllCol.BestFit && elem.hd == oAllCol.hd && elem.xfs == oAllCol.xfs && elem.width == oAllCol.width && elem.CustomWidth == oAllCol.CustomWidth) {
                        continue;
                    }
                    if (null == elem.width) {
                        elem.width = 0;
                        elem.hd = true;
                    }
                    for (var j = elem.Min; j <= elem.Max; j++) {
                        var oNewCol = new Col(oWorksheet, j - 1);
                        fInitCol(elem, oNewCol);
                        oWorksheet.aCols[oNewCol.index] = oNewCol;
                    }
                }
            } else {
                if (c_oSerWorksheetsTypes.SheetFormatPr == type) {
                    res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                        return oThis.ReadSheetFormatPr(t, l, oWorksheet);
                    });
                } else {
                    if (c_oSerWorksheetsTypes.PageMargins == type) {
                        var oPageMargins = new Asc.asc_CPageMargins();
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.ReadPageMargins(t, l, oPageMargins);
                        });
                        if (null == oWorksheet.PagePrintOptions) {
                            oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                        }
                        oWorksheet.PagePrintOptions.asc_setPageMargins(oPageMargins);
                    } else {
                        if (c_oSerWorksheetsTypes.PageSetup == type) {
                            var oPageSetup = new Asc.asc_CPageSetup();
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadPageSetup(t, l, oPageSetup);
                            });
                            if (null == oWorksheet.PagePrintOptions) {
                                oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                            }
                            oWorksheet.PagePrintOptions.asc_setPageSetup(oPageSetup);
                        } else {
                            if (c_oSerWorksheetsTypes.PrintOptions == type) {
                                if (null == oWorksheet.PagePrintOptions) {
                                    oWorksheet.PagePrintOptions = new Asc.asc_CPageOptions();
                                }
                                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                    return oThis.ReadPrintOptions(t, l, oWorksheet.PagePrintOptions);
                                });
                            } else {
                                if (c_oSerWorksheetsTypes.Hyperlinks == type) {
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadHyperlinks(t, l, oWorksheet);
                                    });
                                } else {
                                    if (c_oSerWorksheetsTypes.MergeCells == type) {
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadMergeCells(t, l, oWorksheet);
                                        });
                                    } else {
                                        if (c_oSerWorksheetsTypes.SheetData == type) {
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadSheetData(t, l, oWorksheet);
                                            });
                                        } else {
                                            if (c_oSerWorksheetsTypes.Drawings == type) {
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadDrawings(t, l, oWorksheet.Drawings, oWorksheet.Id);
                                                });
                                            } else {
                                                if (c_oSerWorksheetsTypes.Autofilter == type) {
                                                    var oBinary_TableReader = new Binary_TableReader(this.stream, oWorksheet, this.Dxfs);
                                                    oWorksheet.AutoFilter = new Object();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oBinary_TableReader.ReadAutoFilter(t, l, oWorksheet.AutoFilter);
                                                    });
                                                } else {
                                                    if (c_oSerWorksheetsTypes.TableParts == type) {
                                                        oWorksheet.TableParts = new Array();
                                                        var oBinary_TableReader = new Binary_TableReader(this.stream, oWorksheet, this.Dxfs);
                                                        oBinary_TableReader.Read(length, oWorksheet.TableParts);
                                                    } else {
                                                        if (c_oSerWorksheetsTypes.Comments == type) {
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadComments(t, l, oWorksheet);
                                                            });
                                                        } else {
                                                            if (c_oSerWorksheetsTypes.ConditionalFormatting === type) {
                                                                oConditionalFormatting = new Asc.CConditionalFormatting();
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadConditionalFormatting(t, l, oConditionalFormatting, function (sRange) {
                                                                        return oWorksheet.getRange2(sRange);
                                                                    });
                                                                });
                                                                oWorksheet.aConditionalFormatting.push(oConditionalFormatting);
                                                            } else {
                                                                if (c_oSerWorksheetsTypes.SheetViews === type) {
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadSheetViews(t, l, oWorksheet.sheetViews);
                                                                    });
                                                                } else {
                                                                    if (c_oSerWorksheetsTypes.SheetPr === type) {
                                                                        oWorksheet.sheetPr = new Asc.asc_CSheetPr();
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadSheetPr(t, l, oWorksheet.sheetPr);
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
    this.ReadWorksheetProp = function (type, length, oWorksheet) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerWorksheetPropTypes.Name == type) {
            oWorksheet.sName = this.stream.GetString2LE(length);
        } else {
            if (c_oSerWorksheetPropTypes.SheetId == type) {
                oWorksheet.nSheetId = this.stream.GetULongLE();
            } else {
                if (c_oSerWorksheetPropTypes.State == type) {
                    switch (this.stream.GetUChar()) {
                    case EVisibleType.visibleHidden:
                        oWorksheet.bHidden = true;
                        break;
                    case EVisibleType.visibleVeryHidden:
                        oWorksheet.bHidden = true;
                        break;
                    case EVisibleType.visibleVisible:
                        oWorksheet.bHidden = false;
                        break;
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadWorksheetCols = function (type, length, aTempCols, oWorksheet) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Col == type) {
            var oTempCol = {
                BestFit: null,
                hd: null,
                Max: null,
                Min: null,
                xfs: null,
                xfsid: null,
                width: null,
                CustomWidth: null
            };
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadWorksheetCol(t, l, oTempCol);
            });
            aTempCols.push(oTempCol);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadWorksheetCol = function (type, length, oCol) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerWorksheetColTypes.BestFit == type) {
            oCol.BestFit = this.stream.GetBool();
        } else {
            if (c_oSerWorksheetColTypes.Hidden == type) {
                oCol.hd = this.stream.GetBool();
            } else {
                if (c_oSerWorksheetColTypes.Max == type) {
                    oCol.Max = this.stream.GetULongLE();
                } else {
                    if (c_oSerWorksheetColTypes.Min == type) {
                        oCol.Min = this.stream.GetULongLE();
                    } else {
                        if (c_oSerWorksheetColTypes.Style == type) {
                            oCol.xfsid = this.stream.GetULongLE();
                        } else {
                            if (c_oSerWorksheetColTypes.Width == type) {
                                oCol.width = this.stream.GetDoubleLE();
                                if (g_nCurFileVersion < 2) {
                                    oCol.CustomWidth = 1;
                                }
                            } else {
                                if (c_oSerWorksheetColTypes.CustomWidth == type) {
                                    oCol.CustomWidth = this.stream.GetBool();
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
    this.ReadSheetFormatPr = function (type, length, oWorksheet) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerSheetFormatPrTypes.DefaultColWidth == type) {
            oWorksheet.dDefaultColWidth = this.stream.GetDoubleLE();
        } else {
            if (c_oSerSheetFormatPrTypes.DefaultRowHeight == type) {
                oWorksheet.dDefaultheight = this.stream.GetDoubleLE();
            } else {
                if (c_oSerSheetFormatPrTypes.BaseColWidth === type) {
                    oWorksheet.nBaseColWidth = this.stream.GetULongLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadPageMargins = function (type, length, oPageMargins) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_PageMargins.Left == type) {
            oPageMargins.asc_setLeft(this.stream.GetDoubleLE());
        } else {
            if (c_oSer_PageMargins.Top == type) {
                oPageMargins.asc_setTop(this.stream.GetDoubleLE());
            } else {
                if (c_oSer_PageMargins.Right == type) {
                    oPageMargins.asc_setRight(this.stream.GetDoubleLE());
                } else {
                    if (c_oSer_PageMargins.Bottom == type) {
                        oPageMargins.asc_setBottom(this.stream.GetDoubleLE());
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadPageSetup = function (type, length, oPageSetup) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_PageSetup.Orientation == type) {
            var byteFormatOrientation = this.stream.GetUChar();
            var byteOrientation = null;
            switch (byteFormatOrientation) {
            case EPageOrientation.pageorientPortrait:
                byteOrientation = c_oAscPageOrientation.PagePortrait;
                break;
            case EPageOrientation.pageorientLandscape:
                byteOrientation = c_oAscPageOrientation.PageLandscape;
                break;
            }
            if (null != byteOrientation) {
                oPageSetup.asc_setOrientation(byteOrientation);
            }
        } else {
            if (c_oSer_PageSetup.PaperSize == type) {
                var bytePaperSize = this.stream.GetUChar();
                var item = DocumentPageSize.getSizeById(bytePaperSize);
                oPageSetup.asc_setWidth(item.w_mm);
                oPageSetup.asc_setHeight(item.h_mm);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadPrintOptions = function (type, length, oPrintOptions) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_PrintOptions.GridLines == type) {
            oPrintOptions.asc_setGridLines(this.stream.GetBool());
        } else {
            if (c_oSer_PrintOptions.Headings == type) {
                oPrintOptions.asc_setHeadings(this.stream.GetBool());
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadHyperlinks = function (type, length, ws) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Hyperlink == type) {
            var oNewHyperlink = new Hyperlink();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadHyperlink(t, l, ws, oNewHyperlink);
            });
            this.aHyperlinks.push(oNewHyperlink);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadHyperlink = function (type, length, ws, oHyperlink) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerHyperlinkTypes.Ref == type) {
            oHyperlink.Ref = ws.getRange2(this.stream.GetString2LE(length));
        } else {
            if (c_oSerHyperlinkTypes.Hyperlink == type) {
                oHyperlink.Hyperlink = this.stream.GetString2LE(length);
            } else {
                if (c_oSerHyperlinkTypes.Location == type) {
                    oHyperlink.setLocation(this.stream.GetString2LE(length));
                } else {
                    if (c_oSerHyperlinkTypes.Tooltip == type) {
                        oHyperlink.Tooltip = this.stream.GetString2LE(length);
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadMergeCells = function (type, length, ws) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.MergeCell == type) {
            this.aMerged.push(this.stream.GetString2LE(length));
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSheetData = function (type, length, ws) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Row == type) {
            var oNewRow = new Row(ws);
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadRow(t, l, oNewRow, ws);
            });
            if (null != oNewRow.r) {
                ws.aGCells[oNewRow.r - 1] = oNewRow;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadRow = function (type, length, oRow, ws) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRowTypes.Row == type) {
            oRow.r = this.stream.GetULongLE();
            oRow.index = oRow.r - 1;
            if (oRow.r > ws.nRowsCount) {
                ws.nRowsCount = oRow.r;
            }
        } else {
            if (c_oSerRowTypes.Style == type) {
                var xfs = this.aCellXfs[this.stream.GetULongLE()];
                if (null != xfs) {
                    oRow.xfs = xfs.clone();
                }
            } else {
                if (c_oSerRowTypes.Height == type) {
                    oRow.h = this.stream.GetDoubleLE();
                    if (g_nCurFileVersion < 2) {
                        oRow.CustomHeight = true;
                    }
                } else {
                    if (c_oSerRowTypes.CustomHeight == type) {
                        oRow.CustomHeight = this.stream.GetBool();
                    } else {
                        if (c_oSerRowTypes.Hidden == type) {
                            oRow.hd = this.stream.GetBool();
                        } else {
                            if (c_oSerRowTypes.Cells == type) {
                                if (null == oRow.Cells) {
                                    oRow.c = new Object();
                                }
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCells(t, l, ws, oRow.c);
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
    this.ReadCells = function (type, length, ws, aCells) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerRowTypes.Cell == type) {
            var oNewCell = new Cell(ws);
            var oCellVal = {
                val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCell(t, l, ws, oNewCell, oCellVal);
            });
            if (null != oNewCell.oId) {
                var nCellCol = 0;
                if (null != oNewCell) {
                    var nCols = oNewCell.oId.getCol();
                    nCellCol = nCols - 1;
                    if (nCols > ws.nColsCount) {
                        ws.nColsCount = nCols;
                    }
                }
                if (null != oCellVal.val) {
                    var bText = false;
                    if (CellValueType.String == oNewCell.oValue.type || CellValueType.Error == oNewCell.oValue.type) {
                        var ss = this.aSharedStrings[oCellVal.val];
                        if (null != ss) {
                            bText = true;
                            var nType = oNewCell.oValue.type;
                            oNewCell.oValue = ss.clone(oNewCell);
                            oNewCell.oValue.type = nType;
                        }
                    }
                    if (false == bText) {
                        oNewCell.oValue.number = oCellVal.val;
                    }
                }
                aCells[nCellCol] = oNewCell;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCell = function (type, length, ws, oCell, oCellVal) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerCellTypes.Ref == type) {
            oCell.oId = new CellAddress(this.stream.GetString2LE(length));
        } else {
            if (c_oSerCellTypes.Style == type) {
                var nStyleIndex = this.stream.GetULongLE();
                if (0 != nStyleIndex) {
                    var xfs = this.aCellXfs[nStyleIndex];
                    if (null != xfs) {
                        oCell.xfs = xfs.clone();
                    }
                }
            } else {
                if (c_oSerCellTypes.Type == type) {
                    switch (this.stream.GetUChar()) {
                    case ECellTypeType.celltypeBool:
                        oCell.oValue.type = CellValueType.Bool;
                        break;
                    case ECellTypeType.celltypeError:
                        oCell.oValue.type = CellValueType.Error;
                        break;
                    case ECellTypeType.celltypeNumber:
                        oCell.oValue.type = CellValueType.Number;
                        break;
                    case ECellTypeType.celltypeSharedString:
                        oCell.oValue.type = CellValueType.String;
                        break;
                    }
                } else {
                    if (c_oSerCellTypes.Formula == type) {
                        if (null == oCell.oFormulaExt) {
                            oCell.oFormulaExt = {
                                aca: null,
                                bx: null,
                                ca: null,
                                del1: null,
                                del2: null,
                                dt2d: null,
                                dtr: null,
                                r1: null,
                                r2: null,
                                si: null,
                                t: null,
                                v: null
                            };
                        }
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.ReadFormula(t, l, oCell.oFormulaExt);
                        });
                    } else {
                        if (c_oSerCellTypes.Value == type) {
                            oCellVal.val = this.stream.GetDoubleLE();
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadFormula = function (type, length, oFormula) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSerFormulaTypes.Aca == type) {
            oFormula.aca = this.stream.GetBool();
        } else {
            if (c_oSerFormulaTypes.Bx == type) {
                oFormula.bx = this.stream.GetBool();
            } else {
                if (c_oSerFormulaTypes.Ca == type) {
                    oFormula.ca = this.stream.GetBool();
                } else {
                    if (c_oSerFormulaTypes.Del1 == type) {
                        oFormula.del1 = this.stream.GetBool();
                    } else {
                        if (c_oSerFormulaTypes.Del2 == type) {
                            oFormula.del2 = this.stream.GetBool();
                        } else {
                            if (c_oSerFormulaTypes.Dt2D == type) {
                                oFormula.dt2d = this.stream.GetBool();
                            } else {
                                if (c_oSerFormulaTypes.Dtr == type) {
                                    oFormula.dtr = this.stream.GetBool();
                                } else {
                                    if (c_oSerFormulaTypes.R1 == type) {
                                        oFormula.r1 = this.stream.GetString2LE(length);
                                    } else {
                                        if (c_oSerFormulaTypes.R2 == type) {
                                            oFormula.r2 = this.stream.GetString2LE(length);
                                        } else {
                                            if (c_oSerFormulaTypes.Ref == type) {
                                                oFormula.ref = this.stream.GetString2LE(length);
                                            } else {
                                                if (c_oSerFormulaTypes.Si == type) {
                                                    oFormula.si = this.stream.GetULongLE();
                                                } else {
                                                    if (c_oSerFormulaTypes.T == type) {
                                                        oFormula.t = this.stream.GetUChar();
                                                    } else {
                                                        if (c_oSerFormulaTypes.Text == type) {
                                                            oFormula.v = this.stream.GetString2LE(length);
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
        return res;
    };
    this.ReadDrawings = function (type, length, aDrawings, wsId) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Drawing == type) {
            var objectRender = new DrawingObjects();
            var oFlags = {
                from: false,
                to: false,
                pos: false,
                ext: false
            };
            var oNewDrawing = objectRender.createDrawingObject();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadDrawing(t, l, oNewDrawing, oFlags);
            });
            if (null != oNewDrawing.graphicObject) {
                if (false != oFlags.from && false != oFlags.to) {
                    oNewDrawing.Type = ECellAnchorType.cellanchorTwoCell;
                } else {
                    if (false != oFlags.from && false != oFlags.ext) {
                        oNewDrawing.Type = ECellAnchorType.cellanchorOneCell;
                    } else {
                        if (false != oFlags.pos && false != oFlags.ext) {
                            oNewDrawing.Type = ECellAnchorType.cellanchorAbsolute;
                        }
                    }
                }
                aDrawings.push(oNewDrawing);
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadDrawing = function (type, length, oDrawing, oFlags) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingType.Type == type) {
            oDrawing.Type = this.stream.GetUChar();
        } else {
            if (c_oSer_DrawingType.From == type) {
                oFlags.from = true;
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.ReadFromTo(t, l, oDrawing.from);
                });
            } else {
                if (c_oSer_DrawingType.To == type) {
                    oFlags.to = true;
                    res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                        return oThis.ReadFromTo(t, l, oDrawing.to);
                    });
                } else {
                    if (c_oSer_DrawingType.Pos == type) {
                        oFlags.pos = true;
                        if (null == oDrawing.Pos) {
                            oDrawing.Pos = new Object();
                        }
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.ReadPos(t, l, oDrawing.Pos);
                        });
                    } else {
                        if (c_oSer_DrawingType.Ext == type) {
                            oFlags.ext = true;
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadExt(t, l, oDrawing.ext);
                            });
                        } else {
                            if (c_oSer_DrawingType.Pic == type) {
                                oDrawing.image = new Image();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadPic(t, l, oDrawing);
                                });
                            } else {
                                if (c_oSer_DrawingType.pptxDrawing == type) {
                                    var oGraphicObject = this.oPPTXContentLoader.ReadGraphicObject(this.stream);
                                    if (null != oGraphicObject) {
                                        oDrawing.graphicObject = oGraphicObject;
                                        oGraphicObject.setDrawingBase(oDrawing);
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
    this.ReadFromTo = function (type, length, oFromTo) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingFromToType.Col == type) {
            oFromTo.col = this.stream.GetULongLE();
        } else {
            if (c_oSer_DrawingFromToType.ColOff == type) {
                oFromTo.colOff = this.stream.GetDoubleLE();
            } else {
                if (c_oSer_DrawingFromToType.Row == type) {
                    oFromTo.row = this.stream.GetULongLE();
                } else {
                    if (c_oSer_DrawingFromToType.RowOff == type) {
                        oFromTo.rowOff = this.stream.GetDoubleLE();
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
        return res;
    };
    this.ReadPos = function (type, length, oPos) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingPosType.X == type) {
            oPos.X = this.stream.GetDoubleLE();
        } else {
            if (c_oSer_DrawingPosType.Y == type) {
                oPos.Y = this.stream.GetDoubleLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadExt = function (type, length, oExt) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingExtType.Cx == type) {
            oExt.cx = this.stream.GetDoubleLE();
        } else {
            if (c_oSer_DrawingExtType.Cy == type) {
                oExt.cy = this.stream.GetDoubleLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadPic = function (type, length, oDrawing) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingType.PicSrc == type) {
            var nIndex = this.stream.GetULongLE();
            var src = this.oMediaArray[nIndex];
            if (null != src) {
                if (window["scriptBridge"]) {
                    oDrawing.image.src = window["scriptBridge"]["workPath"]() + src;
                    oDrawing.imageUrl = window["scriptBridge"]["workPath"]() + src;
                } else {
                    oDrawing.image.src = src;
                    oDrawing.imageUrl = src;
                }
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadComments = function (type, length, oWorksheet) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSerWorksheetsTypes.Comment == type) {
            var oCommentCoords = new Asc.asc_CCommentCoords();
            var aCommentData = new Array();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadComment(t, l, oCommentCoords, aCommentData);
            });
            for (var i = 0, length = aCommentData.length; i < length; ++i) {
                var elem = aCommentData[i];
                elem.asc_putRow(oCommentCoords.asc_getRow());
                elem.asc_putCol(oCommentCoords.asc_getCol());
                elem.wsId = oWorksheet.Id;
                if (elem.asc_getDocumentFlag()) {
                    elem.nId = "doc_" + (oWorksheet.aComments.length + 1);
                } else {
                    elem.nId = "sheet" + elem.wsId + "_" + (oWorksheet.aComments.length + 1);
                }
                oWorksheet.aComments.push(elem);
            }
            oWorksheet.aCommentsCoords.push(oCommentCoords);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadComment = function (type, length, oCommentCoords, aCommentData) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_Comments.Row == type) {
            oCommentCoords.asc_setRow(this.stream.GetULongLE());
        } else {
            if (c_oSer_Comments.Col == type) {
                oCommentCoords.asc_setCol(this.stream.GetULongLE());
            } else {
                if (c_oSer_Comments.CommentDatas == type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCommentDatas(t, l, aCommentData);
                    });
                } else {
                    if (c_oSer_Comments.Left == type) {
                        oCommentCoords.asc_setLeft(this.stream.GetULongLE());
                    } else {
                        if (c_oSer_Comments.LeftOffset == type) {
                            oCommentCoords.asc_setLeftOffset(this.stream.GetULongLE());
                        } else {
                            if (c_oSer_Comments.Top == type) {
                                oCommentCoords.asc_setTop(this.stream.GetULongLE());
                            } else {
                                if (c_oSer_Comments.TopOffset == type) {
                                    oCommentCoords.asc_setTopOffset(this.stream.GetULongLE());
                                } else {
                                    if (c_oSer_Comments.Right == type) {
                                        oCommentCoords.asc_setRight(this.stream.GetULongLE());
                                    } else {
                                        if (c_oSer_Comments.RightOffset == type) {
                                            oCommentCoords.asc_setRightOffset(this.stream.GetULongLE());
                                        } else {
                                            if (c_oSer_Comments.Bottom == type) {
                                                oCommentCoords.asc_setBottom(this.stream.GetULongLE());
                                            } else {
                                                if (c_oSer_Comments.BottomOffset == type) {
                                                    oCommentCoords.asc_setBottomOffset(this.stream.GetULongLE());
                                                } else {
                                                    if (c_oSer_Comments.LeftMM == type) {
                                                        oCommentCoords.asc_setLeftMM(this.stream.GetDoubleLE());
                                                    } else {
                                                        if (c_oSer_Comments.TopMM == type) {
                                                            oCommentCoords.asc_setTopMM(this.stream.GetDoubleLE());
                                                        } else {
                                                            if (c_oSer_Comments.WidthMM == type) {
                                                                oCommentCoords.asc_setWidthMM(this.stream.GetDoubleLE());
                                                            } else {
                                                                if (c_oSer_Comments.HeightMM == type) {
                                                                    oCommentCoords.asc_setHeightMM(this.stream.GetDoubleLE());
                                                                } else {
                                                                    if (c_oSer_Comments.MoveWithCells == type) {
                                                                        oCommentCoords.asc_setMoveWithCells(this.stream.GetBool());
                                                                    } else {
                                                                        if (c_oSer_Comments.SizeWithCells == type) {
                                                                            oCommentCoords.asc_setSizeWithCells(this.stream.GetBool());
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
    this.ReadCommentDatas = function (type, length, aCommentData) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_Comments.CommentData === type) {
            var oCommentData = new Asc.asc_CCommentData();
            oCommentData.asc_putDocumentFlag(false);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCommentData(t, l, oCommentData);
            });
            aCommentData.push(oCommentData);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCommentData = function (type, length, oCommentData) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CommentData.Text == type) {
            oCommentData.asc_putText(this.stream.GetString2LE(length));
        } else {
            if (c_oSer_CommentData.Time == type) {
                var oDate = this.Iso8601ToDate(this.stream.GetString2LE(length));
                if (null != oDate) {
                    oCommentData.asc_putTime(oDate.getTime() + "");
                }
            } else {
                if (c_oSer_CommentData.UserId == type) {
                    oCommentData.asc_putUserId(this.stream.GetString2LE(length));
                } else {
                    if (c_oSer_CommentData.UserName == type) {
                        oCommentData.asc_putUserName(this.stream.GetString2LE(length));
                    } else {
                        if (c_oSer_CommentData.QuoteText == type) {
                            oCommentData.asc_putQuoteText(this.stream.GetString2LE(length));
                        } else {
                            if (c_oSer_CommentData.Replies == type) {
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadReplies(t, l, oCommentData);
                                });
                            } else {
                                if (c_oSer_CommentData.Solved == type) {
                                    oCommentData.asc_putSolved(this.stream.GetBool());
                                } else {
                                    if (c_oSer_CommentData.Document == type) {
                                        oCommentData.asc_putDocumentFlag(this.stream.GetBool());
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
    this.ReadConditionalFormatting = function (type, length, oConditionalFormatting, functionGetRange2) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oConditionalFormattingRule = null;
        if (c_oSer_ConditionalFormatting.Pivot === type) {
            oConditionalFormatting.Pivot = this.stream.GetBool();
        } else {
            if (c_oSer_ConditionalFormatting.SqRef === type) {
                oConditionalFormatting.SqRef = this.stream.GetString2LE(length);
                oConditionalFormatting.SqRefRange = functionGetRange2(oConditionalFormatting.SqRef);
            } else {
                if (c_oSer_ConditionalFormatting.ConditionalFormattingRule === type) {
                    oConditionalFormattingRule = new Asc.CConditionalFormattingRule();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadConditionalFormattingRule(t, l, oConditionalFormattingRule);
                    });
                    oConditionalFormatting.aRules.push(oConditionalFormattingRule);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadConditionalFormattingRule = function (type, length, oConditionalFormattingRule) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oConditionalFormattingRuleElement = null;
        if (c_oSer_ConditionalFormattingRule.AboveAverage === type) {
            oConditionalFormattingRule.AboveAverage = this.stream.GetBool();
        } else {
            if (c_oSer_ConditionalFormattingRule.Bottom === type) {
                oConditionalFormattingRule.Bottom = this.stream.GetBool();
            } else {
                if (c_oSer_ConditionalFormattingRule.DxfId === type) {
                    var DxfId = this.stream.GetULongLE();
                    var dxf = this.Dxfs[DxfId];
                    oConditionalFormattingRule.dxf = dxf;
                } else {
                    if (c_oSer_ConditionalFormattingRule.EqualAverage === type) {
                        oConditionalFormattingRule.EqualAverage = this.stream.GetBool();
                    } else {
                        if (c_oSer_ConditionalFormattingRule.Operator === type) {
                            oConditionalFormattingRule.Operator = this.stream.GetString2LE(length);
                        } else {
                            if (c_oSer_ConditionalFormattingRule.Percent === type) {
                                oConditionalFormattingRule.Percent = this.stream.GetBool();
                            } else {
                                if (c_oSer_ConditionalFormattingRule.Priority === type) {
                                    oConditionalFormattingRule.Priority = this.stream.GetULongLE();
                                } else {
                                    if (c_oSer_ConditionalFormattingRule.Rank === type) {
                                        oConditionalFormattingRule.Rank = this.stream.GetULongLE();
                                    } else {
                                        if (c_oSer_ConditionalFormattingRule.StdDev === type) {
                                            oConditionalFormattingRule.StdDev = this.stream.GetULongLE();
                                        } else {
                                            if (c_oSer_ConditionalFormattingRule.StopIfTrue === type) {
                                                oConditionalFormattingRule.StopIfTrue = this.stream.GetBool();
                                            } else {
                                                if (c_oSer_ConditionalFormattingRule.Text === type) {
                                                    oConditionalFormattingRule.Text = this.stream.GetString2LE(length);
                                                } else {
                                                    if (c_oSer_ConditionalFormattingRule.TimePeriod === type) {
                                                        oConditionalFormattingRule.TimePeriod = this.stream.GetString2LE(length);
                                                    } else {
                                                        if (c_oSer_ConditionalFormattingRule.Type === type) {
                                                            oConditionalFormattingRule.Type = this.stream.GetString2LE(length);
                                                        } else {
                                                            if (c_oSer_ConditionalFormattingRule.ColorScale === type) {
                                                                oConditionalFormattingRuleElement = new Asc.CColorScale();
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadColorScale(t, l, oConditionalFormattingRuleElement);
                                                                });
                                                                oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
                                                            } else {
                                                                if (c_oSer_ConditionalFormattingRule.DataBar === type) {
                                                                    oConditionalFormattingRuleElement = new Asc.CDataBar();
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadDataBar(t, l, oConditionalFormattingRuleElement);
                                                                    });
                                                                    oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
                                                                } else {
                                                                    if (c_oSer_ConditionalFormattingRule.FormulaCF === type) {
                                                                        oConditionalFormattingRuleElement = new Asc.CFormulaCF();
                                                                        oConditionalFormattingRuleElement.Text = this.stream.GetString2LE(length);
                                                                        oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
                                                                    } else {
                                                                        if (c_oSer_ConditionalFormattingRule.IconSet === type) {
                                                                            oConditionalFormattingRuleElement = new Asc.CIconSet();
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadIconSet(t, l, oConditionalFormattingRuleElement);
                                                                            });
                                                                            oConditionalFormattingRule.aRuleElements.push(oConditionalFormattingRuleElement);
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
    this.ReadColorScale = function (type, length, oColorScale) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oObject = null;
        if (c_oSer_ConditionalFormattingRuleColorScale.CFVO === type) {
            oObject = new Asc.CConditionalFormatValueObject();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCFVO(t, l, oObject);
            });
            oColorScale.aCFVOs.push(oObject);
        } else {
            if (c_oSer_ConditionalFormattingRuleColorScale.Color === type) {
                oObject = new OpenColor();
                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                    return oThis.bcr.ReadColorSpreadsheet(t, l, oObject);
                });
                if (null != oObject.theme) {
                    oColorScale.aColors.push(g_oColorManager.getThemeColor(oObject.theme, oObject.tint));
                } else {
                    if (null != oObject.rgb) {
                        oColorScale.aColors.push(new RgbColor(16777215 & oObject.rgb));
                    }
                }
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadDataBar = function (type, length, oDataBar) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oObject = null;
        if (c_oSer_ConditionalFormattingDataBar.MaxLength === type) {
            oDataBar.MaxLength = this.stream.GetULongLE();
        } else {
            if (c_oSer_ConditionalFormattingDataBar.MinLength === type) {
                oDataBar.MinLength = this.stream.GetULongLE();
            } else {
                if (c_oSer_ConditionalFormattingDataBar.ShowValue === type) {
                    oDataBar.ShowValue = this.stream.GetBool();
                } else {
                    if (c_oSer_ConditionalFormattingDataBar.Color === type) {
                        oObject = new OpenColor();
                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                            return oThis.bcr.ReadColorSpreadsheet(t, l, oObject);
                        });
                        if (null != oObject.theme) {
                            oDataBar.Color = g_oColorManager.getThemeColor(oObject.theme, oObject.tint);
                        } else {
                            if (null != oObject.rgb) {
                                oDataBar.Color = new RgbColor(16777215 & oObject.rgb);
                            }
                        }
                    } else {
                        if (c_oSer_ConditionalFormattingDataBar.CFVO === type) {
                            oObject = new Asc.CConditionalFormatValueObject();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCFVO(t, l, oObject);
                            });
                            oDataBar.aCFVOs.push(oObject);
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadIconSet = function (type, length, oIconSet) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oObject = null;
        if (c_oSer_ConditionalFormattingIconSet.IconSet === type) {
            oIconSet.IconSet = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_ConditionalFormattingIconSet.Percent === type) {
                oIconSet.Percent = this.stream.GetBool();
            } else {
                if (c_oSer_ConditionalFormattingIconSet.Reverse === type) {
                    oIconSet.Reverse = this.stream.GetBool();
                } else {
                    if (c_oSer_ConditionalFormattingIconSet.ShowValue === type) {
                        oIconSet.ShowValue = this.stream.GetBool();
                    } else {
                        if (c_oSer_ConditionalFormattingIconSet.CFVO === type) {
                            oObject = new Asc.CConditionalFormatValueObject();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCFVO(t, l, oObject);
                            });
                            oIconSet.aCFVOs.push(oObject);
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadCFVO = function (type, length, oCFVO) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_ConditionalFormattingValueObject.Gte === type) {
            oCFVO.Gte = this.stream.GetBool();
        } else {
            if (c_oSer_ConditionalFormattingValueObject.Type === type) {
                oCFVO.Type = this.stream.GetString2LE(length);
            } else {
                if (c_oSer_ConditionalFormattingValueObject.Val === type) {
                    oCFVO.Val = this.stream.GetString2LE(length);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadSheetViews = function (type, length, aSheetViews) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        var oSheetView = null;
        if (c_oSerWorksheetsTypes.SheetView === type) {
            oSheetView = new Asc.asc_CSheetViewSettings();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadSheetView(t, l, oSheetView);
            });
            aSheetViews.push(oSheetView);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSheetView = function (type, length, oSheetView) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_SheetView.ShowGridLines === type) {
            oSheetView.showGridLines = this.stream.GetBool();
        } else {
            if (c_oSer_SheetView.ShowRowColHeaders === type) {
                oSheetView.showRowColHeaders = this.stream.GetBool();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadSheetPr = function (type, length, oSheetPr) {
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_SheetPr.CodeName === type) {
            oSheetPr.CodeName = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_SheetPr.EnableFormatConditionsCalculation === type) {
                oSheetPr.EnableFormatConditionsCalculation = this.stream.GetBool();
            } else {
                if (c_oSer_SheetPr.FilterMode === type) {
                    oSheetPr.FilterMode = this.stream.GetBool();
                } else {
                    if (c_oSer_SheetPr.Published === type) {
                        oSheetPr.Published = this.stream.GetBool();
                    } else {
                        if (c_oSer_SheetPr.SyncHorizontal === type) {
                            oSheetPr.SyncHorizontal = this.stream.GetBool();
                        } else {
                            if (c_oSer_SheetPr.SyncRef === type) {
                                oSheetPr.SyncRef = this.stream.GetString2LE(length);
                            } else {
                                if (c_oSer_SheetPr.SyncVertical === type) {
                                    oSheetPr.SyncVertical = this.stream.GetBool();
                                } else {
                                    if (c_oSer_SheetPr.TransitionEntry === type) {
                                        oSheetPr.TransitionEntry = this.stream.GetBool();
                                    } else {
                                        if (c_oSer_SheetPr.TransitionEvaluation === type) {
                                            oSheetPr.TransitionEvaluation = this.stream.GetBool();
                                        } else {
                                            if (c_oSer_SheetPr.TabColor === type) {
                                                var oObject = new OpenColor();
                                                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                                    return oThis.bcr.ReadColorSpreadsheet(t, l, oObject);
                                                });
                                                if (null != oObject.theme) {
                                                    oSheetPr.TabColor = g_oColorManager.getThemeColor(oObject.theme, oObject.tint);
                                                } else {
                                                    if (null != oObject.rgb) {
                                                        oSheetPr.TabColor = new RgbColor(16777215 & oObject.rgb);
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
    this.ReadReplies = function (type, length, oCommentData) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CommentData.Reply === type) {
            var oReplyData = new Asc.asc_CCommentData();
            oReplyData.asc_putDocumentFlag(false);
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCommentData(t, l, oReplyData);
            });
            oCommentData.aReplies.push(oReplyData);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
}
function Binary_CalcChainTableReader(stream, aCalcChain) {
    this.stream = stream;
    this.aCalcChain = aCalcChain;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        return this.bcr.ReadTable(function (t, l) {
            return oThis.ReadCalcChainContent(t, l);
        });
    };
    this.ReadCalcChainContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_CalcChainType.CalcChainItem === type) {
            var oNewCalcChain = new Object();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadCalcChain(t, l, oNewCalcChain);
            });
            this.aCalcChain.push(oNewCalcChain);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadCalcChain = function (type, length, oCalcChain) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_CalcChainType.Array == type) {
            oCalcChain.Array = this.stream.GetBool();
        } else {
            if (c_oSer_CalcChainType.SheetId == type) {
                oCalcChain.SheetId = this.stream.GetULongLE();
            } else {
                if (c_oSer_CalcChainType.DependencyLevel == type) {
                    oCalcChain.DependencyLevel = this.stream.GetBool();
                } else {
                    if (c_oSer_CalcChainType.Ref == type) {
                        oCalcChain.Ref = this.stream.GetString2LE(length);
                    } else {
                        if (c_oSer_CalcChainType.ChildChain == type) {
                            oCalcChain.ChildChain = this.stream.GetBool();
                        } else {
                            if (c_oSer_CalcChainType.NewThread == type) {
                                oCalcChain.NewThread = this.stream.GetBool();
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
function Binary_OtherTableReader(stream, oMedia, sUrlPath, wb) {
    this.stream = stream;
    this.oMedia = oMedia;
    this.sUrlPath = sUrlPath;
    this.wb = wb;
    this.bcr = new Binary_CommonReader(this.stream);
    this.Read = function () {
        var oThis = this;
        var oRes = this.bcr.ReadTable(function (t, l) {
            return oThis.ReadOtherContent(t, l);
        });
        this.wb.clrSchemeMap = GenerateDefaultColorMap();
        if (null == this.wb.theme) {
            this.wb.theme = GenerateDefaultTheme(this.wb);
        }
        g_oColorManager.setTheme(this.wb.theme);
        var sMinorFont = null;
        if (null != this.wb.theme.themeElements && null != this.wb.theme.themeElements.fontScheme && null != this.wb.theme.themeElements.fontScheme.minorFont) {
            sMinorFont = this.wb.theme.themeElements.fontScheme.minorFont.latin;
        }
        var sDefFont = "Calibri";
        if (null != sMinorFont && "" != sMinorFont) {
            sDefFont = sMinorFont;
        }
        g_oDefaultFont = g_oDefaultFontAbs = new Font({
            fn: sDefFont,
            scheme: EFontScheme.fontschemeNone,
            fs: 11,
            b: false,
            i: false,
            u: "none",
            s: false,
            c: g_oColorManager.getThemeColor(g_nColorTextDefault),
            va: "baseline",
            skip: false,
            repeat: false
        });
        g_oDefaultFill = g_oDefaultFillAbs = new Fill({
            bg: null
        });
        g_oDefaultBorder = g_oDefaultBorderAbs = new Border({
            l: new BorderProp(),
            t: new BorderProp(),
            r: new BorderProp(),
            b: new BorderProp(),
            d: new BorderProp(),
            ih: new BorderProp(),
            iv: new BorderProp(),
            dd: false,
            du: false
        });
        g_oDefaultNum = g_oDefaultNumAbs = new Num({
            f: "General"
        });
        g_oDefaultAlign = g_oDefaultAlignAbs = new Align({
            hor: "none",
            indent: 0,
            RelativeIndent: 0,
            shrink: false,
            angle: 0,
            ver: "bottom",
            wrap: false
        });
        return oRes;
    };
    this.ReadOtherContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OtherType.Media === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMediaContent(t, l);
            });
        } else {
            if (c_oSer_OtherType.EmbeddedFonts === type) {
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
                var api = this.wb.oApi;
                if (true == api.isUseEmbeddedCutFonts) {
                    var font_cuts = api.FontLoader.embedded_cut_manager;
                    font_cuts.Url = this.sUrlPath + "fonts/fonts.js";
                    font_cuts.init_cut_fonts(_embedded_fonts);
                    font_cuts.bIsCutFontsUse = true;
                }
            } else {
                if (c_oSer_OtherType.Theme === type) {
                    this.wb.theme = window.global_pptx_content_loader.ReadTheme(this, this.stream);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadMediaContent = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_OtherType.MediaItem === type) {
            var oNewMedia = new Object();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadMediaItem(t, l, oNewMedia);
            });
            if (null != oNewMedia.id && null != oNewMedia.src) {
                this.oMedia[oNewMedia.id] = oNewMedia.src;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadMediaItem = function (type, length, oNewMedia) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_OtherType.MediaSrc === type) {
            var src = this.stream.GetString2LE(length);
            if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
                oNewMedia.src = this.sUrlPath + "media/" + src;
            } else {
                oNewMedia.src = src;
            }
        } else {
            if (c_oSer_OtherType.MediaId === type) {
                oNewMedia.id = this.stream.GetULongLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
}
function BinaryFileReader(sUrlPath) {
    this.stream;
    this.sUrlPath = sUrlPath;
    this.getbase64DecodedData = function (szSrc, stream) {
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
        stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;
        this.getbase64DecodedData2(szSrc, index, stream, 0);
        if (version.length > 1) {
            var nTempVersion = version.substring(1) - 0;
            if (nTempVersion) {
                g_nCurFileVersion = nTempVersion;
            }
        }
        return stream;
    };
    this.getbase64DecodedData2 = function (szSrc, szSrcOffset, stream, streamOffset) {
        var srcLen = szSrc.length;
        var nWritten = streamOffset;
        var dstPx = stream.data;
        var index = szSrcOffset;
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
                var nLen = (nBits / 8) | 0;
                for (i = 0; i < nLen; i++) {
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
                var nLen = (nBits / 8) | 0;
                for (i = 0; i < nLen; i++) {
                    dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }
        return nWritten;
    };
    this.Read = function (data, wb) {
        this.stream = this.getbase64DecodedData(data);
        History.TurnOff();
        this.ReadFile(wb);
        ReadDefCellStyles(wb, wb.CellStyles.DefaultStyles);
        ReadDefTableStyles(wb, wb.TableStyles.DefaultStyles);
        wb.TableStyles.concatStyles();
        History.TurnOn();
    };
    this.ReadFile = function (wb) {
        return this.ReadMainTable(wb);
    };
    this.ReadMainTable = function (wb) {
        var res = c_oSerConstants.ReadOk;
        res = this.stream.EnterFrame(1);
        if (c_oSerConstants.ReadOk != res) {
            return res;
        }
        var mtLen = this.stream.GetUChar();
        var aSeekTable = new Array();
        var nOtherTableOffset = null;
        var nSharedStringTableOffset = null;
        var nStyleTableOffset = null;
        var nWorkbookTableOffset = null;
        for (var i = 0; i < mtLen; ++i) {
            res = this.stream.EnterFrame(5);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
            var mtiType = this.stream.GetUChar();
            var mtiOffBits = this.stream.GetULongLE();
            if (c_oSerTableTypes.Other == mtiType) {
                nOtherTableOffset = mtiOffBits;
            } else {
                if (c_oSerTableTypes.SharedStrings == mtiType) {
                    nSharedStringTableOffset = mtiOffBits;
                } else {
                    if (c_oSerTableTypes.Styles == mtiType) {
                        nStyleTableOffset = mtiOffBits;
                    } else {
                        if (c_oSerTableTypes.Workbook == mtiType) {
                            nWorkbookTableOffset = mtiOffBits;
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
        var aSharedStrings = new Array();
        var aCellXfs = new Array();
        var aDxfs = new Array();
        var oMediaArray = new Object();
        wb.aWorksheets = new Array();
        if (null != nOtherTableOffset) {
            res = this.stream.Seek(nOtherTableOffset);
            if (c_oSerConstants.ReadOk == res) {
                res = (new Binary_OtherTableReader(this.stream, oMediaArray, this.sUrlPath, wb)).Read();
            }
        }
        if (null != nSharedStringTableOffset) {
            res = this.stream.Seek(nSharedStringTableOffset);
            if (c_oSerConstants.ReadOk == res) {
                res = (new Binary_SharedStringTableReader(this.stream, wb, aSharedStrings)).Read();
            }
        }
        if (null != nStyleTableOffset) {
            res = this.stream.Seek(nStyleTableOffset);
            if (c_oSerConstants.ReadOk == res) {
                res = (new Binary_StylesTableReader(this.stream, wb, aCellXfs, aDxfs)).Read();
            }
        }
        if (c_oSerConstants.ReadOk == res) {
            for (var i = 0; i < aSeekTable.length; ++i) {
                var seek = aSeekTable[i];
                var mtiType = seek.type;
                var mtiOffBits = seek.offset;
                res = this.stream.Seek(mtiOffBits);
                if (c_oSerConstants.ReadOk != res) {
                    break;
                }
                switch (mtiType) {
                case c_oSerTableTypes.Worksheets:
                    res = (new Binary_WorksheetTableReader(this.stream, wb, aSharedStrings, aCellXfs, aDxfs, oMediaArray)).Read();
                    break;
                case c_oSerTableTypes.CalcChain:
                    res = (new Binary_CalcChainTableReader(this.stream, wb.calcChain)).Read();
                    break;
                }
                if (c_oSerConstants.ReadOk != res) {
                    break;
                }
            }
        }
        if (null != nWorkbookTableOffset) {
            res = this.stream.Seek(nWorkbookTableOffset);
            if (c_oSerConstants.ReadOk == res) {
                res = (new Binary_WorkbookTableReader(this.stream, wb)).Read();
            }
        }
        wb.init();
        return res;
    };
}
function CTableStyles() {
    this.DefaultTableStyle = "TableStyleMedium2";
    this.DefaultPivotStyle = "PivotStyleLight16";
    this.CustomStyles = new Object();
    this.DefaultStyles = new Object();
    this.AllStyles = new Object();
}
CTableStyles.prototype = {
    concatStyles: function () {
        for (var i in this.DefaultStyles) {
            this.AllStyles[i] = this.DefaultStyles[i];
        }
        for (var i in this.CustomStyles) {
            this.AllStyles[i] = this.CustomStyles[i];
        }
    }
};
function CTableStyle() {
    this.name = null;
    this.pivot = true;
    this.table = true;
    this.displayName = null;
    this.compiled = null;
    this.blankRow = null;
    this.firstColumn = null;
    this.firstColumnStripe = null;
    this.firstColumnSubheading = null;
    this.firstHeaderCell = null;
    this.firstRowStripe = null;
    this.firstRowSubheading = null;
    this.firstSubtotalColumn = null;
    this.firstSubtotalRow = null;
    this.firstTotalCell = null;
    this.headerRow = null;
    this.lastColumn = null;
    this.lastHeaderCell = null;
    this.lastTotalCell = null;
    this.pageFieldLabels = null;
    this.pageFieldValues = null;
    this.secondColumnStripe = null;
    this.secondColumnSubheading = null;
    this.secondRowStripe = null;
    this.secondRowSubheading = null;
    this.secondSubtotalColumn = null;
    this.secondSubtotalRow = null;
    this.thirdColumnSubheading = null;
    this.thirdRowSubheading = null;
    this.thirdSubtotalColumn = null;
    this.thirdSubtotalRow = null;
    this.totalRow = null;
    this.wholeTable = null;
}
CTableStyle.prototype = {
    getStyle: function (bbox, rowIndex, colIndex, options, headerRowCount, totalsRowCount) {
        var res = null;
        if (null == this.compiled) {
            this._compile();
        }
        var styles = this._getOption(options, headerRowCount, totalsRowCount);
        if (headerRowCount > 0 && rowIndex == bbox.r1) {
            if (colIndex == bbox.c1) {
                res = styles.headerLeftTop;
            } else {
                if (colIndex == bbox.c2) {
                    res = styles.headerRightTop;
                } else {
                    res = styles.header;
                }
            }
        } else {
            if (totalsRowCount > 0 && rowIndex == bbox.r2) {
                if (colIndex == bbox.c1) {
                    res = styles.totalLeftBottom;
                } else {
                    if (colIndex == bbox.c2) {
                        res = styles.totalRightBottom;
                    } else {
                        res = styles.total;
                    }
                }
            } else {
                if (options.ShowFirstColumn && colIndex == bbox.c1) {
                    if (rowIndex == bbox.r1 + headerRowCount) {
                        res = styles.leftTopFC;
                    } else {
                        if (rowIndex == bbox.r2 - totalsRowCount) {
                            if (0 == (rowIndex - headerRowCount) % 2) {
                                res = styles.leftBottomRowBand1FC;
                            } else {
                                res = styles.leftBottomRowBand2FC;
                            }
                        } else {
                            if (0 == (rowIndex - headerRowCount) % 2) {
                                res = styles.leftRowBand1FC;
                            } else {
                                res = styles.leftRowBand2FC;
                            }
                        }
                    }
                } else {
                    if (options.ShowLastColumn && colIndex == bbox.c2) {
                        if (rowIndex == bbox.r1 + headerRowCount) {
                            if (0 == colIndex % 2) {
                                res = styles.rightTopColBand1LC;
                            } else {
                                res = styles.rightTopColBand2LC;
                            }
                        } else {
                            if (rowIndex == bbox.r2 - totalsRowCount) {
                                if (0 == (rowIndex - headerRowCount) % 2) {
                                    if (0 == colIndex % 2) {
                                        res = styles.rightRowBand1ColBand1LC;
                                    } else {
                                        res = styles.rightRowBand1ColBand2LC;
                                    }
                                } else {
                                    if (0 == colIndex % 2) {
                                        res = styles.rightRowBand2ColBand1LC;
                                    } else {
                                        res = styles.rightRowBand2ColBand2LC;
                                    }
                                }
                            } else {
                                if (0 == (rowIndex - headerRowCount) % 2) {
                                    if (0 == colIndex % 2) {
                                        res = styles.rightBottomRowBand1ColBand1LC;
                                    } else {
                                        res = styles.rightBottomRowBand1ColBand2LC;
                                    }
                                } else {
                                    if (0 == colIndex % 2) {
                                        res = styles.rightBottomRowBand2ColBand1LC;
                                    } else {
                                        res = styles.rightBottomRowBand2ColBand2LC;
                                    }
                                }
                            }
                        }
                    } else {
                        if (options.ShowRowStripes || options.ShowColumnStripes) {
                            if (rowIndex == bbox.r1 + headerRowCount) {
                                if (colIndex == bbox.c1) {
                                    res = styles.leftTop;
                                } else {
                                    if (colIndex == bbox.c2) {
                                        if (0 == colIndex % 2) {
                                            res = styles.rightTopColBand1;
                                        } else {
                                            res = styles.rightTopColBand2;
                                        }
                                    } else {
                                        if (0 == colIndex % 2) {
                                            res = styles.topColBand1;
                                        } else {
                                            res = styles.topColBand2;
                                        }
                                    }
                                }
                            } else {
                                if (rowIndex == bbox.r2 - totalsRowCount) {
                                    if (colIndex == bbox.c1) {
                                        if (0 == (rowIndex - headerRowCount) % 2) {
                                            res = styles.leftBottomRowBand1;
                                        } else {
                                            res = styles.leftBottomRowBand2;
                                        }
                                    } else {
                                        if (colIndex == bbox.c2) {
                                            if (0 == (rowIndex - headerRowCount) % 2) {
                                                if (0 == colIndex % 2) {
                                                    res = styles.rightBottomRowBand1ColBand1;
                                                } else {
                                                    res = styles.rightBottomRowBand1ColBand2;
                                                }
                                            } else {
                                                if (0 == colIndex % 2) {
                                                    res = styles.rightBottomRowBand2ColBand1;
                                                } else {
                                                    res = styles.rightBottomRowBand2ColBand2;
                                                }
                                            }
                                        } else {
                                            if (0 == (rowIndex - headerRowCount) % 2) {
                                                if (0 == colIndex % 2) {
                                                    res = styles.bottomRowBand1ColBand1;
                                                } else {
                                                    res = styles.bottomRowBand1ColBand2;
                                                }
                                            } else {
                                                if (0 == colIndex % 2) {
                                                    res = styles.bottomRowBand2ColBand1;
                                                } else {
                                                    res = styles.bottomRowBand2ColBand2;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (colIndex == bbox.c1) {
                                        if (0 == (rowIndex - headerRowCount) % 2) {
                                            res = styles.leftRowBand1;
                                        } else {
                                            res = styles.leftRowBand2;
                                        }
                                    } else {
                                        if (colIndex == bbox.c2) {
                                            if (0 == (rowIndex - headerRowCount) % 2) {
                                                if (0 == colIndex % 2) {
                                                    res = styles.rightRowBand1ColBand1;
                                                } else {
                                                    res = styles.rightRowBand1ColBand2;
                                                }
                                            } else {
                                                if (0 == colIndex % 2) {
                                                    res = styles.rightRowBand2ColBand1;
                                                } else {
                                                    res = styles.rightRowBand2ColBand2;
                                                }
                                            }
                                        } else {
                                            if (0 == (rowIndex - headerRowCount) % 2) {
                                                if (0 == colIndex % 2) {
                                                    res = styles.innerRowBand1ColBand1;
                                                } else {
                                                    res = styles.innerRowBand1ColBand2;
                                                }
                                            } else {
                                                if (0 == colIndex % 2) {
                                                    res = styles.innerRowBand2ColBand1;
                                                } else {
                                                    res = styles.innerRowBand2ColBand2;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (rowIndex == bbox.r1 + headerRowCount) {
                                if (colIndex == bbox.c1) {
                                    res = styles.leftTop;
                                } else {
                                    if (colIndex == bbox.c2) {
                                        res = styles.rightTopColBand1;
                                    } else {
                                        res = styles.topColBand1;
                                    }
                                }
                            } else {
                                if (rowIndex == bbox.r2 - totalsRowCount) {
                                    if (colIndex == bbox.c1) {
                                        res = styles.leftBottomRowBand1;
                                    } else {
                                        if (colIndex == bbox.c2) {
                                            res = styles.rightBottomRowBand1ColBand1;
                                        } else {
                                            res = styles.bottomRowBand1ColBand1;
                                        }
                                    }
                                } else {
                                    if (colIndex == bbox.c1) {
                                        res = styles.leftRowBand1;
                                    } else {
                                        if (colIndex == bbox.c2) {
                                            res = styles.rightRowBand1ColBand1;
                                        } else {
                                            res = styles.innerRowBand1ColBand1;
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
    },
    _getOption: function (options, headerRowCount, totalsRowCount) {
        var nBitMask = 0;
        if (options.ShowFirstColumn) {
            nBitMask += 1;
        }
        if (options.ShowLastColumn) {
            nBitMask += 1 << 1;
        }
        if (options.ShowRowStripes) {
            nBitMask += 1 << 2;
        }
        if (options.ShowColumnStripes) {
            nBitMask += 1 << 3;
        }
        if (headerRowCount > 0) {
            nBitMask += 1 << 4;
        }
        if (totalsRowCount > 0) {
            nBitMask += 1 << 5;
        }
        var styles = this.compiled.options[nBitMask];
        if (null == styles) {
            var configs = {
                header: {
                    header: true,
                    top: true
                },
                headerLeftTop: {
                    header: true,
                    left: true,
                    top: true
                },
                headerRightTop: {
                    header: true,
                    right: true,
                    top: true
                },
                total: {
                    total: true,
                    bottom: true
                },
                totalLeftBottom: {
                    total: true,
                    left: true,
                    bottom: true
                },
                totalRightBottom: {
                    total: true,
                    right: true,
                    bottom: true
                },
                leftTop: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    top: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftBottomRowBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftBottomRowBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand1: true
                },
                leftRowBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftRowBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightTopColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    top: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightTopColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    top: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightRowBand1ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightRowBand1ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightRowBand2ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightRowBand2ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand2: true,
                    ColBand2: true
                },
                rightBottomRowBand1ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightBottomRowBand1ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightBottomRowBand2ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightBottomRowBand2ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand2: true
                },
                topColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    top: true,
                    RowBand1: true,
                    ColBand1: true
                },
                topColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    top: true,
                    RowBand1: true,
                    ColBand2: true
                },
                bottomRowBand1ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand1: true
                },
                bottomRowBand1ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand2: true
                },
                bottomRowBand2ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand1: true
                },
                bottomRowBand2ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand2: true
                },
                innerRowBand1ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    RowBand1: true,
                    ColBand1: true
                },
                innerRowBand1ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    RowBand1: true,
                    ColBand2: true
                },
                innerRowBand2ColBand1: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    RowBand2: true,
                    ColBand1: true
                },
                innerRowBand2ColBand2: {
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    RowBand2: true,
                    ColBand2: true
                },
                leftTopFC: {
                    ShowFirstColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    top: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftBottomRowBand1FC: {
                    ShowFirstColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftBottomRowBand2FC: {
                    ShowFirstColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand1: true
                },
                leftRowBand1FC: {
                    ShowFirstColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    RowBand1: true,
                    ColBand1: true
                },
                leftRowBand2FC: {
                    ShowFirstColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    left: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightTopColBand1LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    top: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightTopColBand2LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    top: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightRowBand1ColBand1LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightRowBand1ColBand2LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightRowBand2ColBand1LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightRowBand2ColBand2LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    RowBand2: true,
                    ColBand2: true
                },
                rightBottomRowBand1ColBand1LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand1: true
                },
                rightBottomRowBand1ColBand2LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand1: true,
                    ColBand2: true
                },
                rightBottomRowBand2ColBand1LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand1: true
                },
                rightBottomRowBand2ColBand2LC: {
                    ShowLastColumn: true,
                    ShowRowStripes: true,
                    ShowColumnStripes: true,
                    right: true,
                    bottom: true,
                    RowBand2: true,
                    ColBand2: true
                }
            };
            var styles = new Object();
            for (var i in configs) {
                styles[i] = new CellXfs();
            }
            this._compileOption(options, headerRowCount, totalsRowCount, styles, configs);
            this.compiled.options[nBitMask] = styles;
        }
        return styles;
    },
    _compileSetBorder: function (inputDxf, outputDxf, bLeft, bTop, bRight, bBottom, bInnerHor, bInnerVer) {
        if (null != inputDxf && null != inputDxf.border) {
            var oCurBorder = inputDxf.border;
            var oNewBorder = new Border();
            if (bLeft) {
                oNewBorder.l = oCurBorder.l;
            } else {
                if (bInnerVer) {
                    oNewBorder.l = oCurBorder.iv;
                }
            }
            if (bTop) {
                oNewBorder.t = oCurBorder.t;
            } else {
                if (bInnerHor) {
                    oNewBorder.t = oCurBorder.ih;
                }
            }
            if (bRight) {
                oNewBorder.r = oCurBorder.r;
            } else {
                if (bInnerVer) {
                    oNewBorder.r = oCurBorder.iv;
                }
            }
            if (bBottom) {
                oNewBorder.b = oCurBorder.b;
            } else {
                if (bInnerHor) {
                    oNewBorder.b = oCurBorder.ih;
                }
            }
            if (null == outputDxf.border) {
                outputDxf.border = oNewBorder;
            } else {
                outputDxf.border = outputDxf.border.merge(oNewBorder);
            }
        }
    },
    _compileSetHeaderBorder: function (inputDxf, outputDxf, bHeader) {
        if (null != inputDxf && null != inputDxf.border) {
            var oCurBorder = inputDxf.border;
            var oNewBorder = new Border();
            if (bHeader) {
                oNewBorder.t = oCurBorder.b;
            } else {
                oNewBorder.b = oCurBorder.t;
            }
            if (null == outputDxf.border) {
                outputDxf.border = oNewBorder;
            } else {
                outputDxf.border = outputDxf.border.merge(oNewBorder);
            }
        }
    },
    _compileOption: function (options, headerRowCount, totalsRowCount, styles, configs) {
        for (var i in styles) {
            var xfs = styles[i];
            var config = configs[i];
            if (headerRowCount > 0 && config.top && true != config.header) {
                if (options.ShowFirstColumn && null != this.firstHeaderCell && config.left) {
                    this._compileSetHeaderBorder(this.firstHeaderCell.dxf, xfs, true);
                } else {
                    if (options.ShowLastColumn && null != this.lastHeaderCell && config.right) {
                        this._compileSetHeaderBorder(this.lastHeaderCell.dxf, xfs, true);
                    }
                }
                if (null != this.headerRow) {
                    this._compileSetHeaderBorder(this.headerRow.dxf, xfs, true);
                }
            }
            if (totalsRowCount > 0 && config.bottom && true != config.total) {
                if (options.ShowFirstColumn && null != this.firstTotalCell && config.left) {
                    this._compileSetHeaderBorder(this.firstTotalCell.dxf, xfs, false);
                } else {
                    if (options.ShowLastColumn && null != this.lastTotalCell && config.right) {
                        this._compileSetHeaderBorder(this.lastTotalCell.dxf, xfs, false);
                    }
                }
                if (null != this.totalRow) {
                    this._compileSetHeaderBorder(this.totalRow.dxf, xfs, false);
                }
            }
            if (headerRowCount > 0 && config.header) {
                if (options.ShowFirstColumn && null != this.firstHeaderCell && config.left) {
                    xfs = xfs.merge(this.firstHeaderCell.dxf);
                }
                if (options.ShowLastColumn && null != this.lastHeaderCell && config.right) {
                    xfs = xfs.merge(this.lastHeaderCell.dxf);
                }
                if (null != this.headerRow) {
                    xfs = xfs.merge(this.compiled.headerRow.dxf);
                    if (config.left) {
                        this._compileSetBorder(this.headerRow.dxf, xfs, true, true, false, true, false, true);
                    } else {
                        if (config.right) {
                            this._compileSetBorder(this.headerRow.dxf, xfs, false, true, true, true, false, true);
                        } else {
                            this._compileSetBorder(this.headerRow.dxf, xfs, false, true, false, true, false, true);
                        }
                    }
                }
                if (options.ShowFirstColumn && null != this.firstColumn && config.left) {
                    xfs = xfs.merge(this.compiled.firstColumn.dxf);
                    this._compileSetBorder(this.firstColumn.dxf, xfs, true, true, true, false, true, false);
                }
                if (options.ShowLastColumn && null != this.lastColumn && config.right) {
                    xfs = xfs.merge(this.compiled.lastColumn.dxf);
                    this._compileSetBorder(this.lastColumn.dxf, xfs, true, true, true, false, true, false);
                }
            } else {
                if (totalsRowCount > 0 && config.total) {
                    if (options.ShowFirstColumn && null != this.firstTotalCell && config.left) {
                        xfs = xfs.merge(this.firstTotalCell.dxf);
                    }
                    if (options.ShowLastColumn && null != this.lastTotalCell && config.right) {
                        xfs = xfs.merge(this.lastTotalCell.dxf);
                    }
                    if (null != this.totalRow) {
                        xfs = xfs.merge(this.compiled.totalRow.dxf);
                        if (config.left) {
                            this._compileSetBorder(this.totalRow.dxf, xfs, true, true, false, true, false, true);
                        } else {
                            if (config.right) {
                                this._compileSetBorder(this.totalRow.dxf, xfs, false, true, true, true, false, true);
                            } else {
                                this._compileSetBorder(this.totalRow.dxf, xfs, false, true, false, true, false, true);
                            }
                        }
                    }
                    if (options.ShowFirstColumn && null != this.firstColumn && config.left) {
                        xfs = xfs.merge(this.compiled.firstColumn.dxf);
                        this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, true, true, false);
                    }
                    if (options.ShowLastColumn && null != this.lastColumn && config.right) {
                        xfs = xfs.merge(this.compiled.lastColumn.dxf);
                        this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, true, true, false);
                    }
                } else {
                    if (options.ShowFirstColumn && null != this.firstColumn && config.ShowFirstColumn) {
                        xfs = xfs.merge(this.compiled.firstColumn.dxf);
                        if (config.left && config.top) {
                            if (headerRowCount > 0) {
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                            } else {
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, true, true, false, true, false);
                            }
                        } else {
                            if (config.left && config.bottom) {
                                if (totalsRowCount > 0) {
                                    this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                                } else {
                                    this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, true, true, false);
                                }
                            } else {
                                this._compileSetBorder(this.firstColumn.dxf, xfs, true, false, true, false, true, false);
                            }
                        }
                    } else {
                        if (options.ShowLastColumn && null != this.lastColumn && config.ShowLastColumn) {
                            xfs = xfs.merge(this.compiled.lastColumn.dxf);
                            if (config.right && config.top) {
                                if (headerRowCount > 0) {
                                    this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                                } else {
                                    this._compileSetBorder(this.lastColumn.dxf, xfs, true, true, true, false, true, false);
                                }
                            } else {
                                if (config.right && config.bottom) {
                                    if (totalsRowCount > 0) {
                                        this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                                    } else {
                                        this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, true, true, false);
                                    }
                                } else {
                                    this._compileSetBorder(this.lastColumn.dxf, xfs, true, false, true, false, true, false);
                                }
                            }
                        }
                    }
                    if (options.ShowRowStripes && config.ShowRowStripes) {
                        if (null != this.firstRowStripe && config.RowBand1) {
                            xfs = xfs.merge(this.compiled.firstRowStripe.dxf);
                            if (config.left) {
                                this._compileSetBorder(this.firstRowStripe.dxf, xfs, true, true, false, true, false, true);
                            } else {
                                if (config.right) {
                                    this._compileSetBorder(this.firstRowStripe.dxf, xfs, false, true, true, true, false, true);
                                } else {
                                    this._compileSetBorder(this.firstRowStripe.dxf, xfs, false, true, false, true, false, true);
                                }
                            }
                        } else {
                            if (null != this.secondRowStripe && config.RowBand2) {
                                xfs = xfs.merge(this.compiled.secondRowStripe.dxf);
                                if (config.left) {
                                    this._compileSetBorder(this.secondRowStripe.dxf, xfs, true, true, false, true, false, true);
                                } else {
                                    if (config.right) {
                                        this._compileSetBorder(this.secondRowStripe.dxf, xfs, false, true, true, true, false, true);
                                    } else {
                                        this._compileSetBorder(this.secondRowStripe.dxf, xfs, false, true, false, true, false, true);
                                    }
                                }
                            }
                        }
                    }
                    if (options.ShowColumnStripes && config.ShowRowStripes) {
                        if (null != this.firstColumnStripe && config.ColBand1) {
                            xfs = xfs.merge(this.compiled.firstColumnStripe.dxf);
                            if (config.top) {
                                this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, true, true, false, true, false);
                            } else {
                                if (config.bottom) {
                                    this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, false, true, true, true, false);
                                } else {
                                    this._compileSetBorder(this.firstColumnStripe.dxf, xfs, true, false, true, false, true, false);
                                }
                            }
                        } else {
                            if (null != this.secondColumnStripe && config.ColBand2) {
                                xfs = xfs.merge(this.compiled.secondColumnStripe.dxf);
                                if (config.top) {
                                    this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, true, true, false, true, false);
                                } else {
                                    if (config.bottom) {
                                        this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, false, true, true, true, false);
                                    } else {
                                        this._compileSetBorder(this.secondColumnStripe.dxf, xfs, true, false, true, false, true, false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (null != this.wholeTable) {
                xfs = xfs.merge(this.compiled.wholeTable.dxf);
                if (config.top) {
                    if (headerRowCount > 0 && true != config.header) {
                        if (config.left) {
                            this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                        } else {
                            if (config.right) {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                            } else {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                            }
                        }
                    } else {
                        if (config.left) {
                            this._compileSetBorder(this.wholeTable.dxf, xfs, true, true, false, false, true, true);
                        } else {
                            if (config.right) {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, true, true, false, true, true);
                            } else {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, true, false, false, true, true);
                            }
                        }
                    }
                } else {
                    if (config.bottom) {
                        if (totalsRowCount > 0 && true != config.total) {
                            if (config.left) {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                            } else {
                                if (config.right) {
                                    this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                                } else {
                                    this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                                }
                            }
                        } else {
                            if (config.left) {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, true, true, true);
                            } else {
                                if (config.right) {
                                    this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, true, true, true);
                                } else {
                                    this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, true, true, true);
                                }
                            }
                        }
                    } else {
                        if (config.left) {
                            this._compileSetBorder(this.wholeTable.dxf, xfs, true, false, false, false, true, true);
                        } else {
                            if (config.right) {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, true, false, true, true);
                            } else {
                                this._compileSetBorder(this.wholeTable.dxf, xfs, false, false, false, false, true, true);
                            }
                        }
                    }
                }
            }
            styles[i] = xfs;
        }
    },
    _compile: function () {
        this.compiled = {
            options: new Object(),
            blankRow: null,
            firstColumn: null,
            firstColumnStripe: null,
            firstColumnSubheading: null,
            firstHeaderCell: null,
            firstRowStripe: null,
            firstRowSubheading: null,
            firstSubtotalColumn: null,
            firstSubtotalRow: null,
            firstTotalCell: null,
            headerRow: null,
            lastColumn: null,
            lastHeaderCell: null,
            lastTotalCell: null,
            pageFieldLabels: null,
            pageFieldValues: null,
            secondColumnStripe: null,
            secondColumnSubheading: null,
            secondRowStripe: null,
            secondRowSubheading: null,
            secondSubtotalColumn: null,
            secondSubtotalRow: null,
            thirdColumnSubheading: null,
            thirdRowSubheading: null,
            thirdSubtotalColumn: null,
            thirdSubtotalRow: null,
            totalRow: null,
            wholeTable: null
        };
        for (var i in this) {
            var elem = this[i];
            if (null != elem && elem instanceof CTableStyleElement) {
                var oNewElem = new CTableStyleElement();
                oNewElem.size = elem.size;
                oNewElem.dxf = elem.dxf.clone();
                oNewElem.dxf.border = null;
                this.compiled[i] = oNewElem;
            }
        }
    }
};
function CTableStyleElement() {
    this.size = 1;
    this.dxf = null;
}
function ReadDefTableStyles(wb, oOutput) {
    var Types = {
        Style: 0,
        Dxf: 1,
        tableStyles: 2
    };
    var sStyles = "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";
    var dstLen = sStyles.length;
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var bcr = new Binary_CommonReader(stream);
    var oBinaryFileReader = new BinaryFileReader("");
    oBinaryFileReader.getbase64DecodedData2(sStyles, 0, stream, 0);
    var oBinary_StylesTableReader = new Binary_StylesTableReader(stream, wb, [], []);
    var fReadStyle = function (type, length, oTableStyles, oOutputName) {
        var res = c_oSerConstants.ReadOk;
        if (Types.Dxf == type) {
            oOutputName.dxfs.push(null);
            res = bcr.Read1(length, function (t, l) {
                return oBinary_StylesTableReader.ReadDxfs(t, l, oOutputName.dxfs);
            });
        } else {
            if (Types.tableStyles == type) {
                res = bcr.Read1(length, function (t, l) {
                    return oBinary_StylesTableReader.ReadTableStyles(t, l, oTableStyles, oOutputName.customStyle);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    var fReadStyles = function (type, length, oOutput) {
        var res = c_oSerConstants.ReadOk;
        if (Types.Style == type) {
            var oTableStyles = new CTableStyles();
            var oOutputName = {
                customStyle: {},
                dxfs: []
            };
            res = bcr.Read1(length, function (t, l) {
                return fReadStyle(t, l, oTableStyles, oOutputName);
            });
            for (var i in oOutputName.customStyle) {
                var customStyle = oOutputName.customStyle[i];
                var oNewStyle = customStyle.style;
                oBinary_StylesTableReader.initTableStyle(oNewStyle, customStyle.elements, oOutputName.dxfs);
                oOutput[oNewStyle.name] = oNewStyle;
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    var length = stream.GetULongLE();
    var res = bcr.Read1(length, function (t, l) {
        return fReadStyles(t, l, oOutput);
    });
}
function ReadDefCellStyles(wb, oOutput) {
    var Types = {
        Style: 0,
        BuiltinId: 1,
        Hidden: 2,
        CellStyle: 3,
        Xfs: 4,
        Font: 5,
        Fill: 6,
        Border: 7,
        NumFmts: 8
    };
    var sStyles = "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JkAGFwAAAAASAAAAAQ0AAAACAQkDBc1kZjIzmdk/BxkAAAAAAAAAAAEAAAAAAgAAAAAEAAAAAAUAAAAAAK8AAAABBAAAAB0AAAADHAAAAAQOAAAAQQBjAGMAZQBuAHQAMQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABg0AAAAACAAAAAEDAAAAAgEEBxkAAAAAAAAAAAEAAAAAAgAAAAAEAAAAAAUAAAAAAK8AAAABBAAAACEAAAADHAAAAAQOAAAAQQBjAGMAZQBuAHQAMgAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABg0AAAAACAAAAAEDAAAAAgEFBxkAAAAAAAAAAAEAAAAAAgAAAAAEAAAAAAUAAAAAAKYAAAADHAAAAAQOAAAAQQBjAGMAZQBuAHQAMwAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABg0AAAAACAAAAAEDAAAAAgEGBxkAAAAAAAAAAAEAAAAAAgAAAAAEAAAAAAUAAAAAAK8AAAABBAAAACkAAAADHAAAAAQOAAAAQQBjAGMAZQBuAHQANAAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAAACZABg0AAAAACAAAAAEDAAAAAgEHBxkAAAAAAAAAAAEAAAAAAgAAAAAEAAAAAAUAAAAAAK8AAAABBAAAAC0AAAADHAAAAAQOAAAAQQBjAGMAZQBuAHQANQAFBAAAAAEAAAAEIQAAAAABAAEBAAQBAAYEAAAAAAcEAgAAAAgEAQAAAAkEAAAAAAUqAAAAAQYDAAAAAgEABAYOAAAAQwBhAGwAaQBiAHIAaQAJAQEGBQAAAAAA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";
    var dstLen = sStyles.length;
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var bcr = new Binary_CommonReader(stream);
    var oBinaryFileReader = new BinaryFileReader("");
    oBinaryFileReader.getbase64DecodedData2(sStyles, 0, stream, 0);
    var oBinary_StylesTableReader = new Binary_StylesTableReader(stream, wb, [], []);
    var length = stream.GetULongLE();
    var fReadStyle = function (type, length, oCellStyle, oStyleObject) {
        var res = c_oSerConstants.ReadOk;
        if (Types.BuiltinId === type) {
            oCellStyle.BuiltinId = stream.GetULongLE();
        } else {
            if (Types.Hidden === type) {
                oCellStyle.Hidden = stream.GetBool();
            } else {
                if (Types.CellStyle === type) {
                    res = bcr.Read1(length, function (t, l) {
                        return oBinary_StylesTableReader.ReadCellStyle(t, l, oCellStyle);
                    });
                } else {
                    if (Types.Xfs === type) {
                        oStyleObject.xfs = {
                            ApplyAlignment: null,
                            ApplyBorder: null,
                            ApplyFill: null,
                            ApplyFont: null,
                            ApplyNumberFormat: null,
                            BorderId: null,
                            FillId: null,
                            FontId: null,
                            NumFmtId: null,
                            QuotePrefix: null,
                            Aligment: null,
                            XfId: null
                        };
                        res = bcr.Read2Spreadsheet(length, function (t, l) {
                            return oBinary_StylesTableReader.ReadXfs(t, l, oStyleObject.xfs);
                        });
                    } else {
                        if (Types.Font === type) {
                            oStyleObject.font = new Font();
                            res = bcr.Read2Spreadsheet(length, function (t, l) {
                                return oBinary_StylesTableReader.bssr.ReadRPr(t, l, oStyleObject.font);
                            });
                            oBinary_StylesTableReader.bssr.CheckSchemeFont(oStyleObject.font);
                        } else {
                            if (Types.Fill === type) {
                                oStyleObject.fill = new Fill();
                                res = bcr.Read1(length, function (t, l) {
                                    return oBinary_StylesTableReader.ReadFill(t, l, oStyleObject.fill);
                                });
                            } else {
                                if (Types.Border === type) {
                                    oStyleObject.border = new Border();
                                    res = bcr.Read1(length, function (t, l) {
                                        return oBinary_StylesTableReader.ReadBorder(t, l, oStyleObject.border);
                                    });
                                } else {
                                    if (Types.NumFmts === type) {
                                        res = bcr.Read1(length, function (t, l) {
                                            return oBinary_StylesTableReader.ReadNumFmts(t, l, oStyleObject.oNumFmts);
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
    var fReadStyles = function (type, length, oOutput) {
        var res = c_oSerConstants.ReadOk;
        var oStyleObject = {
            font: null,
            fill: null,
            border: null,
            oNumFmts: [],
            xfs: null
        };
        if (Types.Style === type) {
            var oCellStyle = new CCellStyle();
            res = bcr.Read1(length, function (t, l) {
                return fReadStyle(t, l, oCellStyle, oStyleObject);
            });
            oCellStyle.xfs = new CellXfs();
            if (null !== oStyleObject.border) {
                oCellStyle.xfs.border = oStyleObject.border.clone();
            }
            if (null !== oStyleObject.fill) {
                oCellStyle.xfs.fill = oStyleObject.fill.clone();
            }
            if (null !== oStyleObject.font) {
                oCellStyle.xfs.font = oStyleObject.font.clone();
            }
            if (null !== oStyleObject.xfs.numid) {
                var oCurNum = oStyleObject.oNumFmts[oStyleObject.xfs.numid];
                if (null != oCurNum) {
                    oCellStyle.xfs.num = oBinary_StylesTableReader.ParseNum(oCurNum, oStyleObject.oNumFmts);
                } else {
                    oCellStyle.xfs.num = oBinary_StylesTableReader.ParseNum({
                        id: oStyleObject.xfs.numid,
                        f: null
                    },
                    oStyleObject.oNumFmts);
                }
            }
            if (null != oStyleObject.xfs.QuotePrefix) {
                oCellStyle.xfs.QuotePrefix = oStyleObject.xfs.QuotePrefix;
            }
            if (null != oStyleObject.xfs.align) {
                oCellStyle.xfs.align = oStyleObject.xfs.align.clone();
            }
            if (null !== oStyleObject.xfs.XfId) {
                oCellStyle.xfs.XfId = oStyleObject.xfs.XfId;
            }
            if (null !== oStyleObject.xfs.ApplyBorder) {
                oCellStyle.ApplyBorder = oStyleObject.xfs.ApplyBorder;
            }
            if (null !== oStyleObject.xfs.ApplyFill) {
                oCellStyle.ApplyFill = oStyleObject.xfs.ApplyFill;
            }
            if (null !== oStyleObject.xfs.ApplyFont) {
                oCellStyle.ApplyFont = oStyleObject.xfs.ApplyFont;
            }
            if (null !== oStyleObject.xfs.ApplyNumberFormat) {
                oCellStyle.ApplyNumberFormat = oStyleObject.xfs.ApplyNumberFormat;
            }
            oOutput.push(oCellStyle);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    var res = bcr.Read1(length, function (t, l) {
        return fReadStyles(t, l, oOutput);
    });
    if (0 === wb.CellStyles.CustomStyles.length && 0 < oOutput.length) {
        wb.CellStyles.CustomStyles.push(oOutput[0].clone());
        wb.CellStyles.CustomStyles[0].XfId = 0;
    }
    if (null == g_oDefaultXfId) {
        g_oDefaultXfId = 0;
    }
}