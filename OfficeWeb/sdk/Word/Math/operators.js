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
function CGlyphOperator() {
    this.loc = null;
    this.turn = null;
    this.size = null;
    this.stretch = 0;
    this.bStretch = true;
    this.penW = 1;
}
CGlyphOperator.prototype.init = function (props) {
    this.loc = props.location;
    this.turn = props.turn;
    this.bStretch = (props.bStretch == true || props.bStretch == false) ? props.bStretch : true;
};
CGlyphOperator.prototype.fixSize = function (stretch) {
    var sizeGlyph = this.calcSize(stretch);
    var width, height, ascent;
    var bHor = this.loc == LOCATION_TOP || this.loc == LOCATION_BOT;
    if (bHor) {
        width = sizeGlyph.width;
        height = sizeGlyph.height;
        ascent = height / 2;
        if (this.bStretch) {
            this.stretch = stretch > width ? stretch : width;
        } else {
            this.stretch = width;
        }
    } else {
        width = sizeGlyph.height;
        height = sizeGlyph.width;
        ascent = height / 2;
        this.stretch = stretch > height ? stretch : height;
    }
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CGlyphOperator.prototype.draw_other = function () {
    var coord = this.calcCoord(this.stretch);
    var X = coord.XX,
    Y = coord.YY,
    W = this.size.width,
    H = this.size.height,
    glW, glH;
    var a1, a2, b1, b2, c1, c2;
    var bHor = this.loc == 0 || this.loc == 1;
    if (bHor) {
        glW = coord.W;
        glH = coord.H;
    } else {
        glW = coord.H;
        glH = coord.W;
    }
    var shW = (W - glW) / 2,
    shH = (H - glH) / 2;
    if (this.loc == 0) {
        a1 = 1;
        b1 = 0;
        c1 = shW;
        a2 = 0;
        b2 = 1;
        c2 = 0;
    } else {
        if (this.loc == 1) {
            a1 = 1;
            b1 = 0;
            c1 = shW;
            a2 = 0;
            b2 = 1;
            c2 = H - glH;
        } else {
            if (this.loc == 2) {
                a1 = 0;
                b1 = 1;
                c1 = 0;
                a2 = 1;
                b2 = 0;
                c2 = shH;
            } else {
                if (this.loc == 3) {
                    a1 = 0;
                    b1 = 1;
                    c1 = W - glW;
                    a2 = 1;
                    b2 = 0;
                    c2 = shH;
                } else {
                    if (this.loc == 4) {
                        a1 = 0;
                        b1 = 1;
                        c1 = shW;
                        a2 = 1;
                        b2 = 0;
                        c2 = 0;
                    }
                }
            }
        }
    }
    if (this.turn == 1) {
        a1 *= -1;
        b1 *= -1;
        c1 += glW;
    } else {
        if (this.turn == 2) {
            a2 *= -1;
            b2 *= -1;
            c2 += glH;
        } else {
            if (this.turn == 3) {
                a1 *= -1;
                b1 *= -1;
                c1 += glW;
                a2 *= -1;
                b2 *= -1;
                c2 += glH;
            }
        }
    }
    if (bHor) {
        a1 = 1;
        b1 = 0;
        c1 = shW;
        a2 = 0;
        b2 = 1;
        c2 = 0;
    } else {
        a1 = 0;
        b1 = 1;
        c1 = 0;
        a2 = 1;
        b2 = 0;
        c2 = shH;
    }
    if (this.turn == 1) {
        a1 *= -1;
        b1 *= -1;
        c1 = W;
    } else {
        if (this.turn == 2) {
            a2 *= -1;
            b2 *= -1;
            c2 = H;
        } else {
            if (this.turn == 3) {
                a1 *= -1;
                b1 *= -1;
                c1 = W;
                a2 *= -1;
                b2 *= -1;
                c2 = H;
            }
        }
    }
    var gpX = 0,
    gpY = 0;
    if (this.loc == 1) {
        gpY = this.penW * 25.4 / 96;
    }
    if (this.loc == 3) {
        gpX = -this.penW * 25.4 / 96;
    }
    var XX = [],
    YY = [];
    var x = this.pos.x,
    y = this.pos.y;
    for (var i = 0; i < X.length; i++) {
        XX[i] = x + X[i] * a1 + Y[i] * b1 + c1 + gpX;
        YY[i] = y + X[i] * a2 + Y[i] * b2 + c2 + gpY;
    }
    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);
    MathControl.pGraph.p_width(this.penW * 1000);
    MathControl.pGraph.b_color1(0, 0, 0, 255);
    MathControl.pGraph._s();
    this.drawPath(XX, YY);
    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);
};
CGlyphOperator.prototype.getCoordinateGlyph = function () {
    var coord = this.calcCoord(this.stretch);
    var X = coord.XX,
    Y = coord.YY,
    W = this.size.width,
    H = this.size.height;
    var bHor = this.loc == 0 || this.loc == 1;
    var glW = 0,
    glH = 0;
    if (bHor) {
        glW = coord.W;
        glH = coord.H;
    } else {
        glW = coord.H;
        glH = coord.W;
    }
    var bLine = this.Parent.typeOper == DELIMITER_LINE || this.Parent.typeOper == DELIMITER_DOUBLE_LINE,
    bArrow = this.Parent.typeOper == ARROW_LEFT || this.Parent.typeOper == ARROW_RIGHT || this.Parent.typeOper == ARROW_LR,
    bDoubleArrow = this.Parent.typeOper == DOUBLE_LEFT_ARROW || this.Parent.typeOper == DOUBLE_RIGHT_ARROW || this.Parent.typeOper == DOUBLE_ARROW_LR;
    var a1, a2, b1, b2, c1, c2;
    if (bLine) {
        if (this.loc == LOCATION_TOP) {
            a1 = 1;
            b1 = 0;
            c1 = 0;
            a2 = 0;
            b2 = 1;
            c2 = (H - glH) / 2;
        } else {
            if (this.loc == LOCATION_BOT) {
                a1 = 1;
                b1 = 0;
                c1 = 0;
                a2 = 0;
                b2 = 1;
                c2 = (H - glH) / 2;
            } else {
                if (this.loc == LOCATION_LEFT) {
                    a1 = 0;
                    b1 = 1;
                    c1 = (W - glW) / 2;
                    a2 = 1;
                    b2 = 0;
                    c2 = 0;
                } else {
                    if (this.loc == LOCATION_RIGHT) {
                        a1 = 0;
                        b1 = 1;
                        c1 = (W - glW) / 2;
                        a2 = 1;
                        b2 = 0;
                        c2 = 0;
                    } else {
                        if (this.loc == LOCATION_SEP) {
                            a1 = 0;
                            b1 = 1;
                            c1 = (W - glW) / 2;
                            a2 = 1;
                            b2 = 0;
                            c2 = 0;
                        }
                    }
                }
            }
        }
    } else {
        if (this.loc == LOCATION_TOP) {
            a1 = 1;
            b1 = 0;
            c1 = 0;
            a2 = 0;
            b2 = 1;
            c2 = 0;
        } else {
            if (this.loc == LOCATION_BOT) {
                a1 = 1;
                b1 = 0;
                c1 = 0;
                a2 = 0;
                b2 = 1;
                c2 = H - glH;
            } else {
                if (this.loc == LOCATION_LEFT) {
                    a1 = 0;
                    b1 = 1;
                    c1 = 0;
                    a2 = 1;
                    b2 = 0;
                    c2 = 0;
                } else {
                    if (this.loc == LOCATION_RIGHT) {
                        a1 = 0;
                        b1 = 1;
                        c1 = W - glW;
                        a2 = 1;
                        b2 = 0;
                        c2 = 0;
                    } else {
                        if (this.loc == LOCATION_SEP) {
                            a1 = 0;
                            b1 = 1;
                            c1 = 0;
                            a2 = 1;
                            b2 = 0;
                            c2 = 0;
                        }
                    }
                }
            }
        }
    }
    if (this.turn == 1) {
        a1 *= -1;
        b1 *= -1;
        c1 += glW;
    } else {
        if (this.turn == 2) {
            a2 *= -1;
            b2 *= -1;
            c2 += glH;
        } else {
            if (this.turn == 3) {
                a1 *= -1;
                b1 *= -1;
                c1 += glW;
                a2 *= -1;
                b2 *= -1;
                c2 += glH;
            }
        }
    }
    var gpX = 0,
    gpY = 0;
    if (this.loc == 3) {
        gpX = -this.penW * 25.4 / 96;
    }
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * a1 + Y[i] * b1 + c1 + gpX;
        YY[i] = X[i] * a2 + Y[i] * b2 + c2 + gpY;
    }
    return {
        XX: XX,
        YY: YY,
        Width: glW,
        Height: glH
    };
};
CGlyphOperator.prototype.draw = function (pGraphics, XX, YY, PDSE) {
    this.Parent.Make_ShdColor(PDSE);
    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);
    pGraphics.p_width(this.penW * 1000);
    pGraphics._s();
    this.drawPath(pGraphics, XX, YY, PDSE);
    pGraphics.df();
    pGraphics.SetIntegerGrid(intGrid);
};
CGlyphOperator.prototype.drawOnlyLines = function (x, y, pGraphics, PDSE) {
    this.Parent.Make_ShdColor(PDSE);
    this.draw(x, y, pGraphics);
};
CGlyphOperator.prototype.getCtrPrp = function () {
    return this.Parent.Get_TxtPrControlLetter();
};
CGlyphOperator.prototype.PreRecalc = function (Parent) {
    this.Parent = Parent;
};
function COperatorBracket() {
    CGlyphOperator.call(this);
}
Asc.extendClass(COperatorBracket, CGlyphOperator);
COperatorBracket.prototype.calcSize = function (stretch) {
    var betta = this.getCtrPrp().FontSize / 36;
    var heightBr, widthBr;
    var minBoxH = 4.917529296874999 * betta;
    if (this.Parent.type == OPER_GROUP_CHAR) {
        widthBr = 7.347222222222221 * betta;
        heightBr = minBoxH;
    } else {
        widthBr = 12.34722222222222 * betta;
        var maxBoxH;
        var rx = stretch / widthBr;
        if (rx < 1) {
            rx = 1;
        }
        if (rx < 2.1) {
            maxBoxH = minBoxH * 1.37;
        } else {
            if (rx < 3.22) {
                maxBoxH = minBoxH * 1.06;
            } else {
                maxBoxH = 8.74 * betta;
            }
        }
        var delta = maxBoxH - minBoxH;
        heightBr = delta / 4.3 * (rx - 1) + minBoxH;
        heightBr = heightBr > maxBoxH ? maxBoxH : heightBr;
    }
    return {
        width: widthBr,
        height: heightBr
    };
};
COperatorBracket.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 26467;
    Y[0] = 18871;
    X[1] = 25967;
    Y[1] = 18871;
    X[2] = 25384;
    Y[2] = 16830;
    X[3] = 24737;
    Y[3] = 15476;
    X[4] = 24091;
    Y[4] = 14122;
    X[5] = 23341;
    Y[5] = 13309;
    X[6] = 22591;
    Y[6] = 12497;
    X[7] = 21778;
    Y[7] = 12164;
    X[8] = 20965;
    Y[8] = 11831;
    X[9] = 20089;
    Y[9] = 11831;
    X[10] = 19214;
    Y[10] = 11831;
    X[11] = 18317;
    Y[11] = 12083;
    X[12] = 17421;
    Y[12] = 12336;
    X[13] = 16441;
    Y[13] = 12652;
    X[14] = 15462;
    Y[14] = 12969;
    X[15] = 14357;
    Y[15] = 13243;
    X[16] = 13253;
    Y[16] = 13518;
    X[17] = 11961;
    Y[17] = 13518;
    X[18] = 9835;
    Y[18] = 13518;
    X[19] = 8292;
    Y[19] = 12621;
    X[20] = 6750;
    Y[20] = 11724;
    X[21] = 5750;
    Y[21] = 10055;
    X[22] = 4750;
    Y[22] = 8386;
    X[23] = 4270;
    Y[23] = 5987;
    X[24] = 3791;
    Y[24] = 3589;
    X[25] = 3791;
    Y[25] = 626;
    X[26] = 3791;
    Y[26] = 0;
    X[27] = 0;
    Y[27] = 0;
    X[28] = 0;
    Y[28] = 1084;
    X[29] = 83;
    Y[29] = 5963;
    X[30] = 1021;
    Y[30] = 9612;
    X[31] = 1959;
    Y[31] = 13261;
    X[32] = 3543;
    Y[32] = 15700;
    X[33] = 5127;
    Y[33] = 18139;
    X[34] = 7232;
    Y[34] = 19369;
    X[35] = 9337;
    Y[35] = 20599;
    X[36] = 11796;
    Y[36] = 20599;
    X[37] = 13338;
    Y[37] = 20599;
    X[38] = 14588;
    Y[38] = 20283;
    X[39] = 15839;
    Y[39] = 19968;
    X[40] = 16860;
    Y[40] = 19610;
    X[41] = 17882;
    Y[41] = 19252;
    X[42] = 18736;
    Y[42] = 18936;
    X[43] = 19590;
    Y[43] = 18621;
    X[44] = 20340;
    Y[44] = 18621;
    X[45] = 21091;
    Y[45] = 18621;
    X[46] = 21820;
    Y[46] = 18995;
    X[47] = 22550;
    Y[47] = 19370;
    X[48] = 23133;
    Y[48] = 20266;
    X[49] = 23717;
    Y[49] = 21162;
    X[50] = 24092;
    Y[50] = 22703;
    X[51] = 24467;
    Y[51] = 24245;
    X[52] = 24551;
    Y[52] = 26578;
    X[53] = 28133;
    Y[53] = 26578;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var augm = stretch / ((X[52] + (X[0] - X[1]) / 2 + X[1] - X[52]) * alpha * 2);
    if (augm < 1) {
        augm = 1;
    }
    var YY = [],
    XX = [];
    var hh1 = [],
    hh2 = [];
    var c1 = [],
    c2 = [];
    var delta = augm < 7 ? augm : 7;
    if (augm < 7) {
        var RX = [],
        RX1,
        RX2;
        if (delta < 5.1) {
            hh1[0] = 1.89;
            hh2[0] = 2.58;
            hh1[1] = 1.55;
            hh2[1] = 1.72;
            hh1[2] = 1.5;
            hh2[2] = 1.64;
            hh1[3] = 1.92;
            hh2[3] = 1.97;
            hh1[4] = 1;
            hh2[4] = 1;
            hh1[5] = 2.5;
            hh2[5] = 2.5;
            hh1[6] = 2.1;
            hh2[6] = 2.1;
            hh1[7] = 1;
            hh2[7] = 1;
            RX1 = 0.033 * delta + 0.967;
            RX2 = 0.033 * delta + 0.967;
        } else {
            hh1[0] = 1.82;
            hh2[0] = 2.09;
            hh1[1] = 1.64;
            hh2[1] = 1.65;
            hh1[2] = 1.57;
            hh2[2] = 1.92;
            hh1[3] = 1.48;
            hh2[3] = 2.16;
            hh1[4] = 1;
            hh2[4] = 1;
            hh1[5] = 2.5;
            hh2[5] = 2.5;
            hh1[6] = 2.1;
            hh2[6] = 2.1;
            hh1[7] = 1;
            hh2[7] = 1;
            RX1 = 0.22 * delta + 0.78;
            RX2 = 0.17 * delta + 0.83;
        }
        for (var i = 0; i < 27; i++) {
            RX[i] = RX1;
        }
        for (var i = 27; i < 54; i++) {
            RX[i] = RX2;
        }
        RX[1] = (Y[52] * RX[52] - (Y[52] - Y[1])) / Y[1];
        RX[0] = RX[1] * Y[1] / Y[0];
        RX[27] = 1;
        RX[26] = 1;
        for (var i = 0; i < 8; i++) {
            RX[26 - i] = 1 + i * ((RX2 + RX1) / 2 - 1) / 7;
        }
        for (var i = 0; i < 4; i++) {
            c1[i] = X[30 + 2 * i] - X[28 + 2 * i];
            c2[i] = X[23 - 2 * i] - X[25 - 2 * i];
        }
        c1[5] = X[48] - X[44];
        c2[5] = X[5] - X[9];
        c1[6] = X[52] - X[48];
        c2[6] = X[1] - X[5];
        c1[7] = (X[0] - X[1]) / 2 + X[1] - X[52];
        c2[7] = (X[0] - X[1]) / 2;
        c1[4] = X[44] - X[36];
        c2[4] = X[9] - X[17];
        var rest1 = 0,
        rest2 = 0;
        for (var i = 0; i < 8; i++) {
            if (i == 4) {
                continue;
            }
            hh1[i] = (hh1[i] - 1) * (delta - 1) + 1;
            hh2[i] = (hh2[i] - 1) * (delta - 1) + 1;
            rest1 += hh1[i] * c1[i];
            rest2 += hh2[i] * c2[i];
        }
        var H1 = delta * (X[52] + c1[7]),
        H2 = H1 - (X[26] - X[27]);
        hh1[4] = (H1 - rest1) / c1[4];
        hh2[4] = (H2 - rest2) / c2[4];
        XX[27] = X[27];
        XX[26] = X[26];
        XX[28] = X[27];
        XX[25] = X[26];
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 3; j++) {
                var t = j + i * 2;
                XX[28 + t] = XX[27 + t] + (X[28 + t] - X[27 + t]) * hh1[i];
                XX[25 - t] = XX[26 - t] + (X[25 - t] - X[26 - t]) * hh2[i];
            }
        }
        for (var i = 1; i < 9; i++) {
            XX[36 + i] = XX[35 + i] + (X[36 + i] - X[35 + i]) * hh1[4];
            XX[17 - i] = XX[18 - i] + (X[17 - i] - X[18 - i]) * hh2[4];
        }
        for (var i = 0; i < 4; i++) {
            XX[45 + i] = XX[44 + i] + (X[45 + i] - X[44 + i]) * hh1[5];
            XX[8 - i] = XX[9 - i] + (X[8 - i] - X[9 - i]) * hh2[5];
        }
        for (var i = 0; i < 4; i++) {
            XX[49 + i] = XX[48 + i] + (X[49 + i] - X[48 + i]) * hh1[6];
            XX[4 - i] = XX[5 - i] + (X[4 - i] - X[5 - i]) * hh2[6];
        }
        XX[53] = XX[52] + 2 * c1[7] * hh1[7];
        XX[0] = XX[1] + 2 * c2[7] * hh2[7];
    } else {
        hh1[0] = 1.75;
        hh2[0] = 2.55;
        hh1[1] = 1.62;
        hh2[1] = 1.96;
        hh1[2] = 1.97;
        hh2[2] = 1.94;
        hh1[3] = 1.53;
        hh2[3] = 1;
        hh1[4] = 2.04;
        hh2[4] = 3.17;
        hh1[5] = 2;
        hh2[5] = 2.58;
        hh1[6] = 2.3;
        hh2[6] = 1.9;
        hh1[7] = 2.3;
        hh2[7] = 1.9;
        hh1[8] = 1;
        hh2[8] = 1;
        hh1[9] = 2.5;
        hh2[9] = 2.5;
        hh1[10] = 2.1;
        hh2[10] = 2.1;
        hh1[11] = 1;
        hh2[11] = 1;
        var rest1 = 0,
        rest2 = 0;
        for (var i = 0; i < 8; i++) {
            c1[i] = X[30 + i] - X[29 + i];
            c2[i] = X[24 - i] - X[25 - i];
        }
        c1[9] = X[48] - X[44];
        c2[9] = X[5] - X[9];
        c1[10] = X[52] - X[48];
        c2[10] = X[1] - X[5];
        c1[11] = (X[0] - X[1]) / 2 + X[1] - X[52];
        c2[11] = (X[0] - X[1]) / 2;
        c1[8] = X[44] - X[36];
        c2[8] = X[9] - X[17];
        for (var i = 0; i < 12; i++) {
            if (i == 8) {
                continue;
            }
            hh1[i] = (hh1[i] - 1) * (delta - 1) + 1;
            hh2[i] = (hh2[i] - 1) * (delta - 1) + 1;
            rest1 += hh1[i] * c1[i];
            rest2 += hh2[i] * c2[i];
        }
        var H1 = delta * (X[52] + c1[11]),
        H2 = H1 - (X[26] - X[27]);
        hh1[8] = (H1 - rest1) / c1[8];
        hh2[8] = (H2 - rest2) / c2[8];
        XX[27] = X[27];
        XX[26] = X[26];
        XX[28] = X[27];
        XX[25] = X[26];
        for (var i = 0; i < 9; i++) {
            XX[28 + i] = XX[27 + i] + (X[28 + i] - X[27 + i]) * hh1[i];
            XX[25 - i] = XX[26 - i] + (X[25 - i] - X[26 - i]) * hh2[i];
        }
        for (var i = 1; i < 9; i++) {
            XX[36 + i] = XX[35 + i] + (X[36 + i] - X[35 + i]) * hh1[8];
            XX[17 - i] = XX[18 - i] + (X[17 - i] - X[18 - i]) * hh2[8];
        }
        for (var i = 0; i < 4; i++) {
            XX[45 + i] = XX[44 + i] + (X[45 + i] - X[44 + i]) * hh1[9];
            XX[8 - i] = XX[9 - i] + (X[8 - i] - X[9 - i]) * hh2[9];
        }
        for (var i = 0; i < 4; i++) {
            XX[49 + i] = XX[48 + i] + (X[49 + i] - X[48 + i]) * hh1[10];
            XX[4 - i] = XX[5 - i] + (X[4 - i] - X[5 - i]) * hh2[10];
        }
        XX[53] = XX[52] + 2 * c1[11] * hh1[11];
        XX[0] = XX[1] + 2 * c2[11] * hh2[11];
        var RX = [];
        for (var i = 0; i < 27; i++) {
            RX[i] = 0.182 * delta + 0.818;
        }
        for (var i = 27; i < 54; i++) {
            RX[i] = 0.145 * delta + 0.855;
        }
        RX[1] = (Y[52] * RX[52] - (Y[52] - Y[1])) / Y[1];
        RX[0] = RX[1] * Y[1] / Y[0];
        RX[27] = 1;
        RX[26] = 1;
        for (var i = 0; i < 7; i++) {
            RX[28 - i] = 1 + i * (0.145 * delta + 0.855 - 1) / 8;
        }
        var w = Y[33] * RX[33],
        w2 = Y[9] * RX[9] + 0.15 * (Y[9] * RX[9] - Y[19] * RX[19]);
        for (var i = 0; i < 11; i++) {
            RX[34 + i] = w / Y[34 + i];
            RX[19 - i] = w2 / Y[19 - i];
        }
        var _H1 = augm * (X[52] + c1[11]),
        _H2 = _H1 - (X[26] - X[27]);
        var w3 = _H1 - (XX[52] + c1[11]),
        w4 = _H2 - (XX[1] - XX[26] + c2[11]);
        for (var i = 0; i < 10; i++) {
            XX[53 - i] = XX[53 - i] + w3;
            XX[i] = XX[i] + w4;
        }
    }
    for (var i = 0; i < 54; i++) {
        if (this.Parent.type == OPER_GROUP_CHAR) {
            YY[i] = (Y[53] - Y[i]) * alpha;
        } else {
            YY[i] = (Y[53] * RX[53] - Y[i] * RX[i]) * alpha;
        }
        XX[i] = XX[i] * alpha;
    }
    for (var i = 0; i < 50; i++) {
        YY[54 + i] = YY[51 - i];
    }
    for (var i = 0; i < 50; i++) {
        XX[54 + i] = XX[53] + XX[52] - XX[51 - i];
    }
    var W = XX[77],
    H = YY[26];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
