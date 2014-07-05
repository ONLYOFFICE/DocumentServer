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
 var debug = false;
var ScrollArrowType = {
    ARROW_TOP: 0,
    ARROW_RIGHT: 1,
    ARROW_BOTTOM: 2,
    ARROW_LEFT: 3
};
var ScrollOverType = {
    NONE: 0,
    OVER: 1,
    ACTIVE: 2
};
function GetClientWidth(elem) {
    var _w = elem.clientWidth;
    if (0 != _w) {
        return _w;
    }
    var _string_w = "" + elem.style.width;
    if (-1 < _string_w.indexOf("%")) {
        return 0;
    }
    var _intVal = parseInt(_string_w);
    if (!isNaN(_intVal) && 0 < _intVal) {
        return _intVal;
    }
    return 0;
}
function GetClientHeight(elem) {
    var _w = elem.clientHeight;
    if (0 != _w) {
        return _w;
    }
    var _string_w = "" + elem.style.height;
    if (-1 < _string_w.indexOf("%")) {
        return 0;
    }
    var _intVal = parseInt(_string_w);
    if (!isNaN(_intVal) && 0 < _intVal) {
        return _intVal;
    }
    return 0;
}
function CArrowDrawer() {
    this.Size = 16;
    this.IsRetina = false;
    this.ColorGradStart = {
        R: 69,
        G: 70,
        B: 71
    };
    this.ColorGradEnd = {
        R: 116,
        G: 117,
        B: 118
    };
    this.ColorBorder = "#929292";
    this.ColorBackNone = "#FCFCFC";
    this.ColorBackOver = "#EDEDED";
    this.ColorBackActive = "#CCCCCC";
    this.IsDrawBorderInNoneMode = false;
    this.ImageLeft = null;
    this.ImageTop = null;
    this.ImageRight = null;
    this.ImageBottom = null;
    this.InitSize = function (size, is_retina) {
        if (size == this.Size && is_retina == this.IsRetina && null != this.ImageLeft) {
            return;
        }
        this.Size = Math.max(size, 1);
        this.IsRetina = is_retina;
        if (this.IsRetina) {
            this.Size <<= 1;
        }
        this.ImageLeft = document.createElement("canvas");
        this.ImageTop = document.createElement("canvas");
        this.ImageRight = document.createElement("canvas");
        this.ImageBottom = document.createElement("canvas");
        this.ImageLeft.width = this.Size;
        this.ImageLeft.height = this.Size;
        this.ImageTop.width = this.Size;
        this.ImageTop.height = this.Size;
        this.ImageRight.width = this.Size;
        this.ImageRight.height = this.Size;
        this.ImageBottom.width = this.Size;
        this.ImageBottom.height = this.Size;
        var ctx_l = this.ImageLeft.getContext("2d");
        var ctx_t = this.ImageTop.getContext("2d");
        var ctx_r = this.ImageRight.getContext("2d");
        var ctx_b = this.ImageBottom.getContext("2d");
        var len = 5;
        if (this.Size < 5) {
            return;
        } else {
            (this.Size > 12);
        }
        len = this.Size - 8;
        if (0 == (len & 1)) {
            len += 1;
        }
        var countPart = (len + 1) >> 1;
        var plusColor = (this.ColorGradEnd.R - this.ColorGradStart.R) / countPart;
        var _data = ctx_l.createImageData(this.Size, this.Size);
        var px = _data.data;
        var _x = (this.Size - len) >> 1;
        var _y = this.Size - ((this.Size - countPart) >> 1) - 1;
        var _radx = _x + (len >> 1) + 0.5;
        var _rady = _y - (countPart >> 1) - 0.5;
        var r = this.ColorGradStart.R;
        var g = this.ColorGradStart.G;
        var b = this.ColorGradStart.B;
        while (len > 0) {
            var ind = 4 * this.Size * _y + 4 * _x;
            for (var i = 0; i < len; i++) {
                px[ind++] = r;
                px[ind++] = g;
                px[ind++] = b;
                px[ind++] = 255;
            }
            r = (r + plusColor) >> 0;
            g = (g + plusColor) >> 0;
            b = (b + plusColor) >> 0;
            _x += 1;
            _y -= 1;
            len -= 2;
        }
        ctx_t.putImageData(_data, 0, 0);
        ctx_l.translate(_radx - 1, _rady);
        ctx_l.rotate(-Math.PI / 2);
        ctx_l.translate(-_radx, -_rady);
        ctx_l.drawImage(this.ImageTop, 0, 0);
        ctx_r.translate(_radx + 2, _rady);
        ctx_r.rotate(Math.PI / 2);
        ctx_r.translate(-_radx, -_rady);
        ctx_r.drawImage(this.ImageTop, 0, 0);
        ctx_b.translate(_radx, _rady + 2);
        ctx_b.rotate(Math.PI);
        ctx_b.translate(-_radx, -_rady);
        ctx_b.drawImage(this.ImageTop, 0, 0);
        if (this.IsRetina) {
            this.Size >>= 1;
        }
    };
    this.drawArrow = function (type, mode, ctx, w, h) {
        var img = this.ImageTop;
        var x = 0;
        var y = 0;
        var is_vertical = true;
        switch (type) {
        case ScrollArrowType.ARROW_LEFT:
            is_vertical = false;
            img = this.ImageLeft;
            break;
        case ScrollArrowType.ARROW_RIGHT:
            is_vertical = false;
            x = w - this.Size;
            img = this.ImageRight;
            break;
        case ScrollArrowType.ARROW_BOTTOM:
            y = h - this.Size;
            img = this.ImageBottom;
            break;
        default:
            break;
        }
        ctx.lineWidth = 1;
        var strokeW = is_vertical ? this.Size - 2 : this.Size - 1;
        var strokeH = is_vertical ? this.Size - 1 : this.Size - 2;
        ctx.fillStyle = this.ColorBackNone;
        ctx.fillRect(x, y, this.Size, this.Size);
        ctx.beginPath();
        switch (mode) {
        case ScrollOverType.NONE:
            ctx.drawImage(img, x, y, this.Size, this.Size);
            if (this.IsDrawBorderInNoneMode) {
                ctx.strokeStyle = this.ColorBorder;
                ctx.rect(x + 0.5, y + 0.5, strokeW, strokeH);
                ctx.stroke();
            }
            break;
        case ScrollOverType.OVER:
            ctx.fillStyle = this.ColorBackOver;
            ctx.rect(x + 0.5, y + 0.5, strokeW, strokeH);
            ctx.fill();
            ctx.drawImage(img, x, y, this.Size, this.Size);
            ctx.strokeStyle = this.ColorBorder;
            ctx.rect(x + 0.5, y + 0.5, strokeW, strokeH);
            ctx.stroke();
            break;
        case ScrollOverType.ACTIVE:
            ctx.fillStyle = this.ColorBackActive;
            ctx.rect(x + 0.5, y + 0.5, strokeW, strokeH);
            ctx.fill();
            ctx.drawImage(img, x, y, this.Size, this.Size);
            ctx.strokeStyle = this.ColorBorder;
            ctx.rect(x + 0.5, y + 0.5, strokeW, strokeH);
            ctx.stroke();
            break;
        default:
            break;
        }
        ctx.beginPath();
    };
}
function ScrollObject(elemID, settings, dbg) {
    if (dbg) {
        debug = dbg;
    }
    var that = this;
    this.that = this;
    var extendSettings = function (settings1, settings2) {
        var _st = {};
        if (settings1 == null || settings1 == undefined) {
            return settings2;
        } else {
            for (var _item in settings1) {
                if (typeof settings1[_item] === "object") {
                    _st[_item] = extendSettings(_st, settings1[_item]);
                } else {
                    _st[_item] = settings1[_item];
                }
            }
        }
        for (var _item in settings2) {
            if (!_st.hasOwnProperty(_item)) {
                if (typeof settings2[_item] === "object") {
                    _st[_item] = extendSettings(_st, settings2[_item]);
                } else {
                    _st[_item] = settings2[_item];
                }
            }
        }
        return _st;
    };
    var scrollSettings = {
        showArrows: false,
        screenW: -1,
        screenH: -1,
        scrollerMinHeight: 20,
        scrollerMaxHeight: 99999,
        scrollerMinWidth: 20,
        scrollerMaxWidth: 99999,
        initialDelay: 300,
        arrowRepeatFreq: 50,
        trackClickRepeatFreq: 70,
        scrollPagePercent: 1 / 8,
        arrowDim: 16,
        scrollerColor: "#D3D3D3",
        scrollBackgroundColor: "#fff",
        vscrollStep: 10,
        hscrollStep: 10,
        wheelScrollLines: 1
    };
    this.settings = extendSettings(settings, scrollSettings);
    this.ArrowDrawer = new CArrowDrawer();
    this.ArrowDrawer.ColorBackNone = this.settings.scrollBackgroundColor;
    this.mouseUp = false;
    this.mouseDown = false;
    this.scrollerMouseDown = false;
    this.scrollerMouseUp = false;
    this.moveble = false;
    this.lock = false;
    this.scrollTimeout = null;
    this.StartMousePosition = {
        x: 0,
        y: 0
    };
    this.EndMousePosition = {
        x: 0,
        y: 0
    };
    this.dragMinY = 0;
    this.dragMaxY = 0;
    this.scrollVCurrentY = 0;
    this.scrollHCurrentX = 0;
    this.arrowPosition = 0;
    this.verticalTrackHeight = 0;
    this.horizontalTrackWidth = 0;
    this.paneHeight = 0;
    this.paneWidth = 0;
    this.maxScrollY = 2000;
    this.maxScrollX = 2000;
    this.scrollCoeff = 0;
    this.scroller = {
        x: 0,
        y: 1,
        h: 0,
        w: 0
    };
    this.canvas = null;
    this.context = null;
    this.eventListeners = [];
    this.nonePointer = false;
    this.IsRetina = false;
    this.canvasW = 1;
    this.canvasH = 1;
    this.ScrollOverType1 = -1;
    this.ScrollOverType2 = -1;
    if (window.devicePixelRatio == 2) {
        this.IsRetina = true;
    }
    this._init(elemID);
}
ScrollObject.prototype = {
    _init: function (elemID) {
        if (!elemID) {
            return false;
        }
        var holder = document.getElementById(elemID);
        if (holder.getElementsByTagName("canvas").length == 0) {
            this.canvas = holder.appendChild(document.createElement("CANVAS"));
        } else {
            this.canvas = holder.children[1];
        }
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.that = this;
        this.canvas.style.zIndex = 100;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        if (navigator.userAgent.toLowerCase().indexOf("webkit") != -1) {
            this.canvas.style.webkitUserSelect = "none";
        }
        this.context = this.canvas.getContext("2d");
        if (!this.IsRetina) {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            this.context.setTransform(2, 0, 0, 2, 0, 0);
        }
        if (this.settings.showArrows) {
            this.arrowPosition = this.settings.arrowDim;
        }
        this._setDimension(holder.clientHeight, holder.clientWidth);
        this.maxScrollY = holder.firstElementChild.clientHeight - this.settings.screenH > 0 ? holder.firstElementChild.clientHeight - this.settings.screenH : 0;
        this.maxScrollX = holder.firstElementChild.clientWidth - this.settings.screenW > 0 ? holder.firstElementChild.clientWidth - this.settings.screenW : 0;
        this.isVerticalScroll = holder.firstElementChild.clientHeight / Math.max(this.canvasH, 1) > 1;
        this.isHorizontalScroll = holder.firstElementChild.clientWidth / Math.max(this.canvasW, 1) > 1;
        this._setScrollerHW();
        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;
        this.RecalcScroller();
        this.canvas.onmousemove = this.evt_mousemove;
        this.canvas.onmouseout = this.evt_mouseout;
        this.canvas.onmouseup = this.evt_mouseup;
        this.canvas.onmousedown = this.evt_mousedown;
        this.canvas.onmousewheel = this.evt_mousewheel;
        var _that = this;
        this.canvas.ontouchstart = function (e) {
            _that.evt_mousedown(e.touches[0]);
            return false;
        };
        this.canvas.ontouchmove = function (e) {
            _that.evt_mousemove(e.touches[0]);
            return false;
        };
        this.canvas.ontouchend = function (e) {
            _that.evt_mouseup(e.changedTouches[0]);
            return false;
        };
        if (this.canvas.addEventListener) {
            this.canvas.addEventListener("DOMMouseScroll", this.evt_mousewheel, false);
        }
        this._draw();
        this._drawArrow();
        return true;
    },
    getMousePosition: function (evt) {
        var obj = this.canvas;
        var top = 0;
        var left = 0;
        while (obj && obj.tagName != "BODY") {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x: mouseX,
            y: mouseY
        };
    },
    RecalcScroller: function (startpos) {
        if (this.isVerticalScroll) {
            if (this.settings.showArrows) {
                this.verticalTrackHeight = this.canvasH - this.arrowPosition * 2;
                this.scroller.y = this.arrowPosition + 1;
            } else {
                this.verticalTrackHeight = this.canvasH;
                this.scroller.y = 1;
            }
            var percentInViewV;
            percentInViewV = (this.maxScrollY + this.paneHeight) / this.paneHeight;
            this.scroller.h = Math.ceil(1 / percentInViewV * this.verticalTrackHeight);
            if (this.scroller.h < this.settings.scrollerMinHeight) {
                this.scroller.h = this.settings.scrollerMinHeight;
            } else {
                if (this.scroller.h > this.settings.scrollerMaxHeight) {
                    this.scroller.h = this.settings.scrollerMaxHeight;
                }
            }
            this.scrollCoeff = this.maxScrollY / Math.max(1, this.paneHeight - this.scroller.h);
            if (startpos) {
                this.scroller.y = startpos / this.scrollCoeff + this.arrowPosition;
            }
            this.dragMaxY = this.canvasH - this.arrowPosition - this.scroller.h;
            this.dragMinY = this.arrowPosition;
        }
        if (this.isHorizontalScroll) {
            if (this.settings.showArrows) {
                this.horizontalTrackWidth = this.canvasW - this.arrowPosition * 2;
                this.scroller.x = this.arrowPosition + 1;
            } else {
                this.horizontalTrackWidth = this.canvasW;
                this.scroller.x = 1;
            }
            var percentInViewH;
            percentInViewH = (this.maxScrollX + this.paneWidth) / this.paneWidth;
            this.scroller.w = Math.ceil(1 / percentInViewH * this.horizontalTrackWidth);
            if (this.scroller.w < this.settings.scrollerMinWidth) {
                this.scroller.w = this.settings.scrollerMinWidth;
            } else {
                if (this.scroller.w > this.settings.scrollerMaxWidth) {
                    this.scroller.w = this.settings.scrollerMaxWidth;
                }
            }
            this.scrollCoeff = this.maxScrollX / Math.max(1, this.paneWidth - this.scroller.w);
            if (typeof startpos !== "undefined") {
                this.scroller.x = startpos / this.scrollCoeff + this.arrowPosition;
            }
            this.dragMaxX = this.canvasW - this.arrowPosition - this.scroller.w;
            this.dragMinX = this.arrowPosition;
        }
    },
    Repos: function (settings, bIsHorAttack, bIsVerAttack) {
        var _parentClientW = GetClientWidth(this.canvas.parentNode);
        var _parentClientH = GetClientHeight(this.canvas.parentNode);
        var _firstChildW = GetClientWidth(this.canvas.parentNode.firstElementChild);
        var _firstChildH = GetClientHeight(this.canvas.parentNode.firstElementChild);
        this._setDimension(_parentClientH, _parentClientW);
        this.maxScrollY = _firstChildH - settings.screenH > 0 ? _firstChildH - settings.screenH : 0;
        this.maxScrollX = _firstChildW - settings.screenW > 0 ? _firstChildW - settings.screenW : 0;
        this.isVerticalScroll = _firstChildH / Math.max(this.canvasH, 1) > 1 || this.isVerticalScroll || (true === bIsVerAttack);
        this.isHorizontalScroll = _firstChildW / Math.max(this.canvasW, 1) > 1 || this.isHorizontalScroll || (true === bIsHorAttack);
        this._setScrollerHW();
        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;
        this.RecalcScroller();
        if (this.isVerticalScroll) {
            this.scrollToY(this.scrollVCurrentY);
        }
        if (this.isHorizontalScroll) {
            this.scrollToX(this.scrollHCurrentX);
        }
        this._draw();
        this._drawArrow();
    },
    Reinit: function (settings, pos) {
        this._setDimension(this.canvas.parentNode.clientHeight, this.canvas.parentNode.clientWidth);
        this.maxScrollY = this.canvas.parentNode.firstElementChild.clientHeight - (settings.screenH || this.canvas.parentNode.offsetHeight) > 0 ? this.canvas.parentNode.firstElementChild.clientHeight - (settings.screenH || this.canvas.parentNode.offsetHeight) : 0;
        this.maxScrollX = this.canvas.parentNode.firstElementChild.clientWidth - (settings.screenH || this.canvas.parentNode.offsetWidth) > 0 ? this.canvas.parentNode.firstElementChild.clientWidth - (settings.screenH || this.canvas.parentNode.offsetWidth) : 0;
        this.isVerticalScroll = this.canvas.parentNode.firstElementChild.clientHeight / Math.max(this.canvasH, 1) > 1 || this.isVerticalScroll;
        this.isHorizontalScroll = this.canvas.parentNode.firstElementChild.clientWidth / Math.max(this.canvasW, 1) > 1 || this.isHorizontalScroll;
        this._setScrollerHW();
        this.paneHeight = this.canvasH - this.arrowPosition * 2;
        this.paneWidth = this.canvasW - this.arrowPosition * 2;
        this.RecalcScroller();
        this.reinit = true;
        if (this.isVerticalScroll) {
            pos !== undefined ? this.scrollByY(pos - this.scrollVCurrentY) : this.scrollToY(this.scrollVCurrentY);
        }
        if (this.isHorizontalScroll) {
            pos !== undefined ? this.scrollByX(pos - this.scrollHCurrentX) : this.scrollToX(this.scrollHCurrentX);
        }
        this.reinit = false;
        this._draw();
        this._drawArrow();
    },
    _scrollV: function (that, evt, pos, isTop, isBottom, bIsAttack) {
        if (!this.isVerticalScroll) {
            return;
        }
        if (that.scrollVCurrentY !== pos || bIsAttack === true) {
            that.scrollVCurrentY = pos;
            evt.scrollD = evt.scrollPositionY = that.scrollVCurrentY;
            evt.maxScrollY = that.maxScrollY;
            that._draw();
            that._drawArrow();
            that.handleEvents("onscrollvertical", evt);
        } else {
            if (that.scrollVCurrentY === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock) {
                evt.pos = pos;
                that.handleEvents("onscrollVEnd", evt);
            }
        }
    },
    _correctScrollV: function (that, yPos) {
        if (!this.isVerticalScroll) {
            return null;
        }
        var events = that.eventListeners["oncorrectVerticalScroll"];
        if (events) {
            if (events.length != 1) {
                return null;
            }
            return events[0].handler.apply(that, [yPos]);
        }
        return null;
    },
    _correctScrollByYDelta: function (that, delta) {
        if (!this.isVerticalScroll) {
            return null;
        }
        var events = that.eventListeners["oncorrectVerticalScrollDelta"];
        if (events) {
            if (events.length != 1) {
                return null;
            }
            return events[0].handler.apply(that, [delta]);
        }
        return null;
    },
    _scrollH: function (that, evt, pos, isTop, isBottom) {
        if (!this.isHorizontalScroll) {
            return;
        }
        if (that.scrollHCurrentX !== pos) {
            that.scrollHCurrentX = pos;
            evt.scrollD = evt.scrollPositionX = that.scrollHCurrentX;
            evt.maxScrollX = that.maxScrollX;
            that._draw();
            that._drawArrow();
            that.handleEvents("onscrollhorizontal", evt);
        } else {
            if (that.scrollHCurrentX === pos && pos > 0 && !this.reinit && !this.moveble && !this.lock) {
                evt.pos = pos;
                that.handleEvents("onscrollHEnd", evt);
            }
        }
    },
    scrollByY: function (delta, bIsAttack) {
        if (!this.isVerticalScroll) {
            return;
        }
        var result = this._correctScrollByYDelta(this, delta);
        if (result != null && result.isChange === true) {
            delta = result.Pos;
        }
        var destY = this.scrollVCurrentY + delta,
        isTop = false,
        isBottom = false,
        vend = false;
        if (destY < 0) {
            destY = 0;
            isTop = true;
            isBottom = false;
        } else {
            if (destY > this.maxScrollY) {
                for (var c = 50; destY > this.maxScrollY && c > 0; --c) {
                    this.handleEvents("onscrollVEnd", {});
                    vend = true;
                }
                if (destY > this.maxScrollY) {
                    destY = this.maxScrollY;
                }
                isTop = false,
                isBottom = true;
            }
        }
        this.scroller.y = destY / Math.max(1, this.scrollCoeff) + this.arrowPosition;
        if (this.scroller.y < this.dragMinY) {
            this.scroller.y = this.dragMinY + 1;
        } else {
            if (this.scroller.y > this.dragMaxY) {
                this.scroller.y = this.dragMaxY;
            }
        }
        if (vend) {
            this.moveble = true;
        }
        this._scrollV(this, {},
        destY, isTop, isBottom, bIsAttack);
        if (vend) {
            this.moveble = false;
        }
    },
    scrollToY: function (destY) {
        if (!this.isVerticalScroll) {
            return;
        }
        this.scroller.y = destY / Math.max(1, this.scrollCoeff) + this.arrowPosition;
        if (this.scroller.y < this.dragMinY) {
            this.scroller.y = this.dragMinY + 1;
        } else {
            if (this.scroller.y > this.dragMaxY) {
                this.scroller.y = this.dragMaxY;
            }
        }
        this._scrollV(this, {},
        destY, false, false);
    },
    scrollByX: function (delta) {
        if (!this.isHorizontalScroll) {
            return;
        }
        var destX = this.scrollHCurrentX + delta,
        isTop = false,
        isBottom = false,
        hend = false;
        if (destX < 0) {
            destX = 0;
            isTop = true;
            isBottom = false;
        } else {
            if (destX > this.maxScrollX) {
                for (var c = 50; destX > this.maxScrollX && c > 0; --c) {
                    this.handleEvents("onscrollHEnd", {});
                    hend = true;
                }
                if (destX > this.maxScrollX) {
                    destX = this.maxScrollX;
                }
                isTop = false,
                isBottom = true;
            }
        }
        this.scroller.x = destX / Math.max(1, this.scrollCoeff) + this.arrowPosition;
        if (this.scroller.x < this.dragMinX) {
            this.scroller.x = this.dragMinX + 1;
        } else {
            if (this.scroller.x > this.dragMaxX) {
                this.scroller.x = this.dragMaxX;
            }
        }
        if (hend) {
            this.moveble = true;
        }
        this._scrollH(this, {},
        destX, isTop, isBottom);
        if (hend) {
            this.moveble = true;
        }
    },
    scrollToX: function (destX) {
        if (!this.isHorizontalScroll) {
            return;
        }
        this.scroller.x = destX / Math.max(1, this.scrollCoeff) + this.arrowPosition;
        if (this.scroller.x < this.dragMinX) {
            this.scroller.x = this.dragMinX + 1;
        } else {
            if (this.scroller.x > this.dragMaxX) {
                this.scroller.x = this.dragMaxX;
            }
        }
        this._scrollH(this, {},
        destX, false, false);
    },
    scrollTo: function (destX, destY) {
        this.scrollToX(destX);
        this.scrollToY(destY);
    },
    scrollBy: function (deltaX, deltaY) {
        this.scrollByX(deltaX);
        this.scrollByY(deltaY);
    },
    _clearContent: function () {
        this.context.clearRect(0, 0, this.canvasW, this.canvasH);
    },
    _draw: function () {
        this.context.beginPath();
        if (this.isVerticalScroll) {
            var _y = this.ArrowDrawer.Size;
            var _h = this.canvasH - (_y << 1);
            if (_h > 0) {
                this.context.rect(0, _y, this.canvasW, _h);
            }
        } else {
            if (this.isHorizontalScroll) {
                var _x = this.ArrowDrawer.Size;
                var _w = this.canvasW - (_x << 1);
                if (_w > 0) {
                    this.context.rect(_x, 0, _w, this.canvasH);
                }
            }
        }
        this.context.fillStyle = this.settings.scrollBackgroundColor;
        this.context.fill();
        this.context.beginPath();
        if (this.isVerticalScroll && this.maxScrollY != 0) {
            var _y = this.scroller.y >> 0;
            if (_y < this.ArrowDrawer.Size) {
                _y = this.ArrowDrawer.Size;
            }
            var _b = (this.scroller.y + this.scroller.h) >> 0;
            if (_b > (this.canvasH - this.ArrowDrawer.Size - 2)) {
                _b = this.canvasH - this.ArrowDrawer.Size - 2;
            }
            if (_b > _y) {
                this.context.rect(0.5, _y + 0.5, this.canvasW - 2, _b - _y + 1);
            }
        } else {
            if (this.isHorizontalScroll && this.maxScrollX != 0) {
                var _x = this.scroller.x >> 0;
                if (_x < this.ArrowDrawer.Size) {
                    _x = this.ArrowDrawer.Size;
                }
                var _r = (this.scroller.x + this.scroller.w) >> 0;
                if (_r > (this.canvasW - this.ArrowDrawer.Size - 2)) {
                    _r = this.canvasW - this.ArrowDrawer.Size - 2;
                }
                if (_r > _x) {
                    this.context.rect(_x + 0.5, 0.5, _r - _x + 1, this.canvasH - 2);
                }
            }
        }
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#7F7F7F";
        this.context.fillStyle = this.settings.scrollerColor;
        this.context.fill();
        this.context.stroke();
    },
    _setDimension: function (h, w) {
        if (w == this.canvasW && h == this.canvasH) {
            return;
        }
        this.ScrollOverType1 = -1;
        this.ScrollOverType2 = -1;
        this.canvasW = w;
        this.canvasH = h;
        if (!this.IsRetina) {
            this.canvas.height = h;
            this.canvas.width = w;
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            this.canvas.height = h << 1;
            this.canvas.width = w << 1;
            this.context.setTransform(2, 0, 0, 2, 0, 0);
        }
    },
    _setScrollerHW: function () {
        if (this.isVerticalScroll) {
            this.scroller.x = 0;
            this.scroller.w = this.canvasW - 1;
            this.ArrowDrawer.InitSize(this.canvasW, this.IsRetina);
        } else {
            if (this.isHorizontalScroll) {
                this.scroller.y = 0;
                this.scroller.h = this.canvasH - 1;
                this.ArrowDrawer.InitSize(this.canvasH, this.IsRetina);
            }
        }
    },
    _MouseHoverOnScroller: function (mp) {
        if (mp.x >= this.scroller.x && mp.x <= this.scroller.x + this.scroller.w && mp.y >= this.scroller.y && mp.y <= this.scroller.y + this.scroller.h) {
            return true;
        } else {
            return false;
        }
    },
    _MouseHoverOnArrowUp: function (mp) {
        if (this.isVerticalScroll) {
            if (mp.x >= 0 && mp.x <= this.canvasW && mp.y >= 0 && mp.y <= this.settings.arrowDim) {
                return true;
            } else {
                return false;
            }
        }
        if (this.isHorizontalScroll) {
            if (mp.x >= 0 && mp.x <= this.settings.arrowDim && mp.y >= 0 && mp.y <= this.canvasH) {
                return true;
            } else {
                return false;
            }
        }
    },
    _MouseHoverOnArrowDown: function (mp) {
        if (this.isVerticalScroll) {
            if (mp.x >= 0 && mp.x <= this.canvasW && mp.y >= this.canvasH - this.settings.arrowDim && mp.y <= this.canvasH) {
                return true;
            } else {
                return false;
            }
        }
        if (this.isHorizontalScroll) {
            if (mp.x >= this.canvasW - this.settings.arrowDim && mp.x <= this.canvasW && mp.y >= 0 && mp.y <= this.canvasH) {
                return true;
            } else {
                return false;
            }
        }
    },
    _drawArrow: function (type) {
        if (this.settings.showArrows) {
            var w = this.canvasW;
            var h = this.canvasH;
            if (this.isVerticalScroll) {
                switch (type) {
                case 0:
                    if (ScrollOverType.OVER != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.OVER;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                case 1:
                    if (ScrollOverType.ACTIVE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.ACTIVE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                case 2:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.OVER != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.OVER;
                    }
                    break;
                case 3:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.ACTIVE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.ACTIVE;
                    }
                    break;
                default:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                }
            }
            if (this.isHorizontalScroll) {
                switch (type) {
                case 0:
                    if (ScrollOverType.OVER != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.OVER;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                case 1:
                    if (ScrollOverType.ACTIVE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.ACTIVE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                case 2:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.OVER != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.OVER;
                    }
                    break;
                case 3:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.ACTIVE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.ACTIVE;
                    }
                    break;
                default:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                }
            }
        }
    },
    _arrowDownMouseDown: function () {
        var that = this,
        scrollTimeout, isFirst = true,
        doScroll = function () {
            if (that.isVerticalScroll) {
                that.scrollByY(that.settings.vscrollStep);
            } else {
                if (that.isHorizontalScroll) {
                    that.scrollByX(that.settings.hscrollStep);
                }
            }
            that._drawArrow(3);
            scrollTimeout = setTimeout(doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq);
            isFirst = false;
        };
        doScroll();
        this.bind("mouseup.main mouseout", function () {
            scrollTimeout && clearTimeout(scrollTimeout);
            scrollTimeout = null;
        });
    },
    _arrowUpMouseDown: function () {
        var that = this,
        scrollTimeout, isFirst = true,
        doScroll = function () {
            if (that.isVerticalScroll) {
                that.scrollByY(-that.settings.vscrollStep);
            } else {
                if (that.isHorizontalScroll) {
                    that.scrollByX(-that.settings.hscrollStep);
                }
            }
            that._drawArrow(1);
            scrollTimeout = setTimeout(doScroll, isFirst ? that.settings.initialDelay : that.settings.arrowRepeatFreq);
            isFirst = false;
        };
        doScroll();
        this.bind("mouseup.main mouseout", function () {
            scrollTimeout && clearTimeout(scrollTimeout);
            scrollTimeout = null;
        });
    },
    getCurScrolledX: function () {
        return this.scrollHCurrentX;
    },
    getCurScrolledY: function () {
        return this.scrollVCurrentY;
    },
    getMaxScrolledY: function () {
        return this.maxScrollY;
    },
    getMaxScrolledX: function () {
        return this.maxScrollX;
    },
    evt_mousemove: function (e) {
        var evt = e || windows.event;
        var mousePos = this.that.getMousePosition(evt);
        this.that.EndMousePosition.x = mousePos.x;
        this.that.EndMousePosition.y = mousePos.y;
        var downHover = this.that._MouseHoverOnArrowDown(mousePos);
        var upHover = this.that._MouseHoverOnArrowUp(mousePos);
        var scrollerHover = this.that._MouseHoverOnScroller(mousePos);
        if (scrollerHover) {
            this.that.canvas.style.cursor = "pointer";
        } else {
            if (this.that.settings.showArrows && (downHover || upHover)) {
                this.that.canvas.style.cursor = "pointer";
                if (upHover && this.that.settings.showArrows && !this.that.mouseDownArrow && !this.that.nonePointer) {
                    this.that._drawArrow(0);
                    this.that.nonePointer = true;
                }
                if (downHover && this.that.settings.showArrows && !this.that.mouseDownArrow && !this.that.nonePointer) {
                    this.that._drawArrow(2);
                    this.that.nonePointer = true;
                }
            } else {
                this.that.canvas.style.cursor = "default";
                if (this.that.nonePointer) {
                    this.that._drawArrow();
                    this.that.nonePointer = false;
                }
            }
        }
        if (this.that.mouseDown && this.that.scrollerMouseDown) {
            this.that.moveble = true;
        } else {
            this.that.moveble = false;
        }
        if (this.that.isVerticalScroll) {
            if (this.that.moveble && this.that.scrollerMouseDown) {
                var isTop = false,
                isBottom = false;
                var _dlt = this.that.EndMousePosition.y - this.that.StartMousePosition.y;
                if (this.that.EndMousePosition.y == this.that.StartMousePosition.y) {
                    return;
                } else {
                    if (this.that.EndMousePosition.y < this.that.arrowPosition) {
                        this.that.EndMousePosition.y = this.that.arrowPosition;
                        _dlt = 0;
                        this.that.scroller.y = this.that.arrowPosition;
                    } else {
                        if (this.that.EndMousePosition.y > this.that.canvasH - this.that.arrowPosition) {
                            this.that.EndMousePosition.y = this.that.canvasH - this.that.arrowPosition;
                            _dlt = 0;
                            this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
                        } else {
                            if ((_dlt > 0 && this.that.scroller.y + _dlt + this.that.scroller.h <= this.that.canvasH - this.that.arrowPosition) || (_dlt < 0 && this.that.scroller.y + _dlt >= this.that.arrowPosition)) {
                                this.that.scroller.y += _dlt;
                            }
                        }
                    }
                }
                var destY = (this.that.scroller.y - this.that.arrowPosition) * this.that.scrollCoeff;
                var result = this.that._correctScrollV(this.that, destY);
                if (result != null && result.isChange === true) {
                    destY = result.Pos;
                }
                this.that._scrollV(this.that, evt, destY, isTop, isBottom);
                this.that.moveble = false;
                this.that.StartMousePosition.x = this.that.EndMousePosition.x;
                this.that.StartMousePosition.y = this.that.EndMousePosition.y;
            }
        } else {
            if (this.that.isHorizontalScroll) {
                if (this.that.moveble && this.that.scrollerMouseDown) {
                    var isTop = false,
                    isBottom = false;
                    var _dlt = this.that.EndMousePosition.x - this.that.StartMousePosition.x;
                    if (this.that.EndMousePosition.x == this.that.StartMousePosition.x) {
                        return;
                    } else {
                        if (this.that.EndMousePosition.x < this.that.arrowPosition) {
                            this.that.EndMousePosition.x = this.that.arrowPosition;
                            _dlt = 0;
                            this.that.scroller.x = this.that.arrowPosition;
                        } else {
                            if (this.that.EndMousePosition.x > this.that.canvasW - this.that.arrowPosition) {
                                this.that.EndMousePosition.x = this.that.canvasW - this.that.arrowPosition;
                                _dlt = 0;
                                this.that.scroller.x = this.that.canvasW - this.that.arrowPosition - this.that.scroller.w;
                            } else {
                                if ((_dlt > 0 && this.that.scroller.x + _dlt + this.that.scroller.w <= this.that.canvasW - this.that.arrowPosition) || (_dlt < 0 && this.that.scroller.x + _dlt >= this.that.arrowPosition)) {
                                    this.that.scroller.x += _dlt;
                                }
                            }
                        }
                    }
                    var destX = (this.that.scroller.x - this.that.arrowPosition) * this.that.scrollCoeff;
                    this.that._scrollH(this.that, evt, destX, isTop, isBottom);
                    this.that.moveble = false;
                    this.that.StartMousePosition.x = this.that.EndMousePosition.x;
                    this.that.StartMousePosition.y = this.that.EndMousePosition.y;
                }
            }
        }
    },
    evt_mouseout: function (e) {
        var evt = e || windows.event;
        if (this.that.settings.showArrows) {
            this.that.mouseDownArrow = false;
            if (this.that.nonePointer) {
                this.that._drawArrow();
                this.that.nonePointer = false;
            }
            this.that.handleEvents("onmouseout", evt);
        }
    },
    evt_mouseup: function (e) {
        var evt = e || windows.event;
        var mousePos = this.that.getMousePosition(evt);
        this.that.scrollTimeout && clearTimeout(this.that.scrollTimeout);
        this.that.scrollTimeout = null;
        if (!this.that.scrollerMouseDown) {
            if (this.that.settings.showArrows && this.that._MouseHoverOnArrowDown(mousePos)) {
                this.that.handleEvents("onmouseup", evt);
                this.that._drawArrow(2);
            } else {
                if (this.that.settings.showArrows && this.that._MouseHoverOnArrowUp(mousePos)) {
                    this.that.handleEvents("onmouseup", evt);
                    this.that._drawArrow(0);
                }
            }
        } else {
            this.that.mouseDown = false;
            this.that.mouseUp = true;
            this.that.scrollerMouseDown = false;
            this.that.mouseDownArrow = false;
        }
        if (this.that.onLockMouse && this.that.offLockMouse) {
            this.that.offLockMouse(evt);
        }
        this.that.handleEvents("onmouseup", evt);
    },
    evt_mousedown: function (e) {
        var evt = e || windows.event;
        var mousePos = this.that.getMousePosition(evt);
        var downHover = this.that._MouseHoverOnArrowDown(mousePos);
        var upHover = this.that._MouseHoverOnArrowUp(mousePos);
        if (this.that.settings.showArrows && downHover) {
            this.that.mouseDownArrow = true;
            this.that._arrowDownMouseDown();
        } else {
            if (this.that.settings.showArrows && upHover) {
                this.that.mouseDownArrow = true;
                this.that._arrowUpMouseDown();
            } else {
                this.that.mouseDown = true;
                this.that.mouseUp = false;
                if (this.that._MouseHoverOnScroller(mousePos)) {
                    this.that.scrollerMouseUp = false;
                    this.that.scrollerMouseDown = true;
                    if (this.that.onLockMouse) {
                        this.that.onLockMouse(evt);
                    }
                    this.that.StartMousePosition.x = mousePos.x;
                    this.that.StartMousePosition.y = mousePos.y;
                } else {
                    if (this.that.isVerticalScroll) {
                        var _tmp = this,
                        direction = mousePos.y - this.that.scroller.y - this.that.scroller.h / 2,
                        step = this.that.paneHeight * this.that.settings.scrollPagePercent,
                        verticalDragPosition = this.that.scroller.y,
                        isFirst = true,
                        doScroll = function () {
                            _tmp.that.lock = true;
                            if (direction > 0) {
                                if (_tmp.that.scroller.y + _tmp.that.scroller.h / 2 + step < mousePos.y) {
                                    _tmp.that.scrollByY(step * _tmp.that.scrollCoeff);
                                } else {
                                    var _step = Math.abs(_tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y);
                                    _tmp.that.scrollByY(_step * _tmp.that.scrollCoeff);
                                    cancelClick();
                                    return;
                                }
                            } else {
                                if (direction < 0) {
                                    if (_tmp.that.scroller.y + _tmp.that.scroller.h / 2 - step > mousePos.y) {
                                        _tmp.that.scrollByY(-step * _tmp.that.scrollCoeff);
                                    } else {
                                        var _step = Math.abs(_tmp.that.scroller.y + _tmp.that.scroller.h / 2 - mousePos.y);
                                        _tmp.that.scrollByY(-_step * _tmp.that.scrollCoeff);
                                        cancelClick();
                                        return;
                                    }
                                }
                            }
                            _tmp.that.scrollTimeout = setTimeout(doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq);
                            isFirst = false;
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout(_tmp.that.scrollTimeout);
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind("mouseup.main", cancelClick);
                            _tmp.that.lock = false;
                        };
                        doScroll();
                        this.that.bind("mouseup.main", cancelClick);
                    }
                    if (this.that.isHorizontalScroll) {
                        var _tmp = this,
                        direction = mousePos.x - this.that.scroller.x - this.that.scroller.w / 2,
                        step = this.that.paneWidth * this.that.settings.scrollPagePercent,
                        horizontalDragPosition = this.that.scroller.x,
                        isFirst = true,
                        doScroll = function () {
                            _tmp.that.lock = true;
                            if (direction > 0) {
                                if (_tmp.that.scroller.x + _tmp.that.scroller.w / 2 + step < mousePos.x) {
                                    _tmp.that.scrollByX(step * _tmp.that.scrollCoeff);
                                } else {
                                    var _step = Math.abs(_tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x);
                                    _tmp.that.scrollByX(_step * _tmp.that.scrollCoeff);
                                    cancelClick();
                                    return;
                                }
                            } else {
                                if (direction < 0) {
                                    if (_tmp.that.scroller.x + _tmp.that.scroller.w / 2 - step > mousePos.x) {
                                        _tmp.that.scrollByX(-step * _tmp.that.scrollCoeff);
                                    } else {
                                        var _step = Math.abs(_tmp.that.scroller.x + _tmp.that.scroller.w / 2 - mousePos.x);
                                        _tmp.that.scrollByX(-_step * _tmp.that.scrollCoeff);
                                        cancelClick();
                                        return;
                                    }
                                }
                            }
                            _tmp.that.scrollTimeout = setTimeout(doScroll, isFirst ? _tmp.that.settings.initialDelay : _tmp.that.settings.trackClickRepeatFreq);
                            isFirst = false;
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout(_tmp.that.scrollTimeout);
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind("mouseup.main", cancelClick);
                            _tmp.that.lock = false;
                        };
                        doScroll();
                        this.that.bind("mouseup.main", cancelClick);
                    }
                }
            }
        }
    },
    evt_mousewheel: function (e) {
        var evt = e || windows.event,
        delta = 1;
        if (this.that.isHorizontalScroll) {
            return;
        }
        var mp = {},
        isTop = false,
        isBottom = false;
        if (undefined != evt.wheelDelta) {
            delta = (evt.wheelDelta > 0) ? -this.that.settings.vscrollStep : this.that.settings.vscrollStep;
        } else {
            delta = (evt.detail > 0) ? this.that.settings.vscrollStep : -this.that.settings.vscrollStep;
        }
        delta *= this.that.settings.wheelScrollLines;
        this.that.scroller.y += delta;
        if (this.that.scroller.y < 0) {
            this.that.scroller.y = 0;
            isTop = true,
            isBottom = false;
        } else {
            if (this.that.scroller.y + this.that.scroller.h > this.that.canvasH) {
                this.that.scroller.y = this.that.canvasH - this.that.arrowPosition - this.that.scroller.h;
                isTop = false,
                isBottom = true;
            }
        }
        this.that.scrollByY(delta);
    },
    evt_click: function (e) {
        var evt = e || windows.event;
        var mousePos = this.that.getMousePosition(evt);
        if (this.that.isHorizontalScroll) {
            if (mousePos.x > this.arrowPosition && mousePos.x < this.that.canvasW - this.that.arrowPosition) {
                if (this.that.scroller.x > mousePos.x) {
                    this.that.scrollByX(-this.that.settings.vscrollStep);
                }
                if (this.that.scroller.x < mousePos.x && this.that.scroller.x + this.that.scroller.w > mousePos.x) {
                    return false;
                }
                if (this.that.scroller.x + this.that.scroller.w < mousePos.x) {
                    this.that.scrollByX(this.that.settings.hscrollStep);
                }
            }
        }
        if (this.that.isVerticalScroll) {
            if (mousePos.y > this.that.arrowPosition && mousePos.y < this.that.canvasH - this.that.arrowPosition) {
                if (this.that.scroller.y > mousePos.y) {
                    this.that.scrollByY(-this.that.settings.vscrollStep);
                }
                if (this.that.scroller.y < mousePos.y && this.that.scroller.y + this.that.scroller.h > mousePos.y) {
                    return false;
                }
                if (this.that.scroller.y + this.that.scroller.h < mousePos.y) {
                    this.that.scrollByY(this.that.settings.hscrollStep);
                }
            }
        }
    },
    bind: function (typesStr, handler) {
        var types = typesStr.split(" ");
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf("touch") == -1) ? "on" + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            var name = parts.length > 1 ? parts[1] : "";
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler
            });
        }
    },
    unbind: function (typesStr) {
        var types = typesStr.split(" ");
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf("touch") == -1) ? "on" + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            if (this.eventListeners[baseEvent] && parts.length > 1) {
                var name = parts[1];
                for (var i = 0; i < this.eventListeners[baseEvent].length; i++) {
                    if (this.eventListeners[baseEvent][i].name == name) {
                        this.eventListeners[baseEvent].splice(i, 1);
                        if (this.eventListeners[baseEvent].length === 0) {
                            this.eventListeners[baseEvent] = undefined;
                        }
                        break;
                    }
                }
            } else {
                this.eventListeners[baseEvent] = undefined;
            }
        }
    },
    handleEvents: function (eventType, evt, p) {
        var that = this;
        function handle(obj) {
            var el = obj.eventListeners;
            if (el[eventType]) {
                var events = el[eventType];
                for (var i = 0; i < events.length; i++) {
                    events[i].handler.apply(obj, [evt]);
                }
            }
        }
        handle(that);
    }
};