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
 var g_dDpiX = 96;
var g_dDpiY = 96;
var g_dKoef_mm_to_pix = g_dDpiX / 25.4;
var g_dKoef_pix_to_mm = 25.4 / g_dDpiX;
var g_bIsMobile = AscBrowser.isMobile;
var g_bIsMouseUpLockedSend = false;
var Page_Width = 210;
var Page_Height = 297;
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
var docpostype_Content = 0;
var docpostype_FlowObjects = 1;
var docpostype_HdrFtr = 2;
var selectionflag_Common = 0;
var selectionflag_Numbering = 1;
var selectionflag_DrawingObject = 2;
var orientation_Portrait = 0;
var orientation_Landscape = 1;
var tableSpacingMinValue = 0.02;
if (AscBrowser.isIE || window.opera) {
    document.onselectstart = function () {
        return false;
    };
}
function CEditorPage(api) {
    this.Name = "";
    this.X = 0;
    this.Y = 0;
    this.Width = 10;
    this.Height = 10;
    this.m_oBody = null;
    this.m_oMenu = null;
    this.m_oPanelRight = null;
    this.m_oScrollHor = null;
    this.m_oMainContent = null;
    this.m_oLeftRuler = null;
    this.m_oTopRuler = null;
    this.m_oMainView = null;
    this.m_oEditor = null;
    this.m_oOverlay = null;
    this.TextBoxBackground = null;
    this.ReaderModeDivWrapper = null;
    this.ReaderModeDiv = null;
    this.m_oOverlayApi = new COverlay();
    this.m_bIsIE = (AscBrowser.isIE || window.opera) ? true : false;
    this.m_oPanelRight_buttonRulers = null;
    this.m_oPanelRight_vertScroll = null;
    this.m_oPanelRight_buttonPrevPage = null;
    this.m_oPanelRight_buttonNextPage = null;
    this.m_oLeftRuler_buttonsTabs = null;
    this.m_oLeftRuler_vertRuler = null;
    this.m_oTopRuler_horRuler = null;
    this.m_bIsHorScrollVisible = false;
    this.m_bIsRuler = (api.isMobileVersion === true) ? false : true;
    this.m_nZoomValue = 100;
    this.m_oBoundsController = new CBoundsController();
    this.m_nTabsType = 0;
    this.m_dScrollY = 0;
    this.m_dScrollX = 0;
    this.m_dScrollY_max = 1;
    this.m_dScrollX_max = 1;
    this.m_bIsRePaintOnScroll = true;
    this.m_dDocumentWidth = 0;
    this.m_dDocumentHeight = 0;
    this.m_dDocumentPageWidth = 0;
    this.m_dDocumentPageHeight = 0;
    this.NoneRepaintPages = false;
    this.m_bIsScroll = false;
    this.ScrollsWidthPx = 16;
    this.m_oHorRuler = new CHorRuler();
    this.m_oVerRuler = new CVerRuler();
    this.m_oDrawingDocument = new CDrawingDocument();
    this.m_oLogicDocument = null;
    this.m_oDrawingDocument.m_oWordControl = this;
    this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
    this.m_bIsUpdateHorRuler = false;
    this.m_bIsUpdateVerRuler = false;
    this.m_bIsUpdateTargetNoAttack = false;
    this.m_bIsFullRepaint = false;
    this.m_oScrollHor_ = null;
    this.m_oScrollVer_ = null;
    this.m_oScrollHorApi = null;
    this.m_oScrollVerApi = null;
    this.arrayEventHandlers = new Array();
    this.m_oTimerScrollSelect = -1;
    this.IsFocus = true;
    this.m_bIsMouseLock = false;
    this.m_nTimeDrawingLast = 0;
    this.DrawingFreeze = false;
    this.m_oHorRuler.m_oWordControl = this;
    this.m_oVerRuler.m_oWordControl = this;
    this.IsKeyDownButNoPress = false;
    this.MouseDownDocumentCounter = 0;
    this.bIsUseKeyPress = true;
    this.bIsEventPaste = false;
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
    this.m_nPaintTimerId = -1;
    this.m_nTimerScrollInterval = 40;
    this.m_nCurrentTimeClearCache = 0;
    this.m_bIsMouseUpSend = false;
    this.zoom_values = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    this.m_nZoomType = 0;
    this.TextBoxInputMode = false;
    this.TextBoxInput = null;
    this.TextBoxInputFocus = false;
    this.TextBoxChangedValueEvent = true;
    this.TextBoxMaxWidth = 20;
    this.TextBoxMaxHeight = 20;
    this.MobileTouchManager = null;
    this.ReaderTouchManager = null;
    this.ReaderModeCurrent = 0;
    this.ReaderFontSizeCur = 2;
    this.ReaderFontSizes = [12, 14, 16, 18, 22, 28, 36, 48, 72];
    this.bIsRetinaSupport = true;
    this.bIsRetinaNoSupportAttack = false;
    this.IsUpdateOverlayOnlyEnd = false;
    this.IsUpdateOverlayOnlyEndReturn = false;
    this.IsUpdateOverlayOnEndCheck = false;
    this.m_oApi = api;
    var oThis = this;
    this.UseRequestAnimationFrame = false;
    this.RequestAnimationFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
    })();
    this.CancelAnimationFrame = (function () {
        return window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || null;
    })();
    if (this.UseRequestAnimationFrame) {
        if (null == this.RequestAnimationFrame) {
            this.UseRequestAnimationFrame = false;
        }
    }
    this.RequestAnimationOldTime = -1;
    this.checkBodySize = function () {
        var off = jQuery("#" + this.Name).offset();
        this.X = off.left;
        this.Y = off.top;
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
        var scrollWidthMm = this.ScrollsWidthPx * g_dKoef_pix_to_mm;
        this.m_oScrollHor = CreateControlContainer("id_horscrollpanel");
        this.m_oScrollHor.Bounds.SetParams(0, 0, scrollWidthMm, 0, false, false, true, true, -1, scrollWidthMm);
        this.m_oScrollHor.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oScrollHor);
        this.m_oPanelRight = CreateControlContainer("id_panel_right");
        this.m_oPanelRight.Bounds.SetParams(0, 0, 1000, 0, false, true, false, true, scrollWidthMm, -1);
        this.m_oPanelRight.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oPanelRight);
        if (this.m_oApi.isMobileVersion) {
            this.m_oPanelRight.HtmlElement.style.zIndex = -1;
            var hor_scroll = document.getElementById("id_horscrollpanel");
            hor_scroll.style.zIndex = -1;
        }
        this.m_oPanelRight_buttonRulers = CreateControl("id_buttonRulers");
        this.m_oPanelRight_buttonRulers.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, scrollWidthMm);
        this.m_oPanelRight_buttonRulers.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonRulers);
        this.m_oPanelRight_buttonNextPage = CreateControl("id_buttonNextPage");
        this.m_oPanelRight_buttonNextPage.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, scrollWidthMm);
        this.m_oPanelRight_buttonNextPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonNextPage);
        this.m_oPanelRight_buttonPrevPage = CreateControl("id_buttonPrevPage");
        this.m_oPanelRight_buttonPrevPage.Bounds.SetParams(0, 0, 1000, scrollWidthMm, false, false, false, true, -1, scrollWidthMm);
        this.m_oPanelRight_buttonPrevPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonPrevPage);
        this.m_oPanelRight_vertScroll = CreateControl("id_vertical_scroll");
        this.m_oPanelRight_vertScroll.Bounds.SetParams(0, scrollWidthMm, 1000, 2 * scrollWidthMm, false, true, false, true, -1, -1);
        this.m_oPanelRight_vertScroll.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oPanelRight.AddControl(this.m_oPanelRight_vertScroll);
        this.m_oMainContent = CreateControlContainer("id_main");
        if (!this.m_oApi.isMobileVersion) {
            this.m_oMainContent.Bounds.SetParams(0, 0, scrollWidthMm, 0, false, true, true, true, -1, -1);
        } else {
            this.m_oMainContent.Bounds.SetParams(0, 0, 0, 0, false, true, true, true, -1, -1);
        }
        this.m_oMainContent.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oBody.AddControl(this.m_oMainContent);
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
        this.m_oMainView = CreateControlContainer("id_main_view");
        this.m_oMainView.Bounds.SetParams(5, 7, 1000, 1000, true, true, false, false, -1, -1);
        this.m_oMainView.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
        this.m_oMainContent.AddControl(this.m_oMainView);
        if (this.m_oApi.isMobileVersion) {
            var _tag_background = "textarea";
            if (bIsAndroid) {
                _tag_background = "input";
            }
            var _text_bx_back = document.createElement(_tag_background);
            _text_bx_back.id = "id_text_box_background";
            _text_bx_back.setAttribute("style", "background:transparent;border-style:none;border-color:transparent;overflow:hidden;z-index:4;font-family:arial;font-size:12pt;position:absolute;resize:none;padding:0px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;");
            _text_bx_back.setAttribute("spellcheck", "false");
            if (bIsAndroid) {
                _text_bx_back.setAttribute("autocomplete", "off");
                _text_bx_back.setAttribute("type", "password");
            }
            _text_bx_back.willValidate = false;
            this.m_oMainView.HtmlElement.appendChild(_text_bx_back);
            this.TextBoxBackground = CreateControl("id_text_box_background");
            this.TextBoxBackground.Bounds.SetParams(-100, 0, 1100, 1000, false, false, false, false, -1, -1);
            this.TextBoxBackground.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
            this.m_oMainView.AddControl(this.TextBoxBackground);
            this.TextBoxBackground.HtmlElement.value = "a";
        }
        this.m_oEditor = CreateControl("id_viewer");
        this.m_oEditor.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
        this.m_oEditor.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oMainView.AddControl(this.m_oEditor);
        this.m_oOverlay = CreateControl("id_viewer_overlay");
        this.m_oOverlay.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
        this.m_oOverlay.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
        this.m_oMainView.AddControl(this.m_oOverlay);
        this.m_oDrawingDocument.TargetHtmlElement = document.getElementById("id_target_cursor");
        if (this.m_oApi.isMobileVersion) {
            this.MobileTouchManager = new CMobileTouchManager();
            this.MobileTouchManager.Init(this);
        }
        this.checkNeedRules();
        this.initEvents2();
        this.UnShowOverlay();
        this.m_oOverlayApi.m_oControl = this.m_oOverlay;
        this.m_oOverlayApi.m_oHtmlPage = this;
        this.m_oOverlayApi.Clear();
        this.m_oDrawingDocument.AutoShapesTrack = new CAutoshapeTrack();
        this.m_oDrawingDocument.AutoShapesTrack.init2(this.m_oOverlayApi);
        this.OnResize(true);
    };
    this.CheckRetinaDisplay = function () {
        var old = this.bIsRetinaSupport;
        if (!this.bIsRetinaNoSupportAttack) {
            if (window.devicePixelRatio != 2) {
                this.bIsRetinaSupport = false;
            } else {
                this.bIsRetinaSupport = true;
            }
        } else {
            this.bIsRetinaSupport = false;
        }
        if (old != this.bIsRetinaSupport) {
            this.m_oDrawingDocument.ClearCachePages();
        }
    };
    this.ShowOverlay = function () {
        this.m_oOverlay.HtmlElement.style.display = "block";
        if (null == this.m_oOverlayApi.m_oContext) {
            this.m_oOverlayApi.m_oContext = this.m_oOverlayApi.m_oControl.HtmlElement.getContext("2d");
        }
    };
    this.UnShowOverlay = function () {
        this.m_oOverlay.HtmlElement.style.display = "none";
    };
    this.CheckUnShowOverlay = function () {
        var drDoc = this.m_oDrawingDocument;
        if (!drDoc.m_bIsSearching && !drDoc.m_bIsSelection && !this.MobileTouchManager) {
            this.UnShowOverlay();
            return false;
        }
        return true;
    };
    this.CheckShowOverlay = function () {
        var drDoc = this.m_oDrawingDocument;
        if (drDoc.m_bIsSearching || drDoc.m_bIsSelection || this.MobileTouchManager) {
            this.ShowOverlay();
        }
    };
    this.initEvents2 = function () {
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
        this.m_oTopRuler_horRuler.HtmlElement.onmousedown = this.horRulerMouseDown;
        this.m_oTopRuler_horRuler.HtmlElement.onmouseup = this.horRulerMouseUp;
        this.m_oTopRuler_horRuler.HtmlElement.onmousemove = this.horRulerMouseMove;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmousedown = this.verRulerMouseDown;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmouseup = this.verRulerMouseUp;
        this.m_oLeftRuler_vertRuler.HtmlElement.onmousemove = this.verRulerMouseMove;
        window.onkeydown = this.onKeyDown;
        window.onkeypress = this.onKeyPress;
        window.onkeyup = this.onKeyUp;
        this.m_oBody.HtmlElement.oncontextmenu = function () {
            return false;
        };
        this.initEvents2MobileAdvances();
    };
    this.initEvents2MobileAdvances = function () {
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
        if (this.m_oApi.isMobileVersion) {
            var __hasTouch = "ontouchstart" in window;
            if (__hasTouch) {
                this.TextBoxBackground.HtmlElement["ontouchcancel"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchEnd(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
                this.TextBoxBackground.HtmlElement["ontouchstart"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchStart(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
                this.TextBoxBackground.HtmlElement["ontouchmove"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchMove(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
                this.TextBoxBackground.HtmlElement["ontouchend"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchEnd(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
            } else {
                this.TextBoxBackground.HtmlElement["onmousedown"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchStart(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
                this.TextBoxBackground.HtmlElement["onmousemove"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchMove(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
                this.TextBoxBackground.HtmlElement["onmouseup"] = function (e) {
                    oThis.IsUpdateOverlayOnlyEndReturn = true;
                    oThis.StartUpdateOverlay();
                    var ret = oThis.MobileTouchManager.onTouchEnd(e);
                    oThis.IsUpdateOverlayOnlyEndReturn = false;
                    oThis.EndUpdateOverlay();
                    return ret;
                };
            }
            if (bIsAndroid) {
                this.TextBoxBackground.HtmlElement["oncontextmenu"] = function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.returnValue = false;
                    return false;
                };
                this.TextBoxBackground.HtmlElement["onselectstart"] = function (e) {
                    oThis.m_oLogicDocument.Select_All();
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.returnValue = false;
                    return false;
                };
                window.IS_USE_INPUT = true;
                this.TextBoxBackground.HtmlElement["oninput"] = function (e) {
                    var val = oThis.TextBoxBackground.HtmlElement.value;
                    oThis.TextBoxBackground.HtmlElement.value = "a";
                    if (val.length == 2) {
                        var _e = {
                            altKey: global_keyboardEvent.AltKey,
                            ctrlKey: global_keyboardEvent.CtrlKey,
                            shiftKey: global_keyboardEvent.ShiftKey,
                            srcElement: global_keyboardEvent.Sender,
                            charCode: global_keyboardEvent.CharCode,
                            keyCode: global_keyboardEvent.KeyCode,
                            which: val.charCodeAt(1)
                        };
                        _e.preventDefault = function () {};
                        if (_e.which == 32) {
                            _e.keyCode = 32;
                            oThis.onKeyDown(_e);
                        } else {
                            oThis.onKeyPress(_e);
                        }
                    } else {
                        if (0 == val.length) {
                            var _e = {
                                altKey: global_keyboardEvent.AltKey,
                                ctrlKey: global_keyboardEvent.CtrlKey,
                                shiftKey: global_keyboardEvent.ShiftKey,
                                srcElement: global_keyboardEvent.Sender,
                                charCode: global_keyboardEvent.CharCode,
                                keyCode: global_keyboardEvent.KeyCode,
                                which: 8
                            };
                            _e.preventDefault = function () {};
                            if (_e.which == 8) {
                                _e.keyCode = 8;
                                oThis.onKeyDown(_e);
                            }
                        } else {
                            var _len = val.length;
                            for (var i = 1; i < _len; i++) {
                                var _e = {
                                    altKey: global_keyboardEvent.AltKey,
                                    ctrlKey: global_keyboardEvent.CtrlKey,
                                    shiftKey: global_keyboardEvent.ShiftKey,
                                    srcElement: global_keyboardEvent.Sender,
                                    charCode: global_keyboardEvent.CharCode,
                                    keyCode: global_keyboardEvent.KeyCode,
                                    which: val.charCodeAt(i)
                                };
                                _e.preventDefault = function () {};
                                if (_e.which == 32) {
                                    _e.keyCode = 32;
                                    oThis.onKeyDown(_e);
                                } else {
                                    oThis.onKeyPress(_e);
                                }
                            }
                        }
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.returnValue = false;
                };
            }
        }
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
        var w = this.m_oEditor.AbsolutePosition.R - this.m_oEditor.AbsolutePosition.L;
        var Zoom = 100;
        if (0 != this.m_dDocumentPageWidth) {
            Zoom = 100 * (w - 10) / this.m_dDocumentPageWidth;
            if (Zoom < 5) {
                Zoom = 5;
            }
            if (this.m_oApi.isMobileVersion) {
                var _w = this.m_oEditor.HtmlElement.width;
                if (this.bIsRetinaSupport) {
                    _w >>= 1;
                }
                Zoom = 100 * _w * g_dKoef_pix_to_mm / this.m_dDocumentPageWidth;
            }
        }
        var _new_value = parseInt(Zoom - 0.5);
        this.m_nZoomType = 1;
        if (_new_value != this.m_nZoomValue) {
            var _old_val = this.m_nZoomValue;
            this.m_nZoomValue = _new_value;
            this.zoom_Fire(1, _old_val);
            if (this.MobileTouchManager) {
                this.MobileTouchManager.CheckZoomCriticalValues(this.m_nZoomValue);
            }
            return true;
        } else {
            this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 1);
        }
        return false;
    };
    this.zoom_FitToPage = function () {
        var w = parseInt(this.m_oEditor.HtmlElement.width) * g_dKoef_pix_to_mm;
        var h = parseInt(this.m_oEditor.HtmlElement.height) * g_dKoef_pix_to_mm;
        if (this.bIsRetinaSupport) {
            w >>= 1;
            h >>= 1;
        }
        var _hor_Zoom = 100;
        if (0 != this.m_dDocumentPageWidth) {
            _hor_Zoom = (100 * (w - 10)) / this.m_dDocumentPageWidth;
        }
        var _ver_Zoom = 100;
        if (0 != this.m_dDocumentPageHeight) {
            _ver_Zoom = (100 * (h - 10)) / this.m_dDocumentPageHeight;
        }
        var _new_value = parseInt(Math.min(_hor_Zoom, _ver_Zoom) - 0.5);
        if (_new_value < 5) {
            _new_value = 5;
        }
        this.m_nZoomType = 2;
        if (_new_value != this.m_nZoomValue) {
            var _old_val = this.m_nZoomValue;
            this.m_nZoomValue = _new_value;
            this.zoom_Fire(2, _old_val);
            return true;
        } else {
            this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 2);
        }
        return false;
    };
    this.zoom_Fire = function (type, old_zoom) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        g_fontManager.ClearRasterMemory();
        if (window.g_fontManager2 !== undefined && window.g_fontManager2 !== null) {
            window.g_fontManager2.ClearRasterMemory();
        }
        var oWordControl = oThis;
        oWordControl.m_bIsRePaintOnScroll = false;
        var xScreen1 = oWordControl.m_oEditor.AbsolutePosition.R - oWordControl.m_oEditor.AbsolutePosition.L;
        var yScreen1 = oWordControl.m_oEditor.AbsolutePosition.B - oWordControl.m_oEditor.AbsolutePosition.T;
        xScreen1 *= g_dKoef_mm_to_pix;
        yScreen1 *= g_dKoef_mm_to_pix;
        xScreen1 >>= 1;
        yScreen1 >>= 1;
        var posDoc = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(xScreen1, yScreen1, true, undefined, old_zoom);
        oWordControl.CheckZoom();
        oWordControl.CalculateDocumentSize();
        var lCurPage = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (-1 != lCurPage) {
            oWordControl.m_oHorRuler.CreateBackground(oWordControl.m_oDrawingDocument.m_arrPages[lCurPage]);
            oWordControl.m_bIsUpdateHorRuler = true;
            oWordControl.m_oVerRuler.CreateBackground(oWordControl.m_oDrawingDocument.m_arrPages[lCurPage]);
            oWordControl.m_bIsUpdateVerRuler = true;
        }
        oWordControl.OnCalculatePagesPlace();
        var posScreenNew = oWordControl.m_oDrawingDocument.ConvertCoordsToCursor(posDoc.X, posDoc.Y, posDoc.Page);
        var _x_pos = oWordControl.m_oScrollHorApi.getCurScrolledX() + posScreenNew.X - xScreen1;
        var _y_pos = oWordControl.m_oScrollVerApi.getCurScrolledY() + posScreenNew.Y - yScreen1;
        _x_pos = Math.max(0, Math.min(_x_pos, oWordControl.m_dScrollX_max));
        _y_pos = Math.max(0, Math.min(_y_pos, oWordControl.m_dScrollY_max));
        if (oWordControl.m_dScrollY == 0) {
            _y_pos = 0;
        }
        oWordControl.m_oScrollVerApi.scrollToY(_y_pos);
        oWordControl.m_oScrollHorApi.scrollToX(_x_pos);
        if (this.MobileTouchManager) {
            this.MobileTouchManager.Resize();
        }
        oWordControl.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, type);
        oWordControl.m_bIsUpdateTargetNoAttack = true;
        oWordControl.m_bIsRePaintOnScroll = true;
        if (oWordControl.m_oLogicDocument) {
            oWordControl.m_oLogicDocument.DrawingObjects.redrawCharts();
        }
        oWordControl.OnScroll();
    };
    this.zoom_Out = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        oThis.m_nZoomType = 0;
        var _zooms = oThis.zoom_values;
        var _count = _zooms.length;
        var _Zoom = _zooms[0];
        for (var i = (_count - 1); i >= 0; i--) {
            if (this.m_nZoomValue > _zooms[i]) {
                _Zoom = _zooms[i];
                break;
            }
        }
        var _old_val = oThis.m_nZoomValue;
        oThis.m_nZoomValue = _Zoom;
        oThis.zoom_Fire(0, _old_val);
    };
    this.zoom_In = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        oThis.m_nZoomType = 0;
        var _zooms = oThis.zoom_values;
        var _count = _zooms.length;
        var _Zoom = _zooms[_count - 1];
        for (var i = 0; i < _count; i++) {
            if (this.m_nZoomValue < _zooms[i]) {
                _Zoom = _zooms[i];
                break;
            }
        }
        var _old_val = oThis.m_nZoomValue;
        oThis.m_nZoomValue = _Zoom;
        oThis.zoom_Fire(0, _old_val);
    };
    this.ToSearchResult = function () {
        var naviG = this.m_oDrawingDocument.CurrentSearchNavi;
        var navi = naviG[0];
        var x = navi.X;
        var y = navi.Y;
        var type = (naviG.Type & 255);
        var PageNum = navi.PageNum;
        if (navi.Transform) {
            var xx = navi.Transform.TransformPointX(x, y);
            var yy = navi.Transform.TransformPointY(x, y);
            x = xx;
            y = yy;
        }
        var rectSize = (navi.H * this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var pos = this.m_oDrawingDocument.ConvertCoordsToCursor2(x, y, PageNum);
        if (true === pos.Error) {
            return;
        }
        var boxX = 0;
        var boxY = 0;
        var boxR = this.m_oEditor.HtmlElement.width - 2;
        var boxB = this.m_oEditor.HtmlElement.height - rectSize;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = this.GetHorizontalScrollTo(x, PageNum);
        }
        if (pos.X > boxR) {
            var _mem = x - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.width * 100 / this.m_nZoomValue;
            nValueScrollHor = this.GetHorizontalScrollTo(_mem, PageNum);
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = this.GetVerticalScrollTo(y, PageNum);
        }
        if (pos.Y > boxB) {
            var _mem = y + navi.H + 10 - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.height * 100 / this.m_nZoomValue;
            nValueScrollVer = this.GetVerticalScrollTo(_mem, PageNum);
        }
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollHor * this.m_dScrollX_max / (this.m_dDocumentWidth - this.m_oEditor.HtmlElement.width);
            this.m_oScrollHorApi.scrollToX(parseInt(temp), false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollVer * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
            this.m_oScrollVerApi.scrollToY(parseInt(temp), false);
        }
        if (true === isNeedScroll) {
            this.OnScroll();
            return;
        }
        this.OnUpdateOverlay();
    };
    this.ScrollToPosition = function (x, y, PageNum) {
        if (PageNum < 0 || PageNum >= this.m_oDrawingDocument.m_lCountCalculatePages) {
            return;
        }
        var _h = 5;
        var rectSize = (_h * g_dKoef_mm_to_pix / 100);
        var pos = this.m_oDrawingDocument.ConvertCoordsToCursor2(x, y, PageNum);
        if (true === pos.Error) {
            return;
        }
        var boxX = 0;
        var boxY = 0;
        var boxR = this.m_oEditor.HtmlElement.width - 2;
        var boxB = this.m_oEditor.HtmlElement.height - rectSize;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = this.GetHorizontalScrollTo(x, PageNum);
        }
        if (pos.X > boxR) {
            var _mem = x - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.width * 100 / this.m_nZoomValue;
            nValueScrollHor = this.GetHorizontalScrollTo(_mem, PageNum);
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = this.GetVerticalScrollTo(y, PageNum);
        }
        if (pos.Y > boxB) {
            var _mem = y + _h + 10 - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.height * 100 / this.m_nZoomValue;
            nValueScrollVer = this.GetVerticalScrollTo(_mem, PageNum);
        }
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollHor * this.m_dScrollX_max / (this.m_dDocumentWidth - this.m_oEditor.HtmlElement.width);
            this.m_oScrollHorApi.scrollToX(parseInt(temp), false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            this.m_bIsUpdateTargetNoAttack = true;
            var temp = nValueScrollVer * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
            this.m_oScrollVerApi.scrollToY(parseInt(temp), false);
        }
        if (true === isNeedScroll) {
            this.OnScroll();
            return;
        }
    };
    this.onButtonTabsClick = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (oWordControl.m_nTabsType == g_tabtype_left) {
            oWordControl.m_nTabsType = g_tabtype_center;
            oWordControl.m_oLeftRuler_buttonsTabs.HtmlElement.style.backgroundPosition = "0px -37px";
        } else {
            if (oWordControl.m_nTabsType == g_tabtype_center) {
                oWordControl.m_nTabsType = g_tabtype_right;
                oWordControl.m_oLeftRuler_buttonsTabs.HtmlElement.style.backgroundPosition = "0px -18px";
            } else {
                oWordControl.m_nTabsType = g_tabtype_left;
                oWordControl.m_oLeftRuler_buttonsTabs.HtmlElement.style.backgroundPosition = "0px 0px";
            }
        }
    };
    this.onPrevPage = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (0 < oWordControl.m_oDrawingDocument.m_lCurrentPage) {
            oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lCurrentPage - 1);
        } else {
            oWordControl.GoToPage(0);
        }
    };
    this.onNextPage = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if ((oWordControl.m_oDrawingDocument.m_lPagesCount - 1) > oWordControl.m_oDrawingDocument.m_lCurrentPage) {
            oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lCurrentPage + 1);
        } else {
            if (oWordControl.m_oDrawingDocument.m_lPagesCount > 0) {
                oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lPagesCount - 1);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oHorRuler.OnMouseDown(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oHorRuler.OnMouseUp(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oHorRuler.OnMouseMove(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oVerRuler.OnMouseDown(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oVerRuler.OnMouseUp(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
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
        var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
        if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount) {
            return;
        }
        oWordControl.m_oVerRuler.OnMouseMove(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
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
            var positionMaxX = oWordControl.m_oMainContent.AbsolutePosition.R * g_dKoef_mm_to_pix + oWordControl.X;
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
            oWordControl.m_oScrollVerApi.scrollByY(scrollYVal, false);
        }
        if (0 != scrollXVal) {
            oWordControl.m_oScrollHorApi.scrollByX(scrollXVal, false);
        }
        if (scrollXVal != 0 || scrollYVal != 0) {
            oWordControl.onMouseMove2();
        }
    };
    this.onMouseDown = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (!oThis.m_bIsIE) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
        var oWordControl = oThis;
        if (this.id == "id_viewer" && oThis.m_oOverlay.HtmlElement.style.display == "block") {
            return;
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
            oWordControl.m_bIsMouseLock = true;
        }
        oWordControl.StartUpdateOverlay();
        if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button)) {
            var pos = null;
            if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1) {
                pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            } else {
                pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);
            }
            if (pos.Page == -1) {
                oWordControl.EndUpdateOverlay();
                return;
            }
            if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page)) {
                oWordControl.EndUpdateOverlay();
                return;
            }
            if (null == oWordControl.m_oDrawingDocument.m_oDocumentRenderer) {
                var ret = oWordControl.m_oDrawingDocument.checkMouseDown_Drawing(pos);
                if (ret === true) {
                    return;
                }
                oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = true;
                oWordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
                oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = false;
                oWordControl.MouseDownDocumentCounter++;
            } else {
                oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseDown(pos.Page, pos.X, pos.Y);
                oWordControl.MouseDownDocumentCounter++;
            }
        } else {
            if (global_mouseEvent.Button == 2) {
                oWordControl.MouseDownDocumentCounter++;
            }
        }
        if (-1 == oWordControl.m_oTimerScrollSelect) {
            oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
        }
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseMove = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var oWordControl = oThis;
        check_MouseMoveEvent(e);
        var pos = null;
        if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1) {
            pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        } else {
            pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);
        }
        if (pos.Page == -1) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page)) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.m_sLockedCursorType != "") {
            oWordControl.m_oDrawingDocument.SetCursorType("default");
        }
        if (oWordControl.m_oDrawingDocument.m_oDocumentRenderer != null) {
            oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseMove(pos.Page, pos.X, pos.Y);
            return;
        }
        oWordControl.StartUpdateOverlay();
        var is_drawing = oWordControl.m_oDrawingDocument.checkMouseMove_Drawing(pos);
        if (is_drawing === true) {
            return;
        }
        oWordControl.m_oDrawingDocument.TableOutlineDr.bIsNoTable = true;
        oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
        if (oWordControl.m_oDrawingDocument.TableOutlineDr.bIsNoTable === false) {
            oWordControl.ShowOverlay();
            oWordControl.OnUpdateOverlay();
        }
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseMove2 = function () {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        var pos = null;
        if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1) {
            pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        } else {
            pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);
        }
        if (pos.Page == -1) {
            return;
        }
        if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer) {
            oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseMove(pos.Page, pos.X, pos.Y);
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page)) {
            return;
        }
        oWordControl.StartUpdateOverlay();
        var is_drawing = oWordControl.m_oDrawingDocument.checkMouseMove_Drawing(pos);
        if (is_drawing === true) {
            return;
        }
        oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseUp = function (e, bIsWindow) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        if (!global_mouseEvent.IsLocked && 0 == oWordControl.MouseDownDocumentCounter) {
            return;
        }
        if (this.id == "id_viewer" && oThis.m_oOverlay.HtmlElement.style.display == "block" && undefined == bIsWindow) {
            return;
        }
        if ((global_mouseEvent.Sender != oThis.m_oEditor.HtmlElement && global_mouseEvent.Sender != oThis.m_oOverlay.HtmlElement && global_mouseEvent.Sender != oThis.m_oDrawingDocument.TargetHtmlElement) && (oThis.TextBoxBackground && oThis.TextBoxBackground.HtmlElement != global_mouseEvent.Sender)) {
            return;
        }
        check_MouseUpEvent(e);
        var pos = null;
        if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1) {
            pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        } else {
            pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);
        }
        if (pos.Page == -1) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page)) {
            return;
        }
        oWordControl.m_oDrawingDocument.UnlockCursorType();
        oWordControl.StartUpdateOverlay();
        oWordControl.m_bIsMouseLock = false;
        var is_drawing = oWordControl.m_oDrawingDocument.checkMouseUp_Drawing(pos);
        if (is_drawing === true) {
            return;
        }
        if (-1 != oWordControl.m_oTimerScrollSelect) {
            clearInterval(oWordControl.m_oTimerScrollSelect);
            oWordControl.m_oTimerScrollSelect = -1;
        }
        if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer) {
            oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseUp();
            oWordControl.MouseDownDocumentCounter--;
            if (oWordControl.MouseDownDocumentCounter < 0) {
                oWordControl.MouseDownDocumentCounter = 0;
            }
            oWordControl.EndUpdateOverlay();
            return;
        }
        oWordControl.m_bIsMouseUpSend = true;
        if (2 == global_mouseEvent.Button) {}
        oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = true;
        oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = false;
        oWordControl.MouseDownDocumentCounter--;
        if (oWordControl.MouseDownDocumentCounter < 0) {
            oWordControl.MouseDownDocumentCounter = 0;
        }
        oWordControl.m_bIsMouseUpSend = false;
        oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        oWordControl.m_oLogicDocument.Document_UpdateRulersState();
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseUpExternal = function (x, y) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        global_mouseEvent.X = x;
        global_mouseEvent.Y = y;
        global_mouseEvent.Type = g_mouse_event_type_up;
        g_bIsMouseUpLockedSend = true;
        if (oWordControl.m_oHorRuler.m_bIsMouseDown) {
            oWordControl.m_oHorRuler.OnMouseUpExternal();
        }
        if (oWordControl.m_oVerRuler.DragType != 0) {
            oWordControl.m_oVerRuler.OnMouseUpExternal();
        }
        global_mouseEvent.Sender = null;
        global_mouseEvent.UnLockMouse();
        global_mouseEvent.IsPressed = false;
        var pos = null;
        if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1) {
            pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        } else {
            pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);
        }
        if (pos.Page == -1) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page)) {
            return;
        }
        oWordControl.m_oDrawingDocument.UnlockCursorType();
        oWordControl.StartUpdateOverlay();
        oWordControl.m_bIsMouseLock = false;
        var is_drawing = oWordControl.m_oDrawingDocument.checkMouseUp_Drawing(pos);
        if (is_drawing === true) {
            return;
        }
        if (-1 != oWordControl.m_oTimerScrollSelect) {
            clearInterval(oWordControl.m_oTimerScrollSelect);
            oWordControl.m_oTimerScrollSelect = -1;
        }
        if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer) {
            oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseUp();
            oWordControl.MouseDownDocumentCounter--;
            if (oWordControl.MouseDownDocumentCounter < 0) {
                oWordControl.MouseDownDocumentCounter = 0;
            }
            oWordControl.EndUpdateOverlay();
            return;
        }
        oWordControl.m_bIsMouseUpSend = true;
        if (2 == global_mouseEvent.Button) {}
        oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
        oWordControl.MouseDownDocumentCounter--;
        if (oWordControl.MouseDownDocumentCounter < 0) {
            oWordControl.MouseDownDocumentCounter = 0;
        }
        oWordControl.m_bIsMouseUpSend = false;
        oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        oWordControl.m_oLogicDocument.Document_UpdateRulersState();
        oWordControl.EndUpdateOverlay();
    };
    this.onMouseWhell = function (e) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
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
    this.checkViewerModeKeys = function (e) {
        var isSendEditor = false;
        if (e.KeyCode == 33) {} else {
            if (e.KeyCode == 34) {} else {
                if (e.KeyCode == 35) {
                    if (true === e.CtrlKey) {
                        oThis.m_oScrollVerApi.scrollTo(0, oThis.m_dScrollY_max);
                    }
                } else {
                    if (e.KeyCode == 36) {
                        if (true === e.CtrlKey) {
                            oThis.m_oScrollVerApi.scrollTo(0, 0);
                        }
                    } else {
                        if (e.KeyCode == 37) {
                            if (oThis.m_bIsHorScrollVisible) {
                                oThis.m_oScrollHorApi.scrollBy(-30, 0, false);
                            }
                        } else {
                            if (e.KeyCode == 38) {
                                oThis.m_oScrollVerApi.scrollBy(0, -30, false);
                            } else {
                                if (e.KeyCode == 39) {
                                    if (oThis.m_bIsHorScrollVisible) {
                                        oThis.m_oScrollHorApi.scrollBy(30, 0, false);
                                    }
                                } else {
                                    if (e.KeyCode == 40) {
                                        oThis.m_oScrollVerApi.scrollBy(0, 30, false);
                                    } else {
                                        if (e.KeyCode == 65 && true === e.CtrlKey) {
                                            isSendEditor = true;
                                        } else {
                                            if (e.KeyCode == 67 && true === e.CtrlKey) {
                                                if (false === e.ShiftKey) {
                                                    Editor_Copy(oThis.m_oApi);
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
        return isSendEditor;
    };
    this.ChangeReaderMode = function () {
        if (this.ReaderModeCurrent) {
            this.DisableReaderMode();
        } else {
            this.EnableReaderMode();
        }
    };
    this.IncreaseReaderFontSize = function () {
        if (null == this.ReaderModeDiv) {
            return;
        }
        if (this.ReaderFontSizeCur >= (this.ReaderFontSizes.length - 1)) {
            this.ReaderFontSizeCur = this.ReaderFontSizes.length - 1;
            return;
        }
        this.ReaderFontSizeCur++;
        this.ReaderModeDiv.style.fontSize = this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt";
        this.ReaderTouchManager.ChangeFontSize();
    };
    this.DecreaseReaderFontSize = function () {
        if (null == this.ReaderModeDiv) {
            return;
        }
        if (this.ReaderFontSizeCur <= 0) {
            this.ReaderFontSizeCur = 0;
            return;
        }
        this.ReaderFontSizeCur--;
        this.ReaderModeDiv.style.fontSize = this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt";
        this.ReaderTouchManager.ChangeFontSize();
    };
    this.EnableReaderMode = function () {
        this.ReaderModeCurrent = 1;
        if (this.ReaderTouchManager) {
            this.TransformDivUseAnimation(this.ReaderModeDivWrapper, 0);
            return;
        }
        this.ReaderModeDivWrapper = document.createElement("div");
        this.ReaderModeDivWrapper.setAttribute("style", "z-index:8;font-family:arial;font-size:12pt;position:absolute;            resize:none;padding:0px;display:block;            margin:0px;left:0px;top:0px;background-color:#FFFFFF");
        var _c_h = parseInt(oThis.m_oMainView.HtmlElement.style.height);
        this.ReaderModeDivWrapper.style.top = _c_h + "px";
        this.ReaderModeDivWrapper.style.width = this.m_oMainView.HtmlElement.style.width;
        this.ReaderModeDivWrapper.style.height = this.m_oMainView.HtmlElement.style.height;
        this.ReaderModeDivWrapper.id = "wrapper_reader_id";
        this.ReaderModeDivWrapper.innerHTML = '<div id="reader_id" style="width:100%;display:block;z-index:9;font-family:arial;font-size:' + this.ReaderFontSizes[this.ReaderFontSizeCur] + 'pt;position:absolute;resize:none;-webkit-box-sizing:border-box;box-sizing:border-box;padding-left:5%;padding-right:5%;padding-top:10%;padding-bottom:10%;background-color:#FFFFFF;">' + this.m_oApi.ContentToHTML(true) + "</div>";
        this.m_oMainView.HtmlElement.appendChild(this.ReaderModeDivWrapper);
        this.ReaderModeDiv = document.getElementById("reader_id");
        this.ReaderTouchManager = new CReaderTouchManager();
        this.ReaderTouchManager.Init(this);
        this.TransformDivUseAnimation(this.ReaderModeDivWrapper, 0);
        var __hasTouch = "ontouchstart" in window;
        if (__hasTouch) {
            this.ReaderModeDivWrapper["ontouchcancel"] = function (e) {
                return oThis.ReaderTouchManager.onTouchEnd(e);
            };
            this.ReaderModeDivWrapper["ontouchstart"] = function (e) {
                return oThis.ReaderTouchManager.onTouchStart(e);
            };
            this.ReaderModeDivWrapper["ontouchmove"] = function (e) {
                return oThis.ReaderTouchManager.onTouchMove(e);
            };
            this.ReaderModeDivWrapper["ontouchend"] = function (e) {
                return oThis.ReaderTouchManager.onTouchEnd(e);
            };
        } else {
            this.ReaderModeDivWrapper["onmousedown"] = function (e) {
                return oThis.ReaderTouchManager.onTouchStart(e);
            };
            this.ReaderModeDivWrapper["onmousemove"] = function (e) {
                return oThis.ReaderTouchManager.onTouchMove(e);
            };
            this.ReaderModeDivWrapper["onmouseup"] = function (e) {
                return oThis.ReaderTouchManager.onTouchEnd(e);
            };
        }
    };
    this.DisableReaderMode = function () {
        this.ReaderModeCurrent = 0;
        if (null == this.ReaderModeDivWrapper) {
            return;
        }
        this.TransformDivUseAnimation(this.ReaderModeDivWrapper, parseInt(this.ReaderModeDivWrapper.style.height) + 10);
        setTimeout(this.CheckDestroyReader, 500);
        return;
    };
    this.CheckDestroyReader = function () {
        if (oThis.ReaderModeDivWrapper != null) {
            if (parseInt(oThis.ReaderModeDivWrapper.style.top) > parseInt(oThis.ReaderModeDivWrapper.style.height)) {
                oThis.m_oMainView.HtmlElement.removeChild(oThis.ReaderModeDivWrapper);
                oThis.ReaderModeDivWrapper = null;
                oThis.ReaderModeDiv = null;
                oThis.ReaderTouchManager.Destroy();
                oThis.ReaderTouchManager = null;
                oThis.ReaderModeCurrent = 0;
                return;
            }
            if (oThis.ReaderModeCurrent == 0) {
                setTimeout(oThis.CheckDestroyReader, 200);
            }
        }
    };
    this.TransformDivUseAnimation = function (_div, topPos) {
        _div.style[window.asc_sdk_transitionProperty] = "top";
        _div.style[window.asc_sdk_transitionDuration] = "1000ms";
        _div.style.top = topPos + "px";
    };
    this.onKeyDown = function (e) {
        if (oThis.m_oApi.IsLongActionCurrent) {
            e.preventDefault();
            return;
        }
        if (oThis.TextBoxInputMode) {
            oThis.onKeyDownTBIM(e);
            return;
        }
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control) {
            check_KeyboardEvent2(e);
            e.preventDefault();
            return;
        }
        if (oWordControl.m_bIsMouseLock === true) {
            if (!window.USER_AGENT_MACOS) {
                check_KeyboardEvent2(e);
                e.preventDefault();
                return;
            }
            oWordControl.onMouseUpExternal(global_mouseEvent.X, global_mouseEvent.Y);
        }
        check_KeyboardEvent(e);
        if (oWordControl.IsFocus === false) {
            if (!oWordControl.onKeyDownNoActiveControl(global_keyboardEvent)) {
                return;
            }
        }
        if (null == oWordControl.m_oLogicDocument) {
            var bIsPrev = (oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnKeyDown(global_keyboardEvent) === true) ? false : true;
            if (false === bIsPrev) {
                e.preventDefault();
            }
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(oWordControl.m_oDrawingDocument.m_lCurrentPage)) {
            return;
        }
        oWordControl.StartUpdateOverlay();
        oWordControl.IsKeyDownButNoPress = true;
        oWordControl.bIsUseKeyPress = (oWordControl.m_oLogicDocument.OnKeyDown(global_keyboardEvent) === true) ? false : true;
        oWordControl.EndUpdateOverlay();
        if (false === oWordControl.bIsUseKeyPress || true === global_keyboardEvent.AltKey) {
            e.preventDefault();
        }
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
        if (oThis.m_oApi.IsLongActionCurrent) {
            e.preventDefault();
            return;
        }
        var oWordControl = oThis;
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_bIsMouseLock === true) {
            if (true == oWordControl.m_oApi.bInit_word_control && oWordControl.IsFocus === true) {
                e.preventDefault();
            }
            return;
        }
        if (null == oWordControl.m_oLogicDocument) {
            check_KeyboardEvent(e);
            var bIsPrev = (oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnKeyDown(global_keyboardEvent) === true) ? false : true;
            if (false === bIsPrev) {
                e.preventDefault();
            }
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(oWordControl.m_oDrawingDocument.m_lCurrentPage)) {
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
        oWordControl.EndUpdateOverlay();
        if (false === oWordControl.bIsUseKeyPress || true === global_keyboardEvent.AltKey) {
            e.preventDefault();
            return false;
        }
        if (global_keyboardEvent.CtrlKey == true && (global_keyboardEvent.KeyCode == 86 || global_keyboardEvent.KeyCode == 67)) {
            oWordControl.bIsUseKeyPress = false;
        }
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
    this.onKeyUp = function (e) {
        global_keyboardEvent.AltKey = false;
        global_keyboardEvent.CtrlKey = false;
        global_keyboardEvent.ShiftKey = false;
    };
    this.onKeyPress = function (e) {
        if (oThis.m_oApi.IsLongActionCurrent) {
            e.preventDefault();
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
        if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_bIsMouseLock === true) {
            return;
        }
        if (window.opera && !oWordControl.IsKeyDownButNoPress) {
            oWordControl.StartUpdateOverlay();
            oWordControl.onKeyDown(e);
            oWordControl.EndUpdateOverlay();
        }
        oWordControl.IsKeyDownButNoPress = false;
        if (false === oWordControl.bIsUseKeyPress) {
            return;
        }
        if (null == oWordControl.m_oLogicDocument) {
            return;
        }
        if (oWordControl.m_oDrawingDocument.IsFreezePage(oWordControl.m_oDrawingDocument.m_lCurrentPage)) {
            return;
        }
        check_KeyboardEvent(e);
        oWordControl.StartUpdateOverlay();
        var retValue = oWordControl.m_oLogicDocument.OnKeyPress(global_keyboardEvent);
        oWordControl.EndUpdateOverlay();
        if (true === retValue) {
            e.preventDefault();
        }
    };
    this.verticalScroll = function (sender, scrollPositionY, maxY, isAtTop, isAtBottom) {
        if (false === oThis.m_oApi.bInit_word_control) {
            return;
        }
        var oWordControl = oThis;
        oWordControl.m_dScrollY = Math.max(0, Math.min(scrollPositionY, maxY));
        oWordControl.m_dScrollY_max = maxY;
        oWordControl.m_bIsUpdateVerRuler = true;
        oWordControl.m_bIsUpdateTargetNoAttack = true;
        if (oWordControl.m_bIsRePaintOnScroll === true) {
            oWordControl.OnScroll();
        }
        if (oWordControl.MobileTouchManager && oWordControl.MobileTouchManager.iScroll) {
            oWordControl.MobileTouchManager.iScroll.y = -oWordControl.m_dScrollY;
        }
    };
    this.CorrectSpeedVerticalScroll = function (newScrollPos) {
        var res = {
            isChange: false,
            Pos: newScrollPos
        };
        if (newScrollPos <= 0 || newScrollPos >= this.m_dScrollY_max) {
            return res;
        }
        var del = parseInt(20 + g_dKoef_mm_to_pix * Page_Height * this.m_nZoomValue / 100);
        var delta = Math.abs(newScrollPos - this.m_dScrollY);
        if (this.m_oDrawingDocument.m_lPagesCount <= 10) {
            return res;
        } else {
            if (this.m_oDrawingDocument.m_lPagesCount <= 100 && (delta < del * 0.3)) {
                return res;
            } else {
                if (delta < del * 0.2) {
                    return res;
                }
            }
        }
        var canvas = this.m_oEditor.HtmlElement;
        if (null == canvas) {
            return;
        }
        var _height = canvas.height;
        var documentMaxY = this.m_dDocumentHeight - _height;
        if (documentMaxY <= 0) {
            return res;
        }
        var lCurrentTopInDoc = parseInt(newScrollPos * documentMaxY / this.m_dScrollY_max);
        var lCount = parseInt(lCurrentTopInDoc / del);
        res.isChange = true;
        res.Pos = parseInt((lCount * del) * this.m_dScrollY_max / documentMaxY);
        if (res.Pos < 0) {
            res.Pos = 0;
        }
        if (res.Pos > this.m_dScrollY_max) {
            res.Pos = this.m_dScrollY_max;
        }
        return res;
    };
    this.horizontalScroll = function (sender, scrollPositionX, maxX, isAtLeft, isAtRight) {
        if (false === oThis.m_oApi.bInit_word_control) {
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
        if (oWordControl.MobileTouchManager && oWordControl.MobileTouchManager.iScroll) {
            oWordControl.MobileTouchManager.iScroll.x = -oWordControl.m_dScrollX;
        }
    };
    this.UpdateScrolls = function () {
        var settings = {
            showArrows: true,
            animateScroll: false,
            scrollBackgroundColor: "#D3D3D3",
            scrollerColor: "#EDEDED",
            screenW: this.m_oEditor.HtmlElement.width,
            screenH: this.m_oEditor.HtmlElement.height,
            vscrollStep: 45,
            hscrollStep: 45
        };
        if (this.bIsRetinaSupport) {
            settings.screenW /= 2;
            settings.screenH /= 2;
        }
        if (this.m_oScrollHor_) {
            this.m_oScrollHor_.Repos(settings, this.m_bIsHorScrollVisible);
        } else {
            this.m_oScrollHor_ = new ScrollObject("id_horizontal_scroll", settings);
            this.m_oScrollHor_.onLockMouse = function (evt) {
                check_MouseDownEvent(evt, true);
                global_mouseEvent.LockMouse();
            };
            this.m_oScrollHor_.offLockMouse = function (evt) {
                check_MouseUpEvent(evt);
            };
            this.m_oScrollHor_.bind("scrollhorizontal", function (evt) {
                oThis.horizontalScroll(this, evt.scrollD, evt.maxScrollX);
            });
            this.m_oScrollHorApi = this.m_oScrollHor_;
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
            this.m_oScrollVer_.bind("correctVerticalScroll", function (yPos) {
                return oThis.CorrectSpeedVerticalScroll(yPos);
            });
            this.m_oScrollVerApi = this.m_oScrollVer_;
        }
        this.m_oApi.asc_fireCallback("asc_onUpdateScrolls", this.m_dDocumentWidth, this.m_dDocumentHeight);
        this.m_dScrollX_max = this.m_oScrollHorApi.getMaxScrolledX();
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
            return;
        }
        this.CheckRetinaDisplay();
        this.m_oBody.Resize(this.Width * g_dKoef_pix_to_mm, this.Height * g_dKoef_pix_to_mm, this);
        if (this.TextBoxBackground != null) {
            this.TextBoxBackground.HtmlElement.style.top = "10px";
        }
        if (this.checkNeedHorScroll()) {
            return;
        }
        if (1 == this.m_nZoomType) {
            if (true === this.zoom_FitToWidth()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll2_sync();
                return;
            }
        }
        if (2 == this.m_nZoomType) {
            if (true === this.zoom_FitToPage()) {
                this.m_oBoundsController.ClearNoAttack();
                this.onTimerScroll2_sync();
                return;
            }
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.m_oHorRuler.RepaintChecker.BlitAttack = true;
        this.m_oVerRuler.RepaintChecker.BlitAttack = true;
        this.UpdateScrolls();
        if (this.MobileTouchManager) {
            this.MobileTouchManager.Resize();
        }
        if (this.ReaderTouchManager) {
            this.ReaderTouchManager.Resize();
        }
        this.m_bIsUpdateTargetNoAttack = true;
        this.m_bIsRePaintOnScroll = true;
        this.m_oBoundsController.ClearNoAttack();
        if (0 == this.m_nZoomType && this.MobileTouchManager) {
            this.MobileTouchManager.CheckZoomCriticalValues();
        }
        this.OnScroll();
        this.onTimerScroll2_sync();
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
        if (this.m_oApi.isMobileVersion) {
            this.m_oPanelRight.Bounds.B = 0;
            this.m_oMainContent.Bounds.B = 0;
            this.m_bIsHorScrollVisible = false;
            var hor_scroll = document.getElementById("panel_hor_scroll");
            hor_scroll.style.width = this.m_dDocumentWidth + "px";
            return false;
        }
        var _editor_width = this.m_oEditor.HtmlElement.width;
        if (this.bIsRetinaSupport) {
            _editor_width /= 2;
        }
        var oldVisible = this.m_bIsHorScrollVisible;
        if (this.m_dDocumentWidth <= _editor_width) {
            this.m_bIsHorScrollVisible = false;
        } else {
            this.m_bIsHorScrollVisible = true;
        }
        var hor_scroll = document.getElementById("panel_hor_scroll");
        hor_scroll.style.width = this.m_dDocumentWidth + "px";
        if (this.m_bIsHorScrollVisible) {
            this.m_oScrollHor.HtmlElement.style.display = "block";
            this.m_oPanelRight.Bounds.B = this.ScrollsWidthPx * g_dKoef_pix_to_mm;
            this.m_oMainContent.Bounds.B = this.ScrollsWidthPx * g_dKoef_pix_to_mm;
        } else {
            this.m_oPanelRight.Bounds.B = 0;
            this.m_oMainContent.Bounds.B = 0;
            this.m_oScrollHor.HtmlElement.style.display = "none";
        }
        if (this.m_bIsHorScrollVisible != oldVisible) {
            this.m_dScrollX = 0;
            this.OnResize(true);
            return true;
        }
        return false;
    };
    this.getScrollMaxX = function (size) {
        if (size >= this.m_dDocumentWidth) {
            return 1;
        }
        return this.m_dDocumentWidth - size;
    };
    this.getScrollMaxY = function (size) {
        if (size >= this.m_dDocumentHeight) {
            return 1;
        }
        return this.m_dDocumentHeight - size;
    };
    this.StartUpdateOverlay = function () {
        this.IsUpdateOverlayOnlyEnd = true;
    };
    this.EndUpdateOverlay = function () {
        if (this.IsUpdateOverlayOnlyEndReturn) {
            return;
        }
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
        overlay.Clear();
        var ctx = overlay.m_oContext;
        var drDoc = this.m_oDrawingDocument;
        if (drDoc.m_bIsSearching) {
            ctx.fillStyle = "rgba(255,200,0,1)";
            ctx.beginPath();
            var drDoc = this.m_oDrawingDocument;
            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++) {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_arrPages[i].pageIndex = i;
                drDoc.m_arrPages[i].DrawSearch(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc);
            }
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1;
        }
        if (null == drDoc.m_oDocumentRenderer) {
            if (drDoc.m_bIsSelection) {
                this.CheckShowOverlay();
                drDoc.private_StartDrawSelection(overlay);
                if (!this.MobileTouchManager) {
                    for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++) {
                        if (!drDoc.IsFreezePage(i)) {
                            this.m_oLogicDocument.Selection_Draw_Page(i);
                        }
                    }
                } else {
                    for (var i = 0; i <= drDoc.m_lPagesCount; i++) {
                        if (!drDoc.IsFreezePage(i)) {
                            this.m_oLogicDocument.Selection_Draw_Page(i);
                        }
                    }
                }
                drDoc.private_EndDrawSelection();
                if (this.MobileTouchManager) {
                    this.MobileTouchManager.CheckSelect2(overlay);
                }
            }
            if (this.MobileTouchManager) {
                this.MobileTouchManager.CheckTableRules2(overlay);
            }
            ctx.globalAlpha = 1;
            var _table_outline = drDoc.TableOutlineDr.TableOutline;
            if (_table_outline != null && !this.MobileTouchManager) {
                var _page = _table_outline.PageNum;
                if (_page >= drDoc.m_lDrawingFirst && _page <= drDoc.m_lDrawingEnd) {
                    var drawPage = drDoc.m_arrPages[_page].drawingPage;
                    drDoc.m_arrPages[_page].DrawTableOutline(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc.TableOutlineDr);
                }
            }
            if (this.m_oLogicDocument.DrawingObjects) {
                for (var indP = drDoc.m_lDrawingFirst; indP <= drDoc.m_lDrawingEnd; indP++) {
                    this.m_oDrawingDocument.AutoShapesTrack.PageIndex = indP;
                    this.m_oLogicDocument.DrawingObjects.drawSelect(indP);
                }
                if (this.m_oLogicDocument.DrawingObjects.needUpdateOverlay()) {
                    overlay.Show();
                    this.m_oDrawingDocument.AutoShapesTrack.PageIndex = -1;
                    this.m_oLogicDocument.DrawingObjects.drawOnOverlay(this.m_oDrawingDocument.AutoShapesTrack);
                    this.m_oDrawingDocument.AutoShapesTrack.CorrectOverlayBounds();
                }
            }
            if (drDoc.TableOutlineDr.bIsTracked) {
                drDoc.DrawTableTrack(overlay);
            }
            if (drDoc.FrameRect.IsActive) {
                drDoc.DrawFrameTrack(overlay);
            }
            drDoc.DrawHorVerAnchor();
        } else {
            ctx.globalAlpha = 0.2;
            if (drDoc.m_oDocumentRenderer.SearchResults.IsSearch) {
                this.m_oOverlayApi.Show();
                if (drDoc.m_oDocumentRenderer.SearchResults.Show) {
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = "rgba(255,200,0,1)";
                    ctx.beginPath();
                    for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++) {
                        var _searching = drDoc.m_oDocumentRenderer.SearchResults.Pages[i];
                        if (0 != _searching.length) {
                            var drawPage = drDoc.m_arrPages[i].drawingPage;
                            drDoc.m_arrPages[i].DrawSearch2(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, _searching);
                        }
                    }
                    ctx.fill();
                    ctx.globalAlpha = 0.2;
                }
                ctx.beginPath();
                if (drDoc.CurrentSearchNavi) {
                    var _pageNum = drDoc.CurrentSearchNavi[0].PageNum;
                    ctx.fillStyle = "rgba(51,102,204,255)";
                    if (_pageNum >= drDoc.m_lDrawingFirst && _pageNum <= drDoc.m_lDrawingEnd) {
                        var drawPage = drDoc.m_arrPages[_pageNum].drawingPage;
                        drDoc.m_arrPages[_pageNum].DrawSearchCur(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc.CurrentSearchNavi);
                    }
                }
            }
            ctx.fillStyle = "rgba(51,102,204,255)";
            ctx.beginPath();
            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++) {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_oDocumentRenderer.DrawSelection(i, overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
            }
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1;
        }
        return true;
    };
    this.OnUpdateSelection = function () {
        if (this.m_oDrawingDocument.m_bIsSelection) {
            this.m_oOverlayApi.Clear();
            this.m_oOverlayApi.m_oContext.beginPath();
            this.m_oOverlayApi.m_oContext.fillStyle = "rgba(51,102,204,255)";
        }
        for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++) {
            if (i < this.m_oDrawingDocument.m_lDrawingFirst || i > this.m_oDrawingDocument.m_lDrawingEnd) {
                continue;
            }
            var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;
            if (this.m_oDrawingDocument.m_bIsSelection) {
                this.m_oDrawingDocument.m_arrPages[i].DrawSelection(this.m_oOverlayApi, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
            }
        }
        if (this.m_oDrawingDocument.m_bIsSelection) {
            this.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
            this.m_oOverlayApi.m_oContext.fill();
            this.m_oOverlayApi.m_oContext.globalAlpha = 1;
            this.m_oOverlayApi.m_oContext.beginPath();
        }
    };
    this.OnCalculatePagesPlace = function () {
        var canvas = this.m_oEditor.HtmlElement;
        if (null == canvas) {
            return;
        }
        var _width = canvas.width;
        var _height = canvas.height;
        if (this.bIsRetinaSupport) {
            _width >>= 1;
            _height >>= 1;
        }
        var bIsFoundFirst = false;
        var bIsFoundEnd = false;
        var hor_pos_median = parseInt(_width / 2);
        if (0 != this.m_dScrollX || (this.m_dDocumentWidth > _width)) {
            hor_pos_median = parseInt(this.m_dDocumentWidth / 2 - this.m_dScrollX);
        }
        var lCurrentTopInDoc = parseInt(this.m_dScrollY);
        var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var lStart = 0;
        for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++) {
            var _pageWidth = parseInt(this.m_oDrawingDocument.m_arrPages[i].width_mm * dKoef);
            var _pageHeight = parseInt(this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef);
            if (false === bIsFoundFirst) {
                if (lStart + 20 + _pageHeight > lCurrentTopInDoc) {
                    this.m_oDrawingDocument.m_lDrawingFirst = i;
                    bIsFoundFirst = true;
                }
            }
            var xDst = hor_pos_median - parseInt(_pageWidth / 2);
            var wDst = _pageWidth;
            var yDst = lStart + 20 - lCurrentTopInDoc;
            var hDst = _pageHeight;
            if (false === bIsFoundEnd) {
                if (yDst > _height) {
                    this.m_oDrawingDocument.m_lDrawingEnd = i - 1;
                    bIsFoundEnd = true;
                }
            }
            var drawRect = this.m_oDrawingDocument.m_arrPages[i].drawingPage;
            drawRect.left = xDst;
            drawRect.top = yDst;
            drawRect.right = xDst + wDst;
            drawRect.bottom = yDst + hDst;
            drawRect.pageIndex = i;
            lStart += (20 + _pageHeight);
        }
        if (false === bIsFoundEnd) {
            this.m_oDrawingDocument.m_lDrawingEnd = this.m_oDrawingDocument.m_lPagesCount - 1;
        }
        if ((-1 == this.m_oDrawingDocument.m_lPagesCount) && (0 != this.m_oDrawingDocument.m_lPagesCount)) {
            this.m_oDrawingDocument.m_lCurrentPage = 0;
            this.SetCurrentPage();
        }
        if (this.m_oApi.isMobileVersion || this.m_oApi.isViewMode) {
            var lPage = this.m_oApi.GetCurrentVisiblePage();
            this.m_oApi.asc_fireCallback("asc_onCurrentVisiblePage", this.m_oApi.GetCurrentVisiblePage());
            if (null != this.m_oDrawingDocument.m_oDocumentRenderer) {
                this.m_oDrawingDocument.m_lCurrentPage = lPage;
                this.m_oApi.asc_fireCallback("asc_onCurrentPage", lPage);
            }
        }
    };
    this.OnPaint = function () {
        if (this.DrawingFreeze) {
            return;
        }
        var canvas = this.m_oEditor.HtmlElement;
        if (null == canvas) {
            return;
        }
        var context = canvas.getContext("2d");
        context.fillStyle = "#B0B0B0";
        var rectsPages = [];
        for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++) {
            var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;
            if (!this.bIsRetinaSupport) {
                var _cur_page_rect = new _rect();
                _cur_page_rect.x = drawPage.left;
                _cur_page_rect.y = drawPage.top;
                _cur_page_rect.w = drawPage.right - drawPage.left;
                _cur_page_rect.h = drawPage.bottom - drawPage.top;
                rectsPages.push(_cur_page_rect);
            } else {
                var _cur_page_rect = new _rect();
                _cur_page_rect.x = drawPage.left << 1;
                _cur_page_rect.y = drawPage.top << 1;
                _cur_page_rect.w = (drawPage.right << 1) - _cur_page_rect.x;
                _cur_page_rect.h = (drawPage.bottom << 1) - _cur_page_rect.y;
                rectsPages.push(_cur_page_rect);
            }
        }
        this.m_oBoundsController.CheckPageRects(rectsPages, context);
        if (this.m_oDrawingDocument.m_bIsSelection) {
            this.m_oOverlayApi.Clear();
            this.m_oOverlayApi.m_oContext.beginPath();
            this.m_oOverlayApi.m_oContext.fillStyle = "rgba(51,102,204,255)";
            this.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
        }
        if (this.NoneRepaintPages) {
            this.m_bIsFullRepaint = false;
            for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++) {
                var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;
                if (!this.bIsRetinaSupport) {
                    this.m_oDrawingDocument.m_arrPages[i].Draw(context, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
                } else {
                    var __x = drawPage.left << 1;
                    var __y = drawPage.top << 1;
                    var __w = (drawPage.right << 1) - __x;
                    var __h = (drawPage.bottom << 1) - __y;
                    this.m_oDrawingDocument.m_arrPages[i].Draw(context, __x, __y, __w, __h);
                }
            }
        } else {
            for (var i = 0; i < this.m_oDrawingDocument.m_lDrawingFirst; i++) {
                this.m_oDrawingDocument.StopRenderingPage(i);
            }
            for (var i = this.m_oDrawingDocument.m_lDrawingEnd + 1; i < this.m_oDrawingDocument.m_lPagesCount; i++) {
                this.m_oDrawingDocument.StopRenderingPage(i);
            }
            for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++) {
                var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;
                if (this.m_bIsFullRepaint === true) {
                    this.m_oDrawingDocument.StopRenderingPage(i);
                }
                if (null == drawPage.cachedImage) {
                    this.m_oDrawingDocument.StartRenderingPage(i);
                }
                if (!this.bIsRetinaSupport) {
                    this.m_oDrawingDocument.m_arrPages[i].Draw(context, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
                } else {
                    var __x = drawPage.left << 1;
                    var __y = drawPage.top << 1;
                    var __w = (drawPage.right << 1) - __x;
                    var __h = (drawPage.bottom << 1) - __y;
                    this.m_oDrawingDocument.m_arrPages[i].Draw(context, __x, __y, __w, __h);
                }
            }
        }
        this.m_bIsFullRepaint = false;
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
    this.CheckRetinaElement = function (htmlElem) {
        if (this.bIsRetinaSupport) {
            if (htmlElem.id == "id_viewer" || htmlElem.id == "id_hor_ruler" || htmlElem.id == "id_vert_ruler") {
                return true;
            }
        }
        return false;
    };
    this.GetDrawingPageInfo = function (nPageIndex) {
        return this.m_oDrawingDocument.m_arrPages[nPageIndex];
    };
    this.CheckFontCache = function () {
        var _c = oThis;
        _c.m_nCurrentTimeClearCache++;
        if (_c.m_nCurrentTimeClearCache > 750) {
            _c.m_nCurrentTimeClearCache = 0;
            _c.m_oDrawingDocument.CheckFontCache();
        }
        oThis.m_oLogicDocument.Spelling.Continue_CheckSpelling();
    };
    this.OnScroll = function () {
        this.OnCalculatePagesPlace();
        this.m_bIsScroll = true;
    };
    this.CheckZoom = function () {
        if (!this.NoneRepaintPages) {
            this.m_oDrawingDocument.ClearCachePages();
        }
    };
    this.ChangeHintProps = function () {
        var bFlag = false;
        if (global_keyboardEvent.CtrlKey) {
            if (null != this.m_oLogicDocument) {
                if (49 == global_keyboardEvent.KeyCode) {
                    SetHintsProps(false, false);
                    bFlag = true;
                } else {
                    if (50 == global_keyboardEvent.KeyCode) {
                        SetHintsProps(true, false);
                        bFlag = true;
                    } else {
                        if (51 == global_keyboardEvent.KeyCode) {
                            SetHintsProps(true, true);
                            bFlag = true;
                        }
                    }
                }
            }
        }
        if (bFlag) {
            this.m_oDrawingDocument.ClearCachePages();
            g_fontManager.ClearFontsRasterCache();
            if (window.g_fontManager2 !== undefined && window.g_fontManager2 !== null) {
                window.g_fontManager2.ClearFontsRasterCache();
            }
        }
        return bFlag;
    };
    this.CalculateDocumentSize = function () {
        this.m_dDocumentWidth = 0;
        this.m_dDocumentHeight = 0;
        this.m_dDocumentPageWidth = 0;
        this.m_dDocumentPageHeight = 0;
        var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++) {
            var mm_w = this.m_oDrawingDocument.m_arrPages[i].width_mm;
            var mm_h = this.m_oDrawingDocument.m_arrPages[i].height_mm;
            if (mm_w > this.m_dDocumentPageWidth) {
                this.m_dDocumentPageWidth = mm_w;
            }
            if (mm_h > this.m_dDocumentPageHeight) {
                this.m_dDocumentPageHeight = mm_h;
            }
            var _pageWidth = parseInt(mm_w * dKoef);
            var _pageHeight = parseInt(mm_h * dKoef);
            if (_pageWidth > this.m_dDocumentWidth) {
                this.m_dDocumentWidth = _pageWidth;
            }
            this.m_dDocumentHeight += 20;
            this.m_dDocumentHeight += _pageHeight;
        }
        this.m_dDocumentHeight += 20;
        if (!this.m_oApi.isMobileVersion) {
            this.m_dDocumentWidth += 40;
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
        this.checkNeedHorScroll();
        document.getElementById("panel_right_scroll").style.height = this.m_dDocumentHeight + "px";
        this.UpdateScrolls();
        if (this.MobileTouchManager) {
            this.MobileTouchManager.Resize();
        }
        if (this.ReaderTouchManager) {
            this.ReaderTouchManager.Resize();
        }
        if (this.m_bIsRePaintOnScroll === true) {
            this.OnScroll();
        }
    };
    this.InitDocument = function (bIsEmpty) {
        this.m_oDrawingDocument.m_oWordControl = this;
        this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
        if (false === bIsEmpty) {
            this.m_oLogicDocument.LoadTestDocument();
        }
        this.CalculateDocumentSize();
        this.StartMainTimer();
        this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.UpdateHorRuler();
        this.UpdateVerRuler();
    };
    this.InitControl = function () {
        this.CalculateDocumentSize();
        if (!this.m_oApi.isOnlyReaderMode) {
            this.StartMainTimer();
        }
        this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.UpdateHorRuler();
        this.UpdateVerRuler();
    };
    this.OpenDocument = function (info) {
        this.m_oDrawingDocument.m_oWordControl = this;
        this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
        this.m_oLogicDocument.fromJfdoc(info);
        this.CalculateDocumentSize();
        this.StartMainTimer();
        this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
        this.UpdateHorRuler();
        this.UpdateVerRuler();
    };
    this.AnimationFrame = function () {
        var now = Date.now();
        if (-1 == oThis.RequestAnimationOldTime || (now >= (oThis.RequestAnimationOldTime + 40))) {
            oThis.RequestAnimationOldTime = now;
            oThis.onTimerScroll2_sync();
        }
        oThis.RequestAnimationFrame.call(window, oThis.AnimationFrame);
    };
    this.onTimerScroll = function () {
        var oWordControl = oThis;
        if (oWordControl.m_bIsScroll) {
            oWordControl.m_bIsScroll = false;
            window.postMessage(_message_update, "*");
        } else {
            if (null != oWordControl.m_oLogicDocument) {
                oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
                oWordControl.m_oLogicDocument.CheckTargetUpdate();
                oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
            }
        }
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.CheckFontCache();
            oWordControl.m_oDrawingDocument.CheckTrackTable();
        }
    };
    this.StartMainTimer = function () {
        if (this.UseRequestAnimationFrame) {
            this.AnimationFrame();
            return;
        }
        if (-1 == this.m_nPaintTimerId) {
            this.onTimerScroll2();
        }
    };
    this.onTimerScroll2 = function () {
        var oWordControl = oThis;
        if (!oWordControl.m_oApi.bInit_word_control) {
            return;
        }
        oWordControl.m_nTimeDrawingLast = new Date().getTime();
        if (oWordControl.m_bIsScroll) {
            oWordControl.m_bIsScroll = false;
            oWordControl.OnPaint();
            if (null != oWordControl.m_oLogicDocument && oWordControl.m_oApi.bInit_word_control) {
                oWordControl.m_oLogicDocument.Viewer_OnChangePosition();
            }
        }
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            oWordControl.m_oLogicDocument.CheckTargetUpdate();
            oWordControl.m_oDrawingDocument.CheckTargetShow();
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
            oWordControl.CheckFontCache();
            oWordControl.m_oDrawingDocument.CheckTrackTable();
        }
        this.m_nPaintTimerId = setTimeout(oWordControl.onTimerScroll2, oWordControl.m_nTimerScrollInterval);
    };
    this.onTimerScroll2_sync = function () {
        var oWordControl = oThis;
        if (!oWordControl.m_oApi.bInit_word_control || oWordControl.m_oApi.isOnlyReaderMode) {
            return;
        }
        oWordControl.m_nTimeDrawingLast = new Date().getTime();
        if (oWordControl.m_bIsScroll) {
            oWordControl.m_bIsScroll = false;
            oWordControl.OnPaint();
            if (null != oWordControl.m_oLogicDocument && oWordControl.m_oApi.bInit_word_control) {
                oWordControl.m_oLogicDocument.Viewer_OnChangePosition();
            }
        }
        if (null != oWordControl.m_oLogicDocument) {
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            oWordControl.m_oLogicDocument.CheckTargetUpdate();
            oWordControl.m_oDrawingDocument.CheckTargetShow();
            oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
            oWordControl.CheckFontCache();
            oWordControl.m_oDrawingDocument.CheckTrackTable();
        }
    };
    this.UpdateHorRuler = function () {
        if (!this.m_bIsRuler) {
            return;
        }
        var _left = 0;
        var lPage = this.m_oDrawingDocument.m_lCurrentPage;
        if (0 <= lPage && lPage < this.m_oDrawingDocument.m_lPagesCount) {
            _left = this.m_oDrawingDocument.m_arrPages[lPage].drawingPage.left;
        } else {
            if (this.m_oDrawingDocument.m_lPagesCount != 0) {
                _left = this.m_oDrawingDocument.m_arrPages[this.m_oDrawingDocument.m_lPagesCount - 1].drawingPage.left;
            }
        }
        this.m_oHorRuler.BlitToMain(_left, 0, this.m_oTopRuler_horRuler.HtmlElement);
    };
    this.UpdateVerRuler = function () {
        if (!this.m_bIsRuler) {
            return;
        }
        var _top = 0;
        var lPage = this.m_oDrawingDocument.m_lCurrentPage;
        if (0 <= lPage && lPage < this.m_oDrawingDocument.m_lPagesCount) {
            _top = this.m_oDrawingDocument.m_arrPages[lPage].drawingPage.top;
        } else {
            if (this.m_oDrawingDocument.m_lPagesCount != 0) {
                _top = this.m_oDrawingDocument.m_arrPages[this.m_oDrawingDocument.m_lPagesCount - 1].drawingPage.top;
            }
        }
        this.m_oVerRuler.BlitToMain(0, _top, this.m_oLeftRuler_vertRuler.HtmlElement);
    };
    this.SetCurrentPage = function (isNoUpdateRulers) {
        var drDoc = this.m_oDrawingDocument;
        if (isNoUpdateRulers === undefined) {
            if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount) {
                this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
                this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
                this.m_oHorRuler.IsCanMoveMargins = true;
                this.m_oVerRuler.IsCanMoveMargins = true;
            }
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.OnScroll();
        this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
    };
    this.SetCurrentPage2 = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount) {
            this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
            this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
        }
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
    };
    this.UpdateHorRulerBack = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount) {
            this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
        }
        this.UpdateHorRuler();
    };
    this.UpdateVerRulerBack = function () {
        var drDoc = this.m_oDrawingDocument;
        if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount) {
            this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
        }
        this.UpdateVerRuler();
    };
    this.GoToPage = function (lPageNum) {
        var drDoc = this.m_oDrawingDocument;
        if (lPageNum < 0 || lPageNum >= drDoc.m_lPagesCount) {
            return;
        }
        var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;
        var lYPos = 0;
        for (var i = 0; i < lPageNum; i++) {
            lYPos += (20 + parseInt(this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef));
        }
        drDoc.m_lCurrentPage = lPageNum;
        this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
        this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
        this.m_bIsUpdateHorRuler = true;
        this.m_bIsUpdateVerRuler = true;
        if (this.m_dDocumentHeight > (this.m_oEditor.HtmlElement.height + 10)) {
            var y = lYPos * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
            this.m_oScrollVerApi.scrollTo(0, y + 1);
        }
        if (this.m_oApi.isViewMode === false && null != this.m_oLogicDocument) {
            if (false === drDoc.IsFreezePage(drDoc.m_lCurrentPage)) {
                this.m_oLogicDocument.Set_CurPage(drDoc.m_lCurrentPage);
                this.m_oLogicDocument.Cursor_MoveAt(0, 0, false);
                this.m_oLogicDocument.RecalculateCurPos();
                this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
            }
        } else {
            this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
        }
    };
    this.GetVerticalScrollTo = function (y, page) {
        var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;
        var lYPos = 0;
        for (var i = 0; i < page; i++) {
            lYPos += (20 + parseInt(this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef));
        }
        lYPos += y * dKoef;
        return lYPos;
    };
    this.GetHorizontalScrollTo = function (x, page) {
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
        this.ReinitTB();
        oThis.TextBoxInput.style.zIndex = 1000;
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
        var newZindex = (oldZindex == 1000) ? "999" : "1000";
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