COperatorBracket.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3]);
    pGraphics._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5]);
    pGraphics._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    pGraphics._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    pGraphics._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11]);
    pGraphics._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13]);
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15]);
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17]);
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21]);
    pGraphics._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23]);
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25]);
    pGraphics._l(XX[26], YY[26]);
    pGraphics._l(XX[27], YY[27]);
    pGraphics._l(XX[28], YY[28]);
    pGraphics._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]);
    pGraphics._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]);
    pGraphics._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
    pGraphics._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36]);
    pGraphics._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38]);
    pGraphics._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40]);
    pGraphics._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42]);
    pGraphics._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44]);
    pGraphics._c(XX[44], YY[44], XX[45], YY[45], XX[46], YY[46]);
    pGraphics._c(XX[46], YY[46], XX[47], YY[47], XX[48], YY[48]);
    pGraphics._c(XX[48], YY[48], XX[49], YY[49], XX[50], YY[50]);
    pGraphics._c(XX[50], YY[50], XX[51], YY[51], XX[52], YY[52]);
    pGraphics._l(XX[53], YY[53]);
    pGraphics._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55]);
    pGraphics._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57]);
    pGraphics._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59]);
    pGraphics._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61]);
    pGraphics._c(XX[61], YY[61], XX[62], YY[62], XX[63], YY[63]);
    pGraphics._c(XX[63], YY[63], XX[64], YY[64], XX[65], YY[65]);
    pGraphics._c(XX[65], YY[65], XX[66], YY[66], XX[67], YY[67]);
    pGraphics._c(XX[67], YY[67], XX[68], YY[68], XX[69], YY[69]);
    pGraphics._c(XX[69], YY[69], XX[70], YY[70], XX[71], YY[71]);
    pGraphics._c(XX[71], YY[71], XX[72], YY[72], XX[73], YY[73]);
    pGraphics._c(XX[73], YY[73], XX[74], YY[74], XX[75], YY[75]);
    pGraphics._c(XX[75], YY[75], XX[76], YY[76], XX[77], YY[77]);
    pGraphics._l(XX[78], YY[78]);
    pGraphics._l(XX[79], YY[79]);
    pGraphics._l(XX[80], YY[80]);
    pGraphics._c(XX[80], YY[80], XX[81], YY[81], XX[82], YY[82]);
    pGraphics._c(XX[82], YY[82], XX[83], YY[83], XX[84], YY[84]);
    pGraphics._c(XX[84], YY[84], XX[85], YY[85], XX[86], YY[86]);
    pGraphics._c(XX[86], YY[86], XX[87], YY[87], XX[88], YY[88]);
    pGraphics._c(XX[88], YY[88], XX[89], YY[89], XX[90], YY[90]);
    pGraphics._c(XX[90], YY[90], XX[91], YY[91], XX[92], YY[92]);
    pGraphics._c(XX[92], YY[92], XX[93], YY[93], XX[94], YY[94]);
    pGraphics._c(XX[94], YY[94], XX[95], YY[95], XX[96], YY[96]);
    pGraphics._c(XX[96], YY[96], XX[97], YY[97], XX[98], YY[98]);
    pGraphics._c(XX[98], YY[98], XX[99], YY[99], XX[100], YY[100]);
    pGraphics._c(XX[100], YY[100], XX[101], YY[101], XX[102], YY[102]);
    pGraphics._c(XX[102], YY[102], XX[103], YY[103], XX[0], YY[0]);
};
function COperatorParenthesis() {
    CGlyphOperator.call(this);
}
Asc.extendClass(COperatorParenthesis, CGlyphOperator);
COperatorParenthesis.prototype.calcSize = function (stretch) {
    var betta = this.getCtrPrp().FontSize / 36;
    var heightBr, widthBr;
    var minBoxH = 5.27099609375 * betta;
    if (this.Parent.type == OPER_GROUP_CHAR) {
        widthBr = 6.99444444444 * betta;
        heightBr = minBoxH;
    } else {
        var maxBoxH = 9.630419921870001 * betta;
        widthBr = 11.99444444444 * betta;
        var ry = stretch / widthBr,
        delta = maxBoxH - minBoxH;
        heightBr = delta / 4.3 * (ry - 1) + minBoxH;
        heightBr = heightBr > maxBoxH ? maxBoxH : heightBr;
    }
    return {
        height: heightBr,
        width: widthBr
    };
};
COperatorParenthesis.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 39887;
    Y[0] = 18995;
    X[1] = 25314;
    Y[1] = 18995;
    X[2] = 15863;
    Y[2] = 14309;
    X[3] = 6412;
    Y[3] = 9623;
    X[4] = 3206;
    Y[4] = 0;
    X[5] = 0;
    Y[5] = 1000;
    X[6] = 3206;
    Y[6] = 13217;
    X[7] = 13802;
    Y[7] = 19722;
    X[8] = 24398;
    Y[8] = 26227;
    X[9] = 39470;
    Y[9] = 26227;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var aug = stretch / (X[9] * alpha) / 2;
    var RX, RY;
    var MIN_AUG = this.Parent.type == OPER_GROUP_CHAR ? 0.5 : 1;
    if (aug > 6.53) {
        RX = 6.53;
        RY = 2.05;
    } else {
        if (aug < MIN_AUG) {
            RX = MIN_AUG;
            RY = MIN_AUG;
        } else {
            RX = aug;
            RY = 1 + (aug - 1) * 0.19;
        }
    }
    if (this.Parent.type !== OPER_GROUP_CHAR) {
        var DistH = [];
        for (var i = 0; i < 5; i++) {
            DistH[i] = Y[9 - i] - Y[i];
        }
        for (var i = 5; i < 10; i++) {
            Y[i] = Y[i] * RY;
            Y[9 - i] = Y[i] - DistH[9 - i];
        }
    }
    var DistW = [];
    for (var j = 0; j < 5; j++) {
        DistW[j] = X[18 - j] - X[9 + j];
    }
    for (var i = 0; i < 5; i++) {
        DistW[i] = X[9 - j] - X[j];
    }
    for (var i = 5; i < 10; i++) {
        X[i] = X[i] * RX;
        X[9 - i] = X[i] + DistW[9 - i];
    }
    var XX = [],
    YY = [];
    var shiftY = 1.1 * Y[9] * alpha;
    for (var i = 0; i < 10; i++) {
        YY[19 - i] = shiftY - Y[i] * alpha;
        YY[i] = shiftY - Y[i] * alpha;
        XX[19 - i] = X[i] * alpha;
        XX[i] = stretch - X[i] * alpha;
    }
    YY[20] = YY[0];
    XX[20] = XX[0];
    var W = XX[5],
    H = YY[4];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
