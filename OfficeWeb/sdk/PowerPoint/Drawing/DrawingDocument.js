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
var g_fontManager = new CFontManager();
g_fontManager.Initialize(true);
var TRACK_CIRCLE_RADIUS = 5;
var TRACK_RECT_SIZE2 = 4;
var TRACK_RECT_SIZE = 8;
var TRACK_DISTANCE_ROTATE = 25;
var TRACK_ADJUSTMENT_SIZE = 10;
var FOCUS_OBJECT_THUMBNAILS = 0;
var FOCUS_OBJECT_MAIN = 1;
var FOCUS_OBJECT_NOTES = 2;
var COMMENT_WIDTH = 18;
var COMMENT_HEIGHT = 16;
function CTableMarkup(Table) {
    this.Internal = {
        RowIndex: 0,
        CellIndex: 0,
        PageNum: 0
    };
    this.Table = Table;
    this.X = 0;
    this.Cols = [];
    this.Margins = [];
    this.Rows = [];
    this.CurCol = 0;
    this.CurRow = 0;
    this.TransformX = 0;
    this.TransformY = 0;
}
CTableMarkup.prototype = {
    CreateDublicate: function () {
        var obj = new CTableMarkup(this.Table);
        obj.Internal = {
            RowIndex: this.Internal.RowIndex,
            CellIndex: this.Internal.CellIndex,
            PageNum: this.Internal.PageNum
        };
        obj.X = this.X;
        var len = this.Cols.length;
        for (var i = 0; i < len; i++) {
            obj.Cols[i] = this.Cols[i];
        }
        len = this.Margins.length;
        for (var i = 0; i < len; i++) {
            obj.Margins[i] = {
                Left: this.Margins[i].Left,
                Right: this.Margins[i].Right
            };
        }
        len = this.Rows.length;
        for (var i = 0; i < len; i++) {
            obj.Rows[i] = {
                Y: this.Rows[i].Y,
                H: this.Rows[i].H
            };
        }
        obj.CurRow = this.CurRow;
        obj.CurCol = this.CurCol;
        return obj;
    },
    CorrectFrom: function () {
        this.X += this.TransformX;
        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++) {
            this.Rows[i].Y += this.TransformY;
        }
    },
    CorrectTo: function () {
        this.X -= this.TransformX;
        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++) {
            this.Rows[i].Y -= this.TransformY;
        }
    },
    Get_X: function () {
        return this.X;
    },
    Get_Y: function () {
        var _Y = 0;
        if (this.Rows.length > 0) {
            _Y = this.Rows[0].Y;
        }
        return _Y;
    }
};
function CTableOutline(Table, PageNum, X, Y, W, H) {
    this.Table = Table;
    this.PageNum = PageNum;
    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;
}
function CTextMeasurer() {
    this.m_oManager = new CFontManager();
    this.m_oFont = null;
    this.m_oTextPr = null;
    this.m_oGrFonts = new CGrRFonts();
    this.m_oLastFont = new CFontSetup();
    this.LastFontOriginInfo = {
        Name: "",
        Replace: null
    };
    this.Init = function () {
        this.m_oManager.Initialize();
    };
    this.SetFont = function (font) {
        if (!font) {
            return;
        }
        this.m_oFont = font;
        var bItalic = true === font.Italic;
        var bBold = true === font.Bold;
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!bItalic && bBold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (bItalic && !bBold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (bItalic && bBold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpName != font.FontFamily.Name || _lastSetUp.SetUpSize != font.FontSize || _lastSetUp.SetUpStyle != oFontStyle) {
            _lastSetUp.SetUpName = font.FontFamily.Name;
            _lastSetUp.SetUpSize = font.FontSize;
            _lastSetUp.SetUpStyle = oFontStyle;
            g_fontApplication.LoadFont(_lastSetUp.SetUpName, window.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };
    this.SetTextPr = function (textPr, theme) {
        this.m_oTextPr = textPr;
        if (theme) {
            this.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, this.m_oTextPr.RFonts);
        } else {
            this.m_oGrFonts = this.m_oTextPr.RFonts;
        }
    };
    this.SetFontSlot = function (slot, fontSizeKoef) {
        var _rfonts = this.m_oGrFonts;
        var _lastFont = this.m_oLastFont;
        switch (slot) {
        case fontslot_ASCII:
            _lastFont.Name = _rfonts.Ascii.Name;
            _lastFont.Index = _rfonts.Ascii.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_CS:
            _lastFont.Name = _rfonts.CS.Name;
            _lastFont.Index = _rfonts.CS.Index;
            _lastFont.Size = this.m_oTextPr.FontSizeCS;
            _lastFont.Bold = this.m_oTextPr.BoldCS;
            _lastFont.Italic = this.m_oTextPr.ItalicCS;
            break;
        case fontslot_EastAsia:
            _lastFont.Name = _rfonts.EastAsia.Name;
            _lastFont.Index = _rfonts.EastAsia.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_HAnsi:
            default:
            _lastFont.Name = _rfonts.HAnsi.Name;
            _lastFont.Index = _rfonts.HAnsi.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        }
        if (undefined !== fontSizeKoef) {
            _lastFont.Size *= fontSizeKoef;
        }
        var _style = 0;
        if (_lastFont.Italic) {
            _style += 2;
        }
        if (_lastFont.Bold) {
            _style += 1;
        }
        if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle) {
            _lastFont.SetUpName = _lastFont.Name;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;
            g_fontApplication.LoadFont(_lastFont.SetUpName, window.g_font_loader, this.m_oManager, _lastFont.SetUpSize, _lastFont.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };
    this.GetTextPr = function () {
        return this.m_oTextPr;
    };
    this.GetFont = function () {
        return this.m_oFont;
    };
    this.Measure = function (text) {
        var Width = 0;
        var Height = 0;
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace) {
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(_code);
        Width = Temp.fAdvanceX * 25.4 / 72;
        Height = 0;
        return {
            Width: Width,
            Height: Height
        };
    };
    this.Measure2 = function (text) {
        var Width = 0;
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace) {
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(_code, true);
        Width = Temp.fAdvanceX * 25.4 / 72;
        if (Temp.oBBox.rasterDistances == null) {
            return {
                Width: Width,
                Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
                Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                rasterOffsetX: 0,
                rasterOffsetY: 0
            };
        }
        return {
            Width: Width,
            Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
            Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
            rasterOffsetX: Temp.oBBox.rasterDistances.dist_l * 25.4 / 72,
            rasterOffsetY: Temp.oBBox.rasterDistances.dist_t * 25.4 / 72
        };
    };
    this.MeasureCode = function (lUnicode) {
        var Width = 0;
        var Height = 0;
        if (null != this.LastFontOriginInfo.Replace) {
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(lUnicode);
        Width = Temp.fAdvanceX * 25.4 / 72;
        Height = ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72);
        return {
            Width: Width,
            Height: Height,
            Ascent: (Temp.oBBox.fMaxY * 25.4 / 72)
        };
    };
    this.Measure2Code = function (lUnicode) {
        var Width = 0;
        if (null != this.LastFontOriginInfo.Replace) {
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(lUnicode, true);
        Width = Temp.fAdvanceX * 25.4 / 72;
        if (Temp.oBBox.rasterDistances == null) {
            return {
                Width: Width,
                Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
                Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                rasterOffsetX: 0,
                rasterOffsetY: 0
            };
        }
        return {
            Width: Width,
            Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
            Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
            rasterOffsetX: (Temp.oBBox.rasterDistances.dist_l + Temp.oBBox.fMinX) * 25.4 / 72,
            rasterOffsetY: Temp.oBBox.rasterDistances.dist_t * 25.4 / 72
        };
    };
    this.GetAscender = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Ascender = this.m_oManager.m_lAscender;
        return Ascender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetDescender = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Descender = this.m_oManager.m_lDescender;
        return Descender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetHeight = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Height = this.m_oManager.m_lLineHeight;
        return Height * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
}
var g_oTextMeasurer = new CTextMeasurer();
g_oTextMeasurer.Init();
function CTableOutlineDr() {
    var image_64 = "u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u//6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6/4+Pj/+7u7v/9vb2//b29v/39/f/9/f3//f39/83aMT/9/f3//f39//39/f/9/f3//f39/+Pj4//u7u7//Ly8v/y8vL/8vLy//Pz8/83aMT/N2jE/zdoxP/z8/P/8/Pz//Pz8//z8/P/j4+P/7u7u//u7u7/7u7u/+7u7v/u7u7/7u7u/zdoxP/u7u7/7u7u/+7u7v/u7u7/7u7u/4+Pj/+7u7v/6Ojo/+jo6P83aMT/6enp/+np6f83aMT/6enp/+np6f83aMT/6enp/+np6f+Pj4//u7u7/+Pj4/83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP/k5OT/j4+P/7u7u//o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/4+Pj/+7u7v/7e3t/+3t7f/t7e3/7e3t/+3t7f83aMT/7e3t/+zs7P/s7Oz/7Ozs/+zs7P+Pj4//u7u7//Ly8v/y8vL/8vLy//Ly8v83aMT/N2jE/zdoxP/x8fH/8fHx//Hx8f/x8fH/j4+P/7u7u//19fX/9fX1//X19f/19fX/9fX1/zdoxP/19fX/9fX1//X19f/19fX/9fX1/4+Pj/+7u7v/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//j4+P+Pj4//u7u7/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/w==";
    this.image = document.createElement("canvas");
    this.image.width = 13;
    this.image.height = 13;
    var ctx = this.image.getContext("2d");
    var _data = ctx.createImageData(13, 13);
    DecodeBase64(_data, image_64);
    ctx.putImageData(_data, 0, 0);
    _data = null;
    image_64 = null;
    this.TableOutline = null;
    this.Counter = 0;
    this.bIsNoTable = true;
    this.bIsTracked = false;
    this.CurPos = null;
    this.TrackTablePos = 0;
    this.TrackOffsetX = 0;
    this.TrackOffsetY = 0;
    this.InlinePos = null;
    this.IsChangeSmall = true;
    this.ChangeSmallPoint = null;
    this.checkMouseDown = function (pos, word_control) {
        if (null == this.TableOutline) {
            return false;
        }
        var _table_track = this.TableOutline;
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        this.IsChangeSmall = true;
        this.ChangeSmallPoint = pos;
        switch (this.TrackTablePos) {
        case 1:
            var _x = _table_track.X + _table_track.W;
            var _b = _table_track.Y;
            var _y = _b - _d;
            var _r = _x + _d;
            if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                this.TrackOffsetX = pos.X - _x;
                this.TrackOffsetY = pos.Y - _b;
                return true;
            }
            return false;
        case 2:
            var _x = _table_track.X + _table_track.W;
            var _y = _table_track.Y + _table_track.H;
            var _r = _x + _d;
            var _b = _y + _d;
            if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                this.TrackOffsetX = pos.X - _x;
                this.TrackOffsetY = pos.Y - _y;
                return true;
            }
            return false;
        case 3:
            var _r = _table_track.X;
            var _x = _r - _d;
            var _y = _table_track.Y + _table_track.H;
            var _b = _y + _d;
            if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                this.TrackOffsetX = pos.X - _r;
                this.TrackOffsetY = pos.Y - _y;
                return true;
            }
            return false;
        case 0:
            default:
            var _r = _table_track.X;
            var _b = _table_track.Y;
            var _x = _r - _d;
            var _y = _b - _d;
            if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                this.TrackOffsetX = pos.X - _r;
                this.TrackOffsetY = pos.Y - _b;
                return true;
            }
            return false;
        }
        return false;
    };
    this.checkMouseUp = function (X, Y, word_control) {
        this.bIsTracked = false;
        if (null == this.TableOutline || (true === this.IsChangeSmall) || word_control.m_oApi.isViewMode) {
            return false;
        }
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        var _outline = this.TableOutline;
        var _table = _outline.Table;
        if (!_table.Is_Inline()) {
            word_control.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Presentation_TableMoveFromRulers);
            switch (this.TrackTablePos) {
            case 1:
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
                _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page);
                _outline.X = pos.X - this.TrackOffsetX;
                _outline.Y = pos.Y - this.TrackOffsetY;
                _outline.PageNum = pos.Page;
                break;
            case 2:
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
                _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page);
                _outline.X = pos.X - this.TrackOffsetX;
                _outline.Y = pos.Y - this.TrackOffsetY;
                _outline.PageNum = pos.Page;
                break;
            case 3:
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
                _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page);
                _outline.X = pos.X - this.TrackOffsetX;
                _outline.Y = pos.Y - this.TrackOffsetY;
                _outline.PageNum = pos.Page;
                break;
            case 0:
                default:
                var pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
                _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page);
                _outline.X = pos.X - this.TrackOffsetX;
                _outline.Y = pos.Y - this.TrackOffsetY;
                _outline.PageNum = pos.Page;
                break;
            }
        } else {
            if (null != this.InlinePos) {
                word_control.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Presentation_TableMoveFromRulersInline);
                _table.Move(this.InlinePos.X, this.InlinePos.Y, this.InlinePos.Page);
            }
        }
        _table.Cursor_MoveToStartPos();
        _table.Document_SetThisElementCurrent();
    };
    this.checkMouseMove = function (X, Y, word_control) {
        if (null == this.TableOutline) {
            return false;
        }
        if (true === this.IsChangeSmall) {
            var _pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
            var _dist = 15 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
            if ((Math.abs(_pos.X - this.ChangeSmallPoint.X) < _dist) && (Math.abs(_pos.Y - this.ChangeSmallPoint.Y) < _dist) && (_pos.Page == this.ChangeSmallPoint.Page)) {
                this.CurPos = {
                    X: this.ChangeSmallPoint.X,
                    Y: this.ChangeSmallPoint.Y,
                    Page: this.ChangeSmallPoint.Page
                };
                switch (this.TrackTablePos) {
                case 1:
                    this.CurPos.X -= this.TableOutline.W;
                    break;
                case 2:
                    this.CurPos.X -= this.TableOutline.W;
                    this.CurPos.Y -= this.TableOutline.H;
                    break;
                case 3:
                    this.CurPos.Y -= this.TableOutline.H;
                    break;
                case 0:
                    default:
                    break;
                }
                this.CurPos.X -= this.TrackOffsetX;
                this.CurPos.Y -= this.TrackOffsetY;
                return;
            }
            this.IsChangeSmall = false;
            this.TableOutline.Table.Selection_Remove();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        switch (this.TrackTablePos) {
        case 1:
            var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
            break;
        case 2:
            var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
            break;
        case 3:
            var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
            break;
        case 0:
            default:
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
            break;
        }
        this.CurPos.X -= this.TrackOffsetX;
        this.CurPos.Y -= this.TrackOffsetY;
    };
    this.CheckStartTrack = function (word_control) {
        var pos = word_control.m_oDrawingDocument.ConvertCoordsToCursor(this.TableOutline.X, this.TableOutline.Y, this.TableOutline.PageNum, true);
        var _x0 = word_control.m_oEditor.AbsolutePosition.L;
        var _y0 = word_control.m_oEditor.AbsolutePosition.T;
        if (pos.X < _x0 && pos.Y < _y0) {
            this.TrackTablePos = 2;
        } else {
            if (pos.X < _x0) {
                this.TrackTablePos = 1;
            } else {
                if (pos.Y < _y0) {
                    this.TrackTablePos = 3;
                } else {
                    this.TrackTablePos = 0;
                }
            }
        }
    };
}
function CCacheImage() {
    this.image = null;
    this.image_locked = 0;
    this.image_unusedCount = 0;
}
function CCacheManager() {
    this.arrayImages = [];
    this.arrayCount = 0;
    this.countValidImage = 1;
    this.CheckImagesForNeed = function () {
        for (var i = 0; i < this.arrayCount; ++i) {
            if ((this.arrayImages[i].image_locked == 0) && (this.arrayImages[i].image_unusedCount >= this.countValidImage)) {
                delete this.arrayImages[i].image;
                this.arrayImages.splice(i, 1);
                --i;
                --this.arrayCount;
            }
        }
    };
    this.UnLock = function (_cache_image) {
        if (null == _cache_image) {
            return;
        }
        _cache_image.image_locked = 0;
        _cache_image.image_unusedCount = 0;
    };
    this.Lock = function (_w, _h) {
        for (var i = 0; i < this.arrayCount; ++i) {
            if (this.arrayImages[i].image_locked) {
                continue;
            }
            var _wI = this.arrayImages[i].image.width;
            var _hI = this.arrayImages[i].image.height;
            if ((_wI == _w) && (_hI == _h)) {
                this.arrayImages[i].image_locked = 1;
                this.arrayImages[i].image_unusedCount = 0;
                this.arrayImages[i].image.ctx.globalAlpha = 1;
                this.arrayImages[i].image.ctx.fillStyle = "#B0B0B0";
                this.arrayImages[i].image.ctx.fillRect(0, 0, _w, _h);
                return this.arrayImages[i];
            }
            this.arrayImages[i].image_unusedCount++;
        }
        this.CheckImagesForNeed();
        var index = this.arrayCount;
        this.arrayCount++;
        this.arrayImages[index] = new CCacheImage();
        this.arrayImages[index].image = document.createElement("canvas");
        this.arrayImages[index].image.width = _w;
        this.arrayImages[index].image.height = _h;
        this.arrayImages[index].image.ctx = this.arrayImages[index].image.getContext("2d");
        this.arrayImages[index].image.ctx.globalAlpha = 1;
        this.arrayImages[index].image.ctx.fillStyle = "#B0B0B0";
        this.arrayImages[index].image.ctx.fillRect(0, 0, _w, _h);
        this.arrayImages[index].image_locked = 1;
        this.arrayImages[index].image_unusedCount = 0;
        return this.arrayImages[index];
    };
    this.Clear = function () {
        for (var i = 0; i < this.arrayCount; ++i) {
            delete this.arrayImages[i].image;
            this.arrayImages.splice(i, 1);
            --i;
            --this.arrayCount;
        }
    };
}
function _rect() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
}
function CDrawingPage() {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.cachedImage = null;
}
function CDrawingDocument() {
    this.IsLockObjectsEnable = false;
    this.m_oWordControl = null;
    this.m_oLogicDocument = null;
    this.SlidesCount = 0;
    this.IsEmptyPresentation = false;
    this.SlideCurrent = -1;
    this.SlideCurrectRect = new CDrawingPage();
    this.m_oCacheManager = new CCacheManager();
    this.m_lTimerTargetId = -1;
    this.m_dTargetX = -1;
    this.m_dTargetY = -1;
    this.m_dTargetSize = 1;
    this.TargetHtmlElement = null;
    this.TargetHtmlElementLeft = 0;
    this.TargetHtmlElementTop = 0;
    this.m_bIsSelection = false;
    this.m_bIsSearching = false;
    this.CurrentSearchNavi = null;
    this.m_lTimerUpdateTargetID = -1;
    this.m_tempX = 0;
    this.m_tempY = 0;
    this.m_tempPageIndex = 0;
    var oThis = this;
    this.m_sLockedCursorType = "";
    this.TableOutlineDr = new CTableOutlineDr();
    this.HorVerAnchors = [];
    this.m_lCurrentRendererPage = -1;
    this.m_oDocRenderer = null;
    this.m_bOldShowMarks = false;
    this.UpdateTargetFromPaint = false;
    this.NeedTarget = true;
    this.TextMatrix = null;
    this.TargetShowFlag = false;
    this.TargetShowNeedFlag = false;
    this.CanvasHit = document.createElement("canvas");
    this.CanvasHit.width = 10;
    this.CanvasHit.height = 10;
    this.CanvasHitContext = this.CanvasHit.getContext("2d");
    this.TargetCursorColor = {
        R: 0,
        G: 0,
        B: 0
    };
    this.TableStylesLastLook = null;
    this.GuiControlColorsMap = null;
    this.IsSendStandartColors = false;
    this.GuiCanvasFillTextureParentId = "";
    this.GuiCanvasFillTexture = null;
    this.GuiCanvasFillTextureCtx = null;
    this.LastDrawingUrl = "";
    this.GuiCanvasFillTextureParentIdSlide = "";
    this.GuiCanvasFillTextureSlide = null;
    this.GuiCanvasFillTextureCtxSlide = null;
    this.LastDrawingUrlSlide = "";
    this.AutoShapesTrack = null;
    this.TransitionSlide = new CTransitionAnimation(null);
    this.GetTargetStyle = function () {
        return "rgb(" + this.TargetCursorColor.R + "," + this.TargetCursorColor.G + "," + this.TargetCursorColor.B + ")";
    };
    this.Start_CollaborationEditing = function () {
        this.IsLockObjectsEnable = true;
        this.m_oWordControl.OnRePaintAttack();
    };
    this.IsMobileVersion = function () {
        if (this.m_oWordControl.MobileTouchManager) {
            return true;
        }
        return false;
    };
    this.ConvertCoordsToAnotherPage = function (x, y) {
        return {
            X: x,
            Y: y
        };
    };
    this.SetCursorType = function (sType, Data) {
        if ("" == this.m_sLockedCursorType) {
            if (this.m_oWordControl.m_oApi.isPaintFormat && (("default" == sType) || ("text" == sType))) {
                this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = kCurFormatPainterWord;
            } else {
                this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = sType;
            }
        } else {
            this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;
        }
        if ("undefined" === typeof(Data) || null === Data) {
            Data = new CMouseMoveData();
        }
        editor.sync_MouseMoveCallback(Data);
    };
    this.LockCursorType = function (sType) {
        this.m_sLockedCursorType = sType;
        this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;
    };
    this.LockCursorTypeCur = function () {
        this.m_sLockedCursorType = this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor;
    };
    this.UnlockCursorType = function () {
        this.m_sLockedCursorType = "";
    };
    this.OnStartRecalculate = function (pageCount) {};
    this.SetTargetColor = function (r, g, b) {
        this.TargetCursorColor.R = r;
        this.TargetCursorColor.G = g;
        this.TargetCursorColor.B = b;
    };
    this.StartTrackTable = function () {};
    this.OnRecalculatePage = function (index, pageObject) {
        editor.asc_fireCallback("asc_onDocumentChanged");
        if (true === this.m_bIsSearching) {
            this.SearchClear();
            this.m_oWordControl.OnUpdateOverlay();
            this.SendChangeDocumentToApi(true);
        }
        var thpages = this.m_oWordControl.Thumbnails.m_arrPages;
        if (thpages.length > index) {
            thpages[index].IsRecalc = true;
        }
        if (index == this.SlideCurrent) {
            this.m_oWordControl.Thumbnails.LockMainObjType = true;
            this.m_oWordControl.SlideDrawer.CheckSlide(this.SlideCurrent);
            this.m_oWordControl.CalculateDocumentSize(false);
            this.m_oWordControl.OnScroll();
            this.m_oWordControl.Thumbnails.LockMainObjType = false;
        }
    };
    this.OnEndRecalculate = function () {
        this.m_oWordControl.Thumbnails.LockMainObjType = true;
        this.SlidesCount = this.m_oLogicDocument.Slides.length;
        this.m_oWordControl.CalculateDocumentSize();
        this.m_oWordControl.m_oApi.sync_countPagesCallback(this.SlidesCount);
        this.m_oWordControl.Thumbnails.LockMainObjType = false;
    };
    this.ChangePageAttack = function (pageIndex) {
        if (pageIndex != this.SlideCurrent) {
            return;
        }
        this.StopRenderingPage(pageIndex);
        this.m_oWordControl.OnScroll();
    };
    this.RenderDocument = function (Renderer) {
        for (var i = 0; i < this.SlidesCount; i++) {
            Renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();
        }
    };
    this.ToRenderer = function () {
        var Renderer = new CDocumentRenderer();
        Renderer.IsNoDrawingEmptyPlaceholder = true;
        Renderer.VectorMemoryForPrint = new CMemory();
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        this.RenderDocument(Renderer);
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        var ret = Renderer.Memory.GetBase64Memory();
        return ret;
    };
    this.ToRenderer2 = function () {
        var Renderer = new CDocumentRenderer();
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        var ret = "";
        for (var i = 0; i < this.SlidesCount; i++) {
            Renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();
            ret += Renderer.Memory.GetBase64Memory();
            Renderer.Memory.Seek(0);
        }
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        return ret;
    };
    this.isComleteRenderer = function () {
        if (this.m_lCurrentRendererPage >= this.SlidesCount) {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
            return true;
        }
        return false;
    };
    this.isComleteRenderer2 = function () {
        var start = Math.max(this.m_lCurrentRendererPage, 0);
        var end = Math.min(start + 50, this.SlidesCount - 1);
        if ((end + 1) >= this.SlidesCount) {
            return true;
        }
        return false;
    };
    this.ToRendererPart = function () {
        var pagescount = this.SlidesCount;
        if (-1 == this.m_lCurrentRendererPage) {
            this.m_oDocRenderer = new CDocumentRenderer();
            this.m_oDocRenderer.VectorMemoryForPrint = new CMemory();
            this.m_lCurrentRendererPage = 0;
            this.m_bOldShowMarks = this.m_oWordControl.m_oApi.ShowParaMarks;
            this.m_oWordControl.m_oApi.ShowParaMarks = false;
            this.m_oDocRenderer.IsNoDrawingEmptyPlaceholder = true;
        }
        var start = this.m_lCurrentRendererPage;
        var end = Math.min(this.m_lCurrentRendererPage + 50, pagescount - 1);
        var renderer = this.m_oDocRenderer;
        renderer.Memory.Seek(0);
        renderer.VectorMemoryForPrint.ClearNoAttack();
        for (var i = start; i <= end; i++) {
            renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
            this.m_oLogicDocument.DrawPage(i, renderer);
            renderer.EndPage();
        }
        if (end == -1) {
            renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
            renderer.EndPage();
        }
        this.m_lCurrentRendererPage = end + 1;
        if (this.m_lCurrentRendererPage >= pagescount) {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
        }
        return renderer.Memory.GetBase64Memory();
    };
    this.SendChangeDocumentToApi = function (bIsAttack) {
        if (bIsAttack || !this.m_bIsSendApiDocChanged) {
            this.m_bIsSendApiDocChanged = true;
            this.m_oWordControl.m_oApi.isDocumentModify = true;
            this.m_oWordControl.m_oApi.asc_fireCallback("asc_onDocumentChanged");
            this.m_oWordControl.m_oApi.asc_fireCallback("asc_onDocumentModifiedChanged");
        }
    };
    this.InitGuiCanvasTextProps = function (div_id) {
        var _div_elem = document.getElementById(div_id);
        if (null != this.GuiCanvasTextProps) {
            var elem = _div_elem.getElementsByTagName("canvas");
            if (elem.length == 0) {
                _div_elem.appendChild(this.GuiCanvasTextProps);
            } else {
                var _width = parseInt(_div_elem.offsetWidth);
                var _height = parseInt(_div_elem.offsetHeight);
                if (0 == _width) {
                    _width = 300;
                }
                if (0 == _height) {
                    _height = 80;
                }
                if (this.GuiCanvasTextProps.width != _width || this.GuiCanvasTextProps.height != _height) {
                    this.GuiCanvasTextProps.width = _width;
                    this.GuiCanvasTextProps.height = _height;
                }
            }
        } else {
            this.GuiCanvasTextProps = document.createElement("canvas");
            this.GuiCanvasTextProps.style = "position:absolute;left:0;top:0;";
            this.GuiCanvasTextProps.id = this.GuiCanvasTextPropsId;
            var _width = parseInt(_div_elem.offsetWidth);
            var _height = parseInt(_div_elem.offsetHeight);
            if (0 == _width) {
                _width = 300;
            }
            if (0 == _height) {
                _height = 80;
            }
            this.GuiCanvasTextProps.width = _width;
            this.GuiCanvasTextProps.height = _height;
            _div_elem.appendChild(this.GuiCanvasTextProps);
        }
    };
    this.DrawGuiCanvasTextProps = function (props) {
        var bIsChange = false;
        if (null == this.GuiLastTextProps) {
            bIsChange = true;
            this.GuiLastTextProps = new CParagraphProp();
            this.GuiLastTextProps.Subscript = props.Subscript;
            this.GuiLastTextProps.Superscript = props.Superscript;
            this.GuiLastTextProps.SmallCaps = props.SmallCaps;
            this.GuiLastTextProps.AllCaps = props.AllCaps;
            this.GuiLastTextProps.Strikeout = props.Strikeout;
            this.GuiLastTextProps.DStrikeout = props.DStrikeout;
            this.GuiLastTextProps.TextSpacing = props.TextSpacing;
            this.GuiLastTextProps.Position = props.Position;
        } else {
            if (this.GuiLastTextProps.Subscript != props.Subscript) {
                this.GuiLastTextProps.Subscript = props.Subscript;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Superscript != props.Superscript) {
                this.GuiLastTextProps.Superscript = props.Superscript;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.SmallCaps != props.SmallCaps) {
                this.GuiLastTextProps.SmallCaps = props.SmallCaps;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.AllCaps != props.AllCaps) {
                this.GuiLastTextProps.AllCaps = props.AllCaps;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Strikeout != props.Strikeout) {
                this.GuiLastTextProps.Strikeout = props.Strikeout;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.DStrikeout != props.DStrikeout) {
                this.GuiLastTextProps.DStrikeout = props.DStrikeout;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.TextSpacing != props.TextSpacing) {
                this.GuiLastTextProps.TextSpacing = props.TextSpacing;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Position != props.Position) {
                this.GuiLastTextProps.Position = props.Position;
                bIsChange = true;
            }
        }
        if (undefined !== this.GuiLastTextProps.Position && isNaN(this.GuiLastTextProps.Position)) {
            this.GuiLastTextProps.Position = undefined;
        }
        if (undefined !== this.GuiLastTextProps.TextSpacing && isNaN(this.GuiLastTextProps.TextSpacing)) {
            this.GuiLastTextProps.TextSpacing = undefined;
        }
        if (!bIsChange) {
            return;
        }
        History.TurnOff();
        var _oldTurn = editor.isViewMode;
        editor.isViewMode = true;
        var docContent = new CDocumentContent(this.m_oWordControl.m_oLogicDocument, this.m_oWordControl.m_oDrawingDocument, 0, 0, 1000, 1000, false, false, true);
        var par = docContent.Content[0];
        par.Cursor_MoveToStartPos();
        par.Set_Pr(new CParaPr());
        var _textPr = new CTextPr();
        _textPr.FontFamily = {
            Name: "Arial",
            Index: -1
        };
        _textPr.Strikeout = this.GuiLastTextProps.Strikeout;
        if (true === this.GuiLastTextProps.Subscript) {
            _textPr.VertAlign = vertalign_SubScript;
        } else {
            if (true === this.GuiLastTextProps.Superscript) {
                _textPr.VertAlign = vertalign_SuperScript;
            } else {
                _textPr.VertAlign = vertalign_Baseline;
            }
        }
        _textPr.DStrikeout = this.GuiLastTextProps.DStrikeout;
        _textPr.Caps = this.GuiLastTextProps.AllCaps;
        _textPr.SmallCaps = this.GuiLastTextProps.SmallCaps;
        _textPr.Spacing = this.GuiLastTextProps.TextSpacing;
        _textPr.Position = this.GuiLastTextProps.Position;
        var parRun = new ParaRun(par);
        var Pos = 0;
        parRun.Set_Pr(_textPr);
        parRun.Add_ToContent(Pos++, new ParaText("H"), false);
        parRun.Add_ToContent(Pos++, new ParaText("e"), false);
        parRun.Add_ToContent(Pos++, new ParaText("l"), false);
        parRun.Add_ToContent(Pos++, new ParaText("l"), false);
        parRun.Add_ToContent(Pos++, new ParaText("o"), false);
        parRun.Add_ToContent(Pos++, new ParaSpace(1), false);
        parRun.Add_ToContent(Pos++, new ParaText("W"), false);
        parRun.Add_ToContent(Pos++, new ParaText("o"), false);
        parRun.Add_ToContent(Pos++, new ParaText("r"), false);
        parRun.Add_ToContent(Pos++, new ParaText("l"), false);
        parRun.Add_ToContent(Pos++, new ParaText("d"), false);
        par.Add_ToContent(0, parRun);
        docContent.Recalculate_Page(0, true);
        var baseLineOffset = par.Lines[0].Y;
        var _bounds = par.Get_PageBounds(0);
        var ctx = this.GuiCanvasTextProps.getContext("2d");
        var _wPx = this.GuiCanvasTextProps.width;
        var _hPx = this.GuiCanvasTextProps.height;
        var _wMm = _wPx * g_dKoef_pix_to_mm;
        var _hMm = _hPx * g_dKoef_pix_to_mm;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _wPx, _hPx);
        var _pxBoundsW = par.Lines[0].Ranges[0].W * g_dKoef_mm_to_pix;
        var _pxBoundsH = (_bounds.Bottom - _bounds.Top) * g_dKoef_mm_to_pix;
        if (this.GuiLastTextProps.Position !== undefined && this.GuiLastTextProps.Position != null && this.GuiLastTextProps.Position != 0) {}
        if (_pxBoundsH < _hPx && _pxBoundsW < _wPx) {
            var _lineY = (((_hPx + _pxBoundsH) / 2) >> 0) + 0.5;
            var _lineW = (((_wPx - _pxBoundsW) / 4) >> 0);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, _lineY);
            ctx.lineTo(_lineW, _lineY);
            ctx.moveTo(_wPx - _lineW, _lineY);
            ctx.lineTo(_wPx, _lineY);
            ctx.stroke();
            ctx.beginPath();
        }
        var _yOffset = (((_hPx + _pxBoundsH) / 2) - baseLineOffset * g_dKoef_mm_to_pix) >> 0;
        var _xOffset = ((_wPx - _pxBoundsW) / 2) >> 0;
        var graphics = new CGraphics();
        graphics.init(ctx, _wPx, _hPx, _wMm, _hMm);
        graphics.m_oFontManager = g_fontManager;
        graphics.m_oCoordTransform.tx = _xOffset;
        graphics.m_oCoordTransform.ty = _yOffset;
        graphics.transform(1, 0, 0, 1, 0, 0);
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        par.Draw(0, graphics);
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        History.TurnOn();
        editor.isViewMode = _oldTurn;
    };
    this.DrawSearch = function (overlay) {
        var xDst = this.SlideCurrectRect.left;
        var yDst = this.SlideCurrectRect.top;
        var wDst = this.SlideCurrectRect.right - this.SlideCurrectRect.left;
        var hDst = this.SlideCurrectRect.bottom - this.SlideCurrectRect.top;
        var dKoefX = wDst / this.m_oLogicDocument.Width;
        var dKoefY = hDst / this.m_oLogicDocument.Height;
        var ctx = overlay.m_oContext;
        var searchingArray = this.m_oLogicDocument.Slides[this.SlideCurrent].searchingArray;
        for (var i = 0; i < searchingArray.length; i++) {
            var place = searchingArray[i];
            if (undefined === place.Ex) {
                var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
                var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;
                var _w = ((dKoefX * place.W) >> 0) + 1;
                var _h = ((dKoefY * place.H) >> 0) + 1;
                if (_x < overlay.min_x) {
                    overlay.min_x = _x;
                }
                if ((_x + _w) > overlay.max_x) {
                    overlay.max_x = _x + _w;
                }
                if (_y < overlay.min_y) {
                    overlay.min_y = _y;
                }
                if ((_y + _h) > overlay.max_y) {
                    overlay.max_y = _y + _h;
                }
                ctx.rect(_x, _y, _w, _h);
            } else {
                var _x1 = (xDst + dKoefX * place.X) >> 0;
                var _y1 = (yDst + dKoefY * place.Y) >> 0;
                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var _x2 = (xDst + dKoefX * x2) >> 0;
                var _y2 = (yDst + dKoefY * y2) >> 0;
                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var _x3 = (xDst + dKoefX * x3) >> 0;
                var _y3 = (yDst + dKoefY * y3) >> 0;
                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x4 = (xDst + dKoefX * x4) >> 0;
                var _y4 = (yDst + dKoefY * y4) >> 0;
                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }
    };
    this.DrawSearchCur = function (overlay, place) {
        var xDst = this.SlideCurrectRect.left;
        var yDst = this.SlideCurrectRect.top;
        var wDst = this.SlideCurrectRect.right - this.SlideCurrectRect.left;
        var hDst = this.SlideCurrectRect.bottom - this.SlideCurrectRect.top;
        var dKoefX = wDst / this.m_oLogicDocument.Width;
        var dKoefY = hDst / this.m_oLogicDocument.Height;
        var ctx = overlay.m_oContext;
        if (undefined === place.Ex) {
            var _x = ((xDst + dKoefX * place.X) >> 0) - 0.5;
            var _y = ((yDst + dKoefY * place.Y) >> 0) - 0.5;
            var _w = ((dKoefX * place.W) >> 0) + 1;
            var _h = ((dKoefY * place.H) >> 0) + 1;
            if (_x < overlay.min_x) {
                overlay.min_x = _x;
            }
            if ((_x + _w) > overlay.max_x) {
                overlay.max_x = _x + _w;
            }
            if (_y < overlay.min_y) {
                overlay.min_y = _y;
            }
            if ((_y + _h) > overlay.max_y) {
                overlay.max_y = _y + _h;
            }
            ctx.rect(_x, _y, _w, _h);
        } else {
            var _x1 = (xDst + dKoefX * place.X) >> 0;
            var _y1 = (yDst + dKoefY * place.Y) >> 0;
            var x2 = place.X + place.W * place.Ex;
            var y2 = place.Y + place.W * place.Ey;
            var _x2 = (xDst + dKoefX * x2) >> 0;
            var _y2 = (yDst + dKoefY * y2) >> 0;
            var x3 = x2 - place.H * place.Ey;
            var y3 = y2 + place.H * place.Ex;
            var _x3 = (xDst + dKoefX * x3) >> 0;
            var _y3 = (yDst + dKoefY * y3) >> 0;
            var x4 = place.X - place.H * place.Ey;
            var y4 = place.Y + place.H * place.Ex;
            var _x4 = (xDst + dKoefX * x4) >> 0;
            var _y4 = (yDst + dKoefY * y4) >> 0;
            overlay.CheckPoint(_x1, _y1);
            overlay.CheckPoint(_x2, _y2);
            overlay.CheckPoint(_x3, _y3);
            overlay.CheckPoint(_x4, _y4);
            ctx.moveTo(_x1, _y1);
            ctx.lineTo(_x2, _y2);
            ctx.lineTo(_x3, _y3);
            ctx.lineTo(_x4, _y4);
            ctx.lineTo(_x1, _y1);
        }
    };
    this.StopRenderingPage = function (pageIndex) {
        return;
    };
    this.ClearCachePages = function () {
        if (this.m_oWordControl.bInit_word_control && 0 <= this.SlideCurrent) {
            this.m_oWordControl.SlideDrawer.CheckSlide(this.SlideCurrent);
        }
    };
    this.FirePaint = function () {
        this.m_oWordControl.Thumbnails.LockMainObjType = true;
        this.m_oWordControl.SlideDrawer.CheckSlide(this.SlideCurrent);
        this.m_oWordControl.CalculateDocumentSize(false);
        this.m_oWordControl.OnScroll();
        this.m_oWordControl.Thumbnails.LockMainObjType = false;
    };
    this.StartTrackAutoshape = function () {
        this.m_oWordControl.ShowOverlay();
    };
    this.EndTrackAutoShape = function () {
        this.m_oWordControl.OnUpdateOverlay();
    };
    this.ConvertCoordsFromCursor2 = function (x, y) {
        var _word_control = this.m_oWordControl;
        var _x = x - _word_control.X - (_word_control.m_oMainContent.AbsolutePosition.L + _word_control.m_oMainView.AbsolutePosition.L) * g_dKoef_mm_to_pix;
        var _y = y - _word_control.Y - (_word_control.m_oMainContent.AbsolutePosition.T + _word_control.m_oMainView.AbsolutePosition.T) * g_dKoef_mm_to_pix;
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        var Pos = {
            X: 0,
            Y: 0,
            Page: this.SlideCurrent
        };
        if (this.SlideCurrent != -1) {
            var rect = this.SlideCurrectRect;
            var x_mm = (_x - rect.left) * dKoef;
            var y_mm = (_y - rect.top) * dKoef;
            Pos.X = x_mm;
            Pos.Y = y_mm;
        }
        return Pos;
    };
    this.IsCursorInTableCur = function (x, y, page) {
        var _table = this.TableOutlineDr.TableOutline;
        if (_table == null) {
            return false;
        }
        if (page != _table.PageNum) {
            return false;
        }
        var _dist = this.TableOutlineDr.image.width * g_dKoef_pix_to_mm;
        _dist *= (100 / this.m_oWordControl.m_nZoomValue);
        var _x = _table.X;
        var _y = _table.Y;
        var _r = _x + _table.W;
        var _b = _y + _table.H;
        if ((x > (_x - _dist)) && (x < _r) && (y > (_y - _dist)) && (y < _b)) {
            if ((x < _x) || (y < _y)) {
                return true;
            }
        }
        return false;
    };
    this.ConvertCoordsToCursorWR = function (x, y, pageIndex, transform) {
        var _word_control = this.m_oWordControl;
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var __x = x;
        var __y = y;
        if (transform) {
            __x = transform.TransformPointX(x, y);
            __y = transform.TransformPointY(x, y);
        }
        var x_pix = (this.SlideCurrectRect.left + __x * dKoef + _word_control.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0;
        var y_pix = (this.SlideCurrectRect.top + __y * dKoef + _word_control.m_oMainContent.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0;
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.ConvertCoordsToCursorWR_2 = function (x, y) {
        var _word_control = this.m_oWordControl;
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var x_pix = (this.SlideCurrectRect.left + x * dKoef + _word_control.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0;
        var y_pix = (this.SlideCurrectRect.top + y * dKoef + _word_control.m_oMainContent.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0;
        x_pix += _word_control.X;
        y_pix += _word_control.Y;
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.ConvertCoordsToCursorWR_Comment = function (x, y) {
        var _word_control = this.m_oWordControl;
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var x_pix = (this.SlideCurrectRect.left + x * dKoef + _word_control.m_oMainView.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0;
        var y_pix = (this.SlideCurrectRect.top + y * dKoef + _word_control.m_oMainView.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0;
        x_pix += COMMENT_WIDTH;
        y_pix += ((COMMENT_HEIGHT / 3) >> 0);
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.ConvertCoordsToCursor = function (x, y) {
        var _word_control = this.m_oWordControl;
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var x_pix = (this.SlideCurrectRect.left + x * dKoef) >> 0;
        var y_pix = (this.SlideCurrectRect.top + y * dKoef) >> 0;
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.TargetStart = function () {
        if (this.m_lTimerTargetId != -1) {
            clearInterval(this.m_lTimerTargetId);
        }
        this.m_lTimerTargetId = setInterval(oThis.DrawTarget, 500);
    };
    this.TargetEnd = function () {
        if (!this.TargetShowFlag) {
            return;
        }
        this.TargetShowFlag = false;
        this.TargetShowNeedFlag = false;
        clearInterval(this.m_lTimerTargetId);
        this.m_lTimerTargetId = -1;
        this.TargetHtmlElement.style.display = "none";
        this.m_oWordControl.DisableTextEATextboxAttack();
    };
    this.UpdateTargetNoAttack = function () {
        if (null == this.m_oWordControl) {
            return;
        }
        this.CheckTargetDraw(this.m_dTargetX, this.m_dTargetY);
    };
    this.CheckTargetDraw = function (x, y) {
        var _oldW = this.TargetHtmlElement.width;
        var _oldH = this.TargetHtmlElement.height;
        var _newW = 2;
        var _newH = (this.m_dTargetSize * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100) >> 0;
        if (null != this.TextMatrix && !global_MatrixTransformer.IsIdentity2(this.TextMatrix)) {
            var _x1 = this.TextMatrix.TransformPointX(x, y);
            var _y1 = this.TextMatrix.TransformPointY(x, y);
            var _x2 = this.TextMatrix.TransformPointX(x, y + this.m_dTargetSize);
            var _y2 = this.TextMatrix.TransformPointY(x, y + this.m_dTargetSize);
            var pos1 = this.ConvertCoordsToCursor(_x1, _y1);
            var pos2 = this.ConvertCoordsToCursor(_x2, _y2);
            _newW = (Math.abs(pos1.X - pos2.X) >> 0) + 1;
            _newH = (Math.abs(pos1.Y - pos2.Y) >> 0) + 1;
            if (2 > _newW) {
                _newW = 2;
            }
            if (2 > _newH) {
                _newH = 2;
            }
            if (_oldW == _newW && _oldH == _newH) {
                if (_newW != 2 && _newH != 2) {
                    this.TargetHtmlElement.width = _newW;
                }
            } else {
                this.TargetHtmlElement.style.width = _newW + "px";
                this.TargetHtmlElement.style.height = _newH + "px";
                this.TargetHtmlElement.width = _newW;
                this.TargetHtmlElement.height = _newH;
            }
            var ctx = this.TargetHtmlElement.getContext("2d");
            if (_newW == 2 || _newH == 2) {
                ctx.fillStyle = this.GetTargetStyle();
                ctx.fillRect(0, 0, _newW, _newH);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = this.GetTargetStyle();
                ctx.lineWidth = 2;
                if (((pos1.X - pos2.X) * (pos1.Y - pos2.Y)) >= 0) {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(_newW, _newH);
                } else {
                    ctx.moveTo(0, _newH);
                    ctx.lineTo(_newW, 0);
                }
                ctx.stroke();
            }
            this.TargetHtmlElementLeft = Math.min(pos1.X, pos2.X) >> 0;
            this.TargetHtmlElementTop = Math.min(pos1.Y, pos2.Y) >> 0;
            this.TargetHtmlElement.style.left = this.TargetHtmlElementLeft + "px";
            this.TargetHtmlElement.style.top = this.TargetHtmlElementTop + "px";
        } else {
            if (_oldW == _newW && _oldH == _newH) {
                this.TargetHtmlElement.width = _newW;
            } else {
                this.TargetHtmlElement.style.width = _newW + "px";
                this.TargetHtmlElement.style.height = _newH + "px";
                this.TargetHtmlElement.width = _newW;
                this.TargetHtmlElement.height = _newH;
            }
            var ctx = this.TargetHtmlElement.getContext("2d");
            ctx.fillStyle = this.GetTargetStyle();
            ctx.fillRect(0, 0, _newW, _newH);
            if (null != this.TextMatrix) {
                x += this.TextMatrix.tx;
                y += this.TextMatrix.ty;
            }
            var pos = this.ConvertCoordsToCursor(x, y);
            this.TargetHtmlElementLeft = pos.X >> 0;
            this.TargetHtmlElementTop = pos.Y >> 0;
            this.TargetHtmlElement.style.left = this.TargetHtmlElementLeft + "px";
            this.TargetHtmlElement.style.top = this.TargetHtmlElementTop + "px";
            this.m_oWordControl.CheckTextBoxInputPos();
        }
    };
    this.UpdateTarget = function (x, y, pageIndex) {
        if (pageIndex != this.SlideCurrent) {
            this.m_oWordControl.GoToPage(pageIndex);
        }
        if (this.UpdateTargetFromPaint === false) {
            this.UpdateTargetCheck = true;
            return;
        }
        var targetSize = Number(this.m_dTargetSize * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var pos = null;
        var __x = x;
        var __y = y;
        if (!this.TextMatrix) {
            pos = this.ConvertCoordsToCursor(x, y);
        } else {
            __x = this.TextMatrix.TransformPointX(x, y);
            __y = this.TextMatrix.TransformPointY(x, y);
            pos = this.ConvertCoordsToCursor(__x, __y);
        }
        var _ww = this.m_oWordControl.m_oEditor.HtmlElement.width;
        var _hh = this.m_oWordControl.m_oEditor.HtmlElement.height;
        if (this.m_oWordControl.bIsRetinaSupport) {
            _ww >>= 1;
            _hh >>= 1;
        }
        var boxX = 0;
        var boxY = 0;
        var boxR = _ww - 2;
        var boxB = _hh - targetSize;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = (this.m_oWordControl.m_dScrollX + pos.X - boxX) >> 0;
        }
        if (pos.X > boxR) {
            nValueScrollHor = (this.m_oWordControl.m_dScrollX + pos.X - boxR) >> 0;
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = (this.m_oWordControl.m_dScrollY + pos.Y - boxY) >> 0;
        }
        if (pos.Y > boxB) {
            nValueScrollVer = (this.m_oWordControl.m_dScrollY + pos.Y - boxB) >> 0;
        }
        this.m_dTargetX = x;
        this.m_dTargetY = y;
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
            if (nValueScrollHor > this.m_oWordControl.m_dScrollX_max) {
                nValueScrollHor = this.m_oWordControl.m_dScrollX_max;
            }
            if (0 > nValueScrollHor) {
                nValueScrollHor = 0;
            }
            this.m_oWordControl.m_oScrollHorApi.scrollToX(nValueScrollHor, false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
            if (nValueScrollVer > this.m_oWordControl.SlideScrollMAX) {
                nValueScrollVer = this.m_oWordControl.SlideScrollMAX - 1;
            }
            if (this.m_oWordControl.SlideScrollMIN > nValueScrollVer) {
                nValueScrollVer = this.m_oWordControl.SlideScrollMIN;
            }
            this.m_oWordControl.m_oScrollVerApi.scrollToY(nValueScrollVer, false);
        }
        if (true == isNeedScroll) {
            this.m_oWordControl.m_bIsUpdateTargetNoAttack = true;
            this.m_oWordControl.OnScroll();
            return;
        }
        this.CheckTargetDraw(x, y);
    };
    this.SetTargetSize = function (size) {
        this.m_dTargetSize = size;
    };
    this.DrawTarget = function () {
        if ("block" != oThis.TargetHtmlElement.style.display && oThis.NeedTarget && !oThis.TransitionSlide.IsPlaying()) {
            oThis.TargetHtmlElement.style.display = "block";
        } else {
            oThis.TargetHtmlElement.style.display = "none";
        }
    };
    this.TargetShow = function () {
        this.TargetShowNeedFlag = true;
    };
    this.CheckTargetShow = function () {
        if (this.TargetShowFlag && this.TargetShowNeedFlag) {
            this.TargetHtmlElement.style.display = "block";
            this.TargetShowNeedFlag = false;
            return;
        }
        if (!this.TargetShowNeedFlag) {
            return;
        }
        this.TargetShowNeedFlag = false;
        if (-1 == this.m_lTimerTargetId) {
            this.TargetStart();
        }
        if (oThis.NeedTarget) {
            this.TargetHtmlElement.style.display = "block";
        }
        this.TargetShowFlag = true;
    };
    this.SetCurrentPage = function (PageIndex) {
        if (PageIndex >= this.SlidesCount) {
            return;
        }
        if (this.SlideCurrent == PageIndex) {
            return;
        }
        this.SlideCurrent = PageIndex;
        this.m_oWordControl.SetCurrentPage();
    };
    this.SelectEnabled = function (bIsEnabled) {
        this.m_bIsSelection = bIsEnabled;
        if (false === this.m_bIsSelection) {
            this.SelectClear();
            this.m_oWordControl.CheckUnShowOverlay();
            this.m_oWordControl.OnUpdateOverlay();
            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 1;
        }
    };
    this.SelectClear = function () {
        this.m_oWordControl.OnUpdateOverlay();
    };
    this.SearchClear = function () {
        for (var i = 0; i < this.SlidesCount; i++) {
            this.Slide.searchingArray.splice(0, this.Slide.searchingArray.length);
        }
        this.m_oWordControl.m_oOverlayApi.Clear();
        this.m_bIsSearching = false;
        this.CurrentSearchNavi = null;
    };
    this.AddPageSearch = function (findText, rects) {
        var _len = rects.length;
        if (_len == 0) {
            return;
        }
        if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none") {
            this.m_oWordControl.ShowOverlay();
            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
        }
        var navigator = {
            Page: rects[0].PageNum,
            Place: rects.slice(0, _len)
        };
        var _find = {
            text: findText,
            navigator: navigator
        };
        this.m_oWordControl.m_oApi.sync_SearchFoundCallback(_find);
        var is_update = false;
        var _pages = this.m_oLogicDocument.Slides;
        for (var i = 0; i < _len; i++) {
            var r = rects[i];
            _pages[r.PageNum].searchingArray[_pages[r.PageNum].searchingArray.length] = r;
            if (r.PageNum >= this.m_lDrawingFirst && r.PageNum <= this.m_lDrawingEnd) {
                is_update = true;
            }
        }
        if (is_update) {
            this.m_oWordControl.OnUpdateOverlay();
        }
    };
    this.StartSearch = function () {
        this.SearchClear();
        if (this.m_bIsSelection) {
            this.m_oWordControl.OnUpdateOverlay();
        }
        this.m_bIsSearching = true;
        this.CurrentSearchNavi = null;
    };
    this.EndSearch = function (bIsChange) {
        if (bIsChange) {
            this.SearchClear();
            this.m_bIsSearching = false;
            this.m_oWordControl.OnUpdateOverlay();
        } else {
            this.m_bIsSearching = true;
            this.m_oWordControl.OnUpdateOverlay();
        }
        this.m_oWordControl.m_oApi.sync_SearchEndCallback();
    };
    this.AddPageSelection = function (pageIndex, x, y, width, height) {
        if (pageIndex < 0 || pageIndex != this.SlideCurrent || Math.abs(width) < 0.001 || Math.abs(height) < 0.001) {
            return;
        }
        var xDst = this.SlideCurrectRect.left;
        var yDst = this.SlideCurrectRect.top;
        var wDst = this.SlideCurrectRect.right - this.SlideCurrectRect.left;
        var hDst = this.SlideCurrectRect.bottom - this.SlideCurrectRect.top;
        var dKoefX = wDst / this.m_oLogicDocument.Width;
        var dKoefY = hDst / this.m_oLogicDocument.Height;
        var overlay = this.m_oWordControl.m_oOverlayApi;
        if (null == this.TextMatrix || global_MatrixTransformer.IsIdentity(this.TextMatrix)) {
            var _x = ((xDst + dKoefX * x + 0.5) >> 0) - 0.5;
            var _y = ((yDst + dKoefY * y + 0.5) >> 0) - 0.5;
            var _r = ((xDst + dKoefX * (x + width) + 0.5) >> 0) - 0.5;
            var _b = ((yDst + dKoefY * (y + height) + 0.5) >> 0) - 0.5;
            if (_x < overlay.min_x) {
                overlay.min_x = _x;
            }
            if (_r > overlay.max_x) {
                overlay.max_x = _r;
            }
            if (_y < overlay.min_y) {
                overlay.min_y = _y;
            }
            if (_b > overlay.max_y) {
                overlay.max_y = _b;
            }
            overlay.m_oContext.rect(_x, _y, _r - _x + 1, _b - _y + 1);
        } else {
            var _x1 = this.TextMatrix.TransformPointX(x, y);
            var _y1 = this.TextMatrix.TransformPointY(x, y);
            var _x2 = this.TextMatrix.TransformPointX(x + width, y);
            var _y2 = this.TextMatrix.TransformPointY(x + width, y);
            var _x3 = this.TextMatrix.TransformPointX(x + width, y + height);
            var _y3 = this.TextMatrix.TransformPointY(x + width, y + height);
            var _x4 = this.TextMatrix.TransformPointX(x, y + height);
            var _y4 = this.TextMatrix.TransformPointY(x, y + height);
            var x1 = xDst + dKoefX * _x1;
            var y1 = yDst + dKoefY * _y1;
            var x2 = xDst + dKoefX * _x2;
            var y2 = yDst + dKoefY * _y2;
            var x3 = xDst + dKoefX * _x3;
            var y3 = yDst + dKoefY * _y3;
            var x4 = xDst + dKoefX * _x4;
            var y4 = yDst + dKoefY * _y4;
            if (global_MatrixTransformer.IsIdentity2(this.TextMatrix)) {
                x1 = (x1 >> 0) + 0.5;
                y1 = (y1 >> 0) + 0.5;
                x2 = (x2 >> 0) + 0.5;
                y2 = (y2 >> 0) + 0.5;
                x3 = (x3 >> 0) + 0.5;
                y3 = (y3 >> 0) + 0.5;
                x4 = (x4 >> 0) + 0.5;
                y4 = (y4 >> 0) + 0.5;
            }
            overlay.CheckPoint(x1, y1);
            overlay.CheckPoint(x2, y2);
            overlay.CheckPoint(x3, y3);
            overlay.CheckPoint(x4, y4);
            var ctx = overlay.m_oContext;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
        }
    };
    this.SelectShow = function () {
        this.m_oWordControl.OnUpdateOverlay();
    };
    this.Set_RulerState_Table = function (markup, transform) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
        hor_ruler.m_oTableMarkup = markup.CreateDublicate();
        hor_ruler.CalculateMargins();
        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
        ver_ruler.m_oTableMarkup = markup.CreateDublicate();
        if (transform) {
            hor_ruler.m_oTableMarkup.TransformX = transform.tx;
            hor_ruler.m_oTableMarkup.TransformY = transform.ty;
            ver_ruler.m_oTableMarkup.TransformX = transform.tx;
            ver_ruler.m_oTableMarkup.TransformY = transform.ty;
            hor_ruler.m_oTableMarkup.CorrectFrom();
            ver_ruler.m_oTableMarkup.CorrectFrom();
        }
        hor_ruler.CalculateMargins();
        if (0 <= this.SlideCurrent && this.SlideCurrent < this.SlidesCount) {
            this.m_oWordControl.CreateBackgroundHorRuler();
            this.m_oWordControl.CreateBackgroundVerRuler();
        }
        if (!this.m_oWordControl.IsEnabledRulerMarkers) {
            this.m_oWordControl.EnableRulerMarkers();
        } else {
            this.m_oWordControl.UpdateHorRuler();
        }
        this.m_oWordControl.UpdateVerRuler();
    };
    this.Set_RulerState_Paragraph = function (obj, margins) {
        if (!this.m_oWordControl.m_bIsRuler) {
            return;
        }
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        hor_ruler.m_oTableMarkup = null;
        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        ver_ruler.m_oTableMarkup = null;
        if (-1 != this.SlideCurrent) {
            this.m_oWordControl.CreateBackgroundHorRuler(margins);
            this.m_oWordControl.CreateBackgroundVerRuler(margins);
        }
        if (!this.m_oWordControl.IsEnabledRulerMarkers && margins !== undefined) {
            this.m_oWordControl.EnableRulerMarkers();
        } else {
            if (this.m_oWordControl.IsEnabledRulerMarkers && margins === undefined) {
                this.m_oWordControl.DisableRulerMarkers();
            } else {
                this.m_oWordControl.UpdateHorRuler();
                this.m_oWordControl.UpdateVerRuler();
            }
        }
    };
    this.Set_RulerState_HdrFtr = function (bHeader, Y0, Y1) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        hor_ruler.m_oTableMarkup = null;
        ver_ruler.CurrentObjectType = (true === bHeader) ? RULER_OBJECT_TYPE_HEADER : RULER_OBJECT_TYPE_FOOTER;
        ver_ruler.header_top = Y0;
        ver_ruler.header_bottom = Y1;
        ver_ruler.m_oTableMarkup = null;
        if (-1 != this.m_lCurrentPage) {
            this.m_oWordControl.CreateBackgroundHorRuler();
            this.m_oWordControl.CreateBackgroundVerRuler();
        }
        this.m_oWordControl.UpdateHorRuler();
        this.m_oWordControl.UpdateVerRuler();
    };
    this.Update_ParaTab = function (Default_Tab, ParaTabs) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var __tabs = ParaTabs.Tabs;
        if (undefined === __tabs) {
            __tabs = ParaTabs;
        }
        var _len = __tabs.length;
        if ((Default_Tab == hor_ruler.m_dDefaultTab) && (hor_ruler.m_arrTabs.length == _len) && (_len == 0)) {
            return;
        }
        hor_ruler.m_dDefaultTab = Default_Tab;
        hor_ruler.m_arrTabs = [];
        var _ar = hor_ruler.m_arrTabs;
        for (var i = 0; i < _len; i++) {
            if (__tabs[i].Value == tab_Left) {
                _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_left);
            } else {
                if (__tabs[i].Value == tab_Center) {
                    _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_center);
                } else {
                    if (__tabs[i].Value == tab_Right) {
                        _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_right);
                    } else {
                        _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_left);
                    }
                }
            }
        }
        hor_ruler.CorrectTabs();
        this.m_oWordControl.UpdateHorRuler();
    };
    this.UpdateTableRuler = function (isCols, index, position) {
        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_oWordControl.m_nZoomValue / 100;
        if (false === isCols) {
            var markup = this.m_oWordControl.m_oVerRuler.m_oTableMarkup;
            if (markup == null) {
                return;
            }
            position += markup.TransformY;
            if (0 == index) {
                var delta = position - markup.Rows[0].Y;
                markup.Rows[0].Y = position;
                markup.Rows[0].H -= delta;
            } else {
                var delta = (markup.Rows[index - 1].Y + markup.Rows[index - 1].H) - position;
                markup.Rows[index - 1].H -= delta;
                if (index != markup.Rows.length) {
                    markup.Rows[index].Y -= delta;
                    markup.Rows[index].H += delta;
                }
            }
            if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display) {
                this.m_oWordControl.ShowOverlay();
            }
            this.m_oWordControl.UpdateVerRulerBack();
            this.m_oWordControl.m_oOverlayApi.HorLine(this.SlideCurrectRect.top + position * dKoef_mm_to_pix);
        } else {
            var markup = this.m_oWordControl.m_oHorRuler.m_oTableMarkup;
            if (markup == null) {
                return;
            }
            position += markup.TransformX;
            if (0 == index) {
                markup.X = position;
            } else {
                var _start = markup.X;
                for (var i = 0; i < (index - 1); i++) {
                    _start += markup.Cols[i];
                }
                var _old = markup.Cols[index - 1];
                markup.Cols[index - 1] = position - _start;
                if (index != markup.Cols.length) {
                    markup.Cols[index] += (_old - markup.Cols[index - 1]);
                }
            }
            if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display) {
                this.m_oWordControl.ShowOverlay();
            }
            this.m_oWordControl.UpdateHorRulerBack();
            this.m_oWordControl.m_oOverlayApi.VertLine(this.SlideCurrectRect.left + position * dKoef_mm_to_pix);
        }
    };
    this.GetDotsPerMM = function (value) {
        return value * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
    };
    this.GetMMPerDot = function (value) {
        return value / this.GetDotsPerMM(1);
    };
    this.GetVisibleMMHeight = function () {
        var pixHeigth = this.m_oWordControl.m_oEditor.HtmlElement.height;
        if (this.m_oWordControl.bIsRetinaSupport) {
            pixHeigth >>= 1;
        }
        var pixBetweenPages = 20 * (this.m_lDrawingEnd - this.m_lDrawingFirst);
        return (pixHeigth - pixBetweenPages) * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
    };
    this.CheckFontCache = function () {
        var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();
        var _measure_map = g_oTextMeasurer.m_oManager.m_oFontsCache.Fonts;
        var _drawing_map = g_fontManager.m_oFontsCache.Fonts;
        var map_keys = {};
        var api = this.m_oWordControl.m_oApi;
        for (var i in map_used) {
            var key = GenerateMapId(api, map_used[i].Name, map_used[i].Style, map_used[i].Size);
            map_keys[key] = true;
        }
        for (var i in _measure_map) {
            if (map_keys[i] == undefined) {
                delete _measure_map[i];
            }
        }
        for (var i in _drawing_map) {
            if (map_keys[i] == undefined) {
                if (null != _drawing_map[i]) {
                    _drawing_map[i].Destroy();
                }
                delete _drawing_map[i];
            }
        }
    };
    this.CheckFontNeeds = function () {
        var map_keys = this.m_oWordControl.m_oLogicDocument.Document_Get_AllFontNames();
        var dstfonts = [];
        for (var i in map_keys) {
            dstfonts[dstfonts.length] = new CFont(i, 0, "", 0, null);
        }
        this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
        return;
    };
    this.CorrectRulerPosition = function (pos) {
        if (global_keyboardEvent.AltKey) {
            return pos;
        }
        return ((pos / 2.5 + 0.5) >> 0) * 2.5;
    };
    this.DrawTrack = function (type, matrix, left, top, width, height, isLine, canRotate, isNoMove) {
        this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
    };
    this.LockSlide = function (slideNum) {
        var _th_manager = this.m_oWordControl.Thumbnails;
        if (slideNum >= 0 && slideNum < _th_manager.m_arrPages.length) {
            _th_manager.m_arrPages[slideNum].IsLocked = true;
        }
        _th_manager.OnUpdateOverlay();
    };
    this.UnLockSlide = function (slideNum) {
        var _th_manager = this.m_oWordControl.Thumbnails;
        if (slideNum >= 0 && slideNum < _th_manager.m_arrPages.length) {
            _th_manager.m_arrPages[slideNum].IsLocked = false;
        }
        _th_manager.OnUpdateOverlay();
    };
    this.DrawTrackSelectShapes = function (x, y, w, h) {
        this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
    };
    this.DrawAdjustment = function (matrix, x, y) {
        this.AutoShapesTrack.DrawAdjustment(matrix, x, y);
    };
    this.UpdateTargetTransform = function (matrix) {
        this.TextMatrix = matrix;
    };
    this.UpdateThumbnailsAttack = function () {
        this.m_oWordControl.Thumbnails.RecalculateAll();
    };
    this.CheckGuiControlColors = function (bIsAttack) {
        var _slide = null;
        var _layout = null;
        var _master = null;
        if (-1 != this.SlideCurrent) {
            _slide = this.m_oWordControl.m_oLogicDocument.Slides[this.SlideCurrent];
            _layout = _slide.Layout;
            _master = _layout.Master;
        } else {
            if ((0 < this.m_oWordControl.m_oLogicDocument.slideMasters.length) && (0 < this.m_oWordControl.m_oLogicDocument.slideMasters[0].sldLayoutLst.length)) {
                _layout = this.m_oWordControl.m_oLogicDocument.slideMasters[0].sldLayoutLst[0];
                _master = this.m_oWordControl.m_oLogicDocument.slideMasters[0];
            } else {
                return;
            }
        }
        var arr_colors = new Array(10);
        var _theme = _master.Theme;
        var rgba = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        var _count = array_colors_types.length;
        var color = new CUniColor();
        color.color = new CSchemeColor();
        for (var i = 0; i < _count; ++i) {
            color.color.id = array_colors_types[i];
            color.Calculate(_theme, _slide, _layout, _master, rgba);
            var _rgba = color.RGBA;
            arr_colors[i] = new CColor(_rgba.R, _rgba.G, _rgba.B);
        }
        var bIsSend = false;
        if (this.GuiControlColorsMap != null) {
            for (var i = 0; i < _count; ++i) {
                var _color1 = this.GuiControlColorsMap[i];
                var _color2 = arr_colors[i];
                if ((_color1.r != _color2.r) || (_color1.g != _color2.g) || (_color1.b != _color2.b)) {
                    bIsSend = true;
                    break;
                }
            }
        } else {
            this.GuiControlColorsMap = new Array(_count);
            bIsSend = true;
        }
        if (bIsSend || (bIsAttack === true)) {
            for (var i = 0; i < _count; ++i) {
                this.GuiControlColorsMap[i] = arr_colors[i];
            }
            this.SendControlColors(bIsAttack);
        }
    };
    this.SendControlColors = function (bIsAttack) {
        var standart_colors = null;
        if (!this.IsSendStandartColors || (bIsAttack === true)) {
            var _c_s = g_oStandartColors.length;
            standart_colors = new Array(_c_s);
            for (var i = 0; i < _c_s; ++i) {
                standart_colors[i] = new CColor(g_oStandartColors[i]["R"], g_oStandartColors[i]["G"], g_oStandartColors[i]["B"]);
            }
            this.IsSendStandartColors = true;
        }
        var _count = this.GuiControlColorsMap.length;
        var _ret_array = new Array(_count * 6);
        var _cur_index = 0;
        for (var i = 0; i < _count; ++i) {
            var _color_src = this.GuiControlColorsMap[i];
            _ret_array[_cur_index] = new CColor(_color_src.r, _color_src.g, _color_src.b);
            _cur_index++;
            var _count_mods = 5;
            for (var j = 0; j < _count_mods; ++j) {
                var dst_mods = new CColorModifiers();
                dst_mods.Mods = _create_mods(GetDefaultMods(_color_src.r, _color_src.g, _color_src.b, j + 1, 0));
                var _rgba = {
                    R: _color_src.r,
                    G: _color_src.g,
                    B: _color_src.b,
                    A: 255
                };
                dst_mods.Apply(_rgba);
                _ret_array[_cur_index] = new CColor(_rgba.R, _rgba.G, _rgba.B);
                _cur_index++;
            }
        }
        this.m_oWordControl.m_oApi.sync_SendThemeColors(_ret_array, standart_colors);
    };
    this.SendThemeColorScheme = function () {
        var infos = [];
        var _index = 0;
        var _c = null;
        var _count_defaults = g_oUserColorScheme.length;
        for (var i = 0; i < _count_defaults; ++i) {
            var _obj = g_oUserColorScheme[i];
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _obj["name"];
            _c = _obj["dk1"];
            infos[_index].Colors[0] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt1"];
            infos[_index].Colors[1] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["dk2"];
            infos[_index].Colors[2] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt2"];
            infos[_index].Colors[3] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent1"];
            infos[_index].Colors[4] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent2"];
            infos[_index].Colors[5] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent3"];
            infos[_index].Colors[6] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent4"];
            infos[_index].Colors[7] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent5"];
            infos[_index].Colors[8] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent6"];
            infos[_index].Colors[9] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["hlink"];
            infos[_index].Colors[10] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["folHlink"];
            infos[_index].Colors[11] = new CColor(_c["R"], _c["G"], _c["B"]);
            ++_index;
        }
        var _theme = this.m_oWordControl.MasterLayouts.Theme;
        var _extra = _theme.extraClrSchemeLst;
        var _count = _extra.length;
        var _rgba = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        for (var i = 0; i < _count; ++i) {
            var _scheme = _extra[i].clrScheme;
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _scheme.name;
            _scheme.colors[8].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[8].RGBA;
            infos[_index].Colors[0] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[12].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[12].RGBA;
            infos[_index].Colors[1] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[9].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[9].RGBA;
            infos[_index].Colors[2] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[13].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[13].RGBA;
            infos[_index].Colors[3] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[0].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[0].RGBA;
            infos[_index].Colors[4] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[1].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[1].RGBA;
            infos[_index].Colors[5] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[2].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[2].RGBA;
            infos[_index].Colors[6] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[3].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[3].RGBA;
            infos[_index].Colors[7] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[4].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[4].RGBA;
            infos[_index].Colors[8] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[5].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[5].RGBA;
            infos[_index].Colors[9] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[11].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[11].RGBA;
            infos[_index].Colors[10] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[10].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[10].RGBA;
            infos[_index].Colors[11] = new CColor(_c.R, _c.G, _c.B);
            _index++;
        }
        this.m_oWordControl.m_oApi.sync_SendThemeColorSchemes(infos);
    };
    this.DrawImageTextureFillShape = function (url) {
        if (this.GuiCanvasFillTexture == null) {
            this.InitGuiCanvasShape(this.GuiCanvasFillTextureParentId);
        }
        if (this.GuiCanvasFillTexture == null || this.GuiCanvasFillTextureCtx == null || url == this.LastDrawingUrl) {
            return;
        }
        this.LastDrawingUrl = url;
        var _width = this.GuiCanvasFillTexture.width;
        var _height = this.GuiCanvasFillTexture.height;
        this.GuiCanvasFillTextureCtx.clearRect(0, 0, _width, _height);
        if (null == this.LastDrawingUrl) {
            return;
        }
        var _img = this.m_oWordControl.m_oApi.ImageLoader.map_image_index[_getFullImageSrc(this.LastDrawingUrl)];
        if (_img != undefined && _img.Image != null && _img.Status != ImageLoadStatus.Loading) {
            var _x = 0;
            var _y = 0;
            var _w = Math.max(_img.Image.width, 1);
            var _h = Math.max(_img.Image.height, 1);
            var dAspect1 = _width / _height;
            var dAspect2 = _w / _h;
            _w = _width;
            _h = _height;
            if (dAspect1 >= dAspect2) {
                _w = dAspect2 * _height;
                _x = (_width - _w) / 2;
            } else {
                _h = _w / dAspect2;
                _y = (_height - _h) / 2;
            }
            this.GuiCanvasFillTextureCtx.drawImage(_img.Image, _x, _y, _w, _h);
        } else {
            this.GuiCanvasFillTextureCtx.lineWidth = 1;
            this.GuiCanvasFillTextureCtx.beginPath();
            this.GuiCanvasFillTextureCtx.moveTo(0, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtx.moveTo(_width, 0);
            this.GuiCanvasFillTextureCtx.lineTo(0, _height);
            this.GuiCanvasFillTextureCtx.strokeStyle = "#FF0000";
            this.GuiCanvasFillTextureCtx.stroke();
            this.GuiCanvasFillTextureCtx.beginPath();
            this.GuiCanvasFillTextureCtx.moveTo(0, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtx.lineTo(0, _height);
            this.GuiCanvasFillTextureCtx.closePath();
            this.GuiCanvasFillTextureCtx.strokeStyle = "#000000";
            this.GuiCanvasFillTextureCtx.stroke();
            this.GuiCanvasFillTextureCtx.beginPath();
        }
    };
    this.DrawImageTextureFillSlide = function (url) {
        if (this.GuiCanvasFillTextureSlide == null) {
            this.InitGuiCanvasSlide(this.GuiCanvasFillTextureParentIdSlide);
        }
        if (this.GuiCanvasFillTextureSlide == null || this.GuiCanvasFillTextureCtxSlide == null || url == this.LastDrawingUrlSlide) {
            return;
        }
        this.LastDrawingUrlSlide = url;
        var _width = this.GuiCanvasFillTextureSlide.width;
        var _height = this.GuiCanvasFillTextureSlide.height;
        this.GuiCanvasFillTextureCtxSlide.clearRect(0, 0, _width, _height);
        if (null == this.LastDrawingUrlSlide) {
            return;
        }
        var _img = this.m_oWordControl.m_oApi.ImageLoader.map_image_index[_getFullImageSrc(this.LastDrawingUrlSlide)];
        if (_img != undefined && _img.Image != null && _img.Status != ImageLoadStatus.Loading) {
            var _x = 0;
            var _y = 0;
            var _w = Math.max(_img.Image.width, 1);
            var _h = Math.max(_img.Image.height, 1);
            var dAspect1 = _width / _height;
            var dAspect2 = _w / _h;
            _w = _width;
            _h = _height;
            if (dAspect1 >= dAspect2) {
                _w = dAspect2 * _height;
                _x = (_width - _w) / 2;
            } else {
                _h = _w / dAspect2;
                _y = (_height - _h) / 2;
            }
            this.GuiCanvasFillTextureCtxSlide.drawImage(_img.Image, _x, _y, _w, _h);
        } else {
            this.GuiCanvasFillTextureCtxSlide.lineWidth = 1;
            this.GuiCanvasFillTextureCtxSlide.beginPath();
            this.GuiCanvasFillTextureCtxSlide.moveTo(0, 0);
            this.GuiCanvasFillTextureCtxSlide.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtxSlide.moveTo(_width, 0);
            this.GuiCanvasFillTextureCtxSlide.lineTo(0, _height);
            this.GuiCanvasFillTextureCtxSlide.strokeStyle = "#FF0000";
            this.GuiCanvasFillTextureCtxSlide.stroke();
            this.GuiCanvasFillTextureCtxSlide.beginPath();
            this.GuiCanvasFillTextureCtxSlide.moveTo(0, 0);
            this.GuiCanvasFillTextureCtxSlide.lineTo(_width, 0);
            this.GuiCanvasFillTextureCtxSlide.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtxSlide.lineTo(0, _height);
            this.GuiCanvasFillTextureCtxSlide.closePath();
            this.GuiCanvasFillTextureCtxSlide.strokeStyle = "#000000";
            this.GuiCanvasFillTextureCtxSlide.stroke();
            this.GuiCanvasFillTextureCtxSlide.beginPath();
        }
    };
    this.InitGuiCanvasShape = function (div_id) {
        if (null != this.GuiCanvasFillTexture) {
            var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
            if (!_div_elem) {
                _div_elem.removeChild(this.GuiCanvasFillTexture);
            }
            this.GuiCanvasFillTexture = null;
            this.GuiCanvasFillTextureCtx = null;
        }
        this.GuiCanvasFillTextureParentId = div_id;
        var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
        if (!_div_elem) {
            return;
        }
        this.GuiCanvasFillTexture = document.createElement("canvas");
        this.GuiCanvasFillTexture.width = parseInt(_div_elem.style.width);
        this.GuiCanvasFillTexture.height = parseInt(_div_elem.style.height);
        this.LastDrawingUrl = "";
        this.GuiCanvasFillTextureCtx = this.GuiCanvasFillTexture.getContext("2d");
        _div_elem.appendChild(this.GuiCanvasFillTexture);
    };
    this.InitGuiCanvasSlide = function (div_id) {
        if (null != this.GuiCanvasFillTextureSlide) {
            var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentIdSlide);
            if (!_div_elem) {
                _div_elem.removeChild(this.GuiCanvasFillTextureSlide);
            }
            this.GuiCanvasFillTextureSlide = null;
            this.GuiCanvasFillTextureCtxSlide = null;
        }
        this.GuiCanvasFillTextureParentIdSlide = div_id;
        var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentIdSlide);
        if (!_div_elem) {
            return;
        }
        this.GuiCanvasFillTextureSlide = document.createElement("canvas");
        this.GuiCanvasFillTextureSlide.width = parseInt(_div_elem.style.width);
        this.GuiCanvasFillTextureSlide.height = parseInt(_div_elem.style.height);
        this.LastDrawingUrlSlide = "";
        this.GuiCanvasFillTextureCtxSlide = this.GuiCanvasFillTextureSlide.getContext("2d");
        _div_elem.appendChild(this.GuiCanvasFillTextureSlide);
    };
    this.CheckTableStyles = function () {
        if (!this.m_oWordControl.m_oApi.asc_checkNeedCallback("asc_onInitTableTemplates")) {
            return;
        }
        var logicDoc = this.m_oWordControl.m_oLogicDocument;
        var _dst_styles = [];
        var _pageW = 297;
        var _pageH = 210;
        var _canvas = document.createElement("canvas");
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
        var ctx = _canvas.getContext("2d");
        for (var i = 0; i < logicDoc.TablesForInterface.length; i++) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, _canvas.width, _canvas.height);
            var graphics = new CGraphics();
            graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
            graphics.m_oFontManager = g_fontManager;
            graphics.transform(1, 0, 0, 1, 0, 0);
            logicDoc.TablesForInterface[i].graphicObject.Draw(0, graphics);
            var _styleD = new CAscTableStyle();
            _styleD.Type = 0;
            _styleD.Image = _canvas.toDataURL("image/png");
            _styleD.Id = logicDoc.TablesForInterface[i].graphicObject.TableStyle;
            _dst_styles.push(_styleD);
        }
        this.m_oWordControl.m_oApi.sync_InitEditorTableStyles(_dst_styles);
    };
    this.OnSelectEnd = function () {};
    this.GetCommentWidth = function (type) {
        var _index = 0;
        if ((type & 2) == 2) {
            _index = 2;
        }
        if ((type & 1) == 1) {
            _index += 1;
        }
        return g_comment_image_offsets[_index][2] * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
    };
    this.GetCommentHeight = function (type) {
        var _index = 0;
        if ((type & 2) == 2) {
            _index = 2;
        }
        if ((type & 1) == 1) {
            _index += 1;
        }
        return g_comment_image_offsets[_index][3] * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
    };
    this.DrawVerAnchor = function (pageNum, xPos, bIsFromDrawings) {
        if (undefined === bIsFromDrawings) {
            if (this.m_oWordControl.m_oApi.ShowSnapLines) {
                this.HorVerAnchors.push({
                    Type: 0,
                    Pos: xPos
                });
            }
            return;
        }
        var _pos = this.ConvertCoordsToCursor(xPos, 0);
        if (_pos.Error === false) {
            this.m_oWordControl.m_oOverlayApi.DashLineColor = "#FF0000";
            this.m_oWordControl.m_oOverlayApi.VertLine2(_pos.X);
            this.m_oWordControl.m_oOverlayApi.DashLineColor = "#000000";
        }
    };
    this.DrawHorAnchor = function (pageNum, yPos, bIsFromDrawings) {
        if (undefined === bIsFromDrawings) {
            if (this.m_oWordControl.m_oApi.ShowSnapLines) {
                this.HorVerAnchors.push({
                    Type: 1,
                    Pos: yPos
                });
            }
            return;
        }
        var _pos = this.ConvertCoordsToCursor(0, yPos);
        if (_pos.Error === false) {
            this.m_oWordControl.m_oOverlayApi.DashLineColor = "#FF0000";
            this.m_oWordControl.m_oOverlayApi.HorLine2(_pos.Y);
            this.m_oWordControl.m_oOverlayApi.DashLineColor = "#000000";
        }
    };
    this.DrawHorVerAnchor = function () {
        for (var i = 0; i < this.HorVerAnchors.length; i++) {
            var _anchor = this.HorVerAnchors[i];
            if (_anchor.Type == 0) {
                this.DrawVerAnchor(0, _anchor.Pos, true);
            } else {
                this.DrawHorAnchor(0, _anchor.Pos, true);
            }
        }
        this.HorVerAnchors.splice(0, this.HorVerAnchors.length);
    };
}
function CThPage() {
    this.PageIndex = -1;
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.IsRecalc = false;
    this.cachedImage = null;
    this.IsSelected = false;
    this.IsFocused = false;
    this.IsLocked = false;
    this.Draw = function (context, xDst, yDst, wDst, hDst, contextW, contextH) {
        if (wDst <= 0 || hDst <= 0) {
            return;
        }
        if (null != this.cachedImage) {
            context.drawImage(this.cachedImage.image, xDst, yDst, wDst, hDst);
        } else {
            context.fillStyle = "#FFFFFF";
            context.fillRect(xDst, yDst, wDst, hDst);
        }
    };
}
function CThumbnailsManager() {
    this.m_oFontManager = new CFontManager();
    this.m_bIsScrollVisible = true;
    this.DigitWidths = [];
    this.backgroundColor = "#B0B0B0";
    this.overColor = "#D3D3D3";
    this.selectColor = "#FFD86B";
    this.selectoverColor = "#FFE065";
    this.SlideWidth = 297;
    this.SlideHeight = 210;
    this.SlidesCount = 0;
    this.m_dScrollY = 0;
    this.m_dScrollY_max = 0;
    this.m_bIsVisible = false;
    this.m_nCurrentPage = -1;
    this.m_bIsUpdate = false;
    this.m_arrPages = [];
    this.m_lDrawingFirst = -1;
    this.m_lDrawingEnd = -1;
    this.const_offset_x = 0;
    this.const_offset_y = 0;
    this.const_offset_r = 4;
    this.const_offset_b = 0;
    this.const_border_w = 4;
    this.bIsEmptyDrawed = false;
    this.m_oCacheManager = new CCacheManager();
    this.FocusObjType = FOCUS_OBJECT_MAIN;
    this.LockMainObjType = false;
    this.SelectPageEnabled = true;
    this.IsMouseDownTrack = false;
    this.IsMouseDownTrackSimple = true;
    this.MouseDownTrackPage = -1;
    this.MouseDownTrackX = -1;
    this.MouseDownTrackY = -1;
    this.MouseDownTrackPosition = 0;
    this.MouseTrackCommonImage = null;
    this.MouseThumbnailsAnimateScrollTopTimer = -1;
    this.MouseThumbnailsAnimateScrollBottomTimer = -1;
    this.m_oWordControl = null;
    var oThis = this;
    this.initEvents = function () {
        var control = this.m_oWordControl.m_oThumbnails.HtmlElement;
        control.onmousedown = this.onMouseDown;
        control.onmousemove = this.onMouseMove;
        control.onmouseup = this.onMouseUp;
        control.onmouseout = this.onMouseLeave;
        control.onmousewheel = this.onMouseWhell;
        if (control.addEventListener) {
            control.addEventListener("DOMMouseScroll", this.onMouseWhell, false);
        }
        this.initEvents2MobileAdvances();
    };
    this.initEvents2MobileAdvances = function () {
        var control = this.m_oWordControl.m_oThumbnails.HtmlElement;
        control["ontouchstart"] = function (e) {
            oThis.onMouseDown(e.touches[0]);
            return false;
        };
        control["ontouchmove"] = function (e) {
            oThis.onMouseMove(e.touches[0]);
            return false;
        };
        control["ontouchend"] = function (e) {
            oThis.onMouseUp(e.changedTouches[0]);
            return false;
        };
    };
    this.ConvertCoords = function (x, y, isPage, isFixed) {
        var Pos = {
            X: x,
            Y: y
        };
        Pos.X -= this.m_oWordControl.X;
        Pos.Y -= this.m_oWordControl.Y;
        if (isFixed && isPage) {
            Pos.Page = -1;
            var pages_count = this.m_arrPages.length;
            for (var i = 0; i < pages_count; i++) {
                var drawRect = this.m_arrPages[i];
                if (Pos.Y >= drawRect.top && Pos.Y <= drawRect.bottom) {
                    Pos.Page = i;
                    break;
                }
            }
        } else {
            if (isPage) {
                Pos.Page = 0;
                var pages_count = this.m_arrPages.length;
                for (var i = 0; i < pages_count; i++) {
                    var drawRect = this.m_arrPages[i];
                    if (Pos.Y >= drawRect.top && Pos.Y <= drawRect.bottom) {
                        Pos.Page = i;
                        break;
                    }
                    if (i == (pages_count - 1) && Pos.Y > drawRect.bottom) {
                        Pos.Page = i;
                    }
                }
                if (Pos.Page >= pages_count) {
                    Pos.Page = -1;
                }
            }
        }
        return Pos;
    };
    this.ConvertCoords2 = function (x, y) {
        var Pos = {
            X: x,
            Y: y
        };
        Pos.X -= this.m_oWordControl.X;
        Pos.Y -= this.m_oWordControl.Y;
        var _abs_pos = this.m_oWordControl.m_oThumbnails.AbsolutePosition;
        var _controlW = (_abs_pos.R - _abs_pos.L) * g_dKoef_mm_to_pix;
        var _controlH = (_abs_pos.B - _abs_pos.T) * g_dKoef_mm_to_pix;
        if (Pos.X < 0 || Pos.X > _controlW || Pos.Y < 0 || Pos.Y > _controlH) {
            return -1;
        }
        var pages_count = this.m_arrPages.length;
        if (0 == pages_count) {
            return -1;
        }
        var _min = Math.abs(Pos.Y - this.m_arrPages[0].top);
        var _MinPositionPage = 0;
        for (var i = 0; i < pages_count; i++) {
            var _min1 = Math.abs(Pos.Y - this.m_arrPages[i].top);
            var _min2 = Math.abs(Pos.Y - this.m_arrPages[i].bottom);
            if (_min1 < _min) {
                _min = _min1;
                _MinPositionPage = i;
            }
            if (_min2 < _min) {
                _min = _min2;
                _MinPositionPage = i + 1;
            }
        }
        return _MinPositionPage;
    };
    this.onMouseDown = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var control = oThis.m_oWordControl.m_oThumbnails.HtmlElement;
        if (global_mouseEvent.IsLocked == true && global_mouseEvent.Sender != control) {
            return false;
        }
        check_MouseDownEvent(e);
        global_mouseEvent.LockMouse();
        if (global_mouseEvent.Sender != control) {
            return false;
        }
        if (global_mouseEvent.Button == undefined) {
            global_mouseEvent.Button = 0;
        }
        oThis.SetFocusElement(FOCUS_OBJECT_THUMBNAILS);
        var pos = oThis.ConvertCoords(global_mouseEvent.X, global_mouseEvent.Y, true, true);
        if (pos.Page == -1) {
            if (global_mouseEvent.Button == 2) {
                var _data = new CContextMenuData();
                _data.Type = c_oAscContextMenuTypes.Thumbnails;
                _data.X_abs = global_mouseEvent.X - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.X;
                _data.Y_abs = global_mouseEvent.Y - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.Y;
                _data.IsSlideSelect = false;
                oThis.m_oWordControl.m_oApi.sync_ContextMenuCallback(_data);
            }
            return false;
        }
        if (global_keyboardEvent.CtrlKey) {
            if (oThis.m_arrPages[pos.Page].IsSelected === true) {
                oThis.m_arrPages[pos.Page].IsSelected = false;
                var arr = oThis.GetSelectedArray();
                if (0 == arr.length) {
                    oThis.m_arrPages[pos.Page].IsSelected = true;
                    oThis.ShowPage(pos.Page);
                } else {
                    oThis.OnUpdateOverlay();
                    oThis.SelectPageEnabled = false;
                    oThis.m_oWordControl.GoToPage(arr[0]);
                    oThis.SelectPageEnabled = true;
                    oThis.ShowPage(arr[0]);
                }
            } else {
                oThis.m_arrPages[pos.Page].IsSelected = true;
                oThis.OnUpdateOverlay();
                oThis.SelectPageEnabled = false;
                oThis.m_oWordControl.GoToPage(pos.Page);
                oThis.SelectPageEnabled = true;
                oThis.ShowPage(pos.Page);
            }
        } else {
            if (global_keyboardEvent.ShiftKey) {
                var pages_count = oThis.m_arrPages.length;
                for (var i = 0; i < pages_count; i++) {
                    oThis.m_arrPages[i].IsSelected = false;
                }
                var _max = pos.Page;
                var _min = oThis.m_oWordControl.m_oDrawingDocument.SlideCurrent;
                if (_min > _max) {
                    var _temp = _max;
                    _max = _min;
                    _min = _temp;
                }
                for (var i = _min; i <= _max; i++) {
                    oThis.m_arrPages[i].IsSelected = true;
                }
                oThis.ShowPage(pos.Page);
            } else {
                if (0 == global_mouseEvent.Button || 2 == global_mouseEvent.Button) {
                    if (0 == global_mouseEvent.Button) {
                        oThis.IsMouseDownTrack = true;
                        oThis.IsMouseDownTrackSimple = true;
                        oThis.MouseDownTrackPage = pos.Page;
                        oThis.MouseDownTrackX = global_mouseEvent.X;
                        oThis.MouseDownTrackY = global_mouseEvent.Y;
                    }
                    if (oThis.m_arrPages[pos.Page].IsSelected) {
                        oThis.SelectPageEnabled = false;
                        oThis.m_oWordControl.GoToPage(pos.Page);
                        oThis.SelectPageEnabled = true;
                        if (global_mouseEvent.Button == 2 && !global_keyboardEvent.CtrlKey) {
                            var _data = new CContextMenuData();
                            _data.Type = c_oAscContextMenuTypes.Thumbnails;
                            _data.X_abs = global_mouseEvent.X - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.X;
                            _data.Y_abs = global_mouseEvent.Y - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.Y;
                            oThis.m_oWordControl.m_oApi.sync_ContextMenuCallback(_data);
                        }
                        return false;
                    }
                    var pages_count = oThis.m_arrPages.length;
                    for (var i = 0; i < pages_count; i++) {
                        oThis.m_arrPages[i].IsSelected = false;
                    }
                    oThis.m_arrPages[pos.Page].IsSelected = true;
                    oThis.OnUpdateOverlay();
                    oThis.SelectPageEnabled = false;
                    oThis.m_oWordControl.GoToPage(pos.Page);
                    oThis.SelectPageEnabled = true;
                    oThis.ShowPage(pos.Page);
                }
            }
        }
        if (global_mouseEvent.Button == 2 && !global_keyboardEvent.CtrlKey) {
            var _data = new CContextMenuData();
            _data.Type = c_oAscContextMenuTypes.Thumbnails;
            _data.X_abs = global_mouseEvent.X - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.X;
            _data.Y_abs = global_mouseEvent.Y - ((oThis.m_oWordControl.m_oThumbnails.AbsolutePosition.T * g_dKoef_mm_to_pix) >> 0) - oThis.m_oWordControl.Y;
            oThis.m_oWordControl.m_oApi.sync_ContextMenuCallback(_data);
        }
        return false;
    };
    this.ShowPage = function (pageNum) {
        var y1 = this.m_arrPages[pageNum].top - this.const_border_w;
        var y2 = this.m_arrPages[pageNum].bottom + this.const_border_w;
        if (y1 < 0) {
            var _sizeH = y2 - y1;
            this.m_oWordControl.m_oScrollThumbApi.scrollToY(pageNum * _sizeH + (pageNum + 1) * this.const_border_w);
        } else {
            if (y2 > this.m_oWordControl.m_oThumbnails.HtmlElement.height) {
                this.m_oWordControl.m_oScrollThumbApi.scrollByY(y2 - this.m_oWordControl.m_oThumbnails.HtmlElement.height);
            }
        }
    };
    this.SelectPage = function (pageNum) {
        if (!this.SelectPageEnabled) {
            return;
        }
        var pages_count = this.m_arrPages.length;
        if (pageNum >= 0 && pageNum < pages_count) {
            var bIsUpdate = false;
            for (var i = 0; i < pages_count; i++) {
                if (this.m_arrPages[i].IsSelected === true && i != pageNum) {
                    bIsUpdate = true;
                }
                this.m_arrPages[i].IsSelected = false;
            }
            if (this.m_arrPages[pageNum].IsSelected === false) {
                bIsUpdate = true;
            }
            this.m_arrPages[pageNum].IsSelected = true;
            this.m_bIsUpdate = bIsUpdate;
            if (bIsUpdate && this.m_oWordControl.m_oScrollThumbApi != null) {
                var y1 = this.m_arrPages[pageNum].top - this.const_border_w;
                var y2 = this.m_arrPages[pageNum].bottom + this.const_border_w;
                if (y1 < 0) {
                    var _sizeH = y2 - y1;
                    this.m_oWordControl.m_oScrollThumbApi.scrollToY(pageNum * _sizeH + (pageNum + 1) * this.const_border_w);
                } else {
                    if (y2 > this.m_oWordControl.m_oThumbnails.HtmlElement.height) {
                        this.m_oWordControl.m_oScrollThumbApi.scrollByY(y2 - this.m_oWordControl.m_oThumbnails.HtmlElement.height);
                    }
                }
            }
        }
    };
    this.ClearCacheAttack = function () {
        var pages_count = this.m_arrPages.length;
        for (var i = 0; i < pages_count; i++) {
            this.m_arrPages[i].IsRecalc = true;
        }
        this.m_bIsUpdate = true;
    };
    this.RecalculateAll = function () {
        this.SlideWidth = this.m_oWordControl.m_oLogicDocument.Width;
        this.SlideHeight = this.m_oWordControl.m_oLogicDocument.Height;
        this.SlidesCount = this.m_oWordControl.m_oDrawingDocument.SlidesCount;
        this.CheckSizes();
        this.ClearCacheAttack();
    };
    this.onMouseMove = function (e) {
        var control = oThis.m_oWordControl.m_oThumbnails.HtmlElement;
        if (global_mouseEvent.IsLocked == true && global_mouseEvent.Sender != control) {
            return;
        }
        check_MouseMoveEvent(e);
        if (global_mouseEvent.Sender != control) {
            return;
        }
        if (oThis.IsMouseDownTrack) {
            if (oThis.IsMouseDownTrackSimple) {
                if (Math.abs(oThis.MouseDownTrackX - global_mouseEvent.X) > 10 || Math.abs(oThis.MouseDownTrackY - global_mouseEvent.Y) > 10) {
                    oThis.IsMouseDownTrackSimple = false;
                }
            }
            if (!oThis.IsMouseDownTrackSimple) {
                oThis.MouseDownTrackPosition = oThis.ConvertCoords2(global_mouseEvent.X, global_mouseEvent.Y);
            }
            oThis.OnUpdateOverlay();
            if (oThis.m_bIsScrollVisible) {
                var _Y = global_mouseEvent.Y - oThis.m_oWordControl.Y;
                var _abs_pos = oThis.m_oWordControl.m_oThumbnails.AbsolutePosition;
                var _YMax = (_abs_pos.B - _abs_pos.T) * g_dKoef_mm_to_pix;
                var _check_type = -1;
                if (_Y < 30) {
                    _check_type = 0;
                } else {
                    if (_Y >= (_YMax - 30)) {
                        _check_type = 1;
                    }
                }
                oThis.CheckNeedAnimateScrolls(_check_type);
            }
            if (!oThis.IsMouseDownTrackSimple) {
                var cursor_dragged = "default";
                if (AscBrowser.isWebkit) {
                    cursor_dragged = "-webkit-grabbing";
                } else {
                    if (AscBrowser.isMozilla) {
                        cursor_dragged = "-moz-grabbing";
                    }
                }
                oThis.m_oWordControl.m_oThumbnails.HtmlElement.style.cursor = cursor_dragged;
            }
            return;
        }
        var pos = oThis.ConvertCoords(global_mouseEvent.X, global_mouseEvent.Y, true, true);
        var _is_old_focused = false;
        var pages_count = oThis.m_arrPages.length;
        for (var i = 0; i < pages_count; i++) {
            if (oThis.m_arrPages[i].IsFocused) {
                _is_old_focused = true;
                oThis.m_arrPages[i].IsFocused = false;
            }
        }
        var cursor_moved = "default";
        if (pos.Page != -1) {
            oThis.m_arrPages[pos.Page].IsFocused = true;
            oThis.OnUpdateOverlay();
            cursor_moved = "pointer";
        } else {
            if (_is_old_focused) {
                oThis.OnUpdateOverlay();
            }
        }
        oThis.m_oWordControl.m_oThumbnails.HtmlElement.style.cursor = cursor_moved;
    };
    this.CheckNeedAnimateScrolls = function (type) {
        if (type == -1) {
            if (this.MouseThumbnailsAnimateScrollTopTimer != -1) {
                clearInterval(this.MouseThumbnailsAnimateScrollTopTimer);
                this.MouseThumbnailsAnimateScrollTopTimer = -1;
            }
            if (this.MouseThumbnailsAnimateScrollBottomTimer != -1) {
                clearInterval(this.MouseThumbnailsAnimateScrollBottomTimer);
                this.MouseThumbnailsAnimateScrollBottomTimer = -1;
            }
        }
        if (type == 0) {
            if (this.MouseThumbnailsAnimateScrollBottomTimer != -1) {
                clearInterval(this.MouseThumbnailsAnimateScrollBottomTimer);
                this.MouseThumbnailsAnimateScrollBottomTimer = -1;
            }
            if (-1 == this.MouseThumbnailsAnimateScrollTopTimer) {
                this.MouseThumbnailsAnimateScrollTopTimer = setInterval(this.OnScrollTrackTop, 50);
            }
            return;
        }
        if (type == 1) {
            if (this.MouseThumbnailsAnimateScrollTopTimer != -1) {
                clearInterval(this.MouseThumbnailsAnimateScrollTopTimer);
                this.MouseThumbnailsAnimateScrollTopTimer = -1;
            }
            if (-1 == this.MouseThumbnailsAnimateScrollBottomTimer) {
                this.MouseThumbnailsAnimateScrollBottomTimer = setInterval(this.OnScrollTrackBottom, 50);
            }
            return;
        }
    };
    this.OnScrollTrackTop = function () {
        oThis.m_oWordControl.m_oScrollThumbApi.scrollByY(-45);
    };
    this.OnScrollTrackBottom = function () {
        oThis.m_oWordControl.m_oScrollThumbApi.scrollByY(45);
    };
    this.onMouseUp = function (e) {
        check_MouseUpEvent(e);
        global_mouseEvent.UnLockMouse();
        var control = oThis.m_oWordControl.m_oThumbnails.HtmlElement;
        if (global_mouseEvent.Sender != control) {
            return;
        }
        oThis.CheckNeedAnimateScrolls(-1);
        if (!oThis.IsMouseDownTrack) {
            return;
        }
        if (oThis.IsMouseDownTrackSimple) {
            if (Math.abs(oThis.MouseDownTrackX - global_mouseEvent.X) > 10 || Math.abs(oThis.MouseDownTrackY - global_mouseEvent.Y) > 10) {
                oThis.IsMouseDownTrackSimple = false;
            }
        }
        if (oThis.IsMouseDownTrackSimple) {
            var pages_count = oThis.m_arrPages.length;
            for (var i = 0; i < pages_count; i++) {
                oThis.m_arrPages[i].IsSelected = false;
            }
            oThis.m_arrPages[oThis.MouseDownTrackPage].IsSelected = true;
            oThis.OnUpdateOverlay();
        } else {
            oThis.MouseDownTrackPosition = oThis.ConvertCoords2(global_mouseEvent.X, global_mouseEvent.Y);
            if (-1 != oThis.MouseDownTrackPosition) {
                var _array = oThis.GetSelectedArray();
                oThis.m_oWordControl.m_oLogicDocument.shiftSlides(oThis.MouseDownTrackPosition, _array);
                oThis.ClearCacheAttack();
            }
            oThis.OnUpdateOverlay();
        }
        oThis.IsMouseDownTrack = false;
        oThis.IsMouseDownTrackSimple = true;
        oThis.MouseDownTrackPage = -1;
        oThis.MouseDownTrackX = -1;
        oThis.MouseDownTrackY = -1;
        oThis.MouseDownTrackPosition = -1;
    };
    this.onMouseLeave = function (e) {
        var pages_count = oThis.m_arrPages.length;
        for (var i = 0; i < pages_count; i++) {
            oThis.m_arrPages[i].IsFocused = false;
        }
        oThis.OnUpdateOverlay();
    };
    this.onMouseWhell = function (e) {
        if (false === this.m_bIsScrollVisible || !oThis.m_oWordControl.m_oScrollThumbApi) {
            return;
        }
        var delta = 0;
        if (undefined != e.wheelDelta && e.wheelDelta != 0) {
            delta = -45 * e.wheelDelta / 120;
        } else {
            if (undefined != e.detail && e.detail != 0) {
                delta = 45 * e.detail / 3;
            }
        }
        delta >>= 0;
        oThis.m_oWordControl.m_oScrollThumbApi.scrollBy(0, delta, false);
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        return false;
    };
    this.SetFont = function (font) {
        if (-1 == font.FontFamily.Index) {
            font.FontFamily.Index = window.g_map_font_index[font.FontFamily.Name];
        }
        if (font.FontFamily.Index == undefined || font.FontFamily.Index == -1) {
            return;
        }
        var bItalic = true === font.Italic;
        var bBold = true === font.Bold;
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!bItalic && bBold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (bItalic && !bBold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (bItalic && bBold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        g_fontApplication.LoadFont(font.FontFamily.Name, window.g_font_loader, this.m_oFontManager, font.FontSize, oFontStyle, 96, 96);
    };
    this.Init = function () {
        this.m_oFontManager.Initialize(true);
        this.m_oFontManager.SetHintsProps(true, true);
        var font = {
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Italic: false,
            Bold: false,
            FontSize: 10
        };
        this.SetFont(font);
        for (var i = 0; i < 10; i++) {
            var _meas = this.m_oFontManager.MeasureChar(("" + i).charCodeAt(0));
            if (_meas) {
                this.DigitWidths[i] = _meas.fAdvanceX * 25.4 / 96;
            } else {
                this.DigitWidths[i] = 10;
            }
        }
        if (GlobalSkin.Name == "flat") {
            this.const_offset_y = 17;
            this.const_offset_b = this.const_offset_y;
            this.const_offset_r = 8;
            this.const_border_w = 7;
        }
        this.MouseTrackCommonImage = document.createElement("canvas");
        var _im_w = 9;
        var _im_h = 9;
        this.MouseTrackCommonImage.width = _im_w;
        this.MouseTrackCommonImage.height = _im_h;
        var _ctx = this.MouseTrackCommonImage.getContext("2d");
        var _data = _ctx.createImageData(_im_w, _im_h);
        var _pixels = _data.data;
        var _ind = 0;
        for (var j = 0; j < _im_h; ++j) {
            var _off1 = (j > (_im_w >> 1)) ? (_im_w - j - 1) : j;
            var _off2 = _im_w - _off1 - 1;
            for (var r = 0; r < _im_w; ++r) {
                if (r <= _off1 || r >= _off2) {
                    _pixels[_ind++] = 183;
                    _pixels[_ind++] = 183;
                    _pixels[_ind++] = 183;
                    _pixels[_ind++] = 255;
                } else {
                    _pixels[_ind + 3] = 0;
                    _ind += 4;
                }
            }
        }
        _ctx.putImageData(_data, 0, 0);
    };
    this.CheckSizes = function () {
        var word_control = this.m_oWordControl;
        var __w = word_control.m_oThumbnailsContainer.AbsolutePosition.R - word_control.m_oThumbnailsContainer.AbsolutePosition.L;
        var __h = word_control.m_oThumbnailsContainer.AbsolutePosition.B - word_control.m_oThumbnailsContainer.AbsolutePosition.T;
        var nWidthSlide = (__w * g_dKoef_mm_to_pix) >> 0;
        if (__w < 1 || __h < 0) {
            this.m_bIsVisible = false;
            return;
        }
        this.m_bIsVisible = true;
        nWidthSlide -= this.const_offset_r;
        var _tmpDig = 0;
        if (this.DigitWidths.length > 5) {
            _tmpDig = this.DigitWidths[5];
        }
        this.const_offset_x = (_tmpDig * g_dKoef_mm_to_pix * (("") + (this.SlidesCount + 1)).length) >> 0;
        if (this.const_offset_x < 25) {
            this.const_offset_x = 25;
        }
        nWidthSlide -= this.const_offset_x;
        var nHeightSlide = (nWidthSlide * this.SlideHeight / this.SlideWidth) >> 0;
        var nHeightPix = this.const_offset_y + this.const_offset_y + nHeightSlide * this.SlidesCount;
        if (this.SlidesCount > 0) {
            nHeightPix += (this.SlidesCount - 1) * 3 * this.const_border_w;
        }
        var dPosition = 0;
        if (this.m_dScrollY_max != 0) {
            dPosition = this.m_dScrollY / this.m_dScrollY_max;
        }
        var heightThumbs = (__h * g_dKoef_mm_to_pix) >> 0;
        if (nHeightPix < heightThumbs) {
            if (this.m_bIsScrollVisible && GlobalSkin.ThumbnailScrollWidthNullIfNoScrolling) {
                word_control.m_oThumbnails.Bounds.R = 0;
                word_control.m_oThumbnailsBack.Bounds.R = 0;
                word_control.m_oThumbnails_scroll.Bounds.AbsW = 0;
                word_control.m_oThumbnailsContainer.Resize(__w, __h);
            } else {
                word_control.m_oThumbnails_scroll.HtmlElement.style.display = "none";
            }
            this.m_bIsScrollVisible = false;
            this.m_dScrollY = 0;
        } else {
            if (!this.m_bIsScrollVisible) {
                if (GlobalSkin.ThumbnailScrollWidthNullIfNoScrolling) {
                    word_control.m_oThumbnailsBack.Bounds.R = word_control.ScrollWidthPx * g_dKoef_pix_to_mm;
                    word_control.m_oThumbnails.Bounds.R = word_control.ScrollWidthPx * g_dKoef_pix_to_mm;
                    var _width_mm_scroll = (GlobalSkin.Name == "flat") ? 10 : word_control.ScrollWidthPx;
                    word_control.m_oThumbnails_scroll.Bounds.AbsW = _width_mm_scroll * g_dKoef_pix_to_mm;
                } else {
                    word_control.m_oThumbnails_scroll.HtmlElement.style.display = "block";
                }
                word_control.m_oThumbnailsContainer.Resize(__w, __h);
            }
            this.m_bIsScrollVisible = true;
            __w = word_control.m_oThumbnails.AbsolutePosition.R - word_control.m_oThumbnails.AbsolutePosition.L;
            __h = word_control.m_oThumbnails.AbsolutePosition.B - word_control.m_oThumbnails.AbsolutePosition.T;
            nWidthSlide = (__w * g_dKoef_mm_to_pix) >> 0;
            nWidthSlide -= (this.const_offset_x + this.const_offset_r);
            var nHeightSlide = (nWidthSlide * this.SlideHeight / this.SlideWidth) >> 0;
            var nHeightPix = this.const_offset_y + this.const_offset_y + nHeightSlide * this.SlidesCount;
            if (this.SlidesCount > 0) {
                nHeightPix += (this.SlidesCount - 1) * 3 * this.const_border_w;
            }
            var settings = {
                showArrows: false,
                animateScroll: false,
                screenW: word_control.m_oThumbnails.HtmlElement.width,
                screenH: word_control.m_oThumbnails.HtmlElement.height,
                cornerRadius: 1,
                slimScroll: true,
                scrollBackgroundColor: GlobalSkin.BackgroundColorThumbnails,
                scrollBackgroundColorHover: GlobalSkin.BackgroundColorThumbnails,
                scrollBackgroundColorActive: GlobalSkin.BackgroundColorThumbnails
            };
            document.getElementById("panel_right_scroll_thmbnl").style.height = parseInt(nHeightPix) + "px";
            if (word_control.m_oScrollThumb_) {
                word_control.m_oScrollThumb_.Repos(settings);
                word_control.m_oScrollThumb_.isHorizontalScroll = false;
            } else {
                word_control.m_oScrollThumb_ = new ScrollObject("id_vertical_scroll_thmbnl", settings);
                word_control.m_oScrollThumb_.bind("scrollvertical", function (evt) {
                    oThis.verticalScroll(this, evt.scrollD, evt.maxScrollY);
                });
                word_control.m_oScrollThumbApi = word_control.m_oScrollThumb_;
                word_control.m_oScrollThumb_.isHorizontalScroll = false;
            }
        }
        if (this.m_bIsScrollVisible) {
            var lPosition = (dPosition * word_control.m_oScrollThumbApi.getMaxScrolledY()) >> 0;
            word_control.m_oScrollThumbApi.scrollToY(lPosition);
        }
        this.CalculatePlaces();
        this.m_bIsUpdate = true;
    };
    this.verticalScroll = function (sender, scrollPositionY, maxY, isAtTop, isAtBottom) {
        if (false === this.m_oWordControl.m_oApi.bInit_word_control || false === this.m_bIsScrollVisible) {
            return;
        }
        this.m_dScrollY = Math.max(0, Math.min(scrollPositionY, maxY));
        this.m_dScrollY_max = maxY;
        this.CalculatePlaces();
        this.m_bIsUpdate = true;
        this.SetFocusElement(FOCUS_OBJECT_THUMBNAILS);
    };
    this.CalculatePlaces = function () {
        if (!this.m_bIsVisible) {
            return;
        }
        var word_control = this.m_oWordControl;
        var canvas = word_control.m_oThumbnails.HtmlElement;
        if (null == canvas) {
            return;
        }
        var _width = canvas.width;
        var _height = canvas.height;
        var bIsFoundFirst = false;
        var bIsFoundEnd = false;
        var lCurrentTopInDoc = (this.m_dScrollY) >> 0;
        var __w = word_control.m_oThumbnails.AbsolutePosition.R - word_control.m_oThumbnails.AbsolutePosition.L;
        var __h = word_control.m_oThumbnails.AbsolutePosition.B - word_control.m_oThumbnails.AbsolutePosition.T;
        var nWidthSlide = (__w * g_dKoef_mm_to_pix) >> 0;
        nWidthSlide -= (this.const_offset_x + this.const_offset_r);
        var nHeightSlide = (nWidthSlide * this.SlideHeight / this.SlideWidth) >> 0;
        var lStart = this.const_offset_y;
        for (var i = 0; i < this.SlidesCount; i++) {
            if (i >= this.m_arrPages.length) {
                this.m_arrPages[i] = new CThPage();
            }
            if (false === bIsFoundFirst) {
                if ((lStart + nHeightSlide) > lCurrentTopInDoc) {
                    this.m_lDrawingFirst = i;
                    bIsFoundFirst = true;
                }
            }
            var drawRect = this.m_arrPages[i];
            drawRect.left = this.const_offset_x;
            drawRect.top = lStart - lCurrentTopInDoc;
            drawRect.right = drawRect.left + nWidthSlide;
            drawRect.bottom = drawRect.top + nHeightSlide;
            drawRect.pageIndex = i;
            if (false === bIsFoundEnd) {
                if (drawRect.top > _height) {
                    this.m_lDrawingEnd = i - 1;
                    bIsFoundEnd = true;
                }
            }
            lStart += (nHeightSlide + 3 * this.const_border_w);
        }
        if (this.m_arrPages.length > this.SlidesCount) {
            this.m_arrPages.splice(this.SlidesCount, this.m_arrPages.length - this.SlidesCount);
        }
        if (false === bIsFoundEnd) {
            this.m_lDrawingEnd = this.SlidesCount - 1;
        }
    };
    this.OnPaint = function () {
        if (!this.m_bIsVisible) {
            return;
        }
        var word_control = this.m_oWordControl;
        var canvas = word_control.m_oThumbnails.HtmlElement;
        if (null == canvas) {
            return;
        }
        var context = canvas.getContext("2d");
        var _width = canvas.width;
        var _height = canvas.height;
        context.clearRect(0, 0, _width, _height);
        var _digit_distance = this.const_offset_x * g_dKoef_pix_to_mm;
        for (var i = 0; i < this.SlidesCount; i++) {
            var page = this.m_arrPages[i];
            if (i < this.m_lDrawingFirst || i > this.m_lDrawingEnd) {
                this.m_oCacheManager.UnLock(page.cachedImage);
                page.cachedImage = null;
                continue;
            }
            var g = new CGraphics();
            g.init(context, _width, _height, _width * g_dKoef_pix_to_mm, _height * g_dKoef_pix_to_mm);
            g.m_oFontManager = this.m_oFontManager;
            g.transform(1, 0, 0, 1, 0, 0);
            var font = {
                FontFamily: {
                    Name: "Arial",
                    Index: -1
                },
                Italic: false,
                Bold: false,
                FontSize: 10
            };
            g.SetFont(font);
            var DrawNumSlide = i + 1;
            var num_slide_text_width = 0;
            while (DrawNumSlide != 0) {
                var _last_dig = DrawNumSlide % 10;
                num_slide_text_width += this.DigitWidths[_last_dig];
                DrawNumSlide = (DrawNumSlide / 10) >> 0;
            }
            page.Draw(context, page.left, page.top, page.right - page.left, page.bottom - page.top);
            if (!page.IsLocked) {
                if (i == this.m_oWordControl.m_oDrawingDocument.SlideCurrent || !page.IsSelected) {
                    g.b_color1(0, 0, 0, 255);
                } else {
                    g.b_color1(191, 191, 191, 255);
                }
            } else {
                g.b_color1(211, 79, 79, 255);
            }
            g.t("" + (i + 1), (_digit_distance - num_slide_text_width) / 2, (page.top * g_dKoef_pix_to_mm + 3));
        }
        this.OnUpdateOverlay();
    };
    this.OnUpdateOverlay = function () {
        if (!this.m_bIsVisible) {
            return;
        }
        var canvas = this.m_oWordControl.m_oThumbnailsBack.HtmlElement;
        if (null == canvas) {
            return;
        }
        var context = canvas.getContext("2d");
        var _width = canvas.width;
        var _height = canvas.height;
        context.fillStyle = GlobalSkin.BackgroundColorThumbnails;
        context.fillRect(0, 0, _width, _height);
        var _style_select = "#848484";
        var _style_focus = "#CFCFCF";
        var _style_select_focus = "#848484";
        context.fillStyle = _style_select;
        var _border = this.const_border_w;
        for (var i = 0; i < this.SlidesCount; i++) {
            var page = this.m_arrPages[i];
            if (page.IsLocked) {
                var _lock_focus = "#D34F4F";
                var _lock_color = "#D34F4F";
                if (page.IsFocused) {
                    this.FocusRectFlat(_lock_focus, context, page.left, page.top, page.right, page.bottom);
                } else {
                    this.FocusRectFlat(_lock_color, context, page.left, page.top, page.right, page.bottom);
                }
                continue;
            }
            if (page.IsSelected && page.IsFocused) {
                this.FocusRectFlat(_style_select_focus, context, page.left, page.top, page.right, page.bottom);
            } else {
                if (page.IsSelected) {
                    this.FocusRectFlat(_style_select, context, page.left, page.top, page.right, page.bottom);
                } else {
                    if (page.IsFocused) {
                        this.FocusRectFlat(_style_focus, context, page.left, page.top, page.right, page.bottom);
                    }
                }
            }
        }
        if (this.IsMouseDownTrack && !this.IsMouseDownTrackSimple && -1 != this.MouseDownTrackPosition) {
            context.strokeStyle = "#DEDEDE";
            var y = (0.5 * this.const_offset_y) >> 0;
            if (this.MouseDownTrackPosition != 0) {
                y = (this.m_arrPages[this.MouseDownTrackPosition - 1].bottom + 1.5 * this.const_border_w) >> 0;
            }
            var _left_pos = 0;
            var _right_pos = _width;
            if (this.m_arrPages.length > 0) {
                _left_pos = this.m_arrPages[0].left + 4;
                _right_pos = this.m_arrPages[0].right - 4;
            }
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(_left_pos, y + 0.5);
            context.lineTo(_right_pos, y + 0.5);
            context.stroke();
            context.beginPath();
            if (null != this.MouseTrackCommonImage) {
                context.drawImage(this.MouseTrackCommonImage, 0, 0, (this.MouseTrackCommonImage.width + 1) >> 1, this.MouseTrackCommonImage.height, _left_pos - this.MouseTrackCommonImage.width, y - (this.MouseTrackCommonImage.height >> 1), (this.MouseTrackCommonImage.width + 1) >> 1, this.MouseTrackCommonImage.height);
                context.drawImage(this.MouseTrackCommonImage, this.MouseTrackCommonImage.width >> 1, 0, (this.MouseTrackCommonImage.width + 1) >> 1, this.MouseTrackCommonImage.height, _right_pos + (this.MouseTrackCommonImage.width >> 1), y - (this.MouseTrackCommonImage.height >> 1), (this.MouseTrackCommonImage.width + 1) >> 1, this.MouseTrackCommonImage.height);
            }
        }
    };
    this.FocusRectDraw = function (ctx, x, y, r, b) {
        ctx.rect(x - this.const_border_w, y, r - x + this.const_border_w, b - y);
    };
    this.FocusRectFlat = function (_color, ctx, x, y, r, b) {
        ctx.beginPath();
        ctx.strokeStyle = _color;
        ctx.lineWidth = 2;
        ctx.rect(x - 2, y - 2, r - x + 4, b - y + 4);
        ctx.stroke();
        ctx.beginPath();
        if (true) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#FFFFFF";
            ctx.rect(x - 0.5, y - 0.5, r - x + 1, b - y + 1);
            ctx.stroke();
            ctx.beginPath();
        }
    };
    this.onCheckUpdate = function () {
        if (!this.m_bIsVisible || 0 == this.DigitWidths.length) {
            return;
        }
        if (this.m_oWordControl.m_oApi.isSaveFonts_Images) {
            return;
        }
        if (this.m_lDrawingFirst == -1 || this.m_lDrawingEnd == -1) {
            if (this.m_oWordControl.m_oDrawingDocument.IsEmptyPresentation) {
                if (!this.bIsEmptyDrawed) {
                    this.bIsEmptyDrawed = true;
                    this.OnPaint();
                }
                return;
            }
            this.bIsEmptyDrawed = false;
            return;
        }
        this.bIsEmptyDrawed = false;
        if (!this.m_bIsUpdate) {
            for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
                var page = this.m_arrPages[i];
                if (null == page.cachedImage || page.IsRecalc) {
                    this.m_bIsUpdate = true;
                    break;
                }
                if ((page.cachedImage.image.width != (page.right - page.left)) || (page.cachedImage.image.height != (page.bottom - page.top))) {
                    this.m_bIsUpdate = true;
                    break;
                }
            }
        }
        if (!this.m_bIsUpdate) {
            return;
        }
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
            var page = this.m_arrPages[i];
            var w = page.right - page.left;
            var h = page.bottom - page.top;
            if (null != page.cachedImage) {
                if ((page.cachedImage.image.width != w) || (page.cachedImage.image.height != h) || page.IsRecalc) {
                    this.m_oCacheManager.UnLock(page.cachedImage);
                    page.cachedImage = null;
                }
            }
            if (null == page.cachedImage) {
                page.cachedImage = this.m_oCacheManager.Lock(w, h);
                var g = new CGraphics();
                g.IsNoDrawingEmptyPlaceholder = true;
                g.IsThumbnail = true;
                g.init(page.cachedImage.image.ctx, w, h, this.SlideWidth, this.SlideHeight);
                g.m_oFontManager = this.m_oFontManager;
                g.transform(1, 0, 0, 1, 0, 0);
                var bIsShowPars = this.m_oWordControl.m_oApi.ShowParaMarks;
                this.m_oWordControl.m_oApi.ShowParaMarks = false;
                this.m_oWordControl.m_oLogicDocument.DrawPage(i, g);
                this.m_oWordControl.m_oApi.ShowParaMarks = bIsShowPars;
                page.IsRecalc = false;
                this.m_bIsUpdate = true;
                break;
            }
        }
        this.OnPaint();
        this.m_bIsUpdate = false;
    };
    this.SetFocusElement = function (type) {
        switch (type) {
        case FOCUS_OBJECT_MAIN:
            this.FocusObjType = FOCUS_OBJECT_MAIN;
            break;
        case FOCUS_OBJECT_THUMBNAILS:
            if (this.LockMainObjType) {
                return;
            }
            this.FocusObjType = FOCUS_OBJECT_THUMBNAILS;
            this.m_oWordControl.m_oLogicDocument.resetStateCurSlide(true);
            break;
        case FOCUS_OBJECT_NOTES:
            break;
        default:
            break;
        }
    };
    this.GetSelectedSlidesRange = function () {
        var _min = this.m_oWordControl.m_oDrawingDocument.SlideCurrent;
        var _max = _min;
        var pages_count = this.m_arrPages.length;
        for (var i = 0; i < pages_count; i++) {
            if (this.m_arrPages[i].IsSelected) {
                if (i < _min) {
                    _min = i;
                }
                if (i > _max) {
                    _max = i;
                }
            }
        }
        return {
            Min: _min,
            Max: _max
        };
    };
    this.GetSelectedArray = function () {
        var _array = [];
        var pages_count = this.m_arrPages.length;
        for (var i = 0; i < pages_count; i++) {
            if (this.m_arrPages[i].IsSelected) {
                _array[_array.length] = i;
            }
        }
        return _array;
    };
    this.CorrectShiftSelect = function (isTop, isEnd) {
        var drDoc = this.m_oWordControl.m_oDrawingDocument;
        var slidesCount = drDoc.SlidesCount;
        var min_max = this.GetSelectedSlidesRange();
        var _page = this.m_oWordControl.m_oDrawingDocument.SlideCurrent;
        if (isEnd) {
            _page = isTop ? 0 : slidesCount - 1;
        } else {
            if (isTop) {
                if (min_max.Min != _page) {
                    _page = min_max.Min - 1;
                    if (_page < 0) {
                        _page = 0;
                    }
                } else {
                    _page = min_max.Max - 1;
                    if (_page < 0) {
                        _page = 0;
                    }
                }
            } else {
                if (min_max.Min != _page) {
                    _page = min_max.Min + 1;
                    if (_page >= slidesCount) {
                        _page = slidesCount - 1;
                    }
                } else {
                    _page = min_max.Max + 1;
                    if (_page >= slidesCount) {
                        _page = slidesCount - 1;
                    }
                }
            }
        }
        var _max = _page;
        var _min = this.m_oWordControl.m_oDrawingDocument.SlideCurrent;
        if (_min > _max) {
            var _temp = _max;
            _max = _min;
            _min = _temp;
        }
        for (var i = 0; i < _min; i++) {
            this.m_arrPages[i].IsSelected = false;
        }
        for (var i = _min; i <= _max; i++) {
            this.m_arrPages[i].IsSelected = true;
        }
        for (var i = _max + 1; i < slidesCount; i++) {
            this.m_arrPages[i].IsSelected = false;
        }
        this.OnUpdateOverlay();
        this.ShowPage(_page);
    };
    this.onKeyDown = function (e) {
        var control = oThis.m_oWordControl.m_oThumbnails.HtmlElement;
        if (global_mouseEvent.IsLocked == true && global_mouseEvent.Sender == control) {
            e.preventDefault();
            return false;
        }
        check_KeyboardEvent(e);
        switch (global_keyboardEvent.KeyCode) {
        case 13:
            if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                var _selected_thumbnails = this.GetSelectedArray();
                if (_selected_thumbnails.length > 0) {
                    var _last_selected_slide_num = _selected_thumbnails[_selected_thumbnails.length - 1];
                    this.m_oWordControl.GoToPage(_last_selected_slide_num);
                    this.m_oWordControl.m_oLogicDocument.addNextSlide();
                    return false;
                }
            }
            break;
        case 46:
            case 8:
            if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                var _delete_array = this.GetSelectedArray();
                if (!this.m_oWordControl.m_oApi.IsSupportEmptyPresentation) {
                    if (_delete_array.length == this.m_oWordControl.m_oDrawingDocument.SlidesCount) {
                        _delete_array.splice(0, 1);
                    }
                }
                if (_delete_array.length != 0) {
                    this.m_oWordControl.m_oLogicDocument.deleteSlides(_delete_array);
                }
                if (0 == this.m_oWordControl.m_oLogicDocument.Slides.length) {
                    this.m_bIsUpdate = true;
                }
            }
            break;
        case 34:
            case 40:
            if (global_keyboardEvent.CtrlKey && global_keyboardEvent.ShiftKey) {
                if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                    var _presentation = this.m_oWordControl.m_oLogicDocument;
                    History.Create_NewPoint(historydescription_Presentation_MoveSlidesToEnd);
                    var _selection_array = this.GetSelectedArray();
                    _presentation.moveSlides(_selection_array, _presentation.Slides.length);
                    _presentation.Recalculate();
                    _presentation.Document_UpdateInterfaceState();
                }
            } else {
                if (global_keyboardEvent.CtrlKey) {
                    if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                        _presentation = this.m_oWordControl.m_oLogicDocument;
                        var _selected_array = this.GetSelectedArray();
                        var can_move = false,
                        first_index;
                        for (var i = _selected_array.length - 1; i > -1; i--) {
                            if (i === _selected_array.length - 1) {
                                if (_selected_array[i] < _presentation.Slides.length - 1) {
                                    can_move = true;
                                    first_index = i;
                                    break;
                                }
                            } else {
                                if (Math.abs(_selected_array[i] - _selected_array[i + 1]) > 1) {
                                    can_move = true;
                                    first_index = i;
                                    break;
                                }
                            }
                        }
                        if (can_move) {
                            History.Create_NewPoint(historydescription_Presentation_MoveSlidesNextPos);
                            for (var i = first_index; i > -1; --i) {
                                _presentation.moveSlides([_selected_array[i]], _selected_array[i] + 2);
                            }
                            _presentation.Recalculate();
                            _presentation.Document_UpdateInterfaceState();
                        }
                    }
                }
            }
            var drDoc = this.m_oWordControl.m_oDrawingDocument;
            var slidesCount = drDoc.SlidesCount;
            if (!global_keyboardEvent.ShiftKey) {
                if (drDoc.SlideCurrent < (slidesCount - 1)) {
                    this.m_oWordControl.GoToPage(drDoc.SlideCurrent + 1);
                }
            } else {
                if (global_keyboardEvent.CtrlKey) {
                    if (drDoc.SlidesCount > 0) {
                        this.m_oWordControl.GoToPage(drDoc.SlidesCount - 1);
                    }
                } else {
                    this.CorrectShiftSelect(false, false);
                }
            }
            break;
        case 36:
            var drDoc = this.m_oWordControl.m_oDrawingDocument;
            if (!global_keyboardEvent.ShiftKey) {
                if (drDoc.SlideCurrent > 0) {
                    this.m_oWordControl.GoToPage(0);
                }
            } else {
                this.CorrectShiftSelect(true, true);
            }
            break;
        case 35:
            var drDoc = this.m_oWordControl.m_oDrawingDocument;
            var slidesCount = drDoc.SlidesCount;
            if (!global_keyboardEvent.ShiftKey) {
                if (drDoc.SlideCurrent != (slidesCount - 1)) {
                    this.m_oWordControl.GoToPage(slidesCount - 1);
                }
            } else {
                this.CorrectShiftSelect(false, true);
            }
            break;
        case 65:
            if (global_keyboardEvent.CtrlKey) {
                var drDoc = this.m_oWordControl.m_oDrawingDocument;
                var slidesCount = drDoc.SlidesCount;
                for (var i = 0; i < slidesCount; i++) {
                    this.m_arrPages[i].IsSelected = true;
                }
                this.OnUpdateOverlay();
            }
            break;
        case 89:
            if (global_keyboardEvent.CtrlKey) {
                return true;
            }
            break;
        case 90:
            if (global_keyboardEvent.CtrlKey) {
                return true;
            }
            break;
        case 88:
            if (global_keyboardEvent.CtrlKey) {
                var doc = editor.WordControl.m_oLogicDocument;
                if (this.m_oWordControl.m_oLogicDocument.viewMode === true || doc.Document_Is_SelectionLocked(changestype_RemoveSlide) === false) {
                    Editor_Copy(editor, this.m_oWordControl.m_oLogicDocument.viewMode === false);
                    return undefined;
                }
            }
            break;
        case 86:
            if (global_keyboardEvent.CtrlKey) {
                if (!window.GlobalPasteFlag) {
                    if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                        if (!window.USER_AGENT_SAFARI_MACOS) {
                            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Presentation_PasteOnThumbnails);
                            window.GlobalPasteFlag = true;
                            editor.waitSave = true;
                            Editor_Paste(this.m_oWordControl.m_oApi, true);
                            return undefined;
                        } else {
                            if (0 === window.GlobalPasteFlagCounter) {
                                this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Presentation_PasteOnThumbnailsSafari);
                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                editor.waitSave = true;
                                Editor_Paste(this.m_oWordControl.m_oApi, true);
                                return undefined;
                            }
                        }
                    }
                } else {
                    if (window.USER_AGENT_SAFARI_MACOS) {
                        return undefined;
                    }
                }
            }
            break;
        case 67:
            if (global_keyboardEvent.CtrlKey) {
                Editor_Copy(editor);
                return undefined;
            }
            break;
        case 77:
            if (global_keyboardEvent.CtrlKey) {
                if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                    var _selected_thumbnails = this.GetSelectedArray();
                    if (_selected_thumbnails.length > 0) {
                        var _last_selected_slide_num = _selected_thumbnails[_selected_thumbnails.length - 1];
                        this.m_oWordControl.GoToPage(_last_selected_slide_num);
                        this.m_oWordControl.m_oLogicDocument.addNextSlide();
                        return false;
                    }
                }
            }
            break;
        case 68:
            if (global_keyboardEvent.CtrlKey) {
                if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                    editor.DublicateSlide();
                    return false;
                }
            }
            break;
        case 33:
            case 38:
            if (global_keyboardEvent.CtrlKey && global_keyboardEvent.ShiftKey) {
                if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                    var _presentation = this.m_oWordControl.m_oLogicDocument;
                    History.Create_NewPoint(historydescription_Presentation_MoveSlidesToStart);
                    var _selection_array = this.GetSelectedArray();
                    _presentation.moveSlides(_selection_array, 0);
                    _presentation.Recalculate();
                    _presentation.Document_UpdateInterfaceState();
                }
            } else {
                if (global_keyboardEvent.CtrlKey) {
                    if (this.m_oWordControl.m_oLogicDocument.viewMode === false) {
                        _presentation = this.m_oWordControl.m_oLogicDocument;
                        var _selected_array = this.GetSelectedArray();
                        var can_move = false,
                        first_index;
                        for (var i = 0; i < _selected_array.length; ++i) {
                            if (i === 0) {
                                if (_selected_array[i] > 0) {
                                    can_move = true;
                                    first_index = i;
                                    break;
                                }
                            } else {
                                if (Math.abs(_selected_array[i] - _selected_array[i - 1]) > 1) {
                                    can_move = true;
                                    first_index = i;
                                    break;
                                }
                            }
                        }
                        if (can_move) {
                            History.Create_NewPoint(historydescription_Presentation_MoveSlidesPrevPos);
                            for (var i = first_index; i > -1; --i) {
                                _presentation.moveSlides([_selected_array[i]], _selected_array[i] - 1);
                            }
                            _presentation.Recalculate();
                            _presentation.Document_UpdateInterfaceState();
                        }
                    }
                }
            }
            var drDoc = this.m_oWordControl.m_oDrawingDocument;
            var slidesCount = drDoc.SlidesCount;
            if (!global_keyboardEvent.ShiftKey) {
                if (drDoc.SlideCurrent > 0) {
                    this.m_oWordControl.GoToPage(drDoc.SlideCurrent - 1);
                }
            } else {
                if (global_keyboardEvent.CtrlKey) {
                    if (drDoc.SlidesCount > 0) {
                        this.m_oWordControl.GoToPage(0);
                    }
                } else {
                    this.CorrectShiftSelect(true, false);
                }
            }
            break;
        case 80:
            if (global_keyboardEvent.CtrlKey) {
                this.m_oWordControl.m_oApi.asc_Print();
            }
            break;
        case 83:
            if (global_keyboardEvent.CtrlKey) {
                this.m_oWordControl.m_oApi.asc_Save();
            }
            break;
        default:
            break;
        }
        e.preventDefault();
        return false;
    };
}
function DrawBackground(graphics, unifill, w, h) {
    if (true) {
        graphics.SetIntegerGrid(false);
        var _l = 0;
        var _t = 0;
        var _r = (0 + w);
        var _b = (0 + h);
        graphics._s();
        graphics._m(_l, _t);
        graphics._l(_r, _t);
        graphics._l(_r, _b);
        graphics._l(_l, _b);
        graphics._z();
        graphics.b_color1(255, 255, 255, 255);
        graphics.df();
        graphics._e();
    }
    if (unifill == null || unifill.fill == null) {
        return;
    }
    graphics.SetIntegerGrid(false);
    var _shape = {};
    _shape.brush = unifill;
    _shape.pen = null;
    _shape.TransformMatrix = new CMatrix();
    _shape.extX = w;
    _shape.extY = h;
    _shape.check_bounds = function (checker) {
        checker._s();
        checker._m(0, 0);
        checker._l(this.extX, 0);
        checker._l(this.extX, this.extY);
        checker._l(0, this.extY);
        checker._z();
        checker._e();
    };
    var shape_drawer = new CShapeDrawer();
    shape_drawer.fromShape2(_shape, graphics, null);
    shape_drawer.draw(null);
}
function CSlideDrawer() {
    this.m_oWordControl = null;
    this.CONST_MAX_SLIDE_CACHE_SIZE = 104857600;
    this.CONST_BORDER = 10;
    this.IsCached = false;
    this.CachedCanvas = null;
    this.CachedCanvasCtx = null;
    this.BoundsChecker = new CSlideBoundsChecker();
    this.bIsEmptyPresentation = false;
    this.IsRecalculateSlide = false;
    this.SlideEps = 20;
    this.CheckRecalculateSlide = function () {
        if (this.IsRecalculateSlide) {
            this.IsRecalculateSlide = false;
            this.m_oWordControl.m_oDrawingDocument.FirePaint();
        }
    };
    this.CheckSlide = function (slideNum) {
        if (this.m_oWordControl.m_oApi.isSaveFonts_Images) {
            this.IsRecalculateSlide = true;
            return;
        }
        this.IsRecalculateSlide = false;
        this.bIsEmptyPresentation = false;
        if (-1 == slideNum) {
            this.bIsEmptyPresentation = true;
        }
        var dKoef = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
        if (this.m_oWordControl.bIsRetinaSupport) {
            dKoef *= 2;
        }
        var w_mm = this.m_oWordControl.m_oLogicDocument.Width;
        var h_mm = this.m_oWordControl.m_oLogicDocument.Height;
        var w_px = (w_mm * dKoef) >> 0;
        var h_px = (h_mm * dKoef) >> 0;
        this.BoundsChecker.init(w_px, h_px, w_mm, h_mm);
        this.BoundsChecker.transform(1, 0, 0, 1, 0, 0);
        if (this.bIsEmptyPresentation) {
            this.BoundsChecker._s();
            this.BoundsChecker._m(0, 0);
            this.BoundsChecker._l(w_mm, 0);
            this.BoundsChecker._l(w_mm, h_mm);
            this.BoundsChecker._l(0, h_mm);
            this.BoundsChecker._z();
            return;
        }
        this.m_oWordControl.m_oLogicDocument.DrawPage(slideNum, this.BoundsChecker);
        var bIsResize = this.m_oWordControl.CheckCalculateDocumentSize(this.BoundsChecker.Bounds);
        if (true) {
            dKoef = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
            if (this.m_oWordControl.bIsRetinaSupport) {
                dKoef *= 2;
            }
            w_mm = this.m_oWordControl.m_oLogicDocument.Width;
            h_mm = this.m_oWordControl.m_oLogicDocument.Height;
            w_px = (w_mm * dKoef) >> 0;
            h_px = (h_mm * dKoef) >> 0;
        }
        var _need_pix_width = this.BoundsChecker.Bounds.max_x - this.BoundsChecker.Bounds.min_x + 1 + 2 * this.SlideEps;
        var _need_pix_height = this.BoundsChecker.Bounds.max_y - this.BoundsChecker.Bounds.min_y + 1 + 2 * this.SlideEps;
        this.IsCached = false;
        if (4 * _need_pix_width * _need_pix_height < this.CONST_MAX_SLIDE_CACHE_SIZE) {
            this.IsCached = true;
        }
        if (this.IsCached) {
            var _need_reinit_image = false;
            if (null == this.CachedCanvas) {
                _need_reinit_image = true;
            } else {
                if (this.CachedCanvas.width < _need_pix_width || this.CachedCanvas.height < _need_pix_height) {
                    _need_reinit_image = true;
                }
            }
            if (_need_reinit_image) {
                this.CachedCanvas = null;
                this.CachedCanvas = document.createElement("canvas");
                this.CachedCanvas.width = _need_pix_width + 100;
                this.CachedCanvas.height = _need_pix_height + 100;
                this.CachedCanvasCtx = this.CachedCanvas.getContext("2d");
            } else {
                this.CachedCanvasCtx.clearRect(0, 0, _need_pix_width, _need_pix_height);
            }
            var g = new CGraphics();
            g.init(this.CachedCanvasCtx, w_px, h_px, w_mm, h_mm);
            g.m_oFontManager = g_fontManager;
            if (this.m_oWordControl.bIsRetinaSupport) {
                g.IsRetina = true;
            }
            g.m_oCoordTransform.tx = -this.BoundsChecker.Bounds.min_x + this.SlideEps;
            g.m_oCoordTransform.ty = -this.BoundsChecker.Bounds.min_y + this.SlideEps;
            g.transform(1, 0, 0, 1, 0, 0);
            if (this.m_oWordControl.m_oApi.isViewMode) {
                g.IsNoDrawingEmptyPlaceholderText = true;
            }
            this.m_oWordControl.m_oLogicDocument.DrawPage(slideNum, g);
        } else {
            if (null != this.CachedCanvas) {
                this.CachedCanvas = null;
                this.CachedCanvasCtx = null;
            }
        }
    };
    this.DrawSlide = function (outputCtx, scrollX, scrollX_max, scrollY, scrollY_max, slideNum) {
        var _rect = this.m_oWordControl.m_oDrawingDocument.SlideCurrectRect;
        var _bounds = this.BoundsChecker.Bounds;
        var _x = _rect.left + _bounds.min_x;
        var _y = _rect.top + _bounds.min_y;
        if (this.m_oWordControl.bIsRetinaSupport) {
            _x = (_rect.left << 1) + _bounds.min_x;
            _y = (_rect.top << 1) + _bounds.min_y;
        }
        if (this.bIsEmptyPresentation) {
            var w_px = _bounds.max_x - _bounds.min_x + 1;
            var h_px = _bounds.max_y - _bounds.min_y + 1;
            outputCtx.lineWidth = 1;
            outputCtx.strokeStyle = "#000000";
            outputCtx.beginPath();
            this.m_oWordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDashClever(outputCtx, _x >> 0, _y >> 0, (_x + w_px) >> 0, (_y + h_px) >> 0, 2, 2, true);
            outputCtx.beginPath();
            return;
        }
        if (this.IsCached) {
            var w_px = (_bounds.max_x - _bounds.min_x + 1 + 2 * this.SlideEps) >> 0;
            var h_px = (_bounds.max_y - _bounds.min_y + 1 + 2 * this.SlideEps) >> 0;
            if (w_px > this.CachedCanvas.width) {
                w_px = this.CachedCanvas.width;
            }
            if (h_px > this.CachedCanvas.height) {
                h_px = this.CachedCanvas.height;
            }
            outputCtx.drawImage(this.CachedCanvas, 0, 0, w_px, h_px, (_x >> 0) - this.SlideEps, (_y >> 0) - this.SlideEps, w_px, h_px);
        } else {
            var dKoef = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
            if (this.m_oWordControl.bIsRetinaSupport) {
                dKoef *= 2;
            }
            var w_mm = this.m_oWordControl.m_oLogicDocument.Width;
            var h_mm = this.m_oWordControl.m_oLogicDocument.Height;
            var w_px = (w_mm * dKoef) >> 0;
            var h_px = (h_mm * dKoef) >> 0;
            var g = new CGraphics();
            g.init(outputCtx, w_px, h_px, w_mm, h_mm);
            g.m_oFontManager = g_fontManager;
            if (this.m_oWordControl.bIsRetinaSupport) {
                g.IsRetina = true;
            }
            g.m_oCoordTransform.tx = _x - _bounds.min_x;
            g.m_oCoordTransform.ty = _y - _bounds.min_y;
            g.transform(1, 0, 0, 1, 0, 0);
            if (this.m_oWordControl.m_oApi.isViewMode) {
                g.IsNoDrawingEmptyPlaceholderText = true;
            }
            this.m_oWordControl.m_oLogicDocument.DrawPage(slideNum, g);
        }
    };
}
window.g_comment_image = new Image();
window.g_comment_image.asc_complete = false;
window.g_comment_image.onload = function () {
    window.g_comment_image.asc_complete = true;
};
window.g_comment_image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAAAlCAMAAABI6s09AAAABGdBTUEAALGPC/xhBQAAAMBQTFRF2Ypk03pP0nZJ1oNb68Ku03hL1X9U7MWy1X9V9d7T3JNv5bCW0nZJ9uXc////8dPE+vDq5rSb5a6U4aOF5K6T2Idg////1HxR6r6o03lN0nZJ6Lef+u7p8NDA0ndK////78++0nZJ8dPE////0nZJ1HtP2Ihh////03hM////////3JVy0nZJ0nZJ9+Xc0nZJ////3JVy3JVx////////AAAA3Zh38tbJ3ZZ08dXH4qaJ5a6U9N3R+/Tw////0nZJQeZHfgAAADZ0Uk5TZJaoUk+v3lzdEi9hDlIbKVN8eY54xTTnc/NKegRg9EJm8WQz7+3EFPYoSKborlkmCqeoJ00ATKvZ0wAAA3tJREFUaN7dmOdi2jAUhelukjaQkkGCGIHYbDAYNYOh93+r2mZIsq6WwVHD+RfukWx93OtjUsCxHoaE0fAB7yWvHFCcjB6JRI+jCc7kzMVfSEzD5zWj5yFdPuSXDLm9C7/nVOMyX5SvnDwRhZ4mWZz5+Dd0yJoToevTK7jNLxHzByryRYZcqemzK0fkbbWWaPVGRqxTqVH6tJ8/XbBfGPPVjVtlT/Tr9t/ToZ+l6bR2l2hxdITJQfLil6/syjqRwonwkDrrVKqePu15fy5XWfTr9s/eO+I0EvlYnRFuz7VCRHF1ZSdHavfOEIaEUHBZE/0XJbjTmuWfyf7Ze0ckqjgWeh86AVaoKPrlrVb6ztGx7h2RKLesRa8UUcUiHei0MJ2KePMVgY4+rQJj/7fzy0YZ6h2AzuacTYCOee8cRKcq0qmm78YgrZCNH/1w2zvHnSyTHOT9mjQsUjreK7vbq0d38fhVnqp3PFXvePnSMclB3q9Jw4DS+XNHFvHuq0X82d013SWqMGIrwjSia6B3dgPJrczhuWNC3Io7onQ6jfk0wrNazOJLNzp0l7iS2IWK0Duoo+gdbmUOz52j08GUTqQwwrOYhkAShjEesSKfRuVA5jRZJsTTO1fgMK8AdHA4+AvCiSsAHMU0KgfyP6JThelUITo4rIaS9yiwIp/GTXGW3NsUKEInUdGpAE+cd56s+EjS10xJRT6N8oHMQOdqzOjKFR17yadxgwcufsTnTjY80mlUFD/kcyeTOhmKXfWbW5d1KtW1nKyu5WR1D6WTRb76rd9nnUr5lnR8Szq+Czq1+/j6L0t698sXel/3tbRTJtZp8KT/5dWUz51Kmo5Xc0Gn3bxJRmaPZ8kMy02zLTrBseKcJnRabZ4Ol4VCGnp+q+2CTpD802m2x7Pc/k7ZqB8ATiqJ02CyEO/XTVa8vws6OLjtM3g4OP3bAHSKcHinCR3er6PTbwfYCZ1EvS2eBE5P69zB6R2agzZp6I7OFo8eDoNH7jTPQZs0dEgnOvRUfWQLp3kO2qShSzo4jA89nYdHcJrnoE0aOqUTHXpgBEfvNM9B1j9goQxEv1s60aHN4Oid5jnI+gcQHOp3TAeH4TGd5jm470gKB9jfNR1nOZjCA8I5NToWOcjhgeGcHB2LHGTwSOCcHh2LHNz7ZXBOkI5FDmr9J0jHIgd1/n8LiumvxDAoYwAAAABJRU5ErkJggg==";
var g_comment_image_offsets = [[5, 0, 16, 15], [31, 0, 16, 15], [57, 0, 19, 18], [86, 0, 19, 18], [115, 0, 32, 30], [157, 0, 32, 30], [199, 0, 38, 36], [247, 0, 38, 36]];