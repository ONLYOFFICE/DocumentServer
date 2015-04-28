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
var c_oMainTables = {
    Main: 255,
    App: 1,
    Core: 2,
    Presentation: 3,
    ViewProps: 4,
    VmlDrawing: 5,
    TableStyles: 6,
    Themes: 20,
    ThemeOverride: 21,
    SlideMasters: 22,
    SlideLayouts: 23,
    Slides: 24,
    NotesMasters: 25,
    NotesSlides: 26,
    HandoutMasters: 30,
    SlideRels: 40,
    ThemeRels: 41,
    ImageMap: 42,
    FontMap: 43,
    FontsEmbedded: 44
};
function CSeekTableEntry() {
    this.Type = 0;
    this.SeekPos = 0;
}
function GUID() {
    var S4 = function () {
        var ret = (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        ret = ret.toUpperCase();
        return ret;
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function CBinaryFileWriter() {
    this.tableStylesGuides = {};
    this.Init = function () {
        var _canvas = document.createElement("canvas");
        var _ctx = _canvas.getContext("2d");
        this.len = 1024 * 1024 * 5;
        this.ImData = _ctx.createImageData(this.len / 4, 1);
        this.data = this.ImData.data;
        this.pos = 0;
    };
    this.IsWordWriter = false;
    this.ImData = null;
    this.data = null;
    this.len = 0;
    this.pos = 0;
    this.Init();
    this.UseContinueWriter = false;
    this.IsUseFullUrl = false;
    this.DocumentOrigin = "";
    this.PresentationThemesOrigin = "";
    var oThis = this;
    this.Start_UseFullUrl = function (origin) {
        this.IsUseFullUrl = true;
        this.DocumentOrigin = origin;
    };
    this.Start_UseDocumentOrigin = function (origin) {
        this.PresentationThemesOrigin = origin + "/presentationthemes/";
    };
    this.End_UseFullUrl = function () {
        this.IsUseFullUrl = false;
    };
    this.Copy = function (oMemory, nPos, nLen) {
        for (var Index = 0; Index < nLen; Index++) {
            this.CheckSize(1);
            this.data[this.pos++] = oMemory.data[Index + nPos];
        }
    };
    this.CheckSize = function (count) {
        if (this.pos + count >= this.len) {
            var _canvas = document.createElement("canvas");
            var _ctx = _canvas.getContext("2d");
            var oldImData = this.ImData;
            var oldData = this.data;
            var oldPos = this.pos;
            this.len = Math.max(this.len * 2, this.pos + ((3 * count / 2) >> 0));
            this.ImData = _ctx.createImageData(this.len / 4, 1);
            this.data = this.ImData.data;
            var newData = this.data;
            for (var i = 0; i < this.pos; i++) {
                newData[i] = oldData[i];
            }
        }
    };
    this.GetBase64Memory = function () {
        return Base64Encode(this.data, this.pos, 0);
    };
    this.GetBase64Memory2 = function (nPos, nLen) {
        return Base64Encode(this.data, nLen, nPos);
    };
    this.GetCurPosition = function () {
        return this.pos;
    };
    this.Seek = function (nPos) {
        this.pos = nPos;
    };
    this.Skip = function (nDif) {
        this.pos += nDif;
    };
    this.WriteBool = function (val) {
        this.CheckSize(1);
        if (false == val) {
            this.data[this.pos++] = 0;
        } else {
            this.data[this.pos++] = 1;
        }
    };
    this.WriteUChar = function (val) {
        this.CheckSize(1);
        this.data[this.pos++] = val;
    };
    this.WriteUShort = function (val) {
        this.CheckSize(2);
        this.data[this.pos++] = (val) & 255;
        this.data[this.pos++] = (val >>> 8) & 255;
    };
    this.WriteULong = function (val) {
        this.CheckSize(4);
        this.data[this.pos++] = (val) & 255;
        this.data[this.pos++] = (val >>> 8) & 255;
        this.data[this.pos++] = (val >>> 16) & 255;
        this.data[this.pos++] = (val >>> 24) & 255;
    };
    this.WriteDouble = function (val) {
        this.WriteULong((val * 100000) >> 0);
    };
    this.WriteString = function (text) {
        var count = text.length & 65535;
        this.WriteULong(count);
        this.CheckSize(count);
        for (var i = 0; i < count; i++) {
            var c = text.charCodeAt(i) & 255;
            this.data[this.pos++] = c;
        }
    };
    this.WriteString2 = function (text) {
        var count = text.length & 2147483647;
        var countWrite = 2 * count;
        this.WriteULong(count);
        this.CheckSize(countWrite);
        for (var i = 0; i < count; i++) {
            var c = text.charCodeAt(i) & 65535;
            this.data[this.pos++] = c & 255;
            this.data[this.pos++] = (c >>> 8) & 255;
        }
    };
    this.WriteBuffer = function (data, _pos, count) {
        this.CheckSize(count);
        for (var i = 0; i < count; i++) {
            this.data[this.pos++] = data[_pos + i];
        }
    };
    this.m_arStack = [];
    this.m_lStackPosition = 0;
    this.m_arMainTables = [];
    this.StartRecord = function (lType) {
        this.m_arStack[this.m_lStackPosition] = this.pos + 5;
        this.m_lStackPosition++;
        this.WriteUChar(lType);
        this.WriteULong(0);
    };
    this.EndRecord = function () {
        this.m_lStackPosition--;
        var _seek = this.pos;
        this.pos = this.m_arStack[this.m_lStackPosition] - 4;
        this.WriteULong(_seek - this.m_arStack[this.m_lStackPosition]);
        this.pos = _seek;
    };
    this.StartMainRecord = function (lType) {
        var oEntry = new CSeekTableEntry();
        oEntry.Type = lType;
        oEntry.SeekPos = this.pos;
        this.m_arMainTables[this.m_arMainTables.length] = oEntry;
    };
    this.WriteReserved = function (lCount) {
        this.CheckSize(lCount);
        var _d = this.data;
        var _p = this.pos;
        var _e = this.pos + lCount;
        while (_p < _e) {
            _d[_p++] = 0;
        }
        this.pos += lCount;
    };
    this.WriteMainPart = function () {
        var _pos = this.pos;
        this.pos = 0;
        var _count = this.m_arMainTables.length;
        for (var i = 0; i < _count; i++) {
            this.WriteUChar(this.m_arMainTables[i].Type);
            this.WriteULong(this.m_arMainTables[i].SeekPos);
        }
        this.pos = _pos;
    };
    this._WriteString1 = function (type, val) {
        this.WriteUChar(type);
        this.WriteString2(val);
    };
    this._WriteString2 = function (type, val) {
        if (val != null) {
            this._WriteString1(type, val);
        }
    };
    this._WriteUChar1 = function (type, val) {
        this.WriteUChar(type);
        this.WriteUChar(val);
    };
    this._WriteUChar2 = function (type, val) {
        if (val != null) {
            this._WriteUChar1(type, val);
        }
    };
    this._WriteBool1 = function (type, val) {
        this.WriteUChar(type);
        this.WriteBool(val);
    };
    this._WriteBool2 = function (type, val) {
        if (val != null) {
            this._WriteBool1(type, val);
        }
    };
    this._WriteInt1 = function (type, val) {
        this.WriteUChar(type);
        this.WriteULong(val);
    };
    this._WriteInt2 = function (type, val) {
        if (val != null) {
            this._WriteInt1(type, val);
        }
    };
    this._WriteInt3 = function (type, val, scale) {
        this._WriteInt1(type, val * scale);
    };
    this._WriteInt4 = function (type, val, scale) {
        if (val != null) {
            this._WriteInt1(type, (val * scale) >> 0);
        }
    };
    this._WriteDouble1 = function (type, val) {
        var _val = val * 10000;
        this._WriteInt1(type, _val);
    };
    this._WriteDouble2 = function (type, val) {
        if (val != null) {
            this._WriteDouble1(type, val);
        }
    };
    this._WriteLimit1 = this._WriteUChar1;
    this._WriteLimit2 = this._WriteUChar2;
    this.WriteRecord1 = function (type, val, func_write) {
        this.StartRecord(type);
        func_write(val);
        this.EndRecord();
    };
    this.WriteRecord2 = function (type, val, func_write) {
        if (null != val) {
            this.StartRecord(type);
            func_write(val);
            this.EndRecord();
        }
    };
    this.WriteRecord3 = function (type, val, func_write) {
        if (null != val) {
            var _start_pos = this.pos;
            this.StartRecord(type);
            func_write(val);
            this.EndRecord();
            if ((_start_pos + 5) == this.pos) {
                this.pos -= 5;
                return false;
            }
            return true;
        }
        return false;
    };
    this.WriteRecordArray = function (type, subtype, val_array, func_element_write) {
        this.StartRecord(type);
        var len = val_array.length;
        this.WriteULong(len);
        for (var i = 0; i < len; i++) {
            this.WriteRecord1(subtype, val_array[i], func_element_write);
        }
        this.EndRecord();
    };
    this.font_map = {};
    this.image_map = {};
    this.WriteDocument2 = function (presentation) {
        this.font_map = {};
        this.image_map = {};
        this.WriteReserved(5 * 30);
        this.StartMainRecord(c_oMainTables.Main);
        this.WriteULong(1347441753);
        this.WriteULong(0);
        if (presentation.App) {
            this.WriteApp(presentation.App);
        }
        if (presentation.Core) {
            this.WriteCore(presentation.Core);
        }
        if (presentation.ViewProps) {
            this.WriteViewProps(presentation.ViewProps);
        }
        this.WritePresentation(presentation);
        var _dst_themes = [];
        var _dst_masters = [];
        var _dst_layouts = [];
        var _dst_slides = [];
        var _dst_notes = [];
        var _dst_notesMasters = [];
        var _slides_rels = [];
        var _master_rels = [];
        var _slides = presentation.Slides;
        var _slide_count = _slides.length;
        for (var i = 0; i < _slide_count; i++) {
            _dst_slides[i] = _slides[i];
            var _m = _slides[i].Layout.Master;
            var is_found = false;
            var _len_dst = _dst_masters.length;
            for (var j = 0; j < _len_dst; j++) {
                if (_dst_masters[j] == _m) {
                    is_found = true;
                    break;
                }
            }
            if (!is_found) {
                _dst_masters[_len_dst] = _m;
                var _m_rels = {
                    ThemeIndex: 0,
                    Layouts: []
                };
                var _lay_c = _m.sldLayoutLst.length;
                var _ind_l = _dst_layouts.length;
                for (var k = 0; k < _lay_c; k++) {
                    _dst_layouts[_ind_l] = _m.sldLayoutLst[k];
                    _m_rels.Layouts[k] = _ind_l;
                    _ind_l++;
                }
                _master_rels[_len_dst] = _m_rels;
            }
            var _layoutsC = _dst_layouts.length;
            for (var ii = 0; ii < _layoutsC; ii++) {
                if (_dst_layouts[ii] == _dst_slides[i].Layout) {
                    _slides_rels[i] = ii;
                }
            }
        }
        var _dst_masters_len = _dst_masters.length;
        if (0 == _dst_masters_len && presentation.slideMasters.length > 0) {
            var _m = presentation.slideMasters[0];
            _dst_masters[0] = _m;
            var _m_rels = {
                ThemeIndex: 0,
                Layouts: []
            };
            var _lay_c = _m.sldLayoutLst.length;
            var _ind_l = _dst_layouts.length;
            for (var k = 0; k < _lay_c; k++) {
                _dst_layouts[_ind_l] = _m.sldLayoutLst[k];
                _m_rels.Layouts[k] = _ind_l;
                _ind_l++;
            }
            _master_rels[0] = _m_rels;
            _dst_masters_len = 1;
        }
        for (var i = 0; i < _dst_masters_len; i++) {
            var _t = _dst_masters[i].Theme;
            var is_found = false;
            var _len_dst = _dst_themes.length;
            for (var j = 0; j < _len_dst; j++) {
                if (_dst_themes[j] == _t) {
                    is_found = true;
                    break;
                }
            }
            if (!is_found) {
                _dst_themes[_len_dst] = _t;
                _master_rels[i].ThemeIndex = _len_dst;
            }
        }
        for (var key in presentation.TableStylesIdMap) {
            if (presentation.TableStylesIdMap.hasOwnProperty(key)) {
                this.tableStylesGuides[key] = "{" + GUID() + "}";
            }
        }
        this.StartMainRecord(c_oMainTables.TableStyles);
        this.StartRecord(c_oMainTables.SlideRels);
        this.WriteUChar(g_nodeAttributeStart);
        if (this.tableStylesGuides[presentation.DefaultTableStyleId]) {
            this._WriteString1(0, this.tableStylesGuides[presentation.DefaultTableStyleId]);
        } else {
            for (key in this.tableStylesGuides) {
                if (this.tableStylesGuides.hasOwnProperty(key)) {
                    this._WriteString1(0, this.tableStylesGuides[key]);
                    break;
                }
            }
        }
        this.WriteUChar(g_nodeAttributeEnd);
        this.StartRecord(0);
        for (key in this.tableStylesGuides) {
            if (this.tableStylesGuides.hasOwnProperty(key)) {
                this.WriteTableStyle(key, g_oTableId.m_aPairs[key]);
            }
        }
        this.EndRecord();
        this.EndRecord();
        this.StartMainRecord(c_oMainTables.SlideRels);
        this.StartRecord(c_oMainTables.SlideRels);
        this.WriteUChar(g_nodeAttributeStart);
        for (var i = 0; i < _slide_count; i++) {
            this._WriteInt1(0, _slides_rels[i]);
        }
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
        this.StartMainRecord(c_oMainTables.ThemeRels);
        this.StartRecord(c_oMainTables.ThemeRels);
        var _master_count = _dst_masters.length;
        this.WriteULong(_master_count);
        for (var i = 0; i < _master_count; i++) {
            this.StartRecord(0);
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteInt1(0, _master_rels[i].ThemeIndex);
            this.WriteUChar(1);
            this.WriteString(_dst_masters[i].ImageBase64);
            this.WriteUChar(g_nodeAttributeEnd);
            var _lay_c = _master_rels[i].Layouts.length;
            this.WriteULong(_lay_c);
            for (var j = 0; j < _lay_c; j++) {
                this.StartRecord(0);
                this.WriteUChar(g_nodeAttributeStart);
                var _indL = _master_rels[i].Layouts[j];
                this._WriteInt1(0, _indL);
                this.WriteUChar(1);
                this.WriteString(_dst_layouts[_indL].ImageBase64);
                this.WriteUChar(g_nodeAttributeEnd);
                this.EndRecord();
            }
            this.EndRecord();
        }
        this.EndRecord();
        var _count_arr = 0;
        _count_arr = _dst_themes.length;
        this.StartMainRecord(c_oMainTables.Themes);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteTheme(_dst_themes[i]);
        }
        _count_arr = _dst_masters.length;
        this.StartMainRecord(c_oMainTables.SlideMasters);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteSlideMaster(_dst_masters[i]);
        }
        _count_arr = _dst_layouts.length;
        this.StartMainRecord(c_oMainTables.SlideLayouts);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteSlideLayout(_dst_layouts[i]);
        }
        _count_arr = _dst_slides.length;
        this.StartMainRecord(c_oMainTables.Slides);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteSlide(_dst_slides[i]);
        }
        _count_arr = _dst_notes.length;
        this.StartMainRecord(c_oMainTables.NotesSlides);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteSlideNote(_dst_notes[i]);
        }
        _count_arr = _dst_notesMasters.length;
        this.StartMainRecord(c_oMainTables.NotesMasters);
        this.WriteULong(_count_arr);
        for (var i = 0; i < _count_arr; i++) {
            this.WriteNoteMaster(_dst_notesMasters[i]);
        }
        this.StartMainRecord(c_oMainTables.FontMap);
        this.StartRecord(c_oMainTables.FontMap);
        this.WriteUChar(g_nodeAttributeStart);
        var _index_attr = 0;
        for (var i in this.font_map) {
            this.WriteUChar(_index_attr++);
            this.WriteString2(i);
        }
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
        this.StartMainRecord(c_oMainTables.ImageMap);
        this.StartRecord(c_oMainTables.ImageMap);
        this.WriteUChar(g_nodeAttributeStart);
        _index_attr = 0;
        for (var i in this.image_map) {
            this.WriteUChar(_index_attr++);
            this.WriteString2(i);
        }
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
        this.WriteMainPart();
    };
    this.WriteDocument = function (presentation) {
        this.WriteDocument2(presentation);
        var ret = "PPTY;v1;" + this.pos + ";";
        return ret + this.GetBase64Memory();
    };
    this.WriteApp = function (app) {
        this.StartMainRecord(c_oMainTables.App);
        this.StartRecord(c_oMainTables.App);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteString2(0, app.Template);
        this._WriteString2(1, app.Application);
        this._WriteString2(2, app.PresentationFormat);
        this._WriteString2(3, app.Company);
        this._WriteString2(4, app.AppVersion);
        this._WriteInt2(5, app.TotalTime);
        this._WriteInt2(6, app.Words);
        this._WriteInt2(7, app.Paragraphs);
        this._WriteInt2(8, app.Slides);
        this._WriteInt2(9, app.Notes);
        this._WriteInt2(10, app.HiddenSlides);
        this._WriteInt2(11, app.MMClips);
        this._WriteBool2(12, app.ScaleCrop);
        this._WriteBool2(13, app.LinksUpToDate);
        this._WriteBool2(14, app.SharedDoc);
        this._WriteBool2(15, app.HyperlinksChanged);
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
    };
    this.WriteCore = function (core) {
        this.StartMainRecord(c_oMainTables.Core);
        this.StartRecord(c_oMainTables.Core);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteString2(0, core.title);
        this._WriteString2(1, core.creator);
        this._WriteString2(2, core.lastModifiedBy);
        this._WriteString2(3, core.revision);
        this._WriteString2(4, core.created);
        this._WriteString2(5, core.modified);
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
    };
    this.WriteViewProps = function (viewprops) {
        this.StartMainRecord(c_oMainTables.ViewProps);
        this.StartRecord(c_oMainTables.ViewProps);
        this.EndRecord();
    };
    this.WritePresentation = function (presentation) {
        var pres = presentation.pres;
        this.StartMainRecord(c_oMainTables.Presentation);
        this.StartRecord(c_oMainTables.Presentation);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteBool2(0, pres.attrAutoCompressPictures);
        this._WriteInt2(1, pres.attrBookmarkIdSeed);
        this._WriteBool2(2, pres.attrCompatMode);
        this._WriteLimit2(3, pres.attrConformance);
        this._WriteBool2(4, pres.attrEmbedTrueTypeFonts);
        this._WriteInt2(5, pres.attrFirstSlideNum);
        this._WriteBool2(6, pres.attrRemovePersonalInfoOnSave);
        this._WriteBool2(7, pres.attrRtl);
        this._WriteBool2(8, pres.attrSaveSubsetFonts);
        this._WriteString2(9, pres.attrServerZoom);
        this._WriteBool2(10, pres.attrShowSpecialPlsOnTitleSld);
        this._WriteBool2(11, pres.attrStrictFirstAndLastChars);
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord2(0, presentation.defaultTextStyle, this.WriteTextListStyle);
        pres.SldSz.cx = (presentation.Width * c_dScalePPTXSizes) >> 0;
        pres.SldSz.cy = (presentation.Height * c_dScalePPTXSizes) >> 0;
        this.StartRecord(5);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteInt1(0, pres.SldSz.cx);
        this._WriteInt1(1, pres.SldSz.cy);
        this._WriteLimit2(2, pres.SldSz.type);
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
        pres.NotesSz = {};
        pres.NotesSz.cx = (presentation.Height * c_dScalePPTXSizes) >> 0;
        pres.NotesSz.cy = (presentation.Width * c_dScalePPTXSizes) >> 0;
        this.StartRecord(3);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteInt1(0, pres.NotesSz.cx);
        this._WriteInt1(1, pres.NotesSz.cy);
        this.WriteUChar(g_nodeAttributeEnd);
        this.EndRecord();
        if (!this.IsUseFullUrl) {
            var _countAuthors = 0;
            for (var i in presentation.CommentAuthors) {
                ++_countAuthors;
            }
            if (_countAuthors > 0) {
                this.StartRecord(6);
                this.StartRecord(0);
                this.WriteULong(_countAuthors);
                for (var i in presentation.CommentAuthors) {
                    var _author = presentation.CommentAuthors[i];
                    this.StartRecord(0);
                    this.WriteUChar(g_nodeAttributeStart);
                    this._WriteInt1(0, _author.Id);
                    this._WriteInt1(1, _author.LastId);
                    this._WriteInt1(2, _author.Id - 1);
                    this._WriteString1(3, _author.Name);
                    this._WriteString1(4, _author.Initials);
                    this.WriteUChar(g_nodeAttributeEnd);
                    this.EndRecord();
                }
                this.EndRecord();
                this.EndRecord();
            }
        }
        this.EndRecord();
    };
    this.WriteTheme = function (_theme) {
        this.StartRecord(c_oMainTables.Themes);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteString2(0, _theme.name);
        if (_theme.isThemeOverride) {
            this._WriteBool1(1, true);
        }
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord1(0, _theme.themeElements, this.WriteThemeElements);
        this.WriteRecord2(1, _theme.spDef, this.WriteDefaultShapeDefinition);
        this.WriteRecord2(2, _theme.lnDef, this.WriteDefaultShapeDefinition);
        this.WriteRecord2(3, _theme.txDef, this.WriteDefaultShapeDefinition);
        this.WriteRecordArray(4, 0, _theme.extraClrSchemeLst, this.WriteExtraClrScheme);
        this.EndRecord();
    };
    this.WriteSlideMaster = function (_master) {
        this.StartRecord(c_oMainTables.SlideMasters);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteBool2(0, _master.preserve);
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord1(0, _master.cSld, this.WriteCSld);
        this.WriteRecord1(1, _master.clrMap, this.WriteClrMap);
        this.WriteRecord2(5, _master.hf, this.WriteHF);
        this.WriteRecord2(6, _master.txStyles, this.WriteTxStyles);
        this.EndRecord();
    };
    this.WriteSlideLayout = function (_layout) {
        this.StartRecord(c_oMainTables.SlideLayouts);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteString2(0, _layout.matchingName);
        this._WriteBool2(1, _layout.preserve);
        this._WriteBool2(2, _layout.showMasterPhAnim);
        this._WriteBool2(3, _layout.showMasterSp);
        this._WriteBool2(4, _layout.userDrawn);
        this._WriteLimit2(5, _layout.type);
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord1(0, _layout.cSld, this.WriteCSld);
        this.WriteRecord2(1, _layout.clrMap, this.WriteClrMapOvr);
        this.WriteRecord2(4, _layout.hf, this.WriteHF);
        this.EndRecord();
    };
    this.WriteSlide = function (_slide) {
        this.StartRecord(c_oMainTables.Slides);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteBool2(0, _slide.show);
        this._WriteBool2(1, _slide.showMasterPhAnim);
        this._WriteBool2(2, _slide.showMasterSp);
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord1(0, _slide.cSld, this.WriteCSld);
        this.WriteRecord2(1, _slide.clrMap, this.WriteClrMapOvr);
        this.WriteRecord1(2, _slide.timing, this.WriteSlideTransition);
        var _countComments = 0;
        if (!this.IsUseFullUrl) {
            for (var i in _slide.writecomments) {
                ++_countComments;
            }
        }
        if (_countComments > 0) {
            this.StartRecord(4);
            this.StartRecord(0);
            this.WriteULong(_countComments);
            for (var i in _slide.writecomments) {
                var _comment = _slide.writecomments[i];
                this.StartRecord(0);
                this.WriteUChar(g_nodeAttributeStart);
                this._WriteInt1(0, _comment.WriteAuthorId);
                this._WriteString1(1, _comment.WriteTime);
                this._WriteInt1(2, _comment.WriteCommentId);
                this._WriteInt1(3, (_comment.x * 25.4) >> 0);
                this._WriteInt1(4, (_comment.y * 25.4) >> 0);
                this._WriteString1(5, _comment.Data.m_sText);
                if (0 != _comment.WriteParentAuthorId) {
                    this._WriteInt1(6, _comment.WriteParentAuthorId);
                    this._WriteInt1(7, _comment.WriteParentCommentId);
                }
                this._WriteString1(8, _comment.AdditionalData);
                this.WriteUChar(g_nodeAttributeEnd);
                this.EndRecord();
            }
            this.EndRecord();
            this.EndRecord();
        }
        this.EndRecord();
    };
    this.WriteSlideTransition = function (_timing) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool1(0, _timing.SlideAdvanceOnMouseClick);
        if (_timing.SlideAdvanceAfter) {
            oThis._WriteInt1(1, _timing.SlideAdvanceDuration);
            if (_timing.TransitionType == c_oAscSlideTransitionTypes.None) {
                oThis._WriteInt1(2, 0);
            }
        } else {
            if (_timing.TransitionType == c_oAscSlideTransitionTypes.None) {
                oThis._WriteInt1(2, 10);
            }
        }
        if (_timing.TransitionType != c_oAscSlideTransitionTypes.None) {
            oThis._WriteInt1(2, _timing.TransitionDuration);
            if (_timing.TransitionDuration < 250) {
                oThis._WriteUChar1(3, 0);
            } else {
                if (_timing.TransitionDuration > 1000) {
                    oThis._WriteUChar1(3, 2);
                } else {
                    oThis._WriteUChar1(3, 1);
                }
            }
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            switch (_timing.TransitionType) {
            case c_oAscSlideTransitionTypes.Fade:
                oThis._WriteString2(0, "p:fade");
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Fade_Smoothly:
                    oThis._WriteString2(1, "thruBlk");
                    oThis._WriteString2(2, "0");
                    break;
                case c_oAscSlideTransitionParams.Fade_Through_Black:
                    oThis._WriteString2(1, "thruBlk");
                    oThis._WriteString2(2, "1");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.Push:
                oThis._WriteString2(0, "p:push");
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Param_Left:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "r");
                    break;
                case c_oAscSlideTransitionParams.Param_Right:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "l");
                    break;
                case c_oAscSlideTransitionParams.Param_Top:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "d");
                    break;
                case c_oAscSlideTransitionParams.Param_Bottom:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "u");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.Wipe:
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Param_Left:
                    oThis._WriteString2(0, "p:wipe");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "r");
                    break;
                case c_oAscSlideTransitionParams.Param_Right:
                    oThis._WriteString2(0, "p:wipe");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "l");
                    break;
                case c_oAscSlideTransitionParams.Param_Top:
                    oThis._WriteString2(0, "p:wipe");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "d");
                    break;
                case c_oAscSlideTransitionParams.Param_Bottom:
                    oThis._WriteString2(0, "p:wipe");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "u");
                    break;
                case c_oAscSlideTransitionParams.Param_TopLeft:
                    oThis._WriteString2(0, "p:strips");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "rd");
                    break;
                case c_oAscSlideTransitionParams.Param_TopRight:
                    oThis._WriteString2(0, "p:strips");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "ld");
                    break;
                case c_oAscSlideTransitionParams.Param_BottomLeft:
                    oThis._WriteString2(0, "p:strips");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "ru");
                    break;
                case c_oAscSlideTransitionParams.Param_BottomRight:
                    oThis._WriteString2(0, "p:strips");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "lu");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.Split:
                oThis._WriteString2(0, "p:split");
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Split_HorizontalIn:
                    oThis._WriteString2(1, "orient");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "horz");
                    oThis._WriteString2(2, "in");
                    break;
                case c_oAscSlideTransitionParams.Split_HorizontalOut:
                    oThis._WriteString2(1, "orient");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "horz");
                    oThis._WriteString2(2, "out");
                    break;
                case c_oAscSlideTransitionParams.Split_VerticalIn:
                    oThis._WriteString2(1, "orient");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "vert");
                    oThis._WriteString2(2, "in");
                    break;
                case c_oAscSlideTransitionParams.Split_VerticalOut:
                    oThis._WriteString2(1, "orient");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "vert");
                    oThis._WriteString2(2, "out");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.UnCover:
                case c_oAscSlideTransitionTypes.Cover:
                if (_timing.TransitionType == c_oAscSlideTransitionTypes.Cover) {
                    oThis._WriteString2(0, "p:cover");
                } else {
                    oThis._WriteString2(0, "p:pull");
                }
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Param_Left:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "r");
                    break;
                case c_oAscSlideTransitionParams.Param_Right:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "l");
                    break;
                case c_oAscSlideTransitionParams.Param_Top:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "d");
                    break;
                case c_oAscSlideTransitionParams.Param_Bottom:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "u");
                    break;
                case c_oAscSlideTransitionParams.Param_TopLeft:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "rd");
                    break;
                case c_oAscSlideTransitionParams.Param_TopRight:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "ld");
                    break;
                case c_oAscSlideTransitionParams.Param_BottomLeft:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "ru");
                    break;
                case c_oAscSlideTransitionParams.Param_BottomRight:
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "lu");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.Clock:
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Clock_Clockwise:
                    oThis._WriteString2(0, "p:wheel");
                    oThis._WriteString2(1, "spokes");
                    oThis._WriteString2(2, "1");
                    break;
                case c_oAscSlideTransitionParams.Clock_Counterclockwise:
                    oThis._WriteString2(0, "p14:wheelReverse");
                    oThis._WriteString2(1, "spokes");
                    oThis._WriteString2(2, "1");
                    break;
                case c_oAscSlideTransitionParams.Clock_Wedge:
                    oThis._WriteString2(0, "p:wedge");
                    break;
                default:
                    break;
                }
                break;
            case c_oAscSlideTransitionTypes.Zoom:
                switch (_timing.TransitionOption) {
                case c_oAscSlideTransitionParams.Zoom_In:
                    oThis._WriteString2(0, "p14:warp");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "in");
                    break;
                case c_oAscSlideTransitionParams.Zoom_Out:
                    oThis._WriteString2(0, "p14:warp");
                    oThis._WriteString2(1, "dir");
                    oThis._WriteString2(2, "out");
                    break;
                case c_oAscSlideTransitionParams.Zoom_AndRotate:
                    oThis._WriteString2(0, "p:newsflash");
                    break;
                default:
                    break;
                }
                break;
            default:
                break;
            }
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.EndRecord();
        } else {
            oThis.WriteUChar(g_nodeAttributeEnd);
        }
    };
    this.WriteSlideNote = function (_note) {
        this.StartRecord(c_oMainTables.NotesSlides);
        this.WriteUChar(g_nodeAttributeStart);
        this._WriteBool2(0, _note.showMasterPhAnim);
        this._WriteBool2(1, _note.showMasterSp);
        this.WriteUChar(g_nodeAttributeEnd);
        this.WriteRecord1(0, _note.cSld, this.WriteCSld);
        this.WriteRecord2(1, _note.clrMap, this.WriteClrMapOvr);
        this.EndRecord();
    };
    this.WriteNoteMaster = function (_master) {
        this.StartRecord(c_oMainTables.NotesMasters);
        this.WriteRecord1(0, _master.cSld, this.WriteCSld);
        this.WriteRecord1(1, _master.clrMap, this.WriteClrMap);
        this.WriteRecord2(2, _master.hf, this.WriteHF);
        this.WriteRecord2(3, _master.notesStyle, this.WriteTextListStyle);
        this.EndRecord();
    };
    this.WriteThemeElements = function (themeElements) {
        oThis.WriteRecord1(0, themeElements.clrScheme, oThis.WriteClrScheme);
        oThis.WriteRecord1(1, themeElements.fontScheme, oThis.WriteFontScheme);
        oThis.WriteRecord1(2, themeElements.fmtScheme, oThis.WriteFmtScheme);
    };
    this.WriteFontScheme = function (fontScheme) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString1(0, fontScheme.name);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord1(0, fontScheme.majorFont, oThis.WriteFontCollection);
        oThis.WriteRecord1(1, fontScheme.minorFont, oThis.WriteFontCollection);
    };
    this.WriteFontCollection = function (coll) {
        oThis.WriteRecord1(0, {
            Name: coll.latin,
            Index: -1
        },
        oThis.WriteTextFontTypeface);
        oThis.WriteRecord1(1, {
            Name: coll.ea,
            Index: -1
        },
        oThis.WriteTextFontTypeface);
        oThis.WriteRecord1(2, {
            Name: coll.cs,
            Index: -1
        },
        oThis.WriteTextFontTypeface);
    };
    this.WriteFmtScheme = function (fmt) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString1(0, fmt.name);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecordArray(0, 0, fmt.fillStyleLst, oThis.WriteUniFill);
        oThis.WriteRecordArray(1, 0, fmt.lnStyleLst, oThis.WriteLn);
        oThis.WriteRecordArray(3, 0, fmt.bgFillStyleLst, oThis.WriteUniFill);
    };
    this.WriteDefaultShapeDefinition = function (shapeDef) {
        oThis.WriteRecord1(0, shapeDef.spPr, oThis.WriteSpPr);
        oThis.WriteRecord1(1, shapeDef.bodyPr, oThis.WriteBodyPr);
        oThis.WriteRecord1(2, shapeDef.lstStyle, oThis.WriteTextListStyle);
        oThis.WriteRecord2(3, shapeDef.style, oThis.WriteShapeStyle);
    };
    this.WriteExtraClrScheme = function (extraScheme) {
        oThis.WriteRecord1(0, extraScheme.clrScheme, oThis.WriteClrScheme);
        oThis.WriteRecord2(1, extraScheme.clrMap, oThis.WriteClrMap);
    };
    this.WriteCSld = function (cSld) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString2(0, cSld.name);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord2(0, cSld.Bg, oThis.WriteBg);
        var spTree = cSld.spTree;
        var _len = spTree.length;
        oThis.StartRecord(1);
        oThis.StartRecord(4);
        var uniPr = ExecuteNoHistory(function () {
            return new UniNvPr();
        },
        this, []);
        uniPr.cNvPr.id = 1;
        uniPr.cNvPr.name = "";
        var spPr = ExecuteNoHistory(function () {
            return new CSpPr();
        },
        this, []);
        spPr.xfrm = ExecuteNoHistory(function () {
            return new CXfrm();
        },
        this, []);
        spPr.xfrm.offX = 0;
        spPr.xfrm.offY = 0;
        spPr.xfrm.extX = 0;
        spPr.xfrm.extY = 0;
        spPr.xfrm.chOffX = 0;
        spPr.xfrm.chOffY = 0;
        spPr.xfrm.chExtX = 0;
        spPr.xfrm.chExtY = 0;
        spPr.WriteXfrm = spPr.xfrm;
        oThis.WriteRecord1(0, uniPr, oThis.WriteUniNvPr);
        oThis.WriteRecord1(1, spPr, oThis.WriteSpPr);
        if (0 != _len) {
            oThis.StartRecord(2);
            oThis.WriteULong(_len);
            for (var i = 0; i < _len; i++) {
                oThis.StartRecord(0);
                switch (spTree[i].getObjectType()) {
                case historyitem_type_Shape:
                    oThis.WriteShape(spTree[i]);
                    break;
                case historyitem_type_ImageShape:
                    oThis.WriteImage(spTree[i]);
                    break;
                case historyitem_type_GroupShape:
                    oThis.WriteGroupShape(spTree[i]);
                    break;
                case historyitem_type_ChartSpace:
                    oThis.WriteChart(spTree[i]);
                    break;
                default:
                    if (spTree[i] instanceof CGraphicFrame && spTree[i].graphicObject instanceof CTable) {
                        oThis.WriteTable(spTree[i]);
                    }
                }
                oThis.EndRecord();
            }
            oThis.EndRecord();
        }
        oThis.EndRecord();
        oThis.EndRecord();
    };
    this.WriteClrMap = function (clrmap) {
        oThis.WriteUChar(g_nodeAttributeStart);
        var _len = clrmap.color_map.length;
        for (var i = 0; i < _len; ++i) {
            if (null != clrmap.color_map[i]) {
                oThis.WriteUChar(i);
                oThis.WriteUChar(clrmap.color_map[i]);
            }
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteClrScheme = function (scheme) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString1(0, scheme.name);
        oThis.WriteUChar(g_nodeAttributeEnd);
        var _len = scheme.colors.length;
        for (var i = 0; i < _len; i++) {
            if (null != scheme.colors[i]) {
                oThis.WriteRecord1(i, scheme.colors[i], oThis.WriteUniColor);
            }
        }
    };
    this.WriteClrMapOvr = function (clrmapovr) {
        oThis.WriteRecord2(0, clrmapovr, oThis.WriteClrMap);
    };
    this.WriteHF = function (hf) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(0, hf.dt);
        oThis._WriteBool2(1, hf.ftr);
        oThis._WriteBool2(2, hf.hdr);
        oThis._WriteBool2(3, hf.sldNum);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteTxStyles = function (txStyles) {
        oThis.WriteRecord2(0, txStyles.titleStyle, oThis.WriteTextListStyle);
        oThis.WriteRecord2(1, txStyles.bodyStyle, oThis.WriteTextListStyle);
        oThis.WriteRecord2(2, txStyles.otherStyle, oThis.WriteTextListStyle);
    };
    this.WriteTextListStyle = function (styles) {
        var _levels = styles.levels;
        var _count = _levels.length;
        var _props_to_write;
        for (var i = 0; i < _count; ++i) {
            if (_levels[i]) {
                _props_to_write = new CTextParagraphPr();
                _props_to_write.bullet = _levels[i].Bullet;
                _props_to_write.lvl = _levels[i].Lvl;
                _props_to_write.pPr = _levels[i];
                _props_to_write.rPr = _levels[i].DefaultRunPr;
            } else {
                _props_to_write = null;
            }
            oThis.WriteRecord2(i, _props_to_write, oThis.WriteTextParagraphPr);
        }
    };
    this.WriteTextParagraphPr = function (tPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        var pPr = tPr.pPr;
        if (undefined !== pPr && null != pPr) {
            switch (pPr.Jc) {
            case align_Left:
                oThis._WriteUChar1(0, 4);
                break;
            case align_Center:
                oThis._WriteUChar1(0, 0);
                break;
            case align_Right:
                oThis._WriteUChar1(0, 5);
                break;
            case align_Justify:
                oThis._WriteUChar1(0, 2);
                break;
            default:
                break;
            }
            var ind = pPr.Ind;
            if (ind !== undefined && ind != null) {
                if (ind.FirstLine != null) {
                    oThis._WriteInt2(5, ind.FirstLine * 36000);
                }
                if (ind.Left != null) {
                    oThis._WriteInt1(8, ind.Left * 36000);
                }
                if (ind.Right != null) {
                    oThis._WriteInt1(9, ind.Right * 36000);
                }
            }
        }
        oThis._WriteInt2(7, tPr.lvl);
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (undefined !== pPr && null != pPr) {
            var spacing = pPr.Spacing;
            if (spacing !== undefined && spacing != null) {
                switch (spacing.LineRule) {
                case linerule_Auto:
                    oThis.StartRecord(0);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteInt1(0, (spacing.Line * 100000) >> 0);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                    break;
                case linerule_Exact:
                    oThis.StartRecord(0);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteInt1(1, (spacing.Line / 0.00352777778) >> 0);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                    break;
                default:
                    break;
                }
                if (spacing.After !== undefined) {
                    oThis.StartRecord(1);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteInt1(1, (spacing.After / 0.00352777778) >> 0);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                }
                if (spacing.Before !== undefined) {
                    oThis.StartRecord(2);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteInt1(1, (spacing.Before / 0.00352777778) >> 0);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                }
            }
        }
        var bullet = tPr.bullet;
        if (undefined !== bullet && null != bullet) {
            if (bullet.bulletColor != null && bullet.bulletColor.type != BULLET_TYPE_COLOR_NONE) {
                oThis.StartRecord(3);
                if (bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR) {
                    oThis.StartRecord(BULLET_TYPE_COLOR_CLR);
                    oThis.WriteRecord2(0, bullet.bulletColor.UniColor, oThis.WriteUniColor);
                    oThis.EndRecord();
                } else {
                    oThis.StartRecord(BULLET_TYPE_COLOR_CLRTX);
                    oThis.EndRecord();
                }
                oThis.EndRecord();
            }
            if (bullet.bulletSize != null && bullet.bulletSize.type != BULLET_TYPE_SIZE_NONE) {
                oThis.StartRecord(4);
                if (bullet.bulletSize.type == BULLET_TYPE_SIZE_PTS) {
                    oThis.StartRecord(BULLET_TYPE_SIZE_PTS);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteInt1(0, bullet.bulletSize.val);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                } else {
                    if (bullet.bulletSize.type == BULLET_TYPE_SIZE_PCT) {
                        oThis.StartRecord(BULLET_TYPE_SIZE_PCT);
                        oThis.WriteUChar(g_nodeAttributeStart);
                        oThis._WriteInt1(0, bullet.bulletSize.val);
                        oThis.WriteUChar(g_nodeAttributeEnd);
                        oThis.EndRecord();
                    } else {
                        oThis.StartRecord(BULLET_TYPE_SIZE_TX);
                        oThis.EndRecord();
                    }
                }
                oThis.EndRecord();
            }
            if (bullet.bulletTypeface != null && bullet.bulletTypeface.type != null && bullet.bulletTypeface.type != BULLET_TYPE_TYPEFACE_NONE) {
                oThis.StartRecord(5);
                if (bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT) {
                    oThis.WriteRecord2(BULLET_TYPE_TYPEFACE_BUFONT, {
                        Name: bullet.bulletTypeface.typeface,
                        Index: -1
                    },
                    oThis.WriteTextFontTypeface);
                } else {
                    oThis.StartRecord(BULLET_TYPE_TYPEFACE_TX);
                    oThis.EndRecord();
                }
                oThis.EndRecord();
            }
            if (bullet.bulletType != null && bullet.bulletType.type != null) {
                oThis.StartRecord(6);
                switch (bullet.bulletType.type) {
                case BULLET_TYPE_BULLET_CHAR:
                    oThis.StartRecord(BULLET_TYPE_BULLET_CHAR);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteString1(0, bullet.bulletType.Char);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                    break;
                case BULLET_TYPE_BULLET_BLIP:
                    oThis.StartRecord(BULLET_TYPE_BULLET_CHAR);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteString1(0, "*");
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                    break;
                case BULLET_TYPE_BULLET_AUTONUM:
                    oThis.StartRecord(BULLET_TYPE_BULLET_AUTONUM);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteLimit1(0, bullet.bulletType.AutoNumType);
                    oThis._WriteInt2(1, bullet.bulletType.startAt);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                    break;
                case BULLET_TYPE_BULLET_NONE:
                    oThis.StartRecord(BULLET_TYPE_BULLET_NONE);
                    oThis.EndRecord();
                    break;
                }
                oThis.EndRecord();
            }
        }
        if (pPr !== undefined && pPr != null && pPr.Tabs !== undefined && pPr.Tabs != null) {
            if (pPr.Tabs.Tabs != undefined && pPr.Tabs.Tabs != null) {
                oThis.WriteRecordArray(7, 0, pPr.Tabs.Tabs, oThis.WriteTab);
            }
        }
        if (tPr !== undefined && tPr != null) {
            oThis.WriteRecord2(8, tPr.rPr, oThis.WriteRunProperties);
        }
    };
    this.WriteRunProperties = function (rPr, hlinkObj) {
        if (rPr == null || rPr === undefined) {
            return;
        }
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(1, rPr.Bold);
        oThis._WriteBool2(7, rPr.Italic);
        var _cap = null;
        if (rPr.Caps === true) {
            _cap = 0;
        } else {
            if (rPr.SmallCaps === true) {
                _cap = 1;
            } else {
                if (rPr.Caps === false && rPr.SmallCaps === false) {
                    _cap = 2;
                }
            }
        }
        if (null != _cap) {
            oThis._WriteUChar1(4, _cap);
        }
        var _strike = null;
        if (rPr.DStrikeout === true) {
            _strike = 0;
        } else {
            if (rPr.Strikeout === true) {
                _strike = 2;
            } else {
                if (rPr.DStrikeout === false && rPr.Strikeout === false) {
                    _strike = 1;
                }
            }
        }
        if (undefined !== rPr.Spacing && null != rPr.Spacing) {
            oThis._WriteInt1(15, (rPr.Spacing * 7200 / 25.4) >> 0);
        }
        if (null != _strike) {
            oThis._WriteUChar1(16, _strike);
        }
        if (undefined !== rPr.Underline && null != rPr.Underline) {
            oThis._WriteUChar1(18, (rPr.Underline === true) ? 13 : 12);
        }
        if (undefined !== rPr.FontSize && null != rPr.FontSize) {
            oThis._WriteInt1(17, rPr.FontSize * 100);
        }
        if (vertalign_SubScript == rPr.VertAlign) {
            oThis._WriteInt1(2, -25000);
        } else {
            if (vertalign_SuperScript == rPr.VertAlign) {
                oThis._WriteInt1(2, 30000);
            }
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (rPr.Unifill) {
            oThis.WriteRecord1(1, rPr.Unifill, oThis.WriteUniFill);
        }
        if (rPr.RFonts) {
            if (rPr.RFonts.Ascii) {
                oThis.WriteRecord2(3, rPr.RFonts.Ascii, oThis.WriteTextFontTypeface);
            }
            if (rPr.RFonts.EastAsia) {
                oThis.WriteRecord2(4, rPr.RFonts.EastAsia, oThis.WriteTextFontTypeface);
            }
        }
        if (hlinkObj != null && hlinkObj !== undefined) {
            oThis.WriteRecord1(7, hlinkObj, oThis.WriteHyperlink);
        }
    };
    this.WriteHyperlink = function (hlink) {
        oThis.WriteUChar(g_nodeAttributeStart);
        var url = hlink.Value;
        var action = null;
        if (url == "ppaction://hlinkshowjump?jump=firstslide") {
            action = url;
            url = "";
        } else {
            if (url == "ppaction://hlinkshowjump?jump=lastslide") {
                action = url;
                url = "";
            } else {
                if (url == "ppaction://hlinkshowjump?jump=nextslide") {
                    action = url;
                    url = "";
                } else {
                    if (url == "ppaction://hlinkshowjump?jump=previousslide") {
                        action = url;
                        url = "";
                    } else {
                        var mask = "ppaction://hlinksldjumpslide";
                        var indSlide = url.indexOf(mask);
                        if (0 == indSlide) {
                            var slideNum = parseInt(url.substring(mask.length));
                            url = "slide" + (slideNum + 1) + ".xml";
                            action = "ppaction://hlinksldjump";
                        }
                    }
                }
            }
        }
        oThis._WriteString1(0, url);
        oThis._WriteString2(2, action);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteTextFontTypeface = function (typeface) {
        oThis.WriteUChar(g_nodeAttributeStart);
        if (!typeface || typeface.Name == null) {
            oThis.font_map["Arial"] = true;
            oThis._WriteString1(3, "Arial");
            oThis.WriteUChar(g_nodeAttributeEnd);
            return;
        }
        if ((0 != typeface.Name.indexOf("+mj")) && (0 != typeface.Name.indexOf("+mn"))) {
            oThis.font_map[typeface.Name] = true;
        }
        oThis._WriteString1(3, typeface.Name);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteTab = function (tab) {
        oThis.WriteUChar(g_nodeAttributeStart);
        var _algn = 2;
        if (tab.Value == tab_Center) {
            _algn = 0;
        } else {
            if (tab.Value == tab_Right) {
                _algn = 3;
            }
        }
        oThis._WriteLimit2(0, _algn);
        if (tab.Pos != undefined && tab.Pos != null) {
            oThis._WriteInt1(1, tab.Pos * 36000);
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteBodyPr = function (bodyPr) {
        if (undefined === bodyPr || null == bodyPr) {
            return;
        }
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt2(0, bodyPr.flatTx);
        oThis._WriteLimit2(1, bodyPr.anchor);
        oThis._WriteBool2(2, bodyPr.anchorCtr);
        oThis._WriteInt4(3, bodyPr.bIns, 36000);
        oThis._WriteBool2(4, bodyPr.compatLnSpc);
        oThis._WriteBool2(5, bodyPr.forceAA);
        oThis._WriteBool2(6, bodyPr.fromWordArt);
        oThis._WriteLimit2(7, bodyPr.horzOverflow);
        oThis._WriteInt4(8, bodyPr.lIns, 36000);
        oThis._WriteInt2(9, bodyPr.numCol);
        oThis._WriteInt4(10, bodyPr.rIns, 36000);
        oThis._WriteInt2(11, bodyPr.rot);
        oThis._WriteBool2(12, bodyPr.rtlCol);
        oThis._WriteInt2(13, bodyPr.spcCol);
        oThis._WriteBool2(14, bodyPr.spcFirstLastPara);
        oThis._WriteInt4(15, bodyPr.tIns, 36000);
        oThis._WriteBool2(16, bodyPr.upright);
        oThis._WriteLimit2(17, bodyPr.vert);
        oThis._WriteLimit2(18, bodyPr.vertOverflow);
        oThis._WriteLimit2(19, bodyPr.wrap);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteUniColor = function (unicolor) {
        if (undefined === unicolor || null == unicolor || unicolor.color == null) {
            return;
        }
        var color = unicolor.color;
        switch (color.type) {
        case COLOR_TYPE_PRST:
            oThis.StartRecord(COLOR_TYPE_PRST);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, color.id);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteMods(unicolor.Mods);
            oThis.EndRecord();
            break;
        case COLOR_TYPE_SCHEME:
            oThis.StartRecord(COLOR_TYPE_SCHEME);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteUChar1(0, color.id);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteMods(unicolor.Mods);
            oThis.EndRecord();
            break;
        case COLOR_TYPE_SRGB:
            oThis.StartRecord(COLOR_TYPE_SRGB);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteUChar1(0, color.RGBA.R);
            oThis._WriteUChar1(1, color.RGBA.G);
            oThis._WriteUChar1(2, color.RGBA.B);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteMods(unicolor.Mods);
            oThis.EndRecord();
            break;
        case COLOR_TYPE_SYS:
            oThis.StartRecord(COLOR_TYPE_SYS);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, color.id);
            oThis._WriteUChar1(1, color.RGBA.R);
            oThis._WriteUChar1(2, color.RGBA.G);
            oThis._WriteUChar1(3, color.RGBA.B);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteMods(unicolor.Mods);
            oThis.EndRecord();
            break;
        }
    };
    this.WriteMods = function (mods) {
        if (!mods || !mods.Mods) {
            return;
        }
        var _count = mods.Mods.length;
        if (0 == _count) {
            return;
        }
        oThis.StartRecord(0);
        oThis.WriteULong(_count);
        for (var i = 0; i < _count; ++i) {
            oThis.StartRecord(1);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, mods.Mods[i].name);
            oThis._WriteInt2(1, mods.Mods[i].val);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.CorrectUniColorAlpha = function (color, trans) {
        if (!color.Mods) {
            color.setMods(new CColorModifiers());
        }
        var mods = color.Mods.Mods;
        var _len = mods.length;
        if (trans != null) {
            var nIndex = -1;
            for (var i = 0; i < _len; i++) {
                if (mods[i].name == "alpha") {
                    nIndex = i;
                    break;
                }
            }
            if (-1 != nIndex) {
                --_len;
                mods.splice(nIndex, 1);
            }
            mods[_len] = new CColorMod();
            mods[_len].name = "alpha";
            mods[_len].val = (trans * 100000 / 255) >> 0;
        }
    };
    this.WriteUniFill = function (unifill) {
        if (undefined === unifill || null == unifill) {
            return;
        }
        var trans = ((unifill.transparent != null) && (unifill.transparent != 255)) ? unifill.transparent : null;
        var fill = unifill.fill;
        if (undefined === fill || null == fill) {
            return;
        }
        switch (fill.type) {
        case FILL_TYPE_NOFILL:
            oThis.StartRecord(FILL_TYPE_NOFILL);
            oThis.EndRecord();
            break;
        case FILL_TYPE_GRAD:
            oThis.StartRecord(FILL_TYPE_GRAD);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.StartRecord(0);
            var len = fill.colors.length;
            oThis.WriteULong(len);
            for (var i = 0; i < len; i++) {
                oThis.StartRecord(0);
                oThis.WriteUChar(g_nodeAttributeStart);
                oThis._WriteInt1(0, fill.colors[i].pos);
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.CorrectUniColorAlpha(fill.colors[i].color, trans);
                oThis.WriteRecord1(0, fill.colors[i].color, oThis.WriteUniColor);
                oThis.EndRecord();
            }
            oThis.EndRecord();
            if (fill.lin) {
                oThis.StartRecord(1);
                oThis.WriteUChar(g_nodeAttributeStart);
                oThis._WriteInt1(0, fill.lin.angle);
                oThis._WriteBool1(1, fill.lin.scale);
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.EndRecord();
            } else {
                if (fill.path) {
                    oThis.StartRecord(2);
                    oThis.WriteUChar(g_nodeAttributeStart);
                    oThis._WriteUChar1(0, fill.path.path);
                    oThis.WriteUChar(g_nodeAttributeEnd);
                    oThis.EndRecord();
                }
            }
            oThis.EndRecord();
            break;
        case FILL_TYPE_PATT:
            oThis.StartRecord(FILL_TYPE_PATT);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteLimit2(0, fill.ftype);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.CorrectUniColorAlpha(fill.fgClr, trans);
            oThis.CorrectUniColorAlpha(fill.bgClr, trans);
            oThis.WriteRecord1(0, fill.fgClr, oThis.WriteUniColor);
            oThis.WriteRecord1(1, fill.bgClr, oThis.WriteUniColor);
            oThis.EndRecord();
            break;
        case FILL_TYPE_BLIP:
            oThis.StartRecord(FILL_TYPE_BLIP);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            var api_sheet = window["Asc"]["editor"];
            var sFindString;
            if (api_sheet) {
                sFindString = api_sheet.wbModel.sUrlPath + "media/";
            } else {
                sFindString = window.editor.DocumentUrl + "media/";
            }
            var _src = fill.RasterImageId;
            if (0 == _src.indexOf(sFindString)) {
                _src = _src.substring(sFindString.length);
            }
            oThis.image_map[_src] = true;
            if (oThis.IsUseFullUrl) {
                if ((0 == _src.indexOf("theme")) && window.editor) {
                    _src = oThis.PresentationThemesOrigin + _src;
                } else {
                    if (0 != _src.indexOf("http:") && 0 != _src.indexOf("data:") && 0 != _src.indexOf("https:") && 0 != _src.indexOf("ftp:") && 0 != _src.indexOf("file:")) {
                        _src = oThis.DocumentOrigin + "media/" + _src;
                    }
                }
            }
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            if (null != trans) {
                oThis.StartRecord(2);
                oThis.WriteULong(1);
                oThis.StartRecord(3);
                oThis.StartRecord(21);
                oThis.WriteUChar(g_nodeAttributeStart);
                oThis._WriteInt1(0, (trans * 100000 / 255) >> 0);
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.EndRecord();
                oThis.EndRecord();
                oThis.EndRecord();
            }
            oThis.StartRecord(3);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, _src);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.EndRecord();
            oThis.EndRecord();
            if (fill.srcRect != null) {
                oThis.StartRecord(1);
                oThis.WriteUChar(g_nodeAttributeStart);
                if (fill.srcRect.l != null) {
                    var _num = (fill.srcRect.l * 1000) >> 0;
                    oThis._WriteString1(0, "" + _num);
                }
                if (fill.srcRect.t != null) {
                    var _num = (fill.srcRect.t * 1000) >> 0;
                    oThis._WriteString1(1, "" + _num);
                }
                if (fill.srcRect.l != null) {
                    var _num = ((100 - fill.srcRect.r) * 1000) >> 0;
                    oThis._WriteString1(2, "" + _num);
                }
                if (fill.srcRect.l != null) {
                    var _num = ((100 - fill.srcRect.b) * 1000) >> 0;
                    oThis._WriteString1(3, "" + _num);
                }
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.EndRecord();
            }
            if (true === fill.tile) {
                oThis.StartRecord(2);
                oThis.WriteUChar(g_nodeAttributeStart);
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.EndRecord();
            } else {
                oThis.StartRecord(3);
                oThis.EndRecord();
            }
            oThis.EndRecord();
            break;
        case FILL_TYPE_SOLID:
            oThis.StartRecord(FILL_TYPE_SOLID);
            oThis.CorrectUniColorAlpha(fill.color, trans);
            oThis.WriteRecord1(0, fill.color, oThis.WriteUniColor);
            oThis.EndRecord();
            break;
        default:
            break;
        }
    };
    this.WriteLn = function (ln) {
        if (undefined === ln || null == ln) {
            return;
        }
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteLimit2(0, ln.algn);
        oThis._WriteLimit2(1, ln.cap);
        oThis._WriteLimit2(2, ln.cmpd);
        oThis._WriteInt2(3, ln.w);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord2(0, ln.Fill, oThis.WriteUniFill);
        oThis.WriteRecord1(2, ln.Join, oThis.WriteLineJoin);
        oThis.WriteRecord2(3, ln.headEnd, oThis.WriteLineEnd);
        oThis.WriteRecord2(4, ln.tailEnd, oThis.WriteLineEnd);
    };
    this.WriteLineJoin = function (join) {
        if (join == null || join === undefined) {
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteInt1(0, 0);
            oThis.WriteUChar(g_nodeAttributeEnd);
            return;
        }
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt1(0, (join.type != null && join.type !== undefined) ? join.type : 0);
        oThis._WriteInt2(1, join.limit);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteLineEnd = function (end) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteLimit2(0, end.type);
        oThis._WriteLimit2(1, end.w);
        oThis._WriteLimit2(2, end.len);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteTxBody = function (txBody) {
        if (txBody.bodyPr) {
            oThis.WriteRecord2(0, txBody.bodyPr, oThis.WriteBodyPr);
        }
        if (txBody.lstStyle) {
            oThis.WriteRecord2(1, txBody.lstStyle, oThis.WriteTextListStyle);
        }
        var _content = txBody.content.Content;
        oThis.WriteRecordArray(2, 0, _content, oThis.WriteParagraph);
    };
    this.WriteParagraph = function (paragraph, startPos, endPos) {
        var tPr = new CTextParagraphPr();
        tPr.bullet = paragraph.Pr.Bullet;
        tPr.lvl = paragraph.Pr.Lvl;
        tPr.pPr = paragraph.Pr;
        tPr.rPr = paragraph.Pr.DefaultRunPr;
        if (tPr.rPr == null) {
            tPr.rPr = new CTextPr();
        }
        oThis.WriteRecord1(0, tPr, oThis.WriteTextParagraphPr);
        oThis.WriteRecord2(1, paragraph.TextPr.Value, oThis.WriteRunProperties);
        oThis.StartRecord(2);
        var _position = oThis.pos;
        oThis.WriteULong(0);
        var _count = 0;
        var _par_content = paragraph.Content;
        if (paragraph.f_id != undefined || paragraph.f_type != undefined || paragraph.f_text != undefined) {
            oThis.StartRecord(0);
            oThis.WriteParagraphField(paragraph.f_id, paragraph.f_type, paragraph.f_text);
            oThis.EndRecord();
            _count++;
        }
        var _content_len = _par_content.length;
        for (var i = 0; i < _content_len; i++) {
            var _elem = _par_content[i];
            switch (_elem.Type) {
            case para_Run:
                var _run_len = _elem.Content.length;
                var _run_text = "";
                for (var j = 0; j < _run_len; j++) {
                    switch (_elem.Content[j].Type) {
                    case para_Text:
                        _run_text += String.fromCharCode(_elem.Content[j].Value);
                        break;
                    case para_Space:
                        _run_text += " ";
                        break;
                    case para_Tab:
                        _run_text += "\t";
                        break;
                    case para_NewLine:
                        if ("" != _run_text) {
                            oThis.StartRecord(0);
                            oThis.WriteTextRun(_elem.Pr, _run_text, null);
                            oThis.EndRecord();
                            _count++;
                            _run_text = "";
                        }
                        oThis.StartRecord(0);
                        oThis.WriteLineBreak(_elem.Pr, null);
                        oThis.EndRecord();
                        _count++;
                        break;
                    }
                }
                if ("" != _run_text) {
                    oThis.StartRecord(0);
                    oThis.WriteTextRun(_elem.Pr, _run_text, null);
                    oThis.EndRecord();
                    _count++;
                }
                break;
            case para_Hyperlink:
                var _hObj = {
                    Value: _elem.Value
                };
                var _content_len_h = _elem.Content.length;
                for (var hi = 0; hi < _content_len_h; hi++) {
                    var _elem_h = _elem.Content[hi];
                    switch (_elem_h.Type) {
                    case para_Run:
                        var _run_len = _elem_h.Content.length;
                        var _run_text = "";
                        for (var j = 0; j < _run_len; j++) {
                            switch (_elem_h.Content[j].Type) {
                            case para_Text:
                                _run_text += String.fromCharCode(_elem_h.Content[j].Value);
                                break;
                            case para_Space:
                                _run_text += " ";
                                break;
                            case para_Tab:
                                _run_text += "\t";
                                break;
                            case para_NewLine:
                                if ("" != _run_text) {
                                    oThis.StartRecord(0);
                                    oThis.WriteTextRun(_elem_h.Pr, _run_text, _hObj);
                                    oThis.EndRecord();
                                    _count++;
                                    _run_text = "";
                                }
                                oThis.StartRecord(0);
                                oThis.WriteLineBreak(_elem_h.Pr, _hObj);
                                oThis.EndRecord();
                                _count++;
                                break;
                            }
                        }
                        if ("" != _run_text) {
                            oThis.StartRecord(0);
                            oThis.WriteTextRun(_elem.Content[0].Pr, _run_text, _hObj);
                            oThis.EndRecord();
                            _count++;
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
        var _new_pos = oThis.pos;
        oThis.pos = _position;
        oThis.WriteULong(_count);
        oThis.pos = _new_pos;
        oThis.EndRecord();
    };
    this.WriteParagraphField = function (id, type, text) {
        oThis.StartRecord(PARRUN_TYPE_FLD);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString1(0, id);
        oThis._WriteString2(1, type);
        oThis._WriteString2(2, text);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.EndRecord();
    };
    this.WriteTextRun = function (runPr, text, hlinkObj) {
        oThis.StartRecord(PARRUN_TYPE_RUN);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString2(0, text);
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (runPr !== undefined && runPr != null) {
            oThis.StartRecord(0);
            oThis.WriteRunProperties(runPr, hlinkObj);
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.WriteLineBreak = function (runPr, hlinkObj) {
        oThis.StartRecord(PARRUN_TYPE_BR);
        if (runPr !== undefined && runPr != null) {
            oThis.StartRecord(0);
            oThis.WriteRunProperties(runPr, hlinkObj);
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.WriteShapeStyle = function (style) {
        oThis.WriteRecord1(0, style.lnRef, oThis.WriteStyleRef);
        oThis.WriteRecord1(1, style.fillRef, oThis.WriteStyleRef);
        oThis.WriteRecord1(2, style.effectRef, oThis.WriteStyleRef);
        oThis.WriteRecord1(3, style.fontRef, oThis.WriteFontRef);
    };
    this.WriteStyleRef = function (ref) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt2(0, ref.idx);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord1(0, ref.Color, oThis.WriteUniColor);
    };
    this.WriteFontRef = function (ref) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteUChar2(0, ref.idx);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord1(0, ref.Color, oThis.WriteUniColor);
    };
    this.WriteBg = function (bg) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteLimit2(0, bg.bwMode);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord2(0, bg.bgPr, oThis.WriteBgPr);
        oThis.WriteRecord2(1, bg.bgRef, oThis.WriteStyleRef);
    };
    this.WriteBgPr = function (bgPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(0, bgPr.shadeToTitle);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord1(0, bgPr.Fill, oThis.WriteUniFill);
    };
    this.WriteShape = function (shape) {
        oThis.StartRecord(1);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(0, shape.attrUseBgFill);
        oThis.WriteUChar(g_nodeAttributeEnd);
        shape.spPr.WriteXfrm = shape.spPr.xfrm;
        var tmpFill = shape.spPr.Fill;
        var isUseTmpFill = false;
        if (tmpFill !== undefined && tmpFill != null) {
            var trans = ((tmpFill.transparent != null) && (tmpFill.transparent != 255)) ? tmpFill.transparent : null;
            if (trans != null) {
                if (tmpFill.fill === undefined || tmpFill.fill == null) {
                    isUseTmpFill = true;
                    shape.spPr.Fill = shape.brush;
                }
            }
        }
        oThis.WriteRecord2(0, shape.nvSpPr, oThis.WriteUniNvPr);
        oThis.WriteRecord1(1, shape.spPr, oThis.WriteSpPr);
        oThis.WriteRecord2(2, shape.style, oThis.WriteShapeStyle);
        oThis.WriteRecord2(3, shape.txBody, oThis.WriteTxBody);
        if (isUseTmpFill) {
            shape.spPr.Fill = tmpFill;
        }
        shape.spPr.WriteXfrm = null;
        oThis.EndRecord();
    };
    this.WriteImage = function (image) {
        oThis.StartRecord(2);
        oThis.WriteRecord1(0, image.nvPicPr, this.WriteUniNvPr);
        image.spPr.WriteXfrm = image.spPr.xfrm;
        if (image.spPr.geometry === undefined || image.spPr.geometry == null) {
            image.spPr.geometry = CreateGeometry("rect");
        }
        var unifill = new CUniFill();
        unifill.fill = image.blipFill;
        oThis.WriteRecord1(1, unifill, oThis.WriteUniFill);
        oThis.WriteRecord1(2, image.spPr, oThis.WriteSpPr);
        oThis.WriteRecord2(3, image.style, oThis.WriteShapeStyle);
        image.spPr.WriteXfrm = null;
        oThis.EndRecord();
    };
    this.WriteTable = function (grObj) {
        oThis.StartRecord(5);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord1(0, grObj.nvGraphicFramePr, oThis.WriteUniNvPr);
        if (grObj.spPr.xfrm && grObj.spPr.xfrm.isNotNull()) {
            oThis.WriteRecord2(1, grObj.spPr.xfrm, oThis.WriteXfrm);
        }
        oThis.WriteRecord2(2, grObj.graphicObject, oThis.WriteTable2);
        oThis.EndRecord();
    };
    this.WriteChart = function (grObj) {
        oThis.StartRecord(5);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (grObj.spPr.xfrm && grObj.spPr.xfrm.isNotNull()) {
            oThis.WriteRecord2(1, grObj.spPr.xfrm, oThis.WriteXfrm);
        }
        oThis.WriteRecord2(3, grObj, oThis.WriteChart2);
        oThis.EndRecord();
    };
    this.WriteChart2 = function (grObj) {
        var _memory = new CMemory(true);
        _memory.ImData = oThis.ImData;
        _memory.data = oThis.data;
        _memory.len = oThis.len;
        _memory.pos = oThis.pos;
        oThis.UseContinueWriter = true;
        var oBinaryChartWriter = new BinaryChartWriter(_memory);
        oBinaryChartWriter.WriteCT_ChartSpace(grObj);
        oThis.ImData = _memory.ImData;
        oThis.data = _memory.data;
        oThis.len = _memory.len;
        oThis.pos = _memory.pos;
        oThis.UseContinueWriter = false;
        _memory.ImData = null;
        _memory.data = null;
    };
    this.WriteTable2 = function (table) {
        var obj = {};
        obj.props = table.Pr;
        obj.look = table.TableLook;
        obj.style = table.TableStyle;
        oThis.WriteRecord1(0, obj, oThis.WriteTableProps);
        var grid = table.TableGrid;
        var _len = grid.length;
        oThis.StartRecord(1);
        oThis.WriteULong(_len);
        for (var i = 0; i < _len; i++) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteInt1(0, (grid[i] * 36000) >> 0);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.EndRecord();
        }
        oThis.EndRecord();
        oThis.StartRecord(2);
        var rows_c = table.Content.length;
        oThis.WriteULong(rows_c);
        var _grid = oThis.GenerateTableWriteGrid(table);
        for (var i = 0; i < rows_c; i++) {
            oThis.StartRecord(0);
            oThis.WriteTableRow(table.Content[i], _grid.Rows[i]);
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.GenerateTableWriteGrid = function (table) {
        var TableGrid = {};
        var _rows = table.Content;
        var _cols = table.TableGrid;
        var _cols_count = _cols.length;
        var _rows_count = _rows.length;
        TableGrid.Rows = new Array(_rows_count);
        for (var i = 0; i < _rows_count; i++) {
            TableGrid.Rows[i] = {};
            TableGrid.Rows[i].Cells = [];
            var _index = 0;
            var _cells_len = _rows[i].Content.length;
            for (var j = 0; j < _cells_len; j++) {
                var _cell = _rows[i].Content[j];
                var _cell_info = {};
                _cell_info.Cell = _cell;
                _cell_info.row_span = 1;
                _cell_info.grid_span = (_cell.Pr.GridSpan === undefined || _cell.Pr.GridSpan == null) ? 1 : _cell.Pr.GridSpan;
                _cell_info.hMerge = false;
                _cell_info.vMerge = false;
                _cell_info.isEmpty = false;
                if (_cell.Pr.VMerge == vmerge_Continue) {
                    _cell_info.vMerge = true;
                }
                TableGrid.Rows[i].Cells.push(_cell_info);
                if (_cell_info.grid_span > 1) {
                    for (var t = _cell_info.grid_span - 1; t > 0; t--) {
                        var _cell_info_empty = {};
                        _cell_info_empty.isEmpty = true;
                        _cell_info_empty.vMerge = _cell_info.vMerge;
                        TableGrid.Rows[i].Cells.push(_cell_info_empty);
                    }
                }
            }
        }
        for (var i = 0; i < _cols_count; i++) {
            var _index = 0;
            while (_index < _rows_count) {
                var _count = 1;
                for (var j = _index + 1; j < _rows_count; j++) {
                    if (i >= TableGrid.Rows[j].Cells.length) {
                        continue;
                    }
                    if (TableGrid.Rows[j].Cells[i].vMerge !== true) {
                        break;
                    }++_count;
                }
                if (i < TableGrid.Rows[_index].Cells.length) {
                    TableGrid.Rows[_index].Cells[i].row_span = _count;
                }
                _index += _count;
            }
        }
        return TableGrid;
    };
    this.WriteEmptyTableCell = function (_info) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool1(3, true);
        if (true == _info.vMerge) {
            oThis._WriteBool1(4, true);
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.StartRecord(1);
        oThis.StartRecord(0);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.EndRecord();
        oThis.StartRecord(2);
        oThis.WriteULong(1);
        oThis.StartRecord(0);
        oThis.StartRecord(1);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.EndRecord();
        oThis.EndRecord();
        oThis.EndRecord();
        oThis.EndRecord();
    };
    this.WriteTableRow = function (row, row_info) {
        oThis.WriteUChar(g_nodeAttributeStart);
        if (row.Pr.Height !== undefined && row.Pr.Height != null) {
            oThis._WriteInt1(0, (row.Pr.Height.Value * 36000) >> 0);
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.StartRecord(0);
        var _len = row_info.Cells.length;
        oThis.WriteULong(_len);
        for (var i = 0; i < _len; i++) {
            oThis.StartRecord(1);
            var _info = row_info.Cells[i];
            if (_info.isEmpty) {
                oThis.WriteEmptyTableCell(_info);
            } else {
                oThis.WriteUChar(g_nodeAttributeStart);
                if (_info.vMerge === false && _info.row_span > 1) {
                    oThis._WriteInt1(1, _info.row_span);
                }
                if (_info.hMerge === false && _info.grid_span > 1) {
                    oThis._WriteInt1(2, _info.grid_span);
                }
                if (_info.hMerge === true) {
                    oThis._WriteBool1(3, true);
                }
                if (_info.vMerge === true) {
                    oThis._WriteBool1(4, true);
                }
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.WriteTableCell(_info.Cell);
            }
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.WriteTableCell = function (cell) {
        oThis.StartRecord(0);
        oThis.WriteUChar(g_nodeAttributeStart);
        var _marg = cell.Pr.TableCellMar;
        var tableMar = cell.Row.Table.Pr.TableCellMar;
        if (_marg && _marg.Left && isRealNumber(_marg.Left.W)) {
            oThis._WriteInt1(0, (_marg.Left.W * 36000) >> 0);
        } else {
            if (tableMar && tableMar.Left && isRealNumber(tableMar.Left.W)) {
                oThis._WriteInt1(0, (tableMar.Left.W * 36000) >> 0);
            }
        }
        if (_marg && _marg.Top && isRealNumber(_marg.Top.W)) {
            oThis._WriteInt1(1, (_marg.Top.W * 36000) >> 0);
        } else {
            if (tableMar && tableMar.Top && isRealNumber(tableMar.Top.W)) {
                oThis._WriteInt1(1, (tableMar.Top.W * 36000) >> 0);
            }
        }
        if (_marg && _marg.Right && isRealNumber(_marg.Right.W)) {
            oThis._WriteInt1(2, (_marg.Right.W * 36000) >> 0);
        } else {
            if (tableMar && tableMar.Right && isRealNumber(tableMar.Right.W)) {
                oThis._WriteInt1(2, (tableMar.Right.W * 36000) >> 0);
            }
        }
        if (_marg && _marg.Bottom && isRealNumber(_marg.Bottom.W)) {
            oThis._WriteInt1(3, (_marg.Bottom.W * 36000) >> 0);
        } else {
            if (tableMar && tableMar.Bottom && isRealNumber(tableMar.Bottom.W)) {
                oThis._WriteInt1(3, (tableMar.Bottom.W * 36000) >> 0);
            }
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord3(0, cell.Pr.TableCellBorders.Left, oThis.WriteTableCellBorder);
        oThis.WriteRecord3(1, cell.Pr.TableCellBorders.Top, oThis.WriteTableCellBorder);
        oThis.WriteRecord3(2, cell.Pr.TableCellBorders.Right, oThis.WriteTableCellBorder);
        oThis.WriteRecord3(3, cell.Pr.TableCellBorders.Bottom, oThis.WriteTableCellBorder);
        var shd = cell.Pr.Shd;
        if (shd !== undefined && shd != null) {
            oThis.WriteRecord2(6, shd.Unifill, oThis.WriteUniFill);
        }
        oThis.EndRecord();
        oThis.StartRecord(1);
        oThis.WriteRecordArray(2, 0, cell.Content.Content, oThis.WriteParagraph);
        oThis.EndRecord();
    };
    this.WriteTableProps = function (obj) {
        oThis.WriteUChar(g_nodeAttributeStart);
        if (oThis.tableStylesGuides.hasOwnProperty(obj.style)) {
            oThis._WriteString1(0, oThis.tableStylesGuides[obj.style]);
        }
        oThis._WriteBool1(2, obj.look.m_bFirst_Row);
        oThis._WriteBool1(3, obj.look.m_bFirst_Col);
        oThis._WriteBool1(4, obj.look.m_bLast_Row);
        oThis._WriteBool1(5, obj.look.m_bLast_Col);
        oThis._WriteBool1(6, obj.look.m_bBand_Hor);
        oThis._WriteBool1(7, obj.look.m_bBand_Ver);
        oThis.WriteUChar(g_nodeAttributeEnd);
        var shd = obj.props.Shd;
        if (shd !== undefined && shd != null) {
            if (shd.Unifill !== undefined && shd.Unifill != null) {
                if (shd.Unifill.fill !== undefined && shd.Unifill.fill != null) {
                    oThis.WriteRecord1(0, shd.Unifill, oThis.WriteUniFill);
                }
            }
        }
    };
    this.WriteGroupShape = function (group) {
        oThis.StartRecord(4);
        group.spPr.WriteXfrm = group.spPr.xfrm;
        var _old_ph = group.nvGrpSpPr.nvPr.ph;
        group.nvGrpSpPr.nvPr.ph = null;
        oThis.WriteRecord1(0, group.nvGrpSpPr, oThis.WriteUniNvPr);
        group.nvGrpSpPr.nvPr.ph = _old_ph;
        oThis.WriteRecord1(1, group.spPr, oThis.WriteGrpSpPr);
        group.spPr.WriteXfrm = null;
        var spTree = group.spTree;
        var _len = spTree.length;
        if (0 != _len) {
            oThis.StartRecord(2);
            oThis.WriteULong(_len);
            for (var i = 0; i < _len; i++) {
                oThis.StartRecord(0);
                switch (spTree[i].getObjectType()) {
                case historyitem_type_Shape:
                    oThis.WriteShape(spTree[i]);
                    break;
                case historyitem_type_ImageShape:
                    oThis.WriteImage(spTree[i]);
                    break;
                case historyitem_type_GroupShape:
                    oThis.WriteGroupShape(spTree[i]);
                    break;
                case historyitem_type_ChartSpace:
                    oThis.WriteChart(spTree[i]);
                    break;
                default:
                    if (spTree[i] instanceof CGraphicFrame && spTree[i].graphicObject instanceof CTable) {
                        oThis.WriteTable(spTree[i]);
                    }
                }
                oThis.EndRecord(0);
            }
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.WriteGrpSpPr = function (grpSpPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteLimit2(0, grpSpPr.bwMode);
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (grpSpPr.WriteXfrm && grpSpPr.WriteXfrm.isNotNull()) {
            oThis.WriteRecord2(0, grpSpPr.WriteXfrm, oThis.WriteXfrm);
        }
        oThis.WriteRecord1(1, grpSpPr.Fill, oThis.WriteUniFill);
    };
    this.WriteSpPr = function (spPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteLimit2(0, spPr.bwMode);
        oThis.WriteUChar(g_nodeAttributeEnd);
        var _fill = spPr.Fill;
        var bIsExistFill = false;
        if (_fill !== undefined && _fill != null && _fill.fill !== undefined && _fill.fill != null) {
            bIsExistFill = true;
        }
        var bIsExistLn = false;
        if (spPr.ln !== undefined && spPr.ln != null) {
            _fill = spPr.ln.Fill;
            if (_fill !== undefined && _fill != null && _fill.fill !== undefined && _fill.fill != null) {
                bIsExistLn = true;
            }
        }
        if (spPr.xfrm && spPr.xfrm.isNotNull()) {
            oThis.WriteRecord2(0, spPr.xfrm, oThis.WriteXfrm);
        }
        oThis.WriteRecord2(1, spPr.geometry, oThis.WriteGeometry);
        if (spPr.geometry === undefined || spPr.geometry == null) {
            if (bIsExistFill || bIsExistLn) {
                oThis.StartRecord(1);
                oThis.StartRecord(1);
                oThis.WriteUChar(g_nodeAttributeStart);
                oThis._WriteString1(0, "rect");
                oThis.WriteUChar(g_nodeAttributeEnd);
                oThis.EndRecord();
                oThis.EndRecord();
            }
        }
        oThis.WriteRecord1(2, spPr.Fill, oThis.WriteUniFill);
        oThis.WriteRecord2(3, spPr.ln, oThis.WriteLn);
    };
    this.WriteXfrm = function (xfrm) {
        if (oThis.IsWordWriter === true) {
            return oThis.WriteXfrmRot(xfrm);
        }
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt4(0, xfrm.offX, c_dScalePPTXSizes);
        oThis._WriteInt4(1, xfrm.offY, c_dScalePPTXSizes);
        oThis._WriteInt4(2, xfrm.extX, c_dScalePPTXSizes);
        oThis._WriteInt4(3, xfrm.extY, c_dScalePPTXSizes);
        oThis._WriteInt4(4, xfrm.chOffX, c_dScalePPTXSizes);
        oThis._WriteInt4(5, xfrm.chOffY, c_dScalePPTXSizes);
        oThis._WriteInt4(6, xfrm.chExtX, c_dScalePPTXSizes);
        oThis._WriteInt4(7, xfrm.chExtY, c_dScalePPTXSizes);
        oThis._WriteBool2(8, xfrm.flipH);
        oThis._WriteBool2(9, xfrm.flipV);
        oThis._WriteInt4(10, xfrm.rot, 180 * 60000 / Math.PI);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteXfrmRot = function (xfrm) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt4(0, xfrm.offX, c_dScalePPTXSizes);
        oThis._WriteInt4(1, xfrm.offY, c_dScalePPTXSizes);
        oThis._WriteInt4(2, xfrm.extX, c_dScalePPTXSizes);
        oThis._WriteInt4(3, xfrm.extY, c_dScalePPTXSizes);
        oThis._WriteInt4(4, xfrm.chOffX, c_dScalePPTXSizes);
        oThis._WriteInt4(5, xfrm.chOffY, c_dScalePPTXSizes);
        oThis._WriteInt4(6, xfrm.chExtX, c_dScalePPTXSizes);
        oThis._WriteInt4(7, xfrm.chExtY, c_dScalePPTXSizes);
        oThis._WriteBool2(8, xfrm.flipH);
        oThis._WriteBool2(9, xfrm.flipV);
        if (xfrm.rot != null) {
            var nCheckInvert = 0;
            if (true == xfrm.flipH) {
                nCheckInvert += 1;
            }
            if (true == xfrm.flipV) {
                nCheckInvert += 1;
            }
            var _rot = (xfrm.rot * 180 * 60000 / Math.PI) >> 0;
            var _n360 = 360 * 60000;
            if (_rot > _n360) {
                var _nDel = (_rot / _n360) >> 0;
                _rot = _rot - _nDel * _n360;
            } else {
                if (_rot < 0) {
                    var _nDel = (-_rot / _n360) >> 0;
                    _nDel += 1;
                    _rot = _rot + _nDel * _n360;
                }
            }
            if (nCheckInvert == 1) {
                _rot = _n360 - _rot;
            }
            oThis._WriteInt1(10, _rot);
        }
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteUniNvPr = function (nv) {
        oThis.WriteRecord1(0, nv.cNvPr, oThis.Write_cNvPr);
        oThis.WriteRecord1(2, nv.nvPr, oThis.Write_nvPr);
    };
    this.Write_cNvPr = function (cNvPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteInt1(0, cNvPr.id);
        oThis._WriteString1(1, cNvPr.name);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.Write_nvPr = function (nvPr) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(0, nvPr.isPhoto);
        oThis._WriteBool2(1, nvPr.userDrawn);
        oThis.WriteUChar(g_nodeAttributeEnd);
        oThis.WriteRecord2(0, nvPr.ph, oThis.Write_ph);
    };
    this.Write_ph = function (ph) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteBool2(0, ph.hasCustomPrompt);
        oThis._WriteString2(1, ph.idx);
        oThis._WriteLimit2(2, ph.orient);
        oThis._WriteLimit2(3, ph.sz);
        oThis._WriteLimit2(4, ph.type);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WriteGeometry = function (geom) {
        if (undefined === geom || null == geom) {
            return;
        }
        if (typeof geom.preset === "string" && geom.preset.length > 0) {
            oThis.StartRecord(1);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, geom.preset);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteAdj(geom.gdLst, geom.avLst, 0);
            oThis.EndRecord();
        } else {
            oThis.StartRecord(2);
            oThis.WriteAdj(geom.gdLst, geom.avLst, 0);
            oThis.WriteGuides(geom.gdLstInfo, 1);
            oThis.WriteAh(geom.ahXYLstInfo, geom.ahPolarLstInfo, 2);
            oThis.WriteCnx(geom.cnxLstInfo, 3);
            oThis.WritePathLst(geom.pathLst, 4);
            oThis.WriteRecord2(5, geom.rectS, oThis.WriteTextRect);
            oThis.EndRecord();
        }
    };
    this.WriteAdj = function (gdLst, avLst, rec_num) {
        var _len = 0;
        for (var i in avLst) {
            ++_len;
        }
        if (0 == _len) {
            return;
        }
        oThis.StartRecord(rec_num);
        oThis.WriteULong(_len);
        for (var i in avLst) {
            oThis.StartRecord(1);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis._WriteString1(0, i);
            oThis._WriteInt1(1, 15);
            oThis._WriteString1(2, "" + (gdLst[i] >> 0));
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.EndRecord();
        }
        oThis.EndRecord();
    };
    this.WriteGuides = function (gdLst, rec_num) {
        var _len = gdLst.length;
        if (0 == rec_num) {
            return;
        }
        this.StartRecord(rec_num);
        this.WriteULong(_len);
        for (var i = 0; i < _len; i++) {
            this.StartRecord(1);
            var _gd = gdLst[i];
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteString1(0, _gd.name);
            this._WriteInt1(1, _gd.formula);
            this._WriteString2(2, _gd.x);
            this._WriteString2(3, _gd.y);
            this._WriteString2(4, _gd.z);
            this.WriteUChar(g_nodeAttributeEnd);
            this.EndRecord();
        }
        this.EndRecord();
    };
    this.WriteAh = function (ahLstXY, ahLstPolar, rec_num) {
        var _len = 0;
        for (var i in ahLstXY) {
            ++_len;
        }
        for (var i in ahLstPolar) {
            ++_len;
        }
        if (0 == rec_num) {
            return;
        }
        this.StartRecord(rec_num);
        this.WriteULong(_len);
        for (var i in ahLstXY) {
            this.StartRecord(1);
            var _ah = ahLstXY[i];
            this.StartRecord(2);
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteString2(0, _ah.posX);
            this._WriteString2(1, _ah.posY);
            this._WriteString2(2, _ah.gdRefX);
            this._WriteString2(3, _ah.gdRefY);
            this._WriteString2(4, _ah.maxX);
            this._WriteString2(5, _ah.maxY);
            this._WriteString2(6, _ah.minX);
            this._WriteString2(7, _ah.minY);
            this.WriteUChar(g_nodeAttributeEnd);
            this.EndRecord();
            this.EndRecord();
        }
        for (var i in ahLstPolar) {
            this.StartRecord(1);
            var _ah = ahLstPolar[i];
            this.StartRecord(2);
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteString2(0, _ah.posX);
            this._WriteString2(1, _ah.posY);
            this._WriteString2(2, _ah.gdRefAng);
            this._WriteString2(3, _ah.gdRefR);
            this._WriteString2(4, _ah.maxAng);
            this._WriteString2(5, _ah.maxR);
            this._WriteString2(6, _ah.minAng);
            this._WriteString2(7, _ah.minR);
            this.WriteUChar(g_nodeAttributeEnd);
            this.EndRecord();
            this.EndRecord();
        }
        this.EndRecord();
    };
    this.WriteCnx = function (cnxLst, rec_num) {
        var _len = 0;
        for (var i in cnxLst) {
            ++_len;
        }
        if (0 == rec_num) {
            return;
        }
        this.StartRecord(rec_num);
        this.WriteULong(_len);
        for (var i in cnxLst) {
            this.StartRecord(1);
            var _gd = cnxLst[i];
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteString1(0, _gd.x);
            this._WriteString1(1, _gd.y);
            this._WriteString1(2, _gd.ang);
            this.WriteUChar(g_nodeAttributeEnd);
            this.EndRecord();
        }
        this.EndRecord();
    };
    this.WriteTextRect = function (rect) {
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString2(0, rect.l);
        oThis._WriteString2(1, rect.t);
        oThis._WriteString2(2, rect.r);
        oThis._WriteString2(3, rect.b);
        oThis.WriteUChar(g_nodeAttributeEnd);
    };
    this.WritePathLst = function (pathLst, rec_num) {
        var _len = pathLst.length;
        if (0 == _len) {
            return;
        }
        this.StartRecord(rec_num);
        this.WriteULong(_len);
        for (var i = 0; i < _len; i++) {
            this.StartRecord(1);
            var _path = pathLst[i];
            this.WriteUChar(g_nodeAttributeStart);
            this._WriteBool2(0, _path.extrusionOk);
            if (_path.fill != null && _path.fill !== undefined) {
                this._WriteLimit1(1, (_path.fill == "none") ? 4 : 5);
            }
            this._WriteInt2(2, _path.pathH);
            this._WriteBool2(3, _path.stroke);
            this._WriteInt2(4, _path.pathW);
            this.WriteUChar(g_nodeAttributeEnd);
            var _comms = _path.ArrPathCommandInfo;
            var _count = _comms.length;
            if (0 != _count) {
                this.StartRecord(0);
                this.WriteULong(_count);
                for (var j = 0; j < _count; j++) {
                    this.StartRecord(0);
                    var cmd = _comms[j];
                    switch (cmd.id) {
                    case moveTo:
                        this.StartRecord(1);
                        this.WriteUChar(g_nodeAttributeStart);
                        this._WriteString1(0, "" + cmd.X);
                        this._WriteString1(1, "" + cmd.Y);
                        this.WriteUChar(g_nodeAttributeEnd);
                        this.EndRecord();
                        break;
                    case lineTo:
                        this.StartRecord(2);
                        this.WriteUChar(g_nodeAttributeStart);
                        this._WriteString1(0, "" + cmd.X);
                        this._WriteString1(1, "" + cmd.Y);
                        this.WriteUChar(g_nodeAttributeEnd);
                        this.EndRecord();
                        break;
                    case bezier3:
                        this.StartRecord(6);
                        this.WriteUChar(g_nodeAttributeStart);
                        this._WriteString1(0, "" + cmd.X0);
                        this._WriteString1(1, "" + cmd.Y0);
                        this._WriteString1(2, "" + cmd.X1);
                        this._WriteString1(3, "" + cmd.Y1);
                        this.WriteUChar(g_nodeAttributeEnd);
                        this.EndRecord();
                        break;
                    case bezier4:
                        this.StartRecord(4);
                        this.WriteUChar(g_nodeAttributeStart);
                        this._WriteString1(0, "" + cmd.X0);
                        this._WriteString1(1, "" + cmd.Y0);
                        this._WriteString1(2, "" + cmd.X1);
                        this._WriteString1(3, "" + cmd.Y1);
                        this._WriteString1(4, "" + cmd.X2);
                        this._WriteString1(5, "" + cmd.Y2);
                        this.WriteUChar(g_nodeAttributeEnd);
                        this.EndRecord();
                        break;
                    case arcTo:
                        this.StartRecord(5);
                        this.WriteUChar(g_nodeAttributeStart);
                        this._WriteString1(0, "" + cmd.wR);
                        this._WriteString1(1, "" + cmd.hR);
                        this._WriteString1(2, "" + cmd.stAng);
                        this._WriteString1(3, "" + cmd.swAng);
                        this.WriteUChar(g_nodeAttributeEnd);
                        this.EndRecord();
                        break;
                    case close:
                        this.StartRecord(3);
                        this.EndRecord();
                        break;
                    }
                    this.EndRecord();
                }
                this.EndRecord();
            }
            this.EndRecord();
        }
        this.EndRecord();
    };
    this.WriteTableStyle = function (num, tableStyle) {
        oThis.StartRecord(1);
        oThis.WriteUChar(g_nodeAttributeStart);
        oThis._WriteString1(0, oThis.tableStylesGuides[num]);
        var __name = tableStyle.Name;
        __name = __name.replace(/&/g, "_");
        __name = __name.replace(/>/g, "_");
        __name = __name.replace(/</g, "_");
        __name = __name.replace(/"/g, "_");
        __name = __name.replace(/'/g, "_");
        oThis._WriteString2(1, __name);
        oThis.WriteUChar(g_nodeAttributeEnd);
        if (undefined !== tableStyle.TablePr.Shd && null != tableStyle.TablePr.Shd) {
            oThis.StartRecord(0);
            if (tableStyle.TablePr.Shd.Unifill != null && tableStyle.TablePr.Shd.Unifill !== undefined) {
                oThis.StartRecord(0);
                oThis.WriteRecord2(0, tableStyle.TablePr.Shd.Unifill, oThis.WriteUniFill);
                oThis.EndRecord();
            }
            if (tableStyle.TablePr.Shd.FillRef != null && tableStyle.TablePr.Shd.FillRef !== undefined) {
                oThis.WriteRecord2(1, tableStyle.TablePr.Shd.FillRef, oThis.WriteStyleRef);
            }
            oThis.EndRecord();
        }
        if (tableStyle.TableWholeTable) {
            oThis.StartRecord(1);
            oThis.WriteTableStylePartWH(tableStyle.TableWholeTable, tableStyle.TablePr);
            oThis.EndRecord();
        }
        oThis.WriteRecord2(2, tableStyle.TableBand1Horz, oThis.WriteTableStylePart);
        oThis.WriteRecord2(3, tableStyle.TableBand2Horz, oThis.WriteTableStylePart);
        oThis.WriteRecord2(4, tableStyle.TableBand1Vert, oThis.WriteTableStylePart);
        oThis.WriteRecord2(5, tableStyle.TableBand2Vert, oThis.WriteTableStylePart);
        oThis.WriteRecord2(6, tableStyle.TableLastCol, oThis.WriteTableStylePart);
        oThis.WriteRecord2(7, tableStyle.TableFirstCol, oThis.WriteTableStylePart);
        oThis.WriteRecord2(8, tableStyle.TableFirstRow, oThis.WriteTableStylePart);
        oThis.WriteRecord2(9, tableStyle.TableLastRow, oThis.WriteTableStylePart);
        oThis.WriteRecord2(10, tableStyle.TableBRCell, oThis.WriteTableStylePart);
        oThis.WriteRecord2(11, tableStyle.TableBLCell, oThis.WriteTableStylePart);
        oThis.WriteRecord2(12, tableStyle.TableTRCell, oThis.WriteTableStylePart);
        oThis.WriteRecord2(13, tableStyle.TableTLCell, oThis.WriteTableStylePart);
        oThis.EndRecord();
    };
    this.WriteTableStylePart = function (_part) {
        var bIsFontRef = false;
        if (_part.TextPr.FontRef !== undefined && _part.TextPr.FontRef != null) {
            bIsFontRef = true;
        }
        var bIsFill = false;
        if (_part.TextPr.Unifill !== undefined && _part.TextPr.Unifill != null) {
            bIsFill = true;
        }
        if (bIsFontRef || bIsFill) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            if (isRealBool(_part.TextPr.Italic)) {
                oThis._WriteLimit1(0, _part.TextPr.Italic === true ? 0 : 1);
            }
            if (isRealBool(_part.TextPr.Bold)) {
                oThis._WriteLimit1(1, _part.TextPr.Bold === true ? 0 : 1);
            }
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteRecord2(0, _part.TextPr.FontRef, oThis.WriteFontRef);
            if (bIsFill && _part.TextPr.Unifill.fill !== undefined && _part.TextPr.Unifill.fill != null && _part.TextPr.Unifill.fill.type == FILL_TYPE_SOLID) {
                oThis.WriteRecord2(1, _part.TextPr.Unifill.fill.color, oThis.WriteUniColor);
            }
            oThis.EndRecord();
        }
        oThis.StartRecord(1);
        oThis.StartRecord(0);
        oThis.WriteRecord3(0, _part.TableCellPr.TableCellBorders.Left, oThis.WriteTableCellBorderLineStyle);
        oThis.WriteRecord3(1, _part.TableCellPr.TableCellBorders.Right, oThis.WriteTableCellBorderLineStyle);
        oThis.WriteRecord3(2, _part.TableCellPr.TableCellBorders.Top, oThis.WriteTableCellBorderLineStyle);
        oThis.WriteRecord3(3, _part.TableCellPr.TableCellBorders.Bottom, oThis.WriteTableCellBorderLineStyle);
        oThis.WriteRecord3(4, _part.TableCellPr.TableCellBorders.InsideH, oThis.WriteTableCellBorderLineStyle);
        oThis.WriteRecord3(5, _part.TableCellPr.TableCellBorders.InsideV, oThis.WriteTableCellBorderLineStyle);
        oThis.EndRecord();
        var _Shd = _part.TableCellPr.Shd;
        if (undefined !== _Shd && null != _Shd) {
            oThis.WriteRecord2(1, _Shd.FillRef, oThis.WriteStyleRef);
            if (_Shd.Unifill !== undefined && _Shd.Unifill != null) {
                oThis.StartRecord(2);
                oThis.WriteRecord2(0, _Shd.Unifill, oThis.WriteUniFill);
                oThis.EndRecord();
            }
        }
        oThis.EndRecord();
    };
    this.WriteTableStylePartWH = function (_part, tablePr) {
        var bIsFontRef = false;
        if (_part.TextPr.FontRef !== undefined && _part.TextPr.FontRef != null) {
            bIsFontRef = true;
        }
        var bIsFill = false;
        if (_part.TextPr.Unifill !== undefined && _part.TextPr.Unifill != null) {
            bIsFill = true;
        }
        if (bIsFontRef || bIsFill) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteRecord2(0, _part.TextPr.FontRef, oThis.WriteFontRef);
            if (bIsFill && _part.TextPr.Unifill.fill !== undefined && _part.TextPr.Unifill.fill != null && _part.TextPr.Unifill.fill.type == FILL_TYPE_SOLID) {
                oThis.WriteRecord2(1, _part.TextPr.Unifill.fill.color, oThis.WriteUniColor);
            }
            oThis.EndRecord();
        }
        oThis.StartRecord(1);
        oThis.StartRecord(0);
        var bIsRet = false;
        bIsRet = oThis.WriteRecord3(0, tablePr.TableBorders.Left, oThis.WriteTableCellBorderLineStyle);
        if (!bIsRet) {
            oThis.WriteTableCellBorderLineStyle2(0, tablePr.TableBorders.Left);
        }
        bIsRet = oThis.WriteRecord3(1, tablePr.TableBorders.Right, oThis.WriteTableCellBorderLineStyle);
        if (!bIsRet) {
            oThis.WriteTableCellBorderLineStyle2(1, tablePr.TableBorders.Right);
        }
        bIsRet = oThis.WriteRecord3(2, tablePr.TableBorders.Top, oThis.WriteTableCellBorderLineStyle);
        if (!bIsRet) {
            oThis.WriteTableCellBorderLineStyle2(2, tablePr.TableBorders.Top);
        }
        bIsRet = oThis.WriteRecord3(3, tablePr.TableBorders.Bottom, oThis.WriteTableCellBorderLineStyle);
        if (!bIsRet) {
            oThis.WriteTableCellBorderLineStyle2(3, tablePr.TableBorders.Bottom);
        }
        if (tablePr.TableBorders.InsideH) {
            oThis.WriteTableCellBorderLineStyle2(4, tablePr.TableBorders.InsideH);
        }
        if (tablePr.TableBorders.InsideV) {
            oThis.WriteTableCellBorderLineStyle2(5, tablePr.TableBorders.InsideV);
        }
        oThis.EndRecord();
        var _Shd = _part.TableCellPr.Shd;
        if (undefined !== _Shd && null != _Shd) {
            oThis.WriteRecord2(1, _Shd.FillRef, oThis.WriteStyleRef);
            if (_Shd.Unifill !== undefined && _Shd.Unifill != null) {
                oThis.StartRecord(2);
                oThis.WriteRecord2(0, _Shd.Unifill, oThis.WriteUniFill);
                oThis.EndRecord();
            }
        }
        oThis.EndRecord();
    };
    this.WriteTableCellBorder = function (_border) {
        if (_border.Value == border_None) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            var _unifill = new CUniFill();
            _unifill.fill = new CNoFill();
            oThis.WriteRecord2(0, _unifill, oThis.WriteUniFill);
            oThis.EndRecord();
            return;
        }
        var bIsFill = false;
        var bIsSize = false;
        if ((_border.Unifill !== undefined && _border.Unifill != null)) {
            bIsFill = true;
        }
        if (_border.Size !== undefined && _border.Size != null) {
            bIsSize = true;
        }
        if (bIsFill || bIsSize) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            if (bIsSize) {
                oThis._WriteInt2(3, (_border.Size * 36000) >> 0);
            }
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteRecord2(0, _border.Unifill, oThis.WriteUniFill);
            oThis.EndRecord();
        }
    };
    this.WriteTableCellBorderLineStyle2 = function (rec_type, _border) {
        if (!_border) {
            oThis.StartRecord(rec_type);
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            var _unifill = new CUniFill();
            _unifill.fill = new CNoFill();
            oThis.WriteRecord2(0, _unifill, oThis.WriteUniFill);
            oThis.EndRecord();
            oThis.EndRecord();
            return;
        } else {
            oThis.WriteRecord3(rec_type, _border, oThis.WriteTableCellBorderLineStyle);
        }
    };
    this.WriteTableCellBorderLineStyle = function (_border) {
        if (_border.Value == border_None) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            oThis.WriteUChar(g_nodeAttributeEnd);
            var _unifill = new CUniFill();
            _unifill.fill = new CNoFill();
            oThis.WriteRecord2(0, _unifill, oThis.WriteUniFill);
            oThis.EndRecord();
            return;
        }
        var bIsFill = false;
        var bIsSize = false;
        var bIsLnRef = false;
        if ((_border.Unifill !== undefined && _border.Unifill != null)) {
            bIsFill = true;
        }
        if (_border.Size !== undefined && _border.Size != null) {
            bIsSize = true;
        }
        if (bIsFill && bIsSize) {
            oThis.StartRecord(0);
            oThis.WriteUChar(g_nodeAttributeStart);
            if (bIsSize) {
                oThis._WriteInt2(3, (_border.Size * 36000) >> 0);
            }
            oThis.WriteUChar(g_nodeAttributeEnd);
            oThis.WriteRecord2(0, _border.Unifill, oThis.WriteUniFill);
            oThis.EndRecord();
        }
        oThis.WriteRecord2(1, _border.LineRef, oThis.WriteStyleRef);
    };
}