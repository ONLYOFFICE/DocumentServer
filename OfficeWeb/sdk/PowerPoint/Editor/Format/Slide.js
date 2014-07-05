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
 function Slide(presentation, slideLayout, slideNum) {
    this.kind = SLIDE_KIND;
    this.presentation = editor.WordControl.m_oLogicDocument;
    this.graphicObjects = new CGraphicObjects(this);
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
    this.searchingArray = new Array();
    this.selectionArray = new Array();
    this.comments = [];
    this.writecomments = [];
    this.maxId = 1000;
    this.m_oContentChanges = new CContentChanges();
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
    this.calculateColors = function () {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes_count; ++_shape_index) {
            _shapes[_shape_index].calculateColors();
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
    this.changeNum = function (num) {
        this.num = num;
    };
    this.getBackground = function () {
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
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx);
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
                                    _master.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
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
        }
        if (_back_fill != null) {
            _back_fill.calculate(_theme, this, _layout, _master, RGBA);
        }
        return _back_fill;
    };
    this.commentX = 0;
    this.commentY = 0;
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (presentation) {
        this.setSlideComments(new SlideComments());
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
    setSlideComments: function (comments) {
        History.Add(this, {
            Type: historyitem_SetSlideComments,
            oldPr: this.slideComments,
            newPr: comments
        });
        this.slideComments = comments;
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
    setLayout: function (layout) {
        History.Add(this, {
            Type: historyitem_SetLayout,
            oldLayout: this.Layout,
            newLayout: layout
        });
        this.Layout = layout;
    },
    setSlideNum: function (num) {
        History.Add(this, {
            Type: historyitem_SetSlideNum,
            oldNum: this.num,
            newNum: num
        });
        this.num = num;
    },
    applyTiming: function (timing) {
        var oldTiming = this.timing.createDuplicate();
        this.timing.applyProps(timing);
        History.Add(this, {
            Type: historyitem_ChangeTiming,
            oldTiming: oldTiming,
            newTiming: this.timing.createDuplicate()
        });
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
    changeSize: function (kw, kh) {
        this.Width *= kw;
        this.Height *= kh;
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
        this.recalcAll();
    },
    setSlideSize: function (w, h) {
        History.Add(this, {
            Type: historyitem_SetSlideSizes,
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
            Type: historyitem_ChangeBg,
            oldBg: this.cSld.Bg ? this.cSld.Bg.createFullCopy() : null,
            newBg: bg
        });
        this.cSld.Bg = bg;
        this.recalcInfo.recalculateBackground = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setLocks: function (deleteLock, backgroundLock, timingLock, transitionLock, layoutLock) {
        this.deleteLock = deleteLock;
        this.backgroundLock = backgroundLock;
        this.timingLock = timingLock;
        this.transitionLock = transitionLock;
        this.layoutLock = layoutLock;
        History.Add(this, {
            Type: historyitem_AddSlideLocks,
            deleteLock: deleteLock.Get_Id(),
            backgroundLock: backgroundLock.Get_Id(),
            timingLock: timingLock.Get_Id(),
            transitionLock: transitionLock.Get_Id(),
            layoutLock: layoutLock.Get_Id()
        });
    },
    isLockRemove: function () {},
    recalcAll: function () {
        this.recalcInfo = {
            recalculateBackground: true,
            recalculateSpTree: true
        };
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalcAll();
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    recalcAllColors: function () {
        this.recalcInfo = {
            recalculateBackground: true,
            recalculateSpTree: true
        };
        for (var i = 0; i < this.cSld.spTree.length; ++i) {
            this.cSld.spTree[i].recalcAllColors();
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    Get_Id: function () {
        return this.Id;
    },
    recalculate: function () {
        if (this.recalcInfo.recalculateBackground) {
            this.recalculateBackground();
            this.recalcInfo.recalculateBackground = false;
        }
        if (this.recalcInfo.recalculateSpTree) {
            this.recalculateSpTree();
            this.recalcInfo.recalculateSpTree = false;
        }
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
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx);
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
                                    _master.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
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
    drawSelect: function () {
        this.graphicObjects.drawSelect(this.presentation.DrawingDocument);
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
    addSp: function (item) {
        this.cSld.spTree.push(item);
    },
    removeSelectedObjects: function () {
        var spTree = this.cSld.spTree;
        for (var i = spTree.length - 1; i > -1; --i) {
            if (spTree[i].selected) {
                History.Add(this, {
                    Type: historyitem_RemoveFromSpTree,
                    Pos: i,
                    id: spTree[i].Get_Id()
                });
                var obj = spTree.splice(i, 1)[0];
                if (obj.isPlaceholder() && !(obj.isEmptyPlaceholder && obj.isEmptyPlaceholder())) {
                    var m_s = this.Layout.getMatchingShape(obj.getPlaceholderType(), obj.getPlaceholderIndex(), obj.getIsSingleBody ? obj.getIsSingleBody() : false);
                    if (m_s) {
                        var shape = new CShape(this);
                        m_s.copy2(shape);
                        this.addToSpTreeToPos(i, shape);
                    }
                }
            }
        }
        this.graphicObjects.resetSelectionState();
    },
    shapeAdd: function (pos, item) {
        History.Add(this, {
            Type: historyitem_ShapeAdd,
            Pos: pos,
            item: item
        });
        this.cSld.spTree.splice(pos, 0, item);
    },
    alignLeft: function () {
        var selected_objects = this.graphicObjects.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            selected_objects[i].setXfrm(0, selected_objects[i].y, null, null, null, null, null);
        }
    },
    alignRight: function () {
        var selected_objects = this.graphicObjects.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            selected_objects[i].setXfrm(this.Width - selected_objects[i].extX, selected_objects[i].y, null, null, null, null, null);
        }
    },
    alignTop: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, 0, null, null, null, null, null);
        }
    },
    alignBottom: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, this.Height - this.graphicObjects.selectedObjects[i].extY, null, null, null, null, null);
        }
    },
    alignCenter: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm((this.Width - this.graphicObjects.selectedObjects[i].extX) * 0.5, this.graphicObjects.selectedObjects[i].y, null, null, null, null, null);
        }
    },
    alignMiddle: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, (this.Height - this.graphicObjects.selectedObjects[i].extY) * 0.5, null, null, null, null, null);
        }
    },
    distributeHor: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm((this.Width - this.graphicObjects.selectedObjects[i].extX) * 0.5, this.graphicObjects.selectedObjects[i].y, null, null, null, null, null);
        }
    },
    distributeVer: function () {
        for (var i = 0; i < this.graphicObjects.selectedObjects.length; ++i) {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, (this.Height - this.graphicObjects.selectedObjects[i].extY) * 0.5, null, null, null, null, null);
        }
    },
    bringToFront: function () {
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch (state.id) {
        case STATES_ID_NULL:
            var selected = [];
            for (var i = 0; i < sp_tree.length; ++i) {
                if (sp_tree[i].selected) {
                    selected.push(sp_tree[i]);
                }
            }
            this.removeSelectedObjects();
            for (i = 0; i < selected.length; ++i) {
                this.addToSpTreeToPos(sp_tree.length, selected[i]);
            }
            break;
        case STATES_ID_GROUP:
            break;
        }
    },
    bringForward: function () {
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch (state.id) {
        case STATES_ID_NULL:
            for (var i = sp_tree.length - 1; i > -1; --i) {
                var sp = sp_tree[i];
                if (sp.selected && i < sp_tree.length - 1 && !sp_tree[i + 1].selected) {
                    this.removeFromSpTreeById(sp.Get_Id());
                    this.addToSpTreeToPos(i + 1, sp);
                }
            }
            break;
        case STATES_ID_GROUP:
            break;
        }
    },
    sendToBack: function () {
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch (state.id) {
        case STATES_ID_NULL:
            var j = 0;
            for (var i = 0; i < this.cSld.spTree.length; ++i) {
                if (this.cSld.spTree[i].selected) {
                    var object = this.cSld.spTree[i];
                    this.removeFromSpTreeById(this.cSld.spTree[i].Get_Id());
                    this.addToSpTreeToPos(j, object);
                    ++j;
                }
            }
            break;
        case STATES_ID_GROUP:
            break;
        }
    },
    bringBackward: function () {
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch (state.id) {
        case STATES_ID_NULL:
            for (var i = 0; i < sp_tree.length; ++i) {
                var sp = sp_tree[i];
                if (sp.selected && i > 0 && !sp_tree[i - 1].selected) {
                    this.removeFromSpTreeById(sp.Get_Id());
                    this.addToSpTreeToPos(i - 1, sp);
                }
            }
            break;
        case STATES_ID_GROUP:
            break;
        }
    },
    removeFromSpTreeById: function (id) {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].Get_Id() === id) {
                History.Add(this, {
                    Type: historyitem_RemoveFromSpTree,
                    Pos: i,
                    id: sp_tree[i].Get_Id()
                });
                sp_tree.splice(i, 1);
                return i;
            }
        }
        return null;
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
    addToSpTreeToPos: function (pos, obj) {
        History.Add(this, {
            Type: historyitem_AddToSlideSpTree,
            objectId: obj.Get_Id(),
            Pos: pos
        });
        this.cSld.spTree.splice(pos, 0, obj);
        editor.WordControl.m_oLogicDocument.recalcMap[obj.Id] = obj;
    },
    isLockedObject: function () {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].Lock.Type !== locktype_Mine && sp_tree[i].Lock.Type !== locktype_None) {
                return true;
            }
        }
        return false;
    },
    Refresh_RecalcData: function () {},
    setCSldName: function (name) {
        History.Add(this, {
            Type: historyitem_SetCSldName,
            oldName: this.cSld.name,
            newName: name
        });
        this.cSld.name = name;
    },
    setClMapOverride: function (clrMap) {
        History.Add(this, {
            Type: historyitem_SetClrMapOverride,
            oldClrMap: this.clrMap,
            newClrMap: clrMap
        });
        this.clrMap = clrMap;
    },
    getBase64Img: function () {
        return ShapeToImageConverter(this, 0).ImageUrl;
    },
    checkNoTransformPlaceholder: function () {
        var sp_tree = this.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            var sp = sp_tree[i];
            if (sp instanceof CShape || sp instanceof CImageShape) {
                if (sp.isPlaceholder && sp.isPlaceholder()) {
                    sp.recalcInfo.recalculateShapeHierarchy = true;
                    var hierarchy = sp.getHierarchy();
                    for (var j = 0; j < hierarchy.length; ++j) {
                        if (isRealObject(hierarchy[j])) {
                            break;
                        }
                    }
                    if (j === hierarchy.length) {
                        sp.setOffset(sp.x, sp.y);
                        sp.setExtents(sp.extX, sp.extY);
                    }
                }
            }
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetSlideSizes:
            this.Width = data.oldW;
            this.Height = data.oldH;
            break;
        case historyitem_AddComment:
            this.comments.splice(data.pos, 1);
            editor.sync_RemoveComment(data.objectId);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.index, 0, g_oTableId.Get_ById(data.id));
            editor.sync_AddComment(this.comments[data.index].Get_Id(), this.comments[data.index].Data);
            break;
        case historyitem_SetSlideComments:
            this.slideComments = data.oldPr;
            break;
        case historyitem_RemoveFromSpTree:
            this.cSld.spTree.splice(data.Pos, 0, g_oTableId.Get_ById(data.id));
            break;
        case historyitem_AddToSlideSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
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
            this.cSld.spTree.splice(data.Pos, 1);
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
        if (!isRealObject(this.Layout)) {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetSlideSizes:
            this.Width = data.newW;
            this.Height = data.newH;
            break;
        case historyitem_AddComment:
            this.comments.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
            editor.sync_AddComment(data.objectId, this.comments[data.pos].Data);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.index, 1);
            editor.sync_RemoveComment(data.id);
            break;
        case historyitem_SetSlideComments:
            this.slideComments = data.newPr;
            break;
        case historyitem_RemoveFromSpTree:
            this.cSld.spTree.splice(data.Pos, 1);
            break;
        case historyitem_AddToSlideSpTree:
            this.cSld.spTree.splice(data.Pos, 0, g_oTableId.Get_ById(data.objectId));
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
            this.cSld.spTree.splice(data.Pos, 0, data.item);
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
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Slide);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetSlideSizes:
            w.WriteDouble(data.newW);
            w.WriteDouble(data.newH);
            break;
        case historyitem_AddComment:
            w.WriteLong(data.pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_RemoveComment:
            w.WriteLong(data.index);
            break;
        case historyitem_SetSlideComments:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
            }
            break;
        case historyitem_RemoveFromSpTree:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            break;
        case historyitem_AddToSlideSpTree:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
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
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
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
        case historyitem_SetSlideSizes:
            this.Width = r.GetDouble();
            this.Height = r.GetDouble();
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
        case historyitem_SetSlideComments:
            if (r.GetBool()) {
                this.slideComments = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.slideComments = null;
            }
            break;
        case historyitem_RemoveFromSpTree:
            var pos = this.m_oContentChanges.Check(contentchanges_Remove, r.GetLong());
            this.cSld.spTree.splice(pos, 1);
            break;
        case historyitem_AddToSlideSpTree:
            var pos = this.m_oContentChanges.Check(contentchanges_Add, r.GetLong());
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
            var bg = this.cSld.Bg;
            if (bg && bg.bgPr && bg.bgPr.Fill && bg.bgPr.Fill.fill instanceof CBlipFill && typeof bg.bgPr.Fill.fill.RasterImageId === "string") {
                CollaborativeEditing.Add_NewImage(bg.bgPr.Fill.fill.RasterImageId);
            }
            this.recalcInfo.recalculateBackground = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
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
            var pos = this.m_oContentChanges.Check(contentchanges_Add, r.GetLong());
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
                if ("" != commentData.m_sUserName) {
                    _comments_id.push(_wc.WriteCommentId);
                    _comments_data.push(commentData);
                    _comments_data_author_id.push(_wc.WriteAuthorId);
                    _wc.ParceAdditionalData(commentData);
                    var comment = new CComment(undefined, new CCommentData());
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
            w.WriteBool(typeof data.newId === "string");
            if (typeof data.newId === "string") {
                w.WriteString2(data.newId);
            }
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_PropLockerSetId:
            if (r.GetBool()) {
                this.objectId = r.GetString2();
            } else {
                this.objectId = null;
            }
            break;
        }
    },
    Refresh_RecalcData: function () {}
};
function SlideComments() {
    this.comments = [];
    this.m_oContentChanges = new CContentChanges();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
SlideComments.prototype = {
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
            Type: historyitem_AddComment,
            objectId: comment.Get_Id(),
            Pos: this.comments.length
        });
        this.comments.splice(this.comments.length, 0, comment);
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
                    Type: historyitem_RemoveComment,
                    Pos: i,
                    id: id
                });
                this.comments.splice(i, 1);
                return;
            }
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_SlideComments);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Refresh_RecalcData: function () {},
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_AddComment:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            w.WriteString2(data.objectId);
            break;
        case historyitem_RemoveComment:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_AddComment:
            var pos = r.GetLong();
            var id = r.GetString2();
            var pos2 = this.m_oContentChanges.Check(contentchanges_Add, pos);
            this.comments.splice(pos2, 0, g_oTableId.Get_ById(id));
            editor.sync_AddComment(id, this.comments[pos2].Data);
            break;
        case historyitem_RemoveComment:
            var pos = r.GetLong();
            var pos2 = this.m_oContentChanges.Check(contentchanges_Remove, pos);
            var comment = this.comments.splice(pos2, 1)[0];
            editor.sync_RemoveComment(comment.Id);
            break;
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_AddComment:
            this.comments.splice(data.Pos, 1);
            editor.sync_RemoveComment(data.objectId);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.Pos, 0, g_oTableId.Get_ById(data.id));
            editor.sync_AddComment(this.comments[data.index].Get_Id(), this.comments[data.index].Data);
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_AddComment:
            this.comments.splice(data.Pos, 0, g_oTableId.Get_ById(data.objectId));
            editor.sync_AddComment(data.objectId, this.comments[data.Pos].Data);
            break;
        case historyitem_RemoveComment:
            this.comments.splice(data.Pos, 1);
            editor.sync_RemoveComment(data.id);
            break;
        }
    }
};