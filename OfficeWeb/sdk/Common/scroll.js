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
    ACTIVE: 2,
    STABLE: 3,
    LAYER: 4
};
var ArrowStatus = {
    upLeftArrowHover_downRightArrowNonActive: 0,
    upLeftArrowActive_downRightArrowNonActive: 1,
    upLeftArrowNonActive_downRightArrowHover: 2,
    upLeftArrowNonActive_downRightArrowActive: 3,
    upLeftArrowNonActive_downRightArrowNonActive: 4,
    arrowHover: 5
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
function CArrowDrawer(settings) {
    this.Size = 16;
    this.SizeW = 16;
    this.SizeH = 16;
    this.SizeNaturalW = this.SizeW;
    this.SizeNaturalH = this.SizeH;
    this.IsRetina = false;
    function HEXTORGB(colorHEX) {
        return {
            R: parseInt(colorHEX.substring(1, 3), 16),
            G: parseInt(colorHEX.substring(3, 5), 16),
            B: parseInt(colorHEX.substring(5, 7), 16)
        };
    }
    this.ColorGradStart = [];
    this.ColorGradEnd = [];
    this.ColorGradStart[ScrollOverType.NONE] = HEXTORGB(settings && settings.arrowColor ? settings.arrowColor : "#888888");
    this.ColorGradEnd[ScrollOverType.NONE] = HEXTORGB(settings && settings.arrowColor ? settings.arrowColor : "#888888");
    this.ColorGradStart[ScrollOverType.STABLE] = HEXTORGB(settings && settings.arrowStableColor ? settings.arrowStableColor : "#888888");
    this.ColorGradEnd[ScrollOverType.STABLE] = HEXTORGB(settings && settings.arrowStableColor ? settings.arrowStableColor : "#888888");
    this.ColorGradStart[ScrollOverType.OVER] = HEXTORGB(settings && settings.arrowOverColor ? settings.arrowOverColor : "#f1f1f1");
    this.ColorGradEnd[ScrollOverType.OVER] = HEXTORGB(settings && settings.arrowOverColor ? settings.arrowOverColor : "#f1f1f1");
    this.ColorGradStart[ScrollOverType.ACTIVE] = HEXTORGB(settings && settings.arrowActiveColor ? settings.arrowActiveColor : "#f1f1f1");
    this.ColorGradEnd[ScrollOverType.ACTIVE] = HEXTORGB(settings && settings.arrowActiveColor ? settings.arrowActiveColor : "#f1f1f1");
    this.ColorBorderNone = settings && settings.arrowBorderColor ? settings.arrowBorderColor : "#cfcfcf";
    this.ColorBorderStable = settings && settings.arrowStableBorderColor ? settings.arrowStableBorderColor : "#cfcfcf";
    this.ColorBorderOver = settings && settings.arrowOverBorderColor ? settings.arrowOverBorderColor : "#cfcfcf";
    this.ColorBorderActive = settings && settings.arrowActiveBorderColor ? settings.arrowActiveBorderColor : "#848484";
    this.ColorBackNone = settings && settings.arrowBackgroundColor ? settings.arrowBackgroundColor : "#F1F1F1";
    this.ColorBackStable = settings && settings.arrowStableBackgroundColor ? settings.arrowStableBackgroundColor : "#F1F1F1";
    this.ColorBackOver = settings && settings.arrowOverBackgroundColor ? settings.arrowOverBackgroundColor : "#cfcfcf";
    this.ColorBackActive = settings && settings.arrowActiveBackgroundColor ? settings.arrowActiveBackgroundColor : "#848484";
    this.IsDrawBorderInNoneMode = false;
    this.IsDrawBorders = true;
    this.ImageLeft = null;
    this.ImageTop = null;
    this.ImageRight = null;
    this.ImageBottom = null;
    this.IsNeedInvertOnActive = settings && settings.isNeedInvertOnActive ? settings.isNeedInvertOnActive : false;
    this.lastArrowStatus1 = -1;
    this.lastArrowStatus2 = -1;
    this.startColorFadeInOutStart1 = {
        R: -1,
        G: -1,
        B: -1
    };
    this.startColorFadeInOutStart2 = {
        R: -1,
        G: -1,
        B: -1
    };
    this.fadeInTimeoutFirst = -1;
    this.fadeOutTimeoutFirst = -1;
    this.fadeInTimeout1 = -1;
    this.fadeOutTimeout1 = -1;
    this.fadeInTimeout2 = -1;
    this.fadeOutTimeout2 = -1;
    this.fadeInActive1 = false;
    this.fadeOutActive1 = false;
    this.fadeInActive2 = false;
    this.fadeOutActive2 = false;
    this.fadeInFadeOutDelay = settings.fadeInFadeOutDelay ? settings.fadeInFadeOutDelay : 30;
}
CArrowDrawer.prototype.InitSize = function (sizeW, sizeH, is_retina) {
    if ((sizeH == this.SizeH || sizeW == this.SizeW) && is_retina == this.IsRetina && null != this.ImageLeft) {
        return;
    }
    this.SizeW = Math.max(sizeW, 1);
    this.SizeH = Math.max(sizeH, 1);
    this.IsRetina = is_retina;
    this.SizeNaturalW = this.SizeW;
    this.SizeNaturalH = this.SizeH;
    if (this.IsRetina) {
        this.SizeW <<= 1;
        this.SizeH <<= 1;
        this.SizeNaturalW <<= 1;
        this.SizeNaturalH <<= 1;
    }
    this.ImageLeft = [document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas")];
    this.ImageTop = [document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas")];
    this.ImageRight = [document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas")];
    this.ImageBottom = [document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas"), document.createElement("canvas")];
    this.ImageLeft[ScrollOverType.NONE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.NONE].height = this.SizeH;
    this.ImageLeft[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.STABLE].height = this.SizeH;
    this.ImageLeft[ScrollOverType.OVER].width = this.SizeW;
    this.ImageLeft[ScrollOverType.OVER].height = this.SizeH;
    this.ImageLeft[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageLeft[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageTop[ScrollOverType.NONE].width = this.SizeW;
    this.ImageTop[ScrollOverType.NONE].height = this.SizeH;
    this.ImageTop[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageTop[ScrollOverType.STABLE].height = this.SizeH;
    this.ImageTop[ScrollOverType.OVER].width = this.SizeW;
    this.ImageTop[ScrollOverType.OVER].height = this.SizeH;
    this.ImageTop[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageTop[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageRight[ScrollOverType.NONE].width = this.SizeW;
    this.ImageRight[ScrollOverType.NONE].height = this.SizeH;
    this.ImageRight[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageRight[ScrollOverType.STABLE].height = this.SizeH;
    this.ImageRight[ScrollOverType.OVER].width = this.SizeW;
    this.ImageRight[ScrollOverType.OVER].height = this.SizeH;
    this.ImageRight[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageRight[ScrollOverType.ACTIVE].height = this.SizeH;
    this.ImageBottom[ScrollOverType.NONE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.NONE].height = this.SizeH;
    this.ImageBottom[ScrollOverType.STABLE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.STABLE].height = this.SizeH;
    this.ImageBottom[ScrollOverType.OVER].width = this.SizeW;
    this.ImageBottom[ScrollOverType.OVER].height = this.SizeH;
    this.ImageBottom[ScrollOverType.ACTIVE].width = this.SizeW;
    this.ImageBottom[ScrollOverType.ACTIVE].height = this.SizeH;
    var len = 6;
    if (this.SizeH < 6) {
        return;
    }
    if (this.IsRetina) {
        len <<= 1;
    }
    if (0 == (len & 1)) {
        len += 1;
    }
    var countPart = (len + 1) >> 1,
    plusColor,
    _data,
    px,
    _x = ((this.SizeW - len) >> 1),
    _y = this.SizeH - ((this.SizeH - countPart) >> 1),
    _radx = _x + (len >> 1),
    _rady = _y - (countPart >> 1),
    ctx_lInactive,
    ctx_tInactive,
    ctx_rInactive,
    ctx_bInactive,
    r,
    g,
    b;
    for (var index = 0; index < this.ImageTop.length; index++) {
        var __x = _x,
        __y = _y,
        _len = len;
        r = this.ColorGradStart[index].R;
        g = this.ColorGradStart[index].G;
        b = this.ColorGradStart[index].B;
        ctx_tInactive = this.ImageTop[index].getContext("2d");
        ctx_lInactive = this.ImageLeft[index].getContext("2d");
        ctx_rInactive = this.ImageRight[index].getContext("2d");
        ctx_bInactive = this.ImageBottom[index].getContext("2d");
        plusColor = (this.ColorGradEnd[index].R - this.ColorGradStart[index].R) / countPart;
        _data = ctx_tInactive.createImageData(this.SizeW, this.SizeH);
        px = _data.data;
        while (_len > 0) {
            var ind = 4 * (this.SizeW * __y + __x);
            for (var i = 0; i < _len; i++) {
                px[ind++] = r;
                px[ind++] = g;
                px[ind++] = b;
                px[ind++] = 255;
            }
            r = (r + plusColor) >> 0;
            g = (g + plusColor) >> 0;
            b = (b + plusColor) >> 0;
            __x += 1;
            __y -= 1;
            _len -= 2;
        }
        ctx_tInactive.putImageData(_data, 0, -1);
        ctx_lInactive.translate(_radx, _rady + 1);
        ctx_lInactive.rotate(-Math.PI / 2);
        ctx_lInactive.translate(-_radx, -_rady);
        ctx_lInactive.drawImage(this.ImageTop[index], 0, 0);
        ctx_rInactive.translate(_radx + 1, _rady);
        ctx_rInactive.rotate(Math.PI / 2);
        ctx_rInactive.translate(-_radx, -_rady);
        ctx_rInactive.drawImage(this.ImageTop[index], 0, 0);
        ctx_bInactive.translate(_radx + 1, _rady + 1);
        ctx_bInactive.rotate(Math.PI);
        ctx_bInactive.translate(-_radx, -_rady);
        ctx_bInactive.drawImage(this.ImageTop[index], 0, 0);
    }
    if (this.IsRetina) {
        this.SizeW >>= 1;
        this.SizeH >>= 1;
    }
};
CArrowDrawer.prototype.drawArrow = function (type, mode, ctx, w, h) {
    ctx.beginPath();
    var startColorFadeIn = _HEXTORGB_(this.ColorBackNone),
    startColorFadeOut = _HEXTORGB_(this.ColorBackOver),
    that = this,
    img = this.ImageTop[mode],
    x = 0,
    y = 0,
    is_vertical = true,
    bottomRightDelta = 1,
    xDeltaIMG = 0,
    yDeltaIMG = 0,
    xDeltaBORDER = 0.5,
    yDeltaBORDER = 1.5,
    tempIMG1 = document.createElement("canvas"),
    tempIMG2 = document.createElement("canvas");
    tempIMG1.width = this.SizeNaturalW;
    tempIMG1.height = this.SizeNaturalH;
    tempIMG2.width = this.SizeNaturalW;
    tempIMG2.height = this.SizeNaturalH;
    var ctx1 = tempIMG1.getContext("2d"),
    ctx2 = tempIMG2.getContext("2d");
    if (this.IsRetina) {
        ctx1.setTransform(2, 0, 0, 2, 0, 0);
        ctx2.setTransform(2, 0, 0, 2, 0, 0);
    }
    function fadeIn() {
        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," + that.startColorFadeInOutStart1.G + "," + that.startColorFadeInOutStart1.B + ")";
        startColorFadeIn.R -= 2;
        startColorFadeIn.G -= 2;
        startColorFadeIn.B -= 2;
        ctx1.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
        ctx1.fill();
        if (that.IsDrawBorders) {
            ctx.strokeStyle = that.ColorBorderOver;
            ctx.stroke();
        }
        ctx1.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, that.SizeW, that.SizeH);
        if (startColorFadeIn.R >= 207) {
            that.startColorFadeInOutStart1 = startColorFadeIn;
            that.fadeInTimeout = setTimeout(fadeIn, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeInTimeout);
            that.fadeInTimeout = null;
            that.fadeInActiveFirst = false;
            startColorFadeIn.R += 2;
            startColorFadeIn.G += 2;
            startColorFadeIn.B += 2;
            that.startColorFadeInOutStart1 = startColorFadeIn;
        }
    }
    function fadeOut() {
        ctx.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," + that.startColorFadeInOutStart1.G + "," + that.startColorFadeInOutStart1.B + ")";
        startColorFadeOut.R += 2;
        startColorFadeOut.G += 2;
        startColorFadeOut.B += 2;
        ctx.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
        ctx.fill();
        if (that.IsDrawBorders) {
            ctx.strokeStyle = that.ColorBorderOver;
            ctx.stroke();
        }
        ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, that.SizeW, that.SizeH);
        if (startColorFadeOut.R <= 241) {
            that.startColorFadeInOutStart1 = startColorFadeOut;
            that.fadeOutTimeout = setTimeout(fadeOut, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeOutTimeout);
            that.fadeOutTimeout = null;
            that.fadeOutActiveFirst = false;
            startColorFadeOut.R -= 2;
            startColorFadeOut.G -= 2;
            startColorFadeOut.B -= 2;
            that.startColorFadeInOutStart1 = startColorFadeOut;
        }
    }
    if (mode === null || mode === undefined) {
        mode = ScrollOverType.NONE;
    }
    switch (type) {
    case ScrollArrowType.ARROW_LEFT:
        x = 1;
        y = -1;
        is_vertical = false;
        img = this.ImageLeft[mode];
        break;
    case ScrollArrowType.ARROW_RIGHT:
        is_vertical = false;
        x = w - this.SizeW - bottomRightDelta;
        y = -1;
        img = this.ImageRight[mode];
        break;
    case ScrollArrowType.ARROW_BOTTOM:
        y = h - this.SizeH - bottomRightDelta - 1;
        img = this.ImageBottom[mode];
        break;
    default:
        y = 0;
        break;
    }
    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;
    switch (mode) {
    case ScrollOverType.NONE:
        if (this.lastArrowStatus1 == ScrollOverType.OVER) {
            clearTimeout(this.fadeInTimeout);
            this.fadeInTimeout = null;
            clearTimeout(this.fadeOutTimeout);
            this.fadeOutTimeout = null;
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
            this.fadeOutActiveFirst = true;
            fadeOut();
        } else {
            ctx.fillStyle = this.ColorBackNone;
            ctx.fillRect(x + 0, y + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.beginPath();
            ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderNone;
                ctx.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.STABLE:
        if (this.lastArrowStatus1 == ScrollOverType.OVER) {
            clearTimeout(this.fadeInTimeout);
            this.fadeInTimeout = null;
            clearTimeout(this.fadeOutTimeout);
            this.fadeOutTimeout = null;
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
            this.fadeOutActiveFirst = true;
            fadeOut();
        } else {
            ctx.fillStyle = this.ColorBackStable;
            ctx.fillRect(x + 0, y + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.beginPath();
            ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH);
            ctx.strokeStyle = this.ColorBackStable;
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderStable;
                ctx.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.OVER:
        if (this.lastArrowStatus1 == ScrollOverType.NONE || this.lastArrowStatus1 == ScrollOverType.STABLE) {
            clearTimeout(this.fadeInTimeout);
            this.fadeInTimeout = null;
            clearTimeout(this.fadeOutTimeout);
            this.fadeOutTimeout = null;
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeIn : this.startColorFadeInOutStart1;
            this.fadeInActiveFirst = true;
            fadeIn();
        } else {
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackOver;
            ctx.fillRect(x + xDeltaBORDER - 0.5, y + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
            ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderOver;
                ctx.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.ACTIVE:
        ctx.fillStyle = this.ColorBackActive;
        ctx.fillRect(x + 0, y + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
        ctx.beginPath();
        ctx.fillStyle = this.ColorBackActive;
        ctx.fillRect(x + xDeltaBORDER - 0.5, y + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
        if (!this.IsNeedInvertOnActive) {
            ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH);
        } else {
            var _ctx = img.getContext("2d");
            var _data = _ctx.getImageData(0, 0, this.SizeNaturalW, this.SizeNaturalH);
            var _data2 = _ctx.getImageData(0, 0, this.SizeNaturalW, this.SizeNaturalH);
            var _len = 4 * this.SizeNaturalW * this.SizeNaturalH;
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255;
                    _data.data[i + 1] = 255;
                    _data.data[i + 2] = 255;
                }
            }
            _ctx.putImageData(_data, 0, 0);
            ctx.drawImage(img, x + xDeltaIMG, y + yDeltaIMG, this.SizeW, this.SizeH);
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255 - _data.data[i];
                    _data.data[i + 1] = 255 - _data.data[i + 1];
                    _data.data[i + 2] = 255 - _data.data[i + 2];
                }
            }
            _ctx.putImageData(_data2, 0, 0);
            _data = null;
            _data2 = null;
        }
        if (this.IsDrawBorders) {
            ctx.strokeStyle = this.ColorBorderActive;
            ctx.rect(x + xDeltaBORDER, y + yDeltaBORDER, strokeW, strokeH);
            ctx.stroke();
        }
        break;
    default:
        break;
    }
    this.lastArrowStatus1 = mode;
};
CArrowDrawer.prototype.drawTopLeftArrow = function (type, mode, ctx, w, h) {
    clearTimeout(this.fadeInTimeout1);
    this.fadeInTimeout1 = null;
    clearTimeout(this.fadeOutTimeout1);
    this.fadeOutTimeout1 = null;
    ctx.beginPath();
    var startColorFadeIn = this.startColorFadeInOutStart1.R < 0 ? _HEXTORGB_(this.ColorBackNone) : this.startColorFadeInOutStart1,
    startColorFadeOut = this.startColorFadeInOutStart1.R < 0 ? _HEXTORGB_(this.ColorBackOver) : this.startColorFadeInOutStart1,
    that = this,
    img1 = this.ImageTop[mode],
    x1 = 0,
    y1 = 0,
    is_vertical = true,
    xDeltaIMG = 0,
    yDeltaIMG = 0,
    xDeltaBORDER = 0.5,
    yDeltaBORDER = 1.5,
    tempIMG1 = document.createElement("canvas");
    tempIMG1.width = this.SizeNaturalW;
    tempIMG1.height = this.SizeNaturalH;
    var ctx1 = tempIMG1.getContext("2d");
    if (this.IsRetina) {
        ctx1.setTransform(2, 0, 0, 2, 0, 0);
    }
    function fadeIn() {
        var ctx_piperImg, px, _len;
        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," + that.startColorFadeInOutStart1.G + "," + that.startColorFadeInOutStart1.B + ")";
        startColorFadeIn.R -= 2;
        startColorFadeIn.G -= 2;
        startColorFadeIn.B -= 2;
        ctx1.rect(0.5, 1.5, strokeW, strokeH);
        ctx1.fill();
        if (that.IsDrawBorders) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }
        ctx_piperImg = img1.getContext("2d");
        _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
        px = _data.data;
        _len = px.length;
        for (var i = 0; i < _len; i += 4) {
            if (px[i + 3] == 255) {
                px[i] += 4;
                px[i + 1] += 4;
                px[i + 2] += 4;
            }
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        ctx1.drawImage(img1, 0, 0, that.SizeW, that.SizeH);
        if (startColorFadeIn.R >= 207) {
            that.startColorFadeInOutStart1 = startColorFadeIn;
            ctx.drawImage(tempIMG1, x1 + xDeltaIMG, y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeInTimeout1 = setTimeout(fadeIn, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeInTimeout1);
            that.fadeInTimeout1 = null;
            that.fadeInActive1 = false;
            startColorFadeIn.R += 2;
            startColorFadeIn.G += 2;
            startColorFadeIn.B += 2;
            that.startColorFadeInOutStart1 = startColorFadeIn;
            ctx_piperImg = img1.getContext("2d");
            _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
            px = _data.data;
            _len = px.length;
            for (var i = 0; i < _len; i += 4) {
                if (px[i + 3] == 255) {
                    px[i] -= 4;
                    px[i + 1] -= 4;
                    px[i + 2] -= 4;
                }
            }
            ctx_piperImg.putImageData(_data, 0, 0);
        }
    }
    function fadeOut() {
        var ctx_piperImg, px, _len;
        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart1.R + "," + that.startColorFadeInOutStart1.G + "," + that.startColorFadeInOutStart1.B + ")";
        startColorFadeOut.R += 2;
        startColorFadeOut.G += 2;
        startColorFadeOut.B += 2;
        ctx1.rect(0.5, 1.5, strokeW, strokeH);
        ctx1.fill();
        if (that.IsDrawBorders) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }
        ctx_piperImg = img1.getContext("2d");
        _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
        px = _data.data;
        _len = px.length;
        for (var i = 0; i < _len; i += 4) {
            if (px[i + 3] == 255) {
                px[i] -= 4;
                px[i + 1] -= 4;
                px[i + 2] -= 4;
            }
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        ctx1.drawImage(img1, 0, 0, that.SizeW, that.SizeH);
        if (startColorFadeOut.R <= 241) {
            that.startColorFadeInOutStart1 = startColorFadeOut;
            ctx.drawImage(tempIMG1, x1 + xDeltaIMG, y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeOutTimeout1 = setTimeout(fadeOut, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeOutTimeout1);
            that.fadeOutTimeout1 = null;
            that.fadeOutActive1 = false;
            startColorFadeOut.R -= 2;
            startColorFadeOut.G -= 2;
            startColorFadeOut.B -= 2;
            that.startColorFadeInOutStart1 = startColorFadeOut;
            ctx_piperImg = img1.getContext("2d");
            _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
            px = _data.data;
            _len = px.length;
            for (var i = 0; i < _len; i += 4) {
                if (px[i + 3] == 255) {
                    px[i] += 4;
                    px[i + 1] += 4;
                    px[i + 2] += 4;
                }
            }
            ctx_piperImg.putImageData(_data, 0, 0);
        }
    }
    if (mode === null || mode === undefined) {
        mode = ScrollOverType.NONE;
    }
    switch (type) {
    case ScrollArrowType.ARROW_LEFT:
        x1 = 1;
        y1 = -1;
        is_vertical = false;
        img1 = this.ImageLeft[mode];
        break;
    default:
        y1 = 0;
        img1 = this.ImageTop[mode];
        break;
    }
    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;
    switch (mode) {
    case ScrollOverType.NONE:
        if (this.lastArrowStatus1 == ScrollOverType.OVER) {
            switch (type) {
            case ScrollArrowType.ARROW_LEFT:
                img1 = this.ImageLeft[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageTop[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
            this.fadeOutActive1 = true;
            fadeOut();
        } else {
            if (this.lastArrowStatus1 == ScrollOverType.ACTIVE) {
                var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];
                switch (type) {
                case ScrollArrowType.ARROW_LEFT:
                    im = this.ImageLeft[ScrollOverType.STABLE];
                    break;
                default:
                    im = this.ImageTop[ScrollOverType.STABLE];
                    break;
                }
                ctx_im = im.getContext("2d");
                _data = ctx_im.getImageData(0, 0, img1.width, img1.height);
                px = _data.data;
                _len = px.length;
                for (var i = 0; i < _len; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] = c.R;
                        px[i + 1] = c.G;
                        px[i + 2] = c.B;
                    }
                }
                this.startColorFadeInOutStart1 = {
                    R: -1,
                    G: -1,
                    B: -1
                };
                ctx_im.putImageData(_data, 0, 0);
            }
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackNone;
            ctx.fillRect(x1 + 0, y1 + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderNone;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.STABLE:
        if (this.lastArrowStatus1 == ScrollOverType.OVER) {
            switch (type) {
            case ScrollArrowType.ARROW_LEFT:
                img1 = this.ImageLeft[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageTop[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart1;
            this.fadeOutActive1 = true;
            fadeOut();
        } else {
            if (this.lastArrowStatus1 != ScrollOverType.STABLE) {
                var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];
                switch (type) {
                case ScrollArrowType.ARROW_LEFT:
                    im = this.ImageLeft[ScrollOverType.STABLE];
                    break;
                default:
                    im = this.ImageTop[ScrollOverType.STABLE];
                    break;
                }
                ctx_im = im.getContext("2d");
                _data = ctx_im.getImageData(0, 0, img1.width, img1.height);
                px = _data.data;
                _len = px.length;
                for (var i = 0; i < _len; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] = c.R;
                        px[i + 1] = c.G;
                        px[i + 2] = c.B;
                    }
                }
                this.startColorFadeInOutStart1 = {
                    R: -1,
                    G: -1,
                    B: -1
                };
                ctx_im.putImageData(_data, 0, 0);
            }
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackStable;
            ctx.fillRect(x1 + 0, y1 + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderStable;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.OVER:
        if (this.lastArrowStatus1 == ScrollOverType.NONE || this.lastArrowStatus1 == ScrollOverType.STABLE) {
            switch (type) {
            case ScrollArrowType.ARROW_LEFT:
                img1 = this.ImageLeft[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageTop[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus1 = mode;
            this.startColorFadeInOutStart1 = this.startColorFadeInOutStart1.R < 0 ? startColorFadeIn : this.startColorFadeInOutStart1;
            this.fadeInActive1 = true;
            fadeIn();
        } else {
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackOver;
            ctx.fillRect(x1 + xDeltaBORDER - 0.5, y1 + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderOver;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.ACTIVE:
        ctx.beginPath();
        ctx.fillStyle = this.ColorBackActive;
        ctx.fillRect(x1 + xDeltaBORDER - 0.5, y1 + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
        if (!this.IsNeedInvertOnActive) {
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
        } else {
            var _ctx = img1.getContext("2d");
            var _data = _ctx.getImageData(0, 0, this.SizeW, this.SizeH);
            var _data2 = _ctx.getImageData(0, 0, this.SizeW, this.SizeH);
            var _len = 4 * this.SizeW * this.SizeH;
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255;
                    _data.data[i + 1] = 255;
                    _data.data[i + 2] = 255;
                }
            }
            _ctx.putImageData(_data, 0, 0);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255 - _data.data[i];
                    _data.data[i + 1] = 255 - _data.data[i + 1];
                    _data.data[i + 2] = 255 - _data.data[i + 2];
                }
            }
            _ctx.putImageData(_data2, 0, 0);
            _data = null;
            _data2 = null;
        }
        if (this.IsDrawBorders) {
            ctx.strokeStyle = this.ColorBorderActive;
            ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
            ctx.stroke();
        }
        break;
    default:
        break;
    }
    this.lastArrowStatus1 = mode;
};
CArrowDrawer.prototype.drawBottomRightArrow = function (type, mode, ctx, w, h) {
    clearTimeout(this.fadeInTimeout2);
    this.fadeInTimeout2 = null;
    clearTimeout(this.fadeOutTimeout2);
    this.fadeOutTimeout2 = null;
    ctx.beginPath();
    var startColorFadeIn = this.startColorFadeInOutStart2.R < 0 ? _HEXTORGB_(this.ColorBackNone) : this.startColorFadeInOutStart2,
    startColorFadeOut = this.startColorFadeInOutStart2.R < 0 ? _HEXTORGB_(this.ColorBackOver) : this.startColorFadeInOutStart2,
    that = this,
    img1 = this.ImageTop[mode],
    x1 = 0,
    y1 = 0,
    is_vertical = true,
    bottomRightDelta = 1,
    xDeltaIMG = 0,
    yDeltaIMG = 0,
    xDeltaBORDER = 0.5,
    yDeltaBORDER = 1.5,
    tempIMG1 = document.createElement("canvas");
    tempIMG1.width = this.SizeNaturalW;
    tempIMG1.height = this.SizeNaturalH;
    var ctx1 = tempIMG1.getContext("2d");
    if (this.IsRetina) {
        ctx1.setTransform(2, 0, 0, 2, 0, 0);
    }
    function fadeIn() {
        var ctx_piperImg, px, _len;
        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart2.R + "," + that.startColorFadeInOutStart2.G + "," + that.startColorFadeInOutStart2.B + ")";
        startColorFadeIn.R -= 2;
        startColorFadeIn.G -= 2;
        startColorFadeIn.B -= 2;
        ctx1.rect(0.5, 1.5, strokeW, strokeH);
        ctx1.fill();
        if (that.IsDrawBorders) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }
        ctx_piperImg = img1.getContext("2d");
        _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
        px = _data.data;
        _len = px.length;
        for (var i = 0; i < _len; i += 4) {
            if (px[i + 3] == 255) {
                px[i] += 4;
                px[i + 1] += 4;
                px[i + 2] += 4;
            }
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        ctx1.drawImage(img1, 0, 0, that.SizeW, that.SizeH);
        if (startColorFadeIn.R >= 207) {
            that.startColorFadeInOutStart2 = startColorFadeIn;
            ctx.drawImage(tempIMG1, x1 + xDeltaIMG, y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeInTimeout2 = setTimeout(fadeIn, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeInTimeout2);
            that.fadeInTimeout2 = null;
            that.fadeInActive2 = false;
            startColorFadeIn.R += 2;
            startColorFadeIn.G += 2;
            startColorFadeIn.B += 2;
            that.startColorFadeInOutStart2 = startColorFadeIn;
            ctx_piperImg = img1.getContext("2d");
            _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
            px = _data.data;
            _len = px.length;
            for (var i = 0; i < _len; i += 4) {
                if (px[i + 3] == 255) {
                    px[i] -= 4;
                    px[i + 1] -= 4;
                    px[i + 2] -= 4;
                }
            }
            ctx_piperImg.putImageData(_data, 0, 0);
        }
    }
    function fadeOut() {
        var ctx_piperImg, px, _len;
        ctx1.fillStyle = "rgb(" + that.startColorFadeInOutStart2.R + "," + that.startColorFadeInOutStart2.G + "," + that.startColorFadeInOutStart2.B + ")";
        startColorFadeOut.R += 2;
        startColorFadeOut.G += 2;
        startColorFadeOut.B += 2;
        ctx1.rect(0.5, 1.5, strokeW, strokeH);
        ctx1.fill();
        if (that.IsDrawBorders) {
            ctx1.strokeStyle = that.ColorBorderOver;
            ctx1.stroke();
        }
        ctx_piperImg = img1.getContext("2d");
        _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
        px = _data.data;
        _len = px.length;
        for (var i = 0; i < _len; i += 4) {
            if (px[i + 3] == 255) {
                px[i] -= 4;
                px[i + 1] -= 4;
                px[i + 2] -= 4;
            }
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        ctx1.drawImage(img1, 0, 0, that.SizeW, that.SizeH);
        if (startColorFadeOut.R <= 241) {
            that.startColorFadeInOutStart2 = startColorFadeOut;
            ctx.drawImage(tempIMG1, x1 + xDeltaIMG, y1 + yDeltaIMG, that.SizeW, that.SizeH);
            that.fadeOutTimeout2 = setTimeout(fadeOut, that.fadeInFadeOutDelay);
        } else {
            clearTimeout(that.fadeOutTimeout2);
            that.fadeOutTimeout2 = null;
            that.fadeOutActive2 = false;
            startColorFadeOut.R -= 2;
            startColorFadeOut.G -= 2;
            startColorFadeOut.B -= 2;
            that.startColorFadeInOutStart2 = startColorFadeOut;
            ctx_piperImg = img1.getContext("2d");
            _data = ctx_piperImg.getImageData(0, 0, img1.width, img1.height);
            px = _data.data;
            _len = px.length;
            for (var i = 0; i < _len; i += 4) {
                if (px[i + 3] == 255) {
                    px[i] += 4;
                    px[i + 1] += 4;
                    px[i + 2] += 4;
                }
            }
            ctx_piperImg.putImageData(_data, 0, 0);
        }
    }
    if (mode === null || mode === undefined) {
        mode = ScrollOverType.NONE;
    }
    switch (type) {
    case ScrollArrowType.ARROW_RIGHT:
        is_vertical = false;
        x1 = w - this.SizeW - bottomRightDelta;
        y1 = -1;
        img1 = this.ImageRight[mode];
        break;
    case ScrollArrowType.ARROW_BOTTOM:
        y1 = h - this.SizeH - bottomRightDelta - 1;
        img1 = this.ImageBottom[mode];
        break;
    }
    ctx.lineWidth = 1;
    var strokeW = is_vertical ? this.SizeW - 1 : this.SizeW - 1;
    var strokeH = is_vertical ? this.SizeH - 1 : this.SizeH - 1;
    switch (mode) {
    case ScrollOverType.NONE:
        if (this.lastArrowStatus2 == ScrollOverType.OVER) {
            switch (type) {
            case ScrollArrowType.ARROW_RIGHT:
                img1 = this.ImageRight[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageBottom[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus2 = mode;
            this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart2;
            this.fadeOutActive2 = true;
            fadeOut();
        } else {
            if (this.lastArrowStatus2 == ScrollOverType.ACTIVE) {
                var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];
                switch (type) {
                case ScrollArrowType.ARROW_RIGHT:
                    im = this.ImageRight[ScrollOverType.STABLE];
                    break;
                default:
                    im = this.ImageBottom[ScrollOverType.STABLE];
                    break;
                }
                ctx_im = im.getContext("2d");
                _data = ctx_im.getImageData(0, 0, img1.width, img1.height);
                px = _data.data;
                _len = px.length;
                for (var i = 0; i < _len; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] = c.R;
                        px[i + 1] = c.G;
                        px[i + 2] = c.B;
                    }
                }
                this.startColorFadeInOutStart2 = {
                    R: -1,
                    G: -1,
                    B: -1
                };
                ctx_im.putImageData(_data, 0, 0);
            }
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackNone;
            ctx.fillRect(x1 + 0, y1 + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderNone;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.STABLE:
        if (this.lastArrowStatus2 == ScrollOverType.OVER) {
            switch (type) {
            case ScrollArrowType.ARROW_RIGHT:
                img1 = this.ImageRight[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageBottom[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus2 = mode;
            this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeOut : this.startColorFadeInOutStart2;
            this.fadeOutActive2 = true;
            fadeOut();
        } else {
            if (this.lastArrowStatus2 != ScrollOverType.STABLE) {
                var im, ctx_im, px, _data, c = this.ColorGradStart[ScrollOverType.STABLE];
                switch (type) {
                case ScrollArrowType.ARROW_RIGHT:
                    im = this.ImageRight[ScrollOverType.STABLE];
                    break;
                default:
                    im = this.ImageBottom[ScrollOverType.STABLE];
                    break;
                }
                ctx_im = im.getContext("2d");
                _data = ctx_im.getImageData(0, 0, img1.width, img1.height);
                px = _data.data;
                _len = px.length;
                for (var i = 0; i < _len; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] = c.R;
                        px[i + 1] = c.G;
                        px[i + 2] = c.B;
                    }
                }
                this.startColorFadeInOutStart2 = {
                    R: -1,
                    G: -1,
                    B: -1
                };
                ctx_im.putImageData(_data, 0, 0);
            }
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackStable;
            ctx.fillRect(x1 + 0, y1 + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            ctx.strokeStyle = this.ColorBackStable;
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderStable;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.OVER:
        if (this.lastArrowStatus2 == ScrollOverType.NONE || this.lastArrowStatus2 == ScrollOverType.STABLE) {
            switch (type) {
            case ScrollArrowType.ARROW_RIGHT:
                img1 = this.ImageRight[ScrollOverType.STABLE];
                break;
            default:
                img1 = this.ImageBottom[ScrollOverType.STABLE];
                break;
            }
            this.lastArrowStatus2 = mode;
            this.startColorFadeInOutStart2 = this.startColorFadeInOutStart2.R < 0 ? startColorFadeIn : this.startColorFadeInOutStart2;
            this.fadeInActive2 = true;
            fadeIn();
        } else {
            ctx.beginPath();
            ctx.fillStyle = this.ColorBackOver;
            ctx.fillRect(x1 + xDeltaBORDER - 0.5, y1 + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            if (this.IsDrawBorders) {
                ctx.strokeStyle = this.ColorBorderOver;
                ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
                ctx.stroke();
            }
        }
        break;
    case ScrollOverType.ACTIVE:
        ctx.beginPath();
        ctx.fillStyle = this.ColorBackNone;
        ctx.fillRect(x1 + 0, y1 + 0, strokeW + xDeltaBORDER + 1, strokeH + yDeltaBORDER + 1);
        ctx.fillStyle = this.ColorBackActive;
        ctx.fillRect(x1 + xDeltaBORDER - 0.5, y1 + yDeltaBORDER - 0.5, strokeW + 1, strokeH + 1);
        if (!this.IsNeedInvertOnActive) {
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
        } else {
            var _ctx = img1.getContext("2d");
            var _data = _ctx.getImageData(0, 0, this.SizeW, this.SizeH);
            var _data2 = _ctx.getImageData(0, 0, this.SizeW, this.SizeH);
            var _len = 4 * this.SizeW * this.SizeH;
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255;
                    _data.data[i + 1] = 255;
                    _data.data[i + 2] = 255;
                }
            }
            _ctx.putImageData(_data, 0, 0);
            ctx.drawImage(img1, x1 + xDeltaIMG, y1 + yDeltaIMG, this.SizeW, this.SizeH);
            for (var i = 0; i < _len; i += 4) {
                if (_data.data[i + 3] == 255) {
                    _data.data[i] = 255 - _data.data[i];
                    _data.data[i + 1] = 255 - _data.data[i + 1];
                    _data.data[i + 2] = 255 - _data.data[i + 2];
                }
            }
            _ctx.putImageData(_data2, 0, 0);
            _data = null;
            _data2 = null;
        }
        if (this.IsDrawBorders) {
            ctx.strokeStyle = this.ColorBorderActive;
            ctx.rect(x1 + xDeltaBORDER, y1 + yDeltaBORDER, strokeW, strokeH);
            ctx.stroke();
        }
        break;
    default:
        break;
    }
    this.lastArrowStatus2 = mode;
};
function _HEXTORGB_(colorHEX) {
    return {
        R: parseInt(colorHEX.substring(1, 3), 16),
        G: parseInt(colorHEX.substring(3, 5), 16),
        B: parseInt(colorHEX.substring(5, 7), 16)
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
        scrollerMinHeight: 34,
        scrollerMaxHeight: 99999,
        scrollerMinWidth: 34,
        scrollerMaxWidth: 99999,
        initialDelay: 300,
        arrowRepeatFreq: 50,
        trackClickRepeatFreq: 70,
        scrollPagePercent: 1 / 8,
        arrowDim: 13,
        marginScroller: 4,
        scrollerColor: "#f1f1f1",
        scrollerColorOver: "#cfcfcf",
        scrollerColorLayerOver: "#cfcfcf",
        scrollerColorActive: "#ADADAD",
        scrollBackgroundColor: "#f4f4f4",
        scrollBackgroundColorHover: "#f4f4f4",
        scrollBackgroundColorActive: "#f4f4f4",
        strokeStyleNone: "#cfcfcf",
        strokeStyleOver: "#cfcfcf",
        strokeStyleActive: "#ADADAD",
        vscrollStep: 10,
        hscrollStep: 10,
        wheelScrollLines: 1,
        arrowColor: "#ADADAD",
        arrowBorderColor: "#cfcfcf",
        arrowBackgroundColor: "#F1F1F1",
        arrowStableColor: "#ADADAD",
        arrowStableBorderColor: "#cfcfcf",
        arrowStableBackgroundColor: "#F1F1F1",
        arrowOverColor: "#f1f1f1",
        arrowOverBorderColor: "#cfcfcf",
        arrowOverBackgroundColor: "#cfcfcf",
        arrowActiveColor: "#f1f1f1",
        arrowActiveBorderColor: "#ADADAD",
        arrowActiveBackgroundColor: "#ADADAD",
        fadeInFadeOutDelay: 20,
        piperColor: "#cfcfcf",
        piperColorHover: "#f1f1f1",
        arrowSizeW: 13,
        arrowSizeH: 13,
        cornerRadius: 0,
        slimScroll: false
    };
    this.settings = extendSettings(settings, scrollSettings);
    this.ArrowDrawer = new CArrowDrawer(this.settings);
    this.mouseUp = false;
    this.mouseDown = false;
    this.that.mouseover = false;
    this.that.mouseOverOut = -1;
    this.scrollerMouseDown = false;
    this.scrollerStatus = ScrollOverType.NONE;
    this.lastScrollerStatus = this.scrollerStatus;
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
    this.maxScrollY = 0;
    this.maxScrollX = 0;
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
    this.IsRetina = false;
    this.canvasW = 1;
    this.canvasH = 1;
    this.ScrollOverType1 = -1;
    this.ScrollOverType2 = -1;
    this.fadeInActive = false;
    this.fadeOutActive = false;
    this.fadeInTimeout = null;
    this.fadeOutTimeout = null;
    this.startColorFadeInStart = _HEXTORGB_(this.settings.scrollerColor).R;
    this.startColorFadeOutStart = _HEXTORGB_(this.settings.scrollerColorOver).R;
    this.startColorFadeInOutStart = -1;
    if (window.devicePixelRatio == 2) {
        this.IsRetina = true;
    }
    this.piperImgVert = [document.createElement("canvas"), document.createElement("canvas")];
    this.piperImgHor = [document.createElement("canvas"), document.createElement("canvas")];
    this.piperImgVert[0].height = 13;
    this.piperImgVert[1].height = 13;
    this.piperImgVert[0].width = 5;
    this.piperImgVert[1].width = 5;
    this.piperImgHor[0].width = 13;
    this.piperImgHor[1].width = 13;
    this.piperImgHor[0].height = 5;
    this.piperImgHor[1].height = 5;
    if (this.settings.slimScroll) {
        this.piperImgVert[0].width = this.piperImgVert[1].width = this.piperImgHor[0].height = this.piperImgHor[1].height = 3;
    }
    var r, g, b, ctx_piperImg, _data, px, k;
    r = _HEXTORGB_(this.settings.piperColor);
    g = r.G;
    b = r.B;
    r = r.R;
    k = this.piperImgVert[0].width * 4;
    for (var index = 0; index < this.piperImgVert.length; index++) {
        ctx_piperImg = this.piperImgVert[index].getContext("2d");
        _data = ctx_piperImg.createImageData(this.piperImgVert[index].width, this.piperImgVert[index].height);
        px = _data.data;
        for (var i = 0; i < this.piperImgVert[index].width * this.piperImgVert[index].height * 4;) {
            px[i++] = r;
            px[i++] = g;
            px[i++] = b;
            px[i++] = 255;
            i = (i % k === 0) ? i + k : i;
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        ctx_piperImg = this.piperImgHor[index].getContext("2d");
        _data = ctx_piperImg.createImageData(this.piperImgHor[index].width, this.piperImgHor[index].height);
        px = _data.data;
        for (var i = 0; i < this.piperImgHor[index].width * this.piperImgHor[index].height * 4;) {
            px[i++] = r;
            px[i++] = g;
            px[i++] = b;
            px[i++] = 255;
            i = (i % 4 === 0 && i % 52 !== 0) ? i + 4 : i;
        }
        ctx_piperImg.putImageData(_data, 0, 0);
        r = _HEXTORGB_(this.settings.piperColorHover);
        g = r.G;
        b = r.B;
        r = r.R;
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
            this.arrowPosition = this.settings.arrowDim + 2;
        } else {
            this.arrowPosition = this.settings.marginScroller;
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
        this.canvas.onmouseover = this.evt_mouseover;
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
        this.context.fillStyle = this.settings.scrollBackgroundColor;
        this.context.fillRect(0, 0, this.canvasW, this.canvasH);
        this._drawArrow();
        this._draw();
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
                this.scroller.y = this.arrowPosition;
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
            this.dragMaxY = this.canvasH - this.arrowPosition - this.scroller.h + 1;
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
        if (bIsVerAttack) {
            var _canvasH = settings.screenH;
            if (undefined !== _canvasH && undefined !== settings.screenAddH) {
                _canvasH += settings.screenAddH;
            }
            if (_canvasH == this.canvasH && undefined !== settings.contentH) {
                var _maxScrollY = settings.contentH - settings.screenH > 0 ? settings.contentH - settings.screenH : 0;
                if (_maxScrollY == this.maxScrollY) {
                    return;
                }
            }
        }
        if (bIsHorAttack) {
            if (settings.screenW == this.canvasW && undefined !== settings.contentW) {
                var _maxScrollX = settings.contentW - settings.screenW > 0 ? settings.contentW - settings.screenW : 0;
                if (_maxScrollX == this.maxScrollX) {
                    return;
                }
            }
        }
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
            if (this.maxScrollY == 0) {
                this.canvas.style.display = "none";
            } else {
                this.canvas.style.display = "";
            }
        } else {
            if (this.isHorizontalScroll) {
                this.scrollToX(this.scrollHCurrentX);
                if (this.maxScrollX == 0) {
                    this.canvas.style.display = "none";
                } else {
                    this.canvas.style.display = "";
                }
            }
        }
        this._drawArrow();
        this._draw();
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
        this._drawArrow();
        this._draw();
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
        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if (this.scroller.y + this.scroller.h > this.canvasH - arrow) {
            this.scroller.y -= Math.abs(this.canvasH - arrow - this.scroller.y - this.scroller.h);
        }
        this.scroller.y = Math.round(this.scroller.y);
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
        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if (this.scroller.y + this.scroller.h > this.canvasH - arrow) {
            this.scroller.y -= Math.abs(this.canvasH - arrow - this.scroller.y - this.scroller.h);
        }
        this.scroller.y = Math.round(this.scroller.y);
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
        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if (this.scroller.x + this.scroller.w > this.canvasW - arrow) {
            this.scroller.x -= Math.abs(this.canvasW - arrow - this.scroller.x - this.scroller.w);
        }
        this.scroller.x = Math.round(this.scroller.x);
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
        var arrow = this.settings.showArrows ? this.arrowPosition : 0;
        if (this.scroller.x + this.scroller.w > this.canvasW - arrow) {
            this.scroller.x -= Math.abs(this.canvasW - arrow - this.scroller.x - this.scroller.w);
        }
        this.scroller.x = Math.round(this.scroller.x);
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
    roundRect: function (x, y, width, height, radius) {
        if (typeof radius === "undefined") {
            radius = 1;
        }
        this.context.beginPath();
        this.context.moveTo(x + radius, y);
        this.context.lineTo(x + width - radius, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.context.lineTo(x + width, y + height - radius);
        this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.context.lineTo(x + radius, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.context.lineTo(x, y + radius);
        this.context.quadraticCurveTo(x, y, x + radius, y);
        this.context.closePath();
    },
    _clearContent: function () {
        this.context.clearRect(0, 0, this.canvasW, this.canvasH);
    },
    _draw: function () {
        var piperImgIndex = 0,
        that = this,
        startColorFadeIn = this.startColorFadeInOutStart < 0 ? this.startColorFadeInStart : this.startColorFadeInOutStart,
        startColorFadeOut = this.startColorFadeInOutStart < 0 ? this.startColorFadeOutStart : this.startColorFadeInOutStart;
        function fadeIn() {
            clearTimeout(that.fadeInTimeout);
            that.fadeInTimeout = null;
            clearTimeout(that.fadeOutTimeout);
            that.fadeOutTimeout = null;
            var x, y, img, ctx_piperImg, _data, px;
            that.context.beginPath();
            drawScroller();
            that.context.fillStyle = "rgb(" + that.startColorFadeInOutStart + "," + that.startColorFadeInOutStart + "," + that.startColorFadeInOutStart + ")";
            that.context.strokeStyle = that.settings.strokeStyleOver;
            that.context.fill();
            that.context.stroke();
            startColorFadeIn -= 2;
            if (that.isVerticalScroll && that.maxScrollY != 0) {
                x = that.scroller.x + (that.settings.slimScroll ? 2 : 3);
                y = (that.scroller.y >> 0) + Math.floor(that.scroller.h / 2) - 6;
                ctx_piperImg = that.piperImgVert[0].getContext("2d");
                _data = ctx_piperImg.getImageData(0, 0, that.piperImgVert[0].width, that.piperImgVert[0].height);
                px = _data.data;
                for (var i = 0; i < that.piperImgVert[0].width * that.piperImgVert[0].height * 4; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] += 2;
                        px[i + 1] += 2;
                        px[i + 2] += 2;
                    }
                }
                ctx_piperImg.putImageData(_data, 0, 0);
                img = that.piperImgVert[0];
            } else {
                if (that.isHorizontalScroll && that.maxScrollX != 0) {
                    x = (that.scroller.x >> 0) + Math.floor(that.scroller.w / 2) - 6;
                    y = that.scroller.y + (that.settings.slimScroll ? 2 : 3);
                    ctx_piperImg = that.piperImgHor[0].getContext("2d");
                    _data = ctx_piperImg.getImageData(0, 0, that.piperImgHor[0].width, that.piperImgHor[0].height);
                    px = _data.data;
                    for (var i = 0; i < that.piperImgHor[0].width * that.piperImgHor[0].height * 4; i += 4) {
                        if (px[i + 3] == 255) {
                            px[i] += 2;
                            px[i + 1] += 2;
                            px[i + 2] += 2;
                        }
                    }
                    ctx_piperImg.putImageData(_data, 0, 0);
                    img = that.piperImgHor[0];
                }
            }
            if (startColorFadeIn >= _HEXTORGB_(that.settings.scrollerColorOver).R) {
                that.startColorFadeInOutStart = startColorFadeIn;
                that.fadeInTimeout = setTimeout(fadeIn, that.settings.fadeInFadeOutDelay);
            } else {
                clearTimeout(that.fadeInTimeout);
                that.fadeInTimeout = null;
                that.fadeInActive = false;
                that.startColorFadeInOutStart = startColorFadeIn + 2;
                if (that.isVerticalScroll && that.maxScrollY != 0) {
                    ctx_piperImg = that.piperImgVert[0].getContext("2d");
                    _data = ctx_piperImg.getImageData(0, 0, that.piperImgVert[0].width, that.piperImgVert[0].height);
                    px = _data.data;
                    for (var i = 0; i < that.piperImgVert[0].width * that.piperImgVert[0].height * 4; i += 4) {
                        if (px[i + 3] == 255) {
                            px[i] -= 2;
                            px[i + 1] -= 2;
                            px[i + 2] -= 2;
                        }
                    }
                    ctx_piperImg.putImageData(_data, 0, 0);
                    img = that.piperImgVert[0];
                } else {
                    if (that.isHorizontalScroll && that.maxScrollX != 0) {
                        ctx_piperImg = that.piperImgHor[0].getContext("2d");
                        _data = ctx_piperImg.getImageData(0, 0, that.piperImgHor[0].width, that.piperImgHor[0].height);
                        px = _data.data;
                        for (var i = 0; i < that.piperImgHor[0].width * that.piperImgHor[0].height * 4; i += 4) {
                            if (px[i + 3] == 255) {
                                px[i] -= 2;
                                px[i + 1] -= 2;
                                px[i + 2] -= 2;
                            }
                        }
                        ctx_piperImg.putImageData(_data, 0, 0);
                        img = that.piperImgHor[0];
                    }
                }
            }
            if (img) {
                that.context.drawImage(img, x, y);
            }
        }
        function fadeOut() {
            clearTimeout(that.fadeInTimeout);
            that.fadeInTimeout = null;
            clearTimeout(that.fadeOutTimeout);
            that.fadeOutTimeout = null;
            var x, y, img, ctx_piperImg, _data, px;
            that.context.beginPath();
            drawScroller();
            that.context.fillStyle = "rgb(" + that.startColorFadeInOutStart + "," + that.startColorFadeInOutStart + "," + that.startColorFadeInOutStart + ")";
            that.context.strokeStyle = that.settings.strokeStyleOver;
            that.context.fill();
            that.context.stroke();
            startColorFadeOut += 2;
            if (that.isVerticalScroll && that.maxScrollY != 0) {
                x = that.scroller.x + (that.settings.slimScroll ? 2 : 3);
                y = (that.scroller.y >> 0) + Math.floor(that.scroller.h / 2) - 6;
                ctx_piperImg = that.piperImgVert[0].getContext("2d");
                _data = ctx_piperImg.getImageData(0, 0, that.piperImgVert[0].width, that.piperImgVert[0].height);
                px = _data.data;
                for (var i = 0; i < that.piperImgVert[0].width * that.piperImgVert[0].height * 4; i += 4) {
                    if (px[i + 3] == 255) {
                        px[i] -= 2;
                        px[i + 1] -= 2;
                        px[i + 2] -= 2;
                    }
                }
                ctx_piperImg.putImageData(_data, 0, 0);
                img = that.piperImgVert[0];
            } else {
                if (that.isHorizontalScroll && that.maxScrollX != 0) {
                    x = (that.scroller.x >> 0) + Math.floor(that.scroller.w / 2) - 6;
                    y = that.scroller.y + (that.settings.slimScroll ? 2 : 3);
                    ctx_piperImg = that.piperImgHor[0].getContext("2d");
                    _data = ctx_piperImg.getImageData(0, 0, that.piperImgHor[0].width, that.piperImgHor[0].height);
                    px = _data.data;
                    for (var i = 0; i < that.piperImgHor[0].width * that.piperImgHor[0].height * 4; i += 4) {
                        if (px[i + 3] == 255) {
                            px[i] -= 2;
                            px[i + 1] -= 2;
                            px[i + 2] -= 2;
                        }
                    }
                    ctx_piperImg.putImageData(_data, 0, 0);
                    img = that.piperImgHor[0];
                }
            }
            if (startColorFadeOut <= _HEXTORGB_(that.settings.scrollerColor).R) {
                that.startColorFadeInOutStart = startColorFadeOut;
                that.fadeOutTimeout = setTimeout(fadeOut, that.settings.fadeInFadeOutDelay);
            } else {
                clearTimeout(that.fadeOutTimeout);
                that.fadeOutTimeout = null;
                that.startColorFadeInOutStart = startColorFadeOut - 2;
                that.fadeOutActive = false;
                if (that.isVerticalScroll && that.maxScrollY != 0) {
                    ctx_piperImg = that.piperImgVert[0].getContext("2d");
                    _data = ctx_piperImg.getImageData(0, 0, that.piperImgVert[0].width, that.piperImgVert[0].height);
                    px = _data.data;
                    for (var i = 0; i < that.piperImgVert[0].width * that.piperImgVert[0].height * 4; i += 4) {
                        if (px[i + 3] == 255) {
                            px[i] += 2;
                            px[i + 1] += 2;
                            px[i + 2] += 2;
                        }
                    }
                    ctx_piperImg.putImageData(_data, 0, 0);
                    img = that.piperImgVert[0];
                } else {
                    if (that.isHorizontalScroll && that.maxScrollX != 0) {
                        x = (that.scroller.x >> 0) + Math.floor(that.scroller.w / 2) - 6;
                        y = that.scroller.y + 3;
                        ctx_piperImg = that.piperImgHor[0].getContext("2d");
                        _data = ctx_piperImg.getImageData(0, 0, that.piperImgHor[0].width, that.piperImgHor[0].height);
                        px = _data.data;
                        for (var i = 0; i < that.piperImgHor[0].width * that.piperImgHor[0].height * 4; i += 4) {
                            if (px[i + 3] == 255) {
                                px[i] += 2;
                                px[i + 1] += 2;
                                px[i + 2] += 2;
                            }
                        }
                        ctx_piperImg.putImageData(_data, 0, 0);
                        img = that.piperImgHor[0];
                    }
                }
            }
            if (img) {
                that.context.drawImage(img, x, y);
            }
        }
        function drawScroller() {
            that.context.beginPath();
            if (that.isVerticalScroll) {
                var _y = that.settings.showArrows ? that.arrowPosition : 0,
                _h = that.canvasH - (_y << 1);
                if (_h > 0) {
                    that.context.rect(0, _y, that.canvasW, _h);
                }
            } else {
                if (that.isHorizontalScroll) {
                    var _x = that.settings.showArrows ? that.arrowPosition : 0,
                    _w = that.canvasW - (_x << 1);
                    if (_w > 0) {
                        that.context.rect(_x, 0, _w, that.canvasH);
                    }
                }
            }
            switch (that.scrollerStatus) {
            case ScrollOverType.OVER:
                that.context.fillStyle = that.settings.scrollBackgroundColorHover;
                break;
            case ScrollOverType.ACTIVE:
                that.context.fillStyle = that.settings.scrollBackgroundColorActive;
                break;
            case ScrollOverType.NONE:
                default:
                that.context.fillStyle = that.settings.scrollBackgroundColor;
                break;
            }
            that.context.fill();
            that.context.beginPath();
            if (that.isVerticalScroll && that.maxScrollY != 0) {
                var _y = that.scroller.y >> 0,
                arrow = that.settings.showArrows ? that.arrowPosition : 0;
                if (_y < arrow) {
                    _y = arrow;
                }
                var _b = Math.round(that.scroller.y + that.scroller.h);
                if (_b > (that.canvasH - arrow - 1)) {
                    _b = that.canvasH - arrow - 1;
                }
                if (_b > _y) {
                    that.roundRect(that.scroller.x - 0.5, _y + 0.5, that.scroller.w - 1, that.scroller.h - 1, that.settings.cornerRadius);
                }
            } else {
                if (that.isHorizontalScroll && that.maxScrollX != 0) {
                    var _x = that.scroller.x >> 0,
                    arrow = that.settings.showArrows ? that.arrowPosition : 0;
                    if (_x < arrow) {
                        _x = arrow;
                    }
                    var _r = (that.scroller.x + that.scroller.w) >> 0;
                    if (_r > (that.canvasW - arrow - 2)) {
                        _r = that.canvasW - arrow - 1;
                    }
                    if (_r > _x) {
                        that.roundRect(_x + 0.5, that.scroller.y - 0.5, that.scroller.w - 1, that.scroller.h - 1, that.settings.cornerRadius);
                    }
                }
            }
        }
        if (this.fadeInActive && this.lastScrollerStatus == ScrollOverType.OVER && this.scrollerStatus == ScrollOverType.OVER) {
            return;
        }
        clearTimeout(this.fadeInTimeout);
        this.fadeInTimeout = null;
        clearTimeout(this.fadeOutTimeout);
        this.fadeOutTimeout = null;
        this.fadeInActive = false;
        this.fadeOutActive = false;
        drawScroller();
        this.context.lineWidth = 1;
        switch (this.scrollerStatus) {
        case ScrollOverType.LAYER:
            case ScrollOverType.OVER:
            if (this.lastScrollerStatus == ScrollOverType.NONE) {
                this.lastScrollerStatus = this.scrollerStatus;
                this.startColorFadeInOutStart = this.startColorFadeInOutStart < 0 ? startColorFadeIn : this.startColorFadeInOutStart;
                this.fadeInActive = true;
                fadeIn();
            } else {
                this.context.fillStyle = this.settings.scrollerColorOver;
                this.context.strokeStyle = this.settings.strokeStyleOver;
                piperImgIndex = 1;
            }
            break;
        case ScrollOverType.ACTIVE:
            this.context.fillStyle = this.settings.scrollerColorActive;
            this.context.strokeStyle = this.settings.strokeStyleActive;
            piperImgIndex = 1;
            break;
        case ScrollOverType.NONE:
            default:
            if (this.lastScrollerStatus == ScrollOverType.OVER) {
                this.lastScrollerStatus = this.scrollerStatus;
                this.startColorFadeInOutStart = this.startColorFadeInOutStart < 0 ? startColorFadeOut : this.startColorFadeInOutStart;
                this.fadeOutActive = true;
                fadeOut();
            } else {
                this.context.fillStyle = this.settings.scrollerColor;
                this.context.strokeStyle = this.settings.strokeStyleNone;
                this.startColorFadeInOutStart = this.startColorFadeInStart = _HEXTORGB_(this.settings.scrollerColor).R;
                this.startColorFadeOutStart = _HEXTORGB_(this.settings.scrollerColorOver).R;
                piperImgIndex = 0;
                var r, g, b, ctx_piperImg, _data, px, _len;
                r = _HEXTORGB_(this.settings.piperColor);
                g = r.G;
                b = r.B;
                r = r.R;
                if (this.isVerticalScroll) {
                    ctx_piperImg = this.piperImgVert[piperImgIndex].getContext("2d");
                    _data = ctx_piperImg.getImageData(0, 0, this.piperImgVert[piperImgIndex].width, this.piperImgVert[piperImgIndex].height);
                } else {
                    if (this.isHorizontalScroll) {
                        ctx_piperImg = this.piperImgHor[piperImgIndex].getContext("2d");
                        _data = ctx_piperImg.getImageData(0, 0, this.piperImgHor[piperImgIndex].width, this.piperImgHor[piperImgIndex].height);
                    }
                }
                if (this.isVerticalScroll || this.isHorizontalScroll) {
                    px = _data.data;
                    _len = px.length;
                    for (var i = 0; i < _len; i += 4) {
                        if (px[i + 3] == 255) {
                            px[i] = r;
                            px[i + 1] = g;
                            px[i + 2] = b;
                        }
                    }
                    ctx_piperImg.putImageData(_data, 0, 0);
                }
            }
            break;
        }
        if (!this.fadeInActive && !this.fadeOutActive) {
            this.context.fill();
            this.context.stroke();
            if (this.isVerticalScroll && this.maxScrollY != 0) {
                this.context.drawImage(this.piperImgVert[piperImgIndex], this.scroller.x + (this.settings.slimScroll ? 2 : 3), (this.scroller.y >> 0) + Math.floor(this.scroller.h / 2) - 6);
            } else {
                if (this.isHorizontalScroll && this.maxScrollX != 0) {
                    this.context.drawImage(this.piperImgHor[piperImgIndex], (this.scroller.x >> 0) + Math.floor(this.scroller.w / 2) - 6, this.scroller.y + (this.settings.slimScroll ? 2 : 3));
                }
            }
        }
        this.lastScrollerStatus = this.scrollerStatus;
    },
    _drawArrow: function (type) {
        if (this.settings.showArrows) {
            var w = this.canvasW;
            var h = this.canvasH;
            if (this.isVerticalScroll) {
                switch (type) {
                case ArrowStatus.upLeftArrowHover_downRightArrowNonActive:
                    if (ScrollOverType.OVER != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.OVER;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                case ArrowStatus.upLeftArrowActive_downRightArrowNonActive:
                    if (ScrollOverType.ACTIVE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.ACTIVE;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                case ArrowStatus.upLeftArrowNonActive_downRightArrowHover:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.OVER != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.OVER;
                    }
                    break;
                case ArrowStatus.upLeftArrowNonActive_downRightArrowActive:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.ACTIVE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.ACTIVE;
                    }
                    break;
                case ArrowStatus.arrowHover:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                default:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_TOP, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_BOTTOM, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                }
            }
            if (this.isHorizontalScroll) {
                switch (type) {
                case ArrowStatus.upLeftArrowHover_downRightArrowNonActive:
                    if (ScrollOverType.OVER != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.OVER;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                case ArrowStatus.upLeftArrowActive_downRightArrowNonActive:
                    if (ScrollOverType.ACTIVE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.ACTIVE;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                case ArrowStatus.upLeftArrowNonActive_downRightArrowHover:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.OVER != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.OVER, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.OVER;
                    }
                    break;
                case ArrowStatus.upLeftArrowNonActive_downRightArrowActive:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.ACTIVE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.ACTIVE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.ACTIVE;
                    }
                    break;
                case ArrowStatus.arrowHover:
                    if (ScrollOverType.STABLE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.STABLE;
                    }
                    if (ScrollOverType.STABLE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.STABLE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.STABLE;
                    }
                    break;
                default:
                    if (ScrollOverType.NONE != this.ScrollOverType1) {
                        this.ArrowDrawer.drawTopLeftArrow(ScrollArrowType.ARROW_LEFT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType1 = ScrollOverType.NONE;
                    }
                    if (ScrollOverType.NONE != this.ScrollOverType2) {
                        this.ArrowDrawer.drawBottomRightArrow(ScrollArrowType.ARROW_RIGHT, ScrollOverType.NONE, this.context, w, h);
                        this.ScrollOverType2 = ScrollOverType.NONE;
                    }
                    break;
                }
            }
        }
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
            this.scroller.x = 1;
            this.scroller.w = this.canvasW - 1;
            if (this.settings.showArrows) {
                this.ArrowDrawer.InitSize(this.settings.arrowSizeW, this.settings.arrowSizeH, this.IsRetina);
            }
        } else {
            if (this.isHorizontalScroll) {
                this.scroller.y = 1;
                this.scroller.h = this.canvasH - 1;
                if (this.settings.showArrows) {
                    this.ArrowDrawer.InitSize(this.settings.arrowSizeH, this.settings.arrowSizeW, this.IsRetina);
                }
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
            that._drawArrow(ArrowStatus.upLeftArrowNonActive_downRightArrowActive);
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
            that._drawArrow(ArrowStatus.upLeftArrowActive_downRightArrowNonActive);
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
    getIsLockedMouse: function () {
        return (this.that.mouseDownArrow || this.that.mouseDown);
    },
    evt_mousemove: function (e) {
        var arrowStat = ArrowStatus.arrowHover;
        var evt = e || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        var mousePos = this.that.getMousePosition(evt);
        this.that.EndMousePosition.x = mousePos.x;
        this.that.EndMousePosition.y = mousePos.y;
        var downHover = this.that._MouseHoverOnArrowDown(mousePos),
        upHover = this.that._MouseHoverOnArrowUp(mousePos),
        scrollerHover = this.that._MouseHoverOnScroller(mousePos);
        if (scrollerHover) {
            this.that.scrollerStatus = ScrollOverType.OVER;
            arrowStat = ArrowStatus.arrowHover;
        } else {
            if (this.that.settings.showArrows && (downHover || upHover)) {
                this.that.scrollerStatus = ScrollOverType.OVER;
                if (!this.that.mouseDownArrow) {
                    if (upHover) {
                        arrowStat = ArrowStatus.upLeftArrowHover_downRightArrowNonActive;
                    } else {
                        if (downHover) {
                            arrowStat = ArrowStatus.upLeftArrowNonActive_downRightArrowHover;
                        }
                    }
                }
            } else {
                if (this.that.mouseover) {
                    arrowStat = ArrowStatus.arrowHover;
                }
                this.that.scrollerStatus = ScrollOverType.OVER;
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
                this.that.scrollerStatus = ScrollOverType.ACTIVE;
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
                    this.that.scrollerStatus = ScrollOverType.ACTIVE;
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
        if (!this.that.mouseDownArrow) {
            this.that._drawArrow(arrowStat);
        }
        if (this.that.lastScrollerStatus != this.that.scrollerStatus) {
            this.that._draw();
        }
    },
    evt_mouseout: function (e) {
        var evt = e || window.event;
        if (this.that.settings.showArrows) {
            this.that.mouseDownArrow = false;
            this.that.handleEvents("onmouseout", evt);
        }
        if (!this.that.moveble) {
            this.that.scrollerStatus = ScrollOverType.NONE;
            this.that._drawArrow();
        }
        if (this.that.lastScrollerStatus != this.that.scrollerStatus) {
            this.that._draw();
        }
    },
    evt_mouseover: function (e) {
        this.that.mouseover = true;
    },
    evt_mouseup: function (e) {
        var evt = e || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        var mousePos = this.that.getMousePosition(evt);
        this.that.scrollTimeout && clearTimeout(this.that.scrollTimeout);
        this.that.scrollTimeout = null;
        if (!this.that.scrollerMouseDown) {
            if (this.that.settings.showArrows && this.that._MouseHoverOnArrowDown(mousePos)) {
                this.that.handleEvents("onmouseup", evt);
                this.that._drawArrow(ArrowStatus.upLeftArrowNonActive_downRightArrowHover);
            } else {
                if (this.that.settings.showArrows && this.that._MouseHoverOnArrowUp(mousePos)) {
                    this.that.handleEvents("onmouseup", evt);
                    this.that._drawArrow(ArrowStatus.upLeftArrowHover_downRightArrowNonActive);
                }
            }
            this.that.mouseDownArrow = false;
        } else {
            this.that.mouseDown = false;
            this.that.mouseUp = true;
            this.that.scrollerMouseDown = false;
            this.that.mouseDownArrow = false;
            if (this.that._MouseHoverOnScroller(mousePos)) {
                this.that.scrollerStatus = ScrollOverType.OVER;
            } else {
                this.that.scrollerStatus = ScrollOverType.NONE;
            }
            this.that._drawArrow();
            this.that._draw();
        }
        if (this.that.onLockMouse && this.that.offLockMouse) {
            this.that.offLockMouse(evt);
        }
        this.that.handleEvents("onmouseup", evt);
    },
    evt_mousedown: function (e) {
        var evt = e || window.event;
        var mousePos = this.that.getMousePosition(evt),
        downHover = this.that._MouseHoverOnArrowDown(mousePos),
        upHover = this.that._MouseHoverOnArrowUp(mousePos);
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
                    this.that.scrollerStatus = ScrollOverType.ACTIVE;
                    this.that._draw();
                } else {
                    if (this.that.isVerticalScroll) {
                        var _tmp = this,
                        direction = mousePos.y - this.that.scroller.y - this.that.scroller.h / 2,
                        step = this.that.paneHeight * this.that.settings.scrollPagePercent,
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
                            _tmp.that._drawArrow(ArrowStatus.arrowHover);
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout(_tmp.that.scrollTimeout);
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind("mouseup.main", cancelClick);
                            _tmp.that.lock = false;
                        };
                        if (this.that.onLockMouse) {
                            this.that.onLockMouse(evt);
                        }
                        doScroll();
                        this.that.bind("mouseup.main", cancelClick);
                    }
                    if (this.that.isHorizontalScroll) {
                        var _tmp = this,
                        direction = mousePos.x - this.that.scroller.x - this.that.scroller.w / 2,
                        step = this.that.paneWidth * this.that.settings.scrollPagePercent,
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
                            _tmp.that._drawArrow(ArrowStatus.arrowHover);
                        },
                        cancelClick = function () {
                            _tmp.that.scrollTimeout && clearTimeout(_tmp.that.scrollTimeout);
                            _tmp.that.scrollTimeout = null;
                            _tmp.that.unbind("mouseup.main", cancelClick);
                            _tmp.that.lock = false;
                        };
                        if (this.that.onLockMouse) {
                            this.that.onLockMouse(evt);
                        }
                        doScroll();
                        this.that.bind("mouseup.main", cancelClick);
                    }
                }
            }
        }
    },
    evt_mousewheel: function (e) {
        var evt = e || window.event;
        var delta = 1;
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