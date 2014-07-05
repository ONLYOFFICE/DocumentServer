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
var TYPE_TRACK_LOCK_SHAPE = 4;
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CColorMod.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_COLOR_MOD;
    },
    Get_Id: function () {
        return this.Id;
    },
    createDuplicate: function () {
        var duplicate = new CColorMod();
        duplicate.name = this.name;
        duplicate.val = this.val;
        return duplicate;
    },
    setName: function (name) {
        var oldValue = this.name;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddRedo, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, name)));
        this.name = name;
    },
    setVal: function (val) {
        var oldValue = this.val;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddUndo, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, val)));
        this.val = val;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_RecalculateAfterParagraphAddRedo:
            this.name = data.oldValue;
            break;
        case historyitem_AutoShapes_RecalculateAfterParagraphAddUndo:
            this.val = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_RecalculateAfterParagraphAddRedo:
            this.name = data.newValue;
            break;
        case historyitem_AutoShapes_RecalculateAfterParagraphAddUndo:
            this.val = data.newValue;
            break;
        }
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
            cur_mod.setName(Reader.GetString2());
            cur_mod.setVal(Reader.GetLong());
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
            duplicate.Mods[i] = {
                name: this.Mods[i].name,
                val: this.Mods[i].val
            };
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
            var R = (255 * (HSL.L / 240)) >> 0;
            if (R < 0) {
                R = 0;
            }
            if (R > 255) {
                R = 255;
            }
            RGB.R = R;
            RGB.G = R;
            RGB.B = R;
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
                        RGBA.B = Math.max(0, parseInt(RGBA.B * val));
                    } else {
                        if (colorMod.name == "blueOff") {
                            RGBA.B = Math.max(0, parseInt(RGBA.B + val * 255));
                        } else {
                            if (colorMod.name == "green") {
                                RGBA.G = Math.min(255, Math.max(0, 255 * val));
                            } else {
                                if (colorMod.name == "greenMod") {
                                    RGBA.G = Math.max(0, parseInt(RGBA.G * val));
                                } else {
                                    if (colorMod.name == "greenOff") {
                                        RGBA.G = Math.max(0, parseInt(RGBA.G + val * 255));
                                    } else {
                                        if (colorMod.name == "red") {
                                            RGBA.R = Math.min(255, Math.max(0, 255 * val));
                                        } else {
                                            if (colorMod.name == "redMod") {
                                                RGBA.R = Math.max(0, parseInt(RGBA.R * val));
                                            } else {
                                                if (colorMod.name == "redOff") {
                                                    RGBA.R = Math.max(0, parseInt(RGBA.R + val * 255));
                                                } else {
                                                    if (colorMod.name == "hueOff") {
                                                        var HSL = {
                                                            H: 0,
                                                            S: 0,
                                                            L: 0
                                                        };
                                                        this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                        var res = parseInt(HSL.H + (val * 10) / 9);
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
                                                                if (val != 1) {
                                                                    var HSL = {
                                                                        H: 0,
                                                                        S: 0,
                                                                        L: 0
                                                                    };
                                                                    this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                    if (HSL.L * val > 240) {
                                                                        HSL.L = 240;
                                                                    } else {
                                                                        HSL.L = Math.max(0, parseInt(HSL.L * val));
                                                                    }
                                                                    this.HSL2RGB(HSL, RGBA);
                                                                }
                                                            } else {
                                                                if (colorMod.name == "lumOff") {
                                                                    if (0 != val) {
                                                                        var HSL = {
                                                                            H: 0,
                                                                            S: 0,
                                                                            L: 0
                                                                        };
                                                                        this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);
                                                                        var res = parseInt(HSL.L + val * 240);
                                                                        while (res > 240) {
                                                                            res = res - 240;
                                                                        }
                                                                        while (res < 0) {
                                                                            res += 240;
                                                                        }
                                                                        HSL.L = res;
                                                                        this.HSL2RGB(HSL, RGBA);
                                                                    }
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
                                                                            HSL.S = Math.max(0, parseInt(HSL.S * val));
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
                                                                            var res = parseInt(HSL.S + val * 240);
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
                                                                                RGBA.R = Math.max(0, parseInt(RGBA.R * val));
                                                                                RGBA.G = Math.max(0, parseInt(RGBA.G * val));
                                                                                RGBA.B = Math.max(0, parseInt(RGBA.B * val));
                                                                            } else {
                                                                                if (colorMod.name == "tint") {
                                                                                    RGBA.R = Math.max(0, parseInt(255 - (255 - RGBA.R) * val));
                                                                                    RGBA.G = Math.max(0, parseInt(255 - (255 - RGBA.G) * val));
                                                                                    RGBA.B = Math.max(0, parseInt(255 - (255 - RGBA.B) * val));
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
    },
    clearMods: function () {
        this.Mods.length = 0;
    },
    copyFromOther: function (o) {
        this.clearMods();
        for (var i = 0; i < o.Mods.length; ++i) {
            this.addMod();
        }
    },
    addMod: function (mod) {
        this.Mods.push(mod);
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CSysColor.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_SYS_COLOR;
    },
    Get_Id: function () {
        return this.Id;
    },
    setColorId: function (id) {
        var oldValue = this.id;
        var newValue = id;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.id = id;
    },
    Copy: function () {
        var ret = new CSchemeColor();
        ret.setColorId(this.id);
        return ret;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteString2(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.setColorId(Reader.GetString2());
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
    },
    copyFromOther: function (p) {
        this.id = p.id;
    },
    setId: function (id) {
        this.id = id;
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CPrstColor.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_PRST_COLOR;
    },
    Get_Id: function () {
        return this.Id;
    },
    setColorId: function (id) {
        var oldValue = this.id;
        var newValue = id;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.id = id;
    },
    Copy: function () {
        var ret = new CSchemeColor();
        ret.setColorId(this.id);
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.id = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.id = data.newValue;
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteString2(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.setColorId(Reader.GetString2());
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
    },
    copyFromOther: function (p) {
        this.id = p.id;
    },
    setId: function (id) {
        this.id = id;
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CRGBColor.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_RGB_COLOR;
    },
    Get_Id: function () {
        return this.Id;
    },
    setColor: function (RGB) {
        var oldValue = ((this.RGBA.R << 16) & 16711680) + ((this.RGBA.G << 8) & 65280) + this.RGBA.B;
        var newValue = RGB;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.RGBA.R = (RGB >> 16) & 255;
        this.RGBA.G = (RGB >> 8) & 255;
        this.RGBA.B = RGB & 255;
    },
    writeToBinaryLong: function (w) {
        w.WriteLong(((this.RGBA.R << 16) & 16711680) + ((this.RGBA.G << 8) & 65280) + this.RGBA.B);
    },
    readFromBinaryLong: function (r) {
        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 255;
        this.RGBA.G = (RGB >> 8) & 255;
        this.RGBA.B = RGB & 255;
    },
    Copy: function () {
        var ret = new CRGBColor();
        ret.setColor(((this.RGBA.R << 16) & 16711680) + ((this.RGBA.G << 8) & 65280) + this.RGBA.B);
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            var RGB = data.oldValue;
            this.RGBA.R = (RGB >> 16) & 255;
            this.RGBA.G = (RGB >> 8) & 255;
            this.RGBA.B = RGB & 255;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            var RGB = data.newValue;
            this.RGBA.R = (RGB >> 16) & 255;
            this.RGBA.G = (RGB >> 8) & 255;
            this.RGBA.B = RGB & 255;
            break;
        }
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
    Calculate: function (obj) {},
    copyFromOther: function (obj) {
        var RGBA = obj.RGBA;
        var rgba = ((RGBA.R << 16) & 16711680) + ((RGBA.G << 8) & 65280) + RGBA.B;
        this.setColor(rgba);
    }
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CSchemeColor.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_SCHEME_COLOR;
    },
    setColorId: function (id) {
        var oldValue = this.id;
        var newValue = id;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.id = id;
    },
    Copy: function () {
        var ret = new CSchemeColor();
        ret.setColorId(this.id);
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.id = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.id = data.newValue;
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        Writer.WriteLong(this.id);
        WriteObjectLong(Writer, this.RGBA);
    },
    Read_FromBinary2: function (Reader) {
        this.setColorId(Reader.GetLong());
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
    Calculate: function (theme, clrMap, RGBA) {
        if (theme.themeElements.clrScheme) {
            if (this.id == phClr) {
                this.RGBA = RGBA;
            } else {
                if (clrMap[this.id] != null && theme.themeElements.clrScheme.colors[clrMap[this.id]] != null) {
                    this.RGBA = theme.themeElements.clrScheme.colors[clrMap[this.id]].color.RGBA;
                } else {
                    if (theme.themeElements.clrScheme.colors[this.id] != null) {
                        this.RGBA = theme.themeElements.clrScheme.colors[this.id].color.RGBA;
                    }
                }
            }
        }
    },
    copyFromOther: function (s) {
        this.setId(s.id);
    },
    setId: function (id) {
        this.id = id;
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CUniColor.prototype = {
    getCSSColor: function (transparent) {
        if (transparent != null) {
            var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + ",1)";
            return _css;
        }
        var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + "," + (this.RGBA.A / 255) + ")";
        return _css;
    },
    addMod: function (mod) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddColorMod, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(mod.Get_Id(), null)));
        this.Mods.Mods.push(mod);
    },
    clearMods: function () {
        this.Mods.clearMods();
    },
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_UNI_COLOR;
    },
    setColor: function (color) {
        var oldValue = isRealObject(this.color) ? this.color.Get_Id() : null;
        var newValue = isRealObject(color) ? color.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.color = color;
    },
    Copy: function () {
        var ret = new CUniColor();
        if (isRealObject(this.color)) {
            ret.setColor(this.color.Copy());
        }
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_AddColorMod:
            for (var i = 0; i < this.Mods.Mods.length; ++i) {
                if (this.Mods.Mods[i].Get_Id() === data.oldValue) {
                    this.Mods.Mods.splice(i, 1);
                    break;
                }
            }
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_AddColorMod:
            this.Mods.Mods.push(g_oTableId.Get_ById(data.oldValue));
            break;
        }
    },
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
                this.setColor(new CSchemeColor());
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_SRGB:
                this.setColor(new CRGBColor());
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_PRST:
                this.setColor(new CPrstColor());
                this.color.Read_FromBinary2(Reader);
                break;
            case COLOR_TYPE_SYS:
                this.setColor(new CSysColor());
                this.color.Read_FromBinary2(Reader);
                break;
            }
        }
        var mods = new CColorModifiers();
        mods.Read_FromBinary2(Reader);
        for (var i = 0; i < mods.Mods.length; ++i) {
            this.addMod(mods.Mods[i]);
        }
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
    Calculate: function (theme, clrMap, RGBA) {
        if (this.color == null) {
            return this.RGBA;
        }
        this.color.Calculate(theme, clrMap, RGBA);
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
    copyFromOther: function (u) {
        if (isRealObject(u.color)) {
            if (!isRealObject(this.color) || this.color.type !== u.color.type) {
                switch (u.color.type) {
                case COLOR_TYPE_SCHEME:
                    this.setColor(new CSchemeColor());
                    break;
                case COLOR_TYPE_SRGB:
                    this.setColor(new CRGBColor());
                    break;
                case COLOR_TYPE_PRST:
                    this.setColor(new CPrstColor());
                    break;
                case COLOR_TYPE_SYS:
                    this.setColor(new CSysColor());
                    break;
                }
            }
            if (this.color && this.color.copyFromOther) {
                this.color.copyFromOther(u.color);
            }
        }
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
    },
    createBinary: function () {
        var w = new CMemory();
        w.WriteBool(isRealNumber(this.l));
        if (isRealNumber(this.l)) {
            w.WriteDoube(this.l);
        }
        w.WriteBool(isRealNumber(this.t));
        if (isRealNumber(this.t)) {
            w.WriteDoube(this.t);
        }
        w.WriteBool(isRealNumber(this.r));
        if (isRealNumber(this.r)) {
            w.WriteDoube(this.r);
        }
        w.WriteBool(isRealNumber(this.b));
        if (isRealNumber(this.b)) {
            w.WriteDoube(this.b);
        }
        return w.pos + ";" + w.GetBase64Memory();
    },
    setFromBinary: function (bin) {
        var r = CreateBinaryReader(bin, 0, bin.length);
        if (r.GetBool()) {
            this.l = r.GetDouble();
        } else {
            this.l = null;
        }
        if (r.GetBool()) {
            this.t = r.GetDouble();
        } else {
            this.t = null;
        }
        if (r.GetBool()) {
            this.r = r.GetDouble();
        } else {
            this.r = null;
        }
        if (r.GetBool()) {
            this.b = r.GetDouble();
        } else {
            this.b = null;
        }
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CBlipFill.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_BLIP_FILL;
    },
    setRasterImageId: function (rasterImageId) {
        var oldValue = this.RasterImageId;
        var newValue = rasterImageId;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.RasterImageId = rasterImageId;
    },
    setSrcRect: function (srcRect) {
        var oldValue = isRealObject(this.srcRect) ? this.srcRect.createBinary() : null;
        var newValue = isRealObject(srcRect) ? srcRect.createBinary() : null;
        this.srcRect = srcRect;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddYAxis, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    setTile: function (tile) {
        var oldValue = this.tile;
        var newValue = tile;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddChartGroup, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.tile = tile;
    },
    Copy: function () {
        var ret = new CBlipFill();
        ret.setRasterImageId(this.RasterImageId);
        ret.setTile(this.tile);
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.RasterImageId = data.oldValue;
            break;
        case historyitem_AutoShapes_AddChartGroup:
            this.tile = data.oldValue;
            break;
        case historyitem_AutoShapes_AddYAxis:
            if (typeof data.oldValue === "string") {
                this.srcRect = new CSrcRect();
                this.srcRect.setFromBinary(data.oldValue);
            } else {
                this.srcRect = null;
            }
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.RasterImageId = data.newValue;
            break;
        case historyitem_AutoShapes_AddChartGroup:
            this.tile = data.newValue;
            break;
        case historyitem_AutoShapes_AddYAxis:
            if (typeof data.oldValue === "string") {
                this.srcRect = new CSrcRect();
                this.srcRect.setFromBinary(data.newValue);
            } else {
                this.srcRect = null;
            }
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        var flag = typeof this.RasterImageId === "string";
        Writer.WriteBool(flag);
        if (flag) {
            var string_to_write = getFullImageSrc(this.RasterImageId);
            if (string_to_write.indexOf(window["Asc"]["editor"].documentOrigin) !== 0 && (0 != string_to_write.indexOf("http:") && 0 != string_to_write.indexOf("data:") && 0 != string_to_write.indexOf("https:") && 0 != string_to_write.indexOf("ftp:") && 0 != string_to_write.indexOf("file:"))) {
                string_to_write = window["Asc"]["editor"].documentOrigin + string_to_write;
            }
            Writer.WriteString2(string_to_write);
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
        var w = Writer;
        var bool = isRealObject(this.srcRect) && isRealNumber(this.srcRect.l) && isRealNumber(this.srcRect.t) && isRealNumber(this.srcRect.r) && isRealNumber(this.srcRect.b);
        w.WriteBool(bool);
        if (bool) {
            w.WriteDouble(this.srcRect.l);
            w.WriteDouble(this.srcRect.t);
            w.WriteDouble(this.srcRect.r);
            w.WriteDouble(this.srcRect.b);
        }
    },
    Read_FromBinary2: function (Reader) {
        var flag = Reader.GetBool();
        if (flag) {
            var imageId = Reader.GetString2();
            if (typeof imageId === "string" && isRealObject(Reader.oImages) && typeof Reader.oImages[imageId] === "string" && Reader.oImages[imageId] !== "error") {
                this.setRasterImageId(Reader.oImages[imageId]);
            } else {
                this.setRasterImageId(imageId);
            }
        }
        flag = Reader.GetBool();
        if (flag) {
            this.stretch = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.setTile(Reader.GetBool());
        } else {
            this.setTile(null);
        }
        this.rotWithShape = Reader.GetBool();
        if (Reader.GetBool()) {
            var srcRect = new CSrcRect();
            srcRect.l = Reader.GetDouble();
            srcRect.t = Reader.GetDouble();
            srcRect.r = Reader.GetDouble();
            srcRect.b = Reader.GetDouble();
            this.setSrcRect(srcRect);
        } else {
            this.setSrcRect(null);
        }
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
    this.color = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CSolidFill.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_SOLID_FILL;
    },
    setColor: function (unicolor) {
        var oldValue = isRealObject(this.color) ? this.color.Get_Id() : null;
        var newValue = isRealObject(unicolor) ? unicolor.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.color = unicolor;
    },
    Copy: function () {
        var ret = new CSolidFill();
        if (isRealObject(this.color)) {
            ret.setColor(this.color.Copy());
        }
        return ret;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.oldValue);
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.newValue);
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(this.type);
        if (typeof this.color === "object" && this.color !== null) {
            this.color.Write_ToBinary2(Writer);
        }
    },
    Read_FromBinary2: function (Reader) {
        this.setColor(new CUniColor());
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CGs.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_GS;
    },
    setColor: function (unicolor) {
        var oldValue = isRealObject(this.color) ? this.color.Get_Id() : null;
        var newValue = isRealObject(unicolor) ? unicolor.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.color = unicolor;
    },
    setPos: function (pos) {
        var oldValue = this.pos;
        var newValue = pos;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.pos = pos;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.pos = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.color = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.pos = data.newValue;
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        this.color.Write_ToBinary2(Writer);
        Writer.WriteLong(this.pos);
    },
    Read_FromBinary2: function (Reader) {
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
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
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_GRAD_LIN;
    },
    setAngle: function (angle) {
        var oldValue = this.angle;
        var newValue = angle;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.angle = angle;
    },
    setScale: function (scale) {
        var oldValue = this.scale;
        var newValue = scale;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.scale = scale;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.angle = data.oldValue;
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.scale = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.angle = data.newValue;
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.scale = data.newValue;
            break;
        }
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
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
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_GRAD_FILL;
    },
    addGS: function (gs) {
        var oldValue = isRealObject(gs) ? gs.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, null)));
        this.colors.push(gs);
    },
    setLin: function (lin) {
        var oldValue = isRealObject(this.lin) ? this.lin.Get_Id() : null;
        var newValue = isRealObject(lin) ? lin.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.lin = lin;
    },
    setPath: function (path) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetGroup, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(isRealObject(this.path), isRealObject(path))));
        this.path = path;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.colors.length = this.colors.length - 1;
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.lin = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetGroup:
            if (data.oldValue) {
                this.path = new GradPath();
            } else {
                this.path = null;
            }
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.colors.push(g_oTableId.Get_ById(data.oldValue));
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.lin = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetGroup:
            if (data.newValue) {
                this.path = new GradPath();
            } else {
                this.path = null;
            }
            break;
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
    this.ftype = "";
    this.fgClr = null;
    this.bgClr = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CPattFill.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_PATTERN_FILL;
    },
    Copy: function () {
        var ret = new CPattFill();
        ret.setFType(this.ftype);
        if (isRealObject(this.fgClr)) {
            this.setFgColor(this.fgClr.Copy());
        }
        if (isRealObject(this.bgClr)) {
            this.setFgColor(this.bgClr.Copy());
        }
        return ret;
    },
    setFType: function (fType) {
        var oldValue = this.ftype;
        var newValue = fType;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.ftype = fType;
    },
    setFgColor: function (unicolor) {
        var oldValue = isRealObject(this.fgClr) ? this.fgClr.Get_Id() : null;
        var newValue = isRealObject(unicolor) ? unicolor.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFgColor, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.fgClr = unicolor;
    },
    setBgColor: function (unicolor) {
        var oldValue = isRealObject(this.bgClr) ? this.bgClr.Get_Id() : null;
        var newValue = isRealObject(unicolor) ? unicolor.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetBgColor, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.bgClr = unicolor;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.ftype = data.oldValue;
            break;
        case historyitem_AutoShapes_SetFgColor:
            this.fgClr = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetBgColor:
            this.bgClr = g_oTableId.Get_ById(data.oldValue);
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFType:
            this.ftype = data.newValue;
            break;
        case historyitem_AutoShapes_SetFgColor:
            this.fgClr = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetBgColor:
            this.bgClr = g_oTableId.Get_ById(data.newValue);
            break;
        }
    },
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CNoFill.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_NO_FILL;
    },
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
    Copy: function () {
        return new CNoFill();
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CUniFill.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_UNI_FILL;
    },
    setFill: function (fill) {
        var oldValue = isRealObject(this.fill) ? this.fill.Get_Id() : null;
        var newValue = isRealObject(fill) ? fill.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFill, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.fill = fill;
    },
    setTransparent: function (value) {
        var oldValue = this.transparent;
        var newValue = value;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetTransparent, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.transparent = value;
    },
    Get_Id: function () {
        return this.Id;
    },
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
                this.setFill(new CSolidFill());
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_GRAD:
                this.setFill(new CGradFill());
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_BLIP:
                this.setFill(new CBlipFill());
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_NOFILL:
                this.setFill(new CNoFill());
                this.fill.Read_FromBinary2(reader);
                break;
            case FILL_TYPE_PATT:
                this.setFill(new CPattFill());
                this.fill.Read_FromBinary2(reader);
                break;
            }
        }
        flag = reader.GetBool();
        if (flag) {
            this.setTransparent(reader.GetDouble());
        }
    },
    calculate: function (theme, clrMap, RGBA) {
        if (this.fill) {
            if (this.fill.color) {
                this.fill.color.Calculate(theme, clrMap, RGBA);
            }
            if (this.fill.colors) {
                for (var i = 0; i < this.fill.colors.length; ++i) {
                    this.fill.colors[i].color.Calculate(theme, clrMap, RGBA);
                }
            }
            if (this.fill.fgClr) {
                this.fill.fgClr.Calculate(theme, clrMap, RGBA);
            }
            if (this.fill.bgClr) {
                this.fill.bgClr.Calculate(theme, clrMap, RGBA);
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
    Copy: function () {
        var ret = new CUniFill();
        if (isRealObject(this.fill) && typeof this.fill.Copy === "function") {
            ret.setFill(this.fill.Copy());
        }
        ret.setTransparent(this.transparent);
        return ret;
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
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFill:
            this.fill = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetTransparent:
            this.transparent = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFill:
            this.fill = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetTransparent:
            this.transparent = data.newValue;
            break;
        }
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
    var _result_shape_prop = new asc_CShapeProperty();
    if (shapeProp1.type === shapeProp2.type) {
        _result_shape_prop.type = shapeProp1.type;
    } else {
        _result_shape_prop.type = null;
    }
    if (shapeProp1.stroke === null || shapeProp2.stroke === null) {
        _result_shape_prop.stroke = null;
    } else {
        _result_shape_prop.stroke = shapeProp1.stroke.compare(shapeProp2.stroke);
    }
    if (shapeProp1.canChangeArrows !== true || shapeProp2.canChangeArrows !== true) {
        _result_shape_prop.canChangeArrows = false;
    } else {
        _result_shape_prop.canChangeArrows = true;
    }
    _result_shape_prop.fill = CompareUniFill(shapeProp1.fill, shapeProp2.fill);
    _result_shape_prop.IsLocked = shapeProp1.IsLocked === true || shapeProp2.IsLocked === true;
    if (isRealObject(shapeProp1.paddings) && isRealObject(shapeProp2.paddings)) {
        _result_shape_prop.paddings = new asc_CPaddings();
        _result_shape_prop.paddings.Left = isRealNumber(shapeProp1.paddings.Left) ? (shapeProp1.paddings.Left === shapeProp2.paddings.Left ? shapeProp1.paddings.Left : undefined) : undefined;
        _result_shape_prop.paddings.Top = isRealNumber(shapeProp1.paddings.Top) ? (shapeProp1.paddings.Top === shapeProp2.paddings.Top ? shapeProp1.paddings.Top : undefined) : undefined;
        _result_shape_prop.paddings.Right = isRealNumber(shapeProp1.paddings.Right) ? (shapeProp1.paddings.Right === shapeProp2.paddings.Right ? shapeProp1.paddings.Right : undefined) : undefined;
        _result_shape_prop.paddings.Bottom = isRealNumber(shapeProp1.paddings.Bottom) ? (shapeProp1.paddings.Bottom === shapeProp2.paddings.Bottom ? shapeProp1.paddings.Bottom : undefined) : undefined;
    }
    _result_shape_prop.canFill = shapeProp1.canFill === true || shapeProp2.canFill === true;
    return _result_shape_prop;
}
function CompareImageProperties(imgProps1, imgProps2) {
    var _result_image_properties = new asc_CImgProperty();
    if (imgProps1.Width == null || imgProps2.Width == null) {
        _result_image_properties.Width = null;
    } else {
        _result_image_properties.Width = (imgProps1.Width === imgProps2.Width) ? imgProps1.Width : null;
    }
    if (imgProps1.Height == null || imgProps2.Height == null) {
        _result_image_properties.Height = null;
    } else {
        _result_image_properties.Height = (imgProps1.Height === imgProps2.Height) ? imgProps1.Height : null;
    }
    _result_image_properties.Paddings = ComparePaddings(imgProps1.Paddings, imgProps2.Paddings);
    _result_image_properties.Position = CompareImgPosition(imgProps1.Position, imgProps2.Position);
    if (! (typeof imgProps1.ImageUrl === "string") || !(typeof imgProps2.ImageUrl === "string") || imgProps1.ImageUrl !== imgProps2.ImageUrl) {
        _result_image_properties.ImageUrl = null;
    } else {
        _result_image_properties = imgProps1.ImageUrl;
    }
    return _result_image_properties;
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
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CLn.prototype = {
    setFill: function (unifill) {
        var oldValue = isRealObject(this.Fill) ? this.Fill.Get_Id() : null;
        var newValue = isRealObject(unifill) ? unifill.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetFill, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.Fill = unifill;
    },
    setW: function (w) {
        var oldValue = this.w;
        var newValue = w;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetLineWidth, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.w = w;
    },
    setTailEnd: function (end) {
        var old_value = null;
        if (this.tailEnd) {
            var w = new CMemory();
            this.tailEnd.Write_ToBinary2(w);
            old_value = w.pos + ";" + w.GetBase64Memory();
        }
        var new_value = null;
        if (end) {
            var w = new CMemory();
            end.Write_ToBinary2(w);
            new_value = w.pos + ";" + w.GetBase64Memory();
        }
        this.tailEnd = end;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetTailEnd, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(old_value, new_value)));
    },
    setHeadEnd: function (end) {
        var old_value = null;
        if (this.headEnd) {
            var w = new CMemory();
            this.headEnd.Write_ToBinary2(w);
            old_value = w.pos + ";" + w.GetBase64Memory();
        }
        var new_value = null;
        if (end) {
            var w = new CMemory();
            end.Write_ToBinary2(w);
            new_value = w.pos + ";" + w.GetBase64Memory();
        }
        this.headEnd = end;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetTailEnd, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(old_value, new_value)));
    },
    getObjectType: function () {
        return CLASS_TYPE_LINE;
    },
    Get_Id: function () {
        return this.Id;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFill:
            this.Fill = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetLineWidth:
            this.w = data.oldValue;
            break;
        case historyitem_AutoShapes_SetTailEnd:
            if (typeof data.oldValue === "string") {
                this.tailEnd = new EndArrow();
                var r = CreateBinaryReader(data.oldValue, 0, data.oldValue.length);
                this.tailEnd.Read_FromBinary2(r);
            } else {
                this.tailEnd = null;
            }
            break;
        case historyitem_AutoShapes_SetHeadEnd:
            if (typeof data.oldValue === "string") {
                this.headEnd = new EndArrow();
                var r = CreateBinaryReader(data.oldValue, 0, data.oldValue.length);
                this.headEnd.Read_FromBinary2(r);
            } else {
                this.headEnd = null;
            }
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetFill:
            this.Fill = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetLineWidth:
            this.w = data.newValue;
            break;
        case historyitem_AutoShapes_SetTailEnd:
            if (typeof data.newValue === "string") {
                this.tailEnd = new EndArrow();
                var r = CreateBinaryReader(data.newValue, 0, data.newValue.length);
                this.tailEnd.Read_FromBinary2(r);
            } else {
                this.tailEnd = null;
            }
            break;
        case historyitem_AutoShapes_SetHeadEnd:
            if (typeof data.newValue === "string") {
                this.headEnd = new EndArrow();
                var r = CreateBinaryReader(data.newValue, 0, data.newValue.length);
                this.headEnd.Read_FromBinary2(r);
            } else {
                this.headEnd = null;
            }
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
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
    },
    Read_FromBinary2: function (Reader) {
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
    },
    compare: function (line) {
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
    },
    merge: function (ln) {
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
    },
    calculate: function (theme) {},
    createDuplicate: function () {
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
    },
    IsIdentical: function (ln) {
        return ln && (this.Fill == null ? ln.Fill == null : this.Fill.IsIdentical(ln.Fill)) && this.Join == ln.Join && (this.headEnd == null ? ln.headEnd == null : this.headEnd.IsIdentical(ln.headEnd)) && (this.tailEnd == null ? ln.tailEnd == null : this.tailEnd.IsIdentical(ln.headEnd)) && this.algn == ln.algn && this.cap == ln.cap && this.cmpd == ln.cmpd && this.w == ln.w;
    }
};
function DefaultShapeDefinition() {
    this.spPr = new CSpPr();
    this.bodyPr = new CBodyPr();
    this.lstStyle = new CTextStyle();
    this.style = null;
}
function CNvPr() {
    this.id = 0;
    this.name = "";
    this.createDuplicate = function () {
        var duplicate = new CNvPr();
        duplicate.id = this.id;
        duplicate.name = this.name;
        return duplicate;
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
}
function StyleRef() {
    this.idx = 0;
    this.Color = new CUniColor();
    this.createDuplicate = function () {
        var duplicate = new StyleRef();
        duplicate.idx = this.idx;
        duplicate.Color = this.Color.createDuplicate();
        return duplicate;
    };
    this.Write_ToBinary2 = function (Writer) {
        Writer.WriteLong(this.idx);
        this.Color.Write_ToBinary2(Writer);
    };
    this.Read_FromBinary2 = function (Reader) {
        this.idx = Reader.GetLong();
        this.Color.Read_FromBinary2(Reader);
    };
    this.copyFromOther = function (s) {
        this.setIdx(s.idx);
        this.Color.copyFromOther(s.Color);
    };
    this.setIdx = function (idx) {
        this.idx = idx;
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
    this.copyFromOther = function (r) {
        this.setIdx(r.idx);
        if (isRealObject(r.Color)) {
            if (!isRealObject(this.Color)) {
                this.setColor(new CUniColor());
            }
            this.Color.copyFromOther(r.Color);
        }
    };
    this.setIdx = function (idx) {
        this.idx = idx;
    };
    this.setColor = function (color) {
        this.Color = color;
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
    this.copyFromOther = function (s) {
        if (isRealObject(s.lnRef)) {
            if (!isRealObject(this.lnRef)) {
                this.setLnRef(new StyleRef());
            }
            this.lnRef.copyFromOther(s.lnRef);
        }
        if (isRealObject(s.fillRef)) {
            if (!isRealObject(this.fillRef)) {
                this.setFillRef(new StyleRef());
            }
            this.fillRef.copyFromOther(s.fillRef);
        }
        if (isRealObject(s.effectRef)) {
            if (!isRealObject(this.effectRef)) {
                this.setEffectRef(new StyleRef());
            }
            this.effectRef.copyFromOther(s.effectRef);
        }
        if (isRealObject(s.fontRef)) {
            if (!isRealObject(this.fontRef)) {
                this.setFontRef(new FontRef());
            }
            this.fontRef.copyFromOther(s.fontRef);
        }
    };
    this.setLnRef = function (lnRef) {
        this.lnRef = lnRef;
    };
    this.setFillRef = function (fillRef) {
        this.fillRef = fillRef;
    };
    this.setEffectRef = function (effectRef) {
        this.effectRef = effectRef;
    };
    this.setFontRef = function (fontRef) {
        this.fontRef = fontRef;
    };
}
function CreateDefaultShapeStyle() {
    var style = new CShapeStyle();
    style.lnRef = new StyleRef();
    style.lnRef.idx = 2;
    style.lnRef.Color.color = new CSchemeColor();
    style.lnRef.Color.color.id = g_clr_accent1;
    style.lnRef.Color.Mods.Mods.push({
        name: "shade",
        val: 50000
    });
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
function CreateDefaultTextRectStyle() {
    var style = new CShapeStyle();
    style.lnRef = new StyleRef();
    style.lnRef.idx = 0;
    style.lnRef.Color.color = new CSchemeColor();
    style.lnRef.Color.color.id = g_clr_accent1;
    style.lnRef.Color.Mods.Mods.push({
        name: "shade",
        val: 50000
    });
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
    this.isNotNull = function () {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.extX) && isRealNumber(this.extY);
    };
    this.isNotNullForGroup = function () {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.chOffX) && isRealNumber(this.chOffY) && isRealNumber(this.extX) && isRealNumber(this.extY) && isRealNumber(this.chExtX) && isRealNumber(this.chExtY);
    };
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
    this.setPosition = function (posX, posY, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Offset, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(this.offX, this.offY, posX, posY)));
        this.offX = posX;
        this.offY = posY;
    };
    this.setExtents = function (extX, extY, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Extents, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(this.extX, this.extY, extX, extY)));
        this.extX = extX;
        this.extY = extY;
    };
    this.setChildOffsets = function (chOffX, chOffY, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Child_Offset, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(this.chOffX, this.chOffY, chOffX, chOffY)));
        this.chOffX = chOffX;
        this.chOffY = chOffY;
    };
    this.setChildExtents = function (chExtX, chExtY, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Child_Extents, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(this.chExtX, this.chExtY, chExtX, chExtY)));
        this.chExtX = chExtX;
        this.chExtY = chExtY;
    };
    this.setFlips = function (flipH, flipV, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Flips, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(this.flipH, this.flipV, flipH, flipV)));
        this.flipH = flipH;
        this.flipV = flipV;
    };
    this.setRotate = function (rot, model_id) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Rotate, model_id, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.rot, rot)));
        this.rot = rot;
    };
    this.copyFromOther = function (xfrm) {
        this.setPosition(xfrm.offX, xfrm.offY);
        this.setExtents(xfrm.extX, xfrm.extY);
        this.setChildOffsets(xfrm.chOffX, xfrm.chOffY);
        this.setChildExtents(xfrm.chExtX, xfrm.chExtY);
        this.setFlips(xfrm.flipH, xfrm.flipV);
        this.setRotate(xfrm.rot);
    };
    this.Get_Id = function () {
        return this.Id;
    };
    this.Undo = function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_Offset:
            this.offX = data.oldValue1;
            this.offY = data.oldValue2;
            break;
        case historyitem_AutoShapes_Extents:
            this.extX = data.oldValue1;
            this.extY = data.oldValue2;
            break;
        case historyitem_AutoShapes_Child_Offset:
            this.chOffX = data.oldValue1;
            this.chOffY = data.oldValue2;
            break;
        case historyitem_AutoShapes_Child_Extents:
            this.chExtX = data.oldValue1;
            this.chExtY = data.oldValue2;
            break;
        case historyitem_AutoShapes_Flips:
            this.flipH = data.oldValue1;
            this.flipV = data.oldValue2;
            break;
        case historyitem_AutoShapes_Rotate:
            this.rot = data.oldValue;
            break;
        }
    };
    this.Redo = function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_Offset:
            this.offX = data.newValue1;
            this.offY = data.newValue2;
            break;
        case historyitem_AutoShapes_Extents:
            this.extX = data.newValue1;
            this.extY = data.newValue2;
            break;
        case historyitem_AutoShapes_Child_Offset:
            this.chOffX = data.newValue1;
            this.chOffY = data.newValue2;
            break;
        case historyitem_AutoShapes_Child_Extents:
            this.chExtX = data.newValue1;
            this.chExtY = data.newValue2;
            break;
        case historyitem_AutoShapes_Flips:
            this.flipH = data.newValue1;
            this.flipV = data.newValue2;
            break;
        case historyitem_AutoShapes_Rotate:
            this.rot = data.newValue;
            break;
        }
    };
    this.getObjectType = function () {
        return CLASS_TYPE_XFRM;
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
function CSpPr() {
    this.bwMode = 0;
    this.xfrm = null;
    this.geometry = null;
    this.Fill = null;
    this.ln = null;
    this.merge = function (spPr) {
        if (spPr.geometry != null) {
            this.geometry = spPr.geometry.createDuplicate();
        }
        if (spPr.Fill != null && spPr.Fill.fill != null) {}
    };
    this.createDuplicate = function () {
        var duplicate = new CSpPr();
        duplicate.bwMode = this.bwMode;
        duplicate.xfrm = this.xfrm.createDuplicate();
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
            if (!this.xfrm) {
                this.xfrm = new CXfrm();
            }
            this.xfrm.Read_FromBinary2(Reader);
        }
        var flag = Reader.GetBool();
        if (flag) {
            this.geometry = new CGeometry();
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
    this.readFromBinaryForCopyPaste = function (r) {};
    this.copyFromOther = function (spPr) {
        this.setBwMode(spPr.bwMode);
        this.xfrm.copyFromOther(spPr.xfrm);
        if (isRealObject(spPr.geometry)) {
            if (!isRealObject(this.geometry)) {
                this.setGeometry(new Geometry());
            }
            this.geometry.copyFromOther(spPr.geometry);
        }
        if (isRealObject(spPr.Fill)) {
            if (!isRealObject(this.Fill)) {
                this.setFill(new CUniFill());
            }
            this.Fill.copyFromOther(spPr.Fill);
        }
        if (isRealObject(spPr.ln)) {
            if (!isRealObject(this.ln)) {
                this.setFill(new CLn());
            }
            this.ln.copyFromOther(spPr.ln);
        }
    };
    this.setBwMode = function (bwMode) {
        this.bwMode = bwMode;
    };
    this.setGeometry = function (geometry) {
        this.geometry = geometry;
    };
    this.setFill = function (fill) {
        this.Fill = fill;
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
    for (var i = g_clr_MIN; i <= g_clr_MAX; i++) {
        this.color_map[i] = null;
    }
    this.createDuplicate = function () {
        var _copy = new ClrMap();
        for (var _color_index = g_clr_MIN; _color_index <= this.color_map.length; ++_color_index) {
            _copy.color_map[_color_index] = this.color_map[_color_index];
        }
        return _copy;
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
}
function FontScheme() {
    this.name = "";
    this.majorFont = new FontCollection();
    this.minorFont = new FontCollection();
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
        this.themeElements.clrScheme = clrScheme;
    };
    this.setFontScheme = function (fontScheme) {
        this.themeElements.fontScheme = fontScheme;
    };
    this.setFormatScheme = function (fmtScheme) {
        this.themeElements.fmtScheme = fmtScheme;
    };
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
            _copy.spTree[_glyph_index] = this.spTree[_glyph_index].createFullCopy(parent, elementsManipulator);
            _copy.spTree[_glyph_index].Recalculate();
            _copy.spTree[_glyph_index].updateCursorTypes();
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
}
function MasterSlide(presentation, theme) {
    this.cSld = new CSld();
    this.clrMap = new ClrMap();
    this.hf = new HF();
    this.sldLayoutLst = [];
    this.txStyles = new CTextStyles();
    this.preserve = false;
    this.ImageBase64 = "";
    this.ThemeIndex = 0;
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;
    this.DrawingDocument = presentation.DrawingDocument;
    this.draw = function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].Draw(graphics);
            }
        }
    };
    this.calculateColors = function () {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes_count; ++_shape_index) {
            if (_shapes[_shape_index].calculateColors) {
                _shapes[_shape_index].calculateColors();
            }
        }
    };
    this.getMatchingLayout = function (type, matchingName, cSldName, themeFlag) {
        var layoutType = type;
        var _layoutName = null,
        _layout_index, _layout;
        if (type === nSldLtTTitle && !(themeFlag === true)) {
            layoutType = nSldLtTObj;
        }
        if (layoutType != null) {
            for (var i = 0; i < this.sldLayoutLst.length; ++i) {
                if (this.sldLayoutLst[i].type == layoutType) {
                    return this.sldLayoutLst[i];
                }
            }
        }
        if (type === nSldLtTTitle && !(themeFlag === true)) {
            layoutType = nSldLtTTx;
            for (i = 0; i < this.sldLayoutLst.length; ++i) {
                if (this.sldLayoutLst[i].type == layoutType) {
                    return this.sldLayoutLst[i];
                }
            }
        }
        if (matchingName != "" && matchingName != null) {
            _layoutName = matchingName;
        } else {
            if (cSldName != "" && cSldName != null) {
                _layoutName = cSldName;
            }
        }
        if (_layoutName != null) {
            var _layout_name;
            for (_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index) {
                _layout = this.sldLayoutLst[_layout_index];
                _layout_name = null;
                if (_layout.matchingName != null && _layout.matchingName != "") {
                    _layout_name = _layout.matchingName;
                } else {
                    if (_layout.cSld.name != null && _layout.cSld.name != "") {
                        _layout_name = _layout.cSld.name;
                    }
                }
                if (_layout_name == _layoutName) {
                    return _layout;
                }
            }
        }
        for (_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index) {
            _layout = this.sldLayoutLst[_layout_index];
            _layout_name = null;
            if (_layout.type != nSldLtTTitle) {
                return _layout;
            }
        }
        return this.sldLayoutLst[0];
    };
    this.Calculate = function () {
        var titleStyles = this.txStyles.titleStyle;
    };
    this.presentation = presentation;
    this.theme = theme;
    this.kind = MASTER_KIND;
    this.getMatchingShape = function (type, idx) {
        var _input_reduced_type;
        if (type == null) {
            _input_reduced_type = phType_body;
        } else {
            if (type == phType_ctrTitle) {
                _input_reduced_type = phType_title;
            } else {
                _input_reduced_type = type;
            }
        }
        var _input_reduced_index;
        if (idx == null) {
            _input_reduced_index = 0;
        } else {
            _input_reduced_index = idx;
        }
        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
            _glyph = _sp_tree[_shape_index];
            if (_glyph.isPlaceholder()) {
                if (_glyph instanceof CShape) {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if (_glyph instanceof CImage2) {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if (_glyph instanceof GroupShape) {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if (_type == null) {
                    _final_type = phType_body;
                } else {
                    if (_type == phType_ctrTitle) {
                        _final_type = phType_title;
                    } else {
                        _final_type = _type;
                    }
                }
                if (_index == null) {
                    _final_index = 0;
                } else {
                    _final_index = _index;
                }
                if (_input_reduced_type == _final_type && _input_reduced_index == _final_index) {
                    return _glyph;
                }
            }
        }
        if (_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr) {
            for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
                _glyph = _sp_tree[_shape_index];
                if (_glyph.isPlaceholder()) {
                    if (_glyph instanceof CShape) {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof CImage2) {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof GroupShape) {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }
                    if (_input_reduced_type == _type) {
                        return _glyph;
                    }
                }
            }
        }
        return null;
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
function SlideLayout(slideMaster) {
    this.cSld = new CSld();
    this.clrMap = null;
    this.hf = new HF();
    this.matchingName = "";
    this.preserve = false;
    this.showMasterPhAnim = false;
    this.type = null;
    this.userDrawn = true;
    this.ImageBase64 = "";
    this.Master = slideMaster;
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;
    this.kind = LAYOUT_KIND;
    this.Calculate = function () {};
    this.calculateColors = function () {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes_count; ++_shape_index) {
            if (_shapes[_shape_index].calculateColors) {
                _shapes[_shape_index].calculateColors();
            }
        }
    };
    this.draw = function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].Draw(graphics);
            }
        }
    };
    this.getMatchingShape = function (type, idx) {
        var _input_reduced_type;
        if (type == null) {
            _input_reduced_type = phType_body;
        } else {
            if (type == phType_ctrTitle) {
                _input_reduced_type = phType_title;
            } else {
                _input_reduced_type = type;
            }
        }
        var _input_reduced_index;
        if (idx == null) {
            _input_reduced_index = 0;
        } else {
            _input_reduced_index = idx;
        }
        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
            _glyph = _sp_tree[_shape_index];
            if (_glyph.isPlaceholder()) {
                if (_glyph instanceof CShape) {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if (_glyph instanceof CImage2) {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if (_glyph instanceof GroupShape) {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if (_type == null) {
                    _final_type = phType_body;
                } else {
                    if (_type == phType_ctrTitle) {
                        _final_type = phType_title;
                    } else {
                        _final_type = _type;
                    }
                }
                if (_index == null) {
                    _final_index = 0;
                } else {
                    _final_index = _index;
                }
                if (_input_reduced_type == _final_type && _input_reduced_index == _final_index) {
                    return _glyph;
                }
            }
        }
        if (_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr) {
            for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
                _glyph = _sp_tree[_shape_index];
                if (_glyph.isPlaceholder()) {
                    if (_glyph instanceof CShape) {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof CImage2) {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof GroupShape) {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }
                    if (_input_reduced_type == _type) {
                        return _glyph;
                    }
                }
            }
        }
        for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
            _glyph = _sp_tree[_shape_index];
            if (_glyph.isPlaceholder()) {
                if (_glyph instanceof CShape) {
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if (_glyph instanceof CImage2) {
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if (_glyph instanceof GroupShape) {
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if (_type == null) {
                    _final_type = phType_body;
                } else {
                    if (_type == phType_ctrTitle) {
                        _final_type = phType_title;
                    } else {
                        _final_type = _type;
                    }
                }
                if (this.type === nSldLtTTitle && (_input_reduced_type === phType_body || _input_reduced_type === phType_subTitle) && (_final_type === phType_body || _final_type === phType_subTitle)) {
                    return _glyph;
                }
            }
        }
        return null;
    };
    this.calculateType = function () {
        if (this.type !== null) {
            this.calculatedType = this.type;
            return;
        }
        var _ph_types_array = [];
        var _matchedLayoutTypes = [];
        for (var _ph_type_index = 0; _ph_type_index < 16; ++_ph_type_index) {
            _ph_types_array[_ph_type_index] = 0;
        }
        for (var _layout_type_index = 0; _layout_type_index < 36; ++_layout_type_index) {
            _matchedLayoutTypes[_layout_type_index] = false;
        }
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            _shape = _shapes[_shape_index];
            if (_shape.isPlaceholder()) {
                var _cur_type = _shape.getPhType();
                if (! (typeof(_cur_type) == "number")) {
                    _cur_type = phType_body;
                }
                if (typeof _ph_types_array[_cur_type] == "number") {
                    ++_ph_types_array[_cur_type];
                }
            }
        }
        var _weight = Math.pow(_ph_multiplier, _weight_body) * _ph_types_array[phType_body] + Math.pow(_ph_multiplier, _weight_chart) * _ph_types_array[phType_chart] + Math.pow(_ph_multiplier, _weight_clipArt) * _ph_types_array[phType_clipArt] + Math.pow(_ph_multiplier, _weight_ctrTitle) * _ph_types_array[phType_ctrTitle] + Math.pow(_ph_multiplier, _weight_dgm) * _ph_types_array[phType_dgm] + Math.pow(_ph_multiplier, _weight_media) * _ph_types_array[phType_media] + Math.pow(_ph_multiplier, _weight_obj) * _ph_types_array[phType_obj] + Math.pow(_ph_multiplier, _weight_pic) * _ph_types_array[phType_pic] + Math.pow(_ph_multiplier, _weight_subTitle) * _ph_types_array[phType_subTitle] + Math.pow(_ph_multiplier, _weight_tbl) * _ph_types_array[phType_tbl] + Math.pow(_ph_multiplier, _weight_title) * _ph_types_array[phType_title];
        for (var _index = 0; _index < 18; ++_index) {
            if (_weight >= _arr_lt_types_weight[_index] && _weight <= _arr_lt_types_weight[_index + 1]) {
                if (Math.abs(_arr_lt_types_weight[_index] - _weight) <= Math.abs(_arr_lt_types_weight[_index + 1] - _weight)) {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index]];
                    return;
                } else {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index + 1]];
                    return;
                }
            }
        }
        this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[18]];
    };
    this.calculateMatchedTypes = function () {
        this.matchedTypes = [];
        for (var i = 0; i < 36; ++i) {
            this.matchedTypes[i] = false;
        }
        if (this.calculatedType != null) {
            switch (this.calculatedType) {
            case nSldLtTBlank:
                this.matchedTypes[nSldLtTBlank] = true;
                break;
            case nSldLtTChart:
                this.matchedTypes[nSldLtTChart] = true;
                break;
            case nSldLtTChartAndTx:
                case nSldLtTTxAndChart:
                case nSldLtTVertTitleAndTxOverChart:
                this.matchedTypes[nSldLtTChartAndTx] = true;
                this.matchedTypes[nSldLtTTxAndChart] = true;
                this.matchedTypes[nSldLtTVertTitleAndTxOverChart] = true;
                break;
            case nSldLtTClipArtAndTx:
                case nSldLtTTxAndClipArt:
                case nSldLtTClipArtAndVertTx:
                this.matchedTypes[nSldLtTClipArtAndTx] = true;
                this.matchedTypes[nSldLtTTxAndClipArt] = true;
                break;
            case nSldLtTDgm:
                this.matchedTypes[nSldLtTDgm] = true;
                break;
            case nSldLtTFourObj:
                this.matchedTypes[nSldLtTFourObj] = true;
                break;
            case nSldLtTMediaAndTx:
                case nSldLtTTxAndMedia:
                this.matchedTypes[nSldLtTMediaAndTx] = true;
                this.matchedTypes[nSldLtTTxAndMedia] = true;
                break;
            case nSldLtTObj:
                this.matchedTypes[nSldLtTObj] = true;
                break;
            case nSldLtTObjAndTwoObj:
                case nSldLtTTwoObjAndObj:
                this.matchedTypes[nSldLtTObjAndTwoObj] = true;
                this.matchedTypes[nSldLtTTwoObjAndObj] = true;
                break;
            case nSldLtTObjAndTx:
                case nSldLtTTxAndObj:
                case nSldLtTTxOverObj:
                case nSldLtTObjOverTx:
                case nSldLtTObjTx:
                this.matchedTypes[nSldLtTObjAndTx] = true;
                this.matchedTypes[nSldLtTTxAndObj] = true;
                this.matchedTypes[nSldLtTTxOverObj] = true;
                break;
            case nSldLtTObjOnly:
                this.matchedTypes[nSldLtTObjOnly] = true;
                break;
            case nSldLtTPicTx:
                this.matchedTypes[nSldLtTPicTx] = true;
                break;
            case nSldLtTSecHead:
                case nSldLtTTitle:
                this.matchedTypes[nSldLtTSecHead] = true;
                this.matchedTypes[nSldLtTTitle] = true;
                break;
            case nSldLtTTbl:
                this.matchedTypes[nSldLtTTbl] = true;
                break;
            case nSldLtTTitleOnly:
                this.matchedTypes[nSldLtTTitleOnly] = true;
                break;
            case nSldLtTTwoColTx:
                this.matchedTypes[nSldLtTTwoColTx] = true;
                break;
            case nSldLtTTwoObj:
                this.matchedTypes[nSldLtTTwoObj] = true;
                break;
            case nSldLtTTwoObjAndTx:
                case nSldLtTTwoObjOverTx:
                case nSldLtTTxAndTwoObj:
                this.matchedTypes[nSldLtTTwoObjAndTx] = true;
                this.matchedTypes[nSldLtTTwoObjOverTx] = true;
                this.matchedTypes[nSldLtTTxAndTwoObj] = true;
                break;
            case nSldLtTTwoTxTwoObj:
                this.matchedTypes[nSldLtTTwoTxTwoObj] = true;
                break;
            case nSldLtTTx:
                case nSldLtTVertTx:
                case nSldLtTVertTitleAndTx:
                this.matchedTypes[nSldLtTTx] = true;
                this.matchedTypes[nSldLtTVertTx] = true;
                this.matchedTypes[nSldLtTVertTitleAndTx] = true;
                break;
            }
        } else {}
    };
}
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
    var _new_layout = slide.Layout;
    if (!_new_layout.calculated) {
        _new_layout.elementsManipulator = new AutoShapesContainer(editor.WordControl.m_oLogicDocument, 0);
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        if (Math.abs(presentation.Width - 254) > 1 || Math.abs(presentation.Width - 190.5) > 1) {
            var kx = presentation.Width / 254;
            var ky = presentation.Height / 190.5;
            for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
                _arr_shapes[_shape_index].resizeToFormat(kx, ky);
            }
        }
        for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
            _arr_shapes[_shape_index].setParent(_new_layout);
            _arr_shapes[_shape_index].setContainer(_new_layout.elementsManipulator);
            _arr_shapes[_shape_index].calculate();
        }
        _new_layout.calculated = true;
    }
    slide.calculate2();
    presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    if (_history_is_on) {
        History.TurnOn();
    }
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
}
function redrawSlide2(slide, presentation, arrInd, pos, arr_layouts, direction, arr_slides) {
    var _history_is_on = History.Is_On();
    if (_history_is_on) {
        History.TurnOff();
    }
    var _new_layout = arr_layouts[pos];
    if (!_new_layout.calculated) {
        _new_layout.elementsManipulator = new AutoShapesContainer(editor.WordControl.m_oLogicDocument, 0);
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        if (Math.abs(presentation.Width - 254) > 1 || Math.abs(presentation.Width - 190.5) > 1) {
            var kx = presentation.Width / 254;
            var ky = presentation.Height / 190.5;
            for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
                _arr_shapes[_shape_index].resizeToFormat(kx, ky);
            }
        }
        for (_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index) {
            _arr_shapes[_shape_index].setParent(_new_layout);
            _arr_shapes[_shape_index].setContainer(_new_layout.elementsManipulator);
            _arr_shapes[_shape_index].calculate();
        }
        _new_layout.calculated = true;
    }
    slide.calculate2();
    presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
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
    if (_history_is_on) {
        History.TurnOff();
    }
    slide.calculateColors();
    slide.Layout.calculateColors();
    slide.Layout.Master.calculateColors();
    presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    if (presentation.CurPos.Type === docpostype_FlowObjects) {
        if (presentation.CurPage === slide.num) {
            presentation.RecalculateCurPos();
        }
    }
    if (_history_is_on) {
        History.TurnOn();
    }
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
function Slide(presentation, slideLayout, slideNum) {
    this.maxId = 0;
    this.cSld = new CSld();
    this.clrMap = null;
    this.show = true;
    this.showMasterPhAnim = false;
    this.presentation = presentation;
    this.Layout = slideLayout;
    this.Master = null;
    this.Note = null;
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;
    this.changeLayout = function (layout) {
        var _slide_shapes = this.cSld.spTree;
        var _slide_shape;
        var _new_layout_shapes = layout.cSld.spTree;
        var _layout_shape;
        var _shape_index;
        var _history_obj;
        _history_obj = {};
        _history_obj.oldLayout = this.Layout;
        _history_obj.undo_function = function (data) {
            this.Layout = data.oldLayout;
            for (var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i) {
                if (this.elementsManipulator.ArrGlyph[i].resetTextStyles) {
                    this.elementsManipulator.ArrGlyph[i].resetTextStyles();
                }
            }
            this.calculate2();
        };
        _history_obj.redo_function = function (data) {};
        History.Add(this, _history_obj);
        for (_shape_index = 0; _shape_index < _slide_shapes.length; ++_shape_index) {
            _slide_shape = _slide_shapes[_shape_index];
            if (_slide_shape.isEmptyPlaceholder()) {
                _history_obj = {};
                _history_obj.shape = _slide_shape;
                _history_obj.shapeIndex = _shape_index;
                _history_obj.slideShapes = _slide_shapes;
                _history_obj.undo_function = function (data) {
                    data.slideShapes.splice(data.shapeIndex, 0, data.shape);
                };
                _history_obj.redo_function = function (data) {
                    data.slideShapes.splice(data.shapeIndex, 1);
                };
                History.Add(this, _history_obj);
                _slide_shapes.splice(_shape_index, 1);
                --_shape_index;
                continue;
            }
            var _slide_shape_xfrm = _slide_shape.spPr.xfrm;
            if (_slide_shape_xfrm && _slide_shape_xfrm.offX != null) {
                _history_obj = {};
                _history_obj.shape = _slide_shape;
                _history_obj.oldXfrmOffX = _slide_shape_xfrm.offX;
                _history_obj.oldXfrmOffY = _slide_shape_xfrm.offY;
                _history_obj.oldXfrmExtX = _slide_shape_xfrm.extX;
                _history_obj.oldXfrmExtY = _slide_shape_xfrm.extY;
                _history_obj.oldXfrmFlipH = _slide_shape_xfrm.flipH;
                _history_obj.oldXfrmFlipV = _slide_shape_xfrm.flipV;
                _history_obj.oldXfrmRot = _slide_shape_xfrm.rot;
                _history_obj.newXfrmOffX = _slide_shape.pH;
                _history_obj.newXfrmOffY = _slide_shape.pV;
                _history_obj.newXfrmExtX = _slide_shape.ext.cx;
                _history_obj.newXfrmExtY = _slide_shape.ext.cy;
                _history_obj.newXfrmFlipH = _slide_shape.flipH;
                _history_obj.newXfrmFlipV = _slide_shape.flipV;
                _history_obj.newXfrmRot = _slide_shape.flipV;
                _history_obj.undo_function = function (data) {
                    data.shape.spPr.xfrm.offX = data.oldXfrmOffX;
                    data.shape.spPr.xfrm.offY = data.oldXfrmOffY;
                    data.shape.spPr.xfrm.extX = data.oldXfrmExtX;
                    data.shape.spPr.xfrm.extY = data.oldXfrmExtY;
                    data.shape.spPr.xfrm.flipH = data.oldXfrmFlipH;
                    data.shape.spPr.xfrm.flipV = data.oldXfrmFlipV;
                    data.shape.spPr.xfrm.rot = data.oldXfrmRot;
                };
                _history_obj.redo_function = function (data) {
                    data.shape.spPr.xfrm.offX = data.newXfrmOffX;
                    data.shape.spPr.xfrm.offY = data.newXfrmOffY;
                    data.shape.spPr.xfrm.extX = data.newXfrmExtX;
                    data.shape.spPr.xfrm.extY = data.newXfrmExtY;
                    data.shape.spPr.xfrm.flipH = data.newXfrmFlipH;
                    data.shape.spPr.xfrm.flipV = data.newXfrmFlipV;
                    data.shape.spPr.xfrm.rot = data.newXfrmRot;
                };
                History.Add(this, _history_obj);
                _slide_shape.spPr.xfrm.offX = _slide_shape.pH;
                _slide_shape.spPr.xfrm.offY = _slide_shape.pV;
                _slide_shape.spPr.xfrm.extX = _slide_shape.ext.cx;
                _slide_shape.spPr.xfrm.extY = _slide_shape.ext.cy;
                _slide_shape.spPr.xfrm.flipH = _slide_shape.flipH;
                _slide_shape.spPr.xfrm.flipV = _slide_shape.flipV;
                _slide_shape.spPr.xfrm.rot = _slide_shape.rot;
            } else {
                if (_slide_shape.isPlaceholder()) {
                    var _new_master = layout.Master;
                    var _ph_idx = null,
                    _ph_type = null;
                    if (_slide_shape instanceof CShape) {
                        _ph_idx = _slide_shape.nvSpPr.nvPr.ph.idx;
                        _ph_type = _slide_shape.nvSpPr.nvPr.ph.type;
                    }
                    if (_slide_shape instanceof CImage2) {
                        _ph_idx = _slide_shape.nvPicPr.nvPr.ph.idx;
                        _ph_type = _slide_shape.nvPicPr.nvPr.ph.type;
                    }
                    var _merged_xfrm = new CXfrm();
                    var _master_shape = _new_master.getMatchingShape(_ph_type, _ph_idx);
                    var _layout_shape = layout.getMatchingShape(_ph_type, _ph_idx);
                    var _master_shape_xfrm = null;
                    if (_master_shape != null && _master_shape.spPr) {
                        _merged_xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    if (_layout_shape != null && _layout_shape.spPr) {
                        _merged_xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                    if (_merged_xfrm.offX == null) {
                        _history_obj = {};
                        _history_obj.shape = _slide_shape;
                        _history_obj.oldXfrmOffX = _slide_shape_xfrm.offX;
                        _history_obj.oldXfrmOffY = _slide_shape_xfrm.offY;
                        _history_obj.oldXfrmExtX = _slide_shape_xfrm.extX;
                        _history_obj.oldXfrmExtY = _slide_shape_xfrm.extY;
                        _history_obj.oldXfrmFlipH = _slide_shape_xfrm.flipH;
                        _history_obj.oldXfrmFlipV = _slide_shape_xfrm.flipV;
                        _history_obj.oldXfrmRot = _slide_shape_xfrm.rot;
                        _history_obj.newXfrmOffX = _slide_shape.pH;
                        _history_obj.newXfrmOffY = _slide_shape.pV;
                        _history_obj.newXfrmExtX = _slide_shape.ext.cx;
                        _history_obj.newXfrmExtY = _slide_shape.ext.cy;
                        _history_obj.newXfrmFlipH = _slide_shape.flipH;
                        _history_obj.newXfrmFlipV = _slide_shape.flipV;
                        _history_obj.newXfrmRot = _slide_shape.flipV;
                        _history_obj.undo_function = function (data) {
                            data.shape.spPr.xfrm.offX = data.oldXfrmOffX;
                            data.shape.spPr.xfrm.offY = data.oldXfrmOffY;
                            data.shape.spPr.xfrm.extX = data.oldXfrmExtX;
                            data.shape.spPr.xfrm.extY = data.oldXfrmExtY;
                            data.shape.spPr.xfrm.flipH = data.oldXfrmFlipH;
                            data.shape.spPr.xfrm.flipV = data.oldXfrmFlipV;
                            data.shape.spPr.xfrm.rot = data.oldXfrmRot;
                        };
                        _history_obj.redo_function = function (data) {
                            data.shape.spPr.xfrm.offX = data.newXfrmOffX;
                            data.shape.spPr.xfrm.offY = data.newXfrmOffY;
                            data.shape.spPr.xfrm.extX = data.newXfrmExtX;
                            data.shape.spPr.xfrm.extY = data.newXfrmExtY;
                            data.shape.spPr.xfrm.flipH = data.newXfrmFlipH;
                            data.shape.spPr.xfrm.flipV = data.newXfrmFlipV;
                            data.shape.spPr.xfrm.rot = data.newXfrmRot;
                        };
                        History.Add(this, _history_obj);
                        _slide_shape.spPr.xfrm.offX = _slide_shape.pH;
                        _slide_shape.spPr.xfrm.offY = _slide_shape.pV;
                        _slide_shape.spPr.xfrm.extX = _slide_shape.ext.cx;
                        _slide_shape.spPr.xfrm.extY = _slide_shape.ext.cy;
                        _slide_shape.spPr.xfrm.flipH = _slide_shape.flipH;
                        _slide_shape.spPr.xfrm.flipV = _slide_shape.flipV;
                        _slide_shape.spPr.xfrm.rot = _slide_shape.rot;
                    }
                }
            }
        }
        for (_shape_index = 0; _shape_index < _new_layout_shapes.length; ++_shape_index) {
            _layout_shape = _new_layout_shapes[_shape_index];
            if (_layout_shape.isPlaceholder()) {
                if (_layout_shape instanceof CShape) {
                    _ph_idx = _layout_shape.nvSpPr.nvPr.ph.idx;
                    _ph_type = _layout_shape.nvSpPr.nvPr.ph.type;
                }
                if (_layout_shape instanceof CImage2) {
                    _ph_idx = _layout_shape.nvPicPr.nvPr.ph.idx;
                    _ph_type = _layout_shape.nvPicPr.nvPr.ph.type;
                }
                var _matching_slide_shape = this.getMatchingShape(_ph_type, _ph_idx);
                if (_matching_slide_shape == null && (_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum)) {
                    var _index = _shape_index > _slide_shapes.length ? _slide_shapes.length : _shape_index;
                    var _added_shape = _layout_shape.createDuplicate2(this, this.elementsManipulator);
                    _added_shape.txBody = _layout_shape.txBody.createFullCopy(_added_shape);
                    _added_shape.txBody.content = new CDocumentContent(_added_shape, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);
                    var text = pHText[0][_added_shape.nvSpPr.nvPr.ph.type] != undefined ? pHText[0][_added_shape.nvSpPr.nvPr.ph.type] : pHText[0][phType_body];
                    _added_shape.txBody.content2 = new CDocumentContent(_added_shape, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);
                    _added_shape.txBody.content2.Content.length = 0;
                    var par = new Paragraph(this.elementsManipulator.DrawingDocument, _added_shape.txBody.content2, 0, 0, 0, 0, 0);
                    var EndPos = 0;
                    _added_shape.spPr.Fill = new CUniFill();
                    _added_shape.spPr.ln = new CLn();
                    _added_shape.spPr.xfrm = new CXfrm();
                    var _h_is_on = History.Is_On();
                    if (_h_is_on) {
                        History.TurnOff();
                    }
                    for (var key = 0; key < text.length; ++key) {
                        par.Internal_Content_Add(EndPos++, new ParaText(text[key]));
                    }
                    _added_shape.txBody.content2.Internal_Content_Add(0, par);
                    if (_h_is_on) {
                        History.TurnOn();
                    }
                    _history_obj = {};
                    _history_obj.layoutShape = _added_shape;
                    _history_obj.shapeIndex = _index;
                    _history_obj.slideShapes = _slide_shapes;
                    _history_obj.undo_function = function (data) {
                        data.slideShapes.splice(data.shapeIndex, 1);
                    };
                    _history_obj.redo_function = function (data) {
                        data.slideShapes.splice(data.shapeIndex, 0, data.layoutShape);
                    };
                    History.Add(this, _history_obj);
                    _slide_shapes.splice(_index, 0, _added_shape);
                }
            }
        }
        _history_obj = {};
        _history_obj.newLayout = layout;
        _history_obj.undo_function = function (data) {};
        _history_obj.redo_function = function (data) {
            this.Layout = data.newLayout;
            for (var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i) {
                if (this.elementsManipulator.ArrGlyph[i].resetTextStyles) {
                    this.elementsManipulator.ArrGlyph[i].resetTextStyles();
                }
            }
            this.calculate2();
        };
        History.Add(this, _history_obj);
        this.Layout = layout;
        for (var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i) {
            if (this.elementsManipulator.ArrGlyph[i].resetTextStyles) {
                this.elementsManipulator.ArrGlyph[i].resetTextStyles();
            }
        }
        this.calculate2();
    };
    this.prepareToChangeTheme = function (_new_layout) {
        for (var i = 0, glyphs = this.elementsManipulator.ArrGlyph, n = glyphs.length; i < n; ++i) {
            if (glyphs[i].prepareToChangeTheme) {
                glyphs[i].prepareToChangeTheme(_new_layout);
            }
        }
    };
    this.prepareToChangeTheme2 = function (_new_layout) {
        for (var i = 0, glyphs = this.elementsManipulator.ArrGlyph, n = glyphs.length; i < n; ++i) {
            if (glyphs[i].prepareToChangeTheme2) {
                glyphs[i].prepareToChangeTheme2();
            }
        }
    };
    this.createFullCopy = function (_slide_num) {
        var _history_is_on = History.Is_On();
        if (_history_is_on) {
            History.TurnOff();
        }
        var _copy = new Slide(this.presentation, this.Layout, _slide_num);
        _copy.Layout = this.Layout;
        _copy.Master = this.Master;
        _copy.Theme = this.Theme;
        _copy.cSld = this.cSld.createFullCopy(_copy, _copy.elementsManipulator);
        _copy.elementsManipulator.ArrGlyph = _copy.cSld.spTree;
        if (_history_is_on) {
            History.TurnOn();
        }
        return _copy;
    };
    this.CreateFontMap = function (FontMap) {
        var _arr_glyph = this.elementsManipulator.ArrGlyph;
        for (var i = 0; i < _arr_glyph.length; ++i) {
            if (_arr_glyph[i].CreateFontMap != undefined) {
                _arr_glyph[i].CreateFontMap(FontMap);
            }
        }
    };
    this.calculateColors = function () {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes_count; ++_shape_index) {
            _shapes[_shape_index].calculateColors();
        }
    };
    this.kind = SLIDE_KIND;
    this.num = slideNum;
    this.compiledShapes = [];
    this.elementsManipulator = new AutoShapesContainer(presentation, slideNum);
    this.elementsManipulator.ArrGlyph = this.cSld.spTree;
    this.Width = presentation.Width;
    this.Height = presentation.Height;
    this.searchingArray = new Array();
    this.selectionArray = new Array();
    this.Margins = {
        Left: X_Left_Field,
        Right: X_Right_Field,
        Top: Y_Top_Field,
        Bottom: Y_Bottom_Field
    };
    this.Save_Changes = function () {};
    this.getMatchingShape = function (type, idx) {
        var _input_reduced_type;
        if (type == null) {
            _input_reduced_type = phType_body;
        } else {
            if (type == phType_ctrTitle) {
                _input_reduced_type = phType_title;
            } else {
                _input_reduced_type = type;
            }
        }
        var _input_reduced_index;
        if (idx == null) {
            _input_reduced_index = 0;
        } else {
            _input_reduced_index = idx;
        }
        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
            _glyph = _sp_tree[_shape_index];
            if (_glyph.isPlaceholder()) {
                if (_glyph instanceof CShape) {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if (_glyph instanceof CImage2) {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if (_glyph instanceof GroupShape) {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if (_type == null) {
                    _final_type = phType_body;
                } else {
                    if (_type == phType_ctrTitle) {
                        _final_type = phType_title;
                    } else {
                        _final_type = _type;
                    }
                }
                if (_index == null) {
                    _final_index = 0;
                } else {
                    _final_index = _index;
                }
                if (_input_reduced_type == _final_type && _input_reduced_index == _final_index) {
                    return _glyph;
                }
            }
        }
        if (_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr) {
            for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
                _glyph = _sp_tree[_shape_index];
                if (_glyph.isPlaceholder()) {
                    if (_glyph instanceof CShape) {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof CImage2) {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof GroupShape) {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }
                    if (_input_reduced_type == _type) {
                        return _glyph;
                    }
                }
            }
        }
        return null;
    };
    this.calculate = function () {
        this.compiledShapes.length = 0;
        var slideSpTree = this.cSld.spTree;
        for (var i = 0; i < slideSpTree.length; ++i) {
            slideSpTree[i].calculate();
        }
        this.elementsManipulator.ArrGlyph = slideSpTree;
    };
    this.calculate2 = function () {
        var spTree = this.cSld.spTree;
        for (var i = 0, n = spTree.length; i < n; ++i) {
            if (spTree[i].calculate2) {
                spTree[i].calculate2();
            }
        }
    };
    this.changeNum = function (num) {
        this.num = num;
        this.elementsManipulator.SlideNum = num;
        var _arr_glyph = this.cSld.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _arr_glyph.length; ++_shape_index) {
            if (_arr_glyph[_shape_index].isPlaceholder()) {
                if (_arr_glyph[_shape_index] instanceof CShape) {
                    if (_arr_glyph[_shape_index].nvSpPr.nvPr.ph.type == phType_sldNum && _arr_glyph[_shape_index].txBody.textFieldFlag) {
                        _arr_glyph[_shape_index].txBody.recalculate(_arr_glyph[_shape_index]);
                    }
                }
            }
        }
    };
    this.calculateAfterChangeLayout = function () {
        var historyData;
        var _history_is_on = History.Is_On();
        if (_history_is_on) {
            History.TurnOff();
        }
        for (var i = this.cSld.spTree.length - 1; i > -1; --i) {
            if (this.cSld.spTree[i].isEmptyPlaceholder()) {
                var deletedShape = this.cSld.spTree.splice(i, 1)[0];
                historyData = {};
                historyData.deletedShape = deletedShape;
                historyData.shapeIndex = i;
                historyData.undo_function = function (data) {
                    this.cSld.spTree.splice(data.shapeIndex, 0, data.deletedShape);
                };
                historyData.redo_function = function (data) {
                    this.cSld.spTree.splice(data.shapeIndex, 1);
                };
            }
        }
        for (i = this.Layout.cSld.spTree.length - 1; i > -1; --i) {
            if (this.Layout.cSld.spTree[i].isPlaceholder()) {
                var matchingShape;
                var _ph_type = this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type;
                if (((matchingShape = this.getMatchingShape(this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type, this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.idx)) == null) && ((_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum))) {
                    var duplicate = this.Layout.cSld.spTree[i].createDuplicate2(this, this.elementsManipulator);
                    if (this.Layout.cSld.spTree[i] instanceof CShape) {
                        var _body_pr;
                        if (this.Layout.cSld.spTree[i].txBody && this.Layout.cSld.spTree[i].txBody.bodyPr) {
                            _body_pr = this.Layout.cSld.spTree[i].txBody.bodyPr.createDuplicate();
                        } else {
                            _body_pr = new CBodyPr();
                        }
                        duplicate.txBody = new CTextBody(duplicate);
                        duplicate.txBody.bodyPr = _body_pr;
                        duplicate.txBody.content = new CDocumentContent(duplicate, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);
                    }
                    duplicate.spPr.xfrm = new CXfrm();
                    duplicate.spPr.Fill = new CUniFill();
                    duplicate.spPr.ln = new CLn();
                    duplicate.calculate();
                    duplicate.setParent(this);
                    duplicate.setContainer(this.elementsManipulator);
                    this.cSld.spTree.splice(i, 0, duplicate);
                    historyData = {};
                    historyData.addedShape = duplicate;
                    historyData.shapeIndex = i;
                    historyData.undo_function = function (data) {
                        this.cSld.spTree.splice(data.shapeIndex, 1);
                    };
                    historyData.redo_function = function (data) {
                        this.cSld.spTree.splice(data.shapeIndex, 0, data.addedShape);
                    };
                } else {
                    if (matchingShape != null) {
                        _ph_type = this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type;
                        if (this.Layout.cSld.spTree[i].spPr.xfrm.extX != undefined) {
                            historyData = {};
                            historyData.old_SpPrXfrm = clone(matchingShape.spPr.xfrm);
                            historyData.old_pH = matchingShape.pH;
                            historyData.old_pV = matchingShape.pV;
                            historyData.old_ext = clone(matchingShape.ext);
                            historyData.shape = matchingShape;
                            historyData.undo_function = function (data) {
                                data.shape.spPr.xfrm.offX = data.old_SpPrXfrm.offX;
                                data.shape.spPr.xfrm.offY = data.old_SpPrXfrm.offY;
                                data.shape.spPr.xfrm.extX = data.old_SpPrXfrm.extX;
                                data.shape.spPr.xfrm.extY = data.old_SpPrXfrm.extY;
                                data.shape.spPr.xfrm.chOffX = data.old_SpPrXfrm.chOffX;
                                data.shape.spPr.xfrm.chOffY = data.old_SpPrXfrm.chOffY;
                                data.shape.spPr.xfrm.chExtX = data.old_SpPrXfrm.chExtX;
                                data.shape.spPr.xfrm.chExtY = data.old_SpPrXfrm.chExtY;
                            };
                            historyData.redo_function = function (data) {
                                data.shape.spPr.xfrm = new CXfrm();
                            };
                            matchingShape.spPr.xfrm = new CXfrm();
                        } else {
                            var masterMatchingShape = this.Layout.Master.getMatchingShape(this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type, this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.idx);
                            if (masterMatchingShape != null && masterMatchingShape.spPr.xfrm.extX != undefined) {
                                historyData = {};
                                historyData.old_SpPrXfrm = clone(matchingShape.spPr.xfrm);
                                historyData.old_pH = matchingShape.pH;
                                historyData.old_pV = matchingShape.pV;
                                historyData.old_ext = clone(matchingShape.ext);
                                historyData.shape = matchingShape;
                                historyData.undo_function = function (data) {
                                    data.shape.spPr.xfrm.offX = data.old_SpPrXfrm.offX;
                                    data.shape.spPr.xfrm.offY = data.old_SpPrXfrm.offY;
                                    data.shape.spPr.xfrm.extX = data.old_SpPrXfrm.extX;
                                    data.shape.spPr.xfrm.extY = data.old_SpPrXfrm.extY;
                                    data.shape.spPr.xfrm.chOffX = data.old_SpPrXfrm.chOffX;
                                    data.shape.spPr.xfrm.chOffY = data.old_SpPrXfrm.chOffY;
                                    data.shape.spPr.xfrm.chExtX = data.old_SpPrXfrm.chExtX;
                                    data.shape.spPr.xfrm.chExtY = data.old_SpPrXfrm.chExtY;
                                };
                                historyData.redo_function = function (data) {
                                    data.shape.spPr.xfrm = new CXfrm();
                                };
                                matchingShape.spPr.xfrm = new CXfrm();
                            }
                        }
                    }
                }
            }
        }
        historyData = {};
        historyData.undo_function = function (data) {};
        historyData.redo_function = function (data) {
            for (var i = 0; i < this.cSld.spTree.length; ++i) {
                this.cSld.spTree[i].calculate2();
            }
        };
        for (i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].calculate2();
        }
        if (_history_is_on) {
            History.TurnOn();
        }
    };
    this.drawSelect = function () {
        this.elementsManipulator.drawSelect();
    };
    this.getBackground = function () {
        var _back_fill = null;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var _layout = this.Layout;
        var _master = _layout.Master;
        var _theme = _master.Theme;
        if (this.cSld.Bg != null) {
            if (null != this.cSld.Bg.bgPr) {
                _back_fill = this.cSld.Bg.bgPr.Fill;
            } else {
                if (this.cSld.Bg.bgRef != null) {
                    this.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                    RGBA = this.cSld.Bg.bgRef.Color.RGBA;
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx);
                }
            }
        } else {
            if (_layout != null) {
                if (_layout.cSld.Bg != null) {
                    if (null != _layout.cSld.Bg.bgPr) {
                        _back_fill = _layout.cSld.Bg.bgPr.Fill;
                    } else {
                        if (_layout.cSld.Bg.bgRef != null) {
                            _layout.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                            RGBA = _layout.cSld.Bg.bgRef.Color.RGBA;
                            _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx);
                        }
                    }
                } else {
                    if (_master != null) {
                        if (_master.cSld.Bg != null) {
                            if (null != _master.cSld.Bg.bgPr) {
                                _back_fill = _master.cSld.Bg.bgPr.Fill;
                            } else {
                                if (_master.cSld.Bg.bgRef != null) {
                                    _master.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                                    RGBA = _master.cSld.Bg.bgRef.Color.RGBA;
                                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx);
                                }
                            }
                        } else {
                            _back_fill = new CUniFill();
                            _back_fill.fill = new CSolidFill();
                            _back_fill.fill.color.color = new CRGBColor();
                            _back_fill.fill.color.color.RGBA = {
                                R: 255,
                                G: 255,
                                B: 255,
                                A: 255
                            };
                        }
                    }
                }
            }
        }
        if (_back_fill != null) {
            _back_fill.calculate(_theme, this, _layout, _master, RGBA);
        }
        return _back_fill;
    };
    this.draw = function (graphics) {
        var _back_fill = this.getBackground();
        DrawBackground(graphics, _back_fill, 0, 0, this.Width, this.Height);
        if (this.showMasterSp || (this.showMasterSp === undefined && (this.Layout.showMasterSp === undefined || this.Layout.showMasterSp))) {
            this.Layout.Master.draw(graphics);
        }
        this.Layout.draw(graphics);
        for (var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i) {
            this.elementsManipulator.ArrGlyph[i].Draw(graphics);
        }
    };
    this.Undo = function (data) {
        data.undo_function.call(this, data);
    };
    this.Redo = function (data) {
        data.redo_function.call(this, data);
    };
    this.changeBg = function (bg) {
        var historyData = {};
        historyData.old_bg = this.cSld.Bg;
        historyData.new_bg = bg;
        historyData.undo_function = function (data) {
            this.cSld.Bg = data.old_bg;
            this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
        };
        historyData.undo_function = function (data) {
            this.cSld.Bg = data.new_bg;
            this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
        };
        this.cSld.Bg = bg;
        this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
    };
    this.OnMouseDown = function (e, X, Y) {
        this.elementsManipulator.OnMouseDown(e, X, Y, this.SlideNum);
    };
    this.OnMouseMove = function (e, X, Y) {
        this.elementsManipulator.OnMouseMove(e, X, Y, this.SlideNum);
    };
    this.OnMouseUp = function (e, X, Y) {
        this.elementsManipulator.OnMouseUp(e, X, Y, this.SlideNum);
    };
}
var VERTICAL_ANCHOR_TYPE_BOTTOM = 0;
var VERTICAL_ANCHOR_TYPE_CENTER = 1;
var VERTICAL_ANCHOR_TYPE_DISTRIBUTED = 2;
var VERTICAL_ANCHOR_TYPE_JUSTIFIED = 3;
var VERTICAL_ANCHOR_TYPE_TOP = 4;
var nOTClip = 0;
var nOTEllipsis = 1;
var nOTOwerflow = 2;
var nTextATB = 0;
var nTextATCtr = 1;
var nTextATDist = 2;
var nTextATJust = 3;
var nTextATT = 4;
var nVertTTeaVert = 0;
var nVertTThorz = 1;
var nVertTTmongolianVert = 2;
var nVertTTvert = 3;
var nVertTTvert270 = 4;
var nVertTTwordArtVert = 5;
var nVertTTwordArtVertRtl = 6;
var nTWTNone = 0;
var nTWTSquare = 1;
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
        this.anchor = VERTICAL_ANCHOR_TYPE_CENTER;
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
    this.setChartTitleInsets = function () {
        this.rIns = 0.3;
        this.lIns = 0.3;
        this.tIns = 0.3;
        this.bIns = 0;
    };
    this.setVert = function (vert) {
        this.vert = vert;
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
    this.rPr = null;
    this.createDuplicate = function () {
        var duplicate = new CTextParagraphPr();
        duplicate.bullet = this.bullet.createDuplicate();
        duplicate.lvl = this.lvl;
        duplicate.pPr = clone(this.pPr);
        duplicate.rPr = clone(this.rPr);
        return duplicate;
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
    var scheme = theme.themeElements.clrScheme;
    scheme.colors[8] = CreateUniColorRGB(0, 0, 0);
    scheme.colors[12] = CreateUniColorRGB(255, 255, 255);
    scheme.colors[9] = CreateUniColorRGB(31, 73, 125);
    scheme.colors[13] = CreateUniColorRGB(238, 236, 225);
    scheme.colors[0] = CreateUniColorRGB(79, 129, 189);
    scheme.colors[1] = CreateUniColorRGB(192, 80, 77);
    scheme.colors[2] = CreateUniColorRGB(155, 187, 89);
    scheme.colors[3] = CreateUniColorRGB(128, 100, 162);
    scheme.colors[4] = CreateUniColorRGB(75, 172, 198);
    scheme.colors[5] = CreateUniColorRGB(247, 150, 70);
    scheme.colors[11] = CreateUniColorRGB(0, 0, 255);
    scheme.colors[10] = CreateUniColorRGB(128, 0, 128);
    var brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = new CSchemeColor();
    brush.fill.color.color.id = phClr;
    theme.themeElements.fmtScheme.fillStyleLst.push(brush);
    brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = CreateUniColorRGB(0, 0, 0);
    theme.themeElements.fmtScheme.fillStyleLst.push(brush);
    brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = CreateUniColorRGB(0, 0, 0);
    theme.themeElements.fmtScheme.fillStyleLst.push(brush);
    brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = new CSchemeColor();
    brush.fill.color.color.id = phClr;
    theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);
    brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = CreateUniColorRGB(0, 0, 0);
    theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);
    brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.color = CreateUniColorRGB(0, 0, 0);
    theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);
    var pen = new CLn();
    pen.w = 9525;
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CSchemeColor();
    pen.Fill.fill.color.color.id = phClr;
    pen.Fill.fill.color.Mods.Mods.push({
        name: "shade",
        val: 95000
    });
    pen.Fill.fill.color.Mods.Mods.push({
        name: "satMod",
        val: 105000
    });
    theme.themeElements.fmtScheme.lnStyleLst.push(pen);
    pen = new CLn();
    pen.w = 25400;
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CSchemeColor();
    pen.Fill.fill.color.color.id = phClr;
    theme.themeElements.fmtScheme.lnStyleLst.push(pen);
    pen = new CLn();
    pen.w = 38100;
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CSchemeColor();
    pen.Fill.fill.color.color.id = phClr;
    theme.themeElements.fmtScheme.lnStyleLst.push(pen);
    theme.extraClrSchemeLst = new Array();
    return theme;
}
function GenerateDefaultColorMap() {
    var clrMap = new ClrMap();
    clrMap.color_map[0] = 0;
    clrMap.color_map[1] = 1;
    clrMap.color_map[2] = 2;
    clrMap.color_map[3] = 3;
    clrMap.color_map[4] = 4;
    clrMap.color_map[5] = 5;
    clrMap.color_map[10] = 10;
    clrMap.color_map[11] = 11;
    clrMap.color_map[6] = 12;
    clrMap.color_map[7] = 13;
    clrMap.color_map[15] = 8;
    clrMap.color_map[16] = 9;
    return clrMap;
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