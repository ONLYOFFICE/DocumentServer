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
var historyitem_ChartFormatSetChart = 1001;
var historyitem_AutoShapes_SetDrawingBaseCoors = 1000;
var historyitem_AutoShapes_SetWorksheet = 1002;
var historyitem_AutoShapes_AddToDrawingObjects = 1003;
var historyitem_AutoShapes_RemoveFromDrawingObjects = 1004;
var historyitem_CommonChart_RemoveSeries = 1005;
var historyitem_CommonSeries_RemoveDPt = 1006;
var historyitem_CommonLit_RemoveDPt = 1007;
var historyitem_CommonChartFormat_SetParent = 1008;
var historyitem_ColorMod_SetName = 2001;
var historyitem_ColorMod_SetVal = 2002;
var historyitem_ColorModifiers_AddColorMod = 2003;
var historyitem_ColorModifiers_RemoveColorMod = 2004;
var historyitem_SysColor_SetId = 2004;
var historyitem_SysColor_SetR = 2005;
var historyitem_SysColor_SetG = 2006;
var historyitem_SysColor_SetB = 2007;
var historyitem_PrstColor_SetId = 2005;
var historyitem_RGBColor_SetColor = 2006;
var historyitem_SchemeColor_SetId = 2007;
var historyitem_UniColor_SetColor = 2008;
var historyitem_UniColor_SetMods = 2009;
var historyitem_SrcRect_SetLTRB = 2010;
var historyitem_BlipFill_SetRasterImageId = 2011;
var historyitem_BlipFill_SetVectorImageBin = 2012;
var historyitem_BlipFill_SetSrcRect = 2013;
var historyitem_BlipFill_SetStretch = 2014;
var historyitem_BlipFill_SetTile = 2015;
var historyitem_BlipFill_SetRotWithShape = 2016;
var historyitem_SolidFill_SetColor = 2017;
var historyitem_Gs_SetColor = 2018;
var historyitem_Gs_SetPos = 2019;
var historyitem_GradLin_SetAngle = 2020;
var historyitem_GradLin_SetScale = 2021;
var historyitem_GradPath_SetPath = 2022;
var historyitem_GradPath_SetRect = 2023;
var historyitem_GradFill_AddColor = 2024;
var historyitem_GradFill_SetLin = 2025;
var historyitem_GradFill_SetPath = 2026;
var historyitem_PathFill_SetFType = 2027;
var historyitem_PathFill_SetFgClr = 2028;
var historyitem_PathFill_SetBgClr = 2029;
var historyitem_UniFill_SetFill = 2030;
var historyitem_UniFill_SetTransparent = 2031;
var historyitem_EndArrow_SetType = 2032;
var historyitem_EndArrow_SetLen = 2033;
var historyitem_EndArrow_SetW = 2034;
var historyitem_LineJoin_SetType = 2035;
var historyitem_LineJoin_SetLimit = 2036;
var historyitem_Ln_SetFill = 2037;
var historyitem_Ln_SetPrstDash = 2038;
var historyitem_Ln_SetJoin = 2040;
var historyitem_Ln_SetHeadEnd = 2041;
var historyitem_Ln_SetTailEnd = 2042;
var historyitem_Ln_SetAlgn = 2043;
var historyitem_Ln_SetCap = 2044;
var historyitem_Ln_SetCmpd = 2046;
var historyitem_Ln_SetW = 2047;
var historyitem_DefaultShapeDefinition_SetSpPr = 2048;
var historyitem_DefaultShapeDefinition_SetBodyPr = 2049;
var historyitem_DefaultShapeDefinition_SetLstStyle = 2050;
var historyitem_DefaultShapeDefinition_SetStyle = 2051;
var historyitem_CNvPr_SetId = 2052;
var historyitem_CNvPr_SetName = 2053;
var historyitem_CNvPr_SetIsHidden = 2054;
var historyitem_NvPr_SetIsPhoto = 2055;
var historyitem_NvPr_SetUserDrawn = 2056;
var historyitem_NvPr_SetPh = 2057;
var historyitem_Ph_SetHasCustomPrompt = 2058;
var historyitem_Ph_SetIdx = 2059;
var historyitem_Ph_SetOrient = 2060;
var historyitem_Ph_SetSz = 2061;
var historyitem_Ph_SetType = 2062;
var historyitem_UniNvPr_SetCNvPr = 2063;
var historyitem_UniNvPr_SetUniPr = 2064;
var historyitem_UniNvPr_SetNvPr = 2065;
var historyitem_StyleRef_SetIdx = 2066;
var historyitem_StyleRef_SetColor = 2067;
var historyitem_FontRef_SetIdx = 2068;
var historyitem_FontRef_SetColor = 2069;
var historyitem_Chart_SetAutoTitleDeleted = 2070;
var historyitem_Chart_SetBackWall = 2071;
var historyitem_Chart_SetDispBlanksAs = 2072;
var historyitem_Chart_SetFloor = 2073;
var historyitem_Chart_SetLegend = 2074;
var historyitem_Chart_AddPivotFmt = 2075;
var historyitem_Chart_SetPlotArea = 2076;
var historyitem_Chart_SetPlotVisOnly = 2077;
var historyitem_Chart_SetShowDLblsOverMax = 2078;
var historyitem_Chart_SetSideWall = 2079;
var historyitem_Chart_SetTitle = 2080;
var historyitem_Chart_SetView3D = 2081;
var historyitem_ChartSpace_SetChart = 2082;
var historyitem_ChartSpace_SetClrMapOvr = 2083;
var historyitem_ChartSpace_SetDate1904 = 2084;
var historyitem_ChartSpace_SetExternalData = 2085;
var historyitem_ChartSpace_SetLang = 2086;
var historyitem_ChartSpace_SetPivotSource = 2087;
var historyitem_ChartSpace_SetPrintSettings = 2088;
var historyitem_ChartSpace_SetProtection = 2089;
var historyitem_ChartSpace_SetRoundedCorners = 2090;
var historyitem_ChartSpace_SetSpPr = 2091;
var historyitem_ChartSpace_SetStyle = 2092;
var historyitem_ChartSpace_SetTxPr = 2093;
var historyitem_ChartSpace_SetUserShapes = 2094;
var historyitem_ChartSpace_SetThemeOverride = 2095;
var historyitem_ChartSpace_SetGroup = 2096;
var historyitem_ChartSpace_SetParent = 2097;
var historyitem_Legend_SetLayout = 2095;
var historyitem_Legend_AddLegendEntry = 2096;
var historyitem_Legend_SetLegendPos = 2097;
var historyitem_Legend_SetOverlay = 2098;
var historyitem_Legend_SetSpPr = 2099;
var historyitem_Legend_SetTxPr = 2100;
var historyitem_Layout_SetH = 2101;
var historyitem_Layout_SetHMode = 2102;
var historyitem_Layout_SetLayoutTarget = 2103;
var historyitem_Layout_SetW = 2103;
var historyitem_Layout_SetWMode = 2104;
var historyitem_Layout_SetX = 2105;
var historyitem_Layout_SetXMode = 2105;
var historyitem_Layout_SetY = 2106;
var historyitem_Layout_SetYMode = 2107;
var historyitem_LegendEntry_SetDelete = 2108;
var historyitem_LegendEntry_SetIdx = 2109;
var historyitem_LegendEntry_SetTxPr = 2110;
var historyitem_PivotFmt_SetDLbl = 2110;
var historyitem_PivotFmt_SetIdx = 2111;
var historyitem_PivotFmt_SetMarker = 2112;
var historyitem_PivotFmt_SetSpPr = 2113;
var historyitem_PivotFmt_SetTxPr = 2114;
var historyitem_DLbl_SetDelete = 2115;
var historyitem_DLbl_SetDLblPos = 2116;
var historyitem_DLbl_SetIdx = 2117;
var historyitem_DLbl_SetLayout = 2118;
var historyitem_DLbl_SetNumFmt = 2119;
var historyitem_DLbl_SetSeparator = 2120;
var historyitem_DLbl_SetShowBubbleSize = 2121;
var historyitem_DLbl_SetShowCatName = 2122;
var historyitem_DLbl_SetShowLegendKey = 2123;
var historyitem_DLbl_SetShowPercent = 2124;
var historyitem_DLbl_SetShowSerName = 2125;
var historyitem_DLbl_SetShowVal = 2126;
var historyitem_DLbl_SetSpPr = 2127;
var historyitem_DLbl_SetTx = 2128;
var historyitem_DLbl_SetTxPr = 2129;
var historyitem_Marker_SetSize = 2130;
var historyitem_Marker_SetSpPr = 2131;
var historyitem_Marker_SetSymbol = 2132;
var historyitem_PlotArea_AddChart = 2133;
var historyitem_PlotArea_SetCatAx = 2134;
var historyitem_PlotArea_SetDateAx = 2135;
var historyitem_PlotArea_SetDTable = 2136;
var historyitem_PlotArea_SetLayout = 2137;
var historyitem_PlotArea_SetSerAx = 2138;
var historyitem_PlotArea_SetSpPr = 2139;
var historyitem_PlotArea_SetValAx = 2140;
var historyitem_PlotArea_AddAxis = 2141;
var historyitem_PlotArea_RemoveChart = 2142;
var historyitem_PlotArea_RemoveAxis = 2143;
var historyitem_NumFmt_SetFormatCode = 2171;
var historyitem_NumFmt_SetSourceLinked = 2172;
var historyitem_Scaling_SetLogBase = 2173;
var historyitem_Scaling_SetMax = 2174;
var historyitem_Scaling_SetMin = 2175;
var historyitem_Scaling_SetOrientation = 2176;
var historyitem_Scaling_SetParent = 2177;
var historyitem_DTable_SetShowHorzBorder = 2177;
var historyitem_DTable_SetShowKeys = 2178;
var historyitem_DTable_SetShowOutline = 2179;
var historyitem_DTable_SetShowVertBorder = 2180;
var historyitem_DTable_SetSpPr = 2181;
var historyitem_DTable_SetTxPr = 2182;
var historyitem_LineChart_AddAxId = 2183;
var historyitem_LineChart_SetDLbls = 2184;
var historyitem_LineChart_SetDropLines = 2185;
var historyitem_LineChart_SetGrouping = 2186;
var historyitem_LineChart_SetHiLowLines = 2187;
var historyitem_LineChart_SetMarker = 2188;
var historyitem_LineChart_AddSer = 2189;
var historyitem_LineChart_SetSmooth = 2190;
var historyitem_LineChart_SetUpDownBars = 2191;
var historyitem_LineChart_SetVaryColors = 2192;
var historyitem_DLbls_SetDelete = 2193;
var historyitem_DLbls_SetDLbl = 2194;
var historyitem_DLbls_SetDLblPos = 2195;
var historyitem_DLbls_SetLeaderLines = 2196;
var historyitem_DLbls_SetNumFmt = 2197;
var historyitem_DLbls_SetSeparator = 2198;
var historyitem_DLbls_SetShowBubbleSize = 2199;
var historyitem_DLbls_SetShowCatName = 2200;
var historyitem_DLbls_SetShowLeaderLines = 2201;
var historyitem_DLbls_SetShowLegendKey = 2202;
var historyitem_DLbls_SetShowPercent = 2203;
var historyitem_DLbls_SetShowSerName = 2204;
var historyitem_DLbls_SetShowVal = 2205;
var historyitem_DLbls_SetSpPr = 2206;
var historyitem_DLbls_SetTxPr = 2207;
var historyitem_UpDownBars_SetDownBars = 2208;
var historyitem_UpDownBars_SetGapWidth = 2209;
var historyitem_UpDownBars_SetUpBars = 2210;
var historyitem_BarChart_AddAxId = 2211;
var historyitem_BarChart_SetBarDir = 2212;
var historyitem_BarChart_SetDLbls = 2213;
var historyitem_BarChart_SetGapWidth = 2214;
var historyitem_BarChart_SetGrouping = 2215;
var historyitem_BarChart_SetOverlap = 2216;
var historyitem_BarChart_AddSer = 2217;
var historyitem_BarChart_SetSerLines = 2218;
var historyitem_BarChart_SetVaryColors = 2219;
var historyitem_BubbleChart_AddAxId = 2220;
var historyitem_BubbleChart_SetBubble3D = 2221;
var historyitem_BubbleChart_SetBubbleScale = 2222;
var historyitem_BubbleChart_SetDLbls = 2223;
var historyitem_BubbleChart_AddSerie = 2224;
var historyitem_BubbleChart_SetShowNegBubbles = 2225;
var historyitem_BubbleChart_SetSizeRepresents = 2226;
var historyitem_BubbleChart_SetVaryColors = 2227;
var historyitem_DoughnutChart_SetDLbls = 2228;
var historyitem_DoughnutChart_SetFirstSliceAng = 2229;
var historyitem_DoughnutChart_SetHoleSize = 2230;
var historyitem_DoughnutChart_AddSer = 2231;
var historyitem_DoughnutChart_SetVaryColor = 2232;
var historyitem_OfPieChart_AddCustSplit = 2233;
var historyitem_OfPieChart_SetDLbls = 2234;
var historyitem_OfPieChart_SetGapWidth = 2235;
var historyitem_OfPieChart_SetOfPieType = 2236;
var historyitem_OfPieChart_SetSecondPieSize = 2237;
var historyitem_OfPieChart_AddSer = 2238;
var historyitem_OfPieChart_SetSerLines = 2239;
var historyitem_OfPieChart_SetSplitPos = 2240;
var historyitem_OfPieChart_SetSplitType = 2241;
var historyitem_OfPieChart_SetVaryColors = 2242;
var historyitem_PieChart_SetDLbls = 2243;
var historyitem_PieChart_SetFirstSliceAng = 2244;
var historyitem_PieChart_AddSer = 2245;
var historyitem_PieChart_SetVaryColors = 2246;
var historyitem_RadarChart_AddAxId = 2247;
var historyitem_RadarChart_SetDLbls = 2248;
var historyitem_RadarChart_SetRadarStyle = 2249;
var historyitem_RadarChart_AddSer = 2250;
var historyitem_RadarChart_SetVaryColors = 2251;
var historyitem_ScatterChart_AddAxId = 2247;
var historyitem_ScatterChart_SetDLbls = 2248;
var historyitem_ScatterChart_SetScatterStyle = 2249;
var historyitem_ScatterChart_AddSer = 2250;
var historyitem_ScatterChart_SetVaryColors = 2251;
var historyitem_StockChart_AddAxId = 2252;
var historyitem_StockChart_SetDLbls = 2253;
var historyitem_StockChart_SetDropLines = 2254;
var historyitem_StockChart_SetHiLowLines = 2255;
var historyitem_StockChart_AddSer = 2256;
var historyitem_StockChart_SetUpDownBars = 2257;
var historyitem_SurfaceChart_AddAxId = 2258;
var historyitem_SurfaceChart_AddBandFmt = 2259;
var historyitem_SurfaceChart_AddSer = 2260;
var historyitem_SurfaceChart_SetWireframe = 2261;
var historyitem_BandFmt_SetIdx = 2262;
var historyitem_BandFmt_SetSpPr = 2263;
var historyitem_AreaChart_AddAxId = 2264;
var historyitem_AreaChart_SetDLbls = 2265;
var historyitem_AreaChart_SetDropLines = 2266;
var historyitem_AreaChart_SetGrouping = 2267;
var historyitem_AreaChart_AddSer = 2268;
var historyitem_AreaChart_SetVaryColors = 2269;
var historyitem_ScatterSer_SetDLbls = 2270;
var historyitem_ScatterSer_SetDPt = 2271;
var historyitem_ScatterSer_SetErrBars = 2272;
var historyitem_ScatterSer_SetIdx = 2273;
var historyitem_ScatterSer_SetMarker = 2274;
var historyitem_ScatterSer_SetOrder = 2275;
var historyitem_ScatterSer_SetSmooth = 2276;
var historyitem_ScatterSer_SetSpPr = 2277;
var historyitem_ScatterSer_SetTrendline = 2278;
var historyitem_ScatterSer_SetTx = 2279;
var historyitem_ScatterSer_SetXVal = 2280;
var historyitem_ScatterSer_SetYVal = 2281;
var historyitem_DPt_SetBubble3D = 2282;
var historyitem_DPt_SetExplosion = 2283;
var historyitem_DPt_SetIdx = 2284;
var historyitem_DPt_SetInvertIfNegative = 2285;
var historyitem_DPt_SetMarker = 2286;
var historyitem_DPt_SetPictureOptions = 2287;
var historyitem_DPt_SetSpPr = 2288;
var historyitem_ErrBars_SetErrBarType = 2289;
var historyitem_ErrBars_SetErrDir = 2290;
var historyitem_ErrBars_SetErrValType = 2291;
var historyitem_ErrBars_SetMinus = 2292;
var historyitem_ErrBars_SetNoEndCap = 2293;
var historyitem_ErrBars_SetPlus = 2294;
var historyitem_ErrBars_SetSpPr = 2295;
var historyitem_ErrBars_SetVal = 2296;
var historyitem_MinusPlus_SetnNumLit = 2297;
var historyitem_MinusPlus_SetnNumRef = 2298;
var historyitem_NumLit_SetFormatCode = 2299;
var historyitem_NumLit_AddPt = 2300;
var historyitem_NumLit_SetPtCount = 2301;
var historyitem_NumericPoint_SetFormatCode = 2302;
var historyitem_NumericPoint_SetIdx = 2303;
var historyitem_NumericPoint_SetVal = 2304;
var historyitem_NumRef_SetF = 2305;
var historyitem_NumRef_SetNumCache = 2306;
var historyitem_Trendline_SetBackward = 2307;
var historyitem_Trendline_SetDispEq = 2308;
var historyitem_Trendline_SetDispRSqr = 2309;
var historyitem_Trendline_SetForward = 2310;
var historyitem_Trendline_SetIntercept = 2311;
var historyitem_Trendline_SetName = 2312;
var historyitem_Trendline_SetOrder = 2313;
var historyitem_Trendline_SetPeriod = 2314;
var historyitem_Trendline_SetSpPr = 2315;
var historyitem_Trendline_SetTrendlineLbl = 2316;
var historyitem_Trendline_SetTrendlineType = 2317;
var historyitem_Tx_SetStrRef = 2318;
var historyitem_Tx_SetVal = 2319;
var historyitem_StrRef_SetF = 2319;
var historyitem_StrRef_SetStrCache = 2320;
var historyitem_StrCache_AddPt = 2321;
var historyitem_StrCache_SetPtCount = 2322;
var historyitem_StrPoint_SetIdx = 2323;
var historyitem_StrPoint_SetVal = 2324;
var historyitem_XVal_SetMultiLvlStrRef = 2325;
var historyitem_XVal_SetNumLit = 2326;
var historyitem_XVal_SetNumRef = 2327;
var historyitem_XVal_SetStrLit = 2328;
var historyitem_XVal_SetStrRef = 2329;
var historyitem_MultiLvlStrRef_SetF = 2330;
var historyitem_MultiLvlStrRef_SetMultiLvlStrCache = 2331;
var historyitem_MultiLvlStrCache_SetLvl = 2332;
var historyitem_MultiLvlStrCache_SetPtCount = 2333;
var historyitem_StringLiteral_SetPt = 2334;
var historyitem_StringLiteral_SetPtCount = 2335;
var historyitem_YVal_SetNumLit = 2336;
var historyitem_YVal_SetNumRef = 2337;
var historyitem_AreaSeries_SetCat = 2338;
var historyitem_AreaSeries_SetDLbls = 2339;
var historyitem_AreaSeries_SetDPt = 2340;
var historyitem_AreaSeries_SetErrBars = 2341;
var historyitem_AreaSeries_SetIdx = 2342;
var historyitem_AreaSeries_SetOrder = 2343;
var historyitem_AreaSeries_SetPictureOptions = 2344;
var historyitem_AreaSeries_SetSpPr = 2345;
var historyitem_AreaSeries_SetTrendline = 2346;
var historyitem_AreaSeries_SetTx = 2347;
var historyitem_AreaSeries_SetVal = 2348;
var historyitem_Cat_SetMultiLvlStrRef = 2347;
var historyitem_Cat_SetNumLit = 2348;
var historyitem_Cat_SetNumRef = 2349;
var historyitem_Cat_SetStrLit = 2350;
var historyitem_Cat_SetStrRef = 2351;
var historyitem_PictureOptions_SetApplyToEnd = 2352;
var historyitem_PictureOptions_SetApplyToFront = 2353;
var historyitem_PictureOptions_SetApplyToSides = 2354;
var historyitem_PictureOptions_SetPictureFormat = 2355;
var historyitem_PictureOptions_SetPictureStackUnit = 2356;
var historyitem_RadarSeries_SetCat = 2357;
var historyitem_RadarSeries_SetDLbls = 2357;
var historyitem_RadarSeries_SetDPt = 2358;
var historyitem_RadarSeries_SetIdx = 2359;
var historyitem_RadarSeries_SetMarker = 2360;
var historyitem_RadarSeries_SetOrder = 2361;
var historyitem_RadarSeries_SetSpPr = 2362;
var historyitem_RadarSeries_SetTx = 2363;
var historyitem_RadarSeries_SetVal = 2364;
var historyitem_BarSeries_SetCat = 2365;
var historyitem_BarSeries_SetDLbls = 2366;
var historyitem_BarSeries_SetDPt = 2367;
var historyitem_BarSeries_SetErrBars = 2368;
var historyitem_BarSeries_SetIdx = 2369;
var historyitem_BarSeries_SetInvertIfNegative = 2370;
var historyitem_BarSeries_SetOrder = 2371;
var historyitem_BarSeries_SetPictureOptions = 2372;
var historyitem_BarSeries_SetShape = 2373;
var historyitem_BarSeries_SetSpPr = 2374;
var historyitem_BarSeries_SetTrendline = 2375;
var historyitem_BarSeries_SetTx = 2376;
var historyitem_BarSeries_SetVal = 2377;
var historyitem_LineSeries_SetCat = 2378;
var historyitem_LineSeries_SetDLbls = 2379;
var historyitem_LineSeries_SetDPt = 2380;
var historyitem_LineSeries_SetErrBars = 2381;
var historyitem_LineSeries_SetIdx = 2382;
var historyitem_LineSeries_SetMarker = 2383;
var historyitem_LineSeries_SetOrder = 2384;
var historyitem_LineSeries_SetSmooth = 2385;
var historyitem_LineSeries_SetSpPr = 2386;
var historyitem_LineSeries_SetTrendline = 2387;
var historyitem_LineSeries_SetTx = 2388;
var historyitem_LineSeries_SetVal = 2389;
var historyitem_PieSeries_SetCat = 2390;
var historyitem_PieSeries_SetDLbls = 2391;
var historyitem_PieSeries_SetDPt = 2392;
var historyitem_PieSeries_SetExplosion = 2393;
var historyitem_PieSeries_SetIdx = 2394;
var historyitem_PieSeries_SetOrder = 2395;
var historyitem_PieSeries_SetSpPr = 2396;
var historyitem_PieSeries_SetTx = 2397;
var historyitem_PieSeries_SetVal = 2398;
var historyitem_SurfaceSeries_SetCat = 2399;
var historyitem_SurfaceSeries_SetIdx = 2400;
var historyitem_SurfaceSeries_SetOrder = 2401;
var historyitem_SurfaceSeries_SetSpPr = 2402;
var historyitem_SurfaceSeries_SetTx = 2403;
var historyitem_SurfaceSeries_SetVal = 2404;
var historyitem_BubbleSeries_SetBubble3D = 2405;
var historyitem_BubbleSeries_SetBubbleSize = 2406;
var historyitem_BubbleSeries_SetDLbls = 2407;
var historyitem_BubbleSeries_SetDPt = 2408;
var historyitem_BubbleSeries_SetErrBars = 2409;
var historyitem_BubbleSeries_SetIdx = 2410;
var historyitem_BubbleSeries_SetInvertIfNegative = 2411;
var historyitem_BubbleSeries_SetOrder = 2412;
var historyitem_BubbleSeries_SetSpPr = 2413;
var historyitem_BubbleSeries_SetTrendline = 2414;
var historyitem_BubbleSeries_SetTx = 2415;
var historyitem_BubbleSeries_SetXVal = 2416;
var historyitem_BubbleSeries_SetYVal = 2417;
var historyitem_ExternalData_SetAutoUpdate = 2418;
var historyitem_ExternalData_SetId = 2419;
var historyitem_PivotSource_SetFmtId = 2420;
var historyitem_PivotSource_SetName = 2421;
var historyitem_Protection_SetChartObject = 2422;
var historyitem_Protection_SetData = 2423;
var historyitem_Protection_SetFormatting = 2424;
var historyitem_Protection_SetSelection = 2425;
var historyitem_Protection_SetUserInterface = 2426;
var historyitem_ChartWall_SetPictureOptions = 2427;
var historyitem_ChartWall_SetSpPr = 2428;
var historyitem_ChartWall_SetThickness = 2429;
var historyitem_View3d_SetDepthPercent = 2430;
var historyitem_View3d_SetHPercent = 2431;
var historyitem_View3d_SetPerspective = 2432;
var historyitem_View3d_SetRAngAx = 2433;
var historyitem_View3d_SetRotX = 2434;
var historyitem_View3d_SetRotY = 2435;
var historyitem_Title_SetLayout = 2436;
var historyitem_Title_SetOverlay = 2437;
var historyitem_Title_SetSpPr = 2438;
var historyitem_Title_SetTx = 2439;
var historyitem_Title_SetTxPr = 2440;
var historyitem_ChartText_SetRich = 2441;
var historyitem_ChartText_SetStrRef = 2442;
var historyitem_ShapeStyle_SetLnRef = 2443;
var historyitem_ShapeStyle_SetFillRef = 2444;
var historyitem_ShapeStyle_SetFontRef = 2445;
var historyitem_ShapeStyle_SetEffectRef = 2446;
var historyitem_Xfrm_SetOffX = 2446;
var historyitem_Xfrm_SetOffY = 2447;
var historyitem_Xfrm_SetExtX = 2448;
var historyitem_Xfrm_SetExtY = 2449;
var historyitem_Xfrm_SetChOffX = 2450;
var historyitem_Xfrm_SetChOffY = 2451;
var historyitem_Xfrm_SetChExtX = 2452;
var historyitem_Xfrm_SetChExtY = 2453;
var historyitem_Xfrm_SetFlipH = 2454;
var historyitem_Xfrm_SetFlipV = 2455;
var historyitem_Xfrm_SetRot = 2456;
var historyitem_Xfrm_SetParent = 2457;
var historyitem_SpPr_SetBwMode = 2457;
var historyitem_SpPr_SetXfrm = 2458;
var historyitem_SpPr_SetGeometry = 2459;
var historyitem_SpPr_SetFill = 2460;
var historyitem_SpPr_SetLn = 2461;
var historyitem_SpPr_SetParent = 2462;
var historyitem_ClrScheme_AddClr = 2462;
var historyitem_ClrScheme_SetName = 2463;
var historyitem_ClrMap_SetClr = 2464;
var historyitem_ExtraClrScheme_SetClrScheme = 2465;
var historyitem_ExtraClrScheme_SetClrMap = 2466;
var historyitem_FontCollection_SetFontScheme = 2467;
var historyitem_FontCollection_SetLatin = 2467;
var historyitem_FontCollection_SetEA = 2468;
var historyitem_FontCollection_SetCS = 2469;
var historyitem_FontScheme_SetName = 2470;
var historyitem_FontScheme_SetMajorFont = 2471;
var historyitem_FontScheme_SetMinorFont = 2472;
var historyitem_FormatScheme_SetName = 2473;
var historyitem_FormatScheme_AddFillToStyleLst = 2474;
var historyitem_FormatScheme_AddLnToStyleLst = 2475;
var historyitem_FormatScheme_AddEffectToStyleLst = 2476;
var historyitem_FormatScheme_AddBgFillToStyleLst = 2477;
var historyitem_ThemeElements_SetClrScheme = 2478;
var historyitem_ThemeElements_SetFontScheme = 2479;
var historyitem_ThemeElements_SetFmtScheme = 2480;
var historyitem_HF_SetDt = 2481;
var historyitem_HF_SetFtr = 2482;
var historyitem_HF_SetHdr = 2483;
var historyitem_HF_SetSldNum = 2484;
var historyitem_BgPr_SetFill = 2485;
var historyitem_BgPr_SetShadeToTitle = 2486;
var historyitem_BgSetBwMode = 2487;
var historyitem_BgSetBgPr = 2488;
var historyitem_BgSetBgRef = 2489;
var historyitem_PrintSettingsSetHeaderFooter = 2490;
var historyitem_PrintSettingsSetPageMargins = 2491;
var historyitem_PrintSettingsSetPageSetup = 2492;
var historyitem_HeaderFooterChartSetAlignWithMargins = 2493;
var historyitem_HeaderFooterChartSetDifferentFirst = 2494;
var historyitem_HeaderFooterChartSetDifferentOddEven = 2495;
var historyitem_HeaderFooterChartSetEvenFooter = 2496;
var historyitem_HeaderFooterChartSetEvenHeader = 2497;
var historyitem_HeaderFooterChartSetFirstFooter = 2498;
var historyitem_HeaderFooterChartSetFirstHeader = 2499;
var historyitem_HeaderFooterChartSetOddFooter = 2500;
var historyitem_HeaderFooterChartSetOddHeader = 2501;
var historyitem_PageMarginsSetB = 2502;
var historyitem_PageMarginsSetFooter = 2503;
var historyitem_PageMarginsSetHeader = 2504;
var historyitem_PageMarginsSetL = 2505;
var historyitem_PageMarginsSetR = 2506;
var historyitem_PageMarginsSetT = 2507;
var historyitem_PageSetupSetBlackAndWhite = 2508;
var historyitem_PageSetupSetCopies = 2509;
var historyitem_PageSetupSetDraft = 2510;
var historyitem_PageSetupSetFirstPageNumber = 2511;
var historyitem_PageSetupSetHorizontalDpi = 2512;
var historyitem_PageSetupSetOrientation = 2513;
var historyitem_PageSetupSetPaperHeight = 2514;
var historyitem_PageSetupSetPaperSize = 2515;
var historyitem_PageSetupSetPaperWidth = 2516;
var historyitem_PageSetupSetUseFirstPageNumb = 2517;
var historyitem_PageSetupSetVerticalDpi = 2518;
var historyitem_ShapeSetBDeleted = 2518;
var historyitem_ShapeSetNvSpPr = 2519;
var historyitem_ShapeSetSpPr = 2520;
var historyitem_ShapeSetStyle = 2521;
var historyitem_ShapeSetTxBody = 2522;
var historyitem_ShapeSetTextBoxContent = 2523;
var historyitem_ShapeSetParent = 2524;
var historyitem_ShapeSetGroup = 2525;
var historyitem_ShapeSetBodyPr = 2526;
var historyitem_ShapeSetWordShape = 2527;
var historyitem_DispUnitsSetBuiltInUnit = 2526;
var historyitem_DispUnitsSetCustUnit = 2527;
var historyitem_DispUnitsSetDispUnitsLbl = 2528;
var historyitem_DispUnitsSetParent = 2529;
var historyitem_GroupShapeSetNvGrpSpPr = 2529;
var historyitem_GroupShapeSetSpPr = 2530;
var historyitem_GroupShapeAddToSpTree = 2531;
var historyitem_GroupShapeSetParent = 2532;
var historyitem_GroupShapeSetGroup = 2533;
var historyitem_GroupShapeRemoveFromSpTree = 2534;
var historyitem_ImageShapeSetNvPicPr = 2535;
var historyitem_ImageShapeSetSpPr = 2536;
var historyitem_ImageShapeSetBlipFill = 2537;
var historyitem_ImageShapeSetParent = 2538;
var historyitem_ImageShapeSetGroup = 2539;
var historyitem_ImageShapeSetStyle = 2540;
var historyitem_GeometrySetParent = 2540;
var historyitem_GeometryAddAdj = 2541;
var historyitem_GeometryAddGuide = 2542;
var historyitem_GeometryAddCnx = 2543;
var historyitem_GeometryAddHandleXY = 2544;
var historyitem_GeometryAddHandlePolar = 2545;
var historyitem_GeometryAddPath = 2546;
var historyitem_GeometryAddRect = 2547;
var historyitem_GeometrySetPreset = 2548;
var historyitem_PathSetStroke = 2549;
var historyitem_PathSetExtrusionOk = 2550;
var historyitem_PathSetFill = 2551;
var historyitem_PathSetPathH = 2552;
var historyitem_PathSetPathW = 2553;
var historyitem_PathAddPathCommand = 2554;
var historyitem_TextBodySetBodyPr = 2555;
var historyitem_TextBodySetLstStyle = 2557;
var historyitem_TextBodySetContent = 2558;
var historyitem_TextBodySetParent = 2559;
var historyitem_CatAxSetAuto = 2560;
var historyitem_CatAxSetAxId = 2561;
var historyitem_CatAxSetAxPos = 2562;
var historyitem_CatAxSetCrossAx = 2563;
var historyitem_CatAxSetCrosses = 2564;
var historyitem_CatAxSetCrossesAt = 2565;
var historyitem_CatAxSetDelete = 2566;
var historyitem_CatAxSetExtLst = 2567;
var historyitem_CatAxSetLblAlgn = 2568;
var historyitem_CatAxSetLblOffset = 2569;
var historyitem_CatAxSetMajorGridlines = 2570;
var historyitem_CatAxSetMajorTickMark = 2571;
var historyitem_CatAxSetMinorGridlines = 2572;
var historyitem_CatAxSetMinorTickMark = 2573;
var historyitem_CatAxSetNoMultiLvlLbl = 2574;
var historyitem_CatAxSetNumFmt = 2575;
var historyitem_CatAxSetScaling = 2576;
var historyitem_CatAxSetSpPr = 2577;
var historyitem_CatAxSetTickLblPos = 2578;
var historyitem_CatAxSetTickLblSkip = 2579;
var historyitem_CatAxSetTickMarkSkip = 2580;
var historyitem_CatAxSetTitle = 2581;
var historyitem_CatAxSetTxPr = 2582;
var historyitem_ValAxSetAxId = 2583;
var historyitem_ValAxSetAxPos = 2584;
var historyitem_ValAxSetCrossAx = 2585;
var historyitem_ValAxSetCrossBetween = 2586;
var historyitem_ValAxSetCrosses = 2587;
var historyitem_ValAxSetCrossesAt = 2588;
var historyitem_ValAxSetDelete = 2589;
var historyitem_ValAxSetDispUnits = 2590;
var historyitem_ValAxSetExtLst = 2591;
var historyitem_ValAxSetMajorGridlines = 2592;
var historyitem_ValAxSetMajorTickMark = 2593;
var historyitem_ValAxSetMajorUnit = 2594;
var historyitem_ValAxSetMinorGridlines = 2595;
var historyitem_ValAxSetMinorTickMark = 2596;
var historyitem_ValAxSetMinorUnit = 2597;
var historyitem_ValAxSetNumFmt = 2598;
var historyitem_ValAxSetScaling = 2599;
var historyitem_ValAxSetSpPr = 2600;
var historyitem_ValAxSetTickLblPos = 2601;
var historyitem_ValAxSetTitle = 2602;
var historyitem_ValAxSetTxPr = 2603;
var historyitem_ZIndexManagerRemoveItem = 2604;
var historyitem_ZIndexManagerAddItem = 2605;
var historyitem_WrapPolygonSetEdited = 2607;
var historyitem_WrapPolygonSetRelPoints = 2608;
var historyitem_WrapPolygonSetWrapSide = 2608;
var historyitem_DateAxAuto = 2609;
var historyitem_DateAxAxId = 2610;
var historyitem_DateAxAxPos = 2611;
var historyitem_DateAxBaseTimeUnit = 2612;
var historyitem_DateAxCrossAx = 2613;
var historyitem_DateAxCrosses = 2614;
var historyitem_DateAxCrossesAt = 2615;
var historyitem_DateAxDelete = 2616;
var historyitem_DateAxLblOffset = 2617;
var historyitem_DateAxMajorGridlines = 2618;
var historyitem_DateAxMajorTickMark = 2619;
var historyitem_DateAxMajorTimeUnit = 2620;
var historyitem_DateAxMajorUnit = 2621;
var historyitem_DateAxMinorGridlines = 2622;
var historyitem_DateAxMinorTickMark = 2623;
var historyitem_DateAxMinorTimeUnit = 2624;
var historyitem_DateAxMinorUnit = 2625;
var historyitem_DateAxNumFmt = 2626;
var historyitem_DateAxScaling = 2627;
var historyitem_DateAxSpPr = 2628;
var historyitem_DateAxTickLblPos = 2629;
var historyitem_DateAxTitle = 2630;
var historyitem_DateAxTxPr = 2631;
var historyitem_SlideSetComments = 2632;
var historyitem_SlideSetShow = 2633;
var historyitem_SlideSetShowPhAnim = 2634;
var historyitem_SlideSetShowMasterSp = 2635;
var historyitem_SlideSetLayout = 2636;
var historyitem_SlideSetNum = 2637;
var historyitem_SlideSetTiming = 2638;
var historyitem_SlideSetSize = 2639;
var historyitem_SlideSetBg = 2640;
var historyitem_SlideSetLocks = 2641;
var historyitem_SlideRemoveFromSpTree = 2642;
var historyitem_SlideAddToSpTree = 2643;
var historyitem_SlideSetCSldName = 2644;
var historyitem_SlideSetClrMapOverride = 2645;
var historyitem_PropLockerSetId = 2646;
var historyitem_SlideLayoutSetMaster = 2646;
var historyitem_SlideLayoutSetMatchingName = 2647;
var historyitem_SlideLayoutSetType = 2648;
var historyitem_SlideLayoutSetBg = 2649;
var historyitem_SlideLayoutSetCSldName = 2650;
var historyitem_SlideLayoutSetShow = 2651;
var historyitem_SlideLayoutSetShowPhAnim = 2652;
var historyitem_SlideLayoutSetShowMasterSp = 2653;
var historyitem_SlideLayoutSetClrMapOverride = 2654;
var historyitem_SlideLayoutAddToSpTree = 2655;
var historyitem_SlideLayoutSetSize = 2656;
var historyitem_SlideMasterAddToSpTree = 2656;
var historyitem_SlideMasterSetTheme = 2657;
var historyitem_SlideMasterSetBg = 2658;
var historyitem_SlideMasterSetTxStyles = 2659;
var historyitem_SlideMasterSetCSldName = 2660;
var historyitem_SlideMasterSetClrMapOverride = 2661;
var historyitem_SlideMasterAddLayout = 2662;
var historyitem_SlideMasterSetThemeIndex = 2663;
var historyitem_SlideMasterSetSize = 2664;
var historyitem_ThemeSetColorScheme = 2663;
var historyitem_ThemeSetFontScheme = 2664;
var historyitem_ThemeSetFmtScheme = 2665;
var historyitem_Presentation_AddSlide = 2666;
var historyitem_Presentation_RemoveSlide = 2667;
var historyitem_Presentation_SlideSize = 2668;
var historyitem_Presentation_AddSlideMaster = 2669;
var historyitem_Presentation_ChangeTheme = 2670;
var historyitem_Presentation_ChangeColorScheme = 2671;
var historyitem_GraphicFrameSetSpPr = 2672;
var historyitem_GraphicFrameSetGraphicObject = 2673;
var historyitem_GraphicFrameSetSetNvSpPr = 2674;
var historyitem_GraphicFrameSetSetParent = 2675;
var historyitem_GraphicFrameSetSetGroup = 2676;
var historyitem_SlideCommentsAddComment = 2677;
var historyitem_SlideCommentsRemoveComment = 2678;
var historyitem_SerAxSetAxId = 2632;
var historyitem_SerAxSetAxPos = 2633;
var historyitem_SerAxSetCrossAx = 2634;
var historyitem_SerAxSetCrosses = 2635;
var historyitem_SerAxSetCrossesAt = 2636;
var historyitem_SerAxSetDelete = 2637;
var historyitem_SerAxSetMajorGridlines = 2638;
var historyitem_SerAxSetMajorTickMark = 2639;
var historyitem_SerAxSetMinorGridlines = 2640;
var historyitem_SerAxSetMinorTickMark = 2641;
var historyitem_SerAxSetNumFmt = 2642;
var historyitem_SerAxSetScaling = 2643;
var historyitem_SerAxSetSpPr = 2644;
var historyitem_SerAxSetTickLblPos = 2645;
var historyitem_SerAxSetTickLblSkip = 2646;
var historyitem_SerAxSetTickMarkSkip = 2647;
var historyitem_SerAxSetTitle = 2648;
var historyitem_SerAxSetTxPr = 2649;
var historyitem_type_ColorMod = 1001;
var historyitem_type_ColorModifiers = 1002;
var historyitem_type_SysColor = 1003;
var historyitem_type_PrstColor = 1004;
var historyitem_type_RGBColor = 1005;
var historyitem_type_SchemeColor = 1006;
var historyitem_type_UniColor = 1007;
var historyitem_type_SrcRect = 1008;
var historyitem_type_BlipFill = 1009;
var historyitem_type_SolidFill = 1010;
var historyitem_type_Gs = 1011;
var historyitem_type_GradLin = 1012;
var historyitem_type_GradPath = 1013;
var historyitem_type_GradFill = 1014;
var historyitem_type_PathFill = 1015;
var historyitem_type_NoFill = 1016;
var historyitem_type_UniFill = 1017;
var historyitem_type_EndArrow = 1018;
var historyitem_type_LineJoin = 1019;
var historyitem_type_Ln = 1020;
var historyitem_type_DefaultShapeDefinition = 1021;
var historyitem_type_CNvPr = 1022;
var historyitem_type_NvPr = 1023;
var historyitem_type_Ph = 1024;
var historyitem_type_UniNvPr = 1025;
var historyitem_type_StyleRef = 1026;
var historyitem_type_FontRef = 1027;
var historyitem_type_Chart = 1028;
var historyitem_type_ChartSpace = 1029;
var historyitem_type_Legend = 1030;
var historyitem_type_Layout = 1031;
var historyitem_type_LegendEntry = 1032;
var historyitem_type_PivotFmt = 1033;
var historyitem_type_DLbl = 1034;
var historyitem_type_Marker = 1035;
var historyitem_type_PlotArea = 1036;
var historyitem_type_Axis = 1037;
var historyitem_type_NumFmt = 1038;
var historyitem_type_Scaling = 1039;
var historyitem_type_DTable = 1040;
var historyitem_type_LineChart = 1041;
var historyitem_type_DLbls = 1042;
var historyitem_type_UpDownBars = 1043;
var historyitem_type_BarChart = 1044;
var historyitem_type_BubbleChart = 1045;
var historyitem_type_DoughnutChart = 1046;
var historyitem_type_OfPieChart = 1047;
var historyitem_type_PieChart = 1048;
var historyitem_type_RadarChart = 1049;
var historyitem_type_ScatterChart = 1050;
var historyitem_type_StockChart = 1051;
var historyitem_type_SurfaceChart = 1052;
var historyitem_type_BandFmt = 1053;
var historyitem_type_AreaChart = 1054;
var historyitem_type_ScatterSer = 1055;
var historyitem_type_DPt = 1056;
var historyitem_type_ErrBars = 1057;
var historyitem_type_MinusPlus = 1058;
var historyitem_type_NumLit = 1059;
var historyitem_type_NumericPoint = 1060;
var historyitem_type_NumRef = 1061;
var historyitem_type_TrendLine = 1062;
var historyitem_type_Tx = 1063;
var historyitem_type_StrRef = 1064;
var historyitem_type_StrCache = 1065;
var historyitem_type_StrPoint = 1066;
var historyitem_type_XVal = 1067;
var historyitem_type_MultiLvlStrRef = 1068;
var historyitem_type_MultiLvlStrCache = 1068;
var historyitem_type_StringLiteral = 1069;
var historyitem_type_YVal = 1070;
var historyitem_type_AreaSeries = 1071;
var historyitem_type_Cat = 1072;
var historyitem_type_PictureOptions = 1073;
var historyitem_type_RadarSeries = 1074;
var historyitem_type_BarSeries = 1075;
var historyitem_type_LineSeries = 1076;
var historyitem_type_PieSeries = 1077;
var historyitem_type_SurfaceSeries = 1078;
var historyitem_type_BubbleSeries = 1079;
var historyitem_type_ExternalData = 1080;
var historyitem_type_PivotSource = 1081;
var historyitem_type_Protection = 1082;
var historyitem_type_ChartWall = 1083;
var historyitem_type_View3d = 1084;
var historyitem_type_ChartText = 1085;
var historyitem_type_ShapeStyle = 1086;
var historyitem_type_Xfrm = 1087;
var historyitem_type_SpPr = 1088;
var historyitem_type_ClrScheme = 1089;
var historyitem_type_ClrMap = 1090;
var historyitem_type_ExtraClrScheme = 1091;
var historyitem_type_FontCollection = 1092;
var historyitem_type_FontScheme = 1093;
var historyitem_type_FormatScheme = 1094;
var historyitem_type_ThemeElements = 1095;
var historyitem_type_HF = 1096;
var historyitem_type_BgPr = 1097;
var historyitem_type_Bg = 1098;
var historyitem_type_PrintSettings = 1099;
var historyitem_type_HeaderFooterChart = 1100;
var historyitem_type_PageMarginsChart = 1101;
var historyitem_type_PageSetup = 1102;
var historyitem_type_Shape = 1103;
var historyitem_type_DispUnits = 1104;
var historyitem_type_GroupShape = 1105;
var historyitem_type_ImageShape = 1106;
var historyitem_type_Geometry = 1107;
var historyitem_type_Path = 1108;
var historyitem_type_TextBody = 1109;
var historyitem_type_CatAx = 1110;
var historyitem_type_ValAx = 1111;
var historyitem_type_WrapPolygon = 1112;
var historyitem_type_DateAx = 1113;
var historyitem_type_SerAx = 1114;
var historyitem_type_Title = 1115;
var historyitem_type_Slide = 1116;
var historyitem_type_SlideLayout = 1117;
var historyitem_type_SlideMaster = 1118;
var historyitem_type_SlideComments = 1119;
var historyitem_type_PropLocker = 1120;
var historyitem_type_Theme = 1121;
var historyitem_type_GraphicFrame = 1122;
var historyitem_Document_AddItem = 1;
var historyitem_Document_RemoveItem = 2;
var historyitem_Document_Margin = 3;
var historyitem_Document_PageSize = 4;
var historyitem_Document_Orientation = 5;
var historyitem_Document_DefaultTab = 6;
var historyitem_Document_EvenAndOddHeaders = 7;
var historyitem_Document_DefaultLanguage = 8;
var historyitem_Paragraph_AddItem = 1;
var historyitem_Paragraph_RemoveItem = 2;
var historyitem_Paragraph_Numbering = 3;
var historyitem_Paragraph_Align = 4;
var historyitem_Paragraph_Ind_First = 5;
var historyitem_Paragraph_Ind_Right = 6;
var historyitem_Paragraph_Ind_Left = 7;
var historyitem_Paragraph_ContextualSpacing = 8;
var historyitem_Paragraph_KeepLines = 9;
var historyitem_Paragraph_KeepNext = 10;
var historyitem_Paragraph_PageBreakBefore = 11;
var historyitem_Paragraph_Spacing_Line = 12;
var historyitem_Paragraph_Spacing_LineRule = 13;
var historyitem_Paragraph_Spacing_Before = 14;
var historyitem_Paragraph_Spacing_After = 15;
var historyitem_Paragraph_Spacing_AfterAutoSpacing = 16;
var historyitem_Paragraph_Spacing_BeforeAutoSpacing = 17;
var historyitem_Paragraph_Shd_Value = 18;
var historyitem_Paragraph_Shd_Color = 19;
var historyitem_Paragraph_Shd_Unifill = 20;
var historyitem_Paragraph_WidowControl = 21;
var historyitem_Paragraph_Tabs = 22;
var historyitem_Paragraph_PStyle = 23;
var historyitem_Paragraph_DocNext = 24;
var historyitem_Paragraph_DocPrev = 25;
var historyitem_Paragraph_Parent = 26;
var historyitem_Paragraph_Borders_Between = 27;
var historyitem_Paragraph_Borders_Bottom = 28;
var historyitem_Paragraph_Borders_Left = 29;
var historyitem_Paragraph_Borders_Right = 30;
var historyitem_Paragraph_Borders_Top = 31;
var historyitem_Paragraph_Pr = 32;
var historyitem_Paragraph_PresentationPr_Bullet = 33;
var historyitem_Paragraph_PresentationPr_Level = 34;
var historyitem_Paragraph_FramePr = 35;
var historyitem_Paragraph_Shd = 36;
var historyitem_Paragraph_SectionPr = 37;
var historyitem_ParaRun_AddItem = 1;
var historyitem_ParaRun_RemoveItem = 2;
var historyitem_ParaRun_Bold = 3;
var historyitem_ParaRun_Italic = 4;
var historyitem_ParaRun_Strikeout = 5;
var historyitem_ParaRun_Underline = 6;
var historyitem_ParaRun_FontFamily = 7;
var historyitem_ParaRun_FontSize = 8;
var historyitem_ParaRun_Color = 9;
var historyitem_ParaRun_VertAlign = 10;
var historyitem_ParaRun_HighLight = 11;
var historyitem_ParaRun_RStyle = 12;
var historyitem_ParaRun_Spacing = 13;
var historyitem_ParaRun_DStrikeout = 14;
var historyitem_ParaRun_Caps = 15;
var historyitem_ParaRun_SmallCaps = 16;
var historyitem_ParaRun_Position = 17;
var historyitem_ParaRun_Value = 18;
var historyitem_ParaRun_RFonts = 19;
var historyitem_ParaRun_Lang = 20;
var historyitem_ParaRun_RFonts_Ascii = 21;
var historyitem_ParaRun_RFonts_HAnsi = 22;
var historyitem_ParaRun_RFonts_CS = 23;
var historyitem_ParaRun_RFonts_EastAsia = 24;
var historyitem_ParaRun_RFonts_Hint = 25;
var historyitem_ParaRun_Lang_Bidi = 26;
var historyitem_ParaRun_Lang_EastAsia = 27;
var historyitem_ParaRun_Lang_Val = 28;
var historyitem_ParaRun_TextPr = 29;
var historyitem_ParaRun_Unifill = 30;
var historyitem_ParaRun_Shd = 31;
var historyitem_ParaRun_MathStyle = 32;
var historyitem_ParaRun_MathPrp = 33;
var historyitem_TextPr_Change = 1;
var historyitem_TextPr_Bold = 2;
var historyitem_TextPr_Italic = 3;
var historyitem_TextPr_Strikeout = 4;
var historyitem_TextPr_Underline = 5;
var historyitem_TextPr_FontFamily = 6;
var historyitem_TextPr_FontSize = 7;
var historyitem_TextPr_Color = 8;
var historyitem_TextPr_VertAlign = 9;
var historyitem_TextPr_HighLight = 10;
var historyitem_TextPr_RStyle = 11;
var historyitem_TextPr_Spacing = 12;
var historyitem_TextPr_DStrikeout = 13;
var historyitem_TextPr_Caps = 14;
var historyitem_TextPr_SmallCaps = 15;
var historyitem_TextPr_Position = 16;
var historyitem_TextPr_Value = 17;
var historyitem_TextPr_RFonts = 18;
var historyitem_TextPr_Lang = 19;
var historyitem_TextPr_RFonts_Ascii = 20;
var historyitem_TextPr_RFonts_HAnsi = 21;
var historyitem_TextPr_RFonts_CS = 22;
var historyitem_TextPr_RFonts_EastAsia = 23;
var historyitem_TextPr_RFonts_Hint = 24;
var historyitem_TextPr_Lang_Bidi = 25;
var historyitem_TextPr_Lang_EastAsia = 26;
var historyitem_TextPr_Lang_Val = 27;
var historyitem_TextPr_Unifill = 28;
var historyitem_TextPr_FontSizeCS = 29;
var historyitem_Drawing_Size = 1;
var historyitem_Drawing_Url = 2;
var historyitem_Drawing_DrawingType = 3;
var historyitem_Drawing_WrappingType = 4;
var historyitem_Drawing_Distance = 5;
var historyitem_Drawing_AllowOverlap = 6;
var historyitem_Drawing_PositionH = 7;
var historyitem_Drawing_PositionV = 8;
var historyitem_Drawing_BehindDoc = 10;
var historyitem_Drawing_SetGraphicObject = 11;
var historyitem_SetSimplePos = 12;
var historyitem_SetExtent = 13;
var historyitem_SetWrapPolygon = 14;
var historyitem_DrawingObjects_AddItem = 1;
var historyitem_DrawingObjects_RemoveItem = 2;
var historyitem_FlowObjects_AddItem = 1;
var historyitem_FlowObjects_RemoveItem = 2;
var historyitem_FlowImage_Position = 1;
var historyitem_FlowImage_Size = 2;
var historyitem_FlowImage_Paddings = 3;
var historyitem_FlowImage_PageNum = 4;
var historyitem_FlowImage_Url = 5;
var historyitem_FlowImage_Parent = 6;
var historyitem_Table_DocNext = 1;
var historyitem_Table_DocPrev = 2;
var historyitem_Table_Parent = 3;
var historyitem_Table_TableW = 4;
var historyitem_Table_TableCellMar = 5;
var historyitem_Table_TableAlign = 6;
var historyitem_Table_TableInd = 7;
var historyitem_Table_TableBorder_Left = 8;
var historyitem_Table_TableBorder_Top = 9;
var historyitem_Table_TableBorder_Right = 10;
var historyitem_Table_TableBorder_Bottom = 11;
var historyitem_Table_TableBorder_InsideH = 12;
var historyitem_Table_TableBorder_InsideV = 13;
var historyitem_Table_TableShd = 14;
var historyitem_Table_Inline = 15;
var historyitem_Table_AddRow = 16;
var historyitem_Table_RemoveRow = 17;
var historyitem_Table_TableGrid = 18;
var historyitem_Table_TableLook = 19;
var historyitem_Table_TableStyleRowBandSize = 20;
var historyitem_Table_TableStyleColBandSize = 21;
var historyitem_Table_TableStyle = 22;
var historyitem_Table_AllowOverlap = 23;
var historyitem_Table_PositionH = 24;
var historyitem_Table_PositionV = 25;
var historyitem_Table_Distance = 26;
var historyitem_Table_Pr = 27;
var historyitem_Table_TableLayout = 28;
var historyitem_TableRow_Before = 1;
var historyitem_TableRow_After = 2;
var historyitem_TableRow_CellSpacing = 3;
var historyitem_TableRow_Height = 4;
var historyitem_TableRow_AddCell = 5;
var historyitem_TableRow_RemoveCell = 6;
var historyitem_TableRow_TableHeader = 7;
var historyitem_TableRow_Pr = 8;
var historyitem_TableCell_GridSpan = 1;
var historyitem_TableCell_Margins = 2;
var historyitem_TableCell_Shd = 3;
var historyitem_TableCell_VMerge = 4;
var historyitem_TableCell_Border_Left = 5;
var historyitem_TableCell_Border_Right = 6;
var historyitem_TableCell_Border_Top = 7;
var historyitem_TableCell_Border_Bottom = 8;
var historyitem_TableCell_VAlign = 9;
var historyitem_TableCell_W = 10;
var historyitem_TableCell_Pr = 11;
var historyitem_DocumentContent_AddItem = 1;
var historyitem_DocumentContent_RemoveItem = 2;
var historyitem_FlowTable_Position = 1;
var historyitem_FlowTable_Paddings = 2;
var historyitem_FlowTable_PageNum = 3;
var historyitem_FlowTable_Parent = 4;
var historyitem_HdrFtrController_AddItem = 1;
var historyitem_HdrFtrController_RemoveItem = 2;
var historyitem_HdrFtr_BoundY2 = 1;
var historyitem_AbstractNum_LvlChange = 1;
var historyitem_AbstractNum_TextPrChange = 2;
var historyitem_TableId_Add = 1;
var historyitem_TableId_Reset = 2;
var historyitem_TableId_Description = 65535;
var historyitem_Comments_Add = 1;
var historyitem_Comments_Remove = 2;
var historyitem_Comment_Change = 3;
var historyitem_Comment_TypeInfo = 4;
var historyitem_Comment_Position = 5;
var historyitem_ParaComment_CommentId = 1;
var historyitem_Hyperlink_Value = 1;
var historyitem_Hyperlink_ToolTip = 2;
var historyitem_Hyperlink_AddItem = 3;
var historyitem_Hyperlink_RemoveItem = 4;
var historyitem_AddNewGraphicObject = 0;
var historyitem_RemoveGraphicObject = 1;
var historyitem_ChangeColorScheme = 1;
var historyitem_AddHdr = 0;
var historyitem_AddFtr = 1;
var historyitem_RemoveHdr = 2;
var historyitem_RemoveFtr = 3;
var historyitem_InternalChanges = 6;
var historyitem_GroupRecalculate = 32;
var historyitem_Style_TextPr = 1;
var historyitem_Style_ParaPr = 2;
var historyitem_Style_TablePr = 3;
var historyitem_Style_TableRowPr = 4;
var historyitem_Style_TableCellPr = 5;
var historyitem_Style_TableBand1Horz = 6;
var historyitem_Style_TableBand1Vert = 7;
var historyitem_Style_TableBand2Horz = 8;
var historyitem_Style_TableBand2Vert = 9;
var historyitem_Style_TableFirstCol = 10;
var historyitem_Style_TableFirstRow = 11;
var historyitem_Style_TableLastCol = 12;
var historyitem_Style_TableLastRow = 13;
var historyitem_Style_TableTLCell = 14;
var historyitem_Style_TableTRCell = 15;
var historyitem_Style_TableBLCell = 16;
var historyitem_Style_TableBRCell = 17;
var historyitem_Style_TableWholeTable = 18;
var historyitem_Style_Name = 101;
var historyitem_Style_BasedOn = 102;
var historyitem_Style_Next = 103;
var historyitem_Style_Type = 104;
var historyitem_Style_QFormat = 105;
var historyitem_Style_UiPriority = 106;
var historyitem_Style_Hidden = 107;
var historyitem_Style_SemiHidden = 108;
var historyitem_Style_UnhideWhenUsed = 109;
var historyitem_Styles_Add = 1;
var historyitem_Styles_Remove = 2;
var historyitem_Section_PageSize_Orient = 1;
var historyitem_Section_PageSize_Size = 2;
var historyitem_Section_PageMargins = 3;
var historyitem_Section_Type = 4;
var historyitem_Section_Borders_Left = 5;
var historyitem_Section_Borders_Top = 6;
var historyitem_Section_Borders_Right = 7;
var historyitem_Section_Borders_Bottom = 8;
var historyitem_Section_Borders_Display = 9;
var historyitem_Section_Borders_OffsetFrom = 10;
var historyitem_Section_Borders_ZOrder = 11;
var historyitem_Section_Header_First = 12;
var historyitem_Section_Header_Even = 13;
var historyitem_Section_Header_Default = 14;
var historyitem_Section_Footer_First = 15;
var historyitem_Section_Footer_Even = 16;
var historyitem_Section_Footer_Default = 17;
var historyitem_Section_TitlePage = 18;
var historyitem_Section_PageMargins_Header = 19;
var historyitem_Section_PageMargins_Footer = 20;
var historyitem_Section_PageNumType_Start = 21;
var historyitem_Section_Columns_EqualWidth = 22;
var historyitem_Section_Columns_Space = 23;
var historyitem_Section_Columns_Num = 24;
var historyitem_Section_Columns_Sep = 25;
var historyitem_Section_Columns_Col = 26;
var historyitem_State_Unknown = 0;
var historyitem_State_Document = 1;
var historyitem_State_DocumentContent = 2;
var historyitem_State_Paragraph = 3;
var historyitem_State_Table = 4;
var historyrecalctype_Inline = 0;
var historyrecalctype_Flow = 1;
var historyrecalctype_HdrFtr = 2;
var historyrecalctype_Drawing = 3;
var historyitem_type_Unknown = 0;
var historyitem_type_TableId = 1;
var historyitem_type_Document = 2;
var historyitem_type_Paragraph = 3;
var historyitem_type_TextPr = 4;
var historyitem_type_Drawing = 5;
var historyitem_type_DrawingObjects = 6;
var historyitem_type_FlowObjects = 7;
var historyitem_type_FlowImage = 8;
var historyitem_type_Table = 9;
var historyitem_type_TableRow = 10;
var historyitem_type_TableCell = 11;
var historyitem_type_DocumentContent = 12;
var historyitem_type_FlowTable = 13;
var historyitem_type_HdrFtrController = 14;
var historyitem_type_HdrFtr = 15;
var historyitem_type_AbstractNum = 16;
var historyitem_type_Comment = 17;
var historyitem_type_Comments = 18;
var historyitem_type_Image = 19;
var historyitem_type_GrObjects = 20;
var historyitem_type_Hyperlink = 21;
var historyitem_type_Style = 23;
var historyitem_type_Styles = 24;
var historyitem_type_ChartTitle = 25;
var historyitem_type_Math = 26;
var historyitem_type_CommentMark = 27;
var historyitem_type_ParaRun = 28;
var historyitem_type_MathContent = 29;
var historyitem_type_Section = 30;
var historyitem_type_acc = 31;
var historyitem_type_bar = 32;
var historyitem_type_borderBox = 33;
var historyitem_type_box = 34;
var historyitem_type_delimiter = 35;
var historyitem_type_eqArr = 36;
var historyitem_type_frac = 37;
var historyitem_type_mathFunc = 38;
var historyitem_type_groupChr = 39;
var historyitem_type_lim = 40;
var historyitem_type_matrix = 41;
var historyitem_type_nary = 42;
var historyitem_type_integral = 43;
var historyitem_type_double_integral = 44;
var historyitem_type_triple_integral = 45;
var historyitem_type_contour_integral = 46;
var historyitem_type_surface_integral = 47;
var historyitem_type_volume_integral = 48;
var historyitem_type_phant = 49;
var historyitem_type_rad = 50;
var historyitem_type_deg_subsup = 51;
var historyitem_type_iterators = 52;
var historyitem_type_deg = 53;
var historyitem_type_ParaComment = 54;
var historydescription_Cut = 1;
var historydescription_PasteButtonIE = 2;
var historydescription_PasteButtonNotIE = 3;
var historydescription_ChartDrawingObjects = 4;
var historydescription_CommonControllerCheckChartText = 5;
var historydescription_CommonControllerUnGroup = 6;
var historydescription_CommonControllerCheckSelected = 7;
var historydescription_CommonControllerSetGraphicObject = 8;
var historydescription_CommonStatesAddNewShape = 9;
var historydescription_CommonStatesRotate = 10;
var historydescription_PasteNative = 11;
var historydescription_Document_SetDefaultLanguage = 12;
var historydescription_Document_ChangeColorScheme = 13;
var historydescription_Document_AddChart = 14;
var historydescription_Document_EditChart = 15;
var historydescription_Document_DragText = 16;
var historydescription_Document_DocumentContentExtendToPos = 17;
var historydescription_Document_AddHeader = 18;
var historydescription_Document_AddFooter = 19;
var historydescription_Document_ParagraphExtendToPos = 20;
var historydescription_Document_ParagraphChangeFrame = 21;
var historydescription_Document_ReplaceAll = 22;
var historydescription_Document_ReplaceSingle = 23;
var historydescription_Document_TableAddNewRowByTab = 24;
var historydescription_Document_AddNewShape = 24;
var historydescription_Document_EditWrapPolygon = 25;
var historydescription_Document_MoveInlineObject = 26;
var historydescription_Document_CopyAndMoveInlineObject = 27;
var historydescription_Document_DrawingChangeAdj = 28;
var historydescription_Document_RotateInlineDrawing = 29;
var historydescription_Document_RotateFlowDrawingNoCtrl = 30;
var historydescription_Document_RotateFlowDrawingCtrl = 31;
var historydescription_Document_MoveInGroup = 32;
var historydescription_Document_ChangeWrapContour = 33;
var historydescription_Document_ChangeWrapContourAddPoint = 34;
var historydescription_Document_GrObjectsBringToFront = 35;
var historydescription_Document_GrObjectsBringForward = 36;
var historydescription_Document_GrObjectsSendToBack = 37;
var historydescription_Document_GrObjectsBringBackward = 38;
var historydescription_Document_GrObjectsGroup = 39;
var historydescription_Document_GrObjectsUnGroup = 40;
var historydescription_Document_GrObjectsChangeWrapPolygon = 41;
var historydescription_Document_MathAutoCorrect = 42;
var historydescription_Document_SetFramePrWithFontFamily = 43;
var historydescription_Document_SetFramePr = 44;
var historydescription_Document_SetFramePrWithFontFamilyLong = 45;
var historydescription_Document_SetFontName = 46;
var historydescription_Document_SetFontSize = 47;
var historydescription_Document_SetBold = 48;
var historydescription_Document_SetItalic = 49;
var historydescription_Document_SetUnderline = 50;
var historydescription_Document_SetStrikeout = 51;
var historydescription_Document_SetDStrikeout = 52;
var historydescription_Document_SetTextSpacing = 53;
var historydescription_Document_SetCaps = 54;
var historydescription_Document_SetSmallCaps = 55;
var historydescription_Document_SetTextPosition = 56;
var historydescription_Document_SetTextLang = 57;
var historydescription_Document_SetLineSpacing = 58;
var historydescription_Document_SetLineSpacingBeforeAfter = 59;
var historydescription_Document_IncFontSize = 60;
var historydescription_Document_DecFontSize = 61;
var historydescription_Document_SetParagraphBorders = 62;
var historydescription_Document_SetParagraphPr = 63;
var historydescription_Document_SetParagraphAlign = 64;
var historydescription_Document_SetTextVertAlign = 65;
var historydescription_Document_SetParagraphNumbering = 66;
var historydescription_Document_SetParagraphStyle = 67;
var historydescription_Document_SetParagraphPageBreakBefore = 68;
var historydescription_Document_SetParagraphWidowControl = 69;
var historydescription_Document_SetParagraphKeepLines = 70;
var historydescription_Document_SetParagraphKeepNext = 71;
var historydescription_Document_SetParagraphContextualSpacing = 72;
var historydescription_Document_SetTextHighlightNone = 73;
var historydescription_Document_SetTextHighlightColor = 74;
var historydescription_Document_SetTextColor = 75;
var historydescription_Document_SetParagraphShd = 76;
var historydescription_Document_SetParagraphIndent = 77;
var historydescription_Document_IncParagraphIndent = 78;
var historydescription_Document_DecParagraphIndent = 79;
var historydescription_Document_SetParagraphIndentRight = 80;
var historydescription_Document_SetParagraphIndentFirstLine = 81;
var historydescription_Document_SetPageOrientation = 82;
var historydescription_Document_SetPageSize = 83;
var historydescription_Document_AddPageBreak = 84;
var historydescription_Document_AddPageNumToHdrFtr = 85;
var historydescription_Document_AddPageNumToCurrentPos = 86;
var historydescription_Document_SetHdrFtrDistance = 87;
var historydescription_Document_SetHdrFtrFirstPage = 88;
var historydescription_Document_SetHdrFtrEvenAndOdd = 89;
var historydescription_Document_SetHdrFtrLink = 90;
var historydescription_Document_AddTable = 91;
var historydescription_Document_TableAddRowAbove = 92;
var historydescription_Document_TableAddRowBelow = 93;
var historydescription_Document_TableAddColumnLeft = 94;
var historydescription_Document_TableAddColumnRight = 95;
var historydescription_Document_TableRemoveRow = 96;
var historydescription_Document_TableRemoveColumn = 97;
var historydescription_Document_RemoveTable = 98;
var historydescription_Document_MergeTableCells = 99;
var historydescription_Document_SplitTableCells = 100;
var historydescription_Document_ApplyTablePr = 101;
var historydescription_Document_AddImageUrl = 102;
var historydescription_Document_AddImageUrlLong = 103;
var historydescription_Document_ApplyImagePrWithUrl = 104;
var historydescription_Document_ApplyImagePrWithUrlLong = 105;
var historydescription_Document_ApplyImagePrWithFillUrl = 106;
var historydescription_Document_ApplyImagePrWithFillUrlLong = 107;
var historydescription_Document_ApplyImagePr = 108;
var historydescription_Document_AddHyperlink = 109;
var historydescription_Document_ChangeHyperlink = 110;
var historydescription_Document_RemoveHyperlink = 111;
var historydescription_Document_ReplaceMisspelledWord = 112;
var historydescription_Document_AddComment = 113;
var historydescription_Document_RemoveComment = 114;
var historydescription_Document_ChangeComment = 115;
var historydescription_Document_SetTextFontNameLong = 116;
var historydescription_Document_AddImage = 117;
var historydescription_Document_ClearFormatting = 118;
var historydescription_Document_AddSectionBreak = 119;
var historydescription_Document_AddMath = 120;
var historydescription_Document_SetParagraphTabs = 121;
var historydescription_Document_SetParagraphIndentFromRulers = 122;
var historydescription_Document_SetDocumentMargin_Hor = 123;
var historydescription_Document_SetTableMarkup_Hor = 124;
var historydescription_Document_SetDocumentMargin_Ver = 125;
var historydescription_Document_SetHdrFtrBounds = 126;
var historydescription_Document_SetTableMarkup_Ver = 127;
var historydescription_Document_MoveInlineTable = 128;
var historydescription_Document_MoveFlowTable = 129;
var historydescription_Document_DocumentExtendToPos = 130;
var historydescription_Document_AddDropCap = 131;
var historydescription_Document_RemoveDropCap = 132;
var historydescription_Document_SetTextHighlight = 133;
var historydescription_Document_BackSpaceButton = 134;
var historydescription_Document_MoveParagraphByTab = 135;
var historydescription_Document_AddTab = 136;
var historydescription_Document_EnterButton = 137;
var historydescription_Document_SpaceButton = 138;
var historydescription_Document_ShiftInsert = 139;
var historydescription_Document_ShiftInsertSafari = 140;
var historydescription_Document_DeleteButton = 141;
var historydescription_Document_ShiftDeleteButton = 142;
var historydescription_Document_SetStyleHeading1 = 143;
var historydescription_Document_SetStyleHeading2 = 144;
var historydescription_Document_SetStyleHeading3 = 145;
var historydescription_Document_SetTextStrikeoutHotKey = 146;
var historydescription_Document_SetTextBoldHotKey = 147;
var historydescription_Document_SetParagraphAlignHotKey = 148;
var historydescription_Document_AddEuroLetter = 149;
var historydescription_Document_SetTextItalicHotKey = 150;
var historydescription_Document_SetParagraphAlignHotKey2 = 151;
var historydescription_Document_SetParagraphAlignHotKey3 = 152;
var historydescription_Document_SetParagraphNumberingHotKey = 153;
var historydescription_Document_AddPageNumHotKey = 154;
var historydescription_Document_SetParagraphAlignHotKey4 = 155;
var historydescription_Document_SetTextUnderlineHotKey = 156;
var historydescription_Document_FormatPasteHotKey = 157;
var historydescription_Document_PasteHotKey = 158;
var historydescription_Document_PasteSafariHotKey = 159;
var historydescription_Document_CurHotKey = 160;
var historydescription_Document_SetTextVertAlignHotKey = 161;
var historydescription_Document_AddMathHotKey = 162;
var historydescription_Document_SetTextVertAlignHotKey2 = 163;
var historydescription_Document_MinusButton = 164;
var historydescription_Document_SetTextVertAlignHotKey3 = 165;
var historydescription_Document_AddLetter = 166;
var historydescription_Document_MoveTableBorder = 167;
var historydescription_Document_FormatPasteHotKey2 = 168;
var historydescription_Document_SetTextHighlight2 = 169;
var historydescription_Document_AddTextFromTextBox = 170;
var historydescription_Spreadsheet_SetCellFontName = 176;
var historydescription_Spreadsheet_SetCellFontSize = 177;
var historydescription_Spreadsheet_SetCellBold = 178;
var historydescription_Spreadsheet_SetCellItalic = 179;
var historydescription_Spreadsheet_SetCellUnderline = 180;
var historydescription_Spreadsheet_SetCellStrikeout = 181;
var historydescription_Spreadsheet_SetCellSubscript = 182;
var historydescription_Spreadsheet_SetCellSuperscript = 183;
var historydescription_Spreadsheet_SetCellAlign = 184;
var historydescription_Spreadsheet_SetCellVertAlign = 185;
var historydescription_Spreadsheet_SetCellTextColor = 186;
var historydescription_Spreadsheet_SetCellBackgroundColor = 187;
var historydescription_Spreadsheet_SetCellIncreaseFontSize = 188;
var historydescription_Spreadsheet_SetCellDecreaseFontSize = 189;
var historydescription_Spreadsheet_SetCellHyperlinkAdd = 190;
var historydescription_Spreadsheet_SetCellHyperlinkModify = 191;
var historydescription_Spreadsheet_SetCellHyperlinkRemove = 192;
var historydescription_Spreadsheet_EditChart = 193;
var historydescription_Spreadsheet_Remove = 194;
var historydescription_Spreadsheet_AddTab = 195;
var historydescription_Spreadsheet_AddNewParagraph = 196;
var historydescription_Spreadsheet_AddSpace = 197;
var historydescription_Spreadsheet_AddItem = 198;
var historydescription_Spreadsheet_PutPrLineSpacing = 199;
var historydescription_Spreadsheet_SetParagraphSpacing = 200;
var historydescription_Spreadsheet_SetGraphicObjectsProps = 201;
var historydescription_Spreadsheet_ParaApply = 202;
var historydescription_Spreadsheet_GraphicObjectLayer = 203;
var historydescription_Spreadsheet_ParagraphAdd = 204;
var historydescription_Spreadsheet_CreateGroup = 205;
var historydescription_CommonDrawings_ChangeAdj = 206;
var historydescription_CommonDrawings_EndTrack = 207;
var historydescription_CommonDrawings_CopyCtrl = 208;
var historydescription_Presentation_ParaApply = 209;
var historydescription_Presentation_ParaFormatPaste = 210;
var historydescription_Presentation_AddNewParagraph = 211;
var historydescription_Presentation_CreateGroup = 212;
var historydescription_Presentation_UnGroup = 213;
var historydescription_Presentation_AddChart = 214;
var historydescription_Presentation_EditChart = 215;
var historydescription_Presentation_ParagraphAdd = 216;
var historydescription_Presentation_ParagraphClearFormatting = 217;
var historydescription_Presentation_SetParagraphAlign = 218;
var historydescription_Presentation_SetParagraphSpacing = 219;
var historydescription_Presentation_SetParagraphTabs = 220;
var historydescription_Presentation_SetParagraphIndent = 221;
var historydescription_Presentation_SetParagraphNumbering = 222;
var historydescription_Presentation_ParagraphIncDecFontSize = 223;
var historydescription_Presentation_ParagraphIncDecIndent = 224;
var historydescription_Presentation_SetImageProps = 225;
var historydescription_Presentation_SetShapeProps = 226;
var historydescription_Presentation_ChartApply = 227;
var historydescription_Presentation_ChangeShapeType = 228;
var historydescription_Presentation_SetVerticalAlign = 229;
var historydescription_Presentation_HyperlinkAdd = 230;
var historydescription_Presentation_HyperlinkModify = 231;
var historydescription_Presentation_HyperlinkRemove = 232;
var historydescription_Presentation_DistHor = 233;
var historydescription_Presentation_DistVer = 234;
var historydescription_Presentation_BringToFront = 235;
var historydescription_Presentation_BringForward = 236;
var historydescription_Presentation_SendToBack = 237;
var historydescription_Presentation_BringBackward = 239;
var historydescription_Presentation_ApplyTiming = 240;
var historydescription_Presentation_MoveSlidesToEnd = 241;
var historydescription_Presentation_MoveSlidesNextPos = 242;
var historydescription_Presentation_MoveSlidesPrevPos = 243;
var historydescription_Presentation_MoveSlidesToStart = 244;
var historydescription_Presentation_MoveComments = 245;
var historydescription_Presentation_TableBorder = 246;
var historydescription_Presentation_AddFlowImage = 247;
var historydescription_Presentation_AddFlowTable = 248;
var historydescription_Presentation_ChangeBackground = 249;
var historydescription_Presentation_AddNextSlide = 250;
var historydescription_Presentation_ShiftSlides = 251;
var historydescription_Presentation_DeleteSlides = 252;
var historydescription_Presentation_ChangeLayout = 253;
var historydescription_Presentation_ChangeSlideSize = 254;
var historydescription_Presentation_ChangeColorScheme = 255;
var historydescription_Presentation_AddComment = 256;
var historydescription_Presentation_ChangeComment = 257;
var historydescription_Presentation_PutTextPrFontName = 258;
var historydescription_Presentation_PutTextPrFontSize = 259;
var historydescription_Presentation_PutTextPrBold = 260;
var historydescription_Presentation_PutTextPrItalic = 261;
var historydescription_Presentation_PutTextPrUnderline = 262;
var historydescription_Presentation_PutTextPrStrikeout = 263;
var historydescription_Presentation_PutTextPrLineSpacing = 264;
var historydescription_Presentation_PutTextPrSpacingBeforeAfter = 265;
var historydescription_Presentation_PutTextPrIncreaseFontSize = 266;
var historydescription_Presentation_PutTextPrDecreaseFontSize = 267;
var historydescription_Presentation_PutTextPrAlign = 268;
var historydescription_Presentation_PutTextPrBaseline = 269;
var historydescription_Presentation_PutTextPrListType = 270;
var historydescription_Presentation_PutTextColor = 271;
var historydescription_Presentation_PutTextColor2 = 271;
var historydescription_Presentation_PutPrIndent = 271;
var historydescription_Presentation_PutPrIndentRight = 271;
var historydescription_Presentation_PutPrFirstLineIndent = 271;
var historydescription_Presentation_AddPageBreak = 271;
var historydescription_Presentation_AddRowAbove = 272;
var historydescription_Presentation_AddRowBelow = 273;
var historydescription_Presentation_AddColLeft = 274;
var historydescription_Presentation_AddColRight = 275;
var historydescription_Presentation_RemoveRow = 276;
var historydescription_Presentation_RemoveCol = 277;
var historydescription_Presentation_RemoveTable = 278;
var historydescription_Presentation_MergeCells = 279;
var historydescription_Presentation_SplitCells = 280;
var historydescription_Presentation_TblApply = 281;
var historydescription_Presentation_RemoveComment = 282;
var historydescription_Presentation_EndFontLoad = 283;
var historydescription_Presentation_ChangeTheme = 284;
var historydescription_Presentation_TableMoveFromRulers = 285;
var historydescription_Presentation_TableMoveFromRulersInline = 286;
var historydescription_Presentation_PasteOnThumbnails = 287;
var historydescription_Presentation_PasteOnThumbnailsSafari = 288;
function Get_HistoryPointStringDescription(nDescription) {
    var sString = "Unknown";
    switch (nDescription) {
    case historydescription_Cut:
        sString = "Cut                                   ";
        break;
    case historydescription_PasteButtonIE:
        sString = "PasteButtonIE                         ";
        break;
    case historydescription_PasteButtonNotIE:
        sString = "PasteButtonNotIE                      ";
        break;
    case historydescription_ChartDrawingObjects:
        sString = "ChartDrawingObjects                   ";
        break;
    case historydescription_CommonControllerCheckChartText:
        sString = "CommonControllerCheckChartText        ";
        break;
    case historydescription_CommonControllerUnGroup:
        sString = "CommonControllerUnGroup               ";
        break;
    case historydescription_CommonControllerCheckSelected:
        sString = "CommonControllerCheckSelected         ";
        break;
    case historydescription_CommonControllerSetGraphicObject:
        sString = "CommonControllerSetGraphicObject      ";
        break;
    case historydescription_CommonStatesAddNewShape:
        sString = "CommonStatesAddNewShape               ";
        break;
    case historydescription_CommonStatesRotate:
        sString = "CommonStatesRotate                    ";
        break;
    case historydescription_PasteNative:
        sString = "PasteNative                           ";
        break;
    case historydescription_Document_SetDefaultLanguage:
        sString = "Document_SetDefaultLanguage           ";
        break;
    case historydescription_Document_ChangeColorScheme:
        sString = "Document_ChangeColorScheme            ";
        break;
    case historydescription_Document_AddChart:
        sString = "Document_AddChart                     ";
        break;
    case historydescription_Document_EditChart:
        sString = "Document_EditChart                    ";
        break;
    case historydescription_Document_DragText:
        sString = "Document_DragText                     ";
        break;
    case historydescription_Document_DocumentContentExtendToPos:
        sString = "Document_DocumentContentExtendToPos   ";
        break;
    case historydescription_Document_AddHeader:
        sString = "Document_AddHeader                    ";
        break;
    case historydescription_Document_AddFooter:
        sString = "Document_AddFooter                    ";
        break;
    case historydescription_Document_ParagraphExtendToPos:
        sString = "Document_ParagraphExtendToPos         ";
        break;
    case historydescription_Document_ParagraphChangeFrame:
        sString = "Document_ParagraphChangeFrame         ";
        break;
    case historydescription_Document_ReplaceAll:
        sString = "Document_ReplaceAll                   ";
        break;
    case historydescription_Document_ReplaceSingle:
        sString = "Document_ReplaceSingle                ";
        break;
    case historydescription_Document_TableAddNewRowByTab:
        sString = "Document_TableAddNewRowByTab          ";
        break;
    case historydescription_Document_AddNewShape:
        sString = "Document_AddNewShape                  ";
        break;
    case historydescription_Document_EditWrapPolygon:
        sString = "Document_EditWrapPolygon              ";
        break;
    case historydescription_Document_MoveInlineObject:
        sString = "Document_MoveInlineObject             ";
        break;
    case historydescription_Document_CopyAndMoveInlineObject:
        sString = "Document_CopyAndMoveInlineObject      ";
        break;
    case historydescription_Document_DrawingChangeAdj:
        sString = "Document_DrawingChangeAdj             ";
        break;
    case historydescription_Document_RotateInlineDrawing:
        sString = "Document_RotateInlineDrawing          ";
        break;
    case historydescription_Document_RotateFlowDrawingNoCtrl:
        sString = "Document_RotateFlowDrawingNoCtrl      ";
        break;
    case historydescription_Document_RotateFlowDrawingCtrl:
        sString = "Document_RotateFlowDrawingCtrl        ";
        break;
    case historydescription_Document_MoveInGroup:
        sString = "Document_MoveInGroup                  ";
        break;
    case historydescription_Document_ChangeWrapContour:
        sString = "Document_ChangeWrapContour            ";
        break;
    case historydescription_Document_ChangeWrapContourAddPoint:
        sString = "Document_ChangeWrapContourAddPoint    ";
        break;
    case historydescription_Document_GrObjectsBringToFront:
        sString = "Document_GrObjectsBringToFront        ";
        break;
    case historydescription_Document_GrObjectsBringForward:
        sString = "Document_GrObjectsBringForward        ";
        break;
    case historydescription_Document_GrObjectsSendToBack:
        sString = "Document_GrObjectsSendToBack          ";
        break;
    case historydescription_Document_GrObjectsBringBackward:
        sString = "Document_GrObjectsBringBackward       ";
        break;
    case historydescription_Document_GrObjectsGroup:
        sString = "Document_GrObjectsGroup               ";
        break;
    case historydescription_Document_GrObjectsUnGroup:
        sString = "Document_GrObjectsUnGroup             ";
        break;
    case historydescription_Document_GrObjectsChangeWrapPolygon:
        sString = "Document_GrObjectsChangeWrapPolygon   ";
        break;
    case historydescription_Document_MathAutoCorrect:
        sString = "Document_MathAutoCorrect              ";
        break;
    case historydescription_Document_SetFramePrWithFontFamily:
        sString = "Document_SetFramePrWithFontFamily     ";
        break;
    case historydescription_Document_SetFramePr:
        sString = "Document_SetFramePr                   ";
        break;
    case historydescription_Document_SetFramePrWithFontFamilyLong:
        sString = "Document_SetFramePrWithFontFamilyLong ";
        break;
    case historydescription_Document_SetFontName:
        sString = "Document_SetFontName                  ";
        break;
    case historydescription_Document_SetFontSize:
        sString = "Document_SetFontSize                  ";
        break;
    case historydescription_Document_SetBold:
        sString = "Document_SetBold                      ";
        break;
    case historydescription_Document_SetItalic:
        sString = "Document_SetItalic                    ";
        break;
    case historydescription_Document_SetUnderline:
        sString = "Document_SetUnderline                 ";
        break;
    case historydescription_Document_SetStrikeout:
        sString = "Document_SetStrikeout                 ";
        break;
    case historydescription_Document_SetDStrikeout:
        sString = "Document_SetDStrikeout                ";
        break;
    case historydescription_Document_SetTextSpacing:
        sString = "Document_SetTextSpacing               ";
        break;
    case historydescription_Document_SetCaps:
        sString = "Document_SetCaps                      ";
        break;
    case historydescription_Document_SetSmallCaps:
        sString = "Document_SetSmallCaps                 ";
        break;
    case historydescription_Document_SetTextPosition:
        sString = "Document_SetTextPosition              ";
        break;
    case historydescription_Document_SetTextLang:
        sString = "Document_SetTextLang                  ";
        break;
    case historydescription_Document_SetLineSpacing:
        sString = "Document_SetLineSpacing               ";
        break;
    case historydescription_Document_SetLineSpacingBeforeAfter:
        sString = "Document_SetLineSpacingBeforeAfter    ";
        break;
    case historydescription_Document_IncFontSize:
        sString = "Document_IncFontSize                  ";
        break;
    case historydescription_Document_DecFontSize:
        sString = "Document_DecFontSize                  ";
        break;
    case historydescription_Document_SetParagraphBorders:
        sString = "Document_SetParagraphBorders          ";
        break;
    case historydescription_Document_SetParagraphPr:
        sString = "Document_SetParagraphPr               ";
        break;
    case historydescription_Document_SetParagraphAlign:
        sString = "Document_SetParagraphAlign            ";
        break;
    case historydescription_Document_SetTextVertAlign:
        sString = "Document_SetTextVertAlign             ";
        break;
    case historydescription_Document_SetParagraphNumbering:
        sString = "Document_SetParagraphNumbering        ";
        break;
    case historydescription_Document_SetParagraphStyle:
        sString = "Document_SetParagraphStyle            ";
        break;
    case historydescription_Document_SetParagraphPageBreakBefore:
        sString = "Document_SetParagraphPageBreakBefore  ";
        break;
    case historydescription_Document_SetParagraphWidowControl:
        sString = "Document_SetParagraphWidowControl     ";
        break;
    case historydescription_Document_SetParagraphKeepLines:
        sString = "Document_SetParagraphKeepLines        ";
        break;
    case historydescription_Document_SetParagraphKeepNext:
        sString = "Document_SetParagraphKeepNext         ";
        break;
    case historydescription_Document_SetParagraphContextualSpacing:
        sString = "Document_SetParagraphContextualSpacing";
        break;
    case historydescription_Document_SetTextHighlightNone:
        sString = "Document_SetTextHighlightNone         ";
        break;
    case historydescription_Document_SetTextHighlightColor:
        sString = "Document_SetTextHighlightColor        ";
        break;
    case historydescription_Document_SetTextColor:
        sString = "Document_SetTextColor                 ";
        break;
    case historydescription_Document_SetParagraphShd:
        sString = "Document_SetParagraphShd              ";
        break;
    case historydescription_Document_SetParagraphIndent:
        sString = "Document_SetParagraphIndent           ";
        break;
    case historydescription_Document_IncParagraphIndent:
        sString = "Document_IncParagraphIndent           ";
        break;
    case historydescription_Document_DecParagraphIndent:
        sString = "Document_DecParagraphIndent           ";
        break;
    case historydescription_Document_SetParagraphIndentRight:
        sString = "Document_SetParagraphIndentRight      ";
        break;
    case historydescription_Document_SetParagraphIndentFirstLine:
        sString = "Document_SetParagraphIndentFirstLine  ";
        break;
    case historydescription_Document_SetPageOrientation:
        sString = "Document_SetPageOrientation           ";
        break;
    case historydescription_Document_SetPageSize:
        sString = "Document_SetPageSize                  ";
        break;
    case historydescription_Document_AddPageBreak:
        sString = "Document_AddPageBreak                 ";
        break;
    case historydescription_Document_AddPageNumToHdrFtr:
        sString = "Document_AddPageNumToHdrFtr           ";
        break;
    case historydescription_Document_AddPageNumToCurrentPos:
        sString = "Document_AddPageNumToCurrentPos       ";
        break;
    case historydescription_Document_SetHdrFtrDistance:
        sString = "Document_SetHdrFtrDistance            ";
        break;
    case historydescription_Document_SetHdrFtrFirstPage:
        sString = "Document_SetHdrFtrFirstPage           ";
        break;
    case historydescription_Document_SetHdrFtrEvenAndOdd:
        sString = "Document_SetHdrFtrEvenAndOdd          ";
        break;
    case historydescription_Document_SetHdrFtrLink:
        sString = "Document_SetHdrFtrLink                ";
        break;
    case historydescription_Document_AddTable:
        sString = "Document_AddTable                     ";
        break;
    case historydescription_Document_TableAddRowAbove:
        sString = "Document_TableAddRowAbove             ";
        break;
    case historydescription_Document_TableAddRowBelow:
        sString = "Document_TableAddRowBelow             ";
        break;
    case historydescription_Document_TableAddColumnLeft:
        sString = "Document_TableAddColumnLeft           ";
        break;
    case historydescription_Document_TableAddColumnRight:
        sString = "Document_TableAddColumnRight          ";
        break;
    case historydescription_Document_TableRemoveRow:
        sString = "Document_TableRemoveRow               ";
        break;
    case historydescription_Document_TableRemoveColumn:
        sString = "Document_TableRemoveColumn            ";
        break;
    case historydescription_Document_RemoveTable:
        sString = "Document_RemoveTable                  ";
        break;
    case historydescription_Document_MergeTableCells:
        sString = "Document_MergeTableCells              ";
        break;
    case historydescription_Document_SplitTableCells:
        sString = "Document_SplitTableCells              ";
        break;
    case historydescription_Document_ApplyTablePr:
        sString = "Document_ApplyTablePr                 ";
        break;
    case historydescription_Document_AddImageUrl:
        sString = "Document_AddImageUrl                  ";
        break;
    case historydescription_Document_AddImageUrlLong:
        sString = "Document_AddImageUrlLong              ";
        break;
    case historydescription_Document_ApplyImagePrWithUrl:
        sString = "Document_ApplyImagePrWithUrl          ";
        break;
    case historydescription_Document_ApplyImagePrWithUrlLong:
        sString = "Document_ApplyImagePrWithUrlLong      ";
        break;
    case historydescription_Document_ApplyImagePrWithFillUrl:
        sString = "Document_ApplyImagePrWithFillUrl      ";
        break;
    case historydescription_Document_ApplyImagePrWithFillUrlLong:
        sString = "Document_ApplyImagePrWithFillUrlLong  ";
        break;
    case historydescription_Document_ApplyImagePr:
        sString = "Document_ApplyImagePr                 ";
        break;
    case historydescription_Document_AddHyperlink:
        sString = "Document_AddHyperlink                 ";
        break;
    case historydescription_Document_ChangeHyperlink:
        sString = "Document_ChangeHyperlink              ";
        break;
    case historydescription_Document_RemoveHyperlink:
        sString = "Document_RemoveHyperlink              ";
        break;
    case historydescription_Document_ReplaceMisspelledWord:
        sString = "Document_ReplaceMisspelledWord        ";
        break;
    case historydescription_Document_AddComment:
        sString = "Document_AddComment                   ";
        break;
    case historydescription_Document_RemoveComment:
        sString = "Document_RemoveComment                ";
        break;
    case historydescription_Document_ChangeComment:
        sString = "Document_ChangeComment                ";
        break;
    case historydescription_Document_SetTextFontNameLong:
        sString = "Document_SetTextFontNameLong          ";
        break;
    case historydescription_Document_AddImage:
        sString = "Document_AddImage                     ";
        break;
    case historydescription_Document_ClearFormatting:
        sString = "Document_ClearFormatting              ";
        break;
    case historydescription_Document_AddSectionBreak:
        sString = "Document_AddSectionBreak              ";
        break;
    case historydescription_Document_AddMath:
        sString = "Document_AddMath                      ";
        break;
    case historydescription_Document_SetParagraphTabs:
        sString = "Document_SetParagraphTabs             ";
        break;
    case historydescription_Document_SetParagraphIndentFromRulers:
        sString = "Document_SetParagraphIndentFromRulers ";
        break;
    case historydescription_Document_SetDocumentMargin_Hor:
        sString = "Document_SetDocumentMargin_Hor        ";
        break;
    case historydescription_Document_SetTableMarkup_Hor:
        sString = "Document_SetTableMarkup_Hor           ";
        break;
    case historydescription_Document_SetDocumentMargin_Ver:
        sString = "Document_SetDocumentMargin_Ver        ";
        break;
    case historydescription_Document_SetHdrFtrBounds:
        sString = "Document_SetHdrFtrBounds              ";
        break;
    case historydescription_Document_SetTableMarkup_Ver:
        sString = "Document_SetTableMarkup_Ver           ";
        break;
    case historydescription_Document_MoveInlineTable:
        sString = "Document_MoveInlineTable              ";
        break;
    case historydescription_Document_MoveFlowTable:
        sString = "Document_MoveFlowTable                ";
        break;
    case historydescription_Document_DocumentExtendToPos:
        sString = "Document_DocumentExtendToPos          ";
        break;
    case historydescription_Document_AddDropCap:
        sString = "Document_AddDropCap                   ";
        break;
    case historydescription_Document_RemoveDropCap:
        sString = "Document_RemoveDropCap                ";
        break;
    case historydescription_Document_SetTextHighlight:
        sString = "Document_SetTextHighlight             ";
        break;
    case historydescription_Document_BackSpaceButton:
        sString = "Document_BackSpaceButton              ";
        break;
    case historydescription_Document_MoveParagraphByTab:
        sString = "Document_MoveParagraphByTab           ";
        break;
    case historydescription_Document_AddTab:
        sString = "Document_AddTab                       ";
        break;
    case historydescription_Document_EnterButton:
        sString = "Document_EnterButton                  ";
        break;
    case historydescription_Document_SpaceButton:
        sString = "Document_SpaceButton                  ";
        break;
    case historydescription_Document_ShiftInsert:
        sString = "Document_ShiftInsert                  ";
        break;
    case historydescription_Document_ShiftInsertSafari:
        sString = "Document_ShiftInsertSafari            ";
        break;
    case historydescription_Document_DeleteButton:
        sString = "Document_DeleteButton                 ";
        break;
    case historydescription_Document_ShiftDeleteButton:
        sString = "Document_ShiftDeleteButton            ";
        break;
    case historydescription_Document_SetStyleHeading1:
        sString = "Document_SetStyleHeading1             ";
        break;
    case historydescription_Document_SetStyleHeading2:
        sString = "Document_SetStyleHeading2             ";
        break;
    case historydescription_Document_SetStyleHeading3:
        sString = "Document_SetStyleHeading3             ";
        break;
    case historydescription_Document_SetTextStrikeoutHotKey:
        sString = "Document_SetTextStrikeoutHotKey       ";
        break;
    case historydescription_Document_SetTextBoldHotKey:
        sString = "Document_SetTextBoldHotKey            ";
        break;
    case historydescription_Document_SetParagraphAlignHotKey:
        sString = "Document_SetParagraphAlignHotKey      ";
        break;
    case historydescription_Document_AddEuroLetter:
        sString = "Document_AddEuroLetter                ";
        break;
    case historydescription_Document_SetTextItalicHotKey:
        sString = "Document_SetTextItalicHotKey          ";
        break;
    case historydescription_Document_SetParagraphAlignHotKey2:
        sString = "Document_SetParagraphAlignHotKey2     ";
        break;
    case historydescription_Document_SetParagraphAlignHotKey3:
        sString = "Document_SetParagraphAlignHotKey3     ";
        break;
    case historydescription_Document_SetParagraphNumberingHotKey:
        sString = "Document_SetParagraphNumberingHotKey  ";
        break;
    case historydescription_Document_AddPageNumHotKey:
        sString = "Document_AddPageNumHotKey             ";
        break;
    case historydescription_Document_SetParagraphAlignHotKey4:
        sString = "Document_SetParagraphAlignHotKey4     ";
        break;
    case historydescription_Document_SetTextUnderlineHotKey:
        sString = "Document_SetTextUnderlineHotKey       ";
        break;
    case historydescription_Document_FormatPasteHotKey:
        sString = "Document_FormatPasteHotKey            ";
        break;
    case historydescription_Document_PasteHotKey:
        sString = "Document_PasteHotKey                  ";
        break;
    case historydescription_Document_PasteSafariHotKey:
        sString = "Document_PasteSafariHotKey            ";
        break;
    case historydescription_Document_CurHotKey:
        sString = "Document_CurHotKey                    ";
        break;
    case historydescription_Document_SetTextVertAlignHotKey:
        sString = "Document_SetTextVertAlignHotKey       ";
        break;
    case historydescription_Document_AddMathHotKey:
        sString = "Document_AddMathHotKey                ";
        break;
    case historydescription_Document_SetTextVertAlignHotKey2:
        sString = "Document_SetTextVertAlignHotKey2      ";
        break;
    case historydescription_Document_MinusButton:
        sString = "Document_MinusButton                  ";
        break;
    case historydescription_Document_SetTextVertAlignHotKey3:
        sString = "Document_SetTextVertAlignHotKey3      ";
        break;
    case historydescription_Document_AddLetter:
        sString = "Document_AddLetter                    ";
        break;
    case historydescription_Document_MoveTableBorder:
        sString = "Document_MoveTableBorder              ";
        break;
    case historydescription_Document_FormatPasteHotKey2:
        sString = "Document_FormatPasteHotKey2           ";
        break;
    case historydescription_Document_SetTextHighlight2:
        sString = "Document_SetTextHighlight2            ";
        break;
    case historydescription_Document_AddTextFromTextBox:
        sString = "Document_AddTextFromTextBox           ";
        break;
    case historydescription_Spreadsheet_SetCellFontName:
        sString = "Spreadsheet_SetCellFontName                ";
        break;
    case historydescription_Spreadsheet_SetCellFontSize:
        sString = "Spreadsheet_SetCellFontSize                ";
        break;
    case historydescription_Spreadsheet_SetCellBold:
        sString = "Spreadsheet_SetCellBold                    ";
        break;
    case historydescription_Spreadsheet_SetCellItalic:
        sString = "Spreadsheet_SetCellItalic                  ";
        break;
    case historydescription_Spreadsheet_SetCellUnderline:
        sString = "Spreadsheet_SetCellUnderline               ";
        break;
    case historydescription_Spreadsheet_SetCellStrikeout:
        sString = "Spreadsheet_SetCellStrikeout               ";
        break;
    case historydescription_Spreadsheet_SetCellSubscript:
        sString = "Spreadsheet_SetCellSubscript               ";
        break;
    case historydescription_Spreadsheet_SetCellSuperscript:
        sString = "Spreadsheet_SetCellSuperscript             ";
        break;
    case historydescription_Spreadsheet_SetCellAlign:
        sString = "Spreadsheet_SetCellAlign                   ";
        break;
    case historydescription_Spreadsheet_SetCellVertAlign:
        sString = "Spreadsheet_SetCellVertAlign               ";
        break;
    case historydescription_Spreadsheet_SetCellTextColor:
        sString = "Spreadsheet_SetCellTextColor               ";
        break;
    case historydescription_Spreadsheet_SetCellBackgroundColor:
        sString = "Spreadsheet_SetCellBackgroundColor         ";
        break;
    case historydescription_Spreadsheet_SetCellIncreaseFontSize:
        sString = "Spreadsheet_SetCellIncreaseFontSize        ";
        break;
    case historydescription_Spreadsheet_SetCellDecreaseFontSize:
        sString = "Spreadsheet_SetCellDecreaseFontSize        ";
        break;
    case historydescription_Spreadsheet_SetCellHyperlinkAdd:
        sString = "Spreadsheet_SetCellHyperlinkAdd            ";
        break;
    case historydescription_Spreadsheet_SetCellHyperlinkModify:
        sString = "Spreadsheet_SetCellHyperlinkModify         ";
        break;
    case historydescription_Spreadsheet_SetCellHyperlinkRemove:
        sString = "Spreadsheet_SetCellHyperlinkRemove         ";
        break;
    case historydescription_Spreadsheet_EditChart:
        sString = "Spreadsheet_EditChart                      ";
        break;
    case historydescription_Spreadsheet_Remove:
        sString = "Spreadsheet_Remove                         ";
        break;
    case historydescription_Spreadsheet_AddTab:
        sString = "Spreadsheet_AddTab                         ";
        break;
    case historydescription_Spreadsheet_AddNewParagraph:
        sString = "Spreadsheet_AddNewParagraph                ";
        break;
    case historydescription_Spreadsheet_AddSpace:
        sString = "Spreadsheet_AddSpace                       ";
        break;
    case historydescription_Spreadsheet_AddItem:
        sString = "Spreadsheet_AddItem                        ";
        break;
    case historydescription_Spreadsheet_PutPrLineSpacing:
        sString = "Spreadsheet_PutPrLineSpacing               ";
        break;
    case historydescription_Spreadsheet_SetParagraphSpacing:
        sString = "Spreadsheet_SetParagraphSpacing            ";
        break;
    case historydescription_Spreadsheet_SetGraphicObjectsProps:
        sString = "Spreadsheet_SetGraphicObjectsProps         ";
        break;
    case historydescription_Spreadsheet_ParaApply:
        sString = "Spreadsheet_ParaApply                      ";
        break;
    case historydescription_Spreadsheet_GraphicObjectLayer:
        sString = "Spreadsheet_GraphicObjectLayer             ";
        break;
    case historydescription_Spreadsheet_ParagraphAdd:
        sString = "Spreadsheet_ParagraphAdd                   ";
        break;
    case historydescription_Spreadsheet_CreateGroup:
        sString = "Spreadsheet_CreateGroup                    ";
        break;
    case historydescription_CommonDrawings_ChangeAdj:
        sString = "CommonDrawings_ChangeAdj                   ";
        break;
    case historydescription_CommonDrawings_EndTrack:
        sString = "CommonDrawings_EndTrack                    ";
        break;
    case historydescription_CommonDrawings_CopyCtrl:
        sString = "CommonDrawings_CopyCtrl                    ";
        break;
    case historydescription_Presentation_ParaApply:
        sString = "Presentation_ParaApply                     ";
        break;
    case historydescription_Presentation_ParaFormatPaste:
        sString = "Presentation_ParaFormatPaste               ";
        break;
    case historydescription_Presentation_AddNewParagraph:
        sString = "Presentation_AddNewParagraph               ";
        break;
    case historydescription_Presentation_CreateGroup:
        sString = "Presentation_CreateGroup                   ";
        break;
    case historydescription_Presentation_UnGroup:
        sString = "Presentation_UnGroup                       ";
        break;
    case historydescription_Presentation_AddChart:
        sString = "Presentation_AddChart                      ";
        break;
    case historydescription_Presentation_EditChart:
        sString = "Presentation_EditChart                     ";
        break;
    case historydescription_Presentation_ParagraphAdd:
        sString = "Presentation_ParagraphAdd                  ";
        break;
    case historydescription_Presentation_ParagraphClearFormatting:
        sString = "Presentation_ParagraphClearFormatting      ";
        break;
    case historydescription_Presentation_SetParagraphAlign:
        sString = "Presentation_SetParagraphAlign             ";
        break;
    case historydescription_Presentation_SetParagraphSpacing:
        sString = "Presentation_SetParagraphSpacing           ";
        break;
    case historydescription_Presentation_SetParagraphTabs:
        sString = "Presentation_SetParagraphTabs              ";
        break;
    case historydescription_Presentation_SetParagraphIndent:
        sString = "Presentation_SetParagraphIndent            ";
        break;
    case historydescription_Presentation_SetParagraphNumbering:
        sString = "Presentation_SetParagraphNumbering         ";
        break;
    case historydescription_Presentation_ParagraphIncDecFontSize:
        sString = "Presentation_ParagraphIncDecFontSize       ";
        break;
    case historydescription_Presentation_ParagraphIncDecIndent:
        sString = "Presentation_ParagraphIncDecIndent         ";
        break;
    case historydescription_Presentation_SetImageProps:
        sString = "Presentation_SetImageProps                 ";
        break;
    case historydescription_Presentation_SetShapeProps:
        sString = "Presentation_SetShapeProps                 ";
        break;
    case historydescription_Presentation_ChartApply:
        sString = "Presentation_ChartApply                    ";
        break;
    case historydescription_Presentation_ChangeShapeType:
        sString = "Presentation_ChangeShapeType               ";
        break;
    case historydescription_Presentation_SetVerticalAlign:
        sString = "Presentation_SetVerticalAlign              ";
        break;
    case historydescription_Presentation_HyperlinkAdd:
        sString = "Presentation_HyperlinkAdd                  ";
        break;
    case historydescription_Presentation_HyperlinkModify:
        sString = "Presentation_HyperlinkModify               ";
        break;
    case historydescription_Presentation_HyperlinkRemove:
        sString = "Presentation_HyperlinkRemove               ";
        break;
    case historydescription_Presentation_DistHor:
        sString = "Presentation_DistHor                       ";
        break;
    case historydescription_Presentation_DistVer:
        sString = "Presentation_DistVer                       ";
        break;
    case historydescription_Presentation_BringToFront:
        sString = "Presentation_BringToFront                  ";
        break;
    case historydescription_Presentation_BringForward:
        sString = "Presentation_BringForward                  ";
        break;
    case historydescription_Presentation_SendToBack:
        sString = "Presentation_SendToBack                    ";
        break;
    case historydescription_Presentation_BringBackward:
        sString = "Presentation_BringBackward                 ";
        break;
    case historydescription_Presentation_ApplyTiming:
        sString = "Presentation_ApplyTiming                   ";
        break;
    case historydescription_Presentation_MoveSlidesToEnd:
        sString = "Presentation_MoveSlidesToEnd               ";
        break;
    case historydescription_Presentation_MoveSlidesNextPos:
        sString = "Presentation_MoveSlidesNextPos             ";
        break;
    case historydescription_Presentation_MoveSlidesPrevPos:
        sString = "Presentation_MoveSlidesPrevPos             ";
        break;
    case historydescription_Presentation_MoveSlidesToStart:
        sString = "Presentation_MoveSlidesToStart             ";
        break;
    case historydescription_Presentation_MoveComments:
        sString = "Presentation_MoveComments                  ";
        break;
    case historydescription_Presentation_TableBorder:
        sString = "Presentation_TableBorder                   ";
        break;
    case historydescription_Presentation_AddFlowImage:
        sString = "Presentation_AddFlowImage                  ";
        break;
    case historydescription_Presentation_AddFlowTable:
        sString = "Presentation_AddFlowTable                  ";
        break;
    case historydescription_Presentation_ChangeBackground:
        sString = "Presentation_ChangeBackground              ";
        break;
    case historydescription_Presentation_AddNextSlide:
        sString = "Presentation_AddNextSlide                  ";
        break;
    case historydescription_Presentation_ShiftSlides:
        sString = "Presentation_ShiftSlides                   ";
        break;
    case historydescription_Presentation_DeleteSlides:
        sString = "Presentation_DeleteSlides                  ";
        break;
    case historydescription_Presentation_ChangeLayout:
        sString = "Presentation_ChangeLayout                  ";
        break;
    case historydescription_Presentation_ChangeSlideSize:
        sString = "Presentation_ChangeSlideSize               ";
        break;
    case historydescription_Presentation_ChangeColorScheme:
        sString = "Presentation_ChangeColorScheme             ";
        break;
    case historydescription_Presentation_AddComment:
        sString = "Presentation_AddComment                    ";
        break;
    case historydescription_Presentation_ChangeComment:
        sString = "Presentation_ChangeComment                 ";
        break;
    case historydescription_Presentation_PutTextPrFontName:
        sString = "Presentation_PutTextPrFontName             ";
        break;
    case historydescription_Presentation_PutTextPrFontSize:
        sString = "Presentation_PutTextPrFontSize             ";
        break;
    case historydescription_Presentation_PutTextPrBold:
        sString = "Presentation_PutTextPrBold                 ";
        break;
    case historydescription_Presentation_PutTextPrItalic:
        sString = "Presentation_PutTextPrItalic               ";
        break;
    case historydescription_Presentation_PutTextPrUnderline:
        sString = "Presentation_PutTextPrUnderline            ";
        break;
    case historydescription_Presentation_PutTextPrStrikeout:
        sString = "Presentation_PutTextPrStrikeout            ";
        break;
    case historydescription_Presentation_PutTextPrLineSpacing:
        sString = "Presentation_PutTextPrLineSpacing          ";
        break;
    case historydescription_Presentation_PutTextPrSpacingBeforeAfter:
        sString = "Presentation_PutTextPrSpacingBeforeAfter   ";
        break;
    case historydescription_Presentation_PutTextPrIncreaseFontSize:
        sString = "Presentation_PutTextPrIncreaseFontSize     ";
        break;
    case historydescription_Presentation_PutTextPrDecreaseFontSize:
        sString = "Presentation_PutTextPrDecreaseFontSize     ";
        break;
    case historydescription_Presentation_PutTextPrAlign:
        sString = "Presentation_PutTextPrAlign                ";
        break;
    case historydescription_Presentation_PutTextPrBaseline:
        sString = "Presentation_PutTextPrBaseline             ";
        break;
    case historydescription_Presentation_PutTextPrListType:
        sString = "Presentation_PutTextPrListType             ";
        break;
    case historydescription_Presentation_PutTextColor:
        sString = "Presentation_PutTextColor                  ";
        break;
    case historydescription_Presentation_PutTextColor2:
        sString = "Presentation_PutTextColor2                 ";
        break;
    case historydescription_Presentation_PutPrIndent:
        sString = "Presentation_PutPrIndent                   ";
        break;
    case historydescription_Presentation_PutPrIndentRight:
        sString = "Presentation_PutPrIndentRight              ";
        break;
    case historydescription_Presentation_PutPrFirstLineIndent:
        sString = "Presentation_PutPrFirstLineIndent          ";
        break;
    case historydescription_Presentation_AddPageBreak:
        sString = "Presentation_AddPageBreak                  ";
        break;
    case historydescription_Presentation_AddRowAbove:
        sString = "Presentation_AddRowAbove                   ";
        break;
    case historydescription_Presentation_AddRowBelow:
        sString = "Presentation_AddRowBelow                   ";
        break;
    case historydescription_Presentation_AddColLeft:
        sString = "Presentation_AddColLeft                    ";
        break;
    case historydescription_Presentation_AddColRight:
        sString = "Presentation_AddColRight                   ";
        break;
    case historydescription_Presentation_RemoveRow:
        sString = "Presentation_RemoveRow                     ";
        break;
    case historydescription_Presentation_RemoveCol:
        sString = "Presentation_RemoveCol                     ";
        break;
    case historydescription_Presentation_RemoveTable:
        sString = "Presentation_RemoveTable                   ";
        break;
    case historydescription_Presentation_MergeCells:
        sString = "Presentation_MergeCells                    ";
        break;
    case historydescription_Presentation_SplitCells:
        sString = "Presentation_SplitCells                    ";
        break;
    case historydescription_Presentation_TblApply:
        sString = "Presentation_TblApply                      ";
        break;
    case historydescription_Presentation_RemoveComment:
        sString = "Presentation_RemoveComment                 ";
        break;
    case historydescription_Presentation_EndFontLoad:
        sString = "Presentation_EndFontLoad                   ";
        break;
    case historydescription_Presentation_ChangeTheme:
        sString = "Presentation_ChangeTheme                   ";
        break;
    case historydescription_Presentation_TableMoveFromRulers:
        sString = "Presentation_TableMoveFromRulers           ";
        break;
    case historydescription_Presentation_TableMoveFromRulersInline:
        sString = "Presentation_TableMoveFromRulersInline     ";
        break;
    case historydescription_Presentation_PasteOnThumbnails:
        sString = "Presentation_PasteOnThumbnails             ";
        break;
    case historydescription_Presentation_PasteOnThumbnailsSafari:
        sString = "Presentation_PasteOnThumbnailsSafari       ";
        break;
    }
    return sString;
}