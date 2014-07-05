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
 function SlideLayout(slideMaster) {
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
    this.changeProportions = function (kW, kH) {
        var _graphic_objects = this.cSld.spTree;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _graphic_objects[_object_index].changeProportions(kW, kH);
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
    };
    this.Calculate = function () {};
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
    this.draw = function (graphics) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (!this.cSld.spTree[i].isPlaceholder()) {
                this.cSld.spTree[i].draw(graphics);
            }
        }
    };
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
    this.calculateType = function () {
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
    };
    this.calculateMatchedTypes = function () {
        this.matchedTypes = [];
        for (var i = 0; i < 36; ++i) {
            this.matchedTypes[i] = false;
        }
        if (this.calculatedType != null) {
            switch (this.calculatedType) {
            case nSldLtTBlank:
                this.matchedTypes[nSldLtTBlank] = true;
                break;
            case nSldLtTChart:
                this.matchedTypes[nSldLtTChart] = true;
                break;
            case nSldLtTChartAndTx:
                case nSldLtTTxAndChart:
                case nSldLtTVertTitleAndTxOverChart:
                this.matchedTypes[nSldLtTChartAndTx] = true;
                this.matchedTypes[nSldLtTTxAndChart] = true;
                this.matchedTypes[nSldLtTVertTitleAndTxOverChart] = true;
                break;
            case nSldLtTClipArtAndTx:
                case nSldLtTTxAndClipArt:
                case nSldLtTClipArtAndVertTx:
                this.matchedTypes[nSldLtTClipArtAndTx] = true;
                this.matchedTypes[nSldLtTTxAndClipArt] = true;
                break;
            case nSldLtTDgm:
                this.matchedTypes[nSldLtTDgm] = true;
                break;
            case nSldLtTFourObj:
                this.matchedTypes[nSldLtTFourObj] = true;
                break;
            case nSldLtTMediaAndTx:
                case nSldLtTTxAndMedia:
                this.matchedTypes[nSldLtTMediaAndTx] = true;
                this.matchedTypes[nSldLtTTxAndMedia] = true;
                break;
            case nSldLtTObj:
                this.matchedTypes[nSldLtTObj] = true;
                break;
            case nSldLtTObjAndTwoObj:
                case nSldLtTTwoObjAndObj:
                this.matchedTypes[nSldLtTObjAndTwoObj] = true;
                this.matchedTypes[nSldLtTTwoObjAndObj] = true;
                break;
            case nSldLtTObjAndTx:
                case nSldLtTTxAndObj:
                case nSldLtTTxOverObj:
                case nSldLtTObjOverTx:
                case nSldLtTObjTx:
                this.matchedTypes[nSldLtTObjAndTx] = true;
                this.matchedTypes[nSldLtTTxAndObj] = true;
                this.matchedTypes[nSldLtTTxOverObj] = true;
                break;
            case nSldLtTObjOnly:
                this.matchedTypes[nSldLtTObjOnly] = true;
                break;
            case nSldLtTPicTx:
                this.matchedTypes[nSldLtTPicTx] = true;
                break;
            case nSldLtTSecHead:
                case nSldLtTTitle:
                this.matchedTypes[nSldLtTSecHead] = true;
                this.matchedTypes[nSldLtTTitle] = true;
                break;
            case nSldLtTTbl:
                this.matchedTypes[nSldLtTTbl] = true;
                break;
            case nSldLtTTitleOnly:
                this.matchedTypes[nSldLtTTitleOnly] = true;
                break;
            case nSldLtTTwoColTx:
                this.matchedTypes[nSldLtTTwoColTx] = true;
                break;
            case nSldLtTTwoObj:
                this.matchedTypes[nSldLtTTwoObj] = true;
                break;
            case nSldLtTTwoObjAndTx:
                case nSldLtTTwoObjOverTx:
                case nSldLtTTxAndTwoObj:
                this.matchedTypes[nSldLtTTwoObjAndTx] = true;
                this.matchedTypes[nSldLtTTwoObjOverTx] = true;
                this.matchedTypes[nSldLtTTxAndTwoObj] = true;
                break;
            case nSldLtTTwoTxTwoObj:
                this.matchedTypes[nSldLtTTwoTxTwoObj] = true;
                break;
            case nSldLtTTx:
                case nSldLtTVertTx:
                case nSldLtTVertTitleAndTx:
                this.matchedTypes[nSldLtTTx] = true;
                this.matchedTypes[nSldLtTVertTx] = true;
                this.matchedTypes[nSldLtTVertTitleAndTx] = true;
                break;
            }
        } else {}
    };
    this.recalculate = function () {
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (!_shapes[_shape_index].isPlaceholder()) {
                _shapes[_shape_index].recalculate();
            }
        }
    };
    this.recalculate2 = function () {
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (_shapes[_shape_index].isPlaceholder()) {
                _shapes[_shape_index].recalculate();
            }
        }
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
SlideLayout.prototype = {
    setMaster: function (master) {
        History.Add(this, {
            Type: historyitem_SetLayoutMaster,
            oldPr: this.Master,
            newPr: master
        });
        this.Master = master;
    },
    setMatchingName: function (name) {
        History.Add(this, {
            Type: historyitem_SetLayoutMatchingName,
            oldPr: this.matchingName,
            newPr: name
        });
        this.matchingName = name;
    },
    setType: function (type) {
        History.Add(this, {
            Type: historyitem_SetLayoutType,
            oldPr: this.type,
            newPr: type
        });
        this.type = type;
    },
    changeSize: function (kw, kh) {
        this.Width *= kw;
        this.Height *= kh;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
        this.recalcAll();
    },
    recalcAll: function () {
        this.recalcInfo = {
            recalculateBackground: true,
            recalculateSpTree: true
        };
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalcAll();
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    changeBackground: function (bg) {
        History.Add(this, {
            Type: historyitem_ChangeBg,
            oldBg: this.cSld.Bg ? this.cSld.Bg.createFullCopy() : null,
            newBg: bg
        });
        this.cSld.Bg = bg;
    },
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SetCSldName,
            oldName: this.cSld.name,
            newName: name
        });
        this.cSld.name = name;
    },
    setShow: function (bShow) {
        History.Add(this, {
            Type: historyitem_SetShow,
            oldPr: this.show,
            newPr: bShow
        });
        this.show = bShow;
    },
    setShowPhAnim: function (bShow) {
        History.Add(this, {
            Type: historyitem_SetShowPhAnim,
            oldPr: this.showMasterPhAnim,
            newPr: bShow
        });
        this.showMasterPhAnim = bShow;
    },
    setShowMasterSp: function (bShow) {
        History.Add(this, {
            Type: historyitem_SetShowMasterSp,
            oldPr: this.showMasterSp,
            newPr: bShow
        });
        this.showMasterSp = bShow;
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SetClrMapOverride,
            oldClrMap: this.clrMap,
            newClrMap: clrMap
        });
        this.clrMap = clrMap;
    },
    shapeAdd: function (pos, item) {
        History.Add(this, {
            Type: historyitem_ShapeAdd,
            pos: pos,
            item: item
        });
        this.cSld.spTree.splice(pos, 0, item);
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
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetLayoutMaster:
            break;
        case historyitem_SetLayoutType:
            this.type = data.oldPr;
            break;
        case historyitem_SetLayoutMatchingName:
            this.matchingName = data.oldPr;
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
        case historyitem_AddSlideLocks:
            this.deleteLock = null;
            this.backgroundLock = null;
            this.timingLock = null;
            this.transitionLock = null;
            this.layoutLock = null;
            break;
        case historyitem_ChangeBg:
            this.cSld.Bg = data.oldBg;
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
        case historyitem_SetLayoutMaster:
            break;
        case historyitem_SetLayoutType:
            this.type = data.newPr;
            break;
        case historyitem_SetLayoutMatchingName:
            this.matchingName = data.newPr;
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
        case historyitem_AddSlideLocks:
            this.deleteLock = g_oTableId.Get_ById(data.deleteLock);
            this.backgroundLock = g_oTableId.Get_ById(data.backgroundLock);
            this.timingLock = g_oTableId.Get_ById(data.timingLock);
            this.transitionLock = g_oTableId.Get_ById(data.transitionLock);
            this.layoutLock = g_oTableId.Get_ById(data.layoutLock);
            break;
        case historyitem_ChangeBg:
            this.cSld.Bg = data.newBg;
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
        w.WriteLong(historyitem_type_Layout);
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
    Refresh_RecalcData: function () {},
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetLayoutMaster:
            w.WriteString2(data.newPr.Get_Id());
            break;
        case historyitem_SetLayoutType:
            w.WriteLong(data.newPr);
            break;
        case historyitem_SetLayoutMatchingName:
            w.WriteString2(data.newPr);
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
        case historyitem_SetLayoutMaster:
            this.Master = g_oTableId.Get_ById(r.GetString2());
            break;
        case historyitem_SetLayoutType:
            this.type = r.GetLong();
            break;
        case historyitem_SetLayoutMatchingName:
            this.matchingName = r.GetString2();
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
    },
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
                        this.DrawingDocument.AutoShapesTrack.AddRectDashClever(_ctx, _x, _y, _r, _b, 2, 2);
                        _ctx.stroke();
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
                        this.DrawingDocument.AutoShapesTrack.AddRectDash(_ctx, _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, 2, 2);
                        _ctx.stroke();
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
                    this.DrawingDocument.AutoShapesTrack.AddRectDashClever(_ctx, _x, _y, _r, _b, 2, 2);
                    _ctx.stroke();
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