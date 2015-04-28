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
var g_bDate1904 = false;
var CellValueType = {
    Number: 0,
    String: 1,
    Bool: 2,
    Error: 3
};
var c_oAscNumFormatType = {
    General: 0,
    Custom: 1,
    Text: 2,
    Number: 3,
    Integer: 4,
    Scientific: 5,
    Currency: 6,
    Date: 7,
    Time: 8,
    Percent: 9,
    Fraction: 10,
    Accounting: 11
};
var c_oAscDrawingLayerType = {
    BringToFront: 0,
    SendToBack: 1,
    BringForward: 2,
    SendBackward: 3
};
var c_oAscTransactionState = {
    No: -1,
    Start: 0,
    Stop: 1
};
var c_oAscCellAnchorType = {
    cellanchorAbsolute: 0,
    cellanchorOneCell: 1,
    cellanchorTwoCell: 2
};
var c_oAscChartDefines = {
    defaultChartWidth: 478,
    defaultChartHeight: 286
};
var c_oAscLineDrawingRule = {
    Left: 0,
    Center: 1,
    Right: 2,
    Top: 0,
    Bottom: 2
};
var align_Right = 0;
var align_Left = 1;
var align_Center = 2;
var align_Justify = 3;
var linerule_AtLeast = 0;
var linerule_Auto = 1;
var linerule_Exact = 2;
var shd_Clear = 0;
var shd_Nil = 1;
var vertalign_Baseline = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript = 2;
var hdrftr_Header = 1;
var hdrftr_Footer = 2;
var c_oAscChartTitleShowSettings = {
    none: 0,
    overlay: 1,
    noOverlay: 2
};
var c_oAscChartHorAxisLabelShowSettings = {
    none: 0,
    noOverlay: 1
};
var c_oAscChartVertAxisLabelShowSettings = {
    none: 0,
    rotated: 1,
    vertical: 2,
    horizontal: 3
};
var c_oAscChartLegendShowSettings = {
    none: 0,
    left: 1,
    top: 2,
    right: 3,
    bottom: 4,
    leftOverlay: 5,
    rightOverlay: 6,
    layout: 7
};
var c_oAscChartDataLabelsPos = {
    none: 0,
    b: 1,
    bestFit: 2,
    ctr: 3,
    inBase: 4,
    inEnd: 5,
    l: 6,
    outEnd: 7,
    r: 8,
    t: 9
};
var c_oAscChartCatAxisSettings = {
    none: 0,
    leftToRight: 1,
    rightToLeft: 2,
    noLabels: 3
};
var c_oAscChartValAxisSettings = {
    none: 0,
    byDefault: 1,
    thousands: 2,
    millions: 3,
    billions: 4,
    log: 5
};
var c_oAscAxisTypeSettings = {
    vert: 0,
    hor: 1
};
var c_oAscGridLinesSettings = {
    none: 0,
    major: 1,
    minor: 2,
    majorMinor: 3
};
var c_oAscChartTypeSettings = {
    barNormal: 0,
    barStacked: 1,
    barStackedPer: 2,
    lineNormal: 3,
    lineStacked: 4,
    lineStackedPer: 5,
    lineNormalMarker: 6,
    lineStackedMarker: 7,
    lineStackedPerMarker: 8,
    pie: 9,
    hBarNormal: 10,
    hBarStacked: 11,
    hBarStackedPer: 12,
    areaNormal: 13,
    areaStacked: 14,
    areaStackedPer: 15,
    doughnut: 16,
    stock: 17,
    scatter: 18,
    scatterLine: 19,
    scatterLineMarker: 20,
    scatterMarker: 21,
    scatterNone: 22,
    scatterSmooth: 23,
    scatterSmoothMarker: 24,
    unknown: 25
};
var c_oAscValAxisRule = {
    auto: 0,
    fixed: 1
};
var c_oAscValAxUnits = {
    none: 0,
    BILLIONS: 1,
    HUNDRED_MILLIONS: 2,
    HUNDREDS: 3,
    HUNDRED_THOUSANDS: 4,
    MILLIONS: 5,
    TEN_MILLIONS: 6,
    TEN_THOUSANDS: 7,
    TRILLIONS: 8,
    CUSTOM: 9,
    THOUSANDS: 10
};
var c_oAscTickMark = {
    TICK_MARK_CROSS: 0,
    TICK_MARK_IN: 1,
    TICK_MARK_NONE: 2,
    TICK_MARK_OUT: 3
};
var c_oAscTickLabelsPos = {
    TICK_LABEL_POSITION_HIGH: 0,
    TICK_LABEL_POSITION_LOW: 1,
    TICK_LABEL_POSITION_NEXT_TO: 2,
    TICK_LABEL_POSITION_NONE: 3
};
var c_oAscCrossesRule = {
    auto: 0,
    maxValue: 1,
    value: 2,
    minValue: 3
};
var c_oAscHorAxisType = {
    auto: 0,
    date: 1,
    text: 2
};
var c_oAscBetweenLabelsRule = {
    auto: 0,
    manual: 1
};
var c_oAscLabelsPosition = {
    byDivisions: 0,
    betweenDivisions: 1
};
var c_oAscAxisType = {
    auto: 0,
    date: 1,
    text: 2,
    cat: 3,
    val: 4
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
var c_oAscWrapStyle = {
    Inline: 0,
    Flow: 1
};
var c_oAscLimLoc = {
    SubSup: 0,
    UndOvr: 1
};
var c_oAscMathJc = {
    Center: 0,
    CenterGroup: 1,
    Left: 2,
    Right: 3
};
var c_oAscTopBot = {
    Bot: 0,
    Top: 1
};
var c_oAscScript = {
    DoubleStruck: 0,
    Fraktur: 1,
    Monospace: 2,
    Roman: 3,
    SansSerif: 4,
    Script: 5
};
var c_oAscShp = {
    Centered: 0,
    Match: 1
};
var c_oAscSty = {
    Bold: 0,
    BoldItalic: 1,
    Italic: 2,
    Plain: 3
};
var c_oAscFType = {
    Bar: 0,
    Lin: 1,
    NoBar: 2,
    Skw: 3
};
var c_oAscBrkBin = {
    After: 0,
    Before: 1,
    Repeat: 2
};
var c_oAscBrkBinSub = {
    PlusMinus: 0,
    MinusPlus: 1,
    MinusMinus: 2
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
var c_oAscBorderType = {
    Hor: 1,
    Ver: 2,
    Diag: 3
};
var c_oAscPageOrientation = {
    PagePortrait: 1,
    PageLandscape: 2
};
var c_oAscLockTypes = {
    kLockTypeNone: 1,
    kLockTypeMine: 2,
    kLockTypeOther: 3,
    kLockTypeOther2: 4,
    kLockTypeOther3: 5
};
var c_oAscFormatPainterState = {
    kOff: 0,
    kOn: 1,
    kMultiple: 2
};
var c_oAscMaxTooltipLength = 256;
var c_oAscMaxCellOrCommentLength = 32767;