COperatorParenthesis.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    pGraphics._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17]);
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    pGraphics._l(XX[20], YY[20]);
};
function COperatorAngleBracket() {
    CGlyphOperator.call(this);
}
Asc.extendClass(COperatorAngleBracket, CGlyphOperator);
COperatorAngleBracket.prototype.calcSize = function (stretch) {
    var betta = this.getCtrPrp().FontSize / 36;
    var widthBr = 11.99444444444444 * betta;
    var heightBr;
    if (stretch / widthBr > 3.768) {
        heightBr = 5.3578125 * betta;
    } else {
        heightBr = 4.828645833333333 * betta;
    }
    return {
        width: widthBr,
        height: heightBr
    };
};
COperatorAngleBracket.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 38990;
    Y[0] = 7665;
    X[1] = 1583;
    Y[1] = 21036;
    X[2] = 0;
    Y[2] = 16621;
    X[3] = 37449;
    Y[3] = 0;
    X[4] = 40531;
    Y[4] = 0;
    X[5] = 77938;
    Y[5] = 16621;
    X[6] = 76439;
    Y[6] = 21036;
    X[7] = 38990;
    Y[7] = 7665;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var augm = stretch / (X[5] * alpha);
    if (augm < 1) {
        augm = 1;
    } else {
        if (augm > 4.7) {
            augm = 4.7;
        }
    }
    var c1 = 1,
    c2 = 1;
    var ww1 = Y[0] - Y[3],
    ww2 = Y[1] - Y[2],
    ww3 = Y[1] - Y[0],
    ww4 = Y[2] - Y[3];
    if (augm > 3.768) {
        var WW = (Y[1] - Y[3]) * 1.3;
        c1 = (WW - ww1) / ww3;
        c2 = (WW - ww2) / ww4;
    }
    Y[1] = Y[6] = Y[0] + ww3 * c1;
    Y[2] = Y[5] = Y[3] + ww4 * c2;
    var k1 = 0.01 * augm;
    var hh1 = (X[0] - X[3]) * k1,
    hh2 = X[1] - X[2],
    hh3 = X[3] - X[2],
    hh4 = X[0] - X[1],
    HH = augm * X[5] / 2;
    var k2 = (HH - hh1) / hh3,
    k3 = (HH - hh2) / hh4;
    X[7] = X[0] = X[1] + k3 * hh4;
    X[3] = X[2] + k2 * hh3;
    for (var i = 0; i < 3; i++) {
        X[4 + i] = 2 * HH - X[3 - i];
    }
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var W = XX[5],
    H = YY[1];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
COperatorAngleBracket.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
};
function CSquareBracket() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CSquareBracket, CGlyphOperator);
CSquareBracket.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 3200;
    Y[0] = 6912;
    X[1] = 3200;
    Y[1] = 18592;
    X[2] = 0;
    Y[2] = 18592;
    X[3] = 0;
    Y[3] = 0;
    X[4] = 79424;
    Y[4] = 0;
    X[5] = 79424;
    Y[5] = 18592;
    X[6] = 76224;
    Y[6] = 18592;
    X[7] = 76224;
    Y[7] = 6912;
    X[8] = 3200;
    Y[8] = 6912;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var lng = stretch / alpha - X[4] - 2 * X[0];
    if (lng < 0) {
        lng = 0;
    }
    for (var i = 0; i < 4; i++) {
        X[4 + i] += lng;
    }
    var XX = [],
    YY = [];
    var shY = Y[0] * alpha;
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha + shY;
    }
    var W = XX[4],
    H = YY[1];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CSquareBracket.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
};
CSquareBracket.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 4.446240234375 * betta;
    var width = 12.34722222222222 * betta;
    return {
        width: width,
        height: height
    };
};
function CHalfSquareBracket() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CHalfSquareBracket, CGlyphOperator);
CHalfSquareBracket.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 0;
    X[1] = 0;
    Y[1] = 7000;
    X[2] = 74106;
    Y[2] = 7000;
    X[3] = 74106;
    Y[3] = 18578;
    X[4] = 77522;
    Y[4] = 18578;
    X[5] = 77522;
    Y[5] = 0;
    X[6] = 0;
    Y[6] = 0;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var w1 = X[4],
    w2 = X[4] - X[3];
    var lng = stretch / alpha - w1 - w2;
    if (lng < 0) {
        lng = 0;
    }
    for (var i = 0; i < 4; i++) {
        X[2 + i] += lng;
    }
    var XX = [],
    YY = [];
    var shY = Y[1] * alpha;
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha + shY;
    }
    var W = XX[4],
    H = YY[4];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CHalfSquareBracket.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 4.446240234375 * betta;
    var width = 11.99444444444 * betta;
    return {
        width: width,
        height: height
    };
};
CHalfSquareBracket.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
};
function COperatorLine() {
    CGlyphOperator.call(this);
}
Asc.extendClass(COperatorLine, CGlyphOperator);
COperatorLine.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 4.018359374999999 * betta;
    var width = 11.99444444444 * betta;
    return {
        width: width,
        height: height
    };
};
COperatorLine.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 0;
    X[1] = 0;
    Y[1] = 5520;
    X[2] = 77504;
    Y[2] = 5520;
    X[3] = 77504;
    Y[3] = 0;
    X[4] = 0;
    Y[4] = 0;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    var shY = 0;
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha + shY;
    }
    var lng = stretch - X[2] * alpha;
    if (lng < 0) {
        lng = 0;
    }
    XX[2] += lng;
    XX[3] += lng;
    var W = XX[2],
    H = YY[2] + shY;
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
COperatorLine.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
};
function CWhiteSquareBracket() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CWhiteSquareBracket, CGlyphOperator);
CWhiteSquareBracket.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 5.587255859375 * betta;
    var width = 11.99444444444 * betta;
    return {
        width: width,
        height: height
    };
};
CWhiteSquareBracket.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 3225;
    Y[0] = 17055;
    X[1] = 3225;
    Y[1] = 26219;
    X[2] = 0;
    Y[2] = 26219;
    X[3] = 0;
    Y[3] = 0;
    X[4] = 77529;
    Y[4] = 0;
    X[5] = 77529;
    Y[5] = 26219;
    X[6] = 74304;
    Y[6] = 26219;
    X[7] = 74304;
    Y[7] = 17055;
    X[8] = 3225;
    Y[8] = 17055;
    X[9] = 74304;
    Y[9] = 12700;
    X[10] = 3225;
    Y[10] = 12700;
    X[11] = 3225;
    Y[11] = 4600;
    X[12] = 74304;
    Y[12] = 4600;
    X[13] = 74304;
    Y[13] = 12700;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    var shY = (Y[1] - Y[0]) * alpha;
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha + shY;
    }
    var lngY = stretch - X[4] * alpha;
    for (var i = 0; i < 4; i++) {
        XX[4 + i] += lngY;
    }
    XX[12] += lngY;
    XX[13] += lngY;
    var W = XX[4],
    H = YY[3];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CWhiteSquareBracket.prototype.drawPath = function (pGraphics, XX, YY, PDSE) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics.df();
    var BgColor = this.Parent.Make_ShdColor(PDSE);
    pGraphics.b_color1(BgColor.r, BgColor.g, BgColor.b, 255);
    pGraphics._s();
    pGraphics._m(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._l(XX[12], YY[12]);
    pGraphics._l(XX[13], YY[13]);
};
function COperatorDoubleLine() {
    CGlyphOperator.call(this);
}
Asc.extendClass(COperatorDoubleLine, CGlyphOperator);
COperatorDoubleLine.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 6.715869140624999 * betta,
    width = 11.99444444444 * betta;
    return {
        width: width,
        height: height
    };
};
COperatorDoubleLine.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 0;
    X[1] = 0;
    Y[1] = 5900;
    X[2] = 77504;
    Y[2] = 5900;
    X[3] = 77504;
    Y[3] = 0;
    X[4] = 0;
    Y[4] = 0;
    X[5] = 0;
    Y[5] = 18112;
    X[6] = 0;
    Y[6] = 24012;
    X[7] = 77504;
    Y[7] = 24012;
    X[8] = 77504;
    Y[8] = 18112;
    X[9] = 0;
    Y[9] = 18112;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    var shY = 0;
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha + shY;
    }
    for (var i = 0; i < 2; i++) {
        XX[2 + i] = stretch;
        XX[7 + i] = stretch;
    }
    var W = XX[7],
    H = YY[7];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
