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
 (function ($, window, undefined) {
    var doc = window.document;
    var isTruePaste = false;
    var activateLocalStorage = true;
    var isOnlyLocalBufferSafari = false;
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else {
                    if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);
            return output;
        },
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else {
                    if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
            }
            return utftext;
        },
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else {
                    if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
            }
            return string;
        }
    };
    function number2color(n) {
        if (typeof(n) == "string" && n.indexOf("rgb") > -1) {
            return n;
        }
        return "rgb(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + ")";
    }
    function Clipboard() {
        if (! (this instanceof Clipboard)) {
            return new Clipboard();
        }
        this.element = undefined;
        this.ppix = 96;
        this.ppiy = 96;
        this.Api = null;
        return this;
    }
    Clipboard.prototype = {
        constructor: Clipboard,
        init: function () {
            var t = this;
            var found = true;
            if (!t.element) {
                t.element = doc.getElementById(COPY_ELEMENT_ID);
                if (!t.element) {
                    found = false;
                    t.element = doc.createElement("DIV");
                }
            }
            t.element.id = COPY_ELEMENT_ID;
            t.element.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
            t.element.style.position = "absolute";
            t.element.style.top = "-100px";
            t.element.style.left = "0px";
            t.element.style.width = "10000px";
            t.element.style.height = "100px";
            t.element.style.overflow = "hidden";
            t.element.style.zIndex = -1000;
            t.element.style.display = ELEMENT_DISPAY_STYLE;
            t.element.setAttribute("contentEditable", true);
            if (!found) {
                doc.body.appendChild(t.element);
            }
            if (!window.g_isMobileVersion) {
                var foundText = true;
                if (!t.elementText) {
                    t.elementText = doc.getElementById(kElementTextId);
                    if (!t.elementText) {
                        foundText = false;
                        t.elementText = doc.createElement("textarea");
                    }
                }
                t.elementText.id = kElementTextId;
                t.elementText.style.position = "absolute";
                t.elementText.style.width = "10000px";
                t.elementText.style.height = "100px";
                t.elementText.style.left = "0px";
                t.elementText.style.top = "-100px";
                t.elementText.style.overflow = "hidden";
                t.elementText.style.zIndex = -1000;
                t.elementText.style.display = ELEMENT_DISPAY_STYLE;
                t.elementText.setAttribute("contentEditable", true);
                if (!foundText) {
                    doc.body.appendChild(t.elementText);
                }
            }
            var div = doc.createElement("DIV");
            div.setAttribute("style", "position:absolute; visibility:hidden; padding:0; height:1in; width:1in;");
            doc.body.appendChild(div);
            this.ppix = div.clientWidth;
            this.ppiy = div.clientHeight;
            doc.body.removeChild(div);
        },
        destroy: function () {
            var p;
            if (this.element) {
                p = this.element.parentNode;
                if (p) {
                    p.removeChild(this.element);
                }
                this.element = undefined;
            }
        },
        copyRange: function (range, worksheet, isCut) {
            var t = this;
            t._cleanElement();
            var text = t._makeTableNode(range, worksheet, isCut);
            if (text == false) {
                return;
            }
            if ($(text).find("td")[0] && $(text).find("td")[0].innerText == "" && $.browser["opera"]) {
                $(text).find("td")[0].innerHTML = "&nbsp;";
            }
            t.element.appendChild(text);
            t.copyText = t._getTextFromTable(t.element.children[0]);
            var randomVal = Math.floor(Math.random() * 10000000);
            t.copyText.pasteFragment = "pasteFragment_" + randomVal;
            if (text) {
                $(text).addClass("pasteFragment_" + randomVal);
            }
            if ($(text).find("img")[0] && $.browser["opera"]) {
                $(text)[0].innerHTML = "<tr><td>&nbsp;</td></tr>";
                if (t.copyText.isImage) {
                    t.copyText.text = " ";
                }
            }
            if ($.browser["mozilla"]) {
                t._selectElement(t._getStylesSelect);
            } else {
                t._selectElement();
            }
        },
        copyRangeButton: function (range, worksheet, isCut) {
            if (AscBrowser.isIE) {
                this._cleanElement();
                this.element.appendChild(this._makeTableNode(range, worksheet));
                var t = this,
                selection, rangeToSelect;
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {};
                }
                if (window.getSelection) {
                    selection = window.getSelection();
                    rangeToSelect = doc.createRange();
                    if (AscBrowser.isGecko) {
                        t.element.appendChild(doc.createTextNode("\xa0"));
                        t.element.insertBefore(doc.createTextNode("\xa0"), t.element.firstChild);
                        rangeToSelect.setStartAfter(t.element.firstChild);
                        rangeToSelect.setEndBefore(t.element.lastChild);
                    } else {
                        rangeToSelect.selectNodeContents(t.element);
                    }
                    selection.removeAllRanges();
                    selection.addRange(rangeToSelect);
                } else {
                    if (doc.body.createTextRange) {
                        rangeToSelect = doc.body.createTextRange();
                        rangeToSelect.moveToElementText(t.element);
                        rangeToSelect.select();
                    }
                }
                document.execCommand("copy");
                window.setTimeout(function () {
                    t.element.style.display = "none";
                    doc.body.style.MozUserSelect = "none";
                    doc.body.style["-khtml-user-select"] = "none";
                    doc.body.style["-o-user-select"] = "none";
                    doc.body.style["user-select"] = "none";
                    doc.body.style["-webkit-user-select"] = "none";
                    if (window.USER_AGENT_IE) {
                        document.onselectstart = function () {
                            return false;
                        };
                    }
                },
                0);
                return true;
            } else {
                if (activateLocalStorage) {
                    var t = this;
                    var table = t._makeTableNode(range, worksheet, isCut);
                    if (table !== false) {
                        t.copyText = t._getTextFromTable(table);
                    }
                    return true;
                }
            }
            return false;
        },
        pasteRangeButton: function (worksheet) {
            if (AscBrowser.isIE) {
                var t = this;
                document.body.style.MozUserSelect = "text";
                delete document.body.style["-khtml-user-select"];
                delete document.body.style["-o-user-select"];
                delete document.body.style["user-select"];
                document.body.style["-webkit-user-select"] = "text";
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {};
                }
                var pastebin = t._editorPasteGetElem(worksheet, true);
                pastebin.style.display = "block";
                pastebin.focus();
                var selection = window.getSelection();
                var rangeToSelect = document.createRange();
                rangeToSelect.selectNodeContents(pastebin);
                selection.removeAllRanges();
                selection.addRange(rangeToSelect);
                document.execCommand("paste");
                pastebin.blur();
                pastebin.style.display = "none";
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
                t._editorPasteExec(worksheet, pastebin);
                return true;
            } else {
                if (activateLocalStorage) {
                    var t = this;
                    var onlyFromLocalStorage = true;
                    t._editorPasteExec(worksheet, t.lStorage, false, onlyFromLocalStorage);
                    return true;
                }
            }
            return false;
        },
        copyCellValue: function (value, background) {
            var t = this;
            if (activateLocalStorage) {
                t._addValueToLocalStrg(value);
            }
            var nodes = t._makeNodesFromCellValue(value);
            var outer;
            if (AscBrowser.isWebkit && nodes.length === 1) {
                outer = doc.createElement("B");
                outer.style.fontWeight = "normal";
                outer.appendChild(nodes[0]);
                nodes[0] = outer;
            }
            t._cleanElement();
            nodes.forEach(function (node) {
                node.style.backgroundColor = background !== null ? background : "transparent";
                t.element.appendChild(node);
            });
            if ($.browser["mozilla"]) {
                t._selectElement(t._getStylesSelect);
            } else {
                t._selectElement();
            }
        },
        copyCellValueButton: function (value, background) {
            if (AscBrowser.isIE) {
                var t = this;
                var nodes = t._makeNodesFromCellValue(value);
                var outer;
                if (AscBrowser.isWebkit && nodes.length === 1) {
                    outer = doc.createElement("B");
                    outer.style.fontWeight = "normal";
                    outer.appendChild(nodes[0]);
                    nodes[0] = outer;
                }
                t._cleanElement();
                nodes.forEach(function (node) {
                    node.style.backgroundColor = background !== null ? background : "transparent";
                    t.element.appendChild(node);
                });
                var t = this,
                selection, rangeToSelect;
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {};
                }
                if (window.getSelection) {
                    selection = window.getSelection();
                    rangeToSelect = doc.createRange();
                    if (AscBrowser.isGecko) {
                        t.element.appendChild(doc.createTextNode("\xa0"));
                        t.element.insertBefore(doc.createTextNode("\xa0"), t.element.firstChild);
                        rangeToSelect.setStartAfter(t.element.firstChild);
                        rangeToSelect.setEndBefore(t.element.lastChild);
                    } else {
                        rangeToSelect.selectNodeContents(t.element);
                    }
                    selection.removeAllRanges();
                    selection.addRange(rangeToSelect);
                } else {
                    if (doc.body.createTextRange) {
                        rangeToSelect = doc.body.createTextRange();
                        rangeToSelect.moveToElementText(t.element);
                        rangeToSelect.select();
                    }
                }
                document.execCommand("copy");
                window.setTimeout(function () {
                    t.element.style.display = "none";
                    doc.body.style.MozUserSelect = "none";
                    doc.body.style["-khtml-user-select"] = "none";
                    doc.body.style["-o-user-select"] = "none";
                    doc.body.style["user-select"] = "none";
                    doc.body.style["-webkit-user-select"] = "none";
                    if (window.USER_AGENT_IE) {
                        document.onselectstart = function () {
                            return false;
                        };
                    }
                },
                0);
                return true;
            } else {
                if (activateLocalStorage) {
                    var t = this;
                    t._addValueToLocalStrg(value);
                    return true;
                }
            }
            return false;
        },
        pasteRange: function (worksheet) {
            var t = this;
            if ($.browser["mozilla"]) {
                t._editorPaste(worksheet, t._getStylesSelect);
            } else {
                t._editorPaste(worksheet);
            }
        },
        pasteCellValue: function (callback) {
            var t = this;
            t._paste(function () {
                t._makeCellValueFromHtml(callback);
            });
        },
        pasteAsText: function (callback) {
            var t = this;
            t.elementText.style.display = "block";
            t.elementText.value = "\xa0";
            t.elementText.focus();
            t.elementText.select();
            delete doc.body.style["-khtml-user-select"];
            delete doc.body.style["-o-user-select"];
            delete doc.body.style["user-select"];
            doc.body.style["-webkit-user-select"] = "text";
            doc.body.style.MozUserSelect = "text";
            if (window.USER_AGENT_IE) {
                document.onselectstart = function () {};
            }
            var _interval_time = 0;
            if ($.browser["mozilla"]) {
                _interval_time = 10;
            }
            window.setTimeout(function () {
                t.element.style.display = ELEMENT_DISPAY_STYLE;
                doc.body.style.MozUserSelect = "none";
                doc.body.style["-khtml-user-select"] = "none";
                doc.body.style["-o-user-select"] = "none";
                doc.body.style["user-select"] = "none";
                doc.body.style["-webkit-user-select"] = "none";
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {
                        return false;
                    };
                }
                t.elementText.style.display = ELEMENT_DISPAY_STYLE;
                var textInsert = t.elementText.value;
                if (isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf("safari") > -1 && navigator.userAgent.toLowerCase().indexOf("mac") && t.lStorageText) {
                    textInsert = t.lStorageText;
                }
                if (callback) {
                    callback(textInsert, []);
                }
                if ($.browser["mozilla"]) {
                    t._getStylesSelect();
                }
            },
            _interval_time);
        },
        pasteAsTextButton: function (callback) {
            var t = this;
            if (AscBrowser.isIE) {
                t.elementText.style.display = "block";
                t.elementText.value = "\xa0";
                t.elementText.focus();
                t.elementText.select();
                delete doc.body.style["-khtml-user-select"];
                delete doc.body.style["-o-user-select"];
                delete doc.body.style["user-select"];
                doc.body.style["-webkit-user-select"] = "text";
                doc.body.style.MozUserSelect = "text";
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {};
                }
                document.execCommand("paste");
                window.setTimeout(function () {
                    t.element.style.display = "none";
                    doc.body.style.MozUserSelect = "none";
                    doc.body.style["-khtml-user-select"] = "none";
                    doc.body.style["-o-user-select"] = "none";
                    doc.body.style["user-select"] = "none";
                    doc.body.style["-webkit-user-select"] = "none";
                    t.elementText.style.display = "none";
                    if (window.USER_AGENT_IE) {
                        document.onselectstart = function () {
                            return false;
                        };
                    }
                    callback(t.elementText.value, []);
                },
                0);
                return true;
            } else {
                if (activateLocalStorage) {
                    if (t.lStorageText) {
                        callback(t.lStorageText, []);
                    }
                    return true;
                }
            }
            return false;
        },
        pastedTextToRange: function (text, ws) {
            var range = ws.activeRange.clone(true);
            text = text.replace(/\r/g, "");
            if (text.length > 0 && "\n" == text[text.length - 1]) {
                text = text.substring(0, text.length - 1);
            }
            var nMaxRowIndex = 1;
            var nMaxColIndex = 1;
            var aLines = text.split("\n");
            var aTextLines = new Array();
            for (var i = 0, length = aLines.length; i < length; ++i) {
                var aCells = aLines[i].split("\t");
                var aTextCells = new Array();
                for (var j = 0, length2 = aCells.length; j < length2; ++j) {
                    var sCellText = aCells[j];
                    if (sCellText) {
                        aTextCells.push(sCellText);
                    } else {
                        aTextCells.push(null);
                    }
                }
                if (nMaxColIndex < aCells.length) {
                    nMaxColIndex = aCells.length;
                }
                aTextLines.push(aTextCells);
            }
            if (nMaxRowIndex < aLines.length) {
                nMaxRowIndex = aLines.length;
            }
            var oPasteRange = null;
            if (1 != nMaxColIndex || nMaxRowIndex > range.r2 - range.r1 + 1) {
                range.c2 = range.c1 + nMaxColIndex - 1;
                range.r2 = range.r1 + nMaxRowIndex - 1;
                var bCorrect = true;
                var fCheckMergedRowCol = function () {
                    bCorrect = false;
                };
                var fCheckMergedRange = function (row, nRowIndex, nColIndex) {
                    if (false == bCorrect) {
                        return;
                    }
                    var merged = row[nColIndex];
                    if (null != merged) {
                        var oCurBBox = merged.getBBox0();
                        var bR1In = range.r1 <= oCurBBox.r1 && oCurBBox.r1 <= range.r2;
                        var bR2In = range.r1 <= oCurBBox.r2 && oCurBBox.r2 <= range.r2;
                        var bC1In = range.c1 <= oCurBBox.c1 && oCurBBox.c1 <= range.c2;
                        var bC2In = range.c1 <= oCurBBox.c2 && oCurBBox.c2 <= range.c2;
                        if (false == (bR1In && bR2In && bC1In && bC2In) && true == (bR1In || bR2In || bC1In || bC2In)) {
                            bCorrect = false;
                        }
                    }
                };
                ws.model.oMergedCache._forEachBBox({
                    r1: range.r1,
                    c1: range.c1,
                    r2: range.r2,
                    c2: range.c2
                },
                fCheckMergedRowCol, fCheckMergedRowCol, fCheckMergedRange, null);
                if (false == bCorrect) {
                    return false;
                }
            }
            var rangeToSelect = new Asc.Range(range.c1, range.r1, range.c2, range.r2);
            History.Create_NewPoint();
            History.SetSelection(rangeToSelect.clone(true));
            History.StartTransaction();
            var bOneCellToMerged = false;
            var oRangeWithMerged = ws.model.getRange(new CellAddress(range.r1, range.c1, 0), new CellAddress(range.r2, range.c2, 0));
            if (1 == nMaxColIndex && 1 == nMaxRowIndex) {
                var merged = oRangeWithMerged.hasMerged();
                if (null != merged && merged.r1 == range.r1 && merged.r2 == range.r2 && merged.c1 == range.c1 && merged.c2 == range.c2) {
                    bOneCellToMerged = true;
                    var aTextCells = aTextLines[0];
                    var sCellText = aTextCells[0];
                    var bEmptyInsertText = false;
                    if (null == sCellText || 0 == sCellText.length) {
                        bEmptyInsertText = true;
                    }
                    var oCurCell = null;
                    if (bEmptyInsertText) {
                        oCurCell = ws.model._getCellNoEmpty(range.r1, range.c1);
                    } else {
                        oCurCell = ws.model._getCell(range.r1, range.c1);
                    }
                    if (null != oCurCell) {
                        if (false == bEmptyInsertText || false == oCurCell.isEmptyText()) {
                            oCurCell.setValue(sCellText);
                        }
                    }
                }
            }
            if (false == bOneCellToMerged) {
                oRangeWithMerged.unmerge();
                var nTextRowIndex = 0;
                var nTextColIndex = 0;
                for (var i = 0; i < range.r2 - range.r1 + 1; ++i) {
                    var aTextCells = aTextLines[nTextRowIndex];
                    for (var j = 0; j < range.c2 - range.c1 + 1; ++j) {
                        var sCellText = aTextCells[nTextColIndex];
                        var bEmptyInsertText = false;
                        if (null == sCellText || 0 == sCellText.length) {
                            bEmptyInsertText = true;
                        }
                        var oCurCell = null;
                        if (bEmptyInsertText) {
                            oCurCell = ws.model._getCellNoEmpty(range.r1 + i, range.c1 + j);
                        } else {
                            oCurCell = ws.model._getCell(range.r1 + i, range.c1 + j);
                        }
                        if (null != oCurCell) {
                            if (false == bEmptyInsertText || false == oCurCell.isEmptyText()) {
                                oCurCell.setValue(sCellText);
                            }
                        }
                        nTextColIndex++;
                        if (nTextColIndex >= nMaxColIndex) {
                            nTextColIndex = 0;
                        }
                    }
                    nTextRowIndex++;
                    if (nTextRowIndex >= nMaxRowIndex) {
                        nTextRowIndex = 0;
                    }
                }
            }
            History.EndTransaction();
            range.c1 = 0;
            range.c2 = gc_nMaxCol0;
            ws._calcRowHeights(2);
            ws._calcColumnWidths(2);
            ws.changeWorksheet("updateRange", {
                range: range,
                isLockDraw: false
            });
            ws.setSelection(rangeToSelect);
            return true;
        },
        _cleanElement: function () {
            if (!window.USER_AGENT_SAFARI_MACOS) {
                this.element.style.left = "0px";
                this.element.style.top = "-100px";
            }
            this.element.style.display = "block";
            while (this.element.hasChildNodes()) {
                this.element.removeChild(this.element.lastChild);
            }
            delete doc.body.style["-khtml-user-select"];
            delete doc.body.style["-o-user-select"];
            delete doc.body.style["user-select"];
            doc.body.style["-webkit-user-select"] = "text";
            doc.body.style.MozUserSelect = "text";
        },
        _getStylesSelect: function (worksheet) {
            document.body.style.MozUserSelect = "";
            delete document.body.style["-khtml-user-select"];
            delete document.body.style["-o-user-select"];
            delete document.body.style["user-select"];
            document.body.style["-webkit-user-select"] = "text";
        },
        _editorPaste: function (worksheet, callback) {
            var t = this;
            window.GlobalPasteFlagCounter = 1;
            isTruePaste = false;
            var is_chrome = AscBrowser.isChrome;
            document.body.style.MozUserSelect = "text";
            delete document.body.style["-khtml-user-select"];
            delete document.body.style["-o-user-select"];
            delete document.body.style["user-select"];
            document.body.style["-webkit-user-select"] = "text";
            if (window.USER_AGENT_IE) {
                document.onselectstart = function () {};
            }
            var Text;
            var pastebin = t._editorPasteGetElem(worksheet, true);
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
                if (PASTE_EMPTY_USE && !isTruePaste) {
                    if (pastebin.innerHTML == "&nbsp;") {
                        PASTE_EMPTY_COUNTER++;
                        if (PASTE_EMPTY_COUNTER < PASTE_EMPTY_COUNTER_MAX) {
                            window.setTimeout(func_timeout, 100);
                            return;
                        }
                    }
                }
                if (window.USER_AGENT_SAFARI_MACOS) {
                    if (window.GlobalPasteFlagCounter != 2 && !window.GlobalPasteFlag) {
                        window.setTimeout(func_timeout, 10);
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
                if (!isTruePaste) {
                    t._editorPasteExec(worksheet, pastebin);
                }
                pastebin.style.display = ELEMENT_DISPAY_STYLE;
                if (AscBrowser.isIE) {
                    pastebin.style.display = ELEMENT_DISPAY_STYLE;
                }
                if (callback && callback.call) {
                    callback();
                }
            };
            var _interval_time = window.USER_AGENT_MACOS ? 200 : 100;
            PASTE_EMPTY_COUNTER = 0;
            window.setTimeout(func_timeout, _interval_time);
        },
        _editorPasteGetElem: function (worksheet, bClean) {
            var t = this;
            var pastebin = document.getElementById(PASTE_ELEMENT_ID);
            if (!pastebin) {
                pastebin = document.createElement("div");
                pastebin.setAttribute("id", PASTE_ELEMENT_ID);
                pastebin.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
                pastebin.style.position = "absolute";
                pastebin.style.top = "100px";
                pastebin.style.left = "0px";
                pastebin.style.width = "10000px";
                pastebin.style.height = "100px";
                pastebin.style.overflow = "hidden";
                pastebin.style.zIndex = -1000;
                pastebin.style.lineHeight = "1px";
                pastebin.setAttribute("contentEditable", true);
                pastebin.onpaste = function (e) {
                    if (!window.GlobalPasteFlag) {
                        return;
                    }
                    t._bodyPaste(worksheet, e);
                    pastebin.onpaste = null;
                };
                document.body.appendChild(pastebin);
            } else {
                if (bClean) {
                    var aChildNodes = pastebin.childNodes;
                    for (var length = aChildNodes.length, i = length - 1; i >= 0; i--) {
                        pastebin.removeChild(aChildNodes[i]);
                    }
                    pastebin.onpaste = function (e) {
                        if (!window.GlobalPasteFlag) {
                            return;
                        }
                        t._bodyPaste(worksheet, e);
                        pastebin.onpaste = null;
                    };
                }
            }
            return pastebin;
        },
        _getTableFromText: function (sText) {
            var t = this;
            var sHtml = "<html><body><table>";
            var sCurPar = "";
            var sCurChar = "";
            for (var i = 0, length = sText.length; i < length; i++) {
                var Char = sText.charAt(i);
                var Code = sText.charCodeAt(i);
                var Item = null;
                if ("\n" === Char) {
                    if ("" == sCurChar && sCurPar == "") {
                        sHtml += "<tr><td style='font-family:Calibri'>&nbsp;</td></tr>";
                    } else {
                        if (sCurPar == "") {
                            sHtml += "<tr><td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td></tr>";
                            sCurChar = "";
                        } else {
                            if (sCurPar != "") {
                                if (sCurChar == "") {
                                    sCurPar += "<td style='font-family:Calibri'>&nbsp;</td>";
                                } else {
                                    sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td>";
                                }
                                sHtml += "<tr>" + sCurPar + "</tr>";
                                sCurChar = "";
                                sCurPar = "";
                            }
                        }
                    }
                } else {
                    if (13 === Code) {
                        continue;
                    } else {
                        if (32 == Code || 160 == Code) {
                            sCurChar += " ";
                        } else {
                            if (9 === Code) {
                                sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td>";
                                if (i == length - 1) {
                                    sHtml += "<tr>" + sCurPar + "</tr>";
                                }
                                sCurChar = "";
                            } else {
                                sCurChar += t._copyPasteCorrectString(Char);
                                if (i == length - 1) {
                                    sCurPar += "<td><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + sCurChar + "</span></td>";
                                    sHtml += "<tr>" + sCurPar + "</tr>";
                                }
                            }
                        }
                    }
                }
            }
            sHtml += "</table></body></html>";
            return sHtml;
        },
        _getTextFromTable: function (table) {
            var images = $(table).find("img");
            if (images.length != 0 && images.length == $(table).children().length) {
                var stringImg = {};
                stringImg.isImage = true;
                stringImg.text = "";
                for (var i = 0; i < images.length; i++) {
                    stringImg.text += images[i].name + ";";
                }
                return stringImg;
            }
            if (table.children && table.children[0] && table.children[0].nodeName.toLowerCase() == "br") {
                $(table.children[0]).remove();
            }
            if ((table.children[0] && table.children[0].tagName.toLowerCase() == "table" && table.children.length == 1)) {
                table = table.children[0];
            }
            var textNode = {};
            if (table.tagName.toLowerCase() != "table") {
                textNode.text = $(table).text();
            } else {
                textNode.text = $(table).text();
                if (table.rows) {
                    textNode.rows = table.rows.length;
                } else {
                    textNode.rows = 0;
                }
                if (table.rows[0] && table.rows[0].cells) {
                    textNode.cols = table.rows[0].cells.length + table.rows[0].cells[0].colSpan - 1;
                }
            }
            return textNode;
        },
        _bodyPaste: function (worksheet, e) {
            var t = this;
            if (e && e.clipboardData && e.clipboardData.getData) {
                var bExist = false;
                var is_chrome = AscBrowser.isChrome;
                var sHtml = null;
                var isText = false;
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
                        sHtml = t._getTableFromText(sText);
                        isText = true;
                    }
                }
                if (null != sHtml) {
                    t._addHtmlToIframe(worksheet, sHtml, isText, e);
                } else {
                    var items = e.clipboardData.items;
                    if (null != items) {
                        for (var i = 0; i < items.length; ++i) {
                            if (items[i].kind == "file" && items[i].type.indexOf("image/") !== -1) {
                                var blob = items[i].getAsFile();
                                var reader = new FileReader();
                                reader.onload = function (evt) {
                                    t._addHtmlToIframe(worksheet, '<html><body><img src="' + evt.target.result + '"/></body></html>', isText, evt);
                                };
                                reader.readAsDataURL(blob);
                            }
                        }
                    }
                }
            }
        },
        _addHtmlToIframe: function (worksheet, sHtml, isText, e) {
            var t = this;
            var bExist = false;
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
            ifr.style.display = "block";
            var frameWindow = window.frames["pasteFrame"];
            if (frameWindow) {
                frameWindow.document.open();
                frameWindow.document.write(sHtml);
                frameWindow.document.close();
                var bodyFrame = frameWindow.document.body;
                if (bodyFrame && bodyFrame != null) {
                    t._editorPasteExec(worksheet, frameWindow.document.body, isText);
                    window.GlobalPasteFlag = false;
                    window.GlobalPasteFlagCounter = 0;
                    bExist = true;
                }
                ifr.style.display = ELEMENT_DISPAY_STYLE;
            }
            if (bExist) {
                isTruePaste = true;
                if (e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return false;
            }
        },
        _copyPasteCorrectString: function (str) {
            var res = str;
            res = res.replace(/&/g, "&amp;");
            res = res.replace(/</g, "&lt;");
            res = res.replace(/>/g, "&gt;");
            res = res.replace(/'/g, "&apos;");
            res = res.replace(/"/g, "&quot;");
            return res;
        },
        _setStylesTextPaste: function (spanObject) {
            var t = this;
            var defaultColor = "rgb(0, 0, 0)";
            var oNewItem = new Object();
            oNewItem.text = $(spanObject).text().replace(/(\r|\t|\n|)/g, "");
            oNewItem.format = {};
            oNewItem.format.fn = t._checkFonts(spanObject.style.fontFamily.replace(/'/g, "").split(",")[0]);
            if (oNewItem.format.fn == null || oNewItem.format.fn == "") {
                oNewItem.format.fn = "Calibri";
            }
            if ($(spanObject).css("vertical-align") == "sub" || $(spanObject).css("vertical-align") == "super") {
                if (($(spanObject.parentNode).css("font-size")).indexOf("pt") > -1) {
                    oNewItem.format.fs = parseInt($(spanObject.parentNode).css("font-size"));
                } else {
                    oNewItem.format.fs = parseInt((3 / 4) * Math.round(parseFloat($(spanObject.parentNode).css("font-size"))));
                }
            } else {
                if (spanObject.style.fontSize.indexOf("pt") > -1) {
                    oNewItem.format.fs = parseInt(spanObject.style.fontSize);
                } else {
                    oNewItem.format.fs = parseInt((3 / 4) * Math.round(parseFloat(spanObject.style.fontSize)));
                }
            }
            if (isNaN(oNewItem.format.fs)) {
                oNewItem.format.fs = 11;
            }
            if ($(spanObject).css("font-weight") == "bold") {
                oNewItem.format.b = true;
            } else {
                oNewItem.format.b = false;
            }
            if ($(spanObject).css("font-style") == "italic") {
                oNewItem.format.i = true;
            } else {
                oNewItem.format.i = false;
            }
            if ($(spanObject).css("text-decoration") == "underline") {
                oNewItem.format.u = "single";
            } else {
                oNewItem.format.u = "none";
            }
            if ($(spanObject).css("text-decoration") == "line-through") {
                oNewItem.format.s = true;
            } else {
                oNewItem.format.s = false;
            }
            if ($(spanObject).css("vertical-align") != null) {
                oNewItem.format.va = $(spanObject).css("vertical-align");
            }
            if ($(spanObject).css("vertical-align") == "baseline") {
                oNewItem.format.va = "";
            }
            oNewItem.format.c = $(spanObject).css("color");
            if (oNewItem.format.c == "") {
                oNewItem.format.c = null;
            }
            if ($(spanObject).css("vertical-align") != null) {
                oNewItem.format.va = $(spanObject).css("vertical-align") === "sub" ? "subscript" : $(spanObject).css("vertical-align") === "super" ? "superscript" : "baseline";
            }
            return oNewItem;
        },
        _getDefaultCell: function () {
            var res = [];
            res.push({
                format: {
                    fn: "Arial",
                    fs: "11",
                    b: false,
                    i: false,
                    u: false,
                    s: false,
                    va: "none"
                },
                text: ""
            });
            return res;
        },
        _getBorderStyleName: function (borderStyle, borderWidth) {
            var res = null;
            var nBorderWidth = parseFloat(borderWidth);
            if (isNaN(nBorderWidth)) {
                return res;
            }
            if (-1 !== borderWidth.indexOf("pt")) {
                nBorderWidth = nBorderWidth * 96 / 72;
            }
            switch (borderStyle) {
            case "solid":
                if (0 < nBorderWidth && nBorderWidth <= 1) {
                    res = c_oAscBorderStyles.Thin;
                } else {
                    if (1 < nBorderWidth && nBorderWidth <= 2) {
                        res = c_oAscBorderStyles.Medium;
                    } else {
                        if (2 < nBorderWidth && nBorderWidth <= 3) {
                            res = c_oAscBorderStyles.Thick;
                        } else {
                            res = c_oAscBorderStyles.None;
                        }
                    }
                }
                break;
            case "dashed":
                if (0 < nBorderWidth && nBorderWidth <= 1) {
                    res = c_oAscBorderStyles.DashDot;
                } else {
                    res = c_oAscBorderStyles.MediumDashDot;
                }
                break;
            case "double":
                res = c_oAscBorderStyles.Double;
                break;
            case "dotted":
                res = c_oAscBorderStyles.Hair;
                break;
            }
            return res;
        },
        _getArray: function (node, isText) {
            var aResult = new Array();
            var oNewItem = [];
            var tmpBorderStyle, borderStyleName;
            var t = this;
            if (node == undefined) {
                node = document.createElement("span");
            }
            if (node == undefined || node == null) {
                oNewItem[0] = t._getDefaultCell();
                oNewItem.fonts = [];
                oNewItem.fonts[0] = "Arial";
            } else {
                if (node.children != undefined && node.children.length == 0) {
                    oNewItem[0] = t._setStylesTextPaste(node);
                    oNewItem.fonts = [];
                    oNewItem.fonts[0] = oNewItem[0].format.fn;
                } else {
                    if (typeof(node) == "string" || node.children.length == 0 || node.children.length == 1 && node.children[0].nodeName == "#text") {
                        oNewItem = t._makeCellValuesHtml(node, isText);
                    } else {
                        oNewItem = t._makeCellValuesHtml(node.childNodes, isText);
                    }
                }
            }
            oNewItem.borders = new Border();
            tmpBorderStyle = $(node).css("border-top-style");
            if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                var borderTopWidth = node.style.borderTopWidth;
                if (borderTopWidth == "") {
                    borderTopWidth = $(node).css("border-top-width");
                }
                var borderTopStyle = node.style.borderTopStyle;
                if (borderTopStyle == "") {
                    borderTopStyle = tmpBorderStyle;
                }
                var borderTopColor = 0;
                borderStyleName = this._getBorderStyleName(borderTopStyle, borderTopWidth);
                if (null !== borderStyleName) {
                    oNewItem.borders.t.setStyle(borderStyleName);
                    oNewItem.borders.t.c = new RgbColor(borderTopColor);
                }
            }
            tmpBorderStyle = $(node).css("border-bottom-style");
            if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                var borderBottomWidth = node.style.borderBottomWidth;
                if (borderBottomWidth == "") {
                    borderBottomWidth = $(node).css("border-bottom-width");
                }
                var borderBottomStyle = node.style.borderBottomStyle;
                if (borderBottomStyle == "") {
                    borderBottomStyle = tmpBorderStyle;
                }
                var borderBottomColor = 0;
                borderStyleName = this._getBorderStyleName(borderBottomStyle, borderBottomWidth);
                if (null !== borderStyleName) {
                    oNewItem.borders.b.setStyle(borderStyleName);
                    oNewItem.borders.b.c = new RgbColor(borderBottomColor);
                }
            }
            tmpBorderStyle = $(node).css("border-left-style");
            if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                var borderLeftWidth = node.style.borderLeftWidth;
                if (borderLeftWidth == "") {
                    borderLeftWidth = $(node).css("border-left-width");
                }
                var borderLeftStyle = node.style.borderLeftStyle;
                if (borderLeftStyle == "") {
                    borderLeftStyle = tmpBorderStyle;
                }
                var borderLeftColor = 0;
                borderStyleName = this._getBorderStyleName(borderLeftStyle, borderLeftWidth);
                if (null !== borderStyleName) {
                    oNewItem.borders.l.setStyle(borderStyleName);
                    oNewItem.borders.l.c = new RgbColor(borderLeftColor);
                }
            }
            tmpBorderStyle = $(node).css("border-right-style");
            if ("none" !== tmpBorderStyle && null != tmpBorderStyle) {
                var borderRightWidth = node.style.borderRightWidth;
                if (borderRightWidth == "") {
                    borderRightWidth = $(node).css("border-right-width");
                }
                var borderRightStyle = node.style.borderRightStyle;
                if (borderRightStyle == "") {
                    borderRightStyle = tmpBorderStyle;
                }
                var borderRightColor = 0;
                borderStyleName = this._getBorderStyleName(borderRightStyle, borderRightWidth);
                if (null !== borderStyleName) {
                    oNewItem.borders.r.setStyle(borderStyleName);
                    oNewItem.borders.r.c = new RgbColor(borderRightColor);
                }
            }
            if (oNewItem.wrap !== true) {
                if (node.style.whiteSpace == "nowrap") {
                    oNewItem.wrap = false;
                } else {
                    if (node.style.whiteSpace == "normal") {
                        oNewItem.wrap = true;
                    } else {
                        oNewItem.wrap = false;
                    }
                }
            }
            if (node != undefined && node.colSpan != undefined) {
                oNewItem.colSpan = node.colSpan;
            } else {
                oNewItem.colSpan = 1;
            }
            if (node != undefined && node.rowSpan != undefined) {
                oNewItem.rowSpan = node.rowSpan;
            } else {
                oNewItem.rowSpan = 1;
            }
            if (node.style.textAlign != null && node.style.textAlign != "") {
                oNewItem.a = node.style.textAlign;
            } else {
                if (node.children[0] && node.children[0].style.textAlign != null && node.children[0].style.textAlign != "") {
                    oNewItem.a = node.children[0].style.textAlign;
                } else {
                    if (node.nodeName.toLowerCase() == "th") {
                        oNewItem.a = "center";
                    }
                }
            }
            if ($(node).css("background-color") != "none" && $(node).css("background-color") != null) {
                oNewItem.bc = $(node).css("background-color");
            }
            if (node.style.verticalAlign != undefined && node.style.verticalAlign != null && node.style.verticalAlign != "" && node.style.verticalAlign != "middle") {
                oNewItem.va = node.style.verticalAlign;
            } else {
                if (node.style.verticalAlign == "middle") {
                    oNewItem.va = "center";
                } else {
                    oNewItem.va = "bottom";
                }
            }
            if (node.getAttribute("class") != null) {
                var cL = node.getAttribute("class").split(" ");
                for (var i = 0; i < cL.length; i++) {
                    if (cL[i].indexOf("nFormat") > -1) {
                        var format = cL[i].split("nFormat");
                        oNewItem.format = format[1];
                    }
                }
            }
            if ($(node).children("a").length == 1 && oNewItem[0] != undefined) {
                oNewItem.hyperLink = $(node).children("a").attr("href");
                if ($(node).children("a").attr("title")) {
                    oNewItem.toolTip = $(node).children("a").attr("title");
                } else {
                    oNewItem.toolTip = null;
                }
            } else {
                if (node.nodeName.toLowerCase() == "a") {
                    oNewItem.hyperLink = $(node).attr("href");
                    if ($(node).attr("title")) {
                        oNewItem.toolTip = $(node).attr("title");
                    } else {
                        oNewItem.toolTip = null;
                    }
                }
            }
            aResult.push(oNewItem);
            return aResult;
        },
        _IsBlockElem: function (name) {
            if ("p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name) {
                return true;
            }
            return false;
        },
        _countTags: function (node, array) {
            var t = this;
            if (node && 1 == node.nodeType) {
                var child = node.firstChild;
                while (child) {
                    var parent = $(child).parent();
                    var checkBlockParent = false;
                    while (parent.length != 0) {
                        if (t._IsBlockElem(parent[0].nodeName.toLowerCase())) {
                            checkBlockParent = true;
                            break;
                        }
                        parent = parent.parent();
                    }
                    if (t._IsBlockElem(child.nodeName.toLowerCase()) && $(child).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center").length == 0 || child.nodeName.toLowerCase() == "table") {
                        array[array.length] = child;
                    } else {
                        if (!checkBlockParent && $(child).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center").length == 0 && !t._IsBlockElem(child.nodeName.toLowerCase()) && (child.nodeName.toLowerCase() == "span" || child.nodeName.toLowerCase() == "a")) {
                            array[array.length] = child;
                        }
                    }
                    if (child.nodeName.toLowerCase() != "table") {
                        t._countTags(child, array);
                    }
                    child = child.nextSibling;
                }
            }
            return array;
        },
        _getSignTags: function (nodes) {
            var newArr = [];
            var k = 0;
            for (var n = 0; n < nodes.length; ++n) {
                if (! (nodes[n].nodeName.toLowerCase() == "#comment" || (nodes[n].nodeName.toLowerCase() == "#text" && nodes[n].textContent.replace(/(\r|\t|\n| )/g, "") == ""))) {
                    if ($(nodes[n]).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length != 0 && nodes[n].nodeName.toLowerCase() != "table" && nodes[n].nodeName.toLowerCase() != "img") {
                        var isWrap = "";
                        if (nodes[n].style && nodes[n].style.whiteSpace) {
                            isWrap = nodes[n].style.whiteSpace;
                        }
                        Array.prototype.forEach.call(nodes[n].childNodes, function processElement(elem) {
                            if (elem.style && elem.style.whiteSpace && elem.nodeName.toLowerCase() == "div") {
                                isWrap = elem.style.whiteSpace;
                            }
                            if (($(elem).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length == 0 && elem.textContent.replace(/(\r|\t|\n| )/g, "") != "") || elem.nodeName.toLowerCase() == "table" || elem.nodeName.toLowerCase() == "img") {
                                newArr[k] = elem;
                                if (elem.style) {
                                    newArr[k].style.whiteSpace = isWrap;
                                }
                                k++;
                            }
                            if ($(elem).find("p,div,ul,ol,li,table,h1,h2,h3,h4,h5,h6,center,img").length != 0 && elem.nodeName.toLowerCase() != "table" && elem.nodeName.toLowerCase() != "img") {
                                Array.prototype.forEach.call(elem.childNodes, processElement);
                            }
                        });
                    } else {
                        newArr[k] = nodes[n];
                        k++;
                    }
                }
            }
            return newArr;
        },
        _editorPasteExec: function (worksheet, node, isText, onlyFromLocalStorage) {
            if (node == undefined) {
                return;
            }
            var pasteFragment = node;
            var t = this;
            if (isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf("safari") > -1 && navigator.userAgent.toLowerCase().indexOf("mac")) {
                onlyFromLocalStorage = true;
            }
            if (worksheet.objectRender.controller.curState.textObject && worksheet.objectRender.controller.curState.textObject.txBody) {
                if (onlyFromLocalStorage) {
                    if (t.lStorage && t.lStorage.htmlInShape) {
                        worksheet.objectRender.controller.curState.textObject.txBody.insertHtml(t.lStorage.htmlInShape);
                    }
                } else {
                    worksheet.objectRender.controller.curState.textObject.txBody.insertHtml(node);
                }
                window.GlobalPasteFlag = false;
                window.GlobalPasteFlagCounter = 0;
                return;
            }
            if (activateLocalStorage) {
                if (onlyFromLocalStorage) {
                    if (t.lStorage) {
                        if (t.copyText && t.copyText.isImage) {
                            if (t._insertImages(worksheet, t.lStorage, onlyFromLocalStorage)) {
                                window.GlobalPasteFlag = false;
                                window.GlobalPasteFlagCounter = 0;
                                return;
                            }
                        } else {
                            if (t.lStorage.htmlInShape) {
                                node = t.lStorage.htmlInShape;
                                pasteFragment = node;
                            } else {
                                worksheet.setSelectionInfo("paste", t, false, true);
                                window.GlobalPasteFlag = false;
                                window.GlobalPasteFlagCounter = 0;
                                return;
                            }
                        }
                    }
                }
                var textNode = t._getTextFromTable(node);
                if (t._isEqualText(textNode, node) && !onlyFromLocalStorage) {
                    if (t.copyText.isImage) {
                        if (t._insertImages(worksheet, t.lStorage, onlyFromLocalStorage)) {
                            window.GlobalPasteFlag = false;
                            window.GlobalPasteFlagCounter = 0;
                            return;
                        }
                    } else {
                        if (t.lStorage.htmlInShape) {
                            node = t.lStorage.htmlInShape;
                            pasteFragment = node;
                        } else {
                            worksheet.setSelectionInfo("paste", t, false, true);
                            window.GlobalPasteFlag = false;
                            window.GlobalPasteFlagCounter = 0;
                            return;
                        }
                    }
                }
            }
            var aResult = new Array();
            var range = worksheet.activeRange.clone(true);
            var isMerge = worksheet.model.getRange(new CellAddress(range.r1, range.c1, 0), new CellAddress(range.r2, range.c2, 0));
            var testFragment = $.extend(true, {},
            node);
            var is_chrome = AscBrowser.isChrome;
            $(testFragment).children("br").remove();
            if (testFragment.children.length == 0) {
                var allChild = node.childNodes;
                var sHtml = "";
                for (n = 0; n < allChild.length; ++n) {
                    text = allChild[n].nodeValue.replace(/(\r|\t|\n)/g, "");
                    if (allChild[n].nodeName.toLowerCase() == "#text" && text != "") {
                        sHtml += "<p><span style='font-family:Calibri;font-size:11pt;white-space:nowrap'>" + text + "</span></p>";
                    }
                }
                if (sHtml == "") {
                    return;
                }
                pasteFragment.innerHTML = sHtml;
                if (!is_chrome) {
                    isText = true;
                }
            }
            var mainChildrens = t._getSignTags(pasteFragment.childNodes);
            var countChild = mainChildrens.length;
            var arrMax = [];
            for (n = 0; n < $(pasteFragment).find("table").length; ++n) {
                arrMax[n] = $($(pasteFragment).find("table")[n]).find("tr")[0].children.length;
            }
            if (arrMax.length != 0) {
                var max = Math.max.apply(Math, arrMax);
                if (max != 0) {
                    range.c2 = range.c2 + max - 1;
                }
            }
            var cellCountAll = [];
            var mergeArr = [];
            var fontsNew = [];
            var rowSpanPlus = 0;
            var tableRowCount = 0;
            var l = 0;
            var n = 0;
            var s = 0;
            var countEmptyRow = 0;
            var rowCount = 0;
            if (null != $(pasteFragment).find("table") && 1 == countChild && pasteFragment.children[0] != undefined && pasteFragment.children[0].children[0] != undefined && pasteFragment.children[0].children[0].nodeName.toLowerCase() == "table") {
                pasteFragment = pasteFragment.children[0];
            }
            var arrTags = [];
            var countTrueTags = t._countTags(mainChildrens, arrTags);
            if (countTrueTags.length != 0 && node.length != countTrueTags.length && node.children[0] != countTrueTags[0]) {
                var p = document.createElement("p");
                $(p).append(countTrueTags);
                pasteFragment = p;
                countChild = p.childNodes.length;
                mainChildrens = pasteFragment.childNodes;
            }
            if (!mainChildrens) {
                countChild = pasteFragment.children.length;
                mainChildrens = pasteFragment.children;
            }
            var onlyImages = null;
            var addImages = null;
            var imCount = 0;
            for (var r = range.r1; r - range.r1 < countChild; ++r) {
                var firstRow = mainChildrens[r - range.r1 - countEmptyRow];
                if (firstRow.nodeName.toLowerCase() == "br") {
                    r++;
                }
                aResult[r + tableRowCount] = new Array();
                var tag = mainChildrens[r - range.r1 - countEmptyRow];
                if (pasteFragment.children.length == 1 && pasteFragment.children[0].nodeName.toLowerCase() == "table") {
                    aResult.isOneTable = true;
                }
                for (var c = range.c1; c <= range.c2; ++c) {
                    if ((tag.nodeName.toLowerCase() == "div" || tag.nodeName.toLowerCase() == "p" || tag.nodeName.toLowerCase() == "h" || tag.nodeName.toLowerCase().search("h") != -1) && c == range.c1 || tag.nodeName.toLowerCase() == "li") {
                        var prevSib = mainChildrens[r - range.r1 - countEmptyRow - 1];
                        if (prevSib) {
                            if (prevSib.nodeName.toLowerCase() == "table") {
                                var emtyTag = document.createElement("p");
                                aResult[r + tableRowCount][c] = t._getArray(emtyTag, isText);
                                countChild++;
                                r++;
                                countEmptyRow++;
                                aResult[r + tableRowCount] = new Array();
                            }
                        }
                        tag.innerHTML = tag.innerHTML.replace(/(\n)/g, "");
                        aResult[r + tableRowCount][c] = t._getArray(tag, isText);
                        fontsNew[l] = aResult[r + tableRowCount][c][0].fonts;
                        c = range.c2;
                        cellCountAll[s] = 1;
                        s++;
                        l++;
                        onlyImages = false;
                    } else {
                        if (tag.nodeName.toLowerCase() == "#text") {
                            var prevSib = $(tag).prev();
                            if (prevSib.length != 0) {
                                if (prevSib[prevSib.length - 1].nodeName.toLowerCase() == "p" || prevSib[prevSib.length - 1].nodeName.toLowerCase() == "table") {
                                    var emtyTag = document.createElement("p");
                                    aResult[r + tableRowCount][c] = t._getArray(emtyTag, isText);
                                    countChild++;
                                    r++;
                                    countEmptyRow++;
                                    aResult[r + tableRowCount] = new Array();
                                }
                            }
                            var span = document.createElement("p");
                            $(span).append(tag);
                            aResult[r + tableRowCount][c] = t._getArray(span, isText);
                            fontsNew[l] = aResult[r + tableRowCount][c][0].fonts;
                            c = range.c2;
                            cellCountAll[s] = 1;
                            s++;
                            l++;
                            onlyImages = false;
                        } else {
                            if (tag.nodeName.toLowerCase() == "span" || tag.nodeName.toLowerCase() == "a" || tag.nodeName.toLowerCase() == "form") {
                                aResult[r + tableRowCount][c] = t._getArray(tag, isText);
                                fontsNew[l] = aResult[r + tableRowCount][c][0].fonts;
                                cellCountAll[s] = 1;
                                c = range.c2;
                                s++;
                                l++;
                                onlyImages = false;
                            } else {
                                if (tag.nodeName.toLowerCase() == "table") {
                                    var startNum = r + tableRowCount;
                                    var tableBody = tag.getElementsByTagName("tbody")[0];
                                    var n = 0;
                                    var arrCount = [];
                                    var cellCount = 0;
                                    for (var i = 0; i < tableBody.children.length; ++i) {
                                        arrCount[i] = 0;
                                        for (var j = 0; j < tableBody.children[i].children.length; ++j) {
                                            arrCount[i] += tableBody.children[i].children[j].colSpan;
                                        }
                                    }
                                    cellCount = Math.max.apply({},
                                    arrCount);
                                    for (var i = 0; i < tableBody.children.length; ++i) {
                                        if (tableBody.children[i].children[0] != undefined && (tableBody.children[i].children.length == cellCount || tableBody.children[i].children[0].colSpan == cellCount)) {
                                            rowCount += tableBody.children[i].children[0].rowSpan;
                                        }
                                    }
                                    aResult.rowCount = tag.rows.length;
                                    if (tag.rows[0].children[0] != undefined && rowCount > tag.rows.length) {
                                        aResult.rowCount = rowCount;
                                    }
                                    var mergeArr = [];
                                    if (tableBody.children.length == 1 && tableBody.children[0].children.length == 1 && tableBody.children[0].children[0].rowSpan != "" && tableBody.children[0].children[0].rowSpan != null) {
                                        rowSpanPlus = tableBody.children[0].children[0].rowSpan - 1;
                                    }
                                    cellCountAll[s] = cellCount;
                                    s++;
                                    for (var tR = startNum; tR < tableBody.children.length + startNum; ++tR) {
                                        aResult[tR] = new Array();
                                        var cNew = 0;
                                        for (var tC = range.c1; tC < range.c1 + cellCount; ++tC) {
                                            if (0 != mergeArr.length) {
                                                for (var k = 0; k < mergeArr.length; ++k) {
                                                    if (tC >= mergeArr[k].c1 && tC <= mergeArr[k].c2 && tR >= mergeArr[k].r1 && tR <= mergeArr[k].r2) {
                                                        break;
                                                    } else {
                                                        if (k == mergeArr.length - 1) {
                                                            var _tBody = tableBody.children[tR - startNum].children[cNew];
                                                            var findImg = $(_tBody).find("img");
                                                            if (findImg.length != 0) {
                                                                for (var imgCol = 0; imgCol < findImg.length; imgCol++) {
                                                                    if (addImages == null) {
                                                                        addImages = [];
                                                                    }
                                                                    var curCell = {
                                                                        col: tC,
                                                                        row: tR + imgCol
                                                                    };
                                                                    var tag = $(_tBody).find("img")[imgCol];
                                                                    addImages[imCount] = {
                                                                        curCell: curCell,
                                                                        tag: tag
                                                                    };
                                                                    imCount++;
                                                                }
                                                            }
                                                            if (_tBody == undefined) {
                                                                _tBody = document.createElement("td");
                                                            }
                                                            aResult[tR][tC] = t._getArray(_tBody, isText);
                                                            fontsNew[l] = aResult[tR][tC][0].fonts;
                                                            l++;
                                                            if (undefined != _tBody && (_tBody.colSpan > 1 || _tBody.rowSpan > 1)) {
                                                                mergeArr[n++] = {
                                                                    r1: tR,
                                                                    r2: tR + _tBody.rowSpan - 1,
                                                                    c1: tC,
                                                                    c2: tC + _tBody.colSpan - 1
                                                                };
                                                            }
                                                            cNew++;
                                                        }
                                                    }
                                                }
                                            } else {
                                                var _tBody = tableBody.children[tR - startNum].children[cNew];
                                                var findImg = $(_tBody).find("img");
                                                if (findImg.length != 0) {
                                                    for (var imgCol = 0; imgCol < findImg.length; imgCol++) {
                                                        if (addImages == null) {
                                                            addImages = [];
                                                        }
                                                        var curCell = {
                                                            col: tC,
                                                            row: tR + imgCol
                                                        };
                                                        var tag = $(_tBody).find("img")[imgCol];
                                                        addImages[imCount] = {
                                                            curCell: curCell,
                                                            tag: tag
                                                        };
                                                        imCount++;
                                                    }
                                                }
                                                aResult[tR][tC] = t._getArray(_tBody, isText);
                                                fontsNew[l] = aResult[tR][tC][0].fonts;
                                                l++;
                                                if (undefined != _tBody && (_tBody.colSpan > 1 || _tBody.rowSpan > 1)) {
                                                    mergeArr[n++] = {
                                                        r1: tR,
                                                        r2: tR + _tBody.rowSpan - 1,
                                                        c1: tC,
                                                        c2: tC + _tBody.colSpan - 1
                                                    };
                                                }
                                                cNew++;
                                            }
                                        }
                                    }
                                    if (countChild == 1) {
                                        r = tR;
                                    } else {
                                        tableRowCount += tableBody.children.length - 1;
                                    }
                                    break;
                                    onlyImages = false;
                                } else {
                                    if (tag.nodeName.toLowerCase() == "img") {
                                        var curCell = {
                                            col: c,
                                            row: r + tableRowCount
                                        };
                                        if (addImages == null) {
                                            addImages = [];
                                        }
                                        addImages[imCount] = {
                                            curCell: curCell,
                                            tag: tag
                                        };
                                        imCount++;
                                        c = range.c2;
                                        if (onlyImages !== false) {
                                            onlyImages = true;
                                        }
                                    } else {
                                        var textArr;
                                        if ((mainChildrens[r - range.r1] == undefined || mainChildrens[r - range.r1].innerText == undefined || mainChildrens[r - range.r1].innerText == null) && ($(mainChildrens[r - range.r1]).text() == undefined || $(mainChildrens[r - range.r1]).text() == null)) {
                                            textArr = [];
                                            textArr[0] = "";
                                        } else {
                                            var text = tag.innerText;
                                            if (text == undefined) {
                                                text = $(tag).text();
                                            }
                                            textArr = text.split("\n");
                                        }
                                        for (k = 0; k < textArr.length; ++k) {
                                            aResult[r + tableRowCount] = new Array();
                                            var newP = document.createElement("p");
                                            var newSpan = document.createElement("span");
                                            $(newP).append(newSpan);
                                            newSpan.innerText = textArr[k];
                                            $(newSpan).text(textArr[k]);
                                            aResult[r + tableRowCount][c] = t._getArray(newP, isText);
                                            fontsNew[l] = aResult[r + tableRowCount][c][0].fonts;
                                            l++;
                                            if (textArr.length != 1 && (textArr.length - 1) != k) {
                                                r++;
                                            }
                                        }
                                        c = range.c2;
                                        cellCountAll[s] = 1;
                                        s++;
                                        onlyImages = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (cellCountAll.length == 0) {
                aResult.cellCount = 0;
            } else {
                aResult.cellCount = Math.max.apply(Math, cellCountAll);
            }
            aResult.rowSpanSpCount = rowSpanPlus;
            var api = window["Asc"]["editor"];
            if (!api || (api && !api.isChartEditor)) {
                aResult.addImages = addImages;
            }
            aResult.fontsNew = fontsNew;
            aResult.onlyImages = onlyImages;
            worksheet.setSelectionInfo("paste", aResult, t);
            window.GlobalPasteFlagCounter = 0;
            window.GlobalPasteFlag = false;
        },
        _isEqualText: function (node, table) {
            var t = this;
            if (undefined == t.copyText || node == undefined) {
                return false;
            }
            if (t.copyText.isImage) {
                return false;
            }
            if (t.copyText.text && $.browser["opera"] && node.text.replace(/(\r|\t|\n| |\s)/g, "") == t.copyText.text.replace(/(\r|\t|\n| |\s)/g, "")) {
                return true;
            }
            if ($.browser["msie"] && t.copyText.text != undefined && node.text != undefined && node.text == "" && t.copyText.isImage) {
                return true;
            }
            if (t.copyText.text != undefined && node.text != undefined && node.text == t.copyText.text) {
                if (t.copyText.isImage) {
                    return true;
                } else {
                    if (node.rows && t.copyText.rows && node.rows == t.copyText.rows && node.cols && t.copyText.cols && node.cols == t.copyText.cols) {
                        return true;
                    }
                }
            }
            if (table && table.children[0] && node.text.replace(/(\r|\t|\n| |\s)/g, "") == t.copyText.text.replace(/(\r|\t|\n| |\s)/g, "")) {
                if (table.children[0].getAttribute("class") != null) {
                    var cL = table.children[0].getAttribute("class").split(" ");
                    for (var i = 0; i < cL.length; i++) {
                        if (cL[i].indexOf("pasteFragment_") > -1) {
                            if (cL[i] == t.copyText.pasteFragment) {
                                return true;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            return false;
        },
        _selectElement: function (callback) {
            var t = this,
            selection, rangeToSelect;
            if (window.USER_AGENT_IE) {
                document.onselectstart = function () {};
            }
            if (window.getSelection) {
                selection = window.getSelection();
                rangeToSelect = doc.createRange();
                if (AscBrowser.isGecko) {
                    t.element.appendChild(doc.createTextNode("\xa0"));
                    t.element.insertBefore(doc.createTextNode("\xa0"), t.element.firstChild);
                    rangeToSelect.setStartAfter(t.element.firstChild);
                    rangeToSelect.setEndBefore(t.element.lastChild);
                } else {
                    rangeToSelect.selectNodeContents(t.element);
                }
                selection.removeAllRanges();
                selection.addRange(rangeToSelect);
            } else {
                if (doc.body.createTextRange) {
                    rangeToSelect = doc.body.createTextRange();
                    rangeToSelect.moveToElementText(t.element);
                    rangeToSelect.select();
                }
            }
            var time_interval = 200;
            window.setTimeout(function () {
                t.element.style.display = ELEMENT_DISPAY_STYLE;
                doc.body.style.MozUserSelect = "none";
                doc.body.style["-khtml-user-select"] = "none";
                doc.body.style["-o-user-select"] = "none";
                doc.body.style["user-select"] = "none";
                doc.body.style["-webkit-user-select"] = "none";
                if (window.USER_AGENT_IE) {
                    document.onselectstart = function () {
                        return false;
                    };
                }
                if (callback && callback.call) {
                    callback();
                }
            },
            time_interval);
        },
        _makeNodesFromCellValue: function (val, defFN, defFS, isQPrefix, isFormat, cell) {
            var i, res, span, f;
            function getTextDecoration(format) {
                var res = [];
                if (format.u !== "none") {
                    res.push("underline");
                }
                if (format.s) {
                    res.push("line-through");
                }
                return res.length > 0 ? res.join(",") : "";
            }
            var hyperlink;
            if (cell) {
                hyperlink = cell.getHyperlink();
            }
            for (res = [], i = 0; i < val.length; ++i) {
                if (val[i] && val[i].format && val[i].format.skip) {
                    continue;
                }
                if (cell == undefined || (cell != undefined && (hyperlink == null || (hyperlink != null && hyperlink.getLocation() != null)))) {
                    span = doc.createElement("SPAN");
                } else {
                    span = doc.createElement("A");
                    if (hyperlink.Hyperlink != null) {
                        span.href = hyperlink.Hyperlink;
                    } else {
                        if (hyperlink.getLocation() != null) {
                            span.href = "#" + hyperlink.getLocation();
                        }
                    }
                    if (hyperlink.Tooltip != null) {
                        span.title = hyperlink.Tooltip;
                    }
                }
                if (val[i].sFormula) {
                    span.textContent = val[i].text;
                    $(span).addClass("cellFrom_" + val[i].sId + "textFormula_" + "=" + val[i].sFormula);
                } else {
                    span.textContent = val[i].text;
                    if (isQPrefix) {
                        $(span).addClass("qPrefix");
                    } else {
                        if (isFormat && isFormat.f && isFormat.wFormat) {
                            var text = "";
                            for (var k = 0; k < val.length; ++k) {
                                text += val[k].text;
                            }
                            span.textContent = text;
                            i = val.length - 1;
                        }
                    }
                }
                f = val[i].format;
                if (f.c) {
                    span.style.color = number2color(f.c);
                }
                if (f.fn !== defFN) {
                    span.style.fontFamily = f.fn;
                }
                if (f.fs !== defFS) {
                    span.style.fontSize = f.fs + "pt";
                }
                if (f.b) {
                    span.style.fontWeight = "bold";
                }
                if (f.i) {
                    span.style.fontStyle = "italic";
                }
                span.style.textDecoration = getTextDecoration(f);
                span.style.verticalAlign = f.va === "subscript" ? "sub" : f.va === "superscript" ? "super" : "baseline";
                span.innerHTML = span.innerHTML.replace(/\n/g, "<br>");
                res.push(span);
            }
            return res;
        },
        _addValueToLocalStrg: function (value) {
            var t = this;
            var isNull = 0;
            if (!value || !value[isNull]) {
                return;
            }
            t.lStorage = [];
            t.lStorage.fromRow = isNull;
            t.lStorage.fromCol = isNull;
            t.lStorageText = value[isNull].text;
            var val2 = [];
            val2[isNull] = {
                text: value[isNull].text,
                format: value[isNull].format
            };
            t.lStorage[isNull] = [];
            t.lStorage[isNull][isNull] = {
                value2: val2,
                wrap: true,
                format: false
            };
        },
        _makeTableNode: function (range, worksheet, isCut) {
            var fn = range.worksheet.workbook.getDefaultFont();
            var fs = range.worksheet.workbook.getDefaultSize();
            var bbox = range.getBBox0();
            var merged = [];
            var t = this;
            var table, tr, td, cell, j, row, col, mbbox, h, w, b;
            function skipMerged() {
                var m = merged.filter(function (e) {
                    return row >= e.r1 && row <= e.r2 && col >= e.c1 && col <= e.c2;
                });
                if (m.length > 0) {
                    col = m[0].c2;
                    return true;
                }
                return false;
            }
            function makeBorder(border) {
                if (!border || border.s === c_oAscBorderStyles.None) {
                    return "";
                }
                var style = "";
                switch (border.s) {
                case c_oAscBorderStyles.Thin:
                    style = "solid";
                    break;
                case c_oAscBorderStyles.Medium:
                    style = "solid";
                    break;
                case c_oAscBorderStyles.Thick:
                    style = "solid";
                    break;
                case c_oAscBorderStyles.DashDot:
                    case c_oAscBorderStyles.DashDotDot:
                    case c_oAscBorderStyles.Dashed:
                    style = "dashed";
                    break;
                case c_oAscBorderStyles.Double:
                    style = "double";
                    break;
                case c_oAscBorderStyles.Hair:
                    case c_oAscBorderStyles.Dotted:
                    style = "dotted";
                    break;
                case c_oAscBorderStyles.MediumDashDot:
                    case c_oAscBorderStyles.MediumDashDotDot:
                    case c_oAscBorderStyles.MediumDashed:
                    case c_oAscBorderStyles.SlantDashDot:
                    style = "dashed";
                    break;
                }
                return border.w + "px " + style + " " + number2color(border.getRgbOrNull());
            }
            table = doc.createElement("TABLE");
            table.cellPadding = "0";
            table.cellSpacing = "0";
            table.style.borderCollapse = "collapse";
            table.style.fontFamily = fn;
            table.style.fontSize = fs + "pt";
            table.style.color = "#000";
            table.style.backgroundColor = "transparent";
            var isSelectedImages = t._getSelectedDrawingIndex(worksheet);
            var isImage = false;
            var isChart = false;
            var objectRender = worksheet.objectRender;
            if (isSelectedImages && isSelectedImages != -1 && objectRender.controller.curState.group && objectRender.controller.curState.group.selectedObjects) {
                if (this.Api && this.Api.isChartEditor) {
                    return false;
                }
                objectRender.preCopy();
                var nLoc = 0;
                var table = document.createElement("span");
                var image;
                var drawings = objectRender.controller.curState.group.selectedObjects;
                t.lStorage = [];
                for (j = 0; j < drawings.length; ++j) {
                    image = drawings[j].drawingBase;
                    if (!image) {
                        image = objectRender.createDrawingObject();
                        image.graphicObject = drawings[j];
                    }
                    var cloneImg = objectRender.cloneDrawingObject(image);
                    var curImage = new Image();
                    var url;
                    if (cloneImg.graphicObject.isChart() && cloneImg.graphicObject.brush.fill.RasterImageId) {
                        url = cloneImg.graphicObject.brush.fill.RasterImageId;
                    } else {
                        if (cloneImg.graphicObject && (cloneImg.graphicObject.isShape() || cloneImg.graphicObject.isImage() || cloneImg.graphicObject.isGroup() || cloneImg.graphicObject.isChart())) {
                            var cMemory = new CMemory();
                            var altAttr = cloneImg.graphicObject.writeToBinaryForCopyPaste(cMemory);
                            var isImage = cloneImg.graphicObject.isImage();
                            var imageUrl;
                            if (isImage) {
                                imageUrl = cloneImg.graphicObject.getImageUrl();
                            }
                            if (isImage && imageUrl) {
                                url = getFullImageSrc(imageUrl);
                            } else {
                                url = cloneImg.graphicObject.getBase64Image();
                            }
                            curImage.alt = altAttr;
                        } else {
                            url = cloneImg.image.src;
                        }
                    }
                    curImage.src = url;
                    curImage.width = cloneImg.getWidthFromTo();
                    curImage.height = cloneImg.getHeightFromTo();
                    if (image.guid) {
                        curImage.name = image.guid;
                    }
                    table.appendChild(curImage);
                    t.lStorage[nLoc] = {};
                    t.lStorage[nLoc].image = curImage;
                    t.lStorage[nLoc].fromCol = cloneImg.from.col;
                    t.lStorage[nLoc].fromRow = cloneImg.from.row;
                    nLoc++;
                    isImage = true;
                    t._addLocalStorage(isImage, isChart, range.worksheet.getCell(new CellAddress(row, col, 0)), bbox, image.from.row, image.from.col, worksheet, isCut);
                }
            } else {
                if (isSelectedImages && isSelectedImages != -1 && objectRender.controller.curState.textObject && objectRender.controller.curState.textObject.txBody) {
                    var htmlInShape = objectRender.controller.curState.textObject.txBody.getSelectedTextHtml();
                    if (activateLocalStorage && htmlInShape) {
                        t._addLocalStorage(false, false, currentRange, bbox, row, col, worksheet, isCut, htmlInShape);
                    }
                    if (!htmlInShape) {
                        htmlInShape = "";
                    }
                    return htmlInShape;
                } else {
                    if (isSelectedImages && isSelectedImages != -1) {
                        if (this.Api && this.Api.isChartEditor) {
                            return false;
                        }
                        objectRender.preCopy();
                        var nLoc = 0;
                        var table = document.createElement("span");
                        var drawings = worksheet.model.Drawings;
                        t.lStorage = [];
                        for (j = 0; j < isSelectedImages.length; ++j) {
                            var image = drawings[isSelectedImages[j]];
                            var cloneImg = objectRender.cloneDrawingObject(image);
                            var curImage = new Image();
                            var url;
                            if (cloneImg.graphicObject.isChart() && cloneImg.graphicObject.brush.fill.RasterImageId) {
                                url = cloneImg.graphicObject.brush.fill.RasterImageId;
                            } else {
                                if (cloneImg.graphicObject && (cloneImg.graphicObject.isShape() || cloneImg.graphicObject.isImage() || cloneImg.graphicObject.isGroup() || cloneImg.graphicObject.isChart())) {
                                    var cMemory = new CMemory();
                                    var altAttr = cloneImg.graphicObject.writeToBinaryForCopyPaste(cMemory);
                                    var isImage = cloneImg.graphicObject.isImage();
                                    var imageUrl;
                                    if (isImage) {
                                        imageUrl = cloneImg.graphicObject.getImageUrl();
                                    }
                                    if (isImage && imageUrl) {
                                        url = getFullImageSrc(imageUrl);
                                    } else {
                                        url = cloneImg.graphicObject.getBase64Image();
                                    }
                                    curImage.alt = altAttr;
                                } else {
                                    url = cloneImg.image.src;
                                }
                            }
                            curImage.src = url;
                            curImage.width = cloneImg.getWidthFromTo();
                            curImage.height = cloneImg.getHeightFromTo();
                            if (image.guid) {
                                curImage.name = image.guid;
                            }
                            table.appendChild(curImage);
                            t.lStorage[nLoc] = {};
                            t.lStorage[nLoc].image = curImage;
                            t.lStorage[nLoc].fromCol = cloneImg.from.col;
                            t.lStorage[nLoc].fromRow = cloneImg.from.row;
                            nLoc++;
                            isImage = true;
                            t._addLocalStorage(isImage, isChart, range.worksheet.getCell(new CellAddress(row, col, 0)), bbox, image.from.row, image.from.col, worksheet, isCut);
                        }
                    } else {
                        if (activateLocalStorage) {
                            var localStText = "";
                            for (row = bbox.r1; row <= bbox.r2; ++row) {
                                if (row != bbox.r1) {
                                    localStText += "\n";
                                }
                                for (col = bbox.c1; col <= bbox.c2; ++col) {
                                    if (col != bbox.c1) {
                                        localStText += " ";
                                    }
                                    var currentRange = range.worksheet.getCell(new CellAddress(row, col, 0));
                                    var textRange = currentRange.getValue();
                                    if (textRange == "") {
                                        localStText += "\t";
                                    } else {
                                        localStText += textRange;
                                    }
                                    t._addLocalStorage(false, false, currentRange, bbox, row, col, worksheet, isCut);
                                }
                            }
                            t.lStorageText = localStText;
                        }
                        for (row = bbox.r1; row <= bbox.r2; ++row) {
                            tr = doc.createElement("TR");
                            h = range.worksheet.getRowHeight(row);
                            if (h > 0) {
                                tr.style.height = h + "pt";
                            }
                            for (col = bbox.c1; col <= bbox.c2; ++col) {
                                if (skipMerged()) {
                                    continue;
                                }
                                cell = range.worksheet.getCell(new CellAddress(row, col, 0));
                                td = doc.createElement("TD");
                                mbbox = cell.hasMerged();
                                if (mbbox) {
                                    merged.push(mbbox);
                                    td.colSpan = mbbox.c2 - mbbox.c1 + 1;
                                    td.rowSpan = mbbox.r2 - mbbox.r1 + 1;
                                    for (w = 0, j = mbbox.c1; j <= mbbox.c2; ++j) {
                                        w += worksheet.getColumnWidth(j, 1);
                                    }
                                    td.style.width = w + "pt";
                                } else {
                                    td.style.width = worksheet.getColumnWidth(col, 1) + "pt";
                                }
                                if (!cell.getWrap()) {
                                    td.style.whiteSpace = "nowrap";
                                } else {
                                    td.style.whiteSpace = "normal";
                                }
                                if (cell.getAlignHorizontal() != "none") {
                                    td.style.textAlign = cell.getAlignHorizontal();
                                }
                                td.style.verticalAlign = cell.getAlignVertical();
                                if (cell.getAlignVertical() == "center") {
                                    td.style.verticalAlign = "middle";
                                }
                                b = cell.getBorderFull();
                                if (mbbox) {
                                    var cellMergeFinish = range.worksheet.getCell(new CellAddress(mbbox.r2, mbbox.c2, 0));
                                    var borderMergeCell = cellMergeFinish.getBorderFull();
                                    td.style.borderRight = makeBorder(borderMergeCell.r);
                                    td.style.borderBottom = makeBorder(borderMergeCell.b);
                                } else {
                                    td.style.borderRight = makeBorder(b.r);
                                    td.style.borderBottom = makeBorder(b.b);
                                }
                                td.style.borderLeft = makeBorder(b.l);
                                td.style.borderTop = makeBorder(b.t);
                                var isFormat = {};
                                isFormat.f = false;
                                isFormat.wFormat = false;
                                if (cell.getNumFormat() != null && cell.getNumFormat() != undefined && cell.getNumFormat().oTextFormat.formatString != "" && cell.getNumFormat().oTextFormat.formatString != null && (cell.getType() == "n" || cell.getType() == null || cell.getType() == 0) && cell.getNumFormatStr() != "General") {
                                    var formatStr = t._encode(cell.getNumFormatStr());
                                    var valStr = t._encode(cell.getValueWithoutFormat());
                                    $(td).addClass("nFormat" + formatStr + ";" + valStr);
                                    isFormat.f = cell.getValueWithoutFormat();
                                    isFormat.wFormat = true;
                                }
                                b = cell.getFill();
                                if (b != null) {
                                    td.style.backgroundColor = number2color(b.getRgb());
                                }
                                var isQPrefix = cell.getQuotePrefix();
                                this._makeNodesFromCellValue(cell.getValue2(), fn, fs, isQPrefix, isFormat, cell).forEach(function (node) {
                                    td.appendChild(node);
                                });
                                tr.appendChild(td);
                            }
                            table.appendChild(tr);
                        }
                    }
                }
            }
            return table;
        },
        _addLocalStorage: function (isImage, isChart, cell, activeRange, trueRow, trueCol, worksheet, isCut, htmlInShape) {
            var t = this;
            var numRow = activeRange.r1;
            var numCol = activeRange.c1;
            if (htmlInShape) {
                t.lStorage = {};
                t.lStorage.htmlInShape = htmlInShape;
            } else {
                if (isChart) {
                    t.lStorage = [];
                    t.lStorage[0] = {};
                    t.lStorage[0].isChart = isChart;
                } else {
                    if (!isImage) {
                        var row = trueRow - numRow;
                        var col = trueCol - numCol;
                        if (row == 0 && col == 0) {
                            t.lStorage = [];
                            t.lStorage.fromRow = numRow;
                            t.lStorage.fromCol = numCol;
                        }
                        if (t.lStorage[row] == undefined) {
                            t.lStorage[row] = [];
                        }
                        t.lStorage[row][col] = {
                            value2: Asc.clone(cell.getValue2()),
                            borders: cell.getBorderFull(),
                            merge: cell.hasMerged(),
                            format: cell.getNumFormat(),
                            verAlign: cell.getAlignVertical(),
                            horAlign: cell.getAlignHorizontal(),
                            wrap: cell.getWrap(),
                            fill: cell.getFill(),
                            hyperlink: cell.getHyperlink(),
                            valWithoutFormat: cell.getValueWithoutFormat(),
                            angle: cell.getAngle()
                        };
                        if (cell.getQuotePrefix() && t.lStorage[row][col] && t.lStorage[row][col].value2 && t.lStorage[row][col].value2[0]) {
                            t.lStorage[row][col].value2[0].text = "'" + t.lStorage[row][col].value2[0].text;
                        }
                        if (!t.lStorage.autoFilters) {
                            var autoFiltersObj = worksheet.autoFilters;
                            var findFilter = autoFiltersObj._searchFiltersInRange(activeRange, worksheet.model);
                            if (findFilter && !findFilter[0].TableStyleInfo) {
                                findFilter.splice(0, 1);
                            }
                            if (findFilter) {
                                var ref;
                                var style;
                                var range;
                                var tempRange;
                                t.lStorage.autoFilters = [];
                                for (var i = 0; i < findFilter.length; i++) {
                                    ref = findFilter[i].Ref;
                                    tempRange = autoFiltersObj._refToRange(ref);
                                    range = {
                                        r1: tempRange.r1 - activeRange.r1,
                                        c1: tempRange.c1 - activeRange.c1,
                                        r2: tempRange.r2 - activeRange.r1,
                                        c2: tempRange.c2 - activeRange.c1
                                    };
                                    style = findFilter[i].TableStyleInfo ? findFilter[i].TableStyleInfo.Name : null;
                                    t.lStorage.autoFilters[i] = {
                                        style: style,
                                        range: range,
                                        autoFilter: findFilter[i].AutoFilter ? true : false
                                    };
                                }
                            }
                        }
                    }
                }
            }
        },
        _paste: function (callback) {
            var t = this;
            t._cleanElement();
            t.element.focus();
            t.element.appendChild(doc.createTextNode("\xa0"));
            t._selectElement(callback);
        },
        _makeCellValueFromHtml: function (callback) {
            if (!callback || !callback.call) {
                return;
            }
            var defaultFontName = "Arial";
            var t = this,
            i;
            var res = [];
            var fonts = [];
            var reQuotedStr = /['"]([^'"]+)['"]/;
            var reSizeStr = /\s*(\d+\.*\d*)\s*(em|ex|cm|mm|in|pt|pc|px|%)?\s*/i;
            function getFontName(style) {
                var fn = style.fontFamily.split(",")[0];
                var m = reQuotedStr.exec(fn);
                if (m) {
                    fn = m[1];
                }
                switch (fn.toLowerCase()) {
                case "sans-serif":
                    return "Arial";
                case "serif":
                    return "Times";
                case "monospace":
                    return "Courier";
                }
                return fn;
            }
            function getFontSize(style) {
                var fs = style.fontSize.toLowerCase();
                var m = reSizeStr.exec(fs);
                var sz = m ? parseFloat(m[1]) : 0;
                return m[2] === "px" ? (sz / t.ppix * 72).toFixed(1) - 0 : 0;
            }
            Array.prototype.forEach.call(t.element.childNodes, function processElement(elem) {
                if (elem.nodeType === Node.TEXT_NODE) {
                    var style = window.getComputedStyle(elem.parentNode);
                    var fn = defaultFontName;
                    var fs = getFontSize(style);
                    var fb = style.fontWeight.toLowerCase();
                    var fi = style.fontStyle.toLowerCase();
                    var td = style.textDecoration.toLowerCase();
                    var va = style.verticalAlign.toLowerCase();
                    res.push({
                        format: {
                            fn: t._checkFonts(fn),
                            fs: fs,
                            b: false,
                            i: false,
                            u: "none",
                            s: false,
                            va: "none"
                        },
                        text: elem.textContent
                    });
                    if (fn !== "") {
                        fonts.push(fn);
                    }
                    return;
                }
                Array.prototype.forEach.call(elem.childNodes, processElement);
                var n = elem.tagName ? elem.tagName.toUpperCase() : "";
                if (/H\d|LABEL|LI|P|PRE|TR|DD|BR/.test(n) && res.length > 0) {
                    res[res.length - 1].text += "\n";
                } else {
                    if (/DT/.test(n) && res.length > 0) {
                        res[res.length - 1].text += "\t";
                    }
                }
            });
            fonts.sort();
            for (i = 0; i < fonts.length;) {
                if (i + 1 < fonts.length && fonts[i] === fonts[i + 1]) {
                    fonts.splice(i + 1, 1);
                    continue;
                }++i;
            }
            callback(res, fonts);
        },
        _makeCellValuesHtml: function (node, isText) {
            var t = this,
            i;
            var res = [];
            var fonts = [];
            var reQuotedStr = /['"]([^'"]+)['"]/;
            var reSizeStr = /\s*(\d+\.*\d*)\s*(em|ex|cm|mm|in|pt|pc|px|%)?\s*/i;
            function getFontName(style) {
                var fn = style.fontFamily.split(",")[0];
                var m = reQuotedStr.exec(fn);
                if (m) {
                    fn = m[1];
                }
                switch (fn.toLowerCase()) {
                case "sans-serif":
                    return "Arial";
                case "serif":
                    return "Times";
                case "monospace":
                    return "Courier";
                }
                return fn;
            }
            function getFontSize(style) {
                var fs = style.fontSize.toLowerCase();
                var defaultValue = "11";
                if (fs == undefined || fs == "") {
                    return defaultValue;
                }
                var m = reSizeStr.exec(fs);
                var sz = m ? parseFloat(m[1]) : 0;
                return m[2] === "px" ? (sz / t.ppix * 72).toFixed(1) - 0 : 0;
            }
            Array.prototype.forEach.call(node, function processElement(elem) {
                if (elem.nodeType === Node.TEXT_NODE || (elem.nodeName.toLowerCase() == "br" && $(node).children("br").length != 0 && elem.parentNode.nodeName.toLowerCase() == "span") || (elem.parentNode.getAttribute != undefined && elem.parentNode.getAttribute("class") != null && elem.parentNode.getAttribute("class") == "qPrefix") || (elem.getAttribute != undefined && elem.getAttribute("class") != null && elem.getAttribute("class") == "qPrefix")) {
                    if (elem.textContent.replace(/(\r|\t|\n| )/g, "") != "" || elem.textContent == " " || elem.nodeName.toLowerCase() == "br") {
                        var parent = elem.parentNode;
                        if (elem.getAttribute != undefined && elem.getAttribute("class") == "qPrefix") {
                            var parent = elem;
                        }
                        var style = window.getComputedStyle(parent);
                        var fn = getFontName(style);
                        if (fn == "") {
                            fn = parent.style.fontFamily.replace(/'/g, "");
                        }
                        fn = t._checkFonts(fn);
                        var fs = Math.round(getFontSize(style));
                        var fb = style.fontWeight.toLowerCase();
                        var fi = style.fontStyle.toLowerCase();
                        var td = style.textDecoration.toLowerCase();
                        var va = style.verticalAlign.toLowerCase();
                        var prefix = "";
                        var cL = null,
                        cellFrom = null,
                        splitCL, text;
                        if (parent.getAttribute("class") != null) {
                            cL = parent.getAttribute("class").split(" ");
                            for (var i = 0; i < cL.length; i++) {
                                if (cL[i].indexOf("cellFrom_") > -1) {
                                    splitCL = cL[i].split("textFormula_");
                                    if (splitCL && splitCL[0] && splitCL[1]) {
                                        cellFrom = splitCL[0].replace("cellFrom_", "");
                                        text = splitCL[1];
                                    } else {
                                        cellFrom = cL[i].replace("cellFrom_", "");
                                    }
                                    break;
                                } else {
                                    if (cL[i].indexOf("qPrefix") > -1) {
                                        prefix = "'";
                                        break;
                                    }
                                }
                            }
                        }
                        if (!text) {
                            text = elem.textContent.replace("\t", "");
                        }
                        if (elem.nodeName.toLowerCase() == "br") {
                            text = "\n";
                        }
                        var colorText = style.getPropertyValue("color");
                        if (isText || (isText == "" && typeof isText == "string")) {
                            colorText = null;
                        }
                        res.push({
                            format: {
                                fn: fn,
                                fs: fs,
                                c: colorText,
                                b: fb.indexOf("bold") >= 0 || parseInt(fb, 10) > 500,
                                i: fi.indexOf("italic") >= 0,
                                u: td.indexOf("underline") >= 0 ? "single" : "none",
                                s: td.indexOf("line-through") >= 0,
                                va: va.indexOf("sub") >= 0 ? "subscript" : va.indexOf("sup") >= 0 ? "superscript" : "none"
                            },
                            text: prefix + text,
                            cellFrom: cellFrom
                        });
                        if (elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement && elem.parentElement.parentElement.nodeName.toLowerCase() == "p" && elem.parentElement.parentElement.parentElement.nodeName.toLowerCase() == "td") {
                            if (elem.parentElement.parentElement.nextSibling && elem.parentElement.parentElement.nextSibling.nodeName.toLowerCase() == "p") {
                                res.push({
                                    format: {
                                        fn: fn,
                                        fs: fs,
                                        c: colorText,
                                        b: fb.indexOf("bold") >= 0 || parseInt(fb, 10) > 500,
                                        i: fi.indexOf("italic") >= 0,
                                        u: td.indexOf("underline") >= 0 ? "single" : "none",
                                        s: td.indexOf("line-through") >= 0,
                                        va: va.indexOf("sub") >= 0 ? "subscript" : va.indexOf("sup") >= 0 ? "superscript" : "none"
                                    },
                                    text: "\n",
                                    cellFrom: cellFrom
                                });
                            }
                            res.wrap = true;
                        }
                        if (fn !== "") {
                            fonts.push(fn);
                        }
                        return;
                    }
                }
                if (elem.childNodes == undefined) {
                    Array.prototype.forEach.call(elem, processElement);
                } else {
                    Array.prototype.forEach.call(elem.childNodes, processElement);
                }
            });
            fonts.sort();
            for (i = 0; i < fonts.length;) {
                if (i + 1 < fonts.length && fonts[i] === fonts[i + 1]) {
                    fonts.splice(i + 1, 1);
                    continue;
                }++i;
            }
            res.fonts = fonts;
            return res;
        },
        _makeRangeFromHtml: function (callback) {
            if (!callback || !callback.call) {
                return;
            }
            var t = this;
            var res = {};
            callback(res);
        },
        _checkFonts: function (fontName) {
            var defaultFont = "Calibri";
            if (null === this.Api) {
                return defaultFont;
            }
            if (this.Api.FontLoader.map_font_index[fontName] != undefined) {
                return fontName;
            }
            var arrName = fontName.toLowerCase().split(" ");
            var newFontName = "";
            for (var i = 0; i < arrName.length; i++) {
                arrName[i] = arrName[i].substr(0, 1).toUpperCase() + arrName[i].substr(1).toLowerCase();
                if (i == arrName.length - 1) {
                    newFontName += arrName[i];
                } else {
                    newFontName += arrName[i] + " ";
                }
            }
            if (this.Api.FontLoader.map_font_index[newFontName] != undefined) {
                return newFontName;
            } else {
                return defaultFont;
            }
        },
        _encode: function (input) {
            return Base64.encode(input).replace(/\//g, "_s").replace(/\+/g, "_p").replace(/=/g, "_e");
        },
        _decode: function (input) {
            return Base64.decode(input.replace(/_s/g, "/").replace(/_p/g, "+").replace(/_e/g, "="));
        },
        _getSelectedDrawingIndex: function (worksheet) {
            if (!worksheet) {
                return false;
            }
            var images = worksheet.model.Drawings;
            var n = 0;
            var arrImages = [];
            if (images) {
                for (var i = 0; i < images.length; i++) {
                    if ((images[i].graphicObject && images[i].graphicObject.selected == true) || (images[i].flags.selected == true)) {
                        arrImages[n] = i;
                        n++;
                    }
                }
            }
            if (n == 0) {
                return -1;
            } else {
                return arrImages;
            }
        },
        _insertImages: function (ws, array, onlyFromLocalStorage) {
            if (!array || array && array.length == 0) {
                return false;
            }
            var firstRange = ws.activeRange.clone(true);
            for (var i = 0; i < array.length; i++) {
                var binary_shape = array[i].image.getAttribute("alt");
                var sub;
                if (typeof binary_shape === "string") {
                    sub = binary_shape.substr(0, 18);
                }
                if (typeof binary_shape === "string" && (sub === "TeamLabShapeSheets" || sub === "TeamLabImageSheets" || sub === "TeamLabChartSheets" || sub === "TeamLabGroupSheets")) {
                    var reader = CreateBinaryReader(binary_shape, 18, binary_shape.length);
                    reader.GetLong();
                    if (isRealObject(reader)) {
                        reader.oImages = this.oImages;
                    }
                    var first_string = null;
                    if (reader !== null && typeof reader === "object") {
                        first_string = sub;
                    }
                    var positionX = null;
                    var positionY = null;
                    if (ws.cols && firstRange && firstRange.c1 != undefined && ws.cols[firstRange.c1].left != undefined) {
                        positionX = ws.cols[firstRange.c1].left - ws.getCellLeft(0, 1);
                    }
                    if (ws.rows && firstRange && firstRange.r1 != undefined && ws.rows[firstRange.r1].top != undefined) {
                        positionY = ws.rows[firstRange.r1].top - ws.getCellTop(0, 1);
                    }
                    var Drawing;
                    switch (first_string) {
                    case "TeamLabImageSheets":
                        Drawing = new CImageShape();
                        break;
                    case "TeamLabShapeSheets":
                        Drawing = new CShape();
                        break;
                    case "TeamLabGroupSheets":
                        Drawing = new CGroupShape();
                        break;
                    case "TeamLabChartSheets":
                        if (typeof CChartAsGroup !== "undefined") {
                            Drawing = new CChartAsGroup();
                            Drawing.setAscChart(new asc_CChart());
                        } else {
                            return true;
                        }
                        break;
                    }
                    if (positionX && positionY && ws.objectRender) {
                        Drawing.readFromBinaryForCopyPaste(reader, null, ws.objectRender, ws.objectRender.convertMetric(positionX, 1, 3), ws.objectRender.convertMetric(positionY, 1, 3));
                    } else {
                        Drawing.readFromBinaryForCopyPaste(reader, null, ws.objectRender);
                    }
                    Drawing.drawingObjects = ws.objectRender;
                    Drawing.select(ws.objectRender.controller);
                    Drawing.addToDrawingObjects();
                }
            }
            return true;
        }
    };
    window["Asc"].Clipboard = Clipboard;
})(jQuery, window);
window.USER_AGENT_MACOS = AscBrowser.isMacOs;
window.USER_AGENT_SAFARI_MACOS = AscBrowser.isSafariMacOs;
window.USER_AGENT_IE = AscBrowser.isIE || AscBrowser.isOpera;
window.USER_AGENT_WEBKIT = AscBrowser.isWebkit;
window.GlobalPasteFlag = false;
window.GlobalPasteFlagCounter = 0;
var COPY_ELEMENT_ID = "clipboard-helper";
var PASTE_ELEMENT_ID = "wrd_pastebin";
var ELEMENT_DISPAY_STYLE = "none";
var COPYPASTE_ELEMENT_CLASS = "sdk-element";
var kElementTextId = "clipboard-helper-text";
var isNeedEmptyAfterCut = false;
var PASTE_EMPTY_COUNTER_MAX = 10;
var PASTE_EMPTY_COUNTER = 0;
var PASTE_EMPTY_USE = AscBrowser.isMozilla;
if (window.USER_AGENT_SAFARI_MACOS) {
    var PASTE_ELEMENT_ID = "clipboard-helper";
    var ELEMENT_DISPAY_STYLE = "block";
}
function SafariIntervalFocus() {
    var api = window["Asc"]["editor"];
    if (api) {
        if ((api.wb && api.wb.cellEditor && api.wb.cellEditor != null && api.wb.cellEditor.isTopLineActive) || (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isSelectionDialogMode)) {
            return;
        }
        var pastebin = document.getElementById(COPY_ELEMENT_ID);
        var pastebinText = document.getElementById(kElementTextId);
        if (pastebinText && (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode) && api.IsFocus) {
            pastebinText.focus();
        } else {
            if (pastebin && api.IsFocus) {
                pastebin.focus();
            } else {
                if (!pastebin || !pastebinText) {
                    Editor_CopyPaste_Create(api);
                }
            }
        }
    }
}
function Editor_CopyPaste_Create(api) {
    var ElemToSelect = document.createElement("div");
    ElemToSelect.id = COPY_ELEMENT_ID;
    ElemToSelect.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
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
    ElemToSelect.style.lineHeight = "1px";
    ElemToSelect["onpaste"] = function (e) {
        if (!window.GlobalPasteFlag) {
            return;
        }
        if (window.GlobalPasteFlagCounter == 1) {
            api.wb.clipboard._bodyPaste(api.wb.getWorksheet(), e);
            if (window.GlobalPasteFlag) {
                window.GlobalPasteFlagCounter = 2;
            }
        }
    };
    ElemToSelect["onbeforecopy"] = function (e) {
        var ws = api.wb.getWorksheet();
        if (!ws.isCellEditMode) {
            api.wb.clipboard.copyRange(ws.getSelectedRange(), ws);
        }
    };
    ElemToSelect["onbeforecut"] = function (e) {
        if (!api.isCellEdited) {
            var ws = api.wb.getWorksheet();
            api.wb.clipboard.copyRange(ws.getSelectedRange(), ws);
            if (isNeedEmptyAfterCut) {
                isNeedEmptyAfterCut = false;
                ws.emptySelection(c_oAscCleanOptions.All);
            } else {
                isNeedEmptyAfterCut = true;
            }
        }
    };
    document.body.appendChild(ElemToSelect);
    var elementText = document.createElement("textarea");
    elementText.id = kElementTextId;
    elementText.style.position = "absolute";
    elementText.style.width = "10000px";
    elementText.style.height = "100px";
    elementText.style.left = "0px";
    elementText.style.top = "-100px";
    elementText.style.overflow = "hidden";
    elementText.style.zIndex = -1000;
    elementText.style.display = ELEMENT_DISPAY_STYLE;
    elementText.setAttribute("contentEditable", true);
    elementText.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
    elementText["onbeforecopy"] = function (e) {
        if ((api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode)) {
            var v = api.wb.cellEditor.copySelection();
            if (v) {
                api.wb.clipboard.copyCellValue(v, api.wb.cellEditor.hasBackground ? api.wb.cellEditor.background : null);
            }
        }
    };
    elementText["onbeforecut"] = function (e) {
        api.wb.clipboard.copyRange(api.wb.getWorksheet().getSelectedRange(), api.wb.getWorksheet());
        if (isNeedEmptyAfterCut == true) {
            isNeedEmptyAfterCut = false;
            if ((api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode)) {
                var v = api.wb.cellEditor.cutSelection();
                if (v) {
                    api.wb.clipboard.copyCellValue(v, api.wb.cellEditor.hasBackground ? api.wb.cellEditor.background : null);
                }
            }
        } else {
            isNeedEmptyAfterCut = true;
        }
    };
    document.body.appendChild(elementText);
}
function CreateBinaryReader(szSrc, offset, srcLen) {
    var nWritten = 0;
    var index = -1 + offset;
    var dst_len = "";
    for (; index < srcLen;) {
        index++;
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0)) {
            index++;
            break;
        }
        dst_len += String.fromCharCode(_c);
    }
    var dstLen = parseInt(dst_len);
    if (isNaN(dstLen)) {
        return null;
    }
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
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
            for (i = 0; i < nBits / 8; i++) {
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
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    return stream;
}