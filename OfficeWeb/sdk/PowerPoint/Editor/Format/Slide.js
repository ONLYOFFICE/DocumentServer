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
function Slide(presentation, slideLayout, slideNum) {
    this.kind = SLIDE_KIND;
    this.presentation = editor && editor.WordControl && editor.WordControl.m_oLogicDocument;
    this.graphicObjects = new DrawingObjectsController(this);
    this.maxId = 0;
    this.cSld = new CSld();
    this.clrMap = null;
    this.show = true;
    this.showMasterPhAnim = false;
    this.showMasterSp = null;
    this.backgroundFill = null;
    this.timing = new CAscSlideTiming();
    this.timing.setDefaultParams();
    this.recalcInfo = {
        recalculateBackground: true,
        recalculateSpTree: true
    };
    this.Width = 254;
    this.Height = 190.5;
    this.searchingArray = [];
    this.selectionArray = [];
    this.writecomments = [];
    this.maxId = 1000;
    this.m_oContentChanges = new CContentChanges();
    this.commentX = 0;
    this.commentY = 0;
    this.deleteLock = null;
    this.backgroundLock = null;
    this.timingLock = null;
    this.transitionLock = null;
    this.layoutLock = null;
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (presentation) {
        this.Width = presentation.Width;
        this.Height = presentation.Height;
        this.setSlideComments(new SlideComments(this));
        this.setLocks(new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id));
    }
    if (slideLayout) {
        this.setLayout(slideLayout);
    }
    if (typeof slideNum === "number") {
        this.setSlideNum(slideNum);
    }
}
Slide.prototype = {
    getObjectType: function () {
        return historyitem_type_Slide;
    },
    getDrawingDocument: function () {
        return editor.WordControl.m_oLogicDocument.DrawingDocument;
    },
    createDuplicate: function () {
        var copy = new Slide(this.presentation, this.Layout, 0),
        i;
        if (typeof this.cSld.name === "string" && this.cSld.name.length > 0) {
            copy.setCSldName(this.cSld.name);
        }
        if (this.cSld.Bg) {
            copy.changeBackground(this.cSld.Bg.createFullCopy());
        }
        for (i = 0; i < this.cSld.spTree.length; ++i) {
            copy.shapeAdd(copy.cSld.spTree.length, this.cSld.spTree[i].copy());
            copy.cSld.spTree[copy.cSld.spTree.length - 1].setParent2(copy);
        }
        if (this.clrMap) {
            copy.setClMapOverride(this.clrMap.createDuplicate());
        }
        if (isRealBool(this.show)) {
            copy.setShow(this.show);
        }
        if (isRealBool(this.showMasterPhAnim)) {
            copy.setShowPhAnim(this.showMasterPhAnim);
        }
        if (isRealBool(this.showMasterSp)) {
            copy.setShowMasterSp(this.showMasterSp);
        }
        copy.applyTiming(this.timing.createDuplicate());
        copy.setSlideSize(this.Width, this.Height);
        if (!this.recalcInfo.recalculateBackground && !this.recalcInfo.recalculateSpTree) {
            copy.cachedImage = this.getBase64Img();
        }
        return copy;
    },
    Search: function (Str, Props, Engine, Type) {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].Search) {
                sp_tree[i].Search(Str, Props, Engine, Type);
            }
        }
    },
    Search_GetId: function (isNext, StartPos) {
        var sp_tree = this.cSld.spTree,
        i, Id;
        if (isNext) {
            for (i = StartPos; i < sp_tree.length; ++i) {
                if (sp_tree[i].Search_GetId) {
                    Id = sp_tree[i].Search_GetId(isNext, false);
                    if (Id !== null) {
                        return Id;
                    }
                }
            }
        } else {
            for (i = StartPos; i > -1; --i) {
                if (sp_tree[i].Search_GetId) {
                    Id = sp_tree[i].Search_GetId(isNext, false);
                    if (Id !== null) {
                        return Id;
                    }
                }
            }
        }
        return null;
    },
    getMatchingShape: function (type, idx, bSingleBody) {
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
    },
    changeNum: function (num) {
        this.num = num;
    },
    recalcText: function () {
        this.recalcInfo.recalculateSpTree = true;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalcText && this.cSld.spTree[i].recalcText();
        }
    },
    addComment: function (comment) {
        if (isRealObject(this.slideComments)) {
            this.slideComments.addComment(comment);
        }
    },
    changeComment: function (id, commentData) {
        if (isRealObject(this.slideComments)) {
            this.slideComments.changeComment(id, commentData);
        }
    },
    removeComment: function (id) {
        if (isRealObject(this.slideComments)) {
            this.slideComments.removeComment(id);
        }
    },
    addToRecalculate: function () {
        History.RecalcData_Add({
            Type: historyrecalctype_Drawing,
            Object: this
        });
    },
    Refresh_RecalcData: function (data) {
        if (data) {
            switch (data.Type) {
            case historyitem_SlideSetBg:
                this.recalcInfo.recalculateBackground = true;
                break;
            case historyitem_SlideSetLayout:
                this.checkSlideTheme();
                break;
            }
            this.addToRecalculate();
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Slide);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SlideSetComments:
            this.slideComments = data.oldPr;
            break;
        case historyitem_SlideSetShow:
            this.show = data.oldPr;
            break;
        case historyitem_SlideSetShowPhAnim:
            this.showMasterPhAnim = data.oldPr;
            break;
        case historyitem_SlideSetShowMasterSp:
            this.showMasterSp = data.oldPr;
            break;
        case historyitem_SlideSetLayout:
            this.Layout = data.oldPr;
            break;
        case historyitem_SlideSetNum:
            this.num = data.oldPr;
            break;
        case historyitem_SlideSetTiming:
            this.timing = data.oldPr;
            break;
        case historyitem_SlideSetSize:
            this.Width = data.oldW;
            this.Height = data.oldH;
            break;
        case historyitem_SlideSetBg:
            this.cSld.Bg = data.oldPr;
            break;
        case historyitem_SlideSetLocks:
            this.deleteLock = null;
            this.backgroundLock = null;
            this.timingLock = null;
            this.transitionLock = null;
            this.layoutLock = null;
            break;
        case historyitem_SlideAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
            break;
        case historyitem_SlideRemoveFromSpTree:
            this.cSld.spTree.splice(data.Pos, 0, data.Item);
            break;
        case historyitem_SlideSetCSldName:
            this.cSld.name = data.oldPr;
            break;
        case historyitem_SlideSetClrMapOverride:
            this.clrMap = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SlideSetComments:
            this.slideComments = data.newPr;
            break;
        case historyitem_SlideSetShow:
            this.show = data.newPr;
            break;
        case historyitem_SlideSetShowPhAnim:
            this.showMasterPhAnim = data.newPr;
            break;
        case historyitem_SlideSetShowMasterSp:
            this.showMasterSp = data.newPr;
            break;
        case historyitem_SlideSetLayout:
            this.Layout = data.newPr;
            break;
        case historyitem_SlideSetNum:
            this.num = data.newPr;
            break;
        case historyitem_SlideSetTiming:
            this.timing = data.newPr;
            break;
        case historyitem_SlideSetSize:
            this.Width = data.newW;
            this.Height = data.newH;
            break;
        case historyitem_SlideSetBg:
            this.cSld.Bg = data.newPr;
            break;
        case historyitem_SlideSetLocks:
            this.deleteLock = data.deleteLock;
            this.backgroundLock = data.backgroundLock;
            this.timingLock = data.timingLock;
            this.transitionLock = data.transitionLock;
            this.layoutLock = data.layoutLock;
            break;
        case historyitem_SlideAddToSpTree:
            this.cSld.spTree.splice(data.Pos, 0, data.Item);
            break;
        case historyitem_SlideRemoveFromSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
            break;
        case historyitem_SlideSetCSldName:
            this.cSld.name = data.newPr;
            break;
        case historyitem_SlideSetClrMapOverride:
            this.clrMap = data.newPr;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SlideSetComments:
            case historyitem_SlideSetLayout:
            case historyitem_SlideSetClrMapOverride:
            writeObject(w, data.newPr);
            break;
        case historyitem_SlideSetShow:
            case historyitem_SlideSetShowPhAnim:
            case historyitem_SlideSetShowMasterSp:
            writeBool(w, data.newPr);
            break;
        case historyitem_SlideSetNum:
            writeLong(w, data.newPr);
            break;
        case historyitem_SlideSetTiming:
            case historyitem_SlideSetBg:
            data.newPr.Write_ToBinary(w);
            break;
        case historyitem_SlideSetSize:
            writeDouble(w, data.newW);
            writeDouble(w, data.newH);
            break;
        case historyitem_SlideSetLocks:
            writeObject(w, data.deleteLock);
            writeObject(w, data.backgroundLock);
            writeObject(w, data.timingLock);
            writeObject(w, data.transitionLock);
            writeObject(w, data.layoutLock);
            break;
        case historyitem_SlideAddToSpTree:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            writeLong(w, Pos);
            writeObject(w, data.Item);
            break;
        case historyitem_SlideRemoveFromSpTree:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            writeLong(w, data.Pos);
            break;
        case historyitem_SlideSetCSldName:
            writeString(w, data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_SlideSetComments:
            this.slideComments = readObject(r);
            break;
        case historyitem_SlideSetShow:
            this.show = readBool(r);
            break;
        case historyitem_SlideSetShowPhAnim:
            this.showMasterPhAnim = readBool(r);
            break;
        case historyitem_SlideSetShowMasterSp:
            this.showMasterSp = readBool(r);
            break;
        case historyitem_SlideSetLayout:
            this.Layout = readObject(r);
            break;
        case historyitem_SlideSetNum:
            this.num = readLong(r);
            break;
        case historyitem_SlideSetTiming:
            this.timing = new CAscSlideTiming();
            this.timing.Read_FromBinary(r);
            break;
        case historyitem_SlideSetSize:
            this.Width = readDouble(r);
            this.Height = readDouble(r);
            break;
        case historyitem_SlideSetBg:
            this.cSld.Bg = new CBg();
            this.cSld.Bg.Read_FromBinary(r);
            this.recalcInfo.recalculateBackground = true;
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
        case historyitem_SlideSetLocks:
            this.deleteLock = readObject(r);
            this.backgroundLock = readObject(r);
            this.timingLock = readObject(r);
            this.transitionLock = readObject(r);
            this.layoutLock = readObject(r);
            break;
        case historyitem_SlideAddToSpTree:
            var Pos = readLong(r);
            var Item = readObject(r);
            var ChangesPos = this.m_oContentChanges.Check(contentchanges_Add, Pos);
            this.cSld.spTree.splice(ChangesPos, 0, Item);
            break;
        case historyitem_SlideRemoveFromSpTree:
            var Pos = readLong(r);
            var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Pos);
            if (! (ChangesPos === false)) {
                this.cSld.spTree.splice(ChangesPos, 1);
            }
            break;
        case historyitem_SlideSetCSldName:
            this.cSld.name = readString(r);
            break;
        case historyitem_SlideSetClrMapOverride:
            this.clrMap = readObject(r);
            this.recalcInfo.recalculateBackground = true;
            this.recalcInfo.recalculateSpTree = true;
            break;
        }
    },
    setSlideComments: function (comments) {
        History.Add(this, {
            Type: historyitem_SlideSetComments,
            oldPr: this.slideComments,
            newPr: comments
        });
        this.slideComments = comments;
    },
    setShow: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideSetShow,
            oldPr: this.show,
            newPr: bShow
        });
        this.show = bShow;
    },
    setShowPhAnim: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideSetShowPhAnim,
            oldPr: this.showMasterPhAnim,
            newPr: bShow
        });
        this.showMasterPhAnim = bShow;
    },
    setShowMasterSp: function (bShow) {
        History.Add(this, {
            Type: historyitem_SlideSetShowMasterSp,
            oldPr: this.showMasterSp,
            newPr: bShow
        });
        this.showMasterSp = bShow;
    },
    setLayout: function (layout) {
        History.Add(this, {
            Type: historyitem_SlideSetLayout,
            oldPr: this.Layout,
            newPr: layout
        });
        this.Layout = layout;
    },
    setSlideNum: function (num) {
        History.Add(this, {
            Type: historyitem_SlideSetNum,
            oldPr: this.num,
            newPr: num
        });
        this.num = num;
    },
    applyTiming: function (timing) {
        var oldTiming = this.timing.createDuplicate();
        this.timing.applyProps(timing);
        History.Add(this, {
            Type: historyitem_SlideSetTiming,
            oldPr: oldTiming,
            newPr: this.timing.createDuplicate()
        });
    },
    setSlideSize: function (w, h) {
        History.Add(this, {
            Type: historyitem_SlideSetSize,
            oldW: this.Width,
            oldH: this.Height,
            newW: w,
            newH: h
        });
        this.Width = w;
        this.Height = h;
    },
    changeBackground: function (bg) {
        History.Add(this, {
            Type: historyitem_SlideSetBg,
            oldPr: this.cSld.Bg,
            newPr: bg
        });
        this.cSld.Bg = bg;
    },
    setLocks: function (deleteLock, backgroundLock, timingLock, transitionLock, layoutLock) {
        this.deleteLock = deleteLock;
        this.backgroundLock = backgroundLock;
        this.timingLock = timingLock;
        this.transitionLock = transitionLock;
        this.layoutLock = layoutLock;
        History.Add(this, {
            Type: historyitem_SlideSetLocks,
            deleteLock: deleteLock,
            backgroundLock: backgroundLock,
            timingLock: timingLock,
            transitionLock: transitionLock,
            layoutLock: layoutLock
        });
    },
    shapeAdd: function (pos, item) {
        this.checkDrawingUniNvPr(item);
        var _pos = isRealNumber(pos) ? pos : this.cSld.spTree.length;
        History.Add(this, {
            Type: historyitem_SlideAddToSpTree,
            Pos: _pos,
            Item: item
        });
        this.cSld.spTree.splice(_pos, 0, item);
    },
    checkDrawingUniNvPr: function (drawing) {
        var nv_sp_pr;
        if (drawing) {
            switch (drawing.getObjectType()) {
            case historyitem_type_ChartSpace:
                break;
            case historyitem_type_GroupShape:
                if (!drawing.nvGrpSpPr) {
                    nv_sp_pr = new UniNvPr();
                    nv_sp_pr.cNvPr.setId(++this.maxId);
                    drawing.setNvSpPr(nv_sp_pr);
                }
                break;
            case historyitem_type_ImageShape:
                if (!drawing.nvPicPr) {
                    nv_sp_pr = new UniNvPr();
                    nv_sp_pr.cNvPr.setId(++this.maxId);
                    drawing.setNvSpPr(nv_sp_pr);
                }
                break;
            case historyitem_type_Shape:
                if (!drawing.nvSpPr) {
                    nv_sp_pr = new UniNvPr();
                    nv_sp_pr.cNvPr.setId(++this.maxId);
                    drawing.setNvSpPr(nv_sp_pr);
                }
                break;
            }
        }
    },
    removeFromSpTreeById: function (id) {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].Get_Id() === id) {
                History.Add(this, {
                    Type: historyitem_SlideRemoveFromSpTree,
                    Pos: i,
                    Item: sp_tree[i]
                });
                sp_tree.splice(i, 1);
                return i;
            }
        }
        return null;
    },
    addToSpTreeToPos: function (pos, obj) {
        this.shapeAdd(pos, obj);
    },
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SlideSetCSldName,
            oldPr: this.cSld.name,
            newPr: name
        });
        this.cSld.name = name;
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SlideSetClrMapOverride,
            oldPr: this.clrMap,
            newPr: clrMap
        });
        this.clrMap = clrMap;
    },
    getAllFonts: function (fonts) {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (typeof this.cSld.spTree[i].getAllFonts === "function") {
                this.cSld.spTree[i].getAllFonts(fonts);
            }
        }
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
    changeSize: function (width, height) {
        var kw = width / this.Width,
        kh = height / this.Height;
        this.setSlideSize(width, height);
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
    },
    checkSlideSize: function () {
        this.recalcInfo.recalculateSpTree = true;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].handleUpdateExtents();
        }
    },
    checkSlideTheme: function () {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].handleUpdateTheme();
        }
    },
    checkSlideColorScheme: function () {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].handleUpdateFill();
            this.cSld.spTree[i].handleUpdateLn();
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    Get_ColorMap: function () {
        if (this.clrMap) {
            return this.clrMap;
        } else {
            if (this.Layout && this.Layout.clrMap) {
                return this.Layout.clrMap;
            } else {
                if (this.Layout.Master && this.Layout.Master.clrMap) {
                    return this.Layout.Master.clrMap;
                }
            }
        }
        return G_O_DEFAULT_COLOR_MAP;
    },
    recalculate: function () {
        if (!this.Layout || !isRealNumber(this.num)) {
            return;
        }
        if (this.recalcInfo.recalculateBackground) {
            this.recalculateBackground();
            this.recalcInfo.recalculateBackground = false;
        }
        if (this.recalcInfo.recalculateSpTree) {
            this.recalculateSpTree();
            this.recalcInfo.recalculateSpTree = false;
        }
        this.cachedImage = null;
    },
    recalculateBackground: function () {
        var _back_fill = null;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var _layout = this.Layout;
        var _master = _layout.Master;
        var _theme = _master.Theme;
        if (this.cSld.Bg != null) {
            if (null != this.cSld.Bg.bgPr) {
                _back_fill = this.cSld.Bg.bgPr.Fill;
            } else {
                if (this.cSld.Bg.bgRef != null) {
                    this.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                    RGBA = this.cSld.Bg.bgRef.Color.RGBA;
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx, this.cSld.Bg.bgRef.Color);
                }
            }
        } else {
            if (_layout != null) {
                if (_layout.cSld.Bg != null) {
                    if (null != _layout.cSld.Bg.bgPr) {
                        _back_fill = _layout.cSld.Bg.bgPr.Fill;
                    } else {
                        if (_layout.cSld.Bg.bgRef != null) {
                            _layout.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
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
                                    _master.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
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
            }
        }
        if (_back_fill != null) {
            _back_fill.calculate(_theme, this, _layout, _master, RGBA);
        }
        this.backgroundFill = _back_fill;
    },
    recalculateSpTree: function () {
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalculate();
        }
    },
    draw: function (graphics) {
        DrawBackground(graphics, this.backgroundFill, this.Width, this.Height);
        if (this.showMasterSp === true || (!(this.showMasterSp === false) && (this.Layout.showMasterSp == undefined || this.Layout.showMasterSp))) {
            if (graphics.IsSlideBoundsCheckerType === undefined) {
                this.Layout.Master.draw(graphics);
            }
        }
        if (graphics && graphics.IsSlideBoundsCheckerType === undefined) {
            this.Layout.draw(graphics);
        }
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].draw(graphics);
        }
        if (this.slideComments) {
            var comments = this.slideComments.comments;
            for (var i = 0; i < comments.length; ++i) {
                comments[i].draw(graphics);
            }
        }
    },
    drawSelect: function (_type) {
        if (_type === undefined) {
            this.graphicObjects.drawTextSelection(this.num);
            this.graphicObjects.drawSelect(0, this.presentation.DrawingDocument);
        } else {
            if (_type == 1) {
                this.graphicObjects.drawTextSelection(this.num);
            } else {
                if (_type == 2) {
                    this.graphicObjects.drawSelect(0, this.presentation.DrawingDocument);
                }
            }
        }
    },
    getDrawingObjects: function () {
        return this.cSld.spTree;
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        this.graphicObjects.paragraphAdd(paraItem, bRecalculate);
    },
    OnUpdateOverlay: function () {
        this.presentation.DrawingDocument.m_oWordControl.OnUpdateOverlay();
    },
    sendGraphicObjectProps: function () {
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    },
    checkGraphicObjectPosition: function () {
        return {
            x: 0,
            y: 0
        };
    },
    isViewerMode: function () {
        return editor.isViewMode;
    },
    onMouseDown: function (e, x, y) {
        this.graphicObjects.onMouseDown(e, x, y);
    },
    onMouseMove: function (e, x, y) {
        this.graphicObjects.onMouseMove(e, x, y);
    },
    onMouseUp: function (e, x, y) {
        this.graphicObjects.onMouseUp(e, x, y);
    },
    getColorMap: function () {},
    showDrawingObjects: function () {
        editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.num, this);
    },
    showComment: function (Id, x, y) {
        editor.sync_HideComment();
        editor.sync_ShowComment(Id, x, y);
    },
    getSlideIndex: function () {
        return this.num;
    },
    getWorksheet: function () {
        return null;
    },
    showChartSettings: function () {
        editor.asc_fireCallback("asc_doubleClickOnChart", this.graphicObjects.getChartObject());
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
    },
    Clear_ContentChanges: function () {
        this.m_oContentChanges.Clear();
    },
    Add_ContentChanges: function (Changes) {
        this.m_oContentChanges.Add(Changes);
    },
    Refresh_ContentChanges: function () {
        this.m_oContentChanges.Refresh();
    },
    isLockedObject: function () {
        return false;
    },
    convertPixToMM: function (pix) {
        return editor.WordControl.m_oDrawingDocument.GetMMPerDot(pix);
    },
    getBase64Img: function () {
        if (typeof this.cachedImage === "string" && this.cachedImage.length > 0) {
            return this.cachedImage;
        }
        return ShapeToImageConverter(this, 0).ImageUrl;
    },
    checkNoTransformPlaceholder: function () {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            var sp = sp_tree[i];
            if (sp.getObjectType() === historyitem_type_Shape || sp.getObjectType() === historyitem_type_ImageShape) {
                if (sp.isPlaceholder && sp.isPlaceholder()) {
                    sp.recalcInfo.recalculateShapeHierarchy = true;
                    var hierarchy = sp.getHierarchy();
                    for (var j = 0; j < hierarchy.length; ++j) {
                        if (isRealObject(hierarchy[j])) {
                            break;
                        }
                    }
                    if (j === hierarchy.length) {
                        CheckSpPrXfrm(sp);
                    }
                }
            }
        }
    },
    getSnapArrays: function () {
        var snapX = [];
        var snapY = [];
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            if (this.cSld.spTree[i].getSnapArrays) {
                this.cSld.spTree[i].getSnapArrays(snapX, snapY);
            }
        }
        return {
            snapX: snapX,
            snapY: snapY
        };
    },
    Load_Comments: function (authors) {
        var _comments_count = this.writecomments.length;
        var _comments_id = [];
        var _comments_data = [];
        var _comments_data_author_id = [];
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
                _comments_id.push(_wc.WriteCommentId);
                _comments_data.push(commentData);
                _comments_data_author_id.push(_wc.WriteAuthorId);
                _wc.ParceAdditionalData(commentData);
                var comment = new CComment(undefined, new CCommentData());
                comment.setPosition(_wc.x / 25.4, _wc.y / 25.4);
                _comments.push(comment);
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
                _wc.ParceAdditionalData(commentData);
                var _parent = null;
                for (var j = 0; j < _comments_data.length; j++) {
                    if ((_wc.WriteParentAuthorId == _comments_data_author_id[j]) && (_wc.WriteParentCommentId == _comments_id[j])) {
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
function PropLocker(objectId) {
    this.objectId = null;
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (typeof objectId === "string") {
        this.setObjectId(objectId);
    }
}
PropLocker.prototype = {
    getObjectType: function () {
        return historyitem_type_PropLocker;
    },
    setObjectId: function (id) {
        History.Add(this, {
            Type: historyitem_PropLockerSetId,
            oldId: this.objectId,
            newId: id
        });
        this.objectId = id;
    },
    Get_Id: function () {
        return this.Id;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_PropLocker);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_PropLockerSetId:
            this.objectId = data.oldId;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_PropLockerSetId:
            this.objectId = data.newId;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_PropLockerSetId:
            writeString(w, data.newId);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_PropLockerSetId:
            this.objectId = readString(r);
            break;
        }
    },
    Refresh_RecalcData: function () {}
};
CTextBody.prototype.Get_StartPage_Absolute = function () {
    if (this.parent) {
        if (this.parent.getParentObjects) {
            var parent_objects = this.parent.getParentObjects();
            if (parent_objects.slide) {
                return parent_objects.slide.num;
            }
        }
    }
    return 0;
};
CTextBody.prototype.checkCurrentPlaceholder = function () {
    var presentation = editor.WordControl.m_oLogicDocument;
    if (presentation.Slides[presentation.CurPage]) {
        return presentation.Slides[presentation.CurPage].graphicObjects.getTargetDocContent() === this.content;
    }
    return false;
};
function SlideComments(slide) {
    this.comments = [];
    this.m_oContentChanges = new CContentChanges();
    this.slide = slide;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
SlideComments.prototype = {
    getObjectType: function () {
        return historyitem_type_SlideComments;
    },
    Get_Id: function () {
        return this.Id;
    },
    Clear_ContentChanges: function () {
        this.m_oContentChanges.Clear();
    },
    Add_ContentChanges: function (Changes) {
        this.m_oContentChanges.Add(Changes);
    },
    Refresh_ContentChanges: function () {
        this.m_oContentChanges.Refresh();
    },
    addComment: function (comment) {
        History.Add(this, {
            Type: historyitem_SlideCommentsAddComment,
            objectId: comment.Get_Id(),
            Pos: this.comments.length
        });
        this.comments.splice(this.comments.length, 0, comment);
        comment.slideComments = this;
    },
    getSlideIndex: function () {
        if (this.slide) {
            return this.slide.num;
        }
        return null;
    },
    changeComment: function (id, commentData) {
        for (var i = 0; i < this.comments.length; ++i) {
            if (this.comments[i].Get_Id() === id) {
                this.comments[i].Set_Data(commentData);
                return;
            }
        }
    },
    removeComment: function (id) {
        for (var i = 0; i < this.comments.length; ++i) {
            if (this.comments[i].Get_Id() === id) {
                History.Add(this, {
                    Type: historyitem_SlideCommentsRemoveComment,
                    Pos: i,
                    id: id
                });
                this.comments.splice(i, 1);
                editor.sync_RemoveComment(id);
                return;
            }
        }
    },
    removeSelectedComment: function () {
        var comment = this.getSelectedComment();
        if (comment) {
            this.removeComment(comment.Get_Id());
        }
    },
    getSelectedComment: function () {
        for (var i = 0; i < this.comments.length; ++i) {
            if (this.comments[i].selected) {
                return this.comments[i];
            }
        }
        return null;
    },
    recalculate: function () {},
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_SlideComments);
        w.WriteString2(this.Id);
        writeObject(w, this.slide);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
        this.slide = readObject(r);
    },
    Refresh_RecalcData: function () {
        History.RecalcData_Add({
            Type: historyrecalctype_Drawing,
            Object: this
        });
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SlideCommentsAddComment:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_SlideCommentsRemoveComment:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_SlideCommentsAddComment:
            var pos = r.GetLong();
            var id = r.GetString2();
            var pos2 = this.m_oContentChanges.Check(contentchanges_Add, pos);
            this.comments.splice(pos2, 0, g_oTableId.Get_ById(id));
            this.comments[pos2].slideComments = this;
            editor.sync_AddComment(id, this.comments[pos2].Data);
            break;
        case historyitem_SlideCommentsRemoveComment:
            var pos = r.GetLong();
            var pos2 = this.m_oContentChanges.Check(contentchanges_Remove, pos);
            var comment = this.comments.splice(pos2, 1)[0];
            editor.sync_RemoveComment(comment.Id);
            break;
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SlideCommentsAddComment:
            this.comments.splice(data.Pos, 1);
            editor.sync_RemoveComment(data.objectId);
            break;
        case historyitem_SlideCommentsRemoveComment:
            this.comments.splice(data.Pos, 0, g_oTableId.Get_ById(data.id));
            editor.sync_AddComment(this.comments[data.Pos].Get_Id(), this.comments[data.Pos].Data);
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SlideCommentsAddComment:
            this.comments.splice(data.Pos, 0, g_oTableId.Get_ById(data.objectId));
            editor.sync_AddComment(data.objectId, this.comments[data.Pos].Data);
            break;
        case historyitem_SlideCommentsRemoveComment:
            this.comments.splice(data.Pos, 1);
            editor.sync_RemoveComment(data.id);
            break;
        }
    }
};