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
function SlideLayout() {
    this.kind = LAYOUT_KIND;
    this.cSld = new CSld();
    this.clrMap = null;
    this.hf = new HF();
    this.matchingName = "";
    this.preserve = false;
    this.showMasterPhAnim = false;
    this.type = null;
    this.userDrawn = true;
    this.ImageBase64 = "";
    this.Width64 = 0;
    this.Height64 = 0;
    this.Width = 254;
    this.Height = 190.5;
    this.Master = null;
    this.maxId = 1000;
    this.recalcInfo = {
        recalculateBackground: true,
        recalculateSpTree: true
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
SlideLayout.prototype = {
    getObjectType: function () {
        return historyitem_type_SlideLayout;
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SlideLayoutSetSize:
            this.Width = data.oldW;
            this.Height = data.oldH;
            break;
        case historyitem_SlideLayoutSetMaster:
            this.Master = data.oldPr;
            break;
        case historyitem_SlideLayoutSetMatchingName:
            this.matchingName = data.oldPr;
            break;
        case historyitem_SlideLayoutSetType:
            this.type = data.oldPr;
            break;
        case historyitem_SlideLayoutSetBg:
            this.cSld.Bg = data.oldPr;
            break;
        case historyitem_SlideLayoutSetCSldName:
            this.cSld.name = data.oldPr;
            break;
        case historyitem_SlideLayoutSetShow:
            this.show = data.oldPr;
            break;
        case historyitem_SlideLayoutSetShowPhAnim:
            this.showMasterPhAnim = data.oldPr;
            break;
        case historyitem_SlideLayoutSetShowMasterSp:
            this.showMasterSp = data.oldPr;
            break;
        case historyitem_SlideLayoutSetClrMapOverride:
            this.clrMap = data.oldPr;
            break;
        case historyitem_SlideLayoutAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SlideLayoutSetSize:
            this.Width = data.newW;
            this.Height = data.newH;
            break;
        case historyitem_SlideLayoutSetMaster:
            this.Master = data.newPr;
            break;
        case historyitem_SlideLayoutSetMatchingName:
            this.matchingName = data.newPr;
            break;
        case historyitem_SlideLayoutSetType:
            this.type = data.newPr;
            break;
        case historyitem_SlideLayoutSetBg:
            this.cSld.Bg = data.newPr;
            break;
        case historyitem_SlideLayoutSetCSldName:
            this.cSld.name = data.newPr;
            break;
        case historyitem_SlideLayoutSetShow:
            this.show = data.newPr;
            break;
        case historyitem_SlideLayoutSetShowPhAnim:
            this.showMasterPhAnim = data.newPr;
            break;
        case historyitem_SlideLayoutSetShowMasterSp:
            this.showMasterSp = data.newPr;
            break;
        case historyitem_SlideLayoutSetClrMapOverride:
            this.clrMap = data.newPr;
            break;
        case historyitem_SlideLayoutAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 0, data.Item);
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SlideLayoutSetSize:
            writeDouble(w, data.newW);
            writeDouble(w, data.newH);
            break;
        case historyitem_SlideLayoutSetMaster:
            case historyitem_SlideLayoutSetClrMapOverride:
            writeObject(w, data.newPr);
            break;
        case historyitem_SlideLayoutSetMatchingName:
            case historyitem_SlideLayoutSetCSldName:
            writeString(w, data.newPr);
            break;
        case historyitem_SlideLayoutSetType:
            writeLong(w, data.newPr);
            break;
        case historyitem_SlideLayoutSetBg:
            data.newPr.Write_ToBinary(w);
            break;
        case historyitem_SlideLayoutSetShow:
            case historyitem_SlideLayoutSetShowPhAnim:
            case historyitem_SlideLayoutSetShowMasterSp:
            writeBool(w, data.newPr);
            break;
        case historyitem_SlideLayoutAddToSpTree:
            writeLong(w, data.Pos);
            writeObject(w, data.Item);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_SlideLayoutSetSize:
            this.Width = readDouble(r);
            this.Height = readDouble(r);
            break;
        case historyitem_SlideLayoutSetMaster:
            this.Master = readObject(r);
            break;
        case historyitem_SlideLayoutSetMatchingName:
            this.matchingName = readString(r);
            break;
        case historyitem_SlideLayoutSetType:
            this.type = readLong(r);
            break;
        case historyitem_SlideLayoutSetBg:
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
        case historyitem_SlideLayoutSetCSldName:
            this.cSld.name = readString(r);
            break;
        case historyitem_SlideLayoutSetShow:
            this.show = readBool(r);
            break;
        case historyitem_SlideLayoutSetShowPhAnim:
            this.showMasterPhAnim = readBool(r);
            break;
        case historyitem_SlideLayoutSetShowMasterSp:
            this.showMasterSp = readBool(r);
            break;
        case historyitem_SlideLayoutSetClrMapOverride:
            this.clrMap = readObject(r);
            break;
        case historyitem_SlideLayoutAddToSpTree:
            var Pos = readLong(r);
            var Item = readObject(r);
            this.cSld.spTree.splice(Pos, 0, Item);
            break;
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_SlideLayout);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    setMaster: function (master) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetMaster,
            oldPr: this.Master,
            newPr: master
        });
        this.Master = master;
    },
    setMatchingName: function (name) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetMatchingName,
            oldPr: this.matchingName,
            newPr: name
        });
        this.matchingName = name;
    },
    setType: function (type) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetType,
            oldPr: this.type,
            newPr: type
        });
        this.type = type;
    },
    changeBackground: function (bg) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetBg,
            oldPr: this.cSld.Bg,
            newPr: bg
        });
        this.cSld.Bg = bg;
    },
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetCSldName,
            oldPr: this.cSld.name,
            newPr: name
        });
        this.cSld.name = name;
    },
    setShow: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetShow,
            oldPr: this.show,
            newPr: bShow
        });
        this.show = bShow;
    },
    setShowPhAnim: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetShowPhAnim,
            oldPr: this.showMasterPhAnim,
            newPr: bShow
        });
        this.showMasterPhAnim = bShow;
    },
    setShowMasterSp: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetShowMasterSp,
            oldPr: this.showMasterSp,
            newPr: bShow
        });
        this.showMasterSp = bShow;
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetClrMapOverride,
            oldClrMap: this.clrMap,
            newClrMap: clrMap
        });
        this.clrMap = clrMap;
    },
    shapeAdd: function (pos, item) {
        this.checkDrawingUniNvPr(item);
        History.Add(this, {
            Type: historyitem_SlideLayoutAddToSpTree,
            Pos: pos,
            Item: item
        });
        this.cSld.spTree.splice(pos, 0, item);
    },
    setSlideSize: function (w, h) {
        History.Add(this, {
            Type: historyitem_SlideLayoutSetSize,
            oldW: this.Width,
            oldH: this.Height,
            newW: w,
            newH: h
        });
        this.Width = w;
        this.Height = h;
    },
    changeSize: Slide.prototype.changeSize,
    checkDrawingUniNvPr: Slide.prototype.checkDrawingUniNvPr,
    Get_Id: function () {
        return this.Id;
    },
    draw: function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].draw(graphics);
            }
        }
    },
    calculateType: function () {
        if (this.type !== null) {
            this.calculatedType = this.type;
            return;
        }
        var _ph_types_array = [];
        var _matchedLayoutTypes = [];
        for (var _ph_type_index = 0; _ph_type_index < 16; ++_ph_type_index) {
            _ph_types_array[_ph_type_index] = 0;
        }
        for (var _layout_type_index = 0; _layout_type_index < 36; ++_layout_type_index) {
            _matchedLayoutTypes[_layout_type_index] = false;
        }
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            _shape = _shapes[_shape_index];
            if (_shape.isPlaceholder()) {
                var _cur_type = _shape.getPhType();
                if (! (typeof(_cur_type) == "number")) {
                    _cur_type = phType_body;
                }
                if (typeof _ph_types_array[_cur_type] == "number") {
                    ++_ph_types_array[_cur_type];
                }
            }
        }
        var _weight = Math.pow(_ph_multiplier, _weight_body) * _ph_types_array[phType_body] + Math.pow(_ph_multiplier, _weight_chart) * _ph_types_array[phType_chart] + Math.pow(_ph_multiplier, _weight_clipArt) * _ph_types_array[phType_clipArt] + Math.pow(_ph_multiplier, _weight_ctrTitle) * _ph_types_array[phType_ctrTitle] + Math.pow(_ph_multiplier, _weight_dgm) * _ph_types_array[phType_dgm] + Math.pow(_ph_multiplier, _weight_media) * _ph_types_array[phType_media] + Math.pow(_ph_multiplier, _weight_obj) * _ph_types_array[phType_obj] + Math.pow(_ph_multiplier, _weight_pic) * _ph_types_array[phType_pic] + Math.pow(_ph_multiplier, _weight_subTitle) * _ph_types_array[phType_subTitle] + Math.pow(_ph_multiplier, _weight_tbl) * _ph_types_array[phType_tbl] + Math.pow(_ph_multiplier, _weight_title) * _ph_types_array[phType_title];
        for (var _index = 0; _index < 18; ++_index) {
            if (_weight >= _arr_lt_types_weight[_index] && _weight <= _arr_lt_types_weight[_index + 1]) {
                if (Math.abs(_arr_lt_types_weight[_index] - _weight) <= Math.abs(_arr_lt_types_weight[_index + 1] - _weight)) {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index]];
                    return;
                } else {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index + 1]];
                    return;
                }
            }
        }
        this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[18]];
    },
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
    recalculate2: function () {
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (_shapes[_shape_index].isPlaceholder()) {
                _shapes[_shape_index].recalculate();
            }
        }
    },
    checkSlideSize: Slide.prototype.checkSlideSize,
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
    getMatchingShape: Slide.prototype.getMatchingShape,
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
    getAllFonts: function (fonts) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (typeof this.cSld.spTree[i].getAllFonts === "function") {
                this.cSld.spTree[i].getAllFonts(fonts);
            }
        }
    },
    Refresh_RecalcData: function () {},
    Load_Comments: function (authors) {
        var _comments_count = this.writecomments.length;
        var _comments_id = [];
        var _comments_data = [];
        var _comments = [];
        for (var i = 0; i < _comments_count; i++) {
            var _wc = this.writecomments[i];
            if (0 == _wc.WriteParentAuthorId || 0 == _wc.WriteParentCommentId) {
                var commentData = new CCommentData();
                commentData.m_sText = _wc.WriteText;
                commentData.m_sUserId = ("" + _wc.WriteAuthorId);
                commentData.m_sUserName = "";
                commentData.m_sTime = _wc.WriteTime;
                for (var k in authors) {
                    if (_wc.WriteAuthorId == authors[k].Id) {
                        commentData.m_sUserName = authors[k].Name;
                        break;
                    }
                }
                if ("" != commentData.m_sUserName) {
                    _comments_id.push(_wc.WriteCommentId);
                    _comments_data.push(commentData);
                    var comment = new CComment(undefined, null);
                    comment.setPosition(_wc.x / 25.4, _wc.y / 25.4);
                    _comments.push(comment);
                }
            } else {
                var commentData = new CCommentData();
                commentData.m_sText = _wc.WriteText;
                commentData.m_sUserId = ("" + _wc.WriteAuthorId);
                commentData.m_sUserName = "";
                commentData.m_sTime = _wc.WriteTime;
                for (var k in authors) {
                    if (_wc.WriteAuthorId == authors[k].Id) {
                        commentData.m_sUserName = authors[k].Name;
                        break;
                    }
                }
                var _parent = null;
                for (var j = 0; j < _comments_data.length; j++) {
                    if ((("" + _wc.WriteParentAuthorId) == _comments_data[j].m_sUserId) && (_wc.WriteParentCommentId == _comments_id[j])) {
                        _parent = _comments_data[j];
                        break;
                    }
                }
                if (null != _parent) {
                    _parent.m_aReplies.push(commentData);
                }
            }
        }
        for (var i = 0; i < _comments.length; i++) {
            _comments[i].Set_Data(_comments_data[i]);
            this.addComment(_comments[i]);
        }
        this.writecomments = [];
    }
};
function CLayoutThumbnailDrawer() {
    this.CanvasImage = null;
    this.IsRetina = false;
    this.WidthMM = 0;
    this.HeightMM = 0;
    this.WidthPx = 0;
    this.HeightPx = 0;
    this.DrawingDocument = null;
    this.GetThumbnail = function (_layout, use_background, use_master_shapes, use_layout_shapes) {
        _layout.recalculate2();
        var h_px = 67;
        var w_px = (this.WidthMM * h_px / this.HeightMM) >> 0;
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
        var _back_fill = null;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var _master = _layout.Master;
        var _theme = _master.Theme;
        if (_layout != null) {
            if (_layout.cSld.Bg != null) {
                if (null != _layout.cSld.Bg.bgPr) {
                    _back_fill = _layout.cSld.Bg.bgPr.Fill;
                } else {
                    if (_layout.cSld.Bg.bgRef != null) {
                        _layout.cSld.Bg.bgRef.Color.Calculate(_theme, null, _layout, _master, RGBA);
                        RGBA = _layout.cSld.Bg.bgRef.Color.RGBA;
                        _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx);
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
                                _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx);
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
            if (_layout.showMasterSp == true || _layout.showMasterSp == undefined) {
                _master.draw(g);
            }
        }
        for (var i = 0; i < _layout.cSld.spTree.length; i++) {
            var _sp_elem = _layout.cSld.spTree[i];
            if (!_sp_elem.isPlaceholder()) {
                if (use_layout_shapes !== false) {
                    _sp_elem.draw(g);
                }
            } else {
                var _ph_type = _sp_elem.getPlaceholderType();
                var _usePH = true;
                switch (_ph_type) {
                case phType_dt:
                    case phType_ftr:
                    case phType_hdr:
                    case phType_sldNum:
                    _usePH = false;
                    break;
                default:
                    break;
                }
                if (!_usePH) {
                    continue;
                }
                _ctx.globalAlpha = 1;
                var _matrix = _sp_elem.transform;
                var _x = 1;
                var _y = 1;
                var _r = Math.max(_sp_elem.extX - 1, 1);
                var _b = Math.max(_sp_elem.extY - 1, 1);
                var _isIntegerGrid = g.GetIntegerGrid();
                if (!_isIntegerGrid) {
                    g.SetIntegerGrid(true);
                }
                if (_matrix) {
                    var _x1 = _sx * _matrix.TransformPointX(_x, _y);
                    var _y1 = _sy * _matrix.TransformPointY(_x, _y);
                    var _x2 = _sx * _matrix.TransformPointX(_r, _y);
                    var _y2 = _sy * _matrix.TransformPointY(_r, _y);
                    var _x3 = _sx * _matrix.TransformPointX(_x, _b);
                    var _y3 = _sy * _matrix.TransformPointY(_x, _b);
                    var _x4 = _sx * _matrix.TransformPointX(_r, _b);
                    var _y4 = _sy * _matrix.TransformPointY(_r, _b);
                    if (Math.abs(_matrix.shx) < 0.001 && Math.abs(_matrix.shy) < 0.001) {
                        _x = _x1;
                        if (_x > _x2) {
                            _x = _x2;
                        }
                        if (_x > _x3) {
                            _x = _x3;
                        }
                        _r = _x1;
                        if (_r < _x2) {
                            _r = _x2;
                        }
                        if (_r < _x3) {
                            _r = _x3;
                        }
                        _y = _y1;
                        if (_y > _y2) {
                            _y = _y2;
                        }
                        if (_y > _y3) {
                            _y = _y3;
                        }
                        _b = _y1;
                        if (_b < _y2) {
                            _b = _y2;
                        }
                        if (_b < _y3) {
                            _b = _y3;
                        }
                        _x >>= 0;
                        _y >>= 0;
                        _r >>= 0;
                        _b >>= 0;
                        _ctx.lineWidth = 1;
                        _ctx.strokeStyle = "#FFFFFF";
                        _ctx.beginPath();
                        _ctx.strokeRect(_x + 0.5, _y + 0.5, _r - _x, _b - _y);
                        _ctx.strokeStyle = "#000000";
                        _ctx.beginPath();
                        this.DrawingDocument.AutoShapesTrack.AddRectDashClever(_ctx, _x, _y, _r, _b, 2, 2, true);
                        _ctx.beginPath();
                    } else {
                        _ctx.lineWidth = 1;
                        _ctx.strokeStyle = "#000000";
                        _ctx.beginPath();
                        _ctx.moveTo(_x1, _y1);
                        _ctx.lineTo(_x2, _y2);
                        _ctx.lineTo(_x4, _y4);
                        _ctx.lineTo(_x3, _y3);
                        _ctx.closePath();
                        _ctx.stroke();
                        _ctx.strokeStyle = "#FFFFFF";
                        _ctx.beginPath();
                        this.DrawingDocument.AutoShapesTrack.AddRectDash(_ctx, _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, 2, 2, true);
                        _ctx.beginPath();
                    }
                } else {
                    _x = (_sx * _x) >> 0;
                    _y = (_sy * _y) >> 0;
                    _r = (_sx * _r) >> 0;
                    _b = (_sy * _b) >> 0;
                    _ctx.lineWidth = 1;
                    _ctx.strokeStyle = "#000000";
                    _ctx.beginPath();
                    _ctx.strokeRect(_x + 0.5, _y + 0.5, _r - _x, _b - _y);
                    _ctx.strokeStyle = "#FFFFFF";
                    _ctx.beginPath();
                    this.DrawingDocument.AutoShapesTrack.AddRectDashClever(_ctx, _x, _y, _r, _b, 2, 2, true);
                    _ctx.beginPath();
                }
                if (!_isIntegerGrid) {
                    g.SetIntegerGrid(true);
                }
            }
        }
        try {
            return this.CanvasImage.toDataURL("image/png");
        } catch(err) {
            this.CanvasImage = null;
            if (undefined === use_background && undefined === use_master_shapes && undefined == use_layout_shapes) {
                return this.GetThumbnail(_layout, true, true, false);
            } else {
                if (use_background && use_master_shapes && !use_layout_shapes) {
                    return this.GetThumbnail(_layout, true, false, false);
                } else {
                    if (use_background && !use_master_shapes && !use_layout_shapes) {
                        return this.GetThumbnail(_layout, false, false, false);
                    }
                }
            }
        }
        return "";
    };
}