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
 var TRANSLATE_HANDLE_NO_FLIP = [];
TRANSLATE_HANDLE_NO_FLIP[0] = 0;
TRANSLATE_HANDLE_NO_FLIP[1] = 1;
TRANSLATE_HANDLE_NO_FLIP[2] = 2;
TRANSLATE_HANDLE_NO_FLIP[3] = 3;
TRANSLATE_HANDLE_NO_FLIP[4] = 4;
TRANSLATE_HANDLE_NO_FLIP[5] = 5;
TRANSLATE_HANDLE_NO_FLIP[6] = 6;
TRANSLATE_HANDLE_NO_FLIP[7] = 7;
var TRANSLATE_HANDLE_FLIP_H = [];
TRANSLATE_HANDLE_FLIP_H[0] = 2;
TRANSLATE_HANDLE_FLIP_H[1] = 1;
TRANSLATE_HANDLE_FLIP_H[2] = 0;
TRANSLATE_HANDLE_FLIP_H[3] = 7;
TRANSLATE_HANDLE_FLIP_H[4] = 6;
TRANSLATE_HANDLE_FLIP_H[5] = 5;
TRANSLATE_HANDLE_FLIP_H[6] = 4;
TRANSLATE_HANDLE_FLIP_H[7] = 3;
var TRANSLATE_HANDLE_FLIP_V = [];
TRANSLATE_HANDLE_FLIP_V[0] = 6;
TRANSLATE_HANDLE_FLIP_V[1] = 5;
TRANSLATE_HANDLE_FLIP_V[2] = 4;
TRANSLATE_HANDLE_FLIP_V[3] = 3;
TRANSLATE_HANDLE_FLIP_V[4] = 2;
TRANSLATE_HANDLE_FLIP_V[5] = 1;
TRANSLATE_HANDLE_FLIP_V[6] = 0;
TRANSLATE_HANDLE_FLIP_V[7] = 7;
var TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V = [];
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[0] = 4;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[1] = 5;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[2] = 6;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[3] = 7;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[4] = 0;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[5] = 1;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[6] = 2;
TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[7] = 3;
var SHAPE_ASPECTS = {};
SHAPE_ASPECTS["can"] = 3616635 / 4810125;
SHAPE_ASPECTS["moon"] = 0.5;
SHAPE_ASPECTS["leftBracket"] = 0.08;
SHAPE_ASPECTS["rightBracket"] = 0.08;
SHAPE_ASPECTS["leftBrace"] = 0.17;
SHAPE_ASPECTS["rightBrace"] = 0.17;
var MIN_SHAPE_SIZE = 1.27;
var MIN_SHAPE_SIZE_DIV2 = MIN_SHAPE_SIZE / 2;
var MIN_ANGLE = 0.07000000000000001;
function MoveTrackShape(originalShape, majorOffsetX, majorOffsetY, bChart) {
    this.originalShape = originalShape;
    this.posX = originalShape.absOffsetX;
    this.posY = originalShape.absOffsetY;
    this.pageIndex = originalShape.pageIndex;
    this.flipH = this.originalShape.absFlipH;
    this.flipV = this.originalShape.absFlipV;
    this.horCenter = this.originalShape.absExtX * 0.5;
    this.verCenter = this.originalShape.absExtY * 0.5;
    this.rot = this.originalShape.absRot;
    this.majorOffsetX = majorOffsetX;
    this.majorOffsetY = majorOffsetY;
    this.transformMatrix = originalShape.transform.CreateDublicate();
    this.geometry = originalShape.geometry;
    this.brush = originalShape.brush;
    this.pen = originalShape.pen;
    if (bChart === true) {
        var brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color = new CUniColor();
        brush.fill.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        brush.fill.color.color = new CRGBColor();
        brush.fill.color.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        var pen = new CLn();
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color = new CUniColor();
        pen.Fill.fill.color.color = new CRGBColor();
        this.brush = brush;
        this.pen = pen;
    }
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.originalShape.absExtX, this.originalShape.absExtY, this.brush, this.pen, this.transformMatrix);
    this.track = function (posX, posY, pageIndex) {
        this.posX = posX + this.majorOffsetX;
        this.posY = posY + this.majorOffsetY;
        this.pageIndex = pageIndex;
        this.calculateTransformMatrix();
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.originalShape.spPr.geometry);
        shape_drawer.draw(this.originalShape.spPr.geometry);
        overlay.reset();
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.getBoundsRect = function () {
        var or_sp = this.originalShape;
        var t = this.transformMatrix;
        var min_x, max_x, min_y, max_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var arr = [{
            x: or_sp.absExtX,
            y: 0
        },
        {
            x: or_sp.absExtX,
            y: or_sp.absExtY
        },
        {
            x: 0,
            y: or_sp.absExtY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.trackEnd = function (e) {
        if (!e.CtrlKey) {
            this.boolChangePos = true;
            this.originalShape.setAbsoluteTransform(this.posX, this.posY, null, null, null, null, null);
            this.originalShape.calculateTransformMatrix();
            this.originalShape.calculateTransformTextMatrix();
            this.originalShape.calculateLeftTopPoint();
        } else {
            var parent = this.originalShape.parent;
            var para_drawing = this.originalShape.parent.copy();
            this.originalShape = para_drawing.GraphicObj;
            var near_pos = this.originalShape.document.Get_NearestPos(this.pageIndex, this.posX, this.posY);
            para_drawing.Set_XYForAdd(this.posX, this.posY, near_pos, this.pageIndex);
            para_drawing.Add_ToDocument(near_pos);
            this.originalShape.setAbsoluteTransform(this.posX, this.posY, null, null, null, null, null);
            this.originalShape.calculateTransformMatrix();
            this.originalShape.calculateTransformTextMatrix();
            this.originalShape.calculateLeftTopPoint();
        }
    };
    this.calculateTransformMatrix = function () {
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.horCenter;
        var _vertical_center = this.verCenter;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.flipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.flipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(_transform, this.posX, this.posY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
    };
}
function ResizeTrackShape(originalShape, numberHandle, pageIndex, bChart) {
    this.originalShape = originalShape;
    this.numberHandle = numberHandle;
    this.pageIndex = pageIndex;
    this.flipH = originalShape.absFlipH;
    this.flipV = originalShape.absFlipV;
    var _flip_h = originalShape.absFlipH;
    var _flip_v = originalShape.absFlipV;
    var _half_height = originalShape.absExtY * 0.5;
    var _half_width = originalShape.absExtX * 0.5;
    var _sin = Math.sin(originalShape.absRot);
    var _cos = Math.cos(originalShape.absRot);
    this.bChart = originalShape instanceof CChartAsGroup;
    var _translated_num_handle;
    if (!_flip_h && !_flip_v) {
        _translated_num_handle = numberHandle;
    } else {
        if (_flip_h && !_flip_v) {
            _translated_num_handle = TRANSLATE_HANDLE_FLIP_H[numberHandle];
        } else {
            if (!_flip_h && _flip_v) {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_V[numberHandle];
            } else {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[numberHandle];
            }
        }
    }
    this.bAspect = numberHandle % 2 === 0;
    this.aspect = this.bAspect === true ? this.originalShape.getAspect(_translated_num_handle) : 0;
    this.sin = _sin;
    this.cos = _cos;
    this.translatetNumberHandle = _translated_num_handle;
    switch (_translated_num_handle) {
    case 0:
        case 1:
        this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + originalShape.absOffsetX;
        this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + originalShape.absOffsetY;
        break;
    case 2:
        case 3:
        this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + originalShape.absOffsetX;
        this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + originalShape.absOffsetY;
        break;
    case 4:
        case 5:
        this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + originalShape.absOffsetX;
        this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + originalShape.absOffsetY;
        break;
    case 6:
        case 7:
        this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + originalShape.absOffsetX;
        this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + originalShape.absOffsetY;
        break;
    }
    this.mod = this.translatetNumberHandle % 4;
    this.centerPointX = originalShape.absOffsetX + _half_width;
    this.centerPointY = originalShape.absOffsetY + _half_height;
    this.lineFlag = originalShape.checkLine();
    this.originalExtX = originalShape.absExtX;
    this.originalExtY = originalShape.absExtY;
    this.originalFlipH = _flip_h;
    this.originalFlipV = _flip_v;
    this.usedExtX = this.originalExtX === 0 ? (0.01) : this.originalExtX;
    this.usedExtY = this.originalExtY === 0 ? (0.01) : this.originalExtY;
    this.resizedExtX = this.originalExtX;
    this.resizedExtY = this.originalExtY;
    this.resizedflipH = _flip_h;
    this.resizedflipV = _flip_v;
    this.resizedPosX = originalShape.absOffsetX;
    this.resizedPosY = originalShape.absOffsetY;
    this.resizedRot = originalShape.absRot;
    this.transformMatrix = originalShape.transform.CreateDublicate();
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    if (originalShape instanceof CChartAsGroup) {
        var brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color = new CUniColor();
        brush.fill.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        brush.fill.color.color = new CRGBColor();
        brush.fill.color.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        var pen = new CLn();
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color = new CUniColor();
        pen.Fill.fill.color.color = new CRGBColor();
        this.pen = pen;
        this.brush = brush;
    } else {
        this.pen = originalShape.pen;
        this.brush = originalShape.brush;
    }
    this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.resizedExtX, this.resizedExtY, this.brush, this.pen, this.transformMatrix);
    this.textMatrix = null;
    if (isRealObject(this.originalShape.parent)) {
        if (this.originalShape.parent.Is_Inline()) {
            if (this.originalShape.parent.DocumentContent instanceof CDocumentContent) {
                var cur_doc_content = this.originalShape.parent.DocumentContent;
                while (cur_doc_content.Is_TableCellContent()) {
                    cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                }
                if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                    this.textMatrix = cur_doc_content.Parent.transformText;
                }
            }
        }
    }
    this.resize = function (kd1, kd2, shiftKey) {
        var _cos = this.cos;
        var _sin = this.sin;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        var _new_resize_half_width;
        var _new_resize_half_height;
        var _new_used_half_width;
        var _new_used_half_height;
        var _temp;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        switch (this.translatetNumberHandle) {
        case 0:
            case 1:
            if (this.translatetNumberHandle === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                if (!this.bChart) {
                    this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                    if (_real_width < 0) {
                        this.resizedflipH = !this.originalFlipH;
                    } else {
                        this.resizedflipH = this.originalFlipH;
                    }
                } else {
                    this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                }
            }
            if (this.translatetNumberHandle === 1) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            if (!this.bChart) {
                this.resizedExtY = (_abs_height >= MIN_SHAPE_SIZE) || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            } else {
                this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 2:
            case 3:
            if (this.translatetNumberHandle === 2) {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                if (!this.bChart) {
                    this.resizedExtY = (_abs_height >= MIN_SHAPE_SIZE) || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                    if (_real_height < 0) {
                        this.resizedflipV = !this.originalFlipV;
                    } else {
                        this.resizedflipV = this.originalFlipV;
                    }
                } else {
                    this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            if (!this.bChart) {
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            } else {
                this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 4:
            case 5:
            if (this.translatetNumberHandle === 4) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                if (!this.bChart) {
                    this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                    if (_real_width < 0) {
                        this.resizedflipH = !this.originalFlipH;
                    } else {
                        this.resizedflipH = this.originalFlipH;
                    }
                } else {
                    this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            if (!this.bChart) {
                this.resizedExtY = (_abs_height >= MIN_SHAPE_SIZE) || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            } else {
                this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 6:
            case 7:
            if (this.translatetNumberHandle === 6) {
                _real_height = this.usedExtY * kd1;
                _abs_height = Math.abs(_real_height);
                if (!this.bChart) {
                    this.resizedExtY = (_abs_height >= MIN_SHAPE_SIZE) || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                    if (_real_height < 0) {
                        this.resizedflipV = !this.originalFlipV;
                    } else {
                        this.resizedflipV = this.originalFlipV;
                    }
                } else {
                    this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_width = this.usedExtX * kd2;
            _abs_width = Math.abs(_real_width);
            if (!this.bChart) {
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            } else {
                this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        }
        this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if (this.originalShape.mainGroup !== null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.originalShape.mainGroup.getTransform());
        }
        if (this.textMatrix != null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.textMatrix);
        }
    };
    this.resizeRelativeCenter = function (kd1, kd2, shiftKey) {
        kd1 = 2 * kd1 - 1;
        kd2 = 2 * kd2 - 1;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        var _temp;
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        if (this.mod === 0 || this.mod === 1) {
            if (this.mod === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                if (!this.bChart) {
                    this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                    this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
                } else {
                    this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                }
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            if (!this.bChart) {
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            } else {
                this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
            }
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                if (!this.bChart) {
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                    this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
                } else {
                    this.resizedExtY = _real_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            if (!this.bChart) {
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                this.resizedExtX = _real_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
            }
        }
        this.resizedPosX = this.centerPointX - this.resizedExtX * 0.5;
        this.resizedPosY = this.centerPointY - this.resizedExtY * 0.5;
        this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if (this.originalShape.mainGroup !== null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.originalShape.mainGroup.getTransform());
        }
        if (this.textMatrix != null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.textMatrix);
        }
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        this.objectForOverlay.updateTransform(this.resizedExtX, this.resizedExtY, this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.getBoundsRect = function () {
        var t = this.transformMatrix;
        var max_x, min_x, max_y, min_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var arr = [{
            x: this.resizedExtX,
            y: 0
        },
        {
            x: this.resizedExtX,
            y: this.resizedExtY
        },
        {
            x: 0,
            y: this.resizedExtY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.endTrack = function () {
        var _b_group = this.originalShape.group !== null;
        var _old_abs_xc;
        var _old_abs_yc;
        var _b_change_flip_h;
        var _b_change_flip_v;
        var _old_relative_xc;
        var _old_relative_yc;
        if (_b_group) {
            _b_change_flip_h = this.originalShape.absFlipH !== this.resizedflipH;
            _b_change_flip_v = this.originalShape.absFlipV !== this.resizedflipV;
        }
        this.boolChangePos = this.originalShape.absOffsetX !== this.resizedPosX || this.originalShape.absOffsetY !== this.resizedPosY;
        if (this.originalShape.group == null) {
            this.originalShape.setSizes(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, this.resizedflipH, this.resizedflipV);
            if (this.originalShape.parent.wrappingPolygon.edited) {
                var kW = this.resizedExtX / this.originalExtX;
                var kH = this.resizedExtY / this.originalExtY;
                this.originalShape.parent.wrappingPolygon.updateSizes(kW, kH);
            }
        } else {
            this.originalShape.setAbsoluteTransform(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, null, this.resizedflipH, this.resizedflipV);
            this.originalShape.calculateAfterResize();
            if (_b_group) {
                var _invert_group_transform = global_MatrixTransformer.Invert(this.originalShape.group.transform);
                var _shape_transform = this.originalShape.transform;
                var _global_xc = _shape_transform.TransformPointX(this.originalShape.absExtX * 0.5, this.originalShape.absExtY * 0.5);
                var _global_yc = _shape_transform.TransformPointY(this.originalShape.absExtX * 0.5, this.originalShape.absExtY * 0.5);
                var _xc_rel_group = _invert_group_transform.TransformPointX(_global_xc, _global_yc);
                var _yc_rel_group = _invert_group_transform.TransformPointY(_global_xc, _global_yc);
                var _rel_pos_x = _xc_rel_group - this.originalShape.absExtX * 0.5;
                var _rel_pos_y = _yc_rel_group - this.originalShape.absExtY * 0.5;
                var _new_rel_flip_h;
                var _new_rel_flip_v;
                if (_b_change_flip_h) {
                    _new_rel_flip_h = !this.originalShape.spPr.xfrm.flipH;
                } else {
                    _new_rel_flip_h = null;
                }
                if (_b_change_flip_v) {
                    _new_rel_flip_v = !this.originalShape.spPr.xfrm.flipV;
                } else {
                    _new_rel_flip_v = null;
                }
                this.originalShape.setXfrm(_rel_pos_x, _rel_pos_y, this.resizedExtX, this.resizedExtY, null, _new_rel_flip_h, _new_rel_flip_v);
            } else {
                if (this.originalShape.parent.wrappingPolygon.edited) {
                    var kW = this.resizedExtX / this.originalExtX;
                    var kH = this.resizedExtY / this.originalExtY;
                    var arr_points = this.originalShape.parent.wrappingPolygon.relativeArrPoints;
                    for (var point_index = 0; point_index < arr_points.length; ++point_index) {
                        arr_points[point_index].x *= kW;
                        arr_points[point_index].y *= kH;
                    }
                    this.originalShape.parent.wrappingPolygon.calculateRelToAbs(this.originalShape.parent.getTransformMatrix());
                }
            }
        }
        if (this.originalShape.isImage() && isRealObject(this.originalShape.chart)) {
            var or_shp = this.originalShape;
            or_shp.chart.width = or_shp.drawingDocument.GetDotsPerMM(this.resizedExtX);
            or_shp.chart.height = or_shp.drawingDocument.GetDotsPerMM(this.resizedExtY);
            var chartRender = new ChartRender();
            var chartBase64 = chartRender.insertChart(or_shp.chart, null, or_shp.chart.width, or_shp.chart.height);
            or_shp.chart.img = chartBase64;
            or_shp.setRasterImage(or_shp.chart.img);
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(or_shp.chart.img);
        }
    };
}
function NewTrackShape(originalShape, startPosX, startPosY, lineFlag, pageShapes, pageIndex) {
    this.originalShape = originalShape;
    this.pageIndex = pageIndex;
    this.propCoefficient = originalShape.spPr.geometry === null ? 1 : (typeof SHAPE_ASPECTS[originalShape.spPr.geometry.preset] === "number" ? SHAPE_ASPECTS[originalShape.spPr.geometry.preset] : 1);
    this.invPropCoefficient = 1 / this.propCoefficient;
    this.lineFlag = lineFlag;
    this.canZeroDimention = this.originalShape.canZeroDimension();
    this.canFlip = this.originalShape.canFlipAtAddTrack();
    this.pageShapes = pageShapes;
    this.transformMatrix = originalShape.transform.CreateDublicate();
    this.geometry = originalShape.spPr.geometry;
    this.posX = originalShape.absOffsetX;
    this.posY = originalShape.absOffsetY;
    this.extX = originalShape.absExtX;
    this.extY = originalShape.absExtY;
    this.flipH = originalShape.absFlipH;
    this.flipV = originalShape.absFlipV;
    this.startPosX = startPosX;
    this.startPosY = startPosY;
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.extX, this.extY, this.originalShape.brush, this.originalShape.pen, this.transformMatrix);
    this.modify = function (x, y, ctrlKey, shiftKey) {
        var _finished_x = x,
        _finished_y = y;
        var _real_dist_x = _finished_x - this.startPosX;
        var _abs_dist_x = Math.abs(_real_dist_x);
        var _real_dist_y = _finished_y - this.startPosY;
        var _abs_dist_y = Math.abs(_real_dist_y);
        if ((!ctrlKey && !shiftKey) || (this.lineFlag && !shiftKey)) {
            if (_real_dist_x >= 0) {
                this.posX = this.startPosX;
                this.flipH = false;
            } else {
                this.posX = _abs_dist_x >= MIN_SHAPE_SIZE || this.lineFlag ? x : this.startPosX - MIN_SHAPE_SIZE;
                if (this.lineFlag) {
                    this.flipH = true;
                }
            }
            if (_real_dist_y >= 0) {
                this.posY = this.startPosY;
                this.flipV = false;
            } else {
                this.posY = _abs_dist_y >= MIN_SHAPE_SIZE || this.lineFlag ? y : this.startPosY - MIN_SHAPE_SIZE;
                if (this.lineFlag) {
                    this.flipV = true;
                }
            }
            this.extX = _abs_dist_x >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_dist_x : MIN_SHAPE_SIZE;
            this.extY = _abs_dist_y >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_dist_y : MIN_SHAPE_SIZE;
            this.geometry.Recalculate(this.extX, this.extY);
        } else {
            if (ctrlKey && !shiftKey) {
                if (_abs_dist_x >= MIN_SHAPE_SIZE_DIV2) {
                    this.posX = this.startPosX - _abs_dist_x;
                    this.extX = 2 * _abs_dist_x;
                } else {
                    this.posX = this.startPosX - MIN_SHAPE_SIZE_DIV2;
                    this.extX = MIN_SHAPE_SIZE;
                }
                if (_abs_dist_y >= MIN_SHAPE_SIZE_DIV2) {
                    this.posY = this.startPosY - _abs_dist_y;
                    this.extY = 2 * _abs_dist_y;
                } else {
                    this.posY = this.startPosY - MIN_SHAPE_SIZE_DIV2;
                    this.extY = MIN_SHAPE_SIZE;
                }
                this.geometry.Recalculate(this.extX, this.extY);
            } else {
                if (!ctrlKey && shiftKey) {
                    var _new_aspect;
                    var _new_width, _new_height;
                    if (this.lineFlag) {} else {
                        _new_aspect = _abs_dist_x / _abs_dist_y;
                        if (_new_aspect >= this.propCoefficient) {
                            _new_width = _abs_dist_x;
                            _new_height = _abs_dist_x * this.invPropCoefficient;
                        } else {
                            _new_height = _real_dist_y;
                            _new_width = _real_dist_y * this.propCoefficient;
                        }
                        this.extX = _new_width;
                        this.extY = _new_height;
                        if (_real_dist_x >= 0) {
                            this.posX = this.startPosX;
                        } else {
                            this.posX = this.startPosX - this.extX;
                        }
                        if (_real_dist_y >= 0) {
                            this.posY = this.startPosY;
                        } else {
                            this.posY = this.startPosY - this.extY;
                        }
                    }
                    this.geometry.Recalculate(this.extX, this.extY);
                } else {
                    if (ctrlKey && shiftKey) {}
                }
            }
        }
        this.calculateTransform();
    };
    this.calculateTransform = function () {
        var _new_transform = this.transformMatrix;
        _new_transform.Reset();
        if (this.flipH || this.flipV) {
            var _horizontal_center = this.extX * 0.5;
            var _vertical_center = this.extY * 0.5;
            _new_transform.Translate(-_horizontal_center, -_vertical_center, MATRIX_ORDER_APPEND);
            if (this.flipH) {
                _new_transform.Translate(-1, 1, MATRIX_ORDER_APPEND);
            }
            if (this.flipV) {
                _new_transform.Translate(1, -1, MATRIX_ORDER_APPEND);
            }
            _new_transform.Translate(_horizontal_center, _vertical_center, MATRIX_ORDER_APPEND);
        }
        _new_transform.Translate(this.posX, this.posY, MATRIX_ORDER_APPEND);
        this.transformMatrix = _new_transform;
    };
    this.endTrack = function () {
        this.originalShape.Track_End(this.pageIndex, this.posX, this.posY, this.extX, this.extY);
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        this.objectForOverlay.updateTransform(this.extX, this.extY, this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
        overlay.reset();
    };
}
function RotateTrackShape(originalShape, pageIndex) {
    this.originalShape = originalShape;
    this.pageIndex = pageIndex;
    this.pen = this.originalShape.pen;
    this.brush = this.originalShape.brush;
    this.originalRot = this.originalShape.absRot;
    this.rot = this.originalShape.absRot;
    this.transformMatrix = this.originalShape.transform.CreateDublicate();
    this.objectForOverlay = new ObjectForShapeDrawer(this.originalShape.spPr.geometry, this.originalShape.absExtX, this.originalShape.absExtY, this.brush, this.pen, this.transformMatrix);
    this.textMatrix = null;
    if (isRealObject(this.originalShape.parent)) {
        if (this.originalShape.parent.Is_Inline()) {
            if (this.originalShape.parent.DocumentContent instanceof CDocumentContent) {
                var cur_doc_content = this.originalShape.parent.DocumentContent;
                while (cur_doc_content.Is_TableCellContent()) {
                    cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                }
                if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                    this.textMatrix = cur_doc_content.Parent.transformText;
                }
            }
        }
    }
    this.track = function (angle, shiftKey) {
        var _new_rot = angle + this.originalRot;
        while (_new_rot < 0) {
            _new_rot += 2 * Math.PI;
        }
        while (_new_rot >= 2 * Math.PI) {
            _new_rot -= 2 * Math.PI;
        }
        if (_new_rot < MIN_ANGLE || _new_rot > 2 * Math.PI - MIN_ANGLE) {
            _new_rot = 0;
        }
        if (Math.abs(_new_rot - Math.PI * 0.5) < MIN_ANGLE) {
            _new_rot = Math.PI * 0.5;
        }
        if (Math.abs(_new_rot - Math.PI) < MIN_ANGLE) {
            _new_rot = Math.PI;
        }
        if (Math.abs(_new_rot - 1.5 * Math.PI) < MIN_ANGLE) {
            _new_rot = 1.5 * Math.PI;
        }
        if (shiftKey) {
            _new_rot = (Math.PI / 12) * Math.floor(12 * _new_rot / (Math.PI));
        }
        this.rot = _new_rot;
        this.calculateTransformMatrix();
    };
    this.calculateTransformMatrix = function () {
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.originalShape.absExtX * 0.5;
        var _vertical_center = this.originalShape.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.originalShape.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.originalShape.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(_transform, this.originalShape.absOffsetX, this.originalShape.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if (this.originalShape.mainGroup !== null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.originalShape.mainGroup.getTransform());
        }
        if (this.textMatrix != null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.textMatrix);
        }
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.getBoundsRect = function () {
        var t = this.transformMatrix;
        var min_x, max_x, min_y, max_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var or_sp = this.originalShape;
        var arr = [{
            x: or_sp.absExtX,
            y: 0
        },
        {
            x: or_sp.absExtX,
            y: or_sp.absExtY
        },
        {
            x: 0,
            y: or_sp.absExtY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.originalShape.spPr.geometry);
        overlay.reset();
    };
    this.trackEnd = function () {
        if (this.originalShape.absRot !== this.rot) {
            this.originalShape.setXfrm(null, null, null, null, this.rot, null, null);
            this.originalShape.setAbsoluteTransform(null, null, null, null, this.rot, null, null);
            this.originalShape.recalculate();
        }
        this.boolChangePos = true;
    };
}
function ShapeForDrawOnOverlayInGroup(originalShape) {
    this.originalShape = originalShape;
    var _transform = new CMatrix();
    var _horizontal_center = originalShape.absExtX * 0.5;
    var _vertical_center = originalShape.absExtY * 0.5;
    global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
    if (this.originalShape.absFlipH) {
        global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
    }
    if (this.originalShape.absFlipV) {
        global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
    }
    global_MatrixTransformer.RotateRadAppend(_transform, -originalShape.absRot);
    global_MatrixTransformer.TranslateAppend(_transform, originalShape.absOffsetX, originalShape.absOffsetY);
    global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
    this.localTransform = _transform;
    this.fullTransform = new CMatrix();
    this.pageIndex = originalShape.pageIndex;
    this.objectForOverlay = new ObjectForShapeDrawer(originalShape.spPr.geometry, originalShape.absExtX, originalShape.absExtY, originalShape.brush, originalShape.pen, this.fullTransform);
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.fullTransform);
        this.objectForOverlay.updateTransform(this.originalShape.absExtX, this.originalShape.absExtY, this.fullTransform);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.originalShape.spPr.geometry);
        overlay.reset();
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.calculateFullTransform = function (parentTransform) {
        this.fullTransform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(this.fullTransform, parentTransform);
    };
}
function ShapeForTrackInResizeGroup(originalShape) {
    this.pageIndex = originalShape.pageIndex;
    this.originalShape = originalShape;
    this.originalOffsetX = originalShape.absOffsetX;
    this.originalOffsetY = originalShape.absOffsetY;
    this.originalExtX = originalShape.absExtX;
    this.originalExtY = originalShape.absExtY;
    this.originalRot = originalShape.absRot;
    this.originalFlipH = originalShape.absFlipH;
    this.originalFlipV = originalShape.absFlipV;
    this.originalHalfHeight = this.originalExtY * 0.5;
    this.originalHalfWidht = this.originalExtX * 0.5;
    this.originalCenterPositionX = this.originalOffsetX + this.originalHalfWidht;
    this.originalCenterPositionY = this.originalOffsetY + this.originalHalfHeight;
    this.originalGroupHalfHeight = originalShape.mainGroup.absExtY * 0.5;
    this.originalGroupHalfWidth = originalShape.mainGroup.absExtX * 0.5;
    this.centerDistX = this.originalCenterPositionX - this.originalGroupHalfWidth;
    this.centerDistY = this.originalCenterPositionY - this.originalGroupHalfHeight;
    this.resizedOffsetX = originalShape.absOffsetX;
    this.resizedOffsetY = originalShape.absOffsetY;
    this.resizedExtX = originalShape.absExtX;
    this.resizedExtY = originalShape.absExtY;
    this.resizedRot = originalShape.absRot;
    this.resizedFlipH = originalShape.absFlipH;
    this.resizedFlipV = originalShape.absFlipV;
    this.transformMatrix = originalShape.transform.CreateDublicate();
    this.bSwapCoef = !(this.originalRot < Math.PI * 0.25 || this.originalRot > Math.PI * 1.75 || (this.originalRot > Math.PI * 0.75 && this.originalRot < Math.PI * 1.25));
    this.geometry = originalShape.spPr.geometry !== null ? originalShape.spPr.geometry.createDuplicate() : null;
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.resizedExtX, this.resizedExtY, this.originalShape.brush, this.originalShape.pen, this.transformMatrix);
    this.changeSizes = function (kw, kh, newHalfWidth, newHalfHeight) {
        var _sw_kw = kw;
        var _sw_kh = kh;
        if (this.bSwapCoef) {
            _sw_kw = kh;
            _sw_kh = kw;
        }
        this.resizedExtX = this.originalExtX * _sw_kw;
        this.resizedExtY = this.originalExtY * _sw_kh;
        this.resizedOffsetX = this.centerDistX * kw + newHalfWidth - this.resizedExtX * 0.5;
        this.resizedOffsetY = this.centerDistY * kh + newHalfHeight - this.resizedExtY * 0.5;
        if (this.geometry !== null) {
            this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        }
    };
    this.calculateTransformMatrix = function (parentTransform) {
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedOffsetX, this.resizedOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, parentTransform);
        this.transformMatrix = _transform;
    };
    this.draw = function (overlay) {
        overlay.transform3(this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
        overlay.reset();
    };
    this.endTrack = function () {
        this.originalShape.setSizesInGroup(this.resizedOffsetX, this.resizedOffsetY, this.resizedExtX, this.resizedExtY);
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
}
function ShapeTrackForMoveInGroup(originalShape, majorOffsetX, majorOffsetY) {
    this.originalShape = originalShape;
    this.originalOffsetX = originalShape.absOffsetX;
    this.originalOffsetY = originalShape.absOffsetY;
    this.originalExtX = originalShape.absExtX;
    this.originalExtY = originalShape.absExtY;
    this.originalHorC = this.originalExtX * 0.5;
    this.originalVerC = this.originalExtY * 0.5;
    this.originalRot = originalShape.absRot;
    this.originalFlipH = originalShape.absFlipH;
    this.originalFlipV = originalShape.absFlipV;
    this.resizedPosX = originalShape.absOffsetX;
    this.resizedPosY = originalShape.absOffsetY;
    this.geometry = originalShape.spPr.geometry;
    this.pen = originalShape.pen;
    this.brush = originalShape.brush;
    this.majorOffsetX = majorOffsetX;
    this.majorOffsetY = majorOffsetY;
    this.parentTransform = originalShape.mainGroup.transform;
    this.fullTransform = originalShape.transform.CreateDublicate();
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.originalExtX, this.originalExtY, this.brush, this.pen, this.fullTransform);
    this.track = function (posX, posY) {
        this.resizedPosX = posX + this.majorOffsetX;
        this.resizedPosY = posY + this.majorOffsetY;
        this.calculateTransform();
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.calculateTransform = function () {
        var _transform = this.fullTransform;
        _transform.Reset();
        var _horizontal_center = this.originalHorC;
        var _vertical_center = this.originalVerC;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.originalFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.originalFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.originalRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, this.parentTransform);
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.originalShape.pageIndex);
        overlay.transform3(this.fullTransform);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
        overlay.reset();
    };
    this.trackEnd = function () {
        this.originalShape.setAbsoluteTransform(this.resizedPosX, this.resizedPosY, null, null, null, null, null);
        this.originalShape.calculateTransformMatrix();
        this.originalShape.calculateTransformTextMatrix();
        var _invert_group_transform = global_MatrixTransformer.Invert(this.originalShape.group.transform);
        var _shape_transform = this.originalShape.transform;
        var _global_xc = _shape_transform.TransformPointX(this.originalShape.absExtX * 0.5, this.originalShape.absExtY * 0.5);
        var _global_yc = _shape_transform.TransformPointY(this.originalShape.absExtX * 0.5, this.originalShape.absExtY * 0.5);
        var _xc_rel_group = _invert_group_transform.TransformPointX(_global_xc, _global_yc);
        var _yc_rel_group = _invert_group_transform.TransformPointY(_global_xc, _global_yc);
        var _rel_pos_x = _xc_rel_group - this.originalShape.absExtX * 0.5;
        var _rel_pos_y = _yc_rel_group - this.originalShape.absExtY * 0.5;
        this.originalShape.setXfrm(_rel_pos_x, _rel_pos_y, null, null, null, null, null);
    };
}
function ShapeForResizeInGroup2(originalShape, numberHandle) {
    this.shape = originalShape;
    this.pageIndex = originalShape.pageIndex;
    this.originalShape = this.shape;
    var xfrm = originalShape.spPr.xfrm;
    this.flipH = xfrm.flipH == null ? false : xfrm.flipH;
    this.flipV = xfrm.flipV == null ? false : xfrm.flipV;
    var _flip_h = this.flipH;
    var _flip_v = this.flipV;
    var _half_height = xfrm.extY * 0.5;
    var _half_width = xfrm.extX * 0.5;
    var rot = xfrm.rot == null ? 0 : xfrm.rot;
    var _sin = Math.sin(rot);
    var _cos = Math.cos(rot);
    var _translated_num_handle;
    if (!_flip_h && !_flip_v) {
        _translated_num_handle = numberHandle;
    } else {
        if (_flip_h && !_flip_v) {
            _translated_num_handle = TRANSLATE_HANDLE_FLIP_H[numberHandle];
        } else {
            if (!_flip_h && _flip_v) {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_V[numberHandle];
            } else {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[numberHandle];
            }
        }
    }
    this.bAspect = numberHandle % 2 === 0;
    this.aspect = this.bAspect === true ? this.originalShape.getAspect(_translated_num_handle) : 0;
    this.sin = _sin;
    this.cos = _cos;
    this.translatetNumberHandle = _translated_num_handle;
    switch (_translated_num_handle) {
    case 0:
        case 1:
        this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + xfrm.offX;
        this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + xfrm.offY;
        break;
    case 2:
        case 3:
        this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + xfrm.offX;
        this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + xfrm.offY;
        break;
    case 4:
        case 5:
        this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + xfrm.offX;
        this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + xfrm.offY;
        break;
    case 6:
        case 7:
        this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + xfrm.offX;
        this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + xfrm.offY;
        break;
    }
    this.mod = this.translatetNumberHandle % 4;
    this.centerPointX = xfrm.offX + _half_width;
    this.centerPointY = xfrm.offY + _half_height;
    this.lineFlag = originalShape.checkLine();
    this.originalExtX = xfrm.extX;
    this.originalExtY = xfrm.extY;
    this.originalFlipH = _flip_h;
    this.originalFlipV = _flip_v;
    this.usedExtX = this.originalExtX === 0 ? (0.01) : this.originalExtX;
    this.usedExtY = this.originalExtY === 0 ? (0.01) : this.originalExtY;
    this.resizedExtX = this.originalExtX;
    this.resizedExtY = this.originalExtY;
    this.resizedflipH = _flip_h;
    this.resizedflipV = _flip_v;
    this.resizedPosX = xfrm.offX;
    this.resizedPosY = xfrm.offY;
    this.resizedRot = rot;
    this.transformMatrix = originalShape.transform.CreateDublicate();
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    var pen, brush;
    if (originalShape instanceof CChartAsGroup) {
        brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color = new CUniColor();
        brush.fill.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        brush.fill.color.color = new CRGBColor();
        brush.fill.color.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        pen = new CLn();
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color = new CUniColor();
        pen.Fill.fill.color.color = new CRGBColor();
        this.pen = pen;
        this.brush = brush;
    } else {
        this.pen = originalShape.pen;
        this.brush = originalShape.brush;
    }
    this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.resizedExtX, this.resizedExtY, this.brush, this.pen, this.transformMatrix);
    this.resize = function (kd1, kd2, shiftKey) {
        var _cos = this.cos;
        var _sin = this.sin;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        var _new_resize_half_width;
        var _new_resize_half_height;
        var _new_used_half_width;
        var _new_used_half_height;
        var _temp;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        switch (this.translatetNumberHandle) {
        case 0:
            case 1:
            if (this.translatetNumberHandle === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            }
            if (this.translatetNumberHandle === 1) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            if (_real_height < 0) {
                this.resizedflipV = !this.originalFlipV;
            } else {
                this.resizedflipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 2:
            case 3:
            if (this.translatetNumberHandle === 2) {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            if (_real_width < 0) {
                this.resizedflipH = !this.originalFlipH;
            } else {
                this.resizedflipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 4:
            case 5:
            if (this.translatetNumberHandle === 4) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            if (_real_height < 0) {
                this.resizedflipV = !this.originalFlipV;
            } else {
                this.resizedflipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 6:
            case 7:
            if (this.translatetNumberHandle === 6) {
                _real_height = this.usedExtY * kd1;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_width = this.usedExtX * kd2;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            if (_real_width < 0) {
                this.resizedflipH = !this.originalFlipH;
            } else {
                this.resizedflipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        }
        this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, this.originalShape.group.getTransform());
    };
    this.resizeRelativeCenter = function (kd1, kd2, shiftKey) {
        kd1 = 2 * kd1 - 1;
        kd2 = 2 * kd2 - 1;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        var _temp;
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        if (this.mod === 0 || this.mod === 1) {
            if (this.mod === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
        }
        this.resizedPosX = this.centerPointX - this.resizedExtX * 0.5;
        this.resizedPosY = this.centerPointY - this.resizedExtY * 0.5;
        this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, this.originalShape.group.getTransform());
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        this.objectForOverlay.updateTransform(this.resizedExtX, this.resizedExtY, this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.getBoundsRect = function () {
        var t = this.transformMatrix;
        var max_x, min_x, max_y, min_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var arr = [{
            x: this.resizedExtX,
            y: 0
        },
        {
            x: this.resizedExtX,
            y: this.resizedExtY
        },
        {
            x: 0,
            y: this.resizedExtY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.endTrack = function () {
        this.originalShape.setXfrm(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, null, this.resizedflipH, this.resizedflipV);
        this.originalShape.setAbsoluteTransform(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, null, this.resizedflipH, this.resizedflipV);
        if (this.originalShape.spPr.geometry) {
            this.originalShape.spPr.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
        }
    };
}
function ShapeForRotateInGroup(originalShape) {
    this.original = originalShape;
    var xfrm = this.original.spPr.xfrm;
    this.pageIndex = this.original.pageIndex;
    this.pen = this.original.pen;
    this.brush = this.original.brush;
    this.originalRot = xfrm.rot == null ? 0 : xfrm.rot;
    this.rot = xfrm.rot == null ? 0 : xfrm.rot;
    this.transformMatrix = this.original.transform.CreateDublicate();
    this.objectForOverlay = new ObjectForShapeDrawer(this.original.spPr.geometry, xfrm.extX, xfrm.extY, this.brush, this.pen, this.transformMatrix);
    this.track = function (angle, shiftKey) {
        var _new_rot = angle + this.originalRot;
        while (_new_rot < 0) {
            _new_rot += 2 * Math.PI;
        }
        while (_new_rot >= 2 * Math.PI) {
            _new_rot -= 2 * Math.PI;
        }
        if (_new_rot < MIN_ANGLE || _new_rot > 2 * Math.PI - MIN_ANGLE) {
            _new_rot = 0;
        }
        if (Math.abs(_new_rot - Math.PI * 0.5) < MIN_ANGLE) {
            _new_rot = Math.PI * 0.5;
        }
        if (Math.abs(_new_rot - Math.PI) < MIN_ANGLE) {
            _new_rot = Math.PI;
        }
        if (Math.abs(_new_rot - 1.5 * Math.PI) < MIN_ANGLE) {
            _new_rot = 1.5 * Math.PI;
        }
        if (shiftKey) {
            _new_rot = (Math.PI / 12) * Math.floor(12 * _new_rot / (Math.PI));
        }
        this.rot = _new_rot;
        this.calculateTransformMatrix();
    };
    this.calculateTransformMatrix = function () {
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.original.absExtX * 0.5;
        var _vertical_center = this.original.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.original.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.original.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(_transform, this.original.absOffsetX, this.original.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, this.original.group.getTransform());
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.getBoundsRect = function () {
        var t = this.transformMatrix;
        var min_x, max_x, min_y, max_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var or_sp = this.originalShape;
        var arr = [{
            x: or_sp.absExtX,
            y: 0
        },
        {
            x: or_sp.absExtX,
            y: or_sp.absExtY
        },
        {
            x: 0,
            y: or_sp.absExtY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.original.spPr.geometry);
        shape_drawer.draw(this.original.spPr.geometry);
        overlay.reset();
    };
    this.trackEnd = function () {
        this.original.setXfrm(null, null, null, null, this.rot, null, null);
        this.original.setAbsoluteTransform(null, null, null, null, this.rot, null, null);
    };
}