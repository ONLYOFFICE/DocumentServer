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
function CDocumentReaderMode() {
    this.DefaultFontSize = 12;
    this.CorrectDefaultFontSize = function (size) {
        if (size < 6) {
            return;
        }
        this.DefaultFontSize = size;
    };
    this.CorrectFontSize = function (size) {
        var dRes = size / this.DefaultFontSize;
        dRes = (1 + dRes) / 2;
        dRes = (100 * dRes) >> 0;
        dRes /= 100;
        return "" + dRes + "em";
    };
}
window.USER_AGENT_MACOS = AscBrowser.isMacOs;
window.USER_AGENT_SAFARI_MACOS = AscBrowser.isSafariMacOs;
window.USER_AGENT_IE = AscBrowser.isIE || AscBrowser.isOpera;
window.USER_AGENT_WEBKIT = AscBrowser.isWebkit;
window.GlobalPasteFlagCounter = 0;
window.GlobalPasteFlag = false;
window.PasteEndTimerId = -1;
var COPY_ELEMENT_ID = "SelectId";
var PASTE_ELEMENT_ID = "wrd_pastebin";
var ELEMENT_DISPAY_STYLE = "none";
var copyPasteUseBinary = true;
if (window.USER_AGENT_SAFARI_MACOS) {
    var PASTE_ELEMENT_ID = "SelectId";
    var ELEMENT_DISPAY_STYLE = "block";
}
var PASTE_EMPTY_COUNTER_MAX = 10;
var PASTE_EMPTY_COUNTER = 0;
var PASTE_EMPTY_USE = AscBrowser.isMozilla;
var g_bIsDocumentCopyPaste = true;
var isOnlyLocalBufferSafariWord = false;
function Editor_Copy_GetElem(api) {
    var ElemToSelect = document.getElementById(COPY_ELEMENT_ID);
    if (!ElemToSelect) {
        ElemToSelect = document.createElement("div");
        ElemToSelect.id = COPY_ELEMENT_ID;
        ElemToSelect.className = "sdk-element";
        ElemToSelect.style.position = "absolute";
        ElemToSelect.style.left = "0px";
        ElemToSelect.style.top = "-100px";
        ElemToSelect.style.width = "10000px";
        ElemToSelect.style.height = "100px";
        ElemToSelect.style.overflow = "hidden";
        ElemToSelect.style.zIndex = -1000;
        ElemToSelect.style.MozUserSelect = "text";
        ElemToSelect.style["-khtml-user-select"] = "text";
        ElemToSelect.style["-o-user-select"] = "text";
        ElemToSelect.style["user-select"] = "text";
        ElemToSelect.style["-webkit-user-select"] = "text";
        ElemToSelect.setAttribute("contentEditable", true);
        if (!api || !api.GetCopyPasteDivId) {
            document.body.appendChild(ElemToSelect);
        } else {
            var _div_id = api.GetCopyPasteDivId();
            if ("" == _div_id) {
                document.body.appendChild(ElemToSelect);
            } else {
                var _div = document.getElementById(_div_id);
                _div.appendChild(ElemToSelect);
            }
        }
    }
    return ElemToSelect;
}
function Editor_Copy_Button(api, bCut) {
    if (bCut) {
        History.Create_NewPoint(historydescription_Cut);
    }
    if (AscBrowser.isIE) {
        var ElemToSelect = Editor_Copy_GetElem(api);
        ElemToSelect.style.display = "block";
        while (ElemToSelect.hasChildNodes()) {
            ElemToSelect.removeChild(ElemToSelect.lastChild);
        }
        document.body.style.MozUserSelect = "text";
        delete document.body.style["-khtml-user-select"];
        delete document.body.style["-o-user-select"];
        delete document.body.style["user-select"];
        document.body.style["-webkit-user-select"] = "text";
        if (null != api.WordControl.m_oLogicDocument) {
            var oCopyProcessor = new CopyProcessor(api, ElemToSelect);
            oCopyProcessor.Start();
        } else {
            ElemToSelect.innerHTML = api.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Copy();
        }
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        rangeToSelect.selectNodeContents(ElemToSelect);
        if (ElemToSelect.childElementCount !== 0) {
            selection.removeAllRanges();
        }
        selection.addRange(rangeToSelect);
        document.execCommand("copy");
        ElemToSelect.style.display = "none";
        document.body.style.MozUserSelect = "none";
        document.body.style["-khtml-user-select"] = "none";
        document.body.style["-o-user-select"] = "none";
        document.body.style["user-select"] = "none";
        document.body.style["-webkit-user-select"] = "none";
        if (true == bCut) {
            api.WordControl.m_oLogicDocument.Remove(1, true, true);
            api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
        return true;
    } else {
        var ElemToSelect = Editor_Copy_GetElem(api);
        while (ElemToSelect.hasChildNodes()) {
            ElemToSelect.removeChild(ElemToSelect.lastChild);
        }
        if (null != api.WordControl.m_oLogicDocument) {
            var oCopyProcessor = new CopyProcessor(api, ElemToSelect);
            oCopyProcessor.Start();
        } else {
            ElemToSelect.innerHTML = api.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Copy();
        }
        if (true == bCut) {
            api.WordControl.m_oLogicDocument.Remove(1, true, true);
            api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
        return true;
    }
    return false;
}
function Editor_Copy(api, bCut) {
    if (window.USER_AGENT_SAFARI_MACOS) {
        return;
    }
    var ElemToSelect = Editor_Copy_GetElem(api);
    ElemToSelect.style.display = "block";
    while (ElemToSelect.hasChildNodes()) {
        ElemToSelect.removeChild(ElemToSelect.lastChild);
    }
    document.body.style.MozUserSelect = "text";
    delete document.body.style["-khtml-user-select"];
    delete document.body.style["-o-user-select"];
    delete document.body.style["user-select"];
    document.body.style["-webkit-user-select"] = "text";
    var overflowBody = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    var oldBackgroundcolor = document.body.style["background-color"];
    document.body.style["background-color"] = "transparent";
    ElemToSelect.style.MozUserSelect = "all";
    if (null != api.WordControl.m_oLogicDocument) {
        var oCopyProcessor = new CopyProcessor(api, ElemToSelect);
        oCopyProcessor.Start();
    } else {
        ElemToSelect.innerHTML = api.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Copy();
    }
    if (window.getSelection) {
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        var is_gecko = AscBrowser.isGecko;
        if (is_gecko) {
            ElemToSelect.appendChild(document.createTextNode("\xa0"));
            ElemToSelect.insertBefore(document.createTextNode("\xa0"), ElemToSelect.firstChild);
            rangeToSelect.setStartAfter(ElemToSelect.firstChild);
            rangeToSelect.setEndBefore(ElemToSelect.lastChild);
        } else {
            if (window.USER_AGENT_WEBKIT && (true !== window.USER_AGENT_SAFARI_MACOS)) {
                var aChildNodes = ElemToSelect.childNodes;
                if (aChildNodes.length == 1) {
                    var elem = aChildNodes[0];
                    var wrap = document.createElement("b");
                    wrap.setAttribute("style", "font-weight:normal; background-color: transparent; color: transparent;");
                    elem = ElemToSelect.removeChild(elem);
                    wrap.appendChild(elem);
                    ElemToSelect.appendChild(wrap);
                }
            }
            rangeToSelect.selectNodeContents(ElemToSelect);
        }
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    } else {
        if (document.body.createTextRange) {
            var rangeToSelect = document.body.createTextRange();
            rangeToSelect.moveToElementText(ElemToSelect);
            rangeToSelect.select();
        }
    }
    var time_interval = 200;
    if (window.USER_AGENT_SAFARI_MACOS) {
        time_interval = 200;
    }
    window.setTimeout(function () {
        ElemToSelect.style.display = ELEMENT_DISPAY_STYLE;
        document.body.style.MozUserSelect = "none";
        document.body.style["-khtml-user-select"] = "none";
        document.body.style["-o-user-select"] = "none";
        document.body.style["user-select"] = "none";
        document.body.style["-webkit-user-select"] = "none";
        document.body.style["background-color"] = oldBackgroundcolor;
        ElemToSelect.style.MozUserSelect = "none";
        document.body.style.overflow = overflowBody;
        if (true == bCut) {
            api.WordControl.m_oLogicDocument.Remove(1, true, true);
            api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    time_interval);
}
function Editor_Copy_Event(e, ElemToSelect) {
    var api = editor;
    var oWordControl = api.WordControl;
    if (oWordControl.m_oApi.asc_IsLongAction()) {
        e.preventDefault();
        return;
    }
    if (oWordControl.TextBoxInputMode) {
        oWordControl.onKeyDownTBIM(e);
        return;
    }
    if (false === oWordControl.m_oApi.bInit_word_control) {
        e.preventDefault();
        return;
    }
    if (oWordControl.m_bIsRuler && oWordControl.m_oHorRuler.m_bIsMouseDown) {
        e.preventDefault();
        return;
    }
    if (oWordControl.m_bIsMouseLock === true) {
        if (!window.USER_AGENT_MACOS) {
            e.preventDefault();
            return;
        }
        oWordControl.onMouseUpExternal(global_mouseEvent.X, global_mouseEvent.Y);
    }
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
    if (oWordControl.m_oDrawingDocument.IsFreezePage && oWordControl.m_oDrawingDocument.IsFreezePage(oWordControl.m_oDrawingDocument.m_lCurrentPage)) {
        return;
    }
    if (!ElemToSelect) {
        ElemToSelect = document.createElement("div");
    }
    var oCopyProcessor = new CopyProcessor(api, ElemToSelect);
    var sBase64 = oCopyProcessor.Start();
    if (sBase64 !== false || g_bIsDocumentCopyPaste) {
        e.clipboardData.setData("text/x-custom", sBase64);
        e.clipboardData.setData("text/html", ElemToSelect.innerHTML);
        e.clipboardData.setData("text/plain", ElemToSelect.innerText);
        e.preventDefault();
    }
}
function CopyProcessor(api, ElemToSelect, onlyBinaryCopy) {
    this.api = api;
    this.oDocument = api.WordControl.m_oLogicDocument;
    this.oBinaryFileWriter = new BinaryFileWriter(this.oDocument);
    this.fontsArray = api.FontLoader.fontInfos;
    this.ElemToSelect = ElemToSelect;
    if (!onlyBinaryCopy) {
        this.Ul = document.createElement("ul");
        this.Ol = document.createElement("ol");
    }
    this.onlyBinaryCopy = onlyBinaryCopy;
    this.Para;
    this.bOccurEndPar;
    this.oCurHyperlink = null;
    this.oCurHyperlinkElem = null;
    this.oPresentationWriter = new CBinaryFileWriter();
    this.oPresentationWriter.Start_UseFullUrl(documentOrigin + editor.DocumentUrl);
    this.oPresentationWriter.Start_UseDocumentOrigin(documentOrigin);
}
CopyProcessor.prototype = {
    getSrc: function (src) {
        var start = src.substring(0, 6);
        if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
            return documentOrigin + src;
        } else {
            return src;
        }
    },
    RGBToCSS: function (rgb, unifill) {
        if (null == rgb && null != unifill) {
            unifill.check(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
            var RGBA = unifill.getRGBAColor();
            rgb = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
        }
        var sResult = "#";
        var sR = rgb.r.toString(16);
        if (sR.length == 1) {
            sR = "0" + sR;
        }
        var sG = rgb.g.toString(16);
        if (sG.length == 1) {
            sG = "0" + sG;
        }
        var sB = rgb.b.toString(16);
        if (sB.length == 1) {
            sB = "0" + sB;
        }
        return "#" + sR + sG + sB;
    },
    CommitList: function (oDomTarget) {
        if (this.Ul.childNodes.length > 0) {
            this.Ul.style.paddingLeft = "40px";
            oDomTarget.appendChild(this.Ul);
            this.Ul = document.createElement("ul");
        }
        if (this.Ol.childNodes.length > 0) {
            this.Ol.style.paddingLeft = "40px";
            oDomTarget.appendChild(this.Ol);
            this.Ol = document.createElement("ol");
        }
    },
    Commit_pPr: function (Item) {
        var apPr = [];
        var Def_pPr = this.oDocument.Styles ? this.oDocument.Styles.Default.ParaPr : null;
        var Item_pPr = Item.CompiledPr && Item.CompiledPr.Pr && Item.CompiledPr.Pr.ParaPr ? Item.CompiledPr.Pr.ParaPr : Item.Pr;
        if (Item_pPr && Def_pPr) {
            if (Def_pPr.Ind.Left != Item_pPr.Ind.Left) {
                apPr.push("margin-left:" + (Item_pPr.Ind.Left * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Ind.Right != Item_pPr.Ind.Right) {
                apPr.push("margin-right:" + (Item_pPr.Ind.Right * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Ind.FirstLine != Item_pPr.Ind.FirstLine) {
                apPr.push("text-indent:" + (Item_pPr.Ind.FirstLine * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Jc != Item_pPr.Jc) {
                switch (Item_pPr.Jc) {
                case align_Left:
                    apPr.push("text-align:left");
                    break;
                case align_Center:
                    apPr.push("text-align:center");
                    break;
                case align_Right:
                    apPr.push("text-align:right");
                    break;
                case align_Justify:
                    apPr.push("text-align:justify");
                    break;
                }
            }
            if (Def_pPr.KeepLines != Item_pPr.KeepLines || Def_pPr.WidowControl != Item_pPr.WidowControl) {
                if (Def_pPr.KeepLines != Item_pPr.KeepLines && Def_pPr.WidowControl != Item_pPr.WidowControl) {
                    apPr.push("mso-pagination:none lines-together");
                } else {
                    if (Def_pPr.KeepLines != Item_pPr.KeepLines) {
                        apPr.push("mso-pagination:widow-orphan lines-together");
                    } else {
                        if (Def_pPr.WidowControl != Item_pPr.WidowControl) {
                            apPr.push("mso-pagination:none");
                        }
                    }
                }
            }
            if (Def_pPr.KeepNext != Item_pPr.KeepNext) {
                apPr.push("page-break-after:avoid");
            }
            if (Def_pPr.PageBreakBefore != Item_pPr.PageBreakBefore) {
                apPr.push("page-break-before:always");
            }
            if (Def_pPr.Spacing.Line != Item_pPr.Spacing.Line) {
                if (linerule_AtLeast == Item_pPr.Spacing.LineRule) {
                    apPr.push("line-height:" + (Item_pPr.Spacing.Line * g_dKoef_mm_to_pt) + "pt");
                } else {
                    if (linerule_Auto == Item_pPr.Spacing.LineRule) {
                        if (1 == Item_pPr.Spacing.Line) {
                            apPr.push("line-height:normal");
                        } else {
                            apPr.push("line-height:" + parseInt(Item_pPr.Spacing.Line * 100) + "%");
                        }
                    }
                }
            }
            if (Def_pPr.Spacing.LineRule != Item_pPr.Spacing.LineRule) {
                if (linerule_Exact == Item_pPr.Spacing.LineRule) {
                    apPr.push("mso-line-height-rule:exactly");
                }
            }
            apPr.push("margin-top:" + (Item_pPr.Spacing.Before * g_dKoef_mm_to_pt) + "pt");
            apPr.push("margin-bottom:" + (Item_pPr.Spacing.After * g_dKoef_mm_to_pt) + "pt");
            if (null != Item_pPr.Shd && shd_Nil != Item_pPr.Shd.Value && (null != Item_pPr.Shd.Color || null != Item_pPr.Shd.Unifill)) {
                apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color, Item_pPr.Shd.Unifill));
            }
            if (Item_pPr.Tabs.Get_Count() > 0) {
                var sRes = "";
                for (var i = 0, length = Item_pPr.Tabs.Get_Count(); i < length; i++) {
                    if (0 != i) {
                        sRes += " ";
                    }
                    sRes += Item_pPr.Tabs.Get(i).Pos / 10 + "cm";
                }
                apPr.push("tab-stops:" + sRes);
            }
            if (null != Item_pPr.Brd) {
                apPr.push("border:none");
                var borderStyle = this._BordersToStyle(Item_pPr.Brd, false, true, "mso-", "-alt");
                if (null != borderStyle) {
                    var nborderStyleLength = borderStyle.length;
                    if (nborderStyleLength > 0) {
                        borderStyle = borderStyle.substring(0, nborderStyleLength - 1);
                    }
                    apPr.push(borderStyle);
                }
            }
        }
        if (apPr.length > 0) {
            this.Para.setAttribute("style", apPr.join(";"));
        }
    },
    parse_para_TextPr: function (Value) {
        var aProp = [];
        var aTagStart = [];
        var aTagEnd = [];
        var sRes = "";
        if (null != Value.RFonts) {
            var sFontName = null;
            if (null != Value.RFonts.Ascii) {
                sFontName = Value.RFonts.Ascii.Name;
            } else {
                if (null != Value.RFonts.HAnsi) {
                    sFontName = Value.RFonts.HAnsi.Name;
                } else {
                    if (null != Value.RFonts.EastAsia) {
                        sFontName = Value.RFonts.EastAsia.Name;
                    } else {
                        if (null != Value.RFonts.CS) {
                            sFontName = Value.RFonts.CS.Name;
                        }
                    }
                }
            }
            if (null != sFontName) {
                aProp.push("font-family:" + "'" + CopyPasteCorrectString(sFontName) + "'");
            }
        }
        if (null != Value.FontSize) {
            if (!this.api.DocumentReaderMode) {
                aProp.push("font-size:" + Value.FontSize + "pt");
            } else {
                aProp.push("font-size:" + this.api.DocumentReaderMode.CorrectFontSize(Value.FontSize));
            }
        }
        if (true == Value.Bold) {
            aTagStart.push("<b>");
            aTagEnd.push("</b>");
        }
        if (true == Value.Italic) {
            aTagStart.push("<i>");
            aTagEnd.push("</i>");
        }
        if (true == Value.Underline) {
            aTagStart.push("<u>");
            aTagEnd.push("</u>");
        }
        if (true == Value.Strikeout) {
            aTagStart.push("<s>");
            aTagEnd.push("</s>");
        }
        if (true == Value.DStrikeout) {
            aTagStart.push("<s>");
            aTagEnd.push("</s>");
        }
        if (null != Value.Shd && shd_Nil != Value.Shd.Value && (null != Value.Shd.Color || null != Value.Shd.Unifill)) {
            aProp.push("background-color:" + this.RGBToCSS(Value.Shd.Color, Value.Shd.Unifill));
        } else {
            if (null != Value.HighLight && highlight_None != Value.HighLight) {
                aProp.push("background-color:" + this.RGBToCSS(Value.HighLight, null));
            }
        }
        if (null != Value.Color || null != Value.Unifill) {
            var color;
            if (null != Value.Unifill) {
                color = this.RGBToCSS(null, Value.Unifill);
            } else {
                color = this.RGBToCSS(Value.Color, Value.Unifill);
            }
            aProp.push("color:" + color);
            aProp.push("mso-style-textfill-fill-color:" + color);
        }
        if (null != Value.VertAlign) {
            if (vertalign_SuperScript == Value.VertAlign) {
                aProp.push("vertical-align:super");
            } else {
                if (vertalign_SubScript == Value.VertAlign) {
                    aProp.push("vertical-align:sub");
                }
            }
        }
        return {
            style: aProp.join(";"),
            tagstart: aTagStart.join(""),
            tagend: aTagEnd.join("")
        };
    },
    ParseItem: function (ParaItem) {
        var sRes = "";
        switch (ParaItem.Type) {
        case para_Text:
            var sValue = encodeSurrogateChar(ParaItem.Value);
            if (sValue) {
                sRes += CopyPasteCorrectString(sValue);
            }
            break;
        case para_Space:
            sRes += " ";
            break;
        case para_Tab:
            sRes += "<span style='white-space:pre;'>" + String.fromCharCode(9) + "</span>";
            break;
        case para_NewLine:
            if (break_Page == ParaItem.BreakType) {
                sRes += '<br clear="all" style="mso-special-character:line-break;page-break-before:always;" />';
            } else {
                sRes += '<br style="mso-special-character:line-break;" />';
            }
            break;
        case para_End:
            this.bOccurEndPar = true;
            break;
        case para_Drawing:
            var oGraphicObj = ParaItem.GraphicObj;
            var sSrc = oGraphicObj.getBase64Img();
            if (sSrc.length > 0) {
                sSrc = this.getSrc(sSrc);
                var _w = (null != ParaItem.W) ? ParaItem.W : ParaItem.Extent.W;
                var _h = (null != ParaItem.H) ? ParaItem.H : ParaItem.Extent.H;
                sRes += '<img style="max-width:100%;" width="' + Math.round(_w * g_dKoef_mm_to_pix) + '" height="' + Math.round(_h * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
                break;
            }
            break;
        case para_FlowObjectAnchor:
            var oFlowObj = ParaItem.FlowObject;
            if (flowobject_Image == oFlowObj.Get_Type()) {
                var sSrc = oFlowObj.Img;
                if (sSrc.length > 0) {
                    sSrc = this.getSrc(sSrc);
                    var sStyle = "";
                    var nLeft = oFlowObj.X;
                    var nRight = nLeft + oFlowObj.W;
                    if (Math.abs(nLeft - X_Left_Margin) < Math.abs(Page_Width - nRight - X_Right_Margin)) {
                        sStyle = "float:left;";
                    } else {
                        sStyle = "float:right;";
                    }
                    if (!this.api.DocumentReaderMode) {
                        if (null != oFlowObj.Paddings) {
                            sStyle += "margin:" + (oFlowObj.Paddings.Top * g_dKoef_mm_to_pt) + "pt " + (oFlowObj.Paddings.Right * g_dKoef_mm_to_pt) + "pt " + +(oFlowObj.Paddings.Bottom * g_dKoef_mm_to_pt) + "pt " + +(oFlowObj.Paddings.Left * g_dKoef_mm_to_pt) + "pt;";
                        }
                    } else {
                        sStyle += "margin:0pt 10pt 0pt 10pt;";
                    }
                    if (this.api.DocumentReaderMode) {
                        sStyle += "max-width:100%;";
                    }
                    sRes += '<img style="' + sStyle + '" width="' + Math.round(oFlowObj.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oFlowObj.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
                    break;
                }
            }
            break;
        }
        return sRes;
    },
    CopyRun: function (Item, bUseSelection) {
        var sRes = "";
        var ParaStart = 0;
        var ParaEnd = Item.Content.length;
        if (true == bUseSelection) {
            ParaStart = Item.Selection.StartPos;
            ParaEnd = Item.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        for (var i = ParaStart; i < ParaEnd; i++) {
            sRes += this.ParseItem(Item.Content[i]);
        }
        return sRes;
    },
    CopyRunContent: function (Container, bUseSelection, bOmitHyperlink) {
        var sRes = "";
        var ParaStart = 0;
        var ParaEnd = Container.Content.length - 1;
        if (true == bUseSelection) {
            ParaStart = Container.Selection.StartPos;
            ParaEnd = Container.Selection.EndPos;
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
        for (var i = 0; i < Container.Content.length; i++) {
            var item = Container.Content[i];
            if (para_Run == item.Type) {
                var sRunContent = this.CopyRun(item, bUseSelection);
                if (sRunContent) {
                    sRes += "<span";
                    var oStyle;
                    if (g_bIsDocumentCopyPaste) {
                        oStyle = this.parse_para_TextPr(item.Get_CompiledTextPr());
                    } else {
                        oStyle = this.parse_para_TextPr(item.Get_CompiledTextPr());
                    }
                    if (oStyle && oStyle.style) {
                        sRes += ' style="' + oStyle.style + '"';
                    }
                    sRes += ">";
                    if (oStyle.tagstart) {
                        sRes += oStyle.tagstart;
                    }
                    sRes += sRunContent;
                    if (oStyle.tagend) {
                        sRes += oStyle.tagend;
                    }
                    sRes += "</span>";
                }
            } else {
                if (para_Hyperlink == item.Type) {
                    if (!bOmitHyperlink) {
                        sRes += "<a";
                        var sValue = item.Get_Value();
                        var sToolTip = item.Get_ToolTip();
                        if (null != sValue && "" != sValue) {
                            sRes += ' href="' + CopyPasteCorrectString(sValue) + '"';
                        }
                        if (null != sToolTip && "" != sToolTip) {
                            sRes += ' title="' + CopyPasteCorrectString(sToolTip) + '"';
                        }
                        sRes += ">";
                    }
                    sRes += this.CopyRunContent(item, bUseSelection, true);
                    if (!bOmitHyperlink) {
                        sRes += "</a>";
                    }
                } else {
                    if (para_Math == item.Type) {
                        var sSrc = item.MathToImageConverter();
                        var width = item.Width;
                        var height = item.Height;
                        sRes += "<img";
                        if (null != width && "" != width) {
                            sRes += ' width="' + width + '"';
                        }
                        if (null != height && "" != height) {
                            sRes += ' height="' + height + '"';
                        }
                        if (null != sSrc && "" != sSrc && null != sSrc.ImageUrl) {
                            sRes += ' src="' + sSrc.ImageUrl + '"';
                        }
                        sRes += ">";
                        sRes += "</img>";
                    }
                }
            }
        }
        return sRes;
    },
    CopyParagraph: function (oDomTarget, Item, bLast, bUseSelection, aDocumentContent, nDocumentContentIndex) {
        var oDocument = this.oDocument;
        this.Para = null;
        var styleId = Item.Style_Get();
        if (styleId) {
            var styleName = oDocument.Styles.Get_Name(styleId).toLowerCase();
            if (0 == styleName.indexOf("heading")) {
                var nLevel = parseInt(styleName.substring("heading".length));
                if (1 <= nLevel && nLevel <= 6) {
                    this.Para = document.createElement("h" + nLevel);
                }
            }
        }
        if (null == this.Para) {
            this.Para = document.createElement("p");
        }
        this.bOccurEndPar = false;
        var oNumPr;
        var bIsNullNumPr = false;
        if (g_bIsDocumentCopyPaste) {
            oNumPr = Item.Numbering_Get();
            bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
        } else {
            oNumPr = Item.PresentationPr.Bullet;
            bIsNullNumPr = (0 == oNumPr.m_nType);
        }
        if (bIsNullNumPr) {
            this.CommitList(oDomTarget);
        } else {
            var bBullet = false;
            var sListStyle = "";
            if (g_bIsDocumentCopyPaste) {
                var aNum = this.oDocument.Numbering.Get_AbstractNum(oNumPr.NumId);
                if (null != aNum) {
                    var LvlPr = aNum.Lvl[oNumPr.Lvl];
                    if (null != LvlPr) {
                        switch (LvlPr.Format) {
                        case numbering_numfmt_Decimal:
                            sListStyle = "decimal";
                            break;
                        case numbering_numfmt_LowerRoman:
                            sListStyle = "lower-roman";
                            break;
                        case numbering_numfmt_UpperRoman:
                            sListStyle = "upper-roman";
                            break;
                        case numbering_numfmt_LowerLetter:
                            sListStyle = "lower-alpha";
                            break;
                        case numbering_numfmt_UpperLetter:
                            sListStyle = "upper-alpha";
                            break;
                        default:
                            sListStyle = "disc";
                            bBullet = true;
                            break;
                        }
                    }
                }
            } else {
                var _presentation_bullet = Item.PresentationPr.Bullet;
                switch (_presentation_bullet.m_nType) {
                case numbering_presentationnumfrmt_ArabicPeriod:
                    case numbering_presentationnumfrmt_ArabicParenR:
                    sListStyle = "decimal";
                    break;
                case numbering_presentationnumfrmt_RomanLcPeriod:
                    sListStyle = "lower-roman";
                    break;
                case numbering_presentationnumfrmt_RomanUcPeriod:
                    sListStyle = "upper-roman";
                    break;
                case numbering_presentationnumfrmt_AlphaLcParenR:
                    case numbering_presentationnumfrmt_AlphaLcPeriod:
                    sListStyle = "lower-alpha";
                    break;
                case numbering_presentationnumfrmt_AlphaUcParenR:
                    case numbering_presentationnumfrmt_AlphaUcPeriod:
                    sListStyle = "upper-alpha";
                    break;
                default:
                    sListStyle = "disc";
                    bBullet = true;
                    break;
                }
            }
            if ((bBullet && this.Ol.childNodes.length > 0) || (!bBullet && this.Ul.childNodes.length > 0)) {
                this.CommitList(oDomTarget);
            }
            var Li = document.createElement("li");
            Li.setAttribute("style", "list-style-type: " + sListStyle);
            Li.appendChild(this.Para);
            if (bBullet) {
                this.Ul.appendChild(Li);
            } else {
                this.Ol.appendChild(Li);
            }
        }
        this.Commit_pPr(Item);
        this.Para.innerHTML = this.CopyRunContent(Item, bUseSelection, false);
        if (bLast && false == this.bOccurEndPar) {
            if (false == bIsNullNumPr) {
                var li = this.Para.parentNode;
                var ul = li.parentNode;
                ul.removeChild(li);
                this.CommitList(oDomTarget);
            }
            for (var i = 0; i < this.Para.childNodes.length; i++) {
                oDomTarget.appendChild(this.Para.childNodes[i].cloneNode(true));
            }
        } else {
            if (this.Para.childNodes.length == 0) {
                this.Para.appendChild(document.createTextNode("\xa0"));
            }
            if (bIsNullNumPr) {
                oDomTarget.appendChild(this.Para);
            }
        }
    },
    _BorderToStyle: function (border, name) {
        var res = "";
        if (border_None == border.Value) {
            res += name + ":none;";
        } else {
            var size = 0.5;
            var color = border.Color;
            var unifill = border.Unifill;
            if (null != border.Size) {
                size = border.Size * g_dKoef_mm_to_pt;
            }
            if (null == color) {
                color = {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
            res += name + ":" + size + "pt solid " + this.RGBToCSS(color, unifill) + ";";
        }
        return res;
    },
    _MarginToStyle: function (margins, styleName) {
        var res = "";
        var nMarginLeft = 1.9;
        var nMarginTop = 0;
        var nMarginRight = 1.9;
        var nMarginBottom = 0;
        if (null != margins.Left && tblwidth_Mm == margins.Left.Type && null != margins.Left.W) {
            nMarginLeft = margins.Left.W;
        }
        if (null != margins.Top && tblwidth_Mm == margins.Top.Type && null != margins.Top.W) {
            nMarginTop = margins.Top.W;
        }
        if (null != margins.Right && tblwidth_Mm == margins.Right.Type && null != margins.Right.W) {
            nMarginRight = margins.Right.W;
        }
        if (null != margins.Bottom && tblwidth_Mm == margins.Bottom.Type && null != margins.Bottom.W) {
            nMarginBottom = margins.Bottom.W;
        }
        res = styleName + ":" + (nMarginTop * g_dKoef_mm_to_pt) + "pt " + (nMarginRight * g_dKoef_mm_to_pt) + "pt " + (nMarginBottom * g_dKoef_mm_to_pt) + "pt " + (nMarginLeft * g_dKoef_mm_to_pt) + "pt;";
        return res;
    },
    _BordersToStyle: function (borders, bUseInner, bUseBetween, mso, alt) {
        var res = "";
        if (null == mso) {
            mso = "";
        }
        if (null == alt) {
            alt = "";
        }
        if (null != borders.Left) {
            res += this._BorderToStyle(borders.Left, mso + "border-left" + alt);
        }
        if (null != borders.Top) {
            res += this._BorderToStyle(borders.Top, mso + "border-top" + alt);
        }
        if (null != borders.Right) {
            res += this._BorderToStyle(borders.Right, mso + "border-right" + alt);
        }
        if (null != borders.Bottom) {
            res += this._BorderToStyle(borders.Bottom, mso + "border-bottom" + alt);
        }
        if (bUseInner) {
            if (null != borders.InsideV) {
                res += this._BorderToStyle(borders.InsideV, "mso-border-insidev");
            }
            if (null != borders.InsideH) {
                res += this._BorderToStyle(borders.InsideH, "mso-border-insideh");
            }
        }
        if (bUseBetween) {
            if (null != borders.Between) {
                res += this._BorderToStyle(borders.Between, "mso-border-between");
            }
        }
        return res;
    },
    _MergeProp: function (elem1, elem2) {
        if (!elem1 || !elem2) {
            return;
        }
        var p, v;
        for (p in elem2) {
            if (elem2.hasOwnProperty(p) && false == elem1.hasOwnProperty(p)) {
                v = elem2[p];
                if (null != v) {
                    elem1[p] = v;
                }
            }
        }
    },
    CopyCell: function (tr, cell, tablePr, width, rowspan) {
        var tc = document.createElement("td");
        var tcStyle = "";
        if (width > 0) {
            tc.setAttribute("width", Math.round(width * g_dKoef_mm_to_pix));
            tcStyle += "width:" + (width * g_dKoef_mm_to_pt) + "pt;";
        }
        if (rowspan > 1) {
            tc.setAttribute("rowspan", rowspan);
        }
        var cellPr = null;
        var tablePr = null;
        if (!g_bIsDocumentCopyPaste && editor.WordControl.m_oLogicDocument && null != cell.CompiledPr && null != cell.CompiledPr.Pr) {
            var presentation = editor.WordControl.m_oLogicDocument;
            var curSlide = presentation.Slides[presentation.CurPage];
            if (presentation && curSlide && curSlide.Layout && curSlide.Layout.Master && curSlide.Layout.Master.Theme) {
                checkTableCellPr(cell.CompiledPr.Pr, curSlide, curSlide.Layout, curSlide.Layout.Master, curSlide.Layout.Master.Theme);
            }
        }
        if (null != cell.CompiledPr && null != cell.CompiledPr.Pr) {
            cellPr = cell.CompiledPr.Pr;
            if (null != cellPr.GridSpan && cellPr.GridSpan > 1) {
                tc.setAttribute("colspan", cellPr.GridSpan);
            }
        }
        if (null != cellPr && null != cellPr.Shd) {
            if (shd_Nil != cellPr.Shd.Value && (null != cellPr.Shd.Color || null != cellPr.Shd.Unifill)) {
                tcStyle += "background-color:" + this.RGBToCSS(cellPr.Shd.Color, cellPr.Shd.Unifill) + ";";
            }
        } else {
            if (null != tablePr && null != tablePr.Shd) {
                if (shd_Nil != tablePr.Shd.Value && (null != tablePr.Shd.Color || null != tablePr.Shd.Unifill)) {
                    tcStyle += "background-color:" + this.RGBToCSS(tablePr.Shd.Color, tablePr.Shd.Unifill) + ";";
                }
            }
        }
        var oCellMar = {};
        if (null != cellPr && null != cellPr.TableCellMar) {
            this._MergeProp(oCellMar, cellPr.TableCellMar);
        }
        if (null != tablePr && null != tablePr.TableCellMar) {
            this._MergeProp(oCellMar, tablePr.TableCellMar);
        }
        tcStyle += this._MarginToStyle(oCellMar, "padding");
        var oCellBorder = {};
        if (null != cellPr && null != cellPr.TableCellBorders) {
            this._MergeProp(oCellBorder, cellPr.TableCellBorders);
        }
        if (null != tablePr && null != tablePr.TableBorders) {
            this._MergeProp(oCellBorder, tablePr.TableBorders);
        }
        tcStyle += this._BordersToStyle(oCellBorder, false, false);
        if ("" != tcStyle) {
            tc.setAttribute("style", tcStyle);
        }
        this.CopyDocument2(tc, cell.Content, false);
        tr.appendChild(tc);
    },
    CopyRow: function (oDomTarget, table, nCurRow, elems, nMaxRow) {
        var row = table.Content[nCurRow];
        if (null == elems) {
            elems = {
                gridStart: 0,
                gridEnd: table.TableGrid.length - 1,
                indexStart: null,
                indexEnd: null,
                after: null,
                before: null,
                cells: row.Content
            };
        }
        var tr = document.createElement("tr");
        table.Internal_RecalculateGrid();
        var gridSum = table.TableSumGrid;
        var trStyle = "";
        var nGridBefore = 0;
        var rowPr = null;
        var CompiledPr = row.Get_CompiledPr();
        if (null != CompiledPr) {
            rowPr = CompiledPr;
        }
        if (null != rowPr) {
            if (null == elems.before && null != rowPr.GridBefore && rowPr.GridBefore > 0) {
                elems.before = rowPr.GridBefore;
                elems.gridStart += rowPr.GridBefore;
            }
            if (null == elems.after && null != rowPr.GridAfter && rowPr.GridAfter > 0) {
                elems.after = rowPr.GridAfter;
                elems.gridEnd -= rowPr.GridAfter;
            }
            if (null != rowPr.Height && heightrule_Auto != rowPr.Height.HRule && null != rowPr.Height.Value) {
                trStyle += "height:" + (rowPr.Height.Value * g_dKoef_mm_to_pt) + "pt;";
            }
        }
        if (null != elems.before) {
            if (elems.before > 0) {
                nGridBefore = elems.before;
                var nWBefore = gridSum[elems.gridStart - 1] - gridSum[elems.gridStart - nGridBefore - 1];
                trStyle += "mso-row-margin-left:" + (nWBefore * g_dKoef_mm_to_pt) + "pt;";
                var oNewTd = document.createElement("td");
                oNewTd.setAttribute("style", "mso-cell-special:placeholder;border:none;padding:0cm 0cm 0cm 0cm");
                oNewTd.setAttribute("width", Math.round(nWBefore * g_dKoef_mm_to_pix));
                if (nGridBefore > 1) {
                    oNewTd.setAttribute("colspan", nGridBefore);
                }
                var oNewP = document.createElement("p");
                oNewP.setAttribute("style", "margin:0cm");
                oNewP.appendChild(document.createTextNode("\xa0"));
                oNewTd.appendChild(oNewP);
                tr.appendChild(oNewTd);
            }
        }
        var tablePr = null;
        var compiledTablePr = table.Get_CompiledPr();
        if (null != compiledTablePr && null != compiledTablePr.TablePr) {
            tablePr = compiledTablePr.TablePr;
        }
        for (var i in elems.cells) {
            var cell = row.Content[i];
            if (vmerge_Continue != cell.Get_VMerge()) {
                var StartGridCol = cell.Metrics.StartGridCol;
                var GridSpan = cell.Get_GridSpan();
                var width = gridSum[StartGridCol + GridSpan - 1] - gridSum[StartGridCol - 1];
                var nRowSpan = table.Internal_GetVertMergeCount(nCurRow, StartGridCol, GridSpan);
                if (nCurRow + nRowSpan - 1 > nMaxRow) {
                    nRowSpan = nMaxRow - nCurRow + 1;
                    if (nRowSpan <= 0) {
                        nRowSpan = 1;
                    }
                }
                this.CopyCell(tr, cell, tablePr, width, nRowSpan);
            }
        }
        if (null != elems.after) {
            if (elems.after > 0) {
                var nGridAfter = elems.after;
                var nWAfter = gridSum[elems.gridEnd + nGridAfter] - gridSum[elems.gridEnd];
                trStyle += "mso-row-margin-right:" + (nWAfter * g_dKoef_mm_to_pt) + "pt;";
                var oNewTd = document.createElement("td");
                oNewTd.setAttribute("style", "mso-cell-special:placeholder;border:none;padding:0cm 0cm 0cm 0cm");
                oNewTd.setAttribute("width", Math.round(nWAfter * g_dKoef_mm_to_pix));
                if (nGridAfter > 1) {
                    oNewTd.setAttribute("colspan", nGridAfter);
                }
                var oNewP = document.createElement("p");
                oNewP.setAttribute("style", "margin:0cm");
                oNewP.appendChild(document.createTextNode("\xa0"));
                oNewTd.appendChild(oNewP);
                tr.appendChild(oNewTd);
            }
        }
        if ("" != trStyle) {
            tr.setAttribute("style", trStyle);
        }
        oDomTarget.appendChild(tr);
    },
    CopyTable: function (oDomTarget, table, aRowElems) {
        this.CommitList(oDomTarget);
        var DomTable = document.createElement("table");
        var compiledPr = table.Get_CompiledPr();
        var Pr = null;
        if (compiledPr && null != compiledPr.TablePr) {
            Pr = compiledPr.TablePr;
        }
        var tblStyle = "";
        var bBorder = false;
        if (null != Pr) {
            var align = "";
            if (true != table.Inline && null != table.PositionH) {
                var PositionH = table.PositionH;
                if (true == PositionH.Align) {
                    switch (PositionH.Value) {
                    case c_oAscXAlign.Outside:
                        case c_oAscXAlign.Right:
                        align = "right";
                        break;
                    case c_oAscXAlign.Center:
                        align = "center";
                        break;
                    }
                } else {
                    if (table.TableSumGrid) {
                        var TableWidth = table.TableSumGrid[table.TableSumGrid.length - 1];
                        var nLeft = PositionH.Value;
                        var nRight = nLeft + TableWidth;
                        var nFromLeft = Math.abs(nLeft - X_Left_Margin);
                        var nFromCenter = Math.abs((Page_Width - X_Right_Margin + X_Left_Margin) / 2 - (nLeft + nRight) / 2);
                        var nFromRight = Math.abs(Page_Width - nRight - X_Right_Margin);
                        if (nFromRight < nFromLeft || nFromCenter < nFromLeft) {
                            if (nFromRight < nFromCenter) {
                                align = "right";
                            } else {
                                align = "center";
                            }
                        }
                    }
                }
            } else {
                if (null != Pr.Jc) {
                    switch (Pr.Jc) {
                    case align_Center:
                        align = "center";
                        break;
                    case align_Right:
                        align = "right";
                        break;
                    }
                }
            }
            if ("" != align) {
                DomTable.setAttribute("align", align);
            }
            if (null != Pr.TableInd) {
                tblStyle += "margin-left:" + (Pr.TableInd * g_dKoef_mm_to_pt) + "pt;";
            }
            if (null != Pr.Shd && shd_Nil != Pr.Shd.Value && (null != Pr.Shd.Color || null != Pr.Shd.Unifill)) {
                tblStyle += "background:" + this.RGBToCSS(Pr.Shd.Color, Pr.Shd.Unifill) + ";";
            }
            if (null != Pr.TableCellMar) {
                tblStyle += this._MarginToStyle(Pr.TableCellMar, "mso-padding-alt");
            }
            if (null != Pr.TableBorders) {
                tblStyle += this._BordersToStyle(Pr.TableBorders, true, false);
            }
        }
        var bAddSpacing = false;
        if (table.Content.length > 0) {
            var firstRow = table.Content[0];
            var rowPr = firstRow.Get_CompiledPr();
            if (null != rowPr && null != rowPr.TableCellSpacing) {
                bAddSpacing = true;
                var cellSpacingMM = rowPr.TableCellSpacing;
                tblStyle += "mso-cellspacing:" + (cellSpacingMM * g_dKoef_mm_to_pt) + "pt;";
                DomTable.setAttribute("cellspacing", Math.round(cellSpacingMM * g_dKoef_mm_to_pix));
            }
        }
        if (!bAddSpacing) {
            DomTable.setAttribute("cellspacing", 0);
        }
        DomTable.setAttribute("border", false == bBorder ? 0 : 1);
        DomTable.setAttribute("cellpadding", 0);
        if ("" != tblStyle) {
            DomTable.setAttribute("style", tblStyle);
        }
        if (null == aRowElems) {
            for (var i = 0, length = table.Content.length; i < length; i++) {
                this.CopyRow(DomTable, table, i, null, table.Content.length - 1);
            }
        } else {
            var nMaxRow = 0;
            for (var i = 0, length = aRowElems.length; i < length; ++i) {
                var elem = aRowElems[i];
                if (elem.row > nMaxRow) {
                    nMaxRow = elem.row;
                }
            }
            for (var i = 0, length = aRowElems.length; i < length; ++i) {
                var elem = aRowElems[i];
                this.CopyRow(DomTable, table, elem.row, elem, nMaxRow);
            }
        }
        oDomTarget.appendChild(DomTable);
    },
    CopyDocument: function (oDomTarget, oDocument, bUseSelection) {
        var Start = 0;
        var End = 0;
        if (bUseSelection) {
            if (true === oDocument.Selection.Use) {
                if (selectionflag_DrawingObject === oDocument.Selection.Flag) {
                    this.Para = document.createElement("p");
                    this.Para.innerHTML = this.ParseItem(oDocument.Selection.Data.DrawingObject);
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                    }
                } else {
                    Start = oDocument.Selection.StartPos;
                    End = oDocument.Selection.EndPos;
                    if (Start > End) {
                        var Temp = End;
                        End = Start;
                        Start = Temp;
                    }
                }
            }
        } else {
            Start = 0;
            End = oDocument.Content.length - 1;
        }
        for (var Index = Start; Index <= End; Index++) {
            var Item = oDocument.Content[Index];
            if (type_Table === Item.GetType()) {
                if (bUseSelection) {
                    if (table_Selection_Text == Item.Selection.Type) {
                        var rowIndex = Item.Selection.StartPos.Pos.Row;
                        var colIndex = Item.Selection.StartPos.Pos.Cell;
                        if (rowIndex < Item.Content.length) {
                            var row = Item.Content[rowIndex];
                            if (colIndex < row.Content.length) {
                                var cell = row.Content[colIndex];
                                this.CopyDocument(oDomTarget, cell.Content, bUseSelection);
                            }
                        }
                    } else {
                        if (table_Selection_Cell == Item.Selection.Type) {
                            var aSelectedRows = [];
                            var oRowElems = {};
                            if (Item.Selection.Data.length > 0) {
                                for (var i = 0, length = Item.Selection.Data.length; i < length; ++i) {
                                    var elem = Item.Selection.Data[i];
                                    var rowElem = oRowElems[elem.Row];
                                    if (null == rowElem) {
                                        rowElem = {
                                            row: elem.Row,
                                            gridStart: null,
                                            gridEnd: null,
                                            indexStart: null,
                                            indexEnd: null,
                                            after: null,
                                            before: null,
                                            cells: {}
                                        };
                                        oRowElems[elem.Row] = rowElem;
                                        aSelectedRows.push(rowElem);
                                    }
                                    if (null == rowElem.indexEnd || elem.Cell > rowElem.indexEnd) {
                                        rowElem.indexEnd = elem.Cell;
                                    }
                                    if (null == rowElem.indexStart || elem.Cell < rowElem.indexStart) {
                                        rowElem.indexStart = elem.Cell;
                                    }
                                    rowElem.cells[elem.Cell] = 1;
                                }
                            }
                            aSelectedRows.sort(function (a, b) {
                                return a.row - b.row;
                            });
                            var nMinGrid = null;
                            var nMaxGrid = null;
                            var nPrevStartGrid = null;
                            var nPrevEndGrid = null;
                            var nPrevRowIndex = null;
                            for (var i = 0, length = aSelectedRows.length; i < length; ++i) {
                                var elem = aSelectedRows[i];
                                var nRowIndex = elem.row;
                                if (null != nPrevRowIndex) {
                                    if (nPrevRowIndex + 1 != nRowIndex) {
                                        nMinGrid = null;
                                        nMaxGrid = null;
                                        break;
                                    }
                                }
                                nPrevRowIndex = nRowIndex;
                                var row = Item.Content[nRowIndex];
                                var cellFirst = row.Get_Cell(elem.indexStart);
                                var cellLast = row.Get_Cell(elem.indexEnd);
                                var nCurStartGrid = cellFirst.Metrics.StartGridCol;
                                var nCurEndGrid = cellLast.Metrics.StartGridCol + cellLast.Get_GridSpan() - 1;
                                if (null != nPrevStartGrid && null != nPrevEndGrid) {
                                    if (nCurStartGrid > nPrevStartGrid) {
                                        for (var j = elem.indexStart - 1; j >= 0; --j) {
                                            var cellCur = row.Get_Cell(j);
                                            if (vmerge_Continue == cellCur.Get_VMerge()) {
                                                var nCurGridCol = cellCur.Metrics.StartGridCol;
                                                if (nCurGridCol >= nPrevStartGrid) {
                                                    nCurStartGrid = nCurGridCol;
                                                    elem.indexStart = j;
                                                } else {
                                                    break;
                                                }
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                    if (nCurEndGrid < nPrevEndGrid) {
                                        for (var j = elem.indexEnd + 1; j < row.Get_CellsCount(); ++j) {
                                            var cellCur = row.Get_Cell(j);
                                            if (vmerge_Continue == cellCur.Get_VMerge()) {
                                                var nCurGridCol = cellCur.Metrics.StartGridCol + cellCur.Get_GridSpan() - 1;
                                                if (nCurGridCol <= nPrevEndGrid) {
                                                    nCurEndGrid = nCurGridCol;
                                                    elem.indexEnd = j;
                                                } else {
                                                    break;
                                                }
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                }
                                elem.gridStart = nPrevStartGrid = nCurStartGrid;
                                elem.gridEnd = nPrevEndGrid = nCurEndGrid;
                                if (null == nMinGrid || nMinGrid > nCurStartGrid) {
                                    nMinGrid = nCurStartGrid;
                                }
                                if (null == nMaxGrid || nMaxGrid < nCurEndGrid) {
                                    nMaxGrid = nCurEndGrid;
                                }
                            }
                            if (null != nMinGrid && null != nMaxGrid) {
                                for (var i = 0, length = aSelectedRows.length; i < length; ++i) {
                                    var elem = aSelectedRows[i];
                                    elem.before = elem.gridStart - nMinGrid;
                                    elem.after = nMaxGrid - elem.gridEnd;
                                }
                                this.oBinaryFileWriter.copyParams.bLockCopyElems++;
                                this.CopyTable(oDomTarget, Item, aSelectedRows);
                                this.oBinaryFileWriter.copyParams.bLockCopyElems--;
                                this.oBinaryFileWriter.CopyTable(Item, aSelectedRows, nMinGrid, nMaxGrid);
                            }
                        }
                    }
                } else {
                    this.oBinaryFileWriter.copyParams.bLockCopyElems++;
                    this.CopyTable(oDomTarget, Item, null);
                    this.oBinaryFileWriter.copyParams.bLockCopyElems--;
                    this.oBinaryFileWriter.CopyTable(Item, null);
                }
            } else {
                if (type_Paragraph === Item.GetType()) {
                    this.oBinaryFileWriter.CopyParagraph(Item);
                    this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
                }
            }
        }
        this.CommitList(oDomTarget);
    },
    CopyDocument2: function (oDomTarget, oDocument, bUseSelection, elementsContent, bFromPresentation) {
        if (g_bIsDocumentCopyPaste) {
            if (!elementsContent && oDocument && oDocument.Content) {
                elementsContent = oDocument.Content;
            }
            for (var Index = 0; Index < elementsContent.length; Index++) {
                var Item;
                if (elementsContent[Index].Element) {
                    Item = elementsContent[Index].Element;
                } else {
                    Item = elementsContent[Index];
                }
                if (type_Table === Item.GetType()) {
                    this.oBinaryFileWriter.copyParams.bLockCopyElems++;
                    if (!this.onlyBinaryCopy) {
                        this.CopyTable(oDomTarget, Item, null);
                    }
                    this.oBinaryFileWriter.copyParams.bLockCopyElems--;
                    if (!bFromPresentation) {
                        this.oBinaryFileWriter.CopyTable(Item, null);
                    }
                } else {
                    if (type_Paragraph === Item.GetType()) {
                        if (!bFromPresentation) {
                            this.oBinaryFileWriter.CopyParagraph(Item, elementsContent[Index].SelectedAll);
                        }
                        if (!this.onlyBinaryCopy) {
                            this.CopyParagraph(oDomTarget, Item, true, false);
                        }
                    }
                }
            }
        } else {
            var presentation = this.oDocument;
            if (!elementsContent && oDocument && oDocument.Content) {
                elementsContent = oDocument.Content;
            }
            if (elementsContent.DocContent || (elementsContent.Drawings && elementsContent.Drawings.length) || (elementsContent.SlideObjects && elementsContent.SlideObjects.length)) {
                this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                this.oPresentationWriter.WriteDouble(presentation.Width);
                this.oPresentationWriter.WriteDouble(presentation.Height);
            }
            if (elementsContent.DocContent) {
                var docContent = elementsContent.DocContent;
                if (docContent.Elements) {
                    var elements = docContent.Elements;
                    this.oPresentationWriter.WriteString2("Content");
                    this.oPresentationWriter.WriteDouble(elements.length);
                    for (var Index = 0; Index < elements.length; Index++) {
                        var Item;
                        if (elements[Index].Element) {
                            Item = elements[Index].Element;
                        } else {
                            Item = elements[Index];
                        }
                        if (type_Paragraph === Item.GetType()) {
                            this.oPresentationWriter.StartRecord(0);
                            this.oPresentationWriter.WriteParagraph(Item);
                            this.oPresentationWriter.EndRecord();
                            this.CopyParagraph(oDomTarget, Item, true, false);
                        }
                    }
                }
            } else {
                if (elementsContent.Drawings && elementsContent.Drawings.length) {
                    var elements = elementsContent.Drawings;
                    this.Para = document.createElement("p");
                    this.oPresentationWriter.WriteString2("Drawings");
                    this.oPresentationWriter.WriteULong(elements.length);
                    for (var i = 0; i < elements.length; ++i) {
                        if (! (elements[i].Drawing instanceof CGraphicFrame)) {
                            this.oPresentationWriter.WriteBool(true);
                            this.CopyGraphicObject(this.ElemToSelect, elements[i].Drawing, elements[i]);
                            this.oPresentationWriter.WriteDouble(elements[i].X);
                            this.oPresentationWriter.WriteDouble(elements[i].Y);
                            this.oPresentationWriter.WriteDouble(elements[i].ExtX);
                            this.oPresentationWriter.WriteDouble(elements[i].ExtY);
                            this.oPresentationWriter.WriteString2(elements[i].ImageUrl);
                        } else {
                            this.CopyPresentationTableFull(this.ElemToSelect, elements[i].Drawing);
                            this.oPresentationWriter.WriteDouble(elements[i].X);
                            this.oPresentationWriter.WriteDouble(elements[i].Y);
                            this.oPresentationWriter.WriteDouble(elements[i].ExtX);
                            this.oPresentationWriter.WriteDouble(elements[i].ExtY);
                            this.oPresentationWriter.WriteString2(elements[i].ImageUrl);
                        }
                    }
                } else {
                    if (elementsContent.SlideObjects && elementsContent.SlideObjects.length) {
                        var selected_slides = elementsContent.SlideObjects;
                        this.Para = document.createElement("p");
                        this.oPresentationWriter.WriteString2("SlideObjects");
                        this.oPresentationWriter.WriteULong(selected_slides.length);
                        var layouts_map = {};
                        var layout_count = 0;
                        editor.WordControl.m_oLogicDocument.CalculateComments();
                        var slide;
                        for (var i = 0; i < selected_slides.length; ++i) {
                            slide = selected_slides[i].Slide;
                            this.CopySlide(this.ElemToSelect, slide);
                            if (!layouts_map[slide.Layout.Get_Id()]) {
                                ++layout_count;
                            }
                            layouts_map[slide.Layout.Get_Id()] = slide.Layout;
                        }
                        this.oPresentationWriter.WriteULong(layout_count);
                        var arr_layouts_id = [];
                        var t = 0;
                        for (var key in layouts_map) {
                            this.CopyLayout(layouts_map[key]);
                            arr_layouts_id[t] = layouts_map[key];
                            ++t;
                        }
                        var arr_ind = [];
                        for (var i = 0; i < selected_slides.length; ++i) {
                            for (t = 0; t < arr_layouts_id.length; ++t) {
                                if (selected_slides[i].Slide.Layout === arr_layouts_id[t]) {
                                    arr_ind[i] = t;
                                    break;
                                }
                            }
                        }
                        for (var i = 0; i < arr_ind.length; ++i) {
                            this.oPresentationWriter.WriteULong(arr_ind[i]);
                        }
                        for (var i = 0; i < this.Para.childNodes.length; i++) {
                            this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                        }
                    } else {
                        if (elementsContent && elementsContent.Content && elementsContent.Content.length) {
                            for (var Index = 0; Index < elementsContent.Content.length; Index++) {
                                var Item = elementsContent.Content[Index];
                                if (type_Table === Item.GetType()) {
                                    this.CopyTable(oDomTarget, Item, null);
                                } else {
                                    if (type_Paragraph === Item.GetType()) {
                                        this.CopyParagraph(oDomTarget, Item, true, false);
                                    }
                                }
                            }
                        } else {
                            if (elementsContent && elementsContent.length) {
                                for (var Index = 0; Index < elementsContent.length; Index++) {
                                    var Item = elementsContent[Index];
                                    if (type_Table === Item.GetType()) {
                                        this.CopyTable(oDomTarget, Item, null);
                                    } else {
                                        if (type_Paragraph === Item.GetType()) {
                                            this.CopyParagraph(oDomTarget, Item, true, false);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!this.onlyBinaryCopy) {
            this.CommitList(oDomTarget);
        }
    },
    getSelectedBinary: function () {
        var oDocument = this.oDocument;
        if (g_bIsDocumentCopyPaste) {
            var selectedContent = oDocument.Get_SelectedContent();
            var elementsContent;
            if (selectedContent && selectedContent.Elements && selectedContent.Elements[0] && selectedContent.Elements[0].Element) {
                elementsContent = selectedContent.Elements;
            } else {
                return false;
            }
            var drawingUrls = [];
            if (selectedContent.DrawingObjects && selectedContent.DrawingObjects.length) {
                var url, correctUrl, graphicObj;
                for (var i = 0; i < selectedContent.DrawingObjects.length; i++) {
                    graphicObj = selectedContent.DrawingObjects[i].GraphicObj;
                    if (graphicObj.isImage()) {
                        url = graphicObj.getImageUrl();
                        if (window["NativeCorrectImageUrlOnCopy"]) {
                            correctUrl = window["NativeCorrectImageUrlOnCopy"](url);
                            drawingUrls[i] = correctUrl;
                        }
                    }
                }
            }
            this.oBinaryFileWriter.Document = elementsContent[0].Element.LogicDocument;
            this.oBinaryFileWriter.CopyStart();
            this.CopyDocument2(null, oDocument, false, elementsContent);
            this.oBinaryFileWriter.CopyEnd();
            var sBase64 = this.oBinaryFileWriter.GetResult();
            var text = "";
            if (oDocument.Get_SelectedText) {
                text = oDocument.Get_SelectedText();
            }
            return {
                sBase64: sBase64,
                text: text,
                drawingUrls: drawingUrls
            };
        }
    },
    Start: function (node) {
        var oDocument = this.oDocument;
        var bFromPresentation;
        if (g_bIsDocumentCopyPaste) {
            var selectedContent = oDocument.Get_SelectedContent();
            var elementsContent;
            if (selectedContent && selectedContent.Elements && selectedContent.Elements[0] && selectedContent.Elements[0].Element) {
                elementsContent = selectedContent.Elements;
            } else {
                return;
            }
            if (selectedContent.Elements[0].Element && selectedContent.Elements[0].Element.bFromDocument === false) {
                bFromPresentation = true;
            }
            this.oBinaryFileWriter.Document = elementsContent[0].Element.LogicDocument;
            if (!bFromPresentation) {
                this.oBinaryFileWriter.CopyStart();
            }
            this.CopyDocument2(this.ElemToSelect, oDocument, false, elementsContent, bFromPresentation);
            if (!bFromPresentation) {
                this.oBinaryFileWriter.CopyEnd();
            }
        } else {
            var presentation = editor.WordControl.m_oLogicDocument;
            var selectedContent = oDocument.Get_SelectedContent();
            if (!selectedContent.DocContent && (!selectedContent.Drawings || (selectedContent.Drawings && !selectedContent.Drawings.length)) && (!selectedContent.SlideObjects || (selectedContent.SlideObjects && !selectedContent.SlideObjects.length))) {
                return false;
            }
            this.CopyDocument2(this.ElemToSelect, oDocument, false, selectedContent);
            var sBase64 = this.oPresentationWriter.GetBase64Memory();
            sBase64 = "" + this.oPresentationWriter.pos + ";" + sBase64;
            if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
            }
            if (this.ElemToSelect.children[0]) {
                $(this.ElemToSelect.children[0]).addClass("pptData;" + sBase64);
            }
        }
        if (g_bIsDocumentCopyPaste && copyPasteUseBinary && this.oBinaryFileWriter.copyParams.itemCount > 0 && !bFromPresentation) {
            var sBase64 = this.oBinaryFileWriter.GetResult();
            if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
            }
            if (this.ElemToSelect.children[0]) {
                $(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
            }
        }
        return sBase64;
    },
    CopySlide: function (oDomTarget, slide) {
        var sSrc = slide.getBase64Img();
        var _bounds_cheker = new CSlideBoundsChecker();
        slide.draw(_bounds_cheker, 0);
        this.Para.innerHTML += '<img width="' + Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix) + '" height="' + Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
        this.oPresentationWriter.WriteString2(slide.Layout.Get_Id());
        var table_styles_ids = [];
        var sp_tree = slide.cSld.spTree;
        for (var i = 0; i < sp_tree.length; i++) {
            if (sp_tree[i] instanceof CGraphicFrame && sp_tree[i].graphicObject) {
                table_styles_ids[table_styles_ids.length] = sp_tree[i].graphicObject.Get_TableStyle();
            }
        }
        this.oPresentationWriter.WriteULong(table_styles_ids.length);
        for (var i = 0; i < table_styles_ids.length; ++i) {
            this.oPresentationWriter.WriteBool(table_styles_ids[i] !== null);
            if (table_styles_ids[i] !== null) {
                this.oPresentationWriter.WriteULong(table_styles_ids[i]);
            }
        }
        this.oPresentationWriter.WriteSlide(slide);
        this.oPresentationWriter.WriteULong(sp_tree.length);
        for (var i = 0; i < sp_tree.length; ++i) {
            var sp = sp_tree[i];
            this.oPresentationWriter.WriteDouble(sp.x);
            this.oPresentationWriter.WriteDouble(sp.y);
            this.oPresentationWriter.WriteDouble(sp.extX);
            this.oPresentationWriter.WriteDouble(sp.extY);
        }
    },
    CopyLayout: function (layout) {
        this.oPresentationWriter.WriteSlideLayout(layout);
    },
    CopyPresentationTableCells: function (oDomTarget, graphicFrame) {
        var aSelectedRows = [];
        var oRowElems = {};
        var Item = graphicFrame.graphicObject;
        if (Item.Selection.Data.length > 0) {
            for (var i = 0, length = Item.Selection.Data.length; i < length; ++i) {
                var elem = Item.Selection.Data[i];
                var rowElem = oRowElems[elem.Row];
                if (null == rowElem) {
                    rowElem = {
                        row: elem.Row,
                        gridStart: null,
                        gridEnd: null,
                        indexStart: null,
                        indexEnd: null,
                        after: null,
                        before: null,
                        cells: {}
                    };
                    oRowElems[elem.Row] = rowElem;
                    aSelectedRows.push(rowElem);
                }
                if (null == rowElem.indexEnd || elem.Cell > rowElem.indexEnd) {
                    rowElem.indexEnd = elem.Cell;
                }
                if (null == rowElem.indexStart || elem.Cell < rowElem.indexStart) {
                    rowElem.indexStart = elem.Cell;
                }
                rowElem.cells[elem.Cell] = 1;
            }
        }
        aSelectedRows.sort(function (a, b) {
            return a.row - b.row;
        });
        var nMinGrid = null;
        var nMaxGrid = null;
        var nPrevStartGrid = null;
        var nPrevEndGrid = null;
        var nPrevRowIndex = null;
        for (var i = 0, length = aSelectedRows.length; i < length; ++i) {
            var elem = aSelectedRows[i];
            var nRowIndex = elem.row;
            if (null != nPrevRowIndex) {
                if (nPrevRowIndex + 1 != nRowIndex) {
                    nMinGrid = null;
                    nMaxGrid = null;
                    break;
                }
            }
            nPrevRowIndex = nRowIndex;
            var row = Item.Content[nRowIndex];
            var cellFirst = row.Get_Cell(elem.indexStart);
            var cellLast = row.Get_Cell(elem.indexEnd);
            var nCurStartGrid = cellFirst.Metrics.StartGridCol;
            var nCurEndGrid = cellLast.Metrics.StartGridCol + cellLast.Get_GridSpan() - 1;
            if (null != nPrevStartGrid && null != nPrevEndGrid) {
                if (nCurStartGrid > nPrevStartGrid) {
                    for (var j = elem.indexStart - 1; j >= 0; --j) {
                        var cellCur = row.Get_Cell(j);
                        if (vmerge_Continue == cellCur.Get_VMerge()) {
                            var nCurGridCol = cellCur.Metrics.StartGridCol;
                            if (nCurGridCol >= nPrevStartGrid) {
                                nCurStartGrid = nCurGridCol;
                                elem.indexStart = j;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                if (nCurEndGrid < nPrevEndGrid) {
                    for (var j = elem.indexEnd + 1; j < row.Get_CellsCount(); ++j) {
                        var cellCur = row.Get_Cell(j);
                        if (vmerge_Continue == cellCur.Get_VMerge()) {
                            var nCurGridCol = cellCur.Metrics.StartGridCol + cellCur.Get_GridSpan() - 1;
                            if (nCurGridCol <= nPrevEndGrid) {
                                nCurEndGrid = nCurGridCol;
                                elem.indexEnd = j;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
            elem.gridStart = nPrevStartGrid = nCurStartGrid;
            elem.gridEnd = nPrevEndGrid = nCurEndGrid;
            if (null == nMinGrid || nMinGrid > nCurStartGrid) {
                nMinGrid = nCurStartGrid;
            }
            if (null == nMaxGrid || nMaxGrid < nCurEndGrid) {
                nMaxGrid = nCurEndGrid;
            }
        }
        if (null != nMinGrid && null != nMaxGrid) {
            for (var i = 0, length = aSelectedRows.length; i < length; ++i) {
                var elem = aSelectedRows[i];
                elem.before = elem.gridStart - nMinGrid;
                elem.after = nMaxGrid - elem.gridEnd;
            }
            this.CopyTable(oDomTarget, Item, aSelectedRows);
        }
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        var graphic_frame = new CGraphicFrame(graphicFrame.parent);
        var grid = [];
        for (var i = nMinGrid; i <= nMaxGrid; ++i) {
            grid.push(graphicFrame.graphicObject.TableGrid[i]);
        }
        var table = new CTable(editor.WordControl.m_oDrawingDocument, graphicFrame, false, 0, 0, 0, 0, 0, aSelectedRows.length, nMaxGrid - nMinGrid + 1, grid);
        table.setStyleIndex(graphicFrame.graphicObject.styleIndex);
        graphic_frame.setGraphicObject(table);
        graphic_frame.setXfrm(0, 0, 20, 30, 0, false, false);
        var b_style_index = false;
        if (isRealNumber(graphic_frame.graphicObject.styleIndex) && graphic_frame.graphicObject.styleIndex > -1) {
            b_style_index = true;
        }
        this.oPresentationWriter.WriteULong(1);
        this.oPresentationWriter.WriteBool(false);
        this.oPresentationWriter.WriteBool(b_style_index);
        if (b_style_index) {
            this.oPresentationWriter.WriteULong(graphic_frame.graphicObject.styleIndex);
        }
        var old_style_index = graphic_frame.graphicObject.styleIndex;
        graphic_frame.graphicObject.styleIndex = -1;
        this.oPresentationWriter.WriteTable(graphic_frame);
        graphic_frame.graphicObject.styleIndex = old_style_index;
        if (is_on) {
            History.TurnOn();
        }
        this.oBinaryFileWriter.copyParams.itemCount = 0;
    },
    CopyPresentationTableFull: function (oDomTarget, graphicFrame) {
        var aSelectedRows = [];
        var oRowElems = {};
        var Item = graphicFrame.graphicObject;
        var b_style_index = false;
        if (Item.TableStyle) {
            b_style_index = true;
        }
        var presentation = editor.WordControl.m_oLogicDocument;
        for (var key in presentation.TableStylesIdMap) {
            if (presentation.TableStylesIdMap.hasOwnProperty(key)) {
                this.oPresentationWriter.tableStylesGuides[key] = "{" + GUID() + "}";
            }
        }
        this.oPresentationWriter.WriteBool(!b_style_index);
        if (b_style_index) {
            var tableStyle = presentation.globalTableStyles.Style[Item.TableStyle];
            this.oPresentationWriter.WriteBool(true);
            this.oPresentationWriter.WriteTableStyle(Item.TableStyle, tableStyle);
            this.oPresentationWriter.WriteBool(true);
            this.oPresentationWriter.WriteString2(Item.TableStyle);
        }
        this.oPresentationWriter.WriteTable(graphicFrame);
        this.CopyTable(oDomTarget, Item, null);
    },
    CopyPresentationText: function (oDomTarget, oDocument, bUseSelection) {
        var Start = 0;
        var End = 0;
        if (bUseSelection) {
            if (true === oDocument.Selection.Use) {
                if (selectionflag_DrawingObject === oDocument.Selection.Flag) {
                    this.Para = document.createElement("p");
                    this.Para.innerHTML = this.ParseItem(oDocument.Selection.Data.DrawingObject);
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                    }
                } else {
                    Start = oDocument.Selection.StartPos;
                    End = oDocument.Selection.EndPos;
                    if (Start > End) {
                        var Temp = End;
                        End = Start;
                        Start = Temp;
                    }
                }
            }
        } else {
            Start = 0;
            End = oDocument.Content.length - 1;
        }
        this.oPresentationWriter.WriteULong(End - Start + 1);
        for (var Index = Start; Index <= End; Index++) {
            var Item = oDocument.Content[Index];
            var selectStart = Item.Selection.Use ? Item.Selection.StartPos : 0;
            var selectEnd = Item.Selection.Use ? Item.Selection.EndPos : Item.Content.length;
            if (selectStart > selectEnd) {
                var Temp = selectEnd;
                selectEnd = selectStart;
                selectStart = Temp;
            }
            for (var i = 0; i < selectStart; ++i) {
                var content = Item.Content;
                if (content instanceof ParaText) {
                    break;
                }
            }
            if (i == selectStart) {
                selectStart = 0;
            }
            this.oPresentationWriter.StartRecord(0);
            this.oPresentationWriter.WriteParagraph(Item, selectStart, selectEnd);
            this.oPresentationWriter.EndRecord();
            this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
        }
        this.CommitList(oDomTarget);
    },
    CopyGraphicObject: function (oDomTarget, oGraphicObj, drawingCopyObject) {
        var sSrc = oGraphicObj.getBase64Img();
        if (sSrc.length > 0) {
            sSrc = this.getSrc(sSrc);
            var _bounds_cheker = new CSlideBoundsChecker();
            oGraphicObj.draw(_bounds_cheker, 0);
            var width, height;
            if (drawingCopyObject && drawingCopyObject.ExtX) {
                width = Math.round(drawingCopyObject.ExtX * g_dKoef_mm_to_pix);
            } else {
                width = Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix);
            }
            if (drawingCopyObject && drawingCopyObject.ExtY) {
                height = Math.round(drawingCopyObject.ExtY * g_dKoef_mm_to_pix);
            } else {
                height = Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix);
            }
            if (this.api.DocumentReaderMode) {
                oDomTarget.innerHTML += '<img style="max-width:100%;" width="' + width + '" height="' + height + '" src="' + sSrc + '" />';
            } else {
                oDomTarget.innerHTML += '<img width="' + width + '" height="' + height + '" src="' + sSrc + '" />';
            }
            if (oGraphicObj instanceof CShape) {
                this.oPresentationWriter.WriteShape(oGraphicObj);
            } else {
                if (oGraphicObj instanceof CImageShape) {
                    this.oPresentationWriter.WriteImage(oGraphicObj);
                } else {
                    if (oGraphicObj instanceof CGroupShape) {
                        this.oPresentationWriter.WriteGroupShape(oGraphicObj);
                    } else {
                        if (oGraphicObj instanceof CChartSpace) {
                            this.oPresentationWriter.WriteChart(oGraphicObj);
                        } else {
                            if (oGraphicObj instanceof CGraphicFrame) {
                                this.oPresentationWriter.WriteTable(oGraphicObj);
                            }
                        }
                    }
                }
            }
        }
    }
};
function Editor_Paste_GetElem(api, bClean) {
    var oWordControl = api.WordControl;
    var pastebin = document.getElementById(PASTE_ELEMENT_ID);
    if (!pastebin) {
        pastebin = document.createElement("div");
        pastebin.setAttribute("id", PASTE_ELEMENT_ID);
        pastebin.className = "sdk-element";
        if (AscBrowser.isIE) {
            pastebin.style.position = "fixed";
        } else {
            pastebin.style.position = "absolute";
        }
        pastebin.style.top = "-100px";
        pastebin.style.left = "0px";
        pastebin.style.width = "10000px";
        pastebin.style.height = "100px";
        pastebin.style.overflow = "hidden";
        pastebin.style.zIndex = -1000;
        var Def_rPr;
        if (g_bIsDocumentCopyPaste) {
            Def_rPr = oWordControl.m_oLogicDocument.Styles.Default.TextPr;
        } else {
            Def_rPr = oWordControl.m_oLogicDocument.globalTableStyles.Default.TextPr;
        }
        pastebin.style.fontFamily = Def_rPr.FontFamily.Name;
        if (!api.DocumentReaderMode) {
            pastebin.style.fontSize = Def_rPr.FontSize + "pt";
        } else {
            api.DocumentReaderMode.CorrectDefaultFontSize(Def_rPr.FontSize);
            pastebin.style.fontSize = "1em";
        }
        pastebin.style.MozUserSelect = "text";
        pastebin.style["-khtml-user-select"] = "text";
        pastebin.style["-o-user-select"] = "text";
        pastebin.style["user-select"] = "text";
        pastebin.style["-webkit-user-select"] = "text";
        pastebin.setAttribute("contentEditable", true);
        document.body.appendChild(pastebin);
    } else {
        if (bClean) {
            var aChildNodes = pastebin.childNodes;
            for (var length = aChildNodes.length, i = length - 1; i >= 0; i--) {
                pastebin.removeChild(aChildNodes[i]);
            }
        }
    }
    if (!window.USER_AGENT_SAFARI_MACOS) {
        pastebin.onpaste = function (e) {
            if (!window.GlobalPasteFlag) {
                return;
            }
            Body_Paste(api, e);
            pastebin.onpaste = null;
        };
    }
    return pastebin;
}
function Editor_Paste_Button(api) {
    if (AscBrowser.isIE) {
        document.body.style.MozUserSelect = "text";
        delete document.body.style["-khtml-user-select"];
        delete document.body.style["-o-user-select"];
        delete document.body.style["user-select"];
        document.body.style["-webkit-user-select"] = "text";
        var pastebin = Editor_Paste_GetElem(api, true);
        pastebin.style.display = "block";
        pastebin.focus();
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        rangeToSelect.selectNodeContents(pastebin);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
        document.execCommand("paste");
        if (!window.USER_AGENT_SAFARI_MACOS) {
            pastebin.blur();
        }
        pastebin.style.display = ELEMENT_DISPAY_STYLE;
        document.body.style.MozUserSelect = "none";
        document.body.style["-khtml-user-select"] = "none";
        document.body.style["-o-user-select"] = "none";
        document.body.style["user-select"] = "none";
        document.body.style["-webkit-user-select"] = "none";
        History.Create_NewPoint(historydescription_PasteButtonIE);
        editor.waitSave = true;
        Editor_Paste(api, false);
        return true;
    } else {
        var ElemToSelect = document.getElementById(COPY_ELEMENT_ID);
        if (ElemToSelect) {
            History.Create_NewPoint(historydescription_PasteButtonNotIE);
            editor.waitSave = true;
            Editor_Paste_Exec(api, ElemToSelect);
        } else {
            window.GlobalPasteFlagCounter = 0;
            window.GlobalPasteFlag = false;
        }
        return true;
    }
    return false;
}
function CanPaste(oDocument) {
    var oTargetDoc = oDocument;
    if (g_bIsDocumentCopyPaste) {
        if (docpostype_HdrFtr === oTargetDoc.CurPos.Type) {
            if (null != oTargetDoc.HdrFtr.CurHdrFtr) {
                oTargetDoc = oTargetDoc.HdrFtr.CurHdrFtr.Content;
            } else {
                return false;
            }
        }
        if (docpostype_FlowObjects == oTargetDoc.CurPos.Type) {
            var nType = oTargetDoc.Selection.Data.FlowObject.Get_Type();
            if (flowobject_Table == nType) {
                var oTable = oTargetDoc.Selection.Data.FlowObject.Table;
                if (true == oTable.Selection.Use && table_Selection_Cell == oTable.Selection.Type) {
                    return false;
                }
                if (null != oTable.CurCell && null != oTable.CurCell.Content) {
                    oTargetDoc = oTable.CurCell.Content;
                }
            }
        }
    } else {
        if (oTargetDoc && oTargetDoc.CurPos != undefined && docpostype_FlowObjects == oTargetDoc.CurPos.Type) {
            var _cur_slide_elements = oTargetDoc.Slides[oTargetDoc.CurPage].elementsManipulator;
            if (_cur_slide_elements.obj != undefined && _cur_slide_elements.obj.txBody && _cur_slide_elements.obj.txBody.content) {
                return true;
            }
        }
    }
    return true;
}
function Editor_Paste(api, bClean) {
    window.GlobalPasteFlagCounter = 1;
    var oWordControl = api.WordControl;
    oWordControl.bIsEventPaste = false;
    var oDocument = oWordControl.m_oLogicDocument;
    if (false == CanPaste(oDocument)) {
        return;
    }
    document.body.style.MozUserSelect = "text";
    delete document.body.style["-khtml-user-select"];
    delete document.body.style["-o-user-select"];
    delete document.body.style["user-select"];
    document.body.style["-webkit-user-select"] = "text";
    var overflowBody = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    var Text;
    var pastebin = Editor_Paste_GetElem(api, bClean);
    pastebin.style.display = "block";
    pastebin.focus();
    pastebin.appendChild(document.createTextNode("\xa0"));
    if (window.getSelection) {
        var selection = document.defaultView.getSelection();
        selection.removeAllRanges();
        var rangeToSelect = document.createRange();
        rangeToSelect.selectNodeContents(pastebin);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    } else {
        if (document.body.createTextRange) {
            var rangeToSelect = document.body.createTextRange();
            rangeToSelect.moveToElementText(pastebin);
            rangeToSelect.select();
        }
    }
    var func_timeout = function () {
        if (PASTE_EMPTY_USE && !oWordControl.bIsEventPaste) {
            if (pastebin.innerHTML == "&nbsp;") {
                PASTE_EMPTY_COUNTER++;
                if (PASTE_EMPTY_COUNTER < PASTE_EMPTY_COUNTER_MAX) {
                    window.PasteEndTimerId = window.setTimeout(func_timeout, 100);
                    return;
                }
            }
        }
        if (window.USER_AGENT_SAFARI_MACOS) {
            if (window.GlobalPasteFlagCounter != 2 && !window.GlobalPasteFlag) {
                window.PasteEndTimerId = window.setTimeout(func_timeout, 10);
                return;
            }
        }
        document.body.style.MozUserSelect = "none";
        document.body.style["-khtml-user-select"] = "none";
        document.body.style["-o-user-select"] = "none";
        document.body.style["user-select"] = "none";
        document.body.style["-webkit-user-select"] = "none";
        document.body.style.overflow = overflowBody;
        if (!window.USER_AGENT_SAFARI_MACOS) {
            pastebin.onpaste = null;
        }
        if (!oWordControl.bIsEventPaste) {
            Editor_Paste_Exec(api, pastebin);
        } else {
            pastebin.style.display = ELEMENT_DISPAY_STYLE;
        }
        window.PasteEndTimerId = -1;
    };
    var _interval_time = window.USER_AGENT_MACOS ? 200 : 0;
    if (-1 != window.PasteEndTimerId) {
        clearTimeout(window.PasteEndTimerId);
    }
    PASTE_EMPTY_COUNTER = 0;
    window.PasteEndTimerId = window.setTimeout(func_timeout, _interval_time);
}
function CopyPasteCorrectString(str) {
    var res = str;
    res = res.replace(/&/g, "&amp;");
    res = res.replace(/</g, "&lt;");
    res = res.replace(/>/g, "&gt;");
    res = res.replace(/'/g, "&apos;");
    res = res.replace(/"/g, "&quot;");
    return res;
}
function Body_Paste(api, e) {
    var oWordControl = api.WordControl;
    if (e && e.clipboardData && e.clipboardData.getData) {
        var bExist = false;
        var is_chrome = AscBrowser.isChrome;
        var sHtml = null;
        var fPasteHtml = function (sHtml, sBase64) {
            if (null != sHtml) {
                var ifr = document.getElementById("pasteFrame");
                if (!ifr) {
                    ifr = document.createElement("iframe");
                    ifr.name = "pasteFrame";
                    ifr.id = "pasteFrame";
                    ifr.style.position = "absolute";
                    ifr.style.top = "-100px";
                    ifr.style.left = "0px";
                    ifr.style.width = "10000px";
                    ifr.style.height = "100px";
                    ifr.style.overflow = "hidden";
                    ifr.style.zIndex = -1000;
                    document.body.appendChild(ifr);
                } else {
                    ifr.style.width = "10000px";
                }
                var frameWindow = window.frames["pasteFrame"];
                if (frameWindow) {
                    frameWindow.document.open();
                    frameWindow.document.write(sHtml);
                    frameWindow.document.close();
                    if (null != frameWindow.document && null != frameWindow.document.body) {
                        ifr.style.display = "block";
                        Editor_Paste_Exec(api, frameWindow.document.body, ifr);
                        bExist = true;
                    }
                }
                ifr.style.width = "100px";
            } else {
                if (sBase64) {
                    Editor_Paste_Exec(api, null, null, sBase64);
                }
            }
            if (bExist) {
                oWordControl.bIsEventPaste = true;
                if (e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return false;
            }
        };
        var fTest = function (types, sPattern) {
            if (!types) {
                return false;
            }
            for (var i = 0, length = types.length; i < length; ++i) {
                if (sPattern == types[i]) {
                    return true;
                }
            }
            return false;
        };
        var sBase64 = e.clipboardData.getData("text/x-custom");
        var html = e.clipboardData.getData("text/html");
        if (sBase64 && sBase64 != "" && sBase64.indexOf("docData;") > -1) {
            fPasteHtml(null, sBase64);
            return;
        } else {
            if (html) {
                var sHtml = e.clipboardData.getData("text/html");
                var nIndex = sHtml.lastIndexOf("</html>");
                if (-1 != nIndex) {
                    sHtml = sHtml.substring(0, nIndex + "</html>".length);
                }
            } else {
                if (is_chrome && fTest(e.clipboardData.types, "text/plain")) {
                    bExist = true;
                    var sText = e.clipboardData.getData("text/plain");
                    sHtml = "<html><body>";
                    var sCurPar = "";
                    var nParCount = 0;
                    for (var i = 0, length = sText.length; i < length; i++) {
                        var Char = sText.charAt(i);
                        var Code = sText.charCodeAt(i);
                        var Item = null;
                        if ("\n" === Char) {
                            if ("" == sCurPar) {
                                sHtml += "<p><span>&nbsp;</span></p>";
                            } else {
                                sHtml += "<p><span>" + sCurPar + "</span></p>";
                                sCurPar = "";
                            }
                            nParCount++;
                        } else {
                            if (13 === Code) {
                                continue;
                            } else {
                                if (32 == Code || 160 == Code) {
                                    sCurPar += " ";
                                } else {
                                    if (9 === Code) {
                                        sCurPar += "<span style='mso-tab-count:1'>    </span>";
                                    } else {
                                        sCurPar += CopyPasteCorrectString(Char);
                                    }
                                }
                            }
                        }
                    }
                    if ("" != sCurPar) {
                        if (0 == nParCount) {
                            sHtml += "<span>" + sCurPar + "</span>";
                        } else {
                            sHtml += "<p><span>" + sCurPar + "</span></p>";
                        }
                        sCurPar = "";
                    }
                    sHtml += "</body></html>";
                }
            }
        }
        if (sHtml) {
            fPasteHtml(sHtml);
        } else {
            var items = e.clipboardData.items;
            if (null != items) {
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].kind == "file" && items[i].type.indexOf("image/") !== -1) {
                        var blob = items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            fPasteHtml('<html><body><img src="' + evt.target.result + '"/></body></html>');
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
        }
    }
}
function Editor_Paste_Exec(api, pastebin, nodeDisplay, onlyBinary) {
    var oPasteProcessor = new PasteProcessor(api, true, true, false);
    oPasteProcessor.Start(pastebin, nodeDisplay, null, onlyBinary);
}
function trimString(str) {
    return str.replace(/^\s+|\s+$/g, "");
}
function PasteProcessor(api, bUploadImage, bUploadFonts, bNested, pasteInExcel) {
    this.oRootNode = null;
    this.api = api;
    this.bIsDoublePx = api.WordControl.bIsDoublePx;
    this.oDocument = api.WordControl.m_oLogicDocument;
    this.oLogicDocument = this.oDocument;
    this.oRecalcDocument = this.oDocument;
    this.map_font_index = api.FontLoader.map_font_index;
    this.bUploadImage = bUploadImage;
    this.bUploadFonts = bUploadFonts;
    this.bNested = bNested;
    this.oFonts = {};
    this.oImages = {};
    this.aContent = [];
    this.pasteInExcel = pasteInExcel;
    this.pasteInPresentationShape = null;
    this.maxTableCell = null;
    this.bIgnoreNoBlockText = false;
    this.oCurRun = null;
    this.oCurRunContentPos = 0;
    this.oCurPar = null;
    this.oCurParContentPos = 0;
    this.oCurHyperlink = null;
    this.oCurHyperlinkContentPos = 0;
    this.oCur_rPr = new CTextPr();
    this.nBrCount = 0;
    this.bInBlock = null;
    this.dMaxWidth = Page_Width - X_Left_Margin - X_Right_Margin;
    this.dScaleKoef = 1;
    this.bUseScaleKoef = false;
    this.bIsPlainText = false;
    this.MsoStyles = {
        "mso-style-type": 1,
        "mso-pagination": 1,
        "mso-line-height-rule": 1,
        "mso-style-textfill-fill-color": 1,
        "mso-tab-count": 1,
        "tab-stops": 1,
        "list-style-type": 1,
        "mso-special-character": 1,
        "mso-column-break-before": 1,
        "mso-break-type": 1,
        "mso-padding-alt": 1,
        "mso-border-insidev": 1,
        "mso-border-insideh": 1,
        "mso-row-margin-left": 1,
        "mso-row-margin-right": 1,
        "mso-cellspacing": 1,
        "mso-border-alt": 1,
        "mso-border-left-alt": 1,
        "mso-border-top-alt": 1,
        "mso-border-right-alt": 1,
        "mso-border-bottom-alt": 1,
        "mso-border-between": 1
    };
    this.oBorderCache = {};
}
PasteProcessor.prototype = {
    _GetTargetDocument: function (oDocument) {
        if (g_bIsDocumentCopyPaste) {
            if (docpostype_HdrFtr === oDocument.CurPos.Type) {
                if (null != oDocument.HdrFtr && null != oDocument.HdrFtr.CurHdrFtr && null != oDocument.HdrFtr.CurHdrFtr.Content) {
                    oDocument = oDocument.HdrFtr.CurHdrFtr.Content;
                    this.oRecalcDocument = oDocument;
                }
            }
            if (docpostype_FlowObjects == oDocument.CurPos.Type) {
                var oData = oDocument.Selection.Data.FlowObject;
                switch (oData.Get_Type()) {
                case flowobject_Table:
                    if (null != oData.Table && null != oData.Table.CurCell && null != oData.Table.CurCell.Content) {
                        oDocument = this._GetTargetDocument(oData.Table.CurCell.Content);
                        this.oRecalcDocument = oDocument;
                        this.dMaxWidth = this._CalcMaxWidthByCell(oData.Table.CurCell);
                    }
                    break;
                }
            }
            if (oDocument.CurPos.Type === docpostype_DrawingObjects) {
                var content = oDocument.DrawingObjects.getTargetDocContent(true);
                if (content) {
                    oDocument = content;
                }
            }
            var Item = oDocument.Content[oDocument.CurPos.ContentPos];
            if (type_Table == Item.GetType() && null != Item.CurCell) {
                this.dMaxWidth = this._CalcMaxWidthByCell(Item.CurCell);
                oDocument = this._GetTargetDocument(Item.CurCell.Content);
            }
        } else {}
        return oDocument;
    },
    _CalcMaxWidthByCell: function (cell) {
        var row = cell.Row;
        var table = row.Table;
        var grid = table.TableGrid;
        var nGridBefore = 0;
        if (null != row.Pr && null != row.Pr.GridBefore) {
            nGridBefore = row.Pr.GridBefore;
        }
        var nCellIndex = cell.Index;
        var nCellGrid = 1;
        if (null != cell.Pr && null != cell.Pr.GridSpan) {
            nCellGrid = cell.Pr.GridSpan;
        }
        var nMarginLeft = 0;
        if (null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Left && tblwidth_Mm == cell.Pr.TableCellMar.Left.Type && null != cell.Pr.TableCellMar.Left.W) {
            nMarginLeft = cell.Pr.TableCellMar.Left.W;
        } else {
            if (null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Left && tblwidth_Mm == table.Pr.TableCellMar.Left.Type && null != table.Pr.TableCellMar.Left.W) {
                nMarginLeft = table.Pr.TableCellMar.Left.W;
            }
        }
        var nMarginRight = 0;
        if (null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Right && tblwidth_Mm == cell.Pr.TableCellMar.Right.Type && null != cell.Pr.TableCellMar.Right.W) {
            nMarginRight = cell.Pr.TableCellMar.Right.W;
        } else {
            if (null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Right && tblwidth_Mm == table.Pr.TableCellMar.Right.Type && null != table.Pr.TableCellMar.Right.W) {
                nMarginRight = table.Pr.TableCellMar.Right.W;
            }
        }
        var nPrevSumGrid = nGridBefore;
        for (var i = 0; i < nCellIndex; ++i) {
            var oTmpCell = row.Content[i];
            var nGridSpan = 1;
            if (null != cell.Pr && null != cell.Pr.GridSpan) {
                nGridSpan = cell.Pr.GridSpan;
            }
            nPrevSumGrid += nGridSpan;
        }
        var dCellWidth = 0;
        for (var i = nPrevSumGrid, length = grid.length; i < nPrevSumGrid + nCellGrid && i < length; ++i) {
            dCellWidth += grid[i];
        }
        if (dCellWidth - nMarginLeft - nMarginRight <= 0) {
            dCellWidth = 4;
        } else {
            dCellWidth -= nMarginLeft + nMarginRight;
        }
        return dCellWidth;
    },
    InsertInDocument: function () {
        var oDocument = this.oDocument;
        var nInsertLength = this.aContent.length;
        if (nInsertLength > 0) {
            this.InsertInPlace(oDocument, this.aContent);
            if (false == g_bIsDocumentCopyPaste) {
                oDocument.Recalculate();
                if (oDocument.Parent != null && oDocument.Parent.txBody != null) {
                    oDocument.Parent.txBody.recalculate();
                }
            }
        }
        if (false == this.bNested && nInsertLength > 0) {
            this.oRecalcDocument.Recalculate();
            if (oDocument.CurPos.Type !== docpostype_DrawingObjects || true === this.oLogicDocument.DrawingObjects.isSelectedText()) {
                this.oLogicDocument.Cursor_MoveRight(false, false, true);
            }
            this.oLogicDocument.Document_UpdateInterfaceState();
            this.oLogicDocument.Document_UpdateSelectionState();
        }
        window.GlobalPasteFlagCounter = 0;
    },
    InsertInPlace: function (oDoc, aNewContent) {
        if (!g_bIsDocumentCopyPaste) {
            return;
        }
        var paragraph = oDoc.Content[oDoc.CurPos.ContentPos];
        if (null != paragraph && type_Paragraph == paragraph.GetType()) {
            var NearPos = {
                Paragraph: paragraph,
                ContentPos: paragraph.Get_ParaContentPos(false, false)
            };
            paragraph.Check_NearestPos(NearPos);
            var oSelectedContent = new CSelectedContent();
            for (var i = 0, length = aNewContent.length; i < length; ++i) {
                var oSelectedElement = new CSelectedElement();
                oSelectedElement.Element = aNewContent[i];
                if (i == length - 1 && true != this.bInBlock && type_Paragraph == oSelectedElement.Element.GetType()) {
                    oSelectedElement.SelectedAll = false;
                } else {
                    oSelectedElement.SelectedAll = true;
                }
                oSelectedContent.Add(oSelectedElement);
            }
            oSelectedContent.On_EndCollectElements(this.oLogicDocument);
            if (!this.pasteInExcel && !this.oLogicDocument.Can_InsertContent(oSelectedContent, NearPos)) {
                return;
            }
            oDoc.Insert_Content(oSelectedContent, NearPos);
            this._selectShapesBeforeInsert(aNewContent, oDoc);
            paragraph.Clear_NearestPosArray(aNewContent);
        }
    },
    InsertInPlacePresentation: function (aNewContent) {
        var presentation = editor.WordControl.m_oLogicDocument;
        var presentationSelectedContent = new PresentationSelectedContent();
        presentationSelectedContent.DocContent = new CSelectedContent();
        for (var i = 0, length = aNewContent.length; i < length; ++i) {
            var oSelectedElement = new CSelectedElement();
            oSelectedElement.Element = aNewContent[i];
            presentationSelectedContent.DocContent.Elements[i] = oSelectedElement;
        }
        presentation.Insert_Content(presentationSelectedContent);
        presentation.Recalculate();
        presentation.Check_CursorMoveRight();
        presentation.Document_UpdateInterfaceState();
    },
    insertInPlace2: function (oDoc, aNewContent) {
        var nNewContentLength = aNewContent.length;
        for (var i = 0; i < aNewContent.length; ++i) {
            aNewContent[i].Clear_TextFormatting();
            aNewContent[i].Clear_Formatting(true);
        }
        oDoc.Remove(1, true, true);
        var Item = oDoc.Content[oDoc.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType()) {
            if (1 == nNewContentLength && type_Paragraph == aNewContent[0].GetType() && Item.CurPos.ContentPos != 1) {
                var oInsertPar = aNewContent[0];
                var nContentLength = oInsertPar.Content.length;
                if (nContentLength > 2) {
                    var oFindObj = Item.Internal_FindBackward(Item.CurPos.ContentPos, [para_TextPr]);
                    var TextPr = null;
                    if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                        TextPr = Item.Content[oFindObj.LetterPos].Copy();
                    } else {
                        TextPr = new ParaTextPr();
                    }
                    var nContentPos = Item.CurPos.ContentPos;
                    for (var i = 0; i < nContentLength - 2; ++i) {
                        var oCurInsItem = oInsertPar.Content[i];
                        if (para_Numbering != oCurInsItem.Type) {
                            Item.Internal_Content_Add(nContentPos, oCurInsItem);
                            nContentPos++;
                        }
                    }
                    Item.Internal_Content_Add(nContentPos, TextPr);
                }
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                this.oRecalcDocument.ContentLastChangePos = this.oRecalcDocument.CurPos.ContentPos;
            } else {
                var LastPos = this.oRecalcDocument.CurPos.ContentPos;
                var LastPosCurDoc = oDoc.CurPos.ContentPos;
                var oSourceFirstPar = Item;
                var oSourceLastPar = new Paragraph(oDoc.DrawingDocument, oDoc, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
                if (true !== oSourceFirstPar.Cursor_IsEnd() || oSourceFirstPar.IsEmpty()) {
                    oSourceFirstPar.Split(oSourceLastPar);
                }
                var oInsFirstPar = aNewContent[0];
                var oInsLastPar = null;
                if (nNewContentLength > 1) {
                    oInsLastPar = aNewContent[nNewContentLength - 1];
                }
                var nStartIndex = 0;
                var nEndIndex = nNewContentLength - 1;
                if (type_Paragraph == oInsFirstPar.GetType()) {
                    oInsFirstPar.CopyPr_Open(oSourceFirstPar);
                    oSourceFirstPar.Concat(oInsFirstPar);
                    if (isRealObject(oInsFirstPar.bullet)) {
                        oSourceFirstPar.setPresentationBullet(oInsFirstPar.bullet.createDuplicate());
                    }
                    nStartIndex++;
                } else {
                    if (type_Table == oInsFirstPar.GetType()) {
                        if (oSourceFirstPar.IsEmpty()) {
                            oSourceFirstPar = null;
                        }
                    }
                }
                if (null != oInsLastPar && type_Paragraph == oInsLastPar.GetType() && true != this.bInBlock) {
                    var nNewContentPos = oInsLastPar.Content.length - 2;
                    var ind = oInsLastPar.Pr.Ind;
                    if (null != oInsLastPar) {
                        oSourceLastPar.CopyPr(oInsLastPar);
                    }
                    if (oInsLastPar.bullet) {
                        oInsLastPar.Set_Ind(ind);
                    }
                    oInsLastPar.Concat(oSourceLastPar);
                    oInsLastPar.CurPos.ContentPos = nNewContentPos;
                    oSourceLastPar = oInsLastPar;
                    nEndIndex--;
                }
                for (var i = nStartIndex; i <= nEndIndex; ++i) {
                    var oElemToAdd = aNewContent[i];
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oElemToAdd);
                }
                if (null != oSourceLastPar) {
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oSourceLastPar);
                }
                if (null == oSourceFirstPar) {
                    oDoc.Internal_Content_Remove(LastPosCurDoc, 1);
                    LastPosCurDoc--;
                }
                this.oRecalcDocument.ContentLastChangePos = LastPos;
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                oDoc.CurPos.ContentPos = LastPosCurDoc;
            }
        }
        var content = oDoc.Content;
        for (var i = 0; i < content.length; ++i) {
            content[i].Recalc_CompiledPr();
            content[i].RecalcInfo.Set_Type_0(pararecalc_0_All);
        }
    },
    ReadFromBinary: function (sBase64) {
        var openParams = {
            checkFileSize: false,
            charCount: 0,
            parCount: 0
        };
        var oBinaryFileReader = new BinaryFileReader(this.oDocument, openParams);
        var oRes = oBinaryFileReader.ReadFromString(sBase64, true);
        this.bInBlock = oRes.bInBlock;
        return oRes;
    },
    Start: function (node, nodeDisplay, bDuplicate, onlyBinary) {
        if (null == nodeDisplay) {
            nodeDisplay = node;
        }
        if (g_bIsDocumentCopyPaste) {
            var oThis = this;
            this.oLogicDocument.Remove(1, true, true, true);
            this.oDocument = this._GetTargetDocument(this.oDocument);
            if (copyPasteUseBinary) {
                if (onlyBinary) {
                    base64 = onlyBinary;
                    if (base64 != null) {
                        aContent = this.ReadFromBinary(base64);
                    }
                    pasteFromBinary = true;
                } else {
                    var base64 = null,
                    base64FromExcel = null,
                    base64FromPresentation, classNode, aContent, aContentExcel, pasteFromBinary = false;
                    if (node.children[0] && node.children[0].getAttribute("class") != null && (node.children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].getAttribute("class").indexOf("pptData;") > -1)) {
                        classNode = node.children[0].getAttribute("class");
                    } else {
                        if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("pptData;") > -1)) {
                            classNode = node.children[0].children[0].getAttribute("class");
                        } else {
                            if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("pptData;") > -1)) {
                                classNode = node.children[0].children[0].children[0].getAttribute("class");
                            }
                        }
                    }
                    if (classNode != null) {
                        var cL = classNode.split(" ");
                        for (var i = 0; i < cL.length; i++) {
                            if (cL[i].indexOf("xslData;") > -1) {
                                base64FromExcel = cL[i].split("xslData;")[1];
                            } else {
                                if (cL[i].indexOf("docData;") > -1) {
                                    base64 = cL[i].split("docData;")[1];
                                } else {
                                    if (cL[i].indexOf("pptData;") > -1) {
                                        base64FromPresentation = cL[i].split("pptData;")[1];
                                    }
                                }
                            }
                        }
                    }
                    if (this.oDocument.Parent && this.oDocument.Parent instanceof CShape) {
                        if (oThis.oDocument && oThis.oDocument.Parent && oThis.oDocument.Parent.parent && oThis.oDocument.Parent.parent.parent && oThis.oDocument.Parent.parent.parent.getObjectType && oThis.oDocument.Parent.parent.parent.getObjectType() == historyitem_type_Chart) {
                            base64 = null;
                        }
                        base64FromExcel = null;
                    } else {
                        if (this.oDocument.bPresentation) {
                            base64 = null;
                            base64FromExcel = null;
                            this.pasteInPresentationShape = true;
                        }
                    }
                    var isImageInNode = node.getElementsByTagName("img") && node.getElementsByTagName("img").length ? true : false;
                    if (base64 != null) {
                        aContent = this.ReadFromBinary(base64);
                    } else {
                        if (base64FromExcel != null && isImageInNode) {
                            aContentExcel = this._readFromBinaryExcel(base64FromExcel);
                        }
                    }
                    if (aContentExcel) {
                        aContent = this._convertExcelBinary(aContentExcel);
                    }
                    if (base64 != null && aContent) {
                        pasteFromBinary = true;
                    } else {
                        if (aContentExcel != null && aContent && aContent.content) {
                            pasteFromBinary = true;
                        }
                    }
                }
                if (pasteFromBinary) {
                    var fPrepasteCallback = function () {
                        if (false == oThis.bNested) {
                            oThis.InsertInDocument();
                            if (nodeDisplay) {
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                            if (aContent.bAddNewStyles) {
                                oThis.api.GenerateStyles();
                            }
                        }
                    };
                    this.aContent = aContent.content;
                    var oImagesToDownload = {};
                    if (aContent.aPastedImages.length > 0) {
                        for (var i = 0, length = aContent.aPastedImages.length; i < length; ++i) {
                            var imageElem = aContent.aPastedImages[i];
                            var src = imageElem.Url;
                            if (false == (0 == src.indexOf("data:") || 0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                                oImagesToDownload[src] = 1;
                            }
                        }
                    }
                    aContent.fonts = oThis._checkFontsOnLoad(aContent.fonts);
                    var aImagesToDownload = [];
                    for (var i in oImagesToDownload) {
                        aImagesToDownload.push(i);
                    }
                    if (aImagesToDownload.length > 0) {
                        if (onlyBinary && window.NativeCorrectImageUrlOnPaste) {
                            var url;
                            for (var i = 0, length = aContent.aPastedImages.length; i < length; ++i) {
                                url = window.NativeCorrectImageUrlOnPaste(aContent.aPastedImages[i].Url);
                                aContent.images[i] = url;
                                var imageElem = aContent.aPastedImages[i];
                                if (null != imageElem) {
                                    imageElem.SetUrl(url);
                                }
                            }
                            oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                        } else {
                            var rData = {
                                "id": documentId,
                                "c": "imgurls",
                                "vkey": documentVKey,
                                "data": JSON.stringify(aImagesToDownload)
                            };
                            sendCommand(this.api, function (incomeObject) {
                                if (incomeObject && "imgurls" == incomeObject.type) {
                                    var oFromTo = JSON.parse(incomeObject.data);
                                    for (var i = 0, length = aContent.images.length; i < length; ++i) {
                                        var sFrom = aContent.images[i];
                                        var sTo = oFromTo[sFrom];
                                        if (sTo) {
                                            aContent.images[i] = sTo;
                                        }
                                    }
                                    for (var i = 0, length = aContent.aPastedImages.length; i < length; ++i) {
                                        var imageElem = aContent.aPastedImages[i];
                                        if (null != imageElem) {
                                            var sNewSrc = oFromTo[imageElem.Url];
                                            if (null != sNewSrc) {
                                                imageElem.SetUrl(sNewSrc);
                                            }
                                        }
                                    }
                                }
                                oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                            },
                            rData);
                        }
                    } else {
                        oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                    }
                    return;
                } else {
                    if (base64FromPresentation) {
                        var fPrepasteCallback = function () {
                            if (false == oThis.bNested) {
                                oThis.InsertInDocument();
                                if (nodeDisplay) {
                                    nodeDisplay.blur();
                                    nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                                }
                                if (aContent.bAddNewStyles) {
                                    oThis.api.GenerateStyles();
                                }
                            }
                        };
                        window.global_pptx_content_loader.Clear();
                        var _stream = CreateBinaryReader(base64FromPresentation, 0, base64FromPresentation.length);
                        var stream = new FileStream(_stream.data, _stream.size);
                        var p_url = stream.GetString2();
                        var p_width = stream.GetULong() / 100000;
                        var p_height = stream.GetULong() / 100000;
                        var fonts = [];
                        var first_string = stream.GetString2();
                        switch (first_string) {
                        case "Content":
                            var docContent = this.ReadPresentationText(stream);
                            var aContent = [];
                            for (var i = 0; i < docContent.length; i++) {
                                aContent[i] = ConvertParagraphToWord(docContent[i].Element, this.oDocument);
                            }
                            this.aContent = aContent;
                            oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                            return;
                        case "Drawings":
                            History.TurnOff();
                            var objects = this.ReadPresentationShapes(stream);
                            History.TurnOn();
                            var arr_shapes = objects.arrShapes;
                            if (!objects.arrImages.length && objects.arrShapes.length === 1 && objects.arrShapes[0] && objects.arrShapes[0].Drawing && objects.arrShapes[0].Drawing.graphicObject) {
                                var drawing = objects.arrShapes[0].Drawing;
                                if (typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame) {
                                    break;
                                }
                            }
                            var aContent = oThis._convertExcelBinary(null, arr_shapes);
                            this.aContent = aContent.content;
                            oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                            return;
                        }
                    }
                }
            }
            var presentation = editor.WordControl.m_oLogicDocument;
            this.oRootNode = node;
            this.bIsPlainText = this._CheckIsPlainText(node);
            this._Prepeare(node, function () {
                oThis.aContent = [];
                if (oThis.oDocument && oThis.oDocument.Parent && oThis.oDocument.Parent.parent && oThis.oDocument.Parent.parent.parent && oThis.oDocument.Parent.parent.parent.getObjectType && oThis.oDocument.Parent.parent.parent.getObjectType() == historyitem_type_Chart) {
                    var hyperlinks = node.getElementsByTagName("a");
                    if (hyperlinks && hyperlinks.length) {
                        var newElement;
                        for (var i = 0; i < hyperlinks.length; i++) {
                            newElement = document.createElement("span");
                            newElement.style = hyperlinks[i].style;
                            $(newElement).append(hyperlinks[i].children);
                            hyperlinks[i].parentNode.replaceChild(newElement, hyperlinks[i]);
                        }
                    }
                    var images = node.getElementsByTagName("img");
                    if (images && images.length) {
                        for (var i = 0; i < images.length; i++) {
                            images[i].parentNode.removeChild(images[i]);
                        }
                    }
                }
                oThis._Execute(node, {},
                true, true, false);
                oThis._AddNextPrevToContent(oThis.oDocument);
                if (false == oThis.bNested) {
                    oThis.InsertInDocument();
                    nodeDisplay.blur();
                    nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                }
            });
        } else {
            var oThis = this;
            var presentation = editor.WordControl.m_oLogicDocument;
            if (copyPasteUseBinary) {
                var base64 = null,
                base64FromWord = null,
                base64FromExcel = null;
                var classNode;
                if (node.children[0] && node.children[0].getAttribute("class") != null) {
                    classNode = node.children[0].getAttribute("class");
                } else {
                    if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null) {
                        classNode = node.children[0].children[0].getAttribute("class");
                    }
                }
                if (classNode != null) {
                    cL = classNode.split(" ");
                    for (var i = 0; i < cL.length; i++) {
                        if (cL[i].indexOf("pptData;") > -1) {
                            base64 = cL[i].split("pptData;")[1];
                        } else {
                            if (cL[i].indexOf("docData;") > -1) {
                                base64FromWord = cL[i].split("docData;")[1];
                            } else {
                                if (cL[i].indexOf("xslData;") > -1) {
                                    base64FromExcel = cL[i].split("xslData;")[1];
                                }
                            }
                        }
                    }
                }
                if (typeof base64 === "string") {
                    window.global_pptx_content_loader.Clear();
                    var _stream = CreateBinaryReader(base64, 0, base64.length);
                    var stream = new FileStream(_stream.data, _stream.size);
                    var p_url = stream.GetString2();
                    var p_width = stream.GetULong() / 100000;
                    var p_height = stream.GetULong() / 100000;
                    var kw = presentation.Width / p_width;
                    var kh = presentation.Height / p_height;
                    var fonts = [];
                    var first_string = stream.GetString2();
                    switch (first_string) {
                    case "Content":
                        var docContent = this.ReadPresentationText(stream);
                        var presentationSelectedContent = new PresentationSelectedContent();
                        presentationSelectedContent.DocContent = new CSelectedContent();
                        presentationSelectedContent.DocContent.Elements = docContent;
                        var font_map = {};
                        var images = [];
                        var fonts = [];
                        for (var i in font_map) {
                            fonts.push(new CFont(i, 0, "", 0));
                        }
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var paste_callback = function () {
                            if (false == oThis.bNested) {
                                presentation.Insert_Content(presentationSelectedContent);
                                presentation.Recalculate();
                                presentation.Check_CursorMoveRight();
                                presentation.Document_UpdateInterfaceState();
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                        };
                        var oPrepeareImages = {};
                        this.api.pre_Paste(fonts, oPrepeareImages, paste_callback);
                        return;
                    case "Drawings":
                        var objects = this.ReadPresentationShapes(stream);
                        var arr_shapes = objects.arrShapes;
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var font_map = {};
                        var images = [];
                        for (var i = 0; i < arr_shapes.length; ++i) {
                            if (arr_shapes[i].Drawing.getAllFonts) {
                                arr_shapes[i].Drawing.getAllFonts(font_map);
                            }
                            if (arr_shapes[i].Drawing.getAllImages) {
                                arr_shapes[i].Drawing.getAllImages(images);
                            }
                        }
                        var paste_callback = function () {
                            if (false == oThis.bNested) {
                                var presentationSelectedContent = new PresentationSelectedContent();
                                presentationSelectedContent.Drawings = arr_shapes;
                                presentation.Insert_Content(presentationSelectedContent);
                                presentation.Recalculate();
                                presentation.Document_UpdateInterfaceState();
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                        };
                        var oImagesToDownload = {};
                        if (objects.arrImages.length > 0) {
                            for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                var imageElem = objects.arrImages[i];
                                var src = imageElem.Url;
                                oImagesToDownload[src] = 1;
                            }
                        }
                        for (var i in font_map) {
                            fonts.push(new CFont(i, 0, "", 0));
                        }
                        var aImagesToDownload = [];
                        for (var i in oImagesToDownload) {
                            aImagesToDownload.push(i);
                        }
                        if (aImagesToDownload.length > 0) {
                            var rData = {
                                "id": documentId,
                                "c": "imgurls",
                                "vkey": documentVKey,
                                "data": JSON.stringify(aImagesToDownload)
                            };
                            sendCommand(this.api, function (incomeObject) {
                                if (incomeObject && "imgurls" == incomeObject.type) {
                                    var oFromTo = JSON.parse(incomeObject.data);
                                    var arr_images = [];
                                    var image_map = {};
                                    for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                        var sFrom = objects.arrImages[i].Url;
                                        var sTo = oFromTo[sFrom];
                                        if (sTo) {
                                            arr_images.push(sTo);
                                        }
                                    }
                                    for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                        var imageElem = objects.arrImages[i];
                                        if (null != imageElem) {
                                            var sNewSrc = oFromTo[imageElem.Url];
                                            if (null != sNewSrc) {
                                                image_map[sNewSrc] = sNewSrc;
                                                imageElem.SetUrl(sNewSrc);
                                            } else {
                                                image_map[imageElem.Url] = imageElem.Url;
                                            }
                                        }
                                    }
                                }
                                oThis.api.pre_Paste(fonts, image_map, paste_callback);
                            },
                            rData);
                        } else {
                            var im_arr = [];
                            for (var key in images) {
                                im_arr.push(key);
                            }
                            this.api.pre_Paste(fonts, im_arr, paste_callback);
                        }
                        return;
                    case "SlideObjects":
                        var arr_layouts_id = [];
                        var arr_slides = [];
                        var loader = new BinaryPPTYLoader();
                        if (! (bDuplicate === true)) {
                            loader.Start_UseFullUrl();
                        }
                        loader.stream = stream;
                        loader.presentation = editor.WordControl.m_oLogicDocument;
                        var slide_count = stream.GetULong();
                        var arr_arrTransforms = [];
                        for (var i = 0; i < slide_count; ++i) {
                            arr_layouts_id[i] = stream.GetString2();
                            var table_style_ids_len = stream.GetULong();
                            var table_style_ids = [];
                            for (var j = 0; j < table_style_ids_len; ++j) {
                                if (stream.GetBool()) {
                                    table_style_ids.push(stream.GetULong());
                                } else {
                                    table_style_ids.push(-1);
                                }
                            }
                            arr_slides[i] = loader.ReadSlide(0);
                            var sp_tree = arr_slides[i].cSld.spTree;
                            var t = 0;
                            for (var s = 0; s < sp_tree.length; ++s) {
                                if (sp_tree[s] instanceof CGraphicFrame) {
                                    sp_tree[s].graphicObject.Set_TableStyle(table_style_ids[t]);
                                    ++t;
                                }
                            }
                            var arrTransforms = [];
                            var sp_tree_length = stream.GetULong();
                            for (s = 0; s < sp_tree_length; ++s) {
                                var transform_object = {};
                                transform_object.x = stream.GetULong() / 100000;
                                transform_object.y = stream.GetULong() / 100000;
                                transform_object.extX = stream.GetULong() / 100000;
                                transform_object.extY = stream.GetULong() / 100000;
                                arrTransforms.push(transform_object);
                            }
                            arr_arrTransforms.push(arrTransforms);
                        }
                        var arr_layouts = [];
                        var master;
                        if (presentation.Slides[presentation.CurPage]) {
                            master = presentation.Slides[presentation.CurPage].Layout.Master;
                        } else {
                            master = presentation.slideMasters[0];
                        }
                        if (editor.DocumentUrl !== p_url) {
                            var layouts_count = stream.GetULong();
                            for (var i = 0; i < layouts_count; ++i) {
                                arr_layouts[i] = loader.ReadSlideLayout();
                                arr_layouts[i].Width = p_width;
                                arr_layouts[i].Height = p_height;
                            }
                            var arr_indexes = [];
                            for (var i = 0; i < slide_count; ++i) {
                                arr_indexes.push(stream.GetULong());
                            }
                            for (var i = 0; i < layouts_count; ++i) {
                                arr_layouts[i].setMaster(master);
                                arr_layouts[i].changeSize(presentation.Width, presentation.Height);
                                master.addLayout(arr_layouts[i]);
                            }
                            for (var i = 0; i < slide_count; ++i) {
                                arr_slides[i].changeSize(presentation.Width, presentation.Height);
                                arr_slides[i].setLayout(arr_layouts[arr_indexes[i]]);
                                arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                            }
                        } else {
                            var arr_matched_layout = [];
                            var b_read_layouts = false;
                            for (var i = 0; i < arr_layouts_id.length; ++i) {
                                var tempLayout = g_oTableId.Get_ById(arr_layouts_id[i]);
                                if (!tempLayout || !tempLayout.Master) {
                                    b_read_layouts = true;
                                    break;
                                } else {
                                    for (var j = 0; j < presentation.slideMasters.length; ++j) {
                                        if (presentation.slideMasters[j] === tempLayout.Master) {
                                            break;
                                        }
                                    }
                                    if (j === presentation.slideMasters.length) {
                                        b_read_layouts = true;
                                        break;
                                    }
                                }
                            }
                            if (b_read_layouts) {
                                var layouts_count = stream.GetULong();
                                ExecuteNoHistory(function () {
                                    for (var i = 0; i < layouts_count; ++i) {
                                        arr_layouts[i] = loader.ReadSlideLayout();
                                        arr_layouts[i].Width = p_width;
                                        arr_layouts[i].Height = p_height;
                                    }
                                },
                                this, []);
                                var arr_indexes = [];
                                for (var i = 0; i < slide_count; ++i) {
                                    arr_indexes.push(stream.GetULong());
                                }
                                var addedLayouts = [];
                                for (var i = 0; i < slide_count; ++i) {
                                    var tempLayout = g_oTableId.Get_ById(arr_layouts_id[i]);
                                    if (tempLayout && tempLayout.Master) {
                                        arr_slides[i].changeSize(presentation.Width, presentation.Height);
                                        arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                        arr_slides[i].setLayout(g_oTableId.Get_ById(arr_layouts_id[i]));
                                    } else {
                                        arr_slides[i].changeSize(presentation.Width, presentation.Height);
                                        arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                        var tempLayout = master.getMatchingLayout(arr_layouts[arr_indexes[i]].type, arr_layouts[arr_indexes[i]].matchingName, arr_layouts[arr_indexes[i]].cSld.name, true);
                                        arr_slides[i].setLayout(tempLayout);
                                    }
                                }
                            } else {
                                for (var i = 0; i < slide_count; ++i) {
                                    arr_slides[i].changeSize(presentation.Width, presentation.Height);
                                    arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                    arr_slides[i].setLayout(g_oTableId.Get_ById(arr_layouts_id[i]));
                                    arr_slides[i].Width = presentation.Width;
                                    arr_slides[i].Height = presentation.Height;
                                }
                            }
                        }
                        oThis = this;
                        var font_map = {};
                        var images = [];
                        var slideCopyObjects = [];
                        for (var i = 0; i < arr_slides.length; ++i) {
                            if (arr_slides[i].getAllFonts) {
                                arr_slides[i].getAllFonts(font_map);
                            }
                            if (arr_slides[i].getAllImages) {
                                arr_slides[i].getAllImages(images);
                            }
                            slideCopyObjects[i] = new SlideCopyObject();
                            slideCopyObjects[i].Slide = arr_slides[i];
                        }
                        for (var i = 0; i < arr_layouts.length; ++i) {
                            if (arr_layouts[i].getAllFonts) {
                                arr_layouts[i].getAllFonts(font_map);
                            }
                            if (arr_layouts[i].getAllImages) {
                                arr_layouts[i].getAllImages(images);
                            }
                        }
                        for (var i in font_map) {
                            fonts.push(new CFont(i, 0, "", 0));
                        }
                        var paste_callback = function () {
                            var presentationSelectedContent = new PresentationSelectedContent();
                            presentationSelectedContent.SlideObjects = slideCopyObjects;
                            presentation.Insert_Content(presentationSelectedContent);
                            presentation.Recalculate();
                            presentation.Document_UpdateInterfaceState();
                        };
                        var image_objects = loader.End_UseFullUrl();
                        var objects = {
                            arrImages: image_objects
                        };
                        var oImagesToDownload = {};
                        if (objects.arrImages.length > 0) {
                            for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                var imageElem = objects.arrImages[i];
                                var src = imageElem.Url;
                                if (false == (0 == src.indexOf("data:") || 0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                                    oImagesToDownload[src] = 1;
                                }
                            }
                        }
                        var aImagesToDownload = [];
                        for (var i in oImagesToDownload) {
                            aImagesToDownload.push(i);
                        }
                        if (aImagesToDownload.length > 0) {
                            var rData = {
                                "id": documentId,
                                "c": "imgurls",
                                "vkey": documentVKey,
                                "data": JSON.stringify(aImagesToDownload)
                            };
                            sendCommand(this.api, function (incomeObject) {
                                if (incomeObject && "imgurls" == incomeObject.type) {
                                    var oFromTo = JSON.parse(incomeObject.data);
                                    var image_map = {};
                                    for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                        var sFrom = objects.arrImages[i].Url;
                                        var sTo = oFromTo[sFrom];
                                    }
                                    for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                                        var imageElem = objects.arrImages[i];
                                        if (null != imageElem) {
                                            var sNewSrc = oFromTo[imageElem.Url];
                                            if (null != sNewSrc) {
                                                image_map[sNewSrc] = sNewSrc;
                                                imageElem.SetUrl(sNewSrc);
                                            } else {
                                                image_map[imageElem.Url] = imageElem.Url;
                                            }
                                        }
                                    }
                                }
                                oThis.api.pre_Paste(fonts, image_map, paste_callback);
                            },
                            rData);
                        } else {
                            var im_arr = [];
                            for (var key in images) {
                                im_arr.push(key);
                            }
                            this.api.pre_Paste(fonts, im_arr, paste_callback);
                        }
                        return;
                    case "TeamLab4":
                        var objects = this.ReadPresentationShapes(stream);
                        var arr_shapes = objects.arrShapes;
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var fonts = [];
                        var images = [];
                        for (var i = 0; i < arr_shapes.length; ++i) {
                            if (arr_shapes[i].getAllFonts) {
                                arr_shapes[i].getAllFonts(fonts);
                            }
                            if (arr_shapes[i].getAllImages) {
                                arr_shapes[i].getAllImages(images);
                            }
                        }
                        var paste_callback = function () {
                            if (false == oThis.bNested) {
                                var b_add_slide = false;
                                if (presentation.Slides.length === 0) {
                                    presentation.addNextSlide();
                                    b_add_slide = true;
                                }
                                if (presentation.Document_Is_SelectionLocked(changestype_AddShapes, arr_shapes) === false) {
                                    var slide = presentation.Slides[presentation.CurPage];
                                    if (presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                                        slide.graphicObjects.resetSelectionState();
                                        for (var i = 0; i < arr_shapes.length; ++i) {
                                            if (b_add_slide) {
                                                arr_shapes[i].setParent(presentation.Slides[0]);
                                            }
                                            arr_shapes[i].changeSize(presentation.Width, presentation.Height);
                                            slide.addToSpTreeToPos(slide.cSld.spTree.length, arr_shapes[i]);
                                            arr_shapes[i].select(slide.graphicObjects);
                                        }
                                    }
                                    presentation.Recalculate();
                                }
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                        };
                        var aImagesToDownload = [];
                        for (var i in images) {
                            aImagesToDownload.push(i);
                        }
                        var oPrepeareImages = {};
                        if (aImagesToDownload.length > 0) {
                            var rData = {
                                "id": documentId,
                                "c": "imgurls",
                                "vkey": documentVKey,
                                "data": JSON.stringify(aImagesToDownload)
                            };
                            sendCommand(this.api, function (incomeObject) {
                                if (incomeObject && "imgurls" == incomeObject.type) {
                                    var oFromTo = JSON.parse(incomeObject.data);
                                    for (var i = 0, length = aImagesToDownload.length; i < length; ++i) {
                                        var sFrom = aImagesToDownload[i];
                                        var sTo = oFromTo[sFrom];
                                        if (sTo) {
                                            oThis.oImages[sFrom] = sTo;
                                            oPrepeareImages[i] = sTo;
                                        }
                                    }
                                }
                                oThis.api.pre_Paste(fonts, oPrepeareImages, paste_callback);
                            },
                            rData);
                        } else {
                            this.api.pre_Paste(fonts, [], paste_callback);
                        }
                        return;
                    }
                } else {
                    if (base64FromWord) {
                        var trueDocument = this.oDocument;
                        var tempCDocument = function () {
                            return new CDocument(this.oDocument.DrawingDocument);
                        };
                        this.oDocument = ExecuteNoHistory(tempCDocument, this, []);
                        var aContent = ExecuteNoHistory(this.ReadFromBinary, this, [base64FromWord]);
                        this.oDocument = trueDocument;
                        History.Document = trueDocument;
                        var presentationSelectedContent = new PresentationSelectedContent();
                        presentationSelectedContent.DocContent = new CSelectedContent();
                        var elements = [],
                        selectedElement,
                        element,
                        drawings,
                        pDrawings = [],
                        drawingCopyObject;
                        var defaultTableStyleId = presentation.DefaultTableStyleId;
                        for (var i = 0; i < aContent.content.length; ++i) {
                            selectedElement = new CSelectedElement();
                            element = aContent.content[i];
                            drawings = element.Get_AllDrawingObjects();
                            if (drawings && drawings.length) {
                                for (var j = 0; j < drawings.length; j++) {
                                    drawingCopyObject = new DrawingCopyObject();
                                    drawingCopyObject.Drawing = drawings[j].GraphicObj;
                                    pDrawings.push(drawingCopyObject);
                                }
                            } else {
                                if (type_Paragraph == element.GetType()) {
                                    selectedElement.Element = ConvertParagraphToPPTX(element);
                                    elements.push(selectedElement);
                                } else {
                                    if (type_Table == element.GetType()) {
                                        var W = 100;
                                        var Rows = 3;
                                        var graphic_frame = new CGraphicFrame();
                                        graphic_frame.setSpPr(new CSpPr());
                                        graphic_frame.spPr.setParent(graphic_frame);
                                        graphic_frame.spPr.setXfrm(new CXfrm());
                                        graphic_frame.spPr.xfrm.setParent(graphic_frame.spPr);
                                        graphic_frame.spPr.xfrm.setOffX((this.oDocument.Width - W) / 2);
                                        graphic_frame.spPr.xfrm.setOffY(this.oDocument.Height / 5);
                                        graphic_frame.spPr.xfrm.setExtX(W);
                                        graphic_frame.spPr.xfrm.setExtY(7.478268771701388 * Rows);
                                        graphic_frame.setNvSpPr(new UniNvPr());
                                        element = this._convertTableToPPTX(element);
                                        graphic_frame.setGraphicObject(element.Copy(graphic_frame));
                                        graphic_frame.graphicObject.Set_TableStyle(defaultTableStyleId);
                                        drawingCopyObject = new DrawingCopyObject();
                                        drawingCopyObject.Drawing = graphic_frame;
                                        pDrawings.push(drawingCopyObject);
                                    }
                                }
                            }
                        }
                        presentationSelectedContent.DocContent.Elements = elements;
                        presentationSelectedContent.Drawings = pDrawings;
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var paste_callback = function () {
                            if (false == oThis.bNested) {
                                presentation.Insert_Content(presentationSelectedContent);
                                presentation.Recalculate();
                                presentation.Check_CursorMoveRight();
                                presentation.Document_UpdateInterfaceState();
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                        };
                        var font_map = {};
                        var images = [];
                        var fonts = [];
                        for (var i in font_map) {
                            fonts.push(new CFont(i, 0, "", 0));
                        }
                        var oImagesToDownload = [];
                        if (aContent.aPastedImages.length > 0) {
                            for (var i = 0, length = aContent.aPastedImages.length; i < length; ++i) {
                                var imageElem = aContent.aPastedImages[i];
                                var src = imageElem.Url;
                                if (false == (0 == src.indexOf("data:") || 0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                                    oImagesToDownload[src] = 1;
                                }
                            }
                        }
                        var aImagesToDownload = [];
                        for (var i in oImagesToDownload) {
                            aImagesToDownload.push(i);
                        }
                        if (aImagesToDownload.length > 0) {
                            var rData = {
                                "id": documentId,
                                "c": "imgurls",
                                "vkey": documentVKey,
                                "data": JSON.stringify(aImagesToDownload)
                            };
                            sendCommand(this.api, function (incomeObject) {
                                if (incomeObject && "imgurls" == incomeObject.type) {
                                    var oFromTo = JSON.parse(incomeObject.data);
                                    var arr_images = [];
                                    var image_map = {};
                                    for (var i = 0, length = aContent.images.length; i < length; ++i) {
                                        var sFrom = aContent.images[i];
                                        var sTo = oFromTo[sFrom];
                                        if (sTo) {
                                            arr_images.push(sTo);
                                        }
                                    }
                                    for (var i = 0, length = aContent.images.length; i < length; ++i) {
                                        var imageElem = aContent.aPastedImages[i];
                                        if (null != imageElem) {
                                            var sNewSrc = oFromTo[imageElem.Url];
                                            if (null != sNewSrc) {
                                                image_map[sNewSrc] = sNewSrc;
                                                imageElem.SetUrl(sNewSrc);
                                            } else {
                                                image_map[imageElem.Url] = imageElem.Url;
                                            }
                                        }
                                    }
                                }
                                for (var i = 0; i < presentationSelectedContent.Drawings.length; i++) {
                                    if (! (presentationSelectedContent.Drawings[i].Drawing instanceof CGraphicFrame)) {
                                        presentationSelectedContent.Drawings[i].Drawing = presentationSelectedContent.Drawings[i].Drawing.convertToPPTX(oThis.oDocument.DrawingDocument);
                                        checkBlipFillRasterImages(presentationSelectedContent.Drawings[i].Drawing);
                                    }
                                }
                                oThis.api.pre_Paste(fonts, image_map, paste_callback);
                            },
                            rData);
                        } else {
                            for (var i = 0; i < presentationSelectedContent.Drawings.length; i++) {
                                if (! (presentationSelectedContent.Drawings[i].Drawing instanceof CGraphicFrame)) {
                                    presentationSelectedContent.Drawings[i].Drawing = presentationSelectedContent.Drawings[i].Drawing.convertToPPTX(oThis.oDocument.DrawingDocument);
                                    checkBlipFillRasterImages(presentationSelectedContent.Drawings[i].Drawing);
                                }
                            }
                            oThis.api.pre_Paste(aContent.fonts, aContent.images, paste_callback);
                        }
                        return;
                    } else {
                        if (base64FromExcel) {
                            var aContentExcel = this._readFromBinaryExcel(base64FromExcel);
                            if (aContentExcel && aContentExcel.aWorksheets && aContentExcel.aWorksheets[0] && aContentExcel.aWorksheets[0].Drawings && aContentExcel.aWorksheets[0].Drawings.length) {
                                var arr_shapes = aContentExcel.aWorksheets[0].Drawings;
                                var arrImages = [];
                                var shape;
                                var aContent = this._getImagesFromExcelShapes(arr_shapes);
                                for (var i = 0; i < arr_shapes.length; ++i) {
                                    shape = arr_shapes[i].graphicObject;
                                    shape.worksheet = null;
                                    shape.drawingBase = null;
                                    arr_shapes[i] = new DrawingCopyObject(shape, 0, 0, 0, 0);
                                }
                                var presentation = editor.WordControl.m_oLogicDocument;
                                oThis = this;
                                var font_map = {};
                                var images = aContent.images;
                                var arrImages = aContent.aPastedImages;
                                var paste_callback = function () {
                                    if (false == oThis.bNested) {
                                        var presentationSelectedContent = new PresentationSelectedContent();
                                        presentationSelectedContent.Drawings = arr_shapes;
                                        presentation.Insert_Content(presentationSelectedContent);
                                        presentation.Recalculate();
                                        presentation.Check_CursorMoveRight();
                                        presentation.Document_UpdateInterfaceState();
                                        nodeDisplay.blur();
                                        nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                                    }
                                };
                                var oImagesToDownload = {};
                                if (arrImages.length > 0) {
                                    for (var i = 0, length = arrImages.length; i < length; ++i) {
                                        var imageElem = arrImages[i];
                                        var src = imageElem.Url;
                                        oImagesToDownload[src] = 1;
                                    }
                                }
                                var fonts = [];
                                var aImagesToDownload = [];
                                for (var i in font_map) {
                                    fonts.push(new CFont(i, 0, "", 0));
                                }
                                var aImagesToDownload = [];
                                for (var i in oImagesToDownload) {
                                    aImagesToDownload.push(i);
                                }
                                if (aImagesToDownload.length > 0) {
                                    var rData = {
                                        "id": documentId,
                                        "c": "imgurls",
                                        "vkey": documentVKey,
                                        "data": JSON.stringify(aImagesToDownload)
                                    };
                                    sendCommand(this.api, function (incomeObject) {
                                        if (incomeObject && "imgurls" == incomeObject.type) {
                                            var oFromTo = JSON.parse(incomeObject.data);
                                            var arr_images = [];
                                            var image_map = {};
                                            for (var i = 0, length = arrImages.length; i < length; ++i) {
                                                var sFrom = arrImages[i].Url;
                                                var sTo = oFromTo[sFrom];
                                                if (sTo) {
                                                    arr_images.push(sTo);
                                                }
                                            }
                                            for (var i = 0, length = arrImages.length; i < length; ++i) {
                                                var imageElem = arrImages[i];
                                                if (null != imageElem) {
                                                    var sNewSrc = oFromTo[imageElem.Url];
                                                    if (null != sNewSrc) {
                                                        image_map[sNewSrc] = sNewSrc;
                                                        imageElem.SetUrl(sNewSrc);
                                                    } else {
                                                        image_map[imageElem.Url] = imageElem.Url;
                                                    }
                                                }
                                            }
                                        }
                                        oThis.api.pre_Paste(fonts, image_map, paste_callback);
                                    },
                                    rData);
                                } else {
                                    var im_arr = [];
                                    for (var key in images) {
                                        im_arr.push(key);
                                    }
                                    this.api.pre_Paste(fonts, im_arr, paste_callback);
                                }
                                return;
                            }
                        }
                    }
                }
            }
            this.oRootNode = node;
            this._Prepeare(node, function () {
                oThis.aContent = [];
                var arrShapes = [],
                arrImages = [],
                arrTables = [];
                var presentation = editor.WordControl.m_oLogicDocument;
                var b_add_slide = false;
                if (presentation.Slides.length === 0) {
                    presentation.addNextSlide();
                    b_add_slide = true;
                }
                var shape = new CShape();
                shape.setParent(presentation.Slides[presentation.CurPage]);
                shape.setTxBody(CreateTextBodyFromString("", presentation.DrawingDocument, shape));
                arrShapes.push(shape);
                oThis._ExecutePresentation(node, {},
                true, true, false, arrShapes, arrImages, arrTables);
                for (var i = 0; i < arrShapes.length; ++i) {
                    shape = arrShapes[i];
                    if (shape.txBody.content.Content.length > 1) {
                        shape.txBody.content.Internal_Content_Remove(0, 1);
                    }
                    var w = shape.txBody.getRectWidth(presentation.Width * 2 / 3);
                    var h = shape.txBody.content.Get_SummaryHeight();
                    CheckSpPrXfrm(shape);
                    shape.spPr.xfrm.setExtX(w);
                    shape.spPr.xfrm.setExtY(h);
                    shape.spPr.xfrm.setOffX(0);
                    shape.spPr.xfrm.setOffY(0);
                    shape.txBody.content.Cursor_MoveToEndPos();
                    arrShapes[i] = new DrawingCopyObject(shape, 0, 0, w, h);
                }
                var defaultTableStyleId = presentation.DefaultTableStyleId;
                for (var i = 0; i < arrTables.length; ++i) {
                    shape = arrTables[i];
                    var w = 100;
                    var h = 100;
                    CheckSpPrXfrm(shape);
                    shape.spPr.xfrm.setExtX(w);
                    shape.spPr.xfrm.setExtY(h);
                    shape.spPr.xfrm.setOffX(0);
                    shape.spPr.xfrm.setOffY(0);
                    arrShapes[arrShapes.length] = new DrawingCopyObject(shape, 0, 0, w, h);
                }
                var defaultTableStyleId = presentation.DefaultTableStyleId;
                for (var i = 0; i < arrImages.length; ++i) {
                    shape = arrImages[i];
                    CheckSpPrXfrm(shape);
                    shape.spPr.xfrm.setOffX(0);
                    shape.spPr.xfrm.setOffY(0);
                    arrShapes[arrShapes.length] = new DrawingCopyObject(shape, 0, 0, w, h);
                }
                var presentation = editor.WordControl.m_oLogicDocument;
                var font_map = {};
                var images = [];
                if (shape.getAllImages) {
                    shape.getAllImages(images);
                }
                var oImagesToDownload = {};
                if (objects && objects.arrImages.length > 0) {
                    for (var i = 0, length = objects.arrImages.length; i < length; ++i) {
                        var imageElem = objects.arrImages[i];
                        var src = imageElem.Url;
                        oImagesToDownload[src] = 1;
                    }
                }
                var aImagesToDownload = [];
                for (var i in oImagesToDownload) {
                    aImagesToDownload.push(i);
                }
                var slide = presentation.Slides[presentation.CurPage];
                var targetDocContent = slide.graphicObjects.getTargetDocContent();
                var paste_callback = function () {
                    if (targetDocContent && arrShapes.length === 1 && arrImages.length === 0 && arrTables.length === 0) {
                        if (presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                            var aNewContent = arrShapes[0].Drawing.txBody.content.Content;
                            oThis.InsertInPlacePresentation(aNewContent);
                        }
                    } else {
                        var presentationSelectedContent = new PresentationSelectedContent();
                        presentationSelectedContent.Drawings = arrShapes;
                        presentation.Insert_Content(presentationSelectedContent);
                        presentation.Recalculate();
                        presentation.Check_CursorMoveRight();
                        presentation.Document_UpdateInterfaceState();
                    }
                };
                var aContent = oThis.aContent;
                if (aImagesToDownload.length > 0) {
                    var rData = {
                        "id": documentId,
                        "c": "imgurls",
                        "vkey": documentVKey,
                        "data": JSON.stringify(aImagesToDownload)
                    };
                    sendCommand(this.api, function (incomeObject) {
                        if (incomeObject && "imgurls" == incomeObject.type) {
                            var oFromTo = JSON.parse(incomeObject.data);
                            var arr_images = [];
                            var image_map = {};
                            for (var i = 0, length = aContent.images.length; i < length; ++i) {
                                var sFrom = aContent.images[i];
                                var sTo = oFromTo[sFrom];
                                if (sTo) {
                                    arr_images.push(sTo);
                                }
                            }
                            for (var i = 0, length = aContent.images.length; i < length; ++i) {
                                var imageElem = aContent.aPastedImages[i];
                                if (null != imageElem) {
                                    var sNewSrc = oFromTo[imageElem.Url];
                                    if (null != sNewSrc) {
                                        image_map[sNewSrc] = sNewSrc;
                                        imageElem.SetUrl(sNewSrc);
                                    } else {
                                        image_map[imageElem.Url] = imageElem.Url;
                                    }
                                }
                            }
                        }
                        oThis.api.pre_Paste(fonts, image_map, paste_callback);
                    },
                    rData);
                } else {
                    oThis.api.pre_Paste(aContent.fonts, aContent.images, paste_callback);
                }
                nodeDisplay.blur();
                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
            });
        }
    },
    _convertExcelBinary: function (aContentExcel, pDrawings) {
        var aContent = null,
        tempParagraph = null;
        var aPastedImages = [];
        var imageUrl, images = [],
        isGraphicFrame,
        extX,
        extY;
        var drawings = pDrawings ? pDrawings : aContentExcel.aWorksheets[0].Drawings;
        if (drawings && drawings.length) {
            var drawing, graphicObj, paraRun, tempParaRun;
            aContent = [];
            for (var i = 0; i < drawings.length; i++) {
                drawing = drawings[i] && drawings[i].Drawing ? drawings[i].Drawing : drawings[i];
                isGraphicFrame = typeof CTable !== "undefined" && drawing.graphicObject instanceof CTable;
                if (isGraphicFrame && drawings.length > 1 && drawings[i].base64) {
                    if (!tempParagraph) {
                        tempParagraph = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 0, 0, 0, 0);
                    }
                    extX = drawings[i].ExtX;
                    extY = drawings[i].ExtY;
                    imageUrl = drawings[i].base64;
                    graphicObj = DrawingObjectsController.prototype.createImage(imageUrl, 0, 0, extX, extY);
                    tempParaRun = new ParaRun();
                    tempParaRun.Paragraph = null;
                    tempParaRun.Add_ToContent(0, new ParaDrawing(), false);
                    tempParaRun.Content[0].Set_GraphicObject(graphicObj);
                    tempParaRun.Content[0].GraphicObj.setParent(tempParaRun.Content[0]);
                    tempParagraph.Content.splice(tempParagraph.Content.length - 1, 0, tempParaRun);
                    aPastedImages[aPastedImages.length] = new CBuilderImages(graphicObj.blipFill, imageUrl);
                    images[images.length] = imageUrl;
                } else {
                    if (isGraphicFrame) {
                        drawing.setBDeleted(true);
                        drawing.setWordFlag(false);
                        var copyObj = drawing.graphicObject.Copy();
                        copyObj.Set_Parent(this.oDocument);
                        aContent[aContent.length] = copyObj;
                        drawing.setWordFlag(true);
                    } else {
                        if (!tempParagraph) {
                            tempParagraph = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 0, 0, 0, 0);
                        }
                        extX = drawings[i].ExtX;
                        extY = drawings[i].ExtY;
                        graphicObj = drawing.graphicObject ? drawing.graphicObject.convertToWord(this.oLogicDocument) : drawing.convertToWord(this.oLogicDocument);
                        tempParaRun = new ParaRun();
                        tempParaRun.Paragraph = null;
                        tempParaRun.Add_ToContent(0, new ParaDrawing(), false);
                        tempParaRun.Content[0].Set_GraphicObject(graphicObj);
                        tempParaRun.Content[0].GraphicObj.setParent(tempParaRun.Content[0]);
                        tempParagraph.Content.splice(tempParagraph.Content.length - 1, 0, tempParaRun);
                        if (graphicObj.isImage()) {
                            imageUrl = graphicObj.getImageUrl();
                            aPastedImages[aPastedImages.length] = new CBuilderImages(graphicObj.blipFill, imageUrl);
                            images[images.length] = imageUrl;
                        } else {
                            if (graphicObj.spPr && graphicObj.spPr.Fill && graphicObj.spPr.Fill.fill && graphicObj.spPr.Fill.fill.RasterImageId && graphicObj.spPr.Fill.fill.RasterImageId != null) {
                                imageUrl = graphicObj.spPr.Fill.fill.RasterImageId;
                                images[images.length] = imageUrl;
                            } else {
                                if (graphicObj.isGroup() && graphicObj.spTree && graphicObj.spTree.length) {
                                    var spTree = graphicObj.spTree;
                                    for (var j = 0; j < spTree.length; j++) {
                                        if (spTree[j].isImage()) {
                                            images.push(spTree[j].getImageUrl());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (tempParagraph) {
                aContent[aContent.length] = tempParagraph;
            }
        }
        return {
            content: aContent,
            aPastedImages: aPastedImages,
            images: images
        };
    },
    _convertTableToPPTX: function (table) {
        var allRows = [];
        this.maxTableCell = 0;
        table = this._replaceInnerTables(table, allRows, true);
        table.bPresentation = true;
        for (var i = 0; i < table.Content.length; i++) {
            for (var j = 0; j < table.Content[i].Content.length; j++) {
                var cDocumentContent = table.Content[i].Content[j].Content;
                cDocumentContent.bPresentation = true;
                var nIndex = 0;
                for (var n = 0; n < cDocumentContent.Content.length; n++) {
                    if (cDocumentContent.Content[n] instanceof Paragraph) {
                        cDocumentContent.Content[nIndex] = ConvertParagraphToPPTX(cDocumentContent.Content[nIndex]);
                        ++nIndex;
                    }
                }
            }
        }
        return table;
    },
    _replaceInnerTables: function (table, allRows, isRoot) {
        for (var i = 0; i < table.Content.length; i++) {
            allRows[allRows.length] = table.Content[i];
            if (this.maxTableCell < table.Content[i].Content.length) {
                this.maxTableCell = table.Content[i].Content.length;
            }
            for (var j = 0; j < table.Content[i].Content.length; j++) {
                var cDocumentContent = table.Content[i].Content[j].Content;
                cDocumentContent.bPresentation = true;
                var k = 0;
                for (var n = 0; n < cDocumentContent.Content.length; n++) {
                    if (cDocumentContent.Content[n] instanceof CTable) {
                        this._replaceInnerTables(cDocumentContent.Content[n], allRows);
                        cDocumentContent.Content.splice(n, 1);
                    }
                }
            }
        }
        if (isRoot === true) {
            for (var row = 0; row < allRows.length; row++) {
                var cells = allRows[row].Content;
                if (cells.length < this.maxTableCell) {
                    for (var cell = cells.length; cell < this.maxTableCell; cell++) {
                        allRows[row].Add_Cell(allRows[row].Get_CellsCount(), allRows[row], null, false);
                    }
                }
            }
            table.Content = allRows;
            table.Rows = allRows.length;
        }
        return table;
    },
    _getImagesFromExcelShapes: function (pDrawings) {
        var aContent = null;
        var aPastedImages = [];
        var imageUrl, images = [];
        var drawings = pDrawings;
        if (drawings && drawings.length) {
            var drawing, graphicObj;
            for (var i = 0; i < drawings.length; i++) {
                drawing = drawings[i] && drawings[i].Drawing ? drawings[i].Drawing : drawings[i];
                graphicObj = drawing.graphicObject;
                if (graphicObj.isImage()) {
                    imageUrl = graphicObj.getImageUrl();
                    aPastedImages[aPastedImages.length] = new CBuilderImages(graphicObj.blipFill, imageUrl);
                    images[images.length] = imageUrl;
                } else {
                    if (graphicObj.spPr && graphicObj.spPr.Fill && graphicObj.spPr.Fill.fill && graphicObj.spPr.Fill.fill.RasterImageId && graphicObj.spPr.Fill.fill.RasterImageId != null) {
                        imageUrl = graphicObj.spPr.Fill.fill.RasterImageId;
                        images[images.length] = imageUrl;
                    } else {
                        if (graphicObj.isGroup() && graphicObj.spTree && graphicObj.spTree.length) {
                            var spTree = graphicObj.spTree;
                            for (var j = 0; j < spTree.length; j++) {
                                if (spTree[j].isImage()) {
                                    imageUrl = spTree[j].getImageUrl();
                                    aPastedImages[aPastedImages.length] = new CBuilderImages(spTree[j].blipFill, imageUrl);
                                    images[images.length] = imageUrl;
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            aPastedImages: aPastedImages,
            images: images
        };
    },
    _selectShapesBeforeInsert: function (aNewContent, oDoc) {
        var content, drawingObj, allDrawingObj = [];
        for (var i = 0; i < aNewContent.length; i++) {
            content = aNewContent[i];
            drawingObj = content.Get_AllDrawingObjects();
            if (!drawingObj || (drawingObj && !drawingObj.length) || content.GetType() == type_Table) {
                allDrawingObj = null;
                break;
            }
            for (var n = 0; n < drawingObj.length; n++) {
                allDrawingObj[allDrawingObj.length] = drawingObj[n];
            }
        }
        if (allDrawingObj && allDrawingObj.length) {
            this.oLogicDocument.Select_Drawings(allDrawingObj, oDoc);
        }
    },
    _readFromBinaryExcel: function (base64) {
        var oBinaryFileReader = new Asc.BinaryFileReader(null, true);
        var tempWorkbook = new Workbook();
        tempWorkbook.theme = this.oDocument.theme ? this.oDocument.theme : this.oLogicDocument.theme;
        if (!tempWorkbook.theme && this.oLogicDocument.themes && this.oLogicDocument.themes[0]) {
            tempWorkbook.theme = this.oLogicDocument.themes[0];
        }
        Asc.getBinaryOtherTableGVar(tempWorkbook);
        oBinaryFileReader.Read(base64, tempWorkbook);
        return tempWorkbook;
    },
    ReadPresentationText: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape;
        if (presentation.Slides) {
            shape = new CShape(presentation.Slides[presentation.CurPage]);
        } else {
            shape = new CShape(presentation);
        }
        shape.setTxBody(new CTextBody(shape));
        var count = stream.GetULong() / 100000;
        var newDocContent = new CDocumentContent(shape.txBody, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, false);
        var elements = [],
        paragraph,
        selectedElement;
        for (var i = 0; i < count; ++i) {
            loader.stream.Skip2(1);
            paragraph = loader.ReadParagraph(newDocContent);
            selectedElement = new CSelectedElement();
            selectedElement.Element = paragraph;
            elements.push(selectedElement);
        }
        return elements;
    },
    ReadPresentationShapes: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_shapes = [];
        var arr_transforms = [];
        var cStyle;
        for (var i = 0; i < count; ++i) {
            loader.TempMainObject = presentation && presentation.Slides ? presentation.Slides[presentation.CurPage] : presentation;
            var style_index = null;
            if (!loader.stream.GetBool()) {
                if (loader.stream.GetBool()) {
                    if (!g_bIsDocumentCopyPaste) {
                        loader.stream.Skip2(1);
                        loader.stream.SkipRecord();
                    } else {
                        loader.stream.Skip2(1);
                        cStyle = loader.ReadTableStyle();
                    }
                    loader.stream.GetBool();
                    style_index = stream.GetString2();
                }
            }
            var drawing = loader.ReadGraphicObject();
            var x = stream.GetULong() / 100000;
            var y = stream.GetULong() / 100000;
            var extX = stream.GetULong() / 100000;
            var extY = stream.GetULong() / 100000;
            var base64 = stream.GetString2();
            if (presentation.Slides) {
                arr_shapes[i] = new DrawingCopyObject();
            } else {
                arr_shapes[i] = {};
            }
            arr_shapes[i].Drawing = drawing;
            arr_shapes[i].X = x;
            arr_shapes[i].Y = y;
            arr_shapes[i].ExtX = extX;
            arr_shapes[i].ExtY = extY;
            if (!presentation.Slides) {
                arr_shapes[i].base64 = base64;
            }
            if (style_index != null && arr_shapes[i].Drawing.graphicObject && arr_shapes[i].Drawing.graphicObject.Set_TableStyle) {
                if (!g_bIsDocumentCopyPaste) {
                    arr_shapes[i].Drawing.graphicObject.Set_TableStyle(style_index);
                } else {
                    if (cStyle) {}
                }
            }
        }
        return {
            arrShapes: arr_shapes,
            arrImages: loader.End_UseFullUrl(),
            arrTransforms: arr_transforms
        };
    },
    ReadPresentationSlides: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_slides = [];
        var slide;
        for (var i = 0; i < count; ++i) {
            slide = new SlideCopyObject();
            slide.Slide = loader.ReadSlide(0);
            arr_slides.push(slide);
        }
        return arr_slides;
    },
    ReadSlide: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        return loader.ReadSlide(0);
    },
    _Prepeare: function (node, fCallback) {
        var oThis = this;
        if (true == this.bUploadImage || true == this.bUploadFonts) {
            var aPrepeareFonts = this._Prepeare_recursive(node, true, true);
            var aImagesToDownload = [];
            for (var image in this.oImages) {
                var src = this.oImages[image];
                if (0 == src.indexOf("file:")) {
                    this.oImages[image] = "local";
                } else {
                    if (false == (0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                        aImagesToDownload.push(src);
                    }
                }
            }
            var oPrepeareImages = {};
            if (aImagesToDownload.length > 0) {
                var rData = {
                    "id": documentId,
                    "c": "imgurls",
                    "vkey": documentVKey,
                    "data": JSON.stringify(aImagesToDownload)
                };
                oThis.api.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                sendCommand(this.api, function (incomeObject) {
                    if (incomeObject && "imgurls" == incomeObject.type) {
                        var oFromTo = JSON.parse(incomeObject.data);
                        for (var i = 0, length = aImagesToDownload.length; i < length; ++i) {
                            var sFrom = aImagesToDownload[i];
                            var sTo = oFromTo[sFrom];
                            if (sTo) {
                                oThis.oImages[sFrom] = sTo;
                                oPrepeareImages[i] = sTo;
                            }
                        }
                    }
                    oThis.api.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                    oThis.api.pre_Paste(aPrepeareFonts, oPrepeareImages, fCallback);
                },
                rData);
            } else {
                this.api.pre_Paste(aPrepeareFonts, this.oImages, fCallback);
            }
        } else {
            fCallback();
        }
    },
    _Prepeare_recursive: function (node, bIgnoreStyle, isCheckFonts) {
        var nodeName = node.nodeName.toLowerCase();
        var nodeType = node.nodeType;
        if (!bIgnoreStyle) {
            if (Node.TEXT_NODE == nodeType) {
                var computedStyle = this._getComputedStyle(node.parentNode);
                if (computedStyle) {
                    var fontFamily = computedStyle.getPropertyValue("font-family");
                    this.oFonts[fontFamily] = {
                        Name: g_fontApplication.GetFontNameDictionary(fontFamily, true),
                        Index: -1
                    };
                }
            } else {
                var src = node.getAttribute("src");
                if (src) {
                    this.oImages[src] = src;
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var child_nodeType = child.nodeType;
            if (! (Node.ELEMENT_NODE == child_nodeType || Node.TEXT_NODE == child_nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            this._Prepeare_recursive(child, false);
        }
        if (isCheckFonts) {
            var aPrepeareFonts = [];
            for (var font_family in this.oFonts) {
                var oFontItem = this.oFonts[font_family];
                this.oFonts[font_family].Index = -1;
                aPrepeareFonts.push(new CFont(oFontItem.Name, 0, "", 0));
            }
            return aPrepeareFonts;
        }
    },
    _checkFontsOnLoad: function (fonts) {
        if (!fonts) {
            return;
        }
        return fonts;
    },
    _IsBlockElem: function (name) {
        if ("p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "tbody" == name || "tr" == name || "td" == name || "th" == name || "h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name) {
            return true;
        }
        return false;
    },
    _getComputedStyle: function (node) {
        var computedStyle = null;
        if (null != node && Node.ELEMENT_NODE == node.nodeType) {
            var defaultView = node.ownerDocument.defaultView;
            computedStyle = defaultView.getComputedStyle(node, null);
        }
        return computedStyle;
    },
    _ValueToMm: function (value) {
        var obj = this._ValueToMmType(value);
        if (obj && "%" != obj.type && "none" != obj.type) {
            return obj.val;
        }
        return null;
    },
    _ValueToMmType: function (value) {
        var oVal = parseFloat(value);
        var oType;
        if (!isNaN(oVal)) {
            if (-1 != value.indexOf("%")) {
                oType = "%";
                oVal /= 100;
            } else {
                if (-1 != value.indexOf("px")) {
                    oType = "px";
                    oVal *= g_dKoef_pix_to_mm;
                } else {
                    if (-1 != value.indexOf("in")) {
                        oType = "in";
                        oVal *= g_dKoef_in_to_mm;
                    } else {
                        if (-1 != value.indexOf("cm")) {
                            oType = "cm";
                            oVal *= 10;
                        } else {
                            if (-1 != value.indexOf("mm")) {
                                oType = "mm";
                            } else {
                                if (-1 != value.indexOf("pt")) {
                                    oType = "pt";
                                    oVal *= g_dKoef_pt_to_mm;
                                } else {
                                    if (-1 != value.indexOf("pc")) {
                                        oType = "pc";
                                        oVal *= g_dKoef_pc_to_mm;
                                    } else {
                                        oType = "none";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                val: oVal,
                type: oType
            };
        }
        return null;
    },
    _ParseColor: function (color) {
        if (!color || color.length == 0) {
            return null;
        }
        if ("transparent" == color) {
            return null;
        }
        if ("aqua" == color) {
            return new CDocumentColor(0, 255, 255);
        } else {
            if ("black" == color) {
                return new CDocumentColor(0, 0, 0);
            } else {
                if ("blue" == color) {
                    return new CDocumentColor(0, 0, 255);
                } else {
                    if ("fuchsia" == color) {
                        return new CDocumentColor(255, 0, 255);
                    } else {
                        if ("gray" == color) {
                            return new CDocumentColor(128, 128, 128);
                        } else {
                            if ("green" == color) {
                                return new CDocumentColor(0, 128, 0);
                            } else {
                                if ("lime" == color) {
                                    return new CDocumentColor(0, 255, 0);
                                } else {
                                    if ("maroon" == color) {
                                        return new CDocumentColor(128, 0, 0);
                                    } else {
                                        if ("navy" == color) {
                                            return new CDocumentColor(0, 0, 128);
                                        } else {
                                            if ("olive" == color) {
                                                return new CDocumentColor(128, 128, 0);
                                            } else {
                                                if ("purple" == color) {
                                                    return new CDocumentColor(128, 0, 128);
                                                } else {
                                                    if ("red" == color) {
                                                        return new CDocumentColor(255, 0, 0);
                                                    } else {
                                                        if ("silver" == color) {
                                                            return new CDocumentColor(192, 192, 192);
                                                        } else {
                                                            if ("teal" == color) {
                                                                return new CDocumentColor(0, 128, 128);
                                                            } else {
                                                                if ("white" == color) {
                                                                    return new CDocumentColor(255, 255, 255);
                                                                } else {
                                                                    if ("yellow" == color) {
                                                                        return new CDocumentColor(255, 255, 0);
                                                                    } else {
                                                                        if (0 == color.indexOf("#")) {
                                                                            var hex = color.substring(1);
                                                                            if (hex.length == 3) {
                                                                                hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
                                                                            }
                                                                            if (hex.length == 6) {
                                                                                var r = parseInt("0x" + hex.substring(0, 2));
                                                                                var g = parseInt("0x" + hex.substring(2, 4));
                                                                                var b = parseInt("0x" + hex.substring(4, 6));
                                                                                return new CDocumentColor(r, g, b);
                                                                            }
                                                                        }
                                                                        if (0 == color.indexOf("rgb")) {
                                                                            var nStart = color.indexOf("(");
                                                                            var nEnd = color.indexOf(")");
                                                                            if (-1 != nStart && -1 != nEnd && nStart < nEnd) {
                                                                                var temp = color.substring(nStart + 1, nEnd);
                                                                                var aParems = temp.split(",");
                                                                                if (aParems.length >= 3) {
                                                                                    if (aParems.length >= 4) {
                                                                                        var oA = this._ValueToMmType(aParems[3]);
                                                                                        if (0 == oA.val) {
                                                                                            return null;
                                                                                        }
                                                                                    }
                                                                                    var oR = this._ValueToMmType(aParems[0]);
                                                                                    var oG = this._ValueToMmType(aParems[1]);
                                                                                    var oB = this._ValueToMmType(aParems[2]);
                                                                                    var r, g, b;
                                                                                    if (oR && "%" == oR.type) {
                                                                                        r = parseInt(255 * oR.val / 100);
                                                                                    } else {
                                                                                        r = oR.val;
                                                                                    }
                                                                                    if (oG && "%" == oG.type) {
                                                                                        g = parseInt(255 * oG.val / 100);
                                                                                    } else {
                                                                                        g = oG.val;
                                                                                    }
                                                                                    if (oB && "%" == oB.type) {
                                                                                        b = parseInt(255 * oB.val / 100);
                                                                                    } else {
                                                                                        b = oB.val;
                                                                                    }
                                                                                    return new CDocumentColor(r, g, b);
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
        return null;
    },
    _isEmptyProperty: function (prop) {
        var bIsEmpty = true;
        for (var i in prop) {
            if (null != prop[i]) {
                bIsEmpty = false;
                break;
            }
        }
        return bIsEmpty;
    },
    _set_pPr: function (node, Para, pNoHtmlPr) {
        var sNodeName = node.nodeName.toLowerCase();
        if (node != this.oRootNode) {
            while (false == this._IsBlockElem(sNodeName)) {
                if (this.oRootNode != node.parentNode) {
                    node = node.parentNode;
                    sNodeName = node.nodeName.toLowerCase();
                } else {
                    break;
                }
            }
        }
        if ("td" == sNodeName || "th" == sNodeName) {
            var oNewSpacing = new CParaSpacing();
            oNewSpacing.Set_FromObject({
                After: 0,
                Before: 0,
                Line: linerule_Auto
            });
            Para.Set_Spacing(oNewSpacing);
            return;
        }
        var oDocument = this.oDocument;
        if (null != pNoHtmlPr.hLevel && oDocument.Styles) {
            Para.Style_Add(oDocument.Styles.Get_Default_Heading(pNoHtmlPr.hLevel));
        }
        var pPr = Para.Pr;
        var oNewBorder = {
            Left: null,
            Top: null,
            Right: null,
            Bottom: null,
            Between: null
        };
        var sBorder = pNoHtmlPr["mso-border-alt"];
        if (null != sBorder) {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Left = oNewBrd;
            oNewBorder.Top = oNewBrd.Copy();
            oNewBorder.Right = oNewBrd.Copy();
            oNewBorder.Bottom = oNewBrd.Copy();
        } else {
            sBorder = pNoHtmlPr["mso-border-left-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Left = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-top-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Top = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-right-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Right = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-bottom-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Bottom = oNewBrd;
            }
        }
        sBorder = pNoHtmlPr["mso-border-between"];
        if (null != sBorder) {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Between = oNewBrd;
        }
        var computedStyle = this._getComputedStyle(node);
        if (computedStyle) {
            var Ind = new CParaInd();
            var margin_left = computedStyle.getPropertyValue("margin-left");
            if (margin_left && null != (margin_left = this._ValueToMm(margin_left))) {
                Ind.Left = margin_left;
            }
            var margin_right = computedStyle.getPropertyValue("margin-right");
            if (margin_right && null != (margin_right = this._ValueToMm(margin_right))) {
                Ind.Right = margin_right;
            }
            if (null != Ind.Left && null != Ind.Right) {
                var dif = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - Ind.Right;
                if (dif < 30) {
                    Ind.Right = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - 30;
                }
            }
            var text_indent = computedStyle.getPropertyValue("text-indent");
            if (text_indent && null != (text_indent = this._ValueToMm(text_indent))) {
                Ind.FirstLine = text_indent;
            }
            if (false == this._isEmptyProperty(Ind)) {
                Para.Set_Ind(Ind);
            }
            var text_align = computedStyle.getPropertyValue("text-align");
            if (text_align) {
                var Jc = null;
                if (-1 != text_align.indexOf("center")) {
                    Jc = align_Center;
                } else {
                    if (-1 != text_align.indexOf("right")) {
                        Jc = align_Right;
                    } else {
                        if (-1 != text_align.indexOf("justify")) {
                            Jc = align_Justify;
                        }
                    }
                }
                if (null != Jc) {
                    Para.Set_Align(Jc, false);
                }
            }
            var Spacing = new CParaSpacing();
            var margin_top = computedStyle.getPropertyValue("margin-top");
            if (margin_top && null != (margin_top = this._ValueToMm(margin_top))) {
                Spacing.Before = margin_top;
            }
            var margin_bottom = computedStyle.getPropertyValue("margin-bottom");
            if (margin_bottom && null != (margin_bottom = this._ValueToMm(margin_bottom))) {
                Spacing.After = margin_bottom;
            }
            if (false == this._isEmptyProperty(Spacing)) {
                Para.Set_Spacing(Spacing);
            }
            var background_color = null;
            var oTempNode = node;
            while (true) {
                var tempComputedStyle = this._getComputedStyle(oTempNode);
                if (null == tempComputedStyle) {
                    break;
                }
                background_color = tempComputedStyle.getPropertyValue("background-color");
                if (null != background_color && (background_color = this._ParseColor(background_color))) {
                    break;
                }
                oTempNode = oTempNode.parentNode;
                if (this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase() || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase())) {
                    break;
                }
            }
            if (g_bIsDocumentCopyPaste) {
                if (background_color) {
                    var Shd = new CDocumentShd();
                    Shd.Value = shd_Clear;
                    Shd.Color = background_color;
                    Para.Set_Shd(Shd);
                }
            }
            if (null == oNewBorder.Left) {
                oNewBorder.Left = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            }
            if (null == oNewBorder.Top) {
                oNewBorder.Top = this._ExecuteBorder(computedStyle, node, "top", "Top", false);
            }
            if (null == oNewBorder.Right) {
                oNewBorder.Right = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            }
            if (null == oNewBorder.Bottom) {
                oNewBorder.Bottom = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", false);
            }
        }
        if (false == this._isEmptyProperty(oNewBorder)) {
            Para.Set_Borders(oNewBorder);
        }
        var pagination = pNoHtmlPr["mso-pagination"];
        if (pagination) {
            if ("none" == pagination) {} else {
                if (-1 != pagination.indexOf("widow-orphan") && -1 != pagination.indexOf("lines-together")) {
                    Para.Set_KeepLines(true);
                } else {
                    if (-1 != pagination.indexOf("none") && -1 != pagination.indexOf("lines-together")) {
                        Para.Set_KeepLines(true);
                    }
                }
            }
        }
        if ("avoid" == pNoHtmlPr["page-break-after"]) {}
        if ("always" == pNoHtmlPr["page-break-before"]) {
            Para.Set_PageBreakBefore(true);
        }
        var tab_stops = pNoHtmlPr["tab-stops"];
        if (tab_stops && "" != pNoHtmlPr["tab-stops"]) {
            var aTabs = tab_stops.split(" ");
            var nTabLen = aTabs.length;
            if (nTabLen > 0) {
                var Tabs = new CParaTabs();
                for (var i = 0; i < nTabLen; i++) {
                    var val = this._ValueToMm(aTabs[i]);
                    if (val) {
                        Tabs.Add(new CParaTab(tab_Left, val));
                    }
                }
                Para.Set_Tabs(Tabs);
            }
        }
        if (g_bIsDocumentCopyPaste) {
            if (true == pNoHtmlPr.bNum) {
                var num = numbering_numfmt_Bullet;
                if (null != pNoHtmlPr.numType) {
                    num = pNoHtmlPr.numType;
                }
                var type = pNoHtmlPr["list-style-type"];
                if (type) {
                    switch (type) {
                    case "disc":
                        num = numbering_numfmt_Bullet;
                        break;
                    case "decimal":
                        num = numbering_numfmt_Decimal;
                        break;
                    case "lower-roman":
                        num = numbering_numfmt_LowerRoman;
                        break;
                    case "upper-roman":
                        num = numbering_numfmt_UpperRoman;
                        break;
                    case "lower-alpha":
                        num = numbering_numfmt_LowerLetter;
                        break;
                    case "upper-alpha":
                        num = numbering_numfmt_UpperLetter;
                        break;
                    }
                }
                var NumId = null;
                if (this.aContent.length > 1) {
                    var prevElem = this.aContent[this.aContent.length - 2];
                    if (null != prevElem && type_Paragraph === prevElem.GetType()) {
                        var PrevNumPr = prevElem.Numbering_Get();
                        if (null != PrevNumPr && true === this.oLogicDocument.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, num)) {
                            NumId = PrevNumPr.NumId;
                        }
                    }
                }
                if (null == NumId && this.pasteInExcel !== true) {
                    NumId = this.oLogicDocument.Numbering.Create_AbstractNum();
                    var AbstractNum = this.oLogicDocument.Numbering.Get_AbstractNum(NumId);
                    AbstractNum.Create_Default_Bullet();
                    switch (num) {
                    case numbering_numfmt_Decimal:
                        AbstractNum.Set_Lvl_Numbered_2(0);
                        break;
                    case numbering_numfmt_LowerRoman:
                        AbstractNum.Set_Lvl_Numbered_5(0);
                        break;
                    case numbering_numfmt_UpperRoman:
                        AbstractNum.Set_Lvl_Numbered_9(0);
                        break;
                    case numbering_numfmt_LowerLetter:
                        AbstractNum.Set_Lvl_Numbered_8(0);
                        break;
                    case numbering_numfmt_UpperLetter:
                        AbstractNum.Set_Lvl_Numbered_6(0);
                        break;
                    }
                    var oFirstTextChild = node;
                    while (true) {
                        var bContinue = false;
                        for (var i = 0, length = oFirstTextChild.childNodes.length; i < length; i++) {
                            var child = oFirstTextChild.childNodes[i];
                            var nodeType = child.nodeType;
                            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                                continue;
                            }
                            if (Node.TEXT_NODE == child.nodeType) {
                                var value = child.nodeValue;
                                if (!value) {
                                    continue;
                                }
                                value = value.replace(/(\r|\t|\n)/g, "");
                                if ("" == value) {
                                    continue;
                                }
                            }
                            if (Node.ELEMENT_NODE == nodeType) {
                                oFirstTextChild = child;
                                bContinue = true;
                                break;
                            }
                        }
                        if (false == bContinue) {
                            break;
                        }
                    }
                    if (node != oFirstTextChild) {
                        if (!this.bIsPlainText) {
                            var oLvl = AbstractNum.Lvl[0];
                            var oTextPr = this._read_rPr(oFirstTextChild);
                            if (numbering_numfmt_Bullet == num) {
                                oTextPr.RFonts = oLvl.TextPr.RFonts.Copy();
                            }
                            AbstractNum.Apply_TextPr(0, oTextPr);
                        }
                    }
                }
                if (this.pasteInExcel !== true && Para.bFromDocument === true) {
                    Para.Numbering_Add(NumId, 0);
                }
            } else {
                var numPr = Para.Numbering_Get();
                if (numPr) {
                    Para.Numbering_Remove();
                }
            }
        } else {
            if (true == pNoHtmlPr.bNum) {
                var num = numbering_presentationnumfrmt_Char;
                if (null != pNoHtmlPr.numType) {
                    num = pNoHtmlPr.numType;
                }
                var type = pNoHtmlPr["list-style-type"];
                if (type) {
                    switch (type) {
                    case "disc":
                        num = numbering_presentationnumfrmt_Char;
                        break;
                    case "decimal":
                        num = numbering_presentationnumfrmt_ArabicPeriod;
                        break;
                    case "lower-roman":
                        num = numbering_presentationnumfrmt_RomanLcPeriod;
                        break;
                    case "upper-roman":
                        num = numbering_presentationnumfrmt_RomanUcPeriod;
                        break;
                    case "lower-alpha":
                        num = numbering_presentationnumfrmt_AlphaLcPeriod;
                        break;
                    case "upper-alpha":
                        num = numbering_presentationnumfrmt_AlphaUcPeriod;
                        break;
                    default:
                        num = numbering_presentationnumfrmt_Char;
                    }
                }
                var _bullet = new CPresentationBullet();
                _bullet.m_nType = num;
                if (num == numbering_presentationnumfrmt_Char) {
                    _bullet.m_sChar = "�";
                }
                _bullet.m_nStartAt = 1;
                Para.Add_PresentationNumbering2(_bullet);
            } else {
                Para.Remove_PresentationNumbering();
            }
        }
        Para.CompiledPr.NeedRecalc = true;
    },
    _commit_rPr: function (node, bUseOnlyInherit) {
        if (!this.bIsPlainText) {
            var rPr = this._read_rPr(node, bUseOnlyInherit);
            var tempRpr;
            if (this.pasteInExcel === true && this.oDocument && this.oDocument.Parent && this.oDocument.Parent.parent && this.oDocument.Parent.parent.getObjectType() == historyitem_type_Shape) {
                tempRpr = new CTextPr();
                tempRpr.Underline = rPr.Underline;
                tempRpr.Bold = rPr.Bold;
                tempRpr.Italic = rPr.Italic;
                rPr = tempRpr;
            }
            if (false == Common_CmpObj2(this.oCur_rPr, rPr)) {
                this._Set_Run_Pr(rPr);
                this.oCur_rPr = rPr;
            }
        }
    },
    _read_rPr: function (node, bUseOnlyInherit) {
        var oDocument = this.oDocument;
        var rPr = new CTextPr();
        if (false == g_bIsDocumentCopyPaste) {
            rPr.Set_FromObject({
                Bold: false,
                Italic: false,
                Underline: false,
                Strikeout: false,
                RFonts: {
                    Ascii: {
                        Name: "Arial",
                        Index: -1
                    },
                    EastAsia: {
                        Name: "Arial",
                        Index: -1
                    },
                    HAnsi: {
                        Name: "Arial",
                        Index: -1
                    },
                    CS: {
                        Name: "Arial",
                        Index: -1
                    }
                },
                FontSize: 11,
                Color: {
                    r: 0,
                    g: 0,
                    b: 0
                },
                VertAlign: vertalign_Baseline,
                HighLight: highlight_None
            });
        }
        var computedStyle = this._getComputedStyle(node);
        if (computedStyle) {
            var font_family = computedStyle.getPropertyValue("font-family");
            if (font_family && "" != font_family) {
                var oFontItem = this.oFonts[font_family];
                if (null != oFontItem && null != oFontItem.Name) {
                    rPr.RFonts.Ascii = {
                        Name: oFontItem.Name,
                        Index: oFontItem.Index
                    };
                    rPr.RFonts.HAnsi = {
                        Name: oFontItem.Name,
                        Index: oFontItem.Index
                    };
                    rPr.RFonts.CS = {
                        Name: oFontItem.Name,
                        Index: oFontItem.Index
                    };
                    rPr.RFonts.EastAsia = {
                        Name: oFontItem.Name,
                        Index: oFontItem.Index
                    };
                }
            }
            var font_size = node.style.fontSize;
            if (!font_size) {
                font_size = computedStyle.getPropertyValue("font-size");
            }
            if (font_size) {
                var obj = this._ValueToMmType(font_size);
                if (obj && "%" != obj.type && "none" != obj.type) {
                    font_size = obj.val;
                    if ("px" == obj.type && false == this.bIsDoublePx) {
                        font_size = Math.round(font_size * g_dKoef_mm_to_pt);
                    } else {
                        font_size = Math.round(2 * font_size * g_dKoef_mm_to_pt) / 2;
                    }
                    rPr.FontSize = font_size;
                }
            }
            var font_weight = computedStyle.getPropertyValue("font-weight");
            if (font_weight) {
                if ("bold" == font_weight || "bolder" == font_weight || 400 < font_weight) {
                    rPr.Bold = true;
                }
            }
            var font_style = computedStyle.getPropertyValue("font-style");
            if ("italic" == font_style) {
                rPr.Italic = true;
            }
            var color = computedStyle.getPropertyValue("color");
            if (color && (color = this._ParseColor(color))) {
                rPr.Color = color;
            }
            var background_color = null;
            var underline = null;
            var Strikeout = null;
            var vertical_align = null;
            var oTempNode = node;
            while (true != bUseOnlyInherit && true) {
                var tempComputedStyle = this._getComputedStyle(oTempNode);
                if (null == tempComputedStyle) {
                    break;
                }
                if (null == underline || null == Strikeout) {
                    var text_decoration = tempComputedStyle.getPropertyValue("text-decoration");
                    if (text_decoration) {
                        if (-1 != text_decoration.indexOf("underline")) {
                            underline = true;
                        } else {
                            if (-1 != text_decoration.indexOf("none") && node.parentElement && node.parentElement.nodeName.toLowerCase() == "a") {
                                underline = false;
                            }
                        }
                        if (-1 != text_decoration.indexOf("line-through")) {
                            Strikeout = true;
                        }
                    }
                }
                if (null == background_color) {
                    background_color = tempComputedStyle.getPropertyValue("background-color");
                    if (background_color) {
                        background_color = this._ParseColor(background_color);
                    } else {
                        background_color = null;
                    }
                }
                if (null == vertical_align || "baseline" == vertical_align) {
                    vertical_align = tempComputedStyle.getPropertyValue("vertical-align");
                    if (!vertical_align) {
                        vertical_align = null;
                    }
                }
                if (vertical_align && background_color && Strikeout && underline) {
                    break;
                }
                oTempNode = oTempNode.parentNode;
                if (this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase() || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase())) {
                    break;
                }
            }
            if (g_bIsDocumentCopyPaste) {
                if (background_color) {
                    rPr.HighLight = background_color;
                }
            } else {
                delete rPr.HighLight;
            }
            if (null != underline) {
                rPr.Underline = underline;
            }
            if (null != Strikeout) {
                rPr.Strikeout = Strikeout;
            }
            switch (vertical_align) {
            case "sub":
                rPr.VertAlign = vertalign_SubScript;
                break;
            case "super":
                rPr.VertAlign = vertalign_SuperScript;
                break;
            }
        }
        return rPr;
    },
    _parseCss: function (sStyles, pPr) {
        var aStyles = sStyles.split(";");
        if (aStyles) {
            for (var i = 0, length = aStyles.length; i < length; i++) {
                var style = aStyles[i];
                var aPair = style.split(":");
                if (aPair && aPair.length > 1) {
                    var prop_name = trimString(aPair[0]);
                    var prop_value = trimString(aPair[1]);
                    if (null != this.MsoStyles[prop_name]) {
                        pPr[prop_name] = prop_value;
                    }
                }
            }
        }
    },
    _PrepareContent: function () {
        if (this.aContent.length > 0) {
            var last = this.aContent[this.aContent.length - 1];
            if (type_Table == last.GetType()) {
                this._Add_NewParagraph();
            }
        }
    },
    _AddNextPrevToContent: function (oDoc) {
        var prev = null;
        for (var i = 0, length = this.aContent.length; i < length; ++i) {
            var cur = this.aContent[i];
            cur.Set_DocumentPrev(prev);
            cur.Parent = oDoc;
            if (prev) {
                prev.Set_DocumentNext(cur);
            }
            prev = cur;
        }
    },
    _Set_Run_Pr: function (oPr) {
        this._CommitRunToParagraph(false);
        if (null != this.oCurRun) {
            this.oCurRun.Set_Pr(oPr);
        }
    },
    _CommitRunToParagraph: function (bCreateNew) {
        if (bCreateNew || this.oCurRun.Content.length > 0) {
            this.oCurRun = new ParaRun(this.oCurPar);
            this.oCurRunContentPos = 0;
        }
    },
    _CommitElemToParagraph: function (elem) {
        if (null != this.oCurHyperlink) {
            this.oCurHyperlink.Add_ToContent(this.oCurHyperlinkContentPos, elem, false);
            this.oCurHyperlinkContentPos++;
        } else {
            this.oCurPar.Internal_Content_Add(this.oCurParContentPos, elem, false);
            this.oCurParContentPos++;
        }
    },
    _Paragraph_Add: function (elem) {
        if (null != this.oCurRun) {
            if (para_Hyperlink == elem.Type) {
                this._CommitRunToParagraph(true);
                this._CommitElemToParagraph(elem);
            } else {
                this.oCurRun.Add_ToContent(this.oCurRunContentPos, elem, false);
                this.oCurRunContentPos++;
                if (1 == this.oCurRun.Content.length) {
                    this._CommitElemToParagraph(this.oCurRun);
                }
            }
        }
    },
    _Add_NewParagraph: function () {
        var bFromPresentation = false;
        if (this.pasteInPresentationShape) {
            bFromPresentation = true;
        }
        this.oCurPar = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 50, 50, X_Right_Field, Y_Bottom_Field, this.oDocument.bPresentation === true);
        this.oCurParContentPos = this.oCurPar.CurPos.ContentPos;
        this.oCurRun = new ParaRun(this.oCurPar);
        this.oCurRunContentPos = 0;
        this.aContent.push(this.oCurPar);
        this.oCur_rPr = new CTextPr();
    },
    _Execute_AddParagraph: function (node, pPr) {
        this._Add_NewParagraph();
        this._set_pPr(node, this.oCurPar, pPr);
    },
    _Decide_AddParagraph: function (node, pPr, bParagraphAdded, bCommitBr) {
        if (true == bParagraphAdded) {
            if (false != bCommitBr) {
                this._Commit_Br(2, node, pPr);
            }
            this._Execute_AddParagraph(node, pPr);
        } else {
            if (false != bCommitBr) {
                this._Commit_Br(0, node, pPr);
            }
        }
        return false;
    },
    _Commit_Br: function (nIgnore, node, pPr) {
        for (var i = 0, length = this.nBrCount - nIgnore; i < length; i++) {
            if ("always" == pPr["mso-column-break-before"]) {
                this._Paragraph_Add(new ParaNewLine(break_Page));
            } else {
                if (this.bInBlock) {
                    this._Paragraph_Add(new ParaNewLine(break_Line));
                } else {
                    this._Execute_AddParagraph(node, pPr);
                }
            }
        }
        this.nBrCount = 0;
    },
    _StartExecuteTable: function (node, pPr) {
        var oDocument = this.oDocument;
        var tableNode = node;
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            if ("tbody" == node.childNodes[i].nodeName.toLowerCase()) {
                node = node.childNodes[i];
                break;
            }
        }
        var nRowCount = 0;
        var nMinColCount = 0;
        var nMaxColCount = 0;
        var aColsCountByRow = [];
        var oRowSums = {};
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = {};
        var fParseSpans = function () {
            var spans = oRowSpans[nCurColWidth];
            while (null != spans && spans.row > 0) {
                spans.row--;
                nCurColWidth += spans.col;
                nCurSum += spans.width;
                spans = oRowSpans[nCurColWidth];
            }
        };
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
                nCurSum = 0;
                nCurColWidth = 0;
                var nMinRowSpanCount = null;
                for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                    var tc = tr.childNodes[j];
                    var tcName = tc.nodeName.toLowerCase();
                    if ("td" == tcName || "th" == tcName) {
                        fParseSpans();
                        var dWidth = null;
                        var computedStyle = this._getComputedStyle(tc);
                        if (computedStyle) {
                            var computedWidth = computedStyle.getPropertyValue("width");
                            if (null != computedWidth && null != (computedWidth = this._ValueToMm(computedWidth))) {
                                dWidth = computedWidth;
                            }
                        }
                        if (null == dWidth) {
                            dWidth = tc.clientWidth * g_dKoef_pix_to_mm;
                        }
                        var nColSpan = tc.getAttribute("colspan");
                        if (null != nColSpan) {
                            nColSpan = nColSpan - 0;
                        } else {
                            nColSpan = 1;
                        }
                        var nCurRowSpan = tc.getAttribute("rowspan");
                        if (null != nCurRowSpan) {
                            nCurRowSpan = nCurRowSpan - 0;
                            if (null == nMinRowSpanCount) {
                                nMinRowSpanCount = nCurRowSpan;
                            } else {
                                if (nMinRowSpanCount > nCurRowSpan) {
                                    nMinRowSpanCount = nCurRowSpan;
                                }
                            }
                            if (nCurRowSpan > 1) {
                                oRowSpans[nCurColWidth] = {
                                    row: nCurRowSpan - 1,
                                    col: nColSpan,
                                    width: dWidth
                                };
                            }
                        } else {
                            nMinRowSpanCount = 0;
                        }
                        nCurSum += dWidth;
                        if (null == oRowSums[nCurColWidth + nColSpan]) {
                            oRowSums[nCurColWidth + nColSpan] = nCurSum;
                        }
                        nCurColWidth += nColSpan;
                    }
                }
                fParseSpans();
                if (nMinRowSpanCount > 1) {
                    for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                        var tc = tr.childNodes[j];
                        var tcName = tc.nodeName.toLowerCase();
                        if ("td" == tcName || "th" == tcName) {
                            var nCurRowSpan = tc.getAttribute("rowspan");
                            if (null != nCurRowSpan) {
                                tc.setAttribute("rowspan", nCurRowSpan - nMinRowSpanCount);
                            }
                        }
                    }
                }
                if (dMaxSum < nCurSum) {
                    dMaxSum = nCurSum;
                }
                if (0 == nCurColWidth) {
                    node.removeChild(tr);
                    length--;
                    i--;
                } else {
                    if (0 == nMinColCount || nMinColCount > nCurColWidth) {
                        nMinColCount = nCurColWidth;
                    }
                    if (nMaxColCount < nCurColWidth) {
                        nMaxColCount = nCurColWidth;
                    }
                    nRowCount++;
                    aColsCountByRow.push(nCurColWidth);
                }
            }
        }
        if (nMaxColCount != nMinColCount) {
            for (var i = 0, length = aColsCountByRow.length; i < length; ++i) {
                aColsCountByRow[i] = nMaxColCount - aColsCountByRow[i];
            }
        }
        if (nRowCount > 0 && nMaxColCount > 0) {
            var bUseScaleKoef = this.bUseScaleKoef;
            var dScaleKoef = this.dScaleKoef;
            if (dMaxSum * dScaleKoef > this.dMaxWidth) {
                dScaleKoef = dScaleKoef * this.dMaxWidth / dMaxSum;
                bUseScaleKoef = true;
            }
            var aGrid = [];
            var nPrevIndex = null;
            var nPrevVal = 0;
            for (var i in oRowSums) {
                var nCurIndex = i - 0;
                var nCurVal = oRowSums[i];
                var nCurWidth = nCurVal - nPrevVal;
                if (bUseScaleKoef) {
                    nCurWidth *= dScaleKoef;
                }
                if (null != nPrevIndex) {
                    var nDif = nCurIndex - nPrevIndex;
                    if (1 == nDif) {
                        aGrid.push(nCurWidth);
                    } else {
                        var nPartVal = nCurWidth / nDif;
                        for (var i = 0; i < nDif; ++i) {
                            aGrid.push(nPartVal);
                        }
                    }
                }
                nPrevVal = nCurVal;
                nPrevIndex = nCurIndex;
            }
            var CurPage = 0;
            var table = new CTable(oDocument.DrawingDocument, oDocument, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid);
            var aSumGrid = [];
            aSumGrid[-1] = 0;
            var nSum = 0;
            for (var i = 0, length = aGrid.length; i < length; ++i) {
                nSum += aGrid[i];
                aSumGrid[i] = nSum;
            }
            this._ExecuteTable(tableNode, node, table, aSumGrid, nMaxColCount != nMinColCount ? aColsCountByRow : null, pPr, bUseScaleKoef, dScaleKoef);
            table.Cursor_MoveToStartPos();
            this.aContent.push(table);
        }
    },
    _ExecuteBorder: function (computedStyle, node, type, type2, bAddIfNull) {
        var res = null;
        var style = computedStyle.getPropertyValue("border-" + type + "-style");
        if (null != style) {
            res = new CDocumentBorder();
            if ("none" == style) {
                res.Value = border_None;
            } else {
                res.Value = border_Single;
                var width = node.style["border" + type2 + "Width"];
                if (!width) {
                    computedStyle.getPropertyValue("border-" + type + "-width");
                }
                if (null != width && null != (width = this._ValueToMm(width))) {
                    res.Size = width;
                }
                var color = computedStyle.getPropertyValue("border-" + type + "-color");
                if (null != color && (color = this._ParseColor(color))) {
                    res.Color = color;
                }
            }
        }
        if (bAddIfNull && null == res) {
            res = new CDocumentBorder();
        }
        return res;
    },
    _ExecuteParagraphBorder: function (border) {
        var res = this.oBorderCache[border];
        if (null != res) {
            return res.Copy();
        } else {
            res = new CDocumentBorder();
            var oTestDiv = document.createElement("div");
            oTestDiv.setAttribute("style", "border-left:" + border);
            document.body.appendChild(oTestDiv);
            var computedStyle = this._getComputedStyle(oTestDiv);
            if (null != computedStyle) {
                res = this._ExecuteBorder(computedStyle, oTestDiv, "left", "Left", true);
            }
            document.body.removeChild(oTestDiv);
            this.oBorderCache[border] = res;
            return res;
        }
    },
    _ExecuteTable: function (tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef) {
        table.Set_TableLayout(tbllayout_Fixed);
        var Pr = table.Pr;
        var sTableAlign = null;
        if (null != tableNode.align) {
            sTableAlign = tableNode.align;
        } else {
            if (null != tableNode.parentNode && this.oRootNode != tableNode.parentNode) {
                var computedStyleParent = this._getComputedStyle(tableNode.parentNode);
                if (null != computedStyleParent) {
                    sTableAlign = computedStyleParent.getPropertyValue("text-align");
                }
            }
        }
        if (null != sTableAlign) {
            if (-1 != sTableAlign.indexOf("center")) {
                table.Set_TableAlign(align_Center);
            } else {
                if (-1 != sTableAlign.indexOf("right")) {
                    table.Set_TableAlign(align_Right);
                }
            }
        }
        var spacing = null;
        table.Set_TableBorder_InsideH(new CDocumentBorder());
        table.Set_TableBorder_InsideV(new CDocumentBorder());
        var style = tableNode.getAttribute("style");
        if (style) {
            var tblPrMso = {};
            this._parseCss(style, tblPrMso);
            var spacing = tblPrMso["mso-cellspacing"];
            if (null != spacing && null != (spacing = this._ValueToMm(spacing))) {}
            var padding = tblPrMso["mso-padding-alt"];
            if (null != padding) {
                padding = trimString(padding);
                var aMargins = padding.split(" ");
                if (4 == aMargins.length) {
                    var top = aMargins[0];
                    if (null != top && null != (top = this._ValueToMm(top))) {} else {
                        top = Pr.TableCellMar.Top.W;
                    }
                    var right = aMargins[1];
                    if (null != right && null != (right = this._ValueToMm(right))) {} else {
                        right = Pr.TableCellMar.Right.W;
                    }
                    var bottom = aMargins[2];
                    if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {} else {
                        bottom = Pr.TableCellMar.Bottom.W;
                    }
                    var left = aMargins[3];
                    if (null != left && null != (left = this._ValueToMm(left))) {} else {
                        left = Pr.TableCellMar.Left.W;
                    }
                    table.Set_TableCellMar(left, top, right, bottom);
                }
            }
            var insideh = tblPrMso["mso-border-insideh"];
            if (null != insideh) {
                table.Set_TableBorder_InsideH(this._ExecuteParagraphBorder(insideh));
            }
            var insidev = tblPrMso["mso-border-insidev"];
            if (null != insidev) {
                table.Set_TableBorder_InsideV(this._ExecuteParagraphBorder(insidev));
            }
        }
        var computedStyle = this._getComputedStyle(tableNode);
        if (computedStyle) {
            if (align_Left == table.Get_TableAlign()) {
                var margin_left = computedStyle.getPropertyValue("margin-left");
                if (margin_left && null != (margin_left = this._ValueToMm(margin_left)) && margin_left < Page_Width - X_Left_Margin) {
                    table.Set_TableInd(margin_left);
                }
            }
            var background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                table.Set_TableShd(shd_Clear, background_color.r, background_color.g, background_color.b);
            }
            var oLeftBorder = this._ExecuteBorder(computedStyle, tableNode, "left", "Left", false);
            if (null != oLeftBorder) {
                table.Set_TableBorder_Left(oLeftBorder);
            }
            var oTopBorder = this._ExecuteBorder(computedStyle, tableNode, "top", "Top", false);
            if (null != oTopBorder) {
                table.Set_TableBorder_Top(oTopBorder);
            }
            var oRightBorder = this._ExecuteBorder(computedStyle, tableNode, "right", "Right", false);
            if (null != oRightBorder) {
                table.Set_TableBorder_Right(oRightBorder);
            }
            var oBottomBorder = this._ExecuteBorder(computedStyle, tableNode, "bottom", "Bottom", false);
            if (null != oBottomBorder) {
                table.Set_TableBorder_Bottom(oBottomBorder);
            }
            if (null == spacing) {
                spacing = computedStyle.getPropertyValue("padding");
                if (!spacing) {
                    spacing = tableNode.style.padding;
                }
                if (!spacing) {
                    spacing = null;
                }
                if (spacing && null != (spacing = this._ValueToMm(spacing))) {}
            }
        }
        var oRowSpans = {};
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase() && tr.childNodes && tr.childNodes.length) {
                var row = table.Internal_Add_Row(table.Content.length, 0);
                this._ExecuteTableRow(tr, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef);
            }
        }
    },
    _ExecuteTableRow: function (node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef) {
        var oThis = this;
        var table = row.Table;
        if (null != spacing && spacing >= tableSpacingMinValue) {
            row.Set_CellSpacing(spacing);
        }
        if (node.style.height) {
            var height = node.style.height;
            if (! ("auto" == height || "inherit" == height || -1 != height.indexOf("%")) && null != (height = this._ValueToMm(height))) {
                row.Set_Height(height, heightrule_AtLeast);
            }
        }
        var bBefore = false;
        var bAfter = false;
        var style = node.getAttribute("style");
        if (null != style) {
            var tcPr = {};
            this._parseCss(style, tcPr);
            var margin_left = tcPr["mso-row-margin-left"];
            if (margin_left && null != (margin_left = this._ValueToMm(margin_left))) {
                bBefore = true;
            }
            var margin_right = tcPr["mso-row-margin-right"];
            if (margin_right && null != (margin_right = this._ValueToMm(margin_right))) {
                bAfter = true;
            }
        }
        var nCellIndex = 0;
        var nCellIndexSpan = 0;
        var fParseSpans = function () {
            var spans = oRowSpans[nCellIndexSpan];
            while (null != spans) {
                var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                oCurCell.Set_VMerge(vmerge_Continue);
                if (spans.col > 1) {
                    oCurCell.Set_GridSpan(spans.col);
                }
                spans.row--;
                if (spans.row <= 0) {
                    delete oRowSpans[nCellIndexSpan];
                }
                nCellIndexSpan += spans.col;
                spans = oRowSpans[nCellIndexSpan];
            }
        };
        var oBeforeCell = null;
        var oAfterCell = null;
        if (bBefore || bAfter) {
            for (var i = 0, length = node.childNodes.length; i < length; ++i) {
                var tc = node.childNodes[i];
                var tcName = tc.nodeName.toLowerCase();
                if ("td" == tcName || "th" == tcName) {
                    if (bBefore && null != oBeforeCell) {
                        oBeforeCell = tc;
                    } else {
                        if (bAfter) {
                            oAfterCell = tc;
                        }
                    }
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            fParseSpans();
            var tc = node.childNodes[i];
            var tcName = tc.nodeName.toLowerCase();
            if ("td" == tcName || "th" == tcName) {
                var nColSpan = tc.getAttribute("colspan");
                if (null != nColSpan) {
                    nColSpan = nColSpan - 0;
                } else {
                    nColSpan = 1;
                }
                if (tc == oBeforeCell) {
                    row.Set_Before(nColSpan);
                } else {
                    if (tc == oAfterCell) {
                        row.Set_After(nColSpan);
                    } else {
                        var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                        if (nColSpan > 1) {
                            oCurCell.Set_GridSpan(nColSpan);
                        }
                        var width = aSumGrid[nCellIndexSpan + nColSpan - 1] - aSumGrid[nCellIndexSpan - 1];
                        oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, width));
                        var nRowSpan = tc.getAttribute("rowspan");
                        if (null != nRowSpan) {
                            nRowSpan = nRowSpan - 0;
                        } else {
                            nRowSpan = 1;
                        }
                        if (nRowSpan > 1) {
                            oRowSpans[nCellIndexSpan] = {
                                row: nRowSpan - 1,
                                col: nColSpan
                            };
                        }
                        this._ExecuteTableCell(tc, oCurCell, bUseScaleKoef, dScaleKoef, spacing);
                    }
                }
                nCellIndexSpan += nColSpan;
            }
        }
        fParseSpans();
    },
    _ExecuteTableCell: function (node, cell, bUseScaleKoef, dScaleKoef, spacing) {
        var Pr = cell.Pr;
        var bAddIfNull = false;
        if (null != spacing) {
            bAddIfNull = true;
        }
        var computedStyle = this._getComputedStyle(node);
        if (null != computedStyle) {
            var background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                var Shd = new CDocumentShd();
                Shd.Value = shd_Clear;
                Shd.Color = background_color;
                cell.Set_Shd(Shd);
            }
            var border = this._ExecuteBorder(computedStyle, node, "left", "Left", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 3);
            }
            var border = this._ExecuteBorder(computedStyle, node, "top", "Top", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 0);
            }
            var border = this._ExecuteBorder(computedStyle, node, "right", "Right", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 1);
            }
            var border = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 2);
            }
            var top = computedStyle.getPropertyValue("padding-top");
            if (null != top && null != (top = this._ValueToMm(top))) {
                cell.Set_Margins({
                    W: top,
                    Type: tblwidth_Mm
                },
                0);
            }
            var right = computedStyle.getPropertyValue("padding-right");
            if (null != right && null != (right = this._ValueToMm(right))) {
                cell.Set_Margins({
                    W: right,
                    Type: tblwidth_Mm
                },
                1);
            }
            var bottom = computedStyle.getPropertyValue("padding-bottom");
            if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {
                cell.Set_Margins({
                    W: bottom,
                    Type: tblwidth_Mm
                },
                2);
            }
            var left = computedStyle.getPropertyValue("padding-left");
            if (null != left && null != (left = this._ValueToMm(left))) {
                cell.Set_Margins({
                    W: left,
                    Type: tblwidth_Mm
                },
                3);
            }
        }
        var oPasteProcessor = new PasteProcessor(this.api, false, false, true);
        oPasteProcessor.oFonts = this.oFonts;
        oPasteProcessor.oImages = this.oImages;
        oPasteProcessor.oDocument = cell.Content;
        oPasteProcessor.bIgnoreNoBlockText = true;
        oPasteProcessor.dMaxWidth = this._CalcMaxWidthByCell(cell);
        if (true == bUseScaleKoef) {
            oPasteProcessor.bUseScaleKoef = bUseScaleKoef;
            oPasteProcessor.dScaleKoef = dScaleKoef;
        }
        oPasteProcessor._Execute(node, {},
        true, true, false);
        oPasteProcessor._PrepareContent();
        oPasteProcessor._AddNextPrevToContent(cell.Content);
        if (0 == oPasteProcessor.aContent.length) {
            var oDocContent = cell.Content;
            var oNewPar = new Paragraph(oDocContent.DrawingDocument, oDocContent, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
            var oNewSpacing = new CParaSpacing();
            oNewSpacing.Set_FromObject({
                After: 0,
                Before: 0,
                Line: linerule_Auto
            });
            oNewPar.Set_Spacing(oNewSpacing);
            oPasteProcessor.aContent.push(oNewPar);
        }
        for (var i = 0, length = oPasteProcessor.aContent.length; i < length; ++i) {
            if (i == length - 1) {
                cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i], true);
            } else {
                cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i], false);
            }
        }
        cell.Content.Internal_Content_Remove(0, 1);
    },
    _CheckIsPlainText: function (node) {
        var bIsPlainText = true;
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            if (Node.ELEMENT_NODE == child.nodeType) {
                var sClass = child.getAttribute("class");
                var sStyle = child.getAttribute("style");
                if (sClass || sStyle) {
                    bIsPlainText = false;
                    break;
                } else {
                    if (!this._CheckIsPlainText(child)) {
                        bIsPlainText = false;
                        break;
                    }
                }
            }
        }
        return bIsPlainText;
    },
    _Execute: function (node, pPr, bRoot, bAddParagraph, bInBlock) {
        var oDocument = this.oDocument;
        var bRootHasBlock = false;
        if (true == bRoot) {
            var bExist = false;
            for (var i = 0, length = node.childNodes.length; i < length; i++) {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if (true == bIsBlockChild) {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if (false == bExist && true == this.bIgnoreNoBlockText) {
                this.bIgnoreNoBlockText = false;
            }
        } else {
            if (Node.TEXT_NODE == node.nodeType) {
                if (false == this.bIgnoreNoBlockText || true == bInBlock) {
                    var value = node.nodeValue;
                    if (!value) {
                        value = "";
                    }
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, "");
                    value = value.replace(/(\r|\t|\n)/g, " ");
                    if (value.length > 0) {
                        var oTargetNode = node.parentNode;
                        var bUseOnlyInherit = false;
                        if (this._IsBlockElem(oTargetNode.nodeName.toLowerCase())) {
                            bUseOnlyInherit = true;
                        }
                        bAddParagraph = this._Decide_AddParagraph(oTargetNode, pPr, bAddParagraph);
                        this._commit_rPr(oTargetNode, bUseOnlyInherit);
                        for (var i = 0, length = value.length; i < length; i++) {
                            var nUnicode = null;
                            var nCharCode = value.charCodeAt(i);
                            if (isLeadingSurrogateChar(nCharCode)) {
                                if (i + 1 < length) {
                                    i++;
                                    var nTrailingChar = value.charCodeAt(i);
                                    nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
                                }
                            } else {
                                nUnicode = nCharCode;
                            }
                            if (null != nUnicode) {
                                var Item;
                                if (32 != nUnicode && 160 != nUnicode) {
                                    Item = new ParaText();
                                    Item.Set_CharCode(nUnicode);
                                } else {
                                    Item = new ParaSpace();
                                }
                                this._Paragraph_Add(Item);
                            }
                        }
                    }
                }
                return bAddParagraph;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if ("table" == sNodeName && this.pasteInExcel !== true && this.pasteInPresentationShape !== true) {
                if (g_bIsDocumentCopyPaste) {
                    this._StartExecuteTable(node, pPr);
                    return bAddParagraph;
                } else {
                    return false;
                }
            }
            var style = node.getAttribute("style");
            if (style) {
                this._parseCss(style, pPr);
            }
            if ("h1" == sNodeName) {
                pPr.hLevel = 0;
            } else {
                if ("h2" == sNodeName) {
                    pPr.hLevel = 1;
                } else {
                    if ("h3" == sNodeName) {
                        pPr.hLevel = 2;
                    } else {
                        if ("h4" == sNodeName) {
                            pPr.hLevel = 3;
                        } else {
                            if ("h5" == sNodeName) {
                                pPr.hLevel = 4;
                            } else {
                                if ("h6" == sNodeName) {
                                    pPr.hLevel = 5;
                                }
                            }
                        }
                    }
                }
            }
            if ("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName) {
                pPr.bNum = true;
                if (g_bIsDocumentCopyPaste) {
                    if ("ul" == sNodeName) {
                        pPr.numType = numbering_numfmt_Bullet;
                    } else {
                        if ("ol" == sNodeName) {
                            pPr.numType = numbering_numfmt_Decimal;
                        }
                    }
                } else {
                    if ("ul" == sNodeName) {
                        pPr.numType = numbering_presentationnumfrmt_Char;
                    } else {
                        if ("ol" == sNodeName) {
                            pPr.numType = numbering_presentationnumfrmt_ArabicPeriod;
                        }
                    }
                }
            }
            if ("img" == sNodeName && this.pasteInExcel !== true) {
                if (g_bIsDocumentCopyPaste) {
                    bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);
                    var nWidth = parseInt(node.getAttribute("width"));
                    var nHeight = parseInt(node.getAttribute("height"));
                    if (!nWidth || !nHeight) {
                        var computedStyle = this._getComputedStyle(node);
                        if (computedStyle) {
                            nWidth = parseInt(computedStyle.getPropertyValue("width"));
                            nHeight = parseInt(computedStyle.getPropertyValue("height"));
                        }
                    }
                    var sSrc = node.getAttribute("src");
                    if (isNaN(nWidth) || isNaN(nHeight) || !(typeof nWidth === "number") || !(typeof nHeight === "number") || nWidth === 0 || nHeight === 0) {
                        var img_prop = new CImgProperty();
                        img_prop.put_ImageUrl(sSrc);
                        var or_sz = img_prop.get_OriginSize(editor);
                        nWidth = or_sz.Width / g_dKoef_pix_to_mm;
                        nHeight = or_sz.Height / g_dKoef_pix_to_mm;
                    }
                    if (nWidth && nHeight && sSrc) {
                        var sSrc = this.oImages[sSrc];
                        if (sSrc) {
                            nWidth = nWidth * g_dKoef_pix_to_mm;
                            nHeight = nHeight * g_dKoef_pix_to_mm;
                            var bUseScaleKoef = this.bUseScaleKoef;
                            var dScaleKoef = this.dScaleKoef;
                            if (nWidth * dScaleKoef > this.dMaxWidth) {
                                dScaleKoef = dScaleKoef * this.dMaxWidth / nWidth;
                                bUseScaleKoef = true;
                            }
                            var oTargetDocument = this.oDocument;
                            var oDrawingDocument = this.oDocument.DrawingDocument;
                            if (oTargetDocument && oDrawingDocument) {
                                var Drawing = CreateImageFromBinary(sSrc, nWidth, nHeight);
                                this._Paragraph_Add(Drawing);
                            }
                        }
                    }
                    return bAddParagraph;
                } else {
                    return false;
                }
            }
            var bPageBreakBefore = "always" == node.style.pageBreakBefore || "left" == node.style.pageBreakBefore || "right" == node.style.pageBreakBefore;
            if ("br" == sNodeName || bPageBreakBefore) {
                if (bPageBreakBefore) {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);
                    bAddParagraph = true;
                    this._Commit_Br(0, node, pPr);
                    this._Paragraph_Add(new ParaNewLine(break_Page));
                } else {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph, false);
                    this.nBrCount++;
                    if ("line-break" == pPr["mso-special-character"] || "always" == pPr["mso-column-break-before"]) {
                        this._Commit_Br(0, node, pPr);
                    }
                    return bAddParagraph;
                }
            }
            if ("span" == sNodeName) {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if (nTabCount > 0) {
                    bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);
                    this._commit_rPr(node);
                    for (var i = 0; i < nTabCount; i++) {
                        this._Paragraph_Add(new ParaTab());
                    }
                    return bAddParagraph;
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            if (Node.COMMENT_NODE == nodeType) {
                var value = child.nodeValue;
                var bSkip = false;
                if (value) {
                    if (-1 != value.indexOf("supportLists")) {
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if (-1 != value.indexOf("supportLineBreakNewLine")) {
                        bSkip = true;
                    }
                }
                if (true == bSkip) {
                    var j = i + 1;
                    for (; j < length; j++) {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if (Node.COMMENT_NODE == tempNodeType) {
                            var tempvalue = tempNode.nodeValue;
                            if (tempvalue && -1 != tempvalue.indexOf("endif")) {
                                break;
                            }
                        }
                    }
                    i = j;
                    continue;
                }
            }
            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            var sChildNodeName = child.nodeName.toLowerCase();
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if (bRoot) {
                this.bInBlock = false;
            }
            if (bIsBlockChild) {
                bAddParagraph = true;
                this.bInBlock = true;
            }
            var oOldHyperlink = null;
            var oOldHyperlinkContentPos = null;
            var oHyperlink = null;
            if ("a" == sChildNodeName) {
                var href = child.href;
                if (null != href) {
                    var sDecoded;
                    try {
                        sDecoded = decodeURI(href);
                    } catch(e) {
                        sDecoded = href;
                    }
                    href = sDecoded;
                    if (href && href.length > 0) {
                        var title = child.getAttribute("title");
                        bAddParagraph = this._Decide_AddParagraph(child, pPr, bAddParagraph);
                        oHyperlink = new ParaHyperlink();
                        oHyperlink.Set_Paragraph(this.oCurPar);
                        oHyperlink.Set_Value(href);
                        if (null != title) {
                            oHyperlink.Set_ToolTip(title);
                        }
                        oOldHyperlink = this.oCurHyperlink;
                        oOldHyperlinkContentPos = this.oCurHyperlinkContentPos;
                        this.oCurHyperlink = oHyperlink;
                        this.oCurHyperlinkContentPos = 0;
                    }
                }
            }
            bAddParagraph = this._Execute(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock);
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
            if ("a" == sChildNodeName && null != oHyperlink) {
                this.oCurHyperlink = oOldHyperlink;
                this.oCurHyperlinkContentPos = oOldHyperlinkContentPos;
                if (oHyperlink.Content.length > 0) {
                    if (this.pasteInExcel) {
                        var TextPr = new CTextPr();
                        TextPr.Unifill = CreateUniFillSchemeColorWidthTint(11, 0);
                        TextPr.Underline = true;
                        oHyperlink.Apply_TextPr(TextPr, undefined, true);
                    }
                    if (oHyperlink.Content && oHyperlink.Content.length && oHyperlink.Paragraph.bFromDocument) {
                        if (this.oLogicDocument && this.oLogicDocument.Styles && this.oLogicDocument.Styles.Default && this.oLogicDocument.Styles.Default.Hyperlink && this.oLogicDocument.Styles.Style) {
                            var hyperLinkStyle = this.oLogicDocument.Styles.Default.Hyperlink;
                            for (var k = 0; k < oHyperlink.Content.length; k++) {
                                if (oHyperlink.Content[k].Type == para_Run) {
                                    oHyperlink.Content[k].Set_RStyle(hyperLinkStyle);
                                }
                            }
                        }
                    }
                    this._Paragraph_Add(oHyperlink);
                }
            }
        }
        if (bRoot) {
            this._Commit_Br(2, node, pPr);
        }
        return bAddParagraph;
    },
    _ExecutePresentation: function (node, pPr, bRoot, bAddParagraph, bInBlock, arrShapes, arrImages, arrTables) {
        var arr_shapes = [];
        var arr_images = [];
        var arr_tables = [];
        var oDocument = this.oDocument;
        var bRootHasBlock = false;
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape = arrShapes[arrShapes.length - 1];
        this.aContent = shape.txBody.content.Content;
        if (true == bRoot) {
            var bExist = false;
            for (var i = 0, length = node.childNodes.length; i < length; i++) {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if (true == bIsBlockChild) {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if (false == bExist && true == this.bIgnoreNoBlockText) {
                this.bIgnoreNoBlockText = false;
            }
        } else {
            if (Node.TEXT_NODE == node.nodeType) {
                if (false == this.bIgnoreNoBlockText || true == bInBlock) {
                    var value = node.nodeValue;
                    if (!value) {
                        value = "";
                    }
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, "");
                    value = value.replace(/(\r|\t|\n)/g, " ");
                    if (value.length > 0) {
                        this.oDocument = shape.txBody.content;
                        if (bAddParagraph) {
                            shape.txBody.content.Add_NewParagraph();
                        }
                        if (!this.bIsPlainText) {
                            var rPr = this._read_rPr(node.parentNode);
                            var Item = new ParaTextPr(rPr);
                            shape.paragraphAdd(Item);
                        }
                        for (var i = 0, length = value.length; i < length; i++) {
                            var nUnicode = null;
                            var nCharCode = value.charCodeAt(i);
                            if (isLeadingSurrogateChar(nCharCode)) {
                                if (i + 1 < length) {
                                    i++;
                                    var nTrailingChar = value.charCodeAt(i);
                                    nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
                                }
                            } else {
                                nUnicode = nCharCode;
                            }
                            if (null != nUnicode) {
                                var Item;
                                if (32 != nUnicode && 160 != nUnicode) {
                                    Item = new ParaText();
                                    Item.Value = nUnicode;
                                } else {
                                    Item = new ParaSpace();
                                }
                                shape.paragraphAdd(Item);
                            }
                        }
                    }
                }
                return;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if ("table" == sNodeName) {
                this._StartExecuteTablePresentation(node, pPr, arrShapes, arrImages, arrTables);
                return;
            }
            var style = node.getAttribute("style");
            if (style) {
                this._parseCss(style, pPr);
            }
            if ("h1" == sNodeName) {
                pPr.hLevel = 0;
            } else {
                if ("h2" == sNodeName) {
                    pPr.hLevel = 1;
                } else {
                    if ("h3" == sNodeName) {
                        pPr.hLevel = 2;
                    } else {
                        if ("h4" == sNodeName) {
                            pPr.hLevel = 3;
                        } else {
                            if ("h5" == sNodeName) {
                                pPr.hLevel = 4;
                            } else {
                                if ("h6" == sNodeName) {
                                    pPr.hLevel = 5;
                                }
                            }
                        }
                    }
                }
            }
            if ("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName) {
                pPr.bNum = true;
                if (g_bIsDocumentCopyPaste) {
                    if ("ul" == sNodeName) {
                        pPr.numType = numbering_numfmt_Bullet;
                    } else {
                        if ("ol" == sNodeName) {
                            pPr.numType = numbering_numfmt_Decimal;
                        }
                    }
                } else {
                    if ("ul" == sNodeName) {
                        pPr.numType = numbering_presentationnumfrmt_Char;
                    } else {
                        if ("ol" == sNodeName) {
                            pPr.numType = numbering_presentationnumfrmt_ArabicPeriod;
                        }
                    }
                }
            }
            if ("img" == sNodeName) {
                var nWidth = parseInt(node.getAttribute("width"));
                var nHeight = parseInt(node.getAttribute("height"));
                if (!nWidth || !nHeight) {
                    var computedStyle = this._getComputedStyle(node);
                    if (computedStyle) {
                        nWidth = parseInt(computedStyle.getPropertyValue("width"));
                        nHeight = parseInt(computedStyle.getPropertyValue("height"));
                    }
                }
                var sSrc = node.getAttribute("src");
                if (isNaN(nWidth) || isNaN(nHeight) || !(typeof nWidth === "number") || !(typeof nHeight === "number") || nWidth === 0 || nHeight === 0) {
                    var img_prop = new CImgProperty();
                    img_prop.put_ImageUrl(sSrc);
                    var or_sz = img_prop.get_OriginSize(editor);
                    nWidth = or_sz.Width / g_dKoef_pix_to_mm;
                    nHeight = or_sz.Height / g_dKoef_pix_to_mm;
                } else {
                    nWidth *= g_dKoef_pix_to_mm;
                    nHeight *= g_dKoef_pix_to_mm;
                }
                if (nWidth && nHeight && sSrc) {
                    var sSrc = this.oImages[sSrc];
                    if (sSrc) {
                        var image = DrawingObjectsController.prototype.createImage(sSrc, 0, 0, nWidth, nHeight);
                        arrImages.push(image);
                    }
                }
                return bAddParagraph;
            }
            if ("br" == sNodeName || "always" == node.style.pageBreakBefore) {
                if ("always" == node.style.pageBreakBefore) {
                    shape.paragraphAdd(new ParaNewLine(break_Line));
                } else {
                    shape.paragraphAdd(new ParaNewLine(break_Line));
                }
            }
            if ("span" == sNodeName) {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if (nTabCount > 0) {
                    if (!this.bIsPlainText) {
                        var rPr = this._read_rPr(node);
                        var Item = new ParaTextPr(rPr);
                        shape.paragraphAdd(Item);
                    }
                    for (var i = 0; i < nTabCount; i++) {
                        shape.paragraphAdd(new ParaTab());
                    }
                    return;
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            if (Node.COMMENT_NODE == nodeType) {
                var value = child.nodeValue;
                var bSkip = false;
                if (value) {
                    if (-1 != value.indexOf("supportLists")) {
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if (-1 != value.indexOf("supportLineBreakNewLine")) {
                        bSkip = true;
                    }
                }
                if (true == bSkip) {
                    var j = i + 1;
                    for (; j < length; j++) {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if (Node.COMMENT_NODE == tempNodeType) {
                            var tempvalue = tempNode.nodeValue;
                            if (tempvalue && -1 != tempvalue.indexOf("endif")) {
                                break;
                            }
                        }
                    }
                    i = j;
                    continue;
                }
            }
            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            var sChildNodeName = child.nodeName.toLowerCase();
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if (bRoot) {
                this.bInBlock = false;
            }
            if (bIsBlockChild) {
                bAddParagraph = true;
                this.bInBlock = true;
            }
            var bHyperlink = false;
            var isPasteHyperlink = null;
            if ("a" == sChildNodeName) {
                var href = child.href;
                if (null != href) {
                    var sDecoded;
                    try {
                        sDecoded = decodeURI(href);
                    } catch(e) {
                        sDecoded = href;
                    }
                    href = sDecoded;
                    bHyperlink = true;
                    var title = child.getAttribute("title");
                    this.oDocument = shape.txBody.content;
                    var Pos = (true == this.oDocument.Selection.Use ? this.oDocument.Selection.StartPos : this.oDocument.CurPos.ContentPos);
                    isPasteHyperlink = node.getElementsByTagName("img");
                    var text = null;
                    if (isPasteHyperlink && isPasteHyperlink.length) {
                        isPasteHyperlink = null;
                    } else {
                        text = child.innerText ? child.innerText : child.textContent;
                    }
                    if (isPasteHyperlink) {
                        var HyperProps = new CHyperlinkProperty({
                            Text: text,
                            Value: href,
                            ToolTip: title
                        });
                        this.oDocument.Content[Pos].Hyperlink_Add(HyperProps);
                    }
                }
            }
            if (!isPasteHyperlink) {
                bAddParagraph = this._ExecutePresentation(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock, arrShapes, arrImages, arrTables);
            }
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
        }
        if (bRoot) {}
        return bAddParagraph;
    },
    _StartExecuteTablePresentation: function (node, pPr, arrShapes, arrImages, arrTables) {
        var oDocument = this.oDocument;
        var tableNode = node;
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            if ("tbody" == node.childNodes[i].nodeName.toLowerCase()) {
                node = node.childNodes[i];
                break;
            }
        }
        var nRowCount = 0;
        var nMinColCount = 0;
        var nMaxColCount = 0;
        var aColsCountByRow = [];
        var oRowSums = {};
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = {};
        var fParseSpans = function () {
            var spans = oRowSpans[nCurColWidth];
            while (null != spans && spans.row > 0) {
                spans.row--;
                nCurColWidth += spans.col;
                nCurSum += spans.width;
                spans = oRowSpans[nCurColWidth];
            }
        };
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
                nCurSum = 0;
                nCurColWidth = 0;
                var nMinRowSpanCount = null;
                for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                    var tc = tr.childNodes[j];
                    var tcName = tc.nodeName.toLowerCase();
                    if ("td" == tcName || "th" == tcName) {
                        fParseSpans();
                        var dWidth = null;
                        var computedStyle = this._getComputedStyle(tc);
                        if (computedStyle) {
                            var computedWidth = computedStyle.getPropertyValue("width");
                            if (null != computedWidth && null != (computedWidth = this._ValueToMm(computedWidth))) {
                                dWidth = computedWidth;
                            }
                        }
                        if (null == dWidth) {
                            dWidth = tc.clientWidth * g_dKoef_pix_to_mm;
                        }
                        var nColSpan = tc.getAttribute("colspan");
                        if (null != nColSpan) {
                            nColSpan = nColSpan - 0;
                        } else {
                            nColSpan = 1;
                        }
                        var nCurRowSpan = tc.getAttribute("rowspan");
                        if (null != nCurRowSpan) {
                            nCurRowSpan = nCurRowSpan - 0;
                            if (null == nMinRowSpanCount) {
                                nMinRowSpanCount = nCurRowSpan;
                            } else {
                                if (nMinRowSpanCount > nCurRowSpan) {
                                    nMinRowSpanCount = nCurRowSpan;
                                }
                            }
                            if (nCurRowSpan > 1) {
                                oRowSpans[nCurColWidth] = {
                                    row: nCurRowSpan - 1,
                                    col: nColSpan,
                                    width: dWidth
                                };
                            }
                        } else {
                            nMinRowSpanCount = 0;
                        }
                        nCurSum += dWidth;
                        if (null == oRowSums[nCurColWidth + nColSpan]) {
                            oRowSums[nCurColWidth + nColSpan] = nCurSum;
                        }
                        nCurColWidth += nColSpan;
                    }
                }
                fParseSpans();
                if (nMinRowSpanCount > 1) {
                    for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                        var tc = tr.childNodes[j];
                        var tcName = tc.nodeName.toLowerCase();
                        if ("td" == tcName || "th" == tcName) {
                            var nCurRowSpan = tc.getAttribute("rowspan");
                            if (null != nCurRowSpan) {
                                tc.setAttribute("rowspan", nCurRowSpan - nMinRowSpanCount);
                            }
                        }
                    }
                }
                if (dMaxSum < nCurSum) {
                    dMaxSum = nCurSum;
                }
                if (0 == nCurColWidth) {
                    node.removeChild(tr);
                    length--;
                    i--;
                } else {
                    if (0 == nMinColCount || nMinColCount > nCurColWidth) {
                        nMinColCount = nCurColWidth;
                    }
                    if (nMaxColCount < nCurColWidth) {
                        nMaxColCount = nCurColWidth;
                    }
                    nRowCount++;
                    aColsCountByRow.push(nCurColWidth);
                }
            }
        }
        if (nMaxColCount != nMinColCount) {
            for (var i = 0, length = aColsCountByRow.length; i < length; ++i) {
                aColsCountByRow[i] = nMaxColCount - aColsCountByRow[i];
            }
        }
        if (nRowCount > 0 && nMaxColCount > 0) {
            var bUseScaleKoef = this.bUseScaleKoef;
            var dScaleKoef = this.dScaleKoef;
            if (dMaxSum * dScaleKoef > this.dMaxWidth) {
                dScaleKoef = dScaleKoef * this.dMaxWidth / dMaxSum;
                bUseScaleKoef = true;
            }
            var aGrid = [];
            var nPrevIndex = null;
            var nPrevVal = 0;
            for (var i in oRowSums) {
                var nCurIndex = i - 0;
                var nCurVal = oRowSums[i];
                var nCurWidth = nCurVal - nPrevVal;
                if (bUseScaleKoef) {
                    nCurWidth *= dScaleKoef;
                }
                if (null != nPrevIndex) {
                    var nDif = nCurIndex - nPrevIndex;
                    if (1 == nDif) {
                        aGrid.push(nCurWidth);
                    } else {
                        var nPartVal = nCurWidth / nDif;
                        for (var i = 0; i < nDif; ++i) {
                            aGrid.push(nPartVal);
                        }
                    }
                }
                nPrevVal = nCurVal;
                nPrevIndex = nCurIndex;
            }
            var CurPage = 0;
            var presentation = editor.WordControl.m_oLogicDocument;
            var graphicFrame = new CGraphicFrame(presentation.Slides[presentation.CurPage]);
            var table = new CTable(presentation.DrawingDocument, graphicFrame, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid, true);
            table.Set_TableStyle(0);
            var dd = editor.WordControl.m_oDrawingDocument;
            graphicFrame.setGraphicObject(table);
            graphicFrame.setNvSpPr(new UniNvPr());
            arrTables.push(graphicFrame);
            var aSumGrid = [];
            aSumGrid[-1] = 0;
            var nSum = 0;
            for (var i = 0, length = aGrid.length; i < length; ++i) {
                nSum += aGrid[i];
                aSumGrid[i] = nSum;
            }
            this._ExecuteTablePresentation(tableNode, node, table, aSumGrid, nMaxColCount != nMinColCount ? aColsCountByRow : null, pPr, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables);
            table.Cursor_MoveToStartPos();
            return;
        }
    },
    _ExecuteTablePresentation: function (tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables) {
        table.Set_TableLayout(tbllayout_Fixed);
        var Pr = table.Pr;
        var sTableAlign = null;
        if (null != tableNode.align) {
            sTableAlign = tableNode.align;
        } else {
            if (null != tableNode.parentNode && this.oRootNode != tableNode.parentNode) {
                var computedStyleParent = this._getComputedStyle(tableNode.parentNode);
                if (null != computedStyleParent) {
                    sTableAlign = computedStyleParent.getPropertyValue("text-align");
                }
            }
        }
        if (null != sTableAlign) {
            if (-1 != sTableAlign.indexOf("center")) {
                table.Set_TableAlign(align_Center);
            } else {
                if (-1 != sTableAlign.indexOf("right")) {
                    table.Set_TableAlign(align_Right);
                }
            }
        }
        var spacing = null;
        table.Set_TableBorder_InsideH(new CDocumentBorder());
        table.Set_TableBorder_InsideV(new CDocumentBorder());
        var style = tableNode.getAttribute("style");
        if (style) {
            var tblPrMso = {};
            this._parseCss(style, tblPrMso);
            var spacing = tblPrMso["mso-cellspacing"];
            if (null != spacing && null != (spacing = this._ValueToMm(spacing))) {}
            var padding = tblPrMso["mso-padding-alt"];
            if (null != padding) {
                padding = trimString(padding);
                var aMargins = padding.split(" ");
                if (4 == aMargins.length) {
                    var top = aMargins[0];
                    if (null != top && null != (top = this._ValueToMm(top))) {} else {
                        top = Pr.TableCellMar.Top.W;
                    }
                    var right = aMargins[1];
                    if (null != right && null != (right = this._ValueToMm(right))) {} else {
                        right = Pr.TableCellMar.Right.W;
                    }
                    var bottom = aMargins[2];
                    if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {} else {
                        bottom = Pr.TableCellMar.Bottom.W;
                    }
                    var left = aMargins[3];
                    if (null != left && null != (left = this._ValueToMm(left))) {} else {
                        left = Pr.TableCellMar.Left.W;
                    }
                    table.Set_TableCellMar(left, top, right, bottom);
                }
            }
            var insideh = tblPrMso["mso-border-insideh"];
            if (null != insideh) {
                table.Set_TableBorder_InsideH(this._ExecuteParagraphBorder(insideh));
            }
            var insidev = tblPrMso["mso-border-insidev"];
            if (null != insidev) {
                table.Set_TableBorder_InsideV(this._ExecuteParagraphBorder(insidev));
            }
        }
        var computedStyle = this._getComputedStyle(tableNode);
        if (computedStyle) {
            if (align_Left == table.Get_TableAlign()) {
                var margin_left = computedStyle.getPropertyValue("margin-left");
                if (margin_left && null != (margin_left = this._ValueToMm(margin_left)) && margin_left < Page_Width - X_Left_Margin) {
                    table.Set_TableInd(margin_left);
                }
            }
            var background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                table.Set_TableShd(shd_Clear, background_color.r, background_color.g, background_color.b);
            }
            var oLeftBorder = this._ExecuteBorder(computedStyle, tableNode, "left", "Left", false);
            if (null != oLeftBorder) {
                table.Set_TableBorder_Left(oLeftBorder);
            }
            var oTopBorder = this._ExecuteBorder(computedStyle, tableNode, "top", "Top", false);
            if (null != oTopBorder) {
                table.Set_TableBorder_Top(oTopBorder);
            }
            var oRightBorder = this._ExecuteBorder(computedStyle, tableNode, "right", "Right", false);
            if (null != oRightBorder) {
                table.Set_TableBorder_Right(oRightBorder);
            }
            var oBottomBorder = this._ExecuteBorder(computedStyle, tableNode, "bottom", "Bottom", false);
            if (null != oBottomBorder) {
                table.Set_TableBorder_Bottom(oBottomBorder);
            }
            if (null == spacing) {
                spacing = computedStyle.getPropertyValue("padding");
                if (!spacing) {
                    spacing = tableNode.style.padding;
                }
                if (!spacing) {
                    spacing = null;
                }
                if (spacing && null != (spacing = this._ValueToMm(spacing))) {}
            }
        }
        var oRowSpans = {};
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
                var row = table.Internal_Add_Row(table.Content.length, 0);
                this._ExecuteTableRowPresentation(tr, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables);
            }
        }
    },
    _ExecuteTableRowPresentation: function (node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables) {
        var oThis = this;
        var table = row.Table;
        if (null != spacing) {
            row.Set_CellSpacing(spacing);
        }
        if (node.style.height) {
            var height = node.style.height;
            if (! ("auto" == height || "inherit" == height || -1 != height.indexOf("%")) && null != (height = this._ValueToMm(height))) {
                row.Set_Height(height, heightrule_AtLeast);
            }
        }
        var bBefore = false;
        var bAfter = false;
        var style = node.getAttribute("style");
        if (null != style) {
            var tcPr = {};
            this._parseCss(style, tcPr);
            var margin_left = tcPr["mso-row-margin-left"];
            if (margin_left && null != (margin_left = this._ValueToMm(margin_left))) {
                bBefore = true;
            }
            var margin_right = tcPr["mso-row-margin-right"];
            if (margin_right && null != (margin_right = this._ValueToMm(margin_right))) {
                bAfter = true;
            }
        }
        var nCellIndex = 0;
        var nCellIndexSpan = 0;
        var fParseSpans = function () {
            var spans = oRowSpans[nCellIndexSpan];
            while (null != spans) {
                var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                oCurCell.Set_VMerge(vmerge_Continue);
                if (spans.col > 1) {
                    oCurCell.Set_GridSpan(spans.col);
                }
                spans.row--;
                if (spans.row <= 0) {
                    delete oRowSpans[nCellIndexSpan];
                }
                nCellIndexSpan += spans.col;
                spans = oRowSpans[nCellIndexSpan];
            }
        };
        var oBeforeCell = null;
        var oAfterCell = null;
        if (bBefore || bAfter) {
            for (var i = 0, length = node.childNodes.length; i < length; ++i) {
                var tc = node.childNodes[i];
                var tcName = tc.nodeName.toLowerCase();
                if ("td" == tcName || "th" == tcName) {
                    if (bBefore && null != oBeforeCell) {
                        oBeforeCell = tc;
                    } else {
                        if (bAfter) {
                            oAfterCell = tc;
                        }
                    }
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            fParseSpans();
            var tc = node.childNodes[i];
            var tcName = tc.nodeName.toLowerCase();
            if ("td" == tcName || "th" == tcName) {
                var nColSpan = tc.getAttribute("colspan");
                if (null != nColSpan) {
                    nColSpan = nColSpan - 0;
                } else {
                    nColSpan = 1;
                }
                if (tc == oBeforeCell) {
                    row.Set_Before(nColSpan);
                } else {
                    if (tc == oAfterCell) {
                        row.Set_After(nColSpan);
                    } else {
                        var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                        if (nColSpan > 1) {
                            oCurCell.Set_GridSpan(nColSpan);
                        }
                        var width = aSumGrid[nCellIndexSpan + nColSpan - 1] - aSumGrid[nCellIndexSpan - 1];
                        oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, width));
                        var nRowSpan = tc.getAttribute("rowspan");
                        if (null != nRowSpan) {
                            nRowSpan = nRowSpan - 0;
                        } else {
                            nRowSpan = 1;
                        }
                        if (nRowSpan > 1) {
                            oRowSpans[nCellIndexSpan] = {
                                row: nRowSpan - 1,
                                col: nColSpan
                            };
                        }
                        this._ExecuteTableCellPresentation(tc, oCurCell, bUseScaleKoef, dScaleKoef, spacing, arrShapes, arrImages, arrTables);
                    }
                }
                nCellIndexSpan += nColSpan;
            }
        }
        fParseSpans();
    },
    _ExecuteTableCellPresentation: function (node, cell, bUseScaleKoef, dScaleKoef, spacing, arrShapes, arrImages, arrTables) {
        var Pr = cell.Pr;
        var bAddIfNull = false;
        if (null != spacing) {
            bAddIfNull = true;
        }
        var computedStyle = this._getComputedStyle(node);
        if (null != computedStyle) {
            var background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                var Shd = new CDocumentShd();
                Shd.Value = shd_Clear;
                Shd.Color = background_color;
                cell.Set_Shd(Shd);
            }
            var border = this._ExecuteBorder(computedStyle, node, "left", "Left", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 3);
            }
            var border = this._ExecuteBorder(computedStyle, node, "top", "Top", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 0);
            }
            var border = this._ExecuteBorder(computedStyle, node, "right", "Right", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 1);
            }
            var border = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 2);
            }
            var top = computedStyle.getPropertyValue("padding-top");
            if (null != top && null != (top = this._ValueToMm(top))) {
                cell.Set_Margins({
                    W: top,
                    Type: tblwidth_Mm
                },
                0);
            }
            var right = computedStyle.getPropertyValue("padding-right");
            if (null != right && null != (right = this._ValueToMm(right))) {
                cell.Set_Margins({
                    W: right,
                    Type: tblwidth_Mm
                },
                1);
            }
            var bottom = computedStyle.getPropertyValue("padding-bottom");
            if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {
                cell.Set_Margins({
                    W: bottom,
                    Type: tblwidth_Mm
                },
                2);
            }
            var left = computedStyle.getPropertyValue("padding-left");
            if (null != left && null != (left = this._ValueToMm(left))) {
                cell.Set_Margins({
                    W: left,
                    Type: tblwidth_Mm
                },
                3);
            }
        }
        var arrShapes2 = [],
        arrImages2 = [],
        arrTables2 = [];
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape = new CShape();
        shape.setParent(presentation.Slides[presentation.CurPage]);
        shape.setTxBody(CreateTextBodyFromString("", presentation.DrawingDocument, shape));
        arrShapes2.push(shape);
        this._ExecutePresentation(node, {},
        true, true, false, arrShapes2, arrImages2, arrTables);
        if (arrShapes2.length > 0) {
            var first_shape = arrShapes2[0];
            var content = first_shape.txBody.content;
            for (var i = 0, length = content.Content.length; i < length; ++i) {
                if (i == length - 1) {
                    cell.Content.Internal_Content_Add(i + 1, content.Content[i], true);
                } else {
                    cell.Content.Internal_Content_Add(i + 1, content.Content[i], false);
                }
            }
            cell.Content.Internal_Content_Remove(0, 1);
            arrShapes2.splice(0, 1);
        }
        for (var i = 0; i < arrShapes2.length; ++i) {
            arrShapes.push(arrShapes2[i]);
        }
        for (var i = 0; i < arrImages2.length; ++i) {
            arrImages.push(arrImages2[i]);
        }
        for (var i = 0; i < arrTables2.length; ++i) {
            arrTables.push(arrTables2[i]);
        }
    },
    _applyStylesToTable: function (cTable, cStyle) {
        if (!cTable || !cStyle || (cTable && !cTable.Content)) {
            return;
        }
        var row, tableCell;
        for (var i = 0; i < cTable.Content.length; i++) {
            row = cTable.Content[i];
            for (var j = 0; j < row.Content.length; j++) {
                tableCell = row.Content[j];
                var test = this.Internal_Compile_Pr(cTable, cStyle, tableCell);
                tableCell.Set_Pr(test.CellPr);
            }
        }
    }
};
function SafariIntervalFocus() {
    if (window.editor && window.editor.WordControl && window.editor.WordControl.IsFocus && (!g_bIsDocumentCopyPaste || (g_bIsDocumentCopyPaste && !window.editor.WordControl.TextBoxInputFocus))) {
        var pastebin = document.getElementById(COPY_ELEMENT_ID);
        if (pastebin) {
            pastebin.focus();
        } else {
            Editor_CopyPaste_Create(window.editor);
        }
    }
}
function Editor_CopyPaste_Create(api) {
    var ElemToSelect = document.createElement("div");
    ElemToSelect.id = COPY_ELEMENT_ID;
    ElemToSelect.className = "sdk-element";
    ElemToSelect.style.position = "absolute";
    ElemToSelect.style.left = "0px";
    ElemToSelect.style.top = "-100px";
    ElemToSelect.style.width = "1000px";
    ElemToSelect.style.height = "100px";
    ElemToSelect.style.overflow = "hidden";
    ElemToSelect.style.zIndex = -1000;
    ElemToSelect.style.MozUserSelect = "text";
    ElemToSelect.style["-khtml-user-select"] = "text";
    ElemToSelect.style["-o-user-select"] = "text";
    ElemToSelect.style["user-select"] = "text";
    ElemToSelect.style["-webkit-user-select"] = "text";
    ElemToSelect.setAttribute("contentEditable", true);
    var Def_rPr;
    if (g_bIsDocumentCopyPaste) {
        Def_rPr = api.WordControl.m_oLogicDocument.Styles.Default.TextPr;
    } else {
        Def_rPr = api.WordControl.m_oLogicDocument.globalTableStyles.Default.TextPr;
    }
    ElemToSelect.style.fontFamily = Def_rPr.FontFamily.Name;
    if (!api.DocumentReaderMode) {
        ElemToSelect.style.fontSize = Def_rPr.FontSize + "pt";
    } else {
        api.DocumentReaderMode.CorrectDefaultFontSize(Def_rPr.FontSize);
        ElemToSelect.style.fontSize = "1em";
    }
    ElemToSelect.onpaste = function (e) {
        if (!window.GlobalPasteFlag) {
            return;
        }
        if (window.GlobalPasteFlagCounter == 1) {
            Body_Paste(api, e);
            if (window.GlobalPasteFlag) {
                window.GlobalPasteFlagCounter = 2;
            }
        }
    };
    ElemToSelect.oncopy = function (e) {
        ElemToSelect.innerHTML = "";
        Editor_Copy_Event(e, ElemToSelect);
    };
    ElemToSelect.oncut = function (e) {
        if (false === api.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
            ElemToSelect.innerHTML = "";
            Editor_Copy_Event(e, ElemToSelect);
            api.WordControl.m_oLogicDocument.Remove(1, true, true);
            api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    };
    ElemToSelect["onbeforecut"] = function (e) {
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        ElemToSelect.innerHTML = "&nbsp;";
        rangeToSelect.selectNodeContents(ElemToSelect);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    };
    ElemToSelect["onbeforecopy"] = function (e) {
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        ElemToSelect.innerHTML = "&nbsp;";
        rangeToSelect.selectNodeContents(ElemToSelect);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    };
    document.body.appendChild(ElemToSelect);
}