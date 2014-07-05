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
 (function (window, undefined) {
    if (!window["Asc"]) {
        window["Asc"] = {};
    }
    var prot;
    function asc_CCellFlag(m, s, w, t, l) {
        this.merge = !!m;
        this.shrinkToFit = !!s;
        this.wrapText = !!w;
        this.selectionType = t;
        this.lockText = !!l;
    }
    asc_CCellFlag.prototype = {
        asc_getMerge: function () {
            return this.merge;
        },
        asc_getShrinkToFit: function () {
            return this.shrinkToFit;
        },
        asc_getWrapText: function () {
            return this.wrapText;
        },
        asc_getSelectionType: function () {
            return this.selectionType;
        },
        asc_getLockText: function () {
            return this.lockText;
        }
    };
    window["Asc"].asc_CCellFlag = window["Asc"]["asc_CCellFlag"] = asc_CCellFlag;
    prot = asc_CCellFlag.prototype;
    prot["asc_getMerge"] = prot.asc_getMerge;
    prot["asc_getShrinkToFit"] = prot.asc_getShrinkToFit;
    prot["asc_getWrapText"] = prot.asc_getWrapText;
    prot["asc_getSelectionType"] = prot.asc_getSelectionType;
    prot["asc_getLockText"] = prot.asc_getLockText;
    function asc_CFont(name, size, color, b, i, u, s, sub, sup) {
        this.name = name !== undefined ? name : "Arial";
        this.size = size !== undefined ? size : 10;
        this.color = color !== undefined ? color : null;
        this.bold = !!b;
        this.italic = !!i;
        this.underline = !!u;
        this.strikeout = !!s;
        this.subscript = !!sub;
        this.superscript = !!sup;
    }
    asc_CFont.prototype = {
        asc_getName: function () {
            return this.name;
        },
        asc_getSize: function () {
            return this.size;
        },
        asc_getBold: function () {
            return this.bold;
        },
        asc_getItalic: function () {
            return this.italic;
        },
        asc_getUnderline: function () {
            return this.underline;
        },
        asc_getStrikeout: function () {
            return this.strikeout;
        },
        asc_getSubscript: function () {
            return this.subscript;
        },
        asc_getSuperscript: function () {
            return this.superscript;
        },
        asc_getColor: function () {
            return this.color;
        }
    };
    window["Asc"].asc_CFont = window["Asc"]["asc_CFont"] = asc_CFont;
    prot = asc_CFont.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getSize"] = prot.asc_getSize;
    prot["asc_getBold"] = prot.asc_getBold;
    prot["asc_getItalic"] = prot.asc_getItalic;
    prot["asc_getUnderline"] = prot.asc_getUnderline;
    prot["asc_getStrikeout"] = prot.asc_getStrikeout;
    prot["asc_getSubscript"] = prot.asc_getSubscript;
    prot["asc_getSuperscript"] = prot.asc_getSuperscript;
    prot["asc_getColor"] = prot.asc_getColor;
    function asc_CFill(color) {
        this.color = color !== undefined ? color : null;
    }
    asc_CFill.prototype = {
        asc_getColor: function () {
            return this.color;
        }
    };
    window["Asc"].asc_CFill = window["Asc"]["asc_CFill"] = asc_CFill;
    prot = asc_CFill.prototype;
    prot["asc_getColor"] = prot.asc_getColor;
    function asc_CBorder(style, color) {
        if (typeof style === "string") {
            switch (style) {
            case "thin":
                this.style = c_oAscBorderStyles.Thin;
                break;
            case "medium":
                this.style = c_oAscBorderStyles.Medium;
                break;
            case "thick":
                this.style = c_oAscBorderStyles.Thick;
                break;
            default:
                this.style = c_oAscBorderStyles.None;
                break;
            }
        } else {
            this.style = style !== undefined ? style : c_oAscBorderStyles.None;
        }
        this.color = color !== undefined ? color : null;
    }
    asc_CBorder.prototype = {
        asc_getStyle: function () {
            return this.style;
        },
        asc_getColor: function () {
            return this.color;
        }
    };
    window["Asc"].asc_CBorder = window["Asc"]["asc_CBorder"] = asc_CBorder;
    prot = asc_CBorder.prototype;
    prot["asc_getStyle"] = prot.asc_getStyle;
    prot["asc_getColor"] = prot.asc_getColor;
    function asc_CBorders() {
        this.left = null;
        this.top = null;
        this.right = null;
        this.bottom = null;
        this.diagDown = null;
        this.diagUp = null;
    }
    asc_CBorders.prototype = {
        asc_getLeft: function () {
            return this.left;
        },
        asc_getTop: function () {
            return this.top;
        },
        asc_getRight: function () {
            return this.right;
        },
        asc_getBottom: function () {
            return this.bottom;
        },
        asc_getDiagDown: function () {
            return this.diagDown;
        },
        asc_getDiagUp: function () {
            return this.diagUp;
        }
    };
    window["Asc"].asc_CBorders = window["Asc"]["asc_CBorders"] = asc_CBorders;
    prot = asc_CBorders.prototype;
    prot["asc_getLeft"] = prot.asc_getLeft;
    prot["asc_getTop"] = prot.asc_getTop;
    prot["asc_getRight"] = prot.asc_getRight;
    prot["asc_getBottom"] = prot.asc_getBottom;
    prot["asc_getDiagDown"] = prot.asc_getDiagDown;
    prot["asc_getDiagUp"] = prot.asc_getDiagUp;
    function asc_CCellInfo() {
        this.name = null;
        this.formula = "";
        this.text = "";
        this.halign = "left";
        this.valign = "top";
        this.flags = null;
        this.font = null;
        this.fill = null;
        this.border = null;
        this.innertext = null;
        this.numFormat = null;
        this.hyperlink = null;
        this.comments = [];
        this.isLocked = false;
        this.isFormatTable = false;
        this.styleName = null;
        this.numFormatType = null;
        this.angle = null;
    }
    asc_CCellInfo.prototype = {
        asc_getName: function () {
            return this.name;
        },
        asc_getFormula: function () {
            return this.formula;
        },
        asc_getText: function () {
            return this.text;
        },
        asc_getHorAlign: function () {
            return this.halign;
        },
        asc_getVertAlign: function () {
            return this.valign;
        },
        asc_getFlags: function () {
            return this.flags;
        },
        asc_getFont: function () {
            return this.font;
        },
        asc_getFill: function () {
            return this.fill;
        },
        asc_getBorders: function () {
            return this.border;
        },
        asc_getInnerText: function () {
            return this.innertext;
        },
        asc_getNumFormat: function () {
            return this.numFormat;
        },
        asc_getHyperlink: function () {
            return this.hyperlink;
        },
        asc_getComments: function () {
            return this.comments;
        },
        asc_getLocked: function () {
            return this.isLocked;
        },
        asc_getIsFormatTable: function () {
            return this.isFormatTable;
        },
        asc_getStyleName: function () {
            return this.styleName;
        },
        asc_getNumFormatType: function () {
            return this.numFormatType;
        },
        asc_getAngle: function () {
            return this.angle;
        }
    };
    window["Asc"].asc_CCellInfo = window["Asc"]["asc_CCellInfo"] = asc_CCellInfo;
    prot = asc_CCellInfo.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getFormula"] = prot.asc_getFormula;
    prot["asc_getText"] = prot.asc_getText;
    prot["asc_getHorAlign"] = prot.asc_getHorAlign;
    prot["asc_getVertAlign"] = prot.asc_getVertAlign;
    prot["asc_getFlags"] = prot.asc_getFlags;
    prot["asc_getFont"] = prot.asc_getFont;
    prot["asc_getFill"] = prot.asc_getFill;
    prot["asc_getBorders"] = prot.asc_getBorders;
    prot["asc_getInnerText"] = prot.asc_getInnerText;
    prot["asc_getNumFormat"] = prot.asc_getNumFormat;
    prot["asc_getHyperlink"] = prot.asc_getHyperlink;
    prot["asc_getComments"] = prot.asc_getComments;
    prot["asc_getLocked"] = prot.asc_getLocked;
    prot["asc_getIsFormatTable"] = prot.asc_getIsFormatTable;
    prot["asc_getStyleName"] = prot.asc_getStyleName;
    prot["asc_getNumFormatType"] = prot.asc_getNumFormatType;
    prot["asc_getAngle"] = prot.asc_getAngle;
    function asc_CCellRect(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    asc_CCellRect.prototype = {
        asc_getX: function () {
            return this._x;
        },
        asc_getY: function () {
            return this._y;
        },
        asc_getWidth: function () {
            return this._width;
        },
        asc_getHeight: function () {
            return this._height;
        }
    };
    window["Asc"].asc_CCellRect = asc_CCellRect;
    prot = asc_CCellRect.prototype;
    prot["asc_getX"] = prot.asc_getX;
    prot["asc_getY"] = prot.asc_getY;
    prot["asc_getWidth"] = prot.asc_getWidth;
    prot["asc_getHeight"] = prot.asc_getHeight;
})(window);