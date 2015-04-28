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
(function ($, window, undefined) {
    var doc = window.document;
    var isTruePaste = false;
    var activateLocalStorage = false;
    var isOnlyLocalBufferSafari = false;
    var copyPasteUseBinary = true;
    var copyPasteFromWordUseBinary = true;
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
            var c1, c2, c3;
            while (i < utftext.length) {
                c1 = utftext.charCodeAt(i);
                if (c1 < 128) {
                    string += String.fromCharCode(c1);
                    i++;
                } else {
                    if ((c1 > 191) && (c1 < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
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
        this.element = undefined;
        this.ppix = 96;
        this.ppiy = 96;
        this.Api = null;
        this.fullUrl;
        this.activeRange = null;
        this.lStorage = {};
        this.fontsNew = {};
        return this;
    }
    Clipboard.prototype = {
        constructor: Clipboard,
        init: function () {
            var t = this;
            var found = true;
            if (!t.element) {
                t.element = doc.getElementById(COPY_ELEMENT_ID2);
                if (!t.element) {
                    found = false;
                    t.element = doc.createElement("DIV");
                }
            }
            t.element.id = COPY_ELEMENT_ID2;
            t.element.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
            t.element.style.position = "absolute";
            t.element.style.top = "-100px";
            t.element.style.left = "0px";
            if (window.USER_AGENT_MACOS) {
                t.element.style.width = "100px";
            } else {
                t.element.style.width = "10000px";
            }
            t.element.style.height = "100px";
            t.element.style.overflow = "hidden";
            t.element.style.zIndex = -1000;
            t.element.style.display = ELEMENT_DISPAY_STYLE2;
            t.element.setAttribute("contentEditable", true);
            if (!found) {
                doc.body.appendChild(t.element);
            }
            if (!AscBrowser.isMobileVersion) {
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
                if (window.USER_AGENT_MACOS) {
                    t.element.style.width = "100px";
                } else {
                    t.element.style.width = "10000px";
                }
                t.elementText.style.height = "100px";
                t.elementText.style.left = "0px";
                t.elementText.style.top = "-100px";
                t.elementText.style.overflow = "hidden";
                t.elementText.style.zIndex = -1000;
                t.elementText.style.display = ELEMENT_DISPAY_STYLE2;
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
            var objectRender = worksheet.objectRender;
            var isIntoShape = objectRender.controller.getTargetDocContent();
            var text = t._makeTableNode(range, worksheet, isCut, isIntoShape);
            if (text == false) {
                return;
            }
            if (window.USER_AGENT_SAFARI_MACOS && !worksheet.isCellEditMode) {
                this._startCopyOrPaste();
                this.element.appendChild(text);
                History.TurnOff();
                var sBase64 = this._getBinaryForCopy(worksheet);
                if (isIntoShape) {
                    sBase64 = null;
                }
                if (sBase64) {
                    if (this.element.children && this.element.children.length == 1 && (window.USER_AGENT_WEBKIT || window.USER_AGENT_SAFARI_MACOS)) {
                        $(this.element.children[0]).css("font-weight", "normal");
                        $(this.element.children[0]).wrap(document.createElement("b"));
                    }
                    if (this.element.children[0]) {
                        $(this.element.children[0]).addClass("xslData;" + sBase64);
                    }
                    this.lStorage = sBase64;
                }
                History.TurnOn();
                this._endCopyOrPaste();
                return sBase64;
            } else {
                this._startCopyOrPaste();
                if ($(text).find("td")[0] && $(text).find("td")[0].innerText == "" && AscBrowser.isOpera) {
                    $(text).find("td")[0].innerHTML = "&nbsp;";
                }
                t.element.appendChild(text);
                if (!copyPasteUseBinary) {
                    t.copyText = t._getTextFromTable(t.element.children[0]);
                    var randomVal = Math.floor(Math.random() * 10000000);
                    t.copyText.pasteFragment = "pasteFragment_" + randomVal;
                    if (text) {
                        $(text).addClass("pasteFragment_" + randomVal);
                    }
                }
                if ($(text).find("img")[0] && AscBrowser.isOpera) {
                    $(text)[0].innerHTML = "<tr><td>&nbsp;</td></tr>";
                    if (t.copyText.isImage) {
                        t.copyText.text = " ";
                    }
                }
                History.TurnOff();
                if (copyPasteUseBinary) {
                    if (isIntoShape) {
                        this.lStorage = {};
                        this.lStorage.htmlInShape = text;
                    } else {
                        var sBase64 = this._getBinaryForCopy(worksheet);
                        if (this.element.children && this.element.children.length == 1 && (window.USER_AGENT_WEBKIT || window.USER_AGENT_SAFARI_MACOS)) {
                            $(this.element.children[0]).css("font-weight", "normal");
                            $(this.element.children[0]).wrap(document.createElement("b"));
                        }
                        if (this.element.children[0]) {
                            $(this.element.children[0]).addClass("xslData;" + sBase64);
                        }
                        this.lStorage = sBase64;
                    }
                }
                History.TurnOn();
                if (AscBrowser.isMozilla) {
                    t._selectElement(t._getStylesSelect);
                } else {
                    t._selectElement();
                }
                this._endCopyOrPaste();
            }
        },
        _getBinaryForCopy: function (worksheet) {
            var fullUrl = this._getUseFullUrl();
            window.global_pptx_content_writer.Start_UseFullUrl(fullUrl);
            var cloneActiveRange = worksheet.activeRange.clone();
            var temp;
            if (cloneActiveRange.c1 > cloneActiveRange.c2) {
                temp = cloneActiveRange.c1;
                cloneActiveRange.c1 = cloneActiveRange.c2;
                cloneActiveRange.c2 = temp;
            }
            if (cloneActiveRange.r1 > cloneActiveRange.r2) {
                temp = cloneActiveRange.r1;
                cloneActiveRange.r1 = cloneActiveRange.r2;
                cloneActiveRange.r2 = temp;
            }
            var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, cloneActiveRange);
            var sBase64 = oBinaryFileWriter.Write();
            window.global_pptx_content_writer.End_UseFullUrl();
            return sBase64;
        },
        copyRangeButton: function (range, worksheet, isCut) {
            if (AscBrowser.isIE) {
                this._cleanElement();
                var text = this._makeTableNode(range, worksheet);
                if (text == false) {
                    return true;
                }
                this.element.appendChild(text);
                if (copyPasteUseBinary) {
                    if (isIntoShape) {
                        this.lStorage = {};
                        this.lStorage.htmlInShape = text;
                    } else {
                        var fullUrl = this._getUseFullUrl();
                        window.global_pptx_content_writer.Start_UseFullUrl(fullUrl);
                        var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
                        var sBase64 = oBinaryFileWriter.Write();
                        if (this.element.children && this.element.children.length == 1 && window.USER_AGENT_WEBKIT && (true !== window.USER_AGENT_SAFARI_MACOS)) {
                            $(this.element.children[0]).css("font-weight", "normal");
                            $(this.element.children[0]).wrap(document.createElement("b"));
                        }
                        if (this.element.children[0]) {
                            $(this.element.children[0]).addClass("xslData;" + sBase64);
                        }
                        this.lStorage = sBase64;
                        window.global_pptx_content_writer.End_UseFullUrl();
                    }
                }
                var t = this,
                selection, rangeToSelect, overflowBody;
                overflowBody = document.body.style.overflow;
                document.body.style.overflow = "hidden";
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
                    document.body.style.overflow = overflowBody;
                    t.element.style.display = "none";
                    doc.body.style.MozUserSelect = "none";
                    doc.body.style["-khtml-user-select"] = "none";
                    doc.body.style["-o-user-select"] = "none";
                    doc.body.style["user-select"] = "none";
                    doc.body.style["-webkit-user-select"] = "none";
                },
                0);
                return true;
            } else {
                if (copyPasteUseBinary) {
                    var t = this;
                    var objectRender = worksheet.objectRender;
                    var isIntoShape = objectRender.controller.getTargetDocContent();
                    var text = t._makeTableNode(range, worksheet, isCut, isIntoShape);
                    if (text == false) {
                        return true;
                    }
                    if (isIntoShape) {
                        this.lStorage = {};
                        this.lStorage.htmlInShape = text;
                    } else {
                        var fullUrl = this._getUseFullUrl();
                        window.global_pptx_content_writer.Start_UseFullUrl(fullUrl);
                        var oBinaryFileWriter = new Asc.BinaryFileWriter(worksheet.model.workbook, worksheet.activeRange);
                        var sBase64 = oBinaryFileWriter.Write();
                        this.lStorage = sBase64;
                        window.global_pptx_content_writer.End_UseFullUrl();
                    }
                    while (this.element.hasChildNodes()) {
                        this.element.removeChild(this.element.lastChild);
                    }
                    if (text !== false) {
                        this.element.appendChild(text);
                    }
                    if (this.element.children[0] && sBase64) {
                        $(this.element.children[0]).addClass("xslData;" + sBase64);
                    }
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
            }
            return false;
        },
        pasteRange: function (worksheet) {
            var t = this;
            if (AscBrowser.isMozilla) {
                t._editorPaste(worksheet, t._getStylesSelect);
            } else {
                t._editorPaste(worksheet);
            }
        },
        pasteRangeButton: function (worksheet) {
            if (AscBrowser.isIE) {
                var t = this;
                document.body.style.MozUserSelect = "text";
                delete document.body.style["-khtml-user-select"];
                delete document.body.style["-o-user-select"];
                delete document.body.style["user-select"];
                document.body.style["-webkit-user-select"] = "text";
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
                t._editorPasteExec(worksheet, pastebin);
                return true;
            } else {
                if (activateLocalStorage || copyPasteUseBinary) {
                    var t = this;
                    var onlyFromLocalStorage = true;
                    t._editorPasteExec(worksheet, t.lStorage, false, onlyFromLocalStorage);
                    return true;
                }
            }
            return false;
        },
        copyCellValue: function (value) {
            var t = this;
            t._startCopyOrPaste();
            if (activateLocalStorage || copyPasteUseBinary) {
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
                t.element.appendChild(node);
            });
            if (AscBrowser.isMozilla) {
                t._selectElement(t._getStylesSelect, true);
            } else {
                t._selectElement();
            }
            this._endCopyOrPaste();
        },
        copyCellValueButton: function (value) {
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
                while (this.element.hasChildNodes()) {
                    this.element.removeChild(this.element.lastChild);
                }
                nodes.forEach(function (node) {
                    t.element.appendChild(node);
                });
                var t = this,
                selection, rangeToSelect;
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
                },
                0);
                return true;
            } else {
                if (activateLocalStorage || copyPasteUseBinary) {
                    var t = this;
                    t._addValueToLocalStrg(value);
                    var nodes = t._makeNodesFromCellValue(value);
                    while (t.element.hasChildNodes()) {
                        t.element.removeChild(t.element.lastChild);
                    }
                    nodes.forEach(function (node) {
                        t.element.appendChild(node);
                    });
                    return true;
                }
            }
            return false;
        },
        pasteAsText: function (callback) {
            var t = this;
            t.elementText.style.display = "block";
            t._startCopyOrPaste();
            t.elementText.value = "\xa0";
            t.elementText.focus();
            t.elementText.select();
            delete doc.body.style["-khtml-user-select"];
            delete doc.body.style["-o-user-select"];
            delete doc.body.style["user-select"];
            doc.body.style["-webkit-user-select"] = "text";
            doc.body.style.MozUserSelect = "text";
            var _interval_time = 0;
            if (AscBrowser.isMozilla) {
                _interval_time = 10;
            } else {
                if (window.USER_AGENT_MACOS && window.USER_AGENT_WEBKIT) {
                    _interval_time = 200;
                }
            }
            window.setTimeout(function () {
                t.element.style.display = ELEMENT_DISPAY_STYLE2;
                doc.body.style.MozUserSelect = "none";
                doc.body.style["-khtml-user-select"] = "none";
                doc.body.style["-o-user-select"] = "none";
                doc.body.style["user-select"] = "none";
                doc.body.style["-webkit-user-select"] = "none";
                t.elementText.style.display = ELEMENT_DISPAY_STYLE2;
                var textInsert = t.elementText.value;
                if (isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf("safari") > -1 && navigator.userAgent.toLowerCase().indexOf("mac") && t.lStorageText) {
                    textInsert = t.lStorageText;
                }
                if (callback) {
                    callback(textInsert, []);
                }
                if (AscBrowser.isMozilla) {
                    t._getStylesSelect();
                }
                t._endCopyOrPaste();
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
                document.execCommand("paste");
                window.setTimeout(function () {
                    t.element.style.display = "none";
                    doc.body.style.MozUserSelect = "none";
                    doc.body.style["-khtml-user-select"] = "none";
                    doc.body.style["-o-user-select"] = "none";
                    doc.body.style["user-select"] = "none";
                    doc.body.style["-webkit-user-select"] = "none";
                    t.elementText.style.display = "none";
                    callback(t.elementText.value, []);
                },
                0);
                return true;
            } else {
                if (activateLocalStorage || copyPasteUseBinary) {
                    if (t.lStorageText) {
                        callback(t.lStorageText, []);
                    }
                    return true;
                }
            }
            return false;
        },
        bIsEmptyClipboard: function (isCellEditMode) {
            var result = false;
            if (isCellEditMode && (!t.lStorageText || t.lStorageText == null || t.lStorageText == "")) {
                result = true;
            } else {
                if (!isCellEditMode && !t.lStorage) {
                    result = true;
                }
            }
            return result;
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
            this.element.style.MozUserSelect = "all";
        },
        _getUseFullUrl: function (recalculate) {
            if (this.fullUrl == undefined || recalculate === true) {
                var api = window["Asc"]["editor"];
                var sProtocol = window.location.protocol;
                var documentOrigin;
                var sHost = window.location.host;
                documentOrigin = "";
                if (sProtocol && "" != sProtocol) {
                    documentOrigin = sProtocol + "//" + sHost;
                } else {
                    documentOrigin = sHost;
                }
                this.fullUrl = documentOrigin + g_sResourceServiceLocalUrl + api.documentId + "/";
            }
            return this.fullUrl;
        },
        _getStylesSelect: function (worksheet) {
            document.body.style.MozUserSelect = "";
            delete document.body.style["-khtml-user-select"];
            delete document.body.style["-o-user-select"];
            delete document.body.style["user-select"];
            document.body.style["-webkit-user-select"] = "text";
        },
        _editorPaste: function (worksheet, callback) {
            if (window.USER_AGENT_SAFARI_MACOS) {
                return;
            }
            this._startCopyOrPaste();
            var t = this;
            window.GlobalPasteFlagCounter = 1;
            isTruePaste = false;
            var is_chrome = AscBrowser.isChrome;
            document.body.style.MozUserSelect = "text";
            delete document.body.style["-khtml-user-select"];
            delete document.body.style["-o-user-select"];
            delete document.body.style["user-select"];
            document.body.style["-webkit-user-select"] = "text";
            var overflowBody = document.body.style.overflow;
            document.body.style.overflow = "hidden";
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
                document.body.style.overflow = overflowBody;
                if (!isTruePaste) {
                    t._editorPasteExec(worksheet, pastebin);
                }
                t._endCopyOrPaste();
                pastebin.style.display = ELEMENT_DISPAY_STYLE2;
                if (AscBrowser.isIE) {
                    pastebin.style.display = ELEMENT_DISPAY_STYLE2;
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
            var pastebin = document.getElementById(PASTE_ELEMENT_ID2);
            if (!pastebin) {
                pastebin = document.createElement("div");
                pastebin.setAttribute("id", PASTE_ELEMENT_ID2);
                pastebin.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
                pastebin.style.position = "absolute";
                pastebin.style.top = "100px";
                pastebin.style.left = "0px";
                if (window.USER_AGENT_MACOS) {
                    t.element.style.width = "100px";
                } else {
                    t.element.style.width = "10000px";
                }
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
                    if (fTest(e.clipboardData.types, "text/plain")) {
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
                if (window.USER_AGENT_MACOS) {
                    ifr.style.width = "100px";
                } else {
                    ifr.style.width = "10000px";
                }
                ifr.style.height = "100px";
                ifr.style.overflow = "hidden";
                ifr.style.zIndex = -1000;
                document.body.appendChild(ifr);
            }
            this._startCopyOrPaste();
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
                ifr.style.display = ELEMENT_DISPAY_STYLE2;
            }
            if (bExist) {
                isTruePaste = true;
                if (e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                this._endCopyOrPaste();
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
            var jqSpanObject = $(spanObject),
            fontSize;
            var oNewItem = {};
            oNewItem.text = jqSpanObject.text().replace(/(\r|\t|\n|)/g, "");
            oNewItem.format = {};
            oNewItem.format.fn = g_fontApplication.GetFontNameDictionary(spanObject.style.fontFamily, true);
            if (oNewItem.format.fn == null || oNewItem.format.fn == "") {
                oNewItem.format.fn = "Calibri";
            }
            if (jqSpanObject.css("vertical-align") == "sub" || jqSpanObject.css("vertical-align") == "super") {
                fontSize = $(spanObject.parentNode).css("font-size");
                if (fontSize.indexOf("pt") > -1) {
                    oNewItem.format.fs = parseInt(fontSize);
                } else {
                    oNewItem.format.fs = parseInt((3 / 4) * Math.round(parseFloat(fontSize)));
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
            oNewItem.format.b = (jqSpanObject.css("font-weight") == "bold");
            oNewItem.format.i = (jqSpanObject.css("font-style") == "italic");
            oNewItem.format.u = (jqSpanObject.css("text-decoration") == "underline") ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
            oNewItem.format.s = (jqSpanObject.css("text-decoration") == "line-through");
            if (jqSpanObject.css("vertical-align") != null) {
                oNewItem.format.va = jqSpanObject.css("vertical-align");
            }
            if (jqSpanObject.css("vertical-align") == "baseline") {
                oNewItem.format.va = "";
            }
            oNewItem.format.c = new RgbColor(this._getBinaryColor(jqSpanObject.css("color")));
            if (oNewItem.format.c == "") {
                oNewItem.format.c = null;
            }
            if (jqSpanObject.css("vertical-align") != null) {
                oNewItem.format.va = jqSpanObject.css("vertical-align") === "sub" ? "subscript" : jqSpanObject.css("vertical-align") === "super" ? "superscript" : "baseline";
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
            if (typeof borderWidth == "string" && -1 !== borderWidth.indexOf("pt")) {
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
            var aResult = [];
            var oNewItem = [];
            var tmpBorderStyle, borderStyleName;
            var t = this;
            if (node == undefined) {
                node = document.createElement("span");
            }
            if (node == undefined || node == null) {
                oNewItem[0] = t._getDefaultCell();
                this.fontsNew["Arial"] = 1;
            } else {
                if (node.children != undefined && node.children.length == 0) {
                    oNewItem[0] = t._setStylesTextPaste(node);
                    this.fontsNew[oNewItem[0].format.fn] = 1;
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
                var borderTopColor = node.style.borderTopColor;
                if (borderTopColor == "") {
                    borderTopColor = $(node).css("border-top-color");
                }
                if (borderTopColor) {
                    borderTopColor = this._getBinaryColor(borderTopColor);
                } else {
                    borderTopColor = 0;
                }
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
                var borderBottomColor = node.style.borderBottomColor;
                if (borderBottomColor == "") {
                    borderBottomColor = $(node).css("border-bottom-color");
                }
                if (borderBottomColor) {
                    borderBottomColor = this._getBinaryColor(borderBottomColor);
                } else {
                    borderBottomColor = 0;
                }
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
                var borderLeftColor = node.style.borderLeftColor;
                if (borderLeftColor == "") {
                    borderLeftColor = $(node).css("border-left-color");
                }
                if (borderLeftColor) {
                    borderLeftColor = this._getBinaryColor(borderLeftColor);
                } else {
                    borderLeftColor = 0;
                }
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
                var borderRightColor = node.style.borderRightColor;
                if (borderRightColor == "") {
                    borderRightColor = $(node).css("border-right-color");
                }
                if (borderRightColor) {
                    borderRightColor = this._getBinaryColor(borderRightColor);
                } else {
                    borderRightColor = 0;
                }
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
                oNewItem.bc = new RgbColor(this._getBinaryColor($(node).css("background-color")));
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
            var findHyperLink = $(node).find("a");
            if ($(node).children("a").length == 1 && oNewItem[0] != undefined) {
                oNewItem.hyperLink = $(node).children("a").attr("href");
                if ($(node).children("a").attr("title")) {
                    oNewItem.toolTip = $(node).children("a").attr("title");
                } else {
                    oNewItem.toolTip = null;
                }
            } else {
                if (findHyperLink && findHyperLink[0] && oNewItem[0] != undefined && findHyperLink.length == 1) {
                    oNewItem.hyperLink = findHyperLink.attr("href");
                    if (findHyperLink.attr("title")) {
                        oNewItem.toolTip = findHyperLink.attr("title");
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
            }
            aResult.push(oNewItem);
            return aResult;
        },
        _IsBlockElem: function (name) {
            if ("p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "tbody" == name || "tr" == name || "td" == name || "th" == name || "h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name) {
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
                if (! (nodes[n].nodeName.toLowerCase() == "meta" || nodes[n].nodeName.toLowerCase() == "style" || nodes[n].nodeName.toLowerCase() == "#comment" || (nodes[n].nodeName.toLowerCase() == "#text" && nodes[n].textContent.replace(/(\r|\t|\n| )/g, "") == ""))) {
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
        _pasteFromBinary: function (worksheet, node, onlyFromLocalStorage, isIntoShape) {
            var base64 = null,
            base64FromWord = null,
            base64FromPresentation = null,
            t = this;
            if (onlyFromLocalStorage) {
                if (typeof t.lStorage == "object") {
                    if (t.lStorage.htmlInShape) {
                        return t.lStorage.htmlInShape;
                    } else {
                        window.GlobalPasteFlag = false;
                        window.GlobalPasteFlagCounter = 0;
                        return true;
                    }
                } else {
                    base64 = t.lStorage;
                }
            } else {
                var classNode;
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
                            base64 = cL[i].split("xslData;")[1];
                        } else {
                            if (cL[i].indexOf("docData;") > -1) {
                                base64FromWord = cL[i].split("docData;")[1];
                            } else {
                                if (cL[i].indexOf("pptData;") > -1) {
                                    base64FromPresentation = cL[i].split("pptData;")[1];
                                }
                            }
                        }
                    }
                }
            }
            if (base64 != null) {
                var oBinaryFileReader = new Asc.BinaryFileReader(null, true);
                var tempWorkbook = new Workbook;
                oBinaryFileReader.Read(base64, tempWorkbook);
                this.activeRange = oBinaryFileReader.copyPasteObj.activeRange;
                var pasteData = null;
                if (tempWorkbook) {
                    pasteData = tempWorkbook.aWorksheets[0];
                }
                if (pasteData) {
                    if (pasteData.Drawings && pasteData.Drawings.length) {
                        if (! (window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor)) {
                            var historyIsTurnOn = History.Is_On();
                            if (!historyIsTurnOn) {
                                History.TurnOn();
                            }
                            t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                            if (!historyIsTurnOn) {
                                History.TurnOff();
                            }
                        }
                    } else {
                        var newFonts = {};
                        pasteData.generateFontMap(newFonts);
                        worksheet._loadFonts(newFonts, function () {
                            worksheet.setSelectionInfo("paste", pasteData, false, "binary");
                        });
                    }
                    window.GlobalPasteFlag = false;
                    window.GlobalPasteFlagCounter = 0;
                    return true;
                }
            } else {
                if (base64FromWord && copyPasteFromWordUseBinary) {
                    var pasteData = this.ReadFromBinaryWord(base64FromWord, worksheet);
                    var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, worksheet);
                    pasteFromBinaryWord._paste(worksheet, pasteData);
                    window.GlobalPasteFlag = false;
                    window.GlobalPasteFlagCounter = 0;
                    return true;
                } else {
                    if (base64FromPresentation) {
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
                            return false;
                            var docContent = this.ReadPresentationText(stream, worksheet);
                            var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, worksheet);
                            pasteFromBinaryWord._paste(worksheet, {
                                DocumentContent: docContent
                            });
                            window.GlobalPasteFlag = false;
                            window.GlobalPasteFlagCounter = 0;
                            return true;
                        case "Drawings":
                            var objects = this.ReadPresentationShapes(stream, worksheet);
                            if (!objects.arrImages.length && objects.arrShapes.length === 1) {
                                var drawing = objects.arrShapes[0].graphicObject;
                                if (typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame) {
                                    return false;
                                }
                            }
                            var arr_shapes = objects.arrShapes;
                            if (arr_shapes && arr_shapes.length) {
                                if (! (window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor)) {
                                    t._insertImagesFromBinary(worksheet, {
                                        Drawings: arr_shapes
                                    },
                                    isIntoShape);
                                }
                            }
                            window.GlobalPasteFlag = false;
                            window.GlobalPasteFlagCounter = 0;
                            return true;
                        case "SlideObjects":
                            break;
                        }
                    }
                }
            }
            return false;
        },
        ReadPresentationShapes: function (stream, worksheet) {
            var loader = new BinaryPPTYLoader();
            loader.presentation = worksheet.model;
            loader.Start_UseFullUrl();
            loader.stream = stream;
            var count = stream.GetULong();
            var arr_shapes = [];
            var arr_transforms = [];
            var arrBase64Img = [];
            var cStyle;
            for (var i = 0; i < count; ++i) {
                var style_index = null;
                if (!loader.stream.GetBool()) {
                    if (loader.stream.GetBool()) {
                        loader.stream.Skip2(1);
                        cStyle = loader.ReadTableStyle();
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
                if (count !== 1 && typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame) {
                    drawing = DrawingObjectsController.prototype.createImage(base64, x, y, extX, extY);
                }
                arr_shapes[i] = worksheet.objectRender.createDrawingObject();
                arr_shapes[i].graphicObject = drawing;
            }
            return {
                arrShapes: arr_shapes,
                arrImages: loader.End_UseFullUrl(),
                arrTransforms: arr_transforms
            };
        },
        ReadPresentationText: function (stream, worksheet) {
            var loader = new BinaryPPTYLoader();
            loader.Start_UseFullUrl();
            loader.stream = stream;
            loader.presentation = worksheet.model;
            var count = stream.GetULong() / 100000;
            var elements = [],
            paragraph,
            selectedElement;
            for (var i = 0; i < count; ++i) {
                loader.stream.Skip2(1);
                paragraph = loader.ReadParagraph(worksheet.model);
                elements.push(paragraph);
            }
            return elements;
        },
        _pasteInShape: function (worksheet, node, onlyFromLocalStorage, targetDocContent) {
            targetDocContent.DrawingDocument.m_oLogicDocument = null;
            var oPasteProcessor = new PasteProcessor({
                WordControl: {
                    m_oLogicDocument: targetDocContent
                },
                FontLoader: {}
            },
            false, false, true, true);
            oPasteProcessor.map_font_index = this.Api.FontLoader.map_font_index;
            oPasteProcessor.bIsDoublePx = false;
            var newFonts;
            if (onlyFromLocalStorage) {
                node = this.element;
            }
            if (targetDocContent && targetDocContent.Parent && targetDocContent.Parent.parent && targetDocContent.Parent.parent.chart) {
                var changeTag = $(node).find("a");
                this._changeHtmlTag(changeTag);
            }
            oPasteProcessor._Prepeare_recursive(node, true, true);
            oPasteProcessor.aContent = [];
            newFonts = this._convertFonts(oPasteProcessor.oFonts);
            History.Create_NewPoint();
            History.StartTransaction();
            oPasteProcessor._Execute(node, {},
            true, true, false);
            if (!oPasteProcessor.aContent || !oPasteProcessor.aContent.length) {
                History.EndTransaction();
                return false;
            }
            var targetContent = worksheet.objectRender.controller.getTargetDocContent(true);
            targetContent.Remove(1, true, true);
            worksheet._loadFonts(newFonts, function () {
                oPasteProcessor.InsertInPlace(targetContent, oPasteProcessor.aContent);
                worksheet.objectRender.controller.startRecalculate();
                worksheet.objectRender.controller.cursorMoveRight(false, false);
                window.GlobalPasteFlag = false;
                window.GlobalPasteFlagCounter = 0;
                History.EndTransaction();
            });
            return true;
        },
        _changeHtmlTag: function (arr) {
            var oldElem, value, style, bold, underline, italic;
            for (var i = 0; i < arr.length; i++) {
                oldElem = arr[i];
                value = oldElem.innerText;
                underline = "none";
                if (oldElem.style.textDecoration && oldElem.style.textDecoration != "") {
                    underline = oldElem.style.textDecoration;
                }
                italic = "normal";
                if (oldElem.style.textDecoration && oldElem.style.textDecoration != "") {
                    italic = oldElem.style.fontStyle;
                }
                bold = "normal";
                if (oldElem.style.fontWeight && oldElem.style.fontWeight != "") {
                    bold = oldElem.style.fontWeight;
                }
                style = ' style = "text-decoration:' + underline + ";" + "font-style:" + italic + ";" + "font-weight:" + bold + ";" + '"';
                $(oldElem).replaceWith("<span" + style + ">" + value + "</span>");
            }
        },
        _convertFonts: function (oFonts) {
            var newFonts = {};
            var fontName;
            for (var i in oFonts) {
                fontName = oFonts[i].Name;
                newFonts[fontName] = 1;
            }
            return newFonts;
        },
        _editorPasteExec: function (worksheet, node, isText, onlyFromLocalStorage) {
            if (node == undefined) {
                return;
            }
            var aResult, binaryResult, pasteFragment = node,
            t = this,
            localStorageResult;
            if (isOnlyLocalBufferSafari && navigator.userAgent.toLowerCase().indexOf("safari") > -1 && navigator.userAgent.toLowerCase().indexOf("mac")) {
                onlyFromLocalStorage = true;
            }
            if (onlyFromLocalStorage) {
                onlyFromLocalStorage = null;
                node = this.element;
                pasteFragment = node;
            }
            var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
            if (isIntoShape) {
                var resultPasteInShape = this._pasteInShape(worksheet, node, onlyFromLocalStorage, isIntoShape);
                if (resultPasteInShape == true) {
                    return;
                }
            }
            if (copyPasteUseBinary) {
                this.activeRange = worksheet.activeRange.clone(true);
                binaryResult = this._pasteFromBinary(worksheet, node, onlyFromLocalStorage, isIntoShape);
                if (binaryResult === true) {
                    return;
                } else {
                    if (binaryResult !== false && binaryResult != undefined) {
                        pasteFragment = binaryResult;
                        node = binaryResult;
                    }
                }
            }
            this.activeRange = worksheet.activeRange.clone(true);
            aResult = this._parseHtml(pasteFragment, node, worksheet, isText);
            if (aResult) {
                this._correctImageUrl(aResult, worksheet);
            }
        },
        _correctImageUrl: function (aResult, worksheet) {
            var api = asc["editor"];
            var aImagesToDownload = [];
            var t = this;
            var addImages = aResult.addImages ? aResult.addImages : [];
            for (var k = 0; k < addImages.length; k++) {
                var src = addImages[k].tag.src;
                if (false == (0 == src.indexOf(api.documentUrl) || 0 == src.indexOf(api.documentUrl))) {
                    aImagesToDownload.push(src);
                }
            }
            if (aImagesToDownload.length > 0) {
                var rData = {
                    "id": api.documentId,
                    "c": "imgurls",
                    "vkey": api.documentVKey,
                    "data": JSON.stringify(aImagesToDownload)
                };
                api._asc_sendCommand(function (incomeObject) {
                    if (incomeObject && "imgurls" == incomeObject.type) {
                        var oFromTo = JSON.parse(incomeObject.data);
                        var nC, height, width;
                        for (var i = 0, length = addImages.length; i < length; ++i) {
                            var sTo = oFromTo[aResult.addImages[i].tag.src];
                            if (sTo) {
                                if (aResult.addImages[i]) {
                                    height = aResult.addImages[i].tag.height;
                                    width = aResult.addImages[i].tag.width;
                                    aResult.addImages[i].tag = {
                                        height: height,
                                        width: width,
                                        src: sTo
                                    };
                                }
                            }
                        }
                    }
                    t._pasteResult(aResult, worksheet);
                },
                rData);
            } else {
                t._pasteResult(aResult, worksheet);
            }
        },
        _pasteResult: function (aResult, worksheet) {
            if (aResult && !(aResult.onlyImages && window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor)) {
                worksheet.setSelectionInfo("paste", aResult, this);
            }
            window.GlobalPasteFlagCounter = 0;
            window.GlobalPasteFlag = false;
        },
        _parseHtml: function (pasteFragment, node, worksheet, isText) {
            var cellCountAll = [],
            rowSpanPlus = 0,
            tableRowCount = 0,
            l = 0,
            n = 0,
            s = 0,
            countEmptyRow = 0,
            rowCount = 0,
            arrTags = [],
            t = this,
            aResult = [];
            var range = worksheet.activeRange.clone(true);
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
            var arrMax = [],
            findTable;
            for (n = 0; n < $(pasteFragment).find("table").length; ++n) {
                findTable = $($(pasteFragment).find("table")[n]).find("tr");
                if (findTable && findTable[0]) {
                    arrMax[n] = findTable[0].children.length;
                }
            }
            if (arrMax.length != 0) {
                var max = Math.max.apply(Math, arrMax);
                if (max != 0) {
                    range.c2 = range.c2 + max - 1;
                }
            }
            this.fontsNew = {};
            if (null != $(pasteFragment).find("table") && 1 == countChild && pasteFragment.children[0] != undefined && pasteFragment.children[0].children[0] != undefined && pasteFragment.children[0].children[0].nodeName.toLowerCase() == "table") {
                pasteFragment = pasteFragment.children[0];
            }
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
            if (mainChildrens && mainChildrens.length == 1 && mainChildrens[0].nodeName.toLowerCase() == "b") {
                mainChildrens = mainChildrens[0].children;
            }
            var onlyImages = null;
            var addImages = null;
            var imCount = 0;
            for (var r = range.r1; r - range.r1 < countChild; ++r) {
                var firstRow = mainChildrens[r - range.r1 - countEmptyRow];
                if (firstRow.nodeName.toLowerCase() == "br") {
                    r++;
                }
                aResult[r + tableRowCount] = [];
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
                                aResult[r + tableRowCount] = [];
                            }
                        }
                        tag.innerHTML = tag.innerHTML.replace(/(\n)/g, "");
                        aResult[r + tableRowCount][c] = t._getArray(tag, isText);
                        c = range.c2;
                        cellCountAll[s] = 1;
                        s++;
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
                                    aResult[r + tableRowCount] = [];
                                }
                            }
                            var span = document.createElement("p");
                            $(span).append(tag);
                            aResult[r + tableRowCount][c] = t._getArray(span, isText);
                            c = range.c2;
                            cellCountAll[s] = 1;
                            s++;
                            onlyImages = false;
                        } else {
                            if (tag.nodeName.toLowerCase() == "span" || tag.nodeName.toLowerCase() == "a" || tag.nodeName.toLowerCase() == "form") {
                                aResult[r + tableRowCount][c] = t._getArray(tag, isText);
                                cellCountAll[s] = 1;
                                c = range.c2;
                                s++;
                                onlyImages = false;
                            } else {
                                if (tag.nodeName.toLowerCase() == "table") {
                                    var tableBody = tag.getElementsByTagName("tbody")[0];
                                    if (!tableBody) {
                                        continue;
                                    }
                                    var startNum = r + tableRowCount;
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
                                        aResult[tR] = [];
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
                                            aResult[r + tableRowCount] = [];
                                            var newP = document.createElement("p");
                                            var newSpan = document.createElement("span");
                                            $(newP).append(newSpan);
                                            newSpan.innerText = textArr[k];
                                            $(newSpan).text(textArr[k]);
                                            aResult[r + tableRowCount][c] = t._getArray(newP, isText);
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
            aResult.fontsNew = t.fontsNew;
            aResult.onlyImages = onlyImages;
            return aResult;
        },
        ReadFromBinaryWord: function (sBase64, worksheet) {
            History.TurnOff();
            var oTempDrawingDocument = worksheet.model.DrawingDocument;
            var newCDocument = new CDocument(oTempDrawingDocument);
            newCDocument.bFromDocument = true;
            newCDocument.theme = this.Api.wbModel.theme;
            oTempDrawingDocument.m_oLogicDocument = newCDocument;
            var oOldEditor = undefined;
            if ("undefined" != typeof editor) {
                oOldEditor = editor;
            }
            editor = {
                isDocumentEditor: true,
                WordControl: {
                    m_oLogicDocument: newCDocument
                }
            };
            window.global_pptx_content_loader.Clear();
            window.global_pptx_content_loader.Start_UseFullUrl();
            var openParams = {
                checkFileSize: false,
                charCount: 0,
                parCount: 0
            };
            var oBinaryFileReader = new BinaryFileReader(newCDocument, openParams);
            var oRes = oBinaryFileReader.ReadFromString(sBase64);
            History.TurnOn();
            editor = oOldEditor;
            window.global_pptx_content_loader.End_UseFullUrl();
            return oBinaryFileReader.oReadResult;
        },
        _isEqualText: function (node, table) {
            var t = this;
            if (undefined == t.copyText || node == undefined) {
                return false;
            }
            if (t.copyText.isImage) {
                return false;
            }
            if (t.copyText.text && AscBrowser.isOpera && node.text.replace(/(\r|\t|\n| |\s)/g, "") == t.copyText.text.replace(/(\r|\t|\n| |\s)/g, "")) {
                return true;
            }
            if (AscBrowser.isIE && t.copyText.text != undefined && node.text != undefined && node.text == "" && t.copyText.isImage) {
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
        _selectElement: function (callback, copyCellValue) {
            var t = this,
            selection, rangeToSelect, overflowBody, firstWidth;
            overflowBody = document.body.style.overflow;
            if (copyCellValue) {
                firstWidth = t.element.style.width;
                t.element.style.width = document.body.offsetWidth - 1 + "px";
                t.element.focus();
            } else {
                document.body.style.overflow = "hidden";
            }
            this._startCopyOrPaste();
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
                t.element.style.display = ELEMENT_DISPAY_STYLE2;
                doc.body.style.MozUserSelect = "none";
                doc.body.style["-khtml-user-select"] = "none";
                doc.body.style["-o-user-select"] = "none";
                doc.body.style["user-select"] = "none";
                doc.body.style["-webkit-user-select"] = "none";
                t._endCopyOrPaste();
                t.element.style.MozUserSelect = "none";
                if (firstWidth) {
                    t.element.style.width = firstWidth;
                }
                document.body.style.overflow = overflowBody;
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
                if (Asc.EUnderline.underlineNone !== format.u) {
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
                    if (f.c && f.c.rgb) {
                        span.style.color = number2color(f.c.rgb);
                    } else {
                        span.style.color = number2color(f.c);
                    }
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
        _makeTableNode: function (range, worksheet, isCut, isIntoShape) {
            var fn = range.worksheet.workbook.getDefaultFont();
            var fs = range.worksheet.workbook.getDefaultSize();
            var bbox = range.getBBox0();
            var merged = [];
            var t = this;
            var table, tr, td, cell, j, row, col, mbbox, h, w, b;
            var objectRender = worksheet.objectRender;
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
            if (isIntoShape) {
                var CopyProcessor = new Asc.CopyProcessor();
                var divContent = document.createElement("div");
                CopyProcessor.CopyDocument(divContent, isIntoShape, true);
                var htmlInShape = "";
                if (divContent) {
                    htmlInShape = divContent;
                }
                t.lStorageText = this._getTextFromHtml(htmlInShape);
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
                                var altAttr = null;
                                var isImage = cloneImg.graphicObject.isImage();
                                var imageUrl;
                                if (isImage) {
                                    imageUrl = cloneImg.graphicObject.getImageUrl();
                                }
                                if (isImage && imageUrl) {
                                    url = getFullImageSrc(imageUrl);
                                } else {
                                    url = cloneImg.graphicObject.getBase64Img();
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
                        t._addLocalStorage(isImage, isChart, range.worksheet.getCell3(row, col), bbox, image.from.row, image.from.col, worksheet, isCut);
                    }
                } else {
                    if (activateLocalStorage || copyPasteUseBinary) {
                        var localStText = "";
                        for (row = bbox.r1; row <= bbox.r2; ++row) {
                            if (row != bbox.r1) {
                                localStText += "\n";
                            }
                            for (col = bbox.c1; col <= bbox.c2; ++col) {
                                if (col != bbox.c1) {
                                    localStText += " ";
                                }
                                var currentRange = range.worksheet.getCell3(row, col);
                                var textRange = currentRange.getValue();
                                if (textRange == "") {
                                    localStText += "\t";
                                } else {
                                    localStText += textRange;
                                }
                                if (!copyPasteUseBinary) {
                                    t._addLocalStorage(false, false, currentRange, bbox, row, col, worksheet, isCut);
                                }
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
                            cell = range.worksheet.getCell3(row, col);
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
                                var cellMergeFinish = range.worksheet.getCell3(mbbox.r2, mbbox.c2);
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
            return table;
        },
        _getTextFromHtml: function (html) {
            var text = "";
            for (var i = 0; i < html.children.length; i++) {
                if (html.children[i].nodeName.toLowerCase() == "p" && i != 0) {
                    text += "\n";
                }
                text += html.children[i].innerText;
            }
            return text;
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
                        var arrFragmentsTmp = cell.getValue2();
                        var arrFragments = [];
                        for (var i = 0; i < arrFragmentsTmp.length; ++i) {
                            arrFragments.push(arrFragmentsTmp[i].clone());
                        }
                        t.lStorage[row][col] = {
                            value2: arrFragments,
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
                                t.lStorage.autoFilters = [];
                                for (var i = 0; i < findFilter.length; i++) {
                                    ref = findFilter[i].Ref;
                                    range = {
                                        r1: ref.r1 - activeRange.r1,
                                        c1: ref.c1 - activeRange.c1,
                                        r2: ref.r2 - activeRange.r1,
                                        c2: ref.c2 - activeRange.c1
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
        _makeCellValuesHtml: function (node, isText) {
            var t = this;
            var res = [];
            var maxSize = 100;
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
                if (sz > maxSize) {
                    sz = maxSize;
                }
                return m[2] === "px" ? (sz / t.ppix * 72).toFixed(1) - 0 : 0;
            }
            Array.prototype.forEach.call(node, function processElement(elem) {
                if (elem.nodeType === Node.TEXT_NODE || (elem.nodeName.toLowerCase() == "br" && $(node).children("br").length != 0 && elem.parentNode.nodeName.toLowerCase() == "span") || (elem.parentNode.getAttribute != undefined && elem.parentNode.getAttribute("class") != null && elem.parentNode.getAttribute("class") == "qPrefix") || (elem.getAttribute != undefined && elem.getAttribute("class") != null && elem.getAttribute("class") == "qPrefix")) {
                    if (elem.textContent.replace(/(\r|\t|\n| )/g, "") != "" || elem.textContent == " " || elem.nodeName.toLowerCase() == "br") {
                        var parent = elem.parentNode;
                        if (elem.getAttribute != undefined && elem.getAttribute("class") == "qPrefix") {
                            parent = elem;
                        }
                        var style = window.getComputedStyle(parent);
                        var fn = g_fontApplication.GetFontNameDictionary(style.fontFamily, false);
                        if (fn == "") {
                            fn = g_fontApplication.GetFontNameDictionary(parent.style.fontFamily, true);
                        }
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
                        var colorText = new RgbColor(t._getBinaryColor(style.getPropertyValue("color")));
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
                                u: td.indexOf("underline") >= 0 ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone,
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
                                        u: td.indexOf("underline") >= 0 ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone,
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
                            t.fontsNew[fn] = 1;
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
            return res;
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
        _insertImagesFromHTML: function (ws, data) {
            var activeRange = ws.activeRange;
            var curCol, drawingObject, curRow, startCol, startRow, xfrm, aImagesSync = [],
            activeRow,
            activeCol,
            tempArr,
            offX,
            offY,
            rot,
            a_drawings = [];
            for (var im = 0; im < data.addImages.length; im++) {
                var src = data.addImages[im].tag.src;
                var extX = ws.objectRender.convertPixToMM(data.addImages[im].tag.width);
                var extY = ws.objectRender.convertPixToMM(data.addImages[im].tag.height);
                var x = ws.objectRender.convertMetric(ws.cols[data.addImages[im].curCell.col].left - ws.getCellLeft(0, 1), 1, 3);
                var y = ws.objectRender.convertMetric(ws.rows[data.addImages[im].curCell.row].top - ws.getCellTop(0, 1), 1, 3);
                if (src) {
                    var drawing = DrawingObjectsController.prototype.createImage(src, x, y, extX, extY);
                    var drawingBase = ws.objectRender.createDrawingObject();
                    drawingBase.graphicObject = drawing;
                    a_drawings.push(drawingBase);
                }
            }
            History.Create_NewPoint();
            History.StartTransaction();
            for (var i = 0; i < a_drawings.length; i++) {
                a_drawings[i].graphicObject = a_drawings[i].graphicObject.copy();
                drawingObject = a_drawings[i];
                if (a_drawings.length === 1 && typeof CGraphicFrame !== "undefined" && drawingObject.graphicObject instanceof CGraphicFrame) {
                    var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, ws);
                    var newCDocument = new CDocument(oTempDrawingDocument);
                    newCDocument.bFromDocument = true;
                    newCDocument.theme = this.Api.wbModel.theme;
                    drawingObject.graphicObject.setBDeleted(true);
                    drawingObject.graphicObject.setWordFlag(false, newCDocument);
                    var oTempDrawingDocument = ws.model.DrawingDocument;
                    oTempDrawingDocument.m_oLogicDocument = newCDocument;
                    drawingObject.graphicObject.graphicObject.Set_Parent(newCDocument);
                    pasteFromBinaryWord._paste(ws, {
                        DocumentContent: [drawingObject.graphicObject.graphicObject]
                    });
                    return;
                }
                CheckSpPrXfrm(drawingObject.graphicObject);
                xfrm = drawingObject.graphicObject.spPr.xfrm;
                drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
                drawingObject.graphicObject.setDrawingBase(drawingObject);
                drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
                drawingObject.graphicObject.setWorksheet(ws.model);
                drawingObject.graphicObject.checkRemoveCache && drawingObject.graphicObject.checkRemoveCache();
                drawingObject.graphicObject.addToDrawingObjects();
                if (drawingObject.graphicObject.checkDrawingBaseCoords) {
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                }
                drawingObject.graphicObject.recalculate();
                drawingObject.graphicObject.select(ws.objectRender.controller, 0);
                tempArr = [];
                drawingObject.graphicObject.getAllRasterImages(tempArr);
                if (tempArr.length) {
                    for (var n = 0; n < tempArr.length; n++) {
                        aImagesSync.push(tempArr[n]);
                    }
                }
            }
            ws.objectRender.showDrawingObjects(true);
            ws.objectRender.controller.updateOverlay();
            ws.setSelectionShape(true);
            History.EndTransaction();
            if (aImagesSync.length > 0) {
                window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, function () {
                    ws.objectRender.showDrawingObjects(true);
                    ws.objectRender.controller.getGraphicObjectProps();
                });
            }
        },
        _insertImagesFromBinary: function (ws, data, isIntoShape) {
            var activeRange = ws.activeRange;
            var curCol, drawingObject, curRow, startCol, startRow, xfrm, aImagesSync = [],
            activeRow,
            activeCol,
            tempArr,
            offX,
            offY,
            rot;
            History.Create_NewPoint();
            History.StartTransaction();
            for (var i = 0; i < data.Drawings.length; i++) {
                drawingObject = data.Drawings[i];
                xfrm = drawingObject.graphicObject.spPr.xfrm;
                if (xfrm) {
                    offX = 0;
                    offY = 0;
                    rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                    rot = normalizeRotate(rot);
                    if (checkNormalRotate(rot)) {
                        if (isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY)) {
                            offX = xfrm.offX;
                            offY = xfrm.offY;
                        }
                    } else {
                        if (isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY) && isRealNumber(xfrm.extX) && isRealNumber(xfrm.extY)) {
                            offX = xfrm.offX + xfrm.extX / 2 - xfrm.extY / 2;
                            offY = xfrm.offY + xfrm.extY / 2 - xfrm.extX / 2;
                        }
                    }
                    if (i == 0) {
                        startCol = offX;
                        startRow = offY;
                    } else {
                        if (startCol > offX) {
                            startCol = offX;
                        }
                        if (startRow > offY) {
                            startRow = offY;
                        }
                    }
                } else {
                    if (i == 0) {
                        startCol = drawingObject.from.col;
                        startRow = drawingObject.from.row;
                    } else {
                        if (startCol > drawingObject.from.col) {
                            startCol = drawingObject.from.col;
                        }
                        if (startRow > drawingObject.from.row) {
                            startRow = drawingObject.from.row;
                        }
                    }
                }
            }
            if (startRow < 0) {
                startRow = 0;
            }
            if (startCol < 0) {
                startCol = 0;
            }
            for (var i = 0; i < data.Drawings.length; i++) {
                data.Drawings[i].graphicObject = data.Drawings[i].graphicObject.copy();
                drawingObject = data.Drawings[i];
                if (data.Drawings.length === 1 && typeof CGraphicFrame !== "undefined" && drawingObject.graphicObject instanceof CGraphicFrame) {
                    var pasteFromBinaryWord = new Asc.pasteFromBinaryWord(this, ws);
                    var newCDocument = new CDocument(oTempDrawingDocument);
                    newCDocument.bFromDocument = true;
                    newCDocument.theme = this.Api.wbModel.theme;
                    drawingObject.graphicObject.setBDeleted(true);
                    drawingObject.graphicObject.setWordFlag(false, newCDocument);
                    var oTempDrawingDocument = ws.model.DrawingDocument;
                    oTempDrawingDocument.m_oLogicDocument = newCDocument;
                    drawingObject.graphicObject.graphicObject.Set_Parent(newCDocument);
                    pasteFromBinaryWord._paste(ws, {
                        DocumentContent: [drawingObject.graphicObject.graphicObject]
                    });
                    return;
                }
                CheckSpPrXfrm(drawingObject.graphicObject);
                xfrm = drawingObject.graphicObject.spPr.xfrm;
                activeRow = activeRange.r1;
                activeCol = activeRange.c1;
                if (isIntoShape && isIntoShape.Parent && isIntoShape.Parent.parent && isIntoShape.Parent.parent.drawingBase && isIntoShape.Parent.parent.drawingBase.from) {
                    activeRow = isIntoShape.Parent.parent.drawingBase.from.row;
                    activeCol = isIntoShape.Parent.parent.drawingBase.from.col;
                }
                curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[activeCol].left - ws.getCellLeft(0, 1), 1, 3);
                curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[activeRow].top - ws.getCellTop(0, 1), 1, 3);
                xfrm.setOffX(curCol);
                xfrm.setOffY(curRow);
                drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
                drawingObject.graphicObject.setDrawingBase(drawingObject);
                drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
                drawingObject.graphicObject.setWorksheet(ws.model);
                drawingObject.graphicObject.checkRemoveCache && drawingObject.graphicObject.checkRemoveCache();
                drawingObject.graphicObject.addToDrawingObjects();
                if (drawingObject.graphicObject.checkDrawingBaseCoords) {
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                }
                drawingObject.graphicObject.recalculate();
                drawingObject.graphicObject.select(ws.objectRender.controller, 0);
                tempArr = [];
                drawingObject.graphicObject.getAllRasterImages(tempArr);
                if (tempArr.length) {
                    for (var n = 0; n < tempArr.length; n++) {
                        aImagesSync.push(tempArr[n]);
                    }
                }
            }
            ws.objectRender.showDrawingObjects(true);
            ws.objectRender.controller.updateOverlay();
            ws.setSelectionShape(true);
            History.EndTransaction();
            if (aImagesSync.length > 0) {
                window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, function () {
                    ws.objectRender.showDrawingObjects(true);
                    ws.objectRender.controller.getGraphicObjectProps();
                });
            }
        },
        _insertImagesFromBinaryWord: function (ws, data) {
            var activeRange = ws.activeRange;
            var curCol, drawingObject, curRow, startCol = 0,
            startRow = 0,
            xfrm, drawingBase, graphicObject, aImagesSync = [],
            offX,
            offY,
            rot;
            History.Create_NewPoint();
            History.StartTransaction();
            for (var i = 0; i < data.length; i++) {
                graphicObject = data[i].image.GraphicObj;
                if (graphicObject.setBDeleted2) {
                    graphicObject.setBDeleted2(true);
                } else {
                    graphicObject.bDeleted = true;
                }
                graphicObject = graphicObject.convertToPPTX(ws.model.DrawingDocument, ws.model);
                drawingObject = ws.objectRender.createDrawingObject();
                drawingObject.graphicObject = graphicObject;
                if (drawingObject.graphicObject.spPr && drawingObject.graphicObject.spPr.xfrm) {
                    xfrm = drawingObject.graphicObject.spPr.xfrm;
                    offX = 0;
                    offY = 0;
                    rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                    rot = normalizeRotate(rot);
                    if (checkNormalRotate(rot)) {
                        if (isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY)) {
                            offX = xfrm.offX;
                            offY = xfrm.offY;
                        }
                    } else {
                        if (isRealNumber(xfrm.offX) && isRealNumber(xfrm.offY) && isRealNumber(xfrm.extX) && isRealNumber(xfrm.extY)) {
                            offX = xfrm.offX + xfrm.extX / 2 - xfrm.extY / 2;
                            offY = xfrm.offY + xfrm.extY / 2 - xfrm.extX / 2;
                        }
                    }
                    if (i == 0) {
                        startCol = offX;
                        startRow = offY;
                    } else {
                        if (startCol > offX) {
                            startCol = offX;
                        }
                        if (startRow > offY) {
                            startRow = offY;
                        }
                    }
                } else {
                    if (i == 0) {
                        startCol = drawingObject.from.col;
                        startRow = drawingObject.from.row;
                    } else {
                        if (startCol > drawingObject.from.col) {
                            startCol = drawingObject.from.col;
                        }
                        if (startRow > drawingObject.from.row) {
                            startRow = drawingObject.from.row;
                        }
                    }
                }
                CheckSpPrXfrm(drawingObject.graphicObject);
                xfrm = drawingObject.graphicObject.spPr.xfrm;
                curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[data[i].col].left - ws.getCellLeft(0, 1), 1, 3);
                curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[data[i].row].top - ws.getCellTop(0, 1), 1, 3);
                xfrm.setOffX(curCol);
                xfrm.setOffY(curRow);
                drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
                drawingObject.graphicObject.setDrawingBase(drawingObject);
                drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
                drawingObject.graphicObject.setWorksheet(ws.model);
                drawingObject.graphicObject.checkRemoveCache && drawingObject.graphicObject.checkRemoveCache();
                drawingObject.graphicObject.addToDrawingObjects();
                if (drawingObject.graphicObject.checkDrawingBaseCoords) {
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                }
                drawingObject.graphicObject.recalculate();
                drawingObject.graphicObject.select(ws.objectRender.controller, 0);
                if (drawingObject.graphicObject.isImage()) {
                    aImagesSync.push(drawingObject.graphicObject.getImageUrl());
                } else {
                    if (drawingObject.graphicObject.spPr && drawingObject.graphicObject.spPr.Fill && drawingObject.graphicObject.spPr.Fill.fill && drawingObject.graphicObject.spPr.Fill.fill.RasterImageId && drawingObject.graphicObject.spPr.Fill.fill.RasterImageId != null) {
                        aImagesSync.push(drawingObject.graphicObject.spPr.Fill.fill.RasterImageId);
                    } else {
                        if (drawingObject.graphicObject.isGroup() && drawingObject.graphicObject.spTree && drawingObject.graphicObject.spTree.length) {
                            var spTree = drawingObject.graphicObject.spTree;
                            for (var j = 0; j < spTree.length; j++) {
                                if (spTree[j].isImage()) {
                                    aImagesSync.push(spTree[j].getImageUrl());
                                }
                            }
                        }
                    }
                }
            }
            window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, ws.objectRender.asyncImagesDocumentEndLoaded);
            ws.objectRender.showDrawingObjects(true);
            ws.setSelectionShape(true);
            ws.objectRender.controller.updateOverlay();
            History.EndTransaction();
        },
        _getBinaryColor: function (c) {
            var bin, m, x, type, r, g, b, a, s;
            var reColor = /^\s*(?:#?([0-9a-f]{6})|#?([0-9a-f]{3})|rgba?\s*\(\s*((?:\d*\.?\d+)(?:\s*,\s*(?:\d*\.?\d+)){2,3})\s*\))\s*$/i;
            if (typeof c === "number") {
                bin = c;
            } else {
                m = reColor.exec(c);
                if (!m) {
                    return null;
                }
                if (m[1]) {
                    x = [m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4)];
                    type = 1;
                } else {
                    if (m[2]) {
                        x = [m[2].slice(0, 1), m[2].slice(1, 2), m[2].slice(2)];
                        type = 0;
                    } else {
                        x = m[3].split(/\s*,\s*/i);
                        type = x.length === 3 ? 2 : 3;
                    }
                }
                r = parseInt(type !== 0 ? x[0] : x[0] + x[0], type < 2 ? 16 : 10);
                g = parseInt(type !== 0 ? x[1] : x[1] + x[1], type < 2 ? 16 : 10);
                b = parseInt(type !== 0 ? x[2] : x[2] + x[2], type < 2 ? 16 : 10);
                a = type === 3 ? (Math.round(parseFloat(x[3]) * 100) * 0.01) : 1;
                bin = (r << 16) | (g << 8) | b;
            }
            return bin;
        },
        _startCopyOrPaste: function () {
            if (window.USER_AGENT_MACOS) {}
        },
        _endCopyOrPaste: function () {
            if (window.USER_AGENT_MACOS) {}
        }
    };
    function pasteFromBinaryWord(clipboard, ws) {
        if (! (this instanceof pasteFromBinaryWord)) {
            return new pasteFromBinaryWord();
        }
        this.fontsNew = {};
        this.aResult = [];
        this.clipboard = clipboard;
        this.ws = ws;
        return this;
    }
    pasteFromBinaryWord.prototype = {
        _paste: function (worksheet, pasteData) {
            var documentContent = pasteData.DocumentContent;
            var activeRange = worksheet.activeRange.clone(true);
            if (documentContent && documentContent.length) {
                var documentContentBounds = new Asc.DocumentContentBounds();
                var coverDocument = documentContentBounds.getBounds(0, 0, documentContent);
                this._parseChildren(coverDocument, activeRange);
            }
            this.aResult.fontsNew = this.fontsNew;
            this.aResult.rowSpanSpCount = 0;
            this.aResult.cellCount = coverDocument.width;
            worksheet.setSelectionInfo("paste", this.aResult, this);
        },
        _parseChildren: function (children, activeRange) {
            var backgroundColor;
            var childrens = children.children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].type == c_oAscBoundsElementType.Cell) {
                    for (var row = childrens[i].top; row < childrens[i].top + childrens[i].height; row++) {
                        if (!this.aResult[row + activeRange.r1]) {
                            this.aResult[row + activeRange.r1] = [];
                        }
                        for (var col = childrens[i].left; col < childrens[i].left + childrens[i].width; col++) {
                            if (!this.aResult[row + activeRange.r1][col + activeRange.c1]) {
                                this.aResult[row + activeRange.r1][col + activeRange.c1] = [];
                            }
                            if (!this.aResult[row + activeRange.r1][col + activeRange.c1][0]) {
                                this.aResult[row + activeRange.r1][col + activeRange.c1][0] = [];
                            }
                            var isCtable = false;
                            var tempChildren = childrens[i].children[0].children;
                            var colSpan = null;
                            var rowSpan = null;
                            for (var temp = 0; temp < tempChildren.length; temp++) {
                                if (tempChildren[temp].type == c_oAscBoundsElementType.Table) {
                                    isCtable = true;
                                }
                            }
                            if (childrens[i].width > 1 && isCtable && col == childrens[i].left) {
                                colSpan = childrens[i].width;
                                rowSpan = 1;
                            } else {
                                if (!isCtable && tempChildren.length == 1) {
                                    rowSpan = childrens[i].height;
                                    colSpan = childrens[i].width;
                                }
                            }
                            this.aResult[row + activeRange.r1][col + activeRange.c1][0].rowSpan = rowSpan;
                            this.aResult[row + activeRange.r1][col + activeRange.c1][0].colSpan = colSpan;
                            backgroundColor = this.getBackgroundColorTCell(childrens[i]);
                            if (backgroundColor) {
                                this.aResult[row + activeRange.r1][col + activeRange.c1][0].bc = backgroundColor;
                            }
                            this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders = this._getBorders(childrens[i], row, col, this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders);
                        }
                    }
                }
                if (childrens[i].children.length == 0) {
                    var colSpan = null;
                    var rowSpan = null;
                    this._parseParagraph(childrens[i], activeRange, childrens[i].top + activeRange.r1, childrens[i].left + activeRange.c1);
                } else {
                    this._parseChildren(childrens[i], activeRange);
                }
            }
        },
        _getBorders: function (cellTable, top, left, oldBorders) {
            var borders = cellTable.elem.Get_Borders();
            var widthCell = cellTable.width;
            var heigthCell = cellTable.height;
            var defaultStyle = "solid";
            var borderStyleName;
            var formatBorders = oldBorders ? oldBorders : new Border();
            if (top == cellTable.top && !formatBorders.t.s) {
                borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Top.Size, 3, 1));
                if (null !== borderStyleName) {
                    formatBorders.t.setStyle(borderStyleName);
                    formatBorders.t.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Top.Color.r + "," + borders.Top.Color.g + "," + borders.Top.Color.b + ")"));
                }
            }
            if (left == cellTable.left && !formatBorders.l.s) {
                borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Left.Size, 3, 1));
                if (null !== borderStyleName) {
                    formatBorders.l.setStyle(borderStyleName);
                    formatBorders.l.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Left.Color.r + "," + borders.Left.Color.g + "," + borders.Left.Color.b + ")"));
                }
            }
            if (top == cellTable.top + heigthCell - 1 && !formatBorders.b.s) {
                borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Bottom.Size, 3, 1));
                if (null !== borderStyleName) {
                    formatBorders.b.setStyle(borderStyleName);
                    formatBorders.b.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Bottom.Color.r + "," + borders.Bottom.Color.g + "," + borders.Bottom.Color.b + ")"));
                }
            }
            if (left == cellTable.left + widthCell - 1 && !formatBorders.r.s) {
                borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Right.Size, 3, 1));
                if (null !== borderStyleName) {
                    formatBorders.r.setStyle(borderStyleName);
                    formatBorders.r.c = new RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Right.Color.r + "," + borders.Right.Color.g + "," + borders.Right.Color.b + ")"));
                }
            }
            return formatBorders;
        },
        _parseParagraph: function (paragraph, activeRange, row, col, rowSpan, colSpan) {
            var content = paragraph.elem.Content;
            var row, cTextPr, fontFamily = "Arial";
            var text = null;
            var oNewItem = [],
            cloneNewItem;
            var paraRunContent;
            var aResult = this.aResult;
            if (row === undefined) {
                if (aResult.length == 0) {
                    row = activeRange.r1;
                } else {
                    row = aResult.length;
                }
            }
            if (this.aResult[row] && this.aResult[row][col] && this.aResult[row][col][0] && this.aResult[row][col][0].length === 0 && (this.aResult[row][col][0].borders || this.aResult[row][col][0].rowSpan != null)) {
                if (this.aResult[row][col][0].borders) {
                    oNewItem.borders = this.aResult[row][col][0].borders;
                }
                if (this.aResult[row][col][0].rowSpan != null) {
                    oNewItem.rowSpan = this.aResult[row][col][0].rowSpan;
                    oNewItem.colSpan = this.aResult[row][col][0].colSpan;
                }
                delete this.aResult[row][col];
            }
            if (!aResult[row]) {
                aResult[row] = [];
            }
            var s = 0;
            var c1 = col !== undefined ? col : activeRange.c1;
            var backgroundColor = this.getBackgroundColorTCell(paragraph);
            if (backgroundColor) {
                oNewItem.bc = backgroundColor;
            }
            paragraph.elem.CompiledPr.NeedRecalc = true;
            var paraPr = paragraph.elem.Get_CompiledPr();
            var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
            var horisonalAlign = this._getAlignHorisontal(paraPr);
            if (horisonalAlign) {
                oNewItem.a = this._getAlignHorisontal(paraPr);
            } else {
                if (horisonalAlign == null) {
                    oNewItem.wrap = true;
                }
            }
            oNewItem.va = "center";
            if (this._getParentByTag(paragraph, c_oAscBoundsElementType.Cell) != null) {
                oNewItem.wrap = true;
            }
            var LvlPr = null;
            var Lvl = null;
            var oNumPr = paragraph.elem.Numbering_Get();
            var numberingText = null;
            var formatText;
            if (oNumPr != null) {
                var aNum = paragraph.elem.Parent.Numbering.Get_AbstractNum(oNumPr.NumId);
                if (null != aNum) {
                    LvlPr = aNum.Lvl[oNumPr.Lvl];
                    Lvl = oNumPr.Lvl;
                }
                numberingText = this._parseNumbering(paragraph.elem);
                if (text == null) {
                    text = "";
                }
                text += this._getAllNumberingText(Lvl, numberingText);
                formatText = this._getPrParaRun(paraPr, LvlPr.TextPr);
                fontFamily = formatText.format.fn;
                this.fontsNew[fontFamily] = 1;
                oNewItem.push(formatText);
                if (text !== null) {
                    oNewItem[oNewItem.length - 1].text = text;
                }
                text = "";
            }
            for (var n = 0; n < content.length; n++) {
                if (!aResult[row][s + c1]) {
                    aResult[row][s + c1] = [];
                }
                if (text == null) {
                    text = "";
                }
                switch (content[n].Type) {
                case para_Run:
                    s = this._parseParaRun(content[n], oNewItem, paraPr, s, row, c1, text);
                    break;
                case para_Hyperlink:
                    oNewItem.hyperLink = content[n].Value;
                    oNewItem.toolTip = content[n].ToolTip;
                    for (var h = 0; h < content[n].Content.length; h++) {
                        switch (content[n].Content[h].Type) {
                        case para_Run:
                            s = this._parseParaRun(content[n].Content[h], oNewItem, paraPr, s, row, c1, text);
                            break;
                        }
                    }
                    break;
                }
            }
        },
        _getAlignHorisontal: function (paraPr) {
            var result;
            var settings = paraPr.ParaPr;
            if (!settings) {
                return;
            }
            switch (settings.Jc) {
            case 0:
                result = "right";
                break;
            case 1:
                result = "left";
                break;
            case 2:
                result = "center";
                break;
            case 3:
                result = null;
                break;
            }
            return result;
        },
        getBackgroundColorTCell: function (elem) {
            var compiledPrCell, color;
            var backgroundColor = null;
            var tableCell = this._getParentByTag(elem, c_oAscBoundsElementType.Cell);
            if (tableCell) {
                compiledPrCell = tableCell.elem.Get_CompiledPr();
                if (compiledPrCell) {
                    var color = compiledPrCell.Shd.Color;
                    backgroundColor = new RgbColor(this.clipboard._getBinaryColor("rgb(" + color.r + "," + color.g + "," + color.b + ")"));
                }
            }
            return backgroundColor;
        },
        _getParentByTag: function (elem, tag) {
            var result;
            if (!elem) {
                return null;
            }
            if (elem.type == tag) {
                result = elem;
            } else {
                if (elem.parent) {
                    result = this._getParentByTag(elem.parent, tag);
                } else {
                    if (!elem.parent) {
                        result = null;
                    }
                }
            }
            return result;
        },
        _parseParaRun: function (paraRun, oNewItem, paraPr, s, row, c1, text) {
            var paraRunContent = paraRun.Content;
            var aResult = this.aResult;
            var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
            var cloneNewItem, formatText;
            var cTextPr = paraRun.Get_CompiledPr();
            if (cTextPr && !(paraRunContent.length == 1 && paraRunContent[0] instanceof ParaEnd)) {
                formatText = this._getPrParaRun(paraPr, cTextPr);
            } else {
                if (!formatText) {
                    formatText = this._getPrParaRun(paraPr, cTextPr);
                }
            }
            for (var pR = 0; pR < paraRunContent.length; pR++) {
                switch (paraRunContent[pR].Type) {
                case para_Text:
                    text += String.fromCharCode(paraRunContent[pR].Value);
                    break;
                case para_Space:
                    text += " ";
                    break;
                case para_Tab:
                    this.fontsNew[paragraphFontFamily] = 1;
                    oNewItem.push(formatText);
                    if (text !== null) {
                        oNewItem[oNewItem.length - 1].text = text;
                    }
                    cloneNewItem = this._getCloneNewItem(oNewItem);
                    if (typeof aResult[row][s + c1] == "object") {
                        aResult[row][s + c1][aResult[row][s + c1].length] = cloneNewItem;
                    } else {
                        aResult[row][s + c1] = [];
                        aResult[row][s + c1][0] = cloneNewItem;
                    }
                    text = "";
                    oNewItem = [];
                    s++;
                    break;
                case para_Drawing:
                    if (!aResult.addImagesFromWord) {
                        aResult.addImagesFromWord = [];
                    }
                    aResult.addImagesFromWord[aResult.addImagesFromWord.length] = {
                        image: paraRunContent[pR],
                        col: s + c1,
                        row: row
                    };
                case para_End:
                    if (typeof aResult[row][s + c1] == "object") {
                        aResult[row][s + c1][aResult[row][s + c1].length] = oNewItem;
                    } else {
                        aResult[row][s + c1] = [];
                        aResult[row][s + c1][0] = oNewItem;
                    }
                }
            }
            if (text != "") {
                this.fontsNew[paragraphFontFamily] = 1;
                oNewItem.push(formatText);
                if (text !== null) {
                    oNewItem[oNewItem.length - 1].text = text;
                }
                cloneNewItem = this._getCloneNewItem(oNewItem);
                text = "";
            }
            return s;
        },
        _getAllNumberingText: function (Lvl, numberingText) {
            var preSpace, beetweenSpace, result;
            if (Lvl == 0) {
                preSpace = "     ";
            } else {
                if (Lvl == 1) {
                    preSpace = "          ";
                } else {
                    if (Lvl >= 2) {
                        preSpace = "               ";
                    }
                }
            }
            var beetweenSpace = "  ";
            result = preSpace + numberingText + beetweenSpace;
            return result;
        },
        _parseNumbering: function (paragraph) {
            var Pr = paragraph.Get_CompiledPr();
            if (paragraph.Numbering) {
                var NumberingItem = paragraph.Numbering;
                if (para_Numbering === NumberingItem.Type) {
                    var NumPr = Pr.ParaPr.NumPr;
                    if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId) {} else {
                        var Numbering = paragraph.Parent.Get_Numbering();
                        var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                        var NumSuff = NumLvl.Suff;
                        var NumJc = NumLvl.Jc;
                        var NumTextPr = paragraph.Get_CompiledPr2(false).TextPr.Copy();
                        var TextPr_temp = paragraph.TextPr.Value.Copy();
                        TextPr_temp.Underline = undefined;
                        NumTextPr.Merge(TextPr_temp);
                        NumTextPr.Merge(NumLvl.TextPr);
                        var oNumPr = paragraph.Numbering_Get();
                        var LvlPr, Lvl;
                        if (oNumPr != null) {
                            var aNum = paragraph.Parent.Numbering.Get_AbstractNum(oNumPr.NumId);
                            if (null != aNum) {
                                LvlPr = aNum.Lvl[oNumPr.Lvl];
                                Lvl = oNumPr.Lvl;
                            }
                        }
                        var NumInfo = paragraph.Parent.Internal_GetNumInfo(paragraph.Id, NumPr);
                        return this._getNumberingText(NumPr.Lvl, NumInfo, NumTextPr, null, LvlPr);
                    }
                }
            }
        },
        _getNumberingText: function (Lvl, NumInfo, NumTextPr, Theme, LvlPr) {
            var Text = LvlPr.LvlText;
            var Char = "";
            for (var Index = 0; Index < Text.length; Index++) {
                switch (Text[Index].Type) {
                case numbering_lvltext_Text:
                    var Hint = NumTextPr.RFonts.Hint;
                    var bCS = NumTextPr.CS;
                    var bRTL = NumTextPr.RTL;
                    var lcid = NumTextPr.Lang.EastAsia;
                    var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);
                    Char += Text[Index].Value;
                    break;
                case numbering_lvltext_Num:
                    var CurLvl = Text[Index].Value;
                    switch (LvlPr.Format) {
                    case numbering_numfmt_Bullet:
                        break;
                    case numbering_numfmt_Decimal:
                        if (CurLvl < NumInfo.length) {
                            var T = "" + (LvlPr.Start - 1 + NumInfo[CurLvl]);
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                Char += T.charAt(Index2);
                            }
                        }
                        break;
                    case numbering_numfmt_DecimalZero:
                        if (CurLvl < NumInfo.length) {
                            var T = "" + (LvlPr.Start - 1 + NumInfo[CurLvl]);
                            if (1 === T.length) {
                                var Char = T.charAt(0);
                            } else {
                                for (var Index2 = 0; Index2 < T.length; Index2++) {
                                    Char += T.charAt(Index2);
                                }
                            }
                        }
                        break;
                    case numbering_numfmt_LowerLetter:
                        case numbering_numfmt_UpperLetter:
                        if (CurLvl < NumInfo.length) {
                            var Num = LvlPr.Start - 1 + NumInfo[CurLvl] - 1;
                            var Count = (Num - Num % 26) / 26;
                            var Ost = Num % 26;
                            var T = "";
                            var Letter;
                            if (numbering_numfmt_LowerLetter === LvlPr.Format) {
                                Letter = String.fromCharCode(Ost + 97);
                            } else {
                                Letter = String.fromCharCode(Ost + 65);
                            }
                            for (var Index2 = 0; Index2 < Count + 1; Index2++) {
                                T += Letter;
                            }
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                Char += T.charAt(Index2);
                            }
                        }
                        break;
                    case numbering_numfmt_LowerRoman:
                        case numbering_numfmt_UpperRoman:
                        if (CurLvl < NumInfo.length) {
                            var Num = LvlPr.Start - 1 + NumInfo[CurLvl];
                            var Rims;
                            if (numbering_numfmt_LowerRoman === LvlPr.Format) {
                                Rims = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i", " "];
                            } else {
                                Rims = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I", " "];
                            }
                            var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];
                            var T = "";
                            var Index2 = 0;
                            while (Num > 0) {
                                while (Vals[Index2] <= Num) {
                                    T += Rims[Index2];
                                    Num -= Vals[Index2];
                                }
                                Index2++;
                                if (Index2 >= Rims.length) {
                                    break;
                                }
                            }
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                Char += T.charAt(Index2);
                            }
                        }
                        break;
                    }
                    break;
                }
            }
            return Char;
        },
        _getPrParaRun: function (paraPr, cTextPr) {
            var formatText, fontFamily, colorText;
            var paragraphFontSize = paraPr.TextPr.FontSize;
            var paragraphFontFamily = paraPr.TextPr && paraPr.TextPr.FontFamily ? paraPr.TextPr.FontFamily.Name : "Arial";
            var paragraphBold = paraPr.TextPr.Bold;
            var paragraphItalic = paraPr.TextPr.Italic;
            var paragraphStrikeout = paraPr.TextPr.Strikeout;
            var paragraphUnderline = paraPr.TextPr.Underline ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
            var paragraphVertAlign = "none";
            if (paraPr.TextPr.VertAlign == 1) {
                paragraphVertAlign = "superscript";
            } else {
                if (paraPr.TextPr.VertAlign == 2) {
                    paragraphVertAlign = "subscript";
                }
            }
            var colorParagraph = new RgbColor(this.clipboard._getBinaryColor("rgb(" + paraPr.TextPr.Color.r + "," + paraPr.TextPr.Color.g + "," + paraPr.TextPr.Color.b + ")"));
            if (cTextPr.Color) {
                colorText = new RgbColor(this.clipboard._getBinaryColor("rgb(" + cTextPr.Color.r + "," + cTextPr.Color.g + "," + cTextPr.Color.b + ")"));
            } else {
                colorText = null;
            }
            fontFamily = cTextPr.fontFamily ? cTextPr.fontFamily.Name : cTextPr.RFonts.CS ? cTextPr.RFonts.CS.Name : paragraphFontFamily;
            this.fontsNew[fontFamily] = 1;
            var verticalAlign;
            if (cTextPr.VertAlign == 2) {
                verticalAlign = "subscript";
            } else {
                if (cTextPr.VertAlign == 1) {
                    verticalAlign = "superscript";
                }
            }
            formatText = {
                format: {
                    fn: fontFamily,
                    fs: cTextPr.FontSize ? cTextPr.FontSize : paragraphFontSize,
                    c: colorText ? colorText : colorParagraph,
                    b: cTextPr.Bold ? cTextPr.Bold : paragraphBold,
                    i: cTextPr.Italic ? cTextPr.Italic : paragraphItalic,
                    u: cTextPr.Underline ? Asc.EUnderline.underlineSingle : paragraphUnderline,
                    s: cTextPr.Strikeout ? cTextPr.Strikeout : cTextPr.DStrikeout ? cTextPr.DStrikeout : paragraphStrikeout,
                    va: verticalAlign ? verticalAlign : paragraphVertAlign
                }
            };
            return formatText;
        },
        _getCloneNewItem: function (oNewItem) {
            var result = [];
            for (var item = 0; item < oNewItem.length; item++) {
                result[item] = {
                    text: oNewItem[item].text,
                    format: oNewItem[item].format
                };
            }
            result.borders = oNewItem.borders;
            result.rowSpan = oNewItem.rowSpan;
            result.colSpan = oNewItem.colSpan;
            result.toolTip = result.toolTip;
            result.bc = oNewItem.bc;
            result.hyperLink = oNewItem.hyperLink;
            return result;
        }
    };
    var c_oAscBoundsElementType = {
        Content: 0,
        Paragraph: 1,
        Table: 2,
        Row: 3,
        Cell: 4
    };
    function DocumentContentBoundsElement(elem, type, parent) {
        this.elem = elem;
        this.type = type;
        this.parent = parent;
        this.children = [];
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
    }
    function DocumentContentBounds() {}
    DocumentContentBounds.prototype = {
        getBounds: function (nLeft, nTop, aDocumentContent) {
            var oRes = this._getMeasure(aDocumentContent, null);
            this._getOffset(nLeft, nTop, oRes);
            return oRes;
        },
        _getOffset: function (nLeft, nTop, elem) {
            elem.left += nLeft;
            elem.top += nTop;
            var nCurLeft = elem.left;
            var nCurTop = elem.top;
            var bIsRow = elem.elem instanceof CTableRow;
            for (var i = 0, length = elem.children.length; i < length; i++) {
                var child = elem.children[i];
                this._getOffset(nCurLeft, nCurTop, child);
                if (bIsRow) {
                    nCurLeft += child.width;
                } else {
                    nCurTop += child.height;
                }
            }
        },
        _getMeasure: function (aDocumentContent, oParent) {
            var oRes = new DocumentContentBoundsElement(aDocumentContent, c_oAscBoundsElementType.Content, oParent);
            for (var i = 0, length = aDocumentContent.length; i < length; i++) {
                var elem = aDocumentContent[i];
                var oNewElem = null;
                if (type_Paragraph == elem.GetType()) {
                    oNewElem = new DocumentContentBoundsElement(elem, c_oAscBoundsElementType.Paragraph, oRes);
                    oNewElem.width = 1;
                    oNewElem.height = 1;
                } else {
                    if (type_Table == elem.GetType()) {
                        elem.ReIndexing(0);
                        oNewElem = this._getTableMeasure(elem, oRes);
                    }
                }
                if (null != oNewElem) {
                    oRes.children.push(oNewElem);
                    if (oNewElem.width && oNewElem.width > oRes.width) {
                        oRes.width = oNewElem.width;
                    }
                    oRes.height += oNewElem.height;
                }
            }
            return oRes;
        },
        _getTableMeasure: function (table, oParent) {
            var oRes = new DocumentContentBoundsElement(table, c_oAscBoundsElementType.Table, oParent);
            var aGridWidth = [];
            for (var i = 0, length = table.TableGrid.length; i < length; i++) {
                aGridWidth.push(1);
            }
            for (var i = 0, length = table.Content.length; i < length; i++) {
                var row = table.Content[i];
                var oNewElem = this._setRowGridWidth(row, oRes, aGridWidth);
                if (null != oNewElem) {
                    oRes.children.push(oNewElem);
                }
            }
            var aSumGridWidth = [];
            var nTempSum = 0;
            for (var i = 0, length = aGridWidth.length; i < length + 1; i++) {
                aSumGridWidth[i] = nTempSum;
                var nCurValue = aGridWidth[i];
                if (nCurValue) {
                    nTempSum += nCurValue;
                }
            }
            for (var i = 0, length = oRes.children.length; i < length; i++) {
                var rowWrapped = oRes.children[i];
                this._getRowMeasure(rowWrapped, aSumGridWidth);
                oRes.height += rowWrapped.height;
                if (rowWrapped.width + rowWrapped.left > oRes.width) {
                    oRes.width = rowWrapped.width + rowWrapped.left;
                }
            }
            return oRes;
        },
        _setRowGridWidth: function (row, oParent, aGridWidth) {
            var oRes = new DocumentContentBoundsElement(row, c_oAscBoundsElementType.Row, oParent);
            var nSumGrid = 0;
            var BeforeInfo = row.Get_Before();
            if (BeforeInfo && BeforeInfo.GridBefore) {
                nSumGrid += BeforeInfo.GridBefore;
            }
            for (var i = 0, length = row.Content.length; i < length; i++) {
                var cell = row.Content[i];
                var oNewCell = new DocumentContentBoundsElement(cell, c_oAscBoundsElementType.Cell, oRes);
                oRes.children.push(oNewCell);
                var oNewElem = this._getMeasure(cell.Content.Content, oNewCell);
                oNewCell.children.push(oNewElem);
                oNewCell.width = oNewElem.width;
                oNewCell.height = oNewElem.height;
                if (oNewCell.height > oRes.height) {
                    oRes.height = oNewCell.height;
                }
                var nCellGrid = cell.Get_GridSpan();
                if (oNewElem.width > nCellGrid) {
                    var nFirstGridWidth = oNewElem.width - nCellGrid + 1;
                    var nCurValue = aGridWidth[nSumGrid];
                    if (null != nCurValue && nCurValue < nFirstGridWidth) {
                        aGridWidth[nSumGrid] = nFirstGridWidth;
                    }
                }
                nSumGrid += nCellGrid;
            }
            return oRes;
        },
        _getRowMeasure: function (rowWrapped, aSumGridWidth) {
            var nSumGrid = 0;
            var BeforeInfo = rowWrapped.elem.Get_Before();
            if (BeforeInfo && BeforeInfo.GridBefore) {
                rowWrapped.left = aSumGridWidth[nSumGrid + BeforeInfo.GridBefore] - aSumGridWidth[nSumGrid];
                nSumGrid += BeforeInfo.GridBefore;
            }
            for (var i = 0, length = rowWrapped.children.length; i < length; i++) {
                var cellWrapped = rowWrapped.children[i];
                var nCellGrid = cellWrapped.elem.Get_GridSpan();
                cellWrapped.width = aSumGridWidth[nSumGrid + nCellGrid] - aSumGridWidth[nSumGrid];
                cellWrapped.height = rowWrapped.height;
                rowWrapped.width += cellWrapped.width;
                nSumGrid += nCellGrid;
            }
        }
    };
    function CopyProcessor(api, ElemToSelect) {
        this.Ul = document.createElement("ul");
        this.Ol = document.createElement("ol");
        this.Para;
        this.bOccurEndPar;
        this.oCurHyperlink = null;
        this.oCurHyperlinkElem = null;
        this.oPresentationWriter = new CBinaryFileWriter();
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
            var apPr = [];
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
                aProp.push("font-size:" + Value.FontSize + "pt");
            }
            if (true == Value.Bold) {
                aTagStart.push("<b>");
                aTagEnd.push("</b>");
            }
            if (true == Value.Italic) {
                aTagStart.push("<i>");
                aTagEnd.push("</i>");
            }
            if (true == Value.Strikeout) {
                aTagStart.push("<strike>");
                aTagEnd.push("</strike>");
            }
            if (true == Value.Underline) {
                aTagStart.push("<u>");
                aTagEnd.push("</u>");
            }
            if (null != Value.HighLight && highlight_None != Value.HighLight) {
                aProp.push("background-color:" + this.RGBToCSS(Value.HighLight));
            }
            var color;
            if (null != Value.Unifill) {
                var Unifill = Value.Unifill.getRGBAColor();
                if (Unifill) {
                    color = this.RGBToCSS(new CDocumentColor(Unifill.R, Unifill.G, Unifill.B));
                    aProp.push("color:" + color);
                    aProp.push("mso-style-textfill-fill-color:" + color);
                }
            } else {
                if (null != Value.Color) {
                    color = this.RGBToCSS(Value.Color);
                    aProp.push("color:" + color);
                    aProp.push("mso-style-textfill-fill-color:" + color);
                }
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
                var sValue = String.fromCharCode(ParaItem.Value);
                if (sValue) {
                    sRes += CopyPasteCorrectString(sValue);
                }
                break;
            case para_Space:
                sRes += " ";
                break;
            case para_Tab:
                sRes += "<span style='mso-tab-count:1'>    </span>";
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
                    sRes += '<img style="max-width:100%;" width="' + Math.round(ParaItem.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(ParaItem.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
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
        CopyRunContent: function (Container, bUseSelection) {
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
            for (var i = ParaStart; i <= ParaEnd; i++) {
                var item = Container.Content[i];
                if (para_Run == item.Type) {
                    var sRunContent = this.CopyRun(item, bUseSelection);
                    if (sRunContent) {
                        sRes += "<span";
                        var oStyle = this.parse_para_TextPr(item.CompiledPr);
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
                        sRes += this.CopyRunContent(item);
                        sRes += "</a>";
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
            oNumPr = Item.Numbering_Get();
            bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
            if (bIsNullNumPr) {
                this.CommitList(oDomTarget);
            } else {
                var bBullet = false;
                var sListStyle = "";
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
                var Li = document.createElement("li");
                Li.setAttribute("style", "list-style-type: " + sListStyle);
                Li.appendChild(this.Para);
                if (bBullet) {
                    this.Ul.appendChild(Li);
                } else {
                    this.Ol.appendChild(Li);
                }
            }
            this.Para.innerHTML = this.CopyRunContent(Item, bUseSelection);
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
                if (type_Paragraph === Item.GetType()) {
                    this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
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
                            var sInnerHtml = this.ParseItem(oData);
                            var oImg = oData;
                            var sSrc = oImg.Img;
                            if (sSrc.length > 0) {
                                sSrc = this.getSrc(sSrc);
                                if (this.api.DocumentReaderMode) {
                                    sInnerHtml += '<img style="max-width:100%;" width="' + Math.round(oImg.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oImg.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
                                } else {
                                    sInnerHtml += '<img width="' + Math.round(oImg.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oImg.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />';
                                }
                            }
                            this.Para.innerHTML = sInnerHtml;
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
                        var content = oDocument.DrawingObjects.getTargetDocContent();
                        if (content) {
                            oDocument = content;
                        } else {
                            if (oDocument.DrawingObjects.selection.groupSelection && oDocument.DrawingObjects.selection.groupSelection.selectedObjects && oDocument.DrawingObjects.selection.groupSelection.selectedObjects.length) {
                                var s_arr = oDocument.DrawingObjects.selection.groupSelection.selectedObjects;
                                this.Para = document.createElement("p");
                                if (copyPasteUseBinary) {
                                    var newArr = null;
                                    var tempAr = null;
                                    if (s_arr) {
                                        tempAr = [];
                                        for (var k = 0; k < s_arr.length; k++) {
                                            tempAr[k] = s_arr[k].y;
                                        }
                                    }
                                    tempAr.sort(fSortAscending);
                                    newArr = [];
                                    for (var k = 0; k < tempAr.length; k++) {
                                        var absOffsetY = tempAr[k];
                                        for (var i = 0; i < s_arr.length; i++) {
                                            if (absOffsetY == s_arr[i].y) {
                                                newArr[k] = s_arr[i];
                                            }
                                        }
                                    }
                                    if (newArr != null) {
                                        s_arr = newArr;
                                    }
                                }
                                for (var i = 0; i < s_arr.length; ++i) {
                                    var paraDrawing = s_arr[i].parent ? s_arr[i].parent : s_arr[i].group.parent;
                                    var graphicObj = s_arr[i];
                                    if (isRealObject(paraDrawing.Parent)) {
                                        var base64_img = paraDrawing.getBase64Img();
                                        if (copyPasteUseBinary) {
                                            var wrappingType = oDocument.DrawingObjects.selection.groupSelection.parent.wrappingType;
                                            var DrawingType = oDocument.DrawingObjects.selection.groupSelection.parent.DrawingType;
                                            var tempParagraph = new Paragraph(oDocument, oDocument, 0, 0, 0, 0, 0);
                                            var index = 0;
                                            tempParagraph.Content.unshift(new ParaRun());
                                            var paraRun = tempParagraph.Content[index];
                                            paraRun.Content.unshift(new ParaDrawing());
                                            paraRun.Content[index].wrappingType = wrappingType;
                                            paraRun.Content[index].DrawingType = DrawingType;
                                            paraRun.Content[index].GraphicObj = graphicObj;
                                            paraRun.Selection.EndPos = index + 1;
                                            paraRun.Selection.StartPos = index;
                                            paraRun.Selection.Use = true;
                                            tempParagraph.Selection.EndPos = index + 1;
                                            tempParagraph.Selection.StartPos = index;
                                            tempParagraph.Selection.Use = true;
                                            tempParagraph.bFromDocument = true;
                                            this.oBinaryFileWriter.CopyParagraph(tempParagraph);
                                        }
                                        var src = this.getSrc(base64_img);
                                        this.Para.innerHTML += '<img style="max-width:100%;" width="' + Math.round(paraDrawing.absExtX * g_dKoef_mm_to_pix) + '" height="' + Math.round(paraDrawing.absExtY * g_dKoef_mm_to_pix) + '" src="' + src + '" />';
                                        this.ElemToSelect.appendChild(this.Para);
                                    }
                                }
                                if (copyPasteUseBinary) {
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
                            } else {
                                var gr_objects = oDocument.DrawingObjects;
                                var selection_array = gr_objects.selectedObjects;
                                this.Para = document.createElement("span");
                                var selectionTrue;
                                var selectIndex;
                                for (var i = 0; i < selection_array.length; ++i) {
                                    var cur_element = selection_array[i].parent;
                                    var base64_img = cur_element.getBase64Img();
                                    var src = this.getSrc(base64_img);
                                    this.Para.innerHTML = '<img style="max-width:100%;" width="' + Math.round(cur_element.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(cur_element.H * g_dKoef_mm_to_pix) + '" src="' + src + '" />';
                                    this.ElemToSelect.appendChild(this.Para);
                                    if (copyPasteUseBinary) {
                                        var paragraph = cur_element.Parent;
                                        var inIndex;
                                        var paragraphIndex;
                                        var content;
                                        var curParaRun;
                                        for (var k = 0; k < paragraph.Content.length; k++) {
                                            content = paragraph.Content[k].Content;
                                            for (var n = 0; n < content.length; n++) {
                                                if (content[n] == cur_element) {
                                                    curParaRun = paragraph.Content[k];
                                                    inIndex = n;
                                                    paragraphIndex = k;
                                                    break;
                                                }
                                            }
                                        }
                                        selectionTrue = {
                                            EndPos: curParaRun.Selection.EndPos,
                                            StartPos: curParaRun.Selection.StartPos,
                                            EndPosParagraph: paragraph.Selection.EndPos,
                                            StartPosParagraph: paragraph.Selection.StartPos
                                        };
                                        curParaRun.Selection.EndPos = inIndex + 1;
                                        curParaRun.Selection.StartPos = inIndex;
                                        curParaRun.Selection.Use = true;
                                        paragraph.Selection.EndPos = paragraphIndex;
                                        paragraph.Selection.StartPos = paragraphIndex;
                                        paragraph.Selection.Use = true;
                                        this.oBinaryFileWriter.CopyParagraph(paragraph);
                                        curParaRun.Selection.StartPos = selectionTrue.StartPos;
                                        curParaRun.Selection.EndPos = selectionTrue.EndPos;
                                        paragraph.Selection.StartPos = selectionTrue.StartPosParagraph;
                                        paragraph.Selection.EndPos = selectionTrue.EndPosParagraph;
                                    }
                                }
                                if (copyPasteUseBinary) {
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
                    }
                    if (true === oDocument.Selection.Use) {
                        this.CopyDocument(this.ElemToSelect, oDocument, true);
                    }
                } else {
                    this.CopyDocument(this.ElemToSelect, oDocument, false);
                }
            }
            this.oBinaryFileWriter.CopyEnd();
            if (copyPasteUseBinary && this.oBinaryFileWriter.copyParams.itemCount > 0) {
                var sBase64 = this.oBinaryFileWriter.GetResult();
                if (this.ElemToSelect.children && this.ElemToSelect.children.length == 1 && window.USER_AGENT_SAFARI_MACOS) {
                    $(this.ElemToSelect.children[0]).css("font-weight", "normal");
                    $(this.ElemToSelect.children[0]).wrap(document.createElement("b"));
                }
                if (this.ElemToSelect.children[0]) {
                    $(this.ElemToSelect.children[0]).addClass("docData;" + sBase64);
                }
            }
        }
    };
    window["Asc"].CopyProcessor = CopyProcessor;
    window["Asc"].Clipboard = Clipboard;
    window["Asc"].pasteFromBinaryWord = pasteFromBinaryWord;
    window["Asc"].DocumentContentBounds = DocumentContentBounds;
})(jQuery, window);
window.USER_AGENT_MACOS = AscBrowser.isMacOs;
window.USER_AGENT_SAFARI_MACOS = AscBrowser.isSafariMacOs;
window.USER_AGENT_IE = AscBrowser.isIE || AscBrowser.isOpera;
window.USER_AGENT_WEBKIT = AscBrowser.isWebkit;
window.GlobalPasteFlag = false;
window.GlobalPasteFlagCounter = 0;
var COPY_ELEMENT_ID2 = "clipboard-helper";
var PASTE_ELEMENT_ID2 = "wrd_pastebin";
var ELEMENT_DISPAY_STYLE2 = "none";
var COPYPASTE_ELEMENT_CLASS = "sdk-element";
var kElementTextId = "clipboard-helper-text";
var isNeedEmptyAfterCut = false;
var PASTE_EMPTY_COUNTER_MAX = 10;
var PASTE_EMPTY_COUNTER = 0;
var PASTE_EMPTY_USE = AscBrowser.isMozilla;
function CopyPasteCorrectString(str) {
    var res = str;
    res = res.replace(/&/g, "&amp;");
    res = res.replace(/</g, "&lt;");
    res = res.replace(/>/g, "&gt;");
    res = res.replace(/'/g, "&apos;");
    res = res.replace(/"/g, "&quot;");
    return res;
}
if (window.USER_AGENT_SAFARI_MACOS) {
    var PASTE_ELEMENT_ID2 = "clipboard-helper";
    var ELEMENT_DISPAY_STYLE2 = "block";
}
function SafariIntervalFocus2() {
    var api = window["Asc"]["editor"];
    if (api) {
        if ((api.wb && api.wb.cellEditor && api.wb.cellEditor != null && api.wb.cellEditor.isTopLineActive) || (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isSelectionDialogMode)) {
            return;
        }
        var pastebin = document.getElementById(COPY_ELEMENT_ID2);
        var pastebinText = document.getElementById(kElementTextId);
        if (pastebinText && (api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode) && api.IsFocus) {
            pastebinText.focus();
        } else {
            if (pastebin && api.IsFocus) {
                pastebin.focus();
            } else {
                if (!pastebin || !pastebinText) {
                    Editor_CopyPaste_Create2(api);
                }
            }
        }
    }
}
function Editor_Copy_Event_Excel(e, ElemToSelect, isCut) {
    var api = window["Asc"]["editor"];
    var wb = api.wb;
    var ws = wb.getWorksheet();
    var sBase64 = wb.clipboard.copyRange(ws.getSelectedRange(), ws, isCut, true);
    if (isCut) {
        ws.emptySelection(c_oAscCleanOptions.All);
    }
    if (sBase64) {
        e.clipboardData.setData("text/x-custom", sBase64);
    }
    e.clipboardData.setData("text/html", ElemToSelect.innerHTML);
    e.clipboardData.setData("text/plain", ElemToSelect.innerText);
}
function Editor_CopyPaste_Create2(api) {
    var ElemToSelect = document.createElement("div");
    ElemToSelect.id = COPY_ELEMENT_ID2;
    ElemToSelect.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
    ElemToSelect.style.left = "0px";
    ElemToSelect.style.top = "100px";
    if (window.USER_AGENT_MACOS) {
        ElemToSelect.style.width = "1000px";
    } else {
        ElemToSelect.style.width = "10000px";
    }
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
    ElemToSelect.oncopy = function (e) {
        var api = window["Asc"]["editor"];
        if (api.controller.isCellEditMode) {
            return;
        }
        Editor_Copy_Event_Excel(e, ElemToSelect);
        e.preventDefault();
    };
    ElemToSelect.oncut = function (e) {
        var api = window["Asc"]["editor"];
        if (api.controller.isCellEditMode) {
            return;
        }
        Editor_Copy_Event_Excel(e, ElemToSelect, true);
        e.preventDefault();
    };
    ElemToSelect.onpaste = function (e) {
        var api = window["Asc"]["editor"];
        var wb = api.wb;
        var ws = wb.getWorksheet();
        wb.clipboard._bodyPaste(ws, e);
        e.preventDefault();
    };
    ElemToSelect["onbeforecut"] = function (e) {
        var api = window["Asc"]["editor"];
        if (api.controller.isCellEditMode) {
            return;
        }
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        ElemToSelect.innerText = "&nbsp";
        rangeToSelect.selectNodeContents(ElemToSelect);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    };
    ElemToSelect["onbeforecopy"] = function (e) {
        var api = window["Asc"]["editor"];
        if (api.controller.isCellEditMode) {
            return;
        }
        var selection = window.getSelection();
        var rangeToSelect = document.createRange();
        ElemToSelect.innerText = "&nbsp";
        rangeToSelect.selectNodeContents(ElemToSelect);
        selection.removeAllRanges();
        selection.addRange(rangeToSelect);
    };
    document.body.appendChild(ElemToSelect);
    var elementText = document.createElement("textarea");
    elementText.id = kElementTextId;
    elementText.style.position = "absolute";
    if (window.USER_AGENT_MACOS) {
        ElemToSelect.style.width = "100px";
    } else {
        ElemToSelect.style.width = "10000px";
    }
    elementText.style.height = "100px";
    elementText.style.left = "0px";
    elementText.style.top = "100px";
    elementText.style.overflow = "hidden";
    elementText.style.zIndex = -1000;
    elementText.style.display = ELEMENT_DISPAY_STYLE2;
    elementText.setAttribute("contentEditable", true);
    elementText.setAttribute("class", COPYPASTE_ELEMENT_CLASS);
    elementText["onbeforecopy"] = function (e) {
        if ((api.wb && api.wb.getWorksheet() && api.wb.getWorksheet().isCellEditMode)) {
            var v = api.wb.cellEditor.copySelection();
            if (v) {
                api.wb.clipboard.copyCellValue(v);
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
                    api.wb.clipboard.copyCellValue(v);
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
function Common_CmpObj2(Obj1, Obj2) {
    if (!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2)) {
        return false;
    }
    var p, v1, v2;
    for (p in Obj2) {
        if (!Obj1.hasOwnProperty(p)) {
            return false;
        }
    }
    for (p in Obj1) {
        if (Obj2.hasOwnProperty(p)) {
            v1 = Obj1[p];
            v2 = Obj2[p];
            if (v1 && v2 && "object" === typeof(v1) && "object" === typeof(v2)) {
                if (false == Common_CmpObj2(v1, v2)) {
                    return false;
                }
            } else {
                if (v1 != v2) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    return true;
}