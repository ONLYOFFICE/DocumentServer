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
    var asc_lastindexof = asc.lastIndexOf;
    var asc_inherit = asc.inherit;
    var asc_SR = asc.StringRender;
    function CharOffset(left, top, height, line) {
        this.left = left;
        this.top = top;
        this.height = height;
        this.lineIndex = line;
    }
    function CellTextRender(drawingCtx) {
        if (! (this instanceof CellTextRender)) {
            return new CellTextRender(drawingCtx);
        }
        CellTextRender.superclass.constructor.call(this, drawingCtx);
        return this;
    }
    var CellTextRender_methods = {
        reWordBegining: XRegExp("[^\\p{L}\\p{N}][\\p{L}\\p{N}]", "i"),
        getLinesCount: function () {
            return this.lines.length;
        },
        getLineInfo: function (index) {
            return this.lines.length > 0 && index >= 0 && index < this.lines.length ? this.lines[index] : null;
        },
        calcLineOffset: function (index) {
            for (var i = 0, h = 0, l = this.lines; i < index; ++i) {
                h += l[i].th;
            }
            return h;
        },
        getPrevChar: function (pos) {
            return pos <= 0 ? 0 : pos <= this.chars.length ? pos - 1 : this.chars.length;
        },
        getNextChar: function (pos) {
            return pos >= this.chars.length ? this.chars.length : pos >= 0 ? pos + 1 : 0;
        },
        getPrevWord: function (pos) {
            var i = asc_lastindexof(this.chars.slice(0, pos), this.reWordBegining);
            return i >= 0 ? i + 1 : 0;
        },
        getNextWord: function (pos) {
            var i = this.chars.slice(pos).search(this.reWordBegining);
            return pos + (i >= 0 ? i + 1 : 0);
        },
        getBeginOfLine: function (pos) {
            pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);
            for (var l = this.lines, i = 0; i < l.length; ++i) {
                if (pos >= l[i].beg && pos <= l[i].end) {
                    return l[i].beg;
                }
            }
            var lastLine = l.length - 1;
            var lastChar = this.chars.length - 1;
            return this.charWidths[lastChar] !== 0 ? l[lastLine].beg : pos;
        },
        getEndOfLine: function (pos) {
            pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);
            var l = this.lines;
            var lastLine = l.length - 1;
            for (var i = 0; i < lastLine; ++i) {
                if (pos >= l[i].beg && pos <= l[i].end) {
                    return l[i].end;
                }
            }
            var lastChar = this.chars.length - 1;
            return pos > lastChar ? pos : lastChar + (this.charWidths[lastChar] !== 0 ? 1 : 0);
        },
        getBeginOfText: function (pos) {
            return 0;
        },
        getEndOfText: function (pos) {
            return this.chars.length;
        },
        getPrevLine: function (pos) {
            pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);
            for (var l = this.lines, i = 0; i < l.length; ++i) {
                if (pos >= l[i].beg && pos <= l[i].end) {
                    return i <= 0 ? 0 : Math.min(l[i - 1].beg + pos - l[i].beg, l[i - 1].end);
                }
            }
            var lastLine = l.length - 1;
            var lastChar = this.chars.length - 1;
            return this.charWidths[lastChar] === 0 || l.length < 2 ? (0 > lastLine ? 0 : l[lastLine].beg) : lastChar > 0 ? Math.min(l[lastLine - 1].beg + pos - l[lastLine].beg, l[lastLine - 1].end) : 0;
        },
        getNextLine: function (pos) {
            pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);
            var l = this.lines;
            var lastLine = l.length - 1;
            for (var i = 0; i < lastLine; ++i) {
                if (pos >= l[i].beg && pos <= l[i].end) {
                    return Math.min(l[i + 1].beg + pos - l[i].beg, l[i + 1].end);
                }
            }
            return this.chars.length;
        },
        calcCharOffset: function (pos) {
            var t = this,
            l = t.lines,
            i = 0,
            h = 0,
            co;
            function getCharInfo(pos) {
                for (var p = t.charProps[pos];
                (!p || !p.font) && pos > 0; --pos) {
                    p = t.charProps[pos - 1];
                }
                return {
                    fsz: p.font.FontSize,
                    dh: p && p.lm && p.lm.bl2 > 0 ? p.lm.bl2 - p.lm.bl : 0
                };
            }
            function charOffset(lineIndex) {
                var ci = getCharInfo(pos);
                var li = l[lineIndex];
                return new CharOffset(li.startX + (pos > 0 ? t._calcCharsWidth(li.beg, pos - 1) : 0), h + li.bl - ci.fsz + ci.dh, ci.fsz, lineIndex);
            }
            if (l.length < 1) {
                return null;
            }
            if (pos < 0) {
                pos = 0;
            }
            if (pos > t.chars.length) {
                pos = t.chars.length;
            }
            for (i = 0, h = 0; i < l.length; ++i) {
                if (pos >= l[i].beg && pos <= l[i].end) {
                    return charOffset(i);
                }
                if (i !== l.length - 1) {
                    h += l[i].th;
                }
            }
            co = charOffset(i - 1);
            if (t.charWidths[t.chars.length - 1] === 0) {
                co.left = null;
                co.top += l[i - 1].th;
                co.lineIndex++;
            }
            return co;
        },
        calcCharHeight: function (pos) {
            var t = this;
            for (var p = t.charProps[pos];
            (!p || !p.font) && pos > 0; --pos) {
                p = t.charProps[pos - 1];
            }
            return t._calcLineMetrics(p.fsz !== undefined ? p.fsz : p.font.FontSize, p.va, p.fm, t.drawingCtx.getPPIY());
        },
        getCharsCount: function () {
            return this.chars.length;
        },
        getChars: function (pos, len) {
            return this.chars.slice(pos, pos + len);
        },
        getCharWidth: function (pos) {
            return this.charWidths[pos];
        },
        isLastCharNL: function () {
            return this.charWidths[this.chars.length - 1] === 0;
        }
    };
    asc_inherit(CellTextRender, asc_SR, CellTextRender_methods);
    window["Asc"].CellTextRender = CellTextRender;
})(jQuery, window);