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
 var g_sMainServiceLocalUrl = "/CanvasService.ashx";
var g_sResourceServiceLocalUrl = "/ResourceService.ashx?path=";
var g_sUploadServiceLocalUrl = "/UploadService.ashx";
var g_sSpellCheckServiceLocalUrl = "/SpellChecker.ashx";
var g_sTrackingServiceLocalUrl = "/TrackingService.ashx";
var g_nMaxJsonLength = 2097152;
var g_nMaxJsonLengthChecked = g_nMaxJsonLength / 1000;
function fSortAscending(a, b) {
    return a - b;
}
function fSortDescending(a, b) {
    return b - a;
}
var c_oEditorId = {
    Word: 0,
    Speadsheet: 1,
    Presentation: 2
};
var PostMessageType = {
    UploadImage: 0,
    ExtensionExist: 1
};
var c_oAscServerError = {
    NoError: 0,
    Unknown: -1,
    ReadRequestStream: -3,
    TaskQueue: -20,
    TaskResult: -40,
    Storage: -60,
    StorageFileNoFound: -61,
    StorageRead: -62,
    StorageWrite: -63,
    StorageRemoveDir: -64,
    StorageCreateDir: -65,
    StorageGetInfo: -66,
    Convert: -80,
    ConvertDownload: -81,
    ConvertUnknownFormat: -82,
    ConvertTimeout: -83,
    ConvertReadFile: -84,
    ConvertMS_OFFCRYPTO: -85,
    Upload: -100,
    UploadContentLength: -101,
    UploadExtension: -102,
    UploadCountFiles: -103,
    VKey: -120,
    VKeyEncrypt: -121,
    VKeyKeyExpire: -122,
    VKeyUserCountExceed: -123
};
var c_oAscImageUploadProp = {
    MaxFileSize: 25000000,
    SupportedFormats: ["jpg", "jpeg", "jpe", "png", "gif", "bmp"]
};
function ValidateUploadImage(files) {
    var nRes = c_oAscServerError.NoError;
    if (1 === files.length) {
        var file = files[0];
        var sName = file.fileName || file.name;
        if (sName) {
            var bSupported = false;
            var nIndex = sName.lastIndexOf(".");
            if (-1 != nIndex) {
                var ext = sName.substring(nIndex + 1).toLowerCase();
                for (var i = 0, length = c_oAscImageUploadProp.SupportedFormats.length; i < length; i++) {
                    if (c_oAscImageUploadProp.SupportedFormats[i] == ext) {
                        bSupported = true;
                        break;
                    }
                }
            }
            if (false == bSupported) {
                nRes = c_oAscServerError.UploadExtension;
            }
        }
        if (c_oAscError.ID.No == nRes) {
            var nSize = file.fileSize || file.size;
            if (nSize && c_oAscImageUploadProp.MaxFileSize < nSize) {
                nRes = c_oAscServerError.UploadContentLength;
            }
        }
    } else {
        nRes = c_oAscServerError.UploadCountFiles;
    }
    return nRes;
}
function CanDropFiles(event) {
    var bRes = false;
    if (event.dataTransfer.types) {
        for (var i = 0, length = event.dataTransfer.types.length; i < length; ++i) {
            var type = event.dataTransfer.types[i];
            if (type == "Files") {
                if (event.dataTransfer.items) {
                    var item = event.dataTransfer.items[0];
                    for (var j = 0, length2 = c_oAscImageUploadProp.SupportedFormats.length; j < length2; j++) {
                        if (item.type && -1 != item.type.indexOf(c_oAscImageUploadProp.SupportedFormats[j])) {
                            bRes = true;
                            break;
                        }
                    }
                } else {
                    bRes = true;
                }
                break;
            }
        }
    }
    return bRes;
}
function GetUploadIFrame() {
    var sIFrameName = "apiImageUpload";
    var oImageUploader = document.getElementById(sIFrameName);
    if (!oImageUploader) {
        var frame = document.createElement("iframe");
        frame.name = sIFrameName;
        frame.id = sIFrameName;
        frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");
        document.body.appendChild(frame);
    }
    return window.frames[sIFrameName];
}
var rx_operators = new RegExp("^ *[-+*/^&%<=>:] *"),
rx_LG = new RegExp("^ *[<=>]+ *"),
rx_Lt = new RegExp("^ *< *"),
rx_Le = new RegExp("^ *<= *"),
rx_Gt = new RegExp("^ *> *"),
rx_Ge = new RegExp("^ *>= *"),
rx_Ne = new RegExp("^ *<> *"),
rg = new RegExp("^([\\w\\d.]+ *)[-+*/^&%<=>:;\\(\\)]"),
rgRange = new RegExp("^\\$?[A-Za-z]+\\$?\\d+:\\$?[A-Za-z]+\\$?\\d+"),
rgCols = new RegExp("^\\$?[A-Za-z]+:\\$?[A-Za-z]+"),
rgRows = new RegExp("^\\$?\\d+:\\$?\\d+"),
rx_ref = new RegExp("^ *(\\$?[A-Za-z]{1,3}\\$?(\\d{1,7}))([-+*/^&%<=>: ;),]|$)"),
rx_refAll = new RegExp("^(\\$?[A-Za-z]+\\$?(\\d+))([-+*/^&%<=>: ;),]|$)"),
rx_ref3D_non_quoted = new XRegExp("^(?<name_from>[\\p{L}\\d.]+)(:(?<name_to>[\\p{L}\\d.]+))?!"),
rx_ref3D_quoted = new XRegExp("^'(?<name_from>(?:''|[^\\[\\]'\\/*?:])*)(?::(?<name_to>(?:''|[^\\[\\]'\\/*?:])*))?'!"),
rx_ref3D = new RegExp("^\\D*[\\D\\d]*\\!"),
rx_before_operators = new RegExp("^ *[,()]"),
rx_space = new RegExp(" "),
rx_number = new RegExp("^[+-]?\\d*(\\d|\\.)\\d*([eE][+-]?\\d+)?"),
rx_LeftParentheses = new RegExp("^ *\\( *"),
rx_RightParentheses = new RegExp("^ *\\)"),
rx_Comma = new RegExp("^ *[,;] *"),
rx_error = new RegExp("^(#NULL!|#DIV\\/0!|#VALUE!|#REF!|#NAME\\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\\/A|#GETTING_DATA)"),
rx_bool = new RegExp("^(TRUE|FALSE|true|false)([-+*/^&%<=>: ;),]|$)"),
rx_string = new RegExp('^"((""|[^"])*)"'),
rx_name = new XRegExp("^(?<name>\\w[\\w\\d.]*)([-+*/^&%<=>: ;),]|$)"),
rx_test_ws_name = new XRegExp("^[\\]_\\[\\p{L}\\d.]*$"),
rx_LeftBrace = new RegExp("^ *\\{ *"),
rx_RightBrace = new RegExp("^ *\\}"),
rx_array = new RegExp('^\\{(([+-]?\\d*(\\d|\\.)\\d*([eE][+-]?\\d+)?)?("((""|[^"])*)")?(#NULL!|#DIV\\/0!|#VALUE!|#REF!|#NAME\\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\\A|#GETTING_DATA|FALSE|TRUE|true|false)?[,;]?)*\\}');
function parserHelper() {}
parserHelper.prototype = {
    _reset: function () {
        delete this.operand_str;
        delete this.pCurrPos;
    },
    isOperator: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var str = formula.substring(start_pos);
        var match = str.match(rx_operators);
        if (match == null || match == undefined) {
            return false;
        } else {
            var mt = str.match(rx_LG);
            if (mt) {
                match = mt;
            }
            this.operand_str = match[0].replace(/\s/g, "", "");
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isFunc: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var frml = formula.substring(start_pos);
        var match = (frml).match(rg);
        if (match != null && match != undefined) {
            if (match.length == 2) {
                this.pCurrPos += match[1].length;
                this.operand_str = match[1];
                return true;
            }
        }
        this.operand_str = null;
        return false;
    },
    isArea: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var subSTR = formula.substring(start_pos);
        var match = subSTR.match(rgRange) || subSTR.match(rgCols) || subSTR.match(rgRows);
        if (match != null || match != undefined) {
            this.pCurrPos += match[0].length;
            this.operand_str = match[0];
            return true;
        }
        this.operand_str = null;
        return false;
    },
    isRef: function (formula, start_pos, allRef) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_ref);
        if (match != null || match != undefined) {
            if (match.length >= 3 && g_oCellAddressUtils.colstrToColnum(match[1].substr(0, (match[1].length - match[2].length))) <= g_oCellAddressUtils.colstrToColnum("XFD") && parseInt(match[2]) <= 1048576) {
                this.pCurrPos += match[0].indexOf(" ") > -1 ? match[0].length - 1 : match[1].length;
                this.operand_str = match[1];
                return true;
            } else {
                if (allRef) {
                    match = (formula.substring(start_pos)).match(rx_refAll);
                    if ((match != null || match != undefined) && match.length >= 3) {
                        this.pCurrPos += match[1].length;
                        this.operand_str = match[1];
                        return true;
                    }
                }
            }
        }
        this.operand_str = null;
        return false;
    },
    is3DRef: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var subSTR = formula.substring(start_pos);
        var match = rx_ref3D_quoted.xexec(subSTR) || rx_ref3D_non_quoted.xexec(subSTR);
        if (match != null || match != undefined) {
            this.pCurrPos += match[0].length;
            this.operand_str = match[1];
            return [true, match["name_from"] ? match["name_from"].replace(/''/g, "'") : null, match["name_to"] ? match["name_to"].replace(/''/g, "'") : null];
        }
        this.operand_str = null;
        return [false, null, null];
    },
    isNextPtg: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var subSTR = formula.substring(start_pos);
        return ((subSTR.match(rx_before_operators) != null || subSTR.match(rx_before_operators) != undefined) && (subSTR.match(rx_space) != null || subSTR.match(rx_space) != undefined));
    },
    isNumber: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_number);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isLeftParentheses: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_LeftParentheses);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0].replace(/\s/, "");
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isRightParentheses: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_RightParentheses);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0].replace(/\s/, "");
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isComma: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_Comma);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isError: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_error);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0];
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isBoolean: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_bool);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[1];
            this.pCurrPos += match[1].length;
            return true;
        }
        return false;
    },
    isString: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_string);
        if (match != null || match != undefined) {
            this.operand_str = match[1].replace('""', '"');
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isName: function (formula, start_pos, wb) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var subSTR = formula.substring(start_pos);
        var match = rx_name.xexec(subSTR);
        if (match != null || match != undefined) {
            var name = match["name"];
            if (name && name.length != 0 && wb.DefinedNames && wb.isDefinedNamesExists(name)) {
                this.pCurrPos += name.length;
                this.operand_str = name;
                return [true, name];
            }
        }
        return [false];
    },
    isArray: function (formula, start_pos, wb) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var subSTR = formula.substring(start_pos);
        var match = (formula.substring(start_pos)).match(rx_array);
        if (match != null || match != undefined) {
            this.operand_str = match[0].substring(1, match[0].length - 1);
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isLeftBrace: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_LeftBrace);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0].replace(/\s/, "");
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    isRightBrace: function (formula, start_pos) {
        if (this instanceof parserHelper) {
            this._reset();
        }
        var match = (formula.substring(start_pos)).match(rx_RightBrace);
        if (match == null || match == undefined) {
            return false;
        } else {
            this.operand_str = match[0].replace(/\s/, "");
            this.pCurrPos += match[0].length;
            return true;
        }
        return false;
    },
    parse3DRef: function (formula) {
        var is3DRefResult = this.is3DRef(formula, 0);
        if (is3DRefResult && true === is3DRefResult[0]) {
            var sheetName = is3DRefResult[1];
            var indexStartRange = formula.indexOf("!") + 1;
            if (this.isArea(formula, indexStartRange)) {
                if (this.operand_str.length == formula.substring(indexStartRange).length) {
                    return {
                        sheet: sheetName,
                        range: this.operand_str
                    };
                } else {
                    return null;
                }
            } else {
                if (this.isRef(formula, indexStartRange)) {
                    if (this.operand_str.length == formula.substring(indexStartRange).length) {
                        return {
                            sheet: sheetName,
                            range: this.operand_str
                        };
                    } else {
                        return null;
                    }
                }
            }
        }
        return null;
    }
};
var parserHelp = new parserHelper();