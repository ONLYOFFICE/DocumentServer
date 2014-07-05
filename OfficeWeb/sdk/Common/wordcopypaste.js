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
var copyPasteUseBinery = true;
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {};
        }
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {
                return false;
            };
        }
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
    if (window.USER_AGENT_IE) {
        document.onselectstart = function () {};
    }
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
                    wrap.setAttribute("style", "font-weight:normal");
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {
                return false;
            };
        }
        if (true == bCut) {
            api.WordControl.m_oLogicDocument.Remove(-1, true, true);
            api.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    time_interval);
}
function CopyProcessor(api, ElemToSelect) {
    this.api = api;
    this.oDocument = api.WordControl.m_oLogicDocument;
    this.oBinaryFileWriter = new BinaryFileWriter(this.oDocument);
    this.fontsArray = api.FontLoader.fontInfos;
    this.ElemToSelect = ElemToSelect;
    this.Ul = document.createElement("ul");
    this.Ol = document.createElement("ol");
    this.oTagPr;
    this.orPr;
    this.aInnerHtml;
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
    RGBToCSS: function (rgb) {
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
        var apPr = new Array();
        var Def_pPr = this.oDocument.Styles.Default.ParaPr;
        var Item_pPr = Item.CompiledPr.Pr.ParaPr;
        if (Item_pPr) {
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
            if (Def_pPr.Shd.Value != Item_pPr.Shd.Value) {
                apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color));
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
    InitRun: function (bInitPr) {
        if (bInitPr) {
            this.oTagPr = new Object();
            this.orPr = new Object();
        }
        this.aInnerHtml = new Array();
    },
    CommitSpan: function (bInitPr) {
        if (this.aInnerHtml.length > 0) {
            var Run = document.createElement("span");
            var sStyle = "";
            for (prop in this.orPr) {
                sStyle += prop + ":" + this.orPr[prop] + ";";
            }
            if ("" != sStyle) {
                Run.setAttribute("style", sStyle);
            }
            if (this.aInnerHtml.length > 0) {
                var sText = this.aInnerHtml.join("");
                sText = sText.replace(/\s+/g, function (str) {
                    var sResult = "";
                    for (var i = 0, length = str.length; i < length - 1; i++) {
                        sResult += "&nbsp;";
                    }
                    sResult += " ";
                    return sResult;
                });
                var sStart = "";
                var aEnd = new Array();
                for (prop in this.oTagPr) {
                    sStart += "<" + prop + ">";
                    aEnd.push("</" + prop + ">");
                }
                if ("" != sStart && aEnd.length > 0) {
                    aEnd.reverse();
                    sText = sStart + sText + aEnd.join("");
                }
                Run.innerHTML = sText;
            }
            if (null != this.oCurHyperlinkElem) {
                this.oCurHyperlinkElem.appendChild(Run);
            } else {
                this.Para.appendChild(Run);
            }
        }
        this.InitRun(bInitPr);
    },
    parse_para_TextPr: function (Value) {
        this.CommitSpan(false);
        for (var prop in Value) {
            this.SetProp(prop, Value[prop]);
        }
    },
    SetProp: function (prop, val) {
        var oPropMap = {
            RFonts: function (oThis, val) {
                var sFontName = null;
                if (null != val.Ascii) {
                    sFontName = val.Ascii.Name;
                } else {
                    if (null != val.HAnsi) {
                        sFontName = val.HAnsi.Name;
                    } else {
                        if (null != val.EastAsia) {
                            sFontName = val.EastAsia.Name;
                        } else {
                            if (null != val.CS) {
                                sFontName = val.CS.Name;
                            }
                        }
                    }
                }
                if (null != sFontName) {
                    oThis.orPr["font-family"] = "'" + sFontName + "'";
                }
            },
            FontSize: function (oThis, val) {
                if (!oThis.api.DocumentReaderMode) {
                    oThis.orPr["font-size"] = val + "pt";
                } else {
                    oThis.orPr["font-size"] = oThis.api.DocumentReaderMode.CorrectFontSize(val);
                }
            },
            Bold: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["b"] = 1;
                } else {
                    delete oThis.oTagPr["b"];
                }
            },
            Italic: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["i"] = 1;
                } else {
                    delete oThis.oTagPr["i"];
                }
            },
            Underline: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["u"] = 1;
                } else {
                    delete oThis.oTagPr["u"];
                }
            },
            Strikeout: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["s"] = 1;
                } else {
                    delete oThis.oTagPr["s"];
                }
            },
            HighLight: function (oThis, val) {
                if (val != highlight_None) {
                    oThis.orPr["background-color"] = oThis.RGBToCSS(val);
                } else {
                    delete oThis.orPr["background-color"];
                }
            },
            Color: function (oThis, val) {
                var color = oThis.RGBToCSS(val);
                oThis.orPr["color"] = color;
                oThis.orPr["mso-style-textfill-fill-color"] = color;
            },
            VertAlign: function (oThis, val) {
                if (vertalign_SuperScript == val) {
                    oThis.orPr["vertical-align"] = "super";
                } else {
                    if (vertalign_SubScript == val) {
                        oThis.orPr["vertical-align"] = "sub";
                    } else {
                        delete oThis.orPr["vertical-align"];
                    }
                }
            }
        };
        if ("undefined" != typeof(oPropMap[prop])) {
            oPropMap[prop](this, val);
        }
    },
    ParseItem: function (ParaItem, Par, nParIndex, aDocumentContent, nDocumentContentIndex) {
        switch (ParaItem.Type) {
        case para_Text:
            var sValue = ParaItem.Value;
            if (sValue) {
                sValue = CopyPasteCorrectString(sValue);
                this.aInnerHtml.push(sValue);
            }
            break;
        case para_Space:
            this.aInnerHtml.push(" ");
            break;
        case para_Tab:
            this.aInnerHtml.push("<span style='mso-tab-count:1'>    </span>");
            break;
        case para_NewLine:
            if (break_Page == ParaItem.BreakType) {
                this.aInnerHtml.push('<br clear="all" style="mso-special-character:line-break;page-break-before:always;" />');
            } else {
                this.aInnerHtml.push('<br style="mso-special-character:line-break;" />');
            }
            break;
        case para_End:
            this.bOccurEndPar = true;
            break;
        case para_TextPr:
            if (null != Par) {
                var oCalculateTextPr = Par.Internal_CalculateTextPr(nParIndex);
                this.parse_para_TextPr(oCalculateTextPr);
            }
            break;
        case para_Drawing:
            var oGraphicObj = ParaItem.GraphicObj;
            var sSrc = oGraphicObj.getBase64Img();
            if (sSrc.length > 0) {
                sSrc = this.getSrc(sSrc);
                this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round(ParaItem.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(ParaItem.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
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
                    this.aInnerHtml.push('<img style="' + sStyle + '" width="' + Math.round(oFlowObj.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oFlowObj.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
                    break;
                }
            }
            break;
        case para_HyperlinkStart:
            if (null == this.oCurHyperlinkElem) {
                this.CommitSpan(false);
                this.oCurHyperlink = ParaItem;
                this.oCurHyperlinkElem = document.createElement("a");
                if (null != this.oCurHyperlink.Value) {
                    this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
                }
                if (null != this.oCurHyperlink.ToolTip) {
                    this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
                }
            }
            break;
        case para_HyperlinkEnd:
            this.CommitSpan(false);
            if (null != this.oCurHyperlinkElem) {
                this.Para.appendChild(this.oCurHyperlinkElem);
            } else {
                var oHyperlink = null;
                for (var i = nParIndex - 1; i >= 0; --i) {
                    var item = Par.Content[i];
                    if (para_HyperlinkStart == item.Type) {
                        oHyperlink = item;
                        break;
                    }
                }
                if (null == oHyperlink) {
                    for (var i = nDocumentContentIndex - 1; i >= 0; --i) {
                        var item = aDocumentContent[i];
                        if (type_Paragraph == item.Type) {
                            for (var j = item.Content.length - 1; j >= 0; --j) {
                                var Paritem = item.Content[ji];
                                if (para_HyperlinkStart == Paritem.Type) {
                                    oHyperlink = Paritem;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (null != oHyperlink) {
                    bReset = false;
                    this.CommitSpan(false);
                    this.oCurHyperlink = oHyperlink;
                    this.oCurHyperlinkElem = document.createElement("a");
                    if (null != this.oCurHyperlink.Value) {
                        this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
                    }
                    if (null != this.oCurHyperlink.ToolTip) {
                        this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
                    }
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        var child = this.Para.childNodes[i];
                        child = this.Para.removeChild(child);
                        this.oCurHyperlinkElem.appendChild(child);
                    }
                    this.Para.appendChild(this.oCurHyperlinkElem);
                }
            }
            this.oCurHyperlink = null;
            this.oCurHyperlinkElem = null;
            break;
        }
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
        this.InitRun(true);
        var ParaStart = 0;
        var ParaEnd = Item.Content.length - 1;
        if (true == bUseSelection) {
            ParaStart = Item.Selection.StartPos;
            ParaEnd = Item.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        var oCalculateTextPr = Item.Internal_CalculateTextPr(ParaStart);
        this.parse_para_TextPr(oCalculateTextPr);
        if (null != this.oCurHyperlink) {
            this.oCurHyperlinkElem = document.createElement("a");
            if (null != this.oCurHyperlink.Value) {
                this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
            }
            if (null != this.oCurHyperlink.ToolTip) {
                this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
            }
        }
        if (ParaStart > 0) {
            while (Item.Content[ParaStart - 1].Type === para_TextPr || Item.Content[ParaStart - 1].Type === para_HyperlinkStart) {
                ParaStart--;
                if (0 == ParaStart) {
                    break;
                }
            }
        }
        for (var Index2 = ParaStart; Index2 < ParaEnd; Index2++) {
            var ParaItem = Item.Content[Index2];
            this.ParseItem(ParaItem, Item, Index2, aDocumentContent, nDocumentContentIndex);
        }
        this.CommitSpan(true);
        if (null != this.oCurHyperlinkElem) {
            this.Para.appendChild(this.oCurHyperlinkElem);
        }
        this.oCurHyperlink = null;
        this.oCurHyperlinkElem = null;
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
            bBorder = true;
            var size = 0.5;
            var color = {
                r: 0,
                g: 0,
                b: 0
            };
            if (null != border.Size) {
                size = border.Size * g_dKoef_mm_to_pt;
            }
            if (null != border.Color) {
                color = border.Color;
            }
            res += name + ":" + size + "pt solid " + this.RGBToCSS(color) + ";";
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
        if (null != cell.CompiledPr && null != cell.CompiledPr.Pr) {
            cellPr = cell.CompiledPr.Pr;
            if (null != cellPr.GridSpan && cellPr.GridSpan > 1) {
                tc.setAttribute("colspan", cellPr.GridSpan);
            }
        }
        if (null != cellPr && null != cellPr.Shd) {
            if (shd_Nil != cellPr.Shd.Value) {
                tcStyle += "background-color:" + this.RGBToCSS(cellPr.Shd.Color) + ";";
            }
        } else {
            if (null != tablePr && null != tablePr.Shd) {
                if (shd_Nil != tablePr.Shd.Value) {
                    tcStyle += "background-color:" + this.RGBToCSS(tablePr.Shd.Color) + ";";
                }
            }
        }
        var oCellMar = new Object();
        if (null != cellPr && null != cellPr.TableCellMar) {
            this._MergeProp(oCellMar, cellPr.TableCellMar);
        }
        if (null != tablePr && null != tablePr.TableCellMar) {
            this._MergeProp(oCellMar, tablePr.TableCellMar);
        }
        tcStyle += this._MarginToStyle(oCellMar, "padding");
        var oCellBorder = new Object();
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
        this.CopyDocument(tc, cell.Content, false);
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
        var gridSum = table.TableSumGrid;
        var trStyle = "";
        var nGridBefore = 0;
        var rowPr = null;
        if (null != row.CompiledPr && null != row.CompiledPr.Pr) {
            rowPr = row.CompiledPr.Pr;
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
                var tablePr = null;
                if (null != table.CompiledPr && null != table.CompiledPr.Pr && null != table.CompiledPr.Pr.TablePr) {
                    tablePr = table.CompiledPr.Pr.TablePr;
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
        var Pr = null;
        if (null != table.CompiledPr && null != table.CompiledPr.Pr && null != table.CompiledPr.Pr.TablePr) {
            Pr = table.CompiledPr.Pr.TablePr;
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
            if (null != Pr.Shd && shd_Nil != Pr.Shd.Value) {
                tblStyle += "background:" + this.RGBToCSS(Pr.Shd.Color) + ";";
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
            if (null != firstRow.Pr && null != firstRow.Pr.TableCellSpacing) {
                bAddSpacing = true;
                var cellSpacingMM = firstRow.Pr.TableCellSpacing;
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
                    this.InitRun();
                    this.ParseItem(oDocument.Selection.Data.DrawingObject);
                    this.CommitSpan(false);
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
                            var aSelectedRows = new Array();
                            var oRowElems = new Object();
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
    Start: function (node) {
        this.oBinaryFileWriter.CopyStart();
        var oDocument = this.oDocument;
        if (g_bIsDocumentCopyPaste) {
            if (!this.api.DocumentReaderMode) {
                var Def_pPr = oDocument.Styles.Default.ParaPr;
                if (docpostype_HdrFtr === oDocument.CurPos.Type) {
                    if (null != oDocument.HdrFtr && null != oDocument.HdrFtr.CurHdrFtr && null != oDocument.HdrFtr.CurHdrFtr.Content) {
                        oDocument = oDocument.HdrFtr.CurHdrFtr.Content;
                    }
                }
                if (oDocument.CurPos.Type == docpostype_FlowObjects) {
                    var oData = oDocument.Selection.Data.FlowObject;
                    switch (oData.Get_Type()) {
                    case flowobject_Image:
                        this.Para = document.createElement("p");
                        this.InitRun();
                        this.ParseItem(oData);
                        var oImg = oData;
                        var sSrc = oImg.Img;
                        if (sSrc.length > 0) {
                            sSrc = this.getSrc(sSrc);
                            if (this.api.DocumentReaderMode) {
                                this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round(oImg.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oImg.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
                            } else {
                                this.aInnerHtml.push('<img width="' + Math.round(oImg.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oImg.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
                            }
                        }
                        this.CommitSpan(false);
                        this.ElemToSelect.appendChild(this.Para);
                        return;
                    case flowobject_Table:
                        if (null != oData.Table && null != oData.Table.CurCell && null != oData.Table.CurCell.Content) {
                            oDocument = oData.Table.CurCell.Content;
                        }
                        break;
                    }
                }
                if (oDocument.CurPos.Type === docpostype_DrawingObjects) {
                    switch (oDocument.DrawingObjects.curState.id) {
                    case STATES_ID_TEXT_ADD:
                        var text_object = oDocument.DrawingObjects.curState.textObject;
                        if (text_object != null && text_object.GraphicObj != null && text_object.GraphicObj.textBoxContent != null) {
                            oDocument = text_object.GraphicObj.textBoxContent;
                        }
                        break;
                    case STATES_ID_TEXT_ADD_IN_GROUP:
                        text_object = oDocument.DrawingObjects.curState.textObject;
                        if (text_object != null && text_object.textBoxContent != null) {
                            oDocument = text_object.textBoxContent;
                        }
                        break;
                    case STATES_ID_CHART_TITLE_TEXT:
                        case STATES_ID_CHART_TITLE_TEXT_GROUP:
                        var text_object = oDocument.DrawingObjects.curState.title;
                        if (text_object != null && text_object.txBody != null && text_object.txBody != null) {
                            oDocument = text_object.txBody.getDocContentForCopyPaste();
                        }
                        break;
                    case STATES_ID_GROUP:
                        var s_arr = oDocument.DrawingObjects.curState.group.selectionInfo.selectionArray;
                        this.Para = document.createElement("p");
                        this.InitRun();
                        if (copyPasteUseBinery) {
                            var newArr = null;
                            var tempAr = null;
                            if (s_arr) {
                                tempAr = [];
                                for (var k = 0; k < s_arr.length; k++) {
                                    tempAr[k] = s_arr[k].absOffsetY;
                                }
                            }
                            tempAr.sort(function (a, b) {
                                return a - b;
                            });
                            newArr = [];
                            for (var k = 0; k < tempAr.length; k++) {
                                var absOffsetY = tempAr[k];
                                for (var i = 0; i < s_arr.length; i++) {
                                    if (absOffsetY == s_arr[i].absOffsetY) {
                                        newArr[k] = s_arr[i];
                                    }
                                }
                            }
                            if (newArr != null) {
                                s_arr = newArr;
                            }
                        }
                        for (var i = 0; i < s_arr.length; ++i) {
                            var cur_element = s_arr[i];
                            if (isRealObject(cur_element.parent)) {
                                var base64_img = cur_element.parent.getBase64Img();
                                if (copyPasteUseBinery) {
                                    var wrappingType = cur_element.parent.wrappingType;
                                    var DrawingType = cur_element.parent.DrawingType;
                                    var tempParagraph = new Paragraph(oDocument, oDocument, 0, 0, 0, 0, 0);
                                    var index = 0;
                                    tempParagraph.Content.unshift(new ParaDrawing());
                                    tempParagraph.Content[index].wrappingType = wrappingType;
                                    tempParagraph.Content[index].DrawingType = DrawingType;
                                    tempParagraph.Content[index].GraphicObj = cur_element;
                                    tempParagraph.Selection.EndPos = index + 1;
                                    tempParagraph.Selection.StartPos = index;
                                    tempParagraph.Selection.Use = true;
                                    this.oBinaryFileWriter.CopyParagraph(tempParagraph);
                                }
                                var src = this.getSrc(base64_img);
                                this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round(cur_element.absExtX * g_dKoef_mm_to_pix) + '" height="' + Math.round(cur_element.absExtY * g_dKoef_mm_to_pix) + '" src="' + src + '" />');
                                this.ElemToSelect.appendChild(this.Para);
                            }
                        }
                        this.CommitSpan(false);
                        if (copyPasteUseBinery) {
                            this.oBinaryFileWriter.CopyEnd();
                            var sBase64 = this.oBinaryFileWriter.GetResult();
                            if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                                $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                                $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
                            }
                            if (this.ElemToSelect.children[0]) {
                                $(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
                            }
                        }
                        return;
                    default:
                        var gr_objects = oDocument.DrawingObjects;
                        var selection_array = gr_objects.selectionInfo.selectionArray;
                        this.Para = document.createElement("span");
                        this.InitRun();
                        var selectionTrue;
                        var selectIndex;
                        for (var i = 0; i < selection_array.length; ++i) {
                            var cur_element = selection_array[i];
                            var base64_img = cur_element.getBase64Img();
                            var src = this.getSrc(base64_img);
                            this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round(cur_element.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(cur_element.H * g_dKoef_mm_to_pix) + '" src="' + src + '" />');
                            this.ElemToSelect.appendChild(this.Para);
                            if (copyPasteUseBinery) {
                                var parent = cur_element.Parent;
                                selectionTrue = {
                                    EndPos: parent.Selection.EndPos,
                                    StartPos: parent.Selection.StartPos
                                };
                                var inIndex;
                                for (var k = 0; k < parent.Content.length; k++) {
                                    if (parent.Content[k] == cur_element) {
                                        inIndex = k;
                                        break;
                                    }
                                }
                                parent.Selection.EndPos = inIndex + 1;
                                parent.Selection.StartPos = inIndex;
                                parent.Selection.Use = true;
                                this.oBinaryFileWriter.CopyParagraph(parent);
                                parent.Selection.StartPos = selectionTrue.StartPos;
                                parent.Selection.EndPos = selectionTrue.EndPos;
                            }
                        }
                        this.CommitSpan(false);
                        if (copyPasteUseBinery) {
                            this.oBinaryFileWriter.CopyEnd();
                            var sBase64 = this.oBinaryFileWriter.GetResult();
                            if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                                $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                                $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
                            }
                            if (this.ElemToSelect.children[0]) {
                                $(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
                            }
                        }
                        return;
                    }
                }
                if (true === oDocument.Selection.Use) {
                    this.CopyDocument(this.ElemToSelect, oDocument, true);
                }
            } else {
                this.CopyDocument(this.ElemToSelect, oDocument, false);
            }
        } else {
            var presentation = editor.WordControl.m_oLogicDocument;
            var pasteString = "";
            switch (editor.WordControl.Thumbnails.FocusObjType) {
            case FOCUS_OBJECT_MAIN:
                var slide = presentation.Slides[presentation.CurPage];
                var graphicObjects = slide.graphicObjects;
                switch (graphicObjects.State.id) {
                case STATES_ID_TEXT_ADD:
                    case STATES_ID_TEXT_ADD_IN_GROUP:
                    case STATES_ID_CHART_TEXT_ADD:
                    if (graphicObjects.State.textObject instanceof CShape || graphicObjects.State.textObject instanceof CChartTitle) {
                        this.oPresentationWriter.WriteString2("TeamLab1");
                        this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                        this.oPresentationWriter.WriteDouble(presentation.Width);
                        this.oPresentationWriter.WriteDouble(presentation.Height);
                        this.CopyPresentationText(this.ElemToSelect, graphicObjects.State.textObject.txBody.content, true);
                    } else {
                        if (graphicObjects.State.textObject instanceof CGraphicFrame) {
                            var table = graphicObjects.State.textObject.graphicObject;
                            switch (table.Selection.Type) {
                            case table_Selection_Text:
                                this.oPresentationWriter.WriteString2("TeamLab1");
                                this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                                this.oPresentationWriter.WriteDouble(presentation.Width);
                                this.oPresentationWriter.WriteDouble(presentation.Height);
                                this.CopyPresentationText(this.ElemToSelect, graphicObjects.State.textObject.graphicObject.CurCell.Content, true);
                                break;
                            case table_Selection_Cell:
                                this.oPresentationWriter.WriteString2("TeamLab4");
                                this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                                this.oPresentationWriter.WriteDouble(presentation.Width);
                                this.oPresentationWriter.WriteDouble(presentation.Height);
                                this.CopyPresentationTableCells(this.ElemToSelect, graphicObjects.State.textObject);
                                var selected_objects = graphicObjects.State.id === STATES_ID_GROUP ? graphicObjects.State.group.selectedObjects : graphicObjects.selectedObjects;
                                for (var i = 0; i < selected_objects.length; ++i) {
                                    var selected_object = selected_objects[i];
                                    this.oPresentationWriter.WriteDouble(selected_object.x);
                                    this.oPresentationWriter.WriteDouble(selected_object.y);
                                    this.oPresentationWriter.WriteDouble(selected_object.extX);
                                    this.oPresentationWriter.WriteDouble(selected_object.extY);
                                }
                                break;
                            }
                        }
                    }
                    break;
                default:
                    if (graphicObjects.selectedObjects.length > 0) {
                        this.aInnerHtml = [];
                        this.Para = document.createElement("p");
                        this.oPresentationWriter.WriteString2("TeamLab2");
                        this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                        this.oPresentationWriter.WriteDouble(presentation.Width);
                        this.oPresentationWriter.WriteDouble(presentation.Height);
                        var selected_objects = graphicObjects.State.id === STATES_ID_GROUP ? graphicObjects.State.group.selectedObjects : graphicObjects.selectedObjects;
                        this.oPresentationWriter.WriteULong(selected_objects.length);
                        for (var i = 0; i < selected_objects.length; ++i) {
                            if (! (selected_objects[i] instanceof CGraphicFrame)) {
                                this.oPresentationWriter.WriteBool(true);
                                this.CopyGraphicObject(this.ElemToSelect, selected_objects[i]);
                            } else {
                                this.oPresentationWriter.WriteBool(false);
                                this.CopyPresentationTableFull(this.ElemToSelect, selected_objects[i]);
                            }
                        }
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var selected_object = selected_objects[i];
                            this.oPresentationWriter.WriteDouble(selected_object.x);
                            this.oPresentationWriter.WriteDouble(selected_object.y);
                            this.oPresentationWriter.WriteDouble(selected_object.extX);
                            this.oPresentationWriter.WriteDouble(selected_object.extY);
                        }
                        this.CommitSpan(false);
                        for (var i = 0; i < this.Para.childNodes.length; i++) {
                            this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                        }
                    }
                    break;
                }
                break;
            case FOCUS_OBJECT_THUMBNAILS:
                var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
                if (selected_slides.length > 0) {
                    this.aInnerHtml = [];
                    this.Para = document.createElement("p");
                    this.oPresentationWriter.WriteString2("TeamLab3");
                    this.oPresentationWriter.WriteString2(editor.DocumentUrl);
                    this.oPresentationWriter.WriteDouble(presentation.Width);
                    this.oPresentationWriter.WriteDouble(presentation.Height);
                    this.oPresentationWriter.WriteULong(selected_slides.length);
                    var layouts_map = {};
                    var layout_count = 0;
                    editor.WordControl.m_oLogicDocument.CalculateComments();
                    for (var i = 0; i < selected_slides.length; ++i) {
                        this.CopySlide(this.ElemToSelect, editor.WordControl.m_oLogicDocument.Slides[selected_slides[i]]);
                        if (!layouts_map[editor.WordControl.m_oLogicDocument.Slides[selected_slides[i]].Layout.Get_Id()]) {
                            ++layout_count;
                        }
                        layouts_map[editor.WordControl.m_oLogicDocument.Slides[selected_slides[i]].Layout.Get_Id()] = editor.WordControl.m_oLogicDocument.Slides[selected_slides[i]].Layout;
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
                            if (editor.WordControl.m_oLogicDocument.Slides[selected_slides[i]].Layout === arr_layouts_id[t]) {
                                arr_ind[i] = t;
                                break;
                            }
                        }
                    }
                    for (var i = 0; i < arr_ind.length; ++i) {
                        this.oPresentationWriter.WriteULong(arr_ind[i]);
                    }
                    this.CommitSpan(false);
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                    }
                }
                break;
            }
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
        this.oBinaryFileWriter.CopyEnd();
        if (copyPasteUseBinery && this.oBinaryFileWriter.copyParams.itemCount > 0) {
            var sBase64 = this.oBinaryFileWriter.GetResult();
            if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
            }
            if (this.ElemToSelect.children[0]) {
                $(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
            }
        }
    },
    CopySlide: function (oDomTarget, slide) {
        var sSrc = slide.getBase64Img();
        var _bounds_cheker = new CSlideBoundsChecker();
        slide.draw(_bounds_cheker, 0);
        this.aInnerHtml.push('<img width="' + Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix) + '" height="' + Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
        this.oPresentationWriter.WriteString2(slide.Layout.Get_Id());
        var table_styles_ids = [];
        var sp_tree = slide.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i] instanceof CGraphicFrame) {
                table_styles_ids.push(sp_tree[i].graphicObject.styleIndex);
                sp_tree[i].graphicObject.styleIndex = -1;
            }
        }
        this.oPresentationWriter.WriteULong(table_styles_ids.length);
        for (var i = 0; i < table_styles_ids.length; ++i) {
            this.oPresentationWriter.WriteBool(isRealNumber(table_styles_ids[i]) && table_styles_ids[i] > -1);
            if (isRealNumber(table_styles_ids[i]) && table_styles_ids[i] > -1) {
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
        var j = 0;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i] instanceof CGraphicFrame) {
                sp_tree[i].graphicObject.styleIndex = table_styles_ids[j];
                ++j;
            }
        }
    },
    CopyLayout: function (layout) {
        this.oPresentationWriter.WriteSlideLayout(layout);
    },
    CopyPresentationTableCells: function (oDomTarget, graphicFrame) {
        var aSelectedRows = new Array();
        var oRowElems = new Object();
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
        var aSelectedRows = new Array();
        var oRowElems = new Object();
        var Item = graphicFrame.graphicObject;
        this.CopyTable(oDomTarget, Item, null);
        var b_style_index = false;
        if (isRealNumber(graphicFrame.graphicObject.styleIndex) && graphicFrame.graphicObject.styleIndex > -1) {
            b_style_index = true;
        }
        this.oPresentationWriter.WriteBool(b_style_index);
        if (b_style_index) {
            this.oPresentationWriter.WriteULong(graphicFrame.graphicObject.styleIndex);
        }
        var old_style_index = graphicFrame.graphicObject.styleIndex;
        graphicFrame.graphicObject.styleIndex = -1;
        this.oPresentationWriter.WriteTable(graphicFrame);
        graphicFrame.graphicObject.styleIndex = old_style_index;
        this.oBinaryFileWriter.copyParams.itemCount = 0;
    },
    CopyPresentationText: function (oDomTarget, oDocument, bUseSelection) {
        var Start = 0;
        var End = 0;
        if (bUseSelection) {
            if (true === oDocument.Selection.Use) {
                if (selectionflag_DrawingObject === oDocument.Selection.Flag) {
                    this.Para = document.createElement("p");
                    this.InitRun();
                    this.ParseItem(oDocument.Selection.Data.DrawingObject);
                    this.CommitSpan(false);
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
                var content = Item.Content[i];
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
    CopyGraphicObject: function (oDomTarget, oGraphicObj) {
        var sSrc = oGraphicObj.getBase64Img();
        if (sSrc.length > 0) {
            sSrc = this.getSrc(sSrc);
            var _bounds_cheker = new CSlideBoundsChecker();
            oGraphicObj.draw(_bounds_cheker, 0);
            if (this.api.DocumentReaderMode) {
                this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix) + '" height="' + Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
            } else {
                this.aInnerHtml.push('<img width="' + Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix) + '" height="' + Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
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
                        if (typeof CChartAsGroup != "undefined" && oGraphicObj instanceof CChartAsGroup) {
                            this.oPresentationWriter.WriteChart(oGraphicObj);
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
        var Def_rPr = oWordControl.m_oLogicDocument.Styles.Default.TextPr;
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {};
        }
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {
                return false;
            };
        }
        History.Create_NewPoint();
        Editor_Paste(api, false);
        return true;
    } else {
        var ElemToSelect = document.getElementById(COPY_ELEMENT_ID);
        if (ElemToSelect) {
            History.Create_NewPoint();
            Editor_Paste_Exec(api, ElemToSelect);
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
        if (docpostype_FlowObjects == oTargetDoc.CurPos.Type) {
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
    if (window.USER_AGENT_IE) {
        document.onselectstart = function () {};
    }
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
        if (window.USER_AGENT_IE) {
            document.onselectstart = function () {
                return false;
            };
        }
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
        var fPasteHtml = function (sHtml) {
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
        if (fTest(e.clipboardData.types, "text/html")) {
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
function Editor_Paste_Exec(api, pastebin, nodeDisplay) {
    var oPasteProcessor = new PasteProcessor(api, true, true, false);
    oPasteProcessor.Start(pastebin, nodeDisplay);
}
function trimString(str) {
    return str.replace(/^\s+|\s+$/g, "");
}
function PasteProcessor(api, bUploadImage, bUploadFonts, bNested) {
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
    this.oFonts = new Object();
    this.oImages = new Object();
    this.aContent = new Array();
    this.bIgnoreNoBlockText = false;
    this.oCurPar = null;
    this.oCurParContentPos = 0;
    this.oCur_rPr = new CTextPr();
    this.nBrCount = 0;
    this.bInBlock = null;
    this.dMaxWidth = Page_Width - X_Left_Margin - X_Right_Margin;
    this.dScaleKoef = 1;
    this.bUseScaleKoef = false;
    this.MsoStyles = {
        "mso-style-type": 1,
        "mso-pagination": 1,
        "mso-line-height-rule": 1,
        "mso-style-textfill-fill-color": 1,
        "mso-tab-count": 1,
        "tab-stops": 1,
        "list-style-type": 1,
        "mso-special-character": 1,
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
    this.oBorderCache = new Object();
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
                switch (oDocument.DrawingObjects.curState.id) {
                case STATES_ID_TEXT_ADD:
                    var text_object = oDocument.DrawingObjects.curState.textObject;
                    if (text_object != null && text_object.GraphicObj != null && text_object.GraphicObj.textBoxContent != null) {
                        oDocument = text_object.GraphicObj.textBoxContent;
                    }
                    break;
                case STATES_ID_TEXT_ADD_IN_GROUP:
                    text_object = oDocument.DrawingObjects.curState.textObject;
                    if (text_object != null && text_object.textBoxContent != null) {
                        oDocument = text_object.textBoxContent;
                    }
                    break;
                case STATES_ID_CHART_TITLE_TEXT:
                    case STATES_ID_CHART_TITLE_TEXT_GROUP:
                    text_object = oDocument.DrawingObjects.curState.title;
                    if (text_object != null && text_object.txBody != null && text_object.txBody.content != null) {
                        oDocument = text_object.txBody.content;
                    }
                    break;
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
        if (false == this.bNested) {
            this.oRecalcDocument.Remove(1, true, true);
        }
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
            this.oLogicDocument.Document_UpdateInterfaceState();
        }
        window.GlobalPasteFlagCounter = 0;
    },
    InsertInPlace: function (oDoc, aNewContent) {
        if (!g_bIsDocumentCopyPaste) {
            return;
        }
        var nNewContentLength = aNewContent.length;
        var Item = oDoc.Content[oDoc.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType()) {
            if (true != this.bInBlock && 1 == nNewContentLength && type_Paragraph == aNewContent[0].GetType()) {
                var oInsertPar = aNewContent[0];
                var nContentLength = oInsertPar.Content.length;
                if (nContentLength > 2) {
                    var oFindObj = Item.Internal_FindBackward(Item.CurPos.ContentPos, [para_TextPr]);
                    var TextPr = null;
                    var nContentPos = Item.CurPos.ContentPos;
                    if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                        TextPr = Item.Content[oFindObj.LetterPos].Copy();
                        if (nContentLength > 0 && para_TextPr != oInsertPar.Content[0].Type) {
                            Item.Internal_Content_Add(nContentPos, new ParaTextPr());
                            nContentPos++;
                        }
                    } else {
                        TextPr = new ParaTextPr();
                    }
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
                if (true !== oSourceFirstPar.Cursor_IsEnd()) {
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
                    if (oInsFirstPar.Content.length > 0 && para_TextPr != oInsFirstPar.Content[0].Type) {
                        var oFindObj = oSourceFirstPar.Internal_FindForward(0, [para_TextPr]);
                        if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                            oInsFirstPar.Internal_Content_Add(0, new ParaTextPr());
                        }
                    }
                    oSourceFirstPar.Concat(oInsFirstPar);
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
                    if (null != oInsLastPar) {
                        oSourceLastPar.CopyPr(oInsLastPar);
                    }
                    if (oSourceLastPar.Content.length > 0 && para_TextPr != oSourceLastPar.Content[0].Type) {
                        var oFindObj = oInsLastPar.Internal_FindForward(0, [para_TextPr]);
                        if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                            oSourceLastPar.Internal_Content_Add(0, new ParaTextPr());
                        }
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
        window.global_pptx_content_loader.Clear();
        window.global_pptx_content_loader.Start_UseFullUrl();
        var openParams = {
            checkFileSize: false,
            charCount: 0,
            parCount: 0
        };
        var oBinaryFileReader = new BinaryFileReader(this.oDocument, openParams);
        oBinaryFileReader.stream = oBinaryFileReader.getbase64DecodedData(sBase64);
        oBinaryFileReader.ReadMainTable();
        var oReadResult = oBinaryFileReader.oReadResult;
        for (var i in oReadResult.numToNumClass) {
            var oNumClass = oReadResult.numToNumClass[i];
            var documentANum = this.oDocument.Numbering.AbstractNum;
            var isAlreadyContains = false;
            for (var n in documentANum) {
                var isEqual = documentANum[n].isEqual(oNumClass);
                if (isEqual == true) {
                    isAlreadyContains = true;
                    break;
                }
            }
            if (!isAlreadyContains) {
                this.oDocument.Numbering.Add_AbstractNum(oNumClass);
            } else {
                oReadResult.numToNumClass[i] = documentANum[n];
            }
        }
        for (var i = 0, length = oReadResult.paraNumPrs.length; i < length; ++i) {
            var numPr = oReadResult.paraNumPrs[i];
            var oNumClass = oReadResult.numToNumClass[numPr.NumId];
            if (null != oNumClass) {
                numPr.NumId = oNumClass.Get_Id();
            } else {
                numPr.NumId = 0;
            }
        }
        var isAlreadyContainsStyle;
        var api = this.api;
        var oStyleTypes = {
            par: 1,
            table: 2,
            lvl: 3
        };
        var addNewStyles = false;
        var fParseStyle = function (aStyles, oDocumentStyles, oReadResult, nStyleType) {
            if (aStyles == undefined) {
                return;
            }
            for (var i = 0, length = aStyles.length; i < length; ++i) {
                var elem = aStyles[i];
                var stylePaste = oReadResult.styles[elem.style];
                var isEqualName = null;
                if (null != stylePaste && null != stylePaste.style) {
                    for (var j in oDocumentStyles.Style) {
                        var styleDoc = oDocumentStyles.Style[j];
                        isAlreadyContainsStyle = styleDoc.isEqual(stylePaste.style);
                        if (styleDoc.Name == stylePaste.style.Name) {
                            isEqualName = j;
                        }
                        if (isAlreadyContainsStyle) {
                            if (oStyleTypes.par == nStyleType) {
                                elem.pPr.PStyle = j;
                            } else {
                                if (oStyleTypes.table == nStyleType) {
                                    elem.pPr.Set_TableStyle2(j);
                                } else {
                                    elem.pPr.PStyle = j;
                                }
                            }
                            break;
                        }
                    }
                    if (!isAlreadyContainsStyle && isEqualName != null) {
                        if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                            elem.pPr.PStyle = isEqualName;
                        } else {
                            if (nStyleType == oStyleTypes.table) {
                                elem.pPr.Set_TableStyle2(isEqualName);
                            }
                        }
                    } else {
                        if (!isAlreadyContainsStyle && isEqualName == null) {
                            var nStyleId = oDocumentStyles.Add(stylePaste.style);
                            if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                                elem.pPr.PStyle = nStyleId;
                            } else {
                                if (nStyleType == oStyleTypes.table) {
                                    elem.pPr.Set_TableStyle2(nStyleId);
                                }
                            }
                            addNewStyles = true;
                        }
                    }
                }
            }
        };
        fParseStyle(oBinaryFileReader.oReadResult.paraStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.par);
        fParseStyle(oBinaryFileReader.oReadResult.tableStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.table);
        fParseStyle(oBinaryFileReader.oReadResult.lvlStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.lvl);
        var aContent = oBinaryFileReader.oReadResult.DocumentContent;
        for (var i = 0, length = oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks.length; i < length; ++i) {
            oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks[i].call();
        }
        if (oReadResult.bLastRun) {
            this.bInBlock = false;
        } else {
            this.bInBlock = true;
        }
        var AllFonts = new Object();
        this.oDocument.Numbering.Document_Get_AllFontNames(AllFonts);
        this.oDocument.Styles.Document_Get_AllFontNames(AllFonts);
        for (var Index = 0, Count = aContent.length; Index < Count; Index++) {
            aContent[Index].Document_Get_AllFontNames(AllFonts);
        }
        var aPrepeareFonts = [];
        for (var i in AllFonts) {
            aPrepeareFonts.push(new CFont(i, 0, "", 0));
        }
        var oPastedImagesUnique = {};
        var aPastedImages = window.global_pptx_content_loader.End_UseFullUrl();
        for (var i = 0, length = aPastedImages.length; i < length; ++i) {
            var elem = aPastedImages[i];
            oPastedImagesUnique[elem.Url] = 1;
        }
        var aPrepeareImages = [];
        for (var i in oPastedImagesUnique) {
            aPrepeareImages.push(i);
        }
        return {
            content: aContent,
            fonts: aPrepeareFonts,
            images: aPrepeareImages,
            bAddNewStyles: addNewStyles,
            aPastedImages: aPastedImages
        };
    },
    Start: function (node, nodeDisplay, bDuplicate) {
        if (null == nodeDisplay) {
            nodeDisplay = node;
        }
        if (g_bIsDocumentCopyPaste) {
            var oThis = this;
            this.oDocument = this._GetTargetDocument(this.oDocument);
            if (copyPasteUseBinery) {
                var base64 = null;
                var classNode;
                if (node.children[0] && node.children[0].getAttribute("class") != null && node.children[0].getAttribute("class").indexOf("docData;") > -1) {
                    classNode = node.children[0].getAttribute("class");
                } else {
                    if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1) {
                        classNode = node.children[0].children[0].getAttribute("class");
                    } else {
                        if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1) {
                            classNode = node.children[0].children[0].children[0].getAttribute("class");
                        }
                    }
                }
                if (classNode != null) {
                    cL = classNode.split(" ");
                    for (var i = 0; i < cL.length; i++) {
                        if (cL[i].indexOf("docData;") > -1) {
                            base64 = cL[i].split("docData;")[1];
                        }
                    }
                }
                var aContent;
                if (this.oDocument.Parent && this.oDocument.Parent instanceof WordShape) {
                    base64 = null;
                }
                if (base64 != null) {
                    aContent = this.ReadFromBinary(base64);
                }
                if (aContent) {
                    var fPrepasteCallback = function () {
                        if (false == oThis.bNested) {
                            editor.WordControl.m_oLogicDocument.DrawingObjects.calculateAfterOpen(true);
                            oThis.InsertInDocument();
                            nodeDisplay.blur();
                            nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
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
                    } else {
                        oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
                    }
                    return;
                }
            }
            var presentation = editor.WordControl.m_oLogicDocument;
            this.oRootNode = node;
            this._Prepeare(node, function () {
                oThis.aContent = new Array();
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
            if (copyPasteUseBinery) {
                var base64 = null;
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
                        }
                    }
                }
                if (typeof base64 === "string") {
                    var _stream = CreateBinaryReader(base64, 0, base64.length);
                    var stream = new FileStream(_stream.data, _stream.size);
                    var first_string = stream.GetString2();
                    var p_url = stream.GetString2();
                    var p_width = stream.GetULong() / 100000;
                    var p_height = stream.GetULong() / 100000;
                    var kw = presentation.Width / p_width;
                    var kh = presentation.Height / p_height;
                    var fonts = [];
                    switch (first_string) {
                    case "TeamLab1":
                        var shape = this.ReadPresentationText(stream);
                        var font_map = {};
                        var images = [];
                        shape.getAllFonts(font_map);
                        if (shape.getAllImages) {
                            shape.getAllImages(images);
                        }
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var paste_callback = function () {
                            if (false == oThis.bNested) {
                                var b_add_slide = false;
                                if (presentation.Slides.length === 0) {
                                    presentation.addNextSlide();
                                    b_add_slide = true;
                                }
                                var slide = presentation.Slides[presentation.CurPage];
                                switch (slide.graphicObjects.State.id) {
                                case STATES_ID_TEXT_ADD:
                                    case STATES_ID_TEXT_ADD_IN_GROUP:
                                    case STATES_ID_CHART_TEXT_ADD:
                                    if (presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                                        var content = (slide.graphicObjects.State.textObject instanceof CShape || slide.graphicObjects.State.textObject instanceof CChartTitle) ? slide.graphicObjects.State.textObject.txBody.content : slide.graphicObjects.State.textObject.graphicObject.CurCell.Content;
                                        oThis.insertInPlace2(content, shape.txBody.content.Content);
                                        shape.txBody.content = new CDocumentContent(shape.txBody, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, false);
                                        shape.txBody.setDocContent(shape.txBody.content);
                                        if (slide.graphicObjects.State.textObject instanceof CShape) {
                                            slide.graphicObjects.State.textObject.txBody.bRecalculateNumbering = true;
                                        } else {
                                            slide.graphicObjects.State.textObject.recalcInfo.recalculateNumbering = true;
                                        }
                                        var content2 = content.Content;
                                        for (var j = 0; j < content2.length; ++j) {
                                            content2[j].RecalcInfo.Set_Type_0(pararecalc_0_All);
                                            content2[j].Set_Parent(content);
                                        }
                                        slide.graphicObjects.State.textObject.recalcInfo.recalculateContent = true;
                                        slide.graphicObjects.State.textObject.recalcInfo.recalculateTransformText = true;
                                        var recalc_object = !(slide.graphicObjects.State.textObject instanceof CChartTitle) ? slide.graphicObjects.State.textObject : slide.graphicObjects.State.textObject.chartGroup;
                                        editor.WordControl.m_oLogicDocument.recalcMap[recalc_object.Id] = recalc_object;
                                    }
                                    break;
                                default:
                                    if (presentation.Document_Is_SelectionLocked(changestype_AddShape, shape) === false) {
                                        if (b_add_slide) {
                                            shape.setParent(presentation.Slides[0]);
                                            slide = presentation.Slides[0];
                                        }
                                        slide.graphicObjects.resetSelectionState();
                                        shape.select(slide.graphicObjects);
                                        slide.addToSpTreeToPos(slide.cSld.spTree.length, shape);
                                        var w = shape.txBody.getRectWidth(presentation.Width * 2 / 3);
                                        var h = shape.txBody.getRectHeight(2000, w);
                                        shape.setXfrm((presentation.Width - w) / 2, (presentation.Height - h) / 2, w, h, null, null, null);
                                        shape.getAllFonts(font_map);
                                        for (var i in font_map) {
                                            fonts.push(new CFont(i, 0, "", 0));
                                        }
                                        editor.WordControl.m_oLogicDocument.recalcMap[shape.Id] = shape;
                                    }
                                    break;
                                }
                                presentation.Recalculate();
                                presentation.Document_UpdateInterfaceState();
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
                        };
                        var oPrepeareImages = new Object();
                        this.api.pre_Paste(fonts, oPrepeareImages, paste_callback);
                        return;
                    case "TeamLab2":
                        var objects = this.ReadPresentationShapes(stream);
                        var arr_shapes = objects.arrShapes;
                        var arrTransforms = objects.arrTransforms;
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var font_map = {};
                        var images = [];
                        for (var i = 0; i < arr_shapes.length; ++i) {
                            if (arr_shapes[i].getAllFonts) {
                                arr_shapes[i].getAllFonts(font_map);
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
                                var slide = presentation.Slides[presentation.CurPage];
                                if (presentation.Document_Is_SelectionLocked(changestype_AddShapes, arr_shapes) === false) {
                                    slide.graphicObjects.resetSelectionState();
                                    for (var i = 0; i < arr_shapes.length; ++i) {
                                        if (b_add_slide) {
                                            arr_shapes[i].setParent(presentation.Slides[0]);
                                        }
                                        arr_shapes[i].changeSize(kw, kh);
                                        slide.addToSpTreeToPos(slide.cSld.spTree.length, arr_shapes[i]);
                                        arr_shapes[i].select(slide.graphicObjects);
                                        var current_shape = arr_shapes[i];
                                        if (!current_shape.checkNotNullTransform() && arrTransforms[i]) {
                                            var t = arrTransforms[i];
                                            current_shape.setOffset(t.x, t.y);
                                            current_shape.setExtents(t.extX, t.extY);
                                            if (current_shape instanceof CGroupShape) {
                                                current_shape.setChildOffset(0, 0);
                                                current_shape.setChildExtents(t.extX, t.extY);
                                            }
                                        }
                                    }
                                }
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
                                if (false == (0 == src.indexOf("data:") || 0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                                    oImagesToDownload[src] = 1;
                                }
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
                    case "TeamLab3":
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
                                    sp_tree[s].graphicObject.setStyleIndex(table_style_ids[t]);
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
                            }
                            var arr_indexes = [];
                            for (var i = 0; i < slide_count; ++i) {
                                arr_indexes.push(stream.GetULong());
                            }
                            for (var i = 0; i < layouts_count; ++i) {
                                arr_layouts[i].setMaster(master);
                                arr_layouts[i].changeSize(kw, kh);
                                arr_layouts[i].Width = presentation.Width;
                                arr_layouts[i].Height = presentation.Height;
                                master.addLayout(arr_layouts[i]);
                            }
                            for (var i = 0; i < slide_count; ++i) {
                                arr_slides[i].changeSize(kw, kh);
                                arr_slides[i].setLayout(arr_layouts[arr_indexes[i]]);
                                arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                            }
                        } else {
                            var arr_matched_layout = [];
                            var b_read_layouts = false;
                            for (var i = 0; i < arr_layouts_id.length; ++i) {
                                if (!isRealObject(g_oTableId.Get_ById(arr_layouts_id[i]))) {
                                    b_read_layouts = true;
                                    break;
                                }
                            }
                            if (b_read_layouts) {
                                var layouts_count = stream.GetULong();
                                for (var i = 0; i < layouts_count; ++i) {
                                    arr_layouts[i] = loader.ReadSlideLayout();
                                }
                                var arr_indexes = [];
                                for (var i = 0; i < slide_count; ++i) {
                                    arr_indexes.push(stream.GetULong());
                                }
                                var addedLayouts = [];
                                for (var i = 0; i < slide_count; ++i) {
                                    if (isRealObject(g_oTableId.Get_ById(arr_layouts_id[i]))) {
                                        arr_slides[i].changeSize(kw, kh);
                                        arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                        arr_slides[i].setLayout(g_oTableId.Get_ById(arr_layouts_id[i]));
                                    } else {
                                        arr_slides[i].changeSize(kw, kh);
                                        arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                        arr_slides[i].setLayout(arr_layouts[arr_indexes[i]]);
                                        for (var j = 0; j < addedLayouts.length; ++j) {
                                            if (addedLayouts[j] === arr_layouts[arr_indexes[i]]) {
                                                break;
                                            }
                                        }
                                        if (j === addedLayouts.length) {
                                            addedLayouts.push(arr_layouts[arr_indexes[i]]);
                                            arr_layouts[arr_indexes[i]].setMaster(master);
                                            arr_layouts[arr_indexes[i]].changeSize(kw, kh);
                                            arr_layouts[arr_indexes[i]].Width = presentation.Width;
                                            arr_layouts[arr_indexes[i]].Height = presentation.Height;
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < slide_count; ++i) {
                                    arr_slides[i].changeSize(kw, kh);
                                    arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
                                    arr_slides[i].setLayout(g_oTableId.Get_ById(arr_layouts_id[i]));
                                    arr_slides[i].Width = presentation.Width;
                                    arr_slides[i].Height = presentation.Height;
                                }
                            }
                        }
                        var presentation = editor.WordControl.m_oLogicDocument;
                        oThis = this;
                        var font_map = {};
                        var images = [];
                        for (var i = 0; i < arr_slides.length; ++i) {
                            if (arr_slides[i].getAllFonts) {
                                arr_slides[i].getAllFonts(font_map);
                            }
                            if (arr_slides[i].getAllImages) {
                                arr_slides[i].getAllImages(images);
                            }
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
                            if (false == oThis.bNested) {
                                for (var i = 0; i < arr_slides.length; ++i) {
                                    var cur_arr_transform = arr_arrTransforms[i];
                                    var cur_slide = arr_slides[i];
                                    var sp_tree = cur_slide.cSld.spTree;
                                    for (var j = 0; j < sp_tree.length; ++j) {
                                        var sp = sp_tree[j];
                                        if (!sp.checkNotNullTransform() && cur_arr_transform && cur_arr_transform[j]) {
                                            var t_object = cur_arr_transform[j];
                                            sp.setOffset(t_object.x, t_object.y);
                                            sp.setExtents(t_object.extX, t_object.extY);
                                            if (sp instanceof CGroupShape) {
                                                sp.setChildOffset(0, 0);
                                                sp.setChildExtents(t_object.extX, t_object.extY);
                                            }
                                        }
                                    }
                                    presentation.insertSlide(presentation.CurPage + i + 1, cur_slide);
                                }
                                presentation.Recalculate();
                                nodeDisplay.blur();
                                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
                            }
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
                                            arr_shapes[i].changeSize(kw, kh);
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
                        var oPrepeareImages = new Object();
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
                }
            }
            this.oRootNode = node;
            this._Prepeare(node, function () {
                oThis.aContent = new Array();
                var arrShapes = [],
                arrImages = [],
                arrTables = [];
                var presentation = editor.WordControl.m_oLogicDocument;
                var b_add_slide = false;
                if (presentation.Slides.length === 0) {
                    presentation.addNextSlide();
                    b_add_slide = true;
                }
                var shape = new CShape(presentation.Slides[presentation.CurPage]);
                shape.setTextBody(new CTextBody(shape));
                var dd = presentation.DrawingDocument;
                arrShapes.push(shape);
                shape.setXfrm(dd.GetMMPerDot(node["offsetLeft"]), dd.GetMMPerDot(node["offsetTop"]), null, null, null, null, null);
                var ret = oThis._ExecutePresentation(node, {},
                true, true, false, arrShapes, arrImages, arrTables);
                for (var i = 0; i < arrShapes.length; ++i) {
                    shape = arrShapes[i];
                    if (shape.txBody.content.Content.length > 1) {
                        shape.txBody.content.Internal_Content_Remove(0, 1);
                    }
                    var w = shape.txBody.getRectWidth(presentation.Width * 2 / 3);
                    var h = shape.txBody.getRectHeight(2000, w);
                    shape.setXfrm(null, null, w, h, null, null, null);
                }
                if (false == oThis.bNested) {
                    var slide = presentation.Slides[presentation.CurPage];
                    if ((slide.graphicObjects.State.id === STATES_ID_TEXT_ADD || slide.graphicObjects.State.id === STATES_ID_TEXT_ADD_IN_GROUP) && arrShapes.length === 1 && arrImages.length === 0 && arrTables.length === 0) {
                        if (presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                            var content;
                            var textObject = slide.graphicObjects.State.textObject;
                            if (textObject instanceof CShape) {
                                content = textObject.txBody.content;
                            } else {
                                content = textObject.graphicObject.CurCell.Content;
                            }
                            presentation.recalcMap[textObject.Get_Id()] = textObject;
                            oThis.insertInPlace2(content, arrShapes[0].txBody.content.Content);
                            arrShapes[0].txBody.content = new CDocumentContent(arrShapes[0].txBody, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, false);
                            arrShapes[0].txBody.setDocContent(shape.txBody.content);
                            presentation.Recalculate();
                            presentation.Document_UpdateInterfaceState();
                        }
                    } else {
                        var check_objectcs = arrShapes.concat(arrImages).concat(arrTables);
                        if (presentation.Document_Is_SelectionLocked(changestype_AddShapes, check_objectcs) === false) {
                            slide.graphicObjects.resetSelectionState();
                            if (arrShapes.length === 1 && arrShapes[0].txBody.content.Is_Empty()) {
                                arrShapes.length = 0;
                            }
                            for (var i = 0; i < arrShapes.length; ++i) {
                                var new_pos_x = (presentation.Width - arrShapes[i].spPr.xfrm.extX) / 2;
                                var new_pos_y = (presentation.Height - arrShapes[i].spPr.xfrm.extY) / 2;
                                arrShapes[i].setOffset(new_pos_x, new_pos_y);
                                arrShapes[i].select(slide.graphicObjects);
                                slide.addToSpTreeToPos(slide.cSld.spTree.length, arrShapes[i]);
                                presentation.recalcMap[arrShapes[i].Get_Id()] = arrShapes[i];
                            }
                            for (var i = 0; i < arrImages.length; ++i) {
                                arrImages[i].select(slide.graphicObjects);
                                slide.addToSpTreeToPos(slide.cSld.spTree.length, arrImages[i]);
                                presentation.recalcMap[arrImages[i].Get_Id()] = arrImages[i];
                            }
                            for (var i = 0; i < arrTables.length; ++i) {
                                arrTables[i].select(slide.graphicObjects);
                                slide.addToSpTreeToPos(slide.cSld.spTree.length, arrTables[i]);
                                arrTables[i].recalcAll();
                                presentation.recalcMap[arrTables[i].Get_Id()] = arrTables[i];
                            }
                            presentation.Recalculate();
                            presentation.Document_UpdateInterfaceState();
                        }
                    }
                }
                nodeDisplay.blur();
                nodeDisplay.style.display = ELEMENT_DISPAY_STYLE;
            });
        }
    },
    ReadPresentationText: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape = new CShape(presentation.Slides[presentation.CurPage]);
        shape.setTextBody(new CTextBody(shape));
        var count = stream.GetULong();
        shape.txBody.content.Internal_Content_RemoveAll();
        for (var i = 0; i < count; ++i) {
            loader.stream.Skip2(1);
            var _paragraph = loader.ReadParagraph(shape.txBody.content);
            shape.txBody.content.Internal_Content_Add(shape.txBody.content.Content.length, _paragraph);
        }
        return shape;
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
        for (var i = 0; i < count; ++i) {
            loader.TempMainObject = presentation.Slides[presentation.CurPage];
            var style_index = null;
            if (!loader.stream.GetBool()) {
                if (loader.stream.GetBool()) {
                    style_index = stream.GetULong();
                }
            }
            arr_shapes.push(loader.ReadGraphicObject());
            if (isRealNumber(style_index)) {
                if (arr_shapes[arr_shapes.length - 1] instanceof CGraphicFrame) {
                    if (loader.presentation.globalTableStyles[style_index]) {
                        arr_shapes[arr_shapes.length - 1].graphicObject.setStyleIndex(style_index);
                    }
                }
            }
            if (arr_shapes[arr_shapes.length - 1] instanceof CGraphicFrame) {
                arr_shapes[arr_shapes.length - 1].setGraphicObject(arr_shapes[arr_shapes.length - 1].graphicObject.Copy(arr_shapes[arr_shapes.length - 1]));
            }
            if (typeof CChartAsGroup != "undefined" && arr_shapes[arr_shapes.length - 1] instanceof CChartAsGroup) {
                var chart = arr_shapes[arr_shapes.length - 1];
                var copy = chart.copy(chart.parent);
                arr_shapes[arr_shapes.length - 1] = copy;
            }
        }
        for (var i = 0; i < count; ++i) {
            var x = stream.GetULong() / 100000;
            var y = stream.GetULong() / 100000;
            var extX = stream.GetULong() / 100000;
            var extY = stream.GetULong() / 100000;
            arr_transforms.push({
                x: x,
                y: y,
                extX: extX,
                extY: extY
            });
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
        for (var i = 0; i < count; ++i) {
            arr_slides.push(loader.ReadSlide(0));
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
            this._Prepeare_recursive(node, true);
            var aPrepeareFonts = new Array();
            for (font_family in this.oFonts) {
                var oFontItem = this.oFonts[font_family];
                var index = this.map_font_index[oFontItem.Name];
                if (null != index) {
                    this.oFonts[font_family].Index = index;
                    aPrepeareFonts.push(new CFont(oFontItem.Name, 0, "", 0));
                } else {
                    this.oFonts[font_family] = {
                        Name: "Arial",
                        Index: -1
                    };
                    aPrepeareFonts.push(new CFont("Arial", 0, "", 0));
                }
            }
            var aImagesToDownload = new Array();
            for (image in this.oImages) {
                var src = this.oImages[image];
                if (0 == src.indexOf("file:")) {
                    this.oImages[image] = "local";
                } else {
                    if (false == (0 == src.indexOf("data:") || 0 == src.indexOf(documentOrigin + this.api.DocumentUrl) || 0 == src.indexOf(this.api.DocumentUrl))) {
                        aImagesToDownload.push(src);
                    }
                }
            }
            var oPrepeareImages = new Object();
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
    _Prepeare_recursive: function (node, bIgnoreStyle) {
        var nodeName = node.nodeName.toLowerCase();
        var nodeType = node.nodeType;
        if (!bIgnoreStyle) {
            if (Node.TEXT_NODE == nodeType) {
                var computedStyle = this._getComputedStyle(node.parentNode);
                if (computedStyle) {
                    var fontFamily = computedStyle.getPropertyValue("font-family");
                    var sNewFF;
                    var nIndex = fontFamily.indexOf(",");
                    if (-1 != nIndex) {
                        sNewFF = fontFamily.substring(0, nIndex);
                    } else {
                        sNewFF = fontFamily;
                    }
                    var nLength = sNewFF.length;
                    if (nLength >= 2) {
                        var nStart = 0;
                        var nStop = nLength;
                        var cFirstChar = sNewFF[0];
                        var cLastChar = sNewFF[nLength - 1];
                        var bTrim = false;
                        if ("'" == cFirstChar || '"' == cFirstChar) {
                            bTrim = true;
                            nStart = 1;
                        }
                        if ("'" == cLastChar || '"' == cLastChar) {
                            bTrim = true;
                            nStop = nLength - 1;
                        }
                        if (bTrim) {
                            sNewFF = sNewFF.substring(nStart, nStop);
                        }
                    }
                    this.oFonts[fontFamily] = {
                        Name: sNewFF,
                        Index: -1
                    };
                }
            } else {
                var src = node.getAttribute("src");
                if (src) {
                    this.oImages[src] = src;
                }
                var binary_shape = node.getAttribute("alt");
                if (binary_shape) {
                    var b_history_is_on = History.Is_On();
                    if (b_history_is_on) {
                        History.TurnOff();
                    }
                    var sub;
                    var checkSheetsData;
                    if (typeof binary_shape === "string") {
                        sub = binary_shape.substr(0, 12);
                        checkSheetsData = binary_shape.substring(12, 18);
                    }
                    if (typeof binary_shape === "string" && (sub === "TeamLabShape" || sub === "TeamLabImage" || sub === "TeamLabChart" || sub === "TeamLabGroup") && checkSheetsData != "Sheets" && g_bIsDocumentCopyPaste) {
                        var reader = CreateBinaryReader(binary_shape, 12, binary_shape.length);
                        var first_string = null;
                        if (reader !== null && typeof reader === "object") {
                            first_string = sub;
                        }
                        var Drawing;
                        var src_string;
                        switch (first_string) {
                        case "TeamLabImage":
                            case "TeamLabChart":
                            Drawing = CreateParaDrawingFromBinary(reader, true);
                            if (isRealObject(Drawing) && isRealObject(Drawing.GraphicObj) && isRealObject(Drawing.GraphicObj.blipFill) && typeof Drawing.GraphicObj.blipFill.RasterImageId === "string") {
                                src_string = Drawing.GraphicObj.blipFill.RasterImageId;
                                if (typeof src_string === "string") {
                                    this.oImages[src_string] = src_string;
                                }
                            }
                            break;
                        case "TeamLabShape":
                            case "TeamLabGroup":
                            Drawing = CreateParaDrawingFromBinary(reader, true);
                            if (isRealObject(Drawing) && isRealObject(Drawing.GraphicObj)) {
                                if (typeof Drawing.GraphicObj.isShape === "function" && Drawing.GraphicObj.isShape() === true) {
                                    if (isRealObject(Drawing.GraphicObj.spPr) && isRealObject(Drawing.GraphicObj.spPr.Fill) && isRealObject(Drawing.GraphicObj.spPr.Fill.fill) && typeof Drawing.GraphicObj.spPr.Fill.fill.RasterImageId === "string") {
                                        src_string = Drawing.GraphicObj.spPr.Fill.fill.RasterImageId;
                                        if (typeof src_string === "string") {
                                            this.oImages[src_string] = src_string;
                                        }
                                    }
                                }
                                if (typeof Drawing.GraphicObj.isGroup === "function" && Drawing.GraphicObj.isGroup() === true) {
                                    var sp_tree = Drawing.GraphicObj.getSpTree2();
                                    if (Array.isArray(sp_tree)) {
                                        for (var index = 0; index < sp_tree.length; ++index) {
                                            var sp = sp_tree[index];
                                            if (isRealObject(sp)) {
                                                if (typeof sp.isImage === "function" && sp.isImage()) {
                                                    if (isRealObject(sp.blipFill) && typeof sp.blipFill.RasterImageId === "string") {
                                                        src_string = sp.blipFill.RasterImageId;
                                                        if (typeof src_string === "string") {
                                                            this.oImages[src_string] = src_string;
                                                        }
                                                    }
                                                }
                                                if (typeof sp.isShape === "function" && sp.isShape()) {
                                                    if (isRealObject(sp.spPr) && isRealObject(sp.spPr.Fill) && isRealObject(sp.spPr.Fill.fill) && typeof sp.spPr.Fill.fill.RasterImageId === "string") {
                                                        src_string = sp.spPr.Fill.fill.RasterImageId;
                                                        if (typeof src_string === "string") {
                                                            this.oImages[src_string] = src_string;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                    if (b_history_is_on) {
                        History.TurnOn();
                    }
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
        if (null != pNoHtmlPr.hLevel) {
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
                if (null == NumId) {
                    NumId = this.oLogicDocument.Numbering.Create_AbstractNum();
                    NumLvl = 0;
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
                        var oLvl = AbstractNum.Lvl[0];
                        var oTextPr = this._read_rPr(oFirstTextChild);
                        if (numbering_numfmt_Bullet == num) {
                            oTextPr.RFonts = oLvl.TextPr.RFonts.Copy();
                        }
                        AbstractNum.Apply_TextPr(0, oTextPr);
                    }
                }
                Para.Numbering_Add(NumId, 0);
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
    _commit_rPr: function (node) {
        var rPr = this._read_rPr(node);
        if (false == Common_CmpObj2(this.oCur_rPr, rPr)) {
            this._Paragraph_Add(new ParaTextPr(rPr));
            this.oCur_rPr = rPr;
        }
    },
    _read_rPr: function (node) {
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
            while (true) {
                var tempComputedStyle = this._getComputedStyle(oTempNode);
                if (null == tempComputedStyle) {
                    break;
                }
                if (null == underline || null == Strikeout) {
                    text_decoration = tempComputedStyle.getPropertyValue("text-decoration");
                    if (text_decoration) {
                        if (-1 != text_decoration.indexOf("underline")) {
                            underline = true;
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
    _Paragraph_Add: function (elem) {
        if (null != this.oCurPar) {
            this.oCurPar.Internal_Content_Add(this.oCurParContentPos, elem);
            this.oCurParContentPos++;
        }
    },
    _Add_NewParagraph: function () {
        this.oCurPar = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
        this.oCurParContentPos = this.oCurPar.CurPos.ContentPos;
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
            if (this.bInBlock) {
                this._Paragraph_Add(new ParaNewLine(break_Line));
            } else {
                this._Execute_AddParagraph(node, pPr);
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
        var aColsCountByRow = new Array();
        var oRowSums = new Object();
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = new Object();
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
            var aGrid = new Array();
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
            var aSumGrid = new Array();
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
                computedStyleParent = this._getComputedStyle(tableNode.parentNode);
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
            var tblPrMso = new Object();
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
            background_color = computedStyle.getPropertyValue("background-color");
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
        var oRowSpans = new Object();
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
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
            var tcPr = new Object();
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
            background_color = computedStyle.getPropertyValue("background-color");
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
            cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i]);
        }
        cell.Content.Internal_Content_Remove(0, 1);
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
                        var oTargetNode = node;
                        if (null != node.parentNode && false == this._IsBlockElem(node.parentNode.nodeName.toLowerCase())) {
                            oTargetNode = node.parentNode;
                        }
                        bAddParagraph = this._Decide_AddParagraph(oTargetNode, pPr, bAddParagraph);
                        this._commit_rPr(oTargetNode);
                        for (var i = 0, length = value.length; i < length; i++) {
                            var Char = value.charAt(i);
                            var Code = value.charCodeAt(i);
                            var Item;
                            if (32 == Code || 160 == Code) {
                                Item = new ParaSpace();
                            } else {
                                Item = new ParaText(value[i]);
                            }
                            this._Paragraph_Add(Item);
                        }
                    }
                }
                return bAddParagraph;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if ("table" == sNodeName) {
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
            if ("img" == sNodeName) {
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
                            if (bUseScaleKoef) {
                                var dTemp = nWidth;
                                nWidth *= dScaleKoef;
                                nHeight *= dScaleKoef;
                            }
                            var oTargetDocument = this.oDocument;
                            var oDrawingDocument = this.oDocument.DrawingDocument;
                            if (oTargetDocument && oDrawingDocument) {
                                var binary_shape = node.getAttribute("alt");
                                var sub;
                                var checkSheetsData;
                                if (typeof binary_shape === "string") {
                                    sub = binary_shape.substr(0, 12);
                                    checkSheetsData = binary_shape.substring(12, 18);
                                }
                                if (typeof binary_shape === "string" && (sub === "TeamLabShape" || sub === "TeamLabImage" || sub === "TeamLabChart" || sub === "TeamLabGroup") && checkSheetsData != "Sheets") {
                                    var reader = CreateBinaryReader(binary_shape, 12, binary_shape.length);
                                    if (isRealObject(reader)) {
                                        reader.oImages = this.oImages;
                                    }
                                    var first_string = null;
                                    if (reader !== null && typeof reader === "object") {
                                        first_string = sub;
                                    }
                                    var Drawing;
                                    switch (first_string) {
                                    case "TeamLabImage":
                                        case "TeamLabChart":
                                        Drawing = CreateParaDrawingFromBinary(reader);
                                        break;
                                    case "TeamLabShape":
                                        case "TeamLabGroup":
                                        if (this.oDocument.Is_TopDocument()) {
                                            Drawing = CreateParaDrawingFromBinary(reader);
                                        } else {
                                            var cur_parent = this.oDocument;
                                            if (cur_parent.Is_TableCellContent()) {
                                                while (isRealObject(cur_parent) && cur_parent.Is_TableCellContent()) {
                                                    cur_parent = cur_parent.Parent.Row.Table.Parent;
                                                }
                                            }
                                            if (cur_parent.Parent instanceof WordShape) {
                                                Drawing = CreateImageFromBinary(sSrc);
                                            } else {
                                                Drawing = CreateParaDrawingFromBinary(reader);
                                            }
                                        }
                                        break;
                                    default:
                                        Drawing = CreateImageFromBinary(sSrc);
                                        break;
                                    }
                                } else {
                                    Drawing = CreateImageFromBinary(sSrc, nWidth, nHeight);
                                }
                                this._Paragraph_Add(Drawing);
                            }
                        }
                    } else {
                        if (nWidth && nHeight && AscBrowser.isIE) {
                            var binary_shape = node.getAttribute("alt");
                            if (typeof binary_shape === "string") {
                                nWidth = nWidth * g_dKoef_pix_to_mm;
                                nHeight = nHeight * g_dKoef_pix_to_mm;
                                var bUseScaleKoef = this.bUseScaleKoef;
                                var dScaleKoef = this.dScaleKoef;
                                if (nWidth * dScaleKoef > this.dMaxWidth) {
                                    dScaleKoef = dScaleKoef * this.dMaxWidth / nWidth;
                                    bUseScaleKoef = true;
                                }
                                if (bUseScaleKoef) {
                                    var dTemp = nWidth;
                                    nWidth *= dScaleKoef;
                                    nHeight *= dScaleKoef;
                                }
                                var oTargetDocument = this.oDocument;
                                var oDrawingDocument = this.oDocument.DrawingDocument;
                                if (oTargetDocument && oDrawingDocument) {
                                    var sub;
                                    var checkSheetsData;
                                    if (typeof binary_shape === "string") {
                                        sub = binary_shape.substr(0, 12);
                                        checkSheetsData = binary_shape.substring(12, 18);
                                    }
                                    if (typeof binary_shape === "string" && (sub === "TeamLabShape" || sub === "TeamLabImage" || sub === "TeamLabChart" || sub === "TeamLabGroup") && checkSheetsData != "Sheets") {
                                        var reader = CreateBinaryReader(binary_shape, 12, binary_shape.length);
                                        if (isRealObject(reader)) {
                                            reader.oImages = this.oImages;
                                        }
                                        var first_string = null;
                                        if (reader !== null && typeof reader === "object") {
                                            first_string = sub;
                                        }
                                        var Drawing;
                                        switch (first_string) {
                                        case "TeamLabImage":
                                            case "TeamLabChart":
                                            Drawing = CreateParaDrawingFromBinary(reader);
                                            this._Paragraph_Add(Drawing);
                                            break;
                                        case "TeamLabShape":
                                            case "TeamLabGroup":
                                            if (this.oDocument.Is_TopDocument()) {
                                                Drawing = CreateParaDrawingFromBinary(reader);
                                            } else {
                                                var cur_parent = this.oDocument;
                                                if (cur_parent.Is_TableCellContent()) {
                                                    while (isRealObject(cur_parent) && cur_parent.Is_TableCellContent()) {
                                                        cur_parent = cur_parent.Parent.Row.Table.Parent;
                                                    }
                                                }
                                                if (cur_parent.Parent instanceof WordShape) {
                                                    Drawing = CreateParaDrawingFromBinary(reader);
                                                    var bounds = Drawing.getBounds();
                                                    Drawing = CreateImageFromBinary2(Drawing.GraphicObj.getBase64Img(), bounds.r - bounds.l, bounds.b - bounds.t);
                                                } else {
                                                    Drawing = CreateParaDrawingFromBinary(reader);
                                                }
                                            }
                                            this._Paragraph_Add(Drawing);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return bAddParagraph;
                } else {
                    return false;
                }
            }
            if ("br" == sNodeName || "always" == node.style.pageBreakBefore) {
                if ("always" == node.style.pageBreakBefore) {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);
                    bAddParagraph = true;
                    this._Commit_Br(0, node, pPr);
                    this._Paragraph_Add(new ParaNewLine(break_Page));
                } else {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph, false);
                    this.nBrCount++;
                    if ("line-break" == pPr["mso-special-character"]) {
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
            var bHyperlink = false;
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
                    bAddParagraph = this._Decide_AddParagraph(child, pPr, bAddParagraph);
                    var oHyperlink = new ParaHyperlinkStart();
                    oHyperlink.Set_Value(href);
                    if (null != title) {
                        oHyperlink.Set_ToolTip(title);
                    }
                    this._Paragraph_Add(oHyperlink);
                }
            }
            bAddParagraph = this._Execute(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock);
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
            if ("a" == sChildNodeName && true == bHyperlink) {
                this._Paragraph_Add(new ParaHyperlinkEnd());
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
                        shape.txBody.content.Add_NewParagraph();
                        var rPr = this._read_rPr(node.parentNode);
                        var Item = new ParaTextPr(rPr);
                        shape.paragraphAdd(Item);
                        for (var i = 0, length = value.length; i < length; i++) {
                            var Char = value.charAt(i);
                            var Code = value.charCodeAt(i);
                            var Item;
                            if (32 == Code || 160 == Code) {
                                Item = new ParaSpace();
                            } else {
                                Item = new ParaText(value[i]);
                            }
                            shape.paragraphAdd(Item);
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
                        var image = new CImageShape(presentation.Slides[presentation.CurPage]);
                        var blipFill = new CUniFill();
                        blipFill.fill = new CBlipFill();
                        blipFill.fill.RasterImageId = sSrc;
                        image.setBlipFill(blipFill);
                        image.setGeometry(CreateGeometry("rect"));
                        image.spPr.geometry.Init(5, 5);
                        image.setXfrm(node["offsetLeft"], node["offsetTop"], nWidth, nHeight, null, null, null);
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
                    var rPr = this._read_rPr(node);
                    var Item = new ParaText(rPr);
                    shape.paragraphAdd(Item);
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
                    var oHyperlink = new ParaHyperlinkStart();
                    oHyperlink.Set_Value(href);
                    if (null != title) {
                        oHyperlink.Set_ToolTip(title);
                    }
                    shape.paragraphAdd(oHyperlink);
                }
            }
            bAddParagraph = this._ExecutePresentation(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock, arrShapes, arrImages, arrTables);
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
            if ("a" == sChildNodeName && true == bHyperlink) {
                shape.paragraphAdd(new ParaHyperlinkEnd());
            }
        }
        if (bRoot) {}
        return;
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
        var aColsCountByRow = new Array();
        var oRowSums = new Object();
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = new Object();
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
            var aGrid = new Array();
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
            var table = new CTable(presentation.DrawingDocument, graphicFrame, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid);
            table.Set_TableStyle(0);
            var dd = editor.WordControl.m_oDrawingDocument;
            graphicFrame.setGraphicObject(table);
            arrTables.push(graphicFrame);
            graphicFrame.setXfrm(dd.GetMMPerDot(node["offsetLeft"]), dd.GetMMPerDot(node["offsetTop"]), dd.GetMMPerDot(node["offsetWidth"]), dd.GetMMPerDot(node["offsetHeight"]), null, null, null);
            var aSumGrid = new Array();
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
                computedStyleParent = this._getComputedStyle(tableNode.parentNode);
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
            var tblPrMso = new Object();
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
            background_color = computedStyle.getPropertyValue("background-color");
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
        var oRowSpans = new Object();
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
            var tcPr = new Object();
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
            background_color = computedStyle.getPropertyValue("background-color");
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
        var shape = new CShape(presentation.Slides[presentation.CurPage]);
        var dd = presentation.DrawingDocument;
        shape.setTextBody(new CTextBody(shape));
        shape.setXfrm(dd.GetMMPerDot(node["offsetLeft"]), dd.GetMMPerDot(node["offsetTop"]), dd.GetMMPerDot(node["offsetWidth"]), dd.GetMMPerDot(node["offsetHeight"]), null, null, null);
        arrShapes2.push(shape);
        this._ExecutePresentation(node, {},
        true, true, false, arrShapes2, arrImages2, arrTables);
        if (arrShapes2.length > 0) {
            var first_shape = arrShapes2[0];
            var content = first_shape.txBody.content;
            for (var i = 0, length = content.Content.length; i < length; ++i) {
                cell.Content.Internal_Content_Add(i + 1, content.Content[i]);
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
    }
};
function SafariIntervalFocus() {
    if (window.editor && window.editor.WordControl && window.editor.WordControl.IsFocus && (!window.editor.WordControl.TextBoxInputFocus)) {
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
    var Def_rPr = api.WordControl.m_oLogicDocument.Styles.Default.TextPr;
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
    var TIME_PREVIOS_ONBEFORE_EVENTS = new Date().getTime();
    ElemToSelect["onbeforecut"] = function (e) {
        var _time = new Date().getTime();
        if (_time - TIME_PREVIOS_ONBEFORE_EVENTS < 100) {
            return;
        }
        api.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        Editor_Copy(api, true);
        TIME_PREVIOS_ONBEFORE_EVENTS = new Date().getTime();
    };
    ElemToSelect["onbeforecopy"] = function (e) {
        var _time = new Date().getTime();
        if (_time - TIME_PREVIOS_ONBEFORE_EVENTS < 100) {
            return;
        }
        Editor_Copy(api, false);
        TIME_PREVIOS_ONBEFORE_EVENTS = new Date().getTime();
    };
    document.body.appendChild(ElemToSelect);
}