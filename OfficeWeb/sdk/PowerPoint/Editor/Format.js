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
 var TYPE_TRACK_SHAPE = 0;
var TYPE_TRACK_GROUP = TYPE_TRACK_SHAPE;
var TYPE_TRACK_GROUP_PASSIVE = 1;
var TYPE_TRACK_TEXT = 2;
var TYPE_TRACK_EMPTY_PH = 3;
var GLOBAL_BLIP_FILL_MAP = {};
var COLOR_TYPE_NONE = 0;
var COLOR_TYPE_SRGB = 1;
var COLOR_TYPE_PRST = 2;
var COLOR_TYPE_SCHEME = 3;
var COLOR_TYPE_SYS = 4;
var SLIDE_KIND = 0;
var LAYOUT_KIND = 1;
var MASTER_KIND = 2;
var map_prst_color = {};
map_prst_color["aliceBlue"] = 15792383;
map_prst_color["antiqueWhite"] = 16444375;
map_prst_color["aqua"] = 65535;
map_prst_color["aquamarine"] = 8388564;
map_prst_color["azure"] = 15794175;
map_prst_color["beige"] = 16119260;
map_prst_color["bisque"] = 16770244;
map_prst_color["black"] = 0;
map_prst_color["blanchedAlmond"] = 16772045;
map_prst_color["blue"] = 255;
map_prst_color["blueViolet"] = 9055202;
map_prst_color["brown"] = 10824234;
map_prst_color["burlyWood"] = 14596231;
map_prst_color["cadetBlue"] = 6266528;
map_prst_color["chartreuse"] = 8388352;
map_prst_color["chocolate"] = 13789470;
map_prst_color["coral"] = 16744272;
map_prst_color["cornflowerBlue"] = 6591981;
map_prst_color["cornsilk"] = 16775388;
map_prst_color["crimson"] = 14423100;
map_prst_color["cyan"] = 65535;
map_prst_color["darkBlue"] = 139;
map_prst_color["darkCyan"] = 35723;
map_prst_color["darkGoldenrod"] = 12092939;
map_prst_color["darkGray"] = 11119017;
map_prst_color["darkGreen"] = 25600;
map_prst_color["darkGrey"] = 11119017;
map_prst_color["darkKhaki"] = 12433259;
map_prst_color["darkMagenta"] = 9109643;
map_prst_color["darkOliveGreen"] = 5597999;
map_prst_color["darkOrange"] = 16747520;
map_prst_color["darkOrchid"] = 10040012;
map_prst_color["darkRed"] = 9109504;
map_prst_color["darkSalmon"] = 15308410;
map_prst_color["darkSeaGreen"] = 9419919;
map_prst_color["darkSlateBlue"] = 4734347;
map_prst_color["darkSlateGray"] = 3100495;
map_prst_color["darkSlateGrey"] = 3100495;
map_prst_color["darkTurquoise"] = 52945;
map_prst_color["darkViolet"] = 9699539;
map_prst_color["deepPink"] = 16716947;
map_prst_color["deepSkyBlue"] = 49151;
map_prst_color["dimGray"] = 6908265;
map_prst_color["dimGrey"] = 6908265;
map_prst_color["dkBlue"] = 139;
map_prst_color["dkCyan"] = 35723;
map_prst_color["dkGoldenrod"] = 12092939;
map_prst_color["dkGray"] = 11119017;
map_prst_color["dkGreen"] = 25600;
map_prst_color["dkGrey"] = 11119017;
map_prst_color["dkKhaki"] = 12433259;
map_prst_color["dkMagenta"] = 9109643;
map_prst_color["dkOliveGreen"] = 5597999;
map_prst_color["dkOrange"] = 16747520;
map_prst_color["dkOrchid"] = 10040012;
map_prst_color["dkRed"] = 9109504;
map_prst_color["dkSalmon"] = 15308410;
map_prst_color["dkSeaGreen"] = 9419915;
map_prst_color["dkSlateBlue"] = 4734347;
map_prst_color["dkSlateGray"] = 3100495;
map_prst_color["dkSlateGrey"] = 3100495;
map_prst_color["dkTurquoise"] = 52945;
map_prst_color["dkViolet"] = 9699539;
map_prst_color["dodgerBlue"] = 2003199;
map_prst_color["firebrick"] = 11674146;
map_prst_color["floralWhite"] = 16775920;
map_prst_color["forestGreen"] = 2263842;
map_prst_color["fuchsia"] = 16711935;
map_prst_color["gainsboro"] = 14474460;
map_prst_color["ghostWhite"] = 16316671;
map_prst_color["gold"] = 16766720;
map_prst_color["goldenrod"] = 14329120;
map_prst_color["gray"] = 8421504;
map_prst_color["green"] = 32768;
map_prst_color["greenYellow"] = 11403055;
map_prst_color["grey"] = 8421504;
map_prst_color["honeydew"] = 15794160;
map_prst_color["hotPink"] = 16738740;
map_prst_color["indianRed"] = 13458524;
map_prst_color["indigo"] = 4915330;
map_prst_color["ivory"] = 16777200;
map_prst_color["khaki"] = 15787660;
map_prst_color["lavender"] = 15132410;
map_prst_color["lavenderBlush"] = 16773365;
map_prst_color["lawnGreen"] = 8190976;
map_prst_color["lemonChiffon"] = 16775885;
map_prst_color["lightBlue"] = 11393254;
map_prst_color["lightCoral"] = 15761536;
map_prst_color["lightCyan"] = 14745599;
map_prst_color["lightGoldenrodYellow"] = 16448210;
map_prst_color["lightGray"] = 13882323;
map_prst_color["lightGreen"] = 9498256;
map_prst_color["lightGrey"] = 13882323;
map_prst_color["lightPink"] = 16758465;
map_prst_color["lightSalmon"] = 16752762;
map_prst_color["lightSeaGreen"] = 2142890;
map_prst_color["lightSkyBlue"] = 8900346;
map_prst_color["lightSlateGray"] = 7833753;
map_prst_color["lightSlateGrey"] = 7833753;
map_prst_color["lightSteelBlue"] = 11584734;
map_prst_color["lightYellow"] = 16777184;
map_prst_color["lime"] = 65280;
map_prst_color["limeGreen"] = 3329330;
map_prst_color["linen"] = 16445670;
map_prst_color["ltBlue"] = 11393254;
map_prst_color["ltCoral"] = 15761536;
map_prst_color["ltCyan"] = 14745599;
map_prst_color["ltGoldenrodYellow"] = 16448120;
map_prst_color["ltGray"] = 13882323;
map_prst_color["ltGreen"] = 9498256;
map_prst_color["ltGrey"] = 13882323;
map_prst_color["ltPink"] = 16758465;
map_prst_color["ltSalmon"] = 16752762;
map_prst_color["ltSeaGreen"] = 2142890;
map_prst_color["ltSkyBlue"] = 8900346;
map_prst_color["ltSlateGray"] = 7833753;
map_prst_color["ltSlateGrey"] = 7833753;
map_prst_color["ltSteelBlue"] = 11584734;
map_prst_color["ltYellow"] = 16777184;
map_prst_color["magenta"] = 16711935;
map_prst_color["maroon"] = 8388608;
map_prst_color["medAquamarine"] = 6737322;
map_prst_color["medBlue"] = 205;
map_prst_color["mediumAquamarine"] = 6737322;
map_prst_color["mediumBlue"] = 205;
map_prst_color["mediumOrchid"] = 12211667;
map_prst_color["mediumPurple"] = 9662683;
map_prst_color["mediumSeaGreen"] = 3978097;
map_prst_color["mediumSlateBlue"] = 8087790;
map_prst_color["mediumSpringGreen"] = 64154;
map_prst_color["mediumTurquoise"] = 4772300;
map_prst_color["mediumVioletRed"] = 13047173;
map_prst_color["medOrchid"] = 12211667;
map_prst_color["medPurple"] = 9662683;
map_prst_color["medSeaGreen"] = 3978097;
map_prst_color["medSlateBlue"] = 8087790;
map_prst_color["medSpringGreen"] = 64154;
map_prst_color["medTurquoise"] = 4772300;
map_prst_color["medVioletRed"] = 13047173;
map_prst_color["midnightBlue"] = 1644912;
map_prst_color["mintCream"] = 16121850;
map_prst_color["mistyRose"] = 16770303;
map_prst_color["moccasin"] = 16770229;
map_prst_color["navajoWhite"] = 16768685;
map_prst_color["navy"] = 128;
map_prst_color["oldLace"] = 16643558;
map_prst_color["olive"] = 8421376;
map_prst_color["oliveDrab"] = 7048739;
map_prst_color["orange"] = 16753920;
map_prst_color["orangeRed"] = 16729344;
map_prst_color["orchid"] = 14315734;
map_prst_color["paleGoldenrod"] = 15657130;
map_prst_color["paleGreen"] = 10025880;
map_prst_color["paleTurquoise"] = 11529966;
map_prst_color["paleVioletRed"] = 14381203;
map_prst_color["papayaWhip"] = 16773077;
map_prst_color["peachPuff"] = 16767673;
map_prst_color["peru"] = 13468991;
map_prst_color["pink"] = 16761035;
map_prst_color["plum"] = 13869267;
map_prst_color["powderBlue"] = 11591910;
map_prst_color["purple"] = 8388736;
map_prst_color["red"] = 16711680;
map_prst_color["rosyBrown"] = 12357519;
map_prst_color["royalBlue"] = 4286945;
map_prst_color["saddleBrown"] = 9127187;
map_prst_color["salmon"] = 16416882;
map_prst_color["sandyBrown"] = 16032864;
map_prst_color["seaGreen"] = 3050327;
map_prst_color["seaShell"] = 16774638;
map_prst_color["sienna"] = 10506797;
map_prst_color["silver"] = 12632256;
map_prst_color["skyBlue"] = 8900331;
map_prst_color["slateBlue"] = 6970091;
map_prst_color["slateGray"] = 7372944;
map_prst_color["slateGrey"] = 7372944;
map_prst_color["snow"] = 16775930;
map_prst_color["springGreen"] = 65407;
map_prst_color["steelBlue"] = 4620980;
map_prst_color["tan"] = 13808780;
map_prst_color["teal"] = 32896;
map_prst_color["thistle"] = 14204888;
map_prst_color["tomato"] = 16741191;
map_prst_color["turquoise"] = 4251856;
map_prst_color["violet"] = 15631086;
map_prst_color["wheat"] = 16113331;
map_prst_color["white"] = 16777215;
map_prst_color["whiteSmoke"] = 16119285;
map_prst_color["yellow"] = 16776960;
map_prst_color["yellowGreen"] = 10145074;
function CColorMod() {
    this.name = "";
    this.val = 0;
}
CColorMod.prototype = {
    createDuplicate: function () {
        var duplicate = new CColorMod();
        duplicate.name = this.name;
        duplicate.val = this.val;
        return duplicate;
    }
};
var cd16 = 1 / 6;
var cd13 = 1 / 3;
var cd23 = 2 / 3;
function CColorModifiers() {
    this.Mods = [];
}
CColorModifiers.prototype = {
    Write_ToBinary2: function (Writer) {
        var count = this.Mods.length;
        Writer.WriteLong(count);
        for (var i = 0; i < count; ++i) {
            var cur_mod = this.Mods[i];
            Writer.WriteString2(cur_mod.name);
            Writer.WriteLong(cur_mod.val);
        }
    },
    Read_FromBinary2: function (Reader) {
        var count = Reader.GetLong();
        for (var i = 0; i < count; ++i) {
            var cur_mod = new CColorMod();
            cur_mod.name = Reader.GetString2();
            cur_mod.val = Reader.GetLong();
            this.Mods.push(cur_mod);
        }
        return this;
    },
    IsIdentical: function (mods) {
        if (mods == null) {
            return false;
        }
        if (mods.Mods == null || this.Mods.length != mods.Mods.length) {
            return false;
        }
        for (var i = 0; i < this.Mods.length; ++i) {
            if (this.Mods[i].name != mods.Mods[i].name || this.Mods[i].val != mods.Mods[i].val) {
                return false;
            }
        }
        return true;
    },
    createDuplicate: function () {
        var duplicate = new CColorModifiers();
        for (var i = 0; i < this.Mods.length; ++i) {
            duplicate.Mods[i] = this.Mods[i].createDuplicate();
        }
        return duplicate;
    },
    RGB2HSL: function (R, G, B, HLS) {
        var iMin = Math.min(R, Math.min(G, B));
        var iMax = Math.max(R, Math.max(G, B));
        var iDelta = iMax - iMin;
        var dMax = (iMax + iMin) / 255;
        var dDelta = iDelta / 255;
        var H = 0;
        var S = 0;
        var L = dMax / 2;
        if (iDelta != 0) {
            if (L < 0.5) {
                S = dDelta / dMax;
            } else {
                S = dDelta / (2 - dMax);
            }
            dDelta = dDelta * 1530;
            var dR = (iMax - R) / dDelta;
            var dG = (iMax - G) / dDelta;
            var dB = (iMax - B) / dDelta;
            if (R == iMax) {
                H = dB - dG;
            } else {
                if (G == iMax) {
                    H = cd13 + dR - dB;
                } else {
                    if (B == iMax) {
                        H = cd23 + dG - dR;
                    }
                }
            }
            if (H < 0) {
                H += 1;
            }
            if (H > 1) {
                H -= 1;
            }
        }
        H = ((H * 240) >> 0) & 255;
        if (H < 0) {
            H = 0;
        }
        if (H > 255) {
            H = 255;
        }
        S = ((S * 240) >> 0) & 255;
        if (S < 0) {
            S = 0;
        }
        if (S > 255) {
            S = 255;
        }
        L = ((L * 240) >> 0) & 255;
        if (L < 0) {
            L = 0;
        }
        if (L > 255) {
            L = 255;
        }
        HLS.H = H;
        HLS.S = S;
        HLS.L = L;
    },
    HSL2RGB: function (HSL, RGB) {
        if (HSL.S == 0) {
            RGB.R = HSL.L;
            RGB.G = HSL.L;
            RGB.B = HSL.L;
        } else {
            var H = HSL.H / 240;
            var S = HSL.S / 240;
            var L = HSL.L / 240;
            var v2 = 0;
            if (L < 0.5) {
                v2 = L * (1 + S);
            } else {
                v2 = L + S - S * L;
            }
            var v1 = 2 * L - v2;
            var R = (255 * this.Hue_2_RGB(v1, v2, H + cd13)) >> 0;
            var G = (255 * this.Hue_2_RGB(v1, v2, H)) >> 0;
            var B = (255 * this.Hue_2_RGB(v1, v2, H - cd13)) >> 0;
            if (R < 0) {
                R = 0;
            }
            if (R > 255) {
                R = 255;
            }
            if (G < 0) {
                G = 0;
            }
            if (G > 255) {
                G = 255;
            }
            if (B < 0) {
                B = 0;
            }
            if (B > 255) {
                B = 255;
            }
            RGB.R = R;
            RGB.G = G;
            RGB.B = B;
        }
    },
    Hue_2_RGB: function (v1, v2, vH) {
        if (vH < 0) {
            vH += 1;
        }
        if (vH > 1) {
            vH -= 1;
        }
        if (vH < cd16) {
            return v1 + (v2 - v1) * 6 * vH;
        }
        if (vH < 0.5) {
            return v2;
        }
        if (vH < cd23) {
            return v1 + (v2 - v1) * (cd23 - vH) * 6;
        }
        return v1;
    },
    Apply: function (RGBA) {
        if (null == this.Mods) {
            return;
        }
        var _len = this.Mods.length;
        for (var i = 0; i < _len; i++) {
            var colorMod = this.Mods[i];
            var val = colorMod.val / 100000;
            if (colorMod.name == "alpha") {
                RGBA.A = Math.min(255, Math.max(0, 255 * val));
            } else {
                if (colorMod.name == "blue") {
                    RGBA.B = Math.min(255, Math.max(0, 255 * val));
                } else {
                    if (colorMod.name == "blueMod") {
                        RGBA.B = Math.max(0, (RGBA.B * val) >> 0);
                    } else {
                        if (colorMod.name == "blueOff") {
                            RGBA.B = Math.max(0, (RGBA.B + val * 255)) >> 0;
                        } else {
                            if (colorMod.name == "green") {
                                RGBA.G = Math.min(255, Math.max(0, 255 * val)) >> 0;
                            } else {
                                if (colorMod.name == "greenMod") {
                                    RGBA.G = Math.max(0, (RGBA.G * val) >> 0);
                                } else {
                                    if (colorMod.name == "greenOff") {
                                        RGBA.G = Math.max(0, (RGBA.G + val * 255)) >> 0;
                                    } else {
                                        if (colorMod.name == "red") {
                                            RGBA.R = Math.min(255, Math.max(0, 255 * val)) >> 0;
                                        } else {
                                            if (colorMod.name == "redMod") {
                                                RGBA.R = Math.max(0, (RGBA.R * val) >> 0);
                                            } else {
                                                if (colorMod.name == "redOff") {
                                                    RGBA.R = Math.max(0, (RGBA.R + val * 255) >> 0);
                                                } else {
                                                    if (colorMod.name == "hueOff") {
                                                        var HSL = {
                                                            H: 0,
                                                            S: 0,
                                                            L: 0
                                                        };
                                                        this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                        var res = (HSL.H + (val * 10) / 9) >> 0;
                                                        while (res > 240) {
                                                            res = res - 240;
                                                        }
                                                        while (res < 0) {
                                                            res += 240;
                                                        }
                                                        HSL.H = res;
                                                        this.HSL2RGB(HSL, RGBA);
                                                    } else {
                                                        if (colorMod.name == "inv") {
                                                            RGBA.R ^= 255;
                                                            RGBA.G ^= 255;
                                                            RGBA.B ^= 255;
                                                        } else {
                                                            if (colorMod.name == "lumMod") {
                                                                var HSL = {
                                                                    H: 0,
                                                                    S: 0,
                                                                    L: 0
                                                                };
                                                                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                if (HSL.L * val > 240) {
                                                                    HSL.L = 240;
                                                                } else {
                                                                    HSL.L = Math.max(0, (HSL.L * val) >> 0);
                                                                }
                                                                this.HSL2RGB(HSL, RGBA);
                                                            } else {
                                                                if (colorMod.name == "lumOff") {
                                                                    var HSL = {
                                                                        H: 0,
                                                                        S: 0,
                                                                        L: 0
                                                                    };
                                                                    this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                    var res = (HSL.L + val * 240) >> 0;
                                                                    while (res > 240) {
                                                                        res = res - 240;
                                                                    }
                                                                    while (res < 0) {
                                                                        res += 240;
                                                                    }
                                                                    HSL.L = res;
                                                                    this.HSL2RGB(HSL, RGBA);
                                                                } else {
                                                                    if (colorMod.name == "satMod") {
                                                                        var HSL = {
                                                                            H: 0,
                                                                            S: 0,
                                                                            L: 0
                                                                        };
                                                                        this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                        if (HSL.S * val > 240) {
                                                                            HSL.S = 240;
                                                                        } else {
                                                                            HSL.S = Math.max(0, (HSL.S * val) >> 0);
                                                                        }
                                                                        this.HSL2RGB(HSL, RGBA);
                                                                    } else {
                                                                        if (colorMod.name == "satOff") {
                                                                            var HSL = {
                                                                                H: 0,
                                                                                S: 0,
                                                                                L: 0
                                                                            };
                                                                            this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                            var res = (HSL.S + val * 240) >> 0;
                                                                            while (res > 240) {
                                                                                res = res - 240;
                                                                            }
                                                                            while (res < 0) {
                                                                                res += 240;
                                                                            }
                                                                            HSL.S = res;
                                                                            this.HSL2RGB(HSL, RGBA);
                                                                        } else {
                                                                            if (colorMod.name == "shade") {
                                                                                RGBA.R = Math.max(0, (RGBA.R * val) >> 0);
                                                                                RGBA.G = Math.max(0, (RGBA.G * val) >> 0);
                                                                                RGBA.B = Math.max(0, (RGBA.B * val) >> 0);
                                                                            } else {
                                                                                if (colorMod.name == "tint") {
                                                                                    RGBA.R = Math.max(0, (255 - (255 - RGBA.R) * val) >> 0);
                                                                                    RGBA.G = Math.max(0, (255 - (255 - RGBA.G) * val) >> 0);
                                                                                    RGBA.B = Math.max(0, (255 - (255 - RGBA.B) * val) >> 0);
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
};
function CSysColor() {
    this.type = COLOR_TYPE_SYS;
    this.id = "";
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}
CSysColor.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteString2(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.id = Reader.GetString2();
        this.RGBA = ReadObjectLong(Reader);
    },
    IsIdentical: function (color) {
        return color && color.type == COLOR_TYPE_SYS && color.id == this.id;
    },
    Calculate: function (obj) {},
    createDuplicate: function () {
        var duplicate = new CSysColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    }
};
function CPrstColor() {
    this.type = COLOR_TYPE_PRST;
    this.id = "";
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}
CPrstColor.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteString2(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.id = Reader.GetString2();
        this.RGBA = ReadObjectLong(Reader);
    },
    IsIdentical: function (color) {
        return color && color.type == COLOR_TYPE_PRST && color.id == this.id;
    },
    createDuplicate: function () {
        var duplicate = new CPrstColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },
    Calculate: function (obj) {
        var RGB = map_prst_color[this.id];
        this.RGBA.R = (RGB >> 16) & 255;
        this.RGBA.G = (RGB >> 8) & 255;
        this.RGBA.B = RGB & 255;
    }
};
function CRGBColor() {
    this.type = COLOR_TYPE_SRGB;
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}
CRGBColor.prototype = {
    writeToBinaryLong: function (w) {
        w.WriteLong(((this.RGBA.R << 16) & 16711680) + ((this.RGBA.G << 8) & 65280) + this.RGBA.B);
    },
    readFromBinaryLong: function (r) {
        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 255;
        this.RGBA.G = (RGB >> 8) & 255;
        this.RGBA.B = RGB & 255;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.RGBA = ReadObjectLong(Reader);
    },
    IsIdentical: function (color) {
        return color && color.type == COLOR_TYPE_SRGB && color.RGBA.R == this.RGBA.R && color.RGBA.G == this.RGBA.G && color.RGBA.B == this.RGBA.B && color.RGBA.A == this.RGBA.A;
    },
    createDuplicate: function () {
        var duplicate = new CRGBColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },
    Calculate: function (obj) {}
};
function CSchemeColor() {
    this.type = COLOR_TYPE_SCHEME;
    this.id = 0;
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}
CSchemeColor.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteLong(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.id = Reader.GetLong();
        this.RGBA = ReadObjectLong(Reader);
    },
    IsIdentical: function (color) {
        return color && color.type == COLOR_TYPE_SCHEME && color.id == this.id;
    },
    createDuplicate: function () {
        var duplicate = new CSchemeColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },
    Calculate: function (theme, slide, layout, masterSlide, RGBA) {
        if (theme.themeElements.clrScheme) {
            if (this.id == phClr) {
                this.RGBA = RGBA;
            } else {
                var clrMap = {};
                if (slide != null && slide.clrMap != null) {
                    clrMap = slide.clrMap.color_map;
                } else {
                    if (layout != null && layout.clrMap != null) {
                        clrMap = layout.clrMap.color_map;
                    } else {
                        if (masterSlide != null && masterSlide.clrMap != null) {
                            clrMap = masterSlide.clrMap.color_map;
                        }
                    }
                }
                if (clrMap[this.id] != null && theme.themeElements.clrScheme.colors[clrMap[this.id]] != null) {
                    this.RGBA = theme.themeElements.clrScheme.colors[clrMap[this.id]].color.RGBA;
                } else {
                    if (theme.themeElements.clrScheme.colors[this.id] != null) {
                        this.RGBA = theme.themeElements.clrScheme.colors[this.id].color.RGBA;
                    }
                }
            }
        }
    }
};
function CUniColor() {
    this.color = null;
    this.Mods = new CColorModifiers();
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}
CUniColor.prototype = {
    Write_ToBinary2: function (Writer) {
        var flag = this.color != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.color.Write_ToBinary2(Writer);
        }
        this.Mods.Write_ToBinary2(Writer);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            var color_type = Reader.GetLong();
            switch (color_type) {
            case COLOR_TYPE_SCHEME:
                this.color = new CSchemeColor();
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_SRGB:
                this.color = new CRGBColor();
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_PRST:
                this.color = new CPrstColor();
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_SYS:
                this.color = new CSysColor();
                this.color.Read_FromBinary2(Reader);
                break;
            }
        }
        this.Mods.Read_FromBinary2(Reader);
        this.RGBA = ReadObjectLong(Reader);
    },
    createDuplicate: function () {
        var duplicate = new CUniColor();
        if (this.color != null) {
            duplicate.color = this.color.createDuplicate();
        }
        duplicate.Mods = this.Mods.createDuplicate();
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },
    IsIdentical: function (unicolor) {
        if (unicolor == null) {
            return false;
        }
        if (!this.color.IsIdentical(unicolor.color)) {
            return false;
        }
        if (!this.Mods.IsIdentical(unicolor.Mods)) {
            return false;
        }
        return true;
    },
    Calculate: function (theme, slide, layout, masterSlide, RGBA) {
        if (this.color == null) {
            return this.RGBA;
        }
        this.color.Calculate(theme, slide, layout, masterSlide, RGBA);
        this.RGBA = {
            R: this.color.RGBA.R,
            G: this.color.RGBA.G,
            B: this.color.RGBA.B,
            A: this.color.RGBA.A
        };
        this.Mods.Apply(this.RGBA);
    },
    compare: function (unicolor) {
        if (unicolor == null) {
            return null;
        }
        var _ret = new CUniColor();
        if (this.color == null || unicolor.color == null || this.color.type !== unicolor.color.type) {
            return _ret;
        }
        switch (this.color.type) {
        case COLOR_TYPE_NONE:
            break;
        case COLOR_TYPE_PRST:
            _ret.color = new CPrstColor();
            if (unicolor.color.id == this.color.id) {
                _ret.color.id = this.color.id;
                _ret.color.RGBA.R = this.color.RGBA.R;
                _ret.color.RGBA.G = this.color.RGBA.G;
                _ret.color.RGBA.B = this.color.RGBA.B;
                _ret.color.RGBA.A = this.color.RGBA.A;
                _ret.RGBA.R = this.RGBA.R;
                _ret.RGBA.G = this.RGBA.G;
                _ret.RGBA.B = this.RGBA.B;
                _ret.RGBA.A = this.RGBA.A;
            }
            break;
        case COLOR_TYPE_SCHEME:
            _ret.color = new CSchemeColor();
            if (unicolor.color.id == this.color.id) {
                _ret.color.id = this.color.id;
                _ret.color.RGBA.R = this.color.RGBA.R;
                _ret.color.RGBA.G = this.color.RGBA.G;
                _ret.color.RGBA.B = this.color.RGBA.B;
                _ret.color.RGBA.A = this.color.RGBA.A;
                _ret.RGBA.R = this.RGBA.R;
                _ret.RGBA.G = this.RGBA.G;
                _ret.RGBA.B = this.RGBA.B;
                _ret.RGBA.A = this.RGBA.A;
            }
            break;
        case COLOR_TYPE_SRGB:
            _ret.color = new CRGBColor();
            var _RGBA1 = this.color.RGBA;
            var _RGBA2 = this.color.RGBA;
            if (_RGBA1.R === _RGBA2.R && _RGBA1.G === _RGBA2.G && _RGBA1.B === _RGBA2.B) {
                _ret.color.RGBA.R = this.color.RGBA.R;
                _ret.color.RGBA.G = this.color.RGBA.G;
                _ret.color.RGBA.B = this.color.RGBA.B;
                _ret.RGBA.R = this.RGBA.R;
                _ret.RGBA.G = this.RGBA.G;
                _ret.RGBA.B = this.RGBA.B;
            }
            if (_RGBA1.A === _RGBA2.A) {
                _ret.color.RGBA.A = this.color.RGBA.A;
            }
            break;
        case COLOR_TYPE_SYS:
            if (unicolor.color.id == this.color.id) {
                _ret.color.id = this.color.id;
                _ret.color.RGBA.R = this.color.RGBA.R;
                _ret.color.RGBA.G = this.color.RGBA.G;
                _ret.color.RGBA.B = this.color.RGBA.B;
                _ret.color.RGBA.A = this.color.RGBA.A;
                _ret.RGBA.R = this.RGBA.R;
                _ret.RGBA.G = this.RGBA.G;
                _ret.RGBA.B = this.RGBA.B;
                _ret.RGBA.A = this.RGBA.A;
            }
            break;
        }
        return _ret;
    },
    getCSSColor: function (transparent) {
        if (transparent != null) {
            var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + ",1)";
            return _css;
        }
        var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + "," + (this.RGBA.A / 255) + ")";
        return _css;
    }
};
function CreateUniColorRGB(r, g, b) {
    var ret = new CUniColor();
    ret.color = new CRGBColor();
    ret.color.RGBA.R = r;
    ret.color.RGBA.G = g;
    ret.color.RGBA.B = b;
    return ret;
}
function CreteSolidFillRGB(r, g, b) {
    var ret = new CUniFill();
    ret.fill = new CSolidFill();
    var _uni_color = ret.fill.color;
    _uni_color.color = new CRGBColor();
    _uni_color.color.RGBA.R = r;
    _uni_color.color.RGBA.G = g;
    _uni_color.color.RGBA.B = b;
    return ret;
}
var FILL_TYPE_NONE = 0;
var FILL_TYPE_BLIP = 1;
var FILL_TYPE_NOFILL = 2;
var FILL_TYPE_SOLID = 3;
var FILL_TYPE_GRAD = 4;
var FILL_TYPE_PATT = 5;
function CSrcRect() {
    this.l = null;
    this.t = null;
    this.r = null;
    this.b = null;
}
CSrcRect.prototype = {
    createDublicate: function () {
        var _ret = new CSrcRect();
        _ret.l = this.l;
        _ret.t = this.t;
        _ret.r = this.r;
        _ret.b = this.b;
        return _ret;
    }
};
function CBlipFill() {
    this.type = FILL_TYPE_BLIP;
    this.RasterImageId = null;
    this.VectorImageBin = null;
    this.srcRect = null;
    this.stretch = null;
    this.tile = null;
    this.rotWithShape = false;
}
CBlipFill.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        var flag = typeof this.RasterImageId === "string";
        Writer.WriteBool(flag);
        if (flag) {
            if (0 == this.RasterImageId.indexOf("theme")) {
                Writer.WriteString2(this.RasterImageId);
            } else {
                var string_to_write = _getFullImageSrc(this.RasterImageId);
                if (string_to_write.indexOf(documentOrigin) !== 0 && string_to_write.indexOf("http:") !== 0 && string_to_write.indexOf("https:") !== 0 && string_to_write.indexOf("ftp:") !== 0 && string_to_write.indexOf("data:") !== 0) {
                    string_to_write = documentOrigin + string_to_write;
                }
                Writer.WriteString2(string_to_write);
            }
        }
        flag = this.stretch !== null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteBool(this.stretch);
        }
        flag = this.tile !== null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteBool(this.tile);
        }
        Writer.WriteBool(this.rotWithShape);
    },
    Read_FromBinary2: function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            var imageId = Reader.GetString2();
            if (typeof imageId === "string" && isRealObject(Reader.oImages) && typeof Reader.oImages[imageId] === "string" && Reader.oImages[imageId] !== "error") {
                this.RasterImageId = Reader.oImages[imageId];
            } else {
                this.RasterImageId = imageId;
            }
            if (typeof this.RasterImageId === "string" && isRealObject(Reader.oImages)) {
                editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.RasterImageId);
            }
        }
        flag = Reader.GetBool();
        if (flag) {
            this.stretch = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.tile = Reader.GetBool();
        }
        this.rotWithShape = Reader.GetBool();
    },
    createDuplicate: function () {
        var duplicate = new CBlipFill();
        duplicate.RasterImageId = this.RasterImageId;
        duplicate.VectorImageBin = this.VectorImageBin;
        duplicate.stretch = this.stretch;
        duplicate.tile = this.tile;
        if (null != this.srcRect) {
            duplicate.srcRect = this.srcRect.createDublicate();
        }
        duplicate.rotWithShape = this.rotWithShape;
        return duplicate;
    },
    IsIdentical: function (fill) {
        if (fill == null) {
            return false;
        }
        if (fill.type != FILL_TYPE_BLIP) {
            return false;
        }
        if (fill.RasterImageId != this.RasterImageId) {
            return false;
        }
        if (fill.stretch != this.stretch) {
            return false;
        }
        if (fill.tile != this.tile) {
            return false;
        }
        return true;
    },
    compare: function (fill) {
        if (fill == null || fill.type !== FILL_TYPE_BLIP) {
            return null;
        }
        var _ret = new CBlipFill();
        if (this.RasterImageId == fill.RasterImageId) {
            _ret.RasterImageId = this.RasterImageId;
        }
        if (fill.stretch == this.stretch) {
            _ret.stretch = this.stretch;
        }
        if (fill.tile == this.tile) {
            _ret.tile = this.tile;
        }
        if (fill.rotWithShape === this.rotWithShape) {
            _ret.rotWithShape = this.rotWithShape;
        }
        return _ret;
    }
};
function CSolidFill() {
    this.type = FILL_TYPE_SOLID;
    this.color = new CUniColor();
}
CSolidFill.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        this.color.Write_ToBinary2(Writer);
    },
    Read_FromBinary2: function (Reader) {
        this.color.Read_FromBinary2(Reader);
    },
    IsIdentical: function (fill) {
        if (fill == null) {
            return false;
        }
        if (fill.type != FILL_TYPE_SOLID) {
            return false;
        }
        return this.color.IsIdentical(fill.color);
    },
    createDuplicate: function () {
        var duplicate = new CSolidFill();
        duplicate.color = this.color.createDuplicate();
        return duplicate;
    },
    compare: function (fill) {
        if (fill == null || fill.type !== FILL_TYPE_SOLID) {
            return null;
        }
        var _ret = new CSolidFill();
        _ret.color = this.color.compare(fill.color);
        return _ret;
    }
};
function CGs() {
    this.color = new CUniColor();
    this.pos = 0;
}
CGs.prototype = {
    Write_ToBinary2: function (Writer) {
        this.color.Write_ToBinary2(Writer);
        Writer.WriteLong(this.pos);
    },
    Read_FromBinary2: function (Reader) {
        this.color = new CUniColor();
        this.color.Read_FromBinary2(Reader);
        this.pos = Reader.GetLong();
    },
    IsIdentical: function (fill) {
        return false;
    },
    createDuplicate: function () {
        var duplicate = new CGs();
        duplicate.pos = this.pos;
        duplicate.color = this.color.createDuplicate();
        return duplicate;
    },
    compare: function (gs) {
        var compare_unicolor = this.color.compare(gs.color);
        if (!isRealObject(compare_unicolor)) {
            return null;
        }
        var ret = new CGs();
        ret.color = compare_unicolor;
        ret.pos = gs.pos === this.pos ? this.pos : 0;
        return ret;
    }
};
function GradLin() {
    this.angle = 5400000;
    this.scale = true;
}
GradLin.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.angle);
        Writer.WriteBool(this.scale);
    },
    Read_FromBinary2: function (Reader) {
        this.angle = Reader.GetLong();
        this.scale = Reader.GetBool();
    },
    IsIdentical: function (lin) {
        if (this.angle != lin.angle) {
            return false;
        }
        if (this.scale != lin.scale) {
            return false;
        }
        return true;
    },
    createDuplicate: function () {
        var duplicate = new GradLin();
        duplicate.angle = this.angle;
        duplicate.scale = this.scale;
        return duplicate;
    },
    compare: function (lin) {
        return null;
    }
};
function GradPath() {
    this.path = 0;
    this.rect = null;
}
GradPath.prototype = {
    Write_ToBinary2: function (Writer) {},
    Read_FromBinary2: function (Reader) {},
    IsIdentical: function (path) {
        if (this.path != path.path) {
            return false;
        }
        return true;
    },
    createDuplicate: function () {
        var duplicate = new GradPath();
        duplicate.path = this.path;
        return duplicate;
    },
    compare: function (path) {
        return null;
    }
};
function CGradFill() {
    this.type = FILL_TYPE_GRAD;
    this.colors = new Array();
    this.lin = null;
    this.path = null;
}
CGradFill.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        var colors_count = this.colors.length;
        Writer.WriteLong(colors_count);
        for (var i = 0; i < colors_count; ++i) {
            this.colors[i].Write_ToBinary2(Writer);
        }
        Writer.WriteBool(isRealObject(this.lin));
        if (isRealObject(this.lin)) {
            this.lin.Write_ToBinary2(Writer);
        }
        Writer.WriteBool(isRealObject(this.path));
        if (isRealObject(this.path)) {
            this.path.Write_ToBinary2(Writer);
        }
    },
    Read_FromBinary2: function (Reader) {
        var colors_count = Reader.GetLong();
        for (var i = 0; i < colors_count; ++i) {
            this.colors[i] = new CGs();
            this.colors[i].Read_FromBinary2(Reader);
        }
        if (Reader.GetBool()) {
            this.lin = new GradLin();
            this.lin.Read_FromBinary2(Reader);
        }
        if (Reader.GetBool()) {
            this.path = new GradPath();
            this.path.Read_FromBinary2(Reader);
        }
    },
    IsIdentical: function (fill) {
        if (fill == null) {
            return false;
        }
        if (fill.type != FILL_TYPE_GRAD) {
            return false;
        }
        if (fill.colors.length != this.colors.length) {
            return false;
        }
        for (var i = 0; i < this.colors.length; ++i) {
            if (!this.colors[i].IsIdentical(fill.colors[i])) {
                return false;
            }
        }
        return true;
    },
    createDuplicate: function () {
        var duplicate = new CGradFill();
        for (var i = 0; i < this.colors.length; ++i) {
            duplicate.colors[i] = this.colors[i].createDuplicate();
        }
        if (this.lin) {
            duplicate.lin = this.lin.createDuplicate();
        }
        if (this.path) {
            duplicate.path = this.path.createDuplicate();
        }
        return duplicate;
    },
    compare: function (fill) {
        if (fill == null || fill.type !== FILL_TYPE_GRAD) {
            return null;
        }
        var _ret = new CGradFill();
        if (this.lin == null || fill.lin == null) {
            _ret.lin = null;
        } else {
            _ret.lin = new GradLin();
            _ret.lin.angle = this.lin && this.lin.angle === fill.lin.angle ? fill.lin.angle : 5400000;
            _ret.lin.scale = this.lin && this.lin.scale === fill.lin.scale ? fill.lin.scale : true;
        }
        if (this.path == null || fill.path == null) {
            _ret.path = null;
        } else {
            _ret.path = new GradPath();
        }
        if (this.colors.length === fill.colors.length) {
            for (var i = 0; i < this.colors.length; ++i) {
                var compare_unicolor = this.colors[i].compare(fill.colors[i]);
                if (!isRealObject(compare_unicolor)) {
                    break;
                }
                _ret.colors[i] = compare_unicolor;
            }
        }
        return _ret;
    }
};
function CPattFill() {
    this.type = FILL_TYPE_PATT;
    this.ftype = 0;
    this.fgClr = new CUniColor();
    this.bgClr = new CUniColor();
}
CPattFill.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteString2(this.ftype);
        this.fgClr.Write_ToBinary2(Writer);
        this.bgClr.Write_ToBinary2(Writer);
    },
    Read_FromBinary2: function (Reader) {
        this.ftype = Reader.GetString2();
        this.fgClr.Read_FromBinary2(Reader);
        this.bgClr.Read_FromBinary2(Reader);
    },
    IsIdentical: function (fill) {
        if (fill == null) {
            return false;
        }
        if (fill.type != FILL_TYPE_PATT && this.ftype != fill.ftype) {
            return false;
        }
        return this.fgClr.IsIdentical(fill.fgClr) && this.bgClr.IsIdentical(fill.bgClr);
    },
    createDuplicate: function () {
        var duplicate = new CPattFill();
        duplicate.ftype = this.ftype;
        duplicate.fgClr = this.fgClr.createDuplicate();
        duplicate.bgClr = this.bgClr.createDuplicate();
        return duplicate;
    },
    compare: function (fill) {
        if (fill == null) {
            return null;
        }
        if (fill.type !== FILL_TYPE_PATT) {
            return null;
        }
        var _ret = new CPattFill();
        if (fill.ftype == this.ftype) {
            _ret.ftype = this.ftype;
        }
        _ret.fgClr = this.fgClr.compare(fill.fgClr);
        _ret.bgClr = this.bgClr.compare(fill.bgClr);
        return _ret;
    }
};
function CNoFill() {
    this.type = FILL_TYPE_NOFILL;
}
CNoFill.prototype = {
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
    },
    Read_FromBinary2: function (Reader) {},
    createDuplicate: function () {
        return new CNoFill();
    },
    IsIdentical: function (fill) {
        if (fill == null) {
            return false;
        }
        return fill.type != FILL_TYPE_NOFILL;
    },
    compare: function (nofill) {
        if (nofill == null) {
            return null;
        }
        if (nofill.type === this.type) {
            return new CNoFill();
        }
        return null;
    }
};
function CUniFill() {
    this.fill = undefined;
    this.transparent = null;
    this.isUnifill = true;
}
CUniFill.prototype = {
    Write_ToBinary2: function (Writer) {
        var flag = isRealObject(this.fill);
        Writer.WriteBool(flag);
        if (flag) {
            this.fill.Write_ToBinary2(Writer);
        }
        flag = this.transparent != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteDouble(this.transparent);
        }
    },
    Read_FromBinary2: function (reader) {
        var flag = reader.GetBool();
        if (flag) {
            var fill_type = reader.GetLong();
            switch (fill_type) {
            case FILL_TYPE_SOLID:
                this.fill = new CSolidFill();
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_GRAD:
                this.fill = new CGradFill();
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_BLIP:
                this.fill = new CBlipFill();
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_NOFILL:
                this.fill = new CNoFill();
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_PATT:
                this.fill = new CPattFill();
                this.fill.Read_FromBinary2(reader);
                break;
            }
        }
        flag = reader.GetBool();
        if (flag) {
            this.transparent = reader.GetDouble();
        }
    },
    calculate: function (theme, slide, layout, masterSlide, RGBA) {
        if (this.fill) {
            if (this.fill.color) {
                this.fill.color.Calculate(theme, slide, layout, masterSlide, RGBA);
            }
            if (this.fill.colors) {
                for (var i = 0; i < this.fill.colors.length; ++i) {
                    this.fill.colors[i].color.Calculate(theme, slide, layout, masterSlide, RGBA);
                }
            }
            if (this.fill.fgClr) {
                this.fill.fgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
            }
            if (this.fill.bgClr) {
                this.fill.bgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
            }
        }
    },
    getRGBAColor: function () {
        if (this.fill) {
            if (this.fill.type == FILL_TYPE_SOLID) {
                return this.fill.color.RGBA;
            }
            if (this.fill.type == FILL_TYPE_GRAD) {
                var RGBA = {
                    R: 0,
                    G: 0,
                    B: 0,
                    A: 255
                };
                var _colors = this.fill.colors;
                var _len = _colors.length;
                if (0 == _len) {
                    return RGBA;
                }
                for (var i = 0; i < _len; i++) {
                    RGBA.R += _colors[i].color.RGBA.R;
                    RGBA.G += _colors[i].color.RGBA.G;
                    RGBA.B += _colors[i].color.RGBA.B;
                }
                RGBA.R = (RGBA.R / _len) >> 0;
                RGBA.G = (RGBA.G / _len) >> 0;
                RGBA.B = (RGBA.B / _len) >> 0;
                return RGBA;
            }
            if (this.fill.type == FILL_TYPE_PATT) {
                return this.fill.fgClr.RGBA;
            }
        }
        return {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
    },
    createDuplicate: function () {
        var duplicate = new CUniFill();
        if (this.fill != null) {
            duplicate.fill = this.fill.createDuplicate();
        }
        duplicate.transparent = this.transparent;
        return duplicate;
    },
    merge: function (unifill) {
        if (unifill) {
            if (unifill.fill != null) {
                this.fill = unifill.fill.createDuplicate();
            }
            if (unifill.transparent != null) {
                this.transparent = unifill.transparent;
            }
        }
    },
    IsIdentical: function (unifill) {
        if (unifill == null) {
            return false;
        }
        if (this.fill == null && unifill.fill == null) {
            return true;
        }
        if (this.fill != null) {
            return this.fill.IsIdentical(unifill.fill);
        } else {
            return false;
        }
    },
    compare: function (unifill) {
        if (unifill == null) {
            return null;
        }
        var _ret = new CUniFill();
        if (! (this.fill == null || unifill.fill == null)) {
            if (this.fill.compare) {
                _ret.fill = this.fill.compare(unifill.fill);
            }
        }
        return _ret.fill;
    }
};
function CompareUniFill(unifill_1, unifill_2) {
    if (unifill_1 == null || unifill_2 == null) {
        return null;
    }
    var _ret = new CUniFill();
    if (! (unifill_1.transparent === null || unifill_2.transparent === null || unifill_1.transparent !== unifill_2.transparent)) {
        _ret.transparent = unifill_1.transparent;
    }
    if (unifill_1.fill == null || unifill_2.fill == null || unifill_1.fill.type != unifill_2.fill.type) {
        return _ret;
    }
    _ret.fill = unifill_1.compare(unifill_2);
    return _ret;
}
function CompareShapeProperties(shapeProp1, shapeProp2) {
    var _result_shape_prop = {};
    if (shapeProp1.type === shapeProp2.type) {
        _result_shape_prop.type = shapeProp1.type;
    } else {
        _result_shape_prop.type = null;
    }
    if (shapeProp1.h === shapeProp2.h) {
        _result_shape_prop.h = shapeProp1.h;
    } else {
        _result_shape_prop.h = null;
    }
    if (shapeProp1.w === shapeProp2.w) {
        _result_shape_prop.w = shapeProp1.w;
    } else {
        _result_shape_prop.w = null;
    }
    if (shapeProp1.stroke === null || shapeProp2.stroke === null) {
        _result_shape_prop.stroke = null;
    } else {
        _result_shape_prop.stroke = shapeProp1.stroke.compare(shapeProp2.stroke);
    }
    if (shapeProp1.verticalTextAlign === shapeProp2.verticalTextAlign) {
        _result_shape_prop.verticalTextAlign = shapeProp1.verticalTextAlign;
    } else {
        _result_shape_prop.verticalTextAlign = null;
    }
    if (shapeProp1.canChangeArrows !== true || shapeProp2.canChangeArrows !== true) {
        _result_shape_prop.canChangeArrows = false;
    } else {
        _result_shape_prop.canChangeArrows = true;
    }
    _result_shape_prop.fill = CompareUniFill(shapeProp1.fill, shapeProp2.fill);
    _result_shape_prop.IsLocked = shapeProp1.IsLocked === true || shapeProp2.IsLocked === true;
    if (isRealObject(shapeProp1.paddings) && isRealObject(shapeProp2.paddings)) {
        _result_shape_prop.paddings = new CPaddings();
        _result_shape_prop.paddings.Left = isRealNumber(shapeProp1.paddings.Left) ? (shapeProp1.paddings.Left === shapeProp2.paddings.Left ? shapeProp1.paddings.Left : undefined) : undefined;
        _result_shape_prop.paddings.Top = isRealNumber(shapeProp1.paddings.Top) ? (shapeProp1.paddings.Top === shapeProp2.paddings.Top ? shapeProp1.paddings.Top : undefined) : undefined;
        _result_shape_prop.paddings.Right = isRealNumber(shapeProp1.paddings.Right) ? (shapeProp1.paddings.Right === shapeProp2.paddings.Right ? shapeProp1.paddings.Right : undefined) : undefined;
        _result_shape_prop.paddings.Bottom = isRealNumber(shapeProp1.paddings.Bottom) ? (shapeProp1.paddings.Bottom === shapeProp2.paddings.Bottom ? shapeProp1.paddings.Bottom : undefined) : undefined;
    }
    _result_shape_prop.canFill = shapeProp1.canFill === true || shapeProp2.canFill === true;
    return _result_shape_prop;
}
var lg = 500,
mid = 300,
sm = 200;
var ar_arrow = 0,
ar_diamond = 1,
ar_none = 2,
ar_oval = 3,
ar_stealth = 4,
ar_triangle = 5;
var LineEndType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};
var LineEndSize = {
    Large: 0,
    Mid: 1,
    Small: 2
};
function EndArrow() {
    this.type = null;
    this.len = null;
    this.w = null;
    this.Write_ToBinary2 = function (Writer) {
        var flag = this.type != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.type);
        }
        flag = this.len != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.len);
        }
        flag = this.w != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.w);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            this.type = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.len = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.w = Reader.GetLong();
        }
    };
    this.compare = function (end_arrow) {
        if (end_arrow == null) {
            return null;
        }
        var _ret = new EndArrow();
        if (this.type === end_arrow.type) {
            _ret.type = this.type;
        }
        if (this.len === end_arrow.len) {
            _ret.len = this.len;
        }
        if (this.w === end_arrow) {
            _ret.w = this.w;
        }
        return _ret;
    };
    this.createDuplicate = function () {
        var duplicate = new EndArrow();
        duplicate.type = this.type;
        duplicate.len = this.len;
        duplicate.w = this.w;
        return duplicate;
    };
    this.IsIdentical = function (arrow) {
        return arrow && arrow.type == this.type && arrow.len == this.len && arrow.w == this.w;
    };
    this.GetWidth = function (size) {
        if (null == this.w) {
            return size * 3;
        }
        switch (this.w) {
        case LineEndSize.Large:
            return 5 * size;
        case LineEndSize.Small:
            return 2 * size;
        default:
            break;
        }
        return 3 * size;
    };
    this.GetLen = function (size) {
        if (null == this.len) {
            return size * 3;
        }
        switch (this.len) {
        case LineEndSize.Large:
            return 5 * size;
        case LineEndSize.Small:
            return 2 * size;
        default:
            break;
        }
        return 3 * size;
    };
}
var LineJoinType = {
    Empty: 0,
    Round: 1,
    Bevel: 2,
    Miter: 3
};
function ConvertJoinAggType(_type) {
    switch (_type) {
    case LineJoinType.Round:
        return 2;
    case LineJoinType.Bevel:
        return 1;
    case LineJoinType.Miter:
        return 0;
    default:
        break;
    }
    return 2;
}
function LineJoin() {
    this.type = null;
    this.limit = null;
    this.Write_ToBinary2 = function (Writer) {
        var flag = this.type != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.type);
        }
        flag = this.limit != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.limit);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            this.type = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.limit = Reader.GetLong();
        }
        return this;
    };
    this.createDuplicate = function () {
        var duplicate = new LineJoin();
        duplicate.type = this.type;
        duplicate.limit = this.limit;
        return duplicate;
    };
}
function CLn() {
    this.Fill = null;
    this.prstDash = null;
    this.Join = null;
    this.headEnd = null;
    this.tailEnd = null;
    this.algn = null;
    this.cap = null;
    this.cmpd = null;
    this.w = null;
    this.Write_ToBinary2 = function (Writer) {
        var flag = this.Fill != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.Fill.Write_ToBinary2(Writer);
        }
        flag = this.Join != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.Join.Write_ToBinary2(Writer);
        }
        flag = this.headEnd != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.headEnd.Write_ToBinary2(Writer);
        }
        flag = this.tailEnd != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.tailEnd.Write_ToBinary2(Writer);
        }
        flag = this.algn != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.algn);
        }
        flag = this.cap != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.cap);
        }
        flag = this.cmpd != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.cmpd);
        }
        flag = this.w != null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteLong(this.w);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            this.Fill = new CUniFill();
            this.Fill.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.Join = new LineJoin();
            this.Join.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.headEnd = new EndArrow();
            this.headEnd.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.tailEnd = new EndArrow();
            this.tailEnd.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.algn = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.cap = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.cmpd = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.w = Reader.GetLong();
        }
    };
    this.compare = function (line) {
        if (line == null) {
            return null;
        }
        var _ret = new CLn();
        if (this.Fill != null) {
            _ret.Fill = CompareUniFill(this.Fill, line.Fill);
        }
        if (this.prstDash === line.prstDash) {
            _ret.prstDash = this.prstDash;
        }
        if (this.Join === line.Join) {
            _ret.Join = this.Join;
        }
        if (this.tailEnd != null) {
            _ret.tailEnd = this.tailEnd.compare(line.tailEnd);
        }
        if (this.headEnd != null) {
            _ret.headEnd = this.headEnd.compare(line.headEnd);
        }
        if (this.algn === line.algn) {
            _ret.algn = this.algn;
        }
        if (this.cap === line.cap) {
            _ret.cap = this.cap;
        }
        if (this.cmpd === line.cmpd) {
            _ret.cmpd = this.cmpd;
        }
        if (this.w === line.w) {
            _ret.w = this.w;
        }
        return _ret;
    };
    this.merge = function (ln) {
        if (ln == null) {
            return;
        }
        if (ln.Fill != null && ln.Fill.fill != null) {
            this.Fill = ln.Fill.createDuplicate();
        }
        if (ln.prstDash != null) {
            this.prstDash = ln.prstDash;
        }
        if (ln.Join != null) {
            this.Join = ln.Join.createDuplicate();
        }
        if (ln.headEnd != null) {
            this.headEnd = ln.headEnd.createDuplicate();
        }
        if (ln.tailEnd != null) {
            this.tailEnd = ln.tailEnd.createDuplicate();
        }
        if (ln.algn != null) {
            this.algn = ln.algn;
        }
        if (ln.cap != null) {
            this.cap = ln.cap;
        }
        if (ln.cmpd != null) {
            this.cmpd = ln.cmpd;
        }
        if (ln.w != null) {
            this.w = ln.w;
        }
    };
    this.calculate = function (theme, slide, layout, master, RGBA) {
        if (isRealObject(this.Fill)) {
            this.Fill.calculate(theme, slide, layout, master, RGBA);
        }
    };
    this.createDuplicate = function () {
        var duplicate = new CLn();
        if (null != this.Fill) {
            duplicate.Fill = this.Fill.createDuplicate();
        }
        duplicate.prstDash = this.prstDash;
        duplicate.Join = this.Join;
        if (this.headEnd != null) {
            duplicate.headEnd = this.headEnd.createDuplicate();
        }
        if (this.tailEnd != null) {
            duplicate.tailEnd = this.tailEnd.createDuplicate();
        }
        duplicate.algn = this.algn;
        duplicate.cap = this.cap;
        duplicate.cmpd = this.cmpd;
        duplicate.w = this.w;
        return duplicate;
    };
    this.IsIdentical = function (ln) {
        return ln && (this.Fill == null ? ln.Fill == null : this.Fill.IsIdentical(ln.Fill)) && this.Join == ln.Join && (this.headEnd == null ? ln.headEnd == null : this.headEnd.IsIdentical(ln.headEnd)) && (this.tailEnd == null ? ln.tailEnd == null : this.tailEnd.IsIdentical(ln.headEnd)) && this.algn == ln.algn && this.cap == ln.cap && this.cmpd == ln.cmpd && this.w == ln.w;
    };
}
function DefaultShapeDefinition() {
    this.spPr = new CSpPr();
    this.bodyPr = new CBodyPr();
    this.lstStyle = new CTextStyle();
    this.style = null;
}
function CNvPr() {
    this.id = 0;
    this.name = "";
    this.isHidden = false;
    this.createDuplicate = function () {
        var duplicate = new CNvPr();
        duplicate.id = this.id;
        duplicate.name = this.name;
        duplicate.isHidden = this.isHidden;
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteLong(this.id);
        w.WriteString2(this.name);
    };
    this.Read_FromBinary2 = function (r) {
        this.id = r.GetLong();
        this.name = r.GetString2();
    };
}
function NvPr() {
    this.isPhoto = false;
    this.userDrawn = false;
    this.ph = null;
    this.createDuplicate = function () {
        var duplicate = new NvPr();
        duplicate.isPhoto = this.isPhoto;
        duplicate.userDrawn = this.userDrawn;
        if (this.ph != null) {
            duplicate.ph = this.ph.createDuplicate();
        }
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(this.isPhoto);
        w.WriteBool(this.userDrawn);
        w.WriteBool(isRealObject(this.ph));
        if (isRealObject(this.ph)) {
            this.ph.Write_ToBinary2(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        (this.isPhoto) = r.GetBool();
        (this.userDrawn) = r.GetBool();
        if (r.GetBool()) {
            this.ph = new Ph();
            this.ph.Read_FromBinary2(r);
        }
    };
}
var phType_body = 0,
phType_chart = 1,
phType_clipArt = 2,
phType_ctrTitle = 3,
phType_dgm = 4,
phType_dt = 5,
phType_ftr = 6,
phType_hdr = 7,
phType_media = 8,
phType_obj = 9,
phType_pic = 10,
phType_sldImg = 11,
phType_sldNum = 12,
phType_subTitle = 13,
phType_tbl = 14,
phType_title = 15;
var szPh_full = 0,
szPh_half = 1,
szPh_quarter = 2;
var orientPh_horz = 0,
orientPh_vert = 1;
function Ph() {
    this.hasCustomPrompt = false;
    this.idx = null;
    this.orient = null;
    this.sz = null;
    this.type = null;
    this.createDuplicate = function () {
        var duplicate = new Ph();
        duplicate.hasCustomPrompt = this.hasCustomPrompt;
        duplicate.idx = this.idx;
        duplicate.orient = this.orient;
        duplicate.sz = this.sz;
        duplicate.type = this.type;
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(this.hasCustomPrompt);
        w.WriteBool(isRealNumber(this.idx) || typeof this.idx === "string");
        if (isRealNumber(this.idx) || typeof this.idx === "string") {
            if (isRealNumber(this.idx)) {
                w.WriteLong(1);
                w.WriteLong(this.idx);
            } else {
                if (typeof this.idx === "string") {
                    w.WriteLong(2);
                    w.WriteString2(this.idx);
                }
            }
        }
        w.WriteBool(isRealNumber(this.type));
        if (isRealNumber(this.type)) {
            w.WriteLong(this.type);
        }
    };
    this.Read_FromBinary2 = function (r) {
        (this.hasCustomPrompt) = r.GetBool();
        if (r.GetBool()) {
            var type = r.GetLong();
            if (type === 1) {
                this.idx = r.GetLong();
            } else {
                if (type === 2) {
                    this.idx = r.GetString2();
                }
            }
        }
        if (r.GetBool()) {
            this.type = r.GetLong();
        }
    };
}
function UniNvPr() {
    this.cNvPr = new CNvPr();
    this.UniPr = null;
    this.nvPr = new NvPr();
    this.createDuplicate = function () {
        var duplicate = new UniNvPr();
        duplicate.cNvPr = this.cNvPr.createDuplicate();
        duplicate.UniPr = this.UniPr;
        duplicate.nvPr = this.nvPr.createDuplicate();
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        this.cNvPr.Write_ToBinary2(w);
        this.nvPr.Write_ToBinary2(w);
    };
    this.Read_FromBinary2 = function (r) {
        this.cNvPr.Read_FromBinary2(r);
        this.nvPr.Read_FromBinary2(r);
    };
}
function StyleRef() {
    this.idx = 0;
    this.Color = new CUniColor();
    this.Write_ToBinary2 = function (Writer) {
        Writer.WriteLong(this.idx);
        this.Color.Write_ToBinary2(Writer);
    };
    this.Read_FromBinary2 = function (Reader) {
        this.idx = Reader.GetLong();
        this.Color.Read_FromBinary2(Reader);
    };
    this.createDuplicate = function () {
        var duplicate = new StyleRef();
        duplicate.idx = this.idx;
        duplicate.Color = this.Color.createDuplicate();
        return duplicate;
    };
    this.isIdentical = function (styleRef) {
        if (styleRef == null) {
            return false;
        }
        if (this.idx !== styleRef.idx) {
            return false;
        }
        if (this.Color.IsIdentical(styleRef.Color) == false) {
            return false;
        }
        return true;
    };
}
var fntStyleInd_none = 2;
var fntStyleInd_major = 0;
var fntStyleInd_minor = 1;
function FontRef() {
    this.idx = fntStyleInd_none;
    this.Color = null;
    this.createDuplicate = function () {
        var duplicate = new FontRef();
        duplicate.idx = this.idx;
        if (this.Color) {
            duplicate.Color = this.Color.createDuplicate();
        }
        return duplicate;
    };
    this.Write_ToBinary2 = function (Writer) {
        Writer.WriteLong(this.idx);
        var flag = this.Color != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.Color.Write_ToBinary2(Writer);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        this.idx = Reader.GetLong();
        if (Reader.GetBool()) {
            this.Color = new CUniColor();
            this.Color.Read_FromBinary2(Reader);
        }
    };
}
function CShapeStyle() {
    this.lnRef = null;
    this.fillRef = null;
    this.effectRef = null;
    this.fontRef = null;
    this.Write_ToBinary2 = function (Writer) {
        var flag = this.lnRef != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.lnRef.Write_ToBinary2(Writer);
        }
        flag = this.fillRef != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.fillRef.Write_ToBinary2(Writer);
        }
        flag = this.effectRef != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.effectRef.Write_ToBinary2(Writer);
        }
        flag = this.fontRef != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.fontRef.Write_ToBinary2(Writer);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            this.lnRef = new StyleRef();
            this.lnRef.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.fillRef = new StyleRef();
            this.fillRef.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.effectRef = new StyleRef();
            this.effectRef.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.fontRef = new FontRef();
            this.fontRef.Read_FromBinary2(Reader);
        }
    };
    this.merge = function (style) {
        if (style != null) {
            if (style.lnRef != null) {
                this.lnRef = style.lnRef.createDuplicate();
            }
            if (style.fillRef != null) {
                this.fillRef = style.fillRef.createDuplicate();
            }
            if (style.effectRef != null) {
                this.effectRef = style.effectRef.createDuplicate();
            }
            if (style.fontRef != null) {
                this.fontRef = style.fontRef.createDuplicate();
            }
        }
    };
    this.createDuplicate = function () {
        var duplicate = new CShapeStyle();
        if (this.lnRef != null) {
            duplicate.lnRef = this.lnRef.createDuplicate();
        }
        if (this.fillRef != null) {
            duplicate.fillRef = this.fillRef.createDuplicate();
        }
        if (this.effectRef != null) {
            duplicate.effectRef = this.effectRef.createDuplicate();
        }
        if (this.fontRef != null) {
            duplicate.fontRef = this.fontRef.createDuplicate();
        }
        return duplicate;
    };
}
function CreateDefaultShapeStyle() {
    var style = new CShapeStyle();
    style.lnRef = new StyleRef();
    style.lnRef.idx = 2;
    style.lnRef.Color.color = new CSchemeColor();
    style.lnRef.Color.color.id = g_clr_accent1;
    var mod = new CColorMod();
    mod.name = "shade";
    mod.val = 50000;
    style.lnRef.Color.Mods.Mods.push(mod);
    style.fillRef = new StyleRef();
    style.fillRef.idx = 1;
    style.fillRef.Color.color = new CSchemeColor();
    style.fillRef.Color.color.id = g_clr_accent1;
    style.effectRef = new StyleRef();
    style.effectRef.idx = 0;
    style.effectRef.Color.color = new CSchemeColor();
    style.effectRef.Color.color.id = g_clr_accent1;
    style.fontRef = new FontRef();
    style.fontRef.idx = fntStyleInd_minor;
    style.fontRef.Color = new CUniColor();
    style.fontRef.Color.color = new CSchemeColor();
    style.fontRef.Color.color.id = tx1;
    return style;
}
function CXfrm() {
    this.offX = null;
    this.offY = null;
    this.extX = null;
    this.extY = null;
    this.chOffX = null;
    this.chOffY = null;
    this.chExtX = null;
    this.chExtY = null;
    this.flipH = null;
    this.flipV = null;
    this.rot = null;
    this.Write_ToBinary2 = function (Writer) {
        var flag;
        flag = this.offX != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.offX);
        }
        flag = this.offY != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.offY);
        }
        flag = this.extX != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.extX);
        }
        flag = this.extY != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.extY);
        }
        flag = this.chOffX != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.chOffX);
        }
        flag = this.chOffY != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.chOffY);
        }
        flag = this.chExtX != null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.chExtX);
        }
        flag = this.chExtY !== null;
        Writer.WriteBool(flag);
        if (flag === true) {
            Writer.WriteDouble(this.chExtY);
        }
        flag = this.flipH !== null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteBool(this.flipH);
        }
        flag = this.flipV !== null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteBool(this.flipV);
        }
        flag = this.rot !== null;
        Writer.WriteBool(flag);
        if (flag) {
            Writer.WriteDouble(this.rot);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            this.offX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.offY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.extX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.extY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.chOffX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.chOffY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.chExtX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.chExtY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.flipH = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.flipV = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.rot = Reader.GetDouble();
        }
    };
    this.isNotNull = function () {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.extX) && isRealNumber(this.extY);
    };
    this.isNotNullForGroup = function () {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.chOffX) && isRealNumber(this.chOffY) && isRealNumber(this.extX) && isRealNumber(this.extY) && isRealNumber(this.chExtX) && isRealNumber(this.chExtY);
    };
    this.isEqual = function (xfrm) {
        return xfrm && this.offX == xfrm.offX && this.offY == xfrm.offY && this.extX == xfrm.extX && this.extY == xfrm.extY && this.chOffX == xfrm.chOffX && this.chOffY == xfrm.chOffY && this.chExtX == xfrm.chExtX && this.chExtY == xfrm.chExtY;
    };
    this.merge = function (xfrm) {
        if (xfrm.offX != null) {
            this.offX = xfrm.offX;
        }
        if (xfrm.offY != null) {
            this.offY = xfrm.offY;
        }
        if (xfrm.extX != null) {
            this.extX = xfrm.extX;
        }
        if (xfrm.extY != null) {
            this.extY = xfrm.extY;
        }
        if (xfrm.chOffX != null) {
            this.chOffX = xfrm.chOffX;
        }
        if (xfrm.chOffY != null) {
            this.chOffY = xfrm.chOffY;
        }
        if (xfrm.chExtX != null) {
            this.chExtX = xfrm.chExtX;
        }
        if (xfrm.chExtY != null) {
            this.chExtY = xfrm.chExtY;
        }
        if (xfrm.flipH != null) {
            this.flipH = xfrm.flipH;
        }
        if (xfrm.flipV != null) {
            this.flipV = xfrm.flipV;
        }
        if (xfrm.rot != null) {
            this.rot = xfrm.rot;
        }
    };
    this.createDuplicate = function () {
        var duplicate = new CXfrm();
        duplicate.offX = this.offX;
        duplicate.offY = this.offY;
        duplicate.extX = this.extX;
        duplicate.extY = this.extY;
        duplicate.chOffX = this.chOffX;
        duplicate.chOffY = this.chOffY;
        duplicate.chExtX = this.chExtX;
        duplicate.chExtY = this.chExtY;
        duplicate.flipH = this.flipH;
        duplicate.flipV = this.flipV;
        duplicate.rot = this.rot;
        return duplicate;
    };
}
function CSpPr() {
    this.bwMode = 0;
    this.xfrm = new CXfrm();
    this.Geometry = null;
    this.Fill = null;
    this.ln = null;
    this.merge = function (spPr) {
        if (spPr.Geometry != null) {
            this.Geometry = spPr.Geometry.createDuplicate();
        }
        if (spPr.Fill != null && spPr.Fill.fill != null) {}
    };
    this.createDuplicate = function () {
        var duplicate = new CSpPr();
        duplicate.bwMode = this.bwMode;
        duplicate.xfrm = this.xfrm.createDuplicate();
        if (this.Geometry != null) {
            duplicate.Geometry = this.Geometry.createDuplicate();
        }
        if (this.geometry != null) {
            duplicate.geometry = this.geometry.createDuplicate();
        }
        if (this.Fill != null) {
            duplicate.Fill = this.Fill.createDuplicate();
        }
        if (this.ln != null) {
            duplicate.ln = this.ln.createDuplicate();
        }
        return duplicate;
    };
    this.Write_ToBinary2 = function (Writer) {
        var boolBWMode = this.bwMode == 1;
        Writer.WriteBool(boolBWMode);
        Writer.WriteBool(isRealObject(this.xfrm));
        if (isRealObject(this.xfrm)) {
            this.xfrm.Write_ToBinary2(Writer);
        }
        var flag = this.geometry != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.geometry.Write_ToBinary2(Writer);
        }
        flag = this.Fill != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.Fill.Write_ToBinary2(Writer);
        }
        flag = this.ln != null;
        Writer.WriteBool(flag);
        if (flag) {
            this.ln.Write_ToBinary2(Writer);
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        var boolBWMode = Reader.GetBool();
        this.bwMode = boolBWMode ? 1 : 0;
        if (Reader.GetBool()) {
            this.xfrm.Read_FromBinary2(Reader);
        }
        var flag = Reader.GetBool();
        if (flag) {
            this.geometry = new Geometry();
            this.geometry.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.Fill = new CUniFill();
            this.Fill.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.ln = new CLn();
            this.ln.Read_FromBinary2(Reader);
        }
    };
}
function CGrSpPr() {
    this.bwMode = 0;
    this.xfrm = null;
    this.Fill = null;
    this.ln = null;
    this.createDuplicate = function () {
        var duplicate = new CSpPr();
        duplicate.bwMode = this.bwMode;
        duplicate.xfrm = this.xfrm.createDuplicate();
        if (this.Fill != null) {
            duplicate.Fill = this.Fill.createDuplicate();
        }
        if (this.ln != null) {
            duplicate.ln = this.ln.createDuplicate();
        }
        return duplicate;
    };
}
var g_clr_MIN = 0;
var g_clr_accent1 = 0;
var g_clr_accent2 = 1;
var g_clr_accent3 = 2;
var g_clr_accent4 = 3;
var g_clr_accent5 = 4;
var g_clr_accent6 = 5;
var g_clr_dk1 = 6;
var g_clr_dk2 = 7;
var g_clr_folHlink = 8;
var g_clr_hlink = 9;
var g_clr_lt1 = 10;
var g_clr_lt2 = 11;
var g_clr_MAX = 11;
var g_clr_bg1 = g_clr_lt1;
var g_clr_bg2 = g_clr_lt2;
var g_clr_tx1 = g_clr_dk1;
var g_clr_tx2 = g_clr_dk2;
var phClr = 14;
var tx1 = 15;
var tx2 = 16;
function ClrScheme() {
    this.name = "";
    this.colors = new Array();
    for (var i = g_clr_MIN; i <= g_clr_MAX; i++) {
        this.colors[i] = null;
    }
    this.isIdentical = function (clrScheme) {
        if (clrScheme == null) {
            return false;
        }
        if (! (clrScheme instanceof ClrScheme)) {
            return false;
        }
        if (clrScheme.name != this.name) {
            return false;
        }
        for (var _clr_index = g_clr_MIN; _clr_index <= g_clr_MAX; ++_clr_index) {
            if (this.colors[i] != clrScheme.colors[i]) {
                return false;
            }
        }
        return true;
    };
    this.createDuplicate = function () {
        var _duplicate = new ClrScheme();
        _duplicate.name = this.name;
        for (var _clr_index = 0; _clr_index <= this.colors.length; ++_clr_index) {
            _duplicate.colors[_clr_index] = this.colors[_clr_index];
        }
        return _duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteLong(this.colors.length);
        for (var i = 0; i < this.colors.length; ++i) {
            var bool = isRealObject(this.colors[i]) && typeof this.colors[i].Write_ToBinary2 === "function";
            w.WriteBool(bool);
            if (bool) {
                this.colors[i].Write_ToBinary2(w);
            }
        }
    };
    this.Read_FromBinary2 = function (r) {
        var count = r.GetLong();
        for (var i = 0; i < count; ++i) {
            if (r.GetBool()) {
                this.colors[i] = new CUniColor();
                this.colors[i].Read_FromBinary2(r);
            }
        }
    };
}
function ClrMap() {
    this.color_map = new Array();
    for (var i = 0; i < 17; i++) {
        this.color_map[i] = null;
    }
    this.createDuplicate = function () {
        var _copy = new ClrMap();
        for (var _color_index = 0; _color_index < 17; ++_color_index) {
            _copy.color_map[_color_index] = this.color_map[_color_index];
        }
        return _copy;
    };
    this.Write_ToBinary2 = function (w) {
        for (var i = 0; i < 17; i++) {
            w.WriteBool(isRealNumber(this.color_map[i]));
            if (isRealNumber(this.color_map[i])) {
                w.WriteLong(this.color_map[i]);
            }
        }
    };
    this.Read_FromBinary2 = function (r) {
        for (var i = 0; i < 17; i++) {
            if (r.GetBool()) {
                this.color_map[i] = r.GetLong();
            } else {
                this.color_map[i] = null;
            }
        }
    };
}
function ExtraClrScheme() {
    this.clrScheme = new ClrScheme();
    this.clrMap = null;
}
function FontCollection() {
    this.latin = null;
    this.ea = null;
    this.cs = null;
    this.Write_ToBinary2 = function (w) {
        w.WriteBool((typeof this.latin === "string"));
        if ((typeof this.latin === "string")) {
            w.WriteString2(this.latin);
        }
        w.WriteBool((typeof this.ea === "string"));
        if ((typeof this.ea === "string")) {
            w.WriteString2(this.ea);
        }
        w.WriteBool((typeof this.cs === "string"));
        if ((typeof this.cs === "string")) {
            w.WriteString2(this.cs);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.latin = r.GetString2();
        } else {
            this.latin = null;
        }
        if (r.GetBool()) {
            this.ea = r.GetString2();
        } else {
            this.ea = null;
        }
        if (r.GetBool()) {
            this.cs = r.GetString2();
        } else {
            this.cs = null;
        }
    };
}
function FontScheme() {
    this.name = "";
    this.majorFont = new FontCollection();
    this.minorFont = new FontCollection();
    this.Write_ToBinary2 = function (w) {
        this.majorFont.Write_ToBinary2(w);
        this.minorFont.Write_ToBinary2(w);
    };
    this.Read_FromBinary2 = function (r) {
        this.majorFont.Read_FromBinary2(r);
        this.minorFont.Read_FromBinary2(r);
    };
}
function FmtScheme() {
    this.name = "";
    this.fillStyleLst = new Array();
    this.lnStyleLst = new Array();
    this.effectStyleLst = null;
    this.bgFillStyleLst = new Array();
    this.GetFillStyle = function (number) {
        if (number >= 1 && number <= 999) {
            var ret = this.fillStyleLst[number - 1];
            if (undefined === ret) {
                return null;
            }
            return ret.createDuplicate();
        } else {
            if (number >= 1001) {
                var ret = this.bgFillStyleLst[number - 1001];
                if (undefined === ret) {
                    return null;
                }
                return ret.createDuplicate();
            }
        }
        return null;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteString2(this.name);
        w.WriteLong(this.fillStyleLst.length);
        for (var i = 0; i < this.fillStyleLst.length; ++i) {
            this.fillStyleLst[i].Write_ToBinary2(w);
        }
        w.WriteLong(this.lnStyleLst.length);
        for (var i = 0; i < this.lnStyleLst.length; ++i) {
            this.lnStyleLst[i].Write_ToBinary2(w);
        }
        w.WriteLong(this.bgFillStyleLst.length);
        for (var i = 0; i < this.bgFillStyleLst.length; ++i) {
            this.bgFillStyleLst[i].Write_ToBinary2(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        this.name = r.GetString2();
        var c = r.GetLong();
        for (var i = 0; i < c; ++i) {
            this.fillStyleLst[i] = new CUniFill();
            this.fillStyleLst[i].Read_FromBinary2(r);
        }
        c = r.GetLong();
        for (i = 0; i < c; ++i) {
            this.lnStyleLst[i] = new CLn();
            this.lnStyleLst[i].Read_FromBinary2(r);
        }
        c = r.GetLong();
        for (i = 0; i < c; ++i) {
            this.bgFillStyleLst[i] = new CUniFill();
            this.bgFillStyleLst[i].Read_FromBinary2(r);
        }
    };
}
function ThemeElements() {
    this.clrScheme = new ClrScheme();
    this.fontScheme = new FontScheme();
    this.fmtScheme = new FmtScheme();
}
function CTheme() {
    this.name = "";
    this.themeElements = new ThemeElements();
    this.spDef = null;
    this.lnDef = null;
    this.txDef = null;
    this.extraClrSchemeLst = new Array();
    this.presentation = null;
    this.clrMap = null;
    this.getFillStyle = function (idx) {
        if (this.themeElements.fmtScheme.fillStyleLst[idx - 1]) {
            return this.themeElements.fmtScheme.fillStyleLst[idx - 1].createDuplicate();
        }
        return new CUniFill();
    };
    this.getLnStyle = function (idx) {
        if (this.themeElements.fmtScheme.lnStyleLst[idx - 1]) {
            return this.themeElements.fmtScheme.lnStyleLst[idx - 1].createDuplicate();
        }
        return new CLn();
    };
    this.changeColorScheme = function (clrScheme) {
        History.Add(this, {
            Type: historyitem_ChangeColorScheme,
            oldPr: this.themeElements.clrScheme,
            newPr: clrScheme
        });
        this.themeElements.clrScheme = clrScheme;
    };
    this.setFontScheme = function (fontScheme) {
        History.Add(this, {
            Type: historyitem_ChangeFontScheme,
            oldPr: this.themeElements.fontScheme,
            newPr: fontScheme
        });
        this.themeElements.fontScheme = fontScheme;
    };
    this.setFormatScheme = function (fmtScheme) {
        History.Add(this, {
            Type: historyitem_ChangeFmtScheme,
            oldPr: this.themeElements.fmtScheme,
            newPr: fmtScheme
        });
        this.themeElements.fmtScheme = fmtScheme;
    };
    this.Refresh_RecalcData = function () {
        var slides = editor.WordControl.m_oLogicDocument.Slides;
        for (var i = 0; i < slides.length; ++i) {
            var slide = slides[i];
            if (slide.Layout && slide.Layout.Master && slide.Layout.Master.Theme === this) {
                slide.recalcAllColors();
            }
        }
    };
    this.Undo = function (data) {
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            this.themeElements.clrScheme = data.oldPr;
            break;
        case historyitem_ChangeFontScheme:
            this.themeElements.fontScheme = data.oldPr;
            break;
        case historyitem_ChangeFmtScheme:
            this.themeElements.fmtScheme = data.oldPr;
            break;
        }
        var _slides = editor.WordControl.m_oLogicDocument.Slides;
        var _slide_count = _slides.length;
        for (var _slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
            _cur_slide = _slides[_slide_index];
            _cur_theme = _cur_slide.Layout.Master.Theme;
            if (_cur_theme === this) {
                _cur_slide.recalcAllColors();
                _cur_slide.Layout.recalcAll();
                _cur_slide.Layout.Master.recalcAll();
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
            }
        }
    };
    this.Redo = function (data) {
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            this.themeElements.clrScheme = data.newPr;
            break;
        case historyitem_ChangeFontScheme:
            this.themeElements.fontScheme = data.newPr;
            break;
        case historyitem_ChangeFmtScheme:
            this.themeElements.fmtScheme = data.newPr;
            break;
        }
        var _slides = editor.WordControl.m_oLogicDocument.Slides;
        var _slide_count = _slides.length;
        for (var _slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
            _cur_slide = _slides[_slide_index];
            _cur_theme = _cur_slide.Layout.Master.Theme;
            if (_cur_theme === this) {
                _cur_slide.recalcAllColors();
                _cur_slide.Layout.recalcAll();
                _cur_slide.Layout.Master.recalcAll();
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
            }
        }
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteLong(historyitem_type_Theme);
        w.WriteString2(this.Id);
    };
    this.Read_FromBinary2 = function (r) {
        this.Id = r.GetString2();
    };
    this.Save_Changes = function (data, w) {
        w.WriteLong(historyitem_type_Theme);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            case historyitem_ChangeFontScheme:
            case historyitem_ChangeFmtScheme:
            data.newPr.Write_ToBinary2(w);
            break;
        }
    };
    this.Load_Changes = function (r) {
        if (r.GetLong() === historyitem_type_Theme) {
            var type = r.GetLong();
            switch (type) {
            case historyitem_ChangeColorScheme:
                this.themeElements.clrScheme = new ClrScheme();
                this.themeElements.clrScheme.Read_FromBinary2(r);
                var _slides = editor.WordControl.m_oLogicDocument.Slides;
                var _slide_count = _slides.length;
                for (var _slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
                    _cur_slide = _slides[_slide_index];
                    _cur_theme = _cur_slide.Layout.Master.Theme;
                    if (_cur_theme === this) {
                        _cur_slide.recalcAllColors();
                        _cur_slide.Layout.recalcAll();
                        _cur_slide.Layout.Master.recalcAll();
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                    }
                }
                break;
            case historyitem_ChangeFontScheme:
                this.themeElements.fontScheme = new FontScheme();
                this.themeElements.fontScheme.Read_FromBinary2(r);
                var _slides = editor.WordControl.m_oLogicDocument.Slides;
                var _slide_count = _slides.length;
                for (var _slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
                    _cur_slide = _slides[_slide_index];
                    _cur_theme = _cur_slide.Layout.Master.Theme;
                    if (_cur_theme === this) {
                        _cur_slide.recalcAllColors();
                        _cur_slide.Layout.recalcAll();
                        _cur_slide.Layout.Master.recalcAll();
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                    }
                }
                break;
            case historyitem_ChangeFmtScheme:
                this.themeElements.fmtScheme = new FmtScheme();
                this.themeElements.fmtScheme.Read_FromBinary2(r);
                var _slides = editor.WordControl.m_oLogicDocument.Slides;
                var _slide_count = _slides.length;
                for (var _slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
                    _cur_slide = _slides[_slide_index];
                    _cur_theme = _cur_slide.Layout.Master.Theme;
                    if (_cur_theme === this) {
                        _cur_slide.recalcAllColors();
                        _cur_slide.Layout.recalcAll();
                        _cur_slide.Layout.Master.recalcAll();
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                        editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                    }
                }
                break;
            }
        }
    };
    this.Get_Id = function () {
        return this.Id;
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
function HF() {
    this.dt = true;
    this.ftr = true;
    this.hdr = true;
    this.sldNum = true;
}
function CBgPr() {
    this.Fill = null;
    this.shadeToTitle = false;
    this.merge = function (bgPr) {
        if (this.Fill == null) {
            this.Fill = new CUniFill();
            if (bgPr.Fill != null) {
                this.Fill.merge(bgPr.Fill);
            }
        }
    };
    this.createFullCopy = function () {
        var _copy = new CBgPr();
        if (this.Fill != null) {
            _copy.Fill = this.Fill.createDuplicate();
        }
        _copy.shadeToTitle = this.shadeToTitle;
        return _copy;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealObject(this.Fill));
        if (isRealObject(this.Fill)) {
            this.Fill.Write_ToBinary2(w);
        }
        w.WriteBool(this.shadeToTitle);
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.Fill = new CUniFill();
            this.Fill.Read_FromBinary2(r);
        }
        this.shadeToTitle = r.GetBool();
    };
}
function CBg() {
    this.bwMode = null;
    this.bgPr = null;
    this.bgRef = null;
    this.merge = function (bg) {
        if (this.bgPr == null) {
            this.bgPr = new CBgPr();
            if (bg.bgPr != null) {
                this.bgPr.merge(bg.bgPr);
            }
        }
    };
    this.createFullCopy = function () {
        var _copy = new CBg();
        _copy.bwMode = this.bwMode;
        if (this.bgPr != null) {
            _copy.bgPr = this.bgPr.createFullCopy();
        }
        if (this.bgRef != null) {
            _copy.bgRef = this.bgRef.createDuplicate();
        }
        return _copy;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealObject(this.bgPr));
        if (isRealObject(this.bgPr)) {
            this.bgPr.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.bgRef));
        if (isRealObject(this.bgRef)) {
            this.bgRef.Write_ToBinary2(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.bgPr = new CBgPr();
            this.bgPr.Read_FromBinary2(r);
        } else {
            this.bgPr = null;
        }
        if (r.GetBool()) {
            this.bgRef = new StyleRef();
            this.bgRef.Read_FromBinary2(r);
        } else {
            this.bgRef = null;
        }
    };
}
function CSld() {
    this.name = "";
    this.Bg = null;
    this.spTree = [];
    this.merge = function (cSld) {};
    this.createFullCopy = function (parent, elementsManipulator) {
        var _copy = new CSld();
        _copy.name = this.name;
        if (this.Bg != null) {
            _copy.Bg = this.Bg.createFullCopy();
        }
        var _glyph_index;
        for (_glyph_index = 0; _glyph_index < this.spTree.length; ++_glyph_index) {
            if (typeof this.spTree[_glyph_index].createFullCopy === "function") {
                _copy.spTree[_glyph_index] = this.spTree[_glyph_index].createFullCopy(parent, elementsManipulator);
                _copy.spTree[_glyph_index].Recalculate();
                _copy.spTree[_glyph_index].updateCursorTypes();
            }
        }
        return _copy;
    };
}
function CTextStyle() {
    this.defPPr = null;
    this.lvl1pPr = null;
    this.lvl2pPr = null;
    this.lvl3pPr = null;
    this.lvl4pPr = null;
    this.lvl5pPr = null;
    this.lvl6pPr = null;
    this.lvl7pPr = null;
    this.lvl8pPr = null;
    this.lvl9pPr = null;
}
function CTextStyles() {
    this.titleStyle = null;
    this.bodyStyle = null;
    this.otherStyle = null;
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealObject(this.titleStyle));
        if (isRealObject(this.titleStyle)) {
            this.titleStyle.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.bodyStyle));
        if (isRealObject(this.bodyStyle)) {
            this.bodyStyle.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.otherStyle));
        if (isRealObject(this.otherStyle)) {
            this.otherStyle.Write_ToBinary2(w);
        }
        w.WriteString2("test");
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.titleStyle = new TextListStyle();
            this.titleStyle.Read_FromBinary2(r);
        } else {
            this.titleStyle = null;
        }
        if (r.GetBool()) {
            this.bodyStyle = new TextListStyle();
            this.bodyStyle.Read_FromBinary2(r);
        } else {
            this.bodyStyle = null;
        }
        if (r.GetBool()) {
            this.otherStyle = new TextListStyle();
            this.otherStyle.Read_FromBinary2(r);
        } else {
            this.otherStyle = null;
        }
        var s = r.GetString2();
    };
}
var nSldLtTBlank = 0;
var nSldLtTChart = 1;
var nSldLtTChartAndTx = 2;
var nSldLtTClipArtAndTx = 3;
var nSldLtTClipArtAndVertTx = 4;
var nSldLtTCust = 5;
var nSldLtTDgm = 6;
var nSldLtTFourObj = 7;
var nSldLtTMediaAndTx = 8;
var nSldLtTObj = 9;
var nSldLtTObjAndTwoObj = 10;
var nSldLtTObjAndTx = 11;
var nSldLtTObjOnly = 12;
var nSldLtTObjOverTx = 13;
var nSldLtTObjTx = 14;
var nSldLtTPicTx = 15;
var nSldLtTSecHead = 16;
var nSldLtTTbl = 17;
var nSldLtTTitle = 18;
var nSldLtTTitleOnly = 19;
var nSldLtTTwoColTx = 20;
var nSldLtTTwoObj = 21;
var nSldLtTTwoObjAndObj = 22;
var nSldLtTTwoObjAndTx = 23;
var nSldLtTTwoObjOverTx = 24;
var nSldLtTTwoTxTwoObj = 25;
var nSldLtTTx = 26;
var nSldLtTTxAndChart = 27;
var nSldLtTTxAndClipArt = 28;
var nSldLtTTxAndMedia = 29;
var nSldLtTTxAndObj = 30;
var nSldLtTTxAndTwoObj = 31;
var nSldLtTTxOverObj = 32;
var nSldLtTVertTitleAndTx = 33;
var nSldLtTVertTitleAndTxOverChart = 34;
var nSldLtTVertTx = 35;
var _weight_body = 9;
var _weight_chart = 5;
var _weight_clipArt = 2;
var _weight_ctrTitle = 11;
var _weight_dgm = 4;
var _weight_media = 3;
var _weight_obj = 8;
var _weight_pic = 7;
var _weight_subTitle = 10;
var _weight_tbl = 6;
var _weight_title = 11;
var _ph_multiplier = 4;
var _ph_summ_blank = 0;
var _ph_summ_chart = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart);
var _ph_summ_chart_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ_dgm = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_dgm);
var _ph_summ_four_obj = Math.pow(_ph_multiplier, _weight_title) + 4 * Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__media_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_media) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_two_obj = Math.pow(_ph_multiplier, _weight_title) + 3 * Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj_only = Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__pic_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_pic) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__sec_head = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_subTitle);
var _ph_summ__tbl = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_tbl);
var _ph_summ__title_only = Math.pow(_ph_multiplier, _weight_title);
var _ph_summ__two_col_tx = Math.pow(_ph_multiplier, _weight_title) + 2 * Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + 2 * Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_two_tx = Math.pow(_ph_multiplier, _weight_title) + 2 * Math.pow(_ph_multiplier, _weight_obj) + 2 * Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx_and_clip_art = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body) + +Math.pow(_ph_multiplier, _weight_clipArt);
var _arr_lt_types_weight = [];
_arr_lt_types_weight[0] = _ph_summ_blank;
_arr_lt_types_weight[1] = _ph_summ_chart;
_arr_lt_types_weight[2] = _ph_summ_chart_and_tx;
_arr_lt_types_weight[3] = _ph_summ_dgm;
_arr_lt_types_weight[4] = _ph_summ_four_obj;
_arr_lt_types_weight[5] = _ph_summ__media_and_tx;
_arr_lt_types_weight[6] = _ph_summ__obj;
_arr_lt_types_weight[7] = _ph_summ__obj_and_two_obj;
_arr_lt_types_weight[8] = _ph_summ__obj_and_tx;
_arr_lt_types_weight[9] = _ph_summ__obj_only;
_arr_lt_types_weight[10] = _ph_summ__pic_tx;
_arr_lt_types_weight[11] = _ph_summ__sec_head;
_arr_lt_types_weight[12] = _ph_summ__tbl;
_arr_lt_types_weight[13] = _ph_summ__title_only;
_arr_lt_types_weight[14] = _ph_summ__two_col_tx;
_arr_lt_types_weight[15] = _ph_summ__two_obj_and_tx;
_arr_lt_types_weight[16] = _ph_summ__two_obj_and_two_tx;
_arr_lt_types_weight[17] = _ph_summ__tx;
_arr_lt_types_weight[18] = _ph_summ__tx_and_clip_art;
_arr_lt_types_weight.sort(function (a, b) {
    return a - b;
});
var _global_layout_summs_array = {};
_global_layout_summs_array["_" + _ph_summ_blank] = nSldLtTBlank;
_global_layout_summs_array["_" + _ph_summ_chart] = nSldLtTChart;
_global_layout_summs_array["_" + _ph_summ_chart_and_tx] = nSldLtTChartAndTx;
_global_layout_summs_array["_" + _ph_summ_dgm] = nSldLtTDgm;
_global_layout_summs_array["_" + _ph_summ_four_obj] = nSldLtTFourObj;
_global_layout_summs_array["_" + _ph_summ__media_and_tx] = nSldLtTMediaAndTx;
_global_layout_summs_array["_" + _ph_summ__obj] = nSldLtTObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_two_obj] = nSldLtTObjAndTwoObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_tx] = nSldLtTObjAndTx;
_global_layout_summs_array["_" + _ph_summ__obj_only] = nSldLtTObjOnly;
_global_layout_summs_array["_" + _ph_summ__pic_tx] = nSldLtTPicTx;
_global_layout_summs_array["_" + _ph_summ__sec_head] = nSldLtTSecHead;
_global_layout_summs_array["_" + _ph_summ__tbl] = nSldLtTTbl;
_global_layout_summs_array["_" + _ph_summ__title_only] = nSldLtTTitleOnly;
_global_layout_summs_array["_" + _ph_summ__two_col_tx] = nSldLtTTwoColTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_tx] = nSldLtTTwoObjAndTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_two_tx] = nSldLtTTwoTxTwoObj;
_global_layout_summs_array["_" + _ph_summ__tx] = nSldLtTTx;
_global_layout_summs_array["_" + _ph_summ__tx_and_clip_art] = nSldLtTTxAndClipArt;
function NoteMaster() {
    this.cSld = new CSld();
    this.clrMap = new ClrMap();
    this.hf = new HF();
    this.notesStyle = null;
    this.Theme = null;
    this.TableStyles = null;
    this.Calculate = function () {};
}
function NoteSlide() {
    this.cSld = new CSld();
    this.clrMap = null;
    this.showMasterPhAnim = false;
    this.showMasterSp = false;
    this.Calculate = function () {};
}
function isThemeFont(sFont) {
    return sFont == "+mj-lt" || sFont == "+mn-lt" || sFont == "+mj-ea" || sFont == "+mn-ea" || sFont == "+mj-cs" || sFont == "+mn-cs";
}
function getFontInfo(sFont) {
    switch (sFont) {
    case "+mj-lt":
        return function (obj) {
            return obj.majorFont.latin;
        };
    case "+mn-lt":
        return function (obj) {
            return obj.minorFont.latin;
        };
    case "+mj-ea":
        return function (obj) {
            return obj.majorFont.ea;
        };
    case "+mn-ea":
        return function (obj) {
            return obj.minorFont.ea;
        };
    case "+mj-cs":
        return function (obj) {
            return obj.majorFont.cs;
        };
    case "+mn-cs":
        return function (obj) {
            return obj.minorFont.cs;
        };
    default:
        return function (obj) {
            return sFont;
        };
    }
}
function redrawSlide(slide, presentation, arr_layouts, direction, arr_slides) {
    var _history_is_on = History.Is_On();
    if (_history_is_on) {
        History.TurnOff();
    }
    if (slide !== null && typeof slide === "object") {
        var _new_layout = slide.Layout;
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
            _arr_shapes[_shape_index].recalculate();
        }
        slide.recalcAll();
        slide.recalculate();
        if (direction === 0) {
            editor.WordControl.m_oLogicDocument.RecalculateCurPos();
        }
        presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    }
    if (_history_is_on) {
        History.TurnOn();
    }
    if (slide !== null && typeof slide === "object") {
        if (direction == 0) {
            if (slide.num > 0) {
                presentation.backChangeThemeTimeOutId = setTimeout(function () {
                    redrawSlide(arr_slides[slide.num - 1], presentation, arr_layouts, -1, arr_slides);
                },
                30);
            } else {
                presentation.backChangeThemeTimeOutId = null;
            }
            if (slide.num < presentation.Slides.length - 1) {
                presentation.forwardChangeThemeTimeOutId = setTimeout(function () {
                    redrawSlide(arr_slides[slide.num + 1], presentation, arr_layouts, +1, arr_slides);
                },
                30);
            } else {
                presentation.forwardChangeThemeTimeOutId = null;
            }
            presentation.startChangeThemeTimeOutId = null;
        }
        if (direction > 0) {
            if (slide.num < presentation.Slides.length - 1) {
                presentation.forwardChangeThemeTimeOutId = setTimeout(function () {
                    redrawSlide(arr_slides[slide.num + 1], presentation, arr_layouts, +1, arr_slides);
                },
                30);
            } else {
                presentation.forwardChangeThemeTimeOutId = null;
            }
        }
        if (direction < 0) {
            if (slide.num > 0) {
                presentation.backChangeThemeTimeOutId = setTimeout(function () {
                    redrawSlide(arr_slides[slide.num - 1], presentation, arr_layouts, -1, arr_slides);
                },
                30);
            } else {
                presentation.backChangeThemeTimeOutId = null;
            }
        }
    } else {
        presentation.startChangeThemeTimeOutId = null;
        presentation.forwardChangeThemeTimeOutId = null;
        presentation.backChangeThemeTimeOutId = null;
    }
}
function redrawSlide2(slide, presentation, arrInd, pos, arr_layouts, direction, arr_slides) {
    var _history_is_on = History.Is_On();
    if (_history_is_on) {
        History.TurnOff();
    }
    if (slide !== null && typeof slide === "object") {
        var _new_layout = slide.Layout;
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
            _arr_shapes[_shape_index].recalculate();
        }
        slide.recalcAll();
        slide.recalculate();
        presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    }
    if (_history_is_on) {
        History.TurnOn();
    }
    if (direction == 0) {
        if (pos > 0) {
            presentation.backChangeThemeTimeOutId = setTimeout(function () {
                redrawSlide2(arr_slides[arrInd[pos - 1]], presentation, arrInd, pos - 1, arr_layouts, -1, arr_slides);
            },
            30);
        } else {
            presentation.backChangeThemeTimeOutId = null;
        }
        if (pos < arrInd.length - 1) {
            presentation.forwardChangeThemeTimeOutId = setTimeout(function () {
                redrawSlide2(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1, arr_layouts, +1, arr_slides);
            },
            30);
        } else {
            presentation.forwardChangeThemeTimeOutId = null;
        }
        presentation.startChangeThemeTimeOutId = null;
    }
    if (direction > 0) {
        if (pos < arrInd.length - 1) {
            presentation.forwardChangeThemeTimeOutId = setTimeout(function () {
                redrawSlide2(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1, arr_layouts, +1, arr_slides);
            },
            30);
        } else {
            presentation.forwardChangeThemeTimeOutId = null;
        }
    }
    if (direction < 0) {
        if (pos > 0) {
            presentation.backChangeThemeTimeOutId = setTimeout(function () {
                redrawSlide2(arr_slides[arrInd[pos - 1]], presentation, arrInd, pos - 1, arr_layouts, -1, arr_slides);
            },
            30);
        } else {
            presentation.backChangeThemeTimeOutId = null;
        }
    }
}
function recalculateSlideAfterChangeThemeColors(slide, presentation, direction, arr_slides) {
    var _history_is_on = History.Is_On();
    slide.recalcAllColors();
    slide.recalculate();
    presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    if (direction == 0) {
        if (slide.num > 0) {
            setTimeout(function () {
                recalculateSlideAfterChangeThemeColors(arr_slides[slide.num - 1], presentation, -1, arr_slides);
            },
            30);
        }
        if (slide.num < presentation.Slides.length - 1) {
            setTimeout(function () {
                recalculateSlideAfterChangeThemeColors(arr_slides[slide.num + 1], presentation, +1, arr_slides);
            },
            30);
        }
        presentation.startChangeThemeTimeOutId = null;
    }
    if (direction > 0) {
        if (slide.num < presentation.Slides.length - 1) {
            setTimeout(function () {
                recalculateSlideAfterChangeThemeColors(arr_slides[slide.num + 1], presentation, +1, arr_slides);
            },
            30);
        }
    }
    if (direction < 0) {
        if (slide.num > 0) {
            setTimeout(function () {
                recalculateSlideAfterChangeThemeColors(arr_slides[slide.num - 1], presentation, -1, arr_slides);
            },
            30);
        }
    }
}
var text_fit_No = 0;
var text_fit_Auto = 1;
var text_fit_NormAuto = 2;
function CTextFit() {
    this.type = 0;
    this.fontScale = null;
    this.lnSpcReduction = null;
}
CTextFit.prototype = {
    CreateDublicate: function () {
        var d = new CTextFit();
        d.type = this.type;
        d.fontScale = this.fontScale;
        d.lnSpcReduction = this.lnSpcReduction;
        return d;
    }
};
function CBodyPr() {
    this.flatTx = null;
    this.anchor = null;
    this.anchorCtr = null;
    this.bIns = null;
    this.compatLnSpc = null;
    this.forceAA = null;
    this.fromWordArt = null;
    this.horzOverflow = null;
    this.lIns = null;
    this.numCol = null;
    this.rIns = null;
    this.rot = null;
    this.rtlCol = null;
    this.spcCol = null;
    this.spcFirstLastPara = null;
    this.tIns = null;
    this.upright = null;
    this.vert = null;
    this.vertOverflow = null;
    this.wrap = null;
    this.textFit = null;
    this.Write_ToBinary2 = function (w) {
        var flag = this.flatTx != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.flatTx);
        }
        flag = this.anchor != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.anchor);
        }
        flag = this.anchorCtr != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.anchorCtr);
        }
        flag = this.bIns != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteDouble(this.bIns);
        }
        flag = this.compatLnSpc != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.compatLnSpc);
        }
        flag = this.forceAA != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.forceAA);
        }
        flag = this.fromWordArt != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.fromWordArt);
        }
        flag = this.horzOverflow != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.horzOverflow);
        }
        flag = this.lIns != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteDouble(this.lIns);
        }
        flag = this.numCol != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.numCol);
        }
        flag = this.rIns != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteDouble(this.rIns);
        }
        flag = this.rot != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteDouble(this.rot);
        }
        flag = this.rtlCol != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.rtlCol);
        }
        flag = this.spcCol != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.spcCol);
        }
        flag = this.spcFirstLastPara != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.spcFirstLastPara);
        }
        flag = this.tIns != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteDouble(this.tIns);
        }
        flag = this.upright != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteBool(this.upright);
        }
        flag = this.vert != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.vert);
        }
        flag = this.vertOverflow != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.vertOverflow);
        }
        flag = this.wrap != null;
        w.WriteBool(flag);
        if (flag) {
            w.WriteLong(this.wrap);
        }
    };
    this.Read_FromBinary2 = function (r) {
        var flag = r.GetBool();
        if (flag) {
            this.flatTx = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.anchor = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.anchorCtr = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.bIns = r.GetDouble();
        }
        flag = r.GetBool();
        if (flag) {
            this.compatLnSpc = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.forceAA = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.fromWordArt = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.horzOverflow = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.lIns = r.GetDouble();
        }
        flag = r.GetBool();
        if (flag) {
            this.numCol = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.rIns = r.GetDouble();
        }
        flag = r.GetBool();
        if (flag) {
            this.rot = r.GetDouble();
        }
        flag = r.GetBool();
        if (flag) {
            this.rtlCol = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.spcCol = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.spcFirstLastPara = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.tIns = r.GetDouble();
        }
        flag = r.GetBool();
        if (flag) {
            this.upright = r.GetBool();
        }
        flag = r.GetBool();
        if (flag) {
            this.vert = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.vertOverflow = r.GetLong();
        }
        flag = r.GetBool();
        if (flag) {
            this.wrap = r.GetLong();
        }
    };
    this.setDefault = function () {
        this.flatTx = null;
        this.anchor = 4;
        this.anchorCtr = false;
        this.bIns = 45720 / 36000;
        this.compatLnSpc = false;
        this.forceAA = false;
        this.fromWordArt = false;
        this.horzOverflow = nOTOwerflow;
        this.lIns = 91440 / 36000;
        this.numCol = 1;
        this.rIns = 91440 / 36000;
        this.rot = null;
        this.rtlCol = false;
        this.spcCol = false;
        this.spcFirstLastPara = null;
        this.tIns = 45720 / 36000;
        this.upright = false;
        this.vert = nVertTThorz;
        this.vertOverflow = nOTOwerflow;
        this.wrap = nTWTSquare;
    };
    this.createDuplicate = function () {
        var duplicate = new CBodyPr();
        duplicate.flatTx = this.flatTx;
        duplicate.anchor = this.anchor;
        duplicate.anchorCtr = this.anchorCtr;
        duplicate.bIns = this.bIns;
        duplicate.compatLnSpc = this.compatLnSpc;
        duplicate.forceAA = this.forceAA;
        duplicate.fromWordArt = this.fromWordArt;
        duplicate.horzOverflow = this.horzOverflow;
        duplicate.lIns = this.lIns;
        duplicate.rIns = this.rIns;
        duplicate.rot = this.rot;
        duplicate.rtlCol = this.rtlCol;
        duplicate.spcCol = this.spcCol;
        duplicate.spcFirstLastPara = this.spcFirstLastPara;
        duplicate.tIns = this.tIns;
        duplicate.upright = this.upright;
        duplicate.vert = this.vert;
        duplicate.vertOverflow = this.vertOverflow;
        duplicate.wrap = this.wrap;
        return duplicate;
    };
    this.merge = function (bodyPr) {
        if (bodyPr.flatTx != null) {
            this.flatTx = bodyPr.flatTx;
        }
        if (bodyPr.anchor != null) {
            this.anchor = bodyPr.anchor;
        }
        if (bodyPr.anchorCtr != null) {
            this.anchorCtr = bodyPr.anchorCtr;
        }
        if (bodyPr.bIns != null) {
            this.bIns = bodyPr.bIns;
        }
        if (bodyPr.compatLnSpc != null) {
            this.compatLnSpc = bodyPr.compatLnSpc;
        }
        if (bodyPr.forceAA != null) {
            this.forceAA = bodyPr.forceAA;
        }
        if (bodyPr.fromWordArt != null) {
            this.fromWordArt = bodyPr.fromWordArt;
        }
        if (bodyPr.horzOverflow != null) {
            this.horzOverflow = bodyPr.horzOverflow;
        }
        if (bodyPr.lIns != null) {
            this.lIns = bodyPr.lIns;
        }
        if (bodyPr.rIns != null) {
            this.rIns = bodyPr.rIns;
        }
        if (bodyPr.rot != null) {
            this.rot = bodyPr.rot;
        }
        if (bodyPr.rtlCol != null) {
            this.rtlCol = bodyPr.rtlCol;
        }
        if (bodyPr.spcCol != null) {
            this.spcCol = bodyPr.spcCol;
        }
        if (bodyPr.spcFirstLastPara != null) {
            this.spcFirstLastPara = bodyPr.spcFirstLastPara;
        }
        if (bodyPr.tIns != null) {
            this.tIns = bodyPr.tIns;
        }
        if (bodyPr.upright != null) {
            this.upright = bodyPr.upright;
        }
        if (bodyPr.vert != null) {
            this.vert = bodyPr.vert;
        }
        if (bodyPr.vertOverflow != null) {
            this.vertOverflow = bodyPr.vertOverflow;
        }
        if (bodyPr.wrap != null) {
            this.wrap = bodyPr.wrap;
        }
    };
}
function CHyperlink() {
    this.url = "";
    this.action = "";
}
function CTextParagraphPr() {
    this.bullet = new CBullet();
    this.lvl = null;
    this.pPr = new CParaPr();
    this.rPr = new CTextPr();
    this.createDuplicate = function () {
        var duplicate = new CTextParagraphPr();
        duplicate.bullet = this.bullet.createDuplicate();
        duplicate.lvl = this.lvl;
        duplicate.pPr = clone(this.pPr);
        duplicate.rPr = clone(this.rPr);
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealObject(this.bullet));
        if (isRealObject(this.bullet)) {
            this.bullet.Write_ToBinary2(w);
        }
        w.WriteBool(isRealNumber(this.lvl));
        if (isRealNumber(this.lvl)) {
            w.WriteLong(this.lvl);
        }
        w.WriteBool(isRealObject(this.pPr));
        if (isRealObject(this.pPr)) {
            this.pPr.Write_ToBinary(w);
        }
        w.WriteBool(isRealObject(this.rPr));
        if (isRealObject(this.rPr)) {
            this.rPr.Write_ToBinary(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.bullet = new CBullet();
            this.bullet.Read_FromBinary2(r);
        } else {
            this.bullet = new CBullet();
        }
        if (r.GetBool()) {
            this.lvl = r.GetLong();
        } else {
            this.lvl = null;
        }
        this.pPr = new CParaPr();
        if (r.GetBool()) {
            this.pPr.Read_FromBinary(r);
        }
        this.rPr = new CTextPr();
        if (r.GetBool()) {
            this.rPr.Read_FromBinary(r);
        }
    };
}
function CBullet() {
    this.bulletColor = null;
    this.bulletSize = null;
    this.bulletTypeface = null;
    this.bulletType = null;
    this.Bullet = null;
    this.createDuplicate = function () {
        var duplicate = new CBullet();
        if (this.bulletColor) {
            duplicate.bulletColor = this.bulletColor.createDuplicate();
        }
        if (this.bulletSize) {
            duplicate.bulletSize = this.bulletSize.createDuplicate();
        }
        if (this.bulletTypeface) {
            duplicate.bulletTypeface = this.bulletTypeface.createDuplicate();
        }
        if (this.bulletType) {
            duplicate.bulletType = this.bulletType.createDuplicate();
        }
        duplicate.Bullet = this.Bullet;
        return duplicate;
    };
    this.isBullet = function () {
        return this.bulletType != null && this.bulletType.type != null;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealObject(this.bulletColor));
        if (isRealObject(this.bulletColor)) {
            this.bulletColor.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.bulletSize));
        if (isRealObject(this.bulletSize)) {
            this.bulletSize.Write_ToBinary2(w);
        }
        w.WriteString2("dssdf");
        w.WriteBool(isRealObject(this.bulletTypeface));
        if (isRealObject(this.bulletTypeface)) {
            this.bulletTypeface.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.bulletType));
        if (isRealObject(this.bulletType)) {
            this.bulletType.Write_ToBinary2(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            this.bulletColor = new CBulletColor();
            this.bulletColor.Read_FromBinary2(r);
        }
        if (r.GetBool()) {
            this.bulletSize = new CBulletSize();
            this.bulletSize.Read_FromBinary2(r);
        }
        var s = r.GetString2();
        if (r.GetBool()) {
            this.bulletTypeface = new CBulletTypeface();
            this.bulletTypeface.Read_FromBinary2(r);
        }
        if (r.GetBool()) {
            this.bulletType = new CBulletType();
            this.bulletType.Read_FromBinary2(r);
        }
    };
}
var BULLET_TYPE_COLOR_NONE = 0;
var BULLET_TYPE_COLOR_CLRTX = 1;
var BULLET_TYPE_COLOR_CLR = 2;
function CBulletColor() {
    this.type = BULLET_TYPE_COLOR_NONE;
    this.UniColor = null;
    this.createDuplicate = function () {
        var duplicate = new CBulletColor();
        duplicate.type = this.type;
        if (this.UniColor != null) {
            duplicate.UniColor = this.UniColor.createDuplicate();
        }
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealNumber(this.type));
        if (isRealNumber(this.type)) {
            w.WriteLong(this.type);
        }
        w.WriteBool(isRealObject(this.UniColor));
        if (isRealObject(this.UniColor)) {
            this.UniColor.Write_ToBinary2(w);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            (this.type) = r.GetLong();
        }
        if (r.GetBool()) {
            this.UniColor = new CUniColor();
            this.UniColor.Read_FromBinary2(r);
        }
    };
}
var BULLET_TYPE_SIZE_NONE = 0;
var BULLET_TYPE_SIZE_TX = 1;
var BULLET_TYPE_SIZE_PCT = 2;
var BULLET_TYPE_SIZE_PTS = 3;
function CBulletSize() {
    this.type = BULLET_TYPE_SIZE_NONE;
    this.val = 0;
    this.createDuplicate = function () {
        var d = new CBulletSize();
        d.type = this.type;
        d.val = this.val;
        return d;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealNumber(this.type));
        if (isRealNumber(this.type)) {
            w.WriteLong(this.type);
        }
        w.WriteBool(isRealNumber(this.val));
        if (isRealNumber(this.val)) {
            w.WriteLong(this.val);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            (this.type) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.val) = r.GetLong();
        }
    };
}
var BULLET_TYPE_TYPEFACE_NONE = 0;
var BULLET_TYPE_TYPEFACE_TX = 1;
var BULLET_TYPE_TYPEFACE_BUFONT = 2;
function CBulletTypeface() {
    this.type = BULLET_TYPE_TYPEFACE_NONE;
    this.typeface = "";
    this.createDuplicate = function () {
        var d = new CBulletTypeface();
        d.type = this.type;
        d.typeface = this.typeface;
        return d;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealNumber(this.type));
        if (isRealNumber(this.type)) {
            w.WriteLong(this.type);
        }
        w.WriteBool(typeof this.typeface === "string");
        if (typeof this.typeface === "string") {
            w.WriteString2(this.typeface);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            (this.type) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.typeface) = r.GetString2();
        }
    };
}
var BULLET_TYPE_BULLET_NONE = 0;
var BULLET_TYPE_BULLET_CHAR = 1;
var BULLET_TYPE_BULLET_AUTONUM = 2;
var BULLET_TYPE_BULLET_BLIP = 3;
function CBulletType() {
    this.type = null;
    this.Char = "*";
    this.AutoNumType = 0;
    this.startAt = 1;
    this.createDuplicate = function () {
        var d = new CBulletType();
        d.type = this.type;
        d.Char = this.Char;
        d.AutoNumType = this.AutoNumType;
        d.startAt = this.startAt;
        return d;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(isRealNumber(this.type));
        if (isRealNumber(this.type)) {
            w.WriteLong(this.type);
        }
        w.WriteBool(typeof this.Char === "string");
        if (typeof this.Char === "string") {
            w.WriteString2(this.Char);
        }
        w.WriteBool(isRealNumber(this.AutoNumType));
        if (isRealNumber(this.AutoNumType)) {
            w.WriteLong(this.AutoNumType);
        }
        w.WriteBool(isRealNumber(this.startAt));
        if (isRealNumber(this.startAt)) {
            w.WriteLong(this.startAt);
        }
    };
    this.Read_FromBinary2 = function (r) {
        if (r.GetBool()) {
            (this.type) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.Char) = r.GetString2();
        }
        if (r.GetBool()) {
            (this.AutoNumType) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.startAt) = r.GetLong();
        }
    };
}
function TextListStyle() {
    this.levels = new Array(10);
    for (var i = 0; i < 10; i++) {
        this.levels[i] = null;
    }
    this.createDuplicate = function () {
        var duplicate = new TextListStyle();
        for (var i = 0; i < 10; ++i) {
            if (this.levels[i] != null) {
                duplicate.levels[i] = this.levels[i].createDuplicate();
            }
        }
        return duplicate;
    };
    this.Write_ToBinary2 = function (w) {
        w.WriteBool(MASTER_STYLES);
        for (var i = 0; i < 10; ++i) {
            w.WriteBool(isRealObject(this.levels[i]));
            if (isRealObject(this.levels[i])) {
                this.levels[i].Write_ToBinary2(w);
            }
        }
    };
    this.Read_FromBinary2 = function (r) {
        var b = r.GetBool();
        for (var i = 0; i < 10; ++i) {
            if (r.GetBool()) {
                this.levels[i] = new CTextParagraphPr();
                this.levels[i].Read_FromBinary2(r);
            } else {
                this.levels[i] = null;
            }
        }
    };
}
function CPresParagraph() {
    this.textPr = null;
    this.endRunPr = null;
    this.Content = [];
    this.createDuplicate = function () {
        var duplicate = new CPresParagraph();
        duplicate.textPr = clone(this.textPr);
        duplicate.endRunPr = clone(this.endRunPr);
        duplicate.Content = clone(this.Content);
        return duplicate;
    };
}
function copyParagraph(paragraph, parent) {
    var copy = new Paragraph(paragraph.DrawingDocument, parent, 0, 0, 0, 0, 0);
    if (paragraph.bullet) {
        copy.bullet = paragraph.bullet.createDuplicate();
    }
    copy.Pr = clone(paragraph.Pr);
    copy.rPr = clone(paragraph.rPr);
    for (var i = 0, n = paragraph.Content.length; i < n; ++i) {
        copy.Content[i] = paragraph.Content[i].createDuplicate();
    }
    return copy;
}
var PARRUN_TYPE_NONE = 0;
var PARRUN_TYPE_RUN = 1;
var PARRUN_TYPE_FLD = 2;
var PARRUN_TYPE_BR = 3;
function GenerateDefaultTheme(presentation) {
    var theme = new CTheme();
    theme.presentation = presentation;
    theme.themeElements.fontScheme.majorFont.latin = "Arial";
    theme.themeElements.fontScheme.minorFont.latin = "Arial";
    var _obj = g_oUserColorScheme[0];
    var scheme = theme.themeElements.clrScheme;
    var _c = null;
    _c = _obj["dk1"];
    scheme.colors[8] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["lt1"];
    scheme.colors[12] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["dk2"];
    scheme.colors[9] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["lt2"];
    scheme.colors[13] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent1"];
    scheme.colors[0] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent2"];
    scheme.colors[1] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent3"];
    scheme.colors[2] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent4"];
    scheme.colors[3] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent5"];
    scheme.colors[4] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["accent6"];
    scheme.colors[5] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["hlink"];
    scheme.colors[11] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    _c = _obj["folHlink"];
    scheme.colors[10] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
    return theme;
}
function GenerateDefaultMasterSlide(theme) {
    var master = new MasterSlide(theme.presentation, theme);
    master.Theme = theme;
    master.sldLayoutLst[0] = GenerateDefaultSlideLayout(master);
    return master;
}
function GenerateDefaultSlideLayout(master) {
    var layout = new SlideLayout(master);
    layout.Theme = master.Theme;
    return layout;
}
function GenerateDefaultSlide(layout) {
    var slide = new Slide(layout.Master.presentation, layout, 0);
    slide.Master = layout.Master;
    slide.Theme = layout.Master.Theme;
    return slide;
}
function CreateDefaultTextRectStyle() {
    var style = new CShapeStyle();
    style.lnRef = new StyleRef();
    style.lnRef.idx = 0;
    style.lnRef.Color.color = new CSchemeColor();
    style.lnRef.Color.color.id = g_clr_accent1;
    var mod = new CColorMod();
    mod.name = "shade";
    mod.val = 50000;
    style.lnRef.Color.Mods.Mods.push(mod);
    style.fillRef = new StyleRef();
    style.fillRef.idx = 0;
    style.fillRef.Color.color = new CSchemeColor();
    style.fillRef.Color.color.id = g_clr_accent1;
    style.effectRef = new StyleRef();
    style.effectRef.idx = 0;
    style.effectRef.Color.color = new CSchemeColor();
    style.effectRef.Color.color.id = g_clr_accent1;
    style.fontRef = new FontRef();
    style.fontRef.idx = fntStyleInd_minor;
    style.fontRef.Color = new CUniColor();
    style.fontRef.Color.color = new CSchemeColor();
    style.fontRef.Color.color.id = 8;
    return style;
}