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
 var c_oAscError = {
    Level: {
        Critical: -1,
        NoCritical: 0
    },
    ID: {
        ServerSaveComplete: 3,
        ConvertationProgress: 2,
        DownloadProgress: 1,
        No: 0,
        Unknown: -1,
        ConvertationTimeout: -2,
        ConvertationError: -3,
        DownloadError: -4,
        UnexpectedGuid: -5,
        Database: -6,
        FileRequest: -7,
        FileVKey: -8,
        UplImageSize: -9,
        UplImageExt: -10,
        UplImageFileCount: -11,
        NoSupportClipdoard: -12,
        PastInMergeAreaError: -13,
        StockChartError: -14,
        DataRangeError: -15,
        CannotMoveRange: -16,
        UplImageUrl: -17,
        CoAuthoringDisconnect: -18,
        ConvertationPassword: -19,
        VKeyEncrypt: -20,
        KeyExpire: -21,
        UserCountExceed: -22,
        FrmlWrongCountParentheses: -30,
        FrmlWrongOperator: -31,
        FrmlWrongMaxArgument: -32,
        FrmlWrongCountArgument: -33,
        FrmlWrongFunctionName: -34,
        FrmlAnotherParsingError: -35,
        FrmlWrongArgumentRange: -36,
        FrmlOperandExpected: -37,
        AutoFilterDataRangeError: -38,
        AutoFilterChangeFormatTableError: -39,
        AutoFilterChangeError: -40
    }
};
var c_oAscConfirm = {
    ConfirmReplaceRange: 0
};
var c_oAscFileType = {
    INNER: 257,
    XLSX: 257,
    XLS: 258,
    ODS: 259,
    CSV: 260,
    HTML: 2051,
    PDFPRINT: 513,
    ZIP: 2051,
    XLSY: 4098
};
var c_oAscAsyncActionType = {
    Information: 0,
    BlockInteraction: 1
};
var c_oAscAsyncAction = {
    Open: 0,
    Save: 1,
    LoadDocumentFonts: 2,
    LoadDocumentImages: 3,
    LoadFont: 4,
    LoadImage: 5,
    DownloadAs: 6,
    Print: 7,
    UploadImage: 8,
    Recalc: 9,
    SlowOperation: 10,
    PrepareToSave: 11
};
var c_oAscAlignType = {
    NONE: "none",
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify",
    TOP: "top",
    MIDDLE: "center",
    BOTTOM: "bottom"
};
var c_oAscCsvDelimiter = {
    None: 0,
    Tab: 1,
    Semicolon: 2,
    Сolon: 3,
    Comma: 4,
    Space: 5
};
var c_oAscAdvancedOptionsID = {
    CSV: 0
};
var c_oAscAdvancedOptionsAction = {
    None: 0,
    Open: 1,
    Save: 2
};
var c_oAscMergeOptions = {
    Unmerge: 0,
    Merge: 1,
    MergeCenter: 2,
    MergeAcross: 3
};
var c_oAscSortOptions = {
    Ascending: 1,
    Descending: 2
};
var c_oAscInsertOptions = {
    InsertCellsAndShiftRight: 1,
    InsertCellsAndShiftDown: 2,
    InsertColumns: 3,
    InsertRows: 4
};
var c_oAscDeleteOptions = {
    DeleteCellsAndShiftLeft: 1,
    DeleteCellsAndShiftTop: 2,
    DeleteColumns: 3,
    DeleteRows: 4
};
var c_oAscFormatOptions = {
    General: "General",
    Number: "0.00",
    Currency: "$#,##0.00",
    Accounting: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
    DateShort: "m/d/yyyy",
    DateLong: "[$-F800]dddd, mmmm dd, yyyy",
    Time: "[$-F400]h:mm:ss AM/PM",
    Percentage: "0%",
    Fraction: "# ?/?",
    Scientific : "0.00E+00",
    Text : "@"
};
var c_oAscBorderOptions = {
    Top: 0,
    Right: 1,
    Bottom: 2,
    Left: 3,
    DiagD: 4,
    DiagU: 5,
    InnerV: 6,
    InnerH: 7
};
var c_oAscBorderWidth = {
    None: 0,
    Thin: 1,
    Medium: 2,
    Thick: 3
};
var c_oAscBorderStyles = {
    None: 0,
    Double: 1,
    Hair: 2,
    DashDotDot: 3,
    DashDot: 4,
    Dotted: 5,
    Dashed: 6,
    Thin: 7,
    MediumDashDotDot: 8,
    SlantDashDot: 9,
    MediumDashDot: 10,
    MediumDashed: 11,
    Medium: 12,
    Thick: 13
};
var c_oAscCleanOptions = {
    All: 0,
    Text: 1,
    Format: 2,
    Formula: 4
};
var c_oAscDrawDepOptions = {
    Master: 0,
    Slave: 1,
    Clear: 2
};
var c_oAscSelectionType = {
    RangeCells: 1,
    RangeCol: 2,
    RangeRow: 3,
    RangeMax: 4,
    RangeImage: 5,
    RangeChart: 6,
    RangeShape: 7,
    RangeShapeText: 8
};
var c_oAscGraphicOption = {
    ScrollVertical: 1,
    ScrollHorizontal: 2,
    AddText: 3
};
var c_oAscLegendMarkerType = {
    Line: 0,
    Square: 1
};
var c_oAscHyperlinkType = {
    WebLink: 1,
    RangeLink: 2
};
var c_oAscMouseMoveType = {
    None: 0,
    Hyperlink: 1,
    Comment: 2,
    LockedObject: 3
};
var c_oAscMouseMoveLockedObjectType = {
    None: -1,
    Range: 0,
    TableProperties: 1,
    Sheet: 2
};
var c_oAscColor = {
    COLOR_TYPE_SRGB: 1,
    COLOR_TYPE_PRST: 2,
    COLOR_TYPE_SCHEME: 3
};
var c_oAscPageOrientation = {
    PagePortrait: 1,
    PageLandscape: 2
};
var c_oAscPrintDefaultSettings = {
    PageWidth: 210,
    PageHeight: 297,
    PageOrientation: c_oAscPageOrientation.PagePortrait,
    PageLeftField: 17.8,
    PageRightField: 17.8,
    PageTopField: 19.1,
    PageBottomField: 19.1,
    PageGridLines: 0,
    PageHeadings: 0
};
var c_oAscLockTypes = {
    kLockTypeNone: 1,
    kLockTypeMine: 2,
    kLockTypeOther: 3,
    kLockTypeOther2: 4,
    kLockTypeOther3: 5
};
var c_oAscLockTypeElem = {
    Range: 1,
    Object: 2,
    Sheet: 3
};
var c_oAscLockTypeElemSubType = {
    DeleteColumns: 1,
    InsertColumns: 2,
    DeleteRows: 3,
    InsertRows: 4,
    ChangeProperties: 5
};
var c_oAscRecalcIndexTypes = {
    RecalcIndexAdd: 1,
    RecalcIndexRemove: 2
};
var c_oAscPrintType = {
    ActiveSheets: 0,
    EntireWorkbook: 1,
    Selection: 2
};
var c_oAscLayoutPageType = {
    FitToWidth: 0,
    ActualSize: 1
};
var c_oAscCustomAutoFilter = {
    equals: 1,
    doesNotEqual: 6,
    isGreaterThan: 2,
    isGreaterThanOrEqualTo: 3,
    isLessThan: 4,
    isLessThanOrEqualTo: 5,
    beginsWith: 7,
    doesNotBeginWith: 8,
    endsWith: 9,
    doesNotEndWith: 10,
    contains: 11,
    doesNotContain: 12
};
var c_oAscCellEditorState = {
    editEnd: 0,
    editStart: 1,
    editEmptyCell: 2,
    editText: 3,
    editFormula: 4
};
var c_oAscCanChangeColWidth = {
    none: 0,
    numbers: 1,
    all: 2
};
var c_oAscFontRenderingModeType = {
    noHinting: 1,
    hinting: 2,
    hintingAndSubpixeling: 3
};
var c_oAscStyleImage = {
    Default: 0,
    Document: 1
};
var c_oAscFill = {
    FILL_TYPE_BLIP: 1,
    FILL_TYPE_NOFILL: 2,
    FILL_TYPE_SOLID: 3,
    FILL_TYPE_PATT: 4,
    FILL_TYPE_GRAD: 5
};
var c_oAscFillBlipType = {
    STRETCH: 1,
    TILE: 2
};
var c_oAscStrokeType = {
    STROKE_NONE: 0,
    STROKE_COLOR: 1
};
var c_oAscLineJoinType = {
    Round: 1,
    Bevel: 2,
    Miter: 3
};
var c_oAscLineCapType = {
    Flat: 0,
    Round: 1,
    Square: 2
};
var c_oAscLineBeginType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};
var c_oAscTypeSelectElement = {
    Paragraph: 0,
    Table: 1,
    Image: 2,
    Header: 3,
    Hyperlink: 4,
    SpellCheck: 5,
    Shape: 6,
    Slide: 7,
    Chart: 8
};
var c_oAscLineBeginSize = {
    small_small: 0,
    small_mid: 1,
    small_large: 2,
    mid_small: 3,
    mid_mid: 4,
    mid_large: 5,
    large_small: 6,
    large_mid: 7,
    large_large: 8
};
var c_oAscFillGradType = {
    GRAD_LINEAR: 1,
    GRAD_PATH: 2
};
var c_oAscVerticalTextAlign = {
    TEXT_ALIGN_BOTTOM: 0,
    TEXT_ALIGN_CTR: 1,
    TEXT_ALIGN_DIST: 2,
    TEXT_ALIGN_JUST: 3,
    TEXT_ALIGN_TOP: 4
};
var c_oAscChartType = {
    line: "Line",
    bar: "Bar",
    hbar: "HBar",
    area: "Area",
    pie: "Pie",
    scatter: "Scatter",
    stock: "Stock"
};
var c_oAscChartSubType = {
    normal: "normal",
    stacked: "stacked",
    stackedPer: "stackedPer"
};
var c_oAscChartStyle = {
    Dark: 1,
    Standart: 2,
    Accent1: 3,
    Accent2: 4,
    Accent3: 5,
    Accent4: 6,
    Accent5: 7,
    Accent6: 8
};
var c_oAscCoAuthoringMeBorderColor = "rgba(22,156,0,1)";
var c_oAscCoAuthoringOtherBorderColor = "rgba(238,53,37,1)";
var c_oAscCoAuthoringLockTablePropertiesBorderColor = "rgba(255,144,0,1)";
var c_oAscCoAuthoringDottedWidth = 2;
var c_oAscCoAuthoringDottedDistance = 2;
var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96 / 25.4);