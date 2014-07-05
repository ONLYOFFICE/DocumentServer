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
    var asc = window["Asc"];
    var asc_calcnpt = asc.calcNearestPt;
    var asc_getcvt = asc.getCvtRatio;
    var asc_round = asc.round;
    var asc_search = asc.search;
    var asc_clone = asc.clone;
    var asc_lastidx = asc.lastIndexOf;
    var asc_HL = asc.HandlersList;
    var asc_DC = asc.DrawingContext;
    var asc_TR = asc.CellTextRender;
    var asc_FP = asc.FontProperties;
    var asc_parsecolor = asc.parseColor;
    var asc_incDecFonSize = asc.incDecFonSize;
    var kLeftAlign = "left";
    var kRightAlign = "right";
    var kCenterAlign = "center";
    var namespace = "ASC_CellEditor";
    var kBeginOfLine = -1;
    var kBeginOfText = -2;
    var kEndOfLine = -3;
    var kEndOfText = -4;
    var kNextChar = -5;
    var kNextWord = -6;
    var kNextLine = -7;
    var kPrevChar = -8;
    var kPrevWord = -9;
    var kPrevLine = -10;
    var kPosition = -11;
    var kPositionLength = -12;
    var kNewLine = "\n";
    function CellEditor(elem, input, fmgrGraphics, handlers, settings) {
        if (! (this instanceof CellEditor)) {
            return new CellEditor(elem, input, fmgrGraphics, handlers, settings);
        }
        this.element = elem;
        this.input = input;
        this.handlers = new asc_HL(handlers);
        this.settings = $.extend(true, {},
        this.defaults, settings);
        this.canvasOuter = undefined;
        this.canvas = undefined;
        this.canvasOverlay = undefined;
        this.cursor = undefined;
        this.graphicObjectCursor = undefined;
        this.cursorTID = undefined;
        this.cursorPos = 0;
        this.topLineIndex = 0;
        this.fmgrGraphics = fmgrGraphics;
        this.drawingCtx = undefined;
        this.overlayCtx = undefined;
        this.textRender = undefined;
        this.textFlags = undefined;
        this.kx = 1;
        this.ky = 1;
        this.skipKeyPress = undefined;
        this.undoList = [];
        this.redoList = [];
        this.undoMode = false;
        this.undoAllMode = false;
        this.selectionBegin = -1;
        this.selectionEnd = -1;
        this.isSelectMode = false;
        this.hasCursor = false;
        this.hasFocus = false;
        this.newTextFormat = undefined;
        this.newTextFormatAdditional = undefined;
        this.selectionTimer = undefined;
        this.enableKeyEvents = true;
        this.isTopLineActive = false;
        this.skipTLUpdate = true;
        this.isOpened = false;
        this.callTopLineMouseup = false;
        this.lastKeyCode = undefined;
        this.m_nEditorState = null;
        this.isUpdateValue = true;
        this.init();
        return this;
    }
    CellEditor.prototype = {
        constructor: CellEditor,
        defaults: {
            background: "#fff",
            font: new asc_FP("Calibri", 11),
            padding: 2,
            selectColor: "rgba(190,190,255,.5)",
            textAlign: kLeftAlign,
            textColor: "#000",
            canvasZindex: "1000",
            blinkInterval: 500,
            cursorShape: "text",
            selectionTimeout: 20
        },
        reReplaceNL: /\r?\n|\r/g,
        reReplaceTab : /[\t\v\f]/g,
        reRangeStr: "[^a-z0-9_$!:](\\$?[a-z]+\\$?\\d+:\\$?[a-z]+\\$?\\d+(?=[^a-z0-9_]|$)|\\$?[a-z]+:\\$?[a-z]+(?=[^a-z0-9_]|$)|\\$?\\d+:\\$?\\d+(?=[^a-z0-9_]|$)|\\$?[a-z]+\\$?\\d+(?=[^a-z0-9_]|$))",
        rangeChars: "= - + * / ( { , < > ^ ! & : ;".split(" "),
        reNotFormula: /[^a-z0-9_]/i,
        reFormula: /^([a-z_][a-z0-9_]*)/i,
        init: function () {
            var t = this;
            var z = parseInt(t.settings.canvasZindex);
            t.canvasOuter = t.element.find("#ce-canvas-outer");
            if (t.canvasOuter.length < 1) {
                t.canvasOuter = $('<div id="ce-canvas-outer"/>').css("display", "none").css("z-index", z).appendTo(t.element);
                t.canvas = $('<canvas id="ce-canvas"/>').css("z-index", z + 1).appendTo(t.canvasOuter);
                t.canvasOverlay = $('<canvas id="ce-canvas-overlay"/>').css("z-index", z + 2).css("cursor", t.settings.cursorShape).appendTo(t.canvasOuter);
                t.cursor = $('<div id="ce-cursor"/>').css("display", "none").css("z-index", z + 3).appendTo(t.canvasOuter);
            }
            t.drawingCtx = asc_DC({
                canvas: t.canvas[0],
                units: 1,
                fmgrGraphics: this.fmgrGraphics
            });
            t.overlayCtx = asc_DC({
                canvas: t.canvasOverlay[0],
                units: 1,
                fmgrGraphics: this.fmgrGraphics
            });
            t.textRender = asc_TR(t.drawingCtx);
            t.textRender.setDefaultFont(t.settings.font.clone());
            t.canvasOverlay.off("." + namespace).on("mousedown." + namespace, function () {
                return t._onMouseDown.apply(t, arguments);
            }).on("mouseup." + namespace, function () {
                return t._onMouseUp.apply(t, arguments);
            }).on("mousemove." + namespace, function () {
                return t._onMouseMove.apply(t, arguments);
            }).on("mouseleave." + namespace, function () {
                return t._onMouseLeave.apply(t, arguments);
            }).on("dblclick." + namespace, function () {
                return t._onMouseDblClick.apply(t, arguments);
            });
            t.input.off("." + namespace).on("focus." + namespace, function () {
                return t.isOpened ? t._topLineGotFocus.apply(t, arguments) : true;
            }).on("mousedown." + namespace, function () {
                return t.isOpened ? (t.callTopLineMouseup = true, true) : true;
            }).on("mouseup." + namespace, function () {
                return t.isOpened ? t._topLineMouseUp.apply(t, arguments) : true;
            }).on("input." + namespace, function () {
                return t._onInputTextArea.apply(t, arguments);
            });
            if (t.input[0]) {
                if (document.addEventListener) {
                    t.input[0].addEventListener("drop", function (e) {
                        e.preventDefault();
                        return false;
                    },
                    false);
                } else {
                    t.input[0].attachEvent("ondrop", function (e) {
                        e.preventDefault();
                        return false;
                    });
                }
            }
        },
        destroy: function () {
            $(window).off("." + namespace);
            this.input.off("." + namespace);
        },
        open: function (options) {
            var t = this;
            t.isOpened = true;
            $(window).on("keydown." + namespace, function () {
                return t._onWindowKeyDown.apply(t, arguments);
            }).on("keypress." + namespace, function () {
                return t._onWindowKeyPress.apply(t, arguments);
            }).on("keyup." + namespace, function () {
                return t._onWindowKeyUp.apply(t, arguments);
            }).on("mouseup." + namespace, function () {
                return t._onWindowMouseUp.apply(t, arguments);
            }).on("mousemove." + namespace, function () {
                return t._onWindowMouseMove.apply(t, arguments);
            });
            t._setOptions(options);
            t.isTopLineActive = t.input.hasClass("focused");
            t._draw();
            if (! (options.cursorPos >= 0)) {
                if (options.isClearCell) {
                    t._selectChars(kEndOfText);
                } else {
                    t._moveCursor(kEndOfText);
                }
            }
            t.setFocus(t.isTopLineActive ? true : (undefined !== options.focus) ? options.focus : t._haveTextInEdit() ? true : false);
            t._updateFormulaEditMod(true);
            t._updateUndoRedoChanged();
        },
        close: function (saveValue) {
            var t = this,
            opt = t.options,
            ret = false;
            if (saveValue && $.isFunction(opt.saveValueCallback)) {
                ret = t._wrapFragments(opt.fragments);
                ret = opt.saveValueCallback(opt.fragments, t.textFlags, ret);
                if (!ret) {
                    return false;
                }
            }
            t.isOpened = false;
            $(window).off("." + namespace);
            t.input.blur();
            t.isTopLineActive = false;
            t.input.removeClass("focused");
            t._hideCursor();
            t.canvasOuter.hide();
            t.handlers.trigger("closed");
            return true;
        },
        setTextStyle: function (prop, val) {
            var t = this,
            opt = t.options,
            begin, end, i, first, last;
            if (t.selectionBegin !== t.selectionEnd) {
                begin = Math.min(t.selectionBegin, t.selectionEnd);
                end = Math.max(t.selectionBegin, t.selectionEnd);
                if (end - begin < 2) {
                    t.undoList.push({
                        fn: t._addChars,
                        args: [t.textRender.getChars(begin, 1), begin]
                    });
                } else {
                    t.undoList.push({
                        fn: t._addFragments,
                        args: [t._getFragments(begin, end - begin), begin]
                    });
                }
                t._extractFragments(begin, end - begin);
                first = t._findFragment(begin);
                last = t._findFragment(end - 1);
                if (first && last) {
                    for (i = first.index; i <= last.index; ++i) {
                        var elem = opt.fragments[i];
                        var valTmp = t._setFormatProperty(elem.format, prop, val, elem);
                        if (null === val) {
                            val = valTmp;
                        }
                    }
                    t._mergeFragments();
                    t._update();
                    t._cleanSelection();
                    t._drawSelection();
                    t.undoList.push({
                        fn: t._removeChars,
                        args: [begin, end - begin]
                    });
                    t.redoList = [];
                }
            } else {
                first = t._findFragmentToInsertInto(t.cursorPos);
                if (first) {
                    if (!t.newTextFormat) {
                        var elem = opt.fragments[first.index];
                        t.newTextFormat = t._cloneFormat(elem.format);
                        t.newTextFormatAdditional = {
                            theme: elem.theme,
                            tint: elem.tint
                        };
                    }
                    t._setFormatProperty(t.newTextFormat, prop, val, t.newTextFormatAdditional);
                }
            }
        },
        empty: function (options) {
            if (c_oAscCleanOptions.All !== options) {
                return;
            }
            this._removeChars();
        },
        undo: function () {
            this._performAction(this.undoList, this.redoList);
        },
        undoAll: function () {
            this.undoAllMode = true;
            while (this.undoList.length > 0) {
                this.undo();
            }
            this.undoAllMode = false;
            this._update();
        },
        redo: function () {
            this._performAction(this.redoList, this.undoList);
        },
        getZoom: function () {
            return this.drawingCtx.getZoom();
        },
        changeZoom: function (factor) {
            this.drawingCtx.changeZoom(factor);
            this.overlayCtx.changeZoom(factor);
        },
        canEnterCellRange: function () {
            var isRange = this._findRangeUnderCursor().range !== null;
            var prevChar = this.textRender.getChars(this.cursorPos - 1, 1);
            return isRange || this.rangeChars.indexOf(prevChar) >= 0;
        },
        activateCellRange: function () {
            var res = this._findRangeUnderCursor();
            res.range ? this.handlers.trigger("existedRange", res.range) : this.handlers.trigger("newRange");
        },
        enterCellRange: function (rangeStr) {
            var t = this;
            var res = t._findRangeUnderCursor();
            if (res.range) {
                t._moveCursor(kPosition, res.index);
                t._selectChars(kPosition, res.index + res.length);
            }
            var lastAction = t.undoList.length > 0 ? t.undoList[t.undoList.length - 1] : null;
            while (lastAction && lastAction.isRange) {
                t.undoList.pop();
                lastAction = t.undoList.length > 0 ? t.undoList[t.undoList.length - 1] : null;
            }
            t._addChars(rangeStr, undefined, true);
        },
        changeCellRange: function (range, rangeStr) {
            var t = this;
            t._moveCursor(kPosition, range.cursorePos);
            t._selectChars(kPositionLength, range.formulaRangeLength);
            t._addChars(rangeStr, undefined, true);
            t._moveCursor(kEndOfText);
        },
        move: function (dx, dy) {
            var t = this;
            var opt = t.options;
            t.left += dx;
            t.right += dx;
            t.top += dy;
            t.bottom += dy;
            opt.leftSide.forEach(function (e, i, a) {
                a[i] = e + dx;
            });
            opt.rightSide.forEach(function (e, i, a) {
                a[i] = e + dx;
            });
            opt.bottomSide.forEach(function (e, i, a) {
                a[i] = e + dy;
            });
            t._adjustCanvas();
            t._renderText();
            t._drawSelection();
        },
        setFocus: function (hasFocus) {
            this.hasFocus = !!hasFocus;
            this.handlers.trigger("gotFocus", this.hasFocus);
        },
        restoreFocus: function () {
            if (this.isTopLineActive) {
                this.input.focus();
            }
        },
        copySelection: function () {
            var t = this;
            var res = null;
            if (t.selectionBegin !== t.selectionEnd) {
                var start = t.selectionBegin;
                var end = t.selectionEnd;
                if (start > end) {
                    var temp = start;
                    start = end;
                    end = temp;
                }
                res = t._getFragments(start, end - start);
            }
            return res;
        },
        cutSelection: function () {
            var t = this;
            var f = null;
            if (t.selectionBegin !== t.selectionEnd) {
                var start = t.selectionBegin;
                var end = t.selectionEnd;
                if (start > end) {
                    var temp = start;
                    start = end;
                    end = temp;
                }
                f = t._getFragments(start, end - start);
                t._removeChars();
            }
            return f;
        },
        pasteText: function (text) {
            var t = this;
            text = text.replace(/\t/g, " ");
            text = text.replace(/\r/g, "");
            text = text.replace(/^\n+|\n+$/g, "");
            var wrap = text.indexOf("\n") >= 0;
            if (! (text.length > 0)) {
                return;
            }
            if (t.selectionBegin !== t.selectionEnd) {
                t._removeChars();
            } else {
                t.undoList.push({
                    fn: "fake",
                    args: []
                });
            }
            t.undoList.push({
                fn: t._removeChars,
                args: [t.cursorPos, text.length]
            });
            t.redoList = [];
            var opt = t.options;
            var nInsertPos = t.cursorPos;
            var fr;
            fr = t._findFragmentToInsertInto(nInsertPos - (nInsertPos > 0 ? 1 : 0));
            if (fr) {
                var oCurFragment = opt.fragments[fr.index];
                if (fr.end <= nInsertPos) {
                    oCurFragment.text += text;
                } else {
                    var sNewText = oCurFragment.text.substring(0, nInsertPos);
                    sNewText += text;
                    sNewText += oCurFragment.text.substring(nInsertPos);
                    oCurFragment.text = sNewText;
                }
                t.cursorPos = nInsertPos + text.length;
                t._update();
            }
            if (wrap) {
                t._wrapText();
                t._update();
            }
        },
        paste: function (fragments, cursorPos) {
            var t = this;
            var wrap = fragments.some(function (val) {
                return val.text.indexOf("\n") >= 0;
            });
            t._cleanFragments(fragments);
            if (! (fragments.length > 0)) {
                return;
            }
            if (t.selectionBegin !== t.selectionEnd) {
                t._removeChars();
            }
            t.undoList.push({
                fn: t._removeChars,
                args: [t.cursorPos, t._getFragmentsLength(fragments)]
            });
            t.redoList = [];
            t._addFragments(fragments, t.cursorPos);
            if (wrap) {
                t._wrapText();
                t._update();
            }
            if (undefined !== cursorPos) {
                t._moveCursor(kPosition, cursorPos);
            }
        },
        enableKeyEventsHandler: function (flag) {
            this.enableKeyEvents = !!flag;
        },
        isFormula: function () {
            var fragments = this.options.fragments;
            return fragments.length > 0 && fragments[0].text.length > 0 && fragments[0].text.charAt(0) === "=";
        },
        insertFormula: function (functionName) {
            if (false === this.isFormula()) {
                var fragments = this.options.fragments;
                if (1 === fragments.length && 0 === fragments[0].text.length) {
                    functionName = "=" + functionName + "()";
                } else {
                    return false;
                }
            } else {
                functionName = functionName + "()";
            }
            this.skipTLUpdate = false;
            this._addChars(functionName);
            this._moveCursor(kPosition, this.cursorPos - 1);
        },
        replaceText: function (pos, len, newText) {
            this._moveCursor(kPosition, pos);
            this._selectChars(kPosition, pos + len);
            this._addChars(newText);
        },
        setFontRenderingMode: function () {
            if (this.isOpened) {
                this._draw();
            }
        },
        _setOptions: function (options) {
            function cmpNum(a, b) {
                return a - b;
            }
            function cmpNumRev(a, b) {
                return b - a;
            }
            var t = this;
            var opt = t.options = $.extend(true, {},
            t.settings, options);
            var ctx = t.drawingCtx;
            var u = ctx.getUnits();
            t.textFlags = $.extend(true, {},
            opt.flags);
            if (t.textFlags.textAlign.toLowerCase() === "justify" || this.isFormula()) {
                t.textFlags.textAlign = "left";
            }
            if (t.textFlags.wrapText) {
                t.textFlags.wrapOnlyNL = true;
                t.textFlags.wrapText = false;
            }
            t._cleanFragments(opt.fragments);
            t.textRender.setString(opt.fragments, t.textFlags);
            delete t.newTextFormat;
            delete t.newTextFormatAdditional;
            if (opt.zoom > 0) {
                t.overlayCtx.setFont(t.drawingCtx.getFont());
                t.changeZoom(opt.zoom);
            }
            t.kx = asc_getcvt(u, 0, ctx.getPPIX());
            t.ky = asc_getcvt(u, 0, ctx.getPPIY());
            $.unique(opt.leftSide);
            $.unique(opt.rightSide);
            $.unique(opt.bottomSide);
            opt.leftSide.sort(cmpNumRev);
            opt.rightSide.sort(cmpNum);
            opt.bottomSide.sort(cmpNum);
            t.left = opt.cellX;
            t.top = opt.cellY;
            t.right = opt.rightSide[0];
            t.bottom = opt.bottomSide[0];
            t.cursorPos = opt.cursorPos !== undefined ? opt.cursorPos : 0;
            t.topLineIndex = 0;
            t.selectionBegin = -1;
            t.selectionEnd = -1;
            t.isSelectMode = false;
            t.hasCursor = false;
            t.undoList = [];
            t.redoList = [];
            t.undoMode = false;
            t.skipKeyPress = false;
        },
        _parseRangeStr: function (s) {
            var p, range, ca1, ca2;
            p = s.replace(/\$/g, "").split(":");
            if (p.length > 1) {
                ca1 = new CellAddress(p[0]);
                ca2 = new CellAddress(p[1]);
                if (!ca1 || !ca1.isValid() || !ca2 || !ca2.isValid()) {
                    return null;
                }
                range = asc.Range(ca1.getCol0(), ca1.getRow0(), ca2.getCol0(), ca2.getRow0());
                if (range.r2 === gc_nMaxRow0) {
                    range.r1 = 0;
                    range.type = c_oAscSelectionType.RangeCol;
                } else {
                    if (range.c2 === gc_nMaxCol0) {
                        range.c1 = 0;
                        range.type = c_oAscSelectionType.RangeRow;
                    } else {
                        range.type = c_oAscSelectionType.RangeCells;
                    }
                }
            } else {
                ca1 = new CellAddress(p[0]);
                if (!ca1 || !ca1.isValid()) {
                    return null;
                }
                range = asc.Range(ca1.getCol0(), ca1.getRow0(), ca1.getCol0(), ca1.getRow0());
                range.type = c_oAscSelectionType.RangeCells;
            }
            range.startCol = range.c1;
            range.startRow = range.r1;
            return range;
        },
        _parseFormulaRanges: function () {
            var s = this._getFragmentsText(this.options.fragments);
            var reIdx = 0;
            var re = [new RegExp(this.reRangeStr, "gi")];
            var ret = false;
            var m, range, i;
            if (s.length < 1 || s.charAt(0) !== "=") {
                return ret;
            }
            while (null !== (m = re[reIdx].exec(s))) {
                range = this._parseRangeStr(m[1]);
                if (range) {
                    ret = true;
                    if (m[1].indexOf("$") > -1) {
                        range.isAbsolute = m[1];
                    }
                    range.cursorePos = m.input.indexOf(m[0]) + 1;
                    range.formulaRangeLength = m[1].length;
                    this.handlers.trigger("newRange", range);
                } else {
                    i = m[1].indexOf(":");
                    if (i >= 0) {
                        s = "(" + s.slice(m.index + 1 + i + 1);
                        reIdx = re.length;
                        re.push(new RegExp(this.reRangeStr, "gi"));
                    }
                }
            }
            return ret;
        },
        _findRangeUnderCursor: function () {
            var t = this;
            var s = t.textRender.getChars(0, t.textRender.getCharsCount());
            var re = new RegExp("^" + this.reRangeStr, "i");
            var reW = /[^a-z0-9_$]/i;
            var beg = t.cursorPos - 1;
            var colon = -1;
            var ch, res, range;
            for (; beg >= 0; --beg) {
                ch = s.charAt(beg);
                if (!reW.test(ch)) {
                    continue;
                }
                res = s.slice(beg).match(re);
                if (ch === ":" && colon < 0) {
                    if (!res || res[1].indexOf(":") < 0) {
                        colon = beg;
                        continue;
                    }
                }
                if (res && t.cursorPos > beg + res.index && t.cursorPos <= beg + res.index + res[0].length) {
                    range = t._parseRangeStr(res[1]);
                    if (!range) {
                        beg = colon;
                        res = s.slice(beg).match(re);
                        if (res && t.cursorPos > beg + res.index && t.cursorPos <= beg + res.index + res[0].length) {
                            range = t._parseRangeStr(res[1]);
                        }
                    }
                }
                break;
            }
            return !range ? {
                index: -1,
                length: 0,
                range: null
            } : {
                index: beg + res.index + 1,
                length: res[1].length,
                range: range
            };
        },
        _updateFormulaEditMod: function (bIsOpen) {
            var isFormula = this.isFormula();
            if (!bIsOpen) {
                this._updateEditorState(isFormula);
            }
            this.handlers.trigger("updateFormulaEditMod", isFormula);
            var ret1 = this._parseFormulaRanges();
            var ret2 = this.canEnterCellRange();
            this.handlers.trigger("updateFormulaEditModEnd", ret1 || ret2);
        },
        _updateUndoRedoChanged: function () {
            this.handlers.trigger("updateUndoRedoChanged", 0 < this.undoList.length, 0 < this.redoList.length);
        },
        _haveTextInEdit: function () {
            var fragments = this.options.fragments;
            return fragments.length > 0 && fragments[0].text.length > 0;
        },
        _updateEditorState: function (isFormula) {
            if (undefined === isFormula) {
                isFormula = this.isFormula();
            }
            var editorState = isFormula ? c_oAscCellEditorState.editFormula : "" === this._getFragmentsText(this.options.fragments) ? c_oAscCellEditorState.editEmptyCell : c_oAscCellEditorState.editText;
            if (this.m_nEditorState !== editorState) {
                this.m_nEditorState = editorState;
                this.handlers.trigger("updateEditorState", this.m_nEditorState);
            }
        },
        _draw: function () {
            var t = this,
            opt = t.options,
            canExpW = true,
            canExpH = true,
            tm, expW, expH;
            if (opt.fragments.length > 0) {
                tm = t.textRender.measureString(opt.fragments, t.textFlags, t._getContentWidth());
                expW = tm.width > t._getContentWidth();
                expH = tm.height > t._getContentHeight();
                while (expW && canExpW || expH && canExpH) {
                    if (expW) {
                        canExpW = t._expandWidth();
                    }
                    if (expH) {
                        canExpH = t._expandHeight();
                    }
                    if (!canExpW) {
                        t.textFlags.wrapText = true;
                        tm = t.textRender.measureString(opt.fragments, t.textFlags, t._getContentWidth());
                    } else {
                        tm = t.textRender.measure(t._getContentWidth());
                    }
                    expW = tm.width > t._getContentWidth();
                    expH = tm.height > t._getContentHeight();
                }
            }
            t._cleanText();
            t._cleanSelection();
            t._adjustCanvas();
            t._renderText();
            t.input.val(t._getFragmentsText(opt.fragments));
            t._updateCursorPosition();
            t._showCursor();
        },
        _update: function () {
            var t = this,
            opt = t.options,
            tm, canExpW, canExpH, oldLC, doAjust = false;
            if (opt.fragments.length > 0) {
                oldLC = t.textRender.getLinesCount();
                tm = t.textRender.measureString(opt.fragments, t.textFlags, t._getContentWidth());
                if (t.textRender.getLinesCount() < oldLC) {
                    t.topLineIndex -= oldLC - t.textRender.getLinesCount();
                }
                canExpW = !t.textFlags.wrapText;
                while (tm.width > t._getContentWidth() && canExpW) {
                    canExpW = t._expandWidth();
                    if (!canExpW) {
                        t.textFlags.wrapText = true;
                        tm = t.textRender.measureString(opt.fragments, t.textFlags, t._getContentWidth());
                    }
                    doAjust = true;
                }
                canExpH = true;
                while (tm.height > t._getContentHeight() && canExpH) {
                    canExpH = t._expandHeight();
                    doAjust = true;
                }
                if (t.textRender.isLastCharNL() && !doAjust && canExpH) {
                    var lm = t.textRender.calcCharHeight(t.textRender.getCharsCount() - 1);
                    if (tm.height + lm.th > t._getContentHeight()) {
                        t._expandHeight();
                        doAjust = true;
                    }
                }
            }
            if (doAjust) {
                t._adjustCanvas();
            }
            t._renderText();
            t._fireUpdated();
            t._updateCursorPosition(true);
            t._showCursor();
            t._updateFormulaEditMod(false);
            t._updateUndoRedoChanged();
        },
        _fireUpdated: function () {
            var t = this;
            var s = t._getFragmentsText(t.options.fragments);
            var isFormula = s.charAt(0) === "=";
            var funcPos, funcName, match;
            if (!t.isTopLineActive || !t.skipTLUpdate || t.undoMode) {
                t.input.val(s);
            }
            if (isFormula) {
                funcPos = asc_lastidx(s, t.reNotFormula, t.cursorPos) + 1;
                if (funcPos > 0) {
                    match = s.slice(funcPos).match(t.reFormula);
                }
                if (match) {
                    funcName = match[1];
                } else {
                    funcPos = undefined;
                    funcName = undefined;
                }
            }
            t.handlers.trigger("updated", s, t.cursorPos, isFormula, funcPos, funcName);
        },
        _expandWidth: function () {
            var t = this,
            opt = t.options,
            l = false,
            r = false;
            function expandLeftSide() {
                var i = asc_search(opt.leftSide, function (v) {
                    return v < t.left;
                });
                if (i >= 0) {
                    t.left = opt.leftSide[i];
                    return true;
                }
                var val = opt.leftSide[opt.leftSide.length - 1];
                if (Math.abs(t.left - val) > 1e-06) {
                    t.left = val;
                }
                return false;
            }
            function expandRightSide() {
                var i = asc_search(opt.rightSide, function (v) {
                    return v > t.right;
                });
                if (i >= 0) {
                    t.right = opt.rightSide[i];
                    return true;
                }
                var val = opt.rightSide[opt.rightSide.length - 1];
                if (Math.abs(t.right - val) > 1e-06) {
                    t.right = val;
                }
                return false;
            }
            switch (t.textFlags.textAlign) {
            case kRightAlign:
                r = expandLeftSide();
                break;
            case kCenterAlign:
                l = expandLeftSide();
                r = expandRightSide();
                break;
            case kLeftAlign:
                default:
                r = expandRightSide();
            }
            return l || r;
        },
        _expandHeight: function () {
            var t = this,
            opt = t.options,
            i = asc_search(opt.bottomSide, function (v) {
                return v > t.bottom;
            });
            if (i >= 0) {
                t.bottom = opt.bottomSide[i];
                return true;
            }
            var val = opt.bottomSide[opt.bottomSide.length - 1];
            if (Math.abs(t.bottom - val) > 1e-06) {
                t.bottom = val;
            }
            return false;
        },
        _cleanText: function () {
            this.drawingCtx.clear();
        },
        _adjustCanvas: function () {
            var t = this;
            var z = parseInt(t.settings.canvasZindex);
            $(t.canvasOuter).css("display", "none").css("left", (t.left * t.kx) + "px").css("top", (t.top * t.ky) + "px").css("width", ((t.right - t.left) * t.kx - 1) + "px").css("height", ((t.bottom - t.top) * t.ky - 1) + "px").css("z-index", t.top <= 0 ? -1 : z);
            $(t.canvas).add(t.canvasOverlay).attr("width", (t.right - t.left) * t.kx - 1).attr("height", (t.bottom - t.top) * t.ky - 1);
            t.canvasOuter.show();
        },
        _renderText: function (dy) {
            var t = this,
            opt = t.options,
            ctx = t.drawingCtx;
            ctx.setFillStyle(opt.background).fillRect(0, 0, ctx.getWidth(), ctx.getHeight());
            if (opt.fragments.length > 0) {
                t.textRender.render(t._getContentLeft(), -ctx._1px_y + (dy === undefined ? 0 : dy), t._getContentWidth(), opt.textColor);
            }
        },
        _cleanSelection: function () {
            this.overlayCtx.clear();
        },
        _drawSelection: function () {
            var t = this,
            opt = t.options,
            ctx = t.overlayCtx,
            ppix = ctx.getPPIX(),
            ppiy = ctx.getPPIY();
            var begPos, endPos, top, top1, top2, begInfo, endInfo, line1, line2, i;
            function drawRect(x, y, w, h) {
                ctx.fillRect(asc_calcnpt(x, ppix), asc_calcnpt(y, ppiy), asc_calcnpt(w, ppix), asc_calcnpt(h, ppiy));
            }
            begPos = t.selectionBegin;
            endPos = t.selectionEnd;
            ctx.setFillStyle(opt.selectColor).clear();
            if (begPos !== endPos && !t.isTopLineActive) {
                top = t.textRender.calcLineOffset(t.topLineIndex);
                begInfo = t.textRender.calcCharOffset(Math.min(begPos, endPos));
                line1 = t.textRender.getLineInfo(begInfo.lineIndex);
                top1 = t.textRender.calcLineOffset(begInfo.lineIndex);
                endInfo = t.textRender.calcCharOffset(Math.max(begPos, endPos));
                if (begInfo.lineIndex === endInfo.lineIndex) {
                    drawRect(begInfo.left, top1 - top, endInfo.left - begInfo.left, line1.th);
                } else {
                    line2 = t.textRender.getLineInfo(endInfo.lineIndex);
                    top2 = t.textRender.calcLineOffset(endInfo.lineIndex);
                    drawRect(begInfo.left, top1 - top, line1.tw - begInfo.left + line1.startX, line1.th);
                    if (line2) {
                        drawRect(line2.startX, top2 - top, endInfo.left - line2.startX, line2.th);
                    }
                    top = top1 - top + line1.th;
                    for (i = begInfo.lineIndex + 1; i < endInfo.lineIndex; ++i, top += line1.th) {
                        line1 = t.textRender.getLineInfo(i);
                        drawRect(line1.startX, top, line1.tw, line1.th);
                    }
                }
            }
        },
        showCursor: function () {
            if (!this.options) {
                this.options = {};
            }
            this.options.isHideCursor = false;
            this._showCursor();
        },
        _showCursor: function () {
            var t = this;
            if (true === t.options.isHideCursor || t.isTopLineActive === true) {
                return;
            }
            window.clearInterval(t.cursorTID);
            t.cursor.show();
            t.cursorTID = window.setInterval(function () {
                t.cursor.toggle();
            },
            t.settings.blinkInterval);
        },
        _hideCursor: function () {
            var t = this;
            window.clearInterval(t.cursorTID);
            t.cursor.hide();
        },
        _updateCursorPosition: function (redrawText) {
            var t = this;
            var h = t.canvas.innerHeight();
            var y = -t.textRender.calcLineOffset(t.topLineIndex);
            var cur = t.textRender.calcCharOffset(t.cursorPos);
            var charsCount = t.textRender.getCharsCount();
            var curLeft = asc_round(((kRightAlign !== t.textFlags.textAlign || t.cursorPos !== charsCount) && cur !== null && cur.left !== null ? cur.left : t._getContentPosition()) * t.kx);
            var curTop = asc_round(((cur !== null ? cur.top : 0) + y) * t.ky);
            var curHeight = asc_round((cur !== null ? cur.height : t.options.font.FontSize) * 1.275 * t.ky);
            var i, dy;
            while (t.textRender.getLinesCount() > 1) {
                if (curTop + curHeight - 1 > h) {
                    i = i === undefined ? 0 : i + 1;
                    dy = t.textRender.getLineInfo(i).th;
                    y -= dy;
                    curTop -= asc_round(dy * t.ky);
                    ++t.topLineIndex;
                    continue;
                }
                if (curTop < 0) {
                    --t.topLineIndex;
                    dy = t.textRender.getLineInfo(t.topLineIndex).th;
                    y += dy;
                    curTop += asc_round(dy * t.ky);
                    continue;
                }
                break;
            }
            if (dy !== undefined || redrawText) {
                t._renderText(y);
            }
            t.cursor.css("left", curLeft + "px").css("top", curTop + "px").css("height", curHeight + "px");
            if (cur) {
                t.input.scrollTop(t.input.height() * cur.lineIndex);
            }
            if (t.isTopLineActive && !t.skipTLUpdate) {
                t._updateTopLineCurPos();
            }
        },
        _moveCursor: function (kind, pos) {
            var t = this;
            switch (kind) {
            case kPrevChar:
                t.cursorPos = t.textRender.getPrevChar(t.cursorPos);
                break;
            case kNextChar:
                t.cursorPos = t.textRender.getNextChar(t.cursorPos);
                break;
            case kPrevWord:
                t.cursorPos = t.textRender.getPrevWord(t.cursorPos);
                break;
            case kNextWord:
                t.cursorPos = t.textRender.getNextWord(t.cursorPos);
                break;
            case kBeginOfLine:
                t.cursorPos = t.textRender.getBeginOfLine(t.cursorPos);
                break;
            case kEndOfLine:
                t.cursorPos = t.textRender.getEndOfLine(t.cursorPos);
                break;
            case kBeginOfText:
                t.cursorPos = t.textRender.getBeginOfText(t.cursorPos);
                break;
            case kEndOfText:
                t.cursorPos = t.textRender.getEndOfText(t.cursorPos);
                break;
            case kPrevLine:
                t.cursorPos = t.textRender.getPrevLine(t.cursorPos);
                break;
            case kNextLine:
                t.cursorPos = t.textRender.getNextLine(t.cursorPos);
                break;
            case kPosition:
                t.cursorPos = pos;
                break;
            case kPositionLength:
                t.cursorPos += pos;
                break;
            default:
                return;
            }
            if (t.selectionBegin !== t.selectionEnd) {
                t.selectionBegin = t.selectionEnd = -1;
                t._cleanSelection();
            }
            t._updateCursorPosition();
            t._showCursor();
        },
        _findCursorPosition: function (coord) {
            var t = this;
            var lc = t.textRender.getLinesCount();
            var i, h, w, li, chw;
            for (h = 0, i = Math.max(t.topLineIndex, 0); i < lc; ++i) {
                li = t.textRender.getLineInfo(i);
                h += li.th;
                if (coord.y <= h) {
                    for (w = li.startX, i = li.beg; i <= li.end; ++i) {
                        chw = t.textRender.getCharWidth(i);
                        if (coord.x <= w + chw) {
                            return coord.x <= w + chw / 2 ? i : i + 1 > li.end ? kEndOfLine : i + 1;
                        }
                        w += chw;
                    }
                    return i < t.textRender.getCharsCount() ? i - 1 : kEndOfText;
                }
            }
            return kNextLine;
        },
        _updateTopLineCurPos: function () {
            var t = this;
            var isSelected = t.selectionBegin !== t.selectionEnd;
            var b = isSelected ? t.selectionBegin : t.cursorPos;
            var e = isSelected ? t.selectionEnd : t.cursorPos;
            if (t.input[0].setSelectionRange) {
                t.input[0].setSelectionRange(Math.min(b, e), Math.max(b, e));
            }
        },
        _topLineGotFocus: function () {
            var t = this;
            t.isTopLineActive = true;
            t.input.addClass("focused");
            t.setFocus(true);
            t._hideCursor();
            t._updateTopLineCurPos();
            t._cleanSelection();
        },
        _topLineMouseUp: function () {
            var t = this;
            this.callTopLineMouseup = false;
            setTimeout(function () {
                var b = t.input[0].selectionStart;
                var e = t.input[0].selectionEnd;
                if (typeof b !== "undefined") {
                    if (t.cursorPos !== b) {
                        t._moveCursor(kPosition, b);
                    }
                    if (b !== e) {
                        t._selectChars(kPosition, e);
                    }
                }
            });
        },
        _syncEditors: function () {
            var t = this;
            var s1 = t._getFragmentsText(t.options.fragments);
            var s2 = t.input.val();
            var l = Math.min(s1.length, s2.length);
            var i1 = 0,
            i2 = 0;
            while (i1 < l && s1.charAt(i1) === s2.charAt(i1)) {
                ++i1;
            }
            i2 = i1 + 1;
            if (i2 >= l) {
                i2 = Math.max(s1.length, s2.length);
            } else {
                while (i2 < l && s1.charAt(i1) !== s2.charAt(i2)) {
                    ++i2;
                }
            }
            t._addChars(s2.slice(i1, i2), i1);
        },
        _getContentLeft: function () {
            var t = this,
            opt = t.options;
            return asc_calcnpt(0, t.drawingCtx.getPPIX(), opt.padding);
        },
        _getContentWidth: function () {
            var t = this,
            opt = t.options;
            return t.right - t.left - asc_calcnpt(0, t.drawingCtx.getPPIX(), opt.padding + opt.padding + 1);
        },
        _getContentHeight: function () {
            var t = this;
            return t.bottom - t.top;
        },
        _getContentPosition: function () {
            var t = this,
            opt = t.options,
            ppix = t.drawingCtx.getPPIX();
            switch (t.textFlags.textAlign) {
            case kRightAlign:
                return asc_calcnpt(t.right - t.left, ppix, -opt.padding - 1);
            case kCenterAlign:
                return asc_calcnpt(0.5 * (t.right - t.left), ppix, 0);
            }
            return asc_calcnpt(0, ppix, opt.padding);
        },
        _wrapFragments: function (frag) {
            var i, s, ret = false;
            for (i = 0; i < frag.length; ++i) {
                s = frag[i].text;
                if (s.indexOf("\u00B6") >= 0) {
                    s = s.replace(/\u00B6/g, "\n");
                    ret = true;
                }
                frag[i].text = s;
            }
            return ret;
        },
        _wrapText: function () {
            var t = this;
            t.textFlags.wrapOnlyNL = true;
            t._wrapFragments(t.options.fragments);
        },
        _addChars: function (str, pos, isRange) {
            var t = this,
            opt = t.options,
            f, l, s;
            if (t.selectionBegin !== t.selectionEnd) {
                t._removeChars(undefined, undefined, isRange);
            }
            if (pos === undefined) {
                pos = t.cursorPos;
            }
            if (!t.undoMode) {
                t.undoList.push({
                    fn: t._removeChars,
                    args: [pos, str.length],
                    isRange: isRange
                });
                t.redoList = [];
            }
            if (t.newTextFormat) {
                var oNewObj = {
                    format: t.newTextFormat,
                    text: str,
                    theme: null,
                    tint: null
                };
                if (null != t.newTextFormatAdditional) {
                    oNewObj.theme = t.newTextFormatAdditional.theme;
                    oNewObj.tint = t.newTextFormatAdditional.tint;
                }
                t._addFragments([oNewObj], pos);
                delete t.newTextFormat;
                delete t.newTextFormatAdditional;
            } else {
                f = t._findFragmentToInsertInto(pos);
                if (f) {
                    l = pos - f.begin;
                    s = opt.fragments[f.index].text;
                    opt.fragments[f.index].text = s.slice(0, l) + str + s.slice(l);
                }
            }
            t.cursorPos = pos + str.length;
            if (!t.undoAllMode) {
                t._update();
            }
        },
        _addNewLine: function () {
            this._wrapText();
            this._addChars(kNewLine);
        },
        _removeChars: function (pos, length, isRange) {
            var t = this,
            opt = t.options,
            b, e, l, first, last;
            if (t.selectionBegin !== t.selectionEnd) {
                b = Math.min(t.selectionBegin, t.selectionEnd);
                e = Math.max(t.selectionBegin, t.selectionEnd);
                t.selectionBegin = t.selectionEnd = -1;
                t._cleanSelection();
            } else {
                if (length === undefined) {
                    switch (pos) {
                    case kPrevChar:
                        b = t.textRender.getPrevChar(t.cursorPos);
                        e = t.cursorPos;
                        break;
                    case kNextChar:
                        b = t.cursorPos;
                        e = t.textRender.getNextChar(t.cursorPos);
                        break;
                    case kPrevWord:
                        b = t.textRender.getPrevWord(t.cursorPos);
                        e = t.cursorPos;
                        break;
                    case kNextWord:
                        b = t.cursorPos;
                        e = t.textRender.getNextWord(t.cursorPos);
                        break;
                    default:
                        return;
                    }
                } else {
                    b = pos;
                    e = pos + length;
                }
            }
            if (b === e) {
                return;
            }
            first = t._findFragment(b);
            last = t._findFragment(e - 1);
            if (!t.undoMode) {
                if (e - b < 2 && opt.fragments[first.index].text.length > 1) {
                    t.undoList.push({
                        fn: t._addChars,
                        args: [t.textRender.getChars(b, 1), b],
                        isRange: isRange
                    });
                } else {
                    t.undoList.push({
                        fn: t._addFragments,
                        args: [t._getFragments(b, e - b), b],
                        isRange: isRange
                    });
                }
                t.redoList = [];
            }
            if (first && last) {
                if (first.index === last.index) {
                    l = opt.fragments[first.index].text;
                    opt.fragments[first.index].text = l.slice(0, b - first.begin) + l.slice(e - first.begin);
                } else {
                    opt.fragments[first.index].text = opt.fragments[first.index].text.slice(0, b - first.begin);
                    opt.fragments[last.index].text = opt.fragments[last.index].text.slice(e - last.begin);
                    l = last.index - first.index;
                    if (l > 1) {
                        opt.fragments.splice(first.index + 1, l - 1);
                    }
                }
                t._mergeFragments();
            }
            t.cursorPos = b;
            if (!t.undoAllMode) {
                t._update();
            }
        },
        _selectChars: function (kind, pos) {
            var t = this;
            var begPos, endPos;
            begPos = t.selectionBegin === t.selectionEnd ? t.cursorPos : t.selectionBegin;
            t._moveCursor(kind, pos);
            endPos = t.cursorPos;
            t.selectionBegin = begPos;
            t.selectionEnd = endPos;
            t._drawSelection();
            if (t.isTopLineActive && !t.skipTLUpdate) {
                t._updateTopLineCurPos();
            }
        },
        _changeSelection: function (coord) {
            var t = this;
            function doChangeSelection(coord) {
                var pos = t._findCursorPosition(coord);
                if (pos !== undefined) {
                    pos >= 0 ? t._selectChars(kPosition, pos) : t._selectChars(pos);
                }
                if (t.isSelectMode) {
                    t.selectionTimer = window.setTimeout(function () {
                        doChangeSelection(coord);
                    },
                    t.settings.selectionTimeout);
                }
            }
            window.clearTimeout(t.selectionTimer);
            t.selectionTimer = window.setTimeout(function () {
                doChangeSelection(coord);
            },
            0);
        },
        _findFragment: function (pos) {
            var opt = this.options,
            i, begin, end;
            for (i = 0, begin = 0; i < opt.fragments.length; ++i) {
                end = begin + opt.fragments[i].text.length;
                if (pos >= begin && pos < end) {
                    return {
                        index: i,
                        begin: begin,
                        end: end
                    };
                }
                if (i < opt.fragments.length - 1) {
                    begin = end;
                }
            }
            return pos === end ? {
                index: i - 1,
                begin: begin,
                end: end
            } : undefined;
        },
        _findFragmentToInsertInto: function (pos) {
            var opt = this.options,
            i, begin, end;
            for (i = 0, begin = 0; i < opt.fragments.length; ++i) {
                end = begin + opt.fragments[i].text.length;
                if (pos >= begin && pos <= end) {
                    return {
                        index: i,
                        begin: begin,
                        end: end
                    };
                }
                if (i < opt.fragments.length - 1) {
                    begin = end;
                }
            }
            return undefined;
        },
        _isWholeFragment: function (pos, len) {
            var fr = this._findFragment(pos);
            return fr && pos === fr.begin && len === fr.end - fr.begin;
        },
        _splitFragment: function (f, pos) {
            var t = this,
            opt = t.options,
            fr;
            if (pos > f.begin && pos < f.end) {
                fr = opt.fragments[f.index];
                Array.prototype.splice.apply(opt.fragments, [f.index, 1].concat([{
                    format: t._cloneFormat(fr.format),
                    text: fr.text.slice(0, pos - f.begin),
                    theme: fr.theme,
                    tint: fr.tint
                },
                {
                    format: t._cloneFormat(fr.format),
                    text: fr.text.slice(pos - f.begin),
                    theme: fr.theme,
                    tint: fr.tint
                }]));
            }
        },
        _getFragments: function (startPos, length) {
            var t = this,
            opt = t.options,
            endPos = startPos + length - 1,
            res = [],
            fr,
            i;
            var first = t._findFragment(startPos);
            var last = t._findFragment(endPos);
            if (!first || !last) {
                throw "Can not extract fragment of text";
            }
            if (first.index === last.index) {
                fr = asc_clone(opt.fragments[first.index]);
                fr.text = fr.text.slice(startPos - first.begin, endPos - first.begin + 1);
                res.push(fr);
            } else {
                fr = asc_clone(opt.fragments[first.index]);
                fr.text = fr.text.slice(startPos - first.begin);
                res.push(fr);
                for (i = first.index + 1; i < last.index; ++i) {
                    fr = asc_clone(opt.fragments[i]);
                    res.push(fr);
                }
                fr = asc_clone(opt.fragments[last.index]);
                fr.text = fr.text.slice(0, endPos - last.begin + 1);
                res.push(fr);
            }
            return res;
        },
        _extractFragments: function (startPos, length) {
            var t = this,
            fr;
            fr = t._findFragment(startPos);
            if (!fr) {
                throw "Can not extract fragment of text";
            }
            t._splitFragment(fr, startPos);
            fr = t._findFragment(startPos + length);
            if (!fr) {
                throw "Can not extract fragment of text";
            }
            t._splitFragment(fr, startPos + length);
        },
        _addFragments: function (f, pos) {
            var t = this,
            opt = t.options,
            fr;
            fr = t._findFragment(pos);
            if (fr && pos < fr.end) {
                t._splitFragment(fr, pos);
                fr = t._findFragment(pos);
                Array.prototype.splice.apply(opt.fragments, [fr.index, 0].concat(f));
            } else {
                opt.fragments = opt.fragments.concat(f);
            }
            t._mergeFragments();
            t.cursorPos = pos + t._getFragmentsLength(f);
            if (!t.undoAllMode) {
                t._update();
            }
        },
        _mergeFragments: function () {
            var t = this,
            opt = t.options,
            i;
            for (i = 0; i < opt.fragments.length;) {
                if (opt.fragments[i].text.length < 1 && opt.fragments.length > 1) {
                    opt.fragments.splice(i, 1);
                    continue;
                }
                if (i < opt.fragments.length - 1) {
                    var fr = opt.fragments[i];
                    var nextFr = opt.fragments[i + 1];
                    if (t._isEqualFormats(fr.format, nextFr.format) && fr.theme == nextFr.theme && fr.tint == nextFr.tint) {
                        opt.fragments.splice(i, 2, {
                            format: fr.format,
                            text: fr.text + nextFr.text,
                            theme: fr.theme,
                            tint: fr.tint
                        });
                        continue;
                    }
                }++i;
            }
        },
        _cleanFragments: function (fr) {
            var t = this,
            i, s, f, wrap = t.textFlags.wrapText || t.textFlags.wrapOnlyNL;
            for (i = 0; i < fr.length; ++i) {
                s = fr[i].text;
                if (s.search(t.reNL) >= 0) {
                    s = s.replace(t.reReplaceNL, wrap ? "\n" : "\u00B6");
                }
                if (s.search(t.reTab) >= 0) {
                    s = s.replace(t.reReplaceTab, "        ");
                }
                fr[i].text = s;
                f = fr[i].format;
                if (f.fn === "") {
                    f.fn = t.options.font.FontFamily.Name;
                }
                if (f.fs === 0) {
                    f.fs = t.options.font.FontSize;
                }
            }
        },
        _getFragmentsLength: function (f) {
            return f.length > 0 ? f.reduce(function (pv, cv) {
                return pv + cv.text.length;
            },
            0) : 0;
        },
        _getFragmentsText: function (f) {
            return f.length > 0 ? f.reduce(function (pv, cv) {
                return pv + cv.text;
            },
            "") : "";
        },
        _isEqualFormats: function (f1, f2) {
            return f1.fn === f2.fn && f1.fs === f2.fs && f1.b === f2.b && f1.i === f2.i && f1.u === f2.u && f1.s === f2.s && f1.c === f2.c && f1.va === f2.va;
        },
        _setFormatProperty: function (format, prop, val, formatAdditional) {
            switch (prop) {
            case "fn":
                format.fn = val;
                break;
            case "fs":
                format.fs = val;
                break;
            case "b":
                val = (null === val) ? ((format.b) ? !format.b : true) : val;
                format.b = val;
                break;
            case "i":
                val = (null === val) ? ((format.i) ? !format.i : true) : val;
                format.i = val;
                break;
            case "u":
                val = (null === val) ? ((format.u) ? !format.u : true) : val;
                format.u = val;
                break;
            case "s":
                val = (null === val) ? ((format.s) ? !format.s : true) : val;
                format.s = val;
                break;
            case "fa":
                format.va = val;
                break;
            case "c":
                format.c = asc.numberToCSSColor(val.getRgb());
                formatAdditional.theme = null;
                formatAdditional.tint = null;
                if (val instanceof ThemeColor) {
                    formatAdditional.theme = val.theme;
                    formatAdditional.tint = val.tint;
                }
                break;
            case "changeFontSize":
                var newFontSize = asc_incDecFonSize(val, format.fs);
                if (null !== newFontSize) {
                    format.fs = newFontSize;
                }
                break;
            }
            return val;
        },
        _cloneFormat: function (format) {
            return asc_clone(format);
        },
        _performAction: function (list1, list2) {
            var t = this,
            action, str, pos, len;
            if (list1.length < 1) {
                return;
            }
            action = list1.pop();
            if (action.fn === t._removeChars) {
                pos = action.args[0];
                len = action.args[1];
                if (len < 2 && !t._isWholeFragment(pos, len)) {
                    list2.push({
                        fn: t._addChars,
                        args: [t.textRender.getChars(pos, len), pos],
                        isRange: action.isRange
                    });
                } else {
                    list2.push({
                        fn: t._addFragments,
                        args: [t._getFragments(pos, len), pos],
                        isRange: action.isRange
                    });
                }
            } else {
                if (action.fn === t._addChars) {
                    str = action.args[0];
                    pos = action.args[1];
                    list2.push({
                        fn: t._removeChars,
                        args: [pos, str.length],
                        isRange: action.isRange
                    });
                } else {
                    if (action.fn === t._addFragments) {
                        pos = action.args[1];
                        len = t._getFragmentsLength(action.args[0]);
                        list2.push({
                            fn: t._removeChars,
                            args: [pos, len],
                            isRange: action.isRange
                        });
                    } else {
                        return;
                    }
                }
            }
            t.undoMode = true;
            action.fn.apply(t, action.args);
            t.undoMode = false;
        },
        _onWindowKeyDown: function (event) {
            var t = this,
            kind = undefined,
            hieroglyph = false;
            var wrap = t.textFlags.wrapText || t.textFlags.wrapOnlyNL;
            function tryCloseEditor() {
                var r = t.close(true);
                if (r) {
                    $(window).trigger(event);
                }
            }
            if (!t.isOpened || !t.enableKeyEvents) {
                return true;
            }
            if (event.which === 18) {
                t.lastKeyCode = event.which;
            }
            t.skipKeyPress = true;
            t.skipTLUpdate = false;
            if (t.isTopLineActive && t._getFragmentsLength(t.options.fragments) !== t.input.val().length) {
                hieroglyph = true;
            }
            switch (event.which) {
            case 27:
                if (t.handlers.trigger("isGlobalLockEditCell")) {
                    return false;
                }
                t.undoAll();
                t.close();
                return false;
            case 13:
                if (!t.hasFocus) {
                    t.setFocus(true);
                }
                if (! (event.altKey && event.shiftKey)) {
                    if (event.altKey) {
                        t._addNewLine();
                    } else {
                        if (false === t.handlers.trigger("isGlobalLockEditCell")) {
                            tryCloseEditor();
                        }
                    }
                }
                return false;
            case 9:
                if (!t.hasFocus) {
                    t.setFocus(true);
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                if (false === t.handlers.trigger("isGlobalLockEditCell")) {
                    tryCloseEditor();
                }
                return false;
            case 8:
                if (hieroglyph) {
                    t._syncEditors();
                }
                t._removeChars(event.ctrlKey ? kPrevWord : kPrevChar);
                return false;
            case 46:
                if (!t.hasFocus) {
                    t.setFocus(true);
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                t.skipTLUpdate = true;
                t._removeChars(event.ctrlKey ? kNextWord : kNextChar);
                return true;
            case 37:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                kind = event.ctrlKey ? kPrevWord : kPrevChar;
                event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
                return false;
            case 39:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                kind = event.ctrlKey ? kNextWord : kNextChar;
                event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
                return false;
            case 38:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                event.shiftKey ? t._selectChars(kPrevLine) : t._moveCursor(kPrevLine);
                return false;
            case 40:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                event.shiftKey ? t._selectChars(kNextLine) : t._moveCursor(kNextLine);
                return false;
            case 35:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                kind = event.ctrlKey ? kEndOfText : kEndOfLine;
                event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
                return false;
            case 36:
                if (!t.hasFocus) {
                    break;
                }
                if (hieroglyph) {
                    t._syncEditors();
                }
                kind = event.ctrlKey ? kBeginOfText : kBeginOfLine;
                event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
                return false;
            case 53:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    if (hieroglyph) {
                        t._syncEditors();
                    }
                    t.setTextStyle("s", null);
                    return true;
                }
                break;
            case 65:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    if (!t.isTopLineActive) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    t._moveCursor(kBeginOfText);
                    t._selectChars(kEndOfText);
                    return true;
                }
                break;
            case 66:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    if (hieroglyph) {
                        t._syncEditors();
                    }
                    t.setTextStyle("b", null);
                    return true;
                }
                break;
            case 73:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    if (hieroglyph) {
                        t._syncEditors();
                    }
                    t.setTextStyle("i", null);
                    return true;
                }
                break;
            case 85:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    if (hieroglyph) {
                        t._syncEditors();
                    }
                    t.setTextStyle("u", null);
                    return true;
                }
                break;
            case 144:
                case 145:
                if ($.browser.opera) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                return false;
            case 80:
                if (event.ctrlKey) {
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
                break;
            case 67:
                case 86:
                case 88:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    if (t.isTopLineActive) {
                        setTimeout(function () {
                            setTimeout(function () {
                                t._updateTopLineCurPos();
                                t.input[0].focus();
                            },
                            0);
                        },
                        0);
                    }
                    switch (event.which) {
                    case 67:
                        t.handlers.trigger("copy");
                        break;
                    case 86:
                        t.handlers.trigger("paste");
                        break;
                    case 88:
                        t.handlers.trigger("cut");
                        break;
                    }
                    return true;
                }
                break;
            case 89:
                case 90:
                if (event.ctrlKey) {
                    if (!t.hasFocus) {
                        t.setFocus(true);
                    }
                    event.which === 90 ? t.undo() : t.redo();
                    return false;
                }
                break;
            case 113:
                if ($.browser.opera) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                return false;
            }
            t.skipKeyPress = false;
            t.skipTLUpdate = true;
            return true;
        },
        _onWindowKeyPress: function (event) {
            var t = this;
            if (!t.isOpened || !t.enableKeyEvents) {
                return true;
            }
            if (t.skipKeyPress || event.which < 32 || event.altKey || event.ctrlKey) {
                t.skipKeyPress = true;
                return true;
            }
            if (!t.hasFocus) {
                t.setFocus(true);
            }
            if (t.isTopLineActive && t._getFragmentsLength(t.options.fragments) !== t.input.val().length) {
                t._syncEditors();
            }
            t.isUpdateValue = false;
            t._addChars(String.fromCharCode(event.which));
            return t.isTopLineActive ? true : false;
        },
        _onWindowKeyUp: function (event) {
            var t = this;
            if (t.lastKeyCode === 18 && event.which === 18) {
                return false;
            }
        },
        _onWindowMouseUp: function (event) {
            this.isSelectMode = false;
            if (this.callTopLineMouseup) {
                this._topLineMouseUp();
            }
            return true;
        },
        _onWindowMouseMove: function (event) {
            if (this.isSelectMode && !this.hasCursor) {
                this._changeSelection(this._getCoordinates(event));
            }
            return true;
        },
        _onMouseDown: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            var pos;
            this.setFocus(true);
            t.isTopLineActive = false;
            t.input.removeClass("focused");
            t._showCursor();
            if (event.which === 1) {
                if (!event.shiftKey) {
                    t.isSelectMode = true;
                    pos = t._findCursorPosition(coord);
                    if (pos !== undefined) {
                        pos >= 0 ? t._moveCursor(kPosition, pos) : t._moveCursor(pos);
                    }
                } else {
                    t._changeSelection(coord);
                }
            }
            return true;
        },
        _onMouseUp: function (event) {
            this.isSelectMode = false;
            return true;
        },
        _onMouseMove: function (event) {
            this.hasCursor = true;
            if (this.isSelectMode) {
                this._changeSelection(this._getCoordinates(event));
            }
            return true;
        },
        _onMouseLeave: function (event) {
            this.hasCursor = false;
            return true;
        },
        _onMouseDblClick: function (event) {
            var t = this;
            var endWord = t.textRender.getNextWord(t.cursorPos);
            if (endWord === t.cursorPos) {
                endWord = t.textRender.getEndOfLine(t.cursorPos);
            }
            var startWord = t.textRender.getPrevWord(endWord);
            t._moveCursor(kPosition, startWord);
            t._selectChars(kPosition, endWord);
            return true;
        },
        _onInputTextArea: function (event) {
            if (this.isUpdateValue) {
                this.skipTLUpdate = true;
                this.replaceText(0, this.textRender.getEndOfLine(this.cursorPos), this.input.val());
            }
            this.isUpdateValue = true;
            return true;
        },
        _getCoordinates: function (event) {
            var t = this;
            var offs = t.canvasOverlay.offset();
            var x = (event.pageX - offs.left) / t.kx;
            var y = (event.pageY - offs.top) / t.ky;
            return {
                x: x,
                y: y
            };
        }
    };
    window["Asc"].CellEditor = CellEditor;
})(jQuery, window);