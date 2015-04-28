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
 if (Common === undefined) {
    var Common = {};
}
if (Common.Utils === undefined) {
    Common.Utils = {};
}
Common.Utils = new(function () {
    var userAgent = navigator.userAgent.toLowerCase(),
    check = function (regex) {
        return regex.test(userAgent);
    },
    isStrict = document.compatMode == "CSS1Compat",
    version = function (is, regex) {
        var m;
        return (is && (m = regex.exec(userAgent))) ? parseFloat(m[1]) : 0;
    },
    docMode = document.documentMode,
    isOpera = check(/opera/),
    isOpera10_5 = isOpera && check(/version\/10\.5/),
    isChrome = check(/\bchrome\b/),
    isWebKit = check(/webkit/),
    isSafari = !isChrome && check(/safari/),
    isSafari2 = isSafari && check(/applewebkit\/4/),
    isSafari3 = isSafari && check(/version\/3/),
    isSafari4 = isSafari && check(/version\/4/),
    isSafari5_0 = isSafari && check(/version\/5\.0/),
    isSafari5 = isSafari && check(/version\/5/),
    isIE = !isOpera && (check(/msie/) || check(/trident/)),
    isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
    isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
    isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
    isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
    isIE11 = isIE && ((check(/trident\/7\.0/) && docMode != 7 && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 11),
    isIE6 = isIE && check(/msie 6/),
    isGecko = !isWebKit && !isIE && check(/gecko/),
    isGecko3 = isGecko && check(/rv:1\.9/),
    isGecko4 = isGecko && check(/rv:2\.0/),
    isGecko5 = isGecko && check(/rv:5\./),
    isGecko10 = isGecko && check(/rv:10\./),
    isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
    isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
    isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
    isWindows = check(/windows|win32/),
    isMac = check(/macintosh|mac os x/),
    isLinux = check(/linux/),
    chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
    firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
    ieVersion = version(isIE, /msie (\d+\.\d+)/),
    operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
    safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
    webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
    isSecure = /^https/i.test(window.location.protocol),
    emailRe = /^(mailto:)?([a-z0-9\._-]+@[a-z0-9\.-]+\.[a-z]{2,4})([a-яё0-9\._%+-=\? :&]*)/i,
    ipRe = /^(((https?)|(ftps?)):\/\/)?([\-\wа-яё]*:?[\-\wа-яё]*@)?(((1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\.){3}(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9]))(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;`~=%!,]*)(\.[\wа-яё]{2,})?)*)*\/?/i,
    hostnameRe = /^(((https?)|(ftps?)):\/\/)?([\-\wа-яё]*:?[\-\wа-яё]*@)?(([\-\wа-яё]+\.)+[\wа-яё\-]{2,}(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;`~=%!,]*)(\.[\wа-яё]{2,})?)*)*\/?)/i,
    localRe = /^(((https?)|(ftps?)):\/\/)([\-\wа-яё]*:?[\-\wа-яё]*@)?(([\-\wа-яё]+)(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;`~=%!,]*)(\.[\wа-яё]{2,})?)*)*\/?)/i,
    emailStrongRe = /(mailto:)([a-z0-9\._-]+@[a-z0-9\.-]+\.[a-z]{2,4})([a-яё0-9\._%+-=\? :&]*)/ig,
    ipStrongRe = /(((https?)|(ftps?)):\/\/([\-\wа-яё]*:?[\-\wа-яё]*@)?)(((1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\.){3}(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9]))(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;`~=%!,]*)(\.[\wа-яё]{2,})?)*)*\/?/ig,
    hostnameStrongRe = /((((https?)|(ftps?)):\/\/([\-\wа-яё]*:?[\-\wа-яё]*@)?)|(([\-\wа-яё]*:?[\-\wа-яё]*@)?www\.))((([\-\wа-яё]+\.)+[\wа-яё\-]{2,}|([\-\wа-яё]+))(:\d+)?(\/[%\-\wа-яё]*(\.[\wа-яё]{2,})?(([\wа-яё\-\.\?\\\/+@&#;`~=%!,]*)(\.[\wа-яё]{2,})?)*)*\/?)/ig;
    return {
        userAgent: userAgent,
        isStrict: isStrict,
        isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
        isOpera: isOpera,
        isOpera10_5: isOpera10_5,
        isWebKit: isWebKit,
        isChrome: isChrome,
        isSafari: isSafari,
        isSafari3: isSafari3,
        isSafari4: isSafari4,
        isSafari5: isSafari5,
        isSafari5_0: isSafari5_0,
        isSafari2: isSafari2,
        isIE: isIE,
        isIE6: isIE6,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE && !isIE6,
        isIE8: isIE8,
        isIE8m: isIE6 || isIE7 || isIE8,
        isIE8p: isIE && !(isIE6 || isIE7),
        isIE9: isIE9,
        isIE9m: isIE6 || isIE7 || isIE8 || isIE9,
        isIE9p: isIE && !(isIE6 || isIE7 || isIE8),
        isIE10: isIE10,
        isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
        isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
        isIE11: isIE11,
        isIE11m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE11p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9 || isIE10),
        isGecko: isGecko,
        isGecko3: isGecko3,
        isGecko4: isGecko4,
        isGecko5: isGecko5,
        isGecko10: isGecko10,
        isFF3_0: isFF3_0,
        isFF3_5: isFF3_5,
        isFF3_6: isFF3_6,
        isFF4: 4 <= firefoxVersion && firefoxVersion < 5,
        isFF5: 5 <= firefoxVersion && firefoxVersion < 6,
        isFF10: 10 <= firefoxVersion && firefoxVersion < 11,
        isLinux: isLinux,
        isWindows: isWindows,
        isMac: isMac,
        chromeVersion: chromeVersion,
        firefoxVersion: firefoxVersion,
        ieVersion: ieVersion,
        operaVersion: operaVersion,
        safariVersion: safariVersion,
        webKitVersion: webKitVersion,
        isSecure: isSecure,
        emailRe: emailRe,
        ipRe: ipRe,
        hostnameRe: hostnameRe,
        localRe: localRe,
        emailStrongRe: emailStrongRe,
        ipStrongRe: ipStrongRe,
        hostnameStrongRe: hostnameStrongRe
    };
})();
Common.Utils.ThemeColor = new(function () {
    return {
        ThemeValues: [6, 15, 7, 16, 0, 1, 2, 3, 4, 5],
        setColors: function (colors, standart_colors) {
            var i, j, item;
            if (standart_colors && standart_colors.length > 0) {
                var standartcolors = [];
                for (i = 0; i < standart_colors.length; i++) {
                    item = this.getHexColor(standart_colors[i].get_r(), standart_colors[i].get_g(), standart_colors[i].get_b());
                    standartcolors.push(item);
                }
                this.standartcolors = standartcolors;
            }
            var effectСolors = [];
            for (i = 0; i < 6; i++) {
                for (j = 0; j < 10; j++) {
                    var idx = i + j * 6;
                    item = {
                        color: this.getHexColor(colors[idx].get_r(), colors[idx].get_g(), colors[idx].get_b()),
                        effectId: idx,
                        effectValue: this.ThemeValues[j]
                    };
                    effectСolors.push(item);
                }
            }
            this.effectcolors = effectСolors;
        },
        getEffectColors: function () {
            return this.effectcolors;
        },
        getStandartColors: function () {
            return this.standartcolors;
        },
        getHexColor: function (r, g, b) {
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
            if (r.length == 1) {
                r = "0" + r;
            }
            if (g.length == 1) {
                g = "0" + g;
            }
            if (b.length == 1) {
                b = "0" + b;
            }
            return r + g + b;
        },
        getRgbColor: function (clr) {
            var color = (typeof(clr) == "object") ? clr.color : clr;
            color = color.replace(/#/, "");
            if (color.length == 3) {
                color = color.replace(/(.)/g, "$1$1");
            }
            color = parseInt(color, 16);
            var c = new CAscColor();
            c.put_type((typeof(clr) == "object" && clr.effectId !== undefined) ? c_oAscColor.COLOR_TYPE_SCHEME : c_oAscColor.COLOR_TYPE_SRGB);
            c.put_r(color >> 16);
            c.put_g((color & 65280) >> 8);
            c.put_b(color & 255);
            c.put_a(255);
            if (clr.effectId !== undefined) {
                c.put_value(clr.effectId);
            }
            return c;
        },
        colorValue2EffectId: function (clr) {
            if (typeof(clr) == "object" && clr.effectValue !== undefined && this.effectcolors) {
                for (var i = 0; i < this.effectcolors.length; i++) {
                    if (this.effectcolors[i].effectValue === clr.effectValue && clr.color.toUpperCase() === this.effectcolors[i].color.toUpperCase()) {
                        clr.effectId = this.effectcolors[i].effectId;
                        break;
                    }
                }
            }
            return clr;
        }
    };
})();
Common.Utils.Metric = new(function () {
    var me = this;
    me.c_MetricUnits = {
        cm: 0,
        pt: 1
    };
    me.currentMetric = me.c_MetricUnits.pt;
    me.metricName = ["cm", "pt"];
    return {
        c_MetricUnits: me.c_MetricUnits,
        metricName: me.metricName,
        setCurrentMetric: function (value) {
            me.currentMetric = value;
        },
        getCurrentMetric: function () {
            return me.currentMetric;
        },
        fnRecalcToMM: function (value) {
            if (value !== null && value !== undefined) {
                switch (me.currentMetric) {
                case me.c_MetricUnits.cm:
                    return value * 10;
                case me.c_MetricUnits.pt:
                    return value * 25.4 / 72;
                }
            }
            return value;
        },
        fnRecalcFromMM: function (value) {
            switch (me.currentMetric) {
            case me.c_MetricUnits.cm:
                return parseFloat((value / 10).toFixed(4));
            case me.c_MetricUnits.pt:
                return parseFloat((value * 72 / 25.4).toFixed(3));
            }
            return value;
        }
    };
})();
Common.Utils.RGBColor = function (colorString) {
    var r, g, b;
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
            r = channels[0];
            g = channels[1];
            b = channels[2];
        }
    }
    r = (r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r);
    g = (g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g);
    b = (b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b);
    var isEqual = function (color) {
        return ((r == color.r) && (g == color.g) && (b == color.b));
    };
    var toRGB = function () {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    };
    var toRGBA = function (alfa) {
        if (alfa === undefined) {
            alfa = 1;
        }
        return "rgba(" + r + ", " + g + ", " + b + ", " + alfa + ")";
    };
    var toHex = function () {
        var _r = r.toString(16);
        var _g = g.toString(16);
        var _b = b.toString(16);
        if (_r.length == 1) {
            _r = "0" + _r;
        }
        if (_g.length == 1) {
            _g = "0" + _g;
        }
        if (_b.length == 1) {
            _b = "0" + _b;
        }
        return "#" + _r + _g + _b;
    };
    var toHSB = function () {
        var hsb = {
            h: 0,
            s: 0,
            b: 0
        };
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
            if (r == max) {
                hsb.h = 0 + (g - b) / delta;
            } else {
                if (g == max) {
                    hsb.h = 2 + (b - r) / delta;
                } else {
                    hsb.h = 4 + (r - g) / delta;
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
    return {
        r: r,
        g: g,
        b: b,
        isEqual: isEqual,
        toRGB: toRGB,
        toRGBA: toRGBA,
        toHex: toHex,
        toHSB: toHSB
    };
};
Common.Utils.String = new(function () {
    return {
        format: function (format) {
            var args = _.toArray(arguments).slice(1);
            return format.replace(/\{(\d+)\}/g, function (s, i) {
                return args[i];
            });
        },
        htmlEncode: function (string) {
            return _.escape(string);
        },
        htmlDecode: function (string) {
            return _.unescape(string);
        },
        ellipsis: function (value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2),
                    index = Math.max(vs.lastIndexOf(" "), vs.lastIndexOf("."), vs.lastIndexOf("!"), vs.lastIndexOf("?"));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },
        platformKey: function (string, template, hookFn) {
            if (_.isEmpty(template)) {
                template = " ({0})";
            }
            if (Common.Utils.isMac) {
                if (_.isFunction(hookFn)) {
                    string = hookFn.call(this, string);
                }
                return Common.Utils.String.format(template, string.replace(/\+(?=\S)/g, "").replace(/Ctrl|ctrl/g, "⌘").replace(/Alt|alt/g, "⌥").replace(/Shift|shift/g, "⇧"));
            }
            return Common.Utils.String.format(template, string);
        }
    };
})();
Common.Utils.isBrowserSupported = function () {
    return ! ((Common.Utils.ieVersion != 0 && Common.Utils.ieVersion < 9) || (Common.Utils.safariVersion != 0 && Common.Utils.safariVersion < 5) || (Common.Utils.firefoxVersion != 0 && Common.Utils.firefoxVersion < 4) || (Common.Utils.chromeVersion != 0 && Common.Utils.chromeVersion < 7) || (Common.Utils.operaVersion != 0 && Common.Utils.operaVersion < 10.5));
};
Common.Utils.showBrowserRestriction = function () {
    var editor = (window.DE ? "Document" : window.SSE ? "Spreadsheet" : window.PE ? "Presentation" : "that");
    var newDiv = document.createElement("div");
    newDiv.innerHTML = '<div class="application-error-panel">' + '<div class="application-error-message-block">' + '<div class="application-error-message-inner">' + '<div class="application-error-message-title">Your browser is not supported.</div>' + '<div class="application-error-message-text">Sorry, ' + editor + " Editor is currently only supported in the latest versions of the Chrome, Firefox, Safari or Internet Explorer web browsers.</div>" + "</div>" + "</div>" + '<div class="application-error-message-auxiliary"></div>' + "</div>";
    document.body.appendChild(newDiv);
    $("#loading-mask").hide().remove();
    $("#viewport").hide().remove();
};
String.prototype.strongMatch = function (regExp) {
    if (regExp && regExp instanceof RegExp) {
        var arr = this.toString().match(regExp);
        return !! (arr && arr.length > 0 && arr[0].length == this.length);
    }
    return false;
};