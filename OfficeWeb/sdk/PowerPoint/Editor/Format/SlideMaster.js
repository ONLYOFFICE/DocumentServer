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
    this.changeProportions = function (kW, kH) {
        var _graphic_objects = this.cSld.spTree;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _graphic_objects[_object_index].changeProportions(kW, kH);
        }
    };
    this.draw = function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].draw(graphics);
            }
        }
    };
    this.setSize = function (width, height) {
        var _k_h = height / this.Height;
        var _k_w = width / this.Width;
        this.Width = width;
        this.Height = height;
        var _graphic_objects = this.cSld.spTree;
        var _objects_count = _graphic_objects.length;
        var _object_index;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _graphic_objects[_object_index].updateProportions(_k_w, _k_h);
        }
        var _layouts = this.sldLayoutLst;
        var _layout_count = _layouts.length;
        var _layout_index;
        for (_layout_index = 0; _layout_index < _layout_count; ++_layout_index) {
            _layouts[_layout_index].setSize(width, height);
        }
    };
    this.calculateColors = function () {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes_count; ++_shape_index) {
            if (_shapes[_shape_index].calculateColors) {
                _shapes[_shape_index].calculateColors();
            }
        }
    };
    this.getMatchingLayout = function (type, matchingName, cSldName, themeFlag) {
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
    };
    this.Calculate = function () {
        var titleStyles = this.txStyles.titleStyle;
    };
    this.presentation = editor.WordControl.m_oLogicDocument;
    this.theme = theme;
    this.kind = MASTER_KIND;
    this.getMatchingShape = function (type, idx, bSingleBody) {
        var _input_reduced_type;
        if (type == null) {
            _input_reduced_type = phType_body;
        } else {
            if (type == phType_ctrTitle) {
                _input_reduced_type = phType_title;
            } else {
                _input_reduced_type = type;
            }
        }
        var _input_reduced_index;
        if (idx == null) {
            _input_reduced_index = 0;
        } else {
            _input_reduced_index = idx;
        }
        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        var body_count = 0;
        var last_body;
        for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
            _glyph = _sp_tree[_shape_index];
            if (_glyph.isPlaceholder()) {
                if (_glyph instanceof CShape) {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if (_glyph instanceof CImageShape) {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if (_glyph instanceof CGroupShape) {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if (_type == null) {
                    _final_type = phType_body;
                } else {
                    if (_type == phType_ctrTitle) {
                        _final_type = phType_title;
                    } else {
                        _final_type = _type;
                    }
                }
                if (_index == null) {
                    _final_index = 0;
                } else {
                    _final_index = _index;
                }
                if (_input_reduced_type == _final_type && _input_reduced_index == _final_index) {
                    return _glyph;
                }
                if (_input_reduced_type == phType_title && _input_reduced_type == _final_type) {
                    return _glyph;
                }
                if (phType_body === _type) {
                    ++body_count;
                    last_body = _glyph;
                }
            }
        }
        if (_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr) {
            for (_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index) {
                _glyph = _sp_tree[_shape_index];
                if (_glyph.isPlaceholder()) {
                    if (_glyph instanceof CShape) {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof CImageShape) {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if (_glyph instanceof CGroupShape) {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }
                    if (_input_reduced_type == _type) {
                        return _glyph;
                    }
                }
            }
        }
        if (body_count === 1 && type === phType_body && bSingleBody) {
            return last_body;
        }
        return null;
    };
    this.recalculate = function () {
        try {
            var _shapes = this.cSld.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                if (!_shapes[_shape_index].isPlaceholder()) {
                    _shapes[_shape_index].recalculate();
                }
            }
        } catch(e) {}
    };
    this.setNewSizes = function (width, height) {
        if (! (typeof width === "number" && width > 0 && typeof height === "number" && height > 0)) {
            return;
        }
        var _k_w = width / this.Width;
        var _k_h = height / this.Height;
        var _graphic_objects = this.cSld.spTree;
        var _object_count = _graphic_objects.length;
        var _object_index;
        for (_object_index = 0; _object_index < _object_count; ++_object_index) {
            _graphic_objects[_object_index].updateProportions(_k_w, _k_h);
        }
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
MasterSlide.prototype = {
    addLayout: function (layout) {
        this.sldLayoutLst.push(layout);
    },
    setTheme: function (theme) {
        History.Add(this, {
            Type: historyitem_SetMasterTheme,
            oldPr: this.Theme,
            newPr: theme
        });
        this.Theme = theme;
    },
    changeSize: function (kw, kh) {
        this.Width *= kw;
        this.Height *= kh;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
        this.recalcAll();
    },
    shapeAdd: function (pos, item) {
        History.Add(this, {
            Type: historyitem_ShapeAdd,
            pos: pos,
            item: item
        });
        this.cSld.spTree.splice(pos, 0, item);
    },
    changeBackground: function (bg) {
        History.Add(this, {
            Type: historyitem_ChangeBg,
            oldBg: this.cSld.Bg ? this.cSld.Bg.createFullCopy() : null,
            newBg: bg
        });
        this.cSld.Bg = bg;
        this.recalcInfo.recalculateBackground = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setTxStyles: function (txStyles) {
        History.Add(this, {
            Type: historyitem_SetTxStyles,
            oldPr: this.txStyles,
            newPr: txStyles
        });
        this.txStyles = txStyles;
    },
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SetCSldName,
            oldName: this.cSld.name,
            newName: name
        });
        this.cSld.name = name;
    },
    recalcAll: function () {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalcAll();
        }
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SetClrMapOverride,
            oldClrMap: this.clrMap,
            newClrMap: clrMap
        });
        this.clrMap = clrMap;
    },
    addToSldLayoutLstToPos: function (pos, obj) {
        History.Add(this, {
            Type: historyitem_AddLayout,
            objectId: obj.Get_Id(),
            pos: pos
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
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetMasterTheme:
            break;
        case historyitem_SetTxStyles:
            this.txStyles = data.oldPr;
            break;
        case historyitem_AddComment:
            this.comments.splice(data.pos, 1);
            editor.sync_RemoveComment(data.objectId);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.index, 0, g_oTableId.Get_ById(data.id));
            editor.sync_AddComment(this.comments[data.index].Get_Id(), this.comments[data.index].Data);
            break;
        case historyitem_RemoveFromSpTree:
            this.cSld.spTree.splice(data.index, 0, g_oTableId.Get_ById(data.id));
            break;
        case historyitem_AddToSlideSpTree:
            this.cSld.spTree.splice(data.pos, 1);
            break;
        case historyitem_AddLayout:
            break;
        case historyitem_AddSlideLocks:
            this.deleteLock = null;
            this.backgroundLock = null;
            this.timingLock = null;
            this.transitionLock = null;
            this.layoutLock = null;
            break;
        case historyitem_ChangeBg:
            this.cSld.Bg = data.oldBg;
            this.recalcInfo.recalculateBackground = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            break;
        case historyitem_ChangeTiming:
            this.timing = data.oldTiming.createDuplicate();
            break;
        case historyitem_SetLayout:
            this.Layout = data.oldLayout;
            if (this.Layout != null) {
                this.recalcAll();
            }
            break;
        case historyitem_SetSlideNum:
            this.num = data.oldNum;
            break;
        case historyitem_ShapeAdd:
            this.cSld.spTree.splice(data.pos, 1);
            break;
        case historyitem_SetCSldName:
            this.cSld.name = data.oldName;
            break;
        case historyitem_SetClrMapOverride:
            this.clrMap = data.oldClrMap;
            break;
        case historyitem_SetShow:
            this.show = data.oldPr;
            break;
        case historyitem_SetShowPhAnim:
            this.showMasterPhAnim = data.oldPr;
            break;
        case historyitem_SetShowMasterSp:
            this.showMasterSp = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetMasterTheme:
            break;
        case historyitem_SetTxStyles:
            this.txStyles = data.newPr;
            break;
        case historyitem_AddComment:
            this.comments.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
            editor.sync_AddComment(data.objectId, this.comments[data.pos].Data);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.index, 1);
            editor.sync_RemoveComment(data.id);
            break;
        case historyitem_RemoveFromSpTree:
            this.cSld.spTree.splice(data.index, 1);
            break;
        case historyitem_AddToSlideSpTree:
            this.cSld.spTree.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
            break;
        case historyitem_AddLayout:
            break;
        case historyitem_AddSlideLocks:
            this.deleteLock = g_oTableId.Get_ById(data.deleteLock);
            this.backgroundLock = g_oTableId.Get_ById(data.backgroundLock);
            this.timingLock = g_oTableId.Get_ById(data.timingLock);
            this.transitionLock = g_oTableId.Get_ById(data.transitionLock);
            this.layoutLock = g_oTableId.Get_ById(data.layoutLock);
            break;
        case historyitem_ChangeBg:
            this.cSld.Bg = data.newBg;
            this.recalcInfo.recalculateBackground = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            break;
        case historyitem_ChangeTiming:
            this.timing = data.newTiming.createDuplicate();
            break;
        case historyitem_SetLayout:
            this.Layout = data.newLayout;
            this.recalcAll();
            break;
        case historyitem_SetSlideNum:
            this.num = data.newNum;
            break;
        case historyitem_ShapeAdd:
            this.cSld.spTree.splice(data.pos, 0, data.item);
            break;
        case historyitem_SetCSldName:
            this.cSld.name = data.newName;
            break;
        case historyitem_SetClrMapOverride:
            this.clrMap = data.newClrMap;
            break;
        case historyitem_SetShow:
            this.show = data.newPr;
            break;
        case historyitem_SetShowPhAnim:
            this.showMasterPhAnim = data.newPr;
            break;
        case historyitem_SetShowMasterSp:
            this.showMasterSp = data.newPr;
            break;
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_SlideMaster);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    getAllFonts: function (fonts) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (typeof this.cSld.spTree[i].getAllFonts === "function") {
                this.cSld.spTree[i].getAllFonts(fonts);
            }
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetMasterTheme:
            w.WriteString2(data.newPr.Get_Id());
            break;
        case historyitem_SetTxStyles:
            MASTER_STYLES = true;
            data.newPr.Write_ToBinary2(w);
            MASTER_STYLES = false;
            break;
        case historyitem_AddComment:
            w.WriteLong(data.pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_RemoveComment:
            w.WriteLong(data.index);
            break;
        case historyitem_RemoveFromSpTree:
            w.WriteLong(data.index);
            break;
        case historyitem_AddToSlideSpTree:
            w.WriteLong(data.pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_AddLayout:
            w.WriteLong(data.pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_AddSlideLocks:
            w.WriteString2(data.deleteLock);
            w.WriteString2(data.backgroundLock);
            w.WriteString2(data.timingLock);
            w.WriteString2(data.transitionLock);
            w.WriteString2(data.layoutLock);
            break;
        case historyitem_ChangeBg:
            data.newBg.Write_ToBinary2(w);
            break;
        case historyitem_ChangeTiming:
            data.newTiming.Write_ToBinary2(w);
            break;
        case historyitem_SetLayout:
            w.WriteBool(isRealObject(data.newLayout));
            if (isRealObject(data.newLayout)) {
                w.WriteString2(data.newLayout.Get_Id());
            }
            break;
        case historyitem_SetSlideNum:
            w.WriteBool(isRealNumber(data.newNum));
            if (isRealNumber(data.newNum)) {
                w.WriteLong(data.newNum);
            }
            break;
        case historyitem_ShapeAdd:
            w.WriteLong(data.pos);
            w.WriteString2(data.item.Get_Id());
            break;
        case historyitem_SetCSldName:
            w.WriteBool(typeof data.newName === "string");
            if (typeof data.newName === "string") {
                w.WriteString2(data.newName);
            }
            break;
        case historyitem_SetClrMapOverride:
            w.WriteBool(isRealObject(data.newClrMap));
            if (isRealObject(data.newClrMap)) {
                data.newClrMap.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShow:
            w.WriteBool(data.newPr);
            break;
        case historyitem_SetShowPhAnim:
            w.WriteBool(data.newPr);
            break;
        case historyitem_SetShowMasterSp:
            w.WriteBool(data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_SetMasterTheme:
            this.Theme = g_oTableId.Get_ById(r.GetString2());
            break;
        case historyitem_SetTxStyles:
            this.txStyles = new CTextStyles();
            this.txStyles.Read_FromBinary2(r);
            break;
        case historyitem_AddComment:
            var pos = r.GetLong();
            var id = r.GetString2();
            this.comments.splice(pos, 0, g_oTableId.Get_ById(id));
            editor.sync_AddComment(id, this.comments[pos].Data);
            break;
        case historyitem_RemoveComment:
            var comment = this.comments.splice(r.GetLong(), 1)[0];
            editor.sync_RemoveComment(comment.Id);
            break;
        case historyitem_RemoveFromSpTree:
            this.cSld.spTree.splice(r.GetLong(), 1);
            break;
        case historyitem_AddToSlideSpTree:
            var pos = r.GetLong();
            var id = r.GetString2();
            this.cSld.spTree.splice(pos, 0, g_oTableId.Get_ById(id));
            break;
        case historyitem_AddLayout:
            var pos = r.GetLong();
            var id = r.GetString2();
            this.sldLayoutLst.splice(pos, 0, g_oTableId.Get_ById(id));
            break;
        case historyitem_AddSlideLocks:
            this.deleteLock = g_oTableId.Get_ById(r.GetString2());
            this.backgroundLock = g_oTableId.Get_ById(r.GetString2());
            this.timingLock = g_oTableId.Get_ById(r.GetString2());
            this.transitionLock = g_oTableId.Get_ById(r.GetString2());
            this.layoutLock = g_oTableId.Get_ById(r.GetString2());
            break;
        case historyitem_ChangeBg:
            this.cSld.Bg = new CBg();
            this.cSld.Bg.Read_FromBinary2(r);
            this.recalcInfo.recalculateBackground = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            if (this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof CBlipFill) {
                CollaborativeEditing.Add_NewImage(this.cSld.Bg.bgPr.Fill.fill.RasterImageId);
            }
            break;
        case historyitem_ChangeTiming:
            this.timing = new CAscSlideTiming();
            this.timing.Read_FromBinary2(r);
            break;
        case historyitem_SetLayout:
            if (r.GetBool()) {
                this.Layout = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.Layout = null;
            }
            this.recalcAll();
            break;
        case historyitem_SetSlideNum:
            if (r.GetBool()) {
                this.num = r.GetLong();
            } else {
                this.num = null;
            }
            break;
        case historyitem_ShapeAdd:
            var pos = r.GetLong();
            var item = g_oTableId.Get_ById(r.GetString2());
            this.cSld.spTree.splice(pos, 0, item);
            break;
        case historyitem_SetCSldName:
            if (r.GetBool()) {
                this.cSld.name = r.GetString2();
            } else {
                this.cSld.name = null;
            }
            break;
        case historyitem_SetClrMapOverride:
            if (r.GetBool()) {
                this.clrMap = new ClrMap();
                this.clrMap.Read_FromBinary2(r);
            }
            break;
        case historyitem_SetShow:
            this.show = r.GetBool();
            break;
        case historyitem_SetShowPhAnim:
            this.showMasterPhAnim = r.GetBool();
            break;
        case historyitem_SetShowMasterSp:
            this.showMasterSp = r.GetBool();
            break;
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
        var h_px = 40;
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
        var _color_w = (7 * w_px / 75) >> 0;
        var _color_h = (6 * h_px / 55) >> 0;
        var _color_x = (5 * w_px / 75) >> 0;
        var _text_x = _color_x / _sx;
        var _text_y = (22 * h_px / (40 * _sy));
        var _color_y = (42 * h_px / 55) >> 0;
        var _color_delta = 1;
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
        var par = new Paragraph(this.DrawingDocument, _api.WordControl.m_oLogicDocument, 0, _text_x, _text_y, 1000, 1000);
        par.Cursor_MoveToStartPos();
        _color.id = 15;
        _color.Calculate(_theme, null, null, _master, RGBA);
        var _paraPr = new CParaPr();
        par.Pr = _paraPr;
        var _textPr1 = new CTextPr();
        _textPr1.FontFamily = {
            Name: _theme.themeElements.fontScheme.majorFont.latin,
            Index: -1
        };
        _textPr1.FontSize = 250;
        _textPr1.Color = new CDocumentColor(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B);
        var _textPr2 = new CTextPr();
        _textPr2.FontFamily = {
            Name: _theme.themeElements.fontScheme.minorFont.latin,
            Index: -1
        };
        _textPr2.FontSize = 250;
        par.Add(new ParaTextPr(_textPr1));
        par.Add(new ParaText("A"));
        par.Add(new ParaTextPr(_textPr2));
        par.Add(new ParaText("a"));
        par.Recalculate_Page(0);
        par.Lines[0].Y = 0;
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