COperatorDoubleLine.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics.df();
    pGraphics._s();
    pGraphics._m(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
};
function CSingleArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CSingleArrow, CGlyphOperator);
CSingleArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 5.946923828125 * betta;
    var width = 10.6412109375 * betta;
    return {
        width: width,
        height: height
    };
};
CSingleArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 56138;
    Y[0] = 12300;
    X[1] = 8363;
    Y[1] = 12300;
    X[2] = 16313;
    Y[2] = 2212;
    X[3] = 13950;
    Y[3] = 0;
    X[4] = 0;
    Y[4] = 13650;
    X[5] = 0;
    Y[5] = 16238;
    X[6] = 13950;
    Y[6] = 29925;
    X[7] = 16313;
    Y[7] = 27712;
    X[8] = 8363;
    Y[8] = 17625;
    X[9] = 56138;
    Y[9] = 17625;
    X[10] = 56138;
    Y[10] = 12300;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var lng = stretch;
    if (lng > XX[9]) {
        XX[0] = lng;
        XX[9] = lng;
        XX[10] = lng;
    }
    var W = XX[9],
    H = YY[6];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CSingleArrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
};
function CLeftRightArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CLeftRightArrow, CGlyphOperator);
CLeftRightArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 5.946923828125 * betta;
    var width = 11.69541015625 * betta;
    return {
        width: width,
        height: height
    };
};
CLeftRightArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 16950;
    Y[0] = 28912;
    X[1] = 14738;
    Y[1] = 30975;
    X[2] = 0;
    Y[2] = 16687;
    X[3] = 0;
    Y[3] = 14287;
    X[4] = 14738;
    Y[4] = 0;
    X[5] = 16950;
    Y[5] = 2062;
    X[6] = 8363;
    Y[6] = 12975;
    X[7] = 53738;
    Y[7] = 12975;
    X[8] = 45150;
    Y[8] = 2062;
    X[9] = 47363;
    Y[9] = 0;
    X[10] = 62100;
    Y[10] = 14287;
    X[11] = 62100;
    Y[11] = 16687;
    X[12] = 47363;
    Y[12] = 30975;
    X[13] = 45150;
    Y[13] = 28912;
    X[14] = 53738;
    Y[14] = 17962;
    X[15] = 8363;
    Y[15] = 17962;
    X[16] = 16950;
    Y[16] = 28912;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var w = X[10] * alpha;
    var lng = stretch - w;
    if (lng > 0) {
        for (var i = 0; i < 8; i++) {
            XX[7 + i] += lng;
        }
    }
    var W = XX[10],
    H = YY[1];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CLeftRightArrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._l(XX[12], YY[12]);
    pGraphics._l(XX[13], YY[13]);
    pGraphics._l(XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics._l(XX[16], YY[16]);
};
function CDoubleArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CDoubleArrow, CGlyphOperator);
CDoubleArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 6.702777777777778 * betta;
    var width = 10.994677734375 * betta;
    return {
        width: width,
        height: height
    };
};
CDoubleArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 14738;
    Y[0] = 29764;
    X[1] = 20775;
    Y[1] = 37002;
    X[2] = 18338;
    Y[2] = 39064;
    X[3] = 0;
    Y[3] = 20731;
    X[4] = 0;
    Y[4] = 18334;
    X[5] = 18338;
    Y[5] = 0;
    X[6] = 20775;
    Y[6] = 2063;
    X[7] = 14775;
    Y[7] = 9225;
    X[8] = 57600;
    Y[8] = 9225;
    X[9] = 57600;
    Y[9] = 14213;
    X[10] = 10950;
    Y[10] = 14213;
    X[11] = 6638;
    Y[11] = 19532;
    X[12] = 10875;
    Y[12] = 24777;
    X[13] = 57600;
    Y[13] = 24777;
    X[14] = 57600;
    Y[14] = 29764;
    X[15] = 14738;
    Y[15] = 29764;
    X[16] = 58950;
    Y[16] = 19495;
    X[17] = 58950;
    Y[17] = 19495;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var lng = stretch - 10000 * alpha;
    if (lng > XX[16]) {
        XX[8] = lng;
        XX[9] = lng;
        XX[13] = lng;
        XX[14] = lng;
        XX[16] = lng;
        XX[17] = lng;
    }
    var W = XX[16],
    H = YY[2];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CDoubleArrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._l(XX[12], YY[12]);
    pGraphics._l(XX[13], YY[13]);
    pGraphics._l(XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics.df();
    pGraphics._s();
    pGraphics._m(XX[16], YY[16]);
    pGraphics._l(XX[17], YY[17]);
};
function CLR_DoubleArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CLR_DoubleArrow, CGlyphOperator);
CLR_DoubleArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 6.702777777777778 * betta;
    var width = 13.146484375 * betta;
    return {
        width: width,
        height: height
    };
};
CLR_DoubleArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 14775;
    Y[0] = 9225;
    X[1] = 56063;
    Y[1] = 9225;
    X[2] = 50100;
    Y[2] = 2063;
    X[3] = 52538;
    Y[3] = 0;
    X[4] = 70875;
    Y[4] = 18334;
    X[5] = 70875;
    Y[5] = 20731;
    X[6] = 52538;
    Y[6] = 39064;
    X[7] = 50100;
    Y[7] = 37002;
    X[8] = 56138;
    Y[8] = 29764;
    X[9] = 14738;
    Y[9] = 29764;
    X[10] = 20775;
    Y[10] = 37002;
    X[11] = 18338;
    Y[11] = 39064;
    X[12] = 0;
    Y[12] = 20731;
    X[13] = 0;
    Y[13] = 18334;
    X[14] = 18338;
    Y[14] = 0;
    X[15] = 20775;
    Y[15] = 2063;
    X[16] = 14775;
    Y[16] = 9225;
    X[17] = 10950;
    Y[17] = 14213;
    X[18] = 6638;
    Y[18] = 19532;
    X[19] = 10875;
    Y[19] = 24777;
    X[20] = 59963;
    Y[20] = 24777;
    X[21] = 64238;
    Y[21] = 19532;
    X[22] = 59925;
    Y[22] = 14213;
    X[23] = 59925;
    Y[23] = 14213;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var w = XX[4];
    var lng = stretch - 10000 * alpha - w;
    for (var i = 1; i < 9; i++) {
        XX[i] += lng;
    }
    for (var i = 0; i < 3; i++) {
        XX[20 + i] += lng;
    }
    var W = XX[4],
    H = YY[11];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CLR_DoubleArrow.prototype.drawPath = function (pGraphics, XX, YY, PDSE) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._l(XX[12], YY[12]);
    pGraphics._l(XX[13], YY[13]);
    pGraphics._l(XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics._l(XX[16], YY[16]);
    pGraphics.df();
    var BgColor = this.Parent.Make_ShdColor(PDSE);
    pGraphics.b_color1(BgColor.r, BgColor.g, BgColor.b, 255);
    pGraphics._s();
    pGraphics._m(XX[17], YY[17]);
    pGraphics._l(XX[18], YY[18]);
    pGraphics._l(XX[19], YY[19]);
    pGraphics._l(XX[20], YY[20]);
    pGraphics._l(XX[21], YY[21]);
    pGraphics._l(XX[22], YY[22]);
    pGraphics._l(XX[23], YY[23]);
};
function CCombiningArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CCombiningArrow, CGlyphOperator);
CCombiningArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 3.9 * betta;
    var width = 4.938 * betta;
    return {
        width: width,
        height: height
    };
};
CCombiningArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 8137;
    X[1] = 9413;
    Y[1] = 0;
    X[2] = 11400;
    Y[2] = 2250;
    X[3] = 5400;
    Y[3] = 7462;
    X[4] = 28275;
    Y[4] = 7462;
    X[5] = 28275;
    Y[5] = 10987;
    X[6] = 5400;
    Y[6] = 10987;
    X[7] = 11400;
    Y[7] = 16200;
    X[8] = 9413;
    Y[8] = 18450;
    X[9] = 0;
    Y[9] = 10312;
    X[10] = 0;
    Y[10] = 8137;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    XX[4] = XX[5] = stretch;
    var W = XX[4],
    H = YY[8];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
CCombiningArrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
};
function CCombiningHalfArrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CCombiningHalfArrow, CGlyphOperator);
CCombiningHalfArrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 3.88 * betta;
    var width = 4.938 * betta;
    return {
        width: width,
        height: height
    };
};
CCombiningHalfArrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
};
CCombiningHalfArrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 8137;
    X[1] = 9413;
    Y[1] = 0;
    X[2] = 11400;
    Y[2] = 2250;
    X[3] = 5400;
    Y[3] = 7462;
    X[4] = 28275;
    Y[4] = 7462;
    X[5] = 28275;
    Y[5] = 10987;
    X[6] = 0;
    Y[6] = 10987;
    X[7] = 0;
    Y[7] = 8137;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    XX[4] = XX[5] = stretch;
    var W = XX[4],
    H = YY[5];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
