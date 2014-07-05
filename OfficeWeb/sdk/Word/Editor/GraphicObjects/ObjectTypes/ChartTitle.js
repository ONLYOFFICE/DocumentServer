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
 var CHART_TITLE_TYPE_TITLE = 0;
var CHART_TITLE_TYPE_H_AXIS = 1;
var CHART_TITLE_TYPE_V_AXIS = 2;
var paraDrawing;
function CChartTitle(chartGroup, type) {
    this.layout = null;
    this.overlay = false;
    this.spPr = new CSpPr();
    this.txPr = null;
    this.isDefaultText = false;
    this.txBody = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.brush = null;
    this.pen = null;
    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);
    this.invertTransform = new CMatrix();
    this.invertTransformText = new CMatrix();
    this.transform = new CMatrix();
    this.transformText = new CMatrix();
    this.recalculateInfo = {
        recalculateTransform: true,
        recalculateBrush: true,
        recalculatePen: true
    };
    this.recalcInfo = {};
    this.selected = false;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(chartGroup)) {
        this.setChartGroup(chartGroup);
        this.addTextBody(new CTextBody(this));
    }
    if (isRealNumber(type)) {
        this.setType(type);
    }
}
CChartTitle.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_CHART_TITLE;
    },
    setChartGroup: function (chartGroup) {
        var oldPr = this.chartGroup;
        var newPr = chartGroup;
        History.Add(this, {
            Type: historyitem_AutoShapes_SetChartGroup,
            oldPr: oldPr,
            newPr: newPr
        });
        this.chartGroup = chartGroup;
    },
    getAllFonts: function (AllFonts) {
        if (this.txBody && this.txBody.content) {
            AllFonts["Calibri"] = true;
            this.txBody.content.Document_Get_AllFontNames(AllFonts);
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    getTitleType: function () {
        if (this === this.chartGroup.chartTitle) {
            return CHART_TITLE_TYPE_TITLE;
        }
        if (this === this.chartGroup.hAxisTitle) {
            return CHART_TITLE_TYPE_H_AXIS;
        }
        if (this === this.chartGroup.vAxisTitle) {
            return CHART_TITLE_TYPE_V_AXIS;
        }
    },
    isEmpty: function () {
        return isRealObject(this.txBody) ? this.txBody.isEmpty() : true;
    },
    setType: function (type) {
        History.Add(this, {
            Type: historyitem_AutoShapes_SetChartTitleType,
            oldPr: this.type,
            newPr: type
        });
        this.type = type;
    },
    Get_Styles: function () {
        return new CStyles();
    },
    select: function (pageIndex) {
        this.selected = true;
        this.selectStartPage = pageIndex;
    },
    deselect: function () {
        this.selected = false;
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Selection_Remove();
        }
        this.selectStartPage = -1;
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        this.txBody.content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
        this.recalculatePosExt();
        this.txBody.recalculateCurPos();
    },
    getParagraphParaPr: function () {
        if (this.txBody) {
            var ret = this.txBody.content.Get_Paragraph_ParaPr();
            ret.PStyle = undefined;
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_TextPr();
        }
        return null;
    },
    getStyles: function () {
        var styles = new CStyles();
        var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
        default_legend_style.TextPr.FontFamily = {
            Name: "Calibri",
            Index: -1
        };
        default_legend_style.TextPr.Bold = true;
        default_legend_style.TextPr.RFonts = new CRFonts();
        default_legend_style.TextPr.RFonts.Ascii = {
            Name: "Calibri",
            Index: -1
        };
        default_legend_style.TextPr.RFonts.EastAsia = {
            Name: "Calibri",
            Index: -1
        };
        default_legend_style.TextPr.RFonts.HAnsi = {
            Name: "Calibri",
            Index: -1
        };
        default_legend_style.TextPr.RFonts.CS = {
            Name: "Calibri",
            Index: -1
        };
        if (this.getTitleType() === CHART_TITLE_TYPE_TITLE) {
            default_legend_style.TextPr.FontSize = 18;
        } else {
            default_legend_style.TextPr.FontSize = 10;
        }
        default_legend_style.ParaPr.Spacing.After = 0;
        default_legend_style.ParaPr.Spacing.Before = 0;
        default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
        default_legend_style.ParaPr.Spacing.Line = 1;
        default_legend_style.ParaPr.Jc = align_Center;
        var tx_pr;
        if (isRealObject(this.txPr)) {}
        styles.Style[styles.Id] = default_legend_style;
        return styles;
    },
    initFromString: function (title) {
        this.textBody.initFromString(title);
    },
    setDefaultText: function (val) {
        this.isDefaultText = val;
    },
    recalculateTransform: function () {
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
        global_MatrixTransformer.MultiplyAppend(this.transform, this.chartGroup.getTransform());
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },
    recalculateTransform2: function () {
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
        global_MatrixTransformer.MultiplyAppend(this.transform, this.chartGroup.getTransform());
    },
    setTextBody: function (txBody) {
        this.txBody = txBody;
    },
    setLayoutX: function (x) {
        if (!isRealObject(this.layout)) {
            this.layout = new CChartLayout();
        }
        this.layout.setX(x);
    },
    setLayoutY: function (y) {
        if (!isRealObject(this.layout)) {
            this.layout = new CChartLayout();
        }
        this.layout.setY(y);
    },
    addTextBody: function (txBody) {
        var oldPr = this.txBody;
        var newPr = txBody;
        History.Add(this, {
            Type: historyitem_AutoShapes_SetChartTitleTxBody,
            oldPr: oldPr,
            newPr: newPr
        });
        this.txBody = txBody;
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        if (!isRealObject(this.txBody)) {
            this.txBody = new CTextBody(this);
        }
        this.txBody.paragraphAdd(paraItem, true);
        this.recalculatePosExt();
        this.txBody.recalculateCurPos();
    },
    recalculatePosExt: function () {
        var old_cx = this.x + this.extX * 0.5;
        var old_cy = this.y + this.extY * 0.5;
        var bodyPr = this.txBody.getBodyPr();
        switch (this.type) {
        case CHART_TITLE_TYPE_TITLE:
            case CHART_TITLE_TYPE_H_AXIS:
            var max_title_width = this.chartGroup.absExtX * 0.8;
            var title_width = this.txBody.getRectWidth(max_title_width);
            this.extX = title_width;
            this.extY = this.txBody.getRectHeight(this.chartGroup.absExtY, title_width - (bodyPr.rIns + bodyPr.lIns));
            this.x = old_cx - this.extX * 0.5;
            if (this.x + this.extX > this.chartGroup.absExtX) {
                this.x = this.chartGroup.absExtX - this.extX;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            this.y = old_cy - this.extY * 0.5;
            if (this.y + this.extY > this.chartGroup.absExtY) {
                this.y = this.chartGroup.absExtY - this.extY;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (isRealObject(this.layout) && isRealNumber(this.layout.x)) {
                this.layout.setX(this.x / this.chartGroup.absExtX);
            }
            break;
        case CHART_TITLE_TYPE_V_AXIS:
            var max_title_height = this.chartGroup.absExtY * 0.8;
            var body_pr = this.txBody.getBodyPr();
            this.extY = this.txBody.getRectWidth(max_title_height) - body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns;
            this.extX = this.txBody.getRectHeight(this.chartGroup.absExtX, this.extY) - (-body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns);
            this.spPr.geometry.Recalculate(this.extX, this.extY);
            this.x = old_cx - this.extX * 0.5;
            if (this.x + this.extX > this.chartGroup.absExtX) {
                this.x = this.chartGroup.absExtX - this.extX;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            this.y = old_cy - this.extY * 0.5;
            if (this.y + this.extY > this.chartGroup.absExtY) {
                this.y = this.chartGroup.absExtY - this.extY;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (isRealObject(this.layout) && isRealNumber(this.layout.y)) {
                this.layout.setY(this.y / this.chartGroup.absExtY);
            }
            break;
        }
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.recalculateTransform();
        this.calculateContent();
        this.calculateTransformTextMatrix();
    },
    applyTextPr: function (paraItem, bRecalculate) {
        this.txBody.content.Set_ApplyToAll(true);
        this.txBody.content.Paragraph_Add(paraItem, bRecalculate);
        this.txBody.content.Set_ApplyToAll(false);
    },
    updateSelectionState: function (drawingDocument) {
        this.txBody.updateSelectionState(drawingDocument);
    },
    updateCursorType: function (e, x, y, pageIndex) {
        var invert = this.invertTransformText;
        var tx = invert.TransformPointX(x, y, pageIndex);
        var ty = invert.TransformPointY(x, y, pageIndex);
        this.txBody.content.Update_CursorType(tx, ty, pageIndex);
    },
    recalculateCurPos: function () {
        if (this.txBody) {
            this.txBody.recalculateCurPos();
        }
    },
    cursorMoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveLeft(AddToSelect, Word);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    cursorMoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveRight(AddToSelect, Word);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    cursorMoveUp: function (AddToSelect) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveUp(AddToSelect);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    cursorMoveDown: function (AddToSelect) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveDown(AddToSelect);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    cursorMoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveEndOfLine(AddToSelect);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    cursorMoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Cursor_MoveStartOfLine(AddToSelect);
            this.recalculateCurPos();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    },
    drawTextSelection: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.drawTextSelection();
        }
    },
    calculateContent: function () {
        if (this.txBody) {
            this.txBody.calculateContent();
        }
    },
    getColorMap: function () {
        return this.chartGroup.drawingObjects.controller.getColorMap();
    },
    getTheme: function () {
        return this.chartGroup.drawingObjects.getWorkbook().theme;
    },
    calculateTransformTextMatrix: function () {
        if (this.txBody === null) {
            return;
        }
        this.transformText.Reset();
        var _text_transform = this.transformText;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        } else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }
        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }
        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }
        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);
        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);
        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);
        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);
        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;
        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;
        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        if (_body_pr.upright === false) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (_content_height < _text_rect_height) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_height - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                } else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            } else {
                if (_content_height < _text_rect_width) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_width - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (_body_pr.vert === nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                } else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
            if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
                var rect = this.spPr.geometry.rect;
                this.clipRect = {
                    x: rect.l,
                    y: rect.t,
                    w: rect.r - rect.l,
                    h: rect.b - rect.t
                };
            } else {
                this.clipRect = {
                    x: 0,
                    y: 0,
                    w: this.absExtX,
                    h: this.absExtY
                };
            }
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.absExtX * 0.5;
            var _vc = this.absExtY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25) || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25) || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                } else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            } else {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                } else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }
            if (_content_height < content_height2) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = content_height2 - _content_height;
                    break;
                case 1:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;
            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;
            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            } else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }
            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            } else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);
            var body_pr = this.bodyPr;
            var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 1;
            var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 0.5;
            var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 0.5;
            var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 0.5;
            this.clipRect = {
                x: -l_ins,
                y: -_vertical_shift - t_ins,
                w: this.contentWidth + (r_ins + l_ins),
                h: this.contentHeight + (b_ins + t_ins)
            };
        }
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    },
    recalculateAfterTextAdd: function () {
        switch (this.type) {
        case CHART_TITLE_TYPE_TITLE:
            var body_pr = this.txBody.bodyPr;
            var r_ins = isRealNumber(body_pr.rIns) ? body_pr.rIns : 1.27;
            var l_ins = isRealNumber(body_pr.lIns) ? body_pr.lIns : 2.54;
            var t_ins = isRealNumber(body_pr.tIns) ? body_pr.tIns : 1.27;
            var b_ins = isRealNumber(body_pr.bIns) ? body_pr.bIns : 1.27;
            var max_width = this.chartGroup.extX * 0.8 - r_ins - l_ins;
            var title_content = this.txBody.content;
            title_content.Reset(0, 0, max_width, 20000);
            title_content.Recalculate_Page(0);
            var result_width;
            if (! (title_content.Content.length > 1 || title_content.Content[0].Lines.length > 1)) {
                if (title_content.Content[0].Lines[0].Ranges[0].W < max_width) {
                    title_content.Reset(0, 0, title_content.Content[0].Lines[0].Ranges[0].W, 20000);
                    title_content.Recalculate_Page(0);
                }
                result_width = title_content.Content[0].Lines[0].Ranges[0].W + r_ins + l_ins;
            } else {
                var width = 0;
                for (var i = 0; i < title_content.Content.length; ++i) {
                    var par = title_content.Content[i];
                    for (var j = 0; j < par.Lines.length; ++j) {
                        if (par.Lines[j].Ranges[0].W > width) {
                            width = par.Lines[j].Ranges[0].W;
                        }
                    }
                }
                result_width = width + r_ins + l_ins;
            }
            this.extX = result_width;
            this.extY = title_content.Get_SummaryHeight() + r_ins + l_ins;
            this.x = this.chartGroup.extX - this.extX * 0.5;
            this.y = 2.5;
            break;
        }
    },
    recalculateBrush: function () {},
    recalculatePen: function () {},
    draw: function (graphics, pageIndex) {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transformText);
        if (window.IsShapeToImageConverter) {
            pageIndex = 0;
        }
        if (graphics.CheckUseFonts2 !== undefined) {
            graphics.CheckUseFonts2(this.transformText);
        }
        this.txBody.draw(graphics, pageIndex);
        if (graphics.UncheckUseFonts2 !== undefined) {
            graphics.UncheckUseFonts2();
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },
    selectionSetStart: function (event, x, y, pageIndex) {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        if (typeof this.selectStartPage === "number" && this.selectStartPage > -1) {
            this.txBody.content.Set_StartPage(this.selectStartPage);
        }
        this.txBody.content.Selection_SetStart(t_x, t_y, typeof this.selectStartPage === "number" && this.selectStartPage > -1 ? this.selectStartPage : this.pageIndex, event);
    },
    selectionSetEnd: function (event, x, y, pageIndex) {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        if (typeof this.selectStartPage === "number" && this.selectStartPage > -1) {
            this.txBody.content.Set_StartPage(this.selectStartPage);
        }
        this.txBody.content.Selection_SetEnd(t_x, t_y, typeof this.selectStartPage === "number" && this.selectStartPage > -1 ? this.selectStartPage : this.pageIndex, event);
    },
    setPosition: function (x, y) {
        var layout = new CChartLayout();
        layout.setIsManual(true);
        layout.setXMode(LAYOUT_MODE_EDGE);
        layout.setX(x / this.chartGroup.absExtX);
        layout.setYMode(LAYOUT_MODE_EDGE);
        layout.setY(y / this.chartGroup.absExtY);
        this.setLayout(layout);
    },
    setLayout: function (layout) {
        var oldLayout = this.layout ? this.layout.createDuplicate() : null;
        var newLayout = layout ? layout.createDuplicate() : null;
        History.Add(this, {
            Type: historyitem_SetCahrtLayout,
            oldLayout: oldLayout,
            newLayout: newLayout
        });
        this.layout = layout;
    },
    hit: function (x, y) {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return false;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    hitInTextRect: function (x, y) {
        if (isRealObject(this.txBody)) {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < this.txBody.contentWidth && t_y > 0 && t_y < this.txBody.contentHeight;
        }
        return false;
    },
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
    },
    getInvertTransform: function () {
        return this.invertTransform;
    },
    writeToBinary: function (w) {
        w.WriteBool(isRealObject(this.layout));
        if (isRealObject(this.layout)) {
            this.layout.writeToBinary(w);
        }
        w.WriteBool(this.overlay);
        this.spPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.txBody));
        if (isRealObject(this.txBody)) {
            this.txBody.writeToBinary(w);
        }
    },
    readFromBinary: function (r) {
        if (r.GetBool()) {
            var layout = new CChartLayout();
            layout.Read_FromBinary2(r);
            this.setLayout(layout);
        }
        this.overlay = r.GetBool();
        this.spPr.Read_FromBinary2(r);
        if (r.GetBool()) {
            this.txBody.readFromBinary(r);
        }
    },
    copy: function (chartGroup, type) {
        var c = new CChartTitle(chartGroup, type);
        if (this.layout) {
            c.setLayout(this.layout.copy());
        }
        c.overlay = this.overlay;
        c.txBody.copyFromOther(this.txBody);
        return c;
    },
    setBodyPr: function (bodyPr) {
        var old_body_pr = this.txBody.bodyPr;
        this.txBody.bodyPr = bodyPr;
        var new_body_pr = this.txBody.bodyPr.createDuplicate();
        History.Add(this, {
            Type: historyitem_SetShapeBodyPr,
            oldBodyPr: old_body_pr,
            newBodyPr: new_body_pr
        });
        this.txBody.recalcInfo.recalculateBodyPr = true;
    },
    setOverlay: function (overlay) {
        var _overlay = overlay === true;
        History.Add(this, {
            Type: historyitem_AutoShapes_SetChartTitleOverlay,
            oldPr: this.overlay === true,
            newPr: _overlay
        });
        this.overlay = _overlay;
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetCahrtLayout:
            if (isRealObject(data.oldLayout)) {
                this.layout = data.oldLayout.createDuplicate();
            } else {
                this.layout = null;
            }
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.oldBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_AutoShapes_SetChartGroup:
            this.chartGroup = data.oldPr;
            break;
        case historyitem_AutoShapes_SetChartTitleType:
            this.type = data.oldPr;
            break;
        case historyitem_AutoShapes_SetChartTitleOverlay:
            this.overlay = data.oldPr;
            break;
        case historyitem_AutoShapes_SetChartTitleTxBody:
            this.txBody = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetCahrtLayout:
            if (isRealObject(data.newLayout)) {
                this.layout = data.newLayout.createDuplicate();
            } else {
                this.layout = null;
            }
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.newBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_AutoShapes_SetChartGroup:
            this.chartGroup = data.newPr;
            break;
        case historyitem_AutoShapes_SetChartTitleType:
            this.type = data.newPr;
            break;
        case historyitem_AutoShapes_SetChartTitleOverlay:
            this.overlay = data.newPr;
            break;
        case historyitem_AutoShapes_SetChartTitleTxBody:
            this.txBody = data.newPr;
            break;
        }
    },
    Refresh_RecalcData: function () {},
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_ChartTitle);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_ChartTitle);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetCahrtLayout:
            w.WriteBool(isRealObject(data.newLayout));
            if (isRealObject(data.newLayout)) {
                data.newLayout.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeBodyPr:
            data.newBodyPr.Write_ToBinary2(w);
            break;
        case historyitem_AutoShapes_SetChartGroup:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
            }
            break;
        case historyitem_AutoShapes_SetChartTitleType:
            w.WriteBool(isRealNumber(data.newPr));
            if (isRealNumber(data.newPr)) {}
            w.WriteLong(data.newPr);
            break;
        case historyitem_AutoShapes_SetChartTitleOverlay:
            w.WriteBool(data.newPr);
            break;
        case historyitem_AutoShapes_SetChartTitleTxBody:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
            }
            break;
        }
    },
    Load_Changes: function (r) {
        if (r.GetLong() === historyitem_type_ChartTitle) {
            switch (r.GetLong()) {
            case historyitem_SetCahrtLayout:
                if (r.GetBool()) {
                    this.layout = new CChartLayout();
                    this.layout.Read_FromBinary2(r);
                } else {
                    this.layout = null;
                }
                break;
            case historyitem_SetShapeBodyPr:
                this.txBody.bodyPr = new CBodyPr();
                this.txBody.bodyPr.Read_FromBinary2(r);
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            case historyitem_AutoShapes_SetChartGroup:
                if (r.GetBool()) {
                    this.chartGroup = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.chartGroup = null;
                }
                break;
            case historyitem_AutoShapes_SetChartTitleType:
                if (r.GetBool()) {
                    this.type = r.GetLong();
                } else {
                    this.type = null;
                }
                break;
            case historyitem_AutoShapes_SetChartTitleOverlay:
                this.overlay = r.GetBool();
                break;
            case historyitem_AutoShapes_SetChartTitleTxBody:
                if (r.GetBool()) {
                    this.txBody = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.txBody = null;
                }
                break;
            }
        }
    },
    OnContentReDraw: function () {
        if (this.chartGroup) {
            this.chartGroup.OnContentReDraw();
        }
    }
};