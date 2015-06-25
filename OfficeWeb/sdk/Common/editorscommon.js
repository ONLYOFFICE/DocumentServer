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
var g_sMainServiceLocalUrl = "/CanvasService.ashx";
var g_sResourceServiceLocalUrl = "/ResourceService.ashx?path=";
var g_sUploadServiceLocalUrl = "/UploadService.ashx";
var g_sSpellCheckServiceLocalUrl = "/SpellChecker.ashx";
var g_sTrackingServiceLocalUrl = "/TrackingService.ashx";
var g_nMaxJsonLength = 2097152;
var g_nMaxJsonLengthChecked = g_nMaxJsonLength / 1000;
function OpenFileResult() {
    this.bSerFormat = false;
    this.data = null;
    this.url = null;
    this.changes = null;
}
function g_fOpenFileCommand(binUrl, changesUrl, Signature, callback) {
    var bError = false,
    oResult = new OpenFileResult(),
    bEndLoadFile = false,
    bEndLoadChanges = false;
    var onEndOpen = function () {
        if (bEndLoadFile && bEndLoadChanges) {
            if (callback) {
                callback(bError, oResult);
            }
        }
    };
    var sFileUrl = g_sResourceServiceLocalUrl + binUrl;
    sFileUrl = sFileUrl.replace(/\\/g, "/");
    asc_ajax({
        url: sFileUrl,
        dataType: "text",
        success: function (result) {
            var url;
            var nIndex = sFileUrl.lastIndexOf("/");
            url = (-1 !== nIndex) ? sFileUrl.substring(0, nIndex + 1) : sFileUrl;
            if (0 < result.length) {
                oResult.bSerFormat = Signature === result.substring(0, Signature.length);
                oResult.data = result;
                oResult.url = url;
            } else {
                bError = true;
            }
            bEndLoadFile = true;
            onEndOpen();
        },
        error: function () {
            bEndLoadFile = true;
            bError = true;
            onEndOpen();
        }
    });
    if (null != changesUrl) {
        require("jsziputils").getBinaryContent(changesUrl, function (err, data) {
            bEndLoadChanges = true;
            if (err) {
                bError = true;
                onEndOpen();
                return;
            }
            var oZipFile = new(require("jszip"))(data);
            oResult.changes = [];
            for (var i in oZipFile.files) {
                oResult.changes.push(JSON.parse(oZipFile.file(i).asText()));
            }
            onEndOpen();
        });
    } else {
        bEndLoadChanges = true;
    }
}
function fSortAscending(a, b) {
    return a - b;
}
function fSortDescending(a, b) {
    return b - a;
}
function isLeadingSurrogateChar(nCharCode) {
    return (nCharCode >= 55296 && nCharCode <= 57343);
}
function decodeSurrogateChar(nLeadingChar, nTrailingChar) {
    if (nLeadingChar < 56320 && nTrailingChar >= 56320 && nTrailingChar <= 57343) {
        return 65536 + ((nLeadingChar & 1023) << 10) | (nTrailingChar & 1023);
    } else {
        return null;
    }
}
function encodeSurrogateChar(nUnicode) {
    if (nUnicode < 65536) {
        return String.fromCharCode(nUnicode);
    } else {
        nUnicode = nUnicode - 65536;
        var nLeadingChar = 55296 | (nUnicode >> 10);
        var nTrailingChar = 56320 | (nUnicode & 1023);
        return String.fromCharCode(nLeadingChar) + String.fromCharCode(nTrailingChar);
    }
}
function convertUnicodeToUTF16(sUnicode) {
    var sUTF16 = "";
    var nLength = sUnicode.length;
    for (var nPos = 0; nPos < nLength; nPos++) {
        sUTF16 += encodeSurrogateChar(sUnicode[nPos]);
    }
    return sUTF16;
}
function convertUTF16toUnicode(sUTF16) {
    var sUnicode = [];
    var nLength = sUTF16.length;
    for (var nPos = 0; nPos < nLength; nPos++) {
        var nUnicode = null;
        var nCharCode = sUTF16.charCodeAt(nPos);
        if (isLeadingSurrogateChar(nCharCode)) {
            if (nPos + 1 < nLength) {
                nPos++;
                var nTrailingChar = sUTF16.charCodeAt(nPos);
                nUnicode = decodeSurrogateChar(nCharCode, nTrailingChar);
            }
        } else {
            nUnicode = nCharCode;
        }
        if (null !== nUnicode) {
            sUnicode.push(nUnicode);
        }
    }
    return sUnicode;
}
function test_ws_name() {
    var self = new XRegExp("[^\\p{L}(\\p{L}\\d._)*]");
    self.regexp_letter = new XRegExp("^\\p{L}[\\p{L}\\d.]*$");
    self.regexp_left_bracket = new XRegExp("\\[");
    self.regexp_right_bracket = new XRegExp("\\]");
    self.regexp_left_brace = new XRegExp("\\{");
    self.regexp_right_brace = new XRegExp("\\}");
    self.regexp_number_mark = new XRegExp("№");
    self.regexp_special_letters = new XRegExp("[\\'\\*\\[\\]\\\\:\\/]");
    self.sheet_name_character_special = new XRegExp("('')|[^\\'\\*\\[\\]\\:/\\?]");
    self.sheet_name_start_character_special = new XRegExp("^[^\\'\\*\\[\\]\\:/\\?]");
    self.sheet_name_end_character_special = new XRegExp("[^\\'\\*\\[\\]\\:/\\?]$");
    self.sheet_name_character = new XRegExp("[-+*/^&%<=>:\\'\\[\\]\\?\\s]");
    self.book_name_character_special = self.book_name_start_character_special = new XRegExp("[^\\'\\*\\[\\]\\:\\?]");
    self.apostrophe = new XRegExp("'");
    self.srt_left_bracket = "[";
    self.srt_right_bracket = "]";
    self.srt_left_brace = "{";
    self.srt_right_brace = "}";
    self.srt_number_letter = "№";
    self.matchRec = function (str, left, right) {
        return XRegExp.matchRecursive(str, "\\" + left, "\\" + right, "g");
    };
    self.test = function (str) {
        var matchRec, splitStr = str,
        res;
        if (this.regexp_left_bracket.test(str) || this.regexp_right_bracket.test(str)) {
            try {
                if (str[0] != "[") {
                    return false;
                }
                matchRec = this.matchRec(str, this.srt_left_bracket, this.srt_right_bracket);
                if (matchRec.length > 1) {
                    return false;
                } else {
                    if (matchRec[0] == "") {
                        return false;
                    } else {
                        if (this.regexp_special_letters.test(matchRec[i])) {
                            return false;
                        }
                    }
                }
                splitStr = str.split("[" + matchRec[0] + "]")[1];
            } catch(e) {
                return false;
            }
        }
        res = this.sheet_name_start_character_special.test(splitStr) && this.sheet_name_end_character_special.test(splitStr) && !XRegExp.test(splitStr, this);
        this.sheet_name_start_character_special.lastIndex = 0;
        this.sheet_name_end_character_special.lastIndex = 0;
        XRegExp.lastIndex = 0;
        this.regexp_special_letters.lastIndex = 0;
        this.regexp_right_bracket.lastIndex = 0;
        this.regexp_left_bracket.lastIndex = 0;
        return res;
    };
    return self;
}
function test_ws_name2() {
    var self = this;
    var str_namedRanges = "[A-Z\u005F\u0080-\u0081\u0083\u0085-\u0087\u0089-\u008A\u008C-\u0091\u0093-\u0094\u0096-\u0097\u0099-\u009A\u009C-\u009F\u00A1-\u00A5\u00A7-\u00A8\u00AA\u00AD\u00AF-\u00BA\u00BC-\u02B8\u02BB-\u02C1\u02C7\u02C9-\u02CB\u02CD\u02D0-\u02D1\u02D8-\u02DB\u02DD\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0972\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E3A\u0E40-\u0E4E\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2010\u2013-\u2016\u2018\u201C-\u201D\u2020-\u2021\u2025-\u2027\u2030\u2032-\u2033\u2035\u203B\u2071\u2074\u207F\u2081-\u2084\u2090-\u2094\u2102-\u2103\u2105\u2107\u2109-\u2113\u2115-\u2116\u2119-\u211D\u2121-\u2122\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2153-\u2154\u215B-\u215E\u2160-\u2188\u2190-\u2199\u21D2\u21D4\u2200\u2202-\u2203\u2207-\u2208\u220B\u220F\u2211\u2215\u221A\u221D-\u2220\u2223\u2225\u2227-\u222C\u222E\u2234-\u2237\u223C-\u223D\u2248\u224C\u2252\u2260-\u2261\u2264-\u2267\u226A-\u226B\u226E-\u226F\u2282-\u2283\u2286-\u2287\u2295\u2299\u22A5\u22BF\u2312\u2460-\u24B5\u24D0-\u24E9\u2500-\u254B\u2550-\u2574\u2581-\u258F\u2592-\u2595\u25A0-\u25A1\u25A3-\u25A9\u25B2-\u25B3\u25B6-\u25B7\u25BC-\u25BD\u25C0-\u25C1\u25C6-\u25C8\u25CB\u25CE-\u25D1\u25E2-\u25E5\u25EF\u2605-\u2606\u2609\u260E-\u260F\u261C\u261E\u2640\u2642\u2660-\u2661\u2663-\u2665\u2667-\u266A\u266C-\u266D\u266F\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3000-\u3003\u3005-\u3017\u301D-\u301F\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u321C\u3220-\u3229\u3231-\u3232\u3239\u3260-\u327B\u327F\u32A3-\u32A8\u3303\u330D\u3314\u3318\u3322-\u3323\u3326-\u3327\u332B\u3336\u333B\u3349-\u334A\u334D\u3351\u3357\u337B-\u337E\u3380-\u3384\u3388-\u33CA\u33CD-\u33D3\u33D5-\u33D6\u33D8\u33DB-\u33DD\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA65F\uA662-\uA66E\uA680-\uA697\uA722-\uA787\uA78B-\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uE000-\uF848\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE30-\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFF01-\uFF5E\uFF61-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6]",
    str_namedSheetsRange = "\u0001-\u0026\u0028-\u0029\u002B-\u002D\u003B-\u003E\u0040\u005E\u0060\u007B-\u007F\u0082\u0084\u008B\u0092\u0095\u0098\u009B\u00A0\u00A6\u00A9\u00AB-\u00AC\u00AE\u00BB\u0378-\u0379\u037E-\u0383\u0387\u038B\u038D\u03A2\u0524-\u0530\u0557-\u0558\u055A-\u0560\u0588-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EF\u05F3-\u05FF\u0604-\u0605\u0609-\u060A\u060C-\u060D\u061B-\u061E\u0620\u065F\u066A-\u066D\u06D4\u0700-\u070E\u074B-\u074C\u07B2-\u07BF\u07F7-\u07F9\u07FB-\u0900\u093A-\u093B\u094E-\u094F\u0955-\u0957\u0964-\u0965\u0970\u0973-\u097A\u0980\u0984\u098D-\u098E\u0991-\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BB\u09C5-\u09C6\u09C9-\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4-\u09E5\u09FB-\u0A00\u0A04\u0A0B-\u0A0E\u0A11-\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A3B\u0A3D\u0A43-\u0A46\u0A49-\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABB\u0AC6\u0ACA\u0ACE-\u0ACF\u0AD1-\u0ADF\u0AE4-\u0AE5\u0AF0\u0AF2-\u0B00\u0B04\u0B0D-\u0B0E\u0B11-\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3B\u0B45-\u0B46\u0B49-\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64-\u0B65\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE-\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64-\u0C65\u0C70-\u0C77\u0C80-\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4-\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D29\u0D3A-\u0D3C\u0D45\u0D49\u0D4E-\u0D56\u0D58-\u0D5F\u0D64-\u0D65\u0D76-\u0D78\u0D80-\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE-\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3E\u0E4F\u0E5A-\u0E80\u0E83\u0E85-\u0E86\u0E89\u0E8B-\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8-\u0EA9\u0EAC\u0EBA\u0EBE-\u0EBF\u0EC5\u0EC7\u0ECE-\u0ECF\u0EDA-\u0EDB\u0EDE-\u0EFF\u0F04-\u0F12\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F8C-\u0F8F\u0F98\u0FBD\u0FCD\u0FD0-\u0FFF\u104A-\u104F\u109A-\u109D\u10C6-\u10CF\u10FB\u10FD-\u10FF\u115A-\u115E\u11A3-\u11A7\u11FA-\u11FF\u1249\u124E-\u124F\u1257\u1259\u125E-\u125F\u1289\u128E-\u128F\u12B1\u12B6-\u12B7\u12BF\u12C1\u12C6-\u12C7\u12D7\u1311\u1316-\u1317\u135B-\u135E\u1361-\u1368\u137D-\u137F\u139A-\u139F\u13F5-\u1400\u166D-\u166E\u1677-\u167F\u169B-\u169F\u16EB-\u16ED\u16F1-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DA\u17DE-\u17DF\u17EA-\u17EF\u17FA-\u180A\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1945\u196E-\u196F\u1975-\u197F\u19AA-\u19AF\u19CA-\u19CF\u19DA-\u19DF\u1A1C-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BAB-\u1BAD\u1BBA-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E-\u1CFF\u1DE7-\u1DFD\u1F16-\u1F17\u1F1E-\u1F1F\u1F46-\u1F47\u1F4E-\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E-\u1F7F\u1FB5\u1FC5\u1FD4-\u1FD5\u1FDC\u1FF0-\u1FF1\u1FF5\u1FFF\u2011-\u2012\u2017\u2019-\u201B\u201E-\u201F\u2022-\u2024\u2031\u2034\u2036-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u2065-\u2069\u2072-\u2073\u207D-\u207E\u208D-\u208F\u2095-\u209F\u20B6-\u20CF\u20F1-\u20FF\u2150-\u2152\u2189-\u218F\u2329-\u232A\u23E8-\u23FF\u2427-\u243F\u244B-\u245F\u269E-\u269F\u26BD-\u26BF\u26C4-\u2700\u2705\u270A-\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u275F-\u2760\u2768-\u2775\u2795-\u2797\u27B0\u27BF\u27C5-\u27C6\u27CB\u27CD-\u27CF\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC-\u29FD\u2B4D-\u2B4F\u2B55-\u2BFF\u2C2F\u2C5F\u2C70\u2C7E-\u2C7F\u2CEB-\u2CFC\u2CFE-\u2CFF\u2D26-\u2D2F\u2D66-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3018-\u301C\u3030\u303D\u3040\u3097-\u3098\u30A0\u3100-\u3104\u312E-\u3130\u318F\u31B8-\u31BF\u31E4-\u31EF\u321F\u3244-\u324F\u32FF\u4DB6-\u4DBF\u9FC4-\u9FFF\uA48D-\uA48F\uA4C7-\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA660-\uA661\uA673-\uA67B\uA67E\uA698-\uA6FF\uA78D-\uA7FA\uA82C-\uA83F\uA874-\uA87F\uA8C5-\uA8CF\uA8DA-\uA8FF\uA92F\uA954-\uA9FF\uAA37-\uAA3F\uAA4E-\uAA4F\uAA5A-\uABFF\uD7A4-\uD7FF\uFA2E-\uFA2F\uFA6B-\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90-\uFD91\uFDC8-\uFDEF\uFDFE-\uFDFF\uFE10-\uFE1F\uFE27-\uFE2F\uFE32\uFE45-\uFE48\uFE53\uFE58\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFEFE\uFF00\uFF5F-\uFF60\uFFBF-\uFFC1\uFFC8-\uFFC9\uFFD0-\uFFD1\uFFD8-\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE-\uFFFF",
    str_operator = ",\\s-+/^&%<=>",
    str_excludeCharts = "'*\\[\\]\\:/?";
    this.regExp_namedRanges = new RegExp(str_namedRanges, "i");
    this.regExp_namedSheetsRange = new RegExp("[" + str_namedSheetsRange + "]", "ig");
    this.regExp_strOperator = new RegExp("[" + str_operator + "]", "ig");
    this.regExp_strExcludeCharts = new RegExp("[" + str_excludeCharts + "]", "ig");
    this.test = function (str) {
        var ch1 = str.substr(0, 1);
        this.regExp_strExcludeCharts.lastIndex = 0;
        this.regExp_namedRanges.lastIndex = 0;
        this.regExp_namedSheetsRange.lastIndex = 0;
        this.regExp_strOperator.lastIndex = 0;
        if (this.regExp_strExcludeCharts.test(str)) {
            return undefined;
        }
        if (!this.regExp_namedRanges.test(ch1)) {
            return false;
        } else {
            if (this.regExp_namedSheetsRange.test(str) || this.regExp_strOperator.test(str)) {
                return false;
            }
            var match = str.match(rx_ref);
            if (match != null) {
                var m0 = match[0],
                m1 = match[1],
                m2 = match[2];
                if (match.length >= 3 && g_oCellAddressUtils.colstrToColnum(m1.substr(0, (m1.length - m2.length))) <= gc_nMaxCol && parseInt(m2) <= gc_nMaxRow) {
                    return false;
                }
            }
            return true;
        }
    };
    return this;
}
var c_oEditorId = {
    Word: 0,
    Spreadsheet: 1,
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
    SupportedFormats: ["jpg", "jpeg", "jpe", "png", "gif", "bmp", "ico"]
};
function ValidateUploadImage(files) {
    var nRes = c_oAscServerError.NoError;
    if (files.length > 0) {
        for (var i = 0, length = files.length; i < length; i++) {
            var file = files[i];
            var sName = file.fileName || file.name;
            if (sName) {
                var bSupported = false;
                var nIndex = sName.lastIndexOf(".");
                if (-1 != nIndex) {
                    var ext = sName.substring(nIndex + 1).toLowerCase();
                    for (var j = 0, length2 = c_oAscImageUploadProp.SupportedFormats.length; j < length2; j++) {
                        if (c_oAscImageUploadProp.SupportedFormats[j] == ext) {
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
            if (c_oAscServerError.NoError != nRes) {
                break;
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
                    for (var j = 0, length2 = event.dataTransfer.items.length; j < length2; j++) {
                        var item = event.dataTransfer.items[j];
                        if (item.type && item.kind && "file" == item.kind.toLowerCase()) {
                            bRes = false;
                            for (var k = 0, length3 = c_oAscImageUploadProp.SupportedFormats.length; k < length3; k++) {
                                if (-1 != item.type.indexOf(c_oAscImageUploadProp.SupportedFormats[k])) {
                                    bRes = true;
                                    break;
                                }
                            }
                            if (false == bRes) {
                                break;
                            }
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
var str_namedRanges = "A-Za-z\u005F\u0080-\u0081\u0083\u0085-\u0087\u0089-\u008A\u008C-\u0091\u0093-\u0094\u0096-\u0097\u0099-\u009A\u009C-\u009F\u00A1-\u00A5\u00A7-\u00A8\u00AA\u00AD\u00AF-\u00BA\u00BC-\u02B8\u02BB-\u02C1\u02C7\u02C9-\u02CB\u02CD\u02D0-\u02D1\u02D8-\u02DB\u02DD\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0972\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E3A\u0E40-\u0E4E\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2010\u2013-\u2016\u2018\u201C-\u201D\u2020-\u2021\u2025-\u2027\u2030\u2032-\u2033\u2035\u203B\u2071\u2074\u207F\u2081-\u2084\u2090-\u2094\u2102-\u2103\u2105\u2107\u2109-\u2113\u2115-\u2116\u2119-\u211D\u2121-\u2122\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2153-\u2154\u215B-\u215E\u2160-\u2188\u2190-\u2199\u21D2\u21D4\u2200\u2202-\u2203\u2207-\u2208\u220B\u220F\u2211\u2215\u221A\u221D-\u2220\u2223\u2225\u2227-\u222C\u222E\u2234-\u2237\u223C-\u223D\u2248\u224C\u2252\u2260-\u2261\u2264-\u2267\u226A-\u226B\u226E-\u226F\u2282-\u2283\u2286-\u2287\u2295\u2299\u22A5\u22BF\u2312\u2460-\u24B5\u24D0-\u24E9\u2500-\u254B\u2550-\u2574\u2581-\u258F\u2592-\u2595\u25A0-\u25A1\u25A3-\u25A9\u25B2-\u25B3\u25B6-\u25B7\u25BC-\u25BD\u25C0-\u25C1\u25C6-\u25C8\u25CB\u25CE-\u25D1\u25E2-\u25E5\u25EF\u2605-\u2606\u2609\u260E-\u260F\u261C\u261E\u2640\u2642\u2660-\u2661\u2663-\u2665\u2667-\u266A\u266C-\u266D\u266F\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3000-\u3003\u3005-\u3017\u301D-\u301F\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u321C\u3220-\u3229\u3231-\u3232\u3239\u3260-\u327B\u327F\u32A3-\u32A8\u3303\u330D\u3314\u3318\u3322-\u3323\u3326-\u3327\u332B\u3336\u333B\u3349-\u334A\u334D\u3351\u3357\u337B-\u337E\u3380-\u3384\u3388-\u33CA\u33CD-\u33D3\u33D5-\u33D6\u33D8\u33DB-\u33DD\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA65F\uA662-\uA66E\uA680-\uA697\uA722-\uA787\uA78B-\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uE000-\uF848\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE30-\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFF01-\uFF5E\uFF61-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6",
str_namedSheetsRange = "\u0001-\u0026\u0028-\u0029\u002B-\u002D\u003B-\u003E\u0040\u005E\u0060\u007B-\u007F\u0082\u0084\u008B\u0092\u0095\u0098\u009B\u00A0\u00A6\u00A9\u00AB-\u00AC\u00AE\u00BB\u0378-\u0379\u037E-\u0383\u0387\u038B\u038D\u03A2\u0524-\u0530\u0557-\u0558\u055A-\u0560\u0588-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EF\u05F3-\u05FF\u0604-\u0605\u0609-\u060A\u060C-\u060D\u061B-\u061E\u0620\u065F\u066A-\u066D\u06D4\u0700-\u070E\u074B-\u074C\u07B2-\u07BF\u07F7-\u07F9\u07FB-\u0900\u093A-\u093B\u094E-\u094F\u0955-\u0957\u0964-\u0965\u0970\u0973-\u097A\u0980\u0984\u098D-\u098E\u0991-\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BB\u09C5-\u09C6\u09C9-\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4-\u09E5\u09FB-\u0A00\u0A04\u0A0B-\u0A0E\u0A11-\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A3B\u0A3D\u0A43-\u0A46\u0A49-\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABB\u0AC6\u0ACA\u0ACE-\u0ACF\u0AD1-\u0ADF\u0AE4-\u0AE5\u0AF0\u0AF2-\u0B00\u0B04\u0B0D-\u0B0E\u0B11-\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3B\u0B45-\u0B46\u0B49-\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64-\u0B65\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE-\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64-\u0C65\u0C70-\u0C77\u0C80-\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4-\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D29\u0D3A-\u0D3C\u0D45\u0D49\u0D4E-\u0D56\u0D58-\u0D5F\u0D64-\u0D65\u0D76-\u0D78\u0D80-\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE-\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3E\u0E4F\u0E5A-\u0E80\u0E83\u0E85-\u0E86\u0E89\u0E8B-\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8-\u0EA9\u0EAC\u0EBA\u0EBE-\u0EBF\u0EC5\u0EC7\u0ECE-\u0ECF\u0EDA-\u0EDB\u0EDE-\u0EFF\u0F04-\u0F12\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F8C-\u0F8F\u0F98\u0FBD\u0FCD\u0FD0-\u0FFF\u104A-\u104F\u109A-\u109D\u10C6-\u10CF\u10FB\u10FD-\u10FF\u115A-\u115E\u11A3-\u11A7\u11FA-\u11FF\u1249\u124E-\u124F\u1257\u1259\u125E-\u125F\u1289\u128E-\u128F\u12B1\u12B6-\u12B7\u12BF\u12C1\u12C6-\u12C7\u12D7\u1311\u1316-\u1317\u135B-\u135E\u1361-\u1368\u137D-\u137F\u139A-\u139F\u13F5-\u1400\u166D-\u166E\u1677-\u167F\u169B-\u169F\u16EB-\u16ED\u16F1-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DA\u17DE-\u17DF\u17EA-\u17EF\u17FA-\u180A\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1945\u196E-\u196F\u1975-\u197F\u19AA-\u19AF\u19CA-\u19CF\u19DA-\u19DF\u1A1C-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BAB-\u1BAD\u1BBA-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E-\u1CFF\u1DE7-\u1DFD\u1F16-\u1F17\u1F1E-\u1F1F\u1F46-\u1F47\u1F4E-\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E-\u1F7F\u1FB5\u1FC5\u1FD4-\u1FD5\u1FDC\u1FF0-\u1FF1\u1FF5\u1FFF\u2011-\u2012\u2017\u2019-\u201B\u201E-\u201F\u2022-\u2024\u2031\u2034\u2036-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u2065-\u2069\u2072-\u2073\u207D-\u207E\u208D-\u208F\u2095-\u209F\u20B6-\u20CF\u20F1-\u20FF\u2150-\u2152\u2189-\u218F\u2329-\u232A\u23E8-\u23FF\u2427-\u243F\u244B-\u245F\u269E-\u269F\u26BD-\u26BF\u26C4-\u2700\u2705\u270A-\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u275F-\u2760\u2768-\u2775\u2795-\u2797\u27B0\u27BF\u27C5-\u27C6\u27CB\u27CD-\u27CF\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC-\u29FD\u2B4D-\u2B4F\u2B55-\u2BFF\u2C2F\u2C5F\u2C70\u2C7E-\u2C7F\u2CEB-\u2CFC\u2CFE-\u2CFF\u2D26-\u2D2F\u2D66-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3018-\u301C\u3030\u303D\u3040\u3097-\u3098\u30A0\u3100-\u3104\u312E-\u3130\u318F\u31B8-\u31BF\u31E4-\u31EF\u321F\u3244-\u324F\u32FF\u4DB6-\u4DBF\u9FC4-\u9FFF\uA48D-\uA48F\uA4C7-\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA660-\uA661\uA673-\uA67B\uA67E\uA698-\uA6FF\uA78D-\uA7FA\uA82C-\uA83F\uA874-\uA87F\uA8C5-\uA8CF\uA8DA-\uA8FF\uA92F\uA954-\uA9FF\uAA37-\uAA3F\uAA4E-\uAA4F\uAA5A-\uABFF\uD7A4-\uD7FF\uFA2E-\uFA2F\uFA6B-\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90-\uFD91\uFDC8-\uFDEF\uFDFE-\uFDFF\uFE10-\uFE1F\uFE27-\uFE2F\uFE32\uFE45-\uFE48\uFE53\uFE58\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFEFE\uFF00\uFF5F-\uFF60\uFFBF-\uFFC1\uFFC8-\uFFC9\uFFD0-\uFFD1\uFFD8-\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE-\uFFFF",
rx_operators = /^ *[-+*\/^&%<=>:] */,
rx_LG = /^ *[<=>]+ */,
rx_Lt = /^ *< */,
rx_Le = /^ *<= */,
rx_Gt = /^ *> */,
rx_Ge = /^ *>= */,
rx_Ne = /^ *<> */,
rg = /^([\w\d.]+ *)[-+*\/^&%<=>:;\(\)]/,
rgRange = /^\$?[A-Za-z]+\$?\d+:\$?[A-Za-z]+\$?\d+/,
rgCols = /^\$?[A-Za-z]+:\$?[A-Za-z]+/,
rgRows = /^\$?\d+:\$?\d+/,
rx_ref = /^ *(\$?[A-Za-z]{1,3}\$?(\d{1,7}))([-+*\/^&%<=>: ;),]|$)/,
rx_refAll = /^(\$?[A-Za-z]+\$?(\d+))([-+*\/^&%<=>: ;),]|$)/,
rx_ref3D_non_quoted = new XRegExp("^(?<name_from>" + "[" + str_namedRanges + "]" + "[" + str_namedRanges + "\\d.]+)(:(?<name_to>" + "[" + str_namedRanges + "]" + "[" + str_namedRanges + "\\d.]+))?!", "i"),
rx_ref3D_quoted = new XRegExp("^'(?<name_from>(?:''|[^\\[\\]'\\/*?:])*)(?::(?<name_to>(?:''|[^\\[\\]'\\/*?:])*))?'!"),
rx_ref3D = new XRegExp("^(?<name_from>[^:]+)(:(?<name_to>[^:]+))?!"),
rx_before_operators = /^ *[,()]/,
rx_number = /^ *[+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?/,
rx_LeftParentheses = /^ *\( */,
rx_RightParentheses = /^ *\)/,
rx_Comma = /^ *[,;] */,
rx_error = /^(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA)/i,
rx_bool = /^(TRUE|FALSE)([-+*\/^&%<=>: ;),]|$)/i,
rx_string = /^\"((\"\"|[^\"])*)\"/,
rx_test_ws_name = new test_ws_name2(),
rx_LeftBrace = /^ *\{ */,
rx_RightBrace = /^ *\}/,
rx_array = /^\{(([+-]?\d*(\d|\.)\d*([eE][+-]?\d+)?)?(\"((\"\"|[^\"])*)\")?(#NULL!|#DIV\/0!|#VALUE!|#REF!|#NAME\?|#NUM!|#UNSUPPORTED_FUNCTION!|#N\/A|#GETTING_DATA|FALSE|TRUE)?[,;]?)*\}/i,
rx_space_g = /\s/g,
rx_space = /\s/,
rg_str_allLang = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u08A0\u08A2-\u08AC\u08E4-\u08E9\u08F0-\u08FE\u0900-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D60-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA697\uA69F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8F2-\uA8F7\uA8FB\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA80-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
rg_validBINNumber = /^[01]{1,10}$/,
rg_validDEC2BINNumber = /^-?[0-9]{1,3}$/,
rg_validDEC2OCTNumber = /^-?[0-9]{1,9}$/,
rg_validDEC2HEXNumber = /^-?[0-9]{1,12}$/,
rg_validHEXNumber = /^[0-9A-F]{1,10}$/i,
rg_validOCTNumber = /^[0-7]{1,10}$/,
rg_complex_number = new XRegExp("^(?<real>[-+]?(?:\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?))?(?<img>([-+]?(\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?)?[ij])?)", "g"),
rx_name = new XRegExp("^(?<name>" + "[" + str_namedRanges + "]" + "[" + str_namedRanges + "\\d.]*)([-+*\\/^&%<=>: ;),]|$)");
function parserHelper() {
    this.operand_str = null;
    this.pCurrPos = null;
}
parserHelper.prototype._reset = function () {
    this.operand_str = null;
    this.pCurrPos = null;
};
parserHelper.prototype.isOperator = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var str = formula.substring(start_pos);
    var match = str.match(rx_operators);
    if (match != null) {
        var mt = str.match(rx_LG);
        if (mt) {
            match = mt;
        }
        this.operand_str = match[0].replace(rx_space_g, "");
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isFunc = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var frml = formula.substring(start_pos);
    var match = (frml).match(rg);
    if (match != null) {
        if (match.length == 2) {
            this.pCurrPos += match[1].length;
            this.operand_str = match[1];
            return true;
        }
    }
    return false;
};
parserHelper.prototype.isArea = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var subSTR = formula.substring(start_pos);
    var match = subSTR.match(rgRange) || subSTR.match(rgCols) || subSTR.match(rgRows);
    if (match != null) {
        this.pCurrPos += match[0].length;
        this.operand_str = match[0];
        return true;
    }
    return false;
};
parserHelper.prototype.isRef = function (formula, start_pos, allRef) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var substr = formula.substring(start_pos);
    var match = substr.match(rx_ref);
    if (match != null) {
        var m0 = match[0],
        m1 = match[1],
        m2 = match[2];
        if (match.length >= 3 && g_oCellAddressUtils.colstrToColnum(m1.substr(0, (m1.length - m2.length))) <= gc_nMaxCol && parseInt(m2) <= gc_nMaxRow) {
            this.pCurrPos += m0.indexOf(" ") > -1 ? m0.length - 1 : m1.length;
            this.operand_str = m1;
            return true;
        } else {
            if (allRef) {
                match = substr.match(rx_refAll);
                if ((match != null || match != undefined) && match.length >= 3) {
                    var m1 = match[1];
                    this.pCurrPos += m1.length;
                    this.operand_str = m1;
                    return true;
                }
            }
        }
    }
    return false;
};
parserHelper.prototype.is3DRef = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var subSTR = formula.substring(start_pos);
    var match = rx_ref3D_quoted.xexec(subSTR) || rx_ref3D_non_quoted.xexec(subSTR);
    if (match != null) {
        this.pCurrPos += match[0].length;
        this.operand_str = match[1];
        return [true, match["name_from"] ? match["name_from"].replace(/''/g, "'") : null, match["name_to"] ? match["name_to"].replace(/''/g, "'") : null];
    }
    return [false, null, null];
};
parserHelper.prototype.isNextPtg = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var subSTR = formula.substring(start_pos);
    return (subSTR.match(rx_before_operators) != null && subSTR.match(rx_space) != null);
};
parserHelper.prototype.isNumber = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_number);
    if (match != null) {
        this.operand_str = match[0];
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isLeftParentheses = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_LeftParentheses);
    if (match != null) {
        this.operand_str = match[0].replace(rx_space, "");
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isRightParentheses = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_RightParentheses);
    if (match != null) {
        this.operand_str = match[0].replace(rx_space, "");
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isComma = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_Comma);
    if (match != null) {
        this.operand_str = match[0];
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isError = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_error);
    if (match != null) {
        this.operand_str = match[0];
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isBoolean = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_bool);
    if (match != null) {
        this.operand_str = match[1];
        this.pCurrPos += match[1].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isString = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_string);
    if (match != null) {
        this.operand_str = match[1].replace('""', '"');
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isName = function (formula, start_pos, wb, ws) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var subSTR = formula.substring(start_pos);
    var match = rx_name.xexec(subSTR);
    if (match != null) {
        var name = match["name"];
        if (name && name.length != 0 && wb.DefinedNames && wb.isDefinedNamesExists(name, ws ? ws.getId() : null)) {
            this.pCurrPos += name.length;
            this.operand_str = name;
            return [true, name];
        }
        this.operand_str = name;
    }
    return [false];
};
parserHelper.prototype.isArray = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_array);
    if (match != null) {
        this.operand_str = match[0].substring(1, match[0].length - 1);
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isLeftBrace = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_LeftBrace);
    if (match != null) {
        this.operand_str = match[0].replace(/\s/, "");
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.isRightBrace = function (formula, start_pos) {
    if (this instanceof parserHelper) {
        this._reset();
    }
    var match = (formula.substring(start_pos)).match(rx_RightBrace);
    if (match != null) {
        this.operand_str = match[0].replace(rx_space, "");
        this.pCurrPos += match[0].length;
        return true;
    }
    return false;
};
parserHelper.prototype.parse3DRef = function (formula) {
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
};
parserHelper.prototype.get3DRef = function (sheet, range) {
    sheet = sheet.split(":");
    var wsFrom = sheet[0],
    wsTo = sheet[1] === undefined ? wsFrom : sheet[1];
    if (rx_test_ws_name.test(wsFrom) && rx_test_ws_name.test(wsTo)) {
        return (wsFrom !== wsTo ? wsFrom + ":" + wsTo: wsFrom) + "!" + range;
    } else {
        wsFrom = wsFrom.replace(/'/g, "''");
        wsTo = wsTo.replace(/'/g, "''");
        return "'" + (wsFrom !== wsTo ? wsFrom + ":" + wsTo: wsFrom) + "'!" + range;
    }
};
parserHelper.prototype.getEscapeSheetName = function (sheet) {
    return rx_test_ws_name.test(sheet) ? sheet : "'" + sheet.replace(/'/g, "''") + "'";
};
parserHelper.prototype.checkDataRange = function (model, wb, dialogType, dataRange, fullCheck, isRows, chartType) {
    var sDataRange = dataRange,
    sheetModel;
    if (c_oAscSelectionDialogType.Chart === dialogType) {
        dataRange = parserHelp.parse3DRef(dataRange);
        if (dataRange) {
            sheetModel = model.getWorksheetByName(dataRange.sheet);
        }
        if (null === dataRange || !sheetModel) {
            return c_oAscError.ID.DataRangeError;
        }
        dataRange = Asc.g_oRangeCache.getAscRange(dataRange.range);
    } else {
        dataRange = Asc.g_oRangeCache.getAscRange(dataRange);
    }
    if (null === dataRange) {
        return c_oAscError.ID.DataRangeError;
    }
    if (fullCheck) {
        if (c_oAscSelectionDialogType.Chart === dialogType) {
            var maxSeries = 255;
            var minStockVal = 4;
            var intervalValues, intervalSeries;
            if (isRows) {
                intervalSeries = dataRange.r2 - dataRange.r1 + 1;
                intervalValues = dataRange.c2 - dataRange.c1 + 1;
            } else {
                intervalSeries = dataRange.c2 - dataRange.c1 + 1;
                intervalValues = dataRange.r2 - dataRange.r1 + 1;
            }
            if (c_oAscChartTypeSettings.stock === chartType) {
                var chartSettings = new asc_ChartSettings();
                chartSettings.putType(c_oAscChartTypeSettings.stock);
                chartSettings.putRange(sDataRange);
                chartSettings.putInColumns(!isRows);
                var chartSeries = getChartSeries(sheetModel, chartSettings).series;
                if (minStockVal !== chartSeries.length || !chartSeries[0].Val || !chartSeries[0].Val.NumCache || chartSeries[0].Val.NumCache.length < minStockVal) {
                    return c_oAscError.ID.StockChartError;
                }
            } else {
                if (intervalSeries > maxSeries) {
                    return c_oAscError.ID.MaxDataSeriesError;
                }
            }
        } else {
            if (c_oAscSelectionDialogType.FormatTable === dialogType) {
                if ("error" === wb.getWorksheet().autoFilters._searchFilters(dataRange, false)) {
                    return c_oAscError.ID.AutoFilterDataRangeError;
                }
            }
        }
    }
    return c_oAscError.ID.No;
};
var parserHelp = new parserHelper();
var kCurFormatPainterWord = "";
if (AscBrowser.isIE) {
    kCurFormatPainterWord = "url(../../../sdk/Common/Images/text_copy.cur), pointer";
} else {
    if (AscBrowser.isOpera) {
        kCurFormatPainterWord = "pointer";
    } else {
        kCurFormatPainterWord = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAATCAYAAACdkl3yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJxJREFUeNrslGEOwBAMhVtxM5yauxnColWJzt+9pFkl9vWlBeac4VINYG4h3vueFUeKIHLOjRTsp+pdKaX6QY2jufripobpzRoB0ro6qdW5I+q3qGxowXONI9LACcBBBMYhA/RuFJxA+WnXK1CBJJg0kKMD2cc8hNKe25P9gxSy01VY3pjdhHYgCCG0RYyR5Bphpk8kMofHjh4BBgA9UXIXw7elTAAAAABJRU5ErkJggg==') 2 11, pointer";
    }
} (function (window, undefined) {
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    function extendClass(Child, Parent) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    }
    asc.extendClass = extendClass;
})(window);
function asc_ajax(obj) {
    var url = "",
    type = "GET",
    async = true,
    data = null,
    dataType = "text/xml",
    error = null,
    success = null,
    httpRequest = null,
    contentType = "application/x-www-form-urlencoded",
    init = function (obj) {
        if (typeof obj.url !== "undefined") {
            url = obj.url;
        }
        if (typeof obj.type !== "undefined") {
            type = obj.type;
        }
        if (typeof obj.async !== "undefined") {
            async = obj.async;
        }
        if (typeof obj.data !== "undefined") {
            data = obj.data;
        }
        if (typeof obj.dataType !== "undefined") {
            dataType = obj.dataType;
        }
        if (typeof obj.error !== "undefined") {
            error = obj.error;
        }
        if (typeof obj.success !== "undefined") {
            success = obj.success;
        }
        if (typeof(obj.contentType) !== "undefined") {
            contentType = obj.contentType;
        }
        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
            if (httpRequest.overrideMimeType) {
                httpRequest.overrideMimeType(dataType);
            }
        } else {
            if (window.ActiveXObject) {
                try {
                    httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e) {
                    try {
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e) {}
                }
            }
        }
        httpRequest.onreadystatechange = function () {
            respons(this);
        };
        send();
    },
    send = function () {
        httpRequest.open(type, url, async);
        if (type === "POST") {
            httpRequest.setRequestHeader("Content-Type", contentType);
        }
        httpRequest.send(data);
    },
    respons = function (httpRequest) {
        switch (httpRequest.readyState) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            if (httpRequest.status === 200 || httpRequest.status === 1223) {
                if (typeof success === "function") {
                    success(httpRequest.responseText);
                }
            } else {
                if (typeof error === "function") {
                    error(httpRequest, httpRequest.statusText, httpRequest.status);
                }
            }
            break;
        }
    };
    init(obj);
}