function CCombining_LR_Arrow() {
    CGlyphOperator.call(this);
}
Asc.extendClass(CCombining_LR_Arrow, CGlyphOperator);
CCombining_LR_Arrow.prototype.calcSize = function () {
    var betta = this.getCtrPrp().FontSize / 36;
    var height = 3.88 * betta;
    var width = 4.938 * betta;
    return {
        width: width,
        height: height
    };
};
CCombining_LR_Arrow.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._l(XX[12], YY[12]);
    pGraphics._l(XX[13], YY[13]);
    pGraphics._l(XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics._l(XX[16], YY[16]);
};
CCombining_LR_Arrow.prototype.calcCoord = function (stretch) {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 8137;
    X[1] = 9413;
    Y[1] = 0;
    X[2] = 11400;
    Y[2] = 2250;
    X[3] = 5400;
    Y[3] = 7462;
    X[4] = 42225;
    Y[4] = 7462;
    X[5] = 36225;
    Y[5] = 2250;
    X[6] = 38213;
    Y[6] = 0;
    X[7] = 47625;
    Y[7] = 8137;
    X[8] = 47625;
    Y[8] = 10312;
    X[9] = 38213;
    Y[9] = 18450;
    X[10] = 36225;
    Y[10] = 16200;
    X[11] = 42225;
    Y[11] = 10987;
    X[12] = 5400;
    Y[12] = 10987;
    X[13] = 11400;
    Y[13] = 16200;
    X[14] = 9413;
    Y[14] = 18450;
    X[15] = 0;
    Y[15] = 10312;
    X[16] = 0;
    Y[16] = 8137;
    var textScale = this.getCtrPrp().FontSize / 1000;
    var alpha = textScale * 25.4 / 96 / 64;
    var XX = [],
    YY = [];
    for (var i = 0; i < X.length; i++) {
        XX[i] = X[i] * alpha;
        YY[i] = Y[i] * alpha;
    }
    var lng = stretch - XX[7];
    for (var i = 0; i < 8; i++) {
        XX[4 + i] += lng;
    }
    var W = XX[7],
    H = YY[9];
    return {
        XX: XX,
        YY: YY,
        W: W,
        H: H
    };
};
function COperator(type) {
    this.ParaMath = null;
    this.type = type;
    this.operator = null;
    this.code = null;
    this.typeOper = null;
    this.defaultType = null;
    this.grow = true;
    this.Positions = [];
    this.coordGlyph = null;
    this.size = new CMathSize();
}
COperator.prototype.mergeProperties = function (properties, defaultProps) {
    var props = this.getProps(properties, defaultProps);
    this.grow = properties.grow;
    var operator = null,
    typeOper = null,
    codeChr = null;
    var type = props.type,
    location = props.loc,
    code = props.code;
    var prp = {};
    if (code === 40 || type === PARENTHESIS_LEFT) {
        codeChr = 40;
        typeOper = PARENTHESIS_LEFT;
        operator = new COperatorParenthesis();
        prp = {
            location: location,
            turn: TURN_0
        };
        operator.init(prp);
    } else {
        if (code === 41 || type === PARENTHESIS_RIGHT) {
            codeChr = 41;
            typeOper = PARENTHESIS_RIGHT;
            operator = new COperatorParenthesis();
            prp = {
                location: location,
                turn: TURN_180
            };
            operator.init(prp);
        } else {
            if (code == 123 || type === BRACKET_CURLY_LEFT) {
                codeChr = 123;
                typeOper = BRACKET_CURLY_LEFT;
                operator = new COperatorBracket();
                prp = {
                    location: location,
                    turn: TURN_0
                };
                operator.init(prp);
            } else {
                if (code === 125 || type === BRACKET_CURLY_RIGHT) {
                    codeChr = 125;
                    typeOper = BRACKET_CURLY_RIGHT;
                    operator = new COperatorBracket();
                    prp = {
                        location: location,
                        turn: TURN_180
                    };
                    operator.init(prp);
                } else {
                    if (code === 91 || type === BRACKET_SQUARE_LEFT) {
                        codeChr = 91;
                        typeOper = BRACKET_SQUARE_LEFT;
                        operator = new CSquareBracket();
                        prp = {
                            location: location,
                            turn: TURN_0
                        };
                        operator.init(prp);
                    } else {
                        if (code === 93 || type === BRACKET_SQUARE_RIGHT) {
                            codeChr = 93;
                            typeOper = BRACKET_SQUARE_RIGHT;
                            operator = new CSquareBracket();
                            prp = {
                                location: location,
                                turn: TURN_180
                            };
                            operator.init(prp);
                        } else {
                            if (code === 10216 || type === BRACKET_ANGLE_LEFT) {
                                codeChr = 10216;
                                typeOper = BRACKET_ANGLE_LEFT;
                                operator = new COperatorAngleBracket();
                                prp = {
                                    location: location,
                                    turn: TURN_0
                                };
                                operator.init(prp);
                            } else {
                                if (code === 10217 || type === BRACKET_ANGLE_RIGHT) {
                                    codeChr = 10217;
                                    typeOper = BRACKET_ANGLE_RIGHT;
                                    operator = new COperatorAngleBracket();
                                    prp = {
                                        location: location,
                                        turn: TURN_180
                                    };
                                    operator.init(prp);
                                } else {
                                    if (code === 124 || type === DELIMITER_LINE) {
                                        codeChr = 124;
                                        typeOper = DELIMITER_LINE;
                                        operator = new COperatorLine();
                                        prp = {
                                            location: location,
                                            turn: TURN_0
                                        };
                                        operator.init(prp);
                                    } else {
                                        if (code === 8970 || type === HALF_SQUARE_LEFT) {
                                            codeChr = 8970;
                                            typeOper = HALF_SQUARE_LEFT;
                                            operator = new CHalfSquareBracket();
                                            prp = {
                                                location: location,
                                                turn: TURN_0
                                            };
                                            operator.init(prp);
                                        } else {
                                            if (code === 8971 || type == HALF_SQUARE_RIGHT) {
                                                codeChr = 8971;
                                                typeOper = HALF_SQUARE_RIGHT;
                                                operator = new CHalfSquareBracket();
                                                prp = {
                                                    location: location,
                                                    turn: TURN_180
                                                };
                                                operator.init(prp);
                                            } else {
                                                if (code === 8968 || type == HALF_SQUARE_LEFT_UPPER) {
                                                    codeChr = 8968;
                                                    typeOper = HALF_SQUARE_LEFT_UPPER;
                                                    operator = new CHalfSquareBracket();
                                                    prp = {
                                                        location: location,
                                                        turn: TURN_MIRROR_0
                                                    };
                                                    operator.init(prp);
                                                } else {
                                                    if (code === 8969 || type == HALF_SQUARE_RIGHT_UPPER) {
                                                        codeChr = 8969;
                                                        typeOper = HALF_SQUARE_RIGHT_UPPER;
                                                        operator = new CHalfSquareBracket();
                                                        prp = {
                                                            location: location,
                                                            turn: TURN_MIRROR_180
                                                        };
                                                        operator.init(prp);
                                                    } else {
                                                        if (code === 8214 || type == DELIMITER_DOUBLE_LINE) {
                                                            codeChr = 8214;
                                                            typeOper = DELIMITER_DOUBLE_LINE;
                                                            operator = new COperatorDoubleLine();
                                                            prp = {
                                                                location: location,
                                                                turn: TURN_0
                                                            };
                                                            operator.init(prp);
                                                        } else {
                                                            if (code === 10214 || type == WHITE_SQUARE_LEFT) {
                                                                codeChr = 10214;
                                                                typeOper = WHITE_SQUARE_LEFT;
                                                                operator = new CWhiteSquareBracket();
                                                                prp = {
                                                                    location: location,
                                                                    turn: TURN_0
                                                                };
                                                                operator.init(prp);
                                                            } else {
                                                                if (code === 10215 || type == WHITE_SQUARE_RIGHT) {
                                                                    codeChr = 10215;
                                                                    typeOper = WHITE_SQUARE_RIGHT;
                                                                    operator = new CWhiteSquareBracket();
                                                                    prp = {
                                                                        location: location,
                                                                        turn: TURN_180
                                                                    };
                                                                    operator.init(prp);
                                                                } else {
                                                                    if (type === OPERATOR_EMPTY) {
                                                                        typeOper = OPERATOR_EMPTY;
                                                                        operator = -1;
                                                                    } else {
                                                                        if (code === 8406 || type === ACCENT_ARROW_LEFT) {
                                                                            codeChr = 8406;
                                                                            typeOper = ACCENT_ARROW_LEFT;
                                                                            operator = new CCombiningArrow();
                                                                            prp = {
                                                                                location: LOCATION_TOP,
                                                                                turn: TURN_0
                                                                            };
                                                                            operator.init(prp);
                                                                        } else {
                                                                            if (code === 8407 || type === ACCENT_ARROW_RIGHT) {
                                                                                typeOper = ACCENT_ARROW_RIGHT;
                                                                                codeChr = 8407;
                                                                                operator = new CCombiningArrow();
                                                                                prp = {
                                                                                    location: LOCATION_TOP,
                                                                                    turn: TURN_180
                                                                                };
                                                                                operator.init(prp);
                                                                            } else {
                                                                                if (code === 8417 || type === ACCENT_ARROW_LR) {
                                                                                    typeOper = ACCENT_ARROW_LR;
                                                                                    codeChr = 8417;
                                                                                    operator = new CCombining_LR_Arrow();
                                                                                    prp = {
                                                                                        location: LOCATION_TOP,
                                                                                        turn: TURN_0
                                                                                    };
                                                                                    operator.init(prp);
                                                                                } else {
                                                                                    if (code === 8400 || type === ACCENT_HALF_ARROW_LEFT) {
                                                                                        typeOper = ACCENT_HALF_ARROW_LEFT;
                                                                                        codeChr = 8400;
                                                                                        operator = new CCombiningHalfArrow();
                                                                                        prp = {
                                                                                            location: LOCATION_TOP,
                                                                                            turn: TURN_0
                                                                                        };
                                                                                        operator.init(prp);
                                                                                    } else {
                                                                                        if (code === 8401 || type === ACCENT_HALF_ARROW_RIGHT) {
                                                                                            typeOper = ACCENT_HALF_ARROW_RIGHT;
                                                                                            codeChr = 8401;
                                                                                            operator = new CCombiningHalfArrow();
                                                                                            prp = {
                                                                                                location: LOCATION_TOP,
                                                                                                turn: TURN_180
                                                                                            };
                                                                                            operator.init(prp);
                                                                                        } else {
                                                                                            if (code === 770 || type === ACCENT_CIRCUMFLEX) {
                                                                                                typeOper = ACCENT_CIRCUMFLEX;
                                                                                                codeChr = 770;
                                                                                                operator = new CAccentCircumflex();
                                                                                                prp = {
                                                                                                    location: LOCATION_TOP,
                                                                                                    turn: TURN_MIRROR_0,
                                                                                                    bStretch: false
                                                                                                };
                                                                                                operator.init(prp);
                                                                                            } else {
                                                                                                if (code === 780 || type === ACCENT_COMB_CARON) {
                                                                                                    typeOper = ACCENT_COMB_CARON;
                                                                                                    codeChr = 780;
                                                                                                    operator = new CAccentCircumflex();
                                                                                                    prp = {
                                                                                                        location: LOCATION_TOP,
                                                                                                        turn: TURN_0,
                                                                                                        bStretch: false
                                                                                                    };
                                                                                                    operator.init(prp);
                                                                                                } else {
                                                                                                    if (code === 773 || type === ACCENT_LINE) {
                                                                                                        typeOper = ACCENT_LINE;
                                                                                                        codeChr = 773;
                                                                                                        operator = new CAccentLine();
                                                                                                        prp = {
                                                                                                            location: LOCATION_TOP,
                                                                                                            turn: TURN_0
                                                                                                        };
                                                                                                        operator.init(prp);
                                                                                                    } else {
                                                                                                        if (code === 831 || type === ACCENT_DOUBLE_LINE) {
                                                                                                            typeOper = ACCENT_DOUBLE_LINE;
                                                                                                            codeChr = 831;
                                                                                                            operator = new CAccentDoubleLine();
                                                                                                            prp = {
                                                                                                                location: LOCATION_TOP,
                                                                                                                turn: TURN_0
                                                                                                            };
                                                                                                            operator.init(prp);
                                                                                                        } else {
                                                                                                            if (code === 771 || type === ACCENT_TILDE) {
                                                                                                                typeOper = ACCENT_TILDE;
                                                                                                                codeChr = 771;
                                                                                                                operator = new CAccentTilde();
                                                                                                                prp = {
                                                                                                                    location: LOCATION_TOP,
                                                                                                                    turn: TURN_0,
                                                                                                                    bStretch: false
                                                                                                                };
                                                                                                                operator.init(prp);
                                                                                                            } else {
                                                                                                                if (code === 774 || type === ACCENT_BREVE) {
                                                                                                                    typeOper = ACCENT_BREVE;
                                                                                                                    codeChr = 774;
                                                                                                                    operator = new CAccentBreve();
                                                                                                                    prp = {
                                                                                                                        location: LOCATION_TOP,
                                                                                                                        turn: TURN_MIRROR_0,
                                                                                                                        bStretch: false
                                                                                                                    };
                                                                                                                    operator.init(prp);
                                                                                                                } else {
                                                                                                                    if (code == 785 || type == ACCENT_INVERT_BREVE) {
                                                                                                                        typeOper = ACCENT_INVERT_BREVE;
                                                                                                                        codeChr = 785;
                                                                                                                        operator = new CAccentBreve();
                                                                                                                        prp = {
                                                                                                                            location: LOCATION_TOP,
                                                                                                                            turn: TURN_0,
                                                                                                                            bStretch: false
                                                                                                                        };
                                                                                                                        operator.init(prp);
                                                                                                                    } else {
                                                                                                                        if (code === 9182 || type == BRACKET_CURLY_TOP) {
                                                                                                                            codeChr = 9182;
                                                                                                                            typeOper = BRACKET_CURLY_TOP;
                                                                                                                            operator = new COperatorBracket();
                                                                                                                            prp = {
                                                                                                                                location: location,
                                                                                                                                turn: TURN_0
                                                                                                                            };
                                                                                                                            operator.init(prp);
                                                                                                                        } else {
                                                                                                                            if (code === 9183 || type === BRACKET_CURLY_BOTTOM) {
                                                                                                                                codeChr = 9183;
                                                                                                                                typeOper = BRACKET_CURLY_BOTTOM;
                                                                                                                                operator = new COperatorBracket();
                                                                                                                                prp = {
                                                                                                                                    location: location,
                                                                                                                                    turn: TURN_MIRROR_0
                                                                                                                                };
                                                                                                                                operator.init(prp);
                                                                                                                            } else {
                                                                                                                                if (code === 9180 || type === PARENTHESIS_TOP) {
                                                                                                                                    codeChr = 9180;
                                                                                                                                    typeOper = PARENTHESIS_TOP;
                                                                                                                                    operator = new COperatorParenthesis();
                                                                                                                                    prp = {
                                                                                                                                        location: location,
                                                                                                                                        turn: TURN_0
                                                                                                                                    };
                                                                                                                                    operator.init(prp);
                                                                                                                                } else {
                                                                                                                                    if (code === 9181 || type === PARENTHESIS_BOTTOM) {
                                                                                                                                        codeChr = 9181;
                                                                                                                                        typeOper = PARENTHESIS_BOTTOM;
                                                                                                                                        operator = new COperatorParenthesis();
                                                                                                                                        prp = {
                                                                                                                                            location: location,
                                                                                                                                            turn: TURN_MIRROR_0
                                                                                                                                        };
                                                                                                                                        operator.init(prp);
                                                                                                                                    } else {
                                                                                                                                        if (code === 9184 || type === BRACKET_SQUARE_TOP) {
                                                                                                                                            codeChr = 9184;
                                                                                                                                            typeOper = BRACKET_SQUARE_TOP;
                                                                                                                                            operator = new CSquareBracket();
                                                                                                                                            prp = {
                                                                                                                                                location: location,
                                                                                                                                                turn: TURN_0
                                                                                                                                            };
                                                                                                                                            operator.init(prp);
                                                                                                                                        } else {
                                                                                                                                            if (code === 8592 || type === ARROW_LEFT) {
                                                                                                                                                codeChr = 8592;
                                                                                                                                                typeOper = ARROW_LEFT;
                                                                                                                                                operator = new CSingleArrow();
                                                                                                                                                prp = {
                                                                                                                                                    location: location,
                                                                                                                                                    turn: TURN_0
                                                                                                                                                };
                                                                                                                                                operator.init(prp);
                                                                                                                                            } else {
                                                                                                                                                if (code === 8594 || type === ARROW_RIGHT) {
                                                                                                                                                    codeChr = 8594;
                                                                                                                                                    typeOper = ARROW_RIGHT;
                                                                                                                                                    operator = new CSingleArrow();
                                                                                                                                                    prp = {
                                                                                                                                                        location: location,
                                                                                                                                                        turn: TURN_180
                                                                                                                                                    };
                                                                                                                                                    operator.init(prp);
                                                                                                                                                } else {
                                                                                                                                                    if (code === 8596 || type === ARROW_LR) {
                                                                                                                                                        codeChr = 8596;
                                                                                                                                                        typeOper = ARROW_LR;
                                                                                                                                                        operator = new CLeftRightArrow();
                                                                                                                                                        prp = {
                                                                                                                                                            location: location,
                                                                                                                                                            turn: TURN_0
                                                                                                                                                        };
                                                                                                                                                        operator.init(prp);
                                                                                                                                                    } else {
                                                                                                                                                        if (code === 8656 || type === DOUBLE_LEFT_ARROW) {
                                                                                                                                                            codeChr = 8656;
                                                                                                                                                            typeOper = DOUBLE_LEFT_ARROW;
                                                                                                                                                            operator = new CDoubleArrow();
                                                                                                                                                            prp = {
                                                                                                                                                                location: location,
                                                                                                                                                                turn: TURN_0
                                                                                                                                                            };
                                                                                                                                                            operator.init(prp);
                                                                                                                                                        } else {
                                                                                                                                                            if (code === 8658 || type === DOUBLE_RIGHT_ARROW) {
                                                                                                                                                                codeChr = 8658;
                                                                                                                                                                typeOper = DOUBLE_RIGHT_ARROW;
                                                                                                                                                                operator = new CDoubleArrow();
                                                                                                                                                                prp = {
                                                                                                                                                                    location: location,
                                                                                                                                                                    turn: TURN_180
                                                                                                                                                                };
                                                                                                                                                                operator.init(prp);
                                                                                                                                                            } else {
                                                                                                                                                                if (code === 8660 || type === DOUBLE_ARROW_LR) {
                                                                                                                                                                    codeChr = 8660;
                                                                                                                                                                    typeOper = DOUBLE_ARROW_LR;
                                                                                                                                                                    operator = new CLR_DoubleArrow();
                                                                                                                                                                    prp = {
                                                                                                                                                                        location: location,
                                                                                                                                                                        turn: TURN_0
                                                                                                                                                                    };
                                                                                                                                                                    operator.init(prp);
                                                                                                                                                                } else {
                                                                                                                                                                    if (code !== null) {
                                                                                                                                                                        codeChr = code;
                                                                                                                                                                        typeOper = OPERATOR_TEXT;
                                                                                                                                                                        operator = new CMathText(true);
                                                                                                                                                                        operator.add(code);
                                                                                                                                                                    } else {
                                                                                                                                                                        operator = -1;
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
            }
        }
    }
    this.operator = operator;
    this.code = codeChr;
    this.typeOper = typeOper;
};
COperator.prototype.getProps = function (props, defaultProps) {
    var location = props.loc,
    chr = props.chr,
    type = props.type;
    var code = props.chr;
    this.defaultType = defaultProps.type;
    var bDelimiter = this.type == OPER_DELIMITER || this.type == OPER_SEPARATOR,
    bNotType = typeof(props.type) == "undefined" || props.type == null,
    bUnicodeChr = props.chr !== null && props.chr + 0 == props.chr;
    if (bDelimiter && props.chr == -1) {
        type = OPERATOR_EMPTY;
    } else {
        if (bNotType && !bUnicodeChr) {
            type = defaultProps.type;
        }
    }
    var bLoc = props.loc !== null && typeof(props.loc) !== "undefined";
    var bDefaultLoc = defaultProps.loc !== null && typeof(defaultProps.loc) !== "undefined";
    if (!bLoc && bDefaultLoc) {
        location = defaultProps.loc;
    }
    return {
        loc: location,
        type: type,
        code: code
    };
};
COperator.prototype.draw = function (x, y, pGraphics, PDSE) {
    if (this.typeOper === OPERATOR_TEXT) {
        this.Make_ShdColor(PDSE);
        var ctrPrp = this.Get_TxtPrControlLetter();
        var Font = {
            FontSize: ctrPrp.FontSize,
            FontFamily: {
                Name: ctrPrp.FontFamily.Name,
                Index: ctrPrp.FontFamily.Index
            },
            Italic: false,
            Bold: false
        };
        pGraphics.SetFont(Font);
        this.operator.draw(x, y, pGraphics, PDSE);
    } else {
        if (this.IsLineGlyph()) {
            this.drawLines(x, y, pGraphics, PDSE);
        } else {
            if (this.type === OPER_SEPARATOR) {
                this.drawSeparator(x, y, pGraphics, PDSE);
            } else {
                this.drawOperator(x, y, pGraphics, PDSE);
            }
        }
    }
};
COperator.prototype.Make_ShdColor = function (PDSE) {
    return this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
};
COperator.prototype.drawOperator = function (absX, absY, pGraphics, PDSE) {
    if (this.typeOper !== OPERATOR_EMPTY) {
        var lng = this.coordGlyph.XX.length;
        var X = [],
        Y = [];
        var PosOper = this.Positions[0];
        for (var j = 0; j < lng; j++) {
            X.push(PosOper.x + absX + this.coordGlyph.XX[j]);
            Y.push(PosOper.y + absY + this.coordGlyph.YY[j]);
        }
        this.operator.draw(pGraphics, X, Y, PDSE);
    }
};
COperator.prototype.drawSeparator = function (absX, absY, pGraphics, PDSE) {
    if (this.typeOper !== OPERATOR_EMPTY) {
        var lng = this.coordGlyph.XX.length;
        for (var i = 0; i < this.Positions.length; i++) {
            var X = [],
            Y = [];
            var PosOper = this.Positions[i];
            for (var j = 0; j < lng; j++) {
                X.push(PosOper.x + absX + this.coordGlyph.XX[j]);
                Y.push(PosOper.y + absY + this.coordGlyph.YY[j]);
            }
            this.operator.draw(pGraphics, X, Y, PDSE);
        }
    }
};
COperator.prototype.drawLines = function (absX, absY, pGraphics, PDSE) {
    if (this.typeOper !== OPERATOR_EMPTY) {
        var PosOper = this.Positions[0];
        this.operator.drawOnlyLines(PosOper.x + absX, PosOper.y + absY, pGraphics, PDSE);
    }
};
COperator.prototype.IsLineGlyph = function () {
    return this.typeOper == ACCENT_LINE || this.typeOper == ACCENT_DOUBLE_LINE;
};
COperator.prototype.fixSize = function (oMeasure, stretch) {
    if (this.typeOper !== OPERATOR_EMPTY) {
        var width, height, ascent;
        var dims;
        var ctrPrp = this.Get_TxtPrControlLetter();
        var Font = {
            FontSize: ctrPrp.FontSize,
            FontFamily: {
                Name: ctrPrp.FontFamily.Name,
                Index: ctrPrp.FontFamily.Index
            },
            Italic: false,
            Bold: false
        };
        oMeasure.SetFont(Font);
        var bLine = this.IsLineGlyph();
        var bTopBot = this.operator.loc == LOCATION_TOP || this.operator.loc == LOCATION_BOT;
        if (this.typeOper == OPERATOR_TEXT) {
            this.operator.Resize(oMeasure, this);
            width = this.operator.size.width;
        } else {
            if (bLine) {
                this.operator.fixSize(stretch);
                width = this.operator.size.width;
            } else {
                var bNotStretchDelim = (this.type == OPER_DELIMITER || this.type == OPER_SEPARATOR) && this.grow == false;
                var StretchLng = bNotStretchDelim ? 0 : stretch;
                this.operator.fixSize(StretchLng);
                dims = this.operator.getCoordinateGlyph();
                this.coordGlyph = {
                    XX: dims.XX,
                    YY: dims.YY
                };
                width = bTopBot ? dims.Width : this.operator.size.width;
            }
        }
        var letterOperator = new CMathText(true);
        letterOperator.add(this.code);
        letterOperator.Resize(oMeasure, null);
        if (this.type === OPER_ACCENT) {
            var letterX = new CMathText(true);
            letterX.add(120);
            letterX.Resize(oMeasure, null);
            height = letterOperator.size.ascent - letterX.size.ascent;
        } else {
            if (this.typeOper == OPERATOR_TEXT) {
                height = this.operator.size.height;
            } else {
                if (bTopBot) {
                    height = this.operator.size.height;
                } else {
                    height = dims.Height;
                }
            }
        }
        var mgCtrPrp = this.Parent.Get_TxtPrControlLetter();
        var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
        if (!bLine && (this.operator.loc == LOCATION_TOP || this.operator.loc == LOCATION_BOT)) {
            ascent = dims.Height / 2;
        } else {
            ascent = height / 2 + shCenter;
        }
        this.size.width = width;
        this.size.height = height;
        this.size.ascent = ascent;
    }
};
COperator.prototype.setPosition = function (Positions) {
    if (this.type == OPER_SEPARATOR) {
        this.Positions = Positions;
    } else {
        this.Positions.length = 0;
        this.Positions[0] = Positions;
    }
    if (this.typeOper == OPERATOR_TEXT) {
        var NewPos = new CMathPosition();
        NewPos.x = this.Positions[0].x;
        NewPos.y = this.Positions[0].y;
        this.operator.setPosition(NewPos);
    }
};
COperator.prototype._setPosition = function (Positions) {
    if (this.type == OPER_SEPARATOR) {
        this.Positions = Positions;
    } else {
        this.Positions.length = 0;
        this.Positions[0] = Positions;
    }
    if (this.typeOper == OPERATOR_TEXT) {
        var NewPos = new CMathPosition();
        NewPos.x = this.Positions[0].x;
        if (this.type == OPER_ACCENT) {
            NewPos.y = this.Positions[0].y + this.operator.size.height;
        } else {
            NewPos.y = this.Positions[0].y;
        }
        this.operator.setPosition(NewPos);
    }
};
COperator.prototype.IsJustDraw = function () {
    return true;
};
COperator.prototype.Resize = function (oMeasure) {
    if (this.typeOper !== OPERATOR_EMPTY) {
        var bHor = this.operator.loc == 0 || this.operator.loc == 1;
        if (bHor) {
            this.fixSize(oMeasure, this.size.width);
        } else {
            this.fixSize(oMeasure, this.size.height);
        }
    }
};
COperator.prototype.PreRecalc = function (Parent, ParaMath) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    if (this.typeOper !== OPERATOR_EMPTY) {
        this.operator.PreRecalc(this);
    }
};
COperator.prototype.Get_TxtPrControlLetter = function () {
    return this.Parent.Get_TxtPrControlLetter();
};
COperator.prototype.getChr = function () {
    var chr = null;
    if (this.code !== null) {
        chr = this.typeOper == this.defaultType ? null : String.fromCharCode(this.code);
    }
    if (this.operator == OPERATOR_EMPTY) {
        chr = "";
    }
    return chr;
};
COperator.prototype.IsArrow = function () {
    var bArrow = this.typeOper == ARROW_LEFT || this.typeOper == ARROW_RIGHT || this.typeOper == ARROW_LR,
    bDoubleArrow = this.typeOper == DOUBLE_LEFT_ARROW || this.typeOper == DOUBLE_RIGHT_ARROW || this.typeOper == DOUBLE_ARROW_LR,
    bAccentArrow = his.typeOper == ACCENT_ARROW_LEFT || this.typeOper == ACCENT_ARROW_RIGHT || this.typeOper == ACCENT_ARROW_LR || this.typeOper == ACCENT_HALF_ARROW_LEFT || this.typeOper == ACCENT_HALF_ARROW_RIGHT;
    return bArrow || bDoubleArrow;
};
function CMathDelimiterPr() {
    this.begChr = undefined;
    this.begChrType = undefined;
    this.endChr = undefined;
    this.endChrType = undefined;
    this.sepChr = undefined;
    this.sepChrType = undefined;
    this.shp = DELIMITER_SHAPE_CENTERED;
    this.grow = true;
    this.column = 0;
}
CMathDelimiterPr.prototype.Set_FromObject = function (Obj) {
    this.begChr = Obj.begChr;
    this.begChrType = Obj.begChrType;
    this.endChr = Obj.endChr;
    this.endChrType = Obj.endChrType;
    this.sepChr = Obj.sepChr;
    this.sepChrType = Obj.sepChrType;
    if (DELIMITER_SHAPE_MATH === Obj.shp || DELIMITER_SHAPE_CENTERED === Obj.shp) {
        this.shp = Obj.shp;
    }
    if (false === Obj.grow || 0 === Obj.grow) {
        this.grow = false;
    }
    if (undefined !== Obj.column && null !== Obj.column) {
        this.column = Obj.column;
    } else {
        this.column = 1;
    }
};
CMathDelimiterPr.prototype.Copy = function () {
    var NewPr = new CMathDelimiterPr();
    NewPr.begChr = this.begChr;
    NewPr.begChrType = this.begChrType;
    NewPr.endChr = this.endChr;
    NewPr.endChrType = this.endChrType;
    NewPr.sepChr = this.sepChr;
    NewPr.sepChrType = this.sepChrType;
    NewPr.shp = this.shp;
    NewPr.grow = this.grow;
    NewPr.column = this.column;
    return NewPr;
};
CMathDelimiterPr.prototype.Write_ToBinary = function (Writer) {
    var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
    if (undefined !== this.begChr && this.begChr !== null) {
        Writer.WriteLong(this.begChr);
        Flags |= 1;
    }
    if (undefined !== this.begChrType && this.begChrType !== null) {
        Writer.WriteLong(this.begChrType);
        Flags |= 2;
    }
    if (undefined !== this.endChr && this.endChr !== null) {
        Writer.WriteLong(this.endChr);
        Flags |= 4;
    }
    if (undefined !== this.endChrType && this.endChrType !== null) {
        Writer.WriteLong(this.endChrType);
        Flags |= 8;
    }
    if (undefined !== this.sepChr && this.sepChr !== null) {
        Writer.WriteLong(this.sepChr);
        Flags |= 16;
    }
    if (undefined !== this.sepChrType && this.sepChrType !== null) {
        Writer.WriteLong(this.sepChrType);
        Flags |= 32;
    }
    var EndPos = Writer.GetCurPosition();
    Writer.Seek(StartPos);
    Writer.WriteLong(Flags);
    Writer.Seek(EndPos);
    Writer.WriteLong(this.shp);
    Writer.WriteBool(this.grow);
    Writer.WriteLong(this.column);
};
CMathDelimiterPr.prototype.Read_FromBinary = function (Reader) {
    var Flags = Reader.GetLong();
    if (Flags & 1) {
        this.begChr = Reader.GetLong();
    } else {
        this.begChr = undefined;
    }
    if (Flags & 2) {
        this.begChrType = Reader.GetLong();
    } else {
        this.begChrType = undefined;
    }
    if (Flags & 4) {
        this.endChr = Reader.GetLong();
    } else {
        this.endChr = undefined;
    }
    if (Flags & 8) {
        this.endChrType = Reader.GetLong();
    } else {
        this.endChrType = undefined;
    }
    if (Flags & 16) {
        this.sepChr = Reader.GetLong();
    } else {
        this.sepChr = undefined;
    }
    if (Flags & 32) {
        this.sepChrType = Reader.GetLong();
    } else {
        this.sepChrType = undefined;
    }
    this.shp = Reader.GetLong();
    this.grow = Reader.GetBool();
    this.column = Reader.GetLong();
};
function CDelimiter(props) {
    CDelimiter.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.begOper = new COperator(OPER_DELIMITER);
    this.endOper = new COperator(OPER_DELIMITER);
    this.sepOper = new COperator(OPER_SEPARATOR);
    this.Pr = new CMathDelimiterPr();
    this.TextInContent = true;
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CDelimiter, CMathBase);
CDelimiter.prototype.ClassType = historyitem_type_delimiter;
CDelimiter.prototype.kind = MATH_DELIMITER;
CDelimiter.prototype.init = function (props) {
    this.setProperties(props);
    this.Fill_LogicalContent(this.getColumnsCount());
    this.fillContent();
};
CDelimiter.prototype.getColumnsCount = function () {
    return this.Pr.column;
};
CDelimiter.prototype.fillContent = function () {
    var nColumnsCount = this.getColumnsCount();
    this.setDimension(1, nColumnsCount);
    for (var nIndex = 0; nIndex < nColumnsCount; nIndex++) {
        this.elements[0][nIndex] = this.Content[nIndex];
    }
};
CDelimiter.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps == true) {
        var begPrp = {
            chr: this.Pr.begChr,
            type: this.Pr.begChrType,
            grow: this.Pr.grow,
            loc: LOCATION_LEFT
        };
        var begDefaultPrp = {
            type: PARENTHESIS_LEFT,
            chr: 40
        };
        this.begOper.mergeProperties(begPrp, begDefaultPrp);
        var endPrp = {
            chr: this.Pr.endChr,
            type: this.Pr.endChrType,
            grow: this.Pr.grow,
            loc: LOCATION_RIGHT
        };
        var endDefaultPrp = {
            type: PARENTHESIS_RIGHT,
            chr: 41
        };
        this.endOper.mergeProperties(endPrp, endDefaultPrp);
        var sepPrp = {
            chr: this.Pr.sepChr,
            type: this.Pr.sepChrType,
            grow: this.Pr.grow,
            loc: LOCATION_SEP
        };
        var sepDefaultPrp = {
            type: DELIMITER_LINE,
            chr: 124
        };
        if (this.nCol == 1) {
            sepPrp.type = OPERATOR_EMPTY;
        }
        this.sepOper.mergeProperties(sepPrp, sepDefaultPrp);
        this.RecalcInfo.bProps = false;
    }
};
CDelimiter.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.ApplyProperties(RPI);
    this.begOper.PreRecalc(this, ParaMath);
    this.endOper.PreRecalc(this, ParaMath);
    this.sepOper.PreRecalc(this, ParaMath);
    CDelimiter.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, RPI, GapsInfo);
};
CDelimiter.prototype.Resize = function (oMeasure, RPI) {
    var heightG = 0,
    widthG = 0,
    ascentG = 0,
    descentG = 0;
    for (var j = 0; j < this.nCol; j++) {
        this.elements[0][j].Resize(oMeasure, RPI);
        var content = this.elements[0][j].size;
        widthG += content.width;
        ascentG = content.ascent > ascentG ? content.ascent : ascentG;
        descentG = content.height - content.ascent > descentG ? content.height - content.ascent : descentG;
    }
    heightG = ascentG + descentG;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    var maxAD = ascentG - shCenter > descentG + shCenter ? ascentG - shCenter : descentG + shCenter;
    var plH = this.ParaMath.GetPlh(oMeasure, mgCtrPrp);
    var bTextContent = ascentG < 1.01 * plH && (heightG - ascentG) < 0.4 * plH;
    var bCentered = this.Pr.shp == DELIMITER_SHAPE_CENTERED,
    b2Max = bCentered && (2 * maxAD - heightG > 0.001);
    this.TextInContent = bTextContent;
    var heightStretch = b2Max && !bTextContent ? 2 * maxAD : ascentG + descentG;
    this.begOper.fixSize(oMeasure, heightStretch);
    this.endOper.fixSize(oMeasure, heightStretch);
    this.sepOper.fixSize(oMeasure, heightStretch);
    var width = widthG + this.begOper.size.width + this.endOper.size.width + (this.nCol - 1) * this.sepOper.size.width;
    width += this.GapLeft + this.GapRight;
    var maxDimOper;
    if (this.begOper.size.height > this.endOper.size.height && this.begOper.size.height > this.sepOper.size.height) {
        maxDimOper = this.begOper.size;
    } else {
        if (this.endOper.size.height > this.sepOper.size.height) {
            maxDimOper = this.endOper.size;
        } else {
            maxDimOper = this.sepOper.size;
        }
    }
    var height, ascent, descent;
    if (this.Pr.shp == DELIMITER_SHAPE_CENTERED) {
        var deltaHeight = heightG - maxDimOper.height;
        if (deltaHeight < 0) {
            deltaHeight = -deltaHeight;
        }
        var deltaMaxAD = maxAD - maxDimOper.height / 2;
        if (deltaMaxAD < 0) {
            deltaMaxAD = -deltaMaxAD;
        }
        var deltaMinAD = (heightG - maxAD) - maxDimOper.height / 2;
        var bLHeight = deltaHeight < 0.001,
        bLMaxAD = deltaMaxAD > 0.001,
        bLMinAD = deltaMinAD > 0.001,
        bLText = deltaMinAD < -0.001;
        var bEqualOper = bLHeight,
        bMiddleOper = bLMaxAD && !bLMinAD,
        bLittleOper = bLMinAD,
        bText = bLText;
        if (bEqualOper) {
            height = 2 * maxAD;
            ascent = maxAD + shCenter;
        } else {
            if (bText) {
                ascent = ascentG > maxDimOper.ascent ? ascentG : maxDimOper.ascent;
                height = maxDimOper.height;
            } else {
                if (bMiddleOper) {
                    height = maxDimOper.height / 2 + maxAD;
                    ascent = ascentG > maxDimOper.ascent ? ascentG : maxDimOper.ascent;
                } else {
                    ascent = ascentG;
                    height = ascentG + descentG;
                }
            }
        }
    } else {
        g_oTextMeasurer.SetFont(mgCtrPrp);
        var Height = g_oTextMeasurer.GetHeight();
        if (heightG < Height) {
            ascent = ascentG > maxDimOper.ascent ? ascentG : maxDimOper.ascent;
            height = maxDimOper.height;
        } else {
            ascent = ascentG;
            height = ascentG + descentG;
        }
    }
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CDelimiter.prototype.alignOperator = function (operator) {
    var align = 0;
    var dimOper = operator.size;
    var bAlign = this.size.height - dimOper.height > 0.001;
    if (bAlign) {
        if (this.Pr.shp == DELIMITER_SHAPE_CENTERED) {
            align = this.size.ascent > dimOper.ascent ? this.size.ascent - dimOper.ascent : 0;
        } else {
            if (this.Pr.shp === DELIMITER_SHAPE_MATH) {
                var shCenter = dimOper.ascent - dimOper.height / 2;
                var k = 2 * (this.size.ascent - shCenter) / this.size.height;
                k = k > 1 / 4 ? k : 1 / 4;
                align = this.size.ascent - shCenter - k * (dimOper.ascent - shCenter);
            }
        }
    }
    return align;
};
CDelimiter.prototype.setPosition = function (position, PosInfo) {
    this.pos.x = position.x;
    this.pos.y = position.y - this.size.ascent;
    var x = this.pos.x + this.GapLeft,
    y = this.pos.y;
    var PosBegOper = new CMathPosition();
    PosBegOper.x = x;
    PosBegOper.y = y + this.alignOperator(this.begOper);
    this.begOper.setPosition(PosBegOper);
    x += this.begOper.size.width;
    var content = this.elements[0][0];
    var PosContent = new CMathPosition();
    PosContent.x = x;
    PosContent.y = y + this.align_2(content);
    x += content.size.width;
    content.setPosition(PosContent, PosInfo);
    var Positions = [];
    for (var j = 1; j < this.nCol; j++) {
        var PosSep = new CMathPosition();
        PosSep.x = x;
        PosSep.y = y + this.alignOperator(this.sepOper);
        Positions.push(PosSep);
        x += this.sepOper.size.width;
        content = this.elements[0][j];
        var NewPosContent = new CMathPosition();
        NewPosContent.x = x;
        NewPosContent.y = y + this.align_2(content);
        content.setPosition(NewPosContent, PosInfo);
        x += content.size.width;
    }
    this.sepOper.setPosition(Positions);
    var PosEndOper = new CMathPosition();
    PosEndOper.x = x;
    PosEndOper.y = y + this.alignOperator(this.endOper);
    this.endOper.setPosition(PosEndOper);
};
CDelimiter.prototype.draw = function (x, y, pGraphics, PDSE) {
    this.begOper.draw(x, y, pGraphics, PDSE);
    this.sepOper.draw(x, y, pGraphics, PDSE);
    this.endOper.draw(x, y, pGraphics, PDSE);
    for (var j = 0; j < this.nCol; j++) {
        this.elements[0][j].draw(x, y, pGraphics, PDSE);
    }
};
CDelimiter.prototype.align_2 = function (element) {
    var align = 0;
    if (!element.IsJustDraw()) {
        align = this.size.ascent - element.size.ascent;
    } else {
        align = (this.size.height - element.size.height) / 2;
    }
    return align;
};
CDelimiter.prototype.getBase = function (numb) {
    if (numb !== numb - 0) {
        numb = 0;
    }
    return this.elements[0][numb];
};
CDelimiter.prototype.getElementMathContent = function (Index) {
    return this.Content[Index];
};
CDelimiter.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Delimiter;
    MathProps.Pr = null;
};
CDelimiter.prototype.GetLastElement = function () {
    var Result;
    var IsEndOper = this.endOper.typeOper !== OPERATOR_EMPTY;
    var growLast = IsEndOper && this.Pr.grow == true && this.TextInContent,
    smallLast = IsEndOper && this.Pr.grow == false;
    if (growLast || smallLast || this.endOper.typeOper == OPERATOR_TEXT) {
        Result = this.endOper;
    } else {
        Result = this;
    }
    return Result;
};
CDelimiter.prototype.GetFirstElement = function () {
    var Result;
    var IsStrartOper = this.begOper.typeOper !== OPERATOR_EMPTY;
    var growLast = IsStrartOper && this.Pr.grow == true && this.TextInContent,
    smallLast = IsStrartOper && this.Pr.grow == false;
    if (growLast || smallLast || this.begOper.typeOper == OPERATOR_TEXT) {
        Result = this.begOper;
    } else {
        Result = this;
    }
    return Result;
};
function CCharacter() {
    this.operator = new COperator(OPER_GROUP_CHAR);
    CMathBase.call(this);
}
Asc.extendClass(CCharacter, CMathBase);
CCharacter.prototype.setCharacter = function (props, defaultProps) {
    this.operator.mergeProperties(props, defaultProps);
};
CCharacter.prototype.Resize = function (oMeasure, RPI) {
    var base = this.elements[0][0];
    base.Resize(oMeasure, RPI);
    this.operator.fixSize(oMeasure, base.size.width);
    var width = base.size.width > this.operator.size.width ? base.size.width : this.operator.size.width,
    height = base.size.height + this.operator.size.height,
    ascent = this.getAscent(oMeasure);
    width += this.GapLeft + this.GapRight;
    this.size = {
        height: height,
        width: width,
        ascent: ascent
    };
};
CCharacter.prototype.setPosition = function (pos, PosInfo) {
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;
    var width = this.size.width - this.GapLeft - this.GapRight;
    var alignOp = (width - this.operator.size.width) / 2,
    alignCnt = (width - this.elements[0][0].size.width) / 2;
    var PosOper = new CMathPosition(),
    PosBase = new CMathPosition();
    if (this.Pr.pos === LOCATION_TOP) {
        PosOper.x = this.pos.x + this.GapLeft + alignOp;
        PosOper.y = this.pos.y;
        this.operator.setPosition(PosOper);
        PosBase.x = this.pos.x + this.GapLeft + alignCnt;
        PosBase.y = this.pos.y + this.operator.size.height;
        this.elements[0][0].setPosition(PosBase, PosInfo);
    } else {
        if (this.Pr.pos === LOCATION_BOT) {
            PosBase.x = this.pos.x + this.GapLeft + alignCnt;
            PosBase.y = this.pos.y;
            this.elements[0][0].setPosition(PosBase, PosInfo);
            PosOper.x = this.pos.x + this.GapLeft + alignOp;
            PosOper.y = this.pos.y + this.elements[0][0].size.height;
            this.operator.setPosition(PosOper);
        }
    }
};
CCharacter.prototype.draw = function (x, y, pGraphics, PDSE) {
    this.elements[0][0].draw(x, y, pGraphics, PDSE);
    var ctrPrp = this.Get_TxtPrControlLetter();
    var Font = {
        FontSize: ctrPrp.FontSize,
        FontFamily: {
            Name: ctrPrp.FontFamily.Name,
            Index: ctrPrp.FontFamily.Index
        },
        Italic: false,
        Bold: false
    };
    pGraphics.SetFont(Font);
    this.operator.draw(x, y, pGraphics, PDSE);
};
CCharacter.prototype.getBase = function () {
    return this.elements[0][0];
};
function CMathGroupChrPr() {
    this.chr = undefined;
    this.chrType = undefined;
    this.vertJc = VJUST_TOP;
    this.pos = LOCATION_BOT;
}
CMathGroupChrPr.prototype.Set_FromObject = function (Obj) {
    this.chr = Obj.chr;
    this.chrType = Obj.chrType;
    if (VJUST_TOP === Obj.vertJc || VJUST_BOT === Obj.vertJc) {
        this.vertJc = Obj.vertJc;
    }
    if (LOCATION_TOP === Obj.pos || LOCATION_BOT === Obj.pos) {
        this.pos = Obj.pos;
    }
};
CMathGroupChrPr.prototype.Copy = function () {
    var NewPr = new CMathGroupChrPr();
    NewPr.chr = this.chr;
    NewPr.chrType = this.chrType;
    NewPr.vertJc = this.vertJc;
    NewPr.pos = this.pos;
    return NewPr;
};
CMathGroupChrPr.prototype.Write_ToBinary = function (Writer) {
    var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
    if (undefined !== this.chr) {
        Writer.WriteLong(this.chr);
        Flags |= 1;
    }
    if (undefined !== this.chrType) {
        Writer.WriteLong(this.chrType);
        Flags |= 2;
    }
    var EndPos = Writer.GetCurPosition();
    Writer.Seek(StartPos);
    Writer.WriteLong(Flags);
    Writer.Seek(EndPos);
    Writer.WriteLong(this.vertJc);
    Writer.WriteLong(this.pos);
};
CMathGroupChrPr.prototype.Read_FromBinary = function (Reader) {
    var Flags = Reader.GetLong();
    if (Flags & 1) {
        this.chr = Reader.GetLong();
    } else {
        this.chr = undefined;
    }
    if (Flags & 2) {
        this.chrType = Reader.GetLong();
    } else {
        this.chrType = undefined;
    }
    this.vertJc = Reader.GetLong();
    this.pos = Reader.GetLong();
};
function CGroupCharacter(props) {
    CGroupCharacter.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathGroupChrPr();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CGroupCharacter, CCharacter);
CGroupCharacter.prototype.ClassType = historyitem_type_groupChr;
CGroupCharacter.prototype.kind = MATH_GROUP_CHARACTER;
CGroupCharacter.prototype.init = function (props) {
    this.Fill_LogicalContent(1);
    this.setProperties(props);
    this.fillContent();
};
CGroupCharacter.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps == true) {
        var operDefaultPrp = {
            type: BRACKET_CURLY_BOTTOM,
            loc: LOCATION_BOT
        };
        var operProps = {
            type: this.Pr.chrType,
            chr: this.Pr.chr,
            loc: this.Pr.pos
        };
        this.setCharacter(operProps, operDefaultPrp);
        this.RecalcInfo.bProps = false;
        if (this.Pr.pos == this.Pr.vertJc) {
            var Iterator;
            if (this.Pr.pos == LOCATION_TOP) {
                Iterator = new CDenominator(this.getBase());
            } else {
                Iterator = new CNumerator(this.getBase());
            }
            this.elements[0][0] = Iterator;
        } else {
            this.elements[0][0] = this.getBase();
        }
    }
};
CGroupCharacter.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.ApplyProperties(RPI);
    this.operator.PreRecalc(this, ParaMath);
    var ArgSz = ArgSize.Copy();
    if (this.Pr.pos == this.Pr.vertJc) {
        ArgSz.decrease();
    }
    CGroupCharacter.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSz, RPI, GapsInfo);
};
CGroupCharacter.prototype.getBase = function () {
    return this.Content[0];
};
CGroupCharacter.prototype.fillContent = function () {
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CGroupCharacter.prototype.getAscent = function (oMeasure) {
    var ascent;
    var ctrPrp = this.Get_TxtPrControlLetter();
    var shCent = this.ParaMath.GetShiftCenter(oMeasure, ctrPrp);
    if (this.Pr.vertJc === VJUST_TOP && this.Pr.pos === LOCATION_TOP) {
        ascent = this.operator.size.ascent + shCent;
    } else {
        if (this.Pr.vertJc === VJUST_BOT && this.Pr.pos === LOCATION_TOP) {
            ascent = this.operator.size.height + this.elements[0][0].size.ascent;
        } else {
            if (this.Pr.vertJc === VJUST_TOP && this.Pr.pos === LOCATION_BOT) {
                ascent = this.elements[0][0].size.ascent;
            } else {
                if (this.Pr.vertJc === VJUST_BOT && this.Pr.pos === LOCATION_BOT) {
                    ascent = this.elements[0][0].size.height + shCent + this.operator.size.height - this.operator.size.ascent;
                }
            }
        }
    }
    return ascent;
};
CGroupCharacter.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.GroupChar;
    MathProps.Pr = null;
};