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
function MasterSlide(presentation, theme) {
    this.cSld = new CSld();
    this.clrMap = new ClrMap();
    this.hf = new HF();
    this.sldLayoutLst = [];
    this.txStyles = null;
    this.preserve = false;
    this.ImageBase64 = "";
    this.Width64 = 0;
    this.Height64 = 0;
    this.ThemeIndex = 0;
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;
    this.Width = 254;
    this.Height = 190.5;
    this.recalcInfo = {};
    this.DrawingDocument = editor.WordControl.m_oDrawingDocument;
    this.maxId = 1000;
    this.presentation = editor.WordControl.m_oLogicDocument;
    this.theme = theme;
    this.kind = MASTER_KIND;
    this.recalcInfo = {
        recalculateBackground: true,
        recalculateSpTree: true
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
MasterSlide.prototype = {
    addLayout: function (layout) {
        this.addToSldLayoutLstToPos(this.sldLayoutLst.length, layout);
    },
    getObjectType: function () {
        return historyitem_type_SlideMaster;
    },
    setThemeIndex: function (index) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetThemeIndex,
            oldPr: this.ThemeIndex,
            newPr: index
        });
        this.ThemeIndex = index;
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SlideMasterSetSize:
            this.Width = data.oldW;
            this.Height = data.oldH;
            break;
        case historyitem_SlideMasterSetThemeIndex:
            this.ThemeIndex = data.oldPr;
            break;
        case historyitem_SlideMasterAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
            break;
        case historyitem_SlideMasterSetTheme:
            this.Theme = data.oldPr;
            break;
        case historyitem_SlideMasterSetBg:
            this.cSld.Bg = data.oldPr;
            break;
        case historyitem_SlideMasterSetTxStyles:
            this.txStyles = data.oldPr;
            break;
        case historyitem_SlideMasterSetCSldName:
            this.cSld.name = data.oldPr;
            break;
        case historyitem_SlideMasterSetClrMapOverride:
            this.clrMap = data.oldPr;
            break;
        case historyitem_SlideMasterAddLayout:
            this.sldLayoutLst.splice(data.Pos, 1);
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SlideMasterSetSize:
            this.Width = data.newW;
            this.Height = data.newH;
            break;
        case historyitem_SlideMasterSetThemeIndex:
            this.ThemeIndex = data.newPr;
            break;
        case historyitem_SlideMasterAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 0, data.Item);
            break;
        case historyitem_SlideMasterSetTheme:
            this.Theme = data.newPr;
            break;
        case historyitem_SlideMasterSetBg:
            this.cSld.Bg = data.newPr;
            break;
        case historyitem_SlideMasterSetTxStyles:
            this.txStyles = data.newPr;
            break;
        case historyitem_SlideMasterSetCSldName:
            this.cSld.name = data.newPr;
            break;
        case historyitem_SlideMasterSetClrMapOverride:
            this.clrMap = data.newPr;
            break;
        case historyitem_SlideMasterAddLayout:
            this.sldLayoutLst.splice(data.Pos, 0, data.Item);
            break;
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_SlideMaster);
        w.WriteString2(this.Id);
        writeObject(w, this.theme);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
        this.theme = readObject(r);
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SlideMasterSetSize:
            writeDouble(w, data.newW);
            writeDouble(w, data.newH);
            break;
        case historyitem_SlideMasterAddToSpTree:
            case historyitem_SlideMasterAddLayout:
            writeLong(w, data.Pos);
            writeObject(w, data.Item);
            break;
        case historyitem_SlideMasterSetBg:
            case historyitem_SlideMasterSetTxStyles:
            data.newPr.Write_ToBinary(w);
            break;
        case historyitem_SlideMasterSetCSldName:
            writeString(w, data.newPr);
            break;
        case historyitem_SlideMasterSetTheme:
            case historyitem_SlideMasterSetClrMapOverride:
            writeObject(w, data.newPr);
            break;
        case historyitem_SlideMasterSetThemeIndex:
            writeLong(w, data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_SlideMasterSetSize:
            this.Width = readDouble(r);
            this.Height = readDouble(r);
            break;
        case historyitem_SlideMasterAddToSpTree:
            var Pos = readLong(r);
            var Item = readObject(r);
            this.cSld.spTree.splice(Pos, 0, Item);
            break;
        case historyitem_SlideMasterSetTheme:
            this.Theme = readObject(r);
            break;
        case historyitem_SlideMasterSetBg:
            this.cSld.Bg = new CBg();
            this.cSld.Bg.Read_FromBinary(r);
            var Fill;
            if (this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill) {
                Fill = this.cSld.Bg.bgPr.Fill;
            }
            if (typeof CollaborativeEditing !== "undefined") {
                if (Fill && Fill.fill && Fill.fill.type === FILL_TYPE_BLIP && typeof Fill.fill.RasterImageId === "string" && Fill.fill.RasterImageId.length > 0) {
                    var full_image_src_func;
                    if (typeof _getFullImageSrc === "function") {
                        full_image_src_func = _getFullImageSrc;
                    }
                    if (full_image_src_func) {
                        CollaborativeEditing.Add_NewImage(full_image_src_func(Fill.fill.RasterImageId));
                    }
                }
            }
            break;
        case historyitem_SlideMasterSetTxStyles:
            this.txStyles = new CTextStyles();
            this.txStyles.Read_FromBinary(r);
            break;
        case historyitem_SlideMasterSetCSldName:
            this.cSld.name = readString(r);
            break;
        case historyitem_SlideMasterSetClrMapOverride:
            this.clrMap = readObject(r);
            break;
        case historyitem_SlideMasterAddLayout:
            var Pos = readLong(r);
            var Item = readObject(r);
            this.sldLayoutLst.splice(Pos, 0, Item);
            break;
        case historyitem_SlideMasterSetThemeIndex:
            this.ThemeIndex = readLong(r);
            if (isRealNumber(this.ThemeIndex) && editor && editor.ThemeLoader) {
                var theme_loader = editor.ThemeLoader;
                var theme_load_info = new CThemeLoadInfo();
                theme_load_info.Master = this;
                theme_load_info.Theme = this.Theme;
                var _lay_cnt = this.sldLayoutLst.length;
                for (var i = 0; i < _lay_cnt; i++) {
                    theme_load_info.Layouts[i] = this.sldLayoutLst[i];
                }
                theme_loader.themes_info_editor[this.ThemeIndex] = theme_load_info;
            }
            break;
        }
    },
    draw: function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].draw(graphics);
            }
        }
    },
    getMatchingLayout: function (type, matchingName, cSldName, themeFlag) {
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
    },
    getMatchingShape: Slide.prototype.getMatchingShape,
    recalculate: function () {
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (!_shapes[_shape_index].isPlaceholder()) {
                _shapes[_shape_index].recalculate();
            }
        }
    },
    checkSlideSize: Slide.prototype.checkSlideSize,
    checkDrawingUniNvPr: Slide.prototype.checkDrawingUniNvPr,
    checkSlideColorScheme: function () {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].handleUpdateFill();
                this.cSld.spTree[i].handleUpdateLn();
            }
        }
    },
    setSlideSize: function (w, h) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetSize,
            oldW: this.Width,
            oldH: this.Height,
            newW: w,
            newH: h
        });
        this.Width = w;
        this.Height = h;
    },
    changeSize: Slide.prototype.changeSize,
    setTheme: function (theme) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetTheme,
            oldPr: this.Theme,
            newPr: theme
        });
        this.Theme = theme;
    },
    shapeAdd: function (pos, item) {
        this.checkDrawingUniNvPr(item);
        History.Add(this, {
            Type: historyitem_SlideMasterAddToSpTree,
            Pos: pos,
            Item: item
        });
        this.cSld.spTree.splice(pos, 0, item);
    },
    changeBackground: function (bg) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetBg,
            oldPr: this.cSld.Bg,
            newPr: bg
        });
        this.cSld.Bg = bg;
    },
    setTxStyles: function (txStyles) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetTxStyles,
            oldPr: this.txStyles,
            newPr: txStyles
        });
        this.txStyles = txStyles;
    },
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetCSldName,
            oldPr: this.cSld.name,
            newPr: name
        });
        this.cSld.name = name;
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SlideMasterSetClrMapOverride,
            oldPr: this.clrMap,
            newPr: clrMap
        });
        this.clrMap = clrMap;
    },
    addToSldLayoutLstToPos: function (pos, obj) {
        History.Add(this, {
            Type: historyitem_SlideMasterAddLayout,
            Item: obj,
            Pos: pos
        });
        this.sldLayoutLst.splice(pos, 0, obj);
    },
    getAllImages: function (images) {
        if (this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof CBlipFill && typeof this.cSld.Bg.bgPr.Fill.fill.RasterImageId === "string") {
            images[_getFullImageSrc(this.cSld.Bg.bgPr.Fill.fill.RasterImageId)] = true;
        }
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (typeof this.cSld.spTree[i].getAllImages === "function") {
                this.cSld.spTree[i].getAllImages(images);
            }
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    Refresh_RecalcData: function () {},
    getAllFonts: function (fonts) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (typeof this.cSld.spTree[i].getAllFonts === "function") {
                this.cSld.spTree[i].getAllFonts(fonts);
            }
        }
    }
};
function CMasterThumbnailDrawer() {
    this.CanvasImage = null;
    this.IsRetina = false;
    this.WidthMM = 0;
    this.HeightMM = 0;
    this.WidthPx = 0;
    this.HeightPx = 0;
    this.DrawingDocument = null;
    this.GetThumbnail = function (_master, use_background, use_master_shapes) {
        var h_px = 38;
        var w_px = 85;
        this.WidthPx = w_px;
        this.HeightPx = h_px;
        if (this.CanvasImage == null) {
            this.CanvasImage = document.createElement("canvas");
        }
        this.CanvasImage.width = w_px;
        this.CanvasImage.height = h_px;
        var _ctx = this.CanvasImage.getContext("2d");
        var g = new CGraphics();
        g.init(_ctx, w_px, h_px, this.WidthMM, this.HeightMM);
        g.m_oFontManager = g_fontManager;
        g.transform(1, 0, 0, 1, 0, 0);
        var dKoefPixToMM = this.HeightMM / h_px;
        var _back_fill = null;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var _layout = null;
        for (var i = 0; i < _master.sldLayoutLst.length; i++) {
            if (_master.sldLayoutLst[i].type == nSldLtTTitle) {
                _layout = _master.sldLayoutLst[i];
                break;
            }
        }
        var _theme = _master.Theme;
        if (_layout != null && _layout.cSld.Bg != null) {
            if (null != _layout.cSld.Bg.bgPr) {
                _back_fill = _layout.cSld.Bg.bgPr.Fill;
            } else {
                if (_layout.cSld.Bg.bgRef != null) {
                    _layout.cSld.Bg.bgRef.Color.Calculate(_theme, null, _layout, _master, RGBA);
                    RGBA = _layout.cSld.Bg.bgRef.Color.RGBA;
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx, _layout.cSld.Bg.bgRef.Color);
                }
            }
        } else {
            if (_master != null) {
                if (_master.cSld.Bg != null) {
                    if (null != _master.cSld.Bg.bgPr) {
                        _back_fill = _master.cSld.Bg.bgPr.Fill;
                    } else {
                        if (_master.cSld.Bg.bgRef != null) {
                            _master.cSld.Bg.bgRef.Color.Calculate(_theme, null, _layout, _master, RGBA);
                            RGBA = _master.cSld.Bg.bgRef.Color.RGBA;
                            _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx, _master.cSld.Bg.bgRef.Color);
                        }
                    }
                } else {
                    _back_fill = new CUniFill();
                    _back_fill.fill = new CSolidFill();
                    _back_fill.fill.color = new CUniColor();
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
        if (_back_fill != null) {
            _back_fill.calculate(_theme, null, _layout, _master, RGBA);
        }
        if (use_background !== false) {
            DrawBackground(g, _back_fill, this.WidthMM, this.HeightMM);
        }
        var _sx = g.m_oCoordTransform.sx;
        var _sy = g.m_oCoordTransform.sy;
        if (use_master_shapes !== false) {
            if (null == _layout) {
                _master.draw(g);
            } else {
                if (_layout.showMasterSp == true || _layout.showMasterSp == undefined) {
                    _master.draw(g);
                }
                _layout.draw(g);
            }
        }
        g.reset();
        g.SetIntegerGrid(true);
        var _color_w = 6;
        var _color_h = 3;
        var _color_x = 4;
        var _text_x = 8 * dKoefPixToMM;
        var _text_y = (h_px - 10) * dKoefPixToMM;
        var _color_y = 31;
        var _color_delta = 1;
        _ctx.beginPath();
        _ctx.fillStyle = "#FFFFFF";
        _ctx.fillRect(_color_x - _color_delta, _color_y - _color_delta, _color_w * 6 + 7 * _color_delta, 5);
        _ctx.beginPath();
        var _color = new CSchemeColor();
        for (var i = 0; i < 6; i++) {
            _ctx.beginPath();
            _color.id = i;
            _color.Calculate(_theme, null, null, _master, RGBA);
            g.b_color1(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B, 255);
            _ctx.fillRect(_color_x, _color_y, _color_w, _color_h);
            _color_x += (_color_w + _color_delta);
        }
        _ctx.beginPath();
        var _api = this.DrawingDocument.m_oWordControl.m_oApi;
        History.TurnOff();
        var _oldTurn = _api.isViewMode;
        _api.isViewMode = true;
        _color.id = 15;
        _color.Calculate(_theme, null, null, _master, RGBA);
        var _textPr1 = new CTextPr();
        _textPr1.FontFamily = {
            Name: _theme.themeElements.fontScheme.majorFont.latin,
            Index: -1
        };
        _textPr1.FontSize = 18;
        _textPr1.Color = new CDocumentColor(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B);
        var _textPr2 = new CTextPr();
        _textPr2.FontFamily = {
            Name: _theme.themeElements.fontScheme.minorFont.latin,
            Index: -1
        };
        _textPr2.FontSize = 18;
        _textPr2.Color = new CDocumentColor(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B);
        var docContent = new CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0, 1000, 1000, false, false, true);
        var par = docContent.Content[0];
        par.Cursor_MoveToStartPos();
        var _paraPr = new CParaPr();
        par.Pr = _paraPr;
        var parRun = new ParaRun(par);
        parRun.Set_Pr(_textPr1);
        parRun.Add_ToContent(0, new ParaText("A"), false);
        par.Add_ToContent(0, parRun);
        parRun = new ParaRun(par);
        parRun.Set_Pr(_textPr2);
        parRun.Add_ToContent(0, new ParaText("a"), false);
        par.Add_ToContent(1, parRun);
        par.Recalculate_Page(0);
        g.init(_ctx, w_px, h_px, w_px * g_dKoef_pix_to_mm, h_px * g_dKoef_pix_to_mm);
        g.CalculateFullTransform();
        _text_x = 8 * g_dKoef_pix_to_mm;
        _text_y = (h_px - 11) * g_dKoef_pix_to_mm;
        par.Lines[0].Ranges[0].XVisible = _text_x;
        par.Lines[0].Y = _text_y;
        var old_marks = _api.ShowParaMarks;
        _api.ShowParaMarks = false;
        par.Draw(0, g);
        _api.ShowParaMarks = old_marks;
        History.TurnOn();
        _api.isViewMode = _oldTurn;
        try {
            return this.CanvasImage.toDataURL("image/png");
        } catch(err) {
            this.CanvasImage = null;
            if (undefined === use_background && undefined === use_master_shapes) {
                return this.GetThumbnail(_master, true, false);
            } else {
                if (use_background && !use_master_shapes) {
                    return this.GetThumbnail(_master, false, false);
                }
            }
        }
        return "";
    };
}