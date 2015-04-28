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
    ApplyChanges: 9
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
        StockChartError: -16,
        CoAuthoringDisconnect: -18,
        ConvertationPassword: -19,
        VKeyEncrypt: -20,
        KeyExpire: -21,
        UserCountExceed: -22,
        MobileUnexpectedCharCount: -23,
        UserDrop: -100
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
    Chart: 8,
    Math: 9
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
    stock: "Stock",
    doughnut: "Doughnut"
};
var c_oAscChartSubType = {
    normal: "normal",
    stacked: "stacked",
    stackedPer: "stackedPer"
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
    None: -1,
    All: 0,
    LastChanges: 1
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
var c_oAscSectionBreakType = {
    NextPage: 0,
    OddPage: 1,
    EvenPage: 2,
    Continuous: 3,
    Column: 4
};
var c_oAscMathMainType = {
    Symbol: 0,
    Fraction: 1,
    Script: 2,
    Radical: 3,
    Integral: 4,
    LargeOperator: 5,
    Bracket: 6,
    Function: 7,
    Accent: 8,
    LimitLog: 9,
    Operator: 10,
    Matrix: 11
};
var c_oAscMathMainTypeStrings = {};
c_oAscMathMainTypeStrings[c_oAscMathMainType.Symbol] = "Symbols";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Fraction] = "Fraction";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Script] = "Script";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Radical] = "Radical";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Integral] = "Integral";
c_oAscMathMainTypeStrings[c_oAscMathMainType.LargeOperator] = "LargeOperator";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Bracket] = "Bracket";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Function] = "Function";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Accent] = "Accent";
c_oAscMathMainTypeStrings[c_oAscMathMainType.LimitLog] = "LimitLog";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Operator] = "Operator";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Matrix] = "Matrix";
var c_oAscMathType = {
    Symbol_pm: 0,
    Symbol_infinity: 1,
    Symbol_equals: 2,
    Symbol_neq: 3,
    Symbol_about: 4,
    Symbol_times: 5,
    Symbol_div: 6,
    Symbol_factorial: 7,
    Symbol_propto: 8,
    Symbol_less: 9,
    Symbol_ll: 10,
    Symbol_greater: 11,
    Symbol_gg: 12,
    Symbol_leq: 13,
    Symbol_geq: 14,
    Symbol_mp: 15,
    Symbol_cong: 16,
    Symbol_approx: 17,
    Symbol_equiv: 18,
    Symbol_forall: 19,
    Symbol_additional: 20,
    Symbol_partial: 21,
    Symbol_sqrt: 22,
    Symbol_cbrt: 23,
    Symbol_qdrt: 24,
    Symbol_cup: 25,
    Symbol_cap: 26,
    Symbol_emptyset: 27,
    Symbol_percent: 28,
    Symbol_degree: 29,
    Symbol_fahrenheit: 30,
    Symbol_celsius: 31,
    Symbol_inc: 32,
    Symbol_nabla: 33,
    Symbol_exists: 34,
    Symbol_notexists: 35,
    Symbol_in: 36,
    Symbol_ni: 37,
    Symbol_leftarrow: 38,
    Symbol_uparrow: 39,
    Symbol_rightarrow: 40,
    Symbol_downarrow: 41,
    Symbol_leftrightarrow: 42,
    Symbol_therefore: 43,
    Symbol_plus: 44,
    Symbol_minus: 45,
    Symbol_not: 46,
    Symbol_ast: 47,
    Symbol_bullet: 48,
    Symbol_vdots: 49,
    Symbol_cdots: 50,
    Symbol_rddots: 51,
    Symbol_ddots: 52,
    Symbol_aleph: 53,
    Symbol_beth: 54,
    Symbol_QED: 55,
    Symbol_alpha: 65536,
    Symbol_beta: 65537,
    Symbol_gamma: 65538,
    Symbol_delta: 65539,
    Symbol_varepsilon: 65540,
    Symbol_epsilon: 65541,
    Symbol_zeta: 65542,
    Symbol_eta: 65543,
    Symbol_theta: 65544,
    Symbol_vartheta: 65545,
    Symbol_iota: 65546,
    Symbol_kappa: 65547,
    Symbol_lambda: 65548,
    Symbol_mu: 65549,
    Symbol_nu: 65550,
    Symbol_xsi: 65551,
    Symbol_o: 65552,
    Symbol_pi: 65553,
    Symbol_varpi: 65554,
    Symbol_rho: 65555,
    Symbol_varrho: 65556,
    Symbol_sigma: 65557,
    Symbol_varsigma: 65558,
    Symbol_tau: 65559,
    Symbol_upsilon: 65560,
    Symbol_varphi: 65561,
    Symbol_phi: 65562,
    Symbol_chi: 65563,
    Symbol_psi: 65564,
    Symbol_omega: 65565,
    Symbol_Alpha: 131072,
    Symbol_Beta: 131073,
    Symbol_Gamma: 131074,
    Symbol_Delta: 131075,
    Symbol_Epsilon: 131076,
    Symbol_Zeta: 131077,
    Symbol_Eta: 131078,
    Symbol_Theta: 131079,
    Symbol_Iota: 131080,
    Symbol_Kappa: 131081,
    Symbol_Lambda: 131082,
    Symbol_Mu: 131083,
    Symbol_Nu: 131084,
    Symbol_Xsi: 131085,
    Symbol_O: 131086,
    Symbol_Pi: 131087,
    Symbol_Rho: 131088,
    Symbol_Sigma: 131089,
    Symbol_Tau: 131090,
    Symbol_Upsilon: 131091,
    Symbol_Phi: 131092,
    Symbol_Chi: 131093,
    Symbol_Psi: 131094,
    Symbol_Omega: 131095,
    FractionVertical: 16777216,
    FractionDiagonal: 16777217,
    FractionHorizontal: 16777218,
    FractionSmall: 16777219,
    FractionDifferential_1: 16842752,
    FractionDifferential_2: 16842753,
    FractionDifferential_3: 16842754,
    FractionDifferential_4: 16842755,
    FractionPi_2: 16842756,
    ScriptSup: 33554432,
    ScriptSub: 33554433,
    ScriptSubSup: 33554434,
    ScriptSubSupLeft: 33554435,
    ScriptCustom_1: 33619968,
    ScriptCustom_2: 33619969,
    ScriptCustom_3: 33619970,
    ScriptCustom_4: 33619971,
    RadicalSqrt: 50331648,
    RadicalRoot_n: 50331649,
    RadicalRoot_2: 50331650,
    RadicalRoot_3: 50331651,
    RadicalCustom_1: 50397184,
    RadicalCustom_2: 50397185,
    Integral: 67108864,
    IntegralSubSup: 67108865,
    IntegralCenterSubSup: 67108866,
    IntegralDouble: 67108867,
    IntegralDoubleSubSup: 67108868,
    IntegralDoubleCenterSubSup: 67108869,
    IntegralTriple: 67108870,
    IntegralTripleSubSup: 67108871,
    IntegralTripleCenterSubSup: 67108872,
    IntegralOriented: 67174400,
    IntegralOrientedSubSup: 67174401,
    IntegralOrientedCenterSubSup: 67174402,
    IntegralOrientedDouble: 67174403,
    IntegralOrientedDoubleSubSup: 67174404,
    IntegralOrientedDoubleCenterSubSup: 67174405,
    IntegralOrientedTriple: 67174406,
    IntegralOrientedTripleSubSup: 67174407,
    IntegralOrientedTripleCenterSubSup: 67174408,
    Integral_dx: 67239936,
    Integral_dy: 67239937,
    Integral_dtheta: 67239938,
    LargeOperator_Sum: 83886080,
    LargeOperator_Sum_CenterSubSup: 83886081,
    LargeOperator_Sum_SubSup: 83886082,
    LargeOperator_Sum_CenterSub: 83886083,
    LargeOperator_Sum_Sub: 83886084,
    LargeOperator_Prod: 83951616,
    LargeOperator_Prod_CenterSubSup: 83951617,
    LargeOperator_Prod_SubSup: 83951618,
    LargeOperator_Prod_CenterSub: 83951619,
    LargeOperator_Prod_Sub: 83951620,
    LargeOperator_CoProd: 83951621,
    LargeOperator_CoProd_CenterSubSup: 83951622,
    LargeOperator_CoProd_SubSup: 83951623,
    LargeOperator_CoProd_CenterSub: 83951624,
    LargeOperator_CoProd_Sub: 83951625,
    LargeOperator_Union: 84017152,
    LargeOperator_Union_CenterSubSup: 84017153,
    LargeOperator_Union_SubSup: 84017154,
    LargeOperator_Union_CenterSub: 84017155,
    LargeOperator_Union_Sub: 84017156,
    LargeOperator_Intersection: 84017157,
    LargeOperator_Intersection_CenterSubSup: 84017158,
    LargeOperator_Intersection_SubSup: 84017159,
    LargeOperator_Intersection_CenterSub: 84017160,
    LargeOperator_Intersection_Sub: 84017161,
    LargeOperator_Disjunction: 84082688,
    LargeOperator_Disjunction_CenterSubSup: 84082689,
    LargeOperator_Disjunction_SubSup: 84082690,
    LargeOperator_Disjunction_CenterSub: 84082691,
    LargeOperator_Disjunction_Sub: 84082692,
    LargeOperator_Conjunction: 84082693,
    LargeOperator_Conjunction_CenterSubSup: 84082694,
    LargeOperator_Conjunction_SubSup: 84082695,
    LargeOperator_Conjunction_CenterSub: 84082696,
    LargeOperator_Conjunction_Sub: 84082697,
    LargeOperator_Custom_1: 84148224,
    LargeOperator_Custom_2: 84148225,
    LargeOperator_Custom_3: 84148226,
    LargeOperator_Custom_4: 84148227,
    LargeOperator_Custom_5: 84148228,
    Bracket_Round: 100663296,
    Bracket_Square: 100663297,
    Bracket_Curve: 100663298,
    Bracket_Angle: 100663299,
    Bracket_LowLim: 100663300,
    Bracket_UppLim: 100663301,
    Bracket_Line: 100663302,
    Bracket_LineDouble: 100663303,
    Bracket_Square_OpenOpen: 100663304,
    Bracket_Square_CloseClose: 100663305,
    Bracket_Square_CloseOpen: 100663306,
    Bracket_SquareDouble: 100663307,
    Bracket_Round_Delimiter_2: 100728832,
    Bracket_Curve_Delimiter_2: 100728833,
    Bracket_Angle_Delimiter_2: 100728834,
    Bracket_Angle_Delimiter_3: 100728835,
    Bracket_Round_OpenNone: 100794368,
    Bracket_Round_NoneOpen: 100794369,
    Bracket_Square_OpenNone: 100794370,
    Bracket_Square_NoneOpen: 100794371,
    Bracket_Curve_OpenNone: 100794372,
    Bracket_Curve_NoneOpen: 100794373,
    Bracket_Angle_OpenNone: 100794374,
    Bracket_Angle_NoneOpen: 100794375,
    Bracket_LowLim_OpenNone: 100794376,
    Bracket_LowLim_NoneNone: 100794377,
    Bracket_UppLim_OpenNone: 100794378,
    Bracket_UppLim_NoneOpen: 100794379,
    Bracket_Line_OpenNone: 100794380,
    Bracket_Line_NoneOpen: 100794381,
    Bracket_LineDouble_OpenNone: 100794382,
    Bracket_LineDouble_NoneOpen: 100794383,
    Bracket_SquareDouble_OpenNone: 100794384,
    Bracket_SquareDouble_NoneOpen: 100794385,
    Bracket_Custom_1: 100859904,
    Bracket_Custom_2: 100859905,
    Bracket_Custom_3: 100859906,
    Bracket_Custom_4: 100859907,
    Bracket_Custom_5: 100925440,
    Bracket_Custom_6: 100925441,
    Bracket_Custom_7: 100925442,
    Function_Sin: 117440512,
    Function_Cos: 117440513,
    Function_Tan: 117440514,
    Function_Csc: 117440515,
    Function_Sec: 117440516,
    Function_Cot: 117440517,
    Function_1_Sin: 117506048,
    Function_1_Cos: 117506049,
    Function_1_Tan: 117506050,
    Function_1_Csc: 117506051,
    Function_1_Sec: 117506052,
    Function_1_Cot: 117506053,
    Function_Sinh: 117571584,
    Function_Cosh: 117571585,
    Function_Tanh: 117571586,
    Function_Csch: 117571587,
    Function_Sech: 117571588,
    Function_Coth: 117571589,
    Function_1_Sinh: 117637120,
    Function_1_Cosh: 117637121,
    Function_1_Tanh: 117637122,
    Function_1_Csch: 117637123,
    Function_1_Sech: 117637124,
    Function_1_Coth: 117637125,
    Function_Custom_1: 117702656,
    Function_Custom_2: 117702657,
    Function_Custom_3: 117702658,
    Accent_Dot: 134217728,
    Accent_DDot: 134217729,
    Accent_DDDot: 134217730,
    Accent_Hat: 134217731,
    Accent_Check: 134217732,
    Accent_Accent: 134217733,
    Accent_Grave: 134217734,
    Accent_Smile: 134217735,
    Accent_Tilde: 134217736,
    Accent_Bar: 134217737,
    Accent_DoubleBar: 134217738,
    Accent_CurveBracketTop: 134217739,
    Accent_CurveBracketBot: 134217740,
    Accent_GroupTop: 134217741,
    Accent_GroupBot: 134217742,
    Accent_ArrowL: 134217743,
    Accent_ArrowR: 134217744,
    Accent_ArrowD: 134217745,
    Accent_HarpoonL: 134217746,
    Accent_HarpoonR: 134217747,
    Accent_BorderBox: 134283264,
    Accent_BorderBoxCustom: 134283265,
    Accent_BarTop: 134348800,
    Accent_BarBot: 134348801,
    Accent_Custom_1: 134414336,
    Accent_Custom_2: 134414337,
    Accent_Custom_3: 134414338,
    LimitLog_LogBase: 150994944,
    LimitLog_Log: 150994945,
    LimitLog_Lim: 150994946,
    LimitLog_Min: 150994947,
    LimitLog_Max: 150994948,
    LimitLog_Ln: 150994949,
    LimitLog_Custom_1: 151060480,
    LimitLog_Custom_2: 151060481,
    Operator_ColonEquals: 167772160,
    Operator_EqualsEquals: 167772161,
    Operator_PlusEquals: 167772162,
    Operator_MinusEquals: 167772163,
    Operator_Definition: 167772164,
    Operator_UnitOfMeasure: 167772165,
    Operator_DeltaEquals: 167772166,
    Operator_ArrowL_Top: 167837696,
    Operator_ArrowR_Top: 167837697,
    Operator_ArrowL_Bot: 167837698,
    Operator_ArrowR_Bot: 167837699,
    Operator_DoubleArrowL_Top: 167837700,
    Operator_DoubleArrowR_Top: 167837701,
    Operator_DoubleArrowL_Bot: 167837702,
    Operator_DoubleArrowR_Bot: 167837703,
    Operator_ArrowD_Top: 167837704,
    Operator_ArrowD_Bot: 167837705,
    Operator_DoubleArrowD_Top: 167837706,
    Operator_DoubleArrowD_Bot: 167837707,
    Operator_Custom_1: 167903232,
    Operator_Custom_2: 167903233,
    Matrix_1_2: 184549376,
    Matrix_2_1: 184549377,
    Matrix_1_3: 184549378,
    Matrix_3_1: 184549379,
    Matrix_2_2: 184549380,
    Matrix_2_3: 184549381,
    Matrix_3_2: 184549382,
    Matrix_3_3: 184549383,
    Matrix_Dots_Center: 184614912,
    Matrix_Dots_Baseline: 184614913,
    Matrix_Dots_Vertical: 184614914,
    Matrix_Dots_Diagonal: 184614915,
    Matrix_Identity_2: 184680448,
    Matrix_Identity_2_NoZeros: 184680449,
    Matrix_Identity_3: 184680450,
    Matrix_Identity_3_NoZeros: 184680451,
    Matrix_2_2_RoundBracket: 184745984,
    Matrix_2_2_SquareBracket: 184745985,
    Matrix_2_2_LineBracket: 184745986,
    Matrix_2_2_DLineBracket: 184745987,
    Matrix_Flat_Round: 184811520,
    Matrix_Flat_Square: 184811521
};
var c_oAscMathInterfaceType = {
    Common: 0,
    Fraction: 1,
    Script: 2,
    Radical: 3,
    LargeOperator: 4,
    Delimiter: 5,
    Function: 6,
    Accent: 7,
    BorderBox: 8,
    Bar: 9,
    Box: 10,
    Limit: 11,
    GroupChar: 12,
    Matrix: 13,
    EqArray: 14,
    Phantom: 15
};
window["flat_desine"] = false;