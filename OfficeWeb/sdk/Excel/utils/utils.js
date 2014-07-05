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
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var prot;
    var kLeftLim1 = 0.999999999999999;
    var kUndefinedL = "undefined";
    var kNullL = "null";
    var kObjectL = "object";
    var kFunctionL = "function";
    var kNumberL = "number";
    var kArrayL = "array";
    function typeOf(obj) {
        if (obj === undefined) {
            return kUndefinedL;
        }
        if (obj === null) {
            return kNullL;
        }
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    function getProperty(name) {
        var n = name.split("."),
        r = undefined,
        i;
        function find(prop, obj) {
            if (obj === undefined || obj === null) {
                return undefined;
            }
            var ref = obj;
            for (var i = 0; i < prop.length; ++i) {
                var p = ref[prop[i]];
                if (p === undefined) {
                    return undefined;
                }
                ref = p;
            }
            return ref;
        }
        for (i = 1; i < arguments.length; ++i) {
            if ((r = find(n, arguments[i])) !== undefined) {
                break;
            }
        }
        return r;
    }
    function lastIndexOf(s, regExp, fromIndex) {
        var end = fromIndex >= 0 && fromIndex <= s.length ? fromIndex : s.length;
        for (var i = end - 1; i >= 0; --i) {
            var j = s.slice(i, end).search(regExp);
            if (j >= 0) {
                return i + j;
            }
        }
        return -1;
    }
    function search(arr, fn) {
        for (var i = 0; i < arr.length; ++i) {
            if (fn(arr[i])) {
                return i;
            }
        }
        return -1;
    }
    function round(x) {
        var y = x + (x >= 0 ? 0.5 : -0.4);
        return y | y;
    }
    function floor(x) {
        var y = x | x;
        y -= x < 0 && y > x ? 1 : 0;
        return y + (x - y > kLeftLim1 ? 1 : 0);
    }
    function ceil(x) {
        var y = x | x;
        y += x > 0 && y < x ? 1 : 0;
        return y - (y - x > kLeftLim1 ? 1 : 0);
    }
    function incDecFonSize(bIncrease, oValue) {
        var aSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        var nLength = aSizes.length;
        var i;
        if (true === bIncrease) {
            if (oValue >= aSizes[nLength - 1]) {
                return null;
            }
            for (i = 0; i < nLength; ++i) {
                if (aSizes[i] > oValue) {
                    break;
                }
            }
        } else {
            if (oValue <= aSizes[0]) {
                return null;
            }
            for (i = nLength - 1; i >= 0; --i) {
                if (aSizes[i] < oValue) {
                    break;
                }
            }
        }
        return aSizes[i];
    }
    function inherit(child, parent, childProto) {
        parent.prototype.constructor = parent;
        var F = function () {};
        F.prototype = parent.prototype;
        child.prototype = $.extend(true, new F(), childProto);
        child.prototype.constructor = child;
        child.superclass = parent.prototype;
    }
    function profileTime(fn) {
        var start, end, arg = [],
        i;
        if (arguments.length) {
            if (arguments.length > 1) {
                for (i = 1; i < arguments.length; ++i) {
                    arg.push(arguments[i]);
                }
                start = new Date();
                fn.apply(window, arg);
                end = new Date();
            } else {
                start = new Date();
                fn();
                end = new Date();
            }
            return end.getTime() - start.getTime();
        }
        return undefined;
    }
    function Range(c1, r1, c2, r2, normalize) {
        if (! (this instanceof Range)) {
            return new Range(c1, r1, c2, r2, normalize);
        }
        this.c1 = c1;
        this.r1 = r1;
        this.c2 = c2;
        this.r2 = r2;
        return normalize ? this.normalize() : this;
    }
    Range.prototype = {
        constructor: Range,
        assign: function (c1, r1, c2, r2, normalize) {
            if (typeOf(c1) !== kNumberL || typeOf(c2) !== kNumberL || typeOf(r1) !== kNumberL || typeOf(r2) !== kNumberL) {
                throw "Error: range.assign(" + c1 + "," + r1 + "," + c2 + "," + r2 + ") - numerical args are expected";
            }
            this.c1 = c1;
            this.r1 = r1;
            this.c2 = c2;
            this.r2 = r2;
            return normalize ? this.normalize() : this;
        },
        clone: function (normalize) {
            return new Range(this.c1, this.r1, this.c2, this.r2, normalize);
        },
        normalize: function () {
            var tmp;
            if (this.c1 > this.c2) {
                tmp = this.c1;
                this.c1 = this.c2;
                this.c2 = tmp;
            }
            if (this.r1 > this.r2) {
                tmp = this.r1;
                this.r1 = this.r2;
                this.r2 = tmp;
            }
            return this;
        },
        isEqual: function (range) {
            return range && this.c1 === range.c1 && this.r1 === range.r1 && this.c2 === range.c2 && this.r2 === range.r2;
        },
        contains: function (c, r) {
            return this.c1 <= c && c <= this.c2 && this.r1 <= r && r <= this.r2;
        },
        containsRange: function (range) {
            return this.contains(range.c1, range.r1) && this.contains(range.c2, range.r2);
        },
        intersection: function (range) {
            var s1 = this.clone(true),
            s2 = range instanceof Range ? range.clone(true) : new Range(range.c1, range.r1, range.c2, range.r2, true);
            if (s2.c1 > s1.c2 || s2.c2 < s1.c1 || s2.r1 > s1.r2 || s2.r2 < s1.r1) {
                return null;
            }
            return new Range(s2.c1 >= s1.c1 && s2.c1 <= s1.c2 ? s2.c1 : s1.c1, s2.r1 >= s1.r1 && s2.r1 <= s1.r2 ? s2.r1 : s1.r1, Math.min(s1.c2, s2.c2), Math.min(s1.r2, s2.r2));
        },
        intersectionSimple: function (range) {
            var oRes = null;
            var r1 = Math.max(this.r1, range.r1);
            var c1 = Math.max(this.c1, range.c1);
            var r2 = Math.min(this.r2, range.r2);
            var c2 = Math.min(this.c2, range.c2);
            if (r1 <= r2 && c1 <= c2) {
                oRes = new Range(c1, r1, c2, r2);
            }
            return oRes;
        },
        union: function (range) {
            var s1 = this.clone(true),
            s2 = range instanceof Range ? range.clone(true) : new Range(range.c1, range.r1, range.c2, range.r2, true);
            return new Range(Math.min(s1.c1, s2.c1), Math.min(s1.r1, s2.r1), Math.max(s1.c2, s2.c2), Math.max(s1.r2, s2.r2));
        },
        union2: function (range) {
            this.c1 = Math.min(this.c1, range.c1);
            this.c2 = Math.max(this.c2, range.c2);
            this.r1 = Math.min(this.r1, range.r1);
            this.r2 = Math.max(this.r2, range.r2);
        },
        setOffset: function (offset) {
            this.setOffsetFirst(offset);
            this.setOffsetLast(offset);
        },
        setOffsetFirst: function (offset) {
            this.c1 += offset.offsetCol;
            if (this.c1 < 0) {
                this.c1 = 0;
            }
            this.r1 += offset.offsetRow;
            if (this.r1 < 0) {
                this.r1 = 0;
            }
        },
        setOffsetLast: function (offset) {
            this.c2 += offset.offsetCol;
            if (this.c2 < 0) {
                this.c2 = 0;
            }
            this.r2 += offset.offsetRow;
            if (this.r2 < 0) {
                this.r2 = 0;
            }
        }
    };
    function HandlersList(handlers) {
        if (! (this instanceof HandlersList)) {
            return new HandlersList(handlers);
        }
        this.handlers = handlers || {};
        return this;
    }
    HandlersList.prototype = {
        constructor: HandlersList,
        trigger: function (eventName) {
            var h = this.handlers[eventName],
            t = typeOf(h),
            a = Array.prototype.slice.call(arguments, 1),
            i;
            if (t === kFunctionL) {
                return h.apply(this, a);
            }
            if (t === kArrayL) {
                for (i = 0; i < h.length; i += 1) {
                    if (typeOf(h[i]) === kFunctionL) {
                        h[i].apply(this, a);
                    }
                }
                return true;
            }
            return false;
        },
        add: function (eventName, eventHandler, replaceOldHandler) {
            var th = this.handlers,
            h, old, t;
            if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
                th[eventName] = eventHandler;
            } else {
                old = h = th[eventName];
                t = typeOf(old);
                if (t !== kArrayL) {
                    h = th[eventName] = [];
                    if (t === kFunctionL) {
                        h.push(old);
                    }
                }
                h.push(eventHandler);
            }
        },
        remove: function (eventName, eventHandler) {
            var th = this.handlers,
            h = th[eventName],
            i;
            if (th.hasOwnProperty(eventName)) {
                if (typeOf(h) !== kArrayL || typeOf(eventHandler) !== kFunctionL) {
                    delete th[eventName];
                    return true;
                }
                for (i = h.length - 1; i >= 0; i -= 1) {
                    if (h[i] === eventHandler) {
                        delete h[i];
                        return true;
                    }
                }
            }
            return false;
        }
    };
    function outputDebugStr(channel) {
        var c = window.console;
        if (asc.g_debug_mode && c && c[channel] && c[channel].apply) {
            c[channel].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
    function isEqual(Obj1, Obj2) {
        if (null == Obj1 && null == Obj2) {
            return true;
        }
        if (!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2)) {
            return false;
        }
        var p, v1, v2;
        for (p in Obj2) {
            if (Obj2.hasOwnProperty(p) && !Obj1.hasOwnProperty(p)) {
                return false;
            }
        }
        for (p in Obj1) {
            if (Obj1.hasOwnProperty(p)) {
                if (!Obj2.hasOwnProperty(p)) {
                    return false;
                }
                v1 = Obj1[p];
                v2 = Obj2[p];
                if (v1 && v2 && kObjectL === typeof(v1) && kObjectL === typeof(v2)) {
                    if (false == isEqual(v1, v2)) {
                        return false;
                    }
                } else {
                    if (v1 != v2) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    function clone(Obj) {
        if (!Obj || !(kObjectL == typeof(Obj) || kArrayL == typeof(Obj))) {
            return Obj;
        }
        var c = kFunctionL === typeof Obj.pop ? [] : {};
        var p, v;
        for (p in Obj) {
            if (Obj.hasOwnProperty(p)) {
                v = Obj[p];
                if (v && kObjectL === typeof v) {
                    c[p] = clone(v);
                } else {
                    c[p] = v;
                }
            }
        }
        return c;
    }
    function trim(val) {
        if (!String.prototype.trim) {
            return val.trim();
        } else {
            return val.replace(/^\s+|\s+$/g, "");
        }
    }
    function isNumber(val) {
        var valTrim = trim(val);
        return (valTrim - 0) == valTrim && valTrim.length > 0;
    }
    function asc_CMouseMoveData(obj) {
        if (! (this instanceof asc_CMouseMoveData)) {
            return new asc_CMouseMoveData(obj);
        }
        if (obj) {
            this.type = obj.type;
            this.x = obj.x;
            this.reverseX = obj.reverseX;
            this.y = obj.y;
            this.hyperlink = obj.hyperlink;
            this.aCommentIndexes = obj.aCommentIndexes;
            this.userId = obj.userId;
            this.lockedObjectType = obj.lockedObjectType;
        }
        return this;
    }
    asc_CMouseMoveData.prototype = {
        constructor: asc_CMouseMoveData,
        asc_getType: function () {
            return this.type;
        },
        asc_getX: function () {
            return this.x;
        },
        asc_getReverseX: function () {
            return this.reverseX;
        },
        asc_getY: function () {
            return this.y;
        },
        asc_getHyperlink: function () {
            return this.hyperlink;
        },
        asc_getCommentIndexes: function () {
            return this.aCommentIndexes;
        },
        asc_getUserId: function () {
            return this.userId;
        },
        asc_getLockedObjectType: function () {
            return this.lockedObjectType;
        }
    };
    function asc_CHyperlink(obj) {
        if (! (this instanceof asc_CHyperlink)) {
            return new asc_CHyperlink(obj);
        }
        this.hyperlinkModel = null != obj ? obj : new Hyperlink();
        this.text = null;
        return this;
    }
    asc_CHyperlink.prototype = {
        constructor: asc_CHyperlink,
        asc_getType: function () {
            return this.hyperlinkModel.getHyperlinkType();
        },
        asc_getHyperlinkUrl: function () {
            return this.hyperlinkModel.Hyperlink;
        },
        asc_getTooltip: function () {
            return this.hyperlinkModel.Tooltip;
        },
        asc_getLocation: function () {
            return this.hyperlinkModel.getLocation();
        },
        asc_getSheet: function () {
            return this.hyperlinkModel.LocationSheet;
        },
        asc_getRange: function () {
            return this.hyperlinkModel.LocationRange;
        },
        asc_getText: function () {
            return this.text;
        },
        asc_setType: function (val) {
            switch (val) {
            case c_oAscHyperlinkType.WebLink:
                this.hyperlinkModel.setLocation(null);
                break;
            case c_oAscHyperlinkType.RangeLink:
                this.hyperlinkModel.Hyperlink = null;
                break;
            }
        },
        asc_setHyperlinkUrl: function (val) {
            this.hyperlinkModel.Hyperlink = val;
        },
        asc_setTooltip: function (val) {
            this.hyperlinkModel.Tooltip = val;
        },
        asc_setLocation: function (val) {
            this.hyperlinkModel.setLocation(val);
        },
        asc_setSheet: function (val) {
            this.hyperlinkModel.setLocationSheet(val);
        },
        asc_setRange: function (val) {
            this.hyperlinkModel.setLocationRange(val);
        },
        asc_setText: function (val) {
            this.text = val;
        }
    };
    function asc_CPageMargins(obj) {
        if (! (this instanceof asc_CPageMargins)) {
            return new asc_CPageMargins(obj);
        }
        if (obj) {
            this.left = obj.left;
            this.right = obj.right;
            this.top = obj.top;
            this.bottom = obj.bottom;
        }
        return this;
    }
    asc_CPageMargins.prototype = {
        asc_getLeft: function () {
            return this.left;
        },
        asc_getRight: function () {
            return this.right;
        },
        asc_getTop: function () {
            return this.top;
        },
        asc_getBottom: function () {
            return this.bottom;
        },
        asc_setLeft: function (val) {
            this.left = val;
        },
        asc_setRight: function (val) {
            this.right = val;
        },
        asc_setTop: function (val) {
            this.top = val;
        },
        asc_setBottom: function (val) {
            this.bottom = val;
        }
    };
    function asc_CPageSetup(obj) {
        if (! (this instanceof asc_CPageSetup)) {
            return new asc_CPageSetup(obj);
        }
        if (obj) {
            this.orientation = obj.orientation;
            this.width = obj.width;
            this.height = obj.height;
        }
        return this;
    }
    asc_CPageSetup.prototype = {
        asc_getOrientation: function () {
            return this.orientation;
        },
        asc_getWidth: function () {
            return this.width;
        },
        asc_getHeight: function () {
            return this.height;
        },
        asc_setOrientation: function (val) {
            this.orientation = val;
        },
        asc_setWidth: function (val) {
            this.width = val;
        },
        asc_setHeight: function (val) {
            this.height = val;
        }
    };
    function asc_CPageOptions(obj) {
        if (! (this instanceof asc_CPageOptions)) {
            return new asc_CPageOptions(obj);
        }
        if (obj) {
            this.pageMargins = obj.pageMargins;
            this.pageSetup = obj.pageSetup;
            this.gridLines = obj.gridLines;
            this.headings = obj.headings;
        }
        return this;
    }
    asc_CPageOptions.prototype = {
        asc_getPageMargins: function () {
            return this.pageMargins;
        },
        asc_getPageSetup: function () {
            return this.pageSetup;
        },
        asc_getGridLines: function () {
            return this.gridLines;
        },
        asc_getHeadings: function () {
            return this.headings;
        },
        asc_setPageMargins: function (val) {
            this.pageMargins = val;
        },
        asc_setPageSetup: function (val) {
            this.pageSetup = val;
        },
        asc_setGridLines: function (val) {
            this.gridLines = val;
        },
        asc_setHeadings: function (val) {
            this.headings = val;
        }
    };
    function CPagePrint() {
        if (! (this instanceof CPagePrint)) {
            return new CPagePrint();
        }
        this.pageWidth = 0;
        this.pageHeight = 0;
        this.pageClipRectLeft = 0;
        this.pageClipRectTop = 0;
        this.pageClipRectWidth = 0;
        this.pageClipRectHeight = 0;
        this.pageRange = null;
        this.leftFieldInPt = 0;
        this.topFieldInPt = 0;
        this.rightFieldInPt = 0;
        this.bottomFieldInPt = 0;
        this.pageGridLines = false;
        this.pageHeadings = false;
        this.indexWorksheet = -1;
        this.startOffset = 0;
        this.startOffsetPt = 0;
        return this;
    }
    function CPrintPagesData() {
        if (! (this instanceof CPrintPagesData)) {
            return new CPrintPagesData();
        }
        this.arrPages = null;
        this.currentIndex = 0;
        this.c_maxPagesCount = 10;
        return this;
    }
    function asc_CAdjustPrint() {
        if (! (this instanceof asc_CAdjustPrint)) {
            return new asc_CAdjustPrint();
        }
        this.printType = c_oAscPrintType.ActiveSheets;
        this.layoutPageType = c_oAscLayoutPageType.FitToWidth;
        return this;
    }
    asc_CAdjustPrint.prototype = {
        constructor: asc_CAdjustPrint,
        asc_getPrintType: function () {
            return this.printType;
        },
        asc_getLayoutPageType: function () {
            return this.layoutPageType;
        },
        asc_setPrintType: function (val) {
            this.printType = val;
        },
        asc_setLayoutPageType: function (val) {
            this.layoutPageType = val;
        }
    };
    function asc_CLockInfo() {
        if (! (this instanceof asc_CLockInfo)) {
            return new asc_CLockInfo();
        }
        this["sheetId"] = null;
        this["type"] = null;
        this["subType"] = null;
        this["guid"] = null;
        this["rangeOrObjectId"] = null;
    }
    function asc_CCollaborativeRange(c1, r1, c2, r2) {
        if (! (this instanceof asc_CCollaborativeRange)) {
            return new asc_CCollaborativeRange(c1, r1, c2, r2);
        }
        this["c1"] = c1;
        this["r1"] = r1;
        this["c2"] = c2;
        this["r2"] = r2;
    }
    function asc_CSheetViewSettings() {
        if (! (this instanceof asc_CSheetViewSettings)) {
            return new asc_CSheetViewSettings();
        }
        this.Properties = {
            showGridLines: 0,
            showRowColHeaders: 1
        };
        this.showGridLines = null;
        this.showRowColHeaders = null;
        return this;
    }
    asc_CSheetViewSettings.prototype = {
        constructor: asc_CSheetViewSettings,
        clone: function () {
            var result = new asc_CSheetViewSettings();
            result.showGridLines = this.showGridLines;
            result.showRowColHeaders = this.showRowColHeaders;
            return result;
        },
        isEqual: function (settings) {
            return this.asc_getShowGridLines() === settings.asc_getShowGridLines() && this.asc_getShowRowColHeaders() === settings.asc_getShowRowColHeaders();
        },
        setSettings: function (settings) {
            this.showGridLines = settings.showGridLines;
            this.showRowColHeaders = settings.showRowColHeaders;
        },
        asc_getShowGridLines: function () {
            return false !== this.showGridLines;
        },
        asc_getShowRowColHeaders: function () {
            return false !== this.showRowColHeaders;
        },
        asc_setShowGridLines: function (val) {
            this.showGridLines = val;
        },
        asc_setShowRowColHeaders: function (val) {
            this.showRowColHeaders = val;
        },
        getType: function () {
            return UndoRedoDataTypes.SheetViewSettings;
        },
        getProperties: function () {
            return this.Properties;
        },
        getProperty: function (nType) {
            switch (nType) {
            case this.Properties.showGridLines:
                return this.showGridLines;
                break;
            case this.Properties.showRowColHeaders:
                return this.showRowColHeaders;
                break;
            }
        },
        setProperty: function (nType, value) {
            switch (nType) {
            case this.Properties.showGridLines:
                this.showGridLines = value;
                break;
            case this.Properties.showRowColHeaders:
                this.showRowColHeaders = value;
                break;
            }
        }
    };
    function RedoObjectParam() {
        if (! (this instanceof RedoObjectParam)) {
            return new RedoObjectParam();
        }
        this.bIsOn = false;
        this.bIsReInit = false;
    }
    function asc_CStyleImage(name, thumbnailOffset, type) {
        this.name = name;
        this.thumbnailOffset = thumbnailOffset;
        this.type = type;
    }
    asc_CStyleImage.prototype = {
        constructor: asc_CStyleImage,
        asc_getName: function () {
            return this.name;
        },
        asc_getThumbnailOffset: function () {
            return this.thumbnailOffset;
        },
        asc_getType: function () {
            return this.type;
        }
    };
    function asc_CStylesPainter() {
        this.defaultStylesImage = "";
        this.defaultStyles = null;
        this.docStylesImage = "";
        this.docStyles = null;
        this.styleThumbnailWidth = 80;
        this.styleThumbnailHeight = 18;
        this.styleThumbnailWidthPt = this.styleThumbnailWidth * 72 / 96;
        this.styleThumbnailHeightPt = this.styleThumbnailHeight * 72 / 96;
    }
    asc_CStylesPainter.prototype = {
        constructor: asc_CStylesPainter,
        asc_getStyleThumbnailWidth: function () {
            return this.styleThumbnailWidth;
        },
        asc_getStyleThumbnailHeight: function () {
            return this.styleThumbnailHeight;
        },
        asc_getDefaultStyles: function () {
            return this.defaultStyles;
        },
        asc_getDocStyles: function () {
            return this.docStyles;
        },
        asc_getDefaultStylesImage: function () {
            return this.defaultStylesImage;
        },
        asc_getDocStylesImage: function () {
            return this.docStylesImage;
        },
        generateStylesAll: function (cellStylesAll, fmgrGraphics, stringRenderer) {
            this.generateDefaultStyles(cellStylesAll, fmgrGraphics, stringRenderer);
            this.generateDocumentStyles(cellStylesAll, fmgrGraphics, stringRenderer);
        },
        generateDefaultStyles: function (cellStylesAll, fmgrGraphics, stringRenderer) {
            var nDefaultStylesCount = cellStylesAll.getDefaultStylesCount();
            var cellStyles = cellStylesAll.DefaultStyles;
            var nLength = cellStyles.length;
            var oCanvas = document.createElement("canvas");
            oCanvas.width = this.styleThumbnailWidth;
            oCanvas.height = nDefaultStylesCount * this.styleThumbnailHeight;
            var ctx = oCanvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);
            var oGraphics = asc.DrawingContext({
                canvas: oCanvas,
                units: 1,
                fmgrGraphics: fmgrGraphics
            });
            var oStyle = null;
            this.defaultStyles = [];
            for (var i = 0, styleIndex = 0; i < nLength; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden) {
                    continue;
                }
                this.defaultStyles[i] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Default);
                this.drawStyle(oGraphics, stringRenderer, oStyle, styleIndex);
                ++styleIndex;
            }
            this.defaultStylesImage = (0 === styleIndex) ? "" : oCanvas.toDataURL("image/png");
        },
        generateDocumentStyles: function (cellStylesAll, fmgrGraphics, stringRenderer) {
            var nDocumentStylesCount = cellStylesAll.getCustomStylesCount();
            var cellStyles = cellStylesAll.CustomStyles;
            var nLength = cellStyles.length;
            var oCanvas = document.createElement("canvas");
            oCanvas.width = this.styleThumbnailWidth;
            oCanvas.height = nDocumentStylesCount * this.styleThumbnailHeight;
            var ctx = oCanvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);
            var oGraphics = asc.DrawingContext({
                canvas: oCanvas,
                units: 1,
                fmgrGraphics: fmgrGraphics
            });
            var oStyle = null;
            this.docStyles = [];
            for (var i = 0, styleIndex = 0; i < nLength; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden || null != oStyle.BuiltinId) {
                    continue;
                }
                this.docStyles[styleIndex] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Document);
                this.drawStyle(oGraphics, stringRenderer, oStyle, styleIndex);
                ++styleIndex;
            }
            this.docStylesImage = (0 === styleIndex) ? "" : oCanvas.toDataURL("image/png");
        },
        drawStyle: function (oGraphics, stringRenderer, oStyle, nIndex) {
            var nOffsetY = nIndex * this.styleThumbnailHeightPt;
            var bg = oStyle.getFill();
            if (null != bg) {
                bg = bg.getRgb();
            }
            var oColor = bg !== null ? asc.numberToCSSColor(bg) : "#FFFFFF";
            oGraphics.save().beginPath().setFillStyle(oColor);
            oGraphics.rect(0, nOffsetY, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt).clip();
            oGraphics.fill();
            var bc;
            var t = this;
            var drawBorder = function (b, x1, y1, x2, y2) {
                if (null != b && c_oAscBorderStyles.None !== b.s) {
                    bc = asc.numberToCSSColor(b.c.getRgb());
                    oGraphics.setStrokeStyle(bc);
                    oGraphics.setLineWidth(b.w).beginPath().moveTo(x1, y1).lineTo(x2, y2).stroke();
                }
            };
            var oBorders = oStyle.getBorder();
            drawBorder(oBorders.l, 0, nOffsetY, 0, nOffsetY + this.styleThumbnailHeightPt);
            drawBorder(oBorders.r, this.styleThumbnailWidthPt, nOffsetY, this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);
            drawBorder(oBorders.t, 0, nOffsetY, this.styleThumbnailWidthPt, nOffsetY);
            drawBorder(oBorders.b, 0, nOffsetY + this.styleThumbnailHeightPt, this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);
            var fc = oStyle.getFontColor();
            if (null != fc) {
                fc = fc.getRgb();
            }
            var oFontColor = fc !== null ? asc.numberToCSSColor(fc) : "#000000";
            var format = oStyle.getFont();
            var oFont = new asc.FontProperties(format.fn, (16 < format.fs) ? 16 : format.fs, format.b, format.i, format.u, format.s);
            var width_padding = 3;
            var tm = stringRenderer.measureString(oStyle.Name);
            var textY = 0.5 * (nOffsetY + (nOffsetY + this.styleThumbnailHeightPt) - tm.height);
            oGraphics.setFont(oFont);
            oGraphics.setFillStyle(oFontColor);
            oGraphics.fillText(oStyle.Name, width_padding, textY + tm.baseline);
            oGraphics.restore();
        }
    };
    function asc_CSheetPr() {
        if (! (this instanceof asc_CSheetPr)) {
            return new asc_CSheetPr();
        }
        this.CodeName = null;
        this.EnableFormatConditionsCalculation = null;
        this.FilterMode = null;
        this.Published = null;
        this.SyncHorizontal = null;
        this.SyncRef = null;
        this.SyncVertical = null;
        this.TransitionEntry = null;
        this.TransitionEvaluation = null;
        this.TabColor = null;
        return this;
    }
    window["Asc"].typeOf = typeOf;
    window["Asc"].getProperty = getProperty;
    window["Asc"].lastIndexOf = lastIndexOf;
    window["Asc"].search = search;
    window["Asc"].round = round;
    window["Asc"].floor = floor;
    window["Asc"].ceil = ceil;
    window["Asc"].incDecFonSize = incDecFonSize;
    window["Asc"].inherit = inherit;
    window["Asc"].outputDebugStr = outputDebugStr;
    window["Asc"].isEqual = isEqual;
    window["Asc"].clone = clone;
    window["Asc"].profileTime = profileTime;
    window["Asc"].isNumber = isNumber;
    window["Asc"].trim = trim;
    window["Asc"].Range = Range;
    window["Asc"].HandlersList = HandlersList;
    window["Asc"].RedoObjectParam = RedoObjectParam;
    window["Asc"]["asc_CMouseMoveData"] = window["Asc"].asc_CMouseMoveData = asc_CMouseMoveData;
    prot = asc_CMouseMoveData.prototype;
    prot["asc_getType"] = prot.asc_getType;
    prot["asc_getX"] = prot.asc_getX;
    prot["asc_getReverseX"] = prot.asc_getReverseX;
    prot["asc_getY"] = prot.asc_getY;
    prot["asc_getHyperlink"] = prot.asc_getHyperlink;
    prot["asc_getCommentIndexes"] = prot.asc_getCommentIndexes;
    prot["asc_getUserId"] = prot.asc_getUserId;
    prot["asc_getLockedObjectType"] = prot.asc_getLockedObjectType;
    window["Asc"]["asc_CHyperlink"] = window["Asc"].asc_CHyperlink = asc_CHyperlink;
    prot = asc_CHyperlink.prototype;
    prot["asc_getType"] = prot.asc_getType;
    prot["asc_getHyperlinkUrl"] = prot.asc_getHyperlinkUrl;
    prot["asc_getTooltip"] = prot.asc_getTooltip;
    prot["asc_getLocation"] = prot.asc_getLocation;
    prot["asc_getSheet"] = prot.asc_getSheet;
    prot["asc_getRange"] = prot.asc_getRange;
    prot["asc_getText"] = prot.asc_getText;
    prot["asc_setType"] = prot.asc_setType;
    prot["asc_setHyperlinkUrl"] = prot.asc_setHyperlinkUrl;
    prot["asc_setTooltip"] = prot.asc_setTooltip;
    prot["asc_setLocation"] = prot.asc_setLocation;
    prot["asc_setSheet"] = prot.asc_setSheet;
    prot["asc_setRange"] = prot.asc_setRange;
    prot["asc_setText"] = prot.asc_setText;
    window["Asc"]["asc_CPageMargins"] = window["Asc"].asc_CPageMargins = asc_CPageMargins;
    prot = asc_CPageMargins.prototype;
    prot["asc_getLeft"] = prot.asc_getLeft;
    prot["asc_getRight"] = prot.asc_getRight;
    prot["asc_getTop"] = prot.asc_getTop;
    prot["asc_getBottom"] = prot.asc_getBottom;
    prot["asc_setLeft"] = prot.asc_setLeft;
    prot["asc_setRight"] = prot.asc_setRight;
    prot["asc_setTop"] = prot.asc_setTop;
    prot["asc_setBottom"] = prot.asc_setBottom;
    window["Asc"]["asc_CPageSetup"] = window["Asc"].asc_CPageSetup = asc_CPageSetup;
    prot = asc_CPageSetup.prototype;
    prot["asc_getOrientation"] = prot.asc_getOrientation;
    prot["asc_getWidth"] = prot.asc_getWidth;
    prot["asc_getHeight"] = prot.asc_getHeight;
    prot["asc_setOrientation"] = prot.asc_setOrientation;
    prot["asc_setWidth"] = prot.asc_setWidth;
    prot["asc_setHeight"] = prot.asc_setHeight;
    window["Asc"]["asc_CPageOptions"] = window["Asc"].asc_CPageOptions = asc_CPageOptions;
    prot = asc_CPageOptions.prototype;
    prot["asc_getPageMargins"] = prot.asc_getPageMargins;
    prot["asc_getPageSetup"] = prot.asc_getPageSetup;
    prot["asc_getGridLines"] = prot.asc_getGridLines;
    prot["asc_getHeadings"] = prot.asc_getHeadings;
    prot["asc_setPageMargins"] = prot.asc_setPageMargins;
    prot["asc_setPageSetup"] = prot.asc_setPageSetup;
    prot["asc_setGridLines"] = prot.asc_setGridLines;
    prot["asc_setHeadings"] = prot.asc_setHeadings;
    window["Asc"].CPagePrint = CPagePrint;
    window["Asc"].CPrintPagesData = CPrintPagesData;
    window["Asc"]["asc_CAdjustPrint"] = window["Asc"].asc_CAdjustPrint = asc_CAdjustPrint;
    prot = asc_CAdjustPrint.prototype;
    prot["asc_getPrintType"] = prot.asc_getPrintType;
    prot["asc_getLayoutPageType"] = prot.asc_getLayoutPageType;
    prot["asc_setPrintType"] = prot.asc_setPrintType;
    prot["asc_setLayoutPageType"] = prot.asc_setLayoutPageType;
    window["Asc"].asc_CLockInfo = asc_CLockInfo;
    window["Asc"].asc_CCollaborativeRange = asc_CCollaborativeRange;
    window["Asc"]["asc_CSheetViewSettings"] = window["Asc"].asc_CSheetViewSettings = asc_CSheetViewSettings;
    prot = asc_CSheetViewSettings.prototype;
    prot["asc_getShowGridLines"] = prot.asc_getShowGridLines;
    prot["asc_getShowRowColHeaders"] = prot.asc_getShowRowColHeaders;
    prot["asc_setShowGridLines"] = prot.asc_setShowGridLines;
    prot["asc_setShowRowColHeaders"] = prot.asc_setShowRowColHeaders;
    window["Asc"]["asc_CStyleImage"] = window["Asc"].asc_CStyleImage = asc_CStyleImage;
    prot = asc_CStyleImage.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getThumbnailOffset"] = prot.asc_getThumbnailOffset;
    prot["asc_getType"] = prot.asc_getType;
    window["Asc"]["asc_CStylesPainter"] = window["Asc"].asc_CStylesPainter = asc_CStylesPainter;
    prot = asc_CStylesPainter.prototype;
    prot["asc_getStyleThumbnailWidth"] = prot.asc_getStyleThumbnailWidth;
    prot["asc_getStyleThumbnailHeight"] = prot.asc_getStyleThumbnailHeight;
    prot["asc_getDefaultStyles"] = prot.asc_getDefaultStyles;
    prot["asc_getDocStyles"] = prot.asc_getDocStyles;
    prot["asc_getDefaultStylesImage"] = prot.asc_getDefaultStylesImage;
    prot["asc_getDocStylesImage"] = prot.asc_getDocStylesImage;
    window["Asc"]["asc_CSheetPr"] = window["Asc"].asc_CSheetPr = asc_CSheetPr;
})(jQuery, window);