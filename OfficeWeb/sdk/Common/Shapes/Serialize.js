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
var c_dScalePPTXSizes = 36000;
function IsHiddenObj(object) {
    if (!object) {
        return false;
    }
    var _uniProps = object.nvSpPr;
    if (!_uniProps) {
        _uniProps = object.nvPicPr;
    }
    if (!_uniProps) {
        _uniProps = object.nvGrpSpPr;
    }
    if (!_uniProps) {
        return false;
    }
    if (_uniProps.cNvPr && _uniProps.cNvPr.isHidden) {
        return true;
    }
    return false;
}
function FileStream(data, size) {
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;
    this.Seek = function (_pos) {
        if (_pos > this.size) {
            return 1;
        }
        this.pos = _pos;
        return 0;
    };
    this.Seek2 = function (_cur) {
        if (_cur > this.size) {
            return 1;
        }
        this.cur = _cur;
        return 0;
    };
    this.Skip = function (_skip) {
        if (_skip < 0) {
            return 1;
        }
        return this.Seek(this.pos + _skip);
    };
    this.Skip2 = function (_skip) {
        if (_skip < 0) {
            return 1;
        }
        return this.Seek2(this.cur + _skip);
    };
    this.GetUChar = function () {
        if (this.cur >= this.size) {
            return 0;
        }
        return this.data[this.cur++];
    };
    this.GetBool = function () {
        if (this.cur >= this.size) {
            return 0;
        }
        return (this.data[this.cur++] == 1) ? true : false;
    };
    this.GetUShort = function () {
        if (this.cur + 1 >= this.size) {
            return 0;
        }
        return (this.data[this.cur++] | this.data[this.cur++] << 8);
    };
    this.GetULong = function () {
        if (this.cur + 3 >= this.size) {
            return 0;
        }
        var r = (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
        if (r < 0) {
            r += (4294967295 + 1);
        }
        return r;
    };
    this.GetLong = function () {
        if (this.cur + 3 >= this.size) {
            return 0;
        }
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
    };
    this.GetString = function (len) {
        len *= 2;
        if (this.cur + len > this.size) {
            return "";
        }
        var t = "";
        for (var i = 0; i < len; i += 2) {
            var _c = this.data[this.cur + i + 1] << 8 | this.data[this.cur + i];
            if (_c == 0) {
                break;
            }
            t += String.fromCharCode(_c);
        }
        this.cur += len;
        return t;
    };
    this.GetString1 = function (len) {
        if (this.cur + len > this.size) {
            return "";
        }
        var t = "";
        for (var i = 0; i < len; i++) {
            var _c = this.data[this.cur + i];
            if (_c == 0) {
                break;
            }
            t += String.fromCharCode(_c);
        }
        this.cur += len;
        return t;
    };
    this.GetString2 = function () {
        var len = this.GetULong();
        return this.GetString(len);
    };
    this.GetString2A = function () {
        var len = this.GetULong();
        return this.GetString1(len);
    };
    this.EnterFrame = function (count) {
        if (this.pos >= this.size || this.size - this.pos < count) {
            return 1;
        }
        this.cur = this.pos;
        this.pos += count;
        return 0;
    };
    this.SkipRecord = function () {
        var _len = this.GetULong();
        this.Skip2(_len);
    };
    this.GetPercentage = function () {
        var s = this.GetString2();
        var _len = s.length;
        if (_len == 0) {
            return null;
        }
        var _ret = null;
        if ((_len - 1) == s.indexOf("%")) {
            s.substring(0, _len - 1);
            _ret = parseFloat(s);
            if (isNaN(_ret)) {
                _ret = null;
            }
        } else {
            _ret = parseFloat(s);
            if (isNaN(_ret)) {
                _ret = null;
            } else {
                _ret /= 1000;
            }
        }
        return _ret;
    };
}
var g_nodeAttributeStart = 250;
var g_nodeAttributeEnd = 251;
function CBuilderImages(blip_fill, full_url) {
    this.Url = full_url;
    this.BlipFill = blip_fill;
}
CBuilderImages.prototype = {
    SetUrl: function (url) {
        this.BlipFill.RasterImageId = url;
    }
};
function BinaryPPTYLoader() {
    this.stream = null;
    this.presentation = null;
    this.TempGroupObject = null;
    this.TempMainObject = null;
    this.IsThemeLoader = false;
    this.Api = null;
    this.map_table_styles = {};
    this.NextTableStyleId = 0;
    this.ImageMapChecker = null;
    this.IsUseFullSrc = false;
    this.RebuildImages = [];
    this.textBodyTextFit = [];
    this.Start_UseFullUrl = function () {
        this.IsUseFullUrl = true;
    };
    this.End_UseFullUrl = function () {
        var _result = this.RebuildImages;
        this.IsUseFullUrl = false;
        this.RebuildImages = [];
        return _result;
    };
    this.Check_TextFit = function () {
        for (var i = 0; i < this.textBodyTextFit.length; ++i) {
            this.textBodyTextFit[i].checkTextFit();
        }
        this.textBodyTextFit.length = 0;
    };
    this.Load = function (base64_ppty, presentation) {
        this.presentation = presentation;
        this.ImageMapChecker = {};
        var srcLen = base64_ppty.length;
        var nWritten = 0;
        var index = 0;
        var read_main_prop = "";
        while (true) {
            var _c = base64_ppty.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                break;
            }
            read_main_prop += String.fromCharCode(_c);
            index++;
        }
        index++;
        if ("PPTY" != read_main_prop) {
            return false;
        }
        read_main_prop = "";
        while (true) {
            var _c = base64_ppty.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                break;
            }
            read_main_prop += String.fromCharCode(_c);
            index++;
        }
        index++;
        var _version_num_str = read_main_prop.substring(1);
        read_main_prop = "";
        while (true) {
            var _c = base64_ppty.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                break;
            }
            read_main_prop += String.fromCharCode(_c);
            index++;
        }
        index++;
        var dstLen_str = read_main_prop;
        var dstLen = parseInt(dstLen_str);
        var pointer = g_memory.Alloc(dstLen);
        this.stream = new FileStream(pointer.data, dstLen);
        this.stream.obj = pointer.obj;
        var dstPx = this.stream.data;
        if (window.chrome) {
            while (index < srcLen) {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i = 0; i < 4; i++) {
                    if (index >= srcLen) {
                        break;
                    }
                    var nCh = DecodeBase64Char(base64_ppty.charCodeAt(index++));
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
                    var nCh = p[base64_ppty.charCodeAt(index++)];
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
        this.presentation.ImageMap = {};
        this.presentation.Fonts = [];
        this.presentation.EmbeddedFonts = [];
        if (presentation.globalTableStyles) {
            this.NextTableStyleId = this.presentation.globalTableStyles.length;
        }
        this.LoadDocument();
        this.ImageMapChecker = null;
    };
    this.Load2 = function (data, presentation) {
        this.presentation = presentation;
        this.ImageMapChecker = {};
        this.stream = new FileStream(data, data.length);
        this.stream.obj = null;
        this.presentation.ImageMap = {};
        this.presentation.Fonts = [];
        this.presentation.EmbeddedFonts = [];
        if (presentation.globalTableStyles) {
            this.NextTableStyleId = this.presentation.globalTableStyles.length;
        }
        this.LoadDocument();
        this.ImageMapChecker = null;
    };
    this.LoadDocument = function () {
        var _main_tables = {};
        var s = this.stream;
        var err = 0;
        err = s.EnterFrame(5 * 30);
        if (err != 0) {
            return err;
        }
        for (var i = 0; i < 30; i++) {
            var _type = s.GetUChar();
            if (0 == _type) {
                break;
            }
            _main_tables["" + _type] = s.GetULong();
        }
        if (undefined != _main_tables["255"]) {
            s.Seek2(_main_tables["255"]);
            var _sign = s.GetString1(4);
            var _ver = s.GetULong();
        }
        if (!this.IsThemeLoader) {
            if (undefined != _main_tables["1"]) {
                s.Seek2(_main_tables["1"]);
                this.presentation.App = new CApp();
                this.presentation.App.fromStream(s);
            }
            if (undefined != _main_tables["2"]) {
                s.Seek2(_main_tables["2"]);
                this.presentation.Core = new CCore();
                this.presentation.Core.fromStream(s);
            }
        }
        if (undefined != _main_tables["3"]) {
            s.Seek2(_main_tables["3"]);
            this.presentation.pres = new CPres();
            var pres = this.presentation.pres;
            pres.fromStream(s, this);
            this.presentation.defaultTextStyle = pres.defaultTextStyle;
            this.presentation.Width = pres.SldSz.cx / c_dScalePPTXSizes;
            this.presentation.Height = pres.SldSz.cy / c_dScalePPTXSizes;
        }
        if (!this.IsThemeLoader) {
            if (undefined != _main_tables["4"]) {
                s.Seek2(_main_tables["4"]);
                this.presentation.ViewProps = this.ReadViewProps();
            }
            if (undefined != _main_tables["5"]) {
                s.Seek2(_main_tables["5"]);
                this.presentation.VmlDrawing = this.ReadVmlDrawing();
            }
            if (undefined != _main_tables["6"]) {
                s.Seek2(_main_tables["6"]);
                this.presentation.TableStyles = this.ReadTableStyles();
            }
        }
        if (undefined != _main_tables["20"]) {
            s.Seek2(_main_tables["20"]);
            var _themes_count = s.GetULong();
            for (var i = 0; i < _themes_count; i++) {
                this.presentation.themes[i] = this.ReadTheme();
            }
        }
        if (undefined != _main_tables["22"]) {
            s.Seek2(_main_tables["22"]);
            var _sm_count = s.GetULong();
            for (var i = 0; i < _sm_count; i++) {
                this.presentation.slideMasters[i] = this.ReadSlideMaster();
                this.presentation.slideMasters[i].setSlideSize(this.presentation.Width, this.presentation.Height);
            }
        }
        if (undefined != _main_tables["23"]) {
            s.Seek2(_main_tables["23"]);
            var _sl_count = s.GetULong();
            for (var i = 0; i < _sl_count; i++) {
                this.presentation.slideLayouts[i] = this.ReadSlideLayout();
                this.presentation.slideLayouts[i].setSlideSize(this.presentation.Width, this.presentation.Height);
            }
        }
        if (!this.IsThemeLoader) {
            if (undefined != _main_tables["24"]) {
                s.Seek2(_main_tables["24"]);
                var _s_count = s.GetULong();
                for (var i = 0; i < _s_count; i++) {
                    this.presentation.insertSlide(i, this.ReadSlide(i));
                    this.presentation.Slides[i].setSlideSize(this.presentation.Width, this.presentation.Height);
                }
            }
            if (undefined != _main_tables["25"]) {
                s.Seek2(_main_tables["25"]);
                var _nm_count = s.GetULong();
                for (var i = 0; i < _nm_count; i++) {
                    this.presentation.notesMasters[i] = this.ReadNoteMaster();
                }
            }
            if (undefined != _main_tables["26"]) {
                s.Seek2(_main_tables["26"]);
                var _n_count = s.GetULong();
                for (var i = 0; i < _n_count; i++) {
                    this.presentation.notes[i] = this.ReadNote();
                }
            }
        }
        if (null == this.ImageMapChecker) {
            if (undefined != _main_tables["42"]) {
                s.Seek2(_main_tables["42"]);
                var _type = s.GetUChar();
                var _len = s.GetULong();
                s.Skip2(1);
                var _cur_ind = 0;
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    var image_id = s.GetString2();
                    if (this.IsThemeLoader) {
                        image_id = "theme" + (this.Api.ThemeLoader.CurrentLoadThemeIndex + 1) + "/media/" + image_id;
                    }
                    this.presentation.ImageMap[_cur_ind++] = image_id;
                }
            }
        } else {
            var _cur_ind = 0;
            for (var k in this.ImageMapChecker) {
                if (this.IsThemeLoader) {
                    image_id = "theme" + (this.Api.ThemeLoader.CurrentLoadThemeIndex + 1) + "/media/" + k;
                }
                this.presentation.ImageMap[_cur_ind++] = k;
            }
        }
        if (undefined != _main_tables["43"]) {
            s.Seek2(_main_tables["43"]);
            var _type = s.GetUChar();
            var _len = s.GetULong();
            s.Skip2(1);
            var _cur_ind = 0;
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                var f_name = s.GetString2();
                this.presentation.Fonts[this.presentation.Fonts.length] = new CFont(f_name, 0, "", 0, 15);
            }
        }
        if (undefined != _main_tables["41"]) {
            s.Seek2(_main_tables["41"]);
            s.Skip2(5);
            var _count = s.GetULong();
            for (var i = 0; i < _count; i++) {
                var _master_type = s.GetUChar();
                this.ReadMasterInfo(i);
            }
        }
        if (undefined != _main_tables["44"] && this.Api.isUseEmbeddedCutFonts) {
            var _embedded_fonts = [];
            s.Seek2(_main_tables["44"]);
            s.Skip2(5);
            var _count = s.GetULong();
            for (var i = 0; i < _count; i++) {
                var _at = s.GetUChar();
                if (_at != g_nodeAttributeStart) {
                    break;
                }
                var _f_i = {};
                while (true) {
                    _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        _f_i.Name = s.GetString2();
                        break;
                    case 1:
                        _f_i.Style = s.GetULong();
                        break;
                    case 2:
                        _f_i.IsCut = s.GetBool();
                        break;
                    case 3:
                        _f_i.IndexCut = s.GetULong();
                        break;
                    default:
                        break;
                    }
                }
                _embedded_fonts.push(_f_i);
            }
            var font_cuts = this.Api.FontLoader.embedded_cut_manager;
            font_cuts.Url = this.Api.DocumentUrl + "fonts/fonts.js";
            font_cuts.init_cut_fonts(_embedded_fonts);
            font_cuts.bIsCutFontsUse = true;
        }
        if (!this.IsThemeLoader) {
            if (undefined != _main_tables["40"]) {
                s.Seek2(_main_tables["40"]);
                s.Skip2(6);
                var _slideNum = 0;
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    var indexL = s.GetULong();
                    this.presentation.Slides[_slideNum].setLayout(this.presentation.slideLayouts[indexL]);
                    this.presentation.Slides[_slideNum].Master = this.presentation.slideLayouts[indexL].Master;
                    _slideNum++;
                }
            }
        }
        if (this.Api != null && !this.IsThemeLoader) {
            if (this.presentation.themes.length == 0) {
                this.presentation.themes[0] = GenerateDefaultTheme(this.presentation);
            }
            if (this.presentation.slideMasters.length == 0) {
                this.presentation.slideMasters[0] = GenerateDefaultMasterSlide(this.presentation.themes[0]);
                this.presentation.slideLayouts[0] = this.presentation.slideMasters[0].sldLayoutLst[0];
            }
            if (this.presentation.Slides.length == 0) {
                this.presentation.Slides[0] = GenerateDefaultSlide(this.presentation.slideLayouts[0]);
            }
        } else {
            if (this.Api != null && this.IsThemeLoader) {
                var theme_loader = this.Api.ThemeLoader;
                var _info = theme_loader.themes_info_editor[theme_loader.CurrentLoadThemeIndex];
                _info.ImageMap = this.presentation.ImageMap;
                _info.FontMap = this.presentation.Fonts;
            }
        }
    };
    this.ReadMasterInfo = function (indexMaster) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        var master = this.presentation.slideMasters[indexMaster];
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var indexTh = s.GetULong();
                master.setTheme(this.presentation.themes[indexTh]);
                master.ThemeIndex = -indexTh - 1;
                break;
            case 1:
                s.GetString2A();
                break;
            default:
                break;
            }
        }
        var _lay_count = s.GetULong();
        for (var i = 0; i < _lay_count; i++) {
            s.Skip2(6);
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                switch (_at) {
                case 0:
                    var indexL = s.GetULong();
                    master.addToSldLayoutLstToPos(master.sldLayoutLst.length, this.presentation.slideLayouts[indexL]);
                    this.presentation.slideLayouts[indexL].setMaster(master);
                    break;
                case 1:
                    s.GetString2A();
                    break;
                default:
                    break;
                }
            }
        }
        s.Seek2(_end_rec);
        if (this.Api != null && this.IsThemeLoader) {
            var theme_loader = this.Api.ThemeLoader;
            var theme_load_info = new CThemeLoadInfo();
            theme_load_info.Master = master;
            theme_load_info.Theme = master.Theme;
            var _lay_cnt = master.sldLayoutLst.length;
            for (var i = 0; i < _lay_cnt; i++) {
                theme_load_info.Layouts[i] = master.sldLayoutLst[i];
            }
            theme_loader.themes_info_editor[theme_loader.CurrentLoadThemeIndex] = theme_load_info;
        }
    };
    this.ReadViewProps = function () {
        return null;
    };
    this.ReadVmlDrawing = function () {
        return null;
    };
    this.ReadTableStyles = function () {
        var s = this.stream;
        var _type = s.GetUChar();
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        var _old_default = this.presentation.DefaultTableStyleId;
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var _def = s.GetString2();
                this.presentation.DefaultTableStyleId = _def;
                break;
            default:
                break;
            }
        }
        var _type = s.GetUChar();
        s.Skip2(4);
        while (s.cur < _end_rec) {
            s.Skip2(1);
            this.ReadTableStyle();
        }
        if (!this.presentation.globalTableStyles.Style[this.presentation.DefaultTableStyleId]) {
            this.presentation.DefaultTableStyleId = _old_default;
        }
        s.Seek2(_end_rec);
    };
    this.ReadTableStyle = function () {
        var s = this.stream;
        var _style = new CStyle("", null, null, styletype_Table);
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var _id = s.GetString2();
                if (isRealObject(this.presentation.TableStylesIdMap)) {
                    this.presentation.TableStylesIdMap[_style.Id] = true;
                }
                this.map_table_styles[_id] = _style;
                break;
            case 1:
                _style.Name = s.GetString2();
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var _end_rec2 = s.cur + s.GetLong() + 4;
                while (s.cur < _end_rec2) {
                    var _at2 = s.GetUChar();
                    switch (_at2) {
                    case 0:
                        var _end_rec3 = s.cur + s.GetLong() + 4;
                        while (s.cur < _end_rec3) {
                            var _at3 = s.GetUChar();
                            switch (_at3) {
                            case 0:
                                var _unifill = this.ReadUniFill();
                                if (_unifill.fill !== undefined && _unifill.fill != null) {
                                    if (undefined === _style.TablePr.Shd || null == _style.TablePr.Shd) {
                                        _style.TablePr.Shd = new CDocumentShd();
                                        _style.TablePr.Shd.Value = shd_Clear;
                                    }
                                    _style.TablePr.Shd.Unifill = _unifill;
                                }
                            default:
                                break;
                            }
                        }
                        break;
                    case 1:
                        if (undefined === _style.TablePr.Shd || null == _style.TablePr.Shd) {
                            _style.TablePr.Shd = new CDocumentShd();
                            _style.TablePr.Shd.Value = shd_Clear;
                        }
                        _style.TablePr.Shd.FillRef = this.ReadStyleRef();
                        break;
                    default:
                        break;
                    }
                }
                s.Seek2(_end_rec2);
                break;
            case 1:
                _style.TableWholeTable = this.ReadTableStylePart();
                break;
            case 2:
                _style.TableBand1Horz = this.ReadTableStylePart();
                break;
            case 3:
                _style.TableBand2Horz = this.ReadTableStylePart();
                break;
            case 4:
                _style.TableBand1Vert = this.ReadTableStylePart();
                break;
            case 5:
                _style.TableBand2Vert = this.ReadTableStylePart();
                break;
            case 6:
                _style.TableLastCol = this.ReadTableStylePart();
                break;
            case 7:
                _style.TableFirstCol = this.ReadTableStylePart();
                break;
            case 8:
                _style.TableFirstRow = this.ReadTableStylePart();
                break;
            case 9:
                _style.TableLastRow = this.ReadTableStylePart();
                break;
            case 10:
                _style.TableBRCell = this.ReadTableStylePart();
                break;
            case 11:
                _style.TableBLCell = this.ReadTableStylePart();
                break;
            case 12:
                _style.TableTRCell = this.ReadTableStylePart();
                break;
            case 13:
                _style.TableTLCell = this.ReadTableStylePart();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        if (_style.TableWholeTable.TablePr.TableBorders.InsideH) {
            _style.TablePr.TableBorders.InsideH = _style.TableWholeTable.TablePr.TableBorders.InsideH;
            delete _style.TableWholeTable.TablePr.TableBorders.InsideH;
        }
        if (_style.TableWholeTable.TablePr.TableBorders.InsideV) {
            _style.TablePr.TableBorders.InsideV = _style.TableWholeTable.TablePr.TableBorders.InsideV;
            delete _style.TableWholeTable.TablePr.TableBorders.InsideV;
        }
        if (_style.TableWholeTable.TableCellPr.TableCellBorders.Top) {
            _style.TablePr.TableBorders.Top = _style.TableWholeTable.TableCellPr.TableCellBorders.Top;
            delete _style.TableWholeTable.TableCellPr.TableCellBorders.Top;
        }
        if (_style.TableWholeTable.TableCellPr.TableCellBorders.Bottom) {
            _style.TablePr.TableBorders.Bottom = _style.TableWholeTable.TableCellPr.TableCellBorders.Bottom;
            delete _style.TableWholeTable.TableCellPr.TableCellBorders.Bottom;
        }
        if (_style.TableWholeTable.TableCellPr.TableCellBorders.Left) {
            _style.TablePr.TableBorders.Left = _style.TableWholeTable.TableCellPr.TableCellBorders.Left;
            delete _style.TableWholeTable.TableCellPr.TableCellBorders.Left;
        }
        if (_style.TableWholeTable.TableCellPr.TableCellBorders.Right) {
            _style.TablePr.TableBorders.Right = _style.TableWholeTable.TableCellPr.TableCellBorders.Right;
            delete _style.TableWholeTable.TableCellPr.TableCellBorders.Right;
        }
        if (this.presentation.globalTableStyles) {
            this.presentation.globalTableStyles.Add(_style);
        }
    };
    this.ReadTableStylePart = function () {
        var s = this.stream;
        var _part = new CTableStylePr();
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var _end_rec2 = s.cur + s.GetLong() + 4;
                s.Skip2(1);
                var _i, _b;
                while (true) {
                    var _at2 = s.GetUChar();
                    if (_at2 == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at2) {
                    case 0:
                        _i = s.GetUChar();
                        break;
                    case 1:
                        _b = s.GetUChar();
                        break;
                    default:
                        break;
                    }
                }
                if (_i === 0) {
                    _part.TextPr.Italic = true;
                } else {
                    if (_i === 1) {
                        _part.TextPr.Italic = false;
                    }
                }
                if (_b === 0) {
                    _part.TextPr.Bold = true;
                } else {
                    if (_b === 1) {
                        _part.TextPr.Bold = false;
                    }
                }
                while (s.cur < _end_rec2) {
                    var _at3 = s.GetUChar();
                    switch (_at3) {
                    case 0:
                        _part.TextPr.FontRef = this.ReadFontRef();
                        break;
                    case 1:
                        var _Unicolor = this.ReadUniColor();
                        if (_Unicolor.color) {
                            _part.TextPr.Unifill = new CUniFill();
                            _part.TextPr.Unifill.fill = new CSolidFill();
                            _part.TextPr.Unifill.fill.color = _Unicolor;
                        }
                        break;
                    default:
                        break;
                    }
                }
                s.Seek2(_end_rec2);
                break;
            case 1:
                var _end_rec2 = s.cur + s.GetLong() + 4;
                while (s.cur < _end_rec2) {
                    var _at2 = s.GetUChar();
                    switch (_at2) {
                    case 0:
                        this.ReadTcBdr(_part);
                        break;
                    case 1:
                        if (undefined === _part.TableCellPr.Shd || null == _part.TableCellPr.Shd) {
                            _part.TableCellPr.Shd = new CDocumentShd();
                            _part.TableCellPr.Shd.Value = shd_Clear;
                        }
                        _part.TableCellPr.Shd.FillRef = this.ReadStyleRef();
                        break;
                    case 2:
                        var _end_rec3 = s.cur + s.GetLong() + 4;
                        while (s.cur < _end_rec3) {
                            var _at3 = s.GetUChar();
                            switch (_at3) {
                            case 0:
                                var _unifill = this.ReadUniFill();
                                if (_unifill.fill !== undefined && _unifill.fill != null) {
                                    if (undefined === _part.TableCellPr.Shd || null == _part.TableCellPr.Shd) {
                                        _part.TableCellPr.Shd = new CDocumentShd();
                                        _part.TableCellPr.Shd.Value = shd_Clear;
                                    }
                                    _part.TableCellPr.Shd.Unifill = _unifill;
                                }
                                break;
                            default:
                                break;
                            }
                        }
                        break;
                    case 3:
                        s.SkipRecord();
                        break;
                    default:
                        break;
                    }
                }
                s.Seek2(_end_rec2);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return _part;
    };
    this.ReadTcBdr = function (_part) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                _part.TableCellPr.TableCellBorders.Left = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TableCellPr.TableCellBorders.Left);
                break;
            case 1:
                _part.TableCellPr.TableCellBorders.Right = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TableCellPr.TableCellBorders.Right);
                break;
            case 2:
                _part.TableCellPr.TableCellBorders.Top = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TableCellPr.TableCellBorders.Top);
                break;
            case 3:
                _part.TableCellPr.TableCellBorders.Bottom = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TableCellPr.TableCellBorders.Bottom);
                break;
            case 4:
                _part.TablePr.TableBorders.InsideH = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TablePr.TableBorders.InsideH);
                break;
            case 5:
                _part.TablePr.TableBorders.InsideV = new CDocumentBorder();
                this.ReadTableBorderLineStyle(_part.TablePr.TableBorders.InsideV);
                break;
            case 6:
                case 7:
                s.SkipRecord();
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return _part;
    };
    this.ReadTableBorderLineStyle = function (_border) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var ln = this.ReadLn();
                _border.Unifill = ln.Fill;
                _border.Size = (ln.w == null) ? 12700 : ((ln.w) >> 0);
                _border.Size /= 36000;
                _border.Value = border_Single;
                break;
            case 1:
                _border.LineRef = this.ReadStyleRef();
                _border.Value = border_Single;
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadUniColor = function () {
        var s = this.stream;
        var _len = s.GetULong();
        var read_start = s.cur;
        var read_end = read_start + _len;
        var uni_color = new CUniColor();
        if (s.cur < read_end) {
            var _type = s.GetUChar();
            var _e = s.cur + s.GetULong() + 4;
            switch (_type) {
            case COLOR_TYPE_PRST:
                s.Skip2(2);
                uni_color.setColor(new CPrstColor());
                uni_color.color.setId(s.GetString2());
                s.Skip2(1);
                if (s.cur < _e) {
                    if (0 == s.GetUChar()) {
                        uni_color.setMods(this.ReadColorMods());
                    }
                }
                break;
            case COLOR_TYPE_SCHEME:
                s.Skip2(2);
                uni_color.setColor(new CSchemeColor());
                uni_color.color.setId(s.GetUChar());
                s.Skip2(1);
                if (s.cur < _e) {
                    if (0 == s.GetUChar()) {
                        uni_color.setMods(this.ReadColorMods());
                    }
                }
                break;
            case COLOR_TYPE_SRGB:
                var r, g, b;
                s.Skip2(1);
                uni_color.setColor(new CRGBColor());
                s.Skip2(1);
                r = s.GetUChar();
                s.Skip2(1);
                g = s.GetUChar();
                s.Skip2(1);
                b = s.GetUChar();
                s.Skip2(1);
                uni_color.color.setColor(r, g, b);
                if (s.cur < _e) {
                    if (0 == s.GetUChar()) {
                        uni_color.setMods(this.ReadColorMods());
                    }
                }
                break;
            case COLOR_TYPE_SYS:
                s.Skip2(1);
                uni_color.setColor(new CSysColor());
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        uni_color.color.setId(s.GetString2());
                        break;
                    case 1:
                        uni_color.color.setR(s.GetUChar());
                        break;
                    case 2:
                        uni_color.color.setG(s.GetUChar());
                        break;
                    case 3:
                        uni_color.color.setB(s.GetUChar());
                        break;
                    default:
                        break;
                    }
                }
                if (s.cur < _e) {
                    if (0 == s.GetUChar()) {
                        uni_color.setMods(this.ReadColorMods());
                    }
                }
                break;
            }
        }
        s.Seek2(read_end);
        return uni_color;
    };
    this.ReadColorMods = function () {
        var ret = new CColorModifiers();
        var _mods = this.ReadColorModifiers();
        for (var i = 0; i < _mods.length; ++i) {
            ret.addMod(_mods[i]);
        }
        return ret;
    };
    this.ReadColorModifiers = function () {
        var s = this.stream;
        var _start = s.cur;
        var _end = _start + s.GetULong() + 4;
        var _ret = null;
        var _count = s.GetULong();
        for (var i = 0; i < _count; i++) {
            if (s.cur > _end) {
                break;
            }
            s.Skip2(1);
            var _s1 = s.cur;
            var _e1 = _s1 + s.GetULong() + 4;
            if (_s1 < _e1) {
                s.Skip2(1);
                if (null == _ret) {
                    _ret = [];
                }
                var _mod = new CColorMod();
                _ret[_ret.length] = _mod;
                while (true) {
                    var _type = s.GetUChar();
                    if (0 == _type) {
                        _mod.setName(s.GetString2());
                        var _find = _mod.name.indexOf(":");
                        if (_find >= 0 && _find < (_mod.name.length - 1)) {
                            _mod.setName(_mod.name.substring(_find + 1));
                        }
                    } else {
                        if (1 == _type) {
                            _mod.setVal(s.GetLong());
                        } else {
                            if (g_nodeAttributeEnd == _type) {
                                break;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            s.Seek2(_e1);
        }
        s.Seek2(_end);
        return _ret;
    };
    this.ReadRect = function (bIsMain) {
        var _ret = {};
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                _ret.l = s.GetPercentage();
                break;
            case 1:
                _ret.t = s.GetPercentage();
                break;
            case 2:
                _ret.r = s.GetPercentage();
                break;
            case 3:
                _ret.b = s.GetPercentage();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        if (null == _ret.l && null == _ret.t && null == _ret.r && null == _ret.b) {
            return null;
        }
        if (_ret.l == null) {
            _ret.l = 0;
        }
        if (_ret.t == null) {
            _ret.t = 0;
        }
        if (_ret.r == null) {
            _ret.r = 0;
        }
        if (_ret.b == null) {
            _ret.b = 0;
        }
        if (!bIsMain) {
            var _absW = Math.abs(_ret.l) + Math.abs(_ret.r) + 100;
            var _absH = Math.abs(_ret.t) + Math.abs(_ret.b) + 100;
            _ret.l = -100 * _ret.l / _absW;
            _ret.t = -100 * _ret.t / _absH;
            _ret.r = -100 * _ret.r / _absW;
            _ret.b = -100 * _ret.b / _absH;
        }
        _ret.r = 100 - _ret.r;
        _ret.b = 100 - _ret.b;
        if (_ret.l > _ret.r) {
            var tmp = _ret.l;
            _ret.l = _ret.r;
            _ret.r = tmp;
        }
        if (_ret.t > _ret.b) {
            var tmp = _ret.t;
            _ret.t = _ret.b;
            _ret.b = tmp;
        }
        var ret = new CSrcRect();
        ret.setLTRB(_ret.l, _ret.t, _ret.r, _ret.b);
        return ret;
    };
    this.ReadGradLin = function () {
        var _lin = new GradLin();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                _lin.setAngle(s.GetLong());
                break;
            case 1:
                _lin.setScale(s.GetBool());
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return _lin;
    };
    this.ReadGradPath = function () {
        var _path = new GradPath();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                _path.setPath(s.GetUChar());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return _path;
    };
    this.ReadUniFill = function () {
        var s = this.stream;
        var read_start = s.cur;
        var read_end = read_start + s.GetULong() + 4;
        var uni_fill = new CUniFill();
        if (s.cur < read_end) {
            var _type = s.GetUChar();
            var _e = s.cur + s.GetULong() + 4;
            switch (_type) {
            case FILL_TYPE_BLIP:
                s.Skip2(1);
                uni_fill.setFill(new CBlipFill());
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        s.Skip2(4);
                        break;
                    case 1:
                        s.Skip2(1);
                        break;
                    default:
                        break;
                    }
                }
                while (s.cur < _e) {
                    var rec = s.GetUChar();
                    switch (rec) {
                    case 0:
                        var _s2 = s.cur;
                        var _e2 = _s2 + s.GetLong() + 4;
                        s.Skip2(1);
                        while (true) {
                            var _at = s.GetUChar();
                            if (g_nodeAttributeEnd == _at) {
                                break;
                            }
                            if (_at == 0) {
                                s.Skip2(1);
                            }
                        }
                        while (s.cur < _e2) {
                            var _t = s.GetUChar();
                            switch (_t) {
                            case 0:
                                case 1:
                                s.Skip2(4);
                                break;
                            case 10:
                                case 11:
                                s.GetString2();
                                break;
                            case 2:
                                s.Skip2(4);
                                var count_effects = s.GetLong();
                                for (var _eff = 0; _eff < count_effects; ++_eff) {
                                    s.Skip2(1);
                                    var __rec_len = s.GetLong();
                                    if (0 == __rec_len) {
                                        continue;
                                    }
                                    var recE = s.GetUChar();
                                    if (recE == 21) {
                                        var _e22 = s.cur + s.GetLong() + 4;
                                        s.Skip2(1);
                                        while (true) {
                                            var _at222 = s.GetUChar();
                                            if (g_nodeAttributeEnd == _at222) {
                                                break;
                                            }
                                            if (_at222 == 0) {
                                                uni_fill.setTransparent((255 * s.GetLong() / 100000) >> 0);
                                            }
                                        }
                                        s.Seek2(_e22);
                                    } else {
                                        s.SkipRecord();
                                    }
                                }
                                break;
                            case 3:
                                s.Skip2(6);
                                uni_fill.fill.setRasterImageId(s.GetString2());
                                var _s = uni_fill.fill.RasterImageId;
                                var indS = _s.lastIndexOf("emf");
                                if (indS == -1) {
                                    indS = _s.lastIndexOf("wmf");
                                }
                                if (indS != -1 && (indS == (_s.length - 3))) {
                                    _s = _s.substring(0, indS);
                                    _s += "svg";
                                    uni_fill.fill.setRasterImageId(_s);
                                }
                                if (this.IsThemeLoader) {
                                    uni_fill.fill.setRasterImageId("theme" + (this.Api.ThemeLoader.CurrentLoadThemeIndex + 1) + "/media/" + uni_fill.fill.RasterImageId);
                                }
                                if (this.ImageMapChecker != null) {
                                    this.ImageMapChecker[uni_fill.fill.RasterImageId] = true;
                                }
                                if (this.IsUseFullUrl) {
                                    this.RebuildImages.push(new CBuilderImages(uni_fill.fill, uni_fill.fill.RasterImageId));
                                }
                                s.Skip2(1);
                                break;
                            default:
                                s.SkipRecord();
                                break;
                            }
                        }
                        s.Seek2(_e2);
                        break;
                    case 1:
                        uni_fill.fill.setSrcRect(this.ReadRect(true));
                        break;
                    case 2:
                        uni_fill.fill.setTile(true);
                        s.SkipRecord();
                        break;
                    case 3:
                        var _e2 = s.cur + s.GetLong() + 4;
                        while (s.cur < _e2) {
                            var _t = s.GetUChar();
                            switch (_t) {
                            case 0:
                                var _srcRect = this.ReadRect(false);
                                if (_srcRect != null) {
                                    uni_fill.fill.setSrcRect(_srcRect);
                                }
                                break;
                            default:
                                s.SkipRecord();
                                break;
                            }
                        }
                        s.Seek2(_e2);
                        break;
                    default:
                        var _len = s.GetULong();
                        s.Skip2(_len);
                    }
                }
                break;
            case FILL_TYPE_GRAD:
                s.Skip2(1);
                uni_fill.setFill(new CGradFill());
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        s.Skip2(1);
                        break;
                    case 1:
                        s.Skip2(1);
                        break;
                    default:
                        break;
                    }
                }
                while (s.cur < _e) {
                    var rec = s.GetUChar();
                    switch (rec) {
                    case 0:
                        var _s1 = s.cur;
                        var _e1 = _s1 + s.GetULong() + 4;
                        var _count = s.GetULong();
                        var colors_ = [];
                        for (var i = 0; i < _count; i++) {
                            if (s.cur >= _e1) {
                                break;
                            }
                            s.Skip2(1);
                            s.Skip2(4);
                            var _gs = new CGs();
                            s.Skip2(1);
                            s.Skip2(1);
                            _gs.pos = s.GetLong();
                            s.Skip2(1);
                            s.Skip2(1);
                            _gs.color = this.ReadUniColor();
                            colors_[colors_.length] = _gs;
                        }
                        s.Seek2(_e1);
                        colors_.sort(function (a, b) {
                            return a.pos - b.pos;
                        });
                        for (var z = 0; z < colors_.length; ++z) {
                            uni_fill.fill.addColor(colors_[z]);
                        }
                        break;
                    case 1:
                        uni_fill.fill.setLin(this.ReadGradLin());
                        break;
                    case 2:
                        uni_fill.fill.setPath(this.ReadGradPath());
                        break;
                    case 3:
                        s.SkipRecord();
                        break;
                    default:
                        var _len = s.GetULong();
                        s.Skip2(_len);
                    }
                    if (null != uni_fill.fill.lin && null != uni_fill.fill.path) {
                        uni_fill.fill.setPath(null);
                    }
                }
                break;
            case FILL_TYPE_PATT:
                uni_fill.setFill(new CPattFill());
                s.Skip2(1);
                while (true) {
                    var _atPF = s.GetUChar();
                    if (_atPF == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_atPF) {
                    case 0:
                        uni_fill.fill.setFType(s.GetUChar());
                        break;
                    default:
                        break;
                    }
                }
                while (s.cur < _e) {
                    var rec = s.GetUChar();
                    switch (rec) {
                    case 0:
                        uni_fill.fill.setFgColor(this.ReadUniColor());
                        break;
                    case 1:
                        uni_fill.fill.setBgColor(this.ReadUniColor());
                        break;
                    default:
                        s.SkipRecord();
                    }
                }
                break;
            case FILL_TYPE_SOLID:
                s.Skip2(1);
                uni_fill.setFill(new CSolidFill());
                uni_fill.fill.setColor(this.ReadUniColor());
                if (uni_fill.fill && uni_fill.fill.color && uni_fill.fill.color.Mods && uni_fill.fill.color.Mods.Mods) {
                    var mods = uni_fill.fill.color.Mods.Mods;
                    var _len = mods.length;
                    for (var i = 0; i < _len; i++) {
                        if (mods[i].name == "alpha") {
                            uni_fill.setTransparent((255 * mods[i].val / 100000) >> 0);
                            uni_fill.fill.color.Mods.removeMod(i);
                            break;
                        }
                    }
                } else {
                    uni_fill.fill.color.setMods(new CColorModifiers());
                }
                break;
            case FILL_TYPE_NOFILL:
                uni_fill.setFill(new CNoFill());
                break;
            }
        }
        s.Seek2(read_end);
        return uni_fill;
    };
    this.ReadExtraColorScheme = function () {
        var extra = new ExtraClrScheme();
        var s = this.stream;
        var _e = s.cur + s.GetULong() + 4;
        while (s.cur < _e) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                extra.setClrScheme(new ClrScheme());
                this.ReadClrScheme(extra.clrScheme);
                break;
            case 1:
                extra.setClrMap(new ClrMap());
                this.ReadClrMap(extra.clrMap);
                break;
            default:
                break;
            }
        }
        s.Seek2(_e);
        return extra;
    };
    this.ReadClrScheme = function (clrscheme) {
        var s = this.stream;
        var _e = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                clrscheme.setName(s.GetString2());
            }
        }
        while (s.cur < _e) {
            var _rec = s.GetUChar();
            clrscheme.addColor(_rec, this.ReadUniColor());
        }
        s.Seek2(_e);
    };
    this.ReadClrMap = function (clrmap) {
        var s = this.stream;
        var _e = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            clrmap.setClr(_at, s.GetUChar());
        }
        s.Seek2(_e);
    };
    this.ReadClrOverride = function () {
        var s = this.stream;
        var _e = s.cur + s.GetULong() + 4;
        var clr_map = null;
        if (s.cur < _e) {
            clr_map = new ClrMap();
            s.Skip2(1);
            this.ReadClrMap(clr_map);
        }
        s.Seek2(_e);
        return clr_map;
    };
    this.ReadLn = function () {
        var ln = new CLn();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                ln.setAlgn(s.GetUChar());
                break;
            case 1:
                ln.setCap(s.GetUChar());
                break;
            case 2:
                ln.setCmpd(s.GetUChar());
                break;
            case 3:
                ln.setW(s.GetLong());
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                ln.setFill(this.ReadUniFill());
                break;
            case 1:
                s.SkipRecord();
                break;
            case 2:
                ln.setJoin(this.ReadLineJoin());
                break;
            case 3:
                ln.setHeadEnd(this.ReadLineEnd());
                break;
            case 4:
                ln.setTailEnd(this.ReadLineEnd());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return ln;
    };
    this.ReadLineEnd = function () {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        var endL = new EndArrow();
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                endL.setType(s.GetUChar());
                break;
            case 1:
                endL.setW(s.GetUChar());
                break;
            case 2:
                endL.setLen(s.GetUChar());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return endL;
    };
    this.ReadLineJoin = function () {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        var join = new LineJoin();
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                join.setType(s.GetLong());
                break;
            case 1:
                join.setLimit(s.GetLong());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return join;
    };
    this.ReadSlideMaster = function () {
        var master = new MasterSlide(this.presentation, null);
        this.TempMainObject = master;
        var s = this.stream;
        s.Skip2(1);
        var end = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                master.preserve = s.GetBool();
                break;
            default:
                break;
            }
        }
        while (s.cur < end) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                var cSld = new CSld();
                this.ReadCSld(cSld);
                for (var i = 0; i < cSld.spTree.length; ++i) {
                    master.shapeAdd(i, cSld.spTree[i]);
                }
                if (cSld.Bg) {
                    master.changeBackground(cSld.Bg);
                }
                master.setCSldName(cSld.name);
                break;
            case 1:
                var clrMap = new ClrMap();
                this.ReadClrMap(clrMap);
                master.setClMapOverride(clrMap);
                break;
            case 2:
                case 3:
                case 4:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 5:
                master.hf = this.ReadHF();
                break;
            case 6:
                master.setTxStyles(this.ReadTxStyles());
                break;
            default:
                break;
            }
        }
        s.Seek2(end);
        this.TempMainObject = null;
        return master;
    };
    this.ReadTxStyles = function () {
        var txStyles = new CTextStyles();
        var s = this.stream;
        var end = s.cur + s.GetULong() + 4;
        while (s.cur < end) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                txStyles.titleStyle = this.ReadTextListStyle();
                break;
            case 1:
                txStyles.bodyStyle = this.ReadTextListStyle();
                break;
            case 2:
                txStyles.otherStyle = this.ReadTextListStyle();
                break;
            default:
                break;
            }
        }
        s.Seek2(end);
        return txStyles;
    };
    this.ReadSlideLayout = function () {
        var layout = new SlideLayout(null);
        this.TempMainObject = layout;
        var s = this.stream;
        s.Skip2(1);
        var end = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                layout.setMatchingName(s.GetString2());
                break;
            case 1:
                layout.preserve = s.GetBool();
                break;
            case 2:
                layout.setShowPhAnim(s.GetBool());
                break;
            case 3:
                layout.setShowMasterSp(s.GetBool());
                break;
            case 4:
                layout.userDrawn = s.GetBool();
                break;
            case 5:
                layout.setType(s.GetUChar());
                break;
            default:
                break;
            }
        }
        while (s.cur < end) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                var cSld = new CSld();
                this.ReadCSld(cSld);
                for (var i = 0; i < cSld.spTree.length; ++i) {
                    layout.shapeAdd(i, cSld.spTree[i]);
                }
                if (cSld.Bg) {
                    layout.changeBackground(cSld.Bg);
                }
                layout.setCSldName(cSld.name);
                break;
            case 1:
                layout.setClMapOverride(this.ReadClrOverride());
                break;
            case 4:
                layout.hf = this.ReadHF();
                break;
            default:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            }
        }
        s.Seek2(end);
        this.TempMainObject = null;
        return layout;
    };
    this.ReadSlide = function (sldIndex) {
        var slide = new Slide(this.presentation, null, sldIndex);
        this.TempMainObject = slide;
        slide.maxId = -1;
        var s = this.stream;
        s.Skip2(1);
        var end = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                slide.setShow(s.GetBool());
            } else {
                if (1 == _at) {
                    slide.setShowPhAnim(s.GetBool());
                } else {
                    if (2 == _at) {
                        slide.setShowMasterSp(s.GetBool());
                    }
                }
            }
        }
        while (s.cur < end) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                var cSld = new CSld();
                this.ReadCSld(cSld);
                for (var i = 0; i < cSld.spTree.length; ++i) {
                    slide.shapeAdd(i, cSld.spTree[i]);
                }
                if (cSld.Bg) {
                    slide.changeBackground(cSld.Bg);
                }
                slide.setCSldName(cSld.name);
                break;
            case 1:
                slide.setClMapOverride(this.ReadClrOverride());
                break;
            case 2:
                var _timing = this.ReadTransition();
                slide.applyTiming(_timing);
                break;
            case 4:
                var end2 = s.cur + s.GetLong() + 4;
                while (s.cur < end2) {
                    var _rec2 = s.GetUChar();
                    switch (_rec2) {
                    case 0:
                        s.Skip2(4);
                        var lCount = s.GetULong();
                        for (var i = 0; i < lCount; i++) {
                            s.Skip2(1);
                            var _comment = new CWriteCommentData();
                            var _end_rec3 = s.cur + s.GetLong() + 4;
                            s.Skip2(1);
                            while (true) {
                                var _at3 = s.GetUChar();
                                if (_at3 == g_nodeAttributeEnd) {
                                    break;
                                }
                                switch (_at3) {
                                case 0:
                                    _comment.WriteAuthorId = s.GetLong();
                                    break;
                                case 1:
                                    _comment.WriteTime = s.GetString2();
                                    break;
                                case 2:
                                    _comment.WriteCommentId = s.GetLong();
                                    break;
                                case 3:
                                    _comment.x = s.GetLong();
                                    break;
                                case 4:
                                    _comment.y = s.GetLong();
                                    break;
                                case 5:
                                    _comment.WriteText = s.GetString2();
                                    break;
                                case 6:
                                    _comment.WriteParentAuthorId = s.GetLong();
                                    break;
                                case 7:
                                    _comment.WriteParentCommentId = s.GetLong();
                                    break;
                                case 8:
                                    _comment.AdditionalData = s.GetString2();
                                    break;
                                default:
                                    break;
                                }
                            }
                            s.Seek2(_end_rec3);
                            _comment.Calculate2();
                            slide.writecomments.push(_comment);
                        }
                        break;
                    default:
                        s.SkipRecord();
                        break;
                    }
                }
                s.Seek2(end2);
                break;
            default:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            }
        }
        slide.Load_Comments(this.presentation.CommentAuthors);
        s.Seek2(end);
        this.TempMainObject = null;
        return slide;
    };
    this.ReadTransition = function () {
        var _timing = new CAscSlideTiming();
        _timing.setDefaultParams();
        var s = this.stream;
        var end = s.cur + s.GetULong() + 4;
        if (s.cur == end) {
            return _timing;
        }
        s.Skip2(1);
        var _presentDuration = false;
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                _timing.SlideAdvanceOnMouseClick = s.GetBool();
            } else {
                if (1 == _at) {
                    _timing.SlideAdvanceAfter = true;
                    _timing.SlideAdvanceDuration = s.GetULong();
                } else {
                    if (2 == _at) {
                        _timing.TransitionDuration = s.GetULong();
                        _presentDuration = true;
                    } else {
                        if (3 == _at) {
                            var _spd = s.GetUChar();
                            if (!_presentDuration) {
                                _timing.TransitionDuration = 250;
                                if (_spd == 1) {
                                    _timing.TransitionDuration = 500;
                                } else {
                                    if (_spd == 2) {
                                        _timing.TransitionDuration = 750;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        while (s.cur < end) {
            var _rec = s.GetUChar();
            switch (_rec) {
            case 0:
                var _type = "";
                var _paramNames = [];
                var _paramValues = [];
                var _end_rec2 = s.cur + s.GetULong() + 4;
                s.Skip2(1);
                while (true) {
                    var _at2 = s.GetUChar();
                    if (_at2 == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at2) {
                    case 0:
                        _type = s.GetString2();
                        break;
                    case 1:
                        _paramNames.push(s.GetString2());
                        break;
                    case 2:
                        _paramValues.push(s.GetString2());
                        break;
                    default:
                        break;
                    }
                }
                if (_paramNames.length == _paramValues.length && _type != "") {
                    var _len = _paramNames.length;
                    if ("p:fade" == _type) {
                        _timing.TransitionType = c_oAscSlideTransitionTypes.Fade;
                        _timing.TransitionOption = c_oAscSlideTransitionParams.Fade_Smoothly;
                        if (1 == _len && _paramNames[0] == "thruBlk" && _paramValues[0] == "1") {
                            _timing.TransitionOption = c_oAscSlideTransitionParams.Fade_Through_Black;
                        }
                    } else {
                        if ("p:push" == _type) {
                            _timing.TransitionType = c_oAscSlideTransitionTypes.Push;
                            _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Bottom;
                            if (1 == _len && _paramNames[0] == "dir") {
                                if ("l" == _paramValues[0]) {
                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Right;
                                }
                                if ("r" == _paramValues[0]) {
                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Left;
                                }
                                if ("d" == _paramValues[0]) {
                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Top;
                                }
                            }
                        } else {
                            if ("p:wipe" == _type) {
                                _timing.TransitionType = c_oAscSlideTransitionTypes.Wipe;
                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Right;
                                if (1 == _len && _paramNames[0] == "dir") {
                                    if ("u" == _paramValues[0]) {
                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Bottom;
                                    }
                                    if ("r" == _paramValues[0]) {
                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Left;
                                    }
                                    if ("d" == _paramValues[0]) {
                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Top;
                                    }
                                }
                            } else {
                                if ("p:strips" == _type) {
                                    _timing.TransitionType = c_oAscSlideTransitionTypes.Wipe;
                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopRight;
                                    if (1 == _len && _paramNames[0] == "dir") {
                                        if ("rd" == _paramValues[0]) {
                                            _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopLeft;
                                        }
                                        if ("ru" == _paramValues[0]) {
                                            _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomLeft;
                                        }
                                        if ("lu" == _paramValues[0]) {
                                            _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomRight;
                                        }
                                    }
                                } else {
                                    if ("p:cover" == _type) {
                                        _timing.TransitionType = c_oAscSlideTransitionTypes.Cover;
                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Right;
                                        if (1 == _len && _paramNames[0] == "dir") {
                                            if ("u" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Bottom;
                                            }
                                            if ("r" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Left;
                                            }
                                            if ("d" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Top;
                                            }
                                            if ("rd" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopLeft;
                                            }
                                            if ("ru" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomLeft;
                                            }
                                            if ("lu" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomRight;
                                            }
                                            if ("ld" == _paramValues[0]) {
                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopRight;
                                            }
                                        }
                                    } else {
                                        if ("p:pull" == _type) {
                                            _timing.TransitionType = c_oAscSlideTransitionTypes.UnCover;
                                            _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Right;
                                            if (1 == _len && _paramNames[0] == "dir") {
                                                if ("u" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Bottom;
                                                }
                                                if ("r" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Left;
                                                }
                                                if ("d" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_Top;
                                                }
                                                if ("rd" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopLeft;
                                                }
                                                if ("ru" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomLeft;
                                                }
                                                if ("lu" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_BottomRight;
                                                }
                                                if ("ld" == _paramValues[0]) {
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Param_TopRight;
                                                }
                                            }
                                        } else {
                                            if ("p:split" == _type) {
                                                _timing.TransitionType = c_oAscSlideTransitionTypes.Split;
                                                var _is_vert = true;
                                                var _is_out = true;
                                                for (var i = 0; i < _len; i++) {
                                                    if (_paramNames[i] == "orient") {
                                                        _is_vert = (_paramValues[i] == "vert") ? true : false;
                                                    } else {
                                                        if (_paramNames[i] == "dir") {
                                                            _is_out = (_paramValues[i] == "out") ? true : false;
                                                        }
                                                    }
                                                }
                                                if (_is_vert) {
                                                    if (_is_out) {
                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Split_VerticalOut;
                                                    } else {
                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Split_VerticalIn;
                                                    }
                                                } else {
                                                    if (_is_out) {
                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Split_HorizontalOut;
                                                    } else {
                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Split_HorizontalIn;
                                                    }
                                                }
                                            } else {
                                                if ("p:wheel" == _type) {
                                                    _timing.TransitionType = c_oAscSlideTransitionTypes.Clock;
                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Clock_Clockwise;
                                                } else {
                                                    if ("p14:wheelReverse" == _type) {
                                                        _timing.TransitionType = c_oAscSlideTransitionTypes.Clock;
                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Clock_Counterclockwise;
                                                    } else {
                                                        if ("p:wedge" == _type) {
                                                            _timing.TransitionType = c_oAscSlideTransitionTypes.Clock;
                                                            _timing.TransitionOption = c_oAscSlideTransitionParams.Clock_Wedge;
                                                        } else {
                                                            if ("p14:warp" == _type) {
                                                                _timing.TransitionType = c_oAscSlideTransitionTypes.Zoom;
                                                                _timing.TransitionOption = c_oAscSlideTransitionParams.Zoom_Out;
                                                                if (1 == _len && _paramNames[0] == "dir") {
                                                                    if ("in" == _paramValues[0]) {
                                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Zoom_In;
                                                                    }
                                                                }
                                                            } else {
                                                                if ("p:newsflash" == _type) {
                                                                    _timing.TransitionType = c_oAscSlideTransitionTypes.Zoom;
                                                                    _timing.TransitionOption = c_oAscSlideTransitionParams.Zoom_AndRotate;
                                                                } else {
                                                                    if ("p:none" != _type) {
                                                                        _timing.TransitionType = c_oAscSlideTransitionTypes.Fade;
                                                                        _timing.TransitionOption = c_oAscSlideTransitionParams.Fade_Smoothly;
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
                s.Seek2(_end_rec2);
                break;
            default:
                s.SkipRecord();
                break;
            }
        }
        s.Seek2(end);
        return _timing;
    };
    this.ReadHF = function () {
        var hf = new HF();
        var s = this.stream;
        var _e = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                hf.dt = s.GetBool();
            } else {
                if (1 == _at) {
                    hf.ftr = s.GetBool();
                } else {
                    if (2 == _at) {
                        hf.hdr = s.GetBool();
                    } else {
                        if (3 == _at) {
                            hf.sldNum = s.GetBool();
                        }
                    }
                }
            }
        }
        s.Seek2(_e);
        return hf;
    };
    this.ReadNoteMaster = function () {
        return null;
    };
    this.ReadNote = function () {
        return null;
    };
    this.ReadCSld = function (csld) {
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                csld.name = s.GetString2();
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                csld.Bg = this.ReadBg();
                break;
            case 1:
                csld.spTree = this.ReadGroupShapeMain();
                break;
            default:
                s.Seek2(_end_rec);
                return;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadBg = function () {
        var bg = new CBg();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetLong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                bg.bwMode = s.GetUChar();
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                bg.bgPr = this.ReadBgPr();
                break;
            case 1:
                bg.bgRef = this.ReadStyleRef();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return bg;
    };
    this.ReadBgPr = function () {
        var bgpr = new CBgPr();
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                bgpr.shadeToTitle = s.GetBool();
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                bgpr.Fill = this.ReadUniFill();
                break;
            case 1:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return bgpr;
    };
    this.ReadStyleRef = function () {
        var ref = new StyleRef();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                ref.setIdx(s.GetLong());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                ref.setColor(this.ReadUniColor());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return ref;
    };
    this.ReadFontRef = function () {
        var ref = new FontRef();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                ref.setIdx(s.GetUChar());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                ref.setColor(this.ReadUniColor());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return ref;
    };
    this.ReadTheme = function () {
        var theme = new CTheme();
        theme.presentation = this.presentation;
        var s = this.stream;
        var type = s.GetUChar();
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                theme.name = s.GetString2();
            } else {
                if (1 == _at) {
                    theme.isThemeOverride = s.GetBool();
                } else {
                    break;
                }
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var themeElements = new ThemeElements();
                this.ReadThemeElements(themeElements);
                theme.setFontScheme(themeElements.fontScheme);
                theme.setFormatScheme(themeElements.fmtScheme);
                theme.changeColorScheme(themeElements.clrScheme);
                break;
            case 1:
                theme.spDef = this.ReadDefaultShapeProperties();
                break;
            case 2:
                theme.lnDef = this.ReadDefaultShapeProperties();
                break;
            case 3:
                theme.txDef = this.ReadDefaultShapeProperties();
                break;
            case 4:
                s.Skip2(4);
                var _len = s.GetULong();
                for (var i = 0; i < _len; i++) {
                    s.Skip2(1);
                    theme.extraClrSchemeLst[i] = this.ReadExtraColorScheme();
                }
            }
        }
        s.Seek2(_end_rec);
        return theme;
    };
    this.ReadThemeElements = function (thelems) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                this.ReadClrScheme(thelems.clrScheme);
                break;
            case 1:
                this.ReadFontScheme(thelems.fontScheme);
                break;
            case 2:
                this.ReadFmtScheme(thelems.fmtScheme);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadFontScheme = function (fontscheme) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                fontscheme.setName(s.GetString2());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                this.ReadFontCollection(fontscheme.majorFont);
                break;
            case 1:
                this.ReadFontCollection(fontscheme.minorFont);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadFontCollection = function (fontcolls) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                fontcolls.setLatin(this.ReadTextFontTypeface());
                break;
            case 1:
                fontcolls.setEA(this.ReadTextFontTypeface());
                break;
            case 2:
                fontcolls.setCS(this.ReadTextFontTypeface());
                break;
            case 3:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadTextFontTypeface = function () {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var charset = "";
        var panose = "";
        var pitchFamily = "";
        var typeface = "";
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                charset = s.GetString2();
                break;
            case 1:
                panose = s.GetString2();
                break;
            case 2:
                pitchFamily = s.GetString2();
                break;
            case 3:
                typeface = s.GetString2();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return typeface;
    };
    this.ReadFmtScheme = function (fmt) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                fmt.setName(s.GetString2());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    fmt.fillStyleLst[i] = this.ReadUniFill();
                }
                break;
            case 1:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    fmt.lnStyleLst[i] = this.ReadLn();
                }
                break;
            case 2:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 3:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    fmt.bgFillStyleLst[i] = this.ReadUniFill();
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadDefaultShapeProperties = function () {
        var def = new DefaultShapeDefinition();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                this.ReadSpPr(def.spPr);
                break;
            case 1:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 2:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 3:
                def.style = this.ReadShapeStyle();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return def;
    };
    this.ReadSpPr = function (spPr) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                spPr.setBwMode(s.GetUChar());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                spPr.setXfrm(this.ReadXfrm());
                spPr.xfrm.setParent(spPr);
                break;
            case 1:
                spPr.setGeometry(this.ReadGeometry(spPr.xfrm));
                if (spPr.geometry) {
                    spPr.geometry.setParent(spPr);
                }
                break;
            case 2:
                spPr.setFill(this.ReadUniFill());
                break;
            case 3:
                spPr.setLn(this.ReadLn());
                break;
            case 4:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 5:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 6:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadGrSpPr = function (spPr) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            if (0 == _at) {
                spPr.setBwMode(s.GetUChar());
            } else {
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                spPr.setXfrm(this.ReadXfrm());
                spPr.xfrm.setParent(spPr);
                break;
            case 1:
                spPr.setFill(this.ReadUniFill());
                break;
            case 2:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 3:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadXfrm = function () {
        var ret = new CXfrm();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                ret.setOffX(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 1:
                ret.setOffY(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 2:
                ret.setExtX(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 3:
                ret.setExtY(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 4:
                ret.setChOffX(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 5:
                ret.setChOffY(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 6:
                ret.setChExtX(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 7:
                ret.setChExtY(s.GetLong() / c_dScalePPTXSizes);
                break;
            case 8:
                ret.setFlipH(s.GetBool());
                break;
            case 9:
                ret.setFlipV(s.GetBool());
                break;
            case 10:
                ret.setRot((s.GetLong() / 60000) * Math.PI / 180);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return ret;
    };
    this.ReadShapeStyle = function () {
        var def = new CShapeStyle();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                def.setLnRef(this.ReadStyleRef());
                break;
            case 1:
                def.setFillRef(this.ReadStyleRef());
                break;
            case 2:
                def.setEffectRef(this.ReadStyleRef());
                break;
            case 3:
                def.setFontRef(this.ReadFontRef());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return def;
    };
    this.ReadGeometry = function (_xfrm) {
        var geom = null;
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        if (s.cur < _end_rec) {
            var _t = s.GetUChar();
            if (1 == _t) {
                var _len = s.GetULong();
                var _s = s.cur;
                var _e = _s + _len;
                s.Skip2(1);
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    if (0 == _at) {
                        var tmpStr = s.GetString2();
                        geom = CreateGeometry(tmpStr);
                        geom.isLine = tmpStr == "line";
                        geom.setPreset(tmpStr);
                    } else {
                        break;
                    }
                }
                while (s.cur < _e) {
                    var _at = s.GetUChar();
                    switch (_at) {
                    case 0:
                        this.ReadGeomAdj(geom);
                        break;
                    default:
                        break;
                    }
                }
            } else {
                if (2 == _t) {
                    var _len = s.GetULong();
                    var _s = s.cur;
                    var _e = _s + _len;
                    geom = CreateGeometry("");
                    geom.preset = null;
                    while (s.cur < _e) {
                        var _at = s.GetUChar();
                        switch (_at) {
                        case 0:
                            this.ReadGeomAdj(geom);
                            break;
                        case 1:
                            this.ReadGeomGd(geom);
                            break;
                        case 2:
                            this.ReadGeomAh(geom);
                            break;
                        case 3:
                            this.ReadGeomCxn(geom);
                            break;
                        case 4:
                            this.ReadGeomPathLst(geom, _xfrm);
                            break;
                        case 5:
                            this.ReadGeomRect(geom);
                            break;
                        default:
                            break;
                        }
                    }
                }
            }
        }
        s.Seek2(_end_rec);
        return geom;
    };
    this.ReadGeomAdj = function (geom) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _c = s.GetULong();
        for (var i = 0; i < _c; i++) {
            s.Skip2(6);
            var arr = [];
            var cp = 0;
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                if (cp == 1) {
                    arr[cp] = s.GetLong();
                } else {
                    arr[cp] = s.GetString2();
                }
                cp++;
            }
            if (arr.length >= 3) {
                geom.AddAdj(arr[0], arr[1], arr[2]);
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadGeomGd = function (geom) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _c = s.GetULong();
        for (var i = 0; i < _c; i++) {
            s.Skip2(6);
            var arr = [];
            var cp = 0;
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                if (cp == 1) {
                    arr[cp] = s.GetLong();
                } else {
                    arr[cp] = s.GetString2();
                }
                cp++;
            }
            geom.AddGuide(arr[0], arr[1], arr[2], arr[3], arr[4]);
        }
        s.Seek2(_end_rec);
    };
    this.ReadGeomAh = function (geom) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _c = s.GetULong();
        for (var i = 0; i < _c; i++) {
            var _type1 = s.GetUChar();
            s.Skip2(4);
            var _type = s.GetUChar();
            s.Skip2(5);
            var arr = [];
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                arr[_at] = s.GetString2();
            }
            if (1 == _type) {
                geom.AddHandlePolar(arr[2], arr[6], arr[4], arr[3], arr[7], arr[5], arr[0], arr[1]);
            } else {
                geom.AddHandleXY(arr[2], arr[6], arr[4], arr[3], arr[7], arr[5], arr[0], arr[1]);
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadGeomCxn = function (geom) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _c = s.GetULong();
        for (var i = 0; i < _c; i++) {
            var _type = s.GetUChar();
            s.Skip2(5);
            var arr = [];
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                arr[_at] = s.GetString2();
            }
            geom.AddCnx(arr[2], arr[0], arr[1]);
        }
        s.Seek2(_end_rec);
    };
    this.ReadGeomRect = function (geom) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        var arr = [];
        arr[0] = "l";
        arr[1] = "t";
        arr[2] = "r";
        arr[3] = "b";
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            arr[_at] = s.GetString2();
        }
        geom.AddRect(arr[0], arr[1], arr[2], arr[3]);
        s.Seek2(_end_rec);
    };
    this.ReadGeomPathLst = function (geom, _xfrm) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _c = s.GetULong();
        for (var i = 0; i < _c; i++) {
            var _type = s.GetUChar();
            var _len = s.GetULong();
            var _s = s.cur;
            var _e = _s + _len;
            s.Skip2(1);
            var extrusionOk = false;
            var fill = 5;
            var stroke = true;
            var w = undefined;
            var h = undefined;
            while (true) {
                var _at = s.GetUChar();
                if (_at == g_nodeAttributeEnd) {
                    break;
                }
                switch (_at) {
                case 0:
                    extrusionOk = s.GetBool();
                    break;
                case 1:
                    fill = s.GetUChar();
                    break;
                case 2:
                    h = s.GetLong();
                    break;
                case 3:
                    stroke = s.GetBool();
                    break;
                case 4:
                    w = s.GetLong();
                    break;
                default:
                    break;
                }
            }
            geom.AddPathCommand(0, extrusionOk, (fill == 4) ? "none" : "norm", stroke, w, h);
            var isKoords = false;
            while (s.cur < _e) {
                var _at = s.GetUChar();
                switch (_at) {
                case 0:
                    s.Skip2(4);
                    var _cc = s.GetULong();
                    for (var j = 0; j < _cc; j++) {
                        s.Skip2(5);
                        isKoords |= this.ReadUniPath2D(geom);
                    }
                    break;
                default:
                    break;
                }
            }
            s.Seek2(_e);
        }
        var _path = geom.pathLst[geom.pathLst.length - 1];
        if (isKoords && undefined === _path.pathW && undefined === _path.pathH) {
            _path.pathW = _xfrm.extX * c_dScalePPTXSizes;
            _path.pathH = _xfrm.extY * c_dScalePPTXSizes;
            if (_path.pathW != undefined) {
                _path.divPW = 100 / _path.pathW;
                _path.divPH = 100 / _path.pathH;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadUniPath2D = function (geom) {
        var s = this.stream;
        var _type = s.GetUChar();
        var _len = s.GetULong();
        var _s = s.cur;
        var _e = _s + _len;
        if (3 == _type) {
            geom.AddPathCommand(6);
            s.Seek2(_e);
            return;
        }
        s.Skip2(1);
        var isKoord = false;
        var arr = [];
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            arr[_at] = s.GetString2();
            if (!isKoord && !isNaN(parseInt(arr[_at]))) {
                isKoord = true;
            }
        }
        switch (_type) {
        case 1:
            geom.AddPathCommand(1, arr[0], arr[1]);
            break;
        case 2:
            geom.AddPathCommand(2, arr[0], arr[1]);
            break;
        case 3:
            geom.AddPathCommand(6);
            break;
        case 4:
            geom.AddPathCommand(5, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
            break;
        case 5:
            geom.AddPathCommand(3, arr[0], arr[1], arr[2], arr[3]);
            break;
        case 6:
            geom.AddPathCommand(4, arr[0], arr[1], arr[2], arr[3]);
            break;
        default:
            break;
        }
        s.Seek2(_e);
        return isKoord;
    };
    this.ReadGraphicObject = function () {
        var s = this.stream;
        var _type = s.GetUChar();
        var _object = null;
        switch (_type) {
        case 1:
            _object = this.ReadShape();
            break;
        case 2:
            _object = this.ReadPic();
            break;
        case 3:
            _object = this.ReadCxn();
            break;
        case 4:
            _object = this.ReadGroupShape();
            break;
        case 5:
            _object = this.ReadGrFrame();
        default:
            break;
        }
        return _object;
    };
    this.ReadShape = function () {
        var s = this.stream;
        var shape = new CShape(this.TempMainObject);
        if (null != this.TempGroupObject) {
            shape.Container = this.TempGroupObject;
        }
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        shape.setBDeleted(false);
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                shape.attrUseBgFill = s.GetBool();
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                shape.setNvSpPr(this.ReadNvUniProp());
                break;
            case 1:
                var sp_pr = new CSpPr();
                this.ReadSpPr(sp_pr);
                shape.setSpPr(sp_pr);
                sp_pr.setParent(shape);
                break;
            case 2:
                shape.setStyle(this.ReadShapeStyle());
                break;
            case 3:
                shape.setTxBody(this.ReadTextBody(shape));
                shape.txBody.setParent(shape);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return shape;
    };
    this.ReadGroupShape = function () {
        var s = this.stream;
        var shape = new CGroupShape();
        shape.setBDeleted(false);
        this.TempGroupObject = shape;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                shape.setNvSpPr(this.ReadNvUniProp());
                break;
            case 1:
                var spPr = new CSpPr();
                this.ReadGrSpPr(spPr);
                shape.setSpPr(spPr);
                spPr.setParent(shape);
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    var __len = s.GetULong();
                    if (__len == 0) {
                        continue;
                    }
                    var _type = s.GetUChar();
                    var _object = null;
                    switch (_type) {
                    case 1:
                        _object = this.ReadShape();
                        if (!IsHiddenObj(_object)) {
                            shape.addToSpTree(shape.spTree.length, _object);
                            shape.spTree[shape.spTree.length - 1].setGroup(shape);
                        }
                        break;
                    case 2:
                        _object = this.ReadPic();
                        if (!IsHiddenObj(_object)) {
                            shape.addToSpTree(shape.spTree.length, _object);
                            shape.spTree[shape.spTree.length - 1].setGroup(shape);
                        }
                        break;
                    case 3:
                        _object = this.ReadCxn();
                        if (!IsHiddenObj(_object)) {
                            shape.addToSpTree(shape.spTree.length, _object);
                            shape.spTree[shape.spTree.length - 1].setGroup(shape);
                        }
                        break;
                    case 4:
                        _object = this.ReadGroupShape();
                        if (!IsHiddenObj(_object)) {
                            shape.addToSpTree(shape.spTree.length, _object);
                            shape.spTree[shape.spTree.length - 1].setGroup(shape);
                            this.TempGroupObject = shape;
                        }
                        break;
                    case 5:
                        var _ret = null;
                        if ("undefined" != typeof(CGraphicFrame)) {
                            _ret = this.ReadGrFrame();
                        } else {
                            _ret = this.ReadChartDataInGroup(shape);
                        }
                        if (null != _ret) {
                            shape.addToSpTree(shape.spTree.length, _ret);
                            shape.spTree[shape.spTree.length - 1].setGroup(shape);
                        }
                        break;
                    default:
                        break;
                    }
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        this.TempGroupObject = null;
        return shape;
    };
    this.ReadGroupShapeMain = function () {
        var s = this.stream;
        var shapes = [];
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(5);
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 1:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    var __len = s.GetULong();
                    if (__len == 0) {
                        continue;
                    }
                    var _type = s.GetUChar();
                    switch (_type) {
                    case 1:
                        var _object = this.ReadShape();
                        if (!IsHiddenObj(_object)) {
                            shapes[shapes.length] = _object;
                            _object.setParent2(this.TempMainObject);
                        }
                        break;
                    case 2:
                        var _object = this.ReadPic();
                        if (!IsHiddenObj(_object)) {
                            shapes[shapes.length] = _object;
                            _object.setParent2(this.TempMainObject);
                        }
                        break;
                    case 3:
                        var _object = this.ReadCxn();
                        if (!IsHiddenObj(_object)) {
                            shapes[shapes.length] = _object;
                            _object.setParent2(this.TempMainObject);
                        }
                        break;
                    case 4:
                        var _object = this.ReadGroupShape();
                        if (!IsHiddenObj(_object)) {
                            shapes[shapes.length] = _object;
                            _object.setParent2(this.TempMainObject);
                        }
                        break;
                    case 5:
                        var _ret = this.ReadGrFrame();
                        if (null != _ret) {
                            shapes[shapes.length] = _ret;
                            _ret.setParent2(this.TempMainObject);
                        }
                        break;
                    default:
                        break;
                    }
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return shapes;
    };
    this.ReadPic = function () {
        var s = this.stream;
        var pic = new CImageShape(this.TempMainObject);
        pic.setBDeleted(false);
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                pic.setNvSpPr(this.ReadNvUniProp());
                break;
            case 1:
                pic.setBlipFill(this.ReadUniFill().fill);
                break;
            case 2:
                var spPr = new CSpPr();
                spPr.setParent(pic);
                this.ReadSpPr(spPr);
                pic.setSpPr(spPr);
                break;
            case 3:
                pic.setStyle(this.ReadShapeStyle());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return pic;
    };
    this.ReadCxn = function () {
        var s = this.stream;
        var shape = new CShape();
        shape.setBDeleted(false);
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                shape.setNvSpPr(this.ReadNvUniProp());
                break;
            case 1:
                var spPr = new CSpPr();
                spPr.setParent(shape);
                this.ReadSpPr(spPr);
                shape.setSpPr(spPr);
                break;
            case 2:
                shape.setStyle(this.ReadShapeStyle());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return shape;
    };
    this.ReadChartDataInGroup = function (group) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        this.TempGroupObject = group;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var spid = s.GetString2();
                break;
            default:
                break;
            }
        }
        var _nvGraphicFramePr = null;
        var _xfrm = null;
        var _chart = null;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                _nvGraphicFramePr = this.ReadNvUniProp();
                break;
            case 1:
                _xfrm = this.ReadXfrm();
                break;
            case 2:
                s.SkipRecord();
                break;
            case 3:
                var _length = s.GetLong();
                var _pos = s.cur;
                var _stream = new FT_Stream2();
                _stream.data = s.data;
                _stream.pos = s.pos;
                _stream.cur = s.cur;
                _stream.size = s.size;
                _chart = new CChartSpace();
                _chart.setBDeleted(false);
                var oBinaryChartReader = new BinaryChartReader(_stream);
                oBinaryChartReader.ExternalReadCT_ChartSpace(_length, _chart, this.presentation);
                _chart.setBDeleted(false);
                if (_xfrm) {
                    if (!_chart.spPr) {
                        _chart.setSpPr(new CSpPr());
                        _chart.spPr.setParent(_chart);
                    }
                    _chart.spPr.setXfrm(_xfrm);
                    _xfrm.setParent(_chart.spPr);
                }
                s.Seek2(_pos + _length);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        this.TempGroupObject = null;
        if (_chart == null) {
            return null;
        }
        return _chart;
    };
    this.ReadGrFrame = function () {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var _graphic_frame = new CGraphicFrame();
        _graphic_frame.setParent2(this.TempMainObject);
        this.TempGroupObject = _graphic_frame;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var spid = s.GetString2();
                break;
            default:
                break;
            }
        }
        var _nvGraphicFramePr = null;
        var _xfrm = null;
        var _table = null;
        var _chart = null;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                _nvGraphicFramePr = this.ReadNvUniProp();
                break;
            case 1:
                _xfrm = this.ReadXfrm();
                break;
            case 2:
                _table = this.ReadTable(_xfrm, _graphic_frame);
                break;
            case 3:
                var _length = s.GetLong();
                var _pos = s.cur;
                if (typeof CChartSpace !== "undefined") {
                    var _stream = new FT_Stream2();
                    _stream.data = s.data;
                    _stream.pos = s.pos;
                    _stream.cur = s.cur;
                    _stream.size = s.size;
                    _chart = new CChartSpace();
                    _chart.setBDeleted(false);
                    window.global_pptx_content_loader.ImageMapChecker = this.ImageMapChecker;
                    window.global_pptx_content_loader.Reader.ImageMapChecker = this.ImageMapChecker;
                    var oBinaryChartReader = new BinaryChartReader(_stream);
                    oBinaryChartReader.ExternalReadCT_ChartSpace(_length, _chart, this.presentation);
                }
                s.Seek2(_pos + _length);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        this.TempGroupObject = null;
        if (_table == null && _chart == null) {
            return null;
        }
        if (_table != null) {
            if (!_graphic_frame.spPr) {
                _graphic_frame.setSpPr(new CSpPr());
                _graphic_frame.spPr.setParent(_graphic_frame);
            }
            _graphic_frame.spPr.setXfrm(_xfrm);
            _xfrm.setParent(_graphic_frame.spPr);
            _graphic_frame.setSpPr(_graphic_frame.spPr);
            _graphic_frame.setNvSpPr(_nvGraphicFramePr);
            _graphic_frame.setGraphicObject(_table);
            _graphic_frame.setBDeleted(false);
        } else {
            if (_chart != null) {
                if (!_chart.spPr) {
                    _chart.setSpPr(new CSpPr());
                    _chart.spPr.setParent(_chart);
                }
                _chart.spPr.setXfrm(_xfrm);
                _xfrm.setParent(_chart.spPr);
                return _chart;
            }
        }
        return _graphic_frame;
    };
    this.ReadNvUniProp = function () {
        var prop = new UniNvPr();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                this.ReadCNvPr(prop.cNvPr);
                break;
            case 1:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            case 2:
                this.ReadNvPr(prop.nvPr);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return prop;
    };
    this.ReadCNvPr = function (cNvPr) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                cNvPr.id = s.GetLong();
                if (this.TempMainObject && cNvPr.id > this.TempMainObject.maxId) {
                    this.TempMainObject.maxId = cNvPr.id;
                }
                break;
            case 1:
                cNvPr.name = s.GetString2();
                break;
            case 2:
                cNvPr.isHidden = (1 == s.GetUChar()) ? true : false;
                break;
            case 3:
                s.GetString2();
                break;
            case 4:
                s.GetString2();
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadTable = function (_xfrm, _graphic_frame) {
        if (_xfrm == null) {
            this.stream.SkipRecord();
            return null;
        }
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        var cols = null;
        var rows = null;
        var _return_to_rows = 0;
        var props = null;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                props = this.ReadTablePr();
                break;
            case 1:
                s.Skip2(4);
                var _len = s.GetULong();
                cols = new Array(_len);
                for (var i = 0; i < _len; i++) {
                    s.Skip2(7);
                    cols[i] = s.GetULong() / 36000;
                    s.Skip2(1);
                }
                break;
            case 2:
                var _end_rec2 = s.cur + s.GetULong() + 4;
                rows = s.GetULong();
                _return_to_rows = s.cur;
                s.Seek2(_end_rec2);
                break;
            default:
                break;
            }
        }
        var _table = new CTable(this.presentation.DrawingDocument, _graphic_frame, true, 0, 0, 0, _xfrm.extX, 100000, rows, cols.length, cols, true);
        if (null != props) {
            var style;
            if (this.map_table_styles[props.style]) {
                _table.Set_TableStyle(this.map_table_styles[props.style].Id);
            }
            _table.Set_Pr(props.props);
            _table.Set_TableLook(props.look);
        }
        _table.Set_TableLayout(tbllayout_Fixed);
        s.Seek2(_return_to_rows);
        for (var i = 0; i < rows; i++) {
            s.Skip2(1);
            this.ReadTableRow(_table.Content[i]);
        }
        s.Seek2(_end_rec);
        return _table;
    };
    this.ReadTableRow = function (row) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                row.Set_Height(s.GetULong() / 36000, heightrule_AtLeast);
                break;
            default:
                break;
            }
        }
        s.Skip2(5);
        var _count = s.GetULong();
        if (true) {
            for (var i = 0; i < _count; i++) {
                s.Skip2(1);
                var bIsNoHMerge = this.ReadCell(row.Content[i]);
                if (bIsNoHMerge === false) {
                    row.Remove_Cell(i);
                    i--;
                    _count--;
                }
                var _gridCol = 1;
                if ("number" == typeof(row.Content[i].Pr.GridSpan)) {
                    _gridCol = row.Content[i].Pr.GridSpan;
                }
                if (_gridCol > (_count - i)) {
                    _gridCol = _count - i;
                    row.Content[i].Pr.GridSpan = _gridCol;
                    if (1 == row.Content[i].Pr.GridSpan) {
                        row.Content[i].Pr.GridSpan = undefined;
                    }
                }
                _gridCol--;
                while (_gridCol > 0) {
                    i++;
                    if (i >= _count) {
                        break;
                    }
                    s.Skip2(1);
                    this.ReadCell(row.Content[i]);
                    row.Remove_Cell(i);
                    i--;
                    _count--;
                    --_gridCol;
                }
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadCell = function (cell) {
        cell.Content.Internal_Content_RemoveAll();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var _id = s.GetString2();
                break;
            case 1:
                var rowSpan = s.GetULong();
                if (1 < rowSpan) {
                    cell.Set_VMerge(vmerge_Restart);
                }
                break;
            case 2:
                cell.Set_GridSpan(s.GetULong());
                break;
            case 3:
                var bIsHMerge = s.GetBool();
                if (bIsHMerge) {
                    s.Seek2(_end_rec);
                    return false;
                }
                break;
            case 4:
                var bIsVMerge = s.GetBool();
                if (bIsVMerge && cell.Pr.VMerge != vmerge_Restart) {
                    cell.Set_VMerge(vmerge_Continue);
                }
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var props = new CTableCellPr();
                this.ReadCellProps(props);
                props.Merge(cell.Pr);
                cell.Set_Pr(props);
                break;
            case 1:
                this.ReadTextBody2(cell.Content);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return true;
    };
    this.ReadCellProps = function (props) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                if (props.TableCellMar == null) {
                    props.TableCellMar = {};
                }
                props.TableCellMar.Left = new CTableMeasurement(tblwidth_Mm, s.GetULong() / 36000);
                break;
            case 1:
                if (props.TableCellMar == null) {
                    props.TableCellMar = {};
                }
                props.TableCellMar.Top = new CTableMeasurement(tblwidth_Mm, s.GetULong() / 36000);
                break;
            case 2:
                if (props.TableCellMar == null) {
                    props.TableCellMar = {};
                }
                props.TableCellMar.Right = new CTableMeasurement(tblwidth_Mm, s.GetULong() / 36000);
                break;
            case 3:
                if (props.TableCellMar == null) {
                    props.TableCellMar = {};
                }
                props.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Mm, s.GetULong() / 36000);
                break;
            case 4:
                s.Skip2(1);
                break;
            case 5:
                s.Skip2(1);
                break;
            case 6:
                s.Skip2(1);
                break;
            case 7:
                s.Skip2(1);
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                if (!props.TableCellBorders) {
                    props.TableCellBorders = {};
                }
                props.TableCellBorders.Left = this.ReadTableBorderLn();
                break;
            case 1:
                if (!props.TableCellBorders) {
                    props.TableCellBorders = {};
                }
                props.TableCellBorders.Top = this.ReadTableBorderLn();
                break;
            case 2:
                if (!props.TableCellBorders) {
                    props.TableCellBorders = {};
                }
                props.TableCellBorders.Right = this.ReadTableBorderLn();
                break;
            case 3:
                if (!props.TableCellBorders) {
                    props.TableCellBorders = {};
                }
                props.TableCellBorders.Bottom = this.ReadTableBorderLn();
                break;
            case 4:
                s.SkipRecord();
                break;
            case 5:
                s.SkipRecord();
                break;
            case 6:
                var _unifill = this.ReadUniFill();
                if (_unifill.fill !== undefined && _unifill.fill != null) {
                    props.Shd = new CDocumentShd();
                    props.Shd.Value = shd_Clear;
                    props.Shd.Unifill = _unifill;
                }
                break;
            case 7:
                s.SkipRecord();
                break;
            default:
                s.SkipRecord();
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadTableBorderLn = function () {
        var ln = this.ReadLn();
        var border = new CDocumentBorder();
        border.Unifill = ln.Fill;
        border.Size = (ln.w == null) ? 12700 : ((ln.w) >> 0);
        border.Size /= 36000;
        border.Value = border_Single;
        return border;
    };
    this.ReadTablePr = function () {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        var obj = {};
        obj.props = new CTablePr();
        obj.look = new CTableLook(false, false, false, false, false, false);
        obj.style = -1;
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                obj.style = s.GetString2();
                break;
            case 1:
                s.Skip2(1);
                break;
            case 2:
                obj.look.m_bFirst_Row = s.GetBool();
                break;
            case 3:
                obj.look.m_bFirst_Col = s.GetBool();
                break;
            case 4:
                obj.look.m_bLast_Row = s.GetBool();
                break;
            case 5:
                obj.look.m_bLast_Col = s.GetBool();
                break;
            case 6:
                obj.look.m_bBand_Hor = s.GetBool();
                break;
            case 7:
                obj.look.m_bBand_Ver = s.GetBool();
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                var _unifill = this.ReadUniFill();
                if (_unifill.fill !== undefined && _unifill.fill != null) {
                    obj.props.Shd = new CDocumentShd();
                    obj.props.Shd.Value = shd_Clear;
                    obj.props.Shd.Unifill = _unifill;
                }
                break;
            default:
                s.SkipRecord();
                break;
            }
        }
        s.Seek2(_end_rec);
        return obj;
    };
    this.ReadNvPr = function (nvPr) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                nvPr.setIsPhoto(s.GetBool());
                break;
            case 1:
                nvPr.setUserDrawn(s.GetBool());
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                nvPr.setPh(this.ReadPH());
                break;
            default:
                var _len = s.GetULong();
                s.Skip2(_len);
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadPH = function () {
        var ph = new Ph();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                ph.setHasCustomPrompt(s.GetBool());
                break;
            case 1:
                ph.setIdx(s.GetString2());
                break;
            case 2:
                ph.setOrient(s.GetUChar());
                break;
            case 3:
                ph.setSz(s.GetUChar());
                break;
            case 4:
                ph.setType(s.GetUChar());
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return ph;
    };
    this.ReadRunProperties = function () {
        var rPr = new CTextPr();
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var altLang = s.GetString2();
                break;
            case 1:
                rPr.Bold = s.GetBool();
                break;
            case 2:
                var baseline = s.GetLong();
                if (baseline < 0) {
                    rPr.VertAlign = vertalign_SubScript;
                } else {
                    if (baseline > 0) {
                        rPr.VertAlign = vertalign_SuperScript;
                    }
                }
                break;
            case 3:
                var bmk = s.GetString2();
                break;
            case 4:
                var _cap = s.GetUChar();
                if (_cap == 0) {
                    rPr.Caps = true;
                    rPr.SmallCaps = false;
                } else {
                    if (_cap == 1) {
                        rPr.Caps = false;
                        rPr.SmallCaps = true;
                    } else {
                        if (_cap == 2) {
                            rPr.SmallCaps = false;
                            rPr.Caps = false;
                        }
                    }
                }
                break;
            case 5:
                s.Skip2(1);
                break;
            case 6:
                s.Skip2(1);
                break;
            case 7:
                rPr.Italic = s.GetBool();
                break;
            case 8:
                s.Skip2(4);
                break;
            case 9:
                s.Skip2(1);
                break;
            case 10:
                var lang = s.GetString2();
                break;
            case 11:
                s.Skip2(1);
                break;
            case 12:
                s.Skip2(1);
                break;
            case 13:
                s.Skip2(1);
                break;
            case 14:
                s.Skip2(4);
                break;
            case 15:
                rPr.Spacing = s.GetLong() * 25.4 / 7200;
                break;
            case 16:
                var _strike = s.GetUChar();
                if (0 == _strike) {
                    rPr.Strikeout = false;
                    rPr.DStrikeout = true;
                } else {
                    if (2 == _strike) {
                        rPr.Strikeout = true;
                        rPr.DStrikeout = false;
                    } else {
                        rPr.Strikeout = false;
                        rPr.DStrikeout = false;
                    }
                }
                break;
            case 17:
                var _size = s.GetLong() / 100;
                _size = ((_size * 2) + 0.5) >> 0;
                _size /= 2;
                rPr.FontSize = _size;
                break;
            case 18:
                rPr.Underline = (s.GetUChar() != 12);
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                s.SkipRecord();
                break;
            case 1:
                rPr.Unifill = this.ReadUniFill();
                break;
            case 2:
                s.SkipRecord();
                break;
            case 3:
                rPr.RFonts.Ascii = {
                    Name: this.ReadTextFontTypeface(),
                    Index: -1
                };
                break;
            case 4:
                rPr.RFonts.EastAsia = {
                    Name: this.ReadTextFontTypeface(),
                    Index: -1
                };
                break;
            case 5:
                rPr.RFonts.CS = {
                    Name: this.ReadTextFontTypeface(),
                    Index: -1
                };
                break;
            case 6:
                rPr.RFonts.HAnsi = {
                    Name: this.ReadTextFontTypeface(),
                    Index: -1
                };
                break;
            case 7:
                rPr.hlink = this.ReadHyperlink();
                if (null == rPr.hlink) {
                    delete rPr.hlink;
                }
                break;
            case 8:
                s.SkipRecord();
            default:
                s.SkipRecord();
            }
        }
        s.Seek2(_end_rec);
        return rPr;
    };
    this.ReadHyperlink = function () {
        var hyper = new CHyperlink();
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                hyper.url = s.GetString2();
                break;
            case 1:
                var s1 = s.GetString2();
                break;
            case 2:
                hyper.action = s.GetString2();
                break;
            case 3:
                var tgt = s.GetString2();
                break;
            case 4:
                var tooltip = s.GetString2();
                break;
            case 5:
                s.Skip2(1);
                break;
            case 6:
                s.Skip2(1);
                break;
            case 7:
                s.Skip2(1);
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        if (hyper.action != null && hyper.action != "") {
            if (hyper.action == "ppaction://hlinkshowjump?jump=firstslide") {
                hyper.url = "ppaction://hlinkshowjump?jump=firstslide";
            } else {
                if (hyper.action == "ppaction://hlinkshowjump?jump=lastslide") {
                    hyper.url = "ppaction://hlinkshowjump?jump=lastslide";
                } else {
                    if (hyper.action == "ppaction://hlinkshowjump?jump=nextslide") {
                        hyper.url = "ppaction://hlinkshowjump?jump=nextslide";
                    } else {
                        if (hyper.action == "ppaction://hlinkshowjump?jump=previousslide") {
                            hyper.url = "ppaction://hlinkshowjump?jump=previousslide";
                        } else {
                            if (hyper.action == "ppaction://hlinksldjump") {
                                if (hyper.url != null && hyper.url.indexOf("slide") == 0) {
                                    var _url = hyper.url.substring(5);
                                    var _indexXml = _url.indexOf(".");
                                    if (-1 != _indexXml) {
                                        _url = _url.substring(0, _indexXml);
                                    }
                                    var _slideNum = parseInt(_url);
                                    if (isNaN(_slideNum)) {
                                        _slideNum = 1;
                                    }--_slideNum;
                                    hyper.url = hyper.action + "slide" + _slideNum;
                                } else {
                                    hyper.url = null;
                                }
                            } else {
                                hyper.url = null;
                            }
                        }
                    }
                }
            }
        }
        if (hyper.url == null) {
            return null;
        }
        return hyper;
    };
    this.CorrectBodyPr = function (bodyPr) {
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                bodyPr.flatTx = s.GetLong();
                break;
            case 1:
                bodyPr.anchor = s.GetUChar();
                break;
            case 2:
                bodyPr.anchorCtr = s.GetBool();
                break;
            case 3:
                bodyPr.bIns = s.GetLong() / 36000;
                break;
            case 4:
                bodyPr.compatLnSpc = s.GetBool();
                break;
            case 5:
                bodyPr.forceAA = s.GetBool();
                break;
            case 6:
                bodyPr.fromWordArt = s.GetBool();
                break;
            case 7:
                bodyPr.horzOverflow = s.GetUChar();
                break;
            case 8:
                bodyPr.lIns = s.GetLong() / 36000;
                break;
            case 9:
                bodyPr.numCol = s.GetLong();
                break;
            case 10:
                bodyPr.rIns = s.GetLong() / 36000;
                break;
            case 11:
                bodyPr.rot = s.GetLong();
                break;
            case 12:
                bodyPr.rtlCol = s.GetBool();
                break;
            case 13:
                bodyPr.spcCol = s.GetLong();
                break;
            case 14:
                bodyPr.spcFirstLastPara = s.GetBool();
                break;
            case 15:
                bodyPr.tIns = s.GetLong() / 36000;
                break;
            case 16:
                bodyPr.upright = s.GetBool();
                break;
            case 17:
                bodyPr.vert = s.GetUChar();
                if (bodyPr.vert === nVertTTwordArtVert) {
                    bodyPr.vert = nVertTTvert;
                }
                break;
            case 18:
                bodyPr.vertOverflow = s.GetUChar();
                break;
            case 19:
                bodyPr.wrap = s.GetUChar();
                break;
            default:
                break;
            }
        }
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 1:
                var _end_rec2 = s.cur + s.GetULong() + 4;
                s.Skip2(1);
                var txFit = new CTextFit();
                txFit.type = -1;
                while (true) {
                    var _at2 = s.GetUChar();
                    if (_at2 == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at2) {
                    case 0:
                        txFit.type = s.GetLong() - 1;
                        break;
                    case 1:
                        txFit.fontScale = s.GetLong();
                        break;
                    case 2:
                        txFit.lnSpcReduction = s.GetLong();
                        break;
                    default:
                        break;
                    }
                }
                if (txFit.type != -1) {
                    bodyPr.textFit = txFit;
                }
                s.Seek2(_end_rec2);
                break;
            default:
                s.SkipRecord();
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadBodyPr = function () {
        var bodyPr = new CBodyPr();
        this.CorrectBodyPr(bodyPr);
        return bodyPr;
    };
    this.ReadTextParagraphPr = function () {
        var para_pr = new CParaPr();
        var tPr = new CTextParagraphPr();
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;
        s.Skip2(1);
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                var _align = s.GetUChar();
                switch (_align) {
                case 0:
                    para_pr.Jc = align_Center;
                    break;
                case 1:
                    para_pr.Jc = align_Justify;
                    break;
                case 2:
                    para_pr.Jc = align_Justify;
                    break;
                case 3:
                    para_pr.Jc = align_Justify;
                    break;
                case 4:
                    para_pr.Jc = align_Left;
                    break;
                case 5:
                    para_pr.Jc = align_Right;
                    break;
                case 6:
                    para_pr.Jc = align_Justify;
                    break;
                default:
                    para_pr.Jc = align_Center;
                    break;
                }
                break;
            case 1:
                var default_tab = s.GetLong() / 36000;
                break;
            case 2:
                s.Skip2(1);
                break;
            case 3:
                s.Skip2(1);
                break;
            case 4:
                s.Skip2(1);
                break;
            case 5:
                para_pr.Ind.FirstLine = s.GetLong() / 36000;
                break;
            case 6:
                s.Skip2(1);
                break;
            case 7:
                para_pr.Lvl = s.GetLong();
                break;
            case 8:
                para_pr.Ind.Left = s.GetLong() / 36000;
                break;
            case 9:
                para_pr.Ind.Right = s.GetLong() / 36000;
                break;
            case 10:
                s.Skip2(1);
                break;
            default:
                break;
            }
        }
        var bullet = new CBullet();
        var b_bullet = false;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                s.Skip2(5);
                var Pts = null;
                var Pct = null;
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        Pct = s.GetLong();
                        para_pr.Spacing.Line = Pct / 100000;
                        para_pr.Spacing.LineRule = linerule_Auto;
                        break;
                    case 1:
                        Pts = s.GetLong();
                        para_pr.Spacing.Line = Pts * 0.00352777778;
                        para_pr.Spacing.LineRule = linerule_Exact;
                        break;
                    default:
                        break;
                    }
                }
                break;
            case 1:
                s.Skip2(5);
                var Pts = null;
                var Pct = null;
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        Pct = s.GetLong();
                        para_pr.Spacing.After = 0;
                        break;
                    case 1:
                        Pts = s.GetLong();
                        para_pr.Spacing.After = Pts * 0.00352777778;
                        break;
                    default:
                        break;
                    }
                }
                break;
            case 2:
                s.Skip2(5);
                var Pts = null;
                var Pct = null;
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        Pct = s.GetLong();
                        para_pr.Spacing.Before = 0;
                        break;
                    case 1:
                        Pts = s.GetLong();
                        para_pr.Spacing.Before = Pts * 0.00352777778;
                        break;
                    default:
                        break;
                    }
                }
                break;
            case 3:
                b_bullet = true;
                bullet.bulletColor = new CBulletColor();
                var cur_pos = s.cur;
                var _len = s.GetULong();
                if (0 != _len) {
                    bullet.bulletColor.type = s.GetUChar();
                    if (bullet.bulletColor.type == BULLET_TYPE_COLOR_CLRTX) {
                        s.SkipRecord();
                    } else {
                        var _l = s.GetULong();
                        s.Skip2(1);
                        bullet.bulletColor.UniColor = this.ReadUniColor();
                    }
                }
                s.Seek2(cur_pos + _len + 4);
                break;
            case 4:
                b_bullet = true;
                bullet.bulletSize = new CBulletSize();
                var cur_pos = s.cur;
                var _len = s.GetULong();
                if (0 != _len) {
                    bullet.bulletSize.type = s.GetUChar();
                    if (bullet.bulletSize.type == BULLET_TYPE_SIZE_TX) {
                        s.SkipRecord();
                    } else {
                        var _l = s.GetULong();
                        s.Skip2(2);
                        bullet.bulletSize.val = s.GetLong();
                        s.Skip2(1);
                    }
                }
                s.Seek2(cur_pos + _len + 4);
                break;
            case 5:
                b_bullet = true;
                bullet.bulletTypeface = new CBulletTypeface();
                var cur_pos = s.cur;
                var _len = s.GetULong();
                if (0 != _len) {
                    bullet.bulletTypeface.type = s.GetUChar();
                    if (bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT) {
                        bullet.bulletTypeface.typeface = this.ReadTextFontTypeface();
                    } else {
                        s.SkipRecord();
                    }
                }
                s.Seek2(cur_pos + _len + 4);
                break;
            case 6:
                b_bullet = true;
                bullet.bulletType = new CBulletType();
                var cur_pos = s.cur;
                var _len = s.GetULong();
                if (0 != _len) {
                    bullet.bulletType.type = s.GetUChar();
                    if (bullet.bulletType.type == BULLET_TYPE_BULLET_NONE) {
                        s.SkipRecord();
                    } else {
                        if (bullet.bulletType.type == BULLET_TYPE_BULLET_BLIP) {
                            s.SkipRecord();
                        } else {
                            if (bullet.bulletType.type == BULLET_TYPE_BULLET_AUTONUM) {
                                s.Skip2(5);
                                while (true) {
                                    var _at = s.GetUChar();
                                    if (_at == g_nodeAttributeEnd) {
                                        break;
                                    }
                                    switch (_at) {
                                    case 0:
                                        bullet.bulletType.AutoNumType = s.GetUChar();
                                        break;
                                    case 1:
                                        bullet.bulletType.startAt = s.GetLong();
                                        break;
                                    default:
                                        break;
                                    }
                                }
                            } else {
                                if (bullet.bulletType.type == BULLET_TYPE_BULLET_CHAR) {
                                    s.Skip2(6);
                                    bullet.bulletType.Char = s.GetString2();
                                    s.Skip2(1);
                                }
                            }
                        }
                    }
                }
                s.Seek2(cur_pos + _len + 4);
                break;
            case 7:
                s.Skip2(4);
                var _c = s.GetULong();
                if (0 != _c) {
                    para_pr.Tabs = new CParaTabs();
                    var _value, _pos;
                    for (var i = 0; i < _c; i++) {
                        s.Skip2(6);
                        _value = null;
                        _pos = null;
                        while (true) {
                            var _at = s.GetUChar();
                            if (_at == g_nodeAttributeEnd) {
                                break;
                            }
                            switch (_at) {
                            case 0:
                                _value = s.GetUChar();
                                if (_value == 0) {
                                    _value = tab_Center;
                                } else {
                                    if (_value == 3) {
                                        _value = tab_Right;
                                    } else {
                                        _value = tab_Left;
                                    }
                                }
                                break;
                            case 1:
                                _pos = s.GetLong() / 36000;
                                break;
                            default:
                                break;
                            }
                        }
                        para_pr.Tabs.Add(new CParaTab(_value, _pos));
                    }
                }
                break;
            case 8:
                var r_pr = this.ReadRunProperties();
                if (r_pr) {
                    para_pr.DefaultRunPr = new CTextPr();
                    if (r_pr.Unifill && !r_pr.Unifill.fill) {
                        r_pr.Unifill = undefined;
                    }
                    para_pr.DefaultRunPr.Set_FromObject(r_pr);
                }
            default:
                s.SkipRecord();
            }
        }
        if (b_bullet) {
            para_pr.Bullet = bullet;
        }
        s.Seek2(_end_rec);
        return para_pr;
    };
    this.ReadTextListStyle = function () {
        var styles = new TextListStyle();
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            styles.levels[_at] = this.ReadTextParagraphPr();
        }
        s.Seek2(_end_rec);
        return styles;
    };
    this.ReadTextBody = function (shape) {
        var txbody;
        if (shape) {
            if (shape.txBody) {
                txbody = shape.txBody;
            } else {
                txbody = new CTextBody();
                txbody.setParent(shape);
            }
        } else {
            txbody = new CTextBody();
        }
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                txbody.setBodyPr(this.ReadBodyPr());
                if (txbody.bodyPr && txbody.bodyPr.textFit) {
                    this.textBodyTextFit.push(txbody);
                }
                break;
            case 1:
                txbody.setLstStyle(this.ReadTextListStyle());
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                txbody.setContent(new CDocumentContent(txbody, this.presentation ? this.presentation.DrawingDocument : null, 0, 0, 0, 0, 0, 0, true));
                if (_c > 0) {
                    txbody.content.Internal_Content_RemoveAll();
                }
                var _last_field_type = false;
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    var _paragraph = this.ReadParagraph(txbody.content);
                    txbody.content.Internal_Content_Add(txbody.content.Content.length, _paragraph);
                    if (_paragraph.f_type != undefined || _paragraph.f_text != undefined || _paragraph.f_id != undefined) {
                        _last_field_type = true;
                    }
                }
                if (shape && (this.TempMainObject && typeof Slide !== "undefined" && this.TempMainObject instanceof Slide && shape.isPlaceholder && shape.isPlaceholder() && (shape.getPlaceholderType() === phType_sldNum || shape.getPlaceholderType() === phType_dt)) && _last_field_type) {
                    var str_field = txbody.getFieldText(_last_field_type, this.TempMainObject, (this.presentation && this.presentation.pres && isRealNumber(this.presentation.pres.attrFirstSlideNum)) ? this.presentation.pres.attrFirstSlideNum : 1);
                    if (str_field.length > 0) {
                        txbody.content.Internal_Content_RemoveAll();
                        txbody.content.Internal_Content_Add(txbody.content.Content.length, new Paragraph(txbody.content.DrawingDocument, txbody.content, 0, 0, 0, 0, 0, true));
                        AddToContentFromString(txbody.content, str_field);
                        if (_paragraph.f_runPr || _paragraph.f_paraPr) {
                            txbody.content.Set_ApplyToAll(true);
                            if (_paragraph.f_runPr) {
                                var _value_text_pr = new CTextPr();
                                if (_paragraph.f_runPr.Unifill && !_paragraph.f_runPr.Unifill.fill) {
                                    _paragraph.f_runPr.Unifill = undefined;
                                }
                                _value_text_pr.Set_FromObject(_paragraph.f_runPr);
                                txbody.content.Paragraph_Add(new ParaTextPr(_value_text_pr), false);
                                delete _paragraph.f_runPr;
                            }
                            if (_paragraph.f_paraPr) {
                                txbody.content.Content[0].Set_Pr(_paragraph.f_paraPr);
                                delete _paragraph.f_paraPr;
                            }
                            txbody.content.Set_ApplyToAll(false);
                        }
                    }
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return txbody;
    };
    this.ReadTextBodyTxPr = function (shape) {
        var txbody;
        if (shape.txPr) {
            txbody = shape.txPr;
        } else {
            shape.txPr = new CTextBody();
            txbody = shape.txPr;
        }
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                shape.setBodyPr(this.ReadBodyPr());
                break;
            case 1:
                txbody.setLstStyle(this.ReadTextListStyle());
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                if (!txbody.content) {
                    txbody.content = new CDocumentContent(shape, this.presentation ? this.presentation.DrawingDocument : null, 0, 0, 0, 0, 0, 0, true);
                }
                if (_c > 0) {
                    txbody.content.Internal_Content_RemoveAll();
                }
                var _last_field_type = false;
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    var _paragraph = this.ReadParagraph(txbody.content);
                    _paragraph.Set_Parent(txbody.content);
                    txbody.content.Internal_Content_Add(txbody.content.Content.length, _paragraph);
                    if (_paragraph.f_type != undefined || _paragraph.f_text != undefined || _paragraph.f_id != undefined) {
                        _last_field_type = true;
                    }
                }
                if (_last_field_type) {}
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return txbody;
    };
    this.ReadTextBody2 = function (content) {
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                s.SkipRecord();
                break;
            case 1:
                s.SkipRecord();
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(1);
                    var _paragraph = this.ReadParagraph(content);
                    content.Internal_Content_Add(content.Content.length, _paragraph);
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
    };
    this.ReadParagraph = function (DocumentContent) {
        var par = new Paragraph(DocumentContent.DrawingDocument, DocumentContent, 0, 0, 0, 0, 0, true);
        var EndPos = 0;
        var s = this.stream;
        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
        while (s.cur < _end_rec) {
            var _at = s.GetUChar();
            switch (_at) {
            case 0:
                par.Set_Pr(this.ReadTextParagraphPr());
                break;
            case 1:
                var endRunPr = this.ReadRunProperties();
                var _value_text_pr = new CTextPr();
                if (endRunPr.Unifill && !endRunPr.Unifill.fill) {
                    endRunPr.Unifill = undefined;
                }
                _value_text_pr.Set_FromObject(endRunPr);
                par.TextPr.Apply_TextPr(_value_text_pr);
                break;
            case 2:
                s.Skip2(4);
                var _c = s.GetULong();
                for (var i = 0; i < _c; i++) {
                    s.Skip2(5);
                    var _type = s.GetUChar();
                    switch (_type) {
                    case PARRUN_TYPE_RUN:
                        var _end = s.cur + s.GetULong() + 4;
                        s.Skip2(1);
                        var _text = "";
                        while (true) {
                            var _at = s.GetUChar();
                            if (_at == g_nodeAttributeEnd) {
                                break;
                            }
                            if (0 == _at) {
                                _text = s.GetString2();
                            }
                        }
                        var _run = null;
                        while (s.cur < _end) {
                            var _rec = s.GetUChar();
                            if (0 == _rec) {
                                _run = this.ReadRunProperties();
                            } else {
                                s.SkipRecord();
                            }
                        }
                        s.Seek2(_end);
                        var new_run = new ParaRun(par, false),
                        hyperlink = null;
                        if (null != _run) {
                            var text_pr = new CTextPr();
                            if (_run.Unifill && !_run.Unifill.fill) {
                                _run.Unifill = undefined;
                            }
                            if (_run.hlink !== undefined) {
                                hyperlink = new ParaHyperlink();
                                hyperlink.Set_Value(_run.hlink.url);
                                if (!_run.Unifill) {
                                    _run.Unifill = CreateUniFillSchemeColorWidthTint(11, 0);
                                }
                                _run.Underline = true;
                            }
                            text_pr.Set_FromObject(_run);
                            new_run.Set_Pr(text_pr);
                        }
                        var pos = 0;
                        for (var j = 0, length = _text.length; j < length; ++j) {
                            if (_text[j] == "\t") {
                                new_run.Add_ToContent(pos++, new ParaTab(), false);
                            } else {
                                if (_text[j] == "\n") {
                                    new_run.Add_ToContent(pos++, new ParaNewLine(break_Line), false);
                                } else {
                                    if (_text[j] == "\r") {} else {
                                        if (_text[j] != " ") {
                                            new_run.Add_ToContent(pos++, new ParaText(_text[j]), false);
                                        } else {
                                            new_run.Add_ToContent(pos++, new ParaSpace(1), false);
                                        }
                                    }
                                }
                            }
                        }
                        if (hyperlink !== null) {
                            hyperlink.Add_ToContent(0, new_run, false);
                            par.Internal_Content_Add(EndPos++, hyperlink);
                        } else {
                            par.Internal_Content_Add(EndPos++, new_run);
                        }
                        break;
                    case PARRUN_TYPE_FLD:
                        var _end = s.cur + s.GetULong() + 4;
                        s.Skip2(1);
                        while (true) {
                            var _at = s.GetUChar();
                            if (_at == g_nodeAttributeEnd) {
                                break;
                            }
                            if (0 == _at) {
                                var f_id = s.GetString2();
                            } else {
                                if (1 == _at) {
                                    var f_type = s.GetString2();
                                } else {
                                    var f_text = s.GetString2();
                                }
                            }
                        }
                        var _rPr = null,
                        _pPr = null;
                        while (s.cur < _end) {
                            var _at2 = s.GetUChar();
                            switch (_at2) {
                            case 0:
                                _rPr = this.ReadRunProperties();
                                break;
                            case 1:
                                _pPr = this.ReadTextParagraphPr();
                                break;
                            default:
                                break;
                            }
                        }
                        par.f_id = f_id;
                        par.f_type = f_type;
                        par.f_text = f_text;
                        par.f_runPr = _rPr;
                        par.f_paraPr = _pPr;
                        s.Seek2(_end);
                        break;
                    case PARRUN_TYPE_BR:
                        var _end = s.cur + s.GetULong() + 4;
                        var _run = null;
                        while (s.cur < _end) {
                            var _rec = s.GetUChar();
                            if (0 == _rec) {
                                _run = this.ReadRunProperties();
                            } else {
                                s.SkipRecord();
                            }
                        }
                        s.Seek2(_end);
                        var new_run = new ParaRun(par, false),
                        hyperlink = null;
                        if (null != _run) {
                            if (_run.hlink !== undefined) {
                                hyperlink = new ParaHyperlink();
                                hyperlink.Set_Value(_run.hlink.url);
                            }
                            var text_pr = new CTextPr();
                            if (_run.Unifill && !_run.Unifill.fill) {
                                _run.Unifill = undefined;
                            }
                            text_pr.Set_FromObject(_run);
                            new_run.Set_Pr(text_pr);
                        }
                        new_run.Add_ToContent(0, new ParaNewLine(break_Line));
                        if (hyperlink !== null) {
                            hyperlink.Add_ToContent(0, new_run, false);
                            par.Internal_Content_Add(EndPos++, hyperlink);
                        } else {
                            par.Internal_Content_Add(EndPos++, new_run);
                        }
                        break;
                    default:
                        break;
                    }
                }
                break;
            default:
                break;
            }
        }
        s.Seek2(_end_rec);
        return par;
    };
}
function CApp() {
    this.Template = null;
    this.TotalTime = null;
    this.Words = null;
    this.Application = null;
    this.PresentationFormat = null;
    this.Paragraphs = null;
    this.Slides = null;
    this.Notes = null;
    this.HiddenSlides = null;
    this.MMClips = null;
    this.ScaleCrop = null;
    this.HeadingPairs = [];
    this.TitlesOfParts = [];
    this.Company = null;
    this.LinksUpToDate = null;
    this.SharedDoc = null;
    this.HyperlinksChanged = null;
    this.AppVersion = null;
    this.fromStream = function (s) {
        var _type = s.GetUChar();
        var _len = s.GetULong();
        var _sa = s.GetUChar();
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                this.Template = s.GetString2();
                break;
            case 1:
                this.Application = s.GetString2();
                break;
            case 2:
                this.PresentationFormat = s.GetString2();
                break;
            case 3:
                this.Company = s.GetString2();
                break;
            case 4:
                this.AppVersion = s.GetString2();
                break;
            case 5:
                this.TotalTime = s.GetLong();
                break;
            case 6:
                this.Words = s.GetLong();
                break;
            case 7:
                this.Paragraphs = s.GetLong();
                break;
            case 8:
                this.Slides = s.GetLong();
                break;
            case 9:
                this.Notes = s.GetLong();
                break;
            case 10:
                this.HiddenSlides = s.GetLong();
                break;
            case 11:
                this.MMClips = s.GetLong();
                break;
            case 12:
                this.ScaleCrop = s.GetBool();
                break;
            case 13:
                this.LinksUpToDate = s.GetBool();
                break;
            case 14:
                this.SharedDoc = s.GetBool();
                break;
            case 15:
                this.HyperlinksChanged = s.GetBool();
                break;
            default:
                return;
            }
        }
    };
}
function CCore() {
    this.title = null;
    this.creator = null;
    this.lastModifiedBy = null;
    this.revision = null;
    this.created = null;
    this.modified = null;
    this.fromStream = function (s) {
        var _type = s.GetUChar();
        var _len = s.GetULong();
        var _sa = s.GetUChar();
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                this.title = s.GetString2();
                break;
            case 1:
                this.creator = s.GetString2();
                break;
            case 2:
                this.lastModifiedBy = s.GetString2();
                break;
            case 3:
                this.revision = s.GetString2();
                break;
            case 4:
                this.created = s.GetString2();
                break;
            case 5:
                this.modified = s.GetString2();
                break;
            default:
                return;
            }
        }
    };
}
function CPres() {
    this.defaultTextStyle = null;
    this.SldSz = null;
    this.NotesSz = null;
    this.attrAutoCompressPictures = null;
    this.attrBookmarkIdSeed = null;
    this.attrCompatMode = null;
    this.attrConformance = null;
    this.attrEmbedTrueTypeFonts = null;
    this.attrFirstSlideNum = null;
    this.attrRemovePersonalInfoOnSave = null;
    this.attrRtl = null;
    this.attrSaveSubsetFonts = null;
    this.attrServerZoom = null;
    this.attrShowSpecialPlsOnTitleSld = null;
    this.attrStrictFirstAndLastChars = null;
    this.fromStream = function (s, reader) {
        var _type = s.GetUChar();
        var _len = s.GetULong();
        var _start_pos = s.cur;
        var _end_pos = _len + _start_pos;
        var _sa = s.GetUChar();
        while (true) {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd) {
                break;
            }
            switch (_at) {
            case 0:
                this.attrAutoCompressPictures = s.GetBool();
                break;
            case 1:
                this.attrBookmarkIdSeed = s.GetLong();
                break;
            case 2:
                this.attrCompatMode = s.GetBool();
                break;
            case 3:
                this.attrConformance = s.GetUChar();
                break;
            case 4:
                this.attrEmbedTrueTypeFonts = s.GetBool();
                break;
            case 5:
                this.attrFirstSlideNum = s.GetLong();
                break;
            case 6:
                this.attrRemovePersonalInfoOnSave = s.GetBool();
                break;
            case 7:
                this.attrRtl = s.GetBool();
                break;
            case 8:
                this.attrSaveSubsetFonts = s.GetBool();
                break;
            case 9:
                this.attrServerZoom = s.GetString2();
                break;
            case 10:
                this.attrShowSpecialPlsOnTitleSld = s.GetBool();
                break;
            case 11:
                this.attrStrictFirstAndLastChars = s.GetBool();
                break;
            default:
                return;
            }
        }
        while (true) {
            if (s.cur >= _end_pos) {
                break;
            }
            _type = s.GetUChar();
            switch (_type) {
            case 0:
                this.defaultTextStyle = reader.ReadTextListStyle();
                break;
            case 1:
                s.SkipRecord();
                break;
            case 2:
                s.SkipRecord();
                break;
            case 3:
                s.SkipRecord();
                break;
            case 4:
                s.SkipRecord();
                break;
            case 5:
                this.SldSz = {};
                s.Skip2(5);
                while (true) {
                    var _at = s.GetUChar();
                    if (_at == g_nodeAttributeEnd) {
                        break;
                    }
                    switch (_at) {
                    case 0:
                        this.SldSz.cx = s.GetLong();
                        break;
                    case 1:
                        this.SldSz.cy = s.GetLong();
                        break;
                    case 2:
                        this.SldSz.type = s.GetUChar();
                        break;
                    default:
                        return;
                    }
                }
                break;
            case 6:
                var _end_rec2 = s.cur + s.GetULong() + 4;
                while (s.cur < _end_rec2) {
                    var _rec = s.GetUChar();
                    switch (_rec) {
                    case 0:
                        s.Skip2(4);
                        var lCount = s.GetULong();
                        for (var i = 0; i < lCount; i++) {
                            s.Skip2(1);
                            var _author = new CCommentAuthor();
                            var _end_rec3 = s.cur + s.GetLong() + 4;
                            s.Skip2(1);
                            while (true) {
                                var _at2 = s.GetUChar();
                                if (_at2 == g_nodeAttributeEnd) {
                                    break;
                                }
                                switch (_at2) {
                                case 0:
                                    _author.Id = s.GetLong();
                                    break;
                                case 1:
                                    _author.LastId = s.GetLong();
                                    break;
                                case 2:
                                    var _clr_idx = s.GetLong();
                                    break;
                                case 3:
                                    _author.Name = s.GetString2();
                                    break;
                                case 4:
                                    _author.Initials = s.GetString2();
                                    break;
                                default:
                                    break;
                                }
                            }
                            s.Seek2(_end_rec3);
                            reader.presentation.CommentAuthors[_author.Name] = _author;
                        }
                        break;
                    default:
                        s.SkipRecord();
                        break;
                    }
                }
                s.Seek2(_end_rec2);
                break;
            default:
                s.Seek2(_end_pos);
                return;
            }
        }
        s.Seek2(_end_pos);
    };
}