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
 Ext.define("Common.component.util.RGBColor", {
    alternateClassName: "Common.util.RGBColor",
    constructor: function (colorString) {
        this.ok = false;
        if (colorString.charAt(0) == "#") {
            colorString = colorString.substr(1, 6);
        }
        colorString = colorString.replace(/ /g, "");
        colorString = colorString.toLowerCase();
        var colorDefinitions = [{
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            process: function (bits) {
                return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
            }
        },
        {
            re: /^hsb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            process: function (bits) {
                var rgb = {};
                var h = Math.round(bits[1]);
                var s = Math.round(bits[2] * 255 / 100);
                var v = Math.round(bits[3] * 255 / 100);
                if (s == 0) {
                    rgb.r = rgb.g = rgb.b = v;
                } else {
                    var t1 = v;
                    var t2 = (255 - s) * v / 255;
                    var t3 = (t1 - t2) * (h % 60) / 60;
                    if (h == 360) {
                        h = 0;
                    }
                    if (h < 60) {
                        rgb.r = t1;
                        rgb.b = t2;
                        rgb.g = t2 + t3;
                    } else {
                        if (h < 120) {
                            rgb.g = t1;
                            rgb.b = t2;
                            rgb.r = t1 - t3;
                        } else {
                            if (h < 180) {
                                rgb.g = t1;
                                rgb.r = t2;
                                rgb.b = t2 + t3;
                            } else {
                                if (h < 240) {
                                    rgb.b = t1;
                                    rgb.r = t2;
                                    rgb.g = t1 - t3;
                                } else {
                                    if (h < 300) {
                                        rgb.b = t1;
                                        rgb.g = t2;
                                        rgb.r = t2 + t3;
                                    } else {
                                        if (h < 360) {
                                            rgb.r = t1;
                                            rgb.g = t2;
                                            rgb.b = t1 - t3;
                                        } else {
                                            rgb.r = 0;
                                            rgb.g = 0;
                                            rgb.b = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            process: function (bits) {
                return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            process: function (bits) {
                return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
            }
        }];
        for (var i = 0; i < colorDefinitions.length; i++) {
            var re = colorDefinitions[i].re;
            var processor = colorDefinitions[i].process;
            var bits = re.exec(colorString);
            if (bits) {
                var channels = processor(bits);
                this.r = channels[0];
                this.g = channels[1];
                this.b = channels[2];
                this.ok = true;
            }
        }
        this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
        this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
        this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
        this.isEqual = function (color) {
            return ((this.r == color.r) && (this.g == color.g) && (this.b == color.b));
        };
        this.toRGB = function () {
            return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        this.toRGBA = function (alfa) {
            if (alfa === undefined) {
                alfa = 1;
            }
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + alfa + ")";
        };
        this.toHex = function () {
            var r = this.r.toString(16);
            var g = this.g.toString(16);
            var b = this.b.toString(16);
            if (r.length == 1) {
                r = "0" + r;
            }
            if (g.length == 1) {
                g = "0" + g;
            }
            if (b.length == 1) {
                b = "0" + b;
            }
            return "#" + r + g + b;
        };
        this.toHSB = function () {
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(this.r, this.g, this.b);
            var max = Math.max(this.r, this.g, this.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (this.r == max) {
                    hsb.h = 0 + (this.g - this.b) / delta;
                } else {
                    if (this.g == max) {
                        hsb.h = 2 + (this.b - this.r) / delta;
                    } else {
                        hsb.h = 4 + (this.r - this.g) / delta;
                    }
                }
            } else {
                hsb.h = 0;
            }
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            hsb.h = parseInt(hsb.h);
            hsb.s = parseInt(hsb.s);
            hsb.b = parseInt(hsb.b);
            return hsb;
        };
    }
});