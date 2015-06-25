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
var charA = "A".charCodeAt(0);
var charZ = "Z".charCodeAt(0);
var chara = "a".charCodeAt(0);
var charz = "z".charCodeAt(0);
var char0 = "0".charCodeAt(0);
var char9 = "9".charCodeAt(0);
var charp = "+".charCodeAt(0);
var chars = "/".charCodeAt(0);
function DecodeBase64Char(ch) {
    if (ch >= charA && ch <= charZ) {
        return ch - charA + 0;
    }
    if (ch >= chara && ch <= charz) {
        return ch - chara + 26;
    }
    if (ch >= char0 && ch <= char9) {
        return ch - char0 + 52;
    }
    if (ch == charp) {
        return 62;
    }
    if (ch == chars) {
        return 63;
    }
    return -1;
}
var b64_decode = [];
(function () {
    var i;
    for (i = charA; i <= charZ; i++) {
        b64_decode[i] = i - charA + 0;
    }
    for (i = chara; i <= charz; i++) {
        b64_decode[i] = i - chara + 26;
    }
    for (i = char0; i <= char9; i++) {
        b64_decode[i] = i - char0 + 52;
    }
})();
b64_decode[charp] = 62;
b64_decode[chars] = 63;
function CreateFontData2(szSrc, dstLen) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    if (dstLen === undefined) {
        dstLen = srcLen;
    }
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    var index = 0;
    if (window.chrome) {
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    } else {
        var p = b64_decode;
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    return stream;
}
function CreateFontData3(szSrc) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    var pointer = g_memory.Alloc(srcLen);
    var stream = new FT_Stream(pointer.data, srcLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    var index = 0;
    while (index < srcLen) {
        dstPx[index] = (szSrc.charCodeAt(index) & 255);
        index++;
    }
    return stream;
}
function CreateFontData4(szSrc) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    var index = 0;
    var dst_len = "";
    while (true) {
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0)) {
            break;
        }
        dst_len += String.fromCharCode(_c);
        index++;
    }
    index++;
    var dstLen = parseInt(dst_len);
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    if (window.chrome) {
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    } else {
        var p = b64_decode;
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    return stream;
}
var FD_UNKNOWN_CHARSET = 3;
function FD_FontInfo() {
    this.Name = "";
    this.IndexR = -1;
    this.IndexI = -1;
    this.IndexB = -1;
    this.IndexBI = -1;
}
function FD_FontDictionary() {
    this.FONTS_DICT_ASCII_NAMES_COUNT = 0;
    this.FD_Ascii_Names = [];
    this.FD_Ascii_Names_Offsets = null;
    if (typeof(Int32Array) != "undefined" && !window.opera) {
        this.FD_Ascii_Names_Offsets = new Int32Array(256);
    } else {
        this.FD_Ascii_Names_Offsets = new Array(256);
    }
    for (var i = 0; i < 256; i++) {
        this.FD_Ascii_Names_Offsets[i] = -1;
    }
    this.FONTS_DICT_UNICODE_NAMES_COUNT = 0;
    this.FD_Unicode_Names = [];
    this.FONTS_DICT_ASCII_FONTS_COUNT = 0;
    this.FD_Ascii_Files = [];
    this.FD_Ascii_Font_Like_Names = [["Cambria Math", "Asana Math", "XITS Math", "Latin Modern"], ["OpenSymbol"]];
    this.FD_Ascii_Font_Like_Main = {
        "Cambria Math": 0,
        "Asana Math": 0,
        "XITS Math": 0,
        "Latin Modern": 0,
        "Symbol": 1,
        "Wingdings": 1
    };
    this.ChangeGlyphsMap = {
        "Symbol": {
            Name: "OpenSymbol",
            IsSymbolSrc: true,
            MapSrc: [183, 168],
            MapDst: [57644, 58434]
        },
        "Wingdings": {
            Name: "OpenSymbol",
            IsSymbolSrc: true,
            MapSrc: [118, 216, 167, 252, 113],
            MapDst: [58433, 57951, 58479, 58160, 10065]
        }
    };
    this.MainUnicodeRanges = {
        "48": 3000,
        "49": 3000,
        "50": 3000,
        "55": 3000,
        "59": 3000,
        "28": 3000,
        "13": 3000,
        "63": 3000,
        "67": 3000
    };
}
FD_FontDictionary.prototype = {
    Init: function () {
        var _base64_data = "qwEAAA0AAABBR0EgQXJhYmVzcXVlGAAAAP///////////////xUAAABBR0EgQXJhYmVzcXVlIERlc2t0b3AbAAAA////////////////CQAAAEFnZW5jeSBGQgEAAAD/////AAAAAP////8HAAAAQWhhcm9uaf//////////AwAAAP////8JAAAAQWtoYmFyIE1U/////wQAAAD/////BQAAAAcAAABBbGRoYWJpBgAAAP///////////////wgAAABBbGdlcmlhbgcAAAD///////////////8FAAAAQW1pIFJZAQAA////////////////BwAAAEFuZGFsdXMIAAAA////////////////CwAAAEFuZ3NhbmEgTmV3CQAAAAsAAAAKAAAAEAAAAAoAAABBbmdzYW5hVVBDDAAAAA4AAAANAAAADwAAAAkAAABBcGFyYWppdGEUAAAAFwAAABUAAAAWAAAAEgAAAEFyYWJpYyBUcmFuc3BhcmVudCgAAAD/////JwAAAP////8SAAAAQXJhYmljIFR5cGVzZXR0aW5nGQAAAP///////////////wUAAABBcmlhbBwAAAAfAAAAHQAAAB4AAAALAAAAQXJpYWwgQmxhY2slAAAA////////////////DAAAAEFyaWFsIE5hcnJvdyAAAAAjAAAAIQAAACIAAAAVAAAAQXJpYWwgUm91bmRlZCBNVCBCb2xkJgAAAP///////////////xAAAABBcmlhbCBVbmljb2RlIE1TJAAAAP///////////////wQAAABBcnZvLAAAACsAAAApAAAAKgAAAAgAAABBc3Rvbi1GMS0AAAD///////////////8UAAAAQmFza2VydmlsbGUgT2xkIEZhY2UuAAAA////////////////BgAAAEJhdGFuZy8AAAD///////////////8JAAAAQmF0YW5nQ2hlMAAAAP///////////////woAAABCYXVoYXVzIDkzMwAAAP///////////////wcAAABCZWxsIE1UNAAAADYAAAA1AAAA/////w4AAABCZXJsaW4gU2FucyBGQk4AAAD/////TAAAAP////8TAAAAQmVybGluIFNhbnMgRkIgRGVtaf//////////TQAAAP////8UAAAAQmVybmFyZCBNVCBDb25kZW5zZWQ3AAAA////////////////EgAAAEJpY2toYW0gU2NyaXB0IFByb///////////OAAAAP////8aAAAAQmlja2hhbSBTY3JpcHQgUHJvIFJlZ3VsYXL//////////zgAAAD/////DgAAAEJsYWNrYWRkZXIgSVRDYwEAAP///////////////wkAAABCb2RvbmkgTVRFAAAAQwAAADsAAAA8AAAADwAAAEJvZG9uaSBNVCBCbGFjaz4AAAA9AAAA//////////8TAAAAQm9kb25pIE1UIENvbmRlbnNlZEIAAABBAAAAPwAAAEAAAAAbAAAAQm9kb25pIE1UIFBvc3RlciBDb21wcmVzc2VkRAAAAP///////////////w8AAABCb2xkIEl0YWxpYyBBcnQ6AAAA////////////////DAAAAEJvb2sgQW50aXF1YTkAAAATAAAAEQAAABIAAAARAAAAQm9va21hbiBPbGQgU3R5bGVGAAAASQAAAEcAAABIAAAAEgAAAEJvb2tzaGVsZiBTeW1ib2wgN1kAAAD///////////////8QAAAAQnJhZGxleSBIYW5kIElUQ0oAAAD///////////////8OAAAAQnJpdGFubmljIEJvbGRLAAAA////////////////CAAAAEJyb2Fkd2F5TwAAAP///////////////w0AAABCcm93YWxsaWEgTmV3UAAAAFIAAABRAAAAVwAAAAwAAABCcm93YWxsaWFVUENTAAAAVQAAAFQAAABWAAAADwAAAEJydXNoIFNjcmlwdCBNVP////9YAAAA//////////8HAAAAQ2FsaWJyaVoAAABcAAAAWwAAAF8AAAANAAAAQ2FsaWJyaSBMaWdodF0AAABeAAAA//////////8UAAAAQ2FsaWJyaSBMaWdodCBJdGFsaWP/////XgAAAP//////////DgAAAENhbGlmb3JuaWFuIEZCYgAAAGEAAABgAAAA/////woAAABDYWxpc3RvIE1UYwAAAGYAAABkAAAAZQAAAAcAAABDYW1icmlhZwAAAGoAAABpAAAAawAAAAwAAABDYW1icmlhIE1hdGhoAAAA////////////////BwAAAENhbmRhcmFsAAAAbgAAAG0AAABvAAAACQAAAENhc3RlbGxhcnAAAAD///////////////8HAAAAQ2VudGF1cnIAAAD///////////////8HAAAAQ2VudHVyeXMAAAD///////////////8OAAAAQ2VudHVyeSBHb3RoaWMYAQAAGwEAABkBAAAaAQAAEgAAAENlbnR1cnkgU2Nob29sYm9va3EAAAAmAgAAJAIAACUCAAAHAAAAQ2hpbGxlcnQAAAD///////////////8KAAAAQ29sb25uYSBNVHUAAAD///////////////8NAAAAQ29taWMgU2FucyBNU3YAAAB4AAAAdwAAAHkAAAAIAAAAQ29uc29sYXN6AAAAfAAAAHsAAAB9AAAACgAAAENvbnN0YW50aWF+AAAAgAAAAH8AAACBAAAADAAAAENvb3BlciBCbGFja4IAAAD///////////////8XAAAAQ29wcGVycGxhdGUgR290aGljIEJvbGSDAAAA////////////////GAAAAENvcHBlcnBsYXRlIEdvdGhpYyBMaWdodIQAAAD///////////////8GAAAAQ29yYmVshQAAAIcAAACGAAAAiAAAAAoAAABDb3JkaWEgTmV3iQAAAIsAAACKAAAAkAAAAAkAAABDb3JkaWFVUEOMAAAAjgAAAI0AAACPAAAACwAAAENvdXJpZXIgTmV3kQAAAJQAAACSAAAAkwAAAAYAAABDdXBydW2YAAAAlwAAAJUAAACWAAAACAAAAEN1cmx6IE1UmQAAAP///////////////wgAAABERkthaS1TQmkBAAD///////////////8OAAAARGFuY2luZyBTY3JpcHSbAAAA/////5oAAAD/////CAAAAERhdW5QZW5onAAAAP///////////////wUAAABEYXZpZJ0AAAD/////ngAAAP////8RAAAARGF2aWQgVHJhbnNwYXJlbnSfAAAA////////////////DgAAAERlY29UeXBlIE5hc2towwAAAP///////////////xkAAABEZWNvVHlwZSBOYXNraCBFeHRlbnNpb25zxgAAAP///////////////xYAAABEZWNvVHlwZSBOYXNraCBTcGVjaWFsxAAAAP///////////////xYAAABEZWNvVHlwZSBOYXNraCBTd2FzaGVzxwAAAP///////////////xcAAABEZWNvVHlwZSBOYXNraCBWYXJpYW50c8UAAAD///////////////8QAAAARGVjb1R5cGUgVGh1bHV0aMIAAAD///////////////8LAAAARGVqYVZ1IFNhbnOgAAAArAAAAKEAAACiAAAAFQAAAERlamFWdSBTYW5zIENvbmRlbnNlZKYAAAClAAAAowAAAKQAAAARAAAARGVqYVZ1IFNhbnMgTGlnaHSnAAAA////////////////EAAAAERlamFWdSBTYW5zIE1vbm+rAAAAqgAAAKgAAACpAAAADAAAAERlamFWdSBTZXJpZq0AAAC0AAAArgAAAK8AAAAWAAAARGVqYVZ1IFNlcmlmIENvbmRlbnNlZLMAAACyAAAAsAAAALEAAAALAAAARGlsbGVuaWFVUEN/AgAAfgIAAHwCAAB9AgAACAAAAERpbmdiYXRztQAAAP///////////////wsAAABEaXdhbmkgQmVudLYAAAD///////////////8NAAAARGl3YW5pIExldHRlcrcAAAD///////////////8VAAAARGl3YW5pIE91dGxpbmUgU2hhZGVkyAAAAP///////////////xUAAABEaXdhbmkgU2ltcGxlIE91dGxpbmXKAAAA////////////////FwAAAERpd2FuaSBTaW1wbGUgT3V0bGluZSAyyQAAAP///////////////xUAAABEaXdhbmkgU2ltcGxlIFN0cmlwZWTLAAAA////////////////CQAAAERva0NoYW1wYbgAAAD///////////////8FAAAARG90dW0iAQAA////////////////CAAAAERvdHVtQ2hlIwEAAP///////////////woAAABEcm9pZCBTYW5zvAAAAP////+7AAAA/////w8AAABEcm9pZCBTYW5zIE1vbm+9AAAA////////////////CwAAAERyb2lkIFNlcmlmwQAAAMAAAAC+AAAAvwAAAAYAAABFYnJpbWHMAAAA/////80AAAD/////FAAAAEVkd2FyZGlhbiBTY3JpcHQgSVRDZAEAAP///////////////wgAAABFbGVwaGFudM4AAADPAAAA//////////8MAAAARW5ncmF2ZXJzIE1U0AAAAP///////////////w0AAABFcmFzIEJvbGQgSVRD0QAAAP///////////////w0AAABFcmFzIERlbWkgSVRD0gAAAP///////////////w4AAABFcmFzIExpZ2h0IElUQ9MAAAD///////////////8PAAAARXJhcyBNZWRpdW0gSVRD1AAAAP///////////////xEAAABFc3RyYW5nZWxvIEVkZXNzYdUAAAD///////////////8LAAAARXVjcm9zaWFVUEODAgAAggIAAIACAACBAgAACAAAAEV1cGhlbWlh1gAAAP///////////////wYAAABFeHBvIE1WAQAA////////////////BwAAAEZaU2h1VGnsAAAA////////////////BwAAAEZaWWFvVGntAAAA////////////////CAAAAEZhbmdTb25nPAIAAP///////////////xEAAABGYXJzaSBTaW1wbGUgQm9sZOkAAAD///////////////8UAAAARmFyc2kgU2ltcGxlIE91dGxpbmXqAAAA////////////////DQAAAEZlbGl4IFRpdGxpbmfXAAAA////////////////GAAAAEZpeGVkIE1pcmlhbSBUcmFuc3BhcmVudMIBAAD///////////////8QAAAARmxlbWlzaFNjcmlwdCBCVNgAAAD///////////////8SAAAARm9vdGxpZ2h0IE1UIExpZ2h06wAAAP///////////////wUAAABGb3J0ZdkAAAD///////////////8KAAAARnJhbmtSdWVobOQAAAD///////////////8UAAAARnJhbmtsaW4gR290aGljIEJvb2vaAAAA2wAAAP//////////FAAAAEZyYW5rbGluIEdvdGhpYyBEZW1p3AAAAN4AAAD//////////xkAAABGcmFua2xpbiBHb3RoaWMgRGVtaSBDb25k3QAAAP///////////////xUAAABGcmFua2xpbiBHb3RoaWMgSGVhdnnfAAAA4AAAAP//////////FgAAAEZyYW5rbGluIEdvdGhpYyBNZWRpdW3hAAAA4wAAAP//////////GwAAAEZyYW5rbGluIEdvdGhpYyBNZWRpdW0gQ29uZOIAAAD///////////////8KAAAARnJlZXNpYVVQQ4cCAACGAgAAhAIAAIUCAAAQAAAARnJlZXN0eWxlIFNjcmlwdOYAAAD///////////////8QAAAARnJlbmNoIFNjcmlwdCBNVOgAAAD///////////////8LAAAAR09TVCB0eXBlIEEWAQAA////////////////CwAAAEdPU1QgdHlwZSBCFwEAAP///////////////wgAAABHYWJyaW9sYe4AAAD///////////////8GAAAAR2FkdWdp7wAAAP/////wAAAA/////wgAAABHYXJhbW9uZPIAAAD0AAAA8wAAAP////8HAAAAR2F1dGFtafUAAAD/////9gAAAP////8NAAAAR2VudGl1bSBCYXNpY/oAAAD5AAAA9wAAAPgAAAASAAAAR2VudGl1bSBCb29rIEJhc2lj/gAAAP0AAAD7AAAA/AAAAAcAAABHZW9yZ2lh/wAAAAEBAAAAAQAAAgEAAAQAAABHaWdpBgEAAP///////////////wwAAABHaWxsIFNhbnMgTVQNAQAACgEAAAgBAAAHAQAAFgAAAEdpbGwgU2FucyBNVCBDb25kZW5zZWQJAQAA////////////////HwAAAEdpbGwgU2FucyBNVCBFeHQgQ29uZGVuc2VkIEJvbGQUAQAA////////////////FAAAAEdpbGwgU2FucyBVbHRyYSBCb2xkDAEAAP///////////////x4AAABHaWxsIFNhbnMgVWx0cmEgQm9sZCBDb25kZW5zZWQLAQAA////////////////BQAAAEdpc2hhDgEAAP////8PAQAA/////x0AAABHbG91Y2VzdGVyIE1UIEV4dHJhIENvbmRlbnNlZBMBAAD///////////////8PAAAAR291ZHkgT2xkIFN0eWxlHAEAAB4BAAAdAQAA/////wsAAABHb3VkeSBTdG91dB8BAAD///////////////8FAAAAR3VsaW0gAQAA////////////////CAAAAEd1bGltQ2hlIQEAAP///////////////wcAAABHdW5nc3VoMQAAAP///////////////woAAABHdW5nc3VoQ2hlMgAAAP///////////////w8AAABHdXR0bWFuIEFoYXJvbmnxAAAA////////////////EAAAAEd1dHRtYW4gRHJvZ29saW66AAAA/////7kAAAD/////DQAAAEd1dHRtYW4gRnJhbmsDAQAA/////+UAAAD/////DQAAAEd1dHRtYW4gRnJuZXfnAAAA////////////////DAAAAEd1dHRtYW4gSGFpbQQBAAD///////////////8WAAAAR3V0dG1hbiBIYWltLUNvbmRlbnNlZAUBAAD///////////////8OAAAAR3V0dG1hbiBIYXR6dml2AgAA/////3UCAAD/////CwAAAEd1dHRtYW4gS2F2EgEAAP////8QAQAA/////xEAAABHdXR0bWFuIEthdi1MaWdodBEBAAD///////////////8NAAAAR3V0dG1hbiBMb2dvMY8BAAD///////////////8PAAAAR3V0dG1hbiBNYW50b3ZhpgEAAP////+kAQAA/////xUAAABHdXR0bWFuIE1hbnRvdmEtRGVjb3KlAQAA////////////////DgAAAEd1dHRtYW4gTWlyeWFtugEAAP////+4AQAA/////w8AAABHdXR0bWFuIE15YW1maXgVAQAA////////////////DQAAAEd1dHRtYW4gUmFzaGkWAgAA/////xcCAAD/////DAAAAEd1dHRtYW4gU3RhbU0CAAD///////////////8NAAAAR3V0dG1hbiBTdGFtMU4CAAD///////////////8NAAAAR3V0dG1hbiBWaWxuYaUCAAD/////pgIAAP////8LAAAAR3V0dG1hbiBZYWQlAQAA////////////////EQAAAEd1dHRtYW4gWWFkLUJydXNoJAEAAP///////////////xEAAABHdXR0bWFuIFlhZC1MaWdodCYBAAD///////////////8PAAAAR3V0dG1hbi1BaGFyb25p//////////8CAAAA/////wwAAABHdXR0bWFuLUFyYW0aAAAA////////////////DwAAAEd1dHRtYW4tQ291ck1pcrkBAAD///////////////8JAAAASEdHb3RoaWNFNwEAAP///////////////wkAAABIR0dvdGhpY006AQAA////////////////CwAAAEhHR3lvc2hvdGFpPQEAAP///////////////w0AAABIR0t5b2thc2hvdGFpQAEAAP///////////////xAAAABIR01hcnVHb3RoaWNNUFJPUwEAAP///////////////wkAAABIR01pbmNob0JDAQAA////////////////CQAAAEhHTWluY2hvRUYBAAD///////////////8KAAAASEdQR290aGljRTgBAAD///////////////8KAAAASEdQR290aGljTTsBAAD///////////////8MAAAASEdQR3lvc2hvdGFpPgEAAP///////////////w4AAABIR1BLeW9rYXNob3RhaUEBAAD///////////////8KAAAASEdQTWluY2hvQkQBAAD///////////////8KAAAASEdQTWluY2hvRUcBAAD///////////////8TAAAASEdQU29laUtha3Vnb3RoaWNVQlABAAD///////////////8RAAAASEdQU29laUtha3Vwb3B0YWlKAQAA////////////////EQAAAEhHUFNvZWlQcmVzZW5jZUVCTQEAAP///////////////woAAABIR1NHb3RoaWNFOQEAAP///////////////woAAABIR1NHb3RoaWNNPAEAAP///////////////wwAAABIR1NHeW9zaG90YWk/AQAA////////////////DgAAAEhHU0t5b2thc2hvdGFpQgEAAP///////////////woAAABIR1NNaW5jaG9CRQEAAP///////////////woAAABIR1NNaW5jaG9FSAEAAP///////////////xMAAABIR1NTb2VpS2FrdWdvdGhpY1VCUQEAAP///////////////xEAAABIR1NTb2VpS2FrdXBvcHRhaUsBAAD///////////////8RAAAASEdTU29laVByZXNlbmNlRUJOAQAA////////////////EQAAAEhHU2Vpa2Fpc2hvdGFpUFJPUgEAAP///////////////xIAAABIR1NvZWlLYWt1Z290aGljVUJPAQAA////////////////EAAAAEhHU29laUtha3Vwb3B0YWlJAQAA////////////////EAAAAEhHU29laVByZXNlbmNlRUJMAQAA////////////////DgAAAEhZR290aGljLUV4dHJhKQEAAP///////////////w8AAABIWUdvdGhpYy1NZWRpdW0qAQAA////////////////EAAAAEhZR3JhcGhpYy1NZWRpdW0nAQAA////////////////DQAAAEhZR3VuZ1NvLUJvbGQoAQAA////////////////EQAAAEhZSGVhZExpbmUtTWVkaXVtKwEAAP///////////////xAAAABIWU15ZW9uZ0pvLUV4dHJhLAEAAP///////////////w4AAABIWVBNb2tHYWstQm9sZC4BAAD///////////////8MAAAASFlQb3N0LUxpZ2h0LwEAAP///////////////w0AAABIWVBvc3QtTWVkaXVtMAEAAP///////////////xMAAABIWVNob3J0U2FtdWwtTWVkaXVtMQEAAP///////////////xQAAABIWVNpbk15ZW9uZ0pvLU1lZGl1bS0BAAD///////////////8QAAAASGFldHRlbnNjaHdlaWxlcjQBAAD///////////////8RAAAASGFuV2FuZ01pbmdNZWRpdW2wAgAA////////////////EwAAAEhhcmxvdyBTb2xpZCBJdGFsaWP/////MgEAAP//////////CgAAAEhhcnJpbmd0b24zAQAA////////////////CgAAAEhlYWRsaW5lIFJbAQAA////////////////DwAAAEhpZ2ggVG93ZXIgVGV4dFwBAABdAQAA//////////8GAAAASW1wYWN0XgEAAP///////////////xEAAABJbXByaW50IE1UIFNoYWRvd18BAAD///////////////8OAAAASW5mb3JtYWwgUm9tYW5gAQAA////////////////BwAAAElyaXNVUEOLAgAAigIAAIgCAACJAgAADAAAAElza29vbGEgUG90YWEBAAD/////YgEAAP////8SAAAASXRhbGljIE91dGxpbmUgQXJ0ZgEAAP///////////////woAAABKYXNtaW5lVVBDjwIAAI4CAACMAgAAjQIAAAgAAABKb2tlcm1hbmcBAAD///////////////8JAAAASnVpY2UgSVRDaAEAAP///////////////wUAAABLYWlUaT4CAAD///////////////8HAAAAS2FsaW5nYWoBAAD/////awEAAP////8HAAAAS2FydGlrYWwBAAD/////bQEAAP////8IAAAAS2htZXIgVUlwAQAA/////3EBAAD/////DAAAAEtvZGNoaWFuZ1VQQ5MCAACSAgAAkAIAAJECAAAGAAAAS29raWxhcgEAAHUBAABzAQAAdAEAAAsAAABLcmlzdGVuIElUQ2UBAAD///////////////8VAAAAS3VmaSBFeHRlbmRlZCBPdXRsaW5lbgEAAP///////////////xMAAABLdWZpIE91dGxpbmUgU2hhZGVkbwEAAP///////////////w8AAABLdW5zdGxlciBTY3JpcHR3AQAA////////////////BgAAAExhbyBVSXgBAAD/////eQEAAP////8FAAAATGF0aGF6AQAA/////3sBAAD/////DwAAAExlZCBJdGFsaWMgRm9udIIBAAD///////////////8KAAAATGVlbGF3YWRlZYMBAAD/////hAEAAP////8KAAAATGV2ZW5pbSBNVJkBAAD/////mgEAAP////8EAAAATGlTdT8CAAD///////////////8HAAAATGlseVVQQ5cCAACWAgAAlAIAAJUCAAAHAAAATG9ic3RlcooBAAD///////////////8LAAAATG9ic3RlciAxLjSKAQAA////////////////CwAAAExvYnN0ZXIgVHdvjgEAAI0BAACLAQAAjAEAAA0AAABMdWNpZGEgQnJpZ2h0fQEAAIABAAB+AQAAfwEAABIAAABMdWNpZGEgQ2FsbGlncmFwaHmBAQAA////////////////DgAAAEx1Y2lkYSBDb25zb2xlmAEAAP///////////////woAAABMdWNpZGEgRmF4hQEAAIgBAACGAQAAhwEAABIAAABMdWNpZGEgSGFuZHdyaXRpbmeJAQAA////////////////CwAAAEx1Y2lkYSBTYW5zkAEAAJMBAACRAQAAkgEAABYAAABMdWNpZGEgU2FucyBUeXBld3JpdGVylAEAAJcBAACVAQAAlgEAABMAAABMdWNpZGEgU2FucyBVbmljb2RlmwEAAP///////////////wkAAABNUyBHb3RoaWPEAQAA////////////////CQAAAE1TIE1pbmNob8sBAAD///////////////8KAAAATVMgT3V0bG9va/MBAAD///////////////8KAAAATVMgUEdvdGhpY8YBAAD///////////////8KAAAATVMgUE1pbmNob8wBAAD///////////////8XAAAATVMgUmVmZXJlbmNlIFNhbnMgU2VyaWYZAgAA////////////////FgAAAE1TIFJlZmVyZW5jZSBTcGVjaWFsdHkaAgAA////////////////DAAAAE1TIFVJIEdvdGhpY8UBAAD///////////////8HAAAATVYgQm9sadcBAAD///////////////8HAAAATWFnaWMgUloBAAD///////////////8HAAAATWFnbmV0b///////////nAEAAP////8LAAAATWFpYW5kcmEgR0SdAQAA////////////////DQAAAE1hbGd1biBHb3RoaWOgAQAA/////6EBAAD/////BgAAAE1hbmdhbKIBAAD/////owEAAP////8HAAAATWFybGV0dKcBAAD///////////////8ZAAAATWF0dXJhIE1UIFNjcmlwdCBDYXBpdGFsc6gBAAD///////////////8GAAAATWVpcnlvqQEAAKoBAACtAQAArgEAAAkAAABNZWlyeW8gVUmrAQAArAEAAK8BAACwAQAAEgAAAE1pY3Jvc29mdCBIaW1hbGF5YVQBAAD///////////////8SAAAATWljcm9zb2Z0IEpoZW5nSGVpxwEAAP/////JAQAA/////xUAAABNaWNyb3NvZnQgSmhlbmdIZWkgVUnIAQAA/////8oBAAD/////FQAAAE1pY3Jvc29mdCBOZXcgVGFpIEx1Zd4BAAD/////3wEAAP////8RAAAATWljcm9zb2Z0IFBoYWdzUGECAgAA/////wMCAAD/////FAAAAE1pY3Jvc29mdCBTYW5zIFNlcmlmsQEAAP///////////////xAAAABNaWNyb3NvZnQgVGFpIExlXgIAAP////9fAgAA/////xAAAABNaWNyb3NvZnQgVWlnaHVyzgEAAP/////NAQAA/////w8AAABNaWNyb3NvZnQgWWFIZWnPAQAA/////9EBAAD/////EgAAAE1pY3Jvc29mdCBZYUhlaSBVSdABAAD/////0gEAAP////8SAAAATWljcm9zb2Z0IFlpIEJhaXRp0wEAAP///////////////wcAAABNaW5nTGlVsgEAAP///////////////wwAAABNaW5nTGlVLUV4dEK1AQAA////////////////DQAAAE1pbmdMaVVfSEtTQ1O0AQAA////////////////EgAAAE1pbmdMaVVfSEtTQ1MtRXh0QrcBAAD///////////////8GAAAATWlyaWFtwAEAAP///////////////wwAAABNaXJpYW0gRml4ZWTBAQAA////////////////EgAAAE1pcmlhbSBUcmFuc3BhcmVudMMBAAD///////////////8HAAAATWlzdHJhbLsBAAD///////////////8NAAAATW9kZXJuIE5vLiAyML0BAAD///////////////8IAAAATW9ldW1UIFJVAQAA////////////////DwAAAE1vbmdvbGlhbiBCYWl0ab4BAAD///////////////8QAAAATW9ub3R5cGUgQ29yc2l2Yf/////UAQAA//////////8RAAAATW9ub3R5cGUgSGFkYXNzYWg1AQAA/////zYBAAD/////DgAAAE1vbm90eXBlIEtvdWZp/////3YBAAD//////////w4AAABNb25vdHlwZSBTb3J0c9UBAAD///////////////8JAAAATW9vbEJvcmFuvwEAAP///////////////wgAAABNdWRpciBNVP/////WAQAA//////////8MAAAATXlhbm1hciBUZXh0vAEAAP///////////////wcAAABOU2ltU3VuRAIAAP///////////////wgAAABOYXJraXNpbd0BAAD///////////////8JAAAATmV3IEd1bGlt2AEAAP///////////////xAAAABOaWFnYXJhIEVuZ3JhdmVk2QEAAP///////////////w0AAABOaWFnYXJhIFNvbGlk2gEAAP///////////////woAAABOaXJtYWxhIFVJ2wEAAP/////cAQAA/////wUAAABOeWFsYeABAAD///////////////8OAAAAT0NSIEEgRXh0ZW5kZWThAQAA////////////////BAAAAE9DUkLiAQAA////////////////DgAAAE9sZCBBbnRpYyBCb2xk4wEAAP///////////////xQAAABPbGQgQW50aWMgRGVjb3JhdGl2ZeQBAAD///////////////8RAAAAT2xkIEFudGljIE91dGxpbmXlAQAA////////////////GAAAAE9sZCBBbnRpYyBPdXRsaW5lIFNoYWRlZOcBAAD///////////////8TAAAAT2xkIEVuZ2xpc2ggVGV4dCBNVOYBAAD///////////////8EAAAAT255eOgBAAD///////////////8JAAAAT3BlbiBTYW5z7wEAAO4BAADpAQAA6gEAABMAAABPcGVuIFNhbnMgQ29uZGVuc2Vk///////////rAQAA/////xkAAABPcGVuIFNhbnMgQ29uZGVuc2VkIExpZ2h07AEAAO0BAAD//////////woAAABPcGVuU3ltYm9s8AEAAP///////////////wYAAABPc3dhbGTyAQAA//////EBAAD/////CAAAAFBNaW5nTGlVswEAAP///////////////w0AAABQTWluZ0xpVS1FeHRCtgEAAP///////////////wwAAABQVCBCb2xkIEFyY2gIAgAA////////////////DgAAAFBUIEJvbGQgQnJva2VuCQIAAP///////////////w0AAABQVCBCb2xkIER1c2t5CgIAAP///////////////w8AAABQVCBCb2xkIEhlYWRpbmcLAgAA////////////////DgAAAFBUIEJvbGQgTWlycm9yDAIAAP///////////////w0AAABQVCBCb2xkIFN0YXJzDQIAAP///////////////wcAAABQVCBTYW5zEgIAABECAAAPAgAAEAIAABMAAABQVCBTZXBhcmF0ZWQgQmFsb29uDgIAAP///////////////xQAAABQVCBTaW1wbGUgQm9sZCBSdWxlZEkCAAD///////////////8IAAAAUGFjaWZpY2/0AQAA////////////////EAAAAFBhbGFjZSBTY3JpcHQgTVT/////+QEAAP//////////EQAAAFBhbGF0aW5vIExpbm90eXBl9QEAAPgBAAD2AQAA9wEAAAcAAABQYXB5cnVz+gEAAP///////////////wkAAABQYXJjaG1lbnT7AQAA////////////////CAAAAFBlcnBldHVhAQIAAP4BAAD9AQAA/AEAABMAAABQZXJwZXR1YSBUaXRsaW5nIE1UAAIAAP//////AQAA/////xQAAABQbGFudGFnZW5ldCBDaGVyb2tlZQQCAAD///////////////8IAAAAUGxheWJpbGwFAgAA////////////////DAAAAFBvb3IgUmljaGFyZAYCAAD///////////////8IAAAAUHJpc3RpbmEHAgAA////////////////CAAAAFB5dW5qaSBSWAEAAP///////////////wUAAABSYWF2aRMCAAD/////FAIAAP////8LAAAAUmFnZSBJdGFsaWMVAgAA////////////////BQAAAFJhdmllGAIAAP///////////////wgAAABSb2Nrd2VsbB0CAAAhAgAAHgIAAB8CAAASAAAAUm9ja3dlbGwgQ29uZGVuc2VkHAIAAP////8bAgAA/////xMAAABSb2Nrd2VsbCBFeHRyYSBCb2xkIAIAAP///////////////wMAAABSb2QiAgAA////////////////DwAAAFJvZCBUcmFuc3BhcmVudCMCAAD///////////////8IAAAAU1RDYWl5dW5PAgAA////////////////CgAAAFNURmFuZ3NvbmdRAgAA////////////////BgAAAFNUSHVwb1ICAAD///////////////8HAAAAU1RLYWl0aVMCAAD///////////////8GAAAAU1RMaXRpVAIAAP///////////////wYAAABTVFNvbmdVAgAA////////////////BwAAAFNUWGloZWlWAgAA////////////////CQAAAFNUWGluZ2thaVcCAAD///////////////8IAAAAU1RYaW53ZWlYAgAA////////////////CwAAAFNUWmhvbmdzb25nWQIAAP///////////////w4AAABTYWtrYWwgTWFqYWxsYZ4BAAD/////nwEAAP////8OAAAAU2NyaXB0IE1UIEJvbGQnAgAA////////////////CwAAAFNlZ29lIFByaW50KAIAAP////8pAgAA/////wwAAABTZWdvZSBTY3JpcHQqAgAA/////ysCAAD/////CAAAAFNlZ29lIFVJLAIAAC4CAAAtAgAAMQIAAA4AAABTZWdvZSBVSSBMaWdodC8CAAAyAgAA//////////8RAAAAU2Vnb2UgVUkgU2VtaWJvbGQzAgAANAIAAP//////////EgAAAFNlZ29lIFVJIFNlbWlsaWdodDACAAA1AgAA//////////8PAAAAU2Vnb2UgVUkgU3ltYm9sNgIAAP///////////////w0AAABTaG9uYXIgQmFuZ2xhNwIAAP////84AgAA/////w8AAABTaG93Y2FyZCBHb3RoaWM5AgAA////////////////BgAAAFNocnV0aToCAAD/////OwIAAP////8GAAAAU2ltSGVpPQIAAP///////////////wYAAABTaW1TdW5DAgAA////////////////CwAAAFNpbVN1bi1FeHRCRQIAAP///////////////xMAAABTaW1wbGUgQm9sZCBKdXQgT3V0SAIAAP///////////////xUAAABTaW1wbGUgSW5kdXN0IE91dGxpbmVKAgAA////////////////FAAAAFNpbXBsZSBJbmR1c3QgU2hhZGVkSwIAAP///////////////xIAAABTaW1wbGUgT3V0bGluZSBQYXRMAgAA////////////////EQAAAFNpbXBsaWZpZWQgQXJhYmljQgIAAP////9AAgAA/////xcAAABTaW1wbGlmaWVkIEFyYWJpYyBGaXhlZEECAAD///////////////8IAAAAU25hcCBJVENHAgAA////////////////BwAAAFN0ZW5jaWxQAgAA////////////////BwAAAFN5bGZhZW5aAgAA////////////////BgAAAFN5bWJvbFsCAAD///////////////8GAAAAVGFob21hXAIAAP////9dAgAA/////wkAAABUYWxsIFBhdWxgAgAA////////////////DwAAAFRlbXB1cyBTYW5zIElUQ2gCAAD///////////////8PAAAAVGltZXMgTmV3IFJvbWFuaQIAAGwCAABqAgAAawIAABIAAABUcmFkaXRpb25hbCBBcmFiaWNuAgAA/////20CAAD/////DAAAAFRyZWJ1Y2hldCBNU28CAAByAgAAcAIAAHECAAAFAAAAVHVuZ2FzAgAA/////3QCAAD/////CQAAAFR3IENlbiBNVGcCAABmAgAAYgIAAGECAAATAAAAVHcgQ2VuIE1UIENvbmRlbnNlZGUCAAD/////YwIAAP////8eAAAAVHcgQ2VuIE1UIENvbmRlbnNlZCBFeHRyYSBCb2xkZAIAAP///////////////wYAAABVYnVudHV6AgAAeQIAAHcCAAB4AgAAEAAAAFVidW50dSBDb25kZW5zZWR7AgAA////////////////EAAAAFVyZHUgVHlwZXNldHRpbmeYAgAA////////////////BgAAAFV0c2FhaJkCAACcAgAAmgIAAJsCAAAEAAAAVmFuaZ0CAAD/////ngIAAP////8HAAAAVmVyZGFuYZ8CAAChAgAAoAIAAKICAAAGAAAAVmlqYXlhowIAAP////+kAgAA/////w4AAABWaW5lciBIYW5kIElUQ6cCAAD///////////////8HAAAAVml2YWxkaf////+oAgAA//////////8PAAAAVmxhZGltaXIgU2NyaXB0qQIAAP///////////////wYAAABWcmluZGGqAgAA/////6sCAAD/////CAAAAFdlYmRpbmdzrAIAAP///////////////woAAABXaWRlIExhdGlufAEAAP///////////////wkAAABXaW5nZGluZ3OtAgAA////////////////CwAAAFdpbmdkaW5ncyAyrgIAAP///////////////wsAAABXaW5nZGluZ3MgM68CAAD///////////////8FAAAAWWV0IFJXAQAA////////////////BwAAAFlvdVl1YW5GAgAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAFQAAAC4AAABJAAAAaAAAAHQAAACIAAAAtwAAAOUAAADrAAAA7gAAAPgAAAAKAQAAOQEAAEABAABNAQAA/////2QBAABsAQAAjwEAAJkBAACdAQAApAEAAP////+pAQAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1sAAAAdAAAASEdQ5Ym16Iux6KeS7726776e7728772v7724VUJQAQAA////////////////HgAAAEhHUOWJteiLseinku++ju++n++9r+++jO++n+S9k0oBAAD///////////////8gAAAASEdQ5Ym16Iux776M776f776a772+776e776d7729RUJNAQAA////////////////DwAAAEhHUOaVmeenkeabuOS9k0EBAAD///////////////8KAAAASEdQ5piO5pydQkQBAAD///////////////8KAAAASEdQ5piO5pydRUcBAAD///////////////8MAAAASEdQ6KGM5pu45L2TPgEAAP///////////////xMAAABIR1Dvvbrvvp7vvbzvva/vvbhFOAEAAP///////////////xMAAABIR1Dvvbrvvp7vvbzvva/vvbhNOwEAAP///////////////x0AAABIR1PlibXoi7Hop5Lvvbrvvp7vvbzvva/vvbhVQlEBAAD///////////////8eAAAASEdT5Ym16Iux6KeS776O776f772v776M776f5L2TSwEAAP///////////////yAAAABIR1PlibXoi7Hvvozvvp/vvprvvb7vvp7vvp3vvb1FQk4BAAD///////////////8PAAAASEdT5pWZ56eR5pu45L2TQgEAAP///////////////woAAABIR1PmmI7mnJ1CRQEAAP///////////////woAAABIR1PmmI7mnJ1FSAEAAP///////////////wwAAABIR1PooYzmm7jkvZM/AQAA////////////////EwAAAEhHU++9uu++nu+9vO+9r++9uEU5AQAA////////////////EwAAAEhHU++9uu++nu+9vO+9r++9uE08AQAA////////////////GQAAAEhH5Li47726776e7728772v7724TS1QUk9TAQAA////////////////HAAAAEhH5Ym16Iux6KeS7726776e7728772v7724VUJPAQAA////////////////HQAAAEhH5Ym16Iux6KeS776O776f772v776M776f5L2TSQEAAP///////////////x8AAABIR+WJteiLse++jO++n+++mu+9vu++nu++ne+9vUVCTAEAAP///////////////w4AAABIR+aVmeenkeabuOS9k0ABAAD///////////////8JAAAASEfmmI7mnJ1CQwEAAP///////////////wkAAABIR+aYjuacnUVGAQAA////////////////EgAAAEhH5q2j5qW35pu45L2TLVBST1IBAAD///////////////8LAAAASEfooYzmm7jkvZM9AQAA////////////////EgAAAEhH7726776e7728772v7724RTcBAAD///////////////8SAAAASEfvvbrvvp7vvbzvva/vvbhNOgEAAP///////////////wsAAABIWeqyrOqzoOuUlSkBAAD///////////////8LAAAASFnqsqzrqoXsobAsAQAA////////////////CQAAAEhZ6raB7IScQigBAAD///////////////8MAAAASFnqt7jrnpjtlL1NJwEAAP///////////////w8AAABIWeuqqeqwge2MjOyehEIuAQAA////////////////CwAAAEhZ7Iug66qF7KGwLQEAAP///////////////w8AAABIWeyWleydgOyDmOusvE0xAQAA////////////////CQAAAEhZ7Je97IScTC8BAAD///////////////8JAAAASFnsl73shJxNMAEAAP///////////////wsAAABIWeykkeqzoOuUlSoBAAD///////////////8PAAAASFntl6Trk5zrnbzsnbhNKwEAAP///////////////wwAAADjg6HjgqTjg6rjgqqpAQAAqgEAAK0BAACuAQAABgAAAOS7v+WuizwCAAD///////////////8MAAAA5Y2O5paH5Lit5a6LWQIAAP///////////////wwAAADljY7mlofku7/lrotRAgAA////////////////DAAAAOWNjuaWh+Wui+S9k1UCAAD///////////////8MAAAA5Y2O5paH5b2p5LqRTwIAAP///////////////wwAAADljY7mlofmlrDprY9YAgAA////////////////DAAAAOWNjuaWh+alt+S9k1MCAAD///////////////8MAAAA5Y2O5paH55Cl54+AUgIAAP///////////////wwAAADljY7mlofnu4bpu5FWAgAA////////////////DAAAAOWNjuaWh+ihjOalt1cCAAD///////////////8MAAAA5Y2O5paH6Zq25LmmVAIAAP///////////////wYAAADlrovkvZNDAgAA////////////////BgAAAOW5vOWchkYCAAD///////////////8PAAAA5b6u6Luf5q2j6buR6auUxwEAAP/////JAQAA/////wwAAADlvq7ova/pm4Xpu5HPAQAA/////9EBAAD/////CQAAAOaWsOWui+S9k0QCAAD///////////////8MAAAA5paw57Sw5piO6auUswEAAP///////////////xEAAADmlrDntLDmmI7pq5QtRXh0QrYBAAD///////////////8MAAAA5pa55q2j5aea5L2T7QAAAP///////////////wwAAADmlrnmraPoiJLkvZPsAAAA////////////////BgAAAOalt+S9kz4CAAD///////////////8JAAAA5qiZ5qW36auUaQEAAP///////////////xUAAADnjovmvKLlrpfkuK3mmI7pq5TnuYGwAgAA////////////////CQAAAOe0sOaYjumrlLIBAAD///////////////8OAAAA57Sw5piO6auULUV4dEK1AQAA////////////////DwAAAOe0sOaYjumrlF9IS1NDU7QBAAD///////////////8UAAAA57Sw5piO6auUX0hLU0NTLUV4dEK3AQAA////////////////BgAAAOmatuS5pj8CAAD///////////////8GAAAA6buR5L2TPQIAAP///////////////wYAAADqtbTrprwgAQAA////////////////CQAAAOq1tOumvOyytCEBAAD///////////////8GAAAA6raB7IScMQAAAP///////////////wkAAADqtoHshJzssrQyAAAA////////////////BgAAAOuPi+ybgCIBAAD///////////////8JAAAA64+L7JuA7LK0IwEAAP///////////////w0AAADrp5HsnYAg6rOg65SVoAEAAP////+hAQAA/////wYAAADrsJTtg5UvAAAA////////////////CQAAAOuwlO2DleyytDAAAAD///////////////8JAAAA7IOI6rW066a82AEAAP///////////////xgAAADtnLTrqLzrkaXqt7ztl6Trk5zrnbzsnbhbAQAA////////////////DwAAAO2ctOuovOunpOyngeyytFoBAAD///////////////8NAAAA7Zy066i866qo7J2MVFUBAAD///////////////8PAAAA7Zy066i87JWE66+47LK0WQEAAP///////////////w8AAADtnLTrqLzsl5HsiqTtj6xWAQAA////////////////DAAAAO2ctOuovOyYm+yytFcBAAD///////////////8PAAAA7Zy066i87Y647KeA7LK0WAEAAP///////////////xMAAADvvK3vvLMg44K044K344OD44KvxAEAAP///////////////w0AAADvvK3vvLMg5piO5pydywEAAP///////////////xYAAADvvK3vvLMg77yw44K044K344OD44KvxgEAAP///////////////xAAAADvvK3vvLMg77yw5piO5pydzAEAAP///////////////7ECAAAJAAAAQWdlbmN5IEZCAAAAAAEAAAAAAAAAAAAAAAILCAQCAgICAgQDAAAAAAAAAAAAAAAAAAAAAQAAIAAAAAC8AgMAAAgBAFUB/AJM/1AAAAAAAAkAAABBZ2VuY3kgRkIAAAAAAAAAAAAAAAAAAAAAAgsFAwICAgICBAMAAAAAAAAAAAAAAAAAAAABAAAgAAAAAJABAwAACAEAPAH8Akz/UAAAAAAADwAAAEd1dHRtYW4tQWhhcm9uaQAAAAABAAAAAAAAAAAAAAACAQcBAQEBAQEBABgAAAAAAEAAAAAAAAAAACAAAAAAAAAAvAIFAAAAAQCMAeoCsP4AAAAAAAAHAAAAQWhhcm9uaQAAAAABAAAAAAAAAAAAAAACAQgDAgEEAwIDAQgAAAAAAAAAAAAAAAAAACAAAAAAACAAvAIFAAAAAQDdAd4C9/4AAAAAAAAJAAAAQWtoYmFyIE1UAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAACQAQUAAAABAJgBEQJi/n0AAAAAAAkAAABBa2hiYXIgTVQAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAALwCBQAAAAEAqQErApH+kwAAAAAABwAAAEFsZGhhYmkAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAG8gAKBLgACQAAAAAAAAAABBAAAAAAAAAJABBQAAAAEA/wGDApz+7gIGAYIBCAAAAEFsZ2VyaWFuAAAAAAAAAAAAAAAAAAAAAAQCBwUECgIGBwIDAAAAAAAAAAAAAAAAAAAAAQAAIAAAAACQAQIAAAABAB0CeAMh/9AAAAAAAAcAAABBbmRhbHVzAAAAAAAAAAAAAAAAAAAAAAICBgMFBAUCAwQDIAAAAAAAgAgAAAAAAAAAQQAA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";
        var _ft_stream = CreateFontData2(_base64_data);
        var _file_stream = new FileStream(_ft_stream.data, _ft_stream.size);
        var i = 0;
        this.FONTS_DICT_ASCII_NAMES_COUNT = _file_stream.GetLong();
        for (i = 0; i < this.FONTS_DICT_ASCII_NAMES_COUNT; i++) {
            var _nameInfo = new FD_FontInfo();
            var _name_len = _file_stream.GetLong();
            _nameInfo.Name = _file_stream.GetString1(_name_len);
            _nameInfo.IndexR = _file_stream.GetLong();
            _nameInfo.IndexI = _file_stream.GetLong();
            _nameInfo.IndexB = _file_stream.GetLong();
            _nameInfo.IndexBI = _file_stream.GetLong();
            this.FD_Ascii_Names.push(_nameInfo);
        }
        for (i = 0; i < 256; i++) {
            this.FD_Ascii_Names_Offsets[i] = _file_stream.GetLong();
        }
        this.FONTS_DICT_UNICODE_NAMES_COUNT = _file_stream.GetLong();
        for (i = 0; i < this.FONTS_DICT_UNICODE_NAMES_COUNT; i++) {
            var _nameInfo = new FD_FontInfo();
            _nameInfo.Name = this.GetString16(_file_stream);
            _nameInfo.IndexR = _file_stream.GetLong();
            _nameInfo.IndexI = _file_stream.GetLong();
            _nameInfo.IndexB = _file_stream.GetLong();
            _nameInfo.IndexBI = _file_stream.GetLong();
            this.FD_Unicode_Names.push(_nameInfo);
        }
        this.FONTS_DICT_ASCII_FONTS_COUNT = _file_stream.GetLong();
        for (i = 0; i < this.FONTS_DICT_ASCII_FONTS_COUNT; i++) {
            var _nameInfo = new CFontSelect();
            _nameInfo.fromStream(_file_stream, false);
            this.FD_Ascii_Files.push(_nameInfo);
        }
    },
    GetString16: function (_file_stream) {
        var _len = _file_stream.GetLong();
        var _ret = this.GetUTF16_fromUTF8(_file_stream.data, _file_stream.cur, _len);
        _file_stream.cur += _len;
        return _ret;
    },
    GetUTF16_fromUnicodeChar: function (code) {
        if (code < 65536) {
            return String.fromCharCode(code);
        } else {
            code -= 65536;
            return String.fromCharCode(55296 | ((code >> 10) & 1023)) + String.fromCharCode(56320 | (code & 1023));
        }
    },
    GetUTF16_fromUTF8: function (pBuffer, start, count) {
        var _res = "";
        var lIndex = start;
        var end = start + count;
        var val = 0;
        while (lIndex < end) {
            var byteMain = pBuffer[lIndex];
            if (0 == (byteMain & 128)) {
                _res += this.GetUTF16_fromUnicodeChar(byteMain);
                ++lIndex;
            } else {
                if (0 == (byteMain & 32)) {
                    val = (((byteMain & 31) << 6) | (pBuffer[lIndex + 1] & 63));
                    _res += this.GetUTF16_fromUnicodeChar(val);
                    lIndex += 2;
                } else {
                    if (0 == (byteMain & 16)) {
                        val = (((byteMain & 15) << 12) | ((pBuffer[lIndex + 1] & 63) << 6) | (pBuffer[lIndex + 2] & 63));
                        _res += this.GetUTF16_fromUnicodeChar(val);
                        lIndex += 3;
                    } else {
                        if (0 == (byteMain & 8)) {
                            val = (((byteMain & 7) << 18) | ((pBuffer[lIndex + 1] & 63) << 12) | ((pBuffer[lIndex + 2] & 63) << 6) | (pBuffer[lIndex + 3] & 63));
                            _res += this.GetUTF16_fromUnicodeChar(val);
                            lIndex += 4;
                        } else {
                            if (0 == (byteMain & 4)) {
                                val = (((byteMain & 3) << 24) | ((pBuffer[lIndex + 1] & 63) << 18) | ((pBuffer[lIndex + 2] & 63) << 12) | ((pBuffer[lIndex + 3] & 63) << 6) | (pBuffer[lIndex + 4] & 63));
                                _res += this.GetUTF16_fromUnicodeChar(val);
                                lIndex += 5;
                            } else {
                                val = (((byteMain & 1) << 30) | ((pBuffer[lIndex + 1] & 63) << 24) | ((pBuffer[lIndex + 2] & 63) << 18) | ((pBuffer[lIndex + 3] & 63) << 12) | ((pBuffer[lIndex + 4] & 63) << 6) | (pBuffer[lIndex + 5] & 63));
                                _res += this.GetUTF16_fromUnicodeChar(val);
                                lIndex += 5;
                            }
                        }
                    }
                }
            }
        }
        return _res;
    },
    CorrectParamsFromDictionary: function (oFormat) {
        if (undefined == oFormat.wsName) {
            return false;
        }
        var nNameLen = oFormat.wsName.length;
        if (nNameLen == 0) {
            return false;
        }
        var bIsAscii = true;
        var i = 0;
        for (i = 0; i < nNameLen; ++i) {
            var _char_code = oFormat.wsName.charCodeAt(i);
            if (_char_code > 255 || _char_code < 0) {
                bIsAscii = false;
                break;
            }
        }
        var pFont = null;
        if (bIsAscii) {
            var nStartIndex = this.FD_Ascii_Names_Offsets[oFormat.wsName.charCodeAt(0)];
            if (-1 != nStartIndex) {
                var nIndex = -1;
                for (i = nStartIndex; i < this.FONTS_DICT_ASCII_NAMES_COUNT; i++) {
                    if (this.FD_Ascii_Names[i].Name == oFormat.wsName) {
                        nIndex = i;
                        break;
                    }
                }
                if (nIndex != -1) {
                    var pRec = this.FD_Ascii_Names[nIndex];
                    var nFontIndex = -1;
                    var nStyle = 0;
                    if (oFormat.bItalic === true) {
                        nStyle |= 1;
                    }
                    if (oFormat.bBold === true) {
                        nStyle |= 2;
                    }
                    switch (nStyle) {
                    case 1:
                        if (pRec.IndexI != -1) {
                            nFontIndex = pRec.IndexI;
                        } else {
                            if (pRec.IndexBI != -1) {
                                nFontIndex = pRec.IndexBI;
                            } else {
                                if (pRec.IndexR != -1) {
                                    nFontIndex = pRec.IndexR;
                                } else {
                                    nFontIndex = pRec.IndexB;
                                }
                            }
                        }
                        break;
                    case 2:
                        if (pRec.IndexB != -1) {
                            nFontIndex = pRec.IndexB;
                        } else {
                            if (pRec.IndexBI != -1) {
                                nFontIndex = pRec.IndexBI;
                            } else {
                                if (pRec.IndexR != -1) {
                                    nFontIndex = pRec.IndexR;
                                } else {
                                    nFontIndex = pRec.IndexI;
                                }
                            }
                        }
                        break;
                    case 3:
                        if (pRec.IndexBI != -1) {
                            nFontIndex = pRec.IndexBI;
                        } else {
                            if (pRec.IndexB != -1) {
                                nFontIndex = pRec.IndexB;
                            } else {
                                if (pRec.IndexI != -1) {
                                    nFontIndex = pRec.IndexI;
                                } else {
                                    nFontIndex = pRec.IndexR;
                                }
                            }
                        }
                        break;
                    case 0:
                        default:
                        if (pRec.IndexR != -1) {
                            nFontIndex = pRec.IndexR;
                        } else {
                            if (pRec.IndexI != -1) {
                                nFontIndex = pRec.IndexI;
                            } else {
                                if (pRec.IndexB != -1) {
                                    nFontIndex = pRec.IndexB;
                                } else {
                                    nFontIndex = pRec.IndexBI;
                                }
                            }
                        }
                        break;
                    }
                    if (nFontIndex != -1) {
                        pFont = this.FD_Ascii_Files[nFontIndex];
                    }
                }
            }
        } else {
            var nIndex = -1;
            for (i = 0; i < this.FONTS_DICT_UNICODE_NAMES_COUNT; i++) {
                if (this.FD_Unicode_Names[i].Name == oFormat.wsName) {
                    nIndex = i;
                    break;
                }
            }
            if (nIndex != -1) {
                var pRec = this.FD_Unicode_Names[nIndex];
                var nFontIndex = -1;
                var nStyle = 0;
                if (oFormat.bItalic === true) {
                    nStyle |= 1;
                }
                if (oFormat.bBold === true) {
                    nStyle |= 2;
                }
                switch (nStyle) {
                case 1:
                    if (pRec.IndexI != -1) {
                        nFontIndex = pRec.IndexI;
                    } else {
                        if (pRec.IndexBI != -1) {
                            nFontIndex = pRec.IndexBI;
                        } else {
                            if (pRec.IndexR != -1) {
                                nFontIndex = pRec.IndexR;
                            } else {
                                nFontIndex = pRec.IndexB;
                            }
                        }
                    }
                    break;
                case 2:
                    if (pRec.IndexB != -1) {
                        nFontIndex = pRec.IndexB;
                    } else {
                        if (pRec.IndexBI != -1) {
                            nFontIndex = pRec.IndexBI;
                        } else {
                            if (pRec.IndexR != -1) {
                                nFontIndex = pRec.IndexR;
                            } else {
                                nFontIndex = pRec.IndexI;
                            }
                        }
                    }
                    break;
                case 3:
                    if (pRec.IndexBI != -1) {
                        nFontIndex = pRec.IndexBI;
                    } else {
                        if (pRec.IndexB != -1) {
                            nFontIndex = pRec.IndexB;
                        } else {
                            if (pRec.IndexI != -1) {
                                nFontIndex = pRec.IndexI;
                            } else {
                                nFontIndex = pRec.IndexR;
                            }
                        }
                    }
                    break;
                case 0:
                    default:
                    if (pRec.IndexR != -1) {
                        nFontIndex = pRec.IndexR;
                    } else {
                        if (pRec.IndexI != -1) {
                            nFontIndex = pRec.IndexI;
                        } else {
                            if (pRec.IndexB != -1) {
                                nFontIndex = pRec.IndexB;
                            } else {
                                nFontIndex = pRec.IndexBI;
                            }
                        }
                    }
                    break;
                }
                if (nFontIndex != -1) {
                    pFont = this.FD_Ascii_Files[nFontIndex];
                }
            }
        }
        if (null == pFont) {
            return false;
        }
        oFormat.wsName = pFont.m_wsFontName;
        oFormat.bFixedWidth = (pFont.m_bIsFixed == 1 ? true : false);
        oFormat.pPanose = pFont.m_aPanose;
        oFormat.ulRange1 = pFont.m_ulUnicodeRange1;
        oFormat.ulRange2 = pFont.m_ulUnicodeRange2;
        oFormat.ulRange3 = pFont.m_ulUnicodeRange3;
        oFormat.ulRange4 = pFont.m_ulUnicodeRange4;
        oFormat.ulCodeRange1 = pFont.m_ulCodePageRange1;
        oFormat.ulCodeRange2 = pFont.m_ulCodePageRange2;
        oFormat.usWeight = pFont.m_usWeigth;
        oFormat.usWidth = pFont.m_usWidth;
        oFormat.shAvgCharWidth = pFont.m_shAvgCharWidth;
        oFormat.shAscent = pFont.m_shAscent;
        oFormat.shDescent = pFont.m_shDescent;
        oFormat.shXHeight = pFont.m_shXHeight;
        oFormat.shCapHeight = pFont.m_shCapHeight;
        return true;
    },
    GetFontIndex: function (oSelect, oList, DefaultIndex, isName0) {
        this.CorrectParamsFromDictionary(oSelect);
        var nMinIndex = 0;
        var nMinPenalty = 0;
        var nDefPenalty = 2147483647;
        var nFontsCount = oList.length;
        for (var nIndex = 0; nIndex < nFontsCount; nIndex++) {
            var nCurPenalty = oList[nIndex].GetPenalty(oSelect, isName0, this.MainUnicodeRanges);
            if (0 == nIndex) {
                nMinIndex = 0;
                nMinPenalty = nCurPenalty;
            } else {
                if (nCurPenalty < nMinPenalty) {
                    nMinIndex = nIndex;
                    nMinPenalty = nCurPenalty;
                }
            }
            if (undefined != DefaultIndex && nIndex == DefaultIndex) {
                nDefPenalty = nCurPenalty;
            }
            if (0 == nCurPenalty) {
                break;
            }
        }
        if (undefined != DefaultIndex && nDefPenalty == nMinPenalty) {
            nMinIndex = DefaultIndex;
        }
        if (undefined == DefaultIndex) {
            return nMinIndex;
        }
        return oList[nMinIndex];
    },
    CheckLikeFonts: function (sFontName, sReqName) {
        var _index = this.FD_Ascii_Font_Like_Main[sReqName];
        if (undefined === _index) {
            return false;
        }
        var _arr = this.FD_Ascii_Font_Like_Names[_index];
        var _len = _arr.length;
        for (var i = 0; i < _len; i++) {
            if (_arr[i] == sFontName) {
                return true;
            }
        }
        return false;
    }
};
function CFontSelectFormat() {
    this.wsName = undefined;
    this.wsAltName = undefined;
    this.wsFamilyClass = undefined;
    this.sFamilyClass = undefined;
    this.bBold = undefined;
    this.bItalic = undefined;
    this.bFixedWidth = undefined;
    this.pPanose = undefined;
    this.ulRange1 = undefined;
    this.ulRange2 = undefined;
    this.ulRange3 = undefined;
    this.ulRange4 = undefined;
    this.ulCodeRange1 = undefined;
    this.ulCodeRange2 = undefined;
    this.usWeight = undefined;
    this.usWidth = undefined;
    this.nFontFormat = undefined;
    this.unCharset = undefined;
    this.shAvgCharWidth = undefined;
    this.shAscent = undefined;
    this.shDescent = undefined;
    this.shLineGap = undefined;
    this.shXHeight = undefined;
    this.shCapHeight = undefined;
}
function CFontSelect() {
    this.m_wsFontName = "";
    this.m_wsFontPath = "";
    this.m_lIndex = 0;
    this.m_bBold = false;
    this.m_bItalic = false;
    this.m_bIsFixed = false;
    this.m_aPanose = null;
    if (typeof(Int8Array) != "undefined" && !window.opera) {
        this.m_aPanose = new Int8Array(10);
    } else {
        this.m_aPanose = new Array(10);
    }
    this.m_ulUnicodeRange1 = 0;
    this.m_ulUnicodeRange2 = 0;
    this.m_ulUnicodeRange3 = 0;
    this.m_ulUnicodeRange4 = 0;
    this.m_ulCodePageRange1 = 0;
    this.m_ulCodePageRange2 = 0;
    this.m_usWeigth = 0;
    this.m_usWidth = 0;
    this.m_sFamilyClass = 0;
    this.m_eFontFormat = 0;
    this.m_shAvgCharWidth = 0;
    this.m_shAscent = 0;
    this.m_shDescent = 0;
    this.m_shLineGap = 0;
    this.m_shXHeight = 0;
    this.m_shCapHeight = 0;
}
CFontSelect.prototype = {
    fromStream: function (fs, bIsDictionary) {
        var _len = fs.GetLong();
        if (bIsDictionary === false) {
            this.m_wsFontName = fs.GetString1(_len);
        } else {
            this.m_wsFontName = fs.GetString(_len >> 1);
        }
        if (bIsDictionary !== false) {
            _len = fs.GetLong();
            this.m_wsFontPath = fs.GetString(_len >> 1);
            if (undefined === window["AscDesktopEditor"]) {
                var _found1 = this.m_wsFontPath.lastIndexOf("/");
                var _found2 = this.m_wsFontPath.lastIndexOf("\\");
                var _found = Math.max(_found1, _found2);
                if (0 <= _found) {
                    this.m_wsFontPath = this.m_wsFontPath.substring(_found + 1);
                }
            } else {
                this.m_wsFontPath = this.m_wsFontPath.replace(/\\\\/g, "\\");
                this.m_wsFontPath = this.m_wsFontPath.replace(/\\/g, "/");
            }
        }
        this.m_lIndex = fs.GetLong();
        this.m_bItalic = (1 == fs.GetLong());
        this.m_bBold = (1 == fs.GetLong());
        this.m_bIsFixed = (1 == fs.GetLong());
        var _panose_len = 10;
        if (bIsDictionary !== false) {
            _panose_len = fs.GetLong();
        }
        for (var i = 0; i < _panose_len; i++) {
            this.m_aPanose[i] = fs.GetUChar();
        }
        this.m_ulUnicodeRange1 = fs.GetULong();
        this.m_ulUnicodeRange2 = fs.GetULong();
        this.m_ulUnicodeRange3 = fs.GetULong();
        this.m_ulUnicodeRange4 = fs.GetULong();
        this.m_ulCodePageRange1 = fs.GetULong();
        this.m_ulCodePageRange2 = fs.GetULong();
        this.m_usWeigth = fs.GetUShort();
        this.m_usWidth = fs.GetUShort();
        this.m_sFamilyClass = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_eFontFormat = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shAvgCharWidth = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shAscent = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shDescent = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shLineGap = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shXHeight = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shCapHeight = FT_Common.UShort_To_Short(fs.GetUShort());
    },
    GetStyle: function () {
        if (this.m_bBold && this.m_bItalic) {
            return 3;
        } else {
            if (this.Bold) {
                return 1;
            } else {
                if (this.m_bItalic) {
                    return 2;
                } else {
                    return 0;
                }
            }
        }
    },
    GetPenalty: function (oSelect, isName0, _main_ranges) {
        var nCurPenalty = 0;
        if (undefined !== oSelect.pPanose) {
            nCurPenalty += this.GetPanosePenalty(oSelect.pPanose);
        }
        if (true) {
            if (undefined !== oSelect.ulRange1 && undefined !== oSelect.ulRange2 && undefined !== oSelect.ulRange3 && undefined !== oSelect.ulRange4 && undefined !== oSelect.ulCodeRange1 && undefined !== oSelect.ulCodeRange2) {
                nCurPenalty += this.GetSigPenalty(oSelect, nCurPenalty >= 1000 ? 50 : 10, 10, _main_ranges);
            }
        }
        var unCharset = FD_UNKNOWN_CHARSET;
        if (undefined !== oSelect.unCharset) {
            unCharset = oSelect.unCharset;
        }
        if (undefined !== oSelect.bFixedWidth) {
            nCurPenalty += this.GetFixedPitchPenalty(oSelect.bFixedWidth);
        }
        var nNamePenalty = 0;
        if (oSelect.wsName !== undefined && oSelect.wsAltName !== undefined) {
            nNamePenalty += Math.min(this.GetFaceNamePenalty(oSelect.wsName), this.GetFaceNamePenalty(oSelect.wsAltName));
        } else {
            if (oSelect.wsName !== undefined) {
                nNamePenalty += this.GetFaceNamePenalty(oSelect.wsName);
            } else {
                if (oSelect.wsAltName !== undefined) {
                    nNamePenalty += this.GetFaceNamePenalty(oSelect.wsAltName);
                }
            }
        }
        if (true === isName0 && 0 == nNamePenalty) {
            return 0;
        }
        nCurPenalty += nNamePenalty;
        if (undefined != oSelect.usWidth) {
            nCurPenalty += this.GetWidthPenalty(oSelect.usWidth);
        }
        if (undefined !== oSelect.usWeight) {
            nCurPenalty += this.GetWeightPenalty(oSelect.usWeight);
        }
        if (undefined !== oSelect.bBold) {
            nCurPenalty += this.GetBoldPenalty(oSelect.bBold);
        }
        if (undefined !== oSelect.bItalic) {
            nCurPenalty += this.GetItalicPenalty(oSelect.bItalic);
        }
        if (undefined !== oSelect.wsFamilyClass) {
            nCurPenalty += this.GetFamilyUnlikelyPenalty(oSelect.wsFamilyClass);
        } else {
            if (undefined !== oSelect.sFamilyClass) {
                nCurPenalty += this.GetFamilyUnlikelyPenalty1(oSelect.sFamilyClass);
            }
        }
        nCurPenalty += this.GetCharsetPenalty(unCharset);
        if (undefined !== oSelect.shAvgCharWidth) {
            nCurPenalty += this.GetAvgWidthPenalty(oSelect.shAvgCharWidth);
        }
        if (undefined !== oSelect.shAscent) {
            nCurPenalty += this.GetAscentPenalty(oSelect.shAscent);
        }
        if (undefined !== oSelect.shDescent) {
            nCurPenalty += this.GetDescentPenalty(oSelect.shDescent);
        }
        if (undefined !== oSelect.shLineGap) {
            nCurPenalty += this.GetLineGapPenalty(oSelect.shLineGap);
        }
        if (undefined !== oSelect.shXHeight) {
            nCurPenalty += this.GetXHeightPenalty(oSelect.shXHeight);
        }
        if (undefined !== oSelect.shCapHeight) {
            nCurPenalty += this.GetCapHeightPenalty(oSelect.shCapHeight);
        }
        return nCurPenalty;
    },
    GetPanosePenalty: function (pReqPanose) {
        var nPenalty = 0;
        for (var nIndex = 0; nIndex < 10; nIndex++) {
            if (this.m_aPanose[nIndex] != pReqPanose[nIndex] && 0 != pReqPanose[nIndex]) {
                var nKoef = Math.abs(this.m_aPanose[nIndex] - pReqPanose[nIndex]);
                switch (nIndex) {
                case 0:
                    nPenalty += 1000 * nKoef;
                    break;
                case 1:
                    nPenalty += 100 * nKoef;
                    break;
                case 2:
                    nPenalty += 100 * nKoef;
                    break;
                case 3:
                    nPenalty += 100 * nKoef;
                    break;
                case 4:
                    nPenalty += 100 * nKoef;
                    break;
                case 5:
                    nPenalty += 100 * nKoef;
                    break;
                case 6:
                    nPenalty += 100 * nKoef;
                    break;
                case 7:
                    nPenalty += 100 * nKoef;
                    break;
                case 8:
                    nPenalty += 100 * nKoef;
                    break;
                case 9:
                    nPenalty += 100 * nKoef;
                    break;
                }
            }
        }
        return nPenalty;
    },
    GetSigPenalty: function (format, dRangeWeight, dRangeWeightSuferflouous, _main_ranges) {
        var dPenalty = 0;
        var arrCandidate = ((typeof(Int8Array) != "undefined" && !window.opera)) ? new Uint8Array(192) : new Array(192);
        var arrRequest = ((typeof(Int8Array) != "undefined" && !window.opera)) ? new Uint8Array(192) : new Array(192);
        for (var i = 0; i < 192; i++) {
            arrCandidate[i] = 0;
            arrRequest[i] = 0;
        }
        var nRangesCount = 0;
        var nAddCount = 0;
        var ulCandRanges = [this.m_ulUnicodeRange1, this.m_ulUnicodeRange2, this.m_ulUnicodeRange3, this.m_ulUnicodeRange4, this.m_ulCodePageRange1, this.m_ulCodePageRange2];
        var ulReqRanges = [format.ulRange1, format.ulRange2, format.ulRange3, format.ulRange4, format.ulCodeRange1, format.ulCodeRange2];
        var nIndex = 0;
        for (var nIndex = 0; nIndex < 6; nIndex++) {
            for (var nBitCount = 0, nBit = 1; nBitCount < 32; nBitCount++, nBit *= 2) {
                var bReqAdd = false;
                if ((ulReqRanges[nIndex] & nBit) != 0) {
                    arrRequest[nIndex * 32 + nBitCount] = 1;
                    nRangesCount++;
                    bReqAdd = true;
                }
                if ((ulCandRanges[nIndex] & nBit) != 0) {
                    arrCandidate[nIndex * 32 + nBitCount] = 1;
                    if (!bReqAdd) {
                        nAddCount++;
                    }
                }
            }
        }
        if (0 == nRangesCount) {
            return 0;
        }
        for (nIndex = 0; nIndex < 192; nIndex++) {
            if (1 == arrRequest[nIndex] && 0 == arrCandidate[nIndex]) {
                if (undefined !== _main_ranges && undefined !== _main_ranges["" + nIndex]) {
                    dPenalty += Math.max(_main_ranges["" + nIndex], dRangeWeight);
                } else {
                    dPenalty += dRangeWeight;
                }
            } else {
                if (dRangeWeightSuferflouous != 0 && 0 == arrRequest[nIndex] && 1 == arrCandidate[nIndex]) {
                    dPenalty += dRangeWeightSuferflouous;
                }
            }
        }
        return dPenalty;
    },
    GetFixedPitchPenalty: function (bReqFixed) {
        var nPenalty = 0;
        if (bReqFixed && !this.m_bIsFixed) {
            nPenalty = 15000;
        }
        if (!bReqFixed && this.m_bIsFixed) {
            nPenalty = 350;
        }
        return nPenalty;
    },
    GetFaceNamePenalty: function (sReqName) {
        if (0 == sReqName.length) {
            return 0;
        }
        if (0 == this.m_wsFontName.length) {
            return 10000;
        }
        if (sReqName == this.m_wsFontName) {
            return 0;
        }
        if (-1 != sReqName.indexOf(this.m_wsFontName) || -1 != this.m_wsFontName.indexOf(sReqName)) {
            return 1000;
        }
        if (g_fontApplication.g_fontDictionary.CheckLikeFonts(this.m_wsFontName, sReqName)) {
            return 2000;
        }
        return this.CheckEqualFonts2(sReqName, this.m_wsFontName);
    },
    GetWidthPenalty: function (usReqWidth) {
        return Math.abs(this.m_usWidth - usReqWidth) * 50;
    },
    GetWeightPenalty: function (usReqWeight) {
        return (3 * (Math.abs(this.m_usWeigth - usReqWeight) / 10));
    },
    GetItalicPenalty: function (bReqItalic) {
        if (this.m_bItalic != bReqItalic) {
            return 4;
        }
        return 0;
    },
    GetBoldPenalty: function (bReqBold) {
        if (this.m_bBold != bReqBold) {
            return 1;
        }
        return 0;
    },
    GetFamilyUnlikelyPenalty1: function (nReqFamilyClass) {
        var nReqClassID = nReqFamilyClass >> 8;
        var nCandClassID = this.m_sFamilyClass >> 8;
        if (0 == nReqClassID) {
            return 0;
        }
        if (0 == nCandClassID) {
            return 50;
        }
        if ((nReqClassID <= 8 && nCandClassID > 8) || (nReqClassID > 8 && nCandClassID <= 8)) {
            return 50;
        }
        return 0;
    },
    GetFamilyUnlikelyPenalty: function (sReqFamilyClass) {
        var nCandClassID = this.m_sFamilyClass >> 8;
        if ("any" == sReqFamilyClass || "unknown" == sReqFamilyClass) {
            return 0;
        } else {
            if (0 == nCandClassID) {
                return 50;
            } else {
                if ((("swiss" == sReqFamilyClass || "roman" == sReqFamilyClass || "modern" == sReqFamilyClass) && nCandClassID > 8) || (("decorative" == sReqFamilyClass || "script" == sReqFamilyClass) && nCandClassID <= 8)) {
                    return 50;
                }
            }
        }
        return 0;
    },
    GetCharsetPenalty: function (unReqCharset) {
        if (FD_UNKNOWN_CHARSET == unReqCharset) {
            return 0;
        }
        var _ret = this.GetCodePageByCharset(unReqCharset);
        var nMult = 1 << _ret.ulBit;
        if (nMult < 0) {
            nMult += 4294967296;
        }
        var ulCandRanges = [this.m_ulUnicodeRange1, this.m_ulUnicodeRange2, this.m_ulUnicodeRange3, this.m_ulUnicodeRange4, this.m_ulCodePageRange1, this.m_ulCodePageRange2];
        if ((ulCandRanges[_ret.unLongIndex] & nMult) == 0) {
            return 65000;
        }
        return 0;
    },
    GetAvgWidthPenalty: function (shReqWidth) {
        if (0 == this.m_shAvgCharWidth && 0 != shReqWidth) {
            return 4000;
        }
        return Math.abs(this.m_shAvgCharWidth - shReqWidth) * 4;
    },
    GetAscentPenalty: function (shReqAscent) {
        if (0 == this.m_shAscent && 0 != shReqAscent) {
            return 100;
        }
        return (Math.abs(this.m_shAscent - shReqAscent) / 10) >> 0;
    },
    GetDescentPenalty: function (shReqDescent) {
        if (0 == this.m_shDescent && 0 != shReqDescent) {
            return 100;
        }
        return (Math.abs(this.m_shDescent - shReqDescent) / 10) >> 0;
    },
    GetLineGapPenalty: function (shReqLineGap) {
        if (0 == this.m_shLineGap && 0 != shReqLineGap) {
            return 100;
        }
        return (Math.abs(this.m_shLineGap - shReqLineGap) / 10) >> 0;
    },
    GetXHeightPenalty: function (shReqXHeight) {
        if (0 == this.shXHeight && 0 != shReqXHeight) {
            return 50;
        }
        return (Math.abs(this.m_shXHeight - shReqXHeight) / 20) >> 0;
    },
    GetCapHeightPenalty: function (shReqCapHeight) {
        if (0 == this.m_shCapHeight && 0 != shReqCapHeight) {
            return 50;
        }
        return (Math.abs(this.m_shCapHeight - shReqCapHeight) / 20) >> 0;
    },
    GetCodePageByCharset: function (unCharset) {
        var ret = {
            ulBit: 0,
            unLongIndex: 4
        };
        if (unCharset == 1) {
            unCharset = this.GetDefaultCharset();
        }
        if (true) {
            switch (unCharset) {
            case 0:
                ret.ulBit = 0;
                break;
            case 238:
                ret.ulBit = 1;
                break;
            case 204:
                ret.ulBit = 2;
                break;
            case 161:
                ret.ulBit = 3;
                break;
            case 162:
                ret.ulBit = 4;
                break;
            case 177:
                ret.ulBit = 5;
                break;
            case 178:
                ret.ulBit = 6;
                break;
            case 186:
                ret.ulBit = 7;
                break;
            case 163:
                ret.ulBit = 8;
                break;
            case 222:
                ret.ulBit = 16;
                break;
            case 128:
                ret.ulBit = 17;
                break;
            case 134:
                ret.ulBit = 18;
                break;
            case 129:
                ret.ulBit = 19;
                break;
            case 136:
                ret.ulBit = 20;
                break;
            case 130:
                ret.ulBit = 21;
                break;
            case 77:
                ret.ulBit = 29;
                break;
            case 2:
                ret.ulBit = 31;
                break;
            case 255:
                ret.ulBit = 30;
                break;
            default:
                ret.ulBit = 0;
                break;
            }
        }
    },
    GetDefaultCharset: function (bUseDefCharset) {
        if (!bUseDefCharset) {
            return FD_UNKNOWN_CHARSET;
        }
        return 0;
    },
    CheckEqualFonts2: function (name1, name2) {
        var _res1 = name1.toLowerCase();
        var _res2 = name2.toLowerCase();
        if (_res1 == _res2) {
            return 1500;
        }
        if (_res1.replace(/\s+/g, "") == _res2.replace(/\s+/g, "")) {
            return 3000;
        }
        return 10000;
    }
};
function CLanguageFontSelect() {
    this.Type = 0;
    this.Ranges = [];
    this.CodePage1Mask = 0;
    this.CodePage2Mask = 0;
    this.DefaultFont = "Arial";
    this.FullSupportPages = false;
}
CLanguageFontSelect.prototype = {
    checkChar: function (_code) {
        var _len = this.Ranges.length;
        for (var i = 0; i < _len; i += 2) {
            if (_code >= this.Ranges[i] && _code <= this.Ranges[i + 1]) {
                return true;
            }
        }
        return false;
    }
};
var LanguagesFontSelectTypes = {
    Unknown: -1,
    Arabic: 1,
    Korean: 2,
    Japan: 3,
    Chinese: 4,
    EastAsiaStart: 2,
    EastAsiaEnd: 4
};
function CFontSelectList() {
    this.List = [];
    this.ListMap = {};
    this.Languages = [];
    this.m_pRanges = null;
    this.m_pRangesNums = null;
    this.IsInit = false;
    this.CurrentLoadedObj = null;
}
function memset(p, start, val, count) {
    var _data = p.data;
    for (var i = 0; i < count; i++) {
        _data[i + start] = val;
    }
}
CFontSelectList.prototype = {
    Init: function () {
        if (true == this.IsInit) {
            return;
        }
        this.IsInit = true;
        var _ft_stream = CreateFontData2(window["g_fonts_selection_bin"]);
        var _file_stream = new FileStream(_ft_stream.data, _ft_stream.size);
        var count = _file_stream.GetLong();
        for (var i = 0; i < count; i++) {
            var _fs = new CFontSelect();
            _fs.fromStream(_file_stream);
            if (_fs.m_wsFontName == "Droid Sans Fallback") {
                if ((_fs.m_ulCodePageRange1 & (1 << 19)) == (1 << 19)) {
                    _fs.m_ulCodePageRange1 -= (1 << 19);
                }
            }
            this.List.push(_fs);
            this.ListMap[_fs.m_wsFontPath] = this.List.length - 1;
        }
        var _arabic_lang = new CLanguageFontSelect();
        _arabic_lang.Type = LanguagesFontSelectTypes.Arabic;
        _arabic_lang.Ranges.push(1536);
        _arabic_lang.Ranges.push(1791);
        _arabic_lang.Ranges.push(1872);
        _arabic_lang.Ranges.push(1919);
        _arabic_lang.Ranges.push(2208);
        _arabic_lang.Ranges.push(2303);
        _arabic_lang.Ranges.push(64336);
        _arabic_lang.Ranges.push(65023);
        _arabic_lang.Ranges.push(65136);
        _arabic_lang.Ranges.push(65279);
        _arabic_lang.CodePage1Mask = (1 << 6);
        _arabic_lang.CodePage2Mask = (1 << 19) | (1 << 29);
        _arabic_lang.DefaultFont = "Tahoma";
        this.Languages.push(_arabic_lang);
        var _korean_lang = new CLanguageFontSelect();
        _korean_lang.Type = LanguagesFontSelectTypes.Korean;
        _korean_lang.Ranges.push(4352);
        _korean_lang.Ranges.push(4607);
        _korean_lang.Ranges.push(12592);
        _korean_lang.Ranges.push(12687);
        _korean_lang.Ranges.push(44032);
        _korean_lang.Ranges.push(55215);
        _korean_lang.Ranges.push(65280);
        _korean_lang.Ranges.push(65519);
        _korean_lang.CodePage1Mask = (1 << 19);
        _korean_lang.CodePage2Mask = 0;
        _korean_lang.DefaultFont = "Batang";
        this.Languages.push(_korean_lang);
        var _japan_lang = new CLanguageFontSelect();
        _japan_lang.Type = LanguagesFontSelectTypes.Japan;
        _japan_lang.Ranges.push(19968);
        _japan_lang.Ranges.push(40895);
        _japan_lang.Ranges.push(12288);
        _japan_lang.Ranges.push(12543);
        _japan_lang.Ranges.push(65280);
        _japan_lang.Ranges.push(65519);
        _japan_lang.CodePage1Mask = (1 << 17) | (1 << 30);
        _japan_lang.CodePage2Mask = 0;
        _japan_lang.DefaultFont = "MS Mincho";
        _japan_lang.FullSupportPages = true;
        this.Languages.push(_japan_lang);
        var _chinese_lang = new CLanguageFontSelect();
        _chinese_lang.Type = LanguagesFontSelectTypes.Chinese;
        _chinese_lang.Ranges.push(19968);
        _chinese_lang.Ranges.push(40959);
        _chinese_lang.Ranges.push(13312);
        _chinese_lang.Ranges.push(19967);
        _chinese_lang.Ranges.push(131072);
        _chinese_lang.Ranges.push(173791);
        _chinese_lang.Ranges.push(63744);
        _chinese_lang.Ranges.push(64255);
        _chinese_lang.Ranges.push(194560);
        _chinese_lang.Ranges.push(195103);
        _chinese_lang.Ranges.push(65280);
        _chinese_lang.Ranges.push(65519);
        _chinese_lang.CodePage1Mask = (1 << 18) | (1 << 20);
        _chinese_lang.CodePage2Mask = 0;
        _chinese_lang.DefaultFont = "SimSun";
        this.Languages.push(_chinese_lang);
        var _fs = new CFontSelect();
        _fs.m_wsFontName = "ASCW3";
        this.List.push(_fs);
        delete window["g_fonts_selection_bin"];
    },
    isEnglishChar: function (_code) {
        if (97 <= _code && _code <= 122) {
            return true;
        }
        if (65 <= _code && _code <= 90) {
            return true;
        }
        return false;
    },
    isMultiLanguageSymbol: function (_code) {
        switch (_code) {
        case 32:
            case 96:
            case 126:
            case 62:
            case 60:
            case 46:
            case 44:
            case 58:
            case 59:
            case 63:
            case 33:
            case 47:
            case 92:
            case 124:
            case 91:
            case 93:
            case 40:
            case 41:
            case 123:
            case 125:
            case 36:
            case 37:
            case 35:
            case 64:
            case 38:
            case 39:
            case 34:
            case 61:
            case 43:
            case 45:
            case 42:
            case 94:
            case 95:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 48:
            return true;
        default:
            if (_code >= 8192 && _code <= 8303) {
                return true;
            }
            if (_code >= 8352 && _code <= 8399) {
                return true;
            }
            break;
        }
        return false;
    },
    checkText: function (text) {
        var _text_len = text.length;
        if (_text_len == 0) {
            return LanguagesFontSelectTypes.Unknown;
        }
        var _array_detect_languages = [];
        var _detect_languages_length = this.Languages.length;
        for (var _lang = 0; _lang < _detect_languages_length; _lang++) {
            var _language = this.Languages[_lang];
            var _is_support = true;
            var _no_multi_symbols = 0;
            var _percent_by_english = 0;
            for (var i = 0; i < _text_len; i++) {
                var _code = text.charCodeAt(i);
                if (!this.isMultiLanguageSymbol(_code)) {
                    _no_multi_symbols++;
                    if (!_language.checkChar(_code)) {
                        if (this.isEnglishChar(_code)) {
                            _percent_by_english--;
                        } else {
                            _is_support = false;
                            break;
                        }
                    } else {
                        _percent_by_english++;
                    }
                }
            }
            if (0 == _no_multi_symbols) {
                return LanguagesFontSelectTypes.Unknown;
            }
            if (_is_support && (_percent_by_english > 0)) {
                _array_detect_languages.push(_language.Type);
            }
        }
        var _len = _array_detect_languages.length;
        if (0 == _len) {
            return LanguagesFontSelectTypes.Unknown;
        }
        return _array_detect_languages[_len - 1];
    },
    checkPasteText: function (textPr, langId) {
        var _ret_obj = {
            is_async: false,
            name: "",
            fontSlot: fontslot_ASCII
        };
        if (!textPr.RFonts) {
            return _ret_obj;
        }
        var _lang = null;
        for (var i = 0; i < this.Languages.length; i++) {
            _lang = this.Languages[i];
            if (_lang.Type == langId) {
                break;
            }
        }
        if (null == _lang) {
            return _ret_obj;
        }
        _ret_obj.fontSlot = fontslot_ASCII;
        if (langId >= LanguagesFontSelectTypes.EastAsiaStart && langId <= LanguagesFontSelectTypes.EastAsiaEnd) {
            _ret_obj.fontSlot = fontslot_EastAsia;
        }
        if (langId == LanguagesFontSelectTypes.Arabic) {
            if (textPr.CS || textPr.RTL) {
                _ret_obj.fontSlot = fontslot_CS;
            }
        }
        var _fontFamily = undefined;
        var bold = undefined;
        var italic = undefined;
        switch (_ret_obj.fontSlot) {
        case fontslot_ASCII:
            _fontFamily = textPr.RFonts.Ascii;
            bold = textPr.Bold;
            italic = textPr.Italic;
            break;
        case fontslot_HAnsi:
            _fontFamily = textPr.RFonts.HAnsi;
            bold = textPr.Bold;
            italic = textPr.Italic;
            break;
        case fontslot_CS:
            _fontFamily = textPr.RFonts.CS;
            bold = textPr.BoldCS;
            italic = textPr.ItalicCS;
            break;
        case fontslot_EastAsia:
            _fontFamily = textPr.RFonts.EastAsia;
            bold = textPr.Bold;
            italic = textPr.Italic;
            break;
        default:
            break;
        }
        if (undefined == _fontFamily) {
            return _ret_obj;
        }
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!italic && bold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (italic && !bold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (italic && bold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        var _info = g_fontApplication.GetFontInfo(_fontFamily.Name, oFontStyle);
        var _id = _info.GetFontID(window.g_font_loader, oFontStyle);
        var _select = this.List[this.ListMap[_id.id]];
        if (0 != _lang.CodePage1Mask) {
            if (!_lang.FullSupportPages) {
                if (0 == (_lang.CodePage1Mask & _select.m_ulCodePageRange1)) {
                    _ret_obj.is_async = true;
                }
            } else {
                if (_lang.CodePage1Mask != (_lang.CodePage1Mask & _select.m_ulCodePageRange1)) {
                    _ret_obj.is_async = true;
                }
            }
        }
        if (0 != _lang.CodePage2Mask) {
            if (!_lang.FullSupportPages) {
                if (0 == (_lang.CodePage2Mask & _select.m_ulCodePageRange2)) {
                    _ret_obj.is_async = true;
                }
            } else {
                if (_lang.CodePage2Mask != (_lang.CodePage2Mask & _select.m_ulCodePageRange2)) {
                    _ret_obj.is_async = true;
                }
            }
        }
        if (!_ret_obj.is_async) {
            return _ret_obj;
        }
        _ret_obj.name = this.selectNeedFont(_lang, oFontStyle);
        if (_ret_obj.name == "") {
            _ret_obj.is_async = false;
        }
        return _ret_obj;
    },
    getSetupRFonts: function (obj) {
        var _rfonts = new CRFonts();
        switch (obj.fontSlot) {
        case fontslot_EastAsia:
            _rfonts.EastAsia = {
                Name: obj.name,
                Index: -1
            };
            break;
        case fontslot_CS:
            _rfonts.CS = {
                Name: obj.name,
                Index: -1
            };
            break;
        case fontslot_HAnsi:
            _rfonts.HAnsi = {
                Name: obj.name,
                Index: -1
            };
            break;
        case fontslot_ASCII:
            default:
            _rfonts.Ascii = {
                Name: obj.name,
                Index: -1
            };
            break;
        }
        return _rfonts;
    },
    selectNeedFont: function (_lang, _style) {
        var _error = 16777216;
        var _name = "";
        var _len = window.g_font_infos.length;
        for (var i = 0; i < _len; i++) {
            var _info = window.g_font_infos[i];
            var _id = _info.GetFontID(window.g_font_loader, _style);
            var _select = this.List[this.ListMap[_id.id]];
            if (!_select) {
                continue;
            }
            var _bIsNeed = false;
            if (0 != _lang.CodePage1Mask) {
                if (!_lang.FullSupportPages) {
                    if (0 == (_lang.CodePage1Mask & _select.m_ulCodePageRange1)) {
                        _bIsNeed = true;
                    }
                } else {
                    if (_lang.CodePage1Mask != (_lang.CodePage1Mask & _select.m_ulCodePageRange1)) {
                        _bIsNeed = true;
                    }
                }
            }
            if (0 != _lang.CodePage2Mask) {
                if (!_lang.FullSupportPages) {
                    if (0 == (_lang.CodePage2Mask & _select.m_ulCodePageRange2)) {
                        _bIsNeed = true;
                    }
                } else {
                    if (_lang.CodePage2Mask != (_lang.CodePage2Mask & _select.m_ulCodePageRange2)) {
                        _bIsNeed = true;
                    }
                }
            }
            if (!_bIsNeed) {
                var _tmp_error = 0;
                if (_id.file.Status != 0) {
                    _tmp_error += 65536;
                }
                if (_info.Name != _lang.DefaultFont) {
                    _tmp_error += 256;
                }
                if (_tmp_error < _error) {
                    _error = _tmp_error;
                    _name = _info.Name;
                }
            }
        }
        if (_name == "") {
            _name = g_fontApplication.GetFontInfoName(_lang.DefaultFont);
        }
        return _name;
    },
    checkText2: function (text) {
        var r1 = 0;
        var r2 = 0;
        var r3 = 0;
        var r4 = 0;
        var codePage1 = 0;
        var codePage2 = 0;
        var len = text.length;
        for (var i = 0; i < len; i++) {
            var _code = text.charCodeAt(i);
            var lRangeNum = this.m_pRangesNums.data[_code];
            var lRange = this.m_pRanges.data[_code];
            if (255 != lRangeNum) {
                if ((i == 0) && ((lRangeNum == 1) && (lRange == 28))) {
                    codePage1 = 2147483648;
                } else {
                    if (((lRangeNum == 2) && (lRange == 3)) || ((lRangeNum == 1) && (lRange == 31)) || ((lRangeNum == 0) && (lRange == 13))) {
                        r1 |= (1 << 13);
                        r2 |= (1 << 31);
                        r3 |= (1 << 3);
                    } else {
                        if (0 == lRangeNum) {
                            r1 |= 1 << lRange;
                        } else {
                            if (1 == lRangeNum) {
                                r2 |= 1 << lRange;
                            } else {
                                if (2 == lRangeNum) {
                                    r3 |= 1 << lRange;
                                } else {
                                    r4 |= 1 << lRange;
                                }
                            }
                        }
                    }
                }
            }
        }
        var _array_results = [];
        var _count_fonts = this.List.length;
        for (var i = 0; i < _count_fonts; i++) {
            var f = this.List[i];
            if (((f.m_ulUnicodeRange1 & r1) == r1) && ((f.m_ulUnicodeRange2 & r2) == r2) && ((f.m_ulUnicodeRange3 & r3) == r3) && ((f.m_ulUnicodeRange4 & r4) == r4) && ((f.m_ulCodePageRange1 & codePage1) == codePage1) && ((f.m_ulCodePageRange2 & codePage2) == codePage2)) {
                _array_results.push(f.m_wsFontPath);
            }
        }
    },
    initRanges: function () {}
};
function CApplicationFonts() {
    this.FontPickerMap = {};
    this.g_fontDictionary = new FD_FontDictionary();
    this.g_fontSelections = new CFontSelectList();
    this.DefaultIndex = 0;
    this.Init = function () {
        this.g_fontDictionary.Init();
        this.g_fontSelections.Init();
        var oSelect = new CFontSelectFormat();
        oSelect.wsName = "Arial";
        this.DefaultIndex = this.g_fontDictionary.GetFontIndex(oSelect, this.g_fontSelections.List, undefined);
    };
    this.LoadFont = function (name, font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform, objDst) {
        var _font = this.GetFontFileWeb(name, lStyle);
        var font_name_index = window.g_map_font_index[_font.m_wsFontName];
        if (undefined !== objDst) {
            objDst.Name = _font.m_wsFontName;
            objDst.Replace = this.CheckReplaceGlyphsMap(name, objDst);
        }
        return window.g_font_infos[font_name_index].LoadFont(window.g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
    };
    this.CheckReplaceGlyphsMap = function (name, objDst) {
        var _replaceInfo = this.g_fontDictionary.ChangeGlyphsMap[name];
        if (!_replaceInfo) {
            return null;
        }
        if (_replaceInfo.Name != objDst.Name) {
            return null;
        }
        return _replaceInfo;
    };
    this.GetReplaceGlyph = function (src, objDst) {
        var _arr = objDst.MapSrc;
        var _arrLen = _arr.length;
        for (var i = 0; i < _arrLen; i++) {
            if (_arr[i] == src) {
                return objDst.MapDst[i];
            }
            if (objDst.IsSymbolSrc && (src == (61440 + _arr[i]))) {
                return objDst.MapDst[i];
            }
        }
    };
    this.GetFontFile = function (name, lStyle) {
        if (lStyle === undefined) {
            lStyle = 0;
        }
        var _key = "s" + lStyle + "_";
        _key += name;
        if (undefined !== this.FontPickerMap[_key]) {
            return this.FontPickerMap[_key];
        } else {
            var oSelect = new CFontSelectFormat();
            oSelect.wsName = name;
            oSelect.bItalic = false;
            oSelect.bBold = false;
            var _font = this.GetFontIndex(oSelect);
            this.FontPickerMap[_key] = _font;
            return _font;
        }
    };
    this.GetFontFileWeb = function (name, lStyle) {
        if (undefined !== this.FontPickerMap[name]) {
            return this.FontPickerMap[name];
        } else {
            var oSelect = new CFontSelectFormat();
            oSelect.wsName = name;
            var _font = this.GetFontIndex(oSelect, true);
            this.FontPickerMap[name] = _font;
            return _font;
        }
    };
    this.GetFontInfo = function (name, lStyle, objDst) {
        var _font = this.GetFontFileWeb(name, lStyle);
        var font_name_index = window.g_map_font_index[_font.m_wsFontName];
        if (undefined !== objDst) {
            objDst.Name = _font.m_wsFontName;
            objDst.Replace = this.CheckReplaceGlyphsMap(name, objDst);
        }
        return window.g_font_infos[font_name_index];
    };
    this.GetFontInfoName = function (name, objDst) {
        var _font = this.GetFontFileWeb(name);
        if (undefined !== objDst) {
            objDst.Name = _font.m_wsFontName;
            objDst.Replace = this.CheckReplaceGlyphsMap(name, objDst);
        }
        return _font.m_wsFontName;
    };
    this.GetFontIndex = function (oSelect, isName0) {
        return this.g_fontDictionary.GetFontIndex(oSelect, this.g_fontSelections.List, this.DefaultIndex, isName0);
    };
    this.GetFontNameDictionary = function (sFontFamily, bDontReturnDef) {
        var sFontname;
        var nIndex = sFontFamily.indexOf(",");
        if (-1 != nIndex) {
            sFontname = sFontFamily.substring(0, nIndex);
        } else {
            sFontname = sFontFamily;
        }
        sFontname = sFontname.replace(/^[\s'"]+|[\s'"]+$/g, "");
        if (0 == sFontname.length) {
            if (true === bDontReturnDef) {
                sFontname = "Arial";
            }
        } else {
            var sFontnameLower = sFontname.toLowerCase();
            if ("serif" == sFontnameLower) {
                sFontname = "Times New Roman";
            } else {
                if ("sans-serif" == sFontnameLower) {
                    sFontname = "Arial";
                } else {
                    if ("cursive" == sFontnameLower) {
                        sFontname = "Comic Sans MS";
                    } else {
                        if ("fantasy" == sFontnameLower) {
                            sFontname = "Impact";
                        } else {
                            if ("monospace" == sFontnameLower) {
                                sFontname = "Courier New";
                            } else {
                                var oSelect = new CFontSelectFormat();
                                oSelect.wsName = sFontname;
                                this.g_fontDictionary.CorrectParamsFromDictionary(oSelect);
                                if (null != oSelect.pPanose) {
                                    return oSelect.wsName;
                                } else {
                                    return this.GetFontInfoName(sFontname);
                                }
                            }
                        }
                    }
                }
            }
        }
        return sFontname;
    };
}
var g_fontApplication = new CApplicationFonts();