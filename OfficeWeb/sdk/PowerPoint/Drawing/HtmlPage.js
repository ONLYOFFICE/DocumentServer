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
var g_dDpiX = 96;
var g_dDpiY = 96;
var g_dKoef_mm_to_pix = g_dDpiX / 25.4;
var g_dKoef_pix_to_mm = 25.4 / g_dDpiX;
var g_bIsMobile = AscBrowser.isMobile;
var g_bIsMouseUpLockedSend = false;
var Page_Width = 297;
var Page_Height = 210;
var X_Left_Margin = 30;
var X_Right_Margin = 15;
var Y_Bottom_Margin = 20;
var Y_Top_Margin = 20;
var Y_Default_Header = 12.5;
var Y_Default_Footer = 12.5;
var X_Left_Field = X_Left_Margin;
var X_Right_Field = Page_Width - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field = Y_Top_Margin;
var GlobalSkinTeamlab = {
    Name: "classic",
    RulersButton: true,
    NavigationButtons: true,
    BackgroundColor: "#B0B0B0",
    BackgroundColorThumbnails: "#EBEBEB",
    RulerDark: "#B0B0B0",
    RulerLight: "EDEDED",
    RulerOutline: "#929292",
    RulerMarkersFillColor: "#E7E7E7",
    PageOutline: "#81878F",
    STYLE_THUMBNAIL_WIDTH: 80,
    STYLE_THUMBNAIL_HEIGHT: 40,
    BorderSplitterColor: "#787878",
    SupportNotes: true,
    SplitterWidthMM: 1.5,
    ThumbnailScrollWidthNullIfNoScrolling: true
};
var GlobalSkinFlat = {
    Name: "flat",
    RulersButton: false,
    NavigationButtons: false,
    BackgroundColor: "#F4F4F4",
    BackgroundColorThumbnails: "#F4F4F4",
    RulerDark: "#CFCFCF",
    RulerLight: "#FFFFFF",
    RulerOutline: "#BBBEC2",
    RulerMarkersFillColor: "#FFFFFF",
    PageOutline: "#BBBEC2",
    STYLE_THUMBNAIL_WIDTH: 109,
    STYLE_THUMBNAIL_HEIGHT: 45,
    BorderSplitterColor: "#CBCBCB",
    SupportNotes: false,
    SplitterWidthMM: 1,
    ThumbnailScrollWidthNullIfNoScrolling: false
};
var GlobalSkin = GlobalSkinTeamlab;
function CEditorPage(api) {
    this.Name = "";
    this.IsSupportNotes = false;
    this.EditorType = "presentations";
    this.X = 0;
    this.Y = 0;
    this.Width = 10;
    this.Height = 10;
    this.m_oBody = null;
    this.m_oThumbnailsContainer = null;
    this.m_oThumbnailsBack = null;
    this.m_oThumbnails = null;
    this.m_oThumbnails_scroll = null;
    this.m_oNotesContainer = null;
    this.m_oNotes = null;
    this.m_oNotes_scroll = null;
    this.m_oMainContent = null;
    this.m_oScrollHor = null;
    this.m_oPanelRight = null;
    this.m_oPanelRight_buttonRulers = null;
    this.m_oPanelRight_vertScroll = null;
    this.m_oPanelRight_buttonPrevPage = null;
    this.m_oPanelRight_buttonNextPage = null;
    this.m_oLeftRuler = null;
    this.m_oLeftRuler_buttonsTabs = null;
    this.m_oLeftRuler_vertRuler = null;
    this.m_oTopRuler = null;
    this.m_oTopRuler_horRuler = null;
    this.ScrollWidthPx = 14;
    this.m_oMainView = null;
    this.m_oEditor = null;
    this.m_oOverlay = null;
    this.m_oOverlayApi = new COverlay();
    this.m_oOverlayApi.m_bIsAlwaysUpdateOverlay = true;
    this.m_oScrollHor_ = null;
    this.m_oScrollVer_ = null;
    this.m_oScrollThumb_ = null;
    this.m_oScrollNotes_ = null;
    this.m_oScrollHorApi = null;
    this.m_oScrollVerApi = null;
    this.m_oScrollThumbApi = null;
    this.m_oScrollNotesApi = null;
    this.m_bIsHorScrollVisible = false;
    this.m_bIsCheckHeedHorScrollRepeat = false;
    this.m_bIsRuler = false;
    this.m_bDocumentPlaceChangedEnabled = false;
    this.m_nZoomValue = 100;
    this.zoom_values = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    this.m_nZoomType = 2;
    this.m_oBoundsController = new CBoundsController();
    this.m_nTabsType = 0;
    this.m_dScrollY = 0;
    this.m_dScrollX = 0;
    this.m_dScrollY_max = 1;
    this.m_dScrollX_max = 1;
    this.m_dScrollX_Central = 0;
    this.m_dScrollY_Central = 0;
    this.m_bIsRePaintOnScroll = true;
    this.m_dDocumentWidth = 0;
    this.m_dDocumentHeight = 0;
    this.m_dDocumentPageWidth = 0;
    this.m_dDocumentPageHeight = 0;
    this.m_bIsScroll = false;
    this.m_nPaintTimerId = -1;
    this.m_oHorRuler = new CHorRuler();
    this.m_oHorRuler.IsCanMoveMargins = false;
    this.m_oHorRuler.IsCanMoveAnyMarkers = false;
    this.m_oHorRuler.IsDrawAnyMarkers = false;
    this.m_oVerRuler = new CVerRuler();
    this.m_oVerRuler.IsCanMoveMargins = false;
    this.m_oDrawingDocument = new CDrawingDocument();
    this.m_oLogicDocument = null;
    this.m_oLayoutDrawer = new CLayoutThumbnailDrawer();
    this.m_oLayoutDrawer.DrawingDocument = this.m_oDrawingDocument;
    this.m_oMasterDrawer = new CMasterThumbnailDrawer();
    this.m_oMasterDrawer.DrawingDocument = this.m_oDrawingDocument;
    this.m_oDrawingDocument.m_oWordControl = this;
    this.m_oDrawingDocument.TransitionSlide.HtmlPage = this;
    this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
    this.m_bIsUpdateHorRuler = false;
    this.m_bIsUpdateVerRuler = false;
    this.m_bIsUpdateTargetNoAttack = false;
    this.arrayEventHandlers = [];
    this.m_oTimerScrollSelect = -1;
    this.IsFocus = true;
    this.m_bIsMouseLock = false;
    this.m_oHorRuler.m_oWordControl = this;
    this.m_oVerRuler.m_oWordControl = this;
    this.Thumbnails = new CThumbnailsManager();
    this.SlideDrawer = new CSlideDrawer();
    this.SlideBoundsOnCalculateSize = new CBoundsController();
    this.MainScrollsEnabledFlag = 0;
    this.bIsUseKeyPress = true;
    this.bIsEventPaste = false;
    this.DrawingFreeze = false;
    this.ZoomFreePageNum = -1;
    this.m_bIsIE = AscBrowser.isIE;
    this.Splitter1Pos = 0;
    this.Splitter1PosMin = 0;
    this.Splitter1PosMax = 0;
    this.Splitter2Pos = 0;
    this.Splitter2PosMin = 0;
    this.Splitter2PosMax = 0;
    this.SplitterDiv = null;
    this.SplitterType = 0;
    this.OldSplitter1Pos = 0;
    this.OldDocumentWidth = 0;
    this.OldDocumentHeight = 0;
    this.SlideScrollMIN = 0;
    this.SlideScrollMAX = 0;
    this.bIsDoublePx = true;
    var oTestSpan = document.createElement("span");
    oTestSpan.setAttribute("style", "font-size:8pt");
    document.body.appendChild(oTestSpan);
    var defaultView = oTestSpan.ownerDocument.defaultView;
    var computedStyle = defaultView.getComputedStyle(oTestSpan, null);
    if (null != computedStyle) {
        var fontSize = computedStyle.getPropertyValue("font-size");
        if (-1 != fontSize.indexOf("px") && parseFloat(fontSize) == parseInt(fontSize)) {
            this.bIsDoublePx = false;
        }
    }
    document.body.removeChild(oTestSpan);
    this.m_nTimerScrollInterval = 40;
    this.m_nCurrentTimeClearCache = 0;
    this.StartVerticalScroll = false;
    this.VerticalScrollOnMouseUp = {
        SlideNum: 0,
        ScrollY: 0,
        ScrollY_max: 0
    };
    this.IsGoToPageMAXPosition = false;
    this.bIsRetinaSupport = true;
    this.bIsRetinaNoSupportAttack = false;
    this.MasterLayouts = null;
    this.DemonstrationManager = new CDemonstrationManager(this);
    this.TextBoxInputMode = false;
    this.TextBoxInput = null;
    this.TextBoxInputFocus = false;
    this.TextBoxChangedValueEvent = true;
    this.TextBoxMaxWidth = 20;
    this.TextBoxMaxHeight = 20;
    this.IsEnabledRulerMarkers = false;
    this.IsUpdateOverlayOnlyEnd = false;
    this.IsUpdateOverlayOnEndCheck = false;
    this.IsUseNullThumbnailsSplitter = false;
    this.m_nIntervalSlowAutosave = 600000;
    this.m_nIntervalFastAutosave = 2000;
    this.m_nIntervalWaitAutoSave = 1000;
    this.m_nLastAutosaveTime = -1;
    this.m_oApi = api;
    var oThis = this;
    this.MainScrollLock = function () {
        this.MainScrollsEnabledFlag++;
    };
    this.MainScrollUnLock = function () {
        this.MainScrollsEnabledFlag--;
        if (this.MainScrollsEnabledFlag < 0) {
            this.MainScrollsEnabledFlag = 0;
        }
    };
    this.checkBodySize = function () {
        var off = jQuery("#" + this.Name).offset();
        if (off) {
            this.X = off.left;
            this.Y = off.top;
        }
        var el = document.getElementById(this.Name);
        if (this.Width != el.offsetWidth || this.Height != el.offsetHeight) {
            this.Width = el.offsetWidth;
            this.Height = el.offsetHeight;
            return true;
        }
        return false;
    };
    this.Init = function () {
        this.m_oBody = CreateControlContainer(this.Name);
        this.Splitter1Pos = 70;
        this.Splitter2Pos = (this.IsSupportNotes === true) ? 20 : 0;
        this.OldSplitter1Pos = this.Splitter1Pos;
        this.Splitter1PosMin = 20;
        this.Splitter1PosMax = 80;
        this.Splitter2PosMin = 0;
        this.Splitter2PosMax = 100;
        var ScrollWidthMm = this.ScrollWidthPx * g_dKoef_pix_to_mm;
        var ScrollWidthMm9 = 10 * g_dKoef_pix_to_mm;
        this.Thumbnails.m_oWordControl = this;
        this.m_oThumbnailsContainer = CreateControlContainer("id_panel_thumbnails");
        this.m_oThumbnailsContainer.Bounds.SetParams(0, 0, this.Splitter1Pos, 1000, false, false, true, false, this.Splitter1Pos, -1);
        this.m_oThumbnailsContainer.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oThumbnailsContainer);
        this.m_oThumbnailsBack = CreateControl("id_thumbnails_background");
        this.m_oThumbnailsBack.Bounds.SetParams(0, 0, ScrollWidthMm9, 1000, false, false, true, false, -1, -1);
        this.m_oThumbnailsBack.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oThumbnailsContainer.AddControl(this.m_oThumbnailsBack);
        this.m_oThumbnails = CreateControl("id_thumbnails");
        this.m_oThumbnails.Bounds.SetParams(0, 0, ScrollWidthMm9, 1000, false, false, true, false, -1, -1);
        this.m_oThumbnails.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oThumbnailsContainer.AddControl(this.m_oThumbnails);
        this.m_oThumbnails_scroll = CreateControl("id_vertical_scroll_thmbnl");
        this.m_oThumbnails_scroll.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, ScrollWidthMm9, -1);
        this.m_oThumbnails_scroll.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oThumbnailsContainer.AddControl(this.m_oThumbnails_scroll);
        this.m_oMainContent = CreateControlContainer("id_main");
        if (GlobalSkin.SupportNotes) {
            this.m_oMainContent.Bounds.SetParams(this.Splitter1Pos + GlobalSkin.SplitterWidthMM, 0, g_dKoef_pix_to_mm, this.Splitter2Pos + GlobalSkin.SplitterWidthMM, true, false, true, true, -1, -1);
        } else {
            this.m_oMainContent.Bounds.SetParams(this.Splitter1Pos + GlobalSkin.SplitterWidthMM, 0, g_dKoef_pix_to_mm, 1000, true, false, true, false, -1, -1);
        }
        this.m_oMainContent.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oMainContent);
        this.m_oPanelRight = CreateControlContainer("id_panel_right");
        this.m_oPanelRight.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, ScrollWidthMm, -1);
        this.m_oPanelRight.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oMainContent.AddControl(this.m_oPanelRight);
        this.m_oPanelRight_buttonRulers = CreateControl("id_buttonRulers");
        this.m_oPanelRight_buttonRulers.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, ScrollWidthMm);
        this.m_oPanelRight_buttonRulers.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonRulers);
        var _vertScrollTop = ScrollWidthMm;
        if (GlobalSkin.RulersButton === false) {
            this.m_oPanelRight_buttonRulers.HtmlElement.style.display = "none";
            _vertScrollTop = 0;
        }
        this.m_oPanelRight_buttonNextPage = CreateControl("id_buttonNextPage");
        this.m_oPanelRight_buttonNextPage.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, ScrollWidthMm);
        this.m_oPanelRight_buttonNextPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonNextPage);
        this.m_oPanelRight_buttonPrevPage = CreateControl("id_buttonPrevPage");
        this.m_oPanelRight_buttonPrevPage.Bounds.SetParams(0, 0, 1000, ScrollWidthMm, false, false, false, true, -1, ScrollWidthMm);
        this.m_oPanelRight_buttonPrevPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonPrevPage);
        var _vertScrollBottom = 2 * ScrollWidthMm;
        if (GlobalSkin.NavigationButtons == false) {
            this.m_oPanelRight_buttonNextPage.HtmlElement.style.display = "none";
            this.m_oPanelRight_buttonPrevPage.HtmlElement.style.display = "none";
            _vertScrollBottom = 0;
        }
        this.m_oPanelRight_vertScroll = CreateControl("id_vertical_scroll");
        this.m_oPanelRight_vertScroll.Bounds.SetParams(0, _vertScrollTop, 1000, _vertScrollBottom, false, true, false, true, -1, -1);
        this.m_oPanelRight_vertScroll.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_vertScroll);
        this.m_oLeftRuler = CreateControlContainer("id_panel_left");
        this.m_oLeftRuler.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, 5, -1);
        this.m_oLeftRuler.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom);
        this.m_oMainContent.AddControl(this.m_oLeftRuler);
        this.m_oLeftRuler_buttonsTabs = CreateControl("id_buttonTabs");
        this.m_oLeftRuler_buttonsTabs.Bounds.SetParams(0, 0.8, 1000, 1000, false, true, false, false, -1, 5);
        this.m_oLeftRuler_buttonsTabs.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
        this.m_oLeftRuler.AddControl(this.m_oLeftRuler_buttonsTabs);
        this.m_oLeftRuler_vertRuler = CreateControl("id_vert_ruler");
        this.m_oLeftRuler_vertRuler.Bounds.SetParams(0, 7, 1000, 1000, false, true, false, false, -1, -1);
        this.m_oLeftRuler_vertRuler.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
        this.m_oLeftRuler.AddControl(this.m_oLeftRuler_vertRuler);
        this.m_oTopRuler = CreateControlContainer("id_panel_top");
        this.m_oTopRuler.Bounds.SetParams(5, 0, 1000, 1000, true, false, false, false, -1, 7);
        this.m_oTopRuler.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
        this.m_oMainContent.AddControl(this.m_oTopRuler);
        this.m_oTopRuler_horRuler = CreateControl("id_hor_ruler");
        this.m_oTopRuler_horRuler.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
        this.m_oTopRuler_horRuler.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
        this.m_oTopRuler.AddControl(this.m_oTopRuler_horRuler);
        this.m_oScrollHor = CreateControlContainer("id_horscrollpanel");
        this.m_oScrollHor.Bounds.SetParams(0, 0, ScrollWidthMm, 1000, false, false, true, false, -1, ScrollWidthMm);
        this.m_oScrollHor.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
        this.m_oMainContent.AddControl(this.m_oScrollHor);
        this.m_oNotesContainer = CreateControlContainer("id_panel_notes");
        this.m_oNotesContainer.Bounds.SetParams(this.Splitter1Pos + GlobalSkin.SplitterWidthMM, 0, g_dKoef_pix_to_mm, 1000, true, true, true, false, -1, this.Splitter2Pos);
        this.m_oNotesContainer.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oNotesContainer);
        this.m_oNotes = CreateControl("id_notes");
        this.m_oNotes.Bounds.SetParams(0, 0, ScrollWidthMm, 1000, false, false, true, false, -1, -1);
        this.m_oNotes.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oNotesContainer.AddControl(this.m_oNotes);
        this.m_oNotes_scroll = CreateControl("id_vertical_scroll_notes");
        this.m_oNotes_scroll.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, ScrollWidthMm, -1);
        this.m_oNotes_scroll.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oNotesContainer.AddControl(this.m_oNotes_scroll);
        if (!GlobalSkin.SupportNotes) {
            this.m_oNotesContainer.HtmlElement.style.display = "none";
        }
        this.m_oMainView = CreateControlContainer("id_main_view");
        this.m_oMainView.Bounds.SetParams(5, 7, ScrollWidthMm, 0, true, true, true, true, -1, -1);
        this.m_oMainView.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
        this.m_oMainContent.AddControl(this.m_oMainView);
        this.m_oEditor = CreateControl("id_viewer");
        this.m_oEditor.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
        this.m_oEditor.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oMainView.AddControl(this.m_oEditor);
        this.m_oOverlay = CreateControl("id_viewer_overlay");
        this.m_oOverlay.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
        this.m_oOverlay.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oMainView.AddControl(this.m_oOverlay);
        this.m_oDrawingDocument.TargetHtmlElement = document.getElementById("id_target_cursor");
        this.UnShowOverlay();
        this.m_oOverlayApi.m_oControl = this.m_oOverlay;
        this.m_oOverlayApi.m_oHtmlPage = this;
        this.m_oOverlayApi.Clear();
        this.m_oDrawingDocument.AutoShapesTrack = new CAutoshapeTrack();
        this.m_oDrawingDocument.AutoShapesTrack.init2(this.m_oOverlayApi);
        this.SlideDrawer.m_oWordControl = this;
        this.checkNeedRules();
        this.initEvents();
        this.OnResize(true);
    };
    this.CheckRetinaDisplay = function () {
        var old = this.bIsRetinaSupport;
        if (!this.bIsRetinaNoSupportAttack) {
            this.bIsRetinaSupport = AscBrowser.isRetina;
            this.m_oOverlayApi.IsRetina = this.bIsRetinaSupport;
        } else {
            this.bIsRetinaSupport = false;
        }
        if (old != this.bIsRetinaSupport) {
            this.onButtonTabsDraw();
        }
    };
    this.CheckRetinaElement = function (htmlElem) {
        if (this.bIsRetinaSupport) {
            if (htmlElem.id == "id_viewer" || (htmlElem.id == "id_viewer_overlay" && this.m_oOverlayApi.IsRetina) || htmlElem.id == "id_hor_ruler" || htmlElem.id == "id_vert_ruler" || htmlElem.id == "id_buttonTabs") {
                return true;
            }
        }
        return false;
    };
    this.ShowOverlay = function () {
        this.m_oOverlayApi.Show();
    };
    this.UnShowOverlay = function () {
        this.m_oOverlayApi.UnShow();
    };
    this.CheckUnShowOverlay = function () {
        var drDoc = this.m_oDrawingDocument;
        return true;
    };
    this.CheckShowOverlay = function () {
        var drDoc = this.m_oDrawingDocument;
        if (drDoc.m_bIsSearching || drDoc.m_bIsSelection) {
            this.ShowOverlay();
        }
    };
    this.initEvents = function () {
        this.arrayEventHandlers[0] = new button_eventHandlers("", "0px 0px", "0px -16px", "0px -32px", this.m_oPanelRight_buttonRulers, this.onButtonRulersClick);
        this.arrayEventHandlers[1] = new button_eventHandlers("", "0px 0px", "0px -16px", "0px -32px", this.m_oPanelRight_buttonPrevPage, this.onPrevPage);
        this.arrayEventHandlers[2] = new button_eventHandlers("", "0px -48px", "0px -64px", "0px -80px", this.m_oPanelRight_buttonNextPage, this.onNextPage);
        this.m_oLeftRuler_buttonsTabs.HtmlElement.onclick = this.onButtonTabsClick;
        this.m_oEditor.HtmlElement.onmousedown = this.onMouseDown;
        this.m_oEditor.HtmlElement.onmousemove = this.onMouseMove;
        this.m_oEditor.HtmlElement.onmouseup = this.onMouseUp;
        this.m_oOverlay.HtmlElement.onmousedown = this.onMouseDown;
        this.m_oOverlay.HtmlElement.onmousemove = this.onMouseMove;
        this.m_oOverlay.HtmlElement.onmouseup = this.onMouseUp;
        var _cur = document.getElementById("id_target_cursor");
        _cur.onmousedown = this.onMouseDown;
        _cur.onmousemove = this.onMouseMove;
        _cur.onmouseup = this.onMouseUp;
        this.m_oMainContent.HtmlElement.onmousewheel = this.onMouseWhell;
        if (this.m_oMainContent.HtmlElement.addEventListener) {
            this.m_oMainContent.HtmlElement.addEventListener("DOMMouseScroll", this.onMouseWhell, false);
        }
        this.m_oBody.HtmlElement.onmousewheel = function (e) {
            e.preventDefault();
            return false;
        };
        this.m_oTopRuler_horRuler.HtmlElement.onmousedown = this.horRulerMouseDown;
        this.m_oTopRuler_horRuler.HtmlElement.onmouseup = this.horRulerMouseUp;
        this.m_oTopRuler_horRuler.HtmlElement.onmousemove = this.horRulerMouseMove;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmousedown = this.verRulerMouseDown;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmouseup = this.verRulerMouseUp;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmousemove = this.verRulerMouseMove;
        window.onkeydown = this.onKeyDown;
        window.onkeypress = this.onKeyPress;
        window.onkeyup = this.onKeyUp;
        this.m_oBody.HtmlElement.onmousemove = this.onBodyMouseMove;
        this.m_oBody.HtmlElement.onmousedown = this.onBodyMouseDown;
        this.m_oBody.HtmlElement.onmouseup = this.onBodyMouseUp;
        this.initEvents2MobileAdvances();
        this.Thumbnails.initEvents();
    };
    this.initEvents2MobileAdvances = function () {
        this.m_oEditor.HtmlElement["ontouchstart"] = function (e) {
            oThis.onMouseDown(e.touches[0]);
            return false;
        };
        this.m_oEditor.HtmlElement["ontouchmove"] = function (e) {
            oThis.onMouseMove(e.touches[0]);
            return false;
        };
        this.m_oEditor.HtmlElement["ontouchend"] = function (e) {
            oThis.onMouseUp(e.changedTouches[0]);
            return false;
        };
        this.m_oOverlay.HtmlElement["ontouchstart"] = function (e) {
            oThis.onMouseDown(e.touches[0]);
            return false;
        };
        this.m_oOverlay.HtmlElement["ontouchmove"] = function (e) {
            oThis.onMouseMove(e.touches[0]);
            return false;
        };
        this.m_oOverlay.HtmlElement["ontouchend"] = function (e) {
            oThis.onMouseUp(e.changedTouches[0]);
            return false;
        };
        this.m_oTopRuler_horRuler.HtmlElement["ontouchstart"] = function (e) {
            oThis.horRulerMouseDown(e.touches[0]);
            return false;
        };
        this.m_oTopRuler_horRuler.HtmlElement["ontouchmove"] = function (e) {
            oThis.horRulerMouseMove(e.touches[0]);
            return false;
        };
        this.m_oTopRuler_horRuler.HtmlElement["ontouchend"] = function (e) {
            oThis.horRulerMouseUp(e.changedTouches[0]);
            return false;
        };
        this.m_oLeftRuler_vertRuler.HtmlElement["ontouchstart"] = function (e) {
            oThis.verRulerMouseDown(e.touches[0]);
            return false;
        };
        this.m_oLeftRuler_vertRuler.HtmlElement["ontouchmove"] = function (e) {
            oThis.verRulerMouseMove(e.touches[0]);
            return false;
        };
        this.m_oLeftRuler_vertRuler.HtmlElement["ontouchend"] = function (e) {
            oThis.verRulerMouseUp(e.changedTouches[0]);
            return false;
        };
    };
    this.onButtonRulersClick = function () {
        if (false === oThis.m_oApi.bInit_word_control || true === oThis.m_oApi.isViewMode) {
            return;
        }
        oThis.m_bIsRuler = !oThis.m_bIsRuler;
        oThis.checkNeedRules();
        oThis.OnResize(true);
    };
    this.HideRulers = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (oThis.m_bIsRuler === false) {
            return;
        }
        oThis.m_bIsRuler = !oThis.m_bIsRuler;
        oThis.checkNeedRules();
        oThis.OnResize(true);
    };
    this.zoom_FitToWidth = function () {
        if (null == this.m_oLogicDocument) {
            this.m_nZoomType = 1;
            return;
        }
        var w = this.m_oEditor.HtmlElement.width;
        if (this.bIsRetinaSupport) {
            w >>= 1;
        }
        var Zoom = 100;
        var _pageWidth = this.m_oLogicDocument.Width * g_dKoef_mm_to_pix;
        if (0 != _pageWidth) {
            Zoom = 100 * (w - 2 * this.SlideDrawer.CONST_BORDER) / _pageWidth;
            if (Zoom < 5) {
                Zoom = 5;
            }
        }
        var _new_value = Zoom >> 0;
        this.m_nZoomType = 1;
        if (_new_value != this.m_nZoomValue) {
            this.m_nZoomValue = _new_value;
            this.zoom_Fire(1);
            return true;
        } else {
            this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 1);
        }
        return false;
    };
    this.zoom_FitToPage = function () {
        if (null == this.m_oLogicDocument) {
            this.m_nZoomType = 2;
            return;
        }
        var w = this.m_oEditor.HtmlElement.width;
        if (this.bIsRetinaSupport) {
            w >>= 1;
        }
        var h = (((this.m_oBody.AbsolutePosition.B - this.m_oBody.AbsolutePosition.T) - (this.m_oTopRuler.AbsolutePosition.B - this.m_oTopRuler.AbsolutePosition.T)) * g_dKoef_mm_to_pix) >> 0;
        var _pageWidth = this.m_oLogicDocument.Width * g_dKoef_mm_to_pix;
        var _pageHeight = this.m_oLogicDocument.Height * g_dKoef_mm_to_pix;
        var _hor_Zoom = 100;
        if (0 != _pageWidth) {
            _hor_Zoom = (100 * (w - 2 * this.SlideDrawer.CONST_BORDER)) / _pageWidth;
        }
        var _ver_Zoom = 100;
        if (0 != _pageHeight) {
            _ver_Zoom = (100 * (h - 2 * this.SlideDrawer.CONST_BORDER)) / _pageHeight;
        }
        var _new_value = (Math.min(_hor_Zoom, _ver_Zoom) - 0.5) >> 0;
        if (_new_value < 5) {
            _new_value = 5;
        }
        this.m_nZoomType = 2;
        if (_new_value != this.m_nZoomValue) {
            this.m_nZoomValue = _new_value;
            this.zoom_Fire(2);
            return true;
        } else {
            this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 2);
        }
        return false;
    };
    this.zoom_Fire = function (type) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        this.m_nZoomType = type;
        g_fontManager.ClearRasterMemory();
        var oWordControl = oThis;
        oWordControl.m_bIsRePaintOnScroll = false;
        var dPosition = 0;
        if (oWordControl.m_dScrollY_max != 0) {
            dPosition = oWordControl.m_dScrollY / oWordControl.m_dScrollY_max;
        }
        oWordControl.CheckZoom();
        oWordControl.CalculateDocumentSize();
        var lCurPage = oWordControl.m_oDrawingDocument.SlideCurrent;
        this.GoToPage(lCurPage, true);
        this.ZoomFreePageNum = lCurPage;
        if (-1 != lCurPage) {
            this.CreateBackgroundHorRuler();
            oWordControl.m_bIsUpdateHorRuler = true;
            this.CreateBackgroundVerRuler();
            oWordControl.m_bIsUpdateVerRuler = true;
        }
        var lPosition = parseInt(dPosition * oWordControl.m_oScrollVerApi.getMaxScrolledY());
        oWordControl.m_oScrollVerApi.scrollToY(lPosition);
        this.ZoomFreePageNum = -1;
        oWordControl.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, type);
        oWordControl.m_bIsUpdateTargetNoAttack = true;
        oWordControl.m_bIsRePaintOnScroll = true;
        oWordControl.OnScroll();
    };
    this.zoom_Out = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var _zooms = oThis.zoom_values;
        var _count = _zooms.length;
        var _Zoom = _zooms[0];
        for (var i = (_count - 1); i >= 0; i--) {
            if (this.m_nZoomValue > _zooms[i]) {
                _Zoom = _zooms[i];
                break;
            }
        }
        oThis.m_nZoomValue = _Zoom;
        oThis.zoom_Fire(0);
    };
    this.zoom_In = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var _zooms = oThis.zoom_values;
        var _count = _zooms.length;
        var _Zoom = _zooms[_count - 1];
        for (var i = 0; i < _count; i++) {
            if (this.m_nZoomValue < _zooms[i]) {
                _Zoom = _zooms[i];
                break;
            }
        }
        oThis.m_nZoomValue = _Zoom;
        oThis.zoom_Fire(0);
    };
    this.DisableRulerMarkers = function () {
        if (!this.IsEnabledRulerMarkers) {
            return;
        }
        this.IsEnabledRulerMarkers = false;
        this.m_oHorRuler.RepaintChecker.BlitAttack = true;
        this.m_oHorRuler.IsCanMoveAnyMarkers = false;
        this.m_oHorRuler.IsDrawAnyMarkers = false;
        this.m_oHorRuler.m_dMarginLeft = 0;
        this.m_oHorRuler.m_dMarginRight = this.m_oLogicDocument.Width;
        this.m_oVerRuler.m_dMarginTop = 0;
        this.m_oVerRuler.m_dMarginBottom = this.m_oLogicDocument.Height;
        this.m_oVerRuler.RepaintChecker.BlitAttack = true;
        if (this.m_bIsRuler) {
            this.UpdateHorRuler();
            this.UpdateVerRuler();
        }
    };
    this.EnableRulerMarkers = function () {
        if (this.IsEnabledRulerMarkers) {
            return;
        }
        this.IsEnabledRulerMarkers = true;
        this.m_oHorRuler.RepaintChecker.BlitAttack = true;
        this.m_oHorRuler.IsCanMoveAnyMarkers = true;
        this.m_oHorRuler.IsDrawAnyMarkers = true;
        if (this.m_bIsRuler) {
            this.UpdateHorRuler();
        }
    };
    this.ToSearchResult = function () {
        var naviG = this.m_oDrawingDocument.CurrentSearchNavi;
        if (naviG.Page == -1) {
            return;
        }
        var navi = naviG.Place[0];
        var x = navi.X;
        var y = navi.Y;
        var rectSize = (navi.H * this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var pos = this.m_oDrawingDocument.ConvertCoordsToCursor2(x, y, navi.PageNum);
        if (true === pos.Error) {
            return;
        }
        var boxX = 0;
        var boxY = 0;
        var w = this.m_oEditor.HtmlElement.width;
        if (this.bIsRetinaSupport) {
            w >>= 1;
        }
        var h = this.m_oEditor.HtmlElement.height;
        if (this.bIsRetinaSupport) {
            h >>= 1;
        }
        var boxR = w - 2;
        var boxB = h - rectSize;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = this.GetHorizontalScrollTo(x, navi.PageNum);
        }
        if (pos.X > boxR) {
            var _mem = x - g_dKoef_pix_to_mm * w * 100 / this.m_nZoomValue;
            nValueScrollHor = this.GetHorizontalScrollTo(_mem, navi.PageNum);
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = this.GetVerticalScrollTo(y, navi.PageNum);
        }
        if (pos.Y > boxB) {
            var _mem = y + navi.H + 10 - g_dKoef_pix_to_mm * h * 100 / this.m_nZoomValue;
            nValueScrollVer = this.GetVerticalScrollTo(_mem, navi.PageNum);
        }
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollHor * this.m_dScrollX_max / (this.m_dDocumentWidth - w);
            this.m_oScrollHorApi.scrollToX(parseInt(temp), false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollVer * this.m_dScrollY_max / (this.m_dDocumentHeight - h);
            this.m_oScrollVerApi.scrollToY(parseInt(temp), false);
        }
        if (true === isNeedScroll) {
            this.OnScroll();
            return;
        }
        this.OnUpdateOverlay();
    };
    this.onButtonTabsClick = function () {
        var oWordControl = oThis;
        if (oWordControl.m_nTabsType == g_tabtype_left) {
            oWordControl.m_nTabsType = g_tabtype_center;
            oWordControl.onButtonTabsDraw();
        } else {
            if (oWordControl.m_nTabsType == g_tabtype_center) {
                oWordControl.m_nTabsType = g_tabtype_right;
                oWordControl.onButtonTabsDraw();
            } else {
                oWordControl.m_nTabsType = g_tabtype_left;
                oWordControl.onButtonTabsDraw();
            }
        }
    };
    this.onButtonTabsDraw = function () {
        var _ctx = this.m_oLeftRuler_buttonsTabs.HtmlElement.getContext("2d");
        if (this.bIsRetinaSupport) {
            _ctx.setTransform(2, 0, 0, 2, 0, 0);
        } else {
            _ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        var _width = 19;
        var _height = 19;
        _ctx.clearRect(0, 0, 19, 19);
        _ctx.lineWidth = 1;
        _ctx.strokeStyle = "#BBBEC2";
        _ctx.strokeRect(2.5, 3.5, 14, 14);
        _ctx.beginPath();
        _ctx.strokeStyle = "#3E3E3E";
        _ctx.lineWidth = 2;
        if (this.m_nTabsType == g_tabtype_left) {
            _ctx.moveTo(8, 9);
            _ctx.lineTo(8, 14);
            _ctx.lineTo(13, 14);
        } else {
            if (this.m_nTabsType == g_tabtype_center) {
                _ctx.moveTo(6, 14);
                _ctx.lineTo(14, 14);
                _ctx.moveTo(10, 9);
                _ctx.lineTo(10, 14);
            } else {
                _ctx.moveTo(12, 9);
                _ctx.lineTo(12, 14);
                _ctx.lineTo(7, 14);
            }
        }
        _ctx.stroke();
        _ctx.beginPath();
    };
    this.onPrevPage = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (0 < oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.GoToPage(oWordControl.m_oDrawingDocument.SlideCurrent - 1);
        } else {
            oWordControl.GoToPage(0);
        }
    };
    this.onNextPage = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if ((oWordControl.m_oDrawingDocument.SlidesCount - 1) > oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.GoToPage(oWordControl.m_oDrawingDocument.SlideCurrent + 1);
        } else {
            if (oWordControl.m_oDrawingDocument.SlidesCount > 0) {
                oWordControl.GoToPage(oWordControl.m_oDrawingDocument.SlidesCount - 1);
            }
        }
    };
    this.horRulerMouseDown = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oHorRuler.OnMouseDown(oWordControl.m_oDrawingDocument.SlideCurrectRect.left, 0, e);
        }
    };
    this.horRulerMouseUp = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oHorRuler.OnMouseUp(oWordControl.m_oDrawingDocument.SlideCurrectRect.left, 0, e);
        }
    };
    this.horRulerMouseMove = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oHorRuler.OnMouseMove(oWordControl.m_oDrawingDocument.SlideCurrectRect.left, 0, e);
        }
    };
    this.verRulerMouseDown = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oVerRuler.OnMouseDown(0, oWordControl.m_oDrawingDocument.SlideCurrectRect.top, e);
        }
    };
    this.verRulerMouseUp = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oVerRuler.OnMouseUp(0, oWordControl.m_oDrawingDocument.SlideCurrectRect.top, e);
        }
    };
    this.verRulerMouseMove = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        if (-1 != oWordControl.m_oDrawingDocument.SlideCurrent) {
            oWordControl.m_oVerRuler.OnMouseMove(0, oWordControl.m_oDrawingDocument.SlideCurrectRect.top, e);
        }
    };
    this.SelectWheel = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        var positionMinY = oWordControl.m_oMainContent.AbsolutePosition.T * g_dKoef_mm_to_pix + oWordControl.Y;
        if (oWordControl.m_bIsRuler) {
            positionMinY = (oWordControl.m_oMainContent.AbsolutePosition.T + oWordControl.m_oTopRuler_horRuler.AbsolutePosition.B) * g_dKoef_mm_to_pix + oWordControl.Y;
        }
        var positionMaxY = oWordControl.m_oMainContent.AbsolutePosition.B * g_dKoef_mm_to_pix + oWordControl.Y;
        var scrollYVal = 0;
        if (global_mouseEvent.Y < positionMinY) {
            var delta = 30;
            if (20 > (positionMinY - global_mouseEvent.Y)) {
                delta = 10;
            }
            scrollYVal = -delta;
        } else {
            if (global_mouseEvent.Y > positionMaxY) {
                var delta = 30;
                if (20 > (global_mouseEvent.Y - positionMaxY)) {
                    delta = 10;
                }
                scrollYVal = delta;
            }
        }
        var scrollXVal = 0;
        if (oWordControl.m_bIsHorScrollVisible) {
            var positionMinX = oWordControl.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix + oWordControl.X;
            if (oWordControl.m_bIsRuler) {
                positionMinX += oWordControl.m_oLeftRuler.AbsolutePosition.R * g_dKoef_mm_to_pix;
            }
            var positionMaxX = oWordControl.m_oMainContent.AbsolutePosition.R * g_dKoef_mm_to_pix + oWordControl.X - oWordControl.ScrollWidthPx;
            if (global_mouseEvent.X < positionMinX) {
                var delta = 30;
                if (20 > (positionMinX - global_mouseEvent.X)) {
                    delta = 10;
                }
                scrollXVal = -delta;
            } else {
                if (global_mouseEvent.X > positionMaxX) {
                    var delta = 30;
                    if (20 > (global_mouseEvent.X - positionMaxX)) {
                        delta = 10;
                    }
                    scrollXVal = delta;
                }
            }
        }
        if (0 != scrollYVal) {
            if (((oWordControl.m_dScrollY + scrollYVal) >= oWordControl.SlideScrollMIN) && ((oWordControl.m_dScrollY + scrollYVal) <= oWordControl.SlideScrollMAX)) {
                oWordControl.m_oScrollVerApi.scrollByY(scrollYVal, false);
            }
        }
        if (0 != scrollXVal) {
            oWordControl.m_oScrollHorApi.scrollByX(scrollXVal, false);
        }
        if (scrollXVal != 0 || scrollYVal != 0) {
            oWordControl.onMouseMove2();
        }
    };
    this.createSplitterDiv = function (bIsVert) {
        var Splitter = document.createElement("div");
        Splitter.id = "splitter_id";
        Splitter.style.position = "absolute";
        Splitter.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjMxN4N3hgAAAB9JREFUGFdj+P//PwsDAwOQ+m8PooEYwQELwmRwqgAAbXwhnmjs9sgAAAAASUVORK5CYII=)";
        if (bIsVert) {
            Splitter.style.left = parseInt(this.Splitter1Pos * g_dKoef_mm_to_pix) + "px";
            Splitter.style.top = "0px";
            Splitter.style.width = parseInt(GlobalSkin.SplitterWidthMM * g_dKoef_mm_to_pix) + "px";
            Splitter.style.height = this.Height + "px";
            this.SplitterType = 1;
            Splitter.style.backgroundRepeat = "repeat-y";
        } else {
            Splitter.style.left = parseInt((this.Splitter1Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix) + "px";
            Splitter.style.top = this.Height - parseInt((this.Splitter2Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix) + "px";
            Splitter.style.width = this.Width - parseInt((this.Splitter1Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix) + "px";
            Splitter.style.height = parseInt(GlobalSkin.SplitterWidthMM * g_dKoef_mm_to_pix) + "px";
            this.SplitterType = 2;
            Splitter.style.backgroundRepeat = "repeat-x";
        }
        Splitter.style.overflow = "hidden";
        Splitter.style.zIndex = 1000;
        Splitter.setAttribute("contentEditable", false);
        this.SplitterDiv = Splitter;
        this.m_oBody.HtmlElement.appendChild(this.SplitterDiv);
    };
    this.onBodyMouseDown = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var _isCatch = false;
        var downClick = global_mouseEvent.ClickCount;
        check_MouseDownEvent(e, true);
        global_mouseEvent.ClickCount = downClick;
        global_mouseEvent.LockMouse();
        var oWordControl = oThis;
        var x1 = oWordControl.Splitter1Pos * g_dKoef_mm_to_pix;
        var x2 = (oWordControl.Splitter1Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix;
        var y1 = oWordControl.Height - ((oWordControl.Splitter2Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix);
        var y2 = oWordControl.Height - (oWordControl.Splitter2Pos * g_dKoef_mm_to_pix);
        var _x = global_mouseEvent.X - oWordControl.X;
        var _y = global_mouseEvent.Y - oWordControl.Y;
        if (_x >= x1 && _x <= x2 && _y >= 0 && _y <= oWordControl.Height && (oThis.IsUseNullThumbnailsSplitter || (oThis.Splitter1Pos != 0))) {
            oWordControl.m_oBody.HtmlElement.style.cursor = "w-resize";
            oWordControl.createSplitterDiv(true);
            _isCatch = true;
        } else {
            if (_x >= x2 && _x <= oWordControl.Width && _y >= y1 && _y <= y2) {
                oWordControl.m_oBody.HtmlElement.style.cursor = "s-resize";
                oWordControl.createSplitterDiv(false);
                _isCatch = true;
            } else {
                oWordControl.m_oBody.HtmlElement.style.cursor = "default";
            }
        }
        if (_isCatch) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    };
    this.onBodyMouseMove = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var _isCatch = false;
        check_MouseMoveEvent(e, true);
        var oWordControl = oThis;
        if (null == oWordControl.SplitterDiv) {
            var x1 = oWordControl.Splitter1Pos * g_dKoef_mm_to_pix;
            var x2 = (oWordControl.Splitter1Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix;
            var y1 = oWordControl.Height - ((oWordControl.Splitter2Pos + GlobalSkin.SplitterWidthMM) * g_dKoef_mm_to_pix);
            var y2 = oWordControl.Height - (oWordControl.Splitter2Pos * g_dKoef_mm_to_pix);
            var _x = global_mouseEvent.X - oWordControl.X;
            var _y = global_mouseEvent.Y - oWordControl.Y;
            if (_x >= x1 && _x <= x2 && _y >= 0 && _y <= oWordControl.Height) {
                oWordControl.m_oBody.HtmlElement.style.cursor = "w-resize";
            } else {
                if (_x >= x2 && _x <= oWordControl.Width && _y >= y1 && _y <= y2) {
                    oWordControl.m_oBody.HtmlElement.style.cursor = "s-resize";
                } else {
                    oWordControl.m_oBody.HtmlElement.style.cursor = "default";
                }
            }
        } else {
            var _x = global_mouseEvent.X - oWordControl.X;
            var _y = global_mouseEvent.Y - oWordControl.Y;
            if (1 == oWordControl.SplitterType) {
                var _min = parseInt(oWordControl.Splitter1PosMin * g_dKoef_mm_to_pix);
                var _max = parseInt(oWordControl.Splitter1PosMax * g_dKoef_mm_to_pix);
                if (_x > _max) {
                    _x = _max;
                } else {
                    if (_x < (_min / 2)) {
                        _x = 0;
                    } else {
                        if (_x < _min) {
                            _x = _min;
                        }
                    }
                }
                oWordControl.m_oBody.HtmlElement.style.cursor = "w-resize";
                oWordControl.SplitterDiv.style.left = _x + "px";
            } else {
                var _max = oWordControl.Height - parseInt(oWordControl.Splitter2PosMin * g_dKoef_mm_to_pix);
                var _min = oWordControl.Height - parseInt(oWordControl.Splitter2PosMax * g_dKoef_mm_to_pix);
                if (_y < _min) {
                    _y = _min;
                } else {
                    if (_y > _max) {
                        _y = _max;
                    }
                }
                oWordControl.m_oBody.HtmlElement.style.cursor = "s-resize";
                oWordControl.SplitterDiv.style.top = (_y - parseInt(GlobalSkin.SplitterWidthMM * g_dKoef_mm_to_pix)) + "px";
            }
            _isCatch = true;
        }
        if (_isCatch) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    };
    this.OnResizeSplitter = function () {
        this.OldSplitter1Pos = this.Splitter1Pos;
        this.m_oThumbnailsContainer.Bounds.R = this.Splitter1Pos;
        this.m_oThumbnailsContainer.Bounds.AbsW = this.Splitter1Pos;
        if (!this.IsSupportNotes) {
            this.Splitter2Pos = 0;
        }
        if (this.IsUseNullThumbnailsSplitter || (0 != this.Splitter1Pos)) {
            this.m_oMainContent.Bounds.L = this.Splitter1Pos + GlobalSkin.SplitterWidthMM;
            this.m_oMainContent.Bounds.B = GlobalSkin.SupportNotes ? this.Splitter2Pos + GlobalSkin.SplitterWidthMM : 1000;
            this.m_oNotesContainer.Bounds.L = this.Splitter1Pos + GlobalSkin.SplitterWidthMM;
            this.m_oNotesContainer.Bounds.AbsH = this.Splitter2Pos;
            this.m_oThumbnailsContainer.HtmlElement.style.display = "block";
            this.m_oMainContent.HtmlElement.style.borderLeft = "1px" + GlobalSkin.BorderSplitterColor + " solid";
        } else {
            this.m_oMainContent.Bounds.L = 0;
            this.m_oMainContent.Bounds.B = GlobalSkin.SupportNotes ? this.Splitter2Pos + GlobalSkin.SplitterWidthMM : 1000;
            this.m_oNotesContainer.Bounds.L = 0;
            this.m_oNotesContainer.Bounds.AbsH = this.Splitter2Pos;
            this.m_oThumbnailsContainer.HtmlElement.style.display = "none";
            this.m_oMainContent.HtmlElement.style.borderLeft = "1px" + GlobalSkin.BorderSplitterColor + " none";
        }
        this.OnResize2(true);
    };
    this.onBodyMouseUp = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var _isCatch = false;
        check_MouseUpEvent(e, true);
        var oWordControl = oThis;
        oWordControl.m_oDrawingDocument.UnlockCursorType();
        if (null != oWordControl.SplitterDiv) {
            var _x = parseInt(oWordControl.SplitterDiv.style.left);
            var _y = parseInt(oWordControl.SplitterDiv.style.top);
            if (oWordControl.SplitterType == 1) {
                var _posX = _x * g_dKoef_pix_to_mm;
                if (Math.abs(oWordControl.Splitter1Pos - _posX) > 1) {
                    oWordControl.Splitter1Pos = _posX;
                    oWordControl.OnResizeSplitter();
                    oWordControl.m_oApi.syncOnThumbnailsShow();
                }
            } else {
                var _posY = (oWordControl.Height - _y) * g_dKoef_pix_to_mm - GlobalSkin.SplitterWidthMM;
                if (Math.abs(oWordControl.Splitter2Pos - _posY) > 1) {
                    oWordControl.Splitter2Pos = _posY;
                    oWordControl.OnResizeSplitter();
                }
            }
            oWordControl.m_oBody.HtmlElement.removeChild(oWordControl.SplitterDiv);
            oWordControl.SplitterDiv = null;
            oWordControl.SplitterType = 0;
            _isCatch = true;
        }
        if (_isCatch) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    };
    this.onMouseDown = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (oWordControl.m_oDrawingDocument.TransitionSlide.IsPlaying()) {
            oWordControl.m_oDrawingDocument.TransitionSlide.End(true);
        }
        if (!oThis.m_bIsIE) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
        oWordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
        if (oWordControl.DemonstrationManager.Mode) {
            return false;
        }
        var _xOffset = oWordControl.X;
        var _yOffset = oWordControl.Y;
        if (true === oWordControl.m_bIsRuler) {
            _xOffset += (5 * g_dKoef_mm_to_pix);
            _yOffset += (7 * g_dKoef_mm_to_pix);
        }
        if (window.closeDialogs != undefined) {
            closeDialogs();
        }
        check_MouseDownEvent(e, true);
        global_mouseEvent.LockMouse();
        if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button)) {
            global_mouseEvent.Button = 0;
            oWordControl.m_bIsMouseLock = true;
            if (oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
                oWordControl.m_oLogicDocument.addNextSlide();
                return;
            }
        }
        if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button) || (2 == global_mouseEvent.Button)) {
            var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            if (pos.Page == -1) {
                return;
            }
            oWordControl.StartUpdateOverlay();
            oWordControl.m_oDrawingDocument.m_lCurrentPage = pos.Page;
            oWordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
            oWordControl.EndUpdateOverlay();
        } else {
            var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            if (pos.Page == -1) {
                return;
            }
            oWordControl.m_oDrawingDocument.m_lCurrentPage = pos.Page;
        }
        if (-1 == oWordControl.m_oTimerScrollSelect) {
            oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
        }
        oWordControl.Thumbnails.SetFocusElement(FOCUS_OBJECT_MAIN);
    };
    this.onMouseMove = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        if (oWordControl.DemonstrationManager.Mode) {
            return false;
        }
        if (oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
            return;
        }
        check_MouseMoveEvent(e);
        var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        if (pos.Page == -1) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.m_sLockedCursorType != "") {
            oWordControl.m_oDrawingDocument.SetCursorType("default");
        }
        oWordControl.StartUpdateOverlay();
        oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseMove2 = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        if (pos.Page == -1) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
            return;
        }
        oWordControl.StartUpdateOverlay();
        oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseUp = function (e, bIsWindow) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (!global_mouseEvent.IsLocked) {
            return;
        }
        if (oWordControl.DemonstrationManager.Mode) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        check_MouseUpEvent(e);
        if (oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
            return;
        }
        var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        if (pos.Page == -1) {
            return;
        }
        oWordControl.m_oDrawingDocument.UnlockCursorType();
        oWordControl.m_bIsMouseLock = false;
        if (oWordControl.m_oDrawingDocument.TableOutlineDr.bIsTracked) {
            oWordControl.m_oDrawingDocument.TableOutlineDr.checkMouseUp(global_mouseEvent.X, global_mouseEvent.Y, oWordControl);
            oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            oWordControl.m_oLogicDocument.Document_UpdateRulersState();
            if (-1 != oWordControl.m_oTimerScrollSelect) {
                clearInterval(oWordControl.m_oTimerScrollSelect);
                oWordControl.m_oTimerScrollSelect = -1;
            }
            oWordControl.OnUpdateOverlay();
            return;
        }
        if (-1 != oWordControl.m_oTimerScrollSelect) {
            clearInterval(oWordControl.m_oTimerScrollSelect);
            oWordControl.m_oTimerScrollSelect = -1;
        }
        oWordControl.m_bIsMouseUpSend = true;
        oWordControl.StartUpdateOverlay();
        oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.m_bIsMouseUpSend = false;
        oWordControl.m_oLogicDocument.Document_UpdateRulersState();
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseUpExternal = function (x, y) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (oWordControl.DemonstrationManager.Mode) {
            return oWordControl.DemonstrationManager.onMouseUp(e);
        }
        global_mouseEvent.X = x;
        global_mouseEvent.Y = y;
        global_mouseEvent.Type = g_mouse_event_type_up;
        g_bIsMouseUpLockedSend = true;
        global_mouseEvent.Sender = null;
        global_mouseEvent.UnLockMouse();
        global_mouseEvent.IsPressed = false;
        if (oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
            return;
        }
        var pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        if (pos.Page == -1) {
            return;
        }
        oWordControl.m_oDrawingDocument.UnlockCursorType();
        oWordControl.m_bIsMouseLock = false;
        if (-1 != oWordControl.m_oTimerScrollSelect) {
            clearInterval(oWordControl.m_oTimerScrollSelect);
            oWordControl.m_oTimerScrollSelect = -1;
        }
        oWordControl.StartUpdateOverlay();
        oWordControl.m_bIsMouseUpSend = true;
        oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.m_bIsMouseUpSend = false;
        oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        oWordControl.m_oLogicDocument.Document_UpdateRulersState();
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseWhell = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (oThis.DemonstrationManager.Mode) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        var _ctrl = false;
        if (e.metaKey !== undefined) {
            _ctrl = e.ctrlKey || e.metaKey;
        } else {
            _ctrl = e.ctrlKey;
        }
        if (true === _ctrl) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        var delta = 0;
        var deltaX = 0;
        var deltaY = 0;
        if (undefined != e.wheelDelta && e.wheelDelta != 0) {
            delta = -45 * e.wheelDelta / 120;
        } else {
            if (undefined != e.detail && e.detail != 0) {
                delta = 45 * e.detail / 3;
            }
        }
        deltaY = delta;
        if (oThis.m_bIsHorScrollVisible) {
            if (e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS) {
                deltaY = 0;
                deltaX = delta;
            }
            if (e.wheelDeltaY !== undefined) {
                if (e.wheelDelta != 0) {
                    deltaY = -45 * e.wheelDeltaY / 120;
                }
            }
            if (e.wheelDeltaX !== undefined) {
                if (e.wheelDeltaX != 0) {
                    deltaX = -45 * e.wheelDeltaX / 120;
                }
            }
        }
        deltaX >>= 0;
        deltaY >>= 0;
        if (0 != deltaX) {
            oThis.m_oScrollHorApi.scrollBy(deltaX, 0, false);
        } else {
            if (0 != deltaY) {
                oThis.m_oScrollVerApi.scrollBy(0, deltaY, false);
            }
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        return false;
    };
    this.onKeyUp = function (e) {
        global_keyboardEvent.AltKey = false;
        global_keyboardEvent.CtrlKey = false;
        global_keyboardEvent.ShiftKey = false;
    };
    this.onKeyDown = function (e) {
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_oApi.asc_IsLongAction() || oWordControl.m_bIsMouseLock === true) {
            return;
        }
        if (oThis.DemonstrationManager.Mode) {
            oWordControl.DemonstrationManager.onKeyDown(e);
            return;
        }
        if (oWordControl.Thumbnails.FocusObjType == FOCUS_OBJECT_THUMBNAILS) {
            var ret = oWordControl.Thumbnails.onKeyDown(e);
            if (false === ret) {
                return false;
            }
            if (undefined === ret) {
                return;
            }
        }
        if (oWordControl.m_oDrawingDocument.TransitionSlide.IsPlaying()) {
            oWordControl.m_oDrawingDocument.TransitionSlide.End(true);
        }
        if (oThis.TextBoxInputMode) {
            oThis.onKeyDownTBIM(e);
            return;
        }
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_oApi.asc_IsLongAction() === true || oWordControl.m_bIsMouseLock === true) {
            return;
        }
        check_KeyboardEvent(e);
        oWordControl.StartUpdateOverlay();
        oWordControl.IsKeyDownButNoPress = true;
        oWordControl.bIsUseKeyPress = (oWordControl.m_oLogicDocument.OnKeyDown(global_keyboardEvent) === true) ? false : true;
        if (false === oWordControl.bIsUseKeyPress || true === global_keyboardEvent.AltKey) {
            e.preventDefault();
        }
        oWordControl.EndUpdateOverlay();
    };
    this.onKeyDownNoActiveControl = function (e) {
        var bSendToEditor = false;
        if (e.CtrlKey && !e.ShiftKey) {
            switch (e.KeyCode) {
            case 80:
                case 83:
                bSendToEditor = true;
                break;
            default:
                break;
            }
        }
        return bSendToEditor;
    };
    this.onKeyDownTBIM = function (e) {
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_oApi.asc_IsLongAction() === true || oWordControl.m_bIsMouseLock === true) {
            return;
        }
        check_KeyboardEvent(e);
        oWordControl.IsKeyDownButNoPress = true;
        if (oWordControl.TextBoxInputFocus) {
            if (global_keyboardEvent.KeyCode == 13) {
                oWordControl.TextBoxInputFocus = false;
                oWordControl.onChangeTB();
                oWordControl.bIsUseKeyPress = false;
                e.preventDefault();
                return false;
            } else {
                if (global_keyboardEvent.KeyCode == 27) {
                    oWordControl.TextBoxInputFocus = false;
                    CollaborativeEditing.m_bGlobalLock = false;
                    this.TextBoxInput.style.zIndex = -1;
                    this.TextBoxInput.style.top = "-1000px";
                    this.TextBoxInputFocus = false;
                    this.ReinitTB();
                    oWordControl.bIsUseKeyPress = false;
                    e.preventDefault();
                    return false;
                }
            }
            return;
        }
        oWordControl.StartUpdateOverlay();
        oWordControl.bIsUseKeyPress = (oWordControl.m_oLogicDocument.OnKeyDown(global_keyboardEvent) === true) ? false : true;
        if (false === oWordControl.bIsUseKeyPress || true === global_keyboardEvent.AltKey) {
            e.preventDefault();
            return false;
        }
        oWordControl.EndUpdateOverlay();
    };
    this.DisableTextEATextboxAttack = function () {
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control) {
            return;
        }
        if (oWordControl.TextBoxInputFocus) {
            oWordControl.TextBoxInputFocus = false;
            CollaborativeEditing.m_bGlobalLock = false;
            this.TextBoxInput.style.zIndex = -1;
            this.TextBoxInput.style.top = "-1000px";
            this.TextBoxInputFocus = false;
            this.ReinitTB();
        }
    };
    this.onKeyPress = function (e) {
        if (oThis.Thumbnails.FocusObjType == FOCUS_OBJECT_THUMBNAILS) {
            return;
        }
        if (oThis.TextBoxInputMode) {
            if (oThis.bIsUseKeyPress === false) {
                return;
            }
            check_KeyboardEvent(e);
            var Code;
            if (null != global_keyboardEvent.Which) {
                Code = global_keyboardEvent.Which;
            } else {
                if (global_keyboardEvent.KeyCode) {
                    Code = global_keyboardEvent.KeyCode;
                } else {
                    Code = 0;
                }
            }
            var bRetValue = false;
            if (Code <= 32) {
                return;
            }
            oThis.TextBoxFocus();
            return;
        }
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_oApi.asc_IsLongAction() === true || oWordControl.m_bIsMouseLock === true) {
            return;
        }
        if (window.opera && !oWordControl.IsKeyDownButNoPress) {
            oWordControl.onKeyDown(e);
        }
        oWordControl.IsKeyDownButNoPress = false;
        if (oThis.DemonstrationManager.Mode) {
            return;
        }
        if (false === oWordControl.bIsUseKeyPress) {
            return;
        }
        if (null == oWordControl.m_oLogicDocument) {
            return;
        }
        check_KeyboardEvent(e);
        oWordControl.StartUpdateOverlay();
        var retValue = oWordControl.m_oLogicDocument.OnKeyPress(global_keyboardEvent);
        if (true === retValue) {
            e.preventDefault();
        }
        oWordControl.EndUpdateOverlay();
    };
    this.verticalScroll = function (sender, scrollPositionY, maxY, isAtTop, isAtBottom) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (0 != this.MainScrollsEnabledFlag) {
            return;
        }
        if (!this.m_oDrawingDocument.IsEmptyPresentation) {
            if (this.StartVerticalScroll) {
                this.VerticalScrollOnMouseUp.ScrollY = scrollPositionY;
                this.VerticalScrollOnMouseUp.ScrollY_max = maxY;
                this.VerticalScrollOnMouseUp.SlideNum = (scrollPositionY * this.m_oDrawingDocument.SlidesCount / Math.max(1, maxY)) >> 0;
                if (this.VerticalScrollOnMouseUp.SlideNum >= this.m_oDrawingDocument.SlidesCount) {
                    this.VerticalScrollOnMouseUp.SlideNum = this.m_oDrawingDocument.SlidesCount - 1;
                }
                this.m_oApi.asc_fireCallback("asc_onPaintSlideNum", this.VerticalScrollOnMouseUp.SlideNum);
                return;
            }
            var lNumSlide = ((scrollPositionY / this.m_dDocumentPageHeight) + 0.01) >> 0;
            var _can_change_slide = true;
            if (-1 != this.ZoomFreePageNum && this.ZoomFreePageNum == this.m_oDrawingDocument.SlideCurrent) {
                _can_change_slide = false;
            }
            if (_can_change_slide) {
                if (lNumSlide != this.m_oDrawingDocument.SlideCurrent) {
                    if (this.IsGoToPageMAXPosition) {
                        if (lNumSlide >= this.m_oDrawingDocument.SlideCurrent) {
                            this.IsGoToPageMAXPosition = false;
                        }
                    }
                    this.GoToPage(lNumSlide);
                    return;
                } else {
                    if (this.SlideScrollMAX < scrollPositionY) {
                        this.IsGoToPageMAXPosition = false;
                        this.GoToPage(this.m_oDrawingDocument.SlideCurrent + 1);
                        return;
                    }
                }
            } else {
                this.GoToPage(this.ZoomFreePageNum);
            }
        } else {
            if (this.StartVerticalScroll) {
                return;
            }
        }
        var oWordControl = oThis;
        oWordControl.m_dScrollY = Math.max(0, Math.min(scrollPositionY, maxY));
        oWordControl.m_dScrollY_max = maxY;
        oWordControl.m_bIsUpdateVerRuler = true;
        oWordControl.m_bIsUpdateTargetNoAttack = true;
        oWordControl.IsGoToPageMAXPosition = false;
        if (oWordControl.m_bIsRePaintOnScroll === true) {
            oWordControl.OnScroll();
        }
    };
    this.verticalScrollMouseUp = function (sender, e) {
        if (0 != this.MainScrollsEnabledFlag || !this.StartVerticalScroll) {
            return;
        }
        if (this.m_oDrawingDocument.IsEmptyPresentation) {
            this.StartVerticalScroll = false;
            this.m_oScrollVerApi.scrollByY(0, true);
            return;
        }
        if (this.VerticalScrollOnMouseUp.SlideNum != this.m_oDrawingDocument.SlideCurrent) {
            this.GoToPage(this.VerticalScrollOnMouseUp.SlideNum);
        } else {
            this.StartVerticalScroll = false;
            this.m_oApi.asc_fireCallback("asc_onEndPaintSlideNum");
            this.m_oScrollVerApi.scrollByY(0, true);
        }
    };
    this.CorrectSpeedVerticalScroll = function (newScrollPos) {
        if (0 != this.MainScrollsEnabledFlag) {
            return;
        }
        this.StartVerticalScroll = true;
        var res = {
            isChange: false,
            Pos: newScrollPos
        };
        return res;
    };
    this.CorrectVerticalScrollByYDelta = function (delta) {
        if (0 != this.MainScrollsEnabledFlag) {
            return;
        }
        this.IsGoToPageMAXPosition = true;
        var res = {
            isChange: false,
            Pos: delta
        };
        if (this.m_dScrollY > this.SlideScrollMIN && (this.m_dScrollY + delta) < this.SlideScrollMIN) {
            res.Pos = this.SlideScrollMIN - this.m_dScrollY;
            res.isChange = true;
        } else {
            if (this.m_dScrollY < this.SlideScrollMAX && (this.m_dScrollY + delta) > this.SlideScrollMAX) {
                res.Pos = this.SlideScrollMAX - this.m_dScrollY;
                res.isChange = true;
            }
        }
        return res;
    };
    this.horizontalScroll = function (sender, scrollPositionX, maxX, isAtLeft, isAtRight) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (0 != this.MainScrollsEnabledFlag) {
            return;
        }
        var oWordControl = oThis;
        oWordControl.m_dScrollX = scrollPositionX;
        oWordControl.m_dScrollX_max = maxX;
        oWordControl.m_bIsUpdateHorRuler = true;
        oWordControl.m_bIsUpdateTargetNoAttack = true;
        if (oWordControl.m_bIsRePaintOnScroll === true) {
            oWordControl.OnScroll();
        }
    };
    this.UpdateScrolls = function () {
        if (window["NATIVE_EDITOR_ENJINE"]) {
            return;
        }
        var settings = {
            showArrows: true,
            animateScroll: false,
            screenW: this.m_oEditor.HtmlElement.width,
            screenH: this.m_oEditor.HtmlElement.height,
            screenAddW: 0,
            screenAddH: 0,
            vsscrollStep: 45,
            hsscrollStep: 45,
            contentH: this.m_dDocumentHeight,
            contentW: this.m_dDocumentWidth
        };
        if (this.m_bIsRuler) {
            settings.screenAddH = this.m_oTopRuler_horRuler.HtmlElement.height;
        }
        if (this.bIsRetinaSupport) {
            settings.screenW >>= 1;
            settings.screenH >>= 1;
            settings.screenAddH >>= 1;
        }
        if (this.m_bIsHorScrollVisible) {
            if (this.m_oScrollHor_) {
                this.m_oScrollHor_.Repos(settings, true, undefined);
            } else {
                this.m_oScrollHor_ = new ScrollObject("id_horizontal_scroll", settings);
                this.m_oScrollHor_.bind("scrollhorizontal", function (evt) {
                    oThis.horizontalScroll(this, evt.scrollD, evt.maxScrollX);
                });
                this.m_oScrollHor_.onLockMouse = function (evt) {
                    check_MouseDownEvent(evt, true);
                    global_mouseEvent.LockMouse();
                };
                this.m_oScrollHor_.offLockMouse = function (evt) {
                    check_MouseUpEvent(evt);
                };
                this.m_oScrollHorApi = this.m_oScrollHor_;
            }
        }
        if (this.m_oScrollVer_) {
            this.m_oScrollVer_.Repos(settings, undefined, true);
        } else {
            this.m_oScrollVer_ = new ScrollObject("id_vertical_scroll", settings);
            this.m_oScrollVer_.onLockMouse = function (evt) {
                check_MouseDownEvent(evt, true);
                global_mouseEvent.LockMouse();
            };
            this.m_oScrollVer_.offLockMouse = function (evt) {
                check_MouseUpEvent(evt);
            };
            this.m_oScrollVer_.bind("scrollvertical", function (evt) {
                oThis.verticalScroll(this, evt.scrollD, evt.maxScrollY);
            });
            this.m_oScrollVer_.bind("mouseup.presentations", function (evt) {
                oThis.verticalScrollMouseUp(this, evt);
            });
            this.m_oScrollVer_.bind("correctVerticalScroll", function (yPos) {
                return oThis.CorrectSpeedVerticalScroll(yPos);
            });
            this.m_oScrollVer_.bind("correctVerticalScrollDelta", function (delta) {
                return oThis.CorrectVerticalScrollByYDelta(delta);
            });
            this.m_oScrollVerApi = this.m_oScrollVer_;
        }
        if (GlobalSkin.SupportNotes) {
            if (this.m_oScrollNotes_) {
                this.m_oScrollNotes_.Repos(settings);
            } else {
                this.m_oScrollNotes_ = new ScrollObject("id_vertical_scroll_notes", settings);
                this.m_oScrollNotes_.bind("scrollvertical", function (evt) {});
                this.m_oScrollNotesApi = this.m_oScrollNotes_;
            }
        }
        this.m_oApi.asc_fireCallback("asc_onUpdateScrolls", this.m_dDocumentWidth, this.m_dDocumentHeight);
        this.m_dScrollX_max = this.m_bIsHorScrollVisible ? this.m_oScrollHorApi.getMaxScrolledX() : 0;
        this.m_dScrollY_max = this.m_oScrollVerApi.getMaxScrolledY();
        if (this.m_dScrollX >= this.m_dScrollX_max) {
            this.m_dScrollX = this.m_dScrollX_max;
        }
        if (this.m_dScrollY >= this.m_dScrollY_max) {
            this.m_dScrollY = this.m_dScrollY_max;
        }
    };
    this.OnRePaintAttack = function () {
        this.m_bIsFullRepaint = true;
        this.OnScroll();
    };
    this.OnResize = function (isAttack) {
        var isNewSize = this.checkBodySize();
        if (!isNewSize && false === isAttack) {
            this.DemonstrationManager.Resize();
            return;
        }
        this.CheckRetinaDisplay();
        this.m_oBody.Resize(this.Width * g_dKoef_pix_to_mm, this.Height * g_dKoef_pix_to_mm, this);
        this.onButtonTabsDraw();
        this.DemonstrationManager.Resize();
        if (this.checkNeedHorScroll()) {
            return;
        }
        if (1 == this.m_nZoomType && 0 != this.m_dDocumentPageWidth && 0 != this.m_dDocumentPageHeight) {
            if (true === this.zoom_FitToWidth()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll_sync();
                return;
            }
        }
        if (2 == this.m_nZoomType && 0 != this.m_dDocumentPageWidth && 0 != this.m_dDocumentPageHeight) {
            if (true === this.zoom_FitToPage()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll_sync();
                return;
            }
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.m_oHorRuler.RepaintChecker.BlitAttack = true;
        this.m_oVerRuler.RepaintChecker.BlitAttack = true;
        this.Thumbnails.m_bIsUpdate = true;
        this.CalculateDocumentSize();
        this.m_bIsUpdateTargetNoAttack = true;
        this.m_bIsRePaintOnScroll = true;
        this.m_oBoundsController.ClearNoAttack();
        this.OnScroll();
        this.onTimerScroll_sync(true);
        this.DemonstrationManager.Resize();
    };
    this.OnResize2 = function (isAttack) {
        this.m_oBody.Resize(this.Width * g_dKoef_pix_to_mm, this.Height * g_dKoef_pix_to_mm, this);
        this.onButtonTabsDraw();
        this.DemonstrationManager.Resize();
        if (this.checkNeedHorScroll()) {
            return;
        }
        if (1 == this.m_nZoomType) {
            if (true === this.zoom_FitToWidth()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll_sync();
                return;
            }
        }
        if (2 == this.m_nZoomType) {
            if (true === this.zoom_FitToPage()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll_sync();
                return;
            }
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.m_oHorRuler.RepaintChecker.BlitAttack = true;
        this.m_oVerRuler.RepaintChecker.BlitAttack = true;
        this.Thumbnails.m_bIsUpdate = true;
        this.CalculateDocumentSize();
        this.m_bIsUpdateTargetNoAttack = true;
        this.m_bIsRePaintOnScroll = true;
        this.m_oBoundsController.ClearNoAttack();
        this.OnScroll();
        this.onTimerScroll_sync(true);
        this.DemonstrationManager.Resize();
    };
    this.checkNeedRules = function () {
        if (this.m_bIsRuler) {
            this.m_oLeftRuler.HtmlElement.style.display = "block";
            this.m_oTopRuler.HtmlElement.style.display = "block";
            this.m_oMainView.Bounds.L = 5;
            this.m_oMainView.Bounds.T = 7;
        } else {
            this.m_oLeftRuler.HtmlElement.style.display = "none";
            this.m_oTopRuler.HtmlElement.style.display = "none";
            this.m_oMainView.Bounds.L = 0;
            this.m_oMainView.Bounds.T = 0;
        }
    };
    this.checkNeedHorScroll = function () {
        var w = this.m_oEditor.HtmlElement.width;
        if (this.bIsRetinaSupport) {
            w >>= 1;
        }
        var oldVisible = this.m_bIsHorScrollVisible;
        if (this.m_dDocumentWidth <= w) {
            this.m_bIsHorScrollVisible = false;
        } else {
            this.m_bIsHorScrollVisible = true;
        }
        var hor_scroll = document.getElementById("panel_hor_scroll");
        hor_scroll.style.width = this.m_dDocumentWidth + "px";
        if (this.m_bIsHorScrollVisible) {
            this.m_oScrollHor.HtmlElement.style.display = "block";
            this.m_oPanelRight.Bounds.B = this.ScrollWidthPx * g_dKoef_pix_to_mm;
            this.m_oMainView.Bounds.B = this.ScrollWidthPx * g_dKoef_pix_to_mm;
            if (this.m_oApi.isMobileVersion) {
                this.m_oPanelRight.Bounds.B = 0;
                this.m_oMainView.Bounds.B = 0;
            }
        } else {
            if (this.m_bIsCheckHeedHorScrollRepeat && oldVisible == true) {
                this.m_bIsHorScrollVisible = true;
                this.m_dScrollX = 0;
            } else {
                this.m_oPanelRight.Bounds.B = 0;
                this.m_oMainView.Bounds.B = 0;
                this.m_oScrollHor.HtmlElement.style.display = "none";
            }
        }
        if (this.m_bIsHorScrollVisible != oldVisible) {
            this.m_bIsCheckHeedHorScrollRepeat = true;
            this.m_dScrollX = 0;
            this.OnResize(true);
            return true;
        }
        this.m_bIsCheckHeedHorScrollRepeat = false;
        return false;
    };
    this.StartUpdateOverlay = function () {
        this.IsUpdateOverlayOnlyEnd = true;
    };
    this.EndUpdateOverlay = function () {
        this.IsUpdateOverlayOnlyEnd = false;
        if (this.IsUpdateOverlayOnEndCheck) {
            this.OnUpdateOverlay();
        }
        this.IsUpdateOverlayOnEndCheck = false;
    };
    this.OnUpdateOverlay = function () {
        if (this.IsUpdateOverlayOnlyEnd) {
            this.IsUpdateOverlayOnEndCheck = true;
            return false;
        }
        var overlay = this.m_oOverlayApi;
        overlay.SetBaseTransform();
        overlay.Clear();
        var ctx = overlay.m_oContext;
        var drDoc = this.m_oDrawingDocument;
        if (drDoc.SlideCurrent >= drDoc.m_oLogicDocument.Slides.length) {
            drDoc.SlideCurrent = drDoc.m_oLogicDocument.Slides.length - 1;
        }
        if (drDoc.m_bIsSearching) {
            ctx.fillStyle = "rgba(255,200,0,1)";
            ctx.beginPath();
            var drDoc = this.m_oDrawingDocument;
            drDoc.DrawSearch(overlay);
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1;
            if (null != drDoc.CurrentSearchNavi) {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "rgba(51,102,204,255)";
                var places = drDoc.CurrentSearchNavi.Place;
                for (var i = 0; i < places.length; i++) {
                    var place = places[i];
                    if (drDoc.SlideCurrent == place.PageNum) {
                        drDoc.DrawSearchCur(overlay, place);
                    }
                }
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        if (drDoc.m_bIsSelection) {
            ctx.fillStyle = "rgba(51,102,204,255)";
            ctx.strokeStyle = "#9ADBFE";
            ctx.beginPath();
            if (drDoc.SlideCurrent != -1) {
                this.m_oLogicDocument.Slides[drDoc.SlideCurrent].drawSelect(1);
            }
            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.globalAlpha = 1;
        }
        ctx.globalAlpha = 1;
        ctx = null;
        if (this.m_oLogicDocument != null && drDoc.SlideCurrent >= 0) {
            this.m_oLogicDocument.Slides[drDoc.SlideCurrent].drawSelect(2);
            var elements = this.m_oLogicDocument.Slides[this.m_oLogicDocument.CurPage].graphicObjects;
            if (!elements.canReceiveKeyPress() && -1 != drDoc.SlideCurrent) {
                var drawPage = drDoc.SlideCurrectRect;
                drDoc.AutoShapesTrack.init(overlay, drawPage.left, drawPage.top, drawPage.right, drawPage.bottom, this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
                elements.DrawOnOverlay(drDoc.AutoShapesTrack);
                drDoc.AutoShapesTrack.CorrectOverlayBounds();
                overlay.SetBaseTransform();
            }
        }
        drDoc.DrawHorVerAnchor();
        return true;
    };
    this.GetDrawingPageInfo = function (nPageIndex) {
        return {
            drawingPage: this.m_oDrawingDocument.SlideCurrectRect,
            width_mm: this.m_oLogicDocument.Width,
            height_mm: this.m_oLogicDocument.Height
        };
    };
    this.OnCalculatePagesPlace = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var canvas = this.m_oEditor.HtmlElement;
        if (null == canvas) {
            return;
        }
        var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var _bounds_slide = this.SlideDrawer.BoundsChecker.Bounds;
        var _slideW = (dKoef * this.m_oLogicDocument.Width) >> 0;
        var _slideH = (dKoef * this.m_oLogicDocument.Height) >> 0;
        var _srcW = this.m_oEditor.HtmlElement.width;
        var _srcH = this.m_oEditor.HtmlElement.height;
        if (this.bIsRetinaSupport) {
            _srcW >>= 1;
            _srcH >>= 1;
            _bounds_slide = {
                min_x: _bounds_slide.min_x >> 1,
                min_y: _bounds_slide.min_y >> 1,
                max_x: _bounds_slide.max_x >> 1,
                max_y: _bounds_slide.max_y >> 1
            };
        }
        var _centerX = (_srcW / 2) >> 0;
        var _centerSlideX = (dKoef * this.m_oLogicDocument.Width / 2) >> 0;
        var _hor_width_left = Math.min(0, _centerX - (_centerSlideX - _bounds_slide.min_x) - this.SlideDrawer.CONST_BORDER);
        var _hor_width_right = Math.max(_srcW - 1, _centerX + (_bounds_slide.max_x - _centerSlideX) + this.SlideDrawer.CONST_BORDER);
        var _centerY = (_srcH / 2) >> 0;
        var _centerSlideY = (dKoef * this.m_oLogicDocument.Height / 2) >> 0;
        var _ver_height_top = Math.min(0, _centerY - (_centerSlideY - _bounds_slide.min_y) - this.SlideDrawer.CONST_BORDER);
        var _ver_height_bottom = Math.max(_srcH - 1, _centerX + (_bounds_slide.max_y - _centerSlideY) + this.SlideDrawer.CONST_BORDER);
        if (this.m_dScrollY <= this.SlideScrollMIN) {
            this.m_dScrollY = this.SlideScrollMIN;
        }
        if (this.m_dScrollY >= this.SlideScrollMAX) {
            this.m_dScrollY = this.SlideScrollMAX;
        }
        var _x = -this.m_dScrollX + _centerX - _centerSlideX - _hor_width_left;
        var _y = -(this.m_dScrollY - this.SlideScrollMIN) + _centerY - _centerSlideY - _ver_height_top;
        var _x_c = _centerX - _centerSlideX;
        var _y_c = _centerY - _centerSlideY;
        this.m_dScrollX_Central = _centerX - _centerSlideX - _hor_width_left - _x_c;
        this.m_dScrollY_Central = this.SlideScrollMIN + _centerY - _centerSlideY - _ver_height_top - _y_c;
        this.m_oDrawingDocument.SlideCurrectRect.left = _x;
        this.m_oDrawingDocument.SlideCurrectRect.top = _y;
        this.m_oDrawingDocument.SlideCurrectRect.right = _x + _slideW;
        this.m_oDrawingDocument.SlideCurrectRect.bottom = _y + _slideH;
        if (this.m_oApi.isMobileVersion || this.m_oApi.isViewMode) {
            var lPage = this.m_oApi.GetCurrentVisiblePage();
            this.m_oApi.asc_fireCallback("asc_onCurrentVisiblePage", this.m_oApi.GetCurrentVisiblePage());
        }
        if (this.m_bDocumentPlaceChangedEnabled) {
            this.m_oApi.asc_fireCallback("asc_onDocumentPlaceChanged");
        }
    };
    this.OnPaint = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var canvas = this.m_oEditor.HtmlElement;
        if (null == canvas) {
            return;
        }
        var context = canvas.getContext("2d");
        var _width = canvas.width;
        var _height = canvas.height;
        context.fillStyle = GlobalSkin.BackgroundColor;
        context.fillRect(0, 0, _width, _height);
        this.SlideDrawer.DrawSlide(context, this.m_dScrollX, this.m_dScrollX_max, this.m_dScrollY - this.SlideScrollMIN, this.m_dScrollY_max, this.m_oDrawingDocument.SlideCurrent);
        this.OnUpdateOverlay();
        if (this.m_bIsUpdateHorRuler) {
            this.UpdateHorRuler();
            this.m_bIsUpdateHorRuler = false;
        }
        if (this.m_bIsUpdateVerRuler) {
            this.UpdateVerRuler();
            this.m_bIsUpdateVerRuler = false;
        }
        if (this.m_bIsUpdateTargetNoAttack) {
            this.m_oDrawingDocument.UpdateTargetNoAttack();
            this.m_bIsUpdateTargetNoAttack = false;
        }
    };
    this.CheckFontCache = function () {
        var _c = oThis;
        _c.m_nCurrentTimeClearCache++;
        if (_c.m_nCurrentTimeClearCache > 750) {
            _c.m_nCurrentTimeClearCache = 0;
            _c.m_oDrawingDocument.CheckFontCache();
        }
    };
    this.OnScroll = function () {
        this.OnCalculatePagesPlace();
        this.m_bIsScroll = true;
    };
    this.CheckZoom = function () {
        this.m_oDrawingDocument.ClearCachePages();
    };
    this.CalculateDocumentSize = function (bIsAttack) {
        if (false === oThis.m_oApi.bInit_word_control) {
            oThis.UpdateScrolls();
            return;
        }
        this.m_dDocumentWidth = 0;
        this.m_dDocumentHeight = 0;
        this.m_dDocumentPageWidth = 0;
        this.m_dDocumentPageHeight = 0;
        var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        this.SlideBoundsOnCalculateSize.fromBounds(this.SlideDrawer.BoundsChecker.Bounds);
        var _bounds_slide = this.SlideBoundsOnCalculateSize;
        var _srcW = this.m_oEditor.HtmlElement.width;
        var _srcH = this.m_oEditor.HtmlElement.height;
        if (this.bIsRetinaSupport) {
            _srcW >>= 1;
            _srcH >>= 1;
            _bounds_slide = {
                min_x: _bounds_slide.min_x >> 1,
                min_y: _bounds_slide.min_y >> 1,
                max_x: _bounds_slide.max_x >> 1,
                max_y: _bounds_slide.max_y >> 1
            };
        }
        var _centerX = (_srcW / 2) >> 0;
        var _centerSlideX = (dKoef * this.m_oLogicDocument.Width / 2) >> 0;
        var _hor_width_left = Math.min(0, _centerX - (_centerSlideX - _bounds_slide.min_x) - this.SlideDrawer.CONST_BORDER);
        var _hor_width_right = Math.max(_srcW - 1, _centerX + (_bounds_slide.max_x - _centerSlideX) + this.SlideDrawer.CONST_BORDER);
        var _centerY = (_srcH / 2) >> 0;
        var _centerSlideY = (dKoef * this.m_oLogicDocument.Height / 2) >> 0;
        var _ver_height_top = Math.min(0, _centerY - (_centerSlideY - _bounds_slide.min_y) - this.SlideDrawer.CONST_BORDER);
        var _ver_height_bottom = Math.max(_srcH - 1, _centerY + (_bounds_slide.max_y - _centerSlideY) + this.SlideDrawer.CONST_BORDER);
        var lWSlide = _hor_width_right - _hor_width_left + 1;
        var lHSlide = _ver_height_bottom - _ver_height_top + 1;
        var one_slide_width = lWSlide;
        var one_slide_height = Math.max(lHSlide, _srcH);
        this.m_dDocumentPageWidth = one_slide_width;
        this.m_dDocumentPageHeight = one_slide_height;
        this.m_dDocumentWidth = one_slide_width;
        this.m_dDocumentHeight = (one_slide_height * this.m_oDrawingDocument.SlidesCount) >> 0;
        if (0 == this.m_oDrawingDocument.SlidesCount) {
            this.m_dDocumentHeight = one_slide_height >> 0;
        }
        if (!bIsAttack && this.OldDocumentWidth == this.m_dDocumentWidth && this.OldDocumentHeight == this.m_dDocumentHeight) {}
        this.OldDocumentWidth = this.m_dDocumentWidth;
        this.OldDocumentHeight = this.m_dDocumentHeight;
        this.SlideScrollMIN = this.m_oDrawingDocument.SlideCurrent * one_slide_height;
        this.SlideScrollMAX = this.SlideScrollMIN + one_slide_height - _srcH;
        if (0 == this.m_oDrawingDocument.SlidesCount) {
            this.SlideScrollMIN = 0;
            this.SlideScrollMAX = this.SlideScrollMIN + one_slide_height - _srcH;
        }
        if (1 == this.m_nZoomType) {
            if (true === this.zoom_FitToWidth()) {
                return;
            }
        }
        if (2 == this.m_nZoomType) {
            if (true === this.zoom_FitToPage()) {
                return;
            }
        }
        this.MainScrollLock();
        this.checkNeedHorScroll();
        document.getElementById("panel_right_scroll").style.height = this.m_dDocumentHeight + "px";
        this.UpdateScrolls();
        this.MainScrollUnLock();
        this.Thumbnails.SlideWidth = this.m_oLogicDocument.Width;
        this.Thumbnails.SlideHeight = this.m_oLogicDocument.Height;
        this.Thumbnails.SlidesCount = this.m_oDrawingDocument.SlidesCount;
        this.Thumbnails.CheckSizes();
    };
    this.CheckCalculateDocumentSize = function (_bounds) {
        if (false === oThis.m_oApi.bInit_word_control) {
            oThis.UpdateScrolls();
            return;
        }
        if ((Math.abs(_bounds.min_x - this.SlideBoundsOnCalculateSize.min_x) < 0.1) && (Math.abs(_bounds.min_y - this.SlideBoundsOnCalculateSize.min_y) < 0.1) && (Math.abs(_bounds.max_x - this.SlideBoundsOnCalculateSize.max_x) < 0.1) && (Math.abs(_bounds.max_y - this.SlideBoundsOnCalculateSize.max_y) < 0.1)) {
            return;
        }
        this.m_dDocumentWidth = 0;
        this.m_dDocumentHeight = 0;
        this.m_dDocumentPageWidth = 0;
        this.m_dDocumentPageHeight = 0;
        var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        this.SlideBoundsOnCalculateSize.fromBounds(_bounds);
        var _bounds_slide = this.SlideBoundsOnCalculateSize;
        var _srcW = this.m_oEditor.HtmlElement.width;
        var _srcH = this.m_oEditor.HtmlElement.height;
        if (this.bIsRetinaSupport) {
            _srcW >>= 1;
            _srcH >>= 1;
            _bounds_slide = {
                min_x: _bounds_slide.min_x >> 1,
                min_y: _bounds_slide.min_y >> 1,
                max_x: _bounds_slide.max_x >> 1,
                max_y: _bounds_slide.max_y >> 1
            };
        }
        var _centerX = (_srcW / 2) >> 0;
        var _centerSlideX = (dKoef * this.m_oLogicDocument.Width / 2) >> 0;
        var _hor_width_left = Math.min(0, _centerX - (_centerSlideX - _bounds_slide.min_x) - this.SlideDrawer.CONST_BORDER);
        var _hor_width_right = Math.max(_srcW - 1, _centerX + (_bounds_slide.max_x - _centerSlideX) + this.SlideDrawer.CONST_BORDER);
        var _centerY = (_srcH / 2) >> 0;
        var _centerSlideY = (dKoef * this.m_oLogicDocument.Height / 2) >> 0;
        var _ver_height_top = Math.min(0, _centerY - (_centerSlideY - _bounds_slide.min_y) - this.SlideDrawer.CONST_BORDER);
        var _ver_height_bottom = Math.max(_srcH - 1, _centerY + (_bounds_slide.max_y - _centerSlideY) + this.SlideDrawer.CONST_BORDER);
        var lWSlide = _hor_width_right - _hor_width_left + 1;
        var lHSlide = _ver_height_bottom - _ver_height_top + 1;
        var one_slide_width = lWSlide;
        var one_slide_height = Math.max(lHSlide, _srcH);
        this.m_dDocumentPageWidth = one_slide_width;
        this.m_dDocumentPageHeight = one_slide_height;
        this.m_dDocumentWidth = one_slide_width;
        this.m_dDocumentHeight = (one_slide_height * this.m_oDrawingDocument.SlidesCount) >> 0;
        if (0 == this.m_oDrawingDocument.SlidesCount) {
            this.m_dDocumentHeight = one_slide_height >> 0;
        }
        this.OldDocumentWidth = this.m_dDocumentWidth;
        this.OldDocumentHeight = this.m_dDocumentHeight;
        this.SlideScrollMIN = this.m_oDrawingDocument.SlideCurrent * one_slide_height;
        this.SlideScrollMAX = this.SlideScrollMIN + one_slide_height - _srcH;
        if (0 == this.m_oDrawingDocument.SlidesCount) {
            this.SlideScrollMIN = 0;
            this.SlideScrollMAX = this.SlideScrollMIN + one_slide_height - _srcH;
        }
        this.MainScrollLock();
        var bIsResize = this.checkNeedHorScroll();
        document.getElementById("panel_right_scroll").style.height = this.m_dDocumentHeight + "px";
        this.UpdateScrolls();
        this.MainScrollUnLock();
        return bIsResize;
    };
    this.InitDocument = function (bIsEmpty) {
        this.m_oDrawingDocument.m_oWordControl = this;
        this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
        if (false === bIsEmpty) {
            this.m_oLogicDocument.LoadTestDocument();
        }
        this.CalculateDocumentSize();
        this.StartMainTimer();
        this.CreateBackgroundHorRuler();
        this.CreateBackgroundVerRuler();
        this.UpdateHorRuler();
        this.UpdateVerRuler();
    };
    this.InitControl = function () {
        this.Thumbnails.Init();
        this.CalculateDocumentSize();
        this.StartMainTimer();
        this.CreateBackgroundHorRuler();
        this.CreateBackgroundVerRuler();
        this.UpdateHorRuler();
        this.UpdateVerRuler();
        this.m_oApi.syncOnThumbnailsShow();
    };
    this.StartMainTimer = function () {
        if (-1 == this.m_nPaintTimerId) {
            this.onTimerScroll();
        }
    };
    this.onTimerScroll = function (isThUpdateSync) {
        var oWordControl = oThis;
        oWordControl.m_nTimeDrawingLast = new Date().getTime();
        if (oWordControl.m_bIsScroll) {
            oWordControl.m_bIsScroll = false;
            oWordControl.OnPaint();
            if (isThUpdateSync !== undefined) {
                oWordControl.Thumbnails.onCheckUpdate();
            }
        } else {
            oWordControl.Thumbnails.onCheckUpdate();
        }
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            oWordControl.m_oLogicDocument.CheckTargetUpdate();
            oWordControl.m_oDrawingDocument.CheckTargetShow();
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
            oWordControl.CheckFontCache();
        }
        if (oWordControl.m_oApi.autoSaveGap != 0 && !oWordControl.m_oApi.isViewMode && !oWordControl.TextBoxInputFocus) {
            var _curTime = new Date().getTime();
            if (-1 == oWordControl.m_nLastAutosaveTime) {
                oWordControl.m_nLastAutosaveTime = _curTime;
            }
            var _bIsWaitScheme = false;
            if (History.Points && History.Index >= 0 && History.Index < History.Points.length) {
                if ((_curTime - History.Points[History.Index].Time) < oWordControl.m_nIntervalWaitAutoSave) {
                    _bIsWaitScheme = true;
                }
            }
            if (!_bIsWaitScheme) {
                var _interval = (CollaborativeEditing.m_nUseType <= 0) ? oWordControl.m_nIntervalSlowAutosave : oWordControl.m_nIntervalFastAutosave;
                if ((_curTime - oWordControl.m_nLastAutosaveTime) > _interval && !oWordControl.m_oDrawingDocument.TransitionSlide.IsPlaying() && !oWordControl.m_oApi.asc_IsLongAction()) {
                    if (History.Have_Changes() == true) {
                        oWordControl.m_oApi.asc_Save();
                    }
                    oWordControl.m_nLastAutosaveTime = _curTime;
                }
            }
        }
        this.m_nPaintTimerId = setTimeout(oWordControl.onTimerScroll, oWordControl.m_nTimerScrollInterval);
    };
    this.onTimerScroll_sync = function (isThUpdateSync) {
        var oWordControl = oThis;
        oWordControl.m_nTimeDrawingLast = new Date().getTime();
        if (oWordControl.m_bIsScroll) {
            oWordControl.m_bIsScroll = false;
            oWordControl.OnPaint();
            if (isThUpdateSync !== undefined) {
                oWordControl.Thumbnails.onCheckUpdate();
            }
        } else {
            oWordControl.Thumbnails.onCheckUpdate();
        }
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            oWordControl.m_oLogicDocument.CheckTargetUpdate();
            oWordControl.m_oDrawingDocument.CheckTargetShow();
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
            oWordControl.CheckFontCache();
        }
    };
    this.UpdateHorRuler = function () {
        if (!this.m_bIsRuler) {
            return;
        }
        if (this.m_oDrawingDocument.SlideCurrent == -1) {
            return;
        }
        var drawRect = this.m_oDrawingDocument.SlideCurrectRect;
        var _left = drawRect.left;
        this.m_oHorRuler.BlitToMain(_left, 0, this.m_oTopRuler_horRuler.HtmlElement);
    };
    this.UpdateVerRuler = function () {
        if (!this.m_bIsRuler) {
            return;
        }
        if (this.m_oDrawingDocument.SlideCurrent == -1) {
            return;
        }
        var drawRect = this.m_oDrawingDocument.SlideCurrectRect;
        var _top = drawRect.top;
        this.m_oVerRuler.BlitToMain(0, _top, this.m_oLeftRuler_vertRuler.HtmlElement);
    };
    this.SetCurrentPage = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.SlideCurrent && drDoc.SlideCurrent < drDoc.SlidesCount) {
            this.CreateBackgroundHorRuler();
            this.CreateBackgroundVerRuler();
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.OnScroll();
        this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
    };
    this.UpdateHorRulerBack = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.SlideCurrent && drDoc.SlideCurrent < drDoc.SlidesCount) {
            this.CreateBackgroundHorRuler();
        }
        this.UpdateHorRuler();
    };
    this.UpdateVerRulerBack = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.SlideCurrent && drDoc.SlideCurrent < drDoc.SlidesCount) {
            this.CreateBackgroundVerRuler();
        }
        this.UpdateVerRuler();
    };
    this.CreateBackgroundHorRuler = function (margins) {
        var cachedPage = {};
        cachedPage.width_mm = this.m_oLogicDocument.Width;
        cachedPage.height_mm = this.m_oLogicDocument.Height;
        if (margins !== undefined) {
            cachedPage.margin_left = margins.L;
            cachedPage.margin_top = margins.T;
            cachedPage.margin_right = margins.R;
            cachedPage.margin_bottom = margins.B;
        } else {
            cachedPage.margin_left = 0;
            cachedPage.margin_top = 0;
            cachedPage.margin_right = this.m_oLogicDocument.Width;
            cachedPage.margin_bottom = this.m_oLogicDocument.Height;
        }
        this.m_oHorRuler.CreateBackground(cachedPage);
    };
    this.CreateBackgroundVerRuler = function (margins) {
        var cachedPage = {};
        cachedPage.width_mm = this.m_oLogicDocument.Width;
        cachedPage.height_mm = this.m_oLogicDocument.Height;
        if (margins !== undefined) {
            cachedPage.margin_left = margins.L;
            cachedPage.margin_top = margins.T;
            cachedPage.margin_right = margins.R;
            cachedPage.margin_bottom = margins.B;
        } else {
            cachedPage.margin_left = 0;
            cachedPage.margin_top = 0;
            cachedPage.margin_right = this.m_oLogicDocument.Width;
            cachedPage.margin_bottom = this.m_oLogicDocument.Height;
        }
        this.m_oVerRuler.CreateBackground(cachedPage);
    };
    this.ThemeGenerateThumbnails = function (_master) {
        var _layouts = _master.sldLayoutLst;
        var _len = _layouts.length;
        for (var i = 0; i < _len; i++) {
            _layouts[i].recalculate();
            _layouts[i].ImageBase64 = this.m_oLayoutDrawer.GetThumbnail(_layouts[i]);
            _layouts[i].Width64 = this.m_oLayoutDrawer.WidthPx;
            _layouts[i].Height64 = this.m_oLayoutDrawer.HeightPx;
        }
    };
    this.CheckLayouts = function (bIsAttack) {
        var master = null;
        if (-1 == this.m_oDrawingDocument.SlideCurrent && 0 == this.m_oLogicDocument.slideMasters.length) {
            return;
        }
        if (-1 != this.m_oDrawingDocument.SlideCurrent) {
            master = this.m_oLogicDocument.Slides[this.m_oDrawingDocument.SlideCurrent].Layout.Master;
        } else {
            master = this.m_oLogicDocument.slideMasters[0];
        }
        if (this.MasterLayouts != master || Math.abs(this.m_oLayoutDrawer.WidthMM - this.m_oLogicDocument.Width) > MOVE_DELTA || Math.abs(this.m_oLayoutDrawer.HeightMM - this.m_oLogicDocument.Height) > MOVE_DELTA || bIsAttack === true) {
            this.MasterLayouts = master;
            var _len = master.sldLayoutLst.length;
            var arr = new Array(_len);
            for (var i = 0; i < _len; i++) {
                arr[i] = new CLayoutThumbnail();
                arr[i].Index = i;
                var __type = master.sldLayoutLst[i].type;
                if (__type !== undefined && __type != null) {
                    arr[i].Type = __type;
                }
                arr[i].Name = master.sldLayoutLst[i].cSld.name;
                if ("" == master.sldLayoutLst[i].ImageBase64 || Math.abs(this.m_oLayoutDrawer.WidthMM - this.m_oLogicDocument.Width) > MOVE_DELTA || Math.abs(this.m_oLayoutDrawer.HeightMM - this.m_oLogicDocument.Height) > MOVE_DELTA) {
                    this.m_oLayoutDrawer.WidthMM = this.m_oLogicDocument.Width;
                    this.m_oLayoutDrawer.HeightMM = this.m_oLogicDocument.Height;
                    master.sldLayoutLst[i].ImageBase64 = this.m_oLayoutDrawer.GetThumbnail(master.sldLayoutLst[i]);
                    master.sldLayoutLst[i].Width64 = this.m_oLayoutDrawer.WidthPx;
                    master.sldLayoutLst[i].Height64 = this.m_oLayoutDrawer.HeightPx;
                }
                arr[i].Image = master.sldLayoutLst[i].ImageBase64;
                arr[i].Width = master.sldLayoutLst[i].Width64;
                arr[i].Height = master.sldLayoutLst[i].Height64;
            }
            editor.asc_fireCallback("asc_onUpdateLayout", arr);
            editor.asc_fireCallback("asc_onUpdateThemeIndex", this.MasterLayouts.ThemeIndex);
            this.m_oDrawingDocument.SendThemeColorScheme();
        }
        this.m_oDrawingDocument.CheckGuiControlColors(bIsAttack);
    };
    this.GoToPage = function (lPageNum, isFromZoom) {
        var drDoc = this.m_oDrawingDocument;
        var _old_empty = this.m_oDrawingDocument.IsEmptyPresentation;
        this.m_oDrawingDocument.IsEmptyPresentation = false;
        if (-1 == lPageNum) {
            this.m_oDrawingDocument.IsEmptyPresentation = true;
        }
        if (lPageNum != -1 && (lPageNum < 0 || lPageNum >= drDoc.SlidesCount)) {
            return;
        }
        this.Thumbnails.LockMainObjType = true;
        this.StartVerticalScroll = false;
        this.m_oApi.asc_fireCallback("asc_onEndPaintSlideNum");
        var _bIsUpdate = (drDoc.SlideCurrent != lPageNum);
        this.ZoomFreePageNum = lPageNum;
        drDoc.SlideCurrent = lPageNum;
        this.m_oLogicDocument.Set_CurPage(lPageNum);
        this.CheckLayouts();
        this.SlideDrawer.CheckSlide(drDoc.SlideCurrent);
        if (true !== isFromZoom) {
            this.m_oApi.sync_BeginCatchSelectedElements();
            this.m_oApi.sync_slidePropCallback(this.m_oLogicDocument.Slides[drDoc.SlideCurrent]);
            this.m_oApi.sync_EndCatchSelectedElements();
        }
        this.CalculateDocumentSize(false);
        this.Thumbnails.SelectPage(lPageNum);
        this.CreateBackgroundHorRuler();
        this.CreateBackgroundVerRuler();
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.OnCalculatePagesPlace();
        if (this.IsGoToPageMAXPosition) {
            this.m_oScrollVerApi.scrollToY(this.SlideScrollMAX);
            this.IsGoToPageMAXPosition = false;
        } else {
            this.m_oScrollVerApi.scrollToY(this.m_dScrollY_Central);
        }
        if (this.m_bIsHorScrollVisible) {
            this.m_oScrollHorApi.scrollToX(this.m_dScrollX_Central);
        }
        this.ZoomFreePageNum = -1;
        if (this.m_oApi.isViewMode === false && null != this.m_oLogicDocument) {
            this.m_oLogicDocument.RecalculateCurPos();
            this.m_oApi.sync_currentPageCallback(drDoc.SlideCurrent);
        } else {
            this.m_oApi.sync_currentPageCallback(drDoc.SlideCurrent);
        }
        this.m_oLogicDocument.Document_UpdateSelectionState();
        this.Thumbnails.LockMainObjType = false;
        if (this.m_oDrawingDocument.IsEmptyPresentation != _old_empty || _bIsUpdate) {
            this.OnScroll();
        }
    };
    this.GetVerticalScrollTo = function (y) {
        var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;
        return 5 + y * dKoef;
    };
    this.GetHorizontalScrollTo = function (x) {
        var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;
        return 5 + dKoef * x;
    };
    this.ReinitTB = function () {
        this.TextBoxChangedValueEvent = false;
        this.TextBoxInput.value = "";
        this.TextBoxChangedValueEvent = true;
    };
    this.SetTextBoxMode = function (isEA) {
        if (!this.m_oApi.bInit_word_control) {
            return;
        }
        this.TextBoxInputMode = isEA;
        if (isEA) {
            if (null == this.TextBoxInput) {
                this.TextBoxInput = document.createElement("textarea");
                this.TextBoxInput.id = "area_id";
                this.TextBoxInput.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:2px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;");
                this.TextBoxInput.style.border = "2px solid #4363A4";
                this.TextBoxInput.style.width = "100px";
                this.TextBoxInput.rows = 1;
                this.m_oMainView.HtmlElement.appendChild(this.TextBoxInput);
                this.TextBoxInput["oninput"] = this.OnTextBoxInput;
                this.TextBoxInput.onkeydown = this.TextBoxOnKeyDown;
            }
            if (this.TextBoxInputFocus) {
                this.onChangeTB();
            } else {
                this.TextBoxInputFocus = false;
                this.ReinitTB();
                this.TextBoxInput.style.overflow = "hidden";
                this.TextBoxInput.style.zIndex = -1;
                this.TextBoxInput.style.top = "-1000px";
            }
            this.TextBoxInput.focus();
        } else {
            if (this.TextBoxInputFocus) {
                this.onChangeTB();
            }
            if (null != this.TextBoxInput) {
                this.m_oMainView.HtmlElement.removeChild(this.TextBoxInput);
                this.TextBoxInput = null;
            }
        }
    };
    this.TextBoxFocus = function () {
        if (null == oThis.TextBoxInput || oThis.TextBoxInputFocus === true || oThis.TextBoxChangedValueEvent == false) {
            return;
        }
        oThis.TextBoxInputFocus = true;
        CollaborativeEditing.m_bGlobalLock = true;
        oThis.CheckTextBoxInputPos();
        oThis.TextBoxInput.style.zIndex = 90;
    };
    this.OnTextBoxInput = function () {
        oThis.TextBoxFocus();
        oThis.CheckTextBoxSize();
    };
    this.CheckTextBoxSize = function () {
        if (null == this.TextBoxInput || !this.TextBoxInputFocus) {
            return;
        }
        var _p = document.createElement("p");
        _p.style.zIndex = "-1";
        _p.style.position = "absolute";
        _p.style.fontFamily = "arial";
        _p.style.fontSize = "12pt";
        _p.style.left = "0px";
        _p.style.width = oThis.TextBoxMaxWidth + "px";
        this.m_oMainView.HtmlElement.appendChild(_p);
        var _t = this.TextBoxInput.value;
        _t = _t.replace(/ /g, "&nbsp;");
        _p.innerHTML = "<span>" + _t + "</span>";
        var _width = _p.firstChild.offsetWidth;
        _width = Math.min(_width + 10, this.TextBoxMaxWidth);
        var area = document.createElement("textarea");
        area.style.zIndex = "-1";
        area.id = "area2_id";
        area.rows = 1;
        area.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:2px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;");
        area.style.overflow = "hidden";
        area.style.width = _width + "px";
        this.m_oMainView.HtmlElement.appendChild(area);
        area.value = this.TextBoxInput.value;
        var _height = area.clientHeight;
        if (area.scrollHeight > _height) {
            _height = area.scrollHeight;
        }
        if (_height > oThis.TextBoxMaxHeight) {
            _height = oThis.TextBoxMaxHeight;
        }
        this.m_oMainView.HtmlElement.removeChild(_p);
        this.m_oMainView.HtmlElement.removeChild(area);
        this.TextBoxInput.style.width = _width + "px";
        this.TextBoxInput.style.height = _height + "px";
        var oldZindex = parseInt(this.TextBoxInput.style.zIndex);
        var newZindex = (oldZindex == 90) ? "89" : "90";
        this.TextBoxInput.style.zIndex = newZindex;
    };
    this.TextBoxOnKeyDown = function (e) {
        check_KeyboardEvent(e);
        if (global_keyboardEvent.KeyCode == 9) {
            e.preventDefault();
            return false;
        }
    };
    this.onChangeTB = function () {
        CollaborativeEditing.m_bGlobalLock = false;
        this.TextBoxInput.style.zIndex = -1;
        this.TextBoxInput.style.top = "-1000px";
        this.TextBoxInputFocus = false;
        oThis.m_oLogicDocument.TextBox_Put(oThis.TextBoxInput.value);
        this.ReinitTB();
    };
    this.CheckTextBoxInputPos = function () {
        if (this.TextBoxInput == null || !this.TextBoxInputFocus) {
            return;
        }
        var _left = this.m_oDrawingDocument.TargetHtmlElementLeft;
        var _top = this.m_oDrawingDocument.TargetHtmlElementTop;
        var _h = (this.m_oDrawingDocument.m_dTargetSize * this.m_nZoomValue * g_dKoef_mm_to_pix / 100) >> 0;
        var _r_max = (this.m_oEditor.AbsolutePosition.R * g_dKoef_mm_to_pix) >> 0;
        _r_max -= 20;
        if ((_r_max - _left) > 50) {
            this.TextBoxMaxWidth = _r_max - _left;
        } else {
            _left = _r_max - 50;
            this.TextBoxMaxWidth = 50;
        }
        var _b_max = (this.m_oEditor.AbsolutePosition.B * g_dKoef_mm_to_pix) >> 0;
        _b_max -= 40;
        if ((_b_max - _top) > 50) {
            this.TextBoxMaxHeight = _b_max - _top;
        } else {
            _top = _b_max - 50;
            this.TextBoxMaxHeight = 50;
        }
        this.TextBoxInput.style.left = _left + "px";
        this.TextBoxInput.style.top = (_top + _h) + "px";
        this.CheckTextBoxSize();
        this.TextBoxInput.focus();
    };
    this.SaveDocument = function () {
        var writer = new CBinaryFileWriter();
        this.m_oLogicDocument.CalculateComments();
        var str = writer.WriteDocument(this.m_oLogicDocument);
        return str;
    };
}
var _message_update = "zero_delay_update";
function handleMessage(event) {
    if (event.source == window && event.data == _message_update) {
        var oWordControl = editor.WordControl;
        event.stopPropagation();
        oWordControl.OnPaint();
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            oWordControl.m_oLogicDocument.CheckTargetUpdate();
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
        }
    }
}
function sendStatus(Message) {
    editor.sync_StatusMessage(Message);
}