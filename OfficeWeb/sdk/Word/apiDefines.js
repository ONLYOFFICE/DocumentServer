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
 var c_oAscZoomType = {
    Current: 0,
    FitWidth: 1,
    FitPage: 2
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
    ApplyChanges: 9,
    PrepareToSave: 10
};
var c_oAscFileType = {
    INNER: 65,
    DOCX: 65,
    DOC: 66,
    ODT: 67,
    RTF: 68,
    TXT: 69,
    HTML_ZIP: 2051,
    MHT: 71,
    PDF: 513,
    EPUB: 72,
    FB2: 73,
    MOBI: 74,
    DOCY: 4097
};
var c_oAscAlignType = {
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2,
    JUSTIFY: 3,
    TOP: 4,
    MIDDLE: 5,
    BOTTOM: 6
};
var c_oAscWrapStyle = {
    Inline: 0,
    Flow: 1
};
var c_oAscWrapStyle2 = {
    Inline: 0,
    Square: 1,
    Tight: 2,
    Through: 3,
    TopAndBottom: 4,
    Behind: 5,
    InFront: 6
};
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
        SplitCellMaxRows: -13,
        SplitCellMaxCols: -14,
        SplitCellRowsDivider: -15,
        CoAuthoringDisconnect: -18,
        ConvertationPassword: -19,
        VKeyEncrypt: -20,
        KeyExpire: -21,
        UserCountExceed: -22,
        MobileUnexpectedCharCount: -23
    }
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
var c_oAscTableBordersType = {
    LEFT: 0,
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3,
    VERTLINE: 4,
    HORIZONTLINE: 5,
    INSIDE: 6,
    OUTSIDE: 7,
    ALL: 8
};
var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96 / 25.4);
var c_oAscStyleImage = {
    Default: 0,
    Document: 1
};
var c_oAscLineDrawingRule = {
    Left: 0,
    Center: 1,
    Right: 2,
    Top: 0,
    Bottom: 2
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
var align_Right = 0;
var align_Left = 1;
var align_Center = 2;
var align_Justify = 3;
var vertalign_Baseline = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript = 2;
var hdrftr_Header = 1;
var hdrftr_Footer = 2;
var hdrftr_Default = 1;
var hdrftr_Even = 2;
var hdrftr_First = 3;
var c_oAscTableSelectionType = {
    Cell: 0,
    Row: 1,
    Column: 2,
    Table: 3
};
var linerule_AtLeast = 0;
var linerule_Auto = 1;
var linerule_Exact = 2;
var shd_Clear = 0;
var shd_Nil = 1;
var c_oAscContextMenuTypes = {
    Common: 0,
    ChangeHdrFtr: 1
};
var c_oAscMouseMoveDataTypes = {
    Common: 0,
    Hyperlink: 1,
    LockedObject: 2
};
var c_oAscMouseMoveLockedObjectType = {
    Common: 0,
    Header: 1,
    Footer: 2
};
var c_oAscCollaborativeMarksShowType = {
    All: 0,
    LastChanges: 1
};
var c_oAscRelativeFromH = {
    Character: 0,
    Column: 1,
    InsideMargin: 2,
    LeftMargin: 3,
    Margin: 4,
    OutsideMargin: 5,
    Page: 6,
    RightMargin: 7
};
var c_oAscAlignH = {
    Center: 0,
    Inside: 1,
    Left: 2,
    Outside: 3,
    Right: 4
};
var c_oAscChangeLevel = {
    BringToFront: 0,
    BringForward: 1,
    SendToBack: 2,
    BringBackward: 3
};
var c_oAscRelativeFromV = {
    BottomMargin: 0,
    InsideMargin: 1,
    Line: 2,
    Margin: 3,
    OutsideMargin: 4,
    Page: 5,
    Paragraph: 6,
    TopMargin: 7
};
var c_oAscAlignV = {
    Bottom: 0,
    Center: 1,
    Inside: 2,
    Outside: 3,
    Top: 4
};
var c_oAscVertAlignJc = {
    Top: 0,
    Center: 1,
    Bottom: 2
};
var c_oAscTableLayout = {
    AutoFit: 0,
    Fixed: 1
};
var c_oAscHAnchor = {
    Margin: 0,
    Page: 1,
    Text: 2,
    PageInternal: 255
};
var c_oAscXAlign = {
    Center: 0,
    Inside: 1,
    Left: 2,
    Outside: 3,
    Right: 4
};
var c_oAscYAlign = {
    Bottom: 0,
    Center: 1,
    Inline: 2,
    Inside: 3,
    Outside: 4,
    Top: 5
};
var c_oAscVAnchor = {
    Margin: 0,
    Page: 1,
    Text: 2
};
var c_oAscColor = {
    COLOR_TYPE_SRGB: 1,
    COLOR_TYPE_PRST: 2,
    COLOR_TYPE_SCHEME: 3
};
var c_oAscFill = {
    FILL_TYPE_BLIP: 1,
    FILL_TYPE_NOFILL: 2,
    FILL_TYPE_SOLID: 3,
    FILL_TYPE_PATT: 4,
    FILL_TYPE_GRAD: 5
};
var c_oAscFillGradType = {
    GRAD_LINEAR: 1,
    GRAD_PATH: 2
};
var c_oAscFillBlipType = {
    STRETCH: 1,
    TILE: 2
};
var c_oAscStrokeType = {
    STROKE_NONE: 0,
    STROKE_COLOR: 1
};
var c_oAscAlignShapeType = {
    ALIGN_LEFT: 0,
    ALIGN_RIGHT: 1,
    ALIGN_TOP: 2,
    ALIGN_BOTTOM: 3,
    ALIGN_CENTER: 4,
    ALIGN_MIDDLE: 5
};
var c_oAscVerticalTextAlign = {
    TEXT_ALIGN_BOTTOM: 0,
    TEXT_ALIGN_CTR: 1,
    TEXT_ALIGN_DIST: 2,
    TEXT_ALIGN_JUST: 3,
    TEXT_ALIGN_TOP: 4
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
var TABLE_STYLE_WIDTH_PIX = 70;
var TABLE_STYLE_HEIGHT_PIX = 50;
var c_oAscDropCap = {
    None: 0,
    Drop: 1,
    Margin: